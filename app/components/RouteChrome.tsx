'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import SiteHeader from '@/app/components/SiteHeader';
import { normalizeLocale } from '@/lib/locale';

const FOREIGN_LOCALE_SEGMENTS = new Set(['en', 'ua']);

function subscribeToLocation(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener('pageshow', callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('pageshow', callback);
  };
}

/** Locale chosen via ?lang= on builder pages (en/ua), else null. */
function getQueryLocaleSnapshot(): 'en' | 'ua' | null {
  const raw = new URLSearchParams(window.location.search).get('lang');
  const normalized = raw ? normalizeLocale(raw) : 'cs';
  return normalized === 'en' || normalized === 'ua' ? normalized : null;
}

export default function RouteChrome() {
  const pathname = usePathname();
  const firstSegment = pathname.split('/')[1] ?? '';
  const isForeignLocaleSegment = FOREIGN_LOCALE_SEGMENTS.has(firstSegment);

  // useSyncExternalStore keeps the ?lang read hydration-safe (server snapshot = null,
  // matching the path-only first paint) without useSearchParams / setState-in-effect.
  const queryLocale = useSyncExternalStore(
    subscribeToLocation,
    getQueryLocaleSnapshot,
    () => null,
  );

  useEffect(() => {
    const htmlLang = isForeignLocaleSegment
      ? firstSegment === 'ua'
        ? 'uk'
        : 'en'
      : queryLocale
        ? queryLocale === 'ua'
          ? 'uk'
          : 'en'
        : 'cs';
    document.documentElement.lang = htmlLang;
  }, [firstSegment, isForeignLocaleSegment, queryLocale]);

  const showSiteHeader =
    pathname !== '/' &&
    !isForeignLocaleSegment &&
    !queryLocale &&
    !pathname.startsWith('/success');

  return showSiteHeader ? <SiteHeader /> : null;
}
