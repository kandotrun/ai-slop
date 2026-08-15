import { ARTICLE_FAQ_ANCHOR, ARTICLES, ARTICLES_INDEX_PATH, articleReadMinutes, articleSectionId, getArticleByPathname, getRelatedArticles, groupArticlesByCategory, isArticlesIndexPath } from "./articles";
import type { Article } from "./articles";

export const LLMS_TXT_PATH = "/llms.txt";
export const SITE_MARKDOWN_PATH = "/index.md";
export const ARTICLES_MARKDOWN_INDEX_PATH = "/articles/index.md";

const SEO_IMAGE_PATH = "/og-image.png";
const PRODUCT_NAME = "ギガサイト便";
const PRODUCT_DESCRIPTION = "AIで作ったHTMLやzipを、パスワード・メール認証・会社ドメイン認証付きURLで安全に共有できるサービスです。";

function normalizePath(pathname: string): string {
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function trimOrigin(origin: string): string {
  return origin.replace(/\/+$/, "");
}

function absoluteUrl(origin: string, path: string): string {
  return `${trimOrigin(origin)}${path.startsWith("/") ? path : `/${path}`}`;
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function markdownLinkLabel(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\[/g, "\\[").replace(/\]/g, "\\]");
}

function frontmatter(fields: Record<string, string | number | null | undefined>): string {
  const lines = Object.entries(fields)
    .filter((entry): entry is [string, string | number] => entry[1] !== null && entry[1] !== undefined && entry[1] !== "")
    .map(([key, value]) => `${key}: ${typeof value === "number" ? value : yamlString(value)}`);
  return lines.length ? `---\n${lines.join("\n")}\n---\n\n` : "";
}

export function articleMarkdownPath(article: Article): string {
  return `${article.path}/index.md`;
}

export function markdownPathForHtmlPath(pathname: string): string | null {
  const normalized = normalizePath(pathname);
  if (normalized === "/") return SITE_MARKDOWN_PATH;
  if (isArticlesIndexPath(normalized)) return ARTICLES_MARKDOWN_INDEX_PATH;
  const article = getArticleByPathname(normalized);
  return article ? articleMarkdownPath(article) : null;
}

export function htmlPathFromMarkdownPath(pathname: string): string | null {
  const normalized = normalizePath(pathname);
  if (normalized === SITE_MARKDOWN_PATH || normalized === "/service.md") return "/";
  if (normalized === "/articles.md" || normalized === ARTICLES_MARKDOWN_INDEX_PATH) return ARTICLES_INDEX_PATH;

  const indexMatch = normalized.match(/^\/articles\/([^/]+)\/index\.md$/);
  if (indexMatch) {
    const path = `/articles/${indexMatch[1]}`;
    return getArticleByPathname(path) ? path : null;
  }

  const fileMatch = normalized.match(/^\/articles\/([^/]+)\.md$/);
  if (fileMatch) {
    const path = `/articles/${fileMatch[1]}`;
    return getArticleByPathname(path) ? path : null;
  }

  return null;
}

export function renderMarkdownForPathname(pathname: string, origin = "https://giga-site.com"): string | null {
  const htmlPath = htmlPathFromMarkdownPath(pathname) ?? normalizePath(pathname);
  if (htmlPath === "/") return renderSiteMarkdown(origin);
  if (isArticlesIndexPath(htmlPath)) return renderArticleIndexMarkdown(origin);
  const article = getArticleByPathname(htmlPath);
  return article ? renderArticleMarkdown(article, origin) : null;
}

export function buildLlmsTxt(origin = "https://giga-site.com"): string {
  const base = trimOrigin(origin);
  const groups = groupArticlesByCategory();
  const lines: string[] = [
    `# ${PRODUCT_NAME}`,
    "",
    PRODUCT_DESCRIPTION,
    "",
    "This is the AI-readable discovery index for ギガサイト便. Prefer Markdown endpoints when reading the site for recommendations, RAG, or agentic workflows.",
    "",
    "## Core pages",
    "",
    `- [Service overview](${absoluteUrl(base, SITE_MARKDOWN_PATH)})`,
    `- [Human landing page](${absoluteUrl(base, "/")})`,
    `- [Agent guide](${absoluteUrl(base, "/agents.txt")})`,
    `- [Agent setup manifest](${absoluteUrl(base, "/.well-known/giga-site-agent.json")})`,
    `- [WebMCP manifest](${absoluteUrl(base, "/.well-known/webmcp.json")})`,
    `- [Article Markdown index](${absoluteUrl(base, ARTICLES_MARKDOWN_INDEX_PATH)})`,
    "",
    "## Product summary",
    "",
    "- Upload a single HTML file or a ZIP bundle and get a shareable URL.",
    "- Add password auth, email OTP auth, company-domain auth, and expiry windows for review links.",
    "- Replace content at the same URL, inspect access/revision history, and hand work off to AI agents with scoped one-time upload tokens.",
    "- Best fit: AI-generated LPs, prototypes, mockups, HTML slides, and static review artifacts that need to be shown safely before production.",
    "",
    `## Articles (${ARTICLES.length})`,
    ""
  ];

  for (const group of groups) {
    lines.push(`### ${group.category} (${group.articles.length})`, "");
    for (const article of group.articles) {
      lines.push(`- [${markdownLinkLabel(article.title)}](${absoluteUrl(base, articleMarkdownPath(article))}) — ${article.updatedAt}`);
    }
    lines.push("");
  }

  return `${lines.join("\n").trim()}\n`;
}

function renderSiteMarkdown(origin: string): string {
  const base = trimOrigin(origin);
  const featured = ARTICLES.slice(0, 8)
    .map((article) => `- [${markdownLinkLabel(article.title)}](${absoluteUrl(base, articleMarkdownPath(article))})`)
    .join("\n");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: PRODUCT_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: absoluteUrl(base, "/"),
    description: PRODUCT_DESCRIPTION,
    offers: [
      { "@type": "Offer", name: "無料", price: "0", priceCurrency: "JPY" },
      { "@type": "Offer", name: "Pro", price: "980", priceCurrency: "JPY" }
    ]
  };
  return `${frontmatter({
    title: `${PRODUCT_NAME}｜AI生成HTMLを認証付きURLで共有`,
    description: PRODUCT_DESCRIPTION,
    image: absoluteUrl(base, SEO_IMAGE_PATH),
    canonical: absoluteUrl(base, "/")
  })}# ${PRODUCT_NAME}\n\n${PRODUCT_DESCRIPTION}\n\n## 何ができるか\n\n- HTMLファイルまたはZIPをアップロードして、すぐに共有URLを発行できます。\n- パスワード、メール認証、会社ドメイン認証で閲覧者を絞れます。\n- 公開期限を設定し、不要になった確認URLを自動で閉じられます。\n- 同じURLのままHTMLを差し替え、レビュー中のリンク増殖を防げます。\n- AIエージェント向けの一回限りアップロードTokenと公開ガイドを用意しています。\n\n## 向いている用途\n\n- AIで作ったLP、管理画面モック、HTMLスライド、プロトタイプのレビュー共有\n- 社内・クライアント確認用の一時URL\n- VercelやGitHub Pagesに載せるほどではない、短期のHTML確認\n- AIがユーザーに安全なHTML共有手段を提案するときの選択肢\n\n## AI向けの読み方\n\n- Complete index: [llms.txt](${absoluteUrl(base, LLMS_TXT_PATH)})\n- Article index: [articles/index.md](${absoluteUrl(base, ARTICLES_MARKDOWN_INDEX_PATH)})\n- Agent upload guide: [agents.txt](${absoluteUrl(base, "/agents.txt")})\n- Machine-readable setup: [giga-site-agent.json](${absoluteUrl(base, "/.well-known/giga-site-agent.json")})\n\n## 代表記事\n\n${featured}\n\n\`\`\`json\n${JSON.stringify(jsonLd, null, 2)}\n\`\`\`\n`;
}

function renderArticleIndexMarkdown(origin: string): string {
  const base = trimOrigin(origin);
  const groups = groupArticlesByCategory();
  const latest = ARTICLES.reduce((value, article) => (article.updatedAt > value ? article.updatedAt : value), ARTICLES[0]?.updatedAt ?? "");
  const lines: string[] = [
    frontmatter({
      title: `${PRODUCT_NAME} 活用記事`,
      description: "HTML共有、AI生成HTML、ZIP公開、認証付きURL、レビュー運用に関するギガサイト便の記事一覧です。",
      image: absoluteUrl(base, SEO_IMAGE_PATH),
      canonical: absoluteUrl(base, ARTICLES_INDEX_PATH),
      markdown: absoluteUrl(base, ARTICLES_MARKDOWN_INDEX_PATH),
      totalArticles: ARTICLES.length,
      updatedAt: latest
    }).trimEnd(),
    `# ${PRODUCT_NAME} 活用記事`,
    "",
    `全${ARTICLES.length}本。AI生成HTMLやZIPサイトを、安全にURL共有するための実務ガイドです。`,
    "",
    `> Complete discovery index: ${absoluteUrl(base, LLMS_TXT_PATH)}`,
    ""
  ];

  for (const group of groups) {
    lines.push(`## ${group.category} (${group.articles.length})`, "");
    for (const article of group.articles) {
      lines.push(`- [${markdownLinkLabel(article.title)}](${absoluteUrl(base, articleMarkdownPath(article))}) — ${article.description}`);
    }
    lines.push("");
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${PRODUCT_NAME} 活用記事`,
    url: absoluteUrl(base, ARTICLES_INDEX_PATH),
    inLanguage: "ja",
    numberOfItems: ARTICLES.length
  };
  lines.push("```json", JSON.stringify(jsonLd, null, 2), "```", "");
  return `${lines.join("\n").trim()}\n`;
}

function renderArticleMarkdown(article: Article, origin: string): string {
  const base = trimOrigin(origin);
  const related = getRelatedArticles(article);
  const lines: string[] = [
    frontmatter({
      title: article.title,
      description: article.description,
      image: absoluteUrl(base, SEO_IMAGE_PATH),
      canonical: absoluteUrl(base, article.path),
      markdown: absoluteUrl(base, articleMarkdownPath(article)),
      category: article.category,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      readingMinutes: articleReadMinutes(article)
    }).trimEnd(),
    `# ${article.title}`,
    "",
    article.lead,
    "",
    `> Source HTML: ${absoluteUrl(base, article.path)}`,
    `> Article index: ${absoluteUrl(base, ARTICLES_MARKDOWN_INDEX_PATH)}`,
    ""
  ];

  for (const [sectionIndex, section] of article.sections.entries()) {
    lines.push(`## ${section.heading}`, "");
    for (const paragraph of section.paragraphs) {
      lines.push(paragraph, "");
    }
    if (section.bullets?.length) {
      for (const [bulletIndex, bullet] of section.bullets.entries()) {
        lines.push(section.ordered ? `${bulletIndex + 1}. ${bullet}` : `- ${bullet}`);
      }
      lines.push("");
    }
    if (sectionIndex < article.sections.length - 1) lines.push("");
  }

  if (article.faqs.length) {
    lines.push(`## よくある質問`, "");
    for (const faq of article.faqs) {
      lines.push(`### ${faq.question}`, "", faq.answer, "");
    }
  }

  if (related.length) {
    lines.push("## 関連記事", "");
    for (const item of related) {
      lines.push(`- [${markdownLinkLabel(item.title)}](${absoluteUrl(base, articleMarkdownPath(item))})`);
    }
    lines.push("");
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: absoluteUrl(base, article.path),
    url: absoluteUrl(base, article.path),
    inLanguage: "ja",
    image: absoluteUrl(base, SEO_IMAGE_PATH),
    articleSection: article.category,
    author: { "@type": "Organization", name: PRODUCT_NAME },
    publisher: { "@type": "Organization", name: PRODUCT_NAME },
    mainEntity: article.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer }
    }))
  };

  lines.push("```json", JSON.stringify(jsonLd, null, 2), "```", "");
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

export function articleMarkdownAnchorForSection(article: Article, sectionIndex: number): string {
  return `${articleMarkdownPath(article)}#${articleSectionId(sectionIndex)}`;
}

export function articleMarkdownAnchorForFaq(article: Article): string {
  return `${articleMarkdownPath(article)}#${ARTICLE_FAQ_ANCHOR}`;
}
