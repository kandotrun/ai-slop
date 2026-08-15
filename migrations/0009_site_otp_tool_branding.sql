-- Adds explicit email-allowlist OTP auth, creation-tool tracking, and a
-- hide-branding flag to sites; records the (masked) email on access events so
-- the logs view can show who authenticated without storing raw IPs.

ALTER TABLE sites ADD COLUMN allowed_emails TEXT;
ALTER TABLE sites ADD COLUMN tool TEXT;
ALTER TABLE sites ADD COLUMN hide_branding INTEGER NOT NULL DEFAULT 0;

ALTER TABLE access_events ADD COLUMN email TEXT;
