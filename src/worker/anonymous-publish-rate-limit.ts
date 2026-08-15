import { ANON_PUBLISH_MAX_PER_DAY, ANON_PUBLISH_MAX_PER_HOUR } from "../shared/anon-publish";

export interface AnonymousPublishAttemptLimits {
  hour: number;
  day: number;
}

const DEFAULT_LIMITS: AnonymousPublishAttemptLimits = {
  hour: ANON_PUBLISH_MAX_PER_HOUR,
  day: ANON_PUBLISH_MAX_PER_DAY
};

function hourBucket(now: Date): { keyPart: string; resetsAt: string } {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours()));
  const reset = new Date(start.getTime() + 60 * 60 * 1000);
  return { keyPart: start.toISOString().slice(0, 13), resetsAt: reset.toISOString() };
}

function dayBucket(now: Date): { keyPart: string; resetsAt: string } {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const reset = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { keyPart: start.toISOString().slice(0, 10), resetsAt: reset.toISOString() };
}

async function reserveBucket(
  db: D1Database,
  ipHash: string,
  windowName: "hour" | "day",
  keyPart: string,
  resetsAt: string,
  nowIso: string,
  maxAttempts: number
): Promise<boolean> {
  const bucketKey = `anon-publish:${windowName}:${ipHash}:${keyPart}`;
  const result = await db
    .prepare(
      `INSERT INTO anonymous_publish_attempts (bucket_key, ip_hash, window_name, count, resets_at, updated_at)
       VALUES (?, ?, ?, 1, ?, ?)
       ON CONFLICT(bucket_key) DO UPDATE SET
         count = CASE
           WHEN anonymous_publish_attempts.resets_at <= excluded.updated_at THEN 1
           ELSE anonymous_publish_attempts.count + 1
         END,
         resets_at = CASE
           WHEN anonymous_publish_attempts.resets_at <= excluded.updated_at THEN excluded.resets_at
           ELSE anonymous_publish_attempts.resets_at
         END,
         updated_at = excluded.updated_at
       WHERE anonymous_publish_attempts.resets_at <= excluded.updated_at
          OR anonymous_publish_attempts.count < ?`
    )
    .bind(bucketKey, ipHash, windowName, resetsAt, nowIso, maxAttempts)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

export async function reserveAnonymousPublishAttempt(
  db: D1Database,
  ipHash: string,
  now = new Date(),
  limits: AnonymousPublishAttemptLimits = DEFAULT_LIMITS
): Promise<boolean> {
  const nowIso = now.toISOString();
  const hour = hourBucket(now);
  const hourAllowed = await reserveBucket(db, ipHash, "hour", hour.keyPart, hour.resetsAt, nowIso, limits.hour);
  if (!hourAllowed) {
    return false;
  }

  const day = dayBucket(now);
  return reserveBucket(db, ipHash, "day", day.keyPart, day.resetsAt, nowIso, limits.day);
}
