import assert from 'node:assert/strict';
import { memoryRedis } from '@/lib/redis-memory';
import { buildCaseRecord, commitCase, getCase, indexLegacyPendingDocuments, listCaseIdsForEmail, purgeExpiredPendingDocuments, saveCase, toPublicCase } from '@/lib/cases/store';
import { createCaseDocumentCheckout, type CaseCheckoutStripe } from '@/lib/cases/checkout';
import { applyCaseAction, createCaseFromPaidOrder, prepareCaseDocument } from '@/lib/cases/service';
import { stripe } from '@/lib/stripe';
import type { CaseRecord } from '@/lib/cases/types';

async function fixture() {
  memoryRedis.reset();
  const record = await saveCase(buildCaseRecord({ ownerEmail: 'review@example.invalid', ownerRole: 'customer', title: 'Original case', deadline: '2026-12-15', startDate: null, priceAmountCzk: 1000, priceMode: 'after_completion', origin: { source: 'success_page', contractType: 'work_contract', tier: 'basic', packageKey: null } }));
  const result = await prepareCaseDocument(record, 'change_order', { customerName: 'A', contractorName: 'B', number: '1', date: '2026-09-17', subject: 'scope', originalState: 'a', newState: 'b' });
  if (!result.ok) throw new Error(result.message);
  return result;
}

async function testConcurrentCaseCreation() {
  memoryRedis.reset();
  process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_case_reliability';

  const draftId = 'race-draft-20260918';
  const draftKey = `contract:draft:${draftId}`;
  const downloadToken = 'download-token-race';
  await memoryRedis.set(draftKey, {
    contractType: 'work_contract',
    tier: 'basic',
    packageKey: null,
    downloadToken,
    deliveryEmail: 'race@example.cz',
    paid: true,
    payload: {
      partnerUserRole: 'customer',
      workTitle: 'Současně založená zakázka',
      startDate: '2026-09-18',
      endDate: '2026-12-01',
      priceAmount: '100000',
      currency: 'Kč',
      paymentType: 'after_completion',
    },
  }, { ex: 3600 });

  const sessions = stripe.checkout.sessions as unknown as {
    retrieve: (id: string) => Promise<unknown>;
  };
  const originalRetrieve = sessions.retrieve;
  sessions.retrieve = async (id: string) => ({
    id,
    payment_status: 'paid',
    client_reference_id: draftId,
    metadata: { draftId, contractType: 'work_contract', tier: 'basic' },
    customer_details: { email: 'race@example.cz' },
  });

  try {
    const results = await Promise.all(
      Array.from({ length: 20 }, () => createCaseFromPaidOrder({ sessionId: 'cs_test_race_123456789', token: downloadToken })),
    );
    assert.ok(results.every((result) => result.ok), 'all concurrent callers should resolve successfully');
    const successes = results.filter((result) => result.ok);
    assert.equal(new Set(successes.map((result) => result.record.id)).size, 1, 'all concurrent callers must receive the same case');
    assert.equal(successes.filter((result) => result.created).length, 1, 'exactly one concurrent caller creates the case');
    assert.equal((await listCaseIdsForEmail('race@example.cz')).length, 1, 'owner index contains exactly one case');
    assert.equal(memoryRedis.keys('case:create-lock:*').length, 0, 'creation lock is released after success');
  } finally {
    sessions.retrieve = originalRetrieve;
  }
}

export async function testCaseReliability() {
  // Interleave a payment write with getCase's read: data must keep its own revision.
  const { record } = await fixture();
  const originalGet = memoryRedis.get.bind(memoryRedis);
  let intercepted = false;
  memoryRedis.get = (async (key: string) => {
    const value = await originalGet(key);
    if (key === `case:${record.id}` && !intercepted) {
      intercepted = true;
      const old = value as CaseRecord;
      await saveCase({ ...old, documents: old.documents.map(doc => ({ ...doc, status: 'ready' })) });
    }
    return value;
  }) as typeof memoryRedis.get;
  try {
    const updated = await commitCase(record.id, fresh => ({ ...fresh, title: 'New title' }));
    assert.equal(updated?.documents[0].status, 'ready', 'interleaved payment must survive the concurrent title change');
    assert.equal(updated?.title, 'New title');
  } finally { memoryRedis.get = originalGet; }

  for (const failure of ['retrieve', 'expire', 'lost-create-response', 'lost-paid-response'] as const) {
    const { record, document } = await fixture();
    type Session = { id: string; url: string; status: 'open' | 'expired' | 'complete'; payment_status: 'unpaid' | 'paid'; metadata: Record<string, string>; expires_at: number };
    const sessions = new Map<string, Session>();
    const requests = new Map<string, string>();
    let fail = false;
    const client: CaseCheckoutStripe = { checkout: { sessions: {
      create: async (params, options) => {
        const key = options!.idempotencyKey!;
        if (requests.has(key)) assert.equal(JSON.stringify(params), requests.get(key), 'retry params must be byte-for-byte stable');
        requests.set(key, JSON.stringify(params));
        if (!sessions.has(key)) sessions.set(key, { id: `cs_local_${sessions.size}`, url: 'https://example.invalid/pay', status: 'open', payment_status: 'unpaid', metadata: params.metadata as Record<string, string>, expires_at: params.expires_at! });
        if (fail && failure.startsWith('lost-')) throw new Error('Stripe timeout after creation');
        return sessions.get(key)!;
      },
      retrieve: async id => {
        if (fail && failure === 'retrieve') throw new Error('Stripe retrieve timeout');
        return [...sessions.values()].find(session => session.id === id)!;
      },
      expire: async id => {
        if (fail && failure === 'expire') throw new Error('Stripe expire timeout');
        [...sessions.values()].find(session => session.id === id)!.status = 'expired';
      },
    } } };
    if (failure.startsWith('lost-')) {
      fail = true;
      await assert.rejects(createCaseDocumentCheckout(record, document, record.ownerEmail, client));
      await applyCaseAction(record, { type: 'set_title', title: 'Changed between retries' });
      const pending = (await getCase(record.id))!;
      assert.equal(toPublicCase(pending).documents[0].checkoutRequest, null, 'checkout request never reaches the browser');
      fail = false;
      if (failure === 'lost-paid-response') {
        const paidSession = [...sessions.values()][0];
        paidSession.status = 'complete';
        paidSession.payment_status = 'paid';
        paidSession.url = '';
      }
      const recovered = await createCaseDocumentCheckout(record, document, record.ownerEmail, client);
      assert.equal(recovered.status, failure === 'lost-paid-response' ? 'ready' : 'open');
    } else {
      await createCaseDocumentCheckout(record, document, record.ownerEmail, client);
      if (failure === 'expire') [...sessions.values()][0].expires_at = Math.floor(Date.now() / 1000) + 30;
      fail = true;
      await assert.rejects(createCaseDocumentCheckout(record, document, record.ownerEmail, client));
    }
    assert.equal(sessions.size, 1, `${failure} must not create a second payable session`);
  }

  const legacy = await fixture();
  await memoryRedis.zrem('case:documents:pending', `${legacy.record.id}:${legacy.document.id}`);
  const before = (await originalGet<CaseRecord>(`case:${legacy.record.id}`))!;
  before.documents[0].snapshot = undefined;
  await memoryRedis.set(`case:${before.id}`, before, { ex: 365 * 86400 });
  const changed = await applyCaseAction(before, { type: 'set_deadline', deadline: '2027-01-30' });
  assert.equal(changed.ok && changed.record?.documents[0].snapshot?.caseDeadline, '2026-12-15', 'freeze legacy document before changing its source');
  await memoryRedis.zrem('case:documents:pending', `${before.id}:${legacy.document.id}`);
  const originalNow = Date.now;
  Date.now = () => Date.parse(legacy.document.createdAt) + 31 * 86400000;
  try {
    const indexed = await indexLegacyPendingDocuments();
    assert.equal(indexed.scanned, 1);
    const ttl = await memoryRedis.ttl(`case:${before.id}`);
    const result = await purgeExpiredPendingDocuments(Date.now());
    assert.equal(result.purged, 1, 'legacy pending document must be physically purged');
    const raw = (await originalGet<CaseRecord>(`case:${before.id}`))!;
    assert.equal(raw.documents.length, 0);
    assert.equal(raw.expiresAt, changed.ok && changed.record?.expiresAt, 'cleanup must not alter advertised expiry');
    assert.ok(await memoryRedis.ttl(`case:${before.id}`) <= ttl);
    assert.ok(await memoryRedis.ttl(`case:rev:${before.id}`) <= ttl, 'revision and record expire together');
  } finally { Date.now = originalNow; }
  await testConcurrentCaseCreation();
  console.log('Case reliability regressions passed: interleaved payment, Stripe failures, lost response recovery, legacy snapshot/purge and concurrent case creation.');
}
