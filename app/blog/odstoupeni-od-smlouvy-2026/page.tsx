import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import { getBlogHreflangAlternates } from '@/lib/seo/blog-hreflang-clusters';
import { canonicalUrl } from '@/lib/seo/site';

const SLUG = 'odstoupeni-od-smlouvy-2026';

export const metadata = {
  ...blogArticlePageMetadata(SLUG),
  alternates: {
    canonical: canonicalUrl(`/blog/${SLUG}`),
    languages: getBlogHreflangAlternates(SLUG),
  },
};

export default function OdstoupeniOdSmlouvyPage() {
  return (
    <ArticlePageLayout
      category="Obecné a praktické"
      readTime="9 min"
      dateTime="2026-07-29"
      dateLabel="29. července 2026"
      breadcrumbLabel="Odstoupení od smlouvy 2026"
      slug="odstoupeni-od-smlouvy-2026"
      title="Odstoupení od smlouvy 2026: kdy lze odstoupit a jaké to má důsledky"
      intro="Podepsanou smlouvu nelze zrušit jen proto, že si to jedna strana rozmyslela. Občanský zákoník umožňuje odstoupení jen tam, kde si ho strany ujednaly nebo kde ho stanoví zákon. Zvlášť častým omylem je představa, že na vše platí 14denní lhůta — ta se ale týká jen určitých spotřebitelských smluv. Přehled vychází z § 2001 a násl. a z § 1829 občanského zákoníku."
      toc={[
        { href: '#tri-zpusoby', label: 'Odstoupení, výpověď a dohoda' },
        { href: '#kdy-lze', label: 'Kdy lze od smlouvy odstoupit' },
        { href: '#dusledky', label: 'Jaké má odstoupení důsledky' },
        { href: '#spotrebitel-14-dni', label: 'Spotřebitelských 14 dní (§ 1829)' },
        { href: '#jak-osetrit', label: 'Jak odstoupení ošetřit ve smlouvě' },
      ]}
      primaryAction={{
        title: 'Připravujete smlouvu?',
        body: 'Ve formuláři nastavíte předmět, cenu, platby i podmínky odstoupení tak, aby bylo předem jasné, kdy a jak lze závazek ukončit.',
        buttonLabel: 'Vytvořit kupní smlouvu',
        href: '/kupni',
      }}
      trustBox={{
        generatorSuitable:
          'Standardní smlouva mezi dvěma stranami, které se dohodly na základních podmínkách a chtějí předem srozumitelně upravit i důvody odstoupení.',
        lawyerSuitable:
          'Spor o platnost odstoupení, odstoupení u transakce vyšší hodnoty nebo situace, kdy druhá strana odstoupení neuznává a hrozí soudní řešení.',
      }}
      finalAction={{
        title: 'Chcete mít podmínky odstoupení srozumitelně ve smlouvě?',
        body: 'Vyplňte smlouvu online a nastavte předmět, platby i důvody, pro které lze od smlouvy odstoupit.',
        buttonLabel: 'Otevřít formulář kupní smlouvy',
        href: '/kupni',
      }}
      relatedLinks={[
        { href: '/kupni', label: 'Kupní smlouva - formulář online' },
        { href: '/blog/smluvni-pokuta-vzor-2026', label: 'Smluvní pokuta' },
        { href: '/blog/uznani-dluhu-2026', label: 'Uznání dluhu' },
        { href: '/blog/kupni-smlouva-movita-vec', label: 'Kupní smlouva na movitou věc' },
      ]}
    >
      <section id="tri-zpusoby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Odstoupení, výpověď a dohoda nejsou totéž</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Ukončit závazek lze více způsoby a je dobré je nezaměňovat. Odstoupení míří na situace, kdy něco
          selhalo (například podstatné porušení smlouvy) nebo kdy to smlouva výslovně dovoluje. Výpověď
          typicky ukončuje trvající vztah do budoucna. Dohoda o zrušení je společný projev vůle obou stran.
        </p>
        <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5 text-sm leading-7 text-slate-400">
          <ul className="space-y-2">
            <li>• <strong className="text-slate-300">Odstoupení</strong> — jednostranné, jen ze zákona nebo z ujednání; ruší závazek zpravidla od počátku.</li>
            <li>• <strong className="text-slate-300">Výpověď</strong> — ukončuje trvající vztah do budoucna, často s výpovědní dobou.</li>
            <li>• <strong className="text-slate-300">Dohoda</strong> — obě strany se shodnou na zrušení a jeho podmínkách.</li>
          </ul>
        </div>
      </section>

      <section id="kdy-lze" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Kdy lze od smlouvy odstoupit</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Podle § 2001 občanského zákoníku lze od smlouvy odstoupit, jen ujednají-li si to strany, nebo
          stanoví-li tak zákon. Neexistuje tedy obecné právo „vycouvat" z podepsané smlouvy bez důvodu.
        </p>
        <p className="leading-relaxed text-slate-400">
          Typickým zákonným důvodem je podstatné porušení smlouvy druhou stranou (§ 2002) — třeba když
          prodávající nedodá věc nebo kupující nezaplatí. Vedle toho si strany mohou ve smlouvě ujednat
          vlastní důvody odstoupení (například prodlení delší než stanovený počet dnů). Právě proto je
          užitečné mít důvody odstoupení výslovně napsané.
        </p>
      </section>

      <section id="dusledky" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Jaké má odstoupení důsledky</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Odstoupením od smlouvy se závazek podle § 2004 odst. 1 zrušuje od počátku. Strany si zpravidla
          vrátí, co si už plnily — kupující vrátí věc, prodávající peníze. Tím se odstoupení liší od výpovědi,
          po které už poskytnutá plnění obvykle zůstávají.
        </p>
        <p className="leading-relaxed text-slate-400">
          Odstoupení se nedotýká práva na zaplacení smluvní pokuty ani na náhradu škody způsobené porušením
          smlouvy. Účinné je zpravidla dojitím projevu vůle druhé straně, proto je vhodné je učinit písemně a
          umět doložit jeho doručení.
        </p>
      </section>

      <ArticleInlineCta
        title="Nastavte důvody odstoupení předem"
        body="Ve formuláři smlouvy určíte předmět, platby i podmínky, za kterých lze od smlouvy odstoupit."
        buttonLabel="Pokračovat ke smlouvě"
        href="/kupni"
        variant="subtle"
        articleSlug="odstoupeni-od-smlouvy-2026"
      />

      <section id="spotrebitel-14-dni" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Spotřebitelských 14 dní platí jen někdy</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Právo odstoupit do 14 dnů bez udání důvodu podle § 1829 občanského zákoníku se vztahuje na
          spotřebitele u smluv uzavřených distančně (e-shop, telefon) nebo mimo obchodní prostory (podomní
          prodej, předváděcí akce). Neplatí tedy pro běžnou smlouvu mezi dvěma soukromými osobami uzavřenou
          osobně ani pro vztahy mezi podnikateli.
        </p>
        <ul className="space-y-3 text-slate-400">
          {[
            'Lhůta 14 dní běží zpravidla od převzetí zboží; u nevyžádané návštěvy nebo předváděcí akce je prodloužena na 30 dní.',
            'Zákon zná výjimky, kdy nelze odstoupit — například zboží upravené na míru (§ 1837).',
            'Po odstoupení spotřebitel zboží vrátí a prodejce vrátí přijaté peníze.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1 text-amber-500">•</span><span>{item}</span></li>
          ))}
        </ul>
      </section>

      <section id="jak-osetrit" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Jak odstoupení ošetřit ve smlouvě</h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Jsou ve smlouvě uvedeny konkrétní důvody, pro které lze odstoupit?',
            'Je jasná forma odstoupení (písemně) a komu a kam se doručuje?',
            'Je zřejmé, co se po odstoupení vrací a v jaké lhůtě?',
            'Zůstává zachováno právo na smluvní pokutu a náhradu škody?',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1 text-amber-500">•</span><span>{item}</span></li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-slate-500">
          Zdroj: <a className="text-amber-400 hover:text-amber-300" href="https://www.zakonyprolidi.cz/cs/2012-89" target="_blank" rel="noreferrer">§ 2001–2005 a § 1829 zákona č. 89/2012 Sb., občanský zákoník</a>; k spotřebitelskému odstoupení viz též <a className="text-amber-400 hover:text-amber-300" href="https://www.coi.cz" target="_blank" rel="noreferrer">Česká obchodní inspekce (coi.cz)</a>.
        </p>
      </section>
    </ArticlePageLayout>
  );
}
