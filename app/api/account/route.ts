import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getClientIp, readFirstPartyJson } from '@/lib/api-security';
import {
  ACCOUNT_SESSION_TTL_SECONDS,
  accountCookieSecure,
  accountCsrfCookieName,
  accountSessionCookieName,
  burnPasswordCheck,
  createAccount,
  createAccountSession,
  deleteAccount,
  findAccount,
  getActivePaidOrderTtl,
  issuePasswordResetToken,
  issueVerificationToken,
  markLogin,
  refreshSessionCsrf,
  resetPasswordWithToken,
  resolveAccountSession,
  revokeAccountSession,
  revokeAllAccountSessions,
  sessionCsrfMatches,
  setAccountPassword,
  toPublicAccount,
  updateAccountProfile,
  validatePassword,
  verifyAccountEmail,
  verifyPassword,
  type AccountRecord,
  type ResolvedAccountSession,
} from '@/lib/account';
import { takeRateLimit } from '@/lib/rate-limit';
import { renderEmailShell, sendTransactionalEmail } from '@/lib/email/transactional';
import { SITE_URL } from '@/lib/seo/site';
import { ensurePortalAccessToken } from '@/lib/orders-portal';
import { issueCaseHubAccessToken } from '@/lib/cases/hub-access';
import { listCasesForEmail } from '@/lib/cases/store';

export const runtime = 'nodejs';

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL || SITE_URL).replace(/\/+$/, '');
}

function cookieOptions(httpOnly: boolean, maxAge = ACCOUNT_SESSION_TTL_SECONDS) {
  return {
    httpOnly,
    secure: accountCookieSecure(),
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

function setSessionCookies(response: NextResponse, token: string, csrf: string) {
  response.cookies.set(accountSessionCookieName(), token, cookieOptions(true));
  response.cookies.set(accountCsrfCookieName(), csrf, cookieOptions(false));
}

function clearSessionCookies(response: NextResponse) {
  response.cookies.set(accountSessionCookieName(), '', cookieOptions(true, 0));
  response.cookies.set(accountCsrfCookieName(), '', cookieOptions(false, 0));
}

function requestErrorStatus(error: string): number {
  return error === 'invalid_origin' ? 403 : error === 'payload_too_large' ? 413 : 400;
}

function accountJson(data: unknown, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, {
    ...init,
    headers: {
      'Cache-Control': 'no-store, private',
      ...(init?.headers ?? {}),
    },
  });
}

async function currentSession(): Promise<{ resolved: ResolvedAccountSession; csrf: string | null } | null> {
  const jar = await cookies();
  const token = jar.get(accountSessionCookieName())?.value;
  const resolved = await resolveAccountSession(token);
  if (!resolved) return null;
  return { resolved, csrf: jar.get(accountCsrfCookieName())?.value ?? null };
}

function csrfAllowed(req: Request, session: ResolvedAccountSession, cookieCsrf: string | null): boolean {
  const header = req.headers.get('x-csrf-token');
  return Boolean(header && cookieCsrf && header === cookieCsrf && sessionCsrfMatches(session.session, header));
}

async function sendVerification(user: AccountRecord): Promise<boolean> {
  const token = await issueVerificationToken(user);
  const url = `${baseUrl()}/moje#verify=${encodeURIComponent(token)}`;
  const result = await sendTransactionalEmail({
    to: user.email,
    subject: 'Ověřte e-mail pro účet SmlouvaHned',
    idempotencyKey: `account-verify-${createHash('sha256').update(token).digest('hex')}`,
    html: renderEmailShell({
      heading: 'Ověřte svůj e-mail',
      intro: 'Ověřením e-mailu propojíte účet s vašimi dokumenty a případy vedenými pod stejnou e-mailovou adresou.',
      ctaLabel: 'Ověřit e-mail',
      ctaUrl: url,
      secondary: 'Odkaz je jednorázový a platí 24 hodin. Pokud jste účet nevytvářeli, zprávu ignorujte.',
      footerNote: 'Jde o bezpečnostní zprávu k vašemu účtu, nikoli newsletter.',
    }),
    text: `Ověřte e-mail pro účet SmlouvaHned: ${url}\n\nOdkaz platí 24 hodin.`,
  });
  return result.ok;
}

async function sendReset(user: AccountRecord): Promise<boolean> {
  const token = await issuePasswordResetToken(user);
  const url = `${baseUrl()}/moje#reset=${encodeURIComponent(token)}`;
  const result = await sendTransactionalEmail({
    to: user.email,
    subject: 'Obnovení hesla účtu SmlouvaHned',
    idempotencyKey: `account-reset-${createHash('sha256').update(token).digest('hex')}`,
    html: renderEmailShell({
      heading: 'Nastavení nového hesla',
      intro: 'Pro účet SmlouvaHned byl vyžádán odkaz k nastavení nového hesla.',
      ctaLabel: 'Nastavit nové heslo',
      ctaUrl: url,
      secondary: 'Odkaz je jednorázový a platí 60 minut. Pokud jste změnu nevyžádali, nic nemusíte dělat.',
      footerNote: 'Jde o bezpečnostní zprávu k vašemu účtu, nikoli newsletter.',
    }),
    text: `Nastavení nového hesla SmlouvaHned: ${url}\n\nOdkaz platí 60 minut.`,
  });
  return result.ok;
}

async function rateLimit(key: string, limit: number, seconds: number): Promise<boolean> {
  const result = await takeRateLimit(key, limit, seconds);
  return result.allowed;
}

export async function GET() {
  try {
    const current = await currentSession();
    if (!current) return accountJson({ authenticated: false }, { headers: { 'Cache-Control': 'no-store' } });

    let csrf = current.csrf;
    if (!sessionCsrfMatches(current.resolved.session, csrf)) {
      csrf = await refreshSessionCsrf(current.resolved.tokenHash, current.resolved.session);
    }
    const response = accountJson({
      authenticated: true,
      user: toPublicAccount(current.resolved.user),
      csrf,
    }, { headers: { 'Cache-Control': 'no-store' } });
    if (csrf && csrf !== current.csrf) response.cookies.set(accountCsrfCookieName(), csrf, cookieOptions(false));
    return response;
  } catch {
    return accountJson({ authenticated: false }, { headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function POST(req: Request) {
  const parsed = await readFirstPartyJson(req, 12 * 1024);
  if (!parsed.ok) return accountJson({ error: 'Neplatný požadavek.' }, { status: requestErrorStatus(parsed.error) });
  const action = typeof parsed.data.action === 'string' ? parsed.data.action : '';
  const ip = getClientIp(req);

  try {
    if (action === 'register') {
      if (!await rateLimit(`ratelimit:account-register:${ip}`, 8, 3600)) return accountJson({ error: 'Příliš mnoho pokusů. Zkuste to později.' }, { status: 429 });
      if (parsed.data.acceptTerms !== true) return accountJson({ error: 'Pro vytvoření účtu potvrďte seznámení s podmínkami a zásadami ochrany osobních údajů.' }, { status: 400 });
      const created = await createAccount({
        username: typeof parsed.data.username === 'string' ? parsed.data.username : '',
        email: typeof parsed.data.email === 'string' ? parsed.data.email : '',
        displayName: typeof parsed.data.displayName === 'string' ? parsed.data.displayName : '',
        password: typeof parsed.data.password === 'string' ? parsed.data.password : '',
      });
      if (!created.ok) return accountJson({ error: created.message, field: created.field }, { status: 409 });
      const emailSent = await sendVerification(created.user).catch(() => false);
      const session = await createAccountSession(created.user);
      const response = accountJson({ ok: true, user: toPublicAccount(created.user), csrf: session.csrf, emailSent });
      setSessionCookies(response, session.token, session.csrf);
      return response;
    }

    if (action === 'login') {
      const login = typeof parsed.data.login === 'string' ? parsed.data.login.trim() : '';
      const password = typeof parsed.data.password === 'string' ? parsed.data.password : '';
      if (!login || !password || login.length > 200 || password.length > 128) return accountJson({ error: 'Neplatné přihlašovací údaje.' }, { status: 401 });
      if (!await rateLimit(`ratelimit:account-login:${ip}`, 20, 3600)) return accountJson({ error: 'Příliš mnoho pokusů. Zkuste to později.' }, { status: 429 });
      const user = await findAccount(login);
      if (!user) {
        await burnPasswordCheck(password);
        return accountJson({ error: 'Neplatné přihlašovací údaje.' }, { status: 401 });
      }
      if (!await rateLimit(`ratelimit:account-login-user:${user.id}`, 30, 3600)) {
        return accountJson({ error: 'Příliš mnoho pokusů. Zkuste to později.' }, { status: 429 });
      }
      const passwordOk = await verifyPassword(password, user.passwordHash);
      if (!passwordOk) return accountJson({ error: 'Neplatné přihlašovací údaje.' }, { status: 401 });
      const logged = await markLogin(user);
      const session = await createAccountSession(logged);
      const response = accountJson({ ok: true, user: toPublicAccount(logged), csrf: session.csrf });
      setSessionCookies(response, session.token, session.csrf);
      return response;
    }

    if (action === 'forgot_password') {
      const login = typeof parsed.data.login === 'string' ? parsed.data.login.trim() : '';
      if (!await rateLimit(`ratelimit:account-forgot:${ip}`, 8, 3600)) return accountJson({ error: 'Příliš mnoho požadavků. Zkuste to později.' }, { status: 429 });
      const user = login ? await findAccount(login) : null;
      if (user && await rateLimit(`ratelimit:account-forgot-user:${user.id}`, 3, 3600)) {
        await sendReset(user).catch(() => false);
      }
      return accountJson({ ok: true, message: 'Pokud účet existuje, odeslali jsme odkaz pro nastavení nového hesla.' });
    }

    if (action === 'verify_email') {
      const token = typeof parsed.data.token === 'string' ? parsed.data.token.trim() : '';
      const user = await verifyAccountEmail(token);
      if (!user) return accountJson({ error: 'Ověřovací odkaz je neplatný nebo vypršel.' }, { status: 400 });
      const session = await createAccountSession(user);
      const response = accountJson({ ok: true, user: toPublicAccount(user), csrf: session.csrf });
      setSessionCookies(response, session.token, session.csrf);
      return response;
    }

    if (action === 'reset_password') {
      const token = typeof parsed.data.token === 'string' ? parsed.data.token.trim() : '';
      const password = typeof parsed.data.password === 'string' ? parsed.data.password : '';
      const passwordError = validatePassword(password);
      if (passwordError) return accountJson({ error: passwordError }, { status: 400 });
      if (!await rateLimit(`ratelimit:account-reset:${ip}`, 10, 3600)) return accountJson({ error: 'Příliš mnoho pokusů. Zkuste to později.' }, { status: 429 });
      const user = await resetPasswordWithToken(token, password);
      if (!user) return accountJson({ error: 'Odkaz pro změnu hesla je neplatný nebo vypršel.' }, { status: 400 });
      const session = await createAccountSession(user);
      const response = accountJson({ ok: true, user: toPublicAccount(user), csrf: session.csrf });
      setSessionCookies(response, session.token, session.csrf);
      return response;
    }

    const current = await currentSession();
    if (!current) {
      const response = accountJson({ error: 'Nejste přihlášeni.' }, { status: 401 });
      clearSessionCookies(response);
      return response;
    }
    if (!csrfAllowed(req, current.resolved, current.csrf)) return accountJson({ error: 'Bezpečnostní relace vypršela. Obnovte stránku a zkuste to znovu.' }, { status: 403 });
    const user = current.resolved.user;

    if (action === 'logout') {
      const jar = await cookies();
      await revokeAccountSession(jar.get(accountSessionCookieName())?.value);
      const response = accountJson({ ok: true });
      clearSessionCookies(response);
      return response;
    }

    if (action === 'logout_all') {
      await revokeAllAccountSessions(user.id);
      const response = accountJson({ ok: true });
      clearSessionCookies(response);
      return response;
    }

    if (action === 'resend_verification') {
      if (user.emailVerifiedAt) return accountJson({ ok: true, alreadyVerified: true });
      if (!await rateLimit(`ratelimit:account-verify:${user.id}`, 3, 3600)) return accountJson({ error: 'Další ověřovací e-mail lze odeslat později.' }, { status: 429 });
      const emailSent = await sendVerification(user).catch(() => false);
      return accountJson({ ok: true, emailSent });
    }

    if (action === 'profile') {
      const username = typeof parsed.data.username === 'string' ? parsed.data.username : user.username;
      const displayName = typeof parsed.data.displayName === 'string' ? parsed.data.displayName : user.displayName;
      if (username.trim().toLowerCase() !== user.username.trim().toLowerCase()) {
        const currentPassword = typeof parsed.data.currentPassword === 'string' ? parsed.data.currentPassword : '';
        if (!await verifyPassword(currentPassword, user.passwordHash)) return accountJson({ error: 'Pro změnu uživatelského jména zadejte aktuální heslo.' }, { status: 403 });
      }
      const updated = await updateAccountProfile(user, { username, displayName });
      if (!updated.ok) return accountJson({ error: updated.message, field: updated.field }, { status: 409 });
      return accountJson({ ok: true, user: toPublicAccount(updated.user) });
    }

    if (action === 'change_password') {
      const currentPassword = typeof parsed.data.currentPassword === 'string' ? parsed.data.currentPassword : '';
      const newPassword = typeof parsed.data.newPassword === 'string' ? parsed.data.newPassword : '';
      if (!await verifyPassword(currentPassword, user.passwordHash)) return accountJson({ error: 'Aktuální heslo není správné.' }, { status: 403 });
      const passwordError = validatePassword(newPassword);
      if (passwordError) return accountJson({ error: passwordError }, { status: 400 });
      const updated = await setAccountPassword(user, newPassword);
      await revokeAllAccountSessions(user.id);
      const session = await createAccountSession(updated);
      const response = accountJson({ ok: true, user: toPublicAccount(updated), csrf: session.csrf });
      setSessionCookies(response, session.token, session.csrf);
      return response;
    }

    if (action === 'delete_account') {
      const password = typeof parsed.data.password === 'string' ? parsed.data.password : '';
      if (!await verifyPassword(password, user.passwordHash)) return accountJson({ error: 'Heslo není správné.' }, { status: 403 });
      await deleteAccount(user);
      const response = accountJson({ ok: true });
      clearSessionCookies(response);
      return response;
    }

    if (action === 'portal_link') {
      if (!user.emailVerifiedAt) return accountJson({ error: 'Nejprve ověřte e-mail účtu.' }, { status: 403 });
      const target = parsed.data.target;
      if (target === 'documents') {
        const ttl = await getActivePaidOrderTtl(user.email);
        if (ttl <= 0) return accountJson({ ok: true, available: false, fallback: '/zakaznicka-zona' });
        const token = await ensurePortalAccessToken(user.email, ttl);
        return accountJson({ ok: true, available: true, url: `/zakaznicka-zona#access=${encodeURIComponent(token)}` });
      }
      if (target === 'cases') {
        const cases = await listCasesForEmail(user.email, 1);
        if (cases.length === 0) return accountJson({ ok: true, available: false, fallback: '/moje-pripady' });
        const token = await issueCaseHubAccessToken(user.email);
        return accountJson({ ok: true, available: true, url: `/moje-pripady#access=${encodeURIComponent(token)}` });
      }
      return accountJson({ error: 'Neplatný cíl.' }, { status: 400 });
    }

    return accountJson({ error: 'Neznámá akce.' }, { status: 400 });
  } catch (error) {
    console.error('[account] request failed', error instanceof Error ? error.name : 'unknown');
    return accountJson({ error: 'Požadavek se nepodařilo bezpečně dokončit. Zkuste to znovu.' }, { status: 503 });
  }
}
