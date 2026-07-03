const FACTS = [
  { value: '14', label: 'typů smluv v jednom nástroji' },
  { value: '§', label: 'u klíčových klauzulí v PDF' },
  { value: 'EN/UA', label: 'nápověda u expat formulářů' },
  { value: '→', label: 'formulář, náhled, pak stažení' },
] as const;

export default function ProductScopeStrip({ className = '' }: { className?: string }) {
  return (
    <section
      className={`rounded-[1.5rem] border border-white/8 bg-[#0c1426]/60 px-6 py-6 md:px-8 ${className}`}
      aria-label="Co nástroj pokrývá"
    >
      <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
        Softwarový generátor — ne advokátní kancelář
      </p>
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        {FACTS.map((item) => (
          <div key={item.label} className="text-center">
            <p className="font-serif text-2xl font-bold text-[#c9a852] md:text-3xl">{item.value}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
