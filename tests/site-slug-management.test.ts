import { describe, expect, it } from "vitest";
import { createApiApp } from "../src/worker/api";

interface Captured {
  sql: string;
  bound: unknown[];
}

function app() {
  return createApiApp({
    sessionResolver: async () => ({
      user: { id: "owner_test", email: "owner@example.test", name: "Owner" },
      session: { id: "session_test", userId: "owner_test", token: "token", expiresAt: new Date(Date.now() + 60000), createdAt: new Date(), updatedAt: new Date() }
    })
  });
}

function currentSite(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
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
    ...overrides
  };
}

function apiEnv(captured: Captured[], takenSlugs: Record<string, string> = {}): Env {
  const siteRow = currentSite();
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
            return bound[0] === "s1" && bound[1] === "owner_test" ? (siteRow as T) : null as T;
          }
          if (sql.includes("SELECT id FROM sites WHERE id = ? AND owner_user_id = ?")) {
            return bound[0] === "s1" && bound[1] === "owner_test" ? ({ id: "s1" } as T) : null as T;
          }
          if (sql.includes("SELECT id FROM sites WHERE slug = ? AND deleted_at IS NULL")) {
            const slug = String(bound[0]);
            if (slug === siteRow.slug) return { id: "s1" } as T;
            const takenId = takenSlugs[slug];
            return takenId ? ({ id: takenId } as T) : null as T;
          }
          if (sql.includes("FROM sites s WHERE")) {
            return siteRow as T;
          }
          if (sql.includes("FROM billing_subscriptions")) {
            return null as T;
          }
          return null as T;
        },
        async run() {
          captured.push({ sql, bound });
          if (sql.includes("UPDATE sites SET") && sql.includes("slug = ?")) {
            siteRow.slug = String(bound[0]);
            siteRow.updated_at = String(bound.at(-3));
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

function availability(slug: string, currentSiteId?: string) {
  const url = new URL("https://giga-site.com/api/slugs/availability");
  url.searchParams.set("slug", slug);
  if (currentSiteId) url.searchParams.set("currentSiteId", currentSiteId);
  return new Request(url, { method: "GET" });
}

function patchSlug(slug: string) {
  return new Request("https://giga-site.com/api/sites/s1", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug })
  });
}

describe("site public URL slug management", () => {
  it("checks whether a typed subdomain is available", async () => {
    const captured: Captured[] = [];
    const response = await app().fetch(availability("New-Demo"), apiEnv(captured));
    const body = (await response.json()) as { available: boolean; normalizedSlug: string; reason: string | null };

    expect(response.status).toBe(200);
    expect(body).toEqual({ available: true, normalizedSlug: "new-demo", reason: null });
  });

  it("reports taken and reserved subdomains without changing data", async () => {
    const taken = await app().fetch(availability("taken"), apiEnv([], { taken: "s2" }));
    const takenBody = (await taken.json()) as { available: boolean; reason: string };
    expect(taken.status).toBe(200);
    expect(takenBody).toMatchObject({ available: false, reason: "slug_already_taken" });

    const reserved = await app().fetch(availability("app"), apiEnv([]));
    const reservedBody = (await reserved.json()) as { available: boolean; reason: string };
    expect(reserved.status).toBe(200);
    expect(reservedBody).toMatchObject({ available: false, reason: "reserved_slug" });
  });

  it("treats the current site's own slug as available while editing", async () => {
    const response = await app().fetch(availability("demo", "s1"), apiEnv([]));
    const body = (await response.json()) as { available: boolean; reason: string | null };

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ available: true, reason: "current_slug" });
  });

  it("lets the owner change a site's public URL slug after publishing", async () => {
    const captured: Captured[] = [];
    const response = await app().fetch(patchSlug("new-demo"), apiEnv(captured));
    const body = (await response.json()) as { site: { slug: string; previewUrl: string } };

    expect(response.status).toBe(200);
    expect(body.site.slug).toBe("new-demo");
    expect(body.site.previewUrl).toBe("https://new-demo.giga-site.com/");
    const update = captured.find((item) => item.sql.includes("UPDATE sites SET") && item.sql.includes("slug = ?"));
    expect(update?.bound).toContain("new-demo");
  });

  it("rejects changing a site's public URL to an already-used slug", async () => {
    const captured: Captured[] = [];
    const response = await app().fetch(patchSlug("taken"), apiEnv(captured, { taken: "s2" }));
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(409);
    expect(body.error).toBe("slug_already_taken");
    expect(captured.find((item) => item.sql.includes("UPDATE sites SET"))).toBeUndefined();
  });
});
