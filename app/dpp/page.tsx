'use client';

import { useMemo, useState } from 'react';

type FormData = {
  employerName: string; employerIco: string; employerAddress: string; employerEmail: string;
  employeeName: string; employeeBirth: string; employeeAddress: string; employeeEmail: string;
  taskDescription: string; taskDetails: string; workPlace: string; estimatedHours: string;
  durationType: 'fixed' | 'indefinite'; startDate: string; endDate: string; deadline: string;
  remunerationType: 'fixed' | 'hourly'; totalRemuneration: string; hourlyRate: string;
  paymentAccount: string; paymentDays: string;
  contractDate: string;
  notaryUpsell: boolean;
};

const inputClass = 'w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';
const cardClass = 'bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90">{index}. {title}</div>
      {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
    </div>
  );
}

export default function DppPage() {
  const [form, setForm] = useState<FormData>({
    employerName: '', employerIco: '', employerAddress: '', employerEmail: '',
    employeeName: '', employeeBirth: '', employeeAddress: '', employeeEmail: '',
    taskDescription: '', taskDetails: '', workPlace: '', estimatedHours: '',
    durationType: 'fixed', startDate: '', endDate: '', deadline: '',
    remunerationType: 'fixed', totalRemuneration: '', hourlyRate: '',
    paymentAccount: '', paymentDays: '15',
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
    if (!form.taskDescription) { score -= 25; warnings.push({ text: 'Popis pracovního úkolu je povinný.', level: 'high' }); }
    if (!form.estimatedHours) { score -= 15; warnings.push({ text: 'Chybí počet hodin — limit je 300 hod./rok u jednoho zaměstnavatele.', level: 'medium' }); }
    if (Number(form.estimatedHours) > 300) { score -= 30; warnings.push({ text: 'Počet hodin překračuje zákonný limit 300 hod./rok (§ 75 ZP)!', level: 'high' }); }
    if (!form.totalRemuneration && !form.hourlyRate) { score -= 15; warnings.push({ text: 'Neuvedena odměna.', level: 'medium' }); }
    return { score: Math.max(0, score), warnings, label: score >= 85 ? 'Bez rizik' : score >= 65 ? 'Drobná rizika' : 'Pozor — rizika' };
  }, [form]);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: 'dpp', notaryUpsell: form.notaryUpsell, payload: { ...form, contractType: 'dpp' }, email: form.employerEmail }),
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
              <div className="text-[11px] text-slate-500">Dohoda o provedení práce — § 75 ZP</div>
            </div>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-sm text-slate-400 hover:text-white transition">Zavřít</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">

            <section className={cardClass}>
              <SectionTitle index="01" title="Zaměstnavatel" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Název / jméno *"><input className={inputClass} name="employerName" value={form.employerName} onChange={set} placeholder="ABC s.r.o." /></Field>
                <Field label="IČO *"><input className={inputClass} name="employerIco" value={form.employerIco} onChange={set} placeholder="12345678" /></Field>
                <Field label="Sídlo / adresa *"><input className={inputClass} name="employerAddress" value={form.employerAddress} onChange={set} placeholder="Náměstí 1, Praha 1" /></Field>
                <Field label="E-mail"><input className={inputClass} name="employerEmail" value={form.employerEmail} onChange={set} type="email" placeholder="info@firma.cz" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="02" title="Zaměstnanec (brigádník)" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno a příjmení *"><input className={inputClass} name="employeeName" value={form.employeeName} onChange={set} placeholder="Tomáš Pokorný" /></Field>
                <Field label="Datum narození *"><input className={inputClass} name="employeeBirth" value={form.employeeBirth} onChange={set} placeholder="15.06.2002" /></Field>
                <Field label="Trvalé bydliště *"><input className={inputClass} name="employeeAddress" value={form.employeeAddress} onChange={set} placeholder="Ulice 5, Brno" /></Field>
                <Field label="E-mail"><input className={inputClass} name="employeeEmail" value={form.employeeEmail} onChange={set} type="email" placeholder="tomas@email.cz" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="03" title="Pracovní úkol" subtitle="Popište co nejpřesněji — vyhne se sporům o rozsah a výsledek." />
              <div className="space-y-4">
                <Field label="Druh práce / název úkolu *">
                  <input className={inputClass} name="taskDescription" value={form.taskDescription} onChange={set} placeholder="Obsluha letní akce, roznos letáků, překlad dokumentu…" />
                </Field>
                <Field label="Podrobný popis (nepovinné)">
                  <textarea className="w-full min-h-[80px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="taskDetails" value={form.taskDetails} onChange={set} placeholder="Překlady z angličtiny do češtiny, přibl. 10 000 slov, formát DOCX…" />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Místo výkonu práce"><input className={inputClass} name="workPlace" value={form.workPlace} onChange={set} placeholder="Praha nebo vzdáleně" /></Field>
                  <Field label="Předpokládaný rozsah (hod.) *">
                    <input className={inputClass} name="estimatedHours" value={form.estimatedHours} onChange={set} type="number" placeholder="20" />
                  </Field>
                </div>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="04" title="Trvání a termín splnění" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Typ trvání">
                  <select className={inputClass} name="durationType" value={form.durationType} onChange={set}>
                    <option value="fixed">Na dobu určitou</option>
                    <option value="indefinite">Na dobu neurčitou</option>
                  </select>
                </Field>
                <Field label="Začátek"><input className={inputClass} name="startDate" value={form.startDate} onChange={set} type="date" /></Field>
                {form.durationType === 'fixed' && <Field label="Konec"><input className={inputClass} name="endDate" value={form.endDate} onChange={set} type="date" /></Field>}
                <Field label="Termín splnění úkolu (nejpozději)"><input className={inputClass} name="deadline" value={form.deadline} onChange={set} type="date" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="05" title="Odměna" subtitle="DPP bez odvodů SP/ZP do 10 000 Kč/měsíc u jednoho zaměstnavatele." />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Typ odměny">
                  <select className={inputClass} name="remunerationType" value={form.remunerationType} onChange={set}>
                    <option value="fixed">Paušální (za celý úkol)</option>
                    <option value="hourly">Hodinová sazba</option>
                  </select>
                </Field>
                {form.remunerationType === 'fixed'
                  ? <Field label="Celková odměna (Kč) *"><input className={inputClass} name="totalRemuneration" value={form.totalRemuneration} onChange={set} type="number" placeholder="5000" /></Field>
                  : <Field label="Hodinová sazba (Kč/hod.) *"><input className={inputClass} name="hourlyRate" value={form.hourlyRate} onChange={set} type="number" placeholder="180" /></Field>
                }
                <Field label="Číslo účtu (výplata)"><input className={inputClass} name="paymentAccount" value={form.paymentAccount} onChange={set} placeholder="123456789/0800" /></Field>
                <Field label="Výplata do (dní po splnění)"><input className={inputClass} name="paymentDays" value={form.paymentDays} onChange={set} type="number" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <label className={`flex items-start gap-4 cursor-pointer rounded-2xl border p-5 transition ${form.notaryUpsell ? 'border-amber-500/70 bg-amber-500/10' : 'border-slate-700/60 bg-[#111c31]'}`}>
                <input type="checkbox" name="notaryUpsell" checked={form.notaryUpsell} onChange={set} className="mt-1 h-5 w-5 accent-amber-500" />
                <div className="flex-1">
                  <div className="font-bold text-white">Profesionální ochrana +200 Kč</div>
                  <div className="mt-1 text-sm text-slate-400">Mlčenlivost, ochrana duševního vlastnictví, převod autorských práv. Ideální pro kreativní práce, IT a vývoj.</div>
                </div>
                <div className="text-amber-400 font-bold text-lg">449 Kč</div>
              </label>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Kontrola DPP</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div><div className={`font-bold ${scoreColor}`}>{risk.label}</div><div className="text-xs text-slate-500">ze 100 bodů</div></div>
              </div>
              {risk.warnings.length === 0
                ? <p className="text-sm text-emerald-400">✓ DPP je v pořádku.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (
                    <li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-rose-500/10 text-rose-300' : 'bg-amber-500/10 text-amber-300'}`}>
                      {w.level === 'high' ? '⚠ ' : '▲ '}{w.text}
                    </li>
                  ))}</ul>
              }
            </div>

            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Shrnutí</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Dohoda o provedení práce</span><span className="text-white font-bold">249 Kč</span></div>
                {form.notaryUpsell && <div className="flex justify-between"><span className="text-slate-400">Profesionální ochrana</span><span className="text-amber-400 font-bold">+200 Kč</span></div>}
                <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-lg"><span>Celkem</span><span className="text-amber-400">{form.notaryUpsell ? '449' : '249'} Kč</span></div>
              </div>
              {(!form.employerName || !form.employeeName || !form.taskDescription) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-300 space-y-1">
                  <div className="font-semibold mb-1">Před platbou vyplňte:</div>
                  {!form.employerName && <div>• Název zaměstnavatele</div>}
                  {!form.employeeName && <div>• Jméno zaměstnance</div>}
                  {!form.taskDescription && <div>• Popis pracovního úkolu</div>}
                </div>
              )}
              <button onClick={handlePayment} disabled={isProcessing || !form.employerName || !form.employeeName || !form.taskDescription}
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
