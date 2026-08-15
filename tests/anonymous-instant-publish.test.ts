import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createApiApp } from "../src/worker/api";
import { ANON_OWNER_USER_ID } from "../src/shared/anon-publish";

const baseEnv = {
  APP_HOST: "giga-site.com",
  APP_BASE_PATH: "/app",
  PREVIEW_HOST_SUFFIX: ".giga-site.com"
} as unknown as Env;

function sessionResolver(userId: string) {
  return async () => ({
    user: { id: userId, email: "u@example.com", name: "U" },
    session: {
      id: "session_test",
      userId,
      token: "token_test",
      expiresAt: new Date(Date.now() + 60_000),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
}

function claimDb(siteOwner: string | null, options: { activeSiteCount?: number } = {}) {
  const captured: { update: unknown[] } = { update: [] };
  const db = {
    prepare(sql: string) {
      return {
        bind(...args: unknown[]) {
          return {
            async first() {
              if (sql.includes("FROM sites WHERE claim_token_hash")) {
                return siteOwner ? { id: "site_1", owner_user_id: siteOwner } : null;
              }
              if (sql.includes("COUNT(*) AS activeSiteCount")) {
                return { activeSiteCount: options.activeSiteCount ?? 0 };
              }
              return null;
            },
            async run() {
              if (sql.startsWith("UPDATE sites SET owner_user_id")) {
                captured.update = args;
              }
              return { success: true, meta: { changes: 1 } };
            }
          };
        }
      };
    }
  } as unknown as D1Database;
  return { db, captured };
}

describe("anonymous instant publish + claim", () => {
  it("requires a session for claim", async () => {
    const res = await createApiApp({ sessionResolver: async () => null }).fetch(
      new Request("https://giga-site.com/api/sites/claim", { method: "POST", body: "{}" }),
      baseEnv
    );
    expect(res.status).toBe(401);
  });

  it("claims an anonymous site to the logged-in user", async () => {
    const { db, captured } = claimDb(ANON_OWNER_USER_ID);
    const app = createApiApp({ sessionResolver: sessionResolver("user_9") });
    const res = await app.fetch(
      new Request("https://giga-site.com/api/sites/claim", { method: "POST", body: JSON.stringify({ claimToken: "tok" }) }),
      { ...baseEnv, DB: db } as unknown as Env
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ siteId: "site_1" });
    expect(captured.update[0]).toBe("user_9");
  });

  it("spec: claim does not bypass the destination owner's site quota", async () => {
    const { db, captured } = claimDb(ANON_OWNER_USER_ID, { activeSiteCount: 1 });
    const app = createApiApp({ sessionResolver: sessionResolver("free_user") });
    const res = await app.fetch(
      new Request("https://giga-site.com/api/sites/claim", { method: "POST", body: JSON.stringify({ claimToken: "tok" }) }),
      { ...baseEnv, DB: db } as unknown as Env
    );
    const body = (await res.json()) as { error: string; details?: { planId?: string; siteLimit?: number; activeSites?: number } };

    expect(res.status).toBe(402);
    expect(body.error).toBe("free_plan_site_limit_exceeded");
    expect(body.details).toMatchObject({ planId: "free", siteLimit: 1, activeSites: 1 });
    expect(captured.update).toEqual([]);
  });

  it("rejects claiming a site already owned by a real user (409)", async () => {
    const { db } = claimDb("someone_else");
    const app = createApiApp({ sessionResolver: sessionResolver("user_9") });
    const res = await app.fetch(
      new Request("https://giga-site.com/api/sites/claim", { method: "POST", body: JSON.stringify({ claimToken: "tok" }) }),
      { ...baseEnv, DB: db } as unknown as Env
    );
    expect(res.status).toBe(409);
  });

  it("returns 404 for an unknown/used claim token", async () => {
    const { db } = claimDb(null);
    const app = createApiApp({ sessionResolver: sessionResolver("user_9") });
    const res = await app.fetch(
      new Request("https://giga-site.com/api/sites/claim", { method: "POST", body: JSON.stringify({ claimToken: "missing" }) }),
      { ...baseEnv, DB: db } as unknown as Env
    );
    expect(res.status).toBe(404);
  });

  it("publish endpoint is public and creates anonymous, noindex, 7-day sites (source contract)", () => {
    const api = readFileSync("src/worker/api.ts", "utf8");
    expect(api).toContain('"/api/public/publish"');
    expect(api).toMatch(/isPublicApiPath[\s\S]{0,400}\/api\/public\/publish/);
    expect(api).toContain("ANON_OWNER_USER_ID");
    expect(api).toContain("normalizePublicPublishAuthInput");
    expect(api).toContain("publicAuth.authMode");
    expect(api).toContain("publicAuth.passwordHash");
    expect(api).toContain("validateRevisionUpload");
    expect(api).toContain("reserveAnonymousPublishAttempt");
    expect(api).toContain("ANON_PUBLISH_TTL_DAYS");
  });

  it("migration seeds the anon user and adds claim columns", () => {
    const sql = readFileSync("migrations/0012_anonymous_instant_publish.sql", "utf8");
    expect(sql).toContain("'anon-public'");
    expect(sql).toContain("claim_token_hash");
    expect(sql).toContain("ip_hash");
  });

  it("landing page publishes anonymously and carries the claim token to the app", () => {
    const lp = readFileSync("src/client/LandingPage.tsx", "utf8");
    expect(lp).toContain("publishAnonymous");
    expect(lp).toContain("PENDING_CLAIM_STORAGE_KEY");
    expect(lp).toContain("lp-drop");
    expect(lp).not.toContain("#claim=");

    const admin = readFileSync("src/client/admin/AdminApp.tsx", "utf8");
    expect(admin).toContain("claimSite");
    expect(admin).toContain("readPendingClaim");
    expect(admin).not.toContain("pendingClaimFromHash");
    expect(admin).not.toContain("#claim=");
  });

  it("lets anonymous users add password-only protection after the URL is issued", async () => {
    const captured: { update: unknown[] } = { update: [] };
    const db = {
      prepare(sql: string) {
        return {
          bind(...args: unknown[]) {
            return {
              async run() {
                if (sql.startsWith("UPDATE sites SET auth_mode = 'password'")) {
                  captured.update = args;
                }
                return { success: true, meta: { changes: 1 } };
              }
            };
          }
        };
      }
    } as unknown as D1Database;
    const app = createApiApp({ sessionResolver: async () => null });
    const res = await app.fetch(
      new Request("https://giga-site.com/api/public/publish-password", {
        method: "POST",
        body: JSON.stringify({ siteId: "site_1", claimToken: "tok", password: "share-pass-123" })
      }),
      { ...baseEnv, DB: db } as unknown as Env
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ siteId: "site_1", authMode: "password" });
    expect(captured.update[0]).toMatch(/^pbkdf2\$/);
    expect(captured.update[2]).toBe("site_1");
    expect(captured.update[3]).toBe(ANON_OWNER_USER_ID);
  });

  it("shows the password setting form only after anonymous instant publish succeeds", () => {
    const clientApi = readFileSync("src/client/admin/api.ts", "utf8");
    expect(clientApi).toContain("setAnonymousPublishPassword");
    expect(clientApi).toContain('"/api/public/publish-password"');

    const lp = readFileSync("src/client/LandingPage.tsx", "utf8");
    expect(lp).not.toContain("passwordEnabled");
    expect(lp).not.toContain("lp-password-option");
    expect(lp).toContain("lp-modal-password");
    expect(lp).toContain("URLにパスワードをかける");
    expect(lp).toContain("setAnonymousPublishPassword");
  });

  it("drop zone keeps a stable size (width and height) while publishing", () => {
    const css = readFileSync("src/client/styles.css", "utf8");
    const block = css.slice(css.indexOf(".lp-drop {"));
    const rule = block.slice(0, block.indexOf("}"));
    // height stays fixed so it doesn't shrink when content becomes "公開中…"
    expect(rule).toContain("min-height: 208px");
    // width fills the column up to its max so it doesn't shrink to the short label
    expect(rule).toContain("width: 100%");
    expect(rule).toContain("max-width: 620px");
  });

  it("lets the user confirm-and-publish flagged HTML, and hardens claim/rate-limit/token", () => {
    const api = readFileSync("src/worker/api.ts", "utf8");
    // override is forwarded so a user-confirmed publish can proceed
    expect(api).toContain("securityOverrideAccepted: body.securityOverrideAccepted");
    // only the unspoofable Cloudflare IP header is trusted
    expect(api).toContain('c.req.raw.headers.get("cf-connecting-ip") ?? "unknown"');
    // claim verifies the row actually changed (no silent TOCTOU success)
    expect(api).toContain("updateResult.meta.changes");
    // 256-bit claim token
    expect(api).toContain("crypto.getRandomValues(new Uint8Array(32))");

    const lp = readFileSync("src/client/LandingPage.tsx", "utf8");
    expect(lp).toContain("内容を理解して公開する");
    expect(lp).toContain("handleInstantPublish(file, true)");
    expect(lp).toContain("PENDING_CLAIM_TTL_MS");
  });
});
