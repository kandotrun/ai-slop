import { MEASUREMENT_EVENT_NAMES, type MeasurementEventName } from "../shared/types";

interface MeasurementEventInput {
  eventName?: unknown;
  path?: unknown;
  articlePath?: unknown;
  visitorId?: unknown;
  siteId?: unknown;
  metadata?: unknown;
}

export interface MeasurementRecordInput {
  eventName: MeasurementEventName;
  path: string;
  articlePath?: string | null;
  visitorId?: string | null;
  ownerUserId?: string | null;
  siteId?: string | null;
  metadata?: Record<string, unknown>;
}

interface NormalizedMeasurementRecord {
  eventName: MeasurementEventName;
  path: string;
  articlePath: string | null;
  visitorId: string | null;
  ownerUserId: string | null;
  siteId: string | null;
  metadata: Record<string, string | number | boolean | null>;
}

const EVENT_NAMES = new Set<string>(MEASUREMENT_EVENT_NAMES);
const MAX_METADATA_KEYS = 12;
const MAX_METADATA_STRING_LENGTH = 160;

function isMeasurementEventName(value: unknown): value is MeasurementEventName {
  return typeof value === "string" && EVENT_NAMES.has(value);
}

function normalizePath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 500 || !trimmed.startsWith("/") || trimmed.startsWith("//") || /[\u0000-\u001f\u007f]/.test(trimmed)) {
    return null;
  }
  try {
    const url = new URL(trimmed, "https://giga-site.com");
    const pathname = url.pathname.replace(/\/{2,}/g, "/");
    return pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  } catch {
    return null;
  }
}

function normalizeOptionalPath(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  return normalizePath(value);
}

function normalizeId(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return /^[A-Za-z0-9_-]{1,128}$/.test(trimmed) ? trimmed : null;
}

function normalizeVisitorId(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return /^[A-Za-z0-9_-]{16,128}$/.test(trimmed) ? trimmed : null;
}

function sanitizeMetadata(value: unknown): Record<string, string | number | boolean | null> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const output: Record<string, string | number | boolean | null> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (Object.keys(output).length >= MAX_METADATA_KEYS) break;
    if (!/^[A-Za-z0-9_:-]{1,40}$/.test(key)) continue;
    if (typeof raw === "string") {
      output[key] = raw.slice(0, MAX_METADATA_STRING_LENGTH);
      continue;
    }
    if (typeof raw === "number" && Number.isFinite(raw)) {
      output[key] = raw;
      continue;
    }
    if (typeof raw === "boolean" || raw === null) {
      output[key] = raw;
    }
  }
  return output;
}

function normalizeMeasurementRecord(input: MeasurementRecordInput | MeasurementEventInput): { ok: true; value: NormalizedMeasurementRecord } | { ok: false; error: string } {
  if (!isMeasurementEventName(input.eventName)) {
    return { ok: false, error: "invalid_measurement_event" };
  }
  const path = normalizePath(input.path);
  if (!path) {
    return { ok: false, error: "invalid_measurement_path" };
  }
  const articlePath = normalizeOptionalPath(input.articlePath);
  if ((input.articlePath !== undefined && input.articlePath !== null && input.articlePath !== "") && !articlePath) {
    return { ok: false, error: "invalid_measurement_article_path" };
  }
  const siteId = normalizeId(input.siteId);
  if ((input.siteId !== undefined && input.siteId !== null && input.siteId !== "") && !siteId) {
    return { ok: false, error: "invalid_measurement_site_id" };
  }
  const ownerUserId = "ownerUserId" in input ? normalizeId(input.ownerUserId) : null;
  if (("ownerUserId" in input && input.ownerUserId !== undefined && input.ownerUserId !== null && input.ownerUserId !== "") && !ownerUserId) {
    return { ok: false, error: "invalid_measurement_owner_user_id" };
  }
  const visitorId = normalizeVisitorId(input.visitorId);
  return {
    ok: true,
    value: {
      eventName: input.eventName,
      path,
      articlePath,
      visitorId,
      ownerUserId,
      siteId,
      metadata: sanitizeMetadata(input.metadata)
    }
  };
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashNullable(value: string | null, namespace: string, env: Env): Promise<string | null> {
  if (!value) return null;
  return sha256Hex(`${env.APP_HOST}:${namespace}:${value}`);
}

function referrerFromRequest(request: Request): string | null {
  const referrer = request.headers.get("Referer");
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return null;
  }
}

export async function recordMeasurementEvent(env: Env, request: Request, input: MeasurementRecordInput): Promise<{ ok: true } | { ok: false; error: string }> {
  const normalized = normalizeMeasurementRecord(input);
  if (!normalized.ok) return normalized;
  const value = normalized.value;
  const ip = request.headers.get("CF-Connecting-IP") ?? request.headers.get("X-Forwarded-For");
  const userAgent = request.headers.get("User-Agent");
  const requestVisitorId = normalizeVisitorId(request.headers.get("X-Giga-Site-Visitor"));
  const [sessionHash, ipHash, userAgentHash] = await Promise.all([
    hashNullable(value.visitorId ?? requestVisitorId, "visitor", env),
    hashNullable(ip, "ip", env),
    hashNullable(userAgent, "ua", env)
  ]);
  await env.DB.prepare(
    `INSERT INTO measurement_events (
      id, event_name, path, article_path, owner_user_id, site_id,
      session_hash, ip_hash, user_agent_hash, referrer, metadata_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      crypto.randomUUID(),
      value.eventName,
      value.path,
      value.articlePath,
      value.ownerUserId,
      value.siteId,
      sessionHash,
      ipHash,
      userAgentHash,
      referrerFromRequest(request),
      JSON.stringify(value.metadata),
      new Date().toISOString()
    )
    .run();
  return { ok: true };
}

export async function handleMeasurementRequest(env: Env, request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ error: "method_not_allowed" }, { status: 405 });
  }
  const contentType = request.headers.get("Content-Type") ?? "";
  const normalizedContentType = contentType.split(";", 1)[0].trim().toLowerCase();
  if (normalizedContentType !== "application/json" && normalizedContentType !== "text/plain") {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  let body: MeasurementEventInput;
  try {
    const raw = await request.json();
    body = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as MeasurementEventInput : {};
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const result = await recordMeasurementEvent(env, request, {
    eventName: body.eventName as MeasurementEventName,
    path: typeof body.path === "string" ? body.path : "",
    articlePath: typeof body.articlePath === "string" ? body.articlePath : null,
    visitorId: typeof body.visitorId === "string" ? body.visitorId : null,
    siteId: typeof body.siteId === "string" ? body.siteId : null,
    metadata: body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata) ? body.metadata as Record<string, unknown> : {}
  });
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }
  return Response.json({ accepted: true }, { status: 202 });
}
