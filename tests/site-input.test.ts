import { describe, expect, it } from "vitest";
import { normalizeAuthInput, normalizeSiteInput } from "../src/shared/site-input";

describe("site input normalization", () => {
  it("normalizes a minimal password-protected site request", () => {
    const input = normalizeSiteInput({ title: " Demo ", authMode: "password", password: "share-me" });

    expect(input.ok).toBe(true);
    if (input.ok) {
      expect(input.value.title).toBe("Demo");
      expect(input.value.authMode).toBe("password");
      expect(input.value.password).toBe("share-me");
    }
  });

  it("rejects password auth without a password", () => {
    const input = normalizeSiteInput({ title: "Demo", authMode: "password" });

    expect(input.ok).toBe(false);
  });

  it("allows random URL mode without a password", () => {
    const input = normalizeSiteInput({ title: "Demo", authMode: "random" });

    expect(input.ok).toBe(true);
  });

  it("rejects known documentation example passwords", () => {
    for (const password of ["change-me-please", "<generate-unique-random-password>", "<your-password-here>"]) {
      const input = normalizeSiteInput({ title: "Demo", authMode: "password", password });

      expect(input.ok).toBe(false);
      if (!input.ok) {
        expect(input.error).toBe("password_too_common");
      }
    }
  });

  it("normalizes custom slugs and company domains", () => {
    const input = normalizeSiteInput({
      title: "Demo",
      slug: "Acme-Proposal",
      authMode: "email_domain",
      allowedEmailDomains: "@acme.co.jp, example.com"
    });

    expect(input.ok).toBe(true);
    if (input.ok) {
      expect(input.value.slug).toBe("acme-proposal");
      expect(input.value.allowedEmailDomains).toEqual(["acme.co.jp", "example.com"]);
    }
  });

  it("rejects reserved slugs", () => {
    const input = normalizeSiteInput({ title: "Demo", slug: "app", authMode: "random" });

    expect(input.ok).toBe(false);
  });

  it("normalizes an email allowlist for email_otp mode", () => {
    const input = normalizeSiteInput({
      title: "Demo",
      authMode: "email_otp",
      allowedEmails: " Tanaka@Example.com, sato@example.com , tanaka@example.com "
    });

    expect(input.ok).toBe(true);
    if (input.ok) {
      expect(input.value.authMode).toBe("email_otp");
      expect(input.value.allowedEmails).toEqual(["tanaka@example.com", "sato@example.com"]);
    }
  });

  it("rejects email_otp mode without an allowlist", () => {
    const input = normalizeSiteInput({ title: "Demo", authMode: "email_otp" });

    expect(input.ok).toBe(false);
    if (!input.ok) {
      expect(input.error).toBe("allowed_emails_required");
    }
  });

  it("rejects email_otp mode with a malformed address", () => {
    const input = normalizeSiteInput({ title: "Demo", authMode: "email_otp", allowedEmails: "not-an-email" });

    expect(input.ok).toBe(false);
    if (!input.ok) {
      expect(input.error).toBe("invalid_email");
    }
  });

  it("keeps a recognized creation tool and drops unknown values", () => {
    const good = normalizeSiteInput({ title: "Demo", authMode: "random", tool: "claude" });
    const bad = normalizeSiteInput({ title: "Demo", authMode: "random", tool: "totally-unknown" });

    expect(good.ok).toBe(true);
    if (good.ok) {
      expect(good.value.tool).toBe("claude");
    }
    expect(bad.ok).toBe(true);
    if (bad.ok) {
      expect(bad.value.tool).toBeUndefined();
    }
  });

  it("only enables hide-branding when explicitly true", () => {
    const on = normalizeSiteInput({ title: "Demo", authMode: "random", hideBranding: true });
    const off = normalizeSiteInput({ title: "Demo", authMode: "random" });

    expect(on.ok && on.value.hideBranding).toBe(true);
    expect(off.ok && off.value.hideBranding).toBe(false);
  });

  it("rejects an unrecognized auth mode instead of coercing to password", () => {
    const input = normalizeSiteInput({ title: "Demo", authMode: "emailotp", allowedEmails: "a@example.com" });

    expect(input.ok).toBe(false);
    if (!input.ok) {
      expect(input.error).toBe("invalid_auth_mode");
    }
  });
});

describe("auth input normalization (update path)", () => {
  it("allows keeping a password on update without re-entering it", () => {
    const result = normalizeAuthInput({ authMode: "password" }, { requirePassword: false });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.authMode).toBe("password");
      expect(result.value.password).toBeUndefined();
    }
  });

  it("still validates a provided password on update", () => {
    const result = normalizeAuthInput({ authMode: "password", password: "123" }, { requirePassword: false });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("password_required");
    }
  });

  it("still requires an allowlist for email_otp on update", () => {
    const result = normalizeAuthInput({ authMode: "email_otp" }, { requirePassword: false });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("allowed_emails_required");
    }
  });
});
