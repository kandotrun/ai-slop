import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../src/worker/auth-hash";

describe("preview password hashing", () => {
  it("hashes and verifies passwords without storing the plain value", async () => {
    const hash = await hashPassword("share-me");

    expect(hash).toMatch(/^pbkdf2\$/);
    const [, iterationsRaw] = hash.split("$");
    expect(Number(iterationsRaw)).toBeLessThanOrEqual(100_000);
    expect(hash).not.toContain("share-me");
    await expect(verifyPassword("share-me", hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong", hash)).resolves.toBe(false);
  });

  it("uses fresh salts for the same password", async () => {
    const first = await hashPassword("share-me");
    const second = await hashPassword("share-me");

    expect(first).not.toBe(second);
    await expect(verifyPassword("share-me", first)).resolves.toBe(true);
    await expect(verifyPassword("share-me", second)).resolves.toBe(true);
  });

  it("rejects missing or non-pbkdf2 hashes", async () => {
    await expect(verifyPassword("share-me", null)).resolves.toBe(false);
    await expect(verifyPassword("share-me", "plain-text-password")).resolves.toBe(false);
    await expect(verifyPassword("share-me", "argon2$10000$salt$hash")).resolves.toBe(false);
  });

  it("rejects hashes with unsafe iteration counts", async () => {
    await expect(verifyPassword("share-me", "pbkdf2$9999$c2FsdA$aGFzaA")).resolves.toBe(false);
    await expect(verifyPassword("share-me", "pbkdf2$not-a-number$c2FsdA$aGFzaA")).resolves.toBe(false);
  });

  it("returns false for malformed base64url hash parts instead of throwing", async () => {
    await expect(verifyPassword("share-me", "pbkdf2$10000$!!!!$also!!!!")).resolves.toBe(false);
  });
});
