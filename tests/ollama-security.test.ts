import { afterEach, describe, expect, it, vi } from "vitest";
import { createApiApp } from "../src/worker/api";
import { scanUploadWithAiSecurity, warningFromAssessment } from "../src/worker/security-ai";

function revisionEnv(captured: { sql: string; bound: unknown[] }[] = []): Env {
  const siteRow = {
    id: "site_test",
    owner_user_id: "owner_test",
    slug: "demo",
    title: "Demo",
    status: "active",
    auth_mode: "password",
    password_hash: "hash",
    allowed_email_domains: "[]",
    allowed_emails: "[]",
    indexing_enabled: 0,
    hide_branding: 0,
    tool: null,
    expires_at: null,
    current_revision_id: null,
    created_at: "2026-06-19T00:00:00.000Z",
    updated_at: "2026-06-19T00:00:00.000Z",
    deleted_at: null
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
          if (sql.includes("SELECT * FROM sites WHERE id = ? AND owner_user_id = ?")) {
            return siteRow as T;
          }
          return null as T;
        },
        async run() {
          captured.push({ sql, bound });
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
    async put() {
      return null;
    }
  } as unknown as R2Bucket;

  return {
    DB: db,
    HTML_BUCKET: bucket,
    APP_HOST: "giga-site.com",
    APP_BASE_PATH: "/app",
    PREVIEW_HOST_SUFFIX: ".giga-site.com",
    OLLAMA_API_KEY: "ollama_test_key",
    OLLAMA_API_BASE_URL: "https://ollama.com/api",
    OLLAMA_SECURITY_MODEL: "deepseek-v4-pro:cloud",
    MAX_HTML_BYTES: "10485760",
    MAX_UPLOAD_FILES: "200"
  } as unknown as Env;
}

function authenticatedApp() {
  return createApiApp({
    sessionResolver: async () => ({
      user: { id: "owner_test", email: "owner@example.test", name: "Owner" },
      session: { id: "s", userId: "owner_test", token: "t", expiresAt: new Date(Date.now() + 60_000), createdAt: new Date(), updatedAt: new Date() }
    })
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Ollama DeepSeek pre-publish security scan", () => {
  it("blocks publication when the model returns high risk until the user explicitly overrides", async () => {
    const captured: { sql: string; bound: unknown[] }[] = [];
    const fetchMock = vi.fn(async () => Response.json({ message: { content: '{"risk":"high","findings":[{"category":"credential_collection"}]}' } }));
    vi.stubGlobal("fetch", fetchMock);

    const rawSecret = ["sk", "test".repeat(12)].join("-");
    const response = await authenticatedApp().fetch(
      new Request("https://giga-site.com/api/sites/site_test/revisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: `<!doctype html><html><script>const apiKey = "${rawSecret}";</script><body>Demo</body></html>` })
      }),
      revisionEnv(captured)
    );

    const body = (await response.json()) as { error: string; details: { warnings: string[]; canOverride: boolean; overrideField: string } };
    expect(response.status).toBe(409);
    expect(body.error).toBe("security_review_warning");
    expect(body.details.warnings).toEqual(expect.arrayContaining(["possible_secret", "ai_security_high"]));
    expect(body.details.canOverride).toBe(true);
    expect(body.details.overrideField).toBe("securityOverrideAccepted");
    expect(captured.some((item) => item.sql.includes("INSERT INTO revisions"))).toBe(false);

    const call = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const [request, init] = call;
    expect(request).toBe("https://ollama.com/api/chat");
    expect(String(init.headers)).not.toContain("ollama_test_key");
    const payload = JSON.parse(String(init.body)) as { model: string; messages: { content: string }[] };
    expect(payload.model).toBe("deepseek-v4-pro:cloud");
    expect(JSON.stringify(payload)).not.toContain(rawSecret);
    expect(JSON.stringify(payload)).toContain("[REDACTED_POSSIBLE_SECRET]");
  });

  it("persists high risk warnings when the user confirms override", async () => {
    const captured: { sql: string; bound: unknown[] }[] = [];
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ message: { content: '{"risk":"high","findings":[]}' } })));

    const response = await authenticatedApp().fetch(
      new Request("https://giga-site.com/api/sites/site_test/revisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: '<!doctype html><html><body><form action="https://evil.example/login"></form></body></html>',
          securityOverrideAccepted: true
        })
      }),
      revisionEnv(captured)
    );

    const body = (await response.json()) as { revision: { warnings: string[] } };
    expect(response.status).toBe(201);
    expect(body.revision.warnings).toEqual(expect.arrayContaining(["external_form_action", "ai_security_high"]));

    const insert = captured.find((item) => item.sql.includes("INSERT INTO revisions"));
    expect(insert?.bound[7]).toContain("ai_security_high");
  });

  it("returns a visible warning when no Ollama API key is configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(
      scanUploadWithAiSecurity(
        {},
        {
          entryPath: "index.html",
          entryHtml: "<!doctype html><html><body>OK</body></html>",
          files: [{ path: "index.html", contentType: "text/html", byteLength: 42 }],
          localWarnings: []
        }
      )
    ).resolves.toEqual(["ai_security_review_unavailable"]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uses a non-blocking warning if Ollama Cloud is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("bad_gateway", { status: 502 })));
    await expect(
      scanUploadWithAiSecurity(
        { OLLAMA_API_KEY: "ollama_test_key" },
        {
          entryPath: "index.html",
          entryHtml: "<!doctype html><html><body>OK</body></html>",
          files: [{ path: "index.html", contentType: "text/html", byteLength: 42 }],
          localWarnings: []
        }
      )
    ).resolves.toEqual(["ai_security_review_unavailable"]);
  });

  it("parses compact JSON assessments", () => {
    expect(warningFromAssessment('{"risk":"ok","findings":[]}')).toEqual([]);
    expect(warningFromAssessment('{"risk":"medium","findings":[]}')).toEqual(["ai_security_medium"]);
    expect(warningFromAssessment('{"risk":"high","findings":[]}')).toEqual(["ai_security_high"]);
  });
});
