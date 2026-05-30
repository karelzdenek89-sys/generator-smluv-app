import { createHmac, timingSafeEqual } from 'node:crypto';

export const INTERNAL_REPORTING_COOKIE = 'sh_internal_reporting';

function cookieToken(secret: string) {
  return createHmac('sha256', secret).update('smlouvahned-internal-reporting-v1').digest('base64url');
}

export function createInternalReportingCookieValue(secret: string) {
  return cookieToken(secret);
}

export function normalizeReportingSecretParam(value: string | undefined) {
  if (!value) return undefined;
  // V query stringu se '+' často dekóduje jako mezera.
  return value.trim().replace(/ /g, '+');
}

export function reportingSecretMatches(
  expected: string | undefined,
  provided: string | undefined,
) {
  if (!expected || !provided) return false;
  return normalizeReportingSecretParam(provided) === expected;
}

export function isValidInternalReportingCookie(secret: string | undefined, value: string | undefined) {
  if (!secret || !value) return false;

  const expected = cookieToken(secret);
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function getInternalReportingCookieOptions() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const useSharedDomain =
    process.env.NODE_ENV === 'production' && baseUrl.includes('smlouvahned.cz');

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/interni',
    maxAge: 60 * 60 * 24 * 30,
    ...(useSharedDomain ? { domain: '.smlouvahned.cz' } : {}),
  };
}
