'use client';

import { useMemo, useState } from 'react';
import ContractPreview from '@/app/components/ContractPreview';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import { buildContractSections } from '@/lib/contracts';
import type { StoredContractData } from '@/lib/contracts';

type FormData = {
  partyAName: string; partyAId: string; partyAAddress: string; partyAEmail: string;
  partyBName: string; partyBId: string; partyBAddress: string; partyBEmail: string;
  cooperationScope: string; cooperationDetails: string; cooperationGoal: string;
  partyAContribution: string; partyBContribution: string;
  revenueModel: 'revenue_share' | 'fixed_fee' | 'custom';
  revenueShareA: string; revenueShareB: string; fixedFee: string; revenueDesc: string;
  ipSharing: 'joint' | 'partyA' | 'separate';
  coordinatorName: string;
  durationType: 'fixed' | 'indefinite'; startDate: string; endDate: string; noticePeriod: string;
  nonCompete: boolean; ndaPenalty: string;
  contractDate: string; notaryUpsell: boolean;
  tier: 'basic' | 'professional' | 'complete';
  disputeResolution: 'court' | 'mediation' | 'arbitration';
};

const inputClass = 'w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';
const cardClass = 'bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<label className="block"><span className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</span>{children}</label>);
}
function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (<div className="mb-6"><div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90">{index}. {title}</div>{subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}</div>);
}

export default function SpolupraceePage() {
  const [form, setForm] = useState<FormData>({
    partyAName: '', partyAId: '', partyAAddress: '', partyAEmail: '',
    partyBName: '', partyBId: '', partyBAddress: '', partyBEmail: '',
    cooperationScope: '', cooperationDetails: '', cooperationGoal: '',
    partyAContribution: '', partyBContribution: '',
    revenueModel: 'revenue_share',
    revenueShareA: '50', revenueShareB: '50', fixedFee: '', revenueDesc: '',
    ipSharing: 'joint',
    coordinatorName: '',
    durationType: 'indefinite', startDate: '', endDate: '', noticePeriod: '3',
    nonCompete: false, ndaPenalty: '100000',
    contractDate: '', notaryUpsell: false,
    tier: 'basic' as const,
    disputeResolution: 'court' as const,
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
    if (!form.cooperationScope) { score -= 25; warnings.push({ text: 'Doplňte předmět spolupráce — nejdůležitější část smlouvy.', level: 'high' }); }
    if (!form.partyAContribution || !form.partyBContribution) { score -= 15; warnings.push({ text: 'Doplňte příspěvky stran — může způsobit spory.', level: 'medium' }); }
    if (form.revenueModel === 'revenue_share' && Number(form.revenueShareA) + Number(form.revenueShareB) !== 100) { score -= 10; warnings.push({ text: 'Součet podílů na výnosech není 100 %.', level: 'high' }); }
    if (!form.notaryUpsell) { score -= 8; warnings.push({ text: 'Bez mlčenlivosti a zákazu konkurence hrozí zneužití informací.', level: 'medium' }); }
    return { score: Math.max(0, score), warnings, label: score >= 85 ? 'Silná smlouva' : score >= 65 ? 'Průměrná ochrana' : 'Doporučená doplnění' };
  }, [form]);

  const previewSections = useMemo(() => {
    try {
      if (!form.partyAName) return [];
      return buildContractSections({ ...form, contractType: 'cooperation' } as StoredContractData);
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
        body: JSON.stringify({ contractType: 'cooperation', tier: form.tier, notaryUpsell: form.tier !== 'basic', payload: { ...form, contractType: 'cooperation' }, email: form.partyAEmail }),
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
            <div><div className="font-bold tracking-tight text-white">SmlouvaHned Builder</div><div className="text-[11px] text-slate-500">Smlouva o spolupráci — § 1746 OZ</div></div>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-sm text-slate-400 hover:text-white transition">Zavřít</button>
        </div>
      </header>

      <ContractLandingSection
        badge="§ 1746 odst. 2 občanského zákoníku"
        h1Main="Smlouva o"
        h1Accent="spolupráci online"
        subtitle="Vytvořte smlouvu o spolupráci pro dlouhodobý obchodní vztah mezi OSVČ nebo firmami. Pokrývá rozdělení odpovědností, podíl na výnosech, duševní vlastnictví, mlčenlivost a podmínky ukončení."
        benefits={[
          { icon: '⚖️', text: 'Inominátní smlouva dle § 1746 OZ — pro obchodní partnerství' },
          { icon: '📄', text: 'PDF ke stažení ihned po ověřené platbě' },
          { icon: '🤝', text: 'Vhodné pro spolupráci OSVČ, freelancerů nebo firem' },
          { icon: '🔒', text: 'Pokrývá IP práva, mlčenlivost, zákaz konkurence a exit klauzule' },
        ]}
        contents={[
          'Identifikaci obou spolupracujících stran',
          'Popis a rozsah spolupráce',
          'Rozdělení odpovědností a výstupů',
          'Podíl na výnosech nebo honorář za spolupráci',
          'Vlastnictví duševního vlastnictví',
          'Závazek mlčenlivosti',
          'Zákaz konkurence a jeho rozsah',
          'Podmínky ukončení a vypořádání (exit klauzule)',
          'Závěrečná ustanovení, GDPR a vyšší moc',
        ]}
        whenSuitable={[
          'Dlouhodobá obchodní spolupráce dvou OSVČ nebo firem',
          'Společné projekty nebo výzkumné spolupráce',
          'Partnerství s podílem na výnosech nebo výsledcích',
          'Situace, kde je třeba jasně vymezit IP práva a mlčenlivost',
        ]}
        whenOther={[
          { label: 'Smlouva o dílo', href: '/smlouva-o-dilo', text: 'Pro jednorázové zhotovení konkrétního díla s předáním.' },
          { label: 'NDA (smlouva o mlčenlivosti)', href: '/nda', text: 'Pokud potřebujete pouze závazek mlčenlivosti bez dalšího smluvního rámce.' },
        ]}
        faq={[
          { q: 'Čím se smlouva o spolupráci liší od smlouvy o dílo?', a: 'Smlouva o spolupráci pokrývá dlouhodobý vztah s průběžným plněním a sdílenými cíli. Smlouva o dílo je zaměřena na jednorázový výsledek — dílo, které se zhotovuje a předává.' },
          { q: 'Je smlouva vhodná pro dvě fyzické osoby podnikající jako OSVČ?', a: 'Ano, smlouva je navržena právě pro spolupráci OSVČ nebo firem. Není vhodná pro vznik pracovního poměru.' },
          { q: 'Co jsou exit klauzule?', a: 'Ustanovení definující podmínky ukončení spolupráce — výpovědní doba, vypořádání pohledávek, přechod IP práv a případná kompenzace. Pomáhají přehledně upravit ukončení vztahu.' },
          { q: 'Dostanu dokument ihned po zaplacení?', a: 'Ano, PDF je k dispozici ke stažení okamžitě po dokončení platby.' },
        ]}
        ctaLabel="Vytvořit smlouvu o spolupráci"
        formId="formular"
        guideHref="/smlouva-o-spolupraci"
        guideLabel="Průvodce smlouvou o spolupráci — podíl na výnosech, IP práva a exit"
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
                <SectionTitle index="01" title="Strana A" subtitle="Jedna ze spolupracujících stran (osoba nebo firma)." />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Jméno / název *"><input className={inputClass} name="partyAName" value={form.partyAName} onChange={set} placeholder="Jan Novák / ABC s.r.o." /></Field>
                  <Field label="IČO / datum nar. *"><input className={inputClass} name="partyAId" value={form.partyAId} onChange={set} placeholder="12345678" /></Field>
                  <Field label="Adresa / sídlo *"><input className={inputClass} name="partyAAddress" value={form.partyAAddress} onChange={set} placeholder="Ulice 1, Praha" /></Field>
                  <Field label="E-mail"><input className={inputClass} name="partyAEmail" value={form.partyAEmail} onChange={set} type="email" placeholder="jan@firma.cz" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="02" title="Strana B" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Jméno / název *"><input className={inputClass} name="partyBName" value={form.partyBName} onChange={set} placeholder="Marie Svobodová / XYZ s.r.o." /></Field>
                  <Field label="IČO / datum nar. *"><input className={inputClass} name="partyBId" value={form.partyBId} onChange={set} placeholder="87654321" /></Field>
                  <Field label="Adresa / sídlo *"><input className={inputClass} name="partyBAddress" value={form.partyBAddress} onChange={set} placeholder="Ulice 5, Brno" /></Field>
                  <Field label="E-mail"><input className={inputClass} name="partyBEmail" value={form.partyBEmail} onChange={set} type="email" placeholder="marie@firma.cz" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="03" title="Předmět spolupráce" subtitle="Co budete společně dělat? Čím konkrétnější, tím lépe." />
                <div className="space-y-4">
                  <Field label="Oblast / popis spolupráce *">
                    <input className={inputClass} name="cooperationScope" value={form.cooperationScope} onChange={set} placeholder="Společný vývoj softwaru, marketingová kampaň, e-shop…" />
                  </Field>
                  <Field label="Podrobný popis (nepovinné)">
                    <textarea className="w-full min-h-[80px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="cooperationDetails" value={form.cooperationDetails} onChange={set} placeholder="Strana A dodá technologické řešení, Strana B zajistí obchodní kanály…" />
                  </Field>
                  <Field label="Cíl spolupráce"><input className={inputClass} name="cooperationGoal" value={form.cooperationGoal} onChange={set} placeholder="Uvedení produktu na trh do Q3 2026" /></Field>
                  <Field label="Začátek spolupráce"><input className={inputClass} name="startDate" value={form.startDate} onChange={set} type="date" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="04" title="Příspěvky stran" subtitle="Co každá strana přináší — know-how, práce, peníze, kontakty." />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={`${form.partyAName || 'Strana A'} přispívá`}>
                    <textarea className="w-full min-h-[70px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="partyAContribution" value={form.partyAContribution} onChange={set} placeholder="Technologie, vývoj, pracovní kapacita…" />
                  </Field>
                  <Field label={`${form.partyBName || 'Strana B'} přispívá`}>
                    <textarea className="w-full min-h-[70px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="partyBContribution" value={form.partyBContribution} onChange={set} placeholder="Obchodní kanály, klientela, finance…" />
                  </Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="05" title="Odměňování a rozdělení výnosů" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Model odměňování">
                    <select aria-label="Podíl na výnosech (%)" className={inputClass} name="revenueModel" value={form.revenueModel} onChange={set}>
                      <option value="revenue_share">Podíl na výnosech (%)</option>
                      <option value="fixed_fee">Pevná odměna za spolupráci</option>
                      <option value="custom">Vlastní popis</option>
                    </select>
                  </Field>
                  {form.revenueModel === 'revenue_share' && (
                    <>
                      <Field label={`Podíl ${form.partyAName || 'Strany A'} (%)`}><input className={inputClass} name="revenueShareA" value={form.revenueShareA} onChange={set} type="number" /></Field>
                      <Field label={`Podíl ${form.partyBName || 'Strany B'} (%)`}><input className={inputClass} name="revenueShareB" value={form.revenueShareB} onChange={set} type="number" /></Field>
                    </>
                  )}
                  {form.revenueModel === 'fixed_fee' && <Field label={`Pevná odměna ${form.partyBName || 'Straně B'} (Kč/měsíc)`}><input className={inputClass} name="fixedFee" value={form.fixedFee} onChange={set} type="number" placeholder="20000" /></Field>}
                  {form.revenueModel === 'custom' && <div className="sm:col-span-2"><Field label="Popis odměňování"><textarea className="w-full min-h-[70px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="revenueDesc" value={form.revenueDesc} onChange={set} placeholder="Popište způsob odměňování…" /></Field></div>}
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="06" title="Duševní vlastnictví a trvání" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Vlastnictví výstupů IP">
                    <select aria-label="Společné vlastnictví (50/50)" className={inputClass} name="ipSharing" value={form.ipSharing} onChange={set}>
                      <option value="joint">Společné vlastnictví (50/50)</option>
                      <option value="partyA">Náleží Straně A</option>
                      <option value="separate">Každý vlastní, co vytvořil</option>
                    </select>
                  </Field>
                  <Field label="Koordinátor (nepovinné)"><input className={inputClass} name="coordinatorName" value={form.coordinatorName} onChange={set} placeholder="Jan Novák" /></Field>
                  <Field label="Trvání smlouvy">
                    <select aria-label="Na dobu neurčitou" className={inputClass} name="durationType" value={form.durationType} onChange={set}>
                      <option value="indefinite">Na dobu neurčitou</option>
                      <option value="fixed">Na dobu určitou</option>
                    </select>
                  </Field>
                  {form.durationType === 'fixed' ? <Field label="Konec smlouvy"><input className={inputClass} name="endDate" value={form.endDate} onChange={set} type="date" /></Field> : <Field label="Výpovědní doba (měsíce)"><input className={inputClass} name="noticePeriod" value={form.noticePeriod} onChange={set} type="number" /></Field>}
                </div>
              </section>

              <section className={cardClass}>

                {/* Řešení sporů */}
                <div className="mb-6">
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Řešení sporů</div>
                  <select aria-label="Obecný soud (výchozí)" className={inputClass} name="disputeResolution" value={form.disputeResolution} onChange={set}>
                    <option value="court">Obecný soud (výchozí)</option>
                    <option value="mediation">Mediace (zákon č. 202/2012 Sb.)</option>
                    <option value="arbitration">Rozhodčí řízení (Rozhodčí soud HK ČR)</option>
                  </select>
                </div>
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
              </section>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Watermarked document preview */}
            {previewSections.length > 0 && (
              <ContractPreview sections={previewSections} title="Smlouva o spolupráci" />
            )}
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Analýza smlouvy</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div><div className={`font-bold ${scoreColor}`}>{risk.label}</div><div className="text-xs text-slate-500">ze 100 bodů</div></div>
              </div>
              {risk.warnings.length === 0 ? <p className="text-sm text-emerald-400">✓ Smlouva o spolupráci je kompletní.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (<li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-rose-500/10 text-rose-300' : 'bg-amber-500/10 text-amber-300'}`}>{w.level === 'high' ? '⚠ ' : '▲ '}{w.text}</li>))}</ul>}
            </div>
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Shrnutí</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Smlouva o spolupráci</span><span className="font-bold">249 Kč</span></div>
                {form.tier !== 'basic' && <div className="flex justify-between"><span className="text-slate-400">{form.tier === 'complete' ? 'Kompletní balíček' : 'Rozšířený dokument'}</span><span className="text-amber-400 font-bold">{form.tier === 'complete' ? '+500 Kč' : '+200 Kč'}</span></div>}
                <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-lg"><span>Celkem</span><span className="text-amber-400">{form.tier === 'complete' ? '749' : form.tier === 'professional' ? '399' : '249'} Kč</span></div>
              </div>
              {(!form.partyAName || !form.partyBName || !form.cooperationScope) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3">
                  <div className="font-semibold mb-1 text-slate-400">Před platbou vyplňte:</div>
                  {!form.partyAName && <div className="text-slate-400 text-sm">• Jméno strany A</div>}
                  {!form.partyBName && <div className="text-slate-400 text-sm">• Jméno strany B</div>}
                  {!form.cooperationScope && <div className="text-slate-400 text-sm">• Předmět spolupráce</div>}
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
              <label className="flex items-start gap-3 mb-4 cursor-pointer mt-4">
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
              <button onClick={handlePayment} disabled={isProcessing || !gdprConsent || !form.partyAName || !form.partyBName || !form.cooperationScope}
                className="mt-4 w-full rounded-2xl bg-amber-500 px-6 py-4 font-bold text-slate-900 text-lg hover:bg-amber-400 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed">
                {isProcessing ? 'Přesměrování…' : 'Zaplatit a stáhnout PDF →'}
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">Platba kartou přes Stripe · PDF ke stažení</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


