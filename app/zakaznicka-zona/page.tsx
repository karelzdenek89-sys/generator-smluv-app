'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Order = { sessionId: string; date: string };

export default function CustomerZone() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sh_orders');
      const parsed = raw ? (JSON.parse(raw) as Order[]) : [];
      setOrders(parsed);
    } catch {
      setOrders([]);
    }
    setLoaded(true);
  }, []);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('cs-CZ', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return iso;
    }
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
            <p className="text-slate-500 text-xs mt-0.5">Historie stažených smluv v tomto prohlížeči</p>
          </div>
        </div>

        {!loaded ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#0c1426] border border-slate-800 rounded-3xl p-10 text-center mb-8">
            <div className="text-4xl mb-4">📭</div>
            <h2 className="font-black text-white text-lg mb-2">Žádné dokumenty</h2>
            <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
              V tomto prohlížeči nemáte uložené žádné objednávky. Historie se ukládá automaticky po každém nákupu.
            </p>
            <Link href="/"
              className="inline-block px-8 py-3 bg-amber-500 text-black font-black uppercase text-sm rounded-2xl hover:bg-amber-400 transition">
              Vytvořit první smlouvu
            </Link>
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {orders.map((order, index) => (
              <div key={order.sessionId}
                className="bg-[#0c1426] border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-amber-500/30 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">📄</div>
                  <div>
                    <div className="font-bold text-white text-sm">Objednávka #{orders.length - index}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{formatDate(order.date)}</div>
                    <div className="text-xs text-slate-600 font-mono mt-0.5 truncate max-w-[200px]">
                      {order.sessionId.slice(0, 20)}...
                    </div>
                  </div>
                </div>
                <a href={downloadUrl(order.sessionId)}
                  className="flex-shrink-0 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-xs uppercase rounded-xl hover:bg-amber-500 hover:text-black transition">
                  Stáhnout
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="bg-[#0c1426] border border-white/5 rounded-2xl p-5">
          <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2">Důležité</div>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li className="flex items-start gap-2"><span className="text-amber-400/60">•</span><span>Dokumenty lze stáhnout <strong className="text-slate-300">7 dní</strong> od zaplacení.</span></li>
            <li className="flex items-start gap-2"><span className="text-amber-400/60">•</span><span>Historie je uložena jen v tomto prohlížeči. V jiném zařízení nebude viditelná.</span></li>
            <li className="flex items-start gap-2"><span className="text-amber-400/60">•</span><span>Máte-li potíže se stažením po expiraci, napište na <a href="mailto:info@smlouvahned.cz" className="text-amber-400 hover:underline">info@smlouvahned.cz</a></span></li>
          </ul>
        </div>
      </div>
    </main>
  );
}
