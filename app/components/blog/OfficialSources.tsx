type OfficialSource = {
  label: string;
  href: string;
};

export default function OfficialSources({ sources }: { sources: readonly OfficialSource[] }) {
  return (
    <section className="mb-12 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-labelledby="official-sources-heading">
      <h2 id="official-sources-heading" className="mb-3 text-2xl font-black tracking-tight text-white">
        Oficiální zdroje
      </h2>
      <p className="mb-4 text-sm leading-7 text-slate-500">
        Pravidla se mohou měnit. Před konkrétním krokem zkontrolujte aktuální znění.
      </p>
      <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-400">
        {sources.map((source) => (
          <li key={source.href}>
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 transition hover:text-amber-300"
            >
              {source.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
