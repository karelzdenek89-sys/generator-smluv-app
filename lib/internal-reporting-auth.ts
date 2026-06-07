import { createHmac, timingSafeEqual } from 'node:crypto';

const INTERNAL_REPORTING_COOKIE_BASE = 'sh_internal_reporting';
const DEFAULT_INTERNAL_REPORTING_COOKIE_VERSION = 'v2';

function reportingCookieVersion() {
  return (
    process.env.INTERNAL_REPORTING_COOKIE_VERSION?.trim() ||
    DEFAULT_INTERNAL_REPORTING_COOKIE_VERSION
  );
}

function cookieTokenScope() {
  const rotationSalt = process.env.INTERNAL_REPORTING_COOKIE_SALT?.trim();
  return [
    'smlouvahned-internal-reporting',
    reportingCookieVersion(),
    rotationSalt || 'default',
  ].join(':');
}

export function getInternalReportingCookieName() {
  const normalizedVersion = reportingCookieVersion().replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${INTERNAL_REPORTING_COOKIE_BASE}_${normalizedVersion}`;
}

export const INTERNAL_REPORTING_COOKIE = getInternalReportingCookieName();

function cookieToken(secret: string) {
  return createHmac('sha256', secret).update(cookieTokenScope()).digest('base64url');
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
