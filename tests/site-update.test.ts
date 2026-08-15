import { afterEach, describe, expect, it, vi } from "vitest";
import { createApiApp } from "../src/worker/api";

interface Captured {
  sql: string;
  bound: unknown[];
}

function apiEnv(captured: Captured[], siteOverrides: Record<string, unknown> = {}, subscription: Record<string, unknown> | null = null): Env {
  const siteRow: Record<string, unknown> = {
    id: "s1",
    owner_user_id: "owner_test",
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
    expires_at: null,
    current_revision_id: "rev1",
    created_at: "2026-06-19T00:00:00.000Z",
    updated_at: "2026-06-19T00:00:00.000Z",
    deleted_at: null,
    views: 0,
    auth_views: 0,
    unique_visitors: 0,
    total_bytes: 0,
    last_seen_at: null,
    ...siteOverrides
  };
  const db = {
    prepare(sql: string) {
      let bound: unknown[] = [];
      const statement = {
        bind(...args: unknown[]) {
          bound = args;
          return statement;
        },
        async first<T = unknown>() {
          if (sql.includes("FROM billing_subscriptions")) {
            return subscription as T;
          }
          if (sql.includes("SELECT * FROM sites WHERE id = ? AND owner_user_id = ?")) {
            return siteRow as T;
          }
          if (sql.includes("FROM sites s WHERE")) {
            return siteRow as T;
          }
          return null as T;
        },
        async run() {
          captured.push({ sql, bound });
          if (sql.includes("UPDATE sites SET") && sql.includes("expires_at = ?")) {
            siteRow.expires_at = String(bound[0]);
            siteRow.updated_at = String(bound[1]);
          }
          return { success: true, meta: { changes: 1 } } as D1Result;
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

  return { DB: db, APP_HOST: "giga-site.com", APP_BASE_PATH: "/app", PREVIEW_HOST_SUFFIX: ".giga-site.com" } as unknown as Env;
}

function app() {
  return createApiApp({
    sessionResolver: async () => ({
      user: { id: "owner_test", email: "owner@example.test", name: "Owner" },
      session: { id: "s", userId: "owner_test", token: "t", expiresAt: new Date(Date.now() + 60000), createdAt: new Date(), updatedAt: new Date() }
    })
  });
}

function patch(body: unknown) {
  return new Request("https://giga-site.com/api/sites/s1", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

function renew() {
  return new Request("https://giga-site.com/api/sites/s1/renew-expiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
}

function renewWithoutBody() {
  return new Request("https://giga-site.com/api/sites/s1/renew-expiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });
}

function renewWithPlainText() {
  return new Request("https://giga-site.com/api/sites/s1/renew-expiry", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: "{}"
  });
}

afterEach(() => {
  vi.useRealTimers();
});

describe("PATCH /api/sites/:id auth re-config", () => {
  it("keeps the existing password hash when staying in password mode with no new password", async () => {
    const captured: Captured[] = [];
    const response = await app().fetch(patch({ authMode: "password" }), apiEnv(captured));
    expect(response.status).toBe(200);

    const update = captured.find((c) => c.sql.includes("UPDATE sites SET"));
    expect(update).toBeDefined();
    expect(update?.sql).not.toContain("password_hash");
  });

  it("rejects switching into password mode without a new or existing password hash", async () => {
    const captured: Captured[] = [];
    const response = await app().fetch(patch({ authMode: "password" }), apiEnv(captured, { auth_mode: "random", password_hash: null }));
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(body.error).toBe("password_required");
    expect(captured.find((c) => c.sql.includes("UPDATE sites SET"))).toBeUndefined();
  });

  it("clears the password hash when switching away from password mode", async () => {
    const captured: Captured[] = [];
    await app().fetch(patch({ authMode: "random" }), apiEnv(captured));

    const update = captured.find((c) => c.sql.includes("UPDATE sites SET"));
    expect(update?.sql).toContain("password_hash = ?");
    expect(update?.bound).toContain(null);
  });

  it("revokes viewer sessions and pending OTP challenges on any auth-config change", async () => {
    const captured: Captured[] = [];
    await app().fetch(patch({ authMode: "email_domain", allowedEmailDomains: "acme.co.jp" }), apiEnv(captured));

    const sessionPurge = captured.find((c) => c.sql.includes("DELETE FROM viewer_sessions"));
    const challengePurge = captured.find((c) => c.sql.includes("DELETE FROM email_otp_challenges"));
    expect(sessionPurge).toBeDefined();
    expect(sessionPurge?.bound).toContain("s1");
    expect(challengePurge).toBeDefined();
    expect(challengePurge?.bound).toContain("s1");
  });

  it("does not touch viewer sessions for a non-auth update", async () => {
    const captured: Captured[] = [];
    await app().fetch(patch({ indexingEnabled: true }), apiEnv(captured));

    expect(captured.find((c) => c.sql.includes("DELETE FROM viewer_sessions"))).toBeUndefined();
    expect(captured.find((c) => c.sql.includes("DELETE FROM email_otp_challenges"))).toBeUndefined();
  });

  it("rejects enabling branding removal without an active paid (Pro) subscription", async () => {
    const captured: Captured[] = [];
    const response = await app().fetch(patch({ hideBranding: true }), apiEnv(captured, {}, null));
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(403);
    expect(body.error).toBe("plan_required");
    expect(captured.find((c) => c.sql.includes("UPDATE sites SET"))).toBeUndefined();
  });

  it("allows branding removal for an active Pro subscription", async () => {
    const captured: Captured[] = [];
    const response = await app().fetch(patch({ hideBranding: true }), apiEnv(captured, {}, { plan_id: "pro", status: "active" }));

    expect(response.status).toBe(200);
    expect(captured.find((c) => c.sql.includes("UPDATE sites SET") && c.bound.includes(1))).toBeDefined();
  });
});

describe("POST /api/sites/:id/renew-expiry", () => {
  it("spec: JSONオブジェクトbodyなしの期限延長は副作用前に拒否する", async () => {
    const captured: Captured[] = [];
    const response = await app().fetch(renewWithoutBody(), apiEnv(captured, { expires_at: "2026-06-22T00:00:00.000Z" }));
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(body.error).toBe("invalid_json");
    expect(captured.find((c) => c.sql.includes("UPDATE sites SET expires_at"))).toBeUndefined();
  });

  it("spec: JSON以外の期限延長リクエストは副作用前に拒否する", async () => {
    const captured: Captured[] = [];
    const response = await app().fetch(renewWithPlainText(), apiEnv(captured, { expires_at: "2026-06-22T00:00:00.000Z" }));
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(body.error).toBe("invalid_json");
    expect(captured.find((c) => c.sql.includes("UPDATE sites SET expires_at"))).toBeUndefined();
  });

  it("resets an expiring site's public period to seven days from now", async () => {
    vi.setSystemTime(new Date("2026-06-21T00:00:00.000Z"));
    const captured: Captured[] = [];
    const response = await app().fetch(renew(), apiEnv(captured, { expires_at: "2026-06-22T00:00:00.000Z" }));
    const body = (await response.json()) as { site: { expiresAt: string | null } };

    expect(response.status).toBe(200);
    expect(body.site.expiresAt).toBe("2026-06-28T00:00:00.000Z");
    const update = captured.find((c) => c.sql.includes("UPDATE sites SET expires_at = ?"));
    expect(update?.bound[0]).toBe("2026-06-28T00:00:00.000Z");
  });

  it("can revive an expired finite public period", async () => {
    vi.setSystemTime(new Date("2026-06-21T00:00:00.000Z"));
    const captured: Captured[] = [];
    const response = await app().fetch(renew(), apiEnv(captured, { expires_at: "2026-06-20T00:00:00.000Z" }));
    const body = (await response.json()) as { site: { expiresAt: string | null } };

    expect(response.status).toBe(200);
    expect(body.site.expiresAt).toBe("2026-06-28T00:00:00.000Z");
  });

  it("does not shorten a longer existing public period", async () => {
    vi.setSystemTime(new Date("2026-06-21T00:00:00.000Z"));
    const captured: Captured[] = [];
    const response = await app().fetch(renew(), apiEnv(captured, { expires_at: "2026-07-30T00:00:00.000Z" }));
    const body = (await response.json()) as { site: { expiresAt: string | null } };

    expect(response.status).toBe(200);
    expect(body.site.expiresAt).toBe("2026-07-30T00:00:00.000Z");
  });

  it("rejects renewal for unlimited public periods", async () => {
    const captured: Captured[] = [];
    const response = await app().fetch(renew(), apiEnv(captured, { expires_at: null }));
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(body.error).toBe("expiry_renewal_not_available");
    expect(captured.find((c) => c.sql.includes("UPDATE sites SET expires_at"))).toBeUndefined();
  });
});
