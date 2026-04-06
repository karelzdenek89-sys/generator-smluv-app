import type { Metadata } from 'next';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata: Metadata = {
  title: 'Jak správně předat byt nájemci 2026: Co zachytit v protokolu a na co nezapomenout',
  description:
    'Praktický přehled předání bytu nájemci. Co uvést do předávacího protokolu, jak pracovat s odečty měřidel, klíči, vybavením a kdy si připravit i potvrzení o převzetí kauce.',
  alternates: {
    canonical: 'https://smlouvahned.cz/blog/predani-bytu-najemci-2026',
  },
  openGraph: {
    title: 'Jak správně předat byt nájemci 2026',
    description:
      'Co si připravit při předání bytu, co zachytit do protokolu a proč nestačí jen samotná nájemní smlouva.',
    url: 'https://smlouvahned.cz/blog/predani-bytu-najemci-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jak správně předat byt nájemci 2026: Co zachytit v protokolu a na co nezapomenout',
  description:
    'Praktický přehled předání bytu nájemci. Co uvést do předávacího protokolu, jak pracovat s odečty měřidel, klíči, vybavením a kdy si připravit i potvrzení o převzetí kauce.',
  url: 'https://smlouvahned.cz/blog/predani-bytu-najemci-2026',
  datePublished: '2026-04-06',
  dateModified: '2026-04-06',
  author: { '@type': 'Organization', name: 'SmlouvaHned', url: 'https://smlouvahned.cz' },
  publisher: {
    '@type': 'Organization',
    name: 'SmlouvaHned',
    logo: { '@type': 'ImageObject', url: 'https://smlouvahned.cz/og-image.png' },
  },
  image: 'https://smlouvahned.cz/og-image.png',
  inLanguage: 'cs',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://smlouvahned.cz/blog' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Jak správně předat byt nájemci 2026',
      item: 'https://smlouvahned.cz/blog/predani-bytu-najemci-2026',
    },
  ],
};

export default function PredaniBytuNajemci2026Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }}
      />

      <ArticlePageLayout
        category="Bydlení"
        readTime="7 min"
        dateTime="2026-04-06"
        dateLabel="6. dubna 2026"
        breadcrumbLabel="Předání bytu nájemci 2026"
        title="Jak správně předat byt nájemci: Co zachytit v protokolu a na co nezapomenout"
        intro="Při podpisu nájemní smlouvy bývá pozornost soustředěná hlavně na výši nájemného a kauci. Samotné předání bytu ale rozhoduje o tom, jestli později vzniknou spory o stav nemovitosti, měřidla, klíče nebo vybavení."
        toc={[
          { href: '#proc-predani-resit', label: 'Proč řešit předání bytu samostatně' },
          { href: '#co-zachytit', label: 'Co zachytit při předání bytu' },
          { href: '#predavaci-protokol', label: 'Co má obsahovat předávací protokol' },
          { href: '#kdy-staci-smlouva', label: 'Kdy stačí smlouva a kdy je praktičtější širší řešení' },
        ]}
        primaryAction={{
          title: 'Řešíte pronájem jako celek?',
          body: 'Pokud vedle nájemní smlouvy potřebujete i podklady k předání bytu a potvrzení o převzetí kauce, přejděte na orientační stránku pro pronajímatele.',
          buttonLabel: 'Zobrazit dokumenty pro pronajímatele',
          href: '/pro-pronajimatele',
        }}
        trustBox={{
          generatorSuitable:
            'Standardní předání bytu nebo domu, kdy chcete mít přehledně zachycený stav nemovitosti, vybavení, měřidla a předané klíče.',
          lawyerSuitable:
            'Spory o poškození, vyšší škody, nestandardní ujednání o investicích do bytu nebo situace, kdy se strany neshodnou na průběhu předání.',
        }}
        finalAction={{
          title: 'Chcete vedle smlouvy i podklady k předání?',
          body: 'Balíček pro pronajímatele navazuje na nájemní smlouvu v komplexní variantě a doplňuje ji o předávací protokol, potvrzení o převzetí kauce a praktické podklady k podpisu.',
          buttonLabel: 'Otevřít balíček pro pronajímatele',
          href: '/balicek-pronajimatel',
        }}
        relatedLinks={[
          { href: '/pro-pronajimatele', label: 'Dokumenty pro pronajímatele' },
          { href: '/balicek-pronajimatel', label: 'Balíček pro pronajímatele' },
          { href: '/najem', label: 'Nájemní smlouva' },
          { href: '/blog/kauce-pronajem-bytu-2026', label: 'Kauce při pronájmu bytu' },
        ]}
      >
        <section id="proc-predani-resit" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Proč řešit předání bytu samostatně</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Nájemní smlouva vymezuje právní vztah, ale teprve samotné předání bytu zachycuje jeho faktický stav. Právě v této chvíli se ukazuje, jestli je byt vybavený tak, jak bylo dohodnuto, zda fungují spotřebiče a jaké jsou odečty energií.
          </p>
          <p className="leading-relaxed text-slate-400">
            Pokud tyto informace zůstanou jen v ústní rovině, bývá po skončení nájmu obtížné prokazovat, co už v bytě bylo poškozené, kolik klíčů bylo předáno nebo z jakého stavu měřidel se mělo vycházet při vyúčtování.
          </p>
        </section>

        <section id="co-zachytit" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co zachytit při předání bytu</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Stav bytu', 'Stěny, podlahy, dveře, okna, koupelna, kuchyň a viditelné opotřebení nebo poškození.'],
              ['Vybavení a zařízení', 'Nábytek, spotřebiče, osvětlení a další vybavení, které se v bytě nachází.'],
              ['Odečty měřidel', 'Elektřina, plyn, voda a další odečty, které mají význam pro následné vyúčtování.'],
              ['Předané klíče', 'Počet klíčů, čipy, dálková ovládání, klíče od schránky, sklepa nebo garáže.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
                <div className="mb-1 text-sm font-black text-white">{title}</div>
                <p className="text-sm leading-7 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 leading-relaxed text-slate-400">
            V běžné situaci dává smysl přiložit také fotografie. Samy o sobě sice nenahradí písemný protokol, ale mohou pomoci zpřesnit, co bylo při předání skutečně zachyceno.
          </p>
        </section>

        <section id="predavaci-protokol" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Co má obsahovat předávací protokol</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Předávací protokol je praktická příloha k nájemní smlouvě. V běžném případě by měl obsahovat alespoň identifikaci bytu, datum předání, soupis vybavení, odečty měřidel a místo pro podpis obou stran.
          </p>
          <ul className="space-y-3 text-slate-400">
            {[
              'adresu a přesnou identifikaci bytu nebo domu',
              'datum předání a případné poznámky k dalším krokům',
              'stručný popis stavu jednotlivých místností a vybavení',
              'odečty energií a vody',
              'počet předaných klíčů a dalších přístupových prostředků',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 text-amber-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="kdy-staci-smlouva" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Kdy stačí smlouva a kdy je praktičtější širší řešení</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Pokud řešíte jednoduchý pronájem a potřebujete pouze samotnou nájemní smlouvu, bývá samostatný dokument plně dostačující. Jakmile ale vedle smlouvy řešíte i předání bytu, převzetí kauce a navazující podpisové podklady, bývá praktičtější připravit více souvisejících dokumentů v jednom kroku.
          </p>
          <p className="leading-relaxed text-slate-400">
            Právě proto na SmlouvaHned existuje vedle samostatné nájemní smlouvy i tematický balíček pro pronajímatele. Nejde o jiný typ služby, ale o širší standardizované řešení pro běžnou situaci kolem pronájmu a předání bytu.
          </p>
        </section>
      </ArticlePageLayout>
    </>
  );
}
