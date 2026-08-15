import { describe, expect, it } from "vitest";
import { scanHtmlForWarnings, validateUploadedHtml } from "../src/shared/security";

describe("uploaded HTML validation", () => {
  it("accepts a normal HTML document under the configured byte limit", () => {
    const result = validateUploadedHtml("<!doctype html><html><body>Hello</body></html>", 1024);

    expect(result.ok).toBe(true);
    expect(result.byteLength).toBeGreaterThan(0);
  });

  it("rejects empty and oversized HTML", () => {
    expect(validateUploadedHtml("", 1024).ok).toBe(false);
    expect(validateUploadedHtml("x".repeat(20), 10).ok).toBe(false);
  });

  it("warns when obvious secrets or external forms are present", () => {
    const warnings = scanHtmlForWarnings(`
      <html><body>
        <form action="https://example.com/pay"></form>
        <script>const apiKey = "redacted-test-value-only";</script>
      </body></html>
    `);

    expect(warnings).toContain("possible_secret");
    expect(warnings).toContain("external_form_action");
  });
});
