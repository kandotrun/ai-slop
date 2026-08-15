# Deploy Runbook

## Local verification

Create a local config from the public placeholder file, then run the checks:

```bash
npm ci
cp wrangler.example.jsonc wrangler.jsonc
# Replace the placeholder R2/D1 values for your own Cloudflare account.
npm run cf:types
npm run check
npm run cf:dry-run
```

`wrangler.jsonc` is gitignored. `npm run cf:dry-run` builds the Vite client and runs `wrangler deploy --dry-run` with `CI=1`; it does not publish the Worker.

## PageSpeed Insights gate

PageSpeed runs only when repository variable `PAGESPEED_ENABLED=true` and secret `PAGESPEED_INSIGHTS_API_KEY` are both configured. Fork pull requests and Dependabot pull requests do not receive the secret and skip this job. The target is `https://giga-site.com/` after the normal verify job.

Local dry-run without calling Google:

```bash
PAGESPEED_DRY_RUN=1 npm run pagespeed:check
```

The workflow currently checks the mobile performance score with `PAGESPEED_MIN_PERFORMANCE=70` and uploads `pagespeed-results/summary.md` as an artifact.

## React Doctor PR gate

Pull requests also run React Doctor after the normal verify job. The CI command is pinned to `react-doctor@0.5.8` via `scripts/react-doctor-ci-check.mjs` and fails unless React Doctor returns exactly `100/100` with zero warnings and zero errors. The project-level `doctor.config.json` scopes React Doctor to the real React surface under `src/client`.

Local check:

```bash
npm run react-doctor:check
```

The gate requests the React Doctor score, parses the JSON report, emits GitHub Actions error annotations for any diagnostics, and exits non-zero if `score !== 100`, `warningCount > 0`, or `errorCount > 0`.

## Local D1 setup

```bash
# Use the D1 database name configured in wrangler.jsonc.
npx wrangler d1 migrations apply <D1_DATABASE_NAME> --local
npm run dev:worker -- --port 8797
```

Smoke examples:

```bash
curl http://127.0.0.1:8797/api/health
curl http://127.0.0.1:8797/api/auth/bootstrap
# /api/sites and other management APIs require an app user session.
```

## Cloudflare resources for first real deploy

Create the resources first. Put the returned production account/database IDs, routes, and bindings in a private config outside the repository:

```bash
mkdir -p "$HOME/.config/ai-slop"
install -m 600 wrangler.example.jsonc "$HOME/.config/ai-slop/wrangler.jsonc"
# Edit the private copy, then create/apply your resources with that config.
npx wrangler r2 bucket create <R2_BUCKET_NAME> --config "$HOME/.config/ai-slop/wrangler.jsonc"
npx wrangler d1 create <D1_DATABASE_NAME> --config "$HOME/.config/ai-slop/wrangler.jsonc"
npx wrangler d1 migrations apply <D1_DATABASE_NAME> --remote --config "$HOME/.config/ai-slop/wrangler.jsonc"
```

DNS / route model for `giga-site.com`:

```txt
giga-site.com/app      -> service/admin SPA
giga-site.com/api/*    -> Hono API
*.giga-site.com/*      -> preview sites
```

Use a proxied wildcard DNS record for `*.giga-site.com` and a Worker route such as `*.giga-site.com/*`. Because `{siteId}.giga-site.com` is first-level wildcard under the root domain, it fits Cloudflare Universal SSL better than `{siteId}.preview.giga-site.com`.

Do not commit `.dev.vars`, `wrangler.jsonc`, API tokens, account/database IDs, production routes, customer data, or secret values.

## App user auth setup

The management console uses email one-time codes on Cloudflare D1 plus the Cloudflare Email Service binding. There is no password or first-owner bootstrap flow.

```bash
npx wrangler d1 migrations apply <D1_DATABASE_NAME> --remote
```

`/api/auth/request-code` sends a 6-digit login code, and `/api/auth/verify-code` creates the user on first successful verification. Sender domain onboarding for `EMAIL_FROM` must be complete before production email delivery works.

## Stripe test setup

Stripe Checkout is wired through server-side Worker endpoints. Store both keys as Worker secrets; do not write secret values to `wrangler.jsonc` or source files.

```bash
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_PUBLISHABLE_KEY
```

Verification endpoints:

```bash
curl https://giga-site.com/api/billing/stripe/config
curl -X POST https://giga-site.com/api/billing/stripe/test
```

The config endpoint returns only booleans/mode/warnings and never returns raw key values. The test endpoint calls Stripe's balance API and returns a sanitized result.

## Production deploy

The public repository never stores production Wrangler configuration. The self-hosted deploy job copies `$HOME/.config/ai-slop/wrangler.jsonc` into the workspace with mode `0600`, deploys, and removes the temporary copy. The job is disabled unless repository variable `DEPLOY_ENABLED=true`.

For an approved manual deploy on the production runner:

```bash
npm run check
install -m 600 "$HOME/.config/ai-slop/wrangler.jsonc" .wrangler.production.jsonc
npm run build
CI=1 npx wrangler deploy --dry-run --config .wrangler.production.jsonc
npx wrangler d1 migrations apply ai-slop --remote --config .wrangler.production.jsonc
npx wrangler deploy --config .wrangler.production.jsonc
rm -f .wrangler.production.jsonc
```

Never print or upload the private config. Confirm the temporary copy is absent after success or failure.

## Current MVP caveats

- Management console login is email OTP based. Preview sharing auth remains separate: random URL, shared password, and company-domain OTP viewer sessions.
- Stripe is currently connected in test mode only. Webhooks, subscription persistence, entitlement checks, custom domains, and abuse-review flows are still future work.
