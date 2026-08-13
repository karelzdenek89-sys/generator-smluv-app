'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { PRICING_TIER_CONFIG } from '@/lib/pricing';
import {
  getEffectiveIncludedItems,
  getEffectivePriceBand,
  getThematicPackageConfig,
} from '@/lib/packages';
import { getLocalizedPackagePresentation, getLocalizedPricingTier } from '@/lib/i18n/pricing-locale';
import { getPackageAppendixNotice } from '@/lib/i18n/package-upsell';
import { LEGAL_NOTICE, normalizeLocale } from '@/lib/locale';
import type { LeaseFormUi } from '@/lib/i18n/lease-form';
import { getAnalyticsDefaultsForPathname, trackEvent } from '@/lib/analytics';
import {
  CHECKOUT_ADDON_CONFIG,
  getAvailableCheckoutAddons,
  getCheckoutAddonIncludedItems,
  getCheckoutAddonsTotalCzk,
  type CheckoutAddonKey,
} from '@/lib/checkout-addons';
import {
  createCheckoutAuthorization,
  type CheckoutAuthorization,
} from '@/lib/checkout-authorization';
import type { PublicMonetizationPolicy } from '@/lib/monetization-policy';
import { FREE_BASIC_PDF_INCLUDED_ITEMS } from '@/lib/monetization-copy';

interface Section {
  title: string;
  body: string[];
}

interface PaymentModalProps {
  sections: Section[];
  title: string;
  tier: 'basic' | 'complete';
  onTierChange: (tier: 'basic' | 'complete') => void;
  packageKey?: string | null;
  contractType: string;
  lang?: string;
  paymentCopy?: LeaseFormUi['paymentModal'];
  onPay: (addOns: CheckoutAddonKey[], authorization: CheckoutAuthorization) => void;
  monetizationPolicy?: PublicMonetizationPolicy | null;
  onFreeGenerate?: (authorization: CheckoutAuthorization) => void;
  isProcessing: boolean;
  onClose: () => void;
}

export default function PaymentModal({
  sections,
  title,
  tier,
  onTierChange,
  packageKey,
  contractType,
  lang,
  paymentCopy,
  onPay,
  monetizationPolicy,
  onFreeGenerate,
  isProcessing,
  onClose,
}: PaymentModalProps) {
  const pathname = usePathname();
  const [gdprConsent, setGdprConsent] = useState(false);
  const [deliveryEmail, setDeliveryEmail] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<CheckoutAddonKey[]>([]);
  const [annexLanguage, setAnnexLanguage] = useState<'en' | 'ua'>(() =>
    normalizeLocale(lang) === 'ua' ? 'ua' : 'en',
  );
  const modalOpenTrackedRef = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const packageConfig = getThematicPackageConfig(packageKey);
  const locale = normalizeLocale(lang);
  const isFreeBasic = !packageConfig
    && tier === 'basic'
    && monetizationPolicy?.mode === 'free_experiment'
    && Boolean(onFreeGenerate);
  const copy = paymentCopy;
  const includedItems = isFreeBasic
    ? FREE_BASIC_PDF_INCLUDED_ITEMS
    : getEffectiveIncludedItems(contractType, tier, packageKey, locale);
  const availableAddOns = isFreeBasic
    ? []
    : getAvailableCheckoutAddons(contractType, tier, packageKey, locale);
  const availableAddonKeys = new Set(availableAddOns.map((addon) => addon.key));
  const validSelectedAddOns = selectedAddOns.filter((key) => availableAddonKeys.has(key));
  const selectedAddonItems = getCheckoutAddonIncludedItems(validSelectedAddOns);
  const localizedPackage = packageConfig
    ? getLocalizedPackagePresentation(packageConfig.key, locale)
    : null;
  const basePriceCzk = isFreeBasic
    ? 0
    : packageConfig
    ? packageConfig.priceCzk
    : PRICING_TIER_CONFIG[tier].priceCzk;
  const addonsTotalCzk = getCheckoutAddonsTotalCzk(validSelectedAddOns);
  const totalPriceCzk = basePriceCzk + addonsTotalCzk;
  const checkoutPrice = isFreeBasic ? 'Zdarma' : `${totalPriceCzk.toLocaleString('cs-CZ')} Kč`;
  const validAddOnKeys = validSelectedAddOns.join(',');
  const analyticsDefaults = getAnalyticsDefaultsForPathname(pathname ?? '/');
  const priceBand = isFreeBasic ? undefined : getEffectivePriceBand(tier, packageConfig?.key);
  // Přílohy balíčků nejsou přeložené; u cizojazyčného nákupu to musí zaznít
  // přímo u balíčku, ne jen v obecném právním upozornění pod formulářem.
  const packageAppendixNotice = getPackageAppendixNotice(locale);
  const closeModal = (reason: 'button' | 'backdrop' | 'escape') => {
    trackEvent('builder_checkout_modal_closed', {
      ...analyticsDefaults,
      source: 'checkout_modal',
      surface: 'checkout_modal',
      contract_type: analyticsDefaults.contract_type,
      tier,
      package_key: packageConfig?.key,
      price_band: priceBand,
      add_on_keys: validAddOnKeys,
      addons_total_czk: addonsTotalCzk,
      base_price_czk: basePriceCzk,
      total_price_czk: totalPriceCzk,
      selected_addons_count: validSelectedAddOns.length,
      cta_type: reason,
    });
    onClose();
  };

  // Klávesnice: Escape + uzamčení fokusu uvnitř modalu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
        return;
      }

      if (e.key !== 'Escape') return;

      trackEvent('builder_checkout_modal_closed', {
        ...analyticsDefaults,
        source: 'checkout_modal',
        surface: 'checkout_modal',
        contract_type: analyticsDefaults.contract_type,
        tier,
        package_key: packageConfig?.key,
        price_band: priceBand,
        add_on_keys: validAddOnKeys,
        addons_total_czk: addonsTotalCzk,
        base_price_czk: basePriceCzk,
        total_price_czk: totalPriceCzk,
        selected_addons_count: validSelectedAddOns.length,
        cta_type: 'escape',
      });
      onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    addonsTotalCzk,
    analyticsDefaults,
    basePriceCzk,
    onClose,
    packageConfig?.key,
    priceBand,
    tier,
    totalPriceCzk,
    validAddOnKeys,
    validSelectedAddOns.length,
  ]);

  useEffect(() => {
    previousActiveElementRef.current = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(
      () => modalRef.current?.focus({ preventScroll: true }),
      0,
    );
    return () => {
      window.clearTimeout(focusTimer);
      previousActiveElementRef.current?.focus();
    };
  }, []);

  // Zamezit scrollu pod modalem
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (modalOpenTrackedRef.current) return;
    modalOpenTrackedRef.current = true;

    trackEvent('builder_checkout_modal_open', {
      ...analyticsDefaults,
      source: 'builder',
      surface: 'checkout_modal',
      contract_type: analyticsDefaults.contract_type,
      tier,
      package_key: packageConfig?.key,
      price_band: priceBand,
      add_on_keys: validAddOnKeys,
      addons_total_czk: addonsTotalCzk,
      base_price_czk: basePriceCzk,
      total_price_czk: totalPriceCzk,
      selected_addons_count: validSelectedAddOns.length,
      monetization_mode: isFreeBasic ? 'free_experiment' : 'paid',
      experiment_id: monetizationPolicy?.experimentId ?? undefined,
      variant: monetizationPolicy?.variant ?? undefined,
    });
    if (monetizationPolicy?.mode === 'free_experiment') {
      trackEvent('premium_offer_viewed', {
        ...analyticsDefaults,
        source: 'checkout_modal',
        surface: 'tier_selector',
        contract_type: analyticsDefaults.contract_type,
        tier: 'complete',
        previous_tier: 'basic',
        monetization_mode: 'free_experiment',
        experiment_id: monetizationPolicy.experimentId ?? undefined,
        variant: monetizationPolicy.variant ?? undefined,
      });
    }
  }, [
    addonsTotalCzk,
    analyticsDefaults,
    basePriceCzk,
    isFreeBasic,
    monetizationPolicy?.experimentId,
    monetizationPolicy?.mode,
    monetizationPolicy?.variant,
    packageConfig?.key,
    priceBand,
    tier,
    totalPriceCzk,
    validAddOnKeys,
    validSelectedAddOns.length,
  ]);

  const instantDownloadNote =
    locale === 'en'
      ? 'PDF will be available immediately after payment. No registration and no subscription.'
      : locale === 'ua'
        ? 'PDF буде доступний одразу після оплати. Без реєстрації та без підписки.'
        : 'PDF bude dostupné ihned po zaplacení. Bez registrace a bez předplatného.';

  const toggleAddOn = (key: CheckoutAddonKey) => {
    const wasSelected = selectedAddOns.includes(key);
    const next = wasSelected
      ? selectedAddOns.filter((item) => item !== key)
      : [...selectedAddOns, key];
    const nextValid = next.filter((item) => availableAddonKeys.has(item));
    const nextAddonsTotalCzk = getCheckoutAddonsTotalCzk(nextValid);

    trackEvent(wasSelected ? 'checkout_addon_removed' : 'checkout_addon_selected', {
      ...analyticsDefaults,
      source: 'checkout_modal',
      surface: 'checkout_modal',
      contract_type: analyticsDefaults.contract_type,
      tier,
      package_key: packageConfig?.key,
      price_band: priceBand,
      add_on_key: key,
      add_on_price_czk: CHECKOUT_ADDON_CONFIG[key].priceCzk,
      add_on_keys: nextValid.join(','),
      addons_total_czk: nextAddonsTotalCzk,
      base_price_czk: basePriceCzk,
      total_price_czk: basePriceCzk + nextAddonsTotalCzk,
      selected_addons_count: nextValid.length,
    });

    setSelectedAddOns(next);
  };

  const today = new Date().toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const hasSections = sections.length > 0;

  return (
    <div
      ref={modalRef}
      data-testid="lease-checkout-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      aria-describedby="checkout-modal-description"
      tabIndex={-1}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(5, 8, 15, 0.92)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) closeModal('backdrop'); }}
    >
      <div className="relative flex w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)] max-h-[92vh]">

        {/* Zavřít */}
        <button
          onClick={() => closeModal('button')}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-slate-400 hover:bg-white/14 hover:text-white transition"
          aria-label={copy?.close ?? 'Zavřít'}
        >
          ✕
        </button>

        {/* Levá strana — rozmazaný náhled */}
        <div className="relative hidden w-[55%] overflow-hidden md:block" style={{ background: '#0a0f1e' }}>
          {/* Náhled smlouvy */}
          <div
            className="h-full overflow-hidden"
            style={{ filter: 'blur(3px)', transform: 'scale(1.02)', opacity: 0.6 }}
          >
            <div className="p-6 h-full overflow-hidden">
              <div className="rounded-2xl overflow-hidden border border-[rgba(166,134,91,0.18)] bg-[#f5efe3]">
                <div className="border-b border-[#dccdae] px-6 py-5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#9f7a40]">SmlouvaHned.cz</div>
                  <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#5e4827]">{title}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8f7a59]">{today}</div>
                </div>
                <div className="space-y-5 px-6 py-6">
                  {hasSections ? (
                    sections.slice(0, 8).map((section) => (
                      <div key={section.title}>
                        <div className="border-b border-[#e5d8bf] pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9f7a40]">
                          {section.title}
                        </div>
                        <div className="mt-3 space-y-2">
                          {section.body.slice(0, 6).map((line, i) => {
                            const text = String(line ?? '').trim();
                            if (!text) return null;
                            return <p key={i} className="text-[12px] leading-6 text-[#4a3d2c]">{text}</p>;
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Placeholder pokud formulář prázdný
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i}>
                        <div className="border-b border-[#e5d8bf] pb-2">
                          <div className="h-3 w-32 rounded bg-[#d4c4a0]" />
                        </div>
                        <div className="mt-3 space-y-2">
                          {Array.from({ length: 4 }).map((_, j) => (
                            <div key={j} className="h-3 rounded bg-[#e8dfc8]" style={{ width: `${70 + (j * 7) % 25}%` }} />
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Zamčený overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(180deg, rgba(5,8,15,0.3) 0%, rgba(5,8,15,0.7) 60%, rgba(5,8,15,0.95) 100%)' }}>
            <div className="flex flex-col items-center gap-4 px-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
                <svg className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-black text-white">{copy?.readyTitle ?? 'Váš dokument je připraven'}</div>
                <div className="mt-1 text-sm text-slate-400">{copy?.readySubtitle ?? 'Odemkněte přístup k plnému PDF dokumentu'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pravá strana — platební panel */}
        <div className="flex w-full flex-col overflow-y-auto md:w-[45%]" style={{ background: '#0c1426', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex flex-1 flex-col p-7">

            {/* Hlavička */}
            <div className="mb-6">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400/80">{copy?.unlockHeading ?? 'Odemknout dokument'}</div>
              <h2 id="checkout-modal-title" className="mt-2 text-2xl font-black leading-tight text-white">{title}</h2>
              <p id="checkout-modal-description" className="mt-2 text-sm leading-6 text-slate-400">
                {isFreeBasic
                  ? 'Zkontrolujte základní variantu a potvrďte podmínky. PDF vytvoříme bez platby a bez registrace.'
                  : locale === 'en'
                  ? 'Enter the delivery email, review the order and confirm the terms before payment.'
                  : locale === 'ua'
                    ? 'Введіть email для доставки, перевірте замовлення та підтвердьте умови перед оплатою.'
                    : 'Zadejte doručovací e-mail, zkontrolujte objednávku a před platbou potvrďte podmínky.'}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {isFreeBasic
                  ? 'Základní DPP je připravena k bezplatnému vygenerování. Rozšířená varianta zůstává placená.'
                  : hasSections
                  ? (copy?.unlockSubtitleReady ?? 'Váš dokument je sestavený a připravený ke stažení. Vyberte variantu a dokončete platbu.')
                  : (copy?.unlockSubtitleEmpty ?? 'Doplňte zbývající údaje ve formuláři a vyberte variantu dokumentu.')}
              </p>
            </div>

            {/* Výběr varianty — pouze pokud není package */}
            {!packageConfig && (
              <div className="mb-5 space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{copy?.tierHeading ?? 'Varianta dokumentu'}</div>
                {(['basic', 'complete'] as const).map((t) => {
                  const cfg = PRICING_TIER_CONFIG[t];
                  const isSelected = tier === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        if (t === 'complete' && monetizationPolicy?.mode === 'free_experiment') {
                          trackEvent('premium_upgrade_clicked', {
                            ...analyticsDefaults,
                            source: 'checkout_modal',
                            surface: 'tier_selector',
                            contract_type: analyticsDefaults.contract_type,
                            tier: 'complete',
                            previous_tier: 'basic',
                            monetization_mode: 'free_experiment',
                            experiment_id: monetizationPolicy.experimentId ?? undefined,
                            variant: monetizationPolicy.variant ?? undefined,
                          });
                        }
                        onTierChange(t);
                      }}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? 'border-amber-500/60 bg-amber-500/10'
                          : 'border-slate-700/60 bg-white/2 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-amber-400' : 'border-slate-600'}`}>
                            {isSelected && <div className="h-2 w-2 rounded-full bg-amber-400" />}
                          </div>
                          <span className="font-bold text-white text-sm">
                            {copy
                              ? t === 'basic'
                                ? copy.tierBasicTitle
                                : copy.tierCompleteTitle
                              : getLocalizedPricingTier(t, locale).title}
                          </span>
                          {cfg.badge && (
                            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                              {cfg.badge}
                            </span>
                          )}
                        </div>
                        <span className={`font-black text-base ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
                          {t === 'basic' && monetizationPolicy?.mode === 'free_experiment'
                            ? 'Zdarma'
                            : cfg.priceLabel}
                        </span>
                      </div>
                      <p className="mt-1.5 pl-6 text-xs text-slate-400">
                        {copy
                          ? t === 'basic'
                            ? copy.tierBasicDesc
                            : copy.tierCompleteDesc
                          : getLocalizedPricingTier(t, locale).shortDescription}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Package info */}
            {packageConfig && (
              <div className="mb-5 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{localizedPackage?.title ?? packageConfig.title}</span>
                  <span className="font-black text-amber-400 text-xl">{packageConfig.priceLabel}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {localizedPackage?.checkoutDescription ?? packageConfig.checkoutDescription}
                </p>
                {packageAppendixNotice ? (
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {packageAppendixNotice}
                  </p>
                ) : null}
              </div>
            )}

            {/* Co je součástí */}
            <div className="mb-5 rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 py-3">
              <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">{copy?.includedHeading ?? 'Součástí je'}</div>
              <ul className="space-y-1.5">
                {[...includedItems, ...selectedAddonItems].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="mt-0.5 text-amber-500 flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {availableAddOns.length > 0 && (
              <div className="mb-5 space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Doplňky k hotovému dokumentu
                </div>
                {availableAddOns.map((addon) => {
                  const isSelected = selectedAddOns.includes(addon.key);
                  return (
                    <button
                      key={addon.key}
                      type="button"
                      onClick={() => toggleAddOn(addon.key)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? 'border-amber-500/60 bg-amber-500/10'
                          : 'border-slate-700/60 bg-white/2 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span
                            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border ${
                              isSelected ? 'border-amber-400 bg-amber-400 text-black' : 'border-slate-600 text-transparent'
                            }`}
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                          <span>
                            <span className="block text-sm font-bold text-white">
                              {addon.title}
                            </span>
                            <span className="mt-1 block text-xs leading-relaxed text-slate-400">
                              {addon.description}
                            </span>
                          </span>
                        </div>
                        <span className={`flex-shrink-0 text-sm font-black ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
                          {CHECKOUT_ADDON_CONFIG[addon.key].priceLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
                {validSelectedAddOns.includes('bilingual_annex') ? (
                  <label className="block rounded-2xl border border-sky-400/20 bg-sky-400/8 p-4">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-sky-200/80">
                      Jazyk vysvětlující přílohy
                    </span>
                    <select
                      data-testid="checkout-annex-language"
                      value={annexLanguage}
                      onChange={(event) => setAnnexLanguage(event.target.value as 'en' | 'ua')}
                      className="mt-2 w-full rounded-xl border border-sky-300/20 bg-[#111c31] px-3 py-2.5 text-sm text-white outline-none focus:border-sky-300/60"
                    >
                      <option value="en">Angličtina / English</option>
                      <option value="ua">Ukrajinština / Українська</option>
                    </select>
                    <span className="mt-2 block text-xs leading-relaxed text-sky-100/70">
                      Český text zůstává rozhodující. Příloha je vysvětlující, nikoli úřední překlad.
                    </span>
                  </label>
                ) : null}
              </div>
            )}

            <div className="mb-5 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Dokument</span>
                <span className="font-semibold text-white">{basePriceCzk.toLocaleString('cs-CZ')} Kč</span>
              </div>
              {addonsTotalCzk > 0 ? (
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-slate-400">Vybrané doplňky</span>
                  <span className="font-semibold text-white">+{addonsTotalCzk.toLocaleString('cs-CZ')} Kč</span>
                </div>
              ) : null}
              <div className="mt-3 flex items-center justify-between border-t border-white/8 pt-3">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Celkem</span>
                <span className="text-xl font-black text-amber-400">{checkoutPrice}</span>
              </div>
            </div>

            {locale !== 'cs' && (
              <div className="mb-5 rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-xs leading-6 text-sky-100">
                {LEGAL_NOTICE[locale]}
              </div>
            )}

            <div className="mb-5 rounded-xl border border-emerald-400/15 bg-emerald-400/8 px-4 py-3 text-xs leading-6 text-emerald-100">
              {isFreeBasic
                ? 'Bez platby a bez registrace. Základní PDF uchováme 24 hodin pro zabezpečené stažení.'
                : (copy?.secureNote ?? 'Platba probíhá bezpečně přes Stripe. Údaje karty se na naše servery nedostávají.')}
              <span className="block text-emerald-100/80">
                {isFreeBasic ? 'Rozšířená varianta s dalšími klauzulemi je nadále placená.' : instantDownloadNote}
              </span>
            </div>

            <div className="mt-auto space-y-4">
              {!isFreeBasic ? <div>
                <label htmlFor="checkout-delivery-email" className="mb-2 block text-xs font-bold text-slate-300">
                  {locale === 'en'
                    ? 'Email for document delivery'
                    : locale === 'ua'
                      ? 'Email для доставки документа'
                      : 'E-mail pro doručení dokumentu'}
                </label>
                <input
                  ref={emailInputRef}
                  id="checkout-delivery-email"
                  data-testid="checkout-delivery-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  value={deliveryEmail}
                  onChange={(event) => setDeliveryEmail(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#111c31] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/70 focus:ring-2 focus:ring-amber-400/20"
                  placeholder={locale === 'cs' ? 'vas@email.cz' : 'you@email.com'}
                />
                <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                  {locale === 'en'
                    ? 'The download link and customer-zone access will be sent only to this address.'
                    : locale === 'ua'
                      ? 'Посилання для завантаження та доступ до кабінету буде надіслано лише на цю адресу.'
                      : 'Odkaz ke stažení a přístup do zákaznické zóny odešleme pouze na tuto adresu.'}
                </p>
              </div> : null}

              {/* Souhlas s OP + vzdání se odstoupení */}
              <label className="flex cursor-pointer items-start gap-3 group">
                <input
                  type="checkbox"
                  data-testid="lease-checkout-consent"
                  checked={gdprConsent}
                  onChange={(e) => setGdprConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 accent-amber-500"
                />
                <span className="text-xs leading-relaxed text-slate-400 group-hover:text-slate-300 transition">
                  {copy?.consentLabel ? (
                    <>
                      {copy.consentLabel}{' '}
                      <a href="/obchodni-podminky" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300">
                        {locale === 'en' ? 'Terms' : locale === 'ua' ? 'Умови' : 'Obchodní podmínky'}
                      </a>
                      {' · '}
                      <a href="/gdpr" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300">
                        {locale === 'en' ? 'Privacy Policy' : locale === 'ua' ? 'Політика конфіденційності' : 'Ochrana osobních údajů'}
                      </a>
                    </>
                  ) : (
                    <>
                      Přijímám{' '}
                      <a href="/obchodni-podminky" target="_blank" className="text-amber-400 underline hover:text-amber-300">obchodní podmínky</a>
                      {' '}a beru na vědomí{' '}
                      <a href="/gdpr" target="_blank" className="text-amber-400 underline hover:text-amber-300">zásady ochrany osobních údajů</a>.
                      Výslovně souhlasím s okamžitým dodáním digitálního obsahu před uplynutím lhůty pro odstoupení a beru na vědomí, že jeho úplným dodáním <strong className="text-slate-300">ztrácím právo na odstoupení od smlouvy</strong> dle § 1837 písm. l) OZ.
                    </>
                  )}
                </span>
              </label>

              {/* Platební tlačítko */}
              <button
                type="button"
                data-testid="lease-checkout-pay"
                onClick={() => {
                  const normalizedEmail = deliveryEmail.trim().toLowerCase();
                  if (!isFreeBasic && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
                    alert(
                      locale === 'en'
                        ? 'Enter a valid delivery email.'
                        : locale === 'ua'
                          ? 'Введіть дійсну email-адресу для доставки.'
                          : 'Zadejte platný e-mail pro doručení dokumentu.',
                    );
                    emailInputRef.current?.focus();
                    return;
                  }
                  if (!gdprConsent) {
                    trackEvent('builder_checkout_consent_missing', {
                      ...analyticsDefaults,
                      source: 'checkout_modal',
                      surface: 'checkout_modal',
                      contract_type: analyticsDefaults.contract_type,
                      tier,
                      package_key: packageConfig?.key,
                      price_band: priceBand,
                      add_on_keys: validAddOnKeys,
                      addons_total_czk: addonsTotalCzk,
                      base_price_czk: basePriceCzk,
                      total_price_czk: totalPriceCzk,
                      selected_addons_count: validSelectedAddOns.length,
                      cta_type: isFreeBasic ? 'free_without_consent' : 'pay_without_consent',
                      monetization_mode: isFreeBasic ? 'free_experiment' : 'paid',
                      experiment_id: monetizationPolicy?.experimentId ?? undefined,
                      variant: monetizationPolicy?.variant ?? undefined,
                    });
                    alert(copy?.gdprRequired ?? 'Potvrďte prosím souhlas se zpracováním osobních údajů.');
                    return;
                  }
                  trackEvent('builder_completed', {
                    ...analyticsDefaults,
                    source: 'checkout_modal',
                    surface: 'checkout_modal',
                    contract_type: analyticsDefaults.contract_type,
                    tier,
                    package_key: packageConfig?.key,
                    price_band: priceBand,
                    add_on_keys: validAddOnKeys,
                    addons_total_czk: addonsTotalCzk,
                    base_price_czk: basePriceCzk,
                    total_price_czk: totalPriceCzk,
                    selected_addons_count: validSelectedAddOns.length,
                    monetization_mode: isFreeBasic ? 'free_experiment' : 'paid',
                    experiment_id: monetizationPolicy?.experimentId ?? undefined,
                    variant: monetizationPolicy?.variant ?? undefined,
                  });
                  const authorization = createCheckoutAuthorization(
                    normalizedEmail,
                    validSelectedAddOns.includes('bilingual_annex') ? annexLanguage : undefined,
                  );
                  if (isFreeBasic && onFreeGenerate) {
                    onFreeGenerate(authorization);
                    return;
                  }
                  trackEvent('builder_checkout_clicked', {
                    ...analyticsDefaults,
                    source: 'checkout_modal',
                    surface: 'checkout_modal',
                    contract_type: analyticsDefaults.contract_type,
                    tier,
                    package_key: packageConfig?.key,
                    price_band: priceBand,
                    add_on_keys: validAddOnKeys,
                    addons_total_czk: addonsTotalCzk,
                    base_price_czk: basePriceCzk,
                    total_price_czk: totalPriceCzk,
                    selected_addons_count: validSelectedAddOns.length,
                    monetization_mode: 'paid',
                  });
                  onPay(
                    validSelectedAddOns,
                    authorization,
                  );
                }}
                disabled={isProcessing}
                className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.25)] active:scale-[0.98] uppercase tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                    {isFreeBasic ? 'Připravuji PDF…' : (copy?.processing ?? 'Přesměrování na platbu…')}
                  </span>
                ) : (
                  isFreeBasic
                    ? 'Vygenerovat základní PDF zdarma →'
                    : copy ? `${copy.payCtaWithPrice} — ${checkoutPrice} →` : `Zaplatit a stáhnout — ${checkoutPrice} →`
                )}
              </button>

              <p className="text-center text-[11px] text-slate-500">
                {isFreeBasic
                  ? '🔒 Zabezpečené stažení · bez Stripe · bez registrace'
                  : (copy?.footerSecure ?? '🔒 Zabezpečená platba přes Stripe · PDF ke stažení ihned')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
