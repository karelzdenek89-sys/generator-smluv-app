'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

const pageShell =
  'min-h-screen bg-[#05080f] text-slate-200 font-sans py-20 px-6';

const cardClass =
  'bg-[#0c1426] border border-slate-800 rounded-3xl p-8 mb-8 text-left relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const downloadUrl = useMemo(() => {
    if (!sessionId) return null;
    return `/api/contracts/download?session_id=${encodeURIComponent(sessionId)}`;
  }, [sessionId]);

  if (!sessionId) {
    return (
      <main className={pageShell}>
        <div className="max-w-3xl mx-auto text-center pt-20">
          <h1 className="text-4xl font-black mb-6 uppercase tracking-tight">
            Chybí <span className="text-amber-500">session_id</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Tato stránka je dostupná jen po návratu z platební brány Stripe.
          </p>
          <a
            href="/"
            className="inline-block mt-8 px-8 py-3 bg-amber-500 text-black font-bold rounded-xl"
          >
            Zpět na hlavní stranu
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className={pageShell}>
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-black mb-8 italic uppercase tracking-tighter">
          Platba byla <span className="text-amber-500">přijata</span>
        </h1>

        <div className={cardClass}>
          <div className="flex items-center gap-6 mb-10 p-6 bg-white/5 rounded-3xl border border-white/5">
            <div className="text-5xl">📄</div>
            <div className="text-left">
              <div className="text-lg font-bold text-white">
                Váš právní dokument
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">
                Ověřená platba • Bezpečné serverové generování
              </div>
            </div>
          </div>

          <a
            href={downloadUrl ?? '#'}
            className="block w-full py-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-2xl rounded-3xl hover:brightness-110 transition-all shadow-2xl active:scale-[0.98] text-center"
          >
            STÁHNOUT PDF
          </a>

          <p className="text-center text-xs text-slate-500 mt-6 uppercase font-bold tracking-widest">
            Data nejsou ukládána v localStorage. PDF je dostupné jen po ověřené platbě.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05080f]" />}>
      <SuccessContent />
    </Suspense>
  );
}