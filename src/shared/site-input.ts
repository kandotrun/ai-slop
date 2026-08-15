import { AUTH_MODES, SITE_TOOLS, type AuthMode, type NormalizedSiteInput, type Result, type SiteCreateInput, type SiteTool } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[a-z0-9.-]+\.[a-z]{2,}$/;

const RESERVED_SLUGS = new Set([
  "app",
  "api",
  "admin",
  "assets",
  "static",
  "www",
  "mail",
  "ftp",
  "support",
  "help",
  "billing"
]);

const EXAMPLE_PASSWORDS = new Set([
  "change-me-please",
  "password",
  "password123",
  "example-password",
  "your-password",
  "your-password-here",
  "generate-unique-random-password"
]);

function isExamplePassword(password: string): boolean {
  const normalized = password.trim().toLowerCase();
  if (EXAMPLE_PASSWORDS.has(normalized)) return true;
  return /^<[^>]*password[^>]*>$/.test(normalized);
}

function isAuthMode(value: unknown): value is AuthMode {
  return typeof value === "string" && (AUTH_MODES as readonly string[]).includes(value);
}

function normalizeTool(value: unknown): SiteTool | undefined {
  return typeof value === "string" && (SITE_TOOLS as readonly string[]).includes(value) ? (value as SiteTool) : undefined;
}

function normalizeEmails(value: unknown): Result<string[] | undefined> {
  if (value == null || value === "") {
    return { ok: true, value: undefined };
  }
  const raw = Array.isArray(value) ? value : typeof value === "string" ? value.split(/[\s,]+/) : [];
  const emails = raw
    .map((item) => (typeof item === "string" ? item.trim().toLowerCase() : ""))
    .filter(Boolean);
  if (emails.length === 0) {
    return { ok: true, value: undefined };
  }
  if (emails.length > 50) {
    return { ok: false, error: "too_many_emails" };
  }
  if (emails.some((email) => !EMAIL_PATTERN.test(email))) {
    return { ok: false, error: "invalid_email" };
  }
  return { ok: true, value: [...new Set(emails)] };
}

export function normalizeSlug(value: unknown): Result<string | undefined> {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { ok: true, value: undefined };
  }
  const slug = value.trim().toLowerCase();
  if (!/^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/.test(slug)) {
    return { ok: false, error: "invalid_slug" };
  }
  if (RESERVED_SLUGS.has(slug)) {
    return { ok: false, error: "reserved_slug" };
  }
  return { ok: true, value: slug };
}

function normalizeDomains(value: unknown): Result<string[] | undefined> {
  if (value == null || value === "") {
    return { ok: true, value: undefined };
  }
  const raw = Array.isArray(value) ? value : typeof value === "string" ? value.split(/[\s,]+/) : [];
  const domains = raw
    .map((item) => (typeof item === "string" ? item.trim().toLowerCase().replace(/^@/, "") : ""))
    .filter(Boolean);
  if (domains.length === 0) {
    return { ok: true, value: undefined };
  }
  if (domains.length > 20) {
    return { ok: false, error: "too_many_domains" };
  }
  if (domains.some((domain) => !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain))) {
    return { ok: false, error: "invalid_domain" };
  }
  return { ok: true, value: [...new Set(domains)] };
}

export interface AuthInputRaw {
  authMode?: unknown;
  password?: unknown;
  allowedEmailDomains?: unknown;
  allowedEmails?: unknown;
}

export interface NormalizedAuthInput {
  authMode: AuthMode;
  password?: string;
  allowedEmailDomains?: string[];
  allowedEmails?: string[];
}

/**
 * Validate the auth-related fields shared by site creation and updates.
 * On updates `requirePassword` is false so a password-mode site can be saved
 * without re-typing the password (the caller keeps the existing hash).
 */
export function normalizeAuthInput(raw: AuthInputRaw, options: { requirePassword: boolean }): Result<NormalizedAuthInput> {
  if (raw.authMode !== undefined && !isAuthMode(raw.authMode)) {
    return { ok: false, error: "invalid_auth_mode" };
  }
  const authMode: AuthMode = isAuthMode(raw.authMode) ? raw.authMode : "password";
  const password = typeof raw.password === "string" ? raw.password.trim() : undefined;
  if (authMode === "password" && options.requirePassword && (!password || password.length < 6)) {
    return { ok: false, error: "password_required" };
  }
  if (authMode === "password" && password && password.length < 6) {
    return { ok: false, error: "password_required" };
  }
  if (password && password.length > 200) {
    return { ok: false, error: "password_too_long" };
  }
  if (authMode === "password" && password && isExamplePassword(password)) {
    return { ok: false, error: "password_too_common" };
  }

  const domains = normalizeDomains(raw.allowedEmailDomains);
  if (!domains.ok) {
    return domains;
  }
  if (authMode === "email_domain" && (!domains.value || domains.value.length === 0)) {
    return { ok: false, error: "domain_required" };
  }

  const emails = normalizeEmails(raw.allowedEmails);
  if (!emails.ok) {
    return emails;
  }
  if (authMode === "email_otp" && (!emails.value || emails.value.length === 0)) {
    return { ok: false, error: "allowed_emails_required" };
  }

  return { ok: true, value: { authMode, password: authMode === "password" ? password : undefined, allowedEmailDomains: domains.value, allowedEmails: emails.value } };
}

export function normalizeSiteInput(raw: SiteCreateInput): Result<NormalizedSiteInput> {
  const title = typeof raw.title === "string" && raw.title.trim().length > 0 ? raw.title.trim() : "Untitled HTML";
  if (title.length > 120) {
    return { ok: false, error: "title_too_long" };
  }

  const slug = normalizeSlug(raw.slug);
  if (!slug.ok) {
    return slug;
  }

  const auth = normalizeAuthInput(raw, { requirePassword: true });
  if (!auth.ok) {
    return auth;
  }
  const { authMode, password } = auth.value;
  const domains = { value: auth.value.allowedEmailDomains };
  const emails = { value: auth.value.allowedEmails };

  let expiresAt: string | undefined;
  if (typeof raw.expiresAt === "string" && raw.expiresAt.trim().length > 0) {
    const date = new Date(raw.expiresAt);
    if (Number.isNaN(date.getTime())) {
      return { ok: false, error: "invalid_expires_at" };
    }
    expiresAt = date.toISOString();
  }
  const indexingEnabled = raw.indexingEnabled === true;
  const tool = normalizeTool(raw.tool);
  const hideBranding = raw.hideBranding === true;

  return {
    ok: true,
    value: {
      title,
      slug: slug.value,
      authMode,
      password,
      allowedEmailDomains: domains.value,
      allowedEmails: emails.value,
      expiresAt,
      indexingEnabled,
      tool,
      hideBranding
    }
  };
}
