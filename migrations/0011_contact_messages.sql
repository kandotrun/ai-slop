CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  source_path TEXT,
  ip_hash TEXT NOT NULL,
  user_agent_hash TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  error TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email_created_at ON contact_messages(email, created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_ip_created_at ON contact_messages(ip_hash, created_at);
