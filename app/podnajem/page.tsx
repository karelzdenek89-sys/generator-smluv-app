'use client';

import { useMemo, useState } from 'react';

type FormData = {
  landlordName: string; landlordId: string; landlordAddress: string; landlordEmail: string;
  tenantName: string; tenantId: string; tenantAddress: string; tenantEmail: string;
  flatAddress: string; flatLayout: string; flatUnitNumber: string; cadastralArea: string; floor: string; subleaseArea: string;
  landlordConsent: 'yes' | 'no'; consentDate: string; mainLeaseDate: string;
  startDate: string; duration: 'fixed' | 'indefinite'; endDate: string; noticePeriod: string;
  rentAmount: string; utilityAmount: string; depositAmount: string; paymentDay: string; bankAccount: string;
  maxOccupants: string; allowPets: boolean; allowSmoking: boolean; allowAirbnb: boolean;
  handoverDate: string; keysCount: string; equipmentList: string; knownDefects: string;
  contractDate: string; notaryUpsell: boolean;
  tier: 'basic' | 'professional' | 'complete';
};

const inputClass = 'w-full bg-[#111c31] border border-slate-700/80 text-white rounded-xl px-4 py-3 outline-none placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 transition';
const cardClass = 'bg-[#0c1426] border border-slate-800/90 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>{children}</div>);
}
function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (<div className="mb-6"><div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90">{index}. {title}</div>{subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}</div>);
}
function Toggle({ name, checked, label, hint, onChange }: { name: string; checked: boolean; label: string; hint?: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    
              {/* === VÝBĚR BALÍČKU === */}
              <div className="space-y-3 mt-6">
                <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Vyberte balíček</div>
                {([
                  { value: 'basic', label: 'Základní dokument', price: '249 Kč', desc: 'Profesionální smlouva dle občanského zákoníku v PDF.' },
                  { value: 'professional', label: 'Profesionální ochrana', price: '449 Kč', desc: 'Rozšířené klauzule, smluvní pokuty a zajišťovací ustanovení.', recommended: true },
                  { value: 'complete', label: 'Kompletní balíček', price: '749 Kč', desc: 'Vše z Profesionální ochrany + průvodní instrukce, checklist a 30denní archivace.' },
                ] as const).map((opt) => (
                  <label
                    key={opt.value}
                    className={`block rounded-2xl border-2 p-4 cursor-pointer transition relative ${
                      form.tier === opt.value
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-slate-700/60 bg-[#0c1426]/60 hover:border-slate-600'
                    }`}
                  >
                    {opt.recommended && form.tier !== 'professional' && (
                      <div className="absolute -top-2.5 left-4">
                        <span className="rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-black">
                          Doporučeno
                        </span>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="tier"
                        value={opt.value}
                        checked={form.tier === opt.value}
                        onChange={(e) => setForm((prev) => ({ ...prev, tier: e.target.value as 'basic' | 'professional' | 'complete', notaryUpsell: e.target.value !== 'basic' }))}
                        className="mt-1 h-5 w-5 accent-amber-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black uppercase tracking-wide text-amber-400">{opt.label}</span>
                          <span className="text-sm font-black text-white">{opt.price}</span>
                        </div>
                        <div className="mt-1 text-xs leading-relaxed text-slate-400">{opt.desc}</div>
                        {opt.value === 'professional' && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {['Smluvní pokuty', 'Sankce za prodlení', 'Odpovědnostní doložky'].map(t => (
                              <span key={t} className="text-[10px] font-bold text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded-full">{t}</span>
                            ))}
                          </div>
                        )}
                        {opt.value === 'complete' && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {['Instrukce k podpisu', 'Checklist', '30denní archivace'].map(t => (
                              <span key={t} className="text-[10px] font-bold text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded-full">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Analýza smlouvy</div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-black ${scoreColor}`}>{risk.score}</div>
                <div><div className={`font-bold ${scoreColor}`}>{risk.label}</div><div className="text-xs text-slate-500">ze 100 bodů</div></div>
              </div>
              {risk.warnings.length === 0 ? <p className="text-sm text-emerald-400">✓ Podnájemní smlouva je v pořádku.</p>
                : <ul className="space-y-2">{risk.warnings.map((w, i) => (<li key={i} className={`text-xs rounded-lg px-3 py-2 ${w.level === 'high' ? 'bg-rose-500/10 text-rose-300' : 'bg-amber-500/10 text-amber-300'}`}>{w.level === 'high' ? '⚠ ' : '▲ '}{w.text}</li>))}</ul>}
            </div>
            <div className={cardClass}>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400/90 mb-4">Shrnutí</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Podnájemní smlouva</span><span className="font-bold">249 Kč</span></div>
                {form.tier !== 'basic' && <div className="flex justify-between"><span className="text-slate-400">{form.tier === 'complete' ? 'Kompletní balíček' : 'Profesionální ochrana'}</span><span className="text-amber-400 font-bold">{form.tier === 'complete' ? '+500 Kč' : '+200 Kč'}</span></div>}
                <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-lg"><span>Celkem</span><span className="text-amber-400">{form.tier === 'complete' ? '749' : form.tier === 'professional' ? '449' : '249'} Kč</span></div>
              </div>
              {(!form.landlordName || !form.tenantName || !form.flatAddress) && !isProcessing && (
                <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-xs text-rose-300 space-y-1">
                  <div className="font-semibold mb-1">Před platbou vyplňte:</div>
                  {!form.landlordName && <div>• Jméno nájemce (podnajímatele)</div>}
                  {!form.tenantName && <div>• Jméno podnájemce</div>}
                  {!form.flatAddress && <div>• Adresa bytu</div>}
                </div>
              )}
              <button onClick={handlePayment} disabled={isProcessing || !form.landlordName || !form.tenantName || !form.flatAddress}
                className="mt-4 w-full rounded-2xl bg-amber-500 px-6 py-4 font-bold text-slate-900 text-lg hover:bg-amber-400 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed">
                {isProcessing ? 'Přesměrování…' : 'Zaplatit a stáhnout PDF →'}
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">Platba kartou přes Stripe · PDF ihned</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
