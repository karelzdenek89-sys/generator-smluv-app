import Link from 'next/link';
import { formatIsoDateCz } from './PortalShell';
import {
  LEGAL_CHANGE_STATUS_DESCRIPTIONS,
  LEGAL_CHANGE_STATUS_LABELS,
  type LegalChange,
  type LegalChangeStatus,
} from '@/lib/legal/radar';

const STATUS_STYLES: Record<LegalChangeStatus, string> = {
  in_force: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  approved_pending: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  in_progress: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  proposal: 'border-slate-500/40 bg-slate-500/10 text-slate-300',
};

export function LegalStatusBadge({ status }: { status: LegalChangeStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${STATUS_STYLES[status]}`}
      title={LEGAL_CHANGE_STATUS_DESCRIPTIONS[status]}
    >
      {LEGAL_CHANGE_STATUS_LABELS[status]}
    </span>
  );
}

/** Karta jedné legislativní změny — název, koho se týká, status, datum, co se mění, co udělat, zdroje. */
export default function LegalChangeCard({ change, compact = false }: { change: LegalChange; compact?: boolean }) {
  return (
    <article id={change.key} className="site-content-card scroll-mt-24 rounded-2xl p-6" aria-labelledby={`${change.key}-title`}>
      <div className="flex flex-wrap items-center gap-3">
        <LegalStatusBadge status={change.status} />
        <span className="text-xs text-slate-500">{change.dateLabel}</span>
      </div>
      <h3 id={`${change.key}-title`} className="mt-3 font-serif italic text-xl font-bold text-white md:text-2xl">
        {change.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{change.summary}</p>

      {!compact ? (
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Co se konkrétně mění</div>
            <ul className="space-y-2 text-sm leading-7 text-slate-400">
              {change.whatChanges.map((item) => (
                <li key={item} className="flex gap-2"><span className="text-[#c9a852]">•</span><span>{item}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Co máte udělat</div>
            <ul className="space-y-2 text-sm leading-7 text-slate-400">
              {change.whatToDo.map((item) => (
                <li key={item} className="flex gap-2"><span className="text-emerald-400">✓</span><span>{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {change.escalation ? (
        <p className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-3 text-xs leading-6 text-slate-300">{change.escalation}</p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4 border-t border-white/8 pt-4">
        <div className="min-w-0">
          {change.affectedDocuments.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {change.affectedDocuments.map((document) => (
                <Link key={document.href + document.label} href={document.href} className="rounded-lg border border-[#c9a852]/25 px-3 py-1.5 text-xs font-semibold text-[#e2c77b] transition hover:border-[#c9a852]/60 hover:text-white">
                  {document.label}
                </Link>
              ))}
            </div>
          ) : null}
          <ul className="mt-3 space-y-1 text-xs text-slate-500">
            {change.sources.map((source) => (
              <li key={source.href}>
                <a href={source.href} target="_blank" rel="noopener noreferrer" className="text-amber-400/90 transition hover:text-amber-300">
                  {source.label}
                </a>
                <span className="ml-1 text-slate-600">({source.publisher})</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xs text-slate-500">
          Ověřeno <time dateTime={change.verifiedAt} className="text-slate-400">{formatIsoDateCz(change.verifiedAt)}</time>
        </div>
      </div>
    </article>
  );
}
