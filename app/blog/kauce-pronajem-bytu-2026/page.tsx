import type { Metadata } from 'next';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata: Metadata = {
  title: 'Kauce při pronájmu bytu 2026: Jak ji správně sjednat a potvrdit',
  description:
    'Praktický průvodce k jistotě při pronájmu bytu. Kdy se používá, co uvést do nájemní smlouvy, jak potvrdit převzetí kauce a kdy ji po skončení nájmu vracet.',
  alternates: {
    canonical: 'https://smlouvahned.cz/blog/kauce-pronajem-bytu-2026',
  },
  openGraph: {
    title: 'Kauce při pronájmu bytu 2026',
    description:
      'Jak pracovat s kaucí při pronájmu bytu, co zachytit do smlouvy a kdy je vhodné mít i potvrzení o převzetí kauce.',
    url: 'https://smlouvahned.cz/blog/kauce-pronajem-bytu-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Kauce při pronájmu bytu 2026: Jak ji správně sjednat a potvrdit',
  description:
    'Praktický průvodce k jistotě při pronájmu bytu. Kdy se používá, co uvést do nájemní smlouvy, jak potvrdit převzetí kauce a kdy ji po skončení nájmu vracet.',
  url: 'https://smlouvahned.cz/blog/kauce-pronajem-bytu-2026',
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
      name: 'Kauce při pronájmu bytu 2026',
      item: 'https://smlouvahned.cz/blog/kauce-pronajem-bytu-2026',
    },
  ],
};

export default function KaucePronajemBytu2026Page() {
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
        breadcrumbLabel="Kauce při pronájmu bytu 2026"
        title="Kauce při pronájmu bytu: Jak ji správně sjednat a potvrdit"
        intro="Kauce, správně jistota, patří mezi nejčastější body nájemní smlouvy. Nejasně sjednaná jistota ale vede k častým sporům: kdy byla uhrazena, v jaké výši, za jakých podmínek se vrací a co z ní lze započíst."
        toc={[
          { href: '#co-je-jistota', label: 'Co je jistota a k čemu slouží' },
          { href: '#co-dat-do-smlouvy', label: 'Co uvést do nájemní smlouvy' },
          { href: '#potvrzeni-o-prevzeti', label: 'Proč mít potvrzení o převzetí kauce' },
          { href: '#vraceni-kauce', label: 'Jak přemýšlet o vrácení jistoty' },
        ]}
        primaryAction={{
          title: 'Řešíte nájem i s kaucí a předáním bytu?',
          body: 'Na orientační stránce pro pronajímatele uvidíte, kdy stačí samostatná smlouva a kdy je praktičtější balíček s potvrzením o převzetí kauce a dalšími podklady.',
          buttonLabel: 'Zobrazit dokumenty pro pronajímatele',
          href: '/pro-pronajimatele',
        }}
        trustBox={{
          generatorSuitable:
            'Běžný pronájem bytu nebo domu, kdy potřebujete jasně sjednat jistotu, podmínky jejího použití a písemně potvrdit její převzetí.',
          lawyerSuitable:
            'Nestandardní režimy plateb, složité započtení více pohledávek, spory o výši škody nebo jiné situace, kde už existuje konflikt mezi stranami.',
        }}
        finalAction={{
          title: 'Chcete připravit nájem i s navazujícími podklady?',
          body: 'Balíček pro pronajímatele vedle nájemní smlouvy obsahuje také potvrzení o převzetí kauce a další podklady k předání bytu.',
          buttonLabel: 'Otevřít balíček pro pronajímatele',
          href: '/balicek-pronajimatel',
        }}
        relatedLinks={[
          { href: '/pro-pronajimatele', label: 'Dokumenty pro pronajímatele' },
          { href: '/balicek-pronajimatel', label: 'Balíček pro pronajímatele' },
          { href: '/najem', label: 'Nájemní smlouva' },
          { href: '/blog/predani-bytu-najemci-2026', label: 'Jak správně předat byt nájemci' },
        ]}
      >
        <section id="co-je-jistota" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co je jistota a k čemu slouží</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Jistota slouží jako zajištění povinností nájemce. V běžné situaci kryje zejména dlužné nájemné, nedoplatky na službách nebo škody, které vzniknou v souvislosti s užíváním bytu.
          </p>
          <p className="leading-relaxed text-slate-400">
            Sama existence jistoty ale nestačí. Pokud není v nájemní smlouvě jasně zachyceno, v jaké výši byla složena a jak se s ní bude pracovat po skončení nájmu, může být její použití zdrojem zbytečných sporů.
          </p>
        </section>

        <section id="co-dat-do-smlouvy" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co uvést do nájemní smlouvy</h2>
          <ul className="space-y-3 text-slate-400">
            {[
              'výši jistoty a kdy má být uhrazena',
              'způsob úhrady, pokud je důležité rozlišit převod a hotovost',
              'na jaké pohledávky lze jistotu použít',
              'kdy a za jakých podmínek se vrací po skončení nájmu',
              'zda bude případné započtení doloženo vyúčtováním nebo jiným přehledem',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 text-amber-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 leading-relaxed text-slate-400">
            Pro běžnou situaci není třeba komplikovaná konstrukce. Důležité je, aby smlouva byla dostatečně konkrétní a později nevznikala pochybnost, jak s jistotou naložit.
          </p>
        </section>

        <section id="potvrzeni-o-prevzeti" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Proč mít potvrzení o převzetí kauce</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Pokud je jistota placena odděleně od podpisu smlouvy nebo v hotovosti, bývá praktické mít samostatné potvrzení o převzetí kauce. V běžném pronájmu tím zjednodušíte dokazování, že částka byla opravdu převzata a v jaké výši.
          </p>
          <p className="leading-relaxed text-slate-400">
            Samostatné potvrzení neznamená složitější proces. Naopak pomáhá udržet čistý přehled o tom, kdy nájemce jistotu složil a kdy má být při skončení nájmu vrácena nebo započtena.
          </p>
        </section>

        <section id="vraceni-kauce" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Jak přemýšlet o vrácení jistoty</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Po skončení nájmu bývá klíčové mít přehledně zachycený stav bytu, případné škody a vyúčtování služeb. Právě proto spolu otázka kauce úzce souvisí s předávacím protokolem a se stavem bytu při odevzdání.
          </p>
          <p className="leading-relaxed text-slate-400">
            Pokud řešíte celý proces od podpisu smlouvy po předání bytu a práci s jistotou, bývá praktičtější připravit si více navazujících podkladů najednou. Ušetří to hlavně zmatky, ne právní riziko „na papíře“.
          </p>
        </section>
      </ArticlePageLayout>
    </>
  );
}
