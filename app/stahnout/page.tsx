'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PostPurchaseOffers from '@/app/components/PostPurchaseOffers';

type DownloadRequest = {
  sessionId: string;
  token: string;
  lang: string;
  format: 'pdf' | 'docx';
};

export default function SecureDownloadPage() {
  const [request, setRequest] = useState<DownloadRequest | null>(null);
  const [state, setState] = useState<'preparing' | 'ready' | 'error'>('preparing');
  const [error, setError] = useState('');
  const startedFor = useRef('');

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = new URLSearchParams(url.hash.replace(/^#/, '')).get('token')?.trim() ?? '';
    const sessionId = url.searchParams.get('session_id')?.trim() ?? '';
    const lang = url.searchParams.get('lang')?.trim() ?? 'cs';
    const format = url.searchParams.get('format') === 'docx' ? 'docx' : 'pdf';
    url.hash = '';
    window.history.replaceState(null, '', `${url.pathname}${url.search}`);
    if (!token || !sessionId) {
      setError('Odkaz ke stažení je neplatný nebo neúplný. Použijte odkaz z potvrzovacího e-mailu.');
      setState('error');
      return;
    }
    setRequest({ token, sessionId, lang, format });
  }, []);

  const startDownload = useCallback(async () => {
    if (!request) return;
    setState('preparing');
    setError('');
    try {
      const response = await fetch('/api/contracts/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: request.sessionId,
          token: request.token,
          lang: request.lang,
          format: request.format,
        }),
        cache: 'no-store',
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Dokument se nepodařilo připravit.');
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const disposition = response.headers.get('content-disposition') ?? '';
      const fileName = disposition.match(/filename="([^"]+)"/i)?.[1]
        ?? `smlouva.${request.format}`;
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
      setState('ready');
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : 'Dokument se nepodařilo stáhnout.');
      setState('error');
    }
  }, [request]);

  useEffect(() => {
    if (!request) return;
    const key = `${request.sessionId}:${request.format}`;
    if (startedFor.current === key) return;
    startedFor.current = key;
    void startDownload();
  }, [request, startDownload]);

  return (
    <main className="min-h-screen bg-[#05080f] px-6 py-20 text-slate-200">
      <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-[#0c1426] p-8 text-center">
        <h1 className="text-3xl font-black text-white">Bezpečné stažení dokumentu</h1>
        {state === 'preparing' ? <p className="mt-4 text-slate-400">Připravuji váš dokument…</p> : null}
        {state === 'ready' ? (
          <p className="mt-4 text-emerald-300">Stahování bylo zahájeno. Pokud se nespustilo, použijte tlačítko níže.</p>
        ) : null}
        {state === 'error' ? <p role="alert" className="mt-4 text-rose-300">{error}</p> : null}
        {request ? (
          <button
            type="button"
            onClick={() => void startDownload()}
            className="mt-6 w-full rounded-xl bg-amber-500 px-5 py-3 font-black text-black hover:bg-amber-400"
          >
            Stáhnout znovu
          </button>
        ) : null}
        <Link href="/zakaznicka-zona" className="mt-5 inline-block text-sm text-amber-400 underline">
          Přejít do zákaznické zóny
        </Link>
      </div>

      {/* Tato stránka zná jen session a token, nikoli typ dokumentu, takže se
          zobrazí pouze nabídky nezávislé na typu smlouvy. Nabídky vázané na
          konkrétní dokument zůstávají na success stránce. */}
      {state === 'ready' ? (
        <div className="mx-auto mt-6 max-w-lg text-left">
          <PostPurchaseOffers sourcePage="download" locale={request?.lang ?? 'cs'} />
        </div>
      ) : null}
    </main>
  );
}
