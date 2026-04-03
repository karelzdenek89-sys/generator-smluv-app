'use client';

import { Suspense, useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

const pageShell = 'min-h-screen bg-[#05080f] text-slate-200 py-16 px-6';

type DownloadState = 'checking' | 'ready' | 'error';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [dlState, setDlState] = useState<DownloadState>('checking');
  const attemptRef = useRef(0);
  const [progress, setProgress] = useState(0); // 0–100 for progress bar

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

  // Polling: ověřujeme stav platby přes Stripe před zobrazením tlačítka
  useEffect(() => {
    if (!sessionId) {
      setDlState('ready');
      return;
    }

    const maxAttempts = 12; // 12 × 1500 ms = 18 s max
    let cancelled = false;

    async function checkStatus() {
      if (cancelled) return;

      // Update progress bar: each attempt advances it toward 90%, final jump to 100% on success
      setProgress(Math.min(90, Math.round((attemptRef.current / maxAttempts) * 90)));

      try {
        const res = await fetch(
          `/api/contracts/status?session_id=${encodeURIComponent(sessionId!)}`,
          { cache: 'no-store' },
        );
        const data = (await res.json()) as { status: string };

        if (cancelled) return;

        if (data.status === 'paid') {
          setProgress(100);
          setDlState('ready');
        } else if (attemptRef.current < maxAttempts) {
          attemptRef.current += 1;
          setTimeout(checkStatus, 1500);
        } else {
          setDlState('error');
        }
      } catch {
        if (cancelled) return;
        if (attemptRef.current < maxAttempts) {
          attemptRef.current += 1;
          setTimeout(checkStatus, 1500);
        } else {
          setDlState('error');
        }
      }
    }

    checkStatus();

    return () => { cancelled = true; };
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
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 transition-all duration-500 ${
            dlState === 'ready'
              ? 'bg-emerald-500/10 border-2 border-emerald-500/30'
              : dlState === 'error'
              ? 'bg-red-500/10 border-2 border-red-500/30'
              : 'bg-amber-500/10 border-2 border-amber-500/20'
          }`}>
            {dlState === 'checking' ? (
              <div className="w-9 h-9 border-[3px] border-amber-400 border-t-transparent rounded-full animate-spin" />
            ) : dlState === 'ready' ? '✓' : '⚠'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-3">
            {dlState === 'checking' ? 'Zpracováváme…' : 'Platba přijata'}
          </h1>
          {dlState === 'checking' && (
            <div className="mb-4 px-4">
              <div className="text-sm text-slate-400 mb-2">Ověřujeme platbu, obvykle to trvá 5–10 sekund&hellip;</div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.max(5, progress)}%` }}
                />
              </div>
            </div>
          )}
          {dlState === 'ready' && (
            <p className="text-slate-400 text-sm">
              Dokument je připraven ke stažení.
            </p>
          )}
        </div>

        {/* Download card */}
        <div className="bg-[#0c1426] border border-emerald-500/20 rounded-3xl p-8 mb-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-4 p-5 bg-white/3 rounded-2xl border border-white/5 mb-6">
            <div className="text-4xl flex-shrink-0">📄</div>
            <div>
              <div className="font-bold text-white text-base">Váš smluvní dokument</div>
              <div className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider">Generováno po ověřené platbě • Stripe</div>
            </div>
          </div>

          {/* Stav tlačítka závisí na dlState */}
          {dlState === 'checking' && (
            <div className="flex flex-col items-center justify-center py-5 gap-3">
              <p className="text-sm text-slate-500 italic">Příprava dokumentu probíhá&hellip;</p>
            </div>
          )}

          {dlState === 'ready' && (
            <a href={downloadUrl ?? '#'}
              className="block w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xl rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.25)] active:scale-[0.98] text-center uppercase tracking-tight">
              Stáhnout PDF
            </a>
          )}

          {dlState === 'error' && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-5 text-center">
              <p className="text-sm text-red-300 font-bold mb-1">Platba se ještě zpracovává</p>
              <p className="text-xs text-slate-400 mb-3">Odkaz ke stažení obdržíte e-mailem, nebo zkuste stránku obnovit za chvíli.</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => { attemptRef.current = 0; setDlState('checking'); }}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition"
                >
                  Zkusit znovu
                </button>
                <a href="mailto:info@smlouvahned.cz"
                  className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-sm hover:bg-white/10 transition">
                  Kontaktovat podporu
                </a>
              </div>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3 text-center">
            <div className="bg-white/3 rounded-xl p-3">
              <div className="text-xs font-bold text-emerald-400 mb-0.5">✓ Platný 7–30 dní</div>
              <div className="text-xs text-slate-500">dle zvoleného balíčku</div>
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
              <span>Otevřete stažený PDF a zkontrolujte všechny vyplněné údaje — strany, předmět, ceny, termíny.</span>
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

        {/* Compliance note */}
        <div className="rounded-2xl border border-white/5 bg-white/2 px-5 py-4 mb-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-500">Připomínka:</span>{' '}
            SmlouvaHned.cz je softwarový nástroj pro tvorbu standardizovaných dokumentů — není advokátní kanceláří a neposkytuje právní poradenství. Obsah dokumentu je určen vašimi vstupy. Pokud vaše situace zahrnuje vyšší hodnotu, více stran nebo probíhající spor, doporučujeme konzultaci s advokátem{' '}
            (<a href="https://www.cak.cz" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-slate-500 transition">cak.cz</a>).
          </p>
        </div>

        {/* Cross-sell sekce */}
        <div className="bg-[#0c1426] border border-slate-800 rounded-3xl p-6 mb-6">
          <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1">Možná potřebujete také</div>
          <p className="text-xs text-slate-500 mb-5">Nejčastěji kombinované dokumenty k vaší smlouvě</p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'Předávací protokol', desc: 'Součást nájemní smlouvy — zdokumentuje stav bytu při předání.', href: '/najem', badge: 'Bydlení' },
              { title: 'Smlouva o mlčenlivosti (NDA)', desc: 'Pro každý obchodní vztah, kde sdílíte citlivé informace.', href: '/nda', badge: 'Podnikání' },
              { title: 'Uznání dluhu', desc: 'Obnoví promlčecí lhůtu na 10 let. Klíčový dokument pro vymahatelnost pohledávky.', href: '/uznani-dluhu', badge: 'Finance' },
              { title: 'Smlouva o dílo', desc: 'Pro řemeslníky, freelancery i stavební práce — termíny a sankce.', href: '/smlouva-o-dilo', badge: 'Práce' },
              { title: 'Plná moc', desc: 'Zastoupení na úřadě, v bance nebo při podpisu smlouvy.', href: '/plna-moc', badge: 'Obecné' },
            ].map(item => (
              <a key={item.href} href={item.href}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-3 hover:bg-white/6 hover:border-white/15 transition group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-white">{item.title}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-white/5 px-2 py-0.5 rounded-full">{item.badge}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">{item.desc}</p>
                </div>
                <span className="text-slate-600 group-hover:text-amber-400 transition flex-shrink-0">→</span>
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="/"
            className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-bold text-sm text-center rounded-2xl hover:bg-white/10 transition uppercase tracking-wider">
            Všechny smlouvy
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
