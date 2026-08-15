# AGENTS.md

## OVERVIEW

`src/shared` はbrowserとWorkerの両方から読む契約層です。型、入力正規化、安全スキャン、agent handoffをここに置きます。

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| Public types | `types.ts` | auth mode、site/revision/log/dashboard/API error |
| Site input | `site-input.ts` | title、slug、auth mode、domain、expiryの正規化 |
| Upload security | `security.ts` | HTML validation、warning scan、R2 path normalization、content-type |
| Agent handoff | `agent-handoff.ts` | `/agents.txt`、manifest、copy prompt |
| Article/public routes | `articles.ts`, `articles-data.ts`, `articles-meta.ts` | full article data、client-safe summaries、static article rendering |
| SEO/static HTML | `seo.ts`, `landing-static.ts`, `support-static.ts`, `legal.ts` | route metadata、robots/sitemap、LP/contact/legal static HTML |
| Shared flows | `anon-publish.ts`, `billing-flags.ts`, `plans.ts` | anonymous claim contract、billing preparing state、plan limits |

## CONVENTIONS

- Runtime依存を薄くします。React、Hono、D1、R2、Cloudflare Email、Stripeはimportしません。
- 外部入力は `unknown` から始め、型guardかnormalize関数で狭めます。
- 失敗はthrowより `{ ok: false, error }` の `Result` へ寄せます。
- string literal unionはtestsとAPI responseに出るため、rename時は全呼び出し元を更新します。
- security warningは検知漏れより誤検知を許容しますが、uploadを止めるvalidationとは分けます。
- `normalizeR2Path` はWorkerのR2 key安全性に直結するため、client都合で緩めません。
- agent-facing promptは安全制約を短く明示し、能力を実装済みより広く書きません。
- `articles-data.ts` はfull content、`articles-meta.ts` はclient bundle向けsummaryです。bundle weight都合の分割を崩しません。
- SEO/public route metadataは `seo.ts`、legal route listは `legal.ts` に寄せます。
- anonymous publish/claimのstorage key、TTL、response shapeは `anon-publish.ts` をsourceにします。

## ANTI-PATTERNS

- shared層にrequest-scoped state、DB access、network fetchを入れません。
- `any` でAPI payloadを通しません。
- agent handoffにログイン突破、有料コンテンツ取得、秘密情報抽出を許す文言を足しません。
- upload pathで `..`、空segment、backslashを許しません。
- public static rendererで管理画面専用stateやsecretを参照しません。
- article full datasetをLP client bundleへ直接importしません。

## VERIFY

```bash
npm run typecheck
npm test -- --run
```
