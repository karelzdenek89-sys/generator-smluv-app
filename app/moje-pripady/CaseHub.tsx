'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { forgetCaseHubAccess, resolveCaseHubAccessFromLocation } from '@/lib/cases/hub-client-access';
import type { CaseKind } from '@/lib/cases/types';

 type CaseSummary = {
  id: string;
  kind: CaseKind;
  title: string;
  stage: string;
  stageLabel: string;
  deadline: string | null;
  nextStep: string;
  documentsCount: number;
  token: string;
  path: string;
  updatedAt: string;
};

type State = 'idle' | 'loading' | 'ready' | 'requesting' | 'requested' | 'error';

const KIND_LABEL: Record<CaseKind, string> = {
  work_order: 'Zakázka', rental: 'Pronájem', vehicle_transfer: 'Vozidlo',
};

function formatDate(value: string | null): string {
  if (!value) return 'Bez termínu';
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return 'Bez termínu';
  return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export default function CaseHub() {
  const [access, setAccess] = useState('');
  const [state, setState] = useState<State>('idle');
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = resolveCaseHubAccessFromLocation(new URL(window.location.href));
    const timer = window.setTimeout(() => {
      setAccess(token);
      setState(token ? 'loading' : 'idle');
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (state !== 'loading' || !access) return;
    let cancelled = false;
    const run = async () => {
      try {
        const response = await fetch('/api/cases/hub/resolve', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', body: JSON.stringify({ token: access }),
        });
        const body = (await response.json().catch(() => ({}))) as { cases?: CaseSummary[]; hasMore?: boolean; error?: string };
        if (cancelled) return;
        if (!response.ok) {
          forgetCaseHubAccess();
          setAccess('');
          setState('error');
          setMessage(body.error ?? 'Odkaz je neplatný nebo vypršel. Nechte si poslat nový.');
          return;
        }
        setCases(body.cases ?? []);
        setHasMore(Boolean(body.hasMore));
        setState('ready');
      } catch {
        if (!cancelled) {
          setState('error');
          setMessage('Přehled se nepodařilo načíst. Zkuste to prosím znovu.');
        }
      }
    };
    void run();
    return () => { cancelled = true; };
  }, [state, access]);

  const loadMore = async () => {
    if (!access || !hasMore || loadingMore) return;
    setLoadingMore(true);
    setMessage('');
    try {
      const response = await fetch('/api/cases/hub/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ token: access, offset: cases.length }),
      });
      const body = (await response.json().catch(() => ({}))) as { cases?: CaseSummary[]; hasMore?: boolean; error?: string };
      if (!response.ok) {
        setMessage(body.error ?? 'Další případy se nepodařilo načíst.');
        return;
      }
      setCases((current) => {
        const known = new Set(current.map((item) => item.id));
        return [...current, ...(body.cases ?? []).filter((item) => !known.has(item.id))];
      });
      setHasMore(Boolean(body.hasMore));
    } catch {
      setMessage('Další případy se nepodařilo načíst. Zkuste to prosím znovu.');
    } finally {
      setLoadingMore(false);
    }
  };

  const requestLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value.includes('@')) {
      setMessage('Zadejte platný e-mail.');
      return;
    }
    setState('requesting');
    setMessage('');
    try {
      const response = await fetch('/api/cases/hub/request-link', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', body: JSON.stringify({ email: value, company: '' }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setState('error');
        setMessage(body.error ?? 'Odkaz se nepodařilo odeslat.');
        return;
      }
      setState('requested');
    } catch {
      setState('error');
      setMessage('Odkaz se nepodařilo odeslat. Zkuste to prosím znovu.');
    }
  };

  return (
    <main className="site-page min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <nav className="mb-7 text-xs text-slate-400"><Link href="/" className="hover:text-white">SmlouvaHned</Link><span className="mx-2">›</span><span>Moje případy</span></nav>
        <header className="mb-8">
          <p className="site-kicker mb-3">Soukromá zákaznická vrstva</p>
          <h1 className="font-serif text-4xl font-bold italic text-white">Moje případy</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Aktivní situace, důležité termíny a další kroky. Bez povinného účtu — přístup získáte bezpečným odkazem na e-mail, který jste použili u objednávky.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/zakaznicka-zona" className="site-button-secondary">Moje dokumenty</Link>
            {state === 'ready' ? <button type="button" onClick={() => { forgetCaseHubAccess(); setAccess(''); setCases([]); setHasMore(false); setState('idle'); }} className="site-button-secondary">Zavřít přístup v této kartě</button> : null}
          </div>
        </header>

        {state === 'loading' ? <div className="site-content-card rounded-2xl p-8"><div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#c9a852] border-t-transparent" aria-label="Načítání" /></div> : null}

        {state === 'ready' ? (
          <section aria-labelledby="cases-title">
            <div className="mb-4 flex items-end justify-between gap-3"><div><div className="text-[10px] font-black uppercase tracking-widest text-[#c9a852]">Uložené situace</div><h2 id="cases-title" className="mt-1 font-serif text-2xl font-bold italic text-white">Co právě řešíte</h2></div><span className="text-xs text-slate-400">{cases.length} {cases.length === 1 ? 'případ' : cases.length < 5 ? 'případy' : 'případů'}</span></div>
            {cases.length === 0 ? <div className="site-content-card rounded-2xl p-8 text-center"><h3 className="font-semibold text-white">Žádný aktivní případ</h3><p className="mt-2 text-sm text-slate-400">Dokumenty můžete dál používat samostatně. Případ je vždy volitelný.</p></div> : (
              <div className="grid gap-4 md:grid-cols-2">
                {cases.map((item) => (
                  <article key={item.id} className="site-content-card flex h-full flex-col rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-3"><div><div className="text-[10px] font-black uppercase tracking-widest text-[#c9a852]">{KIND_LABEL[item.kind]}</div><h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3></div><span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${item.stage === 'closed' ? 'border-slate-600 text-slate-400' : 'border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-300'}`}>{item.stageLabel}</span></div>
                    <dl className="mt-5 space-y-3 text-sm">
                      <div><dt className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Další krok</dt><dd className="mt-1 text-slate-200">{item.nextStep}</dd></div>
                      <div className="grid grid-cols-2 gap-3"><div><dt className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Termín</dt><dd className="mt-1 text-slate-300">{formatDate(item.deadline)}</dd></div><div><dt className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Dokumenty v případu</dt><dd className="mt-1 text-slate-300">{item.documentsCount}</dd></div></div>
                    </dl>
                    <a href={`${item.path}#access=${encodeURIComponent(item.token)}`} className="site-button-primary mt-6 w-full">Pokračovat</a>
                  </article>
                ))}
              </div>
            )}
            {hasMore ? (
              <div className="mt-5 flex justify-center">
                <button type="button" onClick={() => void loadMore()} disabled={loadingMore} className="site-button-secondary">
                  {loadingMore ? 'Načítám…' : 'Načíst další případy'}
                </button>
              </div>
            ) : null}
            {message && state === 'ready' ? <p role="alert" className="mt-4 text-sm text-red-300">{message}</p> : null}
          </section>
        ) : null}

        {(state === 'idle' || state === 'requesting' || state === 'requested' || state === 'error') ? (
          <section className="site-content-card max-w-xl rounded-2xl p-6" aria-labelledby="access-title">
            <h2 id="access-title" className="font-serif text-xl font-bold italic text-white">Poslat bezpečný přístupový odkaz</h2>
            {state === 'requested' ? (
              <div role="status" className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4 text-sm leading-6 text-emerald-100">Pokud jsou k tomuto e-mailu uložené případy, poslali jsme bezpečný návratový odkaz. Zkontrolujte i složku hromadné pošty.</div>
            ) : (
              <form onSubmit={requestLink} className="mt-4 space-y-3">
                <label htmlFor="hub-email" className="block text-xs font-bold text-slate-300">E-mail z objednávky</label>
                <input id="hub-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="site-input w-full" placeholder="vas@email.cz" />
                <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <button type="submit" disabled={state === 'requesting'} className="site-button-primary w-full">{state === 'requesting' ? 'Odesílám…' : 'Poslat přístupový odkaz'}</button>
              </form>
            )}
            {message ? <p role="alert" className="mt-3 text-sm text-red-300">{message}</p> : null}
            <p className="mt-4 text-xs leading-6 text-slate-400">Odpověď neprozrazuje, zda je e-mail v systému. Přístupový odkaz je funkční zpráva, ne přihlášení k marketingu.</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
