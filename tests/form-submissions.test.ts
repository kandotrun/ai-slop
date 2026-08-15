import { describe, expect, it } from "vitest";
import { createApiApp } from "../src/worker/api";
import { handlePreviewRequest } from "../src/worker/preview";

const OWNER = "owner_test";

interface StoredSubmission {
  id: string;
  site_id: string;
  form_key: string;
  fields_json: string;
  field_count: number;
  source_path: string | null;
  submitter_email: string | null;
  ip_hash: string;
  user_agent_hash: string | null;
  notification_status: string;
  notification_error: string | null;
  notification_message_id: string | null;
  created_at: string;
}

interface SentEmail {
  to: string;
  subject?: string;
  text?: string;
  html?: string;
}

function siteRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "s1",
    owner_user_id: OWNER,
    slug: "demo",
    title: "Demo Form Site",
    status: "active",
    auth_mode: "random",
    password_hash: null,
    allowed_email_domains: "[]",
    allowed_emails: "[]",
    indexing_enabled: 0,
    hide_branding: 0,
    tool: null,
    expires_at: null,
    current_revision_id: "rev1",
    created_at: "2026-06-22T00:00:00.000Z",
    updated_at: "2026-06-22T00:00:00.000Z",
    deleted_at: null,
    ...overrides
  };
}

function makeEnv(
  options: {
    site?: Record<string, unknown>;
    viewerEmail?: string | null;
    recentCount?: number;
    subscription?: { plan_id: string | null; status: string } | null;
    ownerEmail?: string | null;
    includeEmail?: boolean;
    failEmail?: boolean;
  } = {}
) {
  const site = siteRow(options.site);
  const subscription = options.subscription === undefined ? { plan_id: "team", status: "active" } : options.subscription;
  const ownerEmail = options.ownerEmail === undefined ? "owner@example.test" : options.ownerEmail;
  const submissions: StoredSubmission[] = [];
  const sentEmails: SentEmail[] = [];
  const html = '<!doctype html><html><body><form data-giga-form="contact"><input name="name"><textarea name="message"></textarea><button type="submit">送信</button></form><p data-giga-form-status></p></body></html>';
  const db = {
    prepare(sql: string) {
      let bound: unknown[] = [];
      const statement = {
        bind(...args: unknown[]) {
          bound = args;
          return statement;
        },
        async first<T = unknown>() {
          if (sql.includes("SELECT * FROM sites WHERE slug")) {
            return (bound[0] === site.slug ? { ...site } : null) as T;
          }
          if (sql.includes("SELECT * FROM revisions WHERE id = ? AND site_id = ?")) {
            return { id: "rev1", site_id: "s1", r2_prefix: "sites/s1/revisions/rev1", entry_path: "index.html", file_count: 1, total_bytes: html.length, content_sha256: "sha", warnings_json: "[]", created_at: "2026-06-22T00:00:00.000Z", created_by: OWNER, note: null, restored_from_revision_id: null } as T;
          }
          if (sql.includes("SELECT id, email FROM viewer_sessions")) {
            return bound[0] === "viewer_session" ? ({ id: "viewer_session", email: options.viewerEmail ?? "viewer@example.com" } as T) : (null as T);
          }
          if (sql.includes("SELECT COUNT(*) AS total FROM site_form_submissions")) {
            return { total: options.recentCount ?? 0 } as T;
          }
          if (sql.includes("SELECT id FROM sites WHERE id = ? AND owner_user_id = ?")) {
            return bound[0] === "s1" && bound[1] === OWNER ? ({ id: "s1" } as T) : (null as T);
          }
          if (sql.includes("SELECT email FROM users WHERE id = ?")) {
            return ownerEmail && bound[0] === OWNER ? ({ email: ownerEmail } as T) : (null as T);
          }
          if (sql.includes("SELECT plan_id, status") && sql.includes("FROM billing_subscriptions")) {
            // Return the configured subscription for any queried owner so cross-tenant tests can
            // give an intruder their own active plan and still be blocked by the ownership check.
            return subscription && bound[0] ? ({ ...subscription, current_period_end: null, cancel_at_period_end: 0, stripe_customer_id: null } as T) : (null as T);
          }
          if (sql.includes("FROM site_form_submissions WHERE id = ? AND site_id = ?")) {
            const row = submissions.find((submission) => submission.id === bound[0] && submission.site_id === bound[1]);
            return (row ? { ...row } : null) as T;
          }
          return null as T;
        },
        async all<T = unknown>() {
          if (sql.includes("FROM site_form_submissions WHERE site_id = ? ORDER BY")) {
            return { results: submissions.filter((submission) => submission.site_id === bound[0]) as T[], success: true, meta: { changes: 0 } } as D1Result<T>;
          }
          return { results: [] as T[], success: true, meta: { changes: 0 } } as D1Result<T>;
        },
        async run() {
          if (sql.includes("INSERT INTO site_form_submissions")) {
            submissions.push({
              id: String(bound[0]),
              site_id: String(bound[1]),
              form_key: String(bound[2]),
              fields_json: String(bound[3]),
              field_count: Number(bound[4]),
              source_path: bound[5] === null ? null : String(bound[5]),
              submitter_email: bound[6] === null ? null : String(bound[6]),
              ip_hash: String(bound[7]),
              user_agent_hash: bound[8] === null ? null : String(bound[8]),
              // notification_status is a literal 'pending' in the INSERT, so created_at is bound[9].
              notification_status: "pending",
              notification_error: null,
              notification_message_id: null,
              created_at: String(bound[9])
            });
          }
          if (sql.includes("UPDATE site_form_submissions SET notification_status = 'sent'")) {
            const row = submissions.find((submission) => submission.id === bound[1]);
            if (row) {
              row.notification_status = "sent";
              row.notification_message_id = String(bound[0]);
            }
          }
          if (sql.includes("UPDATE site_form_submissions SET notification_status = 'email_failed'")) {
            const row = submissions.find((submission) => submission.id === bound[1]);
            if (row) {
              row.notification_status = "email_failed";
              row.notification_error = String(bound[0]);
            }
          }
          if (sql.includes("UPDATE site_form_submissions SET notification_status = 'email_not_configured'")) {
            const row = submissions.find((submission) => submission.id === bound[0]);
            if (row) row.notification_status = "email_not_configured";
          }
          if (sql.includes("UPDATE site_form_submissions SET notification_status = 'owner_email_missing'")) {
            const row = submissions.find((submission) => submission.id === bound[0]);
            if (row) row.notification_status = "owner_email_missing";
          }
          return { success: true, meta: { changes: 1 } } as D1Result;
        }
      } as unknown as D1PreparedStatement;
      return statement;
    },
    batch: async () => [],
    exec: async () => ({ count: 0, duration: 0 })
  } as unknown as D1Database;

  const bucket = {
    async get(key: string) {
      if (key !== "sites/s1/revisions/rev1/index.html") return null;
      return {
        body: html,
        async text() {
          return html;
        },
        writeHttpMetadata(headers: Headers) {
          headers.set("Content-Type", "text/html; charset=utf-8");
          headers.set("Content-Length", String(new TextEncoder().encode(html).byteLength));
        }
      } as unknown as R2ObjectBody;
    }
  } as unknown as R2Bucket;

  const email = options.includeEmail === false ? undefined : {
    async send(message: SentEmail) {
      if (options.failEmail) throw new Error("simulated form email failure");
      sentEmails.push(message);
      return { messageId: "form_message_test" };
    }
  };

  return {
    env: {
      DB: db,
      HTML_BUCKET: bucket,
      EMAIL: email,
      APP_HOST: "giga-site.com",
      APP_BASE_PATH: "/app",
      PREVIEW_HOST_SUFFIX: ".giga-site.com",
      EMAIL_FROM: "no-reply@giga-site.com",
      SESSION_TTL_SECONDS: "86400"
    } as unknown as Env,
    submissions,
    sentEmails
  };
}

function previewPost(body: unknown, cookie?: string) {
  return new Request("https://demo.giga-site.com/__giga/forms/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "cf-connecting-ip": "203.0.113.30",
      "user-agent": "vitest",
      ...(cookie ? { Cookie: cookie } : {})
    },
    body: JSON.stringify(body)
  });
}

function adminAppAs(userId: string) {
  return createApiApp({
    sessionResolver: async () => ({
      user: { id: userId, email: `${userId}@example.test`, name: userId },
      session: { id: "session_test", userId, token: "token", expiresAt: new Date(Date.now() + 60000), createdAt: new Date(), updatedAt: new Date() }
    })
  });
}

function adminApp() {
  return adminAppAs(OWNER);
}

function rawPost(body: string, contentType: string) {
  return new Request("https://demo.giga-site.com/__giga/forms/submit", {
    method: "POST",
    headers: { "Content-Type": contentType, "cf-connecting-ip": "203.0.113.30", "user-agent": "vitest" },
    body
  });
}

describe("フォーム便 MVP", () => {
  it("injects the data-giga-form bridge into Team-and-up public HTML", async () => {
    const { env } = makeEnv();
    const response = await handlePreviewRequest(new Request("https://demo.giga-site.com/"), env);
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("data-giga-form-bridge");
    expect(html).toContain("/__giga/forms/submit");
  });

  it("does not inject or accept フォーム便 submissions below the Pro plan (free)", async () => {
    const { env, submissions, sentEmails } = makeEnv({ subscription: null });

    const page = await handlePreviewRequest(new Request("https://demo.giga-site.com/"), env);
    expect(await page.text()).not.toContain("data-giga-form-bridge");

    const response = await handlePreviewRequest(previewPost({ formKey: "contact", fields: [{ name: "name", value: "田中" }] }), env);
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({ error: "plan_required", details: { requiredPlan: "Pro" } });
    expect(submissions).toHaveLength(0);
    expect(sentEmails).toHaveLength(0);
  });

  it("stores explicit data-giga-form submissions, emails the owner, and exposes list/detail to the owner", async () => {
    const { env, submissions, sentEmails } = makeEnv();
    const submit = await handlePreviewRequest(
      previewPost({
        formKey: "contact",
        sourcePath: "/request?from=lp",
        fields: [
          { name: "name", value: "田中" },
          { name: "message", value: "資料請求したいです" }
        ]
      }),
      env
    );

    expect(submit.status).toBe(200);
    expect(submissions).toHaveLength(1);
    expect(submissions[0]?.form_key).toBe("contact");
    expect(submissions[0]?.source_path).toBe("/request?from=lp");
    expect(submissions[0]?.notification_status).toBe("sent");
    expect(sentEmails).toHaveLength(1);
    expect(sentEmails[0]?.to).toBe("owner@example.test");
    expect(sentEmails[0]?.subject).toContain("フォーム便");
    expect(sentEmails[0]?.text).toContain("資料請求したいです");

    const list = await adminApp().fetch(new Request("https://giga-site.com/api/sites/s1/form-submissions"), env);
    const listBody = (await list.json()) as { submissions: Array<{ id: string; formKey: string; fieldPreview: Array<{ name: string; value: string }>; notificationStatus: string }> };
    expect(list.status).toBe(200);
    expect(listBody.submissions[0]?.formKey).toBe("contact");
    expect(listBody.submissions[0]?.fieldPreview[0]).toEqual({ name: "name", value: "田中" });
    expect(listBody.submissions[0]?.notificationStatus).toBe("sent");

    const detail = await adminApp().fetch(new Request(`https://giga-site.com/api/sites/s1/form-submissions/${listBody.submissions[0]?.id}`), env);
    const detailBody = (await detail.json()) as { submission: { fields: Array<{ name: string; value: string }> } };
    expect(detail.status).toBe(200);
    expect(detailBody.submission.fields.map((field) => field.name)).toEqual(["name", "message"]);
  });

  it("downloads CSV with dynamic form columns and spreadsheet-safe cells", async () => {
    const { env } = makeEnv();
    const submit = await handlePreviewRequest(
      previewPost({
        formKey: "lead",
        fields: [
          { name: "email", value: "lead@example.com" },
          { name: "memo", value: "=IMPORTXML(\"https://evil.example\")" }
        ]
      }),
      env
    );
    expect(submit.status).toBe(200);

    const csv = await adminApp().fetch(new Request("https://giga-site.com/api/sites/s1/form-submissions.csv"), env);
    const body = await csv.text();

    expect(csv.status).toBe(200);
    expect(csv.headers.get("Content-Type")).toContain("text/csv");
    expect(csv.headers.get("Content-Disposition")).toContain("form-submissions-s1.csv");
    expect(body.split("\n")[0]).toContain("email");
    expect(body).toContain("lead@example.com");
    expect(body).toContain("' =IMPORTXML".replace("' ", "'"));
  });

  it("keeps submissions accepted when owner notification email fails and records the failure", async () => {
    const { env, submissions, sentEmails } = makeEnv({ failEmail: true });
    const response = await handlePreviewRequest(previewPost({ formKey: "contact", fields: [{ name: "message", value: "通知失敗でも保存する" }] }), env);

    expect(response.status).toBe(200);
    expect(submissions).toHaveLength(1);
    expect(submissions[0]?.notification_status).toBe("email_failed");
    expect(submissions[0]?.notification_error).toContain("simulated form email failure");
    expect(sentEmails).toHaveLength(0);
  });

  it("requires preview viewer auth for protected form submissions and records the viewer email", async () => {
    const { env, submissions } = makeEnv({ site: { auth_mode: "email_otp", allowed_emails: JSON.stringify(["viewer@example.com"]) }, viewerEmail: "viewer@example.com" });

    const unauthenticated = await handlePreviewRequest(previewPost({ formKey: "lead", fields: [{ name: "email", value: "lead@example.com" }] }), env);
    expect(unauthenticated.status).toBe(401);

    const authenticated = await handlePreviewRequest(previewPost({ formKey: "lead", fields: [{ name: "email", value: "lead@example.com" }] }, "ai_slop_preview_session=viewer_session"), env);
    expect(authenticated.status).toBe(200);
    expect(submissions[0]?.submitter_email).toBe("viewer@example.com");
  });

  it("rejects oversized field sets before storing", async () => {
    const { env, submissions } = makeEnv();
    const response = await handlePreviewRequest(previewPost({ formKey: "contact", fields: Array.from({ length: 51 }, (_, index) => ({ name: `field_${index}`, value: "x" })) }), env);

    expect(response.status).toBe(400);
    expect(((await response.json()) as { error: string }).error).toBe("invalid_form_fields");
    expect(submissions).toHaveLength(0);
  });
});

describe("フォーム便 スパム・乱用対策", () => {
  it("silently drops honeypot-filled submissions (200, not stored, no email)", async () => {
    const { env, submissions, sentEmails } = makeEnv();
    const response = await handlePreviewRequest(previewPost({ formKey: "contact", fields: [{ name: "name", value: "bot" }], honeypot: "i am a bot" }), env);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ accepted: true });
    expect(submissions).toHaveLength(0);
    expect(sentEmails).toHaveLength(0);
  });

  it("rate limits at FORM_RATE_LIMIT_MAX per IP window (20 blocks with 429, 19 still passes)", async () => {
    const blocked = makeEnv({ recentCount: 20 });
    const blockedRes = await handlePreviewRequest(previewPost({ formKey: "contact", fields: [{ name: "name", value: "x" }] }), blocked.env);
    expect(blockedRes.status).toBe(429);
    expect(((await blockedRes.json()) as { error: string }).error).toBe("too_many_form_submissions");
    expect(blocked.submissions).toHaveLength(0);

    const allowed = makeEnv({ recentCount: 19 });
    const allowedRes = await handlePreviewRequest(previewPost({ formKey: "contact", fields: [{ name: "name", value: "x" }] }), allowed.env);
    expect(allowedRes.status).toBe(200);
    expect(allowed.submissions).toHaveLength(1);
  });
});

describe("フォーム便 入力検証・XSS", () => {
  it("rejects form keys and field names containing HTML delimiters or control chars", async () => {
    const { env, submissions } = makeEnv();

    const badKey = await handlePreviewRequest(previewPost({ formKey: "<script>", fields: [{ name: "a", value: "b" }] }), env);
    expect(badKey.status).toBe(400);
    expect(((await badKey.json()) as { error: string }).error).toBe("invalid_form_key");

    const badName = await handlePreviewRequest(previewPost({ formKey: "contact", fields: [{ name: "a<b", value: "c" }] }), env);
    expect(badName.status).toBe(400);
    expect(((await badName.json()) as { error: string }).error).toBe("invalid_form_fields");

    const controlChar = await handlePreviewRequest(previewPost({ formKey: "contact", fields: [{ name: "a\u0001b", value: "c" }] }), env);
    expect(controlChar.status).toBe(400);

    expect(submissions).toHaveLength(0);
  });

  it("HTML-escapes submitted values in the owner notification email", async () => {
    const { env, sentEmails } = makeEnv();
    const response = await handlePreviewRequest(previewPost({ formKey: "contact", fields: [{ name: "message", value: "<script>alert(1)</script>" }] }), env);

    expect(response.status).toBe(200);
    expect(sentEmails).toHaveLength(1);
    expect(sentEmails[0]?.html).toContain("&lt;script&gt;");
    expect(sentEmails[0]?.html).not.toContain("<script>alert(1)");
  });

  it("strips newlines from the notification subject (header-injection defense)", async () => {
    const { env, sentEmails } = makeEnv({ site: { title: "Evil\nBcc: attacker@example.com" } });
    const response = await handlePreviewRequest(previewPost({ formKey: "contact", fields: [{ name: "a", value: "b" }] }), env);

    expect(response.status).toBe(200);
    expect(sentEmails).toHaveLength(1);
    expect(sentEmails[0]?.subject).not.toContain("\n");
    expect(sentEmails[0]?.subject).not.toContain("\r");
    expect(sentEmails[0]?.subject).toContain("フォーム便");
  });
});

describe("フォーム便 受信経路・契約", () => {
  it("rejects non-POST methods, unsupported content types, and oversized bodies", async () => {
    const { env } = makeEnv();

    const get = await handlePreviewRequest(new Request("https://demo.giga-site.com/__giga/forms/submit", { method: "GET", headers: { "cf-connecting-ip": "203.0.113.30", "user-agent": "vitest" } }), env);
    expect(get.status).toBe(405);

    const badType = await handlePreviewRequest(rawPost("hello", "text/plain"), env);
    expect(badType.status).toBe(415);

    const tooBig = await handlePreviewRequest(previewPost({ formKey: "contact", fields: [{ name: "a", value: "x".repeat(70_000) }] }), env);
    expect(tooBig.status).toBe(413);
  });

  it("accepts native form posts (application/x-www-form-urlencoded) without the JS bridge", async () => {
    const { env, submissions } = makeEnv();
    const response = await handlePreviewRequest(
      rawPost("_giga_form=contact&name=%E7%94%B0%E4%B8%AD&message=hello", "application/x-www-form-urlencoded"),
      env
    );

    expect(response.status).toBe(200);
    expect(submissions).toHaveLength(1);
    expect(submissions[0]?.form_key).toBe("contact");
    expect(submissions[0]?.field_count).toBe(2);
  });

  it("returns {accepted:true,id} and records null submitter email for public sites", async () => {
    const { env, submissions } = makeEnv();
    const response = await handlePreviewRequest(previewPost({ formKey: "contact", fields: [{ name: "name", value: "x" }] }), env);

    const body = (await response.json()) as { accepted: boolean; id: string };
    expect(response.status).toBe(200);
    expect(body.accepted).toBe(true);
    expect(typeof body.id).toBe("string");
    expect(submissions[0]?.submitter_email).toBeNull();
  });

  it("blocks form submissions to disabled, deleted, or expired sites with 404", async () => {
    for (const override of [{ status: "disabled" }, { deleted_at: "2026-06-01T00:00:00.000Z" }, { expires_at: "2020-01-01T00:00:00.000Z" }]) {
      const { env, submissions } = makeEnv({ site: override });
      const response = await handlePreviewRequest(previewPost({ formKey: "contact", fields: [{ name: "a", value: "b" }] }), env);
      expect(response.status).toBe(404);
      expect(submissions).toHaveLength(0);
    }
  });
});

describe("フォーム便 認可・プランゲート(管理API)", () => {
  it("denies cross-tenant access to another owner's submissions with 404", async () => {
    const { env } = makeEnv();
    await handlePreviewRequest(previewPost({ formKey: "contact", fields: [{ name: "name", value: "x" }] }), env);

    const intruder = adminAppAs("intruder_user");
    const list = await intruder.fetch(new Request("https://giga-site.com/api/sites/s1/form-submissions"), env);
    expect(list.status).toBe(404);
    const csv = await intruder.fetch(new Request("https://giga-site.com/api/sites/s1/form-submissions.csv"), env);
    expect(csv.status).toBe(404);
    const detail = await intruder.fetch(new Request("https://giga-site.com/api/sites/s1/form-submissions/anything"), env);
    expect(detail.status).toBe(404);
  });

  it("blocks the read endpoints (list/detail/CSV) below the Pro plan (free) with 403", async () => {
    const { env } = makeEnv({ subscription: null });

    const list = await adminApp().fetch(new Request("https://giga-site.com/api/sites/s1/form-submissions"), env);
    expect(list.status).toBe(403);
    await expect(list.json()).resolves.toMatchObject({ error: "plan_required", details: { requiredPlan: "Pro" } });

    const csv = await adminApp().fetch(new Request("https://giga-site.com/api/sites/s1/form-submissions.csv"), env);
    expect(csv.status).toBe(403);

    const detail = await adminApp().fetch(new Request("https://giga-site.com/api/sites/s1/form-submissions/x"), env);
    expect(detail.status).toBe(403);
  });
});

describe("フォーム便 通知ステータス・waitUntil", () => {
  it("records email_not_configured when no email binding is present", async () => {
    const { env, submissions, sentEmails } = makeEnv({ includeEmail: false });
    const response = await handlePreviewRequest(previewPost({ formKey: "contact", fields: [{ name: "a", value: "b" }] }), env);

    expect(response.status).toBe(200);
    expect(submissions[0]?.notification_status).toBe("email_not_configured");
    expect(sentEmails).toHaveLength(0);
  });

  it("records owner_email_missing when the owner has no email on file", async () => {
    const { env, submissions } = makeEnv({ ownerEmail: null });
    const response = await handlePreviewRequest(previewPost({ formKey: "contact", fields: [{ name: "a", value: "b" }] }), env);

    expect(response.status).toBe(200);
    expect(submissions[0]?.notification_status).toBe("owner_email_missing");
  });

  it("defers owner notification to ctx.waitUntil and still emails after the response", async () => {
    const { env, submissions, sentEmails } = makeEnv();
    const deferred: Promise<unknown>[] = [];
    const ctx = { waitUntil: (promise: Promise<unknown>) => { deferred.push(Promise.resolve(promise)); } };

    const response = await handlePreviewRequest(previewPost({ formKey: "contact", fields: [{ name: "name", value: "x" }] }), env, ctx);

    expect(response.status).toBe(200);
    expect(submissions).toHaveLength(1);
    // The owner notification is handed to ctx.waitUntil (background) instead of being awaited
    // inline before the visitor's response, so exactly one deferred task is registered.
    expect(deferred).toHaveLength(1);

    await Promise.all(deferred);
    expect(sentEmails).toHaveLength(1);
    expect(submissions[0]?.notification_status).toBe("sent");
  });
});
