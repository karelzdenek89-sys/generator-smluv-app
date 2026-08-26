'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { CheckoutAuthorization } from '@/lib/checkout-authorization';
import ContractPreview from '@/app/components/ContractPreview';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import BuilderCheckoutSummary from '@/app/components/BuilderCheckoutSummary';
import BuilderTierSelector from '@/app/components/BuilderTierSelector';
import { buildContractSections } from '@/lib/contracts';
import type { StoredContractData } from '@/lib/contracts';
import PaymentModal from '@/app/components/LazyPaymentModal';
import { isValidMoney } from '@/lib/money';
import {
  getThematicPackageConfig,
  isThematicPackageAvailable,
} from '@/lib/packages';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { getPackageUpsellCopy } from '@/lib/i18n/package-upsell';
import BuilderUserRoleField from '@/app/components/partners/BuilderUserRoleField';
import type { PartnerUserRole } from '@/lib/partners/types';

type PaymentType = 'after_completion' | 'with_deposit' | 'milestones';

type WorkContractData = {
  partnerUserRole: PartnerUserRole;
  clientName: string;
  clientAddress: string;
  clientRegNo: string;
  clientId?: string;
  clientEmail: string;

  contractorName: string;
  contractorAddress: string;
  contractorRegNo: string;
  contractorId?: string;
  contractorEmail: string;

  workTitle: string;
  workDescription: string;
  workLocation: string;
  technicalSpecs: string;
  milestones: string;
  materialBy: 'contractor' | 'client' | 'both';

  priceAmount: string;
  currency: string;
  vatIncluded: boolean;
  paymentType: PaymentType;
  depositAmount: string;
  depositDueDays: string;
  finalPaymentDays: string;
  invoiceDueDays: string;
  bankAccount: string;
  variableSymbol: string;

  startDate: string;
  endDate: string;

  warrantyMonths: string;
  delayPenaltyPerDay: string;
  defectPenaltyPercent: string;
  clientPenaltyPerDay: string;
  maxPenaltyPercent: string;

  insuranceRequired: boolean;
  insuranceLimit: string;
  handoverProtocol: boolean;
  withdrawalRight: boolean;
  ipAssignment: 'client' | 'contractor';
  notaryUpsell: boolean;
  tier: 'basic' | 'complete';
  disputeResolution: 'court' | 'mediation';
};

const defaultData: WorkContractData = {
  partnerUserRole: 'unknown',
  clientName: '',
  clientAddress: '',
  clientRegNo: '',
  clientEmail: '',
  contractorName: '',
  contractorAddress: '',
  contractorRegNo: '',
  contractorEmail: '',
  workTitle: '',
  workDescription: '',
  workLocation: '',
  technicalSpecs: '',
  milestones: '',
  materialBy: 'contractor',
  priceAmount: '',
  currency: 'Kč',
  vatIncluded: false,
  paymentType: 'after_completion',
  depositAmount: '',
  depositDueDays: '5',
  finalPaymentDays: '14',
  invoiceDueDays: '14',
  bankAccount: '',
  variableSymbol: '',
  startDate: '',
  endDate: '',
  warrantyMonths: '24',
  delayPenaltyPerDay: '0.05',
  defectPenaltyPercent: '10',
  clientPenaltyPerDay: '0.05',
  maxPenaltyPercent: '20',
  insuranceRequired: true,
  insuranceLimit: '',
  handoverProtocol: true,
  withdrawalRight: false,
  ipAssignment: 'client',
  notaryUpsell: false,
  tier: 'basic' as const,
  disputeResolution: 'court' as const,
};

export default function WorkContractPage() {
  const [formData, setFormData] = useState<WorkContractData>(defaultData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [packageKeyFromUrl, setPackageKeyFromUrl] = useState<string | null>(null);
  const updateField = (field: keyof WorkContractData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setPackageKeyFromUrl(new URLSearchParams(window.location.search).get('package'));
  }, []);

  // Balíček z URL smí projít jen tehdy, patří-li ke smlouvě o dílo a je-li
  // zapnutý. Server tutéž podmínku vynucuje znovu v /api/checkout — tohle je
  // pouze prezentační vrstva, nikoli autorita nad cenou.
  const packageConfig = useMemo(() => {
    const candidate = getThematicPackageConfig(packageKeyFromUrl);
    if (!candidate || candidate.contractType !== 'work_contract') return null;
    return isThematicPackageAvailable(candidate.key) ? candidate : null;
  }, [packageKeyFromUrl]);
  const isWorkOrderPackage = packageConfig?.key === 'work_order';
  // Zakázka Plus je česky-only produkt; builder nemá cizojazyčnou variantu,
  // takže se nabídka bere z české sady. Modul je jediným zdrojem znění.
  const workOrderUpsell = getPackageUpsellCopy('work_order', 'cs');

  useEffect(() => {
    if (!isWorkOrderPackage) return;
    setFormData((current) =>
      current.tier === 'complete' && current.notaryUpsell
        ? current
        : { ...current, tier: 'complete', notaryUpsell: true },
    );
  }, [isWorkOrderPackage]);

  const inputClass = 'w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition text-sm';
  const textareaClass = 'w-full min-h-[90px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition text-sm';
  const cardClass = 'bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]';

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
      return buildContractSections({
        ...formData,
        contractType: 'work_contract',
        packageKey: packageConfig?.key ?? null,
      } as StoredContractData);
    } catch {
      return [];
    }
  }, [formData, packageConfig?.key]);

  const handleSubmit = async (addOns: string[], authorization: CheckoutAuthorization) => {
    const missing: string[] = [];
    if (!formData.clientName?.trim()) missing.push('jméno objednatele');
    if (!formData.contractorName?.trim()) missing.push('jméno zhotovitele');
    if (!formData.workTitle?.trim()) missing.push('název díla');
    if (!formData.workDescription?.trim()) missing.push('popis díla');
    if (!isValidMoney(formData.priceAmount)) missing.push('cenu díla');
    if (missing.length > 0) { alert(`Smlouva o dílo vyžaduje: ${missing.join(', ')}.`); return; }
    try {
      setIsProcessing(true);

      const payload = {
        ...formData,
        contractType: 'work_contract' as const,
        packageKey: packageConfig?.key ?? null,
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType: 'work_contract',
          deliveryEmail: authorization.deliveryEmail,
          consent: authorization.consent,
          analyticsConsentGranted: authorization.analyticsConsentGranted,
          analyticsAttribution: authorization.analyticsAttribution,
          annexLanguage: authorization.annexLanguage,
          tier: packageConfig?.defaultTier ?? formData.tier,
          packageKey: packageConfig?.key ?? null,
          addOns,
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
  };

  return (
    <>
    <main className="min-h-screen bg-[#05080f] text-slate-200 font-sans pb-24">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08101e]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-sm">SH</div>
            <div>
              <div className="font-bold tracking-tight text-white">SmlouvaHned</div>
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

      {/* Balíček se ohlašuje až nad formulářem, aby hlavní CTA v hero sekci
          zůstalo na mobilu na stejném místě jako u samostatného dokumentu. */}
      {!packageConfig && isFeatureEnabled('zakazkaPlus') && workOrderUpsell && (
        <div className="max-w-7xl mx-auto px-4 pt-8 lg:px-8">
          <Link href="/balicek-zakazka" className="interactive-card block rounded-[1.75rem] border border-[rgba(197,160,89,0.18)] bg-[rgba(255,255,255,0.035)] p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-400">{workOrderUpsell.badge}</div>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold tracking-tight text-white">Řešíte celou zakázku?</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{workOrderUpsell.body}</p>
              </div>
              <span className="text-sm font-semibold text-amber-300">{workOrderUpsell.cta}</span>
            </div>
          </Link>
        </div>
      )}

      {packageConfig && (
        <div className="max-w-7xl mx-auto px-4 pt-8 lg:px-8">
          <div className="rounded-[1.75rem] border border-amber-500/25 bg-[rgba(255,255,255,0.04)] p-6">
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
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Cena balíčku</div>
                <div className="mt-2 text-3xl font-black tracking-tight text-white">{packageConfig.priceLabel}</div>
                <Link href="/smlouva-o-dilo" className="mt-3 inline-block text-xs leading-relaxed text-[#cbbba0] transition hover:text-white">
                  Potřebujete jen smlouvu o dílo? Zvolte samostatný dokument 99 / 199 Kč.
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">

            <div id="formular" className="space-y-8">
              <div className="mb-6 border-t border-slate-800/60 pt-8">
                <h2 className="text-lg font-black text-white uppercase tracking-wide">Vyplňte údaje dokumentu</h2>
                <p className="text-sm text-slate-500 mt-1">Všechna povinná pole jsou označena *</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <section className={cardClass}>
                  <h3 className="text-amber-400 uppercase text-xs tracking-widest font-bold mb-6">
                    1. Objednatel
                  </h3>
                  <div className="space-y-4">
                    <input
                    name="clientName"
                      type="text"
                      placeholder="Jméno / Název firmy"
                      aria-label="Jméno / Název firmy"
                      className={inputClass}
                      value={formData.clientName}
                      onChange={(e) => updateField('clientName', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="IČO"
                      aria-label="IČO"
                      className={inputClass}
                      value={formData.clientRegNo}
                      onChange={(e) => updateField('clientRegNo', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Adresa / Sídlo"
                      aria-label="Adresa / Sídlo"
                      className={inputClass}
                      value={formData.clientAddress}
                      onChange={(e) => updateField('clientAddress', e.target.value)}
                    />
                    <input
                      type="email"
                      placeholder="E-mail objednatele (volitelné)"
                      aria-label="E-mail objednatele"
                      className={inputClass}
                      value={formData.clientEmail}
                      onChange={(e) => updateField('clientEmail', e.target.value)}
                    />
                  </div>
                </section>

                <section className={cardClass}>
                  <h3 className="text-amber-400 uppercase text-xs tracking-widest font-bold mb-6">
                    2. Zhotovitel
                  </h3>
                  <div className="space-y-4">
                    <input
                    name="contractorName"
                      type="text"
                      placeholder="Jméno / Název firmy"
                      aria-label="Jméno / Název firmy"
                      className={inputClass}
                      value={formData.contractorName}
                      onChange={(e) => updateField('contractorName', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="IČO (povinné)"
                      aria-label="IČO (povinné)"
                      className={inputClass}
                      value={formData.contractorRegNo}
                      onChange={(e) => updateField('contractorRegNo', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Adresa / Místo podnikání"
                      aria-label="Adresa / Místo podnikání"
                      className={inputClass}
                      value={formData.contractorAddress}
                      onChange={(e) => updateField('contractorAddress', e.target.value)}
                    />
                    <input
                      type="email"
                      placeholder="E-mail zhotovitele (volitelné)"
                      aria-label="E-mail zhotovitele"
                      className={inputClass}
                      value={formData.contractorEmail}
                      onChange={(e) => updateField('contractorEmail', e.target.value)}
                    />
                  </div>
                </section>
              </div>
              <BuilderUserRoleField
                contractType="work_contract"
                locale="cs"
                value={formData.partnerUserRole}
                onChange={(partnerUserRole) => updateField('partnerUserRole', partnerUserRole)}
              />

              <section className={cardClass}>
                <h3 className="text-amber-400 uppercase text-xs tracking-widest font-bold mb-6">
                  3. Předmět díla
                </h3>
                <div className="space-y-5">
                  <input
                    name="workTitle"
                    type="text"
                    placeholder="Název díla (např. Rekonstrukce kuchyně)"
                    aria-label="Název díla (např. Rekonstrukce kuchyně)"
                    className={inputClass}
                    value={formData.workTitle}
                    onChange={(e) => updateField('workTitle', e.target.value)}
                  />
                  <textarea
                    name="workDescription"
                    placeholder="Detailní popis prací a rozsahu díla..."
                    aria-label="Detailní popis prací a rozsahu díla..."
                    className={textareaClass}
                    value={formData.workDescription}
                    onChange={(e) => updateField('workDescription', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Místo realizace"
                    aria-label="Místo realizace"
                    className={inputClass}
                    value={formData.workLocation}
                    onChange={(e) => updateField('workLocation', e.target.value)}
                  />

                  <textarea
                    placeholder="Technické specifikace / projektová dokumentace (volitelné)"
                    aria-label="Technické specifikace"
                    className={textareaClass}
                    value={formData.technicalSpecs}
                    onChange={(e) => updateField('technicalSpecs', e.target.value)}
                  />

                  <textarea
                    placeholder="Průběžné milníky (volitelné — např. 30 % dokončení střechy, 50 % rozvody…)"
                    aria-label="Průběžné milníky"
                    className={textareaClass}
                    value={formData.milestones}
                    onChange={(e) => updateField('milestones', e.target.value)}
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

              <section className={cardClass}>
                <h3 className="text-amber-400 uppercase text-xs tracking-widest font-bold mb-6">
                  4. Cena a platební podmínky
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-slate-400">Celková cena</label>
                    <div className="flex mt-2">
                      <input
                    name="priceAmount"
                        type="number"
                        placeholder="0"
                        aria-label="0"
                        className="flex-1 bg-[#111c31] border border-slate-700/80 text-white px-4 py-3 rounded-l-xl outline-none focus:border-amber-500/60 transition text-sm"
                        value={formData.priceAmount}
                        onChange={(e) => updateField('priceAmount', e.target.value)}
                      />
                      <input
                        type="text"
                        aria-label="Měna"
                        className="w-20 bg-[#111c31] border border-l-0 border-slate-700/80 text-white px-4 py-3 rounded-r-xl text-center outline-none text-sm"
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
                      aria-label="Způsob platby"
                      className={`${inputClass} mt-2`}
                    >
                      <option value="after_completion">Jednorázově po dokončení</option>
                      <option value="with_deposit">Záloha + doplatek</option>
                      <option value="milestones">Průběžně po etapách</option>
                    </select>
                  </div>

                  {formData.paymentType === 'with_deposit' && (
                    <>
                      <div>
                        <label className="text-xs text-slate-400">Výše zálohy</label>
                        <input
                          type="number"
                          placeholder="Záloha"
                          aria-label="Záloha"
                          className={`${inputClass} mt-2`}
                          value={formData.depositAmount}
                          onChange={(e) => updateField('depositAmount', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400">Splatnost zálohy (prac. dnů)</label>
                        <input
                          type="number"
                          aria-label="Splatnost zálohy"
                          className={`${inputClass} mt-2`}
                          value={formData.depositDueDays}
                          onChange={(e) => updateField('depositDueDays', e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-xs text-slate-400">Splatnost doplatku (dnů)</label>
                    <input
                      type="number"
                      aria-label="Splatnost doplatku"
                      className={`${inputClass} mt-2`}
                      value={formData.finalPaymentDays}
                      onChange={(e) => updateField('finalPaymentDays', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Splatnost faktur (dnů)</label>
                    <input
                      type="number"
                      aria-label="Splatnost faktur"
                      className={`${inputClass} mt-2`}
                      value={formData.invoiceDueDays}
                      onChange={(e) => updateField('invoiceDueDays', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Bankovní účet zhotovitele</label>
                    <input
                      type="text"
                      aria-label="Bankovní účet"
                      placeholder="123456789/0100"
                      className={`${inputClass} mt-2`}
                      value={formData.bankAccount}
                      onChange={(e) => updateField('bankAccount', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Variabilní symbol</label>
                    <input
                      type="text"
                      aria-label="Variabilní symbol"
                      className={`${inputClass} mt-2`}
                      value={formData.variableSymbol}
                      onChange={(e) => updateField('variableSymbol', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.vatIncluded}
                        onChange={(e) => updateField('vatIncluded', e.target.checked)}
                        className="h-4 w-4 accent-amber-500"
                      />
                      <span>Cena včetně DPH (jinak bez DPH)</span>
                    </label>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400">Zahájení prací</label>
                    <input
                      aria-label="Zahájení prací"
                      type="date"
                      className={`${inputClass} mt-2`}
                      value={formData.startDate}
                      onChange={(e) => updateField('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Dokončení díla</label>
                    <input
                      aria-label="Dokončení díla"
                      type="date"
                      className={`${inputClass} mt-2`}
                      value={formData.endDate}
                      onChange={(e) => updateField('endDate', e.target.value)}
                    />
                  </div>
                </div>
              </section>

              <section className={cardClass}>
                <h3 className="text-amber-400 uppercase text-xs tracking-widest font-bold mb-6">
                  5. Záruka, sankce a další ujednání
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-slate-400">Záruka (měsíce)</label>
                    <input
                      aria-label="Záruka (měsíce)"
                      type="number"
                      className={`${inputClass} mt-2`}
                      value={formData.warrantyMonths}
                      onChange={(e) => updateField('warrantyMonths', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Pokuta za prodlení zhotovitele (%/den)</label>
                    <input
                      aria-label="Pokuta za prodlení zhotovitele"
                      type="number"
                      step="0.01"
                      className={`${inputClass} mt-2`}
                      value={formData.delayPenaltyPerDay}
                      onChange={(e) => updateField('delayPenaltyPerDay', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Pokuta za prodlení objednatele (%/den)</label>
                    <input
                      aria-label="Pokuta za prodlení objednatele"
                      type="number"
                      step="0.01"
                      className={`${inputClass} mt-2`}
                      value={formData.clientPenaltyPerDay}
                      onChange={(e) => updateField('clientPenaltyPerDay', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Pokuta za vady (% z ceny)</label>
                    <input
                      aria-label="Pokuta za vady"
                      type="number"
                      className={`${inputClass} mt-2`}
                      value={formData.defectPenaltyPercent}
                      onChange={(e) => updateField('defectPenaltyPercent', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Strop pokut celkem (% z ceny)</label>
                    <input
                      aria-label="Strop pokut"
                      type="number"
                      className={`${inputClass} mt-2`}
                      value={formData.maxPenaltyPercent}
                      onChange={(e) => updateField('maxPenaltyPercent', e.target.value)}
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
                  {formData.insuranceRequired && (
                    <div className="ml-7">
                      <label className="text-xs text-slate-400">Min. limit pojištění (Kč)</label>
                      <input
                        aria-label="Limit pojištění"
                        type="number"
                        placeholder="2 000 000"
                        className={`${inputClass} mt-2`}
                        value={formData.insuranceLimit}
                        onChange={(e) => updateField('insuranceLimit', e.target.value)}
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.handoverProtocol}
                      onChange={(e) => updateField('handoverProtocol', e.target.checked)}
                      className="accent-amber-500 w-5 h-5"
                    />
                    Předání díla proběhne protokolem
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.withdrawalRight}
                      onChange={(e) => updateField('withdrawalRight', e.target.checked)}
                      className="accent-amber-500 w-5 h-5"
                    />
                    Sjednat výslovné právo odstoupení od smlouvy
                  </label>

                  <div>
                    <label className="text-xs text-slate-400 block mb-2">Vlastnictví výstupů</label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {(['client', 'contractor'] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateField('ipAssignment', opt)}
                          className={`rounded-xl border px-4 py-3 text-sm text-left transition ${
                            formData.ipAssignment === opt
                              ? 'border-amber-500/70 bg-amber-500/10 text-white'
                              : 'border-slate-700/80 bg-[#111c31] text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          {opt === 'client' ? 'Objednatel (dílo patří klientovi)' : 'Zhotovitel (licence klientovi)'}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </section>

              {/* Řešení sporů */}
              <section className={cardClass}>
                <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Řešení sporů</div>
                <select aria-label="Obecný soud (výchozí)" className={inputClass} name="disputeResolution" value={formData.disputeResolution} onChange={(e) => setFormData(p => ({ ...p, disputeResolution: e.target.value as 'court' | 'mediation' }))}>
                  <option value="court">Obecný soud (výchozí)</option>
                  <option value="mediation">Mediace (zákon č. 202/2012 Sb.)</option>
                </select>
              </section>

              {/* Tier selection — u balíčku je rozsah dán, výběr varianty se nezobrazuje */}
              {!packageConfig && (
                <section className={cardClass}>
                  <h3 className="text-amber-400 uppercase text-xs tracking-widest font-bold mb-6">6. Vyberte úroveň zpracování dokumentu</h3>
                  <BuilderTierSelector
                    contractType="work_contract"
                    tier={formData.tier}
                    onTierChange={(tier) =>
                      setFormData((prev) => ({ ...prev, tier, notaryUpsell: tier !== 'basic' }))
                    }
                  />
                </section>
              )}

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
              <BuilderCheckoutSummary
                contractType="work_contract"
                tier={formData.tier}
                packageKey={packageConfig?.key ?? null}
                documentLabel="Smlouva o dílo"
                onUpgrade={() => setFormData((prev) => ({ ...prev, tier: 'complete', notaryUpsell: true }))}
              />

              {/* GDPR */}
                              {/* Tlačítko generování */}
                <button
                  data-builder-generate=""
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
    </main>
    {showPreviewModal && (
      <PaymentModal
        sections={previewSections}
        title="Smlouva o dílo"
        tier={formData.tier}
        onTierChange={(t) => setFormData((prev) => ({ ...prev, tier: t }))}
        contractType="work_contract"
        packageKey={packageConfig?.key ?? null}
        onPay={handleSubmit}
        isProcessing={isProcessing}
        onClose={() => setShowPreviewModal(false)}
      />
    )}
    </>
  );
}



