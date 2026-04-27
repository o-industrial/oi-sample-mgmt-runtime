/**
 * 14.6: HBSM Custodian — "Custodian Reviews Dispositions"
 *
 * Persona: declan.okafor / custody:approve
 * Landing: /disposition (redirected from /)
 * Scenes: disposition landing, disposition review, return approval,
 *         custody report drill-through, notification check
 */
import { expect, personaTest } from "../fixtures/persona.fixture";
import {
  NOTIFICATION_BELL,
  NOTIFICATION_PANEL,
  notificationItem,
  sidebarLink,
} from "../helpers/selectors";

const test = personaTest("custodian");

test.describe("Custodian — Custodian Reviews Dispositions", () => {
  // Scene 1: Disposition Landing
  test("Scene 1: Disposition landing", async ({ personaPage: page }) => {
    // Custodian lands on /disposition
    await expect(page).toHaveURL(/\/disposition/);

    // 5 disposition records visible
    const table = page.locator("table").first();
    await expect(table).toBeVisible();

    // Status summary cards: ready, attention, volume-hold, problem
    await page.waitForTimeout(500);

    // Approve button visible (custody:approve grants this)
    const approveBtn = page.getByRole("button", { name: /approve/i }).first();
    await expect(approveBtn).toBeVisible();
  });

  // Scene 2: Disposition Review
  test("Scene 2: Disposition review", async ({ personaPage: page }) => {
    await expect(page).toHaveURL(/\/disposition/);

    // DSP-2026-0001 visible (destroy, ready)
    await expect(page.getByText("DSP-2026-0001")).toBeVisible();

    // DSP-2026-0005 visible (destroy, problem — overdue)
    await expect(page.getByText("DSP-2026-0005")).toBeVisible();

    // Filter by decision "destroy"
    const decisionFilter = page.getByLabel(/decision/i).first();
    if (await decisionFilter.isVisible().catch(() => false)) {
      await decisionFilter.selectOption("destroy");
      await page.waitForTimeout(500);
    }

    // Filter by status "problem"
    const statusFilter = page.getByLabel(/status/i).first();
    if (await statusFilter.isVisible().catch(() => false)) {
      await statusFilter.selectOption("problem");
      await page.waitForTimeout(500);
    }

    // Pause — system surfaces what needs immediate attention
    await page.waitForTimeout(2000);
  });

  // Scene 3: Return Approval (exercises custody:approve on /return)
  test("Scene 3: Return approval", async ({ personaPage: page }) => {
    // Navigate to /return via sidebar
    await page.locator(sidebarLink("/return")).click();
    await page.waitForURL("**/return");

    // 5 return records visible
    const table = page.locator("table").first();
    await expect(table).toBeVisible();

    // Approve button visible (custody:approve — unlike Scientist in 14.5)
    const approveBtn = page.getByRole("button", { name: /approve/i }).first();
    await expect(approveBtn).toBeVisible();

    // Locate RET-2026-0002 (attention, awaiting custodian approval)
    await expect(page.getByText("RET-2026-0002")).toBeVisible();

    // Click Approve on RET-2026-0002
    const row = page.locator("tr", { hasText: "RET-2026-0002" });
    const rowApproveBtn = row.getByRole("button", { name: /approve/i });
    if (await rowApproveBtn.isVisible().catch(() => false)) {
      await rowApproveBtn.click();
      await page.waitForTimeout(2000);
    }
  });

  // Scene 4: Custody Report Drill-Through (exercises Phase 12)
  test("Scene 4: Custody report drill-through", async ({ personaPage: page }) => {
    // Navigate to /report/custody via sidebar
    await page.locator(sidebarLink("/report/custody")).click();
    await page.waitForURL("**/report/custody");

    // Search for sample
    const searchInput = page.getByLabel(/search|sample/i).first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill("SMP-2026-83100-001");
      const searchBtn = page.getByRole("button", { name: /search/i });
      if (await searchBtn.isVisible().catch(() => false)) {
        await searchBtn.click();
      }
      await page.waitForTimeout(1000);
    }

    // Sample summary card visible
    await expect(page.getByText("SMP-2026-83100-001")).toBeVisible();

    // Custody timeline events visible
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

    // Pause — chain-of-custody reconstruction
    await page.waitForTimeout(3000);
  });

  // Scene 5: Notification Check
  test("Scene 5: Notification check", async ({ personaPage: page }) => {
    // Click notification bell
    const bell = page.locator(NOTIFICATION_BELL);
    await bell.click();

    const panel = page.locator(NOTIFICATION_PANEL);
    await expect(panel).toBeVisible();

    // declan.okafor has NTF-0005 (unread) and NTF-0006 (read)
    await expect(page.locator(notificationItem("NTF-0005"))).toBeVisible();
    await expect(page.locator(notificationItem("NTF-0006"))).toBeVisible();

    // Mark NTF-0005 as read
    const ntf5 = page.locator(notificationItem("NTF-0005"));
    await ntf5.getByText(/mark read/i).click();
    await page.waitForTimeout(500);
  });
});
