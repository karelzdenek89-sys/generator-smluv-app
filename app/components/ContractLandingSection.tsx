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
  badge: string;
  h1Main: string;
  h1Accent?: string;
  h1Suffix?: string;
  subtitle: string;
  benefits: ContractLandingBenefit[];
  contents: string[];
  whenSuitable: string[];
  whenOther?: ContractLandingAlternative[];
  faq: ContractLandingFaq[];
  ctaLabel?: string;
  formId?: string;
  guideHref?: string;
  guideLabel?: string;
}

function LandingDocumentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3.75h7.2l3.05 3.05V18.5A1.75 1.75 0 0 1 15.5 20.25h-8A1.75 1.75 0 0 1 5.75 18.5v-13A1.75 1.75 0 0 1 7.5 3.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M14.25 3.9v3.4h3.35" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.75 11h6.5M8.75 14.25h6.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
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
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-16 lg:px-8">
        <div className="contract-hero-shell-ref">
          <div className="contract-hero-copy-ref">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/8 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-amber-400">
              {badge}
            </div>

            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white lg:text-5xl">
              {h1Accent ? (
                <>
                  {h1Main} <span className="text-amber-400">{h1Accent}</span>
                  {h1Suffix ? <> {h1Suffix}</> : null}
                </>
              ) : (
                h1Main
              )}
            </h1>

            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-slate-400">{subtitle}</p>

            <div className="mb-10 grid gap-4 sm:grid-cols-2">
              {benefits.map(item => (
                <div
                  key={item.text}
                  className="flex items-start gap-3 rounded-2xl border border-slate-800/60 bg-[#0c1426] px-5 py-4"
                >
                  <span className="mt-0.5 shrink-0 text-xl leading-none">{item.icon}</span>
                  <span className="text-sm leading-snug text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollTo(formId)}
                className="rounded-2xl bg-amber-500 px-8 py-4 text-base font-black text-slate-900 shadow-[0_0_30px_rgba(245,158,11,0.2)] transition hover:bg-amber-400 active:scale-95"
              >
                {ctaLabel} →
              </button>
              <button
                onClick={() => scrollTo('obsah')}
                className="text-sm font-semibold text-slate-400 underline decoration-slate-700 underline-offset-4 transition hover:text-white"
              >
                Co dokument obsahuje ↓
              </button>
            </div>

            {guideHref ? (
              <div className="mt-5 border-t border-slate-800/50 pt-5">
                <Link
                  href={guideHref}
                  className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-amber-400"
                >
                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  {guideLabel}
                </Link>
              </div>
            ) : null}
          </div>

          <div className="contract-hero-art-ref" aria-hidden="true">
            <div className="contract-hero-art-backdrop-ref" />
            <div className="contract-hero-folder-ref" />

            <div className="contract-hero-sheet-ref">
              <div className="contract-hero-sheet-head-ref">
                <span className="contract-hero-sheet-icon-ref">
                  <LandingDocumentIcon />
                </span>
                <div>
                  <div className="contract-hero-sheet-kicker-ref">SmlouvaHned</div>
                  <div className="contract-hero-sheet-title-ref">Připravený dokument</div>
                </div>
              </div>

              <div className="contract-hero-lines-ref">
                <span />
                <span />
                <span />
              </div>

              <div className="contract-hero-panels-ref">
                <div className="contract-hero-panel-ref">
                  <div className="contract-hero-panel-label-ref">Strany</div>
                  <div className="contract-hero-panel-copy-ref">
                    Údaje o účastnících, adrese a identifikaci se propíšou do přehledné finální podoby.
                  </div>
                </div>
                <div className="contract-hero-panel-ref">
                  <div className="contract-hero-panel-label-ref">Podmínky</div>
                  <div className="contract-hero-panel-copy-ref">
                    Cena, termíny a další ujednání jsou rozdělené do logických bloků pro rychlou kontrolu.
                  </div>
                </div>
                <div className="contract-hero-panel-ref">
                  <div className="contract-hero-panel-label-ref">Podpis</div>
                  <div className="contract-hero-panel-copy-ref">
                    Výsledný PDF dokument je připravený k vytištění, podpisu a založení do evidence.
                  </div>
                </div>
              </div>

              <div className="contract-hero-sheet-foot-ref">
                <span />
                <span />
              </div>
            </div>

            <div className="contract-hero-note-ref">
              <div className="contract-hero-note-kicker-ref">Prémiový výstup</div>
              <div className="contract-hero-note-title-ref">Jasná struktura a čisté PDF bez rušivých prvků</div>
            </div>
          </div>
        </div>
      </section>

      <section id="obsah" className="mx-auto max-w-7xl border-t border-slate-800/50 px-4 py-14 lg:px-8">
        <div className="mb-8">
          <div className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-amber-400">Obsah dokumentu</div>
          <h2 className="text-2xl font-black text-white">Co dokument obsahuje</h2>
          <p className="mt-2 text-sm text-slate-500">
            Standardní obsah vygenerovaného dokumentu sestaveného podle vyplněných údajů.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <ul className="space-y-3">
            {contents.map(item => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-[11px] font-black text-amber-400">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="space-y-8">
            <div>
              <div className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Vhodné pro</div>
              <h2 className="mb-6 text-2xl font-black text-white">Kdy je tento dokument vhodný</h2>
              <ul className="space-y-3">
                {whenSuitable.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-700/60 text-[11px] font-black text-slate-400">
                      →
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {whenOther && whenOther.length > 0 ? (
              <div>
                <div className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Jiný dokument?</div>
                <h3 className="mb-4 text-base font-black text-white">Kdy zvolit jiný typ</h3>
                <div className="space-y-3">
                  {whenOther.map(item => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="group flex items-start gap-3 rounded-2xl border border-slate-700/50 bg-[#0c1426]/60 px-5 py-4 transition hover:border-amber-500/30 hover:bg-amber-500/4"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-700 text-[10px] text-slate-400 transition group-hover:border-amber-500/50 group-hover:text-amber-400">
                        ↗
                      </span>
                      <div>
                        <div className="mb-0.5 text-xs font-bold text-amber-400/80">{item.label}</div>
                        <div className="text-xs leading-snug text-slate-400">{item.text}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-t border-slate-800/50 px-4 py-14 lg:px-8">
        <div className="mb-8">
          <div className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-amber-400">Časté otázky</div>
          <h2 className="text-2xl font-black text-white">Nejčastější dotazy</h2>
        </div>
        <div className="max-w-2xl space-y-3">
          {faq.map((item, idx) => (
            <div key={item.q} className="overflow-hidden rounded-2xl border border-slate-800/60 bg-[#0c1426]">
              <button
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                aria-expanded={openFaq === idx}
              >
                <span className="pr-4 text-sm font-semibold leading-snug text-white">{item.q}</span>
                <span
                  className={`shrink-0 text-lg text-amber-400 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
              {openFaq === idx ? (
                <div className="border-t border-slate-800/50 px-6 pb-5 pt-4 text-sm leading-relaxed text-slate-400">
                  {item.a}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
