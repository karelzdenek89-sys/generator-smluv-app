import { expect, test } from '@playwright/test';

test.describe('customer portal and admin access', () => {
  test('English customer zone is fully localized and mobile-safe', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => localStorage.removeItem('cookies_accepted'));
    await page.goto('/zakaznicka-zona?lang=en');

    await expect(page.getByRole('heading', { name: 'My documents' })).toBeVisible();
    await expect(page.getByLabel('Email used for payment')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Show document' })).toBeVisible();
    await expect(page.getByRole('dialog', { name: 'Cookie information' })).toContainText('This website uses');
    await expect.poll(() => page.locator('html').getAttribute('lang')).toBe('en');

    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      emailFontSize: Number.parseFloat(getComputedStyle(document.querySelector('input[type="email"]')!).fontSize),
    }));
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
    expect(metrics.emailFontSize).toBeGreaterThanOrEqual(16);
  });

  test('Ukrainian customer zone uses Ukrainian copy', async ({ page }) => {
    await page.goto('/zakaznicka-zona?lang=ua');
    await expect(page.getByRole('heading', { name: 'Мої документи' })).toBeVisible();
    await expect(page.getByLabel('E-mail, використаний для оплати')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Показати документ' })).toBeVisible();
    await expect.poll(() => page.locator('html').getAttribute('lang')).toBe('uk');
  });

  test('admin login requires both the approved identity and a password', async ({ page }) => {
    await page.goto('/interni/analytics/prihlaseni');
    await expect(page.getByRole('heading', { name: 'Interní reporting' })).toBeVisible();
    await expect(page.getByLabel('Administrátorský e-mail')).toHaveAttribute('required', '');
    await expect(page.getByLabel('Přístupové heslo')).toHaveAttribute('required', '');
    await expect(page.locator('form[action="/interni/analytics/auth"]')).toHaveCount(1);
    await expect(page.getByText('Údaje se nepřenášejí v URL.')).toBeVisible();
  });
});
