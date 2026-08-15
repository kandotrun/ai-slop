import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(path, out);
    } else {
      out.push(path);
    }
  }
  return out;
}

describe("repository hygiene for deployable admin UI", () => {
  it("does not load Google Fonts from committed HTML shells", () => {
    const offenders = walk(".")
      .filter((file) => file.endsWith(".html"))
      .filter((file) => {
        const html = readFileSync(file, "utf8");
        return html.includes("fonts.googleapis.com") || html.includes("fonts.gstatic.com");
      })
      .map((file) => relative(".", file));

    expect(offenders).toEqual([]);
  });

  it("does not commit local Serena agent state", () => {
    expect(existsSync(".serena")).toBe(false);
  });

  it("does not commit private publication artifacts", () => {
    for (const relativePath of [
      "VISION.md",
      "NEXT_STEPS.md",
      "docs/strategy",
      "docs/product",
      "docs/plans",
      "docs/superpowers",
      "docs/marketing",
      "reports",
      "ui-mock",
      "wrangler.jsonc",
      ".github/workflows/seo-experiment-report.yml",
      "scripts/seo-experiment-report.mjs"
    ]) {
      expect(existsSync(relativePath), relativePath).toBe(false);
    }
  });

  it("ships only a placeholder Wrangler configuration", () => {
    const example = readFileSync("wrangler.example.jsonc", "utf8");
    expect(example).not.toContain('"account_id"');
    expect(example).toContain('"database_id": "00000000-0000-0000-0000-000000000000"');
    expect(example).not.toContain('"routes"');
  });
});
