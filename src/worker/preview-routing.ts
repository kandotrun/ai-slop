const RESERVED_PREVIEW_SLUGS = new Set([
  "app",
  "api",
  "admin",
  "assets",
  "static",
  "www",
  "mail",
  "ftp"
]);

export type AppPathMatch =
  | { kind: "asset"; path: string }
  | { kind: "redirect"; path: string }
  | { kind: "none" };

export function extractPreviewSlugFromHost(hostname: string, suffix: string): string | null {
  if (!suffix.startsWith(".")) {
    return null;
  }
  if (!hostname.endsWith(suffix)) {
    return null;
  }
  const slug = hostname.slice(0, -suffix.length).toLowerCase();
  if (!slug || slug.includes(".") || RESERVED_PREVIEW_SLUGS.has(slug)) {
    return null;
  }
  return slug;
}

export function extractLocalPreviewSlug(pathname: string): string | null {
  const match = pathname.match(/^\/preview\/([^/]+)(?:\/.*)?$/);
  return match?.[1] ?? null;
}

export function isLocalPreviewFallbackHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export function buildPreviewUrl(slug: string, suffix: string): string {
  if (suffix.startsWith(".")) {
    return `https://${slug}${suffix}/`;
  }
  return `/preview/${slug}/`;
}

export function previewPathFromLocalRequest(pathname: string): string {
  const match = pathname.match(/^\/preview\/[^/]+\/?(.*)$/);
  const path = match?.[1] ?? "";
  return path.length > 0 ? path : "index.html";
}

export function normalizeAppBasePath(basePath: string | undefined): string {
  if (!basePath || basePath === "/") {
    return "/";
  }
  const withLeading = basePath.startsWith("/") ? basePath : `/${basePath}`;
  return withLeading.endsWith("/") ? withLeading.slice(0, -1) : withLeading;
}

function isAppAssetPath(pathname: string): boolean {
  if (pathname.startsWith("/assets/")) return true;
  const finalSegment = pathname.split("/").pop() ?? "";
  return /\.[A-Za-z0-9]{2,12}$/.test(finalSegment);
}

export function stripAppBasePath(pathname: string, basePath: string | undefined): AppPathMatch {
  const normalizedBase = normalizeAppBasePath(basePath);
  if (normalizedBase === "/") {
    return { kind: "asset", path: pathname === "/" ? "/index.html" : pathname };
  }
  if (pathname === "/") {
    return { kind: "asset", path: "/index.html" };
  }
  if (pathname === normalizedBase) {
    return { kind: "redirect", path: `${normalizedBase}/` };
  }
  if (!pathname.startsWith(`${normalizedBase}/`)) {
    return { kind: "none" };
  }
  const stripped = pathname.slice(normalizedBase.length);
  if (stripped === "/") {
    return { kind: "asset", path: "/index.html" };
  }
  return { kind: "asset", path: isAppAssetPath(stripped) ? stripped : "/index.html" };
}
