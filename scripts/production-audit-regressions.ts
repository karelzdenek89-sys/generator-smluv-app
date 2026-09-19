import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { memoryRedis as db } from '@/lib/redis-memory';
import { stripe } from '@/lib/stripe';
import { buildCaseRecord, saveCase, getCase, listCaseIdsForEmail, listDueReminders, listCasesForEmail, hashOwnerEmail, createOrderCase } from '@/lib/cases/store';
import { applyCaseAction, createCaseFromPaidOrder, sendCaseLinksForEmail } from '@/lib/cases/service';
import { hashCaseAccessToken, issueCaseAccessToken, resolveCaseAccess } from '@/lib/cases/access';
import { issueCaseHubAccessToken, resolveCaseHubAccess, buildCaseHubPayload } from '@/lib/cases/hub-access';
import { POST as hubResolve } from '@/app/api/cases/hub/resolve/route';
import { processLegislationWatches, type LegislationWatch } from '@/lib/legal/watch';
import { LEGAL_CHANGES } from '@/lib/legal/radar';
import { renderSimpleDocumentPdf } from '@/lib/pdf';
import { CASE_DOCUMENT_DEFINITIONS, CASE_DOCUMENT_SIGNATURE_TITLE, validateCaseDocumentData } from '@/lib/cases/documents';

const email = 'audit@example.invalid';
const input = { ownerEmail: email, ownerRole: 'customer' as const, title: 'Audit <script> & test', startDate: null, deadline: '2099-09-30', priceAmountCzk: 100, priceMode: 'unknown' as const, origin: { source: 'success_page' as const, contractType: 'work_contract' as const, tier: 'basic' as const, packageKey: null } };

async function accessAndReminders() {
  db.reset();
  const record = await saveCase(buildCaseRecord(input));
  const other = await saveCase(buildCaseRecord({ ...input, ownerEmail: 'other@example.invalid' }));
  const otherToken = await issueCaseAccessToken(other.id, other.ownerEmail);
  const hubToken = await issueCaseHubAccessToken(email);
  const priorAccess = await resolveCaseHubAccess(hubToken);
  assert.ok(priorAccess);
  const caseToken = await issueCaseAccessToken(record.id, email);
  const legacyToken = 'a'.repeat(64);
  await db.set(`case:access:${hashCaseAccessToken(legacyToken)}`, { caseId: record.id, email, issuedAt: new Date().toISOString() }, { ex: 3600 });
  assert.ok(await resolveCaseAccess(record.id, legacyToken), 'existing links survive deployment');
  await applyCaseAction(record, { type: 'revoke_links' });
  assert.equal(await resolveCaseAccess(record.id, legacyToken), null);
  assert.equal(await resolveCaseAccess(record.id, caseToken), null);
  assert.equal(await resolveCaseHubAccess(hubToken), null);
  // A hub request authenticated before revocation may finish afterwards. Its
  // minted credentials must stay bound to the revoked generation.
  const stalePayload = await buildCaseHubPayload(email, 0, 50, priorAccess.generation!);
  assert.equal(await resolveCaseAccess(record.id, stalePayload.cases[0].token), null);
  assert.ok(await resolveCaseAccess(other.id, otherToken), 'another owner is unaffected');
  const freshAccess = await resolveCaseHubAccess(await issueCaseHubAccessToken(email));
  assert.ok(freshAccess);
  const recovered = await buildCaseHubPayload(email, 0, 50, freshAccess.generation!);
  assert.ok(await resolveCaseAccess(record.id, recovered.cases[0].token), 'fresh recovery works');
  const enabled = await applyCaseAction((await getCase(record.id))!, { type: 'set_reminders', enabled: true });
  assert.ok(enabled.ok && enabled.record);
  assert.ok((await listDueReminders(Date.parse('2099-10-01'))).length);
  const closed = await applyCaseAction(enabled.record, { type: 'set_stage', stage: 'closed' });
  assert.ok(closed.ok && closed.record && !closed.record.remindersEnabled);
  assert.equal((await listDueReminders(Date.parse('2099-10-01'))).length, 0);
  assert.equal((await applyCaseAction(closed.record, { type: 'set_reminders', enabled: true })).ok, false);
  console.log('PASS: legacy access, owner revocation, stale in-flight hub request, recovery, closed reminders');
}

async function orderConcurrency() {
  db.reset();
  const draft = { contractType: 'work_contract', downloadToken: 'audit-token', paid: true, deliveryEmail: email, payload: { extra: [], nested: { empty: [] } }, deliveryState: 'sent' };
  await db.set('contract:draft:audit', draft, { ex: 3600 });
  const retrieve = stripe.checkout.sessions.retrieve;
  stripe.checkout.sessions.retrieve = (async () => ({ id: 'cs_test_audit', payment_status: 'paid', metadata: { draftId: 'audit', contractType: 'work_contract' } })) as never;
  try {
    const results = await Promise.all(Array.from({ length: 20 }, () => createCaseFromPaidOrder({ sessionId: 'cs_test_audit', token: 'audit-token' })));
    assert.ok(results.every(result => result.ok));
    assert.equal(results.filter(result => result.ok && result.created).length, 1);
    assert.equal((await listCaseIdsForEmail(email)).length, 1);
    assert.equal(new Set(results.map(result => result.ok ? result.record.id : '')).size, 1);
    assert.deepEqual(await db.get('contract:draft:audit'), draft, 'fulfillment fields and empty arrays remain byte-for-byte intact');
    assert.ok((await db.ttl('contract:draft:audit')) <= 3600);
    const retry = await createCaseFromPaidOrder({ sessionId: 'cs_test_audit', token: 'audit-token' });
    assert.ok(retry.ok && !retry.created, 'retry reuses durable mapping');
    const denied = await createOrderCase('audit', 'wrong', buildCaseRecord(input));
    assert.deepEqual(denied, { ok: false, reason: 'forbidden' });
    await db.del('contract:draft:audit');
    assert.deepEqual(await createOrderCase('audit', 'audit-token', buildCaseRecord(input)), { ok: false, reason: 'not_found' });
    // Existing production drafts with caseId remain supported.
    const old = await saveCase(buildCaseRecord(input));
    await db.set('contract:draft:legacy', { ...draft, caseId: old.id });
    const legacy = await createOrderCase('legacy', 'audit-token', buildCaseRecord(input));
    assert.ok(legacy.ok && !legacy.created && legacy.record.id === old.id);
  } finally { stripe.checkout.sessions.retrieve = retrieve; }
  console.log('PASS: 20 simultaneous order requests, durable retry, legacy order, wrong/expired draft');
}

async function hubPagination() {
  db.reset();
  const key = `case:owner:${hashOwnerEmail(email)}`;
  for (let i = 0; i < 55; i++) await db.sadd(key, randomUUID());
  for (let i = 0; i < 53; i++) await saveCase(buildCaseRecord({ ...input, title: `Case ${i}` }), new Date(Date.now() + i * 1000));
  const foreign = await saveCase(buildCaseRecord({ ...input, ownerEmail: 'other@example.invalid' }));
  await db.sadd(key, foreign.id);
  const first = await listCasesForEmail(email);
  assert.equal(first.length, 50);
  assert.equal(first[0].title, 'Case 52', 'sort all live cases before limiting');
  assert.equal((await db.smembers(key)).length, 53, 'stale and foreign index entries pruned');
  const token = await issueCaseHubAccessToken(email);
  const request = (offset: number) => new Request('https://www.smlouvahned.cz/api/cases/hub/resolve', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://www.smlouvahned.cz', host: 'www.smlouvahned.cz', 'x-forwarded-for': '203.0.113.24' }, body: JSON.stringify({ token, offset }) });
  const response1 = await hubResolve(request(0));
  assert.equal(response1.status, 200);
  assert.match(response1.headers.get('cache-control')!, /no-store/);
  const page1 = await response1.json();
  assert.equal(page1.cases.length, 50); assert.equal(page1.nextOffset, 50);
  const page2 = await (await hubResolve(request(50))).json();
  assert.equal(page2.cases.length, 3); assert.equal(page2.nextOffset, null);
  assert.equal(new Set([...page1.cases, ...page2.cases].map(item => item.id)).size, 53);
  console.log('PASS: stale owner index, foreign owner isolation, sorting, API pagination');
}

async function watches() {
  db.reset();
  const change = LEGAL_CHANGES[0];
  for (let i = 0; i < 501; i++) {
    const id = `audit-${String(i).padStart(4, '0')}`;
    await db.sadd('legal:watch:index', id);
    await db.set(`legal:watch:${id}`, { id, email, emailHash: 'audit', changeKey: change.key, status: 'active', statusSnapshot: i === 500 ? 'proposal' : change.status, effectiveFromSnapshot: change.effectiveFrom, createdAt: new Date().toISOString(), confirmedAt: new Date().toISOString(), lastNotifiedAt: null } satisfies LegislationWatch);
  }
  let sends = 0;
  globalThis.fetch = async () => { sends++; return new Response('{}', { status: 503 }); };
  const run1 = await processLegislationWatches();
  assert.equal(run1.checked, 500); assert.equal(run1.changed, 0);
  const run2 = await processLegislationWatches();
  assert.equal(run2.checked, 1); assert.equal(run2.failed, 1);
  globalThis.fetch = async () => { sends++; return new Response('{"id":"fake-only"}', { status: 200 }); };
  await processLegislationWatches();
  assert.equal((await processLegislationWatches()).sent, 1, 'provider failure retries on next cycle');
  await processLegislationWatches(); await processLegislationWatches();
  assert.equal(sends, 2, 'unchanged subscriptions do not send repeatedly');
  console.log('PASS: subscription 501 processed, failed delivery retried, successful delivery deduplicated');
}

async function documentsAndEmail() {
  const ending = 'KONEC_DULEZITEHO_UJEDNANI';
  const longText = ('Žluťoučký kůň: převzaté práce, závady a výhrady.\n'.repeat(100)).slice(0, 4000 - ending.length) + ending;
  assert.equal(longText.length, 4000);
  const data = { customerName: 'Audit Objednatel', contractorName: 'Audit Zhotovitel', handoverDate: '2026-09-18', handoverPlace: 'Test', scopeDelivered: longText, acceptanceResult: 'accepted' };
  assert.ok(validateCaseDocumentData('handover_protocol', data).ok);
  const definition = CASE_DOCUMENT_DEFINITIONS.handover_protocol;
  const record = buildCaseRecord(input);
  const sections = [...definition.buildSections(record, data), { title: 'Další řádky', body: Array.from({ length: 95 }, (_, i) => `RADKA_${String(i).padStart(3, '0')}`) }];
  const pdf = await renderSimpleDocumentPdf({ title: definition.title, sections, signatureSectionTitle: CASE_DOCUMENT_SIGNATURE_TITLE, signatureLabels: definition.signatureLabels, docId: 'REGRESSION-ONLY' });
  const bodyText: string[] = [];
  const parsed = await pdfParse(pdf, { pagerender: async (page: { getTextContent: () => Promise<{ items: { str: string; transform: number[] }[] }> }) => {
    const content = await page.getTextContent();
    for (const item of content.items) {
      if (item.transform[5] >= 90 && item.transform[5] <= 785) bodyText.push(item.str);
      if (item.str.includes('Žluťoučký') || item.str.includes(ending) || item.str.startsWith('RADKA_')) {
        assert.ok(item.transform[5] >= 90 && item.transform[5] <= 785, 'body baselines stay outside header/footer margins');
      }
    }
    return content.items.map(item => item.str).join(' ');
  } });
  const normalized = (text: string) => text.replace(/\s/g, '');
  assert.ok(normalized(bodyText.join(' ')).includes(normalized(longText)), 'entire accepted field survives PDF output in order');
  assert.ok(parsed.numpages >= 4);
  for (let i = 0; i < 95; i++) assert.ok(parsed.text.includes(`RADKA_${String(i).padStart(3, '0')}`));
  db.reset();
  await saveCase(record);
  await saveCase(buildCaseRecord({ ...input, title: 'Druhý případ' }));
  let html = '';
  globalThis.fetch = async (_url, init) => { html = JSON.parse(String(init?.body)).html; return new Response('{"id":"fake-only"}', { status: 200 }); };
  assert.ok((await sendCaseLinksForEmail(email)).emailSent);
  assert.ok(!html.includes('&lt;a href='));
  assert.equal((html.match(/<strong style=/g) ?? []).length, 2);
  assert.ok(html.includes('Audit &lt;script&gt; &amp; test') && !html.includes('<script>'));
  console.log('PASS: full 4000-character Czech PDF field, multi-page margins, 95 body lines, clickable escaped email links');
}

async function paymentFulfilmentRetry() {
  db.reset();
  const { POST } = await import('@/app/api/stripe/webhook/route');
  const secret = 'whsec_local_funnel_regression';
  process.env.STRIPE_WEBHOOK_SECRET = secret;
  await db.set('contract:draft:funnel', {
    contractType: 'lease', tier: 'basic', paid: false, deliveryEmail: email,
    downloadToken: 'local-download-token', payload: {}, analyticsConsentGranted: false,
  }, { ex: 604800 });
  const event = {
    id: 'evt_local_funnel', type: 'checkout.session.completed',
    data: { object: { id: 'cs_test_funnel', payment_status: 'unpaid', amount_total: 9900, currency: 'czk', metadata: { draftId: 'funnel', contractType: 'lease', tier: 'basic' } } },
  };
  const request = () => {
    const payload = JSON.stringify(event);
    return new Request('https://www.smlouvahned.cz/api/stripe/webhook', { method: 'POST', body: payload, headers: { 'stripe-signature': stripe.webhooks.generateTestHeaderString({ payload, secret }) } });
  };
  let sends = 0;
  let acceptedBody = '';
  globalThis.fetch = async (url, init) => {
    assert.equal(String(url), 'https://api.resend.com/emails');
    assert.equal(new Headers(init?.headers).get('Idempotency-Key'), 'checkout-fulfilled-cs_test_funnel');
    sends++;
    if (sends === 1) {
      acceptedBody = String(init?.body);
      throw new Error('Simulated lost provider response after delivery');
    }
    assert.equal(String(init?.body), acceptedBody, 'fulfilment retry must send the identical email, including access links');
    return Response.json({ id: 'local-delivery' });
  };
  assert.equal((await POST(request())).status, 200);
  assert.equal((await db.get<{ paid: boolean }>('contract:draft:funnel'))?.paid, false, 'unpaid checkout never unlocks content');
  assert.equal(sends, 0);
  event.data.object.payment_status = 'paid';
  assert.equal((await POST(request())).status, 500, 'lost response asks Stripe to retry');
  assert.equal(await db.get('webhook:fulfilled:cs_test_funnel'), null);
  assert.equal((await POST(request())).status, 200, 'retry completes delivery');
  assert.equal((await db.get<{ paid: boolean }>('contract:draft:funnel'))?.paid, true);
  assert.equal(await db.get('session:draft:cs_test_funnel'), 'funnel');
  assert.ok((await db.smembers(`orders:email:${email}`)).includes('cs_test_funnel'));
  assert.equal((await POST(request())).status, 200, 'duplicate webhook is harmless');
  assert.equal(sends, 2, 'completed delivery is not resent');
  console.log('PASS: signed unpaid/paid webhook, lost email response, identical retry payload, order index and deduplication');
}

async function main() {
  process.env.SMLOUVAHNED_FAKE_REDIS = '1';
  process.env.STRIPE_SECRET_KEY = 'sk_test_local_placeholder';
  process.env.CRON_SECRET = 'local-regression-placeholder-secret';
  process.env.NEXT_PUBLIC_BASE_URL = 'https://www.smlouvahned.cz';
  delete process.env.RESEND_API_KEY;
  globalThis.fetch = async () => { throw new Error('Regression tests block all external network'); };
  await accessAndReminders(); await orderConcurrency(); await hubPagination();
  process.env.RESEND_API_KEY = 'local-placeholder';
  await watches(); await documentsAndEmail(); await paymentFulfilmentRetry();
  console.log('Production audit regressions passed. No real payments, emails, or customer data used.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
