/**
 * 14.5: Scientist — "Scientist Needs Samples Back"
 *
 * Persona: dr.james.chen / scientist:request
 * Landing: /return (redirected from /)
 * Scenes: role redirect, return requests, navigation constraint, notification check
 */
import { expect, personaTest } from '../fixtures/persona.fixture';
import {
  NOTIFICATION_BELL,
  NOTIFICATION_PANEL,
  sidebarLink,
} from '../helpers/selectors';

const test = personaTest('scientist');

test.describe('Scientist — Scientist Needs Samples Back', () => {
  // Scene 1: Role Redirect
  test('Scene 1: Role redirect to /return', async ({ personaPage: page }) => {
    // Scientist navigates to / → immediate redirect to /return
    await expect(page).toHaveURL(/\/return/);
    // The scientist never sees the dashboard — this IS the demo moment
  });

  // Scene 2: Return Requests
  test('Scene 2: Return requests view', async ({ personaPage: page }) => {
    await expect(page).toHaveURL(/\/return/);

    // Return records visible in table
    const table = page.locator('table').first();
    await expect(table).toBeVisible();

    // 5 return records expected
    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(5);

    // Status summary cards visible
    await page.waitForTimeout(500);

    // Filter by status "attention"
    const statusFilter = page.getByLabel(/status/i).first();
    if (await statusFilter.isVisible().catch(() => false)) {
      await statusFilter.selectOption('attention');
      await page.waitForTimeout(500);
    }

    // No Approve button visible (scientist lacks custody:approve)
    const approveBtn = page.getByRole('button', { name: /approve/i });
    await expect(approveBtn).toHaveCount(0);
  });

  // Scene 3: Navigation Constraint
  test('Scene 3: Navigation constraint', async ({ personaPage: page }) => {
    // Sidebar nav links visible
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Navigate to /track/samples — scientist has some visibility
    await page.locator(sidebarLink('/track/samples')).click();
    await page.waitForURL('**/track/samples');
    await expect(page).toHaveURL(/\/track\/samples/);

    // Navigate back to /return — scientist's primary surface
    await page.locator(sidebarLink('/return')).click();
    await page.waitForURL('**/return');
  });

  // Scene 4: Notification Check
  test('Scene 4: Notification check', async ({ personaPage: page }) => {
    // Click notification bell
    const bell = page.locator(NOTIFICATION_BELL);
    await expect(bell).toBeVisible();
    await bell.click();

    // Panel opens (may be empty for dr.james.chen)
    const panel = page.locator(NOTIFICATION_PANEL);
    await expect(panel).toBeVisible();
    await page.waitForTimeout(1000);

    // Close panel by clicking outside
    await page.locator('body').click({ position: { x: 50, y: 50 } });
  });
});
