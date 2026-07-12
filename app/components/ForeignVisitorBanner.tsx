'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  getContractTypeByPath,
  getUnsupportedFormNotice,
  isExpatContract,
  normalizeLocale,
  type AppLocale,
} from '@/lib/locale';
import { LOCALE_META } from '@/lib/i18n/locales';

type ActiveLocale = Exclude<AppLocale, 'cs'>;

type BannerCopy = {
  heading: string;
  body: string;
  detail: string;
  translateHint: string;
  backToLanding: string;
  dismiss: string;
};

const SUPPORTED_COPY: Record<ActiveLocale, BannerCopy> = {
  en: {
    heading: 'You came from the English overview',
    body: 'The form on this page is in Czech.',
    detail:
      'For supported contracts, the PDF includes Czech wording plus an explanatory English annex (not certified or official). In case of discrepancy, the Czech text prevails.',
    translateHint: 'Tip: right-click the page and choose "Translate to English" to fill the form.',
    backToLanding: '← Back to English overview',
    dismiss: 'Got it',
  },
  ua: {
    heading: 'Ви перейшли з українського огляду',
    body: 'Форма на цій сторінці чеською мовою.',
    detail:
      'Для обраних договорів PDF містить чеський текст і пояснювальний український додаток (не офіційний переклад). У разі розбіжностей перевага має чеське формулювання.',
    translateHint: 'Підказка: клацніть правою кнопкою миші і виберіть «Перекласти».',
    backToLanding: '← Назад до українського огляду',
    dismiss: 'Зрозуміло',
  },
};

const CZECH_ONLY_COPY: Record<ActiveLocale, BannerCopy> = {
  en: {
    heading: 'You came from the English overview',
    body: 'This contract form is available in Czech only.',
    detail:
      'The generated PDF will be in Czech. Selected core contracts (rental, employment, DPP, and others) offer English form guidance and an explanatory annex.',
    translateHint: 'Tip: use your browser translator while filling the Czech form.',
    backToLanding: '← Back to English overview',
    dismiss: 'Got it',
  },
  ua: {
    heading: 'Ви перейшли з українського огляду',
    body: 'Ця форма доступна лише чеською.',
    detail:
      'PDF буде чеською. Для основних договорів (оренда, праця, DPP тощо) є підказки українською та пояснювальний додаток у PDF.',
    translateHint: 'Підказка: використайте перекладач браузера під час заповнення.',
    backToLanding: '← Назад до українського огляду',
    dismiss: 'Зрозуміло',
  },
};

function mapCookieToAppLocale(raw: string | undefined): ActiveLocale | null {
  if (!raw) return null;
  const normalized = normalizeLocale(raw);
  return normalized === 'cs' ? null : normalized;
}

function readCookie(name: string): string | undefined {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${escapedName}=([^;]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

export default function ForeignVisitorBanner() {
  const pathname = usePathname();
  const [locale, setLocale] = useState<ActiveLocale | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const isForeignLanding = ['en', 'ua', 'uk', 'ru', 'vn', 'vi', 'de'].some(
        (seg) => pathname === `/${seg}` || pathname.startsWith(`/${seg}/`),
      );
      if (isForeignLanding || readCookie('foreign-banner-dismissed') === '1') {
        setLocale(null);
        return;
      }

      const queryLocale = new URLSearchParams(window.location.search).get('lang') ?? undefined;
      setLocale(
        mapCookieToAppLocale(queryLocale) ??
        mapCookieToAppLocale(readCookie('preferred-locale')),
      );
    }, 0);

    return () => window.clearTimeout(id);
  }, [pathname]);

  if (!locale) return null;

  const contractType = getContractTypeByPath(pathname);
  const supported = contractType ? isExpatContract(contractType) : false;
  const copy = supported ? SUPPORTED_COPY[locale] : CZECH_ONLY_COPY[locale];
  const meta = LOCALE_META[locale];
  const unsupportedNote =
    !supported && contractType ? getUnsupportedFormNotice(locale) : null;

  return (
    <VisitorBannerShell
      meta={meta}
      copy={copy}
      unsupportedNote={unsupportedNote}
      onDismiss={() => setLocale(null)}
    />
  );
}

function VisitorBannerShell({
  meta,
  copy,
  unsupportedNote,
  onDismiss,
}: {
  meta: (typeof LOCALE_META)[ActiveLocale];
  copy: BannerCopy;
  unsupportedNote: string | null;
  onDismiss: () => void;
}) {
  return (
    <div
      lang={meta.htmlLang}
      role="region"
      aria-label={copy.heading}
      className="foreign-banner sticky top-0 z-40 border-b border-amber-400/30 bg-[#1a1410]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1a1410]/85"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 text-sm text-amber-50 md:flex-row md:items-center md:justify-between md:gap-4">
        <div className="min-w-0">
          <div className="font-semibold text-amber-200">
            <span aria-hidden className="mr-1.5">{meta.flag}</span>
            {copy.heading}
          </div>
          <div className="mt-0.5 text-amber-100/90">
            {copy.body} {copy.detail}
          </div>
          {unsupportedNote ? (
            <div className="mt-1 text-xs text-amber-100/80">{unsupportedNote}</div>
          ) : null}
          <div className="mt-0.5 text-xs text-amber-100/70">{copy.translateHint}</div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href={`/${meta.segment}`}
            className="text-xs uppercase tracking-wider text-amber-200 hover:text-amber-100"
          >
            {copy.backToLanding}
          </Link>
          <button
            type="button"
            onClick={() => {
              document.cookie = `foreign-banner-dismissed=1; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
              onDismiss();
            }}
            className="rounded-md border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-100 transition-colors hover:bg-amber-400/20"
          >
            {copy.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
