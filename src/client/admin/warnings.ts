interface WarningDetail {
  code: string;
  label: string;
  where: string;
  description: string;
  action: string;
}

const WARNING_MESSAGES: Record<string, string> = {
  possible_secret: "APIキーらしき文字列",
  external_form_action: "外部送信フォーム",
  external_script: "外部スクリプト",
  php_file: "PHPファイル",
  ai_security_medium: "AI確認: 要注意",
  ai_security_high: "AI確認: 危険度高",
  ai_security_review_unavailable: "AI確認未完了"
};

const WARNING_DETAILS: Record<string, Omit<WarningDetail, "code" | "label">> = {
  possible_secret: {
    where: "HTML本文",
    description: "APIキー・token・secret らしき文字列が含まれています。script / meta / data属性などに埋め込まれていないか確認してください。",
    action: "本物のキーなら削除・ローテーションしてから差し替えるのが安全です。"
  },
  external_form_action: {
    where: "form action 属性",
    description: "HTML内のフォームが外部URLへ送信されます。ログイン情報・メールアドレスなどを外部へ送る可能性があります。",
    action: "意図した送信先か確認し、不明なフォームは削除してください。"
  },
  external_script: {
    where: "script src 属性",
    description: "外部スクリプトを読み込みます。配信元が差し替わると、公開ページ上で任意の処理が実行される可能性があります。",
    action: "信頼できる配信元だけ残し、不要なスクリプトは削除してください。"
  },
  php_file: {
    where: "zip内ファイル名",
    description: "zip内に .php ファイルが含まれています。ギガサイト便では静的ファイルとして配信しますが、意図しないサーバー用ファイルの混入として警告しています。",
    action: "不要ならzipから除外してください。"
  },
  ai_security_medium: {
    where: "AIセキュリティレビュー",
    description: "AIレビューで注意が必要なHTMLとして判定されました。外部送信・認証情報入力・不審なスクリプトなどを確認してください。",
    action: "内容を見直し、問題ないと判断できる場合だけ続行してください。"
  },
  ai_security_high: {
    where: "AIセキュリティレビュー",
    description: "AIレビューで危険度が高いHTMLとして判定されました。認証情報収集や不審な外部通信が含まれる可能性があります。",
    action: "原則は修正推奨です。どうしても必要な場合だけ、リスクを理解して続行してください。"
  },
  ai_security_review_unavailable: {
    where: "AIセキュリティレビュー",
    description: "AIレビューが完了しませんでした。基本チェックだけで公開されるため、HTMLの中身を手動で確認してください。",
    action: "これは公開ブロックではありません。気になる場合は再試行してください。"
  }
};

export function warningSummary(warnings: string[]): string {
  return warnings.map((warning) => WARNING_MESSAGES[warning] ?? warning).join(", ");
}

export function warningDetails(warnings: string[]): WarningDetail[] {
  return warnings.map((warning) => {
    const label = WARNING_MESSAGES[warning] ?? warning;
    const detail = WARNING_DETAILS[warning];
    if (!detail) {
      return {
        code: warning,
        label,
        where: "セキュリティチェック",
        description: "未分類の警告です。HTML/zip内に想定外のリスクがないか確認してください。",
        action: "内容を確認し、問題ないと判断できる場合だけ続行してください。"
      };
    }
    return { code: warning, label, ...detail };
  });
}
