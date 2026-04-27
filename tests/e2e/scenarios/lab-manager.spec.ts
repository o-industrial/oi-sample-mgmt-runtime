// deno-lint-ignore-file no-window
/**
 * 14.4: Lab Manager — "Manager's Morning Briefing"
 *
 * Persona: dr.priya.lindqvist / admin:access + review:approve
 * Landing: / (dashboard — admin stays)
 * Scenes: dashboard overview, review queue actions, management overlay,
 *         system & compliance status, transfer page, escalation handoff
 */
import { expect, personaTest } from "../fixtures/persona.fixture";
import {
  MANAGEMENT_OVERLAY_TOGGLE,
  NOTIFICATION_BELL,
  NOTIFICATION_PANEL,
  sidebarLink,
} from "../helpers/selectors";

const test = personaTest("labManager");

test.describe("Lab Manager — Morning Briefing", () => {
  // Scene 1: Dashboard Overview
  test("Scene 1: Dashboard overview", async ({ personaPage: page }) => {
    // Lab Manager stays on dashboard (admin:access)
    await expect(page).toHaveURL(/^[^?]*\/$/);

    // User info shows "Dr. Priya Lindqvist"
    await expect(page.getByText("Dr. Priya Lindqvist")).toBeVisible();

    // 5 activity panes visible
    await page.waitForTimeout(500);

    // View All links visible on panes
    const viewAllLinks = page.getByText(/view all/i);
    await expect(viewAllLinks.first()).toBeVisible();

    // Slow scroll to show all 5 panes
    await page.evaluate(() => {
      window.scrollTo({ top: 400, behavior: "smooth" });
    });
    await page.waitForTimeout(1500);
  });

  // Scene 2: Review Queue Actions
  test("Scene 2: Review queue actions", async ({ personaPage: page }) => {
    // Scroll to review queue section (visible because admin has review:approve)
    const reviewSection = page.getByText(/review/i).first();
    await reviewSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // REV-2026-0001 visible (reception type, temperature deviation, warnings)
    await expect(page.getByText("REV-2026-0001")).toBeVisible();

    // REV-2026-0002 visible (reconciliation type, count mismatch + barcode scan failure, failed)
    await expect(page.getByText("REV-2026-0002")).toBeVisible();

    // Click "Approve" on REV-2026-0001
    const rev1Row = page.locator('tr, [class*="review"]', {
      hasText: "REV-2026-0001",
    });
    const approveBtn = rev1Row.getByRole("button", { name: /approve/i });
    if (await approveBtn.isVisible().catch(() => false)) {
      await approveBtn.click();
      await page.waitForTimeout(1000);
    }

    // Click "Escalate" on REV-2026-0002
    const rev2Row = page.locator('tr, [class*="review"]', {
      hasText: "REV-2026-0002",
    });
    const escalateBtn = rev2Row.getByRole("button", { name: /escalate/i });
    if (await escalateBtn.isVisible().catch(() => false)) {
      await escalateBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  // Scene 3: Management Overlay
  test("Scene 3: Management overlay", async ({ personaPage: page }) => {
    // Scroll to Management Overlay toggle
    const toggleBtn = page.locator(MANAGEMENT_OVERLAY_TOGGLE);
    await toggleBtn.scrollIntoViewIfNeeded();
    await toggleBtn.click();
    await page.waitForTimeout(500);

    // Overlay expands — effort tracking and capacity forecast visible
    // Effort tracking: sample managers with workload bars
    await expect(page.getByText(/effort|workload/i).first()).toBeVisible();

    // Capacity forecast: current, projected, breakpoint
    await expect(page.getByText(/capacity|forecast/i).first()).toBeVisible();

    // Pause 5 seconds — "where's the breaking point" moment
    await page.waitForTimeout(5000);
  });

  // Scene 4: System & Compliance Status
  test("Scene 4: System and compliance status", async ({ personaPage: page }) => {
    // Scroll to bottom panels
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
    await page.waitForTimeout(1000);

    // System Status panel: 4 components
    await expect(page.getByText(/temp/i).first()).toBeVisible();
    await expect(page.getByText(/barcode/i).first()).toBeVisible();
    await expect(page.getByText(/LIMS/i).first()).toBeVisible();

    // Compliance Status panel: 3 standards
    await expect(page.getByText(/21 CFR/i).first()).toBeVisible();
    await expect(page.getByText(/GxP/i).first()).toBeVisible();
    await expect(page.getByText(/ICH/i).first()).toBeVisible();

    await page.waitForTimeout(1000);
  });

  // Scene 5: Transfer Page Navigation
  test("Scene 5: Transfer page", async ({ personaPage: page }) => {
    // Click "View All" on Transfers pane or use sidebar
    await page.locator(sidebarLink("/transfer")).click();
    await page.waitForURL("**/transfer");

    // Transfer management table visible
    const table = page.locator("table").first();
    await expect(table).toBeVisible();

    // 6 transfer records visible
    const rows = table.locator("tbody tr");
    await expect(rows).toHaveCount(6);

    // Filter by type → Inter-Site
    const typeFilter = page.getByLabel(/type/i).first();
    if (await typeFilter.isVisible().catch(() => false)) {
      await typeFilter.selectOption("inter-site");
      await page.waitForTimeout(500);
    }

    // Approve button visible on pending transfer (admin has implied authority)
    const approveBtn = page.getByRole("button", { name: /approve/i }).first();
    if (await approveBtn.isVisible().catch(() => false)) {
      await approveBtn.click();
      await page.waitForTimeout(2000);
    }

    // Navigate back to dashboard
    await page.locator(sidebarLink("/")).click();
    await page.waitForURL(/^[^?]*\/$/);
  });

  // Scene 6: Escalation Handoff to CSV Group Head
  test("Scene 6: Escalation handoff", async ({ personaPage: page }) => {
    // After escalating REV-2026-0002 (done in Scene 2 or simulated here),
    // switch persona to CSV Group Head to show escalation arrived
    // Note: In the capstone (14.11), this is a true cross-persona handoff.
    // Here we demonstrate the concept by navigating to CSV Group Head's view.

    // Switch persona cookie to csvGroupHead
    await page.context().addCookies([
      {
        name: "demo_persona",
        value: "csvGroupHead",
        domain: "localhost",
        path: "/",
      },
    ]);

    // Navigate to dashboard as CSV Group Head
    await page.goto("/");
    await page.waitForTimeout(1000);

    // Click notification bell — should show escalation notification
    const bell = page.locator(NOTIFICATION_BELL);
    await bell.click();

    const panel = page.locator(NOTIFICATION_PANEL);
    await expect(panel).toBeVisible();

    // NTF-0009 should be visible (escalation for CSV Group Head)
    await expect(page.getByText(/escalat/i)).toBeVisible();

    // Pause — escalation arrived without email
    await page.waitForTimeout(2000);
  });
});
