'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type State = 'loading' | 'confirmed' | 'unsubscribed' | 'error';

export default function LegislationWatchManager() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id')?.trim() ?? '';
  const [token, setToken] = useState('');
  const [state, setState] = useState<State>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) {
      const timer = window.setTimeout(() => { setState('error'); setMessage('Chybí identifikátor upozornění.'); }, 0);
      return () => window.clearTimeout(timer);
    }
    const url = new URL(window.location.href);
    const fromHash = new URLSearchParams(url.hash.replace(/^#/, '')).get('access')?.trim() ?? '';
    const key = `sh_legal_watch:${id}`;
    let access = fromHash;
    let stored = false;
    try {
      if (fromHash) {
        sessionStorage.setItem(key, fromHash);
        stored = true;
      } else access = sessionStorage.getItem(key) ?? '';
    } catch { /* storage may be blocked */ }
    if (fromHash && stored) {
      url.hash = '';
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}`);
    }
    const timer = window.setTimeout(() => {
      setToken(access);
      if (!access) {
        setState('error');
        setMessage('Přístupový odkaz je neplatný nebo už není dostupný.');
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (!id || !token || state !== 'loading') return;
    let cancelled = false;
    const run = async () => {
      try {
        const response = await fetch('/api/legal-watch/manage', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', body: JSON.stringify({ id, token, action: 'confirm' }),
        });
        const body = (await response.json().catch(() => ({}))) as { status?: string; error?: string };
        if (cancelled) return;
        if (!response.ok) {
          setState('error');
          setMessage(body.error ?? 'Upozornění se nepodařilo potvrdit.');
          return;
        }
        setState('confirmed');
      } catch {
        if (!cancelled) {
          setState('error');
          setMessage('Upozornění se nepodařilo potvrdit. Zkuste odkaz otevřít znovu.');
        }
      }
    };
    void run();
    return () => { cancelled = true; };
  }, [id, token, state]);

  const unsubscribe = async () => {
    if (!id || !token) return;
    setMessage('');
    try {
      const response = await fetch('/api/legal-watch/manage', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', body: JSON.stringify({ id, token, action: 'unsubscribe' }),
      });
      if (!response.ok) {
        setMessage('Upozornění se nepodařilo zrušit.');
        return;
      }
      try { sessionStorage.removeItem(`sh_legal_watch:${id}`); } catch { /* ignore */ }
      setState('unsubscribed');
    } catch {
      setMessage('Upozornění se nepodařilo zrušit.');
    }
  };

  return (
    <main className="site-page min-h-screen">
      <div className="mx-auto max-w-xl px-6 py-20">
        <Link href="/zmeny-2027" className="text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:text-[#e2c77b]">← Legislativní radar</Link>
        <div className="site-content-card mt-6 rounded-2xl p-7">
          {state === 'loading' ? <><div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#c9a852] border-t-transparent" /><h1 className="mt-5 font-serif text-2xl font-bold italic text-white">Potvrzujeme upozornění</h1><p className="mt-2 text-sm text-slate-400">Ověřujeme bezpečný odkaz.</p></> : null}
          {state === 'confirmed' ? <><div className="text-2xl text-emerald-300">✓</div><h1 className="mt-3 font-serif text-2xl font-bold italic text-white">Sledování je aktivní</h1><p className="mt-3 text-sm leading-7 text-slate-400">E-mail pošleme pouze při významné změně sledovaného statusu nebo data účinnosti. Nejde o newsletter ani marketingový souhlas.</p><button type="button" onClick={unsubscribe} className="site-button-secondary mt-5">Zrušit toto upozornění</button></> : null}
          {state === 'unsubscribed' ? <><h1 className="font-serif text-2xl font-bold italic text-white">Upozornění bylo zrušeno</h1><p className="mt-3 text-sm leading-7 text-slate-400">K této sledované změně už další funkční e-maily nepošleme.</p></> : null}
          {state === 'error' ? <><h1 className="font-serif text-2xl font-bold italic text-white">Odkaz nelze použít</h1><p className="mt-3 text-sm leading-7 text-slate-400">{message || 'Odkaz je neplatný nebo vypršel.'}</p><Link href="/zmeny-2027" className="site-button-secondary mt-5">Zpět na radar</Link></> : null}
          {state !== 'error' && message ? <p role="alert" className="mt-4 text-sm text-red-300">{message}</p> : null}
        </div>
      </div>
    </main>
  );
}
