import { expect, test } from '@playwright/test';

const BUILDERS = [
  '/najem',
  '/auto',
  '/darovaci',
  '/smlouva-o-dilo',
  '/pujcka',
  '/nda',
  '/kupni',
  '/pracovni',
  '/dpp',
  '/sluzby',
  '/podnajem',
  '/plna-moc',
  '/uznani-dluhu',
  '/spoluprace',
] as const;

test('all Czech builders render without unnamed form controls or horizontal overflow', async ({ page }) => {
  const failures: string[] = [];
  for (const route of BUILDERS) {
    await test.step(route, async () => {
      await page.goto(route);
      await expect(page.locator('main h1').first()).toBeVisible();
      const audit = await page.evaluate(() => {
        const controls = Array.from(document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea'))
          .filter((control) => control.type !== 'hidden' && !control.hidden && control.getAttribute('aria-hidden') !== 'true');
        const unnamed = controls.filter((control) => {
          const labels = 'labels' in control ? control.labels : null;
          return !control.getAttribute('aria-label')?.trim()
            && !control.getAttribute('aria-labelledby')?.trim()
            && !control.getAttribute('title')?.trim()
            && !(labels && labels.length > 0);
        });
        return {
          unnamed: unnamed.map((control) => control.getAttribute('name') || control.id || control.type),
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      if (audit.unnamed.length > 0) failures.push(`${route}: unnamed ${audit.unnamed.join(', ')}`);
      if (audit.overflow > 1) failures.push(`${route}: ${audit.overflow}px horizontal overflow`);
    });
  }
  expect(failures).toEqual([]);
});

test('/najem and /auto include SEO heading in prerendered HTML', async ({ request }) => {
  for (const route of ['/najem', '/auto']) {
    const response = await request.get(route);
    expect(response.ok()).toBeTruthy();
    const html = await response.text();
    expect(html).toMatch(/<main\b[^>]*contract-builder/i);
    expect(html).toMatch(/<h1\b/i);
  }
});

test('prices are visible before a customer opens checkout', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#smlouvy a[href="/najem"]')).toContainText('od 99 Kč');
  await page.goto('/najem');
  await expect(page.getByText('99 Kč', { exact: true }).first()).toBeVisible();
});

test('mobile blog has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/blog');
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.scrollWidth - dimensions.clientWidth).toBeLessThanOrEqual(1);
});

test('checkout modal exposes an accessible dialog and delivery email', async ({ page }) => {
  await page.goto('/najem');
  await expect(page.getByTestId('lease-landlord-name')).toBeVisible();
  await page.waitForTimeout(500);
  await page.getByTestId('lease-landlord-name').fill('Jan Pronajímatel');
  await page.getByTestId('lease-tenant-name').fill('Petr Nájemce');
  await page.getByTestId('lease-flat-address').fill('Praha 1');
  await page.getByTestId('lease-rent-amount').fill('20000');
  await page.getByTestId('lease-start-date').fill('2026-08-01');
  await page.getByTestId('lease-end-date').fill('2027-07-31');
  const checkoutButton = page.getByTestId('lease-open-checkout');
  const missingFieldsMessage = await checkoutButton.locator('xpath=following-sibling::p[1]').textContent();
  await expect(checkoutButton, missingFieldsMessage ?? undefined).toBeEnabled();
  await checkoutButton.click();

  const dialog = page.getByTestId('lease-checkout-modal');
  await expect(dialog).toBeVisible();
  await expect(page.getByTestId('checkout-delivery-email')).toHaveAttribute('required', '');
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
});

test('newsletter confirmation requires an explicit click and keeps its token out of requests', async ({ page }) => {
  const token = 'a'.repeat(64);
  let submittedToken = '';
  await page.route('**/api/newsletter/confirm', async (route) => {
    submittedToken = (route.request().postDataJSON() as { token?: string }).token ?? '';
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });

  await page.goto(`/newsletter/potvrdit#token=${token}`);
  await expect(page).toHaveURL(/\/newsletter\/potvrdit$/);
  await expect(page.getByRole('button', { name: 'Potvrdit odběr' })).toBeVisible();
  expect(submittedToken).toBe('');

  await page.getByRole('button', { name: 'Potvrdit odběr' }).click();
  await expect.poll(() => submittedToken).toBe(token);
  await expect(page.getByText('Odběr praktických tipů SmlouvaHned je potvrzený.')).toBeVisible();
});

test('secure download exchanges the fragment token through POST', async ({ page }) => {
  const token = 'b'.repeat(64);
  let requestData: { method: string; token: string } | null = null;
  await page.route('**/api/contracts/download', async (route) => {
    const body = route.request().postDataJSON() as { token?: string };
    requestData = { method: route.request().method(), token: body.token ?? '' };
    await route.fulfill({
      status: 200,
      contentType: 'application/pdf',
      headers: { 'Content-Disposition': 'attachment; filename="smlouva.pdf"' },
      body: '%PDF-1.4\n%%EOF',
    });
  });

  await page.goto(`/stahnout?session_id=cs_test#token=${token}`);
  await expect(page).toHaveURL(/\/stahnout\?session_id=cs_test$/);
  await expect.poll(() => requestData).toEqual({ method: 'POST', token });
  await expect(page.getByText('Stahování bylo zahájeno.')).toBeVisible();
});
