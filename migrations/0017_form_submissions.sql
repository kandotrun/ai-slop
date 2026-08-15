CREATE TABLE IF NOT EXISTS site_form_submissions (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  form_key TEXT NOT NULL,
  fields_json TEXT NOT NULL,
  field_count INTEGER NOT NULL DEFAULT 0,
  source_path TEXT,
  submitter_email TEXT,
  ip_hash TEXT NOT NULL,
  user_agent_hash TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_site_form_submissions_site_created_at ON site_form_submissions(site_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_form_submissions_site_form_created_at ON site_form_submissions(site_id, form_key, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_form_submissions_site_ip_created_at ON site_form_submissions(site_id, ip_hash, created_at);
