const CONTACT_CATEGORIES = new Set(["question", "billing", "other"]);
const CONTACT_TO_FALLBACK = "kan@2-38.com";
const CONTACT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const CONTACT_RATE_LIMIT_MAX = 3;
const EMAIL_PATTERN = /^[^\s@]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

interface ContactInput {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  category?: unknown;
  message?: unknown;
  website?: unknown;
  sourcePath?: unknown;
}

interface ContactRateLimitRow {
  total: number;
}

interface NormalizedContact {
  name: string;
  email: string;
  company: string | null;
  category: string;
  message: string;
  sourcePath: string | null;
  honeypot: string | null;
}

export interface ContactSuccess {
  ok: true;
  accepted: true;
  messageId: string | null;
  skipped?: boolean;
}

export interface ContactFailure {
  ok: false;
  status: number;
  error: string;
}

function textField(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\r\n?/g, "\n");
  if (!normalized || normalized.length > maxLength) return null;
  return normalized;
}

function optionalTextField(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\r\n?/g, "\n");
  return normalized && normalized.length <= maxLength ? normalized : null;
}

function headerTextField(value: unknown, maxLength: number): string | null {
  const normalized = textField(value, maxLength);
  if (!normalized || /[\u0000-\u001f\u007f]/.test(normalized)) return null;
  return normalized;
}

function normalizeContactInput(input: ContactInput): { ok: true; contact: NormalizedContact } | ContactFailure {
  const name = headerTextField(input.name, 80);
  const email = textField(input.email, 120)?.toLowerCase() ?? null;
  const message = textField(input.message, 4000);
  const rawCategory = typeof input.category === "string" ? input.category : "question";
  const category = CONTACT_CATEGORIES.has(rawCategory) ? rawCategory : "other";
  if (!name) return { ok: false, status: 400, error: "invalid_name" };
  if (!email || !EMAIL_PATTERN.test(email)) return { ok: false, status: 400, error: "invalid_email" };
  if (!message || message.length < 10) return { ok: false, status: 400, error: "invalid_message" };
  return {
    ok: true,
    contact: {
      name,
      email,
      company: optionalTextField(input.company, 120),
      category,
      message,
      sourcePath: optionalTextField(input.sourcePath, 200),
      honeypot: optionalTextField(input.website, 200)
    }
  };
}

function senderAddress(env: Env): string {
  return env.EMAIL_FROM || `no-reply@${env.APP_HOST}`;
}

function contactTo(env: Env): string {
  return env.CONTACT_TO || CONTACT_TO_FALLBACK;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] ?? char);
}

function categoryLabel(category: string): string {
  if (category === "question") return "サービスへの質問";
  if (category === "billing") return "料金・請求";
  return "その他";
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function requestIp(request: Request): string {
  return request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

async function requestHashes(env: Env, request: Request): Promise<{ ipHash: string; userAgentHash: string | null }> {
  const ip = requestIp(request);
  const userAgent = request.headers.get("user-agent");
  return {
    ipHash: await sha256Hex(`${env.APP_HOST}:contact:${ip}`),
    userAgentHash: userAgent ? await sha256Hex(`${env.APP_HOST}:ua:${userAgent}`) : null
  };
}

function contactText(contact: NormalizedContact, createdAt: string): string {
  return [
    "ギガサイト便に問い合わせが届きました。",
    "",
    `種別: ${categoryLabel(contact.category)}`,
    `お名前: ${contact.name}`,
    `メール: ${contact.email}`,
    `会社名: ${contact.company ?? "未入力"}`,
    `送信元: ${contact.sourcePath ?? "未入力"}`,
    `受信時刻: ${createdAt}`,
    "",
    "--- 相談内容 ---",
    contact.message
  ].join("\n");
}

function contactHtml(contact: NormalizedContact, createdAt: string): string {
  return `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#18181b;line-height:1.65">
    <h1 style="font-size:20px">ギガサイト便に問い合わせが届きました</h1>
    <dl>
      <dt>種別</dt><dd>${escapeHtml(categoryLabel(contact.category))}</dd>
      <dt>お名前</dt><dd>${escapeHtml(contact.name)}</dd>
      <dt>メール</dt><dd>${escapeHtml(contact.email)}</dd>
      <dt>会社名</dt><dd>${escapeHtml(contact.company ?? "未入力")}</dd>
      <dt>送信元</dt><dd>${escapeHtml(contact.sourcePath ?? "未入力")}</dd>
      <dt>受信時刻</dt><dd>${escapeHtml(createdAt)}</dd>
    </dl>
    <h2 style="font-size:16px">相談内容</h2>
    <pre style="white-space:pre-wrap;background:#f4f4f5;padding:16px;border-radius:10px">${escapeHtml(contact.message)}</pre>
  </body></html>`;
}

export async function handleContactSubmission(env: Env, request: Request, input: ContactInput): Promise<ContactSuccess | ContactFailure> {
  if (!env.EMAIL) return { ok: false, status: 503, error: "email_not_configured" };
  const normalized = normalizeContactInput(input);
  if (!normalized.ok) return normalized;
  const contact = normalized.contact;
  if (contact.honeypot) {
    return { ok: true, accepted: true, messageId: null, skipped: true };
  }

  const createdAt = new Date().toISOString();
  const cutoff = new Date(Date.now() - CONTACT_RATE_LIMIT_WINDOW_MS).toISOString();
  const hashes = await requestHashes(env, request);
  const recent = await env.DB.prepare(
    `SELECT COUNT(*) AS total FROM contact_messages WHERE created_at > ? AND (email = ? OR ip_hash = ?)`
  )
    .bind(cutoff, contact.email, hashes.ipHash)
    .first<ContactRateLimitRow>();
  if ((recent?.total ?? 0) >= CONTACT_RATE_LIMIT_MAX) {
    return { ok: false, status: 429, error: "too_many_contact_requests" };
  }

  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO contact_messages (
      id, name, email, company, category, message, source_path, ip_hash, user_agent_hash, status, error, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', NULL, ?)`
  )
    .bind(id, contact.name, contact.email, contact.company, contact.category, contact.message, contact.sourcePath, hashes.ipHash, hashes.userAgentHash, createdAt)
    .run();

  try {
    const result = await env.EMAIL.send({
      to: contactTo(env),
      from: { email: senderAddress(env), name: "ギガサイト便" },
      subject: `【ギガサイト便】${categoryLabel(contact.category)}: ${contact.name}`,
      text: contactText(contact, createdAt),
      html: contactHtml(contact, createdAt)
    });
    await env.DB.prepare(`UPDATE contact_messages SET status = 'sent' WHERE id = ?`).bind(id).run();
    return { ok: true, accepted: true, messageId: result.messageId ?? null };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 300) : "unknown_error";
    console.error("contact_email_send_failed", { id, error: message });
    await env.DB.prepare(`UPDATE contact_messages SET status = 'email_failed', error = ? WHERE id = ?`).bind(message, id).run();
    return { ok: false, status: 502, error: "contact_email_send_failed" };
  }
}
