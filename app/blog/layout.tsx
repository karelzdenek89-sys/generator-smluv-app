import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import BlogAnalyticsTracker from '@/app/components/blog/BlogAnalyticsTracker';

export const metadata: Metadata = {
  title: {
    default: 'Blog | SmlouvaHned',
    template: '%s | SmlouvaHned',
  },
  description:
    'Praktické průvodce ke smluvním dokumentům a běžným právním situacím. Obecně informační obsah aktuální pro legislativu 2026.',
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-page blog-shell min-h-screen">
      <BlogAnalyticsTracker />

      <header className="site-headerbar">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="text-xl font-semibold tracking-[-0.04em] text-[#f2e7c8]">
            SmlouvaHned.cz
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-[#ddd5c7] md:flex">
            <Link href="/" className="transition hover:text-[#d6ac60]">
              Smlouvy
            </Link>
            <Link href="/blog" className="transition hover:text-[#d6ac60]">
              Právní průvodce
            </Link>
            <Link href="/o-projektu" className="transition hover:text-[#d6ac60]">
              O projektu
            </Link>
            <Link href="/najem" className="site-button-primary px-5 py-3 text-sm">
              Vybrat dokument
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">{children}</main>

      <footer className="border-t border-white/6 bg-[#05080f] px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 px-5 py-4 text-xs leading-relaxed text-slate-400">
            <span className="font-semibold text-amber-400">Upozornění:</span>{' '}
            Články na tomto blogu mají výhradně informační charakter a nepředstavují právní poradenství ve smyslu zákona č. 85/1996 Sb.
            Obsah vychází z platného znění OZ č. 89/2012 Sb. a zákoníku práce k 1. 1. 2026, avšak každá situace je individuální.
            Pro nestandardní, sporné nebo hodnotově závažné případy doporučujeme konzultaci s advokátem —{' '}
            <a href="https://www.cak.cz" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline underline-offset-2 hover:text-amber-300 transition">
              seznam advokátů na cak.cz
            </a>.
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-600">
            <span>© 2024–2026 Karel Zdeněk, IČO 23660295 · SmlouvaHned.cz</span>
            <div className="flex items-center gap-4">
              <Link href="/obchodni-podminky" className="hover:text-slate-400 transition">Obchodní podmínky</Link>
              <Link href="/gdpr" className="hover:text-slate-400 transition">Ochrana osobních údajů</Link>
              <Link href="/" className="hover:text-slate-400 transition">Zpět na smlouvy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
