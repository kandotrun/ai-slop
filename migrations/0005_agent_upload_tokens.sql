CREATE TABLE IF NOT EXISTS agent_upload_tokens (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  label TEXT,
  site_config_json TEXT NOT NULL,
  max_bytes INTEGER NOT NULL,
  max_files INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_site_id TEXT,
  created_revision_id TEXT,
  created_at TEXT NOT NULL,
  revoked_at TEXT,
  FOREIGN KEY (owner_user_id) REFERENCES users(id),
  FOREIGN KEY (created_site_id) REFERENCES sites(id),
  FOREIGN KEY (created_revision_id) REFERENCES revisions(id)
);

CREATE INDEX IF NOT EXISTS idx_agent_upload_tokens_owner_user_id ON agent_upload_tokens(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_agent_upload_tokens_expires_at ON agent_upload_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_agent_upload_tokens_used_at ON agent_upload_tokens(used_at);
