'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

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
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const updateField = (field: keyof FormDataType, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const riskAnalysis = useMemo(() => {
    let score = 100;
    const warnings: string[] = [];

    if (!formData.donorName.trim() || !formData.doneeName.trim()) {
      score -= 25;
      warnings.push('Chybí jména dárce nebo obdarovaného.');
    }
    if (!formData.donorId.trim() || !formData.doneeId.trim()) {
      score -= 15;
      warnings.push('Doporučujeme vyplnit rodné číslo / datum narození.');
    }
    if (!formData.giftDate) {
      score -= 10;
      warnings.push('Chybí datum darování.');
    }

    if (formData.giftType === 'money' && !formData.amount) {
      score -= 30;
      warnings.push('Není uvedena darovaná částka.');
    }
    if (formData.giftType === 'car' && (!formData.carVIN || !formData.carMake)) {
      score -= 25;
      warnings.push('Chybí základní údaje o vozidle (VIN, značka).');
    }
    if (
      formData.giftType === 'property' &&
      (!formData.propertyAddress || !formData.propertyLV)
    ) {
      score -= 35;
      warnings.push('Chybí klíčové údaje o nemovitosti.');
    }
    if (formData.giftType === 'thing' && !formData.thingDescription.trim()) {
      score -= 20;
      warnings.push('Chybí popis darované věci.');
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

  const formattedAmount = formData.amount
    ? Number(formData.amount).toLocaleString('cs-CZ')
    : '';

  const previewText = useMemo(() => {
    const typeText = {
      money: `peněžní částku ve výši ${formattedAmount || '__________'} ${formData.currency}`,
      car: `motorové vozidlo ${formData.carMake || ''} ${formData.carModel || ''}, VIN: ${formData.carVIN || '__________'}, SPZ: ${formData.carPlate || '__________'}, rok výroby ${formData.carYear || '____'}`,
      property: `nemovitost na adrese ${formData.propertyAddress || '__________'}, list vlastnictví č. ${formData.propertyLV || '__________'}, katastrální území ${formData.propertyCadastre || '__________'}`,
      thing: `movitou věc: ${formData.thingDescription || '__________'}`,
    };

    return `
DAROVACÍ SMLOUVA

Dárce: ${formData.donorName || '____________________'}, nar. ${formData.donorId || '__________'}, bytem ${formData.donorAddress || '____________________'}
Obdarovaný: ${formData.doneeName || '____________________'}, nar. ${formData.doneeId || '__________'}, bytem ${formData.doneeAddress || '____________________'}

Dárce tímto daruje obdarovanému ${typeText[formData.giftType]}.

Obdarovaný dar přijímá.

${
  formData.withReservation
    ? `Tento dar je poskytován s výminkem: ${formData.reservationDescription || '__________'}\n`
    : ''
}

Tato smlouva byla uzavřena dne ${formData.giftDate || '__________'}.

V __________________ dne __________________
Dárce: ____________________          Obdarovaný: ____________________
    `.trim();
  }, [formData, formattedAmount]);

  const scrollToPreview = () => {
    document.getElementById('preview-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handlePayment = async () => {
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
          notaryUpsell: Boolean(formData.notaryUpsell),
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
    <main className="min-h-screen bg-[#05080f] text-slate-200 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold tracking-widest mb-4">
            NOVINKA 2026
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
            Darovací smlouva
          </h1>
          <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">
            Bezpečně převeďte majetek. S automatickou kontrolou rizik a živým náhledem.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
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

              <label className="flex items-center gap-3 cursor-pointer pt-4 border-t border-slate-800">
                <input
                  type="checkbox"
                  checked={formData.notaryUpsell}
                  onChange={(e) => updateField('notaryUpsell', e.target.checked)}
                  className="w-5 h-5 accent-amber-500"
                />
                <span>Chci notářsky ověřené podpisy (+490 Kč)</span>
              </label>
            </section>

            <motion.button
              whileHover={{ scale: isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-7 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-black text-2xl rounded-3xl shadow-xl transition-all disabled:opacity-60"
            >
              {isProcessing
                ? 'PŘESMĚROVÁNÍ NA PLATBU...'
                : formData.notaryUpsell
                  ? 'ZAPLATIT A VYGENEROVAT – 789 Kč'
                  : 'ZAPLATIT A VYGENEROVAT – 299 Kč'}
            </motion.button>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#0c1426] border border-slate-800 rounded-3xl p-8 sticky top-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Risk Score</h3>
                <div className={`px-6 py-2 rounded-2xl text-white font-bold text-2xl ${scoreColor}`}>
                  {riskAnalysis.score}/100
                </div>
              </div>

              {riskAnalysis.warnings.length > 0 ? (
                <div className="space-y-3 text-sm">
                  {riskAnalysis.warnings.map((w, i) => (
                    <div
                      key={i}
                      className="bg-rose-950/50 border border-rose-900/50 p-4 rounded-2xl text-rose-400"
                    >
                      ⚠️ {w}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-emerald-400">Všechny klíčové údaje jsou vyplněny správně.</p>
              )}

              <button
                onClick={scrollToPreview}
                className="mt-6 w-full py-3 border border-slate-600 hover:border-amber-500 transition rounded-2xl text-sm font-medium lg:hidden"
              >
                Zobrazit náhled smlouvy ↓
              </button>
            </div>

            <div id="preview-section" className="bg-[#0c1426] border border-slate-800 rounded-3xl p-8">
              <h3 className="uppercase text-xs tracking-widest font-bold mb-6 text-amber-400">
                Náhled darovací smlouvy
              </h3>
              <div className="bg-white text-black p-8 rounded-2xl text-[15px] leading-relaxed font-serif min-h-[460px] whitespace-pre-wrap border border-slate-200 shadow-inner">
                {previewText}
              </div>
              <p className="text-xs text-slate-500 mt-4 text-center">
                Toto je pouze orientační náhled • Plná verze bude vygenerována po platbě
              </p>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Citlivé údaje se neukládají do localStorage v prohlížeči.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}