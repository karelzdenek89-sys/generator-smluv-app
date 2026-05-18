'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ContractType } from '@/lib/contracts';
import {
  LEGAL_NOTICE,
  getBuilderCopy,
  getFallbackUiNotice,
  getUnsupportedFormNotice,
  isExpatContract,
  isSupportedLocaleInput,
  normalizeLocale,
  readBuilderLocaleFromBrowser,
  type AppLocale,
} from '@/lib/locale';
import { getBuilderNoticeLabels } from '@/lib/i18n/expat-locale-copy';
import {
  getEmploymentWorkEligibilityNotice,
  getLeaseUseNotice,
} from '@/lib/i18n/safety-copy';

export function useBuilderLocale(): AppLocale {
  const [locale] = useState<AppLocale>(() =>
    typeof window === 'undefined' ? 'cs' : readBuilderLocaleFromBrowser(),
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryLocale = params.get('lang');
    if (queryLocale && isSupportedLocaleInput(queryLocale)) {
      const normalized = normalizeLocale(queryLocale);
      document.cookie = `preferred-locale=${encodeURIComponent(normalized)}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, []);

  return locale;
}

export function appendLangToPayload<T extends Record<string, unknown>>(payload: T, locale: AppLocale): T & { lang: AppLocale } {
  return { ...payload, lang: locale };
}

export function BuilderLocaleNotice({ contractType }: { contractType: ContractType }) {
  const locale = useBuilderLocale();
  const copy = useMemo(() => getBuilderCopy(contractType, locale), [contractType, locale]);
  const labels = useMemo(
    () => (locale === 'cs' ? null : getBuilderNoticeLabels(locale)),
    [locale],
  );

  if (locale === 'cs' || !labels) return null;

  const supported = isExpatContract(contractType);

  if (!supported) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-4 lg:px-8">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm leading-7 text-amber-50">
          <div className="font-bold text-amber-200">
            {locale === 'ua' ? 'Лише чеська форма' : 'Czech-only form'}
          </div>
          <p className="mt-1">{getUnsupportedFormNotice(locale)}</p>
          <p className="mt-2 text-amber-100/90">{LEGAL_NOTICE[locale]}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-6 lg:px-8">
      <div className="rounded-2xl border border-sky-400/25 bg-sky-400/10 p-5 text-sm leading-7 text-sky-50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="font-bold text-sky-100">{copy?.title ?? labels.guidedTitleFallback}</div>
            <p className="mt-1">{copy?.description ?? getFallbackUiNotice(locale)}</p>
            <p className="mt-2 text-sky-100/90">{LEGAL_NOTICE[locale]}</p>
            {contractType === 'lease' ? (
              <p className="mt-2 text-sky-100/90">{getLeaseUseNotice(locale)}</p>
            ) : null}
            {contractType === 'employment' || contractType === 'dpp' ? (
              <p className="mt-2 text-sky-100/90">{getEmploymentWorkEligibilityNotice(locale)}</p>
            ) : null}
            <p className="mt-2 text-sky-100/90">{labels.safetyStrip}</p>
          </div>
          {copy ? (
            <div className="grid min-w-0 gap-3 text-xs text-sky-100/90 sm:grid-cols-2 lg:w-[34rem]">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="mb-2 font-bold uppercase tracking-widest text-sky-200">{labels.steps}</div>
                <ul className="space-y-1">
                  {copy.steps.slice(0, 8).map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="mb-2 font-bold uppercase tracking-widest text-sky-200">{labels.keyFields}</div>
                <ul className="space-y-1">
                  {copy.fields.slice(0, 8).map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
