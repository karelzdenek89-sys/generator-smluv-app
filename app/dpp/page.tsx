'use client';

import { useMemo, useState } from 'react';
import ContractPreview from '@/app/components/ContractPreview';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import BuilderCheckoutSummary from '@/app/components/BuilderCheckoutSummary';
import BuilderTierSelector from '@/app/components/BuilderTierSelector';
import { getDppFormUi } from '@/lib/i18n/expat-builder-forms';
import { dppRiskWarnings, dppValidationFields } from '@/lib/i18n/expat-builder-risk';
import {
  buildExpatPreviewSections,
} from '@/lib/i18n/expat-contract-preview';
import type { StoredContractData } from '@/lib/contracts';
import PaymentModal from '@/app/components/PaymentModal';
import { BuilderLocaleNotice, useBuilderLocale } from '@/app/components/BuilderLocaleNotice';

type FormData = {
  employerName: string; employerIco: string; employerAddress: string; employerEmail: string;
  employeeName: string; employeeBirth: string; employeeAddress: string; employeeEmail: string;
  taskDescription: string; taskDetails: string; workPlace: string; estimatedHours: string;
  durationType: 'fixed' | 'indefinite'; startDate: string; endDate: string; deadline: string;
  remunerationType: 'fixed' | 'hourly'; totalRemuneration: string; hourlyRate: string;
  paymentAccount: string; paymentDays: string;
  contractDate: string;
  notaryUpsell: boolean;
  tier: 'basic' | 'complete';
};

const inputClass = 'site-input';
const cardClass = 'builder-card p-6';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="site-form-label">{label}</label>
      {children}
    </div>
  );
}

function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="builder-kicker">{index}. {title}</div>
      {subtitle && <p className="builder-help mt-2 text-sm">{subtitle}</p>}
    </div>
  );
}

export default function DppPage() {
  const builderLocale = useBuilderLocale();
  const ui = useMemo(() => getDppFormUi(builderLocale), [builderLocale]);
  const [form, setForm] = useState<FormData>({
    employerName: '', employerIco: '', employerAddress: '', employerEmail: '',
    employeeName: '', employeeBirth: '', employeeAddress: '', employeeEmail: '',
    taskDescription: '', taskDetails: '', workPlace: '', estimatedHours: '',
    durationType: 'fixed', startDate: '', endDate: '', deadline: '',
    remunerationType: 'fixed', totalRemuneration: '', hourlyRate: '',
    paymentAccount: '', paymentDays: '15',
    contractDate: '', notaryUpsell: false,
    tier: 'basic' as const,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const validationFields = useMemo(() => dppValidationFields(builderLocale), [builderLocale]);

  const risk = useMemo(() => {
    const warnings = dppRiskWarnings(builderLocale, form);
    const penalty = warnings.reduce(
      (sum, w) => sum + (w.level === 'high' ? 20 : w.level === 'medium' ? 12 : 5),
      0,
    );
    const score = Math.max(0, 100 - penalty);
    return {
      score,
      warnings,
      label: score >= 85 ? ui.risk.good : score >= 65 ? ui.risk.average : ui.risk.needsWork,
    };
  }, [form, builderLocale, ui.risk]);

  const previewSections = useMemo(() => {
    try {
      if (!form.employerName) return [];
      return buildExpatPreviewSections('dpp', builderLocale, { ...form, contractType: 'dpp' } as StoredContractData);
    } catch {
      return [];
    }
  }, [form, builderLocale]);

  const handlePayment = async () => {
    // Validace ? 75 ZP ? DPP mus? m?t druh pr?ce, m?sto, dobu a odm?nu.
    const missing: string[] = [];
    if (!form.employerName?.trim()) missing.push(validationFields.employerName);
    if (!form.employeeName?.trim()) missing.push(validationFields.employeeName);
    if (!form.taskDescription?.trim()) missing.push(validationFields.taskDescription);
    if (!form.workPlace?.trim()) missing.push(builderLocale === 'cs' ? 'm?sto v?konu pr?ce' : builderLocale === 'en' ? 'place of work' : '????? ?????????');
    if (!form.hourlyRate && !form.totalRemuneration) {
      missing.push(builderLocale === 'cs' ? 'v??i odm?ny' : builderLocale === 'en' ? 'remuneration' : '??????????');
    }
    if (missing.length > 0) {
      alert(`${ui.form.validationPrefix} ${missing.join(', ')}.`);
      return;
    }
    try {
      setIsProcessing(true);
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: 'dpp', tier: form.tier, notaryUpsell: form.tier !== 'basic', lang: builderLocale, payload: { ...form, contractType: 'dpp', lang: builderLocale }, email: form.employerEmail }),
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

  return (
    <>
    <BuilderLocaleNotice contractType="dpp" />
    <main className="site-page contract-builder min-h-screen pb-24">
      <header className="contract-builder-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-sm">SH</div>
            <div>
              <div className="font-bold tracking-tight text-white">{ui.header.brand}</div>
              <div className="text-[11px] text-slate-500">{ui.header.docType}</div>
            </div>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-sm text-slate-400 hover:text-white transition">{ui.header.close}</button>
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

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">

            <div id="formular" className="space-y-6">
              <div className="mb-6 border-t border-slate-800/60 pt-8">
                <h2 className="text-lg font-black text-white uppercase tracking-wide">{ui.form.title}</h2>
                <p className="text-sm text-slate-500 mt-1">{ui.form.requiredHint}</p>
              </div>

              <section className={cardClass}>
                <SectionTitle index="01" title={ui.sections.employer.title} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={ui.fields.employerName}><input className={inputClass} name="employerName" value={form.employerName} onChange={set} placeholder={ui.page.placeholders.employerName} /></Field>
                  <Field label={ui.fields.employerIco}><input className={inputClass} name="employerIco" value={form.employerIco} onChange={set} placeholder={ui.page.placeholders.employerIco} /></Field>
                  <Field label={ui.fields.employerAddress}><input className={inputClass} name="employerAddress" value={form.employerAddress} onChange={set} placeholder={ui.page.placeholders.employerAddress} /></Field>
                  <Field label={ui.fields.employerEmail}><input className={inputClass} name="employerEmail" value={form.employerEmail} onChange={set} type="email" placeholder={ui.page.placeholders.employerEmail} /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="02" title={ui.sections.employee.title} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={ui.fields.employeeName}><input className={inputClass} name="employeeName" value={form.employeeName} onChange={set} placeholder={ui.page.placeholders.employeeName} /></Field>
                  <Field label={ui.fields.employeeBirth}><input className={inputClass} name="employeeBirth" value={form.employeeBirth} onChange={set} placeholder={ui.page.placeholders.employeeBirth} /></Field>
                  <Field label={ui.fields.employeeAddress}><input className={inputClass} name="employeeAddress" value={form.employeeAddress} onChange={set} placeholder={ui.page.placeholders.employeeAddress} /></Field>
                  <Field label={ui.fields.employeeEmail}><input className={inputClass} name="employeeEmail" value={form.employeeEmail} onChange={set} type="email" placeholder={ui.page.placeholders.employeeEmail} /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="03" title={ui.sections.task.title} subtitle={ui.sections.task.subtitle} />
                <div className="space-y-4">
                  <Field label={ui.fields.taskDescription}>
                    <input className={inputClass} name="taskDescription" value={form.taskDescription} onChange={set} placeholder={ui.page.placeholders.taskDescription} />
                  </Field>
                  <Field label={ui.fields.taskDetails}>
                    <textarea className="w-full min-h-[80px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="taskDetails" value={form.taskDetails} onChange={set} placeholder={ui.page.placeholders.taskDetails} />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label={ui.fields.workPlace}><input className={inputClass} name="workPlace" value={form.workPlace} onChange={set} placeholder={ui.page.placeholders.workPlace} /></Field>
                    <Field label={ui.fields.estimatedHours}>
                      <input className={inputClass} name="estimatedHours" value={form.estimatedHours} onChange={set} type="number" placeholder={ui.page.placeholders.estimatedHours} />
                    </Field>
                  </div>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="04" title={ui.sections.term.title} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={ui.fields.durationType}>
                    <select className={inputClass} name="durationType" value={form.durationType} onChange={set}>
                      <option value="fixed">{ui.options.durationFixed}</option>
                      <option value="indefinite">{ui.options.durationIndefinite}</option>
                    </select>
                  </Field>
                  <Field label={ui.fields.startDate}><input className={inputClass} name="startDate" value={form.startDate} onChange={set} type="date" /></Field>
                  {form.durationType === 'fixed' && <Field label={ui.fields.endDate}><input className={inputClass} name="endDate" value={form.endDate} onChange={set} type="date" /></Field>}
                  <Field label={ui.fields.deadline}><input className={inputClass} name="deadline" value={form.deadline} onChange={set} type="date" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="05" title={ui.sections.pay.title} subtitle={ui.sections.pay.subtitle} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={ui.fields.remunerationType}>
                    <select className={inputClass} name="remunerationType" value={form.remunerationType} onChange={set}>
                      <option value="fixed">{ui.options.payFixed}</option>
                      <option value="hourly">{ui.options.payHourly}</option>
                    </select>
                  </Field>
                  {form.remunerationType === 'fixed'
                    ? <Field label={ui.fields.totalRemuneration}><input className={inputClass} name="totalRemuneration" value={form.totalRemuneration} onChange={set} type="number" placeholder={ui.page.placeholders.totalRemuneration} /></Field>
                    : <Field label={ui.fields.hourlyRate}><input className={inputClass} name="hourlyRate" value={form.hourlyRate} onChange={set} type="number" placeholder={ui.page.placeholders.hourlyRate} /></Field>
                  }
                  <Field label={ui.fields.paymentAccount}><input className={inputClass} name="paymentAccount" value={form.paymentAccount} onChange={set} placeholder={ui.page.placeholders.paymentAccount} /></Field>
                  <Field label={ui.fields.paymentDays}><input className={inputClass} name="paymentDays" value={form.paymentDays} onChange={set} type="number" /></Field>
                </div>
              </section>

              <section className={cardClass}>

                <div className="mt-6">
                  <BuilderTierSelector
                    contractType="dpp"
                    tier={form.tier}
                    onTierChange={(tier) =>
                      setForm((prev) => ({ ...prev, tier, notaryUpsell: tier !== 'basic' }))
                    }
                  />
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Watermarked document preview */}
            {previewSections.length > 0 && (
              <ContractPreview sections={previewSections} title={ui.form.documentLabel} />
            )}
            <div className={cardClass}>
              <div className="builder-kicker mb-4">{ui.form.analysisTitle}</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div><div className={`font-bold ${scoreColor}`}>{risk.label}</div><div className="text-xs text-slate-500">{ui.form.scoreOf}</div></div>
              </div>
              {risk.warnings.length === 0
                ? <p className="text-sm text-emerald-400">{ui.page.hints.dppOk ?? ui.page.hints.contractCompliant}</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (
                    <li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-rose-500/10 text-rose-300' : 'bg-amber-500/10 text-amber-300'}`}>
                      {w.level === 'high' ? '? ' : '^ '}{w.text}
                    </li>
                  ))}</ul>
              }
            </div>

            <div className={cardClass}>
              <BuilderCheckoutSummary
                contractType="dpp"
                tier={form.tier}
                documentLabel={ui.form.documentLabel}
                onUpgrade={() => setForm((prev) => ({ ...prev, tier: 'complete', notaryUpsell: true }))}
              />
              {(!form.employerName || !form.employeeName || !form.taskDescription) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3 text-xs text-slate-400 space-y-1">
                  <div className="font-semibold mb-1">{ui.form.fillToContinue}</div>
                  {!form.employerName && <div>? {ui.page.sidebarMissing.employerName}</div>}
                  {!form.employeeName && <div>? {ui.page.sidebarMissing.employeeName}</div>}
                  {!form.taskDescription && <div>? {ui.page.sidebarMissing.taskDescription}</div>}
                </div>
              )}
                              {/* Tla??tko generov?n? */}
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.25)] active:scale-[0.98] uppercase tracking-tight"
                >
                  Vygenerovat smlouvu ?
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
        contractType="dpp"
        lang={builderLocale}
        onPay={handlePayment}
        isProcessing={isProcessing}
        onClose={() => setShowPreviewModal(false)}
      />
    )}
    </>
  );
}



