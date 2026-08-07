import { expect, test } from '@playwright/test';

test('employer package keeps the 599 Kč product, included DOCX and annex language through checkout', async ({ page }) => {
  let captured: Record<string, unknown> | null = null;
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.route('**/api/analytics', (route) => route.fulfill({ status: 204, body: '' }));
  await page.route('**/api/checkout', async (route) => {
    captured = JSON.parse(route.request().postData() ?? '{}') as Record<string, unknown>;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ url: 'https://example.test/stub-checkout' }),
    });
  });

  await page.goto('/pracovni?package=employer_start');
  await expect(page.getByText('Zaměstnavatel Start 2026').first()).toBeVisible();
  await expect(page.getByText('599 Kč').first()).toBeVisible();

  const fill = async (name: string, value: string) => page.locator(`[name="${name}"]`).fill(value);
  await fill('employerName', 'Testovací zaměstnavatel s.r.o.');
  await fill('employerIco', '23660295');
  await fill('employerAddress', 'Václavské náměstí 1, Praha 1');
  await fill('employeeName', 'Jana Nováková');
  await fill('employeeAddress', 'Dlouhá 10, Praha 1');
  await fill('jobTitle', 'Projektová specialistka');
  await fill('workPlace', 'Praha');
  await fill('startDate', '2026-09-01');
  await fill('salary', '55000');
  await fill('socialSecurityAuthority', 'Pražská správa sociálního zabezpečení');
  await page.locator('[name="remoteWork"]').selectOption('hybrid_remote');
  await fill('remoteWorkPlace', 'Bydliště zaměstnance v České republice');
  await fill('remoteWorkSchedule', 'Nejvýše dva dny týdně po dohodě s vedoucím');
  await page.locator('[name="remoteWorkCostMode"]').selectOption('flat_rate');

  const generate = page.locator('[data-builder-generate]').first();
  await generate.scrollIntoViewIfNeeded();
  await expect(generate).toBeEnabled();
  await generate.click();

  const modal = page.getByTestId('lease-checkout-modal');
  await expect(modal).toBeVisible();
  await expect(modal.getByText('599 Kč').first()).toBeVisible();
  await expect(modal.getByText('PDF a editovatelná DOCX verze')).toBeVisible();
  await expect(modal.getByRole('button', { name: /Editovatelná DOCX verze/ })).toHaveCount(0);

  await modal.getByRole('button', { name: /Dvojjazyčná příloha/ }).click();
  await page.getByTestId('checkout-annex-language').selectOption('ua');
  await page.screenshot({ path: 'tmp/browser-verify/employer-checkout-desktop.png' });
  await page.getByTestId('checkout-delivery-email').fill('hr@example.com');
  await page.getByTestId('lease-checkout-consent').check();
  await page.getByTestId('lease-checkout-pay').click();

  await expect.poll(() => captured).not.toBeNull();
  const request = captured as unknown as {
    contractType?: string;
    tier?: string;
    packageKey?: string;
    annexLanguage?: string;
    addOns?: string[];
    payload?: Record<string, unknown>;
  };
  expect(request.contractType).toBe('employment');
  expect(request.tier).toBe('complete');
  expect(request.packageKey).toBe('employer_start');
  expect(request.annexLanguage).toBe('ua');
  expect(request.addOns).toContain('bilingual_annex');
  expect(request.addOns).not.toContain('docx');
  expect(request.payload?.remoteWorkCostMode).toBe('flat_rate');
  expect(request.payload?.workEquipment).toBeTruthy();
  expect(pageErrors).toEqual([]);
  await expect(page.locator('[data-nextjs-dialog], #webpack-dev-server-client-overlay')).toHaveCount(0);
});

test('employer package is discoverable and usable on a mobile viewport', async ({ page }) => {
  const pageErrors: string[] = [];
  const cookieOrigin = new URL(process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000').origin;
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.context().addCookies([
    { name: 'preferred-locale', value: 'cs', url: cookieOrigin },
    { name: 'foreign-banner-dismissed', value: '1', url: cookieOrigin },
  ]);
  await page.addInitScript(() => localStorage.setItem('cookies_accepted', '1'));
  await page.route('**/api/analytics', (route) => route.fulfill({ status: 204, body: '' }));

  await page.goto('/');
  const packages = page.locator('#balicky');
  await expect(packages.getByText('Zaměstnavatel Start 2026')).toBeVisible();
  await expect(packages.getByText('599 Kč')).toBeVisible();
  expect(pageErrors, 'homepage must hydrate without errors').toEqual([]);
  pageErrors.length = 0;

  await page.goto('/balicek-zamestnavatel');
  await expect(page.locator('main h1')).toContainText('Zaměstnavatel Start 2026');
  await expect(page.getByRole('link', { name: /Připravit personální balíček/i }).first()).toBeVisible();
  await expect(page.locator('[data-nextjs-dialog], #webpack-dev-server-client-overlay')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  expect(pageErrors, 'employer package landing must hydrate without errors').toEqual([]);
  await page.screenshot({ path: 'tmp/browser-verify/employer-landing-mobile.png' });
});
