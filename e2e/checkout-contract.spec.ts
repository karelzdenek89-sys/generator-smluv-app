/**
 * Guards the client/server contract of the payment path.
 *
 * The checkout regression of 15 July came from this exact gap: builders accepted
 * a form the server schema then rejected, so the request died after the buyer had
 * already committed to paying. Fixtures written by hand cannot catch that — they
 * are authored against the schema and pass by construction. This drives the real
 * builders instead, captures the payload the client actually sends, and asserts
 * the server accepts it.
 *
 * The checkout request is intercepted and answered with a stub, so no Stripe
 * session, Redis draft or analytics event is ever created.
 */
import { expect, test } from '@playwright/test';
import { validateContractPayload, type ContractType } from '../lib/checkout-validation';

type Builder = { route: string; contractType: ContractType };

const BUILDERS: Builder[] = [
  { route: '/najem', contractType: 'lease' },
  { route: '/auto', contractType: 'car_sale' },
  { route: '/darovaci', contractType: 'gift' },
  { route: '/smlouva-o-dilo', contractType: 'work_contract' },
  { route: '/pujcka', contractType: 'loan' },
  { route: '/nda', contractType: 'nda' },
  { route: '/kupni', contractType: 'general_sale' },
  { route: '/pracovni', contractType: 'employment' },
  { route: '/dpp', contractType: 'dpp' },
  { route: '/sluzby', contractType: 'service' },
  { route: '/podnajem', contractType: 'sublease' },
  { route: '/plna-moc', contractType: 'power_of_attorney' },
  { route: '/uznani-dluhu', contractType: 'debt_acknowledgment' },
  { route: '/spoluprace', contractType: 'cooperation' },
];

/**
 * Fills every visible control the way a customer plausibly would. React tracks
 * its own value, so the native setter has to be used before dispatching input.
 */
async function fillEveryField(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    const setValue = (element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) => {
      const prototype = element instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : element instanceof HTMLSelectElement
          ? HTMLSelectElement.prototype
          : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(prototype, 'value')?.set?.call(element, value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const isVisible = (element: HTMLElement) =>
      !element.hidden && element.getAttribute('aria-hidden') !== 'true' && element.offsetParent !== null;

    for (const select of Array.from(document.querySelectorAll('select'))) {
      if (!isVisible(select) || select.disabled) continue;
      const option = Array.from(select.options).find((o) => o.value && !o.disabled);
      if (option) setValue(select, option.value);
    }

    for (const field of Array.from(document.querySelectorAll('input, textarea'))) {
      const element = field as HTMLInputElement | HTMLTextAreaElement;
      if (!isVisible(element) || element.disabled || element.readOnly) continue;
      const type = element instanceof HTMLInputElement ? element.type : 'textarea';
      if (['hidden', 'submit', 'button', 'file', 'range', 'color'].includes(type)) continue;
      if (type === 'checkbox' || type === 'radio') continue;
      if (element.value.trim()) continue;

      const name = (element.getAttribute('name') || element.id || '').toLowerCase();
      // Amounts use the grouped, currency-suffixed notation Czech customers
      // actually type — the plain "15000" form is what let the July regression
      // through every fixture the project had.
      if (type === 'date') setValue(element, '2026-09-01');
      else if (type === 'number') setValue(element, '15000');
      else if (type === 'email') setValue(element, 'kupujici@example.com');
      else if (/amount|cena|price|rate|salary|mzda|odmena|castka|dluh/.test(name)) setValue(element, '15 000 Kč');
      else if (/vin/.test(name)) setValue(element, 'TMBJJ7NE8G0123456');
      else if (/ico|dic/.test(name)) setValue(element, '23660295');
      else if (/psc|zip/.test(name)) setValue(element, '11000');
      else if (/phone|telefon/.test(name)) setValue(element, '+420601123456');
      else setValue(element, 'Testovací hodnota');
    }
  });
}

for (const builder of BUILDERS) {
  test(`${builder.route} sends a payload the server schema accepts`, async ({ page }) => {
    let captured: Record<string, unknown> | null = null;

    // Answer the checkout call locally so nothing downstream of it ever runs.
    await page.route('**/api/checkout', async (route) => {
      captured = JSON.parse(route.request().postData() ?? '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ url: 'https://example.test/stub-checkout' }),
      });
    });

    await page.goto(builder.route);
    await expect(page.locator('main h1').first()).toBeVisible();

    await fillEveryField(page);

    const generate = page.locator('[data-builder-generate]').first();
    await generate.scrollIntoViewIfNeeded();
    await expect(generate).toBeEnabled();
    await generate.click();

    await expect(page.getByTestId('lease-checkout-modal')).toBeVisible();
    await page.getByTestId('checkout-delivery-email').fill('kupujici@example.com');
    await page.getByTestId('lease-checkout-consent').check();
    await page.getByTestId('lease-checkout-pay').click();

    await expect
      .poll(() => captured, { message: `${builder.route}: checkout request was never sent` })
      .not.toBeNull();

    const body = captured as unknown as { contractType?: string; payload?: Record<string, unknown> };
    expect(body.contractType, `${builder.route}: wrong contractType`).toBe(builder.contractType);

    const result = validateContractPayload(builder.contractType, body.payload ?? {});
    const issues = result.success
      ? []
      : result.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`);

    expect(
      issues,
      `${builder.route}: a fully filled form produced a payload the server rejects — the buyer would see an error after pressing pay`,
    ).toEqual([]);
  });
}
