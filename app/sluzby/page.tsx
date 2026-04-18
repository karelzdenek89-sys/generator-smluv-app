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
  providerName: string; providerIco: string; providerAddress: string; providerEmail: string; providerPhone: string;
  clientName: string; clientId: string; clientAddress: string; clientEmail: string;
  serviceDescription: string; serviceDetails: string; deliverables: string;
  startDate: string; durationType: 'fixed' | 'indefinite'; endDate: string; noticePeriod: string;
  pricingType: 'hourly' | 'monthly_flat' | 'lump_sum';
  hourlyRate: string; monthlyFee: string; totalPrice: string; payDay: string;
  invoicePeriod: string; invoiceDueDays: string; lateInterest: string;
  vatPayer: 'yes' | 'no'; penaltyRate: string;
  ipOwnership: 'client' | 'provider';
  contractDate: string; notaryUpsell: boolean;
  tier: 'basic' | 'complete';
  disputeResolution: 'court' | 'mediation' | 'arbitration';
};

const inputClass = 'site-input';
const cardClass = 'builder-card p-6';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div><label className="site-form-label">{label}</label>{children}</div>
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

export default function SluzbyPage() {
  const [form, setForm] = useState<FormData>({
    providerName: '', providerIco: '', providerAddress: '', providerEmail: '', providerPhone: '',
    clientName: '', clientId: '', clientAddress: '', clientEmail: '',
    serviceDescription: '', serviceDetails: '', deliverables: '',
    startDate: '', durationType: 'indefinite', endDate: '', noticePeriod: '1',
    pricingType: 'monthly_flat',
    hourlyRate: '', monthlyFee: '', totalPrice: '', payDay: '15',
    invoicePeriod: 'měsíčně', invoiceDueDays: '14', lateInterest: '0,05',
    vatPayer: 'no', penaltyRate: '0,05',
    ipOwnership: 'client',
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
    if (!form.serviceDescription) { score -= 25; warnings.push({ text: 'Doplňte popis služeb — nejdůležitější část smlouvy.', level: 'high' }); }
    if (!form.providerIco && !form.clientId) { score -= 15; warnings.push({ text: 'Doplňte identifikaci stran (IČO/datum nar.).', level: 'high' }); }
    if (!form.hourlyRate && !form.monthlyFee && !form.totalPrice) { score -= 20; warnings.push({ text: 'Doplňte cenu — smlouva je nekompletní.', level: 'high' }); }
    if (!form.deliverables) { score -= 8; warnings.push({ text: 'Bez specifikace výstupů mohou vzniknout spory o plnění.', level: 'medium' }); }
    return { score: Math.max(0, score), warnings, label: score >= 85 ? 'Silná smlouva' : score >= 65 ? 'Průměrná ochrana' : 'Doporučená doplnění' };
  }, [form]);

  const previewSections = useMemo(() => {
    try {
      if (!form.providerName) return [];
      return buildContractSections({ ...form, contractType: 'service' } as StoredContractData);
    } catch {
      return [];
    }
  }, [form]);

  const handlePayment = async () => {
    try {
    setIsProcessing(true);
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: 'service', tier: form.tier, notaryUpsell: form.tier !== 'basic', payload: { ...form, contractType: 'service' }, email: form.clientEmail || form.providerEmail }),
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
            <div>
              <div className="font-bold tracking-tight text-white">SmlouvaHned</div>
              <div className="text-[11px] text-slate-500">Smlouva o poskytování služeb — § 1746 OZ</div>
            </div>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-sm text-slate-400 hover:text-white transition">Zavřít</button>
        </div>
      </header>

      <ContractLandingSection
        badge="§ 1746 odst. 2 občanského zákoníku"
        h1Main="Smlouva o poskytování"
        h1Accent="služeb online"
        subtitle="Vytvořte smlouvu o poskytování služeb pro kontinuální nebo opakovanou spolupráci mezi poskytovatelem a klientem. Vhodné pro freelancery, OSVČ i firmy — pokrývá cenu, fakturaci, IP práva a podmínky ukončení."
        benefits={[
          { icon: '⚖️', text: 'Inominátní smlouva dle § 1746 OZ — flexibilní základ pro B2B i B2C' },
          { icon: '📄', text: 'Okamžité PDF ke stažení po zaplacení' },
          { icon: '💼', text: 'Pokrývá hodinovou i paušální cenu, fakturaci a IP práva' },
          { icon: '🔒', text: 'Jasně vymezená odpovědnost, výpovědní podmínky a sankce' },
        ]}
        contents={[
          'Identifikaci poskytovatele a klienta',
          'Popis poskytovaných služeb a výstupů',
          'Cenu služeb (hodinová sazba nebo měsíční paušál)',
          'Fakturační cyklus a splatnost',
          'Vlastnictví duševního vlastnictví vzniklého při plnění',
          'Výpovědní dobu a podmínky ukončení smlouvy',
          'Smluvní pokuty a sankce za prodlení',
          'Závěrečná ustanovení, GDPR a vyšší moc',
        ]}
        whenSuitable={[
          'Kontinuální nebo opakovaná spolupráce s OSVČ nebo firmou',
          'Marketing, grafický design, programování nebo jiné odborné služby na fakturu',
          'Vztahy, kde je klíčové ošetřit duševní vlastnictví a podmínky ukončení',
          'B2B smlouvy bez vzniku pracovněprávního vztahu',
        ]}
        whenOther={[
          { label: 'Smlouva o dílo', href: '/smlouva-o-dilo', text: 'Pro jednorázové výsledky — zhotovení konkrétního díla s předáním a akceptací (stavba, vývoj softwaru jako projekt).' },
          { label: 'Dohoda o provedení práce (DPP)', href: '/dpp', text: 'Pokud jde o fyzickou osobu vykonávající práci v pracovněprávním vztahu do 300 hodin ročně.' },
        ]}
        faq={[
          { q: 'Jaký je rozdíl mezi smlouvou o službách a smlouvou o dílo?', a: 'Smlouva o poskytování služeb pokrývá průběžné nebo opakované plnění (měsíční paušál za marketing, IT správu apod.). Smlouva o dílo je zaměřena na konkrétní výsledek — dílo, které se předává a přijímá (dokončená stavba, webová stránka).' },
          { q: 'Je smlouva vhodná i pro zahraniční klienty?', a: 'Dokument je sestaven dle českého práva. Pro zahraniční vztahy doporučujeme doplnit ujednání o rozhodném právu a jurisdikci.' },
          { q: 'Kdo vlastní výstupy — já nebo klient?', a: 'Závisí na smluvním ujednání. Formulář umožňuje zvolit, zda IP práva přechází na klienta, nebo zůstávají poskytovateli. Bez explicitního ujednání může být situace sporná.' },
          { q: 'Dostanu dokument ihned po zaplacení?', a: 'Ano, PDF je k dispozici ke stažení okamžitě po dokončení platby.' },
        ]}
        ctaLabel="Vytvořit smlouvu o službách"
        formId="formular"
        guideHref="/smlouva-o-sluzbach"
        guideLabel="Průvodce smlouvou o službách — SLA, IP práva, mlčenlivost a paušál"
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
                <SectionTitle index="01" title="Poskytovatel služeb" subtitle="Freelancer, agentura nebo firma poskytující služby." />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Jméno / název *"><input className={inputClass} name="providerName" value={form.providerName} onChange={set} placeholder="Jan Novák, webdesigner" /></Field>
                  <Field label="IČO (OSVČ/firma)"><input className={inputClass} name="providerIco" value={form.providerIco} onChange={set} placeholder="12345678" /></Field>
                  <Field label="Adresa / sídlo *"><input className={inputClass} name="providerAddress" value={form.providerAddress} onChange={set} placeholder="Ulice 1, Praha 5" /></Field>
                  <Field label="E-mail *"><input className={inputClass} name="providerEmail" value={form.providerEmail} onChange={set} type="email" placeholder="jan@studio.cz" /></Field>
                  <Field label="Telefon"><input className={inputClass} name="providerPhone" value={form.providerPhone} onChange={set} placeholder="+420 600 000 000" /></Field>
                  <Field label="Plátce DPH">
                    <select className={inputClass} name="vatPayer" value={form.vatPayer} onChange={set}>
                      <option value="no">Neplátce DPH</option>
                      <option value="yes">Plátce DPH</option>
                    </select>
                  </Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="02" title="Objednatel" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Jméno / název *"><input className={inputClass} name="clientName" value={form.clientName} onChange={set} placeholder="XYZ s.r.o." /></Field>
                  <Field label="IČO / datum nar. *"><input className={inputClass} name="clientId" value={form.clientId} onChange={set} placeholder="87654321" /></Field>
                  <Field label="Adresa / sídlo *"><input className={inputClass} name="clientAddress" value={form.clientAddress} onChange={set} placeholder="Náměstí 5, Brno" /></Field>
                  <Field label="E-mail"><input className={inputClass} name="clientEmail" value={form.clientEmail} onChange={set} type="email" placeholder="info@firma.cz" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="03" title="Předmět a rozsah služeb" subtitle="Čím přesnější, tím menší riziko sporů o rozsah plnění." />
                <div className="space-y-4">
                  <Field label="Název / popis služeb *">
                    <textarea className="w-full min-h-[80px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="serviceDescription" value={form.serviceDescription} onChange={set} placeholder="Správa sociálních sítí, tvorba obsahu, SEO optimalizace…" />
                  </Field>
                  <Field label="Podrobná specifikace">
                    <textarea className="w-full min-h-[70px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="serviceDetails" value={form.serviceDetails} onChange={set} placeholder="2× týdně příspěvky na Instagram a Facebook, měsíční report, 4 blogové články/měsíc…" />
                  </Field>
                  <Field label="Výstupy / dodávky (co konkrétně objednatel dostane)">
                    <input className={inputClass} name="deliverables" value={form.deliverables} onChange={set} placeholder="Reporty, zdrojové soubory, přístup k analytics…" />
                  </Field>
                  <Field label="Zahájení služeb"><input className={inputClass} name="startDate" value={form.startDate} onChange={set} type="date" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="04" title="Trvání smlouvy" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Typ smlouvy">
                    <select className={inputClass} name="durationType" value={form.durationType} onChange={set}>
                      <option value="indefinite">Na dobu neurčitou</option>
                      <option value="fixed">Na dobu určitou</option>
                    </select>
                  </Field>
                  {form.durationType === 'fixed'
                    ? <Field label="Konec smlouvy"><input className={inputClass} name="endDate" value={form.endDate} onChange={set} type="date" /></Field>
                    : <Field label="Výpovědní doba (měsíce)"><input className={inputClass} name="noticePeriod" value={form.noticePeriod} onChange={set} type="number" /></Field>
                  }
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="05" title="Cena a fakturace" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Model ceny">
                    <select className={inputClass} name="pricingType" value={form.pricingType} onChange={set}>
                      <option value="monthly_flat">Měsíční paušál</option>
                      <option value="hourly">Hodinová sazba</option>
                      <option value="lump_sum">Pevná cena za projekt</option>
                    </select>
                  </Field>
                  {form.pricingType === 'hourly' && <Field label="Sazba (Kč/hod.)"><input className={inputClass} name="hourlyRate" value={form.hourlyRate} onChange={set} type="number" placeholder="1500" /></Field>}
                  {form.pricingType === 'monthly_flat' && <Field label="Měsíční paušál (Kč)"><input className={inputClass} name="monthlyFee" value={form.monthlyFee} onChange={set} type="number" placeholder="20000" /></Field>}
                  {form.pricingType === 'lump_sum' && <Field label="Celková cena (Kč)"><input className={inputClass} name="totalPrice" value={form.totalPrice} onChange={set} type="number" placeholder="80000" /></Field>}
                  {form.pricingType === 'monthly_flat' && <Field label="Splatnost (den v měsíci)"><input className={inputClass} name="payDay" value={form.payDay} onChange={set} type="number" /></Field>}
                  <Field label="Splatnost faktur (dní)"><input className={inputClass} name="invoiceDueDays" value={form.invoiceDueDays} onChange={set} type="number" /></Field>
                </div>
              </section>

              <section className={cardClass}>
                <SectionTitle index="06" title="Duševní vlastnictví" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Vlastnictví výstupů">
                    <select className={inputClass} name="ipOwnership" value={form.ipOwnership} onChange={set}>
                      <option value="client">Objednatel (výstupy patří klientovi)</option>
                      <option value="provider">Poskytovatel (licence klientovi)</option>
                    </select>
                  </Field>
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
                <div className="mt-6">
                  <BuilderTierSelector
                    contractType="service"
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
              <ContractPreview sections={previewSections} title="Smlouva o poskytování služeb" />
            )}
            <div className={cardClass}>
              <div className="builder-kicker mb-4">Kontrola úplnosti</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div><div className={`font-bold ${scoreColor}`}>{risk.label}</div><div className="text-xs text-slate-500">ze 100 bodů</div></div>
              </div>
              {risk.warnings.length === 0
                ? <p className="text-sm text-emerald-400">✓ Smlouva je kompletní.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (
                    <li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-rose-500/10 text-rose-300' : 'bg-amber-500/10 text-amber-300'}`}>
                      {w.level === 'high' ? '⚠ ' : '▲ '}{w.text}
                    </li>
                  ))}</ul>
              }
            </div>

            <div className={cardClass}>
              <BuilderCheckoutSummary
                contractType="service"
                tier={form.tier}
                documentLabel="Smlouva o službách"
                onUpgrade={() => setForm((prev) => ({ ...prev, tier: 'complete', notaryUpsell: true }))}
              />
              {(!form.providerName || !form.clientName || !form.serviceDescription) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3">
                  <div className="font-semibold mb-1 text-slate-400">Před platbou vyplňte:</div>
                  {!form.providerName && <div className="text-slate-400 text-sm">• Jméno poskytovatele</div>}
                  {!form.clientName && <div className="text-slate-400 text-sm">• Jméno objednatele</div>}
                  {!form.serviceDescription && <div className="text-slate-400 text-sm">• Popis služeb</div>}
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
        title="Smlouva o poskytování služeb"
        tier={form.tier}
        onTierChange={(t) => setForm((prev) => ({ ...prev, tier: t }))}
        contractType="service"
        onPay={handlePayment}
        isProcessing={isProcessing}
        onClose={() => setShowPreviewModal(false)}
      />
    )}
    </>
  );
}



