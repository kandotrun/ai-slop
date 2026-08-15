import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/client/App";
import { LandingPage } from "../src/client/LandingPage";
import { FEATURED_ARTICLE_LINKS } from "../src/shared/featured-articles";
import { FORM_FEATURE_BULLETS, FORM_FEATURE_NAME, FORM_FEATURE_STATUS_LABEL, FORM_FEATURE_TAGLINE } from "../src/shared/form-feature";
import { renderStaticLandingHtmlForPathname } from "../src/shared/landing-static";
import worker from "../src/worker/index";

function renderPath(pathname: string) {
  vi.stubGlobal("window", { location: { href: `https://giga-site.com${pathname}`, pathname, search: "" } });
  return renderToStaticMarkup(createElement(App));
}

function envWithAssets() {
  const assetFetches: string[] = [];
  const assets = {
    async fetch(request: Request) {
      const url = new URL(request.url);
      assetFetches.push(url.pathname);
      return new Response("<div id=\"root\"></div>", {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }
  };
  return {
    env: {
      ASSETS: assets,
      APP_HOST: "giga-site.com",
      APP_BASE_PATH: "/app",
      PREVIEW_HOST_SUFFIX: ".giga-site.com"
    } as unknown as Env,
    assetFetches
  };
}

function extractLandingNav(html: string): string {
  const match = html.match(/<nav[^>]*aria-label="LP navigation"[^>]*>([\s\S]*?)<\/nav>/);
  if (!match) throw new Error("landing_nav_missing");
  return match[1].replace(/<a[^>]*class="[^"]*lp-nav-login[^"]*"[^>]*>[\s\S]*?<\/a>/, "");
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("legal pages", () => {
  it("renders each public legal page from the app router", () => {
    expect(renderPath("/terms")).toContain("利用規約");
    expect(renderPath("/privacy")).toContain("プライバシーポリシー");
    expect(renderPath("/privacy/")).toContain("プライバシーポリシー");
    expect(renderPath("/commerce")).toContain("特定商取引法に基づく表記");
    expect(renderPath("/refund-policy")).toContain("返金・キャンセルポリシー");
  });

  it("links every legal page from the landing footer", () => {
    const html = renderToStaticMarkup(createElement(LandingPage));

    expect(html).toContain("/terms");
    expect(html).toContain("/privacy");
    expect(html).toContain("/commerce");
    expect(html).toContain("/refund-policy");
  });

  it("links published feature articles from the landing footer in React and static HTML", () => {
    const reactHtml = renderToStaticMarkup(createElement(LandingPage));
    const staticHtml = renderStaticLandingHtmlForPathname("/") ?? "";

    for (const html of [reactHtml, staticHtml]) {
      expect(html).toContain("紹介記事");
      for (const link of FEATURED_ARTICLE_LINKS) {
        expect(html).toContain(link.label);
        expect(html).toContain(link.href);
      }
    }
  });

  it("renders the named form feature teaser in React and static landing HTML", () => {
    const reactHtml = renderToStaticMarkup(createElement(LandingPage));
    const staticHtml = renderStaticLandingHtmlForPathname("/") ?? "";

    for (const html of [reactHtml, staticHtml]) {
      expect(html).toContain(`id="form-bin"`);
      expect(html).toContain(FORM_FEATURE_NAME);
      expect(html).toContain(FORM_FEATURE_STATUS_LABEL);
      expect(html).toContain(FORM_FEATURE_TAGLINE);
      expect(html).toContain("data-giga-form");
      for (const bullet of FORM_FEATURE_BULLETS) {
        expect(html).toContain(bullet);
      }
    }
  });

  it("keeps the landing header navigation compact enough for desktop", () => {
    const reactNav = extractLandingNav(renderToStaticMarkup(createElement(LandingPage)));
    const staticNav = extractLandingNav(renderStaticLandingHtmlForPathname("/") ?? "");

    for (const nav of [reactNav, staticNav]) {
      expect((nav.match(/<a\b/g) ?? []).length).toBeLessThanOrEqual(5);
      expect(nav).not.toContain("フォーム便");
      expect(nav).not.toContain("AIに依頼");
      expect(nav).not.toContain("会社ドメイン認証");
      expect(nav).not.toContain("実績・法人");
    }
  });

  it("serves public legal deep links through the Worker asset shell", async () => {
    const { env, assetFetches } = envWithAssets();

    const request = new Request("https://giga-site.com/terms/") as unknown as Parameters<typeof worker.fetch>[0];
    const response = await worker.fetch(request, env, {} as ExecutionContext);

    expect(response.status).toBe(200);
    expect(assetFetches).toEqual(["/"]);
  });

  it("shows commerce terms without inventing unpublished address or phone values", () => {
    const html = renderPath("/commerce");

    expect(html).toContain("二宮 貫");
    expect(html).toContain("請求があった場合に遅滞なく開示します");
    expect(html).toContain("kan@2-38.com");
    expect(html).toContain("¥980");
    expect(html).toContain("Stripe");
  });
});
