ALTER TABLE site_form_submissions ADD COLUMN notification_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE site_form_submissions ADD COLUMN notification_error TEXT;
ALTER TABLE site_form_submissions ADD COLUMN notification_message_id TEXT;

CREATE INDEX IF NOT EXISTS idx_site_form_submissions_site_notification_status ON site_form_submissions(site_id, notification_status, created_at DESC);
