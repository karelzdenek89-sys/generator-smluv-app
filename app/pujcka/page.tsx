'use client';

import { useState, useMemo } from 'react';

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
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const set = (field: keyof LoanFormData, value: string | boolean) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const riskScore = useMemo(() => {
    let score = 100;
    const warnings: string[] = [];
    if (!formData.lenderName || !formData.borrowerName) { score -= 20; warnings.push('Chybí jména smluvních stran.'); }
    if (!formData.lenderId || !formData.borrowerId) { score -= 15; warnings.push('Doporučujeme vyplnit rodné číslo / IČO.'); }
    if (!formData.loanAmount) { score -= 20; warnings.push('Chybí výše zápůjčky.'); }
    if (!formData.repaymentDate && formData.repaymentType === 'lump_sum') { score -= 15; warnings.push('Chybí datum splatnosti.'); }
    if (formData.securityType === 'none' && Number(formData.loanAmount) > 50000) {
      score -= 10; warnings.push('U vyšší částky doporučujeme zajištění pohledávky.');
    }
    return { score: Math.max(0, score), warnings, level: score >= 80 ? 'low' : score >= 50 ? 'medium' : 'high' };
  }, [formData]);

  const handleSubmit = async () => {
    if (!formData.lenderName || !formData.borrowerName || !formData.loanAmount) {
      alert('Vyplňte prosím alespoň jména a výši zápůjčky.');
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType: 'loan',
          notaryUpsell: formData.notaryUpsell,
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
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.07),transparent_30%)] pointer-events-none" />

      <header className="relative z-10 border-b border-white/5 bg-[#05080f]/80 backdrop-blur-sm">
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
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="mb-8">
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-400 mb-2">Zápůjčka / Půjčka</div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tight text-white">SMLOUVA O ZÁPŮJČCE</h1>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">Bezpečný způsob, jak si půjčit nebo zapůjčit peníze. Smlouva dle § 2390 OZ s možností úročení, splátkového plánu a zajištění pohledávky.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">

            <section className={cardClass}>
              <SectionTitle index="01" title="Věřitel (půjčující)" subtitle="Osoba, která peníze poskytuje." />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div><label className={labelClass}>Celé jméno / název firmy</label><input value={formData.lenderName} onChange={e => set('lenderName', e.target.value)} placeholder="Jan Novák" className={inputClass} /></div>
                <div><label className={labelClass}>Rodné číslo / IČO / datum nar.</label><input value={formData.lenderId} onChange={e => set('lenderId', e.target.value)} placeholder="760512/1234" className={inputClass} /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelClass}>Adresa trvalého bydliště / sídla</label><input value={formData.lenderAddress} onChange={e => set('lenderAddress', e.target.value)} placeholder="Ulice 1, 110 00 Praha 1" className={inputClass} /></div>
                <div><label className={labelClass}>E-mail (pro zaslání dokumentu)</label><input type="email" value={formData.lenderEmail} onChange={e => set('lenderEmail', e.target.value)} placeholder="jan@email.cz" className={inputClass} /></div>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="02" title="Dlužník (vydlužitel)" subtitle="Osoba, která peníze přijímá." />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div><label className={labelClass}>Celé jméno / název firmy</label><input value={formData.borrowerName} onChange={e => set('borrowerName', e.target.value)} placeholder="Marie Dvořáková" className={inputClass} /></div>
                <div><label className={labelClass}>Rodné číslo / IČO / datum nar.</label><input value={formData.borrowerId} onChange={e => set('borrowerId', e.target.value)} placeholder="856010/5678" className={inputClass} /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div><label className={labelClass}>Adresa trvalého bydliště / sídla</label><input value={formData.borrowerAddress} onChange={e => set('borrowerAddress', e.target.value)} placeholder="Ulice 2, 602 00 Brno" className={inputClass} /></div>
                <div><label className={labelClass}>E-mail dlužníka</label><input type="email" value={formData.borrowerEmail} onChange={e => set('borrowerEmail', e.target.value)} placeholder="marie@email.cz" className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>Bankovní účet dlužníka (pro zaslání peněz)</label><input value={formData.borrowerBankAccount} onChange={e => set('borrowerBankAccount', e.target.value)} placeholder="123456789/0800" className={inputClass} /></div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="03" title="Výše a podmínky zápůjčky" />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div><label className={labelClass}>Výše zápůjčky (Kč)</label><input type="number" value={formData.loanAmount} onChange={e => set('loanAmount', e.target.value)} placeholder="50 000" className={inputClass} /></div>
                <div><label className={labelClass}>Výše slovy (volitelné)</label><input value={formData.loanAmountWords} onChange={e => set('loanAmountWords', e.target.value)} placeholder="padesát tisíc korun českých" className={inputClass} /></div>
              </div>
              <div className="mb-4">
                <label className={labelClass}>Způsob předání peněz</label>
                <select value={formData.transferMethod} onChange={e => set('transferMethod', e.target.value as 'transfer' | 'cash')} className={inputClass}>
                  <option value="transfer">Bankovním převodem</option>
                  <option value="cash">V hotovosti při podpisu</option>
                </select>
              </div>
              <div className="mb-4">
                <label className={labelClass}>Účel zápůjčky (volitelné)</label>
                <input value={formData.loanPurpose} onChange={e => set('loanPurpose', e.target.value)} placeholder="Např. rekonstrukce bytu, koupě vozidla" className={inputClass} />
              </div>
              <div className="mb-4">
                <label className={labelClass}>Úroková sazba (% p.a.) — 0 = bezúročná</label>
                <input type="number" step="0.1" value={formData.interestRate} onChange={e => set('interestRate', e.target.value)} placeholder="0" className={inputClass} />
                {Number(formData.interestRate) > 0 && (
                  <p className="text-xs text-amber-400 mt-1">⚠ Úrok musí být přiměřený. Sazba výrazně převyšující tržní úroveň může být soudem snížena.</p>
                )}
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="04" title="Splácení" />
              <div className="mb-4">
                <label className={labelClass}>Způsob splácení</label>
                <select value={formData.repaymentType} onChange={e => set('repaymentType', e.target.value as RepaymentType)} className={inputClass}>
                  <option value="lump_sum">Jednorázově k datu splatnosti</option>
                  <option value="installments">Pravidelné měsíční splátky</option>
                </select>
              </div>
              {formData.repaymentType === 'lump_sum' ? (
                <div><label className={labelClass}>Datum splatnosti</label><input type="date" value={formData.repaymentDate} onChange={e => set('repaymentDate', e.target.value)} className={inputClass} /></div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Počet splátek</label><input type="number" value={formData.installmentCount} onChange={e => set('installmentCount', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Výše splátky (Kč)</label><input type="number" value={formData.installmentAmount} onChange={e => set('installmentAmount', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Den splatnosti v měsíci</label><input type="number" min="1" max="28" value={formData.paymentDay} onChange={e => set('paymentDay', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Datum první splátky</label><input type="date" value={formData.firstPaymentDate} onChange={e => set('firstPaymentDate', e.target.value)} className={inputClass} /></div>
                </div>
              )}
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div><label className={labelClass}>Bankovní účet věřitele</label><input value={formData.bankAccount} onChange={e => set('bankAccount', e.target.value)} placeholder="123456/0800" className={inputClass} /></div>
                <div><label className={labelClass}>Variabilní symbol</label><input value={formData.variableSymbol} onChange={e => set('variableSymbol', e.target.value)} placeholder="Volitelné" className={inputClass} /></div>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="05" title="Zajištění pohledávky" subtitle="Jak se věřitel chrání v případě nesplacení." />
              <select value={formData.securityType} onChange={e => set('securityType', e.target.value as LoanFormData['securityType'])} className={`${inputClass} mb-4`}>
                <option value="none">Bez zajištění</option>
                <option value="guarantee">Ručení třetí osobou</option>
                <option value="pledge">Zástavní právo k věci</option>
                <option value="bill">Vlastní směnka</option>
              </select>
              {formData.securityType === 'guarantee' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Jméno ručitele</label><input value={formData.guarantorName} onChange={e => set('guarantorName', e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>RČ / datum nar. ručitele</label><input value={formData.guarantorId} onChange={e => set('guarantorId', e.target.value)} className={inputClass} /></div>
                  <div className="sm:col-span-2"><label className={labelClass}>Adresa ručitele</label><input value={formData.guarantorAddress} onChange={e => set('guarantorAddress', e.target.value)} className={inputClass} /></div>
                </div>
              )}
              {formData.securityType === 'pledge' && (
                <div><label className={labelClass}>Popis zástavy</label><textarea value={formData.pledgeDescription} onChange={e => set('pledgeDescription', e.target.value)} placeholder="Motorové vozidlo VW Golf, VIN: ..., SPZ: ..." className={textareaClass} /></div>
              )}
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-8">
            {/* Risk */}
            <div className={cardClass}>
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-3">Analýza rizik</div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#1e2940" strokeWidth="4" />
                    <circle cx="18" cy="18" r="14" fill="none"
                      stroke={riskScore.score >= 80 ? '#22c55e' : riskScore.score >= 50 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="4" strokeDasharray={`${riskScore.score * 0.879} 87.9`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">{riskScore.score}</div>
                </div>
                <div>
                  <div className={`text-sm font-bold ${riskScore.score >= 80 ? 'text-emerald-400' : riskScore.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {riskScore.score >= 80 ? 'Smlouva je silná' : riskScore.score >= 50 ? 'Průměrná ochrana' : 'Nízká ochrana'}
                  </div>
                  <div className="text-xs text-slate-500">Skóre vymahatelnosti</div>
                </div>
              </div>
              {riskScore.warnings.length > 0 && (
                <ul className="space-y-1.5">
                  {riskScore.warnings.map((w, i) => (
                    <li key={i} className="text-xs text-amber-300 flex items-start gap-2">
                      <span className="mt-0.5">⚠</span><span>{w}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Prémiový balíček */}
            <div className={`${cardClass} ${formData.notaryUpsell ? 'border-amber-500/40 bg-amber-500/5' : ''}`}>
              <div className="flex items-start gap-3 mb-4">
                <input type="checkbox" id="premium" checked={formData.notaryUpsell} onChange={e => set('notaryUpsell', e.target.checked)} className="mt-1 accent-amber-500 w-4 h-4" />
                <div>
                  <label htmlFor="premium" className="font-bold text-white cursor-pointer text-sm">Prémiový balíček +299 Kč</label>
                  <p className="text-xs text-slate-500 mt-0.5">Rozšířené doložky pro lepší ochranu</p>
                </div>
              </div>
              {formData.notaryUpsell && (
                <ul className="space-y-2 text-xs text-emerald-300">
                  {['Doložka zajištění pohledávky (ručení, zástava, směnka)', 'Klauzule předčasného splacení a postoupení', 'Podrobné podmínky prodlení a úroků z prodlení', 'Doporučení k notářskému zápisu se svolením k vykonatelnosti'].map(f => (
                    <li key={f} className="flex items-start gap-2"><span>✓</span><span>{f}</span></li>
                  ))}
                </ul>
              )}
            </div>

            {/* Shrnutí a platba */}
            <div className={cardClass}>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Shrnutí objednávky</div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Smlouva o zápůjčce</span>
                  <span className="font-bold text-white">299 Kč</span>
                </div>
                {formData.notaryUpsell && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Prémiový balíček</span>
                    <span className="font-bold text-amber-400">+299 Kč</span>
                  </div>
                )}
                <div className="border-t border-white/8 pt-2 flex justify-between font-black text-lg">
                  <span>Celkem</span>
                  <span className="text-white">{formData.notaryUpsell ? '598' : '299'} Kč</span>
                </div>
              </div>
              <button onClick={handleSubmit} disabled={isProcessing}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-base uppercase rounded-2xl transition shadow-[0_0_30px_rgba(245,158,11,0.2)] disabled:opacity-60">
                {isProcessing ? 'Přesměrování...' : 'Zaplatit a stáhnout PDF'}
              </button>
              <p className="text-center text-xs text-slate-600 mt-3">Platba přes Stripe • PDF ke stažení ihned</p>
            </div>

            <a href="/" className="block text-center text-xs text-slate-600 hover:text-slate-400 transition">← Zpět na výběr smluv</a>
          </div>
        </div>
      </div>
    </main>
  );
}
