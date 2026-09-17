'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import SiteHeader from '@/app/components/SiteHeader';
import {
  getContractTypeByPath,
  getLocaleFromPathname,
  isExpatContract,
  normalizeLocale,
} from '@/lib/locale';

function subscribeToLocation(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener('pageshow', callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('pageshow', callback);
  };
}

function getQueryLocaleSnapshot(): 'en' | 'ua' | null {
  const pathname = window.location.pathname;
  const contractType = getContractTypeByPath(pathname);
  if ((!contractType || !isExpatContract(contractType)) && pathname !== '/zakaznicka-zona') return null;
  const raw = new URLSearchParams(window.location.search).get('lang');
  const normalized = raw ? normalizeLocale(raw) : 'cs';
  return normalized === 'en' || normalized === 'ua' ? normalized : null;
}

export default function RouteChrome() {
  const pathname = usePathname();
  const queryLocale = useSyncExternalStore(subscribeToLocation, getQueryLocaleSnapshot, () => null);
  const locale = getLocaleFromPathname(pathname, queryLocale ?? 'cs');

  useEffect(() => {
    document.documentElement.lang = locale === 'ua' ? 'uk' : locale;
  }, [locale]);

  // Private post-purchase surfaces deliberately render without the global Czech
  // header. This prevents a foreign-language customer from landing under Czech
  // navigation even when an older purchase e-mail did not carry ?lang=.
  const privateSurface = pathname === '/zakaznicka-zona' || pathname.startsWith('/success');
  const showSiteHeader = pathname !== '/' && locale === 'cs' && !privateSurface;

  return showSiteHeader ? <SiteHeader /> : null;
}
