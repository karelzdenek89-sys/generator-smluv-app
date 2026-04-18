'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import ContractPreview from '@/app/components/ContractPreview';
import BuilderCheckoutSummary from '@/app/components/BuilderCheckoutSummary';
import BuilderTierSelector from '@/app/components/BuilderTierSelector';
import { buildContractSections } from '@/lib/contracts';
import type { StoredContractData } from '@/lib/contracts';
import PaymentModal from '@/app/components/PaymentModal';

type FormData = {
  landlordName: string; landlordId: string; landlordAddress: string; landlordEmail: string;
  tenantName: string; tenantId: string; tenantAddress: string; tenantEmail: string;
  flatAddress: string; flatLayout: string; flatUnitNumber: string; cadastralArea: string; floor: string; subleaseArea: string;
  landlordConsent: 'yes' | 'no'; consentDate: string; mainLeaseDate: string;
  startDate: string; duration: 'fixed' | 'indefinite'; endDate: string; noticePeriod: string;
  rentAmount: string; utilityAmount: string; depositAmount: string; paymentDay: string; bankAccount: string;
  maxOccupants: string; allowPets: boolean; allowSmoking: boolean; allowAirbnb: boolean;
  handoverDate: string; keysCount: string; equipmentList: string; knownDefects: string;
  contractDate: string; notaryUpsell: boolean;
  tier: 'basic' | 'complete';
  disputeResolution: 'court' | 'mediation' | 'arbitration';
};

const inputClass = 'w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';
const textareaClass = 'w-full min-h-[100px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';
const cardClass = 'bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<label className="block"><span className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</span>{children}</label>);
}
function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (<div className="mb-6"><div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90">{index}. {title}</div>{subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}</div>);
}
function Toggle({ name, checked, label, hint, onChange }: { name: string; checked: boolean; label: string; hint?: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className={`block rounded-2xl border p-4 cursor-pointer transition ${checked ? 'border-amber-500/70 bg-amber-500/10' : 'border-slate-700/80 bg-[#111c31]'}`}>
      <div className="flex items-start gap-3">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="mt-1 h-5 w-5 accent-amber-500" />
        <div>
          <div className="text-sm font-semibold text-white">{label}</div>
          {hint && <div className="mt-1 text-xs leading-relaxed text-slate-400">{hint}</div>}
        </div>
      </div>
    </label>
  );
}

export default function PodnajemuPage() {
  const [form, setForm] = useState<FormData>({
    landlordName: '', landlordId: '', landlordAddress: '', landlordEmail: '',
    tenantName: '', tenantId: '', tenantAddress: '', tenantEmail: '',
    flatAddress: '', flatLayout: '', flatUnitNumber: '', cadastralArea: '', floor: '', subleaseArea: '',
    landlordConsent: 'yes', consentDate: '', mainLeaseDate: '',
    startDate: '', duration: 'fixed', endDate: '', noticePeriod: '3',
    rentAmount: '', utilityAmount: '', depositAmount: '', paymentDay: '15', bankAccount: '',
    maxOccupants: '2', allowPets: false, allowSmoking: false, allowAirbnb: false,
    handoverDate: '', keysCount: '2', equipmentList: '', knownDefects: '',
    contractDate: '', notaryUpsell: false,
    tier: 'basic',
    disputeResolution: 'court' as const,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [withdrawalConsent, setWithdrawalConsent] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const risk = useMemo(() => {
    let score = 100;
    const warnings: { text: string; level: 'high' | 'medium' | 'low' }[] = [];

    if (!form.landlordId || !form.tenantId) {
      score -= 15;
      warnings.push({ text: 'Doplňte rodná čísla / data narození smluvních stran. Zvýšíte tím vymahatelnost smlouvy.', level: 'high' });
    }
    if (form.landlordConsent === 'no') {
      score -= 30;
      warnings.push({ text: 'Podnájem bez souhlasu pronajímatele je protiprávní a může vést k výpovědi hlavního nájmu.', level: 'high' });
    }
    if (!form.consentDate) {
      score -= 8;
      warnings.push({ text: 'Doplňte datum souhlasu pronajímatele k podnájmu.', level: 'medium' });
    }
    if (form.duration === 'fixed' && !form.endDate) {
      score -= 10;
      warnings.push({ text: 'U doby určité doplňte datum konce podnájmu.', level: 'high' });
    }
    if (!form.depositAmount || Number(form.depositAmount) < Number(form.rentAmount)) {
      score -= 10;
      warnings.push({ text: 'Doporučená doplnění: Kauce by měla být alespoň v rozsahu měsíčního nájemného.', level: 'medium' });
    }
    if (form.allowAirbnb) {
      score -= 20;
      warnings.push({ text: 'Povolení dalšího podnájmu / Airbnb je rizikové a může porušovat podmínky hlavní nájemní smlouvy.', level: 'high' });
    }
    if (!form.flatUnitNumber || !form.cadastralArea) {
      score -= 8;
      warnings.push({ text: 'Doplňte identifikaci bytu (číslo jednotky / katastrální území).', level: 'medium' });
    }
    score = Math.max(0, Math.min(100, score));
    return {
      score,
      warnings,
      label: score >= 85 ? 'Dobré nastavení' : score >= 65 ? 'Průměrná ochrana' : 'Doporučená doplnění',
    };
  }, [form]);

  const previewSections = useMemo(() => {
    try {
      if (!form.landlordName) return [];
      return buildContractSections({ ...form, contractType: 'sublease' } as StoredContractData);
    } catch {
      return [];
    }
  }, [form]);

  const scoreColor = risk.score >= 85 ? 'text-emerald-400' : risk.score >= 65 ? 'text-amber-400' : 'text-rose-400';

  const handlePayment = async () => {
    const required = [
      { field: form.landlordName, msg: 'Jméno podnajímatele' },
      { field: form.tenantName, msg: 'Jméno podnájemce' },
      { field: form.flatAddress, msg: 'Adresa bytu' },
      { field: form.rentAmount, msg: 'Výše nájemného' },
      { field: form.startDate, msg: 'Datum začátku podnájmu' },
    ];
    const missing = required.filter((r) => !r.field.trim()).map((r) => r.msg);
    if (form.duration === 'fixed' && !form.endDate) missing.push('Datum konce podnájmu');
    if (missing.length > 0) { alert(`Vyplňte prosím: ${missing.join(', ')}`); return; }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType: 'sublease',
          tier: form.tier,
          notaryUpsell: form.tier !== 'basic',
          payload: { ...form, contractType: 'sublease' },
          email: form.landlordEmail || form.tenantEmail || undefined,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || 'Nepodařilo se vytvořit platbu.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Chyba při zpracování platby.');
      setIsProcessing(false);
    }
  };

  return (
    <>
    <main className="min-h-screen bg-[#080f1e] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#080f1e]/95 backdrop-blur border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="text-amber-400 font-black text-lg tracking-tight">SmlouvaHned.cz</Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:block">Podnájemní smlouva</span>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
              {form.tier === 'complete' ? '199 Kč' : '99 Kč'}
            </span>
          </div>
        </div>
      </div>

      <ContractLandingSection
        badge="§ 2274 a násl. občanského zákoníku"
        h1Main="Podnájemní smlouva"
        h1Accent="online"
        subtitle="Vytvořte podnájemní smlouvu, pokud jako nájemce přenecháváte byt nebo jeho část do podnájmu. Dokument pokrývá výši podnájemného, podmínky užívání i práva podnájemce."
        benefits={[
          { icon: '⚖️', text: 'Sestaveno dle § 2274–2278 OZ (podnájem bytu)' },
          { icon: '📄', text: 'PDF ke stažení ihned po ověřené platbě' },
          { icon: '🏠', text: 'Vhodné pro podnájem celého bytu i jeho části' },
          { icon: '🔒', text: 'Jasně vymezená práva a povinnosti podnájemce' },
        ]}
        contents={[
          'Identifikaci nájemce (jako pronajímatele) a podnájemce',
          'Přesný popis předmětu podnájmu (byt nebo část)',
          'Výši podnájemného a způsob platby',
          'Dobu podnájmu a podmínky ukončení',
          'Práva a povinnosti podnájemce',
          'Podmínky užívání společných prostor',
          'Závěrečná ustanovení a GDPR',
        ]}
        whenSuitable={[
          'Jste nájemcem bytu a chcete část nebo celý byt přenechat podnájemci',
          'Spolubydlení — pronájem pokoje v bytě, který sami užíváte',
          'Dočasné přenechání bytu po dobu vaší nepřítomnosti',
          'Situace, kdy máte souhlas pronajímatele s podnájmem',
        ]}
        whenOther={[
          { label: 'Nájemní smlouva', href: '/najem', text: 'Pokud jste vlastník nemovitosti a uzavíráte nájemní vztah přímo s nájemcem.' },
        ]}
        faq={[
          { q: 'Potřebuji souhlas pronajímatele k podnájmu?', a: 'Obecně ano — § 2274 OZ vyžaduje souhlas pronajímatele, pokud v bytě nájemce sám nebydlí. Pokud v bytě sám bydlíte a přijímáte spolubydlícího, souhlas není nutný, ale pronajímatele je třeba o změně informovat.' },
          { q: 'Jaký je rozdíl mezi podnájmem a nájmem?', a: 'Podnájem vzniká, když nájemce přenechá byt (nebo jeho část) třetí osobě. Podnájemce nemá přímý vztah k vlastníkovi nemovitosti a jeho práva jsou odvozena od nájemce.' },
          { q: 'Co se stane, když skončí nájemní smlouva?', a: 'Ukončením nájemní smlouvy zaniká i podnájemní smlouva — podnájemce nemá právo nadále v bytě setrvat, pokud s ním vlastník neuzavře novou smlouvu.' },
          { q: 'Dostanu dokument ihned po zaplacení?', a: 'Ano, PDF je k dispozici ke stažení okamžitě po dokončení platby.' },
        ]}
        ctaLabel="Vytvořit podnájemní smlouvu"
        formId="formular"
        guideHref="/podnajemni-smlouva"
        guideLabel="Průvodce podnájemní smlouvou — souhlas pronajímatele, kauce a práva stran"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left column – form */}
          <div id="formular" className="lg:col-span-7 space-y-6">
            <div className="mb-6 border-t border-slate-800/60 pt-8"><h2 className="text-lg font-black text-white uppercase tracking-wide">Vyplňte údaje dokumentu</h2><p className="text-sm text-slate-500 mt-1">Všechna povinná pole jsou označena *</p></div>

            {/* 01 Podnajímatel */}
            <section className={cardClass}>
              <SectionTitle index="01" title="Podnajímatel" subtitle="Osoba, která podnajímá byt (nájemce z hlavní nájemní smlouvy)." />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno a příjmení *"><input name="landlordName" value={form.landlordName} onChange={handleChange} placeholder="Jan Novák" className={inputClass} /></Field>
                <Field label="Rodné číslo / datum nar."><input name="landlordId" value={form.landlordId} onChange={handleChange} placeholder="850101/1234" className={inputClass} /></Field>
                <Field label="Trvalé bydliště"><input name="landlordAddress" value={form.landlordAddress} onChange={handleChange} placeholder="Náměstí Míru 1, Praha 2" className={inputClass} /></Field>
                <Field label="E-mail"><input name="landlordEmail" type="email" value={form.landlordEmail} onChange={handleChange} placeholder="jan.novak@email.cz" className={inputClass} /></Field>
              </div>
            </section>

            {/* 02 Podnájemce */}
            <section className={cardClass}>
              <SectionTitle index="02" title="Podnájemce" subtitle="Osoba, která si byt pronajímá od podnajímatele." />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno a příjmení *"><input name="tenantName" value={form.tenantName} onChange={handleChange} placeholder="Petra Svobodová" className={inputClass} /></Field>
                <Field label="Rodné číslo / datum nar."><input name="tenantId" value={form.tenantId} onChange={handleChange} placeholder="900315/5678" className={inputClass} /></Field>
                <Field label="Trvalé bydliště"><input name="tenantAddress" value={form.tenantAddress} onChange={handleChange} placeholder="Dlouhá 5, Brno" className={inputClass} /></Field>
                <Field label="E-mail"><input name="tenantEmail" type="email" value={form.tenantEmail} onChange={handleChange} placeholder="petra@email.cz" className={inputClass} /></Field>
              </div>
            </section>

            {/* 03 Nemovitost */}
            <section className={cardClass}>
              <SectionTitle index="03" title="Předmět podnájmu" subtitle="Přesná identifikace bytu dle katastru nemovitostí." />
              <div className="space-y-4">
                <Field label="Adresa bytu *"><input name="flatAddress" value={form.flatAddress} onChange={handleChange} placeholder="Václavské náměstí 10, Praha 1, PSČ 110 00" className={inputClass} /></Field>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="Dispozice"><input name="flatLayout" value={form.flatLayout} onChange={handleChange} placeholder="2+1" className={inputClass} /></Field>
                  <Field label="Číslo jednotky"><input name="flatUnitNumber" value={form.flatUnitNumber} onChange={handleChange} placeholder="10/3" className={inputClass} /></Field>
                  <Field label="Podlaží"><input name="floor" value={form.floor} onChange={handleChange} placeholder="3. patro" className={inputClass} /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Katastrální území"><input name="cadastralArea" value={form.cadastralArea} onChange={handleChange} placeholder="Nové Město" className={inputClass} /></Field>
                  <Field label="Plocha podnájmu (m²)"><input name="subleaseArea" value={form.subleaseArea} onChange={handleChange} placeholder="52" className={inputClass} /></Field>
                </div>
              </div>
            </section>

            {/* 04 Souhlas pronajímatele */}
            <section className={cardClass}>
              <SectionTitle index="04" title="Souhlas pronajímatele" subtitle="Podnájem bytu vyžaduje souhlas vlastníka / hlavního pronajímatele dle § 2274 OZ." />
              <div className="space-y-4">
                <Field label="Souhlas pronajímatele byl udělen?">
                  <select aria-label="Ano, souhlas byl udělen" name="landlordConsent" value={form.landlordConsent} onChange={handleChange} className={inputClass}>
                    <option value="yes">Ano, souhlas byl udělen</option>
                    <option value="no">Ne (pozor – podnájem bez souhlasu je protiprávní)</option>
                  </select>
                </Field>
                {form.landlordConsent === 'yes' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Datum udělení souhlasu"><input name="consentDate" type="date" value={form.consentDate} onChange={handleChange} className={inputClass} /></Field>
                    <Field label="Datum hlavní nájemní smlouvy"><input name="mainLeaseDate" type="date" value={form.mainLeaseDate} onChange={handleChange} className={inputClass} /></Field>
                  </div>
                )}
                {form.landlordConsent === 'no' && (
                  <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 px-4 py-3 text-sm text-rose-300">
                    ⚠ Podnájem bez souhlasu pronajímatele je porušením hlavní nájemní smlouvy a může vést k výpovědi nebo soudnímu sporu. Doporučujeme souhlas zajistit předem.
                  </div>
                )}
              </div>
            </section>

            {/* 05 Doba podnájmu */}
            <section className={cardClass}>
              <SectionTitle index="05" title="Doba podnájmu" />
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Typ doby">
                    <select aria-label="Doba určitá" name="duration" value={form.duration} onChange={handleChange} className={inputClass}>
                      <option value="fixed">Doba určitá</option>
                      <option value="indefinite">Doba neurčitá</option>
                    </select>
                  </Field>
                  <Field label="Výpovědní lhůta (měsíce)"><input name="noticePeriod" type="number" min="1" value={form.noticePeriod} onChange={handleChange} placeholder="3" className={inputClass} /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Začátek podnájmu *"><input name="startDate" type="date" value={form.startDate} onChange={handleChange} className={inputClass} /></Field>
                  {form.duration === 'fixed' && (
                    <Field label="Konec podnájmu *"><input name="endDate" type="date" value={form.endDate} onChange={handleChange} className={inputClass} /></Field>
                  )}
                </div>
                <Field label="Datum předání bytu"><input name="handoverDate" type="date" value={form.handoverDate} onChange={handleChange} className={inputClass} /></Field>
              </div>
            </section>

            {/* 06 Platby */}
            <section className={cardClass}>
              <SectionTitle index="06" title="Nájemné a platby" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nájemné (Kč/měsíc) *"><input name="rentAmount" type="number" value={form.rentAmount} onChange={handleChange} placeholder="12 000" className={inputClass} /></Field>
                <Field label="Zálohy na služby (Kč/měsíc)"><input name="utilityAmount" type="number" value={form.utilityAmount} onChange={handleChange} placeholder="2 000" className={inputClass} /></Field>
                <Field label="Kauce (Kč)"><input name="depositAmount" type="number" value={form.depositAmount} onChange={handleChange} placeholder="24 000" className={inputClass} /></Field>
                <Field label="Den splatnosti (1–31)"><input name="paymentDay" type="number" min="1" max="31" value={form.paymentDay} onChange={handleChange} placeholder="15" className={inputClass} /></Field>
                <Field label="Číslo účtu pronajímatele (IBAN/CZ)"><input name="bankAccount" value={form.bankAccount} onChange={handleChange} placeholder="CZ65 0800 0000 1920 0014 5399" className={inputClass} /></Field>
              </div>
              {form.rentAmount && (
                <div className="mt-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 px-4 py-3 text-sm text-amber-300">
                  Celkem měsíčně: <strong>{(Number(form.rentAmount) + Number(form.utilityAmount || 0)).toLocaleString('cs-CZ')} Kč</strong>
                </div>
              )}
            </section>

            {/* 07 Podmínky */}
            <section className={cardClass}>
              <SectionTitle index="07" title="Podmínky podnájmu" />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label="Max. počet osob v bytě"><input name="maxOccupants" type="number" min="1" value={form.maxOccupants} onChange={handleChange} placeholder="2" className={inputClass} /></Field>
                <Field label="Počet klíčů předaných podnájemci"><input name="keysCount" type="number" min="1" value={form.keysCount} onChange={handleChange} placeholder="2" className={inputClass} /></Field>
              </div>
              <div className="space-y-3">
                <Toggle name="allowPets" checked={form.allowPets} onChange={handleChange} label="Zvířata povolena" hint="Povoluje chov domácích zvířat v bytě." />
                <Toggle name="allowSmoking" checked={form.allowSmoking} onChange={handleChange} label="Kouření povoleno" hint="Podnájemce smí kouřit v prostorách bytu." />
                <Toggle name="allowAirbnb" checked={form.allowAirbnb} onChange={handleChange} label="Krátkodobý pronájem (Airbnb) povolen" hint="Podnájemce smí dále podnajímat byt třetím osobám. Vyžaduje souhlas vlastníka." />
              </div>
            </section>

            {/* 08 Předávací protokol */}
            <section className={cardClass}>
              <SectionTitle index="08" title="Předávací protokol" subtitle="Stav bytu a vybavení při předání. Chrání obě strany při vrácení kauce." />
              <div className="space-y-4">
                <Field label="Vybavení bytu (výčet)"><textarea name="equipmentList" value={form.equipmentList} onChange={handleChange} placeholder="Sporák, lednice, pračka, stůl, 2× židle…" className={textareaClass} /></Field>
                <Field label="Známé závady při předání"><textarea name="knownDefects" value={form.knownDefects} onChange={handleChange} placeholder="Poškrábaná podlaha v ložnici, chybějící klika u okna v kuchyni…" className={textareaClass} /></Field>
              </div>
            </section>

            {/* 09 Výběr balíčku */}
            <section className={cardClass}>
              <SectionTitle index="09" title="Vyberte úroveň zpracování dokumentu" subtitle="Zvolte variantu, která odpovídá vaší situaci a požadovanému rozsahu dokumentu." />
              <BuilderTierSelector
                contractType="sublease"
                tier={form.tier}
                onTierChange={(tier) => setForm((prev) => ({ ...prev, tier }))}
              />
            </section>

          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Watermarked document preview */}
            {previewSections.length > 0 && (
              <ContractPreview sections={previewSections} title="Podnájemní smlouva" />
            )}

            {/* Risk analysis */}
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Analýza smlouvy</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div>
                  <div className={`font-bold ${scoreColor}`}>{risk.label}</div>
                  <div className="text-xs text-slate-500">ze 100 bodů</div>
                </div>
              </div>
              {risk.warnings.length === 0
                ? <p className="text-sm text-emerald-400">✓ Podnájemní smlouva je v pořádku.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (
                    <li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-rose-500/10 text-rose-300' : 'bg-amber-500/10 text-amber-300'}`}>
                      {w.level === 'high' ? '⚠ ' : '▲ '}{w.text}
                    </li>
                  ))}</ul>
              }
            </div>

            {/* Payment card */}
            <div className={cardClass}>
              <BuilderCheckoutSummary
                contractType="sublease"
                tier={form.tier}
                documentLabel="Podnájemní smlouva"
                onUpgrade={() => setForm((prev) => ({ ...prev, tier: 'complete' }))}
              />

              {/* GDPR */}
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
        title="Podnájemní smlouva"
        tier={form.tier}
        onTierChange={(t) => setForm((prev) => ({ ...prev, tier: t }))}
        contractType="sublease"
        onPay={handlePayment}
        isProcessing={isProcessing}
        onClose={() => setShowPreviewModal(false)}
      />
    )}
    </>
  );
}


