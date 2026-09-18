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


test('case hub loads subsequent pages and keeps loaded cases after transient errors', async ({ page }) => {
  const token = 'a'.repeat(64);
  let failOnce = true;
  const item = (id: number) => ({ id: `case-${id}`, kind: 'work_order', title: `Případ ${id}`, stage: 'agreement', stageLabel: 'Dohoda', deadline: null, nextStep: 'Pokračovat', documentsCount: 0, token, path: `/moje-zakazka?id=case-${id}`, updatedAt: '2026-09-18' });
  await page.route('**/api/cases/hub/resolve', async (route) => {
    const { offset = 0 } = route.request().postDataJSON();
    if (offset === 50 && failOnce) {
      failOnce = false;
      return route.fulfill({ status: 503, json: { error: 'Dočasná chyba' } });
    }
    return route.fulfill({ json: { cases: offset === 0 ? Array.from({ length: 50 }, (_, i) => item(i)) : [item(50)], nextOffset: offset === 0 ? 50 : null } });
  });
  await page.goto(`/moje-pripady#access=${token}`);
  await expect(page.locator('article')).toHaveCount(50);
  await page.getByRole('button', { name: 'Načíst další případy' }).click();
  await expect(page.getByRole('alert')).toContainText('Dočasná chyba');
  await expect(page.locator('article')).toHaveCount(50);
  await page.getByRole('button', { name: 'Načíst další případy' }).click();
  await expect(page.locator('article')).toHaveCount(51);
  await expect(page.getByRole('heading', { name: 'Případ 50', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Načíst další případy' })).toHaveCount(0);
  await expect(page).not.toHaveURL(/access=/);
});
