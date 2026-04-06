import type { Metadata } from 'next';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata: Metadata = {
  title: 'Nejčastější chyby při pronájmu bytu 2026: Na co si dát pozor před podpisem',
  description:
    'Přehled nejčastějších chyb při pronájmu bytu. Nejasná kauce, chybějící předávací protokol, slabá pravidla užívání a další body, které je vhodné řešit písemně.',
  alternates: {
    canonical: 'https://smlouvahned.cz/blog/chyby-pri-pronajmu-bytu-2026',
  },
  openGraph: {
    title: 'Nejčastější chyby při pronájmu bytu 2026',
    description:
      'Na co si dát pozor při pronájmu bytu, co bývá ve smlouvách nejasné a kdy je praktičtější řešit vedle smlouvy i navazující podklady.',
    url: 'https://smlouvahned.cz/blog/chyby-pri-pronajmu-bytu-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Nejčastější chyby při pronájmu bytu 2026: Na co si dát pozor před podpisem',
  description:
    'Přehled nejčastějších chyb při pronájmu bytu. Nejasná kauce, chybějící předávací protokol, slabá pravidla užívání a další body, které je vhodné řešit písemně.',
  url: 'https://smlouvahned.cz/blog/chyby-pri-pronajmu-bytu-2026',
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
      name: 'Nejčastější chyby při pronájmu bytu 2026',
      item: 'https://smlouvahned.cz/blog/chyby-pri-pronajmu-bytu-2026',
    },
  ],
};

export default function ChybyPriPronajmuBytu2026Page() {
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
        readTime="8 min"
        dateTime="2026-04-06"
        dateLabel="6. dubna 2026"
        breadcrumbLabel="Nejčastější chyby při pronájmu bytu 2026"
        title="Nejčastější chyby při pronájmu bytu: Na co si dát pozor před podpisem"
        intro="Většina problémů při pronájmu nevzniká kvůli jedné velké chybě, ale kvůli několika drobným nepřesnostem. Nejasná pravidla užívání, chybějící protokol nebo špatně zachycená kauce pak komplikují celý nájemní vztah."
        toc={[
          { href: '#nejasna-smlouva', label: 'Nejasná nebo příliš obecná smlouva' },
          { href: '#chybejici-predani', label: 'Chybějící předávací protokol' },
          { href: '#slaba-pravidla', label: 'Slabá pravidla pro užívání bytu' },
          { href: '#jak-zvolit-cestu', label: 'Jak zvolit vhodnou cestu v rámci produktu' },
        ]}
        primaryAction={{
          title: 'Hledáte přehlednou cestu podle situace?',
          body: 'Situační stránka pro pronajímatele pomůže rozlišit, kdy stačí samostatný dokument a kdy je praktičtější širší varianta nebo tematický balíček.',
          buttonLabel: 'Zobrazit dokumenty pro pronajímatele',
          href: '/pro-pronajimatele',
        }}
        trustBox={{
          generatorSuitable:
            'Standardní pronájem bytu nebo domu, kde chcete předejít běžným chybám a mít dokumenty připravené přehledně a ve správné návaznosti.',
          lawyerSuitable:
            'Sporné ukončení nájmu, vyšší škody, složitější investice do nemovitosti nebo situace, kdy už mezi stranami vznikl konflikt.',
        }}
        finalAction={{
          title: 'Řešíte smlouvu i předání bytu v jednom kroku?',
          body: 'Balíček pro pronajímatele navazuje na nájemní smlouvu v komplexní variantě a doplňuje ji o podklady k předání bytu a práci s kaucí.',
          buttonLabel: 'Zobrazit balíček pro pronajímatele',
          href: '/balicek-pronajimatel',
        }}
        relatedLinks={[
          { href: '/pro-pronajimatele', label: 'Dokumenty pro pronajímatele' },
          { href: '/najem', label: 'Nájemní smlouva' },
          { href: '/balicek-pronajimatel', label: 'Balíček pro pronajímatele' },
          { href: '/blog/najemni-smlouva-vzor-2026', label: 'Co má obsahovat nájemní smlouva' },
        ]}
      >
        <section id="nejasna-smlouva" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Nejasná nebo příliš obecná smlouva</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Častou chybou je smlouva, která sice formálně existuje, ale neřeší klíčové body dostatečně konkrétně. Typicky jde o výši kauce, pravidla pro vyúčtování služeb, délku nájmu nebo pravidla pro ukončení vztahu.
          </p>
          <p className="leading-relaxed text-slate-400">
            V běžné situaci stačí jasně popsat základní parametry. Problém nevzniká z toho, že by dokument musel být složitý, ale z toho, že je příliš vágní.
          </p>
        </section>

        <section id="chybejici-predani" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Chybějící předávací protokol</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Druhá velmi častá chyba je, že se sepíše samotná nájemní smlouva, ale nikdo už neřeší samostatný podklad k předání bytu. To se často projeví až při skončení nájmu, kdy není jasné, v jakém stavu byl byt předán nebo kolik klíčů měl nájemce k dispozici.
          </p>
          <p className="leading-relaxed text-slate-400">
            U standardního pronájmu je právě předávací protokol jedním z nejpraktičtějších dokumentů, který pomáhá předejít nedorozumění mezi stranami.
          </p>
        </section>

        <section id="slaba-pravidla" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Slabá pravidla pro užívání bytu</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Další slabé místo bývá v tom, že smlouva neřeší běžná praktická pravidla: kolik osob byt užívá, jak se pracuje se zvířaty, zda je možný podnájem nebo krátkodobé ubytování a kdo odpovídá za drobné opravy.
          </p>
          <p className="leading-relaxed text-slate-400">
            Pro standardní pronájem není cílem vytvářet složitý text. Důležité ale je, aby byly praktické situace zachyceny tak, aby obě strany věděly, co je dohodnuto.
          </p>
        </section>

        <section id="jak-zvolit-cestu" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Jak zvolit vhodnou cestu v rámci produktu</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Pokud potřebujete pouze samotnou nájemní smlouvu, dává smysl zůstat u samostatného dokumentu. Pokud ale řešíte i předání bytu, práci s kaucí a chcete mít praktické podklady připravené v návaznosti, bývá přirozenější zvolit širší řešení.
          </p>
          <p className="leading-relaxed text-slate-400">
            Smyslem není prodávat více dokumentů, ale vybrat takovou cestu, která odpovídá rozsahu situace. Právě to bývá u pronájmu rozhodující.
          </p>
        </section>
      </ArticlePageLayout>
    </>
  );
}
