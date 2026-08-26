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
  const contractType = getContractTypeByPath(window.location.pathname);
  if (!contractType || !isExpatContract(contractType)) return null;
  const raw = new URLSearchParams(window.location.search).get('lang');
  const normalized = raw ? normalizeLocale(raw) : 'cs';
  return normalized === 'en' || normalized === 'ua' ? normalized : null;
}

export default function RouteChrome() {
  const pathname = usePathname();
  const queryLocale = useSyncExternalStore(
    subscribeToLocation,
    getQueryLocaleSnapshot,
    () => null,
  );
  const locale = getLocaleFromPathname(pathname, queryLocale ?? 'cs');
  const isForeignLocale = locale !== 'cs';

  useEffect(() => {
    document.documentElement.lang = locale === 'ua' ? 'uk' : locale;
  }, [locale]);

  const showSiteHeader =
    pathname !== '/' &&
    !isForeignLocale &&
    !pathname.startsWith('/success');

  return showSiteHeader ? <SiteHeader /> : null;
}
