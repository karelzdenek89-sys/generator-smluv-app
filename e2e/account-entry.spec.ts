import { expect, test } from '@playwright/test';

test('account entry exposes username/password registration and recovery', async ({ page }) => {
  await page.route('**/api/account', async (route) => {
    if (route.request().method() === 'GET') return route.fulfill({ json: { authenticated: false } });
    return route.fulfill({ status: 400, json: { error: 'mocked' } });
  });

  await page.goto('/moje');
  await expect(page.getByRole('heading', { name: 'Můj účet', level: 1 })).toBeVisible();
  await expect(page.getByLabel('Uživatelské jméno nebo e-mail')).toBeVisible();
  await expect(page.getByLabel('Heslo', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Registrace' }).click();
  await expect(page.getByLabel('Uživatelské jméno', { exact: true })).toBeVisible();
  await expect(page.locator('#register-email')).toBeVisible();
  await expect(page.getByLabel('Heslo', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'obchodními podmínkami' })).toHaveAttribute('href', '/obchodni-podminky');
  await expect(page.getByRole('link', { name: 'zásadami ochrany osobních údajů' })).toHaveAttribute('href', '/gdpr');

  await page.getByRole('button', { name: 'Zapomenuté heslo' }).click();
  await expect(page.getByRole('button', { name: 'Poslat odkaz pro nové heslo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Moje případy' })).toBeVisible();
});

test('authenticated account connects profile, documents and cases', async ({ page }) => {
  await page.route('**/api/account', async (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        json: {
          authenticated: true,
          csrf: 'test-csrf',
          user: {
            id: '11111111-1111-4111-8111-111111111111',
            username: 'karel',
            email: 'karel@example.cz',
            displayName: 'Karel',
            emailVerified: true,
            createdAt: '2026-09-18T00:00:00.000Z',
            lastLoginAt: '2026-09-18T00:00:00.000Z',
          },
        },
      });
    }
    return route.fulfill({ json: { ok: true } });
  });

  await page.goto('/moje');
  await expect(page.getByRole('heading', { name: 'Moje dokumenty' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Moje případy' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Údaje účtu' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Změnit heslo' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Smazání účtu' })).toBeVisible();
});

test('homepage customer menu contains account, cases and documents', async ({ page }) => {
  await page.goto('/');
  const customerMenu = page.locator('summary[aria-label="Moje"]');
  await customerMenu.click();
  await expect(page.getByRole('link', { name: 'Můj účet' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Moje případy' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Moje dokumenty' }).first()).toBeVisible();
});
