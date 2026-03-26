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

  const set = (field: keyof NdaFormData, value: string | boolean) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const completion = useMemo(() => {
    const fields = [formData.disclosingName, formData.disclosingId, formData.receivingName, formData.receivingId, formData.confidentialInfoDesc, formData.purposeOfDisclosure];
    const filled = fields.filter(f => f.trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  }, [formData]);

  const handleSubmit = async () => {
    if (!formData.disclosingName || !formData.receivingName) {
      alert('Vyplňte prosím jména obou smluvních stran.');
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
            <span>§ 1724 a násl. OZ + obch. tajemství § 504</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 lg:px-8">
        <div className="mb-8">
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-400 mb-2">Ochrana informací</div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tight text-white">SMLOUVA O MLČENLIVOSTI</h1>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">NDA pro ochranu obchodního tajemství, know-how, databází a citlivých informací. Vhodné pro byznysové spolupráce, zaměstnance i investory.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">

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

            <section className={cardClass}>
              <SectionTitle index="02" title="Poskytující strana" subtitle="Strana, která sdílí důvěrné informace." />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
              {/* === VÝBĚR BALÍČKU === */}
              <div className="space-y-3 mt-6">
                <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Vyberte balíček</div>
                {([
                  { value: 'basic', label: 'Základní dokument', price: '249 Kč', desc: 'Profesionální smlouva dle občanského zákoníku v PDF.' },
                  { value: 'professional', label: 'Profesionální ochrana', price: '449 Kč', desc: 'Rozšířené klauzule, smluvní pokuty a zajišťovací ustanovení.', recommended: true },
                  { value: 'complete', label: 'Kompletní balíček', price: '749 Kč', desc: 'Vše z Profesionální ochrany + průvodní instrukce, checklist a 30denní archivace.' },
                ] as const).map((opt) => (
                  <label
                    key={opt.value}
                    className={`block rounded-2xl border-2 p-4 cursor-pointer transition relative ${
                      formData.tier === opt.value
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-slate-700/60 bg-[#0c1426]/60 hover:border-slate-600'
                    }`}
                  >
                    {opt.recommended && formData.tier !== 'professional' && (
                      <div className="absolute -top-2.5 left-4">
                        <span className="rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-black">
                          Doporučeno
                        </span>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="tier"
                        value={opt.value}
                        checked={formData.tier === opt.value}
                        onChange={(e) => setFormData((prev) => ({ ...prev, tier: e.target.value as 'basic' | 'professional' | 'complete', notaryUpsell: e.target.value !== 'basic' }))}
                        className="mt-1 h-5 w-5 accent-amber-500"
                      />
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
                  <p className="text-xs text-slate-500 mt-0.5">Pro citlivé a hodnotné informace</p>
                </div>
              </div>
              {formData.notaryUpsell && (
                <ul className="space-y-2 text-xs text-emerald-300">
                  {['Audit a kontrola nakládání s informacemi', 'Zvláštní kategorie chráněných informací', 'Evidence osob s přístupem k datům', 'Doporučení k technickým opatřením ochrany'].map(f => (
                    <li key={f} className="flex items-start gap-2"><span>✓</span><span>{f}</span></li>
                  ))}
                </ul>
              )}
            </div>

            <div className={cardClass}>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Shrnutí objednávky</div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">NDA smlouva</span>
                  <span className="font-bold text-white">249 Kč</span>
                </div>
                {formData.notaryUpsell && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Profesionální ochrana</span>
                    <span className="font-bold text-amber-400">+200 Kč</span>
                  </div>
                )}
                <div className="border-t border-white/8 pt-2 flex justify-between font-black text-lg">
                  <span>Celkem</span>
                  <span className="text-white">{formData.tier === 'complete' ? '749' : formData.tier === 'professional' ? '449' : '249'} Kč</span>
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
