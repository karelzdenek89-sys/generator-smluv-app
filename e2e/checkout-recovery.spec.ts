import { expect, test } from '@playwright/test';

// All network responses representing payments/downloads are synthetic. No charge.
test('pending verification retries and refresh retains order-scoped access', async ({ page }) => {
  let calls = 0;
  let paid = false;
  await page.route('**/api/contracts/status', async (route) => {
    calls++;
    expect(route.request().postDataJSON()).toMatchObject({ sessionId: 'cs_recovery', token: 'test-capability' });
    await route.fulfill({ json: { status: paid ? 'paid' : 'pending', contractType: 'lease', lang: 'cs', tier: 'basic', archiveDays: 7 } });
  });
  await page.goto('/success?session_id=cs_recovery#token=test-capability');
  await expect(page.getByRole('button', { name: 'Zkusit znovu' })).toBeVisible({ timeout: 30_000 });
  expect(calls).toBe(13);
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Platba přijata');
  paid = true;
  await page.getByRole('button', { name: 'Zkusit znovu' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Platba přijata');
  expect(calls).toBe(14);
  expect(page.url()).not.toContain('token=');
  await page.reload();
  await expect(page.getByRole('link', { name: 'Stáhnout PDF', exact: true })).toHaveAttribute('href', /#token=test-capability$/);
  expect(calls).toBe(15);
  await page.goto('/success?session_id=cs_other');
  await expect(page.getByRole('heading', { name: 'Stránka není dostupná' })).toBeVisible();
  expect(calls).toBe(15);
});

for (const kind of ['paid', 'free'] as const) {
  test(`${kind} download refresh and retry preserve access`, async ({ page }) => {
    let calls = 0;
    await page.route('**/api/contracts/**', async (route) => {
      calls++;
      expect(route.request().postDataJSON().token).toBe('test-capability');
      await route.fulfill({ status: 503, json: { error: 'Test unavailable' } });
    });
    await page.goto(`/stahnout?${kind === 'paid' ? 'session_id=cs_download&format=docx' : 'free_id=free_download'}#token=test-capability`);
    await expect(page.locator('main [role="alert"]')).toHaveText('Test unavailable');
    await page.reload();
    await expect(page.locator('main [role="alert"]')).toHaveText('Test unavailable');
    await page.getByRole('button', { name: 'Stáhnout znovu' }).click();
    await expect.poll(() => calls).toBe(3);
  });
}

test('blocked storage keeps fragment access usable after refresh', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new Error('Storage blocked'); };
    Storage.prototype.getItem = () => { throw new Error('Storage blocked'); };
  });
  await page.route('**/api/contracts/status', (route) => route.fulfill({ json: { status: 'paid' } }));
  await page.goto('/success?session_id=cs_blocked#token=test-capability');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Platba přijata');
  expect(page.url()).toContain('#token=test-capability');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Platba přijata');
});

const builders = {
  najem: 'landlordName', auto: 'sellerName', darovaci: 'donorName',
  'smlouva-o-dilo': 'clientName', pujcka: 'lenderName', nda: 'disclosingName',
  kupni: 'sellerName', pracovni: 'employerName', dpp: 'employerName',
  sluzby: 'providerName', podnajem: 'landlordName', 'plna-moc': 'principalName',
  'uznani-dluhu': 'debtorName', spoluprace: 'partyAName',
};
for (const [path, field] of Object.entries(builders)) {
  test(`${path} preserves a draft through checkout return`, async ({ page }) => {
    await page.goto(`/${path}`);
    // Cenové pásmo je vidět před vyplněním (transparentnost); přesná cena a
    // doporučená varianta až v souhrnu před platbou.
    await expect(page.getByTestId('paid-document-notice')).toContainText('99 Kč');
    await expect(page.getByTestId('paid-document-notice')).toContainText('199 Kč');
    await expect(page.getByText('Cena v dalším kroku').first()).toBeVisible();
    const input = page.locator(`input[name="${field}"]`);
    await input.fill('TEST recovery');
    await page.locator('input[name="tier"][value="complete"]').check();
    await page.goto('/success');
    await page.goto(`/${path}?resume=1#formular`);
    await expect(input).toHaveValue('TEST recovery');
    await expect(page.locator('input[name="tier"][value="complete"]')).toBeChecked();
  });
}

test('price is revealed after completion; checkout details recover but consent does not', async ({ page }) => {
  await page.goto('/najem');
  for (const [name, value] of Object.entries({ landlordName: 'Test Landlord', tenantName: 'Test Tenant', flatAddress: 'Test 1, Praha', rentAmount: '15000', startDate: '2026-10-01', endDate: '2027-10-01' })) {
    await page.locator(`[name="${name}"]`).fill(value);
  }
  await expect(page.getByTestId('paid-document-notice')).toContainText('99 Kč');
  await page.getByTestId('lease-open-checkout').click();
  await expect(page.getByTestId('lease-checkout-pay')).toContainText('99 Kč');
  await page.getByTestId('lease-checkout-modal').getByRole('button', { name: /Editovatelná DOCX verze/ }).click();
  await expect(page.getByTestId('lease-checkout-pay')).toContainText('148 Kč');
  await page.getByTestId('checkout-delivery-email').fill('recovery@example.invalid');
  await page.getByTestId('lease-checkout-consent').check();
  await page.goto('/success');
  await page.goto('/najem?resume=1#formular');
  await page.getByTestId('lease-open-checkout').click();
  await expect(page.getByTestId('checkout-delivery-email')).toHaveValue('recovery@example.invalid');
  await expect(page.getByTestId('lease-checkout-pay')).toContainText('148 Kč');
  await expect(page.getByTestId('lease-checkout-consent')).not.toBeChecked();
});

test('expired access does not authorize another request; legacy query token is removed', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/contracts/status', (route) => {
    calls++;
    return route.fulfill({ json: { status: 'paid' } });
  });
  await page.goto('/success?session_id=cs_expired&token=test-capability');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Platba přijata');
  expect(page.url()).not.toContain('token=');
  await page.evaluate(() => {
    sessionStorage.setItem('sh_document_access:paid:cs_expired', JSON.stringify({ token: 'test-capability', expiresAt: 1 }));
  });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Stránka není dostupná' })).toBeVisible();
  expect(calls).toBe(1);
});

test('draft expiry and package isolation', async ({ page }) => {
  await page.goto('/najem');
  await page.locator('[name="landlordName"]').fill('TEST standalone');
  await page.goto('/najem?package=landlord');
  await expect(page.locator('[name="landlordName"]')).toHaveValue('');
  await page.goto('/najem');
  await expect(page.locator('[name="landlordName"]')).toHaveValue('TEST standalone');
  await page.evaluate(() => {
    const key = 'sh_builder_draft:/najem::cs';
    const saved = JSON.parse(sessionStorage.getItem(key)!);
    saved.expiresAt = 1;
    sessionStorage.setItem(key, JSON.stringify(saved));
  });
  await page.reload();
  await expect(page.locator('[name="landlordName"]')).toHaveValue('');
});

for (const width of [360, 390, 768, 1440]) {
  test(`expanded catalog is not clipped at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.locator('[data-homepage-catalog-toggle]').click();
    const catalog = page.locator('#homepage-more-contracts');
    await expect(catalog).toBeVisible();
    expect(await catalog.evaluate((element) => element.scrollHeight <= element.clientHeight + 1)).toBe(true);
    await expect(catalog.locator('a')).toHaveCount(9);
  });
}
