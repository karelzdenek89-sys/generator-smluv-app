'use client';

import { Suspense, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

const pageShell = 'min-h-screen bg-[#05080f] text-slate-200 py-16 px-6';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const downloadUrl = useMemo(() => {
    if (!sessionId) return null;
    return `/api/contracts/download?session_id=${encodeURIComponent(sessionId)}`;
  }, [sessionId]);

  // Uložit session do localStorage pro zákaznickou zónu (re-download)
  useEffect(() => {
    if (!sessionId) return;
    try {
      const existing = JSON.parse(localStorage.getItem('sh_orders') || '[]') as Array<{ sessionId: string; date: string }>;
      const alreadySaved = existing.some(o => o.sessionId === sessionId);
      if (!alreadySaved) {
        const updated = [{ sessionId, date: new Date().toISOString() }, ...existing].slice(0, 10);
        localStorage.setItem('sh_orders', JSON.stringify(updated));
      }
    } catch {
      // localStorage nemusí být dostupný
    }
  }, [sessionId]);

  if (!sessionId) {
    return (
      <main className={pageShell}>
        <div className="max-w-xl mx-auto text-center pt-20">
          <h1 className="text-3xl font-black mb-4 uppercase tracking-tight text-white">
            Stránka není dostupná
          </h1>
          <p className="text-slate-400 text-sm mb-8">
            Tato stránka je přístupná pouze po přesměrování z platební brány.
          </p>
          <a href="/" className="inline-block px-8 py-4 bg-amber-500 text-black font-black uppercase rounded-2xl hover:bg-amber-400 transition text-sm">
            Vybrat smlouvu
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className={pageShell}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(34,197,94,0.06),transparent_35%)] pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✓
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-3">
            Platba přijata
          </h1>
          <p className="text-slate-400 text-sm">
            Váš dokument je připraven. Stáhněte si jej níže.
          </p>
        </div>

        {/* Download card */}
        <div className="bg-[#0c1426] border border-emerald-500/20 rounded-3xl p-8 mb-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-4 p-5 bg-white/3 rounded-2xl border border-white/5 mb-6">
            <div className="text-4xl flex-shrink-0">📄</div>
            <div>
              <div className="font-bold text-white text-base">Váš právní dokument</div>
              <div className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider">Generováno po ověřené platbě • Stripe</div>
            </div>
          </div>

          <a href={downloadUrl ?? '#'}
            className="block w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xl rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.25)] active:scale-[0.98] text-center uppercase tracking-tight">
            Stáhnout PDF
          </a>

          <div className="mt-5 grid grid-cols-2 gap-3 text-center">
            <div className="bg-white/3 rounded-xl p-3">
              <div className="text-xs font-bold text-emerald-400 mb-0.5">✓ Platný 7 dní</div>
              <div className="text-xs text-slate-500">od zaplacení</div>
            </div>
            <div className="bg-white/3 rounded-xl p-3">
              <div className="text-xs font-bold text-emerald-400 mb-0.5">✓ Opakované stažení</div>
              <div className="text-xs text-slate-500">do vypršení odkazu</div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-[#0c1426] border border-slate-800 rounded-3xl p-6 mb-6">
          <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4">Co dál?</div>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-black">1.</span>
              <span>Otevřete stažený PDF a zkontrolujte všechny vyplněné údaje.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-black">2.</span>
              <span>Vytiskněte 2 vyhotovení — každá strana si ponechá jedno podepsané.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-black">3.</span>
              <span>Obě strany smlouvu podepíší — ideálně v přítomnosti druhé strany.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400 font-black">4.</span>
              <span>Podepsaný originál uložte na bezpečném místě. Naskenujte zálohu.</span>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="/"
            className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-bold text-sm text-center rounded-2xl hover:bg-white/10 transition uppercase tracking-wider">
            Sestavit další smlouvu
          </a>
          <a href="/zakaznicka-zona"
            className="flex-1 py-3 bg-white/5 border border-white/10 text-slate-400 font-bold text-sm text-center rounded-2xl hover:bg-white/10 transition uppercase tracking-wider">
            Moje dokumenty
          </a>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Máte dotaz? <a href="mailto:info@smlouvahned.cz" className="text-amber-500/70 hover:text-amber-400 transition">info@smlouvahned.cz</a>
        </p>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05080f] flex items-center justify-center"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
