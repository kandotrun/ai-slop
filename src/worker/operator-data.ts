import type { OperatorPage, OperatorSite, OperatorSummary, OperatorUser } from "../shared/operator";
import { configuredEmails } from "./operator-auth";
import type { OperatorListQuery, OperatorWindow } from "./operator-query";

const PEOPLE_SQL = `people AS (
  SELECT id, email, name, created_at,
    CASE WHEN id = 'anon-public' THEN 'anonymous'
      WHEN lower(trim(email)) IN (SELECT value FROM json_each(?4))
        OR instr(trim(email), '@') <= 1
        OR lower(substr(trim(email), instr(trim(email), '@') + 1)) = 'invalid'
        OR lower(trim(email)) LIKE '%.invalid'
      THEN 'internal' ELSE 'registered' END AS segment
  FROM users
)`;

const PUBLISHED_SQL = `first_publications AS (
  SELECT site_id, MIN(created_at) AS first_published_at FROM revisions GROUP BY site_id
), published AS (
  SELECT s.id, s.owner_user_id, p.first_published_at, s.status, s.expires_at, s.deleted_at, u.segment
  FROM sites s JOIN people u ON u.id = s.owner_user_id
  JOIN revisions r ON r.id = s.current_revision_id AND r.site_id = s.id
  JOIN first_publications p ON p.site_id = s.id
  WHERE p.first_published_at < ?3
), eligible_sites AS (SELECT * FROM published WHERE segment <> 'internal')`;

function bindings(env: Env, window: OperatorWindow): [string, string, string, string] {
  const internal = [...new Set([...configuredEmails(env.OPERATOR_EMAILS), ...configuredEmails(env.OPS_INTERNAL_EMAILS)])];
  return [window.from ?? "", window.to, window.generatedAt, JSON.stringify(internal)];
}

export async function operatorSummary(env: Env, window: OperatorWindow): Promise<OperatorSummary> {
  const values = bindings(env, window);
  const metrics = await env.DB.prepare(`WITH ${PEOPLE_SQL}, ${PUBLISHED_SQL},
    window_sites AS (SELECT * FROM eligible_sites WHERE first_published_at >= ?1 AND first_published_at < ?2),
    creators AS (
      SELECT s.owner_user_id, COUNT(DISTINCT date(r.created_at, '+9 hours')) AS days
      FROM revisions r JOIN eligible_sites s ON s.id = r.site_id
      WHERE s.segment = 'registered' AND r.created_at >= ?1 AND r.created_at < ?2
      GROUP BY s.owner_user_id
    )
    SELECT
      (SELECT COUNT(*) FROM people WHERE segment = 'registered' AND created_at < ?3) AS registeredUsers,
      (SELECT COUNT(*) FROM people WHERE segment = 'registered' AND created_at >= ?1 AND created_at < ?2) AS newUsers,
      (SELECT COUNT(*) FROM window_sites) AS publishedSites,
      (SELECT COUNT(*) FROM window_sites WHERE segment = 'anonymous') AS anonymousSites,
      (SELECT COUNT(*) FROM window_sites WHERE segment = 'registered') AS registeredSites,
      (SELECT COUNT(*) FROM creators) AS activeCreators,
      (SELECT COUNT(*) FROM access_events e JOIN eligible_sites s ON s.id = e.site_id
        WHERE e.event_type = 'view' AND e.created_at >= ?1 AND e.created_at < ?2) AS previewViews,
      (SELECT COUNT(*) FROM eligible_sites WHERE deleted_at IS NULL AND status = 'active'
        AND (expires_at IS NULL OR expires_at > ?3)) AS liveSites,
      (SELECT COUNT(*) FROM billing_subscriptions b JOIN people u ON u.id = b.owner_user_id
        WHERE u.segment = 'registered' AND b.livemode = 1 AND b.status = 'active' AND b.created_at < ?3) AS paidSubscriptions,
      (SELECT COUNT(*) FROM creators WHERE days >= 2) AS returningCreators
  `).bind(...values).first<OperatorSummary["metrics"]>();
  if (!metrics) throw new Error("operator_metrics_missing");
  const rows = await env.DB.prepare(`WITH ${PEOPLE_SQL}, ${PUBLISHED_SQL}, daily_events AS (
    SELECT date(created_at, '+9 hours') AS date, COUNT(*) AS newUsers, 0 AS sites, 0 AS views
      FROM people WHERE segment = 'registered' AND created_at >= ?1 AND created_at < ?2 GROUP BY date
    UNION ALL
    SELECT date(first_published_at, '+9 hours') AS date, 0, COUNT(*), 0
      FROM eligible_sites WHERE first_published_at >= ?1 AND first_published_at < ?2 GROUP BY date
    UNION ALL
    SELECT date(e.created_at, '+9 hours') AS date, 0, 0, COUNT(*)
      FROM access_events e JOIN eligible_sites s ON s.id = e.site_id
      WHERE e.event_type = 'view' AND e.created_at >= ?1 AND e.created_at < ?2 GROUP BY date
  ) SELECT date, SUM(newUsers) AS newUsers, SUM(sites) AS sites, SUM(views) AS views FROM daily_events GROUP BY date ORDER BY date
  `).bind(window.dailyFrom, ...values.slice(1)).all<OperatorSummary["daily"][number]>();
  const days = new Map(rows.results.map((day) => [day.date, day]));
  return {
    period: window.period, from: window.from, to: window.to, timezone: "Asia/Tokyo", generatedAt: window.generatedAt,
    metrics, daily: window.daily.map((day) => days.get(day.date) ?? day)
  };
}

function previewUrl(slug: string, suffix: string): string {
  const label = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
  if (!label.test(slug) || !suffix.startsWith(".")) return "";
  const labels = suffix.slice(1).split(".");
  if (labels.length < 2 || !labels.every((part) => label.test(part)) || `${slug}${suffix}`.length > 253) return "";
  return `https://${slug}${suffix}/`;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  return domain ? `${local.slice(0, 1)}***@${domain}` : "registered";
}

interface SiteResult extends Omit<OperatorSite, "previewUrl" | "ownerLabel"> {
  ownerEmail: string;
}

function page<T>(items: T[], total: number, query: OperatorListQuery): OperatorPage<T> {
  return { items, total, offset: query.offset, limit: query.limit, hasMore: query.offset + items.length < total };
}

export async function operatorSites(env: Env, window: OperatorWindow, query: OperatorListQuery): Promise<OperatorPage<OperatorSite>> {
  const filter = `WITH ${PEOPLE_SQL}, filtered AS (
    SELECT s.id, s.title, s.slug, u.email AS ownerEmail, u.segment, s.auth_mode AS authMode,
      CASE WHEN s.deleted_at IS NOT NULL OR s.status = 'deleted' THEN 'deleted'
        WHEN r.id IS NULL THEN 'draft'
        WHEN s.status = 'expired' OR s.expires_at <= ?3 THEN 'expired'
        WHEN s.status <> 'active' THEN 'draft' ELSE 'active' END AS status,
      s.created_at AS createdAt, s.expires_at AS expiresAt, COALESCE(r.file_count, 0) AS fileCount, COALESCE(r.total_bytes, 0) AS totalBytes
    FROM sites s JOIN people u ON u.id = s.owner_user_id
    LEFT JOIN revisions r ON r.id = s.current_revision_id AND r.site_id = s.id
    WHERE s.created_at >= ?1 AND s.created_at < ?2 AND (
      COALESCE(s.title, '') LIKE ?5 ESCAPE '\\' OR s.slug LIKE ?5 ESCAPE '\\' OR u.email LIKE ?5 ESCAPE '\\' OR u.name LIKE ?5 ESCAPE '\\'
    )
  )`;
  const values = [...bindings(env, window), query.pattern];
  const total = await env.DB.prepare(`${filter} SELECT COUNT(*) AS total FROM filtered`).bind(...values).first<{ total: number }>();
  const rows = await env.DB.prepare(`${filter} SELECT f.*,
    (SELECT COUNT(*) FROM access_events e WHERE e.site_id = f.id AND e.event_type = 'view' AND e.created_at < ?3) AS views
    FROM filtered f ORDER BY createdAt DESC, id DESC LIMIT ?6 OFFSET ?7
  `).bind(...values, query.limit, query.offset).all<SiteResult>();
  const items = rows.results.map((row): OperatorSite => ({
    id: row.id, title: row.title ?? "", slug: row.slug,
    previewUrl: row.status === "active" ? previewUrl(row.slug, env.PREVIEW_HOST_SUFFIX) : "",
    ownerLabel: row.segment === "registered" ? maskEmail(row.ownerEmail) : row.segment,
    segment: row.segment, authMode: row.authMode, status: row.status, createdAt: row.createdAt, expiresAt: row.expiresAt,
    views: row.views, fileCount: row.fileCount, totalBytes: row.totalBytes
  }));
  return page(items, total?.total ?? 0, query);
}

export async function operatorUsers(env: Env, window: OperatorWindow, query: OperatorListQuery): Promise<OperatorPage<OperatorUser>> {
  const filter = `WITH ${PEOPLE_SQL}, filtered AS (
    SELECT id, email, name, segment, created_at AS createdAt FROM people
    WHERE segment <> 'anonymous' AND created_at >= ?1 AND created_at < ?2
      AND (email LIKE ?5 ESCAPE '\\' OR name LIKE ?5 ESCAPE '\\')
  )`;
  const values = [...bindings(env, window), query.pattern];
  const total = await env.DB.prepare(`${filter} SELECT COUNT(*) AS total FROM filtered`).bind(...values).first<{ total: number }>();
  const rows = await env.DB.prepare(`${filter}, user_sites AS (
    SELECT s.id, s.owner_user_id, s.created_at FROM sites s
    JOIN revisions r ON r.id = s.current_revision_id AND r.site_id = s.id WHERE s.created_at < ?3
  ) SELECT f.id, f.email, f.name, f.segment, f.createdAt,
    (SELECT COUNT(*) FROM user_sites s WHERE s.owner_user_id = f.id) AS siteCount,
    (SELECT MAX(r.created_at) FROM user_sites s JOIN revisions r ON r.site_id = s.id
      WHERE s.owner_user_id = f.id AND r.created_at < ?3) AS lastPublishedAt
    FROM filtered f ORDER BY createdAt DESC, id DESC LIMIT ?6 OFFSET ?7
  `).bind(...values, query.limit, query.offset).all<OperatorUser>();
  return page(rows.results, total?.total ?? 0, query);
}
