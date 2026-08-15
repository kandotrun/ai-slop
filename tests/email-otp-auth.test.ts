import { describe, expect, it } from "vitest";
import { handlePreviewEmailDomainAuth, isAllowedEmailInList } from "../src/worker/preview";

const site = {
  id: "site_otp",
  owner_user_id: "owner_test",
  slug: "otp",
  title: "Allowlist demo",
  status: "active",
  auth_mode: "email_otp",
  password_hash: null,
  allowed_email_domains: null,
  allowed_emails: '["tanaka@example.com","sato@example.com"]',
  indexing_enabled: 0,
  hide_branding: 0,
  tool: null,
  expires_at: null,
  current_revision_id: "rev_test",
  created_at: "2026-06-19T00:00:00.000Z",
  updated_at: "2026-06-19T00:00:00.000Z",
  deleted_at: null
};

interface StoredChallenge {
  id: string;
  siteId: string;
  email: string;
}

function authEnv() {
  const sentEmails: string[] = [];
  const challenges: StoredChallenge[] = [];
  const db = {
    prepare(sql: string) {
      let bound: unknown[] = [];
      const statement = {
        bind(...args: unknown[]) {
          bound = args;
          return statement;
        },
        async first<T = unknown>() {
          if (sql.includes("FROM sites WHERE id")) {
            return site as T;
          }
          return null as T;
        },
        async run() {
          if (sql.includes("INSERT INTO email_otp_challenges")) {
            const siteId = String(bound[1]);
            const email = String(bound[2]);
            if (sql.includes("WHERE NOT EXISTS") && challenges.some((challenge) => challenge.siteId === siteId && challenge.email === email)) {
              return { success: true, meta: { changes: 0 } } as D1Result;
            }
            challenges.push({ id: String(bound[0]), siteId, email });
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

  const email = {
    async send(message: EmailMessage) {
      sentEmails.push((message as unknown as { text?: string }).text ?? "");
      return { messageId: "message_test" };
    }
  } as unknown as SendEmail;

  return {
    env: {
      DB: db,
      APP_HOST: "giga-site.com",
      APP_BASE_PATH: "/app",
      PREVIEW_HOST_SUFFIX: ".giga-site.com",
      EMAIL_FROM: "no-reply@giga-site.com",
      EMAIL: email,
      SESSION_TTL_SECONDS: "86400"
    } as unknown as Env,
    sentEmails,
    challenges
  };
}

function authRequest(body: URLSearchParams): Request {
  return new Request("https://otp.giga-site.com/preview-email-auth/site_otp", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });
}

describe("email allowlist (OTP) auth", () => {
  it("matches exact addresses case-insensitively", () => {
    expect(isAllowedEmailInList("tanaka@example.com", ["tanaka@example.com"])).toBe(true);
    expect(isAllowedEmailInList("TANAKA@EXAMPLE.COM", ["tanaka@example.com"])).toBe(true);
    expect(isAllowedEmailInList("other@example.com", ["tanaka@example.com"])).toBe(false);
    expect(isAllowedEmailInList("tanaka@evil.com", ["tanaka@example.com"])).toBe(false);
  });

  it("sends an OTP only to an allow-listed address", async () => {
    const { env, sentEmails, challenges } = authEnv();
    const response = await handlePreviewEmailDomainAuth(
      authRequest(new URLSearchParams({ email: "tanaka@example.com", returnTo: "/deck.html" })),
      env
    );

    expect(response.status).toBe(200);
    expect(challenges).toHaveLength(1);
    expect(sentEmails).toHaveLength(1);
  });

  it("throttles repeated OTP sends for the same site and email", async () => {
    const { env, sentEmails, challenges } = authEnv();
    const body = () => new URLSearchParams({ email: "tanaka@example.com", returnTo: "/deck.html" });

    const first = await handlePreviewEmailDomainAuth(authRequest(body()), env);
    const second = await handlePreviewEmailDomainAuth(authRequest(body()), env);
    const secondHtml = await second.text();

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(challenges).toHaveLength(1);
    expect(sentEmails).toHaveLength(1);
    expect(secondHtml).toContain("時間を置いて");
  });

  it("refuses an address that is not on the allowlist", async () => {
    const { env, sentEmails, challenges } = authEnv();
    const response = await handlePreviewEmailDomainAuth(
      authRequest(new URLSearchParams({ email: "stranger@example.com", returnTo: "/deck.html" })),
      env
    );

    expect(response.status).toBe(200);
    expect(challenges).toHaveLength(0);
    expect(sentEmails).toHaveLength(0);
  });
});
