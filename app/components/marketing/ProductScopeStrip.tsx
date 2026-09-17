const FACTS = [
  { value: '14', label: 'typů dokumentů v jednom nástroji' },
  { value: 'PDF', label: 'hotový výstup ihned po ověřené platbě' },
  { value: 'DOCX', label: 'volitelná editovatelná verze dokumentu' },
  { value: 'EN / UA', label: 'nápověda a vybrané dvojjazyčné přílohy' },
] as const;

export default function ProductScopeStrip({ className = '' }: { className?: string }) {
  return (
    <section
      className={`rounded-[1.5rem] border border-white/8 bg-[#0c1426]/60 px-6 py-6 md:px-8 ${className}`}
      aria-label="Co nástroj skutečně umí"
    >
      <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
        Co dostanete podle zvolené varianty
      </p>
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        {FACTS.map((item) => (
          <div key={item.label} className="text-center">
            <p className="font-serif text-2xl font-bold text-[#c9a852] md:text-3xl">{item.value}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-5 max-w-3xl border-t border-white/8 pt-4 text-center text-xs leading-6 text-slate-400">
        Bez povinné registrace a bez předplatného. V checkoutu lze podle typu dokumentu přidat checklist před podpisem,
        předávací protokol nebo archiv odkazu na 90 dní. K zakoupeným dokumentům se můžete vrátit přes Moje dokumenty.
      </p>
    </section>
  );
}
