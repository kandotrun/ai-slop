import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("retro-cute UI design system (Shadcn x Bootstrap 2)", () => {
  it("uses indigo as the forge primary/accent with retro primitives", () => {
    const tokens = readFileSync("src/client/styles/tokens.css", "utf8");
    expect(tokens).not.toMatch(/--primary:\s*oklch\(0 0 0\)/);
    expect(tokens).toMatch(/--primary:\s*oklch\(0\.5/);
    expect(tokens).toContain("--ac: var(--primary)");
    expect(tokens).toContain("--bevel-top:");
    expect(tokens).toContain("--inset-well:");
  });

  it("applies the Bootstrap-2 flavored treatment to forge components", () => {
    const css = readFileSync("src/client/styles/app.css", "utf8");
    expect(css).toMatch(/\.ds-card\s*\{[^}]*--shadow-card/s);
    expect(css).toMatch(/\.ds-card__head\s*\{[^}]*linear-gradient/s);
    expect(css).toMatch(/\.ds-card__head\s*\{[^}]*border-top-left-radius:\s*calc\(var\(--radius-xl\) - 1px\)/s);
    expect(css).toMatch(/\.ds-card__head\s*\{[^}]*border-top-right-radius:\s*calc\(var\(--radius-xl\) - 1px\)/s);
    expect(css).toMatch(/\.gs-row:nth-child\(even\)/);
    expect(css).toContain(".gs-well");
  });

  it("gives LP cards a bevel highlight and inputs an accent focus glow", () => {
    const lp = readFileSync("src/client/styles.css", "utf8");
    expect(lp).toMatch(/\.lp-support-card\s*\{[^}]*rgba\(255, 255, 255, 0\.7\)/s);
    expect(lp).toMatch(/input:not\(\.forge \*\):focus[\s\S]*--lp-accent/);
  });
});
