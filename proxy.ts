import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Supported public locale URL segments (expat product). */
const ACTIVE_LOCALE_SEGMENTS = ['en', 'ua'] as const;

/** Retired segments → canonical expat landing (308). */
const RETIRED_LOCALE_REDIRECTS: Record<string, string> = {
  vi: '/en',
  vn: '/en',
  ru: '/en',
  de: '/en',
  uk: '/ua',
};

const LOCALIZED_BUILDER_PATHS = new Set([
  '/najem',
  '/pracovni',
  '/dpp',
  '/podnajem',
  '/plna-moc',
  '/auto',
  '/darovaci',
]);

/** Apex domain — canonical public host is www (matches sitemap, metadata, robots.txt). */
const APEX_HOST = 'smlouvahned.cz';
const CANONICAL_HOST = 'www.smlouvahned.cz';

function redirectPermanent(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, 308);
}

function redirectToCanonicalHost(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.protocol = 'https:';
  url.host = CANONICAL_HOST;
  return NextResponse.redirect(url, 308);
}

function rewritePathSegment(pathname: string, fromSeg: string, toSeg: string): string {
  if (pathname === `/${fromSeg}`) return `/${toSeg}`;
  if (pathname.startsWith(`/${fromSeg}/`)) {
    return pathname.replace(`/${fromSeg}`, `/${toSeg}`);
  }
  return pathname;
}

export function proxy(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]?.toLowerCase();
  if (host === APEX_HOST) {
    return redirectToCanonicalHost(request);
  }

  const pathname = request.nextUrl.pathname;

  // 0) Retired locale segments → canonical /en or /ua (incl. nested paths).
  for (const [seg, target] of Object.entries(RETIRED_LOCALE_REDIRECTS)) {
    if (pathname === `/${seg}` || pathname.startsWith(`/${seg}/`)) {
      const canonicalSeg = target.replace('/', '');
      const nextPath = rewritePathSegment(pathname, seg, canonicalSeg);
      return redirectPermanent(request, nextPath);
    }
  }

  const response = NextResponse.next();
  const firstSegment = pathname.split('/')[1] ?? '';
  response.headers.set(
    'Content-Language',
    firstSegment === 'ua' ? 'uk' : firstSegment === 'en' ? 'en' : 'cs',
  );

  const langQuery = request.nextUrl.searchParams.get('lang')?.trim().toLowerCase();
  if (langQuery) {
    const preferred =
      langQuery === 'cs' || langQuery === 'en'
        ? langQuery
        : langQuery === 'ua' || langQuery === 'uk' || langQuery === 'ukr'
          ? 'ua'
          : null;
    if (preferred) {
      response.cookies.set('preferred-locale', preferred, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      });
      response.headers.set('x-preferred-locale', preferred);
      return response;
    }
  }

  // 1) Explicit foreign-landing visit → store preference for builder banners.
  for (const seg of ACTIVE_LOCALE_SEGMENTS) {
    if (pathname === `/${seg}` || pathname.startsWith(`/${seg}/`)) {
      response.cookies.set('preferred-locale', seg, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      });
      return response;
    }
  }

  // 2) Czech builder URLs reset stale foreign preferences. Avoid setting
  // locale cookies on every marketing/blog page so public pages stay cacheable.
  if (LOCALIZED_BUILDER_PATHS.has(pathname)) {
    response.cookies.set('preferred-locale', 'cs', {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    });
    response.headers.set('x-preferred-locale', 'cs');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico|txt|xml|woff2?)).*)'],
};
