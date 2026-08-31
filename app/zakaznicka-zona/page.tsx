'use client';

import Link from 'next/link';
import { FileText, FolderOpen, Inbox } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { normalizeLocale, type AppLocale } from '@/lib/locale';

type Order = {
  sessionId: string;
  contractType?: string | null;
  contractName: string;
  packageLabel?: string | null;
  paidAt: string | null;
  tier: string;
  lang?: string;
  downloadToken?: string | null;
  archiveDays?: number;
  addOns?: string[];
  includedItems?: string[];
};

type LookupState = 'idle' | 'loading' | 'done' | 'error';

const LOCALIZED_CONTRACT_TYPES = new Set([
  'lease',
  'sublease',
  'employment',
  'dpp',
  'power_of_attorney',
  'car_sale',
]);

const COPY = {
  cs: {
    back: 'SmlouvaHned', title: 'Moje dokumenty',
    subtitle: 'Použijte bezpečný odkaz z potvrzovacího e-mailu, nebo ověřte jeden dokument e-mailem a ID relace.',
    formTitle: 'Ověření jednoho dokumentu', emailLabel: 'E-mail z platby', emailPlaceholder: 'jmeno@example.cz',
    sessionLabel: 'ID relace z potvrzovacího e-mailu', sessionPlaceholder: 'cs_…', loading: 'Ověřuji…', submit: 'Zobrazit dokument',
    listHint: 'Seznam všech dokumentů je dostupný jen přes bezpečný odkaz „Moje dokumenty“ v e-mailu po platbě.',
    required: 'Zadejte e-mail z platby a ID relace z potvrzovacího e-mailu.',
    tooMany: 'Příliš mnoho dotazů. Zkuste to za chvíli.',
    invalidAccess: 'Odkaz není platný nebo vypršel. Použijte odkaz „Moje dokumenty“ z potvrzovacího e-mailu.',
    loadFailed: 'Objednávky se nepodařilo načíst. Zkuste to znovu.', notFound: 'Dokument nebyl nalezen. Zkontrolujte e-mail a ID relace.',
    noDocuments: 'Žádné dokumenty', noDocumentsPrefix: 'Pro e-mail',
    noDocumentsSuffix: 'nebyla nalezena žádná objednávka. Zkontrolujte překlep nebo použijte e-mail z potvrzení Stripe.',
    create: 'Vytvořit novou smlouvu', found: (count: number) => `Nalezeno dokumentů: ${count}`,
    basic: 'Základní', complete: 'Rozšířený', validity: (days: string) => `Platnost odkazu: ${days} od zaplacení`,
    days: (count: number) => `${count} dní`, language: 'Jazyk PDF', important: 'Důležité',
    expiry: 'Základní dokument lze stáhnout 7 dní, rozšířený dokument nebo tematický balíček 30 dní a s doplňkem archivace 90 dní.',
    accessHelp: 'Všechny dokumenty otevřete bezpečným odkazem z potvrzovacího e-mailu. Jeden dokument lze ověřit e-mailem a ID relace.',
    support: 'Máte potíže se stažením? Napište na',
  },
  en: {
    back: 'SmlouvaHned', title: 'My documents',
    subtitle: 'Use the secure link in your confirmation email, or verify one document with your email and session ID.',
    formTitle: 'Verify one document', emailLabel: 'Email used for payment', emailPlaceholder: 'name@example.com',
    sessionLabel: 'Session ID from the confirmation email', sessionPlaceholder: 'cs_…', loading: 'Verifying…', submit: 'Show document',
    listHint: 'Your complete document list is available only through the secure “My documents” link in the post-payment email.',
    required: 'Enter the email used for payment and the session ID from your confirmation email.',
    tooMany: 'Too many requests. Please try again shortly.',
    invalidAccess: 'This link is invalid or has expired. Use “My documents” in your confirmation email.',
    loadFailed: 'We could not load your orders. Please try again.', notFound: 'Document not found. Check the email and session ID.',
    noDocuments: 'No documents', noDocumentsPrefix: 'No order was found for',
    noDocumentsSuffix: 'Check for a typo or use the email from your Stripe receipt.',
    create: 'Create a new contract', found: (count: number) => `Documents found: ${count}`,
    basic: 'Basic', complete: 'Extended', validity: (days: string) => `Download link valid for ${days} after payment`,
    days: (count: number) => `${count} days`, language: 'PDF language', important: 'Important',
    expiry: 'A basic document is available for 7 days, an extended document or themed package for 30 days, and for 90 days with the archive add-on.',
    accessHelp: 'Open all documents with the secure link from your confirmation email. You can verify one document with your email and session ID.',
    support: 'Having trouble downloading? Email',
  },
  ua: {
    back: 'SmlouvaHned', title: 'Мої документи',
    subtitle: 'Скористайтеся захищеним посиланням із листа-підтвердження або перевірте один документ за e-mail та ID сесії.',
    formTitle: 'Перевірка одного документа', emailLabel: 'E-mail, використаний для оплати', emailPlaceholder: 'name@example.com',
    sessionLabel: 'ID сесії з листа-підтвердження', sessionPlaceholder: 'cs_…', loading: 'Перевіряємо…', submit: 'Показати документ',
    listHint: 'Повний список документів доступний лише через захищене посилання «Мої документи» в листі після оплати.',
    required: 'Введіть e-mail, використаний для оплати, та ID сесії з листа-підтвердження.',
    tooMany: 'Забагато запитів. Спробуйте ще раз за хвилину.',
    invalidAccess: 'Посилання недійсне або термін його дії минув. Скористайтеся посиланням «Мої документи» з листа-підтвердження.',
    loadFailed: 'Не вдалося завантажити замовлення. Спробуйте ще раз.', notFound: 'Документ не знайдено. Перевірте e-mail та ID сесії.',
    noDocuments: 'Документів немає', noDocumentsPrefix: 'Для адреси',
    noDocumentsSuffix: 'замовлень не знайдено. Перевірте адресу або використайте e-mail із квитанції Stripe.',
    create: 'Створити новий договір', found: (count: number) => `Знайдено документів: ${count}`,
    basic: 'Базовий', complete: 'Розширений', validity: (days: string) => `Посилання діє ${days} після оплати`,
    days: (count: number) => `${count} днів`, language: 'Мова PDF', important: 'Важливо',
    expiry: 'Базовий документ доступний 7 днів, розширений документ або тематичний пакет — 30 днів, а з доповненням архівації — 90 днів.',
    accessHelp: 'Усі документи відкриваються захищеним посиланням із листа-підтвердження. Один документ можна перевірити за e-mail та ID сесії.',
    support: 'Проблеми із завантаженням? Напишіть на',
  },
};

function normalizeDownloadLang(value?: string | null) {
  return normalizeLocale(value);
}

function homepageForLocale(locale: AppLocale) {
  return locale === 'cs' ? '/' : `/${locale}`;
}

function subscribeToLocation(callback: () => void) {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}

function getLocaleSnapshot(): AppLocale {
  return normalizeLocale(new URLSearchParams(window.location.search).get('lang'));
}

export default function CustomerZone() {
  const locale = useSyncExternalStore<AppLocale>(subscribeToLocation, getLocaleSnapshot, () => 'cs');
  const [portalAccess, setPortalAccess] = useState('');
  const [email, setEmail] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [state, setState] = useState<LookupState>('idle');
  const [orders, setOrders] = useState<Order[]>([]);
  const [downloadLang, setDownloadLang] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [resolvedEmail, setResolvedEmail] = useState('');
  const autoFetchedAccess = useRef('');
  const copy = COPY[locale];

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const hashAccess = new URLSearchParams(currentUrl.hash.replace(/^#/, '')).get('access')?.trim() ?? '';
    const legacyAccess = currentUrl.searchParams.get('access')?.trim() ?? '';
    const access = hashAccess || legacyAccess;
    let accessTimer: number | null = null;
    if (access) {
      accessTimer = window.setTimeout(() => setPortalAccess(access), 0);
      currentUrl.searchParams.delete('access');
      currentUrl.hash = '';
      window.history.replaceState(null, '', `${currentUrl.pathname}${currentUrl.search}`);
    }
    return () => {
      if (accessTimer !== null) window.clearTimeout(accessTimer);
    };
  }, []);

  const applyOrders = useCallback((nextOrders: Order[], displayEmail = '') => {
    setOrders(nextOrders);
    setDownloadLang(Object.fromEntries(nextOrders.map((order) => [order.sessionId, normalizeDownloadLang(order.lang)])));
    if (displayEmail) setResolvedEmail(displayEmail);
    setState('done');
  }, []);

  const fetchWithAccess = useCallback(async (access: string) => {
    setState('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', body: JSON.stringify({ access }),
      });
      if (res.status === 429) {
        setErrorMsg(copy.tooMany);
        setState('error');
        return;
      }
      const data = (await res.json()) as { orders?: Order[]; email?: string };
      if (!res.ok) {
        setErrorMsg(copy.invalidAccess);
        setState('error');
        return;
      }
      applyOrders(data.orders ?? [], data.email ?? '');
    } catch {
      setErrorMsg(copy.loadFailed);
      setState('error');
    }
  }, [applyOrders, copy]);

  useEffect(() => {
    if (!portalAccess || autoFetchedAccess.current === portalAccess) return;
    autoFetchedAccess.current = portalAccess;
    const timer = window.setTimeout(() => void fetchWithAccess(portalAccess), 0);
    return () => window.clearTimeout(timer);
  }, [portalAccess, fetchWithAccess]);

  const handleSessionLookup = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSession = sessionId.trim();
    if (!trimmedEmail.includes('@') || !trimmedSession) {
      setErrorMsg(copy.required);
      setState('error');
      return;
    }
    setState('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
        body: JSON.stringify({ email: trimmedEmail, sessionId: trimmedSession }),
      });
      if (res.status === 429) {
        setErrorMsg(copy.tooMany);
        setState('error');
        return;
      }
      const data = (await res.json()) as { orders?: Order[] };
      if (!res.ok) {
        setErrorMsg(copy.notFound);
        setState('error');
        return;
      }
      applyOrders(data.orders ?? [], trimmedEmail);
    } catch {
      setErrorMsg(copy.loadFailed);
      setState('error');
    }
  };

  const displayEmail = resolvedEmail || email;
  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return new Intl.DateTimeFormat(locale === 'cs' ? 'cs-CZ' : locale === 'ua' ? 'uk-UA' : 'en-GB', {
      dateStyle: 'medium', timeStyle: 'short',
    }).format(date);
  };

  const downloadUrl = (id: string, format: 'pdf' | 'docx' = 'pdf') => {
    const order = orders.find((item) => item.sessionId === id);
    const lang = downloadLang[id] ?? 'cs';
    const langQuery = lang === 'cs' ? '' : `&lang=${encodeURIComponent(lang)}`;
    const tokenFragment = order?.downloadToken ? `#token=${encodeURIComponent(order.downloadToken)}` : '';
    const formatQuery = format === 'docx' ? '&format=docx' : '';
    return `/stahnout?session_id=${encodeURIComponent(id)}${langQuery}${formatQuery}${tokenFragment}`;
  };

  return (
    <main className="relative min-h-screen bg-[#05080f] px-4 py-12 text-slate-200 sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(245,158,11,0.06),transparent_35%)]" />
      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="mb-6">
          <Link href={homepageForLocale(locale)} className="text-sm font-bold text-slate-400 transition hover:text-amber-400">← {copy.back}</Link>
        </div>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <FolderOpen aria-hidden="true" size={22} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">{copy.title}</h1>
            <p className="mt-1 text-sm leading-6 text-slate-400">{copy.subtitle}</p>
          </div>
        </div>

        <form onSubmit={handleSessionLookup} className="mb-6 rounded-3xl border border-slate-800 bg-[#0c1426] p-5 sm:p-6">
          <label className="mb-3 block text-sm font-black uppercase tracking-wider text-slate-300">{copy.formTitle}</label>
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-300">
              <span className="mb-1.5 block">{copy.emailLabel}</span>
              <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)}
                placeholder={copy.emailPlaceholder}
                className="w-full rounded-2xl border border-slate-700 bg-[#141f35] px-4 py-3 text-base font-normal text-white placeholder-slate-500 transition focus:border-amber-500/50 focus:outline-none" />
            </label>
            <label className="block text-sm font-semibold text-slate-300">
              <span className="mb-1.5 block">{copy.sessionLabel}</span>
              <input type="text" autoComplete="off" value={sessionId} onChange={(event) => setSessionId(event.target.value)}
                placeholder={copy.sessionPlaceholder}
                className="w-full rounded-2xl border border-slate-700 bg-[#141f35] px-4 py-3 text-base font-normal text-white placeholder-slate-500 transition focus:border-amber-500/50 focus:outline-none" />
            </label>
            <button type="submit" disabled={state === 'loading'}
              className="w-full rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50">
              {state === 'loading' ? copy.loading : copy.submit}
            </button>
          </div>
          {errorMsg ? <p role="alert" className="mt-3 text-sm leading-6 text-rose-300">{errorMsg}</p> : null}
          <p className="mt-3 text-sm leading-6 text-slate-500">{copy.listHint}</p>
        </form>

        <div aria-live="polite">
          {state === 'done' && orders.length === 0 ? (
            <div className="mb-6 rounded-3xl border border-slate-800 bg-[#0c1426] p-8 text-center sm:p-10">
              <Inbox aria-hidden="true" className="mx-auto mb-4 text-slate-500" size={36} />
              <h2 className="mb-2 text-lg font-black text-white">{copy.noDocuments}</h2>
              <p className="mx-auto mb-6 max-w-md text-sm leading-6 text-slate-400">
                {copy.noDocumentsPrefix} <span className="font-bold text-white">{displayEmail}</span>. {copy.noDocumentsSuffix}
              </p>
              <Link href={homepageForLocale(locale)} className="inline-block rounded-2xl bg-amber-500 px-8 py-3 text-sm font-black uppercase text-black transition hover:bg-amber-400">{copy.create}</Link>
            </div>
          ) : null}

          {state === 'done' && orders.length > 0 ? (
            <div className="mb-6 space-y-3">
              <div className="mb-2 px-1 text-sm font-black uppercase tracking-wider text-slate-400">{copy.found(orders.length)}</div>
              {orders.map((order) => {
                const isComplete = order.tier === 'professional' || order.tier === 'complete';
                const days = order.archiveDays ?? (isComplete ? 30 : 7);
                const hasDocx = order.addOns?.includes('docx') ?? false;
                const supportsLanguages = Boolean(order.contractType && LOCALIZED_CONTRACT_TYPES.has(order.contractType));
                return (
                  <article key={order.sessionId} className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-[#0c1426] p-5 transition hover:border-amber-500/30 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400"><FileText aria-hidden="true" size={19} /></div>
                      <div className="min-w-0">
                        <div className="break-words text-sm font-bold text-white">{order.packageLabel || order.contractName}</div>
                        {order.packageLabel ? <div className="mt-1 text-xs text-slate-400">{order.contractName}</div> : null}
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className={`text-xs font-bold ${isComplete ? 'text-amber-400' : 'text-slate-300'}`}>{isComplete ? copy.complete : copy.basic}</span>
                          <span aria-hidden="true" className="text-slate-700">·</span>
                          <span className="text-xs text-slate-400">{formatDate(order.paidAt)}</span>
                        </div>
                        <div className="mt-1 text-xs leading-5 text-slate-500">{copy.validity(copy.days(days))}</div>
                        {order.includedItems?.length ? (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {order.includedItems.map((item) => <span key={item} className="rounded-full border border-amber-500/15 px-2 py-1 text-xs text-amber-200/90">{item}</span>)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                      {supportsLanguages ? (
                        <select aria-label={copy.language} value={downloadLang[order.sessionId] ?? normalizeDownloadLang(order.lang)}
                          onChange={(event) => setDownloadLang((previous) => ({ ...previous, [order.sessionId]: event.target.value }))}
                          className="rounded-xl border border-slate-700 bg-[#141f35] px-3 py-2 text-sm text-slate-200">
                          <option value="cs">CS</option><option value="en">EN</option><option value="ua">UA</option>
                        </select>
                      ) : null}
                      <a href={downloadUrl(order.sessionId)} className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase text-amber-400 transition hover:bg-amber-500 hover:text-black">PDF</a>
                      {hasDocx ? <a href={downloadUrl(order.sessionId, 'docx')} className="rounded-xl border border-slate-700 bg-white/5 px-4 py-2 text-xs font-bold uppercase text-slate-200 transition hover:border-amber-500/30 hover:text-amber-300">DOCX</a> : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0c1426] p-5">
          <div className="mb-3 text-sm font-black uppercase tracking-wider text-amber-400">{copy.important}</div>
          <ul className="space-y-3 text-sm leading-6 text-slate-400">
            <li>{copy.expiry}</li><li>{copy.accessHelp}</li>
            <li>{copy.support} <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">info@smlouvahned.cz</a>.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
