# AGENTS.md

## OVERVIEW

`docs` はarchitecture、security、runbook、design referenceの仕様源です。実装判断で迷ったらrootのSOURCE PRIORITY順に読みます。

## STRUCTURE

| Path | Role |
| --- | --- |
| `architecture/cloudflare-architecture.md` | Vite React + Hono Workers、D1/R2、origin/routing、deploy model |
| `architecture/security-model.md` | origin isolation、R2 access、upload validation、auth/logging posture |
| `runbooks/deploy.md` | local verification、D1 setup、production deploy |
| `design/*.html` | hand-authored visual references |

## CONVENTIONS

- `architecture/*.md` と `runbooks/deploy.md` は、実装・運用が変わったときだけ更新します。
- 事業戦略、価格仮説、KPI実績、顧客情報、将来ロードマップをこの公開リポジトリに置きません。
- 一時的な実装計画やエージェント作業ログを `docs/` に残しません。
- deploy手順は `docs/runbooks/deploy.md`、`.github/workflows/ci-deploy.yml`、`wrangler.example.jsonc` を照合します。production configはrepo外です。
- 価格戦略、営業先、顧客情報、KPIレポート、productionのCloudflare ID、内部URL、secret値、非公開の事業文脈をcommitしません。
- design referenceは `docs/design/*.html` が手編集対象です。design tool exportはrepo外で管理します。

## ANTI-PATTERNS

- 公開済みのarchitecture/security contractをimplementation convenienceで書き換えません。
- security modelをコードの現状に合わせて弱めません。コード側を直すか、明示的な設計変更として扱います。
- deploy/runbookにsecret値、account token、callback codeを載せません。
- `docs/` を汎用メモ置き場にしません。
