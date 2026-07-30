/**
 * Live verification that a checkout really reaches Stripe.
 *
 * Every other spec stubs /api/checkout, so none of them touch the step where
 * the funnel actually collapses: the server creating a Stripe session. This one
 * lets the call through against a real deployment and asserts a session URL
 * comes back.
 *
 * It creates real — but unpaid — Checkout Sessions. No money moves and they
 * expire on their own, yet they do show up in the Stripe dashboard, so this is
 * opt-in and never runs in CI:
 *
 *   LIVE_CHECKOUT_AUDIT=1 PLAYWRIGHT_SKIP_WEBSERVER=1 \
 *   PLAYWRIGHT_BASE_URL=https://www.smlouvahned.cz \
 *   npx playwright test e2e/live-checkout-audit.spec.ts
 *
 * Analytics stays stubbed so an audit run cannot forge funnel steps in the
 * production data the diagnosis depends on.
 *
 * Checkout is rate limited to 20 attempts per IP per hour, so the full matrix
 * cannot complete in one run — the tail comes back 429. Use -g to work through
 * it in batches, or expect the last few to report a rate limit rather than a
 * real fault.
 */
import { expect, test, type Page } from '@playwright/test';

const ENABLED = process.env.LIVE_CHECKOUT_AUDIT === '1';
/** Marks the sessions this audit leaves behind so they are easy to spot. */
const AUDIT_EMAIL = 'checkout-audit@example.com';

type Target = { route: string; label: string };

const CZECH: Target[] = [
  { route: '/najem', label: 'nájemní smlouva' },
  { route: '/auto', label: 'kupní smlouva na auto' },
  { route: '/darovaci', label: 'darovací smlouva' },
  { route: '/smlouva-o-dilo', label: 'smlouva o dílo' },
  { route: '/pujcka', label: 'smlouva o zápůjčce' },
  { route: '/nda', label: 'NDA' },
  { route: '/kupni', label: 'kupní smlouva' },
  { route: '/pracovni', label: 'pracovní smlouva' },
  { route: '/dpp', label: 'DPP' },
  { route: '/sluzby', label: 'smlouva o službách' },
  { route: '/podnajem', label: 'podnájemní smlouva' },
  { route: '/plna-moc', label: 'plná moc' },
  { route: '/uznani-dluhu', label: 'uznání dluhu' },
  { route: '/spoluprace', label: 'smlouva o spolupráci' },
];

const EXPAT = ['/najem', '/podnajem', '/pracovni', '/dpp', '/plna-moc', '/auto'];

const TARGETS: Target[] = [
  ...CZECH,
  ...EXPAT.flatMap((route) => [
    { route: `${route}?lang=en`, label: `${route} EN` },
    { route: `${route}?lang=ua`, label: `${route} UA` },
  ]),
];

async function fillEveryField(page: Page) {
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
    const visible = (el: HTMLElement) => !el.hidden && el.getAttribute('aria-hidden') !== 'true' && el.offsetParent !== null;

    for (const select of Array.from(document.querySelectorAll('select'))) {
      if (!visible(select) || select.disabled) continue;
      const option = Array.from(select.options).find((o) => o.value && !o.disabled);
      if (option) setValue(select, option.value);
    }
    for (const field of Array.from(document.querySelectorAll('input, textarea'))) {
      const el = field as HTMLInputElement | HTMLTextAreaElement;
      if (!visible(el) || el.disabled || el.readOnly) continue;
      const type = el instanceof HTMLInputElement ? el.type : 'textarea';
      if (['hidden', 'submit', 'button', 'file', 'range', 'color', 'checkbox', 'radio'].includes(type)) continue;
      if (el.value.trim()) continue;
      const name = (el.getAttribute('name') || el.id || '').toLowerCase();
      if (type === 'date') setValue(el, '2026-09-01');
      else if (type === 'number') setValue(el, '15000');
      else if (type === 'email') setValue(el, 'checkout-audit@example.com');
      else if (/vin/.test(name)) setValue(el, 'TMBJJ7NE8G0123456');
      else if (/ico|dic/.test(name)) setValue(el, '23660295');
      else if (/psc|zip/.test(name)) setValue(el, '11000');
      else setValue(el, 'Kontrola platebni cesty');
    }
  });
}

test.describe('live checkout audit', () => {
  test.skip(!ENABLED, 'opt-in: set LIVE_CHECKOUT_AUDIT=1 (creates real unpaid Stripe sessions)');

  for (const target of TARGETS) {
    test(`${target.route} reaches Stripe`, async ({ page }) => {
      await page.route('**/api/analytics', (route) => route.fulfill({ status: 204, body: '' }));

      type CheckoutAnswer = { status: number; url?: string; error?: string; field?: string };
      const answers: CheckoutAnswer[] = [];
      // Reading the body from a response event races the redirect to Stripe and
      // loses it. Fetching inside the route keeps the body while still letting
      // the real request through.
      await page.route('**/api/checkout', async (route) => {
        const response = await route.fetch();
        const parsed = (await response.json().catch(() => ({}))) as Omit<CheckoutAnswer, 'status'>;
        answers.push({ status: response.status(), ...parsed });
        await route.fulfill({ response });
      });

      // Stripe's own page is never loaded; the session URL in the response is
      // proof enough that the server created one.
      await page.route('https://checkout.stripe.com/**', (route) => route.abort());

      await page.goto(target.route);
      await expect(page.locator('main h1').first()).toBeVisible();
      await fillEveryField(page);

      const generate = page.locator('[data-builder-generate]').first();
      await generate.scrollIntoViewIfNeeded();
      await expect(generate, `${target.label}: generate button stayed disabled`).toBeEnabled();
      await generate.click();

      await expect(page.getByTestId('lease-checkout-modal')).toBeVisible();
      await page.getByTestId('checkout-delivery-email').fill(AUDIT_EMAIL);
      await page.getByTestId('lease-checkout-consent').check();
      await page.getByTestId('lease-checkout-pay').click();

      await expect
        .poll(() => answers.length, { timeout: 20_000, message: `${target.label}: /api/checkout never answered` })
        .toBeGreaterThan(0);

      const answer = answers[answers.length - 1];
      expect(
        { status: answer.status, error: answer.error, field: answer.field },
        `${target.label}: checkout refused`,
      ).toEqual({ status: 200, error: undefined, field: undefined });

      expect(answer.url, `${target.label}: no Stripe session URL returned`).toContain('stripe.com');
    });
  }
});
