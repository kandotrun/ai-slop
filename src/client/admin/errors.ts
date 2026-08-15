// Maps backend error codes (and a few network failures) to friendly Japanese
// messages shown in toasts. Unknown codes fall back to a generic message; any
// string that already reads as Japanese is passed through unchanged.

const ERROR_MESSAGES: Record<string, string> = {
  plan_required: "この機能は Pro プランで利用できます。「課金・プラン」からアップグレードしてください。",
  session_required: "ログインの有効期限が切れました。お手数ですが、再度ログインしてください。",
  site_not_found: "対象のサイトが見つかりませんでした。",
  site_not_created: "サイトの作成に失敗しました。時間をおいて再度お試しください。",
  no_updates: "変更点がありません。",

  password_required: "パスワード認証にはパスワードの入力が必要です。",
  password_too_common: "パスワードが単純すぎます。推測されにくいものに変更してください。",
  password_too_long: "パスワードが長すぎます。",
  domain_required: "会社ドメイン認証には、許可するドメインの入力が必要です。",
  allowed_emails_required: "メール認証には、招待するメールアドレスの入力が必要です。",
  invalid_domain: "ドメインの形式が正しくありません。",
  invalid_email: "メールアドレスの形式が正しくありません。",
  too_many_domains: "許可するドメインの数が多すぎます。",
  too_many_emails: "招待するメールアドレスの数が多すぎます。",

  invalid_slug: "URL（slug）に使えない文字が含まれています。半角英数字とハイフンが使えます。",
  reserved_slug: "その URL（slug）は予約済みのため使用できません。別の名前を指定してください。",
  slug_already_taken: "その URL（slug）は既に使われています。別の名前を指定してください。",
  title_too_long: "タイトルが長すぎます。",
  invalid_auth_mode: "認証方式の指定が正しくありません。",
  invalid_expires_at: "公開期限の指定が正しくありません。",
  invalid_hide_branding: "ロゴ非表示の設定値が正しくありません。",
  invalid_indexing_enabled: "検索表示の設定値が正しくありません。",

  html_or_files_required: "アップロードする HTML またはファイルが必要です。",
  entry_file_missing: "index.html が見つかりません。エントリーとなる index.html を含めてください。",
  invalid_file: "ファイルを読み込めませんでした。HTML または zip を指定してください。",
  invalid_file_path: "ファイルのパスに使えない文字が含まれています。",
  invalid_entry_path: "エントリーファイルの指定が正しくありません。",
  upload_too_large: "ファイルサイズが上限を超えています。不要な画像や生成物を削って小さくしてください。",
  too_many_files: "ファイル数が上限を超えています。不要なファイルを除外してください。",
  free_plan_site_limit_exceeded: "無料プランで公開できるサイトは1件までです。2件目以降は Pro プランにアップグレードしてください。",
  plan_limit_exceeded: "公開サイト数の上限に達しています。Pro プランにアップグレードすると無制限に公開できます。",
  free_plan_expiry_limit_exceeded: "無料プランの公開期限は7日間までです。無期限公開には Pro プランにアップグレードしてください。",
  expiry_renewal_not_available: "公開期間を更新できるのは、期限付きで公開されているサイトのみです。",
  form_submission_not_found: "フォーム回答が見つかりませんでした。",
  form_submissions_failed: "フォーム回答を読み込めませんでした。時間をおいて再度お試しください。",
  form_submission_failed: "フォーム回答の詳細を読み込めませんでした。時間をおいて再度お試しください。",
  security_review_warning: "セキュリティチェックで警告が見つかりました。内容を確認して修正するか、リスクを理解したうえで公開を続行してください。",

  invalid_plan: "プランの指定が正しくありません。",
  plan_already_active: "現在の契約に含まれているため、新しい決済は不要です。プラン変更・解約から契約を確認してください。",
  paid_checkout_preparing: "有料プランは現在準備中です。Stripeの本番決済が有効化された後に利用できます。",
  billing_portal_unavailable: "この契約はStripe経由ではないため、解約・請求変更は問い合わせからご連絡ください。",
  stripe_live_charges_disabled: "Stripe本番決済がまだ有効化されていないため、決済ページを開けません。Stripe Dashboardで本人確認・審査を完了してから再度お試しください。",
  stripe_request_failed: "Stripe連携に失敗しました。Stripe Dashboardの状態を確認してから再度お試しください。",
  stripe_billing_portal_session_invalid: "Stripe請求ポータルを開けませんでした。時間をおいて再度お試しください。",
  agent_token_failed: "一回限りアップロード Token の発行に失敗しました。時間をおいて再度お試しください。"
};

export function errorMessageJa(raw: string): string {
  const code = (raw ?? "").trim();
  if (!code) return "保存できませんでした。時間をおいて再度お試しください。";
  if (ERROR_MESSAGES[code]) return ERROR_MESSAGES[code];

  const failed = code.match(/^request_failed_(\d+)$/);
  if (failed) return `サーバーエラーが発生しました（${failed[1]}）。時間をおいて再度お試しください。`;

  // fetchJson already surfaces Japanese sentences (e.g. "サーバーに接続できませんでした").
  if (/[ぁ-んァ-ヶー一-龠]/.test(code)) return code;

  return "保存できませんでした。時間をおいて再度お試しください。";
}
