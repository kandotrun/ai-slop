CREATE TABLE IF NOT EXISTS app_email_otp_challenges (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_app_email_otp_challenges_email ON app_email_otp_challenges(email);
CREATE INDEX IF NOT EXISTS idx_app_email_otp_challenges_expires_at ON app_email_otp_challenges(expires_at);
CREATE INDEX IF NOT EXISTS idx_app_email_otp_challenges_consumed_at ON app_email_otp_challenges(consumed_at);
