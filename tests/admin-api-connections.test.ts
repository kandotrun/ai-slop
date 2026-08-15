import { readFileSync } from "node:fs";
import { describe, expect, it, vi, afterEach } from "vitest";
import { api, type ApiClientError } from "../src/client/admin/api";

describe("admin API connections", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("has client calls for loading a deep-linked site and checking subdomain availability", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ site: { id: "site_123" }, available: true, normalizedSlug: "demo", reason: null }), { status: 200, headers: { "Content-Type": "application/json" } })
    );
    vi.stubGlobal("fetch", fetchMock);

    await api.site("site_123");
    await api.slugAvailability("Demo", "site_123");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/sites/site_123",
      expect.objectContaining({ credentials: "same-origin", headers: expect.objectContaining({ "Content-Type": "application/json" }) })
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/slugs/availability?slug=Demo&currentSiteId=site_123",
      expect.objectContaining({ credentials: "same-origin", headers: expect.objectContaining({ "Content-Type": "application/json" }) })
    );
  });

  it("preserves structured API error details for security override UI", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          error: "security_review_warning",
          details: { warnings: ["external_script"], canOverride: true, overrideField: "securityOverrideAccepted" }
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(api.createRevision("site_123", { html: "<!doctype html><html><body></body></html>" })).rejects.toMatchObject({
      name: "ApiClientError",
      message: "security_review_warning",
      status: 409,
      details: { warnings: ["external_script"], canOverride: true, overrideField: "securityOverrideAccepted" }
    } satisfies Partial<ApiClientError>);
  });

  it("spec: 管理画面はrevision preview tokenを落とさずreview mode URLへ変換する", async () => {
    // 仕様: review overlayは「owner用の短命preview token」+「__review=1」の両方が必要。
    // どちらかを落とすと、コメント用iframeが公開版か未認証版になってしまう。
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ previewUrl: "https://demo.giga-site.com/?__rev_preview=tok_123", expiresAt: "2026-06-22T01:00:00.000Z" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(api.reviewUrl("site_123", "rev_1")).resolves.toEqual({
      reviewUrl: "https://demo.giga-site.com/?__rev_preview=tok_123&__review=1",
      expiresAt: "2026-06-22T01:00:00.000Z"
    });
  });

  it("spec: コメント一覧はrevisionIdを必ずURL encodeして別revision/comment注入を防ぐ", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ comments: [] }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock);

    await api.comments("site_123", "rev/one?x=1&y=2");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/sites/site_123/comments?revisionId=rev%2Fone%3Fx%3D1%26y%3D2",
      expect.objectContaining({ credentials: "same-origin", headers: expect.objectContaining({ "Content-Type": "application/json" }) })
    );
  });

  it("spec: 公開後パスワード設定APIはclaimTokenをbodyに閉じ込め、URLへ漏らさない", async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response(JSON.stringify({ siteId: "site_123", authMode: "password" }), { status: 200, headers: { "Content-Type": "application/json" } })
    );
    vi.stubGlobal("fetch", fetchMock);

    await api.setAnonymousPublishPassword({ siteId: "site_123", claimToken: "claim_secret", password: "share-pass-123" });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/public/publish-password",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ siteId: "site_123", claimToken: "claim_secret", password: "share-pass-123" })
      })
    );
    expect(String(fetchMock.mock.calls[0]?.[0])).not.toContain("claim_secret");
  });

  it("maps network and non-JSON API failures to actionable client errors", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("network down"); }));
    await expect(api.health()).rejects.toThrow("サーバーに接続できませんでした");

    vi.stubGlobal("fetch", vi.fn(async () => new Response("<html>cloudflare error</html>", { status: 502, headers: { "Content-Type": "text/html" } })));
    await expect(api.health()).rejects.toThrow("request_failed_502");
  });

  it("routes support and billing CTAs to the contact form instead of mailto-only flows", () => {
    const sidebar = readFileSync("src/client/admin/Sidebar.tsx", "utf8");
    const billing = readFileSync("src/client/admin/screens/BillingScreen.tsx", "utf8");

    expect(sidebar).toContain('/contact?type=question');
    expect(billing).toContain('/contact');
    expect(`${sidebar}\n${billing}`).not.toContain('mailto:support@giga-site.com');
  });

  it("does not hard-code the production preview domain in admin site rows/details", () => {
    const dashboard = readFileSync("src/client/admin/screens/DashboardScreen.tsx", "utf8");
    const detail = readFileSync("src/client/admin/screens/DetailScreen.tsx", "utf8");
    const upload = readFileSync("src/client/admin/screens/UploadScreen.tsx", "utf8");

    expect(`${dashboard}\n${detail}`).not.toContain('{site.slug}.giga-site.com');
    expect(upload).not.toContain('.giga-site.com');
  });

  it("allows authentication forms inside the admin embedded preview iframe", () => {
    const detail = readFileSync("src/client/admin/screens/DetailScreen.tsx", "utf8");
    expect(detail).toContain('sandbox="allow-scripts allow-popups allow-forms"');
  });

  it("wires public URL editing and typed subdomain checks into admin screens", () => {
    const detail = readFileSync("src/client/admin/screens/DetailScreen.tsx", "utf8");
    const upload = readFileSync("src/client/admin/screens/UploadScreen.tsx", "utf8");

    expect(detail).toContain("公開URLを変更");
    expect(detail).toContain("api.slugAvailability");
    expect(detail).toContain("api.updateSite(site.id, { slug:");
    expect(upload).toContain("api.slugAvailability");
    expect(upload).toContain("このサブドメインは利用できます");
  });
});
