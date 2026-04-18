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
  principalName: string; principalId: string; principalAddress: string; principalEmail: string;
  agentName: string; agentId: string; agentAddress: string; agentEmail: string;
  poaType: 'general' | 'property' | 'court' | 'company' | 'bank';
  propertyAddress: string; courtName: string; caseNumber: string;
  companyName: string; companyIco: string; companyScope: string; bankAccount: string; bankName: string;
  customScope: string;
  validUntil: string; singleUse: boolean; allowSubstitution: boolean;
  contractDate: string; notaryUpsell: boolean;
  tier: 'basic' | 'complete';
};

const inputClass = 'site-input';
const cardClass = 'builder-card p-6';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><label className="site-form-label">{label}</label>{children}</div>);
}
function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (<div className="mb-6"><div className="builder-kicker">{index}. {title}</div>{subtitle && <p className="builder-help mt-2 text-sm">{subtitle}</p>}</div>);
}

export default function PlnaMocPage() {
  const [form, setForm] = useState<FormData>({
    principalName: '', principalId: '', principalAddress: '', principalEmail: '',
    agentName: '', agentId: '', agentAddress: '', agentEmail: '',
    poaType: 'general',
    propertyAddress: '', courtName: '', caseNumber: '',
    companyName: '', companyIco: '', companyScope: '', bankAccount: '', bankName: '',
    customScope: '',
    validUntil: '', singleUse: false, allowSubstitution: false,
    contractDate: '', notaryUpsell: false,
    tier: 'basic' as const,
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
    if (!form.principalName || !form.principalId) { score -= 20; warnings.push({ text: 'Doplňte identifikaci zmocnitele.', level: 'high' }); }
    if (!form.agentName || !form.agentId) { score -= 20; warnings.push({ text: 'Doplňte identifikaci zmocněnce.', level: 'high' }); }
    if (form.poaType === 'general' && !form.customScope) { score -= 25; warnings.push({ text: 'Doplňte rozsah zmocnění.', level: 'high' }); }
    if (!form.validUntil && !form.singleUse) { score -= 5; warnings.push({ text: 'Platnost plné moci není omezena (platí do odvolání).', level: 'low' }); }
    if (form.notaryUpsell === false && (form.poaType === 'property' || form.poaType === 'company')) {
      score -= 10; warnings.push({ text: 'Pro nemovitosti a firmy doporučujeme úředně ověřený podpis (ověřená plná moc).', level: 'medium' });
    }
    return { score: Math.max(0, score), warnings, label: score >= 85 ? 'Kompletní plná moc' : score >= 65 ? 'Doporučená doplnění' : 'Doporučená doplnění' };
  }, [form]);

  const previewSections = useMemo(() => {
    try {
      if (!form.principalName) return [];
      return buildContractSections({ ...form, contractType: 'power_of_attorney' } as StoredContractData);
    } catch {
      return [];
    }
  }, [form]);

  const handlePayment = async () => {
    if (!form.principalName || !form.agentName) { alert('Vyplňte prosím jména zmocnitele a zmocněnce.'); return; }
    try {
      setIsProcessing(true);
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: 'power_of_attorney', tier: form.tier, notaryUpsell: form.tier !== 'basic', payload: { ...form, contractType: 'power_of_attorney' }, email: form.principalEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error();
      window.location.href = data.url;
    } catch { alert('Chyba platební brány.'); setIsProcessing(false); }
  };

  const scoreColor = risk.score >= 85 ? 'text-emerald-400' : risk.score >= 65 ? 'text-amber-400' : 'text-rose-400';

  const poaTypeLabels: Record<string, string> = {
    general: 'Obecná plná moc', property: 'Nemovitost', court: 'Soud / spor', company: 'Jednání za firmu', bank: 'Bankovní záležitosti',
  };

  const landingProps = {
    badge: '§ 441 a násl. občanského zákoníku',
    h1Main: 'Plná moc',
    h1Accent: 'online',
    subtitle: 'Vytvořte plnou moc pro zastoupení při právních jednáních, správě nemovitostí, zastupování v soudu nebo přístupu k bankovním účtům. Dokument jasně vymezuje rozsah zmocnění, dobu platnosti a případnou substituci.',
    benefits: [
      { icon: '⚖️', text: 'Sestaveno dle § 441–456 OZ — zastoupení na základě plné moci' },
      { icon: '📄', text: 'Okamžité PDF ke stažení po zaplacení' },
      { icon: '🔒', text: 'Pokrývá obecnou i speciální plnou moc (nemovitost, soud, banka)' },
      { icon: '📅', text: 'Jasně vymezená platnost a případné omezení zmocnění' },
    ],
    contents: [
      'Identifikaci zmocnitele (kdo plnou moc uděluje)',
      'Identifikaci zmocněnce (komu je zmocnění uděleno)',
      'Přesné vymezení rozsahu zmocnění',
      'Dobu platnosti plné moci',
      'Podmínky pro substitut (přenesení zmocnění)',
      'Platnost pro jednorázové nebo opakované jednání',
      'Závěrečná ustanovení a GDPR',
    ],
    whenSuitable: [
      'Zastupování při prodeji nebo koupi nemovitosti',
      'Zastupování v soudním nebo správním řízení',
      'Správa bankovního účtu v nepřítomnosti majitele',
      'Jednání jménem firmy nebo zastupování při podpisech dokumentů',
    ],
    whenOther: [
      { label: 'Smlouva o spolupráci', href: '/spoluprace', text: 'Pokud potřebujete dlouhodobý rámec spolupráce, nikoli jednorázové zmocnění.' },
    ],
    faq: [
      { q: 'Kdy je nutné ověřit podpis na plné moci?', a: 'Úřední ověření podpisu (legalizace) je vyžadováno tam, kde to zákon nebo příjemce dokumentu stanoví — typicky při prodeji nemovitostí, zastupování u katastrálního úřadu nebo při bankovních operacích. Pro běžné zastoupení při každodenních jednáních ověření není povinné.' },
      { q: 'Jak dlouho platí plná moc?', a: 'Plná moc platí po dobu uvedenou v dokumentu, nebo do jejího odvolání zmocnitelem. Bez časového omezení platí do odvolání nebo smrti zmocnitele.' },
      { q: 'Může zmocněnec přenést zmocnění na další osobu?', a: 'Pouze pokud to plná moc výslovně umožňuje — tzv. substituce. Bez tohoto ujednání nemůže zmocněnec nikoho dalšího zmocnit.' },
      { q: 'Je generální plná moc riskantní?', a: 'Plná moc s neomezeným rozsahem zmocnění je velmi silný dokument. Doporučujeme vždy přesně vymezit, k jakým jednáním je zmocněnec oprávněn — omezuje se tak riziko zneužití.' },
      { q: 'Dostanu dokument ihned po zaplacení?', a: 'Ano, PDF je k dispozici ke stažení okamžitě po dokončení platby.' },
    ],
    ctaLabel: 'Vytvořit plnou moc',
    formId: 'formular',
    guideHref: '/plna-moc-online',
    guideLabel: 'Průvodce plnou mocí — obecná, ověřená a generální plná moc',
  };

  return (
    <>
    <main className="site-page contract-builder font-sans pb-24">
      <header className="contract-builder-header">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-sm">SH</div>
            <div><div className="font-bold tracking-tight text-white">SmlouvaHned</div><div className="text-[11px] text-slate-500">Plná moc</div></div>
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

            <section className={cardClass}>
              <SectionTitle index="01" title="Typ plné moci" subtitle="Vyberte typ — podle toho se přizpůsobí text zmocnění." />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(poaTypeLabels).map(([key, label]) => (
                  <label key={key} className={`cursor-pointer rounded-xl border p-3 text-center text-sm transition ${form.poaType === key ? 'border-amber-500 bg-amber-500/10 text-white font-bold' : 'border-slate-700/60 text-slate-400 hover:border-slate-500'}`}>
                    <input type="radio" name="poaType" value={key} checked={form.poaType === key} onChange={set} className="hidden" />
                    {label}
                  </label>
                ))}
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="02" title="Zmocnitel" subtitle="Osoba udělující plnou moc (oprávňující zmocněnce jednat)." />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno / název *"><input className={inputClass} name="principalName" value={form.principalName} onChange={set} placeholder="Jan Novák" /></Field>
                <Field label="Datum nar. / IČO *"><input className={inputClass} name="principalId" value={form.principalId} onChange={set} placeholder="01.01.1970" /></Field>
                <Field label="Trvalé bydliště / sídlo *"><input className={inputClass} name="principalAddress" value={form.principalAddress} onChange={set} placeholder="Ulice 1, Praha 1" /></Field>
                <Field label="E-mail"><input className={inputClass} name="principalEmail" value={form.principalEmail} onChange={set} type="email" placeholder="jan@email.cz" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="03" title="Zmocněnec" subtitle="Osoba, která bude jednat za zmocnitele." />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno / název *"><input className={inputClass} name="agentName" value={form.agentName} onChange={set} placeholder="Marie Nováková" /></Field>
                <Field label="Datum nar. / IČO *"><input className={inputClass} name="agentId" value={form.agentId} onChange={set} placeholder="05.05.1980" /></Field>
                <Field label="Trvalé bydliště / sídlo *"><input className={inputClass} name="agentAddress" value={form.agentAddress} onChange={set} placeholder="Ulice 5, Brno" /></Field>
                <Field label="E-mail"><input className={inputClass} name="agentEmail" value={form.agentEmail} onChange={set} type="email" placeholder="marie@email.cz" /></Field>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="04" title="Rozsah zmocnění" />
              <div className="space-y-4">
                {form.poaType === 'property' && <Field label="Adresa / specifikace nemovitosti *"><input className={inputClass} name="propertyAddress" value={form.propertyAddress} onChange={set} placeholder="Ulice 10, Praha 6, LV č. 123, KÚ Dejvice" /></Field>}
                {form.poaType === 'court' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Název soudu"><input className={inputClass} name="courtName" value={form.courtName} onChange={set} placeholder="Obvodní soud pro Prahu 1" /></Field>
                    <Field label="Sp. zn. / č.j."><input className={inputClass} name="caseNumber" value={form.caseNumber} onChange={set} placeholder="10 C 123/2026" /></Field>
                  </div>
                )}
                {form.poaType === 'company' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Název firmy"><input className={inputClass} name="companyName" value={form.companyName} onChange={set} placeholder="ABC s.r.o." /></Field>
                    <Field label="IČO firmy"><input className={inputClass} name="companyIco" value={form.companyIco} onChange={set} placeholder="12345678" /></Field>
                    <div className="sm:col-span-2"><Field label="Rozsah jednání"><input className={inputClass} name="companyScope" value={form.companyScope} onChange={set} placeholder="Valná hromada, podepisování smluv, jednání s úřady…" /></Field></div>
                  </div>
                )}
                {form.poaType === 'bank' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Číslo účtu"><input className={inputClass} name="bankAccount" value={form.bankAccount} onChange={set} placeholder="123456789/0800" /></Field>
                    <Field label="Banka"><input className={inputClass} name="bankName" value={form.bankName} onChange={set} placeholder="Česká spořitelna" /></Field>
                  </div>
                )}
                {form.poaType === 'general' && (
                  <Field label="Rozsah zmocnění (popište) *">
                    <textarea className="w-full min-h-[100px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="customScope" value={form.customScope} onChange={set} placeholder="Zastupování při přebírání zásilek, podpis smluv týkajících se…" />
                  </Field>
                )}
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="05" title="Platnost a podmínky" />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="Platná do (prázdné = do odvolání)"><input className={inputClass} name="validUntil" value={form.validUntil} onChange={set} type="date" /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className={`cursor-pointer rounded-xl border p-3 text-sm transition ${form.singleUse ? 'border-amber-500/60 bg-amber-500/8 text-white' : 'border-slate-700/60 text-slate-400 hover:border-slate-500'}`}>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="singleUse" checked={form.singleUse} onChange={set} className="h-4 w-4 accent-amber-500" />
                    <div>
                      <div className="font-semibold text-white">Jednorázová plná moc</div>
                      <div className="text-xs text-slate-400 mt-0.5">Platí jen pro jedno konkrétní jednání</div>
                    </div>
                  </div>
                </label>
                <label className={`cursor-pointer rounded-xl border p-3 text-sm transition ${form.allowSubstitution ? 'border-amber-500/60 bg-amber-500/8 text-white' : 'border-slate-700/60 text-slate-400 hover:border-slate-500'}`}>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="allowSubstitution" checked={form.allowSubstitution} onChange={set} className="h-4 w-4 accent-amber-500" />
                    <div>
                      <div className="font-semibold text-white">Substituce povolena</div>
                      <div className="text-xs text-slate-400 mt-0.5">Zmocněnec smí pověřit třetí osobu</div>
                    </div>
                  </div>
                </label>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="06" title="Vyberte úroveň zpracování dokumentu" subtitle="Zvolte variantu, která odpovídá vaší situaci a požadovanému rozsahu dokumentu." />
              <BuilderTierSelector
                contractType="power_of_attorney"
                tier={form.tier}
                onTierChange={(tier) =>
                  setForm((prev) => ({ ...prev, tier, notaryUpsell: tier !== 'basic' }))
                }
              />
            </section>

          </div>

          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Watermarked document preview */}
            {previewSections.length > 0 && (
              <ContractPreview sections={previewSections} title="Plná moc" />
            )}
            <div className={cardClass}>
              <div className="builder-kicker mb-4">Kontrola úplnosti</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div><div className={`font-bold ${scoreColor}`}>{risk.label}</div><div className="text-xs text-slate-500">ze 100 bodů</div></div>
              </div>
              {risk.warnings.length === 0 ? <p className="text-sm text-emerald-400">✓ Plná moc je kompletní.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (<li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-amber-500/10 text-amber-300' : w.level === 'medium' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-700/40 text-slate-400'}`}>{w.level === 'high' ? '⚠ ' : w.level === 'medium' ? '▲ ' : '○ '}{w.text}</li>))}</ul>}
            </div>
            <div className={cardClass}>
              <BuilderCheckoutSummary
                contractType="power_of_attorney"
                tier={form.tier}
                documentLabel="Plná moc"
                onUpgrade={() => setForm((prev) => ({ ...prev, tier: 'complete', notaryUpsell: true }))}
              />
              {(!form.principalName || !form.agentName) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3 text-xs text-slate-400 space-y-1">
                  <div className="font-semibold mb-1">Před platbou vyplňte:</div>
                  {!form.principalName && <div>• Jméno zmocnitele</div>}
                  {!form.agentName && <div>• Jméno zmocněnce</div>}
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
        title="Plná moc"
        tier={form.tier}
        onTierChange={(t) => setForm((prev) => ({ ...prev, tier: t }))}
        contractType="power_of_attorney"
        onPay={handlePayment}
        isProcessing={isProcessing}
        onClose={() => setShowPreviewModal(false)}
      />
    )}
    </>
  );
}


