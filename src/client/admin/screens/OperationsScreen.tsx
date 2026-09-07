import { useEffect, useState } from "react";
import type { OperatorSummary } from "../../../shared/operator";
import type { AppUser } from "../api";
import { OperatorDashboard } from "./operations/OperatorDashboard";
import { DEFAULT_OPERATOR_QUERY, startOperatorLoad, updateOperatorQuery } from "./operations/operator-data";
import type { OperatorLoadState, OperatorQuery } from "./operations/types";

function AuthorizedOperations() {
  const [query, setQuery] = useState(DEFAULT_OPERATOR_QUERY);
  const [refresh, setRefresh] = useState(0);
  const [previousSummary, setPreviousSummary] = useState<OperatorSummary>();
  const [loaded, setLoaded] = useState<{ query: OperatorQuery; refresh: number; state: OperatorLoadState }>({ query, refresh, state: { status: "loading" } });

  useEffect(() => {
    const task = startOperatorLoad(query, true, (state) => {
      setLoaded({ query, refresh, state });
      if (state.status === "ready") setPreviousSummary(state.summary);
      if (state.status === "forbidden" || state.status === "error") setPreviousSummary(undefined);
    });
    return task.cancel;
  }, [query, refresh]);

  const state = loaded.query === query && loaded.refresh === refresh ? loaded.state : { status: "loading" as const };
  return <OperatorDashboard query={query} state={state} previousSummary={previousSummary?.period === query.period ? previousSummary : undefined} onQuery={(change) => setQuery((current) => updateOperatorQuery(current, change))} onRefresh={() => setRefresh((current) => current + 1)} />;
}

export function OperationsScreen({ user }: { user: AppUser }) {
  if (user.isOperator !== true) return <OperatorDashboard query={DEFAULT_OPERATOR_QUERY} state={{ status: "forbidden" }} onQuery={() => undefined} onRefresh={() => undefined} />;
  return <AuthorizedOperations key={user.id} />;
}
