import { describe, expect, it } from "vitest";
import { injectBrandingBadge, shouldInjectBranding } from "../src/worker/preview";
import type { SiteRow } from "../src/worker/db";

function siteRow(overrides: Partial<SiteRow>): SiteRow {
  return {
    id: "s1",
    owner_user_id: "o1",
    slug: "demo",
    title: "Demo",
    status: "active",
    auth_mode: "random",
    password_hash: null,
    allowed_email_domains: "[]",
    allowed_emails: "[]",
    indexing_enabled: 0,
    hide_branding: 0,
    tool: null,
    expires_at: null,
    current_revision_id: "rev1",
    created_at: "2026-06-19T00:00:00.000Z",
    updated_at: "2026-06-19T00:00:00.000Z",
    deleted_at: null,
    ...overrides
  };
}

describe("preview branding injection", () => {
  it("injects the badge right before the closing body tag", () => {
    const out = injectBrandingBadge("<html><body><h1>Hi</h1></body></html>");
    expect(out).toContain("ギガサイト便");
    expect(out.indexOf("ギガサイト便")).toBeLessThan(out.lastIndexOf("</body>"));
    expect(out.indexOf("<h1>Hi</h1>")).toBeLessThan(out.indexOf("ギガサイト便"));
  });

  it("appends the badge when there is no body tag", () => {
    const out = injectBrandingBadge("<h1>Hi</h1>");
    expect(out.startsWith("<h1>Hi</h1>")).toBe(true);
    expect(out).toContain("ギガサイト便");
  });

  it("injects on HTML responses when branding is shown", () => {
    expect(shouldInjectBranding(siteRow({ hide_branding: 0 }), "index.html", "text/html; charset=utf-8")).toBe(true);
  });

  it("does not inject when branding is hidden", () => {
    expect(shouldInjectBranding(siteRow({ hide_branding: 1 }), "index.html", "text/html; charset=utf-8")).toBe(false);
  });

  it("does not inject on non-HTML assets", () => {
    expect(shouldInjectBranding(siteRow({ hide_branding: 0 }), "app.js", "text/javascript")).toBe(false);
    expect(shouldInjectBranding(siteRow({ hide_branding: 0 }), "logo.png", "image/png")).toBe(false);
  });
});
