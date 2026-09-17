import { expect, test } from '@playwright/test';

test('customer zone preserves English and Ukrainian UI', async ({ page }) => {
  await page.goto('/zakaznicka-zona?lang=en');
  await expect(page.getByRole('heading', { name: 'My documents' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send secure access link' })).toBeVisible();
  await expect(page.locator('main')).toHaveAttribute('lang', 'en');

  await page.goto('/zakaznicka-zona?lang=ua');
  await expect(page.getByRole('heading', { name: 'Мої документи' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Надіслати безпечне посилання' })).toBeVisible();
  await expect(page.locator('main')).toHaveAttribute('lang', 'uk');
});

test('tablet header uses compact navigation until desktop width', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/faq');
  await expect(page.locator('[data-site-header="global"] summary')).toBeVisible();
  await expect(page.locator('[data-site-header="global"] > div > nav')).toBeHidden();

  await page.setViewportSize({ width: 1120, height: 900 });
  await page.reload();
  await expect(page.locator('[data-site-header="global"] > div > nav')).toBeVisible();
  await expect(page.locator('[data-site-header="global"] summary')).toBeHidden();
});

test('case hub and legislation watch surfaces are discoverable and private', async ({ page, request }) => {
  const cases = await page.goto('/moje-pripady');
  expect(cases?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: /Moje případy/i })).toBeVisible();

  const html = await (await request.get('/moje-pripady')).text();
  expect(html).toContain('noindex');

  await page.goto('/zmeny-2027');
  await expect(page.getByRole('button', { name: /Upozornit mě při změně stavu/i }).first()).toBeVisible();
  await expect(page.getByText(/11\. 1\. 2027/).first()).toBeVisible();
});
