import Link from 'next/link';
import { formatIsoDateCz } from './PortalShell';
import LegislationWatchForm from './LegislationWatchForm';
import { isFeatureEnabled } from '@/lib/feature-flags';
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
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${STATUS_STYLES[status]}`} title={LEGAL_CHANGE_STATUS_DESCRIPTIONS[status]}>
      {LEGAL_CHANGE_STATUS_LABELS[status]}
    </span>
  );
}

/**
 * Two corrections verified 17. 9. 2026 against Finanční správa / ČSSZ.
 * Kept at the display boundary so the underlying manually reviewed radar data
 * remains immutable during this product release; the next legal-content review
 * can fold them back into the canonical dataset in one dedicated change.
 */
function legalDisplay(change: LegalChange): LegalChange {
  if (change.key === 'pausalni-dan-2027') {
    return {
      ...change,
      dateLabel: 'Pro rok 2026 platí; obecná lhůta je 10. den období, v roce 2027 připadá 10. 1. na neděli → nejpozději 11. 1. 2027',
      whatChanges: change.whatChanges.map((item) =>
        item.includes('do 10. ledna 2027')
          ? 'Obecná zákonná lhůta pro vstup do paušálního režimu nebo změnu pásma je do 10. dne rozhodného zdaňovacího období. Protože 10. 1. 2027 připadá na neděli, posledním dnem lhůty je nejbližší následující pracovní den, pondělí 11. 1. 2027 (§ 33 odst. 4 daňového řádu).'
          : item,
      ),
    };
  }
  if (change.key === 'osvc-minimalni-zalohy-35-procent') {
    return {
      ...change,
      whatChanges: change.whatChanges.map((item) =>
        item.startsWith('Změna se neuplatní zpětně')
          ? 'Snížení minima od července mění měsíční předpis záloh do budoucna. Zaplacené zálohy se následně zohledňují při ročním Přehledu o příjmech a výdajích; případný doplatek nebo přeplatek závisí na skutečném ročním vyměřovacím základu a evidovaných platbách.'
          : item,
      ),
      whatToDo: change.whatToDo.map((item) =>
        item.startsWith('Pokud jste platili 5 720 Kč')
          ? 'Pokud jste po změně platili vyšší částku, nejdříve zkontrolujte předpis a evidované platby v ePortálu ČSSZ. Konečné roční vypořádání vychází z podaného Přehledu o příjmech a výdajích OSVČ; samotné snížení minimální zálohy proto automaticky neznamená stejnou částku vratitelného přeplatku.'
          : item,
      ),
    };
  }
  return change;
}

export default function LegalChangeCard({ change, compact = false }: { change: LegalChange; compact?: boolean }) {
  const watchEnabled = isFeatureEnabled('legislationWatch');
  const display = legalDisplay(change);
  return (
    <article id={display.key} className="site-content-card scroll-mt-24 rounded-2xl p-6" aria-labelledby={`${display.key}-title`}>
      <div className="flex flex-wrap items-center gap-3">
        <LegalStatusBadge status={display.status} />
        <span className="text-xs text-slate-400">{display.dateLabel}</span>
      </div>
      <h3 id={`${display.key}-title`} className="mt-3 font-serif text-xl font-bold italic text-white md:text-2xl">{display.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{display.summary}</p>

      {!compact ? (
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Co se konkrétně mění</div>
            <ul className="space-y-2 text-sm leading-7 text-slate-400">
              {display.whatChanges.map((item) => <li key={item} className="flex gap-2"><span className="text-[#c9a852]">•</span><span>{item}</span></li>)}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Co máte udělat</div>
            <ul className="space-y-2 text-sm leading-7 text-slate-400">
              {display.whatToDo.map((item) => <li key={item} className="flex gap-2"><span className="text-emerald-400">✓</span><span>{item}</span></li>)}
            </ul>
          </div>
        </div>
      ) : null}

      {display.escalation ? <p className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-3 text-xs leading-6 text-slate-300">{display.escalation}</p> : null}

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4 border-t border-white/8 pt-4">
        <div className="min-w-0 flex-1">
          {display.affectedDocuments.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {display.affectedDocuments.map((document) => (
                <Link key={document.href + document.label} href={document.href} className="rounded-lg border border-[#c9a852]/25 px-3 py-1.5 text-xs font-semibold text-[#e2c77b] transition hover:border-[#c9a852]/60 hover:text-white">{document.label}</Link>
              ))}
            </div>
          ) : null}
          <ul className="mt-3 space-y-1 text-xs text-slate-400">
            {display.sources.map((source) => (
              <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer" className="text-amber-400/90 transition hover:text-amber-300">{source.label}</a><span className="ml-1 text-slate-400">({source.publisher})</span></li>
            ))}
          </ul>
          {watchEnabled ? <LegislationWatchForm changeKey={display.key} /> : null}
        </div>
        <div className="text-xs text-slate-400">Ověřeno <time dateTime={display.verifiedAt} className="text-slate-400">{formatIsoDateCz(display.verifiedAt)}</time></div>
      </div>
    </article>
  );
}
