import type { ArticleSummary } from "./articles-meta";

export const LANDING_ARTICLE_SUMMARIES: ArticleSummary[] = [
  {
    slug: "html-share",
    path: "/articles/html-share",
    title: "HTMLファイルをURLで共有する方法",
    description: "HTMLファイルをURLにして共有する代表的な方法を、メール添付・本格デプロイ・一時URL共有の3つで比較。AI生成HTMLをすぐ見せたいときの選び方も解説します。",
    category: "HTML共有",
    updatedAt: "2026-06-21"
  },
  {
    slug: "ai-html-security",
    path: "/articles/ai-html-security",
    title: "AI生成HTMLを安全に共有する方法",
    description: "AIが生成したHTMLを社内外に共有する前に確認したい、外部送信・APIキー混入・フォーム送信先・認証設定のチェックポイントと、公開前スキャンの仕組み化を解説します。",
    category: "セキュリティ",
    updatedAt: "2026-06-21"
  },
  {
    slug: "password-protected-preview",
    path: "/articles/password-protected-preview",
    title: "パスワード付きHTMLプレビューを共有する方法",
    description: "クライアント確認や社内レビューでHTMLプレビューにパスワードをかける理由、パスワードの安全な渡し方、公開期限との組み合わせ、共有メッセージの例文を紹介します。",
    category: "認証共有",
    updatedAt: "2026-06-21"
  }
];
