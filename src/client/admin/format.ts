import type { AuthMode, SiteSummary, SiteTool } from "../../shared/types";

const JAPANESE_NUMBER_FORMATTER = new Intl.NumberFormat("ja-JP");
const SHORT_DATE_TIME_FORMATTER = new Intl.DateTimeFormat("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
const JAPAN_DATE_TIME_FORMATTER = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

export function formatNumber(value: number): string {
  return JAPANESE_NUMBER_FORMATTER.format(value);
}

export function formatBytes(value: number): string {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

export function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return SHORT_DATE_TIME_FORMATTER.format(new Date(value));
}

export function formatDate(value: string | null): string {
  if (!value) return "—";
  return SHORT_DATE_FORMATTER.format(new Date(value));
}

function formatJapanDateTime(value: string): string {
  return JAPAN_DATE_TIME_FORMATTER.format(new Date(value));
}

export function formatRelative(value: string | null): string {
  if (!value) return "—";
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}日前`;
  return formatDate(value);
}

export function isExpired(site: Pick<SiteSummary, "expiresAt">): boolean {
  return Boolean(site.expiresAt && new Date(site.expiresAt).getTime() <= Date.now());
}

export function statusLabel(site: SiteSummary): string {
  if (site.status === "deleted") return "削除済み";
  if (isExpired(site)) return "期限切れ";
  if (!site.currentRevisionId) return "下書き";
  return "公開中";
}

export function statusDot(site: SiteSummary): string {
  if (site.status === "deleted" || isExpired(site)) return "var(--destructive)";
  if (!site.currentRevisionId) return "var(--muted-foreground)";
  return "var(--success)";
}

const AUTH_LABELS: Record<AuthMode, string> = {
  random: "認証なし",
  password: "パスワード",
  email_domain: "会社ドメイン",
  email_otp: "メール認証"
};

export function authLabel(site: Pick<SiteSummary, "authMode" | "allowedEmailDomains">): string {
  if (site.authMode === "email_domain" && site.allowedEmailDomains.length > 0) {
    return `@${site.allowedEmailDomains.join(" / @")}`;
  }
  return AUTH_LABELS[site.authMode];
}

export function authBadgeStyle(authMode: AuthMode): { background: string; color: string } {
  switch (authMode) {
    case "password":
      return { background: "var(--secondary)", color: "var(--secondary-foreground)" };
    case "email_otp":
      return { background: "color-mix(in oklab, var(--ac) 11%, var(--background))", color: "var(--ac)" };
    case "email_domain":
      return { background: "color-mix(in oklab, var(--ac) 14%, var(--background))", color: "var(--ac)" };
    default:
      return { background: "var(--muted)", color: "var(--muted-foreground)" };
  }
}

export function expiryLabel(site: SiteSummary): string {
  if (!site.currentRevisionId) return "下書き";
  if (site.status === "deleted") return "削除済み";
  if (!site.expiresAt) return "無期限";
  const diffMs = new Date(site.expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return "期限切れ";
  const days = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
  return `残り${days}日`;
}

export function expiryEndLabel(site: SiteSummary): string | null {
  if (!site.currentRevisionId || site.status === "deleted" || !site.expiresAt) return null;
  const time = new Date(site.expiresAt).getTime();
  if (Number.isNaN(time)) return null;
  return `${formatJapanDateTime(site.expiresAt)} 終了`;
}

const TOOL_LABELS: Record<SiteTool, string> = {
  claude: "Claude",
  v0: "v0",
  bolt: "Bolt",
  chatgpt: "ChatGPT",
  other: "その他"
};

export function toolLabel(tool: SiteTool | null): string | null {
  return tool ? TOOL_LABELS[tool] : null;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

const SUBDOMAIN_ADJECTIVES = [
  "sunny", "cosmic", "fuzzy", "brave", "mellow", "witty", "lucky", "cozy",
  "peppy", "snazzy", "jolly", "zippy", "breezy", "plucky", "mighty", "nimble"
];
const SUBDOMAIN_NOUNS = [
  "otter", "panda", "comet", "maple", "pixel", "koala", "nimbus", "cactus",
  "puffin", "mochi", "sakura", "tanuki", "penguin", "dragon", "meteor", "walrus"
];

export function randomSubdomain(): string {
  const bytes = new Uint8Array(14);
  globalThis.crypto.getRandomValues(bytes);
  const adjective = SUBDOMAIN_ADJECTIVES[bytes[0] & 15];
  const noun = SUBDOMAIN_NOUNS[bytes[1] & 15];
  const token = Array.from(bytes.slice(2), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${adjective}-${noun}-${token}`;
}

export function formatYen(amount: number): string {
  return `¥${formatNumber(amount)}`;
}

export function previewDisplayHost(previewUrl: string): string {
  try {
    return new URL(previewUrl).host;
  } catch {
    return previewUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  }
}

export function rootHostFromOrigin(origin: string): string {
  try {
    return new URL(origin).host;
  } catch {
    return origin.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  }
}
