import { afterEach, describe, expect, it, vi } from "vitest";
import { createApiApp } from "../src/worker/api";

interface FakeTokenRow {
  id: string;
  owner_user_id: string;
  token_hash: string;
  label: string | null;
  site_config_json: string;
  max_bytes: number;
  max_files: number;
  expires_at: string;
  used_at: string | null;
  created_site_id: string | null;
  created_revision_id: string | null;
  created_at: string;
  revoked_at: string | null;
}

type FakeSite = Record<string, unknown>;
type FakeRevision = Record<string, unknown>;

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

function fakeEnv() {
  const tokens = new Map<string, FakeTokenRow>();
  const sites = new Map<string, FakeSite>();
  const revisions = new Map<string, FakeRevision>();
  const objects = new Map<string, string | Uint8Array>();

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
            const ownerUserId = String(bound[0]);
            const activeSiteCount = [...sites.values()].filter(
              (site) => site.owner_user_id === ownerUserId && site.deleted_at === null && site.status === "active"
            ).length;
            return { activeSiteCount } as T;
          }
          if (sql.includes("FROM billing_site_purchases") && sql.includes("site_quota > used_site_count")) {
            return null as T;
          }
          if (sql.includes("SELECT id FROM sites WHERE slug")) {
            const desiredSlug = String(bound[0]);
            const existing = [...sites.values()].find((site) => site.slug === desiredSlug && site.deleted_at === null);
            return (existing ? { id: existing.id } : null) as T;
          }
          if (sql.includes("FROM agent_upload_tokens WHERE id = ?")) {
            return (tokens.get(String(bound[0])) ?? null) as T;
          }
          if (sql.includes("FROM sites s WHERE")) {
            const siteId = String(bound[0]);
            const site = sites.get(siteId);
            return (site
              ? { ...site, views: 0, auth_views: 0, unique_visitors: 0, total_bytes: 0, last_seen_at: null }
              : null) as T;
          }
          throw new Error(`Unexpected first SQL: ${sql} ${JSON.stringify(bound)}`);
        },
        async run() {
          if (sql.includes("INSERT INTO agent_upload_tokens")) {
            const row: FakeTokenRow = {
              id: String(bound[0]),
              owner_user_id: String(bound[1]),
              token_hash: String(bound[2]),
              label: bound[3] === null ? null : String(bound[3]),
              site_config_json: String(bound[4]),
              max_bytes: Number(bound[5]),
              max_files: Number(bound[6]),
              expires_at: String(bound[7]),
              used_at: null,
              created_site_id: null,
              created_revision_id: null,
              created_at: String(bound[8]),
              revoked_at: null
            };
            tokens.set(row.id, row);
            return { success: true, meta: { changes: 1 } } as D1Result;
          }
          if (sql.includes("UPDATE agent_upload_tokens SET used_at")) {
            const id = String(bound[1]);
            const token = tokens.get(id);
            if (!token || token.used_at || token.revoked_at || token.expires_at <= String(bound[2])) {
              return { success: true, meta: { changes: 0 } } as D1Result;
            }
            token.used_at = String(bound[0]);
            return { success: true, meta: { changes: 1 } } as D1Result;
          }
          if (sql.includes("UPDATE agent_upload_tokens SET created_site_id")) {
            const token = tokens.get(String(bound[2]));
            if (token) {
              token.created_site_id = String(bound[0]);
              token.created_revision_id = String(bound[1]);
            }
            return { success: true, meta: { changes: token ? 1 : 0 } } as D1Result;
          }
          if (sql.includes("INSERT INTO sites")) {
            const site: FakeSite = {
              id: String(bound[0]),
              owner_user_id: String(bound[1]),
              slug: String(bound[2]),
              title: String(bound[3]),
              status: "active",
              auth_mode: String(bound[4]),
              password_hash: bound[5] === null ? null : String(bound[5]),
              allowed_email_domains: String(bound[6]),
              indexing_enabled: Number(bound[7]),
              expires_at: bound[8] === null ? null : String(bound[8]),
              current_revision_id: null,
              created_at: String(bound[9]),
              updated_at: String(bound[10]),
              deleted_at: null
            };
            sites.set(String(site.id), site);
            return { success: true, meta: { changes: 1 } } as D1Result;
          }
          if (sql.includes("INSERT INTO revisions")) {
            const revision: FakeRevision = {
              id: String(bound[0]),
              site_id: String(bound[1]),
              r2_prefix: String(bound[2]),
              entry_path: String(bound[3]),
              file_count: Number(bound[4]),
              total_bytes: Number(bound[5]),
              content_sha256: String(bound[6]),
              warnings_json: String(bound[7]),
              created_at: String(bound[8])
            };
            revisions.set(String(revision.id), revision);
            return { success: true, meta: { changes: 1 } } as D1Result;
          }
          if (sql.includes("UPDATE sites SET current_revision_id")) {
            const site = sites.get(String(bound[2]));
            if (site) {
              site.current_revision_id = String(bound[0]);
              site.updated_at = String(bound[1]);
            }
            return { success: true, meta: { changes: site ? 1 : 0 } } as D1Result;
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

  const bucket = {
    async put(key: string, body: string | Uint8Array) {
      objects.set(key, body);
      return null;
    }
  } as unknown as R2Bucket;

  const env = {
    DB: db,
    HTML_BUCKET: bucket,
    APP_HOST: "giga-site.com",
    APP_BASE_PATH: "/app",
    PREVIEW_HOST_SUFFIX: ".giga-site.com",
    EMAIL_FROM: "no-reply@giga-site.com",
    MAX_HTML_BYTES: "10485760",
    MAX_UPLOAD_FILES: "200",
    SESSION_TTL_SECONDS: "86400"
  } as unknown as Env;

  return { env, tokens, sites, revisions, objects };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

async function createToken(env: Env) {
  const response = await authenticatedApiApp().fetch(
    new Request("https://giga-site.com/api/agent/upload-tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: "Claude handoff",
        title: "AI upload",
        slug: "ai-upload",
        authMode: "password",
        password: "secret123",
        expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        tokenTtlSeconds: 3600
      })
    }),
    env
  );
  return response;
}

describe("one-time agent upload tokens", () => {
  it("rejects email_otp auth because agent tokens carry no email allowlist", async () => {
    const { env } = fakeEnv();
    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/agent/upload-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: "Claude handoff",
          title: "AI upload",
          authMode: "email_otp",
          allowedEmails: "tanaka@example.com",
          tokenTtlSeconds: 3600
        })
      }),
      env
    );
    expect(response.status).toBe(400);
    const body = (await response.json()) as { error: string };
    expect(body.error).toBe("auth_mode_unsupported_for_agent");
  });

  it("rejects invalid token limits before minting a scoped upload token", async () => {
    const invalidCases: Array<[Record<string, unknown>, string]> = [
      [{ tokenTtlSeconds: 0 }, "invalid_token_ttl_seconds"],
      [{ maxBytes: 0 }, "invalid_max_bytes"],
      [{ maxFiles: 0 }, "invalid_max_files"]
    ];

    for (const [overrides, error] of invalidCases) {
      const { env, tokens } = fakeEnv();
      const response = await authenticatedApiApp().fetch(
        new Request("https://giga-site.com/api/agent/upload-tokens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: "Claude handoff",
            title: "AI upload",
            authMode: "password",
            password: "secret123",
            ...overrides
          })
        }),
        env
      );

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toMatchObject({ error });
      expect(tokens.size).toBe(0);
    }
  });

  it("lets a signed-in user mint a short-lived scoped upload token without exposing hashes or passwords", async () => {
    const { env, tokens } = fakeEnv();

    const response = await createToken(env);
    const body = (await response.json()) as { uploadToken: { id: string; token: string; uploadUrl: string; statusUrl: string; expiresAt: string } };

    expect(response.status).toBe(201);
    expect(body.uploadToken.token).toMatch(/^gut_[a-f0-9-]+_/);
    expect(body.uploadToken.uploadUrl).toBe(`https://giga-site.com/api/agent/uploads/${body.uploadToken.id}`);
    expect(body.uploadToken.statusUrl).toBe(body.uploadToken.uploadUrl);
    expect(JSON.stringify(body)).not.toContain("secret123");
    expect(JSON.stringify(body)).not.toContain("token_hash");
    expect(tokens.get(body.uploadToken.id)?.used_at).toBeNull();
  });

  it("allows exactly one public upload with the bearer token", async () => {
    const { env, tokens, sites, revisions, objects } = fakeEnv();
    const tokenResponse = await createToken(env);
    const tokenBody = (await tokenResponse.json()) as { uploadToken: { id: string; token: string; uploadUrl: string } };

    const upload = await createApiApp().fetch(
      new Request(tokenBody.uploadToken.uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenBody.uploadToken.token}` },
        body: JSON.stringify({ html: "<!doctype html><html><body>Uploaded by AI</body></html>" })
      }),
      env
    );
    const body = (await upload.json()) as { site: { id: string; previewUrl: string }; revision: { id: string; fileCount: number } };

    expect(upload.status).toBe(201);
    expect(body.site.previewUrl).toBe("https://ai-upload.giga-site.com/");
    expect(body.revision.fileCount).toBe(1);
    expect(tokens.get(tokenBody.uploadToken.id)?.used_at).not.toBeNull();
    expect(tokens.get(tokenBody.uploadToken.id)?.created_site_id).toBe(body.site.id);
    expect(sites.size).toBe(1);
    expect(revisions.size).toBe(1);
    expect(objects.size).toBe(1);

    const reuse = await createApiApp().fetch(
      new Request(tokenBody.uploadToken.uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenBody.uploadToken.token}` },
        body: JSON.stringify({ html: "<!doctype html><html><body>Second</body></html>" })
      }),
      env
    );

    expect(reuse.status).toBe(409);
    await expect(reuse.json()).resolves.toMatchObject({ error: "upload_token_already_used" });
  });

  it("reserves the one-time token before running the AI security scan", async () => {
    const { env, tokens } = fakeEnv();
    const tokenResponse = await createToken(env);
    const tokenBody = (await tokenResponse.json()) as { uploadToken: { id: string; token: string; uploadUrl: string } };
    const aiEnv = {
      ...env,
      OLLAMA_API_KEY: "ollama_test_key",
      OLLAMA_API_BASE_URL: "https://ollama.example/api",
      OLLAMA_SECURITY_MODEL: "deepseek-v4-pro:cloud"
    } as unknown as Env;
    let usedAtDuringAiScan: string | null | undefined;
    const fetchMock = vi.fn(async () => {
      usedAtDuringAiScan = tokens.get(tokenBody.uploadToken.id)?.used_at;
      return Response.json({ message: { content: '{"risk":"ok","findings":[]}' } });
    });
    vi.stubGlobal("fetch", fetchMock);

    const upload = await createApiApp().fetch(
      new Request(tokenBody.uploadToken.uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenBody.uploadToken.token}` },
        body: JSON.stringify({ html: "<!doctype html><html><body>Uploaded by AI</body></html>" })
      }),
      aiEnv
    );

    expect(upload.status).toBe(201);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(usedAtDuringAiScan).not.toBeNull();
    expect(tokens.get(tokenBody.uploadToken.id)?.used_at).not.toBeNull();
  });

  it("does not let agent uploads override security-review warnings", async () => {
    const { env, tokens, sites, revisions, objects } = fakeEnv();
    const tokenResponse = await createToken(env);
    const tokenBody = (await tokenResponse.json()) as { uploadToken: { id: string; token: string; uploadUrl: string } };

    const blocked = await createApiApp().fetch(
      new Request(tokenBody.uploadToken.uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenBody.uploadToken.token}` },
        body: JSON.stringify({
          html: '<!doctype html><html><head><script src="https://evil.example/app.js"></script></head><body>AI upload</body></html>',
          securityOverrideAccepted: true
        })
      }),
      env
    );

    expect(blocked.status).toBe(409);
    await expect(blocked.json()).resolves.toMatchObject({
      error: "security_review_warning",
      details: {
        warnings: expect.arrayContaining(["external_script"]),
        canOverride: false
      }
    });
    expect(tokens.get(tokenBody.uploadToken.id)?.used_at).not.toBeNull();
    expect(sites.size).toBe(0);
    expect(revisions.size).toBe(0);
    expect(objects.size).toBe(0);

    const reuse = await createApiApp().fetch(
      new Request(tokenBody.uploadToken.uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenBody.uploadToken.token}` },
        body: JSON.stringify({ html: "<!doctype html><html><body>Second</body></html>" })
      }),
      env
    );

    expect(reuse.status).toBe(409);
    await expect(reuse.json()).resolves.toMatchObject({ error: "upload_token_already_used" });
  });

  it("lets an agent check one-time upload status before and after upload", async () => {
    const { env } = fakeEnv();
    const tokenResponse = await createToken(env);
    const tokenBody = (await tokenResponse.json()) as { uploadToken: { id: string; token: string; statusUrl: string; uploadUrl: string } };

    const readyStatus = await createApiApp().fetch(
      new Request(tokenBody.uploadToken.statusUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${tokenBody.uploadToken.token}` }
      }),
      env
    );
    await expect(readyStatus.json()).resolves.toMatchObject({
      uploadToken: {
        id: tokenBody.uploadToken.id,
        status: "ready",
        site: null
      }
    });

    const upload = await createApiApp().fetch(
      new Request(tokenBody.uploadToken.uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenBody.uploadToken.token}` },
        body: JSON.stringify({ html: "<!doctype html><html><body>Status check</body></html>" })
      }),
      env
    );
    expect(upload.status).toBe(201);

    const usedStatus = await createApiApp().fetch(
      new Request(tokenBody.uploadToken.statusUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${tokenBody.uploadToken.token}` }
      }),
      env
    );
    await expect(usedStatus.json()).resolves.toMatchObject({
      uploadToken: {
        status: "used",
        site: { previewUrl: "https://ai-upload.giga-site.com/" }
      }
    });
  });

  it("rejects expired or revoked tokens on public status checks", async () => {
    const { env, tokens } = fakeEnv();
    const tokenResponse = await createToken(env);
    const tokenBody = (await tokenResponse.json()) as { uploadToken: { id: string; token: string; statusUrl: string } };
    const row = tokens.get(tokenBody.uploadToken.id);
    if (row) row.expires_at = "2000-01-01T00:00:00.000Z";

    const expired = await createApiApp().fetch(
      new Request(tokenBody.uploadToken.statusUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${tokenBody.uploadToken.token}` }
      }),
      env
    );

    expect(expired.status).toBe(410);
    await expect(expired.json()).resolves.toMatchObject({ error: "upload_token_expired" });

    if (row) {
      row.expires_at = "2999-01-01T00:00:00.000Z";
      row.revoked_at = "2026-01-01T00:00:00.000Z";
    }
    const revoked = await createApiApp().fetch(
      new Request(tokenBody.uploadToken.statusUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${tokenBody.uploadToken.token}` }
      }),
      env
    );

    expect(revoked.status).toBe(410);
    await expect(revoked.json()).resolves.toMatchObject({ error: "upload_token_revoked" });
  });

  it("returns agent-readable error details for failed public uploads", async () => {
    const { env } = fakeEnv();
    const tokenResponse = await createToken(env);
    const tokenBody = (await tokenResponse.json()) as { uploadToken: { uploadUrl: string } };

    const wrong = await createApiApp().fetch(
      new Request(tokenBody.uploadToken.uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${["gut", "wrong", "exampleUploadKey"].join("_")}` },
        body: JSON.stringify({ html: "<!doctype html><html><body>Wrong</body></html>" })
      }),
      env
    );

    expect(wrong.status).toBe(401);
    await expect(wrong.json()).resolves.toMatchObject({
      error: "upload_token_invalid",
      details: {
        agentMessage: expect.stringContaining("Authorization: Bearer"),
        nextAction: expect.stringContaining("Token付き依頼文")
      }
    });
  });

  it("rejects expired or wrong upload tokens before creating files", async () => {
    const { env, tokens, objects } = fakeEnv();
    const tokenResponse = await createToken(env);
    const tokenBody = (await tokenResponse.json()) as { uploadToken: { id: string; token: string; uploadUrl: string } };
    const row = tokens.get(tokenBody.uploadToken.id);
    if (row) row.expires_at = "2000-01-01T00:00:00.000Z";

    const expired = await createApiApp().fetch(
      new Request(tokenBody.uploadToken.uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenBody.uploadToken.token}` },
        body: JSON.stringify({ html: "<!doctype html><html><body>Expired</body></html>" })
      }),
      env
    );

    expect(expired.status).toBe(410);
    await expect(expired.json()).resolves.toMatchObject({ error: "upload_token_expired" });

    if (row) row.expires_at = "2999-01-01T00:00:00.000Z";
    const wrong = await createApiApp().fetch(
      new Request(tokenBody.uploadToken.uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${["gut", "wrong", "exampleUploadKey"].join("_")}` },
        body: JSON.stringify({ html: "<!doctype html><html><body>Wrong</body></html>" })
      }),
      env
    );

    expect(wrong.status).toBe(401);
    await expect(wrong.json()).resolves.toMatchObject({ error: "upload_token_invalid" });
    expect(objects.size).toBe(0);
  });
});
