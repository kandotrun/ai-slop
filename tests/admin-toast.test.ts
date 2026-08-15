import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { errorMessageJa } from "../src/client/admin/errors";

describe("admin toast and quota error copy", () => {
  it("maps free-plan site limit errors to a user-actionable message", () => {
    expect(errorMessageJa("free_plan_site_limit_exceeded")).toContain("無料プランで公開できるサイトは1件まで");
    expect(errorMessageJa("free_plan_site_limit_exceeded")).toContain("Pro");
  });

  it("uses Sonner as the admin toast renderer", () => {
    const source = readFileSync("src/client/admin/Toast.tsx", "utf8");

    expect(source).toContain('from "sonner"');
    expect(source).toContain("<Toaster");
    expect(source).toContain("toast.loading");
  });

  it("shows loading toasts for upload publishing actions", () => {
    const source = readFileSync("src/client/admin/screens/UploadScreen.tsx", "utf8");

    expect(source).toContain('notify.loading("公開URLを作成中...")');
    expect(source).toContain("notify.success(message, toastId)");
    expect(source).toContain("notify.dismiss(toastId)");
  });

  it("shows an explicit override action for security review warnings", () => {
    const source = readFileSync("src/client/admin/screens/UploadScreen.tsx", "utf8");

    expect(source).toContain("セキュリティチェックで警告が見つかりました");
    expect(source).toContain("警告を理解して公開する");
    expect(source).toContain("securityOverrideAccepted");
  });

  it("shows an explicit override action when replacement security review blocks a revision", () => {
    const source = readFileSync("src/client/admin/screens/DetailScreen.tsx", "utf8");

    expect(source).toContain("replaceSecurityWarnings");
    expect(source).toContain("pendingReplaceBody");
    expect(source).toContain("警告を理解して差し替える");
    expect(source).toContain("securityOverrideAccepted");
  });

  it("shows actionable security warning details instead of only raw warning codes", () => {
    const source = readFileSync("src/client/admin/warnings.ts", "utf8");

    expect(source).toContain("warningDetails");
    expect(source).toContain("HTML本文");
    expect(source).toContain("form action");
    expect(source).toContain("AIセキュリティレビュー");
  });

  it("keeps the toaster out of the .gs-app grid so Sonner's section cannot collapse the admin layout", () => {
    const source = readFileSync("src/client/admin/AdminApp.tsx", "utf8");

    expect(source).toContain("<ToastViewport />");
    expect(source).not.toMatch(/<div className="forge gs-app">\s*<ToastViewport/);

    const mainOpen = source.indexOf('<div className="gs-main">');
    const toaster = source.indexOf("<ToastViewport");
    expect(mainOpen).toBeGreaterThan(0);
    expect(toaster).toBeGreaterThan(mainOpen);
  });
});
