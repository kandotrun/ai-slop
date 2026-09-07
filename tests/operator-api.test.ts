import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createApiApp } from "../src/worker/api";

import type { OperatorPage, OperatorSite, OperatorSummary, OperatorUser } from "../src/shared/operator";

const NOW = "2026-02-10T03:00:00.000Z";
const OLD = "2026-01-01T00:00:00.000Z";
const OPERATOR = "operator@example.com";
const databases: DatabaseSync[] = [];

function fixture() {
  const sqlite = new DatabaseSync(":memory:");
  databases.push(sqlite);
  const migrations = new URL("../migrations/", import.meta.url);
  for (const file of readdirSync(migrations).filter((file) => file.endsWith(".sql")).sort()) {
    sqlite.exec(readFileSync(new URL(file, migrations), "utf8"));
  }
  const queries: string[] = [];
  const db = {
    prepare(sql: string) {
      queries.push(sql);
      const prepared = sqlite.prepare(sql);
      let values: SQLInputValue[] = [];
      const statement = {
        bind(...bound: SQLInputValue[]) { values = bound; return statement; },
        async first() { return prepared.get(...values) ?? null; },
        async all() { return { results: prepared.all(...values), success: true, meta: {} }; },
        async run() { return { success: true, meta: { changes: Number(prepared.run(...values).changes) } }; }
      };
      return statement;
    }
  };
  const env = { DB: db, APP_HOST: "app.example.com", PREVIEW_HOST_SUFFIX: ".preview.example.com", OPERATOR_EMAILS: OPERATOR, OPS_INTERNAL_EMAILS: "", SESSION_TTL_SECONDS: "86400" } as unknown as Env;
  function user(id: string, email: string, createdAt = OLD, verified = 1) {
    sqlite.prepare("INSERT INTO users(id,email,name,email_verified,created_at,updated_at) VALUES (?,?,?,?,?,?)")
      .run(id, email, `Name ${id}`, verified, createdAt, createdAt);
  }
  function session(id: string, expiresAt = "2027-01-01T00:00:00.000Z") {
    const token = `synthetic-session-${id}`;
    sqlite.prepare("INSERT INTO auth_sessions(id,user_id,token,expires_at,created_at,updated_at) VALUES (?,?,?,?,?,?)")
      .run(`session-${id}`, id, createHash("sha256").update(token).digest("hex"), expiresAt, OLD, OLD);
    return `giga_site_session=${token}`;
  }
  function revision(siteId: string, id: string, createdAt: string, files = 2, bytes = 80) {
    sqlite.prepare("INSERT INTO revisions(id,site_id,r2_prefix,file_count,total_bytes,created_at) VALUES (?,?,?,?,?,?)")
      .run(id, siteId, "private-r2-prefix", files, bytes, createdAt);
  }
  function site(id: string, owner: string, createdAt: string, options: { draft?: boolean; deleted?: boolean; expiresAt?: string; slug?: string; title?: string; status?: string } = {}) {
    sqlite.prepare("INSERT INTO sites(id,owner_user_id,slug,title,status,auth_mode,password_hash,claim_token_hash,created_at,updated_at,deleted_at,expires_at) VALUES (?,?,?,?,?,'password','private-password-hash','private-claim-hash',?,?,?,?)")
      .run(id, owner, options.slug ?? id, options.title ?? `Site ${id}`, options.status ?? "active", createdAt, createdAt, options.deleted ? NOW : null, options.expiresAt ?? null);
    if (!options.draft) {
      revision(id, `rev-${id}`, createdAt);
      sqlite.prepare("UPDATE sites SET current_revision_id = ? WHERE id = ?").run(`rev-${id}`, id);
    }
  }
  function view(id: string, siteId: string, createdAt: string, event = "view") {
    sqlite.prepare("INSERT INTO access_events(id,site_id,path,event_type,created_at,ip_hash,user_agent_hash) VALUES (?,?, '/private-path',?,?,'private-ip-hash','private-ua-hash')")
      .run(id, siteId, event, createdAt);
  }
  function subscription(id: string, owner: string, status = "active", live = 1) {
    sqlite.prepare("INSERT INTO billing_subscriptions(id,owner_user_id,status,livemode,stripe_customer_id,created_at,updated_at) VALUES (?,?,?,?,'private-billing-id',?,?)")
      .run(id, owner, status, live, OLD, OLD);
  }
  return { sqlite, queries, env, user, session, site, revision, view, subscription };
}

function request(path: string, cookie?: string, init: RequestInit = {}) {
  return new Request(`https://app.example.com${path}`, { ...init, headers: { ...(cookie ? { Cookie: cookie } : {}), ...init.headers } });
}

function expectPrivate(response: Response) {
  expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  expect(response.headers.get("Vary")?.split(/,\s*/)).toContain("Cookie");
}

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(NOW); });
afterEach(() => { vi.useRealTimers(); for (const db of databases.splice(0)) db.close(); });

describe("operator access", () => {
  describe.each(["%6fps", "o%70s", "%6f%70%73"])("encoded operator prefix %s", (prefix) => {
    it.each(["summary", "sites", "users"])("preserves real-session authorization and read-only caching for %s", async (route) => {
      for (const identity of ["nonoperator", "unverified", "empty-allowlist", "operator", "anonymous", "legacy", "token"] as const) {
        const f = fixture();
        f.user("subject", identity === "nonoperator" ? "other@example.com" : OPERATOR, OLD, identity === "unverified" ? 0 : 1);
        let cookie: string | undefined = f.session("subject");
        if (identity === "anonymous" || identity === "token") cookie = undefined;
        if (identity === "legacy") f.sqlite.prepare("UPDATE auth_sessions SET token = ?").run("synthetic-session-subject");
        const env = { ...f.env, OPERATOR_EMAILS: identity === "empty-allowlist" ? "" : OPERATOR } as unknown as Env;
        f.sqlite.exec("PRAGMA query_only = ON");
        const response = await createApiApp().fetch(request(`/api/${prefix}/${route}`, cookie, identity === "token" ? { headers: { Authorization: "Bearer synthetic-session-subject" } } : {}), env);
        const expected = identity === "operator" ? 200 : ["anonymous", "legacy", "token"].includes(identity) ? 401 : 403;
        expect(response.status, identity).toBe(expected);
        expectPrivate(response);
        expect(f.queries.every((sql) => /^\s*(SELECT|WITH)\b/i.test(sql))).toBe(true);
        if (identity !== "operator") {
          expect(await response.json()).toMatchObject({ error: expected === 401 ? "session_required" : "operator_required" });
          expect(f.queries).toHaveLength(identity === "anonymous" || identity === "token" ? 0 : 1);
        }
      }
    });
  });
  it.each(["summary", "sites", "users", "missing"])("denies anonymous %s without database work and disables caching", async (route) => {
    const f = fixture();
    const response = await createApiApp().fetch(request(`/api/ops/${route}?email=${OPERATOR}`, undefined, { headers: { "X-Operator-Email": OPERATOR } }), f.env);
    expect(response.status).toBe(401);
    expectPrivate(response);
    expect(f.queries).toEqual([]);
  });

  it.each([undefined, "", "   , ", "@example.com", "*.example.com", "another@example.com"])("denies non-allowlisted sessions for configuration %s before aggregate queries", async (allowlist) => {
    const f = fixture();
    f.user("op", OPERATOR);
    const cookie = f.session("op");
    const response = await createApiApp().fetch(request("/api/ops/summary", cookie), { ...f.env, OPERATOR_EMAILS: allowlist } as unknown as Env);
    expect(response.status).toBe(403);
    expectPrivate(response);
    expect(f.queries).toHaveLength(1);
    expect(f.queries[0]).toContain("FROM auth_sessions sess");
  });

  it("denies a real unverified allowlisted user's session", async () => {
    const f = fixture();
    f.user("op", OPERATOR, OLD, 0);
    const response = await createApiApp().fetch(request("/api/ops/summary", f.session("op")), f.env);
    expect(response.status).toBe(403);
    expectPrivate(response);
    expect(f.queries).toHaveLength(1);
  });

  it("ignores forged tokens and expires sessions before authorization", async () => {
    const f = fixture();
    f.user("op", OPERATOR);
    for (const cookie of ["giga_site_session=forged", f.session("op", NOW)]) {
      const response = await createApiApp().fetch(request("/api/ops/summary", cookie), f.env);
      expect(response.status).toBe(401);
      expectPrivate(response);
    }
  });

  it("decorates me using exact normalized verified email and never returns session secrets", async () => {
    const f = fixture();
    f.user("op", OPERATOR);
    const cookie = f.session("op");
    const response = await createApiApp().fetch(request("/api/me", cookie), { ...f.env, OPERATOR_EMAILS: ` Other@Example.com, ${OPERATOR.toUpperCase()} ` } as unknown as Env);
    expect(response.status).toBe(200);
    expectPrivate(response);
    expect(await response.json()).toEqual({ user: { id: "op", email: OPERATOR, name: "Name op", image: null, isOperator: true } });
  });

  it("returns false on me for a same-domain nonoperator and unverified operator", async () => {
    const f = fixture();
    f.user("other", "other@example.com");
    f.user("op", OPERATOR, OLD, 0);
    for (const id of ["other", "op"]) {
      const response = await createApiApp().fetch(request("/api/me", f.session(id)), f.env);
      expectPrivate(response);
      expect(await response.json()).toMatchObject({ user: { isOperator: false } });
    }
  });

  it("decorates a successful real OTP verification immediately", async () => {
    const f = fixture();
    const code = "123456";
    const challenge = "synthetic-challenge";
    f.sqlite.prepare("INSERT INTO app_email_otp_challenges(id,email,code_hash,attempts,expires_at,created_at) VALUES (?,?,?,0,?,?)")
      .run(challenge, OPERATOR, createHash("sha256").update(`${challenge}:${OPERATOR}:${code}`).digest("hex"), "2026-02-10T03:10:00.000Z", NOW);
    const response = await createApiApp().fetch(request("/api/auth/verify-code", undefined, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ challengeId: challenge, email: OPERATOR, code }) }), f.env);
    expect(response.status).toBe(200);
    expectPrivate(response);
    expect(await response.json()).toMatchObject({ user: { email: OPERATOR, isOperator: true } });
    expect(response.headers.get("Set-Cookie")).toContain("HttpOnly");
  });
});


function operatorFixture() {
  const f = fixture();
  f.user("op", OPERATOR);
  const cookie = f.session("op");
  const app = createApiApp();
  return { ...f, async get<T>(path: string): Promise<T> {
    const response = await app.fetch(request(`/api/ops/${path}`, cookie), f.env);
    expect(response.status).toBe(200);
    expectPrivate(response);
    return response.json() as Promise<T>;
  }, async response(path: string, init?: RequestInit) {
    return app.fetch(request(`/api/ops/${path}`, cookie, init), f.env);
  } };
}

const START = "2026-02-08T15:00:00.000Z";
const END = "2026-02-09T15:00:00.000Z";
const LAST = "2026-02-09T14:59:59.999Z";

function populatedFixture() {
  const f = operatorFixture();
  Object.assign(f.env, { OPS_INTERNAL_EMAILS: " Staff@Example.com " });
  f.user("a", "reader@example.com", START);
  f.user("b", "contest@example.com", LAST);
  f.user("c", "today@example.com", END);
  f.user("d", "older@example.com", "2026-02-08T14:59:59.999Z");
  f.user("staff", "staff@example.com", START);
  f.user("reserved", "bot@system.invalid", START);
  f.site("old", "a", OLD);
  f.site("start", "a", START, { title: "test is a real customer title" });
  f.site("end", "b", LAST);
  f.site("anonymous", "anon-public", START);
  f.site("internal", "staff", START);
  f.site("operator", "op", START);
  f.site("reserved", "reserved", START);
  f.site("draft", "a", START, { draft: true });
  f.site("deleted", "a", START, { deleted: true });
  f.site("expired", "b", START, { expiresAt: NOW });
  f.site("boundary", "a", END);
  f.site("oldrev", "a", OLD);
  f.revision("oldrev", "recent-update", START, 4, 500);
  f.view("v1", "start", START);
  f.view("v2", "start", LAST);
  f.view("v3", "end", LAST);
  f.view("v4", "anonymous", START);
  f.view("v5", "old", START);
  f.view("v6", "deleted", START);
  f.view("auth", "start", START, "auth_success");
  f.view("blocked", "start", START, "auth_failure");
  f.view("internal", "internal", START);
  f.view("draft", "draft", START);
  f.view("reserved", "reserved", START);
  f.view("after", "start", END);
  f.subscription("paid", "a");
  f.subscription("trial", "b", "trialing");
  f.subscription("test-mode", "b", "active", 0);
  f.subscription("canceled", "b", "canceled");
  f.subscription("internal", "staff");
  f.subscription("operator", "op");
  f.subscription("reserved", "reserved");
  f.subscription("anonymous", "anon-public");
  f.sqlite.prepare("INSERT INTO measurement_events(id,event_name,path,created_at) VALUES ('login-one','signup_completed','/app/',?),('login-two','signup_completed','/app/',?)").run(START, START);
  return f;
}

describe("operator summary SQL", () => {
  it.each(["registered", "anonymous"])("counts an old draft first published in the window as %s without changing list creation dates", async (segment) => {
    const f = operatorFixture();
    f.user("a", "a@example.com");
    f.site("old-draft", segment === "anonymous" ? "anon-public" : "a", OLD, { draft: true });
    f.revision("old-draft", "first", START);
    f.sqlite.prepare("UPDATE sites SET current_revision_id = ? WHERE id = ?").run("first", "old-draft");
    const result = await f.get<OperatorSummary>("summary?period=yesterday");
    expect(result.metrics).toMatchObject({ publishedSites: 1, anonymousSites: segment === "anonymous" ? 1 : 0, registeredSites: segment === "registered" ? 1 : 0 });
    expect(result.daily).toEqual([{ date: "2026-02-09", newUsers: 0, sites: 1, views: 0 }]);
    expect((await f.get<OperatorPage<OperatorSite>>("sites?period=yesterday")).items).toEqual([]);
    expect((await f.get<OperatorPage<OperatorSite>>("sites?period=all")).items[0].createdAt).toBe(OLD);
  });

  it.each([END, NOW])("does not count a site created in the window but first published at %s", async (publishedAt) => {
    const f = operatorFixture();
    f.user("a", "a@example.com");
    f.site("later", "a", START, { draft: true });
    f.revision("later", "first", publishedAt);
    f.sqlite.prepare("UPDATE sites SET current_revision_id = ? WHERE id = ?").run("first", "later");
    const result = await f.get<OperatorSummary>("summary?period=yesterday");
    expect(result.metrics).toMatchObject({ publishedSites: 0, registeredSites: 0, activeCreators: 0, liveSites: publishedAt === NOW ? 0 : 1 });
    expect(result.daily[0].sites).toBe(0);
    if (publishedAt === NOW) {
      const all = await f.get<OperatorSummary>("summary?period=all");
      expect(all.metrics).toMatchObject({ publishedSites: 0, liveSites: 0 });
      expect(all.daily.every((day) => day.sites === 0)).toBe(true);
    }
  });

  it("keeps the first publication day unchanged when the current revision is replaced", async () => {
    const f = operatorFixture();
    f.user("a", "a@example.com");
    f.site("existing", "a", OLD, { draft: true });
    f.revision("existing", "first", "2026-02-07T15:00:00.000Z");
    f.sqlite.prepare("UPDATE sites SET current_revision_id = ? WHERE id = ?").run("first", "existing");
    const before = await f.get<OperatorSummary>("summary?period=all");
    expect(before.daily.filter((day) => day.sites > 0)).toEqual([{ date: "2026-02-08", newUsers: 0, sites: 1, views: 0 }]);
    f.revision("existing", "latest", START);
    f.sqlite.prepare("UPDATE sites SET current_revision_id = ? WHERE id = ?").run("latest", "existing");
    const yesterday = await f.get<OperatorSummary>("summary?period=yesterday");
    expect(yesterday.metrics).toMatchObject({ publishedSites: 0, activeCreators: 1, returningCreators: 0 });
    expect(yesterday.daily[0].sites).toBe(0);
    const after = await f.get<OperatorSummary>("summary?period=all");
    expect(after.daily).toEqual(before.daily);
    expect(after.metrics).toMatchObject({ publishedSites: 1, activeCreators: 1, returningCreators: 1 });
  });

  it("does not count stored revisions without a successful current revision", async () => {
    const f = operatorFixture();
    f.user("a", "a@example.com");
    f.site("unpublished", "a", START, { draft: true });
    f.revision("unpublished", "unselected", START);
    const result = await f.get<OperatorSummary>("summary?period=yesterday");
    expect(result.metrics).toMatchObject({ publishedSites: 0, activeCreators: 0, liveSites: 0 });
    expect(result.daily[0].sites).toBe(0);
  });

  it("counts yesterday's JST outcomes without join multiplication, pseudo users, internal usage or auth events", async () => {
    const f = populatedFixture();
    f.sqlite.exec("PRAGMA query_only = ON");
    const result = await f.get<OperatorSummary>("summary?period=yesterday");
    expect(result).toEqual({
      period: "yesterday", from: START, to: END, timezone: "Asia/Tokyo", generatedAt: NOW,
      metrics: { registeredUsers: 4, newUsers: 2, publishedSites: 5, anonymousSites: 1, registeredSites: 4, activeCreators: 2, previewViews: 6, liveSites: 6, paidSubscriptions: 1, returningCreators: 0 },
      daily: [{ date: "2026-02-09", newUsers: 2, sites: 5, views: 6 }]
    });
    expect(f.queries.every((sql) => /^\s*(SELECT|WITH)\b/i.test(sql))).toBe(true);
  });

  it.each([
    ["", "30d", "2026-01-11T03:00:00.000Z", 31],
    ["?period=7d", "7d", "2026-02-03T03:00:00.000Z", 8],
    ["?period=30d", "30d", "2026-01-11T03:00:00.000Z", 31],
    ["?period=all", "all", null, 90]
  ])("anchors %s to one clock and zero-fills bounded JST days", async (query, period, from, days) => {
    const f = operatorFixture();
    const result = await f.get<OperatorSummary>(`summary${query}`);
    expect(result).toMatchObject({ period, from, to: NOW, generatedAt: NOW, timezone: "Asia/Tokyo" });
    expect(result.daily).toHaveLength(days as number);
    expect(result.daily.at(-1)?.date).toBe("2026-02-10");
    if (period === "all") expect(result.daily[0].date).toBe("2025-11-13");
    expect(Object.values(result.metrics).every((count) => count === 0)).toBe(true);
    expect(result.daily.every((day) => day.newUsers === 0 && day.sites === 0 && day.views === 0)).toBe(true);
  });

  it("handles JST yesterday across a UTC month/year boundary", async () => {
    vi.setSystemTime("2025-12-31T15:00:00.000Z");
    const result = await operatorFixture().get<OperatorSummary>("summary?period=yesterday");
    expect(result).toMatchObject({ from: "2025-12-30T15:00:00.000Z", to: "2025-12-31T15:00:00.000Z", daily: [{ date: "2025-12-31", newUsers: 0, sites: 0, views: 0 }] });
  });

  it("counts returning creators from successful uploads on distinct JST days, not sign-ins or same-day revisions", async () => {
    const f = operatorFixture();
    f.user("a", "a@example.com");
    f.user("b", "b@example.com");
    f.site("a", "a", OLD);
    f.site("b", "b", OLD);
    f.revision("a", "a-1", "2026-02-08T14:59:59.999Z");
    f.revision("a", "a-2", START);
    f.revision("a", "a-3", LAST);
    f.revision("b", "b-1", START);
    f.revision("b", "b-2", LAST);
    const result = await f.get<OperatorSummary>("summary?period=7d");
    expect(result.metrics).toMatchObject({ activeCreators: 2, returningCreators: 1, publishedSites: 0 });
  });

  it("uses inclusive lower/exclusive upper rolling boundaries for users, sites and views", async () => {
    const f = operatorFixture();
    f.user("inside", "inside@example.com", "2026-02-03T03:00:00.000Z");
    f.user("before", "before@example.com", "2026-02-03T02:59:59.999Z");
    f.user("future", "future@example.com", NOW);
    for (const [id, at] of [["inside", "2026-02-03T03:00:00.000Z"], ["before", "2026-02-03T02:59:59.999Z"], ["future", NOW]]) {
      f.site(id, id, at);
      f.view(id, id, at);
    }
    const result = await f.get<OperatorSummary>("summary?period=7d");
    expect(result.metrics).toMatchObject({ registeredUsers: 2, newUsers: 1, publishedSites: 1, previewViews: 1 });
    expect(result.daily[0]).toEqual({ date: "2026-02-03", newUsers: 1, sites: 1, views: 1 });
  });
});

describe("operator lists", () => {
  it("paginates stably, includes soft-deleted and draft metadata, and projects only safe fields", async () => {
    const f = populatedFixture();
    f.sqlite.exec("PRAGMA query_only = ON");
    const page = await f.get<OperatorPage<OperatorSite>>("sites?period=yesterday&limit=2&offset=0");
    expect(page).toMatchObject({ total: 9, offset: 0, limit: 2, hasMore: true });
    expect(page.items.map((item) => item.id)).toEqual(["end", "start"]);
    expect(page.items[1]).toEqual({ id: "start", title: "test is a real customer title", slug: "start", previewUrl: "https://start.preview.example.com/", ownerLabel: "r***@example.com", segment: "registered", authMode: "password", status: "active", createdAt: START, expiresAt: null, views: 3, fileCount: 2, totalBytes: 80 });
    const all = await f.get<OperatorPage<OperatorSite>>("sites?period=yesterday&limit=100");
    expect(all.items.find((item) => item.id === "draft")).toMatchObject({ status: "draft", fileCount: 0, totalBytes: 0, previewUrl: "" });
    expect(all.items.find((item) => item.id === "deleted")).toMatchObject({ status: "deleted" });
    expect(all.items.find((item) => item.id === "expired")).toMatchObject({ status: "expired" });
    expect(all.items.find((item) => item.id === "internal")).toMatchObject({ segment: "internal", ownerLabel: "internal" });
    expect(all.items.find((item) => item.id === "anonymous")).toMatchObject({ segment: "anonymous", ownerLabel: "anonymous" });
    expect(JSON.stringify(all)).not.toMatch(/private-|password_hash|claim_token|r2_prefix|ip_hash|stripe_customer|content_sha256|<iframe/);
    const exhausted = await f.get<OperatorPage<OperatorSite>>("sites?period=yesterday&offset=100&limit=2");
    expect(exhausted).toEqual({ total: 9, offset: 100, limit: 2, hasMore: false, items: [] });
  });

  it("aggregates user publication totals and last publication independently of revision and view fan-out", async () => {
    const f = populatedFixture();
    const page = await f.get<OperatorPage<OperatorUser>>("users?period=yesterday&q=reader");
    expect(page).toEqual({ total: 1, offset: 0, limit: 25, hasMore: false, items: [{ id: "a", email: "reader@example.com", name: "Name a", segment: "registered", createdAt: START, siteCount: 5, lastPublishedAt: END }] });
    const staff = await f.get<OperatorPage<OperatorUser>>("users?period=all&q=staff");
    expect(staff.items[0].segment).toBe("internal");
  });

  it("searches literal percent, underscore and backslash without wildcard expansion or SQL injection", async () => {
    const f = operatorFixture();
    f.user("a", "a@example.com");
    f.site("literal", "a", START, { title: "100%_\\ special" });
    f.site("other", "a", START, { title: "100wildcards special" });
    for (const q of ["%", "_", "\\"]) {
      const page = await f.get<OperatorPage<OperatorSite>>(`sites?period=all&q=${encodeURIComponent(q)}`);
      expect(page.total).toBe(1);
      expect(page.items[0].id).toBe("literal");
    }
    const injected = await f.get<OperatorPage<OperatorSite>>(`sites?period=all&q=${encodeURIComponent("' OR 1=1 --")}`);
    expect(injected.total).toBe(0);
    expect((await f.get<OperatorPage<OperatorSite>>("sites?period=all&q=a%40example.com")).total).toBe(2);
    expect((await f.get<OperatorPage<OperatorUser>>("users?period=all&q=Name%20a")).total).toBe(1);
  });

  it.each(["evil.example/path", "//attacker.example", "unsafe?token=x", "unsafe#x", "a.b", "-leading", "trailing-"])("never constructs a preview link from unsafe slug %s", async (slug) => {
    const f = operatorFixture();
    f.site("unsafe", "op", START, { slug });
    const page = await f.get<OperatorPage<OperatorSite>>("sites?period=all");
    expect(page.items[0].previewUrl).toBe("");
  });

  it.each(["https://attacker.example/", ".preview.example.com/path", ".preview.example.com?token=x", ""])("fails closed on unsafe preview suffix %s", async (suffix) => {
    const f = operatorFixture();
    Object.assign(f.env, { PREVIEW_HOST_SUFFIX: suffix });
    f.site("safe", "op", START);
    expect((await f.get<OperatorPage<OperatorSite>>("sites?period=all")).items[0].previewUrl).toBe("");
  });

  it.each(["period=invalid", "period=", "limit=101", "limit=0", "limit=-1", "limit=1.5", "limit=2x", "offset=-1", "offset=1e2", "offset=1000001", "offset=9007199254740992", "limit=2&limit=3", `q=${"x".repeat(201)}`])("rejects invalid list input %s before aggregate reads", async (query) => {
    const f = operatorFixture();
    const response = await f.response(`sites?${query}`);
    expect(response.status).toBe(400);
    expectPrivate(response);
    expect(f.queries).toHaveLength(1);
  });

  it("rejects invalid summary periods before aggregate reads", async () => {
    const f = operatorFixture();
    const response = await f.response("summary?period=invalid");
    expect(response.status).toBe(400);
    expectPrivate(response);
    expect(f.queries).toHaveLength(1);
  });

  it.each(["POST", "PATCH", "DELETE"])("has no %s mutation endpoints", async (method) => {
    const f = populatedFixture();
    f.sqlite.exec("PRAGMA query_only = ON");
    const response = await f.response("sites", { method });
    expect(response.status).toBe(405);
    expectPrivate(response);
    expect(f.queries).toHaveLength(1);
  });

  it("returns a private sanitized error when the metrics database fails", async () => {
    const f = operatorFixture();
    f.sqlite.exec("DROP TABLE access_events");
    const response = await f.response("summary");
    expect(response.status).toBe(500);
    expectPrivate(response);
    expect(await response.json()).toEqual({ error: "operator_data_unavailable" });
  });
});
