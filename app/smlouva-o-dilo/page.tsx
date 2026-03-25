'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

type PaymentType = 'after_completion' | 'with_deposit' | 'milestones';

type WorkContractData = {
  clientName: string;
  clientAddress: string;
  clientRegNo: string;
  clientId?: string;

  contractorName: string;
  contractorAddress: string;
  contractorRegNo: string;
  contractorId?: string;

  workTitle: string;
  workDescription: string;
  workLocation: string;
  materialBy: 'contractor' | 'client' | 'both';

  priceAmount: string;
  currency: string;
  paymentType: PaymentType;
  depositAmount: string;

  startDate: string;
  endDate: string;

  warrantyMonths: string;
  delayPenaltyPerDay: string;
  defectPenaltyPercent: string;

  insuranceRequired: boolean;
  handoverProtocol: boolean;
  withdrawalRight: boolean;
  notaryUpsell: boolean;
};

const defaultData: WorkContractData = {
  clientName: '',
  clientAddress: '',
  clientRegNo: '',
  contractorName: '',
  contractorAddress: '',
  contractorRegNo: '',
  workTitle: '',
  workDescription: '',
  workLocation: '',
  materialBy: 'contractor',
  priceAmount: '',
  currency: 'Kč',
  paymentType: 'after_completion',
  depositAmount: '',
  startDate: '',
  endDate: '',
  warrantyMonths: '24',
  delayPenaltyPerDay: '0.05',
  defectPenaltyPercent: '10',
  insuranceRequired: true,
  handoverProtocol: true,
  withdrawalRight: false,
  notaryUpsell: false,
};

export default function WorkContractPage() {
  const [formData, setFormData] = useState<WorkContractData>(defaultData);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const updateField = (field: keyof WorkContractData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const riskAnalysis = useMemo(() => {
    let score = 100;
    const warnings: string[] = [];

    if (!formData.clientName.trim() || !formData.contractorName.trim()) {
      score -= 20;
      warnings.push('Chybí jména smluvních stran.');
    }

    if (!formData.contractorRegNo.trim()) {
      score -= 15;
      warnings.push('Zhotovitel nemá vyplněné IČO – riziko sporu o identitu.');
    }

    if (!formData.workDescription.trim() || formData.workDescription.trim().length < 30) {
      score -= 25;
      warnings.push('Předmět díla je nedostatečně specifikován.');
    }

    if (!formData.priceAmount) {
      score -= 20;
      warnings.push('Není stanovena cena díla.');
    }

    if (!formData.endDate) {
      score -= 15;
      warnings.push('Chybí termín dokončení díla.');
    }

    if (formData.paymentType === 'with_deposit' && !formData.depositAmount) {
      score -= 10;
      warnings.push('Vybrána platba se zálohou, ale chybí její výše.');
    }

    if (Number(formData.delayPenaltyPerDay) < 0.01) {
      score -= 8;
      warnings.push('Nízká nebo žádná smluvní pokuta za prodlení.');
    }

    if (Number(formData.warrantyMonths) < 24) {
      score -= 5;
      warnings.push('Záruka kratší než 24 měsíců – zvažte prodloužení.');
    }

    return { score: Math.max(0, score), warnings };
  }, [formData]);

  const scoreColor =
    riskAnalysis.score >= 85
      ? 'bg-emerald-500'
      : riskAnalysis.score >= 65
        ? 'bg-amber-500'
        : 'bg-rose-500';

  const previewText = useMemo(() => {
    const paymentDesc =
      formData.paymentType === 'with_deposit'
        ? `Záloha ${formData.depositAmount ? Number(formData.depositAmount).toLocaleString('cs-CZ') : '__________'} ${formData.currency} před zahájením, doplatek po předání.`
        : formData.paymentType === 'milestones'
          ? 'Cena bude hrazena průběžně dle dílčích fakturací.'
          : 'Celková cena je splatná po řádném předání díla bez vad.';

    return `SMLOUVA O DÍLO

I. SMLUVNÍ STRANY
Objednatel: ${formData.clientName || '____________________'}
IČO: ${formData.clientRegNo || '__________'}
Adresa: ${formData.clientAddress || '____________________'}

Zhotovitel: ${formData.contractorName || '____________________'}
IČO: ${formData.contractorRegNo || '__________'}
Adresa: ${formData.contractorAddress || '____________________'}

II. PŘEDMĚT DÍLA
Zhotovitel se zavazuje provést pro objednatele dílo: ${formData.workTitle || '____________________'}
Popis prací: ${formData.workDescription || '____________________'}
Místo plnění: ${formData.workLocation || '____________________'}
Materiál dodává: ${
      formData.materialBy === 'contractor'
        ? 'Zhotovitel'
        : formData.materialBy === 'client'
          ? 'Objednatel'
          : 'Obě strany'
    }

III. CENA A PLATEBNÍ PODMÍNKY
Celková cena díla: ${formData.priceAmount ? Number(formData.priceAmount).toLocaleString('cs-CZ') : '__________'} ${formData.currency}
${paymentDesc}

IV. TERMÍNY PLNĚNÍ
Zahájení: ${formData.startDate || '__________'}
Dokončení a předání: ${formData.endDate || '__________'}

V. ZÁRUKA A SANKCE
Záruka za jakost: ${formData.warrantyMonths || '24'} měsíců
Smluvní pokuta za prodlení: ${formData.delayPenaltyPerDay || '0,05'} % z ceny díla za každý den prodlení.
Smluvní pokuta za vady: ${formData.defectPenaltyPercent || '10'} % z ceny díla.

VI. ZÁVĚREČNÁ USTANOVENÍ
${formData.handoverProtocol ? '• Předání díla proběhne protokolem o předání a převzetí.\n' : ''}${formData.insuranceRequired ? '• Zhotovitel je povinen mít uzavřeno pojištění odpovědnosti za škodu.\n' : ''}Smlouva je uzavřena dobrovolně v souladu s § 2586 a násl. občanského zákoníku.`.trim();
  }, [formData]);

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);

      const payload = {
        ...formData,
        contractType: 'work_contract' as const,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType: 'work_contract',
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
            GARANTOVÁNO PRO ROK 2026
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
            Smlouva o <span className="text-amber-500">dílo</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Nejkomplexnější ochrana pro řemeslníky, stavebníky i objednatele. Minimalizace sporů a maximalizace právní jistoty.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <section className="bg-[#0c1426] border border-slate-800 rounded-3xl p-8">
                <h3 className="text-amber-400 uppercase text-xs tracking-widest font-bold mb-6">
                  1. Objednatel
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Jméno / Název firmy"
                    className="w-full bg-[#05080f] border border-slate-700 p-4 rounded-2xl focus:border-amber-500 outline-none"
                    value={formData.clientName}
                    onChange={(e) => updateField('clientName', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="IČO"
                    className="w-full bg-[#05080f] border border-slate-700 p-4 rounded-2xl focus:border-amber-500 outline-none"
                    value={formData.clientRegNo}
                    onChange={(e) => updateField('clientRegNo', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Adresa / Sídlo"
                    className="w-full bg-[#05080f] border border-slate-700 p-4 rounded-2xl focus:border-amber-500 outline-none"
                    value={formData.clientAddress}
                    onChange={(e) => updateField('clientAddress', e.target.value)}
                  />
                </div>
              </section>

              <section className="bg-[#0c1426] border border-slate-800 rounded-3xl p-8">
                <h3 className="text-amber-400 uppercase text-xs tracking-widest font-bold mb-6">
                  2. Zhotovitel
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Jméno / Název firmy"
                    className="w-full bg-[#05080f] border border-slate-700 p-4 rounded-2xl focus:border-amber-500 outline-none"
                    value={formData.contractorName}
                    onChange={(e) => updateField('contractorName', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="IČO (povinné)"
                    className="w-full bg-[#05080f] border border-slate-700 p-4 rounded-2xl focus:border-amber-500 outline-none"
                    value={formData.contractorRegNo}
                    onChange={(e) => updateField('contractorRegNo', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Adresa / Místo podnikání"
                    className="w-full bg-[#05080f] border border-slate-700 p-4 rounded-2xl focus:border-amber-500 outline-none"
                    value={formData.contractorAddress}
                    onChange={(e) => updateField('contractorAddress', e.target.value)}
                  />
                </div>
              </section>
            </div>

            <section className="bg-[#0c1426] border border-slate-800 rounded-3xl p-8">
              <h3 className="text-amber-400 uppercase text-xs tracking-widest font-bold mb-6">
                3. Předmět díla
              </h3>
              <div className="space-y-5">
                <input
                  type="text"
                  placeholder="Název díla (např. Rekonstrukce kuchyně)"
                  className="w-full bg-[#05080f] border border-slate-700 p-4 rounded-2xl focus:border-amber-500 outline-none"
                  value={formData.workTitle}
                  onChange={(e) => updateField('workTitle', e.target.value)}
                />
                <textarea
                  placeholder="Detailní popis prací a rozsahu díla..."
                  className="w-full h-40 bg-[#05080f] border border-slate-700 p-4 rounded-2xl focus:border-amber-500 resize-y outline-none"
                  value={formData.workDescription}
                  onChange={(e) => updateField('workDescription', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Místo realizace"
                  className="w-full bg-[#05080f] border border-slate-700 p-4 rounded-2xl focus:border-amber-500 outline-none"
                  value={formData.workLocation}
                  onChange={(e) => updateField('workLocation', e.target.value)}
                />

                <div>
                  <label className="text-xs text-slate-400 block mb-2">Kdo dodává materiál?</label>
                  <div className="flex gap-3">
                    {(['contractor', 'client', 'both'] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField('materialBy', opt)}
                        className={`flex-1 py-3 rounded-2xl border transition-all ${
                          formData.materialBy === opt
                            ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                            : 'border-slate-700 text-slate-300'
                        }`}
                      >
                        {opt === 'contractor' && 'Zhotovitel'}
                        {opt === 'client' && 'Objednatel'}
                        {opt === 'both' && 'Obě strany'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[#0c1426] border border-slate-800 rounded-3xl p-8">
              <h3 className="text-amber-400 uppercase text-xs tracking-widest font-bold mb-6">
                4. Cena a platební podmínky
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-slate-400">Celková cena</label>
                  <div className="flex mt-2">
                    <input
                      type="number"
                      placeholder="0"
                      className="flex-1 bg-[#05080f] border border-slate-700 p-4 rounded-l-2xl focus:border-amber-500 outline-none"
                      value={formData.priceAmount}
                      onChange={(e) => updateField('priceAmount', e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-20 bg-[#05080f] border border-l-0 border-slate-700 p-4 rounded-r-2xl text-center outline-none"
                      value={formData.currency}
                      onChange={(e) => updateField('currency', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400">Způsob platby</label>
                  <select
                    value={formData.paymentType}
                    onChange={(e) => updateField('paymentType', e.target.value as PaymentType)}
                    className="w-full mt-2 bg-[#05080f] border border-slate-700 p-4 rounded-2xl focus:border-amber-500 outline-none"
                  >
                    <option value="after_completion">Jednorázově po dokončení</option>
                    <option value="with_deposit">Záloha + doplatek</option>
                    <option value="milestones">Průběžně po etapách</option>
                  </select>
                </div>

                {formData.paymentType === 'with_deposit' && (
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-400">Výše zálohy</label>
                    <input
                      type="number"
                      placeholder="Záloha"
                      className="w-full mt-2 bg-[#05080f] border border-amber-500/30 p-4 rounded-2xl outline-none"
                      value={formData.depositAmount}
                      onChange={(e) => updateField('depositAmount', e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs text-slate-400">Zahájení prací</label>
                  <input
                    type="date"
                    className="w-full mt-2 bg-[#05080f] border border-slate-700 p-4 rounded-2xl outline-none"
                    value={formData.startDate}
                    onChange={(e) => updateField('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Dokončení díla</label>
                  <input
                    type="date"
                    className="w-full mt-2 bg-[#05080f] border border-slate-700 p-4 rounded-2xl outline-none"
                    value={formData.endDate}
                    onChange={(e) => updateField('endDate', e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="bg-[#0c1426] border border-slate-800 rounded-3xl p-8">
              <h3 className="text-amber-400 uppercase text-xs tracking-widest font-bold mb-6">
                5. Záruka, sankce a další ujednání
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-slate-400">Záruka (měsíce)</label>
                  <input
                    type="number"
                    className="w-full mt-2 bg-[#05080f] border border-slate-700 p-4 rounded-2xl outline-none"
                    value={formData.warrantyMonths}
                    onChange={(e) => updateField('warrantyMonths', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Pokuta za prodlení (%/den)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full mt-2 bg-[#05080f] border border-slate-700 p-4 rounded-2xl outline-none"
                    value={formData.delayPenaltyPerDay}
                    onChange={(e) => updateField('delayPenaltyPerDay', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.insuranceRequired}
                    onChange={(e) => updateField('insuranceRequired', e.target.checked)}
                    className="accent-amber-500 w-5 h-5"
                  />
                  Zhotovitel je povinen mít pojištění odpovědnosti
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.handoverProtocol}
                    onChange={(e) => updateField('handoverProtocol', e.target.checked)}
                    className="accent-amber-500 w-5 h-5"
                  />
                  Předání díla proběhne protokolem
                </label>

                <div className="pt-4 border-t border-slate-800">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notaryUpsell}
                      onChange={(e) => updateField('notaryUpsell', e.target.checked)}
                      className="accent-amber-500 w-5 h-5"
                    />
                    <span className="font-bold text-white">Chci notářsky ověřené podpisy (+200 Kč)</span>
                  </label>
                </div>
              </div>
            </section>

            <motion.button
              whileHover={{ scale: isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: isProcessing ? 1 : 0.98 }}
              onClick={handleSubmit}
              disabled={isProcessing}
              className="w-full py-7 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-2xl rounded-3xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-60"
            >
              {isProcessing
                ? 'PŘESMĚROVÁNÍ NA PLATBU...'
                : formData.notaryUpsell
                  ? 'ZAPLATIT A VYGENEROVAT – 449 Kč'
                  : 'ZAPLATIT A VYGENEROVAT – 249 Kč'}
            </motion.button>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#0c1426] border border-slate-800 rounded-3xl p-8 sticky top-8 z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg uppercase tracking-tight">Risk Score</h3>
                <div
                  className={`px-6 py-2 rounded-2xl text-white font-black text-3xl shadow-lg transition-colors duration-500 ${scoreColor}`}
                >
                  {riskAnalysis.score}/100
                </div>
              </div>

              {riskAnalysis.warnings.length > 0 ? (
                <div className="space-y-3">
                  {riskAnalysis.warnings.map((w, i) => (
                    <div
                      key={i}
                      className="text-sm bg-rose-950/30 border border-rose-900/50 p-4 rounded-2xl text-rose-400 font-medium"
                    >
                      ⚠️ {w}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 p-6 rounded-2xl font-medium">
                  ✅ Výborně! Smlouva je velmi dobře nastavena a minimalizuje vaše právní rizika.
                </div>
              )}
            </div>

            <div className="lg:hidden">
              <button
                onClick={() => setShowMobilePreview(!showMobilePreview)}
                className="w-full py-4 bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 rounded-2xl font-bold uppercase tracking-widest text-xs transition-colors"
              >
                {showMobilePreview ? 'Skrýt náhled' : 'Zobrazit živý náhled smlouvy'}
              </button>
            </div>

            <div
              className={`${showMobilePreview ? 'block' : 'hidden'} lg:block bg-[#0c1426] border border-slate-800 rounded-3xl p-8`}
            >
              <h3 className="uppercase text-xs tracking-widest font-bold mb-6 text-amber-400">
                Živý náhled smlouvy
              </h3>
              <div className="bg-[#e2e8f0] text-slate-900 p-8 rounded-2xl text-[12px] leading-relaxed font-serif h-[600px] overflow-auto shadow-inner selection:bg-amber-500/30 whitespace-pre-wrap">
                {previewText}
              </div>
              <p className="text-xs text-slate-500 mt-4 text-center font-medium">
                Zjednodušený náhled. Plná verze bude vygenerována do PDF.
              </p>
              <p className="text-xs text-slate-500 mt-2 text-center font-medium">
                Citlivé údaje se neukládají do localStorage v prohlížeči.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}