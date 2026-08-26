'use client';

import { useEffect, useState } from 'react';
import {
  getProductAnalyticsConsent,
  setProductAnalyticsConsent,
  type ProductAnalyticsConsent,
} from '@/lib/analytics-attribution';

const STATUS_COPY: Record<Exclude<ProductAnalyticsConsent, null>, string> = {
  granted: 'Vlastní produktová analytika je povolena.',
  denied: 'Vlastní produktová analytika je vypnuta.',
};

export default function AnalyticsConsentSettings() {
  const [consent, setConsent] = useState<ProductAnalyticsConsent>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setConsent(getProductAnalyticsConsent()), 0);
    return () => window.clearTimeout(id);
  }, []);

  const choose = (granted: boolean) => {
    setProductAnalyticsConsent(granted);
    setConsent(granted ? 'granted' : 'denied');
  };

  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/3 p-5">
      <div className="text-xs font-bold text-white">
        {consent ? STATUS_COPY[consent] : 'O vlastní produktové analytice jste zatím nerozhodli.'}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Volbu můžete kdykoli změnit. Vypnutí zastaví další browserové měření a nové atribuce a ihned odstraní
        krátkodobý záznam z tohoto panelu; serverové události již atribuovaného dokumentu tím zpětně nesmaže.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => choose(false)}
          className="rounded-xl border border-white/15 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition hover:border-white/35"
        >
          Jen nezbytné
        </button>
        <button
          type="button"
          onClick={() => choose(true)}
          className="rounded-xl border border-amber-500/60 bg-amber-500 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-black transition hover:bg-amber-400"
        >
          Povolit měření
        </button>
      </div>
    </div>
  );
}
