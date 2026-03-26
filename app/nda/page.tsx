'use client';

import { useState, useMemo } from 'react';

type NdaFormData = {
  ndaType: 'unilateral' | 'bilateral';
  disclosingName: string;
  disclosingId: string;
  disclosingAddress: string;
  disclosingEmail: string;
  receivingName: string;
  receivingId: string;
  receivingAddress: string;
  receivingEmail: string;
  confidentialInfoDesc: string;
  purposeOfDisclosure: string;
  ndaDuration: string;
  confidentialityAfterTermination: string;
  penaltyAmount: string;
  nonSolicitation: boolean;
  nonSolicitationPeriod: string;
  nonCompete: boolean;
  nonCompetePeriod: string;
  nonCompeteScope: string;
  specialInfoCategories: string;
  notaryUpsell: boolean;
  tier: 'basic' | 'professional' | 'complete';
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

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-3 w-full p-3 rounded-xl border transition text-left ${checked ? 'border-amber-500/40 bg-amber-500/5 text-white' : 'border-slate-700/60 bg-white/3 text-slate-400'}`}
    >
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${checked ? 'border-amber-500 bg-amber-500' : 'border-slate-600'}`}>
        {checked && <span className="text-black text-[10px] font-black">✓</span>}
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

export default function NdaBuilderPage() {
  const [formData, setFormData] = useState<NdaFormData>({
    ndaType: 'unilateral',
    disclosingName: '',
    disclosingId: '',
    disclosingAddress: '',
    disclosingEmail: '',
    receivingName: '',
    receivingId: '',
    receivingAddress: '',
    receivingEmail: '',
    confidentialInfoDesc: '',
    purposeOfDisclosure: '',
    ndaDuration: '3 let',
    confidentialityAfterTermination: '5 let',
    penaltyAmount: '100000',
    nonSolicitation: false,
    nonSolicitationPeriod: '12 měsíců',
    nonCompete: false,
    nonCompetePeriod: '24 měsíců',
    nonCompeteScope: '',
    specialInfoCategories: '',
    notaryUpsell: false,
    tier: 'basic' as const,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);

  const set = (field: keyof NdaFormData, value: string | boolean) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const riskAnalysis = useMemo(() => {
    let score = 100;
    const warnings: { text: string; level: 'high' | 'medium' | 'low' }[] = [];
    if (!formData.disclosingId || !formData.receivingId) {
      score -= 12;
      warnings.push({ text: 'Chybí identifikační údaje jedné ze stran. Vymahatelnost může být oslabena.', level: 'medium' });
    }
    if (!formData.confidentialInfoDesc.trim()) {
      score -= 20;
      warnings.push({ text: 'Popis důvěrných informací je prázdný. Smlouva bez vymezení předmětu je nevymahatelná.', level: 'high' });
    }
    if (!formData.purposeOfDisclosure.trim()) {
      score -= 10;
      warnings.push({ text: 'Chybí účel sdílení informací. Bez účelu je rozsah závazku nejasný.', level: 'medium' });
    }
    if (!formData.penaltyAmount || Number(formData.penaltyAmount) < 50000) {
      score -= 8;
      warnings.push({ text: 'Smluvní pokuta pod 50 000 Kč je slabší motivace k dodržování mlčenlivosti.', level: 'low' });
    }
    if (formData.ndaType === 'bilateral' && (!formData.receivingAddress || !formData.disclosingAddress)) {
      score -= 5;
      warnings.push({ text: 'U oboustranné NDA doplňte adresy obou stran pro právní jistotu.', level: 'low' });
    }
    score = Math.max(0, Math.min(100, score));
    return {
      score,
      warnings,
      label: score >= 85 ? 'Silná ochrana' : score >= 65 ? 'Průměrná ochrana' : 'Slabší ochrana',
    };
  }, [formData]);

  const scoreColor = riskAnalysis.score >= 85 ? 'text-emerald-400' : riskAnalysis.score >= 65 ? 'text-amber-400' : 'text-rose-400';

  const handleSubmit = async () => {
    if (!formData.disclosingName || !formData.receivingName) {
      alert('Vyplňte prosím jména obou smluvních stran.');
      return;
    }
    if (!formData.confidentialInfoDesc.trim()) {
      alert('Vyplňte prosím popis důvěrných informací.');
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
          contractType: 'nda',
          tier: formData.tier,
          notaryUpsell: formData.tier !== 'basic',
          email: formData.disclosingEmail || formData.receivingEmail || undefined,
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
            <span>§ 1724 a násl. OZ + obch. tajemství § 504</span>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
            {formData.tier === 'complete' ? '749 Kč' : formData.tier === 'professional' ? '449 Kč' : '249 Kč'}
          </span>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 lg:px-8 pb-20">
        <div className="mb-8">
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-400 mb-2">Ochrana informací</div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tight text-white">SMLOUVA O MLČENLIVOSTI</h1>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">NDA pro ochranu obchodního tajemství, know-how, databází a citlivých informací. Vhodné pro byznysové spolupráce, zaměstnance i investory.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left column */}
          <div className="lg:col-span-7 space-y-6">

            {/* 01 Typ NDA */}
            <section className={cardClass}>
              <SectionTitle index="01" title="Typ NDA" />
              <div className="grid sm:grid-cols-2 gap-3">
                {(['unilateral', 'bilateral'] as const).map(type => (
                  <button key={type} onClick={() => set('ndaType', type)}
                    className={`p-4 rounded-2xl border text-left transition ${formData.ndaType === type ? 'border-amber-500/60 bg-amber-500/10' : 'border-slate-700 bg-white/3 hover:border-slate-600'}`}>
                    <div className="font-bold text-white text-sm mb-1">{type === 'unilateral' ? 'Jednostranná' : 'Oboustranná'}</div>
                    <div className="text-xs text-slate-400">
                      {type === 'unilateral' ? 'Jedna strana sdílí informace druhé.' : 'Obě strany si vzájemně sdílejí informace.'}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* 02 Poskytující strana */}
            <section className={cardClass}>
              <SectionTitle index="02" title="Poskytující strana" subtitle="Strana, která sdílí důvěrné informace." />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Jméno / název *</label>
                  <input value={formData.disclosingName} onChange={e => set('disclosingName', e.target.value)} placeholder="Acme s.r.o." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>IČO / rodné číslo</label>
                  <input value={formData.disclosingId} onChange={e => set('disclosingId', e.target.value)} placeholder="12345678" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Sídlo / adresa</label>
                  <input value={formData.disclosingAddress} onChange={e => set('disclosingAddress', e.target.value)} placeholder="Václavské nám. 1, Praha 1" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>E-mail</label>
                  <input type="email" value={formData.disclosingEmail} onChange={e => set('disclosingEmail', e.target.value)} placeholder="kontakt@acme.cz" className={inputClass} />
                </div>
              </div>
            </section>

            {/* 03 Přijímající strana */}
            <section className={cardClass}>
              <SectionTitle index="03" title="Přijímající strana" subtitle="Strana, která přijímá a chrání důvěrné informace." />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Jméno / název *</label>
                  <input value={formData.receivingName} onChange={e => set('receivingName', e.target.value)} placeholder="Jan Novák" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>IČO / rodné číslo</label>
                  <input value={formData.receivingId} onChange={e => set('receivingId', e.target.value)} placeholder="850101/1234" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Sídlo / adresa</label>
                  <input value={formData.receivingAddress} onChange={e => set('receivingAddress', e.target.value)} placeholder="Dlouhá 5, Brno" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>E-mail</label>
                  <input type="email" value={formData.receivingEmail} onChange={e => set('receivingEmail', e.target.value)} placeholder="jan.novak@email.cz" className={inputClass} />
                </div>
              </div>
            </section>

            {/* 04 Předmět a účel */}
            <section className={cardClass}>
              <SectionTitle index="04" title="Předmět a účel NDA" subtitle="Přesné vymezení chráněných informací je klíčem k vymahatelnosti." />
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Popis důvěrných informací *</label>
                  <textarea value={formData.confidentialInfoDesc} onChange={e => set('confidentialInfoDesc', e.target.value)}
                    placeholder="Obchodní strategie, cenové kalkulace, zdrojové kódy, databáze zákazníků, výrobní postupy…"
                    className={textareaClass} />
                  <p className="text-xs text-slate-500 mt-1">Čím přesnější popis, tím silnější ochrana v případě sporu.</p>
                </div>
                <div>
                  <label className={labelClass}>Účel sdílení informací</label>
                  <textarea value={formData.purposeOfDisclosure} onChange={e => set('purposeOfDisclosure', e.target.value)}
                    placeholder="Hodnocení potenciální obchodní spolupráce / vývoj softwarového produktu / due diligence…"
                    className={textareaClass} />
                </div>
                <div>
                  <label className={labelClass}>Zvláštní kategorie chráněných informací (volitelné)</label>
                  <input value={formData.specialInfoCategories} onChange={e => set('specialInfoCategories', e.target.value)}
                    placeholder="Osobní údaje, zdravotní záznamy, finanční data…" className={inputClass} />
                </div>
              </div>
            </section>

            {/* 05 Podmínky NDA */}
            <section className={cardClass}>
              <SectionTitle index="05" title="Podmínky a sankce" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Doba trvání NDA</label>
                  <input value={formData.ndaDuration} onChange={e => set('ndaDuration', e.target.value)} placeholder="3 let" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Důvěrnost po ukončení</label>
                  <input value={formData.confidentialityAfterTermination} onChange={e => set('confidentialityAfterTermination', e.target.value)} placeholder="5 let" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Smluvní pokuta (Kč)</label>
                  <input type="number" value={formData.penaltyAmount} onChange={e => set('penaltyAmount', e.target.value)} placeholder="100 000" className={inputClass} />
                  <p className="text-xs text-slate-500 mt-1">Min. 50 000 Kč pro reálnou odstrašující hodnotu.</p>
                </div>
              </div>
            </section>

            {/* 06 Volitelné doložky */}
            <section className={cardClass}>
              <SectionTitle index="06" title="Volitelné doložky" subtitle="Rozšiřte ochranu o zákaz přetahování zaměstnanců nebo zákaz konkurence." />
              <div className="space-y-3">
                <Toggle checked={formData.nonSolicitation} onChange={v => set('nonSolicitation', v)} label="Zákaz přetahování zaměstnanců / klientů" />
                {formData.nonSolicitation && (
                  <div className="ml-7">
                    <label className={labelClass}>Délka zákazu přetahování</label>
                    <input value={formData.nonSolicitationPeriod} onChange={e => set('nonSolicitationPeriod', e.target.value)} placeholder="12 měsíců" className={inputClass} />
                  </div>
                )}
                <Toggle checked={formData.nonCompete} onChange={v => set('nonCompete', v)} label="Zákaz konkurence" />
                {formData.nonCompete && (
                  <div className="ml-7 space-y-3">
                    <div>
                      <label className={labelClass}>Délka zákazu konkurence</label>
                      <input value={formData.nonCompetePeriod} onChange={e => set('nonCompetePeriod', e.target.value)} placeholder="24 měsíců" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Rozsah / odvětví</label>
                      <input value={formData.nonCompeteScope} onChange={e => set('nonCompeteScope', e.target.value)} placeholder="Vývoj CRM softwaru pro pojišťovny v ČR" className={inputClass} />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 07 Výběr balíčku */}
            <section className={cardClass}>
              <SectionTitle index="07" title="Výběr balíčku" subtitle="Zvolte úroveň ochrany odpovídající hodnotě sdílených informací." />
              <div className="space-y-3">
                {([
                  { value: 'basic', label: 'Základní dokument', price: '249 Kč', desc: 'Profesionální NDA dle OZ + obchodní tajemství v PDF.' },
                  { value: 'professional', label: 'Profesionální ochrana', price: '449 Kč', desc: 'Rozšířené klauzule, smluvní pokuty, odpovědnostní doložky.', recommended: true },
                  { value: 'complete', label: 'Kompletní balíček', price: '749 Kč', desc: 'Vše z Profesionální ochrany + instrukce k podpisu, checklist a 30denní archivace.' },
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
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-4">Analýza smlouvy</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{riskAnalysis.score}</div>
                <div>
                  <div className={`font-bold ${scoreColor}`}>{riskAnalysis.label}</div>
                  <div className="text-xs text-slate-500">ze 100 bodů</div>
                </div>
              </div>
              {riskAnalysis.warnings.length === 0
                ? <p className="text-sm text-emerald-400">✓ NDA je v pořádku.</p>
                : <ul className="space-y-2">{riskAnalysis.warnings.map((w, i) => (
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
                  <span className="text-slate-400">NDA smlouva</span>
                  <span className="font-bold text-white">249 Kč</span>
                </div>
                {formData.tier !== 'basic' && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">{formData.tier === 'complete' ? 'Kompletní balíček' : 'Profesionální ochrana'}</span>
                    <span className="font-bold text-amber-400">{formData.tier === 'complete' ? '+500 Kč' : '+200 Kč'}</span>
                  </div>
                )}
                <div className="border-t border-white/8 pt-2 flex justify-between font-black text-lg">
                  <span>Celkem</span>
                  <span className="text-white">{formData.tier === 'complete' ? '749' : formData.tier === 'professional' ? '449' : '249'} Kč</span>
                </div>
              </div>

              {/* GDPR */}
              <label className="flex items-start gap-3 mb-5 cursor-pointer">
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
                  `Zaplatit ${formData.tier === 'complete' ? '749 Kč' : formData.tier === 'professional' ? '449 Kč' : '249 Kč'} a stáhnout PDF →`
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
