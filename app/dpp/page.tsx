'use client';

import { useMemo, useState } from 'react';
import ContractPreview from '@/app/components/ContractPreview';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import BuilderCheckoutSummary from '@/app/components/BuilderCheckoutSummary';
import BuilderTierSelector from '@/app/components/BuilderTierSelector';
import { buildContractSections } from '@/lib/contracts';
import type { StoredContractData } from '@/lib/contracts';

type FormData = {
  employerName: string; employerIco: string; employerAddress: string; employerEmail: string;
  employeeName: string; employeeBirth: string; employeeAddress: string; employeeEmail: string;
  taskDescription: string; taskDetails: string; workPlace: string; estimatedHours: string;
  durationType: 'fixed' | 'indefinite'; startDate: string; endDate: string; deadline: string;
  remunerationType: 'fixed' | 'hourly'; totalRemuneration: string; hourlyRate: string;
  paymentAccount: string; paymentDays: string;
  contractDate: string;
  notaryUpsell: boolean;
  tier: 'basic' | 'complete';
};

const inputClass = 'site-input';
const cardClass = 'builder-card p-6';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="site-form-label">{label}</label>
      {children}
    </div>
  );
}

function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="builder-kicker">{index}. {title}</div>
      {subtitle && <p className="builder-help mt-2 text-sm">{subtitle}</p>}
    </div>
  );
}

export default function DppPage() {
  const [form, setForm] = useState<FormData>({
    employerName: '', employerIco: '', employerAddress: '', employerEmail: '',
    employeeName: '', employeeBirth: '', employeeAddress: '', employeeEmail: '',
    taskDescription: '', taskDetails: '', workPlace: '', estimatedHours: '',
    durationType: 'fixed', startDate: '', endDate: '', deadline: '',
    remunerationType: 'fixed', totalRemuneration: '', hourlyRate: '',
    paymentAccount: '', paymentDays: '15',
    contractDate: '', notaryUpsell: false,
    tier: 'basic' as const,
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
    if (!form.taskDescription) { score -= 25; warnings.push({ text: 'Popis pracovního úkolu je povinný.', level: 'high' }); }
    if (!form.estimatedHours) { score -= 15; warnings.push({ text: 'Doplňte počet hodin — limit je 300 hod./rok u jednoho zaměstnavatele.', level: 'medium' }); }
    if (Number(form.estimatedHours) > 300) { score -= 30; warnings.push({ text: 'Počet hodin překračuje zákonný limit 300 hod./rok (§ 75 ZP)!', level: 'high' }); }
    if (!form.totalRemuneration && !form.hourlyRate) { score -= 15; warnings.push({ text: 'Doporučujeme doplnit odměnu.', level: 'medium' }); }
    return { score: Math.max(0, score), warnings, label: score >= 85 ? 'Bez rizik' : score >= 65 ? 'Drobná rizika' : 'Doporučená doplnění' };
  }, [form]);

  const previewSections = useMemo(() => {
    try {
      if (!form.employerName) return [];
      return buildContractSections({ ...form, contractType: 'dpp' } as StoredContractData);
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
        body: JSON.stringify({ contractType: 'dpp', tier: form.tier, notaryUpsell: form.tier !== 'basic', payload: { ...form, contractType: 'dpp' }, email: form.employerEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error();
      window.location.href = data.url;
    } catch { alert('Chyba platební brány.'); setIsProcessing(false); }
  };

  const scoreColor = risk.score >= 85 ? 'text-emerald-400' : risk.score >= 65 ? 'text-amber-400' : 'text-rose-400';

  return (
    <main className="site-page contract-builder min-h-screen pb-24">
      <header className="contract-builder-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-sm">SH</div>
            <div>
              <div className="font-bold tracking-tight text-white">SmlouvaHned</div>
              <div className="text-[11px] text-slate-500">Dohoda o provedení práce — § 75 ZP</div>
            </div>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-sm text-slate-400 hover:text-white transition">Zavřít</button>
        </div>
      </header>

      <ContractLandingSection
        badge="§ 75 zákoníku práce"
        h1Main="Dohoda o provedení"
        h1Accent="práce online"
        subtitle="Vytvořte dohodu o provedení práce (DPP) pro jednorázový nebo opakující se úkol mimo pracovní poměr. Vhodné pro brigády, sezónní výpomoc i krátkodobé projekty. Rozsah práce nesmí překročit 300 hodin ročně u jednoho zaměstnavatele."
        benefits={[
          { icon: '⚖️', text: 'Sestaveno dle § 75–76 zákoníku práce (zákon č. 262/2006 Sb.)' },
          { icon: '📄', text: 'Okamžité PDF ke stažení po zaplacení' },
          { icon: '👷', text: 'Vhodné pro brigády, výpomoci a jednorázové úkoly' },
          { icon: '🔒', text: 'Jasně vymezený rozsah práce, odměna a termín splnění' },
        ]}
        contents={[
          'Identifikaci zaměstnavatele a zaměstnance (brigádníka)',
          'Přesné vymezení pracovního úkolu',
          'Odměnu za provedení práce (celková nebo hodinová sazba)',
          'Časový rozsah a termín dokončení',
          'Místo výkonu práce',
          'Podmínky platby odměny',
          'Závěrečná ustanovení a GDPR',
        ]}
        whenSuitable={[
          'Brigáda, sezónní výpomoc nebo jednorázový úkol',
          'Rozsah do 300 hodin ročně u jednoho zaměstnavatele',
          'Situace, kdy není vhodný ani žádoucí plný pracovní poměr',
          'Menší projekty pro fyzické osoby nebo OSVČ vykonávající práci pro zaměstnavatele',
        ]}
        whenOther={[
          { label: 'Pracovní smlouva', href: '/pracovni', text: 'Pokud jde o pravidelný pracovní poměr s pevnou pracovní dobou a trvalým charakterem.' },
          { label: 'Smlouva o poskytování služeb', href: '/sluzby', text: 'Pokud spolupracujete s OSVČ nebo firmou — nikoliv se zaměstnancem v pracovněprávním vztahu.' },
        ]}
        faq={[
          { q: 'Jaký je rozdíl mezi DPP a pracovní smlouvou?', a: 'DPP je určena pro příležitostné nebo krátkodobé pracovní úkoly (max. 300 hodin ročně u jednoho zaměstnavatele). Pracovní smlouva zakládá trvalý pracovní poměr s pravidelnou pracovní dobou a zákonnou ochranou zaměstnance.' },
          { q: 'Jaký je limit hodin u DPP?', a: 'Zákoník práce stanoví maximálně 300 hodin ročně u jednoho zaměstnavatele. Při překročení tohoto limitu by bylo nutné uzavřít jiný typ pracovněprávního vztahu.' },
          { q: 'Musí být DPP písemná?', a: 'Ano, § 77 zákoníku práce vyžaduje písemnou formu DPP. Ústní dohoda není platná.' },
          { q: 'Platí se z DPP pojistné a daně?', a: 'Při odměně do 10 000 Kč měsíčně (u jednoho zaměstnavatele) se zpravidla neodvádí sociální ani zdravotní pojistné. Z odměny se odvádí daň z příjmů — přesný postup závisí na konkrétní situaci.' },
          { q: 'Dostanu dokument ihned po zaplacení?', a: 'Ano, PDF je k dispozici ke stažení okamžitě po dokončení platby.' },
        ]}
        ctaLabel="Vytvořit dohodu o provedení práce"
        formId="formular"
        guideHref="/dohoda-o-provedeni-prace"
        guideLabel="Průvodce DPP — kdy ji použít, limity hodin a zdanění v 2026"
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
                <SectionTitle index="01" title="Zaměstnavatel" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Název / jméno *"><input className={inputClass} name="employerName" value={form.employerName} onChange={set} placeholder="ABC s.r.o." /></Field>
                  <Field label="IČO *"><input className={inputClass} name="employerIco" value={form.employerIco} onChange={set} placeholder="12345678" /></Field>
                  <Field label="Sídlo / adresa *"><input className={inputClass} name="employerAddress" value={form.employerAddress} onChange={set} placeholder="Náměstí 1, Praha 1" /></Field>
                  <Field label="E-mail"><input className={inputClass} name="employerEmail" value={form.employerEmail} onChange={set} type="email" placeholder="info@firma.cz" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="02" title="Zaměstnanec (brigádník)" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Jméno a příjmení *"><input className={inputClass} name="employeeName" value={form.employeeName} onChange={set} placeholder="Tomáš Pokorný" /></Field>
                  <Field label="Datum narození *"><input className={inputClass} name="employeeBirth" value={form.employeeBirth} onChange={set} placeholder="15.06.2002" /></Field>
                  <Field label="Trvalé bydliště *"><input className={inputClass} name="employeeAddress" value={form.employeeAddress} onChange={set} placeholder="Ulice 5, Brno" /></Field>
                  <Field label="E-mail"><input className={inputClass} name="employeeEmail" value={form.employeeEmail} onChange={set} type="email" placeholder="tomas@email.cz" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="03" title="Pracovní úkol" subtitle="Popište co nejpřesněji — vyhne se sporům o rozsah a výsledek." />
                <div className="space-y-4">
                  <Field label="Druh práce / název úkolu *">
                    <input className={inputClass} name="taskDescription" value={form.taskDescription} onChange={set} placeholder="Obsluha letní akce, roznos letáků, překlad dokumentu…" />
                  </Field>
                  <Field label="Podrobný popis (nepovinné)">
                    <textarea className="w-full min-h-[80px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="taskDetails" value={form.taskDetails} onChange={set} placeholder="Překlady z angličtiny do češtiny, přibl. 10 000 slov, formát DOCX…" />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Místo výkonu práce"><input className={inputClass} name="workPlace" value={form.workPlace} onChange={set} placeholder="Praha nebo vzdáleně" /></Field>
                    <Field label="Předpokládaný rozsah (hod.) *">
                      <input className={inputClass} name="estimatedHours" value={form.estimatedHours} onChange={set} type="number" placeholder="20" />
                    </Field>
                  </div>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="04" title="Trvání a termín splnění" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Typ trvání">
                    <select className={inputClass} name="durationType" value={form.durationType} onChange={set}>
                      <option value="fixed">Na dobu určitou</option>
                      <option value="indefinite">Na dobu neurčitou</option>
                    </select>
                  </Field>
                  <Field label="Začátek"><input className={inputClass} name="startDate" value={form.startDate} onChange={set} type="date" /></Field>
                  {form.durationType === 'fixed' && <Field label="Konec"><input className={inputClass} name="endDate" value={form.endDate} onChange={set} type="date" /></Field>}
                  <Field label="Termín splnění úkolu (nejpozději)"><input className={inputClass} name="deadline" value={form.deadline} onChange={set} type="date" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="05" title="Odměna" subtitle="DPP bez odvodů SP/ZP do 10 000 Kč/měsíc u jednoho zaměstnavatele." />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Typ odměny">
                    <select className={inputClass} name="remunerationType" value={form.remunerationType} onChange={set}>
                      <option value="fixed">Paušální (za celý úkol)</option>
                      <option value="hourly">Hodinová sazba</option>
                    </select>
                  </Field>
                  {form.remunerationType === 'fixed'
                    ? <Field label="Celková odměna (Kč) *"><input className={inputClass} name="totalRemuneration" value={form.totalRemuneration} onChange={set} type="number" placeholder="5000" /></Field>
                    : <Field label="Hodinová sazba (Kč/hod.) *"><input className={inputClass} name="hourlyRate" value={form.hourlyRate} onChange={set} type="number" placeholder="180" /></Field>
                  }
                  <Field label="Číslo účtu (výplata)"><input className={inputClass} name="paymentAccount" value={form.paymentAccount} onChange={set} placeholder="123456789/0800" /></Field>
                  <Field label="Výplata do (dní po splnění)"><input className={inputClass} name="paymentDays" value={form.paymentDays} onChange={set} type="number" /></Field>
                </div>
              </section>

              <section className={cardClass}>

                <div className="mt-6">
                  <BuilderTierSelector
                    contractType="dpp"
                    tier={form.tier}
                    onTierChange={(tier) =>
                      setForm((prev) => ({ ...prev, tier, notaryUpsell: tier !== 'basic' }))
                    }
                  />
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Watermarked document preview */}
            {previewSections.length > 0 && (
              <ContractPreview sections={previewSections} title="Dohoda o provedení práce" />
            )}
            <div className={cardClass}>
              <div className="builder-kicker mb-4">Kontrola úplnosti</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div><div className={`font-bold ${scoreColor}`}>{risk.label}</div><div className="text-xs text-slate-500">ze 100 bodů</div></div>
              </div>
              {risk.warnings.length === 0
                ? <p className="text-sm text-emerald-400">✓ DPP je v pořádku.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (
                    <li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-rose-500/10 text-rose-300' : 'bg-amber-500/10 text-amber-300'}`}>
                      {w.level === 'high' ? '⚠ ' : '▲ '}{w.text}
                    </li>
                  ))}</ul>
              }
            </div>

            <div className={cardClass}>
              <BuilderCheckoutSummary
                contractType="dpp"
                tier={form.tier}
                documentLabel="Dohoda o provedení práce"
                onUpgrade={() => setForm((prev) => ({ ...prev, tier: 'complete', notaryUpsell: true }))}
              />
              {(!form.employerName || !form.employeeName || !form.taskDescription) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3 text-xs text-slate-400 space-y-1">
                  <div className="font-semibold mb-1">Vyplňte pro pokračování:</div>
                  {!form.employerName && <div>• Název zaměstnavatele</div>}
                  {!form.employeeName && <div>• Jméno zaměstnance</div>}
                  {!form.taskDescription && <div>• Popis pracovního úkolu</div>}
                </div>
              )}
              <label className="flex items-start gap-3 mb-4 mt-4 cursor-pointer">
                <input type="checkbox" checked={gdprConsent} onChange={(e) => setGdprConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-amber-500 flex-shrink-0" />
                <span className="text-xs text-slate-400 leading-relaxed">
                  Souhlasím se{' '}
                  <a href="/gdpr" className="text-amber-400 underline hover:text-amber-300" target="_blank" rel="noopener noreferrer">zpracováním osobních údajů</a>
                  {' '}a{' '}
                  <a href="/obchodni-podminky" className="text-amber-400 underline hover:text-amber-300" target="_blank" rel="noopener noreferrer">obchodními podmínkami</a>.
                </span>
              </label>
              <button onClick={handlePayment} disabled={isProcessing || !gdprConsent || !form.employerName || !form.employeeName || !form.taskDescription}
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



