/**
 * Zaplacená archivní lhůta se nesmí zkrátit.
 *
 * Když Stripe hlásí zaplaceno, ale webhook ještě nedoběhl, download route
 * dopíše `paid` sám (failsafe). Dřív si k tomu počítal lhůtu jen z tieru,
 * takže objednávka s add-onem `extended_archive` (90 dní) nebo s tematickým
 * balíčkem dostala 7 nebo 30 dní. Webhook pak uložené `expiresAt` respektuje,
 * takže se zkrácení nikdy samo neopravilo a zákazník tiše přišel o archiv,
 * který si zaplatil.
 */
import assert from 'node:assert/strict';
import { resolveArchiveTtlSeconds } from '../lib/archive-retention';
import { getArchiveDaysWithAddons } from '../lib/checkout-addons';

const DAY = 60 * 60 * 24;

type Draft = Parameters<typeof resolveArchiveTtlSeconds>[0];

function draft(over: Partial<Draft> = {}): Draft {
  return {
    contractType: 'lease',
    tier: 'basic',
    packageKey: null,
    payload: { contractType: 'lease' },
    paid: true,
    createdAt: new Date().toISOString(),
    ...over,
  } as Draft;
}

// Základní tier bez doplňků drží svou lhůtu.
assert.equal(
  resolveArchiveTtlSeconds(draft()),
  getArchiveDaysWithAddons('basic', null, []) * DAY,
);

// Regrese: add-on prodlouženého archivu musí přežít i failsafe cestu.
assert.equal(
  resolveArchiveTtlSeconds(draft({ addOns: ['extended_archive'] })),
  90 * DAY,
  'extended_archive musí dát 90 dní, ne tierovou konstantu',
);

// Add-on uložený jen uvnitř payloadu (starší objednávky) se počítá stejně.
assert.equal(
  resolveArchiveTtlSeconds(
    draft({ payload: { contractType: 'lease', addOns: ['extended_archive'] } as Draft['payload'] }),
  ),
  90 * DAY,
);

// Tematický balíček nesmí spadnout na lhůtu základního tieru.
const packaged = resolveArchiveTtlSeconds(
  draft({ contractType: 'car_sale', payload: { contractType: 'car_sale' }, packageKey: 'vehicle_sale' }),
);
assert.equal(packaged, getArchiveDaysWithAddons('complete', 'vehicle_sale', []) * DAY);
assert.ok(packaged >= 30 * DAY, 'balíček musí mít aspoň lhůtu complete tieru');

// Metadata ze Stripe mají přednost před draftem, stejně jako ve zbytku routy.
assert.equal(
  resolveArchiveTtlSeconds(draft({ addOns: ['extended_archive'] }), 'complete'),
  90 * DAY,
);

// Failsafe nikdy nesmí vrátit méně, než kolik dává samotný tier.
for (const tier of ['basic', 'professional', 'complete'] as const) {
  const withAddon = resolveArchiveTtlSeconds(draft({ tier, addOns: ['extended_archive'] }));
  const without = resolveArchiveTtlSeconds(draft({ tier }));
  assert.ok(withAddon >= without, `${tier}: add-on nesmí zkrátit archiv`);
}

console.log('Archive retention tests passed (failsafe, add-ony, balíčky, metadata).');
