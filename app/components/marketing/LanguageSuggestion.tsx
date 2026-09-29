'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import styles from './language-suggestion.module.css';

type Suggestion = 'en' | 'ua';

const STORAGE_KEY = 'sh-language-suggestion';

const COPY: Record<Suggestion, { lang: string; flag: string; title: string; text: string; cta: string; href: string; close: string }> = {
  en: {
    lang: 'en',
    flag: '🇬🇧',
    title: 'This page is in Czech.',
    text: 'Czech contracts with a complete English translation are in English here.',
    cta: 'Continue in English',
    href: '/en',
    close: 'Stay on the Czech page',
  },
  ua: {
    lang: 'uk',
    flag: '🇺🇦',
    title: 'Ця сторінка чеською.',
    text: 'Чеські договори з повним українським перекладом — українською тут.',
    cta: 'Продовжити українською',
    href: '/ua',
    close: 'Залишитися на чеській сторінці',
  },
};

function readDismissed(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'dismissed';
  } catch {
    return false;
  }
}

/** Suggests the EN/UA site when the browser's preferred language is not Czech or Slovak. */
function detectSuggestion(): Suggestion | null {
  if (readDismissed()) return null;
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const primary = (languages[0] ?? '').toLowerCase();
  if (!primary || primary.startsWith('cs') || primary.startsWith('sk')) return null;
  if (primary.startsWith('uk') || primary.startsWith('ru')) return 'ua';
  return 'en';
}

const subscribeNoop = () => () => {};

export default function LanguageSuggestion() {
  const suggestion = useSyncExternalStore(subscribeNoop, detectSuggestion, () => null);
  const [closed, setClosed] = useState(false);

  if (!suggestion || closed) return null;
  const copy = COPY[suggestion];

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'dismissed');
    } catch {
      // Storage may be unavailable (private mode); closing still works for this view.
    }
    setClosed(true);
  };

  return (
    <div
      lang={copy.lang}
      role="region"
      aria-label={copy.title}
      className={`${styles.toast} fixed inset-x-3 top-[76px] z-[60] mx-auto max-w-md rounded-2xl border border-sky-300/30 bg-[#07111e]/95 px-4 py-3 text-slate-200 sm:p-4 shadow-[0_20px_60px_rgba(0,0,0,.5)] backdrop-blur-md sm:left-auto sm:right-5 sm:top-[88px]`}
    >
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="text-xl leading-none">{copy.flag}</span>
        <div className="min-w-0 flex-1">
          <p className="pr-8 text-sm font-semibold text-white">{copy.title}</p>
          <p className="mt-1 hidden text-xs leading-5 text-slate-400 sm:block">{copy.text}</p>
          <Link
            href={copy.href}
            hrefLang={copy.lang}
            onClick={dismiss}
            className="mt-2.5 inline-flex min-h-10 items-center gap-1.5 whitespace-nowrap rounded-xl bg-sky-300 px-4 text-sm font-bold text-[#07111e] transition hover:bg-sky-200 sm:mt-3 sm:min-h-9 sm:text-xs"
          >
            {copy.cta} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={copy.close}
          title={copy.close}
          className="absolute right-1.5 top-1.5 flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
