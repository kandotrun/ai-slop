import { LEGAL_LINKS, legalPathFromPathname, type LegalPath } from "./legal";

const LAST_UPDATED = "2026年6月19日";

const CONTACT_TOPICS = ["認証方式（パスワード・メール・会社ドメイン）の使い方", "公開期限・URLの差し替え", "料金・請求・解約について", "不具合の報告・機能の要望"] as const;
const CONTACT_FIELDS = ["対象のサイトURL（あれば）", "発生している状況", "利用中のブラウザ・端末"] as const;

const TERMS_SECTIONS = [
  ["第1条（適用）", "本利用規約は、ギガサイト便（以下「本サービス」といいます。）の利用条件を定めるものです。ユーザーは、本サービスを利用することで本規約に同意したものとみなされます。"],
  ["第2条（サービス内容）", "本サービスは、ユーザーがアップロードした静的HTML、CSS、JavaScript、画像その他の静的ファイルを、認証付きURLとして共有するためのサービスです。サーバーサイドコードの実行、データベース付きアプリの稼働、継続的なシステム運用代行は含みません。"],
  ["第3条（アカウントと認証）", "ユーザーは、正確なメールアドレスを用いて本サービスを利用するものとします。メール認証コード、共有パスワード、アップロードトークン等を第三者に不適切に共有してはなりません。"],
  ["第4条（アップロードデータ）", "ユーザーは、アップロードするファイルについて必要な権利を有し、法令・契約・第三者の権利に違反しないことを保証します。APIキー、秘密情報、個人情報、機密情報を含むファイルは、公開前にユーザーの責任で確認してください。"],
  ["第5条（禁止事項）", "法令または公序良俗に反する行為、第三者の権利やプライバシーを侵害する行為、フィッシング・詐欺・マルウェア配布を目的とする行為、本サービスへ過度な負荷を与える行為を禁止します。"],
  ["第6条（公開前チェック）", "本サービスは、アップロードファイルに対して機械的なセキュリティチェックやAIによるレビューを行う場合があります。ただし、これらは安全性・適法性・機密情報の不存在を保証するものではありません。"],
  ["第7条（料金と決済）", "有料プラン（Pro）の料金は、本サービス上で表示します。決済はStripe等の外部決済サービスを通じて行われます。"],
  ["第8条（停止・削除）", "運営者は、ユーザーが本規約に違反した場合、法令上必要な場合、または本サービスの安全な運営に必要な場合、事前通知なく公開URL、アカウント、アップロードデータを停止または削除できるものとします。"],
  ["第9条（免責）", "本サービスは現状有姿で提供されます。運営者は、サービスの停止、データ消失、第三者サービスの障害、アップロード内容に起因する損害について、運営者に故意または重過失がある場合を除き責任を負いません。"],
  ["第10条（準拠法・管轄）", "本規約は日本法に準拠します。本サービスに関して紛争が生じた場合、運営者の所在地を管轄する日本の裁判所を第一審の専属的合意管轄裁判所とします。"]
] as const;

const PRIVACY_SECTIONS = [
  ["1. 取得する情報", "メールアドレス、氏名、会社名、問い合わせ内容、アップロードされたHTML・zip・画像・設定情報、アクセスログ、認証ログ、IPアドレス、User-Agent、Cookie、操作履歴、決済状態、プラン、購入履歴を取得する場合があります。カード番号等はStripeで処理され、本サービスでは保持しません。"],
  ["2. 利用目的", "本サービスの提供、認証、公開URLの管理、アクセス制御、問い合わせ対応、料金請求、決済確認、不正利用や障害の調査、サービス改善、利用状況分析のために利用します。"],
  ["3. アップロードファイルの取扱い", "アップロードファイルは、共有URLの配信、認証、差し替え、削除、セキュリティチェックのために処理されます。公開前チェックでは、秘密情報らしき文字列を可能な範囲で伏せたうえで、AIレビューまたは外部サービスを利用する場合があります。"],
  ["4. 第三者サービス・委託先", "本サービスは、Cloudflare、Stripe、Ollama Cloud、メール送信サービス、その他運営に必要な外部サービスを利用する場合があります。これらの委託先には、利用目的の達成に必要な範囲で情報が取り扱われます。"],
  ["5. 第三者提供", "法令に基づく場合、本人の同意がある場合、生命・身体・財産の保護に必要な場合、または利用目的の達成に必要な範囲で業務委託先に提供する場合を除き、個人情報を第三者に提供しません。"],
  ["6. Cookie・アクセス解析", "本サービスは、ログイン状態の維持、認証済み閲覧、セキュリティ対策、利用状況把握のためCookieおよび類似技術を使用します。ブラウザ設定によりCookieを制限した場合、一部機能が利用できないことがあります。"],
  ["7. 保存期間と削除", "取得した情報は、利用目的に必要な期間、または法令上必要な期間保存します。公開期限切れ、ユーザーによる削除、退会、または運営上不要となった情報は、合理的な範囲で削除または匿名化します。"],
  ["8. 安全管理措置", "運営者は、アクセス制御、認証、ログ監査、通信の暗号化、秘密情報の分離管理など、個人情報およびアップロードデータを保護するために合理的な安全管理措置を講じます。"],
  ["9. 開示・訂正・削除等の請求", "個人情報の開示、訂正、利用停止、削除等を希望する場合は、問い合わせフォームから連絡してください。本人確認のうえ、法令に従って対応します。"]
] as const;

const COMMERCE_ROWS = [
  ["販売事業者", "二宮 貫（屋号: 2-38.com）"],
  ["運営責任者", "二宮 貫"],
  ["所在地", "請求があった場合に遅滞なく開示します。開示を希望される場合は問い合わせフォームからご連絡ください。"],
  ["電話番号", "請求があった場合に遅滞なく開示します。"],
  ["問い合わせ窓口", "問い合わせフォーム"],
  ["販売価格", "各プランの申込画面に表示します。例: Pro ¥980/月（無料プランあり）。"],
  ["商品代金以外の必要料金", "インターネット接続料金、通信料金、振込手数料等はユーザー負担です。"],
  ["支払方法", "Stripeを通じたクレジットカード決済その他Stripeが対応する決済方法。"],
  ["支払時期", "月額プランは申込時および更新時に決済されます。"],
  ["役務の提供時期", "決済完了またはアカウント作成後、利用可能な状態になり次第提供します。"],
  ["キャンセル・返金", "デジタルサービスの性質上、提供開始後の返金は原則として行いません。詳細は返金・キャンセルポリシーをご確認ください。"],
  ["動作環境", "最新版の主要ブラウザ、インターネット接続環境が必要です。"],
  ["申込の有効期限", "申込画面または個別見積りに表示がある場合を除き、申込時点で決済が完了しない場合は申込が成立しません。"]
] as const;

const REFUND_SECTIONS = [
  ["1. 基本方針", "ギガサイト便は、デジタルサービスの性質上、決済完了後または役務提供開始後の返金を原則として行いません。ただし、法令上必要な場合、重複決済、明らかな請求誤り、または運営者が返金を相当と判断した場合はこの限りではありません。"],
  ["2. 月額プランの解約", "月額プランは、次回更新前に解約された場合、次回以降の請求を停止します。既に開始した請求期間の日割り返金は原則として行いません。"],
  ["3. 問い合わせ方法", "返金、キャンセル、請求内容の確認は、決済に使ったメールアドレス、対象プラン、決済日時を添えて問い合わせフォームから連絡してください。"]
] as const;

export function renderStaticSupportHtmlForPathname(pathname: string): string | null {
  if (normalizePath(pathname) === "/contact") return renderContactHtml();
  const legalPath = legalPathFromPathname(pathname);
  return legalPath ? renderLegalHtml(legalPath) : null;
}

function renderContactHtml(): string {
  return `<div class="lp-shell">
    ${renderSimpleHeader("Contact navigation")}
    <main class="lp-contact-page">
      <section class="lp-contact-hero"><div><span class="lp-contact-kicker">Contact</span><h1>お問い合わせ</h1><p>サービスの使い方、料金・請求、不具合の報告など、お気軽にお送りください。</p></div></section>
      <section class="lp-contact-grid">
        <form class="lp-contact-form" action="/api/contact" method="post">
          <label>お名前<input name="name" autocomplete="name" required maxlength="80" /></label>
          <label>メールアドレス<input type="email" name="email" autocomplete="email" required maxlength="120" /></label>
          <label>会社名（任意）<input name="company" autocomplete="organization" maxlength="120" /></label>
          <label>種別<select name="category"><option value="question">サービスへの質問</option><option value="billing">料金・請求</option><option value="other">その他</option></select></label>
          <label class="lp-contact-full">お問い合わせ内容<textarea name="message" placeholder="例: 公開したサイトの認証方式について教えてください。" required minlength="10" maxlength="4000" rows="8"></textarea></label>
          <button type="submit" class="lp-btn lp-btn-solid lp-btn-lg">問い合わせを送信</button>
        </form>
        <div class="lp-contact-side">
          <article><strong>よくある問い合わせ</strong><ul>${renderList(CONTACT_TOPICS)}</ul></article>
          <article><strong>書いてほしいこと</strong><ul>${renderList(CONTACT_FIELDS)}</ul></article>
        </div>
      </section>
    </main>
  </div>`;
}

function renderLegalHtml(path: LegalPath): string {
  if (path === "/privacy") {
    return renderLegalShell("プライバシーポリシー", "ギガサイト便における個人情報・アップロードデータ・アクセスログの取扱いを定めます。", renderSections(PRIVACY_SECTIONS));
  }
  if (path === "/commerce") {
    return renderLegalShell("特定商取引法に基づく表記", "有料プラン（Pro）の販売条件を表示します。", renderCommerceTable());
  }
  if (path === "/refund-policy") {
    return renderLegalShell("返金・キャンセルポリシー", "デジタルサービス、月額プラン、個別支援の返金・解約条件を定めます。", renderSections(REFUND_SECTIONS));
  }
  return renderLegalShell("利用規約", "ギガサイト便の利用条件、禁止事項、料金、免責等を定めます。", renderSections(TERMS_SECTIONS), true);
}

function renderLegalShell(title: string, description: string, body: string, showAllLegalLinks = false): string {
  const footer = showAllLegalLinks ? LEGAL_LINKS.map((link) => `<a href="${link.path}">${escapeText(link.label)}</a>`).join("") : '<a href="/">トップに戻る</a><a href="/contact?type=question">問い合わせる</a>';
  return `<div class="lp-shell">
    ${renderSimpleHeader("Legal navigation")}
    <header class="lp-legal-hero"><span>Legal</span><h1>${escapeText(title)}</h1><p>${escapeText(description)}</p><small>最終更新日: ${LAST_UPDATED}</small></header>
    <main class="lp-legal-page">${body}</main>
    <footer class="lp-legal-footer">${footer}</footer>
  </div>`;
}

function renderSimpleHeader(navLabel: string): string {
  return `<header class="lp-header"><div class="lp-header-inner"><a href="/" class="lp-brand"><span class="giga-brand">ギガサイト便</span></a><nav class="lp-nav" aria-label="${escapeText(navLabel)}"><a href="/#features">機能</a><a href="/#pricing">料金</a><a href="/articles">活用記事</a><a href="/contact">お問い合わせ</a></nav><div class="lp-header-actions"><a class="lp-btn lp-btn-ghost lp-login-desktop" href="/app/">ログイン</a><a class="lp-btn lp-btn-solid" href="/app/">無料で始める</a></div></div></header>`;
}

function renderSections(sections: readonly (readonly [string, string])[]): string {
  return `<div class="lp-legal-card">${sections.map(([title, body]) => `<section class="lp-legal-section"><h2>${escapeText(title)}</h2><p>${escapeText(body)}</p></section>`).join("")}</div>`;
}

function renderCommerceTable(): string {
  const rows = COMMERCE_ROWS.map(([label, value]) => `<tr><th>${escapeText(label)}</th><td>${escapeText(value)}</td></tr>`).join("");
  return `<div class="lp-legal-card"><table class="lp-legal-table"><tbody>${rows}</tbody></table><p class="lp-legal-note">所在地および電話番号は、消費者庁の通信販売広告に関する整理に基づき、請求があった場合に遅滞なく開示する運用とします。</p></div>`;
}

function renderList(items: readonly string[]): string {
  return items.map((item) => `<li>${escapeText(item)}</li>`).join("");
}

function normalizePath(pathname: string): string {
  return pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
}

function escapeText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
