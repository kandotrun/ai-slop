import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { api, ApiClientError, type AppUser } from "../src/client/admin/api";
import { Sidebar } from "../src/client/admin/Sidebar";
import { Topbar } from "../src/client/admin/Topbar";
import { buildAdminUrl, parseAdminRoute } from "../src/client/admin/routes";

afterEach(() => vi.unstubAllGlobals());

function sidebar(user: AppUser) {
  return renderToStaticMarkup(createElement(Sidebar, {
    active: "operations", user, onNavigate: () => undefined, siteCount: 0,
    siteLimit: 3, storageBytes: 0, onSignOut: () => undefined
  }));
}

describe("operator navigation", () => {
  it("spec: opens and builds a dedicated ops deep link without breaking ordinary routes", () => {
    expect(parseAdminRoute(new URL("https://app.example.com/app/ops"))).toEqual({ screen: "operations" });
    expect(parseAdminRoute(new URL("https://app.example.com/app/ops/"))).toEqual({ screen: "operations" });
    expect(buildAdminUrl({ screen: "operations" })).toBe("/app/ops");
    expect(buildAdminUrl({ screen: "operations" }, "/manage/")).toBe("/manage/ops");
    expect(parseAdminRoute(new URL("https://app.example.com/app/?q=sample"))).toEqual({ screen: "dashboard", search: "sample" });
    expect(parseAdminRoute(new URL("https://app.example.com/app/sites/sample/comments"))).toEqual({ screen: "detail", siteId: "sample", tab: "comments" });
  });

  it("spec: exposes the operator entry only for an explicit server permission", () => {
    const user = { id: "sample-operator", email: "operator@example.com", name: "Sample Operator" };
    expect(sidebar({ ...user, isOperator: true })).toContain("<span>運営</span>");
    expect(sidebar({ ...user, isOperator: true })).toContain('aria-current="page"');
    expect(sidebar(user)).not.toContain("<span>運営</span>");
    expect(sidebar({ ...user, isOperator: false })).not.toContain("<span>運営</span>");
    expect(sidebar({ ...user, isOperator: "true" } as unknown as AppUser)).not.toContain("<span>運営</span>");
  });

  it("spec: keeps the operations topbar read-only without removing ordinary publishing", () => {
    const props = { crumb: "運営", showSearch: false, searchValue: "", onSearch: () => undefined, onUpload: () => undefined, onMenu: () => undefined };
    expect(renderToStaticMarkup(createElement(Topbar, { ...props, showUpload: false }))).not.toContain("新規公開");
    expect(renderToStaticMarkup(createElement(Topbar, props))).toContain("新規公開");
  });
});

describe("operator typed API client", () => {
  it("spec: uses read-only same-origin JSON requests with encoded filters and cancellation", async () => {
    expect(api).toHaveProperty("opsSummary", expect.any(Function));
    expect(api).toHaveProperty("opsSites", expect.any(Function));
    expect(api).toHaveProperty("opsUsers", expect.any(Function));
    const body = { items: [], total: 0, offset: 25, limit: 25, hasMore: false };
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify(body)));
    vi.stubGlobal("fetch", fetcher);
    const signal = new AbortController().signal;
    const query = { period: "7d" as const, q: "sample+tag@example.com & title", offset: 25, limit: 25 };
    expect(await api.opsSites(query, signal)).toEqual(body);
    const [path, init] = fetcher.mock.calls[0] as [string, RequestInit];
    const url = new URL(path, "https://app.example.com");
    expect(url.pathname).toBe("/api/ops/sites");
    expect(Object.fromEntries(url.searchParams)).toEqual({ period: "7d", q: query.q, offset: "25", limit: "25" });
    expect(init).toMatchObject({ credentials: "same-origin", signal });
    expect(init.method ?? "GET").toBe("GET");
    fetcher.mockResolvedValue(new Response(JSON.stringify(body)));
    await api.opsUsers(query, signal);
    expect(fetcher.mock.calls[1][0]).toContain("/api/ops/users?");
    fetcher.mockResolvedValue(new Response(JSON.stringify({ period: "all" })));
    expect(await api.opsSummary("all", signal)).toEqual({ period: "all" });
    expect(fetcher.mock.calls[2][0]).toBe("/api/ops/summary?period=all");
  });

  it("spec: preserves server authorization errors rather than granting client permissions", async () => {
    expect(api).toHaveProperty("opsSummary", expect.any(Function));
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "operator_forbidden" }), { status: 403 })));
    await expect(api.opsSummary("30d")).rejects.toMatchObject({ name: "ApiClientError", status: 403 });
    expect(new ApiClientError("operator_forbidden", 403).status).toBe(403);
  });
});
