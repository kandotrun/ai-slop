import { AGENT_MANIFEST_PATH, WEBMCP_MANIFEST_PATH, WEBMCP_PAGE_PATH, buildAgentSetupManifest, buildAgentsTxt, buildWebMcpManifest } from "../shared/agent-handoff";
import { injectGigaSiteMeasurement, injectGoogleAnalytics } from "../shared/analytics";
import { renderStaticArticleHtmlForPathname } from "../shared/articles";
import { DEMO_HTML_ASSET_PATH, DEMO_HTML_DOWNLOAD_PATH, DEMO_HTML_FILE_NAME } from "../shared/demo-site";
import { renderStaticLandingHtmlForPathname } from "../shared/landing-static";
import { LLMS_TXT_PATH, htmlPathFromMarkdownPath, markdownPathForHtmlPath, renderMarkdownForPathname, buildLlmsTxt } from "../shared/markdown";
import { getSeoMetaForPathname, buildRobotsTxt, buildSitemapXml, injectSeoHead, SEO_IMAGE_PATH } from "../shared/seo";
import { renderStaticSupportHtmlForPathname } from "../shared/support-static";
import { createApiApp } from "./api";
import { handlePreviewEmailDomainAuth, handlePreviewPasswordAuth, handlePreviewRequest } from "./preview";
import { extractLocalPreviewSlug, extractPreviewSlugFromHost, isLocalPreviewFallbackHost, stripAppBasePath } from "./preview-routing";

const api = createApiApp();
const ROOT_PUBLIC_ASSET_PATHS = new Set(["/favicon.svg", "/ギガサイト便.svg"]);
const HASHED_ASSET_PATTERN = /^\/assets\/.+-[A-Za-z0-9_-]+\.(?:css|js|mjs|woff2?|ttf|png|jpg|jpeg|webp|svg)$/;

function redirect(path: string): Response {
  return new Response(null, { status: 307, headers: { Location: path } });
}

function assetRequestFromPath(request: Request, assetPath: string): Request {
  const url = new URL(request.url);
  url.hostname = "assets.local";
  // Workers Assets canonicalizes /index.html to / with a redirect. Fetch / directly so
  // the public service path can stay mounted at /app/ instead of bouncing to /.
  url.pathname = assetPath === "/index.html" ? "/" : assetPath;
  return new Request(url, request);
}

function safelyDecodePathname(pathname: string): string {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

async function serveDemoHtmlDownload(request: Request, env: Env): Promise<Response> {
  const assetResponse = await env.ASSETS.fetch(assetRequestFromPath(request, DEMO_HTML_ASSET_PATH));
  if (!assetResponse.ok) {
    return assetResponse;
  }
  const headers = new Headers(assetResponse.headers);
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Content-Disposition", `attachment; filename="${DEMO_HTML_FILE_NAME}"`);
  headers.set("Cache-Control", "public, max-age=3600");
  return new Response(assetResponse.body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers
  });
}

async function serveClientAsset(request: Request, env: Env, assetPath: string): Promise<Response> {
  const assetResponse = await env.ASSETS.fetch(assetRequestFromPath(request, assetPath));
  if (!assetResponse.ok || !HASHED_ASSET_PATTERN.test(assetPath)) {
    return assetResponse;
  }
  const headers = new Headers(assetResponse.headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(assetResponse.body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers
  });
}

function appendAgentDiscoveryHeaders(headers: Headers, origin: string): void {
  headers.append("Link", `<${origin}${WEBMCP_MANIFEST_PATH}>; rel="webmcp"; type="application/json"`);
  headers.append("Link", `<${origin}/agents.txt>; rel="agents"; type="text/plain"`);
  headers.append("Link", `<${origin}${AGENT_MANIFEST_PATH}>; rel="agent-manifest"; type="application/json"`);
  headers.append("Link", `<${origin}${LLMS_TXT_PATH}>; rel="llms"; type="text/plain"`);
}

function appendMarkdownAlternateHeader(headers: Headers, origin: string, pathname: string): void {
  const markdownPath = markdownPathForHtmlPath(pathname);
  if (markdownPath) {
    headers.append("Link", `<${origin}${markdownPath}>; rel="alternate"; type="text/markdown"`);
  }
}

function appendVary(headers: Headers, value: string): void {
  const existing = headers.get("Vary");
  if (!existing) {
    headers.set("Vary", value);
    return;
  }
  const values = existing.split(",").map((item) => item.trim().toLowerCase());
  if (!values.includes(value.toLowerCase())) {
    headers.set("Vary", `${existing}, ${value}`);
  }
}

function acceptQuality(accept: string, mediaType: string, includeWildcard = false): number {
  let best = -1;
  for (const part of accept.split(",")) {
    const [type, ...params] = part.trim().split(";").map((item) => item.trim());
    if (!type) continue;
    const qParam = params.find((param) => param.toLowerCase().startsWith("q="));
    const q = qParam ? Number(qParam.slice(2)) : 1;
    if (!Number.isFinite(q) || q <= 0) continue;
    const normalizedType = type.toLowerCase();
    if (normalizedType === mediaType || (includeWildcard && normalizedType === "*/*")) {
      best = Math.max(best, q);
    }
  }
  return best;
}

function wantsMarkdown(request: Request): boolean {
  const accept = request.headers.get("Accept") ?? "";
  const markdownQ = acceptQuality(accept, "text/markdown");
  if (markdownQ < 0) return false;
  const htmlQ = acceptQuality(accept, "text/html", true);
  return markdownQ >= Math.max(htmlQ, 0);
}

function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(Array.from(text).length / 3));
}

function markdownResponse(pathname: string, env: Env): Response | null {
  const origin = `https://${env.APP_HOST}`;
  const markdown = renderMarkdownForPathname(pathname, origin);
  if (!markdown) return null;
  const htmlPath = htmlPathFromMarkdownPath(pathname) ?? pathname;
  const html = renderStaticArticleHtmlForPathname(htmlPath) ?? renderStaticLandingHtmlForPathname(htmlPath) ?? "";
  const headers = new Headers({
    "Content-Type": "text/markdown; charset=utf-8",
    "Cache-Control": "public, max-age=300",
    "Content-Signal": "ai-train=yes, search=yes, ai-input=yes",
    "X-Markdown-Tokens": estimateTokens(markdown).toString(),
    "X-Original-Tokens": estimateTokens(html || markdown).toString()
  });
  appendVary(headers, "Accept");
  appendAgentDiscoveryHeaders(headers, origin);
  return new Response(markdown, { headers });
}

async function serveSeoShell(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const meta = getSeoMetaForPathname(url.pathname, env.APP_BASE_PATH);
  const assetResponse = await env.ASSETS.fetch(assetRequestFromPath(request, "/index.html"));
  if (!assetResponse.ok || !meta) return assetResponse;
  const headers = new Headers(assetResponse.headers);
  headers.set("Content-Type", "text/html; charset=utf-8");
  if (meta.robots === "noindex,nofollow") {
    headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  appendAgentDiscoveryHeaders(headers, `https://${env.APP_HOST}`);
  appendMarkdownAlternateHeader(headers, `https://${env.APP_HOST}`, url.pathname);
  appendVary(headers, "Accept");
  const articleHtml = renderStaticArticleHtmlForPathname(url.pathname);
  const staticRootHtml = articleHtml ?? renderStaticLandingHtmlForPathname(url.pathname) ?? renderStaticSupportHtmlForPathname(url.pathname);
  // Article pages are fully static HTML — the SPA never mounts there (see main.tsx isArticlePath),
  // so drop the client bundle tags to keep these content pages lightweight for Core Web Vitals.
  let shellText = await assetResponse.text();
  if (articleHtml) shellText = stripClientBundleTags(shellText);
  const shellHtml = staticRootHtml ? injectRootHtml(shellText, staticRootHtml) : shellText;
  const seoHtml = injectSeoHead(shellHtml, meta, `https://${env.APP_HOST}`);
  const html = injectGigaSiteMeasurement(injectGoogleAnalytics(seoHtml, env.GA_MEASUREMENT_ID));
  return new Response(html, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers
  });
}

// Strip the SPA entry script and its modulepreload so static-only pages skip the client bundle.
function stripClientBundleTags(html: string): string {
  return html
    .replace(/\s*<script\b[^>]*\btype=["']module["'][^>]*><\/script>/gi, "")
    .replace(/\s*<link\b[^>]*\brel=["']modulepreload["'][^>]*>/gi, "");
}

function injectRootHtml(html: string, rootHtml: string): string {
  if (/<div\s+id=["']root["']\s*><\/div>/i.test(html)) {
    return html.replace(/<div\s+id=["']root["']\s*><\/div>/i, `<div id="root">${rootHtml}</div>`);
  }
  return html.replace("</body>", `<div id="root">${rootHtml}</div></body>`);
}

function robotsResponse(env: Env): Response {
  return new Response(buildRobotsTxt(`https://${env.APP_HOST}`), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}

function sitemapResponse(env: Env): Response {
  return new Response(buildSitemapXml(`https://${env.APP_HOST}`), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}

function webMcpPageResponse(env: Env): Response {
  const origin = `https://${env.APP_HOST}`;
  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>WebMCP｜ギガサイト便</title><link rel="webmcp" href="${WEBMCP_MANIFEST_PATH}" type="application/json" /></head><body><main style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:760px;margin:48px auto;padding:0 20px;line-height:1.7"><h1>ギガサイト便 WebMCP</h1><p>ギガサイト便は、対応ブラウザ上で <code>navigator.modelContext</code> によるWebMCPツールを公開します。</p><ul><li><a href="${WEBMCP_MANIFEST_PATH}">WebMCP manifest</a></li><li><a href="/agents.txt">agents.txt</a></li><li><a href="/api/agent/setup">Agent setup JSON</a></li></ul><p>ファイル選択やアップロードはユーザー操作を前提にし、秘密情報や個人情報を勝手に公開しない安全ルールを優先します。</p><p><a href="${origin}/">トップへ戻る</a></p></main></body></html>`;
  const headers = new Headers({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300" });
  appendAgentDiscoveryHeaders(headers, origin);
  return new Response(html, { headers });
}

async function handleAppRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === "/robots.txt") {
    return robotsResponse(env);
  }
  if (url.pathname === "/sitemap.xml") {
    return sitemapResponse(env);
  }
  if (url.pathname === LLMS_TXT_PATH) {
    return new Response(buildLlmsTxt(`https://${env.APP_HOST}`), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        "Content-Signal": "ai-train=yes, search=yes, ai-input=yes"
      }
    });
  }
  if (url.pathname === SEO_IMAGE_PATH) {
    return env.ASSETS.fetch(assetRequestFromPath(request, SEO_IMAGE_PATH));
  }
  const decodedPathname = safelyDecodePathname(url.pathname);
  if (ROOT_PUBLIC_ASSET_PATHS.has(decodedPathname)) {
    return env.ASSETS.fetch(assetRequestFromPath(request, decodedPathname));
  }
  if (url.pathname === "/agents.txt") {
    return new Response(buildAgentsTxt(`https://${env.APP_HOST}`), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300"
      }
    });
  }
  if (url.pathname === WEBMCP_MANIFEST_PATH || url.pathname === "/.well-known/mcp.json") {
    return Response.json(buildWebMcpManifest(`https://${env.APP_HOST}`), {
      headers: { "Cache-Control": "public, max-age=300" }
    });
  }
  if (url.pathname === WEBMCP_PAGE_PATH || url.pathname === `${WEBMCP_PAGE_PATH}/`) {
    return webMcpPageResponse(env);
  }
  if (url.pathname === AGENT_MANIFEST_PATH) {
    return Response.json(buildAgentSetupManifest(`https://${env.APP_HOST}`), {
      headers: { "Cache-Control": "public, max-age=300" }
    });
  }
  if (url.pathname === DEMO_HTML_DOWNLOAD_PATH || url.pathname === DEMO_HTML_ASSET_PATH) {
    return serveDemoHtmlDownload(request, env);
  }
  const explicitMarkdown = markdownResponse(url.pathname, env);
  if (explicitMarkdown && htmlPathFromMarkdownPath(url.pathname)) {
    return explicitMarkdown;
  }
  const seoMeta = getSeoMetaForPathname(url.pathname, env.APP_BASE_PATH);
  const appBase = env.APP_BASE_PATH.endsWith("/") ? env.APP_BASE_PATH.slice(0, -1) : env.APP_BASE_PATH;
  const isAppPath = url.pathname === appBase || url.pathname.startsWith(`${appBase}/`);
  if (seoMeta && !isAppPath && wantsMarkdown(request)) {
    const negotiatedMarkdown = markdownResponse(url.pathname, env);
    if (negotiatedMarkdown) return negotiatedMarkdown;
  }
  if (seoMeta && !isAppPath) {
    return serveSeoShell(request, env);
  }

  const appPath = stripAppBasePath(url.pathname, env.APP_BASE_PATH);

  if (appPath.kind === "redirect") {
    return redirect(appPath.path);
  }
  if (appPath.kind === "asset") {
    if (appPath.path === "/index.html") {
      return serveSeoShell(request, env);
    }
    return serveClientAsset(request, env, appPath.path);
  }

  return new Response("Not found", { status: 404 });
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);
    const previewHostSlug = extractPreviewSlugFromHost(url.hostname, env.PREVIEW_HOST_SUFFIX);

    if (url.pathname.startsWith("/preview-auth/")) {
      return handlePreviewPasswordAuth(request, env);
    }
    if (url.pathname.startsWith("/preview-email-auth/")) {
      return handlePreviewEmailDomainAuth(request, env);
    }

    // Production preview hosts such as {siteId}.giga-site.com should never expose the admin API.
    if (previewHostSlug) {
      return handlePreviewRequest(request, env, ctx);
    }

    if (url.pathname.startsWith("/api/")) {
      return api.fetch(request, env, ctx);
    }

    if (isLocalPreviewFallbackHost(url.hostname) && extractLocalPreviewSlug(url.pathname)) {
      return handlePreviewRequest(request, env, ctx);
    }

    return handleAppRequest(request, env);
  }
} satisfies ExportedHandler<Env>;
