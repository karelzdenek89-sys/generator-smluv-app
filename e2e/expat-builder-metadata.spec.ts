import { expect, test } from '@playwright/test';

const builders = [
  { path: '/najem', en: 'Rental Agreement', ua: 'Договір оренди' },
  { path: '/podnajem', en: 'Sublease Agreement', ua: 'Договір піднайму' },
  { path: '/pracovni', en: 'Employment Contract', ua: 'Трудовий договір' },
  { path: '/dpp', en: 'DPP Agreement', ua: 'Договір DPP' },
  { path: '/plna-moc', en: 'Power of Attorney', ua: 'Довіреність' },
  { path: '/auto', en: 'Car Purchase Agreement', ua: 'Договір купівлі-продажу авто' },
] as const;

for (const locale of ['en', 'ua'] as const) {
  test(`all supported builders expose ${locale.toUpperCase()} document metadata`, async ({ page }) => {
    for (const [index, builder] of builders.entries()) {
      const expectedTitle = builder[locale];
      await page.goto(`${builder.path}?lang=${locale}&metadata_check=${index}`);

      await expect(page.getByRole('heading', { name: expectedTitle }).first()).toBeVisible();
      await expect(page).toHaveTitle(`${expectedTitle} | SmlouvaHned`);
      await expect(page.locator('html')).toHaveAttribute('lang', locale === 'ua' ? 'uk' : 'en');
    }
  });
}

test('localized lease form does not expose its Czech default penalty text', async ({ page }) => {
  await page.goto('/najem?lang=en');
  await expect(page.getByPlaceholder('Late-vacating penalty, e.g. one day of rent')).toHaveValue(
    "one day's rent",
  );

  await page.goto('/najem?lang=ua');
  await expect(
    page.getByPlaceholder('Штраф за несвоєчасне звільнення, напр. денна орендна плата'),
  ).toHaveValue('одноденної орендної плати');
});
