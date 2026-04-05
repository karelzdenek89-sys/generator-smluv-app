'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'cookies_accepted';

export default function CookiesBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        if (localStorage.getItem(STORAGE_KEY) !== '1') {
          setVisible(true);
        }
      } catch {
        setVisible(true);
      }
    }, 0);

    return () => clearTimeout(id);
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Pokud localStorage není dostupné, banner pouze skryjeme.
    }

    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Informace o cookies"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#1a1a1a] px-4 py-4 shadow-[0_-8px_32px_rgba(0,0,0,0.4)]"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
          Tento web používá pouze technicky nezbytné prostředky pro své fungování. Nepoužíváme marketingové ani
          profilující cookies.{' '}
          <Link href="/gdpr" className="text-amber-400 underline underline-offset-2 transition hover:text-amber-300">
            Více informací
          </Link>
        </p>
        <button
          onClick={accept}
          className="flex-shrink-0 rounded-xl border border-white/15 bg-white/8 px-5 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:border-amber-500 hover:bg-amber-500 hover:text-black"
        >
          Rozumím
        </button>
      </div>
    </div>
  );
}
