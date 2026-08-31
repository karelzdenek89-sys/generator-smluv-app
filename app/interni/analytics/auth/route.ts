import { NextResponse } from 'next/server';
import {
  createInternalReportingCookieValue,
  getInternalReportingAdminEmail,
  getInternalReportingCookieOptions,
  INTERNAL_REPORTING_COOKIE,
  normalizeReportingSecretParam,
  normalizeReportingEmail,
  reportingEmailMatches,
  reportingSecretMatches,
} from '@/lib/internal-reporting-auth';
import { getClientIp, readFirstPartyForm } from '@/lib/api-security';
import { takeRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const expectedSecret = process.env.INTERNAL_REPORTING_SECRET;
  const expectedEmail = getInternalReportingAdminEmail();
  const url = new URL(request.url);
  const form = await readFirstPartyForm(request, 4 * 1024);
  if (!form.ok) {
    return NextResponse.redirect(new URL('/interni/analytics/prihlaseni?error=invalid', url.origin), 303);
  }
  const rawSecret = form.data.get('secret');
  const rawEmail = form.data.get('email');
  const providedSecret = normalizeReportingSecretParam(
    typeof rawSecret === 'string' ? rawSecret : undefined,
  );
  const providedEmail = normalizeReportingEmail(
    typeof rawEmail === 'string' ? rawEmail : undefined,
  );

  try {
    const rateLimit = await takeRateLimit(
      `ratelimit:internal-reporting-login:${getClientIp(request)}`,
      8,
      60 * 15,
    );
    if (!rateLimit.allowed) {
      return NextResponse.redirect(new URL('/interni/analytics/prihlaseni?error=rate', url.origin), 303);
    }
  } catch (error) {
    console.error('[internal-reporting] Rate-limit unavailable:', error);
    return NextResponse.redirect(new URL('/interni/analytics/prihlaseni?error=unavailable', url.origin), 303);
  }

  if (
    !expectedSecret ||
    !reportingEmailMatches(expectedEmail, providedEmail) ||
    !reportingSecretMatches(expectedSecret, providedSecret)
  ) {
    return NextResponse.redirect(new URL('/interni/analytics/prihlaseni?error=invalid', url.origin), 303);
  }

  const redirectUrl = new URL('/interni/analytics', url.origin);
  const response = NextResponse.redirect(redirectUrl, 303);

  response.cookies.set(
    INTERNAL_REPORTING_COOKIE,
    createInternalReportingCookieValue(expectedSecret, expectedEmail),
    getInternalReportingCookieOptions(),
  );

  return response;
}
