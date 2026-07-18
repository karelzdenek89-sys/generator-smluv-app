'use client';

import { useMemo, useState } from 'react';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import ContractPreview from '@/app/components/ContractPreview';
import BuilderCheckoutSummary from '@/app/components/BuilderCheckoutSummary';
import BuilderTierSelector from '@/app/components/BuilderTierSelector';
import type { StoredContractData } from '@/lib/contracts';
import { getPoaFormUi } from '@/lib/i18n/expat-builder-forms';
import { poaRiskWarnings, poaValidationFields } from '@/lib/i18n/expat-builder-risk';
import {
  buildExpatPreviewSections,
  getExpatPreviewLabels,
} from '@/lib/i18n/expat-contract-preview';
import PaymentModal from '@/app/components/PaymentModal';
import { BuilderLocaleNotice, useBuilderLocale } from '@/app/components/BuilderLocaleNotice';

type FormData = {
  principalName: string; principalId: string; principalAddress: string; principalEmail: string;
  agentName: string; agentId: string; agentAddress: string; agentEmail: string;
  poaType: 'general' | 'property' | 'court' | 'company' | 'bank';
  propertyAddress: string; courtName: string; caseNumber: string;
  companyName: string; companyIco: string; companyScope: string; bankAccount: string; bankName: string;
  customScope: string;
  validUntil: string; singleUse: boolean; allowSubstitution: boolean;
  agentPenalty: string;
  contractDate: string; notaryUpsell: boolean;
  tier: 'basic' | 'complete';
};

const inputClass = 'site-input';
const cardClass = 'builder-card p-6';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><label className="site-form-label">{label}</label>{children}</div>);
}
function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (<div className="mb-6"><div className="builder-kicker">{index}. {title}</div>{subtitle && <p className="builder-help mt-2 text-sm">{subtitle}</p>}</div>);
}

export default function PlnaMocPage() {
  const builderLocale = useBuilderLocale();
  const ui = useMemo(() => getPoaFormUi(builderLocale), [builderLocale]);
  const fl = (k: string, cs: string) => ui.fields[k] ?? cs;
  const sec = (k: string, title: string, subtitle?: string) => {
    const s = ui.sections[k];
    return { title: s?.title ?? title, subtitle: s?.subtitle ?? subtitle };
  };
  const previewLabels = useMemo(() => getExpatPreviewLabels(builderLocale), [builderLocale]);
  const [form, setForm] = useState<FormData>({
    principalName: '', principalId: '', principalAddress: '', principalEmail: '',
    agentName: '', agentId: '', agentAddress: '', agentEmail: '',
    poaType: 'general',
    propertyAddress: '', courtName: '', caseNumber: '',
    companyName: '', companyIco: '', companyScope: '', bankAccount: '', bankName: '',
    customScope: '',
    validUntil: '', singleUse: false, allowSubstitution: false,
    agentPenalty: '',
    contractDate: '', notaryUpsell: false,
    tier: 'basic' as const,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const validationFields = useMemo(() => poaValidationFields(builderLocale), [builderLocale]);

  const risk = useMemo(() => {
    const warnings = poaRiskWarnings(builderLocale, {
      ...form,
      needsNotarized:
        form.notaryUpsell === false &&
        (form.poaType === 'property' || form.poaType === 'company'),
    });
    const penalty = warnings.reduce(
      (sum, w) => sum + (w.level === 'high' ? 20 : w.level === 'medium' ? 10 : 5),
      0,
    );
    const score = Math.max(0, 100 - penalty);
    return {
      score,
      warnings,
      label:
        score >= 85 ? ui.risk.good : score >= 65 ? ui.risk.average : ui.risk.needsWork,
    };
  }, [form, builderLocale, ui.risk]);

  const previewSections = useMemo(() => {
    try {
      if (!form.principalName) return [];
      return buildExpatPreviewSections('power_of_attorney', builderLocale, {
        ...form,
        contractType: 'power_of_attorney',
      } as StoredContractData);
    } catch {
      return [];
    }
  }, [form, builderLocale]);

  const handlePayment = async (addOns: string[] = []) => {
    const missing: string[] = [];
    if (!form.principalName?.trim()) missing.push(validationFields.principalName);
    if (!form.agentName?.trim()) missing.push(validationFields.agentName);
    if (form.poaType === 'general' && !form.customScope?.trim()) missing.push(validationFields.customScope);
    if (missing.length > 0) {
      alert(`${ui.form.validationPrefix} ${missing.join(', ')}.`);
      return;
    }
    try {
      setIsProcessing(true);
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: 'power_of_attorney', tier: form.tier, addOns, notaryUpsell: form.tier !== 'basic', lang: builderLocale, payload: { ...form, contractType: 'power_of_attorney', lang: builderLocale }, email: form.principalEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error();
      window.location.href = data.url;
    } catch {
      alert(ui.form.paymentError);
      setIsProcessing(false);
    }
  };

  const scoreColor = risk.score >= 85 ? 'text-emerald-400' : risk.score >= 65 ? 'text-amber-400' : 'text-rose-400';

  const poaTypeLabels: Record<string, string> = {
    general: fl('poaType_general', 'Obecná plná moc'),
    property: fl('poaType_property', 'Nemovitost'),
    court: fl('poaType_court', 'Soud / spor'),
    company: fl('poaType_company', 'Jednání za firmu'),
    bank: fl('poaType_bank', 'Bankovní záležitosti'),
  };

  const landingProps = {
    badge: ui.landing.badge,
    h1Main: ui.landing.h1Main,
    h1Accent: ui.landing.h1Accent,
    subtitle: ui.landing.subtitle,
    benefits: ui.landing.benefits,
    contents: ui.landing.contents,
    whenSuitable: ui.landing.whenSuitable,
    whenOther: ui.landing.whenOther,
    faq: ui.landing.faq,
    ctaLabel: ui.landing.ctaLabel,
    formId: 'formular',
    guideHref: ui.landing.guideHref,
    guideLabel: ui.landing.guideLabel,
  };

  return (
    <>
    <BuilderLocaleNotice contractType="power_of_attorney" />
    <main className="site-page contract-builder font-sans pb-24">
      <header className="contract-builder-header">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-sm">SH</div>
            <div><div className="font-bold tracking-tight text-white">{ui.header.brand}</div><div className="text-[11px] text-slate-500">{ui.header.docType}</div></div>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-sm text-slate-400 hover:text-white transition">{ui.header.close}</button>
        </div>
      </header>

      <ContractLandingSection {...landingProps} />

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8" id="formular">
        <div className="mb-6 border-t border-slate-800/60 pt-8">
          <h2 className="text-lg font-black text-white uppercase tracking-wide">{ui.form.title}</h2>
          <p className="text-sm text-slate-500 mt-1">{ui.form.requiredHint}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">

            <section className={cardClass}>
              <SectionTitle index="01" title={sec('s01', 'Typ plné moci').title} subtitle={sec('s01', 'Typ plné moci', 'Vyberte typ — podle toho se přizpůsobí text zmocnění.').subtitle} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(poaTypeLabels).map(([key, label]) => (
                  <label key={key} className={`cursor-pointer rounded-xl border p-3 text-center text-sm transition ${form.poaType === key ? 'border-amber-500 bg-amber-500/10 text-white font-bold' : 'border-slate-700/60 text-slate-400 hover:border-slate-500'}`}>
                    <input type="radio" name="poaType" value={key} checked={form.poaType === key} onChange={set} className="hidden" />
                    {label}
                  </label>
                ))}
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="02" title={sec('s02', 'Zmocnitel').title} subtitle={sec('s02', 'Zmocnitel', 'Osoba udělující plnou moc (oprávňující zmocněnce jednat).').subtitle} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={fl('principalName', 'Jméno / název *')}><input className={inputClass} name="principalName" value={form.principalName} onChange={set} placeholder="Jan Novák" /></Field>
                <Field label={fl('principalId', 'Datum nar. / IČO *')}><input className={inputClass} name="principalId" value={form.principalId} onChange={set} placeholder="01.01.1970" /></Field>
                <Field label={fl('principalAddress', 'Trvalé bydliště / sídlo *')}><input className={inputClass} name="principalAddress" value={form.principalAddress} onChange={set} placeholder="Ulice 1, Praha 1" /></Field>
                <Field label={fl('principalEmail', 'E-mail')}><input className={inputClass} name="principalEmail" value={form.principalEmail} onChange={set} type="email" placeholder="jan@email.cz" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="03" title={sec('s03', 'Zmocněnec').title} subtitle={sec('s03', 'Zmocněnec', 'Osoba, která bude jednat za zmocnitele.').subtitle} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={fl('agentName', 'Jméno / název *')}><input className={inputClass} name="agentName" value={form.agentName} onChange={set} placeholder="Marie Nováková" /></Field>
                <Field label={fl('agentId', 'Datum nar. / IČO *')}><input className={inputClass} name="agentId" value={form.agentId} onChange={set} placeholder="05.05.1980" /></Field>
                <Field label={fl('agentAddress', 'Trvalé bydliště / sídlo *')}><input className={inputClass} name="agentAddress" value={form.agentAddress} onChange={set} placeholder="Ulice 5, Brno" /></Field>
                <Field label={fl('agentEmail', 'E-mail')}><input className={inputClass} name="agentEmail" value={form.agentEmail} onChange={set} type="email" placeholder="marie@email.cz" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="04" title={sec('s04', 'Rozsah zmocnění').title} />
              <div className="space-y-4">
                {form.poaType === 'property' && <Field label={fl('propertyAddress', 'Adresa / specifikace nemovitosti *')}><input className={inputClass} name="propertyAddress" value={form.propertyAddress} onChange={set} placeholder={fl('propertyAddress_placeholder', 'Ulice 10, Praha 6, LV č. 123, KÚ Dejvice')} /></Field>}
                {form.poaType === 'court' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label={fl('courtName', 'Název soudu')}><input className={inputClass} name="courtName" value={form.courtName} onChange={set} placeholder={fl('courtName_placeholder', 'Obvodní soud pro Prahu 1')} /></Field>
                    <Field label={fl('caseNumber', 'Sp. zn. / č.j.')}><input className={inputClass} name="caseNumber" value={form.caseNumber} onChange={set} placeholder="10 C 123/2026" /></Field>
                  </div>
                )}
                {form.poaType === 'company' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label={fl('companyName', 'Název firmy')}><input className={inputClass} name="companyName" value={form.companyName} onChange={set} placeholder="ABC s.r.o." /></Field>
                    <Field label={fl('companyIco', 'IČO firmy')}><input className={inputClass} name="companyIco" value={form.companyIco} onChange={set} placeholder="12345678" /></Field>
                    <div className="sm:col-span-2"><Field label={fl('companyScope', 'Rozsah jednání')}><input className={inputClass} name="companyScope" value={form.companyScope} onChange={set} placeholder={fl('companyScope_placeholder', 'Valná hromada, podepisování smluv, jednání s úřady…')} /></Field></div>
                  </div>
                )}
                {form.poaType === 'bank' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label={fl('bankAccount', 'Číslo účtu')}><input className={inputClass} name="bankAccount" value={form.bankAccount} onChange={set} placeholder="123456789/0800" /></Field>
                    <Field label={fl('bankName', 'Banka')}><input className={inputClass} name="bankName" value={form.bankName} onChange={set} placeholder={fl('bankName_placeholder', 'Česká spořitelna')} /></Field>
                  </div>
                )}
                {form.poaType === 'general' && (
                  <Field label={fl('scopeDescription', 'Rozsah zmocnění (popište) *')}>
                    <textarea className="w-full min-h-[100px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="customScope" value={form.customScope} onChange={set} placeholder={fl('scopeDescription_placeholder', 'Zastupování při přebírání zásilek, podpis smluv týkajících se…')} />
                  </Field>
                )}
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="05" title={sec('s05', 'Platnost a podmínky').title} />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label={fl('validUntil', 'Platná do (prázdné = do odvolání)')}><input className={inputClass} name="validUntil" value={form.validUntil} onChange={set} type="date" /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className={`cursor-pointer rounded-xl border p-3 text-sm transition ${form.singleUse ? 'border-amber-500/60 bg-amber-500/8 text-white' : 'border-slate-700/60 text-slate-400 hover:border-slate-500'}`}>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="singleUse" checked={form.singleUse} onChange={set} className="h-4 w-4 accent-amber-500" />
                    <div>
                      <div className="font-semibold text-white">{fl('singleUse', 'Jednorázová plná moc')}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{fl('singleUseHint', 'Platí jen pro jedno konkrétní jednání')}</div>
                    </div>
                  </div>
                </label>
                <label className={`cursor-pointer rounded-xl border p-3 text-sm transition ${form.allowSubstitution ? 'border-amber-500/60 bg-amber-500/8 text-white' : 'border-slate-700/60 text-slate-400 hover:border-slate-500'}`}>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="allowSubstitution" checked={form.allowSubstitution} onChange={set} className="h-4 w-4 accent-amber-500" />
                    <div>
                      <div className="font-semibold text-white">{fl('allowSubstitution', 'Substituce povolena')}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{fl('allowSubstitutionHint', 'Zmocněnec smí pověřit třetí osobu')}</div>
                    </div>
                  </div>
                </label>
              </div>
              {form.tier === 'complete' && (
                <div className="mt-4 pt-4 border-t border-slate-800/60">
                  <Field label={fl('breachPenalty', 'Smluvní pokuta při překročení zmocnění (Kč, volitelné)')}>
                    <input className={inputClass} name="agentPenalty" type="number" value={form.agentPenalty} onChange={set} placeholder="50 000" />
                  </Field>
                </div>
              )}
            </section>

            <section className={cardClass}>
              <SectionTitle index="06" title={sec('s06', 'Vyberte úroveň zpracování dokumentu').title} subtitle={sec('s06', 'Vyberte úroveň zpracování dokumentu', 'Zvolte variantu, která odpovídá vaší situaci a požadovanému rozsahu dokumentu.').subtitle} />
              <BuilderTierSelector
                contractType="power_of_attorney"
                locale={builderLocale}
                tier={form.tier}
                onTierChange={(tier) =>
                  setForm((prev) => ({ ...prev, tier, notaryUpsell: tier !== 'basic' }))
                }
              />
            </section>

          </div>

          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Watermarked document preview */}
            {previewSections.length > 0 && (
              <ContractPreview sections={previewSections} title={ui.form.documentLabel} labels={previewLabels} />
            )}
            <div className={cardClass}>
              <div className="builder-kicker mb-4">{ui.form.analysisTitle}</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div><div className={`font-bold ${scoreColor}`}>{risk.label}</div><div className="text-xs text-slate-500">{ui.form.scoreOf}</div></div>
              </div>
              {risk.warnings.length === 0 ? <p className="text-sm text-emerald-400">✓ {fl('completeMessage', 'Plná moc obsahuje všechny požadované vstupní údaje.')}</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (<li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-amber-500/10 text-amber-300' : w.level === 'medium' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-700/40 text-slate-400'}`}>{w.level === 'high' ? '⚠ ' : w.level === 'medium' ? '▲ ' : '○ '}{w.text}</li>))}</ul>}
            </div>
            <div className={cardClass}>
              <BuilderCheckoutSummary
                contractType="power_of_attorney"
                locale={builderLocale}
                tier={form.tier}
                documentLabel={ui.form.documentLabel}
                onUpgrade={() => setForm((prev) => ({ ...prev, tier: 'complete', notaryUpsell: true }))}
              />
              {(!form.principalName || !form.agentName) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3 text-xs text-slate-400 space-y-1">
                  <div className="font-semibold mb-1">{fl('fillBeforePayment', 'Před platbou vyplňte:')}</div>
                  {!form.principalName && <div>• {fl('principalMissing', 'Jméno zmocnitele')}</div>}
                  {!form.agentName && <div>• {fl('agentMissing', 'Jméno zmocněnce')}</div>}
                </div>
              )}
                              {/* Tlačítko generování */}
                <button
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
    </main>
    {showPreviewModal && (
      <PaymentModal
        sections={previewSections}
        title={ui.form.documentLabel}
        tier={form.tier}
        onTierChange={(t) => setForm((prev) => ({ ...prev, tier: t }))}
        contractType="power_of_attorney"
        lang={builderLocale}
        onPay={handlePayment}
        isProcessing={isProcessing}
        onClose={() => setShowPreviewModal(false)}
      />
    )}
    </>
  );
}


