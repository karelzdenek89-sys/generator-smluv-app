'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CheckoutAuthorization } from '@/lib/checkout-authorization';
import Link from 'next/link';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import LeaseBuilderSeoSection from '@/app/components/seo/LeaseBuilderSeoSection';
import ContractPreview from '@/app/components/ContractPreview';
import BuilderCheckoutSummary from '@/app/components/BuilderCheckoutSummary';
import PaymentModal from '@/app/components/LazyPaymentModal';
import BuilderTierSelector from '@/app/components/BuilderTierSelector';
import { useBuilderLocale, useBuilderDocumentTitle } from '@/app/components/BuilderLocaleNotice';
import { getLeaseFormUi } from '@/lib/i18n/lease-form';
import {
  buildLeaseHandoverPreview,
  buildLeasePlainPreview,
  buildLeasePreviewSections,
  getContractPreviewLabels,
  isExpatLeaseLocale,
} from '@/lib/i18n/lease-preview';
import { getThematicPackageConfig } from '@/lib/packages';
import { getPackageAppendixNotice } from '@/lib/i18n/package-upsell';
import { isValidMoney } from '@/lib/money';
import BuilderUserRoleField from '@/app/components/partners/BuilderUserRoleField';
import type { PartnerUserRole } from '@/lib/partners/types';

type LeaseFormData = {
  partnerUserRole: PartnerUserRole;
  landlordName: string;
  landlordId: string;
  landlordAddress: string;
  landlordOP: string;
  landlordEmail: string;
  landlordPhone: string;

  tenantName: string;
  tenantId: string;
  tenantAddress: string;
  tenantOP: string;
  tenantEmail: string;
  tenantPhone: string;

  flatAddress: string;
  flatLayout: string;
  flatArea: string;
  flatUnitNumber: string;
  ownershipSheet: string;
  cadastralArea: string;
  parcelNumber: string;
  floor: string;

  startDate: string;
  handoverDate: string;
  duration: 'fixed' | 'indefinite';
  endDate: string;

  rentAmount: string;
  utilityAmount: string;
  depositAmount: string;
  paymentDay: string;
  bankAccount: string;
  variableSymbol: string;
  utilitiesIncludedText: string;

  keysCount: string;
  electricityMeter: string;
  electricityMeterSerial: string;
  gasMeter: string;
  gasMeterSerial: string;
  waterMeter: string;
  waterMeterSerial: string;
  hotWaterMeter: string;
  hotWaterMeterSerial: string;
  equipmentList: string;
  knownDefects: string;

  allowPets: boolean;
  allowSmoking: boolean;
  allowAirbnb: boolean;
  strictPenalties: boolean;
  inspectionAllowed: boolean;
  maxOccupants: string;
  businessUseAllowed: boolean;
  includeInflationIndexation: boolean;
  lateVacatePenalty: string;

  notaryUpsell: boolean;
  tier: 'basic' | 'complete';
  disputeResolution: 'court' | 'mediation';
};

type RiskLevel = 'low' | 'medium' | 'high';

const inputClass = 'site-input';

const textareaClass = 'site-textarea';

const cardClass = 'builder-card p-6';

function LeaseBuilderContent() {
  const [packageKeyFromUrl, setPackageKeyFromUrl] = useState<string | null>(null);
  const builderLocale = useBuilderLocale();
  const ui = useMemo(() => getLeaseFormUi(builderLocale), [builderLocale]);
  const packageConfig = getThematicPackageConfig(packageKeyFromUrl);
  // Přílohy balíčku jsou dnes pouze české — cizojazyčný zákazník to musí
  // vědět dřív, než vstoupí do placeného toku.
  const packageAppendixNotice = getPackageAppendixNotice(builderLocale);
  const isLandlordPackage = packageConfig?.key === 'landlord';

  useEffect(() => {
    setPackageKeyFromUrl(new URLSearchParams(window.location.search).get('package'));
  }, []);

  useBuilderDocumentTitle(builderLocale, {
    en: 'Rental agreement — online form | SmlouvaHned',
    ua: 'Договір оренди — онлайн-форма | SmlouvaHned',
  });

  const [formData, setFormData] = useState<LeaseFormData>({
    partnerUserRole: 'unknown',
    landlordName: '',
    landlordId: '',
    landlordAddress: '',
    landlordOP: '',
    landlordEmail: '',
    landlordPhone: '',

    tenantName: '',
    tenantId: '',
    tenantAddress: '',
    tenantOP: '',
    tenantEmail: '',
    tenantPhone: '',

    flatAddress: '',
    flatLayout: '',
    flatArea: '',
    flatUnitNumber: '',
    ownershipSheet: '',
    cadastralArea: '',
    parcelNumber: '',
    floor: '',

    startDate: '',
    handoverDate: '',
    duration: 'fixed',
    endDate: '',

    rentAmount: '',
    utilityAmount: '',
    depositAmount: '',
    paymentDay: '15',
    bankAccount: '',
    variableSymbol: '',
    utilitiesIncludedText: '',

    keysCount: '2',
    electricityMeter: '',
    electricityMeterSerial: '',
    gasMeter: '',
    gasMeterSerial: '',
    waterMeter: '',
    waterMeterSerial: '',
    hotWaterMeter: '',
    hotWaterMeterSerial: '',
    equipmentList: '',
    knownDefects: '',

    allowPets: false,
    allowSmoking: false,
    allowAirbnb: false,
    strictPenalties: true,
    inspectionAllowed: true,
    maxOccupants: '2',
    businessUseAllowed: false,
    includeInflationIndexation: false,
    lateVacatePenalty: 'jednodenního nájemného',

    notaryUpsell: isLandlordPackage,
    tier: isLandlordPackage ? 'complete' : ('basic' as const),
    disputeResolution: 'court' as const,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    if (!isLandlordPackage) return;
    setFormData((prev) => ({
      ...prev,
      tier: 'complete',
      notaryUpsell: true,
    }));
  }, [isLandlordPackage]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const numbers = useMemo(() => {
    const rent = Number(formData.rentAmount) || 0;
    const utils = Number(formData.utilityAmount) || 0;
    const deposit = Number(formData.depositAmount) || 0;

    return {
      rent,
      utils,
      deposit,
      total: rent + utils,
    };
  }, [formData.rentAmount, formData.utilityAmount, formData.depositAmount]);

  const completion = useMemo(() => {
    const importantFields = [
      formData.landlordName,
      formData.landlordId,
      formData.landlordAddress,
      formData.landlordOP,
      formData.tenantName,
      formData.tenantId,
      formData.tenantAddress,
      formData.tenantOP,
      formData.flatAddress,
      formData.flatLayout,
      formData.flatUnitNumber,
      formData.cadastralArea,
      formData.startDate,
      formData.handoverDate,
      formData.rentAmount,
      formData.utilityAmount,
      formData.depositAmount,
      formData.bankAccount,
    ];

    const conditionalTotal = formData.duration === 'fixed' ? 1 : 0;
    const conditionalFilled = formData.duration === 'fixed' && formData.endDate ? 1 : 0;

    const filled =
      importantFields.filter((item) => String(item).trim() !== '').length + conditionalFilled;

    const total = importantFields.length + conditionalTotal;

    return Math.round((filled / total) * 100);
  }, [formData]);

  const requiredFieldsMissing = useMemo(() => {
    const missing: string[] = [];
    if (!formData.landlordName.trim()) missing.push(ui.validation.fields.landlordName);
    if (!formData.tenantName.trim()) missing.push(ui.validation.fields.tenantName);
    if (!formData.flatAddress.trim()) missing.push(ui.validation.fields.flatAddress);
    if (!isValidMoney(formData.rentAmount)) missing.push(ui.validation.fields.rentAmount);
    if (!formData.startDate) missing.push(ui.validation.fields.startDate);
    if (formData.duration === 'fixed' && !formData.endDate) missing.push(ui.validation.fields.endDate);
    return missing;
  }, [formData, ui.validation.fields]);

  const canOpenCheckout = requiredFieldsMissing.length === 0;

  const riskAnalysis = useMemo(() => {
    let score = 100;
    const warnings: { text: string; level: RiskLevel }[] = [];

    if (!formData.landlordId || !formData.tenantId || !formData.landlordOP || !formData.tenantOP) {
      score -= 16;
      warnings.push({ text: ui.risk.partyId, level: 'high' });
    }

    if (!formData.flatUnitNumber || !formData.cadastralArea) {
      score -= 10;
      warnings.push({ text: ui.risk.unitId, level: 'high' });
    }

    if (formData.duration === 'fixed' && !formData.endDate) {
      score -= 10;
      warnings.push({ text: ui.risk.endDate, level: 'high' });
    }

    if (numbers.rent > 0 && numbers.deposit < numbers.rent * 2) {
      score -= 12;
      warnings.push({ text: ui.risk.deposit, level: 'medium' });
    }

    if (formData.allowAirbnb) {
      score -= 28;
      warnings.push({ text: ui.risk.airbnb, level: 'high' });
    }

    if (formData.allowSmoking) {
      score -= 8;
      warnings.push({ text: ui.risk.smoking, level: 'medium' });
    }

    if (!formData.strictPenalties) {
      score -= 10;
      warnings.push({ text: ui.risk.penalties, level: 'medium' });
    }

    if (!formData.inspectionAllowed) {
      score -= 6;
      warnings.push({ text: ui.risk.inspection, level: 'low' });
    }

    if (!formData.keysCount || !formData.equipmentList) {
      score -= 6;
      warnings.push({ text: ui.risk.handover, level: 'medium' });
    }

    if (!formData.utilitiesIncludedText.trim()) {
      score -= 5;
      warnings.push({ text: ui.risk.utilities, level: 'low' });
    }

    const rentNum = Number(formData.rentAmount) || 0;
    const depositNum = Number(formData.depositAmount) || 0;
    if (rentNum > 0 && depositNum > rentNum * 3) {
      warnings.push({ text: ui.risk.depositMax, level: 'high' });
    }

    score = Math.max(0, Math.min(100, score));

    const { riskLabels } = ui.sidebar;
    return {
      score,
      warnings,
      label:
        score >= 85 ? riskLabels.good : score >= 70 ? riskLabels.average : riskLabels.improve,
    };
  }, [formData, numbers, ui]);

  const previewContract = useMemo(
    () => buildLeasePlainPreview(builderLocale, formData, numbers.total || 0),
    [builderLocale, formData, numbers.total],
  );

  const handoverProtocol = useMemo(
    () => buildLeaseHandoverPreview(builderLocale, formData),
    [builderLocale, formData],
  );

  const previewSections = useMemo(() => {
    try {
      if (!formData.landlordName && !formData.tenantName) return [];
      return buildLeasePreviewSections(builderLocale, formData, packageConfig?.key ?? null);
    } catch {
      return [];
    }
  }, [builderLocale, formData, packageConfig?.key]);

  const contractPreviewLabels = useMemo(
    () => getContractPreviewLabels(builderLocale),
    [builderLocale],
  );

  const previewDateLocale = builderLocale === 'ua' ? 'uk-UA' : builderLocale === 'en' ? 'en-GB' : 'cs-CZ';

  const handlePayment = async (addOns: string[], authorization: CheckoutAuthorization) => {
    // Validace povinných polí
    const missingFields: string[] = [];
    if (!formData.landlordName.trim()) missingFields.push(ui.validation.fields.landlordName);
    if (!formData.tenantName.trim()) missingFields.push(ui.validation.fields.tenantName);
    if (!formData.flatAddress.trim()) missingFields.push(ui.validation.fields.flatAddress);
    if (!isValidMoney(formData.rentAmount)) missingFields.push(ui.validation.fields.rentAmount);
    if (!formData.startDate) missingFields.push(ui.validation.fields.startDate);
    if (formData.duration === 'fixed' && !formData.endDate) missingFields.push(ui.validation.fields.endDate);

    if (missingFields.length > 0) {
      alert(`${ui.validation.alertPrefix}: ${missingFields.join(', ')}.`);
      return;
    }

    try {
      setIsProcessing(true);

      const payload = {
        ...formData,
        contractType: 'lease' as const,
        lang: builderLocale,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType: 'lease',
          deliveryEmail: authorization.deliveryEmail,
          consent: authorization.consent,
          annexLanguage: authorization.annexLanguage,
          tier: formData.tier,
          packageKey: packageConfig?.key ?? null,
          addOns,
          notaryUpsell: packageConfig ? true : formData.tier !== 'basic',
          lang: builderLocale,
          payload,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result?.url) {
        throw new Error(result?.error || ui.validation.checkoutError);
      }

      window.location.href = result.url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert(ui.validation.paymentError);
      setIsProcessing(false);
    }
  };

  function ToggleCard({
    name,
    checked,
    label,
    hint,
    danger = false,
  }: {
    name: keyof LeaseFormData;
    checked: boolean;
    label: string;
    hint?: string;
    danger?: boolean;
  }) {
    return (
      <label
        className={`block rounded-2xl border p-4 cursor-pointer transition ${
          danger
            ? checked
              ? 'border-rose-500/70 bg-rose-500/10'
              : 'border-rose-900/40 bg-[#111c31]'
            : checked
              ? 'border-amber-500/70 bg-amber-500/10'
              : 'border-slate-700/80 bg-[#111c31]'
        }`}
      >
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            name={String(name)}
            checked={checked}
            onChange={handleChange}
            className={`mt-1 h-5 w-5 ${danger ? 'accent-rose-500' : 'accent-amber-500'}`}
          />
          <div>
            <div className="text-sm font-semibold text-white">{label}</div>
            {hint ? <div className="mt-1 text-xs leading-relaxed text-slate-400">{hint}</div> : null}
          </div>
        </div>
      </label>
    );
  }

  function SectionTitle({
    index,
    title,
    subtitle,
  }: {
    index: string;
    title: string;
    subtitle?: string;
  }) {
    return (
      <div className="mb-6">
        <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90">
          {index}. {title}
        </div>
        {subtitle ? <p className="mt-2 text-sm text-slate-400">{subtitle}</p> : null}
      </div>
    );
  }

  return (
    <>
    <main className="site-page contract-builder pb-24">
      <header className="contract-builder-header">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-sm">
              SH
            </div>
            <div>
              <div className="font-bold tracking-tight text-[#f2e7c8]">SmlouvaHned</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#bba98c]">{ui.header.docType}</div>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = '/')}
            className="text-sm text-[#d2c8b9] hover:text-[#f2e7c8] transition"
          >
            {ui.header.close}
          </button>
        </div>
      </header>

      <ContractLandingSection
        badge={ui.landing.badge}
        h1Main={ui.landing.h1Main}
        h1Accent={ui.landing.h1Accent}
        subtitle={ui.landing.subtitle}
        benefits={ui.landing.benefits}
        contents={ui.landing.contents}
        whenSuitable={ui.landing.whenSuitable}
        whenOther={ui.landing.whenOther}
        faq={ui.landing.faq}
        ctaLabel={ui.landing.ctaLabel}
        formId="formular"
        guideHref="/blog/najemni-smlouva-vzor-2026"
        guideLabel={ui.landing.guideLabel}
      />

      {builderLocale === 'cs' ? <LeaseBuilderSeoSection /> : null}

      {packageConfig ? (
        <section className="mx-auto max-w-7xl px-4 pb-2 lg:px-8">
          <div className="builder-card border-[rgba(214,172,96,0.22)] bg-[rgba(18,14,11,0.74)] p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="site-kicker">{packageConfig.badge}</div>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#f2e7c8]">
                  {packageConfig.builderTitle}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#d7d0c3]">{packageConfig.builderDescription}</p>
              </div>
              <div className="min-w-[180px] rounded-2xl border border-[rgba(214,172,96,0.18)] bg-[rgba(255,255,255,0.03)] px-5 py-4 text-left">
                <div className="mt-2 text-xs leading-6 text-[#bba98c]">{ui.package.packageFlowNote}</div>
                <Link
                  href="/najem"
                  className="mt-3 inline-block text-xs leading-6 text-[#cbbba0] transition hover:text-white"
                >
                  {ui.package.backToSingle}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-4 pb-2 lg:px-8">
          <Link
            href="/balicek-pronajimatel"
            className="builder-card group block border-[rgba(214,172,96,0.16)] bg-[rgba(18,14,11,0.58)] p-6 transition hover:border-[rgba(214,172,96,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(214,172,96,0.45)]"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="site-kicker">{ui.package.thematicBadge}</div>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#f2e7c8]">
                  {ui.package.thematicTitle}
                </h2>
                {packageAppendixNotice ? (
                  <p className="mt-3 text-xs leading-6 text-[#bba98c]">{packageAppendixNotice}</p>
                ) : null}
                <p className="mt-3 text-sm leading-7 text-[#d7d0c3]">
                  {ui.package.thematicDesc}
                </p>
                <p className="mt-3 text-xs leading-6 text-[#bba98c]">
                  {ui.package.thematicHint}{' '}
                  <span className="link-gold-elegant underline">{ui.package.landlordBundleGuideLabel}</span>.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="link-gold-elegant text-sm font-semibold">
                  {ui.package.thematicCta}
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div id="formular" className="lg:col-span-7 space-y-6">
            <div className="mb-6 border-t border-slate-800/60 pt-8"><h2 className="text-lg font-black text-white uppercase tracking-wide">{ui.form.title}</h2><p className="text-sm text-slate-500 mt-1">{ui.form.requiredHint}</p></div>
            <BuilderUserRoleField
              contractType="lease"
              locale={builderLocale}
              value={formData.partnerUserRole}
              onChange={(partnerUserRole) => setFormData((current) => ({ ...current, partnerUserRole }))}
            />
            <section className={cardClass}>
              <SectionTitle
                index={ui.form.sections.landlord.index}
                title={ui.form.sections.landlord.title}
                subtitle={ui.form.sections.landlord.subtitle}
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  value={formData.landlordName}
                  onChange={handleChange}
                  name="landlordName"
                  data-testid="lease-landlord-name"
                  placeholder={ui.form.placeholders.fullName}
                  className={inputClass} aria-label={ui.form.placeholders.fullName} required
                />
                <input
                  value={formData.landlordId}
                  onChange={handleChange}
                  name="landlordId"
                  placeholder={ui.form.placeholders.birthId}
                  className={inputClass} aria-label={ui.form.placeholders.birthId}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  value={formData.landlordAddress}
                  onChange={handleChange}
                  name="landlordAddress"
                  placeholder={ui.form.placeholders.address}
                  className={inputClass} aria-label={ui.form.placeholders.address}
                />
                <input
                  value={formData.landlordOP}
                  onChange={handleChange}
                  name="landlordOP"
                  placeholder={ui.form.placeholders.idCard}
                  className={inputClass} aria-label={ui.form.placeholders.idCard}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  value={formData.landlordEmail}
                  onChange={handleChange}
                  name="landlordEmail"
                  placeholder={ui.form.placeholders.emailOptional}
                  className={inputClass} aria-label={ui.form.placeholders.emailOptional}
                />
                <input
                  value={formData.landlordPhone}
                  onChange={handleChange}
                  name="landlordPhone"
                  placeholder={ui.form.placeholders.phoneOptional}
                  className={inputClass} aria-label={ui.form.placeholders.phoneOptional}
                />
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle
                index={ui.form.sections.tenant.index}
                title={ui.form.sections.tenant.title}
                subtitle={ui.form.sections.tenant.subtitle}
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  value={formData.tenantName}
                  onChange={handleChange}
                  name="tenantName"
                  data-testid="lease-tenant-name"
                  placeholder={ui.form.placeholders.fullName}
                  className={inputClass} aria-label={ui.form.placeholders.fullName} required
                />
                <input
                  value={formData.tenantId}
                  onChange={handleChange}
                  name="tenantId"
                  placeholder={ui.form.placeholders.birthId}
                  className={inputClass} aria-label={ui.form.placeholders.birthId}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  value={formData.tenantAddress}
                  onChange={handleChange}
                  name="tenantAddress"
                  placeholder={ui.form.placeholders.address}
                  className={inputClass} aria-label={ui.form.placeholders.address}
                />
                <input
                  value={formData.tenantOP}
                  onChange={handleChange}
                  name="tenantOP"
                  placeholder={ui.form.placeholders.idCard}
                  className={inputClass} aria-label={ui.form.placeholders.idCard}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  value={formData.tenantEmail}
                  onChange={handleChange}
                  name="tenantEmail"
                  placeholder={ui.form.placeholders.emailOptional}
                  className={inputClass} aria-label={ui.form.placeholders.emailOptional}
                />
                <input
                  value={formData.tenantPhone}
                  onChange={handleChange}
                  name="tenantPhone"
                  placeholder={ui.form.placeholders.phoneOptional}
                  className={inputClass} aria-label={ui.form.placeholders.phoneOptional}
                />
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle
                index={ui.form.sections.property.index}
                title={ui.form.sections.property.title}
                subtitle={ui.form.sections.property.subtitle}
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  value={formData.flatAddress}
                  onChange={handleChange}
                  name="flatAddress"
                  data-testid="lease-flat-address"
                  placeholder={ui.form.placeholders.flatAddress}
                  className={inputClass} aria-label={ui.form.placeholders.flatAddress} required
                />
                <input
                  value={formData.flatLayout}
                  onChange={handleChange}
                  name="flatLayout"
                  placeholder={ui.form.placeholders.layout}
                  className={inputClass} aria-label={ui.form.placeholders.layout}
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <input
                  value={formData.flatUnitNumber}
                  onChange={handleChange}
                  name="flatUnitNumber"
                  placeholder={ui.form.placeholders.unitNumber}
                  className={inputClass} aria-label={ui.form.placeholders.unitNumber}
                />
                <input
                  value={formData.flatArea}
                  onChange={handleChange}
                  name="flatArea"
                  placeholder={ui.form.placeholders.area}
                  className={inputClass} aria-label={ui.form.placeholders.area}
                />
                <input
                  value={formData.floor}
                  onChange={handleChange}
                  name="floor"
                  placeholder={ui.form.placeholders.floor}
                  className={inputClass} aria-label={ui.form.placeholders.floor}
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <input
                  value={formData.ownershipSheet}
                  onChange={handleChange}
                  name="ownershipSheet"
                  placeholder={ui.form.placeholders.ownershipSheet}
                  className={inputClass} aria-label={ui.form.placeholders.ownershipSheet}
                />
                <input
                  value={formData.cadastralArea}
                  onChange={handleChange}
                  name="cadastralArea"
                  placeholder={ui.form.placeholders.cadastral}
                  className={inputClass} aria-label={ui.form.placeholders.cadastral}
                />
                <input
                  value={formData.parcelNumber}
                  onChange={handleChange}
                  name="parcelNumber"
                  placeholder={ui.form.placeholders.parcelOptional}
                  className={inputClass} aria-label={ui.form.placeholders.parcelOptional}
                />
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle
                index={ui.form.sections.term.index}
                title={ui.form.sections.term.title}
                subtitle={ui.form.sections.term.subtitle}
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
                    {ui.form.labels.startDate}
                  </label>
                  <input
                    value={formData.startDate}
                    onChange={handleChange}
                    type="date"
                    name="startDate"
                    data-testid="lease-start-date"
                    className={inputClass} aria-label="Start Date" required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
                    {ui.form.labels.handoverDate}
                  </label>
                  <input
                    value={formData.handoverDate}
                    onChange={handleChange}
                    type="date"
                    name="handoverDate"
                    className={inputClass} aria-label="Handover Date"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <select
                  value={formData.duration}
                  onChange={handleChange}
                  name="duration"
                  className={inputClass}
                  aria-label={ui.form.sections.term.title}
                >
                  <option value="fixed">{ui.form.duration.fixed}</option>
                  <option value="indefinite">{ui.form.duration.indefinite}</option>
                </select>

                {formData.duration === 'fixed' ? (
                  <input
                    value={formData.endDate}
                    onChange={handleChange}
                    type="date"
                    name="endDate"
                    data-testid="lease-end-date"
                    className={inputClass} aria-label="End Date"
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-700 px-4 py-3 text-sm text-slate-500 bg-[#111c31]">
                    {ui.form.duration.indefiniteHint}
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <input
                  value={formData.rentAmount}
                  onChange={handleChange}
                  type="number"
                  name="rentAmount"
                  data-testid="lease-rent-amount"
                  placeholder={ui.form.placeholders.rent}
                  className={inputClass} aria-label={ui.form.placeholders.rent} required
                />
                <input
                  value={formData.utilityAmount}
                  onChange={handleChange}
                  type="number"
                  name="utilityAmount"
                  placeholder={ui.form.placeholders.utilities}
                  className={inputClass} aria-label={ui.form.placeholders.utilities}
                />
                <div>
                  <input
                    value={formData.depositAmount}
                    onChange={handleChange}
                    type="number"
                    name="depositAmount"
                    placeholder={ui.form.placeholders.deposit}
                    className={inputClass} aria-label={ui.form.placeholders.deposit}
                  />
                  {Number(formData.rentAmount) > 0 &&
                    Number(formData.depositAmount) > 0 &&
                    (Number(formData.depositAmount) > Number(formData.rentAmount) * 3 || formData.strictPenalties) && (
                    <p className="mt-1.5 text-xs text-rose-400 font-medium">{ui.form.depositWarning}</p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <input
                  value={formData.bankAccount}
                  onChange={handleChange}
                  name="bankAccount"
                  placeholder={ui.form.placeholders.bankAccount}
                  className={inputClass} aria-label={ui.form.placeholders.bankAccount}
                />
                <input
                  value={formData.paymentDay}
                  onChange={handleChange}
                  type="number"
                  name="paymentDay"
                  placeholder={ui.form.placeholders.paymentDay}
                  className={inputClass} aria-label={ui.form.placeholders.paymentDay}
                />
                <input
                  value={formData.variableSymbol}
                  onChange={handleChange}
                  name="variableSymbol"
                  placeholder={ui.form.placeholders.variableSymbol}
                  className={inputClass} aria-label={ui.form.placeholders.variableSymbol}
                />
              </div>

              <textarea
                value={formData.utilitiesIncludedText}
                onChange={handleChange}
                name="utilitiesIncludedText"
                placeholder={ui.form.placeholders.utilitiesDetail}
                className={textareaClass} aria-label={ui.form.placeholders.utilitiesDetail}
              />

              <div className="mt-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-1">
                  {ui.form.paymentSummary.heading}
                </div>
                <div className="text-sm text-slate-300">
                  {ui.form.paymentSummary.rent}: <span className="font-bold text-white">{numbers.rent || 0} Kč</span> ·
                  {ui.form.paymentSummary.utilities}: <span className="font-bold text-white">{numbers.utils || 0} Kč</span> ·
                  {ui.form.paymentSummary.total}: <span className="font-bold text-emerald-300">{numbers.total || 0} Kč</span>
                </div>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle
                index={ui.form.sections.handover.index}
                title={ui.form.sections.handover.title}
                subtitle={ui.form.sections.handover.subtitle}
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  value={formData.keysCount}
                  onChange={handleChange}
                  type="number"
                  name="keysCount"
                  placeholder={ui.form.placeholders.keysCount}
                  className={inputClass} aria-label={ui.form.placeholders.keysCount}
                />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.10em] text-slate-400 mb-2">{ui.form.labels.metersHeading}</p>
              <div className="grid sm:grid-cols-2 gap-3 mb-2">
                <input
                  value={formData.electricityMeter}
                  onChange={handleChange}
                  name="electricityMeter"
                  placeholder={ui.form.placeholders.electricityReading}
                  className={inputClass} aria-label={ui.form.placeholders.electricityReading}
                />
                <input
                  value={formData.electricityMeterSerial}
                  onChange={handleChange}
                  name="electricityMeterSerial"
                  placeholder={ui.form.placeholders.electricitySerial}
                  className={inputClass} aria-label={ui.form.placeholders.electricitySerial}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mb-2">
                <input
                  value={formData.gasMeter}
                  onChange={handleChange}
                  name="gasMeter"
                  placeholder={ui.form.placeholders.gasReading}
                  className={inputClass} aria-label={ui.form.placeholders.gasReading}
                />
                <input
                  value={formData.gasMeterSerial}
                  onChange={handleChange}
                  name="gasMeterSerial"
                  placeholder={ui.form.placeholders.gasSerial}
                  className={inputClass} aria-label={ui.form.placeholders.gasSerial}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mb-2">
                <input
                  value={formData.waterMeter}
                  onChange={handleChange}
                  name="waterMeter"
                  placeholder={ui.form.placeholders.coldWaterReading}
                  className={inputClass} aria-label={ui.form.placeholders.coldWaterReading}
                />
                <input
                  value={formData.waterMeterSerial}
                  onChange={handleChange}
                  name="waterMeterSerial"
                  placeholder={ui.form.placeholders.coldWaterSerial}
                  className={inputClass} aria-label={ui.form.placeholders.coldWaterSerial}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                <input
                  value={formData.hotWaterMeter}
                  onChange={handleChange}
                  name="hotWaterMeter"
                  placeholder={ui.form.placeholders.hotWaterReading}
                  className={inputClass} aria-label={ui.form.placeholders.hotWaterReading}
                />
                <input
                  value={formData.hotWaterMeterSerial}
                  onChange={handleChange}
                  name="hotWaterMeterSerial"
                  placeholder={ui.form.placeholders.hotWaterSerial}
                  className={inputClass} aria-label={ui.form.placeholders.hotWaterSerial}
                />
              </div>

              <div className="mb-4">
                <textarea
                  value={formData.equipmentList}
                  onChange={handleChange}
                  name="equipmentList"
                  placeholder={ui.form.placeholders.equipment}
                  className={textareaClass} aria-label={ui.form.placeholders.equipment}
                />
              </div>

              <textarea
                value={formData.knownDefects}
                onChange={handleChange}
                name="knownDefects"
                placeholder={ui.form.placeholders.defects}
                className={textareaClass} aria-label={ui.form.placeholders.defects}
              />
            </section>

            <section className={cardClass}>
              <SectionTitle
                index={ui.form.sections.rules.index}
                title={ui.form.sections.rules.title}
                subtitle={ui.form.sections.rules.subtitle}
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <ToggleCard
                  name="allowPets"
                  checked={formData.allowPets}
                  label={ui.form.toggles.pets.label}
                  hint={ui.form.toggles.pets.hint}
                />
                <ToggleCard
                  name="allowSmoking"
                  checked={formData.allowSmoking}
                  label={ui.form.toggles.smoking.label}
                  hint={ui.form.toggles.smoking.hint}
                  danger={formData.allowSmoking}
                />
                <ToggleCard
                  name="allowAirbnb"
                  checked={formData.allowAirbnb}
                  label={ui.form.toggles.airbnb.label}
                  hint={ui.form.toggles.airbnb.hint}
                  danger
                />
                <ToggleCard
                  name="strictPenalties"
                  checked={formData.strictPenalties}
                  label={ui.form.toggles.penalties.label}
                  hint={ui.form.toggles.penalties.hint}
                />
                <ToggleCard
                  name="inspectionAllowed"
                  checked={formData.inspectionAllowed}
                  label={ui.form.toggles.inspection.label}
                  hint={ui.form.toggles.inspection.hint}
                />
                <ToggleCard
                  name="businessUseAllowed"
                  checked={formData.businessUseAllowed}
                  label={ui.form.toggles.business.label}
                  hint={ui.form.toggles.business.hint}
                  danger={formData.businessUseAllowed}
                />
                <ToggleCard
                  name="includeInflationIndexation"
                  checked={formData.includeInflationIndexation}
                  label={ui.form.toggles.indexation.label}
                  hint={ui.form.toggles.indexation.hint}
                />
              </div>

              <div className="rounded-2xl border border-slate-700/80 bg-[#111c31] p-4 w-fit">
                <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                  {ui.form.labels.maxOccupants}
                </div>
                <input
                  value={formData.maxOccupants}
                  onChange={handleChange}
                  type="number"
                  name="maxOccupants"
                  className="bg-transparent w-24 text-2xl font-black text-white outline-none" aria-label="Max Occupants"
                />
              </div>

              <div className="mt-4">
                <input
                  value={formData.lateVacatePenalty}
                  onChange={handleChange}
                  name="lateVacatePenalty"
                  placeholder={ui.form.placeholders.lateVacatePenalty}
                  className={inputClass} aria-label={ui.form.placeholders.lateVacatePenalty}
                />
              </div>
            </section>

            {/* Řešení sporů */}
            <section className={cardClass}>
              <div className="mb-2">
                <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">{ui.form.labels.dispute}</div>
                <select className={inputClass} name="disputeResolution" value={formData.disputeResolution} onChange={(e) => setFormData(p => ({ ...p, disputeResolution: e.target.value as 'court' | 'mediation' }))} aria-label={ui.form.labels.dispute}>
                  <option value="court">{ui.form.dispute.court}</option>
                  <option value="mediation">{ui.form.dispute.mediation}</option>
                </select>
              </div>
            </section>

            {/* === Vyberte úroveň zpracování dokumentu === */}
            <section className={cardClass}>
              <SectionTitle
                index={ui.form.sections.tier.index}
                title={packageConfig ? ui.tier.packageProduct : ui.form.sections.tier.title}
                subtitle={
                  packageConfig
                    ? ui.form.sections.tier.subtitlePackage
                    : ui.form.sections.tier.subtitleChoice
                }
              />
              {packageConfig ? (
                <div className="rounded-2xl border border-[rgba(214,172,96,0.2)] bg-[rgba(214,172,96,0.06)] p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-sm font-black uppercase tracking-[0.16em] text-[#d6ac60]">
                        {packageConfig.title}
                      </div>
                      <p className="mt-2 text-sm leading-7 text-[#d7d0c3]">
                        {packageConfig.checkoutDescription}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="mt-1 text-xs leading-6 text-[#bba98c]">{ui.tier.packageNote}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <BuilderTierSelector
                  contractType="lease"
                  locale={builderLocale}
                  tierSelectorCopy={ui.tierSelector}
                  tier={formData.tier}
                  onTierChange={(tier) =>
                    setFormData((prev) => ({ ...prev, tier, notaryUpsell: tier !== 'basic' }))
                  }
                />
              )}
              {!packageConfig ? (
                <p className="mt-4 text-xs leading-relaxed text-[#b9c1d0]">
                  {ui.form.tierLinkIntro}{' '}
                  <Link href="/balicek-pronajimatel" className="link-gold-elegant">
                    {ui.form.tierLinkLandlord}
                  </Link>
                  . {ui.form.tierPackageGuideNote}{' '}
                  <Link href="/pro-pronajimatele" className="link-gold-elegant">
                    {ui.form.tierLinkGuide}
                  </Link>
                  .
                </p>
              ) : null}
            </section>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 space-y-6">
              {/* Watermarked document preview */}
              {previewSections.length > 0 && (
                <ContractPreview
                  sections={previewSections}
                  title={ui.sidebar.documentTitle}
                  labels={contractPreviewLabels ?? undefined}
                  dateLocale={previewDateLocale}
                />
              )}
              {isExpatLeaseLocale(builderLocale) && ui.sidebar.expatDeliverables?.length ? (
                <div className={`${cardClass} border-amber-500/25 bg-amber-500/5`}>
                  <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-300">
                    {ui.sidebar.expatDeliverablesTitle}
                  </div>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-200">
                    {ui.sidebar.expatDeliverables.map(item => (
                      <li key={item} className="flex gap-2">
                        <span className="text-amber-400" aria-hidden>
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className={`${cardClass} overflow-hidden`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                      {ui.sidebar.completionTitle}
                    </div>
                    <div className="mt-2 text-3xl font-black text-white">{completion}%</div>
                    <div className="mt-1 text-sm text-slate-400">
                      {ui.sidebar.completionHint}
                    </div>
                  </div>
                  <div
                    className={`shrink-0 rounded-2xl px-3 py-2 text-xs font-bold ${
                      completion >= 85
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        : completion >= 60
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                    }`}
                  >
                    {completion >= 85 ? ui.sidebar.badgeReady : completion >= 60 ? ui.sidebar.badgeGood : ui.sidebar.badgeFill}
                  </div>
                </div>

                <div className="mt-4 h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      completion >= 85 ? 'bg-emerald-400' : completion >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                    }`}
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>

              <div className={cardClass}>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="font-black text-white text-sm uppercase tracking-[0.18em]">
                      {ui.sidebar.riskTitle}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">{riskAnalysis.label}</p>
                  </div>
                  <div
                    className={`text-3xl font-black ${
                      riskAnalysis.score >= 85
                        ? 'text-emerald-400'
                        : riskAnalysis.score >= 70
                          ? 'text-amber-400'
                          : 'text-rose-400'
                    }`}
                  >
                    {riskAnalysis.score}/100
                  </div>
                </div>

                <div className="space-y-2">
                  {riskAnalysis.warnings.length > 0 ? (
                    riskAnalysis.warnings.map((warning, i) => (
                      <div
                        key={i}
                        className={`rounded-xl border p-3 text-xs leading-relaxed ${
                          warning.level === 'high'
                            ? 'border-rose-500/20 bg-rose-500/10 text-rose-200'
                            : warning.level === 'medium'
                              ? 'border-amber-500/20 bg-amber-500/10 text-amber-100'
                              : 'border-sky-500/20 bg-sky-500/10 text-sky-100'
                        }`}
                      >
                        {warning.text}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                      {ui.sidebar.riskOk}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] border border-slate-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500" />
                <div className="mb-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                    {ui.sidebar.previewTitle}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {ui.sidebar.previewHint}
                  </div>
                </div>

                <div className="font-serif text-[11px] text-slate-800 leading-relaxed h-[420px] overflow-hidden relative">
                  <div className="space-y-2 break-words">
                    {previewContract.split('\n').map((line, index) => (
                      <p key={`${index}-${line.slice(0, 12)}`} className={line.trim() ? '' : 'h-2'}>
                        {line}
                      </p>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-white to-transparent" />
                </div>
              </div>

              <div className={cardClass}>
                <div className="mb-3">
                  <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                    {ui.sidebar.protocolTitle}
                  </div>
                  <div className="mt-1 text-sm text-slate-400">
                    {ui.sidebar.protocolHint}
                  </div>
                </div>

                <div className="max-h-56 overflow-auto rounded-2xl border border-slate-700/80 bg-[#111c31] p-4">
                  <div className="space-y-1 text-[11px] leading-relaxed text-slate-300 break-words">
                    {handoverProtocol.split('\n').map((line, index) => (
                      <p key={`${index}-${line.slice(0, 12)}`} className={line.trim() ? '' : 'h-2'}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className={cardClass}>
                <BuilderCheckoutSummary
                  contractType="lease"
                  tier={formData.tier}
                  packageKey={packageConfig?.key ?? null}
                  documentLabel={ui.sidebar.checkoutDocument}
                  summaryCopy={ui.checkoutSummary}
                  locale={builderLocale}
                  onUpgrade={() => setFormData((prev) => ({ ...prev, tier: 'complete', notaryUpsell: true }))}
                />

                {/* Tlačítko generování */}
                <button
                  type="button"
                  data-testid="lease-open-checkout"
                  data-builder-generate=""
                  onClick={() => {
                    if (!canOpenCheckout) {
                      alert(`${ui.validation.alertPrefix}: ${requiredFieldsMissing.join(', ')}.`);
                      return;
                    }
                    setShowPreviewModal(true);
                  }}
                  disabled={!canOpenCheckout}
                  aria-disabled={!canOpenCheckout}
                  className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.25)] active:scale-[0.98] uppercase tracking-tight disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:brightness-100 disabled:active:scale-100"
                >
                  {ui.sidebar.generateCta}
                </button>
                {!canOpenCheckout ? (
                  <p className="mt-3 text-xs leading-relaxed text-amber-200/80">
                    {ui.validation.alertPrefix}: {requiredFieldsMissing.join(', ')}.
                  </p>
                ) : null}

                <p className="mt-3 text-center text-[11px] text-slate-500">
                  {ui.sidebar.generateHint}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    {showPreviewModal && (
      <PaymentModal
        sections={previewSections}
        title={ui.sidebar.documentTitle}
        tier={formData.tier}
        onTierChange={(t) => setFormData((prev) => ({ ...prev, tier: t }))}
        packageKey={packageConfig?.key ?? null}
        contractType="lease"
        lang={builderLocale}
        paymentCopy={ui.paymentModal}
        onPay={handlePayment}
        isProcessing={isProcessing}
        onClose={() => setShowPreviewModal(false)}
      />
    )}
    </>
  );
}

export default function LeaseBuilderPage() {
  return <LeaseBuilderContent />;
}



