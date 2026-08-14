import { expect, test, type Page } from '@playwright/test';

const CZECH_ONLY_BUILDERS = [
  '/darovaci',
  '/smlouva-o-dilo',
  '/pujcka',
  '/nda',
  '/kupni',
  '/sluzby',
  '/uznani-dluhu',
  '/spoluprace',
];

const LOCALIZED_BUILDERS = [
  '/najem',
  '/podnajem',
  '/pracovni',
  '/dpp',
  '/plna-moc',
  '/auto',
];

async function blockExternalNetwork(page: Page) {
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (
      url.includes('stripe.com') ||
      url.includes('stripe.network') ||
      url.includes('google-analytics') ||
      url.includes('googletagmanager')
    ) {
      return route.abort();
    }
    return route.continue();
  });
}

test.describe('builder locale isolation', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test('stale UA preference cannot translate isolated blocks on a Czech UTM visit', async ({ page, context }) => {
    await context.addCookies([
      { name: 'preferred-locale', value: 'ua', url: 'http://127.0.0.1:3000' },
      { name: 'foreign-banner-dismissed', value: '1', url: 'http://127.0.0.1:3000' },
    ]);

    await page.goto(
      '/smlouva-o-dilo?utm_source=majitel365&utm_medium=product_referral&utm_campaign=ecosystem&utm_content=documents_work_contract',
    );

    await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
    await expect(page.getByRole('heading', { name: /Smlouva o dílo online/i })).toBeVisible();
    await expect(page.getByText('Proč nestačí soubor stažený z webu')).toBeVisible();
    await expect(page.getByText('Лише чеська форма')).toHaveCount(0);
    await expect(page.getByText('Чому недостатньо файлу з інтернету')).toHaveCount(0);
    await expect(page.getByText('Czech-only form')).toHaveCount(0);
  });

  test('a Czech supported builder also ignores a stale foreign preference', async ({ page, context }) => {
    await context.addCookies([
      { name: 'preferred-locale', value: 'en', url: 'http://127.0.0.1:3000' },
    ]);

    await page.goto('/najem?utm_source=partner');

    await expect(page.locator('html')).toHaveAttribute('lang', 'cs');
    await expect(page.getByRole('heading', { name: /Nájemní smlouva online/i })).toBeVisible();
    await expect(page.getByText('English-guided Czech contract')).toHaveCount(0);
  });

  test('all canonical builder URLs stay Czech with stale UA state', async ({ page, context }) => {
    await context.addCookies([
      { name: 'preferred-locale', value: 'ua', url: 'http://127.0.0.1:3000' },
    ]);

    for (const route of [...LOCALIZED_BUILDERS, ...CZECH_ONLY_BUILDERS]) {
      await page.goto(`${route}?utm_source=locale_matrix`);
      await expect(page.locator('html'), route).toHaveAttribute('lang', 'cs');
      const mainText = await page.locator('main').innerText();
      expect(mainText, route).not.toMatch(/[\u0400-\u04ff]/u);
      expect(mainText, route).not.toContain('Czech-only form');
    }
  });

  test('explicit UA builder uses Ukrainian chrome without English leftovers or duplicate notices', async ({ page }) => {
    await page.goto('/najem?lang=ua');

    await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
    await expect(page.getByText('Що входить до документа').first()).toBeVisible();
    await expect(page.getByText('Зміст документа', { exact: true })).toBeVisible();
    await expect(page.getByText('Поширені запитання', { exact: true })).toBeVisible();
    await expect(page.getByText('What is included')).toHaveCount(0);
    await expect(page.getByText('Document contents')).toHaveCount(0);
    await expect(page.getByText('Common questions')).toHaveCount(0);
    await expect(page.getByText('Договір буде сформовано насамперед чеською мовою')).toHaveCount(1);
  });

  test('explicit EN wins over a stale UA preference', async ({ page, context }) => {
    await context.addCookies([
      { name: 'preferred-locale', value: 'ua', url: 'http://127.0.0.1:3000' },
    ]);

    await page.goto('/najem?lang=en');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: 'Rental Agreement' }).first()).toBeVisible();
    await expect(page.getByText('Що входить до документа')).toHaveCount(0);
  });

  test('all explicit UA builders use Ukrainian shared chrome, never English fallback chrome', async ({ page }) => {
    for (const route of LOCALIZED_BUILDERS) {
      await page.goto(`${route}?lang=ua`);
      await expect(page.locator('html'), route).toHaveAttribute('lang', 'uk');
      const mainText = await page.locator('main').innerText();
      expect(mainText, route).not.toContain('Document contents');
      expect(mainText, route).not.toContain('What is included');
      expect(mainText, route).not.toContain('Common questions');
    }
  });

  test('all Czech-only builders remove an unsupported lang while preserving attribution', async ({ request }) => {
    for (const route of CZECH_ONLY_BUILDERS) {
      const response = await request.get(`${route}?lang=ua&utm_source=locale_audit`, {
        maxRedirects: 0,
      });
      expect(response.status(), route).toBe(307);
      const location = response.headers().location;
      expect(location, route).toContain(`${route}?utm_source=locale_audit`);
      expect(location, route).not.toContain('lang=');
    }
  });

  test('localized package flows do not expose Czech package chrome', async ({ page }) => {
    await page.goto('/auto?package=vehicle_sale&lang=en');
    await expect(page.getByText('Package price')).toBeVisible();
    await expect(page.getByText('Selected product')).toBeVisible();
    await expect(page.getByText('Cena balíčku')).toHaveCount(0);
    await expect(page.getByText('Zvolený produkt')).toHaveCount(0);

    await page.goto('/pracovni?package=employer_start&lang=en');
    await expect(page.getByText('Package price')).toBeVisible();
    await expect(page.getByText('07. Related HR documents', { exact: true })).toBeVisible();
    await expect(page.getByText('Navazující personální podklady')).toHaveCount(0);
  });
});
