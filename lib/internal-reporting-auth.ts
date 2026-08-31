import { createHmac, timingSafeEqual } from 'node:crypto';

const INTERNAL_REPORTING_COOKIE_BASE = 'sh_internal_reporting';
const DEFAULT_INTERNAL_REPORTING_COOKIE_VERSION = 'v3';
const DEFAULT_INTERNAL_REPORTING_ADMIN_EMAIL = 'karelzdenek89@gmail.com';
const DEFAULT_INTERNAL_REPORTING_SESSION_SECONDS = 60 * 60 * 12;

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
  const prefix = process.env.NODE_ENV === 'production' ? '__Host-' : '';
  return `${prefix}${INTERNAL_REPORTING_COOKIE_BASE}_${normalizedVersion}`;
}

export const INTERNAL_REPORTING_COOKIE = getInternalReportingCookieName();

export function normalizeReportingEmail(value: string | undefined) {
  return value?.trim().toLowerCase() ?? '';
}

export function getInternalReportingAdminEmail() {
  return normalizeReportingEmail(
    process.env.INTERNAL_REPORTING_ADMIN_EMAIL || DEFAULT_INTERNAL_REPORTING_ADMIN_EMAIL,
  );
}

export function reportingEmailMatches(expected: string | undefined, provided: string | undefined) {
  const normalizedExpected = normalizeReportingEmail(expected);
  const normalizedProvided = normalizeReportingEmail(provided);
  if (!normalizedExpected || !normalizedProvided) return false;
  const a = Buffer.from(normalizedProvided);
  const b = Buffer.from(normalizedExpected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function reportingSessionSeconds() {
  const parsed = Number.parseInt(process.env.INTERNAL_REPORTING_SESSION_SECONDS ?? '', 10);
  if (!Number.isFinite(parsed)) return DEFAULT_INTERNAL_REPORTING_SESSION_SECONDS;
  return Math.min(Math.max(parsed, 60 * 15), 60 * 60 * 24);
}

function cookieSignature(secret: string, payload: string) {
  return createHmac('sha256', secret)
    .update(`${cookieTokenScope()}:${payload}`)
    .digest('base64url');
}

export function createInternalReportingCookieValue(
  secret: string,
  email = getInternalReportingAdminEmail(),
  issuedAt = Date.now(),
) {
  const normalizedEmail = normalizeReportingEmail(email);
  const payload = `${Buffer.from(normalizedEmail).toString('base64url')}.${issuedAt}`;
  return `${payload}.${cookieSignature(secret, payload)}`;
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
  const normalized = normalizeReportingSecretParam(provided);
  if (!normalized) return false;
  const a = Buffer.from(normalized);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isValidInternalReportingCookie(
  secret: string | undefined,
  value: string | undefined,
  expectedEmail = getInternalReportingAdminEmail(),
  now = Date.now(),
) {
  if (!secret || !value) return false;

  const parts = value.split('.');
  if (parts.length !== 3) return false;
  const [encodedEmail, rawIssuedAt, providedSignature] = parts;
  const issuedAt = Number(rawIssuedAt);
  if (!Number.isSafeInteger(issuedAt)) return false;
  const ageMs = now - issuedAt;
  if (ageMs < -60_000 || ageMs > reportingSessionSeconds() * 1000) return false;

  let email: string;
  try {
    email = Buffer.from(encodedEmail, 'base64url').toString('utf8');
  } catch {
    return false;
  }
  if (!reportingEmailMatches(expectedEmail, email)) return false;

  const expectedSignature = cookieSignature(secret, `${encodedEmail}.${rawIssuedAt}`);
  const a = Buffer.from(providedSignature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length) return false;

  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function getInternalReportingCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: reportingSessionSeconds(),
  };
}
