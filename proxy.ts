import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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
]);

const CZECH_ONLY_BUILDER_PATHS = new Set([
  '/darovaci',
  '/smlouva-o-dilo',
  '/pujcka',
  '/nda',
  '/kupni',
  '/sluzby',
  '/uznani-dluhu',
  '/spoluprace',
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

  const langQuery = request.nextUrl.searchParams.get('lang')?.trim().toLowerCase();
  const normalizedQueryLocale =
    langQuery === 'en'
      ? 'en'
      : langQuery === 'ua' || langQuery === 'uk' || langQuery === 'ukr'
        ? 'ua'
        : null;

  // Czech-only builders never combine a translated notice or marketing block
  // with a Czech form. Keep attribution/package parameters and drop only the
  // unsupported language selector.
  if (normalizedQueryLocale && CZECH_ONLY_BUILDER_PATHS.has(pathname)) {
    const url = request.nextUrl.clone();
    url.searchParams.delete('lang');
    return NextResponse.redirect(url, 307);
  }

  const response = NextResponse.next();
  const firstSegment = pathname.split('/')[1] ?? '';
  const builderLanguage = LOCALIZED_BUILDER_PATHS.has(pathname)
    ? normalizedQueryLocale
    : null;
  response.headers.set(
    'Content-Language',
    firstSegment === 'ua' || builderLanguage === 'ua'
      ? 'uk'
      : firstSegment === 'en' || builderLanguage === 'en'
        ? 'en'
        : 'cs',
  );

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico|txt|xml|woff2?)).*)'],
};
