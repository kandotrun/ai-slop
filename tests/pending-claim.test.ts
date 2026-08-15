import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ApiClientError } from "../src/client/admin/api";
import {
  claimErrorIsTerminal,
  readPendingClaim,
  removePendingClaim
} from "../src/client/admin/pending-claim";
import { PENDING_CLAIM_STORAGE_KEY, type PendingClaim } from "../src/shared/anon-publish";

function memoryStorage(initial?: PendingClaim) {
  const values = new Map<string, string>();
  if (initial) values.set(PENDING_CLAIM_STORAGE_KEY, JSON.stringify(initial));
  return {
    values,
    storage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key)
    } as Pick<Storage, "getItem" | "setItem" | "removeItem">
  };
}

describe("pending anonymous publish claim", () => {
  it("keeps a valid pending claim in storage until claim succeeds", () => {
    const pending: PendingClaim = {
      siteId: "site_1",
      slug: "demo",
      previewUrl: "https://demo.giga-site.com/",
      claimToken: "claim-token",
      expiresAt: 2_000
    };
    const { storage, values } = memoryStorage(pending);

    expect(readPendingClaim(storage, 1_000)).toEqual(pending);
    expect(values.has(PENDING_CLAIM_STORAGE_KEY)).toBe(true);
  });

  it("clears only invalid or expired pending claims while reading", () => {
    const expired = memoryStorage({
      siteId: "site_1",
      slug: "demo",
      previewUrl: "https://demo.giga-site.com/",
      claimToken: "claim-token",
      expiresAt: 999
    });

    expect(readPendingClaim(expired.storage, 1_000)).toBeNull();
    expect(expired.values.has(PENDING_CLAIM_STORAGE_KEY)).toBe(false);

    const malformed = memoryStorage();
    malformed.values.set(PENDING_CLAIM_STORAGE_KEY, "not json");
    expect(readPendingClaim(malformed.storage, 1_000)).toBeNull();
    expect(malformed.values.has(PENDING_CLAIM_STORAGE_KEY)).toBe(false);
  });

  it("removes pending claims only when explicitly asked after success or terminal claim errors", () => {
    const pending: PendingClaim = {
      siteId: "site_1",
      slug: "demo",
      previewUrl: "https://demo.giga-site.com/",
      claimToken: "claim-token"
    };
    const { storage, values } = memoryStorage(pending);

    removePendingClaim(storage);

    expect(values.has(PENDING_CLAIM_STORAGE_KEY)).toBe(false);
    expect(claimErrorIsTerminal(new ApiClientError("claim_token_invalid", 404))).toBe(true);
    expect(claimErrorIsTerminal(new ApiClientError("already_claimed", 409))).toBe(true);
    expect(claimErrorIsTerminal(new ApiClientError("server_error", 500))).toBe(false);
    expect(claimErrorIsTerminal(new Error("サーバーに接続できませんでした"))).toBe(false);
  });

  it("spec: claim token handoff is storage-only and is never recovered from a URL fragment", () => {
    // URL fragments are easy to leak through copy/paste and browser history. Claim tokens stay in localStorage only.
    const admin = readFileSync("src/client/admin/AdminApp.tsx", "utf8");
    const landing = readFileSync("src/client/LandingPage.tsx", "utf8");

    expect(readPendingClaim(null, 1_000)).toBeNull();
    expect(admin).not.toContain("pendingClaimFromHash");
    expect(admin).not.toContain("#claim=");
    expect(landing).not.toContain("#claim=");
    expect(landing).not.toContain("claimStorageFailed ?");
  });
});
