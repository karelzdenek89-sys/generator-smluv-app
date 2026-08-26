import assert from 'node:assert/strict';
import { buildPartnerContext } from '../lib/partners/context';
import { getEditorialPartnerOffer, getEligiblePartnerOffers } from '../lib/partners/catalog';
import {
  createPartnerLeadConsent,
  tryDeliverPartnerLead,
  type PartnerLeadAdapter,
} from '../lib/partners/lead-consent';
import { PARTNER_CONTEXT_KEYS, type PartnerContext } from '../lib/partners/types';

function resetPartnerEnv() {
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('PARTNER_')) delete process.env[key];
  }
}

function baseContext(overrides: Partial<PartnerContext> = {}): PartnerContext {
  return {
    contractType: 'car_sale',
    documentTier: 'complete',
    locale: 'cs',
    country: 'CZ',
    transactionCategory: 'vehicle_used',
    userRole: 'buyer',
    valueBand: '250k_500k',
    customerType: 'consumer',
    paid: true,
    completed: true,
    ...overrides,
  };
}

function testContextAllowlistAndPiiRemoval() {
  const pii = {
    partnerUserRole: 'buyer',
    sellerName: 'Jan Prodávající',
    buyerName: 'Marie Kupující',
    sellerEmail: 'jan@example.test',
    buyerPhone: '+420 777 123 456',
    sellerAddress: 'Přesná 1, Praha',
    buyerBirth: '1990-01-01',
    rodneCislo: '900101/1234',
    passport: 'AB123456',
    bankAccount: '123456/0100',
    signature: 'base64-data',
    carVIN: 'TMBEXAMPLEVIN1234',
    priceAmount: '420 000 Kč',
    knownDefects: 'citlivá poznámka a volný text',
  };
  const context = buildPartnerContext({
    contractType: 'car_sale', documentTier: 'complete', locale: 'cs',
    rawContractData: pii, paid: true, completed: true,
  });
  assert.ok(context);
  assert.deepEqual(Object.keys(context).sort(), [...PARTNER_CONTEXT_KEYS].sort());
  assert.equal(context.userRole, 'buyer');
  assert.equal(context.valueBand, '250k_500k');
  const serialized = JSON.stringify(context).toLowerCase();
  for (const forbiddenValue of Object.values(pii).filter((value) => value !== 'buyer' && value !== '420 000 Kč')) {
    assert.equal(serialized.includes(forbiddenValue.toLowerCase()), false, `PII leaked: ${forbiddenValue}`);
  }
  for (const key of Object.keys(context)) {
    assert.equal(/name|email|phone|address|birth|rodne|passport|bank|signature|vin/i.test(key), false);
  }
}

function testUrlAndConfigFailClosed() {
  resetPartnerEnv();
  assert.equal(
    getEditorialPartnerOffer('cebia_vehicle_history', 'cs'),
    null,
    'editorial offer must be hidden while the partner engine is off',
  );
  process.env.PARTNER_ENGINE_ENABLED = 'true';
  process.env.PARTNER_CEBIA_ENABLED = 'true';
  process.env.PARTNER_CEBIA_IS_AFFILIATE = 'true';
  const invalid = [
    'javascript:alert(1)',
    'data:text/html,hello',
    'http://www.cebia.cz/',
    'https://cebia.cz.evil.example/',
    'https://www.cebia.cz/#token=secret',
    'https://user:pass@www.cebia.cz/',
    'https://www.cebia.cz/?email=pii@example.test',
    'https://www.cebia.cz/?price=420000',
    'https://www.cebia.cz/?address=Presna-1',
  ];
  for (const url of invalid) {
    process.env.PARTNER_CEBIA_URL = url;
    assert.deepEqual(getEligiblePartnerOffers(baseContext()), [], `unsafe URL accepted: ${url}`);
    assert.equal(
      getEditorialPartnerOffer('cebia_vehicle_history', 'cs'),
      null,
      `unsafe editorial URL accepted: ${url}`,
    );
  }
  process.env.PARTNER_CEBIA_URL = 'https://www.cebia.cz/provereni/';
  delete process.env.PARTNER_CEBIA_IS_AFFILIATE;
  assert.deepEqual(
    getEligiblePartnerOffers(baseContext()),
    [],
    'Cebia must stay hidden until the configuration explicitly marks the approved affiliate URL',
  );
  assert.equal(
    getEditorialPartnerOffer('cebia_vehicle_history', 'cs'),
    null,
    'editorial Cebia must fail closed without the affiliate activation flag',
  );
  process.env.PARTNER_CEBIA_IS_AFFILIATE = 'true';
  const offers = getEligiblePartnerOffers(baseContext());
  assert.equal(offers.length, 1);
  assert.equal(new URL(offers[0].href).hostname, 'www.cebia.cz');
  assert.equal(offers[0].href.includes('420000'), false);
  const editorialOffer = getEditorialPartnerOffer('cebia_vehicle_history', 'cs');
  assert.ok(editorialOffer);
  assert.equal(editorialOffer.provider, 'Cebia AUTOTRACER');
  assert.equal(editorialOffer.cta, 'Prověřit historii vozidla');
  assert.equal(new URL(editorialOffer.href).hostname, 'www.cebia.cz');
  assert.equal(editorialOffer.href.includes('420000'), false);
  assert.equal(getEditorialPartnerOffer('cebia_vehicle_history', 'en'), null);
  resetPartnerEnv();
}

function testRoleCannotCrossVertical() {
  const forged = buildPartnerContext({
    contractType: 'employment', documentTier: 'basic', locale: 'cs',
    rawContractData: { partnerUserRole: 'buyer', salary: '30000' },
    paid: true, completed: true,
  });
  assert.ok(forged);
  assert.equal(forged.userRole, 'unknown', 'role outside contract taxonomy must fail closed');
}

async function testLeadBoundaryAndFailureIsolation() {
  const consent = createPartnerLeadConsent({
    partnerId: 'test_partner',
    purpose: 'Kontakt kvůli konkrétní nabídce',
    fields: ['contact_name', 'email'],
    grantedAt: new Date('2026-08-13T12:00:00.000Z'),
  });
  let delivered: unknown = null;
  const adapter: PartnerLeadAdapter = {
    partnerId: 'test_partner',
    allowedFields: ['contact_name', 'email'],
    timeoutMs: 1_000,
    credentialsConfigured: () => true,
    submit: async (payload) => { delivered = payload; },
  };
  const result = await tryDeliverPartnerLead({
    adapter,
    consent,
    context: baseContext(),
    idempotencyKey: 'partner_test_1234567890',
    contact: {
      contact_name: 'Jan Test',
      email: 'jan@example.test',
      phone: '+420777123456',
    },
  });
  assert.deepEqual(result, { ok: true });
  const contact = (delivered as { contact: Record<string, string> }).contact;
  assert.deepEqual(Object.keys(contact).sort(), ['contact_name', 'email']);

  const unconfigured = await tryDeliverPartnerLead({
    adapter: { ...adapter, credentialsConfigured: () => false },
    consent,
    context: baseContext(),
    idempotencyKey: 'partner_test_1234567890',
    contact: { email: 'jan@example.test' },
  });
  assert.deepEqual(unconfigured, { ok: false, reason: 'not_configured' });

  const failed = await tryDeliverPartnerLead({
    adapter: { ...adapter, submit: async () => { throw new Error('provider unavailable'); } },
    consent,
    context: baseContext(),
    idempotencyKey: 'partner_test_1234567890',
    contact: { email: 'jan@example.test' },
  });
  assert.deepEqual(failed, { ok: false, reason: 'provider_failed' });
}

async function main() {
  testContextAllowlistAndPiiRemoval();
  testUrlAndConfigFailClosed();
  testRoleCannotCrossVertical();
  await testLeadBoundaryAndFailureIsolation();
  console.log('Partner security/privacy tests passed (PII, URL, roles, consent, failure isolation).');
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
