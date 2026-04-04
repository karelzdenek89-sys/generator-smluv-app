import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Blog | Průvodce smlouvami | SmlouvaHned',
    template: '%s | SmlouvaHned',
  },
  description:
    'Průvodce smlouvami a běžnými právními situacemi. Praktické informace k nájmu, práci, kupním smlouvám, dílu a dalším dokumentům.',
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#05080f] text-slate-200">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.07),transparent_50%)]" />

      <header className="relative z-20 border-b border-white/6 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">
              SH
            </div>
            <div>
              <div className="font-black leading-tight tracking-tight text-white">SmlouvaHned</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500">Online nástroj pro standardizované dokumenty</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-slate-400 md:flex">
            <Link href="/" className="transition hover:text-white">
              Smlouvy
            </Link>
            <Link href="/blog" className="transition hover:text-white">
              Blog
            </Link>
            <Link
              href="/najem"
              className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
            >
              Vytvořit smlouvu →
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">{children}</main>

      <section className="relative z-10 mx-auto mt-8 max-w-4xl px-6">
        <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-500/3 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
          <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-400">Praktické pokračování</div>
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Potřebujete rovnou připravit dokument?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-sm leading-relaxed text-slate-300">
            V článcích najdete vysvětlení a nejčastější chyby. Pokud už víte, co potřebujete, přejděte rovnou do generátoru
            nebo si zobrazte přehled souvisejících dokumentů.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/#dokumenty"
              className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
            >
              Vybrat konkrétní generátor →
            </Link>
            <Link
              href="/#vsechny-dokumenty"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-slate-200 transition hover:border-amber-500/25 hover:text-white"
            >
              Zobrazit související dokumenty ↗
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mt-8 border-t border-white/6 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-6">
          <div className="text-xs text-slate-600">
            © 2024-2026 Karel Zdeněk, IČO: 23660295 · SmlouvaHned · Informace na blogu nejsou náhradou za individuální právní poradenství.
          </div>
          <div className="flex gap-4 text-xs text-slate-600">
            <Link href="/o-projektu" className="transition hover:text-slate-400">
              O projektu
            </Link>
            <Link href="/obchodni-podminky" className="transition hover:text-slate-400">
              Obchodní podmínky
            </Link>
            <Link href="/gdpr" className="transition hover:text-slate-400">
              GDPR
            </Link>
            <Link href="/kontakt" className="transition hover:text-slate-400">
              Kontakt
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
