'use client';

import { useState, useMemo } from 'react';
import ContractPreview from '@/app/components/ContractPreview';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import { buildContractSections } from '@/lib/contracts';
import type { StoredContractData } from '@/lib/contracts';

type RepaymentType = 'lump_sum' | 'installments';

type LoanFormData = {
  lenderName: string;
  lenderId: string;
  lenderAddress: string;
  lenderEmail: string;

  borrowerName: string;
  borrowerId: string;
  borrowerAddress: string;
  borrowerEmail: string;
  borrowerBankAccount: string;

  loanAmount: string;
  loanAmountWords: string;
  loanPurpose: string;
  transferMethod: 'transfer' | 'cash';

  interestRate: string;
  repaymentType: RepaymentType;
  repaymentDate: string;
  installmentCount: string;
  installmentAmount: string;
  paymentDay: string;
  firstPaymentDate: string;
  bankAccount: string;
  variableSymbol: string;
  latePenaltyRate: string;

  securityType: 'none' | 'guarantee' | 'pledge' | 'bill';
  guarantorName: string;
  guarantorId: string;
  guarantorAddress: string;
  pledgeDescription: string;

  notaryUpsell: boolean;
  tier: 'basic' | 'professional' | 'complete';
  disputeResolution: 'court' | 'mediation' | 'arbitration';
};

const inputClass =
  'w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition text-sm';
const textareaClass =
  'w-full min-h-[90px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition text-sm';
const cardClass =
  'bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]';
const labelClass = 'block text-xs font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5';

function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-400 mb-1">{index}</div>
      <h2 className="text-lg font-black text-white tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default function LoanBuilderPage() {
  const [formData, setFormData] = useState<LoanFormData>({
    lenderName: '',
    lenderId: '',
    lenderAddress: '',
    lenderEmail: '',
    borrowerName: '',
    borrowerId: '',
    borrowerAddress: '',
    borrowerEmail: '',
    borrowerBankAccount: '',
    loanAmount: '',
    loanAmountWords: '',
    loanPurpose: '',
    transferMethod: 'transfer',
    interestRate: '0',
    repaymentType: 'lump_sum',
    repaymentDate: '',
    installmentCount: '12',
    installmentAmount: '',
    paymentDay: '15',
    firstPaymentDate: '',
    bankAccount: '',
    variableSymbol: '',
    latePenaltyRate: '0.05',
    securityType: 'none',
    guarantorName: '',
    guarantorId: '',
    guarantorAddress: '',
    pledgeDescription: '',
    notaryUpsell: false,
    tier: 'basic' as const,
    disputeResolution: 'court' as const,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);

  const set = (field: keyof LoanFormData, value: string | boolean) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const riskScore = useMemo(() => {
    let score = 100;
    const warnings: { text: string; level: 'high' | 'medium' | 'low' }[] = [];
    if (!formData.lenderName || !formData.borrowerName) {
      score -= 20;
      warnings.push({ text: 'Doplňte jména smluvních stran.', level: 'high' });
    }
    if (!formData.lenderId || !formData.borrowerId) {
      score -= 15;
      warnings.push({ text: 'Doporučujeme vyplnit rodné číslo / IČO obou stran.', level: 'medium' });
    }
    if (!formData.loanAmount) {
      score -= 20;
      warnings.push({ text: 'Doplňte výši zápůjčky.', level: 'high' });
    }
    if (!formData.repaymentDate && formData.repaymentType === 'lump_sum') {
      score -= 15;
      warnings.push({ text: 'Doplňte datum splatnosti jednorázové splátky.', level: 'high' });
    }
    if (formData.securityType === 'none' && Number(formData.loanAmount) > 50000) {
      score -= 10;
      warnings.push({ text: 'U částky nad 50 000 Kč doporučujeme zajistit pohledávku (ručitel, zástava).', level: 'medium' });
    }
    if (!formData.bankAccount) {
      score -= 5;
      warnings.push({ text: 'Doporučujeme vyplnit číslo účtu pro splácení.', level: 'low' });
    }
    if (Number(formData.interestRate) > 15) {
      warnings.push({ text: 'Úrok přesahuje 15 % p.a. — hrozí neplatnost pro lichvu (§ 1796 OZ, NS 32 Cdo 2234/2021). Doporučujeme max. 15 % p.a.', level: 'high' });
    }
    return {
      score: Math.max(0, score),
      warnings,
      label: score >= 80 ? 'Dobré nastavení' : score >= 50 ? 'Průměrná ochrana' : 'Doporučená doplnění',
    };
  }, [formData]);

  const previewSections = useMemo(() => {
    try {
      if (!formData.lenderName) return [];
      return buildContractSections({ ...formData, contractType: 'loan' } as StoredContractData);
    } catch {
      return [];
    }
  }, [formData]);

  const scoreColor = riskScore.score >= 80 ? 'text-emerald-400' : riskScore.score >= 50 ? 'text-amber-400' : 'text-rose-400';

  const handleSubmit = async () => {
    if (!formData.lenderName || !formData.borrowerName || !formData.loanAmount) {
      alert('Vyplňte prosím alespoň jména a výši zápůjčky.');
      return;
    }
    if (!gdprConsent) {
      alert('Pro pokračování je nutný souhlas se zpracováním osobních údajů.');
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType: 'loan',
          tier: formData.tier,
          notaryUpsell: formData.tier !== 'basic',
          email: formData.borrowerEmail || formData.lenderEmail || undefined,
          payload: formData,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert('Chyba při přesměrování na platbu.');
    } catch {
      alert('Nepodařilo se vytvořit platbu. Zkuste to prosím znovu.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200 pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.07),transparent_30%)] pointer-events-none" />

      <header className="relative z-10 border-b border-white/5 bg-[#05080f]/80 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center text-xs font-black text-black">SH</div>
            <div>
              <div className="font-black text-white text-sm">SmlouvaHned</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500">Legal document builder</div>
            </div>
          </a>
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />Platba zabezpečena Stripe</span>
            <span>•</span>
            <span>§ 2390 a násl. OZ</span>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
            {formData.tier === 'complete' ? '749 Kč' : formData.tier === 'professional' ? '399 Kč' : '249 Kč'}
          </span>
        </div>
      </header>

      <ContractLandingSection
        badge="§ 2390 a násl. občanského zákoníku"
        h1Main="Smlouva o"
        h1Accent="zápůjčce online"
        subtitle="Vytvořte smlouvu o zápůjčce peněz nebo jiné věci. Dokument jasně stanoví výši půjčené částky, podmínky vrácení, úroky a sankce za prodlení — a chrání věřitele i dlužníka."
        benefits={[
          { icon: '⚖️', text: 'Sestaveno dle § 2390–2394 OZ — smlouva o zápůjčce' },
          { icon: '📄', text: 'Okamžité PDF ke stažení po zaplacení' },
          { icon: '💰', text: 'Pokrývá jednorázové splacení i splátkový kalendář' },
          { icon: '🔒', text: 'Smluvní úroky, sankce za prodlení a způsob platby' },
        ]}
        contents={[
          'Identifikaci věřitele a dlužníka',
          'Výši půjčené částky',
          'Úrokovou sazbu (nebo bezúročná zápůjčka)',
          'Způsob splacení — jednorázově nebo ve splátkách',
          'Termín splacení nebo splátkový kalendář',
          'Sankce za prodlení se splácením',
          'Bankovní účet a variabilní symbol',
          'Závěrečná ustanovení, GDPR a vyšší moc',
        ]}
        whenSuitable={[
          'Půjčka peněz mezi fyzickými osobami (přátelé, rodina)',
          'Zápůjčka s dohodnutým splátkovým kalendářem',
          'Bezúročná nebo úročená zápůjčka',
          'Situace, kde je třeba písemně doložit vznik dluhového závazku',
        ]}
        whenOther={[
          { label: 'Uznání dluhu', href: '/uznani-dluhu', text: 'Pokud dluh již existuje a potřebujete jej písemně potvrdit a nastavit podmínky splacení.' },
        ]}
        faq={[
          { q: 'Jaký je rozdíl mezi smlouvou o zápůjčce a uznáním dluhu?', a: 'Smlouva o zápůjčce zakládá nový dluhový vztah — věřitel přenechá peníze dlužníkovi a ten se zavazuje je vrátit. Uznání dluhu se používá, když dluh již existuje a dlužník jeho existenci písemně potvrzuje.' },
          { q: 'Musím jako věřitel zdanit úroky?', a: 'Úroky z půjčky jsou příjmem věřitele a podléhají dani z příjmů. Při půjčce v rodině nad 1 000 Kč doporučujeme konzultaci s daňovým poradcem.' },
          { q: 'Je bezúročná půjčka v pořádku?', a: 'Ano, zákon bezúročnou zápůjčku umožňuje. Pokud není sjednán úrok, nevzniká věřiteli nárok na jeho úhradu.' },
          { q: 'Co se stane, pokud dlužník nesplácí?', a: 'Věřitel má právo vymáhat dluh soudní cestou. Písemná smlouva o zápůjčce je zásadním důkazem při soudním řízení. Smluvní pokuta za prodlení může usnadnit vymáhání.' },
          { q: 'Dostanu dokument ihned po zaplacení?', a: 'Ano, PDF je k dispozici ke stažení okamžitě po dokončení platby.' },
        ]}
        ctaLabel="Vytvořit smlouvu o zápůjčce"
        formId="formular"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left column */}
          <div className="lg:col-span-7 space-y-6">

            {/* Form container */}
            <div id="formular">
              <div className="mb-6 border-t border-slate-800/60 pt-8">
                <h2 className="text-lg font-black text-white uppercase tracking-wide">Vyplňte údaje dokumentu</h2>
                <p className="text-sm text-slate-500 mt-1">Všechna povinná pole jsou označena *</p>
              </div>

              {/* 01 Věřitel */}
              <section className={cardClass}>
                <SectionTitle index="01" title="Věřitel (půjčující)" subtitle="Osoba nebo firma, která peníze poskytuje." />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Jméno / název *</label>
                    <input value={formData.lenderName} onChange={e => set('lenderName', e.target.value)} placeholder="Jan Novák" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Rodné číslo / IČO</label>
                    <input value={formData.lenderId} onChange={e => set('lenderId', e.target.value)} placeholder="760101/1234" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Adresa / sídlo</label>
                    <input value={formData.lenderAddress} onChange={e => set('lenderAddress', e.target.value)} placeholder="Ulice 1, Praha 1" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>E-mail</label>
                    <input type="email" value={formData.lenderEmail} onChange={e => set('lenderEmail', e.target.value)} placeholder="jan@email.cz" className={inputClass} />
                  </div>
                </div>
              </section>

              {/* 02 Dlužník */}
              <section className={cardClass}>
                <SectionTitle index="02" title="Dlužník (přijímající)" subtitle="Osoba nebo firma, která peníze přijímá." />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Jméno / název *</label>
                    <input value={formData.borrowerName} onChange={e => set('borrowerName', e.target.value)} placeholder="Petra Svobodová" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Rodné číslo / IČO</label>
                    <input value={formData.borrowerId} onChange={e => set('borrowerId', e.target.value)} placeholder="900315/5678" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Adresa / sídlo</label>
                    <input value={formData.borrowerAddress} onChange={e => set('borrowerAddress', e.target.value)} placeholder="Dlouhá 5, Brno" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>E-mail</label>
                    <input type="email" value={formData.borrowerEmail} onChange={e => set('borrowerEmail', e.target.value)} placeholder="petra@email.cz" className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Číslo účtu dlužníka (pro převod)</label>
                    <input value={formData.borrowerBankAccount} onChange={e => set('borrowerBankAccount', e.target.value)} placeholder="CZ65 0800 0000 1920 0014 5399" className={inputClass} />
                  </div>
                </div>
              </section>

              {/* 03 Předmět zápůjčky */}
              <section className={cardClass}>
                <SectionTitle index="03" title="Výše a účel zápůjčky" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Výše zápůjčky (Kč) *</label>
                    <input type="number" value={formData.loanAmount} onChange={e => set('loanAmount', e.target.value)} placeholder="50 000" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Slovně (pro smlouvu)</label>
                    <input value={formData.loanAmountWords} onChange={e => set('loanAmountWords', e.target.value)} placeholder="padesát tisíc korun českých" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Způsob předání</label>
                    <select value={formData.transferMethod} onChange={e => set('transferMethod', e.target.value)} className={inputClass}>
                      <option value="transfer">Bankovním převodem</option>
                      <option value="cash">V hotovosti</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Úroková sazba (% p.a.)</label>
                    <input type="number" step="0.1" value={formData.interestRate} onChange={e => set('interestRate', e.target.value)} placeholder="0" className={inputClass} />
                    {Number(formData.interestRate) > 15
                      ? <p className="text-xs text-rose-400 font-medium mt-1">⚠ Nad 15 % p.a. hrozí neplatnost pro lichvu (§ 1796 OZ). Doporučujeme max. 15 %.</p>
                      : <p className="text-xs text-slate-500 mt-1">Bezúročná zápůjčka = 0 %</p>
                    }
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Účel zápůjčky (dobrovolné)</label>
                    <input value={formData.loanPurpose} onChange={e => set('loanPurpose', e.target.value)} placeholder="Nákup vozidla, rekonstrukce bytu, provozní náklady…" className={inputClass} />
                  </div>
                </div>
              </section>

              {/* 04 Splácení */}
              <section className={cardClass}>
                <SectionTitle index="04" title="Způsob splácení" />
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(['lump_sum', 'installments'] as const).map(type => (
                      <button key={type} onClick={() => set('repaymentType', type)}
                        className={`p-4 rounded-2xl border text-left transition ${formData.repaymentType === type ? 'border-amber-500/60 bg-amber-500/10' : 'border-slate-700 bg-white/3 hover:border-slate-600'}`}>
                        <div className="font-bold text-white text-sm mb-1">{type === 'lump_sum' ? 'Jednorázově' : 'Ve splátkách'}</div>
                        <div className="text-xs text-slate-400">
                          {type === 'lump_sum' ? 'Celá částka splatná k jednomu datu.' : 'Pravidelné měsíční splátky.'}
                        </div>
                      </button>
                    ))}
                  </div>
                  {formData.repaymentType === 'lump_sum' && (
                    <div>
                      <label className={labelClass}>Datum splatnosti *</label>
                      <input type="date" value={formData.repaymentDate} onChange={e => set('repaymentDate', e.target.value)} className={inputClass} />
                    </div>
                  )}
                  {formData.repaymentType === 'installments' && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Počet splátek</label>
                        <input type="number" value={formData.installmentCount} onChange={e => set('installmentCount', e.target.value)} placeholder="12" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Výše splátky (Kč)</label>
                        <input type="number" value={formData.installmentAmount} onChange={e => set('installmentAmount', e.target.value)} placeholder="4 500" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Den splatnosti splátky</label>
                        <input type="number" min="1" max="31" value={formData.paymentDay} onChange={e => set('paymentDay', e.target.value)} placeholder="15" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Datum 1. splátky</label>
                        <input type="date" value={formData.firstPaymentDate} onChange={e => set('firstPaymentDate', e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Číslo účtu pro splácení</label>
                      <input value={formData.bankAccount} onChange={e => set('bankAccount', e.target.value)} placeholder="CZ65 0800 0000 1920 0014 5399" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Úrok z prodlení (% denně)</label>
                      <input type="number" step="0.001" value={formData.latePenaltyRate} onChange={e => set('latePenaltyRate', e.target.value)} placeholder="0.05" className={inputClass} />
                    </div>
                  </div>
                </div>
              </section>

              {/* 05 Zajištění */}
              <section className={cardClass}>
                <SectionTitle index="05" title="Zajištění pohledávky" subtitle="Doporučujeme u částek nad 50 000 Kč." />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {(['none', 'guarantee', 'pledge', 'bill'] as const).map(type => {
                    const labels = { none: 'Žádné', guarantee: 'Ručitel', pledge: 'Zástava', bill: 'Směnka' };
                    return (
                      <button key={type} onClick={() => set('securityType', type)}
                        className={`p-3 rounded-xl border text-sm font-semibold transition ${formData.securityType === type ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                        {labels[type]}
                      </button>
                    );
                  })}
                </div>
                {formData.securityType === 'guarantee' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Jméno ručitele</label>
                      <input value={formData.guarantorName} onChange={e => set('guarantorName', e.target.value)} placeholder="Tomáš Kovář" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Rodné číslo / IČO ručitele</label>
                      <input value={formData.guarantorId} onChange={e => set('guarantorId', e.target.value)} placeholder="850505/1234" className={inputClass} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Adresa ručitele</label>
                      <input value={formData.guarantorAddress} onChange={e => set('guarantorAddress', e.target.value)} placeholder="Náměstí 5, Ostrava" className={inputClass} />
                    </div>
                  </div>
                )}
                {formData.securityType === 'pledge' && (
                  <div>
                    <label className={labelClass}>Popis zástavy</label>
                    <textarea value={formData.pledgeDescription} onChange={e => set('pledgeDescription', e.target.value)} placeholder="Osobní automobil VW Golf, SPZ: 1AB 2345, VIN: WV1234…" className={textareaClass} />
                  </div>
                )}
              </section>

              {/* Řešení sporů */}
              <section className={cardClass}>
                <div className="mb-4">
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Řešení sporů</div>
                  <select className={inputClass} name="disputeResolution" value={formData.disputeResolution} onChange={(e) => setFormData(p => ({ ...p, disputeResolution: e.target.value as 'court' | 'mediation' | 'arbitration' }))}>
                    <option value="court">Obecný soud (výchozí)</option>
                    <option value="mediation">Mediace (zákon č. 202/2012 Sb.)</option>
                    <option value="arbitration">Rozhodčí řízení (Rozhodčí soud HK ČR)</option>
                  </select>
                </div>
              </section>

              {/* 06 Výběr balíčku */}
              <section className={cardClass}>
                <SectionTitle index="06" title="Výběr balíčku" subtitle="Zvolte úroveň ochrany dle výše zápůjčky." />
                <div className="space-y-3">
                  {([
                    { value: 'basic', label: 'Základní dokument', price: '249 Kč', desc: 'Profesionální smlouva o zápůjčce dle § 2390 OZ v PDF.' },
                    { value: 'professional', label: 'Rozšířená právní ochrana', price: '399 Kč', desc: 'Zajišťovací klauzule, pokuty, podmínky předčasného splacení.', recommended: true },
                    { value: 'complete', label: 'Kompletní balíček', price: '749 Kč', desc: 'Vše z Rozšířené právní ochrany + instrukce k podpisu, checklist a 30denní archivace.' },
                  ] as const).map((opt) => (
                    <label key={opt.value} className={`block rounded-2xl border-2 p-4 cursor-pointer transition relative ${formData.tier === opt.value ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700/60 bg-[#0c1426]/60 hover:border-slate-600'}`}>
                      {('recommended' in opt) &&  formData.tier !== 'professional' && (
                        <div className="absolute -top-2.5 left-4"><span className="rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-black">Doporučeno</span></div>
                      )}
                      <div className="flex items-start gap-3">
                        <input type="radio" name="tier" value={opt.value} checked={formData.tier === opt.value}
                          onChange={(e) => setFormData((prev) => ({ ...prev, tier: e.target.value as 'basic' | 'professional' | 'complete', notaryUpsell: e.target.value !== 'basic' }))}
                          className="mt-1 h-5 w-5 accent-amber-500" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black uppercase tracking-wide text-amber-400">{opt.label}</span>
                            <span className="text-sm font-black text-white">{opt.price}</span>
                          </div>
                          <div className="mt-1 text-xs leading-relaxed text-slate-400">{opt.desc}</div>
                          {opt.value === 'professional' && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {['Smluvní pokuty', 'Sankce za prodlení', 'Notářský doporučení'].map(t => (
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

          {/* Right sidebar */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Watermarked document preview */}
            {previewSections.length > 0 && (
              <ContractPreview sections={previewSections} title="Smlouva o zápůjčce" />
            )}

            {/* Risk analysis */}
            <div className={cardClass}>
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-4">Analýza smlouvy</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{riskScore.score}</div>
                <div>
                  <div className={`font-bold ${scoreColor}`}>{riskScore.label}</div>
                  <div className="text-xs text-slate-500">ze 100 bodů</div>
                </div>
              </div>
              {riskScore.warnings.length === 0
                ? <p className="text-sm text-emerald-400">✓ Smlouva o zápůjčce je v pořádku.</p>
                : <ul className="space-y-2">{riskScore.warnings.map((w, i) => (
                    <li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-rose-500/10 text-rose-300' : 'bg-amber-500/10 text-amber-300'}`}>
                      {w.level === 'high' ? '⚠ ' : '▲ '}{w.text}
                    </li>
                  ))}</ul>
              }
            </div>

            {/* Payment card */}
            <div className={cardClass}>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Shrnutí objednávky</div>
              <div className="space-y-2 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Smlouva o zápůjčce</span>
                  <span className="font-bold text-white">249 Kč</span>
                </div>
                {formData.tier !== 'basic' && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">{formData.tier === 'complete' ? 'Kompletní balíček' : 'Rozšířená právní ochrana'}</span>
                    <span className="font-bold text-amber-400">{formData.tier === 'complete' ? '+500 Kč' : '+200 Kč'}</span>
                  </div>
                )}
                <div className="border-t border-white/8 pt-2 flex justify-between font-black text-lg">
                  <span>Celkem</span>
                  <span className="text-white">{formData.tier === 'complete' ? '749' : formData.tier === 'professional' ? '399' : '249'} Kč</span>
                </div>
              </div>

              {/* Trust block */}
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

              {/* GDPR */}
              <label className="flex items-start gap-3 mb-5 cursor-pointer mt-5">
                <input type="checkbox" checked={gdprConsent} onChange={(e) => setGdprConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-amber-500 flex-shrink-0" />
                <span className="text-xs text-slate-400 leading-relaxed">
                  Souhlasím se{' '}
                  <a href="/gdpr" className="text-amber-400 underline hover:text-amber-300" target="_blank" rel="noopener noreferrer">zpracováním osobních údajů</a>
                  {' '}a{' '}
                  <a href="/obchodni-podminky" className="text-amber-400 underline hover:text-amber-300" target="_blank" rel="noopener noreferrer">obchodními podmínkami</a>.
                </span>
              </label>

              <button
                onClick={handleSubmit}
                disabled={isProcessing || !gdprConsent}
                className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.25)] active:scale-[0.98] uppercase tracking-tight disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                    Přesměrování…
                  </span>
                ) : (
                  `Zaplatit ${formData.tier === 'complete' ? '749 Kč' : formData.tier === 'professional' ? '399 Kč' : '249 Kč'} a stáhnout PDF →`
                )}
              </button>
              <p className="text-center text-xs text-slate-600 mt-3">🔒 Platba přes Stripe · PDF ke stažení ihned</p>
            </div>

            <a href="/" className="block text-center text-xs text-slate-600 hover:text-slate-400 transition">← Zpět na výběr smluv</a>
          </div>
        </div>
      </div>
    </main>
  );
}
