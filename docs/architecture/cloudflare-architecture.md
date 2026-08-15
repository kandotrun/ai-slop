# Cloudflare Architecture

## Decision

MVPは **Vite React + Hono on Cloudflare Workers** で作る。

Next.jsは現時点では採用しない。理由は、管理画面中心のMVPではSSR/RSC/ISRの恩恵が薄く、OpenNext adapterやNext固有のビルド/キャッシュ/Edge制約が初速と保守を重くするため。

HonoだけでHTML管理画面を作る案も避ける。drag & drop、設定フォーム、ログ一覧、課金導線など管理画面はリッチになるため、UIはVite Reactに寄せる。

## High-level topology

```txt
Cloudflare Workers
  Hono API
  Workers Assetsで管理画面SPAを配信

Vite + React
  管理画面
  HTMLアップロード
  サイト設定
  ログ表示

R2
  アップロードされたHTML/CSS/画像/zip展開後ファイル

D1
  users
  sites
  revisions
  auth_rules
  viewer_sessions
  access_events / counters

別origin
  giga-site.com/app              管理画面
  {siteId}.giga-site.com 公開HTML
```

## Hostname routing

単一Worker MVPの場合:

```txt
request hostnameで分岐

giga-site.com/app
  管理画面SPA

giga-site.com/api/*
  Hono API

giga-site.com/app/*
  Vite build済みassets

*.giga-site.com
  認証チェック
  D1でsite/revision/auth_rule確認
  R2からファイル取得
  HTML/CSS/画像を返す
```

将来分割する場合:

```txt
app-worker
  管理画面 + API

preview-worker
  公開HTML配信専用

共有
  D1
  R2
```

MVPでは1 Workerで十分。ただしcookieとoriginは必ず分離する。

## R2 object layout

案:

```txt
sites/{siteId}/revisions/{revisionId}/index.html
sites/{siteId}/revisions/{revisionId}/assets/{path}
```

単一HTMLだけなら最初はこれでもよい。

```txt
sites/{siteId}/revisions/{revisionId}/index.html
```

zip対応時はpath traversalを正規化し、許可された相対pathだけ保存する。

## D1 schema draft

### users

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### sites

```sql
CREATE TABLE sites (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  auth_mode TEXT NOT NULL DEFAULT 'password',
  password_hash TEXT,
  allowed_email_domains TEXT,
  expires_at TEXT,
  current_revision_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT,
  FOREIGN KEY (owner_user_id) REFERENCES users(id)
);
```

`allowed_email_domains` はMVPではJSON文字列でもよい。後で正規化する。

### revisions

```sql
CREATE TABLE revisions (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  r2_prefix TEXT NOT NULL,
  entry_path TEXT NOT NULL DEFAULT 'index.html',
  file_count INTEGER NOT NULL DEFAULT 1,
  total_bytes INTEGER NOT NULL DEFAULT 0,
  content_sha256 TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (site_id) REFERENCES sites(id)
);
```

### viewer_sessions

```sql
CREATE TABLE viewer_sessions (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  auth_method TEXT NOT NULL,
  email TEXT,
  email_domain TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (site_id) REFERENCES sites(id)
);
```

### access_events

```sql
CREATE TABLE access_events (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  path TEXT NOT NULL,
  event_type TEXT NOT NULL,
  created_at TEXT NOT NULL,
  ip_hash TEXT,
  user_agent_hash TEXT,
  FOREIGN KEY (site_id) REFERENCES sites(id)
);
```

## API draft

```txt
GET    /api/health
GET    /api/agent/setup
GET    /api/sites
POST   /api/sites
GET    /api/sites/:siteId
PATCH  /api/sites/:siteId
DELETE /api/sites/:siteId
POST   /api/sites/:siteId/revisions
GET    /api/sites/:siteId/access-summary
POST   /api/preview/:siteId/password-session
POST   /api/preview/:siteId/email-otp/request
POST   /api/preview/:siteId/email-otp/verify
```

AI agent discovery endpoints:

```txt
GET /agents.txt
GET /.well-known/giga-site-agent.json
```

Preview hostname配下はAPIではなく、通常pathとしてR2のファイルを返す。

## Wrangler expectations

- `wrangler.jsonc` を使う。
- `compatibility_date` は新しめにする。
- `compatibility_flags` に `nodejs_compat` を入れる。
- `observability.enabled` を有効化する。
- R2/D1はbindings経由で使う。
- secretsは `wrangler secret put` / `.dev.vars`。リポジトリに入れない。

## Deployment model

当面はWorkersへdeployする。Pagesは使わない。

理由:

- Workers AssetsでSPAとWorker APIを同じdeploy unitにできる。
- R2/D1 bindingsをWorkerから直接扱える。
- preview hostnameの認証ゲートも同じランタイムで扱える。

## Local verification once implemented

```bash
npm run typecheck
npm run test
npm run build
npx wrangler types
npx wrangler deploy --dry-run
```
