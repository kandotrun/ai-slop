import { Button } from "../../ui/Button";
import { ShieldCheckIcon } from "../../ui/icons";

interface PlanUpgradeNoticeProps {
  feature: string;
  planLabel: string;
}

export function PlanUpgradeNotice({ feature, planLabel }: PlanUpgradeNoticeProps) {
  return (
    <div className="ds-card">
      <div className="ds-card__body" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "48px 24px", textAlign: "center" }}>
        <span
          style={{
            display: "inline-grid",
            placeContent: "center",
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "color-mix(in oklab, var(--ac) 14%, var(--background))",
            color: "var(--ac)"
          }}
        >
          <ShieldCheckIcon size={22} />
        </span>
        <div>
          <h3 style={{ fontSize: 17, margin: 0 }}>{feature}は{planLabel}以上のプラン機能です</h3>
          <p className="gs-muted" style={{ fontSize: 13.5, lineHeight: 1.6, margin: "8px auto 0", maxWidth: 420 }}>
            {planLabel}以上のプランにアップグレードすると、{feature}をご利用いただけます。
          </p>
        </div>
        <a href="/app/billing">
          <Button>プランを見る</Button>
        </a>
      </div>
    </div>
  );
}
