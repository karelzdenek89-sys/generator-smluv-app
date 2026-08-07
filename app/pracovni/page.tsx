'use client';

import { useMemo, useState } from 'react';
import type { CheckoutAuthorization } from '@/lib/checkout-authorization';
import ContractPreview from '@/app/components/ContractPreview';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import BuilderCheckoutSummary from '@/app/components/BuilderCheckoutSummary';
import BuilderTierSelector from '@/app/components/BuilderTierSelector';
import type { StoredContractData } from '@/lib/contracts';
import PaymentModal from '@/app/components/LazyPaymentModal';
import { BuilderLocaleNotice, useBuilderLocale, useBuilderDocumentTitle } from '@/app/components/BuilderLocaleNotice';
import { getEmploymentFormUi } from '@/lib/i18n/expat-builder-forms';
import { employmentRiskWarnings, employmentValidationFields } from '@/lib/i18n/expat-builder-risk';
import {
  buildExpatPreviewSections,
  getExpatPreviewDateLocale,
  getExpatPreviewLabels,
} from '@/lib/i18n/expat-contract-preview';
import {
  MIN_WAGE_HOURLY_2026_CZK,
  MIN_WAGE_MONTHLY_2026_CZK,
} from '@/lib/legal-constants-2026';

type FormData = {
  employerName: string; employerIco: string; employerAddress: string; employerEmail: string;
  employeeName: string; employeeBirth: string; employeeAddress: string; employeeEmail: string;
  jobTitle: string; jobDescription: string; workPlace: string; remoteWork: string;
  startDate: string; employmentType: 'indefinite' | 'fixed'; endDate: string;
  trialPeriodMonths: string; noticePeriod: string;
  workHours: string; workSchedule: string; breakMinutes: string; vacationWeeks: string;
  salary: string; salaryType: 'monthly' | 'hourly'; hourlyRate: string; payDay: string; bonusDesc: string;
  nonCompete: boolean; nonCompetePeriod: string; breachPenalty: string;
  isManager: boolean;
  contractDate: string;
  notaryUpsell: boolean;
  tier: 'basic' | 'complete';
};

const inputClass = 'w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';
const cardClass = 'bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]';

function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90">{index}. {title}</div>
      {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</span>
      {children}
    </label>
  );
}

export default function PracovniPage() {
  const builderLocale = useBuilderLocale();
  const ui = useMemo(() => getEmploymentFormUi(builderLocale), [builderLocale]);
  useBuilderDocumentTitle(builderLocale, {
    en: 'Employment contract — online form | SmlouvaHned',
    ua: 'Трудовий договір — онлайн-форма | SmlouvaHned',
  });
  const [form, setForm] = useState<FormData>(() => {
    const d = getEmploymentFormUi(builderLocale).page.defaults;
    return {
      employerName: '', employerIco: '', employerAddress: '', employerEmail: '',
      employeeName: '', employeeBirth: '', employeeAddress: '', employeeEmail: '',
      jobTitle: '', jobDescription: '', workPlace: '', remoteWork: '',
      startDate: '', employmentType: 'indefinite', endDate: '',
      trialPeriodMonths: d.trialPeriodMonths ?? '3',
      noticePeriod: d.noticePeriod ?? '2',
      workHours: d.workHours ?? '40',
      workSchedule: d.workSchedule ?? '',
      breakMinutes: d.breakMinutes ?? '30',
      vacationWeeks: d.vacationWeeks ?? '4',
      salary: '', salaryType: 'monthly', hourlyRate: '', payDay: d.payDay ?? '15', bonusDesc: '',
      nonCompete: false, nonCompetePeriod: d.nonCompetePeriod ?? '12', breachPenalty: d.breachPenalty ?? '50000',
      isManager: false,
      contractDate: '', notaryUpsell: false,
      tier: 'basic' as const,
    };
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const validationFields = useMemo(
    () => employmentValidationFields(builderLocale),
    [builderLocale],
  );

  const risk = useMemo(() => {
    const warnings = employmentRiskWarnings(builderLocale, form);
    const penalty = warnings.reduce(
      (sum, w) => sum + (w.level === 'high' ? 15 : w.level === 'medium' ? 10 : 5),
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
      return buildExpatPreviewSections('employment', builderLocale, {
        ...form,
        contractType: 'employment',
      } as StoredContractData);
    } catch {
      return [];
    }
  }, [form, builderLocale]);

  const handlePayment = async (addOns: string[], authorization: CheckoutAuthorization) => {
    // Validace § 34 ZP — pracovní smlouva BEZ druhu práce, místa a dne nástupu
    // je ze zákona neplatná. Tato pole jsou zde tvrdě povinná.
    const missing: string[] = [];
    if (!form.employerName?.trim()) missing.push(validationFields.employerName);
    if (!form.employeeName?.trim()) missing.push(validationFields.employeeName);
    if (!form.jobTitle?.trim()) missing.push(validationFields.jobTitle);
    if (!form.workPlace?.trim()) missing.push(validationFields.workPlace);
    if (!form.startDate) missing.push(validationFields.startDate);
    if (form.employmentType === 'fixed' && !form.endDate) missing.push(ui.fields.endDate);
    const activePay = form.salaryType === 'hourly' ? form.hourlyRate : form.salary;
    if (!activePay) missing.push(validationFields.salary);
    if (missing.length > 0) {
      alert(`${ui.form.validationPrefix} ${missing.join(', ')}.`);
      return;
    }
    const blockingWarnings = risk.warnings.filter((warning) => warning.blocking);
    if (blockingWarnings.length > 0) {
      alert(blockingWarnings.map((warning) => warning.text).join('\n'));
      return;
    }
    try {
      setIsProcessing(true);
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: 'employment', deliveryEmail: authorization.deliveryEmail, consent: authorization.consent, tier: form.tier, addOns, notaryUpsell: form.tier !== 'basic', lang: builderLocale, payload: { ...form, contractType: 'employment', lang: builderLocale } }),
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
    <BuilderLocaleNotice contractType="employment" />
    <main className="min-h-screen bg-[#05080f] text-slate-200 font-sans pb-24">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08101e]/90 backdrop-blur">
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
                <SectionTitle index="01" title={ui.sections.employer.title} subtitle={ui.sections.employer.subtitle} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={ui.fields.employerName}><input className={inputClass} name="employerName" value={form.employerName} onChange={set} placeholder={ui.page.placeholders.employerName} required /></Field>
                  <Field label={ui.fields.employerIco}><input className={inputClass} name="employerIco" value={form.employerIco} onChange={set} placeholder={ui.page.placeholders.employerIco} /></Field>
                  <Field label={ui.fields.employerAddress}><input className={inputClass} name="employerAddress" value={form.employerAddress} onChange={set} placeholder={ui.page.placeholders.employerAddress} /></Field>
                  <Field label={ui.fields.employerEmail}><input className={inputClass} name="employerEmail" value={form.employerEmail} onChange={set} type="email" placeholder={ui.page.placeholders.employerEmail} /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="02" title={ui.sections.employee.title} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={ui.fields.employeeName}><input className={inputClass} name="employeeName" value={form.employeeName} onChange={set} placeholder={ui.page.placeholders.employeeName} required /></Field>
                  <Field label={ui.fields.employeeBirth}><input className={inputClass} name="employeeBirth" value={form.employeeBirth} onChange={set} placeholder={ui.page.placeholders.employeeBirth} /></Field>
                  <Field label={ui.fields.employeeAddress}><input className={inputClass} name="employeeAddress" value={form.employeeAddress} onChange={set} placeholder={ui.page.placeholders.employeeAddress} /></Field>
                  <Field label={ui.fields.employeeEmail}><input className={inputClass} name="employeeEmail" value={form.employeeEmail} onChange={set} type="email" placeholder={ui.page.placeholders.employeeEmail} /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="03" title={ui.sections.job.title} subtitle={ui.sections.job.subtitle} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={ui.fields.jobTitle}><input className={inputClass} name="jobTitle" value={form.jobTitle} onChange={set} placeholder={ui.page.placeholders.jobTitle} required /></Field>
                  <Field label={ui.fields.workPlace}><input className={inputClass} name="workPlace" value={form.workPlace} onChange={set} placeholder={ui.page.placeholders.workPlace} required /></Field>
                  <div className="sm:col-span-2">
                    <Field label={ui.fields.jobDescription}>
                      <textarea className="w-full min-h-[80px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="jobDescription" value={form.jobDescription} onChange={set} placeholder={ui.page.placeholders.jobDescription} />
                    </Field>
                  </div>
                  <Field label={ui.fields.remoteWork}>
                    <select aria-label={ui.options.remoteEmpty} className={inputClass} name="remoteWork" value={form.remoteWork} onChange={set}>
                      <option value="">{ui.options.remoteEmpty}</option>
                      <option value={ui.remoteWorkValues.full}>{ui.options.remoteFull}</option>
                      <option value={ui.remoteWorkValues.hybrid}>{ui.options.remoteHybrid}</option>
                      <option value={ui.remoteWorkValues.none}>{ui.options.remoteNo}</option>
                    </select>
                  </Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="04" title={ui.sections.term.title} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={ui.fields.employmentType}>
                    <select aria-label={ui.options.indefinite} className={inputClass} name="employmentType" value={form.employmentType} onChange={set}>
                      <option value="indefinite">{ui.options.indefinite}</option>
                      <option value="fixed">{ui.options.fixed}</option>
                    </select>
                  </Field>
                  <Field label={ui.fields.startDate}><input className={inputClass} name="startDate" value={form.startDate} onChange={set} type="date" required /></Field>
                  {form.employmentType === 'fixed' && <Field label={ui.fields.endDate}><input className={inputClass} name="endDate" value={form.endDate} onChange={set} type="date" required /></Field>}
                  <Field label={ui.fields.trialMonths}>
                    <input className={inputClass} name="trialPeriodMonths" value={form.trialPeriodMonths} onChange={set} type="number" min="0" max={form.isManager ? 8 : 4} step="1" />
                    {Number(form.trialPeriodMonths) > (form.isManager ? 8 : 4) && (
                      <p className="mt-1.5 text-xs text-rose-400 font-medium">⚠ {ui.page.hints.trialMaxWarning(form.isManager ? 8 : 4)}</p>
                    )}
                  </Field>
                  <Field label={ui.fields.noticePeriod}><input className={inputClass} name="noticePeriod" value={form.noticePeriod} onChange={set} type="number" min="2" max="6" /></Field>
                  <label className={`col-span-2 flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition ${form.isManager ? 'border-amber-500/70 bg-amber-500/10' : 'border-slate-700/80 bg-[#111c31]'}`}>
                    <input type="checkbox" name="isManager" checked={form.isManager} onChange={set} className="mt-1 h-5 w-5 accent-amber-500" />
                    <div>
                      <div className="text-sm font-semibold text-white">{ui.fields.isManager}</div>
                      <div className="mt-1 text-xs leading-relaxed text-slate-400">{ui.page.hints.managerRole}</div>
                    </div>
                  </label>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="05" title={ui.sections.hours.title} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={ui.fields.workHours}><input className={inputClass} name="workHours" value={form.workHours} onChange={set} type="number" /></Field>
                  <Field label={ui.fields.workSchedule}><input className={inputClass} name="workSchedule" value={form.workSchedule} onChange={set} placeholder={ui.page.placeholders.workSchedule} /></Field>
                  <Field label={ui.fields.breakMinutes}><input className={inputClass} name="breakMinutes" value={form.breakMinutes} onChange={set} type="number" /></Field>
                  <Field label={ui.fields.vacationWeeks}><input className={inputClass} name="vacationWeeks" value={form.vacationWeeks} onChange={set} type="number" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="06" title={ui.sections.pay.title} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={ui.fields.salaryType}>
                    <select aria-label={ui.options.monthly} className={inputClass} name="salaryType" value={form.salaryType} onChange={set}>
                      <option value="monthly">{ui.options.monthly}</option>
                      <option value="hourly">{ui.options.hourly}</option>
                    </select>
                  </Field>
                  {form.salaryType === 'monthly'
                    ? <Field label={ui.fields.salary}><input className={inputClass} name="salary" value={form.salary} onChange={set} type="number" min={MIN_WAGE_MONTHLY_2026_CZK * Math.min(Number(form.workHours) || 40, 40) / 40} placeholder={ui.page.placeholders.salary} /></Field>
                    : <Field label={ui.fields.hourlyRate}><input className={inputClass} name="hourlyRate" value={form.hourlyRate} onChange={set} type="number" min={MIN_WAGE_HOURLY_2026_CZK} step="0.1" placeholder={ui.page.placeholders.hourlyRate} /></Field>
                  }
                  <Field label={ui.fields.payDay}><input className={inputClass} name="payDay" value={form.payDay} onChange={set} type="number" min="1" max="31" /></Field>
                  <div className="sm:col-span-2">
                    <Field label={ui.fields.bonusDesc}>
                      <input className={inputClass} name="bonusDesc" value={form.bonusDesc} onChange={set} placeholder={ui.page.placeholders.bonusDesc} />
                    </Field>
                  </div>
                </div>
              </section>

              {/* Doplňující ustanovení */}
              <section className={cardClass}>
                <SectionTitle index="07" title={ui.sections.extra.title} subtitle={ui.sections.extra.subtitle} />

                {/* === VÝBĚR BALÍČKU === */}
                <div className="mt-6">
                  <BuilderTierSelector
                    contractType="employment"
                    tier={form.tier}
                    onTierChange={(tier) =>
                      setForm((prev) => ({ ...prev, tier, notaryUpsell: tier !== 'basic' }))
                    }
                  />
                </div>
                {form.notaryUpsell && (
                  <div className="mt-4 grid sm:grid-cols-2 gap-4">
                    <label htmlFor="nonCompete" className={`flex items-start gap-3 cursor-pointer rounded-xl border p-4 transition ${form.nonCompete ? 'border-amber-500/70 bg-amber-500/10' : 'border-slate-700/60 bg-[#111c31]'}`}>
                      <input id="nonCompete" type="checkbox" name="nonCompete" checked={form.nonCompete} onChange={set} className="mt-0.5 h-4 w-4 accent-amber-500" />
                      <div className="text-sm text-white">{ui.fields.nonCompete}</div>
                    </label>
                    {form.nonCompete && (
                      <Field label={ui.fields.nonCompetePeriod}>
                        <input
                          id="nonCompetePeriod"
                          className={inputClass}
                          name="nonCompetePeriod"
                          value={form.nonCompetePeriod}
                          onChange={set}
                          type="number"
                          min="1"
                          max="12"
                        />
                      </Field>
                    )}
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Watermarked document preview */}
            {previewSections.length > 0 && (
              <ContractPreview
                sections={previewSections}
                title={ui.form.documentLabel}
                labels={getExpatPreviewLabels(builderLocale)}
                dateLocale={getExpatPreviewDateLocale(builderLocale)}
              />
            )}
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">{ui.form.analysisTitle}</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div><div className={`font-bold ${scoreColor}`}>{risk.label}</div><div className="text-xs text-slate-500">{ui.form.scoreOf}</div></div>
              </div>
              {risk.warnings.length === 0
                ? <p className="text-sm text-emerald-400">{ui.page.hints.contractCompliant}</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (
                    <li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-rose-500/10 text-rose-300' : w.level === 'medium' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-700/40 text-slate-400'}`}>
                      {w.level === 'high' ? '⚠ ' : '▲ '}{w.text}
                    </li>
                  ))}</ul>
              }
            </div>

            <div className={cardClass}>
              <BuilderCheckoutSummary
                contractType="employment"
                tier={form.tier}
                documentLabel={ui.form.documentLabel}
                onUpgrade={() => setForm((prev) => ({ ...prev, tier: 'complete', notaryUpsell: true }))}
              />
              {(!form.employerName || !form.employeeName || !form.jobTitle) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3 text-xs text-slate-400 space-y-1">
                  <div className="font-semibold mb-1">{ui.form.fillToContinue}</div>
                  {!form.employerName && <div>• {ui.page.sidebarMissing.employerName}</div>}
                  {!form.employeeName && <div>• {ui.page.sidebarMissing.employeeName}</div>}
                  {!form.jobTitle && <div>• {ui.page.sidebarMissing.jobTitle}</div>}
                </div>
              )}
                              {/* Tlačítko generování */}
                <button
                  data-builder-generate=""
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
        contractType="employment"
        lang={builderLocale}
        onPay={handlePayment}
        isProcessing={isProcessing}
        onClose={() => setShowPreviewModal(false)}
      />
    )}
    </>
  );
}


