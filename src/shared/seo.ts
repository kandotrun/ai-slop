import { ARTICLE_CATEGORY_PATHS, ARTICLE_PATHS, ARTICLES_INDEX_PATH, categoryPagePath, getArticleByPathname, getCategoryPage, isArticleCategoryPath, isArticlesIndexPath, latestArticleUpdatedAt, parseCategoryPathname } from "./articles";
import { AGENT_MANIFEST_PATH, AGENTS_TXT_PATH, WEBMCP_MANIFEST_PATH } from "./agent-handoff";
import { LEGAL_PATHS, legalPathFromPathname } from "./legal";
import { markdownPathForHtmlPath } from "./markdown";

export const SEO_IMAGE_PATH = "/og-image.png";
export const SEO_IMAGE_ALT = "ギガサイト便｜HTMLやzipを認証付きURLで共有";

// Brand identity reused across the structured-data entity graph (Organization sameAs).
const ORG_NAME = "ギガサイト便";
const SOCIAL_PROFILES = [
  "https://www.youtube.com/@nixo0",
  "https://zenn.dev/nixo",
  "https://github.com/kandotrun"
];

export interface SeoMeta {
  title: string;
  description: string;
  canonicalPath: string;
  robots: "index,follow" | "noindex,nofollow";
  keywords?: string;
  type: "website" | "article";
}

const landingDescription = "AIで作ったHTMLやzipを、パスワード・メール認証・会社ドメイン認証付きURLで安全に共有。サーバー不要で3秒公開できるギガサイト便。";

const publicMeta: Record<string, SeoMeta> = {
  "/": {
    title: "HTMLを認証付きURLで共有｜ギガサイト便",
    description: landingDescription,
    canonicalPath: "/",
    robots: "index,follow",
    keywords: "HTML 共有, HTML 公開, zip 公開, AI生成サイト 共有, パスワード付きURL, 会社ドメイン認証",
    type: "website"
  },
  "/contact": {
    title: "お問い合わせ｜ギガサイト便",
    description: "ギガサイト便のサービスの使い方、料金・請求、不具合の報告などのお問い合わせ窓口です。",
    canonicalPath: "/contact",
    robots: "index,follow",
    keywords: "ギガサイト便 問い合わせ, HTML共有 サポート, 料金 請求 問い合わせ",
    type: "article"
  },
  [ARTICLES_INDEX_PATH]: {
    title: "ギガサイト便 活用記事｜HTML共有・AI生成サイト公開ガイド",
    description: "HTMLファイルのURL共有、AI生成HTMLの安全な公開、ZIPサイト公開、パスワード付きプレビューなど、ギガサイト便の活用記事一覧です。",
    canonicalPath: ARTICLES_INDEX_PATH,
    robots: "index,follow",
    keywords: "HTML共有 記事, AI生成HTML 共有, ZIPサイト 公開, パスワード付きHTML",
    type: "article"
  },
  "/terms": {
    title: "利用規約｜ギガサイト便",
    description: "ギガサイト便の利用条件、アップロードデータの取扱い、禁止事項、有料プラン、免責事項についてまとめた利用規約です。",
    canonicalPath: "/terms",
    robots: "index,follow",
    type: "article"
  },
  "/privacy": {
    title: "プライバシーポリシー｜ギガサイト便",
    description: "ギガサイト便における個人情報、アップロードファイル、アクセスログ、Cookie、第三者サービスの取扱いを説明します。",
    canonicalPath: "/privacy",
    robots: "index,follow",
    type: "article"
  },
  "/commerce": {
    title: "特定商取引法に基づく表記｜ギガサイト便",
    description: "ギガサイト便の販売事業者、販売価格、支払方法、提供時期、返金・キャンセル条件を表示します。",
    canonicalPath: "/commerce",
    robots: "index,follow",
    type: "article"
  },
  "/refund-policy": {
    title: "返金・キャンセルポリシー｜ギガサイト便",
    description: "ギガサイト便の買い切り購入、月額プラン、導入支援に関する返金・キャンセル条件を説明します。",
    canonicalPath: "/refund-policy",
    robots: "index,follow",
    type: "article"
  }
};

const appMeta: SeoMeta = {
  title: "管理画面｜ギガサイト便",
  description: "ギガサイト便の管理画面です。公開サイト、認証設定、アクセスログ、課金情報を管理します。",
  canonicalPath: "/app/",
  robots: "noindex,nofollow",
  type: "website"
};

export function normalizeSeoPath(pathname: string): string {
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function getSeoMetaForPathname(pathname: string, appBasePath = "/app"): SeoMeta | null {
  const normalized = normalizeSeoPath(pathname);
  const appBase = normalizeSeoPath(appBasePath);
  if (normalized === appBase || normalized.startsWith(`${appBase}/`)) return appMeta;
  if (isArticlesIndexPath(pathname)) return publicMeta[ARTICLES_INDEX_PATH] ?? null;
  const categoryRef = parseCategoryPathname(pathname);
  if (categoryRef) {
    const categoryPageData = getCategoryPage(categoryRef.slug, categoryRef.page);
    if (!categoryPageData) return null;
    const pageSuffix = categoryPageData.page > 1 ? `（${categoryPageData.page}ページ目）` : "";
    return {
      title: `${categoryPageData.category}の活用記事${pageSuffix}｜ギガサイト便`,
      description: `${categoryPageData.category}に関するギガサイト便の活用記事を全${categoryPageData.total}本掲載。HTMLファイルのURL共有やAI生成サイトの安全な公開手順を解説します。`,
      canonicalPath: categoryPagePath(categoryPageData.slug, categoryPageData.page),
      robots: "index,follow",
      type: "article"
    };
  }
  const article = getArticleByPathname(pathname);
  if (article) {
    return {
      title: `${article.title}｜ギガサイト便`,
      description: article.description,
      canonicalPath: article.path,
      robots: "index,follow",
      keywords: article.keywords,
      type: "article"
    };
  }
  const legalPath = legalPathFromPathname(pathname);
  if (legalPath) return publicMeta[legalPath] ?? null;
  return publicMeta[normalized] ?? null;
}

export function publicSitemapPaths(): string[] {
  return ["/", "/contact", ARTICLES_INDEX_PATH, ...ARTICLE_CATEGORY_PATHS, ...ARTICLE_PATHS, ...LEGAL_PATHS];
}

export function absoluteUrl(origin: string, path: string): string {
  return new URL(path, origin.endsWith("/") ? origin : `${origin}/`).toString();
}

export function renderSeoHead(meta: SeoMeta, origin: string): string {
  const canonical = absoluteUrl(origin, meta.canonicalPath);
  const imageUrl = absoluteUrl(origin, SEO_IMAGE_PATH);
  const jsonLd = buildJsonLd(meta, origin);
  const article = meta.type === "article" ? getArticleByPathname(meta.canonicalPath) : null;
  const markdownPath = markdownPathForHtmlPath(meta.canonicalPath);
  const tags = [
    `<title>${escapeText(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttribute(meta.description)}" />`,
    `<meta name="robots" content="${meta.robots}" />`,
    meta.keywords ? `<meta name="keywords" content="${escapeAttribute(meta.keywords)}" />` : null,
    `<link rel="canonical" href="${escapeAttribute(canonical)}" />`,
    `<link rel="dns-prefetch" href="https://www.googletagmanager.com" />`,
    `<link rel="dns-prefetch" href="https://www.google-analytics.com" />`,
    `<link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />`,
    `<link rel="webmcp" href="${escapeAttribute(absoluteUrl(origin, WEBMCP_MANIFEST_PATH))}" type="application/json" />`,
    `<link rel="agents" href="${escapeAttribute(absoluteUrl(origin, AGENTS_TXT_PATH))}" type="text/plain" />`,
    `<link rel="agent-manifest" href="${escapeAttribute(absoluteUrl(origin, AGENT_MANIFEST_PATH))}" type="application/json" />`,
    markdownPath ? `<link rel="alternate" href="${escapeAttribute(absoluteUrl(origin, markdownPath))}" type="text/markdown" />` : null,
    `<meta property="og:site_name" content="${escapeAttribute(ORG_NAME)}" />`,
    `<meta property="og:locale" content="ja_JP" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:title" content="${escapeAttribute(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(meta.description)}" />`,
    `<meta property="og:url" content="${escapeAttribute(canonical)}" />`,
    `<meta property="og:image" content="${escapeAttribute(imageUrl)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeAttribute(SEO_IMAGE_ALT)}" />`,
    article ? `<meta property="article:published_time" content="${escapeAttribute(article.publishedAt)}" />` : null,
    article ? `<meta property="article:modified_time" content="${escapeAttribute(article.updatedAt)}" />` : null,
    article ? `<meta property="article:section" content="${escapeAttribute(article.category)}" />` : null,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttribute(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttribute(imageUrl)}" />`,
    `<meta name="twitter:image:alt" content="${escapeAttribute(SEO_IMAGE_ALT)}" />`,
    `<script type="application/ld+json">${escapeScriptJson(JSON.stringify(jsonLd))}</script>`
  ];
  return tags.filter((tag): tag is string => tag !== null).join("\n    ");
}

export function injectSeoHead(html: string, meta: SeoMeta, origin: string): string {
  const block = renderSeoHead(meta, origin);
  const stripped = stripManagedSeoTags(html);
  if (/<meta\s+name="viewport"[^>]*>/i.test(stripped)) {
    return stripped.replace(/<meta\s+name="viewport"[^>]*>/i, (viewportTag) => `${viewportTag}\n    ${block}`);
  }
  return stripped.replace("</head>", `    ${block}\n  </head>`);
}

export function buildRobotsTxt(origin: string): string {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /app/",
    "Disallow: /api/",
    "Disallow: /preview-auth/",
    "Disallow: /preview-email-auth/",
    `Sitemap: ${absoluteUrl(origin, "/sitemap.xml")}`,
    ""
  ].join("\n");
}

function sitemapEntryFor(path: string): { priority: string; changefreq: string; lastmod: string | null } {
  if (path === "/") return { priority: "1.0", changefreq: "weekly", lastmod: latestArticleUpdatedAt() };
  if (path === "/contact") return { priority: "0.8", changefreq: "monthly", lastmod: null };
  if (path === ARTICLES_INDEX_PATH) return { priority: "0.7", changefreq: "weekly", lastmod: latestArticleUpdatedAt() };
  if (isArticleCategoryPath(path)) {
    const ref = parseCategoryPathname(path);
    const categoryPageData = ref ? getCategoryPage(ref.slug, ref.page) : null;
    const lastmod = categoryPageData
      ? categoryPageData.articles.reduce((latest, article) => (article.updatedAt > latest ? article.updatedAt : latest), categoryPageData.articles[0].updatedAt)
      : null;
    return { priority: "0.65", changefreq: "weekly", lastmod };
  }
  const article = getArticleByPathname(path);
  if (article) return { priority: "0.6", changefreq: "monthly", lastmod: article.updatedAt };
  return { priority: "0.4", changefreq: "yearly", lastmod: null };
}

export function buildSitemapXml(origin: string): string {
  const urls = publicSitemapPaths().map((path) => {
    const { priority, changefreq, lastmod } = sitemapEntryFor(path);
    const lastmodTag = lastmod ? `\n    <lastmod>${escapeText(lastmod)}</lastmod>` : "";
    return `  <url>\n    <loc>${escapeText(absoluteUrl(origin, path))}</loc>${lastmodTag}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

function stripManagedSeoTags(html: string): string {
  return html
    .replace(/\s*<title>[\s\S]*?<\/title>/gi, "")
    .replace(/\s*<meta\s+name="(?:description|robots|keywords|twitter:[^"]+)"[^>]*>/gi, "")
    .replace(/\s*<meta\s+property="(?:og|article):[^"]+"[^>]*>/gi, "")
    .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, "")
    .replace(/\s*<link\s+rel="dns-prefetch"[^>]*>/gi, "")
    .replace(/\s*<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, "");
}

function organizationId(origin: string): string {
  return `${absoluteUrl(origin, "/")}#organization`;
}

function webSiteId(origin: string): string {
  return `${absoluteUrl(origin, "/")}#website`;
}

// Stable brand entities referenced by every page via @id so the site reads as one knowledge graph.
function organizationNode(origin: string): Record<string, unknown> {
  return {
    "@type": "Organization",
    "@id": organizationId(origin),
    name: ORG_NAME,
    url: absoluteUrl(origin, "/"),
    logo: { "@type": "ImageObject", url: absoluteUrl(origin, "/favicon.svg") },
    sameAs: SOCIAL_PROFILES
  };
}

function webSiteNode(origin: string): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": webSiteId(origin),
    name: ORG_NAME,
    url: absoluteUrl(origin, "/"),
    inLanguage: "ja",
    publisher: { "@id": organizationId(origin) }
  };
}

function pageNodes(meta: SeoMeta, origin: string): Record<string, unknown>[] {
  const orgRef = { "@id": organizationId(origin) };
  const webSiteRef = { "@id": webSiteId(origin) };

  if (isArticlesIndexPath(meta.canonicalPath)) {
    return [
      {
        "@type": "CollectionPage",
        name: meta.title,
        description: meta.description,
        url: absoluteUrl(origin, ARTICLES_INDEX_PATH),
        inLanguage: "ja",
        isPartOf: webSiteRef
      }
    ];
  }

  const categoryRef = parseCategoryPathname(meta.canonicalPath);
  if (categoryRef && getCategoryPage(categoryRef.slug, categoryRef.page)) {
    return [
      {
        "@type": "CollectionPage",
        name: meta.title,
        description: meta.description,
        url: absoluteUrl(origin, categoryPagePath(categoryRef.slug, categoryRef.page)),
        inLanguage: "ja",
        isPartOf: webSiteRef
      }
    ];
  }

  const article = getArticleByPathname(meta.canonicalPath);
  if (article) {
    const nodes: Record<string, unknown>[] = [
      {
        "@type": "Article",
        headline: article.title,
        description: article.description,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        mainEntityOfPage: absoluteUrl(origin, article.path),
        url: absoluteUrl(origin, article.path),
        inLanguage: "ja",
        image: absoluteUrl(origin, SEO_IMAGE_PATH),
        articleSection: article.category,
        author: orgRef,
        publisher: orgRef,
        isPartOf: webSiteRef
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "トップ", item: absoluteUrl(origin, "/") },
          { "@type": "ListItem", position: 2, name: "活用記事", item: absoluteUrl(origin, ARTICLES_INDEX_PATH) },
          { "@type": "ListItem", position: 3, name: article.title, item: absoluteUrl(origin, article.path) }
        ]
      }
    ];
    if (article.faqs.length) {
      nodes.push({
        "@type": "FAQPage",
        mainEntity: article.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer }
        }))
      });
    }
    return nodes;
  }

  if (meta.canonicalPath === "/") {
    return [
      {
        "@type": "SoftwareApplication",
        name: ORG_NAME,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: absoluteUrl(origin, "/"),
        description: meta.description,
        publisher: orgRef,
        offers: [
          { "@type": "Offer", price: "0", priceCurrency: "JPY", name: "無料" },
          { "@type": "Offer", price: "980", priceCurrency: "JPY", name: "Pro" }
        ]
      }
    ];
  }

  return [
    {
      "@type": "WebPage",
      name: meta.title,
      url: absoluteUrl(origin, meta.canonicalPath),
      description: meta.description,
      inLanguage: "ja",
      isPartOf: webSiteRef
    }
  ];
}

function buildJsonLd(meta: SeoMeta, origin: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [...pageNodes(meta, origin), organizationNode(origin), webSiteNode(origin)]
  };
}

function escapeAttribute(value: string): string {
  return escapeText(value).replace(/"/g, "&quot;");
}

function escapeText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeScriptJson(value: string): string {
  return value.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}
