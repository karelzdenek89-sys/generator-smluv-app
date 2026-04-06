import type { Metadata } from 'next';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata: Metadata = {
  title: 'Jak správně předat vozidlo kupujícímu 2026: Protokol, klíče, doklady a stav vozu',
  description:
    'Praktický přehled toho, co řešit při předání vozidla kupujícímu. Stav vozu, klíče, technické doklady, příslušenství a proč je vhodné mít vše zachycené písemně.',
  alternates: {
    canonical: 'https://smlouvahned.cz/blog/predani-vozidla-kupujicimu-2026',
  },
  openGraph: {
    title: 'Jak správně předat vozidlo kupujícímu 2026',
    description:
      'Co si při předání auta potvrdit a jak předejít sporům o stav vozu, klíče a předané doklady.',
    url: 'https://smlouvahned.cz/blog/predani-vozidla-kupujicimu-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jak správně předat vozidlo kupujícímu 2026: Protokol, klíče, doklady a stav vozu',
  description:
    'Praktický přehled toho, co řešit při předání vozidla kupujícímu. Stav vozu, klíče, technické doklady, příslušenství a proč je vhodné mít vše zachycené písemně.',
  url: 'https://smlouvahned.cz/blog/predani-vozidla-kupujicimu-2026',
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
      name: 'Jak správně předat vozidlo kupujícímu 2026',
      item: 'https://smlouvahned.cz/blog/predani-vozidla-kupujicimu-2026',
    },
  ],
};

export default function PredaniVozidlaKupujicimu2026Page() {
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
        readTime="7 min"
        dateTime="2026-04-06"
        dateLabel="6. dubna 2026"
        breadcrumbLabel="Předání vozidla kupujícímu 2026"
        title="Jak správně předat vozidlo kupujícímu: Protokol, klíče, doklady a stav vozu"
        intro="Kupní smlouva na vozidlo řeší právní základ převodu. Samotné předání auta ale bývá stejně důležité. Právě v tomto okamžiku se potvrzuje stav vozu, počet klíčů, předané doklady i příslušenství."
        toc={[
          { href: '#proc-predani-sepsat', label: 'Proč zachytit předání vozidla samostatně' },
          { href: '#co-predat', label: 'Co předat spolu s vozidlem' },
          { href: '#predavaci-protokol', label: 'Co má obsahovat předávací protokol k vozidlu' },
          { href: '#kdy-zvolit-balicek', label: 'Kdy stačí smlouva a kdy je praktičtější balíček' },
        ]}
        primaryAction={{
          title: 'Řešíte převod vozidla jako celek?',
          body: 'Situační stránka pro prodej vozidla pomůže rozlišit, kdy stačí samotná kupní smlouva, kdy dává smysl širší varianta a kdy je praktičtější tematický balíček.',
          buttonLabel: 'Zobrazit podklady pro prodej vozidla',
          href: '/prodej-vozidla',
        }}
        trustBox={{
          generatorSuitable:
            'Standardní převod vozidla mezi dvěma stranami, které se shodly na ceně a chtějí přehledně zachytit smlouvu i předání.',
          lawyerSuitable:
            'Sporný technický stav, zatajované vady, exekuce, zástavy, leasing nebo situace, kdy se strany neshodnou na rozsahu odpovědnosti za vady.',
        }}
        finalAction={{
          title: 'Potřebujete vedle smlouvy i podklady k předání?',
          body: 'Balíček pro prodej vozidla navazuje na kupní smlouvu v komplexní variantě a doplňuje ji o předávací protokol, potvrzení o převzetí a praktické podklady k převodu.',
          buttonLabel: 'Otevřít balíček pro prodej vozidla',
          href: '/balicek-prodej-vozidla',
        }}
        relatedLinks={[
          { href: '/prodej-vozidla', label: 'Podklady pro prodej vozidla' },
          { href: '/balicek-prodej-vozidla', label: 'Balíček pro prodej vozidla' },
          { href: '/auto', label: 'Kupní smlouva na vozidlo' },
          { href: '/blog/doklady-pri-prodeji-auta-2026', label: 'Jaké doklady předat při prodeji auta' },
        ]}
      >
        <section id="proc-predani-sepsat" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Proč zachytit předání vozidla samostatně</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Pokud se po podpisu smlouvy objeví spor, bývá důležité vědět nejen to, co bylo ve smlouvě, ale i v jakém stavu bylo auto skutečně předáno. U ojetých vozů se to týká hlavně tachometru, viditelných vad, výbavy a dokladů.
          </p>
          <p className="leading-relaxed text-slate-400">
            Samostatný podklad k předání pomáhá oběma stranám. Prodávající může doložit, v jakém stavu vozidlo předal, a kupující má jasně zachyceno, co všechno převzal.
          </p>
        </section>

        <section id="co-predat" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co předat spolu s vozidlem</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Klíče a ovladače', 'Počet klíčů, dálkových ovladačů, servisních klíčů nebo zabezpečovacích prvků.'],
              ['Doklady', 'Technické doklady, protokoly k STK nebo dalším kontrolám, servisní knížka a další relevantní podklady.'],
              ['Příslušenství', 'Náhradní kola, povinná výbava, nabíječka, střešní nosiče nebo další předávané vybavení.'],
              ['Stav vozidla', 'Stav tachometru, viditelné vady, poškození karoserie nebo interiéru a další důležité poznámky.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
                <div className="mb-1 text-sm font-black text-white">{title}</div>
                <p className="text-sm leading-7 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="predavaci-protokol" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Co má obsahovat předávací protokol k vozidlu</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            V běžné situaci dává smysl, aby protokol navazoval na kupní smlouvu a obsahoval minimálně identifikaci vozidla, datum předání, stav tachometru, výčet předaných klíčů a dokladů a prostor pro podpis obou stran.
          </p>
          <p className="leading-relaxed text-slate-400">
            Užitečné bývá doplnit i stručný popis zjevného stavu vozidla. Ne proto, aby se vytvářel rozsáhlý znalecký dokument, ale aby bylo jasné, co bylo při předání zjevné a co bylo součástí dohody.
          </p>
        </section>

        <section id="kdy-zvolit-balicek" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Kdy stačí smlouva a kdy je praktičtější balíček</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Pokud řešíte jednoduchý převod a stačí vám samotná kupní smlouva, dává smysl zůstat u samostatného dokumentu. Pokud ale chcete vedle smlouvy i podklady k fyzickému předání auta a dokladů, bývá praktičtější zvolit tematický balíček.
          </p>
          <p className="leading-relaxed text-slate-400">
            Tematický balíček na SmlouvaHned není jiný typ služby. Je to širší standardizované řešení pro běžný převod vozidla, kdy vedle samotné smlouvy řešíte i praktickou stránku předání.
          </p>
        </section>
      </ArticlePageLayout>
    </>
  );
}
