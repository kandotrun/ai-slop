import type { BillingInvoiceSummary, BillingPaymentMethodSummary, BillingPlanSummary } from "../shared/types";
import { PAID_CHECKOUT_PREPARING_ERROR, PAID_CHECKOUT_PREPARING_TOOLTIP, paidCheckoutEnabledFromFlag } from "../shared/billing-flags";

export type StripeKeyMode = "test" | "live" | "unknown";

export interface StripeRuntimeEnv {
  APP_HOST: string;
  APP_BASE_PATH: string;
  PAID_CHECKOUT_ENABLED?: string | boolean;
  STRIPE_SECRET_KEY?: string;
  STRIPE_PUBLISHABLE_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}

export interface PublicStripeConfigStatus {
  paidCheckoutEnabled: boolean;
  paidCheckoutDisabledTooltip: string | null;
}

export interface StripeConfigStatus extends PublicStripeConfigStatus {
  configured: boolean;
  secretConfigured: boolean;
  publishableConfigured: boolean;
  mode: StripeKeyMode;
  publishableMode: StripeKeyMode;
  paidCheckoutDisabledReason: string | null;
  warnings: string[];
}

export interface StripeMoneyAmount {
  amount: number;
  currency: string;
}

export interface StripeConnectionTestResult {
  ok: true;
  mode: StripeKeyMode;
  livemode: boolean;
  stripeRequestId: string | null;
  balance: {
    available: StripeMoneyAmount[];
    pending: StripeMoneyAmount[];
  };
}

export interface StripeCheckoutSessionResult {
  ok: true;
  id: string;
  url: string;
  mode: StripeKeyMode;
  stripeRequestId: string | null;
}

export interface StripeBillingPortalSessionResult {
  ok: true;
  id: string;
  url: string;
  mode: StripeKeyMode;
  stripeRequestId: string | null;
}

export interface StripeErrorResult {
  ok: false;
  error: string;
  status: number;
  stripeRequestId: string | null;
  type?: string;
  code?: string;
  message?: string;
}

export interface StripeWebhookEnv extends StripeRuntimeEnv {
  DB: D1Database;
}

export interface StripeWebhookProcessResult {
  ok: true;
  received: true;
  duplicate: boolean;
  eventId: string;
  eventType: string;
}

interface StripeWebhookEventRow {
  id: string;
}

interface BillingSubscriptionRow {
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

interface StripeBalanceResponse {
  livemode?: boolean;
  available?: StripeMoneyAmount[];
  pending?: StripeMoneyAmount[];
}

interface StripeCheckoutSessionResponse {
  id?: string;
  url?: string;
}

interface StripeBillingPortalSessionResponse {
  id?: string;
  url?: string;
}

// `offerable: true` plans are the only ones shown in the catalog and accepted for new checkout.
// Legacy plans stay listed so existing (grandfathered) subscriptions still resolve labels,
// quotas, and webhook metadata, but are never offered again.
export const STRIPE_PLANS = {
  pro: { label: "Pro", unitAmount: 980, currency: "jpy", interval: "month", checkoutMode: "subscription", offerable: true },
  single_site: { label: "1サイト公開", unitAmount: 150, currency: "jpy", interval: "site", checkoutMode: "payment", siteQuota: 1, offerable: false },
  personal_pro: { label: "個人 Pro", unitAmount: 980, currency: "jpy", interval: "month", checkoutMode: "subscription", offerable: false },
  team: { label: "Team", unitAmount: 4980, currency: "jpy", interval: "month", checkoutMode: "subscription", trialPeriodDays: 14, offerable: false },
  business: { label: "Business", unitAmount: 19800, currency: "jpy", interval: "month", checkoutMode: "subscription", offerable: false },
  agency: { label: "Agency", unitAmount: 49800, currency: "jpy", interval: "month", checkoutMode: "subscription", offerable: false }
} as const;

export type StripePlanId = keyof typeof STRIPE_PLANS;

export function isOfferablePlanId(value: unknown): value is StripePlanId {
  return typeof value === "string" && value in STRIPE_PLANS && STRIPE_PLANS[value as StripePlanId].offerable;
}

const STRIPE_WEBHOOK_TOLERANCE_SECONDS = 5 * 60;
const STRIPE_BILLING_WEBHOOK_EVENTS = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed"
]);

function nowIso(): string {
  return new Date().toISOString();
}

function safeString(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

function safeRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function stripeId(value: unknown): string | null {
  if (typeof value === "string") return value;
  const objectValue = safeRecord(value);
  return objectValue ? safeString(objectValue.id) : null;
}

function planIdFromMetadata(value: unknown): string | null {
  const metadata = safeRecord(value);
  const planId = safeString(metadata?.plan_id);
  return isStripePlanId(planId) ? planId : null;
}

function appUserIdFromMetadata(value: unknown): string | null {
  const metadata = safeRecord(value);
  return safeString(metadata?.app_user_id);
}

function siteQuotaFromMetadata(value: unknown): number {
  const metadata = safeRecord(value);
  const rawQuota = safeString(metadata?.site_quota);
  const quota = rawQuota ? Number.parseInt(rawQuota, 10) : STRIPE_PLANS.single_site.siteQuota;
  return Number.isInteger(quota) && quota > 0 && quota <= 100 ? quota : STRIPE_PLANS.single_site.siteQuota;
}

function moneyAmount(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.round(value) : fallback;
}

function secondsToIso(value: unknown): string | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return null;
  return new Date(value * 1000).toISOString();
}

function constantTimeStringEqual(left: string, right: string): boolean {
  const length = Math.max(left.length, right.length);
  let diff = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) {
    diff |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return diff === 0;
}

function hex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmacSha256Hex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return hex(signature);
}

export async function verifyStripeWebhookSignature(payload: string, signatureHeader: string | null, webhookSecret: string | undefined, nowSeconds = Math.floor(Date.now() / 1000)): Promise<boolean> {
  if (!webhookSecret || !signatureHeader) return false;
  const fields = signatureHeader.split(",").reduce<Record<string, string[]>>((accumulator, part) => {
    const [key, value] = part.split("=", 2);
    if (!key || !value) return accumulator;
    accumulator[key] = [...(accumulator[key] ?? []), value];
    return accumulator;
  }, {});
  const timestamp = Number.parseInt(fields.t?.[0] ?? "", 10);
  const signatures = fields.v1 ?? [];
  if (!Number.isFinite(timestamp) || signatures.length === 0) return false;
  if (Math.abs(nowSeconds - timestamp) > STRIPE_WEBHOOK_TOLERANCE_SECONDS) return false;

  const expected = await hmacSha256Hex(webhookSecret, `${timestamp}.${payload}`);
  return signatures.some((signature) => constantTimeStringEqual(signature, expected));
}

export function stripeKeyMode(key: string | undefined, prefix: "sk" | "pk"): StripeKeyMode {
  if (!key) return "unknown";
  if (key.startsWith(`${prefix}_test_`)) return "test";
  if (key.startsWith(`${prefix}_live_`)) return "live";
  return "unknown";
}

export function getStripeConfigStatus(env: StripeRuntimeEnv): StripeConfigStatus {
  const mode = stripeKeyMode(env.STRIPE_SECRET_KEY, "sk");
  const publishableMode = stripeKeyMode(env.STRIPE_PUBLISHABLE_KEY, "pk");
  const paidCheckoutEnabled = isPaidCheckoutEnabled(env);
  const warnings: string[] = [];

  if (!env.STRIPE_SECRET_KEY) warnings.push("stripe_secret_key_missing");
  if (!env.STRIPE_PUBLISHABLE_KEY) warnings.push("stripe_publishable_key_missing");
  if (env.STRIPE_SECRET_KEY && mode === "unknown") warnings.push("stripe_secret_key_unrecognized");
  if (env.STRIPE_PUBLISHABLE_KEY && publishableMode === "unknown") warnings.push("stripe_publishable_key_unrecognized");
  if (mode !== "unknown" && publishableMode !== "unknown" && mode !== publishableMode) warnings.push("stripe_key_mode_mismatch");

  return {
    configured: Boolean(env.STRIPE_SECRET_KEY),
    secretConfigured: Boolean(env.STRIPE_SECRET_KEY),
    publishableConfigured: Boolean(env.STRIPE_PUBLISHABLE_KEY),
    mode,
    publishableMode,
    paidCheckoutEnabled,
    paidCheckoutDisabledReason: paidCheckoutEnabled ? null : PAID_CHECKOUT_PREPARING_ERROR,
    paidCheckoutDisabledTooltip: paidCheckoutEnabled ? null : PAID_CHECKOUT_PREPARING_TOOLTIP,
    warnings
  };
}

export function getPublicStripeConfigStatus(env: StripeRuntimeEnv): PublicStripeConfigStatus {
  const paidCheckoutEnabled = isPaidCheckoutEnabled(env);

  return {
    paidCheckoutEnabled,
    paidCheckoutDisabledTooltip: paidCheckoutEnabled ? null : PAID_CHECKOUT_PREPARING_TOOLTIP
  };
}

export function isPaidCheckoutEnabled(env: StripeRuntimeEnv): boolean {
  return paidCheckoutEnabledFromFlag(env.PAID_CHECKOUT_ENABLED);
}

export function isStripePlanId(value: unknown): value is StripePlanId {
  return typeof value === "string" && value in STRIPE_PLANS;
}

function stripeApiError(status: number, stripeRequestId: string | null, body: unknown): StripeErrorResult {
  if (body && typeof body === "object" && "error" in body) {
    const error = (body as { error?: { type?: unknown; code?: unknown; message?: unknown } }).error;
    return {
      ok: false,
      error: "stripe_request_failed",
      status,
      stripeRequestId,
      type: typeof error?.type === "string" ? error.type : undefined,
      code: typeof error?.code === "string" ? error.code : undefined,
      message: typeof error?.message === "string" ? error.message : undefined
    };
  }
  return { ok: false, error: "stripe_request_failed", status, stripeRequestId };
}

async function parseStripeJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function stripeRequest<T>(env: StripeRuntimeEnv, path: string, init?: RequestInit): Promise<{ ok: true; value: T; stripeRequestId: string | null } | { ok: false; error: StripeErrorResult }> {
  const secretKey = env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return { ok: false, error: { ok: false, error: "stripe_secret_key_missing", status: 503, stripeRequestId: null } };
  }

  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...(init?.headers ?? {})
    }
  });
  const stripeRequestId = response.headers.get("request-id") ?? response.headers.get("stripe-request-id");
  const json = await parseStripeJson(response);
  if (!response.ok) {
    return { ok: false, error: stripeApiError(response.status, stripeRequestId, json) };
  }
  return { ok: true, value: json as T, stripeRequestId };
}

export async function testStripeConnection(env: StripeRuntimeEnv): Promise<StripeConnectionTestResult | StripeErrorResult> {
  const result = await stripeRequest<StripeBalanceResponse>(env, "balance", { method: "GET" });
  if (!result.ok) return result.error;
  return {
    ok: true,
    mode: stripeKeyMode(env.STRIPE_SECRET_KEY, "sk"),
    livemode: Boolean(result.value.livemode),
    stripeRequestId: result.stripeRequestId,
    balance: {
      available: Array.isArray(result.value.available) ? result.value.available : [],
      pending: Array.isArray(result.value.pending) ? result.value.pending : []
    }
  };
}

export interface StripeCheckoutSessionOptions {
  user?: { id: string; email: string };
  customerId?: string | null;
  trialEligible?: boolean;
}

export function buildCheckoutSessionParams(env: StripeRuntimeEnv, planId: StripePlanId, options: StripeCheckoutSessionOptions = {}): URLSearchParams {
  const plan = STRIPE_PLANS[planId];
  const { user, customerId, trialEligible = true } = options;
  const baseUrl = `https://${env.APP_HOST}${env.APP_BASE_PATH}`;
  const params = new URLSearchParams();
  params.set("mode", plan.checkoutMode);
  params.set("locale", "ja");
  params.set("adaptive_pricing[enabled]", "false");
  params.set("success_url", `${baseUrl}/?billing=success&session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${baseUrl}/?billing=cancelled`);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", plan.currency);
  params.set("line_items[0][price_data][unit_amount]", String(plan.unitAmount));
  if (plan.checkoutMode === "subscription") {
    params.set("line_items[0][price_data][recurring][interval]", plan.interval);
    params.set("subscription_data[metadata][plan_id]", planId);
    const trialPeriodDays = "trialPeriodDays" in plan ? (plan as { trialPeriodDays: number }).trialPeriodDays : undefined;
    if (trialPeriodDays && trialEligible) {
      params.set("subscription_data[trial_period_days]", String(trialPeriodDays));
      params.set("payment_method_collection", "always");
    }
  }
  params.set("line_items[0][price_data][product_data][name]", `ギガサイト便 ${plan.label}`);
  params.set("metadata[plan_id]", planId);
  const siteQuota = "siteQuota" in plan ? (plan as { siteQuota: number }).siteQuota : undefined;
  if (siteQuota) {
    params.set("metadata[site_quota]", String(siteQuota));
  }
  if (user) {
    params.set("client_reference_id", user.id);
    if (customerId) {
      params.set("customer", customerId);
    } else {
      params.set("customer_email", user.email);
    }
    params.set("metadata[app_user_id]", user.id);
    if (plan.checkoutMode === "subscription") {
      params.set("subscription_data[metadata][app_user_id]", user.id);
    }
  }
  params.set("allow_promotion_codes", "true");
  params.set("billing_address_collection", "auto");
  return params;
}

export async function createStripeCheckoutSession(env: StripeRuntimeEnv, planId: StripePlanId, options: StripeCheckoutSessionOptions = {}): Promise<StripeCheckoutSessionResult | StripeErrorResult> {
  const body = buildCheckoutSessionParams(env, planId, options);
  const result = await stripeRequest<StripeCheckoutSessionResponse>(env, "checkout/sessions", { method: "POST", body });
  if (!result.ok) return result.error;
  if (!result.value.id || !result.value.url) {
    return { ok: false, error: "stripe_checkout_session_invalid", status: 502, stripeRequestId: result.stripeRequestId };
  }
  return {
    ok: true,
    id: result.value.id,
    url: result.value.url,
    mode: stripeKeyMode(env.STRIPE_SECRET_KEY, "sk"),
    stripeRequestId: result.stripeRequestId
  };
}

export function buildBillingPortalSessionParams(env: StripeRuntimeEnv, customerId: string): URLSearchParams {
  const baseUrl = `https://${env.APP_HOST}${env.APP_BASE_PATH}`;
  const params = new URLSearchParams();
  params.set("customer", customerId);
  params.set("return_url", `${baseUrl}/?billing=portal_return`);
  return params;
}

export async function createStripeBillingPortalSession(env: StripeRuntimeEnv, customerId: string): Promise<StripeBillingPortalSessionResult | StripeErrorResult> {
  const body = buildBillingPortalSessionParams(env, customerId);
  const result = await stripeRequest<StripeBillingPortalSessionResponse>(env, "billing_portal/sessions", { method: "POST", body });
  if (!result.ok) return result.error;
  if (!result.value.id || !result.value.url) {
    return { ok: false, error: "stripe_billing_portal_session_invalid", status: 502, stripeRequestId: result.stripeRequestId };
  }
  return {
    ok: true,
    id: result.value.id,
    url: result.value.url,
    mode: stripeKeyMode(env.STRIPE_SECRET_KEY, "sk"),
    stripeRequestId: result.stripeRequestId
  };
}

function billingPlanSummary(id: StripePlanId): BillingPlanSummary {
  const plan = STRIPE_PLANS[id];
  return {
    id,
    label: plan.label,
    unitAmount: plan.unitAmount,
    currency: plan.currency,
    interval: plan.interval,
    checkoutMode: plan.checkoutMode,
    siteQuota: "siteQuota" in plan ? (plan as { siteQuota: number }).siteQuota : undefined,
    trialPeriodDays: "trialPeriodDays" in plan ? (plan as { trialPeriodDays: number }).trialPeriodDays : undefined
  };
}

export function listBillingPlans(currentPlanId: string | null = null): BillingPlanSummary[] {
  const offerableIds = (Object.keys(STRIPE_PLANS) as StripePlanId[]).filter((id) => STRIPE_PLANS[id].offerable);
  const shouldExposeCurrentLegacyPlan =
    isStripePlanId(currentPlanId) && !STRIPE_PLANS[currentPlanId].offerable && STRIPE_PLANS[currentPlanId].checkoutMode === "subscription";
  const ids = shouldExposeCurrentLegacyPlan ? [currentPlanId, ...offerableIds] : offerableIds;
  return ids.map(billingPlanSummary);
}

export function stripePlanTrialPeriodDays(planId: StripePlanId): number | null {
  const plan = STRIPE_PLANS[planId];
  const trialPeriodDays = "trialPeriodDays" in plan ? (plan as { trialPeriodDays: number }).trialPeriodDays : undefined;
  return trialPeriodDays ?? null;
}

export function planLabel(planId: string | null): string | null {
  return planId && isStripePlanId(planId) ? STRIPE_PLANS[planId].label : null;
}

interface StripeListResponse {
  data?: unknown[];
}

function mapStripeInvoice(value: unknown): BillingInvoiceSummary | null {
  const invoice = safeRecord(value);
  const id = invoice ? safeString(invoice.id) : null;
  if (!invoice || !id) {
    return null;
  }
  const lines = safeRecord(invoice.lines);
  const lineData = lines && Array.isArray(lines.data) ? lines.data : [];
  const firstLine = safeRecord(lineData[0]);
  const description =
    safeString(invoice.description) ??
    (firstLine ? safeString(firstLine.description) : null) ??
    safeString(invoice.number) ??
    "ご請求";
  const amount = typeof invoice.amount_paid === "number" ? invoice.amount_paid : typeof invoice.total === "number" ? invoice.total : 0;
  return {
    id,
    date: secondsToIso(invoice.created) ?? nowIso(),
    description,
    amount,
    currency: safeString(invoice.currency) ?? "jpy",
    status: safeString(invoice.status) ?? "unknown",
    receiptUrl: safeString(invoice.hosted_invoice_url) ?? safeString(invoice.invoice_pdf)
  };
}

export async function listStripeInvoices(env: StripeRuntimeEnv, customerId: string | null): Promise<BillingInvoiceSummary[]> {
  if (!env.STRIPE_SECRET_KEY || !customerId) {
    return [];
  }
  const result = await stripeRequest<StripeListResponse>(env, `invoices?customer=${encodeURIComponent(customerId)}&limit=12`, { method: "GET" });
  if (!result.ok) {
    return [];
  }
  const data = Array.isArray(result.value.data) ? result.value.data : [];
  return data.map(mapStripeInvoice).filter((invoice): invoice is BillingInvoiceSummary => invoice !== null);
}

export async function getDefaultPaymentMethod(env: StripeRuntimeEnv, customerId: string | null): Promise<BillingPaymentMethodSummary | null> {
  if (!env.STRIPE_SECRET_KEY || !customerId) {
    return null;
  }
  const result = await stripeRequest<StripeListResponse>(env, `payment_methods?customer=${encodeURIComponent(customerId)}&type=card&limit=1`, { method: "GET" });
  if (!result.ok) {
    return null;
  }
  const data = Array.isArray(result.value.data) ? result.value.data : [];
  const card = safeRecord(safeRecord(data[0])?.card);
  if (!card) {
    return null;
  }
  return {
    brand: safeString(card.brand) ?? "card",
    last4: safeString(card.last4) ?? "----",
    expMonth: typeof card.exp_month === "number" ? card.exp_month : 0,
    expYear: typeof card.exp_year === "number" ? card.exp_year : 0
  };
}

interface BillingSubscriptionPatch {
  ownerUserId: string | null;
  ownerEmail: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripeCheckoutSessionId: string | null;
  planId: string | null;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  livemode: boolean;
  latestInvoiceId: string | null;
}

interface BillingSitePurchasePatch {
  ownerUserId: string | null;
  ownerEmail: string | null;
  stripeCustomerId: string | null;
  stripeCheckoutSessionId: string;
  planId: "single_site";
  status: string;
  unitAmount: number;
  currency: string;
  siteQuota: number;
  livemode: boolean;
}

async function findBillingSubscription(env: StripeWebhookEnv, patch: BillingSubscriptionPatch): Promise<BillingSubscriptionRow | null> {
  if (patch.stripeSubscriptionId) {
    const row = await env.DB.prepare(`SELECT * FROM billing_subscriptions WHERE stripe_subscription_id = ?`)
      .bind(patch.stripeSubscriptionId)
      .first<BillingSubscriptionRow>();
    if (row) return row;
  }
  if (patch.stripeCustomerId) {
    return await env.DB.prepare(`SELECT * FROM billing_subscriptions WHERE stripe_customer_id = ? ORDER BY updated_at DESC LIMIT 1`)
      .bind(patch.stripeCustomerId)
      .first<BillingSubscriptionRow>();
  }
  return null;
}

async function upsertBillingSubscription(env: StripeWebhookEnv, patch: BillingSubscriptionPatch, now: string): Promise<void> {
  const existing = await findBillingSubscription(env, patch);
  if (existing) {
    await env.DB.prepare(
      `UPDATE billing_subscriptions SET
        owner_user_id = COALESCE(?, owner_user_id),
        owner_email = COALESCE(?, owner_email),
        stripe_customer_id = COALESCE(?, stripe_customer_id),
        stripe_subscription_id = COALESCE(?, stripe_subscription_id),
        stripe_checkout_session_id = COALESCE(?, stripe_checkout_session_id),
        plan_id = COALESCE(?, plan_id),
        status = ?,
        current_period_end = ?,
        cancel_at_period_end = ?,
        livemode = ?,
        latest_invoice_id = COALESCE(?, latest_invoice_id),
        updated_at = ?
       WHERE id = ?`
    )
      .bind(
        patch.ownerUserId,
        patch.ownerEmail,
        patch.stripeCustomerId,
        patch.stripeSubscriptionId,
        patch.stripeCheckoutSessionId,
        patch.planId,
        patch.status,
        patch.currentPeriodEnd,
        patch.cancelAtPeriodEnd ? 1 : 0,
        patch.livemode ? 1 : 0,
        patch.latestInvoiceId,
        now,
        existing.id
      )
      .run();
    return;
  }

  await env.DB.prepare(
    `INSERT INTO billing_subscriptions (
      id, owner_user_id, owner_email, stripe_customer_id, stripe_subscription_id,
      stripe_checkout_session_id, plan_id, status, current_period_end,
      cancel_at_period_end, livemode, latest_invoice_id, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      crypto.randomUUID(),
      patch.ownerUserId,
      patch.ownerEmail,
      patch.stripeCustomerId,
      patch.stripeSubscriptionId,
      patch.stripeCheckoutSessionId,
      patch.planId,
      patch.status,
      patch.currentPeriodEnd,
      patch.cancelAtPeriodEnd ? 1 : 0,
      patch.livemode ? 1 : 0,
      patch.latestInvoiceId,
      now,
      now
    )
    .run();
}

async function insertBillingPlanTrial(env: StripeWebhookEnv, patch: BillingSubscriptionPatch, now: string): Promise<void> {
  if (!isStripePlanId(patch.planId) || stripePlanTrialPeriodDays(patch.planId) === null) {
    return;
  }
  await env.DB.prepare(
    `INSERT OR IGNORE INTO billing_plan_trials (
      id, owner_user_id, owner_email, stripe_customer_id, stripe_subscription_id,
      stripe_checkout_session_id, plan_id, livemode, first_seen_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      crypto.randomUUID(),
      patch.ownerUserId,
      patch.ownerEmail,
      patch.stripeCustomerId,
      patch.stripeSubscriptionId,
      patch.stripeCheckoutSessionId,
      patch.planId,
      patch.livemode ? 1 : 0,
      now,
      now
    )
    .run();
}

async function insertBillingSitePurchase(env: StripeWebhookEnv, patch: BillingSitePurchasePatch, now: string): Promise<void> {
  await env.DB.prepare(
    `INSERT OR IGNORE INTO billing_site_purchases (
      id, owner_user_id, owner_email, stripe_customer_id, stripe_checkout_session_id,
      plan_id, status, unit_amount, currency, site_quota, used_site_count,
      livemode, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`
  )
    .bind(
      crypto.randomUUID(),
      patch.ownerUserId,
      patch.ownerEmail,
      patch.stripeCustomerId,
      patch.stripeCheckoutSessionId,
      patch.planId,
      patch.status,
      patch.unitAmount,
      patch.currency,
      patch.siteQuota,
      patch.livemode ? 1 : 0,
      now,
      now
    )
    .run();
}

function isSingleSiteCheckoutSession(object: Record<string, unknown>): boolean {
  return planIdFromMetadata(object.metadata) === "single_site";
}

function patchFromSingleSiteCheckoutSession(object: Record<string, unknown>, livemode: boolean): BillingSitePurchasePatch | null {
  const checkoutSessionId = safeString(object.id);
  if (!checkoutSessionId) {
    return null;
  }
  const customerDetails = safeRecord(object.customer_details);
  const customerEmail = safeString(customerDetails?.email) ?? safeString(object.customer_email);
  const paymentStatus = safeString(object.payment_status);
  return {
    ownerUserId: safeString(object.client_reference_id) ?? appUserIdFromMetadata(object.metadata),
    ownerEmail: customerEmail,
    stripeCustomerId: stripeId(object.customer),
    stripeCheckoutSessionId: checkoutSessionId,
    planId: "single_site",
    status: paymentStatus === "paid" || paymentStatus === "no_payment_required" ? "paid" : "checkout_completed",
    unitAmount: moneyAmount(object.amount_total, STRIPE_PLANS.single_site.unitAmount),
    currency: safeString(object.currency) ?? STRIPE_PLANS.single_site.currency,
    siteQuota: siteQuotaFromMetadata(object.metadata),
    livemode
  };
}

function patchFromCheckoutSession(object: Record<string, unknown>, livemode: boolean): BillingSubscriptionPatch {
  const customerDetails = safeRecord(object.customer_details);
  const customerEmail = safeString(customerDetails?.email) ?? safeString(object.customer_email);
  const paymentStatus = safeString(object.payment_status);
  return {
    ownerUserId: safeString(object.client_reference_id) ?? appUserIdFromMetadata(object.metadata),
    ownerEmail: customerEmail,
    stripeCustomerId: stripeId(object.customer),
    stripeSubscriptionId: stripeId(object.subscription),
    stripeCheckoutSessionId: safeString(object.id),
    planId: planIdFromMetadata(object.metadata),
    status: paymentStatus === "paid" || paymentStatus === "no_payment_required" ? "active" : "checkout_completed",
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    livemode,
    latestInvoiceId: null
  };
}

function patchFromSubscription(object: Record<string, unknown>, livemode: boolean): BillingSubscriptionPatch {
  return {
    ownerUserId: appUserIdFromMetadata(object.metadata),
    ownerEmail: null,
    stripeCustomerId: stripeId(object.customer),
    stripeSubscriptionId: safeString(object.id),
    stripeCheckoutSessionId: null,
    planId: planIdFromMetadata(object.metadata),
    status: safeString(object.status) ?? "unknown",
    currentPeriodEnd: secondsToIso(object.current_period_end),
    cancelAtPeriodEnd: object.cancel_at_period_end === true,
    livemode,
    latestInvoiceId: null
  };
}

function patchFromInvoice(object: Record<string, unknown>, livemode: boolean, eventType: string): BillingSubscriptionPatch {
  return {
    ownerUserId: null,
    ownerEmail: safeString(object.customer_email),
    stripeCustomerId: stripeId(object.customer),
    stripeSubscriptionId: stripeId(object.subscription),
    stripeCheckoutSessionId: null,
    planId: null,
    status: eventType === "invoice.payment_failed" ? "past_due" : "active",
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    livemode,
    latestInvoiceId: safeString(object.id)
  };
}

async function processBillingWebhookObject(env: StripeWebhookEnv, eventType: string, object: Record<string, unknown>, livemode: boolean, now: string): Promise<void> {
  if (eventType === "checkout.session.completed") {
    if (isSingleSiteCheckoutSession(object)) {
      const purchase = patchFromSingleSiteCheckoutSession(object, livemode);
      if (purchase) {
        await insertBillingSitePurchase(env, purchase, now);
      }
      return;
    }
    const patch = patchFromCheckoutSession(object, livemode);
    await upsertBillingSubscription(env, patch, now);
    await insertBillingPlanTrial(env, patch, now);
    return;
  }
  if (eventType.startsWith("customer.subscription.")) {
    const patch = patchFromSubscription(object, livemode);
    await upsertBillingSubscription(env, patch, now);
    await insertBillingPlanTrial(env, patch, now);
    return;
  }
  if (eventType === "invoice.payment_succeeded" || eventType === "invoice.payment_failed") {
    await upsertBillingSubscription(env, patchFromInvoice(object, livemode, eventType), now);
  }
}

export async function handleStripeWebhook(env: StripeWebhookEnv, payload: string, signatureHeader: string | null): Promise<StripeWebhookProcessResult | StripeErrorResult> {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return { ok: false, error: "stripe_webhook_secret_missing", status: 503, stripeRequestId: null };
  }
  const verified = await verifyStripeWebhookSignature(payload, signatureHeader, env.STRIPE_WEBHOOK_SECRET);
  if (!verified) {
    return { ok: false, error: "stripe_webhook_signature_invalid", status: 400, stripeRequestId: null };
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return { ok: false, error: "invalid_json", status: 400, stripeRequestId: null };
  }

  const eventId = safeString(event.id);
  const eventType = safeString(event.type);
  if (!eventId || !eventType) {
    return { ok: false, error: "stripe_webhook_event_invalid", status: 400, stripeRequestId: null };
  }
  const existing = await env.DB.prepare(`SELECT id FROM stripe_webhook_events WHERE id = ?`).bind(eventId).first<StripeWebhookEventRow>();
  if (existing) {
    return { ok: true, received: true, duplicate: true, eventId, eventType };
  }

  const receivedAt = nowIso();
  const livemode = event.livemode === true;
  await env.DB.prepare(
    `INSERT INTO stripe_webhook_events (id, type, livemode, api_version, received_at, status)
     VALUES (?, ?, ?, ?, ?, 'received')`
  )
    .bind(eventId, eventType, livemode ? 1 : 0, safeString(event.api_version), receivedAt)
    .run();

  try {
    const object = safeRecord(safeRecord(event.data)?.object);
    if (STRIPE_BILLING_WEBHOOK_EVENTS.has(eventType) && object) {
      await processBillingWebhookObject(env, eventType, object, livemode, receivedAt);
    }
    await env.DB.prepare(`UPDATE stripe_webhook_events SET status = ?, processed_at = ?, error = ? WHERE id = ?`)
      .bind("processed", nowIso(), null, eventId)
      .run();
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : "stripe_webhook_processing_failed";
    await env.DB.prepare(`UPDATE stripe_webhook_events SET status = ?, processed_at = ?, error = ? WHERE id = ?`)
      .bind("failed", nowIso(), message, eventId)
      .run();
    return { ok: false, error: "stripe_webhook_processing_failed", status: 500, stripeRequestId: null, message };
  }

  return { ok: true, received: true, duplicate: false, eventId, eventType };
}
