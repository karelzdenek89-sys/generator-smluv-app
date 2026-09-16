import { expect, test, type Page } from '@playwright/test';

type Event = { event: string; params: Record<string, unknown> };

async function captureAnalytics(page: Page, consent: 'granted' | 'denied') {
  const events: Event[] = [];
  await page.addInitScript((value) => {
    localStorage.setItem('sh_product_analytics_consent_v1', value);
    // Exercise fetch transport so assertions can await captured requests.
    navigator.sendBeacon = () => false;
  }, consent);
  await page.route('**/api/analytics', async (route) => {
    events.push(route.request().postDataJSON() as Event);
    await route.fulfill({ json: { ok: true } });
  });
  await page.route('**/api/checkout', (route) => route.abort());
  return events;
}

const entries = [
  ['pracovni-smlouva-2026', '/pracovni', 'employerName'],
  ['smlouva-o-dilo-cena-a-platby', '/smlouva-o-dilo', 'clientName'],
  ['smlouva-o-zapujcce-2026', '/pujcka', 'lenderName'],
  ['smlouva-o-sluzbach-2026', '/sluzby', 'providerName'],
] as const;

for (const width of [360, 1440]) {
  for (const [slug, builder, field] of entries) {
    test(`${slug}: transparent direct form entry at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const events = await captureAnalytics(page, 'granted');
      await page.goto(`/blog/${slug}`);
      await expect(page.locator('[data-site-header="global"]')).toHaveCount(1);
      await expect(page.locator('[data-blog-shell="cs"] > header')).toHaveCount(0);
      const header = page.locator('article header');
      await expect(header).toContainText('stažení hotového dokumentu je placené');
      const link = header.locator(`a[href="${builder}#formular"]`);
      await expect(link).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${builder}#formular$`));
      await expect(page.locator('#formular')).toBeInViewport();
      await page.locator(`input[name="${field}"]`).fill('TEST content entry');
      await expect.poll(() => events.filter(e => e.event === 'blog_cta_click').length).toBe(1);
      expect(events.find(e => e.event === 'blog_cta_click')?.params).toMatchObject({
        article_slug: slug, destination: `${builder}#formular`, variant: 'article_entry_v1',
      });
      const attribution = await page.evaluate(() => JSON.parse(sessionStorage.getItem('sh_traffic_attribution') ?? 'null'));
      expect(attribution).toMatchObject({ source: 'blog_article', article_slug: slug, pathname: `/blog/${slug}` });
    });
  }
}

test('offer view requires visibility, is deduplicated, and click keeps article attribution', async ({ page }) => {
  const events = await captureAnalytics(page, 'granted');
  await page.goto('/blog/pracovni-smlouva-2026');
  const offer = page.locator('[data-content-offer="employer_start_package"]');
  await expect(offer).not.toBeInViewport();
  await expect.poll(() => events.some(e => e.event === 'blog_article_view')).toBe(true);
  expect(events.filter(e => e.event === 'content_offer_view')).toHaveLength(0);
  await offer.scrollIntoViewIfNeeded();
  await expect.poll(() => events.filter(e => e.event === 'content_offer_view').length).toBe(1);
  expect(events.find(e => e.event === 'content_offer_view')?.params.variant).toBe('visible_offer_v1');
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(offer).not.toBeInViewport();
  await offer.scrollIntoViewIfNeeded();
  await offer.getByRole('link').click();
  await expect(page).toHaveURL(/\/pracovni\?package=employer_start$/);
  await expect.poll(() => events.filter(e => e.event === 'content_offer_click').length).toBe(1);
  expect(events.filter(e => e.event === 'content_offer_view')).toHaveLength(1);
  expect(events.find(e => e.event === 'content_offer_click')?.params).toMatchObject({
    article_slug: 'pracovni-smlouva-2026', traffic_source: 'blog_article', variant: 'visible_offer_v1',
  });
});

test('offer view waits for consent and is not duplicated by repeated consent events', async ({ page }) => {
  const events = await captureAnalytics(page, 'denied');
  await page.goto('/blog/pracovni-smlouva-2026');
  const offer = page.locator('[data-content-offer="employer_start_package"]');
  await offer.scrollIntoViewIfNeeded();
  await expect(offer).toBeInViewport();
  expect(events).toHaveLength(0);
  await page.evaluate(() => {
    localStorage.setItem('sh_product_analytics_consent_v1', 'granted');
    window.dispatchEvent(new Event('sh:product-analytics-consent'));
  });
  await expect.poll(() => events.filter(e => e.event === 'content_offer_view').length).toBe(1);
  await page.evaluate(() => window.dispatchEvent(new Event('sh:product-analytics-consent')));
  await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded();
  await offer.scrollIntoViewIfNeeded();
  expect(events.filter(e => e.event === 'content_offer_view')).toHaveLength(1);
});

test('granting consent above an unseen offer does not count a view', async ({ page }) => {
  const events = await captureAnalytics(page, 'denied');
  await page.goto('/blog/pracovni-smlouva-2026');
  await page.evaluate(() => {
    localStorage.setItem('sh_product_analytics_consent_v1', 'granted');
    window.dispatchEvent(new Event('sh:product-analytics-consent'));
  });
  await expect.poll(() => events.some(e => e.event === 'blog_article_view')).toBe(true);
  expect(events.filter(e => e.event === 'content_offer_view')).toHaveLength(0);
  await page.locator('[data-content-offer="employer_start_package"]').scrollIntoViewIfNeeded();
  await expect.poll(() => events.filter(e => e.event === 'content_offer_view').length).toBe(1);
});

test('trial-period search title, H1, canonical and JSON-LD agree without changing publication date', async ({ page }) => {
  await page.goto('/blog/zkusebni-doba-2026');
  await expect(page).toHaveTitle('Jak dlouhá je zkušební doba v roce 2026? | SmlouvaHned');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Jak dlouhá je zkušební doba v roce 2026?');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.smlouvahned.cz/blog/zkusebni-doba-2026');
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const article = schemas.map(text => JSON.parse(text)).find(schema => schema['@type'] === 'Article');
  expect(article).toMatchObject({ headline: 'Jak dlouhá je zkušební doba v roce 2026?' });
  expect(article.datePublished).toContain('2026-07-09');
});
