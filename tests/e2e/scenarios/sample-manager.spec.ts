/**
 * 14.3: Sample Manager — "Morning at the Bench"
 *
 * Persona: elena.martinez / samples:receive
 * Landing: /receive (redirected from /)
 * Scenes: notification triage, manifest upload, temperature logs,
 *         parcel reception, barcode scanning, reconciliation check
 */
import { expect, personaTest } from '../fixtures/persona.fixture';
import {
  NOTIFICATION_BELL,
  NOTIFICATION_PANEL,
  notificationItem,
  sidebarLink,
  tab,
} from '../helpers/selectors';

const test = personaTest('elena');

test.describe('Sample Manager — Morning at the Bench', () => {
  // Scene 1: Notification Triage
  test('Scene 1: Notification triage', async ({ personaPage: page }) => {
    // Elena lands on /receive
    await expect(page).toHaveURL(/\/receive/);

    // Notification bell visible in header
    const bell = page.locator(NOTIFICATION_BELL);
    await expect(bell).toBeVisible();

    // Badge shows unread count
    const badge = bell.locator('span').first();
    await expect(badge).toBeVisible();

    // Click bell → dropdown opens
    await bell.click();
    const panel = page.locator(NOTIFICATION_PANEL);
    await expect(panel).toBeVisible();

    // Notifications visible (elena has NTF-0001, NTF-0002, NTF-0003, NTF-0004)
    await expect(panel.locator('[data-testid^="notification-"]')).toHaveCount(
      4,
    );

    // Click "Mark read" on NTF-0001
    const ntf1 = page.locator(notificationItem('NTF-0001'));
    await ntf1.getByText(/mark read/i).click();
    await page.waitForTimeout(500);

    // Click "View" on NTF-0002 (actionUrl: /disposition)
    const ntf2 = page.locator(notificationItem('NTF-0002'));
    await ntf2.getByText(/view/i).click();

    // Should navigate to /disposition via ActionUrl
    await page.waitForURL('**/disposition');
    await expect(page).toHaveURL(/\/disposition/);

    // Pause — disposition table visible
    await page.waitForTimeout(2000);

    // Navigate back to /receive via sidebar
    await page.locator(sidebarLink('/receive')).click();
    await page.waitForURL('**/receive');
  });

  // Scene 2: Manifest Upload
  test('Scene 2: Manifest upload', async ({ personaPage: page }) => {
    await expect(page).toHaveURL(/\/receive/);

    // Tab 1 (Manifest Upload) should be active by default
    const manifestTab = page.locator(tab('Manifest'));
    await expect(manifestTab).toBeVisible();
    await manifestTab.click();

    // Fill manifest form fields
    await page.getByLabel(/manifest/i).first().fill('MAN-2026-0416');

    // Select study
    const studySelect = page.getByLabel(/study/i).first();
    if (await studySelect.isVisible()) {
      await studySelect.selectOption({ label: 'BEACON-3 Phase III' });
    }

    // Expected samples
    const expectedField = page.getByLabel(/expected/i).first();
    if (await expectedField.isVisible()) {
      await expectedField.fill('48');
    }

    // Fill remaining visible fields
    const fields = [
      { label: /origin/i, value: 'London Clinical Lab' },
      { label: /destination/i, value: 'Collegeville US' },
      { label: /waybill/i, value: 'WB-2026-04-16-001' },
      { label: /carrier/i, value: 'World Courier' },
      { label: /period/i, value: 'Period 3' },
    ];

    for (const { label, value } of fields) {
      const field = page.getByLabel(label).first();
      if (await field.isVisible().catch(() => false)) {
        await field.fill(value);
      }
    }

    // Submit
    const submitBtn = page.getByRole('button', { name: /submit|create|save/i });
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  // Scene 3: Temperature Logs
  test('Scene 3: Temperature logs', async ({ personaPage: page }) => {
    await expect(page).toHaveURL(/\/receive/);

    // Click Tab 3 (Temperature Logs)
    const tempTab = page.locator(tab('Temperature'));
    await expect(tempTab).toBeVisible();
    await tempTab.click();
    await page.waitForTimeout(500);

    // Temperature log content should be visible
    const content = page.locator('main, [role="main"], .content, section')
      .first();
    await expect(content).toBeVisible();

    // Pause for demo — cold chain compliance
    await page.waitForTimeout(2000);
  });

  // Scene 4: Parcel Reception
  test('Scene 4: Parcel reception', async ({ personaPage: page }) => {
    await expect(page).toHaveURL(/\/receive/);

    // Click Tab 2 (Parcel Reception)
    const parcelTab = page.locator(tab('Parcel'));
    await expect(parcelTab).toBeVisible();
    await parcelTab.click();
    await page.waitForTimeout(500);

    // Check the 4 checklist items
    const checkboxes = page.getByRole('checkbox');
    const count = await checkboxes.count();
    for (let i = 0; i < Math.min(count, 4); i++) {
      await checkboxes.nth(i).check();
    }

    // Note two-person auth fields
    const verifiedByField = page.getByLabel(/verified/i).first();
    if (await verifiedByField.isVisible().catch(() => false)) {
      await verifiedByField.fill('James Wilson');
    }

    // Click Confirm Receipt
    const confirmBtn = page.getByRole('button', {
      name: /confirm|receipt/i,
    });
    if (await confirmBtn.isVisible().catch(() => false)) {
      await confirmBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  // Scene 5: Barcode Scanning
  test('Scene 5: Barcode scanning', async ({ personaPage: page }) => {
    await expect(page).toHaveURL(/\/receive/);

    // Click Tab 4 (Barcode Scanning)
    const barcodeTab = page.locator(tab('Barcode'));
    await expect(barcodeTab).toBeVisible();
    await barcodeTab.click();
    await page.waitForTimeout(500);

    // Type sample ID into scanner input
    const scanInput = page.getByLabel(/barcode|sample|scan/i).first();
    if (await scanInput.isVisible().catch(() => false)) {
      await scanInput.fill('SMP-2026-88421-001');
      const scanBtn = page.getByRole('button', { name: /scan/i });
      if (await scanBtn.isVisible().catch(() => false)) {
        await scanBtn.click();
        await page.waitForTimeout(500);
      }

      // Scan 2 more
      await scanInput.fill('SMP-2026-88421-002');
      await page.getByRole('button', { name: /scan/i }).click();
      await page.waitForTimeout(300);

      await scanInput.fill('SMP-2026-87102-001');
      await page.getByRole('button', { name: /scan/i }).click();
      await page.waitForTimeout(500);
    }
  });

  // Scene 6: Reconciliation Check
  test('Scene 6: Reconciliation check', async ({ personaPage: page }) => {
    // Navigate to /reconciliation via sidebar
    await page.locator(sidebarLink('/reconciliation')).click();
    await page.waitForURL('**/reconciliation');

    // Reconciliation records visible
    const table = page.locator('table').first();
    await expect(table).toBeVisible();

    // Status summary cards visible
    await page.waitForTimeout(500);

    // Filter by type → barcode-conflict
    const typeFilter = page.getByLabel(/type/i).first();
    if (await typeFilter.isVisible().catch(() => false)) {
      await typeFilter.selectOption('barcode-conflict');
      await page.waitForTimeout(500);
    }

    // REC-2026-0003 should be visible (barcode conflict, problem status)
    await expect(page.getByText('REC-2026-0003')).toBeVisible();

    // Pause on TurboTax color coding
    await page.waitForTimeout(3000);
  });
});
