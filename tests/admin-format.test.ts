import { describe, expect, it, vi } from "vitest";
import type { SiteSummary } from "../src/shared/types";
import {
  authLabel,
  expiryLabel,
  formatBytes,
  formatNumber,
  formatRelative,
  previewDisplayHost,
  rootHostFromOrigin,
  slugify,
  statusLabel,
  toolLabel
} from "../src/client/admin/format";

function site(overrides: Partial<SiteSummary> = {}): SiteSummary {
  return {
    id: "site_1",
    slug: "demo-site",
    title: "Demo Site",
    status: "active",
    authMode: "random",
    allowedEmailDomains: [],
    allowedEmails: [],
    indexingEnabled: false,
    hideBranding: false,
    tool: null,
    previewUrl: "https://demo-site.giga-site.com/",
    expiresAt: null,
    currentRevisionId: "rev_1",
    createdAt: "2026-06-20T00:00:00.000Z",
    updatedAt: "2026-06-20T00:00:00.000Z",
    metrics: { views: 0, authViews: 0, uniqueVisitors: 0, totalBytes: 0, lastSeenAt: null },
    ...overrides
  };
}

describe("admin formatting helpers", () => {
  it("labels site status and expiry from publish state", () => {
    vi.setSystemTime(new Date("2026-06-20T00:00:00.000Z"));

    expect(statusLabel(site())).toBe("公開中");
    expect(statusLabel(site({ currentRevisionId: null }))).toBe("下書き");
    expect(statusLabel(site({ status: "deleted" }))).toBe("削除済み");
    expect(statusLabel(site({ expiresAt: "2026-06-19T23:59:59.000Z" }))).toBe("期限切れ");

    expect(expiryLabel(site({ currentRevisionId: null }))).toBe("下書き");
    expect(expiryLabel(site({ status: "deleted" }))).toBe("削除済み");
    expect(expiryLabel(site({ expiresAt: null }))).toBe("無期限");
    expect(expiryLabel(site({ expiresAt: "2026-06-27T00:00:00.000Z" }))).toBe("残り7日");
    expect(expiryLabel(site({ expiresAt: "2026-06-19T23:59:59.000Z" }))).toBe("期限切れ");
  });

  it("formats auth, tool, number, byte, and relative labels", () => {
    vi.setSystemTime(new Date("2026-06-20T12:00:00.000Z"));

    expect(authLabel(site({ authMode: "random" }))).toBe("認証なし");
    expect(authLabel(site({ authMode: "password" }))).toBe("パスワード");
    expect(authLabel(site({ authMode: "email_otp" }))).toBe("メール認証");
    expect(authLabel(site({ authMode: "email_domain", allowedEmailDomains: ["example.com", "2-38.com"] }))).toBe("@example.com / @2-38.com");
    expect(toolLabel("claude")).toBe("Claude");
    expect(toolLabel(null)).toBeNull();
    expect(formatNumber(1234567)).toBe("1,234,567");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2.0 KB");
    expect(formatBytes(2 * 1024 * 1024)).toBe("2.0 MB");
    expect(formatRelative("2026-06-20T11:59:30.000Z")).toBe("たった今");
    expect(formatRelative("2026-06-20T11:45:00.000Z")).toBe("15分前");
    expect(formatRelative("2026-06-20T09:00:00.000Z")).toBe("3時間前");
  });

  it("normalizes hosts and safe slugs for admin display", () => {
    expect(previewDisplayHost("https://demo.giga-site.com/path?q=1")).toBe("demo.giga-site.com");
    expect(previewDisplayHost("http://localhost:8787/preview/demo/")).toBe("localhost:8787");
    expect(previewDisplayHost("not-a-url///")).toBe("not-a-url");
    expect(rootHostFromOrigin("https://giga-site.com/app/")).toBe("giga-site.com");
    expect(rootHostFromOrigin("giga-site.com///")).toBe("giga-site.com");
    expect(slugify("My Cool Site.HTML")).toBe("my-cool-site");
    expect(slugify("A".repeat(80))).toHaveLength(40);
  });
});
