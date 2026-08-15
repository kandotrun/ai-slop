import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { configPath, loadConfig } from "../packages/cli/src/config";
import { runGigaCli } from "../packages/cli/src/command";

interface FetchCall {
  url: string;
  init: RequestInit;
}

function sessionCookie(): string {
  return ["giga", "site", "session=", "gus", "session", "exampleKey"].join("_").replace("session=_", "session=");
}

async function tempConfigHome(): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), "giga-admin-cli-"));
  process.env.GIGA_CONFIG_HOME = root;
  delete process.env.GIGA_UPLOAD_TOKEN;
  delete process.env.GIGA_HOST;
  return root;
}

async function writeSession(host = "https://giga-site.test"): Promise<void> {
  const file = configPath();
  await writeFile(file, JSON.stringify({ host, sessionCookie: sessionCookie(), user: { email: "kan@example.com" }, createdAt: "2026-07-01T00:00:00.000Z" }), { mode: 0o600 });
}

function mockFetch(handler: (url: string, init: RequestInit) => Response | Promise<Response>): FetchCall[] {
  const calls: FetchCall[] = [];
  vi.stubGlobal("fetch", async (url: string | URL | Request, init?: RequestInit) => {
    const call = { url: String(url), init: init ?? {} };
    calls.push(call);
    return handler(call.url, call.init);
  });
  return calls;
}

describe("giga admin CLI", () => {
  const roots: string[] = [];

  afterEach(async () => {
    vi.unstubAllGlobals();
    delete process.env.GIGA_CONFIG_HOME;
    delete process.env.GIGA_UPLOAD_TOKEN;
    delete process.env.GIGA_HOST;
    await Promise.all(roots.map((root) => rm(root, { recursive: true, force: true })));
    roots.length = 0;
  });

  it("logs in with email OTP, stores only the session cookie, and redacts it from output", async () => {
    roots.push(await tempConfigHome());
    const cookie = sessionCookie();
    const calls = mockFetch((url) => {
      if (url.endsWith("/api/auth/request-code")) {
        return Response.json({ challengeId: "challenge_1", expiresAt: "2026-07-01T00:10:00.000Z", email: "kan@example.com" });
      }
      return new Response(JSON.stringify({ user: { id: "u1", email: "kan@example.com", name: "Kan" } }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Set-Cookie": `${cookie}; Path=/; HttpOnly; SameSite=Lax; Secure` }
      });
    });
    const stdout: string[] = [];
    const stderr: string[] = [];

    const requestExitCode = await runGigaCli(["login", "--email", "kan@example.com", "--host", "https://giga-site.test"], { stdout: (line) => stdout.push(line), stderr: (line) => stderr.push(line) });

    expect(requestExitCode).toBe(0);
    expect(calls.map((call) => call.url)).toEqual(["https://giga-site.test/api/auth/request-code"]);
    expect(calls[0]?.init.headers).toMatchObject({ Origin: "https://giga-site.test", "Content-Type": "application/json" });
    const pending = await loadConfig();
    expect(pending?.pendingLogin).toMatchObject({ host: "https://giga-site.test", email: "kan@example.com", challengeId: "challenge_1" });
    expect(pending?.sessionCookie).toBeUndefined();
    expect(stdout.join("\n")).toContain("Login code sent to kan@example.com");

    const verifyExitCode = await runGigaCli(["login", "--code", "123456"], { stdout: (line) => stdout.push(line), stderr: (line) => stderr.push(line) });

    expect(verifyExitCode).toBe(0);
    expect(calls.map((call) => call.url)).toEqual(["https://giga-site.test/api/auth/request-code", "https://giga-site.test/api/auth/verify-code"]);
    expect(calls[1]?.init.body).toBe(JSON.stringify({ challengeId: "challenge_1", email: "kan@example.com", code: "123456" }));
    const saved = await loadConfig();
    expect(saved?.sessionCookie).toBe(cookie);
    expect(saved?.pendingLogin).toBeUndefined();
    expect(saved?.host).toBe("https://giga-site.test");
    expect((await stat(configPath())).mode & 0o777).toBe(0o600);
    expect(stdout.join("\n")).toContain("Logged in as kan@example.com");
    expect(stdout.join("\n")).not.toContain(cookie);
    expect(stderr.join("\n")).not.toContain(cookie);
  });

  it("sends stored session cookies and Origin for authenticated state-changing requests", async () => {
    roots.push(await tempConfigHome());
    await writeSession();
    const calls = mockFetch(() => Response.json({ ok: true }));

    const exitCode = await runGigaCli(["sites", "delete", "site_1", "--yes"], { stdout: () => undefined, stderr: () => undefined });

    expect(exitCode).toBe(0);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.url).toBe("https://giga-site.test/api/sites/site_1");
    expect(calls[0]?.init.method).toBe("DELETE");
    expect(calls[0]?.init.headers).toMatchObject({ Cookie: sessionCookie(), Origin: "https://giga-site.test", Accept: "application/json" });
  });

  it("maps dashboard, site, revision, form, event, comment, billing, slug, and agent-token commands to dashboard APIs", async () => {
    roots.push(await tempConfigHome());
    await writeSession();
    const calls = mockFetch((url) => {
      if (url.includes("form-submissions.csv")) return new Response("id,email\n1,a@example.com\n", { headers: { "Content-Type": "text/csv" } });
      if (url.includes("/api/agent/upload-tokens")) return Response.json({ uploadToken: { id: "tok_1", token: ["gut", "tok", "exampleKey"].join("_"), uploadUrl: "https://giga-site.test/api/agent/uploads/tok", statusUrl: "https://giga-site.test/api/agent/uploads/tok" } }, { status: 201 });
      return Response.json({ ok: true, sites: [], site: { id: "site_1", previewUrl: "https://demo.giga-site.test" }, revisions: [], submissions: [], events: [], comments: [], subscription: { planId: "free" }, invoices: [], paymentMethod: null, available: true, portal: { url: "https://billing.example" }, session: { url: "https://checkout.example" } });
    });
    const cases: Array<{ argv: string[]; method: string; path: string }> = [
      { argv: ["me"], method: "GET", path: "/api/me" },
      { argv: ["dashboard"], method: "GET", path: "/api/dashboard" },
      { argv: ["notifications"], method: "GET", path: "/api/notifications" },
      { argv: ["sites", "list"], method: "GET", path: "/api/sites" },
      { argv: ["sites", "get", "site_1"], method: "GET", path: "/api/sites/site_1" },
      { argv: ["sites", "create", "--title", "Demo", "--auth", "password", "--password", "pw"], method: "POST", path: "/api/sites" },
      { argv: ["sites", "update", "site_1", "--title", "Demo 2", "--indexing", "true"], method: "PATCH", path: "/api/sites/site_1" },
      { argv: ["sites", "renew", "site_1"], method: "POST", path: "/api/sites/site_1/renew-expiry" },
      { argv: ["revisions", "list", "site_1"], method: "GET", path: "/api/sites/site_1/revisions" },
      { argv: ["revisions", "preview", "site_1", "rev_1"], method: "POST", path: "/api/sites/site_1/revisions/rev_1/preview" },
      { argv: ["revisions", "restore", "site_1", "rev_1"], method: "POST", path: "/api/sites/site_1/revisions/rev_1/restore" },
      { argv: ["forms", "list", "site_1"], method: "GET", path: "/api/sites/site_1/form-submissions" },
      { argv: ["forms", "get", "site_1", "sub_1"], method: "GET", path: "/api/sites/site_1/form-submissions/sub_1" },
      { argv: ["forms", "csv", "site_1"], method: "GET", path: "/api/sites/site_1/form-submissions.csv" },
      { argv: ["events", "site_1"], method: "GET", path: "/api/sites/site_1/events" },
      { argv: ["comments", "list", "site_1"], method: "GET", path: "/api/sites/site_1/comments" },
      { argv: ["comments", "create", "site_1", "--revision", "rev_1", "--body", "Looks good"], method: "POST", path: "/api/sites/site_1/comments" },
      { argv: ["comments", "update", "site_1", "comment_1", "--status", "resolved"], method: "PATCH", path: "/api/sites/site_1/comments/comment_1" },
      { argv: ["comments", "delete", "site_1", "comment_1", "--yes"], method: "DELETE", path: "/api/sites/site_1/comments/comment_1" },
      { argv: ["billing", "status"], method: "GET", path: "/api/billing/subscription" },
      { argv: ["billing", "invoices"], method: "GET", path: "/api/billing/invoices" },
      { argv: ["billing", "payment-method"], method: "GET", path: "/api/billing/payment-method" },
      { argv: ["billing", "checkout", "--plan", "pro"], method: "POST", path: "/api/billing/checkout-session" },
      { argv: ["billing", "portal"], method: "POST", path: "/api/billing/customer-portal-session" },
      { argv: ["slugs", "check", "demo"], method: "GET", path: "/api/slugs/availability?slug=demo" },
      { argv: ["agent-token", "create", "--title", "Demo", "--auth", "password", "--password", "pw"], method: "POST", path: "/api/agent/upload-tokens" }
    ];

    for (const item of cases) {
      const before = calls.length;
      const exitCode = await runGigaCli([...item.argv, "--json"], { stdout: () => undefined, stderr: () => undefined });
      expect(exitCode, item.argv.join(" ")).toBe(0);
      const call = calls[before];
      expect(call?.url, item.argv.join(" ")).toBe(`https://giga-site.test${item.path}`);
      expect(call?.init.method ?? "GET", item.argv.join(" ")).toBe(item.method);
    }
  });

  it("publishes with the authenticated dashboard flow when no one-time token is supplied", async () => {
    roots.push(await tempConfigHome());
    await writeSession();
    const siteRoot = await mkdtemp(path.join(tmpdir(), "giga-admin-publish-"));
    roots.push(siteRoot);
    await writeFile(path.join(siteRoot, "index.html"), "<!doctype html><h1>Admin publish</h1>");
    const calls = mockFetch((url) => {
      if (url.endsWith("/api/sites/site_1/revisions")) return Response.json({ revision: { id: "rev_1", previewUrl: "https://demo.giga-site.test", fileCount: 1, byteLength: 39, warnings: [] } }, { status: 201 });
      return Response.json({ site: { id: "site_new", previewUrl: "https://new.giga-site.test" }, revision: { id: "rev_2", fileCount: 1, byteLength: 39, warnings: [] } }, { status: 201 });
    });

    const dryRunOutput: string[] = [];
    expect(await runGigaCli(["publish", siteRoot, "--site", "site_1", "--dry-run", "--json"], { stdout: (line) => dryRunOutput.push(line), stderr: () => undefined })).toBe(0);
    expect(calls).toHaveLength(0);
    expect(dryRunOutput.join("\n")).toContain('"mode": "session"');
    expect(dryRunOutput.join("\n")).toContain('"siteId": "site_1"');

    expect(await runGigaCli(["publish", siteRoot, "--site", "site_1", "--json"], { stdout: () => undefined, stderr: () => undefined })).toBe(0);
    expect(calls[0]?.url).toBe("https://giga-site.test/api/sites/site_1/revisions");
    expect(calls[0]?.init.headers).toMatchObject({ Cookie: sessionCookie(), Origin: "https://giga-site.test" });

    expect(await runGigaCli(["publish", siteRoot, "--title", "New Site", "--auth", "password", "--password", "pw", "--json"], { stdout: () => undefined, stderr: () => undefined })).toBe(0);
    expect(calls[1]?.url).toBe("https://giga-site.test/api/sites-with-revision");
    expect(JSON.parse(String(calls[1]?.init.body))).toMatchObject({ title: "New Site", authMode: "password", entryPath: "index.html" });
  });
});
