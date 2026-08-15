import { describe, expect, it } from "vitest";
import { normalizeSiteInput } from "../src/shared/site-input";
import { createApiApp } from "../src/worker/api";
import { handlePreviewRequest } from "../src/worker/preview";

type FakeSite = Record<string, unknown>;

const baseSite = {
  id: "site_test",
  owner_user_id: "owner_test",
  slug: "demo",
  title: "Demo",
  status: "active",
  auth_mode: "random",
  password_hash: null,
  allowed_email_domains: "[]",
  expires_at: null,
  current_revision_id: "rev_test",
  created_at: "2026-06-19T00:00:00.000Z",
  updated_at: "2026-06-19T00:00:00.000Z",
  deleted_at: null,
  indexing_enabled: 0
};

const baseRevision = {
  id: "rev_test",
  site_id: "site_test",
  r2_prefix: "sites/site_test/revisions/rev_test",
  entry_path: "index.html",
  file_count: 1,
  total_bytes: 44,
  content_sha256: "sha",
  warnings_json: "[]",
  created_at: "2026-06-19T00:00:00.000Z"
};

function objectFromText(text: string, contentType = "text/html; charset=utf-8") {
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text));
      controller.close();
    }
  });
  return {
    body,
    async text() {
      return text;
    },
    writeHttpMetadata(headers: Headers) {
      headers.set("Content-Type", contentType);
    }
  };
}

function htmlObject() {
  return objectFromText("<!doctype html><html><body>Demo</body></html>");
}

function previewEnv(siteOverrides: Partial<typeof baseSite> = {}, objects: Record<string, { body: string; contentType: string }> = {}): Env {
  const site: FakeSite = { ...baseSite, ...siteOverrides };
  const db = {
    prepare(sql: string) {
      let bound: unknown[] = [];
      const statement = {
        bind(...args: unknown[]) {
          bound = args;
          return statement;
        },
        async first<T = unknown>() {
          if (sql.includes("FROM sites WHERE slug")) {
            return site as T;
          }
          if (sql.includes("FROM revisions")) {
            return baseRevision as T;
          }
          if (sql.includes("FROM viewer_sessions")) {
            return null as T;
          }
          throw new Error(`Unexpected first SQL: ${sql} ${JSON.stringify(bound)}`);
        },
        async run() {
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

  const bucket = {
    async get(key: string) {
      const object = objects[key];
      if (object) {
        return objectFromText(object.body, object.contentType);
      }
      return key.endsWith("index.html") ? htmlObject() : null;
    }
  } as unknown as R2Bucket;

  return {
    DB: db,
    HTML_BUCKET: bucket,
    APP_HOST: "giga-site.com",
    APP_BASE_PATH: "/app",
    PREVIEW_HOST_SUFFIX: ".giga-site.com",
    EMAIL_FROM: "no-reply@giga-site.com",
    SESSION_TTL_SECONDS: "86400"
  } as unknown as Env;
}

function authenticatedApiApp() {
  return createApiApp({
    sessionResolver: async () => ({
      user: { id: "owner_test", email: "owner@example.com", name: "Owner" },
      session: {
        id: "session_test",
        userId: "owner_test",
        token: "token_test",
        expiresAt: new Date(Date.now() + 60_000),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  });
}

function apiEnv(initial: Partial<typeof baseSite> = {}): Env {
  const site: FakeSite = { ...baseSite, ...initial };
  const db = {
    prepare(sql: string) {
      let bound: unknown[] = [];
      const statement = {
        bind(...args: unknown[]) {
          bound = args;
          return statement;
        },
        async first<T = unknown>() {
          if (sql.includes("FROM billing_subscriptions WHERE owner_user_id")) {
            return null as T;
          }
          if (sql.includes("COUNT(*) AS activeSiteCount")) {
            return { activeSiteCount: 0 } as T;
          }
          if (sql.includes("FROM billing_site_purchases") && sql.includes("site_quota > used_site_count")) {
            return null as T;
          }
          if (sql.includes("SELECT id FROM sites WHERE slug")) {
            return null as T;
          }
          if (sql.includes("SELECT * FROM sites WHERE slug = ? AND owner_user_id = ?")) {
            return site as T;
          }
          if (sql.includes("SELECT * FROM sites WHERE id = ? AND owner_user_id = ?")) {
            return site as T;
          }
          if (sql.includes("FROM sites s WHERE")) {
            return { ...site, views: 0, auth_views: 0, unique_visitors: 0, total_bytes: 0, last_seen_at: null } as T;
          }
          throw new Error(`Unexpected first SQL: ${sql} ${JSON.stringify(bound)}`);
        },
        async run() {
          if (sql.includes("INSERT INTO sites")) {
            site.id = bound[0];
            site.owner_user_id = bound[1];
            site.slug = bound[2];
            site.title = bound[3];
            site.auth_mode = bound[4];
            site.password_hash = bound[5];
            site.allowed_email_domains = bound[6];
            site.allowed_emails = bound[7];
            site.indexing_enabled = bound[8];
            site.hide_branding = bound[9];
            site.tool = bound[10];
            site.expires_at = bound[11];
            site.created_at = bound[12];
            site.updated_at = bound[13];
            return { success: true, meta: { changes: 1 } } as D1Result;
          }
          if (sql.includes("UPDATE sites SET indexing_enabled")) {
            site.indexing_enabled = bound[0];
            site.updated_at = bound[1];
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

  return {
    DB: db,
    APP_HOST: "giga-site.com",
    APP_BASE_PATH: "/app",
    PREVIEW_HOST_SUFFIX: ".giga-site.com"
  } as unknown as Env;
}

describe("site indexing controls", () => {
  it("defaults new sites to search indexing disabled", () => {
    const input = normalizeSiteInput({ title: "Demo", authMode: "random" });

    expect(input.ok).toBe(true);
    if (input.ok) {
      expect(input.value.indexingEnabled).toBe(false);
    }
  });

  it("accepts explicit search indexing opt-in", () => {
    const input = normalizeSiteInput({ title: "Demo", authMode: "random", indexingEnabled: true });

    expect(input.ok).toBe(true);
    if (input.ok) {
      expect(input.value.indexingEnabled).toBe(true);
    }
  });

  it("persists the indexing flag on create and update APIs", async () => {
    const env = apiEnv();
    const app = authenticatedApiApp();
    const created = await app.fetch(
      new Request("https://giga-site.com/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Demo", slug: "demo", authMode: "random", indexingEnabled: true })
      }),
      env
    );
    const createdBody = (await created.json()) as { site: { indexingEnabled: boolean } };

    expect(created.status).toBe(201);
    expect(createdBody.site.indexingEnabled).toBe(true);

    const updated = await app.fetch(
      new Request("https://giga-site.com/api/sites/site_test", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ indexingEnabled: false })
      }),
      env
    );
    const updatedBody = (await updated.json()) as { site: { indexingEnabled: boolean } };

    expect(updated.status).toBe(200);
    expect(updatedBody.site.indexingEnabled).toBe(false);
  });

  it("keeps preview responses noindex/nofollow when indexing is disabled", async () => {
    const response = await handlePreviewRequest(new Request("https://demo.giga-site.com/"), previewEnv({ indexing_enabled: 0 }));

    expect(response.status).toBe(200);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });

  it("omits X-Robots-Tag for random URL sites when indexing is enabled", async () => {
    const response = await handlePreviewRequest(new Request("https://demo.giga-site.com/"), previewEnv({ auth_mode: "random", indexing_enabled: 1 }));

    expect(response.status).toBe(200);
    expect(response.headers.get("X-Robots-Tag")).toBeNull();
  });

  it("keeps protected auth gates noindex even if indexing is enabled", async () => {
    const response = await handlePreviewRequest(new Request("https://demo.giga-site.com/"), previewEnv({ auth_mode: "password", indexing_enabled: 1 }));

    expect(response.status).toBe(200);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });

  it("decodes URL-encoded zip asset paths before looking up R2 objects", async () => {
    const response = await handlePreviewRequest(
      new Request("https://demo.giga-site.com/images/foo%20bar.png"),
      previewEnv(
        { indexing_enabled: 0 },
        {
          "sites/site_test/revisions/rev_test/images/foo bar.png": { body: "png", contentType: "image/png" }
        }
      )
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/png");
    await expect(response.text()).resolves.toBe("png");
  });

  it("serves robots.txt without blocking crawlers from reading noindex headers when indexing is disabled", async () => {
    const enabled = await handlePreviewRequest(new Request("https://demo.giga-site.com/robots.txt"), previewEnv({ auth_mode: "random", indexing_enabled: 1 }));
    const disabled = await handlePreviewRequest(new Request("https://demo.giga-site.com/robots.txt"), previewEnv({ auth_mode: "random", indexing_enabled: 0 }));

    await expect(enabled.text()).resolves.toContain("Allow: /");
    const disabledText = await disabled.text();
    expect(disabledText).toContain("Allow: /");
    expect(disabledText).not.toContain("Disallow: /");
  });
});
