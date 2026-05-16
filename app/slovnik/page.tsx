import type { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbSchema, jsonLdScript } from '@/lib/schemas';
import {
  GLOSSARY,
  GLOSSARY_CATEGORIES,
  type GlossaryCategory,
  type GlossaryEntry,
} from '@/lib/glossary';
import InformativeDisclaimer from '@/app/components/blog/InformativeDisclaimer';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://smlouvahned.cz';

export const metadata: Metadata = {
  title: 'Slovník právních pojmů | SmlouvaHned',
  description:
    'Informativní slovník pojmů ze smluvního práva — nájem, koupě, dílo, DPP, plná moc a další. Stručná vysvětlení s odkazy na § občanského zákoníku a zákoníku práce.',
  alternates: { canonical: `${BASE_URL}/slovnik` },
  openGraph: {
    title: 'Slovník právních pojmů | SmlouvaHned',
    description:
      'Informativní slovník pojmů ze smluvního práva s odkazy na § OZ a ZP. Aktuální k 2026.',
    url: `${BASE_URL}/slovnik`,
    type: 'website',
  },
};

const categoryOrder: GlossaryCategory[] = [
  'bydleni',
  'prace',
  'koupe-prodej',
  'zastoupeni',
  'finance',
  'obecne',
];

const definedTermSetSchema = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: 'Slovník právních pojmů SmlouvaHned',
  url: `${BASE_URL}/slovnik`,
  inLanguage: 'cs',
  hasDefinedTerm: GLOSSARY.map((entry) => ({
    '@type': 'DefinedTerm',
    '@id': `${BASE_URL}/slovnik#${entry.slug}`,
    name: entry.term,
    ...(entry.aliases && entry.aliases.length > 0
      ? { alternateName: [...entry.aliases] }
      : {}),
    description: entry.definition,
    url: `${BASE_URL}/slovnik#${entry.slug}`,
    inDefinedTermSet: `${BASE_URL}/slovnik`,
  })),
};

const breadcrumb = breadcrumbSchema([
  { label: 'SmlouvaHned', href: '/' },
  { label: 'Slovník pojmů', href: '/slovnik' },
]);

function groupByCategory(entries: readonly GlossaryEntry[]) {
  const map = new Map<GlossaryCategory, GlossaryEntry[]>();
  for (const entry of entries) {
    if (!map.has(entry.category)) map.set(entry.category, []);
    map.get(entry.category)!.push(entry);
  }
  for (const [, arr] of map) {
    arr.sort((a, b) => a.term.localeCompare(b.term, 'cs'));
  }
  return map;
}

export default function SlovnikPage() {
  const grouped = groupByCategory(GLOSSARY);

  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200 px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(definedTermSetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }}
      />

      <div className="mx-auto max-w-4xl">
        <nav className="mb-8 text-xs text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-slate-300">
            SmlouvaHned
          </Link>
          <span className="mx-2 text-slate-700">›</span>
          <span className="text-slate-400">Slovník pojmů</span>
        </nav>

        <header className="mb-10">
          <div className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">
            Slovník
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-4">
            Slovník právních pojmů
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
            Stručné vysvětlení {GLOSSARY.length}+ pojmů, se kterými se setkáte ve smlouvách —
            nájem, koupě, dílo, dohody o pracích konaných mimo pracovní poměr, plná moc a další.
            U každého termínu uvádíme citaci platného právního předpisu a odkaz na související
            průvodce.
          </p>
        </header>

        <InformativeDisclaimer className="mb-10" />

        <nav className="mb-12 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Kategorie">
          <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
            Kategorie
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 text-sm">
            {categoryOrder.map((cat) =>
              grouped.has(cat) ? (
                <li key={cat}>
                  <a
                    href={`#kategorie-${cat}`}
                    className="text-slate-300 transition hover:text-amber-400"
                  >
                    {GLOSSARY_CATEGORIES[cat]}{' '}
                    <span className="text-slate-600">({grouped.get(cat)!.length})</span>
                  </a>
                </li>
              ) : null,
            )}
          </ul>
        </nav>

        <div className="space-y-14">
          {categoryOrder.map((cat) => {
            const entries = grouped.get(cat);
            if (!entries || entries.length === 0) return null;
            return (
              <section
                key={cat}
                id={`kategorie-${cat}`}
                className="scroll-mt-8"
                aria-labelledby={`heading-${cat}`}
              >
                <h2
                  id={`heading-${cat}`}
                  className="text-xs font-black uppercase tracking-[0.18em] text-amber-400 mb-6"
                >
                  {GLOSSARY_CATEGORIES[cat]}
                </h2>
                <dl className="space-y-6">
                  {entries.map((entry) => (
                    <div
                      key={entry.slug}
                      id={entry.slug}
                      className="scroll-mt-8 rounded-2xl border border-white/8 bg-[#0c1426] p-6"
                    >
                      <dt className="mb-2 flex flex-wrap items-baseline gap-3">
                        <a
                          href={`#${entry.slug}`}
                          className="text-xl font-black tracking-tight text-white transition hover:text-amber-400"
                        >
                          {entry.term}
                        </a>
                        {entry.aliases && entry.aliases.length > 0 ? (
                          <span className="text-xs text-slate-600">
                            také: {entry.aliases.join(', ')}
                          </span>
                        ) : null}
                      </dt>
                      <dd className="text-sm leading-relaxed text-slate-400">
                        {entry.definition}
                      </dd>
                      {entry.legalReference ? (
                        <p className="mt-3 text-xs text-slate-600">
                          <span className="font-semibold text-slate-500">Právní úprava: </span>
                          {entry.legalReference}
                        </p>
                      ) : null}
                      {entry.relatedHref ? (
                        <Link
                          href={entry.relatedHref}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-400 underline underline-offset-2 transition hover:text-amber-300"
                        >
                          {entry.relatedLabel ?? 'Související obsah'} →
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>

        <div className="mt-16 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
          <h2 className="text-xl font-black tracking-tight text-white mb-3">
            Potřebujete konkrétní dokument?
          </h2>
          <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-slate-400">
            Vyberte si typ smlouvy a vyplňte formulář — strukturovaný PDF dokument získáte ihned.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
            >
              Vybrat dokument →
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Číst průvodce
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
