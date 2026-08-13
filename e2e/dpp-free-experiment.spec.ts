import { expect, test } from '@playwright/test';

const ENABLED = process.env.FREE_FUNNEL_EXPERIMENTS_ENABLED === 'true';

test.describe('DPP free experiment', () => {
  test.skip(!ENABLED, 'requires FREE_FUNNEL_EXPERIMENTS_ENABLED=true at build and runtime');

  test('creates a token-protected basic PDF without email or Stripe', async ({ page }) => {
    const token = 'f'.repeat(64);
    let createBody: Record<string, unknown> | null = null;
    let downloadBody: Record<string, unknown> | null = null;

    await page.route('**/api/analytics', (route) => route.fulfill({ status: 204, body: '' }));
    await page.route('**/api/contracts/free', async (route) => {
      createBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ freeId: 'free_browser_test', token, expiresInSeconds: 86_400 }),
      });
    });
    await page.route('**/api/contracts/free/download', async (route) => {
      downloadBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        headers: { 'Content-Disposition': 'attachment; filename="dpp.pdf"' },
        body: '%PDF-1.4\n%%EOF',
      });
    });
    await page.route('**/api/contracts/free/status', (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'ready', partnerContext: null, partnerOffers: [] }),
    }));

    await page.goto('/dpp');
    await expect(page.getByRole('button', { name: /Vygenerovat základní DPP zdarma/i })).toBeVisible();
    await page.locator('[name="employerName"]').fill('Test Zaměstnavatel');
    await page.locator('[name="employeeName"]').fill('Test Pracovník');
    await page.locator('[name="taskDescription"]').fill('Interní ověření dokumentu');
    await page.locator('[name="workPlace"]').fill('Praha');
    await page.locator('[name="estimatedHours"]').fill('8');
    await page.locator('[name="startDate"]').fill('2026-08-14');
    await page.locator('[name="endDate"]').fill('2026-08-15');
    await page.locator('[name="totalRemuneration"]').fill('2000');

    await page.locator('[data-builder-generate]').click();
    const dialog = page.getByTestId('lease-checkout-modal');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByTestId('checkout-delivery-email')).toHaveCount(0);
    await expect(dialog.getByText('Zdarma', { exact: true }).first()).toBeVisible();

    await dialog.getByTestId('lease-checkout-consent').check();
    await dialog.getByTestId('lease-checkout-pay').click();

    await expect.poll(() => createBody).not.toBeNull();
    expect(createBody).toMatchObject({ contractType: 'dpp', tier: 'basic', lang: 'cs' });
    expect(createBody?.consent).toMatchObject({
      accepted: true,
      termsVersion: '2026-08-13',
      privacyVersion: '2026-08-13',
    });

    await expect(page).toHaveURL(/\/stahnout\?free_id=free_browser_test&lang=cs$/);
    await expect.poll(() => downloadBody).toEqual({ freeId: 'free_browser_test', token });
    await expect(page.getByText('Stahování bylo zahájeno.')).toBeVisible();
  });
});
