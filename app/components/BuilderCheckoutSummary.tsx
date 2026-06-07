'use client';

import { usePathname } from 'next/navigation';
import {
  PRICING_TIER_CONFIG,
  PRICING_UPSELL_COPY,
  type PricingTier,
} from '@/lib/pricing';
import { getAnalyticsDefaultsForPathname, trackEvent } from '@/lib/analytics';
import {
  getEffectiveIncludedItems,
  getThematicPackageConfig,
} from '@/lib/packages';
import type { LeaseFormUi } from '@/lib/i18n/lease-form';
import { normalizeLocale } from '@/lib/locale';
import { getLocalizedPackagePresentation } from '@/lib/i18n/pricing-locale';

type BuilderCheckoutSummaryProps = {
  tier: PricingTier;
  contractType?: string;
  packageKey?: string | null;
  onUpgrade?: () => void;
  title?: string;
  documentLabel?: string;
  summaryCopy?: LeaseFormUi['checkoutSummary'];
  locale?: string | null;
};

export default function BuilderCheckoutSummary({
  tier,
  contractType,
  packageKey,
  onUpgrade,
  title,
  documentLabel = 'Vybraný dokument',
  summaryCopy,
  locale: localeProp,
}: BuilderCheckoutSummaryProps) {
  const pathname = usePathname();
  const isComplete = tier === 'complete';
  const packageConfig = getThematicPackageConfig(packageKey);
  const locale = normalizeLocale(localeProp);
  const localizedPackage = packageConfig
    ? getLocalizedPackagePresentation(packageConfig.key, locale)
    : null;
  const includedItems = getEffectiveIncludedItems(contractType, tier, packageKey, locale);
  const defaults = getAnalyticsDefaultsForPathname(pathname ?? '/');
  const copy = summaryCopy;
  const resolvedTitle = title ?? copy?.title ?? 'Dokument připraven k odemknutí';
  const priceLabel = packageConfig ? packageConfig.priceLabel : PRICING_TIER_CONFIG[tier].priceLabel;
  const leaseOutputSummary =
    contractType === 'lease'
      ? locale === 'en'
        ? 'The document will include: parties, leased property, rent, services, deposit, handover, house rules, termination and signature section.'
        : locale === 'ua'
          ? 'Документ міститиме: сторони, предмет оренди, орендну плату, послуги, завдаток, передачу квартири, правила користування, припинення оренди та блок підписів.'
          : 'V dokumentu bude obsaženo: smluvní strany, předmět nájmu, nájemné, služby, jistota, předání bytu, pravidla užívání, ukončení nájmu a podpisová část.'
      : null;

  if (packageConfig) {
    return (
      <>
        <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
          {resolvedTitle}
        </div>

        <div className="mb-4 rounded-2xl border border-white/8 bg-white/3 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="text-base font-semibold text-white">{localizedPackage?.title ?? packageConfig.title}</div>
            <div className="shrink-0 text-lg font-black text-amber-300">{priceLabel}</div>
          </div>
          <div className="mt-2 text-sm leading-relaxed text-slate-400">
            {localizedPackage?.checkoutDescription ?? packageConfig.checkoutDescription}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 py-3">
          <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            {copy?.packageIncludes ?? 'Součástí balíčku je'}
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
          {copy?.afterOrder ??
            'Po zaplacení získáte výstup odpovídající tomuto balíčku ihned ke stažení, připravený k závěrečné kontrole a podpisu.'}
        </p>

        {leaseOutputSummary ? (
          <div className="mt-4 rounded-xl border border-amber-400/15 bg-amber-400/8 px-3 py-2 text-xs leading-5 text-amber-100">
            {leaseOutputSummary}
          </div>
        ) : null}

        <div className="mt-4 grid gap-2 text-[11px] leading-5 text-slate-400">
          <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/8 px-3 py-2 text-emerald-100">
            Stažení ihned po platbě. Bez registrace a bez předplatného.
          </div>
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 px-3 py-2">
            Platební údaje zpracovává Stripe. Dokument je standardizovaný výstup, ne individuální právní poradenství.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
        {resolvedTitle}
      </div>

      <div className="mb-4 rounded-2xl border border-white/8 bg-white/3 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white">{documentLabel}</div>
            <div className="mt-1 text-xs text-slate-400">
              {isComplete ? PRICING_TIER_CONFIG.complete.title : PRICING_TIER_CONFIG.basic.title}
            </div>
          </div>
          <div className="shrink-0 text-lg font-black text-amber-300">{priceLabel}</div>
        </div>
        {isComplete ? (
          <div className="mt-3 rounded-xl border border-amber-400/15 bg-amber-400/8 px-3 py-2 text-xs leading-5 text-amber-100">
            Rozšířená varianta přidává širší klauzule, checklist a praktičtější podklady pro kontrolu před podpisem.
          </div>
        ) : null}
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
            {copy?.upgradeTitle ?? PRICING_UPSELL_COPY.title}
          </div>
          <div className="text-sm leading-relaxed text-slate-300">
            {copy?.upgradeDescription ?? PRICING_UPSELL_COPY.description}
          </div>
          <div className="mt-3 inline-flex rounded-full border border-amber-500/25 px-3 py-1 text-[11px] font-semibold text-amber-300">
            {copy?.upgradeButton ?? copy?.upgradeCta ?? PRICING_UPSELL_COPY.cta}
          </div>
        </button>
      ) : null}

      <div className="mt-4 rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 py-3">
        <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
          {copy?.variantIncludes ?? 'Součástí varianty je'}
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
        {copy?.afterOrderVariant ??
          'Po zaplacení získáte výstup odpovídající zvolené variantě ihned ke stažení, připravený k závěrečné kontrole a podpisu.'}
      </p>

      {leaseOutputSummary ? (
        <div className="mt-4 rounded-xl border border-amber-400/15 bg-amber-400/8 px-3 py-2 text-xs leading-5 text-amber-100">
          {leaseOutputSummary}
        </div>
      ) : null}

      <div className="mt-4 grid gap-2 text-[11px] leading-5 text-slate-400">
        <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/8 px-3 py-2 text-emerald-100">
          Stažení ihned po platbě. Bez registrace a bez předplatného.
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 px-3 py-2">
          Platební údaje zpracovává Stripe. Dokument je standardizovaný výstup, ne individuální právní poradenství.
        </div>
      </div>
    </>
  );
}
