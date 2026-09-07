import type { OperatorSite, OperatorUser } from "../../../../shared/operator";
import { formatBytes, formatJapanDateTime, formatNumber } from "../../format";
import { ExternalLinkIcon } from "../../../ui/icons";

const STATUS_LABELS = { active: "公開中", expired: "期限切れ", deleted: "削除済み", draft: "下書き" };
const AUTH_LABELS: Record<string, string> = { random: "認証なし", password: "パスワード", email_domain: "会社ドメイン", email_otp: "メール認証" };
const SEGMENT_LABELS = { registered: "登録あり", anonymous: "匿名", internal: "運営・テスト" };

function previewLink(site: OperatorSite): string | null {
  if (site.status === "deleted" || site.status === "draft") return null;
  try {
    const url = new URL(site.previewUrl);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

function SiteIdentity({ site }: { site: OperatorSite }) {
  const href = previewLink(site);
  return (
    <>
      {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="gs-ops-site-link" aria-label={`${site.title}のプレビューを新しいタブで開く`}><span>{site.title || "タイトル未設定"}</span><ExternalLinkIcon size={13} /></a> : <strong className="gs-ops-site-title">{site.title || "タイトル未設定"}</strong>}
      <span className="gs-ops-cell-sub gs-ops-mono">{site.slug}</span>
    </>
  );
}

export function OperatorSitesTable({ sites }: { sites: OperatorSite[] }) {
  return (
    <table className="gs-ops-table" role="table">
      <caption className="gs-ops-sr-only">公開ページ一覧。日時はJST。プレビューは別タブで開き、既存の認証・公開期限が適用されます。</caption>
      <thead role="rowgroup"><tr role="row"><th scope="col">ページ / URL</th><th scope="col">公開者</th><th scope="col">状態 / 認証</th><th scope="col">作成日時 / 公開期限（JST）</th><th scope="col">閲覧 / ファイル</th></tr></thead>
      <tbody role="rowgroup">
        {sites.map((site) => (
          <tr role="row" key={site.id}>
            <td role="cell" className="gs-ops-identity"><SiteIdentity site={site} /></td>
            <td role="cell" data-label="公開者"><span>{site.segment === "anonymous" ? "匿名公開" : site.segment === "internal" ? "運営・テスト" : site.ownerLabel}</span><span className="gs-ops-cell-sub">{SEGMENT_LABELS[site.segment]}</span></td>
            <td role="cell" data-label="状態 / 認証"><span className={`gs-ops-status gs-ops-status--${site.status}`}><i aria-hidden="true" />{STATUS_LABELS[site.status]}</span><span className="gs-ops-cell-sub">{AUTH_LABELS[site.authMode] ?? "その他の認証"}</span></td>
            <td role="cell" data-label="作成日時 / 公開期限（JST）"><time className="gs-ops-mono" dateTime={site.createdAt}>{formatJapanDateTime(site.createdAt)}</time><span className="gs-ops-cell-sub">{site.status === "draft" || site.status === "deleted" ? "公開対象外" : site.expiresAt ? <><time dateTime={site.expiresAt}>{formatJapanDateTime(site.expiresAt)}</time> 終了</> : "公開期限なし"}</span></td>
            <td role="cell" data-label="閲覧 / ファイル"><span className="gs-ops-mono">{formatNumber(site.views)}</span><span className="gs-ops-cell-sub">{formatNumber(site.fileCount)} ファイル · {formatBytes(site.totalBytes)}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function OperatorUsersTable({ users }: { users: OperatorUser[] }) {
  return (
    <table className="gs-ops-table gs-ops-table--users" role="table">
      <caption className="gs-ops-sr-only">ユーザー一覧。日時はJST。</caption>
      <thead role="rowgroup"><tr role="row"><th scope="col">メールアドレス / 名前</th><th scope="col">区分</th><th scope="col">登録日時（JST）</th><th scope="col">公開数</th><th scope="col">最終公開（JST）</th></tr></thead>
      <tbody role="rowgroup">
        {users.map((user) => (
          <tr role="row" key={user.id}>
            <td role="cell" className="gs-ops-identity"><strong className="gs-ops-user-email">{user.email}</strong><span className="gs-ops-cell-sub">{user.name || "名前未設定"}</span></td>
            <td role="cell" data-label="区分">{SEGMENT_LABELS[user.segment]}</td>
            <td role="cell" data-label="登録日時（JST）"><time className="gs-ops-mono" dateTime={user.createdAt}>{formatJapanDateTime(user.createdAt)}</time></td>
            <td role="cell" data-label="公開数" className="gs-ops-mono">{formatNumber(user.siteCount)}</td>
            <td role="cell" data-label="最終公開（JST）">{user.lastPublishedAt ? <time className="gs-ops-mono" dateTime={user.lastPublishedAt}>{formatJapanDateTime(user.lastPublishedAt)}</time> : <span className="gs-ops-cell-sub">未公開</span>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
