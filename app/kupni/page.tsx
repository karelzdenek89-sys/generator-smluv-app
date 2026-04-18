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
  sellerName: string; sellerId: string; sellerAddress: string; sellerEmail: string; sellerPhone: string; sellerBankAccount: string;
  buyerName: string; buyerId: string; buyerAddress: string; buyerEmail: string; buyerPhone: string;
  itemType: 'general' | 'electronics' | 'car';
  itemDescription: string; serialNumber: string; carMake: string; carModel: string; carVIN: string; carPlate: string; carYear: string; carMileage: string;
  price: string; currency: string; priceWords: string; paymentMethod: 'cash' | 'transfer' | 'escrow'; paymentDays: string; variableSymbol: string;
  itemCondition: string; knownDefects: string; handoverDate: string; handoverPlace: string; warrantyMonths: string;
  contractDate: string;
  notaryUpsell: boolean;
  tier: 'basic' | 'complete';
  disputeResolution: 'court' | 'mediation' | 'arbitration';
};

const inputClass = 'w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';
const cardClass = 'bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]';

function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <div className="builder-kicker">{index}. {title}</div>
      {subtitle && <p className="builder-help mt-2 text-sm">{subtitle}</p>}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}


export default function KupniPage() {
  const [form, setForm] = useState<FormData>({
    sellerName: '', sellerId: '', sellerAddress: '', sellerEmail: '', sellerPhone: '', sellerBankAccount: '',
    buyerName: '', buyerId: '', buyerAddress: '', buyerEmail: '', buyerPhone: '',
    itemType: 'general', itemDescription: '', serialNumber: '', carMake: '', carModel: '', carVIN: '', carPlate: '', carYear: '', carMileage: '',
    price: '', currency: 'Kč', priceWords: '', paymentMethod: 'transfer', paymentDays: '5', variableSymbol: '',
    itemCondition: '', knownDefects: '', handoverDate: '', handoverPlace: '', warrantyMonths: '',
    contractDate: '', notaryUpsell: false,
    tier: 'basic' as const,
    disputeResolution: 'court' as const,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm(p => ({ ...p, [name]: val }));
  };

  const risk = useMemo(() => {
    let score = 100;
    const warnings: { text: string; level: 'high' | 'medium' | 'low' }[] = [];
    if (!form.sellerId || !form.buyerId) { score -= 20; warnings.push({ text: 'Doplňte identifikační údaje pro úplnost smlouvy.', level: 'high' }); }
    if (!form.price) { score -= 25; warnings.push({ text: 'Doplňte kupní cenu — jde o podstatnou náležitost smlouvy.', level: 'high' }); }
    if (!form.handoverDate) { score -= 10; warnings.push({ text: 'Doporučujeme doplnit datum předání věci.', level: 'medium' }); }
    if (form.itemType === 'car' && !form.carVIN) { score -= 15; warnings.push({ text: 'Doplňte VIN vozidla pro jednoznačnou identifikaci.', level: 'high' }); }
    if (!form.knownDefects) { score -= 8; warnings.push({ text: 'Doporučujeme uvést stav věci nebo konkrétní vady.', level: 'low' }); }
    const label = score >= 85 ? 'Dobré nastavení' : score >= 65 ? 'Průměrná ochrana' : 'Doporučená doplnění';
    return { score: Math.max(0, score), warnings, label };
  }, [form]);

  const previewSections = useMemo(() => {
    try {
      if (!form.sellerName && !form.buyerName) return [];
      return buildContractSections({ ...form, contractType: 'general_sale' } as StoredContractData);
    } catch {
      return [];
    }
  }, [form]);

  const handlePayment = async () => {
    try {
    setIsProcessing(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractType: 'general_sale', tier: form.tier, notaryUpsell: form.tier !== 'basic', payload: { ...form, contractType: 'general_sale' }, email: form.buyerEmail || form.sellerEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error || 'Chyba');
      window.location.href = data.url;
    } catch { alert('Chyba platební brány. Zkuste to prosím znovu.'); setIsProcessing(false); }
  };

  const scoreColor = risk.score >= 85 ? 'text-emerald-400' : risk.score >= 65 ? 'text-amber-400' : 'text-amber-400';

  return (
    <>
    <main className="min-h-screen bg-[#05080f] text-slate-200 font-sans pb-24">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08101e]/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-900 font-black text-sm">SH</div>
            <div>
              <div className="font-bold tracking-tight text-white">SmlouvaHned</div>
              <div className="text-[11px] text-slate-500">Kupní smlouva — § 2079 OZ</div>
            </div>
          </div>
          <button onClick={() => window.location.href = '/'} className="text-sm text-slate-400 hover:text-white transition">Zavřít</button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════
          LANDING SECTION (hero, obsah, FAQ)
      ═══════════════════════════════════════════════════ */}
      <ContractLandingSection
        badge="§ 2079 občanského zákoníku"
        h1Main="Kupní smlouva na"
        h1Accent="movitou věc"
        h1Suffix="online"
        subtitle="Vytvořte kupní smlouvu pro soukromý prodej nábytku, elektroniky, jízdního kola, sportovního vybavení nebo jiné movité věci. Dokument přesně zachycuje prodávajícího, kupujícího, stav věci, kupní cenu a podmínky předání."
        benefits={[
          { icon: '⚖️', text: 'Sestaveno dle § 2079 OZ — kupní smlouva na movitou věc' },
          { icon: '🛋️', text: 'Vhodné pro nábytek, elektroniku, kolo, sportovní vybavení i zboží' },
          { icon: '📋', text: 'Kupní cena, stav věci, vady a podmínky předání v jednom dokumentu' },
          { icon: '📄', text: 'Profesionální PDF ke stažení ihned po zaplacení' },
        ]}
        contents={[
          'Identifikaci prodávajícího a kupujícího',
          'Přesný popis prodávané věci včetně stavu',
          'Kupní cenu a způsob úhrady',
          'Ujednání o stavu věci a prohlášení o vadách',
          'Datum a místo předání',
          'Záruční podmínky a odpovědnost za vady',
          'Závěrečná ustanovení, GDPR a vyšší moc',
        ]}
        whenSuitable={[
          'Soukromý prodej nábytku, elektroniky nebo domácích spotřebičů',
          'Prodej jízdního kola, sportovního vybavení nebo hobby vybavení',
          'Prodej použitého zboží mezi fyzickými osobami',
          'Případy, kde je třeba písemně doložit kupní cenu a stav věci',
        ]}
        whenOther={[
          { label: 'Kupní smlouva na auto', href: '/auto', text: 'Pro prodej osobního automobilu, motocyklu nebo jiného motorového vozidla — specializovaný dokument s VIN, STK a emisemi.' },
        ]}
        faq={[
          { q: 'Pro jaké situace je tato kupní smlouva vhodná?', a: 'Je určena pro soukromý prodej movité věci — například nábytku, elektroniky, kola, sportovního vybavení nebo jiných použitých věcí mezi fyzickými osobami.' },
          { q: 'Je tato varianta vhodná i pro prodej auta?', a: 'Ne — pro prodej motorového vozidla doporučujeme specializovanou kupní smlouvu na auto, která pokrývá VIN, STK, emise a historii vozidla.' },
          { q: 'Musím smlouvu uzavřít písemně?', a: 'Zákon písemnou formu kupní smlouvy u movité věci výslovně nevyžaduje, ale silně ji doporučujeme. Písemná smlouva je rozhodujícím důkazem v případě sporu o stav věci, cenu nebo podmínky předání.' },
          { q: 'Dostanu dokument ihned po zaplacení?', a: 'Ano, PDF je k dispozici ke stažení okamžitě po dokončení platby.' },
          { q: 'Co mám uvést do popisu předmětu?', a: 'Čím přesnější popis, tím silnější smlouva. Uveďte název, výrobce, model, rok výroby, barvu, rozměry nebo jiné identifikační znaky. Zároveň uveďte stav věci a všechny známé vady.' },
        ]}
        ctaLabel="Vytvořit kupní smlouvu na movitou věc"
        formId="formular"
        guideHref="/kupni-smlouva"
        guideLabel="Průvodce kupní smlouvou — co musí obsahovat, záruky a nejčastější chyby"
      />

      {/* ═══════════════════════════════════════════════════
          FORMULÁŘ + SIDEBAR
      ═══════════════════════════════════════════════════ */}
      <div id="formular" className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="mb-6 border-t border-slate-800/60 pt-8">
          <h2 className="text-lg font-black text-white uppercase tracking-wide">Vyplňte údaje smlouvy</h2>
          <p className="text-sm text-slate-500 mt-1">Všechna povinná pole jsou označena *</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">

            {/* Prodávající */}
            <section className={cardClass}>
              <SectionTitle index="01" title="Prodávající" subtitle="Přesná identifikace zajišťuje vymahatelnost smlouvy." />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno / název firmy *"><input className={inputClass} name="sellerName" value={form.sellerName} onChange={set} placeholder="Jan Novák" /></Field>
                <Field label="Datum nar. / IČO *"><input className={inputClass} name="sellerId" value={form.sellerId} onChange={set} placeholder="01.01.1980 nebo 12345678" /></Field>
                <Field label="Adresa / sídlo *"><input className={inputClass} name="sellerAddress" value={form.sellerAddress} onChange={set} placeholder="Ulice 1, Praha 1" /></Field>
                <Field label="E-mail"><input className={inputClass} name="sellerEmail" value={form.sellerEmail} onChange={set} type="email" placeholder="jan@email.cz" /></Field>
                <Field label="Telefon"><input className={inputClass} name="sellerPhone" value={form.sellerPhone} onChange={set} placeholder="+420 600 000 000" /></Field>
                <Field label="Číslo účtu (pro převod)"><input className={inputClass} name="sellerBankAccount" value={form.sellerBankAccount} onChange={set} placeholder="123456789/0800" /></Field>
              </div>
            </section>

            {/* Kupující */}
            <section className={cardClass}>
              <SectionTitle index="02" title="Kupující" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Jméno / název firmy *"><input className={inputClass} name="buyerName" value={form.buyerName} onChange={set} placeholder="Marie Svobodová" /></Field>
                <Field label="Datum nar. / IČO *"><input className={inputClass} name="buyerId" value={form.buyerId} onChange={set} placeholder="01.01.1985 nebo 87654321" /></Field>
                <Field label="Adresa / sídlo *"><input className={inputClass} name="buyerAddress" value={form.buyerAddress} onChange={set} placeholder="Ulice 5, Brno" /></Field>
                <Field label="E-mail"><input className={inputClass} name="buyerEmail" value={form.buyerEmail} onChange={set} type="email" placeholder="marie@email.cz" /></Field>
                <Field label="Telefon"><input className={inputClass} name="buyerPhone" value={form.buyerPhone} onChange={set} placeholder="+420 700 000 000" /></Field>
              </div>
            </section>

            {/* Předmět */}
            <section className={cardClass}>
              <SectionTitle index="03" title="Předmět prodeje" subtitle="Co prodáváte? Čím přesnější popis, tím silnější smlouva." />
              <div className="space-y-4">
                <Field label="Typ předmětu">
                  <select className={inputClass} name="itemType" value={form.itemType} onChange={set}>
                    <option value="general">Obecná movitá věc (nábytek, kolo, zboží…)</option>
                    <option value="electronics">Elektronika / stroje</option>
                    <option value="car">Motorové vozidlo</option>
                  </select>
                </Field>
                {form.itemType !== 'car' && (
                  <>
                    <Field label="Popis předmětu *"><textarea className="w-full min-h-[90px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="itemDescription" value={form.itemDescription} onChange={set} placeholder="Např. Dřevěná zahradní lavička, hnědá, rozměry 180×60 cm, rok výroby 2022" /></Field>
                    {form.itemType === 'electronics' && <Field label="Výrobní / sériové číslo"><input className={inputClass} name="serialNumber" value={form.serialNumber} onChange={set} placeholder="SN1234567890" /></Field>}
                  </>
                )}
                {form.itemType === 'car' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Značka *"><input className={inputClass} name="carMake" value={form.carMake} onChange={set} placeholder="Škoda" /></Field>
                    <Field label="Model *"><input className={inputClass} name="carModel" value={form.carModel} onChange={set} placeholder="Octavia" /></Field>
                    <Field label="VIN *"><input className={inputClass} name="carVIN" value={form.carVIN} onChange={set} placeholder="TMBZZZ1Z0M1234567" /></Field>
                    <Field label="SPZ"><input className={inputClass} name="carPlate" value={form.carPlate} onChange={set} placeholder="1AB 2345" /></Field>
                    <Field label="Rok výroby"><input className={inputClass} name="carYear" value={form.carYear} onChange={set} placeholder="2019" /></Field>
                    <Field label="Stav tachometru (km)"><input className={inputClass} name="carMileage" value={form.carMileage} onChange={set} placeholder="85 000" /></Field>
                  </div>
                )}
                <Field label="Stav předmětu">
                  <select className={inputClass} name="itemCondition" value={form.itemCondition} onChange={set}>
                    <option value="">— vyberte —</option>
                    <option value="Nový, nepoužitý">Nový, nepoužitý</option>
                    <option value="Výborný stav">Výborný stav (jako nový)</option>
                    <option value="Dobrý stav">Dobrý stav (drobné opotřebení)</option>
                    <option value="Použitý — funkční stav">Použitý — funkční stav</option>
                    <option value="Vyžaduje opravu">Vyžaduje opravu</option>
                  </select>
                </Field>
                <Field label="Známé vady (nebo 'bez vad')">
                  <textarea className="w-full min-h-[70px] resize-y bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 transition" name="knownDefects" value={form.knownDefects} onChange={set} placeholder="Např. Škrábance na levém boku, jinak bez vad" />
                </Field>
              </div>
            </section>

            {/* Cena */}
            <section className={cardClass}>
              <SectionTitle index="04" title="Kupní cena a platba" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Kupní cena *"><input className={inputClass} name="price" value={form.price} onChange={set} type="number" placeholder="15000" /></Field>
                <Field label="Měna"><select className={inputClass} name="currency" value={form.currency} onChange={set}><option>Kč</option><option>EUR</option></select></Field>
                <Field label="Cena slovy"><input className={inputClass} name="priceWords" value={form.priceWords} onChange={set} placeholder="patnáct tisíc korun českých" /></Field>
                <Field label="Způsob úhrady">
                  <select className={inputClass} name="paymentMethod" value={form.paymentMethod} onChange={set}>
                    <option value="transfer">Bankovní převod</option>
                    <option value="cash">Hotovost při předání</option>
                    <option value="escrow">Notářská/advokátní úschova</option>
                  </select>
                </Field>
                {form.paymentMethod === 'transfer' && <Field label="Splatnost (pracovní dny)"><input className={inputClass} name="paymentDays" value={form.paymentDays} onChange={set} placeholder="5" /></Field>}
                {form.paymentMethod === 'transfer' && <Field label="Variabilní symbol"><input className={inputClass} name="variableSymbol" value={form.variableSymbol} onChange={set} placeholder="20260001" /></Field>}
              </div>
            </section>

            {/* Předání a záruka */}
            <section className={cardClass}>
              <SectionTitle index="05" title="Předání a záruka" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Datum předání"><input className={inputClass} name="handoverDate" value={form.handoverDate} onChange={set} type="date" /></Field>
                <Field label="Místo předání"><input className={inputClass} name="handoverPlace" value={form.handoverPlace} onChange={set} placeholder="Praha, adresa prodávajícího" /></Field>
                <Field label="Záruka (měsíce, 0 = zákonná odpov.)"><input className={inputClass} name="warrantyMonths" value={form.warrantyMonths} onChange={set} type="number" placeholder="0" /></Field>
                <Field label="Datum smlouvy"><input className={inputClass} name="contractDate" value={form.contractDate} onChange={set} type="date" /></Field>
              </div>
            </section>

            {/* Komplexní balíček */}
            <section className={cardClass}>
              {/* Řešení sporů */}
              <div className="mb-6">
                <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Řešení sporů</div>
                <select className={inputClass} name="disputeResolution" value={form.disputeResolution} onChange={set}>
                  <option value="court">Obecný soud (výchozí)</option>
                  <option value="mediation">Mediace (zákon č. 202/2012 Sb.)</option>
                  <option value="arbitration">Rozhodčí řízení (Rozhodčí soud HK ČR)</option>
                  {formData.disputeResolution === 'arbitration' && (
                    <p className="mt-2 text-xs text-amber-400 leading-relaxed">⚠ Rozhodčí doložka není platná ve smlouvách se spotřebiteli (zákon č. 216/1994 Sb.). Použijte ji pouze pro vztahy B2B.</p>
                  )}
                </select>
              </div>
              {/* === Vyberte úroveň zpracování dokumentu === */}
              <div className="mt-6">
                <BuilderTierSelector
                  contractType="general_sale"
                  tier={form.tier}
                  onTierChange={(tier) =>
                    setForm((prev) => ({ ...prev, tier, notaryUpsell: tier !== 'basic' }))
                  }
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Watermarked document preview */}
            {previewSections.length > 0 && (
              <ContractPreview sections={previewSections} title="Kupní smlouva" />
            )}
            {/* Risk */}
            <div className={cardClass}>
              <div className="builder-kicker mb-4">Kontrola úplnosti</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div>
                  <div className={`font-bold ${scoreColor}`}>{risk.label}</div>
                  <div className="text-xs text-slate-500">ze 100 bodů</div>
                </div>
              </div>
              {risk.warnings.length === 0
                ? <p className="text-sm text-emerald-400">✓ Smlouva je kompletní a silná.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (
                    <li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-amber-500/10 text-amber-300' : w.level === 'medium' ? 'bg-slate-700/40 text-slate-400' : 'bg-slate-700/40 text-slate-400'}`}>
                      {w.level === 'high' ? '○ ' : '○ '}{w.text}
                    </li>
                  ))}</ul>
              }
            </div>

            {/* Shrnutí */}
            <div className={cardClass}>
              <BuilderCheckoutSummary
                contractType="general_sale"
                tier={form.tier}
                documentLabel="Kupní smlouva"
                onUpgrade={() => setForm((prev) => ({ ...prev, tier: 'complete', notaryUpsell: true }))}
              />

              {(!form.sellerName || !form.buyerName || !form.price) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 px-4 py-3 text-xs text-slate-400 space-y-1">
                  <div className="font-semibold mb-1 text-slate-300">Před platbou vyplňte:</div>
                  {!form.sellerName && <div>• Jméno prodávajícího</div>}
                  {!form.buyerName && <div>• Jméno kupujícího</div>}
                  {!form.price && <div>• Kupní cena (sekce 04)</div>}
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
        title="Kupní smlouva"
        tier={form.tier}
        onTierChange={(t) => setForm((prev) => ({ ...prev, tier: t }))}
        contractType="general_sale"
        onPay={handlePayment}
        isProcessing={isProcessing}
        onClose={() => setShowPreviewModal(false)}
      />
    )}
    </>
  );
}



