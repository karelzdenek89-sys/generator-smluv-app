'use client';

import { useMemo, useState } from 'react';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import ContractPreview from '@/app/components/ContractPreview';
import BuilderCheckoutSummary from '@/app/components/BuilderCheckoutSummary';
import BuilderTierSelector from '@/app/components/BuilderTierSelector';
import { buildContractSections } from '@/lib/contracts';
import type { StoredContractData } from '@/lib/contracts';
import PaymentModal from '@/app/components/PaymentModal';

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
  tier: 'basic' | 'complete';
  disputeResolution: 'court' | 'mediation' | 'arbitration';
};

const inputClass = 'site-input';
const cardClass = 'builder-card p-6';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><label className="site-form-label">{label}</label>{children}</div>);
}
function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (<div className="mb-6"><div className="builder-kicker">{index}. {title}</div>{subtitle && <p className="builder-help mt-2 text-sm">{subtitle}</p>}</div>);
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
  const [showPreviewModal, setShowPreviewModal] = useState(false);

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
      { icon: '📄', text: 'Okamžité PDF ke stažení po zaplacení' },
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
    <>
    <main className="site-page contract-builder min-h-screen pb-24">
      <header className="contract-builder-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-sm">SH</div>
            <div><div className="font-bold tracking-tight text-white">SmlouvaHned</div><div className="text-[11px] text-slate-500">Uznání dluhu</div></div>
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
                  {formData.disputeResolution === 'arbitration' && (
                    <p className="mt-2 text-xs text-amber-400 leading-relaxed">⚠ Rozhodčí doložka není platná ve smlouvách se spotřebiteli (zákon č. 216/1994 Sb.). Použijte ji pouze pro vztahy B2B.</p>
                  )}
                </select>
              </div>
              {/* === Vyberte úroveň zpracování dokumentu === */}
              <div className="mt-6">
                <BuilderTierSelector
                  contractType="debt_acknowledgment"
                  tier={form.tier}
                  onTierChange={(tier) =>
                    setForm((prev) => ({ ...prev, tier, notaryUpsell: tier !== 'basic' }))
                  }
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Watermarked document preview */}
            {previewSections.length > 0 && (
              <ContractPreview sections={previewSections} title="Uznání dluhu" />
            )}
            <div className={cardClass}>
              <div className="builder-kicker mb-4">Kontrola úplnosti</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div><div className={`font-bold ${scoreColor}`}>{risk.label}</div><div className="text-xs text-slate-500">ze 100 bodů</div></div>
              </div>
              {risk.warnings.length === 0 ? <p className="text-sm text-emerald-400">✓ Uznání dluhu je kompletní.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (<li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-500/10 text-amber-300'}`}>{w.level === 'high' ? '⚠ ' : '▲ '}{w.text}</li>))}</ul>}
            </div>
            <div className={cardClass}>
              <BuilderCheckoutSummary
                contractType="debt_acknowledgment"
                tier={form.tier}
                documentLabel="Uznání dluhu"
                onUpgrade={() => setForm((prev) => ({ ...prev, tier: 'complete', notaryUpsell: true }))}
              />
              {(!form.creditorName || !form.debtorName || !form.debtAmount) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3 text-xs text-slate-400 space-y-1">
                  <div className="font-semibold mb-1">Před platbou vyplňte:</div>
                  {!form.creditorName && <div>• Jméno věřitele</div>}
                  {!form.debtorName && <div>• Jméno dlužníka</div>}
                  {!form.debtAmount && <div>• Výše dluhu</div>}
                </div>
              )}
                              {/* Tlačítko generování */}
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.25)] active:scale-[0.98] uppercase tracking-tight"
                >
                  Vygenerovat smlouvu →
                </button>

                <p className="mt-3 text-center text-[11px] text-slate-500">
                  Zobrazí se náhled dokumentu připraveného k odemčení
                </p>
            </div>
          </div>
        </div>
      </div>
    </main>
    {showPreviewModal && (
      <PaymentModal
        sections={previewSections}
        title="Uznání dluhu"
        tier={form.tier}
        onTierChange={(t) => setForm((prev) => ({ ...prev, tier: t }))}
        contractType="debt_acknowledgment"
        onPay={handlePayment}
        isProcessing={isProcessing}
        onClose={() => setShowPreviewModal(false)}
      />
    )}
    </>
  );
}



