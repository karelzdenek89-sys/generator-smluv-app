'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import ContractPreview from '@/app/components/ContractPreview';
import BuilderCheckoutSummary from '@/app/components/BuilderCheckoutSummary';
import BuilderTierSelector from '@/app/components/BuilderTierSelector';
import { buildContractSections } from '@/lib/contracts';
import type { StoredContractData } from '@/lib/contracts';
import { getThematicPackageConfig } from '@/lib/packages';
import PaymentModal from '@/app/components/PaymentModal';

type PaymentMethod = 'cash' | 'transfer';
type RiskLevel = 'low' | 'medium' | 'high';

type CarSaleFormData = {
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
  paymentMethod: PaymentMethod;
  bankAccount: string;
  variableSymbol: string;
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

  notaryUpsell: boolean;
  tier: 'basic' | 'complete';
  disputeResolution: 'court' | 'mediation' | 'arbitration';
};

const inputClass = 'site-input';

const textareaClass = 'site-textarea';

const cardClass = 'builder-card p-6';

function CarSaleBuilderContent() {
  const searchParams = useSearchParams();
  const packageConfig = getThematicPackageConfig(searchParams.get('package'));
  const isVehiclePackage = packageConfig?.key === 'vehicle_sale';

  const [formData, setFormData] = useState<CarSaleFormData>({
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
    paymentMethod: 'transfer',
    bankAccount: '',
    variableSymbol: '',
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

  const riskAnalysis = useMemo(() => {
    let score = 100;
    const warnings: { text: string; level: RiskLevel }[] = [];

    if (!formData.carVIN || formData.carVIN.trim().length !== 17) {
      score -= 22;
      warnings.push({
        text: 'Doporučujeme doplnit správný VIN (17 znaků) pro jednoznačnou identifikaci vozidla.',
        level: 'high',
      });
    }

    if (!formData.sellerOP || !formData.buyerOP || !formData.sellerAddress || !formData.buyerAddress) {
      score -= 10;
      warnings.push({
        text: 'Doporučujeme doplnit přesnou identifikaci obou stran — OP a adresy.',
        level: 'high',
      });
    }

    if (!formData.handoverDate || !formData.handoverPlace) {
      score -= 10;
      warnings.push({
        text: 'Doporučujeme doplnit datum a místo předání vozidla.',
        level: 'medium',
      });
    }

    if (!formData.knownDefects.trim()) {
      score -= 14;
      warnings.push({
        text: 'Doporučujeme doplnit popis známých vad. Detailní popis chrání obě strany.',
        level: 'high',
      });
    }

    if (formData.paymentMethod === 'transfer' && !formData.bankAccount.trim()) {
      score -= 10;
      warnings.push({
        text: 'Doplňte číslo bankovního účtu prodávajícího pro bankovní převod.',
        level: 'high',
      });
    }

    if (formData.paymentMethod === 'cash' && priceNumber > 270000) {
      score -= 30;
      warnings.push({
        text: 'Hotovostní platba nad 270 000 Kč není možná. Změňte způsob úhrady na bankovní převod.',
        level: 'high',
      });
    }

    if (formData.isPledged || formData.isInLeasing || formData.hasThirdPartyRights) {
      score -= 22;
      warnings.push({
        text: 'Doporučujeme doplnit detaily právního omezení nebo práv třetích osob.',
        level: 'high',
      });
    }

    if (!formData.odometerGuaranteed) {
      score -= 8;
      warnings.push({
        text: 'Doporučujeme doplnit garanci stavu tachometru pro přesnější zachycení stavu vozidla.',
        level: 'medium',
      });
    }

    if (!formData.buyerInspectedVehicle) {
      score -= 6;
      warnings.push({
        text: 'Doporučujeme potvrdit, že se kupující seznámil s technickým stavem vozidla.',
        level: 'low',
      });
    }

    score = Math.max(0, Math.min(100, score));

    return {
      score,
      warnings,
      label: score >= 85 ? 'Dobré nastavení' : score >= 70 ? 'Průměrná ochrana' : 'Rizikovější nastavení',
      checkoutBlocked: formData.paymentMethod === 'cash' && priceNumber > 270000,
    };
  }, [formData, priceNumber]);

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
      return buildContractSections({
        ...formData,
        contractType: 'car_sale',
        packageKey: packageConfig?.key ?? null,
      } as StoredContractData);
    } catch {
      return [];
    }
  }, [formData, packageConfig?.key]);

  async function handlePayment() {
    if (riskAnalysis.checkoutBlocked) {
      alert('Hotovostní platba nad 270 000 Kč není možná. Změň způsob úhrady na bankovní převod.');
      return;
    }

    // Validace povinných polí
    const missingFields: string[] = [];
    if (!formData.sellerName.trim()) missingFields.push('jméno prodávajícího');
    if (!formData.buyerName.trim()) missingFields.push('jméno kupujícího');
    if (!formData.carMake.trim()) missingFields.push('značku vozidla');
    if (!formData.carVIN.trim()) missingFields.push('VIN kód');
    if (!formData.priceAmount.trim()) missingFields.push('kupní cenu');

    if (missingFields.length > 0) {
      alert(`Vyplňte prosím: ${missingFields.join(', ')}.`);
      return;
    }

    try {
      setIsProcessing(true);

      const payload = {
        ...formData,
        contractType: 'car_sale' as const,
        packageKey: packageConfig?.key ?? null,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType: 'car_sale',
          tier: packageConfig ? packageConfig.defaultTier : formData.tier,
          packageKey: packageConfig?.key ?? null,
          notaryUpsell: packageConfig ? true : formData.tier !== 'basic',
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
      alert('Chyba platební brány. Zkuste to prosím znovu.');
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
              <div className="font-bold tracking-tight text-[#f2e7c8] uppercase">SmlouvaHned</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#bba98c]">
                Kupní smlouva na vozidlo
              </div>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = '/')}
            className="text-sm text-[#d2c8b9] hover:text-[#f2e7c8] transition"
          >
            Zavřít
          </button>
        </div>
      </header>

      <ContractLandingSection
        badge="§ 2079 a násl. občanského zákoníku"
        h1Main="Kupní smlouva na"
        h1Accent="auto online"
        subtitle="Vytvořte kupní smlouvu při prodeji osobního automobilu, motocyklu nebo jiného motorového vozidla. Dokument zachycuje technické parametry, historii, stav tachometru, STK, emise a veškeré podmínky převodu vlastnictví."
        benefits={[
          { icon: '🚗', text: 'Určeno specificky pro prodej automobilu, motocyklu nebo přívěsu' },
          { icon: '🔍', text: 'Pokrývá VIN, STK, emise, počet vlastníků i stav tachometru' },
          { icon: '⚖️', text: 'Přechod vlastnictví, odpovědnost za vady a zákonná záruka' },
          { icon: '📄', text: 'Profesionální PDF ke stažení ihned po zaplacení' },
        ]}
        contents={[
          'Identifikaci prodávajícího a kupujícího',
          'Technické parametry vozidla (VIN, SPZ, rok výroby, stav tachometru)',
          'Platnost STK, emisní kontroly a počet předchozích vlastníků',
          'Kupní cenu a způsob úhrady',
          'Stav vozidla, známé závady a vybavení',
          'Datum a podmínky předání vozidla a dokladů',
          'Přechod vlastnického práva a odpovědnosti',
          'Závěrečná ustanovení, GDPR a vyšší moc',
        ]}
        whenSuitable={[
          'Prodej osobního automobilu mezi soukromými osobami',
          'Prodej motocyklu, skúteru nebo přívěsu',
          'Prodej firemního vozidla fyzické osobě nebo firmě',
          'Případy, kde je klíčové jasně zdokumentovat stav vozidla a podmínky převodu',
        ]}
        whenOther={[
          { label: 'Kupní smlouva na movitou věc', href: '/kupni', text: 'Pro prodej nábytku, elektroniky, kola nebo jiné movité věci mimo motorová vozidla.' },
        ]}
        faq={[
          { q: 'Proč potřebuji kupní smlouvu při prodeji auta?', a: 'Kupní smlouva prokazuje podmínky převodu a chrání obě strany. Dokládá smluvní cenu, stav vozidla v okamžiku prodeje a skutečnost, že kupující věděl o případných závadách. Bez smlouvy je obtížné prokázat, co bylo dohodnuto.' },
          { q: 'Musím kupní smlouvu ověřit u notáře?', a: 'Pro běžný prodej motorového vozidla notářské ověření není vyžadováno. Smlouva je platná podpisem obou stran. Ověřený podpis může pomoci v případě sporu, ale není povinný.' },
          { q: 'Co je VIN a proč je důležitý?', a: 'VIN (Vehicle Identification Number) je unikátní 17místný identifikátor vozidla. Umožňuje ověřit historii auta, výrobní specifikace a zda vozidlo nebylo kradeno nebo havarováno. Jeho uvedení ve smlouvě je zásadní pro jednoznačnou identifikaci.' },
          { q: 'Dostanu dokument ihned po zaplacení?', a: 'Ano, PDF je k dispozici ke stažení okamžitě po dokončení platby.' },
          { q: 'Jak mám přihlásit vozidlo na nového majitele?', a: 'Po podpisu smlouvy musí kupující vozidlo přepsat na dopravním inspektorátu (MDIC) ve svém místě bydliště. K přepisu potřebuje kupní smlouvu, technický průkaz, doklad totožnosti a potvrzení o zaplacení daně z nabytí (pokud se vztahuje).' },
        ]}
        ctaLabel="Vytvořit kupní smlouvu na auto"
        formId="formular"
        guideHref="/blog/kupni-smlouva-na-auto-2026"
        guideLabel="Průvodce kupní smlouvou na auto — VIN, STK, vady a bezpečné předání"
      />

      {packageConfig ? (
        <div className="max-w-7xl mx-auto px-4 pt-8 lg:px-8">
          <div className="rounded-[1.75rem] border border-amber-500/20 bg-[rgba(255,255,255,0.04)] p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">
              {packageConfig.badge}
            </div>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  {packageConfig.builderTitle}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {packageConfig.builderDescription}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/4 px-5 py-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Cena balíčku
                </div>
                <div className="mt-2 text-3xl font-black tracking-tight text-white">
                  {packageConfig.priceLabel}
                </div>
                <Link
                  href="/auto"
                  className="mt-3 inline-block text-xs leading-relaxed text-[#cbbba0] transition hover:text-white"
                >
                  Řešíte jen samotnou kupní smlouvu? Vraťte se na samostatný dokument 99 / 199 Kč.
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 pt-8 lg:px-8">
          <Link
            href="/balicek-prodej-vozidla"
            className="interactive-card block rounded-[1.75rem] border border-[rgba(197,160,89,0.18)] bg-[rgba(255,255,255,0.035)] p-6 no-underline"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">
              Tematický balíček
            </div>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Balíček pro prodej vozidla
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  V tomto formuláři volíte mezi samostatným dokumentem za 99 Kč a širší variantou za 199 Kč. Pokud chcete řešit i předání vozidla, klíčů a dokladů, pokračujte tematickým balíčkem za 299 Kč.
                </p>
                <p className="mt-3 text-xs leading-6 text-[#bba98c]">
                  Pokud si nejste jistí, kterou cestu zvolit, pomůže vám orientační stránka{' '}
                  <Link href="/prodej-vozidla" className="link-gold-elegant">
                    Podklady pro prodej vozidla
                  </Link>
                  .
                </p>
              </div>
              <span className="link-gold-elegant text-sm font-semibold">
                Zobrazit balíček →
              </span>
            </div>
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8" id="formular">
        <div className="mb-6 border-t border-slate-800/60 pt-8">
          <h2 className="text-lg font-black text-white uppercase tracking-wide">Vyplňte údaje dokumentu</h2>
          <p className="text-sm text-slate-500 mt-1">Všechna povinná pole jsou označena *</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <section className={cardClass}>
              <SectionTitle
                index="01"
                title="Smluvní strany"
                subtitle="Doplň co nejpřesnější identifikaci obou stran. To je základ vymahatelnosti."
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  name="sellerName"
                  value={formData.sellerName}
                  onChange={handleChange}
                  placeholder="Prodávající – celé jméno"
                  className={inputClass}
                />
                <input
                  name="sellerId"
                  value={formData.sellerId}
                  onChange={handleChange}
                  placeholder="Prodávající – RČ / datum narození"
                  className={inputClass}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  name="sellerAddress"
                  value={formData.sellerAddress}
                  onChange={handleChange}
                  placeholder="Prodávající – adresa"
                  className={inputClass}
                />
                <input
                  name="sellerOP"
                  value={formData.sellerOP}
                  onChange={handleChange}
                  placeholder="Prodávající – číslo OP"
                  className={inputClass}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <input
                  name="sellerEmail"
                  value={formData.sellerEmail}
                  onChange={handleChange}
                  placeholder="Prodávající – e-mail (volitelné)"
                  className={inputClass}
                />
                <input
                  name="sellerPhone"
                  value={formData.sellerPhone}
                  onChange={handleChange}
                  placeholder="Prodávající – telefon (volitelné)"
                  className={inputClass}
                />
              </div>

              <div className="border-t border-white/5 pt-6">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input
                    name="buyerName"
                    value={formData.buyerName}
                    onChange={handleChange}
                    placeholder="Kupující – celé jméno"
                    className={inputClass}
                  />
                  <input
                    name="buyerId"
                    value={formData.buyerId}
                    onChange={handleChange}
                    placeholder="Kupující – RČ / datum narození"
                    className={inputClass}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input
                    name="buyerAddress"
                    value={formData.buyerAddress}
                    onChange={handleChange}
                    placeholder="Kupující – adresa"
                    className={inputClass}
                  />
                  <input
                    name="buyerOP"
                    value={formData.buyerOP}
                    onChange={handleChange}
                    placeholder="Kupující – číslo OP"
                    className={inputClass}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    name="buyerEmail"
                    value={formData.buyerEmail}
                    onChange={handleChange}
                    placeholder="Kupující – e-mail (volitelné)"
                    className={inputClass}
                  />
                  <input
                    name="buyerPhone"
                    value={formData.buyerPhone}
                    onChange={handleChange}
                    placeholder="Kupující – telefon (volitelné)"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle
                index="02"
                title="Specifikace vozidla"
                subtitle="Každá změna se okamžitě promítne do náhledu vpravo."
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  name="carMake"
                  value={formData.carMake}
                  onChange={handleChange}
                  placeholder="Značka"
                  className={inputClass}
                />
                <input
                  name="carModel"
                  value={formData.carModel}
                  onChange={handleChange}
                  placeholder="Model"
                  className={inputClass}
                />
              </div>

              <input
                name="carVIN"
                value={formData.carVIN}
                onChange={handleChange}
                placeholder="VIN (17 znaků)"
                className={`${inputClass} font-mono tracking-widest mb-4`}
              />

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <input
                  type="number"
                  name="carYear"
                  value={formData.carYear}
                  onChange={handleChange}
                  placeholder="Rok výroby"
                  className={inputClass}
                />
                <input
                  type="number"
                  name="carMileage"
                  value={formData.carMileage}
                  onChange={handleChange}
                  placeholder="Nájezd (km)"
                  className={inputClass}
                />
                <input
                  name="carPlate"
                  value={formData.carPlate}
                  onChange={handleChange}
                  placeholder="SPZ"
                  className={inputClass}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <input
                  name="carColor"
                  value={formData.carColor}
                  onChange={handleChange}
                  placeholder="Barva"
                  className={inputClass}
                />
                <input
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  placeholder="Palivo"
                  className={inputClass}
                />
                <input
                  name="carFirstRegistration"
                  value={formData.carFirstRegistration}
                  onChange={handleChange}
                  placeholder="První registrace"
                  className={inputClass}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <input
                  name="engineCapacity"
                  value={formData.engineCapacity}
                  onChange={handleChange}
                  placeholder="Objem (cm³)"
                  className={inputClass}
                />
                <input
                  name="powerKW"
                  value={formData.powerKW}
                  onChange={handleChange}
                  placeholder="Výkon (kW)"
                  className={inputClass}
                />
                <input
                  name="techCardNumber"
                  value={formData.techCardNumber}
                  onChange={handleChange}
                  placeholder="Číslo technického průkazu"
                  className={inputClass}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.10em] text-slate-400 mb-1.5">STK platná do</label>
                  <input
                    type="date"
                    name="stkValidUntil"
                    value={formData.stkValidUntil}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.10em] text-slate-400 mb-1.5">Emise platné do</label>
                  <input
                    type="date"
                    name="emissionsValidUntil"
                    value={formData.emissionsValidUntil}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle
                index="03"
                title="Cena, úhrada a předání"
                subtitle="Tyto údaje se okamžitě propsají do smlouvy."
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  type="number"
                  name="priceAmount"
                  value={formData.priceAmount}
                  onChange={handleChange}
                  placeholder="Kupní cena (Kč)"
                  className={`${inputClass} text-xl font-bold`}
                />
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="transfer">Bankovní převod</option>
                  <option value="cash">Hotovost</option>
                </select>
              </div>

              {formData.paymentMethod === 'transfer' ? (
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleChange}
                    placeholder="Číslo účtu prodávajícího"
                    className={inputClass}
                  />
                  <input
                    name="variableSymbol"
                    value={formData.variableSymbol}
                    onChange={handleChange}
                    placeholder="Variabilní symbol"
                    className={inputClass}
                  />
                </div>
              ) : (
                <div className="mb-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                  U hotovosti zkontroluj zákonný limit. Nad 270 000 Kč checkout zablokuji.
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  name="handoverDate"
                  value={formData.handoverDate}
                  onChange={handleChange}
                  placeholder="Datum předání"
                  className={inputClass}
                />
                <input
                  name="handoverPlace"
                  value={formData.handoverPlace}
                  onChange={handleChange}
                  placeholder="Místo předání"
                  className={inputClass}
                />
              </div>

              <select
                name="ownershipTransferMoment"
                value={formData.ownershipTransferMoment}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="payment">Vlastnictví přechází zaplacením</option>
                <option value="handover">Vlastnictví přechází předáním</option>
              </select>
            </section>

            <section className={cardClass}>
              <SectionTitle
                index="04"
                title="Technický stav a předání"
                subtitle="Tato část chrání hlavně prodávajícího proti budoucím sporům."
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  type="number"
                  name="keysCount"
                  value={formData.keysCount}
                  onChange={handleChange}
                  placeholder="Počet klíčů"
                  className={inputClass}
                />
                <input
                  name="tiresInfo"
                  value={formData.tiresInfo}
                  onChange={handleChange}
                  placeholder="Pneumatiky / kola"
                  className={inputClass}
                />
              </div>

              <div className="mb-4">
                <textarea
                  name="knownDefects"
                  value={formData.knownDefects}
                  onChange={handleChange}
                  placeholder="Popiš všechny známé vady: lak, koroze, motor, převodovka, podvozek, elektronika, klima, interiér..."
                  className={textareaClass}
                />
              </div>

              <div className="mb-4">
                <textarea
                  name="documentsIncluded"
                  value={formData.documentsIncluded}
                  onChange={handleChange}
                  placeholder="Předané doklady"
                  className={textareaClass}
                />
              </div>

              <textarea
                name="equipmentIncluded"
                value={formData.equipmentIncluded}
                onChange={handleChange}
                placeholder="Předané příslušenství a výbava: sada kol, rezervní klíč, střešní nosič, rádio, zimní pneu..."
                className={textareaClass}
              />
            </section>

            <section className={cardClass}>
              <SectionTitle
                index="05"
                title="Právní nastavení"
                subtitle="Přepínače mění obsah smlouvy i risk score."
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <ToggleCard
                  name="serviceHistory"
                  checked={formData.serviceHistory}
                  label="Servisní historie k dispozici"
                  hint="Ve smlouvě se uvede, že je servisní historie nebo knížka předána."
                />
                <ToggleCard
                  name="accidentHistory"
                  checked={formData.accidentHistory}
                  label="Vozidlo bylo havarováno"
                  hint="Pokud ano, je lepší to přiznat výslovně a přesně."
                  danger={formData.accidentHistory}
                />
                <ToggleCard
                  name="strictWarranties"
                  checked={formData.strictWarranties}
                  label="Přísnější právní prohlášení"
                  hint="Doporučená volba. Posiluje text o vadách, právních omezeních a stavu vozidla."
                />
                <ToggleCard
                  name="odometerGuaranteed"
                  checked={formData.odometerGuaranteed}
                  label="Garantovat stav tachometru"
                  hint="Silnější ochrana kupujícího, ale jen pokud si jsi tím jistý."
                />
                <ToggleCard
                  name="buyerInspectedVehicle"
                  checked={formData.buyerInspectedVehicle}
                  label="Kupující vozidlo prohlédl"
                  hint="Doporučená volba. Snižuje prostor pro pozdější námitky."
                />
                <ToggleCard
                  name="testDriveCompleted"
                  checked={formData.testDriveCompleted}
                  label="Proběhla zkušební jízda"
                  hint="Zkušební jízda proběhla před podpisem smlouvy. Uvede se v sekci prohlídky."
                />
                <ToggleCard
                  name="mechanicInspectionOffered"
                  checked={formData.mechanicInspectionOffered}
                  label="Kupující měl možnost prověřit vozidlo mechanikem"
                  hint="Prodávající umožnil nezávislou technickou prohlídku. Posiluje postavení při případném sporu o vady."
                />
                <ToggleCard
                  name="isPledged"
                  checked={formData.isPledged}
                  label="Na vozidle vázne zástava"
                  hint="Musí být výslovně uvedeno."
                  danger={formData.isPledged}
                />
                <ToggleCard
                  name="isInLeasing"
                  checked={formData.isInLeasing}
                  label="Vozidlo je v leasingu / financování"
                  hint="Zásadní právní informace."
                  danger={formData.isInLeasing}
                />
                <ToggleCard
                  name="hasThirdPartyRights"
                  checked={formData.hasThirdPartyRights}
                  label="Existují práva třetích osob"
                  hint="Např. společné vlastnictví, zajištění, omezení."
                  danger={formData.hasThirdPartyRights}
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 space-y-6">
              {/* Watermarked document preview */}
              {previewSections.length > 0 && (
                <ContractPreview sections={previewSections} title="Kupní smlouva na vozidlo" />
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
                      Kontrola úplnosti
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
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Řešení sporů</div>
                  <select className={inputClass} name="disputeResolution" value={formData.disputeResolution} onChange={(e) => setFormData(p => ({ ...p, disputeResolution: e.target.value as 'court' | 'mediation' | 'arbitration' }))}>
                    <option value="court">Obecný soud (výchozí)</option>
                    <option value="mediation">Mediace (zákon č. 202/2012 Sb.)</option>
                    <option value="arbitration">Rozhodčí řízení (Rozhodčí soud HK ČR)</option>
                  {formData.disputeResolution === 'arbitration' && (
                    <p className="mt-2 text-xs text-amber-400 leading-relaxed">⚠ Rozhodčí doložka není platná ve smlouvách se spotřebiteli (zákon č. 216/1994 Sb.). Použijte ji pouze pro vztahy B2B.</p>
                  )}
                  </select>
                </div>
                {packageConfig ? (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/8 p-5">
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">
                      Zvolený produkt
                    </div>
                    <div className="mt-2 text-lg font-semibold text-white">
                      {packageConfig.title}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      Součástí výstupu bude kupní smlouva na vozidlo v komplexní variantě, předávací protokol, potvrzení o převzetí vozidla, klíčů a dokladů a praktické podklady k převodu.
                    </p>
                  </div>
                ) : (
                  <BuilderTierSelector
                    contractType="car_sale"
                    tier={formData.tier}
                    onTierChange={(tier) =>
                      setFormData((prev) => ({ ...prev, tier, notaryUpsell: tier !== 'basic' }))
                    }
                  />
                )}

                {!packageConfig ? (
                  <p className="mt-4 text-xs leading-relaxed text-[#b9c1d0]">
                    Řešíte vedle samotné smlouvy i fyzické předání vozidla, klíčů a dokladů?{' '}
                    <Link href="/balicek-prodej-vozidla" className="link-gold-elegant">
                      Zobrazit Balíček pro prodej vozidla
                    </Link>
                    . Pokud si chcete nejprve ujasnit, která cesta je pro vás vhodná, otevřete{' '}
                    <Link href="/prodej-vozidla" className="link-gold-elegant">
                      podklady pro prodej vozidla
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
                  documentLabel="Kupní smlouva na vozidlo"
                  onUpgrade={() => setFormData((prev) => ({ ...prev, tier: 'complete', notaryUpsell: true }))}
                />

                {/* GDPR souhlas */}
                                {/* Tlačítko generování */}
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.25)] active:scale-[0.98] uppercase tracking-tight"
                >
                  Vygenerovat smlouvu →
                </button>

                <p className="mt-3 text-center text-[11px] text-slate-500">
                  Zobrazí se náhled dokumentu připraveného k odemčení
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
        title="Kupní smlouva na vozidlo"
        tier={formData.tier}
        onTierChange={(t) => setFormData((prev) => ({ ...prev, tier: t }))}
        contractType="car_sale"
        packageKey={packageConfig?.key ?? null}
        onPay={handlePayment}
        isProcessing={isProcessing}
        onClose={() => setShowPreviewModal(false)}
      />
    )}
    </>
  );
}

export default function CarSaleBuilderPage() {
  return (
    <Suspense fallback={<main className="site-page contract-builder min-h-screen pb-24" />}>
      <CarSaleBuilderContent />
    </Suspense>
  );
}

