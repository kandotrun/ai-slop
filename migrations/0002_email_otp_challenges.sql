CREATE TABLE IF NOT EXISTS email_otp_challenges (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  email TEXT NOT NULL,
  email_domain TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  return_to TEXT NOT NULL DEFAULT '/',
  attempts INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (site_id) REFERENCES sites(id)
);

CREATE INDEX IF NOT EXISTS idx_email_otp_challenges_site_id ON email_otp_challenges(site_id);
CREATE INDEX IF NOT EXISTS idx_email_otp_challenges_email ON email_otp_challenges(email);
CREATE INDEX IF NOT EXISTS idx_email_otp_challenges_expires_at ON email_otp_challenges(expires_at);
