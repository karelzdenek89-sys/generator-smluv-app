'use client';

import { useState, useMemo } from 'react';
import ContractPreview from '@/app/components/ContractPreview';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import { buildContractSections } from '@/lib/contracts';
import type { StoredContractData } from '@/lib/contracts';

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
  tier: 'basic' | 'professional' | 'complete';
  disputeResolution: 'court' | 'mediation' | 'arbitration';
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
  tier: 'basic' as const,
  disputeResolution: 'court' as const,
};

export default function WorkContractPage() {
  const [formData, setFormData] = useState<WorkContractData>(defaultData);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);

  const updateField = (field: keyof WorkContractData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const riskAnalysis = useMemo(() => {
    let score = 100;
    const warnings: { text: string; level: 'high' | 'medium' | 'low' }[] = [];

    if (!formData.clientName.trim() || !formData.contractorName.trim()) {
      score -= 20;
      warnings.push({ text: 'Doplňte jména smluvních stran.', level: 'high' });
    }

    if (!formData.contractorRegNo.trim()) {
      score -= 15;
      warnings.push({ text: 'Doplňte IČO zhotovitele – riziko sporu o identitu.', level: 'high' });
    }

    if (!formData.workDescription.trim() || formData.workDescription.trim().length < 30) {
      score -= 25;
      warnings.push({ text: 'Doplňte předmět díla – nedostatečně specifikován.', level: 'high' });
    }

    if (!formData.priceAmount) {
      score -= 20;
      warnings.push({ text: 'Doplňte cenu díla.', level: 'high' });
    }

    if (!formData.endDate) {
      score -= 15;
      warnings.push({ text: 'Doplňte termín dokončení díla.', level: 'high' });
    }

    if (formData.paymentType === 'with_deposit' && !formData.depositAmount) {
      score -= 10;
      warnings.push({ text: 'Doplňte výši zálohy.', level: 'medium' });
    }

    if (Number(formData.delayPenaltyPerDay) < 0.01) {
      score -= 8;
      warnings.push({ text: 'Nízká nebo žádná smluvní pokuta za prodlení.', level: 'medium' });
    }

    if (Number(formData.warrantyMonths) < 24) {
      score -= 5;
      warnings.push({ text: 'Záruka kratší než 24 měsíců – zvažte prodloužení.', level: 'medium' });
    }

    return { score: Math.max(0, score), warnings, label: score >= 85 ? 'Silná smlouva' : score >= 65 ? 'Průměrná ochrana' : 'Doporučená doplnění' };
  }, [formData]);

  const scoreColor =
    riskAnalysis.score >= 85
      ? 'text-emerald-400'
      : riskAnalysis.score >= 65
        ? 'text-amber-400'
        : 'text-rose-400';

  const previewSections = useMemo(() => {
    try {
      if (!formData.clientName) return [];
      return buildContractSections({ ...formData, contractType: 'work_contract' } as StoredContractData);
    } catch {
      return [];
    }
  }, [formData]);

  const handleSubmit = async () => {
    if (!formData.clientName || !formData.contractorName) { alert('Vyplňte prosím jména objednatel a zhotovitele.'); return; }
    if (!formData.priceAmount) { alert('Vyplňte prosím cenu díla.'); return; }
    if (!gdprConsent) { alert('Pro pokračování je nutný souhlas se zpracováním osobních údajů.'); return; }
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
    <main className="min-h-screen bg-[#05080f] text-slate-200 font-sans pb-24">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08101e]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-sm">SH</div>
            <div>
              <div className="font-bold tracking-tight text-white">SmlouvaHned Builder</div>
              <div className="text-[11px] text-slate-500">Smlouva o dílo — § 2586 OZ</div>
            </div>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-sm text-slate-400 hover:text-white transition">Zavřít</button>
        </div>
      </header>

      <ContractLandingSection
        badge="§ 2586 a násl. občanského zákoníku"
        h1Main="Smlouva o dílo"
        h1Accent="online"
        subtitle="Vytvořte smlouvu o dílo pro zhotovení konkrétního výsledku — stavební práce, řemeslné dílo, webová stránka nebo jiný hmotný či nehmotný výstup. Dokument pokrývá cenu, termín, předání a záruční podmínky."
        benefits={[
          { icon: '⚖️', text: 'Sestaveno dle § 2586–2650 OZ — smlouva o zhotovení díla' },
          { icon: '📄', text: 'PDF ke stažení ihned po ověřené platbě' },
          { icon: '🔨', text: 'Vhodné pro řemeslníky, stavitele, vývojáře i designéry' },
          { icon: '🔒', text: 'Jasně vymezená cena, termín dokončení a akceptační postup' },
        ]}
        contents={[
          'Identifikaci zhotovitele a objednatele',
          'Přesný popis díla a jeho výstupů',
          'Cenu díla a způsob platby (záloha, etapy, doplatek)',
          'Termín zahájení a dokončení díla',
          'Postup předání a akceptace díla',
          'Záruční podmínky a odpovědnost za vady',
          'Smluvní pokuty za prodlení',
          'Závěrečná ustanovení, GDPR a vyšší moc',
        ]}
        whenSuitable={[
          'Stavební a rekonstrukční práce (zhotovitel = řemeslník nebo firma)',
          'Vývoj webové stránky, aplikace nebo softwaru jako projekt',
          'Grafický design, ilustrace nebo jiný kreativní výstup s předáním',
          'Jakékoli jednorázové zhotovení díla za úplatu s jasně definovaným výsledkem',
        ]}
        whenOther={[
          { label: 'Smlouva o poskytování služeb', href: '/sluzby', text: 'Pro průběžné nebo opakované plnění bez jednorázového předání díla (měsíční správa, marketing).' },
          { label: 'Smlouva o spolupráci', href: '/spoluprace', text: 'Pro dlouhodobou obchodní spolupráci s podílem na výnosech nebo výsledcích.' },
        ]}
        faq={[
          { q: 'Jaký je rozdíl mezi smlouvou o dílo a smlouvou o službách?', a: 'Smlouva o dílo je zaměřena na konkrétní výsledek — dílo, které se zhotovuje, předává a akceptuje. Smlouva o poskytování služeb pokrývá průběžné plnění bez nutnosti konkrétního výsledku (IT správa, marketing).' },
          { q: 'Musí být cena díla pevná?', a: 'Zákon nevyžaduje pevnou cenu. Lze sjednat hodinovou sazbu, odhad nebo pevnou cenu. U pevné ceny (§ 2622 OZ) zhotovitel nese riziko vyšší ceny, u hodinové sazby objednatel.' },
          { q: 'Co je akceptační postup?', a: 'Formální předání díla a jeho přijetí objednatelem. Akceptace potvrzuje, že dílo splňuje smluvní podmínky a spouští záruční dobu. Bez formálního předání mohou být záruční a platební podmínky sporné.' },
          { q: 'Dostanu dokument ihned po zaplacení?', a: 'Ano, PDF je k dispozici ke stažení okamžitě po dokončení platby.' },
        ]}
        ctaLabel="Vytvořit smlouvu o dílo"
        formId="formular"
        guideHref="/smlouva-o-dilo-online"
        guideLabel="Průvodce smlouvou o dílo — kdy ji použít, cena díla, sankce a záruky"
      />

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">

            <div id="formular" className="space-y-8">
              <div className="mb-6 border-t border-slate-800/60 pt-8">
                <h2 className="text-lg font-black text-white uppercase tracking-wide">Vyplňte údaje dokumentu</h2>
                <p className="text-sm text-slate-500 mt-1">Všechna povinná pole jsou označena *</p>
              </div>

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

              {/* Řešení sporů */}
              <section className="bg-[#0c1426] border border-slate-800 rounded-3xl p-6">
                <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Řešení sporů</div>
                <select className="w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-500/60 transition" name="disputeResolution" value={formData.disputeResolution} onChange={(e) => setFormData(p => ({ ...p, disputeResolution: e.target.value as 'court' | 'mediation' | 'arbitration' }))}>
                  <option value="court">Obecný soud (výchozí)</option>
                  <option value="mediation">Mediace (zákon č. 202/2012 Sb.)</option>
                  <option value="arbitration">Rozhodčí řízení (Rozhodčí soud HK ČR)</option>
                </select>
              </section>

              {/* Tier selection */}
              <section className="bg-[#0c1426] border border-slate-800 rounded-3xl p-8">
                <h3 className="text-amber-400 uppercase text-xs tracking-widest font-bold mb-6">6. Výběr balíčku</h3>
                <div className="space-y-3">
                  {([
                    { value: 'basic', label: 'Základní dokument', price: '249 Kč', desc: 'Strukturovaná smlouva o dílo dle § 2586 OZ, výstup v PDF.' },
                    { value: 'professional', label: 'Rozšířený dokument', price: '399 Kč', desc: 'Rozšířené smluvní pokuty, záruční doložky, odpovědnost za vady.', recommended: true },
                    { value: 'complete', label: 'Kompletní balíček', price: '749 Kč', desc: 'Vše z Rozšířeného dokumentu + instrukce k podpisu, checklist a 30denní archivace.' },
                  ] as const).map((opt) => (
                    <label key={opt.value} className={`block rounded-2xl border-2 p-4 cursor-pointer transition relative ${formData.tier === opt.value ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700/60 bg-[#05080f]/60 hover:border-slate-600'}`}>
                      {('recommended' in opt) &&  formData.tier !== 'professional' && (
                        <div className="absolute -top-2.5 left-4"><span className="rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-black">Doporučeno</span></div>
                      )}
                      <div className="flex items-start gap-3">
                        <input type="radio" name="tier" value={opt.value} checked={formData.tier === opt.value}
                          onChange={(e) => setFormData((prev) => ({ ...prev, tier: e.target.value as 'basic' | 'professional' | 'complete', notaryUpsell: e.target.value !== 'basic' }))}
                          className="mt-1 h-5 w-5 accent-amber-500" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black uppercase tracking-wide text-amber-400">{opt.label}</span>
                            <span className="text-sm font-black text-white">{opt.price}</span>
                          </div>
                          <div className="mt-1 text-xs leading-relaxed text-slate-400">{opt.desc}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Watermarked document preview */}
            {previewSections.length > 0 && (
              <ContractPreview sections={previewSections} title="Smlouva o dílo" />
            )}

            {/* Risk analysis */}
            <div className="bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-4">Analýza smlouvy</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>
                  {riskAnalysis.score}
                </div>
                <div>
                  <div className={`font-bold ${scoreColor}`}>{riskAnalysis.score >= 85 ? 'Dobré nastavení' : riskAnalysis.score >= 65 ? 'Průměrná ochrana' : 'Doporučená doplnění'}</div>
                  <div className="text-xs text-slate-500">ze 100 bodů</div>
                </div>
              </div>
              {riskAnalysis.warnings.length === 0
                ? <p className="text-sm text-emerald-400">✓ Smlouva o dílo je v pořádku.</p>
                : <ul className="space-y-2">{riskAnalysis.warnings.map((w, i) => (
                    <li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-rose-500/10 text-rose-300' : 'bg-amber-500/10 text-amber-300'}`}>{w.level === 'high' ? '⚠ ' : '▲ '}{w.text}</li>
                  ))}</ul>
              }
            </div>

            {/* Payment card */}
            <div className="bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Shrnutí objednávky</div>
              <div className="space-y-2 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Smlouva o dílo</span>
                  <span className="font-bold text-white">249 Kč</span>
                </div>
                {formData.tier !== 'basic' && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">{formData.tier === 'complete' ? 'Kompletní balíček' : 'Rozšířený dokument'}</span>
                    <span className="font-bold text-amber-400">{formData.tier === 'complete' ? '+500 Kč' : '+200 Kč'}</span>
                  </div>
                )}
                <div className="border-t border-white/8 pt-2 flex justify-between font-black text-lg">
                  <span>Celkem</span>
                  <span className="text-white">{formData.tier === 'complete' ? '749' : formData.tier === 'professional' ? '399' : '249'} Kč</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Součástí výstupu je</div>
                <ul className="space-y-1.5">
                  {['Profesionálně strukturované PDF', 'Připraveno k okamžitému stažení', 'Přehledné uspořádání smluvních ustanovení'].map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="text-amber-500 mt-0.5">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* GDPR */}
              <label className="flex items-start gap-3 mb-5 cursor-pointer mt-4">
                <input type="checkbox" checked={gdprConsent} onChange={(e) => setGdprConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-amber-500 flex-shrink-0" />
                <span className="text-xs text-slate-400 leading-relaxed">
                  Souhlasím se{' '}
                  <a href="/gdpr" className="text-amber-400 underline hover:text-amber-300" target="_blank" rel="noopener noreferrer">zpracováním osobních údajů</a>
                  {' '}a{' '}
                  <a href="/obchodni-podminky" className="text-amber-400 underline hover:text-amber-300" target="_blank" rel="noopener noreferrer">obchodními podmínkami</a>.
                </span>
              </label>

              <button
                onClick={handleSubmit}
                disabled={isProcessing || !gdprConsent}
                className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.25)] active:scale-[0.98] uppercase tracking-tight disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                    Přesměrování…
                  </span>
                ) : (
                  `Zaplatit ${formData.tier === 'complete' ? '749 Kč' : formData.tier === 'professional' ? '399 Kč' : '249 Kč'} a stáhnout PDF →`
                )}
              </button>
              <p className="text-center text-xs text-slate-600 mt-3">🔒 Platba přes Stripe · PDF ke stažení ihned</p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
