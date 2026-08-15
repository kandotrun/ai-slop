# AGENTS.md

## OVERVIEW

`src/client/admin` は `/app/` 管理SPAの本体です。認証、route/state、API client、upload/detail/billing/review画面をここで扱います。

## STRUCTURE

| Path | Role |
| --- | --- |
| `AdminApp.tsx` | 認証ゲート、browser history同期、サイト/統計/課金/ログ取得、pending claim処理 |
| `api.ts` | `/api/*` typed client。`fetchJson<T>` と `ApiClientError` の境界 |
| `routes.ts` | `/app/`、`/app/upload`、`/app/billing`、`/app/sites/:id/:tab` の唯一のroute契約 |
| `format.ts` | 日付、bytes、status/auth/expiry/tool label、slug/host表示 |
| `upload.ts` | zip展開、base64 payload化、`index.html` 検出、期限変換 |
| `pending-claim.ts` | anonymous publish後のclaim token保存/読込/失効 |
| `auth/AuthScreen.tsx` | email OTP owner login |
| `screens/UploadScreen.tsx` | 新規公開、slug検証、security warning、agent handoff |
| `screens/DetailScreen.tsx` | site設定、差し替え、revision restore、auth/log/comment tabs |
| `screens/ReviewCommentsPanel.tsx` | review iframe、postMessage、comment pins |

## CONVENTIONS

- API通信は `api.ts` に追加し、画面から直接 `fetch` を増やしません。
- `/api/*` は `fetchJson<T>` 経由で `credentials: "same-origin"` を維持します。
- API失敗は `ApiClientError` か `errorMessageJa` に寄せ、画面固有の握り潰しを増やしません。
- URL shapeは `routes.ts` に閉じます。screen componentでpathname文字列を組み立てません。
- 表示用派生値は `format.ts`、upload変換は `upload.ts`、claim storageは `pending-claim.ts` に寄せます。
- `AdminApp.tsx` はroute/state/data refreshの接続点です。画面固有ロジックをここへ戻しません。
- `useEffect` はbootstrap、history listener、debounced validation、iframe bridge、API refreshの境界だけに置きます。
- `ReviewCommentsPanel` はiframe origin、message type、pin再描画をセットで確認します。
- `UploadScreen` と `DetailScreen` のslug availabilityはdebounce、current site id、normalized slugの扱いを揃えます。

## ANTI-PATTERNS

- `App.tsx` や `LandingPage.tsx` にadmin stateを漏らしません。
- preview HTMLをadmin iframe以外の同origin実行として扱いません。
- `api.ts` のresponse shapeを `unknown` で狭めずに画面へ流しません。
- `ReviewCommentsPanel` の `postMessage` をorigin/type checkなしで処理しません。
- pending claim tokenをURL hash/localStorageに残し続けません。

## VERIFY

```bash
npm run typecheck
npm test -- --run
npm run build
```
