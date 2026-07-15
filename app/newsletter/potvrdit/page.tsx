'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NewsletterConfirmationPage() {
  const [token, setToken] = useState('');
  const [state, setState] = useState<'ready' | 'confirming' | 'success' | 'error'>('ready');
  const [error, setError] = useState('');

  useEffect(() => {
    const url = new URL(window.location.href);
    const value = new URLSearchParams(url.hash.replace(/^#/, '')).get('token')?.trim() ?? '';
    url.hash = '';
    window.history.replaceState(null, '', `${url.pathname}${url.search}`);
    if (!/^[a-f0-9]{64}$/.test(value)) {
      setError('Potvrzovací odkaz je neplatný nebo neúplný.');
      setState('error');
      return;
    }
    setToken(value);
  }, []);

  async function confirmSubscription() {
    if (!token || state === 'confirming') return;
    setState('confirming');
    setError('');
    try {
      const response = await fetch('/api/newsletter/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(payload?.error || 'Odběr se nepodařilo potvrdit.');
      setToken('');
      setState('success');
    } catch (confirmationError) {
      setError(confirmationError instanceof Error ? confirmationError.message : 'Odběr se nepodařilo potvrdit.');
      setState('error');
    }
  }

  return (
    <main className="min-h-screen bg-[#05080f] px-6 py-20 text-slate-200">
      <div className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-[#0c1426] p-8 text-center">
        <h1 className="text-3xl font-black text-white">Potvrzení odběru</h1>
        {state === 'success' ? (
          <p className="mt-4 text-emerald-300">Odběr praktických tipů SmlouvaHned je potvrzený.</p>
        ) : (
          <p className="mt-4 text-slate-400">Odběr aktivujeme až po vašem výslovném potvrzení tlačítkem.</p>
        )}
        {state === 'error' ? <p role="alert" className="mt-4 text-rose-300">{error}</p> : null}
        {token && state !== 'success' ? (
          <button
            type="button"
            onClick={() => void confirmSubscription()}
            disabled={state === 'confirming'}
            className="mt-6 w-full rounded-xl bg-amber-500 px-5 py-3 font-black text-black hover:bg-amber-400 disabled:cursor-wait disabled:opacity-60"
          >
            {state === 'confirming' ? 'Potvrzuji…' : 'Potvrdit odběr'}
          </button>
        ) : null}
        <Link href="/" className="mt-5 inline-block text-sm text-amber-400 underline">
          Zpět na SmlouvaHned
        </Link>
      </div>
    </main>
  );
}
