import type { ReactNode } from "react";
import { BrandName } from "./BrandName";
import { LEGAL_LINKS, type LegalPath } from "../shared/legal";

interface TextSection {
  title: string;
  body: ReactNode;
}

interface TableRow {
  label: string;
  value: ReactNode;
}

const lastUpdated = "2026年6月19日";
const operatorName = "二宮 貫（屋号: 2-38.com）";
const contactHref = "/contact?type=question";

const termsSections: TextSection[] = [
  {
    title: "第1条（適用）",
    body: <p>本利用規約は、<BrandName />（以下「本サービス」といいます。）の利用条件を定めるものです。ユーザーは、本サービスを利用することで本規約に同意したものとみなされます。</p>
  },
  {
    title: "第2条（サービス内容）",
    body: <p>本サービスは、ユーザーがアップロードした静的HTML、CSS、JavaScript、画像その他の静的ファイルを、認証付きURLとして共有するためのサービスです。サーバーサイドコードの実行、データベース付きアプリの稼働、継続的なシステム運用代行は含みません。</p>
  },
  {
    title: "第3条（アカウントと認証）",
    body: <p>ユーザーは、正確なメールアドレスを用いて本サービスを利用するものとします。メール認証コード、共有パスワード、アップロードトークン等を第三者に不適切に共有してはなりません。</p>
  },
  {
    title: "第4条（アップロードデータ）",
    body: <p>ユーザーは、アップロードするファイルについて必要な権利を有し、法令・契約・第三者の権利に違反しないことを保証します。APIキー、秘密情報、個人情報、機密情報を含むファイルは、公開前にユーザーの責任で確認してください。</p>
  },
  {
    title: "第5条（禁止事項）",
    body: (
      <ul>
        <li>法令または公序良俗に反する行為</li>
        <li>第三者の権利、プライバシー、営業秘密を侵害する行為</li>
        <li>フィッシング、詐欺、マルウェア配布、なりすまし、認証情報の取得を目的とする行為</li>
        <li>本サービスの運営、インフラ、他のユーザーに過度な負荷または損害を与える行為</li>
        <li>本サービスの脆弱性探索、回避、リバースエンジニアリング、または不正アクセス</li>
      </ul>
    )
  },
  {
    title: "第6条（公開前チェック）",
    body: <p>本サービスは、アップロードファイルに対して機械的なセキュリティチェックやAIによるレビューを行う場合があります。ただし、これらは安全性・適法性・機密情報の不存在を保証するものではありません。</p>
  },
  {
    title: "第7条（料金と決済）",
    body: <p>有料プラン（Pro）の料金は、本サービス上で表示します。決済はStripe等の外部決済サービスを通じて行われます。支払条件、更新、解約、返金については返金・キャンセルポリシーおよび購入時の表示に従います。</p>
  },
  {
    title: "第8条（停止・削除）",
    body: <p>運営者は、ユーザーが本規約に違反した場合、法令上必要な場合、または本サービスの安全な運営に必要な場合、事前通知なく公開URL、アカウント、アップロードデータを停止または削除できるものとします。</p>
  },
  {
    title: "第9条（免責）",
    body: <p>本サービスは現状有姿で提供されます。運営者は、サービスの停止、データ消失、第三者サービスの障害、アップロード内容に起因する損害について、運営者に故意または重過失がある場合を除き責任を負いません。</p>
  },
  {
    title: "第10条（準拠法・管轄）",
    body: <p>本規約は日本法に準拠します。本サービスに関して紛争が生じた場合、運営者の所在地を管轄する日本の裁判所を第一審の専属的合意管轄裁判所とします。</p>
  }
];

const privacySections: TextSection[] = [
  {
    title: "1. 取得する情報",
    body: (
      <ul>
        <li>メールアドレス、氏名、会社名、問い合わせ内容</li>
        <li>アップロードされたHTML、zip、画像、関連ファイル、および設定情報</li>
        <li>アクセスログ、認証ログ、IPアドレス、User-Agent、Cookie、操作履歴</li>
        <li>決済状態、プラン、購入履歴。ただしカード番号等はStripeで処理され、本サービスでは保持しません。</li>
      </ul>
    )
  },
  {
    title: "2. 利用目的",
    body: (
      <ul>
        <li>本サービスの提供、認証、公開URLの管理、アクセス制御のため</li>
        <li>問い合わせ対応、重要なお知らせの送付のため</li>
        <li>料金請求、決済確認、プラン管理のため</li>
        <li>不正利用、障害、セキュリティリスクの検知・調査・防止のため</li>
        <li>サービス改善、利用状況分析、品質向上のため</li>
      </ul>
    )
  },
  {
    title: "3. アップロードファイルの取扱い",
    body: <p>アップロードファイルは、共有URLの配信、認証、差し替え、削除、セキュリティチェックのために処理されます。公開前チェックでは、秘密情報らしき文字列を可能な範囲で伏せたうえで、AIレビューまたは外部サービスを利用する場合があります。</p>
  },
  {
    title: "4. 第三者サービス・委託先",
    body: <p>本サービスは、Cloudflare、Stripe、Ollama Cloud、メール送信サービス、その他運営に必要な外部サービスを利用する場合があります。これらの委託先には、利用目的の達成に必要な範囲で情報が取り扱われます。</p>
  },
  {
    title: "5. 第三者提供",
    body: <p>法令に基づく場合、本人の同意がある場合、生命・身体・財産の保護に必要な場合、または利用目的の達成に必要な範囲で業務委託先に提供する場合を除き、個人情報を第三者に提供しません。</p>
  },
  {
    title: "6. Cookie・アクセス解析",
    body: <p>本サービスは、ログイン状態の維持、認証済み閲覧、セキュリティ対策、利用状況把握のためCookieおよび類似技術を使用します。ブラウザ設定によりCookieを制限した場合、一部機能が利用できないことがあります。</p>
  },
  {
    title: "7. 保存期間と削除",
    body: <p>取得した情報は、利用目的に必要な期間、または法令上必要な期間保存します。公開期限切れ、ユーザーによる削除、退会、または運営上不要となった情報は、合理的な範囲で削除または匿名化します。</p>
  },
  {
    title: "8. 安全管理措置",
    body: <p>運営者は、アクセス制御、認証、ログ監査、通信の暗号化、秘密情報の分離管理など、個人情報およびアップロードデータを保護するために合理的な安全管理措置を講じます。</p>
  },
  {
    title: "9. 開示・訂正・削除等の請求",
    body: <p>個人情報の開示、訂正、利用停止、削除等を希望する場合は、問い合わせフォームから連絡してください。本人確認のうえ、法令に従って対応します。</p>
  }
];

const commerceRows: TableRow[] = [
  { label: "販売事業者", value: operatorName },
  { label: "運営責任者", value: "二宮 貫" },
  { label: "所在地", value: "請求があった場合に遅滞なく開示します。開示を希望される場合は問い合わせフォームからご連絡ください。" },
  { label: "電話番号", value: "請求があった場合に遅滞なく開示します。" },
  { label: "メールアドレス", value: "kan@2-38.com" },
  { label: "問い合わせ窓口", value: <a href={contactHref}>問い合わせフォーム</a> },
  { label: "販売価格", value: "各プランの申込画面に表示します。例: Pro ¥980/月（無料プランあり）。" },
  { label: "商品代金以外の必要料金", value: "インターネット接続料金、通信料金、振込手数料等はユーザー負担です。表示価格に消費税が含まれる場合は申込画面に表示します。" },
  { label: "支払方法", value: "Stripeを通じたクレジットカード決済その他Stripeが対応する決済方法。" },
  { label: "支払時期", value: "月額プランは申込時および更新時に決済されます。" },
  { label: "役務の提供時期", value: "決済完了またはアカウント作成後、利用可能な状態になり次第提供します。" },
  { label: "キャンセル・返金", value: "デジタルサービスの性質上、提供開始後の返金は原則として行いません。詳細は返金・キャンセルポリシーをご確認ください。" },
  { label: "動作環境", value: "最新版の主要ブラウザ、インターネット接続環境が必要です。" },
  { label: "申込の有効期限", value: "申込画面または個別見積りに表示がある場合を除き、申込時点で決済が完了しない場合は申込が成立しません。" }
];

const refundSections: TextSection[] = [
  {
    title: "1. 基本方針",
    body: <p><BrandName />は、デジタルサービスの性質上、決済完了後または役務提供開始後の返金を原則として行いません。ただし、法令上必要な場合、重複決済、明らかな請求誤り、または運営者が返金を相当と判断した場合はこの限りではありません。</p>
  },
  {
    title: "2. 月額プランの解約",
    body: <p>月額プランは、次回更新前に解約された場合、次回以降の請求を停止します。既に開始した請求期間の日割り返金は原則として行いません。</p>
  },
  {
    title: "3. 問い合わせ方法",
    body: <p>返金、キャンセル、請求内容の確認は、決済に使ったメールアドレス、対象プラン、決済日時を添えて問い合わせフォームから連絡してください。</p>
  }
];

function LegalHeader({ title, description }: { title: string; description: ReactNode }) {
  return (
    <header className="lp-header">
      <div className="lp-header-inner">
        <a href="/" className="lp-brand"><BrandName /></a>
        <nav className="lp-nav" aria-label="Legal navigation">
          <a href="/terms">利用規約</a>
          <a href="/privacy">プライバシー</a>
          <a href="/commerce">特商法</a>
          <a href="/contact">お問い合わせ</a>
        </nav>
        <div className="lp-header-actions">
          <a className="lp-btn lp-btn-ghost lp-login-desktop" href="/app/">ログイン</a>
          <a className="lp-btn lp-btn-solid" href="/app/">無料で始める</a>
        </div>
      </div>
      <div className="lp-legal-hero">
        <span>Legal</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <small>最終更新日: {lastUpdated}</small>
      </div>
    </header>
  );
}

function LegalFooter() {
  return (
    <footer className="lp-legal-footer">
      <a href="/">トップに戻る</a>
      <a href="/contact?type=question">問い合わせる</a>
    </footer>
  );
}

function SectionList({ sections }: { sections: TextSection[] }) {
  return (
    <div className="lp-legal-card">
      {sections.map((section) => (
        <section className="lp-legal-section" key={section.title}>
          <h2>{section.title}</h2>
          {section.body}
        </section>
      ))}
    </div>
  );
}

function CommerceTable() {
  return (
    <div className="lp-legal-card">
      <table className="lp-legal-table">
        <tbody>
          {commerceRows.map((row) => (
            <tr key={row.label}>
              <th>{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="lp-legal-note">所在地および電話番号は、消費者庁の通信販売広告に関する整理に基づき、請求があった場合に遅滞なく開示する運用とします。</p>
    </div>
  );
}

export function LegalPage({ path }: { path: LegalPath }) {
  if (path === "/privacy") {
    return (
      <div className="lp-shell">
        <LegalHeader title="プライバシーポリシー" description={<><BrandName />における個人情報・アップロードデータ・アクセスログの取扱いを定めます。</>} />
        <main className="lp-legal-page"><SectionList sections={privacySections} /></main>
        <LegalFooter />
      </div>
    );
  }
  if (path === "/commerce") {
    return (
      <div className="lp-shell">
        <LegalHeader title="特定商取引法に基づく表記" description="有料プラン（Pro）の販売条件を表示します。" />
        <main className="lp-legal-page"><CommerceTable /></main>
        <LegalFooter />
      </div>
    );
  }
  if (path === "/refund-policy") {
    return (
      <div className="lp-shell">
        <LegalHeader title="返金・キャンセルポリシー" description="デジタルサービス、月額プラン、個別支援の返金・解約条件を定めます。" />
        <main className="lp-legal-page"><SectionList sections={refundSections} /></main>
        <LegalFooter />
      </div>
    );
  }
  return (
    <div className="lp-shell">
      <LegalHeader title="利用規約" description={<><BrandName />の利用条件、禁止事項、料金、免責等を定めます。</>} />
      <main className="lp-legal-page"><SectionList sections={termsSections} /></main>
      <footer className="lp-legal-footer">
        {LEGAL_LINKS.map((link) => <a href={link.path} key={link.path}>{link.label}</a>)}
      </footer>
    </div>
  );
}
