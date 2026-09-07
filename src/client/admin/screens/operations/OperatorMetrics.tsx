import type { OperatorSummary } from "../../../../shared/operator";
import { formatNumber } from "../../format";

export function OperatorMetrics({ summary }: { summary: OperatorSummary }) {
  const m = summary.metrics;
  const metrics = [
    { label: "登録ユーザー", value: m.registeredUsers, scope: "累計", note: "登録済みアカウントの総数" },
    { label: "新規登録", value: m.newUsers, scope: "選択期間", note: "期間内に登録したユーザー" },
    { label: "公開ページ数", value: m.publishedSites, scope: "選択期間", note: `登録あり ${formatNumber(m.registeredSites)} / 匿名 ${formatNumber(m.anonymousSites)}` },
    { label: "閲覧数", value: m.previewViews, scope: "選択期間", note: "プレビューへのアクセス" },
    { label: "現在公開中", value: m.liveSites, scope: "現在", note: "期限切れ・削除・下書きを除く" },
    { label: "有料契約", value: m.paidSubscriptions, scope: "現在", note: "本番・active の契約のみ（試用を除く）" }
  ];
  return (
    <section className="gs-ops-overview" aria-label="運営指標">
      <dl className="gs-ops-metrics">
        {metrics.map((metric) => (
          <div className="gs-ops-metric" key={metric.label}>
            <dt><span>{metric.label}</span><span className="gs-ops-scope">{metric.scope}</span></dt>
            <dd>{formatNumber(metric.value)}</dd>
            <p>{metric.note}</p>
          </div>
        ))}
      </dl>
      <div className="gs-ops-creators">
        <span className="gs-ops-scope">選択期間</span>
        <span>公開したユーザー <strong>{formatNumber(m.activeCreators)}</strong> 人</span>
        <span>リピート公開者 <strong>{formatNumber(m.returningCreators)}</strong> 人</span>
        <span className="gs-ops-caption">登録ユーザーのみ・リピートは期間内の別々の2日以上で公開（差し替えを含む）</span>
      </div>
    </section>
  );
}
