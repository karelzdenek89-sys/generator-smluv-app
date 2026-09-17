import Link from 'next/link';
import type { ReactNode } from 'react';
import { breadcrumbSchema, jsonLdScript, type BreadcrumbItem } from '@/lib/schemas';

export type PortalCrumb = BreadcrumbItem;

type PortalShellProps = {
  crumbs: readonly PortalCrumb[];
  kicker?: string;
  title: string;
  lead?: string;
  /** ISO datum — zobrazí se jako „Aktualizováno“. */
  updatedAt?: string;
  /** ISO datum — zobrazí se jako „Právní stav ověřen“. */
  verifiedAt?: string;
  aside?: ReactNode;
  children: ReactNode;
  /** Šířka obsahu — články jsou užší než rozcestníky. */
  width?: 'narrow' | 'wide';
};

export function formatIsoDateCz(value: string | undefined | null): string {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return value;
  return `${day}. ${month}. ${year}`;
}

/**
 * Společný obal portálových stránek (situace, nástroje, radar, články).
 * Server komponenta: breadcrumbs + JSON-LD, hlavička s datem aktualizace
 * a ověření právního stavu, obsah a volitelný postranní panel.
 */
export default function PortalShell({
  crumbs,
  kicker,
  title,
  lead,
  updatedAt,
  verifiedAt,
  aside,
  children,
  width = 'wide',
}: PortalShellProps) {
  const maxWidth = width === 'narrow' ? 'max-w-3xl' : 'max-w-6xl';
  return (
    <main className="site-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbSchema([...crumbs])) }} />
      <div className={`mx-auto ${maxWidth} px-6 py-10 md:py-14`}>
        <nav className="mb-6 text-xs text-slate-500" aria-label="Drobečková navigace">
          <ol className="flex flex-wrap items-center gap-1">
            {crumbs.map((crumb, index) => {
              const last = index === crumbs.length - 1;
              return (
                <li key={crumb.href} className="flex items-center gap-1">
                  {last ? (
                    <span className="text-slate-400" aria-current="page">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="transition hover:text-slate-300">{crumb.label}</Link>
                  )}
                  {!last ? <span className="mx-1 text-slate-700" aria-hidden="true">›</span> : null}
                </li>
              );
            })}
          </ol>
        </nav>

        <header className="mb-10 max-w-3xl">
          {kicker ? <p className="site-kicker mb-3">{kicker}</p> : null}
          <h1 className="font-serif italic text-3xl font-bold leading-tight text-white md:text-5xl">{title}</h1>
          {lead ? <p className="mt-5 text-lg leading-relaxed text-slate-400">{lead}</p> : null}
          {updatedAt || verifiedAt ? (
            <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
              {updatedAt ? (
                <div className="flex gap-1">
                  <dt>Aktualizováno:</dt>
                  <dd><time dateTime={updatedAt} className="text-slate-400">{formatIsoDateCz(updatedAt)}</time></dd>
                </div>
              ) : null}
              {verifiedAt ? (
                <div className="flex gap-1">
                  <dt>Právní stav ověřen:</dt>
                  <dd><time dateTime={verifiedAt} className="text-slate-400">{formatIsoDateCz(verifiedAt)}</time></dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </header>

        {aside ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0">{children}</div>
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">{aside}</aside>
          </div>
        ) : (
          children
        )}
      </div>
    </main>
  );
}

export function PortalSection({
  id,
  kicker,
  title,
  children,
  className = '',
}: {
  id?: string;
  kicker?: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`} aria-labelledby={id ? `${id}-title` : undefined}>
      {kicker ? <p className="site-kicker mb-2">{kicker}</p> : null}
      <h2 id={id ? `${id}-title` : undefined} className="font-serif italic text-2xl font-bold text-white md:text-3xl">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function PortalCard({ children, className = '', highlighted = false }: { children: ReactNode; className?: string; highlighted?: boolean }) {
  return (
    <div
      className={`site-content-card rounded-2xl p-6 ${highlighted ? 'border-[#c9a852]/45 bg-[#c9a852]/[0.07]' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function LinkList({
  items,
  eyebrow,
}: {
  items: readonly { href: string; label: string; note?: string }[];
  eyebrow?: string;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      {eyebrow ? <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">{eyebrow}</div> : null}
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link href={item.href} className="text-sm text-slate-300 transition hover:text-[#e2c77b]">
              {item.label}
            </Link>
            {item.note ? <span className="ml-2 text-xs text-slate-500">{item.note}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OfficialSourceList({ sources }: { sources: readonly { label: string; href: string }[] }) {
  if (sources.length === 0) return null;
  return (
    <section className="rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-labelledby="official-sources-heading">
      <h2 id="official-sources-heading" className="mb-2 text-lg font-bold text-white">Oficiální zdroje</h2>
      <p className="mb-3 text-sm leading-7 text-slate-500">Pravidla se mění. Před konkrétním krokem zkontrolujte aktuální znění.</p>
      <ul className="list-disc space-y-1.5 pl-5 text-sm leading-7 text-slate-400">
        {sources.map((source) => (
          <li key={source.href}>
            <a href={source.href} target="_blank" rel="noopener noreferrer" className="text-amber-400 transition hover:text-amber-300">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PortalDisclaimer({ className = '' }: { className?: string }) {
  return (
    <aside className={`rounded-2xl border border-white/8 bg-white/[0.02] p-5 text-xs leading-6 text-slate-500 ${className}`} aria-label="Právní upozornění">
      <strong className="text-slate-400">Informativní obsah.</strong> SmlouvaHned je softwarový nástroj pro tvorbu
      standardizovaných dokumentů. Není advokátní kanceláří a neposkytuje právní poradenství ve smyslu zákona
      č. 85/1996 Sb. Pro nestandardní, sporné nebo hodnotově významné situace doporučujeme konzultaci s advokátem
      (seznam na{' '}
      <a href="https://www.cak.cz" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline underline-offset-2">cak.cz</a>).
    </aside>
  );
}

export function EscalationNotice({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-5" role="note">
      <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-amber-400">Kdy zvážit individuální posouzení</div>
      <p className="text-sm leading-7 text-slate-300">{text}</p>
    </div>
  );
}
