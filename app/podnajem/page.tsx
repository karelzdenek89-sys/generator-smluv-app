'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import ContractLandingSection from '@/app/components/ContractLandingSection';
import ContractPreview from '@/app/components/ContractPreview';
import BuilderCheckoutSummary from '@/app/components/BuilderCheckoutSummary';
import BuilderTierSelector from '@/app/components/BuilderTierSelector';
import type { StoredContractData } from '@/lib/contracts';
import { getSubleaseFormUi } from '@/lib/i18n/expat-builder-forms';
import { subleaseRiskWarnings, subleaseValidationFields } from '@/lib/i18n/expat-builder-risk';
import {
  buildExpatPreviewSections,
  getExpatPreviewLabels,
} from '@/lib/i18n/expat-contract-preview';
import PaymentModal from '@/app/components/PaymentModal';
import { BuilderLocaleNotice, useBuilderLocale } from '@/app/components/BuilderLocaleNotice';

type FormData = {
  landlordName: string; landlordId: string; landlordAddress: string; landlordEmail: string;
  tenantName: string; tenantId: string; tenantAddress: string; tenantEmail: string;
  flatAddress: string; flatLayout: string; flatUnitNumber: string; cadastralArea: string; floor: string; subleaseArea: string;
  landlordConsent: 'yes' | 'no'; consentDate: string; mainLeaseDate: string;
  startDate: string; duration: 'fixed' | 'indefinite'; endDate: string; noticePeriod: string;
  rentAmount: string; utilityAmount: string; depositAmount: string; paymentDay: string; bankAccount: string;
  minLatePenalty: string; breachPenalty: string; damagePenalty: string;
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
  const builderLocale = useBuilderLocale();
  const ui = useMemo(() => getSubleaseFormUi(builderLocale), [builderLocale]);
  const fl = (k: string, cs: string) => ui.fields[k] ?? cs;
  const sec = (k: string, title: string, subtitle?: string) => {
    const s = ui.sections[k];
    return { title: s?.title ?? title, subtitle: s?.subtitle ?? subtitle };
  };
  const previewLabels = useMemo(() => getExpatPreviewLabels(builderLocale), [builderLocale]);
  const [form, setForm] = useState<FormData>({
    landlordName: '', landlordId: '', landlordAddress: '', landlordEmail: '',
    tenantName: '', tenantId: '', tenantAddress: '', tenantEmail: '',
    flatAddress: '', flatLayout: '', flatUnitNumber: '', cadastralArea: '', floor: '', subleaseArea: '',
    landlordConsent: 'yes', consentDate: '', mainLeaseDate: '',
    startDate: '', duration: 'fixed', endDate: '', noticePeriod: '3',
    rentAmount: '', utilityAmount: '', depositAmount: '', paymentDay: '15', bankAccount: '',
    minLatePenalty: '', breachPenalty: '', damagePenalty: '',
    maxOccupants: '2', allowPets: false, allowSmoking: false, allowAirbnb: false,
    handoverDate: '', keysCount: '2', equipmentList: '', knownDefects: '',
    contractDate: '', notaryUpsell: false,
    tier: 'basic',
    disputeResolution: 'court' as const,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const validationFields = useMemo(
    () => subleaseValidationFields(builderLocale),
    [builderLocale],
  );

  const risk = useMemo(() => {
    const warnings = subleaseRiskWarnings(builderLocale, form);
    const penalty = warnings.reduce(
      (sum, w) => sum + (w.level === 'high' ? 18 : w.level === 'medium' ? 10 : 5),
      0,
    );
    const score = Math.max(0, Math.min(100, 100 - penalty));
    return {
      score,
      warnings,
      label:
        score >= 85 ? ui.risk.good : score >= 65 ? ui.risk.average : ui.risk.needsWork,
    };
  }, [form, builderLocale, ui.risk]);

  const previewSections = useMemo(() => {
    try {
      if (!form.landlordName) return [];
      return buildExpatPreviewSections('sublease', builderLocale, {
        ...form,
        contractType: 'sublease',
      } as StoredContractData);
    } catch {
      return [];
    }
  }, [form, builderLocale]);

  const scoreColor = risk.score >= 85 ? 'text-emerald-400' : risk.score >= 65 ? 'text-amber-400' : 'text-rose-400';

  const handlePayment = async () => {
    const missing: string[] = [];
    if (!form.landlordName.trim()) missing.push(validationFields.landlordName);
    if (!form.tenantName.trim()) missing.push(validationFields.tenantName);
    if (!form.flatAddress.trim()) missing.push(validationFields.flatAddress);
    if (!form.rentAmount.trim()) missing.push(validationFields.rentAmount);
    if (!form.startDate) {
      missing.push(
        builderLocale === 'cs'
          ? 'datum začátku podnájmu'
          : builderLocale === 'en'
            ? 'sublease start date'
            : 'дату початку піднайму',
      );
    }
    if (form.duration === 'fixed' && !form.endDate) {
      missing.push(
        builderLocale === 'cs'
          ? 'datum konce podnájmu'
          : builderLocale === 'en'
            ? 'sublease end date'
            : 'дату закінчення піднайму',
      );
    }
    if (missing.length > 0) {
      alert(`${ui.form.validationPrefix} ${missing.join(', ')}.`);
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractType: 'sublease',
          tier: form.tier,
          notaryUpsell: form.tier !== 'basic',
          lang: builderLocale,
          payload: { ...form, contractType: 'sublease', lang: builderLocale },
          email: form.landlordEmail || form.tenantEmail || undefined,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || 'Nepodařilo se vytvořit platbu.');
    } catch (err) {
      alert(err instanceof Error ? err.message : ui.form.paymentError);
      setIsProcessing(false);
    }
  };

  return (
    <>
    <BuilderLocaleNotice contractType="sublease" />
    <main className="min-h-screen bg-[#080f1e] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#080f1e]/95 backdrop-blur border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="text-amber-400 font-black text-lg tracking-tight">{ui.header.brand}</Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:block">{ui.header.docType}</span>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
              {form.tier === 'complete' ? '199 Kč' : '99 Kč'}
            </span>
          </div>
        </div>
      </div>

      <ContractLandingSection
        badge={ui.landing.badge}
        h1Main={ui.landing.h1Main}
        h1Accent={ui.landing.h1Accent}
        subtitle={ui.landing.subtitle}
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
        ctaLabel={ui.landing.ctaLabel}
        formId="formular"
        guideHref="/podnajemni-smlouva"
        guideLabel={ui.landing.guideLabel}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left column – form */}
          <div id="formular" className="lg:col-span-7 space-y-6">
            <div className="mb-6 border-t border-slate-800/60 pt-8"><h2 className="text-lg font-black text-white uppercase tracking-wide">{ui.form.title}</h2><p className="text-sm text-slate-500 mt-1">{ui.form.requiredHint}</p></div>

            {/* 01 Podnajímatel */}
            <section className={cardClass}>
              <SectionTitle index="01" title={sec('s01', 'Podnajímatel').title} subtitle={sec('s01', 'Podnajímatel', 'Osoba, která podnajímá byt (nájemce z hlavní nájemní smlouvy).').subtitle} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={fl('landlordName', 'Jméno a příjmení *')}><input name="landlordName" value={form.landlordName} onChange={handleChange} placeholder="Jan Novák" className={inputClass} /></Field>
                <Field label={fl('landlordId', 'Rodné číslo / datum nar.')}><input name="landlordId" value={form.landlordId} onChange={handleChange} placeholder="850101/1234" className={inputClass} /></Field>
                <Field label={fl('landlordAddress', 'Trvalé bydliště')}><input name="landlordAddress" value={form.landlordAddress} onChange={handleChange} placeholder="Náměstí Míru 1, Praha 2" className={inputClass} /></Field>
                <Field label={fl('landlordEmail', 'E-mail')}><input name="landlordEmail" type="email" value={form.landlordEmail} onChange={handleChange} placeholder="jan.novak@email.cz" className={inputClass} /></Field>
              </div>
            </section>

            {/* 02 Podnájemce */}
            <section className={cardClass}>
              <SectionTitle index="02" title={sec('s02', 'Podnájemce').title} subtitle={sec('s02', 'Podnájemce', 'Osoba, která si byt pronajímá od podnajímatele.').subtitle} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={fl('tenantName', 'Jméno a příjmení *')}><input name="tenantName" value={form.tenantName} onChange={handleChange} placeholder="Petra Svobodová" className={inputClass} /></Field>
                <Field label={fl('tenantId', 'Rodné číslo / datum nar.')}><input name="tenantId" value={form.tenantId} onChange={handleChange} placeholder="900315/5678" className={inputClass} /></Field>
                <Field label={fl('tenantAddress', 'Trvalé bydliště')}><input name="tenantAddress" value={form.tenantAddress} onChange={handleChange} placeholder="Dlouhá 5, Brno" className={inputClass} /></Field>
                <Field label={fl('tenantEmail', 'E-mail')}><input name="tenantEmail" type="email" value={form.tenantEmail} onChange={handleChange} placeholder="petra@email.cz" className={inputClass} /></Field>
              </div>
            </section>

            {/* 03 Nemovitost */}
            <section className={cardClass}>
              <SectionTitle index="03" title={sec('s03', 'Předmět podnájmu').title} subtitle={sec('s03', 'Předmět podnájmu', 'Přesná identifikace bytu dle katastru nemovitostí.').subtitle} />
              <div className="space-y-4">
                <Field label={fl('flatAddress', 'Adresa bytu *')}><input name="flatAddress" value={form.flatAddress} onChange={handleChange} placeholder="Václavské náměstí 10, Praha 1, PSČ 110 00" className={inputClass} /></Field>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label={fl('flatLayout', 'Dispozice')}><input name="flatLayout" value={form.flatLayout} onChange={handleChange} placeholder="2+1" className={inputClass} /></Field>
                  <Field label={fl('flatUnitNumber', 'Číslo jednotky')}><input name="flatUnitNumber" value={form.flatUnitNumber} onChange={handleChange} placeholder="10/3" className={inputClass} /></Field>
                  <Field label="Podlaží"><input name="floor" value={form.floor} onChange={handleChange} placeholder="3. patro" className={inputClass} /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={fl('cadastralArea', 'Katastrální území')}><input name="cadastralArea" value={form.cadastralArea} onChange={handleChange} placeholder="Nové Město" className={inputClass} /></Field>
                  <Field label={fl('subleaseArea', 'Plocha podnájmu (m²)')}><input name="subleaseArea" value={form.subleaseArea} onChange={handleChange} placeholder="52" className={inputClass} /></Field>
                </div>
              </div>
            </section>

            {/* 04 Souhlas pronajímatele */}
            <section className={cardClass}>
              <SectionTitle index="04" title={sec('s04', 'Souhlas pronajímatele').title} subtitle={sec('s04', 'Souhlas pronajímatele', 'Podnájem bytu vyžaduje souhlas vlastníka / hlavního pronajímatele dle § 2274 OZ.').subtitle} />
              <div className="space-y-4">
                <Field label={fl('landlordConsent', 'Souhlas pronajímatele byl udělen?')}>
                  <select aria-label={fl('consent_yes', 'Ano, souhlas byl udělen')} name="landlordConsent" value={form.landlordConsent} onChange={handleChange} className={inputClass}>
                    <option value="yes">{fl('consent_yes', 'Ano, souhlas byl udělen')}</option>
                    <option value="no">{fl('consent_no', 'Ne (pozor – podnájem bez souhlasu je protiprávní)')}</option>
                  </select>
                </Field>
                {form.landlordConsent === 'yes' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label={fl('consentDate', 'Datum udělení souhlasu')}><input name="consentDate" type="date" value={form.consentDate} onChange={handleChange} className={inputClass} /></Field>
                    <Field label={fl('mainLeaseDate', 'Datum hlavní nájemní smlouvy')}><input name="mainLeaseDate" type="date" value={form.mainLeaseDate} onChange={handleChange} className={inputClass} /></Field>
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
              <SectionTitle index="05" title={sec('s05', 'Doba podnájmu').title} />
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={fl('durationType', 'Typ doby')}>
                    <select aria-label="Doba určitá" name="duration" value={form.duration} onChange={handleChange} className={inputClass}>
                      <option value="fixed">{fl('duration_fixed', 'Doba určitá')}</option>
                      <option value="indefinite">{fl('duration_indefinite', 'Doba neurčitá')}</option>
                    </select>
                  </Field>
                  <Field label={fl('noticePeriod', 'Výpovědní lhůta (měsíce)')}><input name="noticePeriod" type="number" min="1" value={form.noticePeriod} onChange={handleChange} placeholder="3" className={inputClass} /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label={fl('startDate', 'Začátek podnájmu *')}><input name="startDate" type="date" value={form.startDate} onChange={handleChange} className={inputClass} /></Field>
                  {form.duration === 'fixed' && (
                    <Field label={fl('endDate', 'Konec podnájmu *')}><input name="endDate" type="date" value={form.endDate} onChange={handleChange} className={inputClass} /></Field>
                  )}
                </div>
                <Field label={fl('handoverDate', 'Datum předání bytu')}><input name="handoverDate" type="date" value={form.handoverDate} onChange={handleChange} className={inputClass} /></Field>
              </div>
            </section>

            {/* 06 Platby */}
            <section className={cardClass}>
              <SectionTitle index="06" title={sec('s06', 'Nájemné a platby').title} />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={fl('rentAmount', 'Nájemné (Kč/měsíc) *')}><input name="rentAmount" type="number" value={form.rentAmount} onChange={handleChange} placeholder="12 000" className={inputClass} /></Field>
                <Field label={fl('utilityAmount', 'Zálohy na služby (Kč/měsíc)')}><input name="utilityAmount" type="number" value={form.utilityAmount} onChange={handleChange} placeholder="2 000" className={inputClass} /></Field>
                <Field label={fl('depositAmount', 'Kauce (Kč)')}><input name="depositAmount" type="number" value={form.depositAmount} onChange={handleChange} placeholder="24 000" className={inputClass} /></Field>
                <Field label={fl('paymentDay', 'Den splatnosti (1–31)')}><input name="paymentDay" type="number" min="1" max="31" value={form.paymentDay} onChange={handleChange} placeholder="15" className={inputClass} /></Field>
                <Field label={fl('bankAccount', 'Číslo účtu pronajímatele (IBAN/CZ)')}><input name="bankAccount" value={form.bankAccount} onChange={handleChange} placeholder="CZ65 0800 0000 1920 0014 5399" className={inputClass} /></Field>
              </div>
              {form.tier === 'complete' && (
                <div className="mt-4 pt-4 border-t border-slate-800/60">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Smluvní pokuty (Rozšířený dokument)</div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field label={fl('minLatePenalty', 'Min. pokuta za den prodlení (Kč)')}><input name="minLatePenalty" type="number" value={form.minLatePenalty} onChange={handleChange} placeholder="200" className={inputClass} /></Field>
                    <Field label={fl('breachPenalty', 'Pokuta za porušení podmínek (Kč)')}><input name="breachPenalty" type="number" value={form.breachPenalty} onChange={handleChange} placeholder="20 000" className={inputClass} /></Field>
                    <Field label={fl('damagePenalty', 'Pokuta za poškození prostor (Kč)')}><input name="damagePenalty" type="number" value={form.damagePenalty} onChange={handleChange} placeholder="10 000" className={inputClass} /></Field>
                  </div>
                </div>
              )}
              {form.rentAmount && (
                <div className="mt-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 px-4 py-3 text-sm text-amber-300">
                  Celkem měsíčně: <strong>{(Number(form.rentAmount) + Number(form.utilityAmount || 0)).toLocaleString('cs-CZ')} Kč</strong>
                </div>
              )}
            </section>

            {/* 07 Podmínky */}
            <section className={cardClass}>
              <SectionTitle index="07" title={sec('s07', 'Podmínky podnájmu').title} />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <Field label={fl('maxOccupants', 'Max. počet osob v bytě')}><input name="maxOccupants" type="number" min="1" value={form.maxOccupants} onChange={handleChange} placeholder="2" className={inputClass} /></Field>
                <Field label={fl('keysCount', 'Počet klíčů předaných podnájemci')}><input name="keysCount" type="number" min="1" value={form.keysCount} onChange={handleChange} placeholder="2" className={inputClass} /></Field>
              </div>
              <div className="space-y-3">
                <Toggle name="allowPets" checked={form.allowPets} onChange={handleChange} label={fl('allowPets', 'Zvířata povolena')} hint="Povoluje chov domácích zvířat v bytě." />
                <Toggle name="allowSmoking" checked={form.allowSmoking} onChange={handleChange} label={fl('allowSmoking', 'Kouření povoleno')} hint="Podnájemce smí kouřit v prostorách bytu." />
                <Toggle name="allowAirbnb" checked={form.allowAirbnb} onChange={handleChange} label={fl('allowAirbnb', 'Krátkodobý pronájem (Airbnb) povolen')} hint="Podnájemce smí dále podnajímat byt třetím osobám. Vyžaduje souhlas vlastníka." />
              </div>
            </section>

            {/* 08 Předávací protokol */}
            <section className={cardClass}>
              <SectionTitle index="08" title={sec('s08', 'Předávací protokol').title} subtitle={sec('s08', 'Předávací protokol', 'Stav bytu a vybavení při předání. Chrání obě strany při vrácení kauce.').subtitle} />
              <div className="space-y-4">
                <Field label={fl('equipmentList', 'Vybavení bytu (výčet)')}><textarea name="equipmentList" value={form.equipmentList} onChange={handleChange} placeholder="Sporák, lednice, pračka, stůl, 2× židle…" className={textareaClass} /></Field>
                <Field label={fl('knownDefects', 'Známé závady při předání')}><textarea name="knownDefects" value={form.knownDefects} onChange={handleChange} placeholder="Poškrábaná podlaha v ložnici, chybějící klika u okna v kuchyni…" className={textareaClass} /></Field>
              </div>
            </section>

            {/* 09 Výběr balíčku */}
            <section className={cardClass}>
              <SectionTitle index="09" title={sec('s09', 'Vyberte úroveň zpracování dokumentu').title} subtitle={sec('s09', 'Vyberte úroveň zpracování dokumentu', 'Zvolte variantu, která odpovídá vaší situaci a požadovanému rozsahu dokumentu.').subtitle} />
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
              <ContractPreview sections={previewSections} title={ui.form.documentLabel} labels={previewLabels} />
            )}

            {/* Risk analysis */}
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">{ui.form.analysisTitle}</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div>
                  <div className={`font-bold ${scoreColor}`}>{risk.label}</div>
                  <div className="text-xs text-slate-500">{ui.form.scoreOf}</div>
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
                documentLabel={ui.form.documentLabel}
                onUpgrade={() => setForm((prev) => ({ ...prev, tier: 'complete' }))}
              />

              {/* GDPR */}
                              {/* Tlačítko generování */}
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.25)] active:scale-[0.98] uppercase tracking-tight"
                >
                  {ui.form.generate}
                </button>

                <p className="mt-3 text-center text-[11px] text-slate-500">
                  {ui.form.previewHint}
                </p>
            </div>
          </div>
        </div>
      </div>
    </main>
    {showPreviewModal && (
      <PaymentModal
        sections={previewSections}
        title={ui.form.documentLabel}
        tier={form.tier}
        onTierChange={(t) => setForm((prev) => ({ ...prev, tier: t }))}
        contractType="sublease"
        lang={builderLocale}
        onPay={handlePayment}
        isProcessing={isProcessing}
        onClose={() => setShowPreviewModal(false)}
      />
    )}
    </>
  );
}


