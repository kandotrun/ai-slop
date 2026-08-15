<h1>
  <img src="./public/ギガサイト便.svg" alt="ギガサイト便" width="260" />
</h1>

AIで作ったHTML/zipを、認証付きURLで安全に共有するCloudflareベースのサービスです。

このリポジトリには **Vite React + Hono + Cloudflare Workers + R2 + D1** のアプリ実装と、一般化した設計・運用ドキュメントを置いています。productionのCloudflare ID、secret、事業KPI、非公開の事業資料は含みません。

## いまの結論

- Next.jsではなく、**Vite React管理画面 + Hono API on Cloudflare Workers** で始める。
- 管理画面と公開HTMLは **必ず別origin** にする。
- R2にユーザーアップロード済み静的ファイル、D1にsite/revision/auth/log/billing系メタデータを持つ。
- MVPは「Vercel代替」ではなく、**AI生成HTMLを安全に見せる共有URL発行サービス** に絞る。

## Docs

- [DESIGN.md](./DESIGN.md) — UIデザインシステム
- [docs/architecture/cloudflare-architecture.md](./docs/architecture/cloudflare-architecture.md) — Cloudflare構成とデータ設計
- [docs/architecture/security-model.md](./docs/architecture/security-model.md) — 任意HTMLホスティングのセキュリティ方針
- [docs/runbooks/deploy.md](./docs/runbooks/deploy.md) — ローカル検証とCloudflare deploy手順
- [SECURITY.md](./SECURITY.md) — 脆弱性の報告方法
- [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) — 同梱フォントのライセンス
- [LICENSE](./LICENSE) — Apache License 2.0
- [AGENTS.md](./AGENTS.md) — 今後のエージェント向け作業ルール

## Initial stack decision

```txt
Frontend: Vite + React + Tailwind
Backend: Hono on Cloudflare Workers
Hosting: Cloudflare Workers + Workers Assets
Storage: Cloudflare R2
Database: Cloudflare D1
Email later: Resend or equivalent
Billing later: Stripe
```

## Hostname model

```txt
giga-site.com/app
  管理画面、アップロード、サイト設定、課金、ログ

{siteId}.giga-site.com
  ユーザーが公開したHTML/zip展開後ファイル
```

`giga-site.com/app` と `{siteId}.giga-site.com` はoriginを分離します。アップロードHTMLは任意JavaScriptを含むため、管理画面originで表示しません。

## Development status

初期MVPの縦切り実装があります。

- `/app` で管理画面SPAを配信
- `/api/*` でHono API
- `{siteId}.giga-site.com` またはローカル `/preview/{siteId}/` でR2上のHTMLを配信
- D1 migration、R2保存、共有パスワード認証、簡易アクセスログの土台

## Local setup

```bash
npm ci
cp wrangler.example.jsonc wrangler.jsonc
npm run cf:types
npm run check
npm run cf:dry-run
```

`wrangler.jsonc` はlocal/production固有の設定ファイルとしてgitignoreされています。`wrangler.example.jsonc` のplaceholderを自分のCloudflareリソースに置き換えてください。

## CLI

AIエージェントやCIは、`giga publish` と管理画面APIの主要操作をCLIから実行できます。

```bash
# one-time upload token publish（ログイン不要）
GIGA_UPLOAD_TOKEN=gut_<tokenId>_<uploadSecret> npx @giga-site/cli publish ./dist --json

# 管理画面API操作（メールOTPでログイン）
giga login --email kan@example.com
giga login --code 123456
giga sites list --json
giga publish ./dist --site <siteId> --json
```

CLIは `packages/cli` にあります。管理画面APIは既存のメールOTP sessionを使い、one-time upload token publishも引き続き対応します。

公開リポジトリでは、実装と再現可能な技術ドキュメントだけを管理します。

## License

ソースコードは [Apache License 2.0](./LICENSE) で公開しています。同梱フォントにはSIL Open Font License 1.1が適用されます。詳細は [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) を参照してください。
