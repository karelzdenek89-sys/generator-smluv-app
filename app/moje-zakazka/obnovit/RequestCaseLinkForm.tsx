'use client';

import { useState, type FormEvent } from 'react';

type State = 'idle' | 'sending' | 'sent' | 'error';

export default function RequestCaseLinkForm() {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setState('sending');
    setError('');
    try {
      const response = await fetch('/api/cases/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(body.error ?? 'Odkaz se nepodařilo odeslat. Zkuste to prosím znovu.');
        setState('error');
        return;
      }
      setState('sent');
    } catch {
      setError('Spojení se nezdařilo. Zkuste to prosím znovu.');
      setState('error');
    }
  };

  if (state === 'sent') {
    return (
      <div role="status" className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm leading-7 text-emerald-100">
        Pokud k tomuto e-mailu vedeme zakázky, během chvíle přijde zpráva s odkazy. Zkontrolujte i složku s nevyžádanou poštou.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
      <div>
        <label htmlFor="case-email" className="block text-xs font-semibold text-slate-300">E-mail z objednávky</label>
        <input
          id="case-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-lg border border-white/15 bg-[#0c1426] px-3 py-3 text-sm text-white placeholder:text-slate-600"
          placeholder="jan@priklad.cz"
        />
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="case-company">Společnost</label>
        <input id="case-company" tabIndex={-1} autoComplete="off" value={company} onChange={(event) => setCompany(event.target.value)} />
      </div>
      {error ? <p role="alert" className="text-sm text-red-300">{error}</p> : null}
      <button type="submit" disabled={state === 'sending' || !email.trim()} className="site-button-primary disabled:opacity-40">
        {state === 'sending' ? 'Odesílám…' : 'Poslat odkaz'}
      </button>
    </form>
  );
}
