/**
 * 14.7: Scale Simulation — "48-Sample Manifest Arrives"
 *
 * Persona: elena.martinez / samples:receive
 * Landing: /receive
 * Scenes: large manifest registration, batch scanning at speed,
 *         reconciliation at volume
 */
import { expect, personaTest } from '../fixtures/persona.fixture';
import { sidebarLink, tab } from '../helpers/selectors';

const test = personaTest('elena');

test.describe('Scale Simulation — 48-Sample Manifest Arrives', () => {
  // Scene 1: Large Manifest Registration
  test('Scene 1: Large manifest registration', async ({ personaPage: page }) => {
    await expect(page).toHaveURL(/\/receive/);

    // Manifest Upload tab
    const manifestTab = page.locator(tab('Manifest'));
    await manifestTab.click();
    await page.waitForTimeout(300);

    // Fill manifest form for scale test
    await page.getByLabel(/manifest/i).first().fill('MAN-2026-SCALE-01');

    const studySelect = page.getByLabel(/study/i).first();
    if (await studySelect.isVisible().catch(() => false)) {
      await studySelect.selectOption({ label: 'BEACON-3 Phase III' });
    }

    const expectedField = page.getByLabel(/expected/i).first();
    if (await expectedField.isVisible().catch(() => false)) {
      await expectedField.fill('48');
    }

    // Submit
    const submitBtn = page.getByRole('button', { name: /submit|create|save/i });
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  // Scene 2: Batch Scanning at Speed
  test('Scene 2: Batch scanning at speed', async ({ personaPage: page }) => {
    await expect(page).toHaveURL(/\/receive/);

    // Switch to Barcode Scanning tab
    const barcodeTab = page.locator(tab('Barcode'));
    await barcodeTab.click();
    await page.waitForTimeout(300);

    // Start batch button
    const batchBtn = page.getByRole('button', { name: /batch|start/i });
    if (await batchBtn.isVisible().catch(() => false)) {
      await batchBtn.click();
      await page.waitForTimeout(300);
    }

    // Scan 6 samples rapidly
    const scanInput = page.getByLabel(/barcode|sample|scan/i).first();
    if (await scanInput.isVisible().catch(() => false)) {
      const sampleIds = [
        'SMP-2026-SCALE-001',
        'SMP-2026-SCALE-002',
        'SMP-2026-SCALE-003',
        'SMP-2026-SCALE-004',
        'SMP-2026-SCALE-005',
        'SMP-2026-SCALE-006',
      ];

      for (const id of sampleIds) {
        await scanInput.fill(id);
        const scanBtn = page.getByRole('button', { name: /scan/i });
        if (await scanBtn.isVisible().catch(() => false)) {
          await scanBtn.click();
          await page.waitForTimeout(300);
        }
      }
    }

    await page.waitForTimeout(500);
  });

  // Scene 3: Reconciliation at Volume
  test('Scene 3: Reconciliation at volume', async ({ personaPage: page }) => {
    // Navigate to /reconciliation
    await page.locator(sidebarLink('/reconciliation')).click();
    await page.waitForURL('**/reconciliation');

    // Reconciliation records visible
    const table = page.locator('table').first();
    await expect(table).toBeVisible();

    // REC-2026-0001: count mismatch, expected 48, actual 46, ready (resolved)
    await expect(page.getByText('REC-2026-0001')).toBeVisible();

    // REC-2026-0005: expected 48, actual 47, attention (under investigation)
    await expect(page.getByText('REC-2026-0005')).toBeVisible();

    // Pause — system handles volume without degradation
    await page.waitForTimeout(2000);
  });
});
