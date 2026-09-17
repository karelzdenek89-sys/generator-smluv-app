import Link from 'next/link';
import type { LegalBlock, LegalDocument } from '@/lib/legal/types';

/**
 * Jednotné vykreslení cizojazyčné právní stránky (obchodní podmínky, GDPR).
 * Obsah přichází jako data, aby anglická a ukrajinská verze sdílely rozvržení
 * s českým originálem a nerozcházely se ve struktuře.
 */

function Block({ block }: { block: LegalBlock }) {
  switch (block.kind) {
    case 'p':
      return <p className="mb-3 text-slate-300">{block.text}</p>;
    case 'note':
      return <p className="mt-3 text-xs text-slate-400">{block.text}</p>;
    case 'callout':
      return (
        <div className="rounded-[24px] border border-white/8 bg-[#0c1426]/60 p-6">
          <div className="mb-3 text-[10px] font-black uppercase tracking-widest text-amber-400/80">
            {block.label}
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{block.text}</p>
        </div>
      );
    case 'list':
      return (
        <ul className="space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-slate-300">
              <span aria-hidden="true" className="text-amber-400">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'rows':
      return (
        <div className="mb-3 space-y-2 rounded-2xl border border-white/5 bg-[#0c1426]/60 p-5 text-sm">
          {block.label ? (
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{block.label}</p>
          ) : null}
          {block.rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-4">
              <span className="text-slate-400">{row.label}</span>
              <span className="text-right font-bold text-white">{row.value}</span>
            </div>
          ))}
        </div>
      );
    case 'record':
      return (
        <div className="rounded-2xl border border-white/5 bg-[#0c1426]/60 p-5">
          <div className="text-sm font-bold text-white">{block.title}</div>
          <p className="mt-2 text-sm text-slate-300">{block.text}</p>
          {block.meta.map((meta) => (
            <div key={meta.label} className="mt-2 text-xs text-slate-400">
              <span className="font-bold text-slate-200">{meta.label}:</span> {meta.value}
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function LegalDocumentPage({ document }: { document: LegalDocument }) {
  const homeHref = document.locale === 'ua' ? '/ua' : '/en';

  return (
    <main className="relative min-h-screen bg-[#05080f] px-6 py-16 font-sans text-slate-300">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-full -translate-x-1/2 bg-amber-500/4 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-3">
          <Link
            href={homeHref}
            className="text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:text-amber-400"
          >
            ← SmlouvaHned
          </Link>
        </div>

        <h1 className="mb-3 font-serif text-4xl font-semibold tracking-tight text-white md:text-5xl">
          {document.title} <span className="text-amber-500">{document.titleAccent}</span>
        </h1>
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
          {document.version}
        </p>

        <div className="mb-12 rounded-2xl border border-sky-400/25 bg-sky-400/10 p-5 text-sm leading-relaxed text-sky-50">
          <p>{document.prevailingNotice}</p>
          <Link href={document.czechHref} className="mt-2 inline-block font-semibold text-amber-400 underline">
            {document.czechLinkLabel}
          </Link>
        </div>

        <div className="space-y-10 text-sm leading-relaxed">
          {document.sections.map((section) => (
            <section key={section.id} id={section.id}>
              {section.id === 'nature' ? null : (
                <h2 className="mb-4 text-xs font-black uppercase tracking-widest text-amber-500">
                  {section.heading}
                </h2>
              )}
              <div className="space-y-4">
                {section.blocks.map((block, index) => (
                  <Block key={`${section.id}-${index}`} block={block} />
                ))}
              </div>
            </section>
          ))}

          <section className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
            <p className="text-[10px] uppercase tracking-widest text-slate-400">{document.footer}</p>
            <Link
              href={homeHref}
              className="rounded-full border border-white/10 bg-white/5 px-8 py-3 text-[10px] font-black uppercase text-white transition hover:bg-amber-500 hover:text-black"
            >
              {document.backLabel}
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
