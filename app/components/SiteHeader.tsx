import Link from 'next/link';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

const navItems = [
  { href: '/#smlouvy', label: 'Smlouvy' },
  { href: '/#balicky', label: 'Balíčky' },
  { href: '/#jak-to-funguje', label: 'Postup' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
];

export default function SiteHeader() {
  return (
    <header data-site-header="global" className="sticky top-0 z-40 border-b border-white/8 bg-[#05080f]/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[#c9a852]/40 bg-[#07111e] text-xs font-black text-[#c9a852]">
            SH
          </span>
          <span className="min-w-0">
            <span className="block font-serif text-sm font-semibold italic tracking-tight text-white">
              SmlouvaHned
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.18em] text-slate-600 sm:block">
              Smluvní dokumenty online
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-[13px] text-slate-400 md:flex" aria-label="Hlavní navigace">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher current="cs" variant="desktop" />
          <Link
            href="/zakaznicka-zona"
            className="hidden rounded-lg border border-[#c9a852]/25 px-3 py-2 text-xs font-semibold text-[#c9a852] transition hover:border-[#c9a852]/55 hover:text-[#f2d58a] sm:inline-flex"
          >
            Moje dokumenty
          </Link>
          <Link
            href="/#smlouvy"
            className="rounded-lg bg-[#c9a852] px-4 py-2 text-xs font-black uppercase tracking-tight text-[#07111e] transition hover:bg-[#e4c878]"
          >
            Vybrat
          </Link>
        </div>
      </div>
    </header>
  );
}
