'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import SiteHeader from '@/app/components/SiteHeader';
import {
  getContractTypeByPath,
  isExpatContract,
  normalizeLocale,
} from '@/lib/locale';

const FOREIGN_LOCALE_SEGMENTS = new Set(['en', 'ua']);

function BuilderRouteChrome() {
  const searchParams = useSearchParams();
  const raw = searchParams.get('lang');
  const normalized = raw ? normalizeLocale(raw) : 'cs';
  const queryLocale = normalized === 'en' || normalized === 'ua' ? normalized : null;

  useEffect(() => {
    document.documentElement.lang = queryLocale === 'ua' ? 'uk' : queryLocale ?? 'cs';
  }, [queryLocale]);

  return queryLocale ? null : <SiteHeader />;
}

export default function RouteChrome() {
  const pathname = usePathname();
  const firstSegment = pathname.split('/')[1] ?? '';
  const isForeignLocaleSegment = FOREIGN_LOCALE_SEGMENTS.has(firstSegment);
  const contractType = getContractTypeByPath(pathname);
  const isLocalizedBuilder = Boolean(contractType && isExpatContract(contractType));

  useEffect(() => {
    if (isForeignLocaleSegment) {
      document.documentElement.lang = firstSegment === 'ua' ? 'uk' : 'en';
    } else if (!isLocalizedBuilder) {
      document.documentElement.lang = 'cs';
    }
  }, [firstSegment, isForeignLocaleSegment, isLocalizedBuilder]);

  if (pathname === '/' || isForeignLocaleSegment || pathname.startsWith('/success')) {
    return null;
  }

  if (isLocalizedBuilder) {
    return (
      <Suspense fallback={<SiteHeader />}>
        <BuilderRouteChrome />
      </Suspense>
    );
  }

  return <SiteHeader />;
}
