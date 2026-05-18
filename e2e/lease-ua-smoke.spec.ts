import { expect, test, type Page } from '@playwright/test';

const FORBIDDEN_MARKETING = [
  'visa-ready',
  'accepted by foreign police',
  'guaranteed for authorities',
  'we provide legal advice',
  'provides immigration advice',
  'immigration advice provided',
  'certified translation guaranteed',
];

const SAFE_MARKETING_UA = [
  'юридичн',
  'імміграційн',
  'не офіційн',
  'чеськ',
];

const CZECH_CHECKOUT_BULLETS = ['vyplnění dokumentu', 'přehledná struktura'];

function assertNoForbiddenMarketing(text: string) {
  const lower = text.toLowerCase();
  for (const phrase of FORBIDDEN_MARKETING) {
    expect(lower, `forbidden phrase: ${phrase}`).not.toContain(phrase);
  }
}

function assertSafeMarketingUa(text: string) {
  const lower = text.toLowerCase();
  for (const phrase of SAFE_MARKETING_UA) {
    expect(lower, `missing safe phrase: ${phrase}`).toContain(phrase);
  }
}

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

async function mockCheckoutApi(page: Page, onPayload: (body: Record<string, unknown>) => void) {
  await page.route('**/api/checkout', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }
    onPayload(route.request().postDataJSON() as Record<string, unknown>);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ url: '/success?e2e=lease-ua' }),
    });
  });
}

async function fillMinimalLeaseForm(page: Page) {
  await page.getByTestId('lease-landlord-name').fill('Jan Pronajimatel');
  await page.getByTestId('lease-tenant-name').fill('Olena Orendar');
  await page.getByTestId('lease-flat-address').fill('Praha 1, Ukrajinska 1');
  await page.getByTestId('lease-rent-amount').fill('20000');
  await page.getByTestId('lease-start-date').fill('2026-06-01');
  await page.getByTestId('lease-end-date').fill('2027-05-31');
}

test.describe('UA lease expat smoke', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test('SEO landing → UA builder → checkout request with lang=ua', async ({ page }) => {
    let checkoutBody: Record<string, unknown> | null = null;
    await mockCheckoutApi(page, (body) => {
      checkoutBody = body;
    });
    page.on('dialog', (dialog) => dialog.dismiss());

    await page.goto('/ua/rental-agreement-czech-republic');

    await expect(page.getByRole('heading', { level: 1, name: 'Договір оренди в Чехії' })).toBeVisible();

    const seoText = await page.locator('main').innerText();
    assertNoForbiddenMarketing(seoText);
    assertSafeMarketingUa(seoText);

    await page.getByTestId('seo-rental-cta').click();
    await page.waitForURL(/\/najem\?lang=ua/);
    expect(page.url()).toMatch(/lang=ua/);

    await expect(page.getByRole('heading', { name: /Договір оренди/i }).first()).toBeVisible();
    await expect(
      page.getByText('Договір буде сформовано насамперед чеською мовою').first(),
    ).toBeVisible();
    await expect(page.getByText('не є засвідченим чи офіційним').first()).toBeVisible();
    await expect(page.getByText('Заповніть дані документа')).toBeVisible();
    await expect(page.getByText('Орендодавець', { exact: true }).first()).toBeVisible();

    await page.getByTestId('lease-landlord-name').scrollIntoViewIfNeeded();
    await fillMinimalLeaseForm(page);
    await page.getByTestId('lease-open-checkout').scrollIntoViewIfNeeded();
    await page.getByTestId('lease-open-checkout').click();

    const modal = page.getByTestId('lease-checkout-modal');
    await expect(modal).toBeVisible();
    const modalText = await modal.innerText();
    expect(modalText.toLowerCase()).toContain('включено');
    expect(modalText).toMatch(/не є юридичною фірмою|не юридичн/i);
    for (const bullet of CZECH_CHECKOUT_BULLETS) {
      expect(modalText.toLowerCase()).not.toContain(bullet);
    }

    await page.getByTestId('lease-checkout-consent').check();
    const checkoutRequest = page.waitForRequest(
      (req) => req.url().includes('/api/checkout') && req.method() === 'POST',
    );
    await page.getByTestId('lease-checkout-pay').click();
    await checkoutRequest;

    expect(checkoutBody).not.toBeNull();
    expect(checkoutBody!.lang).toBe('ua');
    expect(checkoutBody!.contractType).toBe('lease');
    expect(['basic', 'complete']).toContain(checkoutBody!.tier);
    const payload = checkoutBody!.payload as Record<string, unknown>;
    expect(payload.lang).toBe('ua');
    expect(payload.landlordName).toBe('Jan Pronajimatel');
    expect(payload.tenantName).toBe('Olena Orendar');
  });

  test('lang=ua wins over preferred-locale cookie', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'preferred-locale',
        value: 'cs',
        url: 'http://127.0.0.1:3000',
      },
    ]);
    await page.goto('/najem?lang=ua');
    await expect(page.getByTestId('lease-landlord-name')).toBeVisible();
    await expect(page.getByText('Заповніть дані документа')).toBeVisible();
    await expect(
      page.getByText('Договір буде сформовано насамперед чеською мовою').first(),
    ).toBeVisible();
  });

  test('/darovaci?lang=ua shows Czech-only notice', async ({ page }) => {
    await page.goto('/darovaci?lang=ua');
    await expect(page.getByText('Лише чеська форма')).toBeVisible();
    await expect(page.getByText(/наразі доступна лише чеською/i)).toBeVisible();
    await expect(page.getByText(/bilingual/i)).toHaveCount(0);
  });
});
