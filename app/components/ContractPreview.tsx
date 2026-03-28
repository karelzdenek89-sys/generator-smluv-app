'use client';

/**
 * ContractPreview — watermarked preview of the first 2 contract sections.
 * Shown to the user BEFORE payment to demonstrate the document quality.
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
  const totalSections = sections.length;

  return (
    <div className="relative mb-6">
      {/* Card */}
      <div
        className="relative bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] overflow-hidden select-none"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Document header bar */}
        <div className="bg-[#1A3A5C] px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-white font-black text-lg uppercase tracking-wide leading-tight">{title}</div>
            <div className="text-slate-400 text-xs mt-0.5 italic">Ukázkový vzor — SmlouvaHned.cz</div>
          </div>
          <div className="flex-shrink-0 w-8 h-1 bg-[#C8A84B] rounded-full" />
        </div>

        {/* Section content */}
        <div className="px-6 pt-5 pb-2 space-y-5">
          {visibleSections.map((section, i) => (
            <div key={i}>
              {/* Section heading */}
              <div
                className="text-[#1A3A5C] font-black text-xs uppercase tracking-widest pb-1 mb-2"
                style={{ borderBottom: '2px solid #C8A84B' }}
              >
                {section.title}
              </div>
              {/* Section body lines */}
              <div className="space-y-1">
                {(section.body || []).slice(0, 6).map((line, j) => {
                  const t = String(line ?? '').trim();
                  if (!t) return null;
                  const isBullet = t.startsWith('•') || t.startsWith('-') || t.startsWith('–');
                  return (
                    <p
                      key={j}
                      className={`text-[11px] text-slate-700 leading-relaxed ${isBullet ? 'pl-3' : ''}`}
                    >
                      {t}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Watermark */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div
            className="text-[#1A3A5C] font-black text-7xl uppercase opacity-[0.04] rotate-[-30deg] tracking-widest select-none"
            style={{ letterSpacing: '0.3em' }}
          >
            VZOR
          </div>
        </div>

        {/* Fade-out overlay at bottom — teasing more content */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/85 to-transparent" />

        {/* Expand / collapse toggle */}
        {totalSections > previewCount && (
          <div className="relative z-10 text-center pb-3 pt-1">
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-xs text-[#1A3A5C] font-bold underline-offset-2 hover:underline opacity-60 hover:opacity-100 transition"
            >
              {expanded ? '▲ Zobrazit méně' : `▼ Zobrazit dalších ${totalSections - previewCount} sekcí (zamčeno)`}
            </button>
          </div>
        )}

        {/* Page number footer */}
        <div className="border-t border-slate-100 px-6 py-2 flex items-center justify-between">
          <div className="text-[10px] text-slate-400">SmlouvaHned.cz  |  Smluvní vzory 2026</div>
          <div className="text-[10px] text-slate-400">Strana 1</div>
        </div>
      </div>

      {/* CTA overlay — nudges user toward payment */}
      <div className="mt-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-400/10 border border-amber-500/20 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <div className="text-sm font-black text-white mb-0.5">
            Vidíte náhled prvních {previewCount} z {totalSections} sekcí
          </div>
          <div className="text-xs text-slate-400">
            Po zaplacení obdržíte kompletní PDF připravené k podpisu.
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-amber-400 text-lg">🔒</span>
          <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Odemknout dokument</span>
        </div>
      </div>
    </div>
  );
}
