'use client';

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-300 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-10 uppercase italic tracking-tighter underline decoration-amber-500 underline-offset-8">
          Ochrana osobních údajů (GDPR)
        </h1>
        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-amber-500 font-bold uppercase mb-2">1. Úvod</h2>
            <p>Vaše soukromí je pro nás prioritou. Data vyplněná do smluv neukládáme déle, než je nezbytně nutné pro vygenerování PDF.</p>
          </section>
          <section>
            <h2 className="text-amber-500 font-bold uppercase mb-2">2. Jaká data sbíráme?</h2>
            <p>Sbíráme pouze údaje, které sami vložíte do formuláře za účelem vytvoření smlouvy. Vaše platební údaje zpracovává zabezpečená brána Stripe.</p>
          </section>
          {/* Tady můžeš přidat další body */}
        </div>
        <button onClick={() => window.history.back()} className="mt-16 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition">← Zpět</button>
      </div>
    </main>
  );
}