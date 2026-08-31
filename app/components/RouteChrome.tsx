'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import SiteHeader from '@/app/components/SiteHeader';
import {
  getContractTypeByPath,
  isExpatContract,
  normalizeLocale,
} from '@/lib/locale';

const FOREIGN_LOCALE_SEGMENTS = new Set(['en', 'ua']);

function subscribeToLocation(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener('pageshow', callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('pageshow', callback);
  };
}

function getQueryLocaleSnapshot(): 'en' | 'ua' | null {
  const pathname = window.location.pathname.replace(/\/$/, '');
  const raw = new URLSearchParams(window.location.search).get('lang');
  if (pathname === '/zakaznicka-zona') {
    const normalized = raw ? normalizeLocale(raw) : 'cs';
    return normalized === 'en' || normalized === 'ua' ? normalized : null;
  }
  const contractType = getContractTypeByPath(window.location.pathname);
  if (!contractType || !isExpatContract(contractType)) return null;
  const normalized = raw ? normalizeLocale(raw) : 'cs';
  return normalized === 'en' || normalized === 'ua' ? normalized : null;
}

export default function RouteChrome() {
  const pathname = usePathname();
  const firstSegment = pathname.split('/')[1] ?? '';
  const isForeignLocaleSegment = FOREIGN_LOCALE_SEGMENTS.has(firstSegment);
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
      : queryLocale === 'ua'
        ? 'uk'
        : queryLocale ?? 'cs';
    document.documentElement.lang = htmlLang;
  }, [firstSegment, isForeignLocaleSegment, queryLocale]);

  const showSiteHeader =
    pathname !== '/' &&
    !isForeignLocaleSegment &&
    !queryLocale &&
    !pathname.startsWith('/success');

  return showSiteHeader ? <SiteHeader /> : null;
}
