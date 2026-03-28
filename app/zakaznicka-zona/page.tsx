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
  basic:        { label: 'Základní',       color: 'text-slate-400' },
  professional: { label: 'Profesionální',  color: 'text-blue-400' },
  complete:     { label: 'Kompletní',      color: 'text-amber-400' },
};

const TTL_LABEL: Record<string, string> = {
  basic:        '7 dní',
  professional: '14 dní',
  complete:     '30 dní',
};

export default function CustomerZone() {
  const [email, setEmail]         = useState('');
  const [state, setState]         = useState<LookupState>('idle');
  const [orders, setOrders]       = useState<Order[]>([]);
  const [errorMsg, setErrorMsg]   = useState('');

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
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch { return iso; }
  };

  const downloadUrl = (sessionId: string) =>
    `/api/contracts/download?session_id=${encodeURIComponent(sessionId)}`;

  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200 py-16 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(245,158,11,0.06),transparent_35%)] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-amber-400 transition">
            ← SmlouvaHned
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-xl">📁</div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Moje dokumenty</h1>
            <p className="text-slate-500 text-xs mt-0.5">Zadejte e-mail z objednávky — zobrazí se na jakémkoliv zařízení</p>
          </div>
        </div>

        {/* E-mail lookup form */}
        <form onSubmit={handleLookup} className="bg-[#0c1426] border border-slate-800 rounded-3xl p-6 mb-6">
          <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
            E-mail z objednávky
          </label>
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vas@email.cz"
              required
              className="flex-1 bg-[#141f35] border border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500/50 transition"
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              className="px-6 py-3 bg-amber-500 text-black font-black text-sm rounded-2xl hover:bg-amber-400 transition disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide flex-shrink-0"
            >
              {state === 'loading' ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin inline-block" />
                  Hledám…
                </span>
              ) : 'Zobrazit'}
            </button>
          </div>
          {errorMsg && (
            <p className="mt-2 text-xs text-rose-400">{errorMsg}</p>
          )}
          <p className="mt-3 text-xs text-slate-600">
            Po zadání e-mailu se zobrazí všechny dokumenty zakoupené na této adrese. Nikam nic neposíláme.
          </p>
        </form>

        {/* Výsledky */}
        {state === 'done' && (
          orders.length === 0 ? (
            <div className="bg-[#0c1426] border border-slate-800 rounded-3xl p-10 text-center mb-6">
              <div className="text-4xl mb-4">📭</div>
              <h2 className="font-black text-white text-lg mb-2">Žádné dokumenty</h2>
              <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                Na e-mailu <span className="text-white font-bold">{email}</span> nenalezeny žádné objednávky. Zkontrolujte překlep nebo použijte e-mail ze Stripe potvrzení.
              </p>
              <Link href="/"
                className="inline-block px-8 py-3 bg-amber-500 text-black font-black uppercase text-sm rounded-2xl hover:bg-amber-400 transition">
                Vytvořit novou smlouvu
              </Link>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 px-1">
                Nalezeno {orders.length} {orders.length === 1 ? 'dokument' : orders.length < 5 ? 'dokumenty' : 'dokumentů'}
              </div>
              {orders.map((order, index) => {
                const tierInfo = TIER_LABEL[order.tier] ?? TIER_LABEL.basic;
                const ttlLabel = TTL_LABEL[order.tier] ?? '7 dní';
                return (
                  <div key={order.sessionId}
                    className="bg-[#0c1426] border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-amber-500/30 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">📄</div>
                      <div>
                        <div className="font-bold text-white text-sm">{order.contractName}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs font-bold ${tierInfo.color}`}>{tierInfo.label}</span>
                          <span className="text-slate-700">·</span>
                          <span className="text-xs text-slate-500">{formatDate(order.paidAt)}</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">Platnost odkazu: {ttlLabel} od zaplacení</div>
                      </div>
                    </div>
                    <a href={downloadUrl(order.sessionId)}
                      className="flex-shrink-0 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs uppercase rounded-xl hover:bg-amber-500 hover:text-black transition">
                      Stáhnout
                    </a>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Info box */}
        <div className="bg-[#0c1426] border border-white/5 rounded-2xl p-5">
          <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2">Důležité</div>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-amber-400/60">•</span>
              <span>Platnost odkazu ke stažení: <strong className="text-slate-300">Základní 7 dní</strong>, <strong className="text-slate-300">Profesionální 14 dní</strong>, <strong className="text-slate-300">Kompletní 30 dní</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400/60">•</span>
              <span>Dokumenty jsou dostupné na libovolném zařízení — stačí zadat e-mail z objednávky.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400/60">•</span>
              <span>Máte-li potíže se stažením, napište na <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">info@smlouvahned.cz</a></span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
