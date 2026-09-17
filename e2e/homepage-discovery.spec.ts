import { expect, test } from '@playwright/test';

test('homepage search handles Czech accents and leads to a useful answer', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(`${request.url()} ${request.postData() ?? ''}`));
  await page.route('**/api/analytics', route => route.fulfill({ json: { ok: true } }));
  await page.goto('/');
  const search = page.getByRole('searchbox', { name: 'Hledáte něco konkrétního?' });
  await search.fill('viceprace');
  await expect(page.getByRole('status')).toContainText('Nalezeno');
  const results = page.locator('[id$="-results"]');
  await expect(results.getByRole('link').first()).toBeVisible();
  const plainResults = await results.innerText();
  await search.fill('vícepráce');
  await expect(results).toHaveText(plainResults, { useInnerText: true });
  await search.fill('unikatni-soukromy-dotaz-xyz');
  await expect(results).toContainText('Nenašli jsme přesnou shodu');
  await page.getByRole('button', { name: 'Vymazat hledání' }).click();
  await expect(search).toHaveValue('');
  expect(requests.some(request => request.includes('unikatni-soukromy-dotaz-xyz'))).toBe(false);
  await search.fill('viceprace');
  await results.getByRole('link').filter({ hasText: 'Vícepráce bez souhlasu' }).click();
  await expect(page).toHaveURL(/\/zakazka\/viceprace-bez-souhlasu$/);
  await expect(page.locator('main')).toContainText('Stručná odpověď');
});

test('mobile homepage exposes the main action and a working menu without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const cta = page.getByRole('link', { name: 'Vybrat, co řeším', exact: true }).first();
  await expect(cta).toBeVisible();
  const box = await cta.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y + box!.height).toBeLessThan(812);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator('nav summary').filter({ hasText: 'Menu' }).click();
  await expect(page.locator('nav details[open]').getByRole('link', { name: 'Nástroje zdarma' })).toBeVisible();
});

test('service preview explains each stage and supports reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const preview = page.locator('[aria-label="Interaktivní ukázka služby Moje zakázka"]');
  await expect(preview).toContainText('PŘÍKLAD: ZAKÁZKA');
  await preview.getByRole('button', { name: '03Předání' }).click();
  await expect(preview.getByRole('button', { name: '03Předání' })).toHaveAttribute('aria-pressed', 'true');
  await expect(preview).toContainText('Předávací protokol');
  await expect(preview).toContainText('99 Kč');
  const animated = preview.locator('[aria-live] > div');
  expect(await animated.evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  await preview.getByRole('link', { name: 'Prohlédnout Moje zakázka' }).click();
  await expect(page).toHaveURL(/\/zakazka$/);
});

test('homepage exposes real product capabilities and transparent prices', async ({ page }) => {
  await page.goto('/');
  const scope = page.locator('[aria-label="Co nástroj skutečně umí"]');
  await expect(scope).toContainText('DOCX');
  await expect(scope).toContainText('90 dní');
  await expect(scope).toContainText('EN / UA');
  await expect(page.locator('[data-homepage-catalog="primary"] [data-contract-type="lease"]')).toContainText('od 99 Kč');
  await expect(page.locator('#balicky')).toContainText('299 Kč');
});

test('lease keeps long guide optional and the primary CTA reaches the form', async ({ page }) => {
  await page.goto('/najem');
  const guide = page.locator('details[aria-label="Průvodce nájemní smlouvou"]');
  await expect(guide).toHaveCount(1);
  await expect(guide).not.toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'Vytvořit nájemní smlouvu' }).first().click();
  await expect(page.locator('#formular')).toBeInViewport();
});
