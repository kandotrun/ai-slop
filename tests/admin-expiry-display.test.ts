import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { DashboardScreen } from "../src/client/admin/screens/DashboardScreen";
import { DetailScreen } from "../src/client/admin/screens/DetailScreen";
import { expiryEndLabel } from "../src/client/admin/format";
import type { DashboardStats, SiteSummary } from "../src/shared/types";

function site(overrides: Partial<SiteSummary> = {}): SiteSummary {
  return {
    id: "site_1",
    slug: "demo-site",
    title: "期限付きサイト",
    status: "active",
    authMode: "random",
    allowedEmailDomains: [],
    allowedEmails: [],
    indexingEnabled: false,
    hideBranding: false,
    tool: null,
    previewUrl: "https://demo-site.giga-site.com/",
    expiresAt: "2026-06-27T00:30:00.000Z",
    currentRevisionId: "rev_1",
    createdAt: "2026-06-20T00:00:00.000Z",
    updatedAt: "2026-06-20T00:00:00.000Z",
    metrics: { views: 12, authViews: 0, uniqueVisitors: 3, totalBytes: 2048, lastSeenAt: null },
    ...overrides
  };
}

const stats: DashboardStats = {
  activeSites: 1,
  totalSites: 1,
  monthlyViews: 12,
  monthlyAuthViews: 0,
  totalBytes: 2048,
  weeklySiteDelta: 0,
  monthlyViewChangePct: null
};

describe("admin expiry end-time display", () => {
  it("formats the exact public expiry end time for expiring sites", () => {
    expect(expiryEndLabel(site())).toBe("2026/06/27 09:30 終了");
    expect(expiryEndLabel(site({ expiresAt: null }))).toBeNull();
    expect(expiryEndLabel(site({ currentRevisionId: null }))).toBeNull();
    expect(expiryEndLabel(site({ status: "deleted" }))).toBeNull();
  });

  it("shows both remaining days and the exact end time in the dashboard list", () => {
    vi.setSystemTime(new Date("2026-06-20T00:30:00.000Z"));

    const html = renderToStaticMarkup(
      createElement(DashboardScreen, {
        stats,
        sites: [site()],
        totalCount: 1,
        activeCount: 1,
        searching: false,
        onOpen: () => undefined
      })
    );

    expect(html).toContain("残り7日");
    expect(html).toContain("2026/06/27 09:30 終了");
  });

  it("shows the exact expiry end time on the site detail overview", () => {
    vi.setSystemTime(new Date("2026-06-20T00:30:00.000Z"));

    const html = renderToStaticMarkup(
      createElement(DetailScreen, {
        site: site(),
        events: [],
        tab: "overview",
        onTab: () => undefined,
        onBack: () => undefined,
        onChanged: () => undefined,
        onDeleted: () => undefined,
        setStatus: () => undefined,
        onError: () => undefined
      })
    );

    expect(html).toContain("公開期限");
    expect(html).toContain("残り7日");
    expect(html).toContain("2026/06/27 09:30 終了");
    expect(html).toContain("公開期間を更新");
    expect(html).toContain("更新する");
  });

  it("does not show renewal action for unlimited sites", () => {
    const html = renderToStaticMarkup(
      createElement(DetailScreen, {
        site: site({ expiresAt: null }),
        events: [],
        tab: "overview",
        onTab: () => undefined,
        onBack: () => undefined,
        onChanged: () => undefined,
        onDeleted: () => undefined,
        setStatus: () => undefined,
        onError: () => undefined
      })
    );

    expect(html).not.toContain("公開期間を更新");
    expect(html).toContain("無期限");
  });
});
