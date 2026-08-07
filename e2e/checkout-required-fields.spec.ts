/**
 * Probes each field the server insists on, one at a time.
 *
 * A buyer only fills what the form asks for. Whenever the server requires a
 * field the builder does not gate on, that buyer reaches the pay button and is
 * turned away afterwards — the failure mode behind the 15 July checkout
 * regression. This clears one required field at a time and asserts the builder
 * either blocks the attempt itself or produces a payload the server still takes.
 *
 * The checkout call is stubbed, so no Stripe session or draft is ever created.
 */
import { expect, test, type Page } from '@playwright/test';
import { validateContractPayload, type ContractType } from '../lib/checkout-validation';

type ProbeSetup = { field: string; value: string };
type FieldProbe = {
  field: string;
  value: string;
  label: string;
  setup?: ProbeSetup[];
};
type Builder = {
  route: string;
  contractType: ContractType;
  required: string[];
  money?: string[];
  conditional?: FieldProbe[];
};

/**
 * Amounts the server refuses. Clearing a field is not enough to find these:
 * the builders must agree with the server on zero, negative and exponent
 * notation before the buyer reaches the pay action.
 */
const REJECTED_AMOUNTS = ['0', '-1', '1e3'];

/** Mirrors non-optional and conditional requirements from lib/checkout-validation.ts. */
const BUILDERS: Builder[] = [
  {
    route: '/najem',
    contractType: 'lease',
    required: ['landlordName', 'tenantName', 'flatAddress', 'rentAmount', 'startDate'],
    money: ['rentAmount'],
    conditional: [{ field: 'endDate', value: '', label: 'endDate prázdné při době určité' }],
  },
  { route: '/auto', contractType: 'car_sale', required: ['sellerName', 'buyerName', 'carMake', 'carVIN', 'priceAmount'], money: ['priceAmount'] },
  {
    route: '/darovaci',
    contractType: 'gift',
    required: ['donorName', 'doneeName'],
    conditional: [
      { field: 'amount', value: '', label: 'amount prázdné při peněžním daru' },
      { field: 'carVIN', value: '', label: 'carVIN prázdné při darování auta', setup: [{ field: 'giftType', value: 'car' }] },
      { field: 'propertyAddress', value: '', label: 'propertyAddress prázdné při darování nemovitosti', setup: [{ field: 'giftType', value: 'property' }] },
      { field: 'thingDescription', value: '', label: 'thingDescription prázdné při darování věci', setup: [{ field: 'giftType', value: 'thing' }] },
    ],
  },
  { route: '/smlouva-o-dilo', contractType: 'work_contract', required: ['clientName', 'contractorName', 'workTitle', 'workDescription', 'priceAmount'], money: ['priceAmount'] },
  {
    route: '/pujcka',
    contractType: 'loan',
    required: ['lenderName', 'borrowerName', 'loanAmount'],
    money: ['loanAmount'],
    conditional: [
      { field: 'repaymentDate', value: '', label: 'repaymentDate prázdné při jednorázovém splacení' },
      { field: 'installmentCount', value: '', label: 'installmentCount prázdné při splátkách', setup: [{ field: 'repaymentType', value: 'installments' }] },
      { field: 'installmentAmount', value: '', label: 'installmentAmount prázdné při splátkách', setup: [{ field: 'repaymentType', value: 'installments' }] },
      { field: 'guarantorName', value: '', label: 'guarantorName prázdné při ručení', setup: [{ field: 'securityType', value: 'guarantee' }] },
    ],
  },
  { route: '/nda', contractType: 'nda', required: ['disclosingName', 'receivingName', 'confidentialInfoDesc'] },
  {
    route: '/kupni',
    contractType: 'general_sale',
    required: ['sellerName', 'buyerName', 'itemDescription', 'price'],
    money: ['price'],
    conditional: [{ field: 'carVIN', value: '', label: 'carVIN prázdné při prodeji auta', setup: [{ field: 'itemType', value: 'car' }] }],
  },
  {
    route: '/pracovni',
    contractType: 'employment',
    required: ['employerName', 'employeeName', 'jobTitle', 'workPlace', 'startDate'],
    conditional: [{ field: 'salary', value: '', label: 'salary i hourlyRate prázdné' }],
  },
  {
    route: '/dpp',
    contractType: 'dpp',
    required: ['employerName', 'employeeName', 'taskDescription', 'workPlace'],
    conditional: [{ field: 'totalRemuneration', value: '', label: 'totalRemuneration i hourlyRate prázdné' }],
  },
  {
    route: '/sluzby',
    contractType: 'service',
    required: ['providerName', 'clientName', 'serviceDescription'],
    conditional: [{ field: 'monthlyFee', value: '', label: 'všechny způsoby určení ceny prázdné' }],
  },
  {
    route: '/podnajem',
    contractType: 'sublease',
    required: ['landlordName', 'tenantName', 'flatAddress', 'rentAmount', 'startDate'],
    money: ['rentAmount'],
    conditional: [{ field: 'endDate', value: '', label: 'endDate prázdné při době určité' }],
  },
  {
    route: '/plna-moc',
    contractType: 'power_of_attorney',
    required: ['principalName', 'agentName'],
    conditional: [{ field: 'customScope', value: '', label: 'customScope prázdné při obecné plné moci' }],
  },
  { route: '/uznani-dluhu', contractType: 'debt_acknowledgment', required: ['creditorName', 'debtorName', 'debtAmount'], money: ['debtAmount'] },
  { route: '/spoluprace', contractType: 'cooperation', required: ['partyAName', 'partyBName', 'cooperationScope'] },
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
      if (!visible(select) || select.disabled || select.value) continue;
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
      else if (/estimatedhours/.test(name)) setValue(el, '80');
      else if (/hourlyrate/.test(name)) setValue(el, '200');
      else if (/salary|mzda/.test(name)) setValue(el, '30000');
      else if (type === 'number') setValue(el, '15000');
      else if (type === 'email') setValue(el, 'kupujici@example.com');
      else if (/vin/.test(name)) setValue(el, 'TMBJJ7NE8G0123456');
      else if (/ico|dic/.test(name)) setValue(el, '23660295');
      else if (/psc|zip/.test(name)) setValue(el, '11000');
      else setValue(el, 'Testovací hodnota');
    }
  });
}

/** Sets a named input/select or an explicitly marked button; false when unreachable. */
async function setControl(page: Page, name: string, value: string): Promise<boolean> {
  const markedButton = page.locator(
    `[data-field-name="${name}"][data-field-value="${value}"]`,
  ).first();
  if (await markedButton.isVisible().catch(() => false)) {
    await markedButton.click();
    return true;
  }

  const radio = page.locator(
    `input[type="radio"][name="${name}"][value="${value}"]`,
  ).first();
  if (await radio.count()) {
    await radio.check({ force: true });
    return true;
  }

  const control = page.locator(
    `select[name="${name}"]:visible, input[name="${name}"]:visible, textarea[name="${name}"]:visible`,
  ).first();
  const visible = await control
    .waitFor({ state: 'visible', timeout: 2_000 })
    .then(() => true)
    .catch(() => false);
  if (!visible) return false;

  if ((await control.evaluate((element) => element.tagName)) === 'SELECT') {
    await control.selectOption(value);
  } else {
    await control.fill(value);
  }
  return true;
}

for (const builder of BUILDERS) {
  test(`${builder.route} blocks or accepts every server-required field`, async ({ page }) => {
    const gaps: string[] = [];
    const unprobed: string[] = [];
    // Builders refuse a submit either by disabling the generate button or by
    // alerting from their own submit handler; both count as blocking.
    let blockedByAlert = false;
    page.on('dialog', (dialog) => {
      blockedByAlert = true;
      void dialog.accept();
    });

    const probes: FieldProbe[] = [
      ...builder.required.map((field) => ({ field, value: '', label: `${field} prázdné` })),
      ...(builder.money ?? []).flatMap((field) =>
        REJECTED_AMOUNTS.map((value) => ({ field, value, label: `${field}="${value}"` })),
      ),
      ...(builder.conditional ?? []),
    ];

    for (const probe of probes) {
      const { field, value } = probe;
      let captured: Record<string, unknown> | null = null;
      // Builders fire funnel events on click. Left alone, every test run would
    // write fake steps into the production analytics we diagnose from.
    await page.route('**/api/analytics', (route) => route.fulfill({ status: 204, body: '' }));

    await page.route('**/api/checkout', async (route) => {
        captured = JSON.parse(route.request().postData() ?? '{}');
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ url: 'https://example.test/stub' }) });
      });

      await page.goto(builder.route);
      await fillEveryField(page);
      let setupComplete = true;
      for (const setup of probe.setup ?? []) {
        if (!(await setControl(page, setup.field, setup.value))) {
          unprobed.push(`${probe.label} (nelze nastavit ${setup.field}="${setup.value}")`);
          setupComplete = false;
          break;
        }
      }
      if (!setupComplete) {
        await page.unroute('**/api/checkout');
        continue;
      }
      if (probe.setup?.length) await fillEveryField(page);

      const present = await setControl(page, field, value);
      if (!present) {
        // A field with no reachable control cannot be probed, and a probe that
        // silently skips is worse than none — it reports safety it never checked.
        unprobed.push(probe.label);
        await page.unroute('**/api/checkout');
        continue;
      }

      const generate = page.locator('[data-builder-generate]').first();
      await generate.scrollIntoViewIfNeeded();
      let reachedPay = false;
      blockedByAlert = false;
      const builderBlockedEarly = !(await generate.isEnabled());
      if (!builderBlockedEarly) {
        await generate.click();
        // The modal is lazy-loaded, so an instant visibility check is always
        // false — that is what silently skipped every probe in the first draft.
        const opened = await page
          .getByTestId('lease-checkout-modal')
          .waitFor({ state: 'visible', timeout: 5_000 })
          .then(() => true)
          .catch(() => false);
        if (opened) {
          reachedPay = true;
          await page.getByTestId('checkout-delivery-email').fill('kupujici@example.com');
          await page.getByTestId('lease-checkout-consent').check();
          await page.getByTestId('lease-checkout-pay').click();
          await page.waitForTimeout(600);
        }
      }
      await page.unroute('**/api/checkout');

      if (!captured) {
        // A builder that refuses to submit is the outcome we want. Only a run
        // that neither reached pay nor was refused proves nothing at all.
        const refused = builderBlockedEarly || blockedByAlert;
        if (!refused) {
          unprobed.push(
            reachedPay
              ? `${probe.label} (pay pressed, no request and no refusal — probe inconclusive)`
              : `${probe.label} (generate enabled, no refusal and checkout modal did not open)`,
          );
        }
        continue;
      }
      const body = captured as { payload?: Record<string, unknown> };
      const result = validateContractPayload(builder.contractType, body.payload ?? {});
      if (!result.success) {
        gaps.push(`${probe.label} — form allowed pay, server rejects: ${result.error.issues.map((i) => i.path.join('.')).join(', ')}`);
      }
    }

    expect(
      unprobed,
      `${builder.route}: these server-required fields have no reachable form control, so this test cannot vouch for them — give the input a name attribute`,
    ).toEqual([]);

    expect(
      gaps,
      `${builder.route}: a buyer can fill the form, press pay and be turned away afterwards`,
    ).toEqual([]);
  });
}
