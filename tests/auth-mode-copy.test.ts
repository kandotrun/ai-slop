import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const clientCopyFiles = [
  "src/client/admin/screens/DetailScreen.tsx",
  "src/client/admin/screens/UploadScreen.tsx",
  "src/client/admin/format.ts",
  "src/client/LandingPage.tsx"
];

describe("authentication mode copy", () => {
  it("uses no-auth wording instead of random-url-only wording in user-facing client copy", () => {
    for (const file of clientCopyFiles) {
      const source = readFileSync(file, "utf8");
      expect(source).not.toContain("ランダム URL のみ");
      expect(source).not.toContain("ランダムURLのみ");
    }

    expect(readFileSync("src/client/admin/screens/DetailScreen.tsx", "utf8")).toContain('title: "認証なし"');
    expect(readFileSync("src/client/admin/screens/UploadScreen.tsx", "utf8")).toContain('title: "認証なし"');
    expect(readFileSync("src/client/admin/format.ts", "utf8")).toContain('random: "認証なし"');
    expect(readFileSync("src/client/LandingPage.tsx", "utf8")).toContain('"認証なし共有"');
  });

  it("does not describe no-auth instant publish as an authenticated URL", () => {
    const landing = readFileSync("src/client/LandingPage.tsx", "utf8");
    expect(landing).not.toContain("ランダムな認証付きURL");
    expect(landing).not.toContain("いまドロップするだけで、認証付きURLになります。");
    expect(landing).toContain("認証なしURL");
    expect(landing).toContain("パスワード付きURL");
  });
});
