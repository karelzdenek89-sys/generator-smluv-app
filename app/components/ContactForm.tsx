'use client';

import { useState } from 'react';

type State = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactForm() {
  const [state, setState] = useState<State>('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setState(res.ok ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  };

  if (state === 'sent') {
    return (
      <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/8 p-8 text-center">
        <div className="mb-3 text-3xl">✓</div>
        <div className="text-base font-bold text-white">Zpráva odeslána</div>
        <p className="mt-2 text-sm text-slate-400">Odpovíme zpravidla do 2 pracovních dnů na <span className="text-white">{form.email}</span>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-slate-800 bg-[#0c1426] p-7 space-y-4">
      <h2 className="text-sm font-black uppercase tracking-wider text-white mb-5">Napište nám</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-500">Jméno *</label>
          <input
            required
            value={form.name}
            onChange={set('name')}
            placeholder="Jan Novák"
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-amber-500/60 focus:outline-none transition"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-500">E-mail *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="vas@email.cz"
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-amber-500/60 focus:outline-none transition"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-500">Předmět</label>
        <select
          value={form.subject}
          onChange={set('subject')}
          className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white focus:border-amber-500/60 focus:outline-none transition"
        >
          <option value="">Vyberte téma…</option>
          <option>Objednávka a platba</option>
          <option>Reklamace dokumentu</option>
          <option>Technický problém</option>
          <option>Jiný dotaz</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-slate-500">Zpráva *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={set('message')}
          placeholder="Popište svůj dotaz nebo problém…"
          className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-amber-500/60 focus:outline-none transition resize-none"
        />
      </div>

      {state === 'error' && (
        <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
          Odeslání se nezdařilo. Zkuste to prosím znovu nebo napište přímo na info@smlouvahned.cz.
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="w-full rounded-2xl bg-amber-500 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === 'sending' ? 'Odesílám…' : 'Odeslat zprávu →'}
      </button>

      <p className="text-center text-[11px] text-slate-600">
        Odpovídáme zpravidla do 2 pracovních dnů · Po–Pá
      </p>
    </form>
  );
}
