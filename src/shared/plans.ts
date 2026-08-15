// Single source of truth for how many sites each plan can publish.
// `null` means unlimited. A null/unknown planId is treated as the free plan.
//
// Plans were simplified to just Free and Pro. Legacy plan ids (single_site / personal_pro /
// team / business / agency) are kept here only so existing (grandfathered) subscribers keep
// full access; they are no longer offered for new checkout (see STRIPE_PLANS `offerable`).

export const FREE_PLAN_PUBLISH_DAYS = 7;

export const PLAN_SITE_LIMITS: Record<string, number | null> = {
  free: 1,
  pro: null,
  // Legacy (grandfathered) — every recurring paid plan now maps to the Pro tier (unlimited).
  single_site: 1,
  personal_pro: null,
  team: null,
  business: null,
  agency: null
};

export function planSiteLimit(planId: string | null | undefined): number | null {
  if (!planId) return PLAN_SITE_LIMITS.free;
  return planId in PLAN_SITE_LIMITS ? PLAN_SITE_LIMITS[planId] : PLAN_SITE_LIMITS.free;
}

export function formatSiteLimit(limit: number | null): string {
  return limit === null ? "無制限" : String(limit);
}

// Feature gating by subscription tier. Only recurring subscription plans count toward
// feature access (free and the legacy single-site one-time purchase are rank 0).
// Pro unlocks every feature; legacy paid plans are grandfathered to the same rank.
export const PLAN_FEATURE_RANK: Record<string, number> = {
  pro: 1,
  personal_pro: 1,
  team: 1,
  business: 1,
  agency: 1
};

export function planFeatureRank(planId: string | null | undefined): number {
  return planId && planId in PLAN_FEATURE_RANK ? PLAN_FEATURE_RANK[planId] : 0;
}

// Every paid (Pro) feature now shares one tier: any active Pro subscription unlocks all of them.
export const PRO_PLAN_LABEL = "Pro";
export const REVISION_HISTORY_MIN_RANK = PLAN_FEATURE_RANK.pro;
export const REVIEW_COMMENTS_MIN_RANK = PLAN_FEATURE_RANK.pro;
export const FORM_SUBMISSIONS_MIN_RANK = PLAN_FEATURE_RANK.pro;
export const HIDE_BRANDING_MIN_RANK = PLAN_FEATURE_RANK.pro;
export const REVISION_HISTORY_MIN_PLAN_LABEL = PRO_PLAN_LABEL;
export const REVIEW_COMMENTS_MIN_PLAN_LABEL = PRO_PLAN_LABEL;
export const FORM_SUBMISSIONS_MIN_PLAN_LABEL = PRO_PLAN_LABEL;
export const HIDE_BRANDING_MIN_PLAN_LABEL = PRO_PLAN_LABEL;
