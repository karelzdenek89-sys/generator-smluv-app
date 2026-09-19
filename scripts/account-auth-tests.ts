process.env.SMLOUVAHNED_FAKE_REDIS = '1';

import assert from 'node:assert/strict';
import { memoryRedis } from '@/lib/redis-memory';
import {
  createAccount,
  createAccountSession,
  deleteAccount,
  findAccount,
  getAccountById,
  issuePasswordResetToken,
  issueVerificationToken,
  resetPasswordWithToken,
  resolveAccountSession,
  sessionCsrfMatches,
  updateAccountProfile,
  verifyAccountEmail,
  verifyPassword,
} from '@/lib/account';

async function main() {
  memoryRedis.reset();

  const created = await createAccount({
    username: 'Karel.Test',
    email: 'Karel.Test@example.cz',
    displayName: 'Karel Test',
    password: 'spravne-heslo-2026',
  });
  assert.equal(created.ok, true, 'account creates');
  if (!created.ok) return;

  assert.equal((await findAccount('karel.test'))?.id, created.user.id, 'username lookup is case-insensitive');
  assert.equal((await findAccount('KAREL.TEST@EXAMPLE.CZ'))?.id, created.user.id, 'email lookup is case-insensitive');
  assert.equal(await verifyPassword('spravne-heslo-2026', created.user.passwordHash), true, 'password verifies');
  assert.equal(await verifyPassword('spatne-heslo-2026', created.user.passwordHash), false, 'wrong password rejected');

  const duplicateUsername = await createAccount({
    username: 'karel.test',
    email: 'jiny@example.cz',
    password: 'druhe-heslo-2026',
  });
  assert.equal(duplicateUsername.ok, false, 'duplicate username rejected');

  const duplicateEmail = await createAccount({
    username: 'jiny-uzivatel',
    email: 'karel.test@example.cz',
    password: 'druhe-heslo-2026',
  });
  assert.equal(duplicateEmail.ok, false, 'duplicate email rejected');

  const verifyToken = await issueVerificationToken(created.user);
  const verified = await verifyAccountEmail(verifyToken);
  assert.ok(verified?.emailVerifiedAt, 'email verification activates account');
  assert.equal(await verifyAccountEmail(verifyToken), null, 'verification token is one-time');

  const session = await createAccountSession(verified!);
  const resolved = await resolveAccountSession(session.token);
  assert.equal(resolved?.user.id, verified!.id, 'session resolves to account');
  assert.equal(sessionCsrfMatches(resolved!.session, session.csrf), true, 'session binds CSRF token');
  assert.equal(sessionCsrfMatches(resolved!.session, 'wrong-csrf'), false, 'wrong CSRF rejected');

  const changed = await updateAccountProfile(verified!, { username: 'Karel.Novy', displayName: 'Karel Nový' });
  assert.equal(changed.ok, true, 'profile updates');
  if (!changed.ok) return;
  assert.equal((await findAccount('karel.novy'))?.id, verified!.id, 'new username index active');
  assert.equal(await findAccount('karel.test'), null, 'old username index removed');

  const resetToken = await issuePasswordResetToken(changed.user);
  const reset = await resetPasswordWithToken(resetToken, 'nove-bezpecne-heslo-2026');
  assert.ok(reset, 'password reset succeeds');
  assert.equal(await verifyPassword('nove-bezpecne-heslo-2026', reset!.passwordHash), true, 'new password verifies');
  assert.equal(await resolveAccountSession(session.token), null, 'password reset revokes previous sessions');
  assert.equal(await resetPasswordWithToken(resetToken, 'treti-heslo-2026'), null, 'reset token is one-time');

  const concurrentVerifyToken = await issueVerificationToken(reset!);
  const verificationAttempts = await Promise.all([
    verifyAccountEmail(concurrentVerifyToken),
    verifyAccountEmail(concurrentVerifyToken),
  ]);
  assert.equal(verificationAttempts.filter(Boolean).length, 1, 'only one concurrent verification consumes the token');
  const concurrentResetToken = await issuePasswordResetToken(reset!);
  const resetAttempts = await Promise.all([
    resetPasswordWithToken(concurrentResetToken, 'concurrent-password-one'),
    resetPasswordWithToken(concurrentResetToken, 'concurrent-password-two'),
  ]);
  assert.equal(resetAttempts.filter(Boolean).length, 1, 'only one concurrent reset changes the password');

  for (let i = 0; i < 25; i += 1) await createAccountSession(reset!);
  const activeSessionHashes = await memoryRedis.smembers(`account:sessions:${reset!.id}`);
  assert.ok(activeSessionHashes.length <= 20, 'active sessions are bounded');

  await deleteAccount(reset!);
  assert.equal(await getAccountById(reset!.id), null, 'account deletion removes profile');
  assert.equal(await findAccount('karel.novy'), null, 'account deletion removes username index');
  assert.equal(await findAccount('karel.test@example.cz'), null, 'account deletion removes email index');

  memoryRedis.reset();

  // Route-level smoke without real e-mail delivery.
  delete process.env.RESEND_API_KEY;
  const { POST } = await import('@/app/api/account/route');
  const makeRequest = (body: Record<string, unknown>, origin = 'http://localhost') => new Request('http://localhost/api/account', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin,
      'x-real-ip': '127.0.0.1',
    },
    body: JSON.stringify(body),
  });

  const crossSite = await POST(makeRequest({
    action: 'register',
    username: 'cross-site-user',
    email: 'cross-site@example.cz',
    password: 'cross-site-password-2026',
    acceptTerms: true,
  }, 'https://attacker.example'));
  assert.equal(crossSite.status, 403, 'cross-site account mutation rejected');

  const registerResponse = await POST(makeRequest({
    action: 'register',
    username: 'api-test',
    email: 'api-test@example.cz',
    displayName: 'API Test',
    password: 'api-test-password-2026',
    acceptTerms: true,
  }));
  assert.equal(registerResponse.status, 200, 'account API registers');
  const setCookie = registerResponse.headers.get('set-cookie') ?? '';
  assert.match(setCookie, /sh_session=/, 'session cookie issued');
  assert.match(setCookie, /HttpOnly/i, 'session cookie is HttpOnly');
  assert.match(setCookie, /SameSite=Lax/i, 'session cookie has SameSite protection');
  assert.match(registerResponse.headers.get('cache-control') ?? '', /no-store/i, 'auth responses are not cached');
  assert.match(setCookie, /sh_csrf=/, 'CSRF cookie issued');

  const wrongLogin = await POST(makeRequest({
    action: 'login',
    login: 'api-test',
    password: 'wrong-password-2026',
  }));
  assert.equal(wrongLogin.status, 401, 'wrong API password rejected');

  const goodLogin = await POST(makeRequest({
    action: 'login',
    login: 'API-TEST@EXAMPLE.CZ',
    password: 'api-test-password-2026',
  }));
  assert.equal(goodLogin.status, 200, 'API login accepts verified credential form without account enumeration');

  // Resend rejects a reused idempotency key with a different email body.
  // Two resets in the same minute must each deliver their new token.
  const originalFetch = globalThis.fetch;
  const originalNow = Date.now;
  const emailBodies: { key: string; text: string }[] = [];
  process.env.RESEND_API_KEY = 're_test_local_mock';
  Date.now = () => 1_789_800_000_000;
  globalThis.fetch = (async (input, init) => {
    assert.equal(String(input), 'https://api.resend.com/emails');
    const body = JSON.parse(String(init?.body)) as { text: string };
    emailBodies.push({ key: new Headers(init?.headers).get('Idempotency-Key') ?? '', text: body.text });
    return Response.json({ id: 'mock-email' });
  }) as typeof fetch;
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await POST(makeRequest({ action: 'forgot_password', login: 'api-test' }));
      assert.equal(response.status, 200);
    }
    assert.equal(emailBodies.length, 2);
    assert.notEqual(emailBodies[0].key, emailBodies[1].key, 'different reset links use different delivery keys');
    const tokens = emailBodies.map((email) => new URL(email.text.match(/https?:\/\/\S+/)![0]).hash.slice('#reset='.length));
    assert.equal(await resetPasswordWithToken(tokens[0], 'reset-before-resend'), null, 'previous reset link is revoked');
    assert.ok(await resetPasswordWithToken(tokens[1], 'reset-after-resend'), 'latest delivered reset link works');
  } finally {
    globalThis.fetch = originalFetch;
    Date.now = originalNow;
    delete process.env.RESEND_API_KEY;
  }

  memoryRedis.reset();
  console.log('Account auth tests passed (registration, password hashing, verification, sessions, profile, reset, deletion, API security smoke).');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
