/**
 * Labour-law blocks (2026 minimum wage, the 300 h DPP cap) must stop the buyer
 * at the generate button, not after they opened the payment modal, typed an
 * e-mail and ticked consent — there they surfaced only as an alert() that the
 * pay click silently swallowed.
 */
import { expect, test, type Page } from '@playwright/test';

async function waitForBuilder(page: Page) {
  await expect(page.locator('main h1').first()).toBeVisible();
  // The draft effect signals that the builder has mounted and restored its state.
  await page.waitForFunction(() => Object.keys(sessionStorage).some((key) => key.startsWith(`sh_builder_draft:${location.pathname}:`)));
}

test('employment contract below the minimum wage is flagged before the payment modal opens', async ({ page }) => {
  await page.goto('/pracovni');
  await waitForBuilder(page);
  await page.locator('[name="employerName"]').fill('Test s.r.o.');
  await page.locator('[name="employeeName"]').fill('Jan Novák');
  await page.locator('[name="jobTitle"]').fill('Skladník');
  await page.locator('[name="workPlace"]').fill('Praha');
  await page.locator('[name="startDate"]').fill('2026-11-01');
  await page.locator('[name="salary"]').fill('15000');

  const generate = page.locator('[data-builder-generate]').first();
  await generate.click();
  const notice = page.locator('[data-builder-blocking-notice]');
  await expect(notice).toBeVisible();
  await expect(notice).toContainText('22 400');
  await expect(page.getByTestId('lease-checkout-modal')).toHaveCount(0);

  await page.locator('[name="salary"]').fill('30000');
  await expect(notice).toHaveCount(0);
  await generate.click();
  await expect(page.getByTestId('lease-checkout-modal')).toBeVisible();
});

test('DPP above the 300 hour cap is flagged before the payment modal opens', async ({ page }) => {
  await page.goto('/dpp');
  await waitForBuilder(page);
  await page.locator('[name="employerName"]').fill('Test s.r.o.');
  await page.locator('[name="employeeName"]').fill('Jan Novák');
  await page.locator('[name="taskDescription"]').fill('Inventura skladu');
  await page.locator('[name="workPlace"]').fill('Praha');
  await page.locator('[name="estimatedHours"]').fill('400');
  const remunerationType = await page.locator('[name="remunerationType"]').inputValue();
  await page.locator(remunerationType === 'hourly' ? '[name="hourlyRate"]' : '[name="totalRemuneration"]')
    .fill(remunerationType === 'hourly' ? '200' : '80000');

  const generate = page.locator('[data-builder-generate]').first();
  await generate.click();
  const notice = page.locator('[data-builder-blocking-notice]');
  await expect(notice).toBeVisible();
  await expect(notice).toContainText('300');
  await expect(page.getByTestId('lease-checkout-modal')).toHaveCount(0);

  await page.locator('[name="estimatedHours"]').fill('80');
  await expect(notice).toHaveCount(0);
  await generate.click();
  await expect(page.getByTestId('lease-checkout-modal')).toBeVisible();
});
