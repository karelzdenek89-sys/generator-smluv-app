'use client';

import { useMemo, useState } from 'react';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import ContractPreview from '@/app/components/ContractPreview';
import { buildContractSections } from '@/lib/contracts';
import type { StoredContractData } from '@/lib/contracts';

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

  notaryUpsell: boolean;
  tier: 'basic' | 'professional' | 'complete';
  disputeResolution: 'court' | 'mediation' | 'arbitration';
};

const inputClass =
  'w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';

const textareaClass =
  'w-full min-h-[110px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';

const cardClass =
  'bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]';

export default function CarSaleBuilderPage() {
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

    notaryUpsell: false,
    tier: 'basic' as const,
    disputeResolution: 'court' as const,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [withdrawalConsent, setWithdrawalConsent] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState(false);

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
      return buildContractSections({ ...formData, contractType: 'car_sale' } as StoredContractData);
    } catch {
      return [];
    }
  }, [formData]);

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

        if (!withdrawalConsent) {
      setWithdrawalError(true);
      return;
    }
    if (!gdprConsent) {
      alert('Potvrďte prosím souhlas se zpracováním osobních údajů a obchodními podmínkami.');
      return;
    }

    try {
      setIsProcessing(true);

      const payload = {
        ...formData,
        contractType: 'car_sale' as const,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType: 'car_sale',
          tier: formData.tier,
          notaryUpsell: formData.tier !== 'basic',
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
    <main className="min-h-screen bg-[#05080f] text-slate-200 font-sans pb-24">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08101e]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-[11px]">
              AUTO
            </div>
            <div>
              <div className="font-bold tracking-tight text-white uppercase">SmlouvaHned Auto</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-widest">
                Kupní smlouva na vozidlo
              </div>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = '/')}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            Zavřít
          </button>
        </div>
      </header>

      <ContractLandingSection
        badge="§ 2079 a násl. občanského zákoníku"
        h1Main="Kupní smlouva na"
        h1Accent="auto online"
        subtitle="Vytvořte přehlednou kupní smlouvu pro prodej osobního auta, motocyklu nebo jiného motorového vozidla. Dokument zachycuje identifikaci stran, technické parametry, stav vozidla, známé vady i podmínky předání a úhrady."
        benefits={[
          { icon: '🚗', text: 'Navrženo pro prodej osobních aut, motocyklů i přívěsů mezi soukromými osobami i firmami' },
          { icon: '🔍', text: 'Pokrývá VIN, SPZ, stav tachometru, STK, emise i historii a vybavení vozidla' },
          { icon: '⚖️', text: 'Řeší přechod vlastnictví, odpovědnost za vady a důležitá prohlášení prodávajícího' },
          { icon: '📄', text: 'PDF dokument je připraven ke stažení ihned po dokončení platby' },
        ]}
        contents={[
          'Identifikaci prodávajícího a kupujícího',
          'Technické parametry vozidla včetně VIN, SPZ, roku výroby a stavu tachometru',
          'Údaje o STK, emisní kontrole a počtu předchozích vlastníků',
          'Kupní cenu, způsob úhrady a okamžik přechodu vlastnictví',
          'Popis známých vad, vybavení a předávaných dokladů',
          'Datum, místo a podmínky předání vozidla',
          'Prohlášení o právním stavu vozidla a právech třetích osob',
          'Závěrečná ustanovení a přehlednou smluvní strukturu pro podpis',
        ]}
        whenSuitable={[
          'Prodej osobního automobilu mezi soukromými osobami',
          'Prodej motocyklu, skúteru nebo přívěsu',
          'Prodej firemního vozidla fyzické osobě nebo firmě',
          'Situace, kdy potřebujete jasně doložit stav vozidla a podmínky převodu',
        ]}
        whenOther={[
          { label: 'Kupní smlouva na movitou věc', href: '/kupni', text: 'Pro prodej nábytku, elektroniky, kola nebo jiné movité věci mimo motorová vozidla.' },
        ]}
        faq={[
          { q: 'Proč je písemná kupní smlouva při prodeji auta důležitá?', a: 'Kupní smlouva přesně zachycuje, co bylo mezi prodávajícím a kupujícím dohodnuto. Je zásadní pro kupní cenu, identifikaci vozidla, popis jeho stavu i doložení okamžiku předání.' },
          { q: 'Je potřeba smlouvu ověřovat u notáře?', a: 'U běžného prodeje motorového vozidla se notářské ověření obvykle nevyžaduje. Standardně postačí podpis obou stran, pokud konkrétní situace nevyžaduje něco navíc.' },
          { q: 'Co je VIN a proč na něm záleží?', a: 'VIN je jedinečný sedmnáctimístný identifikátor vozidla. Díky němu lze bezpečně určit konkrétní auto a předejít sporům o to, jaké vozidlo bylo skutečně prodáno.' },
          { q: 'Je dokument dostupný ihned po zaplacení?', a: 'Ano. Po úspěšném dokončení platby je PDF ihned připravené ke stažení.' },
          { q: 'Co je potřeba pro přepis vozidla na nového majitele?', a: 'Po podpisu smlouvy je potřeba vyřídit zápis změny vlastníka v registru vozidel na příslušném úřadu obce s rozšířenou působností. Typicky budete potřebovat kupní smlouvu, doklady k vozidlu a doklady totožnosti obou stran.' },
        ]}
        ctaLabel="Vytvořit kupní smlouvu na auto"
        formId="formular"
        guideHref="/blog/kupni-smlouva-na-auto-2026"
        guideLabel="Průvodce kupní smlouvou na auto – VIN, STK, vady a bezpečné předání"
      />

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
                  aria-label="Prodávající – celé jméno"
                  className={inputClass}
                />
                <input
                  name="sellerId"
                  value={formData.sellerId}
                  onChange={handleChange}
                  placeholder="Prodávající – RČ / datum narození"
                  aria-label="Prodávající – RČ / datum narození"
                  className={inputClass}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  name="sellerAddress"
                  value={formData.sellerAddress}
                  onChange={handleChange}
                  placeholder="Prodávající – adresa"
                  aria-label="Prodávající – adresa"
                  className={inputClass}
                />
                <input
                  name="sellerOP"
                  value={formData.sellerOP}
                  onChange={handleChange}
                  placeholder="Prodávající – číslo OP"
                  aria-label="Prodávající – číslo OP"
                  className={inputClass}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <input
                  name="sellerEmail"
                  value={formData.sellerEmail}
                  onChange={handleChange}
                  placeholder="Prodávající – e-mail (volitelné)"
                  aria-label="Prodávající – e-mail (volitelné)"
                  className={inputClass}
                />
                <input
                  name="sellerPhone"
                  value={formData.sellerPhone}
                  onChange={handleChange}
                  placeholder="Prodávající – telefon (volitelné)"
                  aria-label="Prodávající – telefon (volitelné)"
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
                    aria-label="Kupující – celé jméno"
                    className={inputClass}
                  />
                  <input
                    name="buyerId"
                    value={formData.buyerId}
                    onChange={handleChange}
                    placeholder="Kupující – RČ / datum narození"
                    aria-label="Kupující – RČ / datum narození"
                    className={inputClass}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input
                    name="buyerAddress"
                    value={formData.buyerAddress}
                    onChange={handleChange}
                    placeholder="Kupující – adresa"
                    aria-label="Kupující – adresa"
                    className={inputClass}
                  />
                  <input
                    name="buyerOP"
                    value={formData.buyerOP}
                    onChange={handleChange}
                    placeholder="Kupující – číslo OP"
                    aria-label="Kupující – číslo OP"
                    className={inputClass}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    name="buyerEmail"
                    value={formData.buyerEmail}
                    onChange={handleChange}
                    placeholder="Kupující – e-mail (volitelné)"
                    aria-label="Kupující – e-mail (volitelné)"
                    className={inputClass}
                  />
                  <input
                    name="buyerPhone"
                    value={formData.buyerPhone}
                    onChange={handleChange}
                    placeholder="Kupující – telefon (volitelné)"
                    aria-label="Kupující – telefon (volitelné)"
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
                  aria-label="Značka"
                  className={inputClass}
                />
                <input
                  name="carModel"
                  value={formData.carModel}
                  onChange={handleChange}
                  placeholder="Model"
                  aria-label="Model"
                  className={inputClass}
                />
              </div>

              <input
                name="carVIN"
                value={formData.carVIN}
                onChange={handleChange}
                placeholder="VIN (17 znaků)"
                aria-label="VIN (17 znaků)"
                className={`${inputClass} font-mono tracking-widest mb-4`}
              />

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <input
                  type="number"
                  name="carYear"
                  value={formData.carYear}
                  onChange={handleChange}
                  placeholder="Rok výroby"
                  aria-label="Rok výroby"
                  className={inputClass}
                />
                <input
                  type="number"
                  name="carMileage"
                  value={formData.carMileage}
                  onChange={handleChange}
                  placeholder="Nájezd (km)"
                  aria-label="Nájezd (km)"
                  className={inputClass}
                />
                <input
                  name="carPlate"
                  value={formData.carPlate}
                  onChange={handleChange}
                  placeholder="SPZ"
                  aria-label="SPZ"
                  className={inputClass}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <input
                  name="carColor"
                  value={formData.carColor}
                  onChange={handleChange}
                  placeholder="Barva"
                  aria-label="Barva"
                  className={inputClass}
                />
                <input
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  placeholder="Palivo"
                  aria-label="Palivo"
                  className={inputClass}
                />
                <input
                  name="carFirstRegistration"
                  value={formData.carFirstRegistration}
                  onChange={handleChange}
                  placeholder="První registrace"
                  aria-label="První registrace"
                  className={inputClass}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <input
                  name="engineCapacity"
                  value={formData.engineCapacity}
                  onChange={handleChange}
                  placeholder="Objem (cm³)"
                  aria-label="Objem (cm³)"
                  className={inputClass}
                />
                <input
                  name="powerKW"
                  value={formData.powerKW}
                  onChange={handleChange}
                  placeholder="Výkon (kW)"
                  aria-label="Výkon (kW)"
                  className={inputClass}
                />
                <input
                  name="techCardNumber"
                  value={formData.techCardNumber}
                  onChange={handleChange}
                  placeholder="Číslo technického průkazu"
                  aria-label="Číslo technického průkazu"
                  className={inputClass}
                />
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
                  aria-label="Kupní cena (Kč)"
                  className={`${inputClass} text-xl font-bold`}
                />
                <select aria-label="Bankovní převod"
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
                    aria-label="Číslo účtu prodávajícího"
                    className={inputClass}
                  />
                  <input
                    name="variableSymbol"
                    value={formData.variableSymbol}
                    onChange={handleChange}
                    placeholder="Variabilní symbol"
                    aria-label="Variabilní symbol"
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
                  aria-label="Datum předání"
                  className={inputClass}
                />
                <input
                  name="handoverPlace"
                  value={formData.handoverPlace}
                  onChange={handleChange}
                  placeholder="Místo předání"
                  aria-label="Místo předání"
                  className={inputClass}
                />
              </div>

              <select aria-label="Vlastnictví přechází zaplacením"
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
                  aria-label="Počet klíčů"
                  className={inputClass}
                />
                <input
                  name="tiresInfo"
                  value={formData.tiresInfo}
                  onChange={handleChange}
                  placeholder="Pneumatiky / kola"
                  aria-label="Pneumatiky / kola"
                  className={inputClass}
                />
              </div>

              <div className="mb-4">
                <textarea
                  name="knownDefects"
                  value={formData.knownDefects}
                  onChange={handleChange}
                  placeholder="Popiš všechny známé vady: lak, koroze, motor, převodovka, podvozek, elektronika, klima, interiér..."
                  aria-label="Popiš všechny známé vady: lak, koroze, motor, převodovka, podvozek, elektronika, klima, interiér..."
                  className={textareaClass}
                />
              </div>

              <div className="mb-4">
                <textarea
                  name="documentsIncluded"
                  value={formData.documentsIncluded}
                  onChange={handleChange}
                  placeholder="Předané doklady"
                  aria-label="Předané doklady"
                  className={textareaClass}
                />
              </div>

              <textarea
                name="equipmentIncluded"
                value={formData.equipmentIncluded}
                onChange={handleChange}
                placeholder="Předané příslušenství a výbava: sada kol, rezervní klíč, střešní nosič, rádio, zimní pneu..."
                aria-label="Předané příslušenství a výbava: sada kol, rezervní klíč, střešní nosič, rádio, zimní pneu..."
                className={textareaClass}
              />
            </section>

            <section className={cardClass}>
              <SectionTitle
                index="05"
                title="Pravni nastaveni"
                subtitle="Prepinace meni obsah smlouvy i miru ochrany jednotlivych ustanoveni."
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
                  hint="Doporučeno. Posiluje text o vadách, právních omezeních a stavu vozidla."
                />
                <ToggleCard
                  name="odometerGuaranteed"
                  checked={formData.odometerGuaranteed}
                  label="Garantovat stav tachometru"
                  hint="Silnejsi ochrana kupujiciho, ale jen pokud to muzete odpovedne potvrdit."
                />
                <ToggleCard
                  name="buyerInspectedVehicle"
                  checked={formData.buyerInspectedVehicle}
                  label="Kupující vozidlo prohlédl"
                  hint="Doporučeno. Snižuje prostor pro pozdější námitky."
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
                      Bezpečnost prodeje
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
                      Smlouva je vyplnena ve velmi dobre kvalite a obsahuje dulezita prohlaseni ke stavu vozidla.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] border border-slate-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500" />
                <div className="mb-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                    Živý náhled smlouvy
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Nahled se aktualizuje podle vyplnenych udaju.
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
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Řešení sporů</div>
                  <select aria-label="Obecný soud (výchozí)" className={inputClass} name="disputeResolution" value={formData.disputeResolution} onChange={(e) => setFormData(p => ({ ...p, disputeResolution: e.target.value as 'court' | 'mediation' | 'arbitration' }))}>
                    <option value="court">Obecný soud (výchozí)</option>
                    <option value="mediation">Mediace (zákon č. 202/2012 Sb.)</option>
                    <option value="arbitration">Rozhodčí řízení (Rozhodčí soud HK ČR)</option>
                  </select>
                </div>
                {/* === VÝBĚR BALÍČKU === */}
                <div className="space-y-3 mb-4">
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Vyberte balíček</div>
                  {([
                    { value: 'basic', label: 'Základní dokument', price: '249 Kč', desc: 'Strukturovaná smlouva dle občanského zákoníku, výstup v PDF.' },
                    { value: 'professional', label: 'Rozšířený dokument', price: '399 Kč', desc: 'Rozšířené klauzule, smluvní pokuty a zajišťovací ustanovení.', recommended: true },
                    { value: 'complete', label: 'Kompletní balíček', price: '749 Kč', desc: 'Vše z Rozšířeného dokumentu + průvodní instrukce, checklist a 30denní archivace.' },
                  ] as const).map((opt) => (
                    <label
                      key={opt.value}
                      className={`block rounded-2xl border-2 p-4 cursor-pointer transition relative ${
                        formData.tier === opt.value
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-slate-700/60 bg-[#0c1426]/60 hover:border-slate-600'
                      }`}
                    >
                      {('recommended' in opt) &&  formData.tier !== 'professional' && (
                        <div className="absolute -top-2.5 left-4">
                          <span className="rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-black">
                            Doporučeno
                          </span>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="tier"
                          value={opt.value}
                          checked={formData.tier === opt.value}
                          onChange={(e) => setFormData((prev) => ({ ...prev, tier: e.target.value as 'basic' | 'professional' | 'complete', notaryUpsell: e.target.value !== 'basic' }))}
                          className="mt-1 h-5 w-5 accent-amber-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black uppercase tracking-wide text-amber-400">{opt.label}</span>
                            <span className="text-sm font-black text-white">{opt.price}</span>
                          </div>
                          <div className="mt-1 text-xs leading-relaxed text-slate-400">{opt.desc}</div>
                          {opt.value === 'professional' && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {['Smluvní pokuty', 'Sankce za prodlení', 'Odpovědnostní doložky'].map(t => (
                                <span key={t} className="text-[10px] font-bold text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded-full">{t}</span>
                              ))}
                            </div>
                          )}
                          {opt.value === 'complete' && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {['Instrukce k podpisu', 'Checklist', '30denní archivace'].map(t => (
                                <span key={t} className="text-[10px] font-bold text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded-full">{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

              </div>

              <div className={cardClass}>
                {/* Price summary */}
                <div className="mb-4 rounded-2xl border border-white/8 bg-white/3 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Vybraný balíček</span>
                    <span className="text-sm font-bold text-white">
                      {formData.tier === 'complete' ? 'Kompletní balíček' : formData.tier === 'professional' ? 'Rozšířený dokument' : 'Základní dokument'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Cena balíčku</span>
                    <span className="text-sm font-bold text-white">
                      {formData.tier === 'complete' ? '749 Kč' : formData.tier === 'professional' ? '399 Kč' : '249 Kč'}
                    </span>
                  </div>
                  <div className="border-t border-white/8 mt-2 pt-2 flex items-center justify-between">
                    <span className="text-sm font-black text-white">Celkem</span>
                    <span className="text-xl font-black text-amber-400">{formData.tier === 'complete' ? '749 Kč' : formData.tier === 'professional' ? '399 Kč' : '249 Kč'}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Součástí výstupu je</div>
                  <ul className="space-y-1.5">
                    {['Profesionálně strukturované PDF', 'Připraveno k okamžitému stažení', 'Vhodné pro standardní soukromé převody', 'Přehledné uspořádání smluvních ustanovení'].map(item => (
                      <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className="text-amber-500 mt-0.5">✓</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* GDPR souhlas */}
                <label className="flex items-start gap-3 mb-4 cursor-pointer group mt-4">
                  <input
                    type="checkbox"
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-amber-500 flex-shrink-0"
                  />
                  <span className="text-xs leading-relaxed text-slate-400 group-hover:text-slate-300 transition">
                    Souhlasím se{' '}
                    <a href="/gdpr" target="_blank" className="text-amber-400 underline hover:text-amber-300">zpracováním osobních údajů</a>
                    {' '}a s{' '}
                    <a href="/obchodni-podminky" target="_blank" className="text-amber-400 underline hover:text-amber-300">obchodními podmínkami</a>.
                    Beru na vědomí, že digitální obsah je doručen ihned a nelze od smlouvy odstoupit.
                  </span>
                </label>

                {/* Platební tlačítko */}

                {/* § 1837 l) OZ — povinný souhlas s neodstoupením od smlouvy */}
                <label className="flex items-start gap-3 mb-1 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={withdrawalConsent}
                    onChange={(e) => {
                      setWithdrawalConsent(e.target.checked);
                      if (e.target.checked) setWithdrawalError(false);
                    }}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 accent-amber-500"
                  />
                  <span className="text-xs leading-relaxed text-slate-400 group-hover:text-slate-300 transition">
                    Beru na vědomí, že objednávám digitální obsah, který bude ihned zpřístupněn po zaplacení.
                    Výslovně souhlasím s tím, že ztrácím právo na odstoupení od smlouvy ve lhůtě 14 dní dle{' '}
                    <a href="/obchodni-podminky" target="_blank" className="text-amber-400 underline hover:text-amber-300">
                      § 1837 písm. l) zákona č. 89/2012 Sb.
                    </a>
                  </span>
                </label>
                {withdrawalError && (
                  <p className="mb-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs text-rose-300">
                    Pro pokračování musíte souhlasit s podmínkami digitálního obsahu.
                  </p>
                )}
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || !gdprConsent}
                  className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.25)] active:scale-[0.98] uppercase tracking-tight disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                      Přesměrování na platbu…
                    </span>
                  ) : (
                    `Zaplatit ${formData.tier === 'complete' ? '749 Kč' : formData.tier === 'professional' ? '399 Kč' : '249 Kč'} a stáhnout PDF →`
                  )}
                </button>

                <p className="mt-3 text-center text-[11px] text-slate-500">
                  🔒 Zabezpečená platba přes Stripe · PDF ke stažení ihned po zaplacení
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
