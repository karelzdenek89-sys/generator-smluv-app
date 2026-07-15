import { NextResponse } from 'next/server';
import {
  createInternalReportingCookieValue,
  getInternalReportingCookieOptions,
  INTERNAL_REPORTING_COOKIE,
  normalizeReportingSecretParam,
  reportingSecretMatches,
} from '@/lib/internal-reporting-auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const expectedSecret = process.env.INTERNAL_REPORTING_SECRET;
  const url = new URL(request.url);
  const formData = await request.formData();
  const rawSecret = formData.get('secret');
  const providedSecret = normalizeReportingSecretParam(
    typeof rawSecret === 'string' ? rawSecret : undefined,
  );

  if (!expectedSecret || !reportingSecretMatches(expectedSecret, providedSecret)) {
    return new NextResponse(null, { status: 404 });
  }

  const redirectUrl = new URL('/interni/analytics', url.origin);
  const response = NextResponse.redirect(redirectUrl, 303);

  response.cookies.set(
    INTERNAL_REPORTING_COOKIE,
    createInternalReportingCookieValue(expectedSecret),
    getInternalReportingCookieOptions(),
  );

  return response;
}
