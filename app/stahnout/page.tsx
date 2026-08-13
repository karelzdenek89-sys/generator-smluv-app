'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PartnerNextSteps from '@/app/components/partners/PartnerNextSteps';
import type { PartnerContext, PublicPartnerOffer } from '@/lib/partners/types';
import { normalizeLocale, withLocale, type AppLocale } from '@/lib/locale';

const DOWNLOAD_COPY: Record<AppLocale, {
  title: string;
  preparing: string;
  ready: string;
  invalidLink: string;
  prepareError: string;
  downloadError: string;
  retry: string;
  customerZone: string;
}> = {
  cs: {
    title: 'Bezpečné stažení dokumentu',
    preparing: 'Připravuji váš dokument…',
    ready: 'Stahování bylo zahájeno. Pokud se nespustilo, použijte tlačítko níže.',
    invalidLink: 'Odkaz ke stažení je neplatný nebo neúplný. Použijte odkaz z potvrzovacího e-mailu.',
    prepareError: 'Dokument se nepodařilo připravit.',
    downloadError: 'Dokument se nepodařilo stáhnout.',
    retry: 'Stáhnout znovu',
    customerZone: 'Přejít do zákaznické zóny',
  },
  en: {
    title: 'Secure document download',
    preparing: 'Preparing your document…',
    ready: 'The download has started. If it did not start, use the button below.',
    invalidLink: 'The download link is invalid or incomplete. Use the link from your confirmation email.',
    prepareError: 'We could not prepare the document.',
    downloadError: 'We could not download the document.',
    retry: 'Download again',
    customerZone: 'Go to my documents',
  },
  ua: {
    title: 'Безпечне завантаження документа',
    preparing: 'Готуємо ваш документ…',
    ready: 'Завантаження розпочато. Якщо воно не почалося, скористайтеся кнопкою нижче.',
    invalidLink: 'Посилання для завантаження недійсне або неповне. Скористайтеся посиланням із листа-підтвердження.',
    prepareError: 'Не вдалося підготувати документ.',
    downloadError: 'Не вдалося завантажити документ.',
    retry: 'Завантажити ще раз',
    customerZone: 'Перейти до моїх документів',
  },
};

type PaidDownloadRequest = {
  kind: 'paid';
  sessionId: string;
  token: string;
  lang: AppLocale;
  format: 'pdf' | 'docx';
};

type FreeDownloadRequest = {
  kind: 'free';
  freeId: string;
  token: string;
  lang: AppLocale;
  format: 'pdf';
};

type DownloadRequest = PaidDownloadRequest | FreeDownloadRequest;

export default function SecureDownloadPage() {
  const [request, setRequest] = useState<DownloadRequest | null>(null);
  const [locale, setLocale] = useState<AppLocale>('cs');
  const [state, setState] = useState<'preparing' | 'ready' | 'error'>('preparing');
  const [error, setError] = useState('');
  const [partnerResult, setPartnerResult] = useState<{
    context: PartnerContext;
    offers: PublicPartnerOffer[];
    attributionId?: string | null;
  } | null>(null);
  const startedFor = useRef('');

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = new URLSearchParams(url.hash.replace(/^#/, '')).get('token')?.trim() ?? '';
    const sessionId = url.searchParams.get('session_id')?.trim() ?? '';
    const freeId = url.searchParams.get('free_id')?.trim() ?? '';
    const lang = normalizeLocale(url.searchParams.get('lang'));
    const initialCopy = DOWNLOAD_COPY[lang];
    setLocale(lang);
    const format = url.searchParams.get('format') === 'docx' ? 'docx' : 'pdf';
    url.hash = '';
    window.history.replaceState(null, '', `${url.pathname}${url.search}`);
    if (!token || (!sessionId && !freeId) || (sessionId && freeId)) {
      setError(initialCopy.invalidLink);
      setState('error');
      return;
    }
    if (freeId) {
      setRequest({ kind: 'free', token, freeId, lang, format: 'pdf' });
    } else {
      setRequest({ kind: 'paid', token, sessionId, lang, format });
    }
  }, []);

  const startDownload = useCallback(async () => {
    if (!request) return;
    const requestCopy = DOWNLOAD_COPY[request.lang];
    setState('preparing');
    setError('');
    try {
      const response = await fetch(
        request.kind === 'free' ? '/api/contracts/free/download' : '/api/contracts/download',
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request.kind === 'free'
          ? { freeId: request.freeId, token: request.token }
          : {
              sessionId: request.sessionId,
              token: request.token,
              lang: request.lang,
              format: request.format,
            }),
        cache: 'no-store',
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(request.lang === 'cs' && payload?.error ? payload.error : requestCopy.prepareError);
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
      setError(downloadError instanceof Error ? downloadError.message : requestCopy.downloadError);
      setState('error');
    }
  }, [request]);

  useEffect(() => {
    if (!request) return;
    const key = request.kind === 'free'
      ? `${request.freeId}:pdf`
      : `${request.sessionId}:${request.format}`;
    if (startedFor.current === key) return;
    startedFor.current = key;
    void startDownload();
  }, [request, startDownload]);

  useEffect(() => {
    if (!request || state !== 'ready') return;
    let cancelled = false;
    void fetch(request.kind === 'free' ? '/api/contracts/free/status' : '/api/contracts/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request.kind === 'free'
        ? { freeId: request.freeId, token: request.token }
        : { sessionId: request.sessionId, token: request.token }),
      cache: 'no-store',
    })
      .then((response) => response.ok ? response.json() : null)
      .then((data: { partnerContext?: PartnerContext; partnerOffers?: PublicPartnerOffer[]; partnerAttributionId?: string | null } | null) => {
        if (!cancelled && data?.partnerContext && Array.isArray(data.partnerOffers)) {
          setPartnerResult({ context: data.partnerContext, offers: data.partnerOffers, attributionId: data.partnerAttributionId });
        }
      })
      .catch(() => {
        // Partner lookup is optional and must never affect a successful download.
      });
    return () => { cancelled = true; };
  }, [request, state]);

  const copy = DOWNLOAD_COPY[locale];

  return (
    <main className="min-h-screen bg-[#05080f] px-6 py-20 text-slate-200">
      <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-[#0c1426] p-8 text-center">
        <h1 className="text-3xl font-black text-white">{copy.title}</h1>
        {state === 'preparing' ? <p className="mt-4 text-slate-400">{copy.preparing}</p> : null}
        {state === 'ready' ? (
          <p className="mt-4 text-emerald-300">{copy.ready}</p>
        ) : null}
        {state === 'error' ? <p role="alert" className="mt-4 text-rose-300">{error}</p> : null}
        {request ? (
          <button
            type="button"
            onClick={() => void startDownload()}
            className="mt-6 w-full rounded-xl bg-amber-500 px-5 py-3 font-black text-black hover:bg-amber-400"
          >
            {copy.retry}
          </button>
        ) : null}
        <Link href={withLocale('/zakaznicka-zona', locale)} className="mt-5 inline-block text-sm text-amber-400 underline">
          {copy.customerZone}
        </Link>
      </div>

      {/* Kontext i nabídky vrací server až po ověření platby a download tokenu. */}
      {state === 'ready' && partnerResult ? (
        <div className="mx-auto mt-6 max-w-lg text-left">
          <PartnerNextSteps
            context={partnerResult.context}
            offers={partnerResult.offers}
            sourcePage="download"
            attributionId={partnerResult.attributionId}
          />
        </div>
      ) : null}
    </main>
  );
}
