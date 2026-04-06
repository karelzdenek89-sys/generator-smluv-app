import type { Metadata } from 'next';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata: Metadata = {
  title: 'Jaké doklady předat při prodeji auta 2026: Přehled pro běžný převod vozidla',
  description:
    'Přehled dokladů a podkladů, které se při běžném prodeji auta předávají kupujícímu. Jak pracovat s technickými doklady, klíči a dalšími přílohami převodu.',
  alternates: {
    canonical: 'https://smlouvahned.cz/blog/doklady-pri-prodeji-auta-2026',
  },
  openGraph: {
    title: 'Jaké doklady předat při prodeji auta 2026',
    description:
      'Co při prodeji auta obvykle předat spolu s vozidlem a jak tyto doklady zachytit přehledně a bez zmatku.',
    url: 'https://smlouvahned.cz/blog/doklady-pri-prodeji-auta-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaké doklady předat při prodeji auta 2026: Přehled pro běžný převod vozidla',
  description:
    'Přehled dokladů a podkladů, které se při běžném prodeji auta předávají kupujícímu. Jak pracovat s technickými doklady, klíči a dalšími přílohami převodu.',
  url: 'https://smlouvahned.cz/blog/doklady-pri-prodeji-auta-2026',
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
      name: 'Jaké doklady předat při prodeji auta 2026',
      item: 'https://smlouvahned.cz/blog/doklady-pri-prodeji-auta-2026',
    },
  ],
};

export default function DokladyPriProdejiAuta2026Page() {
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
        category="Vozidla"
        readTime="6 min"
        dateTime="2026-04-06"
        dateLabel="6. dubna 2026"
        breadcrumbLabel="Jaké doklady předat při prodeji auta 2026"
        title="Jaké doklady předat při prodeji auta: Přehled pro běžný převod vozidla"
        intro="Při prodeji auta nejde jen o podpis kupní smlouvy. V praxi je důležité, aby obě strany měly jasno i v tom, jaké doklady a podklady byly při převodu skutečně předány."
        toc={[
          { href: '#proc-na-dokladech-zalezi', label: 'Proč na dokladech záleží' },
          { href: '#co-se-obvykle-predava', label: 'Co se obvykle předává' },
          { href: '#jak-to-zachytit', label: 'Jak předání dokladů zachytit písemně' },
          { href: '#kdy-resit-cele-situacne', label: 'Kdy řešit převod jako celek' },
        ]}
        primaryAction={{
          title: 'Řešíte kromě smlouvy i předání auta?',
          body: 'Situační stránka pro prodej vozidla pomůže vybrat, kdy stačí kupní smlouva a kdy dává smysl širší řešení s předávacími podklady.',
          buttonLabel: 'Zobrazit podklady pro prodej vozidla',
          href: '/prodej-vozidla',
        }}
        trustBox={{
          generatorSuitable:
            'Běžný prodej auta nebo jiného motorového vozidla, kdy chcete mít vedle smlouvy i jasně zachycené předání klíčů a dokladů.',
          lawyerSuitable:
            'Převod zatíženého vozidla, nejasný původ vozidla, probíhající spor o vlastnictví nebo nestandardní obchodní podmínky mezi stranami.',
        }}
        finalAction={{
          title: 'Chcete vedle smlouvy i navazující podklady?',
          body: 'Balíček pro prodej vozidla obsahuje kupní smlouvu v komplexní variantě, předávací protokol i potvrzení o převzetí vozidla, klíčů a dokladů.',
          buttonLabel: 'Otevřít balíček pro prodej vozidla',
          href: '/balicek-prodej-vozidla',
        }}
        relatedLinks={[
          { href: '/prodej-vozidla', label: 'Podklady pro prodej vozidla' },
          { href: '/balicek-prodej-vozidla', label: 'Balíček pro prodej vozidla' },
          { href: '/auto', label: 'Kupní smlouva na vozidlo' },
          { href: '/blog/prepis-vozidla-2026', label: 'Přepis vozidla po podpisu smlouvy' },
        ]}
      >
        <section id="proc-na-dokladech-zalezi" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Proč na dokladech záleží</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Pokud není zachyceno, jaké doklady byly při prodeji předány, může mezi stranami později vzniknout spor o to, kdo co převzal nebo kdo měl dodat další podklady k převodu.
          </p>
          <p className="leading-relaxed text-slate-400">
            V běžné situaci nejde o složitou právní otázku, ale o pořádek v převodu. Právě proto je praktické spojit kupní smlouvu s přehledným podkladem k předání.
          </p>
        </section>

        <section id="co-se-obvykle-predava" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co se obvykle předává</h2>
          <ul className="space-y-3 text-slate-400">
            {[
              'klíče a dálkové ovladače',
              'technické doklady a další podklady k provozu vozidla',
              'servisní dokumentace, pokud je k dispozici',
              'doklady o pravidelných kontrolách nebo údržbě',
              'další příslušenství, které bylo součástí dohody',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 text-amber-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="jak-to-zachytit" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Jak předání dokladů zachytit písemně</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Nejpraktičtější bývá navázat předání dokladů na předávací protokol. V jednom místě tak zachytíte vozidlo, klíče, příslušenství i seznam předaných podkladů. Výhodou je, že vše podepisují obě strany najednou.
          </p>
          <p className="leading-relaxed text-slate-400">
            Pokud by se doklady předávaly později nebo odděleně, je vhodné i tuto skutečnost písemně zachytit, aby bylo zřejmé, co bylo předáno při podpisu a co následně.
          </p>
        </section>

        <section id="kdy-resit-cele-situacne" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Kdy řešit převod jako celek</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Pokud řešíte jen samotnou smlouvu, může stačit samostatný dokument. Jakmile ale vedle smlouvy potřebujete zachytit i fyzické předání vozidla a seznam předaných dokladů, bývá praktičtější pracovat s širší sadou navazujících podkladů.
          </p>
          <p className="leading-relaxed text-slate-400">
            V produktu SmlouvaHned tuto roli plní tematický balíček pro prodej vozidla. Je určen pro běžnou situaci a pomáhá udržet celé předání přehledné.
          </p>
        </section>
      </ArticlePageLayout>
    </>
  );
}
