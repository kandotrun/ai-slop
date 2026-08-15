# DESIGN — ギガサイト便 UI ガイドライン

**方向性:** Shadcn の構造 × Bootstrap 2 の質感で、**レトロかわいい**UI。
**基調:** ブランドのインディゴ `#4f46e5` を主役に光沢化（B＝バランス案）。

**単体で完結するデザインシステム解説ページ（再利用・配布用）**: [`docs/design/design-system.html`](docs/design/design-system.html)。トークン・コンポーネント・使い方を1枚に収め、外部依存なしで他プロジェクトへ持ち込めます。ギガサイト便のデモHTML配布（`/demo/giga-site-demo.html`）にも同じものを使用しています。
コンポーネント単体のサンプル: [`docs/design/ui-sample.html`](docs/design/ui-sample.html)（ブラウザで開く）。

---

## 1. 原則

- **使いやすさ最優先** — 質感だけ変える。レイアウト・遷移・コピー・情報設計は変えない。
- **やわらかい立体感** — 上明→下暗の微グラデ＋上端ハイライト＋やわらか影で「ぷくっと」させる。ギラつかせない（premium 寄り）。
- **色非依存のグロー** — 光沢は白/黒オーバーレイで表現し、塗り色（インディゴ/赤/緑/灰/白）に依存しない。`background:` ショートハンドは使わない（`background-image` のグラデが消えるため）。
- **アクセシビリティ** — フォーカスリング常時表示、コントラスト 4.5:1 以上、`prefers-reduced-motion` で transition 抑制。
- **2系統のスコープ** — 管理画面は `.forge` namespace（`ds-*` / `gs-*`、OKLCH トークン）。LP は `--lp-*` トークン。互いに干渉させない。
- **タイポ** — Geist / Geist Mono を維持（Bootstrap 2 の Helvetica には寄せない）。

## 2. パレット / トークン

### forge（`src/client/styles/tokens.css`、`.forge` スコープ）

| トークン | 値 | 用途 |
| --- | --- | --- |
| `--primary` | `oklch(0.51 0.23 277)` ≈ `#4f46e5` | primary アクション（**黒→インディゴに変更**） |
| `--primary-foreground` | `oklch(0.985 0 0)` 白 | primary 上の文字 |
| `--ac` | `var(--primary)` | アクティブ/メーター/リンク強調（インディゴに統一） |
| `--ring` | `color-mix(in oklab, var(--primary) 70%, white)` | フォーカスリング（インディゴ寄り） |
| `--secondary` | `oklch(0.97 0 0)` 淡灰 | secondary ボタン |
| `--success` | `oklch(0.59 0.13 163)` 緑 | 公開中・成功 |
| `--warning` | `oklch(0.7 0.16 70)` 黄 | 警告・下書き |
| `--destructive` | `oklch(0.577 0.245 27.325)` 赤 | 削除・危険 |
| `--border` | `oklch(0.922 0 0)` | 枠線 |

### LP（`src/client/styles.css`、`--lp-*`）

| トークン | 値 |
| --- | --- |
| `--lp-accent` | `#4f46e5` |
| `--lp-accent-strong` | `#4338ca` |
| `--lp-accent-soft` | `#eef0ff` |
| `--lp-border` | `#e8e8f0` |

## 3. 立体感プリミティブ（共通値）

```css
/* 上端ハイライト（ベベル） */
--bevel-top: inset 0 1px 0 0 rgba(255, 255, 255, 0.6);
/* well のへこみ */
--inset-well: inset 0 2px 5px rgba(40, 40, 80, 0.07);
/* 影スケールは既存の --shadow-xs / sm / md / lg を流用 */
```

光沢オーバーレイの基本形（塗り色に重ねる）:

```css
background-image: linear-gradient(
  to bottom,
  rgba(255, 255, 255, 0.22),
  rgba(255, 255, 255, 0) 45%,
  rgba(0, 0, 0, 0.18)
);
```

## 4. コンポーネント・レシピ

### 4.1 ボタン（実装済み）

塗り色は `background-color`、光沢は `background-image` + `box-shadow`。primary は `--primary` 変更で自動的にインディゴ光沢になる。

```css
.ds-btn--default-v,
.ds-btn--secondary,
.ds-btn--destructive {
  background-image: linear-gradient(to bottom,
    rgba(255,255,255,0.22), rgba(255,255,255,0) 45%, rgba(0,0,0,0.18));
  background-repeat: no-repeat;
  box-shadow:
    inset 0 0 0 1px rgba(0,0,0,0.22),
    inset 0 1px 0 0 rgba(255,255,255,0.45),
    0 1px 2px rgba(0,0,0,0.18),
    0 2px 6px -1px rgba(0,0,0,0.12);
}
/* hover=明るく＋影拡大、active=押し込み（inset影＋translateY(1px)）。 */
```

白/アウトラインボタンは白地用に微グラデ＋上端ハイライト＋ドロップ影（`.ds-btn--outline` / `.lp-btn-outline` 実装済み）。

### 4.2 パネル / カード

```css
.ds-card { /* 既存 */
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--card);
  box-shadow: var(--shadow-sm), 0 4px 14px -6px rgba(40,40,80,0.12);
}
.ds-card__head {
  background-image: linear-gradient(to bottom, #ffffff, color-mix(in oklab, var(--primary) 4%, #fff));
  box-shadow: var(--bevel-top);
  border-bottom: 1px solid var(--border);
}
```

### 4.3 well（へこんだ補助パネル・新規）

```css
.ds-well, .gs-well {
  background: color-mix(in oklab, var(--muted) 60%, #fff);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--inset-well);
  padding: 14px 16px;
}
```

### 4.4 テーブル（ゼブラ・角丸枠）

```css
.gs-thead { background: color-mix(in oklab, var(--muted) 70%, #fff); }
.gs-row:nth-child(even),
.gs-drow:nth-child(even) { background: color-mix(in oklab, var(--primary) 3%, #fff); }
/* モバイルは data-label のスタックカード化を維持（responsive 実装済み）。 */
```

### 4.5 バッジ / ピル

```css
.badge-pill {
  border-radius: 999px;
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(0,0,0,0.10));
  box-shadow: var(--bevel-top);
}
/* 色: 公開中=success, 下書き=neutral, 認証方式=primary など。 */
```

### 4.6 アラート（重要度別）

```css
.ds-alert { border-radius: var(--radius-lg); box-shadow: var(--bevel-top); border: 1px solid; }
.ds-alert--info    { background: linear-gradient(#eef5fd,#dcebfb); border-color:#bcd9f5; color:#1f5a8f; }
.ds-alert--success { background: linear-gradient(#eef8ef,#dcf0de); border-color:#bfe3c2; color:#2f7d33; }
.ds-alert--warning { background: linear-gradient(#fff8e6,#ffeec0); border-color:#f2d790; color:#7a5a12; }
.ds-alert--danger  { background: linear-gradient(#fdeeed,#fbdcd9); border-color:#f3bdb7; color:#9a3328; }
```

### 4.7 入力 / セレクト / スイッチ

```css
.ds-input, .ds-select {
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.07);
}
.ds-input:focus-visible, .ds-select:focus-visible {
  border-color: var(--primary);
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.05),
              0 0 0 3px color-mix(in oklab, var(--primary) 22%, transparent);
}
/* スイッチ ON = var(--primary)。 */
```

### 4.8 ナビ / アクティブ状態

```css
.gs-nav-item.is-active, .gs-tab.is-active {
  background-image: linear-gradient(to bottom,
    color-mix(in oklab, var(--primary) 12%, #fff),
    color-mix(in oklab, var(--primary) 6%, #fff));
  box-shadow: var(--bevel-top), inset 0 -1px 0 color-mix(in oklab, var(--primary) 18%, transparent);
}
```

## 5. レスポンシブ / モーション

- 既存のレスポンシブ（`@media (max-width: 640px)`：サイドバーのドロワー化、統計2列、テーブルのカード化）を壊さない。
- `@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }` を尊重。

## 6. やらないこと

- レイアウト/遷移/文言の変更、フォント変更、`success`/`warning` の新ボタン variant 追加、ダークモード、origin 分離の変更。
