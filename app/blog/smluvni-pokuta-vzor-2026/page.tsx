import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata = blogArticlePageMetadata('smluvni-pokuta-vzor-2026');

export default function SmluvniPokutaVzor2026Page() {
  return (
    <ArticlePageLayout
      category="Obecné a praktické"
      readTime="7 min"
      dateTime="2026-07-01"
      dateLabel="1. července 2026"
      breadcrumbLabel="Smluvní pokuta 2026"
      slug="smluvni-pokuta-vzor-2026"
      title="Smluvní pokuta 2026: Jak ji sjednat ve smlouvě a kdy může být neplatná"
      intro="Smluvní pokuta je předem sjednaná částka, kterou dlužník zaplatí při porušení smlouvy — typicky při prodlení s platbou, předčasném ukončení nájmu nebo neoprávněném užívání bytu. Musí být sjednána písemně a v přiměřené výši. Tento průvodce vysvětluje praktické použití v roce 2026."
      toc={[
        { href: '#co-je', label: 'Co je smluvní pokuta' },
        { href: '#odskodne', label: 'Rozdíl oproti náhradě škody' },
        { href: '#najem', label: 'Smluvní pokuta v nájemní smlouvě' },
        { href: '#formulace', label: 'Jak pokutu formulovat' },
        { href: '#neplatnost', label: 'Kdy může být neplatná' },
      ]}
      primaryAction={{
        title: 'Pronajímáte byt a chcete ošetřit porušení smlouvy?',
        body: 'Rozšířená nájemní smlouva SmlouvaHned umožňuje sjednat smluvní pokutu za prodlení s nájmem nebo jiné porušení povinností.',
        buttonLabel: 'Vytvořit nájemní smlouvu',
        href: '/najem',
      }}
      trustBox={{
        generatorSuitable:
          'Standardní nájem bytu, smlouva o dílo nebo jiná smlouva, kde strany chtějí předem sjednat důsledky porušení — prodlení, předčasné ukončení, neoprávněné užívání.',
        lawyerSuitable:
          'Vysoké pokuty u spotřebitelských smluv, spory o nepřiměřenost pokuty, komerční nájmy s individuálními podmínkami.',
      }}
      finalAction={{
        title: 'Chcete smluvní pokutu přímo ve smlouvě?',
        body: 'Rozšířená nájemní smlouva umožňuje sjednat pokutu za prodlení s nájmem nebo jiné porušení povinností.',
        buttonLabel: 'Vytvořit nájemní smlouvu',
        href: '/najem',
      }}
      relatedLinks={[
        { href: '/najem', label: 'Nájemní smlouva' },
        { href: '/blog/najemni-smlouva-vzor-2026', label: 'Nájemní smlouva 2026' },
        { href: '/blog/vypoved-z-najmu-bytu-2026', label: 'Výpověď z nájmu' },
        { href: '/blog/kauce-pronajem-bytu-2026', label: 'Kauce při pronájmu' },
        { href: '/blog/chyby-pri-pronajmu-bytu-2026', label: 'Chyby při pronájmu' },
      ]}
    >
      <section id="co-je" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co je smluvní pokuta</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Smluvní pokuta (§ 2048 a násl. OZ) je peněžité plnění, které dlužník poskytne věřiteli
          při porušení smluvní povinnosti. Strany si ji sjednají předem — typicky ve smlouvě
          samotné. Nemusí se prokazovat výše skutečné škody, stačí porušení sjednané podmínky.
        </p>
        <p className="leading-relaxed text-slate-400">
          Pokuta motivuje strany k dodržení smlouvy a zjednodušuje vymáhání — věřitel nemusí
          dokazovat konkrétní výši újmy.
        </p>
      </section>

      <section id="odskodne" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          2. Rozdíl oproti náhradě škody
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            [
              'Smluvní pokuta',
              'Předem sjednaná pevná nebo odstupňovaná částka. Věřitel nemusí prokazovat výši škody — stačí porušení povinnosti.',
            ],
            [
              'Náhrada škody',
              'Kompenzace skutečné újmy. Poškozený musí prokázat vznik škody, její výši a příčinnou souvislost s porušením.',
            ],
          ].map(([title, text]) => (
            <div key={title} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{title}</div>
              <p className="text-sm leading-7 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 leading-relaxed text-slate-400">
          Strany si mohou sjednat, že smluvní pokuta nevylučuje náhradu škody převyšující její
          výši — nebo naopak, že pokuta je jediným nárokem. Důležité je to výslovně uvést.
        </p>
      </section>

      <section id="najem" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Smluvní pokuta v nájemní smlouvě
        </h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Prodlení s platbou nájmu — pokuta za každý den nebo měsíc prodlení.',
            'Předčasné ukončení nájmu nájemcem — pokuta za porušení sjednané doby nájmu.',
            'Neoprávněné podnájmy nebo užívání bytu jinak než k bydlení.',
            'Poškození bytu nad rámec běžného opotřebení.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 leading-relaxed text-slate-400">
          U nájmu bytu mezi fyzickými osobami je pokuta běžná u prodlení s nájmem. Výše by měla
          být přiměřená — soud může nepřiměřenou pokutu snížit.
        </p>
      </section>

      <section id="formulace" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Jak pokutu formulovat</h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Uveďte konkrétní porušení, ke kterému se pokuta vztahuje.',
            'Stanovte výši — pevnou částku nebo procento z nájmu / ceny.',
            'Určete, zda jde o pokutu za každý den prodlení nebo jednorázovou.',
            'Vyjádřete, zda pokuta vylučuje nebo nevylučuje náhradu škody nad její rámec.',
            'Dbejte na srozumitelnost — vágní formulace vede ke sporům.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="neplatnost" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Kdy může být neplatná</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Soud může smluvní pokutu snížit, pokud je zjevně nepřiměřená (§ 2050 OZ). U
          spotřebitelských smluv platí přísnější pravidla — zneužívající ujednání mohou být
          neplatná dle § 1813 OZ.
        </p>
        <p className="leading-relaxed text-slate-400">
          Pokuta musí být sjednána písemně. Ústní domluva o pokutě u nájemní smlouvy nemá
          právní účinky. U B2B smluv je větší prostor pro vyšší pokuty, ale i tam platí
          požadavek přiměřenosti.
        </p>
      </section>
    </ArticlePageLayout>
  );
}
