import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const FOREIGN_SEGMENTS = ['en', 'uk', 'ru', 'vn', 'de'] as const;
type ForeignSeg = (typeof FOREIGN_SEGMENTS)[number];

/**
 * Aliases for foreign-locale URL segments. The Vietnamese ISO code is `vi`
 * (BCP-47) so search engines and direct links may use `/vi/...`. We canonicalise
 * everything to `/vn/...` to match our routing tree, via a 308 permanent redirect.
 */
const SEGMENT_ALIASES: Record<string, ForeignSeg> = {
  vi: 'vn',
};

/** Map an Accept-Language primary tag to one of our supported segments. */
function inferLocaleFromAcceptLanguage(header: string | null): ForeignSeg | null {
  if (!header) return null;
  const langs = header.split(',').map(p => {
    const [tag, q = 'q=1'] = p.trim().split(';');
    return { tag: tag.toLowerCase(), q: parseFloat(q.replace('q=', '')) || 1 };
  }).sort((a, b) => b.q - a.q);

  for (const { tag } of langs) {
    if (tag.startsWith('cs')) return null; // Czech speaker — no banner needed
    if (tag.startsWith('en')) return 'en';
    if (tag.startsWith('uk')) return 'uk';
    if (tag.startsWith('ru')) return 'ru';
    if (tag.startsWith('vi') || tag.startsWith('vn')) return 'vn';
    if (tag.startsWith('de')) return 'de';
  }
  return null;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 0) Permanent redirect from aliased segments to canonical ones, e.g. /vi → /vn.
  //    Done first so search-engine signals consolidate on a single URL.
  for (const [alias, canonical] of Object.entries(SEGMENT_ALIASES)) {
    if (pathname === `/${alias}` || pathname.startsWith(`/${alias}/`)) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(`/${alias}`, `/${canonical}`);
      return NextResponse.redirect(url, 308);
    }
  }

  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);

  // 1) Explicit foreign-landing visit → store the preference for future pages.
  for (const seg of FOREIGN_SEGMENTS) {
    if (pathname === `/${seg}` || pathname.startsWith(`/${seg}/`)) {
      response.cookies.set('preferred-locale', seg, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      });
      return response;
    }
  }

  // 2) No explicit cookie yet → fall back to Accept-Language detection so
  //    foreign visitors who reach a Czech builder directly still see the
  //    bilingual-PDF explainer banner in their language.
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
