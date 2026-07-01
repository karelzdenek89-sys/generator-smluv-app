import Link from 'next/link';
import {
  DIFFERENTIATION_COMPARISON,
  DIFFERENTIATION_PILLARS,
  NOT_A_LAW_FIRM_POINTS,
} from '@/lib/marketing/differentiation';

export default function DifferentiationSection() {
  const { generic, ours } = DIFFERENTIATION_COMPARISON;

  return (
    <section className="pt-20 md:pt-24" aria-labelledby="proc-smlouvahned-heading">
      <div className="mb-10 text-center">
        <p className="site-kicker mb-2">Proč SmlouvaHned</p>
        <h2
          id="proc-smlouvahned-heading"
          className="font-serif italic text-4xl font-bold text-white md:text-5xl"
        >
          Smlouvy s paragrafy,
          <br />
          <span className="text-[#c9a852]">ne bez nich.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
          Většina vzorů z internetu je statický soubor. Tady projdete formulář, zkontrolujete náhled
          a dostanete PDF sestavené podle vašich údajů — s odkazem na zákon u klauzulí a běžnými
          ochrannými ustanoveními. Nejde o individuální právní službu.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {DIFFERENTIATION_PILLARS.map((item) => (
          <div key={item.title} className="site-content-card rounded-[1.5rem] p-6 md:p-7">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#c9a852]/30 bg-[#c9a852]/8 font-bold text-[#c9a852]">
              {item.icon}
            </div>
            <h3 className="mb-2 font-serif italic text-base font-semibold text-white">{item.title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-3 lg:grid-cols-[1fr_auto_1fr] text-sm">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-5 py-5">
          <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
            {generic.label}
          </p>
          {generic.lines.map((line) => (
            <p key={line} className="mb-1.5 text-xs text-slate-500 line-through decoration-slate-700">
              ✗ {line}
            </p>
          ))}
        </div>

        <div className="hidden items-center justify-center text-2xl text-slate-700 lg:flex">vs.</div>

        <div className="rounded-2xl border border-[#c9a852]/20 bg-[#c9a852]/5 px-5 py-5">
          <p className="mb-3 text-xs font-black uppercase tracking-widest text-[#c9a852]">
            {ours.label}
          </p>
          {ours.lines.map((line) => (
            <p key={line} className="mb-1.5 text-xs text-slate-300">
              ✓ {line}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-white/8 bg-[#0c1426]/80 px-6 py-6 md:px-8">
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Co to není</p>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          {NOT_A_LAW_FIRM_POINTS.map((item) => (
            <div key={item.title}>
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-slate-500">
          Více o provozovateli, metodice šablon a limitech nástroje na{' '}
          <Link href="/o-projektu" className="text-[#c9a852] underline-offset-2 hover:underline">
            stránce O projektu
          </Link>
          . U nestandardní věci doporučíme advokáta —{' '}
          <a
            href="https://www.cak.cz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c9a852] underline-offset-2 hover:underline"
          >
            cak.cz
          </a>
          .
        </p>
      </div>
    </section>
  );
}
