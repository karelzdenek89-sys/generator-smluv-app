'use client';

import { useMemo, useState } from 'react';
import ContractPreview from '@/app/components/ContractPreview';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import BuilderCheckoutSummary from '@/app/components/BuilderCheckoutSummary';
import BuilderTierSelector from '@/app/components/BuilderTierSelector';
import { buildContractSections } from '@/lib/contracts';
import type { StoredContractData } from '@/lib/contracts';
import PaymentModal from '@/app/components/PaymentModal';

type FormData = {
  partyAName: string; partyAId: string; partyAAddress: string; partyAEmail: string;
  partyBName: string; partyBId: string; partyBAddress: string; partyBEmail: string;
  cooperationScope: string; cooperationDetails: string; cooperationGoal: string;
  partyAContribution: string; partyBContribution: string;
  revenueModel: 'revenue_share' | 'fixed_fee' | 'custom';
  revenueShareA: string; revenueShareB: string; fixedFee: string; revenueDesc: string;
  ipSharing: 'joint' | 'partyA' | 'separate';
  coordinatorName: string;
  durationType: 'fixed' | 'indefinite'; startDate: string; endDate: string; noticePeriod: string;
  nonCompete: boolean; ndaPenalty: string;
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

export default function SpolupraceePage() {
  const [form, setForm] = useState<FormData>({
    partyAName: '', partyAId: '', partyAAddress: '', partyAEmail: '',
    partyBName: '', partyBId: '', partyBAddress: '', partyBEmail: '',
    cooperationScope: '', cooperationDetails: '', cooperationGoal: '',
    partyAContribution: '', partyBContribution: '',
    revenueModel: 'revenue_share',
    revenueShareA: '50', revenueShareB: '50', fixedFee: '', revenueDesc: '',
    ipSharing: 'joint',
    coordinatorName: '',
    durationType: 'indefinite', startDate: '', endDate: '', noticePeriod: '3',
    nonCompete: false, ndaPenalty: '100000',
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
    if (!form.cooperationScope) { score -= 25; warnings.push({ text: 'Doplňte předmět spolupráce — nejdůležitější část smlouvy.', level: 'high' }); }
    if (!form.partyAContribution || !form.partyBContribution) { score -= 15; warnings.push({ text: 'Doplňte příspěvky stran — může způsobit spory.', level: 'medium' }); }
    if (form.revenueModel === 'revenue_share' && Number(form.revenueShareA) + Number(form.revenueShareB) !== 100) { score -= 10; warnings.push({ text: 'Součet podílů na výnosech není 100 %.', level: 'high' }); }
    if (!form.notaryUpsell) { score -= 8; warnings.push({ text: 'Bez mlčenlivosti a zákazu konkurence hrozí zneužití informací.', level: 'medium' }); }
    return { score: Math.max(0, score), warnings, label: score >= 85 ? 'Silná smlouva' : score >= 65 ? 'Průměrná ochrana' : 'Doporučená doplnění' };
  }, [form]);

  const previewSections = useMemo(() => {
    try {
      if (!form.partyAName) return [];
      return buildContractSections({ ...form, contractType: 'cooperation' } as StoredContractData);
    } catch {
      return [];
    }
  }, [form]);

  const handlePayment = async () => {
    try {
    setIsProcessing(true);
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: 'cooperation', tier: form.tier, notaryUpsell: form.tier !== 'basic', payload: { ...form, contractType: 'cooperation' }, email: form.partyAEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error();
      window.location.href = data.url;
    } catch { alert('Chyba platební brány.'); setIsProcessing(false); }
  };

  const scoreColor = risk.score >= 85 ? 'text-emerald-400' : risk.score >= 65 ? 'text-amber-400' : 'text-rose-400';

  return (
    <>
    <main className="site-page contract-builder min-h-screen pb-24">
      <header className="contract-builder-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-sm">SH</div>
            <div><div className="font-bold tracking-tight text-white">SmlouvaHned</div><div className="text-[11px] text-slate-500">Smlouva o spolupráci</div></div>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-sm text-slate-400 hover:text-white transition">Zavřít</button>
        </div>
      </header>

      <ContractLandingSection
        badge="§ 1746 odst. 2 občanského zákoníku"
        h1Main="Smlouva o"
        h1Accent="spolupráci online"
        subtitle="Vytvořte smlouvu o spolupráci pro dlouhodobý obchodní vztah mezi OSVČ nebo firmami. Pokrývá rozdělení odpovědností, podíl na výnosech, duševní vlastnictví, mlčenlivost a podmínky ukončení."
        benefits={[
          { icon: '⚖️', text: 'Inominátní smlouva dle § 1746 OZ — pro obchodní partnerství' },
          { icon: '📄', text: 'Okamžité PDF ke stažení po zaplacení' },
          { icon: '🤝', text: 'Vhodné pro spolupráci OSVČ, freelancerů nebo firem' },
          { icon: '🔒', text: 'Pokrývá IP práva, mlčenlivost, zákaz konkurence a exit klauzule' },
        ]}
        contents={[
          'Identifikaci obou spolupracujících stran',
          'Popis a rozsah spolupráce',
          'Rozdělení odpovědností a výstupů',
          'Podíl na výnosech nebo honorář za spolupráci',
          'Vlastnictví duševního vlastnictví',
          'Závazek mlčenlivosti',
          'Zákaz konkurence a jeho rozsah',
          'Podmínky ukončení a vypořádání (exit klauzule)',
          'Závěrečná ustanovení, GDPR a vyšší moc',
        ]}
        whenSuitable={[
          'Dlouhodobá obchodní spolupráce dvou OSVČ nebo firem',
          'Společné projekty nebo výzkumné spolupráce',
          'Partnerství s podílem na výnosech nebo výsledcích',
          'Situace, kde je třeba jasně vymezit IP práva a mlčenlivost',
        ]}
        whenOther={[
          { label: 'Smlouva o dílo', href: '/smlouva-o-dilo', text: 'Pro jednorázové zhotovení konkrétního díla s předáním.' },
          { label: 'NDA (smlouva o mlčenlivosti)', href: '/nda', text: 'Pokud potřebujete pouze závazek mlčenlivosti bez dalšího smluvního rámce.' },
        ]}
        faq={[
          { q: 'Čím se smlouva o spolupráci liší od smlouvy o dílo?', a: 'Smlouva o spolupráci pokrývá dlouhodobý vztah s průběžným plněním a sdílenými cíli. Smlouva o dílo je zaměřena na jednorázový výsledek — dílo, které se zhotovuje a předává.' },
          { q: 'Je smlouva vhodná pro dvě fyzické osoby podnikající jako OSVČ?', a: 'Ano, smlouva je navržena právě pro spolupráci OSVČ nebo firem. Není vhodná pro vznik pracovního poměru.' },
          { q: 'Co jsou exit klauzule?', a: 'Ustanovení definující podmínky ukončení spolupráce — výpovědní doba, vypořádání pohledávek, přechod IP práv a případná kompenzace. Chrání obě strany při ukončení vztahu.' },
          { q: 'Dostanu dokument ihned po zaplacení?', a: 'Ano, PDF je k dispozici ke stažení okamžitě po dokončení platby.' },
        ]}
        ctaLabel="Vytvořit smlouvu o spolupráci"
        formId="formular"
        guideHref="/smlouva-o-spolupraci"
        guideLabel="Průvodce smlouvou o spolupráci — podíl na výnosech, IP práva a exit"
      />

      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">

            <div id="formular" className="space-y-6">
              <div className="mb-6 border-t border-slate-800/60 pt-8">
                <h2 className="text-lg font-black text-white uppercase tracking-wide">Vyplňte údaje dokumentu</h2>
                <p className="text-sm text-slate-500 mt-1">Všechna povinná pole jsou označena *</p>
              </div>

              <section className={cardClass}>
                <SectionTitle index="01" title="Strana A" subtitle="Jedna ze spolupracujících stran (osoba nebo firma)." />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Jméno / název *"><input className={inputClass} name="partyAName" value={form.partyAName} onChange={set} placeholder="Jan Novák / ABC s.r.o." /></Field>
                  <Field label="IČO / datum nar. *"><input className={inputClass} name="partyAId" value={form.partyAId} onChange={set} placeholder="12345678" /></Field>
                  <Field label="Adresa / sídlo *"><input className={inputClass} name="partyAAddress" value={form.partyAAddress} onChange={set} placeholder="Ulice 1, Praha" /></Field>
                  <Field label="E-mail"><input className={inputClass} name="partyAEmail" value={form.partyAEmail} onChange={set} type="email" placeholder="jan@firma.cz" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="02" title="Strana B" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Jméno / název *"><input className={inputClass} name="partyBName" value={form.partyBName} onChange={set} placeholder="Marie Svobodová / XYZ s.r.o." /></Field>
                  <Field label="IČO / datum nar. *"><input className={inputClass} name="partyBId" value={form.partyBId} onChange={set} placeholder="87654321" /></Field>
                  <Field label="Adresa / sídlo *"><input className={inputClass} name="partyBAddress" value={form.partyBAddress} onChange={set} placeholder="Ulice 5, Brno" /></Field>
                  <Field label="E-mail"><input className={inputClass} name="partyBEmail" value={form.partyBEmail} onChange={set} type="email" placeholder="marie@firma.cz" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="03" title="Předmět spolupráce" subtitle="Co budete společně dělat? Čím konkrétnější, tím lépe." />
                <div className="space-y-4">
                  <Field label="Oblast / popis spolupráce *">
                    <input className={inputClass} name="cooperationScope" value={form.cooperationScope} onChange={set} placeholder="Společný vývoj softwaru, marketingová kampaň, e-shop…" />
                  </Field>
                  <Field label="Podrobný popis (nepovinné)">
                    <textarea className="w-full min-h-[80px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="cooperationDetails" value={form.cooperationDetails} onChange={set} placeholder="Strana A dodá technologické řešení, Strana B zajistí obchodní kanály…" />
                  </Field>
                  <Field label="Cíl spolupráce"><input className={inputClass} name="cooperationGoal" value={form.cooperationGoal} onChange={set} placeholder="Uvedení produktu na trh do Q3 2026" /></Field>
                  <Field label="Začátek spolupráce"><input className={inputClass} name="startDate" value={form.startDate} onChange={set} type="date" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="04" title="Příspěvky stran" subtitle="Co každá strana přináší — know-how, práce, peníze, kontakty." />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={`${form.partyAName || 'Strana A'} přispívá`}>
                    <textarea className="w-full min-h-[70px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="partyAContribution" value={form.partyAContribution} onChange={set} placeholder="Technologie, vývoj, pracovní kapacita…" />
                  </Field>
                  <Field label={`${form.partyBName || 'Strana B'} přispívá`}>
                    <textarea className="w-full min-h-[70px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="partyBContribution" value={form.partyBContribution} onChange={set} placeholder="Obchodní kanály, klientela, finance…" />
                  </Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="05" title="Odměňování a rozdělení výnosů" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Model odměňování">
                    <select className={inputClass} name="revenueModel" value={form.revenueModel} onChange={set}>
                      <option value="revenue_share">Podíl na výnosech (%)</option>
                      <option value="fixed_fee">Pevná odměna za spolupráci</option>
                      <option value="custom">Vlastní popis</option>
                    </select>
                  </Field>
                  {form.revenueModel === 'revenue_share' && (
                    <>
                      <Field label={`Podíl ${form.partyAName || 'Strany A'} (%)`}><input className={inputClass} name="revenueShareA" value={form.revenueShareA} onChange={set} type="number" /></Field>
                      <Field label={`Podíl ${form.partyBName || 'Strany B'} (%)`}><input className={inputClass} name="revenueShareB" value={form.revenueShareB} onChange={set} type="number" /></Field>
                    </>
                  )}
                  {form.revenueModel === 'fixed_fee' && <Field label={`Pevná odměna ${form.partyBName || 'Straně B'} (Kč/měsíc)`}><input className={inputClass} name="fixedFee" value={form.fixedFee} onChange={set} type="number" placeholder="20000" /></Field>}
                  {form.revenueModel === 'custom' && <div className="sm:col-span-2"><Field label="Popis odměňování"><textarea className="w-full min-h-[70px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="revenueDesc" value={form.revenueDesc} onChange={set} placeholder="Popište způsob odměňování…" /></Field></div>}
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="06" title="Duševní vlastnictví a trvání" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Vlastnictví výstupů IP">
                    <select className={inputClass} name="ipSharing" value={form.ipSharing} onChange={set}>
                      <option value="joint">Společné vlastnictví (50/50)</option>
                      <option value="partyA">Náleží Straně A</option>
                      <option value="separate">Každý vlastní, co vytvořil</option>
                    </select>
                  </Field>
                  <Field label="Koordinátor (nepovinné)"><input className={inputClass} name="coordinatorName" value={form.coordinatorName} onChange={set} placeholder="Jan Novák" /></Field>
                  <Field label="Trvání smlouvy">
                    <select className={inputClass} name="durationType" value={form.durationType} onChange={set}>
                      <option value="indefinite">Na dobu neurčitou</option>
                      <option value="fixed">Na dobu určitou</option>
                    </select>
                  </Field>
                  {form.durationType === 'fixed' ? <Field label="Konec smlouvy"><input className={inputClass} name="endDate" value={form.endDate} onChange={set} type="date" /></Field> : <Field label="Výpovědní doba (měsíce)"><input className={inputClass} name="noticePeriod" value={form.noticePeriod} onChange={set} type="number" /></Field>}
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
                  {form.disputeResolution === 'arbitration' && (
                    <p className="mt-2 text-xs text-amber-400 leading-relaxed">⚠ Rozhodčí doložka není platná ve smlouvách se spotřebiteli (zákon č. 216/1994 Sb.). Použijte ji pouze pro vztahy B2B.</p>
                  )}
                  </select>
                </div>
                <div className="mt-6">
                  <BuilderTierSelector
                    contractType="cooperation"
                    tier={form.tier}
                    onTierChange={(tier) =>
                      setForm((prev) => ({ ...prev, tier, notaryUpsell: tier !== 'basic' }))
                    }
                  />
                </div>
              </section>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Watermarked document preview */}
            {previewSections.length > 0 && (
              <ContractPreview sections={previewSections} title="Smlouva o spolupráci" />
            )}
            <div className={cardClass}>
              <div className="builder-kicker mb-4">Kontrola úplnosti</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div><div className={`font-bold ${scoreColor}`}>{risk.label}</div><div className="text-xs text-slate-500">ze 100 bodů</div></div>
              </div>
              {risk.warnings.length === 0 ? <p className="text-sm text-emerald-400">✓ Smlouva o spolupráci je kompletní.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (<li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-rose-500/10 text-rose-300' : 'bg-amber-500/10 text-amber-300'}`}>{w.level === 'high' ? '⚠ ' : '▲ '}{w.text}</li>))}</ul>}
            </div>
            <div className={cardClass}>
              <BuilderCheckoutSummary
                contractType="cooperation"
                tier={form.tier}
                documentLabel="Smlouva o spolupráci"
                onUpgrade={() => setForm((prev) => ({ ...prev, tier: 'complete', notaryUpsell: true }))}
              />
              {(!form.partyAName || !form.partyBName || !form.cooperationScope) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3">
                  <div className="font-semibold mb-1 text-slate-400">Před platbou vyplňte:</div>
                  {!form.partyAName && <div className="text-slate-400 text-sm">• Jméno strany A</div>}
                  {!form.partyBName && <div className="text-slate-400 text-sm">• Jméno strany B</div>}
                  {!form.cooperationScope && <div className="text-slate-400 text-sm">• Předmět spolupráce</div>}
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
        title="Smlouva o spolupráci"
        tier={form.tier}
        onTierChange={(t) => setForm((prev) => ({ ...prev, tier: t }))}
        contractType="cooperation"
        onPay={handlePayment}
        isProcessing={isProcessing}
        onClose={() => setShowPreviewModal(false)}
      />
    )}
    </>
  );
}



