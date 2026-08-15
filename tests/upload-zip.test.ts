import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { strToU8, zipSync } from "fflate";
import { prepareFile } from "../src/client/admin/upload";

function decodeBase64(value: string): string {
  return new TextDecoder().decode(Uint8Array.from(atob(value), (char) => char.charCodeAt(0)));
}

describe("zip upload preparation", () => {
  it("expands a zipped static site, strips the common root, and keeps index.html as the entry", async () => {
    const zipBytes = zipSync({
      "site/index.html": strToU8("<!doctype html><html><head><link rel=\"stylesheet\" href=\"assets/app.css\"></head><body>Zip OK</body></html>"),
      "site/assets/app.css": strToU8("body { color: #123456; }"),
      "site/.DS_Store": strToU8("ignored"),
      "__MACOSX/._index.html": strToU8("ignored")
    });

    const file = new File([zipBytes], "site.zip", { type: "application/zip" });
    const payload = await prepareFile(file);

    expect(payload.kind).toBe("files");
    if (payload.kind !== "files") throw new Error("expected files payload");

    expect(payload.entryPath).toBe("index.html");
    expect(payload.files.map((item) => item.path).sort()).toEqual(["assets/app.css", "index.html"]);
    expect(payload.files.find((item) => item.path === "assets/app.css")?.contentType).toBe("text/css; charset=utf-8");
    expect(decodeBase64(payload.files.find((item) => item.path === "index.html")!.content)).toContain("Zip OK");
  });

  it("rejects zip files that do not contain an index.html entry", async () => {
    const zipBytes = zipSync({
      "site/about.html": strToU8("<!doctype html><html><body>About only</body></html>")
    });

    await expect(prepareFile(new File([zipBytes], "missing-index.zip", { type: "application/zip" }))).rejects.toThrow("zip_index_html_required");
  });

  it("preserves a root index.html and assigns stable content types to common assets", async () => {
    const zipBytes = zipSync({
      "index.html": strToU8("<!doctype html><html><body>Root entry</body></html>"),
      "site/assets/app.js": strToU8("console.log('nested asset');"),
      "site/assets/logo.svg": strToU8("<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>"),
      "site/assets/font.woff2": strToU8("font")
    });

    const payload = await prepareFile(new File([zipBytes], "root-index.zip", { type: "application/zip" }));

    expect(payload.kind).toBe("files");
    if (payload.kind !== "files") throw new Error("expected files payload");
    expect(payload.entryPath).toBe("index.html");
    expect(payload.files.map((item) => item.path).sort()).toEqual(["index.html", "site/assets/app.js", "site/assets/font.woff2", "site/assets/logo.svg"]);
    expect(payload.files.find((item) => item.path === "site/assets/app.js")?.contentType).toBe("text/javascript; charset=utf-8");
    expect(payload.files.find((item) => item.path === "site/assets/logo.svg")?.contentType).toBe("image/svg+xml");
    expect(payload.files.find((item) => item.path === "site/assets/font.woff2")?.contentType).toBe("font/woff2");
  });

  it("normalizes Windows-style zip paths before choosing the entry file", async () => {
    const zipBytes = zipSync({
      "site\\index.html": strToU8("<!doctype html><html><body>Windows zip</body></html>"),
      "site\\assets\\app.css": strToU8("body { color: rebeccapurple; }")
    });

    const payload = await prepareFile(new File([zipBytes], "windows.zip", { type: "application/zip" }));

    expect(payload.kind).toBe("files");
    if (payload.kind !== "files") throw new Error("expected files payload");
    expect(payload.entryPath).toBe("index.html");
    expect(payload.files.map((item) => item.path).sort()).toEqual(["assets/app.css", "index.html"]);
  });

  it("keeps the visible dropzone backed by real drag-and-drop handlers", () => {
    const source = readFileSync("src/client/admin/screens/UploadScreen.tsx", "utf8");
    const css = readFileSync("src/client/styles/app.css", "utf8");

    expect(source).toContain('accept=".html,.htm,.zip,text/html,application/zip"');
    expect(source).toContain("onDragEnter={handleDropzoneDragEnter}");
    expect(source).toContain("onDragOver={handleDropzoneDragOver}");
    expect(source).toContain("onDrop={handleDropzoneDrop}");
    expect(source).toContain("event.dataTransfer.files?.[0]");
    expect(source).toContain("is-drag-active");
    expect(css).toMatch(/\.gs-dropzone\.is-drag-active\s*\{/);
  });
});
