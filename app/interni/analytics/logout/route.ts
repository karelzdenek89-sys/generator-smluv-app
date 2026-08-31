import { NextResponse } from 'next/server';
import {
  getInternalReportingCookieOptions,
  INTERNAL_REPORTING_COOKIE,
} from '@/lib/internal-reporting-auth';
import { readFirstPartyForm } from '@/lib/api-security';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const form = await readFirstPartyForm(request, 128);
  if (!form.ok) {
    return new NextResponse(null, { status: 403 });
  }
  const response = NextResponse.redirect(
    new URL('/interni/analytics/prihlaseni', request.url),
    303,
  );
  response.cookies.set(INTERNAL_REPORTING_COOKIE, '', {
    ...getInternalReportingCookieOptions(),
    maxAge: 0,
  });
  return response;
}
