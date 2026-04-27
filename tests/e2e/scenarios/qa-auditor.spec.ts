// deno-lint-ignore-file no-unused-vars
/**
 * 14.8: QA Auditor — "Compliance Deep Dive"
 *
 * Persona: annika.desrosiers / compliance:export
 * Landing: /report/audit-trail (redirected from /)
 * Scenes: audit trail landing, ALCOA+ filtering, failed event investigation,
 *         CSV export, ethics approval + renewal, custody report
 */
import { expect, personaTest } from "../fixtures/persona.fixture";
import {
  NOTIFICATION_BELL,
  NOTIFICATION_PANEL,
  notificationItem,
} from "../helpers/selectors";

const test = personaTest("qaAuditor");

test.describe("QA Auditor — Compliance Deep Dive", () => {
  // Scene 1: Audit Trail Landing
  test("Scene 1: Audit trail landing", async ({ personaPage: page }) => {
    // QA Auditor lands on /report/audit-trail
    await expect(page).toHaveURL(/\/report\/audit-trail/);

    // Sub-navigation tabs visible
    await expect(page.getByText(/audit trail/i).first()).toBeVisible();

    // 9 audit events visible (6 original + 3 extended)
    const table = page.locator("table").first();
    await expect(table).toBeVisible();
  });

  // Scene 2: ALCOA+ Principle Filtering
  test("Scene 2: ALCOA+ principle filtering", async ({ personaPage: page }) => {
    await expect(page).toHaveURL(/\/report\/audit-trail/);

    // ALCOA principle badges visible
    await page.waitForTimeout(500);

    // Filter by action type "Approve"
    const actionFilter = page.getByLabel(/action|type/i).first();
    if (await actionFilter.isVisible().catch(() => false)) {
      await actionFilter.selectOption("Approve");
      await page.waitForTimeout(500);

      // EVT-0004 and EVT-0005 should be visible (Attributable)
      await expect(page.getByText("EVT-0004")).toBeVisible();
      await expect(page.getByText("EVT-0005")).toBeVisible();
    }

    // Clear filter and filter by "Scan"
    if (await actionFilter.isVisible().catch(() => false)) {
      await actionFilter.selectOption("Scan");
      await page.waitForTimeout(500);

      // EVT-0001 should be visible (Contemporaneous)
      await expect(page.getByText("EVT-0001")).toBeVisible();
    }

    // Clear filter
    if (await actionFilter.isVisible().catch(() => false)) {
      await actionFilter.selectOption("");
      await page.waitForTimeout(300);
    }
  });

  // Scene 3: Failed Event Investigation
  test("Scene 3: Failed event investigation", async ({ personaPage: page }) => {
    await expect(page).toHaveURL(/\/report\/audit-trail/);

    // EVT-0006 — failed status
    await expect(page.getByText("EVT-0006")).toBeVisible();

    // Status badge shows "failed"
    await expect(page.getByText(/failed/i).first()).toBeVisible();

    // Pause — audit trail captures failures, not just successes
    await page.waitForTimeout(3000);
  });

  // Scene 4: CSV Export
  test("Scene 4: CSV export", async ({ personaPage: page }) => {
    await expect(page).toHaveURL(/\/report\/audit-trail/);

    // Click Export CSV button
    const exportBtn = page.getByRole("button", { name: /export|csv/i });
    if (await exportBtn.isVisible().catch(() => false)) {
      await exportBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  // Scene 5: Ethics Approval + Renewal Action
  test("Scene 5: Ethics approval and renewal", async ({ personaPage: page }) => {
    // Navigate to ethics approval sub-tab
    const ethicsLink = page.getByRole("link", { name: /ethics/i }).first();
    if (await ethicsLink.isVisible().catch(() => false)) {
      await ethicsLink.click();
    } else {
      await page.goto("/report/ethics-approval");
    }
    await page.waitForURL("**/report/ethics-approval");

    // 3 ethics approvals visible
    // ONCO-2024-03: expiring with red badge
    await expect(page.getByText("ONCO-2024-03")).toBeVisible();
    await expect(page.getByText(/expir/i).first()).toBeVisible();

    // BEACON-3: active with green badge
    await expect(page.getByText("BEACON-3")).toBeVisible();

    // LEGACY-2023-01: expired
    await expect(page.getByText("LEGACY-2023-01")).toBeVisible();

    // Pause on ONCO-2024-03 — regulatory urgency
    await page.waitForTimeout(2000);

    // Click "Renew" button on ONCO-2024-03
    const oncoRow = page.locator('tr, [class*="card"]', {
      hasText: "ONCO-2024-03",
    });
    const renewBtn = oncoRow.getByRole("button", { name: /renew/i });
    if (await renewBtn.isVisible().catch(() => false)) {
      await renewBtn.click();
      await page.waitForTimeout(2000);
    }
  });

  // Scene 6: Custody Report
  test("Scene 6: Custody report", async ({ personaPage: page }) => {
    // Navigate to custody report
    const custodyLink = page.getByRole("link", { name: /custody/i }).first();
    if (await custodyLink.isVisible().catch(() => false)) {
      await custodyLink.click();
    } else {
      await page.goto("/report/custody");
    }
    await page.waitForURL("**/report/custody");

    // Search for sample
    const searchInput = page.getByLabel(/search|sample/i).first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill("SMP-2026-87102-001");
      const searchBtn = page.getByRole("button", { name: /search/i });
      if (await searchBtn.isVisible().catch(() => false)) {
        await searchBtn.click();
      }
      await page.waitForTimeout(1000);
    }

    // Sample card shows metadata
    await expect(page.getByText("SMP-2026-87102-001")).toBeVisible();

    // Timeline with ALCOA badges
    await page.waitForTimeout(500);

    // Toggle to table view
    const tableToggle = page.getByRole("button", { name: /table/i });
    if (await tableToggle.isVisible().catch(() => false)) {
      await tableToggle.click();
      await page.waitForTimeout(500);
    }

    // Pause — chain-of-custody reconstruction
    await page.waitForTimeout(2000);
  });
});
