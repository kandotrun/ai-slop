import { describe, expect, it } from "vitest";
import { createApiApp } from "../src/worker/api";

interface FakeUserRow {
  id: string;
  email: string;
  name: string;
  image: string | null;
  email_verified: number;
  created_at: string;
  updated_at: string;
}

interface FakeChallengeRow {
  id: string;
  email: string;
  code_hash: string;
  attempts: number;
  expires_at: string;
  consumed_at: string | null;
  created_at: string;
}

interface FakeSessionRow {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

interface FakeSiteRow {
  id: string;
  owner_user_id: string;
  slug: string;
  title: string;
  status: string;
  auth_mode: string;
  password_hash: string | null;
  allowed_email_domains: string;
  indexing_enabled: number;
  expires_at: string | null;
  current_revision_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

function makeStatement<TState>(sql: string, state: TState, handler: (sql: string, state: TState, bound: unknown[], op: "first" | "all" | "run") => unknown): D1PreparedStatement {
  let bound: unknown[] = [];
  const statement = {
    bind: (...values: unknown[]) => {
      bound = values;
      return statement;
    },
    first: async <T = unknown>() => handler(sql, state, bound, "first") as T,
    all: async <T = unknown>() => handler(sql, state, bound, "all") as unknown as D1Result<T>,
    run: async () => handler(sql, state, bound, "run") as D1Result
  } as unknown as D1PreparedStatement;
  return statement;
}

function fakeD1() {
  const state = {
    users: new Map<string, FakeUserRow>(),
    challenges: new Map<string, FakeChallengeRow>(),
    sessions: new Map<string, FakeSessionRow>(),
    sites: new Map<string, FakeSiteRow>()
  };

  state.sites.set("site-a", {
    id: "site-a",
    owner_user_id: "user-a",
    slug: "owned-site",
    title: "Owned Site",
    status: "active",
    auth_mode: "random",
    password_hash: null,
    allowed_email_domains: "[]",
    indexing_enabled: 0,
    expires_at: null,
    current_revision_id: null,
    created_at: "2026-06-19T00:00:00.000Z",
    updated_at: "2026-06-19T00:00:00.000Z",
    deleted_at: null
  });
  state.sites.set("site-b", { ...state.sites.get("site-a")!, id: "site-b", owner_user_id: "user-b", slug: "other-site", title: "Other Site" });

  const db = {
    prepare: (sql: string) => makeStatement(sql, state, (statementSql, current, bound, op) => {
      if (statementSql.includes("SELECT COUNT(*) AS total FROM app_email_otp_challenges")) {
        const email = String(bound[0]);
        const now = String(bound[1]);
        return { total: [...current.challenges.values()].filter((challenge) => challenge.email === email && !challenge.consumed_at && challenge.expires_at > now).length };
      }
      if (statementSql.includes("SELECT created_at FROM app_email_otp_challenges")) {
        const email = String(bound[0]);
        return [...current.challenges.values()]
          .filter((challenge) => challenge.email === email)
          .sort((left, right) => right.created_at.localeCompare(left.created_at))[0] ?? null;
      }
      if (statementSql.includes("SELECT COALESCE(SUM(attempts), 0) AS total")) {
        const email = String(bound[0]);
        const now = String(bound[1]);
        return { total: [...current.challenges.values()].filter((challenge) => challenge.email === email && !challenge.consumed_at && challenge.expires_at > now).reduce((sum, challenge) => sum + challenge.attempts, 0) };
      }
      if (statementSql.includes("INSERT INTO app_email_otp_challenges")) {
        const email = String(bound[1]);
        const createdAt = String(bound[4]);
        if (statementSql.includes("SELECT ?, ?, ?")) {
          const cooldownAfter = String(bound[6]);
          const activeNow = String(bound[8]);
          const maxActive = Number(bound[9]);
          const latestBlocked = [...current.challenges.values()].some((challenge) => challenge.email === email && challenge.created_at > cooldownAfter);
          const activeCount = [...current.challenges.values()].filter((challenge) => challenge.email === email && !challenge.consumed_at && challenge.expires_at > activeNow).length;
          if (latestBlocked || activeCount >= maxActive) {
            return { success: true, meta: { changes: 0 } };
          }
        }
        current.challenges.set(String(bound[0]), {
          id: String(bound[0]),
          email,
          code_hash: String(bound[2]),
          attempts: 0,
          expires_at: String(bound[3]),
          consumed_at: null,
          created_at: createdAt
        });
        return { success: true, meta: { changes: 1 } };
      }
      if (statementSql.includes("SELECT * FROM app_email_otp_challenges WHERE id = ?")) {
        return current.challenges.get(String(bound[0])) ?? null;
      }
      if (statementSql.includes("UPDATE app_email_otp_challenges") && statementSql.includes("SET consumed_at")) {
        const challenge = current.challenges.get(String(bound[1]));
        if (!challenge) return { success: true, meta: { changes: 0 } };
        if (bound.length > 2) {
          const email = String(bound[2]);
          const now = String(bound[3]);
          const maxAttempts = Number(bound[4]);
          const attemptTotal = [...current.challenges.values()]
            .filter((item) => item.email === email && !item.consumed_at && item.expires_at > now)
            .reduce((sum, item) => sum + item.attempts, 0);
          if (challenge.email !== email || challenge.consumed_at || challenge.expires_at <= now || challenge.attempts >= maxAttempts || attemptTotal >= maxAttempts) {
            return { success: true, meta: { changes: 0 } };
          }
        }
        challenge.consumed_at = String(bound[0]);
        return { success: true, meta: { changes: 1 } };
      }
      if (statementSql.includes("UPDATE app_email_otp_challenges") && statementSql.includes("SET attempts = attempts + 1")) {
        const challenge = current.challenges.get(String(bound[0]));
        if (!challenge) return { success: true, meta: { changes: 0 } };
        if (bound.length > 1) {
          const email = String(bound[1]);
          const now = String(bound[2]);
          const maxAttempts = Number(bound[3]);
          const attemptTotal = [...current.challenges.values()]
            .filter((item) => item.email === email && !item.consumed_at && item.expires_at > now)
            .reduce((sum, item) => sum + item.attempts, 0);
          if (challenge.email !== email || challenge.consumed_at || challenge.expires_at <= now || challenge.attempts >= maxAttempts || attemptTotal >= maxAttempts) {
            return { success: true, meta: { changes: 0 } };
          }
        }
        challenge.attempts += 1;
        return { success: true, meta: { changes: 1 } };
      }
      if (statementSql.includes("SELECT * FROM users WHERE email = ?")) {
        return [...current.users.values()].find((user) => user.email === String(bound[0])) ?? null;
      }
      if (statementSql.includes("INSERT INTO users")) {
        current.users.set(String(bound[0]), {
          id: String(bound[0]),
          email: String(bound[1]),
          name: String(bound[2]),
          image: null,
          email_verified: 1,
          created_at: String(bound[3]),
          updated_at: String(bound[4])
        });
        return { success: true, meta: { changes: 1 } };
      }
      if (statementSql.includes("UPDATE users SET email_verified")) {
        const user = current.users.get(String(bound[1]));
        if (user) user.email_verified = 1;
        return { success: true, meta: { changes: user ? 1 : 0 } };
      }
      if (statementSql.includes("INSERT INTO auth_sessions")) {
        current.sessions.set(String(bound[1]), {
          id: String(bound[0]),
          user_id: String(bound[1]),
          token: String(bound[2]),
          expires_at: String(bound[3]),
          ip_address: null,
          user_agent: null,
          created_at: String(bound[4]),
          updated_at: String(bound[5])
        });
        return { success: true, meta: { changes: 1 } };
      }
      if (statementSql.includes("FROM auth_sessions sess") && op === "first") {
        const session = [...current.sessions.values()].find((item) => item.token === String(bound[0]));
        const user = session ? current.users.get(session.user_id) : null;
        return session && user ? { ...session, user_id: user.id, email: user.email, name: user.name, image: user.image } : null;
      }
      if (statementSql.includes("DELETE FROM auth_sessions WHERE token = ?")) {
        const session = [...current.sessions.values()].find((item) => item.token === String(bound[0]));
        if (session) current.sessions.delete(session.user_id);
        return { success: true, meta: { changes: session ? 1 : 0 } };
      }
      if (statementSql.includes("FROM sites s WHERE s.owner_user_id = ?") && op === "all") {
        return {
          results: [...current.sites.values()]
            .filter((site) => site.owner_user_id === String(bound[0]) && !site.deleted_at)
            .map((site) => ({ ...site, views: 0, auth_views: 0, unique_visitors: 0, total_bytes: 0, last_seen_at: null })),
          success: true,
          meta: { changes: 0 }
        };
      }
      if (statementSql.includes("COUNT(*) FROM sites WHERE owner_user_id = ?")) {
        const count = [...current.sites.values()].filter((site) => site.owner_user_id === String(bound[0]) && !site.deleted_at).length;
        return { totalSites: count, activeSites: count, monthlyViews: 0, monthlyAuthViews: 0, totalBytes: 0 };
      }
      return op === "all" ? { results: [], success: true, meta: { changes: 0 } } : op === "first" ? null : { success: true, meta: { changes: 0 } };
    }),
    batch: async () => [],
    exec: async () => ({ count: 0, duration: 0 })
  } as unknown as D1Database;

  return { db, state };
}

function env(db: D1Database, sentEmails: string[] = []): Env {
  return {
    DB: db,
    APP_HOST: "giga-site.com",
    APP_BASE_PATH: "/app",
    PREVIEW_HOST_SUFFIX: ".giga-site.com",
    EMAIL_FROM: "no-reply@giga-site.com",
    EMAIL: {
      send: async (message: { to: string; text?: string; html?: string }) => {
        sentEmails.push(`${message.to}\n${message.text ?? ""}\n${message.html ?? ""}`);
        return { messageId: "msg_test" };
      }
    },
    MAX_HTML_BYTES: "10485760",
    MAX_UPLOAD_FILES: "200",
    SESSION_TTL_SECONDS: "86400"
  } as unknown as Env;
}

function extractOtp(emailBody: string): string {
  const match = emailBody.match(/\b\d{6}\b/);
  if (!match) throw new Error("otp_not_found");
  return match[0];
}

describe("public email OTP auth", () => {
  it("keeps health public but rejects management APIs without a user session", async () => {
    const { db } = fakeD1();
    const app = createApiApp();

    const health = await app.fetch(new Request("https://giga-site.com/api/health"), env(db));
    expect(health.status).toBe(200);

    const sites = await app.fetch(new Request("https://giga-site.com/api/sites"), env(db));
    expect(sites.status).toBe(401);
    await expect(sites.json()).resolves.toMatchObject({ error: "session_required" });
  });

  it("lets any email request a one-time code and verify it into a session", async () => {
    const sentEmails: string[] = [];
    const { db, state } = fakeD1();
    const app = createApiApp();

    const requestCode = await app.fetch(
      new Request("https://giga-site.com/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: " New.User@Example.com " })
      }),
      env(db, sentEmails)
    );
    expect(requestCode.status).toBe(200);
    const requested = (await requestCode.json()) as { challengeId: string; expiresAt: string };
    expect(requested.challengeId).toBeTruthy();
    expect(sentEmails).toHaveLength(1);
    expect([...state.challenges.values()][0].email).toBe("new.user@example.com");
    expect([...state.challenges.values()][0].code_hash).not.toContain(extractOtp(sentEmails[0]));

    const verify = await app.fetch(
      new Request("https://giga-site.com/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: requested.challengeId, email: "new.user@example.com", code: extractOtp(sentEmails[0]) })
      }),
      env(db, sentEmails)
    );
    expect(verify.status).toBe(200);
    expect(verify.headers.get("Set-Cookie")).toContain("giga_site_session=");
    await expect(verify.json()).resolves.toMatchObject({ user: { email: "new.user@example.com" } });

    const me = await app.fetch(new Request("https://giga-site.com/api/me", { headers: { Cookie: verify.headers.get("Set-Cookie") ?? "" } }), env(db, sentEmails));
    expect(me.status).toBe(200);
    await expect(me.json()).resolves.toMatchObject({ user: { email: "new.user@example.com" } });
  });

  it("throttles repeated code requests for the same email", async () => {
    const sentEmails: string[] = [];
    const { db, state } = fakeD1();
    const app = createApiApp();
    const request = () =>
      app.fetch(
        new Request("https://giga-site.com/api/auth/request-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "victim@example.com" })
        }),
        env(db, sentEmails)
      );

    const first = await request();
    expect(first.status).toBe(200);

    const second = await request();
    expect(second.status).toBe(429);
    await expect(second.json()).resolves.toMatchObject({ error: "code_request_cooldown" });
    expect(state.challenges.size).toBe(1);
    expect(sentEmails).toHaveLength(1);
  });

  it("keeps concurrent code requests for one email to one stored challenge", async () => {
    const sentEmails: string[] = [];
    const { db, state } = fakeD1();
    const app = createApiApp();
    const request = () =>
      app.fetch(
        new Request("https://giga-site.com/api/auth/request-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "race@example.com" })
        }),
        env(db, sentEmails)
      );

    const responses: Response[] = await Promise.all([request(), request()]);
    const statuses = responses.map((response) => response.status).sort();

    expect(statuses).toEqual([200, 429]);
    expect(state.challenges.size).toBe(1);
    expect(sentEmails).toHaveLength(1);
  });

  it("caps concurrent wrong OTP verifications atomically", async () => {
    const sentEmails: string[] = [];
    const { db, state } = fakeD1();
    const app = createApiApp();
    const requestCode = await app.fetch(
      new Request("https://giga-site.com/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "verify-race@example.com" })
      }),
      env(db, sentEmails)
    );
    expect(requestCode.status).toBe(200);
    const body = (await requestCode.json()) as { challengeId: string };
    const wrongCode = extractOtp(sentEmails[0]) === "000000" ? "000001" : "000000";
    const verifyWrong = () =>
      app.fetch(
        new Request("https://giga-site.com/api/auth/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ challengeId: body.challengeId, email: "verify-race@example.com", code: wrongCode })
        }),
        env(db, sentEmails)
      );

    const responses: Response[] = await Promise.all([verifyWrong(), verifyWrong(), verifyWrong(), verifyWrong(), verifyWrong(), verifyWrong()]);
    const statuses = responses.map((response) => response.status).sort();

    expect(statuses).toEqual([400, 400, 400, 400, 400, 429]);
    expect(state.challenges.get(body.challengeId)?.attempts).toBe(5);
  });

  it("keeps failed OTP attempts scoped to the email instead of resetting on new challenges", async () => {
    const sentEmails: string[] = [];
    const { db, state } = fakeD1();
    const app = createApiApp();

    const first = await app.fetch(
      new Request("https://giga-site.com/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "victim@example.com" })
      }),
      env(db, sentEmails)
    );
    expect(first.status).toBe(200);
    const firstBody = (await first.json()) as { challengeId: string };

    const wrongCode = extractOtp(sentEmails[0]) === "000000" ? "000001" : "000000";
    for (let index = 0; index < 5; index += 1) {
      const response = await app.fetch(
        new Request("https://giga-site.com/api/auth/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ challengeId: firstBody.challengeId, email: "victim@example.com", code: wrongCode })
        }),
        env(db, sentEmails)
      );
      expect(response.status).toBe(400);
    }

    const firstChallenge = state.challenges.get(firstBody.challengeId);
    expect(firstChallenge).toBeTruthy();
    if (!firstChallenge) throw new Error("challenge_not_found");
    firstChallenge.created_at = "2026-06-19T00:00:00.000Z";

    const second = await app.fetch(
      new Request("https://giga-site.com/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "victim@example.com" })
      }),
      env(db, sentEmails)
    );
    expect(second.status).toBe(200);
    const secondBody = (await second.json()) as { challengeId: string };

    const resetAttempt = await app.fetch(
      new Request("https://giga-site.com/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: secondBody.challengeId, email: "victim@example.com", code: extractOtp(sentEmails[1]) })
      }),
      env(db, sentEmails)
    );
    expect(resetAttempt.status).toBe(429);
    await expect(resetAttempt.json()).resolves.toMatchObject({ error: "too_many_attempts" });
  });

  it("lists only the signed-in user's sites", async () => {
    const { db } = fakeD1();
    const app = createApiApp({
      sessionResolver: async () => ({
        user: { id: "user-a", email: "a@example.com", name: "a@example.com" },
        session: { id: "session-a", userId: "user-a", token: "token", expiresAt: new Date(), createdAt: new Date(), updatedAt: new Date() }
      })
    });

    const response = await app.fetch(new Request("https://giga-site.com/api/sites"), env(db));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ sites: [{ id: "site-a", slug: "owned-site" }] });
  });
});
