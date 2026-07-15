'use client';

import Link from 'next/link';
import { useState } from 'react';

type State = 'idle' | 'sending' | 'sent' | 'error';

export default function NewsletterSignup() {
  const [state, setState] = useState<State>('idle');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setState('sending');
    setErrorMessage(null);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent: true, company, source: 'footer' }),
      });
      if (res.ok) {
        setState('sent');
        return;
      }
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setErrorMessage(
        typeof data?.error === 'string'
          ? data.error
          : 'Přihlášení se nezdařilo. Zkuste to znovu nebo napište na info@smlouvahned.cz.',
      );
      setState('error');
    } catch {
      setErrorMessage('Přihlášení se nezdařilo. Zkuste to znovu nebo napište na info@smlouvahned.cz.');
      setState('error');
    }
  };

  if (state === 'sent') {
    return (
      <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
        <p className="text-xs font-semibold text-emerald-300">Zkontrolujte prosím svůj e-mail.</p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
          Odběr začne až po kliknutí na potvrzovací odkaz. Pokud už odběr máte aktivní, není potřeba nic dalšího dělat.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
        Tipy k dokumentům
      </div>
      <p className="text-[11px] leading-relaxed text-slate-500">
        Praktické rady k nájemním a kupním smlouvám a novinky o službě — bez spamu.
      </p>
      <label className="sr-only" htmlFor="newsletter-email">
        E-mail
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="vas@email.cz"
        className="w-full rounded-lg border border-white/10 bg-[#07111e] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-[#c9a852]/50 focus:outline-none transition"
      />
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <label className="flex cursor-pointer items-start gap-2.5 text-[11px] leading-relaxed text-slate-500">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border border-white/20 bg-[#07111e] accent-[#c9a852]"
        />
        <span>
          Souhlasím se zasíláním e-mailů s tipy a novinkami. Podrobnosti v{' '}
          <Link href="/gdpr" className="text-slate-400 underline underline-offset-2 hover:text-[#c9a852]">
            zásadách ochrany údajů
          </Link>
          . Souhlas mohu kdykoli odvolat.
        </span>
      </label>
      {state === 'error' && errorMessage && (
        <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-300">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={state === 'sending' || !consent}
        className="w-full rounded-lg border border-[#c9a852]/30 bg-[#c9a852]/10 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#c9a852] transition hover:bg-[#c9a852]/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state === 'sending' ? 'Odesílám…' : 'Přihlásit se k tipům'}
      </button>
    </form>
  );
}
