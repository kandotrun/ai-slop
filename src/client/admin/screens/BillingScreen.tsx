import { useEffect, useState } from "react";
import type {
  BillingInvoiceSummary,
  BillingPaymentMethodSummary,
  BillingPlanSummary,
  BillingSubscriptionSummary
} from "../../../shared/types";
import { PAID_CHECKOUT_PREPARING_TOOLTIP } from "../../../shared/billing-flags";
import { planSiteLimit, formatSiteLimit, planFeatureRank } from "../../../shared/plans";
import { api } from "../api";
import { formatBytes, formatDate, formatNumber, formatYen } from "../format";
import { Button } from "../../ui/Button";
import { CheckIcon, ClockIcon, CreditCardIcon } from "../../ui/icons";

interface BillingScreenProps {
  siteCount: number;
  storageBytes: number;
  setStatus: (message: string) => void;
  onError: (raw: string) => void;
}

const PLAN_META: Record<string, { tagline: string; features: string[] }> = {
  pro: { tagline: "全機能を、サイト数無制限で", features: ["サイト公開数 無制限", "全認証（パスワード / メール / 会社ドメイン）", "リビジョン履歴・レビューコメント・フォーム便", "ブランディング非表示・アクセスログ・期限管理"] },
  // Legacy plans kept for grandfathered subscribers' current-plan display.
  single_site: { tagline: "必要なサイトだけ1つずつ公開", features: ["旧1サイト公開枠", "追加決済済みの公開枠", "無料プランと併用"] },
  personal_pro: { tagline: "個人・小規模チーム向け", features: ["10 サイト", "パスワード認証", "30 / 90 日公開"] },
  team: { tagline: "初回14日間無料。会社ドメイン認証で社内・社外共有", features: ["50 サイト", "会社ドメイン認証・OTP", "アクセスログ・期限管理"] },
  business: { tagline: "チーム運用・サイト上限拡張", features: ["200 サイト", "会社ドメイン認証・OTP", "フォーム便・アクセスログ"] },
  agency: { tagline: "クライアント別ワークスペース", features: ["クライアント別管理", "ロゴ非表示・複数ドメイン", "優先サポート"] }
};

const STORAGE_LIMIT = 200 * 1024 * 1024;

type BillingPlanAction = { label: string; variant: "primary" | "secondary" | "outline"; disabled: boolean };
type BillingStatusNotice = { tone: "warning" | "danger"; title: string; body: string };

const PAYMENT_ATTENTION_STATUSES = new Set(["past_due", "unpaid", "incomplete", "incomplete_expired"]);

function isRecurringPlanIncludedInCurrent(plan: BillingPlanSummary, currentPlanId: string | null): boolean {
  const currentRank = planFeatureRank(currentPlanId);
  return plan.checkoutMode === "subscription" && plan.id !== currentPlanId && currentRank > 0 && currentRank >= planFeatureRank(plan.id);
}

export function visibleBillingPlans(plans: BillingPlanSummary[], currentPlanId: string | null): BillingPlanSummary[] {
  const hasRecurringPlan = planFeatureRank(currentPlanId) > 0;
  return plans.filter((plan) => !(hasRecurringPlan && plan.id === "single_site"));
}

export function shouldShowPlanTrialBadge(plan: BillingPlanSummary, currentPlanId: string | null): boolean {
  return Boolean(plan.trialPeriodDays) && plan.id !== currentPlanId && !isRecurringPlanIncludedInCurrent(plan, currentPlanId);
}

export function billingPlanAction(plan: BillingPlanSummary, currentPlanId: string | null, currentPlanLabel: string | null): BillingPlanAction {
  if (plan.checkoutMode === "subscription" && plan.id === currentPlanId) {
    return { label: "利用中", variant: "secondary", disabled: true };
  }
  if (isRecurringPlanIncludedInCurrent(plan, currentPlanId)) {
    return { label: `${currentPlanLabel ?? "現在のプラン"}に含まれます`, variant: "secondary", disabled: true };
  }
  if (plan.id === "agency") {
    return { label: "相談する", variant: "outline", disabled: false };
  }
  if (plan.id === "single_site") {
    return { label: "1サイト分を購入", variant: "primary", disabled: false };
  }
  if (plan.trialPeriodDays) {
    return { label: `${plan.trialPeriodDays}日間無料で試す`, variant: "primary", disabled: false };
  }
  return { label: "選択", variant: "outline", disabled: false };
}

export function billingStatusBadge(subscription: BillingSubscriptionSummary | null): string | null {
  if (!subscription || subscription.status === "none") return null;
  if (PAYMENT_ATTENTION_STATUSES.has(subscription.status)) return "支払い要確認";
  if (subscription.cancelAtPeriodEnd) return "解約予定";
  if (subscription.status === "trialing") return "トライアル中";
  if (subscription.status === "canceled") return "解約済み";
  return "利用中";
}

export function billingPeriodLabel(subscription: BillingSubscriptionSummary | null): string | null {
  if (!subscription?.currentPeriodEnd) return null;
  if (subscription.cancelAtPeriodEnd || subscription.status === "canceled") return "利用終了予定日";
  if (PAYMENT_ATTENTION_STATUSES.has(subscription.status)) return "支払い確認期限";
  return "次回請求日";
}

export function billingStatusNotice(subscription: BillingSubscriptionSummary | null): BillingStatusNotice | null {
  if (!subscription || subscription.status === "none") return null;
  if (PAYMENT_ATTENTION_STATUSES.has(subscription.status)) {
    return {
      tone: "danger",
      title: "お支払いを確認できません",
      body: "カードの有効期限や残高をご確認ください。Stripe Customer Portalから支払い方法を更新できます。"
    };
  }
  if (subscription.cancelAtPeriodEnd) {
    return {
      tone: "warning",
      title: "解約予定です",
      body: "このプランは契約期間の終了日まで利用できます。継続や再開はプラン変更・解約から確認してください。"
    };
  }
  return null;
}

export function BillingScreen({ siteCount, storageBytes, setStatus, onError }: BillingScreenProps) {
  const [subscription, setSubscription] = useState<BillingSubscriptionSummary | null>(null);
  const [plans, setPlans] = useState<BillingPlanSummary[]>([]);
  const [invoices, setInvoices] = useState<BillingInvoiceSummary[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<BillingPaymentMethodSummary | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [billingPortalOpening, setBillingPortalOpening] = useState(false);
  const [paidCheckout, setPaidCheckout] = useState({ enabled: false, tooltip: PAID_CHECKOUT_PREPARING_TOOLTIP });

  useEffect(() => {
    void (async () => {
      try {
        const [sub, inv, pm, stripeConfig] = await Promise.all([api.subscription(), api.invoices(), api.paymentMethod(), api.stripeConfig()]);
        setSubscription(sub.subscription);
        setPlans(sub.plans);
        setInvoices(inv.invoices);
        setPaymentMethod(pm.paymentMethod);
        setPaidCheckout({
          enabled: stripeConfig.stripe.paidCheckoutEnabled,
          tooltip: stripeConfig.stripe.paidCheckoutDisabledTooltip ?? PAID_CHECKOUT_PREPARING_TOOLTIP
        });
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "billing_load_failed");
      }
    })();
  }, [setStatus]);

  async function checkout(planId: string) {
    setCheckoutPlan(planId);
    setStatus("Stripe Checkout を作成中...");
    try {
      const result = await api.checkout(planId);
      window.location.assign(result.session.url);
    } catch (error) {
      onError(error instanceof Error ? error.message : "checkout_failed");
      setCheckoutPlan(null);
    }
  }

  async function openBillingPortal() {
    setBillingPortalOpening(true);
    setStatus("Stripe Customer Portal を作成中...");
    try {
      const result = await api.billingPortal();
      window.location.assign(result.portal.url);
    } catch (error) {
      onError(error instanceof Error ? error.message : "billing_portal_failed");
      setBillingPortalOpening(false);
    }
  }

  const currentPlanId = subscription?.planId ?? null;
  const currentPlan = plans.find((plan) => plan.id === currentPlanId) ?? null;
  const siteLimit = planSiteLimit(currentPlanId);
  const sitePct = siteLimit ? Math.min(100, Math.round((siteCount / siteLimit) * 100)) : 0;
  const storagePct = Math.min(100, Math.round((storageBytes / STORAGE_LIMIT) * 100));
  const hasRecurringSubscription = Boolean(subscription && subscription.status !== "none" && currentPlanId);
  const statusBadge = billingStatusBadge(subscription);
  const periodLabel = billingPeriodLabel(subscription);
  const statusNotice = billingStatusNotice(subscription);

  return (
    <div className="gs-content" style={{ maxWidth: 1180 }}>
      <h1 className="gs-h1">課金・プラン</h1>
      <p className="gs-sub" style={{ marginBottom: 24 }}>
        現在のプランと利用状況、お支払い履歴を管理します。
      </p>

      <div className="gs-stack-mobile" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, marginBottom: 18 }}>
        <div className="gs-plan-current">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ fontSize: 18, fontWeight: 600 }}>{subscription?.planLabel ?? "フリープラン"}</span>
                {statusBadge ? (
                  <span style={{ fontSize: 12, fontWeight: 500, padding: "2px 9px", borderRadius: 999, background: statusBadge === "支払い要確認" ? "#dc2626" : "var(--ac)", color: "#fff" }}>
                    {statusBadge}
                  </span>
                ) : null}
              </div>
              <div className="gs-muted" style={{ fontSize: 13, marginTop: 4 }}>
                {currentPlan ? PLAN_META[currentPlan.id]?.tagline : "アップグレードで認証・ログ機能が使えます"}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>{currentPlan ? formatYen(currentPlan.unitAmount) : "¥0"}</span>
              <span className="gs-muted" style={{ fontSize: 13 }}> / 月</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 28, marginTop: 20, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
            <div style={{ flex: 1 }}>
              <div className="gs-usage-row">
                <span>公開サイト数</span>
                <span className="mono">
                  {siteCount} / {formatSiteLimit(siteLimit)}
                </span>
              </div>
              {siteLimit !== null ? (
                <div className="gs-meter" style={{ height: 7 }}>
                  <div className="gs-meter-fill" style={{ width: `${sitePct}%`, background: "var(--ac)" }} />
                </div>
              ) : null}
            </div>
            <div style={{ flex: 1 }}>
              <div className="gs-usage-row">
                <span>ストレージ</span>
                <span className="mono">{formatBytes(storageBytes)} / 200 MB</span>
              </div>
              <div className="gs-meter" style={{ height: 7 }}>
                <div className="gs-meter-fill" style={{ width: `${storagePct}%`, background: "var(--neutral-400)" }} />
              </div>
            </div>
          </div>
          {statusNotice ? (
            <div
              style={{
                marginTop: 16,
                padding: 12,
                borderRadius: 10,
                border: `1px solid ${statusNotice.tone === "danger" ? "rgba(220, 38, 38, 0.35)" : "rgba(245, 158, 11, 0.35)"}`,
                background: statusNotice.tone === "danger" ? "rgba(220, 38, 38, 0.08)" : "rgba(245, 158, 11, 0.1)"
              }}
            >
              <strong style={{ display: "block", fontSize: 13, marginBottom: 4 }}>{statusNotice.title}</strong>
              <span className="gs-muted" style={{ fontSize: 12, lineHeight: 1.65 }}>{statusNotice.body}</span>
            </div>
          ) : null}
        </div>

        <div className="ds-card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, marginBottom: 14 }}>お支払い方法</h3>
          {paymentMethod ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 13, border: "1px solid var(--border)", borderRadius: 10 }}>
              <CreditCardIcon size={22} />
              <div style={{ flex: 1 }}>
                <div className="gs-mono" style={{ fontSize: 13, fontWeight: 500 }}>···· {paymentMethod.last4}</div>
                <div className="gs-muted" style={{ fontSize: 12 }}>
                  有効期限 {String(paymentMethod.expMonth).padStart(2, "0")} / {String(paymentMethod.expYear).slice(-2)}
                </div>
              </div>
            </div>
          ) : (
            <div className="gs-muted" style={{ fontSize: 13, padding: 13, border: "1px dashed var(--border)", borderRadius: 10 }}>
              登録済みのカードはありません。プランを契約すると登録されます。
            </div>
          )}
          {subscription?.currentPeriodEnd && periodLabel ? (
            <div className="gs-muted" style={{ fontSize: 12, marginTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <ClockIcon size={13} />
              {periodLabel} {formatDate(subscription.currentPeriodEnd)}
            </div>
          ) : null}
          {hasRecurringSubscription ? (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
              {subscription?.billingPortalAvailable ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    style={{ width: "100%" }}
                    disabled={billingPortalOpening}
                    onClick={() => void openBillingPortal()}
                  >
                    {billingPortalOpening ? "作成中..." : "プラン変更・解約"}
                  </Button>
                  <div className="gs-muted" style={{ fontSize: 12, marginTop: 8 }}>
                    Stripe Customer Portalでカード変更、領収書確認、解約ができます。
                  </div>
                </>
              ) : (
                <>
                  <div className="gs-muted" style={{ fontSize: 12, lineHeight: 1.65 }}>
                    Stripe経由ではない契約のため、解約・変更は問い合わせから対応します。
                  </div>
                  <a href="/contact?type=billing" className="ds-btn ds-btn--sm ds-btn--outline" style={{ width: "100%", marginTop: 10 }}>
                    請求について問い合わせ
                  </a>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <h3 style={{ fontSize: 15, margin: "26px 0 14px" }}>プラン一覧</h3>
      <div className="gs-plan-grid" style={{ marginBottom: 28 }}>
        {visibleBillingPlans(plans, currentPlanId).map((plan) => {
          const isCurrent = plan.checkoutMode === "subscription" && plan.id === currentPlanId;
          const isAgency = plan.id === "agency";
          const meta = PLAN_META[plan.id];
          const priceSuffix = plan.checkoutMode === "payment" ? " / 1サイト" : isAgency ? "〜 /月" : " /月";
          const cta = billingPlanAction(plan, currentPlanId, subscription?.planLabel ?? currentPlan?.label ?? null);
          const isPaidCheckoutPreparing = !paidCheckout.enabled && !isCurrent && !cta.disabled;
          const disabledTooltip = cta.disabled && !isCurrent ? cta.label : isPaidCheckoutPreparing ? paidCheckout.tooltip : undefined;
          return (
            <div key={plan.id} className={`gs-plan${isCurrent ? " is-current" : ""}`}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{plan.label}</div>
              <div style={{ margin: "8px 0 2px" }}>
                <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>{formatYen(plan.unitAmount)}</span>
                <span className="gs-muted" style={{ fontSize: 12 }}>{priceSuffix}</span>
              </div>
              {shouldShowPlanTrialBadge(plan, currentPlanId) ? (
                <div style={{ display: "inline-flex", width: "fit-content", padding: "2px 8px", borderRadius: 999, background: "color-mix(in oklab, var(--ac) 13%, var(--background))", color: "var(--ac)", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  初回{plan.trialPeriodDays}日間無料
                </div>
              ) : null}
              <div className="gs-muted" style={{ fontSize: 12, minHeight: 32 }}>
                {meta?.tagline}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                {(meta?.features ?? []).map((feature) => (
                  <div key={feature} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5 }}>
                    <CheckIcon size={14} style={{ color: "var(--ac)", flexShrink: 0, marginTop: 2 }} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <span className="gs-tooltip-wrap" data-tooltip={disabledTooltip} title={disabledTooltip}>
                <Button
                  variant={cta.variant}
                  size="sm"
                  style={{ marginTop: 16, width: "100%" }}
                  disabled={cta.disabled || isPaidCheckoutPreparing || checkoutPlan === plan.id}
                  onClick={() =>
                    isAgency
                      ? window.location.assign("/contact")
                      : void checkout(plan.id)
                  }
                >
                  {checkoutPlan === plan.id ? "作成中..." : cta.label}
                </Button>
              </span>
            </div>
          );
        })}
      </div>

      <h3 style={{ fontSize: 15, margin: "0 0 14px" }}>お支払い履歴</h3>
      <div className="gs-table">
        <div className="gs-thead" style={{ gridTemplateColumns: "1.2fr 2fr 1fr 1fr 90px" }}>
          <span>日付</span>
          <span>内容</span>
          <span>金額</span>
          <span>状態</span>
          <span />
        </div>
        {invoices.length === 0 ? (
          <div className="gs-empty">お支払い履歴はまだありません。</div>
        ) : (
          invoices.map((invoice) => (
            <div key={invoice.id} className="gs-drow" style={{ gridTemplateColumns: "1.2fr 2fr 1fr 1fr 90px" }}>
              <span className="gs-muted gs-mono" data-label="日付" style={{ fontSize: 13 }}>{formatDate(invoice.date)}</span>
              <span data-label="内容" style={{ fontSize: 13 }}>{invoice.description}</span>
              <span className="gs-mono" data-label="金額" style={{ fontSize: 13 }}>{formatYen(invoice.amount)}</span>
              <span data-label="状態" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--success)" }}>
                <CheckIcon size={13} />
                {invoice.status === "paid" ? "支払い済み" : invoice.status}
              </span>
              <span data-label="領収書">
                {invoice.receiptUrl ? (
                  <a href={invoice.receiptUrl} target="_blank" rel="noreferrer" className="ds-btn ds-btn--sm ds-btn--ghost" style={{ fontSize: 12 }}>
                    領収書
                  </a>
                ) : null}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
