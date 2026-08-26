import { expect, test } from '@playwright/test';

const ENABLED = process.env.FREE_FUNNEL_EXPERIMENTS_ENABLED === 'true';

test.describe('Homepage DPP merchandising', () => {
  test.skip(!ENABLED, 'requires FREE_FUNNEL_EXPERIMENTS_ENABLED=true at build and runtime');

  test('keeps the free DPP visible, unique and responsive', async ({ page }) => {
    for (const viewport of [
      { width: 360, height: 800 },
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1440, height: 1000 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      const primaryCatalog = page.locator('[data-homepage-catalog="primary"]');
      await expect(primaryCatalog.locator('[data-contract-type]')).toHaveCount(5);
      await expect(primaryCatalog.locator('[data-contract-type="dpp"]')).toHaveAttribute('data-position', '3');
      await expect(primaryCatalog.locator('[data-contract-type="dpp"]')).toContainText('ZÁKLADNÍ PDF ZDARMA');
      await expect(primaryCatalog.locator('[data-contract-type="dpp"]')).toContainText('Zdarma');

      const primaryOrder = await primaryCatalog.locator('[data-contract-type]').evaluateAll((cards) =>
        cards.map((card) => card.getAttribute('data-contract-type')),
      );
      expect(primaryOrder).toEqual(['lease', 'car_sale', 'dpp', 'employment', 'work_contract']);
      const primaryPositions = await primaryCatalog.locator('[data-contract-type]').evaluateAll((cards) =>
        cards.map((card) => card.getAttribute('data-position')),
      );
      expect(primaryPositions).toEqual(['1', '2', '3', '4', '5']);

      const catalogHasHorizontalOverflow = await primaryCatalog.evaluate((catalog) => {
        const boundary = catalog.getBoundingClientRect();
        return catalog.scrollWidth > catalog.clientWidth
          || Array.from(catalog.querySelectorAll('*')).some((element) => {
            const rect = element.getBoundingClientRect();
            return rect.left < boundary.left - 0.5 || rect.right > boundary.right + 0.5;
          });
      });
      expect(catalogHasHorizontalOverflow).toBe(false);
    }

    await page.getByRole('button', { name: 'Zobrazit všechny smlouvy' }).click();
    const expandedCatalog = page.locator('[data-homepage-catalog="expanded"]');
    await expect(expandedCatalog).toHaveAttribute('aria-hidden', 'false');
    await expect(expandedCatalog.locator('[data-contract-type="dpp"]')).toHaveCount(0);
    await expect(page.locator('[data-contract-type="dpp"]')).toHaveCount(1);
    const expandedPositions = await expandedCatalog.locator('[data-contract-type]').evaluateAll((cards) =>
      cards.map((card) => card.getAttribute('data-position')),
    );
    expect(expandedPositions).toEqual(['6', '7', '8', '9', '10', '11', '12', '13', '14']);
  });

  test('sends one policy-derived card click event', async ({ page }) => {
    const analyticsPayloads: Array<Record<string, unknown>> = [];
    await page.addInitScript(() => {
      localStorage.setItem('sh_product_analytics_consent_v1', 'granted');
    });
    await page.route('**/api/analytics', async (route) => {
      analyticsPayloads.push(route.request().postDataJSON() as Record<string, unknown>);
      await route.fulfill({ status: 204, body: '' });
    });

    await page.goto('/');
    await page.locator('[data-homepage-catalog="primary"] [data-contract-type="dpp"]').click();
    await expect(page).toHaveURL(/\/dpp$/);

    await expect.poll(() =>
      analyticsPayloads.find((payload) => payload['event'] === 'homepage_contract_card_click'),
    ).toMatchObject({
      event: 'homepage_contract_card_click',
      params: {
        contract_type: 'dpp',
        monetization_mode: 'free_experiment',
        surface: 'homepage_catalog',
        position: 3,
        price_band: '0',
        destination: '/dpp',
      },
    });
  });
});
