'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PDF_OUTPUT_TEXT, SERVICE_DISCLAIMER_CZ } from '@/lib/servicePositioning';

const pageShell = 'premium-page-bg-ref px-6 py-16 text-slate-200';

type DownloadState = 'checking' | 'ready' | 'error';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [dlState, setDlState] = useState<DownloadState>('checking');
  const attemptRef = useRef(0);
  const [progress, setProgress] = useState(0);

  const downloadUrl = useMemo(() => {
    if (!sessionId) return null;
    return `/api/contracts/download?session_id=${encodeURIComponent(sessionId)}`;
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    try {
      const existing = JSON.parse(localStorage.getItem('sh_orders') || '[]') as Array<{ sessionId: string; date: string }>;
      const alreadySaved = existing.some(order => order.sessionId === sessionId);
      if (!alreadySaved) {
        const updated = [{ sessionId, date: new Date().toISOString() }, ...existing].slice(0, 10);
        localStorage.setItem('sh_orders', JSON.stringify(updated));
      }
    } catch {
      // localStorage nemusí být dostupné
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const maxAttempts = 12;
    const currentSessionId = sessionId;
    let cancelled = false;

    async function checkStatus() {
      if (cancelled) return;

      setProgress(Math.min(90, Math.round((attemptRef.current / maxAttempts) * 90)));

      try {
        const res = await fetch(`/api/contracts/status?session_id=${encodeURIComponent(currentSessionId)}`, {
          cache: 'no-store',
        });
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

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (!sessionId) {
    return (
      <main className={pageShell}>
        <div className="premium-page-shell-ref max-w-xl pt-20 text-center">
          <h1 className="mb-4 text-3xl font-black text-white">Stránka není dostupná</h1>
          <p className="mb-8 text-sm text-slate-400">Tato stránka je přístupná pouze po přesměrování z platební brány.</p>
          <Link href="/" className="btn-primary-ref inline-flex rounded-2xl px-8 py-4 text-sm">
            Vybrat smlouvu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={pageShell}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(34,197,94,0.06),transparent_35%)]" />

      <div className="premium-page-shell-ref max-w-2xl">
        <div className="premium-page-hero-ref mb-10 text-center">
          <div
            className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-4xl transition-all duration-500 ${
              dlState === 'ready'
                ? 'border-2 border-emerald-500/30 bg-emerald-500/10'
                : dlState === 'error'
                  ? 'border-2 border-red-500/30 bg-red-500/10'
                  : 'border-2 border-amber-500/20 bg-amber-500/10'
            }`}
          >
            {dlState === 'checking' ? (
              <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-amber-400 border-t-transparent" />
            ) : dlState === 'ready' ? (
              '✓'
            ) : (
              '⚠'
            )}
          </div>

          <h1 className="font-heading-serif text-4xl text-white md:text-5xl">
            {dlState === 'checking' ? 'Zpracováváme objednávku' : 'Platba přijata'}
          </h1>

          {dlState === 'checking' ? (
            <div className="mx-auto mt-5 max-w-md px-4">
              <div className="mb-2 text-sm text-slate-400">Ověřujeme platbu, obvykle to trvá 5 až 10 sekund.</div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700 ease-out"
                  style={{ width: `${Math.max(5, progress)}%` }}
                />
              </div>
            </div>
          ) : null}

          {dlState === 'ready' ? <p className="mt-4 text-sm text-slate-400">Dokument je dostupný ke stažení.</p> : null}
          {dlState === 'error' ? <p className="mt-4 text-sm text-slate-400">Platba se ještě zpracovává nebo se nepodařilo ověřit stav.</p> : null}
        </div>

        <div className="premium-page-card-ref mb-6 border-emerald-500/20 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-white/5 bg-white/3 p-5">
            <div className="text-4xl">PDF</div>
            <div>
              <div className="text-base font-bold text-white">Váš smluvní dokument</div>
              <div className="mt-0.5 text-xs uppercase tracking-[0.18em] text-slate-500">Zpřístupněno po ověřené platbě · Stripe</div>
            </div>
          </div>

          {dlState === 'checking' ? (
            <div className="flex flex-col items-center justify-center gap-3 py-5">
              <p className="text-sm italic text-slate-500">Příprava dokumentu probíhá…</p>
            </div>
          ) : null}

          {dlState === 'ready' ? (
            <a href={downloadUrl ?? '#'} className="btn-primary-ref flex w-full justify-center rounded-2xl py-5 text-xl font-black tracking-tight">
              Stáhnout PDF
            </a>
          ) : null}

          {dlState === 'error' ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-center">
              <p className="mb-1 text-sm font-bold text-red-300">Platba se ještě zpracovává</p>
              <p className="mb-3 text-xs text-slate-400">Odkaz ke stažení obdržíte e-mailem, nebo zkuste stránku obnovit za chvíli.</p>
              <div className="flex flex-col justify-center gap-2 sm:flex-row">
                <button
                  onClick={() => {
                    attemptRef.current = 0;
                    setDlState('checking');
                  }}
                  className="btn-primary-ref justify-center rounded-xl px-5 py-2 text-sm"
                >
                  Zkusit znovu
                </button>
                <a href="mailto:info@smlouvahned.cz" className="btn-outline-ref justify-center rounded-xl px-5 py-2 text-sm">
                  Kontaktovat podporu
                </a>
              </div>
            </div>
          ) : null}

          <div className="mt-5 grid grid-cols-2 gap-3 text-center">
            <div className="premium-note-card-ref p-3">
              <div className="mb-0.5 text-xs font-bold text-emerald-400">✓ Platný 7 až 30 dnů</div>
              <div className="text-xs text-slate-500">dle zvolené varianty</div>
            </div>
            <div className="premium-note-card-ref p-3">
              <div className="mb-0.5 text-xs font-bold text-emerald-400">✓ Opakované stažení</div>
              <div className="text-xs text-slate-500">do vypršení odkazu</div>
            </div>
          </div>
        </div>

        <div className="premium-page-card-ref mb-6 p-6">
          <div className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-amber-400">Co dál?</div>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-3">
              <span className="font-black text-amber-400">1.</span>
              <span>Otevřete stažené PDF a zkontrolujte všechny vyplněné údaje, včetně stran, předmětu, cen i termínů.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-black text-amber-400">2.</span>
              <span>Vytiskněte potřebný počet vyhotovení tak, aby každá strana měla svůj podepsaný originál.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-black text-amber-400">3.</span>
              <span>Dokument podepište a případně doplňte přílohy nebo další podklady podle zvolené varianty.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-black text-amber-400">4.</span>
              <span>Podepsaný originál uložte na bezpečné místo a digitální kopii si archivujte.</span>
            </li>
          </ul>
        </div>

        <div className="premium-note-card-ref mb-6 px-5 py-4">
          <p className="text-xs leading-relaxed text-slate-500">
            <span className="font-semibold text-slate-300">Připomínka:</span> {SERVICE_DISCLAIMER_CZ}{' '}
            <span className="block pt-2">{PDF_OUTPUT_TEXT}</span>
          </p>
        </div>

        <div className="premium-page-card-ref mb-6 p-6">
          <div className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-amber-400">Možná potřebujete také</div>
          <p className="mb-5 text-xs text-slate-500">Nejčastěji kombinované dokumenty k vaší smlouvě</p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'Předávací protokol', desc: 'Součást nájemní smlouvy – zachycuje stav bytu při předání.', href: '/najem', badge: 'Bydlení' },
              { title: 'Smlouva o mlčenlivosti (NDA)', desc: 'Pro obchodní vztahy, ve kterých sdílíte citlivé informace.', href: '/nda', badge: 'Podnikání' },
              { title: 'Uznání dluhu', desc: 'Potvrzení závazku a splátkových podmínek.', href: '/uznani-dluhu', badge: 'Finance' },
              { title: 'Smlouva o dílo', desc: 'Pro řemeslníky, freelancery i stavební práce – termíny a podmínky.', href: '/smlouva-o-dilo', badge: 'Práce' },
              { title: 'Plná moc', desc: 'Zastoupení na úřadě, v bance nebo při podpisu smlouvy.', href: '/plna-moc', badge: 'Obecné' },
            ].map(item => (
              <a key={item.href} href={item.href} className="group flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/3 px-4 py-3 transition hover:border-white/15 hover:bg-white/6">
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{item.title}</span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs leading-snug text-slate-500">{item.desc}</p>
                </div>
                <span className="shrink-0 text-slate-600 transition group-hover:text-amber-400">→</span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-outline-ref flex-1 justify-center rounded-2xl py-3 text-sm">
            Všechny smlouvy
          </Link>
          <a href="/zakaznicka-zona" className="btn-outline-ref flex-1 justify-center rounded-2xl py-3 text-sm">
            Moje dokumenty
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Máte dotaz?{' '}
          <a href="mailto:info@smlouvahned.cz" className="text-amber-500/70 transition hover:text-amber-400">
            info@smlouvahned.cz
          </a>
        </p>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#05080f]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
