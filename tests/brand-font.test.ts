import { existsSync, readFileSync, statSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BrandName } from "../src/client/BrandName";
import { ContactPage } from "../src/client/ContactPage";
import { FeatureName } from "../src/client/FeatureName";
import { LandingPage } from "../src/client/LandingPage";
import { LegalPage } from "../src/client/LegalPage";
import { FORM_FEATURE_NAME } from "../src/shared/form-feature";

describe("Yuji Syuku brand font", () => {
  it("self-hosts a subset woff2 font for the service name and named feature", () => {
    const css = readFileSync("src/client/styles.css", "utf8");
    const fontPath = "src/client/fonts/YujiSyuku-GigaSiteBrand.woff2";

    expect(css).toContain("font-family: \"Yuji Syuku GigaSite\"");
    expect(css).toContain("YujiSyuku-GigaSiteBrand.woff2");
    expect(css).toContain("format(\"woff2\")");
    expect(existsSync(fontPath)).toBe(true);
    expect(statSync(fontPath).size).toBeLessThan(20_000);
  });

  it("wraps public service and feature names with the brand font class", () => {
    expect(renderToStaticMarkup(createElement(BrandName))).toBe('<span class="giga-brand">ギガサイト便</span>');
    expect(renderToStaticMarkup(createElement(FeatureName))).toBe(`<span class="giga-brand">${FORM_FEATURE_NAME}</span>`);

    const landing = renderToStaticMarkup(createElement(LandingPage));
    expect(landing).toContain('<a href="#top" class="lp-brand"><span class="giga-brand">ギガサイト便</span></a>');
    expect(landing).toContain('このサイトのリンクを<span class="giga-brand">ギガサイト便</span>にセットアップ');
    expect(landing).toContain(`<span class="giga-brand">${FORM_FEATURE_NAME}</span>で、HTMLを<br/>「見せる」から「受け取る」へ。`);

    const contact = renderToStaticMarkup(createElement(ContactPage));
    expect(contact).toContain('<a href="/" class="lp-brand"><span class="giga-brand">ギガサイト便</span></a>');

    const terms = renderToStaticMarkup(createElement(LegalPage, { path: "/terms" }));
    expect(terms).toContain('本利用規約は、<span class="giga-brand">ギガサイト便</span>');
  });

  it("uses the brand SVG in README and exposes an SVG favicon", () => {
    const readme = readFileSync("README.md", "utf8");
    const index = readFileSync("index.html", "utf8");
    const logoSvg = readFileSync("public/ギガサイト便.svg", "utf8");
    const faviconSvg = readFileSync("public/favicon.svg", "utf8");

    expect(readme).toContain('<img src="./public/ギガサイト便.svg" alt="ギガサイト便"');
    expect(index).toContain('<link rel="icon" type="image/svg+xml" href="/favicon.svg" />');
    expect(existsSync("public/#U30ae#U30ac#U30b5#U30a4#U30c8#U4fbf.svg")).toBe(false);
    expect(logoSvg).toMatch(/^<svg\b/);
    expect(logoSvg).toContain('width="1165"');
    expect(logoSvg).not.toMatch(/<script\b|onload=|onerror=|javascript:/i);
    expect(faviconSvg).toMatch(/^<svg\b/);
    expect(faviconSvg).toContain('width="417"');
    expect(faviconSvg).not.toMatch(/<script\b|onload=|onerror=|javascript:/i);
  });
});
