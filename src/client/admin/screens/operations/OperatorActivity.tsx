import type { OperatorSummary } from "../../../../shared/operator";
import { formatNumber } from "../../format";

const SERIES = [
  { key: "sites", label: "公開ページ", unit: "件" },
  { key: "newUsers", label: "新規登録", unit: "人" },
  { key: "views", label: "閲覧", unit: "回" }
] as const;

export function OperatorActivity({ summary }: { summary: OperatorSummary }) {
  const daily = summary.daily.slice(-90);
  return (
    <section className="gs-ops-activity" aria-labelledby="gs-ops-activity-heading">
      <div className="gs-ops-section-head">
        <h2 id="gs-ops-activity-heading">日別の動き</h2>
        <p>各グラフは独立した目盛り · JST{summary.period === "all" ? " · 日別グラフは直近90日まで" : ""}</p>
      </div>
      {daily.length === 0 ? <p className="gs-ops-empty">日別データはありません</p> : (
        <>
          <div className="gs-ops-charts">
            {SERIES.map((series) => {
              const max = Math.max(1, ...daily.map((day) => day[series.key]));
              return (
                <figure className={`gs-ops-chart gs-ops-chart--${series.key}`} key={series.key}>
                  <figcaption><span><i aria-hidden="true" />{series.label}</span><span>上限 {formatNumber(max)} {series.unit}</span></figcaption>
                  <div className="gs-ops-bars" role="img" aria-label={`${series.label}の日別グラフ。目盛りは0から${formatNumber(max)}${series.unit}。正確な値は日別の数値をご確認ください。`}>
                    {daily.map((day) => <span key={day.date} style={{ height: `${day[series.key] / max * 100}%` }} title={`${day.date}：${formatNumber(day[series.key])}${series.unit}`} />)}
                  </div>
                  <div className="gs-ops-chart-axis"><span>{daily[0].date.slice(5).replace("-", "/")}</span><span>{daily.at(-1)?.date.slice(5).replace("-", "/")}</span></div>
                </figure>
              );
            })}
          </div>
          <details className="gs-ops-daily-details">
            <summary>日別の数値を見る</summary>
            <div className="gs-ops-daily-scroll" tabIndex={0} role="region" aria-label="日別集計の数値">
              <table><caption className="gs-ops-sr-only">日別集計（JST）</caption><thead><tr><th scope="col">日付（JST）</th><th scope="col">公開ページ</th><th scope="col">新規登録</th><th scope="col">閲覧</th></tr></thead>
                <tbody>{daily.map((day) => <tr key={day.date}><th scope="row">{day.date}</th><td>{formatNumber(day.sites)}</td><td>{formatNumber(day.newUsers)}</td><td>{formatNumber(day.views)}</td></tr>)}</tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </section>
  );
}
