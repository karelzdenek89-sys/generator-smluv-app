'use client';

import { useState, type FormEvent } from 'react';

export default function LegislationWatchForm({ changeKey }: { changeKey: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value.includes('@')) {
      setError('Zadejte platný e-mail.');
      setState('error');
      return;
    }
    setState('sending');
    setError('');
    try {
      const response = await fetch('/api/legal-watch/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', body: JSON.stringify({ changeKey, email: value, company: '' }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setState('error');
        setError(body.error ?? 'Upozornění nyní nelze aktivovat.');
        return;
      }
      setState('sent');
    } catch {
      setState('error');
      setError('Upozornění nyní nelze aktivovat.');
    }
  };

  if (state === 'sent') {
    return <div className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.05] p-3 text-xs leading-6 text-emerald-100" role="status">Potvrzovací odkaz jsme poslali na zadaný e-mail. Sledování se aktivuje až po potvrzení.</div>;
  }

  if (!open) {
    return <button type="button" onClick={() => setOpen(true)} className="mt-4 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-[#c9a852]/40 hover:text-white">Upozornit mě při změně stavu</button>;
  }

  return (
    <form onSubmit={submit} className="mt-4 rounded-xl border border-white/8 bg-white/[0.02] p-4">
      <div className="text-xs font-semibold text-white">Funkční upozornění na tuto změnu</div>
      <p className="mt-1 text-xs leading-5 text-slate-400">E-mail pošleme pouze při změně legislativního statusu nebo data účinnosti. Nejde o newsletter.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`watch-${changeKey}`} className="sr-only">E-mail pro upozornění</label>
        <input id={`watch-${changeKey}`} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="vas@email.cz" className="site-input min-w-0 flex-1" />
        <button type="submit" disabled={state === 'sending'} className="site-button-secondary whitespace-nowrap">{state === 'sending' ? 'Odesílám…' : 'Poslat potvrzení'}</button>
      </div>
      {state === 'error' ? <p role="alert" className="mt-2 text-xs text-red-300">{error}</p> : null}
      <button type="button" onClick={() => { setOpen(false); setState('idle'); setError(''); }} className="mt-2 text-xs text-slate-400 underline decoration-slate-700 underline-offset-4 hover:text-white">Zavřít</button>
    </form>
  );
}
