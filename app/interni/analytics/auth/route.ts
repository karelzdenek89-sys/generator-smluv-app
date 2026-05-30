import { NextResponse } from 'next/server';
import {
  createInternalReportingCookieValue,
  getInternalReportingCookieOptions,
  INTERNAL_REPORTING_COOKIE,
  normalizeReportingSecretParam,
  reportingSecretMatches,
} from '@/lib/internal-reporting-auth';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const expectedSecret = process.env.INTERNAL_REPORTING_SECRET;
  const url = new URL(request.url);
  const providedSecret = normalizeReportingSecretParam(url.searchParams.get('secret') ?? undefined);

  if (!expectedSecret || !reportingSecretMatches(expectedSecret, providedSecret)) {
    return new NextResponse(null, { status: 404 });
  }

  const redirectUrl = new URL('/interni/analytics', url.origin);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set(
    INTERNAL_REPORTING_COOKIE,
    createInternalReportingCookieValue(expectedSecret),
    getInternalReportingCookieOptions(),
  );

  return response;
}
