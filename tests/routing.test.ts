import { describe, expect, it } from "vitest";
import {
  buildPreviewUrl,
  extractLocalPreviewSlug,
  extractPreviewSlugFromHost,
  isLocalPreviewFallbackHost,
  stripAppBasePath
} from "../src/worker/preview-routing";

describe("preview routing helpers", () => {
  it("extracts the site slug from first-level wildcard hosts on the root product domain", () => {
    expect(extractPreviewSlugFromHost("abc123.giga-site.com", ".giga-site.com")).toBe("abc123");
    expect(extractPreviewSlugFromHost("giga-site.com", ".giga-site.com")).toBeNull();
    expect(extractPreviewSlugFromHost("app.giga-site.com", ".giga-site.com")).toBeNull();
    expect(extractPreviewSlugFromHost("www.giga-site.com", ".giga-site.com")).toBeNull();
    expect(extractPreviewSlugFromHost("api.giga-site.com", ".giga-site.com")).toBeNull();
    expect(extractPreviewSlugFromHost("nested.abc123.giga-site.com", ".giga-site.com")).toBeNull();
  });

  it("extracts the site slug from local fallback preview paths", () => {
    expect(extractLocalPreviewSlug("/preview/abc123/index.html")).toBe("abc123");
    expect(extractLocalPreviewSlug("/api/health")).toBeNull();
  });

  it("limits local fallback preview paths to local development hosts", () => {
    expect(isLocalPreviewFallbackHost("localhost")).toBe(true);
    expect(isLocalPreviewFallbackHost("127.0.0.1")).toBe(true);
    expect(isLocalPreviewFallbackHost("giga-site.com")).toBe(false);
    expect(isLocalPreviewFallbackHost("ai-slop.example.workers.dev")).toBe(false);
  });

  it("builds production preview URLs from slug and root-domain suffix", () => {
    expect(buildPreviewUrl("abc123", ".giga-site.com")).toBe("https://abc123.giga-site.com/");
  });

  it("maps service app paths to the underlying SPA asset paths", () => {
    expect(stripAppBasePath("/", "/app")).toEqual({ kind: "asset", path: "/index.html" });
    expect(stripAppBasePath("/app", "/app")).toEqual({ kind: "redirect", path: "/app/" });
    expect(stripAppBasePath("/app/", "/app")).toEqual({ kind: "asset", path: "/index.html" });
    expect(stripAppBasePath("/app/assets/index.js", "/app")).toEqual({ kind: "asset", path: "/assets/index.js" });
    expect(stripAppBasePath("/app/sites/site_123/logs", "/app")).toEqual({ kind: "asset", path: "/index.html" });
    expect(stripAppBasePath("/api/health", "/app")).toEqual({ kind: "none" });
  });
});
