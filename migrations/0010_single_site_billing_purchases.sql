CREATE TABLE IF NOT EXISTS billing_site_purchases (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT,
  owner_email TEXT,
  stripe_customer_id TEXT,
  stripe_checkout_session_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL,
  unit_amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  site_quota INTEGER NOT NULL DEFAULT 1,
  used_site_count INTEGER NOT NULL DEFAULT 0,
  livemode INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_billing_site_purchases_checkout_session_id ON billing_site_purchases(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_billing_site_purchases_owner_user_id ON billing_site_purchases(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_billing_site_purchases_customer_id ON billing_site_purchases(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_billing_site_purchases_status ON billing_site_purchases(status);
