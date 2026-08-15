import { describe, expect, it } from "vitest";
import {
  formatSiteLimit,
  FREE_PLAN_PUBLISH_DAYS,
  planFeatureRank,
  planSiteLimit,
  FORM_SUBMISSIONS_MIN_PLAN_LABEL,
  FORM_SUBMISSIONS_MIN_RANK,
  REVIEW_COMMENTS_MIN_PLAN_LABEL,
  REVIEW_COMMENTS_MIN_RANK,
  REVISION_HISTORY_MIN_PLAN_LABEL,
  REVISION_HISTORY_MIN_RANK
} from "../src/shared/plans";

describe("plan limits", () => {
  it("keeps the free plan expiry and site limit contract explicit", () => {
    expect(FREE_PLAN_PUBLISH_DAYS).toBe(7);
    expect(planSiteLimit(null)).toBe(1);
    expect(planSiteLimit(undefined)).toBe(1);
    expect(planSiteLimit("unknown_plan")).toBe(1);
    expect(planSiteLimit("free")).toBe(1);
  });

  it("gives Pro unlimited publishing and grandfathers legacy paid plans to unlimited", () => {
    expect(planSiteLimit("pro")).toBeNull();
    expect(planSiteLimit("single_site")).toBe(1);
    expect(planSiteLimit("personal_pro")).toBeNull();
    expect(planSiteLimit("team")).toBeNull();
    expect(planSiteLimit("business")).toBeNull();
    expect(planSiteLimit("agency")).toBeNull();
  });

  it("formats finite and unlimited limits for UI copy", () => {
    expect(formatSiteLimit(200)).toBe("200");
    expect(formatSiteLimit(null)).toBe("無制限");
  });

  it("spec: 機能解放ランクは単発購入ではなく継続課金(Pro)だけで上がる", () => {
    // 仕様: single_siteは1サイト買い切り枠であり、Pro機能の権限にはならない。
    expect(planFeatureRank(null)).toBe(0);
    expect(planFeatureRank("free")).toBe(0);
    expect(planFeatureRank("single_site")).toBe(0);
    expect(planFeatureRank("unknown_plan")).toBe(0);
    expect(planFeatureRank("pro")).toBe(1);
    // 旧有料プランはグランドファザリングでPro相当(rank 1)。
    expect(planFeatureRank("personal_pro")).toBe(1);
    expect(planFeatureRank("team")).toBe(1);
    expect(planFeatureRank("business")).toBe(1);
    expect(planFeatureRank("agency")).toBe(1);
  });

  it("spec: 全ての有料機能はProで解放され、UI/APIの文言をProに固定する", () => {
    // 仕様: ここがズレると料金表・API gate・管理画面の説明が食い違うため、単一の契約として固定する。
    expect(REVISION_HISTORY_MIN_RANK).toBe(planFeatureRank("pro"));
    expect(REVISION_HISTORY_MIN_PLAN_LABEL).toBe("Pro");
    expect(REVIEW_COMMENTS_MIN_RANK).toBe(planFeatureRank("pro"));
    expect(REVIEW_COMMENTS_MIN_PLAN_LABEL).toBe("Pro");
    expect(FORM_SUBMISSIONS_MIN_RANK).toBe(planFeatureRank("pro"));
    expect(FORM_SUBMISSIONS_MIN_PLAN_LABEL).toBe("Pro");
  });
});
