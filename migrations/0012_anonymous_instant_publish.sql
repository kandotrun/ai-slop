-- Anonymous instant publish + claim.
-- A reserved system user owns anonymous sites until a real user claims them,
-- so sites.owner_user_id keeps its NOT NULL + FK without a table rebuild.

INSERT OR IGNORE INTO users (id, email, name, image, email_verified, created_at, updated_at)
VALUES ('anon-public', 'anonymous@giga-site.invalid', '匿名公開', NULL, 0, '2026-06-21T00:00:00.000Z', '2026-06-21T00:00:00.000Z');

ALTER TABLE sites ADD COLUMN source TEXT;
ALTER TABLE sites ADD COLUMN claim_token_hash TEXT;
ALTER TABLE sites ADD COLUMN claimed_at TEXT;
ALTER TABLE sites ADD COLUMN ip_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_sites_claim_token_hash ON sites(claim_token_hash);
CREATE INDEX IF NOT EXISTS idx_sites_ip_hash_created ON sites(ip_hash, created_at);
