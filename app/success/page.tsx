'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { normalizeLocale, withLocale, type AppLocale } from '@/lib/locale';
import PartnerNextSteps from '@/app/components/partners/PartnerNextSteps';
import type { PartnerContext, PublicPartnerOffer } from '@/lib/partners/types';

type DownloadState = 'checking' | 'ready' | 'error';

type SuccessCopy = {
  purchaseFallback: string;
  missingTitle: string;
  missingBody: string;
  chooseDocument: string;
  checkingTitle: string;
  paidTitle: string;
  checkingBody: string;
  readyBody: string;
  generated: string;
  purchasedVariant: string;
  paidAmount: string;
  linkAvailability: string;
  preparing: string;
  downloadPdf: string;
  downloadDocx: string;
  pendingTitle: string;
  pendingBody: string;
  retry: string;
  support: string;
  included: string;
  downloadLink: string;
  archiveFallback: string;
  redownload: string;
  untilExpiry: string;
  myDocuments: string;
  home: string;
  days: (value: number) => string;
  daysFromPayment: (value: number) => string;
};

const SUCCESS_COPY: Record<AppLocale, SuccessCopy> = {
  cs: {
    purchaseFallback: 'Váš smluvní dokument',
    missingTitle: 'Stránka není dostupná',
    missingBody: 'Tato stránka je přístupná pouze po přesměrování z platební brány.',
    chooseDocument: 'Vybrat dokument',
    checkingTitle: 'Zpracováváme platbu',
    paidTitle: 'Platba přijata',
    checkingBody: 'Ověřujeme platbu, obvykle to trvá několik sekund.',
    readyBody: 'Dokument je připraven ke stažení.',
    generated: 'Generováno po ověřené platbě • Stripe',
    purchasedVariant: 'Zakoupená varianta',
    paidAmount: 'Zaplacená částka',
    linkAvailability: 'Dostupnost odkazu',
    preparing: 'Příprava dokumentu probíhá…',
    downloadPdf: 'Stáhnout PDF',
    downloadDocx: 'Stáhnout DOCX',
    pendingTitle: 'Platba se ještě zpracovává',
    pendingBody: 'Odkaz ke stažení obdržíte e-mailem, nebo zkuste stránku obnovit za chvíli.',
    retry: 'Zkusit znovu',
    support: 'Kontaktovat podporu',
    included: 'Součást zakoupené varianty',
    downloadLink: '✓ Odkaz ke stažení',
    archiveFallback: 'dle zvolené varianty',
    redownload: '✓ Opakované stažení',
    untilExpiry: 'do vypršení odkazu',
    myDocuments: 'Moje dokumenty',
    home: 'Zpět na hlavní stránku',
    days: (value) => `${value} dní`,
    daysFromPayment: (value) => `${value} dní od zaplacení`,
  },
  en: {
    purchaseFallback: 'Your contract document',
    missingTitle: 'Page unavailable',
    missingBody: 'This page is available only after redirecting from the payment gateway.',
    chooseDocument: 'Choose a document',
    checkingTitle: 'Processing payment',
    paidTitle: 'Payment received',
    checkingBody: 'We are verifying the payment. This usually takes a few seconds.',
    readyBody: 'Your document is ready to download.',
    generated: 'Generated after verified payment • Stripe',
    purchasedVariant: 'Purchased version',
    paidAmount: 'Amount paid',
    linkAvailability: 'Link availability',
    preparing: 'Preparing the document…',
    downloadPdf: 'Download PDF',
    downloadDocx: 'Download DOCX',
    pendingTitle: 'Payment is still processing',
    pendingBody: 'You will receive the download link by email, or refresh this page in a moment.',
    retry: 'Try again',
    support: 'Contact support',
    included: 'Included in your purchase',
    downloadLink: '✓ Download link',
    archiveFallback: 'according to the selected version',
    redownload: '✓ Repeat download',
    untilExpiry: 'until the link expires',
    myDocuments: 'My documents',
    home: 'Back to home page',
    days: (value) => `${value} days`,
    daysFromPayment: (value) => `${value} days after payment`,
  },
  ua: {
    purchaseFallback: 'Ваш договірний документ',
    missingTitle: 'Сторінка недоступна',
    missingBody: 'Ця сторінка доступна лише після перенаправлення з платіжного шлюзу.',
    chooseDocument: 'Вибрати документ',
    checkingTitle: 'Обробляємо платіж',
    paidTitle: 'Платіж отримано',
    checkingBody: 'Перевіряємо платіж. Зазвичай це займає кілька секунд.',
    readyBody: 'Документ готовий до завантаження.',
    generated: 'Створено після підтвердженої оплати • Stripe',
    purchasedVariant: 'Придбана версія',
    paidAmount: 'Сплачена сума',
    linkAvailability: 'Доступність посилання',
    preparing: 'Готуємо документ…',
    downloadPdf: 'Завантажити PDF',
    downloadDocx: 'Завантажити DOCX',
    pendingTitle: 'Платіж ще обробляється',
    pendingBody: 'Посилання для завантаження надійде електронною поштою. Також можна оновити сторінку за мить.',
    retry: 'Спробувати ще раз',
    support: 'Звернутися до підтримки',
    included: 'Входить до придбаної версії',
    downloadLink: '✓ Посилання для завантаження',
    archiveFallback: 'відповідно до вибраної версії',
    redownload: '✓ Повторне завантаження',
    untilExpiry: 'до завершення дії посилання',
    myDocuments: 'Мої документи',
    home: 'На головну сторінку',
    days: (value) => `${value} днів`,
    daysFromPayment: (value) => `${value} днів після оплати`,
  },
};

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
  addOns?: string[];
  includedItems?: string[];
  partnerContext?: PartnerContext | null;
  partnerOffers?: PublicPartnerOffer[];
  partnerAttributionId?: string | null;
  lang?: AppLocale;
};

const pageShell = 'min-h-screen bg-[#05080f] px-6 py-16 text-slate-200';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const queryToken = searchParams.get('token')?.trim() ?? '';
  const [token, setToken] = useState(queryToken);
  const queryLang = normalizeLocale(searchParams.get('lang'));
  const [dlState, setDlState] = useState<DownloadState>('checking');
  const [progress, setProgress] = useState(0);
  const [retryKey, setRetryKey] = useState(0);
  const [orderMeta, setOrderMeta] = useState<SuccessStatusResponse | null>(null);
  const lang = normalizeLocale(orderMeta?.lang ?? queryLang);
  const copy = SUCCESS_COPY[lang];
  const attemptRef = useRef(0);
  const encodedSessionId = sessionId ? encodeURIComponent(sessionId) : null;

  useEffect(() => {
    const hashToken = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('token')?.trim() ?? '';
    const resolvedToken = queryToken || hashToken;
    const tokenTimer = resolvedToken
      ? window.setTimeout(() => setToken(resolvedToken), 0)
      : null;

    if (queryToken || hashToken) {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('token');
      cleanUrl.hash = '';
      window.history.replaceState(null, '', `${cleanUrl.pathname}${cleanUrl.search}`);
    }
    return () => {
      if (tokenTimer !== null) window.clearTimeout(tokenTimer);
    };
  }, [queryToken]);

  const downloadUrl = useMemo(() => {
    if (!encodedSessionId || !token) return null;
    const langQuery = lang === 'cs' ? '' : `&lang=${encodeURIComponent(lang)}`;
    return `/stahnout?session_id=${encodedSessionId}${langQuery}#token=${encodeURIComponent(token)}`;
  }, [encodedSessionId, lang, token]);

  const docxDownloadUrl = useMemo(() => {
    if (!encodedSessionId || !token) return null;
    const langQuery = lang === 'cs' ? '' : `&lang=${encodeURIComponent(lang)}`;
    return `/stahnout?session_id=${encodedSessionId}${langQuery}&format=docx#token=${encodeURIComponent(token)}`;
  }, [encodedSessionId, lang, token]);

  const purchaseTitle =
    orderMeta?.packageLabel ?? orderMeta?.contractName ?? copy.purchaseFallback;

  useEffect(() => {
    if (!encodedSessionId || !sessionId) return;

    try {
      const existing = JSON.parse(localStorage.getItem('sh_orders') || '[]') as Array<{
        sessionId: string;
        date: string;
      }>;
      const alreadySaved = existing.some((order) => order.sessionId === sessionId);
      if (!alreadySaved) {
        const updated = [{ sessionId, date: new Date().toISOString(), lang }, ...existing].slice(0, 10);
        localStorage.setItem('sh_orders', JSON.stringify(updated));
      }
    } catch {
      // localStorage nemusí být dostupné
    }
  }, [encodedSessionId, sessionId, lang]);

  useEffect(() => {
    if (!encodedSessionId || !token) return;

    const maxAttempts = 12;
    let cancelled = false;

    async function checkStatus() {
      if (cancelled) return;

      setProgress(Math.min(90, Math.round((attemptRef.current / maxAttempts) * 90)));

      try {
        const res = await fetch('/api/contracts/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, token }),
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
  }, [encodedSessionId, retryKey, sessionId, token]);

  if (!sessionId) {
    return (
      <main className={pageShell}>
        <div className="mx-auto max-w-xl pt-20 text-center">
          <h1 className="mb-4 text-3xl font-black uppercase tracking-tight text-white">
            {copy.missingTitle}
          </h1>
          <p className="mb-8 text-sm text-slate-400">
            {copy.missingBody}
          </p>
          <Link
            href={withLocale('/', lang)}
            className="inline-block rounded-2xl bg-amber-500 px-8 py-4 text-sm font-black uppercase text-black transition hover:bg-amber-400"
          >
            {copy.chooseDocument}
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
            {dlState === 'checking' ? copy.checkingTitle : copy.paidTitle}
          </h1>
          {dlState === 'checking' && (
            <div className="mb-4 px-4">
              <div className="mb-2 text-sm text-slate-400">
                {copy.checkingBody}
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
            <p className="text-sm text-slate-400">{copy.readyBody}</p>
          )}
        </div>

        <div className="mb-6 rounded-3xl border border-emerald-500/20 bg-[#0c1426] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-white/5 bg-white/3 p-5">
            <div className="flex-shrink-0 text-4xl">📄</div>
            <div>
              <div className="text-base font-bold text-white">{purchaseTitle}</div>
              <div className="mt-0.5 text-xs uppercase tracking-wider text-slate-500">
                {copy.generated}
              </div>
            </div>
          </div>

          {orderMeta?.tierLabel && orderMeta?.priceLabel && (
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
                <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {copy.purchasedVariant}
                </div>
                <div className="text-sm font-semibold text-white">
                  {orderMeta.packageLabel ?? orderMeta.tierLabel}
                </div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
                <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {copy.paidAmount}
                </div>
                <div className="text-sm font-semibold text-white">
                  {orderMeta.priceLabel}
                </div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/3 p-4">
                <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {copy.linkAvailability}
                </div>
                <div className="text-sm font-semibold text-white">
                  {copy.days(orderMeta.archiveDays ?? 0)}
                </div>
              </div>
            </div>
          )}

          {dlState === 'checking' && (
            <div className="flex flex-col items-center justify-center gap-3 py-5">
              <p className="text-sm italic text-slate-500">
                {copy.preparing}
              </p>
            </div>
          )}

          {dlState === 'ready' && (
            <div className="space-y-3">
              <a
                href={downloadUrl ?? '#'}
                className="block w-full rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 py-5 text-center text-xl font-black tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.25)] transition-all hover:brightness-110 active:scale-[0.98]"
              >
                {copy.downloadPdf}
              </a>
              {orderMeta?.addOns?.includes('docx') && docxDownloadUrl ? (
                <a
                  href={docxDownloadUrl}
                  className="block w-full rounded-2xl border border-amber-500/25 bg-amber-500/10 py-4 text-center text-sm font-black uppercase tracking-wide text-amber-300 transition hover:border-amber-500/45 hover:bg-amber-500/15"
                >
                  {copy.downloadDocx}
                </a>
              ) : null}
            </div>
          )}

          {dlState === 'error' && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-center">
              <p className="mb-1 text-sm font-bold text-red-300">
                {copy.pendingTitle}
              </p>
              <p className="mb-3 text-xs text-slate-400">
                {copy.pendingBody}
              </p>
              <div className="flex flex-col justify-center gap-2 sm:flex-row">
                <button
                  onClick={() => {
                    attemptRef.current = 0;
                    setProgress(0);
                    setDlState('checking');
                    setRetryKey((current) => current + 1);
                  }}
                  className="rounded-xl bg-amber-500 px-5 py-2 text-sm font-bold text-black transition hover:bg-amber-400"
                >
                  {copy.retry}
                </button>
                <a
                  href="mailto:info@smlouvahned.cz"
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/10"
                >
                  {copy.support}
                </a>
              </div>
            </div>
          )}

          {/* Navazující nabídka až po ověřené platbě, nikdy v checkoutu. */}
          {dlState === 'ready' && orderMeta?.partnerContext && orderMeta.partnerOffers ? (
            <PartnerNextSteps
              context={orderMeta.partnerContext}
              offers={orderMeta.partnerOffers}
              sourcePage="success"
              attributionId={orderMeta.partnerAttributionId}
            />
          ) : null}

          {orderMeta?.includedItems && orderMeta.includedItems.length > 0 && (
            <div className="mt-5 rounded-2xl border border-white/5 bg-white/3 p-4">
              <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-amber-400">
                {copy.included}
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
                {copy.downloadLink}
              </div>
              <div className="text-xs text-slate-500">
                {orderMeta?.archiveDays
                  ? copy.daysFromPayment(orderMeta.archiveDays)
                  : copy.archiveFallback}
              </div>
            </div>
            <div className="rounded-xl bg-white/3 p-3">
              <div className="mb-0.5 text-xs font-bold text-emerald-400">
                {copy.redownload}
              </div>
              <div className="text-xs text-slate-500">{copy.untilExpiry}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href={withLocale('/zakaznicka-zona', lang)}
            className="rounded-2xl border border-white/8 bg-white/3 px-6 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/6"
          >
            {copy.myDocuments}
          </Link>
          <Link
            href={withLocale('/', lang)}
            className="rounded-2xl border border-white/8 bg-white/3 px-6 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/6"
          >
            {copy.home}
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
