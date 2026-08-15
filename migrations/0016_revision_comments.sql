-- Element-anchored review comments on a published HTML preview.
-- Comments are tied to the revision they were left on (selectors can break across
-- revisions, so carrying them forward is intentionally out of scope here).
CREATE TABLE IF NOT EXISTS site_revision_comments (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  revision_id TEXT NOT NULL,
  author_user_id TEXT NOT NULL,
  selector TEXT,
  text_snippet TEXT,
  anchor_rect_json TEXT,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (site_id) REFERENCES sites(id)
);

CREATE INDEX IF NOT EXISTS idx_site_revision_comments_revision ON site_revision_comments(revision_id);
CREATE INDEX IF NOT EXISTS idx_site_revision_comments_site ON site_revision_comments(site_id);
