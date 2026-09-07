import { Hono } from "hono";
import { operatorSites, operatorSummary, operatorUsers } from "./operator-data";
import { operatorListQuery, operatorWindow } from "./operator-query";

export function createOperatorRouter() {
  const router = new Hono<{ Bindings: Env }>();
  router.onError((_error, c) => c.json({ error: "operator_data_unavailable" }, 500));
  router.use("*", async (c, next) => {
    if (c.req.method !== "GET" && c.req.method !== "HEAD") {
      c.header("Allow", "GET, HEAD");
      return c.json({ error: "method_not_allowed" }, 405);
    }
    await next();
  });
  router.get("/summary", async (c) => {
    const window = operatorWindow(new URL(c.req.url).searchParams);
    if (!window) return c.json({ error: "invalid_operator_query" }, 400);
    return c.json(await operatorSummary(c.env, window));
  });
  for (const resource of ["sites", "users"] as const) {
    router.get(`/${resource}`, async (c) => {
      const params = new URL(c.req.url).searchParams;
      const window = operatorWindow(params);
      const query = operatorListQuery(params);
      if (!window || !query) return c.json({ error: "invalid_operator_query" }, 400);
      return c.json(await (resource === "sites" ? operatorSites(c.env, window, query) : operatorUsers(c.env, window, query)));
    });
  }
  return router;
}
