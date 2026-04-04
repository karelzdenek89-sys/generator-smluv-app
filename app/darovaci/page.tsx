'use client';

import { useState, useMemo } from 'react';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import ContractPreview from '@/app/components/ContractPreview';
import { buildContractSections } from '@/lib/contracts';
import type { StoredContractData } from '@/lib/contracts';

type GiftType = 'money' | 'car' | 'property' | 'thing';

type FormDataType = {
  giftType: GiftType;
  donorName: string;
  donorId: string;
  donorAddress: string;
  doneeName: string;
  doneeId: string;
  doneeAddress: string;
  amount: string;
  currency: string;
  carMake: string;
  carModel: string;
  carVIN: string;
  carPlate: string;
  carYear: string;
  propertyAddress: string;
  propertyLV: string;
  propertyCadastre: string;
  thingDescription: string;
  giftDate: string;
  withReservation: boolean;
  reservationDescription: string;
  notaryUpsell: boolean;
  tier: 'basic' | 'professional' | 'complete';
  disputeResolution: 'court' | 'mediation' | 'arbitration';
};

export default function GiftContractPage() {
  const [formData, setFormData] = useState<FormDataType>({
    giftType: 'money',
    donorName: '',
    donorId: '',
    donorAddress: '',
    doneeName: '',
    doneeId: '',
    doneeAddress: '',
    amount: '',
    currency: 'Kč',
    carMake: '',
    carModel: '',
    carVIN: '',
    carPlate: '',
    carYear: '',
    propertyAddress: '',
    propertyLV: '',
    propertyCadastre: '',
    thingDescription: '',
    giftDate: new Date().toISOString().split('T')[0],
    withReservation: false,
    reservationDescription: '',
    notaryUpsell: false,
    tier: 'basic' as const,
    disputeResolution: 'court' as const,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [withdrawalConsent, setWithdrawalConsent] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState(false);

  const updateField = (field: keyof FormDataType, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const riskAnalysis = useMemo(() => {
    let score = 100;
    const warnings: string[] = [];

    if (!formData.donorName.trim() || !formData.doneeName.trim()) {
      score -= 25;
      warnings.push('Doporučujeme doplnit jména dárce a obdarovaného.');
    }
    if (!formData.donorId.trim() || !formData.doneeId.trim()) {
      score -= 15;
      warnings.push('Doporučujeme vyplnit rodné číslo / datum narození.');
    }
    if (!formData.giftDate) {
      score -= 10;
      warnings.push('Doporučujeme doplnit datum darování.');
    }

    if (formData.giftType === 'money' && !formData.amount) {
      score -= 30;
      warnings.push('Doporučujeme doplnit darovanou částku.');
    }
    if (formData.giftType === 'car' && (!formData.carVIN || !formData.carMake)) {
      score -= 25;
      warnings.push('Doporučujeme doplnit základní údaje o vozidle (VIN, značka).');
    }
    if (
      formData.giftType === 'property' &&
      (!formData.propertyAddress || !formData.propertyLV)
    ) {
      score -= 35;
      warnings.push('Doporučujeme doplnit klíčové údaje o nemovitosti.');
    }
    if (formData.giftType === 'thing' && !formData.thingDescription.trim()) {
      score -= 20;
      warnings.push('Doporučujeme doplnit popis darované věci.');
    }

    if (score < 0) score = 0;
    return { score, warnings };
  }, [formData]);

  const scoreColor =
    riskAnalysis.score >= 85
      ? 'bg-emerald-500'
      : riskAnalysis.score >= 65
        ? 'bg-amber-500'
        : 'bg-rose-500';

  const scrollToPreview = () => {
    document.getElementById('preview-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const previewSections = useMemo(() => {
    try {
      if (!formData.donorName) return [];
      return buildContractSections({ ...formData, contractType: 'gift' } as StoredContractData);
    } catch {
      return [];
    }
  }, [formData]);

  const handlePayment = async () => {
    // Validace povinných polí
    const missingFields: string[] = [];
    if (!formData.donorName.trim()) missingFields.push('jméno dárce');
    if (!formData.doneeName.trim()) missingFields.push('jméno obdarovaného');
    if (formData.giftType === 'money' && !formData.amount.trim()) missingFields.push('darovanou částku');
    if (formData.giftType === 'car' && !formData.carVIN.trim()) missingFields.push('VIN vozidla');
    if (formData.giftType === 'property' && !formData.propertyAddress.trim()) missingFields.push('adresu nemovitosti');
    if (formData.giftType === 'thing' && !formData.thingDescription.trim()) missingFields.push('popis darované věci');

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
        contractType: 'gift' as const,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType: 'gift',
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
  };

  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200 pb-24">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08101e]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-sm">SH</div>
            <div>
              <div className="font-bold tracking-tight text-white">SmlouvaHned Builder</div>
              <div className="text-[11px] text-slate-500">Prémiový generátor darovací smlouvy</div>
            </div>
          </div>
          <button onClick={() => (window.location.href = '/')} className="text-sm text-slate-400 hover:text-white transition">Zavřít</button>
        </div>
      </header>

      <ContractLandingSection
        badge="§ 2055 a násl. občanského zákoníku"
        h1Main="Darovací smlouva"
        h1Accent="online"
        subtitle="Vytvořte darovací smlouvu pro darování peněz, vozidla, movité věci nebo jiného majetku. Dokument jasně vymezuje předmět daru, darování bez odměny a podmínky převodu."
        benefits={[
          { icon: '🎁', text: 'Pokrývá darování peněz, věci, vozidla i nemovitosti' },
          { icon: '⚖️', text: 'Sestaveno dle § 2055 OZ — bezplatný převod vlastnického práva' },
          { icon: '📄', text: 'PDF ke stažení ihned po ověřené platbě' },
          { icon: '🔒', text: 'Volitelná podmínka vrácení daru (odvolání daru)' },
        ]}
        contents={[
          'Identifikaci dárce a obdarovaného',
          'Přesný popis předmětu daru (peníze, věc, vozidlo)',
          'Potvrzení bezplatnosti převodu vlastnického práva',
          'Datum darování a podmínky předání',
          'Volitelnou podmínku vrácení daru (§ 2068–2075 OZ)',
          'Závěrečná ustanovení, GDPR a vyšší moc',
        ]}
        whenSuitable={[
          'Darování peněz (finanční dar v rodině nebo blízkým)',
          'Darování vozidla (auto, motocykl)',
          'Darování movité věci (nábytek, elektronika, starožitnosti)',
          'Situace, kde je třeba písemně doložit bezplatný převod majetku',
        ]}
        whenOther={[
          { label: 'Kupní smlouva na movitou věc', href: '/kupni', text: 'Pokud za věc obdržíte úplatu — darování je vždy bezplatné.' },
          { label: 'Kupní smlouva na vozidlo', href: '/auto', text: 'Pokud vozidlo prodáváte za kupní cenu, nikoli darujete.' },
        ]}
        faq={[
          { q: 'Musí být darovací smlouva písemná?', a: 'U movitých věcí předaných ihned písemná forma nutná není. Doporučujeme ji vždy — zejména u vyšší hodnoty daru (peníze, vozidlo), kde je dobré mít doložitelný právní základ.' },
          { q: 'Platí se daň z darování?', a: 'Darování mezi osobami blízkými (§ 22 zákona o daních z příjmů) je zpravidla osvobozeno od daně. U darování jiným osobám záleží na hodnotě daru a vztahu stran — doporučujeme konzultaci s daňovým poradcem.' },
          { q: 'Lze dar odvolat?', a: 'Ano, § 2068–2075 OZ umožňuje odvolání daru, pokud se obdarovaný zachová vůči dárci způsobem, který hrubě porušuje dobré mravy. Tento mechanismus lze do smlouvy výslovně zahrnout.' },
          { q: 'Dostanu dokument ihned po zaplacení?', a: 'Ano, PDF je k dispozici ke stažení okamžitě po dokončení platby.' },
        ]}
        ctaLabel="Vytvořit darovací smlouvu"
        formId="formular"
        guideHref="/darovaci-smlouva"
        guideLabel="Průvodce darovací smlouvou — peníze, auto, nemovitost a odvolání daru"
      />

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8" id="formular">
        <div className="mb-6 border-t border-slate-800/60 pt-8">
          <h2 className="text-lg font-black text-white uppercase tracking-wide">Vyplňte údaje dokumentu</h2>
          <p className="text-sm text-slate-500 mt-1">Všechna povinná pole jsou označena *</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <section className="bg-[#0c1426] border border-slate-800 rounded-3xl p-8">
              <h3 className="uppercase text-xs tracking-widest font-bold text-amber-400 mb-6">
                1. Co darujete?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['money', 'car', 'property', 'thing'] as GiftType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => updateField('giftType', type)}
                    className={`py-5 px-4 rounded-2xl border-2 transition-all font-medium ${
                      formData.giftType === type
                        ? 'border-amber-500 bg-amber-500/10 text-white'
                        : 'border-slate-700 hover:border-slate-600 text-slate-400'
                    }`}
                  >
                    {type === 'money' && '💰 Peníze'}
                    {type === 'car' && '🚗 Auto'}
                    {type === 'property' && '🏠 Nemovitost'}
                    {type === 'thing' && '📦 Movitá věc'}
                  </button>
                ))}
              </div>
            </section>

            <div className="grid md:grid-cols-2 gap-8">
              <section className="bg-[#0c1426] border border-slate-800 rounded-3xl p-8">
                <h3 className="uppercase text-xs tracking-widest font-bold mb-6">2. Dárce</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Celé jméno"
                    className="w-full bg-[#05080f] border border-slate-700 p-4 rounded-2xl focus:border-amber-500 outline-none"
                    value={formData.donorName}
                    onChange={(e) => updateField('donorName', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Rodné číslo / Datum narození"
                    className="w-full bg-[#05080f] border border-slate-700 p-4 rounded-2xl focus:border-amber-500 outline-none"
                    value={formData.donorId}
                    onChange={(e) => updateField('donorId', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Trvalé bydliště"
                    className="w-full bg-[#05080f] border border-slate-700 p-4 rounded-2xl focus:border-amber-500 outline-none"
                    value={formData.donorAddress}
                    onChange={(e) => updateField('donorAddress', e.target.value)}
                  />
                </div>
              </section>

              <section className="bg-[#0c1426] border border-slate-800 rounded-3xl p-8">
                <h3 className="uppercase text-xs tracking-widest font-bold mb-6">3. Obdarovaný</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Celé jméno"
                    className="w-full bg-[#05080f] border border-slate-700 p-4 rounded-2xl focus:border-amber-500 outline-none"
                    value={formData.doneeName}
                    onChange={(e) => updateField('doneeName', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Rodné číslo / Datum narození"
                    className="w-full bg-[#05080f] border border-slate-700 p-4 rounded-2xl focus:border-amber-500 outline-none"
                    value={formData.doneeId}
                    onChange={(e) => updateField('doneeId', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Trvalé bydliště"
                    className="w-full bg-[#05080f] border border-slate-700 p-4 rounded-2xl focus:border-amber-500 outline-none"
                    value={formData.doneeAddress}
                    onChange={(e) => updateField('doneeAddress', e.target.value)}
                  />
                </div>
              </section>
            </div>

            <section className="bg-[#0c1426] border border-slate-800 rounded-3xl p-8">
              <h3 className="uppercase text-xs tracking-widest font-bold mb-6">4. Specifikace daru</h3>

              {formData.giftType === 'money' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Darovaná částka"
                    className="bg-[#05080f] border border-slate-700 p-4 rounded-2xl"
                    value={formData.amount}
                    onChange={(e) => updateField('amount', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Měna"
                    className="bg-[#05080f] border border-slate-700 p-4 rounded-2xl"
                    value={formData.currency}
                    onChange={(e) => updateField('currency', e.target.value)}
                  />
                </div>
              )}

              {formData.giftType === 'car' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Značka"
                    className="bg-[#05080f] border border-slate-700 p-4 rounded-2xl"
                    value={formData.carMake}
                    onChange={(e) => updateField('carMake', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Model"
                    className="bg-[#05080f] border border-slate-700 p-4 rounded-2xl"
                    value={formData.carModel}
                    onChange={(e) => updateField('carModel', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="VIN kód"
                    className="bg-[#05080f] border border-slate-700 p-4 rounded-2xl"
                    value={formData.carVIN}
                    onChange={(e) => updateField('carVIN', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="SPZ"
                    className="bg-[#05080f] border border-slate-700 p-4 rounded-2xl"
                    value={formData.carPlate}
                    onChange={(e) => updateField('carPlate', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Rok výroby"
                    className="bg-[#05080f] border border-slate-700 p-4 rounded-2xl"
                    value={formData.carYear}
                    onChange={(e) => updateField('carYear', e.target.value)}
                  />
                </div>
              )}

              {formData.giftType === 'property' && (
                <div className="space-y-4">
                  {/* Alert — darování nemovitosti vyžaduje notáře + katastr */}
                  <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
                    <span className="mt-0.5 flex-shrink-0 text-xl">⚠️</span>
                    <div>
                      <div className="mb-1 text-sm font-black text-amber-300">
                        Důležité upozornění k darování nemovitosti
                      </div>
                      <p className="text-xs leading-relaxed text-amber-100/80">
                        Převod nemovitosti vyžaduje <strong className="text-amber-200">úředně ověřené podpisy obou stran</strong> a podání návrhu na vklad do katastru nemovitostí.
                        Vygenerovaný dokument slouží jako podklad — k dokončení převodu je nutné zajistit ověření podpisů (Czech POINT, notář) a podat návrh na vklad.
                        SmlouvaHned.cz nezajišťuje notářské ani katastrální služby.
                      </p>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Adresa nemovitosti"
                    className="w-full bg-[#05080f] border border-slate-700 p-4 rounded-2xl"
                    value={formData.propertyAddress}
                    onChange={(e) => updateField('propertyAddress', e.target.value)}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="List vlastnictví (LV)"
                      className="bg-[#05080f] border border-slate-700 p-4 rounded-2xl"
                      value={formData.propertyLV}
                      onChange={(e) => updateField('propertyLV', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Katastrální území"
                      className="bg-[#05080f] border border-slate-700 p-4 rounded-2xl"
                      value={formData.propertyCadastre}
                      onChange={(e) => updateField('propertyCadastre', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {formData.giftType === 'thing' && (
                <textarea
                  placeholder="Podrobný popis darované věci..."
                  className="w-full h-40 bg-[#05080f] border border-slate-700 p-4 rounded-2xl resize-y"
                  value={formData.thingDescription}
                  onChange={(e) => updateField('thingDescription', e.target.value)}
                />
              )}
            </section>

            <section className="bg-[#0c1426] border border-slate-800 rounded-3xl p-8 space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
                  Datum darování
                </label>
                <input
                  type="date"
                  className="w-full bg-[#05080f] border border-slate-700 p-4 rounded-2xl"
                  value={formData.giftDate}
                  onChange={(e) => updateField('giftDate', e.target.value)}
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.withReservation}
                  onChange={(e) => updateField('withReservation', e.target.checked)}
                  className="w-5 h-5 accent-amber-500"
                />
                <span>Daruji s výminkem (doživotní užívání, renta apod.)</span>
              </label>

              {formData.withReservation && (
                <textarea
                  placeholder="Popis výminku..."
                  className="w-full h-28 bg-[#05080f] border border-slate-700 p-4 rounded-2xl"
                  value={formData.reservationDescription}
                  onChange={(e) => updateField('reservationDescription', e.target.value)}
                />
              )}

            </section>

            {/* Řešení sporů */}
            <section className="bg-[#0c1426] border border-slate-800 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
              <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Řešení sporů</div>
              <select className="w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-500/60 transition" name="disputeResolution" value={formData.disputeResolution} onChange={(e) => setFormData(p => ({ ...p, disputeResolution: e.target.value as 'court' | 'mediation' | 'arbitration' }))}>
                <option value="court">Obecný soud (výchozí)</option>
                <option value="mediation">Mediace (zákon č. 202/2012 Sb.)</option>
                <option value="arbitration">Rozhodčí řízení (Rozhodčí soud HK ČR)</option>
              </select>
            </section>

            {/* Výběr balíčku */}
            <section className="bg-[#0c1426] border border-slate-800 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
              <div className="mb-5">
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90">Výběr úrovně ochrany</div>
                <p className="mt-2 text-sm text-slate-400">Čím vyšší balíček, tím silnější smlouva a více příloh.</p>
              </div>
              <div className="space-y-3">
                {([
                  { value: 'basic', label: 'Základní dokument', price: '249 Kč', desc: 'Kompletní darovací smlouva dle OZ v PDF.' },
                  { value: 'professional', label: 'Rozšířený dokument', price: '399 Kč', desc: 'Rozšířené klauzule, odpovědnostní ustanovení a sankce.', recommended: true },
                  { value: 'complete', label: 'Kompletní balíček', price: '749 Kč', desc: 'Vše z Rozšířeného dokumentu + instrukce k podpisu, checklist a 30denní archivace.' },
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
                        <span className="rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-black">Nejčastěji voleno</span>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="tier"
                        value={opt.value}
                        checked={formData.tier === opt.value}
                        onChange={(e) => updateField('tier', e.target.value)}
                        className="mt-1 h-5 w-5 accent-amber-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black uppercase tracking-wide text-amber-400">{opt.label}</span>
                          <span className="text-lg font-black text-white">{opt.price}</span>
                        </div>
                        <div className="mt-1 text-xs leading-relaxed text-slate-400">{opt.desc}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* === PRAVÝ SIDEBAR === */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 space-y-6">
              {/* Watermarked document preview */}
              {previewSections.length > 0 && (
                <ContractPreview sections={previewSections} title="Darovací smlouva" />
              )}

              {/* Risk score */}
              <div className="bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="font-black text-white text-sm uppercase tracking-[0.18em]">Kontrola rizik</h3>
                    <p className="text-sm text-slate-400 mt-1">{riskAnalysis.score >= 85 ? 'Silná smlouva' : riskAnalysis.score >= 65 ? 'Průměrná ochrana' : 'Doplňte údaje'}</p>
                  </div>
                  <div className={`text-3xl font-black ${riskAnalysis.score >= 85 ? 'text-emerald-400' : riskAnalysis.score >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {riskAnalysis.score}/100
                  </div>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full transition-all ${riskAnalysis.score >= 85 ? 'bg-emerald-400' : riskAnalysis.score >= 65 ? 'bg-amber-400' : 'bg-rose-400'}`}
                    style={{ width: `${riskAnalysis.score}%` }}
                  />
                </div>
                {riskAnalysis.warnings.length > 0 ? (
                  <div className="space-y-2">
                    {riskAnalysis.warnings.map((w, i) => (
                      <div key={i} className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-100">{w}</div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">Smlouva je nastavena správně.</div>
                )}
              </div>

              {/* Platba */}
              <div className="bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                <div className="mb-4 rounded-2xl border border-white/8 bg-white/3 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">Základní dokument</span>
                    <span className="text-sm font-bold text-white">249 Kč</span>
                  </div>
                  {formData.tier !== 'basic' && (
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-400">{formData.tier === 'complete' ? 'Kompletní balíček' : 'Rozšířený dokument'}</span>
                      <span className="text-sm font-bold text-amber-400">{formData.tier === 'complete' ? '+500 Kč' : '+200 Kč'}</span>
                    </div>
                  )}
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
                  🔒 Zabezpečená platba přes Stripe · PDF ke stažení ihned
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
