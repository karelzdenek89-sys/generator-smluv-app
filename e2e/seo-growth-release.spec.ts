import { expect, test, type Page } from '@playwright/test';

async function stubAnalytics(page: Page, consent: 'granted' | 'denied' | null = 'granted') {
  const payloads: Array<Record<string, unknown>> = [];
  if (consent) {
    await page.addInitScript((storedConsent) => {
      localStorage.setItem('sh_product_analytics_consent_v1', storedConsent);
    }, consent);
  }
  await page.route('**/api/analytics', async (route) => {
    if (route.request().method() === 'POST') {
      payloads.push(route.request().postDataJSON() as Record<string, unknown>);
    }
    await route.fulfill({ status: 204 });
  });
  return payloads;
}

test('first-party product analytics stays off until explicit opt-in and can be revoked', async ({ page }) => {
  const analyticsPayloads = await stubAnalytics(page, null);
  await page.goto('/blog/dpp-dohoda-provedeni-prace');

  await expect(page.getByRole('dialog', { name: 'Informace o cookies' })).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem('sh_traffic_attribution'))).toBeNull();
  expect(analyticsPayloads).toHaveLength(0);

  await page.getByRole('button', { name: 'Jen nezbytné' }).click();
  await expect(page.getByRole('dialog', { name: 'Informace o cookies' })).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem('sh_product_analytics_consent_v1'))).toBe('denied');
  expect(await page.evaluate(() => sessionStorage.getItem('sh_traffic_attribution'))).toBeNull();
  expect(analyticsPayloads).toHaveLength(0);

  await page.goto('/gdpr');
  await page.getByRole('button', { name: 'Povolit měření' }).click();
  await page.goto('/blog/dpp-dohoda-provedeni-prace');
  await expect.poll(() => analyticsPayloads.some((payload) => payload.event === 'blog_article_view')).toBeTruthy();
  expect(await page.evaluate(() => {
    const raw = sessionStorage.getItem('sh_traffic_attribution');
    return raw ? JSON.parse(raw).source : null;
  })).toBe('blog_article');

  await page.goto('/gdpr');
  await page.getByRole('button', { name: 'Jen nezbytné' }).click();
  expect(await page.evaluate(() => sessionStorage.getItem('sh_traffic_attribution'))).toBeNull();
});

test('homepage communicates the online generator without desktop or mobile overflow', async ({ page }) => {
  await stubAnalytics(page);

  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 375, height: 812 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText('Smlouvy online');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://www.smlouvahned.cz',
    );
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  }
});

test('priority Czech journeys expose a visible product path', async ({ page }) => {
  await stubAnalytics(page);

  for (const route of ['/najem', '/smlouva-o-dilo', '/auto'] as const) {
    await page.goto(route);
    await expect(page.locator('main h1').first()).toBeVisible();
    await expect(page.locator('#formular')).toBeVisible();
  }

  await page.goto('/blog/dpp-dohoda-provedeni-prace');
  await page.locator('a[href="/dpp"]').first().click();
  await expect(page).toHaveURL(/\/dpp$/);
  await expect(page.locator('main h1').first()).toBeVisible();
});

test('EN and UA automotive landings are canonical, localized, state the joint transfer procedure and lead to noindex builder variants', async ({ page, request }) => {
  const analyticsPayloads = await stubAnalytics(page);
  const scenarios = [
    {
      locale: 'en',
      contentLanguage: 'en',
      builderLang: 'en',
      registrationCopy: 'existing and new owner generally submit a joint application',
    },
    {
      locale: 'ua',
      contentLanguage: 'uk',
      builderLang: 'ua',
      registrationCopy: 'попередній і новий власник загалом подають спільну заяву',
    },
  ] as const;

  for (const scenario of scenarios) {
    const pathname = `/${scenario.locale}/car-sale-agreement-czech-republic`;
    const response = await page.goto(pathname);
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-language']).toBe(scenario.contentLanguage);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://www.smlouvahned.cz${pathname}`,
    );
    await expect(page.getByTestId('seo-car_sale-cta')).toBeVisible();
    await expect(page.locator('main')).toContainText(scenario.registrationCopy);

    const builderResponse = await request.get(`/auto?lang=${scenario.builderLang}`);
    expect(builderResponse.status()).toBe(200);
    expect(builderResponse.headers()['x-robots-tag']).toBe('noindex, follow');
    await page.getByTestId('seo-car_sale-cta').click();
    await expect(page).toHaveURL(new RegExp(`/auto\\?lang=${scenario.builderLang}$`));
  }

  expect(analyticsPayloads.some((payload) => {
    const params = payload.params as Record<string, unknown> | undefined;
    return payload.event === 'seo_landing_view'
      && params?.traffic_source === 'seo_landing'
      && typeof params.acquisition_page === 'string';
  })).toBeTruthy();
});

test('EN and UA expat guides localize the shared page chrome', async ({ page }) => {
  await stubAnalytics(page, null);
  const scenarios = [
    {
      pathname: '/blog/expat/rental-agreement-czech-republic-guide-en',
      htmlLang: 'en',
      dialogName: 'Cookie information',
      footerText: 'Software tool',
    },
    {
      pathname: '/blog/expat/rental-agreement-czech-republic-guide-ua',
      htmlLang: 'uk',
      dialogName: 'Інформація про cookies',
      footerText: 'Програмний інструмент',
    },
  ] as const;

  for (const scenario of scenarios) {
    await page.goto(scenario.pathname);
    await expect(page.locator('html')).toHaveAttribute('lang', scenario.htmlLang);
    await expect(page.getByRole('dialog', { name: scenario.dialogName })).toBeVisible();
    await expect(page.locator('[data-site-footer="global"]')).toContainText(scenario.footerText);
    await expect(page.locator('[data-site-header="global"]')).toHaveCount(0);
    await expect(page.locator('[data-blog-shell="expat"]')).toBeVisible();
    await expect(page.getByText('Právní průvodce', { exact: true })).toHaveCount(0);
    await page.evaluate(() => localStorage.removeItem('sh_product_analytics_consent_v1'));
  }
});

test('Cebia editorial CTA stays absent while production-safe flags are off', async ({ page }) => {
  await stubAnalytics(page);
  await page.goto('/blog/kupni-smlouva-na-auto-2026');
  await expect(page.getByRole('link', { name: /Prověřit historii vozidla/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Vytvořit kupní smlouvu na auto/i }).first()).toBeVisible();
});
