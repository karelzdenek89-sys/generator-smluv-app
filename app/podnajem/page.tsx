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
  tier: 'basic' | 'professional' | 'complete';
};

const inputClass = 'w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';
const textareaClass = 'w-full min-h-[100px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';
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
        <div>
          <div className="text-sm font-semibold text-white">{label}</div>
          {hint && <div className="mt-1 text-xs leading-relaxed text-slate-400">{hint}</div>}
        </div>
      </div>
    </label>
  );
}

export default function PodnajemuPage() {
  const [form, setForm] = useState<FormData>({
    landlordName: '', landlordId: '', landlordAddress: '', landlordEmail: '',
    tenantName: '', tenantId: '', tenantAddress: '', tenantEmail: '',
    flatAddress: '', flatLayout: '', flatUnitNumber: '', cadastralArea: '', floor: '', subleaseArea: '',
    landlordConsent: 'yes', consentDate: '', mainLeaseDate: '',
    startDate: '', duration: 'fixed', endDate: '', noticePeriod: '3',
    rentAmount: '', utilityAmount: '', depositAmount: '', paymentDay: '15', bankAccount: '',
    maxOccupants: '2', allowPets: false, allowSmoking: false, allowAirbnb: false,
    handoverDate: '', keysCount: '2', equipmentList: '', knownDefects: '',
    contractDate: '', notaryUpsell: false,
    tier: 'basic',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const risk = useMemo(() => {
    let score = 100;
    const warnings: { text: string; level: 'high' | 'medium' | 'low' }[] = [];

    if (!form.landlordId || !form.tenantId) {
      score -= 15;
      warnings.push({ text: 'Chybí rodná čísla / data narození smluvních stran. Bez nich je vymahatelnost oslabena.', level: 'high' });
    }
    if (form.landlordConsent === 'no') {
      score -= 30;
      warnings.push({ text: 'Podnájem bez souhlasu pronajímatele je protiprávní a může vést k výpovědi hlavního nájmu.', level: 'high' });
    }
    if (!form.consentDate) {
      score -= 8;
      warnings.push({ text: 'Chybí datum souhlasu pronajímatele k podnájmu.', level: 'medium' });
    }
    if (form.duration === 'fixed' && !form.endDate) {
      score -= 10;
      warnings.push({ text: 'U doby určité chybí datum konce podnájmu.', level: 'high' });
    }
    if (!form.depositAmount || Number(form.depositAmount) < Number(form.rentAmount)) {
      score -= 10;
      warnings.push({ text: 'Kauce je nižší než měsíční nájemné. To je slabší ochrana pro podnajímatele.', level: 'medium' });
    }
    if (form.allowAirbnb) {
      score -= 20;
      warnings.push({ text: 'Povolení dalšího podnájmu / Airbnb je rizikové a může porušovat podmínky hlavní nájemní smlouvy.', level: 'high' });
    }
    if (!form.flatUnitNumber || !form.cadastralArea) {
      score -= 8;
      warnings.push({ text: 'Byt není dostatečně identifikován (číslo jednotky / katastrální území).', level: 'medium' });
    }
    score = Math.max(0, Math.min(100, score));
    return {
      score,
      warnings,
      label: score >= 85 ? 'Silná ochrana' : score >= 65 ? 'Průměrná ochrana' : 'Slabší ochrana',
    };
  }, [form]);

  const scoreColor = risk.score >= 85 ? 'text-emerald-400' : risk.score >= 65 ? 'text-amber-400' : 'text-rose-400';

  const handlePayment = async () => {
    const required = [
      { field: form.landlordName, msg: 'Jméno podnajímatele' },
      { field: form.tenantName, msg: 'Jméno podnájemce' },
      { field: form.flatAddress, msg: 'Adresa bytu' },
      { field: form.rentAmount, msg: 'Výše nájemného' },
      { field: form.startDate, msg: 'Datum začátku podnájmu' },
    ];
    const missing = required.filter((r) => !r.field.trim()).map((r) => r.msg);
    if (form.duration === 'fixed' && !form.endDate) missing.push('Datum konce podnájmu');
    if (!gdprConsent) { alert('Pro pokračování je nutný souhlas se zpracováním osobních údajů.'); return; }
    if (missing.length > 0) { alert(`Vyplňte prosím: ${missing.join(', ')}`); return; }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType: 'sublease',
          tier: form.tier,
          notaryUpsell: form.tier !== 'basic',
          payload: { ...form, contractType: 'sublease' },
          email: form.landlordEmail || form.tenantEmail || undefined,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || 'Nepodařilo se vytvořit platbu.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Chyba při zpracování platby.');
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080f1e] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#080f1e]/95 backdrop-blur border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a href="/" className="text-amber-400 font-black text-lg tracking-tight">SmlouvaHned.cz</a>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:block">Podnájemní smlouva</span>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
              {form.tier === 'complete' ? '749 Kč' : form.tier === 'professional' ? '449 Kč' : '249 Kč'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        {/* Hero */}
        <div className="mb-10">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/80 mb-2">Generátor smluv</div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Podnájemní smlouva</h1>
          <p className="text-slate-400 max-w-xl">Vyplňte formulář a získejte právně závaznou podnájemní smlouvu dle § 2274 a násl. OZ. PDF ke stažení ihned po zaplacení.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left column – form */}
          <div className="lg:col-span-7 space-y-6">

            {/* 01 Podnajímatel */}
            <section className={cardClass}>
              <SectionTitle index="01" title="Podnajímatel" subtitle="Osoba, která podnajímá byt (nájemce z hlavní nájemní smlouvy)." />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno a příjmení *"><input name="landlordName" value={form.landlordName} onChange={handleChange} placeholder="Jan Novák" className={inputClass} /></Field>
                <Field label="Rodné číslo / datum nar."><input name="landlordId" value={form.landlordId} onChange={handleChange} placeholder="850101/1234" className={inputClass} /></Field>
                <Field label="Trvalé bydliště"><input name="landlordAddress" value={form.landlordAddress} onChange={handleChange} placeholder="Náměstí Míru 1, Praha 2" className={inputClass} /></Field>
                <Field label="E-mail"><input name="landlordEmail" type="email" value={form.landlordEmail} onChange={handleChange} placeholder="jan.novak@email.cz" className={inputClass} /></Field>
              </div>
            </section>

            {/* 02 Podnájemce */}
            <section className={cardClass}>
              <SectionTitle index="02" title="Podnájemce" subtitle="Osoba, která si byt pronajímá od podnajímatele." />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno a příjmení *"><input name="tenantName" value={form.tenantName} onChange={handleChange} placeholder="Petra Svobodová" className={inputClass} /></Field>
                <Field label="Rodné číslo / datum nar."><input name="tenantId" value={form.tenantId} onChange={handleChange} placeholder="900315/5678" className={inputClass} /></Field>
                <Field label="Trvalé bydliště"><input name="tenantAddress" value={form.tenantAddress} onChange={handleChange} placeholder="Dlouhá 5, Brno" className={inputClass} /></Field>
                <Field label="E-mail"><input name="tenantEmail" type="email" value={form.tenantEmail} onChange={handleChange} placeholder="petra@email.cz" className={inputClass} /></Field>
              </div>
            </section>

            {/* 03 Nemovitost */}
            <section className={cardClass}>
              <SectionTitle index="03" title="Předmět podnájmu" subtitle="Přesná identifikace bytu dle katastru nemovitostí." />
              <div className="space-y-4">
                <Field label="Adresa bytu *"><input name="flatAddress" value={form.flatAddress} onChange={handleChange} placeholder="Václavské náměstí 10, Praha 1, PSČ 110 00" className={inputClass} /></Field>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="Dispozice"><input name="flatLayout" value={form.flatLayout} onChange={handleChange} placeholder="2+1" className={inputClass} /></Field>
                  <Field label="Číslo jednotky"><input name="flatUnitNumber" value={form.flatUnitNumber} onChange={handleChange} placeholder="10/3" className={inputClass} /></Field>
                  <Field label="Podlaží"><input name="floor" value={form.floor} onChange={handleChange} placeholder="3. patro" className={inputClass} /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Katastrální území"><input name="cadastralArea" value={form.cadastralArea} onChange={handleChange} placeholder="Nové Město" className={inputClass} /></Field>
                  <Field label="Plocha podnájmu (m²)"><input name="subleaseArea" value={form.subleaseArea} onChange={handleChange} placeholder="52" className={inputClass} /></Field>
                </div>
              </div>
            </section>

            {/* 04 Souhlas pronajímatele */}
            <section className={cardClass}>
              <SectionTitle index="04" title="Souhlas pronajímatele" subtitle="Podnájem bytu vyžaduje souhlas vlastníka / hlavního pronajímatele dle § 2274 OZ." />
              <div className="space-y-4">
                <Field label="Souhlas pronajímatele byl udělen?">
                  <select name="landlordConsent" value={form.landlordConsent} onChange={handleChange} className={inputClass}>
                    <option value="yes">Ano, souhlas byl udělen</option>
                    <option value="no">Ne (pozor – podnájem bez souhlasu je protiprávní)</option>
                  </select>
                </Field>
                {form.landlordConsent === 'yes' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Datum udělení souhlasu"><input name="consentDate" type="date" value={form.consentDate} onChange={handleChange} className={inputClass} /></Field>
                    <Field label="Datum hlavní nájemní smlouvy"><input name="mainLeaseDate" type="date" value={form.mainLeaseDate} onChange={handleChange} className={inputClass} /></Field>
                  </div>
                )}
                {form.landlordConsent === 'no' && (
                  <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-300">
                    ⚠ Podnájem bez souhlasu pronajímatele je porušením hlavní nájemní smlouvy a může vést k výpovědi nebo soudnímu sporu. Doporučujeme souhlas zajistit předem.
                  </div>
                )}
              </div>
            </section>

            {/* 05 Doba podnájmu */}
            <section className={cardClass}>
              <SectionTitle index="05" title="Doba podnájmu" />
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Typ doby">
                    <select name="duration" value={form.duration} onChange={handleChange} className={inputClass}>
                      <option value="fixed">Doba určitá</option>
                      <option value="indefinite">Doba neurčitá</option>
                    </select>
                  </Field>
                  <Field label="Výpovědní lhůta (měsíce)"><input name="noticePeriod" type="number" min="1" value={form.noticePeriod} onChange={handleChange} placeholder="3" className={inputClass} /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Začátek podnájmu *"><input name="startDate" type="date" value={form.startDate} onChange={handleChange} className={inputClass} /></Field>
                  {form.duration === 'fixed' && (
                    <Field label="Konec podnájmu *"><input name="endDate" type="date" value={form.endDate} onChange={handleChange} className={inputClass} /></Field>
                  )}
                </div>
                <Field label="Datum předání bytu"><input name="handoverDate" type="date" value={form.handoverDate} onChange={handleChange} className={inputClass} /></Field>
              </div>
            </section>

            {/* 06 Platby */}
            <section className={cardClass}>
              <SectionTitle index="06" title="Nájemné a platby" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nájemné (Kč/měsíc) *"><input name="rentAmount" type="number" value={form.rentAmount} onChange={handleChange} placeholder="12 000" className={inputClass} /></Field>
                <Field label="Zálohy na služby (Kč/měsíc)"><input name="utilityAmount" type="number" value={form.utilityAmount} onChange={handleChange} placeholder="2 000" className={inputClass} /></Field>
                <Field label="Kauce (Kč)"><input name="depositAmount" type="number" value={form.depositAmount} onChange={handleChange} placeholder="24 000" className={inputClass} /></Field>
                <Field label="Den splatnosti (1–31)"><input name="paymentDay" type="number" min="1" max="31" value={form.paymentDay} onChange={handleChange} placeholder="15" className={inputClass} /></Field>
                <Field label="Číslo účtu pronajímatele (IBAN/CZ)"><input name="bankAccount" value={form.bankAccount} onChange={handleChange} placeholder="CZ65 0800 0000 1920 0014 5399" className={inputClass} /></Field>
              </div>
              {form.rentAmount && (
                <div className="mt-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 px-4 py-3 text-sm text-amber-300">
                  Celkem měsíčně: <strong>{(Number(form.rentAmount) + Number(form.utilityAmount || 0)).toLocaleString('cs-CZ')} Kč</strong>
                </div>
              )}
            </section>

            {/* 07 Podmínky */}
            <section className={cardClass}>
              <SectionTitle index="07" title="Podmínky podnájmu" />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="Max. počet osob v bytě"><input name="maxOccupants" type="number" min="1" value={form.maxOccupants} onChange={handleChange} placeholder="2" className={inputClass} /></Field>
                <Field label="Počet klíčů předaných podnájemci"><input name="keysCount" type="number" min="1" value={form.keysCount} onChange={handleChange} placeholder="2" className={inputClass} /></Field>
              </div>
              <div className="space-y-3">
                <Toggle name="allowPets" checked={form.allowPets} onChange={handleChange} label="Zvířata povolena" hint="Povoluje chov domácích zvířat v bytě." />
                <Toggle name="allowSmoking" checked={form.allowSmoking} onChange={handleChange} label="Kouření povoleno" hint="Podnájemce smí kouřit v prostorách bytu." />
                <Toggle name="allowAirbnb" checked={form.allowAirbnb} onChange={handleChange} label="Krátkodobý pronájem (Airbnb) povolen" hint="Podnájemce smí dále podnajímat byt třetím osobám. Vyžaduje souhlas vlastníka." />
              </div>
            </section>

            {/* 08 Předávací protokol */}
            <section className={cardClass}>
              <SectionTitle index="08" title="Předávací protokol" subtitle="Stav bytu a vybavení při předání. Chrání obě strany při vrácení kauce." />
              <div className="space-y-4">
                <Field label="Vybavení bytu (výčet)"><textarea name="equipmentList" value={form.equipmentList} onChange={handleChange} placeholder="Sporák, lednice, pračka, stůl, 2× židle…" className={textareaClass} /></Field>
                <Field label="Známé závady při předání"><textarea name="knownDefects" value={form.knownDefects} onChange={handleChange} placeholder="Poškrábaná podlaha v ložnici, chybějící klika u okna v kuchyni…" className={textareaClass} /></Field>
              </div>
            </section>

            {/* 09 Výběr balíčku */}
            <section className={cardClass}>
              <SectionTitle index="09" title="Výběr balíčku" subtitle="Zvolte úroveň ochrany, která odpovídá vašim potřebám." />
              <div className="space-y-3">
                {([
                  { value: 'basic', label: 'Základní dokument', price: '249 Kč', desc: 'Profesionální podnájemní smlouva dle OZ v PDF.' },
                  { value: 'professional', label: 'Profesionální ochrana', price: '449 Kč', desc: 'Rozšířené klauzule, smluvní pokuty, sankce za prodlení.', recommended: true },
                  { value: 'complete', label: 'Kompletní balíček', price: '749 Kč', desc: 'Vše z Profesionální ochrany + instrukce k podpisu, checklist a 30denní archivace.' },
                ] as const).map((opt) => (
                  <label key={opt.value} className={`block rounded-2xl border-2 p-4 cursor-pointer transition relative ${form.tier === opt.value ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700/60 bg-[#0c1426]/60 hover:border-slate-600'}`}>
                    {('recommended' in opt) &&  form.tier !== 'professional' && (
                      <div className="absolute -top-2.5 left-4"><span className="rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-black">Doporučeno</span></div>
                    )}
                    <div className="flex items-start gap-3">
                      <input type="radio" name="tier" value={opt.value} checked={form.tier === opt.value}
                        onChange={(e) => setForm((prev) => ({ ...prev, tier: e.target.value as 'basic' | 'professional' | 'complete' }))}
                        className="mt-1 h-5 w-5 accent-amber-500" />
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

          {/* Right sidebar */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">

            {/* Risk analysis */}
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Analýza smlouvy</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div>
                  <div className={`font-bold ${scoreColor}`}>{risk.label}</div>
                  <div className="text-xs text-slate-500">ze 100 bodů</div>
                </div>
              </div>
              {risk.warnings.length === 0
                ? <p className="text-sm text-emerald-400">✓ Podnájemní smlouva je v pořádku.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (
                    <li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-rose-500/10 text-rose-300' : 'bg-amber-500/10 text-amber-300'}`}>
                      {w.level === 'high' ? '⚠ ' : '▲ '}{w.text}
                    </li>
                  ))}</ul>
              }
            </div>

            {/* Payment card */}
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Shrnutí objednávky</div>
              <div className="space-y-2 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Podnájemní smlouva</span>
                  <span className="font-bold">249 Kč</span>
                </div>
                {form.tier !== 'basic' && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">{form.tier === 'complete' ? 'Kompletní balíček' : 'Profesionální ochrana'}</span>
                    <span className="text-amber-400 font-bold">{form.tier === 'complete' ? '+500 Kč' : '+200 Kč'}</span>
                  </div>
                )}
                <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-lg">
                  <span>Celkem</span>
                  <span className="text-amber-400">{form.tier === 'complete' ? '749' : form.tier === 'professional' ? '449' : '249'} Kč</span>
                </div>
              </div>

              {/* GDPR */}
              <label className="flex items-start gap-3 mb-5 cursor-pointer group">
                <input type="checkbox" checked={gdprConsent} onChange={(e) => setGdprConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-amber-500 flex-shrink-0" />
                <span className="text-xs text-slate-400 leading-relaxed">
                  Souhlasím se{' '}
                  <a href="/gdpr" className="text-amber-400 underline hover:text-amber-300" target="_blank" rel="noopener noreferrer">zpracováním osobních údajů</a>
                  {' '}a{' '}
                  <a href="/obchodni-podminky" className="text-amber-400 underline hover:text-amber-300" target="_blank" rel="noopener noreferrer">obchodními podmínkami</a>.
                </span>
              </label>

              <button
                onClick={handlePayment}
                disabled={isProcessing || !gdprConsent}
                className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.25)] active:scale-[0.98] uppercase tracking-tight disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                    Přesměrování na platbu…
                  </span>
                ) : (
                  `Zaplatit ${form.tier === 'complete' ? '749 Kč' : form.tier === 'professional' ? '449 Kč' : '249 Kč'} a stáhnout PDF →`
                )}
              </button>
              <p className="mt-3 text-center text-[11px] text-slate-500">
                🔒 Zabezpečená platba přes Stripe · PDF ke stažení ihned po zaplacení
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
