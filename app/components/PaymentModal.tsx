'use client';

import { useState, useEffect } from 'react';
import { PRICING_TIER_CONFIG } from '@/lib/pricing';
import { getEffectiveIncludedItems, getThematicPackageConfig } from '@/lib/packages';

interface Section {
  title: string;
  body: string[];
}

interface PaymentModalProps {
  sections: Section[];
  title: string;
  tier: 'basic' | 'complete';
  onTierChange: (tier: 'basic' | 'complete') => void;
  packageKey?: string | null;
  contractType: string;
  onPay: () => void;
  isProcessing: boolean;
  onClose: () => void;
}

export default function PaymentModal({
  sections,
  title,
  tier,
  onTierChange,
  packageKey,
  contractType,
  onPay,
  isProcessing,
  onClose,
}: PaymentModalProps) {
  const [gdprConsent, setGdprConsent] = useState(false);
  const packageConfig = getThematicPackageConfig(packageKey);
  const includedItems = getEffectiveIncludedItems(contractType, tier, packageKey);
  const price = packageConfig
    ? packageConfig.priceLabel
    : tier === 'complete'
      ? '199 Kč'
      : '99 Kč';

  // Zavření přes Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Zamezit scrollu pod modalem
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const today = new Date().toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const hasSections = sections.length > 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(5, 8, 15, 0.92)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative flex w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)] max-h-[92vh]">

        {/* Zavřít */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-slate-400 hover:bg-white/14 hover:text-white transition"
          aria-label="Zavřít"
        >
          ✕
        </button>

        {/* Levá strana — rozmazaný náhled */}
        <div className="relative hidden w-[55%] overflow-hidden md:block" style={{ background: '#0a0f1e' }}>
          {/* Náhled smlouvy */}
          <div
            className="h-full overflow-hidden"
            style={{ filter: 'blur(3px)', transform: 'scale(1.02)', opacity: 0.6 }}
          >
            <div className="p-6 h-full overflow-hidden">
              <div className="rounded-2xl overflow-hidden border border-[rgba(166,134,91,0.18)] bg-[#f5efe3]">
                <div className="border-b border-[#dccdae] px-6 py-5">
                  <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#9f7a40]">SmlouvaHned.cz</div>
                  <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#5e4827]">{title}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8f7a59]">{today}</div>
                </div>
                <div className="space-y-5 px-6 py-6">
                  {hasSections ? (
                    sections.slice(0, 8).map((section) => (
                      <div key={section.title}>
                        <div className="border-b border-[#e5d8bf] pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9f7a40]">
                          {section.title}
                        </div>
                        <div className="mt-3 space-y-2">
                          {section.body.slice(0, 6).map((line, i) => {
                            const text = String(line ?? '').trim();
                            if (!text) return null;
                            return <p key={i} className="text-[12px] leading-6 text-[#4a3d2c]">{text}</p>;
                          })}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Placeholder pokud formulář prázdný
                    Array.from({ length: 6 }).map((_, i) => (
                      <div key={i}>
                        <div className="border-b border-[#e5d8bf] pb-2">
                          <div className="h-3 w-32 rounded bg-[#d4c4a0]" />
                        </div>
                        <div className="mt-3 space-y-2">
                          {Array.from({ length: 4 }).map((_, j) => (
                            <div key={j} className="h-3 rounded bg-[#e8dfc8]" style={{ width: `${70 + (j * 7) % 25}%` }} />
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Zamčený overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(180deg, rgba(5,8,15,0.3) 0%, rgba(5,8,15,0.7) 60%, rgba(5,8,15,0.95) 100%)' }}>
            <div className="flex flex-col items-center gap-4 px-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
                <svg className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-black text-white">Váš dokument je připraven</div>
                <div className="mt-1 text-sm text-slate-400">Odemkněte přístup k plnému PDF dokumentu</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pravá strana — platební panel */}
        <div className="flex w-full flex-col overflow-y-auto md:w-[45%]" style={{ background: '#0c1426', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex flex-1 flex-col p-7">

            {/* Hlavička */}
            <div className="mb-6">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400/80">Odemknout dokument</div>
              <h2 className="mt-2 text-2xl font-black leading-tight text-white">{title}</h2>
              <p className="mt-2 text-sm text-slate-400">
                {hasSections
                  ? 'Váš dokument je sestavený a připravený ke stažení. Vyberte variantu a dokončete platbu.'
                  : 'Doplňte zbývající údaje ve formuláři a vyberte variantu dokumentu.'}
              </p>
            </div>

            {/* Výběr varianty — pouze pokud není package */}
            {!packageConfig && (
              <div className="mb-5 space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Varianta dokumentu</div>
                {(['basic', 'complete'] as const).map((t) => {
                  const cfg = PRICING_TIER_CONFIG[t];
                  const isSelected = tier === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onTierChange(t)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? 'border-amber-500/60 bg-amber-500/10'
                          : 'border-slate-700/60 bg-white/2 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-amber-400' : 'border-slate-600'}`}>
                            {isSelected && <div className="h-2 w-2 rounded-full bg-amber-400" />}
                          </div>
                          <span className="font-bold text-white text-sm">{cfg.title}</span>
                          {cfg.badge && (
                            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                              {cfg.badge}
                            </span>
                          )}
                        </div>
                        <span className={`font-black text-base ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
                          {cfg.priceLabel}
                        </span>
                      </div>
                      <p className="mt-1.5 pl-6 text-xs text-slate-400">{cfg.shortDescription}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Package info */}
            {packageConfig && (
              <div className="mb-5 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{packageConfig.title}</span>
                  <span className="font-black text-amber-400 text-xl">{packageConfig.priceLabel}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{packageConfig.checkoutDescription}</p>
              </div>
            )}

            {/* Co je součástí */}
            <div className="mb-5 rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 py-3">
              <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Součástí je</div>
              <ul className="space-y-1.5">
                {includedItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="mt-0.5 text-amber-500 flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto space-y-4">
              {/* Souhlas s OP + vzdání se odstoupení */}
              <label className="flex cursor-pointer items-start gap-3 group">
                <input
                  type="checkbox"
                  checked={gdprConsent}
                  onChange={(e) => setGdprConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 accent-amber-500"
                />
                <span className="text-xs leading-relaxed text-slate-400 group-hover:text-slate-300 transition">
                  Přijímám{' '}
                  <a href="/obchodni-podminky" target="_blank" className="text-amber-400 underline hover:text-amber-300">obchodní podmínky</a>
                  {' '}a beru na vědomí{' '}
                  <a href="/gdpr" target="_blank" className="text-amber-400 underline hover:text-amber-300">zásady ochrany osobních údajů</a>.
                  Výslovně souhlasím s okamžitým zahájením plnění a beru na vědomí, že tím <strong className="text-slate-300">ztrácím právo na odstoupení od smlouvy</strong> dle § 1837 písm. l) OZ.
                </span>
              </label>

              {/* Platební tlačítko */}
              <button
                onClick={() => {
                  if (!gdprConsent) {
                    alert('Potvrďte prosím souhlas se zpracováním osobních údajů.');
                    return;
                  }
                  onPay();
                }}
                disabled={isProcessing}
                className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-base rounded-2xl hover:brightness-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.25)] active:scale-[0.98] uppercase tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                    Přesměrování na platbu…
                  </span>
                ) : (
                  `Odemknout a stáhnout — ${price} →`
                )}
              </button>

              <p className="text-center text-[11px] text-slate-500">
                🔒 Zabezpečená platba přes Stripe · PDF ke stažení ihned
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
