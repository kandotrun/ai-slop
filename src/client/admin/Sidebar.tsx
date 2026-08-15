import type { AppUser } from "./api";
import type { Screen } from "./routes";
import { formatBytes } from "./format";
import { formatSiteLimit } from "../../shared/plans";
import { BrandName } from "../BrandName";
import { CreditCardIcon, HelpCircleIcon, LayoutGridIcon, LogOutIcon, UploadCloudIcon } from "../ui/icons";

interface SidebarProps {
  active: Screen;
  onNavigate: (screen: Screen) => void;
  siteCount: number;
  siteLimit: number | null;
  storageBytes: number;
  user: AppUser;
  onSignOut: () => void;
  isOpen?: boolean;
}

const STORAGE_LIMIT = 200 * 1024 * 1024;

export function Sidebar({ active, onNavigate, siteCount, siteLimit, storageBytes, user, onSignOut, isOpen = false }: SidebarProps) {
  const dashActive = active === "dashboard" || active === "detail";
  const sitePct = siteLimit ? Math.min(100, Math.round((siteCount / siteLimit) * 100)) : 0;
  const storagePct = Math.min(100, Math.round((storageBytes / STORAGE_LIMIT) * 100));

  return (
    <aside className={`gs-sidebar${isOpen ? " is-open" : ""}`}>
      <div className="gs-brand">
        <span className="gs-brand-name"><BrandName /></span>
        <span className="gs-brand-host">giga-site.com</span>
      </div>

      <nav className="gs-nav">
        <button className={`gs-nav-item${dashActive ? " is-active" : ""}`} onClick={() => onNavigate("dashboard")}>
          <LayoutGridIcon size={17} />
          <span>ダッシュボード</span>
        </button>
        <button className={`gs-nav-item${active === "upload" ? " is-active" : ""}`} onClick={() => onNavigate("upload")}>
          <UploadCloudIcon size={17} />
          <span>新規アップロード</span>
        </button>
        <button className={`gs-nav-item${active === "billing" ? " is-active" : ""}`} onClick={() => onNavigate("billing")}>
          <CreditCardIcon size={17} />
          <span>課金・プラン</span>
        </button>
      </nav>

      <div className="gs-sidebar-foot">
        <div className="gs-usage">
          <div className="gs-usage-row">
            <span>サイト数</span>
            <span className="mono">
              {siteCount} / {formatSiteLimit(siteLimit)}
            </span>
          </div>
          {siteLimit !== null ? (
            <div className="gs-meter">
              <div className="gs-meter-fill" style={{ width: `${sitePct}%`, background: "var(--ac)" }} />
            </div>
          ) : null}
          <div className="gs-usage-row" style={{ marginTop: 10 }}>
            <span>ストレージ</span>
            <span className="mono">{formatBytes(storageBytes)} / 200 MB</span>
          </div>
          <div className="gs-meter">
            <div className="gs-meter-fill" style={{ width: `${storagePct}%`, background: "var(--neutral-400)" }} />
          </div>
        </div>

        <a className="gs-nav-item" href="/contact?type=question">
          <HelpCircleIcon size={17} />
          <span>サポート</span>
        </a>

        <button className="gs-user" onClick={onSignOut} title="ログアウト" aria-label="ログアウト" style={{ border: 0, background: "transparent", cursor: "pointer" }}>
          <span className="gs-avatar">{(user.name.trim() || user.email).slice(0, 1).toUpperCase()}</span>
          <span className="gs-user-meta">
            <span className="gs-user-name">{user.name || "オーナー"}</span>
            <span className="gs-user-email">{user.email}</span>
          </span>
          <LogOutIcon size={16} className="gs-user-logout" />
        </button>
      </div>
    </aside>
  );
}
