import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { randomSubdomain } from "../src/client/admin/format";

describe("random subdomain dice generator", () => {
  it("generates a slug-valid cute subdomain", () => {
    for (let i = 0; i < 50; i++) {
      const s = randomSubdomain();
      expect(s).toMatch(/^[a-z]+-[a-z]+-[a-f0-9]{24}$/);
      expect(s.length).toBeLessThanOrEqual(40);
    }
  });

  it("uses browser cryptographic randomness instead of Math.random", () => {
    const src = readFileSync("src/client/admin/format.ts", "utf8");
    expect(src).toContain("crypto.getRandomValues");
    expect(src).not.toContain("Math.random");
  });

  it("wires the dice generator into the upload URL field", () => {
    const src = readFileSync("src/client/admin/screens/UploadScreen.tsx", "utf8");
    expect(src).toContain("randomSubdomain()");
    expect(src).toContain("<DiceIcon");
    expect(src).toContain("ランダムなURLを生成");
  });

  it("renders the toast close button as a circle", () => {
    const css = readFileSync("src/client/styles/app.css", "utf8");
    expect(css).toMatch(/\.gs-sonner-close\s*\{[^}]*border-radius:\s*50%/s);
  });
});
