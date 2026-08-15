-- Revision (generation) history for corporate review flows.
-- Reuses the existing append-only `revisions` table; adds author, optional note,
-- and a restore-audit pointer so a restore is recorded as a new generation.
ALTER TABLE revisions ADD COLUMN created_by TEXT;
ALTER TABLE revisions ADD COLUMN note TEXT;
ALTER TABLE revisions ADD COLUMN restored_from_revision_id TEXT;

-- Short-lived, owner-issued tokens to preview a specific past revision on the
-- preview origin without exposing it publicly. Keeps the admin/preview origin
-- separation intact: the admin issues the token, the preview origin validates it.
CREATE TABLE IF NOT EXISTS revision_preview_tokens (
  token TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  revision_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_revision_preview_tokens_expires ON revision_preview_tokens(expires_at);
