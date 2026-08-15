import { describe, expect, it } from "vitest";
import {
  buildPreviewUrl,
  extractLocalPreviewSlug,
  extractPreviewSlugFromHost,
  isLocalPreviewFallbackHost,
  normalizeAppBasePath,
  previewPathFromLocalRequest,
  stripAppBasePath
} from "../src/worker/preview-routing";

describe("preview routing boundary contracts", () => {
  it("requires a dot-prefixed preview host suffix", () => {
    expect(extractPreviewSlugFromHost("demo.giga-site.com", "giga-site.com")).toBeNull();
    expect(extractPreviewSlugFromHost("demo.giga-site.com", ".giga-site.com")).toBe("demo");
  });

  it("lowercases preview slugs from hostnames", () => {
    expect(extractPreviewSlugFromHost("Campaign.GIGA-SITE.com".toLowerCase(), ".giga-site.com")).toBe("campaign");
    expect(extractPreviewSlugFromHost("Campaign.giga-site.com", ".giga-site.com")).toBe("campaign");
  });

  it("rejects empty, nested, and reserved preview host labels", () => {
    expect(extractPreviewSlugFromHost("giga-site.com", ".giga-site.com")).toBeNull();
    expect(extractPreviewSlugFromHost("nested.demo.giga-site.com", ".giga-site.com")).toBeNull();
    for (const reserved of ["app", "api", "admin", "assets", "static", "www", "mail", "ftp"]) {
      expect(extractPreviewSlugFromHost(`${reserved}.giga-site.com`, ".giga-site.com")).toBeNull();
    }
  });

  it("extracts local preview slugs only from the preview namespace", () => {
    expect(extractLocalPreviewSlug("/preview/demo")).toBe("demo");
    expect(extractLocalPreviewSlug("/preview/demo/assets/app.css")).toBe("demo");
    expect(extractLocalPreviewSlug("/previews/demo")).toBeNull();
    expect(extractLocalPreviewSlug("/app/preview/demo")).toBeNull();
  });

  it("maps local preview request paths to R2 object paths", () => {
    expect(previewPathFromLocalRequest("/preview/demo")).toBe("index.html");
    expect(previewPathFromLocalRequest("/preview/demo/")).toBe("index.html");
    expect(previewPathFromLocalRequest("/preview/demo/assets/app.css")).toBe("assets/app.css");
  });

  it("keeps local preview fallback limited to local hosts", () => {
    expect(isLocalPreviewFallbackHost("localhost")).toBe(true);
    expect(isLocalPreviewFallbackHost("127.0.0.1")).toBe(true);
    expect(isLocalPreviewFallbackHost("::1")).toBe(true);
    expect(isLocalPreviewFallbackHost("0.0.0.0")).toBe(false);
    expect(isLocalPreviewFallbackHost("giga-site.com")).toBe(false);
  });

  it("builds absolute production preview URLs and local fallback URLs", () => {
    expect(buildPreviewUrl("demo", ".giga-site.com")).toBe("https://demo.giga-site.com/");
    expect(buildPreviewUrl("demo", "/preview")).toBe("/preview/demo/");
  });

  it("normalizes app base paths", () => {
    expect(normalizeAppBasePath(undefined)).toBe("/");
    expect(normalizeAppBasePath("")).toBe("/");
    expect(normalizeAppBasePath("/")).toBe("/");
    expect(normalizeAppBasePath("app")).toBe("/app");
    expect(normalizeAppBasePath("/app/")).toBe("/app");
  });

  it("maps SPA deep links to index.html while preserving concrete asset paths", () => {
    expect(stripAppBasePath("/app/sites/site_1/revisions", "/app")).toEqual({ kind: "asset", path: "/index.html" });
    expect(stripAppBasePath("/app/assets/index.abc123.js", "/app")).toEqual({ kind: "asset", path: "/assets/index.abc123.js" });
    expect(stripAppBasePath("/app/favicon.ico", "/app")).toEqual({ kind: "asset", path: "/favicon.ico" });
  });

  it("does not let unrelated paths fall through to the app shell", () => {
    expect(stripAppBasePath("/api/health", "/app")).toEqual({ kind: "none" });
    expect(stripAppBasePath("/articles/html-share", "/app")).toEqual({ kind: "none" });
  });

  it("uses the root shell when the app base path is root", () => {
    expect(stripAppBasePath("/", "/")).toEqual({ kind: "asset", path: "/index.html" });
    expect(stripAppBasePath("/sites/site_1", "/")).toEqual({ kind: "asset", path: "/sites/site_1" });
  });
});
