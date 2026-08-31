import assert from 'node:assert/strict';
import {
  PUBLIC_ANALYTICS_EVENT_NAMES,
  type AnalyticsEventName,
} from '@/lib/analytics';
import {
  createInternalReportingCookieValue,
  getInternalReportingAdminEmail,
  isValidInternalReportingCookie,
  reportingEmailMatches,
} from '@/lib/internal-reporting-auth';
import { readFirstPartyForm } from '@/lib/api-security';
import { POST as logout } from '@/app/interni/analytics/logout/route';

const SERVER_ONLY_EVENTS = [
  'stripe_checkout_started',
  'checkout_rejected',
  'checkout_addon_purchased',
  'checkout_completed',
  'newsletter_subscribed',
  'document_downloaded',
  'free_document_generated',
  'free_document_downloaded',
  'partner_lead_succeeded',
  'partner_conversion_recorded',
] satisfies AnalyticsEventName[];

async function main() {
  for (const event of SERVER_ONLY_EVENTS) {
    assert.equal(
      (PUBLIC_ANALYTICS_EVENT_NAMES as readonly string[]).includes(event),
      false,
      `${event} must stay server-only`,
    );
  }
  assert.ok(PUBLIC_ANALYTICS_EVENT_NAMES.includes('builder_checkout_clicked'));
  assert.ok(PUBLIC_ANALYTICS_EVENT_NAMES.includes('partner_offer_clicked'));

  const secret = 'test-reporting-secret-with-enough-entropy';
  const adminEmail = getInternalReportingAdminEmail();
  const issuedAt = Date.now();
  const cookie = createInternalReportingCookieValue(secret, adminEmail, issuedAt);
  assert.equal(adminEmail, 'karelzdenek89@gmail.com');
  assert.equal(reportingEmailMatches(adminEmail, ' KARELZDENEK89@GMAIL.COM '), true);
  assert.equal(isValidInternalReportingCookie(secret, cookie, adminEmail, issuedAt + 1000), true);
  assert.equal(isValidInternalReportingCookie(secret, cookie, 'attacker@example.com', issuedAt + 1000), false);
  assert.equal(isValidInternalReportingCookie(`${secret}-wrong`, cookie, adminEmail, issuedAt + 1000), false);
  assert.equal(isValidInternalReportingCookie(secret, `${cookie}x`, adminEmail, issuedAt + 1000), false);
  assert.equal(isValidInternalReportingCookie(secret, cookie, adminEmail, issuedAt + 25 * 60 * 60 * 1000), false);

  const validForm = await readFirstPartyForm(new Request('https://www.smlouvahned.cz/interni/analytics/auth', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      host: 'www.smlouvahned.cz',
      origin: 'https://www.smlouvahned.cz',
    },
    body: 'email=karelzdenek89%40gmail.com&secret=test',
  }), 1024);
  assert.equal(validForm.ok, true);

  const crossOriginForm = await readFirstPartyForm(new Request('https://www.smlouvahned.cz/interni/analytics/auth', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      host: 'www.smlouvahned.cz',
      origin: 'https://attacker.example',
    },
    body: 'email=x%40example.com&secret=x',
  }), 1024);
  assert.deepEqual(crossOriginForm, { ok: false, error: 'invalid_origin' });

  const blockedLogout = await logout(new Request('https://www.smlouvahned.cz/interni/analytics/logout', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      host: 'www.smlouvahned.cz',
      origin: 'https://attacker.example',
      'sec-fetch-site': 'cross-site',
    },
    body: '',
  }));
  assert.equal(blockedLogout.status, 403);

  const validLogout = await logout(new Request('https://www.smlouvahned.cz/interni/analytics/logout', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      host: 'www.smlouvahned.cz',
      origin: 'https://www.smlouvahned.cz',
    },
    body: '',
  }));
  assert.equal(validLogout.status, 303);
  assert.match(validLogout.headers.get('set-cookie') ?? '', /Max-Age=0/);

  console.log('Admin and analytics security regression tests passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
