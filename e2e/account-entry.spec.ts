import { expect, test } from '@playwright/test';

for (const width of [390, 768, 900]) {
test(`compact navigation at ${width}px closes after route and homepage anchor selection`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 });
  await page.goto('/moje');
  const menu = page.locator('summary[aria-label="Otevřít menu"]');
  await menu.click();
  await page.locator('details[open]').getByRole('link', { name: 'Moje případy', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Moje případy', level: 1 })).toBeVisible();
  await expect(page.locator('details[open]')).toHaveCount(0);
  await page.goto('/');
  await menu.click();
  await page.locator('details[open]').getByRole('link', { name: 'Situace', exact: true }).click();
  await expect(page.locator('details[open]')).toHaveCount(0);
  await menu.click();
  await menu.press('Escape');
  await expect(page.locator('details[open]')).toHaveCount(0);
  await expect(menu).toBeFocused();
});
}

test('password reset survives refresh and remains usable with an existing session', async ({ page }) => {
  const user = { id: 'reset-user', username: 'reset-user', email: 'reset@example.com', displayName: 'Reset User', emailVerified: true, createdAt: '2026-09-18T00:00:00.000Z', lastLoginAt: null };
  await page.route('**/api/account', async (route) => {
    if (route.request().method() === 'GET') return route.fulfill({ json: { authenticated: true, user, csrf: 'old-csrf' } });
    expect(route.request().postDataJSON()).toEqual({ action: 'reset_password', token: 'reset-test-token', password: 'new-password-2026' });
    return route.fulfill({ json: { ok: true, user, csrf: 'new-csrf' } });
  });
  await page.goto('/moje#reset=reset-test-token');
  await expect(page.getByLabel('Nové heslo', { exact: true })).toBeVisible();
  await page.reload();
  await page.getByLabel('Nové heslo', { exact: true }).fill('new-password-2026');
  await page.getByRole('button', { name: 'Nastavit nové heslo', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Heslo bylo změněno a jste přihlášeni.');
  await expect(page.getByRole('heading', { name: 'Údaje účtu' })).toBeVisible();
  expect(page.url()).not.toContain('reset=');
});

test('missing password reset token explains how to recover', async ({ page }) => {
  await page.route('**/api/account', (route) => route.fulfill({ json: { authenticated: false } }));
  await page.goto('/moje?mode=reset');
  await expect(page.getByText('Odkaz pro změnu hesla chybí nebo byl z adresy odstraněn. Vyžádejte si nový.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Nastavit nové heslo', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Zapomenuté heslo' }).click();
  await expect(page.getByRole('button', { name: 'Poslat odkaz pro nové heslo' })).toBeVisible();
});

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
  await expect(page.getByRole('complementary').getByRole('link', { name: 'Moje případy' })).toBeVisible();
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
  await page.locator('details[open]').getByRole('link', { name: 'Můj účet', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Můj účet', level: 1 })).toBeVisible();
});
