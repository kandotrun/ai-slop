import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("admin mobile responsiveness", () => {
  it("collapses the sidebar into an off-canvas drawer on phones", () => {
    const css = readFileSync("src/client/styles/app.css", "utf8");
    expect(css).toContain("@media (max-width: 640px)");
    expect(css).toMatch(/\.gs-sidebar\s*\{[^}]*translateX\(-100%\)/s);
    expect(css).toContain(".gs-sidebar.is-open");
    expect(css).toMatch(/\.forge\.gs-app\s*\{\s*grid-template-columns:\s*1fr/);
  });

  it("wires a hamburger menu and overlay to toggle the drawer", () => {
    const topbar = readFileSync("src/client/admin/Topbar.tsx", "utf8");
    expect(topbar).toContain("gs-menu-btn");
    expect(topbar).toContain("onMenu");

    const app = readFileSync("src/client/admin/AdminApp.tsx", "utf8");
    expect(app).toContain("gs-nav-overlay");
    expect(app).toContain("onMenu={() => setNavOpen(true)}");

    const sidebar = readFileSync("src/client/admin/Sidebar.tsx", "utf8");
    expect(sidebar).toContain("is-open");
  });

  it("stacks data tables into labelled cards on phones", () => {
    const css = readFileSync("src/client/styles/app.css", "utf8");
    expect(css).toMatch(/\.gs-row > span\[data-label\]::before/);

    const dash = readFileSync("src/client/admin/screens/DashboardScreen.tsx", "utf8");
    expect(dash).toContain('data-label="状態"');
  });

  it("does not show or fetch admin notifications", () => {
    const topbar = readFileSync("src/client/admin/Topbar.tsx", "utf8");
    const app = readFileSync("src/client/admin/AdminApp.tsx", "utf8");
    const css = readFileSync("src/client/styles/app.css", "utf8");

    expect(topbar).not.toContain("BellIcon");
    expect(topbar).not.toContain('aria-label="通知"');
    expect(topbar).not.toContain("gs-bell-wrap");
    expect(app).not.toContain("api.notifications()");
    expect(app).not.toContain("notifOpen");
    expect(css).not.toContain("gs-notif");
  });
});
