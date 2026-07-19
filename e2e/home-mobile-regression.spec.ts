import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('mobile homepage shows price and primary CTA in the first viewport', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Od 99 Kč · bez registrace a předplatného')).toBeVisible();
  const cta = page.getByRole('link', { name: /Vybrat typ smlouvy/ }).first();
  await expect(cta).toBeVisible();

  const box = await cta.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y + box!.height).toBeLessThanOrEqual(844);
});

test('preferred UA locale hydrates the Czech rental route without React mismatch', async ({
  page,
  context,
}) => {
  await context.addCookies([
    {
      name: 'preferred-locale',
      value: 'ua',
      url: 'http://127.0.0.1:3000',
    },
  ]);

  const browserErrors: string[] = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(message.text());
  });

  await page.goto('/najem');
  await expect(page.getByRole('heading', { name: /Договір оренди/i }).first()).toBeVisible();

  expect(browserErrors.join('\n')).not.toMatch(/hydration|React error #418/i);
});

test('preferred foreign locale does not translate Czech marketing-page footer', async ({
  page,
  context,
}) => {
  await context.addCookies([
    {
      name: 'preferred-locale',
      value: 'en',
      url: 'http://127.0.0.1:3000',
    },
  ]);

  await page.goto('/');

  await expect(
    page.getByRole('contentinfo').getByText('Softwarový nástroj', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Software tool', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Šest hlavních smluv pro cizince/)).toBeVisible();
  await expect(page.getByText(/U nájemní smlouvy lze přidat variantu/)).toHaveCount(0);
});

test('localized hubs keep their own footer language', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByText('Software tool', { exact: true })).toBeVisible();

  await page.goto('/ua');
  await expect(page.getByText('Програмний інструмент', { exact: true })).toBeVisible();
});
