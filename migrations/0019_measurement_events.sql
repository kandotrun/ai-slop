CREATE TABLE IF NOT EXISTS measurement_events (
  id TEXT PRIMARY KEY,
  event_name TEXT NOT NULL,
  path TEXT NOT NULL,
  article_path TEXT,
  owner_user_id TEXT,
  site_id TEXT,
  session_hash TEXT,
  ip_hash TEXT,
  user_agent_hash TEXT,
  referrer TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  FOREIGN KEY (owner_user_id) REFERENCES users(id),
  FOREIGN KEY (site_id) REFERENCES sites(id)
);

CREATE INDEX IF NOT EXISTS idx_measurement_events_created_at ON measurement_events(created_at);
CREATE INDEX IF NOT EXISTS idx_measurement_events_event_name ON measurement_events(event_name);
CREATE INDEX IF NOT EXISTS idx_measurement_events_path ON measurement_events(path);
CREATE INDEX IF NOT EXISTS idx_measurement_events_article_path ON measurement_events(article_path);
CREATE INDEX IF NOT EXISTS idx_measurement_events_site_id ON measurement_events(site_id);
