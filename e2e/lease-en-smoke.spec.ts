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

const SAFE_MARKETING = [
  'does not provide legal',
  'immigration advice',
  'not certified or official',
  'czech wording prevails',
];

const CZECH_CHECKOUT_BULLETS = ['vyplnění dokumentu', 'přehledná struktura'];

function assertNoForbiddenMarketing(text: string) {
  const lower = text.toLowerCase();
  for (const phrase of FORBIDDEN_MARKETING) {
    expect(lower, `forbidden phrase: ${phrase}`).not.toContain(phrase);
  }
}

function assertSafeMarketing(text: string) {
  const lower = text.toLowerCase();
  for (const phrase of SAFE_MARKETING) {
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
      body: JSON.stringify({ url: '/success?e2e=lease-en' }),
    });
  });
}

async function fillMinimalLeaseForm(page: Page) {
  await page.getByTestId('lease-landlord-name').fill('Jan Landlord');
  await page.getByTestId('lease-tenant-name').fill('John Tenant');
  await page.getByTestId('lease-flat-address').fill('Prague 1, Example Street 1');
  await page.getByTestId('lease-rent-amount').fill('20000');
  await page.getByTestId('lease-start-date').fill('2026-06-01');
  await page.getByTestId('lease-end-date').fill('2027-05-31');
}

test.describe('EN lease expat smoke', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalNetwork(page);
  });

  test('SEO landing → EN builder → checkout request with lang=en', async ({ page }) => {
    let checkoutBody: Record<string, unknown> | null = null;
    await mockCheckoutApi(page, (body) => {
      checkoutBody = body;
    });
    page.on('dialog', (dialog) => dialog.dismiss());

    await page.goto('/en/rental-agreement-czech-republic');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Rental Agreement in the Czech Republic' }),
    ).toBeVisible();

    const seoText = await page.locator('main').innerText();
    assertNoForbiddenMarketing(seoText);
    assertSafeMarketing(seoText);

    await page.getByTestId('seo-lease-cta').click();
    await page.waitForURL((url) => url.pathname === '/najem' && !url.searchParams.has('lang'));
    expect(page.url()).toBe('http://127.0.0.1:3000/najem');

    await expect(page.getByRole('heading', { name: 'Rental Agreement' }).first()).toBeVisible();
    await expect(page.getByText('Your contract will be generated primarily in Czech').first()).toBeVisible();
    await expect(page.getByText('not certified or official').first()).toBeVisible();
    await expect(page.getByText('Czech wording prevails').first()).toBeVisible();
    await expect(page.getByText('Fill in the document details')).toBeVisible();
    await expect(page.getByText('Landlord', { exact: true }).first()).toBeVisible();

    await page.getByTestId('lease-landlord-name').scrollIntoViewIfNeeded();
    await fillMinimalLeaseForm(page);
    await page.getByTestId('lease-open-checkout').scrollIntoViewIfNeeded();
    await page.getByTestId('lease-open-checkout').click();

    const modal = page.getByTestId('lease-checkout-modal');
    await expect(modal).toBeVisible();
    const modalText = await modal.innerText();
    expect(modalText.toLowerCase()).toContain('included');
    expect(modalText).toMatch(/not a law firm|not legal advice/i);
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
    expect(checkoutBody!.lang).toBe('en');
    expect(checkoutBody!.contractType).toBe('lease');
    expect(['basic', 'complete']).toContain(checkoutBody!.tier);
    expect(checkoutBody!.payload).toBeTruthy();
    const payload = checkoutBody!.payload as Record<string, unknown>;
    expect(payload.lang).toBe('en');
    expect(payload.contractType).toBe('lease');
    expect(payload.landlordName).toBe('Jan Landlord');
    expect(payload.tenantName).toBe('John Tenant');
  });

  test('lang=en redirects cleanly and wins over preferred-locale cookie', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'preferred-locale',
        value: 'cs',
        url: 'http://127.0.0.1:3000',
      },
    ]);
    await page.goto('/najem?lang=en');
    expect(page.url()).toBe('http://127.0.0.1:3000/najem');
    await expect(page.getByTestId('lease-landlord-name')).toBeVisible();
    await expect(page.getByText('Fill in the document details')).toBeVisible();
    await expect(page.getByText('Your contract will be generated primarily in Czech').first()).toBeVisible();
  });

  test('retired locale routes redirect to active hubs', async ({ page, context }) => {
    await context.clearCookies();

    for (const retired of ['/vn', '/vi', '/ru', '/de']) {
      await page.goto(retired);
      await page.waitForURL(/\/en\/?$/);
      expect(page.url()).toMatch(/\/en\/?$/);
    }

    await page.goto('/uk');
    await page.waitForURL(/\/ua\/?$/);
    expect(page.url()).toMatch(/\/ua\/?$/);
  });

  test('/darovaci?lang=en shows Czech-only notice', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/darovaci?lang=en');
    expect(page.url()).toBe('http://127.0.0.1:3000/darovaci');
    await expect(page.getByText('Czech-only form')).toBeVisible();
    await expect(
      page.getByRole('main').getByText(/currently available in Czech only/i),
    ).toBeVisible();
    await expect(page.getByText(/bilingual/i)).toHaveCount(0);
  });
});
