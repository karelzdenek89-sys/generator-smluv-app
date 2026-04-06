'use client';

import { usePathname } from 'next/navigation';
import {
  COMPLETE_UPSELL_DELTA_CZK,
  PRICING_TIER_CONFIG,
  PRICING_UPSELL_COPY,
  getTierPriceLabel,
  type PricingTier,
} from '@/lib/pricing';
import { getAnalyticsDefaultsForPathname, trackEvent } from '@/lib/analytics';
import {
  getEffectiveIncludedItems,
  getThematicPackageConfig,
} from '@/lib/packages';

type BuilderCheckoutSummaryProps = {
  tier: PricingTier;
  contractType?: string;
  packageKey?: string | null;
  onUpgrade?: () => void;
  title?: string;
  documentLabel?: string;
};

export default function BuilderCheckoutSummary({
  tier,
  contractType,
  packageKey,
  onUpgrade,
  title = 'Shrnutí objednávky',
  documentLabel = 'Vybraný dokument',
}: BuilderCheckoutSummaryProps) {
  const pathname = usePathname();
  const isComplete = tier === 'complete';
  const packageConfig = getThematicPackageConfig(packageKey);
  const includedItems = getEffectiveIncludedItems(contractType, tier, packageKey);
  const defaults = getAnalyticsDefaultsForPathname(pathname ?? '/');

  if (packageConfig) {
    return (
      <>
        <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
          {title}
        </div>

        <div className="mb-4 rounded-2xl border border-white/8 bg-white/3 p-4">
          <div className="mb-1 flex items-center justify-between gap-4">
            <span className="text-sm text-slate-400">Vybraný produkt</span>
            <span className="text-sm font-bold text-white">{packageConfig.priceLabel}</span>
          </div>
          <div className="text-base font-semibold text-white">{packageConfig.title}</div>
          <div className="mt-2 text-sm leading-relaxed text-slate-400">
            {packageConfig.checkoutDescription}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-2">
            <span className="text-sm font-black text-white">Celkem</span>
            <span className="text-xl font-black text-amber-400">{packageConfig.priceLabel}</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 py-3">
          <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            Součástí balíčku je
          </div>
          <ul className="space-y-1.5">
            {includedItems.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
                <span className="mt-0.5 text-amber-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-slate-400">
          Po dokončení objednávky získáte výstup odpovídající tomuto balíčku,
          připravený k závěrečné kontrole a podpisu.
        </p>
      </>
    );
  }

  return (
    <>
      <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
        {title}
      </div>

      <div className="mb-4 rounded-2xl border border-white/8 bg-white/3 p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm text-slate-400">{documentLabel}</span>
          <span className="text-sm font-bold text-white">
            {PRICING_TIER_CONFIG.basic.priceLabel}
          </span>
        </div>
        {isComplete ? (
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm text-slate-400">{PRICING_TIER_CONFIG.complete.title}</span>
            <span className="text-sm font-bold text-amber-400">
              +{COMPLETE_UPSELL_DELTA_CZK} Kč
            </span>
          </div>
        ) : null}
        <div className="mt-2 flex items-center justify-between border-t border-white/8 pt-2">
          <span className="text-sm font-black text-white">Celkem</span>
          <span className="text-xl font-black text-amber-400">{getTierPriceLabel(tier)}</span>
        </div>
      </div>

      {!isComplete && onUpgrade ? (
        <button
          type="button"
          onClick={() => {
            trackEvent('builder_upgrade_clicked', {
              ...defaults,
              source: 'builder',
              surface: 'builder_summary',
              contract_type: defaults.contract_type,
              tier: 'complete',
              previous_tier: 'basic',
              price_band: '199',
              cta_type: 'summary_upgrade',
            });
            onUpgrade();
          }}
          className="mb-4 w-full rounded-2xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-left transition hover:border-amber-500/35 hover:bg-amber-500/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
        >
          <div className="mb-1 text-xs font-black uppercase tracking-widest text-amber-400">
            {PRICING_UPSELL_COPY.title}
          </div>
          <div className="text-sm leading-relaxed text-slate-300">
            {PRICING_UPSELL_COPY.description}
          </div>
          <div className="mt-3 inline-flex rounded-full border border-amber-500/25 px-3 py-1 text-[11px] font-semibold text-amber-300">
            {PRICING_UPSELL_COPY.cta}
          </div>
        </button>
      ) : null}

      <div className="mt-4 rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 py-3">
        <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
          Součástí varianty je
        </div>
        <ul className="space-y-1.5">
          {includedItems.map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
              <span className="mt-0.5 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-400">
        Po dokončení objednávky získáte výstup odpovídající zvolené variantě,
        připravený k závěrečné kontrole a podpisu.
      </p>
    </>
  );
}
