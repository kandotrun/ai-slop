# AGENTS.md

## OVERVIEW

`tests` はVitestのrepo-wide test suiteです。source colocatedではなく、feature/subsystem単位で1 fileにまとめます。

## STRUCTURE

| File shape | Use |
| --- | --- |
| `*.test.ts` | Vitest対象。`vitest.config.ts` は `tests/**/*.test.ts` のみ拾う |
| `agent-*.test.ts` | agent setup/upload token flow |
| `*-auth.test.ts` | owner/preview auth helpers and flows |
| `site-*.test.ts` | site input/indexing behavior |
| `routing.test.ts`, `security.test.ts`, `stripe.test.ts` | focused helper/subsystem tests |

## CONVENTIONS

- 共有test setupはありません。必要なfakeはtest file内に置きます。
- `describe` は対象subsystem、`it` はobservable behaviorで書きます。
- API testsは `createApiApp({ sessionResolver })` でowner sessionを注入します。
- D1/R2/Email/Stripeはfile-local fakeで十分なsurfaceだけ実装します。
- fake Envの境界は `unknown` を経由して狭めます。`any` は使いません。
- `vi.stubGlobal` を使ったら、そのfileで `afterEach(() => vi.unstubAllGlobals())` を置きます。
- pure helper testsは入力と戻り値のshapeを直接assertします。
- regression追加時は、壊れたsecurity/auth/origin条件をtest名に出します。
- Node環境のunit/contract/string-render testsが基本です。browser DOM testは実際のbug再現が必要な場合に追加します。

## COVERAGE MAP

| Area | Test files |
| --- | --- |
| Worker/API auth | `owner-auth.test.ts`, `email-auth.test.ts`, `email-otp-auth.test.ts`, `auth-hash.test.ts` |
| Site/revision lifecycle | `site-*.test.ts`, `revision-history.test.ts`, `revision-comments.test.ts` |
| Upload/security | `security*.test.ts`, `upload-zip.test.ts`, `ollama-security.test.ts`, `api-boundary-hardening.test.ts` |
| Routing/preview/SEO | `routing*.test.ts`, `preview-branding.test.ts`, `seo-metadata.test.ts`, `og-image.test.ts` |
| Billing | `stripe*.test.ts`, `billing-dashboard.test.ts`, `billing-ui-copy.test.ts` |
| Client/admin behavior | `admin-*.test.ts`, `pending-claim.test.ts`, `auth-mode-copy.test.ts` |
| Public content | `articles.test.ts`, `legal-pages.test.ts`, `landing-*.test.ts`, `contact.test.ts` |

## ANTI-PATTERNS

- green化のために既存assertionを弱めません。
- 実Cloudflare、実Stripe、実email送信に依存するunit testを書きません。
- fixtureをmodule globalでmutateし続けません。testごとにfresh fakeを作ります。
- generated `worker-configuration.d.ts` のCloudflare API docs文字列をpolicy signalとしてtestしません。

## COMMANDS

```bash
npm test -- --run
npm run typecheck
```
