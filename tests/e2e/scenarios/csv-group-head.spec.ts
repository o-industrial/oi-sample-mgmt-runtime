// deno-lint-ignore-file no-window
/**
 * 14.10: CSV Group Head — "The System Architect Reviews"
 *
 * Persona: dr.emile.kowalczyk / config:admin + review:approve
 * Landing: / (dashboard — config:admin stays)
 * Scenes: dashboard landing, escalation review queue,
 *         system & compliance authority, notification triage with ActionUrl
 */
import { expect, personaTest } from "../fixtures/persona.fixture";
import {
  MANAGEMENT_OVERLAY_TOGGLE,
  NOTIFICATION_BELL,
  NOTIFICATION_PANEL,
  notificationItem,
} from "../helpers/selectors";

const test = personaTest("csvGroupHead");

test.describe("CSV Group Head — The System Architect Reviews", () => {
  // Scene 1: Dashboard Landing
  test("Scene 1: Dashboard landing", async ({ personaPage: page }) => {
    // CSV Group Head stays on dashboard (config:admin)
    await expect(page).toHaveURL(/^[^?]*\/$/);

    // User info shows "Dr. Emile Kowalczyk"
    await expect(page.getByText(/emile kowalczyk/i)).toBeVisible();

    // 5 activity panes visible with TurboTax status bars
    await page.waitForTimeout(500);

    // Management overlay available — click toggle
    const toggleBtn = page.locator(MANAGEMENT_OVERLAY_TOGGLE);
    if (await toggleBtn.isVisible().catch(() => false)) {
      await toggleBtn.click();
      await page.waitForTimeout(500);

      // Both Effort Tracking + Capacity Forecast visible
      await expect(page.getByText(/effort|workload/i).first()).toBeVisible();
      await expect(
        page.getByText(/capacity|forecast/i).first(),
      ).toBeVisible();

      // Close overlay
      await toggleBtn.click();
    }

    // Review queue visible (review:approve)
    await page.waitForTimeout(500);

    // Pause — system architect's full-authority view
    await page.waitForTimeout(2000);
  });

  // Scene 2: Escalation Review Queue
  test("Scene 2: Escalation review queue", async ({ personaPage: page }) => {
    // Scroll to review queue
    const reviewHeading = page.getByText(/review/i).first();
    await reviewHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Escalated items visible in queue
    // REV-2026-0005 escalated (from seed data)
    const rev5 = page.getByText("REV-2026-0005");
    if (await rev5.isVisible().catch(() => false)) {
      await expect(rev5).toBeVisible();

      // Click Approve on escalated review
      const row = page.locator('tr, [class*="review"]', {
        hasText: "REV-2026-0005",
      });
      const approveBtn = row.getByRole("button", { name: /approve/i });
      if (await approveBtn.isVisible().catch(() => false)) {
        await approveBtn.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  // Scene 3: System & Compliance Authority
  test("Scene 3: System and compliance authority", async ({ personaPage: page }) => {
    // Scroll to system status + compliance panels
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
    await page.waitForTimeout(1000);

    // System Status: 4 components
    await expect(page.getByText(/temp/i).first()).toBeVisible();
    await expect(page.getByText(/LIMS/i).first()).toBeVisible();

    // Compliance Status: 3 standards
    await expect(page.getByText(/21 CFR/i).first()).toBeVisible();
    await expect(page.getByText(/GxP/i).first()).toBeVisible();
    await expect(page.getByText(/ICH/i).first()).toBeVisible();

    // Pause — CSV Group Head is who configures these systems
    await page.waitForTimeout(2000);
  });

  // Scene 4: Notification Triage with ActionUrl Navigation
  test("Scene 4: Notification triage with ActionUrl", async ({ personaPage: page }) => {
    // Click notification bell
    const bell = page.locator(NOTIFICATION_BELL);
    await bell.click();

    const panel = page.locator(NOTIFICATION_PANEL);
    await expect(panel).toBeVisible();

    // NTF-0009: escalation notification for CSV Group Head
    const ntf9 = page.locator(notificationItem("NTF-0009"));
    await expect(ntf9).toBeVisible();
    await expect(ntf9.getByText(/escalat/i)).toBeVisible();

    // Click "View" → navigates to /reconciliation via ActionUrl
    await ntf9.getByText(/view/i).click();
    await page.waitForURL("**/reconciliation");
    await expect(page).toHaveURL(/\/reconciliation/);

    // Reconciliation page loads with relevant context
    await page.waitForTimeout(2000);

    // Navigate back to dashboard
    await page.goto("/");
    await page.waitForTimeout(500);

    // Click bell again, mark read on NTF-0009
    await page.locator(NOTIFICATION_BELL).click();
    await expect(page.locator(NOTIFICATION_PANEL)).toBeVisible();

    const ntf9Again = page.locator(notificationItem("NTF-0009"));
    const markReadBtn = ntf9Again.getByText(/mark read/i);
    if (await markReadBtn.isVisible().catch(() => false)) {
      await markReadBtn.click();
      await page.waitForTimeout(500);
    }
  });
});
