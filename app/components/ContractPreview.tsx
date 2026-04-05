'use client';

/**
 * ContractPreview — vizuálně věrný náhled první strany dokumentu před platbou.
 * Zobrazuje první 2 sekce s watermarkem VZOR a CTA k odemčení.
 *
 * Usage:
 *   <ContractPreview sections={buildContractSections(formData)} title="Kupní smlouva" />
 */

import { useState } from 'react';

interface Section {
  title: string;
  body: string[];
}

interface ContractPreviewProps {
  sections: Section[];
  title: string;
  /** Number of preview sections to show (default: 2) */
  previewCount?: number;
}

export default function ContractPreview({ sections, title, previewCount = 2 }: ContractPreviewProps) {
  const [expanded, setExpanded] = useState(false);

  if (!sections || sections.length === 0) return null;

  const visibleSections = sections.slice(0, expanded ? Math.min(4, sections.length) : previewCount);
  const totalSections   = sections.length;

  // Today's date for the document header — renders as a realistic placeholder
  const today = new Date().toLocaleDateString('cs-CZ', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

  return (
    <div className="relative mb-6">

      {/* ── Document card ──────────────────────────────────────────────── */}
      <div
        className="relative bg-white rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.22)] overflow-hidden select-none"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >

        {/* Top colour stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-[#1A3A5C] via-[#C8A84B] to-[#1A3A5C]" />

        {/* Document header */}
        <div className="bg-[#1A3A5C] px-7 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div
                className="text-white font-black text-base uppercase tracking-widest leading-tight"
                style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '0.12em' }}
              >
                {title}
              </div>
              <div className="text-[#C8A84B] text-[10px] font-bold uppercase tracking-[0.22em] mt-0.5">
                SmlouvaHned.cz · Smluvní vzory 2026
              </div>
            </div>
            {/* Logo mark */}
            <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-[#C8A84B] text-xs font-black text-[#1A3A5C]"
                 style={{ fontFamily: 'Arial, sans-serif' }}>
              SH
            </div>
          </div>
        </div>

        {/* Document meta row */}
        <div
          className="flex items-center justify-between px-7 py-2 border-b border-slate-100"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              Datum:&nbsp;<span className="text-slate-600 font-medium">{today}</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              Strana:&nbsp;<span className="text-slate-600 font-medium">1 / —</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Vzor</span>
          </div>
        </div>

        {/* Section content */}
        <div className="px-7 pt-5 pb-2 space-y-5">
          {visibleSections.map((section, i) => (
            <div key={i}>
              {/* Section heading */}
              <div
                className="text-[#1A3A5C] font-black text-[10px] uppercase tracking-[0.18em] pb-1.5 mb-2"
                style={{ borderBottom: '1.5px solid #C8A84B', fontFamily: 'Arial, sans-serif' }}
              >
                {section.title}
              </div>
              {/* Section body */}
              <div className="space-y-1">
                {(section.body || []).slice(0, 7).map((line, j) => {
                  const t = String(line ?? '').trim();
                  if (!t) return null;
                  const isBullet = t.startsWith('•') || t.startsWith('-') || t.startsWith('–');
                  const isHeading = t.endsWith(':') && t.length < 50;
                  return (
                    <p
                      key={j}
                      className={`text-[11px] leading-relaxed ${
                        isHeading
                          ? 'font-bold text-slate-700 mt-2'
                          : isBullet
                          ? 'pl-4 text-slate-600'
                          : 'text-slate-700'
                      }`}
                    >
                      {t}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* VZOR watermark */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div
            className="text-[#1A3A5C] font-black text-8xl uppercase select-none"
            style={{
              opacity: 0.035,
              transform: 'rotate(-30deg)',
              letterSpacing: '0.3em',
              fontFamily: 'Arial Black, Arial, sans-serif',
            }}
          >
            VZOR
          </div>
        </div>

        {/* Fade-out overlay */}
        <div className="pointer-events-none absolute bottom-8 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />

        {/* Expand toggle */}
        {totalSections > previewCount && (
          <div className="relative z-10 text-center pb-2 pt-1">
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-[11px] text-[#1A3A5C] font-bold opacity-50 hover:opacity-90 transition underline-offset-2 hover:underline"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              {expanded
                ? '▲ Zobrazit méně'
                : `▼ Náhled — ${totalSections - previewCount} dalších sekcí uzamčeno`}
            </button>
          </div>
        )}

        {/* Document footer */}
        <div
          className="border-t border-slate-100 px-7 py-2 flex items-center justify-between"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          <div className="text-[9px] text-slate-400 uppercase tracking-wider">
            SmlouvaHned.cz · Automatizovaný generátor smluv
          </div>
          <div className="text-[9px] text-slate-400">Strana 1</div>
        </div>
      </div>

      {/* ── CTA strip ──────────────────────────────────────────────────── */}
      <div className="mt-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-400/8 border border-amber-500/20 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <div className="text-sm font-black text-white mb-0.5">
            Náhled prvních {previewCount} z {totalSections} sekcí
          </div>
          <div className="text-xs text-slate-400">
            Po zaplacení obdržíte kompletní PDF připravené k tisku a podpisu.
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2">
          <span className="text-amber-400 text-base">🔒</span>
          <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Odemknout dokument</span>
        </div>
      </div>
    </div>
  );
}
