import { describe, expect, it } from "vitest";
import { normalizeAuthInput, normalizeSiteInput, normalizeSlug } from "../src/shared/site-input";

describe("site input boundary contracts", () => {
  it("defaults blank titles to a safe label", () => {
    const result = normalizeSiteInput({ title: "   ", authMode: "random" });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.title).toBe("Untitled HTML");
  });

  it("rejects titles over 120 characters", () => {
    const result = normalizeSiteInput({ title: "あ".repeat(121), authMode: "random" });

    expect(result).toMatchObject({ ok: false, error: "title_too_long" });
  });

  it("normalizes a valid expiration date to ISO", () => {
    const result = normalizeSiteInput({ title: "Demo", authMode: "random", expiresAt: "2026-06-22T09:00:00+09:00" });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.expiresAt).toBe("2026-06-22T00:00:00.000Z");
  });

  it("rejects invalid expiration dates", () => {
    const result = normalizeSiteInput({ title: "Demo", authMode: "random", expiresAt: "not-a-date" });

    expect(result).toMatchObject({ ok: false, error: "invalid_expires_at" });
  });

  it("only enables indexing when the value is exactly true", () => {
    const enabled = normalizeSiteInput({ title: "Demo", authMode: "random", indexingEnabled: true });
    const stringValue = normalizeSiteInput({ title: "Demo", authMode: "random", indexingEnabled: "true" });

    expect(enabled.ok && enabled.value.indexingEnabled).toBe(true);
    expect(stringValue.ok && stringValue.value.indexingEnabled).toBe(false);
  });

  it("normalizes uppercase slugs and rejects boundary punctuation", () => {
    expect(normalizeSlug("Campaign-2026")).toEqual({ ok: true, value: "campaign-2026" });
    expect(normalizeSlug("-campaign")).toEqual({ ok: false, error: "invalid_slug" });
    expect(normalizeSlug("campaign-")).toEqual({ ok: false, error: "invalid_slug" });
    expect(normalizeSlug("campaign__2026")).toEqual({ ok: false, error: "invalid_slug" });
  });

  it("rejects reserved public slugs", () => {
    for (const slug of ["app", "api", "admin", "assets", "static", "www", "mail", "ftp", "support", "help", "billing"]) {
      expect(normalizeSlug(slug)).toEqual({ ok: false, error: "reserved_slug" });
    }
  });

  it("rejects overlong slugs", () => {
    expect(normalizeSlug("a".repeat(41))).toEqual({ ok: false, error: "invalid_slug" });
  });

  it("deduplicates domains after trimming and removing @", () => {
    const result = normalizeSiteInput({
      title: "Demo",
      authMode: "email_domain",
      allowedEmailDomains: [" @Example.com ", "example.com", "Sub.Example.com"]
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.allowedEmailDomains).toEqual(["example.com", "sub.example.com"]);
  });

  it("rejects malformed domains and too many domain entries", () => {
    const invalid = normalizeSiteInput({ title: "Demo", authMode: "email_domain", allowedEmailDomains: "bad_domain" });
    const tooMany = normalizeSiteInput({
      title: "Demo",
      authMode: "email_domain",
      allowedEmailDomains: Array.from({ length: 21 }, (_, index) => `d${index}.example.com`)
    });

    expect(invalid).toMatchObject({ ok: false, error: "invalid_domain" });
    expect(tooMany).toMatchObject({ ok: false, error: "too_many_domains" });
  });

  it("deduplicates allowed email addresses after lowercasing", () => {
    const result = normalizeSiteInput({
      title: "Demo",
      authMode: "email_otp",
      allowedEmails: [" A@Example.com ", "a@example.com", "b@example.com"]
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.allowedEmails).toEqual(["a@example.com", "b@example.com"]);
  });

  it("rejects more than 50 email allowlist entries", () => {
    const result = normalizeSiteInput({
      title: "Demo",
      authMode: "email_otp",
      allowedEmails: Array.from({ length: 51 }, (_, index) => `user${index}@example.com`)
    });

    expect(result).toMatchObject({ ok: false, error: "too_many_emails" });
  });

  it("rejects unsupported auth mode types and values", () => {
    expect(normalizeAuthInput({ authMode: 123 }, { requirePassword: false })).toMatchObject({ ok: false, error: "invalid_auth_mode" });
    expect(normalizeAuthInput({ authMode: "magic_link" }, { requirePassword: false })).toMatchObject({ ok: false, error: "invalid_auth_mode" });
  });

  it("rejects short, overly long, and example passwords", () => {
    expect(normalizeAuthInput({ authMode: "password", password: "short" }, { requirePassword: true })).toMatchObject({ ok: false, error: "password_required" });
    expect(normalizeAuthInput({ authMode: "password", password: "x".repeat(201) }, { requirePassword: true })).toMatchObject({ ok: false, error: "password_too_long" });
    expect(normalizeAuthInput({ authMode: "password", password: "password123" }, { requirePassword: true })).toMatchObject({ ok: false, error: "password_too_common" });
  });

  it("does not carry password values into non-password auth modes", () => {
    const result = normalizeAuthInput({ authMode: "random", password: "secret-value" }, { requirePassword: false });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.authMode).toBe("random");
      expect(result.value.password).toBeUndefined();
    }
  });
});
