import Link from 'next/link';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import {
  SITE_NAV_CUSTOMER_ITEMS,
  SITE_NAV_ITEMS,
  SITE_NAV_PRIMARY_CTA,
} from '@/lib/site-nav';

export default function SiteHeader() {
  return (
    <header data-site-header="global" className="sticky top-0 z-40 border-b border-white/8 bg-[#05080f]/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[#c9a852]/40 bg-[#07111e] text-xs font-black text-[#c9a852]">
            SH
          </span>
          <span className="min-w-0">
            <span className="block font-serif text-sm font-semibold tracking-tight text-white">
              SmlouvaHned
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.18em] text-slate-400 xl:block">
              Smlouvy online
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-[13px] text-slate-300 lg:flex xl:gap-6" aria-label="Hlavní navigace">
          {SITE_NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap transition-colors hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-shrink-0 items-center gap-2">
          <LanguageSwitcher current="cs" variant="desktop" />
          <details className="group relative hidden lg:block">
            <summary aria-label="Moje" className="cursor-pointer list-none rounded-lg border border-[#c9a852]/25 px-3 py-2 text-xs font-semibold text-[#c9a852] transition hover:border-[#c9a852]/55 hover:text-[#f2d58a] [&::-webkit-details-marker]:hidden">
              Moje <span aria-hidden="true" className="ml-1 text-[10px] transition-transform group-open:rotate-180">▾</span>
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-[#c9a852]/25 bg-[#050a16] p-2 text-sm shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
              {SITE_NAV_CUSTOMER_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-white/5 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
          <Link
            href={SITE_NAV_PRIMARY_CTA.href}
            className="hidden rounded-lg bg-[#c9a852] px-4 py-2 text-xs font-black uppercase tracking-tight text-[#07111e] transition hover:bg-[#e4c878] sm:inline-flex"
          >
            {SITE_NAV_PRIMARY_CTA.label}
          </Link>

          {/* Kompaktní menu zůstává aktivní i na tabletu. Plná navigace se
              zobrazí až od lg, kde se logo, jazyk a odkazy bezpečně vejdou. */}
          <details className="group relative lg:hidden">
            <summary
              className="flex cursor-pointer select-none list-none items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-200 [&::-webkit-details-marker]:hidden"
              aria-label="Otevřít menu"
            >
              Menu
              <span aria-hidden="true" className="text-[10px] transition-transform group-open:rotate-180">▾</span>
            </summary>
            <nav
              aria-label="Hlavní navigace"
              className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-[#c9a852]/25 bg-[#050a16] p-2 text-sm shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
            >
              {[...SITE_NAV_ITEMS, ...SITE_NAV_CUSTOMER_ITEMS, SITE_NAV_PRIMARY_CTA].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
