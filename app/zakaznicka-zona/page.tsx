'use client';

import { useState } from 'react';
import Link from 'next/link';

type Order = {
  sessionId: string;
  contractName: string;
  paidAt: string | null;
  tier: string;
};

type LookupState = 'idle' | 'loading' | 'done' | 'error';

const TIER_LABEL: Record<string, { label: string; color: string }> = {
  basic: { label: 'Základní dokument', color: 'text-slate-400' },
  professional: { label: 'Rozšířený dokument', color: 'text-blue-400' },
  complete: { label: 'Kompletní balíček', color: 'text-amber-400' },
};

const TTL_LABEL: Record<string, string> = {
  basic: '7 dní',
  professional: '14 dní',
  complete: '30 dní',
};

export default function CustomerZone() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<LookupState>('idle');
  const [orders, setOrders] = useState<Order[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setErrorMsg('Zadejte platný e-mail.');
      return;
    }

    setState('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(trimmed)}`, { cache: 'no-store' });
      if (res.status === 429) {
        setErrorMsg('Příliš mnoho dotazů. Zkuste to za chvíli.');
        setState('error');
        return;
      }
      if (!res.ok) throw new Error('Server error');
      const data = (await res.json()) as { orders: Order[] };
      setOrders(data.orders ?? []);
      setState('done');
    } catch {
      setErrorMsg('Nepodařilo se načíst objednávky. Zkuste to znovu.');
      setState('error');
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('cs-CZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const downloadUrl = (sessionId: string) => `/api/contracts/download?session_id=${encodeURIComponent(sessionId)}`;

  return (
    <main className="premium-page-bg-ref py-16 px-6 text-slate-200">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(245,158,11,0.06),transparent_35%)]" />

      <div className="premium-page-shell-ref max-w-2xl">
        <div className="mb-6">
          <Link href="/" className="premium-back-link-ref">
            ← SmlouvaHned
          </Link>
        </div>

        <div className="premium-page-hero-ref mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-xl">
            📁
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Moje dokumenty</h1>
            <p className="mt-0.5 text-xs text-slate-500">Zadejte e-mail z objednávky a zobrazte si dokumenty na jakémkoliv zařízení.</p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="premium-page-card-ref mb-6 p-6">
          <label className="mb-3 block text-xs font-black uppercase tracking-widest text-slate-400">E-mail z objednávky</label>
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vas@email.cz"
              required
              className="flex-1 rounded-2xl border border-slate-700 bg-[#141f35] px-4 py-3 text-sm text-white placeholder-slate-600 transition focus:border-amber-500/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              className="flex-shrink-0 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {state === 'loading' ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  Hledám…
                </span>
              ) : (
                'Zobrazit'
              )}
            </button>
          </div>
          {errorMsg && <p className="mt-2 text-xs text-rose-400">{errorMsg}</p>}
          <p className="mt-3 text-xs text-slate-600">
            Po zadání e-mailu se zobrazí všechny dokumenty zakoupené na této adrese. Nikam nic neposíláme.
          </p>
        </form>

        {state === 'done' &&
          (orders.length === 0 ? (
            <div className="premium-page-card-ref mb-6 p-10 text-center">
              <div className="mb-4 text-4xl">📭</div>
              <h2 className="mb-2 text-lg font-black text-white">Žádné dokumenty</h2>
              <p className="mx-auto mb-6 max-w-sm text-sm text-slate-400">
                Na e-mailu <span className="font-bold text-white">{email}</span> nebyly nalezeny žádné objednávky. Zkontrolujte překlep nebo použijte e-mail ze Stripe potvrzení.
              </p>
              <Link
                href="/"
                className="inline-block rounded-2xl bg-amber-500 px-8 py-3 text-sm font-black uppercase text-black transition hover:bg-amber-400"
              >
                Vytvořit novou smlouvu
              </Link>
            </div>
          ) : (
            <div className="mb-6 space-y-3">
              <div className="mb-2 px-1 text-xs font-black uppercase tracking-widest text-slate-500">
                Nalezeno {orders.length} {orders.length === 1 ? 'dokument' : orders.length < 5 ? 'dokumenty' : 'dokumentů'}
              </div>
              {orders.map(order => {
                const tierInfo = TIER_LABEL[order.tier] ?? TIER_LABEL.basic;
                const ttlLabel = TTL_LABEL[order.tier] ?? '7 dní';
                return (
                  <div
                    key={order.sessionId}
                    className="premium-page-card-ref flex items-center justify-between gap-4 rounded-2xl p-5 transition hover:border-amber-500/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-lg">📄</div>
                      <div>
                        <div className="text-sm font-bold text-white">{order.contractName}</div>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className={`text-xs font-bold ${tierInfo.color}`}>{tierInfo.label}</span>
                          <span className="text-slate-700">·</span>
                          <span className="text-xs text-slate-500">{formatDate(order.paidAt)}</span>
                        </div>
                        <div className="mt-0.5 text-xs text-slate-600">Platnost odkazu: {ttlLabel} od zaplacení</div>
                      </div>
                    </div>
                    <a
                      href={downloadUrl(order.sessionId)}
                      className="flex-shrink-0 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase text-amber-400 transition hover:bg-amber-500 hover:text-black"
                    >
                      Stáhnout
                    </a>
                  </div>
                );
              })}
            </div>
          ))}

        <div className="premium-note-card-ref p-5">
          <div className="mb-2 text-xs font-black uppercase tracking-widest text-amber-400">Důležité</div>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-amber-400/60">•</span>
              <span>
                Platnost odkazu ke stažení: <strong className="text-slate-300">Základní 7 dní</strong>,{' '}
                <strong className="text-slate-300">Rozšířená 14 dní</strong>, <strong className="text-slate-300">Kompletní 30 dní</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400/60">•</span>
              <span>Dokumenty jsou dostupné na libovolném zařízení — stačí zadat e-mail z objednávky.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400/60">•</span>
              <span>
                Máte-li potíže se stažením, napište na{' '}
                <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">
                  info@smlouvahned.cz
                </a>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
