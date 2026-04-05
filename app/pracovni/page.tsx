'use client';

import { useMemo, useState } from 'react';
import ContractPreview from '@/app/components/ContractPreview';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import { buildContractSections } from '@/lib/contracts';
import type { StoredContractData } from '@/lib/contracts';

type FormData = {
  employerName: string; employerIco: string; employerAddress: string; employerEmail: string;
  employeeName: string; employeeBirth: string; employeeAddress: string; employeeEmail: string;
  jobTitle: string; jobDescription: string; workPlace: string; remoteWork: string;
  startDate: string; employmentType: 'indefinite' | 'fixed'; endDate: string;
  trialPeriodMonths: string; noticePeriod: string;
  workHours: string; workSchedule: string; breakMinutes: string; vacationWeeks: string;
  salary: string; salaryType: 'monthly' | 'hourly'; hourlyRate: string; payDay: string; bonusDesc: string;
  nonCompete: boolean; nonCompetePeriod: string; breachPenalty: string;
  contractDate: string;
  notaryUpsell: boolean;
  tier: 'basic' | 'professional' | 'complete';
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
  const [form, setForm] = useState<FormData>({
    employerName: '', employerIco: '', employerAddress: '', employerEmail: '',
    employeeName: '', employeeBirth: '', employeeAddress: '', employeeEmail: '',
    jobTitle: '', jobDescription: '', workPlace: '', remoteWork: '',
    startDate: '', employmentType: 'indefinite', endDate: '',
    trialPeriodMonths: '3', noticePeriod: '2',
    workHours: '40', workSchedule: 'pondělí–pátek, 8:00–17:00', breakMinutes: '30', vacationWeeks: '4',
    salary: '', salaryType: 'monthly', hourlyRate: '', payDay: '15', bonusDesc: '',
    nonCompete: false, nonCompetePeriod: '12', breachPenalty: '50000',
    contractDate: '', notaryUpsell: false,
    tier: 'basic' as const,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [withdrawalConsent, setWithdrawalConsent] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState(false);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const risk = useMemo(() => {
    let score = 100;
    const warnings: { text: string; level: 'high' | 'medium' | 'low' }[] = [];
    if (!form.employerIco) { score -= 15; warnings.push({ text: 'Doplňte IČO zaměstnavatele — povinný údaj.', level: 'high' }); }
    if (!form.jobTitle) { score -= 20; warnings.push({ text: 'Druh práce (pozice) je povinná náležitost § 34 ZP.', level: 'high' }); }
    if (!form.workPlace) { score -= 15; warnings.push({ text: 'Místo výkonu práce je povinná náležitost § 34 ZP.', level: 'high' }); }
    if (!form.startDate) { score -= 15; warnings.push({ text: 'Den nástupu je povinná náležitost § 34 ZP.', level: 'high' }); }
    if (!form.salary && !form.hourlyRate) { score -= 10; warnings.push({ text: 'Doporučujeme doplnit mzdu — zaměstnanec ji musí znát.', level: 'medium' }); }
    if (form.employmentType === 'fixed' && !form.endDate) { score -= 10; warnings.push({ text: 'Doplňte datum konce pro smlouvu na dobu určitou.', level: 'high' }); }
    if (Number(form.trialPeriodMonths) > 3) { warnings.push({ text: 'Zákonné maximum zkušební doby je 3 měsíce (§ 35 ZP). U vedoucích zaměstnanců max. 6 měsíců.', level: 'high' }); }
    return { score: Math.max(0, score), warnings, label: score >= 85 ? 'Dobré nastavení' : score >= 65 ? 'Průměrná ochrana' : 'Doporučená doplnění' };
  }, [form]);

  const previewSections = useMemo(() => {
    try {
      if (!form.employerName) return [];
      return buildContractSections({ ...form, contractType: 'employment' } as StoredContractData);
    } catch {
      return [];
    }
  }, [form]);

  const handlePayment = async () => {
    try {
          if (!withdrawalConsent) {
      setWithdrawalError(true);
      return;
    }
    if (!gdprConsent) { alert('Pro pokračování je nutný souhlas se zpracováním osobních údajů.'); return; }
    setIsProcessing(true);
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: 'employment', tier: form.tier, notaryUpsell: form.tier !== 'basic', payload: { ...form, contractType: 'employment' }, email: form.employerEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error();
      window.location.href = data.url;
    } catch { alert('Chyba platební brány.'); setIsProcessing(false); }
  };

  const scoreColor = risk.score >= 85 ? 'text-emerald-400' : risk.score >= 65 ? 'text-amber-400' : 'text-rose-400';

  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200 font-sans pb-24">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08101e]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-sm">SH</div>
            <div>
              <div className="font-bold tracking-tight text-white">SmlouvaHned Builder</div>
              <div className="text-[11px] text-slate-500">Pracovní smlouva — § 34 zákoníku práce</div>
            </div>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-sm text-slate-400 hover:text-white transition">Zavřít</button>
        </div>
      </header>

      <ContractLandingSection
        badge="§ 33 a násl. zákoníku práce"
        h1Main="Pracovní smlouva"
        h1Accent="online"
        subtitle="Vytvořte pracovní smlouvu pro vznik pracovního poměru. Dokument splňuje zákonem stanovené náležitosti — druh práce, místo výkonu a den nástupu — a pokrývá i odměňování, zkušební dobu a pracovní dobu."
        benefits={[
          { icon: '⚖️', text: 'Sestaveno dle § 33–65 zákoníku práce (zákon č. 262/2006 Sb.)' },
          { icon: '📄', text: 'PDF ke stažení ihned po ověřené platbě' },
          { icon: '👔', text: 'Splňuje zákonné náležitosti — druh práce, místo, nástup' },
          { icon: '🔒', text: 'Pokrývá zkušební dobu, odměnu i podmínky ukončení' },
        ]}
        contents={[
          'Identifikaci zaměstnavatele a zaměstnance',
          'Druh práce a pracovní náplň',
          'Místo výkonu práce',
          'Den nástupu do práce',
          'Mzdu nebo plat a způsob odměňování',
          'Délku zkušební doby',
          'Pracovní dobu a rozvržení směn',
          'Podmínky ukončení pracovního poměru',
          'Závěrečná ustanovení a GDPR',
        ]}
        whenSuitable={[
          'Vznik standardního pracovního poměru (HPP nebo zkrácený úvazek)',
          'Uzavření pracovní smlouvy na dobu určitou nebo neurčitou',
          'Situace, kdy je třeba formálně zaměstnat fyzickou osobu',
          'Případy se zkušební dobou nebo specifickým místem výkonu práce',
        ]}
        whenOther={[
          { label: 'Dohoda o provedení práce (DPP)', href: '/dpp', text: 'Pro krátkodobé nebo brigádnické úkoly do 300 hodin ročně — bez vzniku plného pracovního poměru.' },
          { label: 'Smlouva o poskytování služeb', href: '/sluzby', text: 'Pro spolupráci s OSVČ nebo firmou mimo pracovněprávní vztah.' },
        ]}
        faq={[
          { q: 'Jaké jsou povinné náležitosti pracovní smlouvy?', a: 'Zákoník práce vyžaduje tři povinné náležitosti: druh práce, místo výkonu práce a den nástupu. Chybí-li některá z nich, smlouva není platná. Ostatní ujednání (mzda, pracovní doba, zkušební doba) jsou vhodná, ale zákon je přímo nevyžaduje v samotné smlouvě.' },
          { q: 'Jak dlouhá může být zkušební doba?', a: 'U řadových zaměstnanců maximálně 3 měsíce, u vedoucích pracovníků maximálně 6 měsíců. Zkušební dobu lze sjednat nejpozději v den nástupu do práce.' },
          { q: 'Lze uzavřít pracovní smlouvu na dobu určitou?', a: 'Ano, ale zákon ji omezuje — maximálně 3 roky, přičemž smlouvu na dobu určitou lze opakovat nejvýše dvakrát. Poté musí být uzavřena smlouva na dobu neurčitou.' },
          { q: 'Musí být pracovní smlouva podepsána před nástupem?', a: 'Zákoník práce vyžaduje uzavření pracovní smlouvy před začátkem výkonu práce. Podpis smlouvy v den nástupu je přípustný.' },
          { q: 'Dostanu dokument ihned po zaplacení?', a: 'Ano, PDF je k dispozici ke stažení okamžitě po dokončení platby.' },
        ]}
        ctaLabel="Vytvořit pracovní smlouvu"
        formId="formular"
        guideHref="/pracovni-smlouva"
        guideLabel="Průvodce pracovní smlouvou — zákonné náležitosti, zkušební doba a ukončení"
      />

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">

            <div id="formular" className="space-y-6">
              <div className="mb-6 border-t border-slate-800/60 pt-8">
                <h2 className="text-lg font-black text-white uppercase tracking-wide">Vyplňte údaje dokumentu</h2>
                <p className="text-sm text-slate-500 mt-1">Všechna povinná pole jsou označena *</p>
              </div>

              <section className={cardClass}>
                <SectionTitle index="01" title="Zaměstnavatel" subtitle="IČO, sídlo a kontakt jsou povinné náležitosti zákoníku práce." />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Název firmy / jméno *"><input className={inputClass} name="employerName" value={form.employerName} onChange={set} placeholder="ABC s.r.o." /></Field>
                  <Field label="IČO *"><input className={inputClass} name="employerIco" value={form.employerIco} onChange={set} placeholder="12345678" /></Field>
                  <Field label="Sídlo / adresa *"><input className={inputClass} name="employerAddress" value={form.employerAddress} onChange={set} placeholder="Náměstí 1, Praha 1" /></Field>
                  <Field label="E-mail HR"><input className={inputClass} name="employerEmail" value={form.employerEmail} onChange={set} type="email" placeholder="hr@firma.cz" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="02" title="Zaměstnanec" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Jméno a příjmení *"><input className={inputClass} name="employeeName" value={form.employeeName} onChange={set} placeholder="Jana Nováková" /></Field>
                  <Field label="Datum narození *"><input className={inputClass} name="employeeBirth" value={form.employeeBirth} onChange={set} placeholder="15.03.1995" /></Field>
                  <Field label="Trvalé bydliště *"><input className={inputClass} name="employeeAddress" value={form.employeeAddress} onChange={set} placeholder="Ulice 5, Brno" /></Field>
                  <Field label="E-mail zaměstnance"><input className={inputClass} name="employeeEmail" value={form.employeeEmail} onChange={set} type="email" placeholder="jana@email.cz" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="03" title="Druh a místo práce" subtitle="Povinné náležitosti dle § 34 ZP — bez nich smlouva není platná." />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Pracovní pozice (druh práce) *"><input className={inputClass} name="jobTitle" value={form.jobTitle} onChange={set} placeholder="Programátor / Účetní / Skladník" /></Field>
                  <Field label="Místo výkonu práce *"><input className={inputClass} name="workPlace" value={form.workPlace} onChange={set} placeholder="Praha 1, sídlo firmy" /></Field>
                  <div className="sm:col-span-2">
                    <Field label="Pracovní náplň (nepovinné, ale doporučené)">
                      <textarea className="w-full min-h-[80px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="jobDescription" value={form.jobDescription} onChange={set} placeholder="Vývoj a správa webových aplikací, účast na code review, komunikace s klienty…" />
                    </Field>
                  </div>
                  <Field label="Možnost home office">
                    <select aria-label="— nevyplněno —" className={inputClass} name="remoteWork" value={form.remoteWork} onChange={set}>
                      <option value="">— nevyplněno —</option>
                      <option value="plný remote (100 %)">Plný remote (100 %)</option>
                      <option value="hybridní (dle dohody)">Hybridní (dle dohody)</option>
                      <option value="není povoleno">Není povoleno</option>
                    </select>
                  </Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="04" title="Trvání pracovního poměru" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Druh poměru">
                    <select aria-label="Na dobu neurčitou" className={inputClass} name="employmentType" value={form.employmentType} onChange={set}>
                      <option value="indefinite">Na dobu neurčitou</option>
                      <option value="fixed">Na dobu určitou</option>
                    </select>
                  </Field>
                  <Field label="Datum nástupu *"><input className={inputClass} name="startDate" value={form.startDate} onChange={set} type="date" /></Field>
                  {form.employmentType === 'fixed' && <Field label="Datum konce *"><input className={inputClass} name="endDate" value={form.endDate} onChange={set} type="date" /></Field>}
                  <Field label="Zkušební doba (měsíce, 0 = bez)">
                    <input className={inputClass} name="trialPeriodMonths" value={form.trialPeriodMonths} onChange={set} type="number" min="0" max="6" />
                    {Number(form.trialPeriodMonths) > 3 && (
                      <p className="mt-1.5 text-xs text-rose-400 font-medium">⚠ Zákonné maximum je 3 měsíce (§ 35 ZP); u vedoucích max. 6 měsíců.</p>
                    )}
                  </Field>
                  <Field label="Výpovědní doba (měsíce)"><input className={inputClass} name="noticePeriod" value={form.noticePeriod} onChange={set} type="number" min="1" max="6" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="05" title="Pracovní doba a dovolená" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Týdenní pracovní doba (hod.)"><input className={inputClass} name="workHours" value={form.workHours} onChange={set} type="number" /></Field>
                  <Field label="Rozvrh pracovní doby"><input className={inputClass} name="workSchedule" value={form.workSchedule} onChange={set} placeholder="Po–Pá, 8:00–17:00" /></Field>
                  <Field label="Přestávka (minut)"><input className={inputClass} name="breakMinutes" value={form.breakMinutes} onChange={set} type="number" /></Field>
                  <Field label="Dovolená (týdny/rok)"><input className={inputClass} name="vacationWeeks" value={form.vacationWeeks} onChange={set} type="number" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="06" title="Mzda a odměňování" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Typ mzdy">
                    <select aria-label="Měsíční" className={inputClass} name="salaryType" value={form.salaryType} onChange={set}>
                      <option value="monthly">Měsíční</option>
                      <option value="hourly">Hodinová</option>
                    </select>
                  </Field>
                  {form.salaryType === 'monthly'
                    ? <Field label="Hrubá měsíční mzda (Kč)"><input className={inputClass} name="salary" value={form.salary} onChange={set} type="number" placeholder="45000" /></Field>
                    : <Field label="Hodinová mzda (Kč/hod.)"><input className={inputClass} name="hourlyRate" value={form.hourlyRate} onChange={set} type="number" placeholder="250" /></Field>
                  }
                  <Field label="Výplatní termín (den v měsíci)"><input className={inputClass} name="payDay" value={form.payDay} onChange={set} type="number" min="1" max="31" /></Field>
                  <div className="sm:col-span-2">
                    <Field label="Bonusy / prémie (popis, nepovinné)">
                      <input className={inputClass} name="bonusDesc" value={form.bonusDesc} onChange={set} placeholder="Roční bonus dle hodnocení, max. 2 měsíční platy" />
                    </Field>
                  </div>
                </div>
              </section>

              {/* Rozšířený dokument */}
              <section className={cardClass}>
                <SectionTitle index="07" title="Rozšířený dokument" subtitle="Konkurenční doložka a ochrana obchodního tajemství." />

                {/* === VÝBĚR BALÍČKU === */}
                <div className="space-y-3 mt-6">
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Vyberte balíček</div>
                  {([
                    { value: 'basic', label: 'Základní dokument', price: '249 Kč', desc: 'Strukturovaná smlouva dle občanského zákoníku, výstup v PDF.' },
                    { value: 'professional', label: 'Rozšířený dokument', price: '399 Kč', desc: 'Rozšířené klauzule, smluvní pokuty a zajišťovací ustanovení.', recommended: true },
                    { value: 'complete', label: 'Kompletní balíček', price: '749 Kč', desc: 'Vše z Rozšířeného dokumentu + průvodní instrukce, checklist a 30denní archivace.' },
                  ] as const).map((opt) => (
                    <label
                      key={opt.value}
                      className={`block rounded-2xl border-2 p-4 cursor-pointer transition relative ${
                        form.tier === opt.value
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-slate-700/60 bg-[#0c1426]/60 hover:border-slate-600'
                      }`}
                    >
                      {('recommended' in opt) &&  form.tier !== 'professional' && (
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
                          checked={form.tier === opt.value}
                          onChange={(e) => setForm((prev) => ({ ...prev, tier: e.target.value as 'basic' | 'professional' | 'complete', notaryUpsell: e.target.value !== 'basic' }))}
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
                {form.notaryUpsell && (
                  <div className="mt-4 grid sm:grid-cols-2 gap-4">
                    <label htmlFor="nonCompete" className={`flex items-start gap-3 cursor-pointer rounded-xl border p-4 transition ${form.nonCompete ? 'border-amber-500/70 bg-amber-500/10' : 'border-slate-700/60 bg-[#111c31]'}`}>
                      <input id="nonCompete" type="checkbox" name="nonCompete" checked={form.nonCompete} onChange={set} className="mt-0.5 h-4 w-4 accent-amber-500" />
                      <div className="text-sm text-white">Konkurenční doložka</div>
                    </label>
                    {form.nonCompete && (
                      <Field label="Délka zákazu (měsíce)">
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
              <ContractPreview sections={previewSections} title="Pracovní smlouva" />
            )}
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Analýza smlouvy</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div><div className={`font-bold ${scoreColor}`}>{risk.label}</div><div className="text-xs text-slate-500">ze 100 bodů</div></div>
              </div>
              {risk.warnings.length === 0
                ? <p className="text-sm text-emerald-400">✓ Smlouva splňuje povinné náležitosti ZP.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (
                    <li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-rose-500/10 text-rose-300' : w.level === 'medium' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-700/40 text-slate-400'}`}>
                      {w.level === 'high' ? '⚠ ' : '▲ '}{w.text}
                    </li>
                  ))}</ul>
              }
            </div>

            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Shrnutí objednávky</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Pracovní smlouva</span><span className="text-white font-bold">249 Kč</span></div>
                {form.tier !== 'basic' && <div className="flex justify-between"><span className="text-slate-400">{form.tier === 'complete' ? 'Kompletní balíček' : 'Rozšířený dokument'}</span><span className="text-amber-400 font-bold">{form.tier === 'complete' ? '+500 Kč' : '+200 Kč'}</span></div>}
                <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-lg"><span>Celkem</span><span className="text-amber-400">{form.tier === 'complete' ? '749' : form.tier === 'professional' ? '399' : '249'} Kč</span></div>
              </div>
              {(!form.employerName || !form.employeeName || !form.jobTitle) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3 text-xs text-slate-400 space-y-1">
                  <div className="font-semibold mb-1">Vyplňte pro pokračování:</div>
                  {!form.employerName && <div>• Název zaměstnavatele</div>}
                  {!form.employeeName && <div>• Jméno zaměstnance</div>}
                  {!form.jobTitle && <div>• Pracovní pozice</div>}
                </div>
              )}
              <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Součástí výstupu je</div>
                <ul className="space-y-1.5">
                  {['Profesionálně strukturované PDF', 'PDF dokument určený ke kontrole a podpisu', 'Přehledné uspořádání smluvních ustanovení'].map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
                      <span className="text-amber-500 mt-0.5">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <label className="flex items-start gap-3 mb-4 mt-4 cursor-pointer">
                <input type="checkbox" checked={gdprConsent} onChange={(e) => setGdprConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-amber-500 flex-shrink-0" />
                <span className="text-xs text-slate-400 leading-relaxed">
                  Souhlasím se{' '}
                  <a href="/gdpr" className="text-amber-400 underline hover:text-amber-300" target="_blank" rel="noopener noreferrer">zpracováním osobních údajů</a>
                  {' '}a{' '}
                  <a href="/obchodni-podminky" className="text-amber-400 underline hover:text-amber-300" target="_blank" rel="noopener noreferrer">obchodními podmínkami</a>.
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
                    Beru na vědomí, že objednávám standardizovaný digitální dokument vytvořený podle mnou zadaných údajů, nikoli individuální právní službu. Digitální obsah bude ihned zpřístupněn po zaplacení.
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
              <button onClick={handlePayment} disabled={isProcessing || !gdprConsent || !form.employerName || !form.employeeName || !form.jobTitle}
                className="mt-4 w-full rounded-2xl bg-amber-500 px-6 py-4 font-bold text-slate-900 text-lg hover:bg-amber-400 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed">
                {isProcessing ? 'Přesměrování…' : 'Zaplatit a stáhnout PDF →'}
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">Platba kartou přes Stripe · PDF dokument zpřístupněný ihned po zaplacení</p>
              <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-300">
                <strong>Důležité:</strong> Pracovní smlouva musí být uzavřena před nástupem do práce a zaměstnanec musí obdržet jedno vyhotovení (§ 37 ZP).
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

