export type HtmlWarning =
  | "possible_secret"
  | "external_form_action"
  | "external_script"
  | "php_file"
  | "ai_security_medium"
  | "ai_security_high"
  | "ai_security_review_unavailable";

export interface HtmlValidationResult {
  ok: boolean;
  byteLength: number;
  error?: "empty_html" | "html_too_large" | "missing_html_marker";
}

const secretPatterns = [
  /sk-[A-Za-z0-9_-]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /gho_[A-Za-z0-9_]{20,}/,
  /AKIA[0-9A-Z]{16}/,
  /AIza[0-9A-Za-z_-]{20,}/,
  /(?:api[_-]?key|token|secret)\s*[:=]\s*["'][^"']{16,}["']/i
];

function globalPattern(pattern: RegExp): RegExp {
  return new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
}

export function redactLikelySecretsForReview(input: string): string {
  let redacted = input;
  for (const pattern of secretPatterns) {
    redacted = redacted.replace(globalPattern(pattern), "[REDACTED_POSSIBLE_SECRET]");
  }
  return redacted;
}

export function validateUploadedHtml(html: string, maxBytes: number): HtmlValidationResult {
  const byteLength = new TextEncoder().encode(html).byteLength;
  if (byteLength === 0 || html.trim().length === 0) {
    return { ok: false, byteLength, error: "empty_html" };
  }
  if (byteLength > maxBytes) {
    return { ok: false, byteLength, error: "html_too_large" };
  }
  if (!/<html[\s>]|<!doctype html/i.test(html)) {
    return { ok: false, byteLength, error: "missing_html_marker" };
  }
  return { ok: true, byteLength };
}

export function scanHtmlForWarnings(html: string): HtmlWarning[] {
  const warnings = new Set<HtmlWarning>();
  if (secretPatterns.some((pattern) => pattern.test(html))) {
    warnings.add("possible_secret");
  }
  if (/<form\b[^>]*\baction\s*=\s*["']https?:\/\//i.test(html)) {
    warnings.add("external_form_action");
  }
  if (/<script\b[^>]*\bsrc\s*=\s*["']https?:\/\//i.test(html)) {
    warnings.add("external_script");
  }
  return [...warnings];
}

export function scanPathForWarnings(path: string): HtmlWarning[] {
  return path.toLowerCase().endsWith(".php") ? ["php_file"] : [];
}

export function normalizeR2Path(pathname: string): string | null {
  const withoutLeadingSlash = pathname.replace(/^\/+/, "") || "index.html";
  const segments = withoutLeadingSlash.split("/");
  if (segments.some((segment) => segment === ".." || segment === "" || segment.includes("\\"))) {
    return null;
  }
  return segments.join("/");
}

export function contentTypeFromPath(path: string): string {
  const lower = path.toLowerCase();
  if (lower.endsWith(".html") || lower.endsWith(".htm")) return "text/html; charset=utf-8";
  if (lower.endsWith(".css")) return "text/css; charset=utf-8";
  if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "text/javascript; charset=utf-8";
  if (lower.endsWith(".json")) return "application/json; charset=utf-8";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".ico")) return "image/x-icon";
  if (lower.endsWith(".woff")) return "font/woff";
  if (lower.endsWith(".woff2")) return "font/woff2";
  if (lower.endsWith(".ttf")) return "font/ttf";
  if (lower.endsWith(".txt")) return "text/plain; charset=utf-8";
  return "application/octet-stream";
}
