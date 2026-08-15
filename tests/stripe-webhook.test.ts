import { describe, expect, it } from "vitest";
import { createApiApp } from "../src/worker/api";

interface FakeWebhookEvent {
  id: string;
  type: string;
  livemode: number;
  api_version: string | null;
  received_at: string;
  processed_at: string | null;
  status: string;
  error: string | null;
}

interface FakeBillingSubscription {
  id: string;
  owner_user_id: string | null;
  owner_email: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_checkout_session_id: string | null;
  plan_id: string | null;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: number;
  livemode: number;
  latest_invoice_id: string | null;
  created_at: string;
  updated_at: string;
}

interface FakeBillingPlanTrial {
  id: string;
  owner_user_id: string | null;
  owner_email: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_checkout_session_id: string | null;
  plan_id: string;
  livemode: number;
  first_seen_at: string;
  updated_at: string;
}

interface FakeBillingSitePurchase {
  id: string;
  owner_user_id: string | null;
  owner_email: string | null;
  stripe_customer_id: string | null;
  stripe_checkout_session_id: string;
  plan_id: string;
  status: string;
  unit_amount: number;
  currency: string;
  site_quota: number;
  used_site_count: number;
  livemode: number;
  created_at: string;
  updated_at: string;
}

const webhookSecret = "whsec_test_secret";

function hex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function stripeSignatureHeader(payload: string, secret = webhookSecret, timestamp = Math.floor(Date.now() / 1000)): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  return `t=${timestamp},v1=${hex(signature)}`;
}

function checkoutCompletedEvent(id = "evt_checkout_completed") {
  return {
    id,
    type: "checkout.session.completed",
    livemode: false,
    api_version: "2026-05-27.dahlia",
    data: {
      object: {
        id: "cs_test_123",
        object: "checkout.session",
        mode: "subscription",
        payment_status: "paid",
        client_reference_id: "owner_test",
        customer: "cus_test_123",
        customer_details: { email: "owner@example.com" },
        subscription: "sub_test_123",
        metadata: { plan_id: "team" }
      }
    }
  };
}

function singleSiteCheckoutCompletedEvent(id = "evt_single_site_completed") {
  return {
    id,
    type: "checkout.session.completed",
    livemode: false,
    api_version: "2026-05-27.dahlia",
    data: {
      object: {
        id: "cs_test_single_site",
        object: "checkout.session",
        mode: "payment",
        payment_status: "paid",
        amount_total: 150,
        currency: "jpy",
        client_reference_id: "owner_test",
        customer: "cus_test_single",
        customer_details: { email: "owner@example.com" },
        subscription: null,
        metadata: { plan_id: "single_site", site_quota: "1" }
      }
    }
  };
}

function fakeEnv() {
  const webhookEvents = new Map<string, FakeWebhookEvent>();
  const subscriptions = new Map<string, FakeBillingSubscription>();
  const planTrials = new Map<string, FakeBillingPlanTrial>();
  const sitePurchases = new Map<string, FakeBillingSitePurchase>();

  const db = {
    prepare(sql: string) {
      let bound: unknown[] = [];
      const statement = {
        bind(...args: unknown[]) {
          bound = args;
          return statement;
        },
        async first<T = unknown>() {
          if (sql.includes("FROM stripe_webhook_events WHERE id = ?")) {
            return (webhookEvents.get(String(bound[0])) ?? null) as T;
          }
          if (sql.includes("FROM billing_subscriptions WHERE stripe_subscription_id = ?")) {
            const row = [...subscriptions.values()].find((item) => item.stripe_subscription_id === String(bound[0]));
            return (row ?? null) as T;
          }
          if (sql.includes("FROM billing_subscriptions WHERE stripe_customer_id = ?")) {
            const row = [...subscriptions.values()].find((item) => item.stripe_customer_id === String(bound[0]));
            return (row ?? null) as T;
          }
          throw new Error(`Unexpected first SQL: ${sql} ${JSON.stringify(bound)}`);
        },
        async run() {
          if (sql.includes("INSERT INTO stripe_webhook_events")) {
            const row: FakeWebhookEvent = {
              id: String(bound[0]),
              type: String(bound[1]),
              livemode: Number(bound[2]),
              api_version: bound[3] === null ? null : String(bound[3]),
              received_at: String(bound[4]),
              processed_at: null,
              status: "received",
              error: null
            };
            webhookEvents.set(row.id, row);
            return { success: true, meta: { changes: 1 } } as D1Result;
          }
          if (sql.includes("UPDATE stripe_webhook_events SET status = ?")) {
            const row = webhookEvents.get(String(bound[3]));
            if (row) {
              row.status = String(bound[0]);
              row.processed_at = bound[1] === null ? null : String(bound[1]);
              row.error = bound[2] === null ? null : String(bound[2]);
            }
            return { success: true, meta: { changes: row ? 1 : 0 } } as D1Result;
          }
          if (sql.includes("INSERT INTO billing_subscriptions")) {
            const row: FakeBillingSubscription = {
              id: String(bound[0]),
              owner_user_id: bound[1] === null ? null : String(bound[1]),
              owner_email: bound[2] === null ? null : String(bound[2]),
              stripe_customer_id: bound[3] === null ? null : String(bound[3]),
              stripe_subscription_id: bound[4] === null ? null : String(bound[4]),
              stripe_checkout_session_id: bound[5] === null ? null : String(bound[5]),
              plan_id: bound[6] === null ? null : String(bound[6]),
              status: String(bound[7]),
              current_period_end: bound[8] === null ? null : String(bound[8]),
              cancel_at_period_end: Number(bound[9]),
              livemode: Number(bound[10]),
              latest_invoice_id: bound[11] === null ? null : String(bound[11]),
              created_at: String(bound[12]),
              updated_at: String(bound[13])
            };
            subscriptions.set(row.id, row);
            return { success: true, meta: { changes: 1 } } as D1Result;
          }
          if (sql.includes("INSERT OR IGNORE INTO billing_plan_trials")) {
            const duplicate = [...planTrials.values()].some((item) => (
              (bound[1] !== null && item.owner_user_id === String(bound[1]) && item.plan_id === String(bound[6]))
              || (bound[3] !== null && item.stripe_customer_id === String(bound[3]) && item.plan_id === String(bound[6]))
            ));
            if (!duplicate) {
              const row: FakeBillingPlanTrial = {
                id: String(bound[0]),
                owner_user_id: bound[1] === null ? null : String(bound[1]),
                owner_email: bound[2] === null ? null : String(bound[2]),
                stripe_customer_id: bound[3] === null ? null : String(bound[3]),
                stripe_subscription_id: bound[4] === null ? null : String(bound[4]),
                stripe_checkout_session_id: bound[5] === null ? null : String(bound[5]),
                plan_id: String(bound[6]),
                livemode: Number(bound[7]),
                first_seen_at: String(bound[8]),
                updated_at: String(bound[9])
              };
              planTrials.set(row.id, row);
            }
            return { success: true, meta: { changes: duplicate ? 0 : 1 } } as D1Result;
          }
          if (sql.includes("billing_site_purchases")) {
            const row: FakeBillingSitePurchase = {
              id: String(bound[0]),
              owner_user_id: bound[1] === null ? null : String(bound[1]),
              owner_email: bound[2] === null ? null : String(bound[2]),
              stripe_customer_id: bound[3] === null ? null : String(bound[3]),
              stripe_checkout_session_id: String(bound[4]),
              plan_id: String(bound[5]),
              status: String(bound[6]),
              unit_amount: Number(bound[7]),
              currency: String(bound[8]),
              site_quota: Number(bound[9]),
              used_site_count: 0,
              livemode: Number(bound[10]),
              created_at: String(bound[11]),
              updated_at: String(bound[12])
            };
            sitePurchases.set(row.id, row);
            return { success: true, meta: { changes: 1 } } as D1Result;
          }
          if (sql.includes("UPDATE billing_subscriptions SET")) {
            const row = [...subscriptions.values()].find((item) => item.id === String(bound.at(-1)));
            if (!row) return { success: true, meta: { changes: 0 } } as D1Result;
            row.owner_user_id = bound[0] === null ? row.owner_user_id : String(bound[0]);
            row.owner_email = bound[1] === null ? row.owner_email : String(bound[1]);
            row.stripe_customer_id = bound[2] === null ? row.stripe_customer_id : String(bound[2]);
            row.stripe_subscription_id = bound[3] === null ? row.stripe_subscription_id : String(bound[3]);
            row.stripe_checkout_session_id = bound[4] === null ? row.stripe_checkout_session_id : String(bound[4]);
            row.plan_id = bound[5] === null ? row.plan_id : String(bound[5]);
            row.status = String(bound[6]);
            row.current_period_end = bound[7] === null ? null : String(bound[7]);
            row.cancel_at_period_end = Number(bound[8]);
            row.livemode = Number(bound[9]);
            row.latest_invoice_id = bound[10] === null ? row.latest_invoice_id : String(bound[10]);
            row.updated_at = String(bound[11]);
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

  const env = {
    DB: db,
    APP_HOST: "giga-site.com",
    APP_BASE_PATH: "/app",
    PREVIEW_HOST_SUFFIX: ".giga-site.com",
    STRIPE_SECRET_KEY: "sk_test_mock",
    STRIPE_WEBHOOK_SECRET: webhookSecret
  } as unknown as Env;

  return { env, webhookEvents, subscriptions, planTrials, sitePurchases };
}

async function postStripeWebhook(env: Env, event: unknown, signature?: string) {
  const payload = JSON.stringify(event);
  return createApiApp().fetch(
    new Request("https://giga-site.com/api/billing/stripe/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Stripe-Signature": signature ?? (await stripeSignatureHeader(payload))
      },
      body: payload
    }),
    env
  );
}

describe("Stripe billing webhooks", () => {
  it("accepts a signed checkout.session.completed event without an app session and stores billing state", async () => {
    const { env, webhookEvents, subscriptions, planTrials } = fakeEnv();

    const response = await postStripeWebhook(env, checkoutCompletedEvent());
    const body = (await response.json()) as { received: boolean; eventId: string; duplicate: boolean };

    expect(response.status).toBe(200);
    expect(body).toEqual({ received: true, eventId: "evt_checkout_completed", duplicate: false });
    expect(webhookEvents.get("evt_checkout_completed")?.status).toBe("processed");
    expect(subscriptions.size).toBe(1);
    expect([...subscriptions.values()][0]).toMatchObject({
      owner_user_id: "owner_test",
      owner_email: "owner@example.com",
      stripe_customer_id: "cus_test_123",
      stripe_subscription_id: "sub_test_123",
      stripe_checkout_session_id: "cs_test_123",
      plan_id: "team",
      status: "active",
      livemode: 0
    });
    expect(planTrials.size).toBe(1);
    expect([...planTrials.values()][0]).toMatchObject({
      owner_user_id: "owner_test",
      owner_email: "owner@example.com",
      stripe_customer_id: "cus_test_123",
      stripe_subscription_id: "sub_test_123",
      stripe_checkout_session_id: "cs_test_123",
      plan_id: "team",
      livemode: 0
    });
  });

  it("stores a single-site one-time checkout as a site purchase, not a subscription", async () => {
    const { env, webhookEvents, subscriptions, sitePurchases } = fakeEnv();

    const response = await postStripeWebhook(env, singleSiteCheckoutCompletedEvent());

    expect(response.status).toBe(200);
    expect(webhookEvents.get("evt_single_site_completed")?.status).toBe("processed");
    expect(subscriptions.size).toBe(0);
    expect(sitePurchases.size).toBe(1);
    expect([...sitePurchases.values()][0]).toMatchObject({
      owner_user_id: "owner_test",
      owner_email: "owner@example.com",
      stripe_customer_id: "cus_test_single",
      stripe_checkout_session_id: "cs_test_single_site",
      plan_id: "single_site",
      status: "paid",
      unit_amount: 150,
      currency: "jpy",
      site_quota: 1,
      used_site_count: 0,
      livemode: 0
    });
  });

  it("rejects invalid webhook signatures before storing anything", async () => {
    const { env, webhookEvents, subscriptions } = fakeEnv();

    const response = await postStripeWebhook(env, checkoutCompletedEvent("evt_bad_signature"), "t=123,v1=bad");

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: "stripe_webhook_signature_invalid" });
    expect(webhookEvents.size).toBe(0);
    expect(subscriptions.size).toBe(0);
  });

  it("deduplicates already processed webhook event ids", async () => {
    const { env, webhookEvents, subscriptions } = fakeEnv();
    const event = checkoutCompletedEvent("evt_duplicate");

    const first = await postStripeWebhook(env, event);
    const second = await postStripeWebhook(env, event);
    const secondBody = (await second.json()) as { received: boolean; eventId: string; duplicate: boolean };

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(secondBody).toEqual({ received: true, eventId: "evt_duplicate", duplicate: true });
    expect(webhookEvents.size).toBe(1);
    expect(subscriptions.size).toBe(1);
  });
});
