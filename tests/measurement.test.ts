import { describe, expect, it } from "vitest";
import { createApiApp } from "../src/worker/api";
import { MEASUREMENT_EVENT_NAMES } from "../src/shared/types";

interface CapturedMeasurementRow {
  id: string;
  event_name: string;
  path: string;
  article_path: string | null;
  owner_user_id: string | null;
  site_id: string | null;
  session_hash: string | null;
  ip_hash: string | null;
  user_agent_hash: string | null;
  referrer: string | null;
  metadata_json: string;
  created_at: string;
}

function fakeMeasurementDb() {
  const rows: CapturedMeasurementRow[] = [];
  const db = {
    prepare(sql: string) {
      let bound: unknown[] = [];
      const statement = {
        bind(...args: unknown[]) {
          bound = args;
          return statement;
        },
        async first<T = unknown>() {
          return null as T | null;
        },
        async run() {
          if (sql.includes("INSERT INTO measurement_events")) {
            const row: CapturedMeasurementRow = {
              id: String(bound[0]),
              event_name: String(bound[1]),
              path: String(bound[2]),
              article_path: bound[3] === null ? null : String(bound[3]),
              owner_user_id: bound[4] === null ? null : String(bound[4]),
              site_id: bound[5] === null ? null : String(bound[5]),
              session_hash: bound[6] === null ? null : String(bound[6]),
              ip_hash: bound[7] === null ? null : String(bound[7]),
              user_agent_hash: bound[8] === null ? null : String(bound[8]),
              referrer: bound[9] === null ? null : String(bound[9]),
              metadata_json: String(bound[10]),
              created_at: String(bound[11])
            };
            rows.push(row);
            return { success: true, meta: { changes: 1 } } as D1Result;
          }
          throw new Error(`Unexpected run SQL: ${sql} ${JSON.stringify(bound)}`);
        },
        async all<T = unknown>() {
          return { results: [] as T[], success: true, meta: { changes: 0 } } as D1Result<T>;
        }
      } as unknown as D1PreparedStatement;
      return statement;
    },
    batch: async () => [],
    exec: async () => ({ count: 0, duration: 0 })
  } as unknown as D1Database;
  return { db, rows };
}

const baseEnv = {
  APP_HOST: "giga-site.com",
  APP_BASE_PATH: "/app",
  PREVIEW_HOST_SUFFIX: ".giga-site.com"
} as unknown as Env;

describe("marketing measurement events", () => {
  it("spec: public endpoint accepts only the SEO experiment funnel events and stores hashed request identity", async () => {
    expect(MEASUREMENT_EVENT_NAMES).toEqual([
      "article_view",
      "cta_click",
      "upload_started",
      "upload_completed",
      "signup_started",
      "signup_completed",
      "checkout_started",
      "subscription_created"
    ]);
    const { db, rows } = fakeMeasurementDb();
    const app = createApiApp();
    const response = await app.fetch(
      new Request("https://giga-site.com/api/measure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CF-Connecting-IP": "203.0.113.10",
          "User-Agent": "Vitest Browser",
          Referer: "https://www.google.com/search?q=secret-token",
          Origin: "https://giga-site.com"
        },
        body: JSON.stringify({
          eventName: "article_view",
          path: "/articles/html-share?utm_source=x#top",
          articlePath: "/articles/html-share?debug=1",
          visitorId: "11111111-2222-4333-8444-555555555555",
          siteId: "site_123",
          metadata: {
            cta: "body",
            label: "無料でHTMLを公開する",
            nested: { ignored: true },
            tooLong: "x".repeat(300)
          }
        })
      }),
      { ...baseEnv, DB: db } as unknown as Env
    );

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ accepted: true });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      event_name: "article_view",
      path: "/articles/html-share",
      article_path: "/articles/html-share",
      owner_user_id: null,
      site_id: "site_123",
      referrer: "https://www.google.com/search"
    });
    expect(rows[0].ip_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(rows[0].user_agent_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(rows[0].session_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(rows[0].ip_hash).not.toContain("203.0.113.10");
    const metadata = JSON.parse(rows[0].metadata_json) as Record<string, unknown>;
    expect(metadata).toEqual({ cta: "body", label: "無料でHTMLを公開する", tooLong: "x".repeat(160) });
  });

  it("rejects unknown event names and unsafe paths before writing", async () => {
    const { db, rows } = fakeMeasurementDb();
    const app = createApiApp();
    const response = await app.fetch(
      new Request("https://giga-site.com/api/measure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName: "made_up_event", path: "https://evil.example/path" })
      }),
      { ...baseEnv, DB: db } as unknown as Env
    );
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(body.error).toBe("invalid_measurement_event");
    expect(rows).toEqual([]);
  });
});
