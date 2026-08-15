CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  livemode INTEGER NOT NULL DEFAULT 0,
  api_version TEXT,
  received_at TEXT NOT NULL,
  processed_at TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_type ON stripe_webhook_events(type);
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_received_at ON stripe_webhook_events(received_at);
CREATE INDEX IF NOT EXISTS idx_stripe_webhook_events_status ON stripe_webhook_events(status);

CREATE TABLE IF NOT EXISTS billing_subscriptions (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT,
  owner_email TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_checkout_session_id TEXT,
  plan_id TEXT,
  status TEXT NOT NULL,
  current_period_end TEXT,
  cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
  livemode INTEGER NOT NULL DEFAULT 0,
  latest_invoice_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_owner_user_id ON billing_subscriptions(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_customer_id ON billing_subscriptions(stripe_customer_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_billing_subscriptions_subscription_id ON billing_subscriptions(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_status ON billing_subscriptions(status);
