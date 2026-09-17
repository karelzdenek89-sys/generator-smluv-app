'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import type { WizardTool } from '@/lib/portal/tools';

/**
 * Rozhodovací průvodce. Ptá se lidsky, vrací doporučení s vysvětlením a
 * výslovně říká, kdy situace může vyžadovat individuální posouzení.
 * Nikdy nepředstírá právní stanovisko.
 */
export default function WizardToolView({ tool }: { tool: WizardTool }) {
  const [path, setPath] = useState<{ questionKey: string; optionLabel: string }[]>([]);
  const [current, setCurrent] = useState<string>(tool.start);
  const startedRef = useRef(false);

  const questionByKey = useMemo(() => new Map(tool.questions.map((question) => [question.key, question])), [tool.questions]);
  const outcomeByKey = useMemo(() => new Map(tool.outcomes.map((outcome) => [outcome.key, outcome])), [tool.outcomes]);

  const outcome = current.startsWith('result:') ? outcomeByKey.get(current.slice('result:'.length)) ?? null : null;
  const question = outcome ? null : questionByKey.get(current) ?? null;

  const choose = (optionLabel: string, next: string) => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent('tool_started', { tool_key: tool.slug, tool_kind: 'wizard', portal_situation: tool.situation });
    }
    setPath((items) => [...items, { questionKey: current, optionLabel }]);
    setCurrent(next);
    if (next.startsWith('result:')) {
      trackEvent('tool_completed', {
        tool_key: tool.slug,
        tool_kind: 'wizard',
        portal_situation: tool.situation,
        tool_outcome: next.slice('result:'.length),
      });
    }
  };

  const restart = () => {
    setPath([]);
    setCurrent(tool.start);
  };

  const back = () => {
    const previous = path[path.length - 1];
    if (!previous) return;
    setPath((items) => items.slice(0, -1));
    setCurrent(previous.questionKey);
  };

  return (
    <div className="space-y-6">
      {path.length > 0 ? (
        <ol className="flex flex-wrap gap-2 text-xs text-slate-500" aria-label="Vaše odpovědi">
          {path.map((step, index) => (
            <li key={`${step.questionKey}-${index}`} className="rounded-full border border-white/8 bg-white/[0.02] px-3 py-1">
              {step.optionLabel}
            </li>
          ))}
        </ol>
      ) : null}

      {question ? (
        <section className="site-content-card rounded-2xl p-6" aria-live="polite">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Otázka {path.length + 1}</div>
          <h2 className="mt-2 font-serif italic text-2xl font-bold text-white">{question.question}</h2>
          {question.help ? <p className="mt-2 text-sm leading-7 text-slate-400">{question.help}</p> : null}
          <div className="mt-5 grid gap-3">
            {question.options.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => choose(option.label, option.next)}
                className="rounded-xl border border-[#c9a852]/25 bg-white/[0.02] px-5 py-4 text-left text-sm font-medium text-white transition hover:border-[#c9a852]/60 hover:bg-[#c9a852]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9a852]"
              >
                {option.label}
              </button>
            ))}
          </div>
          {path.length > 0 ? (
            <button type="button" onClick={back} className="mt-4 text-xs text-slate-400 transition hover:text-white">
              ← Zpět
            </button>
          ) : null}
        </section>
      ) : null}

      {outcome ? (
        <section className="space-y-5" aria-live="polite">
          <div className="rounded-2xl border border-[#c9a852]/45 bg-[#c9a852]/[0.07] p-6">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#c9a852]">Doporučení</div>
            <h2 className="mt-2 font-serif italic text-2xl font-bold text-white">{outcome.title}</h2>
            <p className="mt-3 text-base leading-8 text-slate-200">{outcome.summary}</p>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-slate-300">
              {outcome.explanation.map((line) => (
                <li key={line} className="flex gap-2"><span className="text-[#c9a852]">•</span><span>{line}</span></li>
              ))}
            </ul>
          </div>
          {outcome.caution ? (
            <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-5" role="note">
              <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-amber-400">Situace může vyžadovat individuální posouzení</div>
              <p className="text-sm leading-7 text-slate-300">{outcome.caution}</p>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {outcome.documents.map((document, index) => (
              <Link
                key={document.href}
                href={document.href}
                onClick={() => trackEvent('tool_result_saved', { tool_key: tool.slug, tool_kind: 'wizard', portal_situation: tool.situation, destination: document.href, tool_outcome: outcome.key })}
                className={index === 0 ? 'site-button-primary' : 'site-button-secondary'}
              >
                {document.label} →
              </Link>
            ))}
          </div>
          {outcome.related.length > 0 ? (
            <div className="text-sm text-slate-400">
              Související:{' '}
              {outcome.related.map((link, index) => (
                <span key={link.href}>
                  {index > 0 ? ' · ' : ''}
                  <Link href={link.href} className="text-[#e2c77b] transition hover:text-white">{link.label}</Link>
                </span>
              ))}
            </div>
          ) : null}
          <button type="button" onClick={restart} className="text-xs text-slate-400 transition hover:text-white">
            ← Začít znovu
          </button>
        </section>
      ) : null}
    </div>
  );
}
