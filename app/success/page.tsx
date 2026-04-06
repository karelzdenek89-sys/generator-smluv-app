'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type DownloadState = 'checking' | 'ready' | 'error';

type SuccessStatusResponse = {
  status: 'pending' | 'paid' | 'error';
  tier?: 'basic' | 'complete';
  tierLabel?: string;
  packageKey?: string | null;
  packageLabel?: string | null;
  priceLabel?: string;
  archiveDays?: number;
  contractType?: string;
  contractName?: string;
  includedItems?: string[];
};

const pageShell = 'min-h-screen bg-[#05080f] px-6 py-16 text-slate-200';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [dlState, setDlState] = useState<DownloadState>('checking');
  const [progress, setProgress] = useState(0);
  const [orderMeta, setOrderMeta] = useState<SuccessStatusResponse | null>(null);
  const attemptRef = useRef(0);
  const encodedSessionId = sessionId ? encodeURIComponent(sessionId) : null;

  const downloadUrl = useMemo(() => {
    if (!encodedSessionId) return null;
    return `/api/contracts/download?session_id=${encodedSessionId}`;
  }, [encodedSessionId]);

  const purchaseTitle =
    orderMeta?.packageLabel ?? orderMeta?.contractName ?? 'Váš smluvní dokument';

  useEffect(() => {
    if (!encodedSessionId || !sessionId) return;

    try {
      const existing = JSON.parse(localStorage.getItem('sh_orders') || '[]') as Array<{
        sessionId: string;
        date: string;
      }>;
      const alreadySaved = existing.some((order) => order.sessionId === sessionId);
      if (!alreadySaved) {
        const updated = [{ sessionId, date: new Date().toISOString() }, ...existing].slice(0, 10);
        localStorage.setItem('sh_orders', JSON.stringify(updated));
      }
    } catch {
      // localStorage nemusí být dostupné
    }
  }, [encodedSessionId, sessionId]);

  useEffect(() => {
    if (!encodedSessionId) return;

    const maxAttempts = 12;
    let cancelled = false;

    async function checkStatus() {
      if (cancelled) return;

      setProgress(Math.min(90, Math.round((attemptRef.current / maxAttempts) * 90)));

      try {
        const res = await fetch(`/api/contracts/status?session_id=${encodedSessionId}`, {
          cache: 'no-store',
        });
        const data = (await res.json()) as SuccessStatusResponse;

        if (cancelled) return;

        if (data.status === 'paid') {
          setOrderMeta(data);
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
  }, [encodedSessionId]);

  if (!sessionId) {
    return (
      <main className={pageShell}>
        <div className="mx-auto max-w-xl pt-20 text-center">
          <h1 className="mb-4 text-3xl font-black uppercase tracking-tight text-white">
            Stránka není dostupná
          </h1>
          <p className="mb-8 text-sm text-slate-400">
            Tato stránka je přístupná pouze po přesměrování z platební brány.
          </p>
          <Link
            href="/"
            className="inline-block rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase text-black transition hover:bg-amber-400"
          >
            Vybrat dokument
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={pageShell}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(34,197,94,0.06),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-xl">
        <div className="mb-10 text-center">
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
          <h1 className="mb-3 text-4xl font-black uppercase tracking-tighter text-white md:text-5xl">
            {dlState === 'checking' ? 'Zpracováváme platbu' : 'Platba přijata'}
          </h1>
          {dlState === 'checking' && (
            <div className="mb-4 px-4">
              <div className="mb-2 text-sm text-slate-400">
                Ověřujeme platbu, obvykle to trvá několik sekund.
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700 ease-out"
                  style={{ width: `${Math.max(5, progress)}%` }}
                />
              </div>
            </div>
          )}
          {dlState === 'ready' && (
            <p className="text-sm text-slate-400">Dokument je připraven ke stažení.</p>
          )}
        </div>

        <div className="mb-6 rounded-3xl border border-emerald-500/20 bg-[#0c1426] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-white/5 bg-white/3 p-5">
            <div className="flex-shrink-0 text-4xl">📄</div>
            <div>
              <div className="text-base font-bold text-white">{purchaseTitle}</div>
              <div className="mt-0.5 text-xs uppercase tracking-wider text-slate-500">
                Generováno po ověřené platbě • Stripe
              </div>
            </div>
          </div>

          {orderMeta?.tierLabel && orderMeta?.priceLabel && (
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
                <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Zakoupená varianta
                </div>
                <div className="text-sm font-semibold text-white">
                  {orderMeta.packageLabel ?? orderMeta.tierLabel}
                </div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
                <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Zaplacená částka
                </div>
                <div className="text-sm font-semibold text-white">
                  {orderMeta.priceLabel}
                </div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
                <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Dostupnost odkazu
                </div>
                <div className="text-sm font-semibold text-white">
                  {orderMeta.archiveDays} dní
                </div>
              </div>
            </div>
          )}

          {dlState === 'checking' && (
            <div className="flex flex-col items-center justify-center gap-3 py-5">
              <p className="text-sm italic text-slate-500">
                Příprava dokumentu probíhá…
              </p>
            </div>
          )}

          {dlState === 'ready' && (
            <a
              href={downloadUrl ?? '#'}
              className="block w-full rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 py-5 text-center text-xl font-black tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Stáhnout PDF
            </a>
          )}

          {dlState === 'error' && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-center">
              <p className="mb-1 text-sm font-bold text-red-300">
                Platba se ještě zpracovává
              </p>
              <p className="mb-3 text-xs text-slate-400">
                Odkaz ke stažení obdržíte e-mailem, nebo zkuste stránku obnovit za
                chvíli.
              </p>
              <div className="flex flex-col justify-center gap-2 sm:flex-row">
                <button
                  onClick={() => {
                    attemptRef.current = 0;
                    setDlState('checking');
                  }}
                  className="rounded-xl bg-amber-500 px-5 py-2 text-sm font-bold text-black transition hover:bg-amber-400"
                >
                  Zkusit znovu
                </button>
                <a
                  href="mailto:info@smlouvahned.cz"
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/10"
                >
                  Kontaktovat podporu
                </a>
              </div>
            </div>
          )}

          {orderMeta?.includedItems && orderMeta.includedItems.length > 0 && (
            <div className="mt-5 rounded-2xl border border-white/5 bg-white/3 p-4">
              <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-amber-400">
                Součást zakoupené varianty
              </div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                {orderMeta.includedItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-0.5 text-amber-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-white/3 p-3">
              <div className="mb-0.5 text-xs font-bold text-emerald-400">
                ✓ Odkaz ke stažení
              </div>
              <div className="text-xs text-slate-500">
                {orderMeta?.archiveDays
                  ? `${orderMeta.archiveDays} dní od zaplacení`
                  : 'dle zvolené varianty'}
              </div>
            </div>
            <div className="rounded-xl bg-white/3 p-3">
              <div className="mb-0.5 text-xs font-bold text-emerald-400">
                ✓ Opakované stažení
              </div>
              <div className="text-xs text-slate-500">do vypršení odkazu</div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/zakaznicka-zona"
            className="rounded-2xl border border-white/8 bg-white/3 px-6 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/6"
          >
            Moje dokumenty
          </Link>
          <Link
            href="/"
            className="rounded-2xl border border-white/8 bg-white/3 px-6 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/6"
          >
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<main className={pageShell} />}>
      <SuccessContent />
    </Suspense>
  );
}
