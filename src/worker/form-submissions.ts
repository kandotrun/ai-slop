import type { FormSubmissionDetail, FormSubmissionField, FormSubmissionSummary } from "../shared/types";
import { FORM_SUBMISSIONS_MIN_PLAN_LABEL, FORM_SUBMISSIONS_MIN_RANK, planFeatureRank } from "../shared/plans";
import type { SiteRow } from "./db";

export const FORM_SUBMISSION_ENDPOINT = "/__giga/forms/submit";

const FORM_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const FORM_RATE_LIMIT_MAX = 20;
const MAX_BODY_BYTES = 64 * 1024;
const MAX_FORM_KEY_LENGTH = 80;
const MAX_FIELD_COUNT = 50;
const MAX_FIELD_NAME_LENGTH = 80;
const MAX_FIELD_VALUE_LENGTH = 2_000;
const MAX_FIELDS_JSON_BYTES = 32 * 1024;

const FORM_SUBMISSION_CSV_LIMIT = 1_000;

interface FormSubmissionInput {
  formKey?: unknown;
  fields?: unknown;
  sourcePath?: unknown;
  honeypot?: unknown;
}

interface SiteFormSubmissionRow {
  id: string;
  site_id: string;
  form_key: string;
  fields_json: string;
  field_count: number;
  source_path: string | null;
  submitter_email: string | null;
  notification_status: string;
  notification_error: string | null;
  notification_message_id: string | null;
  created_at: string;
}

interface RateLimitRow {
  total: number;
}

interface BillingSubscriptionRow {
  plan_id: string | null;
  status: string;
}

interface OwnerEmailRow {
  email: string;
}

function jsonError(error: string, status = 400): Response {
  return Response.json({ error }, { status });
}

export function formSubmissionsPlanRequiredResponse(): Response {
  return Response.json(
    { error: "plan_required", details: { feature: "form_submissions", requiredPlan: FORM_SUBMISSIONS_MIN_PLAN_LABEL } },
    { status: 403 }
  );
}

function isActiveSubscriptionStatus(status: string | null | undefined): boolean {
  return status === "active" || status === "trialing";
}

export async function ownerCanUseFormSubmissions(db: D1Database, ownerUserId: string): Promise<boolean> {
  const subscription = await db
    .prepare(
      `SELECT plan_id, status
       FROM billing_subscriptions WHERE owner_user_id = ? ORDER BY updated_at DESC LIMIT 1`
    )
    .bind(ownerUserId)
    .first<BillingSubscriptionRow>();
  if (!subscription || !isActiveSubscriptionStatus(subscription.status)) {
    return false;
  }
  return planFeatureRank(subscription.plan_id) >= FORM_SUBMISSIONS_MIN_RANK;
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

function textField(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\r\n?/g, "\n");
  if (!normalized || normalized.length > maxLength || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(normalized)) return null;
  return normalized;
}

function optionalTextField(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\r\n?/g, "\n");
  if (!normalized) return null;
  if (normalized.length > maxLength || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(normalized)) return null;
  return normalized;
}

function normalizeFormKey(value: unknown): string | null {
  const key = textField(value, MAX_FORM_KEY_LENGTH);
  if (!key) return null;
  // The value is user-facing (Japanese labels are OK) but should not contain HTML delimiters.
  if (/[<>]/.test(key)) return null;
  return key;
}

function normalizeFields(value: unknown): FormSubmissionField[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_FIELD_COUNT) {
    return null;
  }
  const fields: FormSubmissionField[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;
    const record = item as Record<string, unknown>;
    const name = textField(record.name, MAX_FIELD_NAME_LENGTH);
    if (!name || /[<>]/.test(name)) return null;
    const rawValue = typeof record.value === "string" ? record.value : record.value == null ? "" : String(record.value);
    const normalizedValue = rawValue.trim().replace(/\r\n?/g, "\n");
    if (normalizedValue.length > MAX_FIELD_VALUE_LENGTH) return null;
    fields.push({ name, value: normalizedValue });
  }
  return fields;
}

function isHoneypotFilled(input: FormSubmissionInput, fields: FormSubmissionField[]): boolean {
  if (typeof input.honeypot === "string" && input.honeypot.trim()) return true;
  return fields.some((field) => (field.name === "_giga_hp" || field.name === "giga_website") && field.value.trim());
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function requestIp(request: Request): string {
  return request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

async function requestHashes(env: Env, request: Request): Promise<{ ipHash: string; userAgentHash: string | null }> {
  const ip = requestIp(request);
  const userAgent = request.headers.get("user-agent");
  return {
    ipHash: await sha256Hex(`${env.APP_HOST}:form:${ip}`),
    userAgentHash: userAgent ? await sha256Hex(`${env.APP_HOST}:form-ua:${userAgent}`) : null
  };
}

async function readSubmissionInput(request: Request): Promise<{ ok: true; input: FormSubmissionInput } | { ok: false; response: Response }> {
  const contentType = request.headers.get("Content-Type") ?? "";
  if (contentType.includes("application/json")) {
    const raw = await request.text();
    if (byteLength(raw) > MAX_BODY_BYTES) {
      return { ok: false, response: jsonError("form_submission_too_large", 413) };
    }
    try {
      return { ok: true, input: JSON.parse(raw) as FormSubmissionInput };
    } catch {
      return { ok: false, response: jsonError("invalid_form_submission_json", 400) };
    }
  }
  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const fields: FormSubmissionField[] = [];
    const formKey = form.get("_giga_form") ?? form.get("formKey");
    for (const [name, value] of form.entries()) {
      if (name === "_giga_form" || name === "formKey") continue;
      fields.push({ name, value: typeof value === "string" ? value : value.name });
    }
    return { ok: true, input: { formKey, fields, sourcePath: form.get("sourcePath") ?? null, honeypot: form.get("_giga_hp") } };
  }
  return { ok: false, response: jsonError("unsupported_form_submission_content_type", 415) };
}

function acceptedJson(id?: string): Response {
  return Response.json(id ? { accepted: true, id } : { accepted: true });
}

export function isFormSubmissionPath(pathname: string): boolean {
  return pathname === FORM_SUBMISSION_ENDPOINT;
}

export function htmlContainsFormSubmissionOptIn(html: string): boolean {
  return /data-giga-form/i.test(html);
}

export function injectFormSubmissionBridge(html: string): string {
  if (!htmlContainsFormSubmissionOptIn(html) || /data-giga-form-bridge/i.test(html)) {
    return html;
  }
  const script = `<script data-giga-form-bridge>(()=>{const base=(location.pathname.match(/^\/preview\/[^/]+/)||[""])[0];const endpoint=base+"${FORM_SUBMISSION_ENDPOINT}";function text(status,message){const box=status.querySelector("[data-giga-form-status]")||status.nextElementSibling;if(box&&box.hasAttribute&&box.hasAttribute("data-giga-form-status")){box.textContent=message;return true}return false}document.addEventListener("submit",async(ev)=>{const form=ev.target;if(!(form instanceof HTMLFormElement)||!form.matches("form[data-giga-form]"))return;ev.preventDefault();const fields=[];for(const [name,value]of new FormData(form).entries()){fields.push({name,value:value instanceof File?value.name:String(value)})}const payload={formKey:form.getAttribute("data-giga-form")||"default",sourcePath:location.pathname+location.search,fields,honeypot:(new FormData(form).get("_giga_hp")||"").toString()};const submit=form.querySelector('[type="submit"]');if(submit)submit.disabled=true;text(form,"送信中...");try{const res=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify(payload)});if(!res.ok)throw new Error("failed");form.reset();text(form,"送信しました。ありがとうございます。")}catch{text(form,"送信できませんでした。時間をおいて再度お試しください。")}finally{if(submit)submit.disabled=false}},true)})();</script>`;
  const index = html.toLowerCase().lastIndexOf("</body>");
  return index === -1 ? `${html}${script}` : `${html.slice(0, index)}${script}${html.slice(index)}`;
}

function parseFieldsJson(value: string): FormSubmissionField[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((field): field is FormSubmissionField => Boolean(field && typeof field === "object" && typeof (field as FormSubmissionField).name === "string" && typeof (field as FormSubmissionField).value === "string"))
      : [];
  } catch {
    return [];
  }
}

export function mapFormSubmissionRow(row: SiteFormSubmissionRow): FormSubmissionDetail {
  const fields = parseFieldsJson(row.fields_json);
  return {
    id: row.id,
    siteId: row.site_id,
    formKey: row.form_key,
    fieldCount: row.field_count,
    fieldPreview: fields.filter((field) => field.value.trim()).slice(0, 3),
    fields,
    sourcePath: row.source_path,
    submitterEmail: row.submitter_email,
    notificationStatus: row.notification_status,
    notificationError: row.notification_error,
    createdAt: row.created_at
  };
}

export function summarizeFormSubmission(detail: FormSubmissionDetail): FormSubmissionSummary {
  const { fields: _fields, ...summary } = detail;
  return summary;
}

export async function listFormSubmissions(db: D1Database, siteId: string, limit = 100): Promise<FormSubmissionSummary[]> {
  const rows = await db
    .prepare(
      `SELECT id, site_id, form_key, fields_json, field_count, source_path, submitter_email,
              notification_status, notification_error, notification_message_id, created_at
       FROM site_form_submissions WHERE site_id = ? ORDER BY created_at DESC LIMIT ?`
    )
    .bind(siteId, limit)
    .all<SiteFormSubmissionRow>();
  return (rows.results ?? []).map((row) => summarizeFormSubmission(mapFormSubmissionRow(row)));
}

export async function getFormSubmission(db: D1Database, siteId: string, submissionId: string): Promise<FormSubmissionDetail | null> {
  const row = await db
    .prepare(
      `SELECT id, site_id, form_key, fields_json, field_count, source_path, submitter_email,
              notification_status, notification_error, notification_message_id, created_at
       FROM site_form_submissions WHERE id = ? AND site_id = ? LIMIT 1`
    )
    .bind(submissionId, siteId)
    .first<SiteFormSubmissionRow>();
  return row ? mapFormSubmissionRow(row) : null;
}

export async function listFormSubmissionDetails(db: D1Database, siteId: string, limit = FORM_SUBMISSION_CSV_LIMIT): Promise<FormSubmissionDetail[]> {
  const rows = await db
    .prepare(
      `SELECT id, site_id, form_key, fields_json, field_count, source_path, submitter_email,
              notification_status, notification_error, notification_message_id, created_at
       FROM site_form_submissions WHERE site_id = ? ORDER BY created_at DESC LIMIT ?`
    )
    .bind(siteId, limit)
    .all<SiteFormSubmissionRow>();
  return (rows.results ?? []).map((row) => mapFormSubmissionRow(row));
}

function csvCell(value: string | null | undefined): string {
  let normalized = (value ?? "").replace(/\r\n?/g, "\n");
  if (/^[=+\-@]/.test(normalized)) {
    normalized = `'${normalized}`;
  }
  return `"${normalized.replace(/"/g, '""')}"`;
}

export function formSubmissionsCsv(submissions: FormSubmissionDetail[]): string {
  const fieldNames: string[] = [];
  const seen = new Set<string>();
  for (const submission of submissions) {
    for (const field of submission.fields) {
      if (!seen.has(field.name)) {
        seen.add(field.name);
        fieldNames.push(field.name);
      }
    }
  }
  const headers = ["created_at", "form_key", "source_path", "submitter_email", "notification_status", ...fieldNames];
  const lines = [headers.map(csvCell).join(",")];
  for (const submission of submissions) {
    const values = new Map(submission.fields.map((field) => [field.name, field.value]));
    lines.push(
      [
        submission.createdAt,
        submission.formKey,
        submission.sourcePath ?? "",
        submission.submitterEmail ?? "",
        submission.notificationStatus,
        ...fieldNames.map((name) => values.get(name) ?? "")
      ].map(csvCell).join(",")
    );
  }
  return `\ufeff${lines.join("\n")}\n`;
}

function senderAddress(env: Env): string {
  return env.EMAIL_FROM || `no-reply@${env.APP_HOST}`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] ?? char);
}

function headerSafe(value: string, maxLength = 80): string {
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, maxLength) || "フォーム";
}

function notificationText(site: SiteRow, submission: FormSubmissionDetail): string {
  const fields = submission.fields.map((field) => `${field.name}: ${field.value || "（空）"}`).join("\n");
  return [
    "ギガサイト便のフォーム便に回答が届きました。",
    "",
    `サイト: ${site.title}`,
    `フォーム: ${submission.formKey}`,
    `送信元: ${submission.sourcePath ?? "未入力"}`,
    `認証メール: ${submission.submitterEmail ?? "未認証/未取得"}`,
    `受信時刻: ${submission.createdAt}`,
    "",
    "--- 回答内容 ---",
    fields
  ].join("\n");
}

function notificationHtml(site: SiteRow, submission: FormSubmissionDetail): string {
  const rows = submission.fields
    .map(
      (field) => `<tr><th style="text-align:left;vertical-align:top;padding:8px;border-bottom:1px solid #e4e4e7;width:180px">${escapeHtml(field.name)}</th><td style="white-space:pre-wrap;overflow-wrap:anywhere;padding:8px;border-bottom:1px solid #e4e4e7">${escapeHtml(field.value || "（空）")}</td></tr>`
    )
    .join("");
  return `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#18181b;line-height:1.65">
    <h1 style="font-size:20px">フォーム便に回答が届きました</h1>
    <dl>
      <dt>サイト</dt><dd>${escapeHtml(site.title ?? site.slug ?? site.id)}</dd>
      <dt>フォーム</dt><dd>${escapeHtml(submission.formKey)}</dd>
      <dt>送信元</dt><dd>${escapeHtml(submission.sourcePath ?? "未入力")}</dd>
      <dt>認証メール</dt><dd>${escapeHtml(submission.submitterEmail ?? "未認証/未取得")}</dd>
      <dt>受信時刻</dt><dd>${escapeHtml(submission.createdAt)}</dd>
    </dl>
    <h2 style="font-size:16px">回答内容</h2>
    <table style="border-collapse:collapse;width:100%;max-width:760px">${rows}</table>
  </body></html>`;
}

async function ownerEmail(db: D1Database, ownerUserId: string): Promise<string | null> {
  const row = await db.prepare(`SELECT email FROM users WHERE id = ? LIMIT 1`).bind(ownerUserId).first<OwnerEmailRow>();
  return row?.email ?? null;
}

async function updateNotificationStatus(env: Env, submissionId: string, status: string, messageIdOrError: string | null = null): Promise<void> {
  if (status === "sent") {
    await env.DB.prepare(`UPDATE site_form_submissions SET notification_status = 'sent', notification_message_id = ? WHERE id = ?`).bind(messageIdOrError, submissionId).run();
    return;
  }
  if (status === "email_failed") {
    await env.DB.prepare(`UPDATE site_form_submissions SET notification_status = 'email_failed', notification_error = ? WHERE id = ?`).bind(messageIdOrError, submissionId).run();
    return;
  }
  if (status === "email_not_configured") {
    await env.DB.prepare(`UPDATE site_form_submissions SET notification_status = 'email_not_configured' WHERE id = ?`).bind(submissionId).run();
    return;
  }
  if (status === "owner_email_missing") {
    await env.DB.prepare(`UPDATE site_form_submissions SET notification_status = 'owner_email_missing' WHERE id = ?`).bind(submissionId).run();
  }
}

async function notifyOwner(env: Env, site: SiteRow, submission: FormSubmissionDetail): Promise<void> {
  if (!env.EMAIL) {
    await updateNotificationStatus(env, submission.id, "email_not_configured");
    return;
  }
  const to = await ownerEmail(env.DB, site.owner_user_id);
  if (!to) {
    await updateNotificationStatus(env, submission.id, "owner_email_missing");
    return;
  }
  try {
    const result = await env.EMAIL.send({
      to,
      from: { email: senderAddress(env), name: "ギガサイト便" },
      subject: `【ギガサイト便】フォーム便: ${headerSafe(site.title ?? site.slug ?? site.id)} / ${headerSafe(submission.formKey, 40)}`,
      text: notificationText(site, submission),
      html: notificationHtml(site, submission)
    });
    await updateNotificationStatus(env, submission.id, "sent", result.messageId ?? null);
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 300) : "unknown_error";
    console.error("form_submission_email_send_failed", { id: submission.id, siteId: site.id, error: message });
    await updateNotificationStatus(env, submission.id, "email_failed", message);
  }
}

export async function handleFormSubmissionRequest(env: Env, request: Request, site: SiteRow, submitterEmail: string | null, ctx?: Pick<ExecutionContext, "waitUntil">): Promise<Response> {
  if (request.method !== "POST") {
    return jsonError("method_not_allowed", 405);
  }
  const parsed = await readSubmissionInput(request);
  if (!parsed.ok) return parsed.response;

  const formKey = normalizeFormKey(parsed.input.formKey);
  if (!formKey) return jsonError("invalid_form_key", 400);
  const fields = normalizeFields(parsed.input.fields);
  if (!fields) return jsonError("invalid_form_fields", 400);
  if (isHoneypotFilled(parsed.input, fields)) {
    return acceptedJson();
  }
  const fieldsJson = JSON.stringify(fields);
  if (byteLength(fieldsJson) > MAX_FIELDS_JSON_BYTES) {
    return jsonError("form_submission_too_large", 413);
  }

  const createdAt = new Date().toISOString();
  const hashes = await requestHashes(env, request);
  const cutoff = new Date(Date.now() - FORM_RATE_LIMIT_WINDOW_MS).toISOString();
  const recent = await env.DB.prepare(
    `SELECT COUNT(*) AS total FROM site_form_submissions WHERE site_id = ? AND ip_hash = ? AND created_at > ?`
  )
    .bind(site.id, hashes.ipHash, cutoff)
    .first<RateLimitRow>();
  if ((recent?.total ?? 0) >= FORM_RATE_LIMIT_MAX) {
    return jsonError("too_many_form_submissions", 429);
  }

  const sourcePath = optionalTextField(parsed.input.sourcePath, 240);
  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO site_form_submissions (
      id, site_id, form_key, fields_json, field_count, source_path, submitter_email, ip_hash, user_agent_hash, notification_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`
  )
    .bind(id, site.id, formKey, fieldsJson, fields.length, sourcePath, submitterEmail, hashes.ipHash, hashes.userAgentHash, createdAt)
    .run();

  const submission: FormSubmissionDetail = {
    id,
    siteId: site.id,
    formKey,
    fieldCount: fields.length,
    fieldPreview: fields.filter((field) => field.value.trim()).slice(0, 3),
    fields,
    sourcePath,
    submitterEmail,
    notificationStatus: "pending",
    notificationError: null,
    createdAt
  };
  // Notify the owner out of band so a slow or unavailable mail provider never delays the
  // visitor's submission response. Without an ExecutionContext (e.g. tests) fall back to awaiting.
  if (ctx?.waitUntil) {
    ctx.waitUntil(notifyOwner(env, site, submission));
  } else {
    await notifyOwner(env, site, submission);
  }

  return acceptedJson(id);
}
