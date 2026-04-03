'use client';

import { useMemo, useState } from 'react';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import ContractPreview from '@/app/components/ContractPreview';
import { buildContractSections } from '@/lib/contracts';
import type { StoredContractData } from '@/lib/contracts';

type FormData = {
  creditorName: string; creditorId: string; creditorAddress: string; creditorEmail: string;
  debtorName: string; debtorId: string; debtorAddress: string; debtorEmail: string;
  debtAmount: string; currency: string; debtAmountWords: string;
  debtOrigin: 'loan' | 'invoice' | 'damage' | 'other'; debtOriginCustom: string;
  debtDate: string; invoiceNumber: string;
  interestRate: string;
  repaymentType: 'lump_sum' | 'installments'; repaymentDate: string;
  installmentCount: string; installmentAmount: string; firstPaymentDate: string; paymentDay: string;
  bankAccount: string; variableSymbol: string; latePenalty: string;
  contractDate: string; notaryUpsell: boolean;
  tier: 'basic' | 'professional' | 'complete';
  disputeResolution: 'court' | 'mediation' | 'arbitration';
};

const inputClass = 'w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';
const cardClass = 'bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>{children}</div>);
}
function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (<div className="mb-6"><div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90">{index}. {title}</div>{subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}</div>);
}

export default function UznanidluhuPage() {
  const [form, setForm] = useState<FormData>({
    creditorName: '', creditorId: '', creditorAddress: '', creditorEmail: '',
    debtorName: '', debtorId: '', debtorAddress: '', debtorEmail: '',
    debtAmount: '', currency: 'Kč', debtAmountWords: '',
    debtOrigin: 'loan', debtOriginCustom: '', debtDate: '', invoiceNumber: '',
    interestRate: '',
    repaymentType: 'lump_sum', repaymentDate: '',
    installmentCount: '', installmentAmount: '', firstPaymentDate: '', paymentDay: '15',
    bankAccount: '', variableSymbol: '', latePenalty: '0,05',
    contractDate: '', notaryUpsell: false,
    tier: 'basic' as const,
    disputeResolution: 'court' as const,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const risk = useMemo(() => {
    let score = 100;
    const warnings: { text: string; level: 'high' | 'medium' | 'low' }[] = [];
    if (!form.debtorName || !form.debtorId) { score -= 20; warnings.push({ text: 'Doplňte identifikaci dlužníka — uznání dluhu musí být jednoznačné.', level: 'high' }); }
    if (!form.debtAmount) { score -= 25; warnings.push({ text: 'Doplňte výši dluhu — povinný údaj.', level: 'high' }); }
    if (!form.repaymentDate && form.repaymentType === 'lump_sum') { score -= 15; warnings.push({ text: 'Doplňte termín splacení.', level: 'high' }); }
    if (!form.bankAccount) { score -= 8; warnings.push({ text: 'Bez čísla účtu je platba obtížně doložitelná.', level: 'medium' }); }
    return { score: Math.max(0, score), warnings, label: score >= 85 ? 'Silné uznání dluhu' : score >= 65 ? 'Doporučená doplnění' : 'Doporučená doplnění' };
  }, [form]);

  const previewSections = useMemo(() => {
    try {
      if (!form.creditorName) return [];
      return buildContractSections({ ...form, contractType: 'debt_acknowledgment' } as StoredContractData);
    } catch {
      return [];
    }
  }, [form]);

  const handlePayment = async () => {
    try {
      if (!gdprConsent) { alert('Pro pokračování je nutný souhlas se zpracováním osobních údajů.'); return; }
    setIsProcessing(true);
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: 'debt_acknowledgment', tier: form.tier, notaryUpsell: form.tier !== 'basic', payload: { ...form, contractType: 'debt_acknowledgment' }, email: form.creditorEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error();
      window.location.href = data.url;
    } catch { alert('Chyba platební brány.'); setIsProcessing(false); }
  };

  const scoreColor = risk.score >= 85 ? 'text-emerald-400' : risk.score >= 65 ? 'text-amber-400' : 'text-rose-400';

  const landingProps = {
    badge: '§ 2053 a násl. občanského zákoníku',
    h1Main: 'Uznání dluhu',
    h1Accent: 'online',
    subtitle: 'Vytvořte uznání dluhu pro písemné potvrzení existujícího závazku a nastavení podmínek jeho splacení. Dokument posiluje právní pozici věřitele a obnovuje promlčecí dobu.',
    benefits: [
      { icon: '⚖️', text: 'Sestaveno dle § 2053 OZ — uznání závazku co do důvodu a výše' },
      { icon: '📄', text: 'PDF ke stažení ihned po ověřené platbě' },
      { icon: '🔒', text: 'Obnovuje 10letou promlčecí dobu — klíčové pro věřitele' },
      { icon: '💰', text: 'Pokrývá jednorázové splacení i splátkový kalendář' },
    ],
    contents: [
      'Identifikaci věřitele a dlužníka',
      'Výši a měnu dluhu',
      'Původ dluhu (zápůjčka, faktura, škoda, jiné)',
      'Potvrzení existence závazku dlužníkem',
      'Způsob splacení — jednorázově nebo ve splátkách',
      'Termín nebo splátkový kalendář',
      'Úrok a sankce za prodlení',
      'Závěrečná ustanovení, GDPR a vyšší moc',
    ],
    whenSuitable: [
      'Dluh existuje, ale chybí písemný doklad — obě strany si přejí situaci vyjasnit',
      'Blíží se promlčení dluhu — uznání obnovuje promlčecí dobu',
      'Věřitel chce písemný základ pro případné vymáhání pohledávky',
      'Dlužník souhlasí se splátkovým kalendářem a chce upravit podmínky splacení',
    ],
    whenOther: [
      { label: 'Smlouva o zápůjčce', href: '/pujcka', text: 'Pokud dluh teprve vzniká — peníze se teprve přenechávají dlužníkovi.' },
    ],
    faq: [
      { q: 'Jaký je rozdíl mezi uznáním dluhu a smlouvou o půjčce?', a: 'Smlouva o zápůjčce zakládá nový dluhový vztah. Uznání dluhu se používá, když dluh již existuje — dlužník pouze písemně potvrzuje, že dluh uznává, a sjednávají se podmínky splacení.' },
      { q: 'Jak uznání dluhu ovlivňuje promlčení?', a: 'Uznáním dluhu dle § 2053 OZ se promlčecí doba přerušuje a začíná běžet znovu — v délce 10 let. To je klíčové, pokud se blíží původní promlčení pohledávky.' },
      { q: 'Musí uznání dluhu podepsat obě strany?', a: 'Stačí podpis dlužníka — uznání dluhu je jednostranný právní akt. Podpis věřitele je doporučen pro potvrzení přijetí dokumentu, ale zákonem není vyžadován.' },
      { q: 'Co se stane, pokud dlužník nesplácí i přes uznání dluhu?', a: 'Věřitel může zahájit soudní vymáhání pohledávky. Písemné uznání dluhu je zásadním důkazem. Při pravomocném rozsudku může věřitel iniciovat exekuci.' },
      { q: 'Dostanu dokument ihned po zaplacení?', a: 'Ano, PDF je k dispozici ke stažení okamžitě po dokončení platby.' },
    ],
    ctaLabel: 'Vytvořit uznání dluhu',
    formId: 'formular',
    guideHref: '/uznani-dluhu-vzor',
    guideLabel: 'Průvodce uznáním dluhu — promlčení, splátkový kalendář a vymáhání',
  };

  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200 font-sans pb-24">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08101e]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-sm">SH</div>
            <div><div className="font-bold tracking-tight text-white">SmlouvaHned Builder</div><div className="text-[11px] text-slate-500">Uznání dluhu — § 2053 OZ</div></div>
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

            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-200">
              <strong>✓ Klíčová výhoda:</strong> Uznáním dluhu se obnovuje promlčecí lhůta na 10 let (§ 639 OZ). Věřitel získává silný nástroj pro vymáhání.
            </div>

            <section className={cardClass}>
              <SectionTitle index="01" title="Věřitel" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno / název *"><input className={inputClass} name="creditorName" value={form.creditorName} onChange={set} placeholder="Pavel Horák" /></Field>
                <Field label="Datum nar. / IČO *"><input className={inputClass} name="creditorId" value={form.creditorId} onChange={set} placeholder="01.01.1975" /></Field>
                <Field label="Adresa *"><input className={inputClass} name="creditorAddress" value={form.creditorAddress} onChange={set} placeholder="Ulice 1, Praha 4" /></Field>
                <Field label="E-mail"><input className={inputClass} name="creditorEmail" value={form.creditorEmail} onChange={set} type="email" placeholder="pavel@email.cz" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="02" title="Dlužník" subtitle="Dlužník podpisem uznává, že dluh existuje a zavazuje se ho splatit." />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno / název *"><input className={inputClass} name="debtorName" value={form.debtorName} onChange={set} placeholder="Tomáš Procházka" /></Field>
                <Field label="Datum nar. / IČO *"><input className={inputClass} name="debtorId" value={form.debtorId} onChange={set} placeholder="15.04.1988" /></Field>
                <Field label="Adresa *"><input className={inputClass} name="debtorAddress" value={form.debtorAddress} onChange={set} placeholder="Ulice 10, Brno" /></Field>
                <Field label="E-mail"><input className={inputClass} name="debtorEmail" value={form.debtorEmail} onChange={set} type="email" placeholder="tomas@email.cz" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="03" title="Výše a původ dluhu" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Výše dluhu (Kč) *"><input className={inputClass} name="debtAmount" value={form.debtAmount} onChange={set} type="number" placeholder="50000" /></Field>
                <Field label="Měna"><select className={inputClass} name="currency" value={form.currency} onChange={set}><option>Kč</option><option>EUR</option></select></Field>
                <div className="sm:col-span-2"><Field label="Výše dluhu slovy"><input className={inputClass} name="debtAmountWords" value={form.debtAmountWords} onChange={set} placeholder="padesát tisíc korun českých" /></Field></div>
                <Field label="Vznik dluhu">
                  <select className={inputClass} name="debtOrigin" value={form.debtOrigin} onChange={set}>
                    <option value="loan">Půjčka / zápůjčka</option>
                    <option value="invoice">Nezaplacená faktura</option>
                    <option value="damage">Náhrada škody</option>
                    <option value="other">Jiné</option>
                  </select>
                </Field>
                <Field label="Datum vzniku dluhu"><input className={inputClass} name="debtDate" value={form.debtDate} onChange={set} type="date" /></Field>
                {form.debtOrigin === 'invoice' && <div className="sm:col-span-2"><Field label="Číslo faktury"><input className={inputClass} name="invoiceNumber" value={form.invoiceNumber} onChange={set} placeholder="2026001" /></Field></div>}
                {form.debtOrigin === 'other' && <div className="sm:col-span-2"><Field label="Popis vzniku dluhu *"><input className={inputClass} name="debtOriginCustom" value={form.debtOriginCustom} onChange={set} placeholder="Bezdůvodné obohacení / škoda na věci…" /></Field></div>}
                <div className="sm:col-span-2"><Field label="Úrok z prodlení (% p.a., 0 = bezúročné)"><input className={inputClass} name="interestRate" value={form.interestRate} onChange={set} type="number" placeholder="0" /></Field></div>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="04" title="Způsob a termín splacení" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Způsob splácení">
                  <select className={inputClass} name="repaymentType" value={form.repaymentType} onChange={set}>
                    <option value="lump_sum">Jednorázové splacení</option>
                    <option value="installments">Splátky</option>
                  </select>
                </Field>
                {form.repaymentType === 'lump_sum' && <Field label="Datum splatnosti *"><input className={inputClass} name="repaymentDate" value={form.repaymentDate} onChange={set} type="date" /></Field>}
                {form.repaymentType === 'installments' && (
                  <>
                    <Field label="Počet splátek"><input className={inputClass} name="installmentCount" value={form.installmentCount} onChange={set} type="number" placeholder="12" /></Field>
                    <Field label="Výše splátky (Kč)"><input className={inputClass} name="installmentAmount" value={form.installmentAmount} onChange={set} type="number" placeholder="5000" /></Field>
                    <Field label="První splátka"><input className={inputClass} name="firstPaymentDate" value={form.firstPaymentDate} onChange={set} type="date" /></Field>
                    <Field label="Splatnost (den v měsíci)"><input className={inputClass} name="paymentDay" value={form.paymentDay} onChange={set} type="number" /></Field>
                  </>
                )}
                <Field label="Číslo účtu věřitele"><input className={inputClass} name="bankAccount" value={form.bankAccount} onChange={set} placeholder="123456789/0800" /></Field>
                <Field label="Variabilní symbol"><input className={inputClass} name="variableSymbol" value={form.variableSymbol} onChange={set} placeholder="20260001" /></Field>
                <div className="sm:col-span-2"><Field label="Smluvní pokuta za prodlení (% z dlužné částky/den)"><input className={inputClass} name="latePenalty" value={form.latePenalty} onChange={set} placeholder="0,05" /></Field></div>
              </div>
            </section>

            <section className={cardClass}>

              {/* Řešení sporů */}
              <div className="mb-6">
                <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Řešení sporů</div>
                <select className={inputClass} name="disputeResolution" value={form.disputeResolution} onChange={set}>
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

          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Watermarked document preview */}
            {previewSections.length > 0 && (
              <ContractPreview sections={previewSections} title="Uznání dluhu" />
            )}
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Analýza</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div><div className={`font-bold ${scoreColor}`}>{risk.label}</div><div className="text-xs text-slate-500">ze 100 bodů</div></div>
              </div>
              {risk.warnings.length === 0 ? <p className="text-sm text-emerald-400">✓ Uznání dluhu je kompletní.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (<li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-500/10 text-amber-300'}`}>{w.level === 'high' ? '⚠ ' : '▲ '}{w.text}</li>))}</ul>}
            </div>
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Shrnutí</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Uznání dluhu</span><span className="font-bold">249 Kč</span></div>
                {form.notaryUpsell && <div className="flex justify-between"><span className="text-slate-400">Exekuční doložka</span><span className="text-amber-400 font-bold">+200 Kč</span></div>}
                <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-lg"><span>Celkem</span><span className="text-amber-400">{form.tier === 'complete' ? '749' : form.tier === 'professional' ? '399' : '249'} Kč</span></div>
              </div>
              {(!form.creditorName || !form.debtorName || !form.debtAmount) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3 text-xs text-slate-400 space-y-1">
                  <div className="font-semibold mb-1">Před platbou vyplňte:</div>
                  {!form.creditorName && <div>• Jméno věřitele</div>}
                  {!form.debtorName && <div>• Jméno dlužníka</div>}
                  {!form.debtAmount && <div>• Výše dluhu</div>}
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
              <button onClick={handlePayment} disabled={isProcessing || !gdprConsent || !form.creditorName || !form.debtorName || !form.debtAmount}
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
