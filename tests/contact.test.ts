import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ContactPage } from "../src/client/ContactPage";
import { LandingPage } from "../src/client/LandingPage";
import { createApiApp } from "../src/worker/api";

interface StoredContact {
  id: string;
  email: string;
  ipHash: string;
  status: string;
  error: string | null;
}

function contactEnv(options: { recentCount?: number; failEmail?: boolean; includeEmail?: boolean } = {}) {
  const contacts: StoredContact[] = [];
  const sentEmails: Array<{ to: string; from: string | { email: string; name: string }; subject: string; text?: string; html?: string }> = [];
  const db = {
    prepare(sql: string) {
      let bound: unknown[] = [];
      const statement = {
        bind(...args: unknown[]) {
          bound = args;
          return statement;
        },
        async first<T = unknown>() {
          if (sql.includes("FROM contact_messages")) {
            return { total: options.recentCount ?? contacts.length } as T;
          }
          return null as T;
        },
        async all<T = unknown>() {
          return { results: [] as T[], success: true, meta: { changes: 0 } } as D1Result<T>;
        },
        async run() {
          if (sql.includes("INSERT INTO contact_messages")) {
            contacts.push({ id: String(bound[0]), email: String(bound[2]), ipHash: String(bound[7]), status: "received", error: null });
          }
          if (sql.includes("UPDATE contact_messages SET status = 'sent'")) {
            const contact = contacts.find((item) => item.id === bound[0]);
            if (contact) contact.status = "sent";
          }
          if (sql.includes("UPDATE contact_messages SET status = 'email_failed'")) {
            const contact = contacts.find((item) => item.id === bound[1]);
            if (contact) {
              contact.status = "email_failed";
              contact.error = String(bound[0]);
            }
          }
          return { success: true, meta: { changes: 1 } } as D1Result;
        }
      } as unknown as D1PreparedStatement;
      return statement;
    },
    batch: async () => [],
    exec: async () => ({ count: 0, duration: 0 })
  } as unknown as D1Database;

  const email = options.includeEmail === false
    ? undefined
    : {
        async send(message: { to: string; from: string | { email: string; name: string }; subject: string; text?: string; html?: string }) {
          if (options.failEmail) {
            throw new Error("simulated mail failure with a deliberately long diagnostic message");
          }
          sentEmails.push(message);
          return { messageId: "contact_message_test" };
        }
      };

  return {
    env: {
      DB: db,
      EMAIL: email,
      APP_HOST: "giga-site.com",
      APP_BASE_PATH: "/app",
      PREVIEW_HOST_SUFFIX: ".giga-site.com",
      EMAIL_FROM: "no-reply@giga-site.com",
      CONTACT_TO: "kan@2-38.com"
    } as unknown as Env,
    contacts,
    sentEmails
  };
}

function contactRequest(body: Record<string, unknown>) {
  return new Request("https://giga-site.com/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "cf-connecting-ip": "203.0.113.10",
      "user-agent": "vitest"
    },
    body: JSON.stringify(body)
  });
}

describe("contact page", () => {
  it("links to contact from the landing page", () => {
    const html = renderToStaticMarkup(createElement(LandingPage));

    expect(html).toContain("/contact");
    expect(html).toContain("お問い合わせ");
    expect(html).not.toContain("導入相談");
  });

  it("renders the support contact form without internal delivery or reply-time copy", () => {
    const html = renderToStaticMarkup(createElement(ContactPage));

    expect(html).toContain("お問い合わせ");
    expect(html).not.toContain("導入相談");
    expect(html).toContain("問い合わせを送信");
    expect(html).not.toContain("kan@2-38.com");
    expect(html).not.toContain("内容は");
    expect(html).not.toContain("届きます");
    expect(html).not.toContain("返信目安");
    expect(html).not.toContain("通常1〜2営業日以内");
  });
});

describe("contact API", () => {
  it("accepts public contact submissions and emails kan", async () => {
    const { env, contacts, sentEmails } = contactEnv();

    const response = await createApiApp().fetch(
      contactRequest({
        name: "田中 太郎",
        email: "TANAKA@example.com",
        company: "Acme株式会社",
        category: "question",
        message: "公開したサイトの認証方式について教えてください。",
        sourcePath: "/contact?type=question"
      }),
      env
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ accepted: true });
    expect(contacts).toHaveLength(1);
    expect(contacts[0]?.email).toBe("tanaka@example.com");
    expect(contacts[0]?.status).toBe("sent");
    expect(sentEmails).toHaveLength(1);
    expect(sentEmails[0]?.to).toBe("kan@2-38.com");
    expect(sentEmails[0]?.subject).toContain("サービスへの質問");
    expect(sentEmails[0]?.text).toContain("公開したサイトの認証方式について教えてください。");
  });

  it("rejects invalid email addresses", async () => {
    const { env, sentEmails } = contactEnv();

    const response = await createApiApp().fetch(
      contactRequest({ name: "田中", email: "not-an-email", message: "導入相談したいです。" }),
      env
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: "invalid_email" });
    expect(sentEmails).toHaveLength(0);
  });

  it("rejects newline-bearing names before building email headers", async () => {
    const { env, contacts, sentEmails } = contactEnv();

    const response = await createApiApp().fetch(
      contactRequest({ name: "Alice\r\nBcc: victim@example.com", email: "alice@example.com", message: "導入相談したいです。" }),
      env
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: "invalid_name" });
    expect(contacts).toHaveLength(0);
    expect(sentEmails).toHaveLength(0);
  });

  it("rate limits repeated submissions by email or IP", async () => {
    const { env, sentEmails } = contactEnv({ recentCount: 3 });

    const response = await createApiApp().fetch(
      contactRequest({ name: "田中", email: "tanaka@example.com", message: "導入相談したいです。" }),
      env
    );

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toMatchObject({ error: "too_many_contact_requests" });
    expect(sentEmails).toHaveLength(0);
  });

  it("silently accepts honeypot submissions without storing or emailing them", async () => {
    const { env, contacts, sentEmails } = contactEnv();

    const response = await createApiApp().fetch(
      contactRequest({ name: "Bot", email: "bot@example.com", message: "導入相談をしたいです。", website: "https://spam.example" }),
      env
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ accepted: true });
    expect(contacts).toHaveLength(0);
    expect(sentEmails).toHaveLength(0);
  });

  it("returns a safe failure and records email_failed when Cloudflare email send fails", async () => {
    const { env, contacts, sentEmails } = contactEnv({ failEmail: true });

    const response = await createApiApp().fetch(
      contactRequest({ name: "田中", email: "tanaka@example.com", category: "billing", message: "料金について詳しく相談したいです。" }),
      env
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({ error: "contact_email_send_failed" });
    expect(sentEmails).toHaveLength(0);
    expect(contacts).toHaveLength(1);
    expect(contacts[0]?.status).toBe("email_failed");
    expect(contacts[0]?.error).toContain("simulated mail failure");
  });

  it("escapes user-provided HTML in notification emails", async () => {
    const { env, sentEmails } = contactEnv();

    const response = await createApiApp().fetch(
      contactRequest({
        name: "<script>alert(1)</script>",
        email: "safe@example.com",
        company: "<img src=x onerror=alert(1)>",
        message: "<script>alert('message')</script> 導入相談をしたいです。",
        sourcePath: "/contact?<script>"
      }),
      env
    );

    expect(response.status).toBe(200);
    const html = sentEmails[0]?.html ?? "";
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
  });

  it("rejects contact submissions before DB writes when email binding is not configured", async () => {
    const { env, contacts } = contactEnv({ includeEmail: false });

    const response = await createApiApp().fetch(
      contactRequest({ name: "田中", email: "tanaka@example.com", message: "導入相談したいです。" }),
      env
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ error: "email_not_configured" });
    expect(contacts).toHaveLength(0);
  });
});
