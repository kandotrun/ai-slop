import { describe, expect, it } from "vitest";
import { handlePreviewEmailDomainAuth, isAllowedEmailForDomains, isAllowedEmailInList } from "../src/worker/preview";

const site = {
  id: "site_victim",
  owner_user_id: "owner_test",
  slug: "victim",
  title: "Victim",
  status: "active",
  auth_mode: "email_domain",
  password_hash: null,
  allowed_email_domains: '["corp.example"]',
  expires_at: null,
  current_revision_id: "rev_test",
  created_at: "2026-06-19T00:00:00.000Z",
  updated_at: "2026-06-19T00:00:00.000Z",
  deleted_at: null,
  indexing_enabled: 0
};

interface SentEmail {
  text?: string;
}

interface EmailBuilderMessage {
  text?: string;
}

interface StoredChallenge {
  id: string;
  siteId: string;
  email: string;
  emailDomain: string;
  codeHash: string;
  returnTo: string;
  attempts: number;
  expiresAt: string;
  consumedAt: string | null;
  createdAt: string;
}

function authEnv(siteOverrides: Record<string, unknown> = {}) {
  const sentEmails: SentEmail[] = [];
  const challenges: StoredChallenge[] = [];
  const accessEvents: unknown[][] = [];
  const currentSite = { ...site, ...siteOverrides };
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
            return currentSite as T;
          }
          if (sql.includes("FROM email_otp_challenges")) {
            const challenge = challenges.find((item) => item.id === bound[0] && item.siteId === bound[1]);
            if (!challenge) {
              return null as T;
            }
            return {
              id: challenge.id,
              site_id: challenge.siteId,
              email: challenge.email,
              email_domain: challenge.emailDomain,
              code_hash: challenge.codeHash,
              return_to: challenge.returnTo,
              attempts: challenge.attempts,
              expires_at: challenge.expiresAt,
              consumed_at: challenge.consumedAt,
              created_at: challenge.createdAt
            } as T;
          }
          throw new Error(`Unexpected first SQL: ${sql} ${JSON.stringify(bound)}`);
        },
        async run() {
          if (sql.includes("INSERT INTO email_otp_challenges")) {
            challenges.push({
              id: String(bound[0]),
              siteId: String(bound[1]),
              email: String(bound[2]),
              emailDomain: String(bound[3]),
              codeHash: String(bound[4]),
              returnTo: String(bound[5]),
              attempts: 0,
              expiresAt: String(bound[6]),
              consumedAt: null,
              createdAt: String(bound[7])
            });
            return { success: true, meta: { changes: 1 } } as D1Result;
          }
          if (sql.includes("INSERT INTO access_events")) {
            accessEvents.push(bound);
            return { success: true, meta: { changes: 1 } } as D1Result;
          }
          if (sql.includes("UPDATE email_otp_challenges SET consumed_at")) {
            const challenge = challenges.find((item) => item.id === bound[1]);
            if (challenge) {
              challenge.consumedAt = String(bound[0]);
            }
            return { success: true, meta: { changes: challenge ? 1 : 0 } } as D1Result;
          }
          if (sql.includes("UPDATE email_otp_challenges SET attempts")) {
            const challenge = challenges.find((item) => item.id === bound[0]);
            if (challenge) {
              challenge.attempts += 1;
            }
            return { success: true, meta: { changes: challenge ? 1 : 0 } } as D1Result;
          }
          if (sql.includes("INSERT INTO viewer_sessions")) {
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

  const email = {
    async send(message: EmailMessage) {
      const builder = message as unknown as EmailBuilderMessage;
      sentEmails.push({ text: builder.text });
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
    challenges,
    currentSite
  };
}

function emailAuthRequest(hostname: string, body: URLSearchParams): Request {
  return new Request(`https://${hostname}/preview-email-auth/site_victim`, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });
}

describe("email domain auth helpers", () => {
  it("allows exact lower-cased domains", () => {
    expect(isAllowedEmailForDomains("user@example.co.jp", ["example.co.jp"])).toBe(true);
    expect(isAllowedEmailForDomains("USER@EXAMPLE.CO.JP", ["example.co.jp"])).toBe(true);
  });

  it("rejects unrelated or malformed addresses", () => {
    expect(isAllowedEmailForDomains("user@evil.example.co.jp", ["example.co.jp"])).toBe(false);
    expect(isAllowedEmailForDomains("user@example.com", ["example.co.jp"])).toBe(false);
    expect(isAllowedEmailForDomains("not-an-email", ["example.co.jp"])).toBe(false);
  });

  it("checks exact email allowlists case-insensitively", () => {
    expect(isAllowedEmailInList("USER@EXAMPLE.COM", ["user@example.com"])).toBe(true);
    expect(isAllowedEmailInList("other@example.com", ["user@example.com"])).toBe(false);
    expect(isAllowedEmailInList("user+alias@example.com", ["user@example.com"])).toBe(false);
  });

  it("rejects OTP creation from a different preview host", async () => {
    const { env, sentEmails, challenges } = authEnv();
    const response = await handlePreviewEmailDomainAuth(
      emailAuthRequest("evil.giga-site.com", new URLSearchParams({ email: "employee@corp.example", returnTo: "/phish.html" })),
      env
    );

    expect(response.status).toBe(404);
    expect(sentEmails).toHaveLength(0);
    expect(challenges).toHaveLength(0);
  });

  it("uses the canonical site preview URL in OTP emails", async () => {
    const { env, sentEmails, challenges } = authEnv();
    const response = await handlePreviewEmailDomainAuth(
      emailAuthRequest("victim.giga-site.com", new URLSearchParams({ email: "employee@corp.example", returnTo: "/secret.html" })),
      env
    );

    expect(response.status).toBe(200);
    expect(challenges).toHaveLength(1);
    expect(sentEmails).toHaveLength(1);
    expect(sentEmails[0]?.text).toContain("ページ: https://victim.giga-site.com/secret.html");
  });

  it("sanitizes unsafe returnTo values before storing challenges or sending emails", async () => {
    const { env, sentEmails, challenges } = authEnv();
    const response = await handlePreviewEmailDomainAuth(
      emailAuthRequest("victim.giga-site.com", new URLSearchParams({ email: "employee@corp.example", returnTo: "//evil.example/phish" })),
      env
    );

    expect(response.status).toBe(200);
    expect(challenges).toHaveLength(1);
    expect(challenges[0]?.returnTo).toBe("/");
    expect(sentEmails[0]?.text).toContain("ページ: https://victim.giga-site.com/");
    expect(sentEmails[0]?.text).not.toContain("evil.example");
  });

  it("rejects OTP redemption after the challenge email is removed from allowed domains", async () => {
    const { env, challenges, currentSite } = authEnv();
    await handlePreviewEmailDomainAuth(
      emailAuthRequest("victim.giga-site.com", new URLSearchParams({ email: "employee@corp.example", returnTo: "/secret.html" })),
      env
    );
    const challenge = challenges[0];
    expect(challenge).toBeDefined();

    currentSite.allowed_email_domains = '["other.example"]';
    const response = await handlePreviewEmailDomainAuth(
      emailAuthRequest(
        "victim.giga-site.com",
        new URLSearchParams({ challengeId: challenge.id, code: "000000", returnTo: "/secret.html" })
      ),
      env
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toBeNull();
  });
});
