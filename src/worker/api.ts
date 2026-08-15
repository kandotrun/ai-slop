import { Hono } from "hono";
import { agentUploadErrorDetails, buildAgentSetupManifest } from "../shared/agent-handoff";
import { normalizeAuthInput, normalizeSiteInput, normalizeSlug } from "../shared/site-input";
import {
  contentTypeFromPath,
  normalizeR2Path,
  scanHtmlForWarnings,
  scanPathForWarnings,
  validateUploadedHtml
} from "../shared/security";
import type {
  AccessEventSummary,
  ApiErrorBody,
  BillingSubscriptionSummary,
  DashboardStats,
  FormSubmissionDetail,
  FormSubmissionSummary,
  MeasurementEventName,
  NormalizedSiteInput,
  NotificationSummary,
  RevisionCommentStatus,
  RevisionCommentSummary,
  RevisionHistoryItem,
  RevisionSummary,
  SiteCreateInput
} from "../shared/types";
import { mapSiteRow, type RevisionRow, type SiteRevisionCommentRow, type SiteRow, type SiteRowWithMetrics } from "./db";
import { hashPassword } from "./auth-hash";
import { handleContactSubmission } from "./contact";
import {
  clearSessionCookie,
  getUserSession,
  requestUserLoginCode,
  signOutUser,
  verifyUserLoginCode,
  type UserSessionData
} from "./user-auth";
import {
  createStripeBillingPortalSession,
  createStripeCheckoutSession,
  stripePlanTrialPeriodDays,
  getDefaultPaymentMethod,
  getPublicStripeConfigStatus,
  getStripeConfigStatus,
  handleStripeWebhook,
  isOfferablePlanId,
  listBillingPlans,
  listStripeInvoices,
  planLabel,
  testStripeConnection,
  type StripeRuntimeEnv,
  type StripeWebhookEnv
} from "./stripe";
import { scanUploadWithAiSecurity, type OllamaSecurityRuntimeEnv } from "./security-ai";
import { formSubmissionsCsv, getFormSubmission, listFormSubmissionDetails, listFormSubmissions } from "./form-submissions";
import { handleMeasurementRequest, recordMeasurementEvent, type MeasurementRecordInput } from "./measurement";
import { reserveAnonymousPublishAttempt } from "./anonymous-publish-rate-limit";
import {
  FREE_PLAN_PUBLISH_DAYS,
  FORM_SUBMISSIONS_MIN_PLAN_LABEL,
  FORM_SUBMISSIONS_MIN_RANK,
  HIDE_BRANDING_MIN_PLAN_LABEL,
  HIDE_BRANDING_MIN_RANK,
  planFeatureRank,
  planSiteLimit,
  REVIEW_COMMENTS_MIN_PLAN_LABEL,
  REVIEW_COMMENTS_MIN_RANK,
  REVISION_HISTORY_MIN_PLAN_LABEL,
  REVISION_HISTORY_MIN_RANK
} from "../shared/plans";
import {
  ANON_OWNER_USER_ID,
  ANON_PUBLISH_TTL_DAYS,
  type ClaimResponse,
  type PublicPublishPasswordResponse,
  type PublicPublishResponse
} from "../shared/anon-publish";

interface UploadFileInput {
  path?: unknown;
  content?: unknown;
  encoding?: unknown;
  contentType?: unknown;
}

interface UploadRevisionInput {
  html?: unknown;
  files?: unknown;
  entryPath?: unknown;
  securityOverrideAccepted?: unknown;
}

type SiteWithRevisionInput = SiteCreateInput & UploadRevisionInput;

interface PreparedUploadFile {
  path: string;
  body: string | Uint8Array;
  contentType: string;
  byteLength: number;
}

function jsonError(error: string, status = 400, details?: unknown): Response {
  const body: ApiErrorBody = { error, details };
  return Response.json(body, { status });
}

function agentUploadJsonError(error: string, status = 400, details?: Record<string, unknown>): Response {
  return jsonError(error, status, { ...agentUploadErrorDetails(error), ...details });
}

const BLOCKING_SECURITY_WARNINGS = new Set([
  "possible_secret",
  "external_form_action",
  "external_script",
  "php_file",
  "ai_security_medium",
  "ai_security_high"
]);

function blockingSecurityWarnings(warnings: string[]): string[] {
  return warnings.filter((warning) => BLOCKING_SECURITY_WARNINGS.has(warning));
}

function securityOverrideAccepted(value: unknown): boolean {
  return value === true;
}

function securityReviewWarningResponse(warnings: string[], canOverride: boolean): Response {
  return jsonError("security_review_warning", 409, canOverride ? {
    warnings,
    canOverride: true,
    overrideField: "securityOverrideAccepted"
  } : {
    warnings,
    canOverride: false
  });
}

function envNumber(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function nowIso(): string {
  return new Date().toISOString();
}

function randomSlug(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(body: string | Uint8Array): Promise<string> {
  const data = typeof body === "string" ? new TextEncoder().encode(body) : body;
  const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function randomTokenSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return base64Url(bytes);
}

function constantTimeEqual(a: string, b: string): boolean {
  const length = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let index = 0; index < length; index += 1) {
    diff |= (a.charCodeAt(index) || 0) ^ (b.charCodeAt(index) || 0);
  }
  return diff === 0;
}

function byteLength(body: string | Uint8Array): number {
  return typeof body === "string" ? new TextEncoder().encode(body).byteLength : body.byteLength;
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function textFromBody(body: string | Uint8Array): string {
  return typeof body === "string" ? body : new TextDecoder().decode(body);
}

async function chooseUniqueSlug(db: D1Database, desiredSlug?: string): Promise<string | null> {
  if (desiredSlug) {
    const existing = await db.prepare(`SELECT id FROM sites WHERE slug = ? AND deleted_at IS NULL`).bind(desiredSlug).first();
    return existing ? null : desiredSlug;
  }
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = randomSlug();
    const existing = await db.prepare(`SELECT id FROM sites WHERE slug = ? AND deleted_at IS NULL`).bind(candidate).first();
    if (!existing) {
      return candidate;
    }
  }
  return null;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function prepareUploadFiles(body: UploadRevisionInput): { ok: true; files: PreparedUploadFile[]; entryPath: string } | { ok: false; error: string } {
  if (typeof body.html === "string") {
    return {
      ok: true,
      entryPath: "index.html",
      files: [{ path: "index.html", body: body.html, contentType: "text/html; charset=utf-8", byteLength: byteLength(body.html) }]
    };
  }

  if (!Array.isArray(body.files)) {
    return { ok: false, error: "html_or_files_required" };
  }

  const files: PreparedUploadFile[] = [];
  for (const raw of body.files) {
    if (!isPlainObject(raw)) {
      return { ok: false, error: "invalid_file" };
    }
    const input = raw as UploadFileInput;
    if (typeof input.path !== "string" || typeof input.content !== "string") {
      return { ok: false, error: "invalid_file" };
    }
    const normalizedPath = normalizeR2Path(input.path);
    if (!normalizedPath) {
      return { ok: false, error: "invalid_file_path" };
    }
    if (normalizedPath.startsWith("__MACOSX/") || normalizedPath.endsWith("/.DS_Store") || normalizedPath === ".DS_Store") {
      continue;
    }
    const encoding = input.encoding === "base64" ? "base64" : "text";
    const fileBody = encoding === "base64" ? base64ToBytes(input.content) : input.content;
    files.push({
      path: normalizedPath,
      body: fileBody,
      contentType: typeof input.contentType === "string" ? input.contentType : contentTypeFromPath(normalizedPath),
      byteLength: byteLength(fileBody)
    });
  }

  const entryPath = typeof body.entryPath === "string" && body.entryPath.trim() ? normalizeR2Path(body.entryPath) : "index.html";
  if (!entryPath) {
    return { ok: false, error: "invalid_entry_path" };
  }
  if (!files.some((file) => file.path === entryPath)) {
    return { ok: false, error: "entry_file_missing" };
  }
  return { ok: true, files, entryPath };
}

function metricsSelectSql(where = "s.deleted_at IS NULL"): string {
  return `SELECT s.*,
    COALESCE((SELECT COUNT(*) FROM access_events ae WHERE ae.site_id = s.id AND ae.event_type = 'view'), 0) AS views,
    COALESCE((SELECT COUNT(*) FROM access_events ae WHERE ae.site_id = s.id AND ae.event_type = 'auth_success'), 0) AS auth_views,
    COALESCE((SELECT COUNT(DISTINCT COALESCE(ae.ip_hash || ':' || ae.user_agent_hash, ae.id)) FROM access_events ae WHERE ae.site_id = s.id AND ae.event_type = 'view'), 0) AS unique_visitors,
    COALESCE((SELECT SUM(r.total_bytes) FROM revisions r WHERE r.site_id = s.id), 0) AS total_bytes,
    (SELECT MAX(ae.created_at) FROM access_events ae WHERE ae.site_id = s.id) AS last_seen_at
  FROM sites s WHERE ${where}`;
}

function maskEmail(email: string | null | undefined): string | null {
  if (!email) {
    return null;
  }
  const [local, domain] = email.split("@");
  if (!domain) {
    return local.length > 1 ? `${local.slice(0, 1)}***` : "***";
  }
  return `${local.slice(0, 1)}****@${domain}`;
}

interface AccessEventRow {
  id: string;
  site_id: string;
  path: string;
  event_type: AccessEventSummary["eventType"];
  email?: string | null;
  ip_hash?: string | null;
  created_at: string;
}

function mapEvent(row: AccessEventRow): AccessEventSummary {
  return {
    id: row.id,
    siteId: row.site_id,
    path: row.path,
    eventType: row.event_type,
    maskedEmail: maskEmail(row.email),
    ipHashShort: row.ip_hash ? row.ip_hash.slice(0, 8) : null,
    createdAt: row.created_at
  };
}

interface BillingSubscriptionRow {
  plan_id: string | null;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: number;
  stripe_customer_id: string | null;
}

async function getOwnerSubscription(db: D1Database, ownerUserId: string): Promise<BillingSubscriptionRow | null> {
  return db
    .prepare(
      `SELECT plan_id, status, current_period_end, cancel_at_period_end, stripe_customer_id
       FROM billing_subscriptions WHERE owner_user_id = ? ORDER BY updated_at DESC LIMIT 1`
    )
    .bind(ownerUserId)
    .first<BillingSubscriptionRow>();
}

async function hasPlanTrialHistoryByOwnerOrCustomer(db: D1Database, ownerUserId: string, customerId: string | null, planId: string): Promise<boolean> {
  const row = await db
    .prepare(
      `SELECT id
       FROM billing_plan_trials
       WHERE plan_id = ? AND (owner_user_id = ? OR (? IS NOT NULL AND stripe_customer_id = ?))
       LIMIT 1`
    )
    .bind(planId, ownerUserId, customerId, customerId)
    .first<{ id: string }>();
  if (row) {
    return true;
  }
  const subscriptionRow = await db
    .prepare(
      `SELECT id
       FROM billing_subscriptions
       WHERE plan_id = ? AND (owner_user_id = ? OR (? IS NOT NULL AND stripe_customer_id = ?))
       LIMIT 1`
    )
    .bind(planId, ownerUserId, customerId, customerId)
    .first<{ id: string }>();
  return subscriptionRow !== null;
}

function isActiveSubscriptionStatus(status: string | null | undefined): boolean {
  return status === "active" || status === "trialing";
}


/** Feature-access tier from the owner's active subscription (0 = free / single-site purchase). */
async function ownerActivePlanRank(db: D1Database, ownerUserId: string): Promise<number> {
  const subscription = await getOwnerSubscription(db, ownerUserId);
  if (!subscription || !isActiveSubscriptionStatus(subscription.status)) {
    return 0;
  }
  return planFeatureRank(subscription.plan_id);
}

interface SiteQuotaReservation {
  source: "plan" | "purchase" | "unlimited";
  planId?: string;
  purchaseId?: string;
}

interface BillingSitePurchaseRow {
  id: string;
  site_quota: number;
  used_site_count: number;
}

async function activeSiteCount(db: D1Database, ownerUserId: string): Promise<number> {
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS activeSiteCount
       FROM sites
       WHERE owner_user_id = ? AND deleted_at IS NULL AND status = 'active'`
    )
    .bind(ownerUserId)
    .first<{ activeSiteCount: number }>();
  return Number(row?.activeSiteCount ?? 0);
}

async function reserveSingleSitePurchase(db: D1Database, ownerUserId: string, updatedAt: string): Promise<SiteQuotaReservation | null> {
  const purchase = await db
    .prepare(
      `SELECT id, site_quota, used_site_count
       FROM billing_site_purchases
       WHERE owner_user_id = ?
         AND status IN ('paid', 'checkout_completed')
         AND site_quota > used_site_count
       ORDER BY created_at ASC
       LIMIT 1`
    )
    .bind(ownerUserId)
    .first<BillingSitePurchaseRow>();
  if (!purchase) {
    return null;
  }
  const result = await db
    .prepare(
      `UPDATE billing_site_purchases
       SET used_site_count = used_site_count + 1, updated_at = ?
       WHERE id = ? AND site_quota > used_site_count`
    )
    .bind(updatedAt, purchase.id)
    .run();
  return result.meta.changes > 0 ? { source: "purchase", purchaseId: purchase.id } : null;
}

async function unusedSingleSitePurchaseCount(db: D1Database, ownerUserId: string): Promise<number> {
  const row = await db
    .prepare(
      `SELECT COALESCE(SUM(site_quota - used_site_count), 0) AS unusedSitePurchases
       FROM billing_site_purchases
       WHERE owner_user_id = ?
         AND status IN ('paid', 'checkout_completed')
         AND site_quota > used_site_count`
    )
    .bind(ownerUserId)
    .first<{ unusedSitePurchases: number }>();
  return Number(row?.unusedSitePurchases ?? 0);
}

async function releaseSiteQuotaReservation(db: D1Database, reservation: SiteQuotaReservation | null, updatedAt: string): Promise<void> {
  if (reservation?.source !== "purchase" || !reservation.purchaseId) {
    return;
  }
  await db
    .prepare(
      `UPDATE billing_site_purchases
       SET used_site_count = MAX(used_site_count - 1, 0), updated_at = ?
       WHERE id = ?`
    )
    .bind(updatedAt, reservation.purchaseId)
    .run();
}

async function assertCanCreateSite(
  db: D1Database,
  ownerUserId: string,
  now: string,
  options: { preferPurchase?: boolean } = {}
): Promise<{ ok: true; reservation: SiteQuotaReservation } | { ok: false; response: Response }> {
  const subscription = await getOwnerSubscription(db, ownerUserId);
  const activePlanId = subscription && isActiveSubscriptionStatus(subscription.status) ? subscription.plan_id : null;
  const limit = planSiteLimit(activePlanId);
  if (limit === null) {
    return { ok: true, reservation: { source: "unlimited", planId: activePlanId ?? "pro" } };
  }
  if (options.preferPurchase) {
    const purchaseReservation = await reserveSingleSitePurchase(db, ownerUserId, now);
    if (purchaseReservation) {
      return { ok: true, reservation: purchaseReservation };
    }
  }
  const currentActiveSites = await activeSiteCount(db, ownerUserId);
  if (currentActiveSites < limit) {
    return { ok: true, reservation: { source: "plan", planId: activePlanId ?? "free" } };
  }
  const purchaseReservation = await reserveSingleSitePurchase(db, ownerUserId, now);
  if (purchaseReservation) {
    return { ok: true, reservation: purchaseReservation };
  }
  const planId = activePlanId ?? "free";
  return {
    ok: false,
    response: jsonError(planId === "free" ? "free_plan_site_limit_exceeded" : "plan_limit_exceeded", 402, {
      planId,
      siteLimit: limit,
      activeSites: currentActiveSites
    })
  };
}

const FREE_PLAN_EXPIRY_GRACE_MS = 5 * 60 * 1000;

function addDaysToIso(iso: string, days: number): string {
  return new Date(new Date(iso).getTime() + days * 24 * 60 * 60 * 1000).toISOString();
}

function shouldPreferPaidReservationForExpiry(requestedExpiresAt: string | null | undefined, createdAt: string): boolean {
  if (!requestedExpiresAt) {
    return true;
  }
  const requestedTime = new Date(requestedExpiresAt).getTime();
  const freeMaxTime = new Date(addDaysToIso(createdAt, FREE_PLAN_PUBLISH_DAYS)).getTime() + FREE_PLAN_EXPIRY_GRACE_MS;
  return Number.isFinite(requestedTime) && requestedTime > freeMaxTime;
}

function applyPublishingExpiryPolicy(
  requestedExpiresAt: string | null | undefined,
  reservation: SiteQuotaReservation,
  createdAt: string
): { ok: true; expiresAt: string | null } | { ok: false; response: Response } {
  if (reservation.source !== "plan" || reservation.planId !== "free") {
    return { ok: true, expiresAt: requestedExpiresAt ?? null };
  }

  const maxExpiresAt = addDaysToIso(createdAt, FREE_PLAN_PUBLISH_DAYS);
  if (!requestedExpiresAt) {
    return { ok: true, expiresAt: maxExpiresAt };
  }

  const requestedTime = new Date(requestedExpiresAt).getTime();
  const maxTime = new Date(maxExpiresAt).getTime() + FREE_PLAN_EXPIRY_GRACE_MS;
  if (!Number.isFinite(requestedTime) || requestedTime > maxTime) {
    return {
      ok: false,
      response: jsonError("free_plan_expiry_limit_exceeded", 402, {
        planId: "free",
        maxDays: FREE_PLAN_PUBLISH_DAYS,
        maxExpiresAt
      })
    };
  }

  return { ok: true, expiresAt: requestedExpiresAt };
}

function renewedExpiryIso(currentExpiresAt: string, renewedAt: string): string {
  const targetExpiresAt = addDaysToIso(renewedAt, FREE_PLAN_PUBLISH_DAYS);
  const currentTime = new Date(currentExpiresAt).getTime();
  const targetTime = new Date(targetExpiresAt).getTime();
  return Number.isFinite(currentTime) && currentTime > targetTime ? currentExpiresAt : targetExpiresAt;
}

interface ApiVariables {
  ownerUserId: string;
  ownerEmail: string;
}

interface CheckoutSessionInput {
  planId?: unknown;
}

function billingCheckoutErrorCode(result: { error: string; message?: string }): string {
  if (result.error !== "stripe_request_failed") {
    return result.error;
  }
  const message = result.message ?? "";
  if (message.includes("cannot currently make live charges")) {
    return "stripe_live_charges_disabled";
  }
  return result.error;
}

interface SiteUpdateInput {
  slug?: unknown;
  indexingEnabled?: unknown;
  hideBranding?: unknown;
  authMode?: unknown;
  password?: unknown;
  allowedEmailDomains?: unknown;
  allowedEmails?: unknown;
}

interface NormalizedSiteUpdate {
  slug?: string;
  indexingEnabled?: boolean;
  hideBranding?: boolean;
  auth?: {
    authMode: NormalizedSiteInput["authMode"];
    password?: string;
    allowedEmailDomains: string[];
    allowedEmails: string[];
  };
}

interface AgentUploadTokenInput extends SiteCreateInput {
  label?: unknown;
  tokenTtlSeconds?: unknown;
  maxBytes?: unknown;
  maxFiles?: unknown;
}

interface AgentUploadTokenRow {
  id: string;
  owner_user_id: string;
  token_hash: string;
  label: string | null;
  site_config_json: string;
  max_bytes: number;
  max_files: number;
  expires_at: string;
  used_at: string | null;
  created_site_id: string | null;
  created_revision_id: string | null;
  created_at: string;
  revoked_at: string | null;
}

interface AgentUploadSiteConfig {
  title: string;
  slug?: string;
  authMode: NormalizedSiteInput["authMode"];
  passwordHash: string | null;
  allowedEmailDomains: string[];
  expiresAt: string | null;
  indexingEnabled: boolean;
}

interface RevisionUploadLimits {
  maxBytes: number;
  maxFiles: number;
  allowSecurityOverride?: boolean;
}

interface ValidatedRevisionUpload {
  files: PreparedUploadFile[];
  entryPath: string;
  totalBytes: number;
  entryHtml: string;
  warnings: string[];
}

interface CreateApiAppOptions {
  sessionResolver?: (env: Env, request: Request) => Promise<UserSessionData | null>;
}

function stripeEnv(env: Env): StripeRuntimeEnv {
  return env as Env & StripeRuntimeEnv;
}

function stripeWebhookEnv(env: Env): StripeWebhookEnv {
  return env as Env & StripeWebhookEnv;
}

function ollamaSecurityEnv(env: Env): OllamaSecurityRuntimeEnv {
  return env as Env & OllamaSecurityRuntimeEnv;
}

async function safeRecordApiMeasurementEvent(
  env: Env,
  request: Request,
  input: Omit<MeasurementRecordInput, "eventName"> & { eventName: MeasurementEventName }
): Promise<void> {
  try {
    await recordMeasurementEvent(env, request, input);
  } catch {
    // Best-effort measurement must never break checkout, auth, or upload flows.
  }
}

function isPublicApiPath(pathname: string): boolean {
  return pathname === "/api/health" || pathname === "/api/contact" || pathname === "/api/measure" || pathname === "/api/public/publish" || pathname === "/api/public/publish-password" || pathname === "/api/agent/setup" || pathname.startsWith("/api/agent/uploads/") || pathname === "/api/billing/stripe/config" || pathname === "/api/billing/stripe/webhook" || pathname === "/api/auth/bootstrap" || pathname === "/api/auth/request-code" || pathname === "/api/auth/verify-code" || pathname === "/api/auth/sign-out";
}

function isStateChangingMethod(method: string): boolean {
  return method !== "GET" && method !== "HEAD" && method !== "OPTIONS";
}

function trustedAppOrigin(env: Env): string {
  return `https://${env.APP_HOST}`;
}

function urlOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function isJsonRequest(request: Request): boolean {
  const contentType = request.headers.get("Content-Type");
  return contentType !== null && contentType.split(";", 1)[0].trim().toLowerCase() === "application/json";
}

async function requireJsonObjectBody(request: Request): Promise<{ ok: true } | { ok: false; response: Response }> {
  if (!isJsonRequest(request)) {
    return { ok: false, response: jsonError("invalid_json") };
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { ok: false, response: jsonError("invalid_json") };
  }
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, response: jsonError("invalid_json") };
  }
  return { ok: true };
}

function requestOriginAllowed(request: Request, env: Env): boolean {
  if (!isStateChangingMethod(request.method)) {
    return true;
  }
  const trustedOrigin = trustedAppOrigin(env);
  const origin = request.headers.get("Origin");
  if (origin) {
    return origin === trustedOrigin;
  }
  const referer = request.headers.get("Referer");
  if (referer) {
    return urlOrigin(referer) === trustedOrigin;
  }
  return true;
}

function mapUserSession(session: UserSessionData) {
  return { user: { id: session.user.id, email: session.user.email, name: session.user.name, image: session.user.image ?? null } };
}

function normalizeSiteUpdateInput(body: SiteUpdateInput): { ok: true; value: NormalizedSiteUpdate } | { ok: false; error: string } {
  const value: NormalizedSiteUpdate = {};

  if (body.slug !== undefined) {
    if (typeof body.slug !== "string" || body.slug.trim().length === 0) {
      return { ok: false, error: "invalid_slug" };
    }
    const slug = normalizeSlug(body.slug);
    if (!slug.ok) {
      return slug;
    }
    if (!slug.value) {
      return { ok: false, error: "invalid_slug" };
    }
    value.slug = slug.value;
  }

  if (body.indexingEnabled !== undefined) {
    if (typeof body.indexingEnabled !== "boolean") {
      return { ok: false, error: "invalid_indexing_enabled" };
    }
    value.indexingEnabled = body.indexingEnabled;
  }

  if (body.hideBranding !== undefined) {
    if (typeof body.hideBranding !== "boolean") {
      return { ok: false, error: "invalid_hide_branding" };
    }
    value.hideBranding = body.hideBranding;
  }

  if (body.authMode !== undefined) {
    const validated = normalizeAuthInput(
      {
        authMode: body.authMode,
        password: body.password,
        allowedEmailDomains: body.allowedEmailDomains,
        allowedEmails: body.allowedEmails
      },
      { requirePassword: false }
    );
    if (!validated.ok) {
      return validated;
    }
    value.auth = {
      authMode: validated.value.authMode,
      password: validated.value.password,
      allowedEmailDomains: validated.value.allowedEmailDomains ?? [],
      allowedEmails: validated.value.allowedEmails ?? []
    };
  }

  if (value.slug === undefined && value.indexingEnabled === undefined && value.hideBranding === undefined && !value.auth) {
    return { ok: false, error: "no_updates" };
  }
  return { ok: true, value };
}

function safeLabel(value: unknown): string | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 120) : null;
}

function normalizePositiveInteger(value: unknown, fallback: number, min: number, max: number): number | null {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  if (typeof value !== "number" || !Number.isInteger(value) || value < min || value > max) {
    return null;
  }
  return value;
}

function addSeconds(seconds: number): string {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

function buildUploadTokenValue(id: string, secret: string): string {
  return `gut_${id}_${secret}`;
}

function tokenIdFromValue(token: string): string | null {
  const match = /^gut_([a-f0-9-]{36})_[A-Za-z0-9_-]{20,}$/.exec(token);
  return match?.[1] ?? null;
}

function bearerToken(request: Request): string | null {
  const header = request.headers.get("Authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match?.[1] ?? null;
}

async function siteConfigFromInput(input: NormalizedSiteInput): Promise<AgentUploadSiteConfig> {
  return {
    title: input.title,
    slug: input.slug,
    authMode: input.authMode,
    passwordHash: input.password ? await hashPassword(input.password) : null,
    allowedEmailDomains: input.allowedEmailDomains ?? [],
    expiresAt: input.expiresAt ?? null,
    indexingEnabled: input.authMode === "random" && input.indexingEnabled
  };
}

function publicSiteConfig(config: AgentUploadSiteConfig) {
  return {
    title: config.title,
    slug: config.slug ?? null,
    authMode: config.authMode,
    allowedEmailDomains: config.allowedEmailDomains,
    expiresAt: config.expiresAt,
    indexingEnabled: config.indexingEnabled
  };
}

function parseStoredSiteConfig(value: string): AgentUploadSiteConfig | null {
  try {
    const parsed = JSON.parse(value) as Partial<AgentUploadSiteConfig>;
    if (!parsed || typeof parsed.title !== "string" || typeof parsed.authMode !== "string") {
      return null;
    }
    return {
      title: parsed.title,
      slug: typeof parsed.slug === "string" ? parsed.slug : undefined,
      authMode: parsed.authMode as AgentUploadSiteConfig["authMode"],
      passwordHash: typeof parsed.passwordHash === "string" ? parsed.passwordHash : null,
      allowedEmailDomains: Array.isArray(parsed.allowedEmailDomains) ? parsed.allowedEmailDomains.filter((item): item is string => typeof item === "string") : [],
      expiresAt: typeof parsed.expiresAt === "string" ? parsed.expiresAt : null,
      indexingEnabled: parsed.indexingEnabled === true
    };
  } catch {
    return null;
  }
}

type AgentUploadTokenStatus = "ready" | "used" | "expired" | "revoked";

function agentUploadTokenStatus(row: AgentUploadTokenRow): AgentUploadTokenStatus {
  if (row.revoked_at) return "revoked";
  if (row.used_at) return "used";
  if (new Date(row.expires_at).getTime() <= Date.now()) return "expired";
  return "ready";
}

function inactiveAgentUploadTokenResponse(row: AgentUploadTokenRow): Response | null {
  if (row.revoked_at) {
    return agentUploadJsonError("upload_token_revoked", 410);
  }
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    return agentUploadJsonError("upload_token_expired", 410);
  }
  return null;
}

async function agentUploadTokenMatchesRequest(row: AgentUploadTokenRow, request: Request, tokenId: string): Promise<boolean> {
  const token = bearerToken(request);
  if (!token || tokenIdFromValue(token) !== tokenId) {
    return false;
  }
  const tokenHash = await sha256Hex(token);
  return constantTimeEqual(tokenHash, row.token_hash);
}

function prepareRevisionUpload(
  body: UploadRevisionInput,
  limits: RevisionUploadLimits
): { ok: true; upload: ValidatedRevisionUpload } | { ok: false; response: Response } {
  const prepared = prepareUploadFiles(body);
  if (!prepared.ok) {
    return { ok: false, response: agentUploadJsonError(prepared.error) };
  }
  if (prepared.files.length > limits.maxFiles) {
    return { ok: false, response: agentUploadJsonError("too_many_files", 400, { maxFiles: limits.maxFiles }) };
  }
  const totalBytes = prepared.files.reduce((sum, file) => sum + file.byteLength, 0);
  if (totalBytes > limits.maxBytes) {
    return { ok: false, response: agentUploadJsonError("upload_too_large", 400, { totalBytes, maxBytes: limits.maxBytes }) };
  }
  const entry = prepared.files.find((file) => file.path === prepared.entryPath);
  if (!entry) {
    return { ok: false, response: agentUploadJsonError("entry_file_missing") };
  }
  const entryHtml = textFromBody(entry.body);
  const validation = validateUploadedHtml(entryHtml, limits.maxBytes);
  if (!validation.ok) {
    return { ok: false, response: agentUploadJsonError(validation.error ?? "invalid_html", 400, { validation }) };
  }
  const warnings = [...new Set([...scanHtmlForWarnings(entryHtml), ...prepared.files.flatMap((file) => scanPathForWarnings(file.path))])];
  return { ok: true, upload: { files: prepared.files, entryPath: prepared.entryPath, totalBytes, entryHtml, warnings } };
}

async function validatePreparedRevisionUpload(
  env: Env,
  body: UploadRevisionInput,
  upload: ValidatedRevisionUpload,
  limits: RevisionUploadLimits
): Promise<{ ok: true; upload: ValidatedRevisionUpload } | { ok: false; response: Response }> {
  const aiWarnings = await scanUploadWithAiSecurity(ollamaSecurityEnv(env), {
    entryPath: upload.entryPath,
    entryHtml: upload.entryHtml,
    files: upload.files.map((file) => ({ path: file.path, contentType: file.contentType, byteLength: file.byteLength })),
    localWarnings: upload.warnings
  });
  const warnings = [...new Set([...upload.warnings, ...aiWarnings])];
  const blockingWarnings = blockingSecurityWarnings(warnings);
  const allowSecurityOverride = limits.allowSecurityOverride === true;
  if (blockingWarnings.length > 0 && !(allowSecurityOverride && securityOverrideAccepted(body.securityOverrideAccepted))) {
    return { ok: false, response: securityReviewWarningResponse(blockingWarnings, allowSecurityOverride) };
  }
  return { ok: true, upload: { ...upload, warnings } };
}

async function validateRevisionUpload(
  env: Env,
  body: UploadRevisionInput,
  limits: RevisionUploadLimits
): Promise<{ ok: true; upload: ValidatedRevisionUpload } | { ok: false; response: Response }> {
  const prepared = prepareRevisionUpload(body, limits);
  if (!prepared.ok) {
    return prepared;
  }
  return validatePreparedRevisionUpload(env, body, prepared.upload, limits);
}

function isUniqueConstraintError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /UNIQUE constraint failed|constraint failed|SQLITE_CONSTRAINT/i.test(message);
}

async function createSiteRecord(
  env: Env,
  ownerUserId: string,
  input: NormalizedSiteInput,
  createdAt: string
): Promise<{ ok: true; site: SiteRow; reservation: SiteQuotaReservation } | { ok: false; response: Response }> {
  const slug = await chooseUniqueSlug(env.DB, input.slug);
  if (!slug) {
    return { ok: false, response: jsonError(input.slug ? "slug_already_taken" : "slug_generation_failed", input.slug ? 409 : 500) };
  }

  const quota = await assertCanCreateSite(env.DB, ownerUserId, createdAt, {
    preferPurchase: shouldPreferPaidReservationForExpiry(input.expiresAt, createdAt)
  });
  if (!quota.ok) {
    return quota;
  }
  const expiryPolicy = applyPublishingExpiryPolicy(input.expiresAt, quota.reservation, createdAt);
  if (!expiryPolicy.ok) {
    await releaseSiteQuotaReservation(env.DB, quota.reservation, createdAt);
    return expiryPolicy;
  }

  const passwordHash = input.password ? await hashPassword(input.password) : null;
  try {
    await env.DB.prepare(
      `INSERT INTO sites (
        id, owner_user_id, slug, title, status, auth_mode, password_hash,
        allowed_email_domains, allowed_emails, indexing_enabled, hide_branding, tool,
        expires_at, current_revision_id, created_at, updated_at, deleted_at
      ) VALUES (?, ?, ?, ?, 'active', ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, NULL)`
    )
      .bind(
        crypto.randomUUID(),
        ownerUserId,
        slug,
        input.title,
        input.authMode,
        passwordHash,
        JSON.stringify(input.allowedEmailDomains ?? []),
        JSON.stringify(input.allowedEmails ?? []),
        input.indexingEnabled ? 1 : 0,
        input.hideBranding ? 1 : 0,
        input.tool ?? null,
        expiryPolicy.expiresAt,
        createdAt,
        createdAt
      )
      .run();
  } catch (error) {
    await releaseSiteQuotaReservation(env.DB, quota.reservation, createdAt);
    if (input.slug && isUniqueConstraintError(error)) {
      return { ok: false, response: jsonError("slug_already_taken", 409) };
    }
    throw error;
  }

  const row = await env.DB.prepare(`SELECT * FROM sites WHERE slug = ? AND owner_user_id = ? AND deleted_at IS NULL`)
    .bind(slug, ownerUserId)
    .first<SiteRow>();
  if (!row) {
    await releaseSiteQuotaReservation(env.DB, quota.reservation, createdAt);
    return { ok: false, response: jsonError("site_not_created", 500) };
  }
  return { ok: true, site: row, reservation: quota.reservation };
}

async function rollbackCreatedSite(env: Env, siteId: string, reservation: SiteQuotaReservation, updatedAt: string): Promise<void> {
  await env.DB.prepare(`UPDATE sites SET status = 'deleted', deleted_at = ?, updated_at = ? WHERE id = ?`)
    .bind(updatedAt, updatedAt, siteId)
    .run();
  await releaseSiteQuotaReservation(env.DB, reservation, updatedAt);
}

async function validateSiteQuotaOnly(env: Env, ownerUserId: string, now: string, requestedExpiresAt?: string | null): Promise<Response | null> {
  const quota = await assertCanCreateSite(env.DB, ownerUserId, now, {
    preferPurchase: shouldPreferPaidReservationForExpiry(requestedExpiresAt, now)
  });
  if (!quota.ok) {
    return quota.response;
  }
  const expiryPolicy = applyPublishingExpiryPolicy(requestedExpiresAt, quota.reservation, now);
  await releaseSiteQuotaReservation(env.DB, quota.reservation, now);
  if (!expiryPolicy.ok) {
    return expiryPolicy.response;
  }
  return null;
}

interface PublicPublishAuth {
  authMode: "random" | "password";
  passwordHash: string | null;
}

interface PublicPublishPasswordInput {
  siteId?: unknown;
  claimToken?: unknown;
  password?: unknown;
}

async function normalizePublicPublishAuthInput(body: SiteWithRevisionInput): Promise<{ ok: true; value: PublicPublishAuth } | { ok: false; error: string }> {
  const requestedAuthMode = body.authMode ?? "random";
  if (requestedAuthMode !== "random" && requestedAuthMode !== "password") {
    return { ok: false, error: "invalid_auth_mode" };
  }
  const normalized = normalizeAuthInput(
    {
      authMode: requestedAuthMode,
      password: body.password
    },
    { requirePassword: requestedAuthMode === "password" }
  );
  if (!normalized.ok) {
    return normalized;
  }
  return {
    ok: true,
    value: {
      authMode: requestedAuthMode,
      passwordHash: normalized.value.password ? await hashPassword(normalized.value.password) : null
    }
  };
}

interface RevisionMeta {
  createdBy?: string | null;
  note?: string | null;
  restoredFromRevisionId?: string | null;
}

async function persistRevision(env: Env, site: SiteRow, upload: ValidatedRevisionUpload, meta: RevisionMeta = {}): Promise<RevisionSummary> {
  const revisionId = crypto.randomUUID();
  const r2Prefix = `sites/${site.id}/revisions/${revisionId}`;
  const createdAt = nowIso();
  const entry = upload.files.find((file) => file.path === upload.entryPath) ?? upload.files[0];
  const contentSha256 = await sha256Hex(entry.body);

  await Promise.all(
    upload.files.map((file) =>
      env.HTML_BUCKET.put(`${r2Prefix}/${file.path}`, file.body, {
        httpMetadata: { contentType: file.contentType },
        customMetadata: { siteId: site.id, revisionId, path: file.path }
      })
    )
  );

  await env.DB.prepare(
    `INSERT INTO revisions (
      id, site_id, r2_prefix, entry_path, file_count, total_bytes, content_sha256, warnings_json, created_at, created_by, note, restored_from_revision_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      revisionId,
      site.id,
      r2Prefix,
      upload.entryPath,
      upload.files.length,
      upload.totalBytes,
      contentSha256,
      JSON.stringify(upload.warnings),
      createdAt,
      meta.createdBy ?? null,
      meta.note ?? null,
      meta.restoredFromRevisionId ?? null
    )
    .run();

  await env.DB.prepare(`UPDATE sites SET current_revision_id = ?, updated_at = ? WHERE id = ?`)
    .bind(revisionId, createdAt, site.id)
    .run();

  return {
    id: revisionId,
    siteId: site.id,
    warnings: upload.warnings,
    previewUrl: mapSiteRow(site, env.PREVIEW_HOST_SUFFIX).previewUrl,
    byteLength: upload.totalBytes,
    fileCount: upload.files.length,
    entryPath: upload.entryPath,
    createdAt
  };
}

const REVISION_PREVIEW_TOKEN_TTL_MS = 10 * 60 * 1000;

function parseRevisionWarnings(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

/** Map raw revision rows (any order) into history items with chronological generation numbers. */
function mapRevisionHistory(rows: RevisionRow[], currentRevisionId: string | null): RevisionHistoryItem[] {
  const chronological = [...rows].sort((a, b) => (a.created_at < b.created_at ? -1 : a.created_at > b.created_at ? 1 : 0));
  const generationById = new Map<string, number>();
  chronological.forEach((row, index) => generationById.set(row.id, index + 1));
  return chronological
    .map((row) => ({
      id: row.id,
      siteId: row.site_id,
      generation: generationById.get(row.id) ?? 0,
      isCurrent: row.id === currentRevisionId,
      fileCount: row.file_count,
      byteLength: row.total_bytes,
      entryPath: row.entry_path,
      createdBy: row.created_by ?? null,
      note: row.note ?? null,
      restoredFromRevisionId: row.restored_from_revision_id ?? null,
      restoredFromGeneration: row.restored_from_revision_id ? generationById.get(row.restored_from_revision_id) ?? null : null,
      warnings: parseRevisionWarnings(row.warnings_json),
      createdAt: row.created_at
    }))
    .reverse();
}

const COMMENT_BODY_MAX = 4000;

function normalizeCommentStatus(value: unknown): RevisionCommentStatus {
  return value === "in_progress" || value === "resolved" ? value : "open";
}

function sanitizeAnchorRectInput(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const rect = value as Record<string, unknown>;
  const num = (key: string): number | null => (typeof rect[key] === "number" && Number.isFinite(rect[key]) ? (rect[key] as number) : null);
  const x = num("x");
  const y = num("y");
  const width = num("width");
  const height = num("height");
  if (x === null || y === null || width === null || height === null) {
    return null;
  }
  return JSON.stringify({ x, y, width, height, viewportWidth: num("viewportWidth") ?? 0 });
}

function mapCommentRow(row: SiteRevisionCommentRow): RevisionCommentSummary {
  let anchorRect = null;
  if (row.anchor_rect_json) {
    try {
      const parsed = JSON.parse(row.anchor_rect_json) as Record<string, unknown>;
      const num = (key: string): number | null => (typeof parsed[key] === "number" && Number.isFinite(parsed[key]) ? (parsed[key] as number) : null);
      const x = num("x");
      const y = num("y");
      const width = num("width");
      const height = num("height");
      if (x !== null && y !== null && width !== null && height !== null) {
        anchorRect = { x, y, width, height, viewportWidth: num("viewportWidth") ?? 0 };
      }
    } catch {
      anchorRect = null;
    }
  }
  return {
    id: row.id,
    siteId: row.site_id,
    revisionId: row.revision_id,
    selector: row.selector,
    textSnippet: row.text_snippet,
    anchorRect,
    body: row.body,
    status: normalizeCommentStatus(row.status),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/** Append the owner preview token to a site's preview URL (absolute or local fallback). */
function buildRevisionPreviewUrl(baseUrl: string, token: string): string {
  if (/^https?:\/\//i.test(baseUrl)) {
    const url = new URL(baseUrl);
    url.searchParams.set("__rev_preview", token);
    return url.toString();
  }
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}__rev_preview=${encodeURIComponent(token)}`;
}

export function createApiApp(options: CreateApiAppOptions = {}) {
  const app = new Hono<{ Bindings: Env; Variables: ApiVariables }>();

  app.use("/api/*", async (c, next) => {
    const pathname = new URL(c.req.url).pathname;
    if (isPublicApiPath(pathname)) {
      await next();
      return;
    }
    const session = options.sessionResolver ? await options.sessionResolver(c.env, c.req.raw) : await getUserSession(c.env, c.req.raw);
    if (!session) {
      return jsonError("session_required", 401);
    }
    if (!requestOriginAllowed(c.req.raw, c.env)) {
      return jsonError("csrf_origin_denied", 403);
    }
    c.set("ownerUserId", session.user.id);
    c.set("ownerEmail", session.user.email);
    await next();
  });

  app.get("/api/health", (c) => c.json({ ok: true, service: "giga-site-bin", runtime: "cloudflare-workers" }));

  app.post("/api/measure", (c) => {
    if (!requestOriginAllowed(c.req.raw, c.env)) {
      return jsonError("csrf_origin_denied", 403);
    }
    return handleMeasurementRequest(c.env, c.req.raw);
  });

  app.post("/api/contact", async (c) => {
    let body: { name?: unknown; email?: unknown; company?: unknown; category?: unknown; message?: unknown; website?: unknown; sourcePath?: unknown };
    try {
      body = await c.req.json();
    } catch {
      return jsonError("invalid_json");
    }
    const result = await handleContactSubmission(c.env, c.req.raw, body);
    if (!result.ok) {
      return jsonError(result.error, result.status);
    }
    return c.json({ accepted: true });
  });

  app.get("/api/agent/setup", (c) => c.json(buildAgentSetupManifest(`https://${c.env.APP_HOST}`)));

  app.post("/api/agent/upload-tokens", async (c) => {
    let body: AgentUploadTokenInput;
    try {
      body = await c.req.json<AgentUploadTokenInput>();
    } catch {
      return jsonError("invalid_json");
    }

    const normalized = normalizeSiteInput(body);
    if (!normalized.ok) {
      return jsonError(normalized.error);
    }
    // Agent upload tokens don't carry an email allowlist, so an email_otp site
    // minted here would be permanently inaccessible. Reject it explicitly.
    if (normalized.value.authMode === "email_otp") {
      return jsonError("auth_mode_unsupported_for_agent", 400);
    }

    const quotaResponse = await validateSiteQuotaOnly(c.env, c.get("ownerUserId"), nowIso(), normalized.value.expiresAt);
    if (quotaResponse) {
      return quotaResponse;
    }

    const defaultMaxBytes = envNumber(c.env.MAX_HTML_BYTES, 10 * 1024 * 1024);
    const defaultMaxFiles = envNumber(c.env.MAX_UPLOAD_FILES, 200);
    const tokenTtlSeconds = normalizePositiveInteger(body.tokenTtlSeconds, 3600, 60, 24 * 60 * 60);
    const maxBytes = normalizePositiveInteger(body.maxBytes, defaultMaxBytes, 1, defaultMaxBytes);
    const maxFiles = normalizePositiveInteger(body.maxFiles, defaultMaxFiles, 1, defaultMaxFiles);
    if (tokenTtlSeconds === null) {
      return jsonError("invalid_token_ttl_seconds");
    }
    if (maxBytes === null) {
      return jsonError("invalid_max_bytes");
    }
    if (maxFiles === null) {
      return jsonError("invalid_max_files");
    }

    const id = crypto.randomUUID();
    const token = buildUploadTokenValue(id, randomTokenSecret());
    const tokenHash = await sha256Hex(token);
    const createdAt = nowIso();
    const expiresAt = addSeconds(tokenTtlSeconds);
    const siteConfig = await siteConfigFromInput(normalized.value);

    await c.env.DB.prepare(
      `INSERT INTO agent_upload_tokens (
        id, owner_user_id, token_hash, label, site_config_json, max_bytes, max_files,
        expires_at, used_at, created_site_id, created_revision_id, created_at, revoked_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, ?, NULL)`
    )
      .bind(
        id,
        c.get("ownerUserId"),
        tokenHash,
        safeLabel(body.label),
        JSON.stringify(siteConfig),
        maxBytes,
        maxFiles,
        expiresAt,
        createdAt
      )
      .run();

    const origin = `https://${c.env.APP_HOST}`;
    return c.json(
      {
        uploadToken: {
          id,
          token,
          uploadUrl: `${origin}/api/agent/uploads/${id}`,
          statusUrl: `${origin}/api/agent/uploads/${id}`,
          expiresAt,
          maxBytes,
          maxFiles,
          siteConfig: publicSiteConfig(siteConfig)
        }
      },
      201
    );
  });

  app.get("/api/agent/uploads/:tokenId", async (c) => {
    const tokenId = c.req.param("tokenId");
    const row = await c.env.DB.prepare(`SELECT * FROM agent_upload_tokens WHERE id = ?`).bind(tokenId).first<AgentUploadTokenRow>();
    if (!row) {
      return agentUploadJsonError("upload_token_not_found", 404);
    }
    if (!(await agentUploadTokenMatchesRequest(row, c.req.raw, tokenId))) {
      return agentUploadJsonError("upload_token_invalid", 401);
    }
    const inactiveResponse = inactiveAgentUploadTokenResponse(row);
    if (inactiveResponse) {
      return inactiveResponse;
    }

    const status = agentUploadTokenStatus(row);
    const siteConfig = parseStoredSiteConfig(row.site_config_json);
    const site = row.created_site_id
      ? await c.env.DB.prepare(`${metricsSelectSql("s.id = ? AND s.deleted_at IS NULL")}`)
        .bind(row.created_site_id)
        .first<SiteRowWithMetrics>()
      : null;

    return c.json({
      uploadToken: {
        id: row.id,
        status,
        expiresAt: row.expires_at,
        usedAt: row.used_at,
        maxBytes: row.max_bytes,
        maxFiles: row.max_files,
        createdSiteId: row.created_site_id,
        createdRevisionId: row.created_revision_id,
        siteConfig: siteConfig ? publicSiteConfig(siteConfig) : null,
        site: site ? mapSiteRow(site, c.env.PREVIEW_HOST_SUFFIX) : null
      }
    });
  });

  app.post("/api/agent/uploads/:tokenId", async (c) => {
    const tokenId = c.req.param("tokenId");
    const token = bearerToken(c.req.raw);
    if (!token || tokenIdFromValue(token) !== tokenId) {
      return agentUploadJsonError("upload_token_invalid", 401);
    }

    const row = await c.env.DB.prepare(`SELECT * FROM agent_upload_tokens WHERE id = ?`).bind(tokenId).first<AgentUploadTokenRow>();
    if (!row) {
      return agentUploadJsonError("upload_token_not_found", 404);
    }
    if (row.revoked_at) {
      return agentUploadJsonError("upload_token_revoked", 410);
    }
    if (row.used_at) {
      return agentUploadJsonError("upload_token_already_used", 409);
    }
    const now = nowIso();
    if (new Date(row.expires_at).getTime() <= Date.now()) {
      return agentUploadJsonError("upload_token_expired", 410);
    }
    const tokenHash = await sha256Hex(token);
    if (!constantTimeEqual(tokenHash, row.token_hash)) {
      return agentUploadJsonError("upload_token_invalid", 401);
    }

    let body: UploadRevisionInput;
    try {
      body = await c.req.json<UploadRevisionInput>();
    } catch {
      return agentUploadJsonError("invalid_json");
    }
    const prepared = prepareRevisionUpload(body, { maxBytes: row.max_bytes, maxFiles: row.max_files });
    if (!prepared.ok) {
      return prepared.response;
    }

    const siteConfig = parseStoredSiteConfig(row.site_config_json);
    if (!siteConfig) {
      return agentUploadJsonError("upload_token_scope_invalid", 500);
    }
    const slug = await chooseUniqueSlug(c.env.DB, siteConfig.slug);
    if (!slug) {
      return agentUploadJsonError(siteConfig.slug ? "slug_already_taken" : "slug_generation_failed", siteConfig.slug ? 409 : 500);
    }

    const quota = await assertCanCreateSite(c.env.DB, row.owner_user_id, now, {
      preferPurchase: shouldPreferPaidReservationForExpiry(siteConfig.expiresAt, now)
    });
    if (!quota.ok) {
      return quota.response;
    }
    const expiryPolicy = applyPublishingExpiryPolicy(siteConfig.expiresAt, quota.reservation, now);
    if (!expiryPolicy.ok) {
      await releaseSiteQuotaReservation(c.env.DB, quota.reservation, now);
      return expiryPolicy.response;
    }

    const reservation = await c.env.DB.prepare(
      `UPDATE agent_upload_tokens SET used_at = ? WHERE id = ? AND used_at IS NULL AND revoked_at IS NULL AND expires_at > ?`
    )
      .bind(now, tokenId, now)
      .run();
    if (reservation.meta.changes === 0) {
      await releaseSiteQuotaReservation(c.env.DB, quota.reservation, now);
      return agentUploadJsonError("upload_token_already_used", 409);
    }

    const validated = await validatePreparedRevisionUpload(c.env, body, prepared.upload, {
      maxBytes: row.max_bytes,
      maxFiles: row.max_files,
      allowSecurityOverride: false
    });
    if (!validated.ok) {
      await releaseSiteQuotaReservation(c.env.DB, quota.reservation, now);
      return validated.response;
    }

    const siteId = crypto.randomUUID();
    try {
      await c.env.DB.prepare(
        `INSERT INTO sites (
          id, owner_user_id, slug, title, status, auth_mode, password_hash,
          allowed_email_domains, indexing_enabled, expires_at, current_revision_id, created_at, updated_at, deleted_at
        ) VALUES (?, ?, ?, ?, 'active', ?, ?, ?, ?, ?, NULL, ?, ?, NULL)`
      )
        .bind(
          siteId,
          row.owner_user_id,
          slug,
          siteConfig.title,
          siteConfig.authMode,
          siteConfig.passwordHash,
          JSON.stringify(siteConfig.allowedEmailDomains),
          siteConfig.indexingEnabled ? 1 : 0,
          expiryPolicy.expiresAt,
          now,
          now
        )
        .run();
    } catch (error) {
      await releaseSiteQuotaReservation(c.env.DB, quota.reservation, now);
      if (siteConfig.slug && isUniqueConstraintError(error)) {
        return agentUploadJsonError("slug_already_taken", 409);
      }
      throw error;
    }

    const site: SiteRow = {
      id: siteId,
      owner_user_id: row.owner_user_id,
      slug,
      title: siteConfig.title,
      status: "active",
      auth_mode: siteConfig.authMode,
      password_hash: siteConfig.passwordHash,
      allowed_email_domains: JSON.stringify(siteConfig.allowedEmailDomains),
      allowed_emails: "[]",
      indexing_enabled: siteConfig.indexingEnabled ? 1 : 0,
      hide_branding: 0,
      tool: null,
      expires_at: expiryPolicy.expiresAt,
      current_revision_id: null,
      created_at: now,
      updated_at: now,
      deleted_at: null
    };
    let revision: RevisionSummary;
    try {
      revision = await persistRevision(c.env, site, validated.upload, { createdBy: c.get("ownerUserId") });
    } catch (error) {
      await rollbackCreatedSite(c.env, site.id, quota.reservation, nowIso());
      throw error;
    }
    await c.env.DB.prepare(`UPDATE agent_upload_tokens SET created_site_id = ?, created_revision_id = ? WHERE id = ?`)
      .bind(site.id, revision.id, tokenId)
      .run();

    const siteRow = await c.env.DB.prepare(`${metricsSelectSql("s.id = ? AND s.deleted_at IS NULL")}`)
      .bind(site.id)
      .first<SiteRowWithMetrics>();
    if (!siteRow) {
      return agentUploadJsonError("site_not_created", 500);
    }
    await safeRecordApiMeasurementEvent(c.env, c.req.raw, {
      eventName: "upload_completed",
      path: "/api/agent/uploads",
      ownerUserId: row.owner_user_id,
      siteId: site.id,
      metadata: { source: "agent_upload", file_count: revision.fileCount, byte_length: revision.byteLength }
    });
    return c.json({ site: mapSiteRow(siteRow, c.env.PREVIEW_HOST_SUFFIX), revision }, 201);
  });

  app.get("/api/auth/bootstrap", (c) => c.json({ authMethod: "email_otp", signupOpen: true }));

  app.post("/api/auth/request-code", async (c) => {
    let body: { email?: unknown };
    try {
      body = await c.req.json<{ email?: unknown }>();
    } catch {
      return jsonError("invalid_json");
    }
    const result = await requestUserLoginCode(c.env, body.email);
    if (!result.ok) {
      return jsonError(result.error, result.status);
    }
    await safeRecordApiMeasurementEvent(c.env, c.req.raw, {
      eventName: "signup_started",
      path: "/app/",
      metadata: { auth_flow: "email_otp" }
    });
    return c.json({ challengeId: result.challengeId, expiresAt: result.expiresAt, email: result.email });
  });

  app.post("/api/auth/verify-code", async (c) => {
    let body: { challengeId?: unknown; email?: unknown; code?: unknown };
    try {
      body = await c.req.json<{ challengeId?: unknown; email?: unknown; code?: unknown }>();
    } catch {
      return jsonError("invalid_json");
    }
    const result = await verifyUserLoginCode(c.env, c.req.raw, body);
    if (!result.ok) {
      return jsonError(result.error, result.status);
    }
    await safeRecordApiMeasurementEvent(c.env, c.req.raw, {
      eventName: "signup_completed",
      path: "/app/",
      ownerUserId: result.user.id,
      metadata: { auth_flow: "email_otp" }
    });
    const response = c.json({ user: result.user });
    response.headers.append("Set-Cookie", result.setCookie);
    return response;
  });

  app.post("/api/auth/sign-out", async (c) => {
    await signOutUser(c.env, c.req.raw);
    const response = c.json({ ok: true });
    response.headers.append("Set-Cookie", clearSessionCookie());
    return response;
  });

  app.get("/api/me", async (c) => {
    const session = options.sessionResolver ? await options.sessionResolver(c.env, c.req.raw) : await getUserSession(c.env, c.req.raw);
    if (!session) {
      return jsonError("session_required", 401);
    }
    return c.json(mapUserSession(session));
  });

  app.get("/api/billing/stripe/config", (c) => c.json({ stripe: getPublicStripeConfigStatus(stripeEnv(c.env)) }));

  app.post("/api/billing/stripe/webhook", async (c) => {
    const payload = await c.req.raw.text();
    const result = await handleStripeWebhook(stripeWebhookEnv(c.env), payload, c.req.header("Stripe-Signature") ?? null);
    if (!result.ok) {
      return jsonError(result.error, result.status, result.message ? { message: result.message } : undefined);
    }
    if (!result.duplicate && (result.eventType === "checkout.session.completed" || result.eventType === "customer.subscription.created")) {
      await safeRecordApiMeasurementEvent(c.env, c.req.raw, {
        eventName: "subscription_created",
        path: "/api/billing/stripe/webhook",
        metadata: { stripe_event_id: result.eventId, stripe_event_type: result.eventType }
      });
    }
    return c.json({ received: true, eventId: result.eventId, duplicate: result.duplicate });
  });

  app.post("/api/billing/stripe/test", async (c) => {
    const result = await testStripeConnection(stripeEnv(c.env));
    if (!result.ok) {
      return jsonError(result.error, result.status, {
        type: result.type,
        code: result.code,
        message: result.message,
        stripeRequestId: result.stripeRequestId
      });
    }
    return c.json({ stripe: result });
  });

  app.post("/api/billing/checkout-session", async (c) => {
    const stripeConfig = getStripeConfigStatus(stripeEnv(c.env));
    if (!stripeConfig.paidCheckoutEnabled) {
      return jsonError(stripeConfig.paidCheckoutDisabledReason ?? "paid_checkout_preparing", 503, {
        paidCheckoutEnabled: false,
        tooltip: stripeConfig.paidCheckoutDisabledTooltip
      });
    }
    let body: CheckoutSessionInput;
    try {
      body = await c.req.json<CheckoutSessionInput>();
    } catch {
      return jsonError("invalid_json");
    }
    if (!isOfferablePlanId(body.planId)) {
      return jsonError("invalid_plan", 400);
    }
    const ownerUserId = c.get("ownerUserId");
    const subscription = await getOwnerSubscription(c.env.DB, ownerUserId);
    if (subscription && isActiveSubscriptionStatus(subscription.status) && planFeatureRank(subscription.plan_id) >= planFeatureRank(body.planId)) {
      return jsonError("plan_already_active", 409, { currentPlanId: subscription.plan_id, requestedPlanId: body.planId });
    }
    const customerId = subscription?.stripe_customer_id ?? null;
    const hasUsedPlanTrial = stripePlanTrialPeriodDays(body.planId) !== null ? await hasPlanTrialHistoryByOwnerOrCustomer(c.env.DB, ownerUserId, customerId, body.planId) : false;
    const result = await createStripeCheckoutSession(stripeEnv(c.env), body.planId, {
      user: { id: ownerUserId, email: c.get("ownerEmail") },
      customerId,
      trialEligible: !hasUsedPlanTrial
    });
    if (!result.ok) {
      return jsonError(billingCheckoutErrorCode(result), result.status, {
        type: result.type,
        code: result.code,
        message: result.message,
        stripeRequestId: result.stripeRequestId
      });
    }
    await safeRecordApiMeasurementEvent(c.env, c.req.raw, {
      eventName: "checkout_started",
      path: "/app/billing",
      ownerUserId,
      metadata: { plan_id: body.planId, stripe_session_id: result.id }
    });
    return c.json({ session: result });
  });

  app.post("/api/billing/customer-portal-session", async (c) => {
    const subscription = await getOwnerSubscription(c.env.DB, c.get("ownerUserId"));
    const customerId = subscription?.stripe_customer_id ?? null;
    if (!customerId) {
      return jsonError("billing_portal_unavailable", 404, { reason: "stripe_customer_missing" });
    }
    const result = await createStripeBillingPortalSession(stripeEnv(c.env), customerId);
    if (!result.ok) {
      return jsonError(result.error, result.status, {
        type: result.type,
        code: result.code,
        message: result.message,
        stripeRequestId: result.stripeRequestId
      });
    }
    return c.json({ portal: result });
  });

  app.get("/api/billing/subscription", async (c) => {
    const ownerUserId = c.get("ownerUserId");
    const [row, unusedSitePurchases] = await Promise.all([
      getOwnerSubscription(c.env.DB, ownerUserId),
      unusedSingleSitePurchaseCount(c.env.DB, ownerUserId)
    ]);
    const subscription: BillingSubscriptionSummary = row
      ? {
          planId: row.plan_id,
          planLabel: planLabel(row.plan_id),
          status: row.status,
          currentPeriodEnd: row.current_period_end,
          cancelAtPeriodEnd: row.cancel_at_period_end === 1,
          unusedSitePurchases,
          billingPortalAvailable: Boolean(row.stripe_customer_id)
        }
      : { planId: null, planLabel: null, status: "none", currentPeriodEnd: null, cancelAtPeriodEnd: false, unusedSitePurchases, billingPortalAvailable: false };
    return c.json({ subscription, plans: listBillingPlans(row?.plan_id ?? null) });
  });

  app.get("/api/billing/invoices", async (c) => {
    const row = await getOwnerSubscription(c.env.DB, c.get("ownerUserId"));
    const invoices = await listStripeInvoices(stripeEnv(c.env), row?.stripe_customer_id ?? null);
    return c.json({ invoices });
  });

  app.get("/api/billing/payment-method", async (c) => {
    const row = await getOwnerSubscription(c.env.DB, c.get("ownerUserId"));
    const paymentMethod = await getDefaultPaymentMethod(stripeEnv(c.env), row?.stripe_customer_id ?? null);
    return c.json({ paymentMethod });
  });

  app.get("/api/notifications", async (c) => {
    const rows = await c.env.DB.prepare(
      `SELECT ae.id, ae.site_id, ae.event_type, ae.email, ae.path, ae.created_at, s.title AS site_title
       FROM access_events ae
       JOIN sites s ON s.id = ae.site_id
       WHERE s.owner_user_id = ? AND s.deleted_at IS NULL AND ae.event_type IN ('auth_failed', 'auth_success', 'view')
       ORDER BY ae.created_at DESC
       LIMIT 30`
    )
      .bind(c.get("ownerUserId"))
      .all<{ id: string; site_id: string; event_type: NotificationSummary["eventType"]; email: string | null; path: string; created_at: string; site_title: string | null }>();
    const notifications: NotificationSummary[] = rows.results.map((row) => ({
      id: row.id,
      siteId: row.site_id,
      siteTitle: row.site_title ?? "Untitled HTML",
      eventType: row.event_type,
      maskedEmail: maskEmail(row.email),
      path: row.path,
      createdAt: row.created_at
    }));
    return c.json({ notifications });
  });

  app.get("/api/slugs/availability", async (c) => {
    const slug = normalizeSlug(c.req.query("slug"));
    if (!slug.ok || !slug.value) {
      return c.json({ available: false, normalizedSlug: null, reason: slug.ok ? "invalid_slug" : slug.error });
    }

    const currentSiteId = c.req.query("currentSiteId")?.trim();
    let currentOwnedSiteId: string | null = null;
    if (currentSiteId) {
      const owned = await c.env.DB.prepare(`SELECT id FROM sites WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`)
        .bind(currentSiteId, c.get("ownerUserId"))
        .first<{ id: string }>();
      if (!owned) {
        return jsonError("site_not_found", 404);
      }
      currentOwnedSiteId = owned.id;
    }

    const existing = await c.env.DB.prepare(`SELECT id FROM sites WHERE slug = ? AND deleted_at IS NULL`).bind(slug.value).first<{ id: string }>();
    if (!existing) {
      return c.json({ available: true, normalizedSlug: slug.value, reason: null });
    }
    if (currentOwnedSiteId && existing.id === currentOwnedSiteId) {
      return c.json({ available: true, normalizedSlug: slug.value, reason: "current_slug" });
    }
    return c.json({ available: false, normalizedSlug: slug.value, reason: "slug_already_taken" });
  });

  app.get("/api/dashboard", async (c) => {
    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    const prevMonthStart = new Date(monthStart);
    prevMonthStart.setUTCMonth(prevMonthStart.getUTCMonth() - 1);
    const weekStart = new Date();
    weekStart.setUTCDate(weekStart.getUTCDate() - 7);
    const userId = c.get("ownerUserId");
    const month = monthStart.toISOString();
    const prevMonth = prevMonthStart.toISOString();
    const week = weekStart.toISOString();
    const row = await c.env.DB.prepare(
      `SELECT
        COALESCE((SELECT COUNT(*) FROM sites WHERE owner_user_id = ? AND deleted_at IS NULL), 0) AS totalSites,
        COALESCE((SELECT COUNT(*) FROM sites WHERE owner_user_id = ? AND deleted_at IS NULL AND status = 'active'), 0) AS activeSites,
        COALESCE((SELECT COUNT(*) FROM sites WHERE owner_user_id = ? AND deleted_at IS NULL AND created_at >= ?), 0) AS weeklySiteDelta,
        COALESCE((SELECT COUNT(*) FROM access_events ae JOIN sites s ON s.id = ae.site_id WHERE s.owner_user_id = ? AND s.deleted_at IS NULL AND ae.event_type = 'view' AND ae.created_at >= ?), 0) AS monthlyViews,
        COALESCE((SELECT COUNT(*) FROM access_events ae JOIN sites s ON s.id = ae.site_id WHERE s.owner_user_id = ? AND s.deleted_at IS NULL AND ae.event_type = 'view' AND ae.created_at >= ? AND ae.created_at < ?), 0) AS prevMonthViews,
        COALESCE((SELECT COUNT(*) FROM access_events ae JOIN sites s ON s.id = ae.site_id WHERE s.owner_user_id = ? AND s.deleted_at IS NULL AND ae.event_type = 'auth_success' AND ae.created_at >= ?), 0) AS monthlyAuthViews,
        COALESCE((SELECT SUM(r.total_bytes) FROM revisions r JOIN sites s ON s.id = r.site_id WHERE s.owner_user_id = ? AND s.deleted_at IS NULL), 0) AS totalBytes`
    )
      .bind(userId, userId, userId, week, userId, month, userId, prevMonth, month, userId, month, userId)
      .first<{
        totalSites: number;
        activeSites: number;
        weeklySiteDelta: number;
        monthlyViews: number;
        prevMonthViews: number;
        monthlyAuthViews: number;
        totalBytes: number;
      }>();
    const base = row ?? {
      totalSites: 0,
      activeSites: 0,
      weeklySiteDelta: 0,
      monthlyViews: 0,
      prevMonthViews: 0,
      monthlyAuthViews: 0,
      totalBytes: 0
    };
    const monthlyViewChangePct =
      base.prevMonthViews > 0 ? Math.round(((base.monthlyViews - base.prevMonthViews) / base.prevMonthViews) * 100) : null;
    const stats: DashboardStats = {
      totalSites: base.totalSites,
      activeSites: base.activeSites,
      monthlyViews: base.monthlyViews,
      monthlyAuthViews: base.monthlyAuthViews,
      totalBytes: base.totalBytes,
      weeklySiteDelta: base.weeklySiteDelta,
      monthlyViewChangePct
    };
    return c.json({ stats });
  });

  app.get("/api/sites", async (c) => {
    const rows = await c.env.DB.prepare(`${metricsSelectSql("s.owner_user_id = ? AND s.deleted_at IS NULL")} ORDER BY s.created_at DESC LIMIT 100`)
      .bind(c.get("ownerUserId"))
      .all<SiteRowWithMetrics>();
    return c.json({ sites: rows.results.map((row) => mapSiteRow(row, c.env.PREVIEW_HOST_SUFFIX)) });
  });

  app.post("/api/sites", async (c) => {
    let body: SiteCreateInput;
    try {
      body = await c.req.json<SiteCreateInput>();
    } catch {
      return jsonError("invalid_json");
    }

    const normalized = normalizeSiteInput(body);
    if (!normalized.ok) {
      return jsonError(normalized.error);
    }

    const createdAt = nowIso();
    const ownerUserId = c.get("ownerUserId");
    if (normalized.value.hideBranding && (await ownerActivePlanRank(c.env.DB, ownerUserId)) < HIDE_BRANDING_MIN_RANK) {
      return jsonError("plan_required", 403, { feature: "hide_branding", requiredPlan: HIDE_BRANDING_MIN_PLAN_LABEL });
    }

    const created = await createSiteRecord(c.env, ownerUserId, normalized.value, createdAt);
    if (!created.ok) {
      return created.response;
    }

    const row = await c.env.DB.prepare(`${metricsSelectSql("s.id = ? AND s.deleted_at IS NULL")}`).bind(created.site.id).first<SiteRowWithMetrics>();
    if (!row) {
      await rollbackCreatedSite(c.env, created.site.id, created.reservation, nowIso());
      return jsonError("site_not_created", 500);
    }
    return c.json({ site: mapSiteRow(row, c.env.PREVIEW_HOST_SUFFIX) }, 201);
  });

  app.post("/api/public/publish", async (c) => {
    let body: SiteWithRevisionInput;
    try {
      body = await c.req.json<SiteWithRevisionInput>();
    } catch {
      return jsonError("invalid_json");
    }

    // Only trust cf-connecting-ip: Cloudflare overwrites it at the edge, so it cannot be spoofed.
    const ip = c.req.raw.headers.get("cf-connecting-ip") ?? "unknown";
    const ipHash = await sha256Hex(`${c.env.APP_HOST}:anon-publish:${ip}`);
    const attemptAllowed = await reserveAnonymousPublishAttempt(c.env.DB, ipHash);
    if (!attemptAllowed) {
      return jsonError("rate_limited", 429);
    }

    const publicAuthResult = await normalizePublicPublishAuthInput(body);
    if (!publicAuthResult.ok) {
      return jsonError(publicAuthResult.error);
    }
    const publicAuth = publicAuthResult.value;

    const maxBytes = envNumber(c.env.MAX_HTML_BYTES, 10 * 1024 * 1024);
    const maxFiles = envNumber(c.env.MAX_UPLOAD_FILES, 200);
    const validated = await validateRevisionUpload(
      c.env,
      { html: body.html, files: body.files, entryPath: body.entryPath, securityOverrideAccepted: body.securityOverrideAccepted },
      { maxBytes, maxFiles, allowSecurityOverride: true }
    );
    if (!validated.ok) {
      return validated.response;
    }

    const slug = await chooseUniqueSlug(c.env.DB);
    if (!slug) {
      return jsonError("slug_generation_failed", 500);
    }
    const siteId = crypto.randomUUID();
    const claimToken = Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, "0")).join("");
    const claimTokenHash = await sha256Hex(claimToken);
    const title = typeof body.title === "string" && body.title.trim() ? body.title.trim().slice(0, 120) : slug;
    const now = nowIso();
    const expiresAt = new Date(Date.now() + ANON_PUBLISH_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();

    await c.env.DB.prepare(
      `INSERT INTO sites (
        id, owner_user_id, slug, title, status, auth_mode, password_hash,
        allowed_email_domains, allowed_emails, indexing_enabled, hide_branding, tool,
        expires_at, current_revision_id, created_at, updated_at, deleted_at,
        source, claim_token_hash, claimed_at, ip_hash
      ) VALUES (?, ?, ?, ?, 'active', ?, ?, NULL, NULL, 0, 0, NULL, ?, NULL, ?, ?, NULL, 'anonymous', ?, NULL, ?)`
    )
      .bind(siteId, ANON_OWNER_USER_ID, slug, title, publicAuth.authMode, publicAuth.passwordHash, expiresAt, now, now, claimTokenHash, ipHash)
      .run();

    const siteRow = await c.env.DB.prepare(`SELECT * FROM sites WHERE id = ?`).bind(siteId).first<SiteRow>();
    if (!siteRow) {
      return jsonError("site_not_created", 500);
    }
    try {
      await persistRevision(c.env, siteRow, validated.upload);
    } catch (error) {
      await c.env.DB.prepare(`DELETE FROM sites WHERE id = ?`).bind(siteId).run();
      throw error;
    }

    const row = await c.env.DB.prepare(metricsSelectSql("s.id = ? AND s.deleted_at IS NULL")).bind(siteId).first<SiteRowWithMetrics>();
    const previewUrl = row ? mapSiteRow(row, c.env.PREVIEW_HOST_SUFFIX).previewUrl : `https://${slug}${c.env.PREVIEW_HOST_SUFFIX}`;

    const response: PublicPublishResponse = { siteId, slug, previewUrl, claimToken, expiresAt, authMode: publicAuth.authMode };
    await safeRecordApiMeasurementEvent(c.env, c.req.raw, {
      eventName: "upload_completed",
      path: "/",
      siteId,
      metadata: { source: "anonymous_publish", auth_mode: publicAuth.authMode }
    });
    return c.json(response, 201);
  });

  app.post("/api/public/publish-password", async (c) => {
    let body: PublicPublishPasswordInput;
    try {
      body = await c.req.json<PublicPublishPasswordInput>();
    } catch {
      return jsonError("invalid_json");
    }
    const siteId = typeof body.siteId === "string" ? body.siteId.trim() : "";
    const claimToken = typeof body.claimToken === "string" ? body.claimToken : "";
    if (!siteId) {
      return jsonError("site_id_required");
    }
    if (!claimToken) {
      return jsonError("claim_token_required");
    }
    const normalized = normalizeAuthInput(
      { authMode: "password", password: body.password },
      { requirePassword: true }
    );
    if (!normalized.ok) {
      return jsonError(normalized.error);
    }
    const passwordHash = await hashPassword(normalized.value.password ?? "");
    const claimTokenHash = await sha256Hex(claimToken);
    const now = nowIso();
    const result = await c.env.DB.prepare(
      `UPDATE sites SET auth_mode = 'password', password_hash = ?, updated_at = ?
       WHERE id = ? AND owner_user_id = ? AND claim_token_hash = ? AND deleted_at IS NULL AND claimed_at IS NULL`
    )
      .bind(passwordHash, now, siteId, ANON_OWNER_USER_ID, claimTokenHash)
      .run();
    if (result.meta.changes === 0) {
      return jsonError("claim_token_invalid", 404);
    }
    const response: PublicPublishPasswordResponse = { siteId, authMode: "password" };
    return c.json(response);
  });

  app.post("/api/sites/claim", async (c) => {
    const ownerUserId = c.get("ownerUserId");
    let body: { claimToken?: unknown };
    try {
      body = await c.req.json();
    } catch {
      return jsonError("invalid_json");
    }
    const claimToken = typeof body.claimToken === "string" ? body.claimToken : "";
    if (!claimToken) {
      return jsonError("claim_token_required");
    }
    const claimTokenHash = await sha256Hex(claimToken);
    const site = await c.env.DB.prepare(`SELECT id, owner_user_id FROM sites WHERE claim_token_hash = ? AND deleted_at IS NULL`).bind(claimTokenHash).first<{ id: string; owner_user_id: string }>();
    if (!site) {
      return jsonError("claim_token_invalid", 404);
    }
    if (site.owner_user_id !== ANON_OWNER_USER_ID) {
      return jsonError("already_claimed", 409);
    }
    const now = nowIso();
    const quota = await assertCanCreateSite(c.env.DB, ownerUserId, now);
    if (!quota.ok) {
      return quota.response;
    }
    const updateResult = await c.env.DB.prepare(`UPDATE sites SET owner_user_id = ?, claimed_at = ?, claim_token_hash = NULL, updated_at = ? WHERE id = ? AND owner_user_id = ?`)
      .bind(ownerUserId, now, now, site.id, ANON_OWNER_USER_ID)
      .run();
    if (!updateResult.meta.changes) {
      await releaseSiteQuotaReservation(c.env.DB, quota.reservation, nowIso());
      return jsonError("already_claimed", 409);
    }
    const response: ClaimResponse = { siteId: site.id };
    return c.json(response);
  });

  app.post("/api/sites-with-revision", async (c) => {
    let body: SiteWithRevisionInput;
    try {
      body = await c.req.json<SiteWithRevisionInput>();
    } catch {
      return jsonError("invalid_json");
    }

    const normalized = normalizeSiteInput(body);
    if (!normalized.ok) {
      return jsonError(normalized.error);
    }

    const maxBytes = envNumber(c.env.MAX_HTML_BYTES, 10 * 1024 * 1024);
    const maxFiles = envNumber(c.env.MAX_UPLOAD_FILES, 200);
    const validated = await validateRevisionUpload(c.env, body, { maxBytes, maxFiles, allowSecurityOverride: true });
    if (!validated.ok) {
      return validated.response;
    }

    const ownerUserId = c.get("ownerUserId");
    if (normalized.value.hideBranding && (await ownerActivePlanRank(c.env.DB, ownerUserId)) < HIDE_BRANDING_MIN_RANK) {
      return jsonError("plan_required", 403, { feature: "hide_branding", requiredPlan: HIDE_BRANDING_MIN_PLAN_LABEL });
    }

    const createdAt = nowIso();
    const created = await createSiteRecord(c.env, ownerUserId, normalized.value, createdAt);
    if (!created.ok) {
      return created.response;
    }

    let revision: RevisionSummary;
    try {
      revision = await persistRevision(c.env, created.site, validated.upload, { createdBy: ownerUserId });
    } catch (error) {
      await rollbackCreatedSite(c.env, created.site.id, created.reservation, nowIso());
      throw error;
    }

    const row = await c.env.DB.prepare(`${metricsSelectSql("s.id = ? AND s.deleted_at IS NULL")}`).bind(created.site.id).first<SiteRowWithMetrics>();
    if (!row) {
      await rollbackCreatedSite(c.env, created.site.id, created.reservation, nowIso());
      return jsonError("site_not_created", 500);
    }
    await safeRecordApiMeasurementEvent(c.env, c.req.raw, {
      eventName: "upload_completed",
      path: "/app/upload",
      ownerUserId,
      siteId: created.site.id,
      metadata: { source: "admin_create", file_count: revision.fileCount, byte_length: revision.byteLength }
    });
    return c.json({ site: mapSiteRow(row, c.env.PREVIEW_HOST_SUFFIX), revision }, 201);
  });

  app.get("/api/sites/:siteId", async (c) => {
    const row = await c.env.DB.prepare(`${metricsSelectSql("s.id = ? AND s.owner_user_id = ? AND s.deleted_at IS NULL")}`)
      .bind(c.req.param("siteId"), c.get("ownerUserId"))
      .first<SiteRowWithMetrics>();
    if (!row) {
      return jsonError("site_not_found", 404);
    }
    return c.json({ site: mapSiteRow(row, c.env.PREVIEW_HOST_SUFFIX) });
  });

  app.get("/api/sites/:siteId/form-submissions.csv", async (c) => {
    if ((await ownerActivePlanRank(c.env.DB, c.get("ownerUserId"))) < FORM_SUBMISSIONS_MIN_RANK) {
      return jsonError("plan_required", 403, { feature: "form_submissions", requiredPlan: FORM_SUBMISSIONS_MIN_PLAN_LABEL });
    }
    const siteId = c.req.param("siteId");
    const ownerUserId = c.get("ownerUserId");
    const site = await c.env.DB.prepare(`SELECT id FROM sites WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`)
      .bind(siteId, ownerUserId)
      .first<{ id: string }>();
    if (!site) {
      return jsonError("site_not_found", 404);
    }
    const submissions: FormSubmissionDetail[] = await listFormSubmissionDetails(c.env.DB, siteId);
    return new Response(formSubmissionsCsv(submissions), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="form-submissions-${siteId}.csv"`,
        "Cache-Control": "no-store"
      }
    });
  });

  app.get("/api/sites/:siteId/form-submissions", async (c) => {
    if ((await ownerActivePlanRank(c.env.DB, c.get("ownerUserId"))) < FORM_SUBMISSIONS_MIN_RANK) {
      return jsonError("plan_required", 403, { feature: "form_submissions", requiredPlan: FORM_SUBMISSIONS_MIN_PLAN_LABEL });
    }
    const siteId = c.req.param("siteId");
    const ownerUserId = c.get("ownerUserId");
    const site = await c.env.DB.prepare(`SELECT id FROM sites WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`)
      .bind(siteId, ownerUserId)
      .first<{ id: string }>();
    if (!site) {
      return jsonError("site_not_found", 404);
    }
    const submissions: FormSubmissionSummary[] = await listFormSubmissions(c.env.DB, siteId);
    return c.json({ submissions });
  });

  app.get("/api/sites/:siteId/form-submissions/:submissionId", async (c) => {
    if ((await ownerActivePlanRank(c.env.DB, c.get("ownerUserId"))) < FORM_SUBMISSIONS_MIN_RANK) {
      return jsonError("plan_required", 403, { feature: "form_submissions", requiredPlan: FORM_SUBMISSIONS_MIN_PLAN_LABEL });
    }
    const siteId = c.req.param("siteId");
    const ownerUserId = c.get("ownerUserId");
    const site = await c.env.DB.prepare(`SELECT id FROM sites WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`)
      .bind(siteId, ownerUserId)
      .first<{ id: string }>();
    if (!site) {
      return jsonError("site_not_found", 404);
    }
    const submission: FormSubmissionDetail | null = await getFormSubmission(c.env.DB, siteId, c.req.param("submissionId"));
    if (!submission) {
      return jsonError("form_submission_not_found", 404);
    }
    return c.json({ submission });
  });

  app.post("/api/sites/:siteId/renew-expiry", async (c) => {
    const jsonBody = await requireJsonObjectBody(c.req.raw);
    if (!jsonBody.ok) {
      return jsonBody.response;
    }
    const siteId = c.req.param("siteId");
    const ownerUserId = c.get("ownerUserId");
    const site = await c.env.DB.prepare(`SELECT * FROM sites WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`)
      .bind(siteId, ownerUserId)
      .first<SiteRow>();
    if (!site) {
      return jsonError("site_not_found", 404);
    }
    if (!site.current_revision_id || !site.expires_at) {
      return jsonError("expiry_renewal_not_available", 400);
    }

    const updatedAt = nowIso();
    const expiresAt = renewedExpiryIso(site.expires_at, updatedAt);
    const result = await c.env.DB.prepare(
      `UPDATE sites SET expires_at = ?, updated_at = ? WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`
    )
      .bind(expiresAt, updatedAt, siteId, ownerUserId)
      .run();
    if (result.meta.changes === 0) {
      return jsonError("site_not_found", 404);
    }

    const row = await c.env.DB.prepare(`${metricsSelectSql("s.id = ? AND s.owner_user_id = ? AND s.deleted_at IS NULL")}`)
      .bind(siteId, ownerUserId)
      .first<SiteRowWithMetrics>();
    if (!row) {
      return jsonError("site_not_found", 404);
    }
    return c.json({ site: mapSiteRow(row, c.env.PREVIEW_HOST_SUFFIX) });
  });

  app.patch("/api/sites/:siteId", async (c) => {
    let body: SiteUpdateInput;
    try {
      body = await c.req.json<SiteUpdateInput>();
    } catch {
      return jsonError("invalid_json");
    }

    const normalized = normalizeSiteUpdateInput(body);
    if (!normalized.ok) {
      return jsonError(normalized.error);
    }

    const ownerUserId = c.get("ownerUserId");
    const siteBeforeUpdate = await c.env.DB.prepare(`SELECT * FROM sites WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`)
      .bind(c.req.param("siteId"), ownerUserId)
      .first<SiteRow>();
    if (!siteBeforeUpdate) {
      return jsonError("site_not_found", 404);
    }

    if (normalized.value.slug && normalized.value.slug !== siteBeforeUpdate.slug) {
      const existingSlug = await c.env.DB.prepare(`SELECT id FROM sites WHERE slug = ? AND deleted_at IS NULL`)
        .bind(normalized.value.slug)
        .first<{ id: string }>();
      if (existingSlug && existingSlug.id !== siteBeforeUpdate.id) {
        return jsonError("slug_already_taken", 409);
      }
    }

    if (normalized.value.auth?.authMode === "password" && !normalized.value.auth.password && !siteBeforeUpdate.password_hash) {
      return jsonError("password_required");
    }

    if (normalized.value.hideBranding === true && (await ownerActivePlanRank(c.env.DB, ownerUserId)) < HIDE_BRANDING_MIN_RANK) {
      return jsonError("plan_required", 403, { feature: "hide_branding", requiredPlan: HIDE_BRANDING_MIN_PLAN_LABEL });
    }

    const updatedAt = nowIso();
    const assignments: string[] = [];
    const params: unknown[] = [];
    const update = normalized.value;
    if (update.slug !== undefined && update.slug !== siteBeforeUpdate.slug) {
      assignments.push("slug = ?");
      params.push(update.slug);
    }
    if (update.indexingEnabled !== undefined) {
      assignments.push("indexing_enabled = ?");
      params.push(update.indexingEnabled ? 1 : 0);
    }
    if (update.hideBranding !== undefined) {
      assignments.push("hide_branding = ?");
      params.push(update.hideBranding ? 1 : 0);
    }
    if (update.auth) {
      assignments.push("auth_mode = ?", "allowed_email_domains = ?", "allowed_emails = ?");
      params.push(update.auth.authMode, JSON.stringify(update.auth.allowedEmailDomains), JSON.stringify(update.auth.allowedEmails));
      // Switching away from password clears the hash; staying in password mode
      // without a new password keeps the existing one (UI "leave empty to keep").
      if (update.auth.authMode !== "password") {
        assignments.push("password_hash = ?");
        params.push(null);
      } else if (update.auth.password) {
        assignments.push("password_hash = ?");
        params.push(await hashPassword(update.auth.password));
      }
    }
    assignments.push("updated_at = ?");
    params.push(updatedAt, c.req.param("siteId"), c.get("ownerUserId"));

    let result: D1Result;
    try {
      result = await c.env.DB.prepare(
        `UPDATE sites SET ${assignments.join(", ")} WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`
      )
        .bind(...params)
        .run();
    } catch (error) {
      if (update.slug && isUniqueConstraintError(error)) {
        return jsonError("slug_already_taken", 409);
      }
      throw error;
    }
    if (result.meta.changes === 0) {
      return jsonError("site_not_found", 404);
    }

    // Any auth-config change must revoke already-issued viewer sessions so
    // removed emails / rotated passwords lose access immediately, not after TTL.
    if (update.auth) {
      await c.env.DB.prepare(`DELETE FROM viewer_sessions WHERE site_id = ?`).bind(c.req.param("siteId")).run();
      await c.env.DB.prepare(`DELETE FROM email_otp_challenges WHERE site_id = ?`).bind(c.req.param("siteId")).run();
    }

    const row = await c.env.DB.prepare(`${metricsSelectSql("s.id = ? AND s.owner_user_id = ? AND s.deleted_at IS NULL")}`)
      .bind(c.req.param("siteId"), c.get("ownerUserId"))
      .first<SiteRowWithMetrics>();
    if (!row) {
      return jsonError("site_not_found", 404);
    }
    return c.json({ site: mapSiteRow(row, c.env.PREVIEW_HOST_SUFFIX) });
  });

  app.delete("/api/sites/:siteId", async (c) => {
    const deletedAt = nowIso();
    const result = await c.env.DB.prepare(
      `UPDATE sites SET status = 'deleted', deleted_at = ?, updated_at = ? WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`
    )
      .bind(deletedAt, deletedAt, c.req.param("siteId"), c.get("ownerUserId"))
      .run();
    if (result.meta.changes === 0) {
      return jsonError("site_not_found", 404);
    }
    return c.json({ ok: true });
  });

  app.post("/api/sites/:siteId/revisions", async (c) => {
    let body: UploadRevisionInput;
    try {
      body = await c.req.json<UploadRevisionInput>();
    } catch {
      return jsonError("invalid_json");
    }

    const site = await c.env.DB.prepare(`SELECT * FROM sites WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`)
      .bind(c.req.param("siteId"), c.get("ownerUserId"))
      .first<SiteRow>();
    if (!site) {
      return jsonError("site_not_found", 404);
    }

    const maxBytes = envNumber(c.env.MAX_HTML_BYTES, 10 * 1024 * 1024);
    const maxFiles = envNumber(c.env.MAX_UPLOAD_FILES, 200);
    const validated = await validateRevisionUpload(c.env, body, { maxBytes, maxFiles, allowSecurityOverride: true });
    if (!validated.ok) {
      return validated.response;
    }

    const revision = await persistRevision(c.env, site, validated.upload, { createdBy: c.get("ownerUserId") });
    await safeRecordApiMeasurementEvent(c.env, c.req.raw, {
      eventName: "upload_completed",
      path: "/app/upload",
      ownerUserId: c.get("ownerUserId"),
      siteId: site.id,
      metadata: { source: "admin_revision", file_count: revision.fileCount, byte_length: revision.byteLength }
    });
    return c.json({ revision }, 201);
  });

  app.get("/api/sites/:siteId/revisions", async (c) => {
    if ((await ownerActivePlanRank(c.env.DB, c.get("ownerUserId"))) < REVISION_HISTORY_MIN_RANK) {
      return jsonError("plan_required", 403, { feature: "revision_history", requiredPlan: REVISION_HISTORY_MIN_PLAN_LABEL });
    }
    const site = await c.env.DB.prepare(`SELECT id, current_revision_id FROM sites WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`)
      .bind(c.req.param("siteId"), c.get("ownerUserId"))
      .first<{ id: string; current_revision_id: string | null }>();
    if (!site) {
      return jsonError("site_not_found", 404);
    }
    const rows = await c.env.DB.prepare(`SELECT * FROM revisions WHERE site_id = ? ORDER BY created_at ASC LIMIT 200`)
      .bind(c.req.param("siteId"))
      .all<RevisionRow>();
    const revisions = mapRevisionHistory(rows.results ?? [], site.current_revision_id);
    return c.json({ revisions, currentRevisionId: site.current_revision_id });
  });

  // Issue a short-lived owner token to preview a specific past revision on the preview origin.
  app.post("/api/sites/:siteId/revisions/:revisionId/preview", async (c) => {
    if ((await ownerActivePlanRank(c.env.DB, c.get("ownerUserId"))) < REVISION_HISTORY_MIN_RANK) {
      return jsonError("plan_required", 403, { feature: "revision_history", requiredPlan: REVISION_HISTORY_MIN_PLAN_LABEL });
    }
    const site = await c.env.DB.prepare(`SELECT * FROM sites WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`)
      .bind(c.req.param("siteId"), c.get("ownerUserId"))
      .first<SiteRow>();
    if (!site) {
      return jsonError("site_not_found", 404);
    }
    const revision = await c.env.DB.prepare(`SELECT id FROM revisions WHERE id = ? AND site_id = ?`)
      .bind(c.req.param("revisionId"), site.id)
      .first<{ id: string }>();
    if (!revision) {
      return jsonError("revision_not_found", 404);
    }
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, "0")).join("");
    const now = nowIso();
    const expiresAt = new Date(Date.now() + REVISION_PREVIEW_TOKEN_TTL_MS).toISOString();
    await c.env.DB.prepare(`DELETE FROM revision_preview_tokens WHERE expires_at < ?`).bind(now).run();
    await c.env.DB.prepare(
      `INSERT INTO revision_preview_tokens (token, site_id, revision_id, expires_at, created_at) VALUES (?, ?, ?, ?, ?)`
    )
      .bind(token, site.id, revision.id, expiresAt, now)
      .run();
    const previewBase = mapSiteRow(site, c.env.PREVIEW_HOST_SUFFIX).previewUrl;
    return c.json({ previewUrl: buildRevisionPreviewUrl(previewBase, token), expiresAt });
  });

  // Restore a past revision: record it as a NEW generation (reusing the stored files) and point the site at it.
  app.post("/api/sites/:siteId/revisions/:revisionId/restore", async (c) => {
    if ((await ownerActivePlanRank(c.env.DB, c.get("ownerUserId"))) < REVISION_HISTORY_MIN_RANK) {
      return jsonError("plan_required", 403, { feature: "revision_history", requiredPlan: REVISION_HISTORY_MIN_PLAN_LABEL });
    }
    const site = await c.env.DB.prepare(`SELECT * FROM sites WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`)
      .bind(c.req.param("siteId"), c.get("ownerUserId"))
      .first<SiteRow>();
    if (!site) {
      return jsonError("site_not_found", 404);
    }
    const target = await c.env.DB.prepare(`SELECT * FROM revisions WHERE id = ? AND site_id = ?`)
      .bind(c.req.param("revisionId"), site.id)
      .first<RevisionRow>();
    if (!target) {
      return jsonError("revision_not_found", 404);
    }
    if (target.id === site.current_revision_id) {
      return jsonError("revision_already_current", 409);
    }

    const allRows = await c.env.DB.prepare(`SELECT * FROM revisions WHERE site_id = ? ORDER BY created_at ASC LIMIT 200`)
      .bind(site.id)
      .all<RevisionRow>();
    const sourceGeneration = mapRevisionHistory(allRows.results ?? [], site.current_revision_id).find((item) => item.id === target.id)?.generation ?? null;

    const newRevisionId = crypto.randomUUID();
    const createdAt = nowIso();
    // Reuse the target revision's stored R2 files; only a new pointer row is written (no file copy).
    await c.env.DB.prepare(
      `INSERT INTO revisions (
        id, site_id, r2_prefix, entry_path, file_count, total_bytes, content_sha256, warnings_json, created_at, created_by, note, restored_from_revision_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        newRevisionId,
        site.id,
        target.r2_prefix,
        target.entry_path,
        target.file_count,
        target.total_bytes,
        target.content_sha256,
        target.warnings_json,
        createdAt,
        c.get("ownerUserId"),
        sourceGeneration ? `第${sourceGeneration}世代を復元` : "過去世代を復元",
        target.id
      )
      .run();
    // Only the current-revision pointer changes — slug, auth mode, and expiry are untouched.
    await c.env.DB.prepare(`UPDATE sites SET current_revision_id = ?, updated_at = ? WHERE id = ?`)
      .bind(newRevisionId, createdAt, site.id)
      .run();

    const refreshed = await c.env.DB.prepare(`SELECT * FROM revisions WHERE site_id = ? ORDER BY created_at ASC LIMIT 200`)
      .bind(site.id)
      .all<RevisionRow>();
    const revisions = mapRevisionHistory(refreshed.results ?? [], newRevisionId);
    const restored = revisions.find((item) => item.id === newRevisionId) ?? null;
    return c.json({ revision: restored, currentRevisionId: newRevisionId, revisions });
  });

  // ---- Element-anchored review comments (issue #138) ----
  app.get("/api/sites/:siteId/comments", async (c) => {
    if ((await ownerActivePlanRank(c.env.DB, c.get("ownerUserId"))) < REVIEW_COMMENTS_MIN_RANK) {
      return jsonError("plan_required", 403, { feature: "review_comments", requiredPlan: REVIEW_COMMENTS_MIN_PLAN_LABEL });
    }
    const site = await c.env.DB.prepare(`SELECT id FROM sites WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`)
      .bind(c.req.param("siteId"), c.get("ownerUserId"))
      .first<{ id: string }>();
    if (!site) {
      return jsonError("site_not_found", 404);
    }
    const revisionId = c.req.query("revisionId");
    const rows = revisionId
      ? await c.env.DB.prepare(`SELECT * FROM site_revision_comments WHERE site_id = ? AND revision_id = ? ORDER BY created_at ASC LIMIT 500`)
          .bind(site.id, revisionId)
          .all<SiteRevisionCommentRow>()
      : await c.env.DB.prepare(`SELECT * FROM site_revision_comments WHERE site_id = ? ORDER BY created_at ASC LIMIT 500`)
          .bind(site.id)
          .all<SiteRevisionCommentRow>();
    return c.json({ comments: (rows.results ?? []).map(mapCommentRow) });
  });

  app.post("/api/sites/:siteId/comments", async (c) => {
    if ((await ownerActivePlanRank(c.env.DB, c.get("ownerUserId"))) < REVIEW_COMMENTS_MIN_RANK) {
      return jsonError("plan_required", 403, { feature: "review_comments", requiredPlan: REVIEW_COMMENTS_MIN_PLAN_LABEL });
    }
    let body: Record<string, unknown>;
    try {
      body = await c.req.json<Record<string, unknown>>();
    } catch {
      return jsonError("invalid_json");
    }
    const site = await c.env.DB.prepare(`SELECT id FROM sites WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`)
      .bind(c.req.param("siteId"), c.get("ownerUserId"))
      .first<{ id: string }>();
    if (!site) {
      return jsonError("site_not_found", 404);
    }
    const revisionId = typeof body.revisionId === "string" ? body.revisionId : "";
    const text = typeof body.body === "string" ? body.body.trim() : "";
    if (!revisionId) {
      return jsonError("revision_required");
    }
    if (!text) {
      return jsonError("comment_body_required");
    }
    if (text.length > COMMENT_BODY_MAX) {
      return jsonError("comment_too_long");
    }
    const revision = await c.env.DB.prepare(`SELECT id FROM revisions WHERE id = ? AND site_id = ?`)
      .bind(revisionId, site.id)
      .first<{ id: string }>();
    if (!revision) {
      return jsonError("revision_not_found", 404);
    }
    const id = crypto.randomUUID();
    const now = nowIso();
    const selector = typeof body.selector === "string" ? body.selector.slice(0, 1000) : null;
    const textSnippet = typeof body.textSnippet === "string" ? body.textSnippet.slice(0, 200) : null;
    const anchorRectJson = sanitizeAnchorRectInput(body.anchorRect);
    const status = normalizeCommentStatus(body.status);
    await c.env.DB.prepare(
      `INSERT INTO site_revision_comments (
        id, site_id, revision_id, author_user_id, selector, text_snippet, anchor_rect_json, body, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, site.id, revisionId, c.get("ownerUserId"), selector, textSnippet, anchorRectJson, text, status, now, now)
      .run();
    return c.json(
      {
        comment: mapCommentRow({
          id,
          site_id: site.id,
          revision_id: revisionId,
          author_user_id: c.get("ownerUserId"),
          selector,
          text_snippet: textSnippet,
          anchor_rect_json: anchorRectJson,
          body: text,
          status,
          created_at: now,
          updated_at: now
        })
      },
      201
    );
  });

  app.patch("/api/sites/:siteId/comments/:commentId", async (c) => {
    if ((await ownerActivePlanRank(c.env.DB, c.get("ownerUserId"))) < REVIEW_COMMENTS_MIN_RANK) {
      return jsonError("plan_required", 403, { feature: "review_comments", requiredPlan: REVIEW_COMMENTS_MIN_PLAN_LABEL });
    }
    let body: Record<string, unknown>;
    try {
      body = await c.req.json<Record<string, unknown>>();
    } catch {
      return jsonError("invalid_json");
    }
    const site = await c.env.DB.prepare(`SELECT id FROM sites WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`)
      .bind(c.req.param("siteId"), c.get("ownerUserId"))
      .first<{ id: string }>();
    if (!site) {
      return jsonError("site_not_found", 404);
    }
    const existing = await c.env.DB.prepare(`SELECT * FROM site_revision_comments WHERE id = ? AND site_id = ?`)
      .bind(c.req.param("commentId"), site.id)
      .first<SiteRevisionCommentRow>();
    if (!existing) {
      return jsonError("comment_not_found", 404);
    }
    let nextBody = existing.body;
    if (body.body !== undefined) {
      const text = typeof body.body === "string" ? body.body.trim() : "";
      if (!text) {
        return jsonError("comment_body_required");
      }
      if (text.length > COMMENT_BODY_MAX) {
        return jsonError("comment_too_long");
      }
      nextBody = text;
    }
    const nextStatus = body.status !== undefined ? normalizeCommentStatus(body.status) : normalizeCommentStatus(existing.status);
    const now = nowIso();
    await c.env.DB.prepare(`UPDATE site_revision_comments SET body = ?, status = ?, updated_at = ? WHERE id = ? AND site_id = ?`)
      .bind(nextBody, nextStatus, now, existing.id, site.id)
      .run();
    return c.json({ comment: mapCommentRow({ ...existing, body: nextBody, status: nextStatus, updated_at: now }) });
  });

  app.delete("/api/sites/:siteId/comments/:commentId", async (c) => {
    if ((await ownerActivePlanRank(c.env.DB, c.get("ownerUserId"))) < REVIEW_COMMENTS_MIN_RANK) {
      return jsonError("plan_required", 403, { feature: "review_comments", requiredPlan: REVIEW_COMMENTS_MIN_PLAN_LABEL });
    }
    const site = await c.env.DB.prepare(`SELECT id FROM sites WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`)
      .bind(c.req.param("siteId"), c.get("ownerUserId"))
      .first<{ id: string }>();
    if (!site) {
      return jsonError("site_not_found", 404);
    }
    const result = await c.env.DB.prepare(`DELETE FROM site_revision_comments WHERE id = ? AND site_id = ?`)
      .bind(c.req.param("commentId"), site.id)
      .run();
    if (result.meta.changes === 0) {
      return jsonError("comment_not_found", 404);
    }
    return c.json({ ok: true });
  });

  app.get("/api/sites/:siteId/events", async (c) => {
    const site = await c.env.DB.prepare(`SELECT id FROM sites WHERE id = ? AND owner_user_id = ? AND deleted_at IS NULL`)
      .bind(c.req.param("siteId"), c.get("ownerUserId"))
      .first<{ id: string }>();
    if (!site) {
      return jsonError("site_not_found", 404);
    }
    const rows = await c.env.DB.prepare(
      `SELECT id, site_id, path, event_type, email, ip_hash, created_at
       FROM access_events
       WHERE site_id = ?
       ORDER BY created_at DESC
       LIMIT 50`
    )
      .bind(c.req.param("siteId"))
      .all<AccessEventRow>();
    return c.json({ events: rows.results.map(mapEvent) });
  });

  return app;
}
