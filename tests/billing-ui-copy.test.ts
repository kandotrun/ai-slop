import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  billingPeriodLabel,
  billingPlanAction,
  billingStatusBadge,
  billingStatusNotice,
  shouldShowPlanTrialBadge,
  visibleBillingPlans
} from "../src/client/admin/screens/BillingScreen";
import { errorMessageJa } from "../src/client/admin/errors";
import type { BillingPlanSummary, BillingSubscriptionSummary } from "../src/shared/types";

const billingPlans: BillingPlanSummary[] = [
  { id: "single_site", label: "1サイト公開", unitAmount: 150, currency: "jpy", interval: "site", checkoutMode: "payment" },
  { id: "personal_pro", label: "個人 Pro", unitAmount: 980, currency: "jpy", interval: "month", checkoutMode: "subscription" },
  { id: "team", label: "Team", unitAmount: 4980, currency: "jpy", interval: "month", checkoutMode: "subscription", trialPeriodDays: 14 },
  { id: "business", label: "Business", unitAmount: 19800, currency: "jpy", interval: "month", checkoutMode: "subscription" },
  { id: "agency", label: "Agency", unitAmount: 49800, currency: "jpy", interval: "month", checkoutMode: "subscription" }
];

const baseSubscription: BillingSubscriptionSummary = {
  planId: "business",
  planLabel: "Business",
  status: "active",
  currentPeriodEnd: "2026-07-20T00:00:00.000Z",
  cancelAtPeriodEnd: false,
  unusedSitePurchases: 0,
  billingPortalAvailable: true
};

describe("billing UI copy and errors", () => {
  it("spec: Pro契約中はProカードを「利用中」として無効化する", () => {
    // プランはFreeとProのみ。Pro契約中はProカードが有効CTAにならない。
    const proPlans: BillingPlanSummary[] = [
      { id: "pro", label: "Pro", unitAmount: 980, currency: "jpy", interval: "month", checkoutMode: "subscription" }
    ];
    expect(visibleBillingPlans(proPlans, "pro").map((plan) => plan.id)).toEqual(["pro"]);

    const proAction = billingPlanAction(proPlans[0]!, "pro", "Pro");
    expect(proAction).toEqual({ label: "利用中", variant: "secondary", disabled: true });
    expect(shouldShowPlanTrialBadge(proPlans[0]!, "pro")).toBe(false);
  });

  it("spec: 旧有料プラン契約中はPro相当としてProカードを重複購入させない", () => {
    const proPlan: BillingPlanSummary = { id: "pro", label: "Pro", unitAmount: 980, currency: "jpy", interval: "month", checkoutMode: "subscription" };

    expect(billingPlanAction(proPlan, "team", "Team")).toEqual({ label: "Teamに含まれます", variant: "secondary", disabled: true });
    expect(shouldShowPlanTrialBadge(proPlan, "team")).toBe(false);
  });

  it("spec: 未契約時は1サイト買い切りとTeam無料トライアルを選択肢として出す", () => {
    // 無料ユーザーには単発購入とTeamトライアルが有効な入口になる。
    expect(visibleBillingPlans(billingPlans, null).map((plan) => plan.id)).toContain("single_site");
    expect(billingPlanAction(billingPlans[0]!, null, null)).toMatchObject({ label: "1サイト分を購入", disabled: false });
    expect(billingPlanAction(billingPlans[2]!, null, null)).toMatchObject({ label: "14日間無料で試す", disabled: false });
    expect(shouldShowPlanTrialBadge(billingPlans[2]!, null)).toBe(true);
  });

  it("does not give Business a different upgrade CTA from other selectable subscriptions", () => {
    const source = readFileSync("src/client/admin/screens/BillingScreen.tsx", "utf8");

    expect(source).not.toContain('plan.id === "business"');
    expect(source).not.toContain('label: "アップグレード"');
    expect(source).toContain('label: "選択"');
  });

  it("shows a specific message when Stripe live charges are disabled", () => {
    expect(errorMessageJa("stripe_live_charges_disabled")).toBe(
      "Stripe本番決済がまだ有効化されていないため、決済ページを開けません。Stripe Dashboardで本人確認・審査を完了してから再度お試しください。"
    );
  });

  it("keeps paid plan buttons disabled with a preparation tooltip", () => {
    const source = readFileSync("src/client/admin/screens/BillingScreen.tsx", "utf8");

    expect(source).toContain("paidCheckout.enabled");
    expect(source).toContain("data-tooltip={disabledTooltip}");
    expect(source).toContain("isPaidCheckoutPreparing");
    expect(errorMessageJa("paid_checkout_preparing")).toBe(
      "有料プランは現在準備中です。Stripeの本番決済が有効化された後に利用できます。"
    );
  });

  it("spec: Stripe契約中はCustomer Portalで解約でき、手動契約では問い合わせ導線を出す", () => {
    const source = readFileSync("src/client/admin/screens/BillingScreen.tsx", "utf8");

    expect(source).toContain("プラン変更・解約");
    expect(source).toContain("api.billingPortal");
    expect(source).toContain("Stripe経由ではない契約のため");
    expect(source).toContain("/contact?type=billing");
    expect(errorMessageJa("billing_portal_unavailable")).toContain("Stripe経由ではない");
  });

  it("spec: Businessプランのコピーは実装済み機能だけを売る", () => {
    // 未実装のGoogle OAuth / 独自ドメイン / 監査ログを料金表で約束しない。
    const sources = [
      "src/client/admin/screens/BillingScreen.tsx",
      "src/client/LandingPage.tsx",
      "src/shared/landing-static.ts"
    ].map((path) => readFileSync(path, "utf8")).join("\n");

    expect(sources).not.toContain("Googleログイン");
    expect(sources).not.toContain("Google ログイン");
    expect(sources).not.toContain("独自サブドメイン");
    expect(sources).not.toContain("監査ログ");
    expect(sources).toContain("サイト上限拡張");
    expect(sources).toContain("フォーム便・アクセスログ");
  });

  it("spec: 解約予約中は次回請求日ではなく利用終了予定日として表示する", () => {
    const subscription = { ...baseSubscription, cancelAtPeriodEnd: true };

    expect(billingStatusBadge(subscription)).toBe("解約予定");
    expect(billingPeriodLabel(subscription)).toBe("利用終了予定日");
    expect(billingStatusNotice(subscription)).toMatchObject({
      tone: "warning",
      title: "解約予定です",
      body: "このプランは契約期間の終了日まで利用できます。継続や再開はプラン変更・解約から確認してください。"
    });
  });

  it("spec: 支払い失敗・未払い状態は復旧導線付きで明示する", () => {
    const pastDue = { ...baseSubscription, status: "past_due", cancelAtPeriodEnd: false };
    const unpaid = { ...baseSubscription, status: "unpaid", cancelAtPeriodEnd: false };

    expect(billingStatusBadge(pastDue)).toBe("支払い要確認");
    expect(billingStatusBadge(unpaid)).toBe("支払い要確認");
    expect(billingStatusNotice(pastDue)).toMatchObject({
      tone: "danger",
      title: "お支払いを確認できません",
      body: "カードの有効期限や残高をご確認ください。Stripe Customer Portalから支払い方法を更新できます。"
    });
  });
});
