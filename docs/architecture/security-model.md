# Security Model

## Core threat model

このサービスは任意HTML/zipを受け取り、ブラウザで実行される静的ファイルとして返す。したがって、アップロードされたHTMLは信頼しない。

想定するリスク:

- フィッシングページのホスティング
- 詐欺LP/外部決済リンクへの誘導
- 外部scriptによる悪意ある挙動
- HTML内へのAPIキー/社内情報混入
- zip bomb
- path traversal
- 巨大ファイル/大量ファイルによるR2/D1/CPU負荷
- 管理画面Cookie/localStorageへのアクセス

## Hard rule: origin isolation

```txt
giga-site.com/app
  管理画面。信頼されたアプリコードだけを実行する。

{siteId}.giga-site.com
  ユーザーアップロードHTMLを実行する可能性がある領域。
```

禁止:

- `giga-site.com/app` でアップロードHTMLをiframeなし/同originで表示すること
- 管理画面Cookieを `.giga-site.com` scopeで発行すること
- preview側から管理APIにcookie認証でアクセスできる状態にすること

推奨:

- 管理画面Cookieはhost-onlyで `giga-site.com` 限定。可能なら管理画面用Cookieは `Path=/app`、API用user sessionはCSRF/Origin検証を必須にする。
- preview用session cookieはpreview hostname限定。
- 管理APIはCSRF対策とOrigin検証を入れる。

## R2 access rule

R2 objectをpublic bucketとして直出ししない。必ずWorkerを通す。

Workerが確認するもの:

- siteが存在するか
- siteがactiveか
- expired/deletedではないか
- auth ruleを満たすviewer sessionがあるか
- requested pathがrevision prefix配下か

## Upload validation

### HTML

- 最大サイズ制限
- UTF-8/テキストとして扱えるか確認
- `index.html` 必須
- secretらしき文字列を簡易検知
- 外部フォーム/決済リンク/怪しいscriptを警告

### zip

MVPでは後回し推奨。対応する場合は制限を強くする。

- 最大zipサイズ
- 展開後最大合計サイズ
- 最大ファイル数
- 最大ネスト深度
- path traversal拒否: `../`, absolute path, backslash混在など
- symlink拒否
- 実行系拡張子拒否: `.php`, `.cgi`, `.exe`, `.sh` など
- `index.html` 必須

## Content security posture

preview側で強すぎるCSPを入れると、AI生成HTMLの表示が壊れる可能性がある。MVPでは次を優先する。

- `X-Robots-Tag: noindex`
- `Referrer-Policy: no-referrer`
- `X-Content-Type-Options: nosniff`
- `Content-Type` を拡張子に応じて正しく返す
- 管理画面originとのCookie分離

法人向けには、後でpreview siteごとにCSPモードを選べるようにする余地を残す。

## Auth modes

### Random URL

最も軽いが、URLを知っている人は見られる。無料枠・短期限・noindex前提。

### Password

MVPの中心。password hashだけ保存し、平文は保存しない。

### Email OTP

会社ドメイン認証の土台。OTPは短寿命、試行回数制限、再送制限を入れる。

### Company-domain auth

`@client.co.jp` のメールを受け取れる人だけ閲覧可能にする。Google Workspace管理者権限なしで導入しやすい。

注意: 会社全体に見える可能性があるため、特定チーム/関係者/NDA用途には個別メールallowlistを追加する。

## Abuse mitigation

最低限:

- 作成者ログイン必須
- 無料枠はnoindex
- 通報フォーム
- 怪しい語句/外部フォーム/決済リンク検知
- public公開は制限強め
- 認証付き用途を主軸にする

将来:

- site公開停止フラグ
- abuse report queue
- rate limit
- Turnstile
- reviewer/admin dashboard

## Logging policy

アクセスログは最小限にする。

- IPはhash化して保存する。
- User-Agentも必要ならhash化する。
- 個別閲覧者のメールは、認証に必要な範囲で保存する。
- 法人向け監査ログはプラン別に扱う。

## Public release warning

将来このリポジトリを公開する場合、内部の価格戦略、導入候補、営業文脈、非公開リンクをサニタイズすること。
