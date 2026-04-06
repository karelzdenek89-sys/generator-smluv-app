import type { Metadata } from 'next';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata: Metadata = {
  title: 'Přepis vozidla 2026: Na co si dát pozor po podpisu kupní smlouvy',
  description:
    'Praktický přehled kroků po podpisu kupní smlouvy na vozidlo. Jak přemýšlet o přepisu, proč je důležité mít jasné předání a jaké podklady se hodí připravit předem.',
  alternates: {
    canonical: 'https://smlouvahned.cz/blog/prepis-vozidla-2026',
  },
  openGraph: {
    title: 'Přepis vozidla 2026',
    description:
      'Co řešit po podpisu kupní smlouvy na vozidlo, jak navázat předání auta na další kroky a proč mít podklady zachycené přehledně.',
    url: 'https://smlouvahned.cz/blog/prepis-vozidla-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Přepis vozidla 2026: Na co si dát pozor po podpisu kupní smlouvy',
  description:
    'Praktický přehled kroků po podpisu kupní smlouvy na vozidlo. Jak přemýšlet o přepisu, proč je důležité mít jasné předání a jaké podklady se hodí připravit předem.',
  url: 'https://smlouvahned.cz/blog/prepis-vozidla-2026',
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
      name: 'Přepis vozidla 2026',
      item: 'https://smlouvahned.cz/blog/prepis-vozidla-2026',
    },
  ],
};

export default function PrepisVozidla2026Page() {
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
        breadcrumbLabel="Přepis vozidla 2026"
        title="Přepis vozidla: Na co si dát pozor po podpisu kupní smlouvy"
        intro="Podpis kupní smlouvy není poslední krok. U běžného převodu vozidla bývá praktické promyslet i návaznost na předání auta, klíčů, dokladů a další administrativní kroky, aby mezi stranami nevznikl zmatek."
        toc={[
          { href: '#co-nasleduje', label: 'Co obvykle následuje po podpisu smlouvy' },
          { href: '#proc-resit-predani', label: 'Proč řešit předání ještě před přepisem' },
          { href: '#jak-se-vyhnout-zmatku', label: 'Jak se vyhnout zmatku mezi prodávajícím a kupujícím' },
          { href: '#jaky-produkt-zvolit', label: 'Jakou cestu v produktu zvolit' },
        ]}
        primaryAction={{
          title: 'Potřebujete převod řešit přehledně od podpisu po předání?',
          body: 'Situační stránka pro prodej vozidla pomůže rozlišit, kdy stačí samostatná kupní smlouva a kdy už je praktičtější širší řešení s navazujícími podklady.',
          buttonLabel: 'Zobrazit podklady pro prodej vozidla',
          href: '/prodej-vozidla',
        }}
        trustBox={{
          generatorSuitable:
            'Běžný převod vozidla, kdy chcete mít jasno, co se děje po podpisu smlouvy a jak na něj navázat přehledným předáním auta a dokladů.',
          lawyerSuitable:
            'Spor o vlastnictví, technický stav, nevyřešené závazky k vozidlu nebo jiné nestandardní okolnosti převodu.',
        }}
        finalAction={{
          title: 'Chcete mít vedle smlouvy i podklady k předání?',
          body: 'Balíček pro prodej vozidla spojuje kupní smlouvu v komplexní variantě s předávacím protokolem a potvrzením o převzetí klíčů a dokladů.',
          buttonLabel: 'Otevřít balíček pro prodej vozidla',
          href: '/balicek-prodej-vozidla',
        }}
        relatedLinks={[
          { href: '/prodej-vozidla', label: 'Podklady pro prodej vozidla' },
          { href: '/auto', label: 'Kupní smlouva na vozidlo' },
          { href: '/balicek-prodej-vozidla', label: 'Balíček pro prodej vozidla' },
          { href: '/blog/predani-vozidla-kupujicimu-2026', label: 'Jak správně předat vozidlo kupujícímu' },
        ]}
      >
        <section id="co-nasleduje" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co obvykle následuje po podpisu smlouvy</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Po podpisu kupní smlouvy se v běžné situaci řeší hlavně fyzické předání vozidla, klíčů, dokladů a návazné administrativní kroky. To je chvíle, kdy je důležité, aby obě strany měly jasno, co už bylo provedeno a co ještě následuje.
          </p>
          <p className="leading-relaxed text-slate-400">
            I když se strany dohodnou ústně, je praktičtější tyto kroky zachytit přehledně v návaznosti na smlouvu. Pomáhá to omezit pozdější nejasnosti.
          </p>
        </section>

        <section id="proc-resit-predani" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Proč řešit předání ještě před přepisem</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Předání vozidla a přepis spolu souvisejí, ale nejsou to totožné kroky. Pokud není dobře zachyceno, v jakém stavu bylo auto předáno a jaké doklady přešly na kupujícího, může být později obtížné doložit, co už proběhlo a co ne.
          </p>
          <p className="leading-relaxed text-slate-400">
            V běžném převodu je proto vhodné propojit kupní smlouvu s předávacím protokolem a navazujícím potvrzením o převzetí vozidla a dokladů.
          </p>
        </section>

        <section id="jak-se-vyhnout-zmatku" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Jak se vyhnout zmatku mezi prodávajícím a kupujícím</h2>
          <ul className="space-y-3 text-slate-400">
            {[
              'jasně odlišit podpis smlouvy od samotného předání vozidla',
              'zachytit stav tachometru a viditelný stav vozu při předání',
              'písemně potvrdit, jaké doklady a klíče byly předány',
              'mít přehled o tom, které kroky ještě po podpisu následují',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 text-amber-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="jaky-produkt-zvolit" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Jakou cestu v produktu zvolit</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Pokud řešíte jen samotnou kupní smlouvu, může být dostačující samostatný dokument. Pokud ale vedle smlouvy chcete i podklady k předání auta a dokladů, bývá praktičtější sáhnout po širším řešení.
          </p>
          <p className="leading-relaxed text-slate-400">
            Tematický balíček pro prodej vozidla je určen právě pro tuto běžnou situaci. Nejde o jiný typ právní služby, ale o širší standardizovaný výstup s navazujícími podklady.
          </p>
        </section>
      </ArticlePageLayout>
    </>
  );
}
