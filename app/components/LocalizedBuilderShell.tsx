'use client';

import type { ReactNode } from 'react';
import { BuilderLocaleProvider } from '@/app/components/BuilderLocaleNotice';
import { LocalizedFooter } from '@/app/components/Footer';
import type { AppLocale } from '@/lib/locale';

export default function LocalizedBuilderShell({
  initialLocale,
  children,
}: {
  initialLocale: AppLocale;
  children: ReactNode;
}) {
  const isForeign = initialLocale === 'en' || initialLocale === 'ua';

  return (
    <BuilderLocaleProvider initialLocale={initialLocale}>
      <div
        className="contents"
        data-localized-builder-shell={isForeign ? initialLocale : undefined}
      >
        {children}
        {isForeign ? <LocalizedFooter locale={initialLocale} /> : null}
      </div>
    </BuilderLocaleProvider>
  );
}
