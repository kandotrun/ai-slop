# AGENTS.md

## OVERVIEW

`src/client` は `/app/` 管理SPAとroot LPのReact実装です。アップロード済みHTMLはここで実行しません。

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| SPA boot | `main.tsx` | `#root` に `App` をmount。`styles.css`/`styles/tokens.css`/`styles/app.css` を読み込む |
| Route split | `App.tsx` | `/` は `LandingPage`、それ以外は `admin/AdminApp` に振り分けるだけの薄いrouter |
| Admin shell/state | `admin/AdminApp.tsx`, `admin/AGENTS.md` | 認証ゲート・画面ルーティング・データ取得・`Sidebar`/`Topbar` |
| Admin screens | `admin/screens/{Dashboard,Upload,Detail,Billing}Screen.tsx` | 各画面。`admin/api.ts`(型付きclient)、`admin/format.ts`、`admin/upload.ts` を使う |
| UI primitives | `ui/*.tsx` | Forge `ds-*` の薄いReap wrapper + `ui/icons.tsx`(Lucide inline SVG) |
| Landing page | `LandingPage.tsx` | root LP。`lp-*` クラスを使用 |
| Styling | `styles.css` / `styles/tokens.css` / `styles/app.css` | `styles.css`=グローバルreset + LP `lp-*`、`tokens.css`=`.forge` design token + Geist self-host、`app.css`=`ds-*` primitive + `gs-*` admin layout |

## CONVENTIONS

- Vite baseは `/app/` です。root `/` はWorker経由でLP/SPA assetに解決されます。
- API callは同originの `/api/*` に寄せ、`credentials: "same-origin"` を保ちます。
- response shapeはlocal interfaceで型を置き、`fetchJson<T>` に渡します。
- zipはclient側で `fflate` の `unzipSync` を使い、bundle uploadはbase64 file listへ変換します。
- UI表示用の派生値は小さいpure functionか `useMemo` に寄せます。
- `useEffect` は新規fetch/bootstrapが避けられない場合だけ使います。
- 状態名と表示文言は `src/shared/types.ts` の `AuthMode`、`SiteSummary`、`DashboardStats` に合わせます。
- 管理画面スタイルは vanilla CSS で `.forge` にscopeします（LPの `:root` token と衝突させない）。Tailwind化は別作業です。
- 管理画面の新規スタイルは `styles/app.css`(`ds-*`/`gs-*`)に足します。`styles.css` の旧管理画面クラスは撤去済みなので、そこには戻しません。
- admin配下だけを触る場合は `admin/AGENTS.md` も読みます。
- design tool exportはrepo外です。production UIは `src/client/**` と `docs/design/*.html` を編集します。

## ANTI-PATTERNS

- preview HTMLをReact内で同origin表示しません。必ずpreview URLへ逃がします。
- upload token、Stripe publishable config以外のsecretをclient stateやDOMに出しません。
- `any`、暗黙のJSON shape、catchして握り潰すだけのUI処理を足しません。
- 画面ロジックは `admin/screens/*` と `admin/{api,format,upload}.ts` の境界に沿って小さく保ちます（`App.tsx` には戻さない）。

## VERIFY

```bash
npm run typecheck
npm test -- --run
npm run build
```
