'use client';

import { usePathname } from 'next/navigation';
import {
  BUILDER_COMPLETE_PERKS,
  BUILDER_PRICING_OPTIONS,
  PRICING_SECTION_COPY,
  type PricingTier,
} from '@/lib/pricing';
import { getAnalyticsDefaultsForPathname, trackEvent } from '@/lib/analytics';
import { getContractTierCopy, getTierSelectorDescription } from '@/lib/tier-copy';
import type { LeaseFormUi } from '@/lib/i18n/lease-form';

type BuilderTierSelectorProps = {
  tier: PricingTier;
  onTierChange: (tier: PricingTier) => void;
  contractType?: string;
  title?: string;
  subtitle?: string;
  completeHighlights?: readonly string[];
  tierSelectorCopy?: LeaseFormUi['tierSelector'];
};

export default function BuilderTierSelector({
  tier,
  onTierChange,
  contractType,
  title,
  subtitle,
  completeHighlights,
  tierSelectorCopy,
}: BuilderTierSelectorProps) {
  const pathname = usePathname();
  const contractTierCopy = getContractTierCopy(contractType);
  const copy = tierSelectorCopy;
  const resolvedTitle = title ?? copy?.heading ?? PRICING_SECTION_COPY.heading;
  const resolvedSubtitle = subtitle ?? copy?.intro ?? PRICING_SECTION_COPY.intro;
  const resolvedCompleteHighlights =
    completeHighlights ?? copy?.completeHighlights ?? contractTierCopy.completeHighlights ?? BUILDER_COMPLETE_PERKS;

  const handleTierChange = (nextTier: PricingTier) => {
    const defaults = getAnalyticsDefaultsForPathname(pathname ?? '/');

    trackEvent('builder_tier_selected', {
      ...defaults,
      source: 'builder',
      surface: 'builder',
      contract_type: defaults.contract_type,
      previous_tier: tier,
      tier: nextTier,
      price_band: nextTier === 'complete' ? '199' : '99',
    });

    onTierChange(nextTier);
  };

  return (
    <div className="space-y-3">
      <div className="mb-4">
        <div className="mb-2 text-xs font-black uppercase tracking-widest text-slate-500">
          {resolvedTitle}
        </div>
        <p className="text-sm leading-relaxed text-slate-400">{resolvedSubtitle}</p>
      </div>

      {BUILDER_PRICING_OPTIONS.map((opt) => {
        const localizedLabel =
          copy && opt.value === 'basic'
            ? copy.basicLabel
            : copy && opt.value === 'complete'
              ? copy.completeLabel
              : opt.label;
        const localizedDesc =
          copy && opt.value === 'basic'
            ? copy.basicDesc
            : copy && opt.value === 'complete'
              ? copy.completeDesc
              : getTierSelectorDescription(contractType, opt.value);
        const localizedBadge =
          copy && opt.value === 'complete' ? copy.completeBadge : opt.badge;

        return (
        <label
          key={opt.value}
          className={`relative block cursor-pointer rounded-2xl border-2 p-4 transition ${
            tier === opt.value
              ? 'border-amber-500 bg-amber-500/10'
              : 'border-slate-700/60 bg-[#0c1426]/60 hover:border-slate-600'
          }`}
        >
          {localizedBadge && tier !== 'complete' ? (
            <div className="absolute -top-2.5 left-4">
              <span className="rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-black">
                {localizedBadge}
              </span>
            </div>
          ) : null}

          <div className="flex items-start gap-3">
            <input
              type="radio"
              name="tier"
              value={opt.value}
              checked={tier === opt.value}
              onChange={() => handleTierChange(opt.value)}
              className="mt-1 h-5 w-5 accent-amber-500"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-black uppercase tracking-wide text-amber-400">
                  {localizedLabel}
                </span>
                <span className="shrink-0 text-sm font-black text-white">
                  {opt.price}
                </span>
              </div>
              <div className="mt-1 text-xs leading-relaxed text-slate-400">
                {localizedDesc}
              </div>
              {opt.value === 'complete' ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {resolvedCompleteHighlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </label>
      );
      })}
    </div>
  );
}
