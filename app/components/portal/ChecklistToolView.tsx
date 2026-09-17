'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import type { ChecklistTool } from '@/lib/portal/tools';

const STORAGE_PREFIX = 'sh_tool_checklist:';

/**
 * Interaktivní checklist. Stav se drží jen v prohlížeči (per-viewer
 * pohodlí, žádná registrace, žádný e-mail). Výsledek lze vytisknout nebo
 * pokračovat k dokumentu; události měří start / dokončení bez PII.
 */
export default function ChecklistToolView({ tool }: { tool: ChecklistTool }) {
  const allKeys = useMemo(() => tool.sections.flatMap((section) => section.items.map((item) => item.key)), [tool.sections]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);
  const startedRef = useRef(false);
  const completedRef = useRef(false);

  useEffect(() => {
    let restored: Record<string, boolean> = {};
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${tool.slug}`);
      const parsed = raw ? (JSON.parse(raw) as unknown) : null;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        restored = Object.fromEntries(
          Object.entries(parsed as Record<string, unknown>).filter(([key, value]) => allKeys.includes(key) && value === true),
        ) as Record<string, boolean>;
      }
    } catch {
      // storage may be blocked — checklist still works in memory
    }
    const timer = window.setTimeout(() => {
      setChecked(restored);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [tool.slug, allKeys]);

  const doneCount = allKeys.filter((key) => checked[key]).length;
  const total = allKeys.length;
  const progress = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${tool.slug}`, JSON.stringify(checked));
    } catch {
      // ignore
    }
    if (doneCount === total && total > 0 && !completedRef.current) {
      completedRef.current = true;
      trackEvent('tool_completed', { tool_key: tool.slug, tool_kind: 'checklist', portal_situation: tool.situation });
    }
  }, [checked, doneCount, total, hydrated, tool.slug, tool.situation]);

  const toggle = (key: string) => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent('tool_started', { tool_key: tool.slug, tool_kind: 'checklist', portal_situation: tool.situation });
    }
    setChecked((current) => ({ ...current, [key]: !current[key] }));
  };

  const reset = () => {
    setChecked({});
    completedRef.current = false;
  };

  return (
    <div className="space-y-8">
      <div className="site-content-card rounded-2xl p-5" role="status" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Váš postup</div>
            <div className="mt-1 text-lg font-semibold text-white">
              {doneCount} z {total} bodů{doneCount === total && total > 0 ? ' — hotovo' : ''}
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => window.print()} className="site-button-secondary text-xs">
              Vytisknout
            </button>
            <button type="button" onClick={reset} className="rounded-lg px-3 py-2 text-xs text-slate-400 transition hover:text-white">
              Začít znovu
            </button>
          </div>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full rounded-full bg-[#c9a852] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {tool.sections.map((section) => (
        <section key={section.title} aria-labelledby={`section-${section.title}`}>
          <h2 id={`section-${section.title}`} className="mb-4 font-serif italic text-xl font-bold text-white">
            {section.title}
          </h2>
          <ul className="space-y-2">
            {section.items.map((item) => {
              const done = Boolean(checked[item.key]);
              const inputId = `${tool.slug}-${item.key}`;
              return (
                <li key={item.key} className={`rounded-2xl border p-4 transition ${done ? 'border-emerald-500/30 bg-emerald-500/[0.05]' : 'border-white/8 bg-white/[0.02]'}`}>
                  <label htmlFor={inputId} className="flex cursor-pointer items-start gap-3">
                    <input
                      id={inputId}
                      type="checkbox"
                      checked={done}
                      onChange={() => toggle(item.key)}
                      className="mt-1 h-4 w-4 flex-shrink-0 accent-[#c9a852]"
                    />
                    <span>
                      <span className={`block text-sm font-medium ${done ? 'text-slate-400 line-through decoration-slate-600' : 'text-white'}`}>{item.label}</span>
                      {item.detail ? <span className="mt-1 block text-xs leading-6 text-slate-500">{item.detail}</span> : null}
                      {item.link ? (
                        <Link href={item.link.href} className="mt-1 inline-block text-xs font-semibold text-[#e2c77b] transition hover:text-white">
                          {item.link.label} →
                        </Link>
                      ) : null}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <div className="rounded-2xl border border-[#c9a852]/25 bg-[#0c1426] p-6">
        <div className="text-[10px] font-black uppercase tracking-widest text-[#c9a852]">Další krok</div>
        <p className="mt-2 text-sm leading-7 text-slate-400">
          Máte-li body projité, můžete pokračovat rovnou k dokumentu. Údaje z checklistu se nikam neodesílají.
        </p>
        <Link
          href={tool.primaryDocument.href}
          onClick={() => trackEvent('tool_result_saved', { tool_key: tool.slug, tool_kind: 'checklist', portal_situation: tool.situation, destination: tool.primaryDocument.href })}
          className="site-button-primary mt-4"
        >
          {tool.primaryDocument.label} →
        </Link>
      </div>
    </div>
  );
}
