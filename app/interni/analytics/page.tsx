import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAnalyticsDashboardData, type AnalyticsDashboardData } from '@/lib/analytics-reporting';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Intern\u00ed reporting | SmlouvaHned.cz',
  description: 'Intern\u00ed p\u0159ehled v\u00fdkonu funnelu, obsahu a produktov\u00fdch cest.',
  robots: {
    index: false,
    follow: false,
  },
};

const numberFormatter = new Intl.NumberFormat('cs-CZ');
const dateFormatter = new Intl.DateTimeFormat('cs-CZ', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return dateFormatter.format(parsed);
}

function bandLabel(band: '99' | '199' | '299') {
  if (band === '99') return 'Z\u00e1kladn\u00ed dokument';
  if (band === '199') return 'Komplexn\u00ed bal\u00ed\u010dek';
  return 'Tematick\u00e9 bal\u00ed\u010dky';
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold tracking-tight text-[#f7f0de]">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: Array<Array<ReactNode>>;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#0a1020]/80">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/8 text-sm">
          <thead className="bg-white/[0.03]">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-4 py-6 text-center text-sm text-slate-500">
                  {'Zat\u00edm nejsou k dispozici \u017e\u00e1dn\u00e1 data za zvolen\u00e9 obdob\u00ed.'}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index} className="bg-transparent">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 align-top text-slate-200">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DashboardContent({ data }: { data: AnalyticsDashboardData }) {
  return (
    <>
      <section className="rounded-[32px] border border-[#caa45a]/20 bg-[linear-gradient(180deg,rgba(202,164,90,0.08),rgba(255,255,255,0.02))] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-[#caa45a]/30 bg-[#caa45a]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#dcb872]">
              {'Intern\u00ed reporting'}
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-[#f7f0de] md:text-5xl">
              {'P\u0159ehled v\u00fdkonu funnelu a produktov\u00fdch cest'}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              {'P\u0159ehled je postaven\u00fd nad first-party eventy z posledn\u00edch '}
              {data.windowDays}
              {' dn\u00ed. C\u00edlem je rychle vid\u011bt, co p\u0159iv\u00e1d\u00ed u\u017eivatele do builderu, co vede do bal\u00ed\u010dk\u016f a jak se rozkl\u00e1d\u00e1 z\u00e1jem mezi 99, 199 a 299 K\u010d.'}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {'Posledn\u00ed aktualizace'}
              </div>
              <div className="mt-1 text-sm text-[#f7f0de]">{formatDate(data.generatedAt)}</div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {'Analyzovan\u00e9 eventy'}
              </div>
              <div className="mt-1 text-sm text-[#f7f0de]">{formatNumber(data.analyzedEvents)}</div>
            </div>
          </div>
        </div>
      </section>

      <Section
        title={'Hlavn\u00ed metriky'}
        description={
          'Rychl\u00fd p\u0159ehled nad nejd\u016fle\u017eit\u011bj\u0161\u00edmi body funnelu, aby bylo hned vid\u011bt, jestli obsah a produktov\u00e9 cesty p\u0159iv\u00e1d\u011bj\u00ed lidi d\u00e1l.'
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.overview.map((item) => (
            <div key={item.key} className="rounded-2xl border border-white/8 bg-[#0a1020]/80 p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {item.label}
              </div>
              <div className="mt-3 text-3xl font-semibold tracking-tight text-[#f7f0de]">
                {formatNumber(item.value)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title={'Z\u00e1jem o 99 / 199 / 299'}
        description={
          'Srovn\u00e1n\u00ed vrchn\u00edho z\u00e1jmu z homepage nebo package cesty, samotn\u00e9 volby ve flow a checkout klik\u016f.'
        }
      >
        <Table
          headers={['Vrstva', 'Klik z p\u0159ehledu', 'Volba ve flow', 'Checkout kliky']}
          rows={data.pricingInterest.map((item) => [
            <div key={`${item.band}-label`}>
              <div className="font-medium text-[#f7f0de]">{bandLabel(item.band)}</div>
              <div className="text-xs text-slate-500">{item.band} K\u010d</div>
            </div>,
            formatNumber(item.topFunnel),
            formatNumber(item.selection),
            formatNumber(item.checkout),
          ])}
        />
      </Section>

      <Section
        title={'Top zdroje do produktu'}
        description={
          'Kter\u00e9 \u010dl\u00e1nky, situa\u010dn\u00ed str\u00e1nky a bal\u00ed\u010dky nej\u010dast\u011bji posouvaj\u00ed u\u017eivatele sm\u011brem k builderu nebo p\u0159\u00edmo do bal\u00ed\u010dku.'
        }
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <div>
            <div className="mb-3 text-sm font-medium text-[#f7f0de]">{'Top zdroje do builderu'}</div>
            <Table
              headers={['Zdroj', 'P\u0159echody']}
              rows={data.topSourcesToBuilder.map((item) => [item.label, formatNumber(item.value)])}
            />
          </div>
          <div>
            <div className="mb-3 text-sm font-medium text-[#f7f0de]">{'Top zdroje do bal\u00ed\u010dku'}</div>
            <Table
              headers={['Zdroj', 'P\u0159echody']}
              rows={data.topSourcesToPackage.map((item) => [item.label, formatNumber(item.value)])}
            />
          </div>
        </div>
      </Section>

      <div className="grid gap-8 xl:grid-cols-2">
        <Section
          title={'\u010cl\u00e1nky a jejich produktov\u00fd v\u00fdkon'}
          description={
            'Pom\u00e1h\u00e1 rychle odli\u0161it obsah, kter\u00fd jen p\u0159itahuje n\u00e1v\u0161t\u011bvu, od obsahu, kter\u00fd skute\u010dn\u011b otev\u00edr\u00e1 produktovou cestu.'
          }
        >
          <Table
            headers={['\u010cl\u00e1nek', 'Views', '\u2192 Builder', '\u2192 Situace', '\u2192 Bal\u00ed\u010dek']}
            rows={data.articlePerformance.map((item) => [
              <div key={item.articleSlug}>
                <div className="font-medium text-[#f7f0de]">{item.title}</div>
                <div className="text-xs text-slate-500">/{item.articleSlug}</div>
              </div>,
              formatNumber(item.views),
              formatNumber(item.toBuilder),
              formatNumber(item.toSituation),
              formatNumber(item.toPackage),
            ])}
          />
        </Section>

        <Section
          title={'Situa\u010dn\u00ed landing pages'}
          description={
            'Ukazuje, jestli situa\u010dn\u00ed str\u00e1nky vedou sp\u00ed\u0161 do samostatn\u00e9ho builderu, nebo u\u017eivatele p\u0159esv\u011bd\u010duj\u00ed pro tematick\u00fd bal\u00ed\u010dek.'
          }
        >
          <Table
            headers={['Situace', 'Views', '\u2192 Builder', '\u2192 Bal\u00ed\u010dek']}
            rows={data.situationPerformance.map((item) => [
              item.title,
              formatNumber(item.views),
              formatNumber(item.toBuilder),
              formatNumber(item.toPackage),
            ])}
          />
        </Section>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <Section
          title={'Bal\u00ed\u010dky a vstup do package flow'}
          description={
            'P\u0159ehled nad t\u00edm, jak si vedou bal\u00ed\u010dkov\u00e9 landing pages a kolik u\u017eivatel\u016f z nich skute\u010dn\u011b pokra\u010duje d\u00e1l do builderu.'
          }
        >
          <Table
            headers={['Bal\u00ed\u010dek', 'Views', 'CTA \u2192 Builder', 'Vstup do flow']}
            rows={data.packagePerformance.map((item) => [
              item.title,
              formatNumber(item.views),
              formatNumber(item.ctaToBuilder),
              formatNumber(item.builderEntries),
            ])}
          />
        </Section>

        <Section
          title={'Funnel snapshot'}
          description={
            'Z\u00e1m\u011brn\u011b jednoduch\u00fd pr\u016f\u0159ez nad kl\u00ed\u010dov\u00fdmi p\u0159echody, kter\u00fd se d\u00e1 \u010d\u00edst ka\u017ed\u00fd den bez dal\u0161\u00edho filtru nebo dashboardingu.'
          }
        >
          <div className="space-y-3">
            {data.funnel.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#0a1020]/80 px-4 py-3"
              >
                <div className="text-sm text-slate-300">{item.label}</div>
                <div className="text-lg font-semibold text-[#f7f0de]">{formatNumber(item.value)}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section
        title={'Nej\u010dast\u011bj\u0161\u00ed CTA patterny'}
        description={
          'Pom\u00e1h\u00e1 porovnat, kter\u00e9 typy v\u00fdzev nebo link\u016f pou\u017e\u00edv\u00e1te nej\u010dast\u011bji a kter\u00e9 povrchy funnel re\u00e1ln\u011b rozt\u00e1\u010dej\u00ed.'
        }
      >
        <Table
          headers={['CTA typ', 'Po\u010det klik\u016f']}
          rows={data.topCtas.map((item) => [item.label, formatNumber(item.value)])}
        />
      </Section>
    </>
  );
}

function DashboardError() {
  return (
    <section className="rounded-[28px] border border-amber-500/20 bg-amber-500/5 p-8">
      <h1 className="text-3xl font-semibold tracking-tight text-[#f7f0de]">{'Intern\u00ed reporting'}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
        {
          'Reporting route je p\u0159ipraven\u00e1, ale te\u010f se nepoda\u0159ilo na\u010d\u00edst analytick\u00e1 data. Obvykle to znamen\u00e1, \u017ee nen\u00ed dostupn\u00e1 Redis vrstva nebo je\u0161t\u011b nejsou nastaven\u00e9 pot\u0159ebn\u00e9 prom\u011bnn\u00e9 prost\u0159ed\u00ed.'
        }
      </p>
      <p className="mt-3 text-sm text-slate-400">
        {
          'Ve\u0159ejn\u00fd web t\u00edm nen\u00ed ovlivn\u011bn\u00fd. Jakmile bude analytick\u00e9 \u00falo\u017ei\u0161t\u011b dostupn\u00e9, str\u00e1nka za\u010dne data zobrazovat bez dal\u0161\u00edch zm\u011bn.'
        }
      </p>
    </section>
  );
}

export default async function InternalAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ secret?: string }>;
}) {
  const params = await searchParams;
  const expectedSecret = process.env.INTERNAL_REPORTING_SECRET;
  if (!expectedSecret || params.secret !== expectedSecret) {
    notFound();
  }

  let data: AnalyticsDashboardData | null = null;

  try {
    data = await getAnalyticsDashboardData(7);
  } catch (error) {
    console.warn('[analytics] Failed to fetch dashboard data:', error);
  }

  return (
    <div className="min-h-screen bg-[#05080f] px-6 py-12 md:px-10">
      {data ? <DashboardContent data={data} /> : <p className="text-center text-slate-400 py-20">Data nejsou k dispozici.</p>}
    </div>
  );
}
