'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ALL_LOCALES, LOCALE_META, localeHomePath, type Locale } from '@/lib/i18n/locales';

type Variant = 'desktop' | 'mobile';

export default function LanguageSwitcher({
  current = 'cs',
  variant = 'desktop',
}: {
  current?: Locale;
  variant?: Variant;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const meta = LOCALE_META[current];

  if (variant === 'mobile') {
    return (
      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-3">
          Language / Jazyk
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_LOCALES.map(l => {
            const m = LOCALE_META[l];
            const isCurrent = l === current;
            return (
              <Link
                key={l}
                href={localeHomePath(l)}
                hrefLang={m.htmlLang}
                aria-current={isCurrent ? 'true' : undefined}
                className={
                  isCurrent
                    ? 'inline-flex items-center gap-2 rounded-lg border border-[#c9a852]/60 bg-[#c9a852]/10 px-3 py-1.5 text-sm text-[#c9a852]'
                    : 'inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-white/30'
                }
              >
                <span aria-hidden>{m.flag}</span>
                <span>{m.nativeName}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 text-[12px] uppercase tracking-[0.18em] text-slate-400 hover:border-white/30 hover:text-white transition-colors duration-150"
      >
        <span aria-hidden>{meta.flag}</span>
        <span>{meta.locale.toUpperCase()}</span>
        <span aria-hidden className="text-[10px]">▾</span>
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-xl border border-white/10 bg-[#0a1220] p-1 shadow-xl"
        >
          {ALL_LOCALES.map(l => {
            const m = LOCALE_META[l];
            const isCurrent = l === current;
            return (
              <Link
                key={l}
                href={localeHomePath(l)}
                hrefLang={m.htmlLang}
                role="option"
                aria-selected={isCurrent}
                onClick={() => setOpen(false)}
                className={
                  isCurrent
                    ? 'flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#c9a852] bg-white/[0.04]'
                    : 'flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/[0.04] hover:text-white'
                }
              >
                <span aria-hidden className="text-base">{m.flag}</span>
                <span>{m.nativeName}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
