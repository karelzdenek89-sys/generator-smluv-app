import { expect, test } from '@playwright/test';

const partnerEnabled = process.env.PARTNER_ENGINE_ENABLED === 'true'
  && process.env.PARTNER_CEBIA_ENABLED === 'true'
  && process.env.PARTNER_CEBIA_IS_AFFILIATE === 'true'
  && Boolean(process.env.PARTNER_CEBIA_URL);

function affiliateLink(page: import('@playwright/test').Page) {
  return page.locator('a[href*="a_box="]');
}

test('Cebia landing cards respect the opt-in gate and attribution contract', async ({ page }) => {
  for (const route of ['/prodej-vozidla', '/balicek-prodej-vozidla', '/blog/kupni-smlouva-na-auto-2026']) {
    await page.goto(route);
    const link = affiliateLink(page);
    if (!partnerEnabled) {
      await expect(link).toHaveCount(0);
      continue;
    }
    await expect(link).toHaveCount(1);
    const href = await link.getAttribute('href');
    const url = new URL(href!);
    expect(url.hostname).toBe('cz.cebia.com');
    expect(url.searchParams.get('utm_source')).toBe('affilbox');
    expect(url.searchParams.get('utm_medium')).toBe('affiliate');
    expect(url.searchParams.get('a_box')).toBe('ay9jggbd');
    expect(url.searchParams.has('vin')).toBe(false);
    await expect(link).toHaveAttribute('rel', /sponsored/);
    await expect(page.getByText(/můžeme získat provizi/)).toBeVisible();
    await expect(link.locator('img[src*="autotracer-horizontal.png"]')).toHaveCount(1);
  }
});

test('Cebia builder recommendation is shown only to Czech buyers', async ({ page }) => {
  await page.goto('/auto');
  const link = affiliateLink(page);
  await expect(link).toHaveCount(0);
  await page.locator('select[name="partnerUserRole"]').selectOption('buyer');
  await expect(link).toHaveCount(partnerEnabled ? 1 : 0);
  await page.locator('select[name="partnerUserRole"]').selectOption('seller');
  await expect(link).toHaveCount(0);
});
