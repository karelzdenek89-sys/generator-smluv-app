'use client';

import { useMemo, useState } from 'react';

type FormData = {
  sellerName: string; sellerId: string; sellerAddress: string; sellerEmail: string; sellerPhone: string; sellerBankAccount: string;
  buyerName: string; buyerId: string; buyerAddress: string; buyerEmail: string; buyerPhone: string;
  itemType: 'general' | 'electronics' | 'car';
  itemDescription: string; serialNumber: string; carMake: string; carModel: string; carVIN: string; carPlate: string; carYear: string; carMileage: string;
  price: string; currency: string; priceWords: string; paymentMethod: 'cash' | 'transfer' | 'escrow'; paymentDays: string; variableSymbol: string;
  itemCondition: string; knownDefects: string; handoverDate: string; handoverPlace: string; warrantyMonths: string;
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
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

export default function KupniPage() {
  const [form, setForm] = useState<FormData>({
    sellerName: '', sellerId: '', sellerAddress: '', sellerEmail: '', sellerPhone: '', sellerBankAccount: '',
    buyerName: '', buyerId: '', buyerAddress: '', buyerEmail: '', buyerPhone: '',
    itemType: 'general', itemDescription: '', serialNumber: '', carMake: '', carModel: '', carVIN: '', carPlate: '', carYear: '', carMileage: '',
    price: '', currency: 'Kč', priceWords: '', paymentMethod: 'transfer', paymentDays: '5', variableSymbol: '',
    itemCondition: '', knownDefects: '', handoverDate: '', handoverPlace: '', warrantyMonths: '',
    contractDate: '', notaryUpsell: false,
    tier: 'basic' as const,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm(p => ({ ...p, [name]: val }));
  };

  const risk = useMemo(() => {
    let score = 100;
    const warnings: { text: string; level: 'high' | 'medium' | 'low' }[] = [];
    if (!form.sellerId || !form.buyerId) { score -= 20; warnings.push({ text: 'Chybí identifikace stran — nízká vymahatelnost.', level: 'high' }); }
    if (!form.price) { score -= 25; warnings.push({ text: 'Neuvedena kupní cena — smlouva je neúplná.', level: 'high' }); }
    if (!form.handoverDate) { score -= 10; warnings.push({ text: 'Není stanoven termín předání.', level: 'medium' }); }
    if (form.itemType === 'car' && !form.carVIN) { score -= 15; warnings.push({ text: 'U vozidla chybí VIN — nelze ověřit historii.', level: 'high' }); }
    if (!form.knownDefects) { score -= 8; warnings.push({ text: 'Nevyplněny vady — doporučujeme uvést "bez vad" nebo konkrétní vady.', level: 'low' }); }
    return { score: Math.max(0, score), warnings, label: score >= 85 ? 'Silná ochrana' : score >= 65 ? 'Průměrná ochrana' : 'Slabší ochrana' };
  }, [form]);

  const handlePayment = async () => {
    try {
      if (!gdprConsent) { alert('Pro pokračování je nutný souhlas se zpracováním osobních údajů.'); return; }
    setIsProcessing(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: 'general_sale', tier: form.tier, notaryUpsell: form.tier !== 'basic', payload: { ...form, contractType: 'general_sale' }, email: form.buyerEmail || form.sellerEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error || 'Chyba');
      window.location.href = data.url;
    } catch { alert('Chyba platební brány. Zkuste to prosím znovu.'); setIsProcessing(false); }
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
              <div className="text-[11px] text-slate-500">Kupní smlouva — § 2079 OZ</div>
            </div>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-sm text-slate-400 hover:text-white transition">Zavřít</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">

            {/* Prodávající */}
            <section className={cardClass}>
              <SectionTitle index="01" title="Prodávající" subtitle="Přesná identifikace zajišťuje vymahatelnost smlouvy." />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno / název firmy *"><input className={inputClass} name="sellerName" value={form.sellerName} onChange={set} placeholder="Jan Novák" /></Field>
                <Field label="Datum nar. / IČO *"><input className={inputClass} name="sellerId" value={form.sellerId} onChange={set} placeholder="01.01.1980 nebo 12345678" /></Field>
                <Field label="Adresa / sídlo *"><input className={inputClass} name="sellerAddress" value={form.sellerAddress} onChange={set} placeholder="Ulice 1, Praha 1" /></Field>
                <Field label="E-mail"><input className={inputClass} name="sellerEmail" value={form.sellerEmail} onChange={set} type="email" placeholder="jan@email.cz" /></Field>
                <Field label="Telefon"><input className={inputClass} name="sellerPhone" value={form.sellerPhone} onChange={set} placeholder="+420 600 000 000" /></Field>
                <Field label="Číslo účtu (pro převod)"><input className={inputClass} name="sellerBankAccount" value={form.sellerBankAccount} onChange={set} placeholder="123456789/0800" /></Field>
              </div>
            </section>

            {/* Kupující */}
            <section className={cardClass}>
              <SectionTitle index="02" title="Kupující" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno / název firmy *"><input className={inputClass} name="buyerName" value={form.buyerName} onChange={set} placeholder="Marie Svobodová" /></Field>
                <Field label="Datum nar. / IČO *"><input className={inputClass} name="buyerId" value={form.buyerId} onChange={set} placeholder="01.01.1985 nebo 87654321" /></Field>
                <Field label="Adresa / sídlo *"><input className={inputClass} name="buyerAddress" value={form.buyerAddress} onChange={set} placeholder="Ulice 5, Brno" /></Field>
                <Field label="E-mail"><input className={inputClass} name="buyerEmail" value={form.buyerEmail} onChange={set} type="email" placeholder="marie@email.cz" /></Field>
                <Field label="Telefon"><input className={inputClass} name="buyerPhone" value={form.buyerPhone} onChange={set} placeholder="+420 700 000 000" /></Field>
              </div>
            </section>

            {/* Předmět */}
            <section className={cardClass}>
              <SectionTitle index="03" title="Předmět prodeje" subtitle="Co prodáváte? Čím přesnější popis, tím silnější smlouva." />
              <div className="space-y-4">
                <Field label="Typ předmětu">
                  <select className={inputClass} name="itemType" value={form.itemType} onChange={set}>
                    <option value="general">Obecná movitá věc (nábytek, kolo, zboží…)</option>
                    <option value="electronics">Elektronika / stroje</option>
                    <option value="car">Motorové vozidlo</option>
                  </select>
                </Field>
                {form.itemType !== 'car' && (
                  <>
                    <Field label="Popis předmětu *"><textarea className="w-full min-h-[90px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="itemDescription" value={form.itemDescription} onChange={set} placeholder="Např. Dřevěná zahradní lavička, hnědá, rozměry 180×60 cm, rok výroby 2022" /></Field>
                    {form.itemType === 'electronics' && <Field label="Výrobní / sériové číslo"><input className={inputClass} name="serialNumber" value={form.serialNumber} onChange={set} placeholder="SN1234567890" /></Field>}
                  </>
                )}
                {form.itemType === 'car' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Značka *"><input className={inputClass} name="carMake" value={form.carMake} onChange={set} placeholder="Škoda" /></Field>
                    <Field label="Model *"><input className={inputClass} name="carModel" value={form.carModel} onChange={set} placeholder="Octavia" /></Field>
                    <Field label="VIN *"><input className={inputClass} name="carVIN" value={form.carVIN} onChange={set} placeholder="TMBZZZ1Z0M1234567" /></Field>
                    <Field label="SPZ"><input className={inputClass} name="carPlate" value={form.carPlate} onChange={set} placeholder="1AB 2345" /></Field>
                    <Field label="Rok výroby"><input className={inputClass} name="carYear" value={form.carYear} onChange={set} placeholder="2019" /></Field>
                    <Field label="Stav tachometru (km)"><input className={inputClass} name="carMileage" value={form.carMileage} onChange={set} placeholder="85 000" /></Field>
                  </div>
                )}
                <Field label="Stav předmětu">
                  <select className={inputClass} name="itemCondition" value={form.itemCondition} onChange={set}>
                    <option value="">— vyberte —</option>
                    <option value="Nový, nepoužitý">Nový, nepoužitý</option>
                    <option value="Výborný stav">Výborný stav (jako nový)</option>
                    <option value="Dobrý stav">Dobrý stav (drobné opotřebení)</option>
                    <option value="Použitý — funkční stav">Použitý — funkční stav</option>
                    <option value="Vyžaduje opravu">Vyžaduje opravu</option>
                  </select>
                </Field>
                <Field label="Známé vady (nebo 'bez vad')">
                  <textarea className="w-full min-h-[70px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="knownDefects" value={form.knownDefects} onChange={set} placeholder="Např. Škrábance na levém boku, jinak bez vad" />
                </Field>
              </div>
            </section>

            {/* Cena */}
            <section className={cardClass}>
              <SectionTitle index="04" title="Kupní cena a platba" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Kupní cena *"><input className={inputClass} name="price" value={form.price} onChange={set} type="number" placeholder="15000" /></Field>
                <Field label="Měna"><select className={inputClass} name="currency" value={form.currency} onChange={set}><option>Kč</option><option>EUR</option></select></Field>
                <Field label="Cena slovy"><input className={inputClass} name="priceWords" value={form.priceWords} onChange={set} placeholder="patnáct tisíc korun českých" /></Field>
                <Field label="Způsob úhrady">
                  <select className={inputClass} name="paymentMethod" value={form.paymentMethod} onChange={set}>
                    <option value="transfer">Bankovní převod</option>
                    <option value="cash">Hotovost při předání</option>
                    <option value="escrow">Notářská/advokátní úschova</option>
                  </select>
                </Field>
                {form.paymentMethod === 'transfer' && <Field label="Splatnost (pracovní dny)"><input className={inputClass} name="paymentDays" value={form.paymentDays} onChange={set} placeholder="5" /></Field>}
                {form.paymentMethod === 'transfer' && <Field label="Variabilní symbol"><input className={inputClass} name="variableSymbol" value={form.variableSymbol} onChange={set} placeholder="20260001" /></Field>}
              </div>
            </section>

            {/* Předání a záruka */}
            <section className={cardClass}>
              <SectionTitle index="05" title="Předání a záruka" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Datum předání"><input className={inputClass} name="handoverDate" value={form.handoverDate} onChange={set} type="date" /></Field>
                <Field label="Místo předání"><input className={inputClass} name="handoverPlace" value={form.handoverPlace} onChange={set} placeholder="Praha, adresa prodávajícího" /></Field>
                <Field label="Záruka (měsíce, 0 = zákonná odpov.)"><input className={inputClass} name="warrantyMonths" value={form.warrantyMonths} onChange={set} type="number" placeholder="0" /></Field>
                <Field label="Datum smlouvy"><input className={inputClass} name="contractDate" value={form.contractDate} onChange={set} type="date" /></Field>
              </div>
            </section>

            {/* Profesionální ochrana */}
            <section className={cardClass}>
              
              {/* === VÝBĚR BALÍČKU === */}
              <div className="space-y-3 mt-6">
                <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Vyberte balíček</div>
                {([
                  { value: 'basic', label: 'Základní dokument', price: '249 Kč', desc: 'Profesionální smlouva dle občanského zákoníku v PDF.' },
                  { value: 'professional', label: 'Profesionální ochrana', price: '399 Kč', desc: 'Rozšířené klauzule, smluvní pokuty a zajišťovací ustanovení.', recommended: true },
                  { value: 'complete', label: 'Kompletní balíček', price: '749 Kč', desc: 'Vše z Profesionální ochrany + průvodní instrukce, checklist a 30denní archivace.' },
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

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Risk */}
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
                ? <p className="text-sm text-emerald-400">✓ Smlouva je kompletní a silná.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (
                    <li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-rose-500/10 text-rose-300' : w.level === 'medium' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-700/40 text-slate-400'}`}>
                      {w.level === 'high' ? '⚠ ' : w.level === 'medium' ? '▲ ' : '○ '}{w.text}
                    </li>
                  ))}</ul>
              }
            </div>

            {/* Shrnutí */}
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Shrnutí objednávky</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Kupní smlouva</span><span className="text-white font-bold">249 Kč</span></div>
                {form.tier !== 'basic' && <div className="flex justify-between"><span className="text-slate-400">{form.tier === 'complete' ? 'Kompletní balíček' : 'Profesionální ochrana'}</span><span className="text-amber-400 font-bold">{form.tier === 'complete' ? '+500 Kč' : '+200 Kč'}</span></div>}
                <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-lg"><span>Celkem</span><span className="text-amber-400">{form.tier === 'complete' ? '749' : form.tier === 'professional' ? '399' : '249'} Kč</span></div>
              </div>
              {(!form.sellerName || !form.buyerName || !form.price) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-300 space-y-1">
                  <div className="font-semibold mb-1">Před platbou vyplňte:</div>
                  {!form.sellerName && <div>• Jméno prodávajícího</div>}
                  {!form.buyerName && <div>• Jméno kupujícího</div>}
                  {!form.price && <div>• Kupní cena (sekce 04)</div>}
                </div>
              )}
              <label className="flex items-start gap-3 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gdprConsent}
                  onChange={(e) => setGdprConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-amber-500 flex-shrink-0"
                />
                <span className="text-xs text-slate-400">
                  Souhlasím se{' '}
                  <a href="/gdpr" className="text-amber-400 underline" target="_blank" rel="noopener noreferrer">
                    zpracováním osobních údajů
                  </a>{' '}
                  za účelem vyhotovení smlouvy.
                </span>
              </label>
              <button
                onClick={handlePayment}
                disabled={isProcessing || !gdprConsent || !form.sellerName || !form.buyerName || !form.price}
                className="mt-4 w-full rounded-2xl bg-amber-500 px-6 py-4 font-bold text-slate-900 text-lg hover:bg-amber-400 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Přesměrování…' : 'Zaplatit a stáhnout PDF →'}
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">Platba kartou přes Stripe · PDF ke stažení ihned</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
