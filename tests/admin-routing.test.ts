import { describe, expect, it } from "vitest";
import { buildAdminUrl, parseAdminRoute } from "../src/client/admin/routes";

describe("admin URL routing", () => {
  it("restores the dashboard route and search query from /app/", () => {
    expect(parseAdminRoute(new URL("https://giga-site.com/app/?q=demo"))).toEqual({ screen: "dashboard", search: "demo" });
  });

  it("restores top-level admin screens from path", () => {
    expect(parseAdminRoute(new URL("https://giga-site.com/app/upload"))).toEqual({ screen: "upload" });
    expect(parseAdminRoute(new URL("https://giga-site.com/app/billing"))).toEqual({ screen: "billing" });
  });

  it("restores selected site and tab from nested paths", () => {
    expect(parseAdminRoute(new URL("https://giga-site.com/app/sites/site_123/auth"))).toEqual({ screen: "detail", siteId: "site_123", tab: "auth" });
    expect(parseAdminRoute(new URL("https://giga-site.com/app/sites/site_123/forms"))).toEqual({ screen: "detail", siteId: "site_123", tab: "forms" });
    expect(parseAdminRoute(new URL("https://giga-site.com/app/sites/site_123/logs"))).toEqual({ screen: "detail", siteId: "site_123", tab: "logs" });
    expect(parseAdminRoute(new URL("https://giga-site.com/app/sites/site_123"))).toEqual({ screen: "detail", siteId: "site_123", tab: "overview" });
  });

  it("builds shareable admin URLs for navigation state", () => {
    expect(buildAdminUrl({ screen: "dashboard", search: "demo" })).toBe("/app/?q=demo");
    expect(buildAdminUrl({ screen: "upload" })).toBe("/app/upload");
    expect(buildAdminUrl({ screen: "billing" })).toBe("/app/billing");
    expect(buildAdminUrl({ screen: "detail", siteId: "site_123", tab: "overview" })).toBe("/app/sites/site_123");
    expect(buildAdminUrl({ screen: "detail", siteId: "site_123", tab: "forms" })).toBe("/app/sites/site_123/forms");
    expect(buildAdminUrl({ screen: "detail", siteId: "site_123", tab: "logs" })).toBe("/app/sites/site_123/logs");
  });
});
