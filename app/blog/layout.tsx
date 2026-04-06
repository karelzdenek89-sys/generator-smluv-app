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
    </div>
  );
}
