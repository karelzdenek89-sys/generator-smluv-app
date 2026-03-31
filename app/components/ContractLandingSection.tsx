'use client';

import { useState } from 'react';

export interface ContractLandingBenefit {
  icon: string;
  text: string;
}

export interface ContractLandingFaq {
  q: string;
  a: string;
}

export interface ContractLandingAlternative {
  label: string;
  href: string;
  text: string;
}

export interface ContractLandingSectionProps {
  /** Právní základ — krátký text do badge, např. "§ 2079 občanského zákoníku" */
  badge: string;
  /** Část H1 před akcentem */
  h1Main: string;
  /** Akcentovaná (amber) část H1 — pokud není, celý H1 je bílý */
  h1Accent?: string;
  /** Část H1 za akcentem (volitelná) */
  h1Suffix?: string;
  /** Perex pod H1 */
  subtitle: string;
  /** 3–5 benefit karet */
  benefits: ContractLandingBenefit[];
  /** Výčet položek sekce "Co dokument obsahuje" */
  contents: string[];
  /** Vhodné použití — 2–4 situace */
  whenSuitable: string[];
  /** Odlišení od jiných dokumentů (volitelné) */
  whenOther?: ContractLandingAlternative[];
  /** FAQ — 3–5 otázek */
  faq: ContractLandingFaq[];
  /** Text hlavního CTA tlačítka */
  ctaLabel?: string;
  /** ID formuláře pro smooth scroll */
  formId?: string;
}

export default function ContractLandingSection({
  badge,
  h1Main,
  h1Accent,
  h1Suffix,
  subtitle,
  benefits,
  contents,
  whenSuitable,
  whenOther,
  faq,
  ctaLabel = 'Pokračovat k vytvoření dokumentu',
  formId = 'formular',
}: ContractLandingSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-14 pb-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-400 mb-5">
            {badge}
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4">
            {h1Accent ? (
              <>
                {h1Main}{' '}
                <span className="text-amber-400">{h1Accent}</span>
                {h1Suffix ? <> {h1Suffix}</> : null}
              </>
            ) : (
              h1Main
            )}
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed mb-8">{subtitle}</p>

          {/* Benefits */}
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {benefits.map((b) => (
              <div
                key={b.text}
                className="flex items-start gap-3 rounded-2xl bg-[#0c1426] border border-slate-800/80 px-4 py-3"
              >
                <span className="text-xl leading-none mt-0.5">{b.icon}</span>
                <span className="text-sm text-slate-300 leading-snug">{b.text}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => scrollTo(formId)}
              className="rounded-2xl bg-amber-500 px-7 py-3.5 font-bold text-slate-900 text-base hover:bg-amber-400 active:scale-95 transition"
            >
              {ctaLabel} →
            </button>
            <button
              onClick={() => scrollTo('obsah')}
              className="rounded-2xl border border-slate-700 bg-transparent px-7 py-3.5 font-semibold text-slate-300 text-base hover:border-slate-500 hover:text-white transition"
            >
              Co dokument obsahuje
            </button>
          </div>
        </div>
      </section>

      {/* ─── CO DOKUMENT OBSAHUJE ─────────────────────────────── */}
      <section id="obsah" className="max-w-7xl mx-auto px-4 lg:px-8 py-10 border-t border-slate-800/60">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Obsah */}
          <div>
            <h2 className="text-xl font-black text-white mb-1">Co dokument obsahuje</h2>
            <p className="text-sm text-slate-500 mb-5">Standardní obsah vygenerovaného dokumentu.</p>
            <ul className="space-y-2.5">
              {contents.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-black">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Kdy je vhodná + alternativy */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white mb-1">Kdy je tento dokument vhodný</h2>
              <p className="text-sm text-slate-500 mb-5">Typické situace, pro které je dokument určen.</p>
              <ul className="space-y-2.5">
                {whenSuitable.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-700/80 text-slate-400 text-[11px] font-black">
                      →
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {whenOther && whenOther.length > 0 && (
              <div>
                <h3 className="text-base font-black text-white mb-3">Kdy zvolit jiný dokument</h3>
                <div className="space-y-2.5">
                  {whenOther.map((alt) => (
                    <a
                      key={alt.href}
                      href={alt.href}
                      className="flex items-start gap-3 rounded-xl border border-slate-700/60 bg-[#0c1426]/60 px-4 py-3 hover:border-amber-500/40 hover:bg-amber-500/5 transition group"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-600 text-slate-400 text-[10px] group-hover:border-amber-500/60 group-hover:text-amber-400 transition">
                        ↗
                      </span>
                      <div>
                        <div className="text-xs font-bold text-amber-400/80 mb-0.5">{alt.label}</div>
                        <div className="text-xs text-slate-400 leading-snug">{alt.text}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10 border-t border-slate-800/60">
        <h2 className="text-2xl font-black text-white mb-2">Časté dotazy</h2>
        <p className="text-sm text-slate-500 mb-8">Odpovědi na nejčastější otázky k tomuto dokumentu.</p>
        <div className="max-w-2xl space-y-3">
          {faq.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-800/80 bg-[#0c1426] overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                aria-expanded={openFaq === idx}
              >
                <span className="text-sm font-semibold text-white pr-4">{item.q}</span>
                <span
                  className={`text-amber-400 text-lg transition-transform duration-200 shrink-0 ${
                    openFaq === idx ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
