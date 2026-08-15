import { describe, expect, it } from "vitest";
import worker from "../src/worker/index";

const appShell = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="modulepreload" href="/app/assets/index-abc123.js" />
    <link rel="stylesheet" href="/app/assets/index-abc123.css" />
    <title>ギガサイト便</title>
  </head>
  <body><div id="root"></div><script type="module" src="/app/assets/index-abc123.js"></script></body>
</html>`;

function envWithAssets(shell = appShell) {
  const assetFetches: string[] = [];
  const assets = {
    async fetch(request: Request) {
      const url = new URL(request.url);
      assetFetches.push(url.pathname);
      if (url.pathname === "/og-image.png") {
        return new Response("png", { headers: { "Content-Type": "image/png" } });
      }
      return new Response(shell, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
  };
  return {
    env: {
      ASSETS: assets,
      APP_HOST: "giga-site.com",
      APP_BASE_PATH: "/app",
      PREVIEW_HOST_SUFFIX: ".giga-site.com",
      GA_MEASUREMENT_ID: "G-1FVPQXCWR5"
    } as unknown as Env,
    assetFetches
  };
}

async function fetchApp(path: string) {
  const { env, assetFetches } = envWithAssets();
  const request = new Request(`https://giga-site.com${path}`) as unknown as Parameters<typeof worker.fetch>[0];
  const response = await worker.fetch(request, env, {} as ExecutionContext);
  return { response, html: await response.text(), assetFetches };
}

describe("SEO metadata", () => {
  it("injects keyword-focused metadata for the landing page", async () => {
    const { response, html, assetFetches } = await fetchApp("/");

    expect(response.status).toBe(200);
    expect(assetFetches).toEqual(["/"]);
    expect(html).toContain("<title>HTMLを認証付きURLで共有｜ギガサイト便</title>");
    expect(html).toContain('<meta name="description" content="AIで作ったHTMLやzipを、パスワード・メール認証・会社ドメイン認証付きURLで安全に共有。サーバー不要で3秒公開できるギガサイト便。" />');
    expect(html).toContain('<meta name="keywords" content="HTML 共有, HTML 公開, zip 公開, AI生成サイト 共有, パスワード付きURL, 会社ドメイン認証" />');
    expect(html).toContain('<link rel="canonical" href="https://giga-site.com/" />');
    expect(html).toContain('<link rel="webmcp" href="https://giga-site.com/.well-known/webmcp.json" type="application/json" />');
    expect(response.headers.get("Link")).toContain('rel="webmcp"');
    expect(html).toContain('<meta property="og:type" content="website" />');
    expect(html).toContain('<meta property="og:image" content="https://giga-site.com/og-image.png" />');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(html).toContain('type="application/ld+json"');
    expect(html).toContain("SoftwareApplication");
  });

  it("emits an Organization and WebSite entity graph with social profiles", async () => {
    const { html } = await fetchApp("/");

    expect(html).toContain('"@graph"');
    expect(html).toContain('"@type":"Organization"');
    expect(html).toContain('"@id":"https://giga-site.com/#organization"');
    expect(html).toContain('"@type":"WebSite"');
    expect(html).toContain("https://www.youtube.com/@nixo0");
    expect(html).toContain("https://zenn.dev/nixo");
    expect(html).toContain("https://github.com/kandotrun");
    expect(html).toContain('<meta property="og:locale" content="ja_JP" />');
    expect(html).toContain('<meta property="og:image:alt"');
    // Still a single JSON-LD script and the homepage app entity.
    expect(html.match(/type="application\/ld\+json"/g)).toHaveLength(1);
    expect(html).toContain("SoftwareApplication");
  });

  it("enriches article JSON-LD and OGP, and drops the SPA bundle for fast static delivery", async () => {
    const { html } = await fetchApp("/articles/html-share");

    // Structured data enrichment.
    expect(html).toContain('"@type":"Article"');
    expect(html).toContain('<link rel="alternate" href="https://giga-site.com/articles/html-share/index.md" type="text/markdown" />');
    expect(html).toContain('"inLanguage":"ja"');
    expect(html).toContain('"image":"https://giga-site.com/og-image.png"');
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain('"@type":"BreadcrumbList"');
    expect(html).toContain('<meta property="article:published_time"');
    expect(html).toContain('<meta property="article:section"');

    // Core Web Vitals: the static article page must not ship the SPA bundle.
    expect(html).not.toContain('type="module"');
    expect(html).not.toContain('rel="modulepreload"');
    // ...but keeps the stylesheet and crawlable content.
    expect(html).toContain('rel="stylesheet"');
    expect(html).toContain('<article class="lp-article-detail">');
  });

  it("keeps the SPA bundle on interactive pages like the landing page", async () => {
    const { html } = await fetchApp("/");
    expect(html).toContain('type="module"');
  });

  it("serves the landing page with crawlable body content before JavaScript runs", async () => {
    const { html } = await fetchApp("/");

    expect(html).not.toContain('<div id="root"></div>');
    expect(html).toContain('<h1 class="lp-gradient-shimmer">AIで作ったHTMLを、<br />3秒で共有URLに。</h1>');
    expect(html).toContain("サーバーの設定も、デプロイの知識もいりません。");
    expect(html).toContain("シンプルな料金");
    expect(html).toContain("HTML共有の活用記事");
    expect(html).toContain('/articles/html-share');
  });

  it("adds dns-prefetch hints for deferred third-party origins, idempotently", async () => {
    const { html } = await fetchApp("/");
    expect(html).toContain('<link rel="dns-prefetch" href="https://www.googletagmanager.com" />');
    expect(html).toContain('<link rel="dns-prefetch" href="https://www.google-analytics.com" />');
    expect(html).toContain('<link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />');
    expect((html.match(/rel="dns-prefetch"/g) ?? []).length).toBe(3);

    // A shell that already carries the hints must be stripped and re-injected, not duplicated.
    const preHinted = appShell.replace(
      "<title>ギガサイト便</title>",
      '<link rel="dns-prefetch" href="https://www.googletagmanager.com" />\n    <link rel="dns-prefetch" href="https://www.google-analytics.com" />\n    <link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />\n    <title>ギガサイト便</title>'
    );
    const { env } = envWithAssets(preHinted);
    const response = await worker.fetch(new Request("https://giga-site.com/") as unknown as Parameters<typeof worker.fetch>[0], env, {} as ExecutionContext);
    const reinjected = await response.text();
    expect((reinjected.match(/rel="dns-prefetch"/g) ?? []).length).toBe(3);
  });

  it("injects Google Analytics into served HTML shells", async () => {
    const landing = await fetchApp("/");
    const app = await fetchApp("/app/billing");

    for (const html of [landing.html, app.html]) {
      expect(html).toContain("https://www.googletagmanager.com/gtag/js?id=G-1FVPQXCWR5");
      expect(html).toContain("window.dataLayer = window.dataLayer || [];");
      expect(html).toContain("gtag('config', 'G-1FVPQXCWR5');");
    }
  });

  it("defers the gtag.js network load out of the critical path", async () => {
    const { html } = await fetchApp("/");
    expect(html).toContain("requestIdleCallback");
    expect(html).toContain("document.head.appendChild");
    expect(html).toContain("https://www.googletagmanager.com/gtag/js?id=G-1FVPQXCWR5");
    expect(html).toContain("gtag('config', 'G-1FVPQXCWR5');");
  });

  it("serves indexable per-category article pages with canonical metadata", async () => {
    const { html } = await fetchApp("/articles/category/ai");
    expect(html).toContain("<title>AI活用の活用記事｜ギガサイト便</title>");
    expect(html).toContain('<link rel="canonical" href="https://giga-site.com/articles/category/ai" />');
    expect(html).toContain('<meta name="robots" content="index,follow" />');
    expect(html).not.toContain('type="module"');
    expect(html).toContain('rel="stylesheet"');
    // category hubs are CollectionPages (like the /articles index), not generic WebPage
    expect(html).toContain('"@type":"CollectionPage"');
    expect(html).toContain('"url":"https://giga-site.com/articles/category/ai"');
  });

  it("includes per-category article pages in the sitemap with priority", async () => {
    const { env } = envWithAssets();
    const sitemap = await worker.fetch(new Request("https://giga-site.com/sitemap.xml") as unknown as Parameters<typeof worker.fetch>[0], env, {} as ExecutionContext);
    const xml = await sitemap.text();
    expect(xml).toContain("<loc>https://giga-site.com/articles/category/ai</loc>");
    expect(xml).toContain("<loc>https://giga-site.com/articles/category/html-share</loc>");
    expect(xml).toContain("<loc>https://giga-site.com/articles</loc>");
    expect(xml).not.toContain("/app/");
  });

  it("serves paginated category pages with page-specific canonical, title, and CollectionPage", async () => {
    const { html } = await fetchApp("/articles/category/ai/page/2");
    expect(html).toContain('<link rel="canonical" href="https://giga-site.com/articles/category/ai/page/2" />');
    expect(html).toContain("（2ページ目）");
    expect(html).toContain('<meta name="robots" content="index,follow" />');
    expect(html).toContain('"@type":"CollectionPage"');
    expect(html).not.toContain('type="module"');
    // page 1 keeps the clean canonical title (no page suffix)
    const page1 = await fetchApp("/articles/category/ai");
    expect(page1.html).toContain("<title>AI活用の活用記事｜ギガサイト便</title>");
  });

  it("lists paginated category pages in the sitemap", async () => {
    const { env } = envWithAssets();
    const sitemap = await worker.fetch(new Request("https://giga-site.com/sitemap.xml") as unknown as Parameters<typeof worker.fetch>[0], env, {} as ExecutionContext);
    const xml = await sitemap.text();
    expect(xml).toContain("<loc>https://giga-site.com/articles/category/ai</loc>");
    expect(xml).toContain("<loc>https://giga-site.com/articles/category/ai/page/2</loc>");
  });

  it("serves indexable support pages with crawlable body content", async () => {
    const expectations: Array<[string, string]> = [
      ["/contact", "お問い合わせ"],
      ["/terms", "利用規約"],
      ["/privacy", "プライバシーポリシー"],
      ["/commerce", "特定商取引法に基づく表記"],
      ["/refund-policy", "返金・キャンセルポリシー"]
    ];

    for (const [path, heading] of expectations) {
      const { html } = await fetchApp(path);
      expect(html).not.toContain('<div id="root"></div>');
      expect(html).toContain(`<h1>${heading}</h1>`);
      expect(html).toContain('<meta name="robots" content="index,follow" />');
    }
  });

  it("uses route-specific title, description, canonical URL, and robots policy", async () => {
    const contact = await fetchApp("/contact?type=question");
    expect(contact.html).toContain("<title>お問い合わせ｜ギガサイト便</title>");
    expect(contact.html).toContain('<link rel="canonical" href="https://giga-site.com/contact" />');
    expect(contact.html).toContain('<meta name="robots" content="index,follow" />');
    expect(contact.response.headers.get("X-Robots-Tag")).toBeNull();

    const app = await fetchApp("/app/billing");
    expect(app.html).toContain("<title>管理画面｜ギガサイト便</title>");
    expect(app.html).toContain('<meta name="robots" content="noindex,nofollow" />');
    expect(app.response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });

  it("strips stale shell SEO tags before injecting route metadata", async () => {
    const staleShell = `<!doctype html><html><head>
      <meta name="viewport" content="width=device-width" />
      <title>Old title</title>
      <meta name="description" content="old description" />
      <meta name="robots" content="noindex,nofollow" />
      <link rel="canonical" href="https://old.example/" />
      <meta property="og:title" content="Old OGP" />
      <meta name="twitter:title" content="Old Twitter" />
      <script type="application/ld+json">{"old":true}</script>
    </head><body><div id="root"></div></body></html>`;
    const { env, assetFetches } = envWithAssets(staleShell);
    const response = await worker.fetch(new Request("https://giga-site.com/") as unknown as Parameters<typeof worker.fetch>[0], env, {} as ExecutionContext);
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(assetFetches).toEqual(["/"]);
    expect(html.match(/<title>/g)).toHaveLength(1);
    expect(html.match(/name="description"/g)).toHaveLength(1);
    expect(html.match(/rel="canonical"/g)).toHaveLength(1);
    expect(html.match(/property="og:title"/g)).toHaveLength(1);
    expect(html.match(/type="application\/ld\+json"/g)).toHaveLength(1);
    expect(html).toContain("HTMLを認証付きURLで共有｜ギガサイト便");
    expect(html).not.toContain("Old title");
    expect(html).not.toContain("old description");
    expect(html).not.toContain("Old OGP");
    expect(html).not.toContain('"old":true');
  });

  it("keeps bundled assets on the asset route instead of the SEO shell", async () => {
    const { env, assetFetches } = envWithAssets();
    const request = new Request("https://giga-site.com/app/assets/index.js") as unknown as Parameters<typeof worker.fetch>[0];
    const response = await worker.fetch(request, env, {} as ExecutionContext);

    expect(response.status).toBe(200);
    expect(assetFetches).toEqual(["/assets/index.js"]);
  });

  it("marks hash-named bundled assets as immutable browser-cacheable files", async () => {
    const { env, assetFetches } = envWithAssets();
    const request = new Request("https://giga-site.com/app/assets/index-AbCd1234.js") as unknown as Parameters<typeof worker.fetch>[0];
    const response = await worker.fetch(request, env, {} as ExecutionContext);

    expect(response.status).toBe(200);
    expect(assetFetches).toEqual(["/assets/index-AbCd1234.js"]);
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=31536000, immutable");
  });

  it("serves WebMCP discovery endpoints for browser agents", async () => {
    const { env } = envWithAssets();
    const manifest = await worker.fetch(new Request("https://giga-site.com/.well-known/webmcp.json") as unknown as Parameters<typeof worker.fetch>[0], env, {} as ExecutionContext);
    const manifestJson = await manifest.json() as { browserApi: string; tools: Array<{ name: string }> };

    expect(manifest.status).toBe(200);
    expect(manifest.headers.get("Cache-Control")).toContain("max-age=300");
    expect(manifestJson.browserApi).toBe("navigator.modelContext");
    expect(manifestJson.tools.map((tool) => tool.name)).toContain("giga_site_get_upload_prompt");

    const page = await worker.fetch(new Request("https://giga-site.com/mcp") as unknown as Parameters<typeof worker.fetch>[0], env, {} as ExecutionContext);
    const html = await page.text();

    expect(page.status).toBe(200);
    expect(page.headers.get("Link")).toContain('rel="webmcp"');
    expect(html).toContain("ギガサイト便 WebMCP");
    expect(html).toContain("/.well-known/webmcp.json");
  });

  it("serves brand SVG assets from the root public paths", async () => {
    const { env, assetFetches } = envWithAssets();

    const faviconRequest = new Request("https://giga-site.com/favicon.svg") as unknown as Parameters<typeof worker.fetch>[0];
    const logoRequest = new Request("https://giga-site.com/%E3%82%AE%E3%82%AC%E3%82%B5%E3%82%A4%E3%83%88%E4%BE%BF.svg") as unknown as Parameters<typeof worker.fetch>[0];
    const favicon = await worker.fetch(faviconRequest, env, {} as ExecutionContext);
    const logo = await worker.fetch(logoRequest, env, {} as ExecutionContext);

    expect(favicon.status).toBe(200);
    expect(logo.status).toBe(200);
    expect(assetFetches).toEqual(["/favicon.svg", "/%E3%82%AE%E3%82%AC%E3%82%B5%E3%82%A4%E3%83%88%E4%BE%BF.svg"]);
  });

  it("serves the OGP image as a raw asset instead of the SEO HTML shell", async () => {
    const { env, assetFetches } = envWithAssets();
    const response = await worker.fetch(new Request("https://giga-site.com/og-image.png") as unknown as Parameters<typeof worker.fetch>[0], env, {} as ExecutionContext);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("image/png");
    expect(await response.text()).toBe("png");
    expect(assetFetches).toEqual(["/og-image.png"]);
  });

  it("serves robots.txt and sitemap.xml for crawl discovery", async () => {
    const { env } = envWithAssets();
    const robotsRequest = new Request("https://giga-site.com/robots.txt") as unknown as Parameters<typeof worker.fetch>[0];
    const robots = await worker.fetch(robotsRequest, env, {} as ExecutionContext);
    const robotsText = await robots.text();

    expect(robots.status).toBe(200);
    expect(robots.headers.get("Content-Type")).toContain("text/plain");
    expect(robotsText).toContain("Allow: /");
    expect(robotsText).toContain("Disallow: /app/");
    expect(robotsText).toContain("Disallow: /api/");
    expect(robotsText).toContain("Disallow: /preview-auth/");
    expect(robotsText).toContain("Disallow: /preview-email-auth/");
    expect(robotsText).toContain("Sitemap: https://giga-site.com/sitemap.xml");

    const sitemapRequest = new Request("https://giga-site.com/sitemap.xml") as unknown as Parameters<typeof worker.fetch>[0];
    const sitemap = await worker.fetch(sitemapRequest, env, {} as ExecutionContext);
    const xml = await sitemap.text();

    expect(sitemap.status).toBe(200);
    expect(sitemap.headers.get("Content-Type")).toContain("application/xml");
    expect(xml).toContain("<loc>https://giga-site.com/</loc>");
    expect(xml).toContain("<loc>https://giga-site.com/contact</loc>");
    expect(xml).toContain("<loc>https://giga-site.com/terms</loc>");
    expect(xml).not.toContain("/app/");
  });
});
