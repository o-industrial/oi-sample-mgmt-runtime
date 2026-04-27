// deno-lint-ignore-file no-window no-unused-vars
/**
 * 14.11: Orchestrated Capstone — "A Day in the Collegeville Lab"
 *
 * Combines all 8 personas into a 5-act narrative.
 * Each act is a separate test for modularity.
 * Videos can be stitched with ffmpeg.
 *
 * The story: One day, from 7 AM morning triage through 4 PM compliance review.
 * Eight people, one system, zero email chains.
 */
import { expect, test as base } from "@playwright/test";
import { resetSeedData } from "../helpers/seed-reset";
import {
  MANAGEMENT_OVERLAY_TOGGLE,
  NOTIFICATION_BELL,
  NOTIFICATION_PANEL,
  notificationItem,
  sidebarLink,
  tab,
} from "../helpers/selectors";

type PersonaKey =
  | "elena"
  | "labManager"
  | "scientist"
  | "custodian"
  | "qaAuditor"
  | "studyCoordinator"
  | "csvGroupHead";

async function switchPersona(
  page: import("@playwright/test").Page,
  persona: PersonaKey,
) {
  await page.context().addCookies([
    {
      name: "demo_persona",
      value: persona,
      domain: "localhost",
      path: "/",
    },
  ]);
}

const test = base;

test.describe("Capstone — A Day in the Collegeville Lab", () => {
  test.beforeAll(async ({ browser }) => {
    // Seed data once for the capstone
    const page = await browser.newPage();
    await resetSeedData(page);
    await page.close();
  });

  // Act I: Morning Triage (7:00 AM) — Lab Manager
  test("Act I: Morning Triage — Lab Manager", async ({ page, context }) => {
    await switchPersona(page, "labManager");
    await page.goto("/");

    // Dashboard loads — admin stays on dashboard
    await expect(page).toHaveURL(/^[^?]*\/$/);

    // 5 activity panes visible
    await page.waitForTimeout(500);

    // System status visible
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    await page.waitForTimeout(500);

    // Management overlay open
    const toggleBtn = page.locator(MANAGEMENT_OVERLAY_TOGGLE);
    if (await toggleBtn.isVisible().catch(() => false)) {
      await toggleBtn.click();
      await page.waitForTimeout(500);
      // Capacity at 120% projected — over breakpoint
      await page.waitForTimeout(3000);
      await toggleBtn.click();
    }

    // Review queue: approve REV-2026-0001
    const rev1Row = page.locator('tr, [class*="review"]', {
      hasText: "REV-2026-0001",
    });
    const approveBtn = rev1Row.getByRole("button", { name: /approve/i });
    if (await approveBtn.isVisible().catch(() => false)) {
      await approveBtn.click();
      await page.waitForTimeout(1000);
    }

    // Escalate REV-2026-0002
    const rev2Row = page.locator('tr, [class*="review"]', {
      hasText: "REV-2026-0002",
    });
    const escalateBtn = rev2Row.getByRole("button", { name: /escalate/i });
    if (await escalateBtn.isVisible().catch(() => false)) {
      await escalateBtn.click();
      await page.waitForTimeout(1000);
    }

    // Check notification bell
    const bell = page.locator(NOTIFICATION_BELL);
    await bell.click();
    const panel = page.locator(NOTIFICATION_PANEL);
    await expect(panel).toBeVisible();
    await page.waitForTimeout(1000);
    await page.locator("body").click({ position: { x: 50, y: 50 } });
  });

  // Act II: Reception Rush (8:00 AM) — Sample Manager
  test("Act II: Reception Rush — Sample Manager", async ({ page }) => {
    await switchPersona(page, "elena");
    await page.goto("/");
    await page.waitForURL("**/receive");

    // Notification bell — cross-role handoff visible
    const bell = page.locator(NOTIFICATION_BELL);
    await bell.click();
    const panel = page.locator(NOTIFICATION_PANEL);
    await expect(panel).toBeVisible();
    await page.waitForTimeout(1000);
    await page.locator("body").click({ position: { x: 50, y: 50 } });

    // Manifest Upload tab
    const manifestTab = page.locator(tab("Manifest"));
    await manifestTab.click();
    await page.waitForTimeout(300);

    await page.getByLabel(/manifest/i).first().fill("MAN-2026-0416");
    const studySelect = page.getByLabel(/study/i).first();
    if (await studySelect.isVisible().catch(() => false)) {
      await studySelect.selectOption({ label: "BEACON-3 Phase III" });
    }
    const expectedField = page.getByLabel(/expected/i).first();
    if (await expectedField.isVisible().catch(() => false)) {
      await expectedField.fill("48");
    }
    const submitBtn = page.getByRole("button", { name: /submit|create|save/i });
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
      await page.waitForTimeout(500);
    }

    // Parcel Reception tab
    const parcelTab = page.locator(tab("Parcel"));
    await parcelTab.click();
    await page.waitForTimeout(300);
    const checkboxes = page.getByRole("checkbox");
    const count = await checkboxes.count();
    for (let i = 0; i < Math.min(count, 4); i++) {
      await checkboxes.nth(i).check();
    }
    const confirmBtn = page.getByRole("button", { name: /confirm|receipt/i });
    if (await confirmBtn.isVisible().catch(() => false)) {
      await confirmBtn.click();
      await page.waitForTimeout(500);
    }

    // Barcode Scanning tab
    const barcodeTab = page.locator(tab("Barcode"));
    await barcodeTab.click();
    await page.waitForTimeout(300);
    const scanInput = page.getByLabel(/barcode|sample|scan/i).first();
    if (await scanInput.isVisible().catch(() => false)) {
      for (
        const id of [
          "SMP-2026-88421-001",
          "SMP-2026-88421-002",
          "SMP-2026-87102-001",
        ]
      ) {
        await scanInput.fill(id);
        const scanBtn = page.getByRole("button", { name: /scan/i });
        if (await scanBtn.isVisible().catch(() => false)) {
          await scanBtn.click();
          await page.waitForTimeout(300);
        }
      }
    }

    // Reconciliation
    await page.locator(sidebarLink("/reconciliation")).click();
    await page.waitForURL("**/reconciliation");
    await expect(page.getByText("REC-2026-0003")).toBeVisible();
    await page.waitForTimeout(1000);
  });

  // Act III: Scientist Request (10:00 AM) — Scientist
  test("Act III: Scientist Request — Scientist", async ({ page }) => {
    await switchPersona(page, "scientist");
    await page.goto("/");
    await page.waitForURL("**/return");

    // Return requests visible
    const table = page.locator("table").first();
    await expect(table).toBeVisible();

    // RET-2026-0002 still "attention"
    await expect(page.getByText("RET-2026-0002")).toBeVisible();

    // No approve buttons
    await expect(page.getByRole("button", { name: /approve/i })).toHaveCount(0);

    // Notification check
    const bell = page.locator(NOTIFICATION_BELL);
    await bell.click();
    await page.waitForTimeout(1000);
    await page.locator("body").click({ position: { x: 50, y: 50 } });
  });

  // Act IV: Custodian Governance (1:00 PM) — HBSM Custodian
  test("Act IV: Custodian Governance — Custodian", async ({ page }) => {
    await switchPersona(page, "custodian");
    await page.goto("/");
    await page.waitForURL("**/disposition");

    // Review dispositions
    await expect(page.getByText("DSP-2026-0005")).toBeVisible();
    await expect(page.getByText("DSP-2026-0002")).toBeVisible();
    await page.waitForTimeout(1000);

    // Custody report drill-through
    await page.locator(sidebarLink("/report/custody")).click();
    await page.waitForURL("**/report/custody");

    const searchInput = page.getByLabel(/search|sample/i).first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill("SMP-2026-83100-001");
      const searchBtn = page.getByRole("button", { name: /search/i });
      if (await searchBtn.isVisible().catch(() => false)) {
        await searchBtn.click();
      }
      await page.waitForTimeout(1000);
    }

    await expect(page.getByText("SMP-2026-83100-001")).toBeVisible();

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
    await page.waitForTimeout(1000);

    // Notification check
    const bell = page.locator(NOTIFICATION_BELL);
    await bell.click();
    await expect(page.locator(notificationItem("NTF-0005"))).toBeVisible();
    await page.waitForTimeout(500);
  });

  // Act V: Afternoon Oversight (3:00 PM) — QA + Coordinator + CSV Head
  test("Act V Part 1: QA Auditor", async ({ page }) => {
    await switchPersona(page, "qaAuditor");
    await page.goto("/");
    await page.waitForURL("**/report/audit-trail");

    // Audit trail visible
    const table = page.locator("table").first();
    await expect(table).toBeVisible();

    // Filter by "Approve"
    const actionFilter = page.getByLabel(/action|type/i).first();
    if (await actionFilter.isVisible().catch(() => false)) {
      await actionFilter.selectOption("Approve");
      await page.waitForTimeout(500);
      await actionFilter.selectOption("");
    }

    // Ethics — ONCO-2024-03 expiring
    await page.goto("/report/ethics-approval");
    await page.waitForURL("**/report/ethics-approval");
    await expect(page.getByText("ONCO-2024-03")).toBeVisible();
    await page.waitForTimeout(1000);

    // Export CSV
    await page.goto("/report/audit-trail");
    const exportBtn = page.getByRole("button", { name: /export|csv/i });
    if (await exportBtn.isVisible().catch(() => false)) {
      await exportBtn.click();
    }
    await page.waitForTimeout(500);
  });

  test("Act V Part 2: Study Coordinator", async ({ page }) => {
    await switchPersona(page, "studyCoordinator");
    await page.goto("/");
    await page.waitForURL("**/track/samples");

    // Filter by BEACON-3
    const searchInput = page.getByLabel(/search|study|sample/i).first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill("BEACON-3");
      await page.waitForTimeout(500);
    }

    // Drill to custody report
    const viewLink = page.locator("a, button", {
      hasText: /view|report/i,
    }).first();
    if (await viewLink.isVisible().catch(() => false)) {
      await viewLink.click();
      await page.waitForTimeout(1000);
    }

    // Ethics check
    await page.goto("/report/ethics-approval");
    await expect(page.getByText("BEACON-3")).toBeVisible();
    await page.waitForTimeout(1000);
  });

  test("Act V Part 3: CSV Group Head — Escalation Resolution", async ({ page }) => {
    await switchPersona(page, "csvGroupHead");
    await page.goto("/");

    // Dashboard visible
    await expect(page).toHaveURL(/^[^?]*\/$/);

    // Notification bell — escalation from Lab Manager in Act I
    const bell = page.locator(NOTIFICATION_BELL);
    await bell.click();
    const panel = page.locator(NOTIFICATION_PANEL);
    await expect(panel).toBeVisible();

    // NTF-0009: escalation notification
    const ntf9 = page.locator(notificationItem("NTF-0009"));
    if (await ntf9.isVisible().catch(() => false)) {
      // Click View → navigates to /reconciliation via ActionUrl
      await ntf9.getByText(/view/i).click();
      await page.waitForURL("**/reconciliation");
      await page.waitForTimeout(2000);

      // Navigate back to dashboard
      await page.goto("/");
    }

    // Review queue — approve escalated review
    const reviewHeading = page.getByText(/review/i).first();
    await reviewHeading.scrollIntoViewIfNeeded();

    const rev5Row = page.locator('tr, [class*="review"]', {
      hasText: "REV-2026-0005",
    });
    const approveBtn = rev5Row.getByRole("button", { name: /approve/i });
    if (await approveBtn.isVisible().catch(() => false)) {
      await approveBtn.click();
      // Pause — escalation chain complete
      await page.waitForTimeout(3000);
    }

    // System status check
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
    await page.waitForTimeout(1000);

    // Final shot — scroll back to dashboard overview
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    await page.waitForTimeout(2000);
  });
});
