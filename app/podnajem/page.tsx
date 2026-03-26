'use client';

import { useMemo, useState } from 'react';

type FormData = {
  landlordName: string; landlordId: string; landlordAddress: string; landlordEmail: string;
  tenantName: string; tenantId: string; tenantAddress: string; tenantEmail: string;
  flatAddress: string; flatLayout: string; flatUnitNumber: string; cadastralArea: string; floor: string; subleaseArea: string;
  landlordConsent: 'yes' | 'no'; consentDate: string; mainLeaseDate: string;
  startDate: string; duration: 'fixed' | 'indefinite'; endDate: string; noticePeriod: string;
  rentAmount: string; utilityAmount: string; depositAmount: string; paymentDay: string; bankAccount: string;
  maxOccupants: string; allowPets: boolean; allowSmoking: boolean; allowAirbnb: boolean;
  handoverDate: string; keysCount: string; equipmentList: string; knownDefects: string;
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
function Toggle({ name, checked, label, hint, onChange }: { name: string; checked: boolean; label: string; hint?: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className={`block rounded-2xl border p-4 cursor-pointer transition ${checked ? 'border-amber-500/70 bg-amber-500/10' : 'border-slate-700/80 bg-[#111c31]'}`}>
      <div className="flex items-start gap-3">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="mt-1 h-5 w-5 accent-amber-500" />
        <div><div className="text-sm font-semibold text-white">{label}</div>{hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}</div>
      </div>
    </label>
  );
}

export default function PodnajemPage() {
  const [form, setForm] = useState<FormData>({
    landlordName: '', landlordId: '', landlordAddress: '', landlordEmail: '',
    tenantName: '', tenantId: '', tenantAddress: '', tenantEmail: '',
    flatAddress: '', flatLayout: '', flatUnitNumber: '', cadastralArea: '', floor: '', subleaseArea: '',
    landlordConsent: 'yes', consentDate: '', mainLeaseDate: '',
    startDate: '', duration: 'fixed', endDate: '', noticePeriod: '3',
    rentAmount: '', utilityAmount: '', depositAmount: '', paymentDay: '15', bankAccount: '',
    maxOccupants: '2', allowPets: false, allowSmoking: false, allowAirbnb: false,
    handoverDate: '', keysCount: '1', equipmentList: '', knownDefects: '',
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
    if (form.landlordConsent !== 'yes') { score -= 30; warnings.push({ text: 'Bez souhlasu pronajímatele je podnájem nezákonný (§ 2274 OZ)!', level: 'high' }); }
    if (!form.flatAddress) { score -= 15; warnings.push({ text: 'Chybí adresa podnajímaného prostoru.', level: 'high' }); }
    if (!form.rentAmount) { score -= 15; warnings.push({ text: 'Neuvedena výše podnájemného.', level: 'high' }); }
    if (form.allowAirbnb) { score -= 25; warnings.push({ text: 'Přepodnájem přes Airbnb je vysoce rizikový a může být zákonem zakázán.', level: 'high' }); }
    if (!form.depositAmount) { score -= 8; warnings.push({ text: 'Doporučujeme vyžadovat kauci (ideálně 3× nájemné).', level: 'medium' }); }
    return { score: Math.max(0, score), warnings, label: score >= 85 ? 'Silná ochrana' : score >= 65 ? 'Průměrná ochrana' : 'Rizika — doplňte' };
  }, [form]);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: 'sublease', notaryUpsell: form.notaryUpsell, payload: { ...form, contractType: 'sublease' }, email: form.landlordEmail }),
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
            <div><div className="font-bold tracking-tight text-white">SmlouvaHned Builder</div><div className="text-[11px] text-slate-500">Podnájemní smlouva — § 2274 OZ</div></div>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-sm text-slate-400 hover:text-white transition">Zavřít</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">

            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-sm text-amber-200">
              <strong>⚠ Důležité:</strong> Podnájem bytu bez souhlasu pronajímatele (vlastníka) je zakázán (§ 2274 OZ). Souhlas si zajistěte před podpisem.
            </div>

            <section className={cardClass}>
              <SectionTitle index="01" title="Souhlas pronajímatele" subtitle="Povinný dokument pro zákonný podnájem bytu." />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Souhlas pronajímatele">
                  <select className={inputClass} name="landlordConsent" value={form.landlordConsent} onChange={set}>
                    <option value="yes">Ano, mám písemný souhlas</option>
                    <option value="no">Zatím nemám (budu zajišťovat)</option>
                  </select>
                </Field>
                {form.landlordConsent === 'yes' && <Field label="Datum souhlasu"><input className={inputClass} name="consentDate" value={form.consentDate} onChange={set} type="date" /></Field>}
                <Field label="Datum hlavní nájemní smlouvy"><input className={inputClass} name="mainLeaseDate" value={form.mainLeaseDate} onChange={set} type="date" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="02" title="Nájemce (podnajímatel)" subtitle="Osoba, která má byt pronajatý a chce ho dál podnajmout." />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno / název *"><input className={inputClass} name="landlordName" value={form.landlordName} onChange={set} placeholder="Karel Novotný" /></Field>
                <Field label="Datum nar. / IČO *"><input className={inputClass} name="landlordId" value={form.landlordId} onChange={set} placeholder="01.01.1985" /></Field>
                <Field label="Adresa *"><input className={inputClass} name="landlordAddress" value={form.landlordAddress} onChange={set} placeholder="Ulice 3, Praha 2" /></Field>
                <Field label="E-mail"><input className={inputClass} name="landlordEmail" value={form.landlordEmail} onChange={set} type="email" placeholder="karel@email.cz" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="03" title="Podnájemce" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno / název *"><input className={inputClass} name="tenantName" value={form.tenantName} onChange={set} placeholder="Lucie Veselá" /></Field>
                <Field label="Datum nar. / IČO *"><input className={inputClass} name="tenantId" value={form.tenantId} onChange={set} placeholder="15.05.1995" /></Field>
                <Field label="Adresa *"><input className={inputClass} name="tenantAddress" value={form.tenantAddress} onChange={set} placeholder="Dočasně, Ulice 3, Praha 2" /></Field>
                <Field label="E-mail"><input className={inputClass} name="tenantEmail" value={form.tenantEmail} onChange={set} type="email" placeholder="lucie@email.cz" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="04" title="Podnajímaný prostor" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Adresa bytu *"><input className={inputClass} name="flatAddress" value={form.flatAddress} onChange={set} placeholder="Ulice 3, Praha 2" /></Field>
                <Field label="Dispozice"><input className={inputClass} name="flatLayout" value={form.flatLayout} onChange={set} placeholder="2+kk" /></Field>
                <Field label="Číslo jednotky"><input className={inputClass} name="flatUnitNumber" value={form.flatUnitNumber} onChange={set} placeholder="15" /></Field>
                <Field label="Katastrální území"><input className={inputClass} name="cadastralArea" value={form.cadastralArea} onChange={set} placeholder="Vinohrady" /></Field>
                <Field label="Podlaží"><input className={inputClass} name="floor" value={form.floor} onChange={set} placeholder="3" /></Field>
                <Field label="Plocha (m²)"><input className={inputClass} name="subleaseArea" value={form.subleaseArea} onChange={set} placeholder="52" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="05" title="Doba podnájmu" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Typ"><select className={inputClass} name="duration" value={form.duration} onChange={set}><option value="fixed">Na dobu určitou</option><option value="indefinite">Na dobu neurčitou</option></select></Field>
                <Field label="Začátek podnájmu *"><input className={inputClass} name="startDate" value={form.startDate} onChange={set} type="date" /></Field>
                {form.duration === 'fixed' && <Field label="Konec podnájmu *"><input className={inputClass} name="endDate" value={form.endDate} onChange={set} type="date" /></Field>}
                {form.duration === 'indefinite' && <Field label="Výpovědní doba (měsíce)"><input className={inputClass} name="noticePeriod" value={form.noticePeriod} onChange={set} type="number" /></Field>}
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="06" title="Podnájemné a platby" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Měsíční podnájemné (Kč) *"><input className={inputClass} name="rentAmount" value={form.rentAmount} onChange={set} type="number" placeholder="12000" /></Field>
                <Field label="Záloha na služby (Kč)"><input className={inputClass} name="utilityAmount" value={form.utilityAmount} onChange={set} type="number" placeholder="2000" /></Field>
                <Field label="Kauce (Kč)"><input className={inputClass} name="depositAmount" value={form.depositAmount} onChange={set} type="number" placeholder="24000" /></Field>
                <Field label="Splatnost (den v měsíci)"><input className={inputClass} name="paymentDay" value={form.paymentDay} onChange={set} type="number" /></Field>
                <Field label="Číslo účtu (nájemce)"><input className={inputClass} name="bankAccount" value={form.bankAccount} onChange={set} placeholder="123456789/0800" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="07" title="Pravidla podnájmu" />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="Max. počet osob"><input className={inputClass} name="maxOccupants" value={form.maxOccupants} onChange={set} type="number" /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Toggle name="allowPets" checked={form.allowPets} label="Domácí zvířata povolena" onChange={set} />
                <Toggle name="allowSmoking" checked={form.allowSmoking} label="Kouření povoleno" onChange={set} />
                <Toggle name="allowAirbnb" checked={form.allowAirbnb} label="Airbnb / přepodnájem" hint="Vysoce rizikové — bez souhlasu vlastníka zakázáno" onChange={set} />
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="08" title="Předání prostoru" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Datum předání"><input className={inputClass} name="handoverDate" value={form.handoverDate} onChange={set} type="date" /></Field>
                <Field label="Počet klíčů"><input className={inputClass} name="keysCount" value={form.keysCount} onChange={set} type="number" /></Field>
                <div className="sm:col-span-2"><Field label="Předávané vybavení"><textarea className="w-full min-h-[70px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="equipmentList" value={form.equipmentList} onChange={set} placeholder="Postel, stůl, skříň…" /></Field></div>
                <div className="sm:col-span-2"><Field label="Známé vady / poznámky"><input className={inputClass} name="knownDefects" value={form.knownDefects} onChange={set} placeholder="Bez vad / drobné škrábance na podlaze…" /></Field></div>
              </div>
            </section>

            <section className={cardClass}>
              <label className={`flex items-start gap-4 cursor-pointer rounded-2xl border p-5 transition ${form.notaryUpsell ? 'border-amber-500/70 bg-amber-500/10' : 'border-slate-700/60 bg-[#111c31]'}`}>
                <input type="checkbox" name="notaryUpsell" checked={form.notaryUpsell} onChange={set} className="mt-1 h-5 w-5 accent-amber-500" />
                <div className="flex-1"><div className="font-bold text-white">Profesionální ochrana +200 Kč</div><div className="mt-1 text-sm text-slate-400">Vztah k hlavní nájemní smlouvě, smluvní pokuta, datum notářského souhlasu.</div></div>
                <div className="text-amber-400 font-bold text-lg">449 Kč</div>
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
              {risk.warnings.length === 0 ? <p className="text-sm text-emerald-400">✓ Podnájemní smlouva je v pořádku.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (<li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-rose-500/10 text-rose-300' : 'bg-amber-500/10 text-amber-300'}`}>{w.level === 'high' ? '⚠ ' : '▲ '}{w.text}</li>))}</ul>}
            </div>
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Shrnutí</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Podnájemní smlouva</span><span className="font-bold">249 Kč</span></div>
                {form.notaryUpsell && <div className="flex justify-between"><span className="text-slate-400">Profesionální ochrana</span><span className="text-amber-400 font-bold">+200 Kč</span></div>}
                <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-lg"><span>Celkem</span><span className="text-amber-400">{form.notaryUpsell ? '449' : '249'} Kč</span></div>
              </div>
              {(!form.landlordName || !form.tenantName || !form.flatAddress) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-300 space-y-1">
                  <div className="font-semibold mb-1">Před platbou vyplňte:</div>
                  {!form.landlordName && <div>• Jméno nájemce (podnajímatele)</div>}
                  {!form.tenantName && <div>• Jméno podnájemce</div>}
                  {!form.flatAddress && <div>• Adresa bytu</div>}
                </div>
              )}
              <button onClick={handlePayment} disabled={isProcessing || !form.landlordName || !form.tenantName || !form.flatAddress}
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
