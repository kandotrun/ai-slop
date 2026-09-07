import type { OperatorPeriod, OperatorSummary } from "../shared/operator";

const DAY_MS = 86_400_000;
const JST_MS = 9 * 60 * 60 * 1000;

export interface OperatorWindow {
  period: OperatorPeriod;
  from: string | null;
  to: string;
  generatedAt: string;
  dailyFrom: string;
  daily: OperatorSummary["daily"];
}

export interface OperatorListQuery {
  offset: number;
  limit: number;
  pattern: string;
}

export function operatorWindow(params: URLSearchParams, now = new Date()): OperatorWindow | null {
  if (params.getAll("period").length > 1) return null;
  const period = params.get("period") ?? "30d";
  if (period !== "yesterday" && period !== "7d" && period !== "30d" && period !== "all") return null;
  const timestamp = now.getTime();
  const midnight = Math.floor((timestamp + JST_MS) / DAY_MS) * DAY_MS - JST_MS;
  const end = period === "yesterday" ? midnight : timestamp;
  const start = period === "all" ? null : period === "yesterday" ? midnight - DAY_MS : timestamp - (period === "7d" ? 7 : 30) * DAY_MS;
  const chartStart = start === null ? midnight - 89 * DAY_MS : Math.floor((start + JST_MS) / DAY_MS) * DAY_MS - JST_MS;
  const daily: OperatorSummary["daily"] = [];
  for (let day = chartStart; day < end; day += DAY_MS) {
    daily.push({ date: new Date(day + JST_MS).toISOString().slice(0, 10), newUsers: 0, sites: 0, views: 0 });
  }
  return {
    period,
    from: start === null ? null : new Date(start).toISOString(),
    to: new Date(end).toISOString(),
    generatedAt: now.toISOString(),
    dailyFrom: new Date(Math.max(start ?? chartStart, chartStart)).toISOString(),
    daily
  };
}

function boundedInteger(value: string | null, fallback: number, min: number, max: number): number | null {
  if (value === null) return fallback;
  if (!/^(0|[1-9]\d*)$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

export function operatorListQuery(params: URLSearchParams): OperatorListQuery | null {
  if (["limit", "offset", "q"].some((key) => params.getAll(key).length > 1)) return null;
  const limit = boundedInteger(params.get("limit"), 25, 1, 100);
  const offset = boundedInteger(params.get("offset"), 0, 0, 1_000_000);
  const query = params.get("q") ?? "";
  if (limit === null || offset === null || query.length > 200 || query.includes("\0")) return null;
  const pattern = `%${query.trim().replace(/[\\%_]/g, (char) => `\\${char}`)}%`;
  return { limit, offset, pattern };
}
