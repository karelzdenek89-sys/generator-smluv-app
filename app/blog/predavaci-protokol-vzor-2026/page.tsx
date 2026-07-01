import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata = blogArticlePageMetadata('predavaci-protokol-vzor-2026');

export default function PredavaciProtokolVzor2026Page() {
  return (
    <ArticlePageLayout
      category="Obecné a praktické"
      readTime="8 min"
      dateTime="2026-07-01"
      dateLabel="1. července 2026"
      breadcrumbLabel="Předávací protokol 2026"
      slug="predavaci-protokol-vzor-2026"
      title="Předávací protokol 2026: Co musí obsahovat a proč nestačí jen podpis smlouvy"
      intro="Předávací protokol zachycuje okamžik, kdy se věc nebo prostor skutečně předává druhé straně. Smlouva stanoví práva a povinnosti, protokol dokládá, v jakém stavu a s čím předání proběhlo. Bez něj bývá obtížné řešit spory o poškození, chybějící vybavení nebo nepředané doklady."
      toc={[
        { href: '#co-je', label: 'Co je předávací protokol' },
        { href: '#kdy-pouzit', label: 'Kdy ho použít' },
        { href: '#co-obsahuje', label: 'Co protokol obsahuje' },
        { href: '#pronajem-auto', label: 'Pronájem bytu vs. prodej auta' },
        { href: '#chyby', label: 'Nejčastější chyby' },
      ]}
      primaryAction={{
        title: 'Pronajímáte byt?',
        body: 'Nájemní smlouva v generátoru pokrývá předání bytu, kauci a předávací protokol v jednom postupu.',
        buttonLabel: 'Vytvořit nájemní smlouvu',
        href: '/najem',
      }}
      trustBox={{
        generatorSuitable:
          'Standardní předání bytu nájemci, prodej vozidla, předání movité věci nebo vybavení — situace, kde chcete mít stav a seznam předaných věcí písemně.',
        lawyerSuitable:
          'Spory o rozsáhlé škody, nefunkční zařízení s vysokou hodnotou, nebo předání s právními vadami, které vyžadují odborné posouzení.',
      }}
      finalAction={{
        title: 'Prodáváte nebo kupujete vozidlo?',
        body: 'Kupní smlouva na auto zachytí VIN, stav tachometru, předání vozidla a dokladů — protokol navazuje na smlouvu.',
        buttonLabel: 'Vytvořit kupní smlouvu na auto',
        href: '/auto',
      }}
      relatedLinks={[
        { href: '/najem', label: 'Nájemní smlouva — formulář' },
        { href: '/auto', label: 'Kupní smlouva na auto — formulář' },
        { href: '/blog/predani-bytu-najemci-2026', label: 'Předání bytu nájemci' },
        { href: '/blog/predani-vozidla-kupujicimu-2026', label: 'Předání vozidla kupujícímu' },
        { href: '/blog/kauce-pronajem-bytu-2026', label: 'Kauce při pronájmu' },
      ]}
    >
      <section id="co-je" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co je předávací protokol</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Předávací protokol je písemný záznam o předání věci, prostoru nebo dokladů. Doplňuje
          hlavní smlouvu — ne nahrazuje ji. Typicky obsahuje datum, místo, identifikaci stran,
          popis stavu a seznam toho, co bylo předáno.
        </p>
        <p className="leading-relaxed text-slate-400">
          U nájmu bytu jde o stav bytu, měřidla, klíče a vybavení. U prodeje auta o stav vozu,
          tachometr, klíče, technický průkaz a servisní dokumentaci.
        </p>
      </section>

      <section id="kdy-pouzit" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Kdy ho použít</h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Při předání bytu nájemci — ideálně společně s podpisem nájemní smlouvy nebo bezprostředně po něm.',
            'Při prodeji vozidla — v den podpisu kupní smlouvy nebo při fyzickém předání auta.',
            'Při vrácení bytu po skončení nájmu — protokol funguje i opačným směrem.',
            'Při předání movité věci nebo zařízení — například při prodeji elektroniky nebo nábytku.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="co-obsahuje" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Co protokol obsahuje</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ['Identifikace', 'Strany, adresa nebo VIN vozidla, datum a místo předání.'],
            ['Stav', 'Popis viditelného stavu, fotodokumentace, stav měřidel nebo tachometru.'],
            ['Seznam věcí', 'Klíče, dálkové ovladače, doklady, vybavení bytu, příslušenství auta.'],
            ['Vady a výhrady', 'Známé nedostatky, na kterých se strany dohodly — bez skrytí.'],
            ['Podpisy', 'Podpisy obou stran potvrzující, že protokol odpovídá skutečnosti.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{title}</div>
              <p className="text-sm leading-7 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pronajem-auto" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          4. Pronájem bytu vs. prodej auta
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          U pronájmu bytu protokol často navazuje na kauci — stav bytu při předání ovlivňuje, zda
          a v jaké výši bude kauce vrácena. Odečty měřidel (elektřina, voda, plyn) by měly být
          součástí protokolu nebo jeho přílohy.
        </p>
        <p className="leading-relaxed text-slate-400">
          U auta protokol doplňuje kupní smlouvu o okamžik fyzického předání. Prodávající tak
          může prokázat, v jakém stavu vozidlo předal, a kupující, jaké doklady a klíče obdržel.
        </p>
      </section>

      <section id="chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Nejčastější chyby</h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Pouze ústní dohoda bez písemného záznamu stavu.',
            'Chybějící fotodokumentace u viditelných vad nebo poškození.',
            'Neúplný seznam klíčů, dálkových ovladačů nebo dokladů.',
            'Protokol bez podpisů obou stran.',
            'Záměna protokolu se samotnou smlouvou — protokol sám o sobě neřeší cenu ani nájem.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </ArticlePageLayout>
  );
}
