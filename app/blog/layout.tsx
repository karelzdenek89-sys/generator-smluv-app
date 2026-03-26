import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'Blog — Průvodce smlouvami | SmlouvaHned',
    template: '%s | SmlouvaHned',
  },
  description:
    'Průvodce právními smlouvami — nájemní smlouva, pracovní smlouva, smlouva o dílo a další. Aktuální informace pro 2026.',
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#05080f] text-slate-200">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.07),transparent_50%)]" />

      {/* Header */}
      <header className="relative z-20 border-b border-white/6">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div>
              <div className="font-black tracking-tight text-white leading-tight">SmlouvaHned</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500">Právní dokumenty online</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-slate-400 md:flex">
            <Link href="/" className="hover:text-white transition">Smlouvy</Link>
            <Link href="/blog" className="hover:text-white transition">Blog</Link>
            <Link href="/najem" className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-black uppercase tracking-tight text-black hover:bg-amber-400 transition">
              Vytvořit smlouvu →
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/6 py-8 mt-8">
        <div className="mx-auto max-w-4xl px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            © 2026 SmlouvaHned · Standardní smluvní vzory — nejsou náhradou za individuální právní poradenství.
          </div>
          <div className="flex gap-4 text-xs text-slate-600">
            <Link href="/obchodni-podminky" className="hover:text-slate-400 transition">Obchodní podmínky</Link>
            <Link href="/gdpr" className="hover:text-slate-400 transition">GDPR</Link>
            <Link href="/kontakt" className="hover:text-slate-400 transition">Kontakt</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
