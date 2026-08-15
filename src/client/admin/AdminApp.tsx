import { useCallback, useEffect, useMemo, useState } from "react";
import type { AccessEventSummary, DashboardStats, SiteSummary } from "../../shared/types";
import { api, type AppUser } from "./api";
import { claimErrorIsTerminal, readPendingClaim, removePendingClaim } from "./pending-claim";
import { errorMessageJa } from "./errors";
import { planSiteLimit } from "../../shared/plans";
import { ToastViewport, useToasts } from "./Toast";
import { Sidebar } from "./Sidebar";
import { buildAdminUrl, parseAdminRoute, type AdminRoute, type DetailTab, type Screen } from "./routes";
import { Topbar } from "./Topbar";
import { AuthScreen } from "./auth/AuthScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { UploadScreen } from "./screens/UploadScreen";
import { DetailScreen } from "./screens/DetailScreen";
import { BillingScreen } from "./screens/BillingScreen";
import "../styles/tokens.css";
import "../styles/app.css";

const EMPTY_STATS: DashboardStats = {
  activeSites: 0,
  totalSites: 0,
  monthlyViews: 0,
  monthlyAuthViews: 0,
  totalBytes: 0,
  weeklySiteDelta: 0,
  monthlyViewChangePct: null
};

const CRUMBS: Record<Exclude<Screen, "detail">, string> = {
  dashboard: "ダッシュボード",
  upload: "新規アップロード",
  billing: "課金・プラン"
};

function browserRoute(): AdminRoute {
  if (typeof window === "undefined") return { screen: "dashboard", search: "" };
  return parseAdminRoute(new URL(window.location.href));
}

export function AdminApp() {
  const [authUser, setAuthUser] = useState<AppUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [authMessage, setAuthMessage] = useState("認証状態を確認中...");

  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [sites, setSites] = useState<SiteSummary[]>([]);
  const [selectedSite, setSelectedSite] = useState<SiteSummary | null>(null);
  const [events, setEvents] = useState<AccessEventSummary[]>([]);
  const [planId, setPlanId] = useState<string | null>(null);
  const [unusedSitePurchases, setUnusedSitePurchases] = useState(0);

  const [route, setRoute] = useState<AdminRoute>(() => browserRoute());
  const screen = route.screen;
  const detailTab = route.screen === "detail" ? route.tab : "overview";
  const selectedId = route.screen === "detail" ? route.siteId : null;
  const search = route.screen === "dashboard" ? route.search : "";
  const [status, setStatus] = useState("準備完了");
  const toastController = useToasts();
  const reportError = useCallback(
    (raw: string) => {
      setStatus("準備完了");
      toastController.error(errorMessageJa(raw));
    },
    [toastController]
  );
  const [navOpen, setNavOpen] = useState(false);

  const navigateTo = useCallback((nextRoute: AdminRoute, mode: "push" | "replace" = "push") => {
    setRoute(nextRoute);
    if (typeof window === "undefined") return;
    const nextUrl = buildAdminUrl(nextRoute);
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (nextUrl === currentUrl) return;
    if (mode === "replace") {
      window.history.replaceState(null, "", nextUrl);
    } else {
      window.history.pushState(null, "", nextUrl);
    }
  }, []);

  const setDashboardSearch = useCallback(
    (value: string) => {
      navigateTo({ screen: "dashboard", search: value }, "replace");
    },
    [navigateTo]
  );

  const selected = sites.find((site) => site.id === selectedId) ?? (selectedSite?.id === selectedId ? selectedSite : null);
  const publicOrigin = typeof window === "undefined" ? "https://giga-site.com" : window.location.origin;

  async function refreshAuth() {
    setIsAuthChecking(true);
    try {
      await api.bootstrap();
      try {
        const me = await api.me();
        setAuthUser(me.user);
      } catch {
        setAuthUser(null);
        setAuthMessage("メールアドレスで新規登録・ログインできます");
      }
    } catch (error) {
      setAuthUser(null);
      setAuthMessage(error instanceof Error ? error.message : "auth_check_failed");
    } finally {
      setIsAuthChecking(false);
    }
  }

  async function refreshAll() {
    const [siteData, statsData] = await Promise.all([api.sites(), api.dashboard()]);
    setSites(siteData.sites);
    setStats(statsData.stats);
  }

  async function refreshSelectedSite(siteId: string) {
    const data = await api.site(siteId);
    setSelectedSite(data.site);
    setSites((current) => {
      if (current.some((site) => site.id === data.site.id)) {
        return current.map((site) => (site.id === data.site.id ? data.site : site));
      }
      return [data.site, ...current];
    });
  }

  async function handleSignOut() {
    await api.signOut().catch(() => undefined);
    setAuthUser(null);
    setSites([]);
    setSelectedSite(null);
    setStats(EMPTY_STATS);
    setPlanId(null);
    setUnusedSitePurchases(0);
    navigateTo({ screen: "dashboard", search: "" }, "replace");
    await refreshAuth();
  }

  useEffect(() => {
    void refreshAuth();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onPopState = () => {
      setRoute(browserRoute());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!authUser) {
      return;
    }
    void refreshAll().catch((error: unknown) => setStatus(error instanceof Error ? error.message : "dashboard_failed"));
  }, [authUser?.id]);

  useEffect(() => {
    if (!authUser) {
      return;
    }
    let storage: Storage | null = null;
    try {
      storage = window.localStorage;
    } catch {
      storage = null;
    }
    const pending = readPendingClaim(storage);
    if (!pending?.claimToken) {
      return;
    }
    void api
      .claimSite(pending.claimToken)
      .then((result) => {
        removePendingClaim(storage);
        setStatus("公開したサイトをアカウントに紐づけました");
        void refreshAll();
        navigateTo({ screen: "detail", siteId: result.siteId, tab: "overview" });
      })
      .catch((error: unknown) => {
        if (claimErrorIsTerminal(error)) {
          removePendingClaim(storage);
          return;
        }
        const message = "公開したサイトの自動紐づけに失敗しました。再読み込み後に再試行します。";
        setStatus(message);
        toastController.error(message);
      });
  }, [authUser?.id, navigateTo, toastController]);

  useEffect(() => {
    if (!authUser || screen !== "detail" || !selectedId) {
      setSelectedSite(null);
      return;
    }
    let active = true;
    void api
      .site(selectedId)
      .then((data) => {
        if (!active) return;
        setSelectedSite(data.site);
        setSites((current) => {
          if (current.some((site) => site.id === data.site.id)) {
            return current.map((site) => (site.id === data.site.id ? data.site : site));
          }
          return [data.site, ...current];
        });
      })
      .catch((error: unknown) => setStatus(error instanceof Error ? error.message : "site_detail_failed"));
    return () => {
      active = false;
    };
  }, [authUser?.id, screen, selectedId]);

  useEffect(() => {
    if (!authUser) {
      return;
    }
    void api
      .subscription()
      .then((data) => {
        const activePlanId = data.subscription.status === "active" || data.subscription.status === "trialing" ? data.subscription.planId : null;
        setPlanId(activePlanId);
        setUnusedSitePurchases(data.subscription.unusedSitePurchases ?? 0);
      })
      .catch(() => {
        setPlanId(null);
        setUnusedSitePurchases(0);
      });
  }, [authUser?.id]);

  useEffect(() => {
    if (screen === "detail" && detailTab === "logs" && selectedId) {
      void api
        .events(selectedId)
        .then((data) => setEvents(data.events))
        .catch((error: unknown) => setStatus(error instanceof Error ? error.message : "events_failed"));
    }
  }, [screen, detailTab, selectedId]);

  const filteredSites = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return sites;
    return sites.filter((site) => site.title.toLowerCase().includes(query) || site.slug.toLowerCase().includes(query));
  }, [search, sites]);

  const activeCount = sites.filter((site) => site.status === "active" && site.currentRevisionId).length;
  const canUsePermanentExpiry = Boolean(planId) || unusedSitePurchases > 0;

  if (isAuthChecking) {
    return (
      <div className="forge" style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--surface)" }}>
        <p className="gs-muted">{authMessage}</p>
      </div>
    );
  }

  if (!authUser) {
    return <AuthScreen initialMessage={authMessage} onAuthenticated={(user) => setAuthUser(user)} />;
  }

  const crumb = screen === "detail" && selected ? selected.title : CRUMBS[screen as Exclude<Screen, "detail">] ?? "ダッシュボード";

  function openDetail(site: SiteSummary) {
    navigateTo({ screen: "detail", siteId: site.id, tab: "overview" });
  }

  return (
    <div className="forge gs-app">
      <Sidebar
        active={screen}
        isOpen={navOpen}
        onNavigate={(next) => {
          setNavOpen(false);
          if (next === "dashboard") navigateTo({ screen: "dashboard", search });
          if (next === "upload") navigateTo({ screen: "upload" });
          if (next === "billing") navigateTo({ screen: "billing" });
        }}
        siteCount={sites.length}
        siteLimit={planSiteLimit(planId)}
        storageBytes={stats.totalBytes}
        user={authUser}
        onSignOut={() => void handleSignOut()}
      />
      {navOpen ? <div className="gs-nav-overlay" onClick={() => setNavOpen(false)} /> : null}
      <div className="gs-main">
        <Topbar
          crumb={crumb}
          status={status}
          showSearch={screen === "dashboard"}
          searchValue={search}
          onSearch={setDashboardSearch}
          onUpload={() => navigateTo({ screen: "upload" })}
          onMenu={() => setNavOpen(true)}
        />
        <div className="gs-scroll">
          {screen === "dashboard" ? (
            <DashboardScreen
              stats={stats}
              sites={filteredSites}
              totalCount={stats.totalSites || sites.length}
              activeCount={stats.activeSites || activeCount}
              searching={search.trim().length > 0}
              onOpen={openDetail}
            />
          ) : null}

          {screen === "upload" ? (
            <UploadScreen
              publicOrigin={publicOrigin}
              canUsePermanentExpiry={canUsePermanentExpiry}
              notify={toastController}
              setStatus={setStatus}
              onError={reportError}
              onCancel={() => navigateTo({ screen: "dashboard", search })}
              onPublished={(site) => {
                void refreshAll();
                openDetail(site);
              }}
            />
          ) : null}

          {screen === "detail" && selected ? (
            <DetailScreen
              key={selected.id}
              site={selected}
              events={events}
              tab={detailTab}
              onTab={(tab) => navigateTo({ screen: "detail", siteId: selected.id, tab })}
              onBack={() => navigateTo({ screen: "dashboard", search })}
              onChanged={() => {
                void refreshAll();
                void refreshSelectedSite(selected.id);
              }}
              onDeleted={() => {
                setSelectedSite(null);
                navigateTo({ screen: "dashboard", search }, "replace");
                void refreshAll();
              }}
              setStatus={setStatus}
              onError={reportError}
            />
          ) : null}

          {screen === "detail" && !selected ? (
            <div className="ds-card" style={{ padding: 24 }}>
              <p className="gs-muted">サイト情報を読み込み中です...</p>
            </div>
          ) : null}

          {screen === "billing" ? (
            <BillingScreen siteCount={sites.length} storageBytes={stats.totalBytes} setStatus={setStatus} onError={reportError} />
          ) : null}
        </div>
        <ToastViewport />
      </div>
    </div>
  );
}
