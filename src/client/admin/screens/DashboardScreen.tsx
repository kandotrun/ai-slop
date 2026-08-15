import type { DashboardStats, SiteSummary } from "../../../shared/types";
import { authBadgeStyle, authLabel, expiryEndLabel, expiryLabel, formatBytes, formatNumber, previewDisplayHost, statusDot, statusLabel } from "../format";
import { Badge } from "../../ui/Badge";
import { ArrowRightIcon, ClockIcon, EyeIcon, FileCodeIcon, HardDriveIcon, ShieldCheckIcon } from "../../ui/icons";

interface DashboardScreenProps {
  stats: DashboardStats;
  sites: SiteSummary[];
  totalCount: number;
  activeCount: number;
  searching: boolean;
  onOpen: (site: SiteSummary) => void;
}

function deltaNote(value: number): string {
  return `${value >= 0 ? "+" : ""}${value} 今週`;
}

function viewChangeNote(pct: number | null): string {
  if (pct === null) return "先月比 —";
  return `${pct >= 0 ? "+" : ""}${pct}% 先月比`;
}

function ExpiryCell({ site }: { site: SiteSummary }) {
  const endLabel = expiryEndLabel(site);
  return (
    <span className="gs-cell-expiry" data-label="期限">
      <ClockIcon size={13} />
      <span className="gs-expiry-stack">
        <span>{expiryLabel(site)}</span>
        {endLabel ? <span className="gs-expiry-end">{endLabel}</span> : null}
      </span>
    </span>
  );
}

export function DashboardScreen({ stats, sites, totalCount, activeCount, searching, onOpen }: DashboardScreenProps) {
  return (
    <div className="gs-content" style={{ maxWidth: 1320 }}>
      <div className="gs-page-head">
        <div>
          <h1 className="gs-h1">サイト</h1>
          <p className="gs-sub">
            {totalCount} 件のサイト · {activeCount} 件が公開中
          </p>
        </div>
      </div>

      <div className="gs-stats">
        <div className="gs-stat">
          <div className="gs-stat-head">
            <span>公開中サイト</span>
            <FileCodeIcon size={15} />
          </div>
          <div className="gs-stat-value">{formatNumber(stats.activeSites)}</div>
          <div className="gs-stat-note">{deltaNote(stats.weeklySiteDelta)}</div>
        </div>
        <div className="gs-stat">
          <div className="gs-stat-head">
            <span>今月の閲覧数</span>
            <EyeIcon size={15} />
          </div>
          <div className="gs-stat-value">{formatNumber(stats.monthlyViews)}</div>
          <div className="gs-stat-note">{viewChangeNote(stats.monthlyViewChangePct)}</div>
        </div>
        <div className="gs-stat">
          <div className="gs-stat-head">
            <span>認証ビュー</span>
            <ShieldCheckIcon size={15} />
          </div>
          <div className="gs-stat-value">{formatNumber(stats.monthlyAuthViews)}</div>
          <div className="gs-stat-note">会社ドメイン経由</div>
        </div>
        <div className="gs-stat">
          <div className="gs-stat-head">
            <span>ストレージ</span>
            <HardDriveIcon size={15} />
          </div>
          <div className="gs-stat-value">{formatBytes(stats.totalBytes)}</div>
          <div className="gs-stat-note">200 MB 中</div>
        </div>
      </div>

      <div className="gs-table">
        <div className="gs-thead">
          <span>サイト</span>
          <span>ステータス</span>
          <span>認証方式</span>
          <span>閲覧</span>
          <span>公開期限</span>
          <span />
        </div>
        {sites.length === 0 ? (
          <div className="gs-empty">
            {searching ? "一致するサイトがありません。" : "まだサイトがありません。新規アップロードからHTMLを公開できます。"}
          </div>
        ) : (
          sites.map((site) => (
            <button key={site.id} className="gs-row" onClick={() => onOpen(site)}>
              <span className="gs-site-cell">
                <span className="gs-site-icon">
                  <FileCodeIcon size={17} />
                </span>
                <span className="gs-site-text">
                  <span className="gs-site-title">{site.title}</span>
                  <span className="gs-site-host">{previewDisplayHost(site.previewUrl)}</span>
                </span>
              </span>
              <span className="gs-status" data-label="状態">
                <span className="gs-dot" style={{ background: statusDot(site) }} />
                {statusLabel(site)}
              </span>
              <span data-label="認証">
                <Badge {...authBadgeStyle(site.authMode)}>{authLabel(site)}</Badge>
              </span>
              <span className="gs-cell-mono" data-label="閲覧">{formatNumber(site.metrics.views)}</span>
              <ExpiryCell site={site} />
              <span style={{ display: "grid", placeContent: "center", color: "var(--muted-foreground)" }}>
                <ArrowRightIcon size={16} />
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
