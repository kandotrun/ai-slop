CREATE TABLE IF NOT EXISTS billing_plan_trials (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT,
  owner_email TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_checkout_session_id TEXT,
  plan_id TEXT NOT NULL,
  livemode INTEGER NOT NULL DEFAULT 0,
  first_seen_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_billing_plan_trials_owner_plan ON billing_plan_trials(owner_user_id, plan_id) WHERE owner_user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_billing_plan_trials_customer_plan ON billing_plan_trials(stripe_customer_id, plan_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_billing_plan_trials_subscription_id ON billing_plan_trials(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;

INSERT OR IGNORE INTO billing_plan_trials (
  id, owner_user_id, owner_email, stripe_customer_id, stripe_subscription_id,
  stripe_checkout_session_id, plan_id, livemode, first_seen_at, updated_at
)
SELECT
  id || ':team_trial',
  owner_user_id,
  owner_email,
  stripe_customer_id,
  stripe_subscription_id,
  stripe_checkout_session_id,
  plan_id,
  livemode,
  created_at,
  updated_at
FROM billing_subscriptions
WHERE plan_id = 'team';
