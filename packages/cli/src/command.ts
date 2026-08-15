import { buildPublishBundle } from "./bundle.js";
import { clearConfig, loadConfig, saveConfig } from "./config.js";

export interface ParsedPublishArgs {
  ok: true;
  command: "publish";
  path: string;
  token?: string;
  host: string;
  entryPath?: string;
  json: boolean;
  dryRun: boolean;
}

export interface ParseError {
  ok: false;
  error: string;
}

export interface CliIo {
  stdout: (line: string) => void;
  stderr: (line: string) => void;
}

interface UploadSuccessBody {
  site?: { previewUrl?: unknown };
  revision?: { fileCount?: unknown; byteLength?: unknown; warnings?: unknown };
}

interface RequestSpec {
  method?: string;
  path: string;
  body?: unknown;
  text?: boolean;
}

interface AuthenticatedConfig {
  host: string;
  sessionCookie: string;
  user?: { email?: string };
  createdAt: string;
}

const DEFAULT_HOST = "https://giga-site.com";
const TOKEN_PATTERN = /gut_[A-Za-z0-9_-]+/g;
const SESSION_PATTERN = /giga_site_session=[^;\s"']+/g;

function envValue(name: string): string | undefined {
  return typeof process !== "undefined" ? process.env[name] : undefined;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function redactSecrets(value: string): string {
  return value.replace(TOKEN_PATTERN, "gut_[REDACTED]").replace(SESSION_PATTERN, "giga_site_session=[REDACTED]");
}

function usage(): string {
  return [
    "Usage: giga <command>",
    "",
    "Core:",
    "  giga login --email <email> [--host <origin>]",
    "  giga login --code <code>",
    "  giga publish <path> [--token <gut_token>] [--site <siteId>] [--title <title>] [--json]",
    "  giga sites list|get|create|update|renew|delete ...",
    "",
    "Token can also be supplied as GIGA_UPLOAD_TOKEN. Host defaults to https://giga-site.com or GIGA_HOST."
  ].join("\n");
}

function readOption(argv: string[], index: number, flag: string): string | ParseError {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    return { ok: false, error: `${flag}_requires_value` };
  }
  return value;
}

function option(argv: string[], name: string): string | undefined {
  const index = argv.indexOf(name);
  if (index === -1) return undefined;
  const value = argv[index + 1];
  return value && !value.startsWith("--") ? value : undefined;
}

function hasFlag(argv: string[], name: string): boolean {
  return argv.includes(name);
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  if (["true", "1", "yes", "on"].includes(value.toLowerCase())) return true;
  if (["false", "0", "no", "off"].includes(value.toLowerCase())) return false;
  return undefined;
}

function siteFields(argv: string[]): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  const title = option(argv, "--title");
  const slug = option(argv, "--slug");
  const authMode = option(argv, "--auth");
  const password = option(argv, "--password");
  const allowedEmailDomains = option(argv, "--allowed-email-domains");
  const allowedEmails = option(argv, "--allowed-emails");
  const expiresAt = option(argv, "--expires-at");
  const tool = option(argv, "--tool");
  const indexing = parseBoolean(option(argv, "--indexing"));
  const hideBranding = parseBoolean(option(argv, "--hide-branding"));
  if (title !== undefined) fields.title = title;
  if (slug !== undefined) fields.slug = slug;
  if (authMode !== undefined) fields.authMode = authMode;
  if (password !== undefined) fields.password = password;
  if (allowedEmailDomains !== undefined) fields.allowedEmailDomains = allowedEmailDomains;
  if (allowedEmails !== undefined) fields.allowedEmails = allowedEmails;
  if (expiresAt !== undefined) fields.expiresAt = expiresAt;
  if (tool !== undefined) fields.tool = tool;
  if (indexing !== undefined) fields.indexingEnabled = indexing;
  if (hideBranding !== undefined) fields.hideBranding = hideBranding;
  return fields;
}

export function parsePublishArgs(argv: string[]): ParsedPublishArgs | ParseError {
  if (argv[0] !== "publish") {
    return { ok: false, error: "unknown_command" };
  }
  const publishPath = argv[1];
  if (!publishPath || publishPath.startsWith("--")) {
    return { ok: false, error: "publish_path_required" };
  }

  let token: string | undefined;
  let host = envValue("GIGA_HOST") ?? DEFAULT_HOST;
  let entryPath: string | undefined;
  let json = false;
  let dryRun = false;

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--token") {
      const value = readOption(argv, index, "token");
      if (typeof value !== "string") return value;
      token = value;
      index += 1;
      continue;
    }
    if (arg === "--host") {
      const value = readOption(argv, index, "host");
      if (typeof value !== "string") return value;
      host = value;
      index += 1;
      continue;
    }
    if (arg === "--entry") {
      const value = readOption(argv, index, "entry");
      if (typeof value !== "string") return value;
      entryPath = value;
      index += 1;
      continue;
    }
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (["--site", "--title", "--auth", "--password", "--slug", "--allowed-email-domains", "--allowed-emails", "--expires-at", "--tool", "--indexing", "--hide-branding"].includes(arg)) {
      const value = readOption(argv, index, arg.slice(2));
      if (typeof value !== "string") return value;
      index += 1;
      continue;
    }
    return { ok: false, error: `unknown_option:${arg}` };
  }

  return {
    ok: true,
    command: "publish",
    path: publishPath,
    token: token ?? envValue("GIGA_UPLOAD_TOKEN"),
    host: trimTrailingSlash(host),
    entryPath,
    json,
    dryRun
  };
}

function tokenIdFromValue(token: string): string | null {
  const match = /^gut_([^_]+)_[A-Za-z0-9_-]+$/.exec(token);
  return match?.[1] ?? null;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function safeJson(value: unknown): string {
  return redactSecrets(JSON.stringify(value, null, 2));
}

function outputBody(body: unknown, json: boolean, io: CliIo): void {
  if (typeof body === "string") {
    io.stdout(redactSecrets(body));
    return;
  }
  if (json) {
    io.stdout(safeJson(body));
    return;
  }
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const url = typeof record.url === "string" ? record.url : undefined;
    const session = record.session && typeof record.session === "object" && "url" in record.session ? (record.session as { url?: unknown }).url : undefined;
    const portal = record.portal && typeof record.portal === "object" && "url" in record.portal ? (record.portal as { url?: unknown }).url : undefined;
    const preview = record.site && typeof record.site === "object" && "previewUrl" in record.site ? (record.site as { previewUrl?: unknown }).previewUrl : undefined;
    const printable = url ?? (typeof session === "string" ? session : undefined) ?? (typeof portal === "string" ? portal : undefined) ?? (typeof preview === "string" ? preview : undefined);
    io.stdout(printable ? redactSecrets(printable) : safeJson(body));
    return;
  }
  io.stdout(String(body ?? "ok"));
}

function outputSuccess(body: UploadSuccessBody, json: boolean, io: CliIo): void {
  if (json) {
    io.stdout(safeJson(body));
    return;
  }
  const previewUrl = typeof body.site?.previewUrl === "string" ? body.site.previewUrl : null;
  if (previewUrl) {
    io.stdout(`Published: ${previewUrl}`);
  } else {
    io.stdout("Published.");
  }
  const fileCount = body.revision?.fileCount;
  const byteLength = body.revision?.byteLength;
  if (typeof fileCount === "number" && typeof byteLength === "number") {
    io.stdout(`Revision: ${fileCount} files, ${byteLength} bytes`);
  }
  if (Array.isArray(body.revision?.warnings) && body.revision.warnings.length > 0) {
    io.stdout(`Warnings: ${body.revision.warnings.join(", ")}`);
  }
}

function setCookieHeader(response: Response): string | null {
  return response.headers.get("set-cookie") ?? response.headers.get("Set-Cookie");
}

function sessionCookieFromSetCookie(value: string | null): string | null {
  if (!value) return null;
  const cookie = value.split(";", 1)[0]?.trim();
  return cookie?.startsWith("giga_site_session=") ? cookie : null;
}

async function requestJson(host: string, spec: RequestSpec, cookie?: string): Promise<{ ok: true; body: unknown; status: number } | { ok: false; body: unknown; status: number }> {
  const method = spec.method ?? "GET";
  const headers: Record<string, string> = { Accept: spec.text ? "text/csv, text/plain, */*" : "application/json", "User-Agent": "giga-cli/0.1.0" };
  if (spec.body !== undefined) headers["Content-Type"] = "application/json";
  if (cookie) headers.Cookie = cookie;
  if (method !== "GET" && method !== "HEAD") headers.Origin = host;
  const response = await fetch(`${host}${spec.path}`, {
    method,
    headers,
    body: spec.body === undefined ? undefined : JSON.stringify(spec.body)
  });
  const body = await parseResponseBody(response);
  return response.ok ? { ok: true, body, status: response.status } : { ok: false, body, status: response.status };
}

async function requireConfig(io: CliIo): Promise<AuthenticatedConfig | null> {
  const config = await loadConfig();
  if (!config || typeof config.host !== "string" || typeof config.sessionCookie !== "string") {
    io.stderr("login required. Run `giga login --email <email>` then `giga login --code <code>`, or pass --token / GIGA_UPLOAD_TOKEN for one-time agent publish.");
    return null;
  }
  const user = config.user;
  return user === undefined
    ? { host: trimTrailingSlash(config.host), sessionCookie: config.sessionCookie, createdAt: config.createdAt }
    : { host: trimTrailingSlash(config.host), sessionCookie: config.sessionCookie, user, createdAt: config.createdAt };
}

async function runAuthedRequest(spec: RequestSpec, json: boolean, io: CliIo): Promise<number> {
  const config = await requireConfig(io);
  if (!config) return 1;
  const result = await requestJson(config.host, spec, config.sessionCookie);
  if (!result.ok) {
    io.stderr(redactSecrets(`Request failed (${result.status}): ${typeof result.body === "string" ? result.body : JSON.stringify(result.body)}`));
    return result.status === 401 ? 3 : 2;
  }
  outputBody(result.body, json, io);
  return 0;
}

async function runLogin(argv: string[], io: CliIo): Promise<number> {
  const email = option(argv, "--email");
  const code = option(argv, "--code");
  const host = trimTrailingSlash(option(argv, "--host") ?? envValue("GIGA_HOST") ?? DEFAULT_HOST);

  if (email && !code) {
    const requested = await requestJson(host, { method: "POST", path: "/api/auth/request-code", body: { email } });
    if (!requested.ok || !requested.body || typeof requested.body !== "object" || typeof (requested.body as { challengeId?: unknown }).challengeId !== "string") {
      io.stderr(redactSecrets(`Login request failed (${requested.status}): ${typeof requested.body === "string" ? requested.body : JSON.stringify(requested.body)}`));
      return 2;
    }
    const body = requested.body as { challengeId: string; expiresAt?: unknown; email?: unknown };
    await saveConfig({
      pendingLogin: {
        host,
        email: typeof body.email === "string" ? body.email : email,
        challengeId: body.challengeId,
        expiresAt: typeof body.expiresAt === "string" ? body.expiresAt : new Date(Date.now() + 10 * 60 * 1000).toISOString()
      },
      createdAt: new Date().toISOString()
    });
    const sentEmail = typeof body.email === "string" ? body.email : email;
    io.stdout(`Login code sent to ${sentEmail}. Run 'giga login --code <code>'.`);
    return 0;
  }

  if (!code) {
    io.stderr("email or code required. Usage: giga login --email <email> [--host <origin>] then giga login --code <code>");
    return 1;
  }

  const config = await loadConfig();
  const pending = config?.pendingLogin;
  const explicitChallengeId = option(argv, "--challenge-id");
  const verifyHost = trimTrailingSlash(option(argv, "--host") ?? pending?.host ?? host);
  const verifyEmail = email ?? pending?.email;
  const challengeId = explicitChallengeId ?? pending?.challengeId;
  if (!verifyEmail || !challengeId) {
    io.stderr("pending login missing. Run `giga login --email <email>` first, or pass --email and --challenge-id with --code.");
    return 1;
  }

  const response = await fetch(`${verifyHost}/api/auth/verify-code`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json", Origin: verifyHost, "User-Agent": "giga-cli/0.1.0" },
    body: JSON.stringify({ challengeId, email: verifyEmail, code })
  });
  const body = await parseResponseBody(response);
  if (!response.ok) {
    io.stderr(redactSecrets(`Login failed (${response.status}): ${typeof body === "string" ? body : JSON.stringify(body)}`));
    return 2;
  }
  const cookie = sessionCookieFromSetCookie(setCookieHeader(response));
  if (!cookie) {
    io.stderr("Login failed: session cookie missing");
    return 2;
  }
  const userEmail = body && typeof body === "object" && "user" in body && (body as { user?: unknown }).user && typeof (body as { user: unknown }).user === "object" && "email" in (body as { user: Record<string, unknown> }).user
    ? String((body as { user: Record<string, unknown> }).user.email)
    : verifyEmail;
  await saveConfig({ host: verifyHost, sessionCookie: cookie, user: { email: userEmail }, createdAt: new Date().toISOString() });
  io.stdout(`Logged in as ${userEmail}`);
  return 0;
}

async function runOneTimePublish(argv: string[], io: CliIo): Promise<number> {
  const parsed = parsePublishArgs(argv);
  if (!parsed.ok) {
    io.stderr(`${parsed.error}\n${usage()}`);
    return 1;
  }
  if (!parsed.token) {
    io.stderr(`upload token required. Pass --token or set GIGA_UPLOAD_TOKEN.\n${usage()}`);
    return 1;
  }
  const tokenId = tokenIdFromValue(parsed.token);
  if (!tokenId) {
    io.stderr("invalid upload token format. Expected gut_<tokenId>_<uploadSecret>.");
    return 1;
  }

  try {
    const bundle = await buildPublishBundle(parsed.path, { entryPath: parsed.entryPath });
    const requestBody = { entryPath: bundle.entryPath, files: bundle.files };
    if (parsed.dryRun) {
      io.stdout(safeJson({
        host: parsed.host,
        tokenId,
        entryPath: bundle.entryPath,
        fileCount: bundle.files.length,
        totalBytes: bundle.totalBytes,
        files: bundle.files.map((file) => ({ path: file.path, contentType: file.contentType }))
      }));
      return 0;
    }

    const response = await fetch(`${parsed.host}/api/agent/uploads/${tokenId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${parsed.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "giga-cli/0.1.0"
      },
      body: JSON.stringify(requestBody)
    });
    const body = await parseResponseBody(response);
    if (!response.ok) {
      io.stderr(redactSecrets(`Upload failed (${response.status}): ${typeof body === "string" ? body : JSON.stringify(body)}`));
      return 2;
    }
    outputSuccess((body ?? {}) as UploadSuccessBody, parsed.json, io);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    io.stderr(redactSecrets(message));
    return 2;
  }
}

async function runSessionPublish(argv: string[], io: CliIo): Promise<number> {
  const publishPath = argv[1];
  if (!publishPath || publishPath.startsWith("--")) {
    io.stderr(`publish_path_required\n${usage()}`);
    return 1;
  }
  const config = await requireConfig(io);
  if (!config) return 1;
  const bundle = await buildPublishBundle(publishPath, { entryPath: option(argv, "--entry") });
  const bundleBody = { entryPath: bundle.entryPath, files: bundle.files };
  const json = hasFlag(argv, "--json");
  const dryRun = hasFlag(argv, "--dry-run");
  const siteId = option(argv, "--site");
  const title = option(argv, "--title");
  if (dryRun) {
    io.stdout(safeJson({
      mode: "session",
      host: config.host,
      siteId: siteId ?? null,
      title: title ?? null,
      entryPath: bundle.entryPath,
      fileCount: bundle.files.length,
      totalBytes: bundle.totalBytes,
      files: bundle.files.map((file) => ({ path: file.path, contentType: file.contentType }))
    }));
    return 0;
  }
  if (siteId) {
    const result = await requestJson(config.host, { method: "POST", path: `/api/sites/${encodeURIComponent(siteId)}/revisions`, body: bundleBody }, config.sessionCookie);
    if (!result.ok) {
      io.stderr(redactSecrets(`Upload failed (${result.status}): ${JSON.stringify(result.body)}`));
      return 2;
    }
    outputBody(result.body, json, io);
    return 0;
  }
  if (title) {
    const body = { ...siteFields(argv), title, ...bundleBody };
    const result = await requestJson(config.host, { method: "POST", path: "/api/sites-with-revision", body }, config.sessionCookie);
    if (!result.ok) {
      io.stderr(redactSecrets(`Upload failed (${result.status}): ${JSON.stringify(result.body)}`));
      return 2;
    }
    outputBody(result.body, json, io);
    return 0;
  }
  return runOneTimePublish(argv, io);
}

function commandSpec(argv: string[]): RequestSpec | ParseError {
  const [command, sub, a, b] = argv;
  switch (command) {
    case "me": return { path: "/api/me" };
    case "dashboard": return { path: "/api/dashboard" };
    case "notifications": return { path: "/api/notifications" };
    case "sites": {
      if (sub === "list") return { path: "/api/sites" };
      if (sub === "get" && a) return { path: `/api/sites/${encodeURIComponent(a)}` };
      if (sub === "create") return { method: "POST", path: "/api/sites", body: siteFields(argv) };
      if (sub === "update" && a) return { method: "PATCH", path: `/api/sites/${encodeURIComponent(a)}`, body: siteFields(argv) };
      if (sub === "renew" && a) return { method: "POST", path: `/api/sites/${encodeURIComponent(a)}/renew-expiry`, body: {} };
      if (sub === "delete" && a) return hasFlag(argv, "--yes") ? { method: "DELETE", path: `/api/sites/${encodeURIComponent(a)}` } : { ok: false, error: "delete_requires_yes" };
      break;
    }
    case "revisions": {
      if (sub === "list" && a) return { path: `/api/sites/${encodeURIComponent(a)}/revisions` };
      if (sub === "preview" && a && b) return { method: "POST", path: `/api/sites/${encodeURIComponent(a)}/revisions/${encodeURIComponent(b)}/preview` };
      if (sub === "restore" && a && b) return { method: "POST", path: `/api/sites/${encodeURIComponent(a)}/revisions/${encodeURIComponent(b)}/restore` };
      break;
    }
    case "forms": {
      if (sub === "list" && a) return { path: `/api/sites/${encodeURIComponent(a)}/form-submissions` };
      if (sub === "get" && a && b) return { path: `/api/sites/${encodeURIComponent(a)}/form-submissions/${encodeURIComponent(b)}` };
      if (sub === "csv" && a) return { path: `/api/sites/${encodeURIComponent(a)}/form-submissions.csv`, text: true };
      break;
    }
    case "events": if (sub) return { path: `/api/sites/${encodeURIComponent(sub)}/events` }; break;
    case "comments": {
      if (sub === "list" && a) {
        const revisionId = option(argv, "--revision");
        return { path: `/api/sites/${encodeURIComponent(a)}/comments${revisionId ? `?revisionId=${encodeURIComponent(revisionId)}` : ""}` };
      }
      if (sub === "create" && a) return { method: "POST", path: `/api/sites/${encodeURIComponent(a)}/comments`, body: { revisionId: option(argv, "--revision"), body: option(argv, "--body"), selector: option(argv, "--selector") } };
      if (sub === "update" && a && b) return { method: "PATCH", path: `/api/sites/${encodeURIComponent(a)}/comments/${encodeURIComponent(b)}`, body: { body: option(argv, "--body"), status: option(argv, "--status") } };
      if (sub === "delete" && a && b) return hasFlag(argv, "--yes") ? { method: "DELETE", path: `/api/sites/${encodeURIComponent(a)}/comments/${encodeURIComponent(b)}` } : { ok: false, error: "delete_requires_yes" };
      break;
    }
    case "billing": {
      if (sub === "status") return { path: "/api/billing/subscription" };
      if (sub === "invoices") return { path: "/api/billing/invoices" };
      if (sub === "payment-method") return { path: "/api/billing/payment-method" };
      if (sub === "checkout") return { method: "POST", path: "/api/billing/checkout-session", body: { planId: option(argv, "--plan") } };
      if (sub === "portal") return { method: "POST", path: "/api/billing/customer-portal-session" };
      break;
    }
    case "slugs": if (sub === "check" && a) return { path: `/api/slugs/availability?slug=${encodeURIComponent(a)}` }; break;
    case "agent-token": if (sub === "create") return { method: "POST", path: "/api/agent/upload-tokens", body: siteFields(argv) }; break;
  }
  return { ok: false, error: "unknown_command" };
}

function isParseError(value: RequestSpec | ParseError): value is ParseError {
  return "ok" in value && value.ok === false;
}

export async function runGigaCli(argv: string[], io: CliIo): Promise<number> {
  try {
    if (argv.length === 0 || hasFlag(argv, "--help") || hasFlag(argv, "-h")) {
      io.stdout(usage());
      return 0;
    }
    if (argv[0] === "login") return runLogin(argv, io);
    if (argv[0] === "logout") {
      const config = await loadConfig();
      if (config?.host && config.sessionCookie) {
        await requestJson(trimTrailingSlash(config.host), { method: "POST", path: "/api/auth/sign-out" }, config.sessionCookie).catch(() => undefined);
      }
      await clearConfig();
      io.stdout("Logged out.");
      return 0;
    }
    if (argv[0] === "publish") {
      const token = option(argv, "--token") ?? envValue("GIGA_UPLOAD_TOKEN");
      if (token) return runOneTimePublish(argv, io);
      return runSessionPublish(argv, io);
    }
    const spec = commandSpec(argv);
    if (isParseError(spec)) {
      io.stderr(`${spec.error}\n${usage()}`);
      return 1;
    }
    return runAuthedRequest(spec, hasFlag(argv, "--json"), io);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    io.stderr(redactSecrets(message));
    return 2;
  }
}
