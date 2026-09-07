# 運営ダッシュボード

運営ダッシュボードは、既存の管理ログインを使って公開状況と登録状況を読む専用画面です。
`OPERATOR_EMAILS` が未設定または空なら、全員のアクセスを拒否します。

## アクセス設定

`wrangler.example.jsonc` の `OPERATOR_EMAILS` と `OPS_INTERNAL_EMAILS` は空のまま公開します。
実際のアドレスは、リポジトリ外の本番設定またはローカルの未追跡 `.dev.vars` にだけ保存します。
Cloudflare上の設定変更とデプロイは、別途承認を得て既存の [デプロイ手順](deploy.md) に従って実施します。
この機能の追加だけでは本番にアクセス権を付与しません。

- **OPERATOR_EMAILS**：運営画面を利用できるメールアドレスのカンマ区切りリスト。
- **OPS_INTERNAL_EMAILS**：集計から除外する追加の内部アカウントのカンマ区切りリスト。アクセス権は付与しません。

両設定とも前後の空白を除去し、小文字化した完全なメールアドレスで比較します。
ドメイン指定、ワイルドカード、メールアドレスの部分一致では権限を付与しません。
`OPERATOR_EMAILS` のアドレスも内部集計の除外対象になります。

利用者は通常のメールOTPログインを完了する必要があります。
サーバーは、Cookieのハッシュに一致する未失効セッション、ユーザーの `email_verified = 1`、許可リストへの一致を確認します。
ブラウザーから送られたユーザーID、メールヘッダー、クエリ指定は認可に使いません。
ログイン直後のレスポンスと `/api/me` の `user.isOperator` はUI表示用であり、API側の認可を代替しません。

## API

| GETエンドポイント | 応答 |
| --- | --- |
| `/api/ops/summary?period=yesterday` | `OperatorSummary` |
| `/api/ops/sites?period=30d&q=&offset=0&limit=25` | `OperatorPage<OperatorSite>` |
| `/api/ops/users?period=30d&q=&offset=0&limit=25` | `OperatorPage<OperatorUser>` |

共有型は `src/shared/operator.ts` にあります。
未ログインは401、ログイン済みで権限がなければ403を返し、集計SQLは実行しません。
不正なクエリは400、更新メソッドは405、集計取得失敗は詳細を伏せた500です。
運営APIと `/api/me`、OTP確認応答には、エラーを含めて `Cache-Control: private, no-store` と `Vary: Cookie` を付けます。

一覧は作成日時、IDの降順で安定ソートします。
`limit` は1〜100（既定25）、`offset` は0〜1,000,000、`q` は200文字以内です。
重複した既知のパラメーター、不正な整数、NUL文字を拒否します。
サイト検索はタイトル、slug、所有者のメールと名前、ユーザー検索はメールと名前が対象です。
`%`、`_`、バックスラッシュはリテラルとして扱い、検索語はSQLにバインドします。

## 期間と集計定義

`period` は `yesterday`、`7d`、`30d`、`all` のいずれかで、省略時は `30d` です。
昨日は日本標準時（`Asia/Tokyo`）の前日00:00以上、当日00:00未満です。
7日と30日は、リクエスト時刻を基準とする直近の連続した日数で、下限を含み上限を含みません。
`all` は保存された全履歴を集計します。
応答の `from`、`to`、`generatedAt` はUTCのISO日時です。

日別グラフは日本標準時の日付でゼロ埋めします。
7日と30日の両端は部分日になりうるため、日付の行数はそれぞれ最大8行、31行です。
`all` のKPIは全履歴ですが、日別グラフは当日を含む直近90日以内に制限します。
一覧の期間フィルターはサイトとユーザーの作成日時にかかり、一覧内の閲覧数と公開回数は取得時点までの累計です。

| フィールド | 定義 |
| --- | --- |
| `registeredUsers` | 取得時点までに作成された登録ユーザー数。期間フィルター外の総数 |
| `newUsers` | 期間内に `users.created_at` がある登録ユーザー数 |
| `publishedSites` | 保存されている最初のrevision作成日時（サイトごとの `MIN(revisions.created_at)`）が期間内にあり、現在のrevisionが存在するサイト数。匿名を含み、内部を除外 |
| `anonymousSites` | 上記のうち、現在の所有者が予約ユーザー `anon-public` のサイト数。人数ではない |
| `registeredSites` | 上記のうち、登録ユーザー所有のサイト数 |
| `activeCreators` | 期間内にrevisionが作成された公開済みサイトの、登録所有者の重複なし件数 |
| `previewViews` | 公開済みサイトの期間内の `access_events.event_type = 'view'` 件数。認証成功や失敗は除外 |
| `liveSites` | 取得時点の公開中サイト総数。現在のrevisionが存在し、初回公開が取得時点未満、未削除、statusがactive、期限内または無期限 |
| `paidSubscriptions` | 取得時点の `livemode = 1` かつ `status = 'active'` の登録所有者のサブスクリプション件数 |
| `returningCreators` | 期間内の異なる日本標準時の日付で2日以上revisionを作成した、登録所有者の重複なし件数 |

登録指標からは `anon-public`、`.invalid` の予約ドメインや不正なメール形式のシステム行、明示的な内部アドレスを除外します。
タイトル中の `test` や、無関係なメール部分文字列で実利用を除外しません。
ユーザー一覧には内部アカウントとシステム行を `internal` として表示しますが、`anon-public` は表示しません。

`users.created_at` を登録の根拠にするため、再ログインでも発生する `signup_completed` を新規登録として数えません。
無料トライアル、Stripeテストモード、解約済みサブスクリプションは有料契約数に含めません。
有料契約数はD1に同期された状態の件数であり、入金済み請求書や売上を示すものではありません。

公開集計の対象は、同じサイトに属する現在のrevisionが存在し、保存されている最初のrevision作成日時が `generatedAt` 未満のサイトです。
新規公開ページ数と日別の `sites` は、この初回公開日時を期間判定と日本標準時の日付に使います。
サイト作成日時や現在のrevision作成日時は使わず、古い下書きの初回公開を計上し、差し替えで過去の公開日を移動させません。
再投稿やrevisionの復元は新規公開ページ数を増やさず、`activeCreators` と `returningCreators` の投稿活動に含めます。
論理削除された公開済みサイトは、現在のrevisionが存在する限り過去の公開件数に残ります。
物理削除済みの履歴は復元できず、最初のrevisionを削除すると、残っている最古のrevision日時に集計基準が変わります。
一覧の `fileCount` と `totalBytes` は現在のrevision、ユーザーの `siteCount` は公開済みサイト総数、`lastPublishedAt` は最後のrevision作成日時です。
revisionの復元操作も新しいrevisionを作るため、投稿活動に含まれます。

所有者と内部区分は現在の状態を使います。
匿名サイトの引き取りや内部アドレス設定の変更によって、過去期間の区分も変わります。
閲覧には本人の確認やボットが含まれうるため、訪問者数、ユニーク人数、利用者の成長率とは区別します。
複数の読み取りSQLは同じ時刻境界を使いますが、同時更新下の厳密な履歴スナップショットを保証するものではありません。

## 読み取り専用と個人情報

運営APIはD1のSELECTだけを使い、データ更新、R2取得、メール送信、Stripeへの問い合わせを行いません。
ログインそのものは、既存のOTP消費とセッション作成を行います。
集計ではrevisionと閲覧イベントをそのまま多対多JOINせず、件数の増幅を避けます。
既存の所有者、revision、閲覧時刻の索引を利用し、一覧の応答は最大100行に制限します。
スキーマ変更はありません。

レスポンスにHTML本文、パスワード、ハッシュ、Cookie、セッショントークン、生IP、R2キー、Stripe識別子を含めません。
ユーザー一覧のメールは運営認可後にだけ返し、サイト一覧の所有者メールはマスクします。
ユーザー入力のタイトルや名前は文字列として表示し、HTMLとして挿入しません。
取得した個人情報や実績を公開リポジトリ、テストfixture、スクリーンショットへ転記しません。

サイトへのリンクは、検証済みの単一DNSラベルのslugと `PREVIEW_HOST_SUFFIX` から作る通常の公開URLだけです。
不正なslugやホスト設定、未公開、期限切れ、削除済みのサイトではリンクを空文字にします。
認証や有効期限を回避するパラメーターを発行せず、管理origin内のiframeでアップロードHTMLを表示しません。

## ローカル検証

```bash
npm test -- --run tests/operator-api.test.ts tests/owner-auth.test.ts
npm run typecheck
npm test -- --run
npm run build
git diff --check
```

バックエンドテストはNode 22の `node:sqlite` を使い、全migrationを適用したメモリー内DBで実SQLを実行します。
外部サービスや本番データは使わず、読み取り検証では `PRAGMA query_only = ON` も適用します。
Nodeの実験的SQLiteに関する警告が出る場合があります。

環境型はWranglerで生成します。
今回の変更では `--config wrangler.example.jsonc --include-runtime false` の生成結果から環境宣言だけを更新し、既存のruntime宣言を維持しています。
通常の全面再生成は、runtime宣言の差分も確認してから採用してください。

本番設定をローカル開発へコピーしないでください。
Wranglerによる手動確認が必要なら、外部bindingを無効にしたローカル専用設定と合成データを用意します。
このテスト手順にデプロイ、remote D1操作、実メール送信は含まれません。
