CREATE TABLE IF NOT EXISTS anonymous_publish_attempts (
  bucket_key TEXT PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  window_name TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  resets_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_anonymous_publish_attempts_resets_at ON anonymous_publish_attempts(resets_at);
CREATE INDEX IF NOT EXISTS idx_anonymous_publish_attempts_ip_hash ON anonymous_publish_attempts(ip_hash);
