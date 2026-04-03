import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Stránka nenalezena | SmlouvaHned',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#04070E] text-slate-200 flex items-center justify-center px-6">
      {/* Ambient glow */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 35% at 50% -8%, rgba(245,158,11,0.07) 0%, transparent 60%)',
        }}
      />

      <div className="w-full max-w-xl text-center">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-12 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-xs font-black text-black shadow-[0_0_16px_rgba(245,158,11,0.35)]">
            SH
          </div>
          <span className="font-black tracking-tight text-white text-sm">SmlouvaHned</span>
        </Link>

        {/* 404 */}
        <div
          className="mb-6 text-[7rem] font-black leading-none tracking-[-0.04em] text-transparent bg-clip-text"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%)',
          }}
        >
          404
        </div>

        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-3">
          Stránka nenalezena
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-md mx-auto">
          Adresa, kterou hledáte, neexistuje nebo byla přesunuta. Pokud jste přišli přes odkaz
          v e-mailu, zkuste stránku obnovit nebo nás kontaktujte.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-[14px] bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400 hover:-translate-y-px"
            style={{ boxShadow: '0 0 0 1px rgba(245,158,11,0.4), 0 4px 20px rgba(245,158,11,0.22)' }}
          >
            Zpět na úvod →
          </Link>
          <Link
            href="#vyber-smlouvy"
            className="inline-flex items-center rounded-[14px] border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-slate-400 transition hover:border-white/18 hover:text-slate-200"
          >
            Vybrat smlouvu
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-12 border-t border-white/[0.05] pt-8">
          <div className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-600 mb-5">
            Nejčastěji hledané
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              ['/najem', 'Nájemní smlouva'],
              ['/auto', 'Kupní smlouva na auto'],
              ['/smlouva-o-dilo', 'Smlouva o dílo'],
              ['/nda', 'NDA'],
              ['/pracovni', 'Pracovní smlouva'],
              ['/darovaci', 'Darovací smlouva'],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-1.5 text-xs text-slate-500 transition hover:border-white/14 hover:text-slate-300"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-700">
          Máte problém se stažením?{' '}
          <a
            href="mailto:info@smlouvahned.cz"
            className="text-amber-500/60 hover:text-amber-400 transition"
          >
            info@smlouvahned.cz
          </a>
        </p>
      </div>
    </main>
  );
}
