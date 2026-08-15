import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { reserveAnonymousPublishAttempt } from "../src/worker/anonymous-publish-rate-limit";

function fakeRateLimitDb() {
  const buckets = new Map<string, { count: number; resetsAt: string; updatedAt: string }>();
  const executed: string[] = [];
  const db = {
    prepare(sql: string) {
      executed.push(sql);
      let bound: unknown[] = [];
      return {
        bind(...args: unknown[]) {
          bound = args;
          return this;
        },
        async run() {
          if (!sql.includes("anonymous_publish_attempts")) {
            throw new Error(`Unexpected SQL: ${sql}`);
          }
          const bucketKey = String(bound[0]);
          const resetsAt = String(bound[3]);
          const now = String(bound[4]);
          const maxAttempts = Number(bound[5]);
          const current = buckets.get(bucketKey);
          if (!current || current.resetsAt <= now) {
            buckets.set(bucketKey, { count: 1, resetsAt, updatedAt: now });
            return { success: true, meta: { changes: 1 } } as D1Result;
          }
          if (current.count >= maxAttempts) {
            return { success: true, meta: { changes: 0 } } as D1Result;
          }
          current.count += 1;
          current.updatedAt = now;
          return { success: true, meta: { changes: 1 } } as D1Result;
        }
      } as unknown as D1PreparedStatement;
    }
  } as unknown as D1Database;
  return { db, buckets, executed };
}

describe("anonymous publish attempt rate limiter", () => {
  it("atomically caps anonymous publish attempts before expensive upload validation", async () => {
    const { db, executed } = fakeRateLimitDb();
    const now = new Date("2026-06-21T10:05:00.000Z");

    const results = await Promise.all([
      reserveAnonymousPublishAttempt(db, "ip_hash", now, { hour: 2, day: 20 }),
      reserveAnonymousPublishAttempt(db, "ip_hash", now, { hour: 2, day: 20 }),
      reserveAnonymousPublishAttempt(db, "ip_hash", now, { hour: 2, day: 20 })
    ]);

    expect(results).toEqual([true, true, false]);
    expect(executed.join("\n")).toContain("ON CONFLICT(bucket_key) DO UPDATE");
    expect(executed.join("\n")).toContain("count < ?");
  });

  it("adds a dedicated D1 table and reserves attempts before validation/scanning", () => {
    const migration = readFileSync("migrations/0013_anonymous_publish_attempts.sql", "utf8");
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS anonymous_publish_attempts");
    expect(migration).toContain("bucket_key TEXT PRIMARY KEY");

    const api = readFileSync("src/worker/api.ts", "utf8");
    const reserveIndex = api.indexOf("reserveAnonymousPublishAttempt");
    const validateIndex = api.indexOf("validateRevisionUpload(\n      c.env,\n      { html: body.html");
    expect(reserveIndex).toBeGreaterThan(-1);
    expect(validateIndex).toBeGreaterThan(-1);
    expect(reserveIndex).toBeLessThan(validateIndex);
  });
});
