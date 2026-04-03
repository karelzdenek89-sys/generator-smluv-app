'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Global error boundary — catches unhandled runtime errors in the app.
 * Must be a Client Component per Next.js App Router spec.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console for monitoring/Sentry integration
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="cs">
      <body className="bg-[#04070E] text-slate-200">
        <main className="min-h-screen flex items-center justify-center px-6">
          {/* Ambient */}
          <div
            className="fixed inset-0 -z-10 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 50% 30% at 50% -5%, rgba(239,68,68,0.06) 0%, transparent 55%)',
            }}
          />

          <div className="w-full max-w-lg text-center">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 mb-12">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-xs font-black text-black">
                SH
              </div>
              <span className="font-black tracking-tight text-white text-sm">SmlouvaHned</span>
            </Link>

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl border border-red-500/20 bg-red-500/8 flex items-center justify-center text-2xl mx-auto mb-6">
              ⚠️
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-3">
              Něco se pokazilo
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md mx-auto">
              Nastala neočekávaná chyba. Vaše data ani platba nejsou ohroženy. Zkuste stránku
              obnovit, nebo nás kontaktujte na{' '}
              <a
                href="mailto:info@smlouvahned.cz"
                className="text-amber-400/80 hover:text-amber-400 transition underline underline-offset-2"
              >
                info@smlouvahned.cz
              </a>
              .
            </p>

            {error.digest && (
              <div className="mb-6 rounded-xl border border-white/6 bg-white/[0.025] px-4 py-2 text-xs text-slate-600 font-mono">
                Kód chyby: {error.digest}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={reset}
                className="inline-flex items-center rounded-[14px] bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
                style={{ boxShadow: '0 0 0 1px rgba(245,158,11,0.4), 0 4px 20px rgba(245,158,11,0.22)' }}
              >
                Zkusit znovu
              </button>
              <Link
                href="/"
                className="inline-flex items-center rounded-[14px] border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-slate-400 transition hover:text-slate-200"
              >
                Zpět na úvod
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
