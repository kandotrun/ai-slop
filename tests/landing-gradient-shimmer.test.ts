import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LandingPage } from "../src/client/LandingPage";
import { renderStaticLandingHtmlForPathname } from "../src/shared/landing-static";

describe("landing gradient shimmer", () => {
  it("uses a gradient shimmer accent on the hero headline in React and static crawler HTML", () => {
    const reactHtml = renderToStaticMarkup(createElement(LandingPage));
    const staticHtml = renderStaticLandingHtmlForPathname("/") ?? "";

    for (const html of [reactHtml, staticHtml]) {
      expect(html).toContain("lp-gradient-shimmer");
      expect(html).toContain("AIで作ったHTMLを");
      expect(html).toContain("3秒で共有URLに。");
    }
  });

  it("keeps the shimmer CSS accessible and motion-safe", () => {
    const css = readFileSync("src/client/styles.css", "utf8");

    expect(css).toContain(".lp-gradient-shimmer");
    expect(css).toContain("@keyframes lp-gradient-shimmer");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain("-webkit-text-fill-color: transparent");
    expect(css).toContain("background-clip: text");
  });

  it("uses a duplicated gradient tile so the loop end matches the start", () => {
    const css = readFileSync("src/client/styles.css", "utf8");

    expect(css).toContain("background-size: 200% 100%");
    expect(css).toContain("#0b0b14 0%");
    expect(css).toContain("#0b0b14 50%");
    expect(css).toContain("#14b8a6 12%");
    expect(css).toContain("#14b8a6 62%");
    expect(css).toContain("#60a5fa 18%");
    expect(css).toContain("#60a5fa 68%");
    expect(css).toContain("#c084fc 24%");
    expect(css).toContain("#c084fc 74%");
    expect(css).toContain("#fb7185 30%");
    expect(css).toContain("#fb7185 80%");
    expect(css).toContain("#f59e0b 36%");
    expect(css).toContain("#f59e0b 86%");
  });
});
