# PROJECT KNOWLEDGE BASE

## OVERVIEW

`ギガサイト便` は、AIで作った静的HTML/zipを認証付きpreview URLとして共有するCloudflare Workersサービスです。

現在の実装は Vite React SPA、Hono Worker API、Workers Assets、R2、D1、Cloudflare Email、Stripe接続stubで構成します。Next.jsは採用しません。

## STRUCTURE

| Path | Role |
| --- | --- |
| `src/client` | `/app/` 配下の管理SPAとLP。詳細は `src/client/AGENTS.md` |
| `src/client/admin` | 管理SPAの認証、route/state、各画面、API client。詳細は `src/client/admin/AGENTS.md` |
| `src/worker` | Worker entry、Hono API、preview配信、D1/R2/auth/Stripe。詳細は `src/worker/AGENTS.md` |
| `src/shared` | client/worker共有の型、入力正規化、安全スキャン、agent handoff。詳細は `src/shared/AGENTS.md` |
| `packages/cli` | `@giga-site/cli`。AIエージェント/CI向けpublishと管理画面API操作CLI |
| `tests` | Vitestのfeature/unit tests。詳細は `tests/AGENTS.md` |
| `migrations` | D1 SQL migrations。番号順に追加し、既存migrationを書き換えない |
| `docs` | architecture/security/runbook/design reference。迷ったときの仕様源。詳細は `docs/AGENTS.md` |
| `worker-configuration.d.ts` | `wrangler types` 生成物。手書きしない |

## SOURCE PRIORITY

1. `README.md`
2. `docs/architecture/cloudflare-architecture.md`
3. `docs/architecture/security-model.md`
4. `docs/runbooks/deploy.md`
5. `DESIGN.md`
6. この `AGENTS.md`

迷ったらMVPを狭く保ち、安全なorigin分離を優先します。

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| Runtime routing | `src/worker/index.ts`, `src/worker/preview-routing.ts` | app/API/preview hostname分岐 |
| Management API | `src/worker/api.ts`, `src/worker/db.ts` | Hono routes、D1 mapping、R2 revision保存、billing、anonymous publish、agent upload |
| Preview auth/rendering | `src/worker/preview.ts`, `src/worker/user-auth.ts`, `src/worker/auth-hash.ts` | viewer sessionとowner loginは別物 |
| Upload validation | `src/shared/security.ts`, `src/shared/site-input.ts` | client/workerで同じ契約を使う |
| Agent-facing setup | `src/shared/agent-handoff.ts` | `/agents.txt` と one-time upload token |
| UI flow | `src/client/App.tsx`, `src/client/LandingPage.tsx`, `src/client/admin/AdminApp.tsx` | root/LP/legal/contact/admin分岐。admin詳細は `src/client/admin/AGENTS.md` |
| Styling | `src/client/styles.css`, `src/client/styles/tokens.css`, `src/client/styles/app.css` | LP/global、Forge tokens、admin app CSS |
| Static public pages | `src/shared/articles.ts`, `src/shared/seo.ts`, `src/shared/landing-static.ts`, `src/shared/support-static.ts` | Worker-injected SEO/static HTML |
| Contact/security side effects | `src/worker/contact.ts`, `src/worker/security-ai.ts`, `src/worker/anonymous-publish-rate-limit.ts` | email、AI upload review、anonymous rate limit |
| Deploy | `wrangler.jsonc`, `.github/workflows/ci-deploy.yml`, `docs/runbooks/deploy.md` | config sourceは `wrangler.jsonc` |

## CODE MAP

| Symbol/File | Type | Location | Role |
| --- | --- | --- | --- |
| `fetch` default export | Worker handler | `src/worker/index.ts` | API、assets、preview host、SEO/static shellを分岐 |
| `createApiApp` | Hono app factory | `src/worker/api.ts` | 管理API control plane。tests用に `sessionResolver` を差し替え可能 |
| `handlePreviewRequest` | Worker handler | `src/worker/preview.ts` | D1 auth/site check後にR2 objectを返す |
| `buildCheckoutSessionParams` / webhook helpers | Stripe helpers | `src/worker/stripe.ts` | checkout、webhook、billing state mapping |
| `handleContactSubmission` | Worker helper | `src/worker/contact.ts` | contact form validation、rate limit、email送信 |
| `scanUploadWithAiSecurity` | Worker helper | `src/worker/security-ai.ts` | redacted HTMLをAI reviewしwarningへ変換 |
| `normalizeSiteInput` / `normalizeAuthInput` | shared validators | `src/shared/site-input.ts` | create/update/auth入力の標準化 |
| `validateUploadedHtml` / `normalizeR2Path` | shared validators | `src/shared/security.ts` | HTML validation、warning scan、R2 path safety |
| `buildAgentSetupManifest` | shared manifest builder | `src/shared/agent-handoff.ts` | public agent API情報を生成 |
| `renderStaticArticleHtmlForPathname` | static renderer | `src/shared/articles.ts` | article route HTMLをWorkerへ供給 |
| `App` | React surface | `src/client/App.tsx` | root/contact/legal/adminの薄いrouter |
| `AdminApp` | React surface | `src/client/admin/AdminApp.tsx` | admin auth、route/state、data refreshの中心 |
| `LandingPage` | React surface | `src/client/LandingPage.tsx` | root LPとanonymous publish導線 |

## CONVENTIONS

- GitHub PR/issueは `gh` コマンドで取得します。
- npmを使います。`package-lock.json` が唯一のlockfileです。
- TypeScriptは `strict: true`、`moduleResolution: "Bundler"`、`jsx: "react-jsx"` です。
- `any` は使いません。テストfakeの境界も `unknown` から狭めます。
- 新規コメントは書きません。既存コメントを増やさず、名前と小さい関数で意図を表します。
- `useEffect` は極力避けます。必要な場合は既存のfetch/bootstrap境界に閉じます。
- Cloudflare bindingsは `wrangler.jsonc` と `worker-configuration.d.ts` を基準にします。手書き `Env` に寄せません。
- `ctx.waitUntil()` を使う場合、`ctx` をdestructureしません。
- request-scoped stateをmodule globalに置きません。
- floating promiseを残しません。
- secretsは `.dev.vars` または `wrangler secret put` に置き、repoに書きません。
- docs上の技術方針は Tailwind を含みますが、現状UIは `src/client/styles.css` 中心です。Tailwind導入は明示的な作業として扱います。

## CRITICAL SECURITY RULES

- 管理画面と公開HTMLを同じoriginにしません。
- アップロードHTMLを `giga-site.com/app` や管理SPA originで表示しません。
- 管理画面Cookieをpreview側に送りません。
- preview cookieはhost-only、短寿命、scope最小にします。
- R2 objectを公開bucketとして直出ししません。必ずWorkerでsite状態、期限、auth、revision prefixを確認して返します。
- HTML/zip uploadはsize、拡張子、path traversal、zip bomb、secretらしき文字列、怪しい外部form/payment/scriptを検査します。
- 無料枠と初期MVPは `noindex` が基本です。protected previewはindexing toggleよりnoindexを優先します。

## NON-GOALS FOR MVP

- サーバーサイドコード実行
- npm build代行
- DB付きアプリ実行
- フォーム送信機能
- カスタムドメイン
- SAML / Entra ID / Google Groups連携
- 複雑なチーム権限管理

## COMMANDS

```bash
npm run typecheck
npm test -- --run
npm run build
npm run check
npm run cf:types
npm run cf:dry-run
git diff --check
```

`npm run cf:dry-run` はVite build後に `CI=1 wrangler deploy --dry-run` を実行します。本番deploy前は `docs/runbooks/deploy.md` を確認します。

## PUBLIC REPOSITORY BOUNDARY

このリポジトリはpublicです。価格戦略、営業先、非公開の事業文脈、顧客情報、KPIレポート、productionのCloudflare ID、内部URL、secret値をcommitしません。

productionの `wrangler.jsonc` はrunner上の `$HOME/.config/ai-slop/wrangler.jsonc` に置き、repoには `wrangler.example.jsonc` だけを置きます。生成レポートとdesign tool exportはrepo外で管理します。
