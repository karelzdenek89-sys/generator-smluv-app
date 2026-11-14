'use client';

import { useEffect, useState } from 'react';
import { isGoogleAnalyticsConfigured } from '@/lib/google-analytics';
import {
  getAnalyticsConsent,
  setProductAnalyticsConsent,
  type ProductAnalyticsConsent,
} from '@/lib/analytics-attribution';

const STATUS_COPY: Record<Exclude<ProductAnalyticsConsent, null>, string> = {
  granted: 'Vlastní produktová analytika je povolena.',
  denied: 'Vlastní produktová analytika je vypnuta.',
};

const STATUS_COPY_WITH_GA: Record<Exclude<ProductAnalyticsConsent, null>, string> = {
  granted: 'Analytika je povolena (vlastní produktové měření a Google Analytics 4).',
  denied: 'Analytika je vypnuta (vlastní produktové měření i Google Analytics 4).',
};

const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400';

export default function AnalyticsConsentSettings() {
  const [consent, setConsent] = useState<ProductAnalyticsConsent>(null);
  const withGoogleAnalytics = isGoogleAnalyticsConfigured();
  const statusCopy = withGoogleAnalytics ? STATUS_COPY_WITH_GA : STATUS_COPY;

  useEffect(() => {
    const id = window.setTimeout(() => setConsent(getAnalyticsConsent()), 0);
    return () => window.clearTimeout(id);
  }, []);

  const choose = (granted: boolean) => {
    setProductAnalyticsConsent(granted);
    setConsent(granted ? 'granted' : 'denied');
  };

  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/3 p-5">
      <div className="text-xs font-bold text-white">
        {consent
          ? statusCopy[consent]
          : withGoogleAnalytics
            ? 'O analytice (vlastní měření a Google Analytics 4) jste zatím nerozhodli.'
            : 'O vlastní produktové analytice jste zatím nerozhodli.'}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Volbu můžete kdykoli změnit. Vypnutí zastaví další browserové měření a nové atribuce a ihned odstraní
        krátkodobý záznam z tohoto panelu; serverové události již atribuovaného dokumentu tím zpětně nesmaže.
        {withGoogleAnalytics ? ' Zároveň vypne Google Analytics 4 a smaže jeho cookies _ga z tohoto prohlížeče.' : null}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => choose(false)}
          className={`rounded-xl border border-white/15 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition hover:border-white/35 motion-reduce:transition-none ${FOCUS_RING}`}
        >
          Odmítnout
        </button>
        <button
          type="button"
          onClick={() => choose(true)}
          className={`rounded-xl border border-amber-500/60 bg-amber-500 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-black transition hover:bg-amber-400 motion-reduce:transition-none ${FOCUS_RING}`}
        >
          Přijmout analytiku
        </button>
      </div>
    </div>
  );
}
