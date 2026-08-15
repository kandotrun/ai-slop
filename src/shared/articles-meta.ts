export const ARTICLES_INDEX_PATH = "/articles";

// Lightweight article metadata for the client bundle (landing teaser + routing).
// Full bodies (sections/faqs) live in articles-data.ts and are server-rendered only,
// so they never ship in the client SPA bundle. Generated alongside articles-data.ts.
export interface ArticleSummary {
  slug: string;
  path: string;
  title: string;
  description: string;
  category: string;
  updatedAt: string;
}

export const ARTICLE_SUMMARIES: ArticleSummary[] = [
  {
    "slug": "html-share",
    "path": "/articles/html-share",
    "title": "HTMLファイルをURLで共有する方法",
    "description": "サーバー不要でHTMLをすぐに見てもらいたい方へ。URLを発行するだけで相手がブラウザから確認できる方法を、選択肢の比較と手順とともにわかりやすく解説します。",
    "category": "HTML共有",
    "updatedAt": "2026-06-27"
  },
  {
    "slug": "ai-html-security",
    "path": "/articles/ai-html-security",
    "title": "AI生成HTMLを安全に共有する方法",
    "description": "AIが生成したHTMLには意図しないスクリプトやキーが紛れ込むことがあります。共有前に何を確認し、どう対処すればリスクを下げられるかを具体的に整理しました。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-27"
  },
  {
    "slug": "password-protected-preview",
    "path": "/articles/password-protected-preview",
    "title": "パスワード付きHTMLプレビューを共有する方法",
    "description": "制作中のページを手軽に見てもらいながら第三者への流出を防ぎたい方向けに、パスワード付きプレビューの仕組みと設定手順を順を追って解説します。",
    "category": "認証共有",
    "updatedAt": "2026-06-26"
  },
  {
    "slug": "zip-site-publish",
    "path": "/articles/zip-site-publish",
    "title": "ZIPサイトをそのまま公開する方法",
    "description": "CSS・画像・JSを含むサイト一式をそのままZIPで公開したい方へ。index.htmlの配置ルールからアップロード後の確認ポイントまで、崩れずに公開する手順を解説します。",
    "category": "ZIP公開",
    "updatedAt": "2026-06-26"
  },
  {
    "slug": "internal-lp-review",
    "path": "/articles/internal-lp-review",
    "title": "社内レビュー用にLPを一時公開する方法",
    "description": "LP確認はスクショのやり取りより実物URLのほうが断然速い。制作途中のページを社内レビュー専用に一時公開し、終わったら確実に閉じる方法と運用のコツをまとめました。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "github-pages-vercel-netlify-comparison",
    "path": "/articles/github-pages-vercel-netlify-comparison",
    "title": "GitHub Pages・Vercel・Netlifyとギガサイト便の違い",
    "description": "GitHub Pages・Vercel・Netlifyの本番向き用途と、ギガサイト便の一時共有・レビュー用途を比較。初回共有から本番移行まで、目的別に選び方を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "email-auth-preview",
    "path": "/articles/email-auth-preview",
    "title": "メール認証でHTMLを限定共有する方法",
    "description": "「この人にだけ見せたい」HTMLを安全に届けたい方へ。指定メールアドレスへのワンタイム認証で本人確認してから閲覧させる仕組みと設定手順を解説します。",
    "category": "認証共有",
    "updatedAt": "2026-06-26"
  },
  {
    "slug": "company-domain-auth-share",
    "path": "/articles/company-domain-auth-share",
    "title": "会社ドメイン認証で社内限定にHTMLを公開する方法",
    "description": "会社のメールドメインを持つ社員だけがアクセスできるHTML共有を実現したい方向けに、ドメイン単位のアクセス制限の考え方と具体的な設定ステップを紹介します。",
    "category": "認証共有",
    "updatedAt": "2026-06-27"
  },
  {
    "slug": "set-link-expiry",
    "path": "/articles/set-link-expiry",
    "title": "公開URLに有効期限を設定して確認用ページを自動で閉じる方法",
    "description": "確認用ページの消し忘れが心配な方へ。公開URLに有効期限を設定しておけば指定日時に自動で閲覧できなくなり、管理の手間がなくなります。設定方法と活用例をまとめました。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "replace-html-same-url",
    "path": "/articles/replace-html-same-url",
    "title": "同じURLのままHTMLを差し替える方法 - リンクを送り直さず中身だけ更新する",
    "description": "修正のたびに新しいリンクを送り直す手間を省きたい方へ。URLを変えずにHTMLの中身だけを更新するための考え方と、つまずきやすいポイントを丁寧に整理します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "noindex-html-share",
    "path": "/articles/noindex-html-share",
    "title": "HTMLを検索に出さずに共有する方法｜noindexの限界と確実な非公開術",
    "description": "noindexで検索に出さない共有を検討している方向け。検索除外でできること・できないこと、認証や期限を組み合わせる判断基準を実務目線で整理します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-26"
  },
  {
    "slug": "serverless-html-publish",
    "path": "/articles/serverless-html-publish",
    "title": "サーバーを借りずにHTMLを公開する方法",
    "description": "レンタルサーバーの契約やデプロイ設定に時間を取られたくない方へ。ファイルを置くだけでHTMLを公開URLにできる方法と、見せる相手を絞る手順を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-chatgpt-html",
    "path": "/articles/share-chatgpt-html",
    "title": "ChatGPTで作ったHTMLを共有する方法と相手にそのまま見せるコツ",
    "description": "ChatGPTに作らせたHTMLをコードではなくブラウザで見えるURLとして共有したい方へ。保存・ZIP化・安全チェック・レビュー指摘の戻し方まで具体的に整理します。",
    "category": "AI活用",
    "updatedAt": "2026-06-27"
  },
  {
    "slug": "share-claude-artifacts",
    "path": "/articles/share-claude-artifacts",
    "title": "ClaudeのアーティファクトHTMLを共有する方法",
    "description": "Claudeが作ったHTMLをコピペやスクリーンショットではなくブラウザで動く状態のまま相手に届けたい人向け。URLとして共有するまでの具体的な手順を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-27"
  },
  {
    "slug": "share-v0-ui",
    "path": "/articles/share-v0-ui",
    "title": "v0で生成したUIをURLで共有する方法",
    "description": "v0で生成したUIをコードではなく見た目で確認してもらいたい方へ。共有URLを発行して関係者に届け、フィードバックをもらうまでの手順と、閲覧範囲を絞るコツを整理します。",
    "category": "AI活用",
    "updatedAt": "2026-06-27"
  },
  {
    "slug": "ai-landing-page-review",
    "path": "/articles/ai-landing-page-review",
    "title": "AIで作ったLPをレビュー用に共有する方法",
    "description": "AIで作ったLPを公開前に上司やクライアントに確認してもらいたい方へ。HTMLをそのまま認証付きURLに変えてレビューを回す方法と、よくある表示崩れへの対処をまとめました。",
    "category": "AI活用",
    "updatedAt": "2026-06-27"
  },
  {
    "slug": "ai-html-slide-share",
    "path": "/articles/ai-html-slide-share",
    "title": "AIで作ったHTMLスライド資料を共有する方法",
    "description": "AIが生成したHTMLスライドをファイル添付せずに相手へ届けたい方へ。意図どおりの見た目のままURLとして共有し、スムーズに確認してもらうまでの手順を説明します。",
    "category": "AI活用",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "designer-client-preview",
    "path": "/articles/designer-client-preview",
    "title": "デザイナーがクライアントに確認URLを送る方法",
    "description": "デザイナーがクライアントに確認URLを送る方法の実務手順を、共有前の準備、レビュー依頼文、認証/期限設定、差し替え運用まで整理します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "freelance-deliverable-preview",
    "path": "/articles/freelance-deliverable-preview",
    "title": "フリーランスが納品物を共有・確認してもらう方法｜HTML成果物をクライアントに見せる手順",
    "description": "納品前のHTMLをクライアントに手間なく確認してもらい、承認や修正をスムーズに進めたいフリーランス向けに、成果物を安全に共有するための具体的な手順と注意点を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "engineer-demo-share",
    "path": "/articles/engineer-demo-share",
    "title": "エンジニアがデモ用HTMLを素早くチームに共有する方法",
    "description": "デモHTMLをチームにすぐ見せたいのに毎回サーバーへのアップが面倒な方へ。静的ファイルを認証付きURLで素早く共有し、必要な範囲だけに届ける手順を整理します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "marketing-lp-stakeholder-review",
    "path": "/articles/marketing-lp-stakeholder-review",
    "title": "マーケがキャンペーンLPを関係者レビューに回す方法",
    "description": "キャンペーンLPを法務・営業・上長など複数の関係者へ一括で確認依頼したいマーケター向けに、HTML を認証付きURLとして素早く配布し、安全に回覧する運用方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "portfolio-share-recruiter",
    "path": "/articles/portfolio-share-recruiter",
    "title": "ポートフォリオHTMLを採用担当にURLで共有する方法",
    "description": "苦労して作ったポートフォリオも渡し方次第で正しく表示されないことがあります。HTMLやZIP形式の作品をURLひとつで採用担当者に届け、評価につなげるための方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "images-not-showing",
    "path": "/articles/images-not-showing",
    "title": "公開後に画像だけ表示されないときの原因と直し方",
    "description": "ページは開けるのに画像だけ枠になってしまう、その原因の多くはパスのずれです。よくある原因を順に切り分け、その場で直せる手順まで一気に整理しました。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-27"
  },
  {
    "slug": "google-drive-html-share",
    "path": "/articles/google-drive-html-share",
    "title": "Google DriveでHTMLを共有できない理由と、認証付きURLで届ける方法",
    "description": "DriveにHTMLを置いたのにページが表示されずコードが開いてしまう現象に困った人向け。仕様による制限の理由と、認証付きURLで正しく届ける代替手段を解説する。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "codepen-vs-url-share",
    "path": "/articles/codepen-vs-url-share",
    "title": "CodePen・JSFiddleとの違い｜コード共有との使い分け",
    "description": "CodePenやJSFiddleはコードを動かしながら共有するのに向いています。完成したHTML一式をそのままの見た目でURLとして渡したい場面との使い分け方をわかりやすく比較します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-authenticated-url",
    "path": "/articles/what-is-authenticated-url",
    "title": "認証付きURLとは？仕組みと安全な使いどころをやさしく解説",
    "description": "「認証付きURL」という言葉は聞いたことがあっても仕組みがよく分からない方へ。パスワード・メール認証・ドメイン制限それぞれの違いと、安全な使いどころをやさしく整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "confidential-html-secure-share",
    "path": "/articles/confidential-html-secure-share",
    "title": "社外秘のHTMLを安全に共有する方法",
    "description": "社外秘HTMLをメール添付や知っている人だけ閲覧可のリンクで共有している方へ。漏えいリスクを下げながら届けるための考え方と、認証・期限を活用した具体的な手順を整理します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-27"
  },
  {
    "slug": "mobile-display-check-share",
    "path": "/articles/mobile-display-check-share",
    "title": "スマホ表示を実機で確認してもらうHTML共有方法",
    "description": "PCのデベロッパーツールではなく実機で確認してもらいたい方へ。相手のスマホでそのまま開ける共有URLを発行し、表示崩れや動作を正確にチェックしてもらう方法を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dropbox-html-share-comparison",
    "path": "/articles/dropbox-html-share-comparison",
    "title": "DropboxでHTMLを共有する場合との違い",
    "description": "DropboxにHTMLを置いて共有したらソースコードが表示されてしまった、という方へ。Dropboxの仕様上の限界を理解したうえで、Webページとして届けるための代替手順を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "quick-html-share-3-seconds",
    "path": "/articles/quick-html-share-3-seconds",
    "title": "3秒でHTMLを共有する最短手順｜登録不要でURL発行",
    "description": "完成したHTMLをとにかく今すぐ誰かに見てもらいたい方へ。ファイルをドロップするだけで数秒のうちに共有URLを発行できる最短手順と、匿名公開時の注意点をまとめました。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-gemini-html",
    "path": "/articles/share-gemini-html",
    "title": "Geminiで作ったHTMLを共有URLにする方法",
    "description": "Geminiに作らせたHTMLをコードのままではなく、相手がURLを開くだけで見られる形にしたい方へ。生成物を共有URLに変える手順と、見せる相手を絞るコツを具体的に解説します。",
    "category": "AI活用",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "share-cursor-html",
    "path": "/articles/share-cursor-html",
    "title": "Cursorで生成したHTMLを共有する方法",
    "description": "CursorでできたHTMLを「とりあえず誰かに見せたい」けどデプロイ設定でつまずいている方へ。ローカルファイルやZIPをそのまま共有URLに変える方法と公開期限の考え方を整理します。",
    "category": "AI活用",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "share-bolt-new-app",
    "path": "/articles/share-bolt-new-app",
    "title": "bolt.newで作ったアプリをURLで共有する方法",
    "description": "bolt.newの成果物を開発画面ではなく整った状態で関係者に渡したい方へ。書き出したファイルをURL一本で共有し、公開範囲と期間まで整える手順を非エンジニア向けに説明します。",
    "category": "AI活用",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "share-replit-html",
    "path": "/articles/share-replit-html",
    "title": "Replitで作ったHTMLを外部に共有する方法",
    "description": "ReplitのプレビューURLをそのまま外部に渡すときの落とし穴を知りたい方へ。静的なHTML/CSS/JSを認証付き共有URLとして安全に届けるための具体的な手順を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "chatgpt-canvas-share",
    "path": "/articles/chatgpt-canvas-share",
    "title": "ChatGPT Canvasの成果物を共有する方法",
    "description": "ChatGPT Canvasで作ったHTMLをコードではなく、相手の画面で正しく表示される形で渡したい方へ。Canvasの成果物を共有URLとして届け、見せる相手まで絞る方法を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-figma-make",
    "path": "/articles/share-figma-make",
    "title": "Figma Makeの出力をURLで共有する方法",
    "description": "Figma MakeのWebページを「URLを送るだけ」で誰かに確認してもらいたい方へ。出力ファイルの取り出し方から認証付き共有URLの発行までを順を追って解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ai-mockup-share",
    "path": "/articles/ai-mockup-share",
    "title": "AIで作ったモックアップを共有して反応を得る方法",
    "description": "AIでさっと作ったUIモックアップを関係者に見せてフィードバックを集めたい方へ。相手が迷わず開けるURLの発行方法と、見せる範囲を絞りながら意見を集めるコツを整理します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ai-report-share",
    "path": "/articles/ai-report-share",
    "title": "AIが生成したレポートHTMLを関係者に共有する方法",
    "description": "AIが作った分析レポートHTMLを社内やクライアントへ安全に届けたい方へ。ファイル添付の崩れや無制限公開のリスクを避けながら、認証付きURLで共有する方法を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ai-prototype-feedback",
    "path": "/articles/ai-prototype-feedback",
    "title": "AI製プロトタイプのフィードバックを集める共有方法",
    "description": "AIツールで作ったプロトタイプをレビューしてもらいたいのに見せ方でつまずいている方へ。共有URLを発行して必要な相手だけに届け、修正サイクルを早める方法を具体的に説明します。",
    "category": "AI活用",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "vibe-coding-share",
    "path": "/articles/vibe-coding-share",
    "title": "バイブコーディングで作ったHTMLを共有する方法",
    "description": "AIと対話しながらノリで作ったHTMLを、サーバー設定なしにすぐ誰かへ見せたい方へ。バイブコーディングの成果物を共有URLとして公開する手順と注意点をまとめました。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-resume",
    "path": "/articles/share-html-resume",
    "title": "HTML職務経歴書をURLで共有する方法",
    "description": "HTMLで整えた職務経歴書をメール添付ではなくURLひとつで採用担当者に届けたい方へ。表示崩れを防ぎながら共有リンクを発行し、閲覧範囲を絞る方法を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-invoice",
    "path": "/articles/share-html-invoice",
    "title": "HTML見積書・請求書を取引先に安全に共有する方法",
    "description": "HTMLで作った見積書・請求書を取引先に安全かつ見やすく届けたい方へ。崩れや無制限閲覧のリスクを避けながら、認証付きURLでHTML帳票を共有する考え方と手順を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-email-template",
    "path": "/articles/share-html-email-template",
    "title": "HTMLメールテンプレートのプレビューを関係者に共有する方法",
    "description": "配信前のHTMLメールを関係者にプレビュー確認してもらいたいのに転送すると崩れてしまう方へ。テンプレートを正確なまま届けて確認・承認までスムーズに進める方法を整理します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-dashboard",
    "path": "/articles/share-html-dashboard",
    "title": "HTMLダッシュボードを関係者に安全に共有する方法",
    "description": "HTMLで組んだダッシュボードをメール添付せず関係者にきれいに見せたい方へ。サーバー不要で認証付き共有URLを発行し、数値更新後も同じリンクで届ける方法を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-game",
    "path": "/articles/share-html-game",
    "title": "HTML5ゲームを共有する方法",
    "description": "完成したHTML5ゲームをサーバー設定なしで遊んでもらいたい方へ。ファイルをまとめてアップロードするだけで起動URLを作る方法と、公開範囲を調整するコツを解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-quiz",
    "path": "/articles/share-html-quiz",
    "title": "HTMLで作った診断・クイズを共有URLで公開する方法",
    "description": "HTMLで作った診断・クイズをデプロイ設定なしにすぐ試してもらいたい方へ。ファイルをそのまま共有URLにして配る手順と、公開後のアクセス管理のポイントをまとめました。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-event-page",
    "path": "/articles/share-html-event-page",
    "title": "イベント告知HTMLを関係者・参加者に共有する方法",
    "description": "イベント告知HTMLをサーバー構築なしで関係者チェックから参加者への告知まで使い回したい方へ。認証付きURLで安全に配布し、本番公開まで一気に進める共有の流れを解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-menu",
    "path": "/articles/share-html-menu",
    "title": "店舗のHTMLメニューをURL・QRで共有する方法",
    "description": "紙メニューの刷り直しをなくし、HTMLメニューをQRコードでお客様のスマホに表示したい店舗オーナー向けに、URL・QR発行から価格更新時の運用まで具体的な手順を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-data-viz-html",
    "path": "/articles/share-data-viz-html",
    "title": "データ可視化HTMLを共有する方法｜グラフ入りページを安全に関係者へ届ける",
    "description": "グラフやチャートを含むデータ可視化HTMLを見せたい相手にだけ届けたい方へ。認証付き共有URLで安全かつ手軽に公開する方法と、よくあるつまずきへの対処をまとめました。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-prototype",
    "path": "/articles/share-html-prototype",
    "title": "HTMLプロトタイプを共有してテストする方法｜認証付きURLでユーザー確認まで完結",
    "description": "HTMLプロトタイプをファイル送付なしで触ってもらいたい方へ。相手の環境に左右されない共有URLで届けてフィードバックを集め、修正サイクルをスムーズに回す方法を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "sales-proposal-share",
    "path": "/articles/sales-proposal-share",
    "title": "営業がHTML提案書を見込み客に共有する方法",
    "description": "HTMLで作り込んだ提案書を見込み客へスムーズに届けたい営業担当向け。メール添付の容量制限やレイアウト崩れで悩む方が、URLひとつで共有し閲覧者・公開期間まで管理できるかを判断できます。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "agency-client-review",
    "path": "/articles/agency-client-review",
    "title": "制作会社のクライアントレビューを、共有URLで効率よく回す方法",
    "description": "制作会社のディレクターやデザイナーが、クライアントへの確認依頼を何往復もせずに完結させたいときに役立つ記事。認証付き共有URLを使ったレビューフローの全体像と手順を確認できます。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pm-spec-prototype-share",
    "path": "/articles/pm-spec-prototype-share",
    "title": "PMが仕様プロトタイプを共有する方法 — 認証付きURLで関係者にすばやく確認してもらう",
    "description": "認識ずれをなくしたいPMが、動くプロトタイプをサーバー不要で関係者へ届ける方法を解説。認証・公開期限の使い分けまで含め、確認サイクルを短縮できるかを見極めるための記事です。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "qa-bug-repro-share",
    "path": "/articles/qa-bug-repro-share",
    "title": "QAがバグ再現HTMLを開発に素早く共有する方法",
    "description": "「手元では再現しない」と差し戻されがちなQA担当向け。バグ再現HTMLをURLで渡すことで開発者がクリック一発で同じ画面を確認できる仕組みと、共有手順を具体的に説明します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "teacher-material-share",
    "path": "/articles/teacher-material-share",
    "title": "教員がHTML教材を生徒に共有する方法とURL配布の手順",
    "description": "HTML形式で作った授業スライドやドリルを生徒へ届けたい先生が、ファイル配布の手間なく安全に渡せる方法を整理。見せる相手を絞りながら教材を共有できるかを判断できます。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "student-assignment-share",
    "path": "/articles/student-assignment-share",
    "title": "学生がHTML課題を提出・共有する方法｜認証付きURLでらくらく送る",
    "description": "授業で制作したHTMLを提出するとき「開けない」「画像が出ない」と言われた経験のある学生向け。ファイル添付に頼らずきれいかつ安全に課題を届ける方法をステップごとに説明します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "consultant-deliverable-share",
    "path": "/articles/consultant-deliverable-share",
    "title": "コンサルが成果物HTMLを共有する方法",
    "description": "HTMLで仕上げた分析レポートや提案資料を、閲覧者を絞りながらクライアントへ渡したいコンサルタント向け。ファイル共有サービスより管理しやすい方法を選べるかどうかを判断できます。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "startup-pitch-share",
    "path": "/articles/startup-pitch-share",
    "title": "スタートアップがピッチ資料を投資家に共有する方法",
    "description": "資金調達の場面でピッチ資料を投資家へ素早く安全に届けたいスタートアップ向け。PDF添付に頼らず、見せたい相手にだけ最新版を届けられる共有方法の全体像が分かります。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "custom-slug-url",
    "path": "/articles/custom-slug-url",
    "title": "公開URLの末尾（スラッグ）を分かりやすく変更する方法",
    "description": "共有URLの末尾が意味不明な英数字で「何のリンクか分からない」と言われて困っている方向け。スラッグの概念から実際の変更手順まで、URL末尾をひと目で伝わる文字列にできるかを確認できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "take-down-published-html",
    "path": "/articles/take-down-published-html",
    "title": "公開したHTMLを非公開にする方法",
    "description": "一度共有したページを後から非公開にしたい、または見られる範囲を絞り直したいと気づいた方向け。閲覧を止める手順と、検索結果から外す場合の対処の違いまで整理した実践的な記事です。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "extend-publish-expiry",
    "path": "/articles/extend-publish-expiry",
    "title": "共有URLの公開期限を延長する方法と、切れる前にやっておきたい設定",
    "description": "送ったリンクの期限切れに直前まで気づかなかった経験のある方向け。期限をあとから延長する具体的な手順と、そもそも失効で困らないための設定を確認できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-url-qr-code",
    "path": "/articles/share-url-qr-code",
    "title": "共有URLをQRコードで配布する方法",
    "description": "展示会のパネルやセミナースライドにQRコードを載せて資料を届けたい方向け。共有URLをQRに変換する手順と、紙や投影でも読み取れるサイズ・品質の調整ポイントを解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-not-applied",
    "path": "/articles/css-not-applied",
    "title": "公開後にCSSが反映されない・スタイルが崩れるときの原因と直し方",
    "description": "手元ではきれいなのに公開後にスタイルが崩れてしまった方向け。ファイルのパス指定やフォルダ構成が原因のケースがほとんどであることを踏まえ、見るべき箇所と直し方を順番に確認できます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "japanese-garbled",
    "path": "/articles/japanese-garbled",
    "title": "公開後に日本語が文字化けするときの対処",
    "description": "公開したページを開いたら日本語が文字化けしていた方向け。エンコーディング不一致が原因の大半であることを踏まえ、UTF-8での保存と宣言方法を確認して再発を防げるかを判断できます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-upload-failed",
    "path": "/articles/zip-upload-failed",
    "title": "ZIPアップロードが失敗するときの確認点",
    "description": "AIや制作ツールで書き出したサイトをZIPアップロードしようとしてエラーになった方向け。典型的な原因を順に潰していくことで、ほとんどのケースで解決できるかを確認できます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "notion-html-share-comparison",
    "path": "/articles/notion-html-share-comparison",
    "title": "NotionでHTMLを共有する場合との違い",
    "description": "NotionにHTMLを貼っても思ったとおりに表示されず困っている方向け。文書管理ツールとHTML公開の仕組みの違いを把握したうえで、HTMLをそのまま見せる方法を選べるかを判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wetransfer-vs-url-share",
    "path": "/articles/wetransfer-vs-url-share",
    "title": "WeTransferでHTMLを送ると相手が開けない理由と、URL共有との使い分け",
    "description": "WeTransferでHTMLを送ったのに「表示されない」と言われた経験のある方向け。ファイル転送とWeb公開がそもそも別の仕組みであることを理解し、目的に合った手段を選べるかを確認できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firebase-hosting-vs-share",
    "path": "/articles/firebase-hosting-vs-share",
    "title": "Firebase Hostingとの使い分け｜本番配信と一時共有の境界線",
    "description": "Firebase Hostingを使おうか、手軽な共有サービスにすべきか迷っているエンジニアや担当者向け。本番運用と短期レビューで得意領域が異なる両者を事実ベースで比較し、選択基準を確認できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cloudflare-pages-vs-share",
    "path": "/articles/cloudflare-pages-vs-share",
    "title": "Cloudflare Pagesと共有特化サービスの使い分け",
    "description": "長く運用する本番サイトか一時的な関係者共有かで使い分けを迷っている方向け。Cloudflare Pagesと共有特化サービスの得意領域を整理し、今の用途に合った選択ができるかを判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "surge-sh-vs-share",
    "path": "/articles/surge-sh-vs-share",
    "title": "surge.shとの違いと使い分け｜CLI公開と認証付き共有",
    "description": "surge.shを使い慣れた開発者が「特定の相手にだけ見せたい」「期限を切りたい」要件に直面したとき向け。CLIによるオープン公開と認証付き一時共有の前提の違いから使い分けを判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "s3-static-hosting-vs-share",
    "path": "/articles/s3-static-hosting-vs-share",
    "title": "S3静的ホスティングとの違い｜HTML公開の使い分け",
    "description": "S3でHTMLをホスティングすべきか迷っている方向け。本番運用ならS3、短期間だけ特定の相手に見せたいなら一時共有URLという基本線を踏まえ、設定・制御・運用コストの差を確認できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "email-attachment-vs-url",
    "path": "/articles/email-attachment-vs-url",
    "title": "メール添付とURL共有の違い｜HTMLを送るならどっちが正解か",
    "description": "HTMLをZIPでメールに添付するかURLを送るかで迷っている方向け。複数ファイル構成のHTMLで表示崩れを防ぎたいケースに絞って、両者のメリット・デメリットと選び方の基準を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "slack-html-share-note",
    "path": "/articles/slack-html-share-note",
    "title": "SlackでHTMLを共有する方法と、開けないときの正しい対処",
    "description": "SlackにHTMLを送ったのに「真っ白」「ダウンロードされるだけ」と言われた方向け。Slackの仕様による自然な挙動であることを踏まえ、渡し方を変えることで一気に解決できるかを確認できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-static-site",
    "path": "/articles/what-is-static-site",
    "title": "静的サイトとは？動的サイトとの違いをわかりやすく解説",
    "description": "「静的サイト」と「動的サイト」の違いが曖昧なまま使っている方向け。あらかじめ用意したファイルをそのまま届けるか、アクセスのたびに組み立てるかという基本の違いを、具体例を交えて理解できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-noindex",
    "path": "/articles/what-is-noindex",
    "title": "noindexとは？仕組みと、できることできないこと",
    "description": "noindexを設定すれば「誰にも見られなくなる」と思っていた方向け。検索結果から外れてもURLを知っていれば閲覧できる事実と、できること・できないことの境界線を整理した記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-zip-website",
    "path": "/articles/what-is-zip-website",
    "title": "ZIPサイトとは？index.htmlの役割をやさしく解説",
    "description": "「ZIPでサイトを公開する」と言われても何が起きているのか分からない非エンジニア向け。中身の構成・index.htmlの役割・つまずきやすいフォルダ配置の3点を順番に理解できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-ephemeral-publish",
    "path": "/articles/what-is-ephemeral-publish",
    "title": "一時公開（期限付き公開）とは｜仕組みと使いどころをわかりやすく解説",
    "description": "レビュー資料や社内向け確認ページをずっと残したくない方向け。期限付き公開の仕組みと、自動非公開になるタイミング・設定方法・向いているシーンを分かりやすく確認できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "relative-vs-absolute-path",
    "path": "/articles/relative-vs-absolute-path",
    "title": "相対パスと絶対パスの違い｜公開してもCSSや画像が崩れない書き方",
    "description": "共有したら画像やCSSが消えてしまった経験のある方向け。相対パスと絶対パスの違いを整理し、公開後も崩れないファイル指定の書き方とよくあるつまずきポイントを具体例で確認できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-preview-url",
    "path": "/articles/what-is-preview-url",
    "title": "プレビューURLとは？確認用URLの基礎をやさしく解説",
    "description": "確認用URLと本番URLの違いが分からず使い方に迷っている方向け。プレビューURLの意味・使う場面・注意点をわかりやすく整理し、確認リンクをどう用意して誰にどう渡すべきかを判断できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-otp-auth",
    "path": "/articles/what-is-otp-auth",
    "title": "ワンタイム認証（OTP）とは｜メール認証で使われる仕組みをわかりやすく解説",
    "description": "メール認証で届いたコードが何なのか気になった方や、共有URLへの導入を検討している方向け。OTPが「使い捨てコード」である理由と、パスワードより漏えいリスクが低い仕組みを分かりやすく説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "remove-secrets-before-share",
    "path": "/articles/remove-secrets-before-share",
    "title": "公開前にHTMLから秘密情報を取り除く方法",
    "description": "AIツールで作ったHTMLに秘密情報が紛れていないか不安な方向け。APIキーやメールアドレスの見つけ方と取り除く手順を、非エンジニアでも実行できるレベルで具体的に解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-27"
  },
  {
    "slug": "external-script-risk",
    "path": "/articles/external-script-risk",
    "title": "外部スクリプト依存のリスクと確認方法",
    "description": "AIが生成したHTMLや配布テンプレートをそのまま公開しようとしている方向け。外部スクリプト依存でページが壊れたり情報が外部に渡ったりするリスクを把握し、公開前に確認できるかを判断できます。",
    "category": "セキュリティ",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "personal-data-in-html-share",
    "path": "/articles/personal-data-in-html-share",
    "title": "個人情報を含むHTMLを共有するときの注意点と安全な渡し方",
    "description": "名簿・見積書・申込内容など個人情報を含むHTMLを渡す必要がある方向け。URLが転送されれば誰でも閲覧できるリスクを踏まえ、閲覧者を限定して安全に届けるための考え方と手順を確認できます。",
    "category": "セキュリティ",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "publish-checklist",
    "path": "/articles/publish-checklist",
    "title": "HTML公開前チェックリスト（総まとめ）公開ボタンを押す前の確認項目",
    "description": "HTMLをいざ公開しようとして「何を確認すればいいか」迷っている方向け。表示・中身・公開範囲・公開後の4項目に分けたチェックリストで、ボタンを押す前に抜けを洗い出せます。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "prevent-link-leak",
    "path": "/articles/prevent-link-leak",
    "title": "共有URLの漏えいを防ぐ方法｜リンク流出のリスクと具体的な対策",
    "description": "共有URLが転送されて意図しない相手に見られないか不安な方向け。URLが漏れる主な経路を整理したうえで、認証や公開期限の組み合わせで流出の被害を最小化できるかを判断できます。",
    "category": "セキュリティ",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "ai-html-form-action-check",
    "path": "/articles/ai-html-form-action-check",
    "title": "AI製HTMLのフォーム送信先を確認する方法",
    "description": "生成AIに作らせたHTMLのフォームがどこへ送信されるか確認していない方向け。送信先の確かめ方と、見覚えのないエンドポイントが埋め込まれていた場合の対処を自分でできるかを確認できます。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-26"
  },
  {
    "slug": "share-without-leaking-source",
    "path": "/articles/share-without-leaking-source",
    "title": "ソースを見られたくないHTMLをどう見せるか、という考え方",
    "description": "「ソースコードを見られたくない」と考えている方向け。ブラウザで表示できる以上ソースは閲覧できるという前提を踏まえ、守るべき対象を見極めて閲覧者をコントロールする考え方を整理します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-with-fonts",
    "path": "/articles/share-html-with-fonts",
    "title": "Webフォント入りHTMLを崩さず共有する方法",
    "description": "手元できれいに見えたのに相手の画面でフォントが置き換わってレイアウトが崩れた方向け。Webフォントの読み込み方法による崩れの原因と、崩さずに共有するための構成の考え方を確認できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-with-video",
    "path": "/articles/share-html-with-video",
    "title": "動画を埋め込んだHTMLを共有する方法｜サーバー不要で相手に見せる手順",
    "description": "動画入りのHTMLを相手にそのまま見せたいがサーバーを立てたくない方向け。埋め込みの種類ごとの違いと、共有URLで届けるまでの流れをステップごとに確認できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-multiple-pages",
    "path": "/articles/share-multiple-pages",
    "title": "複数ページのHTMLサイトを共有する方法",
    "description": "複数のHTMLページからなるサイト一式をまとめて共有したい方向け。1ファイルずつ送る手間をなくし、ZIPにまとめてページ間リンクを保ったまま届ける方法と注意点を確認できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pc-to-smartphone-share",
    "path": "/articles/pc-to-smartphone-share",
    "title": "PCで作ったHTMLをスマホで実機確認する方法と手順",
    "description": "PCで作ったHTMLがスマホでどう表示されるか実機で確かめたい方向け。よく使われる確認方法を比較しながら、共有URLを使ってすばやくスマホ確認できるかを判断できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "test-html-before-publish",
    "path": "/articles/test-html-before-publish",
    "title": "共有前にHTMLの表示を自分で確認する方法",
    "description": "公開後に画像切れやレイアウト崩れが発覚して慌てた経験のある方向け。手元での確認から本番に近い環境での最終チェックまで、共有ボタンを押す前に自分でできる確認ステップを整理します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "reuse-same-url-for-versions",
    "path": "/articles/reuse-same-url-for-versions",
    "title": "バージョン違いを同じURLで見せ分ける運用｜修正版レビューを止めないやり方",
    "description": "修正のたびに新しいリンクを発行して相手が混乱した経験のある方向け。URLを固定したまま最新版ファイルだけ差し替える運用で、レビューサイクルを止めずに進められるかを確認できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-anonymously",
    "path": "/articles/share-html-anonymously",
    "title": "登録なしでHTMLを匿名公開する方法｜アカウント不要で共有URLを発行",
    "description": "アカウント登録やサーバー設定なしでHTMLをさっと見せたい方向け。登録不要でその場に共有URLを発行する具体的な手順と、匿名公開前に確認しておきたい注意点をまとめています。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "links-broken-after-upload",
    "path": "/articles/links-broken-after-upload",
    "title": "公開後にリンク切れになるときの対処",
    "description": "公開後にリンクが「ページが見つかりません」になってしまった方向け。パスの書き方やZIPの構造が原因のよくあるケースを切り分け、直し方と事前に防ぐ確認ポイントを解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "font-not-loading",
    "path": "/articles/font-not-loading",
    "title": "Webフォントが表示されないときの対処法｜公開後に当たらない原因と確認手順",
    "description": "公開した途端に文字デザインだけ標準フォントに戻ってしまった方向け。Webフォントが表示されない原因の大半が読み込み失敗であることを踏まえ、確認手順と対処法を順番に解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "page-blank-after-publish",
    "path": "/articles/page-blank-after-publish",
    "title": "公開後にページが真っ白なときの原因と確認手順",
    "description": "公開してURLを開いたら画面が真っ白で何も表示されなかった方向け。ファイルの置き場所・パスの書き方・ブラウザ状態の3方向から原因を切り分け、どこを直せばよいかを確認できます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "layout-broken-after-publish",
    "path": "/articles/layout-broken-after-publish",
    "title": "公開後にレイアウトが崩れる原因と直し方",
    "description": "手元では整っていたのに公開後にレイアウトが崩れた方向け。CSSや画像へのパスが公開環境で解決できていないケースを中心に、崩れの代表的な原因と修正手順をひとつずつ確認できます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-folder-structure",
    "path": "/articles/zip-folder-structure",
    "title": "崩れないZIPのフォルダ構成と圧縮のやり方",
    "description": "ZIP公開で画像切れやレイアウト崩れを防ぎたい方向け。index.htmlの位置、相対パス、不要ファイル除外、圧縮後の確認手順を実務目線で整理します。",
    "category": "ZIP公開",
    "updatedAt": "2026-06-27"
  },
  {
    "slug": "exclude-files-from-zip",
    "path": "/articles/exclude-files-from-zip",
    "title": "ZIP公開で同梱を避けるべきファイルと除外のやり方",
    "description": "フォルダごとZIPにしたら不要ファイルや危険な情報まで同梱してしまった方向け。公開に含めるべきでないファイルの種類と、ZIPを作るときに除外する具体的なやり方を確認できます。",
    "category": "ZIP公開",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "specify-emails-share",
    "path": "/articles/specify-emails-share",
    "title": "メールアドレスを指定して特定の人だけにHTMLを共有する方法",
    "description": "「この人だけに見せたい」を確実に実現したい方へ。閲覧を許可するメールアドレスをあらかじめ登録しておくことで、URL流出や転送による情報漏えいリスクを防げるかどうか、設定手順とともに判断できます。",
    "category": "認証共有",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "multiple-company-domains-auth",
    "path": "/articles/multiple-company-domains-auth",
    "title": "複数の会社ドメインを許可してHTMLを共有する方法",
    "description": "複数社が関わるプロジェクトで成果物を安全に共有したい担当者向け。自社と取引先のドメインをまとめて許可リストに設定する方法を紹介し、第三者への流出を防ぎながら関係者全員にスムーズに届けられるかを判断できます。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "password-and-expiry-combo",
    "path": "/articles/password-and-expiry-combo",
    "title": "パスワードと有効期限を組み合わせて安全に共有する方法",
    "description": "情報漏えいの影響を最小限に抑えたい方へ。パスワードで入口を絞り、有効期限で自動的にアクセスを閉じる二重の仕組みを組み合わせると、どこまでセキュリティを高められるか具体的な手順とともに確認できます。",
    "category": "認証共有",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "choose-auth-method",
    "path": "/articles/choose-auth-method",
    "title": "HTML共有の認証方式の選び方｜URLのみ・パスワード・メール・会社ドメイン",
    "description": "HTML共有でURLのみ・パスワード・メール認証・会社ドメインのどれを選ぶべきか迷う方向け。相手、機密度、期間、途中変更の判断基準を整理します。",
    "category": "認証共有",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "otp-code-share",
    "path": "/articles/otp-code-share",
    "title": "ワンタイムコード認証でHTMLを共有する方法",
    "description": "固定パスワードの使い回しが心配な方や、本人性を確実に確かめたい場面で役立つ解説です。閲覧時にメール受信できる本人だけが入れるワンタイムコード認証の仕組みと導入手順を把握できます。",
    "category": "認証共有",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "internal-only-share",
    "path": "/articles/internal-only-share",
    "title": "社内メンバー限定でHTMLを配布する方法",
    "description": "社内資料やプロトタイプが社外に漏れる心配をなくしたい方向け。自社ドメインのメールを持つ人だけに閲覧を限定する会社ドメイン認証の設定手順と、Google WorkspaceやMicrosoft 365との相性を確認できます。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "change-auth-after-publish",
    "path": "/articles/change-auth-after-publish",
    "title": "公開後に認証方式を追加・変更する方法",
    "description": "急いで公開したあとでセキュリティを強化したい方へ。同じURLを変えずにパスワード追加や認証方式の切り替えができるのか、公開後の変更手順と注意点をまとめて把握できます。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "client-only-domain-share",
    "path": "/articles/client-only-domain-share",
    "title": "取引先だけに見せる会社ドメイン認証の設定手順",
    "description": "取引先の担当者だけに成果物を見せたいけれど、相手に面倒な登録をさせたくない方向け。取引先ドメインを指定した会社ドメイン認証の設定手順と、Googleアカウントで完結する閲覧フローを確認できます。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-multiple-html",
    "path": "/articles/zip-multiple-html",
    "title": "複数のHTMLファイルをZIPでまとめて公開する方法",
    "description": "複数ページが内部リンクでつながったサイトをそのまま共有したい方へ。ファイルをバラバラに渡すと遷移が壊れる理由と、ZIPにまとめて正しく公開するための構成ルールを具体的に把握できます。",
    "category": "ZIP公開",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "zip-with-images",
    "path": "/articles/zip-with-images",
    "title": "画像フォルダ込みのサイトをZIPで公開する方法",
    "description": "HTMLを共有したら画像だけが消えた、という経験がある方向け。画像ファイルが別途必要な理由と、imagesフォルダごとZIPに含めて正しく公開するための手順とフォルダ構成を確認できます。",
    "category": "ZIP公開",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "make-zip-windows-mac",
    "path": "/articles/make-zip-windows-mac",
    "title": "公開用ZIPの作り方｜WindowsとMacそれぞれの手順",
    "description": "ZIPを作ったのに公開するとindex.htmlが見つからないエラーが出る方へ。WindowsとMacそれぞれの圧縮操作で余計な親フォルダができてしまう落とし穴と、正しい作り方を比較しながら把握できます。",
    "category": "ZIP公開",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "zip-no-index-html",
    "path": "/articles/zip-no-index-html",
    "title": "index.htmlがないZIPで公開できないときの直し方",
    "description": "ZIPをアップロードしても公開がうまくいかない方向け。入口ファイルとして必須なindex.htmlが存在しない場合に何が起きるか、ファイル名を確認・修正する手順とよくある命名ミスを整理して把握できます。",
    "category": "ZIP公開",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-japanese-filename",
    "path": "/articles/zip-japanese-filename",
    "title": "日本語ファイル名のZIPが文字化けするときの対処",
    "description": "日本語ファイル名を含むZIPで画像が表示されなくなるトラブルに直面している方へ。文字コードの違いがファイル名を壊す仕組みと、環境を問わず正しく表示されるファイル名に直す方法を確認できます。",
    "category": "ZIP公開",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-css-js-images",
    "path": "/articles/zip-css-js-images",
    "title": "CSS・JS・画像入りのサイトをZIPでまとめて公開する方法",
    "description": "見た目が崩れてボタンが動かない状態でHTMLを共有してしまった経験がある方向け。CSSやJSや画像を含む一式をZIPにまとめる正しい構成と、ローカルと公開後の差異を防ぐための確認ポイントを把握できます。",
    "category": "ZIP公開",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "reduce-zip-size",
    "path": "/articles/reduce-zip-size",
    "title": "公開用ZIPのサイズを小さくする方法",
    "description": "ZIPが大きくてアップロードが遅い・表示が重いと感じている方へ。サイズが膨らむ原因を画像と不要ファイルの観点で切り分け、公開に影響なく容量を減らせるかどうかを具体的な手順で判断できます。",
    "category": "ZIP公開",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "collect-review-feedback",
    "path": "/articles/collect-review-feedback",
    "title": "社内レビューのフィードバックを効率よく集める方法",
    "description": "共有した資料にいつまでも感想が返ってこない担当者向け。レビュアーが「何をどこに書けばいいか」迷わない仕組みとコメントの置き場の設計を整理し、フィードバック収集の効率を高められるか把握できます。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "keep-review-moving-same-url",
    "path": "/articles/keep-review-moving-same-url",
    "title": "修正版を同じURLで見せ続けてレビューを止めない方法",
    "description": "修正のたびに新しいリンクを送り直してレビューが混乱している方へ。URLを固定したまま中身だけ差し替える方法を使うと、関係者が常に最新版を見られる状態を維持しながら指摘のすれ違いを防げるかを確認できます。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-request-email",
    "path": "/articles/review-request-email",
    "title": "レビュー依頼メールの書き方と共有URLの添え方",
    "description": "レビュー依頼メールを送ったのに反応が薄いと感じている担当者向け。「何を・いつまでに・どの観点で」を相手に迷わず伝えるメール文の構成と、共有URLの添え方を具体的な文例で確認できます。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "multi-department-review",
    "path": "/articles/multi-department-review",
    "title": "複数部署にHTMLレビューを回す方法",
    "description": "複数部署に同一成果物をレビューしてもらうと版や指摘が錯綜してしまう担当者向け。部署ごとに異なる観点を整理しながら回す方法と、指摘をまとめる際の負担を減らせるかどうかを把握できます。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "approval-flow-share",
    "path": "/articles/approval-flow-share",
    "title": "上長承認用にHTMLを共有して承認をもらう方法",
    "description": "口頭やチャットで承認を取ると後から確認できなくて困る方へ。HTMLのURLを活用して上長に最新版を見てもらいながら承認を記録する方法と、古い版への誤承認を防ぐポイントを把握できます。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "design-review-on-screen",
    "path": "/articles/design-review-on-screen",
    "title": "デザインレビューを画面上のコメントで完結させる方法",
    "description": "「左上のあたりが」「3つ目のカードが」という説明では指摘箇所が正確に伝わらないと感じているデザイナー向け。画面そのものにコメントを残して対象を一目で示すレビューフローを実現できるかを確認できます。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-deadline-management",
    "path": "/articles/review-deadline-management",
    "title": "関係者レビューの期限を管理して回収率を上げる方法",
    "description": "レビューの締め切りを決めても守られず回収率が上がらないと悩む担当者向け。期限の設定方法とリマインドのタイミングを組み合わせることで催促の手間を減らしながら回収率を上げられるかを判断できます。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-to-multiple-people",
    "path": "/articles/share-html-to-multiple-people",
    "title": "複数人にHTMLを一斉共有する方法",
    "description": "AIで作ったHTMLを部署全員や取引先など複数人に一斉に届けたい方向け。1つのURLを配るだけで全員に同じ最新版を見せる方法と、個別送付で起きる版の乱れを防ぐ仕組みを把握できます。",
    "category": "HTML共有",
    "updatedAt": "2026-06-26"
  },
  {
    "slug": "share-html-via-line",
    "path": "/articles/share-html-via-line",
    "title": "LINEでHTMLを共有する方法｜ファイルが開けないときはURLで",
    "description": "LINEでHTMLを送ったのに相手が開けないと言われた方へ。LINEでのHTMLファイル共有が期待どおりに動かない理由と、URLを使えばスマートフォンでも確実に開いてもらえるかを確認できます。",
    "category": "HTML共有",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "url-instead-of-email-attachment",
    "path": "/articles/url-instead-of-email-attachment",
    "title": "HTMLをメール添付する代わりにURLで送る方法",
    "description": "HTMLをメール添付したらセキュリティで弾かれたり表示が崩れたりした経験がある方向け。添付の代わりにURLで送ることで相手に正しく届けられる方法と、その利点を具体的に把握できます。",
    "category": "HTML共有",
    "updatedAt": "2026-06-27"
  },
  {
    "slug": "publish-single-html-fast",
    "path": "/articles/publish-single-html-fast",
    "title": "1ファイルのHTMLを最速で公開する方法",
    "description": "サーバー契約や設定なしで、今すぐ1ファイルのHTMLを誰かに見せたい方向け。ドロップするだけでURLが発行されるまでの流れと、最速公開に必要な手順がどれくらい短いかを確認できます。",
    "category": "HTML共有",
    "updatedAt": "2026-06-26"
  },
  {
    "slug": "open-html-on-mobile",
    "path": "/articles/open-html-on-mobile",
    "title": "作ったHTMLをiPhone・Androidで開いてもらう方法",
    "description": "パソコンで作ったHTMLをiPhoneやAndroidで「開けない」「真っ白」と言われた経験がある方へ。スマートフォンでHTMLが開けない原因と、URLで届ければ確実に表示してもらえるかを判断できます。",
    "category": "HTML共有",
    "updatedAt": "2026-06-26"
  },
  {
    "slug": "time-limited-html-share",
    "path": "/articles/time-limited-html-share",
    "title": "HTMLを期間限定で見せる方法",
    "description": "提案資料やキャンペーン告知を期間が過ぎても見られる状態のまま放置したくない方向け。公開期限を設定して自動的にアクセスを閉じる仕組みが使えるかどうか、設定手順とともに確認できます。",
    "category": "HTML共有",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "share-html-no-signup-required",
    "path": "/articles/share-html-no-signup-required",
    "title": "相手の登録なしでHTMLを見せる方法",
    "description": "資料を共有したら「登録が必要で見られなかった」と言われてしまった経験がある方へ。アカウント作成を求めずにHTMLを見せる方法と、相手の手間を最小限にしながら認証を両立できるかを把握できます。",
    "category": "HTML共有",
    "updatedAt": "2026-06-26"
  },
  {
    "slug": "html-as-presentation",
    "path": "/articles/html-as-presentation",
    "title": "HTMLをプレゼン資料代わりに共有する方法",
    "description": "スライドソフトへの作り直しを省いてHTMLをそのままプレゼンに使いたい方向け。URLを共有するだけで相手の画面でそのまま提示できる方法と、プレゼン運用として成立するかを判断できます。",
    "category": "HTML共有",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "what-is-slug",
    "path": "/articles/what-is-slug",
    "title": "スラッグ（slug）とは？URLの末尾を決める基礎知識",
    "description": "URLの末尾に並ぶ英単語が何を意味するか気になった方向け。スラッグの役割や決め方の基本を把握することで、共有URLをわかりやすく設定する際の判断基準が身につきます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-subdomain",
    "path": "/articles/what-is-subdomain",
    "title": "サブドメインとは？共有URLの仕組みをやさしく解説",
    "description": "「blog.example.com」のようにドメイン前の文字が何なのか気になった方向け。サブドメインの仕組みとギガサイト便の共有URLがどのような構造になっているかを、やさしい言葉で理解できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-https-ssl",
    "path": "/articles/what-is-https-ssl",
    "title": "HTTPSとSSLとは？共有URLの鍵マークの意味",
    "description": "ブラウザの鍵マークが何を意味するか知りたい方向け。HTTPSとSSLが通信をどう守るのかを基礎から把握することで、共有URLを受け取った相手が安心できる根拠を説明できるようになります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-cdn-edge",
    "path": "/articles/what-is-cdn-edge",
    "title": "CDN・エッジ配信とは？共有ページが速い理由",
    "description": "共有ページがなぜ遠くの人でも速く表示されるのか気になった方向け。CDNとエッジ配信が利用者に近い場所からデータを届ける仕組みを把握し、表示速度の違いが生まれる理由を説明できるようになります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-index-html",
    "path": "/articles/what-is-index-html",
    "title": "index.htmlとは？サイトの入り口ファイルの役割",
    "description": "index.htmlというファイル名がなぜ特別なのか疑問に思った方向け。サイトの入り口として最初に表示されるファイルの役割と、ZIPで公開するときになぜこの名前が必要なのかを基礎から理解できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-ogp",
    "path": "/articles/what-is-ogp",
    "title": "OGP・OG画像とは？SNSで共有したときのサムネの仕組み",
    "description": "SNSにリンクを貼ったときに出るカード形式の表示が何の仕組みで動いているか知りたい方向け。OGPとOG画像の役割を把握し、共有URLが相手のタイムラインで魅力的に見えるかどうかを判断できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-meta-tag",
    "path": "/articles/what-is-meta-tag",
    "title": "metaタグとは？検索とSNS表示に効く基礎知識",
    "description": "画面に表示されないのに検索結果やSNSの見え方に影響するmetaタグが気になった方向け。タグの種類と影響する場面を整理することで、HTMLを公開する前に確認すべきポイントが分かります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-favicon",
    "path": "/articles/what-is-favicon",
    "title": "ファビコンとは？タブやブックマークに出るアイコン",
    "description": "ブラウザのタブに出る小さなアイコンをどう用意すればいいか迷っている方向け。ファビコンの意味と役立つ場面、基本的な作り方と設定方法をまとめて把握できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-cache",
    "path": "/articles/what-is-cache",
    "title": "キャッシュとは？更新が反映されないときの基礎知識",
    "description": "ファイルを差し替えたのに古い内容が表示されて困っている方向け。キャッシュが便利な仕組みでありながら更新を隠してしまう理由と、強制的に最新を表示させるための操作方法を確認できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-responsive",
    "path": "/articles/what-is-responsive",
    "title": "レスポンシブとは？PCとスマホで崩れない仕組み",
    "description": "同じHTMLがパソコンでもスマホでも崩れずに表示される仕組みが気になった方向け。レスポンシブの基本的な考え方と、HTMLを公開した際にスマホ表示を確認すべき理由を把握できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-hosting",
    "path": "/articles/what-is-hosting",
    "title": "ホスティングとは？Webページを公開する仕組み",
    "description": "作ったWebページを誰かに見てもらうためにどんな仕組みが必要か知りたい方向け。ホスティングが果たす役割と、ギガサイト便がどのように手間なく公開を実現しているかを理解できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "javascript-not-working",
    "path": "/articles/javascript-not-working",
    "title": "公開後にJavaScriptが動かないときの原因と直し方",
    "description": "ローカルでは動いていたボタンやアニメーションが公開後に反応しなくなった方向け。JavaScriptが止まる主な原因をファイルパスや読み込み順の観点で切り分け、自分で直せるかどうかを判断できます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "video-not-playing",
    "path": "/articles/video-not-playing",
    "title": "公開後に動画が再生されないときの対処",
    "description": "デモページや資料に埋め込んだ動画が公開後に再生されなくなった方向け。動画ファイルの添付漏れ・パスのズレ・ブラウザの自動再生制限を症状ごとに切り分け、自分でできる確認と対処を把握できます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "form-not-submitting",
    "path": "/articles/form-not-submitting",
    "title": "公開したHTMLのフォームが送信できないときの対処",
    "description": "問い合わせフォームやアンケートの送信ボタンが押せない・エラーになる方向け。静的ファイル公開ではフォームの動作に制約がある理由を理解し、外部サービス連携などの現実的な解決策を選べるようになります。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "iframe-not-showing",
    "path": "/articles/iframe-not-showing",
    "title": "iframeが表示されないときの原因と対処",
    "description": "地図や外部コンテンツをiframeで埋め込んだのに公開後に枠が空白になった方向け。表示許可・HTTPSとHTTPの混在・相対パスのズレを症状ごとに切り分け、適切な対処を選べるようになります。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "external-cdn-not-loading",
    "path": "/articles/external-cdn-not-loading",
    "title": "外部CDNのCSS・JSが読み込めないときの対処",
    "description": "CDNからCSSやJSを読み込む構成にしたらデザインが崩れて機能が動かなくなった方向け。URLの誤りやHTTPSの混在・バージョン指定の問題を原因ごとに整理し、確認と修正の手順を把握できます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "broken-only-on-mobile",
    "path": "/articles/broken-only-on-mobile",
    "title": "スマホだけ表示が崩れるときの原因と直し方",
    "description": "パソコンでは正常なのにスマホで開くと文字が小さすぎたりレイアウトが崩れたりして困っている方向け。viewportの指定漏れや固定幅指定が原因かどうかを症状から切り分け、HTMLとCSSの修正ポイントを確認できます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "old-version-still-showing",
    "path": "/articles/old-version-still-showing",
    "title": "更新したのに古いまま表示されるときの対処（キャッシュ）",
    "description": "ファイルを差し替えたのに古い内容のまま表示されて困っている方向け。ブラウザやネットワークのキャッシュが原因である可能性と、強制的に最新版を表示させる操作手順を状況ごとに確認できます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cannot-access-published-url",
    "path": "/articles/cannot-access-published-url",
    "title": "公開URLにアクセスできない・404になるときの確認点",
    "description": "共有したURLを開いたらアクセスできない・404になると連絡を受けた方向け。公開期限の失効・認証の壁・URLの入力ミス・index.htmlの欠如など原因を順序よく切り分け、素早く復旧できるか判断できます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-email-not-arriving",
    "path": "/articles/auth-email-not-arriving",
    "title": "認証メール（コード）が届かないときの確認点",
    "description": "メール認証のコードを待っているのにいつまでも届かない方向け。迷惑メールへの振り分け・アドレスの入力ミス・受信側の制限など届かない原因を優先順位とともに確認し、スムーズに閲覧を再開できるかを判断できます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "password-not-working",
    "path": "/articles/password-not-working",
    "title": "共有先でパスワードが通らないときの対処",
    "description": "パスワード認証で共有した資料に相手がアクセスできず困っているなら、まずこの記事で原因を絞り込めます。入力ミスから文字コードの違いまで、よくある詰まりどころと対処手順を順番に整理しました。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "images-too-heavy-slow",
    "path": "/articles/images-too-heavy-slow",
    "title": "画像が重くて表示が遅いときの改善方法",
    "description": "写真や図版が多いページを共有したら表示が遅くて相手を待たせてしまう、そんなときの改善策をまとめました。症状の切り分け方から、サイズ削減・形式変換の手順まで自分でできる範囲で解説しています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "check-who-viewed",
    "path": "/articles/check-who-viewed",
    "title": "共有URLを誰がいつ見たか確認する方法（アクセスログ）",
    "description": "資料を共有した後、ちゃんと届いたのか・意図しない人が見ていないかを把握したい担当者向けの記事です。閲覧状況を確認する一般的な考え方と、ギガサイト便のアクセスログで何が分かるかを整理しています。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-password-sharing",
    "path": "/articles/safe-password-sharing",
    "title": "共有パスワードを安全に相手へ渡す方法",
    "description": "URLとパスワードを同じメールに書いていませんか。パスワード認証の効果を最大限に活かすには、渡し方にも工夫が必要です。安全な受け渡しの原則と、ギガサイト便での実践的な運用方法を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "block-former-members",
    "path": "/articles/block-former-members",
    "title": "退職者・元関係者からのアクセスを止める方法",
    "description": "退職者や取引終了後の相手が、過去に渡した共有URLにまだアクセスできる状態は危険です。元関係者のアクセスを素早く止める手順と、次の共有で同じ問題を防ぐための設計をまとめました。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "expiry-prevents-leak",
    "path": "/articles/expiry-prevents-leak",
    "title": "公開期限で情報漏えいを防ぐ考え方と設定",
    "description": "用が済んだ共有URLを放置していませんか。期限切れのリンクが増えると思わぬ漏えいの入り口になります。公開期限を使って古い共有を自動的に閉じる考え方と、ギガサイト便での設定方法を紹介します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "check-api-keys-in-html",
    "path": "/articles/check-api-keys-in-html",
    "title": "HTMLにAPIキーが残っていないか確認して取り除く方法",
    "description": "AIに作らせたHTMLを公開する前に、APIキーや認証情報がソースに残っていないか確認しましたか。気づかず公開すると情報流出につながります。チェックの手順と安全に取り除く方法を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-26"
  },
  {
    "slug": "confidential-watermark-share",
    "path": "/articles/confidential-watermark-share",
    "title": "社外秘マークを付けてHTMLを共有する方法",
    "description": "「社外秘」の表記があるだけで、受け取った相手の取り扱いは変わります。認証で守ることと、資料の性質を明示することを両立したい方向けに、社外秘マークの付け方と共有設定の組み合わせ方を紹介します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "prevent-scraping-reuse",
    "path": "/articles/prevent-scraping-reuse",
    "title": "共有HTMLの転載・無断利用を防ぐ方法",
    "description": "公開したHTMLが無断転載されたり、スクレイピングで再利用されたりするリスクを下げたい方向けの記事です。完全に防ぐことはできませんが、複数の設定を組み合わせてリスクを大幅に減らす方法をまとめています。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "email-vs-password-security",
    "path": "/articles/email-vs-password-security",
    "title": "メール認証とパスワード、どちらが安全か",
    "description": "「パスワードとメール認証、どちらを選ぶべきか」と迷っている方向けに、それぞれの仕組みと強み・弱みを整理しました。資料の性質や相手の状況に応じた選び方の指針を具体的に紹介します。",
    "category": "セキュリティ",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "phishing-safe-share",
    "path": "/articles/phishing-safe-share",
    "title": "共有HTMLがフィッシングに悪用されないための注意点",
    "description": "AIが生成したHTMLにフォームや外部送信処理が含まれている場合、公開前に必ず確認が必要です。意図せずフィッシングのような挙動になるリスクを防ぐためのチェックポイントを具体的に解説しています。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gdpr-personal-data-share",
    "path": "/articles/gdpr-personal-data-share",
    "title": "個人情報保護・GDPRを意識したHTML共有の注意点",
    "description": "氏名や連絡先を含むHTMLを共有する担当者向けに、個人情報保護・GDPRの視点から注意すべき点をまとめました。必要以上に広く・長く共有しないための具体的な設定方法も紹介しています。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "render-com-vs-share",
    "path": "/articles/render-com-vs-share",
    "title": "Render（レンダー）との違いと使い分け",
    "description": "本番環境でアプリを長く動かすRenderと、認証付きURLで一時的に限定共有するギガサイト便。どちらを使うべきか、目的と状況に応じた使い分けの判断基準を整理しました。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "glitch-vs-share",
    "path": "/articles/glitch-vs-share",
    "title": "Glitchとの違いと使い分け",
    "description": "「作りながら見せたい」ならGlitch、「できたものを安全に届けたい」ならギガサイト便。両サービスの特徴と向いているシーンを比べることで、場面ごとの最適な選択が見えてきます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "netlify-drop-vs-share",
    "path": "/articles/netlify-drop-vs-share",
    "title": "Netlify Dropとの違い｜ドラッグ公開と認証付き共有",
    "description": "ドラッグするだけで公開できるNetlify Dropとギガサイト便は見た目が似て非なるサービスです。誰にでも見られる全体公開と、認証で相手と期間を絞る限定共有の違いを中心に使い分けを解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "github-gist-vs-share",
    "path": "/articles/github-gist-vs-share",
    "title": "GitHub Gistとの違い｜コード共有とHTML公開",
    "description": "コードスニペットの共有に使われるGitHub Gistと、HTMLを認証付きURLで見せるギガサイト便は用途が異なります。どちらが自分のケースに合うかを判断するための比較ポイントをまとめました。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "codesandbox-vs-share",
    "path": "/articles/codesandbox-vs-share",
    "title": "CodeSandboxとの違いと使い分け",
    "description": "開発中の試作を動かしながら見せるCodeSandboxと、完成したHTMLを安全に届けるギガサイト便。使うタイミングと目的がどう違うかを整理し、適切な選び方の基準を示しています。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "stackblitz-vs-share",
    "path": "/articles/stackblitz-vs-share",
    "title": "StackBlitzとの違いと使い分け",
    "description": "ブラウザ上で即座に開発・実行できるStackBlitzと、完成済みHTMLを認証付きで限定共有するギガサイト便は役割が根本的に異なります。両者の違いと、場面に応じた使い分けを解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tiiny-host-vs-share",
    "path": "/articles/tiiny-host-vs-share",
    "title": "Tiiny.hostとの違い｜HTML/ZIP公開サービスの比較",
    "description": "海外で知られるHTMLホスティングのTiiny.hostと、日本語対応・認証機能を備えたギガサイト便を比べました。公開範囲の制御や運用ルール、サポート体制など実務で気になる違いを詳しく整理しています。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ngrok-vs-share",
    "path": "/articles/ngrok-vs-share",
    "title": "ngrokとの違い｜ローカル公開と認証付きURL共有",
    "description": "手元のサーバーを外部に公開するngrokと、HTMLファイルを認証付きURLで見せるギガサイト便。どちらも一時的に外に出すツールですが、用途・セットアップの手間・セキュリティ設計が大きく異なります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-sites-vs-share",
    "path": "/articles/google-sites-vs-share",
    "title": "Google Sitesとの違い｜ノーコードサイトと一時共有",
    "description": "社内ポータルや継続運用サイトに向くGoogle Sitesと、完成済みHTMLを一時的に限定共有するギガサイト便は目的が異なります。どちらを選ぶべきか迷っている方向けに、判断軸を整理しました。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "studio-peraichi-vs-share",
    "path": "/articles/studio-peraichi-vs-share",
    "title": "STUDIO・ペライチとの違い｜ノーコードLPと一時共有",
    "description": "本番LPを作って公開し続けるSTUDIO・ペライチと、制作途中の試作を認証付きURLでレビューしてもらうギガサイト便は、使う場面がまったく違います。二つを組み合わせたワークフローも紹介します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "box-onedrive-vs-share",
    "path": "/articles/box-onedrive-vs-share",
    "title": "Box・OneDriveでHTMLを共有する場合との違い",
    "description": "BoxやOneDriveでHTMLを共有しようとしたら、ブラウザで開けずダウンロードになってしまった経験はありませんか。HTMLをそのままブラウザ表示させたい場合にギガサイト便が向いている理由と使い分けを解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "htmlpreview-github-vs-share",
    "path": "/articles/htmlpreview-github-vs-share",
    "title": "htmlpreview.github.ioとの違いと使い分け",
    "description": "GitHubのHTMLをプレビュー表示できるhtmlpreview.github.ioは手軽ですが、認証や公開制限の機能はありません。社外の相手に限定共有したい場面でギガサイト便がどう補完できるかを比較しています。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "teams-html-share-note",
    "path": "/articles/teams-html-share-note",
    "title": "Microsoft TeamsでHTMLを共有する方法と、開けないときの対処",
    "description": "Teamsでファイルを添付してもHTMLが開けない、あるいは表示が崩れると悩む担当者向けの記事です。Teams環境でHTMLを正しく届けるための代替手段と、ギガサイト便との組み合わせ方を紹介します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-lovable-app",
    "path": "/articles/share-lovable-app",
    "title": "Lovableで作ったアプリをURLで共有する方法",
    "description": "Lovableで素早く組み立てたWebアプリを、クライアントや上長にURLで見せたい方向けの記事です。コードを取り出して認証付きURLで共有するまでの手順を、具体的なステップで解説しています。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-genspark-site",
    "path": "/articles/share-genspark-site",
    "title": "Gensparkで生成したサイトを共有する方法",
    "description": "Gensparkで生成したサイトをそのままURLで送ってよいか迷っている方向けに、安全な共有方法を解説します。生成物を手元に取り出し、ギガサイト便で認証付き限定公開するまでの流れをまとめました。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-manus-output",
    "path": "/articles/share-manus-output",
    "title": "Manus AIの成果物を共有する方法",
    "description": "Manus AIが自律的に生成したレポートやWebページを、関係者だけに安全に届けたい方向けの記事です。成果物の取り出し方から認証付き共有URLの発行まで、実際の手順を順を追って紹介しています。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-windsurf-html",
    "path": "/articles/share-windsurf-html",
    "title": "Windsurfで作ったHTMLを共有する方法",
    "description": "WindsurfでAI補助を受けながら書いたHTMLを、チームやクライアントに見せる方法を解説します。ファイルの取り出しからギガサイト便での認証付き共有URLの発行まで、具体的な操作手順をまとめました。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-grok-html",
    "path": "/articles/share-grok-html",
    "title": "Grokで作ったHTMLを共有する方法",
    "description": "Grokで生成したHTMLをチャット画面のまま渡しても、レイアウトが崩れてうまく伝わりません。コードを正しく取り出してブラウザ表示できる状態で限定共有するまでの流れを具体的に解説しています。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-deepseek-html",
    "path": "/articles/share-deepseek-html",
    "title": "DeepSeekで作ったHTMLを共有する方法",
    "description": "DeepSeekで生成したHTMLのたたき台を、関係者にそのまま見てもらいたい方向けの記事です。コードの取り出し方から認証付き共有URLの発行まで、ギガサイト便を使った手順をまとめています。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-claude-multi-file-html",
    "path": "/articles/share-claude-multi-file-html",
    "title": "Claudeで作った複数ファイルのHTMLをまとめて共有する方法",
    "description": "ClaudeがHTML・CSS・JSを別ファイルで出力した場合、そのままでは相手に正しく届きません。複数ファイルをまとめてZIPにし、ギガサイト便で認証付き共有URLを発行するまでの手順を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "prompt-for-shareable-html",
    "path": "/articles/prompt-for-shareable-html",
    "title": "AIに「共有しやすいHTML」を作らせるプロンプトのコツ",
    "description": "「AIに作らせたHTMLが相手の環境で崩れた」経験のある方向けに、最初のプロンプトの書き方を見直す記事です。外部依存をなくして一ファイルで完結するHTMLを生成させるための指示のコツを紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-ai-internal-tool",
    "path": "/articles/share-ai-internal-tool",
    "title": "AIで作った社内ツールHTMLを限定共有する方法",
    "description": "AIが作った集計ツールや入力フォームのHTMLを、社内の特定メンバーだけに届けたい担当者向けの記事です。メール添付の版管理問題と社外流出リスクを同時に解消する方法を具体的に解説しています。",
    "category": "AI活用",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "share-ai-form-html-safely",
    "path": "/articles/share-ai-form-html-safely",
    "title": "AIで作ったフォーム付きHTMLを安全に共有する方法",
    "description": "AIに作らせたフォーム付きHTMLを共有する前に、送信先の確認はできていますか。個人情報が意図しない宛先へ流れるリスクを防ぐチェック手順と、安全に限定公開するための設定方法をまとめました。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-ai-chatbot-ui-demo",
    "path": "/articles/share-ai-chatbot-ui-demo",
    "title": "AIで作ったチャットボットUIのデモを共有する方法",
    "description": "AIで作ったチャットボットUIのデモを、社内検討や顧客提案のために特定の相手だけに見せたい方向けの記事です。未完成のデモを安全に限定共有し、フィードバックを集めるまでの流れを解説しています。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ab-test-ai-landing-variants",
    "path": "/articles/ab-test-ai-landing-variants",
    "title": "AIで作ったLPの複数案を同時に共有して反応を比べる方法",
    "description": "AIで複数のLP案を作ったはいいが、一つずつ順番に見せると比較が難しい。複数案を同時に共有して案ごとの反応を集めたい方向けに、ギガサイト便を使った並列共有の方法と運用例を紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "fix-ai-html-not-working",
    "path": "/articles/fix-ai-html-not-working",
    "title": "AIが作ったHTMLが動かないときの確認と共有のコツ",
    "description": "自分の画面では動くのに相手の環境では崩れる、そんなAI生成HTMLのトラブルを解決したい方向けの記事です。原因の切り分け方と、共有の入口を固定して再発を防ぐための設定方法を順番に解説します。",
    "category": "AI活用",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "recruiter-coding-task-share",
    "path": "/articles/recruiter-coding-task-share",
    "title": "採用担当がコーディング課題HTMLを候補者に共有する方法",
    "description": "コーディング課題の内容が外部に流出したり、URLが転送されて意図しない相手に見られたりするリスクを気にする採用担当者向けの記事です。課題HTMLを候補者ごとに認証付きURLで渡す方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "writer-article-preview-share",
    "path": "/articles/writer-article-preview-share",
    "title": "ライター・編集者が記事プレビューを共有する方法",
    "description": "公開前の記事プレビューをクライアントに確認してもらう際、実際のレイアウトを正確に伝えながら未公開原稿が外部に流れないようにしたい編集者・ライター向けに、認証付き共有の手順をまとめました。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "realestate-property-lp-share",
    "path": "/articles/realestate-property-lp-share",
    "title": "不動産が物件LPを限定共有する方法",
    "description": "未公開物件のLPを見込み客だけに届けたい不動産会社向けの記事です。URLをそのまま送っては広がりすぎる心配があるケースで、パスワードや期限を組み合わせた限定共有の方法を解説しています。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "restaurant-menu-campaign-share",
    "path": "/articles/restaurant-menu-campaign-share",
    "title": "飲食店がメニュー・キャンペーンページを共有する方法",
    "description": "解禁前の新メニューやキャンペーンページを、スタッフや取引先にだけ確認してもらいたい飲食店向けの記事です。情報が解禁前に外に出ないよう認証付きURLで限定共有する手順を紹介しています。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "accountant-lawyer-doc-share",
    "path": "/articles/accountant-lawyer-doc-share",
    "title": "士業（税理士・弁護士）が資料HTMLを安全に共有する方法",
    "description": "顧問先への説明資料やシミュレーション結果を、秘密保持を前提に届けたい税理士・弁護士向けの記事です。メール添付よりも安全に、認証付きURLで資料HTMLを共有するための具体的な手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "seminar-material-share",
    "path": "/articles/seminar-material-share",
    "title": "セミナー講師が資料HTMLを受講者に共有する方法",
    "description": "有料セミナーや限定講座の資料を、申込者だけに確実に届けたい講師向けの記事です。資料HTMLを認証付きURLで限定公開し、受講期間が終わったら自動的に閉じる運用の仕組みを紹介しています。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "company-intro-for-candidates",
    "path": "/articles/company-intro-for-candidates",
    "title": "会社紹介ページを採用候補者に限定共有する方法",
    "description": "採用選考が進んだ候補者にだけ、組織の内側や待遇の詳細を伝えたい採用担当者向けの記事です。全公開もPDF添付も避けながら、AIで作った会社紹介HTMLを候補者限定で共有する方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "press-kit-share",
    "path": "/articles/press-kit-share",
    "title": "プレスキット・取材資料をメディアに共有する方法",
    "description": "発表解禁前にプレスキットや取材資料をメディアへ安全に届けたい広報担当者向けの記事です。ロゴ・写真・ファクトシートをまとめたHTMLを、特定の記者にだけ期間限定で共有するまでの手順を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ec-product-page-draft-share",
    "path": "/articles/ec-product-page-draft-share",
    "title": "ECの商品ページ試作を関係者に共有する方法",
    "description": "公開前のEC商品ページ試作を、デザイナーや上長・仕入先にだけ見てもらいフィードバックを集めたい担当者向けの記事です。本番サイトに載せずに実際の見た目と挙動を共有する方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ir-document-investor-share",
    "path": "/articles/ir-document-investor-share",
    "title": "経営者がIR・事業計画資料を投資家に限定共有する方法",
    "description": "資金調達の面談に向けて、事業計画やIR資料を特定の投資家にだけ、必要な期間だけ届けたい経営者向けの記事です。版管理と閲覧制限を両立した認証付き共有の仕組みと設定手順を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "support-howto-html-share",
    "path": "/articles/support-howto-html-share",
    "title": "カスタマーサポートが手順HTMLを顧客に共有する方法",
    "description": "問い合わせのたびに手順を書き直す手間をなくしたいサポート担当者向けの記事です。設定手順や対処ガイドをHTMLにまとめ、その顧客にだけ届ける方法と、繰り返し使える運用例を紹介しています。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "photographer-gallery-share",
    "path": "/articles/photographer-gallery-share",
    "title": "写真家・クリエイターが作品集を限定共有する方法",
    "description": "撮影済みの作品を依頼主にだけ確認してもらいたい、または未公開のポートフォリオを打診相手にだけ見せたい写真家・クリエイター向けに、認証付き作品ギャラリーの共有方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gigafile-vs-share",
    "path": "/articles/gigafile-vs-share",
    "title": "ギガファイル便でHTMLを送ると相手が開けない理由と、URL共有との使い分け",
    "description": "「ギガファイル便で送ったのに開けない」という経験がある方へ。ファイルを届ける転送サービスとページをその場で見せるURL共有は仕組みが根本から違います。どちらを選べばよいか、受け手の体験から判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firestorage-vs-share",
    "path": "/articles/firestorage-vs-share",
    "title": "firestorageでHTMLを共有する場合との違いと使い分け",
    "description": "firestorageでHTMLを渡すとダウンロードが前提になり、相手の画面で崩れることも。ファイルの保管・配布に強いfirestorageと、ページをその場で表示するURL共有の違いを比較し、用途に合った選び方を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "data-bin-vs-share",
    "path": "/articles/data-bin-vs-share",
    "title": "データ便でHTMLファイルを送る場合との違い",
    "description": "HTMLをデータ便で送ると受け手はダウンロードしてから開く手間が生じます。ファイルを届けるサービスとページをブラウザで直接見せるサービスの違いを、受け手の体験・レイアウト崩れのリスクなどを軸に整理しました。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "okurin-vs-share",
    "path": "/articles/okurin-vs-share",
    "title": "おくりん坊などファイル転送サービスとHTML共有の違い",
    "description": "おくりん坊などのファイル転送はデータを「送る」のが目的ですが、HTMLは「見せる」のが目的です。2つの違いを実際の受け手の体験から比較し、ファイル転送では対応できない場面をどう乗り切るかを解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "takufile-vs-share",
    "path": "/articles/takufile-vs-share",
    "title": "宅ふぁいる便系サービスの代わりにHTMLをURL共有する方法",
    "description": "宅ふぁいる便系サービスで確認用HTMLを送ると、相手がダウンロードして開く手順が必要になります。法人向けファイル送付の仕組みと、ページをURLで直接見せるアプローチを比較し、目的別の使い分けを整理しています。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "large-file-transfer-vs-html-share",
    "path": "/articles/large-file-transfer-vs-html-share",
    "title": "大容量ファイル転送サービスとHTML共有サービスの違い",
    "description": "「ファイルを渡す」と「ページを見せる」は似て非なる目的です。大容量ファイル転送とHTML共有サービスの設計の違いを総論として整理し、作ったページを確認してもらいたい場面でどちらが適しているかの判断基準を示します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "mega-vs-share",
    "path": "/articles/mega-vs-share",
    "title": "MEGAでHTMLを共有する場合との違い",
    "description": "MEGAでHTMLの共有リンクを送っても相手にはダウンロードが要ります。クラウドストレージが得意なことと苦手なことを整理し、AIが生成したHTMLをその場で開いてもらえる方法への切り替え方を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "send-anywhere-vs-share",
    "path": "/articles/send-anywhere-vs-share",
    "title": "Send AnywhereでHTMLを送る場合との違い",
    "description": "Send Anywhereは端末間のファイル転送に便利ですが、HTMLを「開いて見てもらう」用途には向いていません。転送と表示の違いを受け手目線で比較し、確認フローをスムーズにするためのURL共有という選択肢を紹介します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dropbox-transfer-vs-share",
    "path": "/articles/dropbox-transfer-vs-share",
    "title": "Dropbox TransferとHTML共有の違い",
    "description": "Dropbox TransferはファイルをきれいにパッケージしてURLで渡せますが、受け手はダウンロードして開く前提です。確認用HTMLをブラウザですぐ表示させたい場合に、どんな手段が目的に合っているかを比較します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "bizstorage-vs-share",
    "path": "/articles/bizstorage-vs-share",
    "title": "法人向けファイル転送(Bizストレージ等)との違いと使い分け",
    "description": "NTT系などの法人向けファイル転送はログと統制が強みですが、AIが作ったHTMLをすぐ見せてレビューしたい場面とは目的が異なります。法人向け転送の特性とHTML共有の違いを整理し、用途別の選び方を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gigacc-vs-share",
    "path": "/articles/gigacc-vs-share",
    "title": "GigaCCなど企業向けファイル共有との違い",
    "description": "GigaCCのような企業向けセキュアファイル共有は監査ログや権限管理に強みがありますが、AIが作ったHTMLをさっと関係者に見せたい場面とは目的が違います。両者の使い分けと、素早い確認に向いた方法を比較します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "crypto-bin-vs-share",
    "path": "/articles/crypto-bin-vs-share",
    "title": "クリプト便などセキュアファイル便との違い",
    "description": "クリプト便は機密ファイルの暗号化送付に特化したサービスです。一方で、作ったHTMLを認証付きURLでその場に開いて見てもらいたいニーズとは目的が異なります。用途の違いから、どちらを選ぶべきかを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "smooth-file-vs-share",
    "path": "/articles/smooth-file-vs-share",
    "title": "Smooth Fileなど法人ファイル転送との違い",
    "description": "Smooth Fileのような法人ファイル転送はファイルの安全な授受に優れていますが、AIが生成したHTMLをその場で表示させる用途には向き不向きがあります。両者の違いと、ダウンロード不要な確認フローへの切り替え方を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "file-transfer-vs-url-share-basics",
    "path": "/articles/file-transfer-vs-url-share-basics",
    "title": "「ファイル転送」と「URL共有」はどう違う？選び方の基本",
    "description": "「相手に渡したい」と「相手に見てもらいたい」は別の目的です。ファイル転送とURL共有の仕組みの違いを概念レベルから整理し、用途ごとにどちらを選ぶべきかを初めて検討する方が判断できるよう解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "filemail-vs-share",
    "path": "/articles/filemail-vs-share",
    "title": "Filemailなど海外ファイル転送サービスとの違い",
    "description": "Filemailは国際的な大容量送付が得意ですが、AIが生成したHTMLをすぐ開いて確認してもらいたい場面では「大きく送る」より「すぐ表示させる」が目的に合います。海外転送サービスとHTML共有の違いを解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wesendit-vs-share",
    "path": "/articles/wesendit-vs-share",
    "title": "WeSendItなどWeTransfer代替サービスとの違い",
    "description": "WeSendItはWeTransfer代替として手軽なファイル送付に強みを持ちますが、デザインHTMLを「送る」のと「ブラウザで開いて見てもらう」のは別の行為です。両者の違いと、確認フローに向いた選択肢を比較します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "axfc-uploader-vs-share",
    "path": "/articles/axfc-uploader-vs-share",
    "title": "アップローダー(axfc等)でHTMLを公開する場合との違い",
    "description": "axfcのような無料アップローダーはファイルを手早く置いて配布できますが、HTMLをそのまま表示させる用途では広告や安全性が気になります。旧来のアップローダーと、閲覧特化のHTML共有サービスの違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "nas-share-vs-html-share",
    "path": "/articles/nas-share-vs-html-share",
    "title": "NAS共有リンクでHTMLを見せる場合との違い",
    "description": "SynologyなどNASの共有リンクは社内ファイル基盤として優秀ですが、HTMLを「ダウンロードせずにその場で開いて見てもらう」用途には向き不向きがあります。NAS共有とギガサイト便の違いを用途別に比較します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-devin-output",
    "path": "/articles/share-devin-output",
    "title": "Devin（AIソフトウェアエンジニア）が生成したHTMLを共有する方法",
    "description": "Devinが生成したHTMLやWebサイトをローカルプレビューやスクリーンショットで渡しても、相手は実際の挙動を確認できません。成果物を認証付きURLとして公開し、レビューを素早く回す方法をステップで紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-dify-app",
    "path": "/articles/share-dify-app",
    "title": "Difyで作ったアプリやページを共有する方法",
    "description": "Difyでノーコード的に作ったLLMアプリやWebページを社内・顧客に確認してもらう段階で迷いがちな共有方法を解説。書き出したHTMLを手早くURL化して見てもらえる手順と、認証設定のポイントをまとめています。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-gamma-deck",
    "path": "/articles/share-gamma-deck",
    "title": "Gammaで作ったAIスライド・ページをURLで共有する方法",
    "description": "GammaのAIスライドはメール添付では表示が崩れがちです。書き出したHTMLを認証付きの一時URLでそのまま見せる方法を知りたいデザイナーやマーケターに向けて、共有フローをステップごとに解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-perplexity-page",
    "path": "/articles/share-perplexity-page",
    "title": "Perplexity Pages・Labsの成果物を共有する方法",
    "description": "PerplexityのPagesやLabsで作った成果物を社内・取引先と共有するとき、認証付きURLで範囲を絞って見せる方法が便利です。書き出したHTMLを手早く公開し、フィードバックを集める手順を紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-lechat-html",
    "path": "/articles/share-lechat-html",
    "title": "Le Chat（Mistral）で作ったHTMLを共有する方法",
    "description": "Le ChatのCanvas機能でHTMLを生成しても、それを社外の人に見せるにはファイルとして渡す手段が要ります。Mistral製のHTMLを認証付きURLで公開し、ブラウザですぐ確認してもらえる方法を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-tempo-ui",
    "path": "/articles/share-tempo-ui",
    "title": "Tempo Labsで作ったUIをURLで共有する方法",
    "description": "Tempo LabsでビジュアルにReact UIを組んでも、確認フローでデザイナーやチームに渡す手段で迷いがちです。書き出した画面をブラウザで開ける形で認証付きURLとして共有する方法をステップで解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-rork-app",
    "path": "/articles/share-rork-app",
    "title": "Rorkで作ったアプリを共有する方法",
    "description": "RorkのAI生成アプリをチームやクライアントに確認してもらう段階で、書き出したHTMLをそのままURL共有できると話が早いです。ファイルを認証付きの一時URLに変えてすぐ見せる手順をまとめました。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-create-xyz-site",
    "path": "/articles/share-create-xyz-site",
    "title": "Create.xyzで生成したサイトを共有する方法",
    "description": "Create.xyzで素早く作ったサイトを「本番デプロイ前に確認してほしい」場面で使える手軽な共有方法を紹介します。生成された成果物を一時URLとして公開し、クライアントやチームからフィードバックを得るフローを解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-trae-html",
    "path": "/articles/share-trae-html",
    "title": "Trae（ByteDance）で作ったHTMLを共有する方法",
    "description": "TraeのAIエージェントで書き出したHTMLを、エディタ外の人に見てもらうにはファイルを共有する一手間が要ります。ローカルサーバーを立てずに認証付きURLで渡せる方法をステップで紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-qwen-html",
    "path": "/articles/share-qwen-html",
    "title": "Qwen（Alibaba）で作ったHTMLを共有する方法",
    "description": "Qwen Chatで生成したHTMLコードをそのまま動く画面として共有するには、ファイルにして渡す手段が必要です。ダウンロードも専用アカウントも不要な認証付き一時URLで見てもらう手順を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-kimi-html",
    "path": "/articles/share-kimi-html",
    "title": "Kimiで作ったHTMLを共有する方法",
    "description": "Kimiの生成HTMLはコピーしてすぐ使えますが、チャットの外の人に見せるには共有する手段が要ります。ファイルにして認証付きURLに変換し、ブラウザでそのまま確認してもらえる方法をまとめました。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-cline-output",
    "path": "/articles/share-cline-output",
    "title": "Cline（VS Code拡張）で生成したHTMLを共有する方法",
    "description": "ClineがVS Codeのワークスペースに書き出したHTMLを、ローカル環境の外の人に見せる方法で迷っていませんか。サーバー設定不要で認証付きURLを発行し、すぐレビューしてもらえる手順を紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-aider-output",
    "path": "/articles/share-aider-output",
    "title": "Aiderで生成したHTMLを共有する方法",
    "description": "Aiderでコミットされたレポジトリ内のHTMLを、Gitを介さずに関係者にすぐ見てもらいたい場面向けの共有方法を解説します。ローカルファイルを認証付きURLに変えてプレビューを共有するフローをまとめました。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-junie-html",
    "path": "/articles/share-junie-html",
    "title": "Junie（JetBrains AI）で作ったHTMLを共有する方法",
    "description": "JetBrains AIのJunieがIDEに書き出したHTMLをIDE外の人に見せるには、ファイルを共有する手段が必要です。認証付きURLで関係者にすぐプレビューを渡せる方法をステップで解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-databutton-app",
    "path": "/articles/share-databutton-app",
    "title": "Databuttonで作ったアプリを共有する方法",
    "description": "Databuttonのデータアプリを社内やクライアントに「ちょっと見てほしい」段階でどう渡せばよいか迷う方へ。本番公開の前に認証付きURLで範囲を絞って共有する方法を、エクスポートから公開までまとめました。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-softgen-app",
    "path": "/articles/share-softgen-app",
    "title": "Softgenで作ったWebアプリを共有する方法",
    "description": "Softgenのフルスタックビルダーで組んだフロント画面を本番前にレビューしてもらいたい開発者向けに、デプロイ不要の一時URL共有方法を解説します。エクスポートしたHTMLを認証付きで渡すフローを紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-mocha-app",
    "path": "/articles/share-mocha-app",
    "title": "Mocha（getmocha）で作ったアプリを共有する方法",
    "description": "Mochaで作ったアプリ画面を周囲に見せてフィードバックを集めたいが、安全で手軽な共有方法が見当たらない人向け。具体的な共有手順と選択肢の比較を紹介する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-marblism-app",
    "path": "/articles/share-marblism-app",
    "title": "Marblismで作ったアプリを共有する方法",
    "description": "MarblismのAI生成アプリをデプロイ前にチームやクライアントへ確認してもらいたいなら、一時URL共有が手っ取り早いです。生成された画面を認証付きURLに変換してすぐ見せる手順と設定ポイントを解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-heyboss-site",
    "path": "/articles/share-heyboss-site",
    "title": "HeyBossで作ったサイト・アプリを共有する方法",
    "description": "HeyBossで短時間に形にしたサイトやアプリを、本番公開とは別に特定の人だけに見せて確認を取りたい場面で使える共有方法を紹介します。認証付きの一時URLを発行してフィードバックを集める手順をまとめました。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-napkin-visual",
    "path": "/articles/share-napkin-visual",
    "title": "Napkin AIで作った図解・ビジュアルを共有する方法",
    "description": "Napkin AIで作った図解を関係者に安全に共有したい方向けに、HTMLとしてエクスポートして認証付きURLで渡す手順を解説します。全体公開せず範囲を絞って確認してもらいたい場面にも対応したフローを紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-tome-deck",
    "path": "/articles/share-tome-deck",
    "title": "Tomeで作ったプレゼンを共有する方法",
    "description": "TomeのAIプレゼンを特定の関係者だけに確認してもらいたいとき、全体公開せず認証付きURLで渡す方法が便利です。書き出したプレゼンを一時URLとして共有するフローとセキュリティの設定ポイントを解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-emergent-app",
    "path": "/articles/share-emergent-app",
    "title": "Emergentで作ったアプリを共有する方法",
    "description": "Emergentが生成したアプリをプレビュー画面のままでは共有しづらいと感じた方へ。書き出したHTMLを認証付きURLに変えて、アカウント共有なしに関係者だけ閲覧させる手順をステップで解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-same-dev-ui",
    "path": "/articles/share-same-dev-ui",
    "title": "Same.devで複製・生成したUIを共有する方法",
    "description": "Same.devで再現・生成したUIを「スクショではなく実際に触って確認してほしい」場面向けに、HTMLをブラウザで開けるURLとして共有する方法を紹介。デプロイ不要で関係者にインタラクティブなプレビューを届けます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-a0-dev-app",
    "path": "/articles/share-a0-dev-app",
    "title": "a0.devで作ったアプリを共有する方法",
    "description": "a0.devで生成したモバイルアプリをストアに出す前に関係者へ確認してもらいたい開発者向けに、一時URLで素早くプレビューを共有する方法を解説します。認証設定とフィードバック収集のフローもあわせてまとめました。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-readdy-site",
    "path": "/articles/share-readdy-site",
    "title": "Readdy.aiで作ったサイトを共有する方法",
    "description": "Readdy.aiで作ったサイトを「本番前に最終確認してほしい」場面で、デプロイ不要の一時URL共有が役立ちます。デザイン起点のサイトを認証付きURLで特定の人だけに公開する手順を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-claude-code-site",
    "path": "/articles/share-claude-code-site",
    "title": "Claude Codeで生成したサイト・HTMLを共有する方法",
    "description": "Claude CodeがCLIで生成したサイトやHTMLをそのまま関係者に見せたいとき、サーバー設定なしで認証付きURLを発行できます。ローカルの生成物を手早く共有してレビューを回す手順をまとめました。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-gemini-canvas",
    "path": "/articles/share-gemini-canvas",
    "title": "Gemini Canvasの成果物を共有する方法",
    "description": "GeminiのCanvasで作ったHTMLをCanvas外の関係者に見せるには、コピペやスクショ以外の方法が便利です。成果物を一時URLとして認証付きで公開し、すぐ確認してもらえる手順をステップで解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-copilot-workspace-html",
    "path": "/articles/share-copilot-workspace-html",
    "title": "GitHub Copilot/Copilot Workspaceで作ったHTMLを共有する方法",
    "description": "GitHub CopilotやCopilot Workspaceで生成したHTMLをレビュアーに見てもらうとき、コードだけでは画面が伝わりません。生成物をそのままブラウザで確認できる認証付きURLとして共有する方法を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-base44-app",
    "path": "/articles/share-base44-app",
    "title": "Base44で作ったアプリを共有する方法",
    "description": "Base44で組んだノーコードアプリのプロトタイプを「特定の人だけに見てほしい」ときに使える一時URL共有の方法を紹介。書き出したHTMLを認証付きURLで公開し、フィードバックを素早く集める手順をまとめました。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-felo-slides",
    "path": "/articles/share-felo-slides",
    "title": "Felo（AI検索）のスライド・ページを共有する方法",
    "description": "FeloがAI検索から自動生成したスライドやページを、チームや取引先に手早く渡したい調査担当者向けに、HTMLエクスポートから認証付きURL公開までの手順を解説します。資料の最終確認フローを大幅に短縮できます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-rocket-new-site",
    "path": "/articles/share-rocket-new-site",
    "title": "Rocket.newで作ったサイト・アプリを共有する方法",
    "description": "Rocket.newで素早く生成したサイトやアプリを「公開前に関係者へ確認してもらいたい」場面で使える認証付きURL共有の手順を紹介します。本番デプロイとは別に安全なプレビューを発行する方法をまとめました。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-chatgpt-gpts-html",
    "path": "/articles/share-chatgpt-gpts-html",
    "title": "GPTs・ChatGPTアプリの成果物HTMLを共有する方法",
    "description": "GPTsやChatGPTアプリが書き出したLPやレポートHTMLを、チャット画面の外で関係者に見せたい方へ。認証付きの一時URLとして公開し、ブラウザでそのまま確認してもらえる共有手順を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "xserver-vs-share",
    "path": "/articles/xserver-vs-share",
    "title": "エックスサーバーでHTMLを公開する場合との違いと使い分け",
    "description": "本番サイトを運用するエックスサーバーと、HTMLを今すぐ見せたいだけの場面では必要な準備がまるで違います。契約・設定・FTPアップロードが必要かどうか、用途ごとに最適な選択肢を比べてみましょう。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "lolipop-vs-share",
    "path": "/articles/lolipop-vs-share",
    "title": "ロリポップ！との違いと使い分け",
    "description": "低価格で始められるロリポップ！は長期運用に向きますが、関係者に一度だけHTMLを確認してもらう場面では手続きが重いことも。サーバー契約なしで即日共有できる選択肢と比べ、目的に合った手段を選ぶ判断材料を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "sakura-rental-vs-share",
    "path": "/articles/sakura-rental-vs-share",
    "title": "さくらのレンタルサーバーとの違い",
    "description": "さくらのレンタルサーバーは独自ドメイン運用の定番ですが、制作途中のHTMLを今すぐ誰かに確認してもらいたい場面ではオーバースペックになりがちです。目的別にどちらが向くかを比べて判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "conoha-wing-vs-share",
    "path": "/articles/conoha-wing-vs-share",
    "title": "ConoHa WINGとの違いと使い分け",
    "description": "ConoHa WINGの高速な本番環境は継続運用に最適ですが、一度だけ確認用にHTMLを見せたい局面では別の手段が効率的です。フェーズや目的で選び方が変わるポイントを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "onamae-server-vs-share",
    "path": "/articles/onamae-server-vs-share",
    "title": "お名前.comレンタルサーバーとの違い",
    "description": "お名前.comのレンタルサーバーはドメインとセットで本番運用に強みがありますが、関係者だけに一時的にHTMLを見せる用途では向き不向きがあります。両者の役割の違いから最適な使い分けを判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "star-server-vs-share",
    "path": "/articles/star-server-vs-share",
    "title": "スターサーバーとの違い",
    "description": "コスト重視で選ばれるスターサーバーは独自ドメインの本番運用に向きますが、確認用に一時的にHTMLを見せたい局面では手順が多く感じることがあります。目的別に適した手段を比較して選べます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webflow-vs-share",
    "path": "/articles/webflow-vs-share",
    "title": "Webflowとの違いと使い分け",
    "description": "Webflowはデザインから公開・CMS運用まで一貫できる強力なツールですが、手元にすでにあるHTMLをすぐ確認してもらいたい場面では役割が異なります。ツール選びに迷う前に両者の用途の違いを整理できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wix-vs-share",
    "path": "/articles/wix-vs-share",
    "title": "Wixとの違い｜ノーコードサイトと一時共有",
    "description": "ノーコードでサイトをゼロから作るWixと、できあがったHTMLをURLで即共有するサービスは、目的がまるで違います。どちらを選ぶべきか迷っている方が状況に合った判断をするための比較記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "jimdo-vs-share",
    "path": "/articles/jimdo-vs-share",
    "title": "Jimdoとの違いと使い分け",
    "description": "スマホからでもサイトを作れるJimdoは本番公開に向きますが、既存HTMLをすぐ確認してもらいたい用途とは役割が異なります。ノーコード作成と一時共有のどちらが今の目的に合うかを整理できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "framer-vs-share",
    "path": "/articles/framer-vs-share",
    "title": "Framerとの違いと使い分け",
    "description": "デザインを書き出してそのまま公開できるFramerは本番サイト向きですが、作ったHTMLをまず関係者に見せてフィードバックをもらうフェーズでは別の手段が向きます。ツール選びの判断軸を比較して確認できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "carrd-vs-share",
    "path": "/articles/carrd-vs-share",
    "title": "Carrdとの違い｜1ページサイトと一時共有",
    "description": "1ページの軽量サイトを手軽に作れるCarrdは本番公開に向きますが、完成済みHTMLを今すぐ特定の相手に確認してもらう用途は別物です。目的別に向く手段を比べて選ぶ参考にしてください。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ameba-ownd-vs-share",
    "path": "/articles/ameba-ownd-vs-share",
    "title": "Ameba Owndとの違い",
    "description": "無料で始められるAmeba Owndは情報発信や本番運用に向きますが、できあがったHTMLを関係者だけに限定共有したい用途では役割が異なります。目的に合ったサービス選びの判断材料を提供します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wordpress-com-vs-share",
    "path": "/articles/wordpress-com-vs-share",
    "title": "WordPress.comとの違い",
    "description": "ブログやサイトを継続ホスティングするWordPress.comと、手元のHTMLを今すぐ特定の相手に見せる用途は目的が根本から違います。どちらが自分のニーズに合うか、判断するための比較ポイントを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "super-so-vs-share",
    "path": "/articles/super-so-vs-share",
    "title": "Super.so（Notion公開）との違い",
    "description": "Notionページをサイトとしてそのまま公開できるSuper.soはNotion運用者に便利ですが、既存HTMLを認証付きで一時共有する用途とは設計思想が異なります。ツール選びに迷う方向けに違いを整理しました。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "typedream-vs-share",
    "path": "/articles/typedream-vs-share",
    "title": "Typedreamとの違いと使い分け",
    "description": "ブロックを積み上げてサイトを作るTypedreamと、完成済みHTMLをURLで即共有する手段は、出発点が違います。サイトをゼロから作るのか、手元にある成果物を今すぐ見せたいのか、状況別の選び方が分かります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "durable-vs-share",
    "path": "/articles/durable-vs-share",
    "title": "Durable（AIサイトビルダー）との違い",
    "description": "AIが自動でビジネスサイトを生成するDurableは公開運用向きですが、生成済みHTMLを認証付きURLで関係者に見せて確認を取るフェーズには別の手段が向きます。「作る」と「見せる」を分けて考える視点が得られます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "canva-sites-vs-share",
    "path": "/articles/canva-sites-vs-share",
    "title": "Canvaサイト（Canva Sites）との違い",
    "description": "Canvaのサイト公開機能はデザインをそのまま本番公開できる手軽さが魅力ですが、手元のHTMLを特定の相手だけに一時的に見せたい用途は別物です。デザインと共有、それぞれに適したツールの選び方が分かります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hatena-blog-vs-share",
    "path": "/articles/hatena-blog-vs-share",
    "title": "はてなブログでHTMLを公開する場合との違い",
    "description": "はてなブログの記事にHTMLを埋め込もうとすると、表示崩れやタグ制限に悩むことがあります。HTMLをそのままの状態で関係者に見せたい方向けに、制限の原因と代替手段を整理した記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "note-vs-share",
    "path": "/articles/note-vs-share",
    "title": "note（ノート）でHTMLを共有できない理由と使い分け",
    "description": "文章や画像の発信に強いnoteですが、生のHTMLをそのまま公開する機能はありません。コーディングしたページを特定の相手に届けたい方向けに、なぜnoteでは難しいのかと、向く代替手段を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hugging-face-spaces-vs-share",
    "path": "/articles/hugging-face-spaces-vs-share",
    "title": "Hugging Face Spacesとの違いと使い分け",
    "description": "MLデモをサーバーで動かせるHugging Face Spacesと、静的HTMLを認証付きURLで一時共有する用途は前提が違います。動的なアプリが必要かどうかで手段を分けて考える判断軸が得られます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "railway-vs-share",
    "path": "/articles/railway-vs-share",
    "title": "Railwayとの違いと使い分け",
    "description": "データベースやバックエンドを含むアプリ向けのRailwayと、静的なHTMLを今すぐ関係者に見せる用途では必要なインフラが全く異なります。サーバーアプリか静的共有か、自分の状況に合った選択ができます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "flyio-vs-share",
    "path": "/articles/flyio-vs-share",
    "title": "Fly.ioとの違いと使い分け｜エッジPaaSと一時HTML共有",
    "description": "エッジPaaSのFly.ioはコンテナアプリの本番運用に強みがありますが、できあがったHTMLを今すぐ誰かに確認してもらいたい場面ではデプロイ作業が過剰になりがちです。フェーズで手段を分けるための比較指針を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "deno-deploy-vs-share",
    "path": "/articles/deno-deploy-vs-share",
    "title": "Deno Deployとの違い｜エッジ実行と一時HTML共有",
    "description": "TypeScript/JavaScriptをエッジ実行するDeno Deployと、静的HTMLを認証付きで一時共有する用途は設計レベルから異なります。動的処理が必要かどうかを判断軸に、状況に合った選択肢が分かります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "neocities-vs-share",
    "path": "/articles/neocities-vs-share",
    "title": "Neocitiesとの違い｜無料静的ホスティングと一時HTML共有",
    "description": "個人サイトを長く育てるNeocitiesと、特定の相手にだけ期限付きでHTMLを見せる用途は、公開の方向性が根本から違います。全世界に向けた発信か、限定共有かで選ぶべき手段がはっきり分かれます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hostinger-vs-share",
    "path": "/articles/hostinger-vs-share",
    "title": "Hostingerとの違いと使い分け｜低価格ホスティングと一時HTML共有",
    "description": "低価格で本番サイトを運用できるHostingerはWordPressにも向きますが、制作物を今すぐ関係者に確認してもらいたいだけの場面では準備コストが見合わないこともあります。目的別の賢い使い分け方を比べて判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "clinic-patient-info-share",
    "path": "/articles/clinic-patient-info-share",
    "title": "クリニック・医院が患者向け案内HTMLを共有する方法",
    "description": "患者向けの検査前説明や診療案内をHTMLで渡したいクリニック担当者向けに、不特定多数に公開せず本人だけに届け、期限が来たら自動で閉じる運用のしくみを実例付きで解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "salon-menu-share",
    "path": "/articles/salon-menu-share",
    "title": "美容室・サロンがメニュー・予約案内を共有する方法",
    "description": "料金改定やキャンペーン案内をチラシを刷り直さずにお客さまへ届けたいサロン向けに、HTMLメニューページをURL・QRコードで素早く配布し、更新も差し替えも手軽に済ませる方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cram-school-share",
    "path": "/articles/cram-school-share",
    "title": "学習塾が保護者・生徒に案内HTMLを共有する方法",
    "description": "時間割変更や成績レポート、保護者会の案内など、頻繁に発生する連絡を保護者と生徒に確実に届けたい塾のスタッフ向けに、案内HTMLを関係者だけへ限定共有する運用方法を整理します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gym-fitness-share",
    "path": "/articles/gym-fitness-share",
    "title": "ジム・フィットネスがプラン案内LPを共有する方法",
    "description": "本番サイトに載せる前に、新しい料金プランや体験キャンペーンのLPを少人数でテストしたいジム運営者向けに、プラン案内ページをすぐ共有して反応を確かめる方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wedding-info-share",
    "path": "/articles/wedding-info-share",
    "title": "ウェディングの招待状・案内ページを限定共有する方法",
    "description": "Web招待状やアクセス案内を招いた方だけに届け、式が終わったら自然に閉じたい新郎新婦向けに、パスワードで閲覧者を限定し期限付きで運用する共有のやり方を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "npo-activity-report-share",
    "path": "/articles/npo-activity-report-share",
    "title": "NPO・非営利団体が活動報告HTMLを共有する方法",
    "description": "活動報告や会計報告を寄付者・会員だけに届け、一般公開は避けたいNPO事務局向けに、会員限定の認証付き共有URLで報告HTMLを配布し、閲覧管理する方法をまとめます。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "local-government-notice-share",
    "path": "/articles/local-government-notice-share",
    "title": "自治体・行政が住民向け案内HTMLを共有する方法",
    "description": "イベントや手続き案内を住民に届けたいが、本番サイトの更新手続きが重く期限切れ案内が残ることに悩む自治体担当者向けに、案内HTMLを期限付きで運用するしくみを解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "youtuber-mediakit-share",
    "path": "/articles/youtuber-mediakit-share",
    "title": "YouTuber・配信者がメディアキットを企業に共有する方法",
    "description": "企業案件の提案でメディアキットを毎回PDFで送っているYouTuber・配信者向けに、数字が変わってもURLを使い回せる認証付き媒体資料ページの作り方と管理方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "handmade-creator-catalog-share",
    "path": "/articles/handmade-creator-catalog-share",
    "title": "ハンドメイド作家が作品カタログを共有する方法",
    "description": "受注会や卸先への提案で、重いメール添付や印刷に代わる手段を探しているハンドメイド作家向けに、作品カタログを認証付きURLで限定共有し、先行客やバイヤーだけに届ける方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "travel-agency-itinerary-share",
    "path": "/articles/travel-agency-itinerary-share",
    "title": "旅行代理店が旅程・ツアー案内を共有する方法",
    "description": "顧客ごとに作る旅程表や宿泊案内のPDFを変更のたびに送り直す手間に悩む旅行代理店スタッフ向けに、一つのURLで最新版を管理し顧客限定で届ける方法を整理します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "podcaster-sponsor-share",
    "path": "/articles/podcaster-sponsor-share",
    "title": "ポッドキャスターがショーノート・スポンサー資料を共有する方法",
    "description": "広告枠の売り込みに使う媒体資料の数字が毎月変わり、PDFの再送が手間になっているポッドキャスター向けに、常に最新データを届けられる認証付き共有ページの作り方を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "doujin-circle-share",
    "path": "/articles/doujin-circle-share",
    "title": "同人サークルが頒布物・お品書きを限定共有する方法",
    "description": "イベント前にお品書きや頒布物の見本を委託先やスタッフに確認してもらいたいが、SNSに出す前に広まるのは避けたい同人サークル向けに、関係者限定で認証付き共有する方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "crowdfunding-page-share",
    "path": "/articles/crowdfunding-page-share",
    "title": "クラウドファンディングのページ案を関係者に共有する方法",
    "description": "公開前のクラウドファンディングページ案を支援者候補や編集者に見せてフィードバックを集めたい起案者向けに、未公開の原稿を認証付きURLで限定共有する方法と注意点を整理します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "insurance-agent-proposal-share",
    "path": "/articles/insurance-agent-proposal-share",
    "title": "保険代理店がプラン提案資料を顧客に安全に共有する方法",
    "description": "保障内容や設計書など個人情報を含む資料を顧客に安全に届けたい保険代理店向けに、認証と公開期限を組み合わせた一時共有URLで情報漏えいリスクを抑える運用方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dentist-patient-share",
    "path": "/articles/dentist-patient-share",
    "title": "歯科医院が治療説明HTMLを患者に共有する方法",
    "description": "治療計画や口腔内写真の説明資料を患者が自宅で読み返せる形で渡したい歯科医院向けに、本人だけに届き後から差し替えも可能な限定共有ページの運用手順を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "coach-program-share",
    "path": "/articles/coach-program-share",
    "title": "コーチ・カウンセラーがプログラム案内を共有する方法",
    "description": "体験セッション後にプログラム詳細や料金を個別に案内したいコーチ・カウンセラー向けに、HTMLでまとめた料金ページを毎回作り直さずURLで手軽に渡す方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "video-creator-storyboard-share",
    "path": "/articles/video-creator-storyboard-share",
    "title": "動画クリエイターが企画書・絵コンテを共有する方法",
    "description": "絵コンテや構成案の修正のたびにファイルを送り直し「どれが最新？」と聞かれる状況に悩む動画クリエイター向けに、確認用URLを一本化して常に最新版だけを見せる方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "illustrator-rough-share",
    "path": "/articles/illustrator-rough-share",
    "title": "イラストレーターがラフ・納品データを共有する方法",
    "description": "ラフや納品前データを共有する際に、URLが広まって意図せず転載される不安を抱えているイラストレーター向けに、閲覧者を限定し期限で自動閉鎖する安全な共有方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "architect-plan-share",
    "path": "/articles/architect-plan-share",
    "title": "建築士・設計事務所が設計プラン・パースを施主に共有する方法",
    "description": "打ち合わせのたびに更新される設計プランやパースを施主と共有する際、古い版が残って認識がずれてしまう課題を抱える建築士・設計事務所向けに、最新版を一つのURLで管理する方法を整理します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hr-onboarding-share",
    "path": "/articles/hr-onboarding-share",
    "title": "人事が内定者向けオンボーディング資料を共有する方法",
    "description": "内定から入社初日までに伝えることが多く、メール散在による見落としや更新のたびの再送に悩む人事担当者向けに、オンボーディング資料を一つのURLで管理し内定者に届ける方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "publisher-galley-share",
    "path": "/articles/publisher-galley-share",
    "title": "出版社がゲラ・試し読みを関係者に共有する方法",
    "description": "校正者や書店、レビュアーに発売前のゲラを見せる必要がある一方、外部への流出や発売後も古いPDFが残ることを避けたい出版社担当者向けに、認証・期限付きで原稿を安全に共有する方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "musician-epk-share",
    "path": "/articles/musician-epk-share",
    "title": "ミュージシャンがEPK（電子プレスキット）を共有する方法",
    "description": "ライブ打診やメディア掲載の依頼でEPKを送る際、重いファイル添付や雑然とした共有リンクでは印象を損ねてしまいます。音源・プロフィール・宣材写真を一本のURLでスマートに届けるやり方をミュージシャン向けに紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "retail-pop-proposal-share",
    "path": "/articles/retail-pop-proposal-share",
    "title": "小売がPOP・販促物の試作を店舗・取引先に共有する方法",
    "description": "本部が作ったPOPや販促デザインの試作を店舗・取引先に確認してもらう際、版が乱立して最新がわからなくなる問題を抱えている小売担当者向けに、認証付きURLで一元管理する共有方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "beauty-clinic-treatment-share",
    "path": "/articles/beauty-clinic-treatment-share",
    "title": "美容クリニックが施術案内を限定共有する方法",
    "description": "施術メニューや料金、同意事項の説明を見込み客や予約済み患者に個別に届けたい美容クリニック向けに、一般公開せず認証付きで閲覧者を絞った案内ページの運用方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "franchise-manual-share",
    "path": "/articles/franchise-manual-share",
    "title": "フランチャイズ本部が加盟店にマニュアルHTMLを共有する方法",
    "description": "加盟店ごとに異なる手順が現場に残ることを防ぎたいフランチャイズ本部向けに、マニュアルHTMLを加盟店限定の認証付きURLで配布し、改定のたびに最新版へそろえる運用方法を整理します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-dns",
    "path": "/articles/what-is-dns",
    "title": "DNSとは？ドメインとサーバーをつなぐ仕組みをやさしく解説",
    "description": "URLを入力するだけでページが開く仕組みを支えるDNSを、名前解決の流れから初めて学ぶ人向けにやさしく整理。ドメインとIPアドレスの関係を理解すると、サイト公開や障害対応の疑問が一気にクリアになります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-domain",
    "path": "/articles/what-is-domain",
    "title": "ドメインとは？URLの住所をやさしく解説",
    "description": "取得・設定の前に知っておきたいドメインの基本を整理。サブドメインや独自ドメインとの違いに戸惑っているWeb初心者が、URLの構造を正しく読み解くための入門知識として読める記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-url-structure",
    "path": "/articles/what-is-url-structure",
    "title": "URLの構造とは？スキーム・ホスト・パスの意味を解説",
    "description": "スキーム・ホスト・パス・クエリと、URLを構成するパーツが何を意味するのかを分解して解説。開発やSEO設定でURLを操作しなければならない人が、構造を正しく理解するための土台になります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-http-status-code",
    "path": "/articles/what-is-http-status-code",
    "title": "HTTPステータスコードとは？主要な番号の意味",
    "description": "200・301・403・404・500など、よく見かける番号が何を伝えているのかを体系的に整理。エラーの原因調査やサイト改修で「ステータスコードの意味が分からない」と感じたときに役立つ入門解説です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-404",
    "path": "/articles/what-is-404",
    "title": "404エラーとは？ページが見つからない原因と仕組み",
    "description": "リンクをクリックしたらページが見つからないと表示された――その原因が404なのか、そもそも何が起きているのかを整理。リンク切れや削除後のURL管理を考えるための基礎知識として読めます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-403",
    "path": "/articles/what-is-403",
    "title": "403 Forbiddenとは？アクセスが拒否される意味",
    "description": "「アクセスが拒否されました」と表示されたとき、404との違いや認証・権限設定のどこに問題があるのかを切り分けるための知識を整理。設定ミスを調べるときの手がかりになります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-redirect",
    "path": "/articles/what-is-redirect",
    "title": "リダイレクトとは？301と302の違いをやさしく解説",
    "description": "URLが変わったときに古いリンクを生かし続けるリダイレクト。恒久移動の301と一時転送の302の違いを誤ると、SEO評価の引き継ぎに失敗することも。違いを正確に理解したい人向けの解説です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-mixed-content",
    "path": "/articles/what-is-mixed-content",
    "title": "mixed content（混在コンテンツ）とは？httpsページの警告",
    "description": "HTTPSページなのに画像が出ない、アドレスバーに警告が出る原因として多いのが混在コンテンツ。ブロックされる仕組みを理解し、修正方針を判断できるようになりたいウェブ担当者向けの解説です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-mime-type",
    "path": "/articles/what-is-mime-type",
    "title": "MIMEタイプとは？ファイルの種類を伝える仕組み",
    "description": "CSSが当たらない・JSが動かないトラブルの背後にあることが多いMIMEタイプ。Content-Typeが何を決め、どこで設定されるのかを知ると、謎の表示崩れや動作不良の原因を素早く特定できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-viewport",
    "path": "/articles/what-is-viewport",
    "title": "viewportとは？スマホ表示を整えるmetaタグの基礎",
    "description": "スマホで開いたとき文字が極端に小さく全体が縮む問題を解消するviewportの基本。metaタグの書き方と効果を正しく理解して、スマホ対応の第一歩を踏み出したい人向けの入門解説です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-doctype",
    "path": "/articles/what-is-doctype",
    "title": "DOCTYPEとは？HTML宣言の役割をやさしく解説",
    "description": "HTMLの先頭に置くDOCTYPE宣言は省いても動くように見えて、ブラウザの描画モードを左右します。なぜ必要なのか、省略するとどんな表示崩れが起きるのかを知りたい初心者向けの解説です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-utf8",
    "path": "/articles/what-is-utf8",
    "title": "文字コード・UTF-8とは？文字化けを防ぐ基礎知識",
    "description": "日本語ページが別環境で文字化けするのは文字コードのずれが原因です。UTF-8が何をしているのか、どこで指定すれば文字化けを防げるのかを知りたい人向けに、しくみと対策をやさしく説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-base64",
    "path": "/articles/what-is-base64",
    "title": "Base64とは？画像を文字列で埋め込むdata URIの仕組み",
    "description": "HTMLに埋め込まれた長い英数字の画像URLがどういうものかを知りたい人向けに、Base64とdata URIの仕組みをやさしく解説。使いどころとファイル肥大化のトレードオフも合わせて整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-webfont",
    "path": "/articles/what-is-webfont",
    "title": "Webフォントとは？woff2と表示の仕組み",
    "description": "読み込み時に文字がちらつく・しばらく表示されないFOUT/FOITに悩むウェブ制作者向けに、Webフォントの仕組みとwoff2の特徴を解説。表示速度とデザイン品質のバランスを取るための判断材料が得られます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-web-vs-app",
    "path": "/articles/what-is-web-vs-app",
    "title": "WebサイトとWebアプリの違いとは？",
    "description": "ホームページとWebアプリが同じブラウザで開くのに何が違うのか曖昧なまま作業している方へ。静的・動的という観点で整理するとファイル共有やプレビューの仕組みを選ぶときの判断軸が明確になります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-spa",
    "path": "/articles/what-is-spa",
    "title": "SPA（シングルページアプリ）とは？仕組みと特徴",
    "description": "ページ遷移なしにスムーズ動作するWebサービスの多くを支えるSPAの仕組みを理解したい人向けの解説。利便性の裏にある初期表示やSEO上の注意点も含めて、技術選定の参考になる情報を整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-ssr-csr",
    "path": "/articles/what-is-ssr-csr",
    "title": "SSRとCSRの違いとは？描画方式の基礎",
    "description": "ページの中身をサーバーで作るかブラウザで作るかによって、表示速度や検索への出やすさが変わります。SSRとCSRの違いをゼロから学びたい人が、自分のケースに合う描画方式を選ぶための解説です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-pwa",
    "path": "/articles/what-is-pwa",
    "title": "PWAとは？アプリのように使えるWebの仕組み",
    "description": "Webサイトなのにホーム画面にアイコンが追加でき、アプリのように起動できるPWAの仕組みを整理。ネイティブアプリとの違いや、オフライン対応の仕組みを知りたい人向けの入門記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-jamstack",
    "path": "/articles/what-is-jamstack",
    "title": "JAMstackとは？静的サイトの新しい作り方",
    "description": "あらかじめページを生成して配信するJAMstackの考え方を、従来のサーバー依存型との違いから整理。静的ファイルで高速・安全なサイトを作る手法を理解したい制作者向けの解説です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-headless-cms",
    "path": "/articles/what-is-headless-cms",
    "title": "ヘッドレスCMSとは？従来CMSとの違い",
    "description": "コンテンツ管理と表示レイヤーを切り離すヘッドレスCMSの特徴を、従来CMSと比較しながら整理。複数チャネルへの配信を考えているコンテンツ担当者や開発者が、導入判断できる情報を得られる記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-google-analytics",
    "path": "/articles/what-is-google-analytics",
    "title": "Googleアナリティクスとは？アクセス解析の基礎",
    "description": "GA4でサイトへの流入や行動をどう把握するかを知りたい初心者向けに、基本指標と導入の流れをやさしく解説。「数字が出てもどう読めばいいか分からない」という人の入口になる記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-core-web-vitals",
    "path": "/articles/what-is-core-web-vitals",
    "title": "Core Web Vitalsとは？表示速度・体験の指標",
    "description": "LCP・INP・CLSがそれぞれ何を測り、どの数値を目指せばいいのかを整理したい人向けの解説。ページ品質の改善を始めるにあたって指標の意味を正しく理解するための入門記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-lighthouse",
    "path": "/articles/what-is-lighthouse",
    "title": "Lighthouseとは？ページ品質を計測するツール",
    "description": "Lighthouseのスコアが出たものの数字の意味や次のアクションに迷っている人向けに、各項目の読み方と改善への活かし方を整理。計測で終わらず改善につなげるための実践的な解説です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-alt-text",
    "path": "/articles/what-is-alt-text",
    "title": "alt属性とは？画像の代替テキストの役割",
    "description": "画像に代替テキストがなくても見た目は変わらないのに、なぜ重要なのかを知りたい人向けに、アクセシビリティとSEO双方での役割を整理。魅力的で自然なaltの書き方のコツも学べます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-structured-data",
    "path": "/articles/what-is-structured-data",
    "title": "構造化データとは？検索表示をリッチにする仕組み",
    "description": "検索結果に星評価やFAQが出る仕組みが気になる方へ。schema.orgとJSON-LDの基礎から、リッチリザルトが表示されるまでの流れを整理し、実際に導入できるところまで案内する解説記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-canonical",
    "path": "/articles/what-is-canonical",
    "title": "canonicalとは？重複URLを正規化するタグ",
    "description": "URLが複数存在すると検索エンジンが評価を分散させてしまう問題を、canonicalタグでどう解決するかを整理。重複コンテンツに悩むサイト担当者が正しい設定方法を判断できる解説です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-sitemap",
    "path": "/articles/what-is-sitemap",
    "title": "サイトマップ（sitemap.xml）とは？役割と作り方",
    "description": "新しいページを検索エンジンに早く見つけてほしいときに役立つsitemap.xmlの意味と役割を整理。作り方からSearch Consoleへの送信まで、初心者が一通り把握できる流れを解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-robots-txt",
    "path": "/articles/what-is-robots-txt",
    "title": "robots.txtとは？クローラーへの指示ファイル",
    "description": "robots.txtで「このページは見ないで」と伝えたつもりが、実は意図とは逆の結果になることも。クローラーへの指示ファイルの書き方と、誤解しやすい限界を知りたい担当者向けの解説です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-crawler",
    "path": "/articles/what-is-crawler",
    "title": "クローラー・クローリングとは？検索エンジンの巡回",
    "description": "サイトを公開しても検索に出るためにはクローラーに訪問してもらう必要があります。クローラーがどうページを発見し、どんな順番で回るのかを知りたい人向けに、仕組みをかみ砕いて解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-indexing",
    "path": "/articles/what-is-indexing",
    "title": "インデックスとは？検索結果に載る仕組み",
    "description": "クロールされても検索結果に出ないのはインデックスという別工程があるから。登録される仕組みと、インデックスを妨げる要因を整理することで、検索表示に悩むサイト担当者の問題解決を助ける記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-breadcrumb",
    "path": "/articles/what-is-breadcrumb",
    "title": "パンくずリストとは？役割とSEO効果",
    "description": "「ホーム > カテゴリ > 記事」と続くナビゲーションがなぜ必要なのかを、ユーザー体験と検索エンジン評価の両面から整理。パンくずリストを適切に実装したい方向けの基礎解説です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-query-parameter",
    "path": "/articles/what-is-query-parameter",
    "title": "クエリパラメータとは？URLの?以降の意味",
    "description": "URLの「?」以降に並ぶ英数字が何を意味するのか知りたい人向けに、検索・絞り込み・アクセス計測での使われ方を具体例で解説。扱い方を誤るとSEOに影響することも踏まえて整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-short-url",
    "path": "/articles/what-is-short-url",
    "title": "短縮URLとは？仕組みと使うときの注意点",
    "description": "SNSやチラシで便利な短縮URLが、転送先を事前に見えにくくするという側面も持つことを知った上で使いたい人向けに、仕組みと注意点をバランス良く説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-minify",
    "path": "/articles/what-is-minify",
    "title": "ミニファイ（minify）とは？ファイル圧縮の基礎",
    "description": "HTMLやCSS、JSのファイルを軽くして表示速度を上げるミニファイが、何をどう削っているのかを知りたい人向けに、仕組みと効果、デバッグ時の注意点をやさしく整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-staging",
    "path": "/articles/what-is-staging",
    "title": "ステージング環境とは？本番前の確認環境",
    "description": "本番に出す前に同じ条件で確認できるステージング環境がなぜ必要なのか、開発環境との違いは何かを整理。公開前の品質チェックの流れを把握したいウェブ担当者向けの入門解説です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safari-only-display-issue",
    "path": "/articles/safari-only-display-issue",
    "title": "Safariだけ表示が崩れるときの原因と対処",
    "description": "他のブラウザでは崩れないのにSafariだけレイアウトがズレる――WebKit特有の挙動や未対応CSSが原因であることが多いこの問題を、崩れ方のパターンから原因と対処まで体系的に整理した記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "chrome-vs-edge-difference",
    "path": "/articles/chrome-vs-edge-difference",
    "title": "ChromeとEdge・Firefoxで表示が違うときの対処",
    "description": "ChromeとFirefox・Edgeでページの見え方が違う場合に、どのブラウザ間でどんな差が生まれやすいかを整理。ブラウザ固有のエンジン差や既定スタイルを理解して、対処の優先順位を決めるための記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "print-layout-broken",
    "path": "/articles/print-layout-broken",
    "title": "印刷すると崩れる・はみ出すときの対処",
    "description": "画面では整っているのに印刷すると文字が切れたり右端がはみ出したりする悩みを持つ人向けに、印刷用CSSとページ設定で崩れを防ぐ具体的な手順を説明します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dark-mode-unreadable",
    "path": "/articles/dark-mode-unreadable",
    "title": "ダークモードで文字が読めないときの対処",
    "description": "ライトモードでは読めるのにダークモードにすると文字が背景に溶ける現象の仕組みを理解し、どの設定を直せば両モードで読める配色を保てるかを判断したい人向けの解説です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "emoji-tofu",
    "path": "/articles/emoji-tofu",
    "title": "絵文字・特殊文字が□（豆腐）になるときの対処",
    "description": "絵文字や記号が□や文字化けで表示される悩みを持つ人向けに、豆腐と文字化けの原因の違いを区別しながら、フォントと文字コードの両面から切り分けて直す手順を説明します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "svg-not-showing",
    "path": "/articles/svg-not-showing",
    "title": "SVG画像が表示されないときの原因と対処",
    "description": "PNGは表示されるのにSVGだけ出ない――MIMEタイプや読み込み方法の違いによる複数の原因を、症状ごとに切り分けて特定できるよう整理した記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "canvas-webgl-not-working",
    "path": "/articles/canvas-webgl-not-working",
    "title": "canvas・WebGLが動かないときの原因と対処",
    "description": "共有したゲームやビジュアル表現のcanvasが真っ白で何も表示されない場合に、コンテキスト取得・サイズ指定・リソース読み込みの観点から原因を素早く特定する方法を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "audio-not-playing",
    "path": "/articles/audio-not-playing",
    "title": "音声（audio）が再生されないときの対処",
    "description": "ページを開いた直後に音声を鳴らそうとしたら無音だった場合に、ブラウザのautoplay制限がなぜ存在するのかを理解し、ユーザー操作を起点にした正しい音声再生の実装方法を学べる記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "localstorage-not-working",
    "path": "/articles/localstorage-not-working",
    "title": "localStorageが使えない・保存されないときの対処",
    "description": "リロードすると保存した内容が消えてしまうlocalStorageのトラブルを、プライベートモード・容量上限・JSON変換漏れの観点から切り分けて解決したい開発者向けの実践的な解説です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cookie-not-saved",
    "path": "/articles/cookie-not-saved",
    "title": "クッキーが保存されないときの原因と対処",
    "description": "CookieをセットしてもSameSiteやSecure属性の条件を満たしていないと保存も送信もされません。属性ごとの要件を理解してログイン状態の保持を正しく実装したい人向けの解説記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cors-error",
    "path": "/articles/cors-error",
    "title": "CORSエラーで外部データが読めないときの対処",
    "description": "外部APIをfetchしたらCORSでブロックされた――誰が許可を出す必要があり、フロント側でできること・できないことの境界線はどこかを理解することで、対処方針を正しく判断できる記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-animation-not-working",
    "path": "/articles/css-animation-not-working",
    "title": "CSS・JSアニメーションが動かないときの対処",
    "description": "ホバーで何も起きない、要素がふわっと出てこないアニメーション不具合の原因を、変化前後の状態・タイミング・対象プロパティの観点から切り分けて解決したい人向けの解説です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "position-fixed-broken",
    "path": "/articles/position-fixed-broken",
    "title": "position:fixedの要素がずれるときの対処",
    "description": "position:fixedを指定したはずの要素がスクロールでずれる場合に、犯人が要素自身ではなく祖先のtransformなどにあることを理解し、素早く特定・修正できるようになる記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hover-not-working-mobile",
    "path": "/articles/hover-not-working-mobile",
    "title": "スマホでホバーが効かないときの対処",
    "description": "PCでは動くホバー演出がスマホでは効かない・タップ後に状態が残るのは、タッチ端末にホバー状態がないことが根本原因です。スマホで意図通り動く実装に切り替えるための考え方と方法を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "table-overflow",
    "path": "/articles/table-overflow",
    "title": "表（table）が画面からはみ出すときの対処",
    "description": "PCでは収まる表がスマホでレイアウト全体を崩してはみ出す問題を、overflowやレスポンシブ向けのCSS手法で解決したい人向けに、列の多い表を破綻させない具体策を整理します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "horizontal-scroll-bug",
    "path": "/articles/horizontal-scroll-bug",
    "title": "意図しない横スクロールが出るときの原因と対処",
    "description": "スマホで横に少しだけスクロールできてしまう謎の余白。原因は特定の要素が画面幅をわずかに超えていることです。どこが犯人かを効率よく見つける手順と、よくある原因パターンを知りたい方向けに解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "image-distorted",
    "path": "/articles/image-distorted",
    "title": "画像が縦長・横長に潰れるときの対処",
    "description": "サムネイルやヒーロー画像が縦に伸びたり横に潰れたりして困っている方へ。縦横比を崩さずに枠いっぱいに収める CSS の指定方法と、比率を保ったまま表示する考え方をケース別に整理します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "background-image-not-showing",
    "path": "/articles/background-image-not-showing",
    "title": "背景画像が表示されないときの原因と対処",
    "description": "CSS で background-image を指定しても背景が出ない原因は、パスのミス・高さゼロ・url() の書式エラーに集中します。闇雲に書き換える前に、どのパターンかを素早く見分けるチェック手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "youtube-embed-not-showing",
    "path": "/articles/youtube-embed-not-showing",
    "title": "YouTube埋め込みが表示されないときの対処",
    "description": "iframe を貼ったはずなのに YouTube 動画が枠だけで再生できない。原因はコードの誤りか許可設定のどちらかです。表示されない典型パターンを切り分けて、確実に直す方法をまとめます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-maps-embed-not-showing",
    "path": "/articles/google-maps-embed-not-showing",
    "title": "Googleマップ埋め込みが表示されないときの対処",
    "description": "ページにグーグルマップを貼ったら灰色の枠だけ表示される、または読み込みエラーになる。シンプルな iframe 埋め込みと API キー方式では原因が異なるため、自分のケースを判断するための切り分け手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "x-twitter-embed-not-showing",
    "path": "/articles/x-twitter-embed-not-showing",
    "title": "X（Twitter）埋め込みが表示されないときの対処",
    "description": "X のポストを埋め込んだのに装飾されないリンクのままになってしまう。ほぼ全ての場合は widgets.js の読み込み漏れが原因です。仕組みを理解して確実に解決する方法を手順ごとに整理します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "external-api-not-working",
    "path": "/articles/external-api-not-working",
    "title": "外部APIが呼べない・データが出ないときの対処",
    "description": "JavaScript で外部 API を叩いたのにデータが出ず、コンソールに赤いエラーが並ぶ。CORS・API キー・HTTPS の3パターンそれぞれでエラーの出方が違います。見分け方と対処を素早く特定する手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "timezone-date-wrong",
    "path": "/articles/timezone-date-wrong",
    "title": "日付・時刻がずれるときの対処（タイムゾーン）",
    "description": "予約日時が9時間ズレる、日付が1日前後する。原因の多くは UTC とローカル時刻の混在です。タイムゾーンのずれが起きる仕組みと典型パターンを押さえ、バグを再発させない直し方を整理します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ime-input-issue",
    "path": "/articles/ime-input-issue",
    "title": "入力フォームで日本語変換がおかしいときの対処",
    "description": "フォームで日本語を入力すると変換中に文字が消える、Enter で変換確定しただけなのに送信されてしまう。IME イベントの扱いを正しく理解すれば誤動作を防げます。対処法を実例付きで解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "mobile-zoom-issue",
    "path": "/articles/mobile-zoom-issue",
    "title": "スマホでズームできない・勝手にズームするときの対処",
    "description": "スマホでページを開いたらピンチ拡大ができない、フォームをタップした瞬間に画面が自動でズームしてしまう。viewport 指定とフォントサイズの組み合わせが原因です。何を見てどう直すかを順に解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "scroll-position-not-restored",
    "path": "/articles/scroll-position-not-restored",
    "title": "ページ内リンクでスクロール位置がずれるときの対処",
    "description": "目次リンクをクリックすると飛んだ先の見出しが固定ヘッダーの裏に隠れてしまう。アンカーリンクとスクロール基準のずれが原因で、数行の CSS で解決できます。仕組みと対処手順を整理します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "custom-404-page",
    "path": "/articles/custom-404-page",
    "title": "404ページを自分で用意したいときの考え方",
    "description": "存在しないURLへのアクセス時に表示される 404 ページを自分でデザインしたい方へ。静的 HTML サイトと本番運用では設定方法が異なります。まず 404 の仕組みを正しく把握してから実装する手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "redirect-loop",
    "path": "/articles/redirect-loop",
    "title": "リダイレクトループが起きるときの原因と対処",
    "description": "「リダイレクトが繰り返されています」と表示されてページが開けない。転送先が転送元に戻るループが原因で、起きる理由は限られています。原因を順に絞り込んで素早く解決するための切り分け方を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "large-file-upload-fail",
    "path": "/articles/large-file-upload-fail",
    "title": "ファイルが大きくてアップロードできないときの対処",
    "description": "サイトのアップロードが容量オーバーで失敗してしまう。多くの場合は画像や動画が原因です。闇雲に分割する前に、何が容量を食っているかを把握してから削る手順を整理します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webfont-bold-not-applied",
    "path": "/articles/webfont-bold-not-applied",
    "title": "フォントが太字・斜体にならないときの対処",
    "description": "font-weight: bold を指定しても見た目が変わらない、またはぼやけた太字になってしまう。Web フォントの太字・斜体は対応するフォントデータが必要です。仕組みを理解して確実に適用するための確認手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-on-x-twitter",
    "path": "/articles/share-on-x-twitter",
    "title": "公開URLをX（Twitter）でシェアして見栄えよく見せる方法",
    "description": "X に URL を貼っても味気ないリンクのままになってしまう経験はありませんか。OGP の設定次第で画像付きカードとして表示できます。シェアを見栄えよくするための設定方法と確認ツールの使い方を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-on-facebook",
    "path": "/articles/share-on-facebook",
    "title": "公開URLをFacebookでシェアする方法",
    "description": "Facebook に URL を投稿したらサムネイルが出なかったり古いタイトルのままだったり。OGP とキャッシュが原因のことがほとんどです。きれいに表示させる設定とシェアデバッガーを使ったキャッシュ更新の手順を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-on-linkedin",
    "path": "/articles/share-on-linkedin",
    "title": "公開URLをLinkedInでシェアする方法",
    "description": "ビジネス SNS である LinkedIn では、共有リンクの見え方が信頼度の第一印象を左右します。タイトルと画像が整ったカード表示にするための OGP 設定と、用途に合わせた共有方法を具体的に解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "add-url-to-email-signature",
    "path": "/articles/add-url-to-email-signature",
    "title": "共有URLをメール署名に入れる方法と注意点",
    "description": "メール署名に URL を入れると自然な誘導になりますが、署名は過去のメールにも長く残るため期限切れへの配慮が必要です。共有 URL を署名に組み込む手順と、後で差し替えるときの注意点を整理します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "set-ogp-image",
    "path": "/articles/set-ogp-image",
    "title": "OGP画像を設定してSNSのサムネを整える方法",
    "description": "SNS に URL を貼ったときのサムネイル画像は og:image タグで決まります。設定が抜けるとクリック率にも影響します。og:image の基本的な書き方から、画像が出ないときの確認ポイントまでを手順で解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "set-favicon-howto",
    "path": "/articles/set-favicon-howto",
    "title": "共有ページにファビコンを設定する方法",
    "description": "ブラウザのタブやブックマークに表示されるファビコンは、複数タブを開いたときにページを見分けやすくする重要な要素です。共有ページへのファビコン設定手順と、設定しても表示されないときの確認方法を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "set-page-title-description",
    "path": "/articles/set-page-title-description",
    "title": "ページタイトルと説明文を設定する方法",
    "description": "title タグと meta description は、ブラウザのタブ・SNS カード・共有時の印象を左右する基本要素です。設定が抜けると何のページか伝わりにくくなります。整えるための役割の理解と設定手順を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "manage-multiple-sites",
    "path": "/articles/manage-multiple-sites",
    "title": "複数の公開サイトをまとめて管理する方法",
    "description": "案件が増えるにつれ確認用の公開ページがたまり、どれがいつまで有効か分からなくなりがちです。複数サイトをまとめて管理し、古い URL の残存や取り違えを防ぐ運用のコツを整理します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pause-and-resume-publish",
    "path": "/articles/pause-and-resume-publish",
    "title": "公開を一時停止して後で再開する方法",
    "description": "レビューが一区切りしたページを消さずに止めておきたいときに役立つ一時停止機能。再度見せる予定があるなら URL ごと削除より手戻りが少なく済みます。公開を止めて後から再開する考え方と具体手順を整理します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "check-access-count",
    "path": "/articles/check-access-count",
    "title": "公開URLのアクセス数を確認する方法",
    "description": "確認用 URL を送ったあとに「相手はもう見てくれただろうか」と気になる方へ。アクセスログで開封を確認してから次のアクションをとれば、催促のタイミングを逃さずレビューを前に進められます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "separate-url-per-recipient",
    "path": "/articles/separate-url-per-recipient",
    "title": "共有相手ごとにURLを分けて配る方法",
    "description": "社内向けと社外向け、A 社と B 社で見せたい範囲や期限が違う場合、全員に同じ URL を配ると後から区別できません。相手ごとに URL を分けて配る方法と、アクセス状況を個別に追う運用のポイントを解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "word-to-html-share",
    "path": "/articles/word-to-html-share",
    "title": "WordをHTMLにして共有する方法",
    "description": "Word ファイルを送ると「開けない」「レイアウトが崩れる」と言われることがあります。HTML に変換してブラウザで見せれば相手はクリックひとつで確認できます。Word を HTML 化して共有するまでの流れを解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "markdown-to-html-share",
    "path": "/articles/markdown-to-html-share",
    "title": "MarkdownをHTMLにして共有する方法",
    "description": "Markdown をそのまま渡すと記号だらけで読みにくく見えることがあります。HTML に変換して整形すれば普通の文書として読んでもらえます。Markdown を HTML 化して共有する変換方法と注意点を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "excel-table-to-html-share",
    "path": "/articles/excel-table-to-html-share",
    "title": "Excel・CSVの表をHTMLで共有する方法",
    "description": "Excel や CSV をそのまま送ると開けない・レイアウトがずれると言われることがあります。表を HTML にしてブラウザで見せれば誰でも同じレイアウトで閲覧できます。表の HTML 化から共有までの流れを解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "powerpoint-to-html-share",
    "path": "/articles/powerpoint-to-html-share",
    "title": "PowerPoint・スライドをHTMLにして共有する方法",
    "description": "PowerPoint を送ると環境依存でアニメーションや埋め込みが崩れることがあります。HTML にしてブラウザで見せれば誰でも同じ画面で確認できます。スライドを HTML 化して共有するまでの手順を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "html-instead-of-pdf",
    "path": "/articles/html-instead-of-pdf",
    "title": "PDFの代わりにHTMLで共有するメリットと方法",
    "description": "PDF を送ると端末によって表示が変わり、修正のたびに作り直して再送する手間もかかります。HTML で共有すればリンクひとつで最新版を届けられます。PDF と比較した HTML 共有のメリットと切り替え方を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "preview-before-publish",
    "path": "/articles/preview-before-publish",
    "title": "公開前に表示をプレビュー確認する方法",
    "description": "共有リンクを送ったあとに表示崩れや画像抜けに気づくと相手に余計な手間をかけます。配信後の見え方を事前に自分の目で確かめておけばこうした事故を防げます。公開前プレビューの考え方と確認すべきポイントをまとめます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "republish-after-expiry",
    "path": "/articles/republish-after-expiry",
    "title": "期限切れ後に再公開する方法",
    "description": "期限切れで見られなくなった URL を後からもう一度公開したいときの対処法。古い確認用 URL を残さないための仕組みを理解しつつ、同じ資料を再公開する方法と手順を整理します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-photo-html-from-phone",
    "path": "/articles/share-photo-html-from-phone",
    "title": "スマホの写真入りHTMLを公開する方法",
    "description": "スマホで撮った写真を何枚も個別に送るとバラバラになりがちです。写真をまとめた HTML にして共有 URL にすれば、ひとつのリンクでまとめて見てもらえます。写真入り HTML の作り方から ZIP 公開までの手順を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "shorten-share-url",
    "path": "/articles/shorten-share-url",
    "title": "共有URLを短く・覚えやすくする方法",
    "description": "自動生成の長い URL は口頭で伝えにくく打ち間違いも起きがちです。末尾を分かりやすい文字列に変えて短く覚えやすい URL にできます。カスタムスラッグの設定手順と命名のコツを紹介します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "embed-share-url-in-blog",
    "path": "/articles/embed-share-url-in-blog",
    "title": "共有URLをブログやサイトに埋め込む方法",
    "description": "ブログ記事や既存サイトの中で作った HTML を実際に体験してもらいたいときに役立つ埋め込み方法。リンクとして貼る方法だけでなく iframe で記事内に埋め込む手順と、認証・公開期限との兼ね合いで注意すべき点を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-url-in-qr-poster",
    "path": "/articles/share-url-in-qr-poster",
    "title": "共有URLのQRをポスター・チラシに載せる方法",
    "description": "ポスターやチラシに長い URL を印刷しても読者が打ち込んでくれることは少ないです。QR コードにすればスマホをかざすだけでアクセスしてもらえます。共有 URL の QR 作成から印刷物への配置まで、読み取り精度を保つ注意点も含めて解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-newsletter",
    "path": "/articles/share-html-newsletter",
    "title": "HTMLニュースレター・メルマガを共有する方法",
    "description": "HTMLメルマガは配信後に取り消せません。だからこそ配信前に上司やクライアントに実際の見た目をプレビューで確認してもらうことが重要です。安全かつ素早くレビューを進める共有方法を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-catalog",
    "path": "/articles/share-html-catalog",
    "title": "HTMLカタログ・パンフレットを共有する方法",
    "description": "商品カタログやパンフレットを HTML で作るとリンクやアニメーションも活かせますが、配布前の内容確認と差し替えが課題です。関係者に安全に共有しながら確認と更新をスムーズに進める方法を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-manual",
    "path": "/articles/share-html-manual",
    "title": "HTML操作マニュアルを共有する方法",
    "description": "HTML で作った操作マニュアルは目次リンクや検索も使えて PDF より読みやすい反面、配り方と更新管理が課題です。関係者へ安全に共有し、版を上げても同じ URL で届け続ける運用方法を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-faq-page",
    "path": "/articles/share-html-faq-page",
    "title": "FAQ・ヘルプページのHTMLを共有する方法",
    "description": "FAQ や ヘルプページは文言の正確さがサポート品質を左右します。公開前にサポート・開発・法務など複数の目で確認したい方へ、実際に動く状態で共有してレビューと差し替えをスムーズに進める方法を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-timeline",
    "path": "/articles/share-html-timeline",
    "title": "年表・タイムラインHTMLを共有する方法",
    "description": "沿革やロードマップを年表・タイムライン HTML で作ると時系列を直感的に伝えられますが、公開前の事実確認が欠かせません。動く状態で関係者に共有しながら内容を確認する方法を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-org-chart",
    "path": "/articles/share-html-org-chart",
    "title": "組織図HTMLを共有する方法",
    "description": "組織図は人事異動のたびに更新が必要で、古い図が社内に残りがちです。氏名や部署構成は社外に漏らしたくない情報でもあります。HTML の組織図を安全に共有し、改編のたびに同じ URL で最新化する方法を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-pricing-table",
    "path": "/articles/share-html-pricing-table",
    "title": "料金表HTMLを共有する方法",
    "description": "料金表 HTML ができたら金額や表記を関係者に確認してもらいたいものの、ファイル添付ではすぐにバージョンが散らかります。ブラウザで開ける共有 URL にして安全かつ手軽に確認してもらう手順を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-coming-soon",
    "path": "/articles/share-html-coming-soon",
    "title": "Coming Soon・ティザーページを共有する方法",
    "description": "本公開前のティザーページは関係者で文言やビジュアルを詰めたい一方、情報が外に出るのは避けたいところです。Coming Soon ページを限定で共有しながら公開タイミングをコントロールする方法を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-survey",
    "path": "/articles/share-html-survey",
    "title": "アンケート・フォームHTMLを共有する方法",
    "description": "アンケートやフォームのページは、項目の並びや必須設定を実際の画面で確かめてから配りたいものです。フォーム HTML をそのまま開ける共有 URL にして、回答対象と受付期間をコントロールしながら配布する方法を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-calculator",
    "path": "/articles/share-html-calculator",
    "title": "計算機・シミュレーターHTMLを共有する方法",
    "description": "計算機やシミュレーターは入力に対して正しい値が返るかを実際に動かして検証する必要があります。JS で動く計算ツールをそのままブラウザで開ける共有 URL にして、関係者に検証してもらう手順をまとめます。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-map",
    "path": "/articles/share-html-map",
    "title": "地図入りHTMLページを共有する方法",
    "description": "地図を埋め込んだ案内ページは、ピンの位置や表示が正しいか実際に開いて確認してから配りたいものです。地図入り HTML を共有 URL にして QR コードで配布するところまでの流れを解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-countdown",
    "path": "/articles/share-html-countdown",
    "title": "カウントダウンページを共有する方法",
    "description": "カウントダウンページは残り時間がリアルタイムで正しく動くか、目標日時の設定が合っているかを実際に開いて確認したいものです。HTML を共有 URL にして開始日時に合わせて運用する方法をまとめます。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-digital-card",
    "path": "/articles/share-html-digital-card",
    "title": "デジタル名刺HTMLを共有する方法",
    "description": "肩書きや連絡先が変わっても紙の名刺は相手の手元に古い情報のまま残り続けます。HTML で作ったデジタル名刺なら URL と QR を渡すだけで常に最新のプロフィールを届けられます。素早く共有・更新する方法を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-recipe",
    "path": "/articles/share-html-recipe",
    "title": "レシピHTMLを共有する方法",
    "description": "材料・手順・写真を1ページに凝縮したレシピをURLやQRコードで届けたい人向け。HTMLレシピをパスワード付きプレビューURLとして3秒で公開し、相手がアプリ不要で閲覧できるまでの手順が判断できます。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-certificate",
    "path": "/articles/share-html-certificate",
    "title": "証明書・賞状HTMLを共有する方法",
    "description": "オンライン講座の修了証やイベント賞状をURLで渡したいが、個人名入りの書類を不特定多数に見せるのは困る場合に。認証付き共有リンクで本人だけに届ける方法が判断できます。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-photo-album",
    "path": "/articles/share-html-photo-album",
    "title": "写真アルバムHTMLを共有する方法",
    "description": "イベントや旅行のHTMLアルバムを一括で見せたいが、クラウド共有の設定が面倒と感じている人向け。1つのURLで認証付きに公開し、相手にダウンロードを強いない配り方が選べます。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-whitepaper",
    "path": "/articles/share-html-whitepaper",
    "title": "ホワイトペーパー・資料HTMLを共有する方法",
    "description": "重いPDFの添付やダウンロードフォームを用意せずに提案資料を読んでもらいたい人向け。資料HTMLを認証付きURLで共有し、閲覧状況を把握するまでの手順が分かります。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gitlab-pages-vs-share",
    "path": "/articles/gitlab-pages-vs-share",
    "title": "GitLab Pagesとの違いと使い分け",
    "description": "GitLab Pagesでホスティングしているが「期限付きで関係者だけに今すぐ見せたい」場面で迷っている開発者向け。CI/CDを組まずに一時URLを発行するほうが適したケースを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "bitbucket-vs-share",
    "path": "/articles/bitbucket-vs-share",
    "title": "Bitbucketでの公開との違い",
    "description": "Bitbucketでコードを管理しているが、ビルド済みHTMLをコードを開かずに確認してほしい場面で手間を感じている人向け。リポジトリ招待なしに見た目だけ共有する選択肢が判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "replit-deployments-vs-share",
    "path": "/articles/replit-deployments-vs-share",
    "title": "Replit Deploymentsとの違い",
    "description": "Replit Deploymentsで常時稼働させるほどでもない静的HTMLをとにかく今すぐ見せたい場面で迷っている人向け。常時起動コストと一時共有のどちらが適切か判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "softr-vs-share",
    "path": "/articles/softr-vs-share",
    "title": "Softrとの違い｜ノーコードアプリと一時共有",
    "description": "Softrでアプリを構築するほどではなく、すでにあるHTMLをすぐに確認してほしいだけの場面で迷っている人向け。ノーコードアプリ構築と一時共有のどちらを選ぶか整理できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "glide-vs-share",
    "path": "/articles/glide-vs-share",
    "title": "Glideとの違い｜スプレッドシートアプリと共有",
    "description": "スプレッドシートからアプリを作るGlideと、手元のHTMLをそのまま見せるサービスのどちらが今の用途に合うか迷っている人向け。目的別の使い分け基準が分かります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "bubble-vs-share",
    "path": "/articles/bubble-vs-share",
    "title": "Bubbleとの違いと使い分け",
    "description": "Bubbleでフル機能のWebアプリを組む前に、まず画面だけ関係者に確認してもらいたい場面で迷っている人向け。本格開発着手前に一時共有で検討を進める方法が判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "strikingly-vs-share",
    "path": "/articles/strikingly-vs-share",
    "title": "Strikinglyとの違い",
    "description": "Strikinglyで本番サイトを作るのではなく、手元のHTMLを確認してもらうだけでいい場面で選択肢に迷っている人向け。サイトビルダーと一時共有の前提の違いをはっきり整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "site123-vs-share",
    "path": "/articles/site123-vs-share",
    "title": "Site123との違い",
    "description": "Site123でサイトをゼロから作るのではなく、すでに完成したHTMLを安全に見せたい場面で選択肢に迷っている人向け。「作る」と「見せる」のサービス差を明確に整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webnode-vs-share",
    "path": "/articles/webnode-vs-share",
    "title": "Webnodeとの違い",
    "description": "Webnodeでサイトを構築・運用したいのではなく、できあがったHTMLを認証付きで素早く確認してほしい場面で迷っている人向け。構築ツールと一時共有サービスの違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "coda-vs-share",
    "path": "/articles/coda-vs-share",
    "title": "Coda（ドキュメント公開）との違い",
    "description": "Codaでドキュメントを作って共有するのと、自作HTMLをそのまま見せるのとで、どちらが今の用途に合うか迷っている人向け。ドキュメント共有と静的HTML共有の棲み分けが分かります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "craft-docs-vs-share",
    "path": "/articles/craft-docs-vs-share",
    "title": "Craft（ドキュメント共有）との違い",
    "description": "Craft Docsで文書を共有するのと、手元のHTMLをブラウザでそのまま確認してもらうのとで迷っている人向け。ドキュメントツールと一時HTML共有の役割の差を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "confluence-vs-share",
    "path": "/articles/confluence-vs-share",
    "title": "Confluence（社内wiki公開）との違い",
    "description": "社内wikiのConfluenceに資料を置くのではなく、HTML成果物を外部の取引先に一時的に見せたい場面で迷っている人向け。継続管理と一時共有のどちらが合うか判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "scrapbox-vs-share",
    "path": "/articles/scrapbox-vs-share",
    "title": "Scrapbox/Cosenseとの違い",
    "description": "Cosense(旧Scrapbox)で知識を育てるのと、作ったHTMLを期限付きで外部に見せるのとで迷っている人向け。知識管理ツールと成果物共有の用途の違いが分かります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "esa-kibela-vs-share",
    "path": "/articles/esa-kibela-vs-share",
    "title": "esa・Kibela（社内ドキュメント）との違い",
    "description": "esaやKibelaで社内ドキュメントを管理しているが、外部取引先にHTMLを認証付きで一時共有したい場面で使いにくさを感じている人向け。社内蓄積と外部一時共有の使い分けが判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-docs-publish-vs-share",
    "path": "/articles/google-docs-publish-vs-share",
    "title": "Googleドキュメントのウェブ公開との違い",
    "description": "Googleドキュメントの「ウェブに公開」では制御しにくいと感じている人が、認証・期限付きでHTMLをそのまま見せる方法を選ぶための比較記事です。用途に応じた使い分けが分かります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "microsoft-sway-vs-share",
    "path": "/articles/microsoft-sway-vs-share",
    "title": "Microsoft Swayとの違い",
    "description": "Swayでプレゼンを作るのではなく、自分で書いたHTMLをそのままの見た目で期限付きに確認してもらいたい場面で迷っている人向け。テンプレートツールと一時共有の前提の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "blogger-vs-share",
    "path": "/articles/blogger-vs-share",
    "title": "Bloggerとの違い",
    "description": "Bloggerで記事を継続公開するのではなく、HTMLを関係者だけに一時的に見せたい場面で選択肢に迷っている人向け。継続ブログ運用と限定一時共有のどちらが今の目的に合うか分かります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "medium-vs-share",
    "path": "/articles/medium-vs-share",
    "title": "Mediumとの違い",
    "description": "Mediumで広く読んでもらうのではなく、自作HTMLを関係者だけに一時的に届けたい場面で迷っている人向け。発信プラットフォームと限定共有サービスの役割の差を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "substack-vs-share",
    "path": "/articles/substack-vs-share",
    "title": "Substackとの違い",
    "description": "Substackのメール購読モデルとは異なり、今すぐ特定の相手にHTMLを確認してもらいたい場面で選択肢を整理したい人向け。継続発信と即時一時共有の使い分けが判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ghost-vs-share",
    "path": "/articles/ghost-vs-share",
    "title": "Ghostとの違い",
    "description": "Ghostで本格メディアを継続運用するのではなく、作ったHTMLをレビューしてもらうだけの場面で迷っている人向け。長期運用プラットフォームと一時共有の守備範囲の違いが分かります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tumblr-vs-share",
    "path": "/articles/tumblr-vs-share",
    "title": "Tumblrとの違い",
    "description": "TumblrのSNS的な発信とは別に、作ったHTMLを特定の相手にだけ確認してもらいたい場面で迷っている人向け。マイクロブログと一時共有サービスの役割の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "fc2-vs-share",
    "path": "/articles/fc2-vs-share",
    "title": "FC2ホームページ・ブログとの違い",
    "description": "FC2でホームページを継続運用するのではなく、完成したHTMLをすぐにレビューしてほしいだけの場面で迷っている人向け。老舗ホスティングと一時共有の目的の違いが分かります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "speakerdeck-vs-share",
    "path": "/articles/speakerdeck-vs-share",
    "title": "Speaker Deckとの違い｜スライド共有とHTML共有",
    "description": "PDFスライドをSpeaker Deckで公開するのとは違い、作ったHTMLをそのまま動く状態で確認してほしい場面で迷っている人向け。スライド共有とHTML一時共有の違いが整理できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "slideshare-vs-share",
    "path": "/articles/slideshare-vs-share",
    "title": "SlideShareとの違い",
    "description": "SlideShareで資料を広く公開するのではなく、作ったHTMLを関係者だけにレビューしてもらいたい場面で迷っている人向け。広域公開と限定一時共有の狙いの違いが分かります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "docswell-vs-share",
    "path": "/articles/docswell-vs-share",
    "title": "Docswellとの違い",
    "description": "Docswellで資料を公開・閲覧するのとは異なり、自作HTMLを動く状態のまま確認してほしい場面で選択肢に迷っている人向け。スライド公開とHTML一時共有の違いが判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "issuu-vs-share",
    "path": "/articles/issuu-vs-share",
    "title": "Issuu（電子ブック）との違い",
    "description": "Issuuで電子ブック化するのではなく、自作HTMLをブラウザでそのまま確認してもらいたい場面で迷っている人向け。ページめくり形式の公開とHTML一時共有の前提の違いが分かります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "behance-vs-share",
    "path": "/articles/behance-vs-share",
    "title": "Behance（作品公開）との違い",
    "description": "Behanceで作品を広く公開するのではなく、まだ公開前のHTMLプロトタイプを限られた相手に動く状態で確認してもらいたい場面で迷っている人向け。ポートフォリオ公開と一時確認の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "adobe-portfolio-vs-share",
    "path": "/articles/adobe-portfolio-vs-share",
    "title": "Adobe Portfolioとの違い",
    "description": "Adobe Portfolioで本番ポートフォリオを作るのではなく、制作中のHTMLを限られた相手に先行確認してもらいたい場面で迷っている人向け。本番公開と一時プレビューの使い分けが判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pcloud-transfer-vs-share",
    "path": "/articles/pcloud-transfer-vs-share",
    "title": "pCloud Transfer・Smashとの違い",
    "description": "pCloud TransferやSmashでファイルをダウンロードしてもらうのとは違い、HTMLサイトをブラウザで開いたままレビューしてほしい場面で迷っている人向け。転送と一時URL公開の違いが分かります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "icloud-drive-share-vs-share",
    "path": "/articles/icloud-drive-share-vs-share",
    "title": "iCloud Driveの共有リンクとの違い",
    "description": "iCloud Driveの共有リンクでファイルを渡すのとは異なり、HTMLサイトをブラウザでそのまま動かして確認してほしい場面で迷っているAppleユーザー向け。ファイル共有とHTML一時公開の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-magic-patterns-ui",
    "path": "/articles/share-magic-patterns-ui",
    "title": "Magic Patternsで作ったUIを共有する方法",
    "description": "Magic PatternsでReact UIを生成したあと、開発環境なしに上司やクライアントへ見せたい場面で詰まっている人向け。生成物をHTMLとして一時URLにまとめてレビューを回す手順が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-galileo-stitch-ui",
    "path": "/articles/share-galileo-stitch-ui",
    "title": "Google Stitch（旧Galileo AI）で作ったUIを共有する方法",
    "description": "Google StitchでUIコードを生成したが、レビュー相手への共有方法で悩んでいるデザイナー・エンジニア向け。生成UIをHTMLとして書き出し、認証付きURLで素早く確認してもらう流れが判断できます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-uizard-prototype",
    "path": "/articles/share-uizard-prototype",
    "title": "Uizardで作ったプロトタイプを共有する方法",
    "description": "Uizardで企画段階のプロトタイプを作ったが、関係者に正しく触ってもらえるか共有方法に不安がある人向け。プロトタイプを一時URLとして配り、フィードバックを集めるまでの手順が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-visily-design",
    "path": "/articles/share-visily-design",
    "title": "Visilyで作ったデザインを共有する方法",
    "description": "VisilyでUIデザインを起こしたが、非デザイナーの関係者にスムーズに確認してもらう方法で迷っている人向け。HTMLとして書き出してから一時URLで共有し、検討を前に進める手順が判断できます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-relume-site",
    "path": "/articles/share-relume-site",
    "title": "Relumeで作ったサイト構成を共有する方法",
    "description": "RelumeでAI生成したサイト構成案をクライアントやチームにすり合わせてもらいたいが、見せ方に迷っている人向け。構成HTMLを認証付きURLで配り、方向性確認を効率よく進める方法が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-builder-io-page",
    "path": "/articles/share-builder-io-page",
    "title": "Builder.ioで作ったページを共有する方法",
    "description": "Builder.ioで組んだページを本番に出す前に、関係者に手軽に確認してもらいたい場面で迷っているエンジニア・マーケター向け。ビルドを一時URLとして共有しレビューを早める手順が判断できます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-plasmic-page",
    "path": "/articles/share-plasmic-page",
    "title": "Plasmicで作ったページを共有する方法",
    "description": "Plasmicでデザインしたページをコードベースに組み込む前に、関係者のレビューを手早く得たい人向け。書き出しHTMLを一時URLとして配り、承認フローを短縮する方法が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-locofy-output",
    "path": "/articles/share-locofy-output",
    "title": "Locofyで書き出したコードを共有する方法",
    "description": "Locofyでデザインから書き出したHTMLを、開発環境を開かずに確認してもらいたい場面で詰まっている人向け。書き出し物を整理して一時URLで素早くレビューを回す手順が判断できます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-anima-output",
    "path": "/articles/share-anima-output",
    "title": "Animaで書き出したHTMLを共有する方法",
    "description": "AnimaでFigma/XDから書き出したHTMLを、相手に表示確認やレビューをしてもらう段で手間取っている人向け。書き出し成果物を一時URLにまとめてスムーズに共有する方法が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-teleporthq-site",
    "path": "/articles/share-teleporthq-site",
    "title": "TeleportHQで作ったサイトを共有する方法",
    "description": "TeleportHQで書き出した画面を本番公開とは別に確認用URLとして渡したい場面で迷っている人向け。書き出しHTMLを認証付き一時URLに変換してレビューを効率化する方法が判断できます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-pythagora-app",
    "path": "/articles/share-pythagora-app",
    "title": "Pythagoraで作ったアプリを共有する方法",
    "description": "Pythagoraで生成したアプリのフロント画面をチームやクライアントにフィードバックしてもらいたいが、共有方法で詰まっている人向け。成果物を一時URLとして手早く渡す手順が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-notebooklm-output",
    "path": "/articles/share-notebooklm-output",
    "title": "NotebookLMの成果物を共有する方法",
    "description": "NotebookLMでまとめた成果物を関係者に共有したいが、伝わりにくい渡し方になってしまいがちな人向け。HTMLにして一時URLで配ることで確認をスムーズにする方法が判断できます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-midjourney-gallery",
    "path": "/articles/share-midjourney-gallery",
    "title": "Midjourneyの作品をHTMLギャラリーで共有する方法",
    "description": "Midjourneyで生成した画像をまとめて誰かに見てもらいたいが、一枚ずつ送ると全体感が伝わらないと感じている人向け。HTMLギャラリーにまとめて一時URLで共有する手順が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-stable-diffusion-gallery",
    "path": "/articles/share-stable-diffusion-gallery",
    "title": "画像生成AIの作品をHTMLにまとめて共有する方法",
    "description": "画像生成AIで作った作品を設定情報と一緒に共有したいが、ファイル転送だけでは条件が伝わらないと感じている人向け。作品と生成条件をHTMLにまとめて共有し、検証や講評を深める方法が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-mgx-app",
    "path": "/articles/share-mgx-app",
    "title": "MGX（MetaGPT X）で作ったアプリを共有する方法",
    "description": "MGX(MetaGPT X)で生成したアプリ画面をチームやクライアントに渡す段で、共有手段に詰まっている人向け。成果物を確認用URLとして手早く配りフィードバックを得るまでの流れが判断できます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-flutterflow-app",
    "path": "/articles/share-flutterflow-app",
    "title": "FlutterFlowで作ったアプリのWebプレビューを共有する方法",
    "description": "FlutterFlowで組んだアプリをWeb向けに書き出し、実機やプレビュー環境への招待なしに関係者へ確認してもらいたい人向け。書き出しビルドをリンクで渡してレビューを効率化する方法が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-draftbit-app",
    "path": "/articles/share-draftbit-app",
    "title": "Draftbitで作ったアプリを共有する方法",
    "description": "Draftbitで組んだ画面を関係者に確認してもらいたいとき、書き出したWebファイルをそのまま渡しても相手が開けないことがあります。一時URLを使えばリンクを送るだけで実物を見せられ、ツール契約なしにレビューを進める方法がわかります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "check-ai-html-accessibility",
    "path": "/articles/check-ai-html-accessibility",
    "title": "AI生成HTMLのアクセシビリティを確認してから共有する方法",
    "description": "AI生成HTMLはコードの見た目が整っていても、alt属性の欠落やコントラスト不足が残りがちです。共有前にアクセシビリティの抜けを自分で確認したいエンジニアやデザイナーに向け、押さえるべき観点と確認URLでのレビュー手順を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-26"
  },
  {
    "slug": "check-ai-html-seo",
    "path": "/articles/check-ai-html-seo",
    "title": "AI生成HTMLのSEO・メタを確認してから共有する方法",
    "description": "AIに書かせたHTMLのtitleが空だったりmeta descriptionが重複していたりと、SEOの基本が抜けているケースは珍しくありません。本番公開前に自分でメタと見出しを点検したい方が、何をどの順で確認すればよいかを整理した記事です。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "verify-ai-html-links",
    "path": "/articles/verify-ai-html-links",
    "title": "AIが付けた存在しないリンク・嘘URLを確認する方法",
    "description": "AIが生成したHTMLには、それらしく見えても実在しないURLやエラーになるリンクが混じることがあります。共有先でリンク切れを踏まれる前に、存在しないURLを発見・修正し、確認版をレビューに回すまでの手順を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-ai-html-to-non-engineer",
    "path": "/articles/share-ai-html-to-non-engineer",
    "title": "AIで作ったHTMLを非エンジニアに見せて意思決定する方法",
    "description": "AIで作ったHTMLは手元では動くのに、非エンジニアの上司やクライアントに見せようとするとファイルの開き方で詰まります。技術的な手間を相手にかけず、リンクを開くだけで実物を触って意思決定してもらうための共有方法をまとめました。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "compare-ai-tools-output",
    "path": "/articles/compare-ai-tools-output",
    "title": "複数AIツールの出力HTMLを見比べて選ぶ方法",
    "description": "複数のAIツールに同じ指示を出すと異なるHTMLが返ってきますが、コードを見比べるだけでは品質の差がわかりません。実際の表示で並べて選ぶための方法と、共有URLを使って関係者を交えた比較レビューへつなげる手順を紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-ai-email-html",
    "path": "/articles/share-ai-email-html",
    "title": "AIで作ったHTMLメールの表示を確認・共有する方法",
    "description": "AIに書かせたHTMLメールはエディタ上では良くても、実際のレンダリングで崩れることがあります。自分宛のテスト送信を繰り返さずに表示を確認し、送信前に関係者へ共有してフィードバックを集める効率的な流れを解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-ai-portfolio-site",
    "path": "/articles/share-ai-portfolio-site",
    "title": "AIで作ったポートフォリオサイトを共有する方法",
    "description": "AIツールで作ったポートフォリオのHTMLを相手に届けるとき、レンタルサーバーを借りるほどでもないがファイル添付では見栄えがしない、というジレンマがあります。手軽に共有URLを発行してすぐに見せる方法を手順ごとに紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-ai-proposal-deck",
    "path": "/articles/share-ai-proposal-deck",
    "title": "AIで作った提案資料・スライドを共有する方法",
    "description": "AIで作ったHTMLスライドをクライアントや上司に共有するとき、ファイル添付だとバージョン管理が煩雑になり、機密面も不安です。URLで渡してアクセス期限や認証を付けながらスムーズにレビューを進める方法をまとめています。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-ai-event-lp",
    "path": "/articles/share-ai-event-lp",
    "title": "AIで作ったイベントLPを関係者に共有する方法",
    "description": "AIで作ったイベントLPは本番公開前に主催者や登壇者の確認が必要です。本番サーバーに上げずに関係者へ素早く見せてフィードバックをもらい、修正して再確認する一連の流れを、共有URLを軸に整理した記事です。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "iterate-ai-html-with-feedback",
    "path": "/articles/iterate-ai-html-with-feedback",
    "title": "AI生成HTMLをフィードバックで改善しながら共有する方法",
    "description": "AIで作ったHTMLはレビューと修正を繰り返して仕上がりますが、毎回新しいリンクを送ると関係者がどの版を見ているか混乱します。版を管理しながらフィードバックを反映し、スムーズに次のレビューへつなげる方法を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-ai-coded-tool-with-client",
    "path": "/articles/share-ai-coded-tool-with-client",
    "title": "AIでコーディングしたツールをクライアントに共有する方法",
    "description": "AIで作った計算ツールやフォーム付きWebツールを納品前にクライアントへ動作確認してもらいたいとき、コード一式を渡しても相手は動かせません。共有URLで実際に触ってもらいながらフィードバックを集める手順を紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-xss-risk",
    "path": "/articles/what-is-xss-risk",
    "title": "XSSとは？共有HTMLで気をつけるリスクの基礎",
    "description": "AIが書き出したHTMLや外部から受け取ったコードを共有する機会が増えるほど、意図しないスクリプト混入のリスクも高まります。XSSの基本的な仕組みと、HTMLを他者に渡す際に気をつけるべきポイントを、わかりやすく整理した入門記事です。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "csp-for-shared-html",
    "path": "/articles/csp-for-shared-html",
    "title": "CSP（コンテンツセキュリティポリシー）の基礎と考え方",
    "description": "ブラウザに「読み込んでよいリソース」を宣言してスクリプト実行を制御するCSPは、名前の難しさのわりに考え方はシンプルです。HTMLを共有・公開する場面でどう使うかを、実務感覚で理解したい方向けに基礎から解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "clickjacking-risk",
    "path": "/articles/clickjacking-risk",
    "title": "クリックジャッキングとは？iframe悪用への注意",
    "description": "透明なiframeを重ねるだけで成立するクリックジャッキングは、利用者が気づきにくい攻撃手法です。仕組みを知っておきたいWeb制作者やHTMLを共有する機会のある方に向けて、リスクと共有時の注意点をわかりやすく説明します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "mixed-content-security",
    "path": "/articles/mixed-content-security",
    "title": "http混在（mixed content）のセキュリティリスク",
    "description": "HTTPSページの中にHTTPのリソースが混ざる混在コンテンツは、鍵マークが表示されていても保護されていない箇所が残ります。共有するHTMLに混在コンテンツが潜んでいないか確認したい方向けに、リスクと修正方法を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "third-party-tracker-check",
    "path": "/articles/third-party-tracker-check",
    "title": "共有HTMLに紛れる第三者トラッカーを確認する",
    "description": "テンプレートやAI生成HTMLには、本人の知らない解析タグや外部スクリプトが残っていることがあります。確認のつもりで共有したページが閲覧情報を外部へ送っていないか、トラッカー混入を見つけて取り除く手順を整理しました。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "nda-and-html-share",
    "path": "/articles/nda-and-html-share",
    "title": "NDA（秘密保持契約）下でHTMLを共有するときの注意",
    "description": "NDAを結んだうえで未公開デザインや仕様を共有する場面では、URLの転送経路まで管理できないリスクがあります。秘密保持契約の趣旨を守りながらHTMLを安全に届けるために、認証と期限の設計で押さえたいポイントを整理します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "classify-info-before-share",
    "path": "/articles/classify-info-before-share",
    "title": "情報資産の重要度で共有方法を変える考え方",
    "description": "情報をすべて同じ基準で管理すると運用が形骸化し、緩めると重要な情報が漏れます。重要度に応じた共有方法を使い分けたい担当者に向けて、情報分類の基礎と、実際の共有手段への落とし込み方をわかりやすく解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "audit-log-for-share",
    "path": "/articles/audit-log-for-share",
    "title": "共有の監査ログを残す重要性と確認方法",
    "description": "「誰がいつ見たか」を後から説明できることが、情報共有の信頼性を支えます。記録がないと漏えいや誤送信が起きても被害範囲を確かめられません。共有における監査ログの意義と、記録の確認・活用方法を実務視点で解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zero-trust-sharing",
    "path": "/articles/zero-trust-sharing",
    "title": "ゼロトラストで考えるHTML共有",
    "description": "社内だから安全、URLを知らなければ大丈夫という前提が崩れつつある今、アクセスのたびに確認するゼロトラストの発想はHTML共有にも有効です。「何も信用しない」を出発点に、具体的にどう共有設計を変えるかを解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "prevent-screenshot-leak",
    "path": "/articles/prevent-screenshot-leak",
    "title": "スクショ・画面共有での情報漏えいを減らす工夫",
    "description": "共有URLを認証で守っても、開いた画面が撮られたり画面共有で映れば情報は外に出ます。スクショを完全には止められないからこそ、何を画面に表示するかと、撮られても被害が小さい設計が重要です。現実的な情報漏えい低減策を整理しました。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "secure-share-on-public-wifi",
    "path": "/articles/secure-share-on-public-wifi",
    "title": "公衆Wi-Fiで共有URLを開くときの注意",
    "description": "カフェや空港の公衆Wi-Fiで共有URLを開く機会は多いですが、盗み見やなりすましAPのリスクがあります。過度に怖がらず、知っておくべき注意点と安全に使うための実践的な対策を、利用者目線でわかりやすくまとめます。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "revoke-access-immediately",
    "path": "/articles/revoke-access-immediately",
    "title": "共有後すぐにアクセスを取り消す方法と考え方",
    "description": "送り先を間違えた、レビューが終わってもURLが生きている。共有後にアクセスを止めたい場面は意外と多いものです。止められる状態をあらかじめ作っておくことが鍵で、即時失効の考え方と現実的な取り消し手段を整理します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "minimize-data-in-shared-html",
    "path": "/articles/minimize-data-in-shared-html",
    "title": "共有HTMLに載せる情報を最小化する考え方",
    "description": "確認用HTMLに本番の顧客データや内部情報をそのまま貼っていませんか。共有する情報が多いほど漏えい時のダメージは大きくなります。必要なものだけを残す「データ最小化」の考え方で、共有HTMLから何を削り何を残すかを解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "check-form-data-destination",
    "path": "/articles/check-form-data-destination",
    "title": "共有HTMLのフォーム送信先・データの扱いを確認する",
    "description": "共有するHTMLにフォームが含まれているとき、その入力がどこへ送られるか把握していますか。テンプレート流用やAI生成では送信先が意図しない場所のままのことがあります。共有前にフォームの送信先とデータの扱いを確認する方法を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-27"
  },
  {
    "slug": "malware-in-uploaded-files",
    "path": "/articles/malware-in-uploaded-files",
    "title": "アップロードファイルにマルウェアを混ぜない注意",
    "description": "HTMLやZIPは複数の素材を寄せ集めて作られがちで、ダウンロードした素材に不審なコードが紛れていることがあります。アップロードしたファイルが閲覧者にそのまま届く以上、マルウェア混入を防ぐ確認手順を知っておくことが重要です。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "security-checklist-for-client-share",
    "path": "/articles/security-checklist-for-client-share",
    "title": "クライアント共有前のセキュリティ最終チェック",
    "description": "クライアントへ制作物を共有する直前は、送ってから気づいても取り返しがつかない見落としが起きやすい瞬間です。確認をルーティン化するために、HTML共有前に押さえたい項目をチェックリスト形式でまとめました。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "remote-team-review",
    "path": "/articles/remote-team-review",
    "title": "リモートチームでHTMLレビューを回す方法",
    "description": "リモートチームでは横で画面を見せながらの確認ができません。成果物の渡し方・コメントの集め方・更新の伝え方が曖昧だと、レビューが止まったり古いファイルが出回ったりします。対面に頼らずHTMLレビューを回す方法を整理します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-version-management",
    "path": "/articles/review-version-management",
    "title": "レビューのバージョンを管理して混乱を防ぐ方法",
    "description": "レビューを重ねるほどどれが最新版かわからなくなり、古いファイルへのコメントや修正済み指摘の蒸し返しが起きがちです。HTML成果物のレビューで版を取り違えないための管理の考え方と、混乱を防ぐ進め方を解説します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "reflect-feedback-and-reshare",
    "path": "/articles/reflect-feedback-and-reshare",
    "title": "フィードバックを反映して再共有する流れ",
    "description": "レビューでコメントをもらった後、修正してどう再共有するかで後工程の手間が変わります。指摘の取りこぼしや再送による混乱を防ぎ、もらったフィードバックを確実に反映してスムーズに次の確認へつなげる流れを整理します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "choose-reviewers",
    "path": "/articles/choose-reviewers",
    "title": "レビューを依頼する相手の選び方",
    "description": "レビューは誰に頼むかで質も速さも変わります。多すぎると意見がまとまらず、適切でない相手への依頼は有効なコメントを得られません。HTMLレビューの依頼相手の選び方と、相手の役割に合わせた共有のコツをまとめた記事です。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-checklist",
    "path": "/articles/review-checklist",
    "title": "HTMLレビューの観点チェックリスト",
    "description": "HTMLのレビューは見る観点が定まっていないと、見た目だけ確認して挙動を見逃したり、細部にこだわって全体を見落としたりしがちです。抜け漏れを減らしたい方向けに、HTML成果物の確認観点をチェックリスト形式で整理しました。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "executive-review-share",
    "path": "/articles/executive-review-share",
    "title": "経営層・役員にレビューを依頼する共有方法",
    "description": "忙しい経営層や役員にレビューを依頼するには、ファイルのダウンロードや操作を求めず、最小限の手間で確認してもらう共有設計が不可欠です。短時間で可否判断を引き出すための資料の渡し方とURLの設定方法を解説します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cross-timezone-review",
    "path": "/articles/cross-timezone-review",
    "title": "海外・時差のあるメンバーとレビューする方法",
    "description": "海外拠点や時差のあるメンバーが関わると、同じ時間に集まって確認するのが困難になります。時刻を無理に合わせずHTMLレビューを回し、一日の待ち時間を減らしながら確認を進めるための方法と段取りを解説します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "async-review-best-practice",
    "path": "/articles/async-review-best-practice",
    "title": "非同期レビューを効率化するベストプラクティス",
    "description": "非同期レビューは全員の予定を合わせずに進められますが、依頼の仕方が曖昧だと返事が来ないまま止まります。何をいつまでに見てほしいかを正確に伝えながら、HTMLレビューを効率よく非同期で回すためのベストプラクティスをまとめます。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "when-to-use-url-only",
    "path": "/articles/when-to-use-url-only",
    "title": "認証なし（URLのみ）で十分なケースと注意点",
    "description": "共有のたびにパスワードを設定するのは手間ですが、誰でも開けるURLは内容によっては不向きです。「URLのみ」で問題ない場面と認証を足すべき境界線を、具体的な判断基準で整理し、迷ったときに参照できる記事にまとめました。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "password-vs-email-auth-when",
    "path": "/articles/password-vs-email-auth-when",
    "title": "パスワードとメール認証の使い分け（場面別）",
    "description": "認証付きで共有したいとき、パスワードとメール認証（ワンタイムコード）のどちらが適切か迷う方は多いはずです。守りたいものの違いを踏まえ、相手の人数・把握したい粒度・手軽さの観点から場面別の使い分けを整理します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "company-domain-vs-email-list",
    "path": "/articles/company-domain-vs-email-list",
    "title": "会社ドメイン認証とメールアドレス指定の使い分け",
    "description": "会社ドメイン認証とメールアドレス指定は守る範囲が異なり、前者は組織単位・後者は個人単位の発想です。どちらを選ぶと管理が楽で安全かを、アクセス対象の広さと運用コストの観点から整理した記事です。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-for-external-partners",
    "path": "/articles/auth-for-external-partners",
    "title": "社外パートナーに見せるときの認証の選び方",
    "description": "社外パートナーへ制作物を見せるとき、リンクの転送経路まで管理できないため認証設計は一段慎重さが必要です。相手の範囲と情報の機微度から、適切な認証方式と公開期限の組み合わせを選ぶ考え方を解説します。",
    "category": "認証共有",
    "updatedAt": "2026-06-26"
  },
  {
    "slug": "auth-for-large-audience",
    "path": "/articles/auth-for-large-audience",
    "title": "大人数に配るときの認証設計",
    "description": "数十人・数百人に同じページを配るとき、一人ずつ認証する方式では運用が回りません。無防備なURLも避けたい大人数共有で、運用の軽さと保護のバランスを取りながら使える認証設計と配布方法を整理した記事です。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "temporary-access-with-expiry-auth",
    "path": "/articles/temporary-access-with-expiry-auth",
    "title": "認証と期限を組み合わせて一時的なアクセス権を作る方法",
    "description": "「この期間だけ、この人にだけ見せたい」というニーズは、認証と公開期限を組み合わせることで実現できます。誰に見せるかと、いつまで見せるかを別々に設計する考え方と、一時的なアクセス権を作る具体的な手順を解説します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "nail-eyelash-salon-share",
    "path": "/articles/nail-eyelash-salon-share",
    "title": "ネイル・まつげサロンがメニュー・作例を共有する方法",
    "description": "ネイルやまつげサロンで季節ごとの新作デザインやクーポンを紙のメニューなしに届けたい方へ。作例とメニューをHTMLにまとめてURLやQRコードで共有すれば、刷り直しなしに内容を更新できる方法と手順をまとめました。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pet-business-share",
    "path": "/articles/pet-business-share",
    "title": "ペット関連事業（トリミング・ホテル）が案内を共有する方法",
    "description": "トリミングサロンやペットホテルで、コース料金・対応犬種・持ち物といった情報を飼い主に正確に伝えたい事業者の方へ。HTMLにまとめてURLやQRコードで渡すことで、料金改定やシーズン受付への追従が楽になる方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "funeral-service-share",
    "path": "/articles/funeral-service-share",
    "title": "葬儀社が式次第・案内を遺族に限定共有する方法",
    "description": "式次第や会場案内・供花の手配情報は、遺族や近親者にだけ確実に届けたい情報です。検索で誰にでも見つかる形を避けながら、認証付きの一時URLで関係者にだけ共有し、内容の修正にも追従できる方法を整理しました。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "driving-school-share",
    "path": "/articles/driving-school-share",
    "title": "自動車教習所が入校案内・料金を共有する方法",
    "description": "コース別の料金や入校に必要な書類・持ち物を入校希望者に正確に伝えたい自動車教習所の担当者へ。HTMLにまとめてURLやQRコードで渡すことで、料金改定や合宿枠の変更が発生しても迅速に追従できる共有方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tutoring-online-share",
    "path": "/articles/tutoring-online-share",
    "title": "オンライン家庭教師が授業案内・教材を共有する方法",
    "description": "オンライン家庭教師がコース案内から教材・解説資料まで生徒や保護者に届けるとき、毎回ファイルを添付するのは手間です。HTMLにまとめてURLで渡すことで、教材更新や料金変更を一箇所で反映できる運用方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "catering-menu-share",
    "path": "/articles/catering-menu-share",
    "title": "ケータリング・仕出しがメニュー・見積を共有する方法",
    "description": "人数・予算別のプランメニューと個別見積をケータリング依頼者に分かりやすく届けたい事業者へ。HTMLにまとめてURLやQRコードで渡すことで、季節メニューの差し替えや見積修正への追従もスムーズになる方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "moving-company-estimate-share",
    "path": "/articles/moving-company-estimate-share",
    "title": "引越し業者が見積・プラン案内を共有する方法",
    "description": "荷物量や距離・時期に応じたプランと個別見積を引越し依頼者に分かりやすく提示したい事業者へ。HTMLにまとめてURLで渡すことで、条件変更に伴う見積の差し替えや最新料金への更新が楽になる運用方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "esthetic-spa-share",
    "path": "/articles/esthetic-spa-share",
    "title": "エステ・整体院が施術案内・料金を共有する方法",
    "description": "施術メニューや回数券・コース料金をお客様にわかりやすく伝えたいエステや整体院の担当者へ。HTMLにまとめてURLやQRコードで渡すことで、季節キャンペーンの差し替えや料金改定にも手軽に追従できる方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-ip-address",
    "path": "/articles/what-is-ip-address",
    "title": "IPアドレスとは？インターネット上の住所をやさしく解説",
    "description": "インターネットに接続するすべての機器には固有の番号が割り当てられています。その番号の意味や、古いIPv4と新しいIPv6の違い、ドメイン名との関係を初心者向けにひとつずつ整理しています。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-port-number",
    "path": "/articles/what-is-port-number",
    "title": "ポート番号とは？80番と443番の意味をわかりやすく解説",
    "description": "IPアドレスだけではどのサービスに届けるかが分かりません。そこで登場するのがポート番号です。80番と443番の使われ方を中心に、一台のサーバーで複数のサービスを同時に動かす仕組みを丁寧に解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-tcp-ip",
    "path": "/articles/what-is-tcp-ip",
    "title": "TCP/IPとは？インターネット通信の土台をやさしく解説",
    "description": "インターネット通信がなぜ途切れず届くのか、疑問を持ったことはありませんか。データを小分けにして運ぶTCPと、届け先を決めるIPの役割分担を、日常の荷物配送にたとえながら基礎から説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-tls-handshake",
    "path": "/articles/what-is-tls-handshake",
    "title": "TLSハンドシェイクとは？通信が暗号化される仕組み",
    "description": "HTTPSの鍵マークが出るまでに、ブラウザとサーバーは水面下でやり取りを済ませています。その一連の流れであるTLSハンドシェイクの手順と、なぜ安全に通信できるのかの理由を順を追って理解できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-ssl-certificate",
    "path": "/articles/what-is-ssl-certificate",
    "title": "SSL証明書とは？サイトの本人確認の仕組み",
    "description": "HTTPSサイトが「本物か偽物か」をどうやって判断できるのか、気になったことはありませんか。通信の暗号化と運営者の確認を同時に担うSSL証明書の仕組みと種類を、基礎から分かりやすく説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-http-header",
    "path": "/articles/what-is-http-header",
    "title": "HTTPヘッダーとは？リクエストとレスポンスの付帯情報",
    "description": "ブラウザとサーバーがやり取りする際、本文とは別に「メモ書き」として添付されるHTTPヘッダー。キャッシュ指定や認証など用途ごとに主要なヘッダーの役割を具体例とともに整理しているため、ログ解析や設定作業で迷いにくくなります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-http-method",
    "path": "/articles/what-is-http-method",
    "title": "HTTPメソッドとは？GETとPOSTの違いをやさしく解説",
    "description": "ページを取得するときと、フォームの内容を送るときでは、サーバーへの頼み方が違います。GETとPOSTを中心に、HTTPメソッドがどんな意図を伝えているのかを、具体的な場面ごとに分かりやすく説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-cookie",
    "path": "/articles/what-is-cookie",
    "title": "Cookieとは？ブラウザが情報を覚える仕組み",
    "description": "再訪問時もログイン状態が続くのは、ブラウザがサイトから受け取った小さな情報を手元に保持しているからです。Cookieがどこに保存され、いつ消えるのか、セキュリティ上の注意点まで含めて基礎から説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-session",
    "path": "/articles/what-is-session",
    "title": "セッションとは？ログイン状態が保たれる仕組み",
    "description": "ページをまたいでもログイン状態が保たれるのはなぜか、疑問に思ったことはありますか。サーバー側の「記憶」であるセッションが、CookieとどうペアになってIDを管理しているのかを、専門用語を避けながら説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-localstorage",
    "path": "/articles/what-is-localstorage",
    "title": "ローカルストレージとは？ブラウザにデータを保存する仕組み",
    "description": "サイトを閉じて再び開いても設定が残っている体験を支える仕組みのひとつが、ブラウザ内蔵のローカルストレージです。Cookieとの違いや使えるデータ量の感覚、適切な使いどころまで、初心者にも伝わる言葉で説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-http2-http3",
    "path": "/articles/what-is-http2-http3",
    "title": "HTTP/2・HTTP/3とは？表示が速くなる新しい通信規格",
    "description": "プロトコルのバージョンを変えるだけで表示速度が変わるのはなぜか、気になった方へ。HTTP/2の多重通信とHTTP/3が採用するQUICの違いを、旧来のHTTPと比べながら速さの理由を読み解きます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-keep-alive",
    "path": "/articles/what-is-keep-alive",
    "title": "Keep-Aliveとは？接続を使い回して速くする仕組み",
    "description": "ページを開くたびに接続を一から張り直すとその分だけ表示が遅くなります。接続を使い回すKeep-Aliveの考え方と、なぜ体感速度の改善につながるのかを、ネットワーク初心者にも伝わるように説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-cache-control",
    "path": "/articles/what-is-cache-control",
    "title": "Cache-Controlとは？キャッシュの期間を決めるヘッダー",
    "description": "ファイルを更新したのに変更が反映されないとき、背後にはキャッシュの保持期間設定があります。Cache-Controlの各ディレクティブが何を意味するのかを実例とともに整理し、期間設定で迷わないための判断材料を提供します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-etag",
    "path": "/articles/what-is-etag",
    "title": "ETagとは？ファイルの変更を見分ける仕組み",
    "description": "ファイルが変わったかどうかを内容を丸ごと再送せずに確認する方法が気になる方へ。サーバーが返す識別子ETagを使って条件付きリクエストが成立する流れを、省帯域キャッシュの仕組みとして基礎から説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-cors",
    "path": "/articles/what-is-cors",
    "title": "CORSとは？別ドメインのデータを読み込む際のルール",
    "description": "別ドメインのAPIを呼んだらエラーで止まった経験はありませんか。そのエラーの正体であるCORSとは何か、ブラウザがなぜ制限をかけ、サーバー側でどう許可を伝えるのかを、対処法とセットで分かりやすく説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-same-origin-policy",
    "path": "/articles/what-is-same-origin-policy",
    "title": "同一オリジンポリシーとは？ブラウザの安全の基本ルール",
    "description": "あるサイトが別サイトの中身を勝手に読み取れないのは、ブラウザに組み込まれた同一オリジンポリシーの働きによるものです。スキーム・ホスト・ポートの三要素からオリジンを判断する基準を、具体例を交えて整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-csp",
    "path": "/articles/what-is-csp",
    "title": "Content Security Policy(CSP)とは？不正スクリプトを防ぐ仕組み",
    "description": "XSSなどの攻撃で不正なスクリプトをページに差し込まれるリスクを減らしたい方へ。CSPがどの発信元のリソースを許可するかをヘッダーで宣言する仕組みと、設定時に最低限押さえるべき考え方を説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-referer",
    "path": "/articles/what-is-referer",
    "title": "リファラ(Referer)とは？どこから来たかを伝える情報",
    "description": "アクセスログに記録される「参照元URL」はどこから来るのでしょうか。ブラウザが遷移時に自動送信するRefererヘッダーの役割と、プライバシー保護の観点からどんな制御が行われているのかを基礎から説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-user-agent",
    "path": "/articles/what-is-user-agent",
    "title": "ユーザーエージェントとは？ブラウザを名乗る文字列の意味",
    "description": "アクセスログに並ぶ長い文字列「Mozilla/5.0...」が何を意味するか分かると、ブラウザ別対応や統計の読み方が変わります。ユーザーエージェントの構造と読み解き方、扱う際の注意点を初心者向けに解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-css-selector",
    "path": "/articles/what-is-css-selector",
    "title": "CSSセレクタとは？スタイルを当てる対象の指定方法",
    "description": "CSSでスタイルを当てるには、まず対象を正確に指定するセレクタを理解する必要があります。タグ・クラス・IDの書き方から詳細度による優先順位の仕組みまで、レイアウト作業でつまずきやすいポイントを順に整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-css-box-model",
    "path": "/articles/what-is-css-box-model",
    "title": "ボックスモデルとは？余白とサイズの基礎(margin/padding)",
    "description": "余白を増やしたつもりが幅が崩れた、という経験はよくあります。CSSのボックスモデルが示すcontent・padding・border・marginの関係を正しく理解すると、レイアウトのトラブルを根本から解消できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-flexbox-grid",
    "path": "/articles/what-is-flexbox-grid",
    "title": "FlexboxとGridとは？レイアウトを整えるCSSの基礎",
    "description": "要素を横に並べたい場合はFlexbox、格子状に組みたい場合はGridが向いています。この二つのCSSレイアウト手法が何を得意とするのか、違いと使い分けの判断基準を、初めての方でも迷わないよう整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-media-query",
    "path": "/articles/what-is-media-query",
    "title": "メディアクエリとは？画面幅で見た目を変えるCSS",
    "description": "スマホとPCで見た目が変わるレスポンシブデザインはどう実現するのか、疑問を持ったことはありませんか。画面幅を条件にスタイルを切り替えるメディアクエリの書き方と、viewportとの関係を初心者向けに説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-pseudo-class",
    "path": "/articles/what-is-pseudo-class",
    "title": "擬似クラスとは？hoverやfocusで変化するCSSの基礎",
    "description": "マウスオーバーで色が変わる、フォーカス時に枠が光る。こうしたインタラクションをCSSだけで実現するのが擬似クラスです。hoverやfocusを中心に動作原理と使いどころ、混同しやすい擬似要素との違いまで説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-dom",
    "path": "/articles/what-is-dom",
    "title": "DOMとは？ブラウザがHTMLを扱う木構造の基礎",
    "description": "JavaScriptからHTMLの要素を書き換えられるのはなぜか、不思議に感じたことはありませんか。ブラウザがHTMLを解析して作る木構造DOMの仕組みを理解すると、動的なページ操作の仕組みが見えてきます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-javascript-event",
    "path": "/articles/what-is-javascript-event",
    "title": "イベントとは？クリックや入力に反応する仕組み",
    "description": "クリックや入力への反応をコードで制御するために必要なのがイベントの仕組みです。イベントリスナーの登録からバブリングの動きまで、JavaScriptで「操作に反応する」動きをどう作るかを初心者向けに説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-async-defer",
    "path": "/articles/what-is-async-defer",
    "title": "async・deferとは？scriptの読み込みタイミングの違い",
    "description": "scriptタグにasyncかdeferを追加すると表示が速くなる場合があります。どちらの属性がHTMLの解析をブロックせずにJavaScriptを読み込むのか、タイミングの違いと使い分けの基準を実例で整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-rendering-flow",
    "path": "/articles/what-is-rendering-flow",
    "title": "レンダリングとは？HTMLが画面に描かれるまでの流れ",
    "description": "URLを入力してからページが見えるまでの間、ブラウザは何をしているのでしょうか。HTML解析・スタイル計算・レイアウト・描画という一連のステップを追いながら、ページが画面に現れるまでの流れを説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-render-blocking",
    "path": "/articles/what-is-render-blocking",
    "title": "レンダリングブロックとは？表示を止めるCSS/JSの話",
    "description": "ページを開いた直後に画面が真っ白のまま止まる原因のひとつが、CSSやJSによるレンダリングブロックです。なぜ描画が止まるのか、どんな対策が有効なのかを、速度改善の糸口として理解できるよう解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-lazy-loading",
    "path": "/articles/what-is-lazy-loading",
    "title": "遅延読み込み(lazy loading)とは？画像を後から読む仕組み",
    "description": "画像が多いページでも初期表示を速くしたいと考えている方へ。スクロールに合わせて画像を読み込むlazy loadingの仕組みと、HTMLのloading属性を使った簡単な実装方法を、効果の理由とともに説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-webp-avif",
    "path": "/articles/what-is-webp-avif",
    "title": "WebP・AVIFとは？軽くて速い画像フォーマットの基礎",
    "description": "画像ファイルのサイズを減らすと表示速度の改善につながります。JPEGやPNGより高い圧縮効率を持つWebPとAVIFの特徴と、ブラウザ対応の現状、フォーマットを選ぶ際の判断基準を基礎から整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-svg",
    "path": "/articles/what-is-svg",
    "title": "SVGとは？拡大しても崩れない画像の仕組み",
    "description": "ロゴやアイコンを4Kディスプレイで表示してもくっきりきれいなのはなぜでしょうか。ピクセルではなく数式で形を表すベクター画像SVGの仕組みと、JPEGやPNGとの使い分けの考え方を初心者向けに説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-gzip-brotli",
    "path": "/articles/what-is-gzip-brotli",
    "title": "gzip・Brotliとは？転送を軽くする圧縮の仕組み",
    "description": "サイトを開くときHTMLやJSがそのまま転送されていると思っていませんか。実は多くの場合、gzipやBrotliで圧縮されてから届きます。圧縮の仕組みと転送量が減る理由、二つの違いを基礎から整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-tld",
    "path": "/articles/what-is-tld",
    "title": "TLD(トップレベルドメイン)とは？.comや.jpの意味",
    "description": ".comと.jpと.orgは何が違うのか、気になったことはありませんか。ドメインの末尾にあるTLDの種類と、それぞれの使われ方・選び方の考え方を、サイト開設を検討している方向けに基礎から整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-whois",
    "path": "/articles/what-is-whois",
    "title": "WHOISとは？ドメイン登録情報を調べる仕組み",
    "description": "あるドメインが誰のものか、いつ登録されたかを調べたいとき使えるのがWHOISです。競合調査やドメイン取得前の確認に役立つ情報の引き出し方と、プライバシー保護で非公開になる場合の扱いを基礎から説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-dns-record",
    "path": "/articles/what-is-dns-record",
    "title": "DNSレコードとは？AレコードやCNAMEの役割",
    "description": "ドメインを取得してもサーバーと結びつけなければサイトは表示されません。その設定を担うDNSレコードの種類を、Aレコード・CNAME・MXレコードを例に挙げながら、それぞれの役割と用途を基礎から整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-dns-ttl",
    "path": "/articles/what-is-dns-ttl",
    "title": "DNSのTTLとは？反映に時間がかかる理由",
    "description": "DNS設定を変えたのに反映が遅い、という場面でよく出てくる値がTTLです。この値がキャッシュ保持時間を決め、切り替えの速さに直結することを、ドメイン移管やサーバー変更を控えた方向けに分かりやすく説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-www-vs-non-www",
    "path": "/articles/what-is-www-vs-non-www",
    "title": "wwwあり・なしの違いとは？URLの先頭の意味",
    "description": "wwwあり・なしのどちらでサイトを運営すべきか迷っている方へ。サブドメインとしてのwwwの正体と、どちらかに統一することがSEOや設定の観点でなぜ重要なのかを、実例を交えて基礎から整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-uri-vs-url",
    "path": "/articles/what-is-uri-vs-url",
    "title": "URIとURLの違いとは？混同しやすい用語を整理",
    "description": "URIとURLは似た言葉で混同しがちですが、実はURLはURIの一種です。Webの解説で両者が使い分けられる理由と、一般的な会話でどちらを使えばよいかを、具体例を交えて分かりやすく整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-url-encoding",
    "path": "/articles/what-is-url-encoding",
    "title": "URLエンコードとは？日本語や記号がURLで化ける理由",
    "description": "URLをコピーしたら日本語が%E3%81...という文字列に変わっていて戸惑った方へ。これは文字化けではなくURLエンコードという安全な変換です。どの文字がなぜ変換されるのかを、仕組みから基礎的に理解できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-fragment-anchor",
    "path": "/articles/what-is-fragment-anchor",
    "title": "フラグメント(#)とは？ページ内リンクが飛ぶ仕組み",
    "description": "目次リンクを押した瞬間にページの途中まで飛ぶ体験を作っているのが、URLに含まれる#（フラグメント）です。ページ内ジャンプが起きる仕組みと、JavaScriptとの連携でSPAでどう使われるかを基礎から説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-trailing-slash",
    "path": "/articles/what-is-trailing-slash",
    "title": "末尾スラッシュ(/)とは？URLの最後の有無の違い",
    "description": "URLの末尾に「/」を付けるかどうかで、サーバーの扱いやSEOの評価が変わる場合があります。スラッシュの有無がどんな違いを生むのか、どちらかに統一すべき理由を実例とともに整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-http-vs-https",
    "path": "/articles/what-is-http-vs-https",
    "title": "HTTPとHTTPSの違いとは？sの一文字が意味すること",
    "description": "アドレスバーの「http」と「https」の違いは末尾の「s」一文字ですが、通信が暗号化されているかという本質的な差があります。なぜHTTPSが標準になったのか、切り替えで何が変わるのかを分かりやすく説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-web-server",
    "path": "/articles/what-is-web-server",
    "title": "Webサーバーとは？リクエストに応答する仕組み",
    "description": "ブラウザでURLを入力したとき、裏側でページの中身を返してくれるのがWebサーバーです。NginxやApacheといった代表的なソフトウェアの役割と、静的サイトや動的サイトでの違いを初心者向けに整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-html-tag-structure",
    "path": "/articles/what-is-html-tag-structure",
    "title": "HTMLタグとは？head・bodyの役割をやさしく解説",
    "description": "Webページがどんな骨格で組み立てられているか知りたい方へ。headに書く情報とbodyに書くコンテンツの役割の違いを中心に、HTMLタグの基本的な構造を、初めてコードを見る方でも分かるように説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "flexbox-term",
    "path": "/articles/flexbox-term",
    "title": "Flexboxとは？要素を横並び・縦並びに整えるCSSの基礎",
    "description": "ボタンやメニューを横に並べたいのにうまくいかないと感じているCSSの初心者へ。Flexboxの考え方と主要なプロパティの使い方を、縦・横の整列が思い通りになるよう基礎からシンプルに説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "grid-layout-term",
    "path": "/articles/grid-layout-term",
    "title": "CSS Gridとは？格子状にレイアウトを組む仕組みをやさしく解説",
    "description": "カードや画像を格子状にきれいに配置したい方へ。CSS Gridが行と列の両軸でレイアウトを組む仕組みと、Flexboxとの使い分けの判断基準を、初めてGridに触れる方が理解しやすいよう基礎から説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "media-query-term",
    "path": "/articles/media-query-term",
    "title": "メディアクエリとは？画面幅でデザインを切り替えるCSSの基礎",
    "description": "スマホ・タブレット・PCで表示を切り替えたいCSSの初心者へ。メディアクエリのブレークポイントの考え方と書き方を、モバイルファーストの設計方針とあわせて、最初の一歩が踏み出せるよう基礎から整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-selector-term",
    "path": "/articles/css-selector-term",
    "title": "CSSセレクタとは？要素を狙ってスタイルを当てる基礎",
    "description": "狙った要素だけにスタイルを当てたいCSSの初学者へ。タグ・クラス・IDをどう書き分けるか、複数条件を組み合わせる方法、詳細度で優先順位が決まる仕組みを、実装でつまずかないよう基礎から順に解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "box-model-term",
    "path": "/articles/box-model-term",
    "title": "ボックスモデルとは？余白・枠・幅の関係をやさしく解説",
    "description": "余白を設定したのに幅がずれる、枠を付けたらレイアウトが崩れた、という悩みを持つ方へ。ボックスモデルの四層構造を正しく把握することで、CSSのサイズ計算に自信を持って向き合えるようになります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-specificity-term",
    "path": "/articles/css-specificity-term",
    "title": "詳細度（specificity）とは？CSSが効かない時に確認する優先順位",
    "description": "CSSを書いたのにスタイルが反映されない原因の多くは「優先順位の競合」です。どのルールが勝つかを決める詳細度の計算方法を理解すれば、!importantに頼らずトラブルを素早く解決できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "z-index-term",
    "path": "/articles/z-index-term",
    "title": "z-indexとは？要素の重なり順を決めるCSSの基礎",
    "description": "メニューが隠れる・モーダルが後ろに回り込む――重なり順のトラブルに悩む人向けに、z-indexが効く条件と効かない理由を整理。stacking contextの概念まで踏み込み、根本から問題を解決できるようになります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-position-term",
    "path": "/articles/css-position-term",
    "title": "CSSのpositionとは？static・relative・absolute・fixedの違い",
    "description": "要素を思い通りの場所に置けずに困っているなら、positionの値ごとに「何を基準に動くか」が変わる点を押さえると解決します。static・relative・absolute・fixedの挙動の違いを実例で整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-units-term",
    "path": "/articles/css-units-term",
    "title": "px・em・rem・%とは？CSSの単位の違いをやさしく解説",
    "description": "px・em・rem・%のどれを使うべきか迷う人に向けて、固定単位と相対単位の違いや継承の影響をやさしく解説。文字サイズや余白を場面に応じて使い分けるための判断基準が身につきます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-variables-term",
    "path": "/articles/css-variables-term",
    "title": "CSSカスタムプロパティ（変数）とは？色やサイズを使い回す仕組み",
    "description": "色やサイズの値を変えるたびに複数ファイルを修正して大変だと感じるなら、CSSカスタムプロパティを使えば一箇所の変更で全体に反映できます。書き方から活用パターンまで基礎を整理しました。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pseudo-class-term",
    "path": "/articles/pseudo-class-term",
    "title": "擬似クラスとは？:hoverや:first-childでスタイルを切り替える基礎",
    "description": "ホバーや「最初の要素だけ」といった状態・位置に応じてスタイルを変えたい場面で役立つ擬似クラス。:hoverや:first-childを起点に、どんな条件を拾えるのかを代表例とともに基礎から解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dom-term",
    "path": "/articles/dom-term",
    "title": "DOMとは？HTMLをJavaScriptが操作する仕組みをやさしく解説",
    "description": "JavaScriptでページを書き換えるとき必ず登場するDOMという概念。HTMLの構造をプログラムから扱えるツリーとして捉え直すと、操作の流れがすっきり見えてきます。初学者にも分かるよう仕組みを丁寧に解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "event-listener-term",
    "path": "/articles/event-listener-term",
    "title": "イベントリスナーとは？クリックなどに反応する仕組みの基礎",
    "description": "ボタンのクリックや文字入力など、ユーザーの操作に反応するページを作りたい人向けに、イベントリスナーの役割と書き方の流れを基礎から解説。インタラクティブなUIを自分で実装できるようになるための第一歩です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "async-await-term",
    "path": "/articles/async-await-term",
    "title": "async/awaitとは？非同期処理をわかりやすく書くJSの基礎",
    "description": "APIからデータを取得するような「待ちが発生する処理」でコードが読みにくくなる悩みを解消するのがasync/awaitです。非同期処理の考え方からこの構文が生まれた背景まで、つまずきポイントを押さえて解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "fetch-api-term",
    "path": "/articles/fetch-api-term",
    "title": "Fetch APIとは？JavaScriptでデータを取得する仕組みの基礎",
    "description": "JavaScriptからサーバーへデータを問い合わせる基本の手段がFetch APIです。何ができる仕組みなのか、レスポンスの受け取り方やエラー処理の注意点まで、コードを書き始める前に知っておきたい基礎を整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "json-term",
    "path": "/articles/json-term",
    "title": "JSONとは？データをやり取りする共通フォーマットの基礎",
    "description": "Webサービス間でデータをやり取りするときに広く使われる共通フォーマットがJSONです。なぜこれほど普及したのか、正しい書き方とJavaScriptでの扱い方、ありがちな間違いまでを初めての人向けにまとめます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cookie-term",
    "path": "/articles/cookie-term",
    "title": "Cookieとは？ブラウザに情報を覚えさせる仕組みをやさしく解説",
    "description": "ログイン状態の維持やカートの保持など、日常的にWebを便利にしているCookieの仕組みを解説します。セッションCookieとの違い、HttpOnlyやSameSiteなどのセキュリティ属性、プライバシーとの関係まで丁寧に整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "iframe-term",
    "path": "/articles/iframe-term",
    "title": "iframeとは？別ページを埋め込むHTMLタグの基礎",
    "description": "地図や動画など外部コンテンツをページにそのまま埋め込みたいときに使うiframeタグの基礎を解説。書き方と動作の仕組みから、セキュリティ上の注意点やsandbox属性の使い方まで、初めての人にも分かりやすく整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "svg-term",
    "path": "/articles/svg-term",
    "title": "SVGとは？拡大しても劣化しない画像形式の基礎",
    "description": "ロゴやアイコンをどんな画面サイズでも劣化なく表示したい人向けに、SVGの仕組みとJPEGやPNGとの違いを解説。コードで描く仕組みならではの利点と、アニメーションや操作との組み合わせ、注意すべき場面まで整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "lazy-loading-term",
    "path": "/articles/lazy-loading-term",
    "title": "遅延読み込み（lazy loading）とは？画像を後から読む高速化の基礎",
    "description": "ページ全体の画像を一気に読み込むと初期表示が重くなります。スクロールで画面に近づいたときだけ読み込む遅延読み込みの仕組みと、loading属性一行で対応する方法、IntersectionObserverの活用まで基礎から解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "semantic-html-term",
    "path": "/articles/semantic-html-term",
    "title": "セマンティックHTMLとは？意味のあるタグで構造を表す基礎",
    "description": "divを積み重ねるだけのHTMLと、意味のあるタグで書いたHTMLは見た目が同じでも検索エンジンや支援技術への伝わり方が大きく違います。セマンティックHTMLの考え方と主なタグの使い分けを基礎から整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "aria-term",
    "path": "/articles/aria-term",
    "title": "WAI-ARIAとは？支援技術に役割を伝えるアクセシビリティの基礎",
    "description": "HTML標準だけでは支援技術に伝わらないUIの役割や状態を補うのがWAI-ARIAです。まずHTMLを正しく使うという大前提を踏まえたうえで、role・aria-label・aria-expandedなど基本の属性の使い方を解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wcag-term",
    "path": "/articles/wcag-term",
    "title": "WCAGとは？Webアクセシビリティの国際ガイドラインの基礎",
    "description": "誰もが使えるWebを判断する共通のものさしを求める人向けに、WCAGの4原則と達成基準A・AA・AAAの意味を整理。実際の制作でどのレベルを目指すべきかを考えるための基礎知識として、身近な事例とともに解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "color-contrast-term",
    "path": "/articles/color-contrast-term",
    "title": "コントラスト比とは？文字が読みやすい配色の基礎",
    "description": "文字が読みにくい配色のまま公開していないか確認したい人向けに、コントラスト比の計算の仕組みとWCAGの基準値を解説。無料ツールで手軽に確認する方法と、合格ラインに達しない場合の修正の考え方もあわせて整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "color-code-term",
    "path": "/articles/color-code-term",
    "title": "カラーコードとは？HEX・RGB・HSLで色を指定する基礎",
    "description": "CSSで色を指定するHEX・RGB・HSLの書き方の違いが分からなくて困る人向けに、それぞれの特徴と選び方の基準を整理。半透明を扱うrgba・hslaや、実務で使いやすい形式を選ぶ判断軸まで基礎から解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-gradient-term",
    "path": "/articles/css-gradient-term",
    "title": "グラデーションとは？CSSで色を滑らかに変化させる基礎",
    "description": "画像なしでコードだけで背景に色の移り変わりを作れるCSSグラデーション。線形と放射状の違いや基本の書き方に加え、デザインで使いやすいコツまで、初めての人でも試しながら学べるよう順を追って解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-transition-term",
    "path": "/articles/css-transition-term",
    "title": "トランジションとは？CSSで動きを滑らかにする基礎",
    "description": "ホバーや状態変化を「パッと切り替わる」ではなく「なめらかに変わる」ようにしたい人向けに、CSSトランジションの仕組みと指定する4つの要素を整理。UXを高める自然な動きをどう実装するかの基礎を解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-animation-term",
    "path": "/articles/css-animation-term",
    "title": "CSSアニメーションとは？keyframesで動かす仕組みの基礎",
    "description": "JavaScriptを使わずCSSだけでロゴを光らせたりローダーを回したりしたい人向けに、@keyframesとanimationプロパティの関係を基礎から整理。繰り返しや遅延など、動きをコントロールする主なオプションまで解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-transform-term",
    "path": "/articles/css-transform-term",
    "title": "transformとは？要素を移動・回転・拡大するCSSの基礎",
    "description": "ホバーで要素をわずかに大きくしたり、アイコンを回転させたりするのに使うtransformの基礎を解説。translate・rotate・scaleの使い方を中心に、レイアウトを崩さず見た目だけ変える仕組みを初心者向けに整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "sticky-header-term",
    "path": "/articles/sticky-header-term",
    "title": "position:stickyとは？スクロールで追従するヘッダーの基礎",
    "description": "スクロールしても追従するヘッダーを作りたいが、fixedとどう違うか分からない人向けに、position:stickyの「通常配置と固定の中間」という独特の挙動を解説。効かない原因になる親要素のoverflowにも触れて整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "modal-term",
    "path": "/articles/modal-term",
    "title": "モーダルとは？画面に重ねて出すウィンドウの基礎",
    "description": "「保存しますか？」のように背景を暗くして前面に出るウィンドウがモーダルです。ページを離れずに確認や操作を完結させるUIの役割と、アクセシビリティ上の注意点まで、はじめてモーダルを実装する前に知っておきたい基礎を整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hamburger-menu-term",
    "path": "/articles/hamburger-menu-term",
    "title": "ハンバーガーメニューとは？スマホで定番のUIの基礎",
    "description": "スマホで三本線をタップするとナビゲーションが開くあのUI、なぜ狭い画面で重宝されるのかを理解したい人向けに、ハンバーガーメニューの仕組みと採用を迷うときの向き不向きの判断軸を基礎からまとめます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "breakpoint-term",
    "path": "/articles/breakpoint-term",
    "title": "ブレークポイントとは？レスポンシブで切り替える境目の基礎",
    "description": "スマホとPCでレイアウトを切り替えるには「どの画面幅を境目にするか」を決める必要があります。ブレークポイントの考え方と一般的な設定の目安、メディアクエリへの書き方まで、レスポンシブ対応が初めての人向けに整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "mobile-first-term",
    "path": "/articles/mobile-first-term",
    "title": "モバイルファーストとは？スマホ基準で設計する考え方の基礎",
    "description": "レスポンシブ設計でどちらの画面から作り始めるか迷う人向けに、スマホ基準から始めるモバイルファーストの考え方を整理。min-widthで広げていく書き方とデスクトップファーストとの違い、採用すべき理由を基礎から解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dark-mode-term",
    "path": "/articles/dark-mode-term",
    "title": "ダークモードとは？暗い配色に切り替える仕組みの基礎",
    "description": "端末のダークモード設定に連動してサイトの配色を切り替えるにはprefers-color-schemeメディアクエリを使います。CSSカスタムプロパティと組み合わせた実装パターンと、ユーザーが手動で切り替えられるようにする方法も含めて解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "web-component-term",
    "path": "/articles/web-component-term",
    "title": "Web Componentsとは？再利用できる独自タグの基礎",
    "description": "フレームワークに依存せずブラウザ標準だけで動く独自UIタグを作れるWeb Components。CustomElements・Shadow DOM・HTMLTemplateという三つの構成要素を一つずつ整理し、再利用可能な部品を作る基礎を解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "virtual-dom-term",
    "path": "/articles/virtual-dom-term",
    "title": "仮想DOMとは？画面更新を速くする仕組みをやさしく解説",
    "description": "ReactやVueの解説でよく出る仮想DOMとは何かを知りたい人向けに、メモリ上に設計図を持ち変化差分だけを反映する仕組みをやさしく解説。実DOMへの直接操作との比較で、なぜ速くなるのかを理解できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "bundler-term",
    "path": "/articles/bundler-term",
    "title": "バンドラーとは？複数ファイルをまとめるツールの基礎",
    "description": "開発中に分割した多数のファイルを依存関係に沿ってまとめ、ブラウザへ効率よく届けられる形に変換するのがバンドラーです。なぜ必要か、webpack・Viteなどの代表的なツールの位置づけ、設定で抑えるべき基礎を整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "transpile-term",
    "path": "/articles/transpile-term",
    "title": "トランスパイルとは？新しい記法を古い環境向けに変換する基礎",
    "description": "新しいJavaScript構文や型注釈をまだ対応していない環境でも動かしたい人向けに、トランスパイルの仕組みを基礎から解説。BabelやTypeScriptコンパイラが何をしているのか、どう設定すればよいかの考え方まで整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "polyfill-term",
    "path": "/articles/polyfill-term",
    "title": "ポリフィルとは？未対応ブラウザに機能を補う仕組みの基礎",
    "description": "一部のブラウザが未対応の新機能をどうしても使いたいときに役立つポリフィルの仕組みを解説。どんな場面で必要になるか、トランスパイルとの違い、バンドルサイズへの影響と読み込みコストの注意点まで基礎から整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cors-term",
    "path": "/articles/cors-term",
    "title": "CORSとは？別ドメインへのアクセス制御の仕組みをやさしく解説",
    "description": "別ドメインのAPIを呼んだら通信がブロックされた経験を持つ人向けに、CORSがなぜ存在するかをブラウザのセキュリティ設計から説明。プリフライトの仕組みとサーバー側でヘッダーを設定して許可する方法を基礎から整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "xss-term",
    "path": "/articles/xss-term",
    "title": "XSS（クロスサイトスクリプティング）とは？仕組みと危険性の基礎",
    "description": "利用者の入力を経由してスクリプトがページに混入するXSSは、Webの代表的な脆弱性の一つです。反射型・蓄積型・DOMベースの違いを整理したうえで、エスケープやCSPなどコードで防ぐ対策の考え方を基礎から解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "sass-scss-term",
    "path": "/articles/sass-scss-term",
    "title": "Sass・SCSSとは？CSSを効率よく書くための基礎",
    "description": "CSSの繰り返しや管理のしにくさを変数・ネスト・ミックスインで解決するSass/SCSSの基礎を解説。インデント記法のSassとCSS互換のSCSSの違いから、実務でよく使われる機能と導入手順まで初学者向けに整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-ttfb",
    "path": "/articles/what-is-ttfb",
    "title": "TTFB（最初のバイトまでの時間）とは？表示の速さを左右する指標",
    "description": "表示が遅いと感じるとき、サーバーとネットワークのどちらに問題があるか切り分けるのに役立つのがTTFBです。最初の1バイトが届くまでの時間の内訳と、200ms以内という目安、改善の優先順位を確認ツールとあわせて解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-lcp",
    "path": "/articles/what-is-lcp",
    "title": "LCP（Largest Contentful Paint）とは？メインコンテンツが出る速さ",
    "description": "ページの「主役が表示された」と感じる瞬間を測る指標がLCPです。2.5秒以内という目標値とともに、遅くなる四つの主原因と画像・フォントそれぞれの改善手順を整理し、Core Web Vitalsで重視される理由も解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-cls",
    "path": "/articles/what-is-cls",
    "title": "CLS（レイアウトのずれ）とは？読み込み中に画面が動く原因",
    "description": "読み込み中に突然レイアウトがずれてボタンを押し間違えた経験はないでしょうか。CLSはこの「予期しないずれ」を累積スコアで数値化した指標です。画像・広告・Webフォントがずれを引き起こす仕組みと、防ぐための実装パターンを解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-inp",
    "path": "/articles/what-is-inp",
    "title": "INP（操作の応答性）とは？クリックの反応が遅い指標の基礎",
    "description": "ボタンを押した後の微妙な引っかかりを数値化したINPは、2024年にCore Web Vitalsへ加わった最新の応答性指標です。FIDとの違い、200ms以内という基準値、Reactやイベントハンドラのどこに原因が潜むかを基礎から解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-fcp",
    "path": "/articles/what-is-fcp",
    "title": "FCP（最初の描画）とは？真っ白な画面が消えるまでの時間",
    "description": "ページを開いて最初のコンテンツが現れるまでの時間がFCPです。「読み込みが始まった」とユーザーが感じる最初の合図であり、LCPとはどう違うのか、1.8秒という目標値と改善のアプローチを基礎から整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-preload-prefetch",
    "path": "/articles/what-is-preload-prefetch",
    "title": "preload・prefetchとは？先読みでページを速くする仕組み",
    "description": "先読みを指示するpreloadとprefetchはどちらもlinkタグで書けますが、優先度と使うタイミングが異なります。フォントや画像の読み込み高速化に役立つ使い分けの判断手順と、指定しすぎて逆効果になるケースまで整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-critical-css",
    "path": "/articles/what-is-critical-css",
    "title": "クリティカルCSSとは？ファーストビューを速く出す手法",
    "description": "ファーストビューに使うCSSだけを先にインライン展開し、残りを非同期で読む手法がクリティカルCSSです。なぜ最初の描画が速くなるのか、どう抽出しHTMLへ埋め込むか、運用コストとのトレードオフまで実践的に解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-source-map",
    "path": "/articles/what-is-source-map",
    "title": "ソースマップ（source map）とは？圧縮後コードのデバッグ",
    "description": "圧縮・難読化されたコードでもエラー行が元ファイルのどこに対応するか追えるのがソースマップの役割です。DevToolsでの活用手順と、本番環境で公開する際のリスクと対処法まで、デバッグ効率を上げるために知っておきたい基礎を整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-srcset",
    "path": "/articles/what-is-srcset",
    "title": "srcset・sizesとは？画面に合う画像を出し分ける仕組み",
    "description": "スマホには小さな画像、高解像度ディスプレイには2倍サイズを届けたい場合に使うsrcsetとsizes属性の基礎を解説。ブラウザが画像を自動選択する仕組みと、よくある書き方のミスを防ぐための確認ポイントまで整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-font-display-swap",
    "path": "/articles/what-is-font-display-swap",
    "title": "font-display: swapとは？Webフォント表示中の文字の出し方",
    "description": "Webフォントの読み込み中に文字が見えない問題をどう扱うかを決めるのがfont-displayです。swapを指定するとまず代替フォントで表示し後から差し替える挙動になります。各値の違いと、CLSへの影響、実務での選び方を整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-aria",
    "path": "/articles/what-is-aria",
    "title": "WAI-ARIAとは？支援技術にUIを伝える仕組みの基礎",
    "description": "見た目では分かるUIも支援技術には正しく伝わらないことがあります。WAI-ARIAはHTMLだけでは表現できない役割・状態・関係性を補う仕様です。使う前に知るべき「まずHTMLを正しく」という原則と、基本的な属性の使い方を解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-aria-label",
    "path": "/articles/what-is-aria-label",
    "title": "aria-labelとは？ボタンやアイコンに名前をつける属性",
    "description": "アイコンだけのボタンや画像リンクにスクリーンリーダーが読み上げる名前を付けるのがaria-labelです。aria-labelledbyやtitleとの使い分け基準と、誤用が逆効果になるケースを含め、適切に使うための基礎を整理します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-jules-html",
    "path": "/articles/share-jules-html",
    "title": "Google Julesで生成したHTMLを共有URLで見せる方法",
    "description": "Google Julesが非同期で生成したHTMLを、環境構築なしで社外の確認担当者に届けたい人向け。認証付き共有URLの発行から差し替えまでの流れを解説し、どのツールを使うべきか判断できます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-codex-html",
    "path": "/articles/share-codex-html",
    "title": "OpenAI Codexで作ったHTMLを認証付きURLで共有する方法",
    "description": "OpenAI Codexが出力したHTMLやアセットを社外レビュー担当者に安全に渡したい開発者向け。認証付き一時URLを使った保護共有の手順を整理し、最適な共有方法が選べます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-amazon-q-developer-html",
    "path": "/articles/share-amazon-q-developer-html",
    "title": "Amazon Q Developerで生成したHTMLを共有する方法",
    "description": "Amazon Q DeveloperのコードやUI生成結果を社外の担当者に確認してもらいたい人向け。環境構築なしで開ける一時公開URLの使い方を整理し、共有方法を判断できます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-kiro-output",
    "path": "/articles/share-kiro-output",
    "title": "Kiro（AWSのAI IDE）で作ったアプリ・HTMLを共有する方法",
    "description": "AWSのAI IDE「Kiro」で仕様から組み上げたアプリや画面を、関係者にすぐ確認してもらいたい開発者向け。成果物を一時URL化してレビューに回す流れと適切な共有手段を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-bolt-diy-html",
    "path": "/articles/share-bolt-diy-html",
    "title": "bolt.diyで作ったHTMLを共有URLにする方法",
    "description": "ローカルで動くbolt.diyの生成物を、他のメンバーやクライアントに見せたい人向け。出力を一時共有URLに変える具体的な流れと、レビュー用途に合った運用方法が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-pythagora-gpt-pilot-app",
    "path": "/articles/share-pythagora-gpt-pilot-app",
    "title": "GPT Pilotで生成したWebアプリを共有する方法",
    "description": "GPT Pilotが自律的に生成したWebアプリを、ローカル環境に閉じさせずに関係者へレビューさせたい人向け。フロント出力を一時URLで渡し、スムーズに確認を取るための手順が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-openhands-output",
    "path": "/articles/share-openhands-output",
    "title": "OpenHands（旧OpenDevin）で作ったHTMLを共有する方法",
    "description": "OpenHandsのサンドボックス内で生成されたファイルを外部の人に見せたい開発者向け。成果物を一時URLとして取り出し、安全に届けるまでの流れと注意点を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-augment-code-html",
    "path": "/articles/share-augment-code-html",
    "title": "Augment Codeで生成したHTMLを共有する方法",
    "description": "Augment Codeが生成したUIを既存プロジェクトに統合する前に部分プレビューだけ確認してほしい場面向け。切り出したHTMLを一時URLで共有するための手順と使い所が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-zed-ai-html",
    "path": "/articles/share-zed-ai-html",
    "title": "Zed（AI機能）で書いたHTMLを共有URLにする方法",
    "description": "ZedのAI機能で素早く書き上げたHTMLを、ローカルを超えて動く形で誰かに届けたい人向け。ファイルを一時URLにしてリンク一本で渡すまでの手順を紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-pear-ai-html",
    "path": "/articles/share-pear-ai-html",
    "title": "PearAIで作ったHTMLを共有する方法",
    "description": "PearAIのチャット操作で作ったHTMLを、アカウントなしの相手にも動く形で見せたい開発者向け。出力を一時URLに変えて届けるまでの流れと共有の注意点を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-void-editor-html",
    "path": "/articles/share-void-editor-html",
    "title": "Void（OSS AIエディタ）で作ったHTMLを共有する方法",
    "description": "Voidで生成したHTMLやサイトをローカルの外へ届けたい人向け。Cursor代替OSSエディタの生成物を一時URLにして配布するまでの手順と運用上の考え方を紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-continue-dev-html",
    "path": "/articles/share-continue-dev-html",
    "title": "Continue.devで生成したHTMLを共有する方法",
    "description": "Continue.devでエディタ内に生成したHTMLを、ローカル外の関係者に動く形で届けたい開発者向け。一時URLを使った共有手順と、拡張の特性に合った運用方法が判断できます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-roo-code-html",
    "path": "/articles/share-roo-code-html",
    "title": "Roo Code（旧Roo Cline）で作ったHTMLを共有する方法",
    "description": "Roo Codeが自律的に組み上げたHTMLやWebアプリを、手元以外の人にも確認してもらいたい開発者向け。認証付き一時URLへの変換手順と、レビュー依頼に最適な共有方法が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-kilo-code-html",
    "path": "/articles/share-kilo-code-html",
    "title": "Kilo Codeで生成したHTMLを共有する方法",
    "description": "Kilo Codeのエージェントがローカルに組み立てたHTMLを、そのまま他者に見せられない課題を抱えた開発者向け。生成物を一時URLに変えて共有するまでの流れを解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-firebase-studio-app",
    "path": "/articles/share-firebase-studio-app",
    "title": "Firebase Studioで作ったアプリのプレビューを共有する方法",
    "description": "Firebase Studioでブラウザ開発中のプレビューを、本番公開前に関係者へ確認してもらいたい人向け。出力を一時URLにして外部共有する方法と、確認用途に合った運用の考え方が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-google-opal-app",
    "path": "/articles/share-google-opal-app",
    "title": "Google Opalで作ったミニアプリを共有する方法",
    "description": "Google Opalで組み立てたノーコードのミニアプリを、アカウントを持たない相手にも見せたい人向け。成果物を限定共有URLで届ける手順とノーコード特有の配布の悩みを扱います。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-claude-app-canvas-html",
    "path": "/articles/share-claude-app-canvas-html",
    "title": "Claudeのアプリ機能（Artifactsアプリ）で作ったHTMLを共有する方法",
    "description": "ClaudeのArtifacts機能で作ったHTMLをアカウントなしの外部関係者に届けたい人向け。Claudeの画面外で動く形に取り出し、一時URLで共有するための具体的な方法が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-bind-ai-html",
    "path": "/articles/share-bind-ai-html",
    "title": "Bind AI IDEで生成したHTMLを共有する方法",
    "description": "複数モデルを切り替えながらBind AIで作ったHTMLを、ローカルから取り出して関係者へ渡したい開発者向け。一時URLへの変換手順と確認用途に向いた共有の考え方を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-codeium-windsurf-wave-html",
    "path": "/articles/share-codeium-windsurf-wave-html",
    "title": "Windsurf（Codeium）のCascadeで作ったHTMLを共有する方法",
    "description": "WindsurfのCascadeがローカルに作り上げたHTMLやWebアプリを、関係者に共有したい開発者向け。認証付き一時URLへの変換手順と、エージェント型ツール特有の共有課題が整理できます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-blackbox-ai-html",
    "path": "/articles/share-blackbox-ai-html",
    "title": "Blackbox AIで作ったHTMLを共有URLにする方法",
    "description": "Blackbox AIで生成したHTMLを取り出してレビュー担当者に届けたい人向け。コードを一時共有URLに変換する手順と、確認・レビュー用途に合った配布方法が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-phind-html",
    "path": "/articles/share-phind-html",
    "title": "Phindで生成したHTMLを共有する方法",
    "description": "Phindの回答として返ってきた動くHTMLを、Phindアカウントなしの相手にも見せたい開発者向け。出力を取り出して一時URLにするまでの流れと、開発者向け検索ならではの共有の考え方を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-poe-canvas-html",
    "path": "/articles/share-poe-canvas-html",
    "title": "Poe（Canvasアプリ）で作ったHTMLを共有する方法",
    "description": "PoeのCanvasで生成したHTMLアプリを、Poeアカウントを持たない外部の人にも動く形で渡したい人向け。成果物を取り出して一時URLで届けるまでの手順と注意点が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-mistral-codestral-html",
    "path": "/articles/share-mistral-codestral-html",
    "title": "Codestral（Mistral）で生成したHTMLを共有する方法",
    "description": "CodestralのAPIやエディタ拡張で生成したHTMLを、コードではなく動く画面として関係者に見せたい開発者向け。取り出しから一時URL公開までの流れと共有時の考え方を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-tabnine-html",
    "path": "/articles/share-tabnine-html",
    "title": "Tabnineで補完生成したHTMLを共有する方法",
    "description": "TabnineのAI補完で仕上げたHTMLを、動く画面として手元の外の人へ届けたい開発者向け。ファイルを一時共有URLに変えてレビューに回すための手順と運用のポイントが分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-supermaven-html",
    "path": "/articles/share-supermaven-html",
    "title": "Supermavenで書いたHTMLを共有する方法",
    "description": "Supermavenの高速補完で書き上げたHTMLを、スピード感を落とさず関係者に届けたい開発者向け。できたファイルを一時URLに変えてレビューへ回すまでの具体的な手順を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-bubble-ai-app",
    "path": "/articles/share-bubble-ai-app",
    "title": "Bubble（AI機能）で作ったアプリのプレビューを共有する方法",
    "description": "BubbleのAI機能で素早く組んだ画面案を、プレビュー機能以外の方法で静的に確認してほしい場面向け。画面イメージを一時URLで共有するための手順とBubble特有の考え方が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-glide-ai-app",
    "path": "/articles/share-glide-ai-app",
    "title": "Glide（AI生成）で作ったアプリを共有する方法",
    "description": "Glideのノーコード×AI生成で作った画面案を、アプリ公開より手前の段階で軽く確認してもらいたい人向け。画面を一時URLで届けるための手順と、スプレッドシート起点の配布の考え方を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-softr-ai-page",
    "path": "/articles/share-softr-ai-page",
    "title": "Softr（AI機能）で作ったページを共有する方法",
    "description": "SoftrのAI機能で作ったポータルやページの案を、Softr公開前に関係者と軽く確認したい人向け。ページを一時URLで届けるまでの手順と、ノーコード特有の確認フローを整理します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-webflow-ai-page",
    "path": "/articles/share-webflow-ai-page",
    "title": "Webflow AIで作ったページを確認用に共有する方法",
    "description": "Webflow AIで作ったページを本番ドメインへ移す前に方向性を関係者に確認してもらいたいデザイナー・開発者向け。エクスポートや一時URLを組み合わせた確認共有の手順と選び方が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-framer-ai-page",
    "path": "/articles/share-framer-ai-page",
    "title": "Framer AIで作ったサイトを一時URLで共有する方法",
    "description": "Framer AIで形にしたサイトを公開前のレビュー用に限定共有したい場面向け。Framer標準の共有機能と一時URL活用を組み合わせた手順を整理し、最適な確認方法が選べます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-durable-ai-site",
    "path": "/articles/share-durable-ai-site",
    "title": "Durableで作ったAIサイトを共有する方法",
    "description": "数十秒で生成されたDurableのAIサイトを、本公開前に依頼主と一緒に文言や写真を確認したい人向け。確認用共有の手順と、生成直後の仮コンテンツを扱う際の注意点が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-hostinger-ai-builder-site",
    "path": "/articles/share-hostinger-ai-builder-site",
    "title": "Hostinger AIサイトビルダーで作ったサイトを共有する方法",
    "description": "Hostinger AIサイトビルダーの雛形を、本番ホスティングへ移す前に関係者と内容確認したい人向け。確認用共有の手順と、AIビルダー特有の確認フローのポイントが整理できます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-wix-ai-site",
    "path": "/articles/share-wix-ai-site",
    "title": "Wix AIで作ったサイトを確認用に共有する方法",
    "description": "Wix AIが生成したサイトの雛形を、本公開前にデザインや文言を関係者と確認したい人向け。確認用共有の具体的な手順と、ADIを含むWix AI特有の注意点が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-mixo-ai-lp",
    "path": "/articles/share-mixo-ai-lp",
    "title": "MixoのAIで作ったLPを共有する方法",
    "description": "Mixoで素早く立ち上げたLPのコピーやオファーを、広告出稿や本公開の前に関係者と確認したい人向け。確認用共有の手順と、ランディングページ特有の承認フローの考え方が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-bolt-foundry-html",
    "path": "/articles/share-bolt-foundry-html",
    "title": "TypedreamなどAIページ生成ツールのHTMLを共有する方法",
    "description": "TypedreamなどのAIページ生成ツールが出力したHTMLを、ツール固有の制約に依存せず共有したい人向け。どのツールにも使える一時URL共有の汎用的な手順と選択基準が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-presentations-ai-deck",
    "path": "/articles/share-presentations-ai-deck",
    "title": "Presentations.aiで作ったスライドを共有する方法",
    "description": "Presentations.aiが素早く生成したスライドを、社内レビューや顧客提案の場で配布したい人向け。URLで届ける手順と、AI生成スライド特有の共有時の考え方が整理できます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-beautiful-ai-deck",
    "path": "/articles/share-beautiful-ai-deck",
    "title": "Beautiful.aiで作ったプレゼンを共有する方法",
    "description": "Beautiful.aiが自動レイアウトで整えたスライドを社内外に共有したい人向け。誰でも編集できてしまわないか・期限を切れるかといった不安を解消しながら、安全に配布するための手順が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-decktopus-deck",
    "path": "/articles/share-decktopus-deck",
    "title": "Decktopus AIで作ったスライドを共有する方法",
    "description": "Decktopus AIが一気に生成したスライドの候補を、関係者に比較・選別してもらいたい人向け。量産したたたき台を効率よく共有し、取捨選択までの流れをスムーズにする方法が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-pico-app",
    "path": "/articles/share-pico-app",
    "title": "Pico（AI即席アプリ）で作ったアプリを共有する方法",
    "description": "Picoがその場で生成した小さなアプリを、作った人以外にも実際に触ってもらいたい場面向け。手元の出力を誰でも動かせる一時URLに変える手順と、アイデア検証に合った共有の考え方が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-fine-dev-app",
    "path": "/articles/share-fine-dev-app",
    "title": "Fine.dev（AIソフトウェアエンジニア）で作ったHTMLを共有する方法",
    "description": "Fine.devのAIエンジニアが生成した画面を、ブランチ取り込みやビルドの手間なしに関係者へ確認してもらいたい開発者向け。一時URLでの共有手順と適切な使い所が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "recraft-ai-export-share",
    "path": "/articles/recraft-ai-export-share",
    "title": "Recraftで作ったベクター素材・デザインをURLで共有する方法",
    "description": "Recraftで書き出したアイコンやイラストをクライアントに確認してもらいたいデザイナー向け。複数の素材を一覧表示できる一時URLにまとめる手順と、納品前チェックの進め方が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ideogram-typography-share",
    "path": "/articles/ideogram-typography-share",
    "title": "Ideogramで作った文字入り画像を共有して反応を得る方法",
    "description": "Ideogramで作ったロゴ案やコピー入りバナーを関係者に見せて意見を集めたい人向け。文字入り画像を一覧で共有し、反応を効率よく回収するための手順と運用の考え方が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "leonardo-ai-gallery-share",
    "path": "/articles/leonardo-ai-gallery-share",
    "title": "Leonardo.Aiの生成画像をギャラリーにまとめて共有する方法",
    "description": "Leonardo.Aiで量産した画像の中からクライアントに選んでもらう作業を、ファイル送付なしでスムーズに進めたい人向け。ギャラリーを期限付きURLで届ける手順と選定フローの考え方が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "flux-image-batch-share",
    "path": "/articles/flux-image-batch-share",
    "title": "FLUXで量産した画像を一覧で共有して選んでもらう方法",
    "description": "FLUXでバッチ量産した画像の中から最適な一枚を選んでもらいたいクリエイター向け。比較しやすい一覧にまとめて候補選定を依頼するための手順と運用のポイントが分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "krea-ai-realtime-share",
    "path": "/articles/krea-ai-realtime-share",
    "title": "Kreaで作ったビジュアルを共有して確認してもらう方法",
    "description": "Kreaのリアルタイム生成で作ったビジュアルを、書き出し後に関係者へスムーズに確認してもらいたい人向け。画像をHTMLにまとめ認証付き一時URLで届けるまでの流れを整理します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "freepik-ai-asset-share",
    "path": "/articles/freepik-ai-asset-share",
    "title": "Freepik AIで生成した素材をまとめて共有する方法",
    "description": "Freepik AIでまとめて生成した素材の中から採用候補を社内で確認してもらいたい人向け。素材を一覧HTMLにまとめ、認証付き一時URLで共有するまでの流れと運用方法が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "adobe-firefly-output-share",
    "path": "/articles/adobe-firefly-output-share",
    "title": "Adobe Fireflyで作った画像を関係者に共有する方法",
    "description": "Adobe Fireflyで生成した画像を決裁者や社外の関係者に見てもらいたいクリエイター向け。HTMLギャラリーと期限・認証付きURLを組み合わせた届け方と、差し替え対応の流れが分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "playground-ai-image-share",
    "path": "/articles/playground-ai-image-share",
    "title": "Playground（AI画像生成）の作品を共有する方法",
    "description": "PlaygroundなどのAI画像生成ツールで作った作品を、選んだ数点だけパスワード付きで限定共有したい人向け。生成画像を並べた一時URLの作り方とプラットフォーム非依存の共有方法が分かります。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "stable-diffusion-output-share",
    "path": "/articles/stable-diffusion-output-share",
    "title": "Stable Diffusionで生成した画像をHTMLで共有する方法",
    "description": "ローカルのStable Diffusionで溜まった生成画像の中から選んだものを、外部の人に確認してもらいたいユーザー向け。ギャラリーHTMLにまとめ一時URLで安全に外へ出す手順を紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pika-runway-video-poster-share",
    "path": "/articles/pika-runway-video-poster-share",
    "title": "Pika・Runwayで作った動画のポスターHTMLを共有する方法",
    "description": "PikaやRunwayで作ったAI動画のサムネと本編をまとめて関係者に見せたい人向け。ポスター付きHTMLを認証付き一時URLで共有し、スムーズに確認を取るための流れを整理します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "beautiful-ai-deck-share",
    "path": "/articles/beautiful-ai-deck-share",
    "title": "Beautiful.aiで作ったスライドをURLで共有する方法",
    "description": "スライドを特定の相手だけに届けたいとき、メール認証付きの一時URLなら閲覧者を絞りつつ編集権限を渡さずに済む。Beautiful.aiで書き出したHTMLを安全に共有する手順と注意点を整理します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "slidesgpt-share",
    "path": "/articles/slidesgpt-share",
    "title": "SlidesGPTで作ったスライドを共有して反応を得る方法",
    "description": "生成スライドの勢いをレビューまで持続させたい人へ。SlidesGPTで作ったたたき台をHTML化し、期限付き・認証付きのURLで素早く配布してフィードバックを集める具体的な流れを解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "plus-ai-slides-share",
    "path": "/articles/plus-ai-slides-share",
    "title": "Plus AIで作ったスライドをURLで共有する方法",
    "description": "Google スライドで仕上げた資料を社外に見せたいが、編集は渡したくない。そんな悩みを持つ人に向け、HTMLへの書き出しからメール認証付き一時URLで配るまでの手順をわかりやすくまとめました。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "decktopus-share",
    "path": "/articles/decktopus-share",
    "title": "Decktopusで作ったプレゼンを共有する方法",
    "description": "上長や取引先に資料を確認してもらうとき、元データを渡すと事故のもと。Decktopusで作ったスライドを閲覧専用の一時URLに変えて共有する手順と、管理が楽になる理由を説明します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "slides-presentation-ai-share",
    "path": "/articles/slides-presentation-ai-share",
    "title": "Slides AI（SlidesAI.io）で作った資料を共有する方法",
    "description": "SlidesAI.ioで生成した社内向け資料を特定の部署だけに配りたい人へ。会社ドメイン認証付きの一時URLを使って、自社メンバーだけに限定共有できる具体的な手順を紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "mapify-mind-map-share",
    "path": "/articles/mapify-mind-map-share",
    "title": "Mapifyで作ったマインドマップを共有する方法",
    "description": "AIが整理してくれた思考やアイデアを関係者に届けたいとき、期限付きの一時URLなら必要な期間だけ公開してすぐ閉じられる。Mapifyのマインドマップを安全に共有する方法を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "whimsical-ai-diagram-share",
    "path": "/articles/whimsical-ai-diagram-share",
    "title": "Whimsical AIで作った図解を共有する方法",
    "description": "フローチャートやワイヤーフレームのたたき台を編集させずにレビューしてもらいたい人へ。Whimsical AIの図解を閲覧専用の一時URLで配り、期間と対象を絞って管理しやすくする手順をまとめます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "eraser-ai-diagram-share",
    "path": "/articles/eraser-ai-diagram-share",
    "title": "Eraser（DiagramGPT）で作った図を共有する方法",
    "description": "設計図を社内レビューに回したいが情報漏えいは避けたい。EraserのDiagramGPTで生成したアーキテクチャ図やシーケンス図を、認証付き一時URLで安全に共有する方法をステップごとに説明します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "excalidraw-ai-share",
    "path": "/articles/excalidraw-ai-share",
    "title": "Excalidrawのテキスト生成図（AI機能）を共有する方法",
    "description": "手書き風の図でアイデアを素早く伝えたい人へ。ExcalidrawのAI生成図をHTML化して認証付き一時URLで配れば、相手がすぐ開けてフィードバックを返しやすくなる具体的な手順を紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "canva-magic-design-share",
    "path": "/articles/canva-magic-design-share",
    "title": "Canva Magic Designで作ったデザインを共有する方法",
    "description": "AIが提案した複数のデザイン案を並べて比べてもらいたい。書き出した各案を一つのページにまとめ、一時URLで関係者に渡して横並び比較を求める方法を、Canva Magic Designを例に解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "microsoft-designer-share",
    "path": "/articles/microsoft-designer-share",
    "title": "Microsoft Designerで作ったビジュアルを共有する方法",
    "description": "バナーやSNS画像を複数案作ったものの、どれを採用するか決めてもらう場面で手が止まる人へ。Microsoft Designerの出力をHTMLにまとめて共有し、比較・承認を一度のURLで完結させる手順を説明します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "framer-ai-site-share",
    "path": "/articles/framer-ai-site-share",
    "title": "Framer AIで作ったサイトを確認用に共有する方法",
    "description": "本番公開の前に上司やクライアントの承認を取りたい人へ。Framer AIが自動生成したサイトを一時URLで確認共有し、承認フローを素早く回すための手順と注意点をわかりやすく整理します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "durable-ai-site-share",
    "path": "/articles/durable-ai-site-share",
    "title": "Durableで作ったAIサイトを共有してフィードバックを得る方法",
    "description": "数十秒で生成したビジネスサイトを公開前に磨きたい。Durableで作ったAIサイトを認証付きURLで知人や同業者に見せてフィードバックをもらう手順と、共有の際に押さえるべきポイントを解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hostinger-ai-builder-share",
    "path": "/articles/hostinger-ai-builder-share",
    "title": "Hostinger AIビルダーで作ったサイトを共有する方法",
    "description": "ホスティングまで一気通貫のHostinger AIビルダーで作ったサイトでも、本番前に決裁者に確認してもらいたい場面はある。公開前のHTMLを一時共有して承認を得るための手順をわかりやすく紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "mixo-ai-landing-share",
    "path": "/articles/mixo-ai-landing-share",
    "title": "Mixoで作ったAIランディングページを共有する方法",
    "description": "複数のLP案のどれが刺さるかを素早く検証したい人へ。Mixoで作ったランディングページ案をHTMLにまとめてチームや見込み客に比べてもらい、反応差から判断する共有の仕組みを解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wegic-ai-site-share",
    "path": "/articles/wegic-ai-site-share",
    "title": "Wegicで作ったAIサイトをURLで共有する方法",
    "description": "AIとのチャットを重ねて作り上げたサイトを、関係者に見てもらって方向性を確認したい人へ。Wegicで作ったサイトをHTML化し、期限付きURLでレビューに回す具体的な手順をまとめます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "butternut-ai-site-share",
    "path": "/articles/butternut-ai-site-share",
    "title": "Butternut AIで作ったサイトを共有する方法",
    "description": "Butternut AIで自動生成したサイトを、公開前に特定の関係者だけに見せてフィードバックをもらいたい人へ。パスワード付き共有URLで確認依頼を出す手順と、安全に渡すためのコツを紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dora-ai-3d-site-share",
    "path": "/articles/dora-ai-3d-site-share",
    "title": "Dora AIで作った3Dサイトを確認用に共有する方法",
    "description": "スクロールアニメーションや3D表現は静止画では魅力が伝わらない。Dora AIのサイトを書き出して一時URLで動かしながらレビューしてもらう手順と、未公開表現を外部に晒さないための注意点を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ai-image-prompt-credit-share",
    "path": "/articles/ai-image-prompt-credit-share",
    "title": "AI画像生成のプロンプト・クレジット情報を成果物と一緒に共有する方法",
    "description": "AI画像を渡す際に「プロンプトは？」「商用利用は大丈夫？」と聞かれて困った人へ。画像・プロンプト・クレジット情報を一枚のHTMLにまとめ、一度のリンクで完結させる作り方と共有手順を紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ai-tool-trial-deadline-share",
    "path": "/articles/ai-tool-trial-deadline-share",
    "title": "AIツールの無料トライアル中に作った成果物を期限内に共有する方法",
    "description": "無料トライアルが終わるとツールごと成果物が消えてしまう、という経験をした人へ。期間中にHTMLで書き出し、公開期限付きのURLで残しておけば契約後も関係者に見せ続けられる方法をまとめます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "spline-ai-3d-share",
    "path": "/articles/spline-ai-3d-share",
    "title": "Spline AIで作った3Dシーンを共有する方法",
    "description": "インタラクティブに動かせる3Dシーンをブラウザでそのまま見てもらいたい人へ。Spline AIの埋め込みHTMLを認証付き一時URLで共有し、未公開の表現を安全に届ける手順を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "recreate-screenshot-to-html-share",
    "path": "/articles/recreate-screenshot-to-html-share",
    "title": "スクリーンショットからAIで再現したUIを共有する方法",
    "description": "スクリーンショットからAIに起こしてもらったUIが元にどこまで近いか、確かめにくくて困っている人へ。生成HTMLを一時URLで共有して元画像と並べてもらえば、再現度確認と指摘が一度のリンクで進みます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "mobbin-screenshot-ai-share",
    "path": "/articles/mobbin-screenshot-ai-share",
    "title": "参考UIをAIで作り直したデザイン案を共有して比べる方法",
    "description": "参考UIをAIで自社向けに作り直した複数案のどれが刺さるか、関係者に並べて見せたい人へ。複数の再現案HTMLを一ページにまとめてURLで共有し、比較レビューを効率よく回す方法をまとめます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ai-comic-storyboard-share",
    "path": "/articles/ai-comic-storyboard-share",
    "title": "AIで作った絵コンテ・ストーリーボードを共有する方法",
    "description": "AIで起こした絵コンテのコマがばらばらで流れが追いにくい、と感じている制作者へ。コマを順に並べたHTMLを期限付きURLで制作チームに渡し、カットの流れごと確認してもらう手順を紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ai-icon-set-share",
    "path": "/articles/ai-icon-set-share",
    "title": "AIで作ったアイコンセットを一覧で共有して選んでもらう方法",
    "description": "AIで量産したアイコン候補の中からどれを採用するか、大量の選択肢に決断が止まってしまう人へ。候補をHTMLグリッドで一覧化して共有URLで見せれば、関係者がその場で選びやすくなる方法を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ai-infographic-share",
    "path": "/articles/ai-infographic-share",
    "title": "AIで作ったインフォグラフィックHTMLを共有する方法",
    "description": "グラフや動きを活かしたHTMLインフォグラフィックを、そのまま関係者に確認してもらいたい人へ。認証付き一時URLでブラウザ閲覧できる形で提示し、数字や表現の確認をスムーズに進める手順をまとめます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ai-moodboard-share",
    "path": "/articles/ai-moodboard-share",
    "title": "AIで作ったムードボードを共有してトーンを合わせる方法",
    "description": "制作の冒頭でトーンや世界観をそろえておくと後戻りが減る。AIで集めた参考ビジュアルを1枚のムードボードにまとめ、関係者に見せて感覚を合わせるまでの具体的な共有手順をわかりやすく紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ai-blog-hero-image-share",
    "path": "/articles/ai-blog-hero-image-share",
    "title": "AIで作ったブログのアイキャッチ画像案を共有する方法",
    "description": "アイキャッチ候補をチャットに貼ると流れてしまう、という悩みを持つブロガーや編集担当者へ。AI生成の複数案を並べたHTMLを期限付きURLで共有して選定依頼を出す方法を具体的に解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ai-brand-kit-share",
    "path": "/articles/ai-brand-kit-share",
    "title": "AIで作ったブランドキット（ロゴ・配色）を共有する方法",
    "description": "ロゴ・配色・フォントがバラバラに届くと承認者の判断が止まる。AIで作ったブランドキットを1枚のHTMLにまとめ、認証付きURLで承認者に全体像を一気に見せる方法をわかりやすく説明します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "multi-image-ai-compare-share",
    "path": "/articles/multi-image-ai-compare-share",
    "title": "複数の画像生成AIの出力を見比べて選ぶ共有ページの作り方",
    "description": "同じプロンプトで複数ツールの出力を比べたいのに、チャットに貼ると流れて見づらい。ツール別の生成画像を横並びに比較できるHTMLを作り、共有URLで選定を依頼する手順を紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ai-html-review-workflow-end-to-end",
    "path": "/articles/ai-html-review-workflow-end-to-end",
    "title": "AIで作ったHTMLを「生成→共有→レビュー→差し替え」まで一気通貫で回すワークフロー",
    "description": "AIでHTMLを速く作れるようになったのに、レビューで「最新版どれ？」と版管理が乱れてスピードが削られる人へ。生成・共有・レビュー・差し替えを同じURLで回す一気通貫の設計を具体的に示します。",
    "category": "AI活用",
    "updatedAt": "2026-06-26"
  },
  {
    "slug": "ai-html-stakeholder-checklist-before-share",
    "path": "/articles/ai-html-stakeholder-checklist-before-share",
    "title": "AI生成HTMLを関係者に見せる前の最終チェックリスト10項目",
    "description": "見栄えがよくても事実誤認や機密情報の混入、リンク切れで信頼を損ないがちなAI生成HTML。関係者に見せる前に中身・表示・安全性の三つの観点で必ず確認したい10項目をチェックリスト形式で整理します。",
    "category": "AI活用",
    "updatedAt": "2026-06-26"
  },
  {
    "slug": "share-ai-output-with-password-when-confidential",
    "path": "/articles/share-ai-output-with-password-when-confidential",
    "title": "AI生成物に機密情報が含まれるときパスワード共有で守る判断基準",
    "description": "AI生成物を共有するたびにパスワードを付けるのは手間だが、機密が含まれるのに素のURLでは危険。どこで線を引くか悩む人に向け、URLのみで十分な場合とパスワードを加えるべき判断基準を整理します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ai-prototype-weekly-update-same-url",
    "path": "/articles/ai-prototype-weekly-update-same-url",
    "title": "AIプロトタイプを毎週更新しながら同じURLで関係者に見せ続ける運用",
    "description": "プロトタイプを更新するたびに新しいリンクを送ると「最新版どれ？」が頻発し議論がかみ合わなくなる。同じURLのまま中身を差し替え、関係者が常に最新版を開ける運用の仕組みを具体的に解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ai-html-ab-feedback-two-urls",
    "path": "/articles/ai-html-ab-feedback-two-urls",
    "title": "AIに作らせた2案のHTMLを別々のURLで配って意見を分けて集める方法",
    "description": "AIに作らせた2案をまとめて見せると感想が混ざってしまう。案ごとにURLを分けて配れば意見も閲覧データも案単位で整理できる。2案を別URLで出して反応差を見ながら判断するまでの流れを解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-26"
  },
  {
    "slug": "share-ai-output-to-client-with-domain-auth",
    "path": "/articles/share-ai-output-to-client-with-domain-auth",
    "title": "AI制作物をクライアント企業だけに見せる会社ドメイン認証の使い方",
    "description": "クライアント企業の社内関係者全員に確認してもらいたいが、一人ずつ招待するのは手間。会社ドメイン認証を使えば名簿管理を省きながら相手企業のメンバーだけにアクセスを絞る方法を紹介します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ai-generated-demo-time-limited-for-pitch",
    "path": "/articles/ai-generated-demo-time-limited-for-pitch",
    "title": "AI生成デモを商談の期間だけ公開して終わったら自動で閉じる運用",
    "description": "商談が終わったあともデモURLが生き続けて誰でも見られる状態になっている、という経験のある人へ。公開期限を設定して商談の間だけデモを開けておき、終了後に自動で閉じる運用の仕組みを解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "verify-ai-html-on-real-smartphone-before-share",
    "path": "/articles/verify-ai-html-on-real-smartphone-before-share",
    "title": "共有前にAI生成HTMLを実機スマホで開いて崩れを確認する手順",
    "description": "PCプレビューでは綺麗なのに実機スマホで文字が見切れる、ボタンが押しにくいという失敗を防ぎたい人へ。共有URL発行後に手元のスマホで先に開いて確認し、崩れを渡す前に直す手順をまとめます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ai-html-version-compare-with-access-log",
    "path": "/articles/ai-html-version-compare-with-access-log",
    "title": "AI生成HTMLの新旧バージョンをアクセスログで比較して改善判断する方法",
    "description": "AIに改善版を作らせて差し替えたが、本当に良くなったか感覚では判断できない人へ。同じURLのまま差し替える仕組みとアクセスログを組み合わせ、新旧バージョンの閲覧データで改善を数字で判断する方法を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "collect-feedback-on-ai-mockup-from-non-tech",
    "path": "/articles/collect-feedback-on-ai-mockup-from-non-tech",
    "title": "AIモックアップを非エンジニアに見せて具体的なフィードバックを引き出すコツ",
    "description": "非エンジニアにAIモックアップを見せても「いい感じ」で終わりがちな人へ。URLを渡すだけでなく見てほしい点を一言添えるだけで返ってくる意見の質が大きく変わる、具体的なコツをまとめます。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "kagoya-vs-share",
    "path": "/articles/kagoya-vs-share",
    "title": "KAGOYAレンタルサーバー・KAGOYA CLOUDとの違い｜本番運用との使い分け",
    "description": "長期運用向けのKAGOYAと、HTMLを短期間だけ見せたい確認用途はそもそも役割が違う。契約の手間なく素早く公開したい場面でどちらを選ぶべきか、使い分けの線引きをわかりやすく整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "mixhost-vs-share",
    "path": "/articles/mixhost-vs-share",
    "title": "mixhostとの違いと使い分け｜高速WordPress運用と一時HTML共有",
    "description": "高速WordPress運用に強いmixhostと、未公開HTMLを数日だけ見せたい用途はゴールが異なる。どの場面でそれぞれを選ぶべきか悩む人に向け、両者の役割の違いと使い分けの基準を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wpx-speed-vs-share",
    "path": "/articles/wpx-speed-vs-share",
    "title": "wpX Speedとの違い｜WordPress専用サーバーと一時HTML共有",
    "description": "WordPress継続運用に特化したwpX Speedは、HTMLを数日だけ関係者に見せる確認用途には少し重い。どちらの仕組みが自分の目的に合うか、役割の違いを具体的な場面と対応させて説明します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "kusanagi-vs-share",
    "path": "/articles/kusanagi-vs-share",
    "title": "KUSANAGIとの違いと使い分け｜高速実行環境と一時HTML共有",
    "description": "サーバーを自ら構築してチューニングするKUSANAGIは本番運用に向くが、完成HTMLを短期共有したいだけなら構築コストが過剰になることもある。両者の役割を整理し、使い分けの判断基準を示します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "heroku-vs-share",
    "path": "/articles/heroku-vs-share",
    "title": "Herokuとの違いと使い分け｜アプリ実行基盤と一時HTML共有",
    "description": "サーバーサイドのロジックを持つアプリ公開に強いHerokuと、完成した画面を関係者に見せるだけの確認用途はそもそも用途が違う。どちらが自分のニーズに合うか、役割の違いと使い分け基準を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "aws-amplify-vs-share",
    "path": "/articles/aws-amplify-vs-share",
    "title": "AWS Amplify Hostingとの違いと使い分け",
    "description": "継続的なデプロイパイプラインに強みを持つAWS Amplify Hostingと、完成物を数日だけ確認に見せたい用途では必要な仕組みが異なる。両者の役割の違いと、選び方の基準をわかりやすく整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "aws-lightsail-vs-share",
    "path": "/articles/aws-lightsail-vs-share",
    "title": "AWS Lightsailとの違い｜VPSでのサイト公開と一時HTML共有",
    "description": "月額固定でVPS一式を借りられるAWS Lightsailは本番サイト構築向きだが、完成HTMLを短期間だけ見せたい場面ではサーバー管理が負担になることもある。両者の使い分けの判断基準を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "azure-static-web-apps-vs-share",
    "path": "/articles/azure-static-web-apps-vs-share",
    "title": "Azure Static Web Appsとの違いと使い分け",
    "description": "GitHubと連携した継続デプロイに強いAzure Static Web Appsと、完成物を数日だけ確認に回したい用途ではセットアップの重さが異なる。自分の目的に合うほうを選ぶための違いと基準を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-cloud-run-vs-share",
    "path": "/articles/google-cloud-run-vs-share",
    "title": "Google Cloud Runとの違い｜コンテナ実行と一時HTML共有",
    "description": "コンテナを動かしてリクエストに応答するGoogle Cloud Runは、サーバーサイド処理があるアプリ向き。完成した画面を見せたいだけの確認用途には別の仕組みが向く理由を、役割の違いとともに解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "app-engine-vs-share",
    "path": "/articles/app-engine-vs-share",
    "title": "Google App Engineとの違いと使い分け｜PaaSと一時HTML共有",
    "description": "コードをデプロイすると自動スケールしながら動くGoogle App Engineは本番アプリ運用に向く。一方で完成した画面を数日間関係者に見せたいだけの場面では、役割が違う仕組みのほうが軽快です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "digitalocean-app-platform-vs-share",
    "path": "/articles/digitalocean-app-platform-vs-share",
    "title": "DigitalOcean App Platform・Dropletとの違いと使い分け",
    "description": "VPSとPaaSどちらを選べばいいか迷っているエンジニアへ。DropletとApp Platformの違いを整理しながら、「HTMLを一時的に見せるだけ」の用途ではサーバー運用が目的とずれる理由を掘り下げ、道具の選択基準を明確にします。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "linode-vs-share",
    "path": "/articles/linode-vs-share",
    "title": "Linode（Akamai）VPSとの違い｜サーバー運用と一時HTML共有",
    "description": "AkamaiのVPSでHTMLを公開しようとしている方へ。OS管理の自由度が高いLinodeの特性と、関係者に一時的なプレビューURLを渡すだけのニーズとの間にあるギャップを整理し、どちらが用途に合うかを判断する材料を提供します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "vultr-vs-share",
    "path": "/articles/vultr-vs-share",
    "title": "Vultrとの違いと使い分け｜海外VPSと一時HTML共有",
    "description": "コスト重視で海外VPSを検討しているなら、Vultrは魅力的な選択肢です。ただし静的HTMLを特定の相手にだけ渡したい確認作業には、VPS運用とは別の手段が向く場合があります。両者の役割の違いと使い分けの基準をまとめました。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hetzner-vs-share",
    "path": "/articles/hetzner-vs-share",
    "title": "Hetznerとの違いと使い分け｜欧州VPSと一時HTML共有",
    "description": "欧州VPSのHetznerは価格性能比の高さで人気ですが、「デザイン案のHTMLをクライアントに送りたいだけ」という場面では自前サーバーは過剰になりがちです。本番インフラと一時プレビュー共有の境界線を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "kinsta-vs-share",
    "path": "/articles/kinsta-vs-share",
    "title": "Kinstaとの違いと使い分け｜マネージドWordPressと一時HTML共有",
    "description": "WordPressの本番運用に最適化されたKinstaと、AIや手作業で生成した静的HTMLを一時的にレビューしてもらう用途は目的が異なります。マネージドホスティングが向く場面とそうでない場面を整理し、判断の手助けをします。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wp-engine-vs-share",
    "path": "/articles/wp-engine-vs-share",
    "title": "WP Engineとの違いと使い分け｜海外マネージドWordPressと一時共有",
    "description": "WP Engineはステージング環境も備えたWordPress特化のホスティングですが、静的HTMLをサクッとクライアントに見せたいだけなら、WordPress環境を立ち上げるのは回り道です。両者の目的の違いと使い分けを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hostgator-vs-share",
    "path": "/articles/hostgator-vs-share",
    "title": "HostGatorとの違い｜海外共有ホスティングと一時HTML共有",
    "description": "HostGatorはドメインやメールもセットで長期運用するのに向いた共有ホスティングです。一方で確認用HTMLを一度だけ渡すなら、アカウント契約が不要な選択肢もあります。継続運用と一時共有の違いと判断軸を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "bluehost-vs-share",
    "path": "/articles/bluehost-vs-share",
    "title": "Bluehostとの違いと使い分け｜WordPress公式推奨ホスティングと一時共有",
    "description": "WordPress公式推奨のBluehostは本番サイト構築の定番ですが、制作途中のHTMLを関係者にすぐ見せたいだけの場面では手続きが多すぎます。本格的なホスティング契約と一時的なHTML共有を、目的から分けて考えます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "squarespace-vs-share",
    "path": "/articles/squarespace-vs-share",
    "title": "Squarespaceとの違いと使い分け｜ノーコードサイトと一時HTML共有",
    "description": "Squarespaceはデザイン性の高い本番サイトを最短で立ち上げるのに向いています。しかし「公開前の成果物を関係者だけにプレビューしてほしい」という場面では別の道具が必要です。目的と寿命を軸に両者の使い分けを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-business-profile-vs-share",
    "path": "/articles/google-business-profile-vs-share",
    "title": "Googleビジネスプロフィールのサイト機能との違い",
    "description": "Googleビジネスプロフィールは店舗情報を検索やマップに載せるためのもので、任意のHTMLを特定の相手にだけ見せる用途とは仕組みが根本的に異なります。どちらが何のために存在するかを整理し、用途ごとの選択を明確にします。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "shopify-vs-share",
    "path": "/articles/shopify-vs-share",
    "title": "Shopifyとの違いと使い分け｜ECサイトと一時HTML共有",
    "description": "Shopifyは決済・在庫管理を含む本格ECに最適ですが、ストアデザイン案やキャンペーンページの試作を限定的に見せたいだけなら、もっと軽い手段があります。本番ECと一時プレビュー共有の役割の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "base-ec-vs-share",
    "path": "/articles/base-ec-vs-share",
    "title": "BASEとの違い｜ネットショップ作成と一時HTML共有",
    "description": "BASEは商品を売るためのネットショップ基盤であり、制作した静的HTMLを関係者に期間限定で確認してもらう用途とは目的が異なります。ショップ開設と一時的なHTML共有をどう使い分けるか、判断基準をまとめます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "stores-vs-share",
    "path": "/articles/stores-vs-share",
    "title": "STORESとの違いと使い分け｜ネットショップと一時HTML共有",
    "description": "STORESは本番のEC運用を担うプラットフォームで、継続的な商品販売に向いています。一方でHTMLの制作物を社内外の関係者にレビューしてもらう用途はスコープが違います。両者の役割の差異と選択基準を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "aws-s3-presigned-vs-share",
    "path": "/articles/aws-s3-presigned-vs-share",
    "title": "Amazon S3署名付きURLとの違い｜期限付きアクセスと認証付き共有",
    "description": "S3の署名付きURLはファイル単位のアクセス制御に強みがありますが、複数ファイルで構成されるHTMLを「サイトとして見せる」確認用途では使い勝手に差があります。仕組みの違いと、どちらが自分のニーズに合うかを比較します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cloudfront-vs-share",
    "path": "/articles/cloudfront-vs-share",
    "title": "Amazon CloudFrontとの違いと使い分け｜CDN配信と一時HTML共有",
    "description": "CloudFrontは大規模な本番サイトを世界規模で配信するCDNインフラです。確認用HTMLを手早く一時公開したいだけの場面とは目的が異なります。本番CDNと一時共有という役割の違いを整理し、用途ごとの選択を明確にします。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-cloud-storage-vs-share",
    "path": "/articles/google-cloud-storage-vs-share",
    "title": "Google Cloud Storageの公開リンクとの違いと使い分け",
    "description": "GCSはファイルを保管して公開リンクで配れるクラウドストレージですが、認証付きでHTMLをサイトとして見せる一時共有には別の使い勝手が必要です。ストレージ配信と確認用共有の違いを具体的に整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "azure-blob-vs-share",
    "path": "/articles/azure-blob-vs-share",
    "title": "Azure Blob StorageのSAS URLとの違い",
    "description": "SAS URLの細かいアクセス制御と、HTMLをすぐ関係者に見せたい場面での手軽な共有の違いを把握し、用途に合った方法を選べるようになるための比較記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "backblaze-b2-vs-share",
    "path": "/articles/backblaze-b2-vs-share",
    "title": "Backblaze B2でHTMLを公開する場合との違い",
    "description": "Backblaze B2は大容量データの保管と配信を低コストで行える選択肢ですが、HTMLを短期間だけ関係者に見せるプレビュー用途では手順が増えがちです。オブジェクトストレージと一時共有の違いをわかりやすく比べます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "transfer-sh-vs-share",
    "path": "/articles/transfer-sh-vs-share",
    "title": "transfer.shとの違い｜コマンド転送と認証付きURL共有",
    "description": "transfer.shはターミナルからすぐファイルを送れる開発者向けのツールですが、認証付きURLでHTMLページを見せる確認フローには別の仕組みが向きます。コマンドライン転送と安全なHTMLプレビュー共有の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gofile-vs-share",
    "path": "/articles/gofile-vs-share",
    "title": "GoFileでHTMLを共有する場合との違いと使い分け",
    "description": "GoFileは登録不要で大容量ファイルを素早く共有できる手軽さが魅力です。ただし公開前の成果物を特定の関係者にだけ見せたい場合、認証の考え方が異なるサービスが向きます。匿名共有と限定共有の違いと使い分けを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "file-io-vs-share",
    "path": "/articles/file-io-vs-share",
    "title": "file.ioとの違い｜使い捨てURLと公開期限付き共有",
    "description": "file.ioの「ダウンロード後に消える」使い捨てURLは秘匿性が高い反面、確認期間中に何度もHTMLを見せたい用途には不向きです。使い捨てURLと期限付き繰り返し閲覧共有の違いと、どちらが自分のニーズに合うかを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "proton-drive-vs-share",
    "path": "/articles/proton-drive-vs-share",
    "title": "Proton DriveでHTMLを共有する場合との違い",
    "description": "Proton Driveはエンドツーエンド暗号化でプライバシーを守るクラウドストレージですが、HTMLをブラウザで描画した状態のまま関係者に渡したい確認用途には別の仕組みが向きます。暗号化ストレージとHTMLプレビュー共有の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tresorit-vs-share",
    "path": "/articles/tresorit-vs-share",
    "title": "Tresoritとの違い｜暗号化ファイル共有と認証付きHTML共有",
    "description": "Tresoritはコンプライアンス重視の組織に選ばれる暗号化ファイル共有サービスです。一方でHTML成果物を社内確認用にすぐ共有したい場面では別の選択肢が使いやすいこともあります。セキュアストレージと一時プレビュー共有の違いを比べます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "jumpshare-vs-share",
    "path": "/articles/jumpshare-vs-share",
    "title": "Jumpshareとの違いと使い分け｜ファイルプレビュー共有とHTML共有",
    "description": "Jumpshareは動画や画像など多様なファイルをリンク一つで見せるプレビュー共有が得意ですが、JavaScriptが動くHTMLをサイトとしてそのまま見せたい場面では別の選択肢が向きます。両者の違いとシーン別の使い分けを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gitbook-vs-share",
    "path": "/articles/gitbook-vs-share",
    "title": "GitBookとの違い｜ドキュメントサイトと一時HTML共有の使い分け",
    "description": "GitBookは製品ドキュメントやヘルプサイトを長期にわたって育てるツールです。「今日完成したHTMLを明日のミーティングまでに見てほしい」という短命な確認とは、目的も寿命も異なります。ドキュメント管理と一時プレビュー共有の境界を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "obsidian-publish-vs-share",
    "path": "/articles/obsidian-publish-vs-share",
    "title": "Obsidian Publishとの違いと使い分け｜ノート公開と一時HTML共有",
    "description": "Obsidian Publishは自分のノートをそのまま常設Webサイトとして公開する仕組みです。特定の成果物を相手を選んで期間限定で見せる確認共有とは、読み手も寿命も異なります。知識公開と一時レビュー共有の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "docbase-vs-share",
    "path": "/articles/docbase-vs-share",
    "title": "DocBaseでの社内共有との違いと使い分け",
    "description": "DocBaseはチームの知識を検索可能に蓄積する情報共有ツールです。HTML成果物を特定の関係者にだけ一時的に渡して確認を取るフローとは目的が異なります。ナレッジ蓄積と確認用一時共有のどちらに何が向くかを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "growi-vs-share",
    "path": "/articles/growi-vs-share",
    "title": "GROWIとの違い｜社内wikiと一時HTML共有の使い分け",
    "description": "GROWIはMarkdownでwikiを構築・継続運用するナレッジ基盤です。「完成したHTMLを今週だけ見てほしい」という一時レビューとは性格が異なります。継続的な社内知識管理と一時的なHTML共有の違いを整理し、使い分けの基準を示します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gamma-deck-vs-share",
    "path": "/articles/gamma-deck-vs-share",
    "title": "Gammaの公開リンクとの違いと使い分け｜AIスライド公開とHTML共有",
    "description": "GammaはAIでスライドを素早く作り公開リンクで渡せるツールです。しかし自分で作り込んだHTMLやZIPサイトを特定の相手にだけ見せたい場合、スライド生成ツールとは前提が異なります。AIスライド共有とHTML限定公開の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "val-town-vs-share",
    "path": "/articles/val-town-vs-share",
    "title": "Val Townとの違いと使い分け｜サーバーレス実行と一時HTML共有",
    "description": "Val TownはブラウザでJSを書いてそのまま動かせるサーバーレス実行環境です。動的処理が不要で、完成した静的HTMLを相手を絞って一時的に見せたいだけの場面とは目的が異なります。コード実行ホスティングと一時HTML共有の違いを比べます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-apps-script-vs-giga-site",
    "path": "/articles/google-apps-script-vs-giga-site",
    "title": "Google Apps ScriptのWebアプリ公開との違い",
    "description": "GASのWebアプリはスプレッドシートなどGoogle連携の動的処理を公開するのに向いています。静的HTMLを認証付きで特定の相手に一時的に見せる用途とは仕組みが根本的に異なります。両者の前提の違いと使い分けを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "obsidian-publish-vs-giga-site",
    "path": "/articles/obsidian-publish-vs-giga-site",
    "title": "Obsidian Publishとの違い｜ナレッジ常設公開と一時レビュー共有",
    "description": "Obsidian Publishは知識を常設サイトとして公開し続けるための仕組みです。成果物を期間限定でレビューに回す「使い捨て共有」とは時間軸も読み手も異なります。「常設公開」と「一時レビュー」という視点から両者の使い分けを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "logseq-publish-vs-giga-site",
    "path": "/articles/logseq-publish-vs-giga-site",
    "title": "Logseqの公開機能との違いと使い分け",
    "description": "Logseqのノート公開機能はアウトライナーで育てた思考をWebサイトとして残すためのものです。完成した成果物HTMLを期間限定で関係者にだけ届けたい確認フローとは役割が異なります。ノート公開と一時HTML共有の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "readme-so-vs-giga-site",
    "path": "/articles/readme-so-vs-giga-site",
    "title": "READMEやリポジトリ閲覧との違い｜ソース閲覧とHTML実物の共有",
    "description": "GitリポジトリのREADMEはコードを読ませるための場所です。HTMLを作ったときに相手に伝えたいのは「描画された実物」であることが多く、ソース閲覧とは異なるニーズです。目的に応じた道具の選び方を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "p5js-editor-vs-giga-site",
    "path": "/articles/p5js-editor-vs-giga-site",
    "title": "p5.js Web Editorとの違い｜スケッチ共有とHTML作品の一時公開",
    "description": "p5.js Web Editorはスケッチを書いてすぐ動かして共有するのが得意な環境です。しかし完成した作品HTMLを特定の関係者だけに限定公開したい場合には別の手段が向きます。クリエイティブな成果物の共有先をどう選ぶかを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "observable-vs-giga-site",
    "path": "/articles/observable-vs-giga-site",
    "title": "Observable（ノートブック公開）との違いと使い分け",
    "description": "Observableはデータ可視化をリアクティブに書いて共有できるノートブック環境です。固めた可視化レポートを期間限定で関係者だけに渡したい場合とは前提が異なります。ノートブック公開と一時HTML共有の使い分けを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "val-town-vs-giga-site",
    "path": "/articles/val-town-vs-giga-site",
    "title": "Val Townとの違い｜関数ホスティングと一時HTML共有",
    "description": "Val Townはサーバーレスで関数を動かすホスティング環境として開発者に人気です。静的な成果物を特定の相手に限定的に届けたいだけの場面とは守備範囲が異なります。関数ホスティングと一時HTML共有の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "bunny-net-vs-giga-site",
    "path": "/articles/bunny-net-vs-giga-site",
    "title": "Bunny.net（CDN/ストレージ配信）との違いと使い分け",
    "description": "Bunny.netは本番コンテンツを世界中に高速配信するCDN・ストレージサービスです。関係者にだけレビュー用の成果物を一時的に見せたい場面とは規模と目的が異なります。大規模本番配信と一時確認共有の役割の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "azure-static-web-apps-vs-giga-site",
    "path": "/articles/azure-static-web-apps-vs-giga-site",
    "title": "Azure Static Web Appsとの違い｜本番静的配信と一時共有",
    "description": "本番運用向けの静的サイト常設デプロイと、確認用の一時共有はどう使い分けるべきか。目的・コスト・操作手順の違いから最適な選択肢を判断できるようになる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-cloud-storage-website-vs-giga-site",
    "path": "/articles/google-cloud-storage-website-vs-giga-site",
    "title": "Google Cloud Storageの静的サイト公開との違い",
    "description": "GCSバケットで静的サイトを公開するには設定手順がいくつか必要です。確認用の成果物をドロップ一つで関係者に届けたい場面とは手間の差があります。GCSの静的公開と一時限定共有の違いを手順の観点から整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "vercel-blob-vs-giga-site",
    "path": "/articles/vercel-blob-vs-giga-site",
    "title": "Vercel Blobなどオブジェクトストレージ共有との違い",
    "description": "Vercel BlobなどのオブジェクトストレージはファイルURLを配るのが得意ですが、HTMLを「ページとして描画された状態」で関係者に見せたいニーズとは役割が異なります。ファイル配信とHTMLプレビュー共有の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "codeberg-pages-vs-giga-site",
    "path": "/articles/codeberg-pages-vs-giga-site",
    "title": "Codeberg Pagesとの違いと使い分け",
    "description": "Codeberg PagesはGitリポジトリと連携して静的サイトを無料公開できる開発者向けのサービスです。特定の相手にだけ期間を決めて見せたい確認共有とは前提が異なります。常設の静的公開と一時限定共有の使い分けを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "sourcehut-pages-vs-giga-site",
    "path": "/articles/sourcehut-pages-vs-giga-site",
    "title": "SourceHut Pagesとの違いと使い分け",
    "description": "SourceHut PagesはCLIやビルドパイプラインと組み合わせてサイトを公開する開発者志向のホスティングです。クライアントへの確認依頼に手早くURLを渡したいだけの場面とは手順の重さが異なります。両者の違いと使い分けを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "lp-archive-vs-giga-site",
    "path": "/articles/lp-archive-vs-giga-site",
    "title": "Web魚拓・archive.todayでページを見せる場合との違い",
    "description": "Web魚拓やarchive.todayは既存ページをある時点で保存・閲覧するアーカイブサービスです。自作HTMLを特定の相手に見せたい場面とは目的が根本的に異なります。アーカイブと一時的なHTML限定共有の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "instant-page-vs-giga-site",
    "path": "/articles/instant-page-vs-giga-site",
    "title": "ペライチ系インスタントLP作成との違い｜常設LPと確認用共有",
    "description": "ペライチなどのインスタントLPツールはテンプレートから常設のランディングページを作るためのサービスです。制作途中のHTMLを関係者に確認してもらう場面とは寿命も目的も異なります。常設LPと確認用プレビュー共有の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "base-shop-vs-giga-site",
    "path": "/articles/base-shop-vs-giga-site",
    "title": "BASE・STORESのショップページ公開との違い",
    "description": "BASEやSTORESのショップページは商品販売のために開設・継続運用するものです。HTMLで作った制作物を一時的に確認してもらう用途とは目的が異なります。ECショップ開設と確認用HTML共有の違いをわかりやすく整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "peraichi-form-vs-giga-site",
    "path": "/articles/peraichi-form-vs-giga-site",
    "title": "Googleフォーム等のフォーム公開との違い｜入力受付とHTML共有",
    "description": "Googleフォームなどのフォーム公開ツールはアンケートや申込の回答を集めるためのものです。HTMLページそのものをブラウザで見せたいニーズとは役割が異なります。入力受付ツールとHTML共有をどう使い分けるかを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "qiita-zenn-vs-giga-site",
    "path": "/articles/qiita-zenn-vs-giga-site",
    "title": "Qiita・ZennでHTMLを見せられない理由と使い分け",
    "description": "QiitaやZennは技術記事を書いて公開するのに最適ですが、HTMLやJavaScriptを自由に動かして見せることには制限があります。実物のHTMLを動いた状態で見せたい場合に何を使えばいいか、理由とともに整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-photos-share-vs-giga-site",
    "path": "/articles/google-photos-share-vs-giga-site",
    "title": "Googleフォト共有リンクとの違い｜画像共有とHTMLサイト共有",
    "description": "Googleフォトの共有リンクは画像や動画のアルバムを素早く渡せる便利な仕組みです。ただしリンクやボタンが動くHTMLページをそのまま見せたい用途には別の手段が必要です。画像共有とHTMLサイト共有の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "marp-slide-vs-giga-site",
    "path": "/articles/marp-slide-vs-giga-site",
    "title": "Marp等でスライドHTMLを共有する場合との違い",
    "description": "MarpはMarkdownからスライドHTMLをエクスポートできるエンジニア向けの定番ツールです。書き出したHTMLを関係者だけに渡したい場合、配布方法が悩みどころになります。スライド生成と認証付きHTMLプレビュー共有の組み合わせ方を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gamma-vs-giga-site",
    "path": "/articles/gamma-vs-giga-site",
    "title": "Gamma（AIプレゼン作成）との違いと使い分け",
    "description": "AIでスライドや文書を自動生成するGammaと、自作のHTMLやZIPを限定公開するサービスは目的が異なります。「見せ方を作る」ツールと「作ったものを安全に渡す」ツールの違いを理解したい方に、選び方の基準を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "miro-figjam-share-vs-giga-site",
    "path": "/articles/miro-figjam-share-vs-giga-site",
    "title": "Miro・FigJamの共有リンクとの違い",
    "description": "MiroやFigJamのリアルタイム共同作業と、完成HTMLを関係者にレビューしてもらう静的な共有は役割が別物です。議論フェーズと確認フェーズで道具を使い分けたい方に、それぞれの特徴と選び方を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "figma-prototype-share-vs-giga-site",
    "path": "/articles/figma-prototype-share-vs-giga-site",
    "title": "Figmaプロトタイプ共有リンクとの違い｜デザイン確認とHTML確認",
    "description": "Figmaのプロトタイプでデザインを確認するフェーズと、実装後のHTMLをブラウザで動作確認するフェーズでは見るべきものが変わります。デザインと実装の確認フェーズを整理して選択肢を探している方向けに、両者の違いを解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "loom-vs-giga-site",
    "path": "/articles/loom-vs-giga-site",
    "title": "Loomで画面録画を共有する場合との違い｜動画とHTML実物の共有",
    "description": "操作デモを録画で見せるLoomと、相手に実際に触らせて確認してもらうHTML共有では、伝わる情報量が異なります。フィードバックをより深く得たい場面で、動画と実物共有のどちらが適しているか判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-password-mail-vs-giga-site",
    "path": "/articles/zip-password-mail-vs-giga-site",
    "title": "パスワード付きZIPをメールで送る方法との違いと使い分け",
    "description": "PPAPと呼ばれるパスワード付きZIPメール送信の問題点が気になっている方へ。セキュリティリスクと運用コストを踏まえたうえで、認証付きURL共有への移行が自分のケースに合うかどうかを見極められます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "line-file-share-vs-giga-site",
    "path": "/articles/line-file-share-vs-giga-site",
    "title": "LINEでHTMLファイルを送ると開けない理由と対処",
    "description": "LINEでHTMLファイルを送っても相手が開けない原因はチャットアプリの仕組みにあります。タグが丸見えになる理由をやさしく説明し、URLとして共有する方法へ切り替えるとどう変わるかを判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "chatwork-file-vs-giga-site",
    "path": "/articles/chatwork-file-vs-giga-site",
    "title": "ChatworkでHTMLを共有する場合との違いと対処",
    "description": "ChatworkへのHTML添付が「開けない」と言われて困っている担当者向けに、ビジネスチャットがWebページ表示に向かない理由を解説。URLで正しく見せる方法との使い分けを判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "discord-file-vs-giga-site",
    "path": "/articles/discord-file-vs-giga-site",
    "title": "DiscordでHTMLを共有する方法と開けないときの対処",
    "description": "DiscordにHTMLを上げてもメンバーが表示できないと困っているコミュニティ運営者向けに、添付とURL共有の根本的な違いを整理。確実にページを見てもらうための対処法を選べるようになります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "kintone-vs-giga-site",
    "path": "/articles/kintone-vs-giga-site",
    "title": "kintoneのポータル共有との違いと使い分け",
    "description": "社内業務管理にkintoneを使いつつ、社外のクライアントにもHTMLの成果物を見せたい場面で迷っている方向けに、社内ポータルと一時的な社外共有の役割の違いと適切な使い分けを解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "sharepoint-vs-giga-site",
    "path": "/articles/sharepoint-vs-giga-site",
    "title": "SharePointでHTMLを公開する場合との違い",
    "description": "SharePointで社内文書を管理しながら、社外の相手にもHTMLページを見せたい場面で公開設定に悩んでいる方向けに、組織内運用と一時的な社外共有の違いを整理して判断基準を示します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-classroom-vs-giga-site",
    "path": "/articles/google-classroom-vs-giga-site",
    "title": "Google ClassroomでHTML課題を共有する場合との違い",
    "description": "Google ClassroomにHTMLを添付したら正しく表示されなかった経験がある教育者向けに、課題配布プラットフォームとHTMLをそのまま動かして見せる手段の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "moodle-vs-giga-site",
    "path": "/articles/moodle-vs-giga-site",
    "title": "Moodle等LMSでHTML教材を見せる場合との違い",
    "description": "Moodle等のLMSでHTML教材を配信する際に表示の不安定さを感じているeラーニング担当者向けに、学習管理に特化したLMSと素早くHTML教材を見せる手段の使い分けを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webp-test-iframe-vs-giga-site",
    "path": "/articles/webp-test-iframe-vs-giga-site",
    "title": "iframe埋め込み公開との違い｜ページ内表示と単独URL共有",
    "description": "iframeでHTMLを埋め込もうとして表示崩れやセキュリティ制限に引っかかった経験がある方向けに、埋め込み表示と独立URL共有がそれぞれ得意な場面を整理して選択肢を示します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "data-uri-vs-giga-site",
    "path": "/articles/data-uri-vs-giga-site",
    "title": "data URI・単一HTMLファイル配布との違いと使い分け",
    "description": "data URIや単一HTMLファイルで配布しているが容量や更新のしにくさに限界を感じている方向けに、配布方法ごとの特徴とアクセス制御ができる認証付き共有URLとの使い分けを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pastebin-vs-giga-site",
    "path": "/articles/pastebin-vs-giga-site",
    "title": "Pastebin・GitHub Gistのraw表示との違い｜テキスト共有とHTML描画",
    "description": "コードを貼るPastebinやGist rawとHTMLをブラウザで描画して見せる共有では、相手に届く体験がまったく異なります。テキスト共有と動くHTMLの共有、どちらが今の用途に合うかを判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "transfer-sh-vs-giga-site",
    "path": "/articles/transfer-sh-vs-giga-site",
    "title": "transfer.shなどCLIファイル転送との違いと使い分け",
    "description": "curlでサッとファイルを渡せるCLI転送の手軽さに慣れているエンジニア向けに、HTMLを描画して見せたい・相手を限定したいといった要件が加わったときに適した手段との違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "filestack-uploadcare-vs-giga-site",
    "path": "/articles/filestack-uploadcare-vs-giga-site",
    "title": "Uploadcare・Filestackなどファイルアップロードサービスとの違い",
    "description": "UploadcareやFilestackのようなAPI型ファイルサービスと、確認・レビュー用のHTML一時共有は似て非なるものです。アプリ組み込みの基盤が必要なのか、成果物を見せる場が必要なのかを切り分けられます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "qrcode-only-vs-giga-site",
    "path": "/articles/qrcode-only-vs-giga-site",
    "title": "QRコード生成サービス単体との違い｜QRと共有URL公開の関係",
    "description": "QRコードはURLを画像にするだけで、リンク先のページは別途用意が必要です。QR生成だけでは何が足りないのかを理解し、URLの発行からQR配布までをまとめて整理したい方に判断基準を示します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "lovable-bolt-vs-giga-site",
    "path": "/articles/lovable-bolt-vs-giga-site",
    "title": "Lovable・bolt.newなどAIアプリ生成のデプロイとの違い",
    "description": "LovableやBoltでAIアプリを常設デプロイするのと、特定の画面案を関係者にだけ一時的に確認してもらうのは目的が異なります。本番運用と事前レビューのどちらが今必要かを判断したい方向けに整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-classroom-html-share-comparison",
    "path": "/articles/google-classroom-html-share-comparison",
    "title": "Google ClassroomでHTML教材を配るときとの違い",
    "description": "Google Classroomで課題を管理しながら、インタラクティブなHTML教材を実際に動かして確認させたい場面で悩んでいる教育担当者向けに、LMS管理と一時URL共有の使い分けを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "kintone-html-share-comparison",
    "path": "/articles/kintone-html-share-comparison",
    "title": "kintoneにHTMLを貼る場合との違い｜業務アプリ内表示とURL共有の使い分け",
    "description": "kintoneで業務フローを管理しながら、社外クライアントへのHTML確認共有にも対応したい担当者向けに、社内業務基盤への埋め込みと社外向け一時URLの役割の違いを分かりやすく整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "salesforce-html-share-comparison",
    "path": "/articles/salesforce-html-share-comparison",
    "title": "Salesforceで提案HTMLを共有する場合との違いと使い分け",
    "description": "Salesforceで商談を管理しつつ、提案HTMLを商談相手にすぐ見せたい営業担当者向けに、CRM内の資料管理と社外への一時共有の違いを整理して、どちらが今の目的に合うかを判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "chatwork-html-share-note",
    "path": "/articles/chatwork-html-share-note",
    "title": "ChatworkでHTMLを共有する方法と、開けないときの対処",
    "description": "ChatworkでHTMLを送っても真っ白・タグが文字のまま表示される原因を知りたいビジネス担当者向けに、添付ファイルとブラウザ表示の違いを解説し、相手に確実に見せるURL共有への切り替え方を示します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "line-html-share-note",
    "path": "/articles/line-html-share-note",
    "title": "LINEでHTMLファイルを送ると相手が開けない理由と、URL共有の使い分け",
    "description": "LINEでHTMLを送ったのに「開けない」「タグが見える」と言われて困っている方向けに、チャットのファイル送信がブラウザ表示を前提にしない理由を説明し、URL共有へ切り替える方法を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "garoon-html-share-comparison",
    "path": "/articles/garoon-html-share-comparison",
    "title": "Garoon（サイボウズ）でHTMLを共有する場合との違い",
    "description": "社内情報共有にGaroonを使いながら、社外も含めた確認依頼のたびに共有方法で迷っている方向けに、社内グループウェアと外部向け一時URL共有の得意領域の違いを整理して判断基準を示します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "desknets-html-share-comparison",
    "path": "/articles/desknets-html-share-comparison",
    "title": "desknet's NEOでHTMLを共有する場合との違いと使い分け",
    "description": "desknet's NEOで社内文書を管理しながら、社外向けにHTMLを一時公開したい場面でどちらを使うべきか迷っている方向けに、国産グループウェアの強みと一時URL発行の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "evernote-html-share-comparison",
    "path": "/articles/evernote-html-share-comparison",
    "title": "EvernoteでHTMLを共有する場合との違い",
    "description": "Evernoteの共有リンクで十分なのか、HTMLをそのままブラウザ表示できるURLで渡すべきかを判断したい方向けに、ノートとして残したい場合と制作物の見た目を確認してほしい場合の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "docusaurus-vs-share",
    "path": "/articles/docusaurus-vs-share",
    "title": "Docusaurusとの違いと使い分け｜ドキュメントサイト構築と一時共有",
    "description": "Docusaurusでドキュメントサイトを継続運用しながら、ビルド後の出力を公開前にレビューしてもらいたいエンジニアやライター向けに、本番配信と一時確認共有の目的の違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "readme-com-vs-share",
    "path": "/articles/readme-com-vs-share",
    "title": "ReadMe（readme.com）との違い｜API/開発者向け公開と一時HTML共有",
    "description": "ReadMeで開発者ポータルを本番公開しながら、HTMLを認証付きで一時共有したい場面も出てきた開発者向けに、継続運用するAPIドキュメントとスポット確認の共有の使い分けを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gamma-app-vs-share",
    "path": "/articles/gamma-app-vs-share",
    "title": "Gamma（AIスライド/サイト）との違いと使い分け",
    "description": "GammaでAIスライドやサイトを手軽に公開できる一方、書き出したHTMLをより細かく制御して共有したい方向けに、Gamma上の公開と書き出し後の認証付き一時共有の違いと選び方を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "medical-clinic-recruit-staff-share",
    "path": "/articles/medical-clinic-recruit-staff-share",
    "title": "医療法人が看護師・スタッフ採用の説明資料をHTMLで限定共有する方法",
    "description": "給与体系や勤務シフトなど求人サイトには出せない採用情報を応募者だけに届けたい医療法人担当者向けに、検索結果に表示せずメール認証付きURLでHTML資料を限定共有する手順と運用のコツを紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "internal-medicine-referral-letter-share",
    "path": "/articles/internal-medicine-referral-letter-share",
    "title": "内科クリニックが他院への紹介状補足資料を医師間で安全に共有する方法",
    "description": "紹介状に書ききれない検査経緯や画像所見の補足を、紹介先の医師にだけ安全に届けたい内科クリニック向けに、診療情報を含むHTML補足資料をパスワード認証付きURLで共有する方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pediatric-clinic-vaccine-schedule-share",
    "path": "/articles/pediatric-clinic-vaccine-schedule-share",
    "title": "小児科が予防接種スケジュール案内HTMLを保護者に共有する方法",
    "description": "種類が多く覚えにくい予防接種のスケジュールを、保護者が自宅でいつでも確認できる形で届けたい小児科向けに、案内HTMLを共有URLとQRコードで配布する方法とその運用手順を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dental-clinic-treatment-plan-quote-share",
    "path": "/articles/dental-clinic-treatment-plan-quote-share",
    "title": "歯科医院が自費診療の治療計画・見積をHTMLで患者に限定共有する方法",
    "description": "インプラントや審美治療の治療計画と見積を、金額情報を守りながら患者本人にだけ丁寧に提示したい歯科医院向けに、パスワード付きURLでHTMLを限定共有する手順と使いどころを解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "orthodontics-progress-report-share",
    "path": "/articles/orthodontics-progress-report-share",
    "title": "矯正歯科が治療経過レポートを患者・保護者にURLで共有する方法",
    "description": "数年にわたる矯正治療の経過写真や歯の動きをレポートにまとめ、患者・保護者が治療への理解を深めながら確認できる形で届けたい矯正歯科向けに、経過レポートのHTML共有手順を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dental-lab-shade-case-share",
    "path": "/articles/dental-lab-shade-case-share",
    "title": "歯科技工所が補綴物のシェード・症例確認を歯科医院と共有する方法",
    "description": "補綴物のシェードや形態の確認情報を取引先の歯科医院と正確にやり取りしたい歯科技工所向けに、写真・指示内容をまとめたHTMLを認証付きURLで共有する方法と作り直しを減らすポイントを解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pharmacy-medication-guide-share",
    "path": "/articles/pharmacy-medication-guide-share",
    "title": "薬局が服薬指導の補足説明HTMLを患者にQR配布で共有する方法",
    "description": "短時間の服薬指導で伝えきれない飲み合わせや副作用の情報を、患者が自宅で見返せる形で届けたい薬局向けに、補足説明HTMLをQRコード配布と組み合わせて一時共有する方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dispensing-pharmacy-otc-catalog-share",
    "path": "/articles/dispensing-pharmacy-otc-catalog-share",
    "title": "調剤薬局がOTC・健康食品の案内カタログを患者にURL共有する方法",
    "description": "OTC医薬品や健康食品のセルフメディケーション提案を季節に合わせて患者に届けたい調剤薬局向けに、期限付きURLで案内カタログHTMLを配布する方法と来店促進への活かし方を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pharmacy-chain-store-manual-share",
    "path": "/articles/pharmacy-chain-store-manual-share",
    "title": "薬局チェーンが店舗向け業務手順HTMLを会社ドメイン認証で共有する方法",
    "description": "調剤手順や接遇マニュアルを全店舗に配りながら社外には見せたくない薬局チェーン本部向けに、会社ドメイン認証を使って自社スタッフだけがアクセスできる業務手順HTML共有の仕組みを解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "home-care-visit-report-family-share",
    "path": "/articles/home-care-visit-report-family-share",
    "title": "訪問介護が利用者家族にケア記録・報告HTMLを共有する方法",
    "description": "遠方に住む家族にその日のケア内容や利用者の様子を安全かつ確実に届けたい訪問介護事業者向けに、メール認証付き共有URLで家族本人だけがケア記録ページを開ける仕組みの作り方を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "care-manager-careplan-draft-share",
    "path": "/articles/care-manager-careplan-draft-share",
    "title": "ケアマネジャーがケアプラン原案を利用者・家族に確認共有する方法",
    "description": "担当者会議の前にケアプラン原案を家族が読み込んでおける状態を作り、当日の議論を深めたいケアマネジャー向けに、原案HTMLを一時URLで事前共有する手順と会議効率化のポイントを解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "nursing-home-facility-tour-share",
    "path": "/articles/nursing-home-facility-tour-share",
    "title": "介護施設が入居検討者に施設案内・料金HTMLを限定共有する方法",
    "description": "見学後に持ち帰って家族と比較検討できる施設案内・料金情報を入居検討者に届けたい介護施設向けに、パスワード付きURLで案内HTMLを限定公開し見学前後の情報提供を充実させる方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "day-service-activity-report-share",
    "path": "/articles/day-service-activity-report-share",
    "title": "デイサービスが活動レポート・行事案内を家族にURL共有する方法",
    "description": "デイサービスでの活動写真や行事案内を毎月家族に届けながら、リンクを配り直す手間を省きたい事業者向けに、同一URLを差し替えながら最新情報を共有し続ける運用方法とその効果を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tax-accountant-monthly-report-share",
    "path": "/articles/tax-accountant-monthly-report-share",
    "title": "税理士が月次決算レポートを顧問先にパスワード付きURLで共有する方法",
    "description": "毎月の試算表サマリーを顧問先が使い慣れたリンクからいつでも確認できる形で届けたい税理士向けに、パスワード付きURLでHTMLレポートを差し替え運用する仕組みと導入手順を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tax-accountant-year-end-checklist-share",
    "path": "/articles/tax-accountant-year-end-checklist-share",
    "title": "税理士が年末調整・確定申告の必要書類案内を顧客に共有する方法",
    "description": "年末調整・確定申告の提出物が揃わずに催促対応に追われる時期を減らしたい税理士事務所向けに、必要書類チェックリストHTMLを期限付きURLで配布して顧問先の準備漏れを防ぐ方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "lawyer-case-status-update-share",
    "path": "/articles/lawyer-case-status-update-share",
    "title": "弁護士が依頼者に事件の進捗報告HTMLを安全に共有する方法",
    "description": "機密性の高い事件の進捗をメール本文に書かずに依頼者へ確実に届けたい弁護士向けに、メール認証付きURLで依頼者本人だけが進捗HTMLを開ける安全な報告の仕組みと運用手順を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "lawyer-contract-review-comment-share",
    "path": "/articles/lawyer-contract-review-comment-share",
    "title": "弁護士が契約書レビュー結果のサマリーHTMLを企業法務に共有する方法",
    "description": "契約書レビュー結果の修正提案やリスク評価を、WordファイルのやりとりなしにクライアントのIPRチームにだけ届けたい弁護士向けに、認証付き一時URLでレビューサマリーHTMLを共有する方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "judicial-scrivener-registration-flow-share",
    "path": "/articles/judicial-scrivener-registration-flow-share",
    "title": "司法書士が登記手続きの流れ・必要書類案内をHTMLで共有する方法",
    "description": "登記手続きの書類の種類や取得先を依頼者が自分で確認できる状態を作り、問い合わせ対応の負担を減らしたい司法書士向けに、手順と書類リストをHTMLにまとめて一時URLで渡す方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "administrative-scrivener-permit-guide-share",
    "path": "/articles/administrative-scrivener-permit-guide-share",
    "title": "行政書士が許認可申請の手順・要件案内HTMLを事業者に共有する方法",
    "description": "許認可申請の要件・書類・タイミングを事業者が手元で確認しながら準備を進められる状態を作りたい行政書士向けに、申請ガイドHTMLをパスワード付きURLで渡す方法と運用のポイントを整理します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "labor-consultant-regulation-update-share",
    "path": "/articles/labor-consultant-regulation-update-share",
    "title": "社会保険労務士が法改正・就業規則変更案内HTMLを顧問先に共有する方法",
    "description": "法改正や就業規則変更の内容を顧問先の従業員にだけ正確に届け、社外への流出を防ぎながら周知したい社会保険労務士向けに、会社ドメイン認証を活用したHTML配信の仕組みを解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "patent-attorney-application-status-share",
    "path": "/articles/patent-attorney-application-status-share",
    "title": "弁理士が出願・審査の進捗ステータスHTMLを依頼企業に共有する方法",
    "description": "特許出願から審査対応まで段階が多く、依頼企業は現在地を把握しにくいもの。進捗ステータスHTMLを会社ドメイン認証で共有し、担当者だけが最新状況を確認できる仕組みの作り方を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "management-consultant-diagnosis-report-share",
    "path": "/articles/management-consultant-diagnosis-report-share",
    "title": "経営コンサルが経営診断レポートを経営層にパスワード付きで共有する方法",
    "description": "財務の弱点や組織課題を含む経営診断レポートを、役員など限られた経営層にだけ届けたい方へ。パスワード付き一時URLを使って情報漏えいリスクを抑えながら共有する手順を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "it-consultant-system-proposal-share",
    "path": "/articles/it-consultant-system-proposal-share",
    "title": "ITコンサルがシステム導入提案書HTMLをクライアントに共有する方法",
    "description": "要件・構成・コスト・移行計画を一冊にまとめたシステム提案書を、先方担当者だけが開けるURLで届ける方法。会社ドメイン認証を使えば、内容を更新しても同じリンクで最新版を確認できます。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "fp-life-plan-simulation-share",
    "path": "/articles/fp-life-plan-simulation-share",
    "title": "ファイナンシャルプランナーがライフプラン試算HTMLを相談者に共有する方法",
    "description": "収入・貯蓄・将来支出まで家計の機微情報が詰まったライフプラン試算を、相談者本人だけに届けたい方へ。メール認証付き一時URLで安全に渡す手順と注意点をわかりやすく解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "veterinary-clinic-treatment-explain-share",
    "path": "/articles/veterinary-clinic-treatment-explain-share",
    "title": "動物病院が治療説明・術後ケア案内HTMLを飼い主に共有する方法",
    "description": "診察時間内では伝えきれない手術の流れや術後ケア・投薬手順を、飼い主にQRコードやURLで正確に届けたい動物病院向け。口頭説明の聞き漏らしをなくす共有ページの作り方をまとめます。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ophthalmology-postop-care-share",
    "path": "/articles/ophthalmology-postop-care-share",
    "title": "眼科が術後の生活注意点HTMLを患者に共有する方法",
    "description": "白内障や網膜手術後の点眼・洗顔・入浴など守るべき注意点が多い患者に、パスワード付きURLで術後案内を届ける方法。視界が回復途上でも読みやすいページ設計のポイントも紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dermatology-skincare-instruction-share",
    "path": "/articles/dermatology-skincare-instruction-share",
    "title": "皮膚科がスキンケア指導・外用薬の使い方HTMLを患者に共有する方法",
    "description": "外用薬の塗り方や順番を正しく続けられるかで治療効果が変わる皮膚科診療。塗布手順と生活指導をHTMLにまとめ、QRコードから一時URLで患者に届ける運用の具体的な進め方を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "physical-therapy-home-exercise-share",
    "path": "/articles/physical-therapy-home-exercise-share",
    "title": "整形外科・リハビリがホームエクササイズ手順HTMLを患者に共有する方法",
    "description": "リハビリの成果は自宅での運動をどれだけ正確に続けられるかにかかっています。写真付きのホームエクササイズメニューをHTMLにまとめ、URLで患者に渡して正しい実践を促す方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "psychiatry-clinic-intake-guide-share",
    "path": "/articles/psychiatry-clinic-intake-guide-share",
    "title": "心療内科が初診の流れ・問診案内HTMLを患者に共有する方法",
    "description": "初診前に「どんな流れか・何を準備すればいいか」が分かると患者の不安は大きく減ります。心療内科が初診案内HTMLをメール認証付きURLで本人だけに届け、来院のハードルを下げる方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "midwife-prenatal-class-share",
    "path": "/articles/midwife-prenatal-class-share",
    "title": "助産院・産婦人科が両親学級・出産準備案内HTMLを共有する方法",
    "description": "助産院・産婦人科が両親学級・出産準備案内HTMLを共有する方法の実務手順を、共有前の準備、レビュー依頼文、認証/期限設定、差し替え運用まで整理します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dietitian-meal-plan-share",
    "path": "/articles/dietitian-meal-plan-share",
    "title": "管理栄養士が栄養指導の献立・食事プランHTMLを対象者に共有する方法",
    "description": "個別に作成した献立や食事プランは、調理中や買い物先でも見返しやすい形で届けることが実践率を高めます。管理栄養士がメール認証URLで対象者だけに栄養指導の内容を渡す手順をまとめました。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "acupuncture-treatment-record-share",
    "path": "/articles/acupuncture-treatment-record-share",
    "title": "鍼灸・接骨院が施術記録・経過説明HTMLを患者に共有する方法",
    "description": "口頭では伝えにくい施術ごとの体の変化を可視化し、通院の継続意欲を高めたい鍼灸・接骨院向け。施術記録と経過説明をHTMLにして同じURLで毎回差し替え、患者に共有する運用を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "audit-firm-report-draft-share",
    "path": "/articles/audit-firm-report-draft-share",
    "title": "監査法人が監査報告ドラフトHTMLをクライアント経理に共有する方法",
    "description": "確定前の監査ドラフトや指摘事項サマリーをクライアント経理部だけとやり取りしたい監査法人向け。メール転送リスクを抑えながら確認の往復を効率化するHTML共有の具体的な手順を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ma-advisor-deal-memo-share",
    "path": "/articles/ma-advisor-deal-memo-share",
    "title": "M&Aアドバイザーが案件概要メモHTMLを関係者に限定共有する方法",
    "description": "M&Aの初期打診でノンネームの案件概要を特定の候補先だけに見せたい方へ。案件メモをHTMLページにして情報開示範囲を絞り、進捗に合わせて内容を管理する安全な共有方法をまとめます。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "translation-agency-glossary-review-share",
    "path": "/articles/translation-agency-glossary-review-share",
    "title": "翻訳会社が訳語・用語集の確認HTMLをクライアントに共有する方法",
    "description": "翻訳プロジェクトで納品後の「社内表記と違う」という手戻りをゼロにしたい方向け。用語集の確認ページをHTMLでクライアントに送り、合意した訳語で本作業に入るフローの作り方を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "branding-consultant-guideline-share",
    "path": "/articles/branding-consultant-guideline-share",
    "title": "ブランディングコンサルがブランドガイドラインHTMLをクライアントに共有する方法",
    "description": "ロゴ・カラー・トーンを一冊にまとめたブランドガイドラインを、確定前の段階でクライアントにだけ確認してもらいたい方へ。期限付きURLで安全にレビューを回す具体的な手順を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cafe-seasonal-menu-staff-share",
    "path": "/articles/cafe-seasonal-menu-staff-share",
    "title": "カフェが季節限定メニュー案をスタッフ・店長に共有して確認してもらう方法",
    "description": "発売前の季節限定メニューのビジュアルや提供手順を、スタッフや店長に事前に共有してそろえておきたいカフェ向け。紙の差し替え不要で確認できるHTMLメニュー案の共有方法をまとめます。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "bakery-bento-preorder-page-share",
    "path": "/articles/bakery-bento-preorder-page-share",
    "title": "ベーカリーが予約商品・事前注文ページを常連客に限定共有する方法",
    "description": "クリスマスケーキや季節の予約商品を、常連のお得意様へ一般より先に案内したいベーカリー向け。メール認証を使って得意客だけが申し込める予約ページを素早く作る方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "izakaya-course-plan-corporate-share",
    "path": "/articles/izakaya-course-plan-corporate-share",
    "title": "居酒屋が宴会コース・忘年会プランを幹事に共有する方法",
    "description": "忘年会シーズンにコースの問い合わせが集中し、毎回PDFを送るのが手間な居酒屋向け。宴会プランをHTMLページにしてURLで幹事に渡し、社内回覧までスムーズに進める運用を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ramen-shop-new-store-info-share",
    "path": "/articles/ramen-shop-new-store-info-share",
    "title": "ラーメン店が新店舗オープン案内をフランチャイズ・関係者に共有する方法",
    "description": "一般公開前に新店舗のオープン情報をフランチャイズ加盟店や取引先だけへ先行共有したいラーメン店向け。未公開の開店情報を安全に届けるHTMLページの作り方と共有の手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "food-truck-event-schedule-share",
    "path": "/articles/food-truck-event-schedule-share",
    "title": "キッチンカーが出店スケジュール・メニュー表をイベント主催者に共有する方法",
    "description": "日替わりで出店先が変わり、メニューも仕入れで動くキッチンカーがイベント主催者へ正確な情報を届けたい場合に。期限付きURLで毎回差し替えて渡す出店スケジュールページの作り方を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wine-bar-tasting-list-member-share",
    "path": "/articles/wine-bar-tasting-list-member-share",
    "title": "ワインバーがテイスティング会のラインナップを会員に限定共有する方法",
    "description": "テイスティング会で提供するワインの背景情報を参加者の体験を深める形で届けたいワインバー向け。会員向けの特別な情報を一般に見せず、参加メンバーだけに限定共有する方法をまとめます。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "select-shop-lookbook-buyer-share",
    "path": "/articles/select-shop-lookbook-buyer-share",
    "title": "セレクトショップが新シーズンのルックブックを取引先・バイヤーに共有する方法",
    "description": "展示会前に未発表のルックブックを取引先やバイヤーだけへ届け、発注検討を促したいセレクトショップ向け。スタイリングが社外に漏れないよう、企業ドメイン認証で安全に共有する手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "boutique-private-sale-vip-share",
    "path": "/articles/boutique-private-sale-vip-share",
    "title": "アパレル店がVIP顧客向けプライベートセール案内を限定共有する方法",
    "description": "日頃のお得意様に一般セールより一足早く案内したいアパレル店向け。先行セールの商品リストをVIP顧客だけが見られる形で届け、案内の特別感を保ちながら申し込みを促す方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "florist-arrangement-quote-share",
    "path": "/articles/florist-arrangement-quote-share",
    "title": "花屋が冠婚葬祭のアレンジメント見積・作例を依頼主に共有する方法",
    "description": "冠婚葬祭の花で金額とイメージを同時にすり合わせたい花屋向け。作例写真と見積を一画面にまとめて施主に確認してもらうことで、「思ったのと違う」という行き違いを防ぐ共有方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "bookstore-fair-lineup-publisher-share",
    "path": "/articles/bookstore-fair-lineup-publisher-share",
    "title": "書店がブックフェアの選書リストを出版社・取引先に共有する方法",
    "description": "ブックフェアの選書リストを出版社と共有し、在庫確保や追加販促をすり合わせることでフェアの完成度を高めたい書店向け。企画意図を正確に伝える限定共有ページの作り方を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "barbershop-style-catalog-share",
    "path": "/articles/barbershop-style-catalog-share",
    "title": "理容室・バーバーがヘアスタイル作例カタログを来店前の客に共有する方法",
    "description": "仕上がりのイメージが合っているかどうかが満足度を左右する理容室・バーバー向け。予約客にメンズカットの作例カタログを事前共有し、当日のカウンセリングをスムーズにする方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hair-salon-color-sample-customer-share",
    "path": "/articles/hair-salon-color-sample-customer-share",
    "title": "美容室がカラー・パーマの仕上がりサンプルを来店客に共有する方法",
    "description": "色味や巻き加減を言葉だけで伝えるのが難しいカラー・パーマ施術の前に、仕上がりサンプルを来店客へ個別共有したい美容室向け。すり合わせを丁寧に行うURLページの作り方を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "spa-treatment-course-couple-share",
    "path": "/articles/spa-treatment-course-couple-share",
    "title": "スパ・リラクゼーションがコース内容を予約客・カップルプランで共有する方法",
    "description": "コース内容や所要時間、カップルプランの流れを予約前に届けておくとカウンセリングが格段にスムーズになるスパ向け。コース説明をHTMLにまとめて予約客へ共有する具体的な手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "massage-clinic-price-list-share",
    "path": "/articles/massage-clinic-price-list-share",
    "title": "もみほぐし・マッサージ店が料金表・コース案内を新規客に共有する方法",
    "description": "料金やコースを問い合わせてくる新規客への返信スピードが集客を左右するもみほぐし・マッサージ店向け。料金表HTMLをURLで一発送信できるようにして取りこぼしを防ぐ方法をまとめます。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tanning-salon-plan-guide-share",
    "path": "/articles/tanning-salon-plan-guide-share",
    "title": "日焼けサロンが利用プラン・マシン案内を会員に共有する方法",
    "description": "回数券プランの内容やマシンの使い方、安全に関する注意事項を会員だけにきちんと届けたい日焼けサロン向け。メール認証で限定公開するHTMLページの設計と運用ポイントを解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "yoga-studio-class-schedule-share",
    "path": "/articles/yoga-studio-class-schedule-share",
    "title": "ヨガスタジオがレッスンスケジュール・インストラクター紹介を会員に共有する方法",
    "description": "週ごとに変わるレッスンスケジュールや代行・新クラスの情報を、いつも最新の状態で会員に届けたいヨガスタジオ向け。同じURLで差し替えるだけで済む時間割ページの運用方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pilates-studio-trial-guide-share",
    "path": "/articles/pilates-studio-trial-guide-share",
    "title": "ピラティススタジオが体験レッスン案内を見込み客に共有する方法",
    "description": "体験申込者が「どんなレッスンか・料金はいくらか」を確認できる案内を素早く届けたいピラティススタジオ向け。URLを一つ送るだけで見込み客の不安を解消し、申し込みへつなげる方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "crossfit-box-program-member-share",
    "path": "/articles/crossfit-box-program-member-share",
    "title": "クロスフィットジムがWODプログラム・コース案内をメンバーに共有する方法",
    "description": "その日のWODやコース案内を毎日メンバーへ正確に届けることが運営の要になるクロスフィットジム向け。メール認証で会員だけに公開するHTMLページの作り方と差し替え運用を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "personal-gym-meal-plan-client-share",
    "path": "/articles/personal-gym-meal-plan-client-share",
    "title": "パーソナルジムが食事指導・トレーニング計画を会員に限定共有する方法",
    "description": "会員一人ひとりに合わせた食事メニューやトレーニング計画はプライバシーに関わる情報です。パスワード認証を付けて本人だけに届けることで、安心感と継続モチベーションを高める方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "swimming-school-class-info-parent-share",
    "path": "/articles/swimming-school-class-info-parent-share",
    "title": "スイミングスクールが進級基準・クラス案内を保護者に共有する方法",
    "description": "進級基準やクラス案内、テスト日程を保護者に正確に伝えることが信頼につながるスイミングスクール向け。URLで一発配布できるHTMLページを作り、問い合わせを減らす運用の進め方を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dance-studio-recital-program-share",
    "path": "/articles/dance-studio-recital-program-share",
    "title": "ダンススタジオが発表会プログラム・座席案内を保護者に共有する方法",
    "description": "演目順やタイムスケジュール・座席案内を関係者だけへ届けたいダンススタジオ向け。SNSでは広がりすぎる発表会プログラムを一時URLで限定共有し、当日の進行をスムーズにする方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "music-school-lesson-guide-share",
    "path": "/articles/music-school-lesson-guide-share",
    "title": "音楽教室がレッスンコース・講師紹介を入会希望者に共有する方法",
    "description": "コース種類・月謝・講師経歴を電話で毎回説明するのが大変な音楽教室向け。入会希望者の疑問をまとめて解消できるコース案内HTMLをURLで即送信できるようにする具体的な手順を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "english-conversation-school-curriculum-share",
    "path": "/articles/english-conversation-school-curriculum-share",
    "title": "英会話教室がカリキュラム・料金プランを体験者に共有する方法",
    "description": "体験申込者にレベル別カリキュラムと料金プランを事前に届けておくと、当日は質問対応より実演に集中できます。英会話教室が体験者へURLで案内を先送りする手順とページ設計のポイントを解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cooking-class-menu-participant-share",
    "path": "/articles/cooking-class-menu-participant-share",
    "title": "料理教室が当日のレシピ・メニューを参加者に共有する方法",
    "description": "当日のレシピと材料リストを受講者が手元でいつでも確認できる形で届けたい料理教室向け。メール認証で参加者だけに配るHTMLレシピページの作り方と印刷不要の運用メリットを紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "calligraphy-class-work-exhibition-share",
    "path": "/articles/calligraphy-class-work-exhibition-share",
    "title": "書道・習字教室が作品展の出品リストを生徒・保護者に共有する方法",
    "description": "出品者の氏名が並ぶ作品展のリストは誰にでも公開したいものではありません。書道・習字教室が出品リストをパスワード付きで生徒・保護者だけに届ける具体的な共有手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "preschool-event-photo-parent-share",
    "path": "/articles/preschool-event-photo-parent-share",
    "title": "幼児教室・プリスクールが行事の案内・写真を保護者に限定共有する方法",
    "description": "園児が写る写真は特に慎重な管理が求められます。幼児教室・プリスクールが行事の案内と写真をメール認証で保護者だけに限定公開し、プライバシーを守りながら思い出を届ける方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "abacus-class-schedule-parent-share",
    "path": "/articles/abacus-class-schedule-parent-share",
    "title": "そろばん教室が検定日程・進度表を保護者に共有する方法",
    "description": "検定日程や進度の連絡漏れが保護者の不安につながるそろばん教室向け。進級案内と検定スケジュールをHTMLにまとめてURLで配り、日程変更もすぐ反映できる運用の具体的な進め方を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tea-ceremony-class-event-guide-share",
    "path": "/articles/tea-ceremony-class-event-guide-share",
    "title": "茶道・華道教室が稽古日程・茶会案内を門下生に共有する方法",
    "description": "稽古日程や茶会の案内・持ち物・心得を限られた門下生だけに丁寧に届けたい茶道・華道教室向け。パスワード付きページで茶会案内を限定共有し、参加者の情報を外部に漏らさない方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pottery-studio-workshop-reservation-share",
    "path": "/articles/pottery-studio-workshop-reservation-share",
    "title": "陶芸教室が体験ワークショップ案内を予約客に共有する方法",
    "description": "体験ワークショップの予約後に「持ち物は?」「料金は?」と問い合わせが続く陶芸教室向け。コース内容と料金をまとめた案内ページをURLで一度に渡して予約客の不安を解消する方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "kids-soccer-school-tournament-share",
    "path": "/articles/kids-soccer-school-tournament-share",
    "title": "サッカースクールが大会・合宿の案内を保護者に限定共有する方法",
    "description": "大会・合宿の集合時間や持ち物など保護者が必要とする情報を、子ども経由のプリントに頼らず確実に届けたいサッカースクール向け。メール認証で保護者だけに限定共有する手順を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "golf-lesson-studio-plan-share",
    "path": "/articles/golf-lesson-studio-plan-share",
    "title": "ゴルフレッスンスタジオがレッスンプラン・設備案内を見込み客に共有する方法",
    "description": "シミュレーターの性能やレッスン内容・月会費を知りたい見込み客に、来店前に魅力を伝えたいゴルフレッスンスタジオ向け。設備写真と料金を1ページにまとめてURLで送る具体的な方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tennis-school-trial-info-share",
    "path": "/articles/tennis-school-trial-info-share",
    "title": "テニススクールが体験レッスン・コース案内を希望者に共有する方法",
    "description": "クラス区分・料金・振替の可否など電話では説明しにくい内容を見込み客に正確に届けたいテニススクール向け。体験申込者の疑問をまとめて解消する1ページ案内のURLを素早く送る方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "bar-event-flyer-regular-share",
    "path": "/articles/bar-event-flyer-regular-share",
    "title": "バーがイベント・DJナイトの告知を常連客に限定共有する方法",
    "description": "DJナイトやイベントを常連客にだけ先行告知して特別感を演出したいバー向け。SNSで全公開せずタイムテーブルとチャージをパスワード付きページにまとめ、店の世界観を守る共有方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ramen-pop-up-collab-info-share",
    "path": "/articles/ramen-pop-up-collab-info-share",
    "title": "飲食店が期間限定コラボ・ポップアップ情報を関係者に共有する方法",
    "description": "コラボ内容やポップアップの詳細が事前に漏れるとサプライズ感が薄れます。期間限定コラボを取引先や関係者にだけ会社ドメイン認証で届け、発表タイミングをコントロールする方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "fishmonger-daily-special-restaurant-share",
    "path": "/articles/fishmonger-daily-special-restaurant-share",
    "title": "鮮魚店・卸が本日のおすすめ・仕入れリストを取引先飲食店に共有する方法",
    "description": "毎日変わる仕入れ情報を飲食店に素早く届けたい鮮魚店・卸向け。FAXや電話の聞き間違いをなくし、パスワード付きURLで本日のおすすめと価格を安全に一斉配信できるか判断できる記事です。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "patisserie-custom-cake-proposal-share",
    "path": "/articles/patisserie-custom-cake-proposal-share",
    "title": "パティスリーがオーダーケーキのデザイン提案を注文客に共有する方法",
    "description": "オーダーケーキのデザイン確認を顧客とスムーズに進めたいパティスリー向け。メッセージアプリの履歴流れを防ぎ、パスワード付きURLでデザイン案と見積を一か所にまとめて共有する方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hr-job-posting-share",
    "path": "/articles/hr-job-posting-share",
    "title": "人事が求人票・募集要項HTMLを候補者に共有する方法",
    "description": "リファラル採用や非公開ポジションで求人票を声がけした人だけに見せたい人事担当者向け。認証付きURLで情報漏洩を防ぎながら、閲覧確認まで完結させる手順を整理した記事です。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "legal-contract-draft-share",
    "path": "/articles/legal-contract-draft-share",
    "title": "法務が契約書ドラフトHTMLを関係部署に確認してもらう方法",
    "description": "契約書ドラフトを社内関係者に安全に回覧したい法務担当向け。会社ドメイン認証で外部漏洩を防ぎ、公開期限で版を整理しながらレビューを進める方法がわかります。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "finance-budget-report-share",
    "path": "/articles/finance-budget-report-share",
    "title": "経理が予算・実績レポートHTMLを役員に共有する方法",
    "description": "月次の予算実績レポートを役員だけに届けたい経理担当向け。メール転送のリスクをなくし、メール認証で閲覧者を特定しながら機密数値を期限付きで共有する手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "general-affairs-notice-share",
    "path": "/articles/general-affairs-notice-share",
    "title": "総務が社内通達・規程改定HTMLを全社に共有する方法",
    "description": "社内通達や就業規則の改定を社員全員に確実に届けたい総務担当向け。ドメイン認証で社内限定にしつつ、差し替えで常に最新版を同じURLで提供する運用方法がわかります。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "procurement-rfp-share",
    "path": "/articles/procurement-rfp-share",
    "title": "購買がRFP・見積依頼HTMLを取引先に共有する方法",
    "description": "複数の取引先に公平かつ機密性を保ちながらRFPを送付したい購買担当向け。パスワード認証で各社を分離し、公開期限で提出締切を管理する手順を整理した記事です。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "product-release-note-share",
    "path": "/articles/product-release-note-share",
    "title": "プロダクトチームがリリースノートHTMLをステークホルダーに共有する方法",
    "description": "直前まで変わるリリースノートを営業・経営層・主要顧客へ素早く届けたいプロダクトチーム向け。QRコードで会議でも即配布でき、同じURLで常に最新を保つ方法がわかります。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "customer-success-onboarding-share",
    "path": "/articles/customer-success-onboarding-share",
    "title": "カスタマーサクセスが導入ガイドHTMLを顧客に共有する方法",
    "description": "顧客ごとにカスタマイズした導入ガイドを渡し、読まれているか確認したいCSチーム向け。パスワード別URLとアクセスログで利用状況を把握し、フォローに活かす手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ir-team-earnings-preview-share",
    "path": "/articles/ir-team-earnings-preview-share",
    "title": "広報IR担当が決算説明資料HTMLを事前確認用に共有する方法",
    "description": "解禁前の決算資料を経営層・監査・関係部署に安全に確認させたい広報IR担当向け。メール認証で外部漏洩を防ぎ、一時URLで閲覧期間を制御する方法と注意点を整理しています。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "flexbox-items-wrap-unexpectedly",
    "path": "/articles/flexbox-items-wrap-unexpectedly",
    "title": "Flexboxの子要素が意図せず折り返す・横並びにならないときの原因と直し方",
    "description": "Flexboxで子要素が折り返したり縮みすぎたりして困っている方向け。flex-wrapの誤解・min-widthの効きすぎ・flex-shrinkの初期値という三大原因を切り分けて直す手順をまとめています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "grid-layout-collapses",
    "path": "/articles/grid-layout-collapses",
    "title": "CSS Gridのレイアウトが崩れる・列が揃わないときの原因と対処",
    "description": "CSS Gridで列が揃わない・要素が想定外に流れてしまうコーダー向け。grid-template-columnsの指定不足やfr単位の誤解、アイテム側のmin-widthが原因かどうかを素早く特定できる記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "viewport-meta-missing-mobile-tiny",
    "path": "/articles/viewport-meta-missing-mobile-tiny",
    "title": "スマホで全体が極端に小さく表示されるときの対処（viewport設定）",
    "description": "スマホで開くとページ全体がぎゅっと縮んでしまうと悩むWeb制作者向け。viewportメタタグがない原因とその正しい記述方法、実機確認の手順をわかりやすく解説しています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "rem-em-font-size-wrong",
    "path": "/articles/rem-em-font-size-wrong",
    "title": "rem・emで指定した文字サイズが想定とずれるときの原因と対処",
    "description": "remやemで指定した文字サイズが思ったより大きい・小さい、入れ子でどんどん変わってしまうと困っているフロントエンド開発者向け。基準値の考え方と原因の切り分け方を整理します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "line-height-text-overlap",
    "path": "/articles/line-height-text-overlap",
    "title": "行間が詰まりすぎ・文字が重なるときの原因と直し方",
    "description": "行間が詰まりすぎて文字が上下に重なる、フォント変更後に急に窮屋になったと感じる制作者向け。line-heightの単位ミス・固定px・Webフォントのメトリクスという三つの原因を整理します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "long-text-overflow-no-wrap",
    "path": "/articles/long-text-overflow-no-wrap",
    "title": "長い英数字・URLがはみ出して折り返さないときの対処",
    "description": "日本語は折り返すのに長いURLや英数字だけがコンテナからはみ出して横スクロールが出ると悩むWeb制作者向け。overflow-wrapとword-breakの正しい使い分けと使いどころを解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "z-index-stacking-broken",
    "path": "/articles/z-index-stacking-broken",
    "title": "重なり順（z-index）が効かず要素が隠れるときの原因と対処",
    "description": "z-indexに大きな値を入れても要素が前面に出てこないと困っているフロントエンド開発者向け。positionの未指定とstacking contextの境界という根本原因を切り分けて確実に解決できます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "sticky-header-not-sticking",
    "path": "/articles/sticky-header-not-sticking",
    "title": "position:stickyのヘッダーが追従しないときの原因と直し方",
    "description": "position:stickyをヘッダーに付けてもスクロールで固定されず流れてしまうと困っている方向け。topの未指定・親要素のoverflow設定・親の高さ不足という典型原因を手順で切り分けられます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "margin-collapse-unexpected-gap",
    "path": "/articles/margin-collapse-unexpected-gap",
    "title": "上下に意図しない余白ができる・margin相殺が起きるときの対処",
    "description": "ブロック間の余白が思ったより詰まる、子要素のmarginが親からはみ出すと悩むコーダー向け。margin相殺（マージンの折りたたみ）の仕組みと、回避する具体的な方法をまとめています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "box-sizing-width-overflow",
    "path": "/articles/box-sizing-width-overflow",
    "title": "幅指定したのに要素がはみ出すときの対処（box-sizing）",
    "description": "width:100%を指定したのにpaddingやborderを加えたとたん要素が親からはみ出すと困っている方向け。box-sizingのデフォルト仕様と、border-boxへの切り替え方法を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "mobile-button-too-small-tap",
    "path": "/articles/mobile-button-too-small-tap",
    "title": "スマホでボタンが小さくて押しにくいときの改善方法",
    "description": "PCでは問題ないのにスマホで実機を触るとボタンが小さくて押しにくい、誤タップが多いと感じる制作者向け。タップ領域の基準と、操作ミスを減らすサイズ設計の改善策がわかります。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "iphone-notch-safe-area",
    "path": "/articles/iphone-notch-safe-area",
    "title": "iPhoneのノッチ・ホームバーに要素が隠れるときの対処（safe-area）",
    "description": "iPhoneのノッチやホームバーに固定ヘッダーやボタンが重なって隠れてしまうと困っている制作者向け。safe-area-insetを使って安全な余白を確保する方法と確認手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ios-100vh-address-bar",
    "path": "/articles/ios-100vh-address-bar",
    "title": "iOSで100vhがアドレスバー分はみ出すときの対処",
    "description": "height:100vhで全画面を作ったのにiOS Safariではアドレスバー分だけはみ出す、という問題に悩む開発者向け。dvhなど新しい単位への切り替え方と回避策を整理した記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "font-fallback-different-look",
    "path": "/articles/font-fallback-different-look",
    "title": "環境によってフォントが別物に置き換わり見た目が変わるときの対処",
    "description": "自分のPCではきれいに見えるのに別の端末でフォントが置き換わり印象が変わると悩む制作者向け。フォールバックの仕組みを整えて端末間の見た目の差を最小限に抑える方法を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "icon-font-shows-square",
    "path": "/articles/icon-font-shows-square",
    "title": "アイコンフォント（Font Awesome等）が四角や文字で表示されるときの対処",
    "description": "Font Awesomeなどのアイコンを設置したのに四角い記号や文字がそのまま出てしまうと困っている方向け。読み込み失敗やクラス指定ミスなど数パターンに絞った原因と対処法がわかります。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "letter-spacing-justify-broken",
    "path": "/articles/letter-spacing-justify-broken",
    "title": "文字間隔・両端揃えが崩れて読みにくいときの対処",
    "description": "文字間隔の調整で最後の文字がずれる、両端揃えで単語間が間延びして読みにくいと感じる制作者向け。letter-spacingとtext-align:justifyの挙動と日本語特有の注意点をまとめています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "image-blurry-retina",
    "path": "/articles/image-blurry-retina",
    "title": "画像がぼやける・粗く見えるときの対処（高解像度ディスプレイ）",
    "description": "Retinaなどの高解像度ディスプレイで画像がぼやけたり粗く見えたりすると困っているWeb制作者向け。srcsetやobject-fitを正しく使って高解像度対応を実現する考え方と手順を整理します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "layout-shift-loading-jump",
    "path": "/articles/layout-shift-loading-jump",
    "title": "読み込み中にレイアウトがガクッとずれるときの原因と対処",
    "description": "ページを開いた直後に文字やボタンの位置が急に飛ぶ現象（レイアウトシフト）に悩む開発者向け。高さ未確保の要素が主因で、誤クリックや読みづらさを招く原因と対処を整理した記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "transform-blurry-text",
    "path": "/articles/transform-blurry-text",
    "title": "transformやscaleを使った要素の文字がにじむときの対処",
    "description": "transformやscaleを使ったカードやモーダルで文字がにじんで見えると困っているフロントエンド開発者向け。半端座標とGPU合成によるサブピクセルレンダリングが原因で、具体的な回避策を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "overflow-hidden-content-cut",
    "path": "/articles/overflow-hidden-content-cut",
    "title": "overflow:hiddenで中身が切れて見えないときの対処",
    "description": "overflow:hiddenで角丸やはみ出し対策をしたらドロップダウンや影まで切れてしまったと困っている方向け。必要なクリップと表示したい要素を両立させる設計の考え方と対処法をまとめています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-specificity-not-applied",
    "path": "/articles/css-specificity-not-applied",
    "title": "書いたCSSが別のスタイルに上書きされて当たらないときの対処",
    "description": "CSSを書いたのに別のスタイルに上書きされて全然反映されないと詰まっている方向け。詳細度・記述順・!importantによる競合を整理し、乱発せず解決する切り分けの考え方がわかります。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tablet-breakpoint-awkward",
    "path": "/articles/tablet-breakpoint-awkward",
    "title": "タブレット幅だけ表示が中途半端に崩れるときの対処",
    "description": "スマホとPCはきれいなのにタブレット幅だけ余白が空きすぎるカラムが間延びするという中間崩れに悩む制作者向け。ブレークポイントの設計を見直す原因と手順を整理した記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "landscape-mode-layout-break",
    "path": "/articles/landscape-mode-layout-break",
    "title": "スマホを横向きにすると崩れるときの原因と対処",
    "description": "縦向きでは問題ないのにスマホ横向きで要素が収まらない固定ヘッダーが邪魔になるという崩れに困っている方向け。横向き特有の幅広・高さ低の状態に対応する対処法をまとめています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "background-attachment-fixed-mobile",
    "path": "/articles/background-attachment-fixed-mobile",
    "title": "背景の固定（parallax風）がスマホで効かないときの対処",
    "description": "PCでは背景が固定されパララックス風に見えるのにスマホでは一緒にスクロールしてしまうと困っている制作者向け。background-attachment:fixedのモバイル非対応の原因と代替手段を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pseudo-element-not-showing",
    "path": "/articles/pseudo-element-not-showing",
    "title": "::before・::afterで作った装飾が表示されないときの対処",
    "description": "::before・::afterで作った装飾が表示されないときの対処の原因を症状別に整理し、ファイル構成・パス・設定の確認手順と安全な直し方を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "form-input-style-reset-ios",
    "path": "/articles/form-input-style-reset-ios",
    "title": "入力欄やボタンがiOSで勝手な見た目になるときの対処",
    "description": "PCで整ったフォームがiPhoneで開くと角丸や内側の影が付いて崩れてしまうと困っているWeb制作者向け。iOSの独自スタイルの仕組みとappearanceでリセットして整える手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "select-dropdown-style-broken",
    "path": "/articles/select-dropdown-style-broken",
    "title": "セレクトボックス（プルダウン）の見た目が環境で違うときの対処",
    "description": "セレクトボックスの見た目がブラウザやOSごとに変わって統一できないと悩むフロントエンド開発者向け。どこまでCSSで整えられるか、開いたリストはなぜ揃えられないかを解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "placeholder-text-cut-or-invisible",
    "path": "/articles/placeholder-text-cut-or-invisible",
    "title": "プレースホルダーの文字が切れる・見えないときの対処",
    "description": "入力欄のプレースホルダーが途中で切れたり薄すぎて読めなかったりするフォーム設計の問題に悩む制作者向け。縦切れ・横切れ・色コントラストの3観点で原因を整理した記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "list-bullet-number-misaligned",
    "path": "/articles/list-bullet-number-misaligned",
    "title": "箇条書きの行頭記号や番号がずれる・消えるときの対処",
    "description": "箇条書きの中黒や番号が消えたりテキストとずれたりしてドキュメントが読みにくくなっていると困っている方向け。CSSリセットやlist-styleの設定が原因の典型パターンを整理して解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-variable-not-working",
    "path": "/articles/css-variable-not-working",
    "title": "CSS変数（カスタムプロパティ）が反映されないときの対処",
    "description": "CSS変数でまとめたはずの色やサイズがvar()で呼んでも反映されないと困っているフロントエンド開発者向け。スコープ・フォールバック・値の書式ルールを押さえて原因を特定できる記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gradient-banding-or-invisible",
    "path": "/articles/gradient-banding-or-invisible",
    "title": "グラデーション背景が表示されない・縞模様になるときの対処",
    "description": "背景グラデーションが表示されないか、滑らかなはずが縞模様（バンディング）に見えると困っている制作者向け。構文ミスと色の段差という二つの原因を症状別に切り分けて解決できます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "shadow-or-border-radius-not-applied",
    "path": "/articles/shadow-or-border-radius-not-applied",
    "title": "影（box-shadow）や角丸が効かないときの原因と対処",
    "description": "box-shadowで付けた影が見えない、border-radiusの角丸が四角いままと困っている方向け。overflowによる切り取りや背景・サイズの前提漏れという代表パターンを症状ごとに整理します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tailwind-cdn-styles-missing",
    "path": "/articles/tailwind-cdn-styles-missing",
    "title": "Tailwind CSSのクラスが当たらない・一部だけ効くときの対処",
    "description": "Tailwindのクラスを書いたのにスタイルが当たらない、ローカルでは効くのに共有先で崩れると困っている開発者向け。CDN版とビルド版の差やコンテンツスキャン設定の原因を特定できる記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "bootstrap-grid-not-aligning",
    "path": "/articles/bootstrap-grid-not-aligning",
    "title": "Bootstrapのグリッドやコンポーネントが崩れるときの対処",
    "description": "Bootstrapでカラムが揃わない、モーダルやタブが反応しないというトラブルに悩む開発者向け。読み込み順やHTML構造の崩れ、バージョン間の仕様変更が原因かどうかを素早く切り分けられます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-fonts-flash-swap",
    "path": "/articles/google-fonts-flash-swap",
    "title": "Google Fontsの読み込みで一瞬別フォントになる・ちらつくときの対処",
    "description": "Google Fontsの読み込み中に別フォントで表示されてから切り替わるちらつき（FOUTやFOIT）に悩む制作者向け。font-displayの設定と事前接続の工夫で体験を改善する手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "modal-scroll-behind-mobile",
    "path": "/articles/modal-scroll-behind-mobile",
    "title": "モーダル表示中に背景がスクロールしてしまうときの対処",
    "description": "モーダルやハンバーガーメニューを開くと背後のコンテンツがスクロールしてしまうと困っているモバイル開発者向け。body固定・スクロール位置の保持・iOS特有の挙動への対処をまとめた記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "two-column-stacks-or-overlaps",
    "path": "/articles/two-column-stacks-or-overlaps",
    "title": "2カラムが縦並びにならない・重なるときのレスポンシブ対処",
    "description": "PCでは2カラムなのにスマホで縦に並ばない、または要素同士が重なってしまうと困っているコーダー向け。floatの解除漏れやflexの折り返し設定を手法ごとに整理して崩れない設計ができます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "vertical-centering-fails",
    "path": "/articles/vertical-centering-fails",
    "title": "要素を上下中央に揃えたいのに揃わないときの対処",
    "description": "上下中央揃えを試みても揃わないと悩むフロントエンド開発者向け。flexやgridなど手法ごとの前提条件の違いを理解すれば、親の高さの有無に合わせた確実な中央揃えが実現できます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "aspect-ratio-image-card-uneven",
    "path": "/articles/aspect-ratio-image-card-uneven",
    "title": "画像カードの高さが揃わずガタガタになるときの対処",
    "description": "商品やブログのカードを並べると画像の縦横比がまちまちで高さがガタガタになると困っているUI制作者向け。aspect-ratioとobject-fitを組み合わせて揃ったグリッドを作る方法を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "windows-mac-font-rendering-diff",
    "path": "/articles/windows-mac-font-rendering-diff",
    "title": "WindowsとMacで文字の太さ・見え方が違うときの対処",
    "description": "同じデザインなのにWindowsでは文字が細く、Macでは太くにじんで見えると悩む制作者向け。OSごとの文字描画の違いを理解し、差が目立ちにくい設計を選ぶことが現実的な対処だと判断できます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "browser-zoom-layout-break",
    "path": "/articles/browser-zoom-layout-break",
    "title": "ブラウザのズーム（拡大表示）でレイアウトが崩れるときの対処",
    "description": "拡大表示した途端に文字が重なったり余白が消えたりして困っているデザイナー・コーダー向け。ズーム時のフォント拡大とレイアウト単位の組み合わせがなぜ崩れを起こすのか原因を解説し、共有URLで実機確認しながら修正を進める手順を紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-not-loading-relative-path",
    "path": "/articles/css-not-loading-relative-path",
    "title": "CSSファイルが読み込まれずスタイルが全く当たらないときの対処（相対パス）",
    "description": "公開した途端にスタイルがまったく当たらなくなった経験はありませんか。linkタグのhrefに書いた相対パスが公開後のディレクトリ構成とずれているとき、素のHTMLになってしまう理由と、パスのずれを素早く見つけて直すまでの手順を整理しています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "console-error-debug-published",
    "path": "/articles/console-error-debug-published",
    "title": "公開後の不具合をブラウザの開発者ツール(Console)で切り分ける手順",
    "description": "公開後のページが思い通りに動かず、勘で直し続けて時間を溶かしているWeb制作者向け。F12で開くConsoleとNetworkタブを使って「何が・どこで」失敗しているかを10分以内に切り分けるための基礎的な手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "mixed-content-blocked",
    "path": "/articles/mixed-content-blocked",
    "title": "Mixed Content警告でhttpリソースがブロックされるときの対処",
    "description": "HTTPSのページなのに画像やスクリプトが表示されずConsoleに「Mixed Content」と出て頭を抱えているすべての人へ。ブラウザがhttpリソースをブロックする仕組みから、該当箇所の特定と修正・回避策の選び方まで具体的に説明します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "module-script-cors-error",
    "path": "/articles/module-script-cors-error",
    "title": "type=\"module\"のJSが読み込めない・CORSで止まるときの対処",
    "description": "type=moduleにした瞬間にJSが読み込めなくなってCORSエラーに悩んでいる開発者向け。ESモジュール特有の読み込みルールが厳しい理由と、ローカルと公開環境の違いを踏まえたエラーの切り分け・解消手順をわかりやすく整理しています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "defer-async-script-order",
    "path": "/articles/defer-async-script-order",
    "title": "scriptのdefer/asyncで読み込み順が崩れて動かないときの対処",
    "description": "ライブラリより先に自分のコードが走ってエラーになり、deferとasyncのどちらを付けるべきか迷っている方向け。それぞれの実行タイミングの違いを図解で整理し、依存関係を壊さないスクリプトの並べ方を判断できるようになる記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "fetch-relative-path-404",
    "path": "/articles/fetch-relative-path-404",
    "title": "fetchで相対パスのファイルが404になるときの原因と対処",
    "description": "ローカルでは取れていたデータがfetchで404になって途方に暮れている開発者向け。fetchの相対パスが「どこを基準に」解釈されるかを明確にし、公開後のディレクトリ構成とのズレを素早く特定して直すための確認フローを紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "json-fetch-parse-error",
    "path": "/articles/json-fetch-parse-error",
    "title": "外部JSONの読み込みでパースエラーになるときの確認点",
    "description": "fetchはリクエスト成功なのにJSON.parseで落ちる、という謎のエラーに当たった方向け。Content-Typeの不一致・BOMの混入・HTMLが返ってくる状況など、パースが失敗しやすい原因をパターン別に挙げて確認手順を示します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "content-security-policy-blocking",
    "path": "/articles/content-security-policy-blocking",
    "title": "CSPでJS/CSSがブロックされるときの対処",
    "description": "ページは開くのにボタンやアニメーションが一切反応せずConsoleに「Refused to execute」が並ぶ状況に困っているフロントエンド担当者向け。CSPのディレクティブの読み方と、JS・CSSのブロックを解除するための設定変更の判断軸を整理します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "third-party-cookie-blocked",
    "path": "/articles/third-party-cookie-blocked",
    "title": "サードパーティCookieがブロックされて埋め込みが動かないときの対処",
    "description": "iframeで埋め込んだ外部ウィジェットがログインを保持できず動かない原因を知りたい方向け。サードパーティCookieのブロックが起きる仕組みを理解し、確認・共有の場面で使えるデバッグ手順と現実的な回避策を選ぶための指針を示します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "service-worker-not-updating",
    "path": "/articles/service-worker-not-updating",
    "title": "Service Workerのせいで古い内容が表示され続けるときの対処",
    "description": "ファイルを更新して再アップしたのに相手の画面では古い内容のままで困っているすべての方へ。Service Workerがキャッシュを握り続ける理由と、古いSWを確実に置き換えてユーザーに最新版を届けるためのリセット手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "manifest-pwa-not-installable",
    "path": "/articles/manifest-pwa-not-installable",
    "title": "Webアプリマニフェストが効かない・PWAとして扱われないときの確認点",
    "description": "ホーム画面追加のアイコンが出ず、PWAとしてインストールできない原因を調べている開発者向け。manifest.jsonの必須項目チェックからHTTPS・Service Workerの条件まで、インストール可能になるかを一つずつ判断できる確認リストを提供します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "web-component-not-rendering",
    "path": "/articles/web-component-not-rendering",
    "title": "Web Components(カスタム要素)が描画されないときの原因と対処",
    "description": "独自タグを書いたのに中身が空のまま、スタイルも当たらないという状況に悩むWeb Components初学者向け。カスタム要素の登録タイミングとShadow DOMの境界が絡む原因を整理し、どのパターンに該当するか切り分けて直す手順を示します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-fonts-blocked",
    "path": "/articles/google-fonts-blocked",
    "title": "Google Fontsが読み込めず代替フォントになるときの対処",
    "description": "デザイン指定の書体にならず標準フォントで表示されて困っているコーダー・デザイナー向け。Google Fontsの読み込み失敗にはlink記述ミス・ネットワーク制限・CSPブロックの三パターンがあり、どれか判断するための切り分け手順をまとめます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "recaptcha-not-loading",
    "path": "/articles/recaptcha-not-loading",
    "title": "reCAPTCHAが表示されない・認証できないときの確認点",
    "description": "フォームにreCAPTCHAを設置したのに表示されない・認証が通らないと困っているサイト運営者向け。最も多い原因はサイトキーに登録したドメインと実際のURLの不一致で、仕組みを理解しながら確認ポイントを順番に潰せる手順を紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "stripe-checkout-not-loading",
    "path": "/articles/stripe-checkout-not-loading",
    "title": "Stripeの決済ボタンやCheckoutが表示されないときの対処",
    "description": "決済ボタンが表示されずCheckoutに進めなくて機会損失が気になるサービス運営者向け。Stripe.jsの読み込み失敗・ドメイン設定・CSPブロックという主要な原因を安全に切り分ける手順と、確認環境での注意点をあわせて整理します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-analytics-not-tracking",
    "path": "/articles/google-analytics-not-tracking",
    "title": "Googleアナリティクスのタグが発火しない・計測されないときの対処",
    "description": "アクセス解析を仕込んだつもりがレポートが0のまま、という状況に悩むサイト担当者向け。タグの貼り付け位置・計測ID・ドメイン設定・広告ブロッカーなど複数の原因候補を順番に絞り込み、計測が動くかどうかを自分で判断できる手順を紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-tag-manager-not-firing",
    "path": "/articles/google-tag-manager-not-firing",
    "title": "Googleタグマネージャー(GTM)が動かないときの確認点",
    "description": "GTMを導入したのにタグが発火せず計測データが取れないと困っているマーケター・実装担当者向け。コンテナの貼り忘れ・トリガー条件のミス・公開忘れという典型パターンをプレビューモードで一つずつ確認していく手順をわかりやすく解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "spotify-embed-not-showing",
    "path": "/articles/spotify-embed-not-showing",
    "title": "Spotifyの埋め込みプレーヤーが表示されないときの対処",
    "description": "ブログや資料ページに埋め込んだSpotifyのプレーヤーが真っ白で表示されないと困っているコンテンツ制作者向け。埋め込みコードの取り違えや一部欠落、ブロック系の設定が主な原因で、表示を復旧するための確認ステップを具体的に示します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "instagram-embed-not-showing",
    "path": "/articles/instagram-embed-not-showing",
    "title": "Instagramの投稿埋め込みが表示されないときの対処",
    "description": "Instagramの投稿を貼ったのにリンクのみ・空白になってしまうサイト担当者向け。blockquoteとembed.jsの両方が揃って初めて描画される仕組みを理解し、どちらが欠けているか特定して正しく表示するための確認と修正手順を整理します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "interactive-portfolio-html",
    "path": "/articles/interactive-portfolio-html",
    "title": "インタラクティブ作品ポートフォリオHTMLを共有する方法",
    "description": "アニメーションやインタラクションが魅力のポートフォリオをPDFで送って「伝わらない」と感じているクリエイター向け。ブラウザでそのまま動くHTMLを、閲覧者を絞った一時URLで届けるまでの具体的な手順と工夫を紹介します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "seminar-slide-html",
    "path": "/articles/seminar-slide-html",
    "title": "HTMLスライド資料（reveal.js等）を共有する方法",
    "description": "reveal.jsなどで作ったHTMLスライドを参加者へ配布したいとき、URLを1本渡すだけで完結させたい登壇者・講師向け。アニメーションやコードハイライトが生きたまま、差し替え可能な一時URLで共有する方法をステップごとに解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "e-learning-content-html",
    "path": "/articles/e-learning-content-html",
    "title": "HTML教材・eラーニングコンテンツを共有する方法",
    "description": "受講者限定で届けたい・更新をすぐ反映したい・誰がいつ見たか把握したい、という運用ニーズを持つHTML教材の制作者向け。インタラクティブな学習コンテンツをブラウザで使える状態のまま配布し、運用を回すための具体策をまとめます。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "storybook-component-html",
    "path": "/articles/storybook-component-html",
    "title": "HTMLコンポーネントカタログ（Storybookビルド）を共有する方法",
    "description": "StorybookをビルドしてできたUIカタログをデザイナーやクライアントに確認してもらいたいフロントエンド開発者向け。アカウントなしでURLを開くだけで閲覧できる認証付き共有の仕組みと、レビューを回すための運用フローを解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "changelog-release-notes-html",
    "path": "/articles/changelog-release-notes-html",
    "title": "HTMLリリースノート・更新履歴ページを共有する方法",
    "description": "リリースごとに最新の変更点を社内関係者や一部顧客へ先行共有したい開発・リリース担当者向け。HTMLで作った更新履歴ページを限定URLで配布し、同じURLのまま中身だけを差し替えてリリースサイクルに合わせて運用する方法を紹介します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "interview-coding-test-html",
    "path": "/articles/interview-coding-test-html",
    "title": "コーディング課題・技術試験HTMLを候補者に共有する方法",
    "description": "エンジニア採用でコーディング課題や技術試験の説明をどう配布するか悩んでいる採用担当者向け。課題ページをHTMLにまとめ、公開期限付きの限定URLで候補者に配りながら公平性を保つための運用の工夫を紹介します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "digital-invitation-html",
    "path": "/articles/digital-invitation-html",
    "title": "デジタル招待状HTMLを共有する方法",
    "description": "結婚式やパーティーの招待状をHTMLのデジタル版で送りたいと考えている主催者向け。おしゃれに作ったページをゲストだけに届けるパスワード付きURLの設定から、QRコードの活用やデザイン差し替えまで実用的な手順を紹介します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "press-kit-html",
    "path": "/articles/press-kit-html",
    "title": "プレスキット・メディア向け資料HTMLを共有する方法",
    "description": "発表前のロゴ・写真・ファクトシートを報道関係者へ適切なタイミングで渡したい広報担当者向け。素材ページをHTMLにまとめて限定URLで提供し、解禁日の管理や差し替えにも柔軟に対応できる共有の仕組みを紹介します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "comparison-table-html",
    "path": "/articles/comparison-table-html",
    "title": "製品比較表HTMLを共有する方法",
    "description": "自社と競合の機能比較表を提案の場でだけ取引先に見せたい営業・マーケター向け。認証付きURLで社外に提示しながら、提案フェーズに応じて内容を差し替えられる運用方法と、閲覧できる相手を絞るための設定手順を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "survey-result-report-html",
    "path": "/articles/survey-result-report-html",
    "title": "アンケート集計レポートHTMLを共有する方法",
    "description": "グラフや表でまとめたアンケート集計レポートを関係者へ安全に届けたい調査担当者向け。メール認証で閲覧者を絞りながらHTMLレポートを共有し、回答者のプライバシーを守るために注意すべきポイントも合わせて整理します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "error-page-design-html",
    "path": "/articles/error-page-design-html",
    "title": "エラーページ・メンテナンス画面HTMLを共有する方法",
    "description": "404・503・メンテナンス画面のデザイン案を制作チームやクライアントとHTMLのままやり取りしたいWeb担当者向け。レビュー用URLで共有してフィードバックを反映しながら仕上げるワークフローと、差し替え運用の具体例を紹介します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "email-signature-html",
    "path": "/articles/email-signature-html",
    "title": "HTMLメール署名のプレビューを共有する方法",
    "description": "ロゴやSNSリンク入りのHTMLメール署名を社内に配布する前に見え方を確認したい担当者向け。メールソフトによって表示が変わりやすい署名のプレビューページを共有し、社内レビューと差し替え運用で仕上げるまでの流れを解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "animation-demo-html",
    "path": "/articles/animation-demo-html",
    "title": "CSS・JSアニメーションのデモHTMLを共有する方法",
    "description": "ホバーやスクロール連動など動きを伴うアニメーションを静止画では伝えられなくて困っているUI制作者向け。CSS・JSアニメーションのデモHTMLを確認用URLで関係者へ共有し、実際に動かしながらフィードバックをもらう方法を紹介します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "3d-model-viewer-html",
    "path": "/articles/3d-model-viewer-html",
    "title": "3Dモデルビューア（model-viewer等）HTMLを共有する方法",
    "description": "3Dモデルの質感や形状の細部を静止画では伝えられず、実物に近い形で取引先に確認してもらいたい制作者向け。model-viewerなどで作ったWebGLの3D表示ページを認証付きURLで共有する手順と、閲覧環境での注意点をまとめます。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "audio-player-html",
    "path": "/articles/audio-player-html",
    "title": "音声プレイヤー埋め込みHTMLを共有する方法",
    "description": "未公開の楽曲やポッドキャストを関係者だけに試聴してもらいたいクリエイター・レーベル担当者向け。音声プレイヤーを埋め込んだHTMLをパスワード付きの一時URLで届け、期限が来たら自動で閲覧を締める安全な配布方法を紹介します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "video-gallery-html",
    "path": "/articles/video-gallery-html",
    "title": "動画ギャラリーHTMLを共有する方法",
    "description": "複数の動画を一覧でまとめて見せたいのにリンクを何本も送ることになって困っているコンテンツ担当者向け。埋め込み動画のギャラリーHTMLをメール認証で関係者限定に共有し、一画面で全体像を把握してもらうための手順を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "interactive-map-tour-html",
    "path": "/articles/interactive-map-tour-html",
    "title": "施設案内・バーチャルツアーHTMLを共有する方法",
    "description": "地図上のホットスポットや360度パノラマで施設を案内したいが、紙パンフでは再現できないと感じている施設・イベント担当者向け。インタラクティブな案内・ツアーのHTMLを公開期限付きで来訪者へ届ける方法と運用上の工夫を紹介します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gantt-schedule-html",
    "path": "/articles/gantt-schedule-html",
    "title": "ガントチャート・工程表HTMLを共有する方法",
    "description": "工程表を更新するたびに全員に最新版を届けたいが、エクセルを送り直すと版が乱立して困るプロジェクト担当者向け。ガントチャートHTMLを差し替え運用で共有し、URLは変えずに常に最新版をレビューしてもらう仕組みの作り方を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "kanban-board-html",
    "path": "/articles/kanban-board-html",
    "title": "かんばんボード風タスク一覧HTMLを共有する方法",
    "description": "かんばんボードの進捗をツールのアカウントを持たない関係者にも素早く共有したいチームリーダー向け。静的HTMLに書き出したタスク一覧を認証付きURLで配り、スナップショットを誰でもURLを開くだけで確認できる運用方法を紹介します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "flowchart-diagram-html",
    "path": "/articles/flowchart-diagram-html",
    "title": "フローチャート・業務フロー図HTMLを共有する方法",
    "description": "業務フロー図の修正のたびに画像を作り直して版管理が煩雑になっているプロセス担当者向け。mermaidなどで描いたフローチャートのHTMLを確認用URLでレビュアーに回し、差し替えでフィードバックを反映していく効率的な手順を示します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wireframe-html",
    "path": "/articles/wireframe-html",
    "title": "ワイヤーフレームHTMLを共有する方法",
    "description": "リンクの動きやレスポンシブの折り返しまでクライアントに実物に近い形で確認してもらいたいUI設計者向け。ワイヤーフレームのHTMLを早い段階から認証付きURLで共有し、方向性のすり合わせを素早く行うための流れを整理します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "design-system-doc-html",
    "path": "/articles/design-system-doc-html",
    "title": "デザインシステム・スタイルガイドHTMLを共有する方法",
    "description": "配色・余白・タイポグラフィの規定をチーム全員が同じ基準で参照できるよう整備したい担当者向け。スタイルガイドのHTMLを社内向けURLで正本として配布し、版がばらつかない状態を保つための運用方法と更新フローを解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "api-reference-html",
    "path": "/articles/api-reference-html",
    "title": "APIリファレンス・仕様書HTMLを共有する方法",
    "description": "一般公開前のAPIエンドポイントや仕様書を取引先の開発者にだけ届けたい担当者向け。静的生成したAPIリファレンスHTMLをメール認証付きURLで渡すことで、閲覧できる相手を絞りながら連携実装を円滑に進める方法を紹介します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "readme-doc-html",
    "path": "/articles/readme-doc-html",
    "title": "技術ドキュメント・READMEのHTML版を共有する方法",
    "description": "リポジトリのアクセス権がない相手にREADMEや設計ドキュメントを読んでもらいたい開発者向け。MarkdownをHTMLに変換してURLで渡せば、相手はGitの知識なしにブラウザで読めます。変換から共有・差し替え運用までの手順を整理します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "financial-report-html",
    "path": "/articles/financial-report-html",
    "title": "決算・財務レポートHTMLを共有する方法",
    "description": "動くグラフ付きの決算・財務レポートを社外秘のまま特定の関係者へ届けたいIR・経営企画担当者向け。HTMLのままメール認証付きURLで渡すことで、見栄えを保ちつつ閲覧できる人を厳密に絞る共有方法と運用上の注意点を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "kpi-scorecard-html",
    "path": "/articles/kpi-scorecard-html",
    "title": "KPIスコアカード・成績表HTMLを共有する方法",
    "description": "KPI達成状況をチーム全員が同じ最新データで確認できるようにしたいマネージャー向け。表計算ファイルの版が散らばる問題を解消するために、スコアカードHTMLを社内URLで一元管理し、差し替えで常に最新を届ける運用方法を紹介します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "press-release-html",
    "path": "/articles/press-release-html",
    "title": "プレスリリースHTMLを共有する方法",
    "description": "解禁前のプレスリリース原稿を経営層・提携先に確認してもらいながら外部漏えいを防ぎたい広報担当者向け。公開期限とパスワードを付けたURLで配布し、レビュー後は自動で閲覧を締める安全な確認フローを整理します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "job-posting-html",
    "path": "/articles/job-posting-html",
    "title": "求人票・募集要項HTMLを共有する方法",
    "description": "給与・条件の表記を人事・現場・経営層でしっかり確認してから求人を掲載したい採用担当者向け。募集要項のHTML案をパスワード付きURLで社内に回し、全員の承認を得てから公開へ進む安全な確認フローの作り方を紹介します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "onboarding-guide-html",
    "path": "/articles/onboarding-guide-html",
    "title": "新入社員向けオンボーディング資料HTMLを共有する方法",
    "description": "入社初日の案内や研修資料をHTMLで作りたいが、社外への漏えいは避けたい人事・総務担当者向け。会社ドメイン認証を使えば自社メールアドレスを持つ人だけに閲覧を絞れます。資料の作成から安全な配布・更新までの流れを整理します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "checklist-form-html",
    "path": "/articles/checklist-form-html",
    "title": "チェックリスト・点検表HTMLを共有する方法",
    "description": "現場の点検表や作業前チェックリストをブラウザで開けるHTMLにしたいが、入力内容の扱いや配布範囲が気になる現場担当者向け。チェックボックスや入力欄付きのページを作って共有するときの落とし穴と、安全に運用するための手順を整理します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "domain-auth-vs-email-auth",
    "path": "/articles/domain-auth-vs-email-auth",
    "title": "会社ドメイン認証とメール認証の違いと使い分け｜社外協力会社が混ざるときの選び方",
    "description": "社外の協力会社が加わる共有では、認証の選び方が安全性と利便性を左右します。会社ドメイン認証とメール認証の仕組みの違いを知り、社内外が混在する状況でどちらを選べばよいかを具体的に判断できます。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "shared-html-data-residency-jp",
    "path": "/articles/shared-html-data-residency-jp",
    "title": "共有HTMLのデータ保管場所を気にすべき理由｜国内・国外サーバーと社内規程の確認",
    "description": "一時共有のつもりでも、ファイルが保管されるサーバーの所在地が社内規程や契約の問題になる場合があります。なぜデータ保管場所を確認すべきなのか、国内・国外サーバーの違いと社内規程の照らし合わせ方を整理しました。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "browser-cache-after-shared-html",
    "path": "/articles/browser-cache-after-shared-html",
    "title": "共有HTMLを閲覧した後ブラウザに残るキャッシュの危険性と消し方",
    "description": "認証付きで送った資料でも、共用端末のブラウザキャッシュに内容が残ると次の利用者に見られる恐れがあります。閲覧後に端末へ何が残るかを把握し、送る側・受け取る側それぞれに必要な対処を確認できます。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pdf-embed-in-shared-html-risk",
    "path": "/articles/pdf-embed-in-shared-html-risk",
    "title": "共有HTMLに埋め込んだPDFやファイルから情報が漏れる落とし穴",
    "description": "HTMLに埋め込んだPDFは本文を隠しても、メタデータや直接抽出で内容が露出することがあります。ファイル埋め込みに潜む具体的なリスクと、共有前に確認すべきポイントをまとめました。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "exif-geolocation-in-shared-images",
    "path": "/articles/exif-geolocation-in-shared-images",
    "title": "共有HTMLの画像に残るExif・位置情報を消してから渡す",
    "description": "写真の本文では場所を伏せていても、Exifデータに撮影地や端末情報が残っていると情報が漏れます。共有HTMLに画像を載せる前に確認すべき項目と、位置情報の削除手順を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "comments-in-html-source-leak",
    "path": "/articles/comments-in-html-source-leak",
    "title": "HTMLソースのコメントに残る社内メモ・TODOを公開前に消す",
    "description": "HTMLコメントは画面に表示されなくてもソースを開けば誰でも読めます。公開前に社内メモやTODOが残っていないか確認したい人向けに、見つけ方と削除の進め方をまとめました。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "git-metadata-in-zip-site",
    "path": "/articles/git-metadata-in-zip-site",
    "title": "ZIPサイトに紛れ込む.gitや設定ファイルから情報が漏れるのを防ぐ",
    "description": "制作中のZIPを渡すとき、.gitや.envなどの隠しファイルが混入していると機密情報が漏れます。見えない隠しファイルの混入経路と、共有前にZIPをきれいにする手順を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "least-privilege-auth-per-recipient",
    "path": "/articles/least-privilege-auth-per-recipient",
    "title": "相手ごとに最小限の認証を割り当てる考え方｜全員に同じURLを配らない",
    "description": "全員に同じURLを配ると、本来見せなくてよい相手にも届いてしまいます。閲覧者の立場に合わせて認証方式を使い分ける最小権限の考え方と、その具体的な実践方法を紹介します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "shared-html-incident-response",
    "path": "/articles/shared-html-incident-response",
    "title": "共有HTMLから情報漏えいが起きたときの初動対応｜止める・調べる・報告する",
    "description": "共有HTMLに見せてはいけない情報が含まれていたと気づいたとき、初動の手順が被害の広がりを左右します。止める・調べる・報告するという三つのステップを具体的な流れで確認できます。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "deepfake-impersonation-shared-link",
    "path": "/articles/deepfake-impersonation-shared-link",
    "title": "共有URLを装ったなりすまし・偽リンクへの注意｜相手に正しく信じてもらう",
    "description": "本物そっくりの偽リンクを使ったなりすましは、受け取る側には見分けがつきにくいのが難しいところです。送り手と受け手それぞれができる真正性の確認方法と、安全に渡すための対策を整理しました。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "shared-html-vs-google-drive-security",
    "path": "/articles/shared-html-vs-google-drive-security",
    "title": "Google ドライブ共有とギガサイト便、どちらが安全か｜HTMLレビュー用途で比較",
    "description": "HTMLを誰かに確認してもらうとき、Google ドライブか専用サービスかで迷う人は多いはずです。HTMLレビューという場面に絞り、両者の安全性を公平に比較して判断材料を提供します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "secure-redaction-vs-blackout",
    "path": "/articles/secure-redaction-vs-blackout",
    "title": "共有HTMLの黒塗りは見破られる｜マスキングの正しいやり方",
    "description": "HTMLで黒塗りしても選択してコピーすれば中身が読めてしまう、という落とし穴はよく見落とされます。見た目の隠蔽が見破られる仕組みと、情報を確実にマスキングする正しい方法を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "localstorage-cookie-residue-shared-html",
    "path": "/articles/localstorage-cookie-residue-shared-html",
    "title": "共有HTMLが閲覧者の端末に書き込むlocalStorage・Cookieのリスク",
    "description": "共有HTMLが閲覧者の端末にlocalStorageやCookieを書き込んでいると、共用端末では次の利用者に情報が残ります。ページを閉じた後も端末に残るデータの仕組みと対処法を確認できます。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "shared-link-shoulder-surfing",
    "path": "/articles/shared-link-shoulder-surfing",
    "title": "対面プレゼンで共有HTMLを見せるときの覗き見・盗撮対策",
    "description": "暗号化や認証を整えても、画面そのものを覗き見・撮影されれば情報は漏れます。対面プレゼンや外出先での共有で、その場の環境から情報を守るための具体的な対策を整理しました。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-large-recipient-list",
    "path": "/articles/auth-method-for-large-recipient-list",
    "title": "大人数に共有HTMLを配るときの認証選び｜セキュリティと運用負荷の両立",
    "description": "数十人への一斉配布では、認証を強めるほど配る側の手間が増えます。大人数配布の場面に絞り、認証方式ごとの運用負荷とセキュリティのバランスを確認して自分の状況に合う選択ができます。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-27"
  },
  {
    "slug": "supply-chain-cdn-tampering-shared-html",
    "path": "/articles/supply-chain-cdn-tampering-shared-html",
    "title": "共有HTMLが読み込む外部CDNが改ざんされたら｜サプライチェーン視点の確認",
    "description": "外部CDNからJavaScriptを読み込んでいる共有HTMLは、配信元が改ざんされると自分のページも汚染されます。サプライチェーンリスクの仕組みと、外部CDN依存の確認・対策手順を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "shared-html-accessibility-of-secrets",
    "path": "/articles/shared-html-accessibility-of-secrets",
    "title": "alt属性やaria-labelに残る非表示テキストからの情報漏えい",
    "description": "alt属性やdisplay:noneの要素に残るテキストは、ソースを開けば誰でも読めます。ページ上では見えないのに共有HTMLに残り続ける情報の在り処と、公開前に除去する確認方法を紹介します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "expiry-vs-revoke-difference",
    "path": "/articles/expiry-vs-revoke-difference",
    "title": "公開期限切れと手動取り消しの違い｜どちらでアクセスを断つべきか",
    "description": "共有を閉じる方法には自動で期限切れにする方法と、その場で即座に取り消す方法があります。どちらがいつ効き、後から戻せるかが違います。状況に合う使い分けの判断基準をまとめました。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "shared-html-with-financial-data",
    "path": "/articles/shared-html-with-financial-data",
    "title": "決算前の財務資料をHTMLで共有するときの注意｜インサイダー情報の扱い",
    "description": "決算前の財務データは公表まで取り扱いに慎重さが求められます。社内レビューのためにHTMLで共有する場面でも、配布範囲や記録の管理を誤ると深刻な問題につながる理由と対策を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "device-loss-after-receiving-link",
    "path": "/articles/device-loss-after-receiving-link",
    "title": "共有URLを受け取った端末を紛失したら｜閲覧者側の漏えいに備える",
    "description": "資料を渡した相手が端末を紛失すると、共有URLや認証情報が第三者の手に渡る恐れがあります。受け取る側の端末紛失を想定した認証設計と、共有者側からできる取り消し対応を確認できます。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "domain-auth-restrict-to-company",
    "path": "/articles/domain-auth-restrict-to-company",
    "title": "会社ドメインの人だけに共有ページを見せる方法（ドメイン認証の設定手順）",
    "description": "一人ずつメールアドレスを登録しなくても、会社ドメイン認証なら特定ドメインの全員をまとめて許可できます。社内限定共有を手軽に実現したい人向けに、仕組みと設定の流れ、注意点を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "email-auth-allowlist-reviewers",
    "path": "/articles/email-auth-allowlist-reviewers",
    "title": "メール認証で特定の人だけに共有ページを開かせる方法",
    "description": "見せたい相手がはっきり決まっているなら、URLを知る全員ではなくその人たちだけに開かせたいものです。許可リストとワンタイムコードで本人確認するメール認証の設定方法と運用のコツを紹介します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "switch-url-only-to-password",
    "path": "/articles/switch-url-only-to-password",
    "title": "URL限定公開からパスワード保護に切り替える方法",
    "description": "URLだけで共有したページに後から鍵をかけたい場面は珍しくありません。公開後でも認証方式をパスワードに切り替えられる手順と、変更後に相手へ何を伝え直すべきかを整理しました。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "change-share-password-later",
    "path": "/articles/change-share-password-later",
    "title": "共有ページのパスワードを後から変更する方法",
    "description": "転送やうっかりコピペでパスワードが広まることがあります。公開中のままパスワードを差し替え、旧パスワードを無効にする手順と、その後の連絡で気をつけるべき点をまとめました。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "publish-zip-uploaded-site",
    "path": "/articles/publish-zip-uploaded-site",
    "title": "ZIPでまとめたサイトをアップロードして共有URLを発行する方法",
    "description": "CSSや画像、JavaScriptが混在するサイトを1ファイルずつ渡すのは非効率です。ZIPにまとめてドロップするだけで即座に共有URLが発行できる一括公開の流れと注意点を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-folder-structure-for-upload",
    "path": "/articles/zip-folder-structure-for-upload",
    "title": "ZIPで共有するときのフォルダ構成とindex.htmlの置き方",
    "description": "ZIPをアップロードしたのに画像が出ない、CSSが効かないという問題の大半はフォルダ構成に原因があります。ルート直下へのindex.html配置と相対パスの保ち方を中心に、表示崩れを防ぐ構成を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "access-log-check-who-opened",
    "path": "/articles/access-log-check-who-opened",
    "title": "誰が共有ページを開いたかアクセスログで確認する方法",
    "description": "リンクを送った後、相手がもう見たのかどうか気になる場面はよくあります。誰がいつ共有ページを開いたかをアクセスログで把握する方法と、その記録を活用して確認状況を管理するコツを紹介します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "verify-reviewed-before-deadline",
    "path": "/articles/verify-reviewed-before-deadline",
    "title": "公開期限が切れる前に相手が見たかを確認する方法",
    "description": "期限が切れた後で「まだ見ていなかった」と言われるのを防ぎたい人向けです。アクセスログで閲覧状況を確認し、期限が来る前にリマインドや期限調整を行う具体的な手順を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "set-publish-start-and-end",
    "path": "/articles/set-publish-start-and-end",
    "title": "公開を始める日と終わる日を指定して共有する方法",
    "description": "発表前は隠しておき、レビュー期間中だけ見せたい資料に最適な設定があります。公開開始日と終了日を指定して期間内だけ閲覧できる共有を組み立てる考え方と手順を紹介します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "shorten-public-period-after-publish",
    "path": "/articles/shorten-public-period-after-publish",
    "title": "公開期限を後から短くして早めに閉じる方法",
    "description": "思ったより早く確認が終わったなら、余った期間を長く公開し続けるより早めに閉じるほうが安全です。公開期限を前倒しして早く閉じる手順と、閉じる前後に配慮すべきことをまとめました。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "replace-html-keep-auth-settings",
    "path": "/articles/replace-html-keep-auth-settings",
    "title": "HTMLを差し替えても認証やパスワード設定を引き継ぐ方法",
    "description": "ファイルを更新するたびにパスワードや期限を設定し直すのは手間がかかり、設定漏れの事故にもつながります。同じURLのままファイルを差し替えても認証・期限が引き継がれる仕組みと手順を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "rollback-to-previous-html",
    "path": "/articles/rollback-to-previous-html",
    "title": "差し替え前のHTMLに戻す方法（公開中の巻き戻し手順）",
    "description": "公開中のページを更新したら表示が崩れた、そんなときにリンクを送り直さず前の状態に戻す方法があります。戻し用ファイルさえ手元にあれば、公開URLを変えずに巻き戻す手順を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "qr-with-password-handover",
    "path": "/articles/qr-with-password-handover",
    "title": "パスワード保護した共有URLをQRで渡すときのパスワードの伝え方",
    "description": "QRコードとパスワードを同じ場所に載せると保護の意味がなくなります。QRは経路、パスワードは別経路という原則のもと、印刷物やスライドでパスワード付きページを安全に渡す方法を紹介します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-url-via-slack",
    "path": "/articles/share-url-via-slack",
    "title": "共有URLをSlackで送るときの見え方と認証の付け方",
    "description": "SlackでURLを貼るとプレビューが自動展開され、意図せず中身の一部が広まることがあります。Slackで共有URLを送る前に認証レベルを判断したい人向けに、見え方の違いと適切な設定を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-url-via-chatwork",
    "path": "/articles/share-url-via-chatwork",
    "title": "共有URLをChatworkで取引先に送る方法と認証の選び方",
    "description": "社外の取引先にChatworkでURLを送るときは、グループに複数社が同席することも多く、社内向けより慎重な認証が必要です。取引先に安全かつスムーズに共有URLを渡すための認証の選び方を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-url-line-for-client-review",
    "path": "/articles/share-url-line-for-client-review",
    "title": "共有URLをLINEで送って確認してもらう方法",
    "description": "LINEでURLを送れば取引先やお客様はスマホでその場でページを確認できます。スマホ閲覧を前提にした送り方と、URLのみで済む場面と認証が必要な場面の判断基準をアクセスログ活用とあわせて紹介します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "preview-on-multiple-devices",
    "path": "/articles/preview-on-multiple-devices",
    "title": "PC・スマホ・タブレットで表示を見比べてから共有する方法",
    "description": "完成したつもりのページも別端末で開くと崩れが見つかることがあります。共有URLを発行して実機で見比べ、レビュー依頼前に表示の問題を潰しておくためのマルチデバイス確認の手順を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-image-gallery-html",
    "path": "/articles/share-image-gallery-html",
    "title": "画像ギャラリーをHTMLにまとめて一括で見せる方法",
    "description": "写真や作例を1枚ずつ送ると順番が分からず管理も煩雑です。画像とHTMLをZIPでまとめて公開すれば、1つのURLでギャラリーとして一括に見せられます。見やすく安全な公開手順を紹介します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-form-mockup",
    "path": "/articles/share-html-form-mockup",
    "title": "入力フォームのモックHTMLを動かしながら見せる方法",
    "description": "バックエンドなしのモックHTMLを共有すれば、相手に実際にフォームを触ってもらいながら入力の流れを確認できます。スクリーンショットでは伝わらない操作感をリアルタイムにレビューしてもらう方法を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-chart-graph-html",
    "path": "/articles/share-chart-graph-html",
    "title": "Chart.jsで作ったグラフ入りHTMLをそのまま共有する方法",
    "description": "Chart.jsのグラフはHTMLファイル単体では相手の画面に表示されないことがあります。ライブラリとデータを含めて丸ごと共有し、誰の環境でも同じグラフを崩さずに見せるための準備と手順を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-comparison-table",
    "path": "/articles/auth-method-comparison-table",
    "title": "HTML共有の認証4方式を一覧表で比較｜手間・安全性・向く相手",
    "description": "URLのみ・パスワード・メール認証・会社ドメイン認証の4方式は手間と安全度、向く相手がそれぞれ異なります。観点ごとの一覧表を見れば、相手を確認するだけで最適な方式をすぐ判断できます。",
    "category": "認証共有",
    "updatedAt": "2026-06-26"
  },
  {
    "slug": "switch-from-password-to-domain-auth",
    "path": "/articles/switch-from-password-to-domain-auth",
    "title": "パスワード共有から会社ドメイン認証へ切り替える判断基準",
    "description": "最初はパスワードで十分だったのに、人数が増えると管理が追いつかなくなるのはよくある流れです。パスワードの限界サインを見極め、会社ドメイン認証への切り替えを判断するための具体的な基準を紹介します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-when-recipient-email-changes",
    "path": "/articles/auth-when-recipient-email-changes",
    "title": "相手の担当者やメールアドレスが変わったときの認証の見直し方",
    "description": "担当者の異動や退職で許可リストが現実とずれると、見せるべき人に届かず見せてはいけない人が残ります。担当者交代に合わせた許可先の再設定とドメイン認証への切り替えタイミングを整理します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-for-mixed-internal-external-recipients",
    "path": "/articles/auth-for-mixed-internal-external-recipients",
    "title": "社内と社外が混在する宛先にHTMLを共有するときの認証設計",
    "description": "社内の社員と社外の協力会社が入り混じる宛先では、どの認証で通すか迷います。所属を問わず宛先ごとに許可できるメール認証を使い、見せたい人だけをまとめて通す認証設計の考え方を解説します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "why-email-auth-over-shared-password",
    "path": "/articles/why-email-auth-over-shared-password",
    "title": "共有パスワードよりメール認証が安全な理由｜漏洩時の違い",
    "description": "パスワードを大勢で使い回すと、漏れた瞬間に全員分の入口が開いてしまいます。万一漏洩したときの影響の広がり方と止め方を比較し、メール認証が共有パスワードより安全な理由を具体的に解説します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-kickoff-checklist-before-share",
    "path": "/articles/review-kickoff-checklist-before-share",
    "title": "社内レビューを依頼する前に整える共有設定チェックリスト",
    "description": "レビュー依頼が空振りする原因の多くは共有の段取り不足です。認証設定から依頼文の構成まで、最初のひと声でレビューがスムーズに始まるための事前チェック項目を一覧で確認できます。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "split-review-by-role-content-vs-design",
    "path": "/articles/split-review-by-role-content-vs-design",
    "title": "文章担当とデザイン担当でレビュー観点を分けて依頼する方法",
    "description": "文言とデザインの指摘が混ざると重複や抜けが生まれます。文章担当とデザイン担当でレビュー観点を分けて依頼することで、重複と見落としを同時に減らせる具体的な進め方を解説します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "reviewer-no-comment-feature-workaround",
    "path": "/articles/reviewer-no-comment-feature-workaround",
    "title": "共有HTMLに直接コメントできないときのフィードバック回収術",
    "description": "閲覧専用の共有HTMLにはコメントを直接残せません。それでも指摘を確実に回収するための場所の特定方法とチャット集約の実務的なワークアラウンドを紹介します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "consolidate-feedback-from-multiple-channels",
    "path": "/articles/consolidate-feedback-from-multiple-channels",
    "title": "メール・チャット・口頭に散ったレビュー指摘を一本化する方法",
    "description": "メール・チャット・口頭と複数経路に散った指摘をそのままにすると反映漏れが起きます。共有URLを軸に指摘を一つの台帳へ集め、抜けなく反映するための集約フローを解説します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-progress-tracking-without-tool",
    "path": "/articles/review-progress-tracking-without-tool",
    "title": "専用ツールなしで社内レビューの進捗を管理する方法",
    "description": "専用ツールがなくてもアクセスログと依頼リストを突き合わせれば、誰がまだ確認していないかを把握できます。未確認者の特定から催促・締め切り管理まで、シンプルに進捗を追う手順を紹介します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firebase-studio-lp-draft-review-url",
    "path": "/articles/firebase-studio-lp-draft-review-url",
    "title": "Firebase Studioで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Firebase Studio生成のLP案をレビュー用URLで共有したいデザイナー・ディレクター向け。公開前の確認手順から認証方式の選び方、フィードバック回収のコツまでを解説し、安全かつ素早く共有できるか判断できる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firebase-studio-admin-mock-review-url",
    "path": "/articles/firebase-studio-admin-mock-review-url",
    "title": "Firebase Studioで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Firebase Studio生成の管理画面モックを社内外の関係者に安全に見せたいエンジニア・デザイナー向け。モック特有の情報漏えいリスクや誤操作を防ぐ確認手順と、適切な認証方式の選び方を整理している。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firebase-studio-slide-html-review-url",
    "path": "/articles/firebase-studio-slide-html-review-url",
    "title": "Firebase Studioで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Firebase Studio生成のHTMLスライドをプレゼン前にレビューしてもらいたいエンジニア・デザイナー向け。スライド特有の共有しにくさとその原因、公開前チェック、認証・期限の設定方法を具体的に解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firebase-studio-form-page-review-url",
    "path": "/articles/firebase-studio-form-page-review-url",
    "title": "Firebase Studioで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Firebase Studio生成のフォーム付きHTMLページをレビュー用に安全共有したいエンジニア向け。誤送信を防ぐHTML修正手順、認証の選び方、フィードバック収集の進め方を具体的に解説し、共有するか判断できるようにする。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firebase-studio-internal-tool-prototype-review-url",
    "path": "/articles/firebase-studio-internal-tool-prototype-review-url",
    "title": "Firebase Studioで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Firebase Studio生成の社内ツールプロトタイプを社内関係者に安全にレビューさせたいエンジニア・プロジェクトマネージャー向け。業務データが絡む場合の確認手順、社内向け認証設定、フィードバック回収の進め方を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-stitch-lp-draft-review-url",
    "path": "/articles/google-stitch-lp-draft-review-url",
    "title": "Google Stitchで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Google StitchでLP案を生成したデザイナー・マーケター向け。生成したHTMLをレビュー用URLとして安全に共有するための前処理・認証設定・フィードバック回収の手順を具体的に解説し、どの認証方式が適切か判断できるようにする。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-stitch-admin-mock-review-url",
    "path": "/articles/google-stitch-admin-mock-review-url",
    "title": "Google Stitchで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Google Stitch生成の管理画面モックを開発チームや業務担当者にレビューさせたいプロジェクトマネージャー・エンジニア向け。モック共有前のリスク確認、認証設定の選択基準、意見を引き出すフィードバック依頼の書き方を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-stitch-slide-html-review-url",
    "path": "/articles/google-stitch-slide-html-review-url",
    "title": "Google Stitchで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Google Stitch生成のHTMLスライドをプレゼン前にレビューしてもらいたいビジネスパーソン・デザイナー向け。スライド固有の共有上の注意点、公開前の確認手順、認証・期限の設定方法を具体的に解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-stitch-form-page-review-url",
    "path": "/articles/google-stitch-form-page-review-url",
    "title": "Google Stitchで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Google Stitch生成のフォーム付きHTMLページをレビュー用として安全に共有したいエンジニア・デザイナー向け。フォームの誤送信リスクへの対処、認証設定の判断基準、レビュアーへの依頼文の作り方を具体的に解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-stitch-internal-tool-prototype-review-url",
    "path": "/articles/google-stitch-internal-tool-prototype-review-url",
    "title": "Google Stitchで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Google Stitch生成の社内ツールプロトタイプを社内チームや業務担当者にレビューさせたいエンジニア向け。業務情報漏えいリスクの整理、社内向け認証の設定方法、実務的なフィードバック依頼のコツを解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "magic-patterns-lp-draft-review-url",
    "path": "/articles/magic-patterns-lp-draft-review-url",
    "title": "Magic Patternsで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Magic Patterns生成のLP案を営業・クライアントに見せたいデザイナー・マーケター向け。HTMLのまま安全なレビューURLを発行する手順と、Magic Patterns特有のコンポーネント依存の確認方法、適切な認証の選択基準を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "magic-patterns-admin-mock-review-url",
    "path": "/articles/magic-patterns-admin-mock-review-url",
    "title": "Magic Patternsで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Magic Patterns生成の管理画面モックをチームや業務担当者にレビューさせたいエンジニア・UIデザイナー向け。モック共有前の確認項目、社内向け認証方式の選択、業務シナリオを使ったフィードバック収集の方法を具体的に解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "magic-patterns-slide-html-review-url",
    "path": "/articles/magic-patterns-slide-html-review-url",
    "title": "Magic Patternsで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Magic PatternsでHTMLスライドを生成したあと、社外レビュアーに安全に届けたい人向け。ログイン不要URL・パスワード認証・期限設定の使い分けと、外部スクリプト混入リスクの確認手順を解説し、フィードバックを効率よく回収できる体制づくりを判断できる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "magic-patterns-form-page-review-url",
    "path": "/articles/magic-patterns-form-page-review-url",
    "title": "Magic Patternsで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "フォームの送信先が本番APIに直結している場合、うっかりレビュアーがボタンを押すとデータが飛んでしまう。Magic Patternsで生成したフォーム付きページを安全に共有するため、認証付きプレビューURLを3ステップで発行する方法を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "magic-patterns-internal-tool-prototype-review-url",
    "path": "/articles/magic-patterns-internal-tool-prototype-review-url",
    "title": "Magic Patternsで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Magic Patternsで社内ツール風プロトタイプを作成したエンジニアやデザイナーが対象。ダミーデータ混入の確認・会社ドメイン認証の設定・ステークホルダーへのレビュー依頼のコツを解説し、社内承認フローを止めずに素早くURLを共有できるかを判断できる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "uizard-lp-draft-review-url",
    "path": "/articles/uizard-lp-draft-review-url",
    "title": "Uizardで生成したLP案をレビュー用URLにして共有する方法",
    "description": "UizardでLP案を生成し、社外マーケターや経営陣にデザインレビューを依頼したい人向け。Uizard特有のHTMLエクスポートの注意点から、ログイン不要URL・パスワード認証の選択基準、フィードバックを1往復で回収するメッセージ設計まで解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "uizard-admin-mock-review-url",
    "path": "/articles/uizard-admin-mock-review-url",
    "title": "Uizardで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Uizardで生成した管理画面モックをエンジニアやPMにレビューしてもらいたいデザイナー向け。ダミーデータの取り扱い・会社ドメイン認証の設定手順・エンジニアが答えやすいフィードバック設問の作り方を解説し、開発着手前の合意形成を効率化するための判断材料を提供する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "uizard-slide-html-review-url",
    "path": "/articles/uizard-slide-html-review-url",
    "title": "Uizardで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Uizardで作成したHTMLスライドを、アカウント不要のURLで関係者にレビューしてもらいたいデザイナーやPM向け。スライド固有のナビゲーションJS確認方法、アニメーション要素の扱い、関係者に伝えるべき操作案内のポイントを解説し、レビュー依頼を1通のメッセージで完結させる方法を提供する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "uizard-form-page-review-url",
    "path": "/articles/uizard-form-page-review-url",
    "title": "Uizardで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "UizardでフォームUIを生成し、クライアントやPMにデザインレビューを依頼したい担当者向け。フォームの送信無効化手順・入力バリデーションUIの見せ方・フィードバック設問の作り方を解説し、デザインレビューと機能レビューを混同せず進められるかを判断できる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "uizard-internal-tool-prototype-review-url",
    "path": "/articles/uizard-internal-tool-prototype-review-url",
    "title": "Uizardで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Uizardで社内ツール風プロトタイプを作成したデザイナーやエンジニアが、社内承認者や開発チームにデザインレビューを依頼する際の手順書。ダミーデータ処理・社内ドメイン認証の設定・エンジニアが答えやすい設問の作り方を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "galileo-ai-lp-draft-review-url",
    "path": "/articles/galileo-ai-lp-draft-review-url",
    "title": "Galileo AIで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Galileo AIでLP案を生成し、承認者やマーケティングチームに素早くレビューを依頼したい担当者向け。Galileo AI固有のFigmaエクスポートとHTMLエクスポートの違い、競合情報を含むLP案のセキュアな共有手順、1往復で承認を取るための依頼文の書き方を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "galileo-ai-admin-mock-review-url",
    "path": "/articles/galileo-ai-admin-mock-review-url",
    "title": "Galileo AIで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "「FigmaのリンクはあるけどHTMLで触れない」という声は管理画面レビューでよく聞く悩みだ。Galileo AIで生成したダッシュボードや設定画面のモックをHTMLのまま共有し、エンジニア以外のメンバーがブラウザで確認できるURLを発行する手順をまとめた。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "galileo-ai-slide-html-review-url",
    "path": "/articles/galileo-ai-slide-html-review-url",
    "title": "Galileo AIで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Galileo AIで生成したFigmaデザインをHTMLスライドに変換し、社内外の関係者にURLで届けたいデザイナーやマーケター向け。変換後の表示崩れチェック・スライドナビゲーションの検証・認証と期限設定の考え方を解説し、レビューのスムーズな進め方を判断できる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "galileo-ai-form-page-review-url",
    "path": "/articles/galileo-ai-form-page-review-url",
    "title": "Galileo AIで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Galileo AIで生成したフォームUIデザインをHTML化してレビューURLを発行したいデザイナーやプロダクトマネージャー向け。送信先の無効化・マーケティングトラッカーの除去・フォームUXレビューに特化したフィードバック設問の設計を解説し、誤送信リスクなく外部レビュアーに届ける判断基準を提供する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "galileo-ai-internal-tool-prototype-review-url",
    "path": "/articles/galileo-ai-internal-tool-prototype-review-url",
    "title": "Galileo AIで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Galileo AIで作った社内ツール風プロトタイプの共有方法に悩むデザイナーやエンジニア向け。認証設定・公開前チェック・フィードバック回収の手順を具体的に解説し、安全なレビューURLの作り方が判断できる記事です。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "framer-ai-lp-draft-review-url",
    "path": "/articles/framer-ai-lp-draft-review-url",
    "title": "Framer AIで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Framer AIで生成したLP案を安全にレビューしてもらう方法を知りたいマーケターやデザイナー向け。HTML共有の落とし穴、認証設定の選び方、フィードバックの集め方を実例つきで解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "framer-ai-admin-mock-review-url",
    "path": "/articles/framer-ai-admin-mock-review-url",
    "title": "Framer AIで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "サイドバーやデータテーブルを含む管理画面は、静止画では操作感が伝わらない。Framer AIで作ったモックをZipで送らずに済む方法として、ギガサイト便で認証付きURLを即発行し、開発チームや事業部長に実際に触ってもらう手順を紹介する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "framer-ai-slide-html-review-url",
    "path": "/articles/framer-ai-slide-html-review-url",
    "title": "Framer AIで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "発表直前に「スライドが開けない」と言われると困る。Framer AIで作ったアニメーション入りHTMLスライドは環境依存が大きく、ファイル送付ではレビューが成立しにくい。ギガサイト便でURLを発行すれば、上司や同僚がそのままブラウザで確認できる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "framer-ai-form-page-review-url",
    "path": "/articles/framer-ai-form-page-review-url",
    "title": "Framer AIで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Framer AIで作ったフォーム付きページを安全に共有・レビューしたいデザイナーやマーケター向け。フォームの誤送信防止、認証設定の選び方、フィードバック収集の実践手順を解説した記事です。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "framer-ai-internal-tool-prototype-review-url",
    "path": "/articles/framer-ai-internal-tool-prototype-review-url",
    "title": "Framer AIで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "社内ツールのプロトタイプは「動かしてみて初めてわかる」ものが多い。Framer AIで生成した画面をHTMLのままレビューに回すとき、アップロードからURL発行まで数秒で完了するギガサイト便の使い方と、レビューサイクルを短縮するポイントを解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webflow-ai-lp-draft-review-url",
    "path": "/articles/webflow-ai-lp-draft-review-url",
    "title": "Webflow AIで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Webflow AIで生成したLP案のレビューURL共有方法に悩むWebディレクターやデザイナー向け。HTMLのチェックポイント、認証設定、フィードバック回収まで一貫した手順を解説する実践記事です。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webflow-ai-admin-mock-review-url",
    "path": "/articles/webflow-ai-admin-mock-review-url",
    "title": "Webflow AIで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Webflow AIで作った管理画面モックを安全にレビューに回したいUXデザイナーやプロダクトマネージャー向け。公開前チェック・アクセス制限・フィードバック収集まで実際の手順を具体的に解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webflow-ai-slide-html-review-url",
    "path": "/articles/webflow-ai-slide-html-review-url",
    "title": "Webflow AIで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "カスタムフォントやアニメーションを含むHTMLスライドは、ファイルを渡した先の環境で崩れることが珍しくない。Webflow AIの出力をそのまま環境依存なく届ける手段として、ギガサイト便で閲覧URLを発行する方法と注意点をまとめた。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webflow-ai-form-page-review-url",
    "path": "/articles/webflow-ai-form-page-review-url",
    "title": "Webflow AIで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Webflow AIで作ったフォーム付きページの誤送信リスクを防ぎながら安全にレビューしたいディレクターやマーケター向け。フォームの無効化手順・認証設定・フィードバック収集の方法を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webflow-ai-internal-tool-prototype-review-url",
    "path": "/articles/webflow-ai-internal-tool-prototype-review-url",
    "title": "Webflow AIで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Webflow AIで作った社内ツールプロトタイプを開発チームや事業部門にレビューしてもらいたいプロダクト担当者向け。安全な公開手順・アクセス制限・効率的なフィードバック回収の方法を具体的に解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "canva-code-lp-draft-review-url",
    "path": "/articles/canva-code-lp-draft-review-url",
    "title": "Canva Codeで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Canva CodeでLP案を作ったがレビュー共有方法がわからないWebデザイナーやマーケター向け。公開前のHTML確認手順・適切な認証設定・フィードバック収集のコツを具体的なステップで解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "canva-code-admin-mock-review-url",
    "path": "/articles/canva-code-admin-mock-review-url",
    "title": "Canva Codeで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "管理画面モックのレビューURLを安全に共有したいCanva Codeユーザー向け。認証方式の選び方・公開前の情報漏洩チェック・フィードバック回収まで一連の手順を整理し、次のアクションをすぐ決められる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "canva-code-slide-html-review-url",
    "path": "/articles/canva-code-slide-html-review-url",
    "title": "Canva Codeで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Canva Codeで作ったHTMLスライドを安全にレビュー共有したいユーザー向け。スライド特有のアニメーション確認・外部依存の検査・認証設定の判断基準を解説し、スムーズなフィードバック収集を実現できる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "canva-code-form-page-review-url",
    "path": "/articles/canva-code-form-page-review-url",
    "title": "Canva Codeで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Canva Codeで作ったフォーム付きページを安全にレビュー共有したいデザイナー・開発者向け。誤送信リスクの排除・フォームのaction属性確認・認証設定の選び方を具体的に解説し、安心してURLを渡せる状態を作れる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "canva-code-internal-tool-prototype-review-url",
    "path": "/articles/canva-code-internal-tool-prototype-review-url",
    "title": "Canva Codeで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Canva Codeで作った社内ツール風プロトタイプを安全にレビュー共有したいBizDevや情報システム担当者向け。社内情報を含むモックの情報漏洩リスクを下げる確認手順と、認証方式の具体的な選び方を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "create-xyz-lp-draft-review-url",
    "path": "/articles/create-xyz-lp-draft-review-url",
    "title": "Create.xyzで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Create.xyzで生成したLP初稿を社内外のレビュアーに安全に共有したい担当者向け。HTMLの事前確認ポイント・認証設定の判断基準・フィードバック収集の進め方を解説し、LP改善サイクルを速める方法がわかる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "create-xyz-admin-mock-review-url",
    "path": "/articles/create-xyz-admin-mock-review-url",
    "title": "Create.xyzで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Create.xyzで作った管理画面モックを安全・迅速にレビュー共有したい開発担当者やプロダクトマネージャー向け。情報漏洩リスクの排除から認証方式の選定まで実践的なステップを解説し、承認プロセスを加速させる方法がわかる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "create-xyz-slide-html-review-url",
    "path": "/articles/create-xyz-slide-html-review-url",
    "title": "Create.xyzで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Create.xyzで作ったHTMLスライドをPDFに変換せず動きのまま共有したい担当者向け。外部依存の確認・認証設定の選び方・フィードバック収集のコツを解説し、プレゼン資料のレビューを効率的に進める方法がわかる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "create-xyz-form-page-review-url",
    "path": "/articles/create-xyz-form-page-review-url",
    "title": "Create.xyzで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Create.xyzで作ったフォーム付きページをレビュー用URLとして安全に共有したいWeb担当者向け。送信先の確認・form属性の無効化・認証方式の選び方を実践的に解説し、誤送信リスクを排除した状態でフィードバックを集められる方法がわかる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "create-xyz-internal-tool-prototype-review-url",
    "path": "/articles/create-xyz-internal-tool-prototype-review-url",
    "title": "Create.xyzで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Create.xyzで作った社内ツールプロトタイプを情報漏洩リスクなく関係者にレビューさせたいPMやエンジニア向け。架空データの扱い・外部API呼び出しの無効化・認証設定の選び方を解説し、安心して承認プロセスを進める方法がわかる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "readdy-lp-draft-review-url",
    "path": "/articles/readdy-lp-draft-review-url",
    "title": "Readdyで生成したLP案をレビュー用URLにして共有する方法",
    "description": "ReaddyでLP初稿を生成して社内外のレビュアーに安全に共有したいマーケター・デザイナー向け。HTMLの事前チェック・認証設定の選び方・フィードバック回収の効率化まで、LP改善サイクルを加速する具体的な手順を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "readdy-admin-mock-review-url",
    "path": "/articles/readdy-admin-mock-review-url",
    "title": "Readdyで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Readdyで作った管理画面モックを関係者にインタラクティブなまま共有したいデザイナー・PMが対象。情報漏洩リスクの排除・外部依存の確認・認証設定の判断まで、管理画面特有の注意点を網羅的に解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "readdy-slide-html-review-url",
    "path": "/articles/readdy-slide-html-review-url",
    "title": "Readdyで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Readdyで作ったHTMLスライドをアニメーションを保ったまま関係者にレビューしてもらいたいデザイナーや企画担当者向け。外部フォントの安定化・認証設定の判断・フィードバック収集の進め方を解説し、スライドレビューを効率化する方法がわかる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "readdy-form-page-review-url",
    "path": "/articles/readdy-form-page-review-url",
    "title": "Readdyで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Readdyで生成したフォーム付きHTMLページを安全に共有したいデザイナーや開発者向け。公開範囲・認証方式・期限の選び方からフィードバック依頼のコツまで、レビュー用URL運用の判断基準を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "readdy-internal-tool-prototype-review-url",
    "path": "/articles/readdy-internal-tool-prototype-review-url",
    "title": "Readdyで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Readdyで作った社内ツール風プロトタイプを安全にレビュー共有したい方向け。ダミーデータの除去方法・認証設定の選択基準・フィードバック依頼の具体手順を解説し、承認フローを効率化する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "durable-ai-lp-draft-review-url",
    "path": "/articles/durable-ai-lp-draft-review-url",
    "title": "Durable AIで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Durable AIで生成したLP草案をクライアントや社内レビュアーに安全に見せたい方向け。公開前の注意点・認証方式の選び方・効率よくOKをもらうフィードバック運用のポイントを解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "durable-ai-admin-mock-review-url",
    "path": "/articles/durable-ai-admin-mock-review-url",
    "title": "Durable AIで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Durable AIで作った管理画面モックを開発チームや発注者に安全にレビュー共有したい方向け。ダミーデータの扱い・API呼び出しの無効化・会社ドメイン認証の活用まで、社内共有の実務手順を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "durable-ai-slide-html-review-url",
    "path": "/articles/durable-ai-slide-html-review-url",
    "title": "Durable AIで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "相手のPCでHTMLが正しく開かない、という問題はプレゼン前に何度も遭遇する。Durable AIが出力するブラウザ動作型スライドは、URLで共有するのが最も確実で、ギガサイト便を使えばデザインチェックや上長確認を発表直前までスムーズに回せる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "durable-ai-form-page-review-url",
    "path": "/articles/durable-ai-form-page-review-url",
    "title": "Durable AIで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "問い合わせや申し込みフローを含むページは、画面キャプチャだけでは操作感の確認ができない。Durable AIで生成したフォーム付きページを認証付きURLで届けることで、フォームの入力・送信・エラー表示をレビュアーに直接体験してもらう方法を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "durable-ai-internal-tool-prototype-review-url",
    "path": "/articles/durable-ai-internal-tool-prototype-review-url",
    "title": "Durable AIで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "検索・フィルター・データ表示のインタラクションは、触れてみるまで良否が判断できない。Durable AIが生成した社内ツール風プロトタイプをURLで共有し、現場担当者や経営層が開発着手前にブラウザで評価できる環境を整える具体的な手順を紹介する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dora-ai-lp-draft-review-url",
    "path": "/articles/dora-ai-lp-draft-review-url",
    "title": "Dora AIで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Dora AIで生成したLP草案のレビューを効率化したいWebデザイナーやマーケター向け。動的コンテンツの公開前チェック・認証設定の判断基準・アニメーションを含むLPならではのフィードバック依頼法を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dora-ai-admin-mock-review-url",
    "path": "/articles/dora-ai-admin-mock-review-url",
    "title": "Dora AIで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "複数画面にまたがる管理画面モックは、エンジニア以外の承認者が画面遷移を追えないと判断が遅れる。Dora AIで生成したUIをURL化してフィードバックをブラウザ操作ごともらう方法と、承認フローを短縮するためのポイントをまとめた。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dora-ai-slide-html-review-url",
    "path": "/articles/dora-ai-slide-html-review-url",
    "title": "Dora AIで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "ページ遷移アニメーションはファイルでは再現されず、URLで見てもらうのが唯一の方法だ。Dora AIが出力するHTMLスライドを発表前のコンテンツチェックや社内レビューで使うために、ギガサイト便で認証付きURLを発行する手順を具体的に説明する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dora-ai-form-page-review-url",
    "path": "/articles/dora-ai-form-page-review-url",
    "title": "Dora AIで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "PDFやスクショでは、ドロップダウンの挙動やバリデーションメッセージは確認できない。Dora AIで生成したフォーム付きページをレビュアーが実際に操作できる形で届けるには、ギガサイト便で発行する認証付きURLが最短ルートになる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dora-ai-internal-tool-prototype-review-url",
    "path": "/articles/dora-ai-internal-tool-prototype-review-url",
    "title": "Dora AIで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "使い勝手の判断は触ってみるまでわからない。Dora AIが出力した社内ツール風プロトタイプを開発着手前に現場や経営層へ届け、ブラウザ上で直接フィードバックを集めるためのURL発行手順と、収集したコメントを整理するコツを解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "relume-lp-draft-review-url",
    "path": "/articles/relume-lp-draft-review-url",
    "title": "Relumeで生成したLP案をレビュー用URLにして共有する方法",
    "description": "RelumeのLP案をHTMLごと安全に共有したいデザイナー向け。添付ファイル問題やログイン不要URL化の落とし穴を整理し、パスワード・期限設定まで含めた確認フローを解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "relume-admin-mock-review-url",
    "path": "/articles/relume-admin-mock-review-url",
    "title": "Relumeで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Relumeで作った管理画面モックを開発チームや上長にレビューしてもらいたい担当者向け。共有前の情報漏えい確認からページ遷移の動作保証、認証設定の選び方まで実務的に解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "relume-slide-html-review-url",
    "path": "/articles/relume-slide-html-review-url",
    "title": "Relumeで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "RelumeのHTMLスライドを提案前にクライアントや上長に共有したい人向け。スライドのページ送り動作を壊さずURL化する手順と、フィードバック収集の効率化まで具体的に解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "relume-form-page-review-url",
    "path": "/articles/relume-form-page-review-url",
    "title": "Relumeで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Relumeで作ったフォーム付きページをクライアントや社内にレビューしてもらいたい人向け。誤送信リスクの排除方法から、認証・期限設定の実務的な判断基準まで解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "relume-internal-tool-prototype-review-url",
    "path": "/articles/relume-internal-tool-prototype-review-url",
    "title": "Relumeで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Relumeで作った社内ツール風プロトタイプを業務担当者に触れてもらいたい担当者向け。ローカルサーバー不要でURLを発行する方法と、社内限定公開のための認証設定を実務的に解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wix-ai-lp-draft-review-url",
    "path": "/articles/wix-ai-lp-draft-review-url",
    "title": "Wix AIで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Wix AIで生成したLP案を本番公開前にレビューしてもらいたい担当者向け。Wixの公開設定と外部プレビューURLの違いを整理し、安全に共有するための手順と認証設定を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wix-ai-admin-mock-review-url",
    "path": "/articles/wix-ai-admin-mock-review-url",
    "title": "Wix AIで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Wix AIで作った管理画面モックを上長や開発チームに閲覧専用で共有したい担当者向け。Wixエディタを渡さずにレビューURLを発行する方法と、社内向け認証の設定方法を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wix-ai-slide-html-review-url",
    "path": "/articles/wix-ai-slide-html-review-url",
    "title": "Wix AIで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Wix AIで作ったHTMLスライドを外部の関係者に共有したい担当者向け。Wixのプレビューリンクの限界を整理し、ページ送り動作を保ったままURL化する方法と安全な共有設定を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wix-ai-form-page-review-url",
    "path": "/articles/wix-ai-form-page-review-url",
    "title": "Wix AIで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "「送信ボタンを押してしまったが大丈夫か」という問い合わせは、Wixフォームの外部レビューで必ずといっていいほど起きる。本番連携を切らずに安全なプレビュー環境を渡す方法として、HTMLエクスポートとギガサイト便を組み合わせる手順を紹介する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wix-ai-internal-tool-prototype-review-url",
    "path": "/articles/wix-ai-internal-tool-prototype-review-url",
    "title": "Wix AIで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Wix AIで作った社内ツール風プロトタイプを業務担当者に安全に体験してもらいたい担当者向け。Wixの権限設定に依存せずに閲覧専用URLを発行する方法と、社内限定公開の設定を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "squarespace-ai-lp-draft-review-url",
    "path": "/articles/squarespace-ai-lp-draft-review-url",
    "title": "Squarespace AIで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Squarespace AIで作ったLP案をクライアントや社内にレビューしてもらいたい担当者向け。Squarespaceの共有機能の限界を整理し、HTMLとして切り出してURLを発行するまでの手順と注意点を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "squarespace-ai-admin-mock-review-url",
    "path": "/articles/squarespace-ai-admin-mock-review-url",
    "title": "Squarespace AIで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Squarespace AIで作った管理画面モックを開発チームや上長にレビューしてもらいたい担当者向け。Squarespaceの権限設定に依存しない閲覧専用URLの発行方法と、認証・期限の設定基準を解説します。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "squarespace-ai-slide-html-review-url",
    "path": "/articles/squarespace-ai-slide-html-review-url",
    "title": "Squarespace AIで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Squarespace AIで作ったHTMLスライドを安全にレビュー共有したいWeb担当者向け。公開前の確認手順・認証設定・フィードバック回収のコツまで、実務に即した手順を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "squarespace-ai-form-page-review-url",
    "path": "/articles/squarespace-ai-form-page-review-url",
    "title": "Squarespace AIで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Squarespace AIが出力したフォーム付きHTMLページのレビューに困っているデザイナーや担当者向け。フォームのaction設定・送信先の確認・認証URLの作り方を具体的に説明する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "squarespace-ai-internal-tool-prototype-review-url",
    "path": "/articles/squarespace-ai-internal-tool-prototype-review-url",
    "title": "Squarespace AIで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "「ローカルでは動くのにZipで送ると壊れる」「SlackのHTMLが開けない」は社内レビューで繰り返される定番トラブルだ。Squarespace AIで作ったプロトタイプを特定メンバーだけに素早く届けるための、ギガサイト便を使った安全な共有手順をまとめた。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wordpress-ai-lp-draft-review-url",
    "path": "/articles/wordpress-ai-lp-draft-review-url",
    "title": "WordPress AIで生成したLP案をレビュー用URLにして共有する方法",
    "description": "WordPress AIが出力したLP案を、ステージング環境なしでクライアントにレビューさせたいWeb制作者向け。公開前の注意点・パスワード認証の設定・フィードバック収集のコツを解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wordpress-ai-admin-mock-review-url",
    "path": "/articles/wordpress-ai-admin-mock-review-url",
    "title": "WordPress AIで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "WordPress AIで作成した管理画面モックをHTMLで安全にレビュー共有したい開発担当者向け。情報漏洩防止・認証設定・フィードバック効率化の具体的な手順を紹介する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wordpress-ai-slide-html-review-url",
    "path": "/articles/wordpress-ai-slide-html-review-url",
    "title": "WordPress AIで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "ZipをメールやSlackで送っても「開き方がわからない」と返ってくるのはHTMLスライド特有の壁だ。WordPress AIで生成したスライドを取引先や社内レビュアーにブラウザですぐ確認してもらうため、ギガサイト便でURLを発行する具体的な手順を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wordpress-ai-form-page-review-url",
    "path": "/articles/wordpress-ai-form-page-review-url",
    "title": "WordPress AIで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "WordPress AIが出力したフォーム付きHTMLページのレビューURLを安全に共有したいWeb制作者向け。フォームaction・個人情報の処理・認証方式の選択について具体的に解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wordpress-ai-internal-tool-prototype-review-url",
    "path": "/articles/wordpress-ai-internal-tool-prototype-review-url",
    "title": "WordPress AIで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "WordPress AIが生成した社内ツールプロトタイプのHTMLを、開発前にチームメンバーにレビューさせたい担当者向け。社内情報の管理・認証設定・フィードバック収集の実務的な手順を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "elementor-ai-lp-draft-review-url",
    "path": "/articles/elementor-ai-lp-draft-review-url",
    "title": "Elementor AIで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Elementor AIで作ったLP案を、WordPressなしでクライアントにプレビューさせたいWeb制作者向け。Elementor特有のCSS問題・認証設定・フィードバック収集のポイントを解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "elementor-ai-admin-mock-review-url",
    "path": "/articles/elementor-ai-admin-mock-review-url",
    "title": "Elementor AIで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Elementor AIで作成した管理画面モックHTMLを発注者や社内チームに安全にレビューさせたい担当者向け。情報セキュリティ上の確認点・認証の選び方・フィードバック効率化の実務ポイントを解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "elementor-ai-slide-html-review-url",
    "path": "/articles/elementor-ai-slide-html-review-url",
    "title": "Elementor AIで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Elementor AIで作成したHTMLスライドをプレゼン前に関係者へレビューさせたいデザイナーや制作者向け。ファイル共有の問題点・URL発行の手順・認証と期限の設定を具体的に説明する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "elementor-ai-form-page-review-url",
    "path": "/articles/elementor-ai-form-page-review-url",
    "title": "Elementor AIで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Elementor AIが出力したフォーム付きHTMLページのレビューを安全・迅速に共有したいWeb制作者や担当者向け。フォームが動かない理由・事前確認の手順・フィードバックを効率的に集める方法を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "elementor-ai-internal-tool-prototype-review-url",
    "path": "/articles/elementor-ai-internal-tool-prototype-review-url",
    "title": "Elementor AIで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "社内ツール風プロトタイプをElementor AIで生成したデザイナー・エンジニア向け。Slack貼り付け用URLを即発行し、認証・期限・フィードバック回収まで一気に片付ける手順を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "builder-io-visual-copilot-lp-draft-review-url",
    "path": "/articles/builder-io-visual-copilot-lp-draft-review-url",
    "title": "Builder.io Visual Copilotで生成したLP案をレビュー用URLにして共有する方法",
    "description": "FigmaからLP案を自動生成できても、その成果物をどう関係者に届けるかは別の課題になる。Builder.io Visual CopilotのHTML出力を環境崩れなく共有し、マーケターやディレクターが即座にブラウザで確認できるURL発行の手順を説明する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "builder-io-visual-copilot-admin-mock-review-url",
    "path": "/articles/builder-io-visual-copilot-admin-mock-review-url",
    "title": "Builder.io Visual Copilotで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "データテーブルやモーダルが絡む管理画面のHTMLをメール添付すると、開く環境によってレイアウトが崩れる問題が起きやすい。Builder.io Visual Copilotの生成物を迅速に共有するため、ギガサイト便で認証付きURLを発行する方法と落とし穴を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "builder-io-visual-copilot-slide-html-review-url",
    "path": "/articles/builder-io-visual-copilot-slide-html-review-url",
    "title": "Builder.io Visual Copilotで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "PowerPointのように添付送信できないHTMLスライドは、「どう相手に見せるか」が毎回悩みになる。Builder.io Visual Copilotでデザインしたインタラクティブなプレゼンを、GitHubアクセスがない相手にも即共有するためのURL発行手順を紹介する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "builder-io-visual-copilot-form-page-review-url",
    "path": "/articles/builder-io-visual-copilot-form-page-review-url",
    "title": "Builder.io Visual Copilotで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "フォームの送信先が未設定のまま渡すと「エラーになる」という誤解をレビュアーに与えやすい。Builder.io Visual Copilotで生成したフォーム付きページをURL発行する際に確認すべきポイントと、ギガサイト便で安全に共有する具体的な手順をまとめた。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "builder-io-visual-copilot-internal-tool-prototype-review-url",
    "path": "/articles/builder-io-visual-copilot-internal-tool-prototype-review-url",
    "title": "Builder.io Visual Copilotで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "完成度が低い段階でも早めに方向性を確認したいのがプロトタイプレビューの本音だ。Builder.io Visual Copilotの社内ツール風出力をSlackに貼っても崩れる問題を回避し、関係者がフィードバックを返しやすい環境をURLで整える手順を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "claude-apps-lp-draft-review-url",
    "path": "/articles/claude-apps-lp-draft-review-url",
    "title": "Claude Appsで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Claude AppsでLP案を生成したマーケター・デザイナー向け。ArtifactsのHTML出力を3分でレビュー用URLにする方法と、クライアント共有時のパスワード設定・フィードバック回収の実践ノウハウを解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "claude-apps-admin-mock-review-url",
    "path": "/articles/claude-apps-admin-mock-review-url",
    "title": "Claude Appsで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Claude Appsで管理画面モックを生成したPdM・エンジニア向け。モック特有のダミーデータ管理・社内アクセス制御・スプリントに合わせた期限設定・フィードバック収集の実践的な進め方を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "claude-apps-slide-html-review-url",
    "path": "/articles/claude-apps-slide-html-review-url",
    "title": "Claude Appsで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Claude AppsのArtifactsでHTMLスライドを生成した発表者向け。スライドの事前レビュー共有・発表当日の限定公開・終了後の一般公開URL切り替えまで、スライド共有の全フローを解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "claude-apps-form-page-review-url",
    "path": "/articles/claude-apps-form-page-review-url",
    "title": "Claude Appsで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Claude Appsでフォーム付きページを生成したマーケター・Webデザイナー向け。フォーム無効化の方法・個人情報リスクへの対処・パスワード認証の設定から差し替え運用までを実践的に解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "claude-apps-internal-tool-prototype-review-url",
    "path": "/articles/claude-apps-internal-tool-prototype-review-url",
    "title": "Claude Appsで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Claude Appsで社内ツール風プロトタイプを生成したPdM・エンジニア向け。プロトタイプの共有URL発行からAPIモック処理・会社ドメイン認証・フィードバック収集の実践的な手順を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "chatgpt-agent-lp-draft-review-url",
    "path": "/articles/chatgpt-agent-lp-draft-review-url",
    "title": "ChatGPT Agentで生成したLP案をレビュー用URLにして共有する方法",
    "description": "ChatGPT AgentでLP案のHTMLを生成したマーケター・Webデザイナー向け。生成HTMLの公開前チェック・パスワード認証の設定から、クライアントへの提案フローとフィードバック回収の実践手順を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "chatgpt-agent-admin-mock-review-url",
    "path": "/articles/chatgpt-agent-admin-mock-review-url",
    "title": "ChatGPT Agentで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "管理画面モックのHTMLを社内外のレビュアーに素早く届けたいデザイナーや企画担当者向け。共有前の安全チェックから認証方法の選び方まで、迷わず判断できる手順をまとめた記事です。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "chatgpt-agent-slide-html-review-url",
    "path": "/articles/chatgpt-agent-slide-html-review-url",
    "title": "ChatGPT Agentで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "ChatGPT AgentでHTMLスライドを作ったが社内外に素早くレビューさせたい担当者向け。安全確認から認証設定・フィードバック回収まで、スライド特有の注意点を押さえて判断できるようにまとめた記事です。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "chatgpt-agent-form-page-review-url",
    "path": "/articles/chatgpt-agent-form-page-review-url",
    "title": "ChatGPT Agentで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "ChatGPT Agentで作ったフォーム付きページを関係者にレビューさせたいウェブ担当者向け。form actionの確認から認証設定・フィードバック依頼のコツまで、フォーム特有のリスクを踏まえて判断できるようまとめた記事です。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "chatgpt-agent-internal-tool-prototype-review-url",
    "path": "/articles/chatgpt-agent-internal-tool-prototype-review-url",
    "title": "ChatGPT Agentで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "ChatGPT Agentで社内ツールのプロトタイプを作り、関係部署にレビューさせたい企画担当者向け。機密データの扱いから認証設定・フィードバックの引き出し方まで、社内ツール固有のリスクを踏まえて判断できるようにまとめています。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gemini-cli-lp-draft-review-url",
    "path": "/articles/gemini-cli-lp-draft-review-url",
    "title": "Gemini CLIで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Gemini CLIで生成したLP案をクライアントや社内担当者にレビューさせたいウェブ担当者向け。公開前の安全チェックから認証方式・フィードバック依頼のポイントまで、LP特有の注意点を踏まえて判断できるようにまとめた記事です。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gemini-cli-admin-mock-review-url",
    "path": "/articles/gemini-cli-admin-mock-review-url",
    "title": "Gemini CLIで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "コマンド一行で管理画面のHTMLモックが手に入っても、チームへの届け方が決まっていないとレビューが止まる。Gemini CLIの出力物をファイルでなくURLで渡すことで、実際のブラウザ描画を全員が確認できるようにする手順とメリットを紹介する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gemini-cli-slide-html-review-url",
    "path": "/articles/gemini-cli-slide-html-review-url",
    "title": "Gemini CLIで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "会議前に急いで作ったHTMLスライドを、ファイルの受け渡しなしにすぐ見てもらいたい。Gemini CLIが生成したブラウザ動作型プレゼンをチームにフィードバックしてもらうまでの最短ルートとして、ギガサイト便でURL発行する具体的な手順を説明する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gemini-cli-form-page-review-url",
    "path": "/articles/gemini-cli-form-page-review-url",
    "title": "Gemini CLIで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "入力UIとバリデーションが1ファイルに収まったフォームは、実際に操作してもらわないと改善提案がもらいにくい。Gemini CLIで生成したフォーム付きページを動作確認できる形で共有するためのURL発行手順と、レビュー依頼時の伝え方のコツをまとめた。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gemini-cli-internal-tool-prototype-review-url",
    "path": "/articles/gemini-cli-internal-tool-prototype-review-url",
    "title": "Gemini CLIで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Gemini CLIで社内ツールのプロトタイプを作り、開発前に関係部署の承認を得たい担当者向け。機密データのチェックから部署別の閲覧制限・フィードバック収集のコツまで、社内ツール共有特有のリスクを踏まえてまとめた記事です。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "codex-cli-lp-draft-review-url",
    "path": "/articles/codex-cli-lp-draft-review-url",
    "title": "Codex CLIで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Codex CLIで生成したLP案を社内外の担当者にすぐにレビューさせたいウェブ担当者向け。公開前の安全確認から認証方式・フィードバック収集まで、LP特有の観点で迷わず判断できるようまとめた記事です。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "codex-cli-admin-mock-review-url",
    "path": "/articles/codex-cli-admin-mock-review-url",
    "title": "Codex CLIで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "CRUD操作UIのひな形はCodex CLIで素早く出せても、コードリポジトリへのアクセス権がないステークホルダーには届けにくい。生成したモックを誰でもブラウザで開けるURLとして共有し、確認サイクルを短縮する方法を具体的に解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "codex-cli-slide-html-review-url",
    "path": "/articles/codex-cli-slide-html-review-url",
    "title": "Codex CLIで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "AIが出力したHTMLスライドをそのまま送っても「ブラウザで崩れた」と返ってくる経験はないだろうか。Codex CLI生成のスライドをURLに変換して確実にレビューしてもらう手順を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "codex-cli-form-page-review-url",
    "path": "/articles/codex-cli-form-page-review-url",
    "title": "Codex CLIで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Codex CLIで作ったフォーム付きHTMLをレビュー用URLで共有したい開発者向け。外部送信先のチェック方法から認証方式の選び方まで、安全に公開する手順を判断できる記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "codex-cli-internal-tool-prototype-review-url",
    "path": "/articles/codex-cli-internal-tool-prototype-review-url",
    "title": "Codex CLIで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Codex CLIが生成した社内ツール風プロトタイプをURLで共有したいエンジニアや企画担当者向け。内部情報の流出リスクを抑えながら関係者レビューを進める方法が判断できる記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "claude-code-lp-draft-review-url",
    "path": "/articles/claude-code-lp-draft-review-url",
    "title": "Claude Codeで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Claude CodeでLP案を生成してレビューURLで共有したいマーケターや開発者向け。外部埋め込みや個人情報の事前確認から認証設定まで、安全に公開する判断基準がわかる記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "claude-code-admin-mock-review-url",
    "path": "/articles/claude-code-admin-mock-review-url",
    "title": "Claude Codeで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "管理画面モックをHTMLで渡しても「CSSが当たらなかった」と言われて終わり——そんな無駄を減らしたい人向けに、Claude Code生成モックをワンクリックで確認できるURLに変える方法をまとめた。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "claude-code-slide-html-review-url",
    "path": "/articles/claude-code-slide-html-review-url",
    "title": "Claude Codeで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Claude CodeでHTMLスライドを生成してURLで共有したいエンジニアや企画担当者向け。スライドライブラリの依存関係の扱いや認証設定の判断基準がわかり、すぐに共有できるようになる記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "claude-code-form-page-review-url",
    "path": "/articles/claude-code-form-page-review-url",
    "title": "Claude Codeで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "フォーム付きページをクライアントに見せるとき、HTMLファイルを渡すと「開き方が分からない」と返ってくることがある。Claude Code生成のページをすぐ確認できるURLにして、レビューの往復を減らす手順を紹介する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "claude-code-internal-tool-prototype-review-url",
    "path": "/articles/claude-code-internal-tool-prototype-review-url",
    "title": "Claude Codeで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "「ローカルで動いているものをチームに見せたい」という場面で詰まる人は多い。Claude Codeで作った社内ツールプロトタイプを環境依存ゼロのURLで共有するまでの流れを具体的に説明する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cursor-agent-lp-draft-review-url",
    "path": "/articles/cursor-agent-lp-draft-review-url",
    "title": "Cursor Agentで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Cursor AgentでLP案を生成してレビュー用URLで共有したい開発者向け。非公開コンテンツを安全に届けるための確認事項と認証設定の選び方を整理し、クライアントへの提出をスムーズにする記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cursor-agent-admin-mock-review-url",
    "path": "/articles/cursor-agent-admin-mock-review-url",
    "title": "Cursor Agentで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Cursor Agentが数分で吐き出した管理画面モックを、Slackに貼るだけで相手が確認できる状態にするにはどうすればいいか。ファイル送付やローカルサーバーに頼らずURLを発行する方法をステップ別に解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cursor-agent-slide-html-review-url",
    "path": "/articles/cursor-agent-slide-html-review-url",
    "title": "Cursor Agentで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Cursor AgentでHTMLスライドを生成してURLで共有したいエンジニアや企画担当者向け。スライドライブラリのファイル依存関係や認証設定を理解し、相手が確認しやすい形で共有できるようになる記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cursor-agent-form-page-review-url",
    "path": "/articles/cursor-agent-form-page-review-url",
    "title": "Cursor Agentで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Cursor Agentで作ったフォーム付きHTMLページをURLで共有してレビューしてもらいたい開発者や担当者向け。フォームの誤送信防止と認証設定の選択基準がわかり、スムーズなフィードバック収集ができるようになる記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cursor-agent-internal-tool-prototype-review-url",
    "path": "/articles/cursor-agent-internal-tool-prototype-review-url",
    "title": "Cursor Agentで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Cursor Agentが生成した社内ツール風プロトタイプを安全なURLで共有したいエンジニア向け。内部情報の扱い方から認証設定まで整理し、チームや承認者へのレビュー依頼をスムーズに進めるための記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "windsurf-agent-lp-draft-review-url",
    "path": "/articles/windsurf-agent-lp-draft-review-url",
    "title": "Windsurf Agentで生成したLP案をレビュー用URLにして共有する方法",
    "description": "WindsurfでAI生成したLPのHTMLを外部共有したいデザイナーや開発者向けに、公開前チェックから認証設定・フィードバック回収まで、つまずきポイントを具体的に解説する記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "windsurf-agent-admin-mock-review-url",
    "path": "/articles/windsurf-agent-admin-mock-review-url",
    "title": "Windsurf Agentで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Windsurf Agentで作った管理画面モックのHTMLを安全にURL公開したいエンジニアやPM向けに、内部情報の漏洩リスクを下げながらレビューURLを発行するための具体的な手順を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "windsurf-agent-slide-html-review-url",
    "path": "/articles/windsurf-agent-slide-html-review-url",
    "title": "Windsurf Agentで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "WindsurfでAI生成したHTMLスライドをURL公開してレビューを受けたい人向けに、ファイル依存関係の整理・認証設定・フィードバック収集の具体的な手順を説明する記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "windsurf-agent-form-page-review-url",
    "path": "/articles/windsurf-agent-form-page-review-url",
    "title": "Windsurf Agentで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "WindsurfでAI生成したフォーム付きHTMLページを安全にレビュー共有したいエンジニア向けに、送信処理の無効化・認証設定・フィードバック収集の手順を具体的に解説する記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "windsurf-agent-internal-tool-prototype-review-url",
    "path": "/articles/windsurf-agent-internal-tool-prototype-review-url",
    "title": "Windsurf Agentで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Windsurf Agentで作った社内ツール風プロトタイプをセキュアにURLで共有したいエンジニアやデザイナー向けに、内部情報の管理・会社ドメイン認証の活用・レビュー収集の流れを具体的に解説する記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "replit-agent-lp-draft-review-url",
    "path": "/articles/replit-agent-lp-draft-review-url",
    "title": "Replit Agentで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Replit AgentでAI生成したLPのHTMLを、Replitに依存しない安定したURLで外部レビューしたいデザイナーや営業担当者向けに、ファイル準備から認証設定・フィードバック回収まで手順を解説する記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "replit-agent-admin-mock-review-url",
    "path": "/articles/replit-agent-admin-mock-review-url",
    "title": "Replit Agentで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Replit Agentで作った管理画面モックのHTMLを安全にURL共有したいPMやエンジニア向けに、Replit特有の依存解消・認証設定・フィードバック収集のステップを具体的に解説する記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "replit-agent-slide-html-review-url",
    "path": "/articles/replit-agent-slide-html-review-url",
    "title": "Replit Agentで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Replit AgentでAI生成したHTMLスライドを動作確認付きでレビュー共有したいプレゼン担当者やエンジニア向けに、Replit依存の解消・公開前チェック・認証設定の手順を具体的に解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "replit-agent-form-page-review-url",
    "path": "/articles/replit-agent-form-page-review-url",
    "title": "Replit Agentで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Replit AgentでAI生成したフォーム付きHTMLページをレビュー目的でURL共有したい開発者向けに、送信モック化・認証設定・フィードバック収集の具体的な方法を解説する記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "replit-agent-internal-tool-prototype-review-url",
    "path": "/articles/replit-agent-internal-tool-prototype-review-url",
    "title": "Replit Agentで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Replit Agentで作った社内ツール風プロトタイプを社内だけに安全共有したいエンジニアやPM向けに、Replit依存の解消から会社ドメイン認証・レビュー収集まで一連の手順を具体的に解説する記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "base44-lp-draft-review-url",
    "path": "/articles/base44-lp-draft-review-url",
    "title": "Base44で生成したLP案をレビュー用URLにして共有する方法",
    "description": "Base44でAI生成したLPのHTMLを外部クライアントに安全にレビュー共有したいマーケターやデザイナー向けに、Base44からのエクスポート・認証設定・フィードバック収集の具体的な手順を解説する記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "base44-admin-mock-review-url",
    "path": "/articles/base44-admin-mock-review-url",
    "title": "Base44で生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Base44でAI生成した管理画面モックのHTMLをセキュアにURL共有したいエンジニアやプロダクトマネージャー向けに、Base44からのHTML抽出・認証設定・フィードバック収集の手順を具体的に説明する記事。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "base44-slide-html-review-url",
    "path": "/articles/base44-slide-html-review-url",
    "title": "Base44で生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Base44生成のHTMLスライドを社外レビュアーに見せたい人向け。公開前の確認ポイント・認証方式の選び方・フィードバック回収の段取りを具体的に解説し、共有方法を判断できるようにする。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "base44-form-page-review-url",
    "path": "/articles/base44-form-page-review-url",
    "title": "Base44で生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Base44で作ったフォーム付きHTMLページをレビュー用に安全に共有したい人向け。送信先の確認・認証設定・フィードバック依頼のポイントを整理し、安全な共有手順を判断できるようにする。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "base44-internal-tool-prototype-review-url",
    "path": "/articles/base44-internal-tool-prototype-review-url",
    "title": "Base44で生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Base44で作った社内ツール風プロトタイプを関係者に安全にレビューさせたい人向け。情報漏洩リスクの確認・適切な認証設定・操作フィードバックの集め方を解説し、公開範囲を正しく判断できるようにする。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dify-lp-draft-review-url",
    "path": "/articles/dify-lp-draft-review-url",
    "title": "Difyで生成したLP案をレビュー用URLにして共有する方法",
    "description": "DifyでAI生成したLP案のHTMLをレビュー用URLにして安全に共有したい人向け。公開前チェック・認証の選び方・効率的なフィードバック収集の手順を解説し、スムーズなレビュー運用を実現できるようにする。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dify-admin-mock-review-url",
    "path": "/articles/dify-admin-mock-review-url",
    "title": "Difyで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Difyで生成した管理画面モックHTMLをレビュー用に共有したい人向け。公開前の内部リンク・モックデータの確認から認証設定・フィードバック収集まで一連の手順を解説し、安全な共有判断ができるようにする。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dify-slide-html-review-url",
    "path": "/articles/dify-slide-html-review-url",
    "title": "Difyで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "DifyでAI生成したHTMLスライドを社外レビュアーに素早く届けたい人向け。スライド特有の共有リスク・URL発行前の確認手順・期限と認証の設定方針を具体的に説明し、安全な共有手順を選べるようにする。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dify-form-page-review-url",
    "path": "/articles/dify-form-page-review-url",
    "title": "Difyで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "DifyでAI生成したフォーム付きページをレビュー用URLにして安全に共有したい人向け。送信先エンドポイントの処理・認証の選択・フィードバック収集の方法を具体的に説明し、安全な共有を実現できるようにする。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dify-internal-tool-prototype-review-url",
    "path": "/articles/dify-internal-tool-prototype-review-url",
    "title": "Difyで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Difyで組んだ社内ツールUIは操作してみないと価値が伝わらない。外部共有不可のDify URLや依存ライブラリ問題を回避しつつ、プロトタイプをそのままプレビューURLに変換する方法をまとめた。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "n8n-ai-lp-draft-review-url",
    "path": "/articles/n8n-ai-lp-draft-review-url",
    "title": "n8n AIワークフローで生成したLP案をレビュー用URLにして共有する方法",
    "description": "ワークフローが高速にLP案を量産するほど、「どのファイルが最新版か」という混乱が増す。n8n生成のHTMLをバージョン管理しながらレビュー用URLに変換し、フィードバックの行き違いをなくす方法を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "n8n-ai-admin-mock-review-url",
    "path": "/articles/n8n-ai-admin-mock-review-url",
    "title": "n8n AIワークフローで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Slackに新しいファイルが流れるたびに「これ最新版？」と聞かれる状況を脱したい担当者向け。n8n AIワークフローが繰り返し生成する管理画面モックを、常に最新URLで共有し続ける運用フローを紹介する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "n8n-ai-slide-html-review-url",
    "path": "/articles/n8n-ai-slide-html-review-url",
    "title": "n8n AIワークフローで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "プロンプト調整のたびにファイルを送り直して版が混乱する——n8nでHTMLスライドを量産しているなら一度は経験する問題だ。レビュアーに常に正しい版を届けるURL共有の仕組みを具体的に説明する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "n8n-ai-form-page-review-url",
    "path": "/articles/n8n-ai-form-page-review-url",
    "title": "n8n AIワークフローで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "n8nワークフローとWebhookが繋がったフォームページをそのまま共有すると、レビュアーの操作が実データに影響することがある。安全にプレビューさせるためのURL発行手順と注意点を整理した。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "n8n-ai-internal-tool-prototype-review-url",
    "path": "/articles/n8n-ai-internal-tool-prototype-review-url",
    "title": "n8n AIワークフローで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "n8nのAIワークフローで生成した社内ツール風プロトタイプを安全にレビュー共有したい人向け。公開前の情報漏えいチェックから認証方式の選び方、フィードバック収集の段取りまで判断できる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zapier-interfaces-lp-draft-review-url",
    "path": "/articles/zapier-interfaces-lp-draft-review-url",
    "title": "Zapier Interfacesで生成したLP案をレビュー用URLにして共有する方法",
    "description": "Zapier InterfacesのAI機能で作成したLP案を、検索に引っかからず特定の相手だけに安全に見せたい人向け。公開前チェックから認証付きURL発行、フィードバック依頼のコツまで一通り判断できる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zapier-interfaces-admin-mock-review-url",
    "path": "/articles/zapier-interfaces-admin-mock-review-url",
    "title": "Zapier Interfacesで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "Zapier Interfacesで作った管理画面モックを関係者にURLで見せたい開発者・デザイナー向け。仮データの扱い方、認証方式の選択基準、フィードバックを操作ベースで集める方法が分かる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zapier-interfaces-slide-html-review-url",
    "path": "/articles/zapier-interfaces-slide-html-review-url",
    "title": "Zapier Interfacesで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "Zapier InterfacesのAIで生成したHTMLスライドを、社内外の関係者にURLで見せてフィードバックを得たいプレゼン担当者向け。公開前の動作確認から認証設定・コメント収集の段取りまで分かる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zapier-interfaces-form-page-review-url",
    "path": "/articles/zapier-interfaces-form-page-review-url",
    "title": "Zapier Interfacesで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Zapier Interfacesで作成したフォーム付きページのレビュー用URLを安全に発行したい担当者向け。フォームのsubmit先の無害化手順、認証の選び方、入力体験へのフィードバックを引き出す方法が分かる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zapier-interfaces-internal-tool-prototype-review-url",
    "path": "/articles/zapier-interfaces-internal-tool-prototype-review-url",
    "title": "Zapier Interfacesで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "Zapier Interfacesで作成した社内ツール風プロトタイプを、チームや上司にURLで見てもらいたい担当者向け。本番データへの誤操作リスクを防ぐ方法と、操作フローのレビューを効率よく進める段取りが分かる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "make-scenarios-lp-draft-review-url",
    "path": "/articles/make-scenarios-lp-draft-review-url",
    "title": "Makeシナリオで生成したLP案をレビュー用URLにして共有する方法",
    "description": "MakeのシナリオでLP案を生成し、クライアントや社内関係者にURLで確認してもらいたい担当者向け。Makeシナリオに特有の注意点を踏まえた公開前チェック、認証設定、フィードバック依頼の方法が分かる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "make-scenarios-admin-mock-review-url",
    "path": "/articles/make-scenarios-admin-mock-review-url",
    "title": "Makeシナリオで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "MakeのCode moduleから出力された管理画面モックHTMLを、権限管理の懸念なくレビュアーに届けるにはひと工夫必要だ。認証付きURLで安全に共有するまでの手順を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "make-scenarios-slide-html-review-url",
    "path": "/articles/make-scenarios-slide-html-review-url",
    "title": "Makeシナリオで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "MakeシナリオでHTMLスライドを生成し、社内外の関係者にURLでレビュー依頼したい担当者向け。スライドライブラリの依存解決、認証付きURL発行、スライド番号ベースのフィードバック収集方法が分かる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "make-scenarios-form-page-review-url",
    "path": "/articles/make-scenarios-form-page-review-url",
    "title": "Makeシナリオで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "Makeシナリオで生成したフォーム付きHTMLページのレビュー用URLを安全に発行したい担当者向け。Webhook送信先の無害化、フォームバリデーションの動作確認、UIレビューに必要な認証設定と期限の決め方が分かる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "make-scenarios-internal-tool-prototype-review-url",
    "path": "/articles/make-scenarios-internal-tool-prototype-review-url",
    "title": "Makeシナリオで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "MakeシナリオでHTML出力した社内ツールプロトタイプを、チームにURLで共有してレビューを受けたい担当者向け。本番シナリオの保護方法、ダミーデータへの差し替え手順、操作ベースのフィードバック収集方法が具体的に分かる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "websim-lp-draft-review-url",
    "path": "/articles/websim-lp-draft-review-url",
    "title": "WebSimで生成したLP案をレビュー用URLにして共有する方法",
    "description": "WebSimのAIで生成したLP案を、社内外の関係者にURLで見てもらいたいWebデザイナー・マーケター向け。WebSim固有の共有設定の確認方法から、認証付きURLへの移行手順、フィードバック収集のコツまで分かる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "websim-admin-mock-review-url",
    "path": "/articles/websim-admin-mock-review-url",
    "title": "WebSimで生成した管理画面モックをレビュー用URLにして共有する方法",
    "description": "WebSimで生成した管理画面モックをURLで共有したいデザイナー・エンジニア向け。認証方式の選び方から公開前チェックリスト・フィードバック回収の段取りまでを具体的に解説し、どの方式を選ぶべきか判断できる。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "websim-slide-html-review-url",
    "path": "/articles/websim-slide-html-review-url",
    "title": "WebSimで生成したHTMLスライドをレビュー用URLにして共有する方法",
    "description": "WebSimで作ったHTMLスライドを関係者にURLで見せたい担当者向け。公開前の外部依存チェックからパスワードなし・あり両方の共有手順、フィードバック収集のコツまでを実務ベースで解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "websim-form-page-review-url",
    "path": "/articles/websim-form-page-review-url",
    "title": "WebSimで生成したフォーム付きページをレビュー用URLにして共有する方法",
    "description": "WebSimで作ったフォーム付きHTMLページを関係者にレビューしてもらいたい担当者向け。送信先の安全処理・スマホ表示の確認・認証方法の選択まで、フォーム特有のリスクを踏まえた手順を解説する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "websim-internal-tool-prototype-review-url",
    "path": "/articles/websim-internal-tool-prototype-review-url",
    "title": "WebSimで生成した社内ツール風プロトタイプをレビュー用URLにして共有する方法",
    "description": "クリックやタブ切り替えのインタラクションが命のプロトタイプは、スクリーンショットでは何も伝わらない。WebSimで作った社内ツールを開発環境なしで安全に体験してもらえるURLに変える方法を紹介する。",
    "category": "AI活用",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "manufacturing-proposal-lp-limited-share",
    "path": "/articles/manufacturing-proposal-lp-limited-share",
    "title": "製造業がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "製造業の営業担当や企画部門がAIで作った提案LPをクライアントに限定公開したい人向け。業種特有の情報管理リスクを踏まえた上で、認証方式の選び方・送付文面・フィードバック回収の手順を説明する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "manufacturing-campaign-html-limited-share",
    "path": "/articles/manufacturing-campaign-html-limited-share",
    "title": "製造業がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "製造業でAIが生成したキャンペーン告知HTMLを展示会前や発売前に関係者だけにプレビューさせたい担当者向け。業種特有の情報解禁タイミングと認証方式の選択・送付文面の工夫を実務目線で説明する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "manufacturing-internal-explainer-limited-share",
    "path": "/articles/manufacturing-internal-explainer-limited-share",
    "title": "製造業が社内説明ページを社内メンバーに限定共有する方法",
    "description": "製造業の社内担当者がAIで作った説明ページを現場スタッフや各工場の管理者に限定公開したい人向け。社内ドメイン認証の活用法・モバイル表示の確認ポイント・フィードバック収集の実践的な手順を紹介する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "manufacturing-customer-demo-limited-share",
    "path": "/articles/manufacturing-customer-demo-limited-share",
    "title": "製造業が顧客向けデモページを見込み客に限定共有する方法",
    "description": "製造業の営業担当が見込み客にAIで作ったデモページを限定公開したい場面向け。商談進行中の情報管理リスクを踏まえた認証設定・期限管理・訪問タイミング把握の方法を実務的に紹介する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "manufacturing-training-onboarding-limited-share",
    "path": "/articles/manufacturing-training-onboarding-limited-share",
    "title": "製造業が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "製造業の人事・研修担当者がAIで作ったオンボーディング教材を受講者だけに届けたい人向け。受講者管理・認証設定・学習進捗把握の方法から、教材の更新を受講者に通知する手順まで実践的に解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "construction-proposal-lp-limited-share",
    "path": "/articles/construction-proposal-lp-limited-share",
    "title": "建設会社がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "建設会社の営業・積算・企画担当がAIで作った提案LPを発注者候補に限定公開したい人向け。建設業特有の機密情報と共有リスクを踏まえ、認証設定・期限管理・フィードバック回収までをカバーする。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "construction-campaign-html-limited-share",
    "path": "/articles/construction-campaign-html-limited-share",
    "title": "建設会社がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "建設会社の企画・マーケティング担当がAIで作ったキャンペーンHTMLを取引先・社内・一部顧客に先行確認してもらいたい人向け。解禁前の情報管理・認証設定・一般公開への切り替え手順を具体的に解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "construction-internal-explainer-limited-share",
    "path": "/articles/construction-internal-explainer-limited-share",
    "title": "建設会社が社内説明ページを社内メンバーに限定共有する方法",
    "description": "建設会社の総務・安全管理担当者がAIで作った社内説明ページを現場スタッフや協力会社に限定共有したい人向け。建設業特有の現場環境でのアクセス手段・認証設定・更新通知の実践的な方法を解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "construction-customer-demo-limited-share",
    "path": "/articles/construction-customer-demo-limited-share",
    "title": "建設会社が顧客向けデモページを見込み客に限定共有する方法",
    "description": "建設営業担当者向けに、施工デモページを見込み客だけに安全に届けるための認証方法・隠すべき情報・送付文面の作り方を具体的に解説する記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "construction-training-onboarding-limited-share",
    "path": "/articles/construction-training-onboarding-limited-share",
    "title": "建設会社が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "建設会社の研修担当者向けに、HTML教材を受講者だけに安全に届けるための認証設定・個人情報の除去方法・受講確認の仕組みを解説する記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "logistics-proposal-lp-limited-share",
    "path": "/articles/logistics-proposal-lp-limited-share",
    "title": "物流会社がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "物流業の営業担当者が、AIで作った提案LPをクライアントだけに安全に届けるための認証設定・掲載情報の整理・送付後フォローの方法を具体的に説明する記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "logistics-campaign-html-limited-share",
    "path": "/articles/logistics-campaign-html-limited-share",
    "title": "物流会社がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "物流業の担当者向けに、キャンペーン告知HTMLを取引先関係者のみに安全に届けるための共有設定・掲載情報の確認手順・送付後の管理方法を解説する記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "logistics-internal-explainer-limited-share",
    "path": "/articles/logistics-internal-explainer-limited-share",
    "title": "物流会社が社内説明ページを社内メンバーに限定共有する方法",
    "description": "物流会社の総務・管理部門向けに、社内説明ページを社員のみに安全に届けるための認証設定・記載情報の整理・既読管理の方法を具体的に解説する記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "logistics-customer-demo-limited-share",
    "path": "/articles/logistics-customer-demo-limited-share",
    "title": "物流会社が顧客向けデモページを見込み客に限定共有する方法",
    "description": "物流業の営業担当者が、システムデモや新サービス紹介ページを見込み客だけに安全に届けるための認証設定・事前チェック手順・フォロー方法を解説する記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "logistics-training-onboarding-limited-share",
    "path": "/articles/logistics-training-onboarding-limited-share",
    "title": "物流会社が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "物流会社の研修担当者向けに、HTML教材を受講者だけに安全に届けるための認証方法・配布対象別の設定・受講管理の手順を具体的に解説した記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "recruitment-agency-proposal-lp-limited-share",
    "path": "/articles/recruitment-agency-proposal-lp-limited-share",
    "title": "人材紹介会社がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "人材紹介業の営業担当者向けに、AIで作った提案LPをクライアント企業の担当者だけに届けるための認証設定・掲載情報の整理・商談フォローの進め方を解説する記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "recruitment-agency-campaign-html-limited-share",
    "path": "/articles/recruitment-agency-campaign-html-limited-share",
    "title": "人材紹介会社がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "人材紹介業の担当者向けに、採用支援キャンペーンの告知HTMLを特定の関係者だけに届けるための認証設定・掲載情報の扱い・送付後の管理方法を具体的に説明する記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "recruitment-agency-internal-explainer-limited-share",
    "path": "/articles/recruitment-agency-internal-explainer-limited-share",
    "title": "人材紹介会社が社内説明ページを社内メンバーに限定共有する方法",
    "description": "人材紹介会社の管理部門・営業マネージャー向けに、社内説明ページを社員のみに届けるための認証設定・掲載情報の管理・既読確認の運用方法を解説する記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "recruitment-agency-customer-demo-limited-share",
    "path": "/articles/recruitment-agency-customer-demo-limited-share",
    "title": "人材紹介会社が顧客向けデモページを見込み客に限定共有する方法",
    "description": "人材紹介業の営業担当者が、採用支援サービスのデモページを見込みクライアントだけに届けるための認証設定・掲載内容の確認・商談フォローの進め方を解説する記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "recruitment-agency-training-onboarding-limited-share",
    "path": "/articles/recruitment-agency-training-onboarding-limited-share",
    "title": "人材紹介会社が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "人材紹介会社の研修担当者向けに、キャリアアドバイザー向けオンボーディング教材を受講者だけに届けるための認証設定・掲載情報の整理・受講管理の仕組みを解説する記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "rpo-proposal-lp-limited-share",
    "path": "/articles/rpo-proposal-lp-limited-share",
    "title": "採用代行会社がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "採用代行会社の営業担当者向け。AIで作った提案LPをクライアントだけに安全に見せたいが共有方法で迷っている方が、認証方式の選択から送付文面まで判断できる記事です。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "rpo-campaign-html-limited-share",
    "path": "/articles/rpo-campaign-html-limited-share",
    "title": "採用代行会社がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "採用代行会社のキャンペーン告知HTMLを外部パートナーや社内承認者に限定公開したい担当者向け。公開前チェックから認証設定・レビュー回収まで、実務の流れで判断できる記事です。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "rpo-internal-explainer-limited-share",
    "path": "/articles/rpo-internal-explainer-limited-share",
    "title": "採用代行会社が社内説明ページを社内メンバーに限定共有する方法",
    "description": "採用代行会社の社内向け説明ページを、社員だけに安全に届けたい担当者向け。会社ドメイン認証の設定から更新通知の運用まで、社内共有の実務で役立つ判断基準を提供します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "rpo-customer-demo-limited-share",
    "path": "/articles/rpo-customer-demo-limited-share",
    "title": "採用代行会社が顧客向けデモページを見込み客に限定共有する方法",
    "description": "採用代行会社の営業担当者が見込み客にデモページを送る際の共有方法に迷っている方向け。認証方式の選び方から商談後のURL管理まで、失注リスクを下げる実務判断を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "rpo-training-onboarding-limited-share",
    "path": "/articles/rpo-training-onboarding-limited-share",
    "title": "採用代行会社が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "採用代行会社で研修・オンボーディング教材をHTMLで用意した担当者向け。受講者だけに安全に共有し、更新・アクセス管理を運用し続けるための具体的な方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "saas-proposal-lp-limited-share",
    "path": "/articles/saas-proposal-lp-limited-share",
    "title": "SaaS企業がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "SaaS企業の営業担当やプリセールスが、AI生成の提案LPを商談相手だけに限定共有したい場合の方法を解説。認証設定から送付文面・フォローアップまで実務で使える判断基準を提供します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "saas-campaign-html-limited-share",
    "path": "/articles/saas-campaign-html-limited-share",
    "title": "SaaS企業がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "SaaS企業のマーケターや開発チームが、キャンペーン告知HTMLを社内と外部パートナーに安全に共有したい場合の方法を解説。公開前の情報管理から承認フロー完了後の処理まで実務に役立つ内容です。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "saas-internal-explainer-limited-share",
    "path": "/articles/saas-internal-explainer-limited-share",
    "title": "SaaS企業が社内説明ページを社内メンバーに限定共有する方法",
    "description": "SaaS企業の社内情報共有担当者が、社内説明ページをメンバーだけに安全に届けたい場合の方法を解説。会社ドメイン認証の設定から更新通知・アクセス管理の運用ルールまで具体的に説明します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "saas-customer-demo-limited-share",
    "path": "/articles/saas-customer-demo-limited-share",
    "title": "SaaS企業が顧客向けデモページを見込み客に限定共有する方法",
    "description": "SaaS企業のプリセールス担当や営業が、顧客向けデモページを見込み客だけに安全に届けたい場合の方法を解説。商談フェーズ別の認証設定と、アクセスログを活用した商談フォローのコツを説明します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "saas-training-onboarding-limited-share",
    "path": "/articles/saas-training-onboarding-limited-share",
    "title": "SaaS企業が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "SaaS企業のHRや社内研修担当が、オンボーディング教材を受講者だけに安全に届けたい場合の方法を解説。認証設定・更新運用・受講確認まで、LMSなしで実現できる実践的な方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tax-office-proposal-lp-limited-share",
    "path": "/articles/tax-office-proposal-lp-limited-share",
    "title": "税理士事務所がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "税理士事務所の担当者が、AI生成の提案LPを特定のクライアント候補だけに安全に届けたい場合の方法を解説。税務業種特有の機密情報管理から認証設定・フォローアップまで実務に即した内容です。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tax-office-campaign-html-limited-share",
    "path": "/articles/tax-office-campaign-html-limited-share",
    "title": "税理士事務所がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "確定申告シーズン前のキャンペーンページを関係者に事前確認させたいが、誰でも見られる状態で出したくない——そんな税理士事務所向けに、承認フローを崩さず関係者だけに共有できる認証付きURL活用法を解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tax-office-internal-explainer-limited-share",
    "path": "/articles/tax-office-internal-explainer-limited-share",
    "title": "税理士事務所が社内説明ページを社内メンバーに限定共有する方法",
    "description": "所内スタッフへの業務説明ページを安全に配布したい税理士事務所向けに、情報漏洩リスクの洗い出しから認証方式の選び方まで具体的に解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tax-office-customer-demo-limited-share",
    "path": "/articles/tax-office-customer-demo-limited-share",
    "title": "税理士事務所が顧客向けデモページを見込み客に限定共有する方法",
    "description": "見込み客に税務顧問のデモページを見せたい税理士事務所向けに、情報漏洩を防ぎながら商談を前進させる限定公開の設定手順と送付のコツを説明します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tax-office-training-onboarding-limited-share",
    "path": "/articles/tax-office-training-onboarding-limited-share",
    "title": "税理士事務所が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "新入スタッフや受講者だけに教材を配布したい税理士事務所向けに、研修HTMLの安全な限定公開手順と受講管理のポイントをわかりやすく解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "labor-office-proposal-lp-limited-share",
    "path": "/articles/labor-office-proposal-lp-limited-share",
    "title": "社労士事務所がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "AI生成の提案LPをクライアントだけに届けたい社労士事務所向けに、情報漏洩リスクの排除から閲覧後のフォロー方法まで実践的な手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "labor-office-campaign-html-limited-share",
    "path": "/articles/labor-office-campaign-html-limited-share",
    "title": "社労士事務所がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "キャンペーン告知HTMLを公開前に関係者だけでレビューしたい社労士事務所向けに、限定共有の設定方法とスムーズなフィードバック収集の進め方を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "labor-office-internal-explainer-limited-share",
    "path": "/articles/labor-office-internal-explainer-limited-share",
    "title": "社労士事務所が社内説明ページを社内メンバーに限定共有する方法",
    "description": "社内スタッフへ業務説明ページを安全に配布したい社労士事務所向けに、守秘義務を守りながら効率的に限定共有する手順と注意点を詳しく解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "labor-office-customer-demo-limited-share",
    "path": "/articles/labor-office-customer-demo-limited-share",
    "title": "社労士事務所が顧客向けデモページを見込み客に限定共有する方法",
    "description": "見込み客にサービスデモを安全に届けたい社労士事務所向けに、閲覧制限の設定から商談につなげるフォローアップ手順まで実践的に解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "labor-office-training-onboarding-limited-share",
    "path": "/articles/labor-office-training-onboarding-limited-share",
    "title": "社労士事務所が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "受講者だけに研修教材を届けたい社労士事務所向けに、教材の安全な限定配布方法と更新時の差し替えを効率化する運用フローを解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "law-office-proposal-lp-limited-share",
    "path": "/articles/law-office-proposal-lp-limited-share",
    "title": "弁護士事務所がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "AI生成の提案LPを見込み依頼人だけに届けたい弁護士事務所向けに、守秘義務を守りながら商談を前進させる安全な限定共有の手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "law-office-campaign-html-limited-share",
    "path": "/articles/law-office-campaign-html-limited-share",
    "title": "弁護士事務所がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "キャンペーン告知HTMLを公開前に関係者レビューしたい弁護士事務所向けに、弁護士広告規則に注意しながら限定共有でレビューを進める具体的な手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "law-office-internal-explainer-limited-share",
    "path": "/articles/law-office-internal-explainer-limited-share",
    "title": "弁護士事務所が社内説明ページを社内メンバーに限定共有する方法",
    "description": "業務フロー変更や内部規程の改訂を社内メンバーだけに届けたい弁護士事務所向けに、守秘義務に配慮した限定共有の設定と運用方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "law-office-customer-demo-limited-share",
    "path": "/articles/law-office-customer-demo-limited-share",
    "title": "弁護士事務所が顧客向けデモページを見込み客に限定共有する方法",
    "description": "見込み依頼人にサービス紹介デモを届けたい弁護士事務所向けに、弁護士広告規程に配慮した安全な限定共有の設定手順とフォロー方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "law-office-training-onboarding-limited-share",
    "path": "/articles/law-office-training-onboarding-limited-share",
    "title": "弁護士事務所が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "弁護士事務所の研修・オンボーディング教材を受講者限定で安全に届けたい担当者向け。守秘義務情報の取り扱いや認証方式の選び方、送付文面の作り方まで具体的に解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "real-estate-broker-proposal-lp-limited-share",
    "path": "/articles/real-estate-broker-proposal-lp-limited-share",
    "title": "不動産仲介会社がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "不動産仲介会社がAI生成の提案LPをクライアントだけに安全に届けたい担当者向け。物件情報の漏洩を防ぐ共有設計と、クライアントからのフィードバックを素早く回収するコツを解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "real-estate-broker-campaign-html-limited-share",
    "path": "/articles/real-estate-broker-campaign-html-limited-share",
    "title": "不動産仲介会社がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "不動産仲介会社のキャンペーン告知HTMLを、営業スタッフや提携先など関係者に限定配布したい担当者向け。漏洩リスクの防ぎ方から関係者別の認証設計、フィードバック収集の実践手順を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "real-estate-broker-internal-explainer-limited-share",
    "path": "/articles/real-estate-broker-internal-explainer-limited-share",
    "title": "不動産仲介会社が社内説明ページを社内メンバーに限定共有する方法",
    "description": "不動産仲介会社の社内向け説明ページを社内メンバーに限定共有したい担当者向け。社外に漏れると困る情報の洗い出し方から、ドメイン認証を使った手間ゼロの管理方法まで実践的に解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "real-estate-broker-customer-demo-limited-share",
    "path": "/articles/real-estate-broker-customer-demo-limited-share",
    "title": "不動産仲介会社が顧客向けデモページを見込み客に限定共有する方法",
    "description": "不動産仲介会社が見込み客向けのデモページを安全に届けたい担当者向け。商談に有利な情報を守りながらアクセスを見込み客だけに絞る方法と、商談につなげるための送付設計を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "real-estate-broker-training-onboarding-limited-share",
    "path": "/articles/real-estate-broker-training-onboarding-limited-share",
    "title": "不動産仲介会社が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "不動産仲介会社で新人研修・オンボーディング教材をHTML形式で配布したい担当者向け。受講者限定公開の設計方法から、研修後の教材アクセス管理まで、実務に即した手順で解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "renovation-proposal-lp-limited-share",
    "path": "/articles/renovation-proposal-lp-limited-share",
    "title": "住宅リフォーム会社がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "住宅リフォーム会社がAI生成の提案LPをクライアント限定で届けたい担当者向け。見積もり情報の漏洩を防ぐ共有設計と、クライアントの検討意欲を高める送付方法を具体的に解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "renovation-campaign-html-limited-share",
    "path": "/articles/renovation-campaign-html-limited-share",
    "title": "住宅リフォーム会社がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "住宅リフォーム会社のキャンペーン告知HTMLを社内・提携業者など関係者に限定して事前共有したい担当者向け。本公開前の情報管理と関係者への効率的な周知方法を実践的に解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "renovation-internal-explainer-limited-share",
    "path": "/articles/renovation-internal-explainer-limited-share",
    "title": "住宅リフォーム会社が社内説明ページを社内メンバーに限定共有する方法",
    "description": "住宅リフォーム会社が社内向け説明ページを社内メンバーに限定公開したい担当者向け。業務マニュアルや基準書の安全な共有方法と、アクセス管理の運用設計を具体的に紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "renovation-customer-demo-limited-share",
    "path": "/articles/renovation-customer-demo-limited-share",
    "title": "住宅リフォーム会社が顧客向けデモページを見込み客に限定共有する方法",
    "description": "住宅リフォーム会社が見込み客向けのデモページを限定公開したい担当者向け。完成イメージや費用感など商談に有効な情報を守りながら見込み客にだけ届ける方法と、商談を前進させる送付設計を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "renovation-training-onboarding-limited-share",
    "path": "/articles/renovation-training-onboarding-limited-share",
    "title": "住宅リフォーム会社が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "住宅リフォーム会社の研修・オンボーディング教材を受講者に限定配布したい担当者向け。施工ノウハウを守りながら新人スタッフや職人に教材を届け、研修後のアクセス管理まで一貫して設計する方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "travel-agency-proposal-lp-limited-share",
    "path": "/articles/travel-agency-proposal-lp-limited-share",
    "title": "旅行代理店がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "旅行代理店がAI生成の提案LPをクライアント限定で届けたい担当者向け。旅程・価格情報の漏洩リスクを防ぐ認証設計と、クライアントのフィードバックを素早く回収して成約につなげる実践的な方法を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "travel-agency-campaign-html-limited-share",
    "path": "/articles/travel-agency-campaign-html-limited-share",
    "title": "旅行代理店がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "旅行代理店のキャンペーン告知HTMLを安全に関係者限定で届けたい担当者向けに、共有前の確認ポイント・隠すべき情報・認証方式の選び方・レビュー回収のコツをまとめた実践ガイドです。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "travel-agency-internal-explainer-limited-share",
    "path": "/articles/travel-agency-internal-explainer-limited-share",
    "title": "旅行代理店が社内説明ページを社内メンバーに限定共有する方法",
    "description": "社内説明ページを社員だけに安全に届けたい旅行代理店の担当者向けに、情報漏洩の具体的リスク・社内認証の選び方・閲覧管理の運用手順を解説します。どの認証方式が自社に合うかを判断する材料になります。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "travel-agency-customer-demo-limited-share",
    "path": "/articles/travel-agency-customer-demo-limited-share",
    "title": "旅行代理店が顧客向けデモページを見込み客に限定共有する方法",
    "description": "旅行代理店が見込み客に顧客向けデモページを送る際の課題と対策を解説します。競合への情報漏洩防止・スマホ表示の確認・メール認証の活用など、商談を前に進めるための実践的な手順を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "travel-agency-training-onboarding-limited-share",
    "path": "/articles/travel-agency-training-onboarding-limited-share",
    "title": "旅行代理店が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "旅行代理店の新人研修・オンボーディング教材をHTMLで作って受講者だけに安全配布したい研修担当者向けに、教材に含まれるリスク情報の扱い方・認証設定・受講管理の実践手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hotel-proposal-lp-limited-share",
    "path": "/articles/hotel-proposal-lp-limited-share",
    "title": "ホテルがAIで作った提案LPをクライアントに限定共有する方法",
    "description": "ホテルがAI生成の提案LPをクライアントに安全共有したい営業・宴会担当者向けに、提案特有の情報漏洩リスク・認証方式の選択・商談を前進させる送付文面の書き方を具体的に解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hotel-campaign-html-limited-share",
    "path": "/articles/hotel-campaign-html-limited-share",
    "title": "ホテルがキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "ホテルのキャンペーン告知HTMLを旅行会社や法人得意先などの関係者に限定共有したいマーケティング担当者向けに、情報漏洩リスクの特定・認証方式の選択・レビュー依頼メールの書き方を実践的に解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hotel-internal-explainer-limited-share",
    "path": "/articles/hotel-internal-explainer-limited-share",
    "title": "ホテルが社内説明ページを社内メンバーに限定共有する方法",
    "description": "ホテルの社内説明ページを社内スタッフだけに安全に配信したいマネージャー・総務担当者向けに、社員以外への情報漏洩リスクと防止策・ドメイン認証の活用・受講確認を兼ねた配信運用の手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hotel-customer-demo-limited-share",
    "path": "/articles/hotel-customer-demo-limited-share",
    "title": "ホテルが顧客向けデモページを見込み客に限定共有する方法",
    "description": "ホテルが挙式・宴会・研修合宿などの見込み客にデモページを送りたい営業担当者向けに、提案特有の情報漏洩リスクの防ぎ方・認証方式の使い分け・商談を前進させる文面の作り方を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hotel-training-onboarding-limited-share",
    "path": "/articles/hotel-training-onboarding-limited-share",
    "title": "ホテルが研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "ホテルのフロント・宴会・客室など各部門の研修・オンボーディング教材をHTMLで安全配信したい研修担当者向けに、教材に含まれる機密情報の扱い方・部門別認証設計・受講確認の運用方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "restaurant-chain-proposal-lp-limited-share",
    "path": "/articles/restaurant-chain-proposal-lp-limited-share",
    "title": "飲食チェーンがAIで作った提案LPをクライアントに限定共有する方法",
    "description": "飲食チェーンがAI生成の提案LPをFC加盟候補者・投資家・取引先に安全共有したい事業開発・営業担当者向けに、業種特有の情報漏洩リスクと対策・認証方式の選択・商談を加速させる送付方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "restaurant-chain-campaign-html-limited-share",
    "path": "/articles/restaurant-chain-campaign-html-limited-share",
    "title": "飲食チェーンがキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "飲食チェーンのキャンペーン告知HTMLを加盟店・提携メディア・関係者に安全共有したい本部マーケティング担当者向けに、情報漏洩のリスク管理・認証設定・複数関係者へのレビュー依頼を効率化する方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "restaurant-chain-internal-explainer-limited-share",
    "path": "/articles/restaurant-chain-internal-explainer-limited-share",
    "title": "飲食チェーンが社内説明ページを社内メンバーに限定共有する方法",
    "description": "飲食チェーン本部が社内説明ページを全国の加盟店スタッフに安全配信したい運営・人事担当者向けに、業種特有の情報漏洩リスク・大規模な認証管理の方法・更新サイクルの効率化について実践的に解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "restaurant-chain-customer-demo-limited-share",
    "path": "/articles/restaurant-chain-customer-demo-limited-share",
    "title": "飲食チェーンが顧客向けデモページを見込み客に限定共有する方法",
    "description": "飲食チェーンが見込み客にデモページを限定共有する際に直面する情報漏洩・認証・回収の課題を整理し、業種固有の注意点と実践的な送付手順を解説する記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "restaurant-chain-training-onboarding-limited-share",
    "path": "/articles/restaurant-chain-training-onboarding-limited-share",
    "title": "飲食チェーンが研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "飲食チェーンの研修・オンボーディング教材をHTMLで限定共有するときの認証設計・情報管理・回収の進め方を、受講者管理の観点から具体的に説明した記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "beauty-salon-proposal-lp-limited-share",
    "path": "/articles/beauty-salon-proposal-lp-limited-share",
    "title": "美容サロンがAIで作った提案LPをクライアントに限定共有する方法",
    "description": "美容サロンがAI生成の提案LPをクライアントだけに届けたい担当者向けに、情報漏洩を防ぐ認証設計から送付文面・フィードバック回収までの流れを解説する記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "beauty-salon-campaign-html-limited-share",
    "path": "/articles/beauty-salon-campaign-html-limited-share",
    "title": "美容サロンがキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "美容サロンのキャンペーン告知HTMLを公開前に関係者だけで確認したい担当者向けに、拡散リスクを防ぐ認証設定・チェックすべき情報・回収手順を具体的に示した記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "beauty-salon-internal-explainer-limited-share",
    "path": "/articles/beauty-salon-internal-explainer-limited-share",
    "title": "美容サロンが社内説明ページを社内メンバーに限定共有する方法",
    "description": "美容サロンが社内メンバー向けの説明ページをHTML形式で限定共有するときの情報管理・認証設定・確認依頼の実践的な手順を、社内運用の視点から解説した記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "beauty-salon-customer-demo-limited-share",
    "path": "/articles/beauty-salon-customer-demo-limited-share",
    "title": "美容サロンが顧客向けデモページを見込み客に限定共有する方法",
    "description": "美容サロンが見込み客向けデモページを限定公開するとき、施術情報の流出を防ぎつつ予約につながる共有フローを設計したい担当者向けの実践的な解説記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "beauty-salon-training-onboarding-limited-share",
    "path": "/articles/beauty-salon-training-onboarding-limited-share",
    "title": "美容サロンが研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "衛生管理手順や接客スクリプトは競合に見られたくない情報だ。美容サロンの研修HTMLを受講者だけが開けるURLで配布し、修了確認まで効率よく回す方法と、ギガサイト便での設定手順をまとめた。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "clinic-proposal-lp-limited-share",
    "path": "/articles/clinic-proposal-lp-limited-share",
    "title": "医療クリニックがAIで作った提案LPをクライアントに限定共有する方法",
    "description": "医療クリニックがAI生成の提案LPをクライアントに限定共有する際の個人情報漏洩リスク・認証設計・送付フローを、医療業界の特有事情に照らして解説した実践的な記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "clinic-campaign-html-limited-share",
    "path": "/articles/clinic-campaign-html-limited-share",
    "title": "医療クリニックがキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "医療クリニックのキャンペーン告知HTMLを公開前に関係者限定でプレビュー共有したい担当者向けに、医療情報の取り扱いに配慮した認証設定・確認チェックリスト・回収フローを解説した記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "clinic-internal-explainer-limited-share",
    "path": "/articles/clinic-internal-explainer-limited-share",
    "title": "医療クリニックが社内説明ページを社内メンバーに限定共有する方法",
    "description": "医療クリニックが診療フロー変更や制度改定の社内説明ページをスタッフに限定配布したい担当者向けに、個人情報保護を踏まえた認証設計と確認回収の実務フローを解説する記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "clinic-customer-demo-limited-share",
    "path": "/articles/clinic-customer-demo-limited-share",
    "title": "医療クリニックが顧客向けデモページを見込み客に限定共有する方法",
    "description": "医療クリニックが新サービスのデモページを見込み患者に限定公開したい担当者向けに、医療広告ガイドラインに配慮した情報管理・認証設計・フィードバック回収の実務を解説する記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "clinic-training-onboarding-limited-share",
    "path": "/articles/clinic-training-onboarding-limited-share",
    "title": "医療クリニックが研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "入職前に感染管理や院内ルールを読んできてもらえれば初日の研修を実技に充てられる。患者情報を含みやすい医療機関の教材HTMLを、認証付きURLで安全に配布する具体的な手順を紹介する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dental-clinic-proposal-lp-limited-share",
    "path": "/articles/dental-clinic-proposal-lp-limited-share",
    "title": "歯科医院がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "AIで制作した歯科医院向け提案LPを安全に届けたい担当者向け。共有前に確認すべき患者情報の扱いや認証方式の選び方、スムーズなレビュー回収のコツを具体的に解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dental-clinic-campaign-html-limited-share",
    "path": "/articles/dental-clinic-campaign-html-limited-share",
    "title": "歯科医院がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "歯科医院のキャンペーン告知HTML制作後に関係者へ安全に共有したい方向け。情報漏洩を防ぐ認証設定と、スタッフ・提携先など複数関係者への効率的なレビュー依頼方法を解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dental-clinic-internal-explainer-limited-share",
    "path": "/articles/dental-clinic-internal-explainer-limited-share",
    "title": "歯科医院が社内説明ページを社内メンバーに限定共有する方法",
    "description": "歯科医院の院内説明ページを社内メンバーだけに安全に共有したい院長・事務担当者向け。患者情報を含む内部資料の漏洩を防ぐ認証設定と、スタッフへの効率的な連絡手順を具体的に紹介する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dental-clinic-customer-demo-limited-share",
    "path": "/articles/dental-clinic-customer-demo-limited-share",
    "title": "歯科医院が顧客向けデモページを見込み客に限定共有する方法",
    "description": "歯科医院がAI制作した顧客向けデモページを見込み患者に安全に届けたい担当者向け。情報漏洩リスクを下げながらスムーズに確認してもらうための認証設定と送付文面のコツを解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "dental-clinic-training-onboarding-limited-share",
    "path": "/articles/dental-clinic-training-onboarding-limited-share",
    "title": "歯科医院が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "歯科医院が新人スタッフ向けの研修・オンボーディング教材を、受講者だけに安全かつ効率的に届けたい院長・教育担当者向け。個人情報を含む内部教材の漏洩防止と、進捗確認の方法を具体的に解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cram-school-proposal-lp-limited-share",
    "path": "/articles/cram-school-proposal-lp-limited-share",
    "title": "学習塾がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "学習塾の生徒募集・提案LP制作後にクライアントや本部に安全に共有したい担当者向け。塾のブランド情報を含むHTMLの漏洩リスクを防ぐ認証設定と、レビュー依頼の効率化方法を解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cram-school-campaign-html-limited-share",
    "path": "/articles/cram-school-campaign-html-limited-share",
    "title": "学習塾がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "学習塾のキャンペーン告知HTMLを制作後に関係者のみへ安全に共有したい担当者向け。未公開の割引情報や特典内容の漏洩を防ぐ認証設定と、複数関係者からのフィードバック収集方法を解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cram-school-internal-explainer-limited-share",
    "path": "/articles/cram-school-internal-explainer-limited-share",
    "title": "学習塾が社内説明ページを社内メンバーに限定共有する方法",
    "description": "学習塾の社内説明ページを講師・スタッフのみに安全に共有したい教室長・本部担当者向け。独自の指導メソッドや内部情報の漏洩を防ぐアクセス設定と、効率的な社内周知方法を解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cram-school-customer-demo-limited-share",
    "path": "/articles/cram-school-customer-demo-limited-share",
    "title": "学習塾が顧客向けデモページを見込み客に限定共有する方法",
    "description": "学習塾が作成した保護者・生徒向けデモページを見込み客だけに安全に届けたい教室長・営業担当者向け。指導内容・料金情報の競合漏洩を防ぐ方法と、体験申し込みへの誘導を高めるURLの送り方を解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cram-school-training-onboarding-limited-share",
    "path": "/articles/cram-school-training-onboarding-limited-share",
    "title": "学習塾が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "学習塾が講師・スタッフ向けの研修・オンボーディング教材を受講者だけに安全に届けたい教育担当者向け。独自の指導ノウハウを含む教材の漏洩を防ぐアクセス設定と、受講状況の把握方法を具体的に解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "university-lab-proposal-lp-limited-share",
    "path": "/articles/university-lab-proposal-lp-limited-share",
    "title": "大学研究室がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "大学研究室が企業への産学連携提案LPを安全にクライアントに届けたい研究者・URA向け。特許申請前の技術情報を含むHTMLの漏洩リスク管理と、機密保持契約との連携を踏まえた認証設定を解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "university-lab-campaign-html-limited-share",
    "path": "/articles/university-lab-campaign-html-limited-share",
    "title": "大学研究室がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "大学研究室のキャンペーン告知HTMLを学外関係者や学内事務局に安全にプレビュー共有したい研究者・広報担当者向け。告知前の情報管理と承認フローを効率化するアクセス設定・レビュー依頼の方法を解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "university-lab-internal-explainer-limited-share",
    "path": "/articles/university-lab-internal-explainer-limited-share",
    "title": "大学研究室が社内説明ページを社内メンバーに限定共有する方法",
    "description": "研究室の内部向け説明ページを特定メンバーだけに安全に共有したい担当者向け。認証方式の選び方から送付文面のコツまで、情報漏えいを防ぎながらレビューを効率化できる手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "university-lab-customer-demo-limited-share",
    "path": "/articles/university-lab-customer-demo-limited-share",
    "title": "大学研究室が顧客向けデモページを見込み客に限定共有する方法",
    "description": "大学研究室が開発した技術デモを特定企業の担当者だけに見せたい場面で、情報流出を防ぎながらスピーディに共有する方法を解説。認証方式の選択肢と商談向け送付文のポイントも紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "university-lab-training-onboarding-limited-share",
    "path": "/articles/university-lab-training-onboarding-limited-share",
    "title": "大学研究室が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "大学研究室が新規メンバー向けのオンボーディング教材をHTMLで限定共有したいケースを対象に、情報を安全に届けるための認証設定と教材運用の実践的なポイントを紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "npo-proposal-lp-limited-share",
    "path": "/articles/npo-proposal-lp-limited-share",
    "title": "NPOがAIで作った提案LPをクライアントに限定共有する方法",
    "description": "NPOの担当者がAIで作成した提案LPを助成機関や寄付者などの特定クライアントにだけ届けたい場面で、情報漏えいを防ぎながら迅速にレビューを取る方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "npo-campaign-html-limited-share",
    "path": "/articles/npo-campaign-html-limited-share",
    "title": "NPOがキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "正式発表前のキャンペーンページがSNSで広まってしまうリスクを避けながら、理事会やボランティアスタッフに事前レビューを依頼したい。NPO向けに、関係者限定の認証付きURL共有フローを解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "npo-internal-explainer-limited-share",
    "path": "/articles/npo-internal-explainer-limited-share",
    "title": "NPOが社内説明ページを社内メンバーに限定共有する方法",
    "description": "NPOが組織内の説明ページをスタッフやボランティアなどの内部メンバーだけに安全に届けたい場面を想定し、情報漏えいを防ぐ認証方式と実務で使える運用ルールを解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "npo-customer-demo-limited-share",
    "path": "/articles/npo-customer-demo-limited-share",
    "title": "NPOが顧客向けデモページを見込み客に限定共有する方法",
    "description": "NPOが活動デモページを支援者候補や協賛検討企業などの見込み客に限定共有したい場面で、情報を安全に届けるための認証設定と商談向け運用のコツを具体的に解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "npo-training-onboarding-limited-share",
    "path": "/articles/npo-training-onboarding-limited-share",
    "title": "NPOが研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "NPOの新規ボランティアや職員向け研修教材を安全かつ効率よく配布したい担当者向け。認証方式の選び方と教材のバージョン管理・アクセス把握のコツを実務視点で解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "local-government-proposal-lp-limited-share",
    "path": "/articles/local-government-proposal-lp-limited-share",
    "title": "自治体がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "自治体が事業提案のランディングページをAIで作成し、特定のクライアントや承認者だけに安全に届けたい担当者向け。公務員ならではの情報管理ルールを踏まえた認証設定と共有手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "local-government-campaign-html-limited-share",
    "path": "/articles/local-government-campaign-html-limited-share",
    "title": "自治体がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "自治体のキャンペーン告知HTML作成担当者が、公開前の確認を関係者に依頼する際の情報管理と認証設定のポイントを解説。公務員特有の承認フローに合わせた運用のコツも紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "local-government-internal-explainer-limited-share",
    "path": "/articles/local-government-internal-explainer-limited-share",
    "title": "自治体が社内説明ページを社内メンバーに限定共有する方法",
    "description": "自治体が職員向けの内部説明ページを安全かつ迅速に共有したい場面を対象に、情報管理の観点から適切な認証方式を選ぶ方法と送付運用の実務的なポイントを解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "local-government-customer-demo-limited-share",
    "path": "/articles/local-government-customer-demo-limited-share",
    "title": "自治体が顧客向けデモページを見込み客に限定共有する方法",
    "description": "自治体が新サービスや住民向けシステムのデモページを特定の事業者・議員・上部機関などに限定共有したい場面向け。情報公開前のリスク管理と認証設定のポイントを実務ベースで解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "local-government-training-onboarding-limited-share",
    "path": "/articles/local-government-training-onboarding-limited-share",
    "title": "自治体が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "自治体の研修・オンボーディング担当者向けに、受講者限定でHTMLページを安全に共有する手順と注意点を解説。認証方式の選び方から送付文面の書き方まで判断できます。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "expo-operator-proposal-lp-limited-share",
    "path": "/articles/expo-operator-proposal-lp-limited-share",
    "title": "展示会運営会社がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "展示会運営会社の営業・企画担当者向けに、AIで作成した提案LPをクライアントだけに安全に見せる共有手順を解説。誤送信対策から差し替えまで一連の判断基準を提供します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "expo-operator-campaign-html-limited-share",
    "path": "/articles/expo-operator-campaign-html-limited-share",
    "title": "展示会運営会社がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "展示会運営会社の広報・制作担当者が、キャンペーン告知HTMLを出展社や協賛企業など関係者に限定して事前共有する際の手順と注意点をまとめました。公開前チェックリストも確認できます。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "expo-operator-internal-explainer-limited-share",
    "path": "/articles/expo-operator-internal-explainer-limited-share",
    "title": "展示会運営会社が社内説明ページを社内メンバーに限定共有する方法",
    "description": "展示会運営会社のプロジェクト管理担当者向けに、社内説明ページを社員だけに安全に共有する手順を解説。会場構成図や役割表など機密性の高い情報を守る認証設定の選び方がわかります。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "expo-operator-customer-demo-limited-share",
    "path": "/articles/expo-operator-customer-demo-limited-share",
    "title": "展示会運営会社が顧客向けデモページを見込み客に限定共有する方法",
    "description": "展示会運営会社の営業担当者が、デモページを特定の見込み客だけに見せる限定共有の手順と注意点を解説。競合への情報流出を防ぎながら効果的な提案活動を進めるための判断基準がわかります。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "expo-operator-training-onboarding-limited-share",
    "path": "/articles/expo-operator-training-onboarding-limited-share",
    "title": "展示会運営会社が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "展示会運営会社のスタッフ管理担当者が、研修・オンボーディング教材を受講対象スタッフだけに安全に届ける方法を解説。短期スタッフへの配布特有の課題と認証設定の選び方がわかります。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "event-production-proposal-lp-limited-share",
    "path": "/articles/event-production-proposal-lp-limited-share",
    "title": "イベント制作会社がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "イベント制作会社の企画・営業担当者が、AIで作成した提案LPをクライアントだけに安全に共有する方法を解説。誤送信対策・秘密保持・修正ループの効率化まで判断できる内容です。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "event-production-campaign-html-limited-share",
    "path": "/articles/event-production-campaign-html-limited-share",
    "title": "イベント制作会社がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "イベント制作会社の広報・制作担当者が、キャンペーン告知HTMLをスポンサーやメディアなど限られた関係者に安全に事前共有する方法を解説。公式発表前の情報漏洩リスクの管理方法もわかります。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "event-production-internal-explainer-limited-share",
    "path": "/articles/event-production-internal-explainer-limited-share",
    "title": "イベント制作会社が社内説明ページを社内メンバーに限定共有する方法",
    "description": "イベント制作会社のプロデューサー・ディレクターが、社内説明ページを社内メンバーだけに安全に共有する方法を解説。大人数のスタッフが最新情報に確実にアクセスできる仕組みの作り方がわかります。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "event-production-customer-demo-limited-share",
    "path": "/articles/event-production-customer-demo-limited-share",
    "title": "イベント制作会社が顧客向けデモページを見込み客に限定共有する方法",
    "description": "イベント制作会社の営業・プロデューサーが、顧客向けデモページを特定の見込み客だけに安全に見せる方法を解説。演出コンセプトの流出を防ぎながら効果的な営業を進める認証設定の選び方がわかります。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "event-production-training-onboarding-limited-share",
    "path": "/articles/event-production-training-onboarding-limited-share",
    "title": "イベント制作会社が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "イベント制作会社のスタッフ管理担当者向けに、研修・オンボーディング教材を受講スタッフだけに限定配布する方法を解説。現場スタッフの多様な環境に対応した認証設定と配布手順がわかります。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ad-agency-proposal-lp-limited-share",
    "path": "/articles/ad-agency-proposal-lp-limited-share",
    "title": "広告代理店がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "広告代理店の営業・クリエイティブ担当者向けに、AIで作成した提案LPをクライアントだけに安全に共有する手順を解説。競合流出リスクの管理から差し替え運用まで判断できる内容です。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ad-agency-campaign-html-limited-share",
    "path": "/articles/ad-agency-campaign-html-limited-share",
    "title": "広告代理店がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "広告代理店がキャンペーン告知HTMLを社外関係者と安全に共有したい方へ。認証方式の選び方から送付文面の書き方まで、情報漏洩を防ぎながらスムーズにレビューを回収する手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ad-agency-internal-explainer-limited-share",
    "path": "/articles/ad-agency-internal-explainer-limited-share",
    "title": "広告代理店が社内説明ページを社内メンバーに限定共有する方法",
    "description": "広告代理店の社内向けHTML説明ページを特定メンバーだけに届けたい担当者向け。情報漏洩リスクの把握から会社ドメイン認証の活用まで、社内限定共有の具体的な進め方を紹介します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ad-agency-customer-demo-limited-share",
    "path": "/articles/ad-agency-customer-demo-limited-share",
    "title": "広告代理店が顧客向けデモページを見込み客に限定共有する方法",
    "description": "広告代理店が見込みクライアントへのデモ提案で、動くHTMLページを安全に届けたい方向け。情報漏洩を防ぎながら商談を加速させる認証設定と送付タイミングの考え方を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ad-agency-training-onboarding-limited-share",
    "path": "/articles/ad-agency-training-onboarding-limited-share",
    "title": "広告代理店が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "広告代理店の研修・オンボーディング担当者向け。HTML教材を受講者だけに安全に届けるための認証方式の選択と、研修完了後のアクセス管理の方法を具体的に解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "web-agency-proposal-lp-limited-share",
    "path": "/articles/web-agency-proposal-lp-limited-share",
    "title": "Web制作会社がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "Web制作会社がAI生成の提案LPをクライアントへ安全に届けたい方向け。HTMLのまま3秒で限定公開するための認証設定・事前確認事項・スムーズな承認回収の流れを解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "web-agency-campaign-html-limited-share",
    "path": "/articles/web-agency-campaign-html-limited-share",
    "title": "Web制作会社がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "FTP一時アップロードでは誰でも閲覧でき、社内サーバーではVPN手順を相手に説明する羽目になる。Web制作会社がキャンペーンHTMLをクライアント確認に回すとき、認証付きURLで両方の問題を解消する方法を紹介する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "web-agency-internal-explainer-limited-share",
    "path": "/articles/web-agency-internal-explainer-limited-share",
    "title": "Web制作会社が社内説明ページを社内メンバーに限定共有する方法",
    "description": "Web制作会社が社内向けHTML説明ページを特定メンバーだけに届けたい方向け。会社ドメイン認証や期限付き共有を活用して、情報漏洩と管理コストを同時に下げる方法を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "web-agency-customer-demo-limited-share",
    "path": "/articles/web-agency-customer-demo-limited-share",
    "title": "Web制作会社が顧客向けデモページを見込み客に限定共有する方法",
    "description": "Web制作会社が見込み客向けのデモページを安全に届けたい方向け。競合流出リスクを抑えながら商談を加速させる認証設定の選び方と、成約率を上げる送付文面の工夫を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "web-agency-training-onboarding-limited-share",
    "path": "/articles/web-agency-training-onboarding-limited-share",
    "title": "Web制作会社が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "動くコード例やデザイントークンを埋め込んだHTML教材はPDFより遥かに伝わりやすい。新入エンジニア・デザイナー向けのオンボーディング教材を社内情報を守りながらURLで届ける方法をまとめた。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ec-operator-proposal-lp-limited-share",
    "path": "/articles/ec-operator-proposal-lp-limited-share",
    "title": "EC事業者がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "EC事業者がAI生成の提案LPを安全かつ素早く関係者に届けたい方向け。AIで作ったHTMLの品質確認ポイント・認証設定の選択・承認者を動かす送付文面の書き方を具体的に解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ec-operator-campaign-html-limited-share",
    "path": "/articles/ec-operator-campaign-html-limited-share",
    "title": "EC事業者がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "EC事業者がキャンペーン告知HTMLを解禁前に関係者だけでレビューしたい方向け。情報漏洩リスクを最小化する認証設定の選択と、スムーズに承認を回収する運用手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ec-operator-internal-explainer-limited-share",
    "path": "/articles/ec-operator-internal-explainer-limited-share",
    "title": "EC事業者が社内説明ページを社内メンバーに限定共有する方法",
    "description": "EC事業者が社内向けHTML説明ページを特定メンバーに安全に届けたい担当者向け。商品管理・物流・広告チームへの周知に使える認証設定と、読了を確認するための運用手順を解説します。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ec-operator-customer-demo-limited-share",
    "path": "/articles/ec-operator-customer-demo-limited-share",
    "title": "EC事業者が顧客向けデモページを見込み客に限定共有する方法",
    "description": "EC事業者が見込み客にデモページを共有する際の情報漏洩リスクや認証方式の選び方を解説。パスワード・メール認証の使い分けから送付文面の書き方まで実務的に判断できる記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ec-operator-training-onboarding-limited-share",
    "path": "/articles/ec-operator-training-onboarding-limited-share",
    "title": "EC事業者が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "新メンバーへ研修HTMLを渡すたびにアクセス権設定やメール添付の手間が発生していないだろうか。EC運営ノウハウをまとめた教材を受講者だけが開けるURLで即日配布できる仕組みを解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "consulting-firm-proposal-lp-limited-share",
    "path": "/articles/consulting-firm-proposal-lp-limited-share",
    "title": "コンサル会社がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "コンサル会社がAI生成した提案LPをクライアント限定で共有する際の認証方式選定から、隠すべき社内情報、送付メールの文面設計まで実務視点で解説。情報漏洩を防ぎつつ商談を前進させたい担当者向け。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "consulting-firm-campaign-html-limited-share",
    "path": "/articles/consulting-firm-campaign-html-limited-share",
    "title": "コンサル会社がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "Google Driveではデザインが崩れ、メール添付はサイズ制限に引っかかる——代理店パートナーへのキャンペーンページ事前確認で悩むコンサル会社向けに、HTMLのまま認証付きURLで配布する手順を紹介する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "consulting-firm-internal-explainer-limited-share",
    "path": "/articles/consulting-firm-internal-explainer-limited-share",
    "title": "コンサル会社が社内説明ページを社内メンバーに限定共有する方法",
    "description": "コンサル会社が社内説明ページを特定メンバーに限定共有する際の認証設定・情報管理・文面設計を解説。会社ドメイン認証の活用法や、機密データの削除チェック方法を実務的に説明した記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "consulting-firm-customer-demo-limited-share",
    "path": "/articles/consulting-firm-customer-demo-limited-share",
    "title": "コンサル会社が顧客向けデモページを見込み客に限定共有する方法",
    "description": "コンサル会社が見込み客向けデモページを安全に限定共有する方法を解説。情報漏洩を防ぐ認証方式の選定、HTMLから削除すべき内部データ、商談につながる送付文面の書き方まで実務的にまとめた記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "consulting-firm-training-onboarding-limited-share",
    "path": "/articles/consulting-firm-training-onboarding-limited-share",
    "title": "コンサル会社が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "社内メソドロジーや業界ノウハウが詰まった研修教材は外部流出が一番怖い。汎用クラウドストレージより確実に受講者を絞れる認証付きURL配布の仕組みと、コンサル会社での導入メリットを整理した。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "training-company-proposal-lp-limited-share",
    "path": "/articles/training-company-proposal-lp-limited-share",
    "title": "研修会社がAIで作った提案LPをクライアントに限定共有する方法",
    "description": "研修会社がAI生成の提案LPをクライアント限定で共有する際の実務的な手順を解説。適切な認証方式の選定から、送付前に確認すべき内部情報の有無、フィードバック回収の文面設計まで網羅した記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "training-company-campaign-html-limited-share",
    "path": "/articles/training-company-campaign-html-limited-share",
    "title": "研修会社がキャンペーン告知HTMLを関係者に限定共有する方法",
    "description": "表示環境によって崩れるHTMLファイルを社内担当者や代理店に送り回す手間を省きたい。研修会社がキャンペーン告知を事前確認に回す場面で使える、プレビューURLと認証の組み合わせ方を解説する。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "training-company-internal-explainer-limited-share",
    "path": "/articles/training-company-internal-explainer-limited-share",
    "title": "研修会社が社内説明ページを社内メンバーに限定共有する方法",
    "description": "研修会社が社内向け説明ページを特定メンバーに限定共有する方法を解説。会社ドメイン認証とメール認証の使い分け、HTMLから除くべき社内情報の確認手順、簡潔な社内案内メールの書き方まで実務的にまとめた記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "training-company-customer-demo-limited-share",
    "path": "/articles/training-company-customer-demo-limited-share",
    "title": "研修会社が顧客向けデモページを見込み客に限定共有する方法",
    "description": "研修会社が見込み客にデモページを限定共有する際の情報セキュリティと共有効率を両立する方法を解説。認証方式の選定から送付前の確認事項、商談につながるフィードバック回収の文面例まで実務視点でまとめた記事。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "training-company-training-onboarding-limited-share",
    "path": "/articles/training-company-training-onboarding-limited-share",
    "title": "研修会社が研修・オンボーディング教材を受講者に限定共有する方法",
    "description": "DropboxやGoogle Driveでは閲覧者を絞りにくく、誰がいつ見たかも追えない。研修会社が講師や受講者向けのオンボーディング教材HTMLを認証付きURLで即発行し、アクセスログも把握できる方法をまとめた。",
    "category": "ユースケース",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "vercel-drop-vs-auth-html-share",
    "path": "/articles/vercel-drop-vs-auth-html-share",
    "title": "Vercel Dropと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "WebデザイナーやフロントエンドエンジニアがVercel Dropと認証付きHTML共有サービスをレビュー用途で比べる際、認証・期限・差し替えの各観点で何が違うかを具体的に整理し、どちらを選ぶべきか判断できる記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "vercel-drop-external-review-note",
    "path": "/articles/vercel-drop-external-review-note",
    "title": "Vercel Dropで公開したページを社外レビューに回すときの注意点",
    "description": "Vercel Dropで公開したHTMLページを社外レビューに使おうとしているWebデザイナー・ディレクター向けに、認証不在・URL固定不可・情報漏洩リスクなど見落としがちな注意点を具体的にまとめた記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "vercel-drop-switch-timing",
    "path": "/articles/vercel-drop-switch-timing",
    "title": "Vercel Dropから一時共有URLへ切り替えるタイミング",
    "description": "WebデザイナーやPMがVercel Dropから認証付き一時共有URLへ切り替えるべきタイミングを、プロジェクトの進行フェーズ・相手の属性・情報の機密レベルの観点で整理した記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "vercel-drop-missing-auth-expiry",
    "path": "/articles/vercel-drop-missing-auth-expiry",
    "title": "Vercel Dropでは足りない認証・期限管理をどう補うか",
    "description": "Vercel Dropに認証・期限機能がないことを把握しつつも代替手段が見つからないWebデザイナー・エンジニア向けに、ギガサイト便など認証付きHTML共有サービスを活用した補完方法を具体的に解説した記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "vercel-preview-vs-auth-html-share",
    "path": "/articles/vercel-preview-vs-auth-html-share",
    "title": "Vercel Preview Deploymentsと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "CI/CDと連携したプレビューURLは便利だが、デフォルトで認証がかからない点を見落とすと社外に素のURLが出回る。Vercel Preview Deploymentsと認証付きHTML共有サービスの違いを整理し、レビュー用途での選び方を示す。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "vercel-preview-external-review-note",
    "path": "/articles/vercel-preview-external-review-note",
    "title": "Vercel Preview Deploymentsで公開したページを社外レビューに回すときの注意点",
    "description": "「URLを送れば見てもらえる」という感覚で社外に渡すと、リポジトリ設定次第でセキュリティリスクが生じる。Vercel Preview URLを社外レビューに使う前に確認すべき設定と、安全に共有するための代替手段を解説する。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "vercel-preview-switch-timing",
    "path": "/articles/vercel-preview-switch-timing",
    "title": "Vercel Preview Deploymentsから一時共有URLへ切り替えるタイミング",
    "description": "社外提出が近づいたとき、開発用プレビューURLをそのまま使い続けるリスクに気づいていますか。認証・期限・アクセスログの要件が社内と社外で異なる理由と、切り替えの判断基準を具体的に整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "vercel-preview-missing-auth-expiry",
    "path": "/articles/vercel-preview-missing-auth-expiry",
    "title": "Vercel Preview Deploymentsでは足りない認証・期限管理をどう補うか",
    "description": "取引先へのレビュー依頼に開発用URLを使うと、期限なし・ログなしで誰でも閲覧できる状態が続く恐れがあります。無料・Proプランで不足する認証と期限管理を補うための現実的な対処法を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "netlify-previews-vs-auth-html-share",
    "path": "/articles/netlify-previews-vs-auth-html-share",
    "title": "Netlify Deploy Previewsと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "プルリクエスト自動プレビューは開発チーム内では便利ですが、機密コンテンツを社外へ届ける場面では別の仕組みが必要になります。認証・期限・アクセスログの観点からNetlifyと専用共有サービスの差を比較します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "netlify-previews-external-review-note",
    "path": "/articles/netlify-previews-external-review-note",
    "title": "Netlify Deploy Previewsで公開したページを社外レビューに回すときの注意点",
    "description": "クライアントや取引先にNetlifyのプレビューURLを送る前に把握しておくべきことがあります。デフォルトでは認証がなくURLが流出したときの対処手段も限られるため、社外共有特有のリスクと対策をまとめました。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "netlify-previews-switch-timing",
    "path": "/articles/netlify-previews-switch-timing",
    "title": "Netlify Deploy Previewsから一時共有URLへ切り替えるタイミング",
    "description": "プロジェクトが社外提出フェーズに入ると、開発用プレビューURLでは対応しきれない要件が出てきます。どのタイミングで認証付き一時共有URLへ乗り換えるべきか、判断のポイントを具体的に説明します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "netlify-previews-missing-auth-expiry",
    "path": "/articles/netlify-previews-missing-auth-expiry",
    "title": "Netlify Deploy Previewsでは足りない認証・期限管理をどう補うか",
    "description": "自動ビルドとプレビューURL発行が魅力のNetlifyも、社外共有や機密案件では認証が有料限定・期限管理が手動という壁にぶつかります。不足する機能をどう補うか、選択肢と判断基準を整理しました。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cloudflare-pages-vs-auth-html-share",
    "path": "/articles/cloudflare-pages-vs-auth-html-share",
    "title": "Cloudflare Pagesと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "Webデザイナー・エンジニア向け。Cloudflare Pagesの公開範囲をコントロールしたいが方法がわからず困っている方に、認証付きHTML共有サービスとの機能差を整理し用途別の選択基準を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cloudflare-pages-external-review-note",
    "path": "/articles/cloudflare-pages-external-review-note",
    "title": "Cloudflare Pagesで公開したページを社外レビューに回すときの注意点",
    "description": "Cloudflare Pagesのプレビューを社外クライアントへ送ろうとしているWeb制作者向け。アクセス制限なし公開のリスクや、内部情報の混入チェック、期限設定の代替手段を具体的に解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cloudflare-pages-switch-timing",
    "path": "/articles/cloudflare-pages-switch-timing",
    "title": "Cloudflare Pagesから一時共有URLへ切り替えるタイミング",
    "description": "Cloudflare Pagesをステージングに使っているフロントエンド開発者向け。クライアント共有・外部レビュー・承認フローのどの段階で認証付き一時URLサービスへ切り替えるべきかを、具体的なシナリオで解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cloudflare-pages-missing-auth-expiry",
    "path": "/articles/cloudflare-pages-missing-auth-expiry",
    "title": "Cloudflare Pagesでは足りない認証・期限管理をどう補うか",
    "description": "Cloudflare Pagesの認証・期限管理機能の不足に困っているWeb制作者向け。Cloudflare Accessによる補完方法と、認証付き専用サービスへの切り出しを手順・コスト面で比較し、最適な組み合わせを判断できるよう解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "github-pages-vs-auth-html-share",
    "path": "/articles/github-pages-vs-auth-html-share",
    "title": "GitHub Pagesと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "GitHub Pagesで公開したHTMLをレビューに活用したいエンジニア・デザイナー向け。公開範囲やアクセス制御の仕組みの違いを整理し、認証付き専用サービスとどう使い分けるかを判断できるよう解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "github-pages-external-review-note",
    "path": "/articles/github-pages-external-review-note",
    "title": "GitHub Pagesで公開したページを社外レビューに回すときの注意点",
    "description": "GitHub Pagesのリンクを社外クライアントへ送ることを検討しているWeb制作者・エンジニア向け。情報漏洩リスク・アクセス記録の欠如・期限なし公開の問題点と、それぞれの対処法を具体的に解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "github-pages-switch-timing",
    "path": "/articles/github-pages-switch-timing",
    "title": "GitHub Pagesから一時共有URLへ切り替えるタイミング",
    "description": "GitHub Pagesを開発ステージングに使っているチーム向け。社内確認・クライアント提出・最終承認の各フェーズで、GitHub Pagesから一時共有URLへ切り替えるタイミングと判断基準を具体的に解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "github-pages-missing-auth-expiry",
    "path": "/articles/github-pages-missing-auth-expiry",
    "title": "GitHub Pagesでは足りない認証・期限管理をどう補うか",
    "description": "GitHub Pagesの認証・期限管理の欠如に悩んでいるWebデザイナー・エンジニア向け。外部サービス連携による補完方法と、専用の認証付き共有サービスへの切り出しをコスト・手順面から比較し、最適な選択を判断できるよう解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gitlab-pages-vs-auth-html-share",
    "path": "/articles/gitlab-pages-vs-auth-html-share",
    "title": "GitLab Pagesと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "GitLab Pagesを使っているエンジニアやデザイナー向け。社外クライアントへのレビュー共有を目的とした場合、GitLab Pagesの機能範囲と認証付きHTML共有サービスの違いを整理し、用途別の選択基準を提示します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gitlab-pages-external-review-note",
    "path": "/articles/gitlab-pages-external-review-note",
    "title": "GitLab Pagesで公開したページを社外レビューに回すときの注意点",
    "description": "GitLab PagesのURLを社外クライアントへ共有しようとしているWeb制作者・開発者向け。アカウント要求・アクセス制御なし公開・期限管理の欠如という3つの課題と、それぞれへの対処法を具体的に解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gitlab-pages-switch-timing",
    "path": "/articles/gitlab-pages-switch-timing",
    "title": "GitLab Pagesから一時共有URLへ切り替えるタイミング",
    "description": "GitLab Pagesをステージングとして活用しているチームのリードエンジニア・プロジェクトマネージャー向け。開発フェーズ・社内レビュー・社外提出・承認の各段階で、GitLab Pagesと一時共有URLを使い分けるタイミングを解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gitlab-pages-missing-auth-expiry",
    "path": "/articles/gitlab-pages-missing-auth-expiry",
    "title": "GitLab Pagesでは足りない認証・期限管理をどう補うか",
    "description": "GitLab Pagesを社外共有に使おうとして認証・期限管理の欠如に悩んでいるエンジニア・デザイナー向け。GitLab Accessとの組み合わせ、外部プロキシ経由の認証追加、専用HTML共有サービスの利用を比較し、最適な解決策を選べるよう解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firebase-hosting-vs-auth-html-share",
    "path": "/articles/firebase-hosting-vs-auth-html-share",
    "title": "Firebase Hostingと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "静的サイトを社外に一時公開したいWebディレクターやエンジニア向けに、Firebase Hostingと認証付きHTML共有サービスの機能差を比較。レビュー用途でどちらを選ぶべきか判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firebase-hosting-external-review-note",
    "path": "/articles/firebase-hosting-external-review-note",
    "title": "Firebase Hostingで公開したページを社外レビューに回すときの注意点",
    "description": "「URLを送れば見てもらえる」手軽さの裏に、アクセス制限の欠如や期限切れURLの放置というリスクが潜んでいます。Firebase Hostingで社外レビューを行う際に見落とされやすい注意点を具体的に洗い出します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firebase-hosting-switch-timing",
    "path": "/articles/firebase-hosting-switch-timing",
    "title": "Firebase Hostingから一時共有URLへ切り替えるタイミング",
    "description": "Firebase Hostingで運用中のサイトについて、社外レビューに認証付き一時共有URLを使うべきタイミングを知りたいエンジニア・ディレクター向けの解説。切り替え判断の基準と移行時の注意点が分かります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firebase-hosting-missing-auth-expiry",
    "path": "/articles/firebase-hosting-missing-auth-expiry",
    "title": "Firebase Hostingでは足りない認証・期限管理をどう補うか",
    "description": "Firebase Hostingで認証や閲覧期限が足りないと感じているエンジニア・プロジェクトマネージャー向けに、不足機能の補い方を具体的に比較。追加実装かサービス切り替えかの判断材料が得られます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "aws-amplify-hosting-vs-auth-html-share",
    "path": "/articles/aws-amplify-hosting-vs-auth-html-share",
    "title": "AWS Amplify Hostingと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "AWS Amplify Hostingを使うエンジニアが、社外レビュー用途に同サービスと認証付きHTML共有サービスのどちらを使うべきか迷っている場面向けの比較解説。機能差と用途別の選択基準が分かります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "aws-amplify-hosting-external-review-note",
    "path": "/articles/aws-amplify-hosting-external-review-note",
    "title": "AWS Amplify Hostingで公開したページを社外レビューに回すときの注意点",
    "description": "安定したデプロイ基盤としてAmplifyを使うチームでも、社外承認者にURLを送る段階でアクセス制御や版管理の盲点が生じがちです。Amplify特有の落とし穴と、社外レビューを安全に進める方法を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "aws-amplify-hosting-switch-timing",
    "path": "/articles/aws-amplify-hosting-switch-timing",
    "title": "AWS Amplify Hostingから一時共有URLへ切り替えるタイミング",
    "description": "AWS Amplify Hostingを使うチームが社外レビュー向けに認証付き一時共有URLへ切り替えるタイミングを判断したいエンジニア・PM向けの解説。切り替えの判断基準と移行時の注意点が確認できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "aws-amplify-hosting-missing-auth-expiry",
    "path": "/articles/aws-amplify-hosting-missing-auth-expiry",
    "title": "AWS Amplify Hostingでは足りない認証・期限管理をどう補うか",
    "description": "AWS Amplify Hostingの認証・期限管理の不足を感じているエンジニア・プロジェクトマネージャー向けに、不足機能の原因と補完手段を解説。追加実装か外部サービス導入かの判断に役立ちます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "azure-static-web-apps-vs-auth-html-share",
    "path": "/articles/azure-static-web-apps-vs-auth-html-share",
    "title": "Azure Static Web Appsと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "統合デプロイの便利さとは別に、社外レビュー相手へのアクセス制御という観点ではAzure Static Web Appsに課題があります。認証設定の複雑さと期限管理の手薄さを踏まえ、専用共有サービスとの使い分け基準を示します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "azure-static-web-apps-external-review-note",
    "path": "/articles/azure-static-web-apps-external-review-note",
    "title": "Azure Static Web Appsで公開したページを社外レビューに回すときの注意点",
    "description": "Microsoftエコシステム外の取引先へ共有する場合、標準設定のままでは情報の境界が曖昧になりやすいです。Azure Static Web Appsのプレビュー環境を社外レビューに使う前に確認すべき注意点をまとめます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "azure-static-web-apps-switch-timing",
    "path": "/articles/azure-static-web-apps-switch-timing",
    "title": "Azure Static Web Appsから一時共有URLへ切り替えるタイミング",
    "description": "レビュワーの属性やセキュリティ要件によって、Azure Static Web Appsから認証付き一時URLへ切り替えるタイミングは変わります。どの条件が揃ったら切り替えを検討すべきかを判断できるよう整理しました。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "azure-static-web-apps-missing-auth-expiry",
    "path": "/articles/azure-static-web-apps-missing-auth-expiry",
    "title": "Azure Static Web Appsでは足りない認証・期限管理をどう補うか",
    "description": "「特定のユーザーだけ・期限付きで・アクセス証跡付きで」という社外レビューの要件は、Azure Static Web Appsの標準機能では満たしにくいです。何が欠けていてどう補うかを具体的な選択肢とともに解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gcs-static-hosting-vs-auth-html-share",
    "path": "/articles/gcs-static-hosting-vs-auth-html-share",
    "title": "Google Cloud Storage静的ホスティングと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "GCSの静的ホスティングで社外レビューを行うときに困りやすい認証・期限の課題を整理し、認証付きHTML共有サービスと何が異なるかを具体的に比較します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gcs-static-hosting-external-review-note",
    "path": "/articles/gcs-static-hosting-external-review-note",
    "title": "Google Cloud Storage静的ホスティングで公開したページを社外レビューに回すときの注意点",
    "description": "GCSの静的ホスティングページを社外レビュアーに共有する前に確認すべき情報漏洩リスク・認証設定・運用上の落とし穴を具体的に解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gcs-static-hosting-switch-timing",
    "path": "/articles/gcs-static-hosting-switch-timing",
    "title": "Google Cloud Storage静的ホスティングから一時共有URLへ切り替えるタイミング",
    "description": "GCSの静的ホスティングから一時共有URLサービスへ切り替えるタイミングを判断する基準を解説。認証・期限・アクセス管理の観点から切り替えが必要な状況を具体的に説明します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "gcs-static-hosting-missing-auth-expiry",
    "path": "/articles/gcs-static-hosting-missing-auth-expiry",
    "title": "Google Cloud Storage静的ホスティングでは足りない認証・期限管理をどう補うか",
    "description": "GCSの静的ホスティングが持たない認証・期限管理の課題を整理し、Cloud FunctionsやIAPでの補完方法と専用共有サービスへの切り替えを検討する際の判断基準を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "r2-public-bucket-vs-auth-html-share",
    "path": "/articles/r2-public-bucket-vs-auth-html-share",
    "title": "Cloudflare R2公開バケットと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "コスト効率の高いオブジェクトストレージとして優れるR2も、「誰がいつ何を見たか」を管理したいレビュー用途では機能が不足します。認証・期限・アクセス追跡の観点から専用共有サービスとの違いを比較します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "r2-public-bucket-external-review-note",
    "path": "/articles/r2-public-bucket-external-review-note",
    "title": "Cloudflare R2公開バケットで公開したページを社外レビューに回すときの注意点",
    "description": "公開バケットのURLをそのままクライアントへ送ることの何が問題なのか、具体的なリスクを知らないと判断できません。情報漏洩と運用ミスを防ぐための確認事項をステップごとに整理しました。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "r2-public-bucket-switch-timing",
    "path": "/articles/r2-public-bucket-switch-timing",
    "title": "Cloudflare R2公開バケットから一時共有URLへ切り替えるタイミング",
    "description": "アクセス相手・コンテンツの機密性・期限管理の必要性の3点が揃ったとき、R2公開バケットから一時共有URLへの切り替えを検討する時期です。判断を迷わないための具体的な基準を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "r2-public-bucket-missing-auth-expiry",
    "path": "/articles/r2-public-bucket-missing-auth-expiry",
    "title": "Cloudflare R2公開バケットでは足りない認証・期限管理をどう補うか",
    "description": "手軽にHTMLを公開できるR2も、「誰に」「いつまで」見せるかを制御する機能は標準で備わっていません。不足する認証と期限管理を補う選択肢をチームの規模別に整理し、最適な組み合わせを提案します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "notion-page-vs-auth-html-share",
    "path": "/articles/notion-page-vs-auth-html-share",
    "title": "Notionページと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "相手のツール環境に依存せず独自デザインのHTMLを安全に届けたいとき、Notionの共有機能では限界があります。レビュー用途に絞って、Notionページと認証付きHTML共有サービスの違いを比較します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "notion-page-external-review-note",
    "path": "/articles/notion-page-external-review-note",
    "title": "Notionページで公開したページを社外レビューに回すときの注意点",
    "description": "NotionページをWebで公開して社外レビューに回す際の情報漏洩リスク・公開範囲の設定確認・レビュー後の非公開化手順を、Notion固有の仕様とともに解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "notion-page-switch-timing",
    "path": "/articles/notion-page-switch-timing",
    "title": "Notionページから一時共有URLへ切り替えるタイミング",
    "description": "Notionページから一時共有URLサービスへの切り替えタイミングを解説。Notionの公開機能が対応できなくなる条件と、認証・期限付き共有サービスへの移行判断基準を整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "notion-page-missing-auth-expiry",
    "path": "/articles/notion-page-missing-auth-expiry",
    "title": "Notionページでは足りない認証・期限管理をどう補うか",
    "description": "Notionページが持たない認証・期限管理の課題を整理し、ゲスト招待・外部サービス連携・専用共有サービスへの切り替えを比較しながら適切な補完策を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-sites-vs-auth-html-share",
    "path": "/articles/google-sites-vs-auth-html-share",
    "title": "Google Sitesと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "Webデザイナーや制作ディレクターが社外レビューを依頼する際、Google Sitesと認証付きHTML共有サービスのどちらを選ぶべきか悩む場面向けに、認証方式・期限設定・差し替え運用の違いを具体的に解説し、用途別の判断基準を提示する記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-sites-external-review-note",
    "path": "/articles/google-sites-external-review-note",
    "title": "Google Sitesで公開したページを社外レビューに回すときの注意点",
    "description": "Google Sitesで制作したWebページを社外のレビュアーやクライアントに共有する際に見落とされがちな、公開範囲設定・Googleアカウント有無の問題・情報残存リスク・修正差し替えのタイミングについて、担当者が直面する具体的なトラブルを軸に解説する記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-sites-switch-timing",
    "path": "/articles/google-sites-switch-timing",
    "title": "Google Sitesから一時共有URLへ切り替えるタイミング",
    "description": "HTMLページの管理にGoogle Sitesを使っているデザイナーや制作担当者が、どのタイミングで認証付き一時共有URLへ切り替えるべきかを、制作フェーズ・受け手の属性・機密レベルという3つの軸から判断できるよう解説した記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-sites-missing-auth-expiry",
    "path": "/articles/google-sites-missing-auth-expiry",
    "title": "Google Sitesでは足りない認証・期限管理をどう補うか",
    "description": "Google Sitesを社外共有に使っているWebデザイナーや制作会社の担当者向けに、パスワード認証・メール認証・アクセス期限の各機能がどこで不足するかを整理し、認証付きHTML共有サービスとの組み合わせで穴を埋める運用方法を解説する記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "canva-websites-vs-auth-html-share",
    "path": "/articles/canva-websites-vs-auth-html-share",
    "title": "Canva Websitesと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "デザイナーやマーケターがCanva Websitesと認証付きHTML共有サービスをレビュー用途で使い比べる際に、アクセス制限・公開期限・差し替え操作の違いを具体的に解説し、どちらを選ぶべきかの基準を提示する記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "canva-websites-external-review-note",
    "path": "/articles/canva-websites-external-review-note",
    "title": "Canva Websitesで公開したページを社外レビューに回すときの注意点",
    "description": "Canva Websitesで制作したページを社外の関係者やクライアントにレビュー依頼する際、確認すべき公開設定・個人情報リスク・旧URLの残存・期限管理の問題点を制作ディレクターや個人クリエイター向けに具体的に解説する記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "canva-websites-switch-timing",
    "path": "/articles/canva-websites-switch-timing",
    "title": "Canva Websitesから一時共有URLへ切り替えるタイミング",
    "description": "Canva Websitesを使って制作物を共有しているクリエイターや制作ディレクターが、認証付き一時共有URLへ切り替えるべき具体的なタイミングを、コンテンツの機密レベル・レビュアーの属性・フェーズの進行状況から判断できるよう説明した記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "canva-websites-missing-auth-expiry",
    "path": "/articles/canva-websites-missing-auth-expiry",
    "title": "Canva Websitesでは足りない認証・期限管理をどう補うか",
    "description": "Canva Websitesを社外共有に使うデザイナーや担当者向けに、パスワード認証しか持たないCanvaの弱点を整理し、メール認証・ドメイン認証・自動期限設定を持つ認証付きHTML共有サービスとの組み合わせで安全な共有運用を実現する方法を解説した記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "framer-vs-auth-html-share",
    "path": "/articles/framer-vs-auth-html-share",
    "title": "Framerと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "プロダクトデザイナーやWebクリエイターがFramerと認証付きHTML共有サービスをレビュー用途で使い分ける際の判断基準を、アクセス制限・期限設定・ファイル形式の観点から比較し、それぞれが向くシナリオを具体的に解説した記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "framer-external-review-note",
    "path": "/articles/framer-external-review-note",
    "title": "Framerで公開したページを社外レビューに回すときの注意点",
    "description": "Framerを使って制作したウェブページやプロトタイプを社外のクライアント・パートナーにレビュー依頼する際に注意すべき公開設定の確認方法・情報漏えいリスク・バージョン管理・期限管理の問題を実務視点で解説した記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "framer-switch-timing",
    "path": "/articles/framer-switch-timing",
    "title": "Framerから一時共有URLへ切り替えるタイミング",
    "description": "Framerを使って制作物を共有しているプロダクトデザイナーや制作チームが、どの段階で認証付き一時共有URLへ切り替えるべきかを、コンテンツの機密性・レビュアーの所属・フェーズの進行の3軸から判断できるよう解説した記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "framer-missing-auth-expiry",
    "path": "/articles/framer-missing-auth-expiry",
    "title": "Framerでは足りない認証・期限管理をどう補うか",
    "description": "Framerを使っているデザイナーや制作チームが、パスワード以外の認証手段・公開期限の自動設定・アクセスログという3点の不足を認識し、認証付きHTML共有サービスを組み合わせた安全な社外共有フローを構築するための参考記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webflow-vs-auth-html-share",
    "path": "/articles/webflow-vs-auth-html-share",
    "title": "Webflowと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "WebflowとギガサイトのようなHTML共有サービスの機能差を比較。社外レビュー・顧客確認で認証や期限管理が必要なデザイナーが、どちらを選ぶべきか判断できる記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webflow-external-review-note",
    "path": "/articles/webflow-external-review-note",
    "title": "Webflowで公開したページを社外レビューに回すときの注意点",
    "description": "Webflowで作ったページを社外レビューに回す前に確認すべき事項を整理。個人情報漏洩リスク・認証設定・期限管理の観点から、安全かつスムーズなレビュー運用を実現したい担当者向けの記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webflow-switch-timing",
    "path": "/articles/webflow-switch-timing",
    "title": "Webflowから一時共有URLへ切り替えるタイミング",
    "description": "Webflowのプレビュー公開と認証付き一時共有URLをどのタイミングで使い分けるか解説。デザイン確認・社内承認・顧客レビューの各フェーズで最適な共有方法を選びたい制作者向けの記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webflow-missing-auth-expiry",
    "path": "/articles/webflow-missing-auth-expiry",
    "title": "Webflowでは足りない認証・期限管理をどう補うか",
    "description": "WebflowにはないURL単位の認証・期限管理機能をどう補うかを解説。社外レビューや段階的な承認フローを持つデザイナー・Webディレクターが補完ツールの選び方を判断できる記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "studio-vs-auth-html-share",
    "path": "/articles/studio-vs-auth-html-share",
    "title": "STUDIOと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "STUDIOとギガサイト便のようなHTML認証共有サービスの機能差を比較。社外レビューや段階的な顧客確認フローに適した共有方法を選びたいWebデザイナー・ディレクター向けの記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "studio-external-review-note",
    "path": "/articles/studio-external-review-note",
    "title": "STUDIOで公開したページを社外レビューに回すときの注意点",
    "description": "STUDIOで作ったページを社外レビューに回す前に必要な確認事項を解説。認証・期限・情報漏洩リスクの観点から、安心して顧客共有できる体制を作りたいデザイナー・ディレクター向けの記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "studio-switch-timing",
    "path": "/articles/studio-switch-timing",
    "title": "STUDIOから一時共有URLへ切り替えるタイミング",
    "description": "STUDIOのプレビュー共有から認証付き一時URLへの切り替えタイミングを解説。デザイン確認・社内承認・顧客レビューのフェーズで何を使い分けるべきか迷うデザイナー向けの記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "studio-missing-auth-expiry",
    "path": "/articles/studio-missing-auth-expiry",
    "title": "STUDIOでは足りない認証・期限管理をどう補うか",
    "description": "STUDIOに備わっていない認証・期限管理機能を外部サービスで補う方法を解説。社外レビュー・承認フロー・未発表コンテンツの共有が必要なSTUDIOユーザーが補完策を選べるようになる記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "peraichi-vs-auth-html-share",
    "path": "/articles/peraichi-vs-auth-html-share",
    "title": "ペライチと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "作成途中のページを特定の相手だけに期限を決めて届けたい場面で、ペライチの標準共有機能では対応が難しいことがあります。レビュー用途に絞って、認証付きHTML共有サービスとの使い分けを解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "peraichi-external-review-note",
    "path": "/articles/peraichi-external-review-note",
    "title": "ペライチで公開したページを社外レビューに回すときの注意点",
    "description": "ペライチ制作ページを社外レビューに回す前の確認事項を解説。情報漏洩リスク・認証の必要性・期限管理の観点から、顧客・取引先への安全な共有方法を検討しているWebデザイナー・マーケター向けの記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "peraichi-switch-timing",
    "path": "/articles/peraichi-switch-timing",
    "title": "ペライチから一時共有URLへ切り替えるタイミング",
    "description": "ペライチのプレビューから認証付き一時URLへ切り替えるタイミングを解説。社内確認・承認・社外レビューの各フェーズで最適な共有方法を選べるようになりたいWebデザイナー・マーケター向けの記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "peraichi-missing-auth-expiry",
    "path": "/articles/peraichi-missing-auth-expiry",
    "title": "ペライチでは足りない認証・期限管理をどう補うか",
    "description": "ペライチが持たない認証・期限管理機能を外部サービスで補完する方法を解説。社外への途中確認や複数段階の承認フローを持つデザイナー・マーケターが補完ツールの選び方を判断できる記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wix-vs-auth-html-share",
    "path": "/articles/wix-vs-auth-html-share",
    "title": "Wixと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "WixとギガサイトなどのHTML共有サービスを比較し、社外レビューや期限付き共有に本当に必要な認証・アクセス制限の機能差をわかりやすく解説。どちらを使うべきか判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wix-external-review-note",
    "path": "/articles/wix-external-review-note",
    "title": "Wixで公開したページを社外レビューに回すときの注意点",
    "description": "Wixで制作したページを社外レビューに出す前に確認すべきセキュリティ設定・共有方法を解説。パスワード保護の限界と、認証付き共有サービスで補う方法を知りたい担当者向けの記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wix-switch-timing",
    "path": "/articles/wix-switch-timing",
    "title": "Wixから一時共有URLへ切り替えるタイミング",
    "description": "Wixでサイト制作中に社外共有が必要になったとき、Wixのまま使い続けるか一時共有URLサービスに切り替えるかの判断基準を解説。タイミング別の推奨手順も紹介します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wix-missing-auth-expiry",
    "path": "/articles/wix-missing-auth-expiry",
    "title": "Wixでは足りない認証・期限管理をどう補うか",
    "description": "Wixが持つパスワード保護の限界と、メール認証・ドメイン認証・期限設定を補う方法を具体的に解説。社外に安全にHTML共有したいWeb担当者やデザイナーが判断材料を得られる記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "squarespace-vs-auth-html-share",
    "path": "/articles/squarespace-vs-auth-html-share",
    "title": "Squarespaceと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "SquarespaceとギガサイトなどのHTML共有サービスを比較し、社外レビューや期限付き共有に必要な認証・アクセス制限の違いを解説。レビュー用途でどちらを選ぶべきか判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "squarespace-external-review-note",
    "path": "/articles/squarespace-external-review-note",
    "title": "Squarespaceで公開したページを社外レビューに回すときの注意点",
    "description": "Squarespaceで作ったページを社外レビューに出す際の手順と注意点を解説。パスワード保護の設定方法から認証付き共有サービスで補う方法まで、Web制作担当者やデザイナーが参照できる実用記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "squarespace-switch-timing",
    "path": "/articles/squarespace-switch-timing",
    "title": "Squarespaceから一時共有URLへ切り替えるタイミング",
    "description": "Squarespaceで制作中のページを外部に共有するタイミングで、そのままSquarespaceを使うか一時共有URLサービスに切り替えるかの判断軸を解説。フェーズ別の推奨手順も紹介します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "squarespace-missing-auth-expiry",
    "path": "/articles/squarespace-missing-auth-expiry",
    "title": "Squarespaceでは足りない認証・期限管理をどう補うか",
    "description": "Squarespaceのパスワード保護では不十分な認証・期限管理の課題を整理し、メール認証や自動期限失効で補う方法を解説。外部共有のセキュリティを強化したいデザイナーや担当者向けの実践記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wordpress-com-vs-auth-html-share",
    "path": "/articles/wordpress-com-vs-auth-html-share",
    "title": "WordPress.comと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "WordPress.comとギガサイトなどのHTML共有サービスを機能面で比較し、社外レビューや期限付き共有に必要な認証・アクセス制限の違いを解説。用途に合った選択判断ができる比較記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wordpress-com-external-review-note",
    "path": "/articles/wordpress-com-external-review-note",
    "title": "WordPress.comで公開したページを社外レビューに回すときの注意点",
    "description": "WordPress.comで制作したページを社外レビューに出す前に確認すべき設定と手順を解説。パスワード保護の設定方法から、認証付き共有サービスで補う方法まで、Web担当者向けに実用的にまとめた記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wordpress-com-switch-timing",
    "path": "/articles/wordpress-com-switch-timing",
    "title": "WordPress.comから一時共有URLへ切り替えるタイミング",
    "description": "WordPress.comで制作中のページを外部共有するとき、そのままWordPress.comを使うか一時共有URLサービスに切り替えるかの判断基準を解説。タイミング別の推奨手順も紹介します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wordpress-com-missing-auth-expiry",
    "path": "/articles/wordpress-com-missing-auth-expiry",
    "title": "WordPress.comでは足りない認証・期限管理をどう補うか",
    "description": "WordPress.comが不足しているメール認証・会社ドメイン認証・期限自動失効の機能を具体的に解説し、補完する方法を紹介。社外レビューのセキュリティを強化したいWordPress.comユーザー向けの実用記事です。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "shopify-vs-auth-html-share",
    "path": "/articles/shopify-vs-auth-html-share",
    "title": "Shopifyと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "ShopifyとギガサイトのようなHTML共有サービスの機能差を整理したい制作担当者向け。認証・期限・差し替えの観点でどちらがレビュー用途に適しているかを具体的に判断できる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "shopify-external-review-note",
    "path": "/articles/shopify-external-review-note",
    "title": "Shopifyで公開したページを社外レビューに回すときの注意点",
    "description": "Shopifyページをクライアントやパートナーなどへのレビューに使いたい担当者向け。送付前の確認事項・認証の選び方・修正後の差し替え運用まで具体的に解説し、情報漏洩リスクを下げる判断ができる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "shopify-switch-timing",
    "path": "/articles/shopify-switch-timing",
    "title": "Shopifyから一時共有URLへ切り替えるタイミング",
    "description": "Shopifyでページ制作中に一時共有URLへ切り替えるべき場面を知りたい担当者向け。開発フェーズごとに適切な共有方法を判断でき、情報管理と確認効率を両立するタイミングが分かる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "shopify-missing-auth-expiry",
    "path": "/articles/shopify-missing-auth-expiry",
    "title": "Shopifyでは足りない認証・期限管理をどう補うか",
    "description": "Shopifyの認証・期限管理の不足に気づいた担当者向け。何が足りないのかを明確にし、パスワード認証・メール認証・期限URL切れを使ってShopifyの弱点を補う具体策を判断できる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "base44-vs-auth-html-share",
    "path": "/articles/base44-vs-auth-html-share",
    "title": "Base44と認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "Base44で作ったページをクライアントやパートナーにレビューしてもらいたい担当者向け。認証・期限・差し替え運用の観点で、Base44の共有機能と専用HTML共有サービスをどう使い分けるかを判断できる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "base44-external-review-note",
    "path": "/articles/base44-external-review-note",
    "title": "Base44で公開したページを社外レビューに回すときの注意点",
    "description": "Base44で生成したページを社外レビューに使いたいが、何を準備すれば安全か確認したい担当者向け。送付前チェック・認証の選択肢・差し替え運用の要点を把握し、情報管理ミスを防げる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "base44-switch-timing",
    "path": "/articles/base44-switch-timing",
    "title": "Base44から一時共有URLへ切り替えるタイミング",
    "description": "Base44でプロトタイプを作る開発者・デザイナーが、社内共有から社外レビューへ切り替えるべきタイミングを把握したい場合向け。フェーズごとの適切な共有方法を整理し、過剰・過少な管理を避ける判断軸を示す。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "base44-missing-auth-expiry",
    "path": "/articles/base44-missing-auth-expiry",
    "title": "Base44では足りない認証・期限管理をどう補うか",
    "description": "Base44の認証・期限管理の限界を知り、外部サービスで補完したい担当者向け。何が不足しているかを整理したうえで、パスワード・メール認証・期限URLの3つの補完策を具体的に選べるようになる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "lovable-vs-auth-html-share",
    "path": "/articles/lovable-vs-auth-html-share",
    "title": "Lovableと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "LovableとHTML共有サービスの機能差を比較したいWeb開発者・デザイナー向け。認証・期限・差し替えの3つの軸でどちらを選ぶかを判断し、レビュー用途に最適な組み合わせを決めるための記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "lovable-external-review-note",
    "path": "/articles/lovable-external-review-note",
    "title": "Lovableで公開したページを社外レビューに回すときの注意点",
    "description": "Lovableで作ったページを社外レビューに使いたいが何を確認すればよいか迷っている担当者向け。送付前チェック・認証の選択肢・修正差し替え運用を一通り把握し、情報漏洩と誤承認のリスクを下げられる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "lovable-switch-timing",
    "path": "/articles/lovable-switch-timing",
    "title": "Lovableから一時共有URLへ切り替えるタイミング",
    "description": "Lovableを使うWeb開発者が、社内共有から社外レビューへ切り替えるタイミングと方法を知りたい場合向け。フェーズごとの適切な共有手段と判断基準を整理し、過剰・過少な管理を避けられる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "lovable-missing-auth-expiry",
    "path": "/articles/lovable-missing-auth-expiry",
    "title": "Lovableでは足りない認証・期限管理をどう補うか",
    "description": "Lovableの認証・期限管理の不足を把握し、何で補えばよいか判断したい担当者向け。不足している機能を具体的に整理したうえで、パスワード・メール認証・期限URLを使った3つの補完策を理解できる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "replit-vs-auth-html-share",
    "path": "/articles/replit-vs-auth-html-share",
    "title": "Replitと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "デザイン・コーディング成果物を社外にレビューしてもらいたいが、Replitで十分か迷っている方向け。認証・期限・差し替えの3軸でどちらを選ぶべきか判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "replit-external-review-note",
    "path": "/articles/replit-external-review-note",
    "title": "Replitで公開したページを社外レビューに回すときの注意点",
    "description": "Replitで制作物を社外担当者にレビューしてもらおうとしている方向け。アクセス制御・情報漏えい・バージョン混乱を防ぐための送信前チェックと代替手段がわかります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "replit-switch-timing",
    "path": "/articles/replit-switch-timing",
    "title": "Replitから一時共有URLへ切り替えるタイミング",
    "description": "Replitで作ったHTMLを外部に共有したい開発者・デザイナー向け。どの段階でReplitから認証付き一時URLサービスに切り替えるべきかの判断基準が明確になります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "replit-missing-auth-expiry",
    "path": "/articles/replit-missing-auth-expiry",
    "title": "Replitでは足りない認証・期限管理をどう補うか",
    "description": "ReplitでHTMLを共有しているが認証や期限設定がなくて不安という方向け。不足している機能を補うための現実的な手段と、用途別のサービス選択基準が理解できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "stackblitz-vs-auth-html-share",
    "path": "/articles/stackblitz-vs-auth-html-share",
    "title": "StackBlitzと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "StackBlitzのプレビューURLで社外レビューをしているが不安を感じている方向け。認証・期限・差し替えの観点でどちらのサービスが向いているかを比較し、選択基準が明確になります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "stackblitz-external-review-note",
    "path": "/articles/stackblitz-external-review-note",
    "title": "StackBlitzで公開したページを社外レビューに回すときの注意点",
    "description": "StackBlitzのプレビューURLを社外担当者に送ろうとしているエンジニア・デザイナー向け。送付前チェック、アクセス制御の限界、代替手段の選び方が理解できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "stackblitz-switch-timing",
    "path": "/articles/stackblitz-switch-timing",
    "title": "StackBlitzから一時共有URLへ切り替えるタイミング",
    "description": "StackBlitzで開発しながら共有URLの切り替えタイミングを検討しているエンジニア向け。フェーズ別の判断基準と、切り替え後の運用フローが明確になります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "stackblitz-missing-auth-expiry",
    "path": "/articles/stackblitz-missing-auth-expiry",
    "title": "StackBlitzでは足りない認証・期限管理をどう補うか",
    "description": "StackBlitzのプレビューURLで共有しているが認証や期限設定がなくて不安という方向け。StackBlitzで不足している機能を補う現実的な方法と切り替えの判断基準が理解できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "codesandbox-vs-auth-html-share",
    "path": "/articles/codesandbox-vs-auth-html-share",
    "title": "CodeSandboxと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "CodeSandboxのプレビューURLで社外レビューができるか迷っているエンジニア・デザイナー向け。認証・期限・運用の3軸で向き不向きを比較し、どちらを選ぶべきか判断できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "codesandbox-external-review-note",
    "path": "/articles/codesandbox-external-review-note",
    "title": "CodeSandboxで公開したページを社外レビューに回すときの注意点",
    "description": "CodeSandboxのURLを社外担当者に送る前に読んでほしい方向け。アクセス制御・表示安定性・バージョン管理の3つのリスクと具体的な対処法が理解できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "codesandbox-switch-timing",
    "path": "/articles/codesandbox-switch-timing",
    "title": "CodeSandboxから一時共有URLへ切り替えるタイミング",
    "description": "CodeSandboxで開発しながら共有のタイミングを迷っているエンジニア・デザイナー向け。認証付き一時URLへの切り替えタイミングと、その後の運用フローが明確になります。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "codesandbox-missing-auth-expiry",
    "path": "/articles/codesandbox-missing-auth-expiry",
    "title": "CodeSandboxでは足りない認証・期限管理をどう補うか",
    "description": "CodeSandboxで共有しているが認証や期限管理の手段がなくて困っている方向け。不足機能を補う方法の選択肢と、開発環境を変えずに共有フェーズだけ改善する実践的な手順が理解できます。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "glitch-vs-auth-html-share",
    "path": "/articles/glitch-vs-auth-html-share",
    "title": "Glitchと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "WebプレビューをGlitchで共有しようとしているデザイナー・開発者向け。認証なし公開のリスクと、パスワード・メール認証・有効期限を備えた専用サービスとの機能差を具体的に解説し、用途別の選択指針を示します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "glitch-external-review-note",
    "path": "/articles/glitch-external-review-note",
    "title": "Glitchで公開したページを社外レビューに回すときの注意点",
    "description": "Glitchのプレビューを社外レビューに使おうとしているWeb担当者向け。認証なし公開のセキュリティ課題と、メール認証・パスワード設定・期限管理を備えた代替手段への切り替え判断基準を実務的に説明します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "glitch-switch-timing",
    "path": "/articles/glitch-switch-timing",
    "title": "Glitchから一時共有URLへ切り替えるタイミング",
    "description": "GlitchでHTMLを作り社内外に共有しようとしている方向け。開発用プラットフォームのまま共有を続けるリスクと、認証・期限付き一時URLへの切り替えが必要になるタイミングの判断基準を実例を交えて説明します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "glitch-missing-auth-expiry",
    "path": "/articles/glitch-missing-auth-expiry",
    "title": "Glitchでは足りない認証・期限管理をどう補うか",
    "description": "Glitchでプレビューを共有しているが認証や期限管理の欠如が気になる方向け。Glitchが持たない機能の範囲を整理し、専用の認証付きHTML共有サービスや外部認証との組み合わせで不足を補う実践的な方法を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "codepen-vs-auth-html-share",
    "path": "/articles/codepen-vs-auth-html-share",
    "title": "CodePenと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "CodePenでHTMLを作り社外レビューに使おうとしているデザイナー・フロントエンド担当者向け。CodePenの共有機能の限界と、パスワード・メール認証・有効期限を備えた専用サービスとの違いを解説し、案件ごとの選択基準を示します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "codepen-external-review-note",
    "path": "/articles/codepen-external-review-note",
    "title": "CodePenで公開したページを社外レビューに回すときの注意点",
    "description": "CodePenのプレビューを社外レビューに使おうとしているフロントエンドエンジニア・Web担当者向け。デフォルト公開設定が持つリスクと、認証・期限管理・アクセス追跡を備えた専用サービスへの切り替え基準を実務的に解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "codepen-switch-timing",
    "path": "/articles/codepen-switch-timing",
    "title": "CodePenから一時共有URLへ切り替えるタイミング",
    "description": "CodePenでHTMLを作り社内外に共有しているデザイナー・開発者向け。開発ツールのまま外部共有を続けるリスクと、認証・期限付き一時URLへ切り替えが必要になるタイミングの判断基準を実例で説明します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "codepen-missing-auth-expiry",
    "path": "/articles/codepen-missing-auth-expiry",
    "title": "CodePenでは足りない認証・期限管理をどう補うか",
    "description": "CodePenで社外共有を行っているが認証・期限管理の不足が気になる方向け。CodePenが持たない機能を明確にし、パスワード認証・メール認証・期限設定を備えた専用サービスとの組み合わせで不足を補う実践的な手順を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "jsfiddle-vs-auth-html-share",
    "path": "/articles/jsfiddle-vs-auth-html-share",
    "title": "JSFiddleと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "JSFiddleでHTMLプレビューを共有しようとしているエンジニア・デザイナー向け。JSFiddleの共有機能が持つ制限と、パスワード・メール認証・有効期限を備えた専用サービスとの違いを解説し、レビュー用途での選択基準を明示します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "jsfiddle-external-review-note",
    "path": "/articles/jsfiddle-external-review-note",
    "title": "JSFiddleで公開したページを社外レビューに回すときの注意点",
    "description": "JSFiddleのFiddleを社外レビューに使おうとしているフロントエンドエンジニア向け。全件公開設定が持つリスクと、認証・期限管理・アクセス追跡を備えた専用サービスへの切り替え基準を実務的に説明します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "jsfiddle-switch-timing",
    "path": "/articles/jsfiddle-switch-timing",
    "title": "JSFiddleから一時共有URLへ切り替えるタイミング",
    "description": "JSFiddleでプロトタイプを作り社内外に共有しているエンジニア向け。開発ツールのまま共有を続けるリスクと、認証・期限付き一時URLへの切り替えが必要になるタイミングの判断基準を実例で説明します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "jsfiddle-missing-auth-expiry",
    "path": "/articles/jsfiddle-missing-auth-expiry",
    "title": "JSFiddleでは足りない認証・期限管理をどう補うか",
    "description": "JSFiddleで社外レビューを行っているが認証・期限管理の不足が気になる方向け。JSFiddleが持たない機能の範囲を正確に把握し、専用のHTML共有サービスや認証システムとの組み合わせで実務上の不足を補う方法を解説します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "figma-prototype-vs-auth-html-share",
    "path": "/articles/figma-prototype-vs-auth-html-share",
    "title": "Figma Prototypeと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "FigmaのプロトタイプリンクとギガサイトなどHTML共有サービスを比較。社外レビューや期限管理が必要なシーンでどちらを選ぶべきか判断できる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "figma-prototype-external-review-note",
    "path": "/articles/figma-prototype-external-review-note",
    "title": "Figma Prototypeで公開したページを社外レビューに回すときの注意点",
    "description": "FigmaプロトタイプリンクをクライアントなどFigma外部ユーザーに共有するとき特有の注意点を解説。認証・期限・情報管理の観点で事前に確認すべき項目が把握できる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "figma-prototype-switch-timing",
    "path": "/articles/figma-prototype-switch-timing",
    "title": "Figma Prototypeから一時共有URLへ切り替えるタイミング",
    "description": "Figma Prototypeから認証付きHTML共有URLへの切り替えタイミングを解説。コーディング移行期・社外公開・アクセス制御が必要になる節目での判断基準が分かる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "figma-prototype-missing-auth-expiry",
    "path": "/articles/figma-prototype-missing-auth-expiry",
    "title": "Figma Prototypeでは足りない認証・期限管理をどう補うか",
    "description": "Figma Prototypeにはない認証機能と期限設定の不足を補う方法を比較解説。社外クライアントや機密案件でHTML共有サービスを組み合わせる判断基準が分かる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "figma-sites-vs-auth-html-share",
    "path": "/articles/figma-sites-vs-auth-html-share",
    "title": "Figma Sitesと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "Figma Sitesとギガサイト便などHTML共有サービスの機能差を比較。デザインレビュー・社外公開・実装確認のどのフェーズで何を選ぶべきか判断できる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "figma-sites-external-review-note",
    "path": "/articles/figma-sites-external-review-note",
    "title": "Figma Sitesで公開したページを社外レビューに回すときの注意点",
    "description": "Figma Sitesを社外レビューに使うときに確認すべき事前チェック項目を整理。アクセス制限のない公開ページを安全に運用するための具体的な注意点が分かる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "figma-sites-switch-timing",
    "path": "/articles/figma-sites-switch-timing",
    "title": "Figma Sitesから一時共有URLへ切り替えるタイミング",
    "description": "Figma Sitesから認証付きHTML共有URLへ切り替えるタイミングの判断基準を解説。実装移行・社外提出・期限管理が必要になる節目での具体的なサインが分かる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "figma-sites-missing-auth-expiry",
    "path": "/articles/figma-sites-missing-auth-expiry",
    "title": "Figma Sitesでは足りない認証・期限管理をどう補うか",
    "description": "Figma Sitesにはない認証・期限管理機能を補うための実践的な方法を解説。社外提出や機密案件でHTML共有サービスをどう組み合わせるか、判断基準と具体手順が分かる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "miro-vs-auth-html-share",
    "path": "/articles/miro-vs-auth-html-share",
    "title": "Miroと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "MiroとギガサイトなどHTML共有サービスを比較。社外レビューやHTML成果物のアクセス管理が必要なシーンでどちらを選ぶべきか判断できる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "miro-external-review-note",
    "path": "/articles/miro-external-review-note",
    "title": "Miroで公開したページを社外レビューに回すときの注意点",
    "description": "Miroのボードを社外関係者にレビューしてもらうときの注意点を解説。アクセス制御・個人情報の取り扱い・フィードバック収集の方法を実務目線で整理した記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "miro-switch-timing",
    "path": "/articles/miro-switch-timing",
    "title": "Miroから一時共有URLへ切り替えるタイミング",
    "description": "Miroから認証付きHTML共有URLへ切り替えるタイミングを具体的に解説。コーディング移行・正式提出・情報管理が必要になる節目の判断基準が分かる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "miro-missing-auth-expiry",
    "path": "/articles/miro-missing-auth-expiry",
    "title": "Miroでは足りない認証・期限管理をどう補うか",
    "description": "Miroにない認証・期限管理機能を補う実践的な方法を解説。社外提出や情報管理が厳しい案件でHTML共有サービスを組み合わせる手順と選択基準が分かる。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "figjam-vs-auth-html-share",
    "path": "/articles/figjam-vs-auth-html-share",
    "title": "FigJamと認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "WebデザイナーやディレクターがFigJamと認証付きHTML共有サービスをレビュー用途で比較したいときに、認証方式・期限設定・差し替え運用の違いを具体的に把握して選択できるようになる記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "figjam-external-review-note",
    "path": "/articles/figjam-external-review-note",
    "title": "FigJamで公開したページを社外レビューに回すときの注意点",
    "description": "制作物をFigJamで社外レビューに回そうとしているデザイナー・ディレクター向けに、アクセス制御・情報漏えいリスク・レビュー期限の管理不足を事前に確認するための実践的な注意点を解説する記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "figjam-switch-timing",
    "path": "/articles/figjam-switch-timing",
    "title": "FigJamから一時共有URLへ切り替えるタイミング",
    "description": "FigJamを社内フェーズで使い、社外向けに一時共有URLへ切り替えるタイミングを知りたいWebデザイナー・制作ディレクター向けに、切り替え判断の条件と移行手順を具体的に解説する記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "figjam-missing-auth-expiry",
    "path": "/articles/figjam-missing-auth-expiry",
    "title": "FigJamでは足りない認証・期限管理をどう補うか",
    "description": "FigJamの認証・期限管理が不足していると気づいたデザイナーや制作チームが、社外レビューでのリスクを把握し、認証付きHTML共有サービスを組み合わせて補う方法を理解するための記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pdf-share-vs-auth-html-share",
    "path": "/articles/pdf-share-vs-auth-html-share",
    "title": "PDF共有と認証付きHTML共有サービスの違い｜レビュー用途で選ぶ基準",
    "description": "汎用性の高いPDFでも、インタラクションやレスポンシブ表示が絡む成果物には限界があります。実装済みHTMLをそのまま届けられる認証付き共有サービスと、用途・セキュリティ面での違いを整理します。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pdf-share-external-review-note",
    "path": "/articles/pdf-share-external-review-note",
    "title": "PDF共有で公開したページを社外レビューに回すときの注意点",
    "description": "PDFを社外レビューに使っているデザイナーや制作担当者が、アクセス管理・バージョン混在・個人情報漏えいのリスクを事前に把握し、認証付きHTML共有サービスへの切り替え判断に役立てるための実践的な注意点記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pdf-share-switch-timing",
    "path": "/articles/pdf-share-switch-timing",
    "title": "PDF共有から一時共有URLへ切り替えるタイミング",
    "description": "PDFで資料共有しているプロジェクトで、一時共有URLサービスへの切り替えを検討しているデザイナー・ディレクターが、切り替えタイミングの判断基準を理解して適切なタイミングで移行できるようにする記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pdf-share-missing-auth-expiry",
    "path": "/articles/pdf-share-missing-auth-expiry",
    "title": "PDF共有では足りない認証・期限管理をどう補うか",
    "description": "PDFでの社外共有に認証・期限管理の不足を感じているデザイナーや制作チームが、リスクを具体的に把握し、認証付きHTML共有サービスで補完する判断を下すための実践的な記事。",
    "category": "比較",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ogp-image-not-updating-fix",
    "path": "/articles/ogp-image-not-updating-fix",
    "title": "OGP画像が更新されないときの原因と直し方",
    "description": "HTMLページを更新してもOGP画像が変わらない原因と直し方を知りたいWeb制作者向けに、キャッシュの仕組み・デバッグツールの使い方・再発防止の運用を具体的な手順で解説する記事。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ogp-image-not-updating-checklist",
    "path": "/articles/ogp-image-not-updating-checklist",
    "title": "OGP画像が更新されないときに共有前に確認するチェックリスト",
    "description": "HTMLページを公開・更新するたびにOGP画像が反映されない問題で困っているWeb制作者向けに、共有前と更新後のタイミングごとに実施すべき確認項目をチェックリスト形式で整理した実践的な記事。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ogp-image-not-updating-ai-prompt",
    "path": "/articles/ogp-image-not-updating-ai-prompt",
    "title": "OGP画像が更新されない問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLでOGP画像が更新されない問題を事前に防ぎたいWeb制作者向けに、プロンプトに含めるべき具体的な指示内容と、生成後の確認方法を実践的に解説する記事。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ogp-image-not-updating-request-message",
    "path": "/articles/ogp-image-not-updating-request-message",
    "title": "OGP画像が更新されないときに相手へ伝える確認依頼の書き方",
    "description": "OGP画像が更新されない問題を相手に確認してもらう際の依頼文の書き方が分からないWeb制作者向けに、用途別（SNS・Slack・LINE）の具体的な文例と伝え方の構造を解説する記事。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "favicon-cache-fix",
    "path": "/articles/favicon-cache-fix",
    "title": "ファビコンが更新されないときの原因と直し方",
    "description": "ファビコンが更新されない現象に悩むWeb制作者・デザイナー向けに、ブラウザキャッシュ・CDNキャッシュ・HTML記述ミスの3層を切り分けて解決する手順をまとめた記事。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "favicon-cache-checklist",
    "path": "/articles/favicon-cache-checklist",
    "title": "ファビコンが更新されないときに共有前に確認するチェックリスト",
    "description": "ファビコン更新トラブルを未然に防ぎたい制作者向けに、HTML記述・ブラウザキャッシュ・CDN・スマホ表示まで網羅した共有前チェックリストを提供する記事。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "favicon-cache-ai-prompt",
    "path": "/articles/favicon-cache-ai-prompt",
    "title": "ファビコンが更新されない問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLでファビコンが更新されない問題を事前に防ぎたい制作者向けに、キャッシュバスティング付き記述を生成させるプロンプトの書き方と検証手順を解説する記事。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "favicon-cache-request-message",
    "path": "/articles/favicon-cache-request-message",
    "title": "ファビコンが更新されないときに相手へ伝える確認依頼の書き方",
    "description": "ファビコン更新後に相手へ確認を依頼したい制作者向けに、ブラウザ種別・リテラシー別の依頼文テンプレートと、返信で確認すべき情報をまとめた記事。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "qr-404-fix",
    "path": "/articles/qr-404-fix",
    "title": "QRコードで開くと404になるときの原因と直し方",
    "description": "QRコードを読み取ると404になってしまう問題を解決したい制作者・担当者向けに、URL設定ミス・ページ削除・認証壁の3パターンを切り分けて修正する手順をまとめた記事。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "qr-404-checklist",
    "path": "/articles/qr-404-checklist",
    "title": "QRコードで開くと404になるときに共有前に確認するチェックリスト",
    "description": "QRコードで404が発生するのを事前に防ぎたい担当者向けに、URL設定・ページ公開状態・スマホ複数台確認の手順をまとめた配布前チェックリスト記事。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "qr-404-ai-prompt",
    "path": "/articles/qr-404-ai-prompt",
    "title": "QRコードで開くと404になる問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLを公開してQRコードで配布する際に404を防ぎたい制作者向けに、パス設定・ルーティング・相対URLに関するプロンプト指定と検証手順をまとめた記事。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "qr-404-request-message",
    "path": "/articles/qr-404-request-message",
    "title": "QRコードで開くと404になるときに相手へ伝える確認依頼の書き方",
    "description": "QRコード404の問題を相手に確認依頼したい担当者向けに、状況別のメッセージテンプレートと返信内容から原因を特定する方法をまとめた記事。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "iphone-horizontal-scroll-fix",
    "path": "/articles/iphone-horizontal-scroll-fix",
    "title": "iPhoneだけ横スクロールするときの原因と直し方",
    "description": "iPhoneだけ横スクロールが発生するレイアウト崩れに困っているWeb制作者向けに、overflow・viewport・固定幅要素・margin負値の4パターンを診断・修正する手順をまとめた記事。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "iphone-horizontal-scroll-checklist",
    "path": "/articles/iphone-horizontal-scroll-checklist",
    "title": "iPhoneだけ横スクロールするときに共有前に確認するチェックリスト",
    "description": "iPhoneの横スクロール問題を公開前に防ぎたいWeb制作者向けに、viewport・100vw・固定幅・overflow設定の4項目を体系的に確認するチェックリストをまとめた記事。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "iphone-horizontal-scroll-ai-prompt",
    "path": "/articles/iphone-horizontal-scroll-ai-prompt",
    "title": "iPhoneだけ横スクロールする問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLのiPhone横スクロール問題を防ぎたい制作者向けに、iOSのSafari対応に必要なviewport設定・CSS制約をAIに指示するプロンプトの書き方を解説した記事。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "iphone-horizontal-scroll-request-message",
    "path": "/articles/iphone-horizontal-scroll-request-message",
    "title": "iPhoneだけ横スクロールするときに相手へ伝える確認依頼の書き方",
    "description": "iPhoneの横スクロール問題を相手に確認依頼したい制作者向けに、端末モデル・ブラウザ・再現条件を1往復で把握するメッセージテンプレートと対応フローをまとめた記事。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "android-small-text-fix",
    "path": "/articles/android-small-text-fix",
    "title": "Androidだけ文字が小さく見えるときの原因と直し方",
    "description": "AI生成HTMLをAndroidで共有したら文字が小さくなるトラブルに直面した方向け。viewportメタタグの不備やfont-sizeの単位ミスなど主要な原因を解説し、修正手順を具体的に示します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "android-small-text-checklist",
    "path": "/articles/android-small-text-checklist",
    "title": "Androidだけ文字が小さく見えるときに共有前に確認するチェックリスト",
    "description": "HTML共有前にAndroidの文字サイズ崩れを自分で防ぎたいデザイナー・エンジニア向け。viewportタグ・font-size単位・text-size-adjustなど確認すべき項目をチェックリスト形式で整理しています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "android-small-text-ai-prompt",
    "path": "/articles/android-small-text-ai-prompt",
    "title": "Androidだけ文字が小さく見える問題をAI生成HTMLで防ぐプロンプト",
    "description": "AIで生成したHTMLがAndroidで文字小さくなるのを防ぎたい方向け。ChatGPTやClaudeへの指示文に加えるべきviewport・font-size・text-size-adjustの条件と、生成後に確認すべきチェックポイントをまとめています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "android-small-text-request-message",
    "path": "/articles/android-small-text-request-message",
    "title": "Androidだけ文字が小さく見えるときに相手へ伝える確認依頼の書き方",
    "description": "AndroidでHTMLの文字が小さいと報告を受けた送り手向け。相手に送る確認依頼メッセージの文例と、返信で得るべき情報（OS・ブラウザ・バージョン）、その後の修正対応の流れを解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "chrome-video-autoplay-fix",
    "path": "/articles/chrome-video-autoplay-fix",
    "title": "Chromeで動画が自動再生されないときの原因と直し方",
    "description": "ChromeでHTML動画が自動再生されないトラブルを解決したい方向け。Chromeの自動再生ポリシーの仕組みから、muted属性の付け方・JavaScriptでの回避策・ギガサイト便での公開後確認まで具体的に説明します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "chrome-video-autoplay-checklist",
    "path": "/articles/chrome-video-autoplay-checklist",
    "title": "Chromeで動画が自動再生されないときに共有前に確認するチェックリスト",
    "description": "Chromeで動画が自動再生されないHTMLを公開する前に確認したいチェックリスト。muted・autoplay・playsinlineの設定から、動画ファイルのパスとMIMEタイプ、ブラウザのDevToolsでの事前検証方法までまとめています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "chrome-video-autoplay-ai-prompt",
    "path": "/articles/chrome-video-autoplay-ai-prompt",
    "title": "Chromeで動画が自動再生されない問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLでChromeの動画自動再生が機能しない問題を防ぎたい方向け。プロンプトに追加すべきmuted・autoplay・フォーマット指定と、生成後にDevToolsで検証する手順、ギガサイト便でのZIP公開方法を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "chrome-video-autoplay-request-message",
    "path": "/articles/chrome-video-autoplay-request-message",
    "title": "Chromeで動画が自動再生されないときに相手へ伝える確認依頼の書き方",
    "description": "ChromeでHTML動画が自動再生されないと報告を受けた送り手向け。相手への確認依頼メッセージの文例、返信から原因を判断するフロー、修正後の差し替えと再確認のコミュニケーション方法を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safari-backdrop-filter-fix",
    "path": "/articles/safari-backdrop-filter-fix",
    "title": "Safariでbackdrop-filterが効かないときの原因と直し方",
    "description": "SafariでCSS backdrop-filterが効かないHTMLを修正したい方向け。-webkit-backdrop-filterの必要性、z-indexとoverflowの影響、Safari固有のバグ回避策を具体的な修正コード例とともに解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safari-backdrop-filter-checklist",
    "path": "/articles/safari-backdrop-filter-checklist",
    "title": "Safariでbackdrop-filterが効かないときに共有前に確認するチェックリスト",
    "description": "SafariでCSS backdrop-filterが機能するHTMLを公開前に確認したい方向け。-webkit-プレフィックス・親要素のoverflow設定・z-indexの影響・Safari対応バージョンを確認するチェックリストをまとめています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safari-backdrop-filter-ai-prompt",
    "path": "/articles/safari-backdrop-filter-ai-prompt",
    "title": "Safariでbackdrop-filterが効かない問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLでSafariのbackdrop-filterが効かない問題を防ぎたい方向け。プロンプトに追加すべき-webkit-プレフィックス・overflow回避・z-index設定の指示と、iPhoneのSafariでの公開後確認手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safari-backdrop-filter-request-message",
    "path": "/articles/safari-backdrop-filter-request-message",
    "title": "Safariでbackdrop-filterが効かないときに相手へ伝える確認依頼の書き方",
    "description": "SafariでHTMLのbackdrop-filterが効かないと報告を受けた送り手向け。相手への確認依頼メッセージの文例、SafariバージョンとiOSバージョンの確認方法、修正後の差し替えURLを伝えるコミュニケーション手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "edge-font-different-fix",
    "path": "/articles/edge-font-different-fix",
    "title": "Edgeでフォントが変わるときの原因と直し方",
    "description": "AIで生成したHTMLをEdgeで開いたときにフォントが変わってしまう問題に悩むWeb担当者向け。原因の特定から自分側・相手側の確認ポイント、再発を防ぐ運用まで具体的に解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "edge-font-different-checklist",
    "path": "/articles/edge-font-different-checklist",
    "title": "Edgeでフォントが変わるときに共有前に確認するチェックリスト",
    "description": "EdgeでフォントがChromeと変わって見える問題を共有前に発見したいデザイナー・Web担当者向け。送信前に一人でできる確認手順をチェックリスト形式でまとめ、よくある見落としポイントを解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "edge-font-different-ai-prompt",
    "path": "/articles/edge-font-different-ai-prompt",
    "title": "Edgeでフォントが変わる問題をAI生成HTMLで防ぐプロンプト",
    "description": "AIが生成したHTMLをEdgeで開いたときにフォントが変わる問題を、プロンプトの書き方で未然に防ぎたいエンジニア・デザイナー向け。有効なプロンプトパターンと生成後の確認ポイントを具体的に紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "edge-font-different-request-message",
    "path": "/articles/edge-font-different-request-message",
    "title": "Edgeでフォントが変わるときに相手へ伝える確認依頼の書き方",
    "description": "EdgeでのHTMLフォント表示崩れを報告された側が、相手への確認依頼メッセージをどう書けばよいか迷うWeb担当者向け。必要な情報を一度で引き出す依頼文の型と、返答内容ごとの対処パターンを紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firefox-grid-broken-fix",
    "path": "/articles/firefox-grid-broken-fix",
    "title": "FirefoxでCSS Gridが崩れるときの原因と直し方",
    "description": "FirefoxでCSS Gridレイアウトが崩れる問題に直面したWeb担当者・フロントエンドエンジニア向け。ChromeとFirefoxの挙動差から生まれる崩れの特定方法、CSSの修正手順、再発防止の設計指針をまとめます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firefox-grid-broken-checklist",
    "path": "/articles/firefox-grid-broken-checklist",
    "title": "FirefoxでCSS Gridが崩れるときに共有前に確認するチェックリスト",
    "description": "「崩れています」と言われてから修正するより、共有前に自分で気づく方が圧倒的に早い。FirefoxでCSSグリッドが崩れる原因を優先順位付きで確認できるチェックリストをまとめました。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firefox-grid-broken-ai-prompt",
    "path": "/articles/firefox-grid-broken-ai-prompt",
    "title": "FirefoxでCSS Gridが崩れる問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLのCSS GridがFirefoxで崩れる問題を、プロンプトの書き方で未然に防ぎたいエンジニア・デザイナー向け。Firefox互換を意識したプロンプトパターンと生成後の検証ポイントを具体的に紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firefox-grid-broken-request-message",
    "path": "/articles/firefox-grid-broken-request-message",
    "title": "FirefoxでCSS Gridが崩れるときに相手へ伝える確認依頼の書き方",
    "description": "FirefoxでのCSS Grid崩れを報告された担当者が、相手への確認依頼をどう書けばよいか迷う場面向け。原因を絞り込む質問の型と、返答パターンごとの修正アクションをセットで解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pdf-embed-hidden-fix",
    "path": "/articles/pdf-embed-hidden-fix",
    "title": "PDF埋め込みが表示されないときの原因と直し方",
    "description": "AI生成HTMLのPDF埋め込みが共有先で表示されない問題に直面したWeb担当者・デザイナー向け。ブラウザのPDFビューア設定差・パス問題・CSPエラーを原因別に切り分け、確実に表示させるための修正方法を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pdf-embed-hidden-checklist",
    "path": "/articles/pdf-embed-hidden-checklist",
    "title": "PDF埋め込みが表示されないときに共有前に確認するチェックリスト",
    "description": "HTMLに埋め込んだPDFが共有先で表示されないリスクを共有前に発見したいデザイナー・Web担当者向け。パス・ブラウザ設定・CSPの三つの観点から共有前にチェックできる手順とつまずきやすい落とし穴を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pdf-embed-hidden-ai-prompt",
    "path": "/articles/pdf-embed-hidden-ai-prompt",
    "title": "PDF埋め込みが表示されない問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLでPDF埋め込みが共有先で表示されない問題を、プロンプトの改善で未然に防ぎたいエンジニア・デザイナー向け。有効なプロンプトパターンと生成後の確認方法を具体的に紹介し、PDF表示に強いHTML設計の指針をまとめます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "pdf-embed-hidden-request-message",
    "path": "/articles/pdf-embed-hidden-request-message",
    "title": "PDF埋め込みが表示されないときに相手へ伝える確認依頼の書き方",
    "description": "HTML埋め込みPDFが相手側で表示されないと報告された担当者が、確認依頼メッセージをどう書けば最短で解決できるかを知りたい方向け。質問項目の選び方と返答内容に応じた修正対応のパターンをセットで解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-map-embed-hidden-fix",
    "path": "/articles/google-map-embed-hidden-fix",
    "title": "Googleマップ埋め込みが表示されないときの原因と直し方",
    "description": "GoogleマップのiframeをHTMLに埋め込んだが相手に表示されない、という状況で原因を特定したい方向け。APIキー制限・参照元制御・Cookie設定など見落としがちなポイントを体系的に整理し、修正方針を判断できる内容です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-map-embed-hidden-checklist",
    "path": "/articles/google-map-embed-hidden-checklist",
    "title": "Googleマップ埋め込みが表示されないときに共有前に確認するチェックリスト",
    "description": "GoogleマップのiframeをHTMLに入れて共有する前に、どの順番で何を確認すればよいか迷っている方向け。APIキー・参照元制限・表示サイズ・ネットワーク問題を段階的に絞り込めるチェックリストを提供します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-map-embed-hidden-ai-prompt",
    "path": "/articles/google-map-embed-hidden-ai-prompt",
    "title": "Googleマップ埋め込みが表示されない問題をAI生成HTMLで防ぐプロンプト",
    "description": "AIにGoogleマップ埋め込みのHTMLを生成させる際、地図が表示されないコードが出てくる問題に直面している方向け。どのようなプロンプトを書けばAPIキー不要の正しい埋め込みコードが得られるかを具体例つきで解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "google-map-embed-hidden-request-message",
    "path": "/articles/google-map-embed-hidden-request-message",
    "title": "Googleマップ埋め込みが表示されないときに相手へ伝える確認依頼の書き方",
    "description": "HTMLを受け取った相手にGoogleマップが表示されない旨を報告してもらったとき、どう確認依頼を書けば原因を素早く特定できるか知りたい方向け。聞くべき項目・メッセージ例・返答の解釈方法をまとめています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "youtube-embed-hidden-fix",
    "path": "/articles/youtube-embed-hidden-fix",
    "title": "YouTube埋め込みが表示されないときの原因と直し方",
    "description": "YouTubeのiframeをHTMLに埋め込んだが閲覧者に動画が表示されない問題で困っている方向け。動画の公開設定・埋め込み許可・ブラウザのCSP・ネットワーク制限など原因別の確認方法と修正手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "youtube-embed-hidden-checklist",
    "path": "/articles/youtube-embed-hidden-checklist",
    "title": "YouTube埋め込みが表示されないときに共有前に確認するチェックリスト",
    "description": "YouTube埋め込みが相手に表示されない問題を共有前に潰したいWebデザイナー・ディレクター向け。動画設定・URLフォーマット・CSP・ブラウザ環境の確認項目を順番に整理したチェックリストです。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "youtube-embed-hidden-ai-prompt",
    "path": "/articles/youtube-embed-hidden-ai-prompt",
    "title": "YouTube埋め込みが表示されない問題をAI生成HTMLで防ぐプロンプト",
    "description": "ChatGPTやClaudeなどのAIにYouTube埋め込みHTMLを生成させたがうまく動かない、という経験をした方向け。誤出力のパターンと、それを防ぐプロンプトの書き方を実例つきで解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "youtube-embed-hidden-request-message",
    "path": "/articles/youtube-embed-hidden-request-message",
    "title": "YouTube埋め込みが表示されないときに相手へ伝える確認依頼の書き方",
    "description": "YouTube埋め込みが相手に表示されない状況で、効果的な確認依頼メッセージを作りたい方向け。何を聞くか・どう聞くか・返答のどこを見るかを整理し、1往復で問題を特定できる確認依頼の書き方を紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wrong-form-action-fix",
    "path": "/articles/wrong-form-action-fix",
    "title": "フォームの送信先が意図と違うときの原因と直し方",
    "description": "HTMLフォームの送信先（action属性）が意図した宛先と異なる問題を修正したい方向け。AIが生成したHTML・自分で書いたHTMLを問わず、送信先を正しく設定・確認・テストする手順と、外部サービスへの誤送信を防ぐ方法を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wrong-form-action-checklist",
    "path": "/articles/wrong-form-action-checklist",
    "title": "フォームの送信先が意図と違うときに共有前に確認するチェックリスト",
    "description": "HTMLフォームのaction属性が意図と異なる送信先になっていないか、共有前に確認したいWebデザイナー・ノーコード担当者向け。確認すべき5つのポイントを具体的な手順とともに整理したチェックリストです。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wrong-form-action-ai-prompt",
    "path": "/articles/wrong-form-action-ai-prompt",
    "title": "フォームの送信先が意図と違う問題をAI生成HTMLで防ぐプロンプト",
    "description": "AIに生成させたHTMLフォームのaction属性が意図しない送信先になる問題を防ぎたい方向け。どのプロンプトを書けば実用的なフォームコードが得られるか、生成後のどこを確認すべきかを具体的に解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "wrong-form-action-request-message",
    "path": "/articles/wrong-form-action-request-message",
    "title": "フォームの送信先が意図と違うときに相手へ伝える確認依頼の書き方",
    "description": "フォームの送信先が意図と違う問題が発生したとき、相手に状況を正確に報告してもらうための確認依頼メッセージを書きたい方向け。聞くべき項目・メッセージ文例・返答の解釈方法をセットで解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cors-external-api-fix",
    "path": "/articles/cors-external-api-fix",
    "title": "外部API呼び出しがCORSで失敗するときの原因と直し方",
    "description": "外部APIへのfetchがCORSエラーで弾かれて困っている開発者・制作者向け。ブラウザ側とサーバー側それぞれの原因と、プリフライトリクエストの仕組みを踏まえた具体的な修正手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cors-external-api-checklist",
    "path": "/articles/cors-external-api-checklist",
    "title": "外部API呼び出しがCORSで失敗するときに共有前に確認するチェックリスト",
    "description": "AI生成HTMLや静的ページで外部APIを呼んでいる人が、共有リンクを送る前に確認すべきCORSまわりのポイントを網羅したチェックリスト。ブラウザコンソールの見方から依頼文の書き方まで一気通貫で整理しています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cors-external-api-ai-prompt",
    "path": "/articles/cors-external-api-ai-prompt",
    "title": "外部API呼び出しがCORSで失敗する問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLで外部APIのCORSエラーを防ぎたい制作者向け。プロンプトにどう書けばAPIキー漏洩やCORSブロックを回避した構成のコードを出力させられるか、具体的な文言例と注意点を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cors-external-api-request-message",
    "path": "/articles/cors-external-api-request-message",
    "title": "外部API呼び出しがCORSで失敗するときに相手へ伝える確認依頼の書き方",
    "description": "外部APIのCORSエラーを相手の管理者へ正しく伝えられずに困っている人向け。エラー内容・自分の環境・必要な対応を過不足なく伝える依頼文の構成と、コピーして使えるテンプレートを紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "image-orientation-rotated-fix",
    "path": "/articles/image-orientation-rotated-fix",
    "title": "画像の向きが勝手に回るときの原因と直し方",
    "description": "スマホ撮影の画像がHTMLやWebページで回転してしまう問題を解決したい人向け。EXIFのOrientationタグが原因であることから、CSS・JavaScript・画像変換の3つの修正アプローチまでを具体的に解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "image-orientation-rotated-checklist",
    "path": "/articles/image-orientation-rotated-checklist",
    "title": "画像の向きが勝手に回るときに共有前に確認するチェックリスト",
    "description": "画像の向きが環境によってずれる問題を共有前に潰したい人向け。EXIFの確認方法からCSS対処・画像変換まで、公開前に済ませておくべき確認事項をステップ別にまとめたチェックリストです。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "image-orientation-rotated-ai-prompt",
    "path": "/articles/image-orientation-rotated-ai-prompt",
    "title": "画像の向きが勝手に回る問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLで画像の向き問題を最初から回避したい制作者向け。スマホ撮影画像のEXIF回転をAIに自動補正させるためのプロンプト文言と、生成後の確認手順を具体的に解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "image-orientation-rotated-request-message",
    "path": "/articles/image-orientation-rotated-request-message",
    "title": "画像の向きが勝手に回るときに相手へ伝える確認依頼の書き方",
    "description": "共有HTMLで画像の向きが回転して見える問題を相手に正確に伝えたい人向け。EXIFの向き問題を依頼・報告・確認の3シーンで使える連絡文のテンプレートと、情報収集のポイントを紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "svg-not-showing-fix",
    "path": "/articles/svg-not-showing-fix",
    "title": "SVGが表示されないときの原因と直し方",
    "description": "HTMLでSVGが表示されない問題を解決したいWebデザイナー・制作者向け。インラインSVG・imgタグ・object要素など参照方法別の原因と、MIMEタイプ・CSP・パスエラーを含む実践的な修正手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "svg-not-showing-checklist",
    "path": "/articles/svg-not-showing-checklist",
    "title": "SVGが表示されないときに共有前に確認するチェックリスト",
    "description": "SVGが表示されない問題を共有前に確認したい制作者向け。インライン・imgタグ・外部ファイルの3パターン別にチェック項目を整理し、MIMEタイプ・viewBox・CSPの確認手順を具体的に説明します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "svg-not-showing-ai-prompt",
    "path": "/articles/svg-not-showing-ai-prompt",
    "title": "SVGが表示されない問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLでSVGが表示されない問題を防ぎたい制作者向け。viewBox指定・インライン化・SVGOによる最適化まで、AIへのプロンプトに盛り込むべき指示文と、生成後に確認すべきポイントを具体的に説明します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "svg-not-showing-request-message",
    "path": "/articles/svg-not-showing-request-message",
    "title": "SVGが表示されないときに相手へ伝える確認依頼の書き方",
    "description": "共有HTMLのSVGが相手の環境で表示されない問題を報告・依頼したい人向け。現象の特定に必要な情報の収集方法と、開発担当者や共有相手に送る連絡文のテンプレートを紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webp-not-showing-fix",
    "path": "/articles/webp-not-showing-fix",
    "title": "WebP画像が表示されないときの原因と直し方",
    "description": "WebP画像が共有HTMLで表示されない原因を調べたいデザイナー・エンジニア向けに、パスミス・ファイル未同梱・ブラウザ非対応の3パターンを原因別に解説し、修正手順と再発防止策を具体的に示します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webp-not-showing-checklist",
    "path": "/articles/webp-not-showing-checklist",
    "title": "WebP画像が表示されないときに共有前に確認するチェックリスト",
    "description": "WebP画像の表示トラブルを防ぎたいHTML共有担当者向けに、アップロード前に自己完結できる確認チェックリストをステップ順に提供します。見落としがちなファイル名の大文字問題も網羅しています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webp-not-showing-ai-prompt",
    "path": "/articles/webp-not-showing-ai-prompt",
    "title": "WebP画像が表示されない問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLでWebP画像の表示トラブルを未然に防ぎたい制作担当者向けに、プロンプトへの具体的な指示例と生成物の検証手順を紹介します。ギガサイト便での静的公開を前提とした実践的な内容です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webp-not-showing-request-message",
    "path": "/articles/webp-not-showing-request-message",
    "title": "WebP画像が表示されないときに相手へ伝える確認依頼の書き方",
    "description": "WebP画像が相手に表示されないと報告されたとき、原因の特定を効率化したい担当者向けに、最初の確認依頼メッセージに盛り込む質問項目と文例を具体的に紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-japanese-folder-fix",
    "path": "/articles/zip-japanese-folder-fix",
    "title": "ZIP内の日本語フォルダ名が読めないときの原因と直し方",
    "description": "ZIPの日本語フォルダ名が文字化けして読めない問題に直面している方向けに、文字コードの仕組みから正しい修正手順・再発防止の命名規則まで実践的に解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-japanese-folder-checklist",
    "path": "/articles/zip-japanese-folder-checklist",
    "title": "ZIP内の日本語フォルダ名が読めないときに共有前に確認するチェックリスト",
    "description": "ZIPの日本語フォルダ名が文字化けする問題を事前に防ぎたいHTML共有担当者向けに、アップロード前の自己チェックと相手への依頼内容をリスト形式で提供します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-japanese-folder-ai-prompt",
    "path": "/articles/zip-japanese-folder-ai-prompt",
    "title": "ZIP内の日本語フォルダ名が読めない問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLで日本語フォルダ名が混入するトラブルを防ぎたい方向けに、プロンプトへの追記例と生成物の命名規則チェック手順を解説します。ギガサイト便で確実に動くZIPを作ることを目的としています。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-japanese-folder-request-message",
    "path": "/articles/zip-japanese-folder-request-message",
    "title": "ZIP内の日本語フォルダ名が読めないときに相手へ伝える確認依頼の書き方",
    "description": "ZIPの日本語フォルダ名が読めないという報告を受けた送り手向けに、原因の特定に必要な情報を引き出すための確認依頼メッセージの書き方と質問テンプレートを提供します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "large-zip-stuck-fix",
    "path": "/articles/large-zip-stuck-fix",
    "title": "大きいZIPのアップロードが途中で止まるときの原因と直し方",
    "description": "大きなZIPのアップロードが途中で止まってしまう問題に困っているHTML共有担当者向けに、ネットワーク・ブラウザ・ファイルサイズの3軸で原因を切り分け、具体的な対処法を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "large-zip-stuck-checklist",
    "path": "/articles/large-zip-stuck-checklist",
    "title": "大きいZIPのアップロードが途中で止まるときに共有前に確認するチェックリスト",
    "description": "大きなZIPのアップロードが途中で止まる問題を解決したい方向けに、ファイルサイズ・ネットワーク・ブラウザの3観点で確認すべきチェック項目を順番に提供します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "large-zip-stuck-ai-prompt",
    "path": "/articles/large-zip-stuck-ai-prompt",
    "title": "大きいZIPのアップロードが途中で止まる問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLで作成したZIPがアップロード途中で止まる問題を防ぎたい方向けに、ファイルサイズを小さく保つためのプロンプト指示例と、生成物の最適化確認手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "large-zip-stuck-request-message",
    "path": "/articles/large-zip-stuck-request-message",
    "title": "大きいZIPのアップロードが途中で止まるときに相手へ伝える確認依頼の書き方",
    "description": "大きなZIPのアップロードが途中で止まった状況を別の担当者や開発者に伝えたい方向けに、原因の特定に役立つ情報を盛り込んだ報告・確認依頼メッセージの書き方と雛形を提供します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "password-screen-loop-fix",
    "path": "/articles/password-screen-loop-fix",
    "title": "パスワード画面から進めないときの原因と直し方",
    "description": "HTMLプレビューURLを共有したとき「パスワードを入れても先に進めない」と言われた担当者向け。原因ごとの確認手順と、その場で使える直し方を整理した実践ガイド。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "password-screen-loop-checklist",
    "path": "/articles/password-screen-loop-checklist",
    "title": "パスワード画面から進めないときに共有前に確認するチェックリスト",
    "description": "HTMLプレビューURLの共有時にパスワード認証で詰まるトラブルを未然に防ぎたい担当者向け。送信前・送信後・受信者対応の3段階チェックリストで確認漏れをゼロにする方法を解説。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "password-screen-loop-ai-prompt",
    "path": "/articles/password-screen-loop-ai-prompt",
    "title": "パスワード画面から進めない問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLをギガサイト便で共有するときパスワード認証が機能しないトラブルを防ぎたい制作者向け。プロンプトに何を書けばよいか、生成後の確認ポイントと合わせて解説する。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "password-screen-loop-request-message",
    "path": "/articles/password-screen-loop-request-message",
    "title": "パスワード画面から進めないときに相手へ伝える確認依頼の書き方",
    "description": "HTMLプレビューURLを共有した際に受信者から「パスワード画面で詰まる」と連絡が来たとき、素早く原因を特定するための確認依頼メッセージの書き方と文例を紹介する。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "otp-in-spam-fix",
    "path": "/articles/otp-in-spam-fix",
    "title": "認証コードが迷惑メールに入るときの原因と直し方",
    "description": "ギガサイト便のメール認証で送った認証コードが受信者の迷惑メールフォルダに振り分けられてしまう問題に悩む共有者向け。原因ごとの具体的な直し方を解説する。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "otp-in-spam-checklist",
    "path": "/articles/otp-in-spam-checklist",
    "title": "認証コードが迷惑メールに入るときに共有前に確認するチェックリスト",
    "description": "メール認証を使ったHTML共有で認証コードが迷惑メールに振り分けられないか不安な担当者向け。DNS設定から受信者側の確認依頼まで、段階別チェックリストで確認漏れをなくす方法を説明する。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "otp-in-spam-ai-prompt",
    "path": "/articles/otp-in-spam-ai-prompt",
    "title": "認証コードが迷惑メールに入る問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLをメール認証付きで共有する際に認証コードが迷惑メール扱いされるリスクを下げたい制作者向け。プロンプトで指定すべき禁止事項と、生成後の確認手順を解説する。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "otp-in-spam-request-message",
    "path": "/articles/otp-in-spam-request-message",
    "title": "認証コードが迷惑メールに入るときに相手へ伝える確認依頼の書き方",
    "description": "認証コードが迷惑メールに入ってしまったときに受信者へ送る確認依頼の文面と、依頼後のやり取りを最短で完結させるためのコツを解説する。担当者が今すぐ使えるメッセージ例付き。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "domain-auth-fails-fix",
    "path": "/articles/domain-auth-fails-fix",
    "title": "会社ドメイン認証で通らないときの原因と直し方",
    "description": "会社ドメイン認証の設定が正しいはずなのに特定のメールアドレスが認証を通過できない問題を抱える担当者向け。設定値の見落としから受信者側の対処まで、原因別の直し方を解説する。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "domain-auth-fails-checklist",
    "path": "/articles/domain-auth-fails-checklist",
    "title": "会社ドメイン認証で通らないときに共有前に確認するチェックリスト",
    "description": "ギガサイト便の会社ドメイン認証を設定する前後に確認すべき項目を体系化した、設定担当者向けのチェックリスト。入力値の検証からテストアクセスまでを段階的にカバーする。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "domain-auth-fails-ai-prompt",
    "path": "/articles/domain-auth-fails-ai-prompt",
    "title": "会社ドメイン認証で通らない問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLを会社ドメイン認証付きで共有する際に認証が通らなくなるリスクをプロンプト段階で取り除きたい制作者向け。具体的な禁止事項の書き方と生成後の確認ポイントを解説する。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "domain-auth-fails-request-message",
    "path": "/articles/domain-auth-fails-request-message",
    "title": "会社ドメイン認証で通らないときに相手へ伝える確認依頼の書き方",
    "description": "ギガサイト便の会社ドメイン認証で受信者が弾かれたときに送る確認依頼メッセージの書き方を解説。1回のやり取りで原因を絞り込むための質問の組み立て方と文例を紹介する。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "expires-too-early-fix",
    "path": "/articles/expires-too-early-fix",
    "title": "期限切れ前なのに見えなくなるときの原因と直し方",
    "description": "HTMLプレビューのURLが期限前に見えなくなって困っているWeb担当者向けに、認証・キャッシュ・パス解決など原因別の確認手順と恒久対策をまとめました。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "expires-too-early-checklist",
    "path": "/articles/expires-too-early-checklist",
    "title": "期限切れ前なのに見えなくなるときに共有前に確認するチェックリスト",
    "description": "有効期限前に共有HTMLが見えなくなるトラブルを事前に防ぎたいWeb制作者向けに、共有前に必ず確認すべき項目をフェーズ別のチェックリストでまとめました。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "expires-too-early-ai-prompt",
    "path": "/articles/expires-too-early-ai-prompt",
    "title": "期限切れ前なのに見えなくなる問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLを共有URLで配信したとき期限前に表示が止まるトラブルに悩むエンジニアや制作者向けに、問題を防ぐプロンプト設計の具体的な書き方を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "expires-too-early-request-message",
    "path": "/articles/expires-too-early-request-message",
    "title": "期限切れ前なのに見えなくなるときに相手へ伝える確認依頼の書き方",
    "description": "共有HTMLが期限前に見えなくなったときに相手へ送る確認依頼メッセージの書き方を、受け取る相手のITリテラシー別・症状別に具体的な文例とともに解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "partial-old-after-replace-fix",
    "path": "/articles/partial-old-after-replace-fix",
    "title": "差し替え後に一部だけ古い表示になるときの原因と直し方",
    "description": "HTML差し替え後に一部だけ古い表示が残って困っているWeb担当者向けに、ブラウザキャッシュ・CDNキャッシュ・ファイルパスの問題を切り分けて解決する具体的な手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "partial-old-after-replace-checklist",
    "path": "/articles/partial-old-after-replace-checklist",
    "title": "差し替え後に一部だけ古い表示になるときに共有前に確認するチェックリスト",
    "description": "HTML差し替え後に古い表示が一部残るトラブルを未然に防ぎたい制作者・運用担当者向けに、差し替え前後で行うべき確認項目をフェーズ別チェックリスト形式で解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "partial-old-after-replace-ai-prompt",
    "path": "/articles/partial-old-after-replace-ai-prompt",
    "title": "差し替え後に一部だけ古い表示になる問題をAI生成HTMLで防ぐプロンプト",
    "description": "AIで生成したHTMLを差し替えたときに古い表示が一部残るトラブルを防ぎたい制作者向けに、キャッシュバスティングや自己完結設計を指示するプロンプトの書き方を具体的に解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "partial-old-after-replace-request-message",
    "path": "/articles/partial-old-after-replace-request-message",
    "title": "差し替え後に一部だけ古い表示になるときに相手へ伝える確認依頼の書き方",
    "description": "HTML差し替え後に古い表示が残っていると報告を受けたとき、相手に依頼する確認手順の書き方と、状況を素早く切り分けるための情報収集方法を具体的な文例で解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-cache-remains-fix",
    "path": "/articles/css-cache-remains-fix",
    "title": "CSSだけキャッシュが残るときの原因と直し方",
    "description": "HTMLは更新されたのにCSSだけキャッシュが残ってデザインが古いままになる問題に悩む担当者向けに、CDN・ブラウザ・プロキシの各レイヤーでキャッシュを消す手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-cache-remains-checklist",
    "path": "/articles/css-cache-remains-checklist",
    "title": "CSSだけキャッシュが残るときに共有前に確認するチェックリスト",
    "description": "HTML更新後にCSSのキャッシュが残ってデザインが古いままになるトラブルを事前に防ぎたい担当者向けに、共有前・差し替え後・相手への依頼フェーズ別に行うべきチェック項目をまとめました。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-cache-remains-ai-prompt",
    "path": "/articles/css-cache-remains-ai-prompt",
    "title": "CSSだけキャッシュが残る問題をAI生成HTMLで防ぐプロンプト",
    "description": "AIで生成したHTMLでCSSキャッシュが残るトラブルを未然に防ぎたい制作者向けに、インラインCSS指定・キャッシュバスティング対応を含むプロンプトの書き方と確認手順を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "css-cache-remains-request-message",
    "path": "/articles/css-cache-remains-request-message",
    "title": "CSSだけキャッシュが残るときに相手へ伝える確認依頼の書き方",
    "description": "CSS差し替え後にキャッシュが残って古い見た目のままになっている相手への確認依頼メッセージの書き方を、症状別・相手のITリテラシー別に具体的な文例を交えて解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "unexpected-external-link-fix",
    "path": "/articles/unexpected-external-link-fix",
    "title": "リンク先が別ドメインに飛ぶときの原因と直し方",
    "description": "WebデザイナーやノーコードユーザーがAI生成HTMLを共有したとき、リンクが別ドメインに飛ぶ原因を原因別に解説。ソース確認から修正・再公開までの手順を具体的にまとめます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "unexpected-external-link-checklist",
    "path": "/articles/unexpected-external-link-checklist",
    "title": "リンク先が別ドメインに飛ぶときに共有前に確認するチェックリスト",
    "description": "HTML共有前に「リンク先が意図せず別ドメインに飛ぶ」トラブルを防ぐための事前確認チェックリスト。AI生成HTMLに特有の落とし穴を含め、送信前・送信後に分けて整理します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "unexpected-external-link-ai-prompt",
    "path": "/articles/unexpected-external-link-ai-prompt",
    "title": "リンク先が別ドメインに飛ぶ問題をAI生成HTMLで防ぐプロンプト",
    "description": "AIにHTML生成を依頼するときに「リンク先が別ドメインに飛ぶ」問題を防ぐプロンプトの書き方を解説。制約の書き方例や、生成後の検証コマンドもあわせて紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "unexpected-external-link-request-message",
    "path": "/articles/unexpected-external-link-request-message",
    "title": "リンク先が別ドメインに飛ぶときに相手へ伝える確認依頼の書き方",
    "description": "共有HTMLで「リンク先が別ドメインに飛ぶ」と相手から連絡が来たときに送る確認依頼メッセージの書き方。聞くべき情報と依頼の順番を非エンジニア向けにわかりやすく解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "button-not-clickable-fix",
    "path": "/articles/button-not-clickable-fix",
    "title": "ボタンがクリックできないときの原因と直し方",
    "description": "AI生成HTMLやノーコード制作のページでボタンがクリックできない・反応しない問題の原因を症状別に解説。CSSの重なり順、JS読み込みエラー、pointer-eventsの設定まで具体的な直し方を紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "button-not-clickable-checklist",
    "path": "/articles/button-not-clickable-checklist",
    "title": "ボタンがクリックできないときに共有前に確認するチェックリスト",
    "description": "HTML共有前のボタン動作確認チェックリスト。AI生成コードで起きやすいdisabled残り・z-index重なり・JS読み込み失敗など、クリックできない原因別の確認手順を整理して紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "button-not-clickable-ai-prompt",
    "path": "/articles/button-not-clickable-ai-prompt",
    "title": "ボタンがクリックできない問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLでボタンがクリックできなくなる問題をプロンプトで防ぐ方法を解説。AIへの指示文の書き方から、生成後の確認コマンドまでを実践的にまとめます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "button-not-clickable-request-message",
    "path": "/articles/button-not-clickable-request-message",
    "title": "ボタンがクリックできないときに相手へ伝える確認依頼の書き方",
    "description": "共有HTMLで「ボタンがクリックできない」と報告を受けたときに送る確認依頼メッセージの文面を解説。聞くべき情報の優先順位と、相手のスキルに応じた依頼方法を具体的に紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "modal-not-closing-fix",
    "path": "/articles/modal-not-closing-fix",
    "title": "モーダルが閉じないときの原因と直し方",
    "description": "共有HTMLのモーダルが閉じないトラブルの原因と修正方法を解説。AI生成コードで起きやすいJSイベント未設定・display切り替えの誤り・z-index競合を症状別に整理します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "modal-not-closing-checklist",
    "path": "/articles/modal-not-closing-checklist",
    "title": "モーダルが閉じないときに共有前に確認するチェックリスト",
    "description": "HTML共有前にモーダルの閉じる動作を確認するチェックリストを紹介。AI生成HTMLで見落とされやすいJSイベント未設定・ID不一致・overflow残留を含む確認項目をまとめます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "modal-not-closing-ai-prompt",
    "path": "/articles/modal-not-closing-ai-prompt",
    "title": "モーダルが閉じない問題をAI生成HTMLで防ぐプロンプト",
    "description": "AI生成HTMLでモーダルが閉じない問題を防ぐプロンプトの書き方を解説。×ボタン・背景クリック・ESCキーの3つの閉じ方を網羅した指示文テンプレートと、生成後の検証手順を紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "modal-not-closing-request-message",
    "path": "/articles/modal-not-closing-request-message",
    "title": "モーダルが閉じないときに相手へ伝える確認依頼の書き方",
    "description": "共有HTMLでモーダルが閉じないと報告を受けたときの確認依頼メッセージの書き方と情報収集のポイントを解説。非エンジニア・エンジニアそれぞれへの依頼文テンプレートを紹介します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "responsive-image-blurry-fix",
    "path": "/articles/responsive-image-blurry-fix",
    "title": "レスポンシブ画像が荒く見えるときの原因と直し方",
    "description": "PCでは綺麗に表示されるのにスマホで画像が荒く見えると困っているデザイナー・エンジニア向けに、srcsetやCSSの不備を素早く診断し修正するための手順を具体的にまとめました。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "responsive-image-blurry-checklist",
    "path": "/articles/responsive-image-blurry-checklist",
    "title": "レスポンシブ画像が荒く見えるときに共有前に確認するチェックリスト",
    "description": "HTMLファイルや静的サイトを共有する前に、レスポンシブ画像の荒さを事前に防ぐための確認リストを解説します。デザイナー・非エンジニアでも実施できる手順に絞りました。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "responsive-image-blurry-ai-prompt",
    "path": "/articles/responsive-image-blurry-ai-prompt",
    "title": "レスポンシブ画像が荒く見える問題をAI生成HTMLで防ぐプロンプト",
    "description": "ChatGPTやClaudeなどのAIにHTMLを作ってもらうときに、レスポンシブ画像のぼやけを未然に防ぐプロンプト設計を知りたい方向けの解説記事です。テンプレート文例もあります。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "responsive-image-blurry-request-message",
    "path": "/articles/responsive-image-blurry-request-message",
    "title": "レスポンシブ画像が荒く見えるときに相手へ伝える確認依頼の書き方",
    "description": "共有したHTMLの画像が荒く見えると連絡が来たとき、原因を素早く絞り込むために相手へ送る確認依頼メッセージの書き方と例文を解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "fixed-scroll-offset-fix",
    "path": "/articles/fixed-scroll-offset-fix",
    "title": "固定ヘッダーでスクロール位置がずれるときの原因と直し方",
    "description": "固定ヘッダーによってアンカーリンク先の見出しが隠れてしまう問題を解決したいエンジニア・デザイナー向けに、CSSとJavaScript両方の修正方法を状況別に解説します。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "fixed-scroll-offset-checklist",
    "path": "/articles/fixed-scroll-offset-checklist",
    "title": "固定ヘッダーでスクロール位置がずれるときに共有前に確認するチェックリスト",
    "description": "固定ヘッダーのあるHTMLを共有する前に、アンカースクロールのずれを事前に発見するためのチェック項目をまとめました。非エンジニアでも取り組めるブラウザ操作ベースの確認方法です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "fixed-scroll-offset-ai-prompt",
    "path": "/articles/fixed-scroll-offset-ai-prompt",
    "title": "固定ヘッダーでスクロール位置がずれる問題をAI生成HTMLで防ぐプロンプト",
    "description": "AIで生成したHTMLに固定ヘッダーを使うとアンカースクロールがずれる問題を、プロンプトの書き方で予防したいと考えているエンジニア・ノーコードユーザー向けの解説記事です。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "fixed-scroll-offset-request-message",
    "path": "/articles/fixed-scroll-offset-request-message",
    "title": "固定ヘッダーでスクロール位置がずれるときに相手へ伝える確認依頼の書き方",
    "description": "固定ヘッダーでアンカースクロールがずれる問題を相手に確認してもらうための依頼メッセージの書き方を、例文付きで解説します。クライアントや非エンジニアへの依頼にも使えます。",
    "category": "トラブルシュート",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-sri-html-share",
    "path": "/articles/what-is-sri-html-share",
    "title": "SRI（Subresource Integrity）とは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "CDN経由で読み込む外部ライブラリが改ざんされていないかをブラウザが自動検証する仕組みがSRIです。AI生成HTMLでライブラリを利用する際にとくに関係してくるこの機能の意味と設定方法をやさしく解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-referrer-policy-html-share",
    "path": "/articles/what-is-referrer-policy-html-share",
    "title": "Referrer-Policyとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "Referrer-Policyの仕組みと、AI生成HTMLやプレビュー共有サービスでの活用場面を知りたい方向けの解説記事です。内部URLや機密情報の漏洩リスクを理解して適切な設定ができるようになります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-permissions-policy-html-share",
    "path": "/articles/what-is-permissions-policy-html-share",
    "title": "Permissions-Policyとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "Permissions-Policyの仕組みとAI生成HTMLや共有プレビューサイトでの活用シーンを解説します。カメラ・マイクなどの機能制御を理解してセキュアなHTML共有に役立てたい方向けです。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-same-origin-policy-html-share",
    "path": "/articles/what-is-same-origin-policy-html-share",
    "title": "Same-Origin Policyとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "Same-Origin Policyの仕組みとCORSエラーとの関係をAI生成HTML・共有サイトの文脈でやさしく解説します。「なぜ外部APIが使えないのか」を理解してエラー解決に役立てたい方向けです。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-sandbox-iframe-html-share",
    "path": "/articles/what-is-sandbox-iframe-html-share",
    "title": "sandbox付きiframeとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "HTML共有やAI生成サイトの公開に慣れていない方向けに、sandbox属性付きiframeの役割・制限の種類・共有時の落とし穴を具体例で解説します。安全な公開判断ができるようになります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-cors-preflight-html-share",
    "path": "/articles/what-is-cors-preflight-html-share",
    "title": "CORSプリフライトとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "HTML共有やAI生成サイトを公開する担当者が知っておくべきCORSプリフライトの仕組みを、ブラウザの動作・エラーの見方・共有時の注意点に沿って具体的に解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-csp-nonce-html-share",
    "path": "/articles/what-is-csp-nonce-html-share",
    "title": "CSP nonceとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "CSP nonceの意味とHTML共有・AI生成サイト公開での影響を解説します。スクリプトが動かないトラブルの原因特定や、共有時に安全なコードを準備するための判断基準を提供します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-csp-report-only-html-share",
    "path": "/articles/what-is-csp-report-only-html-share",
    "title": "CSP Report-Onlyとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "CSP Report-Only の仕組みをHTML共有・AI生成サイト公開の文脈で解説します。本番ブロックなしに違反を検出できる仕組みと、共有前チェックへの活用方法を具体的に説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-hsts-html-share",
    "path": "/articles/what-is-hsts-html-share",
    "title": "HSTSとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "共有URLをHTTPSで安全に届けたいWeb担当者向けに、HSTSの動作原理・共有サービスへの影響・初回接続の落とし穴を具体的に解説します。セキュリティ設定の妥当性を判断できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-content-disposition-html-share",
    "path": "/articles/what-is-content-disposition-html-share",
    "title": "Content-Dispositionとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "共有URLでHTMLを表示させるかダウンロードさせるかを制御するContent-Dispositionの仕組みを、HTML共有・AI生成サイトの公開場面に絞って解説します。思い通りの挙動を設定できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-mime-type-html-share",
    "path": "/articles/what-is-mime-type-html-share",
    "title": "MIMEタイプとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "HTMLやCSS・画像などの共有時に影響するMIMEタイプの仕組みを、AI生成サイト公開の文脈で具体的に解説します。表示トラブルの原因特定と事前チェックの方法を習得できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-nosniff-html-share",
    "path": "/articles/what-is-nosniff-html-share",
    "title": "X-Content-Type-Options: nosniffとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "ブラウザがコンテンツの種別を勝手に推測することで起きるセキュリティリスクを、たった1行のヘッダーで防げます。AI生成HTMLを安全に共有するうえで知っておきたいnosniffの役割をわかりやすく説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-x-frame-options-html-share",
    "path": "/articles/what-is-x-frame-options-html-share",
    "title": "X-Frame-Optionsとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "X-Frame-Optionsの仕組みをHTML共有・AI生成ページの埋め込み場面に絞って解説します。iframe表示ができない原因の特定方法と、安全な埋め込みを実現するための設定判断を提供します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-robots-txt-html-share",
    "path": "/articles/what-is-robots-txt-html-share",
    "title": "robots.txtとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "robots.txtの基本的な仕組みをHTML共有・AI生成サイト公開の文脈で解説します。検索エンジンへのインデックス制御とアクセス制御の混同を避けるための正確な理解を提供します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-canonical-url-html-share",
    "path": "/articles/what-is-canonical-url-html-share",
    "title": "canonical URLとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "canonical URLの仕組みをHTML共有・AI生成サイトのSEOと重複コンテンツ対策の観点で解説します。どのページに設定すべきか・共有URLへの影響・設定の確認方法を具体的に説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-hreflang-html-share",
    "path": "/articles/what-is-hreflang-html-share",
    "title": "hreflangとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "多言語HTML共有やAI生成サイトの国際化対応を検討する方向けに、hreflangの設定方法・よくある間違い・共有URLでの注意点をわかりやすく説明します。言語ターゲティングの判断に役立てられます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-structured-data-html-share",
    "path": "/articles/what-is-structured-data-html-share",
    "title": "構造化データとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "静的HTMLやAI生成サイトを公開・共有するときに登場する「構造化データ」の意味を初心者向けに解説。検索エンジンへの伝わり方や誤解しやすいポイントを具体的に説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-json-ld-html-share",
    "path": "/articles/what-is-json-ld-html-share",
    "title": "JSON-LDとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "JSON-LDの基本的な意味と、AIで作ったHTMLやZIPサイトを公開・共有する際にどう関係するかを初心者向けに解説。書き方の最小例と検証手順も紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-breadcrumb-list-html-share",
    "path": "/articles/what-is-breadcrumb-list-html-share",
    "title": "BreadcrumbListとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "BreadcrumbListの意味と、AI生成サイトや静的HTMLを外部公開したときに検索結果でどう機能するかを解説。実装の最小例と確認方法を初心者向けにまとめます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-faqpage-schema-html-share",
    "path": "/articles/what-is-faqpage-schema-html-share",
    "title": "FAQPage schemaとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "FAQPage schemaの意味と、AIで作ったHTMLにFAQセクションがある場合の活用方法を初心者向けに解説。Googleリッチリザルトとして表示される条件と実装の注意点も紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-opengraph-html-share",
    "path": "/articles/what-is-opengraph-html-share",
    "title": "Open Graphとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "SlackやSNSでURLを共有したときにカード表示を生成するOpen Graphの基本を解説。AIで作った静的HTMLを外部共有するときに必要なOGP設定と、よくある設定ミスの防ぎ方を紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-twitter-card-html-share",
    "path": "/articles/what-is-twitter-card-html-share",
    "title": "Twitter Cardとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "X（旧Twitter）でURLを共有した際にカード表示を生成するTwitter Cardの基本と、AIで作った静的HTMLへの設定方法を解説。OGPとの違いや確認手順も説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-utm-parameter-html-share",
    "path": "/articles/what-is-utm-parameter-html-share",
    "title": "UTMパラメータとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "URLに付けるだけでアクセス流入元を計測できるUTMパラメータの意味と設定方法を解説。AIで作ったサイトを複数チャネルで共有するとき、どのルートからアクセスが来たかを把握したい方向けです。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-query-string-html-share",
    "path": "/articles/what-is-query-string-html-share",
    "title": "クエリ文字列とは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "URLの「?」以降に付く情報「クエリ文字列」の意味と、HTMLページ共有時にどう活用・注意すべきかを初心者向けに解説。静的サイトへの影響やセキュリティ上の注意点も紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-url-fragment-html-share",
    "path": "/articles/what-is-url-fragment-html-share",
    "title": "URLフラグメントとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "URLの「#」以降の部分「URLフラグメント」の意味と使い方を初心者向けに解説。HTMLページを特定セクションから開かせる方法と、共有時の注意点をまとめます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-signed-url-html-share",
    "path": "/articles/what-is-signed-url-html-share",
    "title": "署名付きURLとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "期限付きで安全にコンテンツを共有できる「署名付きURL」の仕組みと用途を初心者向けに解説。AIで作ったサイトや資料の外部共有を検討しているエンジニア・デザイナー向けに注意点も説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-magic-link-html-share",
    "path": "/articles/what-is-magic-link-html-share",
    "title": "マジックリンクとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "クリックするだけでログインや認証ができる「マジックリンク」の仕組みを初心者向けに解説。AIサイトのアクセス制御設計を考えているWeb制作者・デザイナーがメール認証との違いを理解するのに役立ちます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-email-otp-html-share",
    "path": "/articles/what-is-email-otp-html-share",
    "title": "メールOTPとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "メールで送られる数字コードでログインする「メールOTP」の仕組みと、AIサイトのアクセス制限への応用を解説。マジックリンクとの違いや実運用での注意点も初心者向けにまとめます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-domain-allowlist-html-share",
    "path": "/articles/what-is-domain-allowlist-html-share",
    "title": "ドメイン許可リストとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "社外共有やAI生成サイトのプレビュー公開で登場するドメイン許可リストの意味を解説。どの場面で役立ち、誤解されやすい点は何か、設定時の注意点まで把握できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-email-allowlist-html-share",
    "path": "/articles/what-is-email-allowlist-html-share",
    "title": "メール許可リストとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AI生成サイトや静的HTMLを特定の個人だけに共有したいときに使うメール許可リストの概念を解説。ドメイン許可リストとの違いや、誤解しやすいポイント、設定時の確認手順まで理解できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-access-log-html-share",
    "path": "/articles/what-is-access-log-html-share",
    "title": "アクセスログとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "静的HTMLやAI生成サイトを共有する際に知っておきたいアクセスログの基本を解説。記録される情報の種類、共有サービスでの活用例、プライバシーとの関係性まで判断できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-audit-log-html-share",
    "path": "/articles/what-is-audit-log-html-share",
    "title": "監査ログとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "静的HTMLやAI生成サイトの共有運用で知っておきたい監査ログの概念を解説。アクセスログとの違い、誰がどの操作を記録されるか、コンプライアンス対応での使い方まで把握できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-rate-limit-html-share",
    "path": "/articles/what-is-rate-limit-html-share",
    "title": "レート制限とは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "HTMLサイトやAI生成コンテンツの共有で登場するレート制限の概念を解説。なぜ必要か、どのような場面で影響を受けるか、設定やトラブル時の対処方法まで理解できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-bot-detection-html-share",
    "path": "/articles/what-is-bot-detection-html-share",
    "title": "Bot検知とは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "HTML共有やAI生成サイトの運用で問題になるボットアクセスを検知・制御する仕組みを解説。どうやって人間とボットを区別するか、誤検知が起きる場面、設定で気をつける点まで理解できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-abuse-report-html-share",
    "path": "/articles/what-is-abuse-report-html-share",
    "title": "通報導線とは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AI生成サイトやHTML共有サービスで知っておきたい通報導線（アビューズレポート）の概念を解説。どのような問題が報告対象になるか、運営側と投稿者側それぞれの対応まで把握できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-phishing-detection-html-share",
    "path": "/articles/what-is-phishing-detection-html-share",
    "title": "フィッシング検知とは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AI生成サイトの共有サービスが導入するフィッシング検知の仕組みを解説。どのように偽サイトを判別するか、正規コンテンツが誤検知される場面、対処方法まで理解できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-secret-scanning-html-share",
    "path": "/articles/what-is-secret-scanning-html-share",
    "title": "シークレットスキャンとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AI生成HTMLやzipファイルを外部共有する前に知っておきたいシークレットスキャンの概念を解説。何が検出対象になるか、誤検知の扱い、共有サービスで実装されている場合の動作まで理解できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-api-key-rotation-html-share",
    "path": "/articles/what-is-api-key-rotation-html-share",
    "title": "APIキーローテーションとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AI生成サイトや静的HTML開発で知っておきたいAPIキーローテーションの概念を解説。なぜ定期交換が必要か、どのタイミングで行うか、HTML共有の文脈での具体的な影響まで理解できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-public-token-html-share",
    "path": "/articles/what-is-public-token-html-share",
    "title": "公開トークンとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "HTMLやAI生成サイトのフロントエンドに含まれる公開トークンの概念と、秘密鍵との違いを解説。どのトークンはHTML上に置いてよく、どのトークンは絶対に置いてはいけないかを判断できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-bearer-token-html-share",
    "path": "/articles/what-is-bearer-token-html-share",
    "title": "Bearerトークンとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AI生成サイトやHTML共有の文脈で知っておきたいBearerトークンの仕組みを解説。HTTPヘッダーでの使い方、フロントエンドに含めてはいけない理由、漏えい時のリスクまで理解できます。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-localstorage-html-share",
    "path": "/articles/what-is-localstorage-html-share",
    "title": "localStorageとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "静的HTML共有やAI生成サイトのプレビューを送る担当者が「localStorageって何？」と感じたときに読む解説。データが残り続けるリスクと確認手順が分かります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-sessionstorage-html-share",
    "path": "/articles/what-is-sessionstorage-html-share",
    "title": "sessionStorageとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AI生成HTMLやWeb制作物をプレビューURLで共有する際に知っておきたいsessionStorageの基本。localStorageとの違いと、共有時のリスク管理ポイントを整理した解説記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-cookie-samesite-html-share",
    "path": "/articles/what-is-cookie-samesite-html-share",
    "title": "SameSite Cookieとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "SameSite Cookie属性の意味をAI生成HTMLの共有・プレビュー配信の文脈で解説。Strict／Lax／Noneの違いと、外部URL経由でプレビューするときのトラブル回避策が分かります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-httponly-cookie-html-share",
    "path": "/articles/what-is-httponly-cookie-html-share",
    "title": "HttpOnly Cookieとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "HttpOnly Cookie属性の意味とAI生成HTML共有時のセキュリティ上の意味を解説。XSS対策として何が守られ何が守られないかを、Web公開の初心者にも分かりやすく整理しています。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-secure-cookie-html-share",
    "path": "/articles/what-is-secure-cookie-html-share",
    "title": "Secure Cookieとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "Secure Cookie属性の基本とAI生成HTMLのプレビュー共有での意味を解説。HTTP/HTTPS環境の違いがCookieの挙動に与える影響と、静的HTML共有時の注意点をまとめています。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-cache-control-html-share",
    "path": "/articles/what-is-cache-control-html-share",
    "title": "Cache-Controlとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "Cache-Controlの基本をHTML共有・AI生成サイトの文脈から解説。更新が確認者に届かない原因と、キャッシュを適切にコントロールしてプレビューを確実に届ける方法が分かります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-etag-html-share",
    "path": "/articles/what-is-etag-html-share",
    "title": "ETagとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "ETagの仕組みをHTMLプレビュー共有・AI生成サイトの文脈で解説。ファイル更新が正しく確認者に届くかどうかとETagの関係、および静的配信サービスでの挙動が分かります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-stale-cache-html-share",
    "path": "/articles/what-is-stale-cache-html-share",
    "title": "stale cacheとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "stale cache（古いキャッシュ）がHTML共有やAI生成サイトのプレビュー更新で引き起こす問題を解説。原因・確認方法・クリア手順を実践的にまとめています。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-edge-cache-html-share",
    "path": "/articles/what-is-edge-cache-html-share",
    "title": "エッジキャッシュとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "エッジキャッシュの仕組みをHTML共有・AI生成サイトのプレビュー配信の観点から解説。Cloudflare静的配信での挙動と、差し替え後に確認者へ最新版を届けるための操作手順が分かります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-cold-start-html-share",
    "path": "/articles/what-is-cold-start-html-share",
    "title": "コールドスタートとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "コールドスタートの意味とAI生成サイトのプレビュー共有への影響を解説。静的HTMLと動的レンダリングで挙動がどう違うか、確認者に遅延を感じさせないための選択肢が分かります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-static-rendering-html-share",
    "path": "/articles/what-is-static-rendering-html-share",
    "title": "静的レンダリングとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "静的レンダリングの仕組みをHTML共有・AI生成サイトの配信の観点で解説。サーバーサイドレンダリングやSPAとの違い、静的HTMLをプレビュー共有する際のメリットと制約が分かります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-server-side-rendering-html-share",
    "path": "/articles/what-is-server-side-rendering-html-share",
    "title": "サーバーサイドレンダリングとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "サーバーサイドレンダリング（SSR）の仕組みをAI生成サイトのプレビュー共有の文脈で解説。静的HTML配信との違い、プレビュー用途でSSRが必要な場面と不要な場面が分かります。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-client-side-rendering-html-share",
    "path": "/articles/what-is-client-side-rendering-html-share",
    "title": "クライアントサイドレンダリングとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AIで作ったHTMLサイトの共有に戸惑うWeb担当者向け。クライアントサイドレンダリングの仕組みから、共有時に起こりがちな表示ずれや読み込み遅延の原因、静的HTMLとの違いまでを具体的に解説する。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-hydration-html-share",
    "path": "/articles/what-is-hydration-html-share",
    "title": "Hydrationとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "共有したAI生成サイトでボタンが動かない原因を知りたい方向け。HydrationがHTML配信とどう関わるか、Hydration失敗時に起きる現象と対処法、静的共有時に知っておくべき注意点を具体的に説明する。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-island-architecture-html-share",
    "path": "/articles/what-is-island-architecture-html-share",
    "title": "Island Architectureとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AstroやNext.jsのApp RouterなどIsland Architectureを使ったAI生成サイトを共有・レビューしたいWeb担当者向け。Island Architectureの概念と静的配信との相性、共有時の注意点を解説する。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-single-page-app-html-share",
    "path": "/articles/what-is-single-page-app-html-share",
    "title": "SPAとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AI生成のSPAをチームや顧客にプレビュー共有したい方向け。SPAがHTML共有や静的配信と何が違うか、共有時に起きる404や白紙問題の原因と対策、安全な共有手順を具体的に解説する。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-mpa-html-share",
    "path": "/articles/what-is-mpa-html-share",
    "title": "MPAとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AIで作った複数ページのWebサイトを手軽に共有・レビューしたい方向け。MPAがSPAと何が違うか、HTMLファイルをそのまま配布できる条件と制限、安全に共有するためのチェックポイントを説明する。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-web-component-html-share",
    "path": "/articles/what-is-web-component-html-share",
    "title": "Web Componentsとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AI生成のHTMLにカスタム要素が含まれていて表示や動作に困っているWeb担当者向け。Web Componentsの基本概念と、静的HTML共有時の挙動・注意点、Polyfillが必要なケースを具体的に解説する。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-shadow-dom-html-share",
    "path": "/articles/what-is-shadow-dom-html-share",
    "title": "Shadow DOMとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "共有したAI生成HTMLでShadow DOMによるスタイルの効かない問題に直面した開発者・Web担当者向け。Shadow DOMの仕組み、HTMLファイル共有時のスタイル調整、DevToolsでの確認方法を説明する。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-service-worker-html-share",
    "path": "/articles/what-is-service-worker-html-share",
    "title": "Service Workerとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AI生成サイトの共有後に「更新が反映されない」と言われて困っているWeb担当者向け。Service Workerがキャッシュする仕組みと共有時のバージョン更新方法、不要なService Workerを無効化する手順を解説する。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-web-manifest-html-share",
    "path": "/articles/what-is-web-manifest-html-share",
    "title": "Web App Manifestとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AI生成サイトの共有時にホーム画面追加バナーやPWAインストール要求が表示されて困っているWeb担当者向け。Web App Manifestの役割と共有時の挙動、不要な場合の無効化手順を具体的に解説する。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-pwa-html-share",
    "path": "/articles/what-is-pwa-html-share",
    "title": "PWAとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AI生成のWebアプリをPWAとして公開・共有したいと考えているWeb担当者や開発者向け。PWAの条件・構成要素と静的ファイル配信の関係、共有時にインストールプロンプトを制御する方法を具体的に説明する。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-responsive-images-html-share",
    "path": "/articles/what-is-responsive-images-html-share",
    "title": "レスポンシブ画像とは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AI生成HTMLの画像がスマホで遅い、画質が合わないと感じている方向け。レスポンシブ画像とは何か、srcsetやsizesの基本、ギガサイト便などでHTMLを共有する際の画像最適化チェックポイントを解説する。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-srcset-html-share",
    "path": "/articles/what-is-srcset-html-share",
    "title": "srcsetとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "HTMLの画像表示をデバイス別に最適化したいWeb担当者・開発者向け。srcset属性の書き方と動作原理、sizesとの組み合わせ方、AI生成HTMLへの追記手順を具体的に説明する。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-lazy-loading-html-share",
    "path": "/articles/what-is-lazy-loading-html-share",
    "title": "lazy loadingとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AI生成サイトやHTML共有を使う非エンジニア向けに、lazy loadingの意味・動作・誤解しやすい点を具体例つきで解説。表示速度の問題を自己診断できるようになる記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-preload-html-share",
    "path": "/articles/what-is-preload-html-share",
    "title": "preloadとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AI生成サイトやHTMLファイル共有で発生する初期表示の遅延を改善するpreloadの役割を解説。適切な使い方と過剰使用のリスクを、非エンジニアでも判断できるよう具体例で説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-preconnect-html-share",
    "path": "/articles/what-is-preconnect-html-share",
    "title": "preconnectとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "外部リソースへの接続遅延を事前に解消するpreconnectの仕組みを解説。AI生成HTMLを共有する際にGoogleフォントや画像CDNへの接続を高速化する具体的な方法と注意点を紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-modulepreload-html-share",
    "path": "/articles/what-is-modulepreload-html-share",
    "title": "modulepreloadとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "JavaScriptモジュールを使ったAI生成サイトの初期動作遅延を解消するmodulepreloadの仕組みを解説。HTMLを共有する際に操作不能な時間を短縮したい担当者向けに、設定確認と注意点を具体的に紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-font-display-html-share",
    "path": "/articles/what-is-font-display-html-share",
    "title": "font-displayとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "Webフォントの読み込み中の表示動作を制御するfont-displayの設定値と動作の違いを解説。AI生成HTMLを共有する際に発生する文字化けや文字の消失問題を事前に防ぎたい非エンジニア向けの記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-variable-font-html-share",
    "path": "/articles/what-is-variable-font-html-share",
    "title": "Variable Fontとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "1ファイルで多様なウェイトとスタイルを表現できるVariable Fontの仕組みを解説。AI生成HTMLを外部に共有する際のファイル管理・ブラウザ対応・見た目崩れの防止策を非エンジニアにもわかりやすく説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-woff2-html-share",
    "path": "/articles/what-is-woff2-html-share",
    "title": "WOFF2とは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "Webフォントの現行標準形式WOFF2の特徴と圧縮率の高さを解説。AI生成HTMLをURLで共有する際にフォントファイルをどう扱うべきか、対応ブラウザや配信方法の選び方を具体的に説明する記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-svg-html-share",
    "path": "/articles/what-is-svg-html-share",
    "title": "SVGとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "ベクター形式の画像フォーマットSVGの特徴と、AI生成HTMLに含める際の利点・リスクを解説。ロゴやアイコンをHTML共有で高品質に配布したい方が、セキュリティと表示品質の両面から判断できる記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-webp-html-share",
    "path": "/articles/what-is-webp-html-share",
    "title": "WebPとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "GoogleがオープンソースとしているWebPフォーマットの圧縮効率と対応状況を解説。AI生成HTMLの画像をWebPに変換して共有URLの読み込み速度を改善したい方向けに、変換方法と代替表示の設定を説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-avif-html-share",
    "path": "/articles/what-is-avif-html-share",
    "title": "AVIFとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AV1ベースの高圧縮画像フォーマットAVIFの特徴と現在のブラウザ対応状況を解説。AI生成HTMLを共有する際にWebPと使い分ける判断基準や、非対応ブラウザへのフォールバック設定方法を具体的に説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-lcp-html-share",
    "path": "/articles/what-is-lcp-html-share",
    "title": "LCPとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "GoogleのCore Web VitalsのひとつLCPの意味と測定方法を解説。AI生成HTMLを共有URLで配布する前に表示速度を自己診断したい非エンジニア向けに、よくある原因と改善手順を具体的に説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-cls-html-share",
    "path": "/articles/what-is-cls-html-share",
    "title": "CLSとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "ページ表示中に要素が動く現象を測定するCLS（累積レイアウトシフト）の仕組みと原因を解説。AI生成HTMLを共有する際にフォント読み込みや画像サイズ指定の誤りで発生するレイアウトズレを防ぐ方法を具体的に説明します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-inp-html-share",
    "path": "/articles/what-is-inp-html-share",
    "title": "INPとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "WebのINP（Interaction to Next Paint）を初めて聞いたデザイナーや非エンジニアに向け、AI生成サイトのHTML共有シーンでの関連性と注意点をわかりやすく整理した解説記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-tti-html-share",
    "path": "/articles/what-is-tti-html-share",
    "title": "TTIとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "TTI（Time to Interactive）を初めて知るデザイナーやディレクター向けに、AI生成HTMLのURL共有シーンで何が問題になるか、どう改善するかを具体的に解説します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-accessibility-html-share",
    "path": "/articles/what-is-accessibility-html-share",
    "title": "アクセシビリティとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "アクセシビリティをはじめて意識するデザイナーやAI生成サイト制作者向けに、HTML共有の場面で知っておくべき基礎知識と最低限の確認手順をまとめた解説記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-aria-label-html-share",
    "path": "/articles/what-is-aria-label-html-share",
    "title": "aria-labelとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "aria-labelを初めて聞いた非エンジニアや、AI生成サイトをURL共有するデザイナーに向け、属性の役割・記述例・共有前のチェック方法を実践的にまとめた解説記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-keyboard-navigation-html-share",
    "path": "/articles/what-is-keyboard-navigation-html-share",
    "title": "キーボード操作とは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "HTMLのキーボード操作対応を初めて学ぶデザイナー・ディレクター向けに、AI生成サイトのURL共有場面での関連性と具体的な確認手順を解説した記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-color-contrast-html-share",
    "path": "/articles/what-is-color-contrast-html-share",
    "title": "コントラスト比とは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "HTMLのコントラスト比をはじめて確認するデザイナーやAI生成サイト制作者に向け、基準値の読み方・確認ツール・共有前の修正判断まで実践的に解説した記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-focus-ring-html-share",
    "path": "/articles/what-is-focus-ring-html-share",
    "title": "フォーカスリングとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "フォーカスリングについて初めて学ぶデザイナーやAI生成サイト制作者に向けて、なぜ重要か・どのように確認するか・共有前にどう対処するかを具体的に解説した記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-semantic-html-html-share",
    "path": "/articles/what-is-semantic-html-html-share",
    "title": "セマンティックHTMLとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "セマンティックHTMLを初めて意識するAI生成サイト制作者やデザイナーに向け、divとセマンティックタグの違い・共有前の確認方法・よくある誤解を実例で解説した記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-alt-text-html-share",
    "path": "/articles/what-is-alt-text-html-share",
    "title": "alt属性とは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "img要素のalt属性の正しい使い方を知りたいAI生成サイト制作者やデザイナー向けに、適切な記述例・よくある誤り・共有前のチェック方法を実践的に解説した記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-form-action-html-share",
    "path": "/articles/what-is-form-action-html-share",
    "title": "form actionとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "HTMLのform action属性を初めて確認するデザイナーやAI生成サイト制作者向けに、属性の仕組み・URL共有前のチェック方法・セキュリティ上の注意点を具体的に解説した記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-webhook-url-html-share",
    "path": "/articles/what-is-webhook-url-html-share",
    "title": "Webhook URLとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "Webhook URLを初めて聞くデザイナーやAI生成サイト制作者向けに、HTMLに埋め込まれたWebhookのリスク・確認手順・共有前の安全対策を具体的に解説した記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-csrf-html-share",
    "path": "/articles/what-is-csrf-html-share",
    "title": "CSRFとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "CSRFを初めて聞くデザイナーや非エンジニアに向けて、攻撃の仕組み・静的HTML共有での関連範囲・AIが生成したフォームで確認すべき点を実践的にまとめた解説記事です。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-xss-html-share",
    "path": "/articles/what-is-xss-html-share",
    "title": "XSSとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "静的HTMLやAI生成サイトを共有するときに知っておきたいXSSの基礎。仕組み・誤解されやすい点・具体的な対策を非エンジニアにもわかるように解説し、安全なWeb公開の判断材料を提供します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-clickjacking-html-share",
    "path": "/articles/what-is-clickjacking-html-share",
    "title": "クリックジャッキングとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "AI生成サイトやHTMLプレビュー共有の場面でクリックジャッキングがどう関係するかを解説。透明iframeを使った攻撃の仕組み・誤解されがちなポイント・X-Frame-Optionsによる防御策を実例とともに紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-open-redirect-html-share",
    "path": "/articles/what-is-open-redirect-html-share",
    "title": "オープンリダイレクトとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "オープンリダイレクトの仕組みをHTML共有・AI生成サイトの文脈で解説。フィッシング踏み台になるリスク・誤解されやすいポイント・URLパラメータによるリダイレクト処理の確認方法を具体的に紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-mixed-content-html-share",
    "path": "/articles/what-is-mixed-content-html-share",
    "title": "Mixed Contentとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "HTTPSページにHTTPリソースが混在するMixed Contentの問題を、AI生成サイトとHTML共有の場面で解説。アクティブ・パッシブMixed Contentの違い・ブラウザのブロック動作・修正手順を具体的に紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-third-party-cookie-html-share",
    "path": "/articles/what-is-third-party-cookie-html-share",
    "title": "サードパーティCookieとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "サードパーティCookieとは何か、AI生成サイトやHTMLプレビュー共有でどう関係するかを解説。Cookieの仕組み・ブラウザの規制動向・共有前にトラッキングコードを除去する手順を具体的に紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-tracker-pixel-html-share",
    "path": "/articles/what-is-tracker-pixel-html-share",
    "title": "トラッキングピクセルとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "HTMLメールやWebページに埋め込まれるトラッキングピクセルの仕組みをAI生成サイト・HTML共有の場面で解説。開封検知の原理・注意すべきタグパターン・プライバシーリスクの確認方法を具体的に紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-cdn-html-share",
    "path": "/articles/what-is-cdn-html-share",
    "title": "CDNとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "CDN（コンテンツデリバリーネットワーク）の仕組みをHTML共有・AI生成サイト配信の場面で解説。エッジサーバーによる高速化の原理・キャッシュの扱い・更新反映が遅れる原因と対処法を具体的に紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-origin-html-share",
    "path": "/articles/what-is-origin-html-share",
    "title": "originとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "Webセキュリティの基礎概念「オリジン」を、AI生成サイトのHTML共有に即して解説。プロトコル・ホスト・ポートの3要素・同一オリジンポリシーの意味・CORSエラーの発生条件と対処法を具体的に紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-subdomain-html-share",
    "path": "/articles/what-is-subdomain-html-share",
    "title": "サブドメインとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "サブドメインとは何か、AI生成サイトのHTML共有・プレビューURLの仕組みと絡めて解説。メインドメインとの関係・会社ドメイン認証への活用・DNS設定の基礎を具体的に紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-dns-cname-html-share",
    "path": "/articles/what-is-dns-cname-html-share",
    "title": "CNAMEとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "CNAMEレコードの仕組みを、AI生成サイトの自社ドメイン共有URLを設定する場面に合わせて解説。DNSのCNAMEとAレコードの違い・設定手順の注意点・よくある「CNAMEフラット化」問題を具体的に紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-txt-record-html-share",
    "path": "/articles/what-is-txt-record-html-share",
    "title": "TXTレコードとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "DNSのTXTレコードとは何かを、HTML共有・AI生成サイトの会社ドメイン認証に絡めて解説。SPF・DKIM・ドメイン所有権確認への活用・設定手順と確認方法を具体的に紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-ssl-certificate-html-share",
    "path": "/articles/what-is-ssl-certificate-html-share",
    "title": "SSL証明書とは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "SSL証明書の仕組みをAI生成サイト・HTML共有URLの観点から解説。HTTPS化・証明書の種類・有効期限エラーの原因と対処法・自社ドメイン設定時の注意点を具体的に紹介します。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-r2-html-share",
    "path": "/articles/what-is-r2-html-share",
    "title": "Cloudflare R2とは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "Cloudflare R2の基本概念を、HTMLファイルの配信・AI生成サイトの公開という文脈でやさしく解説。S3との違いやコスト特性を知りたいWeb担当者・制作者向け。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-d1-html-share",
    "path": "/articles/what-is-d1-html-share",
    "title": "Cloudflare D1とは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "Cloudflare D1の役割を、HTML共有・AI生成サイト配信の文脈で解説。Workers連携やSQLiteとの関係、料金感覚を知りたい開発者・担当者向け。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-workers-html-share",
    "path": "/articles/what-is-workers-html-share",
    "title": "Cloudflare Workersとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "Cloudflare WorkersがHTML共有・プレビュー配信にどう関わるかを具体的に解説。認証ロジックの追加やR2との連携パターンを知りたい開発者・技術担当者向け。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-pages-html-share",
    "path": "/articles/what-is-pages-html-share",
    "title": "Cloudflare Pagesとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "Cloudflare PagesがHTML配信・AI生成サイト共有でどう役立つかを解説。R2やWorkersとの使い分け、プレビューデプロイの活用法を知りたい担当者・開発者向け。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-object-storage-html-share",
    "path": "/articles/what-is-object-storage-html-share",
    "title": "オブジェクトストレージとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "オブジェクトストレージの概念を、HTMLファイルの配信・AI生成コンテンツの公開という文脈でわかりやすく解説。S3・R2との関係やファイルサーバーとの違いを整理したい方向け。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-zip-bomb-html-share",
    "path": "/articles/what-is-zip-bomb-html-share",
    "title": "ZIP bombとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "ZIP bombの仕組みと、HTMLファイルをZIPで共有・受け付けるサービス側・利用者側それぞれの注意点を解説。セキュリティリスクを正しく理解したい開発者・管理者向け。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-path-traversal-html-share",
    "path": "/articles/what-is-path-traversal-html-share",
    "title": "path traversalとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "path traversalの仕組みを、ZIPアップロード型のHTML共有サービスのリスクとして具体的に解説。サービス開発者と利用者それぞれの視点で注意点を整理。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-directory-index-html-share",
    "path": "/articles/what-is-directory-index-html-share",
    "title": "directory indexとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "directory indexの仕組みと、HTML共有・静的サイト公開時のセキュリティ上の注意点を解説。意図しないファイル公開を防ぎたいWeb担当者・開発者向け。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-root-relative-path-html-share",
    "path": "/articles/what-is-root-relative-path-html-share",
    "title": "ルート相対パスとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "ルート相対パスの仕組みと、AIが生成したHTMLをプレビューURLで共有する際のパス問題・解決策を解説。HTMLのリソース読み込みエラーに悩むWeb制作者・担当者向け。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "what-is-base-tag-html-share",
    "path": "/articles/what-is-base-tag-html-share",
    "title": "baseタグとは？HTML共有・AI生成サイトでの意味をやさしく解説",
    "description": "HTMLの`<base>`タグの仕組みと、AI生成HTMLをプレビューサービスで公開する際の活用法・注意点を解説。パス問題を解決したいWeb制作者・開発者向け。",
    "category": "用語解説",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hardcoded-api-key-check",
    "path": "/articles/hardcoded-api-key-check",
    "title": "AI生成HTMLにAPIキー直書きが残っていないか確認する方法",
    "description": "AI生成HTMLに残りがちなAPIキー直書きの確認方法を、具体的な検索手順・ブラウザツールの使い方とともに解説。公開前チェックを習慣にしたい制作者・担当者向け。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hardcoded-api-key-risk-countermeasure",
    "path": "/articles/hardcoded-api-key-risk-countermeasure",
    "title": "APIキー直書きを含むHTMLを共有するときのリスクと対策",
    "description": "APIキー直書きHTMLを共有する際の具体的なリスクと、漏えいを防ぐための設計・運用上の対策を解説。リスクの大きさを把握して判断したいWeb担当者・開発者向け。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hardcoded-api-key-external-review-checklist",
    "path": "/articles/hardcoded-api-key-external-review-checklist",
    "title": "社外レビュー前にAPIキー直書きを検出するチェックリスト",
    "description": "社外関係者にAI生成HTMLを送る前にAPIキー直書きを洗い出したい担当者向け。ソースの見方から共有設定・再発防止まで、現場で使える4段階チェックリストをまとめています。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hardcoded-api-key-prompt-scan",
    "path": "/articles/hardcoded-api-key-prompt-scan",
    "title": "APIキー直書きを防ぐAIプロンプトと公開前スキャン",
    "description": "AI生成HTMLへのAPIキー直書きをプロンプト設計で防ぎ、公開前スキャンで二重検出したい開発者・制作担当者向け。具体的なプロンプト文言とgrepコマンドをセットで紹介します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "external-form-action-check",
    "path": "/articles/external-form-action-check",
    "title": "AI生成HTMLに外部フォーム送信先が残っていないか確認する方法",
    "description": "AI生成HTMLのフォーム送信先が外部サービスに向いていないか心配な担当者向け。HTMLソースの確認手順からモック化・共有設定・再発防止まで、具体的な方法を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "external-form-action-risk-countermeasure",
    "path": "/articles/external-form-action-risk-countermeasure",
    "title": "外部フォーム送信先を含むHTMLを共有するときのリスクと対策",
    "description": "外部フォーム送信先を含むHTMLを社内外と共有する際のリスクを正しく把握し、適切な対策を打ちたい担当者向け。被害シナリオから即実施できる対処法まで整理しています。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "external-form-action-external-review-checklist",
    "path": "/articles/external-form-action-external-review-checklist",
    "title": "社外レビュー前に外部フォーム送信先を検出するチェックリスト",
    "description": "社外関係者にHTMLを送る前に外部フォーム送信先を検出したい担当者向け。ソースの確認ポイント・安全化の手順・再発しないための運用ルールを段階的に紹介します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "external-form-action-prompt-scan",
    "path": "/articles/external-form-action-prompt-scan",
    "title": "外部フォーム送信先を防ぐAIプロンプトと公開前スキャン",
    "description": "AIプロンプトの工夫で外部フォーム送信先の生成を防ぎつつ、公開前スキャンで二重チェックしたい担当者向け。具体的なプロンプト文言とコマンドラインのスキャン手順を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "phishy-copy-check",
    "path": "/articles/phishy-copy-check",
    "title": "AI生成HTMLにフィッシングに見える文言が残っていないか確認する方法",
    "description": "AI生成HTMLにフィッシング的な文言が残っていないか心配な担当者向け。代表的なフレーズのリストと確認手順、安全な共有方法、再発防止策をまとめています。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "phishy-copy-risk-countermeasure",
    "path": "/articles/phishy-copy-risk-countermeasure",
    "title": "フィッシングに見える文言を含むHTMLを共有するときのリスクと対策",
    "description": "フィッシング的な表現が混入したHTMLを共有した際に起きうるリスクを把握し、送付前・送付後に取れる対策を知りたい担当者向け。具体的な文言例と対処の優先順位を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "phishy-copy-external-review-checklist",
    "path": "/articles/phishy-copy-external-review-checklist",
    "title": "社外レビュー前にフィッシングに見える文言を検出するチェックリスト",
    "description": "社外レビュー用HTMLを送付する前にフィッシング的表現を検出して取り除きたい担当者向け。確認すべき文言パターンと修正例、安全な共有手順を一つの記事にまとめています。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "phishy-copy-prompt-scan",
    "path": "/articles/phishy-copy-prompt-scan",
    "title": "フィッシングに見える文言を防ぐAIプロンプトと公開前スキャン",
    "description": "AIプロンプトの書き方でフィッシング的文言の出力を防ぎ、公開前スキャンで取りこぼしを検出したい担当者向け。具体的なプロンプト追記例とスキャン手順を紹介します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "payment-link-check",
    "path": "/articles/payment-link-check",
    "title": "AI生成HTMLに決済リンク混入が残っていないか確認する方法",
    "description": "社外レビュー前にAI生成HTMLへ決済リンクや課金コードが混入していないか点検したい担当者向けに、ソース確認・設定・再発防止まで一連の手順を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "payment-link-risk-countermeasure",
    "path": "/articles/payment-link-risk-countermeasure",
    "title": "決済リンク混入を含むHTMLを共有するときのリスクと対策",
    "description": "決済リンク混入HTMLを共有する際のリスクを正しく理解し、状況に応じた対策を取りたい担当者向け。リスクの種類・無害化手順・共有時の設定・再発防止を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "payment-link-external-review-checklist",
    "path": "/articles/payment-link-external-review-checklist",
    "title": "社外レビュー前に決済リンク混入を検出するチェックリスト",
    "description": "社外レビュー前にHTMLファイルへの決済リンク混入や情報漏えいを防ぎたいWebディレクター・エンジニア向け。ソース確認の具体的な手順と安全な共有設定を整理した実用チェックリスト。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "payment-link-prompt-scan",
    "path": "/articles/payment-link-prompt-scan",
    "title": "決済リンク混入を防ぐAIプロンプトと公開前スキャン",
    "description": "AI生成HTMLに決済リンクが混入するメカニズムを理解したうえで、プロンプト設計とコマンドラインスキャンで混入を防ぎたいエンジニア・デザイナー向けの実践ガイドです。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tracking-tag-check",
    "path": "/articles/tracking-tag-check",
    "title": "AI生成HTMLに追跡タグが残っていないか確認する方法",
    "description": "AI生成HTMLに分析・広告系のトラッキングタグが残っていないか不安な担当者向けに、ソース確認の具体的な手順と安全な共有設定を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tracking-tag-risk-countermeasure",
    "path": "/articles/tracking-tag-risk-countermeasure",
    "title": "追跡タグを含むHTMLを共有するときのリスクと対策",
    "description": "追跡タグを含むHTMLを社外共有したときに起こりうるデータ漏洩・プライバシー違反・信頼失墜のリスクを具体的に説明し、事前に取れる対策を紹介します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tracking-tag-external-review-checklist",
    "path": "/articles/tracking-tag-external-review-checklist",
    "title": "社外レビュー前に追跡タグを検出するチェックリスト",
    "description": "HTMLを社外レビュー用に渡す前にGAやMeta Pixelなどの追跡タグを漏れなく検出したい方向けに、ソース確認・ネットワーク確認・共有設定の順番でチェックする手順書です。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "tracking-tag-prompt-scan",
    "path": "/articles/tracking-tag-prompt-scan",
    "title": "追跡タグを防ぐAIプロンプトと公開前スキャン",
    "description": "追跡タグの混入を防ぐAIプロンプトの書き方と、公開前にgrepや開発者ツールを使って漏れなくスキャンする手順を知りたいエンジニア・Webデザイナー向けのガイドです。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ga-id-check",
    "path": "/articles/ga-id-check",
    "title": "AI生成HTMLにGoogle Analytics IDの残りが残っていないか確認する方法",
    "description": "見た目では分からないGA測定IDの残存は、クライアントのアクセスデータが自社アナリティクスに混入するという実害につながります。AI生成HTMLを公開前にスキャンして混入を検出する方法を具体的に紹介します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ga-id-risk-countermeasure",
    "path": "/articles/ga-id-risk-countermeasure",
    "title": "Google Analytics IDの残りを含むHTMLを共有するときのリスクと対策",
    "description": "Google Analytics IDが残ったHTMLを誤って共有したときに起こりうるデータ汚染・クライアント信頼失墜・GDPR問題を整理し、予防策と事後対応の手順を説明します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ga-id-external-review-checklist",
    "path": "/articles/ga-id-external-review-checklist",
    "title": "社外レビュー前にGoogle Analytics IDの残りを検出するチェックリスト",
    "description": "担当者の経験値に頼らず一定水準の安全確認を行うには、チェックリストが有効です。デザインレビューや試作品共有の前にGoogle Analytics IDの混入を見つけるための手順を整理しました。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "ga-id-prompt-scan",
    "path": "/articles/ga-id-prompt-scan",
    "title": "Google Analytics IDの残りを防ぐAIプロンプトと公開前スキャン",
    "description": "大量生成フローで毎回手動チェックするのは非現実的です。プロンプト設計とシェルスキャンを組み合わせた自動化パイプラインで、GA IDの混入を人手をかけずに防ぐ方法を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "meta-pixel-check",
    "path": "/articles/meta-pixel-check",
    "title": "AI生成HTMLにMeta Pixelの残りが残っていないか確認する方法",
    "description": "AI生成HTMLにMeta Pixel（旧Facebook Pixel）のコードが残っていないか確認したい担当者向けに、PixelコードのパターンとDevToolsを使った検出手順を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "meta-pixel-risk-countermeasure",
    "path": "/articles/meta-pixel-risk-countermeasure",
    "title": "Meta Pixelの残りを含むHTMLを共有するときのリスクと対策",
    "description": "Meta Pixelのコードが混入したHTMLを社外共有したとき発生するオーディエンス汚染・法的リスク・信頼問題を解説し、事前防止策と事後対応の手順をまとめます。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "meta-pixel-external-review-checklist",
    "path": "/articles/meta-pixel-external-review-checklist",
    "title": "社外レビュー前にMeta Pixelの残りを検出するチェックリスト",
    "description": "社外レビュー用HTMLにMeta Pixelコードが混入していないか調べたいマーケターや制作担当者向けに、送付前に実行すべき検出手順と確認箇所を具体的に整理しました。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "meta-pixel-prompt-scan",
    "path": "/articles/meta-pixel-prompt-scan",
    "title": "Meta Pixelの残りを防ぐAIプロンプトと公開前スキャン",
    "description": "AIで生成したHTMLにMeta Pixelのコードが混入するのを防ぎたい担当者向けに、プロンプト設計の改善点と公開前スキャン手順を具体的に説明します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "internal-domain-check",
    "path": "/articles/internal-domain-check",
    "title": "AI生成HTMLに社内ドメイン露出が残っていないか確認する方法",
    "description": "社内ドメインやイントラURLがAI生成HTMLに混入していないか調べたいセキュリティ担当者・制作者向けに、公開前に実施すべきチェック手順を具体的に説明します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "internal-domain-risk-countermeasure",
    "path": "/articles/internal-domain-risk-countermeasure",
    "title": "社内ドメイン露出を含むHTMLを共有するときのリスクと対策",
    "description": "社内ドメインを含むHTMLを共有してしまった場合のリスクと、事前・事後の対策を知りたいWeb担当者やセキュリティ担当者向けの実務的なガイドです。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "internal-domain-external-review-checklist",
    "path": "/articles/internal-domain-external-review-checklist",
    "title": "社外レビュー前に社内ドメイン露出を検出するチェックリスト",
    "description": "社外関係者にHTMLを送付する前に社内ドメインの露出を検出したい制作担当者向けに、実行順に並べた具体的な確認ステップをまとめたチェックリストです。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "internal-domain-prompt-scan",
    "path": "/articles/internal-domain-prompt-scan",
    "title": "社内ドメイン露出を防ぐAIプロンプトと公開前スキャン",
    "description": "社内ドメイン露出をAI生成HTMLから防ぎたい担当者向けに、プロンプトの制約設計と公開前のgrepスキャン手順を実務的に解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "customer-name-check",
    "path": "/articles/customer-name-check",
    "title": "AI生成HTMLに顧客名の露出が残っていないか確認する方法",
    "description": "AI生成HTMLに顧客名が残っていないか確認したい営業担当者や制作者向けに、テキスト・属性値・コメントを含む全確認箇所と具体的な検索手順を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "customer-name-risk-countermeasure",
    "path": "/articles/customer-name-risk-countermeasure",
    "title": "顧客名の露出を含むHTMLを共有するときのリスクと対策",
    "description": "顧客名が含まれるHTMLを誤って共有するリスクと、事前チェックから事後対応までの実践的な対策を営業・マーケ担当者向けに解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "customer-name-external-review-checklist",
    "path": "/articles/customer-name-external-review-checklist",
    "title": "社外レビュー前に顧客名の露出を検出するチェックリスト",
    "description": "社外レビュワーにHTMLを送付する前に顧客名の露出を検出したい担当者向けに、実行順で整理した具体的なチェック手順をまとめたチェックリストです。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "customer-name-prompt-scan",
    "path": "/articles/customer-name-prompt-scan",
    "title": "顧客名の露出を防ぐAIプロンプトと公開前スキャン",
    "description": "AIで作成したHTMLに顧客名が残るのを防ぎたい担当者向けに、プロンプトへの制約追加と公開前スキャンの具体的な手順を実務的に解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "source-map-check",
    "path": "/articles/source-map-check",
    "title": "AI生成HTMLにsource mapの露出が残っていないか確認する方法",
    "description": "AI生成HTMLやビルド成果物にソースマップの参照が残っていないか調べたい開発者・セキュリティ担当者向けに、確認箇所と検出手順を具体的に解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "source-map-risk-countermeasure",
    "path": "/articles/source-map-risk-countermeasure",
    "title": "source mapの露出を含むHTMLを共有するときのリスクと対策",
    "description": "ソースマップが外部公開されたHTMLに残っているリスクと、ビルド設定・配布設定・監視の3段階で対策を取りたい開発者・情報セキュリティ担当者向けの実践ガイドです。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "source-map-external-review-checklist",
    "path": "/articles/source-map-external-review-checklist",
    "title": "社外レビュー前にsource mapの露出を検出するチェックリスト",
    "description": "社外共有前にソースマップが漏れていないか不安な担当者向け。検出コマンドと確認手順を一覧化し、レビュー依頼のたびに判断に迷わず動けるようになる。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "source-map-prompt-scan",
    "path": "/articles/source-map-prompt-scan",
    "title": "source mapの露出を防ぐAIプロンプトと公開前スキャン",
    "description": "AI生成HTMLのsource map露出を防ぎたい開発者向け。プロンプトへの明示的な禁止指示から、公開前に自動スキャンするシェルコマンドまで、具体的な手順を紹介します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "html-comments-secret-check",
    "path": "/articles/html-comments-secret-check",
    "title": "AI生成HTMLにHTMLコメント内の秘密情報が残っていないか確認する方法",
    "description": "AI生成HTMLを社外へ渡す前にHTMLコメント内の秘密情報を見つけたい担当者向け。コメントが漏えい経路になる仕組み、検索方法、削除手順まで実務的に解説。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "html-comments-secret-risk-countermeasure",
    "path": "/articles/html-comments-secret-risk-countermeasure",
    "title": "HTMLコメント内の秘密情報を含むHTMLを共有するときのリスクと対策",
    "description": "HTMLコメント内の秘密情報を含むファイルを共有するリスクが気になる担当者向け。漏えいが起きるシナリオ、影響範囲の見極め方、修正と予防の具体的な対策を紹介。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "html-comments-secret-external-review-checklist",
    "path": "/articles/html-comments-secret-external-review-checklist",
    "title": "社外レビュー前にHTMLコメント内の秘密情報を検出するチェックリスト",
    "description": "「渡したHTMLのコメントに社内情報が入っていた」という事故を防ぎたい人向け。見落としやすい箇所と項目別の確認手順をまとめ、共有前の一巡で安心できる。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "html-comments-secret-prompt-scan",
    "path": "/articles/html-comments-secret-prompt-scan",
    "title": "HTMLコメント内の秘密情報を防ぐAIプロンプトと公開前スキャン",
    "description": "AI生成HTMLのコメント内秘密情報を防ぎたい担当者向け。AIへの指示の書き方から、公開前に自動でコメントを検出するシェルスクリプトまで、再現性のある手順を紹介。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hidden-input-data-check",
    "path": "/articles/hidden-input-data-check",
    "title": "AI生成HTMLにhidden input内の個人情報が残っていないか確認する方法",
    "description": "AI生成HTMLのhidden input内の個人情報を公開前に発見したい担当者向け。hidden inputが漏えい経路になるしくみ、DevToolsと検索コマンドによる確認手順、安全な処理方法を紹介。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hidden-input-data-risk-countermeasure",
    "path": "/articles/hidden-input-data-risk-countermeasure",
    "title": "hidden input内の個人情報を含むHTMLを共有するときのリスクと対策",
    "description": "画面に出ないから大丈夫と思っていたhidden inputに個人情報が入っていた場合のリスクを具体的に把握し、共有前に取るべき対策を判断できるようになる記事。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hidden-input-data-external-review-checklist",
    "path": "/articles/hidden-input-data-external-review-checklist",
    "title": "社外レビュー前にhidden input内の個人情報を検出するチェックリスト",
    "description": "フォームのプロトタイプを外部パートナーに渡す前に、hidden inputへの個人情報混入を一項目ずつ確かめたい担当者のための検出チェックリスト。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "hidden-input-data-prompt-scan",
    "path": "/articles/hidden-input-data-prompt-scan",
    "title": "hidden input内の個人情報を防ぐAIプロンプトと公開前スキャン",
    "description": "hidden input内の個人情報を生成段階から防ぎたい担当者向け。AIへの具体的な指示の書き方と、公開前にhidden inputを自動検出するスクリプトの実装手順を解説。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "localstorage-personal-data-check",
    "path": "/articles/localstorage-personal-data-check",
    "title": "AI生成HTMLにlocalStorage内の個人情報が残っていないか確認する方法",
    "description": "AIが生成したHTMLを動かしたあと、ブラウザに個人情報が残っていないか心配な人向け。localStorageの確認手順と削除方法を分かりやすく解説する。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "localstorage-personal-data-risk-countermeasure",
    "path": "/articles/localstorage-personal-data-risk-countermeasure",
    "title": "localStorage内の個人情報を含むHTMLを共有するときのリスクと対策",
    "description": "localStorageにデータが残ったHTMLを配布するとどんな問題が起きるか理解したうえで、安全に共有するための判断軸と具体的な対処法を得られる記事。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "localstorage-personal-data-external-review-checklist",
    "path": "/articles/localstorage-personal-data-external-review-checklist",
    "title": "社外レビュー前にlocalStorage内の個人情報を検出するチェックリスト",
    "description": "社外レビュー用HTMLを共有する担当者向け。localStorageに残った個人情報を公開前に発見するための具体的な確認手順と、ギガサイト便で安全に共有するための設定を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "localstorage-personal-data-prompt-scan",
    "path": "/articles/localstorage-personal-data-prompt-scan",
    "title": "localStorage内の個人情報を防ぐAIプロンプトと公開前スキャン",
    "description": "AIプロンプトの設計でlocalStorage混入を防ぎたい開発者・制作担当者向け。生成前の指示テンプレートと公開前スキャンの具体的なコマンドを解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "query-token-check",
    "path": "/articles/query-token-check",
    "title": "AI生成HTMLにURLクエリのトークンが残っていないか確認する方法",
    "description": "AI生成HTMLを公開前にチェックしたい担当者向け。URLクエリのトークンがソースに残存していないか確認する手順と、残っていた場合の対処法を具体的に説明します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "query-token-risk-countermeasure",
    "path": "/articles/query-token-risk-countermeasure",
    "title": "URLクエリのトークンを含むHTMLを共有するときのリスクと対策",
    "description": "URLクエリにトークンが含まれたHTMLを社外に送ろうとしている担当者向け。漏えい経路・想定被害・共有前の修正手順を網羅したリスク対策ガイドです。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "query-token-external-review-checklist",
    "path": "/articles/query-token-external-review-checklist",
    "title": "社外レビュー前にURLクエリのトークンを検出するチェックリスト",
    "description": "社外レビュー前にURLクエリのトークン漏えいリスクを排除したい担当者向け。ブラウザ確認・ソース検索・安全な共有設定の3ステップチェックリストを解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "query-token-prompt-scan",
    "path": "/articles/query-token-prompt-scan",
    "title": "URLクエリのトークンを防ぐAIプロンプトと公開前スキャン",
    "description": "AIでHTML生成する際にURLクエリへのトークン混入を防ぎたい担当者向け。プロンプト制約の書き方とgrepを使った公開前スキャンの具体的な手順を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "iframe-embed-check",
    "path": "/articles/iframe-embed-check",
    "title": "AI生成HTMLにiframe埋め込みが残っていないか確認する方法",
    "description": "AI生成HTMLを公開前に確認したい担当者向け。iframeが残存していないかソースで見る方法・DevToolsで動作確認する方法・見つかった場合の対処法を説明します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "iframe-embed-risk-countermeasure",
    "path": "/articles/iframe-embed-risk-countermeasure",
    "title": "iframe埋め込みを含むHTMLを共有するときのリスクと対策",
    "description": "iframe埋め込みを含むHTMLを安全に共有したい担当者向け。外部送信リスク・クリックジャッキング・サードパーティクッキーの問題と、それぞれの対処法を説明します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "iframe-embed-external-review-checklist",
    "path": "/articles/iframe-embed-external-review-checklist",
    "title": "社外レビュー前にiframe埋め込みを検出するチェックリスト",
    "description": "社外レビュー前のiframe確認を標準化したい担当者・チームリーダー向け。具体的な確認手順とギガサイト便の設定をチェックリスト形式で解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "iframe-embed-prompt-scan",
    "path": "/articles/iframe-embed-prompt-scan",
    "title": "iframe埋め込みを防ぐAIプロンプトと公開前スキャン",
    "description": "AI生成HTMLのiframe混入をプロンプト設計とスキャンで防ぎたい担当者向け。具体的なプロンプト制約の書き方とgrepを使った自動スキャン手順を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "clickjacking-risk-check",
    "path": "/articles/clickjacking-risk-check",
    "title": "AI生成HTMLにクリックジャッキングが残っていないか確認する方法",
    "description": "AI生成HTMLのクリックジャッキングリスクを公開前に排除したい担当者向け。HTMLのソースとHTTPヘッダーで確認すべき箇所と、ギガサイト便での安全な共有設定を説明します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "clickjacking-risk-risk-countermeasure",
    "path": "/articles/clickjacking-risk-risk-countermeasure",
    "title": "クリックジャッキングを含むHTMLを共有するときのリスクと対策",
    "description": "AI生成HTMLのクリックジャッキングリスクを理解して対策したい担当者向け。攻撃の仕組み・ヘッダー設定・CSSチェック・ギガサイト便での対処法を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "clickjacking-risk-external-review-checklist",
    "path": "/articles/clickjacking-risk-external-review-checklist",
    "title": "社外レビュー前にクリックジャッキングを検出するチェックリスト",
    "description": "社外レビュー用にHTMLを共有する前にクリックジャッキングリスクを洗い出したい方向け。ソース検索からブラウザ開発者ツールを使った検証手順まで、見落としがちな確認項目を網羅し、安全な公開判断ができるようになるチェックリストを提供します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "clickjacking-risk-prompt-scan",
    "path": "/articles/clickjacking-risk-prompt-scan",
    "title": "クリックジャッキングを防ぐAIプロンプトと公開前スキャン",
    "description": "AIプロンプトの書き方を工夫してクリックジャッキングの原因となるコードをそもそも生成させたくない方向け。プロンプト制約の具体文例と、生成済みHTMLを素早くスキャンするコマンドを組み合わせた二段構えの防止策を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "mixed-content-risk-check",
    "path": "/articles/mixed-content-risk-check",
    "title": "AI生成HTMLにhttp混在が残っていないか確認する方法",
    "description": "AIが生成したHTMLにhttp://のリソースが混在していないか確認したい方向け。ブラウザコンソールでの警告の読み方、grepによる一括検索、修正後の動作確認まで、公開前に完結できる手順を具体的に示します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "mixed-content-risk-risk-countermeasure",
    "path": "/articles/mixed-content-risk-risk-countermeasure",
    "title": "http混在を含むHTMLを共有するときのリスクと対策",
    "description": "http混在を含むHTMLを共有した場合のリスクを把握し、適切な対処法を選びたい方向け。ブラウザによる表示ブロックや通信傍受のリスクを具体的に示しながら、修正・代替策・共有設定の3つの観点から対策を解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "mixed-content-risk-external-review-checklist",
    "path": "/articles/mixed-content-risk-external-review-checklist",
    "title": "社外レビュー前にhttp混在を検出するチェックリスト",
    "description": "社外レビュー用にHTMLを共有する前にhttp混在を確実に検出したい担当者向け。目視チェックだけでなくブラウザの開発者ツールやコマンドラインを活用した確認手順と、再発を防ぐ運用ルールをセットで解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "mixed-content-risk-prompt-scan",
    "path": "/articles/mixed-content-risk-prompt-scan",
    "title": "http混在を防ぐAIプロンプトと公開前スキャン",
    "description": "AIを使ってHTMLを繰り返し生成する作業者向け。http混在を生成前に防ぐプロンプト設計と、生成後に素早くスキャンする方法を組み合わせ、毎回の手動チェック工数を減らしながらセキュリティ品質を維持する方法を紹介します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "download-link-check",
    "path": "/articles/download-link-check",
    "title": "AI生成HTMLに不審なダウンロードリンクが残っていないか確認する方法",
    "description": "AIが生成したHTMLにダウンロードリンクが含まれるとき、公開前に安全性を確認したい担当者向け。リンク先URLの確認方法、不審なドメインの見分け方、共有前にリンクを無効化または差し替えるまでの手順を具体的に示します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "download-link-risk-countermeasure",
    "path": "/articles/download-link-risk-countermeasure",
    "title": "不審なダウンロードリンクを含むHTMLを共有するときのリスクと対策",
    "description": "提案資料やデザインカンプに不審なリンクが混入していた場合の被害イメージを把握し、社外に渡す前に何を確認すればよいかを判断できるようになる。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "download-link-external-review-checklist",
    "path": "/articles/download-link-external-review-checklist",
    "title": "社外レビュー前に不審なダウンロードリンクを検出するチェックリスト",
    "description": "社外レビュー用HTMLを送付する前に不審なダウンロードリンクを洗い出したい担当者向け。download属性リンク・外部スクリプト経由のリダイレクト・相対パスの解決確認まで含めた実践チェックリストと、問題発覚時の対応手順を提供します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "download-link-prompt-scan",
    "path": "/articles/download-link-prompt-scan",
    "title": "不審なダウンロードリンクを防ぐAIプロンプトと公開前スキャン",
    "description": "AIが生成したHTMLに不審なダウンロードリンクが混入するリスクを、プロンプト設計と自動スキャンで防ぎたい担当者向け。具体的なプロンプト制約文とgrepコマンドを使ったスキャン手順、および発見した際の修正方針をまとめます。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "xss-risk-check",
    "path": "/articles/xss-risk-check",
    "title": "AI生成HTMLにXSSが残っていないか確認する方法",
    "description": "AIが生成したHTMLにXSSの脆弱性が残っていないか確認したい開発者・担当者向け。innerHTMLやevalなどの危険なパターンを検索するコマンド、ブラウザでの挙動確認、自動化の方法まで、公開前に完結できるXSSチェック手順をまとめます。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "xss-risk-risk-countermeasure",
    "path": "/articles/xss-risk-risk-countermeasure",
    "title": "XSSを含むHTMLを共有するときのリスクと対策",
    "description": "XSSが含まれる可能性のあるHTMLを共有するリスクを把握し、適切な対策を講じたい担当者向け。被害シナリオ、コードレベルの修正方法、CSPによる軽減策、再発防止の仕組みづくりを段階的に解説します。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "xss-risk-external-review-checklist",
    "path": "/articles/xss-risk-external-review-checklist",
    "title": "社外レビュー前にXSSを検出するチェックリスト",
    "description": "社外レビューを依頼する前にAI生成HTMLのXSSリスクを洗い出したい開発者・デザイナー向け。inline scriptやevalの有無、外部送信先の特定方法など、公開前に一度だけ通るべき手順を解説する。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "xss-risk-prompt-scan",
    "path": "/articles/xss-risk-prompt-scan",
    "title": "XSSを防ぐAIプロンプトと公開前スキャン",
    "description": "AI生成HTMLのXSSリスクをプロンプト設計とスキャンツールの両面から抑えたい開発者向け。指示文の書き方の具体例と、VSCodeやgrepを使ったスキャン手順を説明し、リリース判断の基準を示す。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "open-redirect-risk-check",
    "path": "/articles/open-redirect-risk-check",
    "title": "AI生成HTMLにオープンリダイレクトが残っていないか確認する方法",
    "description": "AIが生成したプロトタイプにフィッシング悪用される抜け穴が潜んでいないか不安な開発者向け。オープンリダイレクトの見つけ方と修正方針を実例で確認できる。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "open-redirect-risk-risk-countermeasure",
    "path": "/articles/open-redirect-risk-risk-countermeasure",
    "title": "オープンリダイレクトを含むHTMLを共有するときのリスクと対策",
    "description": "オープンリダイレクトを含むHTMLを外部共有するリスクを理解し、修正判断と対策を迷わず行いたいチームリーダー・開発者向け。フィッシング被害の具体的なシナリオと、許可リスト実装・URL認証による二段階対策を解説する。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "open-redirect-risk-external-review-checklist",
    "path": "/articles/open-redirect-risk-external-review-checklist",
    "title": "社外レビュー前にオープンリダイレクトを検出するチェックリスト",
    "description": "社外レビュー依頼の直前にオープンリダイレクトの有無を素早く確認したい担当者向け。確認すべきコードパターンとブラウザでの動作確認手順を実践的にまとめ、問題があった場合の修正判断基準も示す。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "open-redirect-risk-prompt-scan",
    "path": "/articles/open-redirect-risk-prompt-scan",
    "title": "オープンリダイレクトを防ぐAIプロンプトと公開前スキャン",
    "description": "AI生成HTMLのオープンリダイレクトをプロンプト設計とスキャンツールの両面から防ぎたい開発者向け。プロンプトの制約文の書き方、grep・Semgrepを使った検出手順、修正パターンのサンプルを具体的に解説する。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "oauth-callback-check",
    "path": "/articles/oauth-callback-check",
    "title": "AI生成HTMLにOAuth callback URLが残っていないか確認する方法",
    "description": "AIに認証画面を作らせたあと、コールバックURLやclient_idが外部に漏れるリスクを防ぎたい開発者向け。ソース内の残存箇所を見つける手順を解説する。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "oauth-callback-risk-countermeasure",
    "path": "/articles/oauth-callback-risk-countermeasure",
    "title": "OAuth callback URLを含むHTMLを共有するときのリスクと対策",
    "description": "外部にHTMLを共有する前にOAuth関連の設定情報が含まれていないか確認したい人向け。漏洩した場合の影響と、共有前に取るべき具体的な対策を整理した記事。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "oauth-callback-external-review-checklist",
    "path": "/articles/oauth-callback-external-review-checklist",
    "title": "社外レビュー前にOAuth callback URLを検出するチェックリスト",
    "description": "OAuth callbackを含むAI生成HTMLを社外レビュー前に確認したい開発者・セキュリティ担当向け。client_secretの有無確認からcallback URLの登録設定まで、共有可否を判断するための手順と基準をまとめた実践的なチェックリスト記事。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "oauth-callback-prompt-scan",
    "path": "/articles/oauth-callback-prompt-scan",
    "title": "OAuth callback URLを防ぐAIプロンプトと公開前スキャン",
    "description": "AIでOAuth関連HTMLを安全に生成したい開発者向け。client_secretの埋め込み防止プロンプト、callback URL処理の検出パターン、Semgrepによる自動スキャン設定を具体的に解説し、公開前チェックの精度を高める方法を示す。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webhook-url-check",
    "path": "/articles/webhook-url-check",
    "title": "AI生成HTMLにWebhook URLが残っていないか確認する方法",
    "description": "Slack・Discord連携を含むAI生成HTMLを外部に渡す前に、Webhook URLが埋め込まれていないか確認したい担当者向け。検出コマンドと対処手順をまとめている。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webhook-url-risk-countermeasure",
    "path": "/articles/webhook-url-risk-countermeasure",
    "title": "Webhook URLを含むHTMLを共有するときのリスクと対策",
    "description": "Webhook URLを含むHTMLを外部共有するリスクと対策を把握したいチームリーダー向け。不正投稿・データ収集・レート制限超過といった具体的な被害シナリオと、URLのプレースホルダー化・環境変数管理・共有時の認証設定を解説する。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webhook-url-external-review-checklist",
    "path": "/articles/webhook-url-external-review-checklist",
    "title": "社外レビュー前にWebhook URLを検出するチェックリスト",
    "description": "社外レビュー用にHTMLを共有する前に、Webhook URLが埋め込まれていないかを確認したいエンジニアや担当者向け。具体的なチェック箇所とレビュー設定の手順を解説し、情報漏えいリスクを判断できる。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "webhook-url-prompt-scan",
    "path": "/articles/webhook-url-prompt-scan",
    "title": "Webhook URLを防ぐAIプロンプトと公開前スキャン",
    "description": "AIでHTMLを生成するときにWebhook URLを埋め込ませないためのプロンプト設計と、生成後の自動スキャン手順を知りたい開発者向け。具体的なコマンドと設定例をもとに、再現性のある防止策を選べる。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "supabase-anon-key-check",
    "path": "/articles/supabase-anon-key-check",
    "title": "AI生成HTMLにSupabase anon keyが残っていないか確認する方法",
    "description": "AI生成HTMLにSupabaseのanon keyが残っていないか不安なエンジニアや担当者向け。キーの見つけ方・危険度の評価方法・除去後の確認手順を知ることができ、公開可否を自分で判断できるようになる。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "supabase-anon-key-risk-countermeasure",
    "path": "/articles/supabase-anon-key-risk-countermeasure",
    "title": "Supabase anon keyを含むHTMLを共有するときのリスクと対策",
    "description": "Supabase anon keyが入ったHTMLを共有しようとしている開発者・担当者向け。RLSとの関係から来るリスクの大きさと、共有を安全に行うための設定・代替手段を判断できるようになる。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "supabase-anon-key-external-review-checklist",
    "path": "/articles/supabase-anon-key-external-review-checklist",
    "title": "社外レビュー前にSupabase anon keyを検出するチェックリスト",
    "description": "外部レビューを依頼するたびにAPIキーの混入が気になる担当者向け。Supabase anon keyの典型的な混入パターンと、共有前の確認フローを一覧で確認できる。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "supabase-anon-key-prompt-scan",
    "path": "/articles/supabase-anon-key-prompt-scan",
    "title": "Supabase anon keyを防ぐAIプロンプトと公開前スキャン",
    "description": "Supabaseのanon keyをAI生成HTMLに含めないためのプロンプト設計と、生成後の自動スキャン方法を知りたい開発者向け。具体的なプロンプト例とコマンドを使って実践的な防止フローを選べる。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firebase-config-check",
    "path": "/articles/firebase-config-check",
    "title": "AI生成HTMLにFirebase設定が残っていないか確認する方法",
    "description": "AI生成HTMLにFirebaseの設定情報が残っていないか確認したいエンジニア・担当者向け。設定値ごとの公開可否の判断基準と、ソース内で見つける具体的な手順を知ることができる。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firebase-config-risk-countermeasure",
    "path": "/articles/firebase-config-risk-countermeasure",
    "title": "Firebase設定を含むHTMLを共有するときのリスクと対策",
    "description": "Firebase設定が埋め込まれたHTMLを共有する際のリスクを正確に理解し、対策の優先順位を判断したい開発者向け。設定の種類ごとの危険度と、共有前にとれる具体的な措置を解説する。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firebase-config-external-review-checklist",
    "path": "/articles/firebase-config-external-review-checklist",
    "title": "社外レビュー前にFirebase設定を検出するチェックリスト",
    "description": "社外レビュー用のHTML共有前にFirebase設定を確実に検出したい担当者向け。確認すべき具体的な文字列・設定箇所と、問題発見時の対処手順が分かり、安全に共有を進められる。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "firebase-config-prompt-scan",
    "path": "/articles/firebase-config-prompt-scan",
    "title": "Firebase設定を防ぐAIプロンプトと公開前スキャン",
    "description": "Firebase設定をAI生成HTMLに含めさせないためのプロンプト設計と、公開前のスキャン方法を知りたい開発者向け。プロンプトの書き方・スキャンコマンド・CI組み込み手順まで一連の流れを判断できる。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "stripe-key-check",
    "path": "/articles/stripe-key-check",
    "title": "AI生成HTMLにStripeキーが残っていないか確認する方法",
    "description": "AI生成HTMLにStripeのキーが含まれていないか確認したいエンジニア・担当者向け。キーの種類ごとのリスク差と、ファイル内で見つけるための具体的な検索手順・対処法を理解できる。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "stripe-key-risk-countermeasure",
    "path": "/articles/stripe-key-risk-countermeasure",
    "title": "Stripeキーを含むHTMLを共有するときのリスクと対策",
    "description": "StripeキーがHTMLに含まれている状態でのリスクの大きさと、キーの種類に応じた対処法を理解したい開発者・担当者向け。本番・テスト・Publishable・Secretの違いをもとに、どこまで対応すべきかを判断できる。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "stripe-key-external-review-checklist",
    "path": "/articles/stripe-key-external-review-checklist",
    "title": "社外レビュー前にStripeキーを検出するチェックリスト",
    "description": "Stripeキーの社外流出を防ぎたい開発者・デザイナー向けに、HTML公開前の確認箇所と安全な共有手順を体系的にまとめたチェックリスト。何を見ればよいか判断できます。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "stripe-key-prompt-scan",
    "path": "/articles/stripe-key-prompt-scan",
    "title": "Stripeキーを防ぐAIプロンプトと公開前スキャン",
    "description": "AIでHTML生成する際にStripeキーが混入するリスクに悩む開発者向け。安全なプロンプトの書き方と公開前スキャン手順を具体的に示し、どの対策を優先すべきか判断できます。",
    "category": "セキュリティ",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-slack-distribute-method",
    "path": "/articles/how-to-slack-distribute-method",
    "title": "レビュー用URLをSlackで配る方法",
    "description": "Slackでレビュー用URLを共有したい担当者向けに、準備・送信・無効化の一連の流れを解説。どのチャンネルに何をどう送ればよいか判断できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-slack-distribute-steps-note",
    "path": "/articles/how-to-slack-distribute-steps-note",
    "title": "レビュー用URLをSlackで配るときの手順と注意点",
    "description": "Slackでレビュー用URL配布時のミスに悩む担当者向け。送信前チェックから修正版の再送まで、つまずきやすい注意点を段階的に解説。次のレビュー依頼から即実践できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-slack-distribute-checklist",
    "path": "/articles/how-to-slack-distribute-checklist",
    "title": "レビュー用URLをSlackで配るためのチェックリスト",
    "description": "Slack経由でのレビューURL配布を確実に進めたい担当者向け。送信前から完了後まで、見落としが起きやすいポイントをチェックリスト形式で整理しています。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-teams-distribute-method",
    "path": "/articles/how-to-teams-distribute-method",
    "title": "レビュー用URLをTeamsで配る方法",
    "description": "TeamsでレビューURLを共有したい担当者向けに、チャンネル・チャット・会議チャットの使い分けと配布時の設定手順を解説。どの機能を使えばよいか判断できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-teams-distribute-steps-note",
    "path": "/articles/how-to-teams-distribute-steps-note",
    "title": "レビュー用URLをTeamsで配るときの手順と注意点",
    "description": "TeamsでレビューURL配布時の手順ミスや注意点に悩む担当者向け。チャンネル設定の確認方法から再送時の対応まで、具体的な注意点をステップ順に整理しています。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-teams-distribute-checklist",
    "path": "/articles/how-to-teams-distribute-checklist",
    "title": "レビュー用URLをTeamsで配るためのチェックリスト",
    "description": "TeamsでのレビューURL配布を確実に進めたいチーム担当者向け。見落としが多い公開範囲確認とURL無効化を含む3段階チェックリストで、ミスなく運用できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-email-expiry-url-method",
    "path": "/articles/how-to-email-expiry-url-method",
    "title": "メールで期限付きURLを送る方法",
    "description": "メールで期限付きレビューURLを送りたい担当者向け。件名・パスワードの記載方法から期限管理・再送まで、メール特有のトラブルを防ぐ手順を解説しています。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-email-expiry-url-steps-note",
    "path": "/articles/how-to-email-expiry-url-steps-note",
    "title": "メールで期限付きURLを送るときの手順と注意点",
    "description": "メール依頼でのレビューが期限内に返ってこない、URLが開けないというトラブルに悩む担当者向け。手順の各ステップで起きやすい問題と対処法を具体的に整理しています。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-email-expiry-url-checklist",
    "path": "/articles/how-to-email-expiry-url-checklist",
    "title": "メールで期限付きURLを送るためのチェックリスト",
    "description": "メールで期限付きURLを送る際の見落としをなくしたい担当者向け。宛先確認からURL無効化まで、3段階チェックリストで安定した運用ができるようになります。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-notion-embed-url-method",
    "path": "/articles/how-to-notion-embed-url-method",
    "title": "Notionに共有URLを貼る方法",
    "description": "Notionでレビュー用URLを管理・共有したい担当者向け。埋め込み機能の使い方とページ公開範囲の設定手順を解説し、どの方法を選べばよいか判断できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-notion-embed-url-steps-note",
    "path": "/articles/how-to-notion-embed-url-steps-note",
    "title": "Notionに共有URLを貼るときの手順と注意点",
    "description": "Notionにレビュー用URLを貼る手順と注意点を実務目線でまとめた記事。「相手が開けない」「情報が漏れた」を防ぎたいWebデザイナーや制作会社の担当者が、確認すべき項目と失敗しやすいポイントをひと通り把握できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-notion-embed-url-checklist",
    "path": "/articles/how-to-notion-embed-url-checklist",
    "title": "Notionに共有URLを貼るためのチェックリスト",
    "description": "NotionにWebプレビューURLを貼る前後に実施すべきチェック項目を一覧化した記事。デザイン確認やHTMLプレビュー共有を行うWeb制作者が、送付ミスや情報漏えいを防ぐためのポイントを把握できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-google-doc-url-method",
    "path": "/articles/how-to-google-doc-url-method",
    "title": "Googleドキュメントに共有URLを載せる方法",
    "description": "Googleドキュメントにレビュー用HTMLプレビューURLを挿入する方法を解説。提案書や制作仕様書の中でURLを管理したいWeb制作者・ディレクターが、適切なリンク挿入方法と権限の分離を理解して安全に共有できるようになります。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-google-doc-url-steps-note",
    "path": "/articles/how-to-google-doc-url-steps-note",
    "title": "Googleドキュメントに共有URLを載せるときの手順と注意点",
    "description": "Googleドキュメントに共有プレビューURLを貼る際の具体的な手順と、見落としやすい注意点を解説した記事。クライアントへのデザイン確認依頼を担うWebディレクターや制作担当者が、送付ミスやアクセス不能トラブルを事前に回避するための判断材料が得られます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-google-doc-url-checklist",
    "path": "/articles/how-to-google-doc-url-checklist",
    "title": "Googleドキュメントに共有URLを載せるためのチェックリスト",
    "description": "Googleドキュメントで外部URLを共有する際に確認すべき項目をチェックリスト形式で整理した記事。HTMLプレビューを安全にクライアントへ届けたいWeb制作者が、送付フローのどこで失敗しやすいかを把握して事前対策を講じるための記事です。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-qr-print-method",
    "path": "/articles/how-to-qr-print-method",
    "title": "QRコードを印刷物に載せる方法",
    "description": "QRコードを印刷物に載せる際の準備から印刷・配布後の運用まで、実務的な手順を解説する記事。URLが変わるとQRコードが無効になることを知っておきたい制作担当者が、安定運用のための構造を理解して判断できるようになります。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-qr-print-steps-note",
    "path": "/articles/how-to-qr-print-steps-note",
    "title": "QRコードを印刷物に載せるときの手順と注意点",
    "description": "印刷物へのQRコード掲載を確実に成功させるための手順と注意点をまとめた記事。チラシやポスターにQRコードを載せるデザイナーや制作担当者が、スキャンエラーや配布後のURL変更トラブルを防ぐための判断基準を把握できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-qr-print-checklist",
    "path": "/articles/how-to-qr-print-checklist",
    "title": "QRコードを印刷物に載せるためのチェックリスト",
    "description": "QRコードを印刷物に掲載する前後に必要な確認項目をチェックリスト形式で整理した記事。配布後のスキャンエラーやURL変更トラブルを防ぎたいデザイナーや制作ディレクターが、工程ごとの確認ポイントを把握できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-same-url-ab-method",
    "path": "/articles/how-to-same-url-ab-method",
    "title": "同じURLでA/B案を見せる方法",
    "description": "同一URLでデザインのA案・B案をクライアントに見せる方法を解説する記事。「URLが2つあってどちらを見ればいいか分からない」というクライアントの混乱を防ぎたいWebデザイナーや制作ディレクターが、効率的なA/Bレビューフローを構築するための手法を把握できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-same-url-ab-steps-note",
    "path": "/articles/how-to-same-url-ab-steps-note",
    "title": "同じURLでA/B案を見せるときの手順と注意点",
    "description": "同一URLでA案・B案を順番に確認してもらう際の手順と落とし穴を解説する記事。複数のデザイン案を同じURLで管理したいWebデザイナー・制作ディレクターが、キャッシュ問題やフィードバック混在を防いで効率的なA/Bレビューを実施するための判断材料が得られます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-same-url-ab-checklist",
    "path": "/articles/how-to-same-url-ab-checklist",
    "title": "同じURLでA/B案を見せるためのチェックリスト",
    "description": "同一URLでA案・B案を切り替えるレビューフローで確認すべき項目をチェックリスト形式でまとめた記事。ファイル差し替え方式を使うWebデザイナー・ディレクターが、キャッシュトラブルやフィードバック混在を防ぐための事前・事後確認の全体像を把握できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-expiry-by-project-method",
    "path": "/articles/how-to-expiry-by-project-method",
    "title": "公開期限を案件ごとに決める方法",
    "description": "Webプレビュー共有URLの公開期限を案件ごとに設定・管理する方法を解説した記事。複数の案件を並行して担うフリーランスや制作会社のディレクターが、セキュリティリスクを抑えながら期限管理の運用コストを下げるための手法と注意点を把握できます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-expiry-by-project-steps-note",
    "path": "/articles/how-to-expiry-by-project-steps-note",
    "title": "公開期限を案件ごとに決めるときの手順と注意点",
    "description": "案件ごとに公開期限を決めたいWebデザイナー・ディレクター向け。ギガサイト便での期限設定手順から失敗しやすい落とし穴、クライアントへの案内文テンプレートまで一通り解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-expiry-by-project-checklist",
    "path": "/articles/how-to-expiry-by-project-checklist",
    "title": "公開期限を案件ごとに決めるためのチェックリスト",
    "description": "レビューURLの公開期限を案件単位で管理したい方に向け、設定前・送付時・期限後の3段階に分けたチェックリストを具体的に解説します。抜け漏れを防ぐ運用ポイントも紹介。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-password-separate-channel-method",
    "path": "/articles/how-to-password-separate-channel-method",
    "title": "パスワードを別経路で渡す方法",
    "description": "認証付きURLのパスワードを安全に渡したいWeb制作者・ディレクター向け。SMS・電話・チャットツールなど別経路の使い分け方と、各方法のリスクを整理して解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-password-separate-channel-steps-note",
    "path": "/articles/how-to-password-separate-channel-steps-note",
    "title": "パスワードを別経路で渡すときの手順と注意点",
    "description": "パスワード付きURLを安全に共有する際、別経路通知で起きやすい混乱を防ぎたい方向け。送付タイミング・文面の組み立て方・よくある失敗パターンを具体的に解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-password-separate-channel-checklist",
    "path": "/articles/how-to-password-separate-channel-checklist",
    "title": "パスワードを別経路で渡すためのチェックリスト",
    "description": "パスワード別経路送付の抜け漏れを防ぎたいWeb制作チーム向け。送付前・送付時・確認後の各タイミングで確認すべき項目をリスト形式で整理し、実務的な運用ポイントを解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-email-auth-list-method",
    "path": "/articles/how-to-email-auth-list-method",
    "title": "メール認証の対象者を整理する方法",
    "description": "ギガサイト便のメール認証を使って特定メンバーだけに公開したいディレクター・担当者向け。対象者リストの整理方法から設定ミスの防ぎ方まで、実務的な視点で解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-email-auth-list-steps-note",
    "path": "/articles/how-to-email-auth-list-steps-note",
    "title": "メール認証の対象者を整理するときの手順と注意点",
    "description": "メール認証の対象者を正確に設定したいWeb担当者向け。アドレスリストの整理から設定後のテスト方法、失敗時の対処法まで実践的なステップを解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-email-auth-list-checklist",
    "path": "/articles/how-to-email-auth-list-checklist",
    "title": "メール認証の対象者を整理するためのチェックリスト",
    "description": "メール認証の設定ミスによるトラブルを防ぎたいディレクター・担当者向け。アドレスリスト作成から動作確認まで、抜け漏れのない確認ステップをチェックリスト形式で解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-multiple-domain-allow-method",
    "path": "/articles/how-to-multiple-domain-allow-method",
    "title": "会社ドメインを複数許可する方法",
    "description": "複数企業が閲覧するURLを管理したい担当者向け。会社ドメインを複数許可する設定方法から、混在するドメインの整理方法・設定ミスの防ぎ方まで実践的に解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-multiple-domain-allow-steps-note",
    "path": "/articles/how-to-multiple-domain-allow-steps-note",
    "title": "会社ドメインを複数許可するときの手順と注意点",
    "description": "会社ドメインを複数許可する際のミスを防ぎたい担当者向け。設定手順・ドメインの確認方法・許可後のテスト方法と注意点を実務的な観点から整理して解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-multiple-domain-allow-checklist",
    "path": "/articles/how-to-multiple-domain-allow-checklist",
    "title": "会社ドメインを複数許可するためのチェックリスト",
    "description": "複数の会社ドメインを許可する設定を抜け漏れなく行いたい担当者向け。入力前・保存後・送付前の3段階で確認すべきポイントをチェックリスト形式で整理します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-short-term-confidential-method",
    "path": "/articles/how-to-short-term-confidential-method",
    "title": "社外秘ページを短期間だけ開く方法",
    "description": "社外秘コンテンツを短期間だけ安全に外部共有したいビジネスパーソン向け。期限・認証・公開範囲を組み合わせた最小リスク公開の方法と、実務でよくある失敗への対処法を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-short-term-confidential-steps-note",
    "path": "/articles/how-to-short-term-confidential-steps-note",
    "title": "社外秘ページを短期間だけ開くときの手順と注意点",
    "description": "社外秘ページを短期間だけ外部に開示したいWeb担当者・ディレクター向けに、公開前の確認手順・リスクを避けるポイント・取引先への連絡文例を実践的にまとめた記事です。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-short-term-confidential-checklist",
    "path": "/articles/how-to-short-term-confidential-checklist",
    "title": "社外秘ページを短期間だけ開くためのチェックリスト",
    "description": "社外秘ページを短期間だけ外部公開する際の見落としを防ぎたいWeb担当者向けに、準備・手順・失効までのフェーズ別チェックリストを具体的にまとめた記事です。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-access-log-reminder-method",
    "path": "/articles/how-to-access-log-reminder-method",
    "title": "アクセスログをレビュー督促に使う方法",
    "description": "レビュー返信が来ない状況に困っているディレクター・制作担当者向けに、認証付き共有URLのアクセスログを読んで督促の有無・タイミングを判断する具体的な方法を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-access-log-reminder-steps-note",
    "path": "/articles/how-to-access-log-reminder-steps-note",
    "title": "アクセスログをレビュー督促に使うときの手順と注意点",
    "description": "認証付き共有URLのアクセスログをレビュー督促に活用したいディレクター向けに、ログの取得・読み方・督促タイミングの判断基準と注意点を実務ベースで解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-access-log-reminder-checklist",
    "path": "/articles/how-to-access-log-reminder-checklist",
    "title": "アクセスログをレビュー督促に使うためのチェックリスト",
    "description": "アクセスログをレビュー督促に使いたい進行担当者向けに、準備・ログ確認・督促送付・締め処理までの工程をチェックリスト形式で実践的にまとめた記事です。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-viewed-only-followup-method",
    "path": "/articles/how-to-viewed-only-followup-method",
    "title": "閲覧済みの相手だけに再依頼する方法",
    "description": "レビュー共有後に閲覧した相手だけに絞って再依頼したいディレクター・制作担当者向けに、アクセスログを使った対象絞り込みから再依頼メッセージの送り方まで具体的に説明します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-viewed-only-followup-steps-note",
    "path": "/articles/how-to-viewed-only-followup-steps-note",
    "title": "閲覧済みの相手だけに再依頼するときの手順と注意点",
    "description": "閲覧済みの相手だけに再依頼を行いたいプロジェクト担当者向けに、ログで対象を特定する手順・誤送信を防ぐ確認方法・相手に圧力をかけないコミュニケーションの注意点を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-viewed-only-followup-checklist",
    "path": "/articles/how-to-viewed-only-followup-checklist",
    "title": "閲覧済みの相手だけに再依頼するためのチェックリスト",
    "description": "閲覧済みの相手だけに再依頼したいプロジェクト担当者向けに、認証設定の確認からログ照合・メッセージ送付・記録管理までをフェーズ別チェックリストで整理した実践記事です。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-version-note-method",
    "path": "/articles/how-to-version-note-method",
    "title": "差し替え履歴をメモする方法",
    "description": "HTMLや静的ページのレビュー中に差し替えが発生する担当者向けに、差し替え履歴をシンプルにメモする方法と、共有URLを更新した際の変更記録のつけ方を実践的に解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-version-note-steps-note",
    "path": "/articles/how-to-version-note-steps-note",
    "title": "差し替え履歴をメモするときの手順と注意点",
    "description": "静的HTMLページの差し替えを繰り返す担当者向けに、差し替え履歴を記録する手順・バージョン命名のルール・差し替え通知のタイミングと注意点を実務ベースで解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-version-note-checklist",
    "path": "/articles/how-to-version-note-checklist",
    "title": "差し替え履歴をメモするためのチェックリスト",
    "description": "静的ページの差し替えが発生するたびに確認したい担当者向けに、アップロード前の準備から履歴記録・関係者通知まで、工程別の差し替えチェックリストを具体的にまとめた記事です。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-project-name-slug-method",
    "path": "/articles/how-to-project-name-slug-method",
    "title": "URL名を案件名に寄せる方法",
    "description": "複数の静的ページを同時進行で管理しているディレクター・Web担当者向けに、ギガサイト便のURL名を案件名に合わせて設定する方法と命名規則・注意点を実践的に解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-project-name-slug-steps-note",
    "path": "/articles/how-to-project-name-slug-steps-note",
    "title": "URL名を案件名に寄せるときの手順と注意点",
    "description": "WebデザイナーやWebディレクター向けに、HTML共有URLのスラッグを案件名に合わせる手順と注意点を具体的に解説。ミス送信や差し替え漏れを防ぐ実践的な運用フローが身につく。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-project-name-slug-checklist",
    "path": "/articles/how-to-project-name-slug-checklist",
    "title": "URL名を案件名に寄せるためのチェックリスト",
    "description": "HTMLレビューURLを案件名スラッグで管理したいWebデザイナー・ディレクター向けに、共有前から修正対応まで使えるチェックリストを提供。抜け漏れなく安全に共有できる手順が整理できる。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-mobile-check-url-method",
    "path": "/articles/how-to-mobile-check-url-method",
    "title": "スマホ確認URLを送る方法",
    "description": "WebデザイナーやコーダーがスマホレビューURLを送る際の具体的な手順を解説。認証付きURLの作り方から、スマホ表示の事前確認方法、クライアントへの送付方法まで実践的にわかる。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-mobile-check-url-steps-note",
    "path": "/articles/how-to-mobile-check-url-steps-note",
    "title": "スマホ確認URLを送るときの手順と注意点",
    "description": "スマホ確認URLをクライアントに送るときの準備から送付・フォローまでの手順を整理。よくある「開けない」「パスワードが不明」トラブルの防ぎ方もあわせて解説しているため、送付ミスゼロを目指したい担当者に向いている。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-mobile-check-url-checklist",
    "path": "/articles/how-to-mobile-check-url-checklist",
    "title": "スマホ確認URLを送るためのチェックリスト",
    "description": "スマホレビューURLを安全・確実に共有したいWebディレクターやデザイナーに向けて、送付前後に使えるチェックリストを提供。端末確認・情報漏洩防止・送付ルートの選択まで網羅している。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-browser-cross-check-method",
    "path": "/articles/how-to-browser-cross-check-method",
    "title": "Chrome/Firefox両方で確認依頼する方法",
    "description": "ChromeとFirefoxの両方でHTMLを確認してもらいたいWebデザイナー・ディレクター向けに、複数ブラウザ確認を依頼するURLの共有方法と依頼文の書き方を解説。ブラウザ差異によるトラブルを事前に防ぐ実践的な手順が身につく。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-browser-cross-check-steps-note",
    "path": "/articles/how-to-browser-cross-check-steps-note",
    "title": "Chrome/Firefox両方で確認依頼するときの手順と注意点",
    "description": "ChromeとFirefox両方でのHTMLレビューを依頼する際の手順と注意点を具体的に解説。見落としがちなフィードバック収集の設計やブラウザ固有バグへの対処まで含む、実践的な確認依頼フローが理解できる。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-browser-cross-check-checklist",
    "path": "/articles/how-to-browser-cross-check-checklist",
    "title": "Chrome/Firefox両方で確認依頼するためのチェックリスト",
    "description": "ChromeとFirefox両方のブラウザ確認をクライアントに依頼する際に使えるチェックリストを解説。依頼の抜け漏れをなくし、フィードバックの精度を上げたいWebディレクターやデザイナーに適した実践的な内容。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-ai-zip-structure-method",
    "path": "/articles/how-to-ai-zip-structure-method",
    "title": "AIにZIP構成を整理させる方法",
    "description": "AIが生成したHTML/CSSファイルのZIP構成が乱れていて公開できないと困っているWebデザイナーやAIツール利用者向けに、AIを活用してZIPを正しく整理する方法を具体的に解説。ギガサイト便での公開を前提とした手順が身につく。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-ai-zip-structure-steps-note",
    "path": "/articles/how-to-ai-zip-structure-steps-note",
    "title": "AIにZIP構成を整理させるときの手順と注意点",
    "description": "AIを活用してHTML/ZIPファイルの構成を整理したいWebデザイナーやAIツール利用者向けに、手順の流れと注意点を詳しく解説。AIとのやり取りで陥りやすいパスのズレや構成ミスを事前に防ぐ実践的な知識が得られる。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-ai-zip-structure-checklist",
    "path": "/articles/how-to-ai-zip-structure-checklist",
    "title": "AIにZIP構成を整理させるためのチェックリスト",
    "description": "AIにZIPのフォルダ構成整理を依頼する際の確認チェックリストを解説。整理前・整理中・整理後のステップ別に確認すべき項目を整理し、パスミスや構成ミスによる再作業を防ぎたいWebデザイナー・AIツール利用者に向けた実践的な内容。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-ai-prepublish-check-method",
    "path": "/articles/how-to-ai-prepublish-check-method",
    "title": "AIに公開前チェックを依頼する方法",
    "description": "HTML共有前にAIを使って公開前チェックを依頼したいWebデザイナー・コーダー向けに、AIへの依頼方法とチェック観点の指定方法を解説。情報漏洩・表示崩れ・リンク切れなどの事前スクリーニングに使える実践的な手順がわかる。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-ai-prepublish-check-steps-note",
    "path": "/articles/how-to-ai-prepublish-check-steps-note",
    "title": "AIに公開前チェックを依頼するときの手順と注意点",
    "description": "AIへ公開前レビューを依頼したいWebデザイナーや制作担当者向けに、準備から依頼文の送り方・よくある失敗まで実務的な手順と注意点を解説する記事。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-ai-prepublish-check-checklist",
    "path": "/articles/how-to-ai-prepublish-check-checklist",
    "title": "AIに公開前チェックを依頼するためのチェックリスト",
    "description": "AIへの公開前チェック依頼を確実に進めたいディレクター・デザイナー向けに、準備から共有URLの失効まで全工程の確認項目をチェックリスト形式でまとめた記事。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-url-not-screenshot-method",
    "path": "/articles/how-to-url-not-screenshot-method",
    "title": "スクショではなくURLで見せる方法",
    "description": "デザインや制作物のレビューをスクショで済ませている人に向けて、URLで実物を見せるメリットと、認証付きプレビューURLを数秒で作る具体的な手順を解説する記事。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-url-not-screenshot-steps-note",
    "path": "/articles/how-to-url-not-screenshot-steps-note",
    "title": "スクショではなくURLで見せるときの手順と注意点",
    "description": "スクリーンショット共有のレビュー運用に課題を感じているWeb担当者に向けて、認証付きプレビューURLを使ったURL共有の具体的な手順と、よくある失敗を防ぐ注意点を説明する記事。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-url-not-screenshot-checklist",
    "path": "/articles/how-to-url-not-screenshot-checklist",
    "title": "スクショではなくURLで見せるためのチェックリスト",
    "description": "スクショ送付からURL共有へ移行したいWebデザイナーや制作チーム向けに、ファイル準備から認証設定・連絡文面・期限管理まで全工程のチェック項目を整理した実務向け記事。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-review-not-pdf-method",
    "path": "/articles/how-to-review-not-pdf-method",
    "title": "HTMLをPDF化せずにレビューする方法",
    "description": "HTMLレビューのたびにPDF変換している担当者に向けて、PDF化で失われる情報とURL共有への切り替え手順、認証付きURLを使った安全な共有方法を実務目線で説明する記事。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-review-not-pdf-steps-note",
    "path": "/articles/how-to-review-not-pdf-steps-note",
    "title": "HTMLをPDF化せずにレビューするときの手順と注意点",
    "description": "HTMLのPDF変換レビューをURL共有に切り替えたいチームに向けて、移行手順・認証設定・版管理の注意点を具体的に解説し、安全で効率的なレビュー運用を実現するための記事。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-review-not-pdf-checklist",
    "path": "/articles/how-to-review-not-pdf-checklist",
    "title": "HTMLをPDF化せずにレビューするためのチェックリスト",
    "description": "HTMLレビューのPDF運用から脱却したい担当者に向け、ファイル整備から認証設定・レビュアーへの連絡・URL失効まで各フェーズの確認項目をチェックリスト形式で整理した記事。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-disable-form-before-share-method",
    "path": "/articles/how-to-disable-form-before-share-method",
    "title": "フォームを無効化して共有する方法",
    "description": "HTMLのレビュー共有でフォーム誤送信が心配なWeb制作者に向けて、submitイベントの無効化・action属性の削除・CSSによる操作禁止の3手法を比較し、認証付きURLと組み合わせた安全な共有方法を解説する記事。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-disable-form-before-share-steps-note",
    "path": "/articles/how-to-disable-form-before-share-steps-note",
    "title": "フォームを無効化して共有するときの手順と注意点",
    "description": "フォーム付きHTMLのレビュー共有で誤送信を防ぎたいWeb担当者に向けて、フォーム無効化の具体的な手順・コードの書き方・本番ファイルへの影響を防ぐ注意点を実務的に解説する記事。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-disable-form-before-share-checklist",
    "path": "/articles/how-to-disable-form-before-share-checklist",
    "title": "フォームを無効化して共有するためのチェックリスト",
    "description": "フォーム付きHTMLのレビュー共有前に必要な全確認項目を把握したいWeb制作者に向けて、ファイル管理・無効化処理・テスト・送付・廃棄の各フェーズのチェックポイントをまとめた実務向け記事。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-disable-external-links-method",
    "path": "/articles/how-to-disable-external-links-method",
    "title": "外部リンクをクリック不可にして見せる方法",
    "description": "レビュー用HTML共有で外部リンクの誤クリックを防ぎたいWeb制作者に向けて、CSSによる操作無効化・JavaScriptによるhref書き換え・target属性の制御という3つの手法と認証付きURL共有を組み合わせた安全な運用を解説する記事。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-disable-external-links-steps-note",
    "path": "/articles/how-to-disable-external-links-steps-note",
    "title": "外部リンクをクリック不可にして見せるときの手順と注意点",
    "description": "デザインレビュー用HTMLの外部リンクをクリック不可にして共有したいWeb制作者向け。準備から送付文面まで、失敗しやすいポイントを押さえながら手順を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-disable-external-links-checklist",
    "path": "/articles/how-to-disable-external-links-checklist",
    "title": "外部リンクをクリック不可にして見せるためのチェックリスト",
    "description": "HTMLプレビューの外部リンクをクリック不可にして共有する作業を抜け漏れなく進めたいディレクター・デザイナー向け。全工程をチェックリスト形式でまとめた実践ガイドです。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-noindex-plus-auth-method",
    "path": "/articles/how-to-noindex-plus-auth-method",
    "title": "noindexと認証を両方使う方法",
    "description": "制作途中のHTMLプレビューをSEOインデックスから除外しつつ認証でアクセス制限したい制作者向け。noindexと認証を両立する具体的な設定方法を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-noindex-plus-auth-steps-note",
    "path": "/articles/how-to-noindex-plus-auth-steps-note",
    "title": "noindexと認証を両方使うときの手順と注意点",
    "description": "HTMLプレビューをnoindexで検索除外しながら認証でアクセス制限したい方向け。設定手順と失敗しやすい注意点を具体的に解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-noindex-plus-auth-checklist",
    "path": "/articles/how-to-noindex-plus-auth-checklist",
    "title": "noindexと認証を両方使うためのチェックリスト",
    "description": "noindexメタタグと認証の両方をHTMLプレビューに設定したいWeb担当者向け。設定から送付まで抜け漏れなく進むためのチェックリストを提供します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-instant-unpublish-method",
    "path": "/articles/how-to-instant-unpublish-method",
    "title": "公開後にすぐ非公開にする方法",
    "description": "HTMLプレビューURLを必要なときにすぐ非公開にしたいWeb制作者・ディレクター向け。各共有サービスでの即時削除・非公開操作の方法と注意点を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-instant-unpublish-steps-note",
    "path": "/articles/how-to-instant-unpublish-steps-note",
    "title": "公開後にすぐ非公開にするときの手順と注意点",
    "description": "公開中のHTMLプレビューURLを素早く非公開にしたい方向け。即時停止の手順と、非公開後に対処すべき注意点をわかりやすく解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-instant-unpublish-checklist",
    "path": "/articles/how-to-instant-unpublish-checklist",
    "title": "公開後にすぐ非公開にするためのチェックリスト",
    "description": "公開中のHTMLプレビューをすぐに非公開にしたい方向け。即時停止から後処理の通知まで、緊急時でも抜け漏れなく対処できるチェックリストです。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-compress-images-before-share-method",
    "path": "/articles/how-to-compress-images-before-share-method",
    "title": "共有前に画像を圧縮する方法",
    "description": "HTMLプレビューを共有する前に画像を圧縮してファイルサイズを削減したいWeb制作者向け。ツール選定から実施手順まで、品質を落とさない圧縮方法を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-compress-images-before-share-steps-note",
    "path": "/articles/how-to-compress-images-before-share-steps-note",
    "title": "共有前に画像を圧縮するときの手順と注意点",
    "description": "HTMLプレビューを共有する前の画像圧縮作業を確実に進めたいデザイナー向け。圧縮の手順と見落としやすい注意点を具体的に解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-compress-images-before-share-checklist",
    "path": "/articles/how-to-compress-images-before-share-checklist",
    "title": "共有前に画像を圧縮するためのチェックリスト",
    "description": "共有前の画像圧縮作業を確実に終わらせたいデザイナー・Web担当者向け。圧縮から送付まで網羅したチェックリストで手順の抜け漏れを防ぎます。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-bundle-fonts-method",
    "path": "/articles/how-to-bundle-fonts-method",
    "title": "フォントを同梱して共有する方法",
    "description": "HTMLプレビューにフォントを同梱して、どの環境でも同じタイポグラフィで共有したいWeb制作者向け。フォントの埋め込み方法と注意点を解説します。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-bundle-fonts-steps-note",
    "path": "/articles/how-to-bundle-fonts-steps-note",
    "title": "フォントを同梱して共有するときの手順と注意点",
    "description": "フォント同梱共有を初めて行うデザイナーや担当者向けに、ライセンス確認・ファイル構成・表示検証の手順と失敗しやすいポイントを具体的にまとめた実践ガイド。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-bundle-fonts-checklist",
    "path": "/articles/how-to-bundle-fonts-checklist",
    "title": "フォントを同梱して共有するためのチェックリスト",
    "description": "フォント同梱HTMLを共有する前の点検に使えるチェックリスト。ライセンス確認からファイル名の文字種、PC・スマホでの表示確認、送付文面の要素まで工程別に整理した実務向け記事。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-internal-template-method",
    "path": "/articles/how-to-internal-template-method",
    "title": "社内のHTML共有テンプレを作る方法",
    "description": "HTML共有のたびに設定をゼロから組む手間をなくしたいチーム向けに、社内テンプレートの設計方針・必須項目・定着させる運用手順を具体的に説明する実務ガイド。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-internal-template-steps-note",
    "path": "/articles/how-to-internal-template-steps-note",
    "title": "社内のHTML共有テンプレを作るときの手順と注意点",
    "description": "社内HTML共有テンプレートの導入を検討しているチームリーダーや情シス担当向けに、設計から運用定着までの手順と、実際によく起きる失敗パターンを具体的に解説した記事。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-internal-template-checklist",
    "path": "/articles/how-to-internal-template-checklist",
    "title": "社内のHTML共有テンプレを作るためのチェックリスト",
    "description": "社内HTML共有テンプレートの設計・導入を担当する人が、各フェーズで確認すべき項目を一覧化したチェックリスト記事。設計の抜け漏れ防止と定着施策まで網羅。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-article-demo-limited-method",
    "path": "/articles/how-to-article-demo-limited-method",
    "title": "記事デモを限定公開する方法",
    "description": "記事デモを公開前に限定した関係者だけへ共有したいコンテンツ担当者やWebメディア編集者向けに、認証方式の選び方から共有手順・公開終了までを解説した実務向けガイド。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-article-demo-limited-steps-note",
    "path": "/articles/how-to-article-demo-limited-steps-note",
    "title": "記事デモを限定公開するときの手順と注意点",
    "description": "記事デモを限定公開する際の具体的な手順と、各ステップで陥りやすい注意点を解説。検索除外設定の方法・認証の選び方・修正差し替えのフローまでカバーした実務向け記事。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "how-to-article-demo-limited-checklist",
    "path": "/articles/how-to-article-demo-limited-checklist",
    "title": "記事デモを限定公開するためのチェックリスト",
    "description": "記事デモを限定公開するたびに使えるチェックリスト。準備・設定・配布・フィードバック回収・公開終了の各フェーズで確認すべき項目を実務ベースで整理した記事。",
    "category": "ハウツー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-pricing-revision",
    "path": "/articles/share-html-pricing-revision",
    "title": "料金改定案HTMLを共有する方法",
    "description": "料金改定案をHTMLで作成した担当者が、社内外の関係者に安全に共有するための認証方式選定・送付手順・期限管理を実務ベースで解説した記事。情報漏えいリスクへの対策も含む。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-pricing-revision-with-auth",
    "path": "/articles/review-html-pricing-revision-with-auth",
    "title": "料金改定案HTMLを認証付きでレビューに回す方法",
    "description": "料金改定案をHTMLで社内外の関係者にレビューしてもらう際の、レビュー相手の選定・認証方式の決め方・フィードバック回収・公開終了の流れを実務向けに解説した記事。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-campaign-calendar",
    "path": "/articles/share-html-campaign-calendar",
    "title": "キャンペーンカレンダーHTMLを共有する方法",
    "description": "キャンペーンカレンダーHTMLを社内外の関係者に安全に共有したいマーケティング担当者向けに、認証方式の選び方・表示確認の手順・差し替えと期限管理のポイントを解説した記事。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-campaign-calendar-with-auth",
    "path": "/articles/review-html-campaign-calendar-with-auth",
    "title": "キャンペーンカレンダーHTMLを認証付きでレビューに回す方法",
    "description": "キャンペーンカレンダーのHTMLを認証付きURLで社内外にレビュー依頼する際の、レビュア選定・認証方式・フィードバック回収・公開終了の具体的な手順を解説した記事。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-candidate-task",
    "path": "/articles/share-html-candidate-task",
    "title": "採用候補者向け課題HTMLを共有する方法",
    "description": "採用担当者・エンジニアリングマネージャー向けに、課題HTMLを候補者へ安全に共有する手順を解説。認証方式の選び方・送付文の書き方・差し替え運用まで判断できる。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-candidate-task-with-auth",
    "path": "/articles/review-html-candidate-task-with-auth",
    "title": "採用候補者向け課題HTMLを認証付きでレビューに回す方法",
    "description": "採用チームのエンジニア・HR担当向けに、候補者課題HTMLを認証付きで社内レビューに回す手順を説明。レビュワーの選定から公開終了まで一連の流れを把握できる。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-onboarding-checklist",
    "path": "/articles/share-html-onboarding-checklist",
    "title": "オンボーディングチェックリストHTMLを共有する方法",
    "description": "新入社員受け入れを担当するHRや総務向けに、オンボーディングチェックリストHTMLを安全・確実に共有する方法を解説。認証設定・送付・更新手順まで把握できる。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-onboarding-checklist-with-auth",
    "path": "/articles/review-html-onboarding-checklist-with-auth",
    "title": "オンボーディングチェックリストHTMLを認証付きでレビューに回す方法",
    "description": "HR・総務・現場管理職向けに、オンボーディングチェックリストHTMLを認証付きで社内レビューに回す具体的な手順を解説。レビュワー選定から公開終了まで対応できる。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-internal-portal-mock",
    "path": "/articles/share-html-internal-portal-mock",
    "title": "社内ポータル試作HTMLを共有する方法",
    "description": "社内ポータル試作HTMLを関係者に共有したい担当者向けに、セキュアなURL発行から閲覧認証・差し替え更新の手順まで解説。誰に何の権限で見せるかを判断できる。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-internal-portal-mock-with-auth",
    "path": "/articles/review-html-internal-portal-mock-with-auth",
    "title": "社内ポータル試作HTMLを認証付きでレビューに回す方法",
    "description": "情報システム・UI担当者・プロジェクトマネージャー向けに、社内ポータル試作HTMLを認証付きで社内外レビューに回す方法を説明。権限設計から公開終了処理まで対応できる。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-sales-script",
    "path": "/articles/share-html-sales-script",
    "title": "営業トークスクリプトHTMLを共有する方法",
    "description": "営業マネージャー・営業企画担当者向けに、トークスクリプトHTMLを安全に共有・更新する方法を解説。社内専用からパートナー向けまで認証方式の選び方も判断できる。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-sales-script-with-auth",
    "path": "/articles/review-html-sales-script-with-auth",
    "title": "営業トークスクリプトHTMLを認証付きでレビューに回す方法",
    "description": "営業企画・営業マネージャー向けに、トークスクリプトHTMLを認証付きで社内レビューに回す方法を解説。フィードバックを効率的に集めて本番展開するまでの流れを把握できる。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-comparison-table",
    "path": "/articles/share-html-comparison-table",
    "title": "比較表HTMLを共有する方法",
    "description": "提案資料や意思決定の根拠として比較表HTMLを共有したい営業・企画担当者向けに、URLの発行から認証設定・更新手順まで解説。社外共有と社内限定の使い分けも判断できる。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-comparison-table-with-auth",
    "path": "/articles/review-html-comparison-table-with-auth",
    "title": "比較表HTMLを認証付きでレビューに回す方法",
    "description": "企画・購買・経営企画担当者向けに、比較表HTMLを認証付きで社内レビューに回す方法を説明。レビュワーの選定から情報の公開終了処理まで一連の手順を把握できる。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-case-study-page",
    "path": "/articles/share-html-case-study-page",
    "title": "導入事例ページHTMLを共有する方法",
    "description": "マーケティング担当・営業企画向けに、本番公開前の導入事例ページHTMLを顧客や社内に安全に共有する手順を解説。認証方法の選び方・送付・更新・公開終了の判断ができる。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-case-study-page-with-auth",
    "path": "/articles/review-html-case-study-page-with-auth",
    "title": "導入事例ページHTMLを認証付きでレビューに回す方法",
    "description": "マーケティング・広報担当者向けに、導入事例ページHTMLを認証付きで社内外レビューに回す手順を解説。社内承認フローから顧客確認、公開終了後の処理まで判断できる。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-whitepaper-lp",
    "path": "/articles/share-html-whitepaper-lp",
    "title": "ホワイトペーパーLPHTMLを共有する方法",
    "description": "ホワイトペーパーLPのHTMLを社内外に共有したいマーケターや制作担当者が、認証方式の選び方・送付方法・期限管理のポイントを一通り把握できる実務ガイドです。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-whitepaper-lp-with-auth",
    "path": "/articles/review-html-whitepaper-lp-with-auth",
    "title": "ホワイトペーパーLPHTMLを認証付きでレビューに回す方法",
    "description": "ホワイトペーパーLPのHTMLレビューを認証付きで進めたい担当者向けに、レビュア―の選定・認証方式・フィードバック回収・公開終了までの一連の流れを解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-webinar-page",
    "path": "/articles/share-html-webinar-page",
    "title": "ウェビナー案内HTMLを共有する方法",
    "description": "ウェビナー案内ページのHTMLを社内外に共有したい担当者が、共有前チェック・適切な認証方式・送付方法・期限管理を一度に理解できる実践ガイドです。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-webinar-page-with-auth",
    "path": "/articles/review-html-webinar-page-with-auth",
    "title": "ウェビナー案内HTMLを認証付きでレビューに回す方法",
    "description": "登壇者・共催企業・社内広報が同時にチェックするウェビナーページのレビューを、誰に何を送るか迷わず回せる認証付き共有フローを設計するための手順ガイド。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-expo-booth-guide",
    "path": "/articles/share-html-expo-booth-guide",
    "title": "展示会ブース案内HTMLを共有する方法",
    "description": "展示会のブース案内HTMLを関係者に共有したいマーケター・イベント担当者が、共有前の確認事項・認証方式の選択・送付方法・期限管理を一通り把握できる実践ガイドです。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-expo-booth-guide-with-auth",
    "path": "/articles/review-html-expo-booth-guide-with-auth",
    "title": "展示会ブース案内HTMLを認証付きでレビューに回す方法",
    "description": "出展チームと外部制作会社が混在する展示会準備で、ブース案内HTMLを誰にどう共有すべか整理したい担当者向け。認証付きレビューフローの設計手順を解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-chat-faq-page",
    "path": "/articles/share-html-chat-faq-page",
    "title": "FAQチャット風ページHTMLを共有する方法",
    "description": "FAQチャット風ページのHTMLを社内外のレビュアーに安全に共有したい担当者向けに、共有前の動作確認・認証方式の選び方・送付方法・期限管理の実践的な手順を説明します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-chat-faq-page-with-auth",
    "path": "/articles/review-html-chat-faq-page-with-auth",
    "title": "FAQチャット風ページHTMLを認証付きでレビューに回す方法",
    "description": "CSチームとデザイナーが別の観点でチェックするFAQページのレビューを、役割ごとの認証方式とフィードバック回収をセットで設計するための実践ガイド。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-diagnosis-result",
    "path": "/articles/share-html-diagnosis-result",
    "title": "診断結果ページHTMLを共有する方法",
    "description": "診断結果ページのHTMLを関係者に安全に共有したい担当者向けに、共有前の確認事項・適切な認証方式の選択・送付方法・期限管理の具体的な手順をまとめています。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-diagnosis-result-with-auth",
    "path": "/articles/review-html-diagnosis-result-with-auth",
    "title": "診断結果ページHTMLを認証付きでレビューに回す方法",
    "description": "専門家・エンジニア・マーケターが同時に関わる診断ページのレビューを、役割ごとに認証と確認観点を分けて混乱なく回すための設計手順を紹介する記事。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-quote-simulator",
    "path": "/articles/share-html-quote-simulator",
    "title": "見積シミュレーターHTMLを共有する方法",
    "description": "見積シミュレーターHTMLを社内の営業チームや外部関係者に共有したい担当者向けに、共有前の動作確認・認証方式の選択・送付時の注意点・期限管理を実践的に説明します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-quote-simulator-with-auth",
    "path": "/articles/review-html-quote-simulator-with-auth",
    "title": "見積シミュレーターHTMLを認証付きでレビューに回す方法",
    "description": "計算ロジックの検証と商談での使い勝手の確認を同時に進める見積シミュレーターのレビューを、担当者別の認証設計でスムーズに回すための手順をまとめた記事。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-roi-calculator",
    "path": "/articles/share-html-roi-calculator",
    "title": "ROI計算機HTMLを共有する方法",
    "description": "ROI計算機HTMLを社外・社内に共有する前に確認すべき注意点と、パスワード認証・メール認証・会社ドメイン認証の使い分け方を解説。送り方と差し替え手順も網羅。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-roi-calculator-with-auth",
    "path": "/articles/review-html-roi-calculator-with-auth",
    "title": "ROI計算機HTMLを認証付きでレビューに回す方法",
    "description": "ROI計算機HTMLを社内外のレビュアーに安全に配布したい担当者向け。レビュー相手の選定から認証方式の決め方、フィードバック収集のコツ、公開終了の処理まで一連の手順を説明する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-roadmap",
    "path": "/articles/share-html-roadmap",
    "title": "ロードマップHTMLを共有する方法",
    "description": "ロードマップHTMLを投資家・顧客・社内メンバーに共有する前に押さえるべき情報漏洩リスクと確認手順、認証方式の選び方、送付後の更新・期限管理の実践手順を解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-roadmap-with-auth",
    "path": "/articles/review-html-roadmap-with-auth",
    "title": "ロードマップHTMLを認証付きでレビューに回す方法",
    "description": "ロードマップHTMLのレビュー依頼をスムーズに進めたいPM・事業企画担当向け。レビュアーの選定から認証方式の決め方、フィードバックの収集と整理方法、公開終了後の処理まで一貫して解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-release-notes",
    "path": "/articles/share-html-release-notes",
    "title": "リリースノートHTMLを共有する方法",
    "description": "リリースノートHTMLを開発チーム・カスタマー・外部ユーザーに共有する前の確認手順と、読者層別の認証方式の選び方、送付方法および更新管理の実践的な方法を解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-release-notes-with-auth",
    "path": "/articles/review-html-release-notes-with-auth",
    "title": "リリースノートHTMLを認証付きでレビューに回す方法",
    "description": "リリースノートHTMLのドラフトを開発チームや広報・法務にレビューしてもらいたい担当者向け。レビュアーの選定基準、認証方式の選択、フィードバック収集の効率化、公開停止の手順を体系的に説明する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-status-page",
    "path": "/articles/share-html-status-page",
    "title": "ステータスページHTMLを共有する方法",
    "description": "ステータスページHTMLを社内外に共有する際の確認ポイントと認証方式の選択肢を整理。インシデント発生時の迅速な共有手順と、ページ更新・公開終了の管理方法も合わせて解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-status-page-with-auth",
    "path": "/articles/review-html-status-page-with-auth",
    "title": "ステータスページHTMLを認証付きでレビューに回す方法",
    "description": "ステータスページHTMLのプレビューを社内チームや顧客サクセスにレビューしてもらいたい担当者向け。レビュアー選定から認証設定、フィードバック収集の効率化、プレビュー公開停止の手順を説明する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-nda-explainer",
    "path": "/articles/share-html-nda-explainer",
    "title": "NDA説明ページHTMLを共有する方法",
    "description": "NDA説明ページHTMLを契約相手や社内法務に共有する前の確認手順と、機密性を保ちながら閲覧してもらうための認証方式の選び方、更新・期限管理の実務的な進め方を解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-nda-explainer-with-auth",
    "path": "/articles/review-html-nda-explainer-with-auth",
    "title": "NDA説明ページHTMLを認証付きでレビューに回す方法",
    "description": "NDA説明ページHTMLを法務・営業・相手方にレビューしてもらうプロセスを設計したい担当者向け。レビュアーの選定、認証方式の選択、フィードバック収集の注意点、公開終了後の対処方法を体系的に解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-terms-revision",
    "path": "/articles/share-html-terms-revision",
    "title": "利用規約改定案HTMLを共有する方法",
    "description": "利用規約改定案のHTMLを法務・経営・ユーザー代表に共有する前の確認手順と、確定前に外部流出しないための認証方式の選び方、更新と期限管理の実務手順を解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-terms-revision-with-auth",
    "path": "/articles/review-html-terms-revision-with-auth",
    "title": "利用規約改定案HTMLを認証付きでレビューに回す方法",
    "description": "利用規約改定案HTMLのレビューを法務・経営・ユーザー代表に依頼したい担当者向け。レビュアーの役割設計から認証方式の選択、フィードバック収集の実務、公開終了処理の手順を解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-contract-renewal",
    "path": "/articles/share-html-contract-renewal",
    "title": "契約更新案内HTMLを共有する方法",
    "description": "契約更新案内のHTMLを取引先へ共有したい担当者向け。送付前の確認事項から認証方式の選択・期限管理まで、情報漏洩を防ぎながら効率よく共有するための手順を具体的に解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-contract-renewal-with-auth",
    "path": "/articles/review-html-contract-renewal-with-auth",
    "title": "契約更新案内HTMLを認証付きでレビューに回す方法",
    "description": "契約更新案内HTMLの社内レビューや法務確認を効率化したい担当者向け。レビュー相手の選定から認証方式・フィードバック回収・公開終了処理まで、情報を安全に管理しながら滞りなく回すための具体手順をまとめた。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-training-test",
    "path": "/articles/share-html-training-test",
    "title": "研修テストHTMLを共有する方法",
    "description": "研修テストのHTMLを受講者に配布したい研修担当者向け。事前確認から認証設定・受講者への案内方法・テスト終了後の期限管理まで、セキュリティに配慮した配布フローを具体的に解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-training-test-with-auth",
    "path": "/articles/review-html-training-test-with-auth",
    "title": "研修テストHTMLを認証付きでレビューに回す方法",
    "description": "研修テストHTMLのリリース前レビューを効率よく回したい人事・研修担当者向け。レビュー依頼先の選定から認証設定・フィードバック管理・レビュー終了後の処理まで、版の錯綜を防ぐ具体的な手順を解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-recruiting-pitch",
    "path": "/articles/share-html-recruiting-pitch",
    "title": "採用ピッチデックHTMLを共有する方法",
    "description": "採用ピッチデックのHTMLを候補者や採用エージェントに安全に届けたい採用担当者向け。共有前の確認事項・適切な認証方式の選択・送付方法・資料更新時の管理手順を具体的に解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-recruiting-pitch-with-auth",
    "path": "/articles/review-html-recruiting-pitch-with-auth",
    "title": "採用ピッチデックHTMLを認証付きでレビューに回す方法",
    "description": "採用ピッチデックHTMLの社内レビューを効率よく進めたい人事担当者向け。レビュアーの選定から認証方式・フィードバック回収・公開終了後の処理まで、情報漏洩リスクを下げながらレビュープロセスを管理する手順をまとめた。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-store-pop",
    "path": "/articles/share-html-store-pop",
    "title": "店舗POPHTMLを共有する方法",
    "description": "店舗POPのHTMLを各店舗スタッフや印刷会社に安全に届けたい販促担当者向け。公開前の確認事項から認証設定・店舗への案内方法・キャンペーン終了後の期限管理まで、運用しやすい共有フローを解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-store-pop-with-auth",
    "path": "/articles/review-html-store-pop-with-auth",
    "title": "店舗POPHTMLを認証付きでレビューに回す方法",
    "description": "店舗POP用HTMLを印刷・量産前にレビューしたい販促担当者向け。レビュアーの選定から認証設定・フィードバックの集め方・レビュー終了後のURL管理まで、差し戻しコストを最小化する具体的な手順を解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-menu-revision",
    "path": "/articles/share-html-menu-revision",
    "title": "メニュー改定案HTMLを共有する方法",
    "description": "メニュー改定案のHTMLを関係者に安全に共有したい飲食店の担当者向け。公開前の確認から認証設定・各関係者への送付方法・改定決定後の期限管理まで、情報漏洩を防ぎながら効率よく共有する手順をまとめた。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-menu-revision-with-auth",
    "path": "/articles/review-html-menu-revision-with-auth",
    "title": "メニュー改定案HTMLを認証付きでレビューに回す方法",
    "description": "メニュー改定案HTMLを本部・店舗・シェフにレビューさせたい飲食チェーン担当者向け。レビュアーの選定から認証方式・フィードバック収集・レビュー終了後の処理まで、段階的な承認フローを整理する具体的な手順を解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-property-tour",
    "path": "/articles/share-html-property-tour",
    "title": "物件内覧ページHTMLを共有する方法",
    "description": "物件内覧ページのHTMLを内見希望者や不動産会社に安全に共有したい不動産担当者向け。公開前の確認事項から認証方式の選択・先方への送付方法・成約後の期限管理まで、物件情報の漏洩を防ぐ具体的な手順を解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-property-tour-with-auth",
    "path": "/articles/review-html-property-tour-with-auth",
    "title": "物件内覧ページHTMLを認証付きでレビューに回す方法",
    "description": "物件内覧ページのHTMLを社内や不動産会社でレビューしたい担当者向け。レビュー対象者の選定から認証設定・フィードバック収集・レビュー終了後の処理まで、物件情報の管理を徹底しながら効率よくレビューを進める手順を解説する。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-travel-itinerary",
    "path": "/articles/share-html-travel-itinerary",
    "title": "ツアー旅程表HTMLを共有する方法",
    "description": "旅行代理店や添乗担当者向けに、ツアー旅程表HTMLを安全・手軽に共有する手順を解説。認証方式の選び方から送付文面の作り方、期限管理まで実務に即して説明します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-travel-itinerary-with-auth",
    "path": "/articles/review-html-travel-itinerary-with-auth",
    "title": "ツアー旅程表HTMLを認証付きでレビューに回す方法",
    "description": "旅程表HTMLを社内外の関係者にレビューしてもらうとき、適切な認証方式と回し方を選ぶことで確認漏れやバージョン混乱を防げます。本記事では相手の属性別に最適な手順を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-event-timetable",
    "path": "/articles/share-html-event-timetable",
    "title": "イベントタイムテーブルHTMLを共有する方法",
    "description": "イベント担当者や運営スタッフが、タイムテーブルHTMLを参加者・登壇者・協賛社など相手別に安全かつ素早く共有するための手順と注意点をまとめました。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-event-timetable-with-auth",
    "path": "/articles/review-html-event-timetable-with-auth",
    "title": "イベントタイムテーブルHTMLを認証付きでレビューに回す方法",
    "description": "カンファレンスや社内イベントの運営担当者向けに、タイムテーブルHTMLを登壇者・協賛社・社内スタッフへ認証付きでレビュー依頼する具体的な手順を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-speaker-profile",
    "path": "/articles/share-html-speaker-profile",
    "title": "講演者プロフィールHTMLを共有する方法",
    "description": "イベント運営担当者が講演者プロフィールHTMLを本人や社内スタッフへ安全に届けるための共有手順を解説。誤情報の修正対応や公開期限の管理まで実務に沿って説明します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-speaker-profile-with-auth",
    "path": "/articles/review-html-speaker-profile-with-auth",
    "title": "講演者プロフィールHTMLを認証付きでレビューに回す方法",
    "description": "イベント運営担当者が講演者プロフィールHTMLを本人・社内関係者へ認証付きで回す際の、相手選定から公開終了処理までを一気通貫で説明します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-sponsor-material",
    "path": "/articles/share-html-sponsor-material",
    "title": "スポンサー資料HTMLを共有する方法",
    "description": "スポンサー獲得や協賛社へのクロスセルを担当するマーケター向けに、スポンサー資料HTMLを安全に共有する手順と認証方式の選び方を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-sponsor-material-with-auth",
    "path": "/articles/review-html-sponsor-material-with-auth",
    "title": "スポンサー資料HTMLを認証付きでレビューに回す方法",
    "description": "スポンサー営業担当者が協賛資料HTMLを法務・営業・経営層へ認証付きでレビューに回す手順と、フィードバックを効率的に集約して対外送付まで完結する方法を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-interactive-history",
    "path": "/articles/share-html-interactive-history",
    "title": "インタラクティブ年表HTMLを共有する方法",
    "description": "教育・博物館・企業広報の担当者向けに、インタラクティブな年表HTMLを閲覧者や社内関係者へ安全に公開・共有するための手順と認証設定を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-interactive-history-with-auth",
    "path": "/articles/review-html-interactive-history-with-auth",
    "title": "インタラクティブ年表HTMLを認証付きでレビューに回す方法",
    "description": "インタラクティブ年表HTMLの制作担当者が、監修者・社内関係者・外部専門家へ認証付きでレビューを依頼し、フィードバックを確実に回収する手順をまとめました。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-survey-result",
    "path": "/articles/share-html-survey-result",
    "title": "社内アンケート結果HTMLを共有する方法",
    "description": "人事・総務・経営企画の担当者向けに、社内アンケート結果HTMLを適切な範囲で安全に共有するための手順と認証方式を解説。個人情報保護の観点も含めて説明します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-survey-result-with-auth",
    "path": "/articles/review-html-survey-result-with-auth",
    "title": "社内アンケート結果HTMLを認証付きでレビューに回す方法",
    "description": "人事・経営企画担当者が社内アンケート結果HTMLを経営陣・管理職へ認証付きでレビュー依頼する手順と、個人情報保護に配慮した確認フロー設計を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-customer-interview",
    "path": "/articles/share-html-customer-interview",
    "title": "顧客インタビュー記事HTMLを共有する方法",
    "description": "顧客インタビュー記事のHTMLを社外関係者にレビューしてもらいたい担当者向けに、共有前の確認事項から認証方式の選択・送付方法・期限管理までを具体的に解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-customer-interview-with-auth",
    "path": "/articles/review-html-customer-interview-with-auth",
    "title": "顧客インタビュー記事HTMLを認証付きでレビューに回す方法",
    "description": "社外の顧客や社内編集チームに顧客インタビュー記事HTMLを認証付きでレビューに回したいディレクター向けに、相手の選定から認証設定・フィードバック収集・公開終了処理までの手順を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-app-demo",
    "path": "/articles/share-html-app-demo",
    "title": "アプリ操作デモHTMLを共有する方法",
    "description": "アプリ操作デモのHTMLを営業先や社外エンジニアに共有したい担当者向けに、共有前チェック・認証方式の選定・送付方法・バージョン管理の具体的な進め方を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-app-demo-with-auth",
    "path": "/articles/review-html-app-demo-with-auth",
    "title": "アプリ操作デモHTMLを認証付きでレビューに回す方法",
    "description": "アプリ操作デモHTMLを認証付きで社内外の関係者にレビューに回したい開発者・ディレクター向けに、レビュー相手の選定から認証設定・フィードバック収集・公開終了まで手順を詳解します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "share-html-brand-guideline",
    "path": "/articles/share-html-brand-guideline",
    "title": "ブランドガイドラインHTMLを共有する方法",
    "description": "HTMLで制作したブランドガイドラインを外部のデザイン会社やパートナーに安全に共有したい担当者向けに、共有前の確認事項から認証方式・送付方法・改版管理の実務手順を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "review-html-brand-guideline-with-auth",
    "path": "/articles/review-html-brand-guideline-with-auth",
    "title": "ブランドガイドラインHTMLを認証付きでレビューに回す方法",
    "description": "HTMLで制作したブランドガイドラインを認証付きで社内外のレビュアーに回したい担当者向けに、レビュー相手の選定から認証設定・フィードバック回収・公開終了処理の手順を解説します。",
    "category": "コンテンツ別",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-new-client",
    "path": "/articles/auth-method-for-new-client",
    "title": "初回取引のクライアントにHTMLを見せるときの認証方式の選び方",
    "description": "初回取引のクライアントにHTMLを共有する際の認証方式の選び方を、URL共有・パスワード・メール認証・会社ドメイン認証の特徴と向き不向きから実務的に解説します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-new-client",
    "path": "/articles/safe-expiring-url-for-new-client",
    "title": "初回取引のクライアント向け共有URLを期限付きで安全に渡す方法",
    "description": "初回取引のクライアントに渡すHTMLの共有URLについて、公開期限の設定基準・認証との組み合わせ・期限後の扱い・再共有時の注意点を実務ベースで解説します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-existing-client",
    "path": "/articles/auth-method-for-existing-client",
    "title": "既存顧客にHTMLを見せるときの認証方式の選び方",
    "description": "継続取引中の既存顧客にHTMLを共有する場面での認証方式の選び方を、URL共有・パスワード・メール認証・会社ドメイン認証の特徴と既存顧客固有の考慮点から解説します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-existing-client",
    "path": "/articles/safe-expiring-url-for-existing-client",
    "title": "既存顧客向け共有URLを期限付きで安全に渡す方法",
    "description": "継続取引中の既存顧客に渡すHTMLの共有URLについて、期限設定の基準・認証との組み合わせ方・期限後の管理・再共有時の注意事項を実務的に解説します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-partner-agency",
    "path": "/articles/auth-method-for-partner-agency",
    "title": "外部パートナー会社にHTMLを見せるときの認証方式の選び方",
    "description": "外部パートナー会社や協力会社にHTMLを共有する際の認証方式の選び方を、URL共有・パスワード・メール認証・会社ドメイン認証のそれぞれの特徴とパートナー関係固有の注意点から解説します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-partner-agency",
    "path": "/articles/safe-expiring-url-for-partner-agency",
    "title": "外部パートナー会社向け共有URLを期限付きで安全に渡す方法",
    "description": "外部パートナー会社に渡すHTMLの共有URLについて、期限設定の考え方・認証との組み合わせ・期限後の扱い・再共有時にパートナー関係で注意すべき点を実務的に解説します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-freelancer",
    "path": "/articles/auth-method-for-freelancer",
    "title": "業務委託メンバーにHTMLを見せるときの認証方式の選び方",
    "description": "フリーランスや業務委託メンバーに静的HTMLを共有する担当者向けに、URLのみ・パスワード・メール認証・ドメイン制限の4方式を機密度と操作負荷の観点から比較し、選択基準を解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-freelancer",
    "path": "/articles/safe-expiring-url-for-freelancer",
    "title": "業務委託メンバー向け共有URLを期限付きで安全に渡す方法",
    "description": "フリーランス・業務委託メンバーへのHTML共有を安全に行いたい担当者向けに、公開期限の設定基準・認証との組み合わせ方・期限後の対応手順を具体的に解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-investor",
    "path": "/articles/auth-method-for-investor",
    "title": "投資家候補にHTMLを見せるときの認証方式の選び方",
    "description": "VCや個人投資家候補に非公開の製品情報やピッチ資料をHTML形式で見せたい担当者向けに、URLのみ・パスワード・メール認証・ドメイン制限の特徴と選び方を解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-investor",
    "path": "/articles/safe-expiring-url-for-investor",
    "title": "投資家候補向け共有URLを期限付きで安全に渡す方法",
    "description": "VCや個人投資家候補に製品デモや財務情報のHTMLを渡す担当者向けに、公開期限の設定基準・認証との組み合わせ・期限後の削除フロー・再共有時の注意点を解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-candidate",
    "path": "/articles/auth-method-for-candidate",
    "title": "採用候補者にHTMLを見せるときの認証方式の選び方",
    "description": "採用候補者に企業紹介・選考フロー・内定後オンボーディング資料のHTMLを共有したい人事・採用担当者向けに、4つの認証方式の違いと選び方をわかりやすく解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-candidate",
    "path": "/articles/safe-expiring-url-for-candidate",
    "title": "採用候補者向け共有URLを期限付きで安全に渡す方法",
    "description": "人事・採用担当者向けに、採用候補者へ共有するHTMLプレビューURLの公開期限の設定方法、認証との組み合わせ方、選考終了後の扱い方を具体的に解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-student",
    "path": "/articles/auth-method-for-student",
    "title": "受講者・学生にHTMLを見せるときの認証方式の選び方",
    "description": "教育機関やオンラインスクールの担当者向けに、受講者・学生への講義資料や課題HTMLの共有に適した認証方式（URLのみ・パスワード・メール・ドメイン制限）の違いと選び方を解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-student",
    "path": "/articles/safe-expiring-url-for-student",
    "title": "受講者・学生向け共有URLを期限付きで安全に渡す方法",
    "description": "教育機関やオンラインスクールの担当者向けに、受講者・学生に共有するHTML資料の公開期限の設定基準・認証との組み合わせ・修了後の削除フロー・再共有時の注意点を解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-press",
    "path": "/articles/auth-method-for-press",
    "title": "取材メディアにHTMLを見せるときの認証方式の選び方",
    "description": "PR担当者・広報チーム向けに、取材メディアへのHTML資料共有で使えるURLのみ・パスワード・メール認証・ドメイン制限の4方式を、エンバーゴ管理と情報漏洩防止の観点から比較・解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-press",
    "path": "/articles/safe-expiring-url-for-press",
    "title": "取材メディア向け共有URLを期限付きで安全に渡す方法",
    "description": "PR・広報担当者向けに、取材メディアへの事前共有HTMLの公開期限設定・認証との組み合わせ・エンバーゴ後の削除・再共有時の注意点を実務的に解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-vendor",
    "path": "/articles/auth-method-for-vendor",
    "title": "外注先・ベンダーにHTMLを見せるときの認証方式の選び方",
    "description": "Web制作会社・システム会社などのベンダーや外注先とHTMLの確認・レビューを行いたい担当者向けに、URLのみ・パスワード・メール認証・ドメイン制限の4方式を実務視点から比較・解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-vendor",
    "path": "/articles/safe-expiring-url-for-vendor",
    "title": "外注先・ベンダー向け共有URLを期限付きで安全に渡す方法",
    "description": "外注先・ベンダーとのHTML確認業務を担う発注側担当者向けに、共有URLの公開期限の設定基準・認証との組み合わせ・プロジェクト終了後の削除手順・バージョン管理上の注意点を解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-board-member",
    "path": "/articles/auth-method-for-board-member",
    "title": "役員・顧問にHTMLを見せるときの認証方式の選び方",
    "description": "役員や顧問へHTMLを安全に見せたいWeb担当者・制作担当者向けに、URLのみ・パスワード・メール認証・ドメイン認証を比較し、状況に応じた最適な認証方式を選べるよう解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-board-member",
    "path": "/articles/safe-expiring-url-for-board-member",
    "title": "役員・顧問向け共有URLを期限付きで安全に渡す方法",
    "description": "役員・顧問向けに期限付きURLでHTMLを安全に共有したい担当者が、公開期間の設定基準・認証の組み合わせ方・期限切れ後の対応まで一貫して判断できるよう解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-temporary-staff",
    "path": "/articles/auth-method-for-temporary-staff",
    "title": "短期スタッフにHTMLを見せるときの認証方式の選び方",
    "description": "派遣・アルバイト・業務委託などの短期スタッフにHTMLを安全に見せたい担当者が、認証なしURL・パスワード・メール認証・ドメイン認証の違いを把握し、雇用形態や機密度に合った方式を選べるよう解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-temporary-staff",
    "path": "/articles/safe-expiring-url-for-temporary-staff",
    "title": "短期スタッフ向け共有URLを期限付きで安全に渡す方法",
    "description": "派遣・アルバイト・業務委託など短期スタッフへの期限付きURL共有を検討している担当者が、公開期間の決め方・認証との組み合わせ・期限後の運用を一貫して把握できるよう解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-alumni",
    "path": "/articles/auth-method-for-alumni",
    "title": "退職者を含む関係者にHTMLを見せるときの認証方式の選び方",
    "description": "退職者や元取引先を含む関係者にHTMLを安全に共有したい担当者向けに、URLのみ・パスワード・メール認証・ドメイン認証の特性を比較し、組織外の関係者にも使える認証方式を選べるよう解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-alumni",
    "path": "/articles/safe-expiring-url-for-alumni",
    "title": "退職者を含む関係者向け共有URLを期限付きで安全に渡す方法",
    "description": "退職者を含む関係者への期限付きHTML共有を検討している担当者が、公開期間の設定基準・認証の組み合わせ・失効後の対応・再共有時の注意を一貫して理解できるよう解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-multiple-companies",
    "path": "/articles/auth-method-for-multiple-companies",
    "title": "複数社合同プロジェクトにHTMLを見せるときの認証方式の選び方",
    "description": "複数の企業が関わる合同プロジェクトでHTMLを安全に共有したい担当者が、パスワード・メール認証・ドメイン認証の特性と限界を理解し、混在する参加者への最適な認証方式を選べるよう解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-multiple-companies",
    "path": "/articles/safe-expiring-url-for-multiple-companies",
    "title": "複数社合同プロジェクト向け共有URLを期限付きで安全に渡す方法",
    "description": "複数社合同プロジェクトで期限付きURLによるHTML共有を検討している幹事社担当者が、公開期間の決め方・認証の組み合わせ・失効後の対応・再共有の注意点を一貫して把握できるよう解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-agency-client",
    "path": "/articles/auth-method-for-agency-client",
    "title": "制作会社とクライアントにHTMLを見せるときの認証方式の選び方",
    "description": "制作会社担当者が、クライアントへのHTML共有にどの認証方式を使えばよいか迷っている状況向けに、URLのみ・パスワード・メール認証・ドメイン認証を比較し、プロジェクト規模や機密度に応じた選択方法を解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-agency-client",
    "path": "/articles/safe-expiring-url-for-agency-client",
    "title": "制作会社とクライアント向け共有URLを期限付きで安全に渡す方法",
    "description": "Web制作会社がクライアントへのHTML共有に期限付きURLを活用したいと考えている担当者が、期限の決め方・認証との組み合わせ・失効後の対応・再共有の注意点を実務ベースで把握できる記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-training-class",
    "path": "/articles/auth-method-for-training-class",
    "title": "研修受講者グループにHTMLを見せるときの認証方式の選び方",
    "description": "社内外の研修受講者グループにHTMLを安全に配布したい研修担当者・講師が、URLのみ・パスワード・メール認証・ドメイン認証の特性を比較し、受講者規模や機密度に合った認証方式を選べるよう解説する記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-training-class",
    "path": "/articles/safe-expiring-url-for-training-class",
    "title": "研修受講者グループ向け共有URLを期限付きで安全に渡す方法",
    "description": "社内外の研修受講者グループへ期限付きURLで教材を安全に配布したい研修担当者が、公開期間の決め方・認証の組み合わせ・失効後の対応・再共有の注意点を実務ベースで理解できる記事。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-sales-prospect",
    "path": "/articles/auth-method-for-sales-prospect",
    "title": "商談中の見込み客にHTMLを見せるときの認証方式の選び方",
    "description": "商談中の見込み客にHTMLを見せたいデザイナーや営業担当者向け。相手のITリテラシーや情報感度に応じた認証方式の選び方と、共有前に確認すべき注意点をまとめました。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-sales-prospect",
    "path": "/articles/safe-expiring-url-for-sales-prospect",
    "title": "商談中の見込み客向け共有URLを期限付きで安全に渡す方法",
    "description": "商談中の見込み客へのHTML共有URLに期限を設けたい担当者向け。いつ失効させるべきか・認証との組み合わせ方・再共有時の注意点を、営業フローに沿って具体的に解説します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-support-customer",
    "path": "/articles/auth-method-for-support-customer",
    "title": "サポート対象顧客にHTMLを見せるときの認証方式の選び方",
    "description": "サポート対応中の顧客にHTMLを安全に共有したいCS担当者向け。顧客のITリテラシーや契約状況に応じた認証方式の比較と、誤送信・情報漏えいを防ぐ事前確認事項をまとめています。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-support-customer",
    "path": "/articles/safe-expiring-url-for-support-customer",
    "title": "サポート対象顧客向け共有URLを期限付きで安全に渡す方法",
    "description": "サポート対象顧客へのHTML共有に期限を設けて情報を管理したいCS・テクニカルサポート担当者向け。期限の設定基準・認証との組み合わせ・期限後の案内方法を具体例で説明します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-nda-recipient",
    "path": "/articles/auth-method-for-nda-recipient",
    "title": "NDA締結前後の相手にHTMLを見せるときの認証方式の選び方",
    "description": "NDA締結前後の相手にHTMLを安全に共有したい法務・事業担当者向け。開示範囲の証跡を残しながらアクセス制御を実現するための認証方式の比較と注意点を具体的に整理しています。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-nda-recipient",
    "path": "/articles/safe-expiring-url-for-nda-recipient",
    "title": "NDA締結前後の相手向け共有URLを期限付きで安全に渡す方法",
    "description": "NDA締結前後の相手にHTML資料を期限付きで共有したい法務・事業開発担当者向け。情報開示の証跡を残しながら期限を管理するための設定手順と、再共有時の法的観点からの注意点を解説します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-public-beta",
    "path": "/articles/auth-method-for-public-beta",
    "title": "限定βテスターにHTMLを見せるときの認証方式の選び方",
    "description": "限定βテスターにHTMLプレビューを共有したいプロダクトマネージャー・開発者向け。テスターの登録状況やリテラシーに応じた認証方式の選択肢と、情報漏えいを防ぎながら参加者体験を保つ方法を整理しています。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-public-beta",
    "path": "/articles/safe-expiring-url-for-public-beta",
    "title": "限定βテスター向け共有URLを期限付きで安全に渡す方法",
    "description": "限定βテスター向けのHTML共有URLに期限を設けて管理したいプロダクトマネージャー向け。テストフェーズに合わせた期限設定の考え方・認証との組み合わせ・テスター向けのURLライフサイクル案内方法を説明します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "auth-method-for-community-members",
    "path": "/articles/auth-method-for-community-members",
    "title": "コミュニティ参加者にHTMLを見せるときの認証方式の選び方",
    "description": "コミュニティ参加者限定のHTMLコンテンツを共有したいコミュニティ運営者向け。会員種別や参加規模に応じた認証方式の選択肢と、参加者へのスムーズなアクセス案内方法を具体的に解説しています。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "safe-expiring-url-for-community-members",
    "path": "/articles/safe-expiring-url-for-community-members",
    "title": "コミュニティ参加者向け共有URLを期限付きで安全に渡す方法",
    "description": "コミュニティ参加者向けのHTML共有に期限管理を導入したいコミュニティ運営者向け。発行サイクルに合わせた期限設定・退会者管理との連携・期限後に参加者が混乱しないための案内方法を説明します。",
    "category": "認証共有",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "prepare-html-url-for-legal-review",
    "path": "/articles/prepare-html-url-for-legal-review",
    "title": "法務レビュー用にHTML共有URLを準備する方法",
    "description": "法務部門にHTMLをレビューしてもらいたいWeb担当者・マーケター向け。法務担当者が確認しやすいURL共有の準備手順・観点の案内方法・認証と期限の設定例を具体的に説明しています。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "legal-review-html-share-checklist",
    "path": "/articles/legal-review-html-share-checklist",
    "title": "法務レビューで指摘漏れを減らすHTML共有チェックリスト",
    "description": "法務レビューでのHTML共有における確認漏れを防ぎたいWeb担当者・ディレクター向け。事前準備から確認観点・NG例・修正後再共有の手順まで、実務で使えるチェックリストを段階的に解説しています。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "prepare-html-url-for-security-review",
    "path": "/articles/prepare-html-url-for-security-review",
    "title": "セキュリティレビュー用にHTML共有URLを準備する方法",
    "description": "セキュリティ担当者にHTMLプレビューURLを渡す前に確認すべき情報整理・認証設定・期限管理の手順をまとめた記事。どの認証方式を選ぶべきか判断できます。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "security-review-html-share-checklist",
    "path": "/articles/security-review-html-share-checklist",
    "title": "セキュリティレビューで指摘漏れを減らすHTML共有チェックリスト",
    "description": "セキュリティレビューでよくある指摘漏れを防ぐためのHTML共有前チェックリスト。外部スクリプト・APIキー流出・認証設定の誤りを事前に潰す観点を具体的に解説します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "prepare-html-url-for-brand-review",
    "path": "/articles/prepare-html-url-for-brand-review",
    "title": "ブランドレビュー用にHTML共有URLを準備する方法",
    "description": "広報・デザイン担当者へのブランドレビュー依頼に適したHTML共有URLの準備手順を解説。認証方式の選び方や期限設定の考え方を知りたい方に向けた実践的な内容です。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "brand-review-html-share-checklist",
    "path": "/articles/brand-review-html-share-checklist",
    "title": "ブランドレビューで指摘漏れを減らすHTML共有チェックリスト",
    "description": "ブランドレビューで頻発する指摘漏れを防ぐためのHTML共有前チェックリスト。カラー・フォント・ロゴの整合性確認から認証・修正後の再共有手順まで、デザイナーや広報担当者が実践できる内容です。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "prepare-html-url-for-sales-review",
    "path": "/articles/prepare-html-url-for-sales-review",
    "title": "営業レビュー用にHTML共有URLを準備する方法",
    "description": "営業チームへのHTMLプレビュー共有を効率化したい制作担当者向けの記事。URLを渡す前に確認すべき情報整理・適切な認証の選び方・指摘回収の方法を実践的に解説します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "sales-review-html-share-checklist",
    "path": "/articles/sales-review-html-share-checklist",
    "title": "営業レビューで指摘漏れを減らすHTML共有チェックリスト",
    "description": "営業レビューで頻出する指摘を事前に防ぐためのHTML共有チェックリスト。文言・数字・レスポンシブ・認証設定の観点を営業担当者に渡す前に潰す手順を解説します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "prepare-html-url-for-cs-review",
    "path": "/articles/prepare-html-url-for-cs-review",
    "title": "カスタマーサポートレビュー用にHTML共有URLを準備する方法",
    "description": "カスタマーサポートチームへのHTMLプレビュー共有を効率化したい制作担当者向けの記事。CS担当者が見るべき観点・認証の選び方・指摘回収の方法を実践的にまとめています。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "cs-review-html-share-checklist",
    "path": "/articles/cs-review-html-share-checklist",
    "title": "カスタマーサポートレビューで指摘漏れを減らすHTML共有チェックリスト",
    "description": "CSチームへのHTMLレビュー依頼で指摘漏れを防ぐためのチェックリスト。FAQ・エラーメッセージ・フォーム文言の確認観点と、修正後の再共有手順をCS担当者目線で解説します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "prepare-html-url-for-executive-approval",
    "path": "/articles/prepare-html-url-for-executive-approval",
    "title": "役員承認用にHTML共有URLを準備する方法",
    "description": "役員にHTMLプレビューURLを共有して承認を得たい担当者向けの記事。役員目線で必要な情報整理・認証設定・期限管理の方法を解説し、承認フローを最短化するヒントをまとめています。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "executive-approval-html-share-checklist",
    "path": "/articles/executive-approval-html-share-checklist",
    "title": "役員承認で指摘漏れを減らすHTML共有チェックリスト",
    "description": "役員承認を一発で通すためのHTML共有前チェックリスト。表現リスク・数値根拠・認証設定・指摘回収方法を具体的に解説し、承認フローを最短化したい制作担当者に役立つ内容です。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "prepare-html-url-for-client-approval",
    "path": "/articles/prepare-html-url-for-client-approval",
    "title": "クライアント承認用にHTML共有URLを準備する方法",
    "description": "クライアントへのHTML共有URLを準備したい制作担当者・ディレクター向けの記事。認証方式の選び方・渡すべき情報の整理・指摘回収テンプレートを具体的に解説します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "client-approval-html-share-checklist",
    "path": "/articles/client-approval-html-share-checklist",
    "title": "クライアント承認で指摘漏れを減らすHTML共有チェックリスト",
    "description": "クライアント承認で指摘漏れを防ぐためのHTML共有チェックリスト。仮テキストの除去・認証設定・指摘回収フォーマットをクライアントに渡す前に確認する具体的な手順を解説します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "prepare-html-url-for-multilingual-review",
    "path": "/articles/prepare-html-url-for-multilingual-review",
    "title": "多言語レビュー用にHTML共有URLを準備する方法",
    "description": "翻訳レビュー担当者や海外拠点スタッフがHTMLを安全に確認できるよう、認証・期限・差し替え手順を含む多言語レビュー用共有URLの準備方法を解説します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "multilingual-review-html-share-checklist",
    "path": "/articles/multilingual-review-html-share-checklist",
    "title": "多言語レビューで指摘漏れを減らすHTML共有チェックリスト",
    "description": "多言語レビューの担当者が指摘を見落とさないよう、事前準備から確認観点・NG例・修正後の再共有まで段階別にまとめたHTMLレビューチェックリストです。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "prepare-html-url-for-accessibility-review",
    "path": "/articles/prepare-html-url-for-accessibility-review",
    "title": "アクセシビリティレビュー用にHTML共有URLを準備する方法",
    "description": "スクリーンリーダー確認や色覚シミュレーションを行うレビュー担当者向けに、認証・期限・差し替え手順を含むアクセシビリティレビュー用HTML共有URLの準備方法を解説します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "accessibility-review-html-share-checklist",
    "path": "/articles/accessibility-review-html-share-checklist",
    "title": "アクセシビリティレビューで指摘漏れを減らすHTML共有チェックリスト",
    "description": "アクセシビリティレビューを効率化したいWeb担当者向けに、HTML共有前の事前確認からNG例・修正後の再共有手順まで、指摘漏れを防ぐチェックリストをまとめます。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "prepare-html-url-for-mobile-review",
    "path": "/articles/prepare-html-url-for-mobile-review",
    "title": "スマホ表示レビュー用にHTML共有URLを準備する方法",
    "description": "スマホ実機での表示確認をレビュー担当者に依頼したいWeb担当者向けに、認証・期限・差し替えを考慮したスマホ表示レビュー用HTML共有URLの準備方法を解説します。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "mobile-review-html-share-checklist",
    "path": "/articles/mobile-review-html-share-checklist",
    "title": "スマホ表示レビューで指摘漏れを減らすHTML共有チェックリスト",
    "description": "スマホ表示のHTML共有で指摘漏れを防ぎたいWeb担当者向けに、事前準備・確認観点・NG例・修正後の再共有まで、段階別チェックリストをまとめます。",
    "category": "社内レビュー",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-top-folder-howto",
    "path": "/articles/zip-top-folder-howto",
    "title": "ZIPの最上位フォルダが原因でindex.htmlが見つからないときの直し方",
    "description": "ZIPに最上位フォルダが挟まってindex.htmlが見つからないエラーに困っている方向けに、正しいZIP構成・圧縮前チェック・アップロード後確認の手順を解説します。",
    "category": "ZIP公開",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-macos-hidden-files-howto",
    "path": "/articles/zip-macos-hidden-files-howto",
    "title": "Macで作ったZIPに隠しファイルが混ざるときの確認方法",
    "description": "MacでZIPを作成したときに混入する隠しファイルに悩むWeb担当者向けに、症状の確認・正しい構成・圧縮前の除去手順・アップロード後の確認方法を解説します。",
    "category": "ZIP公開",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-windows-encoding-howto",
    "path": "/articles/zip-windows-encoding-howto",
    "title": "Windowsで作ったZIPの文字コードトラブルを避ける方法",
    "description": "WindowsでZIPを作成したときの文字コードトラブルに悩むWeb担当者向けに、文字化けの原因・正しいZIP構成・回避手順・アップロード後の確認方法を解説します。",
    "category": "ZIP公開",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-node-modules-howto",
    "path": "/articles/zip-node-modules-howto",
    "title": "node_modulesを含めずに公開用ZIPを作る方法",
    "description": "node_modulesを含まずに公開用ZIPを作る方法に困っているフロントエンド開発者向けに、ビルド後のdist以下をZIPにする手順・構成確認・よくある落とし穴を解説します。",
    "category": "ZIP公開",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-dist-folder-howto",
    "path": "/articles/zip-dist-folder-howto",
    "title": "distフォルダだけをZIPにしてHTMLを共有する方法",
    "description": "ビルドツールを使うフロントエンド開発者向けに、distフォルダだけをZIPにしてHTMLを安全に共有する手順・構成確認・アップロード後のチェック方法を解説します。",
    "category": "ZIP公開",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-assets-path-howto",
    "path": "/articles/zip-assets-path-howto",
    "title": "assetsフォルダのパス崩れを防ぐZIP構成",
    "description": "ZIPをアップロードしたときにassetsのパスが崩れて困っているWeb担当者向けに、正しいZIP構成の考え方・圧縮前の確認手順・アップロード後のデバッグ方法を解説します。",
    "category": "ZIP公開",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-large-images-howto",
    "path": "/articles/zip-large-images-howto",
    "title": "大きい画像を含むZIPを軽くして共有する方法",
    "description": "大きい画像を含むZIPが重すぎて共有できずに困っているWeb制作者・デザイナー向け。画像圧縮の手順からZIP構成の整え方、アップロード後の動作確認まで具体的に解説し、軽量化の方針を判断できる記事。",
    "category": "ZIP公開",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-nested-index-howto",
    "path": "/articles/zip-nested-index-howto",
    "title": "ネストしたindex.htmlを公開前に直す方法",
    "description": "ZIPを展開したらindex.htmlが深い階層に埋もれて公開に失敗した経験のあるWeb制作者向け。ネストが起きる仕組みから正しいZIPの作り方・確認方法まで解説し、再発を防ぐ手順が理解できる記事。",
    "category": "ZIP公開",
    "updatedAt": "2026-06-25"
  },
  {
    "slug": "zip-before-client-review-howto",
    "path": "/articles/zip-before-client-review-howto",
    "title": "クライアントレビュー前にZIPを点検するチェックリスト",
    "description": "クライアントへのZIPプレビュー共有前に確認すべき事項をまとめたチェックリスト。表示・情報漏洩・認証設定の3観点から実務で起きがちなミスを網羅し、「これで送っていいか」を自己判断できるようになる記事。",
    "category": "ZIP公開",
    "updatedAt": "2026-07-05"
  },
  {
    "slug": "zip-ai-output-cleanup-howto",
    "path": "/articles/zip-ai-output-cleanup-howto",
    "title": "AI生成HTMLの出力フォルダを公開用ZIPに整える方法",
    "description": "AIツールが生成したHTMLフォルダを公開用ZIPに整えたいWeb制作者・プロトタイパー向け。不要ファイルの除去・パスの修正・セキュリティ確認の手順を具体的に解説し、安全に共有できる状態かを判断できる記事。",
    "category": "ZIP公開",
    "updatedAt": "2026-06-27"
  }
];
