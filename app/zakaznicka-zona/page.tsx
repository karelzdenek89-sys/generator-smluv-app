'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { normalizeLocale, withLocale, type AppLocale } from '@/lib/locale';

type Order = {
  sessionId: string;
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
type LinkState = 'idle' | 'sending' | 'sent' | 'error';

const PORTAL_STORAGE_KEY = 'sh_orders_portal_access';
const PORTAL_CACHE_TTL_MS = 12 * 60 * 60 * 1000;

const COPY: Record<AppLocale, {
  title: string;
  intro: string;
  recoveryTitle: string;
  recoveryBody: string;
  email: string;
  sendLink: string;
  sendingLink: string;
  linkSent: string;
  singleFallback: string;
  verifyOne: string;
  session: string;
  show: string;
  loading: string;
  fallbackNote: string;
  invalidInput: string;
  invalidEmail: string;
  tooMany: string;
  invalidLink: string;
  notFound: string;
  loadFailed: string;
  requestFailed: string;
  emptyTitle: string;
  emptyBody: string;
  newDocument: string;
  found: (count: number) => string;
  linkValidity: string;
  important: string;
  retention: string;
  safeAccess: string;
  support: string;
  myCases: string;
  home: string;
  tierBasic: string;
  tierComplete: string;
}> = {
  cs: {
    title: 'Moje dokumenty',
    intro: 'Zakoupené dokumenty, které jsou ještě dostupné v online archivu. Přístup funguje bezpečným odkazem bez účtu a hesla.',
    recoveryTitle: 'Poslat nový přístupový odkaz',
    recoveryBody: 'Zadejte e-mail použitý při objednávce. Pokud jsou k němu dokumenty stále v online archivu, pošleme nový bezpečný odkaz.',
    email: 'E-mail z objednávky',
    sendLink: 'Poslat bezpečný odkaz',
    sendingLink: 'Odesílám…',
    linkSent: 'Pokud jsou k tomuto e-mailu dokumenty stále dostupné, poslali jsme nový bezpečný odkaz. Zkontrolujte i složku hromadné pošty.',
    singleFallback: 'Technická záloha: otevřít jeden dokument podle ID relace',
    verifyOne: 'Ověření jednoho dokumentu',
    session: 'ID relace (cs_…)',
    show: 'Zobrazit dokument',
    loading: 'Ověřuji…',
    fallbackNote: 'ID relace je součástí odkazu ke stažení po nákupu. Pro běžnou obnovu přístupu doporučujeme bezpečný e-mailový odkaz výše.',
    invalidInput: 'Zadejte platný e-mail a ID relace začínající cs_.',
    invalidEmail: 'Zadejte platný e-mail.',
    tooMany: 'Příliš mnoho požadavků. Zkuste to za chvíli.',
    invalidLink: 'Bezpečný odkaz je neplatný nebo vypršel. Nechte si poslat nový.',
    notFound: 'Dokument nebyl nalezen nebo už není v online archivu.',
    loadFailed: 'Dokumenty se nepodařilo načíst. Zkuste to znovu.',
    requestFailed: 'Nový odkaz se nepodařilo vyžádat. Zkuste to prosím později.',
    emptyTitle: 'Žádné dostupné dokumenty',
    emptyBody: 'V online archivu nejsou pro tento přístup žádné aktuálně dostupné dokumenty.',
    newDocument: 'Vytvořit nový dokument',
    found: (count) => `Nalezeno: ${count}`,
    linkValidity: 'Dostupnost odkazu',
    important: 'Důležité',
    retention: 'Dostupnost online archivu závisí na zakoupené variantě. Dokument si po stažení uložte také do vlastního úložiště.',
    safeAccess: 'Bezpečný odkaz funguje jako přístupový klíč. Nepřeposílejte jej jiné osobě.',
    support: 'Máte-li potíže se stažením, napište na info@smlouvahned.cz.',
    myCases: 'Moje případy',
    home: 'Zpět na SmlouvaHned',
    tierBasic: 'Základní',
    tierComplete: 'Rozšířený',
  },
  en: {
    title: 'My documents',
    intro: 'Purchased documents that are still available in the online archive. Access uses a secure e-mail link without an account or password.',
    recoveryTitle: 'Send a new access link',
    recoveryBody: 'Enter the e-mail address used for the order. If documents are still available online, we will send a new secure access link.',
    email: 'Order e-mail',
    sendLink: 'Send secure access link',
    sendingLink: 'Sending…',
    linkSent: 'If documents are still available for this e-mail address, we sent a new secure access link. Please also check your spam folder.',
    singleFallback: 'Technical fallback: open one document using its Session ID',
    verifyOne: 'Open one document',
    session: 'Checkout Session ID (cs_…)',
    show: 'Show document',
    loading: 'Checking…',
    fallbackNote: 'The Session ID is part of the download link created after purchase. For normal access recovery, use the secure e-mail link above.',
    invalidInput: 'Enter a valid e-mail address and a Session ID beginning with cs_.',
    invalidEmail: 'Enter a valid e-mail address.',
    tooMany: 'Too many requests. Please try again shortly.',
    invalidLink: 'The secure link is invalid or has expired. Request a new one.',
    notFound: 'The document was not found or is no longer available in the online archive.',
    loadFailed: 'We could not load your documents. Please try again.',
    requestFailed: 'We could not request a new link. Please try again later.',
    emptyTitle: 'No documents currently available',
    emptyBody: 'There are no documents currently available in the online archive for this access link.',
    newDocument: 'Create another document',
    found: (count) => `Found: ${count}`,
    linkValidity: 'Link availability',
    important: 'Important',
    retention: 'Online availability depends on the purchased version. After downloading, keep your own copy of the document as well.',
    safeAccess: 'The secure link works as an access key. Do not forward it to another person.',
    support: 'If you have trouble downloading a document, contact info@smlouvahned.cz.',
    myCases: 'My cases',
    home: 'Back to SmlouvaHned',
    tierBasic: 'Basic',
    tierComplete: 'Extended',
  },
  ua: {
    title: 'Мої документи',
    intro: 'Придбані документи, які ще доступні в онлайн-архіві. Доступ здійснюється через безпечне посилання з e-mail без облікового запису та пароля.',
    recoveryTitle: 'Надіслати нове посилання доступу',
    recoveryBody: 'Введіть e-mail, використаний під час замовлення. Якщо документи ще доступні онлайн, ми надішлемо нове безпечне посилання.',
    email: 'E-mail замовлення',
    sendLink: 'Надіслати безпечне посилання',
    sendingLink: 'Надсилаємо…',
    linkSent: 'Якщо для цього e-mail документи ще доступні, ми надіслали нове безпечне посилання. Перевірте також папку зі спамом.',
    singleFallback: 'Технічний резерв: відкрити один документ за ID сесії',
    verifyOne: 'Відкрити один документ',
    session: 'ID платіжної сесії (cs_…)',
    show: 'Показати документ',
    loading: 'Перевіряємо…',
    fallbackNote: 'ID сесії є частиною посилання для завантаження після покупки. Для звичайного відновлення доступу використовуйте безпечне посилання через e-mail вище.',
    invalidInput: 'Введіть дійсний e-mail та ID сесії, що починається з cs_.',
    invalidEmail: 'Введіть дійсний e-mail.',
    tooMany: 'Забагато запитів. Спробуйте ще раз трохи пізніше.',
    invalidLink: 'Безпечне посилання недійсне або строк його дії завершився. Запросіть нове.',
    notFound: 'Документ не знайдено або він уже недоступний в онлайн-архіві.',
    loadFailed: 'Не вдалося завантажити документи. Спробуйте ще раз.',
    requestFailed: 'Не вдалося запросити нове посилання. Спробуйте пізніше.',
    emptyTitle: 'Немає доступних документів',
    emptyBody: 'Для цього посилання зараз немає документів, доступних в онлайн-архіві.',
    newDocument: 'Створити інший документ',
    found: (count) => `Знайдено: ${count}`,
    linkValidity: 'Доступність посилання',
    important: 'Важливо',
    retention: 'Строк онлайн-доступу залежить від придбаного варіанта. Після завантаження збережіть власну копію документа.',
    safeAccess: 'Безпечне посилання працює як ключ доступу. Не пересилайте його іншій особі.',
    support: 'Якщо виникли проблеми із завантаженням, напишіть на info@smlouvahned.cz.',
    myCases: 'Мої справи',
    home: 'Назад до SmlouvaHned',
    tierBasic: 'Базовий',
    tierComplete: 'Розширений',
  },
};

function normalizeDownloadLang(value?: string | null): AppLocale {
  return normalizeLocale(value);
}

function urlLocale(): AppLocale {
  if (typeof window === 'undefined') return 'cs';
  return normalizeLocale(new URLSearchParams(window.location.search).get('lang'));
}

function formatDate(iso: string | null, locale: AppLocale) {
  if (!iso) return '—';
  const lang = locale === 'ua' ? 'uk-UA' : locale === 'en' ? 'en-GB' : 'cs-CZ';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString(lang, { dateStyle: 'medium', timeStyle: 'short' });
}

export default function CustomerZone() {
  const [locale, setLocale] = useState<AppLocale>('cs');
  const copy = COPY[locale];
  const [portalAccess, setPortalAccess] = useState('');
  const [email, setEmail] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [state, setState] = useState<LookupState>('idle');
  const [linkState, setLinkState] = useState<LinkState>('idle');
  const [orders, setOrders] = useState<Order[]>([]);
  const [downloadLang, setDownloadLang] = useState<Record<string, AppLocale>>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [linkError, setLinkError] = useState('');
  const autoFetchedAccess = useRef('');

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const nextLocale = urlLocale();
    document.documentElement.lang = nextLocale === 'ua' ? 'uk' : nextLocale;

    const hashAccess = new URLSearchParams(currentUrl.hash.replace(/^#/, '')).get('access')?.trim() ?? '';
    const legacyAccess = currentUrl.searchParams.get('access')?.trim() ?? '';
    const supplied = hashAccess || legacyAccess;
    let access = supplied;
    let stored = false;
    try {
      if (supplied) {
        sessionStorage.setItem(PORTAL_STORAGE_KEY, JSON.stringify({ token: supplied, expiresAt: Date.now() + PORTAL_CACHE_TTL_MS }));
        stored = true;
      } else {
        const cached = JSON.parse(sessionStorage.getItem(PORTAL_STORAGE_KEY) || 'null') as { token?: string; expiresAt?: number } | null;
        if (cached && typeof cached.token === 'string' && typeof cached.expiresAt === 'number' && cached.expiresAt > Date.now()) access = cached.token;
        else sessionStorage.removeItem(PORTAL_STORAGE_KEY);
      }
    } catch {
      // Když je úložiště blokované, capability zůstane ve fragmentu URL.
    }
    if (legacyAccess) currentUrl.searchParams.delete('access');
    if (supplied) {
      currentUrl.hash = stored ? '' : `access=${encodeURIComponent(supplied)}`;
      window.history.replaceState(window.history.state, '', `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
    }
    const timer = window.setTimeout(() => {
      setLocale(nextLocale);
      setPortalAccess(access);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const applyOrders = useCallback((nextOrders: Order[]) => {
    setOrders(nextOrders);
    setDownloadLang(Object.fromEntries(nextOrders.map((order) => [order.sessionId, normalizeDownloadLang(order.lang)])));
    const currentUrl = new URL(window.location.href);
    if (!currentUrl.searchParams.has('lang') && nextOrders[0]?.lang) {
      const detected = normalizeLocale(nextOrders[0].lang);
      if (detected !== 'cs') {
        currentUrl.searchParams.set('lang', detected);
        window.history.replaceState(window.history.state, '', `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
        setLocale(detected);
        document.documentElement.lang = detected === 'ua' ? 'uk' : detected;
      }
    }
    setState('done');
  }, []);

  const fetchWithAccess = useCallback(async (access: string) => {
    setState('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', body: JSON.stringify({ access }),
      });
      const data = (await res.json().catch(() => ({}))) as { orders?: Order[] };
      if (res.status === 429) {
        setErrorMsg(COPY[urlLocale()].tooMany);
        setState('error');
        return;
      }
      if (!res.ok) {
        setErrorMsg(COPY[urlLocale()].invalidLink);
        setState('error');
        return;
      }
      applyOrders(data.orders ?? []);
    } catch {
      setErrorMsg(COPY[urlLocale()].loadFailed);
      setState('error');
    }
  }, [applyOrders]);

  useEffect(() => {
    if (!portalAccess || autoFetchedAccess.current === portalAccess) return;
    autoFetchedAccess.current = portalAccess;
    const timer = window.setTimeout(() => {
      void fetchWithAccess(portalAccess);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [portalAccess, fetchWithAccess]);

  const requestLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value.includes('@')) {
      setLinkError(copy.invalidEmail);
      setLinkState('error');
      return;
    }
    setLinkState('sending');
    setLinkError('');
    try {
      const res = await fetch('/api/orders/request-link', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
        body: JSON.stringify({ email: value, lang: locale, company: '' }),
      });
      if (res.status === 429) {
        setLinkError(copy.tooMany);
        setLinkState('error');
        return;
      }
      if (!res.ok) {
        setLinkError(copy.requestFailed);
        setLinkState('error');
        return;
      }
      setLinkState('sent');
    } catch {
      setLinkError(copy.requestFailed);
      setLinkState('error');
    }
  };

  const handleSessionLookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSession = sessionId.trim();
    if (!trimmedEmail.includes('@') || !/^cs_[A-Za-z0-9_]{10,200}$/.test(trimmedSession)) {
      setErrorMsg(copy.invalidInput);
      return;
    }
    setState('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
        body: JSON.stringify({ email: trimmedEmail, sessionId: trimmedSession }),
      });
      const data = (await res.json().catch(() => ({}))) as { orders?: Order[] };
      if (res.status === 429) {
        setErrorMsg(copy.tooMany);
        setState('error');
        return;
      }
      if (!res.ok || !data.orders?.length) {
        setErrorMsg(copy.notFound);
        setState('error');
        return;
      }
      applyOrders(data.orders);
    } catch {
      setErrorMsg(copy.loadFailed);
      setState('error');
    }
  };

  const downloadUrl = (order: Order, format: 'pdf' | 'docx' = 'pdf') => {
    const lang = downloadLang[order.sessionId] ?? normalizeDownloadLang(order.lang);
    const langQuery = lang === 'cs' ? '' : `&lang=${encodeURIComponent(lang)}`;
    const formatQuery = format === 'docx' ? '&format=docx' : '';
    const tokenFragment = order.downloadToken ? `#token=${encodeURIComponent(order.downloadToken)}` : '';
    return `/stahnout?session_id=${encodeURIComponent(order.sessionId)}${langQuery}${formatQuery}${tokenFragment}`;
  };

  return (
    <main lang={locale === 'ua' ? 'uk' : locale} className="min-h-screen bg-[#05080f] px-6 py-16 text-slate-200">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(201,168,82,0.06),transparent_35%)]" />
      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href={withLocale('/', locale)} className="text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:text-[#e2c77b]">← {copy.home}</Link>
          {locale === 'cs' ? (
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/moje" className="text-xs font-semibold text-[#e2c77b] transition hover:text-white">Můj účet →</Link>
              <Link href="/moje-pripady" className="text-xs font-semibold text-[#e2c77b] transition hover:text-white">{copy.myCases} →</Link>
            </div>
          ) : null}
        </div>

        <header className="mb-8">
          <p className="site-kicker mb-3">SmlouvaHned</p>
          <h1 className="font-serif text-4xl font-bold italic text-white">{copy.title}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">{copy.intro}</p>
        </header>

        <section className="mb-6 rounded-3xl border border-white/8 bg-[#0c1426] p-6" aria-labelledby="portal-recovery-title">
          <h2 id="portal-recovery-title" className="font-serif text-xl font-bold italic text-white">{copy.recoveryTitle}</h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">{copy.recoveryBody}</p>
          {linkState === 'sent' ? (
            <div role="status" className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4 text-sm leading-6 text-emerald-100">{copy.linkSent}</div>
          ) : (
            <form onSubmit={requestLink} className="mt-4 space-y-3">
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder={copy.email} className="site-input w-full" />
              <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <button type="submit" disabled={linkState === 'sending'} className="site-button-primary w-full disabled:opacity-60">{linkState === 'sending' ? copy.sendingLink : copy.sendLink}</button>
              {linkState === 'error' ? <p role="alert" className="text-xs text-red-300">{linkError}</p> : null}
            </form>
          )}
        </section>

        <details className="mb-6 rounded-2xl border border-white/8 bg-[#0c1426] p-5">
          <summary className="cursor-pointer text-sm font-semibold text-slate-300">{copy.singleFallback}</summary>
          <form onSubmit={handleSessionLookup} className="mt-4 space-y-3">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400">{copy.verifyOne}</label>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder={copy.email} className="site-input w-full" />
            <input type="text" value={sessionId} onChange={(event) => setSessionId(event.target.value)} autoComplete="off" placeholder={copy.session} className="site-input w-full" />
            <button type="submit" disabled={state === 'loading'} className="site-button-secondary w-full disabled:opacity-60">{state === 'loading' ? copy.loading : copy.show}</button>
            {errorMsg ? <p role="alert" className="text-xs text-red-300">{errorMsg}</p> : null}
            <p className="text-xs leading-6 text-slate-400">{copy.fallbackNote}</p>
          </form>
        </details>

        {state === 'done' ? (
          orders.length === 0 ? (
            <div className="mb-6 rounded-3xl border border-white/8 bg-[#0c1426] p-10 text-center">
              <h2 className="font-serif text-xl font-bold italic text-white">{copy.emptyTitle}</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-400">{copy.emptyBody}</p>
              <Link href={withLocale('/', locale)} className="site-button-primary mt-6">{copy.newDocument}</Link>
            </div>
          ) : (
            <section className="mb-6 space-y-3" aria-label={copy.title}>
              <div className="px-1 text-xs font-black uppercase tracking-widest text-slate-400">{copy.found(orders.length)}</div>
              {orders.map((order) => {
                const hasDocx = order.addOns?.includes('docx') ?? false;
                const ttl = order.archiveDays ? `${order.archiveDays} ${locale === 'en' ? 'days' : locale === 'ua' ? 'днів' : 'dní'}` : '—';
                return (
                  <article key={order.sessionId} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="font-semibold text-white">{order.packageLabel ?? order.contractName}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span>{order.tier === 'basic' ? copy.tierBasic : copy.tierComplete}</span><span>·</span><span>{formatDate(order.paidAt, locale)}</span>
                        </div>
                        <div className="mt-1 text-xs text-slate-400">{copy.linkValidity}: {ttl}</div>
                        <div className="mt-1 font-mono text-[10px] text-slate-400">{order.sessionId}</div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <select aria-label="PDF language" value={downloadLang[order.sessionId] ?? normalizeDownloadLang(order.lang)} onChange={(event) => setDownloadLang((prev) => ({ ...prev, [order.sessionId]: normalizeDownloadLang(event.target.value) }))} className="rounded-xl border border-slate-700 bg-[#141f35] px-2 py-2 text-xs text-slate-300">
                          <option value="cs">CS</option><option value="en">EN</option><option value="ua">UA</option>
                        </select>
                        <a href={downloadUrl(order)} className="rounded-xl border border-[#c9a852]/25 bg-[#c9a852]/10 px-4 py-2 text-xs font-bold uppercase text-[#e2c77b] transition hover:bg-[#c9a852] hover:text-black">PDF</a>
                        {hasDocx ? <a href={downloadUrl(order, 'docx')} className="rounded-xl border border-slate-700 bg-white/5 px-4 py-2 text-xs font-bold uppercase text-slate-300 transition hover:border-[#c9a852]/30 hover:text-[#e2c77b]">DOCX</a> : null}
                      </div>
                    </div>
                    {order.includedItems?.length ? <div className="mt-3 flex flex-wrap gap-1">{order.includedItems.map((item) => <span key={item} className="rounded-full border border-[#c9a852]/15 px-2 py-0.5 text-[10px] text-[#e2c77b]">{item}</span>)}</div> : null}
                  </article>
                );
              })}
            </section>
          )
        ) : null}

        <aside className="rounded-2xl border border-white/5 bg-[#0c1426] p-5">
          <div className="mb-2 text-xs font-black uppercase tracking-widest text-[#e2c77b]">{copy.important}</div>
          <ul className="space-y-2 text-xs leading-6 text-slate-400"><li>• {copy.retention}</li><li>• {copy.safeAccess}</li><li>• {copy.support}</li></ul>
        </aside>
      </div>
    </main>
  );
}
