'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import ContractPreview from '@/app/components/ContractPreview';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import BuilderCheckoutSummary from '@/app/components/BuilderCheckoutSummary';
import BuilderTierSelector from '@/app/components/BuilderTierSelector';
import { buildContractSections } from '@/lib/contracts';
import type { StoredContractData } from '@/lib/contracts';

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
  tier: 'basic' | 'complete';
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
    disputeResolution: 'court' as const,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [withdrawalConsent, setWithdrawalConsent] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState(false);

  const set = (field: keyof NdaFormData, value: string | boolean) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const riskAnalysis = useMemo(() => {
    let score = 100;
    const warnings: { text: string; level: 'high' | 'medium' | 'low' }[] = [];
    if (!formData.disclosingId || !formData.receivingId) {
      score -= 12;
      warnings.push({ text: 'Doplňte identifikační údaje jedné ze stran. Vymahatelnost může být oslabena.', level: 'medium' });
    }
    if (!formData.confidentialInfoDesc.trim()) {
      score -= 20;
      warnings.push({ text: 'Doplňte popis důvěrných informací. Smlouva bez vymezení předmětu je nevymahatelná.', level: 'high' });
    }
    if (!formData.purposeOfDisclosure.trim()) {
      score -= 10;
      warnings.push({ text: 'Doporučujeme vyplnit účel sdílení informací. Bez účelu je rozsah závazku nejasný.', level: 'medium' });
    }
    if (!formData.penaltyAmount || Number(formData.penaltyAmount) < 50000) {
      score -= 8;
      warnings.push({ text: 'Doporučujeme smluvní pokutu nad 50 000 Kč pro reálnou motivaci k dodržování mlčenlivosti.', level: 'low' });
    }
    if (formData.ndaType === 'bilateral' && (!formData.receivingAddress || !formData.disclosingAddress)) {
      score -= 5;
      warnings.push({ text: 'U oboustranné NDA doplňte adresy obou stran pro úplnost identifikace smluvních stran.', level: 'low' });
    }
    score = Math.max(0, Math.min(100, score));
    return {
      score,
      warnings,
      label: score >= 85 ? 'Dobré nastavení' : score >= 65 ? 'Průměrná ochrana' : 'Doporučená doplnění',
    };
  }, [formData]);

  const previewSections = useMemo(() => {
    try {
      if (!formData.disclosingName) return [];
      return buildContractSections({ ...formData, contractType: 'nda' } as StoredContractData);
    } catch {
      return [];
    }
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
        if (!withdrawalConsent) {
      setWithdrawalError(true);
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
    <main className="min-h-screen bg-[#05080f] text-slate-200 pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.07),transparent_30%)] pointer-events-none" />

      <header className="relative z-10 border-b border-white/5 bg-[#05080f]/80 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center text-xs font-black text-black">SH</div>
            <div>
              <div className="font-black text-white text-sm">SmlouvaHned</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500">Legal document builder</div>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />Platba zabezpečena Stripe</span>
            <span>•</span>
            <span>§ 1746 odst. 2 občanského zákoníku</span>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
            {formData.tier === 'complete' ? '199 Kč' : '99 Kč'}
          </span>
        </div>
      </header>

      <ContractLandingSection
        badge="§ 1746 odst. 2 občanského zákoníku"
        h1Main="NDA — smlouva o"
        h1Accent="mlčenlivosti online"
        subtitle="Vytvořte smlouvu o mlčenlivosti (NDA) pro ochranu důvěrných informací při obchodní spolupráci, jednáních nebo sdílení interních dat. Pokrývá rozsah důvěrných informací, dobu trvání závazku i sankce za porušení."
        benefits={[
          { icon: '🔐', text: 'Chrání obchodní tajemství, technická řešení i klientská data' },
          { icon: '⚖️', text: 'Sestaveno dle § 1746 OZ a § 504 OZ (obchodní tajemství)' },
          { icon: '📄', text: 'PDF ke stažení ihned po ověřené platbě' },
          { icon: '🔒', text: 'Pokrývá jednostranné i vzájemné NDA, zákaz konkurence' },
        ]}
        contents={[
          'Identifikaci stran (sdělující a přijímající strana)',
          'Definici důvěrných informací a jejich rozsahu',
          'Povinnosti přijímající strany (účel, uchování, omezení)',
          'Výjimky z mlčenlivosti (veřejně dostupné informace)',
          'Dobu trvání závazku mlčenlivosti',
          'Smluvní pokutu za porušení mlčenlivosti',
          'Volitelný zákaz konkurence (non-compete)',
          'Závěrečná ustanovení, GDPR a vyšší moc',
        ]}
        whenSuitable={[
          'Před obchodním jednáním, kde sdílíte citlivé informace',
          'Při zadávání projektu externistovi nebo dodavateli',
          'Při představení produktu nebo investorovi',
          'Kdykoli potřebujete ochranu interních dat, algoritmů nebo klientských databází',
        ]}
        whenOther={[
          { label: 'Smlouva o spolupráci', href: '/spoluprace', text: 'Pokud potřebujete mlčenlivost jako součást širšího smluvního rámce spolupráce.' },
          { label: 'Smlouva o poskytování služeb', href: '/sluzby', text: 'Pokud sdílíte informace v rámci servisního nebo dodavatelského vztahu.' },
        ]}
        faq={[
          { q: 'Co je NDA a kdy ho potřebuji?', a: 'NDA (Non-Disclosure Agreement) neboli smlouva o mlčenlivosti zavazuje příjemce informací k jejich utajení. Potřebujete ji vždy, když sdílíte citlivé informace — obchodní plány, technická řešení, klientské databáze — s někým, kdo není vázán jiným závazkem.' },
          { q: 'Jaký je rozdíl mezi jednostranným a vzájemným NDA?', a: 'Jednostranné NDA zavazuje pouze jednu stranu (typicky příjemce informací). Vzájemné NDA zavazuje obě strany — vhodné, pokud obě strany sdílejí citlivé informace navzájem.' },
          { q: 'Jak dlouho může závazek mlčenlivosti trvat?', a: 'Zákon délku neomezuje. Doporučujeme 2–5 let pro obchodní informace, u obchodního tajemství může být závazek sjednán bez časového omezení.' },
          { q: 'Je NDA vymahatelné?', a: 'Ano, při porušení závazku má sdělující strana právo na náhradu škody a při sjednané smluvní pokutě i na její zaplacení. Písemná forma je pro vymahatelnost zásadní.' },
          { q: 'Dostanu dokument ihned po zaplacení?', a: 'Ano, PDF je k dispozici ke stažení okamžitě po dokončení platby.' },
        ]}
        ctaLabel="Vytvořit smlouvu o mlčenlivosti"
        formId="formular"
        guideHref="/nda-smlouva"
        guideLabel="Průvodce NDA — jednostranná vs. oboustranná mlčenlivost a rozsah závazku"
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
                    <input value={formData.disclosingName} onChange={e => set('disclosingName', e.target.value)} placeholder="Acme s.r.o." aria-label="Jméno / název *" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>IČO / rodné číslo</label>
                    <input value={formData.disclosingId} onChange={e => set('disclosingId', e.target.value)} placeholder="12345678" aria-label="IČO / rodné číslo" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Sídlo / adresa</label>
                    <input value={formData.disclosingAddress} onChange={e => set('disclosingAddress', e.target.value)} placeholder="Václavské nám. 1, Praha 1" aria-label="Sídlo / adresa" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>E-mail</label>
                    <input type="email" value={formData.disclosingEmail} onChange={e => set('disclosingEmail', e.target.value)} placeholder="kontakt@acme.cz" aria-label="E-mail" className={inputClass} />
                  </div>
                </div>
              </section>

              {/* 03 Přijímající strana */}
              <section className={cardClass}>
                <SectionTitle index="03" title="Přijímající strana" subtitle="Strana, která přijímá a chrání důvěrné informace." />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Jméno / název *</label>
                    <input value={formData.receivingName} onChange={e => set('receivingName', e.target.value)} placeholder="Jan Novák" aria-label="Jméno / název *" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>IČO / rodné číslo</label>
                    <input value={formData.receivingId} onChange={e => set('receivingId', e.target.value)} placeholder="850101/1234" aria-label="IČO / rodné číslo" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Sídlo / adresa</label>
                    <input value={formData.receivingAddress} onChange={e => set('receivingAddress', e.target.value)} placeholder="Dlouhá 5, Brno" aria-label="Sídlo / adresa" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>E-mail</label>
                    <input type="email" value={formData.receivingEmail} onChange={e => set('receivingEmail', e.target.value)} placeholder="jan.novak@email.cz" aria-label="E-mail" className={inputClass} />
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
                      aria-label="Obchodní strategie, cenové kalkulace, zdrojové kódy, databáze zákazníků, výrobní postupy…"
                      className={textareaClass} />
                    <p className="text-xs text-slate-500 mt-1">Čím přesnější popis, tím silnější ochrana v případě sporu.</p>
                  </div>
                  <div>
                    <label className={labelClass}>Účel sdílení informací</label>
                    <textarea value={formData.purposeOfDisclosure} onChange={e => set('purposeOfDisclosure', e.target.value)}
                      placeholder="Hodnocení potenciální obchodní spolupráce / vývoj softwarového produktu / due diligence…"
                      aria-label="Hodnocení potenciální obchodní spolupráce / vývoj softwarového produktu / due diligence…"
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
                    <input value={formData.ndaDuration} onChange={e => set('ndaDuration', e.target.value)} placeholder="3 let" aria-label="Doba trvání NDA" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Důvěrnost po ukončení</label>
                    <input value={formData.confidentialityAfterTermination} onChange={e => set('confidentialityAfterTermination', e.target.value)} placeholder="5 let" aria-label="Důvěrnost po ukončení" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Smluvní pokuta (Kč)</label>
                    <input type="number" value={formData.penaltyAmount} onChange={e => set('penaltyAmount', e.target.value)} placeholder="100 000" aria-label="Smluvní pokuta (Kč)" className={inputClass} />
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
                      <input value={formData.nonSolicitationPeriod} onChange={e => set('nonSolicitationPeriod', e.target.value)} placeholder="12 měsíců" aria-label="Délka zákazu přetahování" className={inputClass} />
                    </div>
                  )}
                  <Toggle checked={formData.nonCompete} onChange={v => set('nonCompete', v)} label="Zákaz konkurence" />
                  {formData.nonCompete && (
                    <div className="ml-7 space-y-3">
                      <div>
                        <label className={labelClass}>Délka zákazu konkurence</label>
                        <input value={formData.nonCompetePeriod} onChange={e => set('nonCompetePeriod', e.target.value)} placeholder="24 měsíců" aria-label="Délka zákazu konkurence" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Rozsah / odvětví</label>
                        <input value={formData.nonCompeteScope} onChange={e => set('nonCompeteScope', e.target.value)} placeholder="Vývoj CRM softwaru pro pojišťovny v ČR" aria-label="Rozsah / odvětví" className={inputClass} />
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Řešení sporů */}
              <section className={cardClass}>
                <div className="mb-4">
                  <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Řešení sporů</div>
                  <select aria-label="Obecný soud (výchozí)" className={inputClass} name="disputeResolution" value={formData.disputeResolution} onChange={(e) => setFormData(p => ({ ...p, disputeResolution: e.target.value as 'court' | 'mediation' | 'arbitration' }))}>
                    <option value="court">Obecný soud (výchozí)</option>
                    <option value="mediation">Mediace (zákon č. 202/2012 Sb.)</option>
                    <option value="arbitration">Rozhodčí řízení (Rozhodčí soud HK ČR)</option>
                  </select>
                </div>
              </section>

              {/* 07 Vyberte úroveň zpracování dokumentu */}
              <section className={cardClass}>
                <SectionTitle index="07" title="Vyberte úroveň zpracování dokumentu" subtitle="Zvolte úroveň ochrany odpovídající hodnotě sdílených informací." />
                <BuilderTierSelector
                  contractType="nda"
                  tier={formData.tier}
                  onTierChange={(tier) =>
                    setFormData((prev) => ({ ...prev, tier, notaryUpsell: tier !== 'basic' }))
                  }
                />
              </section>
            </div>

          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Watermarked document preview */}
            {previewSections.length > 0 && (
              <ContractPreview sections={previewSections} title="Smlouva o mlčenlivosti (NDA)" />
            )}

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
              <BuilderCheckoutSummary
                contractType="nda"
                tier={formData.tier}
                documentLabel="NDA smlouva"
                onUpgrade={() => setFormData((prev) => ({ ...prev, tier: 'complete', notaryUpsell: true }))}
              />

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

                {/* § 1837 l) OZ — povinný souhlas s neodstoupením od smlouvy */}
                <label className="flex items-start gap-3 mb-1 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={withdrawalConsent}
                    onChange={(e) => {
                      setWithdrawalConsent(e.target.checked);
                      if (e.target.checked) setWithdrawalError(false);
                    }}
                    className="mt-0.5 h-4 w-4 flex-shrink-0 accent-amber-500"
                  />
                  <span className="text-xs leading-relaxed text-slate-400 group-hover:text-slate-300 transition">
                    Beru na vědomí, že objednávám digitální obsah, který bude ihned zpřístupněn po zaplacení.
                    Výslovně souhlasím s tím, že ztrácím právo na odstoupení od smlouvy ve lhůtě 14 dní dle{' '}
                    <a href="/obchodni-podminky" target="_blank" className="text-amber-400 underline hover:text-amber-300">
                      § 1837 písm. l) zákona č. 89/2012 Sb.
                    </a>
                  </span>
                </label>
                {withdrawalError && (
                  <p className="mb-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs text-rose-300">
                    Pro pokračování musíte souhlasit s podmínkami digitálního obsahu.
                  </p>
                )}

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
                  `Zaplatit ${formData.tier === 'complete' ? '199 Kč' : '99 Kč'} a stáhnout PDF →`
                )}
              </button>
              <p className="text-center text-xs text-slate-600 mt-3">🔒 Platba přes Stripe · PDF ke stažení ihned</p>
            </div>

            <Link href="/" className="block text-center text-xs text-slate-600 hover:text-slate-400 transition">← Zpět na výběr smluv</Link>
          </div>
        </div>
      </div>
    </main>
  );
}



