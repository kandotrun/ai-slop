import { normalizeR2Path } from "../shared/security";
import { isSearchIndexingEnabled, parseAllowedEmailDomains, parseAllowedEmails, type RevisionRow, type SiteRow } from "./db";
import { verifyPassword } from "./auth-hash";
import { extractLocalPreviewSlug, extractPreviewSlugFromHost, previewPathFromLocalRequest } from "./preview-routing";
import {
  formSubmissionsPlanRequiredResponse,
  handleFormSubmissionRequest,
  htmlContainsFormSubmissionOptIn,
  injectFormSubmissionBridge,
  isFormSubmissionPath,
  ownerCanUseFormSubmissions
} from "./form-submissions";
import type { AccessEventType } from "../shared/types";

type PreviewAuthMethod = "password" | "email_domain" | "email_otp";
const PREVIEW_EMAIL_OTP_COOLDOWN_SECONDS = 60;
const REVISION_PREVIEW_TOKEN_TTL_SECONDS = 10 * 60;

interface EmailOtpChallengeRow {
  id: string;
  site_id: string;
  email: string;
  email_domain: string;
  code_hash: string;
  return_to: string;
  attempts: number;
  expires_at: string;
  consumed_at: string | null;
  created_at: string;
}

function htmlResponse(html: string, status = 200, headers?: HeadersInit): Response {
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      ...headers
    }
  });
}

function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get("Cookie");
  if (!header) {
    return null;
  }
  for (const part of header.split(";")) {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (rawKey === name) {
      return rawValue.join("=") || null;
    }
  }
  return null;
}

function buildCookie(name: string, value: string, maxAgeSeconds: number, secure: boolean): string {
  const securePart = secure ? "; Secure" : "";
  return `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${securePart}`;
}

function envNumber(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isExpired(expiresAt: string | null): boolean {
  return Boolean(expiresAt && new Date(expiresAt).getTime() <= Date.now());
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashHeader(value: string | null): Promise<string | null> {
  if (!value) {
    return null;
  }
  return sha256Hex(value);
}

function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}

function generateOtpCode(): string {
  const modulo = 1_000_000;
  const max = Math.floor(0xffffffff / modulo) * modulo;
  const buffer = new Uint32Array(1);
  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= max);
  return String(buffer[0] % modulo).padStart(6, "0");
}

async function hashOtpCode(challengeId: string, siteId: string, email: string, code: string): Promise<string> {
  return sha256Hex(`${challengeId}:${siteId}:${email}:${code}`);
}

function safeReturnTo(value: FormDataEntryValue | null): string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

function senderAddress(env: Env): string {
  return env.EMAIL_FROM || `no-reply@${env.APP_HOST}`;
}

function buildPreviewOrigin(request: Request, env: Env, site: SiteRow): string {
  if (env.PREVIEW_HOST_SUFFIX.startsWith(".")) {
    return `https://${site.slug}${env.PREVIEW_HOST_SUFFIX}`;
  }
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

function isCanonicalPreviewHost(request: Request, env: Env, site: SiteRow): boolean {
  if (!env.PREVIEW_HOST_SUFFIX.startsWith(".")) {
    return true;
  }
  const url = new URL(request.url);
  return extractPreviewSlugFromHost(url.hostname, env.PREVIEW_HOST_SUFFIX) === site.slug;
}

function normalizeEmail(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function domainFromEmail(email: string): string {
  return email.includes("@") ? email.split("@").pop() ?? "" : "";
}

export function isAllowedEmailForDomains(email: string, allowedDomains: string[]): boolean {
  const domain = domainFromEmail(email.toLowerCase());
  return Boolean(domain && allowedDomains.includes(domain));
}

export function isAllowedEmailInList(email: string, allowedEmails: string[]): boolean {
  const normalized = email.trim().toLowerCase();
  return Boolean(normalized && allowedEmails.includes(normalized));
}

function isEmailAuthMode(site: SiteRow): boolean {
  return site.auth_mode === "email_domain" || site.auth_mode === "email_otp";
}

function isEmailAllowedForSite(site: SiteRow, email: string): boolean {
  if (site.auth_mode === "email_otp") {
    return isAllowedEmailInList(email, parseAllowedEmails(site.allowed_emails));
  }
  return isAllowedEmailForDomains(email, parseAllowedEmailDomains(site.allowed_email_domains));
}

async function recordAccessEvent(
  env: Env,
  request: Request,
  siteId: string,
  path: string,
  eventType: AccessEventType,
  email: string | null = null
): Promise<void> {
  const ipHash = await hashHeader(request.headers.get("CF-Connecting-IP") ?? request.headers.get("X-Forwarded-For"));
  const userAgentHash = await hashHeader(request.headers.get("User-Agent"));
  await env.DB.prepare(
    `INSERT INTO access_events (id, site_id, path, event_type, created_at, ip_hash, user_agent_hash, email)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(crypto.randomUUID(), siteId, path, eventType, new Date().toISOString(), ipHash, userAgentHash, email)
    .run();
}

async function findSiteBySlug(env: Env, slug: string): Promise<SiteRow | null> {
  return env.DB.prepare(`SELECT * FROM sites WHERE slug = ? AND deleted_at IS NULL`).bind(slug).first<SiteRow>();
}

const BRANDING_BADGE = `<a href="https://giga-site.com" target="_blank" rel="noopener noreferrer" data-giga-site-badge style="position:fixed;right:14px;bottom:14px;z-index:2147483647;display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:9999px;background:rgba(9,9,11,0.9);color:#fff;font:500 12px/1 ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;text-decoration:none;box-shadow:0 6px 18px rgba(0,0,0,0.2)">Powered by ギガサイト便</a>`;

export function shouldInjectBranding(site: Pick<SiteRow, "hide_branding">, objectPath: string, contentType: string): boolean {
  if (site.hide_branding === 1 || site.hide_branding === true) {
    return false;
  }
  return /^text\/html/i.test(contentType) || objectPath.toLowerCase().endsWith(".html");
}

export function injectBrandingBadge(html: string): string {
  const marker = `<!--giga-site-badge-->${BRANDING_BADGE}`;
  const index = html.toLowerCase().lastIndexOf("</body>");
  if (index === -1) {
    return `${html}${marker}`;
  }
  return `${html.slice(0, index)}${marker}${html.slice(index)}`;
}

interface ReviewAnchor {
  id: string;
  selector: string | null;
  status: string;
  anchorRect: { x: number; y: number; width: number; height: number; viewportWidth: number } | null;
}

function parseReviewRect(value: string | null): ReviewAnchor["anchorRect"] {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    const num = (key: string): number | null => (typeof parsed[key] === "number" && Number.isFinite(parsed[key]) ? (parsed[key] as number) : null);
    const x = num("x");
    const y = num("y");
    const width = num("width");
    const height = num("height");
    if (x === null || y === null || width === null || height === null) return null;
    return { x, y, width, height, viewportWidth: num("viewportWidth") ?? 0 };
  } catch {
    return null;
  }
}

async function loadReviewAnchors(env: Env, siteId: string, revisionId: string): Promise<ReviewAnchor[]> {
  const rows = await env.DB.prepare(
    `SELECT id, selector, anchor_rect_json, status FROM site_revision_comments WHERE site_id = ? AND revision_id = ? ORDER BY created_at ASC LIMIT 500`
  )
    .bind(siteId, revisionId)
    .all<{ id: string; selector: string | null; anchor_rect_json: string | null; status: string | null }>();
  return (rows.results ?? []).map((row) => ({
    id: row.id,
    selector: row.selector ?? null,
    status: row.status ?? "open",
    anchorRect: parseReviewRect(row.anchor_rect_json)
  }));
}

// Vanilla overlay injected ONLY in owner review mode (never for public visitors). It draws
// numbered pins, lets the owner click an element to anchor a comment, and talks to the admin
// parent via postMessage (origin-validated). It never calls the admin API itself.
const REVIEW_OVERLAY_SCRIPT = `(function(){
  var cfg = window.__GIGA_REVIEW__ || {};
  var ADMIN = cfg.adminOrigin || "*";
  var anchors = cfg.anchors || [];
  var addMode = false;
  var layer = document.createElement("div");
  layer.setAttribute("data-giga-review-layer","");
  layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:2147483646";
  function esc(s){ return (window.CSS && CSS.escape) ? CSS.escape(s) : s; }
  function statusColor(s){ return s === "resolved" ? "#16a34a" : s === "in_progress" ? "#d97706" : "#4f46e5"; }
  function post(msg){ try { if (window.parent) window.parent.postMessage(msg, ADMIN); } catch(e){} }
  function rectFor(a){
    if (a.selector){ try { var el = document.querySelector(a.selector); if (el){ var r = el.getBoundingClientRect(); return { left: r.left, top: r.top }; } } catch(e){} }
    if (a.anchorRect){ return { left: a.anchorRect.x - window.scrollX, top: a.anchorRect.y - window.scrollY }; }
    return null;
  }
  function render(){
    layer.innerHTML = "";
    anchors.forEach(function(a, i){
      var pos = rectFor(a); if (!pos) return;
      var pin = document.createElement("button");
      pin.type = "button";
      pin.textContent = String(i + 1);
      pin.style.cssText = "position:absolute;transform:translate(-50%,-110%);pointer-events:auto;min-width:22px;height:22px;padding:0 6px;border-radius:11px;border:2px solid #fff;cursor:pointer;font:700 11px/1 ui-sans-serif,system-ui,sans-serif;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.3);background:" + statusColor(a.status);
      pin.style.left = pos.left + "px";
      pin.style.top = pos.top + "px";
      pin.addEventListener("click", function(ev){ ev.preventDefault(); ev.stopPropagation(); post({ type: "giga-review:focus", id: a.id }); });
      layer.appendChild(pin);
    });
  }
  function cssPath(el){
    if (!el || el.nodeType !== 1) return "";
    var parts = []; var node = el; var depth = 0;
    while (node && node.nodeType === 1 && node.tagName.toLowerCase() !== "html" && depth < 6){
      if (node.id){ parts.unshift("#" + esc(node.id)); break; }
      var tag = node.tagName.toLowerCase();
      var parent = node.parentNode;
      if (parent){
        var same = []; var c = parent.firstElementChild;
        while (c){ if (c.tagName === node.tagName) same.push(c); c = c.nextElementSibling; }
        if (same.length > 1){ tag += ":nth-of-type(" + (same.indexOf(node) + 1) + ")"; }
      }
      parts.unshift(tag);
      node = parent; depth++;
    }
    return parts.join(" > ");
  }
  function onPick(ev){
    if (!addMode) return;
    ev.preventDefault(); ev.stopPropagation();
    var el = ev.target;
    if (!el || el.nodeType !== 1) { setAdd(false); return; }
    var r = el.getBoundingClientRect();
    var snippet = (el.textContent || "").replace(/\\s+/g, " ").trim().slice(0, 120);
    post({ type: "giga-review:picked", selector: cssPath(el), textSnippet: snippet, anchorRect: { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height, viewportWidth: window.innerWidth } });
    setAdd(false);
  }
  function setAdd(on){
    addMode = on;
    document.documentElement.style.cursor = on ? "crosshair" : "";
    post({ type: "giga-review:mode", add: on });
  }
  window.addEventListener("message", function(ev){
    if (ADMIN !== "*" && ev.origin !== ADMIN) return;
    var d = ev.data || {};
    if (d.type === "giga-review:setMode"){ setAdd(!!d.add); }
    else if (d.type === "giga-review:setAnchors"){ anchors = d.anchors || []; render(); }
  });
  document.addEventListener("click", onPick, true);
  var raf = null;
  function schedule(){ if (raf) return; raf = requestAnimationFrame(function(){ raf = null; render(); }); }
  window.addEventListener("scroll", schedule, true);
  window.addEventListener("resize", schedule);
  function ready(){ document.body.appendChild(layer); render(); post({ type: "giga-review:ready" }); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready); else ready();
})();`;

export function injectReviewOverlay(html: string, anchors: ReviewAnchor[], adminOrigin: string): string {
  const data = JSON.stringify({ anchors, adminOrigin }).replace(/</g, "\\u003c");
  const block = `<!--giga-review--><script>window.__GIGA_REVIEW__=${data};</script><script>${REVIEW_OVERLAY_SCRIPT}</script>`;
  const index = html.toLowerCase().lastIndexOf("</body>");
  if (index === -1) {
    return `${html}${block}`;
  }
  return `${html.slice(0, index)}${block}${html.slice(index)}`;
}

function decodePreviewRequestPath(pathname: string): string | null {
  const leadingSlash = pathname.startsWith("/");
  const withoutLeadingSlash = pathname.replace(/^\/+/, "");
  if (!withoutLeadingSlash) {
    return leadingSlash ? "/" : "index.html";
  }
  const decodedSegments: string[] = [];
  for (const segment of withoutLeadingSlash.split("/")) {
    if (!segment) {
      return null;
    }
    let decoded: string;
    try {
      decoded = decodeURIComponent(segment);
    } catch {
      return null;
    }
    if (!decoded || decoded.includes("/") || decoded.includes("\\")) {
      return null;
    }
    decodedSegments.push(decoded);
  }
  return `${leadingSlash ? "/" : ""}${decodedSegments.join("/")}`;
}

function robotsTxtResponse(site: SiteRow): Response {
  const allowIndexing = isSearchIndexingEnabled(site);
  const body = allowIndexing
    ? "User-agent: *\nAllow: /\n"
    : "User-agent: *\nAllow: /\n# Indexing is disabled by X-Robots-Tag: noindex, nofollow on page responses.\n";
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer"
    }
  });
}

interface ViewerSessionRow {
  id: string;
  email: string | null;
}

async function getViewerSession(env: Env, request: Request, siteId: string): Promise<ViewerSessionRow | null> {
  const sessionId = getCookie(request, "ai_slop_preview_session");
  if (!sessionId) {
    return null;
  }
  const row = await env.DB.prepare(
    `SELECT id, email FROM viewer_sessions WHERE id = ? AND site_id = ? AND expires_at > ? LIMIT 1`
  )
    .bind(sessionId, siteId, new Date().toISOString())
    .first<ViewerSessionRow>();
  return row ?? null;
}

async function hasViewerSession(env: Env, request: Request, siteId: string): Promise<boolean> {
  const row = await getViewerSession(env, request, siteId);
  return Boolean(row);
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function authShell(site: SiteRow, body: string): Response {
  return htmlResponse(`<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>認証 | ${escapeHtml(site.title ?? "ギガサイト便")}</title>
  <style>
    :root { color: #09090b; background: #fafafa; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: radial-gradient(circle at top, #ffffff 0, #f4f4f5 60%); }
    main { width: min(440px, calc(100vw - 32px)); background: white; border: 1px solid #e4e4e7; border-radius: 18px; padding: 28px; box-shadow: 0 24px 80px rgba(24, 24, 27, 0.10); }
    .icon { width: 48px; height: 48px; display: grid; place-content: center; border-radius: 14px; color: #2563eb; background: #eff6ff; margin-bottom: 18px; }
    h1 { font-size: 22px; letter-spacing: -0.02em; margin: 0 0 8px; }
    p { color: #71717a; line-height: 1.6; margin: 0 0 20px; }
    form { display: grid; gap: 12px; }
    input { width: 100%; box-sizing: border-box; height: 42px; padding: 0 12px; border: 1px solid #d4d4d8; border-radius: 10px; font-size: 15px; }
    button { height: 42px; border: 0; border-radius: 10px; background: #18181b; color: white; font-weight: 700; cursor: pointer; }
    .error { border: 1px solid #fecaca; background: #fef2f2; color: #b91c1c; border-radius: 10px; padding: 10px 12px; font-size: 13px; margin-bottom: 12px; }
    .success { border: 1px solid #bbf7d0; background: #f0fdf4; color: #166534; border-radius: 10px; padding: 10px 12px; font-size: 13px; margin-bottom: 12px; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.92em; }
  </style>
</head>
<body>
  <main>
    <div class="icon">🔒</div>
    ${body}
  </main>
</body>
</html>`);
}

function passwordPage(site: SiteRow, returnTo: string, error?: string): Response {
  return authShell(
    site,
    `${error ? `<div class="error">${escapeHtml(error)}</div>` : ""}
    <h1>パスワードが必要です</h1>
    <p>${escapeHtml(site.title ?? "このHTML")} を表示するには共有パスワードを入力してください。</p>
    <form method="post" action="/preview-auth/${site.id}">
      <input type="hidden" name="returnTo" value="${escapeHtml(returnTo)}" />
      <input name="password" type="password" autocomplete="current-password" placeholder="共有パスワード" required autofocus />
      <button type="submit">表示する</button>
    </form>`
  );
}

function emailEntryPage(site: SiteRow, returnTo: string, error?: string): Response {
  const isAllowlist = site.auth_mode === "email_otp";
  const heading = isAllowlist ? "メール認証" : "会社ドメイン認証";
  const description = isAllowlist
    ? "許可されたメールアドレスで閲覧できます。メールで届く6桁コードを入力してください。"
    : `<code>${escapeHtml(parseAllowedEmailDomains(site.allowed_email_domains).map((domain) => `@${domain}`).join(" / ") || "許可ドメイン")}</code> のメールアドレスで閲覧できます。メールで届く6桁コードを入力してください。`;
  return authShell(
    site,
    `${error ? `<div class="error">${escapeHtml(error)}</div>` : ""}
    <h1>${heading}</h1>
    <p>${description}</p>
    <form method="post" action="/preview-email-auth/${site.id}">
      <input type="hidden" name="returnTo" value="${escapeHtml(returnTo)}" />
      <input name="email" type="email" autocomplete="email" placeholder="you@example.co.jp" required autofocus />
      <button type="submit">認証コードを送る</button>
    </form>`
  );
}

function emailOtpPage(site: SiteRow, challengeId: string, returnTo: string, email: string, error?: string): Response {
  return authShell(
    site,
    `${error ? `<div class="error">${escapeHtml(error)}</div>` : `<div class="success">認証コードを送信しました。</div>`}
    <h1>認証コードを入力</h1>
    <p><code>${escapeHtml(email)}</code> に届いた6桁コードを入力してください。コードの有効期限は10分です。</p>
    <form method="post" action="/preview-email-auth/${site.id}">
      <input type="hidden" name="returnTo" value="${escapeHtml(returnTo)}" />
      <input type="hidden" name="challengeId" value="${escapeHtml(challengeId)}" />
      <input name="code" inputmode="numeric" pattern="[0-9]{6}" autocomplete="one-time-code" placeholder="123456" required autofocus />
      <button type="submit">認証して表示する</button>
    </form>`
  );
}

async function sendOtpEmail(env: Env, request: Request, site: SiteRow, email: string, code: string, returnTo: string): Promise<string> {
  const previewOrigin = buildPreviewOrigin(request, env, site);
  const subject = `【ギガサイト便】認証コード: ${code}`;
  const siteTitle = site.title ?? "共有ページ";
  const previewUrl = `${previewOrigin}${returnTo}`;
  const text = `${siteTitle} を表示するための認証コードです。\n\n認証コード: ${code}\n有効期限: 10分\n\nページ: ${previewUrl}\n\nこのメールに心当たりがない場合は破棄してください。`;
  const html = `<!doctype html><html><body style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.7;color:#18181b">
    <h1 style="font-size:20px">ギガサイト便 認証コード</h1>
    <p><strong>${escapeHtml(siteTitle)}</strong> を表示するための認証コードです。</p>
    <p style="font-size:32px;letter-spacing:0.18em;font-weight:700;margin:24px 0">${code}</p>
    <p>有効期限は10分です。</p>
    <p><a href="${escapeHtml(previewUrl)}">共有ページを開く</a></p>
    <p style="color:#71717a;font-size:13px">このメールに心当たりがない場合は破棄してください。</p>
  </body></html>`;
  const result = await env.EMAIL.send({
    to: email,
    from: { email: senderAddress(env), name: "ギガサイト便" },
    subject,
    html,
    text
  });
  return result.messageId;
}

export function getPreviewSlug(request: Request, env: Env): string | null {
  const url = new URL(request.url);
  return extractPreviewSlugFromHost(url.hostname, env.PREVIEW_HOST_SUFFIX) ?? extractLocalPreviewSlug(url.pathname);
}

export async function handlePreviewRequest(request: Request, env: Env, ctx?: Pick<ExecutionContext, "waitUntil">): Promise<Response> {
  const url = new URL(request.url);
  const slug = getPreviewSlug(request, env);
  if (!slug) {
    return new Response("preview site not found", { status: 404 });
  }

  const site = await findSiteBySlug(env, slug);
  if (!site || site.status !== "active" || site.deleted_at || isExpired(site.expires_at)) {
    return htmlResponse("<!doctype html><title>Not found</title><h1>公開ページが見つかりません</h1>", 404);
  }
  if (url.pathname === "/robots.txt") {
    return robotsTxtResponse(site);
  }

  const previewRequestPath = extractLocalPreviewSlug(url.pathname) ? `/${previewPathFromLocalRequest(url.pathname)}` : url.pathname;
  if (isFormSubmissionPath(previewRequestPath)) {
    if (!(await ownerCanUseFormSubmissions(env.DB, site.owner_user_id))) {
      return formSubmissionsPlanRequiredResponse();
    }
    let viewerSession: ViewerSessionRow | null = null;
    if (site.auth_mode === "password" || isEmailAuthMode(site)) {
      viewerSession = await getViewerSession(env, request, site.id);
      if (!viewerSession) {
        return Response.json({ error: "preview_auth_required" }, { status: 401 });
      }
    }
    return handleFormSubmissionRequest(env, request, site, viewerSession?.email ?? null, ctx);
  }

  // Owner revision preview: a short-lived token pins a specific past revision for this
  // browsing session (cookie covers sub-resources). It never affects public visitors.
  const queryPreviewToken = url.searchParams.get("__rev_preview");
  const previewToken = queryPreviewToken ?? getCookie(request, "ai_slop_rev_preview");
  let activeRevisionId = site.current_revision_id;
  let isRevisionPreview = false;
  if (previewToken) {
    const tokenRow = await env.DB.prepare(
      `SELECT revision_id FROM revision_preview_tokens WHERE token = ? AND site_id = ? AND expires_at > ?`
    )
      .bind(previewToken, site.id, new Date().toISOString())
      .first<{ revision_id: string }>();
    if (tokenRow) {
      activeRevisionId = tokenRow.revision_id;
      isRevisionPreview = true;
    }
  }

  if (!activeRevisionId) {
    return htmlResponse("<!doctype html><title>No revision</title><h1>まだHTMLがアップロードされていません</h1>", 404);
  }

  // The preview token authorizes the owner, so it bypasses (and never sets) viewer auth gating.
  if (!isRevisionPreview) {
    if (site.auth_mode === "password" && !(await hasViewerSession(env, request, site.id))) {
      await recordAccessEvent(env, request, site.id, url.pathname, "auth_required");
      return passwordPage(site, url.pathname + url.search);
    }
    if (isEmailAuthMode(site) && !(await hasViewerSession(env, request, site.id))) {
      await recordAccessEvent(env, request, site.id, url.pathname, "auth_required");
      return emailEntryPage(site, url.pathname + url.search);
    }
  }

  const revision = await env.DB.prepare(`SELECT * FROM revisions WHERE id = ? AND site_id = ?`)
    .bind(activeRevisionId, site.id)
    .first<RevisionRow>();
  if (!revision) {
    return htmlResponse("<!doctype html><title>No revision</title><h1>公開ファイルが見つかりません</h1>", 404);
  }

  const rawPath = extractLocalPreviewSlug(url.pathname) ? previewPathFromLocalRequest(url.pathname) : url.pathname;
  const decodedRawPath = decodePreviewRequestPath(rawPath);
  if (!decodedRawPath) {
    return htmlResponse("<!doctype html><title>Not found</title><h1>Not found</h1>", 404);
  }
  const requestedPath = normalizeR2Path(decodedRawPath);
  const objectPath = requestedPath === "index.html" ? revision.entry_path : requestedPath;
  if (!objectPath) {
    return new Response("invalid path", { status: 400 });
  }
  const object = await env.HTML_BUCKET.get(`${revision.r2_prefix}/${objectPath}`);
  if (!object?.body) {
    return htmlResponse("<!doctype html><title>Not found</title><h1>ファイルが見つかりません</h1>", 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", objectPath.endsWith(".html") ? "text/html; charset=utf-8" : "application/octet-stream");
  }
  if (isRevisionPreview || !isSearchIndexingEnabled(site)) {
    headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "no-referrer");

  // Pin the previewed revision for sub-resource requests (CSS/img) that arrive without the query param.
  if (isRevisionPreview && queryPreviewToken) {
    const ttlSeconds = Math.ceil(REVISION_PREVIEW_TOKEN_TTL_SECONDS);
    headers.append("Set-Cookie", buildCookie("ai_slop_rev_preview", queryPreviewToken, ttlSeconds, url.protocol === "https:"));
  }

  // Owner previews of past generations are not counted as public views.
  if (!isRevisionPreview && (objectPath === revision.entry_path || objectPath.endsWith(".html"))) {
    await recordAccessEvent(env, request, site.id, objectPath, "view");
  }

  const contentType = headers.get("Content-Type") ?? "";
  const isHtmlEntry = objectPath === revision.entry_path || objectPath.endsWith(".html");

  // Owner review mode: inject the element-picker + pin overlay. Only reachable with a valid
  // revision-preview token (owner-authorized) AND the explicit __review flag, so public
  // visitors never receive the review script.
  if (isRevisionPreview && isHtmlEntry && url.searchParams.has("__review") && /text\/html/i.test(contentType)) {
    const anchors = await loadReviewAnchors(env, site.id, activeRevisionId);
    const reviewed = injectReviewOverlay(await object.text(), anchors, `https://${env.APP_HOST}`);
    headers.delete("Content-Length");
    return new Response(reviewed, { headers });
  }

  if (isHtmlEntry && /text\/html/i.test(contentType)) {
    let html = await object.text();
    const originalHtml = html;
    if (!isRevisionPreview && htmlContainsFormSubmissionOptIn(html) && (await ownerCanUseFormSubmissions(env.DB, site.owner_user_id))) {
      html = injectFormSubmissionBridge(html);
    }
    if (shouldInjectBranding(site, objectPath, contentType)) {
      html = injectBrandingBadge(html);
    }
    if (html !== originalHtml) {
      headers.delete("Content-Length");
      return new Response(html, { headers });
    }
  }

  return new Response(object.body, { headers });
}

export async function handlePreviewPasswordAuth(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/preview-auth\/([^/]+)$/);
  const siteId = match?.[1];
  if (!siteId) {
    return new Response("not found", { status: 404 });
  }
  const site = await env.DB.prepare(`SELECT * FROM sites WHERE id = ? AND deleted_at IS NULL`).bind(siteId).first<SiteRow>();
  if (!site) {
    return new Response("not found", { status: 404 });
  }

  const form = await request.formData();
  const password = form.get("password");
  const returnTo = safeReturnTo(form.get("returnTo"));
  if (typeof password !== "string" || !(await verifyPassword(password, site.password_hash))) {
    await recordAccessEvent(env, request, site.id, returnTo, "auth_failed");
    return passwordPage(site, returnTo, "パスワードが違います。");
  }

  return createViewerSessionResponse(request, env, site, returnTo, "password", null, null);
}

export async function handlePreviewEmailDomainAuth(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/preview-email-auth\/([^/]+)$/);
  const siteId = match?.[1];
  if (!siteId) {
    return new Response("not found", { status: 404 });
  }
  const site = await env.DB.prepare(`SELECT * FROM sites WHERE id = ? AND deleted_at IS NULL`).bind(siteId).first<SiteRow>();
  if (!site) {
    return new Response("not found", { status: 404 });
  }

  if (!isEmailAuthMode(site)) {
    return new Response("not found", { status: 404 });
  }
  if (!isCanonicalPreviewHost(request, env, site)) {
    return new Response("not found", { status: 404 });
  }

  const form = await request.formData();
  const returnTo = safeReturnTo(form.get("returnTo"));
  const challengeIdRaw = form.get("challengeId");
  const codeRaw = form.get("code");
  if (typeof challengeIdRaw === "string" && typeof codeRaw === "string") {
    return verifyEmailOtpChallenge(request, env, site, challengeIdRaw, codeRaw.trim(), returnTo);
  }

  const email = normalizeEmail(form.get("email"));
  if (!isEmailAllowedForSite(site, email)) {
    await recordAccessEvent(env, request, site.id, returnTo, "auth_failed", email || null);
    const message =
      site.auth_mode === "email_otp"
        ? "許可されたメールアドレスを入力してください。"
        : "許可された会社ドメインのメールアドレスを入力してください。";
    return emailEntryPage(site, returnTo, message);
  }

  const challengeId = crypto.randomUUID();
  const code = generateOtpCode();
  const domain = domainFromEmail(email);
  const now = new Date();
  const nowText = now.toISOString();
  const cooldownCutoff = new Date(now.getTime() - PREVIEW_EMAIL_OTP_COOLDOWN_SECONDS * 1000).toISOString();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
  const codeHash = await hashOtpCode(challengeId, site.id, email, code);

  const inserted = await env.DB.prepare(
    `INSERT INTO email_otp_challenges (id, site_id, email, email_domain, code_hash, return_to, attempts, expires_at, consumed_at, created_at)
     SELECT ?, ?, ?, ?, ?, ?, 0, ?, NULL, ?
     WHERE NOT EXISTS (
       SELECT 1 FROM email_otp_challenges
       WHERE site_id = ? AND email = ? AND consumed_at IS NULL AND expires_at > ? AND created_at > ?
       LIMIT 1
     )`
  )
    .bind(challengeId, site.id, email, domain, codeHash, returnTo, expiresAt, nowText, site.id, email, nowText, cooldownCutoff)
    .run();

  if (inserted.meta.changes === 0) {
    await recordAccessEvent(env, request, site.id, returnTo, "auth_failed", email);
    return emailEntryPage(site, returnTo, "認証メールは送信済みです。時間を置いて再度お試しください。");
  }

  try {
    await sendOtpEmail(env, request, site, email, code, returnTo);
  } catch (error) {
    console.error("email_otp_send_failed", error);
    await recordAccessEvent(env, request, site.id, returnTo, "auth_failed", email);
    return emailEntryPage(site, returnTo, "認証メールの送信に失敗しました。時間を置いて再度お試しください。");
  }

  await recordAccessEvent(env, request, site.id, returnTo, "auth_code_sent", email);
  return emailOtpPage(site, challengeId, returnTo, email);
}

async function verifyEmailOtpChallenge(
  request: Request,
  env: Env,
  site: SiteRow,
  challengeId: string,
  code: string,
  fallbackReturnTo: string
): Promise<Response> {
  const challenge = await env.DB.prepare(
    `SELECT * FROM email_otp_challenges WHERE id = ? AND site_id = ? LIMIT 1`
  )
    .bind(challengeId, site.id)
    .first<EmailOtpChallengeRow>();
  const returnTo = challenge?.return_to && challenge.return_to.startsWith("/") ? challenge.return_to : fallbackReturnTo;
  if (!challenge) {
    await recordAccessEvent(env, request, site.id, returnTo, "auth_failed");
    return emailEntryPage(site, returnTo, "認証コードを再送してください。");
  }
  if (challenge.consumed_at || new Date(challenge.expires_at).getTime() <= Date.now()) {
    await recordAccessEvent(env, request, site.id, returnTo, "auth_failed", challenge.email);
    return emailEntryPage(site, returnTo, "認証コードの有効期限が切れました。もう一度送信してください。");
  }
  if (!isEmailAllowedForSite(site, challenge.email)) {
    await recordAccessEvent(env, request, site.id, returnTo, "auth_failed", challenge.email);
    return emailEntryPage(site, returnTo, "認証コードを再送してください。");
  }
  if (challenge.attempts >= 5) {
    await recordAccessEvent(env, request, site.id, returnTo, "auth_failed", challenge.email);
    return emailEntryPage(site, returnTo, "認証コードの試行回数を超えました。もう一度送信してください。");
  }
  if (!/^\d{6}$/.test(code)) {
    await incrementChallengeAttempts(env, challenge.id);
    await recordAccessEvent(env, request, site.id, returnTo, "auth_failed", challenge.email);
    return emailOtpPage(site, challenge.id, returnTo, challenge.email, "6桁の認証コードを入力してください。");
  }

  const inputHash = await hashOtpCode(challenge.id, site.id, challenge.email, code);
  if (!timingSafeEqual(inputHash, challenge.code_hash)) {
    await incrementChallengeAttempts(env, challenge.id);
    await recordAccessEvent(env, request, site.id, returnTo, "auth_failed", challenge.email);
    return emailOtpPage(site, challenge.id, returnTo, challenge.email, "認証コードが違います。");
  }

  const consumedAt = new Date().toISOString();
  await env.DB.prepare(`UPDATE email_otp_challenges SET consumed_at = ? WHERE id = ?`).bind(consumedAt, challenge.id).run();
  return createViewerSessionResponse(request, env, site, returnTo, site.auth_mode === "email_otp" ? "email_otp" : "email_domain", challenge.email, challenge.email_domain);
}

async function incrementChallengeAttempts(env: Env, challengeId: string): Promise<void> {
  await env.DB.prepare(`UPDATE email_otp_challenges SET attempts = attempts + 1 WHERE id = ?`).bind(challengeId).run();
}

async function createViewerSessionResponse(
  request: Request,
  env: Env,
  site: SiteRow,
  returnTo: string,
  authMethod: PreviewAuthMethod,
  email: string | null,
  emailDomain: string | null
): Promise<Response> {
  const url = new URL(request.url);
  const ttlSeconds = envNumber(env.SESSION_TTL_SECONDS, 86_400);
  const sessionId = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000).toISOString();
  await env.DB.prepare(
    `INSERT INTO viewer_sessions (id, site_id, auth_method, email, email_domain, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(sessionId, site.id, authMethod, email, emailDomain, expiresAt, now.toISOString())
    .run();
  await recordAccessEvent(env, request, site.id, returnTo, "auth_success", email);

  return new Response(null, {
    status: 303,
    headers: {
      Location: returnTo,
      "Set-Cookie": buildCookie("ai_slop_preview_session", sessionId, ttlSeconds, url.protocol === "https:")
    }
  });
}
