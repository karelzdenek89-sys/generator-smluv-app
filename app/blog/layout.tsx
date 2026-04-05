import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Blog | Průvodce smlouvami | SmlouvaHned',
    template: '%s | SmlouvaHned',
  },
  description:
    'Průvodce smlouvami a běžnými situacemi. Praktické informace k nájmu, práci, kupním smlouvám, dílu a dalším standardizovaným dokumentům.',
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="premium-page-bg-ref min-h-screen text-slate-200">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(201,169,110,0.08),transparent_42%)]" />

      <header className="relative z-20 border-b border-white/6 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-sm font-black text-amber-300">
              SH
            </div>
            <div>
              <div className="font-heading-serif text-xl leading-tight text-white">SmlouvaHned</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                Online nástroj pro standardizované dokumenty
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-3 md:flex">
            <Link href="/" className="nav-link-ref text-sm">
              Smlouvy
            </Link>
            <Link href="/blog" className="nav-link-ref text-sm">
              Blog
            </Link>
            <Link href="/#dokumenty" className="nav-cta-ref text-sm">
              Vybrat dokument <span aria-hidden>→</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">{children}</main>

      <section className="relative z-10 mx-auto mt-10 max-w-5xl px-6">
        <div className="premium-page-card-soft-ref p-8 text-center md:p-10">
          <div className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Praktické pokračování</div>
          <h2 className="font-heading-serif text-3xl text-white md:text-4xl">Potřebujete rovnou připravit dokument?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
            V článcích najdete vysvětlení, souvislosti a časté chyby. Pokud už víte, jaký dokument potřebujete,
            přejděte rovnou do přehledu typů nebo si zobrazte další související varianty.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/#dokumenty" className="btn-primary-ref justify-center rounded-xl px-6 py-3 text-sm">
              Vybrat konkrétní generátor <span aria-hidden>→</span>
            </Link>
            <Link href="/#vsechny-dokumenty" className="btn-outline-ref justify-center rounded-xl px-6 py-3 text-sm">
              Zobrazit související dokumenty
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mt-10 border-t border-white/6 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6">
          <div className="max-w-2xl text-xs leading-relaxed text-slate-500">
            © 2024-2026 Karel Zdeněk, IČO 23660295 · SmlouvaHned · Informace na blogu nejsou náhradou za individuální právní poradenství.
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <Link href="/o-projektu" className="transition hover:text-slate-300">
              O projektu
            </Link>
            <Link href="/obchodni-podminky" className="transition hover:text-slate-300">
              Obchodní podmínky
            </Link>
            <Link href="/gdpr" className="transition hover:text-slate-300">
              GDPR
            </Link>
            <Link href="/kontakt" className="transition hover:text-slate-300">
              Kontakt
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
