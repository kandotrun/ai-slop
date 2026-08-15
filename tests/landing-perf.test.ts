import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("landing page load performance", () => {
  // The repo runs vitest in the "node" environment (no jsdom), so component effects
  // are not mounted here; we assert the deferral is wired structurally instead.
  it("defers the Stripe config fetch to idle time instead of running it on mount", () => {
    const source = readFileSync("src/client/LandingPage.tsx", "utf8");
    // The fetch is wrapped in an idle-scheduled loader, never called inline on mount.
    expect(source).toContain("const loadStripeConfig");
    expect(source).toContain('fetch("/api/billing/stripe/config"');
    // requestIdleCallback with a bounded timeout, and a setTimeout fallback when it is absent.
    expect(source).toMatch(/requestIdleCallback\([\s\S]*?\{\s*timeout:\s*\d+/);
    expect(source).toContain("setTimeout(task");
    // The fetch lives inside the loader body, which is only invoked through scheduleIdle.
    const loaderIdx = source.indexOf("const loadStripeConfig");
    const fetchIdx = source.indexOf('fetch("/api/billing/stripe/config"');
    const scheduleIdx = source.indexOf("scheduleIdle(() =>");
    expect(loaderIdx).toBeGreaterThan(-1);
    expect(fetchIdx).toBeGreaterThan(loaderIdx);
    expect(scheduleIdx).toBeGreaterThan(fetchIdx);
  });
});
