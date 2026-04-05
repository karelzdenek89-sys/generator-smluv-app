'use client';

import { useState } from 'react';
import { PDF_OUTPUT_TEXT } from '@/lib/servicePositioning';

interface Section {
  title: string;
  body: string[];
}

interface ContractPreviewProps {
  sections: Section[];
  title: string;
  previewCount?: number;
}

export default function ContractPreview({ sections, title, previewCount = 2 }: ContractPreviewProps) {
  const [expanded, setExpanded] = useState(false);

  if (!sections || sections.length === 0) return null;

  const visibleSections = sections.slice(0, expanded ? Math.min(4, sections.length) : previewCount);
  const totalSections = sections.length;

  const today = new Date().toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="relative mb-6">
      <div
        className="relative overflow-hidden rounded-2xl bg-white shadow-[0_12px_48px_rgba(0,0,0,0.22)] select-none"
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        <div className="h-1 w-full bg-gradient-to-r from-[#1A3A5C] via-[#C8A84B] to-[#1A3A5C]" />

        <div className="bg-[#1A3A5C] px-7 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div
                className="text-base font-black uppercase leading-tight tracking-widest text-white"
                style={{ fontFamily: 'Arial, sans-serif', letterSpacing: '0.12em' }}
              >
                {title}
              </div>
              <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#C8A84B]">
                SmlouvaHned.cz · Standardizovaný dokument 2026
              </div>
            </div>
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#C8A84B] text-xs font-black text-[#1A3A5C]"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              SH
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 px-7 py-2" style={{ fontFamily: 'Arial, sans-serif' }}>
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              Datum: <span className="font-medium text-slate-600">{today}</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              Strana: <span className="font-medium text-slate-600">1 / —</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Vzor</span>
          </div>
        </div>

        <div className="space-y-5 px-7 pb-2 pt-5">
          {visibleSections.map((section, i) => (
            <div key={i}>
              <div
                className="mb-2 border-b-[1.5px] border-[#C8A84B] pb-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#1A3A5C]"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                {section.title}
              </div>
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
                        isHeading ? 'mt-2 font-bold text-slate-700' : isBullet ? 'pl-4 text-slate-600' : 'text-slate-700'
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

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div
            className="select-none text-8xl font-black uppercase text-[#1A3A5C]"
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

        <div className="pointer-events-none absolute bottom-8 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />

        {totalSections > previewCount && (
          <div className="relative z-10 pb-2 pt-1 text-center">
            <button
              onClick={() => setExpanded(prev => !prev)}
              className="text-[11px] font-bold text-[#1A3A5C] opacity-50 transition hover:opacity-90 hover:underline underline-offset-2"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              {expanded ? '▲ Zobrazit méně' : `▼ Náhled — ${totalSections - previewCount} dalších sekcí uzamčeno`}
            </button>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 px-7 py-2" style={{ fontFamily: 'Arial, sans-serif' }}>
          <div className="text-[9px] uppercase tracking-wider text-slate-400">SmlouvaHned.cz · Online nástroj pro standardizované dokumenty</div>
          <div className="text-[9px] text-slate-400">Strana 1</div>
        </div>
      </div>

      <div className="mt-3 flex flex-col items-center justify-between gap-3 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-yellow-400/8 px-5 py-4 sm:flex-row">
        <div>
          <div className="mb-0.5 text-sm font-black text-white">
            Náhled prvních {previewCount} z {totalSections} sekcí
          </div>
          <div className="text-xs text-slate-400">{PDF_OUTPUT_TEXT}</div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2">
          <span className="text-base text-amber-400">🔒</span>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Odemknout kompletní dokument</span>
        </div>
      </div>
    </div>
  );
}
