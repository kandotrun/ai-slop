import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LandingPage } from "../src/client/LandingPage";
import { ARTICLES, ARTICLE_CATEGORIES, CATEGORY_PAGE_SIZE, categoryPagePath, getArticleByPathname, getArticleBySlug, getCategoryByName, getCategoryPage, getRelatedArticles, categoryPath, parseCategoryPathname, renderStaticArticleHtmlForPathname } from "../src/shared/articles";
import { FEATURED_ARTICLE_LINKS } from "../src/shared/featured-articles";
import { ARTICLES_MARKDOWN_INDEX_PATH, LLMS_TXT_PATH, articleMarkdownPath, buildLlmsTxt, renderMarkdownForPathname } from "../src/shared/markdown";
import worker from "../src/worker/index";

const appShell = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ギガサイト便</title>
  </head>
  <body><div id="root"></div></body>
</html>`;

function renderArticle(pathname: string): string {
  return renderStaticArticleHtmlForPathname(pathname) ?? "";
}

function envWithAssets(shell = appShell) {
  const assetFetches: string[] = [];
  const assets = {
    async fetch(request: Request) {
      const url = new URL(request.url);
      assetFetches.push(url.pathname);
      return new Response(shell, { headers: { "Content-Type": "text/html; charset=utf-8" } });
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

async function fetchArticle(pathname: string) {
  const { env, assetFetches } = envWithAssets();
  const response = await worker.fetch(new Request(`https://giga-site.com${pathname}`) as unknown as Parameters<typeof worker.fetch>[0], env, {} as ExecutionContext);
  return { response, html: await response.text(), assetFetches };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("public article pages", () => {
  it("renders the articles index and article detail pages from the static renderer", () => {
    const index = renderArticle("/articles");
    expect(index).toContain("ギガサイト便 活用記事");
    expect(index).toContain("/articles/category/html-share");

    const detail = renderArticle("/articles/html-share");
    expect(detail).toContain("HTMLファイルをURLで共有する方法");
    expect(detail).toContain("相手はブラウザでリンクを開くだけです");
    expect(detail).toContain("無料でHTMLをURL化する");
  });

  it("renders a per-category page that lists only that category's articles", () => {
    const sample = ARTICLES[0];
    const category = getCategoryByName(sample.category);
    expect(category).not.toBeNull();
    const page = renderStaticArticleHtmlForPathname(categoryPath(category!.slug)) ?? "";
    expect(page).toContain("lp-article-topbar");
    expect(page).toContain("lp-article-footer");
    expect(page).toContain(`${sample.category}の活用記事`);
    expect(page).toContain(sample.path);
    expect(page).toContain('<a href="/articles">活用記事</a>');
    // lists ONLY this category: an article from a different category must not appear
    const other = ARTICLES.find((a) => a.category !== sample.category)!;
    expect(other).toBeDefined();
    expect(page).not.toContain(`href="${other.path}"`);
    expect(renderStaticArticleHtmlForPathname("/articles/category/does-not-exist")).toBeNull();
  });

  it("renders a self-contained page chrome (header + footer) so article pages need no client JS", () => {
    const detail = renderArticle("/articles/html-share");
    expect(detail).toContain("lp-article-topbar");
    expect(detail).toContain("lp-article-footer");
    // brand + primary CTA live in the static header
    expect(detail).toContain("giga-brand");
    expect(detail).toContain("HTMLをURL化");

    const index = renderArticle("/articles");
    expect(index).toContain("lp-article-topbar");
    expect(index).toContain("lp-article-footer");
    for (const link of FEATURED_ARTICLE_LINKS) {
      expect(index).toContain(link.href);
      expect(detail).toContain(link.href);
    }
  });

  it("renders reading aids: breadcrumb, table of contents, FAQ accordion, and related articles", () => {
    const detail = renderArticle("/articles/html-share");
    // breadcrumb trail
    expect(detail).toContain("lp-article-breadcrumb");
    expect(detail).toContain(">活用記事<");
    // table of contents linking to section anchors
    expect(detail).toContain("lp-article-toc");
    expect(detail).toContain('id="section-1"');
    expect(detail).toContain('href="#section-1"');
    // FAQ accordion (works without JS via <details>)
    expect(detail).toContain("lp-article-faq");
    expect(detail).toContain("会員登録は必要ですか");
    expect(detail).toContain("<details");
    // related section shows category labels, reading time, and a link to the category hub
    expect(detail).toContain("lp-article-related");
    expect(detail).toContain("分で読める");
    expect(detail).toContain("の記事をもっと見る →");
  });

  it("spec: 記事CTAは検索意図ごとの具体アクションに寄せ、途中と末尾で計測できる", () => {
    const htmlShare = renderArticle("/articles/html-share");
    expect(htmlShare).toContain("無料でHTMLをURL化する");
    expect(htmlShare).toContain('data-measure-placement="article_mid"');
    expect(htmlShare).toContain('data-measure-placement="article_bottom"');
    expect(htmlShare).toContain('data-measure-intent="html_share"');

    const chatgpt = renderArticle("/articles/share-chatgpt-html");
    expect(chatgpt).toContain("ChatGPTで作ったHTMLを共有する");
    expect(chatgpt).toContain("貼り付けて共有URLを作る");
    expect(chatgpt).toContain('data-measure-intent="chatgpt_html"');

    const zip = renderArticle("/articles/zip-site-publish");
    expect(zip).toContain("ZIPをアップロードしてURL化する");
    expect(zip).toContain('data-measure-intent="zip_publish"');

    const password = renderArticle("/articles/password-protected-preview");
    expect(password).toContain("パスワード付きURLを作る");
    expect(password).toContain('data-measure-intent="password_preview"');
  });

  it("serves article pages as initial crawlable HTML with Article SEO metadata", async () => {
    const { response, html, assetFetches } = await fetchArticle("/articles/html-share");

    expect(response.status).toBe(200);
    expect(assetFetches).toEqual(["/"]);
    expect(html).toContain("<title>HTMLファイルをURLで共有する方法｜ギガサイト便</title>");
    expect(html).toContain('<link rel="canonical" href="https://giga-site.com/articles/html-share" />');
    expect(html).toContain('<link rel="alternate" href="https://giga-site.com/articles/html-share/index.md" type="text/markdown" />');
    expect(html).toContain('<meta property="og:type" content="article" />');
    expect(html).toContain('"@type":"Article"');
    // FAQ + breadcrumb structured data for rich results
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain('"@type":"BreadcrumbList"');
    expect(html).toContain("<h1>HTMLファイルをURLで共有する方法</h1>");
    expect(html).toContain("相手はブラウザでリンクを開くだけです");
  });

  it("aligns the article pages to the indigo design system (no off-system teal accent)", () => {
    const css = readFileSync("src/client/styles.css", "utf8");
    const shellStart = css.indexOf(".lp-article-shell {");
    const shellRule = css.slice(shellStart, css.indexOf("}", shellStart));
    expect(shellRule).toContain("var(--lp-accent-soft)");
    // the previous design used a teal radial gradient that clashed with the indigo brand
    expect(css).not.toContain("rgba(20, 184, 166");
  });

  it("includes article paths in sitemap and links articles from the landing page", async () => {
    const { env } = envWithAssets();
    const sitemap = await worker.fetch(new Request("https://giga-site.com/sitemap.xml") as unknown as Parameters<typeof worker.fetch>[0], env, {} as ExecutionContext);
    const xml = await sitemap.text();

    expect(xml).toContain("<loc>https://giga-site.com/articles</loc>");
    expect(xml).toContain("<loc>https://giga-site.com/articles/html-share</loc>");
    expect(xml).toContain("<loc>https://giga-site.com/articles/ai-html-security</loc>");

    const landing = renderToStaticMarkup(createElement(LandingPage));
    expect(landing).toContain("/articles");
    expect(landing).toContain("活用記事");
  });

  it("groups the index by category and links to per-category pages", () => {
    const index = renderArticle("/articles");
    expect(index).toContain("lp-article-group");
    expect(index).toContain("AI活用");
    expect(index).toContain("/articles/category/ai");
    // the index still surfaces real article deep-links (not just category hubs)
    expect(index).toContain(`href="${ARTICLES[0].path}"`);
    const cardCount = (index.match(/lp-article-card/g) ?? []).length;
    expect(cardCount).toBeGreaterThan(0);
    expect(cardCount).toBeLessThanOrEqual(ARTICLE_CATEGORIES.length * 8);
    const deep = getArticleBySlug("share-chatgpt-html");
    expect(deep).not.toBeNull();
    const category = getCategoryByName(deep!.category)!;
    const page = renderArticle(categoryPath(category.slug));
    expect(page).toContain(deep!.path);
  });

  it("adds lastmod to sitemap entries so crawlers see freshness", async () => {
    const { env } = envWithAssets();
    const sitemap = await worker.fetch(new Request("https://giga-site.com/sitemap.xml") as unknown as Parameters<typeof worker.fetch>[0], env, {} as ExecutionContext);
    const xml = await sitemap.text();
    expect(xml).toContain("<lastmod>");
    expect(xml).toContain("<loc>https://giga-site.com/articles/share-chatgpt-html</loc>");
  });

  it("renders AI-readable Markdown for article pages and the article index", () => {
    const detail = renderMarkdownForPathname("/articles/html-share", "https://giga-site.com") ?? "";
    expect(detail).toContain('title: "HTMLファイルをURLで共有する方法"');
    expect(detail).toContain("# HTMLファイルをURLで共有する方法");
    expect(detail).toContain("> Source HTML: https://giga-site.com/articles/html-share");
    expect(detail).toContain("## よくある質問");
    expect(detail).toContain("```json");
    expect(detail).toContain('"@type": "Article"');
    expect(detail).not.toContain("<article");

    const index = renderMarkdownForPathname(ARTICLES_MARKDOWN_INDEX_PATH, "https://giga-site.com") ?? "";
    expect(index).toContain("# ギガサイト便 活用記事");
    expect(index).toContain("https://giga-site.com/articles/html-share/index.md");
    expect(index).toContain(`全${ARTICLES.length}本`);
  });

  it("serves Markdown via explicit .md paths and Accept negotiation", async () => {
    const { env, assetFetches } = envWithAssets();
    const explicit = await worker.fetch(new Request("https://giga-site.com/articles/html-share/index.md") as unknown as Parameters<typeof worker.fetch>[0], env, {} as ExecutionContext);
    const explicitText = await explicit.text();

    expect(explicit.status).toBe(200);
    expect(explicit.headers.get("Content-Type")).toContain("text/markdown");
    expect(explicit.headers.get("Content-Signal")).toBe("ai-train=yes, search=yes, ai-input=yes");
    expect(Number(explicit.headers.get("X-Markdown-Tokens"))).toBeGreaterThan(0);
    expect(explicit.headers.get("Vary")).toContain("Accept");
    expect(explicit.headers.get("Link")).toContain(`${LLMS_TXT_PATH}`);
    expect(explicitText).toContain("# HTMLファイルをURLで共有する方法");
    expect(assetFetches).toEqual([]);

    const negotiated = await worker.fetch(new Request("https://giga-site.com/articles/html-share", { headers: { Accept: "text/markdown" } }) as unknown as Parameters<typeof worker.fetch>[0], env, {} as ExecutionContext);
    expect(negotiated.headers.get("Content-Type")).toContain("text/markdown");
    expect(await negotiated.text()).toContain("Article index: https://giga-site.com/articles/index.md");
  });

  it("publishes llms.txt with Markdown endpoints for discovery", async () => {
    const text = buildLlmsTxt("https://giga-site.com");
    expect(text).toContain("# ギガサイト便");
    expect(text).toContain("https://giga-site.com/index.md");
    expect(text).toContain("https://giga-site.com/articles/index.md");
    expect(text).toContain(articleMarkdownPath(ARTICLES[0]));

    const { env } = envWithAssets();
    const response = await worker.fetch(new Request("https://giga-site.com/llms.txt") as unknown as Parameters<typeof worker.fetch>[0], env, {} as ExecutionContext);
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/plain");
    expect(response.headers.get("Content-Signal")).toBe("ai-train=yes, search=yes, ai-input=yes");
    expect(await response.text()).toContain("## Articles");
  });
});

describe("article category pagination", () => {
  function biggestCategory() {
    const counts = new Map<string, number>();
    for (const a of ARTICLES) counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
    const [name, total] = [...counts.entries()].sort((x, y) => y[1] - x[1])[0];
    return { cat: getCategoryByName(name)!, total };
  }

  it("parses bare and /page/N category paths and rejects malformed ones", () => {
    const { cat } = biggestCategory();
    expect(parseCategoryPathname(categoryPath(cat.slug))).toEqual({ slug: cat.slug, page: 1 });
    expect(parseCategoryPathname(`${categoryPath(cat.slug)}/page/2`)).toEqual({ slug: cat.slug, page: 2 });
    expect(parseCategoryPathname(`${categoryPath(cat.slug)}/page/1`)).toBeNull();
    expect(parseCategoryPathname(`${categoryPath(cat.slug)}/page/x`)).toBeNull();
  });

  it("slices the largest category into non-overlapping pages within the budget", () => {
    const { cat, total } = biggestCategory();
    const totalPages = Math.ceil(total / CATEGORY_PAGE_SIZE);
    expect(totalPages).toBeGreaterThan(1);
    const p1 = getCategoryPage(cat.slug, 1)!;
    const p2 = getCategoryPage(cat.slug, 2)!;
    expect(p1.articles.length).toBeLessThanOrEqual(CATEGORY_PAGE_SIZE);
    const overlap = p1.articles.some((a) => p2.articles.some((b) => b.slug === a.slug));
    expect(overlap).toBe(false);
    expect(getCategoryPage(cat.slug, totalPages + 1)).toBeNull();
  });

  it("renders pagination nav and bounds card count per page", () => {
    const { cat, total } = biggestCategory();
    const totalPages = Math.ceil(total / CATEGORY_PAGE_SIZE);
    const page1 = renderStaticArticleHtmlForPathname(categoryPagePath(cat.slug, 1)) ?? "";
    expect((page1.match(/lp-article-card/g) ?? []).length).toBeLessThanOrEqual(CATEGORY_PAGE_SIZE);
    expect(page1).toContain("lp-article-pagination");
    expect(page1).toContain(`href="${categoryPagePath(cat.slug, 2)}"`);
    const last = renderStaticArticleHtmlForPathname(categoryPagePath(cat.slug, totalPages)) ?? "";
    expect(last).toContain(`href="${categoryPagePath(cat.slug, totalPages - 1)}"`);
    // page 1 must use the bare path; explicit /page/1 does not render
    expect(renderStaticArticleHtmlForPathname(`${categoryPath(cat.slug)}/page/1`)).toBeNull();
    expect(renderStaticArticleHtmlForPathname(categoryPagePath(cat.slug, totalPages + 1))).toBeNull();
  });
});

describe("related article relevance", () => {
  it("returns 2-6 relevant articles, no self or duplicates", () => {
    for (const a of ARTICLES.slice(0, 50)) {
      const rel = getRelatedArticles(a);
      expect(rel.length).toBeGreaterThanOrEqual(2);
      expect(rel.length).toBeLessThanOrEqual(6);
      expect(rel.some((r) => r.slug === a.slug)).toBe(false);
      expect(new Set(rel.map((r) => r.slug)).size).toBe(rel.length);
    }
  });

  it("ranks same-category, keyword-sharing articles first and fills to the limit", () => {
    const a = ARTICLES.find((x) => x.category === "AI活用")!;
    const rel = getRelatedArticles(a);
    expect(rel[0].category).toBe("AI活用");
    // large categories fill the full grid (computed, not capped by a hand-authored list)
    expect(rel.length).toBe(6);
  });

  it("fills the grid even for the smallest category", () => {
    const tiny = ARTICLES.find((x) => x.category === "HTML共有")!;
    const rel = getRelatedArticles(tiny);
    expect(rel.length).toBeGreaterThanOrEqual(2);
    expect(rel.some((r) => r.slug === tiny.slug)).toBe(false);
  });
});

describe("article dataset integrity", () => {
  it("has 30+ articles with unique slugs and slug-matching paths", () => {
    expect(ARTICLES.length).toBeGreaterThanOrEqual(30);
    const slugs = new Set(ARTICLES.map((a) => a.slug));
    expect(slugs.size).toBe(ARTICLES.length);
    for (const article of ARTICLES) {
      expect(article.path).toBe(`/articles/${article.slug}`);
      expect(getArticleByPathname(article.path)?.slug).toBe(article.slug);
    }
  });

  it("maps every article category to a unique URL-safe slug", () => {
    for (const category of new Set(ARTICLES.map((a) => a.category))) {
      expect(getCategoryByName(category), `missing slug for category ${category}`).not.toBeNull();
    }
    const slugs = ARTICLE_CATEGORIES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("keeps every article long-form with sections, faqs, and resolvable related links", () => {
    const slugSet = new Set(ARTICLES.map((a) => a.slug));
    for (const article of ARTICLES) {
      expect(article.sections.length).toBeGreaterThanOrEqual(4);
      expect(article.faqs.length).toBeGreaterThanOrEqual(3);
      const computedRelated = getRelatedArticles(article);
      expect(computedRelated.length).toBeGreaterThanOrEqual(2);
      for (const related of computedRelated) {
        expect(slugSet.has(related.slug)).toBe(true);
        expect(related.slug).not.toBe(article.slug);
      }
      for (const section of article.sections) {
        if (section.ordered) expect((section.bullets?.length ?? 0)).toBeGreaterThan(0);
      }
    }
  });

  it("spec: 記事データのギガサイト便説明は現行の無料/Proプランに揃える", () => {
    const collectStrings = (value: unknown, output: string[] = []): string[] => {
      if (typeof value === "string") output.push(value);
      if (Array.isArray(value)) value.forEach((item) => collectStrings(item, output));
      if (value && typeof value === "object" && !Array.isArray(value)) {
        Object.values(value).forEach((item) => collectStrings(item, output));
      }
      return output;
    };
    const allStrings = collectStrings(ARTICLES);
    const selfCopy = allStrings.filter((text) => text.includes("ギガサイト便"));
    const legacySelfPlanPatterns = [
      "Teamプラン以上",
      "Teamプランでは",
      "Team以上のプラン",
      "「Team」以上",
      "Team¥4,980月",
      "個人Pro",
      "1サイト¥150",
      "¥150の買い切り",
      "無料/個人Pro/Team",
      "無料／個人Pro／Team",
      "無料・個人Pro・Team",
      "Business¥19,800月"
    ];

    for (const text of selfCopy) {
      for (const pattern of legacySelfPlanPatterns) {
        expect(text, `legacy self plan copy remains: ${pattern}`).not.toContain(pattern);
      }
    }
    for (const pattern of ["Team¥4,980月", "個人Pro", "1サイト¥150", "¥150の買い切り", "Business¥19,800月"]) {
      expect(allStrings.join("\n"), `legacy self price copy remains: ${pattern}`).not.toContain(pattern);
    }
  });

  it("contains no leaked secret-like patterns in generated content", () => {
    const blob = JSON.stringify(ARTICLES);
    for (const pattern of ["sk_live", "sk_test", "AKIA", "-----BEGIN"]) {
      expect(blob.includes(pattern)).toBe(false);
    }
  });
});
