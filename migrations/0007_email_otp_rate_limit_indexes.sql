CREATE INDEX IF NOT EXISTS idx_app_email_otp_challenges_email_created_at ON app_email_otp_challenges(email, created_at);
CREATE INDEX IF NOT EXISTS idx_app_email_otp_challenges_email_active ON app_email_otp_challenges(email, consumed_at, expires_at);
