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
    ariaLabel: 'Nastavení měření',
    text: 'Volitelné měření návštěvnosti používáme jen s vaším souhlasem. Nezbytné funkce webu běží vždy.',
    more: 'Více informací',
    accept: 'Povolit měření',
    reject: 'Jen nezbytné',
  },
  en: {
    ariaLabel: 'Analytics settings',
    text: 'Optional product analytics are used only with your consent. Essential website features always remain active.',
    more: 'More information',
    accept: 'Allow analytics',
    reject: 'Necessary only',
  },
  ua: {
    ariaLabel: 'Налаштування аналітики',
    text: 'Необов’язкову аналітику ми використовуємо лише за вашою згодою. Необхідні функції сайту працюють завжди.',
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
  const privacyHref = locale === 'cs' ? '/gdpr' : `/${locale}/privacy`;

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

  const buttonClass =
    'min-h-10 rounded-xl border border-white/18 bg-white/[0.055] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-100 transition hover:border-[#c9a852]/45 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d092]/70';

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={copy.ariaLabel}
      className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-4xl rounded-2xl border border-white/12 bg-[#0b0f17]/95 px-4 py-3.5 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:px-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-[11px] leading-5 text-slate-300 sm:text-xs">
          {copy.text}{' '}
          <Link href={privacyHref} className="font-semibold text-[#e8d092] underline underline-offset-2 transition hover:text-white">
            {copy.more}
          </Link>
        </p>
        <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:min-w-[300px]">
          <button onClick={() => choose(false)} className={buttonClass}>
            {copy.reject}
          </button>
          <button onClick={() => choose(true)} className={buttonClass}>
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
