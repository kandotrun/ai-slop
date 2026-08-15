import { Buffer } from "node:buffer";
import { describe, expect, it } from "vitest";
import { createApiApp } from "../src/worker/api";

interface FakeSite {
  id: string;
  owner_user_id: string;
  slug: string;
  title: string | null;
  status: string;
  auth_mode: string;
  password_hash: string | null;
  allowed_email_domains: string | null;
  allowed_emails: string | null;
  indexing_enabled: number;
  hide_branding: number;
  tool: string | null;
  expires_at: string | null;
  current_revision_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface FakePurchase {
  id: string;
  owner_user_id: string;
  status: string;
  site_quota: number;
  used_site_count: number;
  created_at: string;
  updated_at: string;
}

interface FakeSubscription {
  plan_id: string | null;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: number;
  stripe_customer_id: string | null;
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

function makeSite(id: string, slug: string, ownerUserId = "owner_test"): FakeSite {
  return {
    id,
    owner_user_id: ownerUserId,
    slug,
    title: slug,
    status: "active",
    auth_mode: "random",
    password_hash: null,
    allowed_email_domains: "[]",
    allowed_emails: "[]",
    indexing_enabled: 0,
    hide_branding: 0,
    tool: null,
    expires_at: null,
    current_revision_id: "rev_existing",
    created_at: "2026-06-20T00:00:00.000Z",
    updated_at: "2026-06-20T00:00:00.000Z",
    deleted_at: null
  };
}

function fakeEnv(options: { sites?: FakeSite[]; purchases?: FakePurchase[]; subscription?: FakeSubscription | null } = {}) {
  const sites = new Map<string, FakeSite>((options.sites ?? []).map((site) => [site.id, site]));
  const purchases = new Map<string, FakePurchase>((options.purchases ?? []).map((purchase) => [purchase.id, purchase]));
  const revisions = new Map<string, Record<string, unknown>>();
  const objects = new Map<string, string | Uint8Array>();
  const subscription = options.subscription ?? null;

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
            return subscription as T;
          }
          if (sql.includes("COUNT(*) AS activeSiteCount")) {
            const ownerUserId = String(bound[0]);
            const activeSiteCount = [...sites.values()].filter(
              (site) => site.owner_user_id === ownerUserId && site.deleted_at === null && site.status === "active"
            ).length;
            return { activeSiteCount } as T;
          }
          if (sql.includes("COALESCE(SUM(site_quota - used_site_count)")) {
            const ownerUserId = String(bound[0]);
            const unusedSitePurchases = [...purchases.values()]
              .filter(
                (purchase) =>
                  purchase.owner_user_id === ownerUserId &&
                  (purchase.status === "paid" || purchase.status === "checkout_completed") &&
                  purchase.site_quota > purchase.used_site_count
              )
              .reduce((sum, purchase) => sum + (purchase.site_quota - purchase.used_site_count), 0);
            return { unusedSitePurchases } as T;
          }
          if (sql.includes("FROM billing_site_purchases") && sql.includes("site_quota > used_site_count")) {
            const ownerUserId = String(bound[0]);
            const row = [...purchases.values()].find(
              (purchase) =>
                purchase.owner_user_id === ownerUserId &&
                (purchase.status === "paid" || purchase.status === "checkout_completed") &&
                purchase.site_quota > purchase.used_site_count
            );
            return (row ?? null) as T;
          }
          if (sql.includes("SELECT id FROM sites WHERE slug")) {
            const desiredSlug = String(bound[0]);
            const existing = [...sites.values()].find((site) => site.slug === desiredSlug && site.deleted_at === null);
            return (existing ? { id: existing.id } : null) as T;
          }
          if (sql.includes("SELECT * FROM sites WHERE slug = ? AND owner_user_id = ?")) {
            const desiredSlug = String(bound[0]);
            const ownerUserId = String(bound[1]);
            const site = [...sites.values()].find((item) => item.slug === desiredSlug && item.owner_user_id === ownerUserId && item.deleted_at === null);
            return (site ?? null) as T;
          }
          if (sql.includes("SELECT * FROM sites WHERE id = ? AND owner_user_id = ?")) {
            const site = sites.get(String(bound[0]));
            return (site && site.owner_user_id === String(bound[1]) && site.deleted_at === null ? site : null) as T;
          }
          if (sql.includes("FROM sites s WHERE")) {
            const site = sites.get(String(bound[0]));
            return (site
              ? { ...site, views: 0, auth_views: 0, unique_visitors: 0, total_bytes: 0, last_seen_at: null }
              : null) as T;
          }
          throw new Error(`Unexpected first SQL: ${sql} ${JSON.stringify(bound)}`);
        },
        async run() {
          if (sql.includes("UPDATE billing_site_purchases") && sql.includes("used_site_count = used_site_count + 1")) {
            const purchase = purchases.get(String(bound[1]));
            if (!purchase || purchase.used_site_count >= purchase.site_quota) {
              return { success: true, meta: { changes: 0 } } as D1Result;
            }
            purchase.used_site_count += 1;
            purchase.updated_at = String(bound[0]);
            return { success: true, meta: { changes: 1 } } as D1Result;
          }
          if (sql.includes("UPDATE billing_site_purchases SET used_site_count = MAX")) {
            const purchase = purchases.get(String(bound[1]));
            if (purchase) {
              purchase.used_site_count = Math.max(0, purchase.used_site_count - 1);
              purchase.updated_at = String(bound[0]);
            }
            return { success: true, meta: { changes: purchase ? 1 : 0 } } as D1Result;
          }
          if (sql.includes("INSERT INTO sites")) {
            const id = String(bound[0]);
            const site: FakeSite = {
              id,
              owner_user_id: String(bound[1]),
              slug: String(bound[2]),
              title: String(bound[3]),
              status: "active",
              auth_mode: String(bound[4]),
              password_hash: bound[5] === null ? null : String(bound[5]),
              allowed_email_domains: String(bound[6]),
              allowed_emails: String(bound[7]),
              indexing_enabled: Number(bound[8]),
              hide_branding: Number(bound[9]),
              tool: bound[10] === null ? null : String(bound[10]),
              expires_at: bound[11] === null ? null : String(bound[11]),
              current_revision_id: null,
              created_at: String(bound[12]),
              updated_at: String(bound[13]),
              deleted_at: null
            };
            sites.set(id, site);
            return { success: true, meta: { changes: 1 } } as D1Result;
          }
          if (sql.includes("INSERT INTO revisions")) {
            revisions.set(String(bound[0]), {
              id: String(bound[0]),
              site_id: String(bound[1]),
              r2_prefix: String(bound[2]),
              entry_path: String(bound[3])
            });
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
          if (sql.includes("UPDATE sites SET status = 'deleted'")) {
            const site = sites.get(String(bound[2]));
            if (site) {
              site.status = "deleted";
              site.deleted_at = String(bound[0]);
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

  return { env, sites, purchases, revisions, objects };
}

describe("feedback hardening regressions", () => {
  it("rejects direct site creation when the server-side plan limit is exhausted", async () => {
    const { env, sites } = fakeEnv({ sites: [makeSite("site_existing", "existing")] });

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Second", slug: "second", authMode: "random" })
      }),
      env
    );
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(402);
    expect(body.error).toBe("free_plan_site_limit_exceeded");
    expect(sites.size).toBe(1);
  });

  it("allows direct site creation after consuming a paid single-site purchase", async () => {
    const purchase: FakePurchase = {
      id: "purchase_1",
      owner_user_id: "owner_test",
      status: "paid",
      site_quota: 1,
      used_site_count: 0,
      created_at: "2026-06-20T00:00:00.000Z",
      updated_at: "2026-06-20T00:00:00.000Z"
    };
    const { env, sites, purchases } = fakeEnv({ sites: [makeSite("site_existing", "existing")], purchases: [purchase] });

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Paid Slot", slug: "paid-slot", authMode: "random" })
      }),
      env
    );

    expect(response.status).toBe(201);
    expect(sites.size).toBe(2);
    expect([...sites.values()].find((site) => site.slug === "paid-slot")?.expires_at).toBeNull();
    expect(purchases.get("purchase_1")?.used_site_count).toBe(1);
  });

  it("uses an unused single-site purchase for no-expiry publishing even when the free slot is still available", async () => {
    const purchase: FakePurchase = {
      id: "purchase_permanent",
      owner_user_id: "owner_test",
      status: "paid",
      site_quota: 1,
      used_site_count: 0,
      created_at: "2026-06-20T00:00:00.000Z",
      updated_at: "2026-06-20T00:00:00.000Z"
    };
    const { env, sites, purchases } = fakeEnv({ purchases: [purchase] });

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Permanent", slug: "permanent", authMode: "random" })
      }),
      env
    );

    expect(response.status).toBe(201);
    expect([...sites.values()].find((site) => site.slug === "permanent")?.expires_at).toBeNull();
    expect(purchases.get("purchase_permanent")?.used_site_count).toBe(1);
  });

  it("defaults free-plan site creation to a 7-day expiry", async () => {
    const { env } = fakeEnv();

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Free", slug: "free", authMode: "random" })
      }),
      env
    );
    const body = (await response.json()) as { site: { createdAt: string; expiresAt: string | null } };

    expect(response.status).toBe(201);
    expect(body.site.expiresAt).toBeTruthy();
    expect(new Date(body.site.expiresAt!).getTime() - new Date(body.site.createdAt).getTime()).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it("rejects no-expiry or long-lived publishing on the free plan", async () => {
    const { env } = fakeEnv();

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Long", slug: "long", authMode: "random", expiresAt: "2099-01-01T00:00:00.000Z" })
      }),
      env
    );
    const body = (await response.json()) as { error: string; details?: { maxDays?: number } };

    expect(response.status).toBe(402);
    expect(body.error).toBe("free_plan_expiry_limit_exceeded");
    expect(body.details?.maxDays).toBe(7);
  });

  it("allows active paid subscription plans to publish without an expiry", async () => {
    const { env, sites } = fakeEnv({
      subscription: {
        plan_id: "personal_pro",
        status: "active",
        current_period_end: "2026-07-20T00:00:00.000Z",
        cancel_at_period_end: 0,
        stripe_customer_id: "cus_test"
      }
    });

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Paid", slug: "paid", authMode: "random" })
      }),
      env
    );

    expect(response.status).toBe(201);
    expect([...sites.values()].find((site) => site.slug === "paid")?.expires_at).toBeNull();
  });

  it("rejects agent upload token issuance when the owner has no remaining site quota", async () => {
    const { env } = fakeEnv({ sites: [makeSite("site_existing", "existing")] });

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/agent/upload-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "AI upload", slug: "ai-upload", authMode: "password", password: "secret123" })
      }),
      env
    );
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(402);
    expect(body.error).toBe("free_plan_site_limit_exceeded");
  });

  it("rejects same-site preview origin CSRF against the one-shot site-with-revision API", async () => {
    const { env, sites, revisions, objects } = fakeEnv();

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/sites-with-revision", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
          Origin: "https://attacker.giga-site.com"
        },
        body: JSON.stringify({ title: "CSRF", slug: "csrf-owned-slug", authMode: "random", html: "<!doctype html><html><body>Owned</body></html>" })
      }),
      env
    );
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(403);
    expect(body.error).toBe("csrf_origin_denied");
    expect(sites.size).toBe(0);
    expect(revisions.size).toBe(0);
    expect(objects.size).toBe(0);
  });

  it("validates uploads before creating a site in the one-shot site-with-revision API", async () => {
    const { env, sites, objects } = fakeEnv();

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/sites-with-revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Broken", slug: "broken", authMode: "random", html: "not html" })
      }),
      env
    );
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(body.error).toBe("missing_html_marker");
    expect(sites.size).toBe(0);
    expect(objects.size).toBe(0);
  });

  it("creates a site and first revision together in the one-shot site-with-revision API", async () => {
    const { env, sites, revisions, objects } = fakeEnv();

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/sites-with-revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Launch", slug: "launch", authMode: "random", html: "<!doctype html><html><body>Launch</body></html>" })
      }),
      env
    );
    const body = (await response.json()) as { site: { id: string; currentRevisionId: string | null }; revision: { id: string } };

    expect(response.status).toBe(201);
    expect(sites.size).toBe(1);
    expect(revisions.size).toBe(1);
    expect(objects.size).toBe(1);
    expect(body.site.currentRevisionId).toBe(body.revision.id);
  });

  it("creates a site from a zipped static bundle payload and stores all extracted files", async () => {
    const { env, sites, revisions, objects } = fakeEnv();

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/sites-with-revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Zip Launch",
          slug: "zip-launch",
          authMode: "random",
          entryPath: "index.html",
          files: [
            {
              path: "index.html",
              content: Buffer.from("<!doctype html><html><head><link rel=\"stylesheet\" href=\"assets/app.css\"></head><body>Zip Launch</body></html>").toString("base64"),
              encoding: "base64",
              contentType: "text/html; charset=utf-8"
            },
            {
              path: "assets/app.css",
              content: Buffer.from("body { color: #123456; }").toString("base64"),
              encoding: "base64",
              contentType: "text/css; charset=utf-8"
            }
          ]
        })
      }),
      env
    );
    const body = (await response.json()) as { site: { id: string; currentRevisionId: string | null }; revision: { id: string; fileCount: number; entryPath: string } };

    expect(response.status).toBe(201);
    expect(sites.size).toBe(1);
    expect(revisions.size).toBe(1);
    expect(body.revision.entryPath).toBe("index.html");
    expect(body.revision.fileCount).toBe(2);
    expect(body.site.currentRevisionId).toBe(body.revision.id);
    expect([...objects.keys()].sort()).toEqual([
      `sites/${body.site.id}/revisions/${body.revision.id}/assets/app.css`,
      `sites/${body.site.id}/revisions/${body.revision.id}/index.html`
    ]);
  });

  it("spec: one-shot公開はファイル数上限を超えたbundleをDB/R2へ触る前に止める", async () => {
    const { env, sites, revisions, objects } = fakeEnv();
    // 仕様: 上限超過は「後から一部だけ保存」ではなく、公開前検証で丸ごと失敗させる。
    Object.assign(env, { MAX_UPLOAD_FILES: "2" });

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/sites-with-revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Too Many Files",
          slug: "too-many-files",
          authMode: "random",
          entryPath: "index.html",
          files: [
            { path: "index.html", content: "<!doctype html><html><body>OK</body></html>", encoding: "text", contentType: "text/html; charset=utf-8" },
            { path: "assets/app.css", content: "body{}", encoding: "text", contentType: "text/css; charset=utf-8" },
            { path: "assets/app.js", content: "console.log(1)", encoding: "text", contentType: "text/javascript; charset=utf-8" }
          ]
        })
      }),
      env
    );
    const body = (await response.json()) as { error: string; details?: { maxFiles?: number } };

    expect(response.status).toBe(400);
    expect(body.error).toBe("too_many_files");
    expect(body.details?.maxFiles).toBe(2);
    expect(sites.size).toBe(0);
    expect(revisions.size).toBe(0);
    expect(objects.size).toBe(0);
  });

  it("spec: one-shot公開は総byte上限を超えたHTMLをDB/R2へ触る前に止める", async () => {
    const { env, sites, revisions, objects } = fakeEnv();
    // 仕様: サイズ超過はR2 put後に気づくとゴミが残るため、必ず永続化前に判定する。
    Object.assign(env, { MAX_HTML_BYTES: "80" });

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/sites-with-revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Too Large",
          slug: "too-large",
          authMode: "random",
          html: `<!doctype html><html><body>${"x".repeat(100)}</body></html>`
        })
      }),
      env
    );
    const body = (await response.json()) as { error: string; details?: { maxBytes?: number } };

    expect(response.status).toBe(400);
    expect(body.error).toBe("upload_too_large");
    expect(body.details?.maxBytes).toBe(80);
    expect(sites.size).toBe(0);
    expect(revisions.size).toBe(0);
    expect(objects.size).toBe(0);
  });

  it("spec: 外部scriptやPHP混入は確認UIを返し、明示overrideなしでは公開しない", async () => {
    const { env, sites, revisions, objects } = fakeEnv();
    // 仕様: 危険シグナルは「黙って消す」でも「即公開」でもなく、警告detailsを返して利用者判断に戻す。
    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/sites-with-revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Needs Review",
          slug: "needs-review",
          authMode: "random",
          entryPath: "index.html",
          files: [
            { path: "index.html", content: '<!doctype html><html><body><script src="https://cdn.example/app.js"></script></body></html>', encoding: "text", contentType: "text/html; charset=utf-8" },
            { path: "legacy.php", content: "<?php echo 'x'; ?>", encoding: "text", contentType: "text/plain" }
          ]
        })
      }),
      env
    );
    const body = (await response.json()) as { error: string; details?: { warnings?: string[]; canOverride?: boolean; overrideField?: string } };

    expect(response.status).toBe(409);
    expect(body.error).toBe("security_review_warning");
    expect(body.details?.warnings).toEqual(expect.arrayContaining(["external_script", "php_file"]));
    expect(body.details).toMatchObject({ canOverride: true, overrideField: "securityOverrideAccepted" });
    expect(sites.size).toBe(0);
    expect(revisions.size).toBe(0);
    expect(objects.size).toBe(0);
  });

  it("spec: 利用者が警告を理解してoverrideした場合だけ、同じ危険signalを履歴に残して公開する", async () => {
    const { env, sites, revisions, objects } = fakeEnv();
    // 仕様: overrideは危険signalの握りつぶしではない。監査できるようrevision.warningsに残す。
    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/sites-with-revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Confirmed Review",
          slug: "confirmed-review",
          authMode: "random",
          securityOverrideAccepted: true,
          html: '<!doctype html><html><body><script src="https://cdn.example/app.js"></script>OK</body></html>'
        })
      }),
      env
    );
    const body = (await response.json()) as { revision: { warnings: string[] } };

    expect(response.status).toBe(201);
    expect(body.revision.warnings).toEqual(expect.arrayContaining(["external_script"]));
    expect(sites.size).toBe(1);
    expect(revisions.size).toBe(1);
    expect(objects.size).toBe(1);
  });

  it("spec: macOSのzipメタファイルは公開ファイル数にもR2保存対象にも含めない", async () => {
    const { env, sites, revisions, objects } = fakeEnv();
    // 仕様: Finder由来の __MACOSX / .DS_Store はノイズなので、entry不足扱いにせず安全に無視する。
    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/sites-with-revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Mac Zip",
          slug: "mac-zip",
          authMode: "random",
          entryPath: "index.html",
          files: [
            { path: "__MACOSX/._index.html", content: "metadata", encoding: "text", contentType: "application/octet-stream" },
            { path: ".DS_Store", content: "metadata", encoding: "text", contentType: "application/octet-stream" },
            { path: "index.html", content: "<!doctype html><html><body>Mac Zip</body></html>", encoding: "text", contentType: "text/html; charset=utf-8" }
          ]
        })
      }),
      env
    );
    const body = (await response.json()) as { site: { id: string }; revision: { id: string; fileCount: number; entryPath: string } };

    expect(response.status).toBe(201);
    expect(body.revision.fileCount).toBe(1);
    expect(body.revision.entryPath).toBe("index.html");
    expect(sites.size).toBe(1);
    expect(revisions.size).toBe(1);
    expect([...objects.keys()]).toEqual([`sites/${body.site.id}/revisions/${body.revision.id}/index.html`]);
  });
});
