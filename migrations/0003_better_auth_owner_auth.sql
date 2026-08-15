-- Better Auth owner/admin authentication.
-- The existing users table is reused so sites.owner_user_id keeps referencing users(id).

ALTER TABLE users ADD COLUMN name TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN image TEXT;
ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS auth_accounts (
  id TEXT PRIMARY KEY NOT NULL,
  provider_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  id_token TEXT,
  access_token_expires_at DATE,
  refresh_token_expires_at DATE,
  scope TEXT,
  password TEXT,
  created_at DATE NOT NULL,
  updated_at DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_auth_accounts_user_id ON auth_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_accounts_provider_account ON auth_accounts(provider_id, account_id);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at DATE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at DATE NOT NULL,
  updated_at DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at ON auth_sessions(expires_at);

CREATE TABLE IF NOT EXISTS auth_verifications (
  id TEXT PRIMARY KEY NOT NULL,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expires_at DATE NOT NULL,
  created_at DATE NOT NULL,
  updated_at DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_auth_verifications_identifier ON auth_verifications(identifier);
CREATE INDEX IF NOT EXISTS idx_auth_verifications_expires_at ON auth_verifications(expires_at);
