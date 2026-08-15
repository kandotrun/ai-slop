import { afterEach, describe, expect, it, vi } from "vitest";
import { createApiApp } from "../src/worker/api";
import { buildCheckoutSessionParams, getPublicStripeConfigStatus, getStripeConfigStatus } from "../src/worker/stripe";

const stripeEnv = {
  APP_HOST: "giga-site.com",
  APP_BASE_PATH: "/app",
  PAID_CHECKOUT_ENABLED: "true",
  STRIPE_SECRET_KEY: "sk_test_mock",
  STRIPE_PUBLISHABLE_KEY: "pk_test_mock"
} as unknown as Env;

interface TestBillingSubscriptionRow {
  id: string;
  owner_user_id: string;
  plan_id: string | null;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: number;
  stripe_customer_id: string | null;
}

function stripeEnvWithBilling(rows: TestBillingSubscriptionRow[] = [], trialRows: TestBillingSubscriptionRow[] = []): Env {
  const db = {
    prepare: (sql: string) => ({
      bind: (...values: unknown[]) => ({
        first: async <T>() => {
          if (sql.includes("FROM billing_plan_trials")) {
            const row = trialRows.find((item) => item.plan_id === values[0] && (item.owner_user_id === values[1] || item.stripe_customer_id === values[3])) ?? null;
            return (row ? { id: row.id } : null) as T | null;
          }
          if (sql.includes("WHERE plan_id = ?")) {
            const row = rows.find((item) => item.plan_id === values[0] && (item.owner_user_id === values[1] || item.stripe_customer_id === values[3])) ?? null;
            return (row ? { id: row.id } : null) as T | null;
          }
          if (sql.includes("FROM billing_subscriptions WHERE owner_user_id = ?")) {
            return (rows[0] ?? null) as T | null;
          }
          return null;
        }
      })
    })
  };
  return { ...stripeEnv, DB: db } as unknown as Env;
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

describe("stripe billing helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reports test-mode Stripe config without exposing key values", () => {
    const status = getStripeConfigStatus(stripeEnv);

    expect(status).toEqual({
      configured: true,
      secretConfigured: true,
      publishableConfigured: true,
      mode: "test",
      publishableMode: "test",
      paidCheckoutEnabled: true,
      paidCheckoutDisabledReason: null,
      paidCheckoutDisabledTooltip: null,
      warnings: []
    });
    expect(JSON.stringify(status)).not.toContain("sk_test_mock");
    expect(JSON.stringify(status)).not.toContain("pk_test_mock");
  });

  it("exposes only public paid checkout availability without requiring a session", async () => {
    const response = await createApiApp().fetch(new Request("https://giga-site.com/api/billing/stripe/config"), {
      ...stripeEnv,
      PAID_CHECKOUT_ENABLED: "false"
    } as unknown as Env);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      stripe: {
        paidCheckoutEnabled: false,
        paidCheckoutDisabledTooltip: "現在準備中"
      }
    });
  });

  it("builds a public Stripe config DTO without deployment state", () => {
    const status = getPublicStripeConfigStatus({
      ...stripeEnv,
      PAID_CHECKOUT_ENABLED: "false",
      STRIPE_SECRET_KEY: "sk_live_mock",
      STRIPE_PUBLISHABLE_KEY: "pk_test_mock"
    });

    expect(status).toEqual({
      paidCheckoutEnabled: false,
      paidCheckoutDisabledTooltip: "現在準備中"
    });
    expect(JSON.stringify(status)).not.toContain("configured");
    expect(JSON.stringify(status)).not.toContain("mode");
    expect(JSON.stringify(status)).not.toContain("warnings");
  });

  it("builds a test checkout session body for the Team plan", () => {
    const params = buildCheckoutSessionParams(stripeEnv, "team");

    expect(params.get("mode")).toBe("subscription");
    expect(params.get("locale")).toBe("ja");
    expect(params.get("adaptive_pricing[enabled]")).toBe("false");
    expect(params.get("success_url")).toBe("https://giga-site.com/app/?billing=success&session_id={CHECKOUT_SESSION_ID}");
    expect(params.get("cancel_url")).toBe("https://giga-site.com/app/?billing=cancelled");
    expect(params.get("line_items[0][price_data][currency]")).toBe("jpy");
    expect(params.get("line_items[0][price_data][unit_amount]")).toBe("4980");
    expect(params.get("line_items[0][price_data][recurring][interval]")).toBe("month");
    expect(params.get("subscription_data[trial_period_days]")).toBe("14");
    expect(params.get("payment_method_collection")).toBe("always");
    expect(params.get("metadata[plan_id]")).toBe("team");
  });

  it("does not apply a free trial to non-Team subscription plans", () => {
    const personal = buildCheckoutSessionParams(stripeEnv, "personal_pro");
    const business = buildCheckoutSessionParams(stripeEnv, "business");

    expect(personal.get("subscription_data[trial_period_days]")).toBeNull();
    expect(business.get("subscription_data[trial_period_days]")).toBeNull();
  });

  it("builds a one-time checkout session body for the single-site 150 yen plan", () => {
    const params = buildCheckoutSessionParams(stripeEnv, "single_site", { user: { id: "owner_test", email: "owner@example.com" } });

    expect(params.get("mode")).toBe("payment");
    expect(params.get("line_items[0][price_data][currency]")).toBe("jpy");
    expect(params.get("line_items[0][price_data][unit_amount]")).toBe("150");
    expect(params.get("line_items[0][price_data][recurring][interval]")).toBeNull();
    expect(params.get("metadata[plan_id]")).toBe("single_site");
    expect(params.get("metadata[site_quota]")).toBe("1");
    expect(params.get("subscription_data[metadata][plan_id]")).toBeNull();
    expect(params.get("client_reference_id")).toBe("owner_test");
    expect(params.get("customer_email")).toBe("owner@example.com");
  });

  it("calls Stripe balance API for a connection test", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ livemode: false, available: [{ amount: 0, currency: "jpy" }], pending: [] }), {
        headers: { "request-id": "req_test_balance" }
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await authenticatedApiApp().fetch(new Request("https://giga-site.com/api/billing/stripe/test", { method: "POST" }), stripeEnv);
    const body = (await response.json()) as { stripe: { ok: true; mode: string; stripeRequestId: string; balance: { available: unknown[] } } };

    expect(response.status).toBe(200);
    expect(body.stripe.ok).toBe(true);
    expect(body.stripe.mode).toBe("test");
    expect(body.stripe.stripeRequestId).toBe("req_test_balance");
    expect(body.stripe.balance.available).toEqual([{ amount: 0, currency: "jpy" }]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.stripe.com/v1/balance",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({ Authorization: "Bearer sk_test_mock" })
      })
    );
  });

  it("creates a Stripe Checkout Session and returns only the redirect URL", async () => {
    const fetchMock = vi.fn(async (_url: string, init: RequestInit) => {
      const params = init.body as URLSearchParams;
      expect(params.get("line_items[0][price_data][unit_amount]")).toBe("980");
      expect(params.get("client_reference_id")).toBe("owner_test");
      expect(params.get("customer_email")).toBe("owner@example.com");
      expect(params.get("metadata[app_user_id]")).toBe("owner_test");
      expect(params.get("subscription_data[metadata][app_user_id]")).toBe("owner_test");
      expect(params.get("subscription_data[metadata][plan_id]")).toBe("pro");
      expect(params.get("subscription_data[trial_period_days]")).toBeNull();
      return new Response(JSON.stringify({ id: "cs_test_123", url: "https://checkout.stripe.com/c/pay/cs_test_123" }), {
        headers: { "request-id": "req_test_checkout" }
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/billing/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "pro" })
      }),
      stripeEnvWithBilling()
    );
    const body = (await response.json()) as { session: { ok: true; id: string; url: string; mode: string; stripeRequestId: string } };

    expect(response.status).toBe(200);
    expect(body.session).toEqual({
      ok: true,
      id: "cs_test_123",
      url: "https://checkout.stripe.com/c/pay/cs_test_123",
      mode: "test",
      stripeRequestId: "req_test_checkout"
    });
  });

  it("reuses a stored Stripe customer for returning subscribers (Pro has no trial)", async () => {
    const fetchMock = vi.fn(async (_url: string, init: RequestInit) => {
      const params = init.body as URLSearchParams;
      expect(params.get("customer")).toBe("cus_existing");
      expect(params.get("customer_email")).toBeNull();
      expect(params.get("subscription_data[trial_period_days]")).toBeNull();
      return new Response(JSON.stringify({ id: "cs_test_456", url: "https://checkout.stripe.com/c/pay/cs_test_456" }), {
        headers: { "request-id": "req_test_checkout_existing" }
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/billing/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "pro" })
      }),
      stripeEnvWithBilling([
        {
          id: "sub_existing",
          owner_user_id: "owner_test",
          plan_id: "pro",
          status: "canceled",
          current_period_end: null,
          cancel_at_period_end: 0,
          stripe_customer_id: "cus_existing"
        }
      ])
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("does not create a duplicate Pro checkout when a legacy paid subscription is already active", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/billing/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "pro" })
      }),
      stripeEnvWithBilling([
        {
          id: "sub_legacy_team",
          owner_user_id: "owner_test",
          plan_id: "team",
          status: "active",
          current_period_end: null,
          cancel_at_period_end: 0,
          stripe_customer_id: "cus_existing"
        }
      ])
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toMatchObject({
      error: "plan_already_active",
      details: { currentPlanId: "team", requestedPlanId: "pro" }
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps paid checkout disabled behind the prelaunch flag", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/billing/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "pro" })
      }),
      { ...stripeEnv, PAID_CHECKOUT_ENABLED: "false" } as unknown as Env
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: "paid_checkout_preparing",
      details: {
        paidCheckoutEnabled: false,
        tooltip: "現在準備中"
      }
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps Stripe live-charge-disabled checkout failures to a specific frontend-safe code", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          error: {
            type: "invalid_request_error",
            message: "Your account cannot currently make live charges."
          }
        }),
        { status: 400, headers: { "request-id": "req_live_charges_disabled" } }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/billing/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "pro" })
      }),
      stripeEnvWithBilling()
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "stripe_live_charges_disabled",
      details: {
        type: "invalid_request_error",
        message: "Your account cannot currently make live charges.",
        stripeRequestId: "req_live_charges_disabled"
      }
    });
  });

  it("creates a Stripe Billing Portal session for cancellation and plan management", async () => {
    const fetchMock = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      expect(String(url)).toBe("https://api.stripe.com/v1/billing_portal/sessions");
      const params = init?.body as URLSearchParams;
      expect(params.get("customer")).toBe("cus_existing");
      expect(params.get("return_url")).toBe("https://giga-site.com/app/?billing=portal_return");
      return new Response(JSON.stringify({ id: "bps_test_123", url: "https://billing.stripe.com/p/session/bps_test_123" }), {
        headers: { "request-id": "req_test_portal" }
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/billing/customer-portal-session", { method: "POST" }),
      stripeEnvWithBilling([
        {
          id: "sub_current",
          owner_user_id: "owner_test",
          plan_id: "business",
          status: "active",
          current_period_end: null,
          cancel_at_period_end: 0,
          stripe_customer_id: "cus_existing"
        }
      ])
    );
    const body = (await response.json()) as { portal: { ok: true; id: string; url: string; mode: string; stripeRequestId: string } };

    expect(response.status).toBe(200);
    expect(body.portal).toEqual({
      ok: true,
      id: "bps_test_123",
      url: "https://billing.stripe.com/p/session/bps_test_123",
      mode: "test",
      stripeRequestId: "req_test_portal"
    });
  });

  it("does not call Stripe Billing Portal when the current subscription was not created through Stripe", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/billing/customer-portal-session", { method: "POST" }),
      stripeEnvWithBilling([
        {
          id: "manual_sub",
          owner_user_id: "owner_test",
          plan_id: "business",
          status: "active",
          current_period_end: null,
          cancel_at_period_end: 0,
          stripe_customer_id: null
        }
      ])
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toMatchObject({ error: "billing_portal_unavailable" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects checkout creation for unknown plan ids", async () => {
    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/billing/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "enterprise" })
      }),
      stripeEnvWithBilling()
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: "invalid_plan" });
  });

  it("does not call Stripe when the secret is missing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await authenticatedApiApp().fetch(
      new Request("https://giga-site.com/api/billing/stripe/test", { method: "POST" }),
      { APP_HOST: "giga-site.com", APP_BASE_PATH: "/app" } as unknown as Env
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ error: "stripe_secret_key_missing" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
