import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function pngDimensions(path: string): { width: number; height: number } {
  const png = readFileSync(path);
  expect(png.toString("ascii", 1, 4)).toBe("PNG");
  return {
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20)
  };
}

describe("OGP image", () => {
  it("uses the original full-bleed brand layout without the card frame or logo chrome", () => {
    const preview = readFileSync("docs/design/og-image.html", "utf8");

    expect(preview).toContain("ギガサイト便");
    // brand wordmark uses the real logo font
    expect(preview).toContain("Yuji Syuku GigaSite");
    // no outer card frame, no favicon-style logo icon, no giga-site.com under the logo
    expect(preview).not.toContain('class="frame"');
    expect(preview).not.toContain("brand-logo");
    expect(preview).not.toContain("brand-host");
  });

  it("keeps the public OGP image at the required large-card dimensions", () => {
    expect(pngDimensions("public/og-image.png")).toEqual({ width: 1200, height: 630 });
  });
});
