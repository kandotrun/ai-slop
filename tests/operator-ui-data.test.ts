import { existsSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { OperatorLoadState } from "../src/client/admin/screens/operations/types";

afterEach(() => vi.unstubAllGlobals());

async function dataModule() {
  expect(existsSync(new URL("../src/client/admin/screens/operations/operator-data.ts", import.meta.url))).toBe(true);
  return import("../src/client/admin/screens/operations/operator-data");
}

const sampleSummary = { period: "30d", generatedAt: "2026-09-07T03:00:00.000Z" };
const samplePage = { items: [], total: 0, offset: 0, limit: 25, hasMore: false };

describe("operator data lifecycle", () => {
  it("spec: defaults to 30 days and resets pagination when period, query or tab changes", async () => {
    const { DEFAULT_OPERATOR_QUERY, updateOperatorQuery } = await dataModule();
    expect(DEFAULT_OPERATOR_QUERY).toEqual({ period: "30d", tab: "sites", q: "", offset: 0, limit: 25 });
    const current = { ...DEFAULT_OPERATOR_QUERY, offset: 50, q: "sample" };
    expect(updateOperatorQuery(current, { period: "7d" })).toMatchObject({ offset: 0, period: "7d", q: "sample" });
    expect(updateOperatorQuery(current, { q: "other" })).toMatchObject({ offset: 0, q: "other" });
    expect(updateOperatorQuery(current, { tab: "users" })).toMatchObject({ offset: 0, tab: "users", q: "" });
    expect(updateOperatorQuery(current, { offset: 25 })).toMatchObject({ offset: 25, q: "sample" });
    expect(updateOperatorQuery(current, { offset: -25 })).toMatchObject({ offset: 0 });
    expect(updateOperatorQuery(current, { period: "30d" })).toMatchObject({ offset: 50 });
  });

  it("spec: does not issue an ops request without explicit permission", async () => {
    const { DEFAULT_OPERATOR_QUERY, startOperatorLoad } = await dataModule();
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    const receive = vi.fn();
    await startOperatorLoad(DEFAULT_OPERATOR_QUERY, false, receive).done;
    expect(fetcher).not.toHaveBeenCalled();
    expect(receive).toHaveBeenCalledExactlyOnceWith({ status: "forbidden" });
  });

  it("spec: fetches summary and only the selected directory with bounded pagination", async () => {
    const { DEFAULT_OPERATOR_QUERY, startOperatorLoad } = await dataModule();
    const fetcher = vi.fn((path: string) => Promise.resolve(new Response(JSON.stringify(path.includes("summary") ? sampleSummary : samplePage))));
    vi.stubGlobal("fetch", fetcher);
    const states: OperatorLoadState[] = [];
    await startOperatorLoad({ ...DEFAULT_OPERATOR_QUERY, tab: "users", q: "sample", offset: 25 }, true, (state) => states.push(state)).done;
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls.map(([path]) => path)).toEqual(["/api/ops/summary?period=30d", "/api/ops/users?period=30d&q=sample&offset=25&limit=25"]);
    expect(states).toEqual([{ status: "loading" }, { status: "ready", summary: sampleSummary, tab: "users", page: samplePage }]);
  });

  it.each([401, 403])("spec: clears all displayed data when the server denies access (%i)", async (status) => {
    const { DEFAULT_OPERATOR_QUERY, startOperatorLoad } = await dataModule();
    vi.stubGlobal("fetch", vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ error: "operator_forbidden", secret: "never-display" }), { status }))));
    const receive = vi.fn();
    await startOperatorLoad(DEFAULT_OPERATOR_QUERY, true, receive).done;
    expect(receive.mock.calls).toEqual([[{ status: "loading" }], [{ status: "forbidden" }]]);
  });

  it("spec: ignores canceled stale success and stale failure after a newer filter completes", async () => {
    const { DEFAULT_OPERATOR_QUERY, startOperatorLoad } = await dataModule();
    const pending: { resolve: (value: Response) => void; reject: (error: Error) => void; signal: AbortSignal | undefined | null }[] = [];
    vi.stubGlobal("fetch", vi.fn((_path: string, init?: RequestInit) => new Promise<Response>((resolve, reject) => pending.push({ resolve, reject, signal: init?.signal }))));
    const receive = vi.fn();
    const old = startOperatorLoad(DEFAULT_OPERATOR_QUERY, true, receive);
    old.cancel();
    const latest = startOperatorLoad({ ...DEFAULT_OPERATOR_QUERY, period: "7d" }, true, receive);
    expect(pending[0].signal?.aborted).toBe(true);
    expect(pending[1].signal?.aborted).toBe(true);
    pending[2].resolve(new Response(JSON.stringify({ ...sampleSummary, period: "7d" })));
    pending[3].resolve(new Response(JSON.stringify(samplePage)));
    await latest.done;
    pending[0].resolve(new Response(JSON.stringify(sampleSummary)));
    pending[1].resolve(new Response(JSON.stringify(samplePage)));
    await old.done;
    expect(receive.mock.calls.filter(([state]) => state.status === "ready")).toHaveLength(1);
    expect(receive).toHaveBeenLastCalledWith(expect.objectContaining({ summary: expect.objectContaining({ period: "7d" }) }));
    const canceled = startOperatorLoad(DEFAULT_OPERATOR_QUERY, true, receive);
    canceled.cancel();
    const before = receive.mock.calls.length;
    pending[4].reject(new Error("stale request error"));
    pending[5].reject(new Error("stale request error"));
    await canceled.done;
    expect(receive.mock.calls).toHaveLength(before);
  });

  it("spec: reports a recoverable read error without leaking raw backend details", async () => {
    const { DEFAULT_OPERATOR_QUERY, startOperatorLoad } = await dataModule();
    vi.stubGlobal("fetch", vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ error: "private-database-error" }), { status: 500 }))));
    const receive = vi.fn();
    await startOperatorLoad(DEFAULT_OPERATOR_QUERY, true, receive).done;
    expect(receive).toHaveBeenLastCalledWith({ status: "error", message: expect.stringContaining("500") });
    expect(JSON.stringify(receive.mock.calls)).not.toContain("private-database-error");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("private-host")));
    await startOperatorLoad(DEFAULT_OPERATOR_QUERY, true, receive).done;
    expect(receive).toHaveBeenLastCalledWith({ status: "error", message: "サーバーに接続できませんでした。接続状態を確認し、再試行してください。" });
  });
});

describe("operator shell integration", () => {
  it("spec: renders forbidden for direct nonoperator entry and loading for an operator", async () => {
    expect(existsSync(new URL("../src/client/admin/screens/OperationsScreen.tsx", import.meta.url))).toBe(true);
    const { OperationsScreen } = await import("../src/client/admin/screens/OperationsScreen");
    const user = { id: "sample-operator", email: "operator@example.com", name: "Sample" };
    const forbidden = renderToStaticMarkup(createElement(OperationsScreen, { user }));
    expect(forbidden).toContain("アクセス権がありません");
    expect(forbidden).not.toContain("登録ユーザー");
    expect(renderToStaticMarkup(createElement(OperationsScreen, { user: { ...user, isOperator: true } }))).toContain("集計データを読み込み中");
  });

  it("spec: connects the existing authenticated shell to the operations screen and read-only topbar", () => {
    const app = readFileSync(new URL("../src/client/admin/AdminApp.tsx", import.meta.url), "utf8");
    expect(app).toContain('<OperationsScreen user={authUser}');
    expect(app).toContain('showUpload={screen !== "operations"}');
    expect(app).toContain('if (next === "operations") navigateTo({ screen: "operations" })');
    expect(app).toContain('operations: "運営ダッシュボード"');
  });

  it("spec: scopes responsive operator styles, keeps charts shrinkable and labels stacked table cells", () => {
    const css = readFileSync(new URL("../src/client/styles/app.css", import.meta.url), "utf8");
    expect(css).toContain(".forge .gs-ops-content");
    expect(css).toMatch(/\.forge \.gs-ops-charts\s*\{[^}]*minmax\(0, 1fr\)/s);
    expect(css).toContain(".forge .gs-ops-table td[data-label]::before");
    expect(css).toContain(".forge .gs-ops-table .gs-ops-identity");
    expect(css).toContain(".forge .gs-ops-content :focus-visible");
  });
});
