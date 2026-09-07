import type { KeyboardEvent } from "react";
import type { OperatorSummary } from "../../../../shared/operator";
import { Button } from "../../../ui/Button";
import { ArrowLeftIcon, ArrowRightIcon, LockIcon, RefreshIcon, SearchIcon } from "../../../ui/icons";
import { formatJapanDateTime, formatNumber } from "../../format";
import { OperatorActivity } from "./OperatorActivity";
import { OperatorMetrics } from "./OperatorMetrics";
import { OperatorSitesTable, OperatorUsersTable } from "./OperatorTables";
import type { OperatorLoadState, OperatorQuery, OperatorTab } from "./types";

interface OperatorDashboardProps {
  query: OperatorQuery;
  state: OperatorLoadState;
  previousSummary?: OperatorSummary;
  onQuery: (change: Partial<OperatorQuery>) => void;
  onRefresh: () => void;
}

const PERIODS = [{ value: "yesterday", label: "昨日" }, { value: "7d", label: "7日" }, { value: "30d", label: "30日" }, { value: "all", label: "全期間" }] as const;
const TABS = [{ value: "sites", label: "公開ページ" }, { value: "users", label: "ユーザー" }] as const;

export function OperatorDashboard({ query, state, previousSummary, onQuery, onRefresh }: OperatorDashboardProps) {
  const busy = state.status === "loading";
  const ready = state.status === "ready" ? state : null;
  const forbidden = state.status === "forbidden";
  const label = query.tab === "sites" ? "公開ページ" : "ユーザー";
  const page = ready?.page;
  const emptyCurrentPage = page && page.total > 0 && page.items.length === 0;
  const emptyTitle = emptyCurrentPage ? `このページには${label}がありません` : query.q.trim() ? `検索条件に一致する${label}はありません` : `この期間の${label}はありません`;
  const emptyHelp = emptyCurrentPage ? page.offset > 0 ? "前のページに戻るか、データを更新してください。" : "データを更新してください。" : query.q.trim() ? "検索語を短くするか、集計期間を変更してください。" : "期間を広げると、過去の記録を確認できます。";
  const summary = ready?.summary ?? (busy && previousSummary?.period === query.period ? previousSummary : undefined);

  function switchTab(event: KeyboardEvent<HTMLButtonElement>, tab: OperatorTab) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? "sites" : event.key === "End" ? "users" : tab === "sites" ? "users" : "sites";
    onQuery({ tab: next });
    event.currentTarget.parentElement?.querySelector<HTMLButtonElement>(`#gs-ops-tab-${next}`)?.focus();
  }

  return (
    <div className="gs-content gs-ops-content">
      <header className="gs-ops-header">
        <div><p className="gs-ops-eyebrow">SERVICE OVERVIEW</p><h1 className="gs-h1">運営ダッシュボード</h1><p className="gs-ops-intro">公開と登録の動きを、ひとつの場所で。</p></div>
        <div className="gs-ops-header-actions"><span className="gs-ops-readonly"><LockIcon size={12} />閲覧専用</span>{!forbidden ? <Button variant="outline" size="sm" disabled={busy} onClick={onRefresh} aria-label="集計データを更新"><RefreshIcon size={14} />更新</Button> : null}</div>
      </header>

      {forbidden ? <div className="gs-ops-state" role="alert"><LockIcon size={24} /><h2>運営ダッシュボードへのアクセス権がありません</h2><p>運営権限のあるアカウントでログインしてください。権限はサーバー側で管理されています。</p></div> : (
        <>
          <section className="gs-ops-filters" aria-label="集計期間">
            <div className="gs-ops-periods" role="group" aria-label="集計期間を選択">{PERIODS.map((period) => <button type="button" key={period.value} aria-pressed={query.period === period.value} onClick={() => onQuery({ period: period.value })}>{period.label}</button>)}</div>
            <div className="gs-ops-range"><p>{summary ? <>{summary.from ? formatJapanDateTime(summary.from) : "記録開始"} 〜 {formatJapanDateTime(summary.to)} <strong>JST</strong></> : "期間は日本標準時（JST）で集計"}</p><span>{summary ? `更新 ${formatJapanDateTime(summary.generatedAt)} JST · 終了時刻未満` : "データ取得後に対象日時を表示します"}</span></div>
          </section>

          <div aria-busy={busy}>
            {busy && !summary ? <div className="gs-ops-state gs-ops-loading" role="status"><span className="gs-ops-loader" aria-hidden="true" /><h2>集計データを読み込み中</h2><p>登録・公開・閲覧の記録を取得しています。</p></div> : null}
            {state.status === "error" ? <div className="gs-ops-state" role="alert"><h2>集計データを取得できませんでした</h2><p>{state.message}</p><Button variant="outline" onClick={onRefresh}><RefreshIcon size={14} />再試行</Button></div> : null}
            {summary ? <><OperatorMetrics summary={summary} /><OperatorActivity summary={summary} /></> : null}
          </div>

          <section className="gs-ops-directory" aria-label="運営データ一覧">
            <div className="gs-ops-directory-head">
              <div className="gs-ops-tabs" role="tablist" aria-label="表示するデータ">{TABS.map((tab) => <button type="button" role="tab" id={`gs-ops-tab-${tab.value}`} key={tab.value} aria-controls="gs-ops-panel" aria-selected={query.tab === tab.value} tabIndex={query.tab === tab.value ? 0 : -1} onClick={() => onQuery({ tab: tab.value })} onKeyDown={(event) => switchTab(event, tab.value)}>{tab.label}</button>)}</div>
              <label className="gs-ops-search"><SearchIcon size={15} /><span className="gs-ops-sr-only">{label}を検索</span><input type="search" aria-label={`${label}を検索`} maxLength={200} value={query.q} onChange={(event) => onQuery({ q: event.target.value })} placeholder={query.tab === "sites" ? "タイトル・URLを検索" : "名前・メールアドレスを検索"} /></label>
            </div>
            <div id="gs-ops-panel" role="tabpanel" aria-labelledby={`gs-ops-tab-${query.tab}`} tabIndex={0} aria-busy={busy}>
              <div className="gs-ops-list-meta"><span>{page ? `${formatNumber(page.total)} 件` : "— 件"}</span><span>{query.tab === "sites" ? "作成日で絞り込み · 閲覧数は累計" : "登録日で絞り込み · 公開数は累計"}</span></div>
              {ready && ready.tab === query.tab ? ready.page.items.length > 0 ? ready.tab === "sites" ? <OperatorSitesTable sites={ready.page.items} /> : <OperatorUsersTable users={ready.page.items} /> : <div className="gs-ops-empty"><h3>{emptyTitle}</h3><p>{emptyHelp}</p></div> : <div className="gs-ops-empty">{busy ? "一覧を読み込み中…" : "データ取得後に一覧を表示します。"}</div>}
              <nav className="gs-ops-pagination" aria-label={`${label}一覧のページ切り替え`}>
                <span aria-live="polite">{page ? page.total > 0 ? `${page.items.length > 0 ? `${formatNumber(page.offset + 1)}–${formatNumber(page.offset + page.items.length)}` : "0"} / ${formatNumber(page.total)} 件` : "0 件" : "—"}</span>
                <div><Button variant="outline" size="sm" disabled={!page || busy || page.offset === 0} onClick={() => onQuery({ offset: Math.max(0, query.offset - query.limit) })}><ArrowLeftIcon size={13} />前の25件</Button><Button variant="outline" size="sm" disabled={!page || busy || !page.hasMore} onClick={() => onQuery({ offset: query.offset + query.limit })}>次の25件<ArrowRightIcon size={13} /></Button></div>
              </nav>
            </div>
          </section>
          <footer className="gs-ops-notes"><p>指標・日別グラフでは運営・テスト用アカウントは集計から除外（サーバー設定に基づく）。一覧には運営・テスト用の記録も区分付きで表示します。</p><p>匿名公開数は人数ではありません。閲覧は本人・ボットを含む可能性があります。</p><p>公開ページは別タブで表示します。既存の認証・公開期限はそのまま適用されます。</p></footer>
        </>
      )}
    </div>
  );
}
