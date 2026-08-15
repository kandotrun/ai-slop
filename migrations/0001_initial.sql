CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sites (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  auth_mode TEXT NOT NULL DEFAULT 'password',
  password_hash TEXT,
  allowed_email_domains TEXT,
  expires_at TEXT,
  current_revision_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_sites_owner_user_id ON sites(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_sites_slug ON sites(slug);
CREATE INDEX IF NOT EXISTS idx_sites_status ON sites(status);

CREATE TABLE IF NOT EXISTS revisions (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  r2_prefix TEXT NOT NULL,
  entry_path TEXT NOT NULL DEFAULT 'index.html',
  file_count INTEGER NOT NULL DEFAULT 1,
  total_bytes INTEGER NOT NULL DEFAULT 0,
  content_sha256 TEXT,
  warnings_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  FOREIGN KEY (site_id) REFERENCES sites(id)
);

CREATE INDEX IF NOT EXISTS idx_revisions_site_id ON revisions(site_id);

CREATE TABLE IF NOT EXISTS viewer_sessions (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  auth_method TEXT NOT NULL,
  email TEXT,
  email_domain TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (site_id) REFERENCES sites(id)
);

CREATE INDEX IF NOT EXISTS idx_viewer_sessions_site_id ON viewer_sessions(site_id);
CREATE INDEX IF NOT EXISTS idx_viewer_sessions_expires_at ON viewer_sessions(expires_at);

CREATE TABLE IF NOT EXISTS access_events (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  path TEXT NOT NULL,
  event_type TEXT NOT NULL,
  created_at TEXT NOT NULL,
  ip_hash TEXT,
  user_agent_hash TEXT,
  FOREIGN KEY (site_id) REFERENCES sites(id)
);

CREATE INDEX IF NOT EXISTS idx_access_events_site_id ON access_events(site_id);
CREATE INDEX IF NOT EXISTS idx_access_events_created_at ON access_events(created_at);
