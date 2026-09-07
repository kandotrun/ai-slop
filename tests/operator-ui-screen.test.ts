import { existsSync } from "node:fs";
import { Children, createElement, isValidElement, type ComponentProps, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { OperatorPage, OperatorSite, OperatorSummary, OperatorUser } from "../src/shared/operator";

const summary: OperatorSummary = {
  period: "30d", from: "2026-08-08T15:00:00.000Z", to: "2026-09-07T03:00:00.000Z",
  timezone: "Asia/Tokyo", generatedAt: "2026-09-07T03:00:00.000Z",
  metrics: { registeredUsers: 1200, newUsers: 82, publishedSites: 156, anonymousSites: 96, registeredSites: 60, activeCreators: 40, previewViews: 2450, liveSites: 94, paidSubscriptions: 8, returningCreators: 12 },
  daily: [{ date: "2026-09-06", newUsers: 3, sites: 7, views: 45 }, { date: "2026-09-07", newUsers: 2, sites: 4, views: 12 }]
};
const site: OperatorSite = {
  id: "sample-site", title: "Sample <script>alert(1)</script>", slug: "sample-page", previewUrl: "https://sample.preview.example.com/?q=one&v=two",
  ownerLabel: "s***@example.com", segment: "registered", authMode: "random", status: "active",
  createdAt: "2026-09-06T01:23:00.000Z", expiresAt: "2026-09-13T01:23:00.000Z", views: 1234, fileCount: 3, totalBytes: 2048
};
const user: OperatorUser = {
  id: "sample-user", email: "sample@example.com", name: "Sample <Admin>", segment: "registered", createdAt: "2026-09-06T01:23:00.000Z",
  siteCount: 3, lastPublishedAt: "2026-09-07T02:00:00.000Z"
};
function page<T>(items: T[]): OperatorPage<T> { return { items, total: items.length, offset: 0, limit: 25, hasMore: false }; }

async function view(overrides: Partial<ComponentProps<typeof import("../src/client/admin/screens/operations/OperatorDashboard").OperatorDashboard>> = {}) {
  expect(existsSync(new URL("../src/client/admin/screens/operations/OperatorDashboard.tsx", import.meta.url))).toBe(true);
  const { OperatorDashboard } = await import("../src/client/admin/screens/operations/OperatorDashboard");
  return renderToStaticMarkup(createElement(OperatorDashboard, {
    query: { period: "30d", tab: "sites", q: "", offset: 0, limit: 25 },
    state: { status: "ready", summary, tab: "sites", page: page([site]) },
    onQuery: () => undefined, onRefresh: () => undefined, ...overrides
  }));
}

describe("operator read-only dashboard", () => {
  it("spec: renders real KPI values, distinct time scopes, breakdowns and explicit JST range", async () => {
    const html = await view();
    for (const text of ["運営ダッシュボード", "閲覧専用", "登録ユーザー", "累計", "1,200", "新規登録", "82", "公開ページ数", "156", "登録あり", "96", "匿名", "60", "公開したユーザー", "40", "リピート公開者", "12", "期間内の別々の2日以上で公開", "本番・active", "現在公開中", "94", "有料契約", "8", "active", "2,450", "2026/09/07 12:00", "JST", "2026/08/09 00:00"]) expect(html).toContain(text);
    for (const text of ["昨日", "7日", "30日", "全期間", "運営・テスト用アカウントは集計から除外", "匿名公開数は人数ではありません", "閲覧は本人・ボットを含む可能性"]) expect(html).toContain(text);
    expect(html).not.toMatch(/準備中|Coming soon|placeholder chart/);
    expect(html).not.toMatch(/削除する|停止する|代理ログイン|支払う|<iframe|<script/);
  });

  it("spec: gives daily series independent labeled scales and accessible exact values", async () => {
    const html = await view();
    expect(html).toContain("日別の動き");
    expect(html).toContain("各グラフは独立した目盛り");
    expect(html).toContain("上限 7");
    expect(html).toContain("上限 3");
    expect(html).toContain("上限 45");
    expect(html).toContain("日別の数値を見る");
    expect(html).toContain("2026-09-06");
    const all = await view({ state: { status: "ready", summary: { ...summary, period: "all", from: null }, tab: "sites", page: page([]) }, query: { period: "all", tab: "sites", q: "", offset: 0, limit: 25 } });
    expect(all).toContain("日別グラフは直近90日まで");
  });

  it("spec: lists site status, masked owner, safe external preview and exact JST lifecycle times", async () => {
    const html = await view();
    for (const text of ["公開ページ", "ユーザー", "Sample &lt;script&gt;alert(1)&lt;/script&gt;", "sample-page", "s***@example.com", "認証なし", "公開中", "2026/09/06 10:23", "2026/09/13 10:23", "1,234", "2.0 KB", "3 ファイル"]) expect(html).toContain(text);
    expect(html).toContain('href="https://sample.preview.example.com/?q=one&amp;v=two"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('aria-label="公開ページを検索"');
    expect(html).toContain("前の25件");
    expect(html).toContain("次の25件");
  });

  it("spec: does not render an HTTP preview URL as a clickable link", async () => {
    const html = await view({ state: { status: "ready", summary, tab: "sites", page: page([{ ...site, previewUrl: "http://sample.preview.example.com/", title: "HTTP preview" }]) } });
    expect(html).toContain("HTTP preview");
    expect(html).not.toMatch(/<a\b/);
  });

  it("spec: does not turn untrusted URLs or deleted/draft pages into active preview links", async () => {
    const rows = [
      { ...site, id: "invalid-url", previewUrl: "javascript:alert(1)", title: "Invalid URL", status: "active" as const },
      { ...site, id: "expired", title: "Expired sample", status: "expired" as const, segment: "anonymous" as const, ownerLabel: "匿名", authMode: "password" },
      { ...site, id: "deleted", title: "Deleted sample", status: "deleted" as const },
      { ...site, id: "draft", title: "Draft sample", status: "draft" as const, authMode: "email_otp" }
    ];
    const html = await view({ state: { status: "ready", summary, tab: "sites", page: page(rows) } });
    expect(html).not.toContain("javascript:");
    expect(html).toContain("期限切れ");
    expect(html).toContain("削除済み");
    expect(html).toContain("下書き");
    expect(html).toContain("パスワード");
    expect(html).toContain("メール認証");
    expect(html.match(/target="_blank"/g)?.length).toBe(1);
  });

  it("spec: renders substantive user records without HTML execution or mutation controls", async () => {
    const html = await view({ query: { period: "30d", tab: "users", q: "sample", offset: 0, limit: 25 }, state: { status: "ready", summary, tab: "users", page: page([user, { ...user, id: "no-sites", email: "new@example.com", name: "", siteCount: 0, lastPublishedAt: null }]) } });
    for (const text of ["メールアドレス", "登録日時", "公開数", "最終公開", "sample@example.com", "Sample &lt;Admin&gt;", "2026/09/07 11:00", "未公開", "名前未設定", 'aria-label="ユーザーを検索"']) expect(html).toContain(text);
    expect(html).not.toContain("<Admin>");
    expect(html).not.toContain("mailto:");
  });

  it("spec: explains KPI exclusions while labeling internal and anonymous directory rows in Japanese", async () => {
    const html = await view({ state: { status: "ready", summary, tab: "sites", page: page([{ ...site, segment: "internal", ownerLabel: "internal" }, { ...site, id: "anonymous-sample", segment: "anonymous", ownerLabel: "anonymous" }]) } });
    expect(html).toContain("指標・日別グラフでは運営・テスト用アカウントは集計から除外");
    expect(html).toContain("一覧には運営・テスト用の記録も区分付きで表示");
    expect(html).toContain("匿名公開");
    expect(html).toContain("運営・テスト");
    expect(html).not.toContain(">anonymous<");
    expect(html).not.toContain(">internal<");
  });

  it("spec: keeps same-period summary in place during directory refresh without stale rows", async () => {
    const html = await view({ state: { status: "loading" }, previousSummary: summary });
    expect(html).toContain("1,200");
    expect(html).toContain("日別の動き");
    expect(html).toContain("一覧を読み込み中");
    expect(html).not.toContain("sample-page");
    const denied = await view({ state: { status: "forbidden" }, previousSummary: summary });
    expect(denied).not.toContain("1,200");
  });

  describe.each(["sites", "users"] as const)("%s pagination", (tab) => {
    const label = tab === "sites" ? "公開ページ" : "ユーザー";

    it.each([0, 25, 50])("spec: identifies an empty current page at offset %i without claiming the dataset is empty", async (offset) => {
      for (const q of ["", "sample"]) {
        const emptyPage = { items: [], offset, total: 25, limit: 25, hasMore: false };
        const html = await view({ query: { period: "30d", tab, q, offset, limit: 25 }, state: { status: "ready", summary, tab, page: emptyPage } });
        expect(html).toContain(`このページには${label}がありません`);
        expect(html).not.toContain(`この期間の${label}はありません`);
        expect(html).not.toContain(`検索条件に一致する${label}はありません`);
        expect(html).toContain("0 / 25 件");
        expect(html).not.toMatch(/\d+–\d+ \/ 25 件/);
        const previous = html.match(/<button\b[^>]*>(?:(?!<\/button>)[\s\S])*前の25件<\/button>/)?.[0];
        expect(previous).toBeDefined();
        expect(previous?.includes('disabled=""')).toBe(offset === 0);
        expect(html).toContain(offset > 0 ? "前のページに戻るか、データを更新してください。" : "データを更新してください。");
      }
    });

    it.each([0, 25])("spec: keeps true-zero copy at offset %i", async (offset) => {
      const html = await view({ query: { period: "30d", tab, q: "", offset, limit: 25 }, state: { status: "ready", summary, tab, page: { items: [], total: 0, offset, limit: 25, hasMore: false } } });
      expect(html).toContain(`この期間の${label}はありません`);
      expect(html).toContain('aria-live="polite">0 件');
      expect(html).not.toContain(`このページには${label}がありません`);
    });

    it.each([0, 25])("spec: preserves the occupied page range at offset %i", async (offset) => {
      const pagination = { total: 26, offset, limit: 25, hasMore: offset === 0 };
      const count = offset === 0 ? 25 : 1;
      const state = tab === "sites"
        ? { status: "ready" as const, summary, tab, page: { ...pagination, items: Array.from({ length: count }, (_, index) => ({ ...site, id: `site-${index}` })) } }
        : { status: "ready" as const, summary, tab, page: { ...pagination, items: Array.from({ length: count }, (_, index) => ({ ...user, id: `user-${index}` })) } };
      const html = await view({ query: { period: "30d", tab, q: "", offset, limit: 25 }, state });
      expect(html).toContain(`${offset + 1}–${offset + count} / 26 件`);
      expect(html).not.toContain(`このページには${label}がありません`);
    });

    it.each([25, 50])("spec: previous navigation recovers from an empty page at offset %i only on click", async (offset) => {
      const { OperatorDashboard } = await import("../src/client/admin/screens/operations/OperatorDashboard");
      const changes: unknown[] = [];
      const tree = OperatorDashboard({ query: { period: "30d", tab, q: "", offset, limit: 25 }, state: { status: "ready", summary, tab, page: { items: [], total: 25, offset, limit: 25, hasMore: false } }, onQuery: (change) => changes.push(change), onRefresh: () => undefined });
      expect(changes).toEqual([]);
      let clicks = 0;
      function clickPrevious(node: ReactNode) {
        Children.forEach(node, (child) => {
          if (!isValidElement<{ children?: ReactNode; disabled?: boolean; onClick?: () => void }>(child)) return;
          if (Children.toArray(child.props.children).includes("前の25件")) {
            expect(child.props.disabled).toBe(false);
            child.props.onClick?.();
            clicks += 1;
          } else clickPrevious(child.props.children);
        });
      }
      clickPrevious(tree);
      expect(clicks).toBe(1);
      expect(changes).toEqual([{ offset: offset - 25 }]);
    });
  });

  it("spec: distinguishes loading, true zero, empty search, recoverable failure and forbidden", async () => {
    const loading = await view({ state: { status: "loading" } });
    expect(loading).toContain("集計データを読み込み中");
    expect(loading).toContain('aria-busy="true"');
    expect(loading).not.toContain("1,200");
    const empty = await view({ state: { status: "ready", summary: { ...summary, daily: [], metrics: { registeredUsers: 0, newUsers: 0, publishedSites: 0, anonymousSites: 0, registeredSites: 0, activeCreators: 0, previewViews: 0, liveSites: 0, paidSubscriptions: 0, returningCreators: 0 } }, tab: "sites", page: page([]) } });
    expect(empty).toContain("この期間の公開ページはありません");
    expect(empty).toContain("日別データはありません");
    expect(empty).toContain("0 件");
    const search = await view({ query: { period: "30d", tab: "users", q: "nothing", offset: 0, limit: 25 }, state: { status: "ready", summary, tab: "users", page: page([]) } });
    expect(search).toContain("検索条件に一致するユーザーはありません");
    const error = await view({ state: { status: "error", message: "サーバーに接続できませんでした" } });
    expect(error).toContain('role="alert"');
    expect(error).toContain("再試行");
    expect(error).not.toContain("1,200");
    const denied = await view({ state: { status: "forbidden" } });
    expect(denied).toContain("運営ダッシュボードへのアクセス権がありません");
    expect(denied).not.toContain("登録ユーザー");
    expect(denied).not.toContain("再試行");
    expect(denied).not.toContain('type="search"');
  });
});
