'use client';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#05080f] text-slate-300 py-20 px-6 font-sans">
      {/* GLOW EFEKT */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-amber-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase italic tracking-tighter">
          Obchodní <span className="text-amber-500">podmínky</span>
        </h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-12">
          Platné od 1. 1. 2026 • SmlouvaHned.cz
        </p>

        <div className="space-y-10 text-sm leading-relaxed">
          
          <section className="bg-[#0c1426]/50 border border-white/5 p-8 rounded-[32px]">
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4 italic">
              01. Úvodní ustanovení
            </h2>
            <p className="mb-4">
              Tyto obchodní podmínky upravují práva a povinnosti mezi provozovatelem platformy <strong>SmlouvaHned</strong> (dále jen „Poskytovatel“) a uživatelem (dále jen „Zákazník“), který využívá automatizovaný software pro generování dokumentů.
            </p>
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-200 font-bold">
              UPOZORNĚNÍ: Poskytovatel není advokátní kanceláří a neposkytuje právní služby ve smyslu zákona o advokacii. Služba je poskytována jako automatizovaný software (SaaS).
            </div>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4 italic">
              02. Předmět služby
            </h2>
            <p>
              Předmětem služby je umožnění Zákazníkovi sestavit si vlastní právní dokument na základě jím vložených údajů do inteligentního formuláře. Výstupem služby je soubor ve formátu PDF připravený k tisku.
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4 italic">
              03. Platební podmínky a doručení
            </h2>
            <p className="mb-4">
              Cena za vygenerování dokumentu je uvedena u každého typu smlouvy (standardně od 299 Kč). 
            </p>
            <p>
              Platba probíhá prostřednictvím zabezpečené platební brány. Ihned po potvrzení platby je Zákazníkovi zpřístupněn odkaz ke stažení hotového dokumentu. Vzhledem k povaze digitálního obsahu doručovaného ihned po zaplacení, Zákazník výslovně souhlasí s tím, že <strong>nemá právo na odstoupení od smlouvy v 14denní lhůtě</strong> (podle § 1837 písm. l občanského zákoníku).
            </p>
          </section>

          <section>
            <h2 className="text-amber-500 font-black uppercase text-xs tracking-widest mb-4 italic">
              04. Odpovědnost
            </h2>
            <p>
              Zákazník nese plnou odpovědnost za správnost a pravdivost údajů vložených do formuláře. Poskytovatel neodpovídá za škody vzniklé chybným vyplněním nebo nevhodným použitím vygenerovaného dokumentu v rozporu s platnými zákony.
            </p>
          </section>

          <section className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">
              SmlouvaHned © 2026 • Právní jistota na jeden klik
            </p>
            <button 
              onClick={() => window.location.href = '/'} 
              className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-black uppercase hover:bg-amber-500 hover:text-black transition"
            >
              Zpět na úvodní stránku
            </button>
          </section>

        </div>
      </div>
    </main>
  );
}