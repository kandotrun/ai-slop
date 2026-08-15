# @giga-site/cli

ギガサイト便をAIエージェントやCIから操作するCLIです。`publish` だけでなく、管理画面の主要APIをコマンド化しています。

## インストール

```bash
npx @giga-site/cli --help
# package install後は bin 名 `giga` として使えます
```

## 認証

一回限りアップロードTokenで公開する場合はログイン不要です。

```bash
GIGA_UPLOAD_TOKEN=gut_<tokenId>_<uploadSecret> npx @giga-site/cli publish ./dist --json
```

管理画面APIを使う場合は、メールOTPでログインします。

```bash
giga login --email kan@example.com
# メールの6桁コードを受け取ったら
giga login --code 123456
# hostを変える場合
giga login --email kan@example.com --host https://giga-site.com
```

CLIはsession cookieを `~/.config/giga-site/config.json`（または `GIGA_CONFIG_HOME/config.json`）に `0600` で保存します。リポジトリやログに入れないでください。

## publish

```bash
# one-time token publish
giga publish ./dist --token gut_<tokenId>_<uploadSecret> --json

# logged-in: existing siteへrevision追加
giga publish ./dist --site <siteId> --json

# logged-in: 新規site作成 + 初回revision
giga publish ./dist --title "Demo" --auth password --password "preview-pass" --json

# 送信前確認
giga publish ./dist --token gut_<tokenId>_<uploadSecret> --dry-run --json
```

`<path>` は `index.html` を含む静的ディレクトリ、または単一HTMLファイルです。`--entry <path>` でentry fileを指定できます。

## 管理画面コマンド

```bash
# account / dashboard
giga me --json
giga dashboard --json
giga notifications --json

# sites
giga sites list --json
giga sites get <siteId> --json
giga sites create --title "Demo" --auth password --password "preview-pass" --json
giga sites update <siteId> --slug new-slug --indexing false --json
giga sites renew <siteId> --json
giga sites delete <siteId> --yes --json

# revisions
giga revisions list <siteId> --json
giga revisions preview <siteId> <revisionId> --json
giga revisions restore <siteId> <revisionId> --json

# forms / logs
giga forms list <siteId> --json
giga forms get <siteId> <submissionId> --json
giga forms csv <siteId>
giga events <siteId> --json

# review comments
giga comments list <siteId> [--revision <revisionId>] --json
giga comments create <siteId> --revision <revisionId> --body "修正お願いします" --json
giga comments update <siteId> <commentId> --status resolved --json
giga comments delete <siteId> <commentId> --yes --json

# billing
giga billing status --json
giga billing invoices --json
giga billing payment-method --json
giga billing checkout --plan pro
giga billing portal

# utility
giga slugs check demo --json
giga agent-token create --title "Agent upload" --auth password --password "preview-pass" --json
giga logout
```

破壊的操作（site/comment delete）は `--yes` 必須です。状態変更APIにはCLIが `Origin` とsession cookieを付けます。

## 除外されるファイル

CLIは `.git/`, `node_modules/`, `.env`, `.env.*`, `.dev.vars`, `.wrangler/`, `wrangler.jsonc`, common key/cert/log extensions を送信しません。サーバー側でもHTML/security scanを実行しますが、Tokenや秘密情報はリポジトリやログに残さないでください。

## License

Apache License 2.0. See [`LICENSE`](./LICENSE) and [`NOTICE`](./NOTICE).
