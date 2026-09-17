import Link from 'next/link';
import {
  DIFFERENTIATION_COMPARISON,
  DIFFERENTIATION_PILLARS,
} from '@/lib/marketing/differentiation';

const PILLAR_META = [
  { label: 'Právní opora', proof: '§ přímo u vybraných klauzulí' },
  { label: 'Kontrola', proof: 'upozornění ještě při vyplňování' },
  { label: 'Obsah', proof: 'rozšířená ustanovení podle situace' },
  { label: 'Rozhodnutí', proof: 'náhled a cena před objednávkou' },
] as const;

export default function DifferentiationSection() {
  const { generic, ours } = DIFFERENTIATION_COMPARISON;

  return (
    <section className="pt-20 md:pt-24" aria-labelledby="proc-smlouvahned-heading">
      <div className="mb-10 max-w-3xl">
        <p className="site-kicker mb-2">Proč SmlouvaHned</p>
        <h2
          id="proc-smlouvahned-heading"
          className="font-serif text-4xl font-semibold tracking-tight text-[#f2e7c8] md:text-5xl"
        >
          Nejde jen o prázdnou šablonu.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
          Formulář doplní vaše údaje do připravené struktury dokumentu. U vybraných ustanovení vidíte právní oporu,
          při neobvyklé volbě dostanete upozornění a před objednávkou si zkontrolujete náhled.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DIFFERENTIATION_PILLARS.map((item, index) => {
          const meta = PILLAR_META[index];
          return (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(155deg,rgba(18,30,57,0.9),rgba(7,13,25,0.96))] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-[#c9a852]/30 md:p-6"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8d092]/55 to-transparent opacity-60" aria-hidden="true" />
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#c9a852]/30 bg-[#c9a852]/10 font-serif text-lg font-semibold text-[#e8d092] shadow-[0_0_24px_rgba(201,168,82,0.09)]">
                  {item.icon}
                </div>
                <span className="rounded-full border border-white/8 bg-white/[0.035] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">
                  {meta.label}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.desc}</p>
              <div className="mt-5 border-t border-white/8 pt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#c9a852]/85">
                {meta.proof}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 grid gap-3 lg:grid-cols-[1fr_auto_1fr] text-sm">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-5 py-5">
          <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">{generic.label}</p>
          {generic.lines.map((line) => (
            <p key={line} className="mb-1.5 text-xs text-slate-400">— {line}</p>
          ))}
        </div>

        <div className="hidden items-center justify-center text-xs font-bold uppercase tracking-widest text-slate-600 lg:flex">oproti</div>

        <div className="rounded-2xl border border-[#c9a852]/25 bg-[linear-gradient(145deg,rgba(201,168,82,0.10),rgba(201,168,82,0.035))] px-5 py-5">
          <p className="mb-3 text-xs font-black uppercase tracking-widest text-[#e8d092]">{ours.label}</p>
          {ours.lines.map((line) => (
            <p key={line} className="mb-1.5 text-xs text-slate-200"><span className="mr-2 text-[#c9a852]">✓</span>{line}</p>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/[0.025] px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <p className="max-w-3xl text-sm leading-6 text-slate-400">
          <strong className="font-semibold text-slate-200">Rozsah služby:</strong> SmlouvaHned sestavuje standardizované dokumenty z vašich údajů.
          Individuální právní posouzení není součástí služby.
        </p>
        <Link href="/o-projektu" className="shrink-0 text-sm font-semibold text-[#e8d092] transition hover:text-white">
          Jak nástroj funguje →
        </Link>
      </div>
    </section>
  );
}
