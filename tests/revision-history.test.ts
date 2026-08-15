import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createApiApp } from "../src/worker/api";

const OWNER = "owner_test";

interface Captured {
  sql: string;
  bound: unknown[];
}

function app() {
  return createApiApp({
    sessionResolver: async () => ({
      user: { id: OWNER, email: "owner@example.test", name: "Owner" },
      session: { id: "session_test", userId: OWNER, token: "token", expiresAt: new Date(Date.now() + 60000), createdAt: new Date(), updatedAt: new Date() }
    })
  });
}

function revisionRow(overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    id: "rev1",
    site_id: "s1",
    r2_prefix: "sites/s1/revisions/rev1",
    entry_path: "index.html",
    file_count: 1,
    total_bytes: 1234,
    content_sha256: "sha-rev1",
    warnings_json: "[]",
    created_at: "2026-06-19T00:00:00.000Z",
    created_by: OWNER,
    note: null,
    restored_from_revision_id: null,
    ...overrides
  };
}

function makeEnv(captured: Captured[], options: { siteId?: string; currentRevisionId?: string; revisions?: Record<string, unknown>[]; auth?: Record<string, unknown>; plan?: string | null } = {}): Env {
  const plan = options.plan === undefined ? "agency" : options.plan;
  const site: Record<string, unknown> = {
    id: "s1",
    owner_user_id: OWNER,
    slug: "demo",
    title: "Demo",
    status: "active",
    auth_mode: "password",
    password_hash: "existing-hash",
    allowed_email_domains: "[]",
    allowed_emails: "[]",
    indexing_enabled: 0,
    hide_branding: 0,
    tool: null,
    expires_at: "2026-07-01T00:00:00.000Z",
    current_revision_id: options.currentRevisionId ?? "rev2",
    created_at: "2026-06-18T00:00:00.000Z",
    updated_at: "2026-06-18T00:00:00.000Z",
    deleted_at: null,
    ...options.auth
  };
  const revs: Record<string, unknown>[] = (options.revisions ?? [
    revisionRow({ id: "rev1", created_at: "2026-06-19T00:00:00.000Z" }),
    revisionRow({ id: "rev2", r2_prefix: "sites/s1/revisions/rev2", created_at: "2026-06-20T00:00:00.000Z", content_sha256: "sha-rev2" })
  ]).map((row) => ({ ...row }));

  const db = {
    prepare(sql: string) {
      let bound: unknown[] = [];
      const statement = {
        bind(...args: unknown[]) {
          bound = args;
          return statement;
        },
        async first<T = unknown>() {
          if (sql.includes("SELECT * FROM sites WHERE id = ? AND owner_user_id = ?")) {
            return bound[0] === site.id && bound[1] === OWNER ? ({ ...site } as T) : (null as T);
          }
          if (sql.includes("SELECT id, current_revision_id FROM sites")) {
            return bound[0] === site.id && bound[1] === OWNER ? ({ id: site.id, current_revision_id: site.current_revision_id } as T) : (null as T);
          }
          if (sql.includes("SELECT * FROM revisions WHERE id = ? AND site_id = ?")) {
            const row = revs.find((r) => r.id === bound[0] && r.site_id === bound[1]);
            return (row ? { ...row } : null) as T;
          }
          if (sql.includes("SELECT id FROM revisions WHERE id = ? AND site_id = ?")) {
            const row = revs.find((r) => r.id === bound[0] && r.site_id === bound[1]);
            return (row ? { id: row.id } : null) as T;
          }
          if (sql.includes("FROM billing_subscriptions")) {
            return (plan ? { plan_id: plan, status: "active", current_period_end: null, cancel_at_period_end: 0, stripe_customer_id: null } : null) as T;
          }
          return null as T;
        },
        async all<T = unknown>() {
          if (sql.includes("FROM revisions WHERE site_id = ?")) {
            return { results: revs.filter((r) => r.site_id === bound[0]) as T[], success: true, meta: { changes: 0 } } as D1Result<T>;
          }
          return { results: [] as T[], success: true, meta: { changes: 0 } } as D1Result<T>;
        },
        async run() {
          captured.push({ sql, bound });
          if (sql.startsWith("INSERT INTO revisions")) {
            revs.push({
              id: bound[0], site_id: bound[1], r2_prefix: bound[2], entry_path: bound[3], file_count: bound[4],
              total_bytes: bound[5], content_sha256: bound[6], warnings_json: bound[7], created_at: bound[8],
              created_by: bound[9], note: bound[10], restored_from_revision_id: bound[11]
            });
          }
          if (sql.includes("UPDATE sites SET current_revision_id = ?")) {
            site.current_revision_id = bound[0];
          }
          return { success: true, meta: { changes: 1 } } as D1Result;
        }
      } as unknown as D1PreparedStatement;
      return statement;
    },
    batch: async () => [],
    exec: async () => ({ count: 0, duration: 0 })
  } as unknown as D1Database;

  return { DB: db, APP_HOST: "giga-site.com", APP_BASE_PATH: "/app", PREVIEW_HOST_SUFFIX: ".giga-site.com" } as unknown as Env;
}

function get(path: string) {
  return new Request(`https://giga-site.com${path}`, { method: "GET" });
}
function post(path: string) {
  return new Request(`https://giga-site.com${path}`, { method: "POST" });
}

describe("revision history (issue #137)", () => {
  it("lists generations newest-first with chronological numbers and the current marker", async () => {
    const res = await app().fetch(get("/api/sites/s1/revisions"), makeEnv([]));
    const body = (await res.json()) as { revisions: Array<{ id: string; generation: number; isCurrent: boolean }>; currentRevisionId: string };

    expect(res.status).toBe(200);
    expect(body.currentRevisionId).toBe("rev2");
    expect(body.revisions.map((r) => r.id)).toEqual(["rev2", "rev1"]);
    expect(body.revisions.find((r) => r.id === "rev1")).toMatchObject({ generation: 1, isCurrent: false });
    expect(body.revisions.find((r) => r.id === "rev2")).toMatchObject({ generation: 2, isCurrent: true });
  });

  it("restores a past generation as a new revision reusing its files, leaving URL/auth/expiry intact", async () => {
    const captured: Captured[] = [];
    const env = makeEnv(captured);
    const res = await app().fetch(post("/api/sites/s1/revisions/rev1/restore"), env);
    const body = (await res.json()) as { revision: { generation: number; restoredFromGeneration: number; isCurrent: boolean }; currentRevisionId: string };

    expect(res.status).toBe(200);

    const insert = captured.find((c) => c.sql.startsWith("INSERT INTO revisions"));
    expect(insert).toBeDefined();
    // reuses rev1's stored R2 prefix (no file copy) and records the restore source
    expect(insert?.bound[2]).toBe("sites/s1/revisions/rev1");
    expect(insert?.bound[11]).toBe("rev1");
    expect(insert?.bound[9]).toBe(OWNER);

    // only the current-revision pointer changes; nothing touches slug/auth/expiry
    const update = captured.find((c) => c.sql.includes("UPDATE sites SET current_revision_id = ?"));
    expect(update).toBeDefined();
    const newRevisionId = update?.bound[0];
    expect(newRevisionId).not.toBe("rev1");
    expect(newRevisionId).not.toBe("rev2");
    expect(body.currentRevisionId).toBe(newRevisionId);
    expect(body.revision.restoredFromGeneration).toBe(1);
    expect(body.revision.isCurrent).toBe(true);
    expect(captured.some((c) => c.sql.includes("UPDATE sites SET") && (c.sql.includes("slug") || c.sql.includes("auth_mode") || c.sql.includes("expires_at")))).toBe(false);
  });

  it("refuses to restore the already-current generation", async () => {
    const res = await app().fetch(post("/api/sites/s1/revisions/rev2/restore"), makeEnv([]));
    expect(res.status).toBe(409);
    expect(((await res.json()) as { error: string }).error).toBe("revision_already_current");
  });

  it("returns 404 when restoring an unknown revision", async () => {
    const res = await app().fetch(post("/api/sites/s1/revisions/ghost/restore"), makeEnv([]));
    expect(res.status).toBe(404);
    expect(((await res.json()) as { error: string }).error).toBe("revision_not_found");
  });

  it("returns 404 when acting on a site the user does not own", async () => {
    const res = await app().fetch(post("/api/sites/not-mine/revisions/rev1/restore"), makeEnv([]));
    expect(res.status).toBe(404);
    expect(((await res.json()) as { error: string }).error).toBe("site_not_found");
  });

  it("requires a 個人Pro+ plan (free owners get plan_required)", async () => {
    const list = await app().fetch(get("/api/sites/s1/revisions"), makeEnv([], { plan: null }));
    expect(list.status).toBe(403);
    expect(((await list.json()) as { error: string }).error).toBe("plan_required");

    const restore = await app().fetch(post("/api/sites/s1/revisions/rev1/restore"), makeEnv([], { plan: null }));
    expect(restore.status).toBe(403);
  });

  it("allows revision history on the entry paid tier (個人Pro)", async () => {
    const res = await app().fetch(get("/api/sites/s1/revisions"), makeEnv([], { plan: "personal_pro" }));
    expect(res.status).toBe(200);
  });

  it("issues a short-lived owner preview token URL scoped to the past revision", async () => {
    const captured: Captured[] = [];
    const res = await app().fetch(post("/api/sites/s1/revisions/rev1/preview"), makeEnv(captured));
    const body = (await res.json()) as { previewUrl: string; expiresAt: string };

    expect(res.status).toBe(200);
    expect(body.previewUrl.startsWith("https://demo.giga-site.com/")).toBe(true);
    expect(body.previewUrl).toContain("__rev_preview=");
    expect(typeof body.expiresAt).toBe("string");

    const insert = captured.find((c) => c.sql.startsWith("INSERT INTO revision_preview_tokens"));
    expect(insert).toBeDefined();
    expect(insert?.bound[1]).toBe("s1");
    expect(insert?.bound[2]).toBe("rev1");
  });
});

describe("revision history contracts", () => {
  it("migration 0015 adds revision metadata columns and the preview-token table", () => {
    const sql = readFileSync("migrations/0015_revision_history.sql", "utf8");
    expect(sql).toContain("ALTER TABLE revisions ADD COLUMN created_by");
    expect(sql).toContain("ALTER TABLE revisions ADD COLUMN restored_from_revision_id");
    expect(sql).toContain("CREATE TABLE IF NOT EXISTS revision_preview_tokens");
  });

  it("preview serving honours owner revision-preview tokens without exposing them publicly", () => {
    const preview = readFileSync("src/worker/preview.ts", "utf8");
    expect(preview).toContain("__rev_preview");
    expect(preview).toContain("revision_preview_tokens");
    // token preview must bypass viewer auth and force noindex
    expect(preview).toContain("isRevisionPreview");
    expect(preview).toMatch(/isRevisionPreview[\s\S]{0,80}noindex/);
  });
});
