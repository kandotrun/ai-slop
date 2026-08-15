import { describe, expect, it } from "vitest";
import {
  contentTypeFromPath,
  normalizeR2Path,
  redactLikelySecretsForReview,
  scanHtmlForWarnings,
  scanPathForWarnings,
  validateUploadedHtml
} from "../src/shared/security";

describe("security hardening boundary contracts", () => {
  it("validates doctype-only HTML documents and reports byte length", () => {
    const html = "<!doctype html><title>確認</title>";
    const result = validateUploadedHtml(html, 1024);

    expect(result).toEqual({ ok: true, byteLength: new TextEncoder().encode(html).byteLength });
  });

  it("rejects whitespace-only uploads as empty HTML", () => {
    expect(validateUploadedHtml("  \n\t ", 1024)).toMatchObject({ ok: false, error: "empty_html" });
  });

  it("rejects content that has no HTML marker", () => {
    expect(validateUploadedHtml("plain text only", 1024)).toMatchObject({ ok: false, error: "missing_html_marker" });
  });

  it("enforces the configured byte limit with multibyte content", () => {
    const html = "<!doctype html><html><body>確認</body></html>";
    const byteLength = new TextEncoder().encode(html).byteLength;

    expect(validateUploadedHtml(html, byteLength)).toMatchObject({ ok: true, byteLength });
    expect(validateUploadedHtml(html, byteLength - 1)).toMatchObject({ ok: false, error: "html_too_large", byteLength });
  });

  it("deduplicates multiple warning types from the same HTML", () => {
    const warnings = scanHtmlForWarnings(`
      <html><body>
        <form action="https://attacker.example/pay"></form>
        <form action="https://attacker.example/again"></form>
        <script src="https://cdn.example/app.js"></script>
        <script src="http://cdn.example/old.js"></script>
        <script>const token = "abcdefghijklmnopqrstuvwxyz123456";</script>
      </body></html>
    `);

    expect(warnings.sort()).toEqual(["external_form_action", "external_script", "possible_secret"].sort());
  });

  it("does not warn for relative forms or relative scripts", () => {
    const warnings = scanHtmlForWarnings('<html><body><form action="/send"></form><script src="/app.js"></script></body></html>');

    expect(warnings).toEqual([]);
  });

  it("detects common cloud and provider secret shapes", () => {
    const openai = ["sk", "test".repeat(12)].join("-");
    const aws = ["AKIA", "EXAMPLE".padEnd(16, "0")].join("");
    const google = ["AIza", "example".repeat(6)].join("");
    const html = `
      <html><body>
        <script>
          const openai = "${openai}";
          const aws = "${aws}";
          const google = "${google}";
        </script>
      </body></html>
    `;

    expect(scanHtmlForWarnings(html)).toContain("possible_secret");
  });

  it("redacts likely secrets before AI review", () => {
    const firstValue = ["abcdefghijklm", "nopqrstuvwxyz", "123456"].join("");
    const secondValue = ["zyxwvutsrqpon", "mlkjihgfedcba", "654321"].join("");
    const source = `const secret = "${firstValue}"; const token = "${secondValue}";`;
    const redacted = redactLikelySecretsForReview(source);

    expect(redacted).not.toContain(firstValue);
    expect(redacted).not.toContain(secondValue);
    expect(redacted.match(/\[REDACTED_POSSIBLE_SECRET\]/g)?.length).toBe(2);
  });

  it("flags PHP files case-insensitively", () => {
    expect(scanPathForWarnings("index.php")).toEqual(["php_file"]);
    expect(scanPathForWarnings("UPLOAD.PHP")).toEqual(["php_file"]);
    expect(scanPathForWarnings("index.html")).toEqual([]);
  });

  it("normalizes empty and root preview paths to index.html", () => {
    expect(normalizeR2Path("")).toBe("index.html");
    expect(normalizeR2Path("/")).toBe("index.html");
    expect(normalizeR2Path("///")).toBe("index.html");
  });

  it("removes only leading slashes from safe asset paths", () => {
    expect(normalizeR2Path("/assets/app.css")).toBe("assets/app.css");
    expect(normalizeR2Path("///images/logo.png")).toBe("images/logo.png");
  });

  it("rejects path traversal, empty path segments, and backslashes", () => {
    expect(normalizeR2Path("../secret.txt")).toBeNull();
    expect(normalizeR2Path("assets/../secret.txt")).toBeNull();
    expect(normalizeR2Path("assets//logo.png")).toBeNull();
    expect(normalizeR2Path("assets\\logo.png")).toBeNull();
  });

  it("maps known web asset extensions to safe content types", () => {
    expect(contentTypeFromPath("index.HTML")).toBe("text/html; charset=utf-8");
    expect(contentTypeFromPath("style.css")).toBe("text/css; charset=utf-8");
    expect(contentTypeFromPath("app.mjs")).toBe("text/javascript; charset=utf-8");
    expect(contentTypeFromPath("data.json")).toBe("application/json; charset=utf-8");
    expect(contentTypeFromPath("logo.svg")).toBe("image/svg+xml");
  });

  it("maps image and font extensions without falling back to octet-stream", () => {
    expect(contentTypeFromPath("photo.jpeg")).toBe("image/jpeg");
    expect(contentTypeFromPath("hero.webp")).toBe("image/webp");
    expect(contentTypeFromPath("icon.ico")).toBe("image/x-icon");
    expect(contentTypeFromPath("font.woff2")).toBe("font/woff2");
    expect(contentTypeFromPath("font.ttf")).toBe("font/ttf");
  });

  it("falls back to octet-stream for unknown file types", () => {
    expect(contentTypeFromPath("download.bin")).toBe("application/octet-stream");
  });
});
