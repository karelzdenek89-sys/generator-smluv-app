'use client';

import { useMemo, useState } from 'react';

type FormData = {
  principalName: string; principalId: string; principalAddress: string; principalEmail: string;
  agentName: string; agentId: string; agentAddress: string; agentEmail: string;
  poaType: 'general' | 'property' | 'court' | 'company' | 'bank';
  propertyAddress: string; courtName: string; caseNumber: string;
  companyName: string; companyIco: string; companyScope: string; bankAccount: string; bankName: string;
  customScope: string;
  validUntil: string; singleUse: boolean; allowSubstitution: boolean;
  contractDate: string; notaryUpsell: boolean;
};

const inputClass = 'w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';
const cardClass = 'bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>{children}</div>);
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
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const risk = useMemo(() => {
    let score = 100;
    const warnings: { text: string; level: 'high' | 'medium' | 'low' }[] = [];
    if (!form.principalName || !form.principalId) { score -= 20; warnings.push({ text: 'Chybí identifikace zmocnitele.', level: 'high' }); }
    if (!form.agentName || !form.agentId) { score -= 20; warnings.push({ text: 'Chybí identifikace zmocněnce.', level: 'high' }); }
    if (form.poaType === 'general' && !form.customScope) { score -= 25; warnings.push({ text: 'Rozsah zmocnění není specifikován.', level: 'high' }); }
    if (!form.validUntil && !form.singleUse) { score -= 5; warnings.push({ text: 'Platnost plné moci není omezena (platí do odvolání).', level: 'low' }); }
    if (form.notaryUpsell === false && (form.poaType === 'property' || form.poaType === 'company')) {
      score -= 10; warnings.push({ text: 'Pro nemovitosti a firmy doporučujeme úředně ověřený podpis (ověřená plná moc).', level: 'medium' });
    }
    return { score: Math.max(0, score), warnings, label: score >= 85 ? 'Kompletní plná moc' : score >= 65 ? 'Doplňte' : 'Neúplná' };
  }, [form]);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: 'power_of_attorney', notaryUpsell: form.notaryUpsell, payload: { ...form, contractType: 'power_of_attorney' }, email: form.principalEmail }),
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

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
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
                <Field label="Platná do (datum, nebo ponechat prázdné = do odvolání)"><input className={inputClass} name="validUntil" value={form.validUntil} onChange={set} type="date" /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className={`cursor-pointer rounded-xl border p-4 transition ${form.singleUse ? 'border-amber-500/70 bg-amber-500/10' : 'border-slate-700/60 bg-[#111c31]'}`}>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" name="singleUse" checked={form.singleUse} onChange={set} className="mt-1 h-4 w-4 accent-amber-500" />
                    <div className="text-sm"><div className="font-semibold text-white">Jednorázová plná moc</div><div className="text-xs text-slate-400 mt-1">Zaniká po provedení úkonu</div></div>
                  </div>
                </label>
                <label className={`cursor-pointer rounded-xl border p-4 transition ${form.allowSubstitution ? 'border-amber-500/70 bg-amber-500/10' : 'border-slate-700/60 bg-[#111c31]'}`}>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" name="allowSubstitution" checked={form.allowSubstitution} onChange={set} className="mt-1 h-4 w-4 accent-amber-500" />
                    <div className="text-sm"><div className="font-semibold text-white">Povolena substituce</div><div className="text-xs text-slate-400 mt-1">Zmocněnec může dále zmocnit</div></div>
                  </div>
                </label>
              </div>
            </section>

            <section className={cardClass}>
              <label className={`flex items-start gap-4 cursor-pointer rounded-2xl border p-5 transition ${form.notaryUpsell ? 'border-amber-500/70 bg-amber-500/10' : 'border-slate-700/60 bg-[#111c31]'}`}>
                <input type="checkbox" name="notaryUpsell" checked={form.notaryUpsell} onChange={set} className="mt-1 h-5 w-5 accent-amber-500" />
                <div className="flex-1">
                  <div className="font-bold text-white">Prémiový balíček +299 Kč — Ověřená plná moc</div>
                  <div className="mt-1 text-sm text-slate-400">Verze s doložkou pro úřední ověření podpisu (Czech Point, notář). Nutné pro nemovitosti, soudy a finanční instituce.</div>
                </div>
                <div className="text-amber-400 font-bold text-lg">598 Kč</div>
              </label>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Analýza plné moci</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div><div className={`font-bold ${scoreColor}`}>{risk.label}</div><div className="text-xs text-slate-500">ze 100 bodů</div></div>
              </div>
              {risk.warnings.length === 0 ? <p className="text-sm text-emerald-400">✓ Plná moc je kompletní.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (<li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-rose-500/10 text-rose-300' : w.level === 'medium' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-700/40 text-slate-400'}`}>{w.level === 'high' ? '⚠ ' : w.level === 'medium' ? '▲ ' : '○ '}{w.text}</li>))}</ul>}
            </div>
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Shrnutí</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Plná moc</span><span className="font-bold">299 Kč</span></div>
                {form.notaryUpsell && <div className="flex justify-between"><span className="text-slate-400">Ověřená verze</span><span className="text-amber-400 font-bold">+299 Kč</span></div>}
                <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-lg"><span>Celkem</span><span className="text-amber-400">{form.notaryUpsell ? '598' : '299'} Kč</span></div>
              </div>
              <button onClick={handlePayment} disabled={isProcessing || !form.principalName || !form.agentName}
                className="mt-5 w-full rounded-2xl bg-amber-500 px-6 py-4 font-bold text-slate-900 text-lg hover:bg-amber-400 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed">
                {isProcessing ? 'Přesměrování…' : 'Zaplatit a stáhnout PDF →'}
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">Platba kartou přes Stripe · PDF ihned</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
