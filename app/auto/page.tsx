'use client';

import { use, useEffect, useMemo, useState } from 'react';
import type { CheckoutAuthorization } from '@/lib/checkout-authorization';
import Link from 'next/link';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import ContractPreview from '@/app/components/ContractPreview';
import BuilderCheckoutSummary from '@/app/components/BuilderCheckoutSummary';
import BuilderTierSelector from '@/app/components/BuilderTierSelector';
import type { StoredContractData } from '@/lib/contracts';
import { getThematicPackageConfig } from '@/lib/packages';
import { getPackageBuilderFlowCopy, getPackageUpsellCopy } from '@/lib/i18n/package-upsell';
import { getCarFormUi } from '@/lib/i18n/expat-builder-forms';
import { carRiskWarnings, carValidationFields } from '@/lib/i18n/expat-builder-risk';
import {
  buildExpatPreviewSections,
  getExpatPreviewLabels,
} from '@/lib/i18n/expat-contract-preview';
import PaymentModal from '@/app/components/LazyPaymentModal';
import { useBuilderLocale, useBuilderDocumentTitle } from '@/app/components/BuilderLocaleNotice';
import LocalizedBuilderShell from '@/app/components/LocalizedBuilderShell';
import {
  getBuilderLocaleFromSearchParams,
  type BuilderSearchParams,
} from '@/lib/locale';
import { isValidMoney } from '@/lib/money';
import BuilderUserRoleField from '@/app/components/partners/BuilderUserRoleField';
import type { PartnerUserRole } from '@/lib/partners/types';

type PaymentMethod = 'cash' | 'transfer';

type CarSaleFormData = {
  partnerUserRole: PartnerUserRole;
  sellerName: string;
  sellerId: string;
  sellerAddress: string;
  sellerOP: string;
  sellerEmail: string;
  sellerPhone: string;

  buyerName: string;
  buyerId: string;
  buyerAddress: string;
  buyerOP: string;
  buyerEmail: string;
  buyerPhone: string;

  carMake: string;
  carModel: string;
  carVIN: string;
  carPlate: string;
  carYear: string;
  carFirstRegistration: string;
  carMileage: string;
  carColor: string;
  fuelType: string;
  engineCapacity: string;
  powerKW: string;
  techCardNumber: string;
  stkValidUntil: string;
  emissionsValidUntil: string;
  previousOwnersCount: string;
  vehicleOrigin: string;

  priceAmount: string;
  priceWords: string;
  paymentMethod: PaymentMethod;
  bankAccount: string;
  variableSymbol: string;
  paymentDueDays: string;
  handoverDate: string;
  handoverPlace: string;
  ownershipTransferMoment: 'payment' | 'handover';

  keysCount: string;
  tiresInfo: string;
  documentsIncluded: string;
  equipmentIncluded: string;
  knownDefects: string;
  serviceHistory: boolean;
  accidentHistory: boolean;
  strictWarranties: boolean;

  isPledged: boolean;
  isInLeasing: boolean;
  hasThirdPartyRights: boolean;
  odometerGuaranteed: boolean;
  buyerInspectedVehicle: boolean;
  testDriveCompleted: boolean;
  mechanicInspectionOffered: boolean;
  buyerLatePenalty: string;
  sellerLatePenalty: string;
  hiddenDefectPenalty: string;
  declarationPenalty: string;

  notaryUpsell: boolean;
  tier: 'basic' | 'complete';
  disputeResolution: 'court' | 'mediation';
};

const inputClass = 'site-input';

const textareaClass = 'site-textarea';

const cardClass = 'builder-card p-6';

function CarSaleBuilderContent() {
  const [packageKeyFromUrl, setPackageKeyFromUrl] = useState<string | null>(null);
  const builderLocale = useBuilderLocale();
  const ui = useMemo(() => getCarFormUi(builderLocale), [builderLocale]);
  // Balíček je aktivní nabídka i v cizojazyčném builderu — musí být v jeho jazyce.
  const packageUpsell = useMemo(
    () => getPackageUpsellCopy('vehicle_sale', builderLocale),
    [builderLocale],
  );
  const packageFlowCopy = useMemo(
    () => getPackageBuilderFlowCopy('vehicle_sale', builderLocale),
    [builderLocale],
  );
  useBuilderDocumentTitle(builderLocale, {
    en: 'Car purchase agreement — online form | SmlouvaHned',
    ua: 'Договір купівлі-продажу авто — онлайн-форма | SmlouvaHned',
  });
  const fl = (k: string, cs: string) => ui.fields[k] ?? cs;
  const sec = (k: string, title: string, subtitle?: string) => {
    const s = ui.sections[k];
    return { title: s?.title ?? title, subtitle: s?.subtitle ?? subtitle };
  };
  const previewLabels = useMemo(() => getExpatPreviewLabels(builderLocale), [builderLocale]);
  const packageConfig = getThematicPackageConfig(packageKeyFromUrl);
  const isVehiclePackage = packageConfig?.key === 'vehicle_sale';

  useEffect(() => {
    setPackageKeyFromUrl(new URLSearchParams(window.location.search).get('package'));
  }, []);

  const [formData, setFormData] = useState<CarSaleFormData>({
    partnerUserRole: 'unknown',
    sellerName: '',
    sellerId: '',
    sellerAddress: '',
    sellerOP: '',
    sellerEmail: '',
    sellerPhone: '',

    buyerName: '',
    buyerId: '',
    buyerAddress: '',
    buyerOP: '',
    buyerEmail: '',
    buyerPhone: '',

    carMake: '',
    carModel: '',
    carVIN: '',
    carPlate: '',
    carYear: '',
    carFirstRegistration: '',
    carMileage: '',
    carColor: '',
    fuelType: '',
    engineCapacity: '',
    powerKW: '',
    techCardNumber: '',
    stkValidUntil: '',
    emissionsValidUntil: '',
    previousOwnersCount: '',
    vehicleOrigin: 'ČR',

    priceAmount: '',
    priceWords: '',
    paymentMethod: 'transfer',
    bankAccount: '',
    variableSymbol: '',
    paymentDueDays: '3',
    handoverDate: '',
    handoverPlace: '',
    ownershipTransferMoment: 'payment',

    keysCount: '2',
    tiresInfo: '',
    documentsIncluded:
      'malý technický průkaz / osvědčení o registraci vozidla, servisní knížka, protokol STK',
    equipmentIncluded: '',
    knownDefects: '',
    serviceHistory: true,
    accidentHistory: false,
    strictWarranties: true,

    isPledged: false,
    isInLeasing: false,
    hasThirdPartyRights: false,
    odometerGuaranteed: true,
    buyerInspectedVehicle: true,
    testDriveCompleted: false,
    mechanicInspectionOffered: false,
    buyerLatePenalty: '0,05',
    sellerLatePenalty: '',
    hiddenDefectPenalty: '',
    declarationPenalty: '',

    notaryUpsell: isVehiclePackage,
    tier: isVehiclePackage ? ('complete' as const) : ('basic' as const),
    disputeResolution: 'court' as const,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    if (!isVehiclePackage) return;
    setFormData((prev) => ({
      ...prev,
      tier: 'complete',
      notaryUpsell: true,
    }));
  }, [isVehiclePackage]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const priceNumber = useMemo(() => Number(formData.priceAmount) || 0, [formData.priceAmount]);

  const completion = useMemo(() => {
    const fields = [
      formData.sellerName,
      formData.buyerName,
      formData.carVIN,
      formData.carMake,
      formData.priceAmount,
    ];
    const filled = fields.filter((f) => f.trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  }, [formData]);

  const validationFields = useMemo(
    () => carValidationFields(builderLocale),
    [builderLocale],
  );

  const riskAnalysis = useMemo(() => {
    const { warnings, checkoutBlocked } = carRiskWarnings(builderLocale, formData, priceNumber);
    const penalty = warnings.reduce(
      (sum, w) => sum + (w.level === 'high' ? 18 : w.level === 'medium' ? 10 : 5),
      0,
    );
    const score = Math.max(0, Math.min(100, 100 - penalty));
    return {
      score,
      warnings,
      label:
        score >= 85 ? ui.risk.good : score >= 70 ? ui.risk.average : ui.risk.needsWork,
      checkoutBlocked,
    };
  }, [formData, priceNumber, builderLocale, ui.risk]);

  const previewContract = useMemo(() => {
    return `KUPNÍ SMLOUVA O PRODEJI OJETÉHO VOZIDLA

Prodávající: ${formData.sellerName || '...'}
Kupující: ${formData.buyerName || '...'}

Vozidlo: ${formData.carMake || '...'} ${formData.carModel || '...'}
VIN: ${formData.carVIN || '...'}
SPZ: ${formData.carPlate || '...'}
Rok výroby: ${formData.carYear || '...'}
Stav tachometru: ${formData.carMileage || '0'} km

Kupní cena: ${formData.priceAmount || '0'} Kč
Způsob úhrady: ${formData.paymentMethod === 'transfer' ? 'Bankovní převod' : 'Hotovost'}
Datum předání: ${formData.handoverDate || '...'}
Místo předání: ${formData.handoverPlace || '...'}

Známé vady:
${formData.knownDefects || 'Bez výslovně uvedených vad.'}`.trim();
  }, [formData]);

  const handoverProtocol = useMemo(() => {
    return `PŘEDÁVACÍ PROTOKOL K VOZIDLU

Prodávající: ${formData.sellerName || '................'}
Kupující: ${formData.buyerName || '................'}

Vozidlo: ${formData.carMake || ''} ${formData.carModel || ''}
VIN: ${formData.carVIN || '................'}
SPZ: ${formData.carPlate || '................'}
Datum předání: ${formData.handoverDate || '................'}
Místo předání: ${formData.handoverPlace || '................'}

1. Stav při předání
- Stav tachometru: ${formData.carMileage || '................'} km
- Počet klíčů: ${formData.keysCount || '................'} ks
- Pneumatiky / kola: ${formData.tiresInfo || '................'}

2. Předané doklady
${formData.documentsIncluded || '................'}

3. Předané příslušenství
${formData.equipmentIncluded || '................'}

4. Známé vady a poškození
${formData.knownDefects || 'Bez výslovně uvedených vad.'}`.trim();
  }, [formData]);

  const previewSections = useMemo(() => {
    try {
      if (!formData.sellerName) return [];
      return buildExpatPreviewSections('car_sale', builderLocale, {
        ...formData,
        contractType: 'car_sale',
        packageKey: packageConfig?.key ?? null,
      } as StoredContractData);
    } catch {
      return [];
    }
  }, [formData, packageConfig?.key, builderLocale]);

  async function handlePayment(addOns: string[], authorization: CheckoutAuthorization) {
    if (riskAnalysis.checkoutBlocked) {
      alert(
        builderLocale === 'en'
          ? 'Cash payment over CZK 270,000 is not allowed. Switch to bank transfer.'
          : builderLocale === 'ua'
            ? 'Готівка понад 270 000 Kč заборонена. Оберіть банківський переказ.'
            : 'Hotovostní platba nad 270 000 Kč není možná. Změň způsob úhrady na bankovní převod.',
      );
      return;
    }

    const missingFields: string[] = [];
    if (!formData.sellerName.trim()) missingFields.push(validationFields.sellerName);
    if (!formData.buyerName.trim()) missingFields.push(validationFields.buyerName);
    if (!formData.carMake.trim()) missingFields.push(validationFields.carMake);
    if (!formData.carVIN.trim()) missingFields.push(validationFields.carVIN);
    if (!isValidMoney(formData.priceAmount)) missingFields.push(validationFields.priceAmount);

    if (missingFields.length > 0) {
      alert(`${ui.form.validationPrefix} ${missingFields.join(', ')}.`);
      return;
    }

    try {
      setIsProcessing(true);

      const payload = {
        ...formData,
        contractType: 'car_sale' as const,
        packageKey: packageConfig?.key ?? null,
        lang: builderLocale,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType: 'car_sale',
          deliveryEmail: authorization.deliveryEmail,
          consent: authorization.consent,
          analyticsConsentGranted: authorization.analyticsConsentGranted,
          analyticsAttribution: authorization.analyticsAttribution,
          annexLanguage: authorization.annexLanguage,
          tier: packageConfig ? packageConfig.defaultTier : formData.tier,
          packageKey: packageConfig?.key ?? null,
          addOns,
          notaryUpsell: packageConfig ? true : formData.tier !== 'basic',
          lang: builderLocale,
          payload,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result?.url) {
        throw new Error(result?.error || 'Nepodařilo se vytvořit checkout session.');
      }

      window.location.href = result.url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert(ui.form.paymentError);
      setIsProcessing(false);
    }
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

  function ToggleCard({
    name,
    checked,
    label,
    hint,
    danger = false,
  }: {
    name: keyof CarSaleFormData;
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

  return (
    <>
    <main className="site-page contract-builder pb-24">
      <header className="contract-builder-header">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-[11px]">
              AUTO
            </div>
            <div>
              <div className="font-bold tracking-tight text-[#f2e7c8] uppercase">{ui.header.brand}</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#bba98c]">
                {ui.header.docType}
              </div>
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
        guideHref={ui.landing.guideHref}
        guideLabel={ui.landing.guideLabel}
      />

      {packageConfig ? (
        <div className="max-w-7xl mx-auto px-4 pt-8 lg:px-8">
          <div className="rounded-[1.75rem] border border-amber-500/20 bg-[rgba(255,255,255,0.04)] p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">
              {packageUpsell?.badge ?? packageConfig.badge}
            </div>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  {packageUpsell?.title ?? packageConfig.builderTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {packageUpsell?.body ?? packageConfig.builderDescription}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/4 px-5 py-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {packageFlowCopy?.priceHeading}
                </div>
                <div className="mt-2 text-3xl font-black tracking-tight text-white">
                  {packageConfig.priceLabel}
                </div>
                <Link
                  href="/auto"
                  className="mt-3 inline-block text-xs leading-relaxed text-[#cbbba0] transition hover:text-white"
                >
                  {packageFlowCopy?.backToStandalone}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : packageUpsell ? (
        <div className="max-w-7xl mx-auto px-4 pt-8 lg:px-8">
          <div className="interactive-card block rounded-[1.75rem] border border-[rgba(197,160,89,0.18)] bg-[rgba(255,255,255,0.035)] p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">
              {packageUpsell.badge}
            </div>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  {packageUpsell.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {packageUpsell.body}
                </p>
                {packageUpsell.appendixNotice ? (
                  <p className="mt-3 text-xs leading-6 text-[#bba98c]">
                    {packageUpsell.appendixNotice}
                  </p>
                ) : (
                  <p className="mt-3 text-xs leading-6 text-[#bba98c]">
                    Pokud si nejste jistí, kterou cestu zvolit, pomůže vám orientační stránka{' '}
                    <Link href="/prodej-vozidla" className="link-gold-elegant">
                      Podklady pro prodej vozidla
                    </Link>
                    .
                  </p>
                )}
              </div>
              <Link
                href="/balicek-prodej-vozidla"
                className="link-gold-elegant text-sm font-semibold"
              >
                {packageUpsell.cta}
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8" id="formular">
        <div className="mb-6 border-t border-slate-800/60 pt-8">
          <h2 className="text-lg font-black text-white uppercase tracking-wide">{ui.form.title}</h2>
          <p className="text-sm text-slate-500 mt-1">{ui.form.requiredHint}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <BuilderUserRoleField
              contractType="car_sale"
              locale={builderLocale}
              value={formData.partnerUserRole}
              onChange={(partnerUserRole) => setFormData((current) => ({ ...current, partnerUserRole }))}
            />
            <section className={cardClass}>
              <SectionTitle
                index="01"
                title={sec('s01', 'Smluvní strany').title}
                subtitle={sec('s01', 'Smluvní strany', 'Doplň co nejpřesnější identifikaci obou stran. To je základ vymahatelnosti.').subtitle}
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  name="sellerName"
                  value={formData.sellerName}
                  onChange={handleChange}
                  placeholder={fl('sellerName', 'Prodávající – celé jméno')}
                  className={inputClass} aria-label={fl('sellerName', 'Prodávající – celé jméno')} required
                />
                <input
                  name="sellerId"
                  value={formData.sellerId}
                  onChange={handleChange}
                  placeholder={fl('sellerId', 'Prodávající – RČ / datum narození')}
                  className={inputClass} aria-label={fl('sellerId', 'Prodávající – RČ / datum narození')}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  name="sellerAddress"
                  value={formData.sellerAddress}
                  onChange={handleChange}
                  placeholder={fl('sellerAddress', 'Prodávající – adresa')}
                  className={inputClass} aria-label={fl('sellerAddress', 'Prodávající – adresa')}
                />
                <input
                  name="sellerOP"
                  value={formData.sellerOP}
                  onChange={handleChange}
                  placeholder={fl('sellerOP', 'Prodávající – číslo OP')}
                  className={inputClass} aria-label={fl('sellerOP', 'Prodávající – číslo OP')}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <input
                  type="email"
                  name="sellerEmail"
                  value={formData.sellerEmail}
                  onChange={handleChange}
                  placeholder={fl('sellerEmail', 'Prodávající – e-mail (volitelné)')}
                  className={inputClass} aria-label={fl('sellerEmail', 'Prodávající – e-mail (volitelné)')}
                />
                <input
                  name="sellerPhone"
                  value={formData.sellerPhone}
                  onChange={handleChange}
                  placeholder={fl('sellerPhone', 'Prodávající – telefon (volitelné)')}
                  className={inputClass} aria-label={fl('sellerPhone', 'Prodávající – telefon (volitelné)')}
                />
              </div>

              <div className="border-t border-white/5 pt-6">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input
                    name="buyerName"
                    value={formData.buyerName}
                    onChange={handleChange}
                    placeholder={fl('buyerName', 'Kupující – celé jméno')}
                    className={inputClass} aria-label={fl('buyerName', 'Kupující – celé jméno')} required
                  />
                  <input
                    name="buyerId"
                    value={formData.buyerId}
                    onChange={handleChange}
                    placeholder={fl('buyerId', 'Kupující – RČ / datum narození')}
                    className={inputClass} aria-label={fl('buyerId', 'Kupující – RČ / datum narození')}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input
                    name="buyerAddress"
                    value={formData.buyerAddress}
                    onChange={handleChange}
                    placeholder={fl('buyerAddress', 'Kupující – adresa')}
                    className={inputClass} aria-label={fl('buyerAddress', 'Kupující – adresa')}
                  />
                  <input
                    name="buyerOP"
                    value={formData.buyerOP}
                    onChange={handleChange}
                    placeholder={fl('buyerOP', 'Kupující – číslo OP')}
                    className={inputClass} aria-label={fl('buyerOP', 'Kupující – číslo OP')}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="email"
                    name="buyerEmail"
                    value={formData.buyerEmail}
                    onChange={handleChange}
                    placeholder={fl('buyerEmail', 'Kupující – e-mail (volitelné)')}
                    className={inputClass} aria-label={fl('buyerEmail', 'Kupující – e-mail (volitelné)')}
                  />
                  <input
                    name="buyerPhone"
                    value={formData.buyerPhone}
                    onChange={handleChange}
                    placeholder={fl('buyerPhone', 'Kupující – telefon (volitelné)')}
                    className={inputClass} aria-label={fl('buyerPhone', 'Kupující – telefon (volitelné)')}
                  />
                </div>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle
                index="02"
                title={sec('s02', 'Specifikace vozidla').title}
                subtitle={sec('s02', 'Specifikace vozidla', 'Každá změna se okamžitě promítne do náhledu vpravo.').subtitle}
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  name="carMake"
                  value={formData.carMake}
                  onChange={handleChange}
                  placeholder={fl('carMake', 'Značka')}
                  className={inputClass} aria-label={fl('carMake', 'Značka')} required
                />
                <input
                  name="carModel"
                  value={formData.carModel}
                  onChange={handleChange}
                  placeholder={fl('carModel', 'Model')}
                  className={inputClass} aria-label={fl('carModel', 'Model')}
                />
              </div>

              <input
                name="carVIN"
                value={formData.carVIN}
                onChange={handleChange}
                placeholder={fl('carVIN', 'VIN (17 znaků)')}
                className={`${inputClass} font-mono tracking-widest mb-4`} aria-label={fl('carVIN', 'VIN (17 znaků)')} required
              />

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <input
                  type="number"
                  name="carYear"
                  value={formData.carYear}
                  onChange={handleChange}
                  placeholder={fl('carYear', 'Rok výroby')}
                  className={inputClass} aria-label={fl('carYear', 'Rok výroby')}
                />
                <input
                  type="number"
                  name="carMileage"
                  value={formData.carMileage}
                  onChange={handleChange}
                  placeholder={fl('carMileage', 'Nájezd (km)')}
                  className={inputClass} aria-label={fl('carMileage', 'Nájezd (km)')}
                />
                <input
                  name="carPlate"
                  value={formData.carPlate}
                  onChange={handleChange}
                  placeholder={fl('carPlate', 'SPZ')}
                  className={inputClass} aria-label={fl('carPlate', 'SPZ')}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <input
                  name="carColor"
                  value={formData.carColor}
                  onChange={handleChange}
                  placeholder={fl('carColor', 'Barva')}
                  className={inputClass} aria-label={fl('carColor', 'Barva')}
                />
                <input
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  placeholder={fl('fuelType', 'Palivo')}
                  className={inputClass} aria-label={fl('fuelType', 'Palivo')}
                />
                <input
                  name="carFirstRegistration"
                  value={formData.carFirstRegistration}
                  onChange={handleChange}
                  placeholder={fl('carFirstRegistration', 'První registrace')}
                  className={inputClass} aria-label={fl('carFirstRegistration', 'První registrace')}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <input
                  name="engineCapacity"
                  value={formData.engineCapacity}
                  onChange={handleChange}
                  placeholder={fl('engineCapacity', 'Objem (cm³)')}
                  className={inputClass} aria-label={fl('engineCapacity', 'Objem (cm³)')}
                />
                <input
                  name="powerKW"
                  value={formData.powerKW}
                  onChange={handleChange}
                  placeholder={fl('powerKW', 'Výkon (kW)')}
                  className={inputClass} aria-label={fl('powerKW', 'Výkon (kW)')}
                />
                <input
                  name="techCardNumber"
                  value={formData.techCardNumber}
                  onChange={handleChange}
                  placeholder={fl('techCardNumber', 'Číslo technického průkazu')}
                  className={inputClass} aria-label={fl('techCardNumber', 'Číslo technického průkazu')}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.10em] text-slate-400 mb-1.5">{fl('stkValidUntil', 'STK platná do')}</label>
                  <input
                    type="date"
                    name="stkValidUntil"
                    value={formData.stkValidUntil}
                    onChange={handleChange}
                    className={inputClass} aria-label="Stk Valid Until"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.10em] text-slate-400 mb-1.5">{fl('emissionsValidUntil', 'Emise platné do')}</label>
                  <input
                    type="date"
                    name="emissionsValidUntil"
                    value={formData.emissionsValidUntil}
                    onChange={handleChange}
                    className={inputClass} aria-label="Emissions Valid Until"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  name="previousOwnersCount"
                  value={formData.previousOwnersCount}
                  onChange={handleChange}
                  placeholder={fl('previousOwnersCount', 'Počet předchozích vlastníků')}
                  className={inputClass} aria-label={fl('previousOwnersCount', 'Počet předchozích vlastníků')}
                />
                <input
                  name="vehicleOrigin"
                  value={formData.vehicleOrigin}
                  onChange={handleChange}
                  placeholder={fl('vehicleOrigin', 'Původ vozidla')}
                  className={inputClass} aria-label={fl('vehicleOrigin', 'Původ vozidla')}
                />
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle
                index="03"
                title={sec('s03', 'Cena, úhrada a předání').title}
                subtitle={sec('s03', 'Cena, úhrada a předání', 'Tyto údaje se okamžitě propsají do smlouvy.').subtitle}
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  type="number"
                  name="priceAmount"
                  value={formData.priceAmount}
                  onChange={handleChange}
                  placeholder={fl('priceAmount', 'Kupní cena (Kč)')}
                  className={`${inputClass} text-xl font-bold`} aria-label={fl('priceAmount', 'Kupní cena (Kč)')} required
                />
                <input
                  name="priceWords"
                  value={formData.priceWords}
                  onChange={handleChange}
                  placeholder={fl('priceWords', 'Kupní cena slovy')}
                  className={inputClass} aria-label={fl('priceWords', 'Kupní cena slovy')}
                />
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className={inputClass}
                  aria-label={fl('paymentMethod', 'Způsob úhrady')}
                >
                  <option value="transfer">{fl('payment_transfer', 'Bankovní převod')}</option>
                  <option value="cash">{fl('payment_cash', 'Hotovost')}</option>
                </select>
              </div>

              {formData.paymentMethod === 'transfer' ? (
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleChange}
                    placeholder={fl('bankAccount', 'Číslo účtu prodávajícího')}
                    className={inputClass} aria-label={fl('bankAccount', 'Číslo účtu prodávajícího')}
                  />
                  <input
                    name="variableSymbol"
                    value={formData.variableSymbol}
                    onChange={handleChange}
                    placeholder={fl('variableSymbol', 'Variabilní symbol')}
                    className={inputClass} aria-label={fl('variableSymbol', 'Variabilní symbol')}
                  />
                  <input
                    type="number"
                    name="paymentDueDays"
                    value={formData.paymentDueDays}
                    onChange={handleChange}
                    placeholder={fl('paymentDueDays', 'Splatnost převodu (pracovní dny)')}
                    className={inputClass} aria-label={fl('paymentDueDays', 'Splatnost převodu (pracovní dny)')}
                  />
                </div>
              ) : (
                <div className="mb-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                  {fl('cashLimitWarning', 'U hotovosti zkontroluj zákonný limit. Nad 270 000 Kč checkout zablokuji.')}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  type="date"
                  name="handoverDate"
                  value={formData.handoverDate}
                  onChange={handleChange}
                  aria-label={fl('handoverDate', 'Datum předání')}
                  className={inputClass}
                />
                <input
                  name="handoverPlace"
                  value={formData.handoverPlace}
                  onChange={handleChange}
                  placeholder={fl('handoverPlace', 'Místo předání')}
                  className={inputClass} aria-label={fl('handoverPlace', 'Místo předání')}
                />
              </div>

              <select
                name="ownershipTransferMoment"
                value={formData.ownershipTransferMoment}
                onChange={handleChange}
                className={inputClass}
                aria-label={fl('ownershipTransferMoment', 'Okamžik přechodu vlastnictví')}
              >
                <option value="payment">{fl('ownershipTransfer_payment', 'Vlastnictví přechází zaplacením')}</option>
                <option value="handover">{fl('ownershipTransfer_handover', 'Vlastnictví přechází předáním')}</option>
              </select>
            </section>

            <section className={cardClass}>
              <SectionTitle
                index="04"
                title={sec('s04', 'Technický stav a předání').title}
                subtitle={sec('s04', 'Technický stav a předání', 'Tato část chrání hlavně prodávajícího proti budoucím sporům.').subtitle}
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  type="number"
                  name="keysCount"
                  value={formData.keysCount}
                  onChange={handleChange}
                  placeholder="Počet klíčů"
                  className={inputClass} aria-label="Počet klíčů"
                />
                <input
                  name="tiresInfo"
                  value={formData.tiresInfo}
                  onChange={handleChange}
                  placeholder="Pneumatiky / kola"
                  className={inputClass} aria-label="Pneumatiky / kola"
                />
              </div>

              <div className="mb-4">
                <textarea
                  name="knownDefects"
                  value={formData.knownDefects}
                  onChange={handleChange}
                  placeholder="Popiš všechny známé vady: lak, koroze, motor, převodovka, podvozek, elektronika, klima, interiér..."
                  className={textareaClass} aria-label="Popiš všechny známé vady: lak, koroze, motor, převodovka, podvozek, elektronika, klima, interiér..."
                />
              </div>

              <div className="mb-4">
                <textarea
                  name="documentsIncluded"
                  value={formData.documentsIncluded}
                  onChange={handleChange}
                  placeholder="Předané doklady"
                  className={textareaClass} aria-label="Předané doklady"
                />
              </div>

              <textarea
                name="equipmentIncluded"
                value={formData.equipmentIncluded}
                onChange={handleChange}
                placeholder="Předané příslušenství a výbava: sada kol, rezervní klíč, střešní nosič, rádio, zimní pneu..."
                className={textareaClass} aria-label="Předané příslušenství a výbava: sada kol, rezervní klíč, střešní nosič, rádio, zimní pneu..."
              />
            </section>

            <section className={cardClass}>
              <SectionTitle
                index="05"
                title={sec('s05', 'Právní nastavení').title}
                subtitle={sec('s05', 'Právní nastavení', 'Přepínače mění obsah smlouvy i risk score.').subtitle}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <ToggleCard
                  name="serviceHistory"
                  checked={formData.serviceHistory}
                  label={fl('serviceHistory', 'Servisní historie k dispozici')}
                  hint="Ve smlouvě se uvede, že je servisní historie nebo knížka předána."
                />
                <ToggleCard
                  name="accidentHistory"
                  checked={formData.accidentHistory}
                  label={fl('accidentHistory', 'Vozidlo bylo havarováno')}
                  hint="Pokud ano, je lepší to přiznat výslovně a přesně."
                  danger={formData.accidentHistory}
                />
                <ToggleCard
                  name="strictWarranties"
                  checked={formData.strictWarranties}
                  label={fl('strictWarranties', 'Přísnější právní prohlášení')}
                  hint="Doporučená volba. Posiluje text o vadách, právních omezeních a stavu vozidla."
                />
                <ToggleCard
                  name="odometerGuaranteed"
                  checked={formData.odometerGuaranteed}
                  label={fl('odometerGuaranteed', 'Garantovat stav tachometru')}
                  hint="Silnější ochrana kupujícího, ale jen pokud si jsi tím jistý."
                />
                <ToggleCard
                  name="buyerInspectedVehicle"
                  checked={formData.buyerInspectedVehicle}
                  label={fl('buyerInspectedVehicle', 'Kupující vozidlo prohlédl')}
                  hint="Doporučená volba. Snižuje prostor pro pozdější námitky."
                />
                <ToggleCard
                  name="testDriveCompleted"
                  checked={formData.testDriveCompleted}
                  label={fl('testDriveCompleted', 'Proběhla zkušební jízda')}
                  hint="Zkušební jízda proběhla před podpisem smlouvy. Uvede se v sekci prohlídky."
                />
                <ToggleCard
                  name="mechanicInspectionOffered"
                  checked={formData.mechanicInspectionOffered}
                  label={fl('mechanicInspectionOffered', 'Kupující měl možnost prověřit vozidlo mechanikem')}
                  hint="Prodávající umožnil nezávislou technickou prohlídku. Posiluje postavení při případném sporu o vady."
                />
                <ToggleCard
                  name="isPledged"
                  checked={formData.isPledged}
                  label={fl('isPledged', 'Na vozidle vázne zástava')}
                  hint="Musí být výslovně uvedeno."
                  danger={formData.isPledged}
                />
                <ToggleCard
                  name="isInLeasing"
                  checked={formData.isInLeasing}
                  label={fl('isInLeasing', 'Vozidlo je v leasingu / financování')}
                  hint="Zásadní právní informace."
                  danger={formData.isInLeasing}
                />
                <ToggleCard
                  name="hasThirdPartyRights"
                  checked={formData.hasThirdPartyRights}
                  label={fl('hasThirdPartyRights', 'Existují práva třetích osob')}
                  hint="Např. společné vlastnictví, zajištění, omezení."
                  danger={formData.hasThirdPartyRights}
                />
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <input
                  name="buyerLatePenalty"
                  value={formData.buyerLatePenalty}
                  onChange={handleChange}
                  placeholder={fl('buyerLatePenalty', 'Pokuta kupujícího za prodlení (% denně)')}
                  className={inputClass} aria-label={fl('buyerLatePenalty', 'Pokuta kupujícího za prodlení (% denně)')}
                />
                <input
                  type="number"
                  name="sellerLatePenalty"
                  value={formData.sellerLatePenalty}
                  onChange={handleChange}
                  placeholder={fl('sellerLatePenalty', 'Pokuta prodávajícího za pozdní předání (Kč/den)')}
                  className={inputClass} aria-label={fl('sellerLatePenalty', 'Pokuta prodávajícího za pozdní předání (Kč/den)')}
                />
                <input
                  type="number"
                  name="hiddenDefectPenalty"
                  value={formData.hiddenDefectPenalty}
                  onChange={handleChange}
                  placeholder={fl('hiddenDefectPenalty', 'Pokuta za vědomě zatajenou vadu (Kč)')}
                  className={inputClass} aria-label={fl('hiddenDefectPenalty', 'Pokuta za vědomě zatajenou vadu (Kč)')}
                />
                <input
                  type="number"
                  name="declarationPenalty"
                  value={formData.declarationPenalty}
                  onChange={handleChange}
                  placeholder={fl('declarationPenalty', 'Pokuta za nepravdivá prohlášení (Kč)')}
                  className={inputClass} aria-label={fl('declarationPenalty', 'Pokuta za nepravdivá prohlášení (Kč)')}
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 space-y-6">
              {/* Watermarked document preview */}
              {previewSections.length > 0 && (
                <ContractPreview sections={previewSections} title={ui.form.documentLabel} labels={previewLabels} />
              )}
              <div className={cardClass}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                      Stav vyplnění
                    </div>
                    <div className="mt-2 text-3xl font-black text-white">{completion}%</div>
                    <div className="mt-1 text-sm text-slate-400">
                      Každý vyplněný údaj se okamžitě promítá do systému.
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
                    {completion >= 85 ? 'Skoro hotovo' : completion >= 60 ? 'Dobré' : 'Doplň údaje'}
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
                      Analýza smlouvy
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
                    riskAnalysis.warnings.map((w, i) => (
                      <div
                        key={i}
                        className={`rounded-xl border p-3 text-xs leading-relaxed ${
                          w.level === 'high'
                            ? 'border-rose-500/20 bg-rose-500/10 text-rose-200'
                            : w.level === 'medium'
                              ? 'border-amber-500/20 bg-amber-500/10 text-amber-100'
                              : 'border-sky-500/20 bg-sky-500/10 text-sky-100'
                        }`}
                      >
                        {w.text}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                      Smlouva je nastavena velmi dobře a obsahuje silná právní prohlášení.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] border border-slate-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500" />
                <div className="mb-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                    Náhled výstupu
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Každý klik i každé písmeno se okamžitě propíše sem.
                  </div>
                </div>

                <div className="font-serif text-[11px] text-slate-800 leading-relaxed h-[430px] overflow-hidden relative">
                  <pre className="whitespace-pre-wrap font-serif">{previewContract}</pre>
                  <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-white to-transparent" />
                </div>
              </div>

              <div className={cardClass}>
                <div className="mb-3">
                  <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                    Předávací protokol
                  </div>
                  <div className="mt-1 text-sm text-slate-400">
                    Automaticky generovaná příloha ke smlouvě.
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-700/80 bg-[#111c31] p-4 max-h-56 overflow-auto">
                  <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-slate-300">
                    {handoverProtocol}
                  </pre>
                </div>
              </div>

              <div className={cardClass}>
                {/* Řešení sporů */}
                <div className="mb-6">
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">
                    {fl('disputeResolution', 'Řešení sporů')}
                  </div>
                  <select className={inputClass} name="disputeResolution" value={formData.disputeResolution} onChange={(e) => setFormData(p => ({ ...p, disputeResolution: e.target.value as 'court' | 'mediation' }))} aria-label={fl('disputeResolution', 'Řešení sporů')}>
                    <option value="court">{fl('dispute_court', 'Obecný soud (výchozí)')}</option>
                    <option value="mediation">{fl('dispute_mediation', 'Mediace (zákon č. 202/2012 Sb.)')}</option>
                  </select>
                </div>
                {packageConfig ? (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">
                      {packageFlowCopy?.selectedProductLabel}
                    </div>
                    <div className="mt-2 text-lg font-semibold text-white">
                      {packageConfig.title}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      {packageFlowCopy?.selectedProductBody}
                    </p>
                  </div>
                ) : (
                  <BuilderTierSelector
                    contractType="car_sale"
                    locale={builderLocale}
                    tier={formData.tier}
                    onTierChange={(tier) =>
                      setFormData((prev) => ({ ...prev, tier, notaryUpsell: tier !== 'basic' }))
                    }
                  />
                )}

                {!packageConfig ? (
                  <p className="mt-4 text-xs leading-relaxed text-[#b9c1d0]">
                    {packageFlowCopy?.relatedPrompt}{' '}
                    <Link href="/balicek-prodej-vozidla" className="link-gold-elegant">
                      {packageFlowCopy?.relatedPackageLabel}
                    </Link>
                    . {packageFlowCopy?.relatedGuidePrompt}{' '}
                    <Link href="/prodej-vozidla" className="link-gold-elegant">
                      {packageFlowCopy?.relatedGuideLabel}
                    </Link>
                    .
                  </p>
                ) : null}

              </div>

              <div className={cardClass}>
                <BuilderCheckoutSummary
                  contractType="car_sale"
                  tier={formData.tier}
                  packageKey={packageConfig?.key ?? null}
                  documentLabel={ui.form.documentLabel}
                  locale={builderLocale}
                  onUpgrade={() => setFormData((prev) => ({ ...prev, tier: 'complete', notaryUpsell: true }))}
                />

                {/* GDPR souhlas */}
                                {/* Tlačítko generování */}
                <button
                  data-builder-generate=""
                  onClick={() => setShowPreviewModal(true)}
                  className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.25)] active:scale-[0.98] uppercase tracking-tight"
                >
                  {ui.form.generate}
                </button>

                <p className="mt-3 text-center text-[11px] text-slate-500">
                  {ui.form.previewHint}
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
        title={ui.form.documentLabel}
        tier={formData.tier}
        onTierChange={(t) => setFormData((prev) => ({ ...prev, tier: t }))}
        contractType="car_sale"
        lang={builderLocale}
        packageKey={packageConfig?.key ?? null}
        onPay={handlePayment}
        isProcessing={isProcessing}
        onClose={() => setShowPreviewModal(false)}
      />
    )}
    </>
  );
}

export default function CarSaleBuilderPage({
  searchParams,
}: {
  searchParams: Promise<BuilderSearchParams>;
}) {
  const initialLocale = getBuilderLocaleFromSearchParams(use(searchParams));
  return (
    <LocalizedBuilderShell initialLocale={initialLocale}>
      <CarSaleBuilderContent />
    </LocalizedBuilderShell>
  );
}

