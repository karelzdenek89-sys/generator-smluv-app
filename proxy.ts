import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  getLegacyLangRedirect,
  type PreferredPublicLocale,
} from '@/lib/seo/legacy-lang-query';

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

function setPreferredLocale(response: NextResponse, locale: PreferredPublicLocale) {
  response.cookies.set('preferred-locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  });
  response.headers.set('x-preferred-locale', locale);
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

  // Public language variants use path segments (/en, /ua), not indexable query
  // URLs. Persist a valid preference and redirect to the same URL without
  // `lang`; preserve unrelated parameters such as `package`.
  // `/success` is intentionally excluded because `lang` is transactional data
  // used to select the purchased document download.
  const legacyLangRedirect = getLegacyLangRedirect(pathname, request.nextUrl.searchParams);
  if (legacyLangRedirect) {
    const url = request.nextUrl.clone();
    url.search = legacyLangRedirect.search;
    const redirect = NextResponse.redirect(url, 308);
    if (legacyLangRedirect.preferredLocale) {
      setPreferredLocale(redirect, legacyLangRedirect.preferredLocale);
    }
    return redirect;
  }

  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);

  // 1) Explicit foreign-landing visit → store preference for builder banners.
  for (const seg of ACTIVE_LOCALE_SEGMENTS) {
    if (pathname === `/${seg}` || pathname.startsWith(`/${seg}/`)) {
      setPreferredLocale(response, seg);
      return response;
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico|txt|xml|woff2?)).*)'],
};
