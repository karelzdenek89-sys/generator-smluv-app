'use client';

import { useState } from 'react';
import Link from 'next/link';

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
  /** URL průvodce / informační landing stránky pro daný typ smlouvy (volitelné) */
  guideHref?: string;
  /** Text odkazu na průvodce — výchozí: "Průvodce k tomuto dokumentu" */
  guideLabel?: string;
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
  guideHref,
  guideLabel = 'Průvodce k tomuto dokumentu',
}: ContractLandingSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-16 pb-14">
        <div className="max-w-2xl">
          {/* Legal badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/8 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-amber-400 mb-6">
            {badge}
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight mb-5">
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

          <p className="text-lg text-slate-400 leading-relaxed mb-10">{subtitle}</p>

          {/* Benefits — more breathing room */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {benefits.map((b) => (
              <div
                key={b.text}
                className="flex items-start gap-3 rounded-2xl bg-[#0c1426] border border-slate-800/60 px-5 py-4"
              >
                <span className="text-xl leading-none mt-0.5 shrink-0">{b.icon}</span>
                <span className="text-sm text-slate-300 leading-snug">{b.text}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => scrollTo(formId)}
              className="rounded-2xl bg-amber-500 px-8 py-4 font-black text-slate-900 text-base hover:bg-amber-400 active:scale-95 transition shadow-[0_0_30px_rgba(245,158,11,0.2)]"
            >
              {ctaLabel} →
            </button>
            <button
              onClick={() => scrollTo('obsah')}
              className="text-sm font-semibold text-slate-400 hover:text-white transition underline underline-offset-4 decoration-slate-700"
            >
              Co dokument obsahuje ↓
            </button>
          </div>

          {/* Guide link */}
          {guideHref && (
            <div className="mt-5 pt-5 border-t border-slate-800/50">
              <Link
                href={guideHref}
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-amber-400 transition"
              >
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {guideLabel}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ─── CO DOKUMENT OBSAHUJE ─────────────────────────────── */}
      <section id="obsah" className="max-w-7xl mx-auto px-4 lg:px-8 py-14 border-t border-slate-800/50">
        <div className="mb-8">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400 mb-2">Obsah dokumentu</div>
          <h2 className="text-2xl font-black text-white">Co dokument obsahuje</h2>
          <p className="mt-2 text-sm text-slate-500">Standardní obsah vygenerovaného dokumentu — sestaveno dle vašich podmínek.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Obsah list */}
          <ul className="space-y-3">
            {contents.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 text-[11px] font-black">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* Kdy je vhodná + alternativy */}
          <div className="space-y-8">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Vhodné pro</div>
              <h2 className="text-2xl font-black text-white mb-6">Kdy je tento dokument vhodný</h2>
              <ul className="space-y-3">
                {whenSuitable.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-700/60 text-slate-400 text-[11px] font-black">
                      →
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {whenOther && whenOther.length > 0 && (
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Jiný dokument?</div>
                <h3 className="text-base font-black text-white mb-4">Kdy zvolit jiný typ</h3>
                <div className="space-y-3">
                  {whenOther.map((alt) => (
                    <a
                      key={alt.href}
                      href={alt.href}
                      className="flex items-start gap-3 rounded-2xl border border-slate-700/50 bg-[#0c1426]/60 px-5 py-4 hover:border-amber-500/30 hover:bg-amber-500/4 transition group"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-700 text-slate-400 text-[10px] group-hover:border-amber-500/50 group-hover:text-amber-400 transition">
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
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-14 border-t border-slate-800/50">
        <div className="mb-8">
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400 mb-2">Časté otázky</div>
          <h2 className="text-2xl font-black text-white">Nejčastější dotazy</h2>
        </div>
        <div className="max-w-2xl space-y-3">
          {faq.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-800/60 bg-[#0c1426] overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                aria-expanded={openFaq === idx}
              >
                <span className="text-sm font-semibold text-white pr-4 leading-snug">{item.q}</span>
                <span
                  className={`text-amber-400 text-lg transition-transform duration-200 shrink-0 ${
                    openFaq === idx ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4">
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
