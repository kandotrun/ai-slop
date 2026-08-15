import { ARTICLES } from "./articles-data";
import { FEATURED_ARTICLE_LINKS } from "./featured-articles";
import { LEGAL_LINKS } from "./legal";
export const ARTICLES_INDEX_PATH = "/articles";

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  /** Render bullets as a numbered step list instead of an unordered list. */
  ordered?: boolean;
}

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface Article {
  slug: string;
  path: string;
  title: string;
  description: string;
  lead: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  keywords: string;
  sections: ArticleSection[];
  faqs: ArticleFaq[];
  /** Optional manual override of related slugs; related articles are otherwise computed by relevance. */
  related?: string[];
}

export { ARTICLES };

export const ARTICLE_PATHS = ARTICLES.map((article) => article.path);

export function normalizeArticlePath(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function isArticlesIndexPath(pathname: string): boolean {
  return normalizeArticlePath(pathname) === ARTICLES_INDEX_PATH;
}

export function getArticleByPathname(pathname: string): Article | null {
  const normalized = normalizeArticlePath(pathname);
  return ARTICLES.find((article) => article.path === normalized) ?? null;
}

export function getArticleBySlug(slug: string): Article | null {
  return ARTICLES.find((article) => article.slug === slug) ?? null;
}

export function isArticleRoute(pathname: string): boolean {
  return isArticlesIndexPath(pathname) || getArticleByPathname(pathname) !== null;
}

/** Stable anchor id for a section, shared by the React and static renderers. */
export function articleSectionId(index: number): string {
  return `section-${index + 1}`;
}

export const ARTICLE_FAQ_ANCHOR = "faq";

const RELATED_STOP_TOKENS = new Set([
  "url", "html", "share", "vs", "ai", "howto", "guide", "for", "to", "the", "review", "page", "site", "web"
]);

function relatedSlugTokens(slug: string): string[] {
  return slug.split("-").filter((token) => token.length > 1 && !RELATED_STOP_TOKENS.has(token));
}

function relatedKeywordPhrases(keywords: string): string[] {
  return keywords.split(/[,、]/).map((phrase) => phrase.trim()).filter((phrase) => phrase.length > 0);
}

const slugTokenIndex = new Map<string, Article[]>();
const keywordIndex = new Map<string, Article[]>();
const categoryIndex = new Map<string, Article[]>();
for (const article of ARTICLES) {
  for (const token of relatedSlugTokens(article.slug)) {
    const list = slugTokenIndex.get(token); if (list) list.push(article); else slugTokenIndex.set(token, [article]);
  }
  for (const phrase of relatedKeywordPhrases(article.keywords)) {
    const list = keywordIndex.get(phrase); if (list) list.push(article); else keywordIndex.set(phrase, [article]);
  }
  const catList = categoryIndex.get(article.category); if (catList) catList.push(article); else categoryIndex.set(article.category, [article]);
}

export const RELATED_ARTICLE_LIMIT = 6;

/** Rank other articles by content relevance (category + shared keywords + shared slug tokens). */
export function getRelatedArticles(article: Article, limit = RELATED_ARTICLE_LIMIT): Article[] {
  const selfTokens = new Set(relatedSlugTokens(article.slug));
  const selfKeywords = new Set(relatedKeywordPhrases(article.keywords));
  const candidates = new Map<string, Article>();
  const consider = (other: Article) => { if (other.slug !== article.slug) candidates.set(other.slug, other); };
  for (const token of selfTokens) for (const other of slugTokenIndex.get(token) ?? []) consider(other);
  for (const phrase of selfKeywords) for (const other of keywordIndex.get(phrase) ?? []) consider(other);
  for (const other of categoryIndex.get(article.category) ?? []) consider(other);
  const scored = [...candidates.values()].map((other) => {
    const sharedKeywords = relatedKeywordPhrases(other.keywords).filter((phrase) => selfKeywords.has(phrase)).length;
    const sharedTokens = relatedSlugTokens(other.slug).filter((token) => selfTokens.has(token)).length;
    const score = (other.category === article.category ? 3 : 0) + 2 * sharedKeywords + sharedTokens;
    return { other, score };
  });
  scored.sort((a, b) => b.score - a.score || (a.other.updatedAt < b.other.updatedAt ? 1 : a.other.updatedAt > b.other.updatedAt ? -1 : 0));
  const picked = scored.slice(0, limit).map((entry) => entry.other);
  if (picked.length < limit) {
    const seen = new Set(picked.map((p) => p.slug)); seen.add(article.slug);
    const byRecency = [...ARTICLES].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
    for (const other of byRecency) { if (picked.length >= limit) break; if (!seen.has(other.slug)) { picked.push(other); seen.add(other.slug); } }
  }
  return picked;
}

export interface ArticleCategory {
  name: string;
  slug: string;
}

/** Single source of truth: display order + URL slug for every article category. */
export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  { name: "HTML共有", slug: "html-share" },
  { name: "ハウツー", slug: "how-to" },
  { name: "AI活用", slug: "ai" },
  { name: "コンテンツ別", slug: "content-type" },
  { name: "認証共有", slug: "auth-share" },
  { name: "セキュリティ", slug: "security" },
  { name: "ユースケース", slug: "use-case" },
  { name: "ZIP公開", slug: "zip-publish" },
  { name: "社内レビュー", slug: "internal-review" },
  { name: "トラブルシュート", slug: "troubleshoot" },
  { name: "比較", slug: "compare" },
  { name: "用語解説", slug: "glossary" }
];

/** Display order for category groups on the article index. Unknown categories are appended after these. */
export const ARTICLE_CATEGORY_ORDER = ARTICLE_CATEGORIES.map((category) => category.name);

export const CATEGORY_PATH_PREFIX = "/articles/category";

export function categoryPath(slug: string): string {
  return `${CATEGORY_PATH_PREFIX}/${slug}`;
}

export function getCategoryBySlug(slug: string): ArticleCategory | null {
  return ARTICLE_CATEGORIES.find((category) => category.slug === slug) ?? null;
}

export function getCategoryByName(name: string): ArticleCategory | null {
  return ARTICLE_CATEGORIES.find((category) => category.name === name) ?? null;
}

export interface ArticleCategoryGroup {
  category: string;
  articles: Article[];
}

/** Group articles by category in a stable display order, so the index stays browsable as it scales. */
export function groupArticlesByCategory(): ArticleCategoryGroup[] {
  const byCategory = new Map<string, Article[]>();
  for (const article of ARTICLES) {
    const list = byCategory.get(article.category) ?? [];
    list.push(article);
    byCategory.set(article.category, list);
  }
  const ordered: ArticleCategoryGroup[] = [];
  for (const category of ARTICLE_CATEGORY_ORDER) {
    const articles = byCategory.get(category);
    if (articles) {
      ordered.push({ category, articles });
      byCategory.delete(category);
    }
  }
  for (const [category, articles] of byCategory) {
    ordered.push({ category, articles });
  }
  return ordered;
}

export function isArticleCategoryPath(pathname: string): boolean {
  return normalizeArticlePath(pathname).startsWith(`${CATEGORY_PATH_PREFIX}/`);
}

export function categorySlugFromPathname(pathname: string): string | null {
  const normalized = normalizeArticlePath(pathname);
  const prefix = `${CATEGORY_PATH_PREFIX}/`;
  if (!normalized.startsWith(prefix)) return null;
  const slug = normalized.slice(prefix.length);
  return slug.length > 0 && !slug.includes("/") ? slug : null;
}

export function getCategoryGroupBySlug(slug: string): ArticleCategoryGroup | null {
  const category = getCategoryBySlug(slug);
  if (!category) return null;
  const articles = ARTICLES.filter((article) => article.category === category.name);
  return articles.length > 0 ? { category: category.name, articles } : null;
}

/** Articles per category page, sized so even the largest category stays well under the DOM budget. */
export const CATEGORY_PAGE_SIZE = 100;

/** Page 1 keeps the canonical bare path; later pages append /page/N for crawlable pagination. */
export function categoryPagePath(slug: string, page: number): string {
  return page <= 1 ? categoryPath(slug) : `${categoryPath(slug)}/page/${page}`;
}

export interface ArticleCategoryPage {
  category: string;
  slug: string;
  articles: Article[];
  page: number;
  totalPages: number;
  total: number;
}

/** Parse `/articles/category/{slug}` (page 1) and `/articles/category/{slug}/page/{n}` (n >= 2). */
export function parseCategoryPathname(pathname: string): { slug: string; page: number } | null {
  const normalized = normalizeArticlePath(pathname);
  const prefix = `${CATEGORY_PATH_PREFIX}/`;
  if (!normalized.startsWith(prefix)) return null;
  const rest = normalized.slice(prefix.length);
  if (!rest) return null;
  const paged = rest.match(/^([^/]+)\/page\/(\d+)$/);
  if (paged) {
    const page = Number(paged[2]);
    if (!Number.isInteger(page) || page < 2) return null;
    return { slug: paged[1], page };
  }
  return rest.includes("/") ? null : { slug: rest, page: 1 };
}

export function getCategoryPage(slug: string, page: number): ArticleCategoryPage | null {
  const category = getCategoryBySlug(slug);
  if (!category) return null;
  const articles = ARTICLES.filter((article) => article.category === category.name);
  if (articles.length === 0) return null;
  const totalPages = Math.max(1, Math.ceil(articles.length / CATEGORY_PAGE_SIZE));
  if (page < 1 || page > totalPages) return null;
  const start = (page - 1) * CATEGORY_PAGE_SIZE;
  return {
    category: category.name,
    slug: category.slug,
    articles: articles.slice(start, start + CATEGORY_PAGE_SIZE),
    page,
    totalPages,
    total: articles.length
  };
}

/** Sitemap-eligible category paths: one entry per page of every non-empty category. */
export const ARTICLE_CATEGORY_PATHS = ARTICLE_CATEGORIES.flatMap((category) => {
  const count = ARTICLES.filter((article) => article.category === category.name).length;
  if (count === 0) return [];
  const totalPages = Math.max(1, Math.ceil(count / CATEGORY_PAGE_SIZE));
  return Array.from({ length: totalPages }, (_, index) => categoryPagePath(category.slug, index + 1));
});

export const INDEX_ARTICLES_PER_CATEGORY = 8;

/** The most recent updatedAt across all articles, used for the sitemap and index freshness. */
export function latestArticleUpdatedAt(): string {
  return ARTICLES.reduce((latest, article) => (article.updatedAt > latest ? article.updatedAt : latest), ARTICLES[0]?.updatedAt ?? "2026-06-21");
}

/** Estimate reading time from the article's actual text volume (~500 Japanese chars/min). */
export function articleReadMinutes(article: Article): number {
  const sectionChars = article.sections.reduce((sum, section) => {
    const bulletChars = section.bullets?.join("").length ?? 0;
    return sum + section.heading.length + section.paragraphs.join("").length + bulletChars;
  }, 0);
  const faqChars = article.faqs.reduce((sum, faq) => sum + faq.question.length + faq.answer.length, 0);
  const total = article.lead.length + sectionChars + faqChars;
  return Math.max(3, Math.round(total / 500));
}

interface ArticleCta {
  intent: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  proof: string;
}

function articleCtaHref(intent: string): string {
  return `/app/?source=article_cta&intent=${intent}`;
}

function articleSearchText(article: Article): string {
  return `${article.slug} ${article.title} ${article.description} ${article.lead} ${article.category} ${article.keywords}`.toLowerCase();
}

function articleCtaForArticle(article: Article): ArticleCta {
  const text = articleSearchText(article);
  if (text.includes("chatgpt")) {
    return {
      intent: "chatgpt_html",
      eyebrow: "ChatGPT HTML",
      title: "ChatGPTで作ったHTMLを共有する",
      description: "ChatGPTで生成したHTMLを貼り付けるかアップロードすると、相手がブラウザで開ける確認URLになります。",
      primaryLabel: "貼り付けて共有URLを作る",
      proof: "AI生成HTMLの確認用リンクに最短で変換できます"
    };
  }
  if (text.includes("claude") || text.includes("artifact") || text.includes("アーティファクト")) {
    return {
      intent: "claude_artifact",
      eyebrow: "Claude Artifact",
      title: "ClaudeのHTMLを共有URLにする",
      description: "Claude Artifactや書き出したHTMLをアップロードして、相手にそのまま見せられるURLを発行します。",
      primaryLabel: "ClaudeのHTMLを共有する",
      proof: "Artifactの見た目を崩さずレビューに回せます"
    };
  }
  if (article.category === "ZIP公開" || text.includes("zip")) {
    return {
      intent: "zip_publish",
      eyebrow: "ZIP SITE",
      title: "ZIPをアップロードしてURL化する",
      description: "CSS・画像・JSを含むZIPをそのままアップロードして、フォルダ構成を保った確認URLを作れます。",
      primaryLabel: "ZIPをアップロードしてURL化する",
      proof: "index.htmlと素材一式をまとめて共有できます"
    };
  }
  if (text.includes("パスワード")) {
    return {
      intent: "password_preview",
      eyebrow: "PASSWORD PREVIEW",
      title: "パスワード付きURLを作る",
      description: "見せたい相手だけに確認してもらえるよう、HTMLプレビューにパスワードを付けて共有できます。",
      primaryLabel: "パスワード付きURLを作る",
      proof: "URL転送時の意図しない閲覧を抑えられます"
    };
  }
  if (article.category === "HTML共有") {
    return {
      intent: "html_share",
      eyebrow: "HTML SHARE",
      title: "HTMLをURL化して共有する",
      description: "HTMLまたはZIPをアップロードすると、相手がブラウザで開ける確認URLをすぐ発行できます。",
      primaryLabel: "無料でHTMLをURL化する",
      proof: "無料でも1サイトを7日間共有できます"
    };
  }
  if (text.includes("会社ドメイン") || text.includes("ドメイン認証")) {
    return {
      intent: "company_domain",
      eyebrow: "DOMAIN AUTH",
      title: "会社ドメイン限定URLを作る",
      description: "社内や取引先ドメインの人だけが開ける確認URLを作り、HTMLレビューを閉じた範囲で進められます。",
      primaryLabel: "会社ドメイン認証で共有する",
      proof: "Proなら会社ドメイン認証も使えます"
    };
  }
  if (article.category === "比較" || text.includes("github pages") || text.includes("vercel") || text.includes("netlify")) {
    return {
      intent: "deploy_alternative",
      eyebrow: "NO DEPLOY",
      title: "デプロイせずに確認URLを作る",
      description: "GitHub PagesやVercelを設定する前に、まずHTMLをアップロードしてレビュー用URLで見せられます。",
      primaryLabel: "HTMLをアップロードして比較する",
      proof: "一時確認なら設定作業を減らせます"
    };
  }
  if (article.category === "セキュリティ" || text.includes("安全") || text.includes("secret") || text.includes("キー")) {
    return {
      intent: "secure_share",
      eyebrow: "SAFE SHARE",
      title: "安全な確認URLを作る",
      description: "AI生成HTMLを公開前に確認し、noindex・認証・期限付きURLで不用意な露出を避けられます。",
      primaryLabel: "認証付きでHTMLを共有する",
      proof: "共有前の安全チェックと閲覧制限を一緒に扱えます"
    };
  }
  if (article.category === "社内レビュー" || text.includes("レビュー") || text.includes("確認")) {
    return {
      intent: "review_link",
      eyebrow: "REVIEW LINK",
      title: "レビュー用URLを作る",
      description: "確認してほしいHTMLをURL化し、期限や認証を付けて社内・クライアントレビューに回せます。",
      primaryLabel: "確認用URLを発行する",
      proof: "同じURLのまま差し替えられます"
    };
  }
  if (article.category === "トラブルシュート" || text.includes("開けない") || text.includes("真っ白")) {
    return {
      intent: "troubleshoot_share",
      eyebrow: "FIX SHARE",
      title: "崩れないURL共有を試す",
      description: "添付やローカル表示で崩れるHTMLを、ブラウザでそのまま開ける確認URLに変換できます。",
      primaryLabel: "HTML/ZIPをアップロードして確認する",
      proof: "相手の環境差による表示トラブルを減らせます"
    };
  }
  return {
    intent: "html_share",
    eyebrow: "HTML SHARE",
    title: "HTMLをURL化して共有する",
    description: "HTMLまたはZIPをアップロードすると、相手がブラウザで開ける確認URLをすぐ発行できます。",
    primaryLabel: "無料でHTMLをURL化する",
    proof: "無料でも1サイトを7日間共有できます"
  };
}

function renderArticleCtaHtml(article: Article, cta: ArticleCta, placement: "article_mid" | "article_bottom"): string {
  const variantClass = placement === "article_mid" ? " lp-article-cta-inline" : "";
  return `
            <aside class="lp-article-cta${variantClass}" aria-label="${escapeText(cta.title)}">
              <span class="lp-article-cta-eyebrow">${escapeText(cta.eyebrow)}</span>
              <strong>${escapeText(cta.title)}</strong>
              <p>${escapeText(cta.description)}</p>
              <div class="lp-article-cta-actions">
                <a class="lp-btn lp-btn-solid lp-btn-lg" href="${escapeText(articleCtaHref(cta.intent))}" data-measure-event="cta_click" data-measure-placement="${escapeText(placement)}" data-measure-intent="${escapeText(cta.intent)}" data-measure-article="${escapeText(article.path)}">${escapeText(cta.primaryLabel)}</a>
                <a class="lp-btn lp-btn-ghost" href="/#pricing" data-measure-event="cta_click" data-measure-placement="${escapeText(`${placement}_pricing`)}" data-measure-intent="${escapeText(cta.intent)}" data-measure-article="${escapeText(article.path)}">料金を見る</a>
              </div>
              <small>${escapeText(cta.proof)} · 無料: 1サイト/7日 · Pro: ¥980/月</small>
            </aside>`;
}

export function renderStaticArticleHtmlForPathname(pathname: string): string | null {
  if (isArticlesIndexPath(pathname)) return renderArticleIndexStaticHtml();
  const categoryRef = parseCategoryPathname(pathname);
  if (categoryRef) {
    const categoryPageData = getCategoryPage(categoryRef.slug, categoryRef.page);
    return categoryPageData ? renderArticleCategoryStaticHtml(categoryPageData) : null;
  }
  const article = getArticleByPathname(pathname);
  return article ? renderArticleStaticHtml(article) : null;
}

function renderArticleTopbarHtml(): string {
  return `
    <header class="lp-header lp-article-topbar">
      <div class="lp-header-inner">
        <a href="/" class="lp-brand"><span class="giga-brand">ギガサイト便</span></a>
        <nav class="lp-nav lp-article-nav" aria-label="Article navigation">
          <a href="/articles">活用記事</a><a href="/#features">機能</a><a href="/#pricing">料金</a><a href="/contact">お問い合わせ</a>
        </nav>
        <div class="lp-header-actions"><a class="lp-btn lp-btn-solid" href="/app/?source=article_header" data-measure-event="cta_click" data-measure-placement="article_header" data-measure-intent="header_html_share">HTMLをURL化</a></div>
      </div>
    </header>`;
}

function renderArticleFooterHtml(): string {
  const featured = FEATURED_ARTICLE_LINKS.map((link) => `<a href="${link.href}" target="_blank" rel="noreferrer">${escapeText(link.label)}</a>`).join("");
  const legal = LEGAL_LINKS.map((link) => `<a href="${link.path}">${escapeText(link.label)}</a>`).join("");
  return `
    <footer class="lp-legal-footer lp-article-footer">
      <a href="/">トップ</a><a href="/articles">活用記事</a><a href="/contact">お問い合わせ</a>${featured}${legal}
    </footer>`;
}

function renderArticleCard(article: Article): string {
  return `
          <article class="lp-article-card">
            <span class="lp-article-kicker">${escapeText(article.category)}</span>
            <h2><a href="${article.path}">${escapeText(article.title)}</a></h2>
            <p>${escapeText(article.description)}</p>
            <small>${escapeText(articleReadMinutes(article).toString())}分で読める · 更新日 ${escapeText(article.updatedAt)}</small>
          </article>`;
}

function renderArticleIndexStaticHtml(): string {
  const groups = groupArticlesByCategory();
  const total = ARTICLES.length;
  const groupsHtml = groups.map((group) => {
    const cards = group.articles.slice(0, INDEX_ARTICLES_PER_CATEGORY).map((article) => renderArticleCard(article)).join("");
    const category = getCategoryByName(group.category);
    const seeAll = category
      ? `
        <a class="lp-article-more" href="${categoryPath(category.slug)}">${escapeText(group.category)}の記事を全${escapeText(group.articles.length.toString())}件見る →</a>`
      : "";
    return `
      <section class="lp-article-group" aria-label="${escapeText(group.category)}">
        <div class="lp-article-group-head"><h2>${escapeText(group.category)}</h2><span>${escapeText(group.articles.length.toString())}件</span></div>
        <div class="lp-article-list">${cards}
        </div>${seeAll}
      </section>`;
  }).join("");
  return `
  <div class="lp-shell lp-article-shell">${renderArticleTopbarHtml()}
    <main class="lp-article-page">
      <nav class="lp-article-breadcrumb" aria-label="パンくず">
        <a href="/">トップ</a><span aria-hidden="true">›</span><span aria-current="page">活用記事</span>
      </nav>
      <section class="lp-article-hero">
        <span class="lp-article-kicker">Articles</span>
        <h1>ギガサイト便 活用記事</h1>
        <p>AI生成HTML、ZIPサイト、パスワード付きURL、社内レビューなど、ギガサイト便を仕事で使うための実務ガイドを全${escapeText(total.toString())}本そろえています。</p>
      </section>
      ${groupsHtml}
    </main>${renderArticleFooterHtml()}
  </div>`;
}

function renderCategoryPaginationHtml(pageData: ArticleCategoryPage): string {
  if (pageData.totalPages <= 1) return "";
  const { slug, page, totalPages } = pageData;
  const prev = page > 1
    ? `<a class="lp-article-page-link" rel="prev" href="${categoryPagePath(slug, page - 1)}">← 前のページ</a>`
    : `<span class="lp-article-page-link is-disabled" aria-disabled="true">← 前のページ</span>`;
  const next = page < totalPages
    ? `<a class="lp-article-page-link" rel="next" href="${categoryPagePath(slug, page + 1)}">次のページ →</a>`
    : `<span class="lp-article-page-link is-disabled" aria-disabled="true">次のページ →</span>`;
  return `
      <nav class="lp-article-pagination" aria-label="ページ送り">
        ${prev}
        <span class="lp-article-page-status">${escapeText(page.toString())} / ${escapeText(totalPages.toString())}</span>
        ${next}
      </nav>`;
}

function renderArticleCategoryStaticHtml(pageData: ArticleCategoryPage): string {
  const cards = pageData.articles.map((article) => renderArticleCard(article)).join("");
  const pageSuffix = pageData.page > 1 ? `（${pageData.page}/${pageData.totalPages}ページ）` : "";
  const rangeStart = (pageData.page - 1) * CATEGORY_PAGE_SIZE + 1;
  const rangeEnd = rangeStart + pageData.articles.length - 1;
  return `
  <div class="lp-shell lp-article-shell">${renderArticleTopbarHtml()}
    <main class="lp-article-page">
      <nav class="lp-article-breadcrumb" aria-label="パンくず">
        <a href="/">トップ</a><span aria-hidden="true">›</span><a href="/articles">活用記事</a><span aria-hidden="true">›</span><span aria-current="page">${escapeText(pageData.category)}${escapeText(pageSuffix)}</span>
      </nav>
      <section class="lp-article-hero">
        <span class="lp-article-kicker">${escapeText(pageData.category)}</span>
        <h1>${escapeText(pageData.category)}の活用記事${escapeText(pageSuffix)}</h1>
        <p>${escapeText(pageData.category)}に関するギガサイト便の実務ガイドを全${escapeText(pageData.total.toString())}本掲載しています（${escapeText(rangeStart.toString())}〜${escapeText(rangeEnd.toString())}本目を表示）。</p>
      </section>
      <section class="lp-article-group" aria-label="${escapeText(pageData.category)}">
        <div class="lp-article-list">${cards}
        </div>
      </section>${renderCategoryPaginationHtml(pageData)}
    </main>${renderArticleFooterHtml()}
  </div>`;
}

function renderArticleStaticHtml(article: Article): string {
  const toc = article.sections.map((section, index) =>
    `<li><a href="#${articleSectionId(index)}">${escapeText(section.heading)}</a></li>`).join("");
  const faqToc = article.faqs.length ? `<li><a href="#${ARTICLE_FAQ_ANCHOR}">よくある質問</a></li>` : "";

  const cta = articleCtaForArticle(article);
  const midCtaIndex = Math.min(1, article.sections.length - 1);
  const sections = article.sections.map((section, index) => {
    const paragraphs = section.paragraphs.map((paragraph) => `<p>${escapeText(paragraph)}</p>`).join("\n          ");
    const listTag = section.ordered ? "ol" : "ul";
    const listClass = section.ordered ? "lp-article-steps" : "lp-article-points";
    const list = section.bullets
      ? `<${listTag} class="${listClass}">${section.bullets.map((bullet) => `<li>${escapeText(bullet)}</li>`).join("")}</${listTag}>`
      : "";
    const sectionHtml = `
        <section class="lp-article-section" id="${articleSectionId(index)}">
          <h2>${escapeText(section.heading)}</h2>
          ${paragraphs}
          ${list}
        </section>`;
    return index === midCtaIndex ? `${sectionHtml}${renderArticleCtaHtml(article, cta, "article_mid")}` : sectionHtml;
  }).join("");

  const faq = article.faqs.length
    ? `
        <section class="lp-article-faq" id="${ARTICLE_FAQ_ANCHOR}" aria-label="よくある質問">
          <h2>よくある質問</h2>
          ${article.faqs.map((item) => `<details class="lp-article-faq-item"><summary>${escapeText(item.question)}</summary><p>${escapeText(item.answer)}</p></details>`).join("\n          ")}
        </section>`
    : "";

  const relatedArticles = getRelatedArticles(article);
  const relatedCategory = getCategoryByName(article.category);
  const relatedMore = relatedCategory
    ? `
          <a class="lp-article-more" href="${categoryPath(relatedCategory.slug)}">「${escapeText(article.category)}」の記事をもっと見る →</a>`
    : "";
  const related = relatedArticles.length
    ? `
        <section class="lp-article-related" aria-label="関連記事">
          <h2>関連記事</h2>
          <div class="lp-article-related-grid">${relatedArticles.map((item) => `
            <article class="lp-article-card">
              <span class="lp-article-kicker">${escapeText(item.category)}</span>
              <h3><a href="${item.path}">${escapeText(item.title)}</a></h3>
              <p>${escapeText(item.description)}</p>
              <small>${escapeText(articleReadMinutes(item).toString())}分で読める</small>
            </article>`).join("")}
          </div>${relatedMore}
        </section>`
    : "";

  return `
  <div class="lp-shell lp-article-shell">${renderArticleTopbarHtml()}
    <main class="lp-article-page">
      <article class="lp-article-detail">
        <nav class="lp-article-breadcrumb" aria-label="パンくず">
          <a href="/">トップ</a><span aria-hidden="true">›</span><a href="/articles">活用記事</a><span aria-hidden="true">›</span><span aria-current="page">${escapeText(article.title)}</span>
        </nav>
        <header class="lp-article-hero lp-article-detail-hero">
          <span class="lp-article-kicker">${escapeText(article.category)}</span>
          <h1>${escapeText(article.title)}</h1>
          <p>${escapeText(article.lead)}</p>
          <div class="lp-article-meta"><time datetime="${escapeText(article.updatedAt)}">更新日 ${escapeText(article.updatedAt)}</time><span>${escapeText(articleReadMinutes(article).toString())}分で読める</span></div>
        </header>
        <div class="lp-article-layout">
          <aside class="lp-article-toc" aria-label="目次">
            <strong>目次</strong>
            <ol>${toc}${faqToc}</ol>
          </aside>
          <div class="lp-article-body">${sections}${faq}${related}${renderArticleCtaHtml(article, cta, "article_bottom")}
          </div>
        </div>
      </article>
    </main>${renderArticleFooterHtml()}
  </div>`;
}

function escapeText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
