'use client';

import { useMemo, useState } from 'react';

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
};

const inputClass = 'w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';
const cardClass = 'bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>{children}</div>);
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
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const risk = useMemo(() => {
    let score = 100;
    const warnings: { text: string; level: 'high' | 'medium' | 'low' }[] = [];
    if (!form.cooperationScope) { score -= 25; warnings.push({ text: 'Chybí předmět spolupráce — nejdůležitější část smlouvy.', level: 'high' }); }
    if (!form.partyAContribution || !form.partyBContribution) { score -= 15; warnings.push({ text: 'Neuvedeny příspěvky stran — může způsobit spory.', level: 'medium' }); }
    if (form.revenueModel === 'revenue_share' && Number(form.revenueShareA) + Number(form.revenueShareB) !== 100) { score -= 10; warnings.push({ text: 'Součet podílů na výnosech není 100 %.', level: 'high' }); }
    if (!form.notaryUpsell) { score -= 8; warnings.push({ text: 'Bez mlčenlivosti a zákazu konkurence hrozí zneužití informací.', level: 'medium' }); }
    return { score: Math.max(0, score), warnings, label: score >= 85 ? 'Silná smlouva' : score >= 65 ? 'Průměrná ochrana' : 'Doplňte údaje' };
  }, [form]);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: 'cooperation', notaryUpsell: form.notaryUpsell, payload: { ...form, contractType: 'cooperation' }, email: form.partyAEmail }),
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

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">

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
                  <select className={inputClass} name="revenueModel" value={form.revenueModel} onChange={set}>
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
                  <select className={inputClass} name="ipSharing" value={form.ipSharing} onChange={set}>
                    <option value="joint">Společné vlastnictví (50/50)</option>
                    <option value="partyA">Náleží Straně A</option>
                    <option value="separate">Každý vlastní, co vytvořil</option>
                  </select>
                </Field>
                <Field label="Koordinátor (nepovinné)"><input className={inputClass} name="coordinatorName" value={form.coordinatorName} onChange={set} placeholder="Jan Novák" /></Field>
                <Field label="Trvání smlouvy">
                  <select className={inputClass} name="durationType" value={form.durationType} onChange={set}>
                    <option value="indefinite">Na dobu neurčitou</option>
                    <option value="fixed">Na dobu určitou</option>
                  </select>
                </Field>
                {form.durationType === 'fixed' ? <Field label="Konec smlouvy"><input className={inputClass} name="endDate" value={form.endDate} onChange={set} type="date" /></Field> : <Field label="Výpovědní doba (měsíce)"><input className={inputClass} name="noticePeriod" value={form.noticePeriod} onChange={set} type="number" /></Field>}
              </div>
            </section>

            <section className={cardClass}>
              <label className={`flex items-start gap-4 cursor-pointer rounded-2xl border p-5 transition ${form.notaryUpsell ? 'border-amber-500/70 bg-amber-500/10' : 'border-slate-700/60 bg-[#111c31]'}`}>
                <input type="checkbox" name="notaryUpsell" checked={form.notaryUpsell} onChange={set} className="mt-1 h-5 w-5 accent-amber-500" />
                <div className="flex-1">
                  <div className="font-bold text-white">Prémiový balíček +299 Kč</div>
                  <div className="mt-1 text-sm text-slate-400">Mlčenlivost s pokutou 100 000 Kč, zákaz přetahování klientů a zaměstnanců, rozhodčí doložka pro rychlé řešení sporů.</div>
                </div>
                <div className="text-amber-400 font-bold text-lg">598 Kč</div>
              </label>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
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
                <div className="flex justify-between"><span className="text-slate-400">Smlouva o spolupráci</span><span className="font-bold">299 Kč</span></div>
                {form.notaryUpsell && <div className="flex justify-between"><span className="text-slate-400">Prémiový balíček</span><span className="text-amber-400 font-bold">+299 Kč</span></div>}
                <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-lg"><span>Celkem</span><span className="text-amber-400">{form.notaryUpsell ? '598' : '299'} Kč</span></div>
              </div>
              {(!form.partyAName || !form.partyBName || !form.cooperationScope) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-300 space-y-1">
                  <div className="font-semibold mb-1">Před platbou vyplňte:</div>
                  {!form.partyAName && <div>• Jméno strany A</div>}
                  {!form.partyBName && <div>• Jméno strany B</div>}
                  {!form.cooperationScope && <div>• Předmět spolupráce</div>}
                </div>
              )}
              <button onClick={handlePayment} disabled={isProcessing || !form.partyAName || !form.partyBName || !form.cooperationScope}
                className="mt-4 w-full rounded-2xl bg-amber-500 px-6 py-4 font-bold text-slate-900 text-lg hover:bg-amber-400 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed">
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
