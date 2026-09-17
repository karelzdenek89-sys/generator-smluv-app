import { expect, test, type Page } from '@playwright/test';

/**
 * SmlouvaHned 2.0 — portálový funnel: situace → nástroj → dokument → případ.
 * Všechny odpovědi case API jsou stubované; žádná platba, Redis ani e-mail.
 */

const CASE_ID = '2a7f2a0c-8f61-4a2e-9d2f-0c8c9b3a1f11';
const TOKEN = 'a'.repeat(64);

function sampleCase(overrides: Record<string, unknown> = {}) {
  return {
    id: CASE_ID,
    schemaVersion: 1,
    kind: 'work_order',
    ownerRole: 'contractor',
    ownerEmailMasked: 'j****@example.cz',
    title: 'Rekonstrukce koupelny',
    stage: 'contract_signed',
    startDate: '2026-10-01',
    deadline: '2026-12-15',
    priceAmountCzk: 185000,
    priceMode: 'milestones',
    origin: { source: 'success_page', contractType: 'work_contract', tier: 'basic', packageKey: null },
    documents: [],
    tasks: [
      { key: 'contract_archived', label: 'Podepsaná smlouva uložena u obou stran', stage: 'contract_signed', done: false },
      { key: 'deadline_set', label: 'Nastaven termín dokončení a připomínky', stage: 'contract_signed', done: true },
      { key: 'handover_protocol', label: 'Sepsán předávací protokol', stage: 'handover', done: false, documentKind: 'handover_protocol' },
    ],
    events: [{ id: 'e1', type: 'created', at: '2026-09-17T10:00:00.000Z', label: 'Zakázka založena ze smlouvy o dílo' }],
    reminders: [],
    remindersEnabled: false,
    createdAt: '2026-09-17T10:00:00.000Z',
    updatedAt: '2026-09-17T10:00:00.000Z',
    lastAccessAt: '2026-09-17T10:00:00.000Z',
    expiresAt: '2027-09-17T10:00:00.000Z',
    ...overrides,
  };
}

async function stubAnalytics(page: Page) {
  await page.route('**/api/analytics', (route) => route.fulfill({ json: { ok: true } }));
}

test('homepage leads from a situation to the document builder and to the case hub', async ({ page }) => {
  await stubAnalytics(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 }).first()).toContainText('Smlouvy online');
  await expect(page.getByText('Od první dohody až po poslední předání.')).toBeVisible();
  await expect(page.locator('#situace')).toBeVisible();
  const situationLinks = page.locator('#situace a');
  await expect(situationLinks.filter({ hasText: 'Začít zakázku' })).toHaveAttribute('href', '/smlouva-o-dilo');
  await expect(situationLinks.filter({ hasText: 'Vyřešit zaměstnávání' })).toHaveAttribute('href', '/zamestnavam');
  await expect(page.locator('#smlouvy')).toBeVisible();
  await expect(page.locator('#pomoc-zdarma')).toBeVisible();
  await expect(page.locator('#pomoc-zdarma a[href="/nastroje"]').first()).toBeVisible();

  await situationLinks.filter({ hasText: 'Jak zakázka probíhá' }).click();
  await expect(page).toHaveURL(/\/zakazka$/);
  await expect(page.locator('main h1')).toHaveText('Zakázka od smlouvy po předání');
  await expect(page.locator('#moje-zakazka')).toBeVisible();
  await page.getByRole('link', { name: 'Začít zakázku →' }).first().click();
  await expect(page).toHaveURL(/\/smlouva-o-dilo$/);
  await expect(page.locator('#formular')).toBeVisible();
  await expect(page.getByTestId('paid-document-notice')).toContainText('99 Kč');
});

test('answer-first page, tools index and legal radar render server-side content with sources', async ({ page, request }) => {
  await stubAnalytics(page);
  const html = await (await request.get('/zakazka/remeslnik-nedodrzel-termin')).text();
  expect(html).toContain('Stručná odpověď');
  expect(html).toContain('Co máte udělat');
  expect(html).toContain('Oficiální zdroje');
  expect(html).toContain('e-sbirka.cz');
  expect(html).toContain('Právní stav ověřen');
  expect(html).toContain('"@type":"FAQPage"');
  expect(html).toContain('rel="canonical" href="https://www.smlouvahned.cz/zakazka/remeslnik-nedodrzel-termin"');

  await page.goto('/nastroje');
  await expect(page.locator('main h1')).toContainText('Checklisty a průvodci');
  await page.getByRole('link', { name: /Checklist před smlouvou o dílo/ }).first().click();
  await expect(page).toHaveURL(/\/nastroje\/checklist-pred-smlouvou-o-dilo$/);
  const firstItem = page.locator('input[type="checkbox"]').first();
  await firstItem.check();
  await expect(page.getByRole('status')).toContainText('1 z');
  await page.reload();
  await expect(page.locator('input[type="checkbox"]').first()).toBeChecked();
  await expect(page.getByRole('link', { name: /Vytvořit smlouvu o dílo/ })).toHaveAttribute('href', '/smlouva-o-dilo');

  await page.goto('/zmeny-2027');
  await expect(page.locator('main h1')).toContainText('Změny 2027');
  await expect(page.getByText('PLATÍ', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('PROJEDNÁVÁ SE', { exact: true }).first()).toBeVisible();
  await page.getByRole('link', { name: /Změny 2027 pro zaměstnavatele/ }).first().click();
  await expect(page).toHaveURL(/\/zmeny-2027\/zamestnavatele$/);
  await expect(page.locator('#jmhz-jednotne-mesicni-hlaseni')).toBeVisible();
  await expect(page.locator('#jmhz-jednotne-mesicni-hlaseni a[href*="cssz.gov.cz"]').first()).toBeVisible();
});

test('employment wizard recommends a document and flags borderline cases', async ({ page }) => {
  await stubAnalytics(page);
  await page.goto('/zamestnavam');
  await expect(page.locator('main h1')).toHaveText('Co potřebujete vyřešit?');
  await page.getByRole('button', { name: 'Ano, dlouhodobě a pravidelně' }).click();
  await page.getByRole('button', { name: /Ne — pracuje samostatně/ }).click();
  await page.getByRole('button', { name: 'Ne / nejsem si jistý' }).click();
  await expect(page.getByText('Situace může vyžadovat individuální posouzení')).toBeVisible();
  await expect(page.getByRole('link', { name: /Pracovní smlouva online/ }).first()).toHaveAttribute('href', '/pracovni');
  await page.getByRole('button', { name: '← Začít znovu' }).click();
  await page.getByRole('button', { name: /Ne, jde o jednorázovou/ }).click();
  await page.getByRole('button', { name: 'Nejvýše 300 hodin za rok' }).click();
  await expect(page.getByText('dohodu o provedení práce (DPP)')).toBeVisible();
});

test('success page offers case continuation only after a paid work contract and opens the case', async ({ page }) => {
  await stubAnalytics(page);
  await page.route('**/api/contracts/status', (route) =>
    route.fulfill({ json: { status: 'paid', contractType: 'work_contract', contractName: 'Smlouva o dílo', lang: 'cs', tier: 'basic', archiveDays: 7, tierLabel: '99 Kč', priceLabel: '99 Kč' } }),
  );
  let created = 0;
  await page.route('**/api/cases/from-order', async (route) => {
    created++;
    expect(route.request().postDataJSON()).toEqual({ sessionId: 'cs_work', token: 'test-capability' });
    await route.fulfill({ json: { caseId: CASE_ID, token: TOKEN, path: `/moje-zakazka?id=${CASE_ID}`, created: true, emailSent: true, case: sampleCase() } });
  });
  await page.route('**/api/cases/resolve', async (route) => {
    const body = route.request().postDataJSON();
    expect(body).toMatchObject({ caseId: CASE_ID, token: TOKEN });
    await route.fulfill({ json: { case: sampleCase(), documentPriceLabel: '99 Kč', documentsIncluded: false, sharedDefaults: {} } });
  });

  await page.goto('/success?session_id=cs_work#token=test-capability');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Platba přijata');
  await expect(page.getByRole('link', { name: 'Stáhnout PDF', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pokračovat jako zakázka' }).click();
  await expect(page.getByRole('link', { name: 'Otevřít případ →' })).toBeVisible();
  expect(created).toBe(1);
  await page.getByRole('link', { name: 'Otevřít případ →' }).click();
  await expect(page).toHaveURL(new RegExp(`/moje-zakazka\\?id=${CASE_ID}$`));
  expect(page.url()).not.toContain(TOKEN);
  await expect(page.locator('main h1')).toHaveText('Rekonstrukce koupelny');
  await expect(page.getByText('15. 12. 2026')).toBeVisible();
  await page.reload();
  await expect(page.locator('main h1')).toHaveText('Rekonstrukce koupelny');
});

test('other contract types never see the case offer', async ({ page }) => {
  await stubAnalytics(page);
  await page.route('**/api/contracts/status', (route) =>
    route.fulfill({ json: { status: 'paid', contractType: 'lease', contractName: 'Nájemní smlouva', lang: 'cs', tier: 'basic', archiveDays: 7 } }),
  );
  await page.goto('/success?session_id=cs_lease#token=test-capability');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Platba přijata');
  await expect(page.getByRole('button', { name: 'Pokračovat jako zakázka' })).toHaveCount(0);
});

test('case workspace: stage, reminders, follow-up document checkout and access hygiene', async ({ page }) => {
  await stubAnalytics(page);
  let current = sampleCase();
  await page.route('**/api/cases/resolve', (route) =>
    route.fulfill({ json: { case: current, documentPriceLabel: '99 Kč', documentsIncluded: false, sharedDefaults: {} } }),
  );
  const actions: Array<Record<string, unknown>> = [];
  await page.route('**/api/cases/update', async (route) => {
    const body = route.request().postDataJSON();
    expect(body.token).toBe(TOKEN);
    actions.push(body.action);
    if (body.action.type === 'set_stage') current = sampleCase({ stage: body.action.stage });
    if (body.action.type === 'set_reminders') {
      current = sampleCase({
        remindersEnabled: true,
        reminders: [
          { id: 'r1', dueAt: '2026-11-15T06:00:00.000Z', offsetDays: 30, anchor: 'deadline', status: 'scheduled', createdAt: '2026-09-17T10:00:00.000Z' },
          { id: 'r2', dueAt: '2026-12-14T06:00:00.000Z', offsetDays: 1, anchor: 'deadline', status: 'scheduled', createdAt: '2026-09-17T10:00:00.000Z' },
        ],
      });
    }
    await route.fulfill({ json: { case: current } });
  });
  let checkoutBody: Record<string, unknown> | null = null;
  await page.route('**/api/cases/documents/create', async (route) => {
    checkoutBody = route.request().postDataJSON();
    await route.fulfill({ json: { case: current, documentId: 'doc-1', ready: false, url: '/moje-zakazka?id=' + CASE_ID + '&doc=doc-1&cancelled=1#access=' + TOKEN } });
  });

  await page.goto(`/moje-zakazka?id=${CASE_ID}#access=${TOKEN}`);
  await expect(page.locator('main h1')).toHaveText('Rekonstrukce koupelny');
  expect(page.url()).not.toContain('access=');

  await page.getByRole('button', { name: 'Předání', exact: true }).click();
  await expect(page.getByText('Fáze změněna: Předání díla.')).toBeVisible();
  await expect(page.getByText('Doporučeno v této fázi').first()).toBeVisible();

  await page.getByLabel('E-mailové připomínky termínu').click();
  await expect(page.getByText('Připomínky zapnuty.')).toBeVisible();
  await expect(page.getByText('30 dní předem')).toBeVisible();
  await expect(page.getByText('1 den předem')).toBeVisible();

  await page.getByRole('button', { name: /Předávací protokol k dílu/ }).first().click();
  await expect(page.getByRole('heading', { name: 'Předávací protokol k dílu' })).toBeVisible();
  await expect(page.getByText('§ 2604 OZ')).toBeVisible();
  const payButton = page.getByRole('button', { name: /Připravit a zaplatit 99 Kč/ });
  await expect(payButton).toBeDisabled();
  await page.getByLabel('Objednatel (jméno / název) *').fill('Jan Novák');
  await page.getByLabel('Zhotovitel (jméno / název) *').fill('Petr Dvořák');
  await page.getByLabel('Datum předání *').fill('2026-12-15');
  await page.getByLabel('Místo předání *').fill('Praha 6');
  await page.getByLabel('Rozsah skutečně provedených prací *').fill('Kompletní koupelna');
  await page.getByLabel('Výsledek přejímky *').selectOption('accepted');
  await page.locator('form').filter({ hasText: 'Předávací protokol k dílu' }).getByRole('checkbox').check();
  await expect(payButton).toBeEnabled();
  await payButton.click();
  await expect.poll(() => checkoutBody).not.toBeNull();
  expect(checkoutBody).toMatchObject({ caseId: CASE_ID, token: TOKEN, kind: 'handover_protocol', data: { customerName: 'Jan Novák', acceptanceResult: 'accepted' } });
  expect((checkoutBody as unknown as Record<string, unknown>).consent).toMatchObject({ accepted: true, textVersion: 'digital-content-v1' });
  await expect(page).toHaveURL(/cancelled=1/);
  await expect(page.getByText('Platba nebyla dokončena.')).toBeVisible();

  expect(actions.map((action) => action.type)).toEqual(['set_stage', 'set_reminders']);
});

test('invalid or missing case link explains recovery and stays noindex', async ({ page, request }) => {
  await stubAnalytics(page);
  const response = await request.get(`/moje-zakazka?id=${CASE_ID}`);
  expect(response.headers()['x-robots-tag']).toContain('noindex');
  // Next dev overrides this header in base-server; production must remain no-store.
  expect(response.headers()['cache-control']).toContain(
    process.env.PLAYWRIGHT_DEV_SERVER === 'true' ? 'no-cache' : 'no-store',
  );
  await page.goto(`/moje-zakazka?id=${CASE_ID}`);
  await expect(page.locator('main h1')).toHaveText('Odkaz k zakázce je neplatný nebo vypršel');
  await page.getByRole('link', { name: 'Poslat návratový odkaz' }).click();
  await expect(page).toHaveURL(/\/moje-zakazka\/obnovit$/);
  await page.route('**/api/cases/request-link', (route) => route.fulfill({ json: { ok: true } }));
  await page.getByLabel('E-mail z objednávky').fill('owner@example.cz');
  await page.getByRole('button', { name: 'Poslat odkaz' }).click();
  await expect(page.getByRole('status')).toContainText('přijde zpráva s odkazy');
});

test('portal routes are indexable, canonical and free of overflow on mobile', async ({ page, request }) => {
  await stubAnalytics(page);
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const path of ['/zakazka', '/zamestnavam', '/nastroje', '/zmeny-2027', '/zamestnavam/dpp', '/nastroje/jaky-vztah-potrebuji', '/zmeny-2027/osvc-a-podnikatele']) {
    expect(sitemap).toContain(`<loc>https://www.smlouvahned.cz${path}</loc>`);
  }
  expect(sitemap).not.toContain('/moje-zakazka');
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Disallow: /moje-zakazka');

  await page.setViewportSize({ width: 375, height: 812 });
  for (const path of ['/', '/zakazka', '/zamestnavam', '/nastroje/checklist-prodeje-auta', '/zmeny-2027']) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${path} overflows on mobile`).toBeLessThanOrEqual(1);
  }
});
