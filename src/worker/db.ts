import { SITE_TOOLS, type AuthMode, type SiteMetrics, type SiteStatus, type SiteSummary, type SiteTool } from "../shared/types";
import { buildPreviewUrl } from "./preview-routing";

const DEFAULT_OWNER_ID = "dev-owner";
const DEFAULT_OWNER_EMAIL = "owner@example.test";

export interface SiteRow {
  id: string;
  owner_user_id: string;
  slug: string;
  title: string | null;
  status: SiteStatus;
  auth_mode: AuthMode;
  password_hash: string | null;
  allowed_email_domains: string | null;
  allowed_emails: string | null;
  indexing_enabled: number | boolean | null;
  hide_branding: number | boolean | null;
  tool: string | null;
  expires_at: string | null;
  current_revision_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SiteMetricColumns {
  views?: number | null;
  auth_views?: number | null;
  unique_visitors?: number | null;
  total_bytes?: number | null;
  last_seen_at?: string | null;
}

export type SiteRowWithMetrics = SiteRow & SiteMetricColumns;

export interface RevisionRow {
  id: string;
  site_id: string;
  r2_prefix: string;
  entry_path: string;
  file_count: number;
  total_bytes: number;
  content_sha256: string | null;
  warnings_json: string;
  created_at: string;
  created_by: string | null;
  note: string | null;
  restored_from_revision_id: string | null;
}

export interface SiteRevisionCommentRow {
  id: string;
  site_id: string;
  revision_id: string;
  author_user_id: string;
  selector: string | null;
  text_snippet: string | null;
  anchor_rect_json: string | null;
  body: string;
  status: string;
  created_at: string;
  updated_at: string;
}

function parseStringArray(value: string | null): string[] {
  if (!value) {
    return [];
  }
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function parseAllowedEmailDomains(value: string | null): string[] {
  return parseStringArray(value);
}

export function parseAllowedEmails(value: string | null): string[] {
  return parseStringArray(value);
}

function parseTool(value: string | null): SiteTool | null {
  return value && (SITE_TOOLS as readonly string[]).includes(value) ? (value as SiteTool) : null;
}

function metricNumber(value: number | null | undefined): number {
  return Number.isFinite(value) ? Number(value) : 0;
}

function mapMetrics(row: SiteMetricColumns): SiteMetrics {
  return {
    views: metricNumber(row.views),
    authViews: metricNumber(row.auth_views),
    uniqueVisitors: metricNumber(row.unique_visitors),
    totalBytes: metricNumber(row.total_bytes),
    lastSeenAt: row.last_seen_at ?? null
  };
}

export function isSearchIndexingEnabled(row: Pick<SiteRow, "auth_mode" | "indexing_enabled">): boolean {
  return row.auth_mode === "random" && (row.indexing_enabled === 1 || row.indexing_enabled === true);
}

export async function ensureDefaultOwner(db: D1Database, now: string): Promise<void> {
  await db
    .prepare(
      `INSERT OR IGNORE INTO users (id, email, created_at, updated_at)
       VALUES (?, ?, ?, ?)`
    )
    .bind(DEFAULT_OWNER_ID, DEFAULT_OWNER_EMAIL, now, now)
    .run();
}

export function getDefaultOwnerId(): string {
  return DEFAULT_OWNER_ID;
}

export function mapSiteRow(row: SiteRowWithMetrics, previewHostSuffix: string): SiteSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title ?? "Untitled HTML",
    status: row.status,
    authMode: row.auth_mode,
    allowedEmailDomains: parseAllowedEmailDomains(row.allowed_email_domains),
    allowedEmails: parseAllowedEmails(row.allowed_emails),
    indexingEnabled: row.indexing_enabled === 1 || row.indexing_enabled === true,
    hideBranding: row.hide_branding === 1 || row.hide_branding === true,
    tool: parseTool(row.tool),
    previewUrl: buildPreviewUrl(row.slug, previewHostSuffix),
    expiresAt: row.expires_at,
    currentRevisionId: row.current_revision_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    metrics: mapMetrics(row)
  };
}
