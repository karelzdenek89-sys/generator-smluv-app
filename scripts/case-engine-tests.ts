process.env.SMLOUVAHNED_FAKE_REDIS = '1';
process.env.NEXT_PUBLIC_BASE_URL = 'https://www.smlouvahned.cz';

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { testCaseReliability } from './case-reliability-tests';
import { memoryRedis } from '@/lib/redis-memory';
import {
  hashCaseAccessToken,
  isCaseAccessTokenFormat,
  issueCaseAccessToken,
  resolveCaseAccess,
  revokeCaseAccessTokens,
} from '@/lib/cases/access';
import {
  issueCaseHubAccessToken,
  resolveCaseHubAccess,
  revokeCaseHubAccessTokens,
} from '@/lib/cases/hub-access';
import { renderEmailShell } from '@/lib/email/transactional';
import { buildCaseUrl, reminderCopy } from '@/lib/cases/emails';
import {
  CASE_DOCUMENT_DEFINITIONS,
  CASE_DOCUMENT_LIST,
  CASE_DOCUMENT_SIGNATURE_TITLE,
  CASE_DOCUMENT_TEMPLATE_VERSION,
  isCaseDocumentIncluded,
  resolveCaseDocumentRender,
  sharedFieldDefaults,
  validateCaseDocumentData,
} from '@/lib/cases/documents';
import { createCaseDocumentCheckout, isCaseDocumentConsentValid, type CaseCheckoutStripe } from '@/lib/cases/checkout';
import { applyCaseAction, markCaseDocumentPaid, parseAmountCzk, parseCaseAction, prepareCaseDocument } from '@/lib/cases/service';
import {
  buildCaseRecord,
  CASE_RETENTION_DAYS,
  CASE_RETENTION_DAYS_CLOSED,
  CaseConflictError,
  caseTtlSeconds,
  commitCase,
  deleteCase,
  getCase,
  hashOwnerEmail,
  listCaseIdsForEmail,
  listCasesForEmail,
  listDueReminders,
  maskEmail,
  PENDING_DOCUMENT_RETENTION_DAYS,
  purgeExpiredPendingDocuments,
  saveCase,
  toPublicCase,
  touchCaseAccess,
} from '@/lib/cases/store';
import { CASE_DOCUMENT_KINDS, WORK_ORDER_STAGES, type CaseDocument, type CaseRecord } from '@/lib/cases/types';
import {
  WORK_ORDER_STAGE_DEFINITIONS,
  buildDefaultTasks,
  daysUntil,
  formatCzechDate,
  getOpenTasksForStage,
  parseIsoDate,
  planReminders,
} from '@/lib/cases/workflow';
import {
  CHECKOUT_CONSENT_TEXT_VERSION,
  CHECKOUT_PRIVACY_VERSION,
  CHECKOUT_TERMS_VERSION,
} from '@/lib/checkout-authorization';
import { renderSimpleDocumentPdf } from '@/lib/pdf';

let checks = 0;
function ok(condition: unknown, message: string) {
  checks += 1;
  assert.ok(condition, message);
}
function eq<T>(actual: T, expected: T, message: string) {
  checks += 1;
  assert.deepEqual(actual, expected, message);
}

function sampleCase(overrides: Partial<Parameters<typeof buildCaseRecord>[0]> = {}) {
  return buildCaseRecord({
    ownerEmail: 'Jan.Novak@Example.cz',
    ownerRole: 'contractor',
    title: 'Rekonstrukce koupelny',
    startDate: '2026-10-01',
    deadline: '2026-12-15',
    priceAmountCzk: 185000,
    priceMode: 'milestones',
    origin: { source: 'success_page', contractType: 'work_contract', tier: 'basic', packageKey: null },
    ...overrides,
  });
}

async function testWorkflow() {
  eq(parseIsoDate('2026-02-29'), null, 'invalid calendar date is rejected');
  ok(parseIsoDate('2026-02-28') instanceof Date, 'valid ISO date parses');
  eq(parseIsoDate('28.2.2026'), null, 'non-ISO format rejected');
  eq(formatCzechDate('2026-12-15'), '15. 12. 2026', 'Czech date formatting');
  eq(daysUntil('2026-12-15', new Date('2026-12-01T10:00:00Z')), 14, 'days until deadline');
  eq(daysUntil(null), null, 'no deadline → null');

  const plan = planReminders('2026-12-15', new Date('2026-11-10T00:00:00Z'));
  eq(plan.map((entry) => entry.offsetDays), [30, 14, 7, 1], 'all reminders planned ahead of time');
  eq(plan[0].dueAt.toISOString(), '2026-11-15T06:00:00.000Z', '30-day reminder at 06:00 UTC');
  const partial = planReminders('2026-12-15', new Date('2026-12-05T00:00:00Z'));
  eq(partial.map((entry) => entry.offsetDays), [7, 1], 'past reminders are skipped');
  eq(planReminders('2026-12-15', new Date('2026-12-20T00:00:00Z')), [], 'deadline in the past → no reminders');

  eq([...WORK_ORDER_STAGES], ['contract_signed', 'in_progress', 'changes', 'handover', 'defects', 'closed'], 'stage order');
  for (const stage of WORK_ORDER_STAGES) {
    const def = WORK_ORDER_STAGE_DEFINITIONS[stage];
    ok(def.nextSteps.length >= 2, `${stage}: next steps defined`);
    ok(def.description.length > 40, `${stage}: description`);
    for (const kind of def.documents) ok((CASE_DOCUMENT_KINDS as readonly string[]).includes(kind), `${stage}: document ${kind} exists`);
  }
  ok(WORK_ORDER_STAGE_DEFINITIONS.defects.escalation, 'defects stage names individual assessment');

  const tasks = buildDefaultTasks();
  eq(new Set(tasks.map((task) => task.key)).size, tasks.length, 'task keys unique');
  const open = getOpenTasksForStage({ tasks, stage: 'contract_signed' });
  ok(open.every((task) => ['contract_signed', 'in_progress'].includes(task.stage)), 'open tasks limited to current + next stage');
}

async function testStoreAndAccess() {
  memoryRedis.reset();
  const record = await saveCase(sampleCase());
  eq(record.ownerEmail, 'jan.novak@example.cz', 'owner e-mail normalised');
  eq(record.stage, 'contract_signed', 'initial stage');
  eq(record.tasks.find((task) => task.key === 'deadline_set')?.done, true, 'deadline task auto-completed');
  ok(record.events.some((event) => event.type === 'deadline_set'), 'deadline event recorded');

  const stored = await getCase(record.id);
  ok(stored, 'case persisted');
  eq(await listCaseIdsForEmail('JAN.NOVAK@example.cz'), [record.id], 'owner index (hashed e-mail, case-insensitive)');
  eq(await memoryRedis.ttl(`case:${record.id}`) > 364 * 86400, true, 'case TTL ≈ 365 days');
  ok(!memoryRedis.keys('*').some((key) => key.includes('jan.novak@example.cz')), 'plaintext e-mail never appears in a key');

  const token = await issueCaseAccessToken(record.id, record.ownerEmail);
  ok(isCaseAccessTokenFormat(token), 'token is 64 hex chars');
  ok(!memoryRedis.keys('*').some((key) => key.includes(token)), 'plaintext token never stored');
  ok(memoryRedis.keys(`case:access:${hashCaseAccessToken(token)}`).length === 1, 'hashed token stored');
  ok(await resolveCaseAccess(record.id, token), 'token resolves for its case');
  eq(await resolveCaseAccess('00000000-0000-4000-8000-000000000000', token), null, 'token does not resolve for another case (IDOR)');
  eq(await resolveCaseAccess(record.id, 'not-a-token'), null, 'malformed token rejected');
  eq(await resolveCaseAccess(record.id, token.replace(/./g, 'a')), null, 'unknown token rejected');

  const url = buildCaseUrl(record.id, token);
  ok(url.startsWith('https://www.smlouvahned.cz/moje-zakazka?id='), 'case URL uses canonical origin');
  ok(url.includes(`#access=${token}`), 'token is in the fragment');
  ok(!new URL(url).search.includes(token), 'token never in query string');

  const second = await issueCaseAccessToken(record.id, record.ownerEmail);
  eq(await revokeCaseAccessTokens(record.id), 2, 'revocation removes every token');
  eq(await resolveCaseAccess(record.id, token), null, 'revoked token no longer resolves');
  eq(await resolveCaseAccess(record.id, second), null, 'second revoked token no longer resolves');

  const hubToken = await issueCaseHubAccessToken(record.ownerEmail);
  ok(await resolveCaseHubAccess(hubToken), 'hub token resolves before revocation');
  eq(await revokeCaseHubAccessTokens(record.ownerEmail), 1, 'hub revocation removes indexed owner token');
  eq(await resolveCaseHubAccess(hubToken), null, 'revoked hub token no longer resolves');

  // Backward compatibility: a hub link issued before the reverse index / epoch
  // existed is valid until the owner revokes links, then becomes invalid without
  // a global keyspace scan.
  const legacyEmail = 'legacy-hub@example.cz';
  const legacyHubToken = 'ab'.repeat(32);
  const legacyHubHash = createHash('sha256').update(legacyHubToken).digest('hex');
  await memoryRedis.set(`case:hub-access:${legacyHubHash}`, { email: legacyEmail, issuedAt: new Date().toISOString() }, { ex: 3600 });
  ok(await resolveCaseHubAccess(legacyHubToken), 'legacy hub token resolves before owner revocation');
  eq(await revokeCaseHubAccessTokens(legacyEmail), 0, 'legacy unindexed token needs no physical scan/delete');
  eq(await resolveCaseHubAccess(legacyHubToken), null, 'owner epoch invalidates legacy hub token after revocation');
  ok(await memoryRedis.get(`case:hub-access:${legacyHubHash}`), 'legacy token may remain physically stored but is cryptographically unusable via epoch mismatch');

  const pub = toPublicCase(record);
  ok(!('ownerEmail' in pub), 'public projection hides e-mail');
  ok(!('orderSessionId' in pub.origin), 'public projection has no Stripe session');
  const legacy = toPublicCase({ ...record, origin: { ...record.origin, orderSessionId: 'cs_legacy' } as CaseRecord['origin'] });
  ok(!('orderSessionId' in legacy.origin), 'legacy Stripe session never reaches the client');
  eq(pub.ownerEmailMasked, maskEmail('jan.novak@example.cz'), 'masked e-mail exposed');
  ok(!pub.ownerEmailMasked.includes('jan.novak'), 'mask hides local part');

  // Resolve the whole owner index before applying the page limit. Stale IDs
  // must be cleaned and must never hide a valid case that was added later.
  memoryRedis.reset();
  const staleEmail = 'stale-index@example.cz';
  const staleIds = Array.from({ length: 55 }, (_, index) =>
    `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
  );
  await memoryRedis.sadd(`case:owner:${hashOwnerEmail(staleEmail)}`, ...staleIds);
  const validAfterStale = await saveCase(sampleCase({ ownerEmail: staleEmail, title: 'Platný případ za starými ID' }));
  const visible = await listCasesForEmail(staleEmail, 1);
  eq(visible.map((item) => item.id), [validAfterStale.id], 'stale owner IDs cannot hide a valid case');
  eq((await listCaseIdsForEmail(staleEmail)).length, 1, 'stale owner IDs are removed while listing');
}

async function testActions() {
  memoryRedis.reset();
  let record = await saveCase(sampleCase());

  eq(parseCaseAction({ type: 'set_stage', stage: 'handover' }), { type: 'set_stage', stage: 'handover' }, 'action parsing');
  eq(parseCaseAction({ type: 'toggle_task', taskKey: 'x' }), null, 'missing done flag rejected');
  eq(parseCaseAction({ type: 'unknown' }), null, 'unknown action rejected');

  const invalidStage = await applyCaseAction(record, { type: 'set_stage', stage: 'nonsense' });
  eq(invalidStage.ok, false, 'invalid stage rejected');

  const staged = await applyCaseAction(record, { type: 'set_stage', stage: 'handover' });
  ok(staged.ok && staged.record?.stage === 'handover', 'stage changes');
  record = (staged as { record: typeof record }).record;

  const remindersWithoutDeadline = await applyCaseAction({ ...record, deadline: null }, { type: 'set_reminders', enabled: true });
  eq(remindersWithoutDeadline.ok, false, 'reminders need a deadline');

  const enabled = await applyCaseAction(record, { type: 'set_reminders', enabled: true });
  ok(enabled.ok && enabled.record?.remindersEnabled, 'reminders enabled');
  record = (enabled as { record: typeof record }).record;
  const scheduled = record.reminders.filter((reminder) => reminder.status === 'scheduled');
  ok(scheduled.length >= 1, 'reminders scheduled');
  eq(await memoryRedis.zcard('case:reminders:due'), scheduled.length, 'reminder index contains every scheduled reminder');

  const due = await listDueReminders(Date.parse('2099-01-01T00:00:00Z'));
  eq(due.length, scheduled.length, 'due listing returns scheduled reminders');
  eq(due[0].caseId, record.id, 'due entry references the case');

  const moved = await applyCaseAction(record, { type: 'set_deadline', deadline: '2027-03-01' });
  ok(moved.ok, 'deadline moved');
  record = (moved as { record: typeof record }).record;
  eq(record.reminders.filter((reminder) => reminder.status === 'scheduled').length, 4, 'reminders rescheduled to the new deadline');
  ok(record.reminders.every((reminder) => reminder.status !== 'scheduled' || reminder.dueAt < '2027-03-01'), 'all reminders precede the deadline');
  eq(await memoryRedis.zcard('case:reminders:due'), 4, 'old index entries replaced');

  const badDeadline = await applyCaseAction(record, { type: 'set_deadline', deadline: '31.12.2027' });
  eq(badDeadline.ok, false, 'non-ISO deadline rejected');

  const disabled = await applyCaseAction(record, { type: 'set_reminders', enabled: false });
  record = (disabled as { record: typeof record }).record;
  eq(await memoryRedis.zcard('case:reminders:due'), 0, 'disabling reminders empties the index');

  const note = await applyCaseAction(record, { type: 'add_note', note: '  Domluvena přejímka 5. 3.  ' });
  ok(note.ok && (note as { record: typeof record }).record.events.at(-1)?.label === 'Domluvena přejímka 5. 3.', 'note trimmed and stored');
  record = (note as { record: typeof record }).record;

  const task = await applyCaseAction(record, { type: 'toggle_task', taskKey: 'handover_protocol', done: true });
  ok(task.ok && (task as { record: typeof record }).record.tasks.find((item) => item.key === 'handover_protocol')?.done, 'task toggled');
  record = (task as { record: typeof record }).record;

  const reminderText = reminderCopy(record, { offsetDays: 7 });
  ok(reminderText.action.includes('předávací protokol'), 'reminder copy names the concrete next step');
  ok(reminderText.subject.includes('Rekonstrukce koupelny'), 'reminder subject names the case');

  await issueCaseAccessToken(record.id, record.ownerEmail);
  const deleted = await applyCaseAction(record, { type: 'delete' });
  ok(deleted.ok && deleted.record === null, 'delete returns no record');
  eq(await getCase(record.id), null, 'case removed');
  eq(await listCaseIdsForEmail(record.ownerEmail), [], 'owner index cleaned');
  eq(memoryRedis.keys('case:access:*').length, 0, 'tokens revoked on delete');
}

async function testDocuments() {
  memoryRedis.reset();
  eq(CASE_DOCUMENT_LIST.length, 5, 'five follow-up documents');
  for (const def of CASE_DOCUMENT_LIST) {
    ok(def.legalBasis.includes('§'), `${def.kind}: cites the statute`);
    ok(def.fields.some((field) => field.required), `${def.kind}: has required fields`);
    ok(def.fields.filter((field) => field.shared).length === 2, `${def.kind}: party fields shared`);
    const invalid = validateCaseDocumentData(def.kind, {});
    eq(invalid.ok, false, `${def.kind}: empty input rejected`);
  }

  const bad = validateCaseDocumentData('handover_protocol', {
    customerName: 'A', contractorName: 'B', handoverDate: '2026-13-40', handoverPlace: 'Praha', scopeDelivered: 'x', acceptanceResult: 'accepted',
  });
  ok(!bad.ok && bad.field === 'handoverDate', 'invalid date flagged on the right field');
  const badSelect = validateCaseDocumentData('handover_protocol', {
    customerName: 'A', contractorName: 'B', handoverDate: '2026-12-15', handoverPlace: 'Praha', scopeDelivered: 'x', acceptanceResult: 'hacked',
  });
  ok(!badSelect.ok && badSelect.field === 'acceptanceResult', 'unknown select value rejected');
  const stripped = validateCaseDocumentData('change_order', {
    customerName: 'Obec', contractorName: 'Firma', number: '1', date: '2026-11-01', subject: 'scope', originalState: 'a', newState: 'b', __proto__: { x: 1 }, extra: 'ignored',
  });
  ok(stripped.ok && !('extra' in stripped.data), 'unknown keys are dropped');

  // Zakázka bez balíčku: dokument čeká na platbu.
  const basic = await saveCase(sampleCase());
  eq(isCaseDocumentIncluded(basic), false, 'basic case pays per document');
  const prepared = await prepareCaseDocument(basic, 'handover_protocol', {
    customerName: 'Jan Novák', contractorName: 'Petr Dvořák', handoverDate: '2026-12-15', handoverPlace: 'Praha 6', scopeDelivered: 'Kompletní koupelna', acceptanceResult: 'accepted_with_reservations', defectsList: 'Prasklá dlaždice', defectsDeadline: '2026-12-31',
  });
  ok(prepared.ok && prepared.requiresPayment && prepared.document.status === 'pending_payment', 'basic case document pending payment');
  const preparedRecord = (prepared as { record: typeof basic; document: { id: string } }).record;
  eq(sharedFieldDefaults(preparedRecord), { customerName: 'Jan Novák', contractorName: 'Petr Dvořák' }, 'party names shared for next document');

  const paid = await markCaseDocumentPaid(basic.id, (prepared as { document: { id: string } }).document.id, 'cs_test_doc');
  ok(paid && paid.documents[0].status === 'ready' && paid.documents[0].stripeSessionId === 'cs_test_doc', 'document marked paid');
  const again = await markCaseDocumentPaid(basic.id, paid!.documents[0].id, 'cs_test_doc');
  eq(again?.events.filter((event) => event.type === 'document_paid').length, 1, 'marking paid is idempotent');

  // Zakázka z balíčku: dokument je ihned připraven.
  const bundle = await saveCase(sampleCase({ origin: { source: 'success_page', contractType: 'work_contract', tier: 'complete', packageKey: 'work_order' } }));
  eq(isCaseDocumentIncluded(bundle), true, 'bundle case includes documents');
  const included = await prepareCaseDocument(bundle, 'defect_notice', {
    customerName: 'Jan Novák', contractorName: 'Petr Dvořák', date: '2026-12-20', discoveredOn: '2026-12-18', defects: 'Netěsnící sifon\nOdlepený obklad', remedy: 'repair', deadlineDays: '14', delivery: 'email',
  });
  ok(included.ok && !included.requiresPayment && included.document.status === 'ready', 'bundle document ready immediately');

  // Sekce a PDF
  const def = CASE_DOCUMENT_DEFINITIONS.defect_notice;
  const sections = def.buildSections(bundle, (included as { document: { data: Record<string, string> } }).document.data);
  ok(sections.some((section) => section.title === CASE_DOCUMENT_SIGNATURE_TITLE), 'signature section present');
  const text = sections.flatMap((section) => section.body).join('\n');
  ok(text.includes('Netěsnící sifon') && text.includes('14 dnů'), 'user data rendered into the notice');
  ok(text.includes('§ 2618'), 'defect notice cites § 2618 OZ');
  ok(!text.includes('undefined'), 'no undefined in rendered text');

  const pdf = await renderSimpleDocumentPdf({
    title: def.title,
    subtitleLines: ['Zakázka: Rekonstrukce koupelny'],
    sections,
    signatureSectionTitle: CASE_DOCUMENT_SIGNATURE_TITLE,
    signatureLabels: def.signatureLabels,
    docId: 'SH-Z-TEST',
  });
  ok(pdf.length > 5000 && pdf.subarray(0, 4).toString() === '%PDF', 'case document renders as PDF');

  const emailHtml = renderEmailShell({
    heading: 'Vaše případy',
    intro: 'Vyberte uložený případ.',
    linkItems: [
      { label: 'Zakázka <test>', url: 'https://www.smlouvahned.cz/moje-zakazka?id=1#access=abc', detail: 'V realizaci' },
      { label: 'Pronájem', url: 'https://www.smlouvahned.cz/moje-pripady/pripad?id=2#access=def', detail: 'Předání' },
    ],
    ctaLabel: 'Otevřít první případ',
    ctaUrl: 'https://www.smlouvahned.cz/moje-zakazka?id=1#access=abc',
    footerNote: 'Test',
  });
  ok(emailHtml.includes('<a href="https://www.smlouvahned.cz/moje-zakazka?id=1#access=abc"'), 'recovery e-mail renders case links as clickable HTML');
  ok(emailHtml.includes('Zakázka &lt;test&gt;'), 'recovery e-mail escapes case labels');
  ok(!emailHtml.includes('&lt;a href='), 'recovery e-mail does not escape its structured links');

  for (const kind of CASE_DOCUMENT_KINDS) {
    const definition = CASE_DOCUMENT_DEFINITIONS[kind];
    const data: Record<string, string> = {};
    for (const field of definition.fields) {
      if (!field.required) continue;
      data[field.key] = field.type === 'date' ? '2026-12-01' : field.type === 'select' ? field.options![0].value : field.type === 'number' ? '10' : field.type === 'money' ? '12 000 Kč' : `Hodnota ${field.key}`;
    }
    const validation = validateCaseDocumentData(kind, data);
    ok(validation.ok, `${kind}: minimal required data validates`);
    const rendered = definition.buildSections(bundle, validation.ok ? validation.data : {});
    ok(rendered.length >= 3, `${kind}: builds sections`);
  }

  await deleteCase(bundle);
}

async function testRetention() {
  memoryRedis.reset();
  eq(CASE_RETENTION_DAYS, 365, 'active case retention 365 days');
  eq(CASE_RETENTION_DAYS_CLOSED, 180, 'closed case retention 180 days');
  eq(PENDING_DOCUMENT_RETENTION_DAYS, 30, 'unpaid document retention 30 days');
  eq(caseTtlSeconds({ stage: 'in_progress', closedAt: null }), 365 * 86400, 'stage TTL: active');
  eq(caseTtlSeconds({ stage: 'closed', closedAt: '2026-10-01T10:00:00Z' }, new Date('2026-10-01T10:00:00Z')), 180 * 86400, 'closed TTL: full 180 days at closing');
  eq(caseTtlSeconds({ stage: 'closed', closedAt: '2026-10-01T10:00:00Z' }, new Date('2026-12-01T10:00:00Z')), 119 * 86400, 'closed TTL counts down from closedAt (fixed deadline)');
  eq(caseTtlSeconds({ stage: 'closed', closedAt: '2026-01-01T10:00:00Z' }, new Date('2026-12-01T10:00:00Z')), 60, 'closed TTL never below the floor once the deadline passed');

  const now = new Date('2026-10-01T10:00:00Z');
  const stored = await saveCase(sampleCase(), now);
  ok(!('orderSessionId' in stored.origin), 'Stripe session is not stored on the case');
  const raw = await memoryRedis.get<Record<string, unknown>>(`case:${stored.id}`);
  ok(!JSON.stringify(raw).includes('orderSessionId'), 'Redis payload carries no order session');
  ok(!JSON.stringify(raw).includes('cs_'), 'Redis payload carries no Stripe identifier');
  eq(raw?.expiresAt, new Date(now.getTime() + 365 * 86400 * 1000).toISOString(), 'expiresAt = 365 days for active case');

  // Legacy record with orderSessionId is scrubbed on the next write.
  await memoryRedis.set(`case:${stored.id}`, { ...stored, origin: { ...stored.origin, orderSessionId: 'cs_legacy_123' } }, { ex: 1000 });
  const rewritten = await saveCase((await getCase(stored.id)) as CaseRecord, now);
  ok(!JSON.stringify(await memoryRedis.get(`case:${rewritten.id}`)).includes('cs_legacy_123'), 'legacy Stripe session scrubbed on write');

  // Closed stage: TTL runs from closedAt and later writes do not extend it.
  const closed = await saveCase({ ...rewritten, stage: 'closed' }, now);
  eq(closed.closedAt, now.toISOString(), 'closedAt stamped on first closed save');
  const ttl = await memoryRedis.ttl(`case:${closed.id}`);
  ok(ttl > 179 * 86400 && ttl <= 180 * 86400, `closed case TTL ≈ 180 days (got ${ttl})`);
  eq(closed.expiresAt, new Date(now.getTime() + 180 * 86400 * 1000).toISOString(), 'expiresAt = 180 days for closed case');
  const later = new Date(now.getTime() + 100 * 86400 * 1000);
  const touchedLater = await saveCase({ ...closed, events: [...closed.events] }, later);
  eq(touchedLater.closedAt, now.toISOString(), 'closedAt is not reset by later writes');
  eq(touchedLater.expiresAt, closed.expiresAt, 'expiresAt stays at closedAt + 180 days after a later write');
  const reopened = await saveCase({ ...touchedLater, stage: 'defects' }, later);
  eq(reopened.closedAt, null, 'reopening clears closedAt');
  eq(reopened.expiresAt, new Date(later.getTime() + 365 * 86400 * 1000).toISOString(), 'reopened case is back on 365 days');
  const closedAgain = await saveCase({ ...reopened, stage: 'closed' }, later);
  eq(closedAgain.closedAt, later.toISOString(), 'closing again starts a new 180-day deadline');
  const closedBack = closedAgain;

  // Unpaid documents older than 30 days are dropped; paid/fresh ones stay.
  const fresh = { ...sampleDocument('fresh'), createdAt: new Date(now.getTime() - 5 * 86400 * 1000).toISOString() };
  const stale = { ...sampleDocument('stale'), createdAt: new Date(now.getTime() - 31 * 86400 * 1000).toISOString() };
  const paidOld = { ...sampleDocument('paid'), status: 'ready' as const, paidAt: now.toISOString(), createdAt: new Date(now.getTime() - 200 * 86400 * 1000).toISOString() };
  const withDocs = await saveCase({ ...closedBack, documents: [fresh, stale, paidOld] }, now);
  eq(withDocs.documents.map((document) => document.id).sort(), ['fresh', 'paid'], 'stale unpaid document purged, fresh and paid kept');

  // Physical purge of a pending document on an untouched case (cron sweep).
  const readBefore = await getCase(withDocs.id);
  eq(readBefore?.documents.map((document) => document.id).sort(), ['fresh', 'paid'], 'fresh pending document still served');
  eq(await memoryRedis.zcard('case:documents:pending'), 1, 'pending document indexed for the sweep');
  const day31 = now.getTime() + 31 * 86400 * 1000;
  const realNow = Date.now;
  Date.now = () => day31;
  try {
    const hidden = await getCase(withDocs.id);
    eq(hidden?.documents.map((document) => document.id), ['paid'], 'expired pending document is not served even before the sweep');
    const ttlBefore = await memoryRedis.ttl(`case:${withDocs.id}`);
    const sweep = await purgeExpiredPendingDocuments(day31);
    eq([sweep.due, sweep.purged, sweep.missing], [1, 1, 0], 'sweep purges the expired pending document');
    const raw = await memoryRedis.get<CaseRecord>(`case:${withDocs.id}`);
    eq(raw?.documents.map((document) => document.id), ['paid'], 'expired pending document physically removed from Redis');
    const ttlAfter = await memoryRedis.ttl(`case:${withDocs.id}`);
    ok(ttlAfter <= ttlBefore, 'sweep does not extend the case retention');
    eq(await memoryRedis.zcard('case:documents:pending'), 0, 'sweep clears the index');
    eq((await purgeExpiredPendingDocuments(day31)).due, 0, 'sweep is idempotent');
  } finally {
    Date.now = realNow;
  }
  await deleteCase(withDocs);
}

async function testConcurrencyAndImmutability() {
  memoryRedis.reset();
  const base = await saveCase(sampleCase());

  // Stale snapshot can never overwrite a newer write (compare-and-set).
  const prepared = await prepareCaseDocument(base, 'change_order', {
    customerName: 'Obec', contractorName: 'Firma', number: '1', date: '2026-11-01', subject: 'scope', originalState: 'a', newState: 'b',
  });
  ok(prepared.ok, 'document prepared');
  const pendingSnapshot = (prepared as { record: CaseRecord; document: CaseDocument }).record;
  const documentId = (prepared as { document: CaseDocument }).document.id;
  const paid = await markCaseDocumentPaid(base.id, documentId, 'cs_test_race');
  eq(paid?.documents[0].status, 'ready', 'webhook marks the document paid');
  await touchCaseAccess(pendingSnapshot);
  eq((await getCase(base.id))?.documents[0].status, 'ready', 'recording access never rewrites the record (stays paid)');
  await assert.rejects(saveCase(pendingSnapshot), CaseConflictError, 'stale snapshot save is rejected');
  eq((await getCase(base.id))?.documents[0].status, 'ready', 'rejected stale save leaves the paid state intact');
  const viaAction = await applyCaseAction(pendingSnapshot, { type: 'add_note', note: 'Poznámka z druhé karty' });
  ok(viaAction.ok && viaAction.record?.documents[0].status === 'ready', 'action from a stale tab is applied on top of the fresh (paid) state');
  ok(viaAction.ok && viaAction.record?.events.some((event) => event.type === 'note'), 'note from the stale tab persisted');
  eq(await commitCase('00000000-0000-4000-8000-000000000000', (fresh) => fresh), null, 'commit on a missing case returns null');

  // Paid document is immutable: later case edits do not change its content.
  const renderedBefore = resolveCaseDocumentRender((await getCase(base.id)) as CaseRecord, (await getCase(base.id))!.documents[0]);
  eq(renderedBefore.templateVersion, CASE_DOCUMENT_TEMPLATE_VERSION, 'snapshot carries the template version');
  ok(renderedBefore.sections.flatMap((section) => section.body).join('\n').includes('beze změny (15. 12. 2026)'), 'change order froze the original deadline');
  const moved = await applyCaseAction((await getCase(base.id)) as CaseRecord, { type: 'set_deadline', deadline: '2027-01-30' });
  ok(moved.ok && moved.record?.deadline === '2027-01-30', 'deadline moved after the document was issued');
  await applyCaseAction(moved.ok && moved.record ? moved.record : base, { type: 'set_title', title: 'Jiný název' });
  const after = (await getCase(base.id)) as CaseRecord;
  const renderedAfter = resolveCaseDocumentRender(after, after.documents[0]);
  eq(renderedAfter.sections, renderedBefore.sections, 'issued document sections unchanged after deadline and title edits');
  eq(renderedAfter.caseDeadline, '2026-12-15', 'issued document keeps the deadline from its creation');
  eq(renderedAfter.caseTitle, 'Rekonstrukce koupelny', 'issued document keeps the case title from its creation');
  const legacy = resolveCaseDocumentRender(after, { ...after.documents[0], snapshot: undefined });
  eq(legacy.templateVersion, 'legacy', 'documents without a snapshot render from the current case (marked legacy)');

  // Long valid text is never silently cut.
  const marker = 'KONTROLNI-KONEC-TEXTU';
  const longText = `${'Popis provedených prací. '.repeat(150)}${marker}`;
  ok(longText.length > 2500 && longText.length <= 4000, `long text fixture is ${longText.length} chars`);
  const validation = validateCaseDocumentData('change_order', {
    customerName: 'Obec', contractorName: 'Firma', number: '2', date: '2026-11-02', subject: 'scope', originalState: 'a', newState: longText,
  });
  ok(validation.ok, 'long text within the 4000 limit validates');
  const longSections = CASE_DOCUMENT_DEFINITIONS.change_order.buildSections(after, validation.ok ? validation.data : {});
  ok(longSections.flatMap((section) => section.body).join('\n').includes(marker), 'full accepted text reaches the rendered sections');
  const longPdf = await renderSimpleDocumentPdf({
    title: 'Změnový list', subtitleLines: ['Zakázka: test'], sections: longSections, signatureSectionTitle: CASE_DOCUMENT_SIGNATURE_TITLE,
    signatureLabels: CASE_DOCUMENT_DEFINITIONS.change_order.signatureLabels, docId: 'SH-Z-LONG',
  });
  ok(longPdf.subarray(0, 4).toString() === '%PDF' && (longPdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length >= 2, 'long text paginates into multiple PDF pages');
  const pdfSource = readFileSync(new URL('../lib/pdf.ts', import.meta.url), 'utf8');
  const simpleRenderer = pdfSource.slice(pdfSource.indexOf('export async function renderSimpleDocumentPdf'));
  ok(!simpleRenderer.includes('substring(0, 1600)') && !simpleRenderer.includes('section.body.slice(0, 80)'), 'simple PDF renderer must never silently truncate accepted follow-up text');
  const tooLong = validateCaseDocumentData('change_order', { customerName: 'Obec', contractorName: 'Firma', number: '3', date: '2026-11-02', subject: 'scope', originalState: 'a', newState: 'x'.repeat(4001) });
  ok(!tooLong.ok && tooLong.field === 'newState', 'text over the limit is rejected before payment, not cut later');

  // Price import: CZK only, haléře kept.
  eq(parseAmountCzk('1000.50', 'EUR'), null, 'foreign currency is not imported as Kč');
  eq(parseAmountCzk('1 000,50', 'Kč'), 1000.5, 'CZK amount keeps haléře');
  eq(parseAmountCzk(185000, undefined), 185000, 'numeric CZK amount');
  eq(parseAmountCzk('12 000 Kč', 'CZK'), 12000, 'CZK code accepted');
  eq(parseAmountCzk('abc', 'Kč'), null, 'garbage rejected');

  await deleteCase(after);
}

async function testCheckoutIdempotency() {
  memoryRedis.reset();
  const record = await saveCase(sampleCase());
  const prepared = await prepareCaseDocument(record, 'handover_protocol', {
    customerName: 'A', contractorName: 'B', handoverDate: '2026-12-15', handoverPlace: 'Praha', scopeDelivered: 'x', acceptanceResult: 'accepted',
  });
  ok(prepared.ok, 'pending document prepared for checkout');
  const doc = (prepared as { document: CaseDocument }).document;
  const created: Array<{ params: Record<string, unknown>; options?: { idempotencyKey?: string } }> = [];
  const expired: string[] = [];
  const sessions = new Map<string, { id: string; url: string; status: string; payment_status: string; metadata: Record<string, string>; expires_at: number }>();
  const stub: CaseCheckoutStripe = {
    checkout: {
      sessions: {
        create: async (params, options) => {
          created.push({ params: params as unknown as Record<string, unknown>, options: options as { idempotencyKey?: string } });
          const id = `cs_test_${created.length}`;
          const session = { id, url: `https://checkout.stripe.test/${id}`, status: 'open', payment_status: 'unpaid', metadata: params.metadata as Record<string, string>, expires_at: Math.floor(Date.now() / 1000) + 86400 };
          sessions.set(id, session);
          return session as never;
        },
        retrieve: async (id) => {
          const session = sessions.get(id);
          if (!session) throw new Error('no such session');
          return session as never;
        },
        expire: async (id) => { expired.push(id); const session = sessions.get(id); if (session) session.status = 'expired'; return undefined; },
      },
    },
  };

  const first = await createCaseDocumentCheckout(record, doc, 'jan.novak@example.cz', stub);
  ok(first.status === 'open' && !first.reused, 'first checkout creates a session');
  eq(created.length, 1, 'one Stripe session created');
  eq(created[0].options?.idempotencyKey, `case-doc:${doc.id}:1`, 'idempotency key bound to document and attempt');
  ok(!String(created[0].params.success_url).includes('access='), 'return URL carries no access token (stable params)');
  ok(String(created[0].params.success_url).includes('session_id={CHECKOUT_SESSION_ID}'), 'return URL identifies the session the customer returns from');

  const second = await createCaseDocumentCheckout(record, doc, 'jan.novak@example.cz', stub);
  ok(second.status === 'open' && second.reused && second.url === (first as { url: string }).url, 'retry reuses the open session');
  eq(created.length, 1, 'no second Stripe session for an open one');
  const stored = (await getCase(record.id))?.documents[0];
  eq(stored?.stripeSessionId, 'cs_test_1', 'document keeps the single open session');
  eq(stored?.checkoutAttempts, 1, 'attempt counter recorded');

  // Expired session → replaced by a new attempt with a new idempotency key.
  sessions.get('cs_test_1')!.expires_at = Math.floor(Date.now() / 1000) - 10;
  const third = await createCaseDocumentCheckout(record, doc, 'jan.novak@example.cz', stub);
  ok(third.status === 'open' && !third.reused, 'expiring session is replaced');
  eq(created.length, 2, 'second session created only after the first expired');
  eq(created[1].options?.idempotencyKey, `case-doc:${doc.id}:2`, 'next attempt uses the next key');
  eq(expired, ['cs_test_1'], 'the replaced open session was expired at Stripe');
  eq((await getCase(record.id))?.documents[0].stripeSessionId, 'cs_test_2', 'document points to the active session');

  // Paid at Stripe but webhook late → checkout resolves to ready instead of charging again.
  sessions.get('cs_test_2')!.payment_status = 'paid';
  sessions.get('cs_test_2')!.status = 'complete';
  const fourth = await createCaseDocumentCheckout(record, doc, 'jan.novak@example.cz', stub);
  eq(fourth.status, 'ready', 'paid session marks the document ready');
  eq(created.length, 2, 'no new session after payment');
  eq((await getCase(record.id))?.documents[0].status, 'ready', 'document is ready');

  // Concurrent requests: the lock rejects the second caller instead of creating another session.
  const other = await prepareCaseDocument((await getCase(record.id)) as CaseRecord, 'defect_record', {
    customerName: 'A', contractorName: 'B', date: '2026-12-20', defects: 'x', remedy: 'repair', deadlineDays: '14',
  });
  const otherDoc = (other as { document: CaseDocument }).document;
  await memoryRedis.set(`lock:case-doc-checkout:${otherDoc.id}`, 'someone-else', { ex: 30 });
  await assert.rejects(createCaseDocumentCheckout((await getCase(record.id)) as CaseRecord, otherDoc, 'jan.novak@example.cz', stub), /checkout_locked/, 'second concurrent checkout is refused while locked');
  eq(created.length, 2, 'locked request creates nothing');
  await memoryRedis.del(`lock:case-doc-checkout:${otherDoc.id}`);
  await deleteCase((await getCase(record.id)) as CaseRecord);
}

function sampleDocument(id: string) {
  return {
    id,
    kind: 'handover_protocol' as const,
    title: 'Předávací protokol',
    status: 'pending_payment' as const,
    data: { customerName: 'A', contractorName: 'B' },
    entitlement: 'paid' as const,
    stripeSessionId: null,
    createdAt: new Date().toISOString(),
    paidAt: null,
  };
}

async function testConsent() {
  const now = Date.now();
  const valid = { accepted: true, acceptedAt: new Date(now - 60_000).toISOString(), termsVersion: CHECKOUT_TERMS_VERSION, privacyVersion: CHECKOUT_PRIVACY_VERSION, textVersion: CHECKOUT_CONSENT_TEXT_VERSION };
  ok(isCaseDocumentConsentValid(valid, now), 'fresh consent accepted');
  ok(!isCaseDocumentConsentValid({ ...valid, accepted: false }, now), 'unaccepted consent rejected');
  ok(!isCaseDocumentConsentValid({ ...valid, termsVersion: '2020-01-01' }, now), 'stale terms version rejected');
  ok(!isCaseDocumentConsentValid({ ...valid, acceptedAt: new Date(now - 2 * 86_400_000).toISOString() }, now), 'old consent rejected');
  ok(!isCaseDocumentConsentValid(null, now), 'missing consent rejected');
}

async function main() {
  await testWorkflow();
  await testStoreAndAccess();
  await testActions();
  await testDocuments();
  await testRetention();
  await testConcurrencyAndImmutability();
  await testCheckoutIdempotency();
  await testConsent();
  await testCaseReliability();
  console.log(`Case engine tests passed (${checks} checks: workflow, store, tokens, actions, reminders, documents, PDF, retention, concurrency, immutability, checkout idempotency, consent).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
