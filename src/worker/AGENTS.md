# AGENTS.md

## OVERVIEW

`src/worker` はCloudflare Worker runtimeです。Hono API、Workers Assets routing、preview auth/rendering、D1/R2 accessをここで扱います。

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| Request routing | `index.ts` | `/api/*`、`/app/*`、preview hostname、local `/preview/:slug` |
| API routes | `api.ts` | site CRUD、revision upload、agent upload token、auth、billing、anonymous publish、review comments |
| Preview serving | `preview.ts` | D1状態確認、viewer session、R2 fetch、headers |
| Host/path helpers | `preview-routing.ts` | production hostとlocal preview pathのslug解決 |
| D1 row mapping | `db.ts` | `SiteRow` とsummary変換 |
| Owner login | `user-auth.ts` | email OTP login for management console |
| Password hashing | `auth-hash.ts` | preview password hash/verify |
| Stripe | `stripe.ts` | config/test/checkout/webhook。secret値は返さない |
| Contact form | `contact.ts` | validation、rate limit、hashed IP/UA、Cloudflare Email |
| AI upload review | `security-ai.ts` | secret redaction、HTML truncation、Ollama JSON review |
| Anonymous publish limit | `anonymous-publish-rate-limit.ts` | hour/day bucket reservation |

## CONVENTIONS

- `Env` は `worker-configuration.d.ts` 由来として扱い、手書き定義を増やしません。
- `fetch(request, env, ctx)` の `ctx` はdestructureしません。
- Hono appは `createApiApp()` で作り、testsでは `sessionResolver` を差し替えます。
- D1は `env.DB.prepare(...).bind(...).first/run/all` の形に揃えます。
- R2 keyは `sites/{siteId}/revisions/{revisionId}/{path}` のprefixを維持します。
- upload前に `src/shared/site-input.ts` と `src/shared/security.ts` の正規化/検査を通します。
- API error bodyは `{ error, details? }` のshapeにします。
- access log、email、Stripeなどの副作用promiseはawaitするか `ctx.waitUntil()` に明示的に渡します。
- Cookie生成はpreview authとowner authの境界を混ぜません。
- `api.ts` はcontrol planeです。upload、billing、anonymous publish、agent tokenを触る時は該当helperへ切り出せるか先に確認します。
- contact formではraw IP/User-Agentを保存せず、hash化された値だけをD1へ入れます。
- AI security reviewへ渡すHTMLは `redactLikelySecretsForReview` とtruncationを通します。
- Stripe webhookはsignature verificationとmode判定を弱めません。

## ANTI-PATTERNS

- preview hostnameで管理APIや管理SPAを露出しません。
- R2 objectをWorker checkなしで返しません。
- admin cookieをpreview hostnameで読めるscopeにしません。
- protected previewをindexableにしません。
- module globalにrequest/user/site固有stateを置きません。
- Cloudflare REST APIをWorker内から叩いてbindingの代替にしません。
- Stripe secret、email OTP、upload token secretをResponse JSONやlogに出しません。
- contact honeypot、rate limit、anonymous publish limitをUI都合で迂回しません。
- AI review unavailableを安全判定として扱いません。

## VERIFY

```bash
npm run typecheck
npm test -- --run
npm run build
npm run cf:dry-run
```
