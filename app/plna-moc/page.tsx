'use client';

import { useMemo, useState } from 'react';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import ContractPreview from '@/app/components/ContractPreview';
import { buildContractSections } from '@/lib/contracts';
import type { StoredContractData } from '@/lib/contracts';

type FormData = {
  principalName: string; principalId: string; principalAddress: string; principalEmail: string;
  agentName: string; agentId: string; agentAddress: string; agentEmail: string;
  poaType: 'general' | 'property' | 'court' | 'company' | 'bank';
  propertyAddress: string; courtName: string; caseNumber: string;
  companyName: string; companyIco: string; companyScope: string; bankAccount: string; bankName: string;
  customScope: string;
  validUntil: string; singleUse: boolean; allowSubstitution: boolean;
  contractDate: string; notaryUpsell: boolean;
  tier: 'basic' | 'professional' | 'complete';
};

const inputClass = 'w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';
const cardClass = 'bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<label className="block"><span className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</span>{children}</label>);
}
function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (<div className="mb-6"><div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90">{index}. {title}</div>{subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}</div>);
}

export default function PlnaMocPage() {
  const [form, setForm] = useState<FormData>({
    principalName: '', principalId: '', principalAddress: '', principalEmail: '',
    agentName: '', agentId: '', agentAddress: '', agentEmail: '',
    poaType: 'general',
    propertyAddress: '', courtName: '', caseNumber: '',
    companyName: '', companyIco: '', companyScope: '', bankAccount: '', bankName: '',
    customScope: '',
    validUntil: '', singleUse: false, allowSubstitution: false,
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
    if (!form.principalName || !form.principalId) { score -= 20; warnings.push({ text: 'Doplňte identifikaci zmocnitele.', level: 'high' }); }
    if (!form.agentName || !form.agentId) { score -= 20; warnings.push({ text: 'Doplňte identifikaci zmocněnce.', level: 'high' }); }
    if (form.poaType === 'general' && !form.customScope) { score -= 25; warnings.push({ text: 'Doplňte rozsah zmocnění.', level: 'high' }); }
    if (!form.validUntil && !form.singleUse) { score -= 5; warnings.push({ text: 'Platnost plné moci není omezena (platí do odvolání).', level: 'low' }); }
    if (form.notaryUpsell === false && (form.poaType === 'property' || form.poaType === 'company')) {
      score -= 10; warnings.push({ text: 'Pro nemovitosti a firmy doporučujeme úředně ověřený podpis (ověřená plná moc).', level: 'medium' });
    }
    return { score: Math.max(0, score), warnings, label: score >= 85 ? 'Kompletní plná moc' : score >= 65 ? 'Doporučená doplnění' : 'Doporučená doplnění' };
  }, [form]);

  const previewSections = useMemo(() => {
    try {
      if (!form.principalName) return [];
      return buildContractSections({ ...form, contractType: 'power_of_attorney' } as StoredContractData);
    } catch {
      return [];
    }
  }, [form]);

  const handlePayment = async () => {
    if (!form.principalName || !form.agentName) { alert('Vyplňte prosím jména zmocnitele a zmocněnce.'); return; }
        if (!withdrawalConsent) {
      setWithdrawalError(true);
      return;
    }
    if (!gdprConsent) { alert('Pro pokračování je nutný souhlas se zpracováním osobních údajů.'); return; }
    try {
      setIsProcessing(true);
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: 'power_of_attorney', tier: form.tier, notaryUpsell: form.tier !== 'basic', payload: { ...form, contractType: 'power_of_attorney' }, email: form.principalEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error();
      window.location.href = data.url;
    } catch { alert('Chyba platební brány.'); setIsProcessing(false); }
  };

  const scoreColor = risk.score >= 85 ? 'text-emerald-400' : risk.score >= 65 ? 'text-amber-400' : 'text-rose-400';

  const poaTypeLabels: Record<string, string> = {
    general: 'Obecná plná moc', property: 'Nemovitost', court: 'Soud / spor', company: 'Jednání za firmu', bank: 'Bankovní záležitosti',
  };

  const landingProps = {
    badge: '§ 441 a násl. občanského zákoníku',
    h1Main: 'Plná moc',
    h1Accent: 'online',
    subtitle: 'Vytvořte plnou moc pro zastoupení při právních jednáních, správě nemovitostí, zastupování v soudu nebo přístupu k bankovním účtům. Dokument jasně vymezuje rozsah zmocnění, dobu platnosti a případnou substituci.',
    benefits: [
      { icon: '⚖️', text: 'Sestaveno dle § 441–456 OZ — zastoupení na základě plné moci' },
      { icon: '📄', text: 'PDF ke stažení ihned po ověřené platbě' },
      { icon: '🔒', text: 'Pokrývá obecnou i speciální plnou moc (nemovitost, soud, banka)' },
      { icon: '📅', text: 'Jasně vymezená platnost a případné omezení zmocnění' },
    ],
    contents: [
      'Identifikaci zmocnitele (kdo plnou moc uděluje)',
      'Identifikaci zmocněnce (komu je zmocnění uděleno)',
      'Přesné vymezení rozsahu zmocnění',
      'Dobu platnosti plné moci',
      'Podmínky pro substitut (přenesení zmocnění)',
      'Platnost pro jednorázové nebo opakované jednání',
      'Závěrečná ustanovení a GDPR',
    ],
    whenSuitable: [
      'Zastupování při prodeji nebo koupi nemovitosti',
      'Zastupování v soudním nebo správním řízení',
      'Správa bankovního účtu v nepřítomnosti majitele',
      'Jednání jménem firmy nebo zastupování při podpisech dokumentů',
    ],
    whenOther: [
      { label: 'Smlouva o spolupráci', href: '/spoluprace', text: 'Pokud potřebujete dlouhodobý rámec spolupráce, nikoli jednorázové zmocnění.' },
    ],
    faq: [
      { q: 'Kdy je nutné ověřit podpis na plné moci?', a: 'Úřední ověření podpisu (legalizace) je vyžadováno tam, kde to zákon nebo příjemce dokumentu stanoví — typicky při prodeji nemovitostí, zastupování u katastrálního úřadu nebo při bankovních operacích. Pro běžné zastoupení při každodenních jednáních ověření není povinné.' },
      { q: 'Jak dlouho platí plná moc?', a: 'Plná moc platí po dobu uvedenou v dokumentu, nebo do jejího odvolání zmocnitelem. Bez časového omezení platí do odvolání nebo smrti zmocnitele.' },
      { q: 'Může zmocněnec přenést zmocnění na další osobu?', a: 'Pouze pokud to plná moc výslovně umožňuje — tzv. substituce. Bez tohoto ujednání nemůže zmocněnec nikoho dalšího zmocnit.' },
      { q: 'Je generální plná moc riskantní?', a: 'Plná moc s neomezeným rozsahem zmocnění je velmi silný dokument. Doporučujeme vždy přesně vymezit, k jakým jednáním je zmocněnec oprávněn — omezuje se tak riziko zneužití.' },
      { q: 'Dostanu dokument ihned po zaplacení?', a: 'Ano, PDF je k dispozici ke stažení okamžitě po dokončení platby.' },
    ],
    ctaLabel: 'Vytvořit plnou moc',
    formId: 'formular',
    guideHref: '/plna-moc-online',
    guideLabel: 'Průvodce plnou mocí — obecná, ověřená a generální plná moc',
  };

  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200 font-sans pb-24">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08101e]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-sm">SH</div>
            <div><div className="font-bold tracking-tight text-white">SmlouvaHned Builder</div><div className="text-[11px] text-slate-500">Plná moc — § 441 OZ</div></div>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-sm text-slate-400 hover:text-white transition">Zavřít</button>
        </div>
      </header>

      <ContractLandingSection {...landingProps} />

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8" id="formular">
        <div className="mb-6 border-t border-slate-800/60 pt-8">
          <h2 className="text-lg font-black text-white uppercase tracking-wide">Vyplňte údaje dokumentu</h2>
          <p className="text-sm text-slate-500 mt-1">Všechna povinná pole jsou označena *</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">

            <section className={cardClass}>
              <SectionTitle index="01" title="Typ plné moci" subtitle="Vyberte typ — podle toho se přizpůsobí text zmocnění." />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(poaTypeLabels).map(([key, label]) => (
                  <label key={key} className={`cursor-pointer rounded-xl border p-3 text-center text-sm transition ${form.poaType === key ? 'border-amber-500 bg-amber-500/10 text-white font-bold' : 'border-slate-700/60 text-slate-400 hover:border-slate-500'}`}>
                    <input type="radio" name="poaType" value={key} checked={form.poaType === key} onChange={set} className="hidden" />
                    {label}
                  </label>
                ))}
              </div>
            </section>

            {/* Informační panel — úřední ověření podpisu */}
            <div className="flex items-start gap-3 rounded-2xl border border-blue-500/25 bg-blue-500/8 p-5">
              <span className="mt-0.5 flex-shrink-0 text-xl">ℹ️</span>
              <div>
                <div className="mb-1 text-sm font-black text-blue-300">Kdy je potřeba úředně ověřený podpis</div>
                <p className="text-xs leading-relaxed text-blue-100/80">
                  Některé úkony vyžadují úředně ověřený podpis na plné moci — například zastoupení při prodeji nemovitosti, při jednání s katastrem nebo při zastoupení před soudem.
                  Ověření zajistí <strong className="text-blue-200">Czech POINT</strong> nebo <strong className="text-blue-200">notář</strong>.
                  Pokud si nejste jisti, zda váš případ vyžaduje ověření, konzultujte s příslušným úřadem nebo advokátem.
                </p>
              </div>
            </div>

            <section className={cardClass}>
              <SectionTitle index="02" title="Zmocnitel" subtitle="Osoba udělující plnou moc (oprávňující zmocněnce jednat)." />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno / název *"><input className={inputClass} name="principalName" value={form.principalName} onChange={set} placeholder="Jan Novák" /></Field>
                <Field label="Datum nar. / IČO *"><input className={inputClass} name="principalId" value={form.principalId} onChange={set} placeholder="01.01.1970" /></Field>
                <Field label="Trvalé bydliště / sídlo *"><input className={inputClass} name="principalAddress" value={form.principalAddress} onChange={set} placeholder="Ulice 1, Praha 1" /></Field>
                <Field label="E-mail"><input className={inputClass} name="principalEmail" value={form.principalEmail} onChange={set} type="email" placeholder="jan@email.cz" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="03" title="Zmocněnec" subtitle="Osoba, která bude jednat za zmocnitele." />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno / název *"><input className={inputClass} name="agentName" value={form.agentName} onChange={set} placeholder="Marie Nováková" /></Field>
                <Field label="Datum nar. / IČO *"><input className={inputClass} name="agentId" value={form.agentId} onChange={set} placeholder="05.05.1980" /></Field>
                <Field label="Trvalé bydliště / sídlo *"><input className={inputClass} name="agentAddress" value={form.agentAddress} onChange={set} placeholder="Ulice 5, Brno" /></Field>
                <Field label="E-mail"><input className={inputClass} name="agentEmail" value={form.agentEmail} onChange={set} type="email" placeholder="marie@email.cz" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="04" title="Rozsah zmocnění" />
              <div className="space-y-4">
                {form.poaType === 'property' && <Field label="Adresa / specifikace nemovitosti *"><input className={inputClass} name="propertyAddress" value={form.propertyAddress} onChange={set} placeholder="Ulice 10, Praha 6, LV č. 123, KÚ Dejvice" /></Field>}
                {form.poaType === 'court' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Název soudu"><input className={inputClass} name="courtName" value={form.courtName} onChange={set} placeholder="Obvodní soud pro Prahu 1" /></Field>
                    <Field label="Sp. zn. / č.j."><input className={inputClass} name="caseNumber" value={form.caseNumber} onChange={set} placeholder="10 C 123/2026" /></Field>
                  </div>
                )}
                {form.poaType === 'company' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Název firmy"><input className={inputClass} name="companyName" value={form.companyName} onChange={set} placeholder="ABC s.r.o." /></Field>
                    <Field label="IČO firmy"><input className={inputClass} name="companyIco" value={form.companyIco} onChange={set} placeholder="12345678" /></Field>
                    <div className="sm:col-span-2"><Field label="Rozsah jednání"><input className={inputClass} name="companyScope" value={form.companyScope} onChange={set} placeholder="Valná hromada, podepisování smluv, jednání s úřady…" /></Field></div>
                  </div>
                )}
                {form.poaType === 'bank' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Číslo účtu"><input className={inputClass} name="bankAccount" value={form.bankAccount} onChange={set} placeholder="123456789/0800" /></Field>
                    <Field label="Banka"><input className={inputClass} name="bankName" value={form.bankName} onChange={set} placeholder="Česká spořitelna" /></Field>
                  </div>
                )}
                {form.poaType === 'general' && (
                  <Field label="Rozsah zmocnění (popište) *">
                    <textarea className="w-full min-h-[100px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="customScope" value={form.customScope} onChange={set} placeholder="Zastupování při přebírání zásilek, podpis smluv týkajících se…" />
                  </Field>
                )}
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="05" title="Platnost a podmínky" />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="Platná do (prázdné = do odvolání)"><input className={inputClass} name="validUntil" value={form.validUntil} onChange={set} type="date" /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className={`cursor-pointer rounded-xl border p-3 text-sm transition ${form.singleUse ? 'border-amber-500/60 bg-amber-500/8 text-white' : 'border-slate-700/60 text-slate-400 hover:border-slate-500'}`}>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="singleUse" checked={form.singleUse} onChange={set} className="h-4 w-4 accent-amber-500" />
                    <div>
                      <div className="font-semibold text-white">Jednorázová plná moc</div>
                      <div className="text-xs text-slate-400 mt-0.5">Platí jen pro jedno konkrétní jednání</div>
                    </div>
                  </div>
                </label>
                <label className={`cursor-pointer rounded-xl border p-3 text-sm transition ${form.allowSubstitution ? 'border-amber-500/60 bg-amber-500/8 text-white' : 'border-slate-700/60 text-slate-400 hover:border-slate-500'}`}>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="allowSubstitution" checked={form.allowSubstitution} onChange={set} className="h-4 w-4 accent-amber-500" />
                    <div>
                      <div className="font-semibold text-white">Substituce povolena</div>
                      <div className="text-xs text-slate-400 mt-0.5">Zmocněnec smí pověřit třetí osobu</div>
                    </div>
                  </div>
                </label>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="06" title="Výběr balíčku" subtitle="Zvolte úroveň ochrany pro vaši plnou moc." />
              <div className="space-y-3">
                {([
                  { value: 'basic', label: 'Základní dokument', price: '249 Kč', desc: 'Profesionální plná moc dle § 441 OZ v PDF.' },
                  { value: 'professional', label: 'Rozšířený dokument', price: '399 Kč', desc: 'Rozšířené klauzule, odpovědnostní doložky, ověřená verze.', recommended: true },
                  { value: 'complete', label: 'Kompletní balíček', price: '749 Kč', desc: 'Vše z Rozšířeného dokumentu + instrukce k podpisu, checklist a 30denní archivace.' },
                ] as const).map((opt) => (
                  <label key={opt.value} className={`block rounded-2xl border-2 p-4 cursor-pointer transition relative ${form.tier === opt.value ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700/60 bg-[#0c1426]/60 hover:border-slate-600'}`}>
                    {('recommended' in opt) &&  form.tier !== 'professional' && (
                      <div className="absolute -top-2.5 left-4"><span className="rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-black">Doporučeno</span></div>
                    )}
                    <div className="flex items-start gap-3">
                      <input type="radio" name="tier" value={opt.value} checked={form.tier === opt.value}
                        onChange={(e) => setForm((prev) => ({ ...prev, tier: e.target.value as 'basic' | 'professional' | 'complete', notaryUpsell: e.target.value !== 'basic' }))}
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

          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Watermarked document preview */}
            {previewSections.length > 0 && (
              <ContractPreview sections={previewSections} title="Plná moc" />
            )}
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Analýza plné moci</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div><div className={`font-bold ${scoreColor}`}>{risk.label}</div><div className="text-xs text-slate-500">ze 100 bodů</div></div>
              </div>
              {risk.warnings.length === 0 ? <p className="text-sm text-emerald-400">✓ Plná moc je kompletní.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (<li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-amber-500/10 text-amber-300' : w.level === 'medium' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-700/40 text-slate-400'}`}>{w.level === 'high' ? '⚠ ' : w.level === 'medium' ? '▲ ' : '○ '}{w.text}</li>))}</ul>}
            </div>
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Shrnutí</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Plná moc</span><span className="font-bold">249 Kč</span></div>
                {form.notaryUpsell && <div className="flex justify-between"><span className="text-slate-400">Ověřená verze</span><span className="text-amber-400 font-bold">+200 Kč</span></div>}
                <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-lg"><span>Celkem</span><span className="text-amber-400">{form.tier === 'complete' ? '749' : form.tier === 'professional' ? '399' : '249'} Kč</span></div>
              </div>
              {(!form.principalName || !form.agentName) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3 text-xs text-slate-400 space-y-1">
                  <div className="font-semibold mb-1">Před platbou vyplňte:</div>
                  {!form.principalName && <div>• Jméno zmocnitele</div>}
                  {!form.agentName && <div>• Jméno zmocněnce</div>}
                </div>
              )}
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
              <label className="flex items-start gap-3 mt-4 mb-4 cursor-pointer">
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
              <button onClick={handlePayment} disabled={isProcessing || !form.principalName || !form.agentName || !gdprConsent}
                className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.25)] active:scale-[0.98] uppercase tracking-tight disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                    Přesměrování…
                  </span>
                ) : (
                  `Zaplatit ${form.tier === 'complete' ? '749 Kč' : form.tier === 'professional' ? '399 Kč' : '249 Kč'} a stáhnout PDF →`
                )}
              </button>
              <p className="mt-3 text-center text-[11px] text-slate-500">🔒 Zabezpečená platba přes Stripe · PDF ke stažení</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
