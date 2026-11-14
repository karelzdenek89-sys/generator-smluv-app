'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useBuilderLocale } from '@/app/components/BuilderLocaleNotice';
import { getLocaleFromPathname, type AppLocale } from '@/lib/locale';
import { privacyHref } from '@/lib/legal/links';
import { isGoogleAnalyticsConfigured } from '@/lib/google-analytics';
import {
  getAnalyticsConsent,
  setProductAnalyticsConsent,
  subscribeToCookieSettingsRequest,
} from '@/lib/analytics-attribution';

type BannerCopy = {
  ariaLabel: string;
  text: string;
  /** Text lišty, když je zapnuté Google Analytics 4 (NEXT_PUBLIC_GA_MEASUREMENT_ID). */
  textWithGoogleAnalytics: string;
  more: string;
  accept: string;
  reject: string;
};

const COPY: Record<AppLocale, BannerCopy> = {
  cs: {
    ariaLabel: 'Informace o cookies',
    text: 'Nezbytné prostředky zajišťují fungování webu. S vaším souhlasem zapneme vlastní produktovou analytiku pro měření používání služby a zdroje návštěvy.',
    textWithGoogleAnalytics: 'Nezbytné prostředky zajišťují fungování webu. S vaším souhlasem zapneme analytiku: vlastní produktové měření a Google Analytics 4, které ukládá cookies a údaje o návštěvě předává společnosti Google. Reklamní funkce nepoužíváme.',
    more: 'Podrobnosti',
    accept: 'Přijmout analytiku',
    reject: 'Odmítnout',
  },
  en: {
    ariaLabel: 'Cookie information',
    text: 'Necessary technologies keep the site working. With your consent, we enable first-party product analytics to measure use of the service and visit source.',
    textWithGoogleAnalytics: 'Necessary technologies keep the site working. With your consent, we enable analytics: our first-party product measurement and Google Analytics 4, which sets cookies and shares visit data with Google. We use no advertising features.',
    more: 'Details',
    accept: 'Accept analytics',
    reject: 'Reject',
  },
  ua: {
    ariaLabel: 'Інформація про cookies',
    text: 'Необхідні технології забезпечують роботу сайту. За вашою згодою ми вмикаємо власну продуктову аналітику для вимірювання використання сервісу та джерела відвідування.',
    textWithGoogleAnalytics: 'Необхідні технології забезпечують роботу сайту. За вашою згодою ми вмикаємо аналітику: власне продуктове вимірювання та Google Analytics 4, який зберігає cookie і передає дані про відвідування компанії Google. Рекламні функції ми не використовуємо.',
    more: 'Докладніше',
    accept: 'Прийняти аналітику',
    reject: 'Відхилити',
  },
};

const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8bd73]';

export default function CookiesBanner() {
  const pathname = usePathname();
  const builderLocale = useBuilderLocale();
  const [visible, setVisible] = useState(false);
  const focusOnOpen = useRef(false);
  const firstButton = useRef<HTMLButtonElement>(null);
  const locale = getLocaleFromPathname(pathname, builderLocale);
  const copy = COPY[locale];
  const text = isGoogleAnalyticsConfigured() ? copy.textWithGoogleAnalytics : copy.text;

  useEffect(() => {
    const id = window.setTimeout(() => {
      setVisible(getAnalyticsConsent() === null);
    }, 0);

    const unsubscribe = subscribeToCookieSettingsRequest(() => {
      focusOnOpen.current = true;
      setVisible(true);
    });

    return () => {
      clearTimeout(id);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (visible && focusOnOpen.current) {
      focusOnOpen.current = false;
      firstButton.current?.focus();
    }
  }, [visible]);

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
      <div className="pointer-events-auto mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl border border-white/12 bg-[#111723] px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,.35)] sm:flex-row sm:items-center sm:gap-5 sm:px-5">
        <p className="flex-1 text-[11px] leading-5 text-slate-300 sm:text-xs">
          {text}{' '}
          <Link
            href={`${privacyHref(locale)}#cookies`}
            className={`rounded-sm font-semibold text-[#d8bd73] underline decoration-[#d8bd73]/35 underline-offset-2 transition hover:text-[#f0d992] motion-reduce:transition-none ${FOCUS_RING}`}
          >
            {copy.more}
          </Link>
        </p>
        <div className="grid w-full shrink-0 grid-cols-2 gap-2 sm:w-auto">
          <button
            ref={firstButton}
            type="button"
            onClick={() => choose(false)}
            className={`rounded-xl border border-white/18 bg-white/[0.045] px-4 py-2.5 text-[11px] font-bold text-slate-100 transition hover:border-white/30 hover:bg-white/[0.07] motion-reduce:transition-none ${FOCUS_RING}`}
          >
            {copy.reject}
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            className={`rounded-xl border border-[#d8bd73]/35 bg-[#d8bd73]/[0.07] px-4 py-2.5 text-[11px] font-bold text-[#f2e7c8] transition hover:border-[#d8bd73]/55 hover:bg-[#d8bd73]/[0.11] motion-reduce:transition-none ${FOCUS_RING}`}
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
