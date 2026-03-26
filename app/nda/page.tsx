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
          notaryUpsell: formData.notaryUpsell,
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
                <div><label className={labelClass}>Jméno / název firmy</label><input value={formData.disclosingName} onChange={e => set('disclosingName', e.target.value)} placeholder="ABC s.r.o." className={inputClass} /></div>
                <div><label className={labelClass}>IČO / RČ</label><input value={formData.disclosingId} onChange={e => set('disclosingId', e.target.value)} placeholder="12345678" className={inputClass} /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelClass}>Adresa / sídlo</label><input value={formData.disclosingAddress} onChange={e => set('disclosingAddress', e.target.value)} placeholder="Ulice 1, Praha 1" className={inputClass} /></div>
                <div><label className={labelClass}>E-mail</label><input type="email" value={formData.disclosingEmail} onChange={e => set('disclosingEmail', e.target.value)} placeholder="info@firma.cz" className={inputClass} /></div>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="03" title="Přijímající strana" subtitle="Strana, která přijímá a musí chránit informace." />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div><label className={labelClass}>Jméno / název firmy</label><input value={formData.receivingName} onChange={e => set('receivingName', e.target.value)} placeholder="XYZ a.s." className={inputClass} /></div>
                <div><label className={labelClass}>IČO / RČ</label><input value={formData.receivingId} onChange={e => set('receivingId', e.target.value)} placeholder="87654321" className={inputClass} /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelClass}>Adresa / sídlo</label><input value={formData.receivingAddress} onChange={e => set('receivingAddress', e.target.value)} placeholder="Ulice 2, Brno" className={inputClass} /></div>
                <div><label className={labelClass}>E-mail</label><input type="email" value={formData.receivingEmail} onChange={e => set('receivingEmail', e.target.value)} placeholder="info@xyzas.cz" className={inputClass} /></div>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="04" title="Předmět ochrany a účel" />
              <div className="mb-4">
                <label className={labelClass}>Popis chráněných informací</label>
                <textarea value={formData.confidentialInfoDesc} onChange={e => set('confidentialInfoDesc', e.target.value)}
                  placeholder="Obchodní plány, zdrojové kódy, databáze zákazníků, finanční výsledky, know-how..." className={textareaClass} />
              </div>
              <div>
                <label className={labelClass}>Účel zpřístupnění informací</label>
                <input value={formData.purposeOfDisclosure} onChange={e => set('purposeOfDisclosure', e.target.value)}
                  placeholder="Posouzení potenciální obchodní spolupráce / zaměstnanecký vztah / investice" className={inputClass} />
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="05" title="Doba platnosti a sankce" />
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div><label className={labelClass}>Platnost NDA</label>
                  <select value={formData.ndaDuration} onChange={e => set('ndaDuration', e.target.value)} className={inputClass}>
                    <option value="1 roku">1 rok</option>
                    <option value="2 let">2 roky</option>
                    <option value="3 let">3 roky</option>
                    <option value="5 let">5 let</option>
                    <option value="dobu neurčitou">Neurčitá</option>
                  </select>
                </div>
                <div><label className={labelClass}>Mlčenlivost po skončení</label>
                  <select value={formData.confidentialityAfterTermination} onChange={e => set('confidentialityAfterTermination', e.target.value)} className={inputClass}>
                    <option value="1 roku">1 rok</option>
                    <option value="2 let">2 roky</option>
                    <option value="5 let">5 let</option>
                    <option value="10 let">10 let</option>
                    <option value="neomezenou dobu">Neomezeně</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Smluvní pokuta za porušení (Kč)</label>
                <input type="number" value={formData.penaltyAmount} onChange={e => set('penaltyAmount', e.target.value)} placeholder="100 000" className={inputClass} />
                <p className="text-xs text-slate-500 mt-1">Pokuta musí být přiměřená. Pro větší rizika doporučujeme 500 000+ Kč.</p>
              </div>
            </section>

            <section className={cardClass}>
              <SectionTitle index="06" title="Doplňková ujednání" subtitle="Volitelná rozšíření smlouvy." />
              <div className="space-y-3 mb-4">
                <Toggle checked={formData.nonSolicitation} onChange={v => set('nonSolicitation', v)} label="Zákaz přetahování zaměstnanců / klientů" />
                {formData.nonSolicitation && (
                  <div className="ml-7"><label className={labelClass}>Po dobu</label>
                    <select value={formData.nonSolicitationPeriod} onChange={e => set('nonSolicitationPeriod', e.target.value)} className={inputClass}>
                      <option value="6 měsíců">6 měsíců</option>
                      <option value="12 měsíců">12 měsíců</option>
                      <option value="24 měsíců">24 měsíců</option>
                    </select>
                  </div>
                )}
                <Toggle checked={formData.nonCompete} onChange={v => set('nonCompete', v)} label="Zákaz konkurenční činnosti (non-compete)" />
                {formData.nonCompete && (
                  <div className="ml-7 grid sm:grid-cols-2 gap-3">
                    <div><label className={labelClass}>Po dobu</label>
                      <select value={formData.nonCompetePeriod} onChange={e => set('nonCompetePeriod', e.target.value)} className={inputClass}>
                        <option value="12 měsíců">12 měsíců</option>
                        <option value="24 měsíců">24 měsíců</option>
                        <option value="36 měsíců">36 měsíců</option>
                      </select>
                    </div>
                    <div><label className={labelClass}>Oblast zákazu</label><input value={formData.nonCompeteScope} onChange={e => set('nonCompeteScope', e.target.value)} placeholder="Vývoj software, e-commerce..." className={inputClass} /></div>
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-8">
            <div className={cardClass}>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Vyplněnost formuláře</div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-grow bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${completion}%` }} />
                </div>
                <span className="text-sm font-black text-white">{completion}%</span>
              </div>
              <p className="text-xs text-slate-500">Čím více vyplníte, tím silnější smlouva.</p>
            </div>

            <div className={`${cardClass} ${formData.notaryUpsell ? 'border-amber-500/40 bg-amber-500/5' : ''}`}>
              <div className="flex items-start gap-3 mb-4">
                <input type="checkbox" id="premium" checked={formData.notaryUpsell} onChange={e => set('notaryUpsell', e.target.checked)} className="mt-1 accent-amber-500 w-4 h-4" />
                <div>
                  <label htmlFor="premium" className="font-bold text-white cursor-pointer text-sm">Profesionální ochrana +200 Kč</label>
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
                  <span className="text-white">{formData.notaryUpsell ? '449' : '249'} Kč</span>
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
