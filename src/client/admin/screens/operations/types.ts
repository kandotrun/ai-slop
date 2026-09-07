import type { OperatorPage, OperatorPeriod, OperatorSite, OperatorSummary, OperatorUser } from "../../../../shared/operator";

export type OperatorTab = "sites" | "users";
export interface OperatorQuery {
  period: OperatorPeriod;
  tab: OperatorTab;
  q: string;
  offset: number;
  limit: number;
}
export type OperatorReadyState = { status: "ready"; summary: OperatorSummary } & (
  | { tab: "sites"; page: OperatorPage<OperatorSite> }
  | { tab: "users"; page: OperatorPage<OperatorUser> }
);
export type OperatorLoadState =
  | { status: "loading" }
  | { status: "forbidden" }
  | { status: "error"; message: string }
  | OperatorReadyState;
