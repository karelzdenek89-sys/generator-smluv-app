'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import SiteHeader from '@/app/components/SiteHeader';

const FOREIGN_LOCALE_SEGMENTS = new Set(['en', 'ua']);

export default function RouteChrome() {
  const pathname = usePathname();
  const firstSegment = pathname.split('/')[1] ?? '';
  const isForeignLocale = FOREIGN_LOCALE_SEGMENTS.has(firstSegment);

  useEffect(() => {
    document.documentElement.lang = firstSegment === 'ua' ? 'uk' : firstSegment === 'en' ? 'en' : 'cs';
  }, [firstSegment]);

  const showSiteHeader =
    pathname !== '/' &&
    !isForeignLocale &&
    !pathname.startsWith('/success');

  return showSiteHeader ? <SiteHeader /> : null;
}
