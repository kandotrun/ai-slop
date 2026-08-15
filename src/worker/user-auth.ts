export interface UserSessionUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

export interface UserSessionData {
  user: UserSessionUser;
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date | string;
    createdAt: Date | string;
    updatedAt: Date | string;
  };
}

interface EmailOtpChallengeRow {
  id: string;
  email: string;
  code_hash: string;
  attempts: number;
  expires_at: string;
  consumed_at: string | null;
  created_at: string;
}

interface EmailOtpAttemptTotalRow {
  total: number | null;
}

interface EmailOtpActiveCountRow {
  total: number | null;
}

interface EmailOtpLatestRow {
  created_at: string | null;
}

interface UserRow {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  email_verified?: number | boolean | null;
  created_at: string;
  updated_at: string;
}

interface SessionJoinRow {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

interface EmailSender {
  send(message: { to: string; from: string | { email: string; name: string }; subject: string; text?: string; html?: string }): Promise<{ messageId?: string }>;
}

type UserAuthEnv = Env & { EMAIL?: EmailSender };

const SESSION_COOKIE = "giga_site_session";
const CODE_TTL_SECONDS = 10 * 60;
const MAX_ATTEMPTS = 5;
const REQUEST_COOLDOWN_SECONDS = 60;
const MAX_ACTIVE_CHALLENGES = 3;
const textEncoder = new TextEncoder();

function nowIso(): string {
  return new Date().toISOString();
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function randomSecret(bytes = 32): string {
  return bytesToBase64Url(crypto.getRandomValues(new Uint8Array(bytes)));
}

function randomSixDigitCode(): string {
  const max = Math.floor(0x1_0000_0000 / 1_000_000) * 1_000_000;
  const bytes = new Uint8Array(4);
  for (;;) {
    crypto.getRandomValues(bytes);
    const value = new DataView(bytes.buffer).getUint32(0);
    if (value < max) {
      return String(value % 1_000_000).padStart(6, "0");
    }
  }
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left: string, right: string): boolean {
  const leftBytes = textEncoder.encode(left);
  const rightBytes = textEncoder.encode(right);
  if (leftBytes.length !== rightBytes.length) return false;
  let diff = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    diff |= leftBytes[index] ^ rightBytes[index];
  }
  return diff === 0;
}

export function normalizeLoginEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return null;
  return email;
}

function cookieValue(request: Request, name: string): string | null {
  const cookie = request.headers.get("Cookie") ?? "";
  for (const part of cookie.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (rawName === name) return rawValue.join("=");
  }
  return null;
}

function sessionCookie(request: Request, token: string, maxAge: number): string {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}

function emailFrom(env: Env): string {
  return env.EMAIL_FROM || `no-reply@${env.APP_HOST}`;
}

function codeEmailText(code: string): string {
  return [
    "ギガサイト便のログイン用ワンタイムコードです。",
    "",
    `コード: ${code}`,
    "",
    "このコードは10分で期限切れになります。心当たりがない場合は、このメールを破棄してください。"
  ].join("\n");
}

function codeEmailHtml(code: string): string {
  return `<p>ギガサイト便のログイン用ワンタイムコードです。</p><p style="font-size:28px;font-weight:700;letter-spacing:0.18em">${code}</p><p>このコードは10分で期限切れになります。心当たりがない場合は、このメールを破棄してください。</p>`;
}

export async function requestUserLoginCode(env: UserAuthEnv, rawEmail: unknown): Promise<{ ok: true; challengeId: string; expiresAt: string; email: string } | { ok: false; error: string; status: number }> {
  const email = normalizeLoginEmail(rawEmail);
  if (!email) return { ok: false, error: "invalid_email", status: 400 };
  if (!env.EMAIL) return { ok: false, error: "email_not_configured", status: 503 };

  const now = Date.now();
  const nowText = new Date(now).toISOString();
  const code = randomSixDigitCode();
  const challengeId = crypto.randomUUID();
  const expiresAt = new Date(now + CODE_TTL_SECONDS * 1000).toISOString();
  const createdAt = nowText;
  const codeHash = await sha256Hex(`${challengeId}:${email}:${code}`);

  const created = await env.DB.prepare(
    `INSERT INTO app_email_otp_challenges (id, email, code_hash, attempts, expires_at, consumed_at, created_at)
     SELECT ?, ?, ?, 0, ?, NULL, ?
     WHERE NOT EXISTS (
       SELECT 1 FROM app_email_otp_challenges WHERE email = ? AND created_at > ?
     )
     AND (
       SELECT COUNT(*) FROM app_email_otp_challenges WHERE email = ? AND consumed_at IS NULL AND expires_at > ?
     ) < ?`
  )
    .bind(
      challengeId,
      email,
      codeHash,
      expiresAt,
      createdAt,
      email,
      new Date(now - REQUEST_COOLDOWN_SECONDS * 1000).toISOString(),
      email,
      nowText,
      MAX_ACTIVE_CHALLENGES
    )
    .run();
  if (created.meta.changes === 0) {
    const active = await env.DB.prepare(`SELECT COUNT(*) AS total FROM app_email_otp_challenges WHERE email = ? AND consumed_at IS NULL AND expires_at > ?`)
      .bind(email, nowText)
      .first<EmailOtpActiveCountRow>();
    if ((active?.total ?? 0) >= MAX_ACTIVE_CHALLENGES) {
      return { ok: false, error: "too_many_code_requests", status: 429 };
    }
    return { ok: false, error: "code_request_cooldown", status: 429 };
  }

  try {
    await env.EMAIL.send({
      to: email,
      from: emailFrom(env),
      subject: "ギガサイト便のログインコード",
      text: codeEmailText(code),
      html: codeEmailHtml(code)
    });
  } catch (error) {
    console.error("app_email_otp_send_failed", error);
    await env.DB.prepare(`DELETE FROM app_email_otp_challenges WHERE id = ?`).bind(challengeId).run();
    return { ok: false, error: "email_send_failed", status: 502 };
  }

  return { ok: true, challengeId, expiresAt, email };
}

async function getOrCreateUser(env: Env, email: string, now: string): Promise<UserRow> {
  const existing = await env.DB.prepare(`SELECT * FROM users WHERE email = ?`).bind(email).first<UserRow>();
  if (existing) {
    await env.DB.prepare(`UPDATE users SET email_verified = 1, updated_at = ? WHERE id = ?`).bind(now, existing.id).run();
    return { ...existing, email_verified: 1, updated_at: now };
  }
  const id = crypto.randomUUID();
  const name = email.split("@")[0] || email;
  await env.DB.prepare(`INSERT INTO users (id, email, name, email_verified, created_at, updated_at) VALUES (?, ?, ?, 1, ?, ?)`)
    .bind(id, email, name, now, now)
    .run();
  return { id, email, name, image: null, email_verified: 1, created_at: now, updated_at: now };
}

export async function verifyUserLoginCode(env: Env, request: Request, body: { challengeId?: unknown; email?: unknown; code?: unknown }): Promise<{ ok: true; user: UserSessionUser; setCookie: string } | { ok: false; error: string; status: number }> {
  const challengeId = typeof body.challengeId === "string" ? body.challengeId : null;
  const email = normalizeLoginEmail(body.email);
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!challengeId || !email || !/^\d{6}$/.test(code)) {
    return { ok: false, error: "invalid_code_request", status: 400 };
  }

  const challenge = await env.DB.prepare(`SELECT * FROM app_email_otp_challenges WHERE id = ?`).bind(challengeId).first<EmailOtpChallengeRow>();
  if (!challenge || challenge.email !== email) {
    return { ok: false, error: "code_not_found", status: 404 };
  }
  if (challenge.consumed_at) {
    return { ok: false, error: "code_already_used", status: 409 };
  }
  if (new Date(challenge.expires_at).getTime() <= Date.now()) {
    return { ok: false, error: "code_expired", status: 410 };
  }
  if (challenge.attempts >= MAX_ATTEMPTS) {
    return { ok: false, error: "too_many_attempts", status: 429 };
  }

  const expectedHash = await sha256Hex(`${challengeId}:${email}:${code}`);
  const now = nowIso();
  if (!constantTimeEqual(expectedHash, challenge.code_hash)) {
    const incremented = await env.DB.prepare(
      `UPDATE app_email_otp_challenges
       SET attempts = attempts + 1
       WHERE id = ?
         AND email = ?
         AND consumed_at IS NULL
         AND expires_at > ?
         AND attempts < ?
         AND (
           SELECT COALESCE(SUM(attempts), 0) FROM app_email_otp_challenges WHERE email = ? AND consumed_at IS NULL AND expires_at > ?
         ) < ?`
    )
      .bind(challengeId, email, now, MAX_ATTEMPTS, email, now, MAX_ATTEMPTS)
      .run();
    if (incremented.meta.changes === 0) {
      return { ok: false, error: "too_many_attempts", status: 429 };
    }
    return { ok: false, error: "invalid_code", status: 400 };
  }

  const consumed = await env.DB.prepare(
    `UPDATE app_email_otp_challenges
     SET consumed_at = ?
     WHERE id = ?
       AND email = ?
       AND consumed_at IS NULL
       AND expires_at > ?
       AND attempts < ?
       AND (
         SELECT COALESCE(SUM(attempts), 0) FROM app_email_otp_challenges WHERE email = ? AND consumed_at IS NULL AND expires_at > ?
       ) < ?`
  )
    .bind(now, challengeId, email, now, MAX_ATTEMPTS, email, now, MAX_ATTEMPTS)
    .run();
  if (consumed.meta.changes === 0) {
    return { ok: false, error: "too_many_attempts", status: 429 };
  }

  const user = await getOrCreateUser(env, email, now);
  const sessionId = crypto.randomUUID();
  const token = `gus_${sessionId}_${randomSecret()}`;
  const tokenHash = await sha256Hex(token);
  const ttl = Number.parseInt(env.SESSION_TTL_SECONDS || "86400", 10);
  const maxAge = Number.isFinite(ttl) && ttl > 0 ? ttl : 86400;
  const expiresAt = new Date(Date.now() + maxAge * 1000).toISOString();
  await env.DB.prepare(
    `INSERT INTO auth_sessions (id, user_id, token, expires_at, ip_address, user_agent, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(sessionId, user.id, tokenHash, expiresAt, request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for"), request.headers.get("user-agent"), now, now)
    .run();

  return {
    ok: true,
    user: { id: user.id, email: user.email, name: user.name || user.email, image: user.image ?? null },
    setCookie: sessionCookie(request, token, maxAge)
  };
}

export async function getUserSession(env: Env, request: Request): Promise<UserSessionData | null> {
  const token = cookieValue(request, SESSION_COOKIE);
  if (!token) return null;
  const tokenHash = await sha256Hex(token);
  const row = await env.DB.prepare(
    `SELECT sess.*, u.email, u.name, u.image
     FROM auth_sessions sess
     JOIN users u ON u.id = sess.user_id
     WHERE sess.token = ? AND sess.expires_at > ?
     LIMIT 1`
  )
    .bind(tokenHash, nowIso())
    .first<SessionJoinRow>();
  if (!row) return null;
  return {
    user: { id: row.user_id, email: row.email, name: row.name || row.email, image: row.image ?? null },
    session: { id: row.id, userId: row.user_id, token: row.token, expiresAt: row.expires_at, createdAt: row.created_at, updatedAt: row.updated_at }
  };
}

export async function signOutUser(env: Env, request: Request): Promise<void> {
  const token = cookieValue(request, SESSION_COOKIE);
  if (!token) return;
  await env.DB.prepare(`DELETE FROM auth_sessions WHERE token = ?`).bind(await sha256Hex(token)).run();
}
