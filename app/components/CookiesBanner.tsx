'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBuilderLocale } from '@/app/components/BuilderLocaleNotice';
import { getLocaleFromPathname, type AppLocale } from '@/lib/locale';
import {
  getProductAnalyticsConsent,
  setProductAnalyticsConsent,
} from '@/lib/analytics-attribution';

const COPY: Record<AppLocale, {
  ariaLabel: string;
  text: string;
  more: string;
  accept: string;
  reject: string;
}> = {
  cs: {
    ariaLabel: 'Informace o cookies',
    text: 'Technicky nezbytné prostředky a agregovaná Vercel Analytics fungují bez marketingových cookies. Jen s vaším souhlasem zapneme vlastní produktovou analytiku: zdroj držíme v prohlížeči nejvýše 30 minut; po vytvoření dokumentu se může uchovat s objednávkou po dobu její dostupnosti.',
    more: 'Více informací',
    accept: 'Povolit měření',
    reject: 'Jen nezbytné',
  },
  en: {
    ariaLabel: 'Cookie information',
    text: 'Strictly necessary features and aggregated Vercel Analytics work without marketing cookies. With your consent we enable first-party product analytics: the source stays in your browser for up to 30 minutes and, after document creation, may remain with the order while it is available.',
    more: 'More information',
    accept: 'Allow analytics',
    reject: 'Necessary only',
  },
  ua: {
    ariaLabel: 'Інформація про cookies',
    text: 'Технічно необхідні функції та агрегована Vercel Analytics працюють без маркетингових cookies. За вашою згодою джерело зберігається в браузері до 30 хвилин, а після створення документа може зберігатися із замовленням протягом строку його доступності.',
    more: 'Докладніше',
    accept: 'Дозволити аналітику',
    reject: 'Лише необхідне',
  },
};

export default function CookiesBanner() {
  const pathname = usePathname();
  const builderLocale = useBuilderLocale();
  const [visible, setVisible] = useState(false);
  const locale = getLocaleFromPathname(pathname, builderLocale);
  const copy = COPY[locale];

  useEffect(() => {
    const id = window.setTimeout(() => {
      setVisible(getProductAnalyticsConsent() === null);
    }, 0);

    return () => clearTimeout(id);
  }, []);

  const choose = (granted: boolean) => {
    setProductAnalyticsConsent(granted);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={copy.ariaLabel}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#1a1a1a] px-4 py-4 shadow-[0_-8px_32px_rgba(0,0,0,0.4)]"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
          {copy.text}{' '}
          <Link href="/gdpr" className="text-amber-400 underline underline-offset-2 transition hover:text-amber-300">
            {copy.more}
          </Link>
        </p>
        <div className="flex flex-shrink-0 flex-wrap gap-2">
          <button
            onClick={() => choose(false)}
            className="rounded-xl border border-white/15 bg-white/8 px-5 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:border-white/35 hover:bg-white/12"
          >
            {copy.reject}
          </button>
          <button
            onClick={() => choose(true)}
            className="rounded-xl border border-amber-500/60 bg-amber-500 px-5 py-2 text-xs font-black uppercase tracking-widest text-black transition hover:bg-amber-400"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
