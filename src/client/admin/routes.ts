export type Screen = "dashboard" | "upload" | "detail" | "billing";
export type DetailTab = "overview" | "auth" | "forms" | "revisions" | "comments" | "logs";

export type AdminRoute =
  | { screen: "dashboard"; search: string }
  | { screen: "upload" }
  | { screen: "billing" }
  | { screen: "detail"; siteId: string; tab: DetailTab };

const DEFAULT_BASE_PATH = "/app";
const DETAIL_TABS = new Set<DetailTab>(["overview", "auth", "forms", "revisions", "comments", "logs"]);

function normalizeBasePath(basePath = DEFAULT_BASE_PATH): string {
  if (!basePath || basePath === "/") return "";
  const withLeading = basePath.startsWith("/") ? basePath : `/${basePath}`;
  return withLeading.endsWith("/") ? withLeading.slice(0, -1) : withLeading;
}

function safeDecode(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

export function parseAdminRoute(url: URL, basePath = DEFAULT_BASE_PATH): AdminRoute {
  const base = normalizeBasePath(basePath);
  const baseWithSlash = `${base}/`;
  const path = url.pathname === base ? baseWithSlash : url.pathname;
  if (path === baseWithSlash) {
    return { screen: "dashboard", search: url.searchParams.get("q") ?? "" };
  }
  if (!path.startsWith(baseWithSlash)) {
    return { screen: "dashboard", search: "" };
  }

  const segments = path.slice(baseWithSlash.length).replace(/\/+$/, "").split("/").filter(Boolean);
  if (segments[0] === "upload" && segments.length === 1) return { screen: "upload" };
  if (segments[0] === "billing" && segments.length === 1) return { screen: "billing" };
  if (segments[0] === "sites" && segments[1]) {
    const siteId = safeDecode(segments[1]);
    const tabCandidate = segments[2] ?? "overview";
    if (siteId && DETAIL_TABS.has(tabCandidate as DetailTab) && segments.length <= 3) {
      return { screen: "detail", siteId, tab: tabCandidate as DetailTab };
    }
  }

  return { screen: "dashboard", search: "" };
}

export function buildAdminUrl(route: AdminRoute, basePath = DEFAULT_BASE_PATH): string {
  const base = normalizeBasePath(basePath) || "/";
  const prefix = base === "/" ? "" : base;
  if (route.screen === "dashboard") {
    const query = route.search.trim();
    if (!query) return `${prefix}/`;
    const params = new URLSearchParams({ q: query });
    return `${prefix}/?${params.toString()}`;
  }
  if (route.screen === "upload") return `${prefix}/upload`;
  if (route.screen === "billing") return `${prefix}/billing`;

  const sitePath = `${prefix}/sites/${encodeURIComponent(route.siteId)}`;
  return route.tab === "overview" ? sitePath : `${sitePath}/${route.tab}`;
}
