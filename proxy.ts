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

function redirectPermanent(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, 308);
}

function rewritePathSegment(pathname: string, fromSeg: string, toSeg: string): string {
  if (pathname === `/${fromSeg}`) return `/${toSeg}`;
  if (pathname.startsWith(`/${fromSeg}/`)) {
    return pathname.replace(`/${fromSeg}`, `/${toSeg}`);
  }
  return pathname;
}

/** Map an Accept-Language primary tag to one of our supported segments. */
function inferLocaleFromAcceptLanguage(header: string | null): 'en' | 'ua' | null {
  if (!header) return null;
  const langs = header.split(',').map((p) => {
    const [tag, q = 'q=1'] = p.trim().split(';');
    return { tag: tag.toLowerCase(), q: parseFloat(q.replace('q=', '')) || 1 };
  }).sort((a, b) => b.q - a.q);

  for (const { tag } of langs) {
    if (tag.startsWith('cs')) return null;
    if (tag.startsWith('en')) return 'en';
    if (tag.startsWith('uk')) return 'ua';
  }
  return null;
}

export function proxy(request: NextRequest) {
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
  response.headers.set('x-pathname', pathname);

  const langQuery = request.nextUrl.searchParams.get('lang')?.trim().toLowerCase();
  if (langQuery) {
    const preferred =
      langQuery === 'en'
        ? 'en'
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

  // 2) Accept-Language fallback when no cookie yet.
  if (!request.cookies.get('preferred-locale')) {
    const inferred = inferLocaleFromAcceptLanguage(request.headers.get('accept-language'));
    if (inferred) {
      response.cookies.set('preferred-locale', inferred, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      });
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico|txt|xml|woff2?)).*)'],
};
