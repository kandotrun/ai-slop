import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LandingPage } from "../src/client/LandingPage";
import { UploadScreen } from "../src/client/admin/screens/UploadScreen";
import { DEMO_HTML_ASSET_PATH, DEMO_HTML_DOWNLOAD_PATH, DEMO_HTML_FILE_NAME } from "../src/shared/demo-site";
import { scanHtmlForWarnings, validateUploadedHtml } from "../src/shared/security";
import worker from "../src/worker/index";

describe("demo HTML download", () => {
  it("ships a standalone demo HTML file", () => {
    const filePath = join(process.cwd(), "public", DEMO_HTML_ASSET_PATH.slice(1));
    expect(existsSync(filePath)).toBe(true);

    const html = readFileSync(filePath, "utf8");
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("ギガサイト便");
    expect(html).toContain("このHTMLをアップロード");
    expect(html).not.toContain("sk_");

    // "standalone" means no external resource loads (fonts/styles/scripts/images/CDN).
    expect(html).not.toMatch(/<link\b[^>]*\bstylesheet/i);
    expect(html).not.toMatch(/<script\b[^>]*\bsrc=/i);
    expect(html).not.toMatch(/<img\b[^>]*\bsrc=["']?https?:/i);
    expect(html).not.toMatch(/@import\b/);
    expect(html).not.toMatch(/@font-face\b/);
    expect(validateUploadedHtml(html, 1024 * 1024)).toMatchObject({ ok: true });
    expect(scanHtmlForWarnings(html)).toEqual([]);
  });

  it("links the demo HTML from the landing page", () => {
    const html = renderToStaticMarkup(createElement(LandingPage));

    expect(html).toContain(DEMO_HTML_DOWNLOAD_PATH);
    expect(html).toContain(`download="${DEMO_HTML_FILE_NAME}"`);
    expect(html).toContain("デモHTMLをダウンロード");
    expect(html).toContain("HTMLを持っていない方へ");
  });

  it("links the demo HTML from the upload screen", () => {
    const html = renderToStaticMarkup(
      createElement(UploadScreen, {
        publicOrigin: "https://giga-site.com",
        canUsePermanentExpiry: false,
        notify: {
          push: () => 0,
          loading: () => 0,
          success: () => 0,
          error: () => 0,
          dismiss: () => undefined
        },
        onPublished: () => undefined,
        onCancel: () => undefined,
        setStatus: () => undefined,
        onError: () => undefined
      })
    );

    expect(html).toContain(DEMO_HTML_DOWNLOAD_PATH);
    expect(html).toContain(`download="${DEMO_HTML_FILE_NAME}"`);
    expect(html).toContain("HTMLが手元にない場合");
  });

  it("limits expiry choices to 7 days on the free upload screen", () => {
    const source = readFileSync("src/client/admin/screens/UploadScreen.tsx", "utf8");

    expect(source).toContain("無料プランでは公開期限は7日間のみです。");
    expect(source).toContain("canUsePermanentExpiry ?");
    expect(source).toContain('<option value="7">7 日間</option>');
  });

  it("shows no-expiry as an option when paid publishing is available", () => {
    const source = readFileSync("src/client/admin/screens/UploadScreen.tsx", "utf8");

    expect(source).toContain("有料プランまたは1サイト購入枠では無期限公開も選べます。");
    expect(source).toContain('<option value="30">30 日間</option>');
    expect(source).toContain('<option value="90">90 日間</option>');
    expect(source).toContain('<option value="none">無期限</option>');
  });

  it("serves the demo HTML as a downloadable root asset", async () => {
    const assetPaths: string[] = [];
    const env = {
      APP_HOST: "giga-site.com",
      APP_BASE_PATH: "/app",
      PREVIEW_HOST_SUFFIX: ".giga-site.com",
      ASSETS: {
        fetch: async (request: Request) => {
          assetPaths.push(new URL(request.url).pathname);
          return new Response("<!doctype html><title>demo</title>", {
            headers: { "Content-Type": "text/html" }
          });
        }
      }
    } as unknown as Env;

    const fetchHandler = worker.fetch as unknown as (request: Request, env: Env, ctx: unknown) => Promise<Response>;
    const response = await fetchHandler(new Request(`https://giga-site.com${DEMO_HTML_DOWNLOAD_PATH}`), env, {});

    expect(response.status).toBe(200);
    expect(assetPaths).toEqual([DEMO_HTML_ASSET_PATH]);
    expect(response.headers.get("Content-Type")).toBe("text/html; charset=utf-8");
    expect(response.headers.get("Content-Disposition")).toBe(`attachment; filename="${DEMO_HTML_FILE_NAME}"`);
  });
});
