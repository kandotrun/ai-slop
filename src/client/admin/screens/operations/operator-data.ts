import { api, ApiClientError } from "../../api";
import { errorMessageJa } from "../../errors";
import type { OperatorLoadState, OperatorQuery } from "./types";

export const DEFAULT_OPERATOR_QUERY: OperatorQuery = { period: "30d", tab: "sites", q: "", offset: 0, limit: 25 };

export function updateOperatorQuery(current: OperatorQuery, change: Partial<OperatorQuery>): OperatorQuery {
  const tabChanged = change.tab !== undefined && change.tab !== current.tab;
  const filterChanged = tabChanged || (change.period !== undefined && change.period !== current.period) || (change.q !== undefined && change.q !== current.q);
  return { ...current, ...change, q: tabChanged ? "" : change.q ?? current.q, offset: filterChanged ? 0 : Math.max(0, change.offset ?? current.offset), limit: 25 };
}

export function startOperatorLoad(query: OperatorQuery, isOperator: boolean, receive: (state: OperatorLoadState) => void): { cancel: () => void; done: Promise<void> } {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  if (isOperator !== true) {
    receive({ status: "forbidden" });
    return { cancel, done: Promise.resolve() };
  }
  receive({ status: "loading" });
  const done = (async () => {
    try {
      const summaryRequest = api.opsSummary(query.period, controller.signal);
      const pageRequest = query.tab === "sites"
        ? api.opsSites(query, controller.signal).then((page) => ({ tab: "sites" as const, page }))
        : api.opsUsers(query, controller.signal).then((page) => ({ tab: "users" as const, page }));
      const [summary, directory] = await Promise.all([summaryRequest, pageRequest]);
      if (!controller.signal.aborted) receive({ status: "ready", summary, ...directory });
    } catch (error) {
      if (controller.signal.aborted) return;
      if (error instanceof ApiClientError && (error.status === 401 || error.status === 403)) {
        receive({ status: "forbidden" });
      } else {
        receive({ status: "error", message: errorMessageJa(error instanceof ApiClientError ? `request_failed_${error.status}` : "operator_connection_failed") });
      }
    }
  })();
  return { cancel, done };
}
