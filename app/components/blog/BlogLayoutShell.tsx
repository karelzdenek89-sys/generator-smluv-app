'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import BlogAnalyticsTracker from '@/app/components/blog/BlogAnalyticsTracker';
import { getLocaleFromPathname } from '@/lib/locale';

export default function BlogLayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isExpatArticle = getLocaleFromPathname(pathname) !== 'cs';

  if (isExpatArticle) {
    return (
      <div className="site-page blog-shell min-h-screen" data-blog-shell="expat">
        <BlogAnalyticsTracker />
        <main className="relative z-10">{children}</main>
      </div>
    );
  }

  return (
    <div className="site-page blog-shell min-h-screen" data-blog-shell="cs">
      <BlogAnalyticsTracker />

      <main className="relative z-10">{children}</main>

      <footer className="border-t border-white/6 bg-[#05080f] px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 px-5 py-4 text-xs leading-relaxed text-slate-400">
            <span className="font-semibold text-amber-400">Upozornění:</span>{' '}
            Články na tomto blogu mají výhradně informační charakter a nepředstavují právní poradenství ve smyslu zákona č. 85/1996 Sb.
            Obsah průběžně aktualizujeme pro českou legislativu v roce 2026, avšak každá situace je individuální.
            Pro nestandardní, sporné nebo hodnotově závažné případy doporučujeme konzultaci s advokátem —{' '}
            <a href="https://www.cak.cz" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline underline-offset-2 hover:text-amber-300 transition">
              seznam advokátů na cak.cz
            </a>.
          </div>
          <div className="mt-6 flex flex-col gap-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2024–2026 Karel Zdeněk, IČO 23660295 · SmlouvaHned.cz</span>
            <div className="flex items-center gap-4">
              <Link href="/obchodni-podminky" className="transition hover:text-slate-400">Obchodní podmínky</Link>
              <Link href="/gdpr" className="transition hover:text-slate-400">Ochrana osobních údajů</Link>
              <Link href="/" className="transition hover:text-slate-400">Zpět na smlouvy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
