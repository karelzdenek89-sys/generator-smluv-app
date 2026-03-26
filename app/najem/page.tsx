'use client';

import { useMemo, useState } from 'react';

type LeaseFormData = {
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
  flatUnitNumber: string;
  ownershipSheet: string;
  cadastralArea: string;
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
  gasMeter: string;
  waterMeter: string;
  equipmentList: string;
  knownDefects: string;

  allowPets: boolean;
  allowSmoking: boolean;
  allowAirbnb: boolean;
  strictPenalties: boolean;
  inspectionAllowed: boolean;
  maxOccupants: string;
  businessUseAllowed: boolean;

  notaryUpsell: boolean;
  tier: 'basic' | 'professional' | 'complete';
};

type RiskLevel = 'low' | 'medium' | 'high';

const inputClass =
  'w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';

const textareaClass =
  'w-full min-h-[110px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';

const cardClass =
  'bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]';

export default function LeaseBuilderPage() {
  const [formData, setFormData] = useState<LeaseFormData>({
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
    flatUnitNumber: '',
    ownershipSheet: '',
    cadastralArea: '',
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
    gasMeter: '',
    waterMeter: '',
    equipmentList: '',
    knownDefects: '',

    allowPets: false,
    allowSmoking: false,
    allowAirbnb: false,
    strictPenalties: true,
    inspectionAllowed: true,
    maxOccupants: '2',
    businessUseAllowed: false,

    notaryUpsell: false,
    tier: 'basic' as const,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);

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
      formData.paymentDay,
      formData.bankAccount,
      formData.maxOccupants,
    ];

    const conditionalTotal = formData.duration === 'fixed' ? 1 : 0;
    const conditionalFilled = formData.duration === 'fixed' && formData.endDate ? 1 : 0;

    const filled =
      importantFields.filter((item) => String(item).trim() !== '').length + conditionalFilled;

    const total = importantFields.length + conditionalTotal;

    return Math.round((filled / total) * 100);
  }, [formData]);

  const riskAnalysis = useMemo(() => {
    let score = 100;
    const warnings: { text: string; level: RiskLevel }[] = [];

    if (!formData.landlordId || !formData.tenantId || !formData.landlordOP || !formData.tenantOP) {
      score -= 16;
      warnings.push({
        text: 'Chybí identifikace smluvních stran. Bez přesných údajů je vymahatelnost slabší.',
        level: 'high',
      });
    }

    if (!formData.flatUnitNumber || !formData.cadastralArea) {
      score -= 10;
      warnings.push({
        text: 'Byt není dostatečně přesně identifikován (číslo jednotky / katastrální území).',
        level: 'high',
      });
    }

    if (formData.duration === 'fixed' && !formData.endDate) {
      score -= 10;
      warnings.push({
        text: 'U doby určité chybí datum konce nájmu.',
        level: 'high',
      });
    }

    if (numbers.rent > 0 && numbers.deposit < numbers.rent * 2) {
      score -= 12;
      warnings.push({
        text: 'Kauce je nižší než dvojnásobek nájemného. To je z pohledu pronajímatele slabší ochrana.',
        level: 'medium',
      });
    }

    if (formData.allowAirbnb) {
      score -= 28;
      warnings.push({
        text: 'Airbnb / krátkodobý podnájem je povolen. Riziko škod, sousedských sporů a obcházení účelu nájmu je vysoké.',
        level: 'high',
      });
    }

    if (formData.allowSmoking) {
      score -= 8;
      warnings.push({
        text: 'Kouření v bytě zvyšuje riziko škod a sporů při vrácení kauce.',
        level: 'medium',
      });
    }

    if (!formData.strictPenalties) {
      score -= 10;
      warnings.push({
        text: 'Nemáš zapnutý přísnější režim pokut. Smlouva bude slabší při porušení povinností.',
        level: 'medium',
      });
    }

    if (!formData.inspectionAllowed) {
      score -= 6;
      warnings.push({
        text: 'Není povolena pravidelná kontrola bytu. To snižuje kontrolu nad stavem nemovitosti.',
        level: 'low',
      });
    }

    if (!formData.keysCount || !formData.equipmentList) {
      score -= 6;
      warnings.push({
        text: 'Chybí údaje pro předávací protokol (klíče / vybavení). To komplikuje dokazování škody.',
        level: 'medium',
      });
    }

    if (!formData.utilitiesIncludedText.trim()) {
      score -= 5;
      warnings.push({
        text: 'Není specifikováno, co přesně zahrnují služby a zálohy.',
        level: 'low',
      });
    }

    score = Math.max(0, Math.min(100, score));

    return {
      score,
      warnings,
      label: score >= 85 ? 'Silná ochrana' : score >= 70 ? 'Průměrná ochrana' : 'Slabší ochrana',
    };
  }, [formData, numbers]);

  const previewContract = useMemo(() => {
    return `
NÁJEMNÍ SMLOUVA O NÁJMU BYTU
uzavřená dle § 2235 a násl. zákona č. 89/2012 Sb., občanský zákoník

I. SMLUVNÍ STRANY

Pronajímatel:
Jméno a příjmení: ${formData.landlordName || '................'}
Rodné číslo / datum narození: ${formData.landlordId || '................'}
Trvale bytem: ${formData.landlordAddress || '................'}
Číslo OP: ${formData.landlordOP || '................'}

Nájemce:
Jméno a příjmení: ${formData.tenantName || '................'}
Rodné číslo / datum narození: ${formData.tenantId || '................'}
Trvale bytem: ${formData.tenantAddress || '................'}
Číslo OP: ${formData.tenantOP || '................'}

II. PŘEDMĚT NÁJMU

Adresa bytu: ${formData.flatAddress || '................'}
Dispozice: ${formData.flatLayout || '................'}
Číslo jednotky: ${formData.flatUnitNumber || '................'}
Katastrální území: ${formData.cadastralArea || '................'}
List vlastnictví: ${formData.ownershipSheet || '................'}
Podlaží: ${formData.floor || '................'}

III. DOBA NÁJMU

Začátek nájmu: ${formData.startDate || '................'}
Předání bytu: ${formData.handoverDate || '................'}
Doba nájmu: ${
      formData.duration === 'fixed'
        ? `určitá do ${formData.endDate || '................'}`
        : 'neurčitá'
    }

IV. NÁJEMNÉ A PLATBY

Měsíční nájemné: ${formData.rentAmount || '0'} Kč
Služby: ${formData.utilityAmount || '0'} Kč
Celkem měsíčně: ${numbers.total || 0} Kč
Kauce: ${formData.depositAmount || '0'} Kč
Splatnost: k ${formData.paymentDay || '...'} dni v měsíci
Bankovní účet: ${formData.bankAccount || '................'}
Variabilní symbol: ${formData.variableSymbol || '................'}

V. PRAVIDLA NÁJMU

Maximální počet osob: ${formData.maxOccupants || '...'}
Domácí zvířata: ${formData.allowPets ? 'povolena' : 'zakázána'}
Kouření: ${formData.allowSmoking ? 'povoleno' : 'zakázáno'}
Airbnb / krátkodobý podnájem: ${formData.allowAirbnb ? 'povoleno' : 'zakázáno'}
Přísnější pokuty: ${formData.strictPenalties ? 'ano' : 'ne'}
Kontrola bytu: ${formData.inspectionAllowed ? 'ano' : 'ne'}
Podnikání v bytě: ${formData.businessUseAllowed ? 'povoleno' : 'zakázáno'}

VI. PŘEDÁNÍ A VYBAVENÍ

Počet klíčů: ${formData.keysCount || '...'}
Elektroměr: ${formData.electricityMeter || '................'}
Plynoměr: ${formData.gasMeter || '................'}
Vodoměr: ${formData.waterMeter || '................'}

Vybavení:
${formData.equipmentList || '................'}

Známé vady / poznámky:
${formData.knownDefects || 'Bez zjevných vad.'}

V __________________ dne __________________

______________________________
Pronajímatel

______________________________
Nájemce
    `.trim();
  }, [formData, numbers.total]);

  const handoverProtocol = useMemo(() => {
    return `
PŘEDÁVACÍ PROTOKOL

k nájemní smlouvě k bytu na adrese ${formData.flatAddress || '................'}

Pronajímatel: ${formData.landlordName || '................'}
Nájemce: ${formData.tenantName || '................'}
Datum předání: ${formData.handoverDate || '................'}

1. Stav měřidel
- Elektroměr: ${formData.electricityMeter || '................'}
- Plynoměr: ${formData.gasMeter || '................'}
- Vodoměr: ${formData.waterMeter || '................'}

2. Předané klíče
- Celkový počet klíčů: ${formData.keysCount || '................'}

3. Předané vybavení
${formData.equipmentList || '................'}

4. Zjištěné vady / poškození / poznámky
${formData.knownDefects || 'Bez zjevných vad.'}
    `.trim();
  }, [formData]);

  const handlePayment = async () => {
    // Validace povinných polí
    const missingFields: string[] = [];
    if (!formData.landlordName.trim()) missingFields.push('jméno pronajímatele');
    if (!formData.tenantName.trim()) missingFields.push('jméno nájemce');
    if (!formData.flatAddress.trim()) missingFields.push('adresu bytu');
    if (!formData.rentAmount.trim()) missingFields.push('výši nájemného');
    if (!formData.startDate) missingFields.push('datum začátku nájmu');
    if (formData.duration === 'fixed' && !formData.endDate) missingFields.push('datum konce nájmu (doba určitá)');

    if (missingFields.length > 0) {
      alert(`Vyplňte prosím: ${missingFields.join(', ')}.`);
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
        contractType: 'lease' as const,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType: 'lease',
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
      alert('Chyba platební brány. Zkuste to prosím znovu nebo kontaktujte info@smlouvahned.cz');
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
    <main className="min-h-screen bg-[#05080f] text-slate-200 font-sans pb-24">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08101e]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-sm">
              SH
            </div>
            <div>
              <div className="font-bold tracking-tight text-white">SmlouvaHned Builder</div>
              <div className="text-[11px] text-slate-500">Prémiový generátor nájemní smlouvy</div>
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

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <section className={cardClass}>
              <SectionTitle
                index="01"
                title="Pronajímatel"
                subtitle="Přesná identifikace výrazně zvyšuje vymahatelnost smlouvy."
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  value={formData.landlordName}
                  onChange={handleChange}
                  name="landlordName"
                  placeholder="Celé jméno"
                  className={inputClass}
                />
                <input
                  value={formData.landlordId}
                  onChange={handleChange}
                  name="landlordId"
                  placeholder="Rodné číslo / datum narození"
                  className={inputClass}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  value={formData.landlordAddress}
                  onChange={handleChange}
                  name="landlordAddress"
                  placeholder="Trvalé bydliště"
                  className={inputClass}
                />
                <input
                  value={formData.landlordOP}
                  onChange={handleChange}
                  name="landlordOP"
                  placeholder="Číslo OP"
                  className={inputClass}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  value={formData.landlordEmail}
                  onChange={handleChange}
                  name="landlordEmail"
                  placeholder="E-mail (volitelné)"
                  className={inputClass}
                />
                <input
                  value={formData.landlordPhone}
                  onChange={handleChange}
                  name="landlordPhone"
                  placeholder="Telefon (volitelné)"
                  className={inputClass}
                />
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle
                index="02"
                title="Nájemce"
                subtitle="Vyplň co nejpřesněji, zejména OP a adresu."
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  value={formData.tenantName}
                  onChange={handleChange}
                  name="tenantName"
                  placeholder="Celé jméno"
                  className={inputClass}
                />
                <input
                  value={formData.tenantId}
                  onChange={handleChange}
                  name="tenantId"
                  placeholder="Rodné číslo / datum narození"
                  className={inputClass}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  value={formData.tenantAddress}
                  onChange={handleChange}
                  name="tenantAddress"
                  placeholder="Trvalé bydliště"
                  className={inputClass}
                />
                <input
                  value={formData.tenantOP}
                  onChange={handleChange}
                  name="tenantOP"
                  placeholder="Číslo OP"
                  className={inputClass}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  value={formData.tenantEmail}
                  onChange={handleChange}
                  name="tenantEmail"
                  placeholder="E-mail (volitelné)"
                  className={inputClass}
                />
                <input
                  value={formData.tenantPhone}
                  onChange={handleChange}
                  name="tenantPhone"
                  placeholder="Telefon (volitelné)"
                  className={inputClass}
                />
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle
                index="03"
                title="Nemovitost"
                subtitle="Tady se rozhoduje, jestli je byt ve smlouvě popsán profesionálně, nebo jen přibližně."
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  value={formData.flatAddress}
                  onChange={handleChange}
                  name="flatAddress"
                  placeholder="Adresa bytu"
                  className={inputClass}
                />
                <input
                  value={formData.flatLayout}
                  onChange={handleChange}
                  name="flatLayout"
                  placeholder="Dispozice (např. 2+kk)"
                  className={inputClass}
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <input
                  value={formData.flatUnitNumber}
                  onChange={handleChange}
                  name="flatUnitNumber"
                  placeholder="Číslo jednotky"
                  className={inputClass}
                />
                <input
                  value={formData.ownershipSheet}
                  onChange={handleChange}
                  name="ownershipSheet"
                  placeholder="List vlastnictví"
                  className={inputClass}
                />
                <input
                  value={formData.cadastralArea}
                  onChange={handleChange}
                  name="cadastralArea"
                  placeholder="Katastrální území"
                  className={inputClass}
                />
              </div>
              <input
                value={formData.floor}
                onChange={handleChange}
                name="floor"
                placeholder="Podlaží / patro"
                className={inputClass}
              />
            </section>

            <section className={cardClass}>
              <SectionTitle
                index="04"
                title="Doba nájmu a platby"
                subtitle="Základ každé funkční smlouvy je jasný termín, cena a splatnost."
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest text-slate-500">
                    Začátek nájmu
                  </label>
                  <input
                    value={formData.startDate}
                    onChange={handleChange}
                    type="date"
                    name="startDate"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest text-slate-500">
                    Předání bytu
                  </label>
                  <input
                    value={formData.handoverDate}
                    onChange={handleChange}
                    type="date"
                    name="handoverDate"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <select
                  value={formData.duration}
                  onChange={handleChange}
                  name="duration"
                  className={inputClass}
                >
                  <option value="fixed">Doba určitá</option>
                  <option value="indefinite">Doba neurčitá</option>
                </select>

                {formData.duration === 'fixed' ? (
                  <input
                    value={formData.endDate}
                    onChange={handleChange}
                    type="date"
                    name="endDate"
                    className={inputClass}
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-700 px-4 py-3 text-sm text-slate-500 bg-[#111c31]">
                    U doby neurčité není datum konce potřeba.
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <input
                  value={formData.rentAmount}
                  onChange={handleChange}
                  type="number"
                  name="rentAmount"
                  placeholder="Nájem (Kč)"
                  className={inputClass}
                />
                <input
                  value={formData.utilityAmount}
                  onChange={handleChange}
                  type="number"
                  name="utilityAmount"
                  placeholder="Služby (Kč)"
                  className={inputClass}
                />
                <input
                  value={formData.depositAmount}
                  onChange={handleChange}
                  type="number"
                  name="depositAmount"
                  placeholder="Kauce (Kč)"
                  className={inputClass}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <input
                  value={formData.bankAccount}
                  onChange={handleChange}
                  name="bankAccount"
                  placeholder="Číslo účtu"
                  className={inputClass}
                />
                <input
                  value={formData.paymentDay}
                  onChange={handleChange}
                  type="number"
                  name="paymentDay"
                  placeholder="Den splatnosti"
                  className={inputClass}
                />
                <input
                  value={formData.variableSymbol}
                  onChange={handleChange}
                  name="variableSymbol"
                  placeholder="Variabilní symbol"
                  className={inputClass}
                />
              </div>

              <textarea
                value={formData.utilitiesIncludedText}
                onChange={handleChange}
                name="utilitiesIncludedText"
                placeholder="Co zahrnují služby? Např. voda, teplo, úklid společných prostor, osvětlení domu, internet..."
                className={textareaClass}
              />

              <div className="mt-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-1">
                  Souhrn plateb
                </div>
                <div className="text-sm text-slate-300">
                  Měsíční nájem: <span className="font-bold text-white">{numbers.rent || 0} Kč</span> ·
                  Služby: <span className="font-bold text-white">{numbers.utils || 0} Kč</span> ·
                  Celkem: <span className="font-bold text-emerald-300">{numbers.total || 0} Kč</span>
                </div>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle
                index="05"
                title="Předávací protokol"
                subtitle="Tohle je přesně ta část, která při sporu rozhoduje o škodě a vrácení kauce."
              />
              <div className="grid sm:grid-cols-4 gap-4 mb-4">
                <input
                  value={formData.keysCount}
                  onChange={handleChange}
                  type="number"
                  name="keysCount"
                  placeholder="Počet klíčů"
                  className={inputClass}
                />
                <input
                  value={formData.electricityMeter}
                  onChange={handleChange}
                  name="electricityMeter"
                  placeholder="Elektroměr"
                  className={inputClass}
                />
                <input
                  value={formData.gasMeter}
                  onChange={handleChange}
                  name="gasMeter"
                  placeholder="Plynoměr"
                  className={inputClass}
                />
                <input
                  value={formData.waterMeter}
                  onChange={handleChange}
                  name="waterMeter"
                  placeholder="Vodoměr"
                  className={inputClass}
                />
              </div>

              <div className="mb-4">
                <textarea
                  value={formData.equipmentList}
                  onChange={handleChange}
                  name="equipmentList"
                  placeholder="Seznam vybavení bytu. Např. kuchyňská linka, trouba, lednice, myčka, postel, skříně..."
                  className={textareaClass}
                />
              </div>

              <textarea
                value={formData.knownDefects}
                onChange={handleChange}
                name="knownDefects"
                placeholder="Známé vady / poškození / poznámky. Např. oděrky na podlaze, prasklina u umyvadla, chybějící žaluzie..."
                className={textareaClass}
              />
            </section>

            <section className={cardClass}>
              <SectionTitle
                index="06"
                title="Pravidla nájmu"
                subtitle="Tady nastavuješ, jak tvrdý nebo měkký režim bude smlouva mít."
              />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <ToggleCard
                  name="allowPets"
                  checked={formData.allowPets}
                  label="Domácí zvířata"
                  hint="Povolení nebo zákaz chovu zvířat v bytě."
                />
                <ToggleCard
                  name="allowSmoking"
                  checked={formData.allowSmoking}
                  label="Kouření v bytě"
                  hint="Povolení kouření zvyšuje riziko škod."
                  danger={formData.allowSmoking}
                />
                <ToggleCard
                  name="allowAirbnb"
                  checked={formData.allowAirbnb}
                  label="Airbnb / krátkodobý podnájem"
                  hint="Vysoce rizikové nastavení pro pronajímatele."
                  danger
                />
                <ToggleCard
                  name="strictPenalties"
                  checked={formData.strictPenalties}
                  label="Přísnější smluvní pokuty"
                  hint="Doporučeno. Zvyšuje ochranu při neplacení a nevyklizení."
                />
                <ToggleCard
                  name="inspectionAllowed"
                  checked={formData.inspectionAllowed}
                  label="Právo kontroly bytu"
                  hint="Pronajímatel může po oznámení zkontrolovat stav bytu."
                />
                <ToggleCard
                  name="businessUseAllowed"
                  checked={formData.businessUseAllowed}
                  label="Povolit podnikání v bytě"
                  hint="Obvykle je lepší nechat byt pouze k bydlení."
                  danger={formData.businessUseAllowed}
                />
              </div>

              <div className="rounded-2xl border border-slate-700/80 bg-[#111c31] p-4 w-fit">
                <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                  Maximální počet osob
                </div>
                <input
                  value={formData.maxOccupants}
                  onChange={handleChange}
                  type="number"
                  name="maxOccupants"
                  className="bg-transparent w-24 text-2xl font-black text-white outline-none"
                />
              </div>
            </section>

            {/* === VÝBĚR BALÍČKU === */}
            <section className={cardClass}>
              <SectionTitle
                index="07"
                title="Vyberte úroveň ochrany"
                subtitle="Čím vyšší balíček, tím silnější smlouva a více doprovodných materiálů."
              />
              <div className="space-y-3">
                {([
                  { value: 'basic', label: 'Základní dokument', price: '249 Kč', desc: 'Profesionální smlouva dle občanského zákoníku v PDF.' },
                  { value: 'professional', label: 'Profesionální ochrana', price: '449 Kč', desc: 'Rozšířené klauzule, smluvní pokuty a zajišťovací ustanovení.', recommended: true },
                  { value: 'complete', label: 'Kompletní balíček', price: '749 Kč', desc: 'Vše z Profesionální ochrany + průvodní instrukce, checklist a 30denní archivace.' },
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
                          Nejčastěji voleno
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
                          <span className="text-lg font-black text-white">{opt.price}</span>
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
            </section>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 space-y-6">
              <div className={`${cardClass} overflow-hidden`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                      Stav vyplnění
                    </div>
                    <div className="mt-2 text-3xl font-black text-white">{completion}%</div>
                    <div className="mt-1 text-sm text-slate-400">
                      Čím kompletnější údaje, tím silnější výsledná smlouva.
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
                      Risk score
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
                      Smlouva je zatím nastavena velmi dobře. Rizikové prvky nejsou detekovány.
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
                    Tady se okamžitě propisují všechny změny z formuláře.
                  </div>
                </div>

                <div className="font-serif text-[11px] text-slate-800 leading-relaxed h-[420px] overflow-hidden relative">
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
                {/* Price summary */}
                <div className="mb-4 rounded-2xl border border-white/8 bg-white/3 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Základní dokument</span>
                    <span className="text-sm font-bold text-white">249 Kč</span>
                  </div>
                  {formData.tier !== 'basic' && (
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-400">{formData.tier === 'complete' ? 'Kompletní balíček' : 'Profesionální ochrana'}</span>
                      <span className="text-sm font-bold text-amber-400">{formData.tier === 'complete' ? '+500 Kč' : '+200 Kč'}</span>
                    </div>
                  )}
                  <div className="border-t border-white/8 mt-2 pt-2 flex items-center justify-between">
                    <span className="text-sm font-black text-white">Celkem</span>
                    <span className="text-xl font-black text-amber-400">{formData.tier === 'complete' ? '749 Kč' : formData.tier === 'professional' ? '449 Kč' : '249 Kč'}</span>
                  </div>
                </div>

                {/* GDPR souhlas */}
                <label className="flex items-start gap-3 mb-4 cursor-pointer group">
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
                    `Zaplatit ${formData.tier === 'complete' ? '749 Kč' : formData.tier === 'professional' ? '449 Kč' : '249 Kč'} a stáhnout PDF →`
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