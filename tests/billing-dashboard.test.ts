import { describe, expect, it } from "vitest";
import { createApiApp } from "../src/worker/api";
import type { BillingInvoiceSummary, BillingSubscriptionSummary, DashboardStats, NotificationSummary } from "../src/shared/types";

function apiEnv(): Env {
  const db = {
    prepare(sql: string) {
      let bound: unknown[] = [];
      const statement = {
        bind(...args: unknown[]) {
          bound = args;
          return statement;
        },
        async first<T = unknown>() {
          void bound;
          if (sql.includes("FROM billing_subscriptions")) {
            return {
              plan_id: "team",
              status: "active",
              current_period_end: "2026-07-01T00:00:00.000Z",
              cancel_at_period_end: 0,
              stripe_customer_id: null
            } as T;
          }
          if (sql.includes("COALESCE(SUM(site_quota - used_site_count)")) {
            return { unusedSitePurchases: 0 } as T;
          }
          if (sql.includes("AS totalSites")) {
            return {
              totalSites: 12,
              activeSites: 4,
              weeklySiteDelta: 2,
              monthlyViews: 180,
              prevMonthViews: 100,
              monthlyAuthViews: 60,
              totalBytes: 4096
            } as T;
          }
          return null as T;
        },
        async all<T = unknown>() {
          if (sql.includes("FROM access_events ae")) {
            return {
              results: [
                {
                  id: "e1",
                  site_id: "s1",
                  event_type: "auth_success",
                  email: "tanaka@acme.co.jp",
                  path: "/index.html",
                  created_at: "2026-06-19T01:00:00.000Z",
                  site_title: "Acme提案"
                }
              ] as T[],
              success: true,
              meta: { changes: 0 }
            } as D1Result<T>;
          }
          return { results: [] as T[], success: true, meta: { changes: 0 } } as D1Result<T>;
        },
        async run() {
          return { success: true, meta: { changes: 1 } } as D1Result;
        }
      } as unknown as D1PreparedStatement;
      return statement;
    },
    batch: async () => [],
    exec: async () => ({ count: 0, duration: 0 })
  } as unknown as D1Database;

  return {
    DB: db,
    APP_HOST: "giga-site.com",
    APP_BASE_PATH: "/app",
    PREVIEW_HOST_SUFFIX: ".giga-site.com"
  } as unknown as Env;
}

function app() {
  return createApiApp({
    sessionResolver: async () => ({
      user: { id: "owner_test", email: "owner@example.test", name: "Owner" },
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

describe("billing + dashboard + notifications endpoints", () => {
  it("maps the current subscription and exposes the plan catalogue", async () => {
    const response = await app().fetch(new Request("https://giga-site.com/api/billing/subscription"), apiEnv());
    const body = (await response.json()) as { subscription: BillingSubscriptionSummary; plans: { id: string }[] };

    expect(response.status).toBe(200);
    expect(body.subscription.planId).toBe("team");
    expect(body.subscription.planLabel).toBe("Team");
    expect(body.subscription.cancelAtPeriodEnd).toBe(false);
    expect(body.subscription.unusedSitePurchases).toBe(0);
    expect(body.subscription.billingPortalAvailable).toBe(false);
    // Public checkout catalogue is Pro only, but the current legacy subscription is included for display/grandfathering.
    expect(body.plans.map((plan) => plan.id)).toEqual(["team", "pro"]);
    expect(body.plans.find((plan) => plan.id === "pro")).toMatchObject({
      label: "Pro",
      unitAmount: 980,
      currency: "jpy",
      interval: "month",
      checkoutMode: "subscription"
    });
  });

  it("returns no invoices when Stripe is not configured", async () => {
    const response = await app().fetch(new Request("https://giga-site.com/api/billing/invoices"), apiEnv());
    const body = (await response.json()) as { invoices: BillingInvoiceSummary[] };

    expect(response.status).toBe(200);
    expect(body.invoices).toEqual([]);
  });

  it("computes weekly and monthly deltas on the dashboard", async () => {
    const response = await app().fetch(new Request("https://giga-site.com/api/dashboard"), apiEnv());
    const body = (await response.json()) as { stats: DashboardStats };

    expect(body.stats.weeklySiteDelta).toBe(2);
    expect(body.stats.monthlyViewChangePct).toBe(80);
  });

  it("masks email addresses in the notification feed", async () => {
    const response = await app().fetch(new Request("https://giga-site.com/api/notifications"), apiEnv());
    const body = (await response.json()) as { notifications: NotificationSummary[] };

    expect(response.status).toBe(200);
    expect(body.notifications).toHaveLength(1);
    expect(body.notifications[0]?.maskedEmail).toBe("t****@acme.co.jp");
    expect(body.notifications[0]?.siteTitle).toBe("Acme提案");
  });
});
