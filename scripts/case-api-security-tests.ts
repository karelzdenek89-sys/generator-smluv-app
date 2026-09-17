process.env.SMLOUVAHNED_FAKE_REDIS = '1';
process.env.NEXT_PUBLIC_BASE_URL = 'https://www.smlouvahned.cz';
delete process.env.RESEND_API_KEY;
delete process.env.CRON_SECRET;

import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { memoryRedis } from '@/lib/redis-memory';
import { issueCaseAccessToken } from '@/lib/cases/access';
import { buildCaseRecord, saveCase } from '@/lib/cases/store';
import { POST as resolveRoute } from '@/app/api/cases/resolve/route';
import { POST as updateRoute } from '@/app/api/cases/update/route';
import { POST as exportRoute } from '@/app/api/cases/export/route';
import { POST as fromOrderRoute } from '@/app/api/cases/from-order/route';
import { POST as requestLinkRoute } from '@/app/api/cases/request-link/route';
import { POST as downloadRoute } from '@/app/api/cases/documents/download/route';
import { POST as createDocumentRoute } from '@/app/api/cases/documents/create/route';
import { GET as cronRoute } from '@/app/api/cron/reminders/route';
import { GET as healthRoute } from '@/app/api/health/route';
import { POST as intentRoute } from '@/app/api/partners/intent/route';
import { proxy, isPrivateCasePath } from '../proxy';

let checks = 0;
function ok(condition: unknown, message: string) {
  checks += 1;
  assert.ok(condition, message);
}
function eq<T>(actual: T, expected: T, message: string) {
  checks += 1;
  assert.deepEqual(actual, expected, message);
}

function post(body: unknown, headers: Record<string, string> = {}, ip = '203.0.113.10'): Request {
  return new Request('https://www.smlouvahned.cz/api/cases/test', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      host: 'www.smlouvahned.cz',
      origin: 'https://www.smlouvahned.cz',
      'x-forwarded-for': ip,
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

async function seedCase() {
  const record = await saveCase(
    buildCaseRecord({
      ownerEmail: 'owner@example.cz',
      ownerRole: 'customer',
      title: 'Střecha',
      startDate: null,
      deadline: '2026-12-01',
      priceAmountCzk: 50000,
      priceMode: 'after_completion',
      origin: { source: 'success_page', contractType: 'work_contract', tier: 'complete', packageKey: 'work_order', orderSessionId: 'cs_test_seed' },
    }),
  );
  const token = await issueCaseAccessToken(record.id, record.ownerEmail);
  return { record, token };
}

async function testAuthorization() {
  memoryRedis.reset();
  const { record, token } = await seedCase();
  const other = await seedCase();

  const good = await resolveRoute(post({ caseId: record.id, token }));
  eq(good.status, 200, 'owner token resolves the case');
  const body = (await good.json()) as { case: Record<string, unknown> };
  ok(!('ownerEmail' in body.case), 'response never includes the owner e-mail');
  ok(!JSON.stringify(body).includes('cs_test_seed'), 'response never includes the Stripe session');
  ok(!JSON.stringify(body).includes(token), 'response never echoes the token');

  eq((await resolveRoute(post({ caseId: record.id, token: other.token }))).status, 403, 'token of another case is rejected (IDOR)');
  eq((await resolveRoute(post({ caseId: other.record.id, token }))).status, 403, 'case id of another case is rejected (IDOR)');
  eq((await resolveRoute(post({ caseId: record.id }))).status, 403, 'missing token rejected');
  eq((await resolveRoute(post({ caseId: 'not-a-uuid', token }))).status, 403, 'malformed case id rejected');
  eq((await resolveRoute(post({ caseId: record.id, token }, { origin: 'https://evil.example' }))).status, 403, 'cross-origin request rejected');
  eq((await resolveRoute(post({ caseId: record.id, token }, { 'sec-fetch-site': 'cross-site' }))).status, 403, 'cross-site fetch rejected');
  eq((await resolveRoute(post('[]'))).status, 400, 'non-object JSON rejected');
  eq((await resolveRoute(post({ caseId: record.id, token }, { 'content-type': 'text/plain' }))).status, 400, 'wrong content type rejected');

  const unauthorized = await resolveRoute(post({ caseId: record.id, token: token.replace(/./g, 'b') }));
  const missing = await resolveRoute(post({ caseId: '11111111-1111-4111-8111-111111111111', token }));
  eq(unauthorized.status, missing.status, 'unknown token and unknown case answer identically (no enumeration)');
  eq(await unauthorized.text(), await missing.text(), 'identical body for unknown token vs unknown case');

  const update = await updateRoute(post({ caseId: record.id, token, action: { type: 'set_stage', stage: 'in_progress' } }));
  eq(update.status, 200, 'owner can update');
  eq((await updateRoute(post({ caseId: record.id, token, action: { type: 'set_stage', stage: 'in_progress' } }, { origin: 'https://evil.example' }))).status, 403, 'update rejects cross-origin');
  eq((await updateRoute(post({ caseId: record.id, token, action: { type: 'explode' } }))).status, 400, 'unknown action rejected');
  eq((await updateRoute(post({ caseId: record.id, token: other.token, action: { type: 'delete' } }))).status, 403, 'cannot delete another case');

  const exported = await exportRoute(post({ caseId: record.id, token }));
  eq(exported.status, 200, 'export works for owner');
  const exportedText = await exported.text();
  ok(!exportedText.includes('cs_test_seed'), 'export omits Stripe session id');
  ok(exported.headers.get('content-disposition')?.includes('attachment'), 'export served as attachment');
  eq(exported.headers.get('cache-control'), 'private, no-store', 'export not cacheable');

  eq((await downloadRoute(post({ caseId: record.id, token, documentId: 'nope' }))).status, 404, 'unknown document 404');
  const created = await createDocumentRoute(post({ caseId: record.id, token, kind: 'change_order', data: { customerName: 'A', contractorName: 'B', number: '1', date: '2026-11-01', subject: 'scope', originalState: 'x', newState: 'y' } }));
  eq(created.status, 200, 'bundle case creates document without payment');
  const createdBody = (await created.json()) as { documentId: string; ready: boolean };
  eq(createdBody.ready, true, 'document ready (included)');
  const pdf = await downloadRoute(post({ caseId: record.id, token, documentId: createdBody.documentId }));
  eq(pdf.status, 200, 'owner downloads PDF');
  eq(pdf.headers.get('content-type'), 'application/pdf', 'PDF content type');
  eq((await downloadRoute(post({ caseId: record.id, token: other.token, documentId: createdBody.documentId }))).status, 403, 'other token cannot download');
  eq((await createDocumentRoute(post({ caseId: record.id, token, kind: 'change_order', data: {} }))).status, 400, 'invalid document data rejected');
  eq((await createDocumentRoute(post({ caseId: record.id, token, kind: 'evil', data: {} }))).status, 400, 'unknown document kind rejected');

  memoryRedis.reset();
  const fresh = await seedCase();
  const revoke = await updateRoute(post({ caseId: fresh.record.id, token: fresh.token, action: { type: 'revoke_links' } }));
  eq(revoke.status, 200, 'revocation succeeds');
  eq((await resolveRoute(post({ caseId: fresh.record.id, token: fresh.token }))).status, 403, 'revoked token no longer works');
}

async function testRateLimits() {
  memoryRedis.reset();
  const { record, token } = await seedCase();
  let limited = 0;
  for (let i = 0; i < 65; i += 1) {
    const response = await resolveRoute(post({ caseId: record.id, token }, {}, '198.51.100.7'));
    if (response.status === 429) limited += 1;
  }
  ok(limited >= 5, 'resolve is rate limited per IP (60 / 10 min)');

  let linkLimited = 0;
  for (let i = 0; i < 5; i += 1) {
    const response = await requestLinkRoute(post({ email: 'someone@example.cz' }, {}, `198.51.100.${20 + i}`));
    if (response.status === 429) linkLimited += 1;
  }
  ok(linkLimited >= 2, 'request-link is rate limited per e-mail (3 / hour) even across IPs');
  const unknownEmail = await requestLinkRoute(post({ email: 'nobody@example.cz' }, {}, '198.51.100.99'));
  eq(unknownEmail.status, 200, 'request-link answers 200 for unknown e-mail');
  eq(await unknownEmail.json(), { ok: true }, 'request-link body reveals nothing');
  eq((await requestLinkRoute(post({ email: 'not-an-email' }, {}, '198.51.100.98'))).status, 400, 'invalid e-mail rejected');
  eq((await requestLinkRoute(post({ email: 'bot@example.cz', company: 'spam' }, {}, '198.51.100.97'))).status, 200, 'honeypot silently accepted');
}

async function testFromOrderAndFlags() {
  memoryRedis.reset();
  eq((await fromOrderRoute(post({ sessionId: 'not-a-session', token: 'x' }))).status, 400, 'from-order rejects malformed session id');
  eq((await fromOrderRoute(post({ sessionId: 'cs_test_abc123456789', token: '' }))).status, 400, 'from-order rejects missing token');
  eq((await fromOrderRoute(post({ sessionId: 'cs_test_abc123456789', token: 'x' }, { origin: 'https://evil.example' }))).status, 403, 'from-order rejects cross-origin');

  eq((await intentRoute(post({ email: 'a@b.cz' }))).status, 404, 'commercial intent endpoint is closed while the flag is off');

  process.env.NEXT_PUBLIC_FEATURE_CASE_ENGINE = 'false';
  const { record, token } = await seedCase();
  eq((await resolveRoute(post({ caseId: record.id, token }))).status, 404, 'kill switch closes case routes');
  eq((await fromOrderRoute(post({ sessionId: 'cs_test_abc123456789', token: 'x' }))).status, 404, 'kill switch closes case creation');
  eq((await requestLinkRoute(post({ email: 'owner@example.cz' }))).status, 404, 'kill switch closes link requests');
  delete process.env.NEXT_PUBLIC_FEATURE_CASE_ENGINE;
}

async function testCronAndHealth() {
  memoryRedis.reset();
  const cronUrl = 'https://www.smlouvahned.cz/api/cron/reminders';
  eq((await cronRoute(new Request(cronUrl))).status, 401, 'cron without secret configured is unauthorized');
  process.env.CRON_SECRET = 'test-secret-value-1234567890';
  eq((await cronRoute(new Request(cronUrl))).status, 401, 'cron without bearer is unauthorized');
  eq((await cronRoute(new Request(cronUrl, { headers: { authorization: 'Bearer wrong' } }))).status, 401, 'cron with wrong bearer is unauthorized');
  const noEmail = await cronRoute(new Request(cronUrl, { headers: { authorization: 'Bearer test-secret-value-1234567890' } }));
  eq(noEmail.status, 503, 'cron refuses to run without e-mail provider configured');
  eq(await memoryRedis.get('case:reminders:cron-lock'), null, 'no lock left behind when e-mail is unconfigured');
  delete process.env.CRON_SECRET;

  const health = await healthRoute();
  const healthBody = (await health.json()) as { status: string; checks: Record<string, string> };
  ok(['ok', 'degraded'].includes(healthBody.status), 'health reports a status');
  eq(healthBody.checks.remindersCron, 'unconfigured', 'health reports missing cron secret without leaking values');
  ok(!JSON.stringify(healthBody).includes('sk_'), 'health never includes secrets');
}

function testProxy() {
  ok(isPrivateCasePath('/moje-zakazka'), 'case page is private');
  ok(isPrivateCasePath('/moje-zakazka/obnovit'), 'case sub-route is private');
  ok(!isPrivateCasePath('/zakazka'), 'public hub is not private');
  const response = proxy(new NextRequest('https://www.smlouvahned.cz/moje-zakazka?id=abc', { headers: { host: 'www.smlouvahned.cz' } }));
  eq(response.headers.get('x-robots-tag'), 'noindex, nofollow, noarchive', 'private case page is noindex');
  eq(response.headers.get('cache-control'), 'private, no-store, max-age=0', 'private case page is not cacheable');
  eq(response.headers.get('referrer-policy'), 'no-referrer', 'private case page sends no referrer');
  const publicResponse = proxy(new NextRequest('https://www.smlouvahned.cz/zakazka', { headers: { host: 'www.smlouvahned.cz' } }));
  eq(publicResponse.headers.get('x-robots-tag'), null, 'public hub remains indexable');
}

async function main() {
  await testAuthorization();
  await testRateLimits();
  await testFromOrderAndFlags();
  await testCronAndHealth();
  testProxy();
  console.log(`Case API security tests passed (${checks} checks: authorization, IDOR, origin, enumeration, rate limits, kill switch, cron, health, proxy).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
