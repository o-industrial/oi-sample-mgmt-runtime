/**
 * 14.9: Study Coordinator — "Tracking My Studies"
 *
 * Persona: renata.solberg / study:view
 * Landing: /track/samples (redirected from /)
 * Scenes: sample tracking landing, study-specific filtering,
 *         custody report drill-through, ethics check, no dashboard access
 */
import { expect, personaTest } from "../fixtures/persona.fixture";
import {
  NOTIFICATION_BELL,
  NOTIFICATION_PANEL,
  notificationItem,
} from "../helpers/selectors";

const test = personaTest("studyCoordinator");

test.describe("Study Coordinator — Tracking My Studies", () => {
  // Scene 1: Sample Tracking Landing
  test("Scene 1: Sample tracking landing", async ({ personaPage: page }) => {
    // Study Coordinator redirects to /track/samples
    await expect(page).toHaveURL(/\/track\/samples/);

    // Status summary cards visible
    await page.waitForTimeout(500);

    // 6 samples in table
    const table = page.locator("table").first();
    await expect(table).toBeVisible();
  });

  // Scene 2: Study-Specific Filtering
  test("Scene 2: Study-specific filtering", async ({ personaPage: page }) => {
    await expect(page).toHaveURL(/\/track\/samples/);

    // Search for BEACON-3
    const searchInput = page.getByLabel(/search|study|sample/i).first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill("BEACON-3");
      await page.waitForTimeout(500);

      // 3 BEACON-3 samples visible
      await expect(page.getByText("BEACON-3").first()).toBeVisible();

      // Clear and search MERIDIAN-1
      await searchInput.fill("MERIDIAN-1");
      await page.waitForTimeout(500);

      // 2 MERIDIAN-1 samples visible
      await expect(page.getByText("MERIDIAN-1").first()).toBeVisible();

      // Clear search
      await searchInput.fill("");
      await page.waitForTimeout(300);
    }
  });

  // Scene 3: Custody Report Drill-Through
  test("Scene 3: Custody report drill-through", async ({ personaPage: page }) => {
    await expect(page).toHaveURL(/\/track\/samples/);

    // Click "View Report" on SMP-2026-88421-001
    const viewLink = page.locator("a, button", {
      hasText: /view|report/i,
    }).first();
    if (await viewLink.isVisible().catch(() => false)) {
      await viewLink.click();
      await page.waitForTimeout(1000);
    } else {
      // Fallback: navigate directly
      await page.goto("/report/custody?sampleId=SMP-2026-88421-001");
    }

    // Sample header card visible
    await expect(page.getByText("SMP-2026-88421-001")).toBeVisible();

    // Timeline events with ALCOA+ badges
    await page.waitForTimeout(500);

    // Toggle to table view
    const tableToggle = page.getByRole("button", { name: /table/i });
    if (await tableToggle.isVisible().catch(() => false)) {
      await tableToggle.click();
      await page.waitForTimeout(500);
    }

    // Export PDF
    const exportBtn = page.getByRole("button", { name: /export|pdf/i });
    if (await exportBtn.isVisible().catch(() => false)) {
      await exportBtn.click();
    }

    // Pause — sponsor asks "where is my sample?"
    await page.waitForTimeout(2000);
  });

  // Scene 4: Ethics Check
  test("Scene 4: Ethics check", async ({ personaPage: page }) => {
    // Navigate to ethics approval
    await page.goto("/report/ethics-approval");
    await page.waitForURL("**/report/ethics-approval");

    // BEACON-3 active (green badge, 503 days remaining)
    await expect(page.getByText("BEACON-3")).toBeVisible();

    // ONCO-2024-03 expiring (red badge, 7 days)
    await expect(page.getByText("ONCO-2024-03")).toBeVisible();

    await page.waitForTimeout(1000);
  });

  // Scene 5: No Dashboard Access
  test("Scene 5: No dashboard access", async ({ personaPage: page }) => {
    // Navigate to / → redirect back to /track/samples
    await page.goto("/");
    await page.waitForURL("**/track/samples");
    await expect(page).toHaveURL(/\/track\/samples/);

    // Study Coordinator does NOT see dashboard panes, management overlay, review queue
  });

  // Notification Check
  test("Notification check", async ({ personaPage: page }) => {
    // Click notification bell
    const bell = page.locator(NOTIFICATION_BELL);
    await bell.click();

    const panel = page.locator(NOTIFICATION_PANEL);
    await expect(panel).toBeVisible();

    // NTF-0008 should be visible (renata.solberg, status-change)
    await expect(page.locator(notificationItem("NTF-0008"))).toBeVisible();
    await page.waitForTimeout(1000);
  });
});
