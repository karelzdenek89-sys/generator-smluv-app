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
    text: 'Nezbytné prostředky zajišťují fungování webu. S vaším souhlasem zapneme vlastní produktovou analytiku pro měření používání služby a zdroje návštěvy.',
    more: 'Podrobnosti',
    accept: 'Povolit měření',
    reject: 'Jen nezbytné',
  },
  en: {
    ariaLabel: 'Cookie information',
    text: 'Necessary technologies keep the site working. With your consent, we enable first-party product analytics to measure use of the service and visit source.',
    more: 'Details',
    accept: 'Allow analytics',
    reject: 'Necessary only',
  },
  ua: {
    ariaLabel: 'Інформація про cookies',
    text: 'Необхідні технології забезпечують роботу сайту. За вашою згодою ми вмикаємо власну продуктову аналітику для вимірювання використання сервісу та джерела відвідування.',
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
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 py-3 sm:px-4"
    >
      <div className="pointer-events-auto mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border border-white/12 bg-[#111723]/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,.35)] backdrop-blur-xl sm:flex-row sm:items-center sm:gap-5 sm:px-5">
        <p className="flex-1 text-[11px] leading-5 text-slate-300 sm:text-xs">
          {copy.text}{' '}
          <Link href="/gdpr" className="font-semibold text-[#d8bd73] underline decoration-[#d8bd73]/35 underline-offset-2 transition hover:text-[#f0d992]">
            {copy.more}
          </Link>
        </p>
        <div className="grid w-full shrink-0 grid-cols-2 gap-2 sm:w-auto">
          <button
            onClick={() => choose(false)}
            className="rounded-xl border border-white/18 bg-white/[0.045] px-4 py-2.5 text-[11px] font-bold text-slate-100 transition hover:border-white/30 hover:bg-white/[0.07]"
          >
            {copy.reject}
          </button>
          <button
            onClick={() => choose(true)}
            className="rounded-xl border border-[#d8bd73]/35 bg-[#d8bd73]/[0.07] px-4 py-2.5 text-[11px] font-bold text-[#f2e7c8] transition hover:border-[#d8bd73]/55 hover:bg-[#d8bd73]/[0.11]"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
