import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LandingPage } from "../src/client/LandingPage";
import { renderStaticLandingHtmlForPathname } from "../src/shared/landing-static";

describe("landing page pricing", () => {
  it("shows only the Free and Pro plans and drops the legacy single-site / team / business tiers", () => {
    const html = renderToStaticMarkup(createElement(LandingPage));

    expect(html).not.toContain("無料公開は無制限");
    expect(html).toContain("無料で1サイト公開");
    // Pro is the single paid plan.
    expect(html).toContain("¥980");
    expect(html).toContain("サイト公開数 無制限");
    // The removed legacy plans must not appear in the pricing copy.
    expect(html).not.toContain("¥150");
    expect(html).not.toContain("/1サイト");
    expect(html).not.toContain("¥4,980");
    expect(html).not.toContain("¥19,800");
    expect(html).not.toContain("導入相談");
    // Paid checkout is gated behind the "preparing" flag in SSR, so the Pro CTA is disabled.
    expect(html).toContain('data-tooltip="現在準備中"');
    expect(html).toContain("disabled");
    expect(html).not.toContain('href="/app/billing"');
  });

  it("keeps company-domain copy self-serve and not enterprise-implementation oriented", () => {
    const reactHtml = renderToStaticMarkup(createElement(LandingPage));
    const staticHtml = renderStaticLandingHtmlForPathname("/") ?? "";
    const selfServeCopy = "会社ドメイン認証なら、相手にGoogle Workspaceの管理者権限を求めずに、閲覧できる人をメールドメインで絞れます。";

    expect(reactHtml).toContain(selfServeCopy);
    expect(staticHtml).toContain(selfServeCopy);
    expect(reactHtml).not.toContain("最短1日で導入できます");
    expect(staticHtml).not.toContain("最短1日で導入できます");
  });

  it("centers the two-plan pricing layout in React, static HTML, and CSS", () => {
    const reactHtml = renderToStaticMarkup(createElement(LandingPage));
    const staticHtml = renderStaticLandingHtmlForPathname("/") ?? "";
    const css = readFileSync("src/client/styles.css", "utf8");

    expect(reactHtml).toContain('id="pricing" class="lp-section lp-pricing-section"');
    expect(staticHtml).toContain('id="pricing" class="lp-section lp-pricing-section"');
    expect(css).toContain(".lp-pricing-section .lp-plan-grid");
    expect(css).toContain("grid-template-columns: minmax(260px, 340px) minmax(300px, 400px)");
    expect(css).toContain("justify-content: center");
    expect(css).toContain("max-width: 780px");
  });
});
