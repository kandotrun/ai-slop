import { describe, expect, it } from "vitest";
import { createApiApp } from "../src/worker/api";

const baseEnv = {
  APP_HOST: "giga-site.com",
  APP_BASE_PATH: "/app",
  PREVIEW_HOST_SUFFIX: ".giga-site.com",
  PAID_CHECKOUT_ENABLED: "false"
} as unknown as Env;

function authenticatedApp() {
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

function unauthenticatedApp() {
  return createApiApp({ sessionResolver: async () => null });
}

describe("API boundary hardening", () => {
  it("keeps health, auth bootstrap, and public Stripe config readable without a session", async () => {
    const app = unauthenticatedApp();

    const health = await app.fetch(new Request("https://giga-site.com/api/health"), baseEnv);
    const bootstrap = await app.fetch(new Request("https://giga-site.com/api/auth/bootstrap"), baseEnv);
    const stripeConfig = await app.fetch(new Request("https://giga-site.com/api/billing/stripe/config"), baseEnv);

    expect(health.status).toBe(200);
    await expect(health.json()).resolves.toMatchObject({ ok: true });
    expect(bootstrap.status).toBe(200);
    await expect(bootstrap.json()).resolves.toMatchObject({ authMethod: "email_otp", signupOpen: true });
    expect(stripeConfig.status).toBe(200);
    await expect(stripeConfig.json()).resolves.toMatchObject({ stripe: { paidCheckoutEnabled: false } });
  });

  it("keeps public contact open without a session but rejects malformed JSON before side effects", async () => {
    const response = await unauthenticatedApp().fetch(
      new Request("https://giga-site.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: "https://evil.example" },
        body: "{not-json"
      }),
      baseEnv
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: "invalid_json" });
  });

  it("requires a session for management APIs before any DB work", async () => {
    const response = await unauthenticatedApp().fetch(new Request("https://giga-site.com/api/slugs/availability?slug=demo"), baseEnv);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ error: "session_required" });
  });

  it("allows authenticated GET requests even when an Origin header is present", async () => {
    const response = await authenticatedApp().fetch(
      new Request("https://giga-site.com/api/me", { headers: { Origin: "https://evil.example" } }),
      baseEnv
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ user: { id: "owner_test", email: "owner@example.com" } });
  });

  it("blocks cross-origin state-changing management requests before route handlers run", async () => {
    const response = await authenticatedApp().fetch(
      new Request("https://giga-site.com/api/billing/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: "https://evil.example" },
        body: JSON.stringify({ planId: "team" })
      }),
      baseEnv
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({ error: "csrf_origin_denied" });
  });

  it("allows same-origin state-changing requests to reach endpoint validation", async () => {
    const response = await authenticatedApp().fetch(
      new Request("https://giga-site.com/api/billing/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: "https://giga-site.com" },
        body: JSON.stringify({ planId: "not-a-plan" })
      }),
      baseEnv
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ error: "paid_checkout_preparing" });
  });

  it("allows state-changing requests without browser Origin/Referer for server-side clients", async () => {
    const response = await authenticatedApp().fetch(
      new Request("https://giga-site.com/api/billing/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "not-a-plan" })
      }),
      baseEnv
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ error: "paid_checkout_preparing" });
  });

  it("blocks hostile Referer when Origin is absent", async () => {
    const response = await authenticatedApp().fetch(
      new Request("https://giga-site.com/api/billing/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Referer: "https://evil.example/page" },
        body: JSON.stringify({ planId: "team" })
      }),
      baseEnv
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({ error: "csrf_origin_denied" });
  });
});
