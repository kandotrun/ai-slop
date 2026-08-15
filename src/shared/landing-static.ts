import { DEMO_HTML_DOWNLOAD_PATH, DEMO_HTML_FILE_NAME } from "./demo-site";
import { FEATURED_ARTICLE_LINKS } from "./featured-articles";
import { FORM_FEATURE_BULLETS, FORM_FEATURE_DESCRIPTION, FORM_FEATURE_NAME, FORM_FEATURE_STATUS_LABEL, FORM_FEATURE_TAGLINE } from "./form-feature";
import { LANDING_ARTICLE_SUMMARIES } from "./landing-articles";
import { LEGAL_LINKS } from "./legal";

const FEATURE_ITEMS = [
  {
    title: "3秒で公開",
    body: "ファイルを落とすだけ。ビルドもデプロイ設定も不要で、すぐに共有URLが手に入ります。"
  },
  {
    title: "会社ドメイン認証",
    body: "@example.co.jp のメンバーだけが閲覧可能。管理者権限なしで、社内・クライアント共有に。"
  },
  {
    title: "パスワード / メール認証",
    body: "共有パスワード、または許可したメールアドレスへの6桁コードで、相手を限定できます。"
  },
  {
    title: "期限付き公開",
    body: "7日・30日・90日などの公開期限を設定。期限が切れたURLは自動で見られなくなります。"
  },
  {
    title: "差し替え・アクセスログ",
    body: "同じURLのままHTMLを更新。誰がいつ見たか、認証ログも確認できます。"
  },
  {
    title: "セキュリティチェック",
    body: "APIキーらしき文字列や不要ファイルを公開前に検知。AI生成HTMLも安心して共有できます。"
  }
] as const;

const PLAN_ITEMS = [
  {
    name: "無料",
    price: "¥0",
    tagline: "まずは無料で1サイト公開",
    features: ["1サイトまで公開", "7日間公開", "認証なし共有"]
  },
  {
    name: "Pro",
    price: "¥980 / 月",
    tagline: "全機能を、サイト数無制限で",
    features: ["サイト公開数 無制限", "全認証（パスワード / メール / 会社ドメイン）", "リビジョン履歴・レビューコメント・フォーム便", "ブランディング非表示・アクセスログ・期限管理"]
  }
] as const;

function renderList(items: readonly string[]): string {
  return items.map((item) => `<li>${item}</li>`).join("");
}

export function renderStaticLandingHtmlForPathname(pathname: string): string | null {
  const normalized = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  if (normalized !== "/") return null;

  const articleCards = LANDING_ARTICLE_SUMMARIES
    .map(
      (article) => `<article class="lp-article-teaser lp-reveal">
        <span>${article.category}</span>
        <h3><a href="${article.path}">${article.title}</a></h3>
        <p>${article.description}</p>
      </article>`
    )
    .join("");

  const featureCards = FEATURE_ITEMS.map(
    (feature) => `<article class="lp-feature lp-reveal">
      <h3>${feature.title}</h3>
      <p>${feature.body}</p>
    </article>`
  ).join("");

  const planCards = PLAN_ITEMS.map(
    (plan) => `<article class="lp-price-card lp-reveal">
      <h3>${plan.name}</h3>
      <div><strong>${plan.price}</strong></div>
      <p>${plan.tagline}</p>
      <ul>${renderList(plan.features)}</ul>
    </article>`
  ).join("");

  const featuredLinks = FEATURED_ARTICLE_LINKS.map((link) => `<a href="${link.href}" target="_blank" rel="noreferrer">${link.label}</a>`).join("");
  const legalLinks = LEGAL_LINKS.map((link) => `<a href="${link.path}">${link.label}</a>`).join("");
  const formFeatureBullets = FORM_FEATURE_BULLETS.map((bullet) => `<li>${bullet}</li>`).join("");

  return `<div class="lp-shell">
    <div class="lp-announce"><a href="/app/"><strong>AIで作ったHTMLを、認証付きURLで安全に共有できます</strong></a></div>
    <header class="lp-header">
      <div class="lp-header-inner">
        <a href="#top" class="lp-brand"><span class="giga-brand">ギガサイト便</span></a>
        <nav class="lp-nav" aria-label="LP navigation">
          <a href="#features">機能</a>
          <a href="#how">使い方</a>
          <a href="/articles">活用記事</a>
          <a href="#pricing">料金</a>
          <a href="/contact">お問い合わせ</a>
        </nav>
        <div class="lp-header-actions"><a class="lp-btn lp-btn-solid" href="/app/">無料で始める</a></div>
      </div>
    </header>
    <main id="top">
      <section class="lp-hero">
        <h1 class="lp-gradient-shimmer">AIで作ったHTMLを、<br />3秒で共有URLに。</h1>
        <p class="lp-lead">ドラッグ＆ドロップするだけ。まずは認証なしURLで即公開。必要ならパスワード付きURLにして、見せる相手を絞れます。</p>
        <div class="lp-hero-actions">
          <a class="lp-btn lp-btn-solid lp-btn-lg" href="/app/">無料でHTMLを公開する</a>
          <a class="lp-btn lp-btn-outline lp-btn-lg" href="${DEMO_HTML_DOWNLOAD_PATH}" download="${DEMO_HTML_FILE_NAME}">デモHTMLをダウンロード</a>
        </div>
        <div class="lp-free-note">クレジットカード不要 · 無料で1サイト公開 · Proで全機能・サイト無制限</div>
      </section>
      <section class="lp-logos" aria-label="対応ツール">
        <span>あらゆるAIツールの出力をそのまま公開できます</span>
        <div><strong>Claude</strong><strong>v0</strong><strong>Bolt</strong><strong>ChatGPT</strong><strong>Stitch</strong><strong>Cursor</strong></div>
      </section>
      <section id="how" class="lp-section">
        <div class="lp-section-head lp-reveal"><h2>公開まで、3ステップ</h2><p>サーバーの設定も、デプロイの知識もいりません。</p></div>
        <div class="lp-demo-download-card lp-reveal">
          <div><span>HTMLを持っていない方へ</span><strong>まずはデモHTMLでアップロードを試せます</strong><p>ダウンロードした1ファイルをそのままアップロードすると、公開URLの発行から閲覧まで体験できます。</p></div>
          <a class="lp-btn lp-btn-solid" href="${DEMO_HTML_DOWNLOAD_PATH}" download="${DEMO_HTML_FILE_NAME}">デモHTMLをダウンロード</a>
        </div>
        <div class="lp-step-grid">
          <article class="lp-step lp-reveal"><div><span>01</span></div><h3>ドラッグ＆ドロップ</h3><p>作ったHTMLファイル、またはzipを画面に落とすだけ。index.html があればOK。</p></article>
          <article class="lp-step lp-reveal"><div><span>02</span></div><h3>認証方式を選ぶ</h3><p>パスワード・メール認証・会社ドメイン認証から選択。期限付き公開も設定できます。</p></article>
          <article class="lp-step lp-reveal"><div><span>03</span></div><h3>URLを共有</h3><p>{名前}.giga-site.com を社内やクライアントに共有。いつでも差し替え・削除できます。</p></article>
        </div>
      </section>
      <section id="features" class="lp-section">
        <div class="lp-section-head lp-reveal"><h2>仕事で使うための、共有機能</h2><p>ただ公開するだけではない。見せる相手をきちんと選べます。</p></div>
        <div class="lp-feature-grid">${featureCards}</div>
      </section>
      <section id="form-bin" class="lp-section lp-form-feature-section">
        <div class="lp-form-feature-card lp-reveal">
          <div class="lp-form-feature-copy"><span class="lp-form-feature-kicker">${FORM_FEATURE_STATUS_LABEL}</span><h2><span class="giga-brand">${FORM_FEATURE_NAME}</span>で、HTMLを<br />「見せる」から「受け取る」へ。</h2><p class="lp-form-feature-tagline">${FORM_FEATURE_TAGLINE}</p><p>${FORM_FEATURE_DESCRIPTION}</p><div class="lp-form-feature-actions"><a class="lp-btn lp-btn-outline" href="/app/">フォーム便を使ってみる</a></div></div>
          <div class="lp-form-feature-panel" aria-label="${FORM_FEATURE_NAME}の機能概要"><code>&lt;form data-giga-form=&quot;contact&quot;&gt;</code><ul>${formFeatureBullets}</ul></div>
        </div>
      </section>
      <section class="lp-section lp-articles-section">
        <div class="lp-section-head lp-reveal"><h2>HTML共有の活用記事</h2><p>AI生成HTMLやZIPサイトを、安全にURL共有するための実務ガイドです。</p></div>
        <div class="lp-article-teaser-grid">${articleCards}</div>
        <div class="lp-article-more"><a class="lp-btn lp-btn-outline" href="/articles">活用記事をもっと見る</a></div>
      </section>
      <section id="domain" class="lp-domain-section">
        <div class="lp-domain-card lp-reveal"><div><h2><code class="lp-domain-token">@example.co.jp</code> の人だけが<br />見られるURLを作る。</h2><div class="lp-domain-hint">自分の会社のドメインを入れるだけ。</div><p>ホスティングではなく、<strong>仕事のための共有</strong>。会社ドメイン認証なら、相手にGoogle Workspaceの管理者権限を求めずに、閲覧できる人をメールドメインで絞れます。</p><ul><li>管理者設定が不要</li><li>メール6桁コードで認証</li><li>アクセスログ付き</li></ul></div></div>
      </section>
      <section id="pricing" class="lp-section lp-pricing-section">
        <div class="lp-section-head lp-reveal"><h2>シンプルな料金</h2><p>無料で1サイト公開。Proなら月額¥980で、サイト公開数無制限＋全機能が使えます。</p></div>
        <div class="lp-plan-grid">${planCards}</div>
      </section>
      <section id="creator" class="lp-section lp-enterprise-section">
        <div class="lp-section-head lp-reveal"><h2>作っているのは、現場の開発者です</h2><p>AIプロダクトを実際に作って公開している開発者が、技術と開発の過程を発信しています。</p></div>
        <div class="lp-maker lp-reveal"><div class="lp-maker-cards"><a class="lp-maker-card" data-brand="github" href="https://github.com/kandotrun/kandotrun" target="_blank" rel="noreferrer"><span class="lp-maker-body"><strong>GitHub</strong><small>kandotrun</small><span>OSS・ツールを公開</span></span></a><a class="lp-maker-card" data-brand="zenn" href="https://zenn.dev/nixo" target="_blank" rel="noreferrer"><span class="lp-maker-body"><strong>Zenn</strong><small>@nixo</small><span>技術記事を発信</span></span></a><a class="lp-maker-card" data-brand="youtube" href="https://www.youtube.com/@nixo0" target="_blank" rel="noreferrer"><span class="lp-maker-body"><strong>YouTube</strong><small>@nixo0</small><span>開発・AI活用を発信</span></span></a></div></div>
      </section>
      <section class="lp-final-cta"><h2>AIで作ったHTML、<br />そのまま眠らせていませんか。</h2><p>いまドロップするだけで、認証なしURLまたはパスワード付きURLを発行できます。</p><div><a class="lp-btn lp-btn-solid lp-btn-lg" href="/app/">無料でHTMLを公開する</a></div></section>
    </main>
    <footer class="lp-footer"><div class="lp-footer-grid"><div><strong><span class="giga-brand">ギガサイト便</span></strong><p>AIで作ったHTMLを、認証付きURLで安全に共有。</p></div><div><h4>プロダクト</h4><a href="#features">機能</a><a href="#form-bin">${FORM_FEATURE_NAME}</a><a href="#pricing">料金</a></div><div><h4>紹介記事</h4>${featuredLinks}</div><div><h4>法務</h4>${legalLinks}</div></div><div class="lp-footer-bottom"><span>© 2026 2-38.com</span><code>giga-site.com</code></div></footer>
  </div>`;
}
