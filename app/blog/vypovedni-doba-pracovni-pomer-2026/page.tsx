import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import OfficialSources from '@/app/components/blog/OfficialSources';
import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import { getBlogHreflangAlternates } from '@/lib/seo/blog-hreflang-clusters';
import { canonicalUrl } from '@/lib/seo/site';

const SLUG = 'vypovedni-doba-pracovni-pomer-2026';

export const metadata = {
  ...blogArticlePageMetadata(SLUG, {
    keywords: [
      'výpovědní doba 2026',
      'kdy začíná výpovědní doba',
      'výpověď pracovní poměr',
      'flexinovela výpovědní doba',
    ],
  }),
  alternates: {
    canonical: canonicalUrl(`/blog/${SLUG}`),
    languages: getBlogHreflangAlternates(SLUG),
  },
};

export default function VypovedniDobaPage() {
  return (
    <ArticlePageLayout
      category="Práce a zaměstnání"
      readTime="9 min"
      dateTime="2026-08-13"
      dateLabel="13. srpna 2026"
      breadcrumbLabel="Výpovědní doba 2026"
      slug={SLUG}
      title="Výpovědní doba 2026: kdy začíná a jak dlouho trvá"
      intro="U výpovědí doručených od 1. června 2025 už zákonná výpovědní doba zpravidla nezačíná až prvním dnem dalšího měsíce. Podle nové úpravy běží už ode dne doručení. Výsledek ale může ovlivnit konkrétní text pracovní smlouvy, zákonný výpovědní důvod i ochranná doba, proto přehled nenahrazuje posouzení skutečného ukončení pracovního poměru."
      toc={[
        { href: '#zacatek', label: 'Začátek a konec výpovědní doby' },
        { href: '#delka', label: 'Dva měsíce a jednoměsíční výjimky' },
        { href: '#starsi-smlouvy', label: 'Starší ujednání v pracovní smlouvě' },
        { href: '#forma', label: 'Forma, doručení a rizikové situace' },
      ]}
      primaryAction={{
        title: 'Nastavujete nový pracovní poměr?',
        body: 'Generátor je určen pro standardní pracovní smlouvu — nikoli pro posouzení nebo sepsání konkrétní výpovědi.',
        buttonLabel: 'Vytvořit pracovní smlouvu',
        href: '/pracovni',
      }}
      trustBox={{
        generatorSuitable:
          'Nový standardní pracovní poměr, kde je potřeba jasně zachytit druh a místo práce, den nástupu, odměňování a dobu trvání.',
        lawyerSuitable:
          'Skutečná výpověď, sporné doručení, ochranná doba, organizační změna, tvrzené porušení povinností nebo nejasné starší ujednání o běhu výpovědní doby.',
      }}
      finalAction={{
        title: 'Pro nový pracovní vztah používejte aktuální smlouvu',
        body: 'Ukončení už běžícího vztahu je samostatná právní situace. Generátor pomůže se standardní novou pracovní smlouvou, ne s výpovědí.',
        buttonLabel: 'Otevřít formulář pracovní smlouvy',
        href: '/pracovni',
      }}
      relatedLinks={[
        { href: '/pracovni', label: 'Pracovní smlouva online' },
        { href: '/blog/pracovni-smlouva-2026', label: 'Pracovní smlouva 2026' },
        { href: '/blog/flexinovela-zakoniku-prace-2026', label: 'Flexinovela zákoníku práce' },
        { href: '/blog/zkusebni-doba-2026', label: 'Zkušební doba 2026' },
      ]}
    >
      <section id="zacatek" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Výpovědní doba zpravidla začíná dnem doručení
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Podle § 51 zákoníku práce účinného od 1. června 2025 začíná výpovědní doba dnem, kdy byla
          výpověď doručena druhé straně. Končí dnem, který se svým číslem shoduje se dnem doručení v
          posledním měsíci. Pokud takový den v cílovém měsíci není, skončí posledním dnem tohoto měsíce.
        </p>
        <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5 text-sm leading-7 text-slate-400">
          <ul className="space-y-2">
            <li>• Doručení 15. srpna + dva měsíce: pracovní poměr zpravidla skončí 15. října.</li>
            <li>• Doručení 30. listopadu + dva měsíce: podle příkladu MPSV skončí 30. ledna.</li>
            <li>• Rozhoduje prokazatelné doručení, nikoli jen datum napsané v záhlaví výpovědi.</li>
          </ul>
        </div>
        <p className="mt-4 leading-relaxed text-slate-400">
          Staré pravidlo o prvním dni následujícího kalendářního měsíce se dál použije u výpovědí
          daných před účinností flexinovely. U novějších výpovědí se může vrátit do hry jen tehdy,
          pokud ho strany výslovně a písemně sjednaly — k tomu více níže.
        </p>
      </section>

      <section id="delka" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          2. Standardně dva měsíce, u některých důvodů nejméně jeden
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Základní výpovědní doba činí nejméně dva měsíce. Flexinovela zavedla nejméně jednoměsíční
          dobu pro výpověď danou zaměstnavatelem z důvodů podle § 52 písm. f), g) a h) zákoníku práce.
          Jde mimo jiné o některé případy nesplňování předpokladů nebo požadavků a porušování povinností.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          Zaměstnanec může dát výpověď z jakéhokoli důvodu nebo bez uvedení důvodu. Zaměstnavatel je
          naopak vázán zákonnými důvody a musí použitý důvod skutkově vymezit tak, aby ho později
          nemohl zaměnit za jiný.
        </p>
        <p className="leading-relaxed text-slate-400">
          Dohoda o rozvázání pracovního poměru není výpověď. Je založena na souhlasu obou stran a
          umožňuje sjednat konkrétní den skončení. Zaměstnanec není povinen ji podepsat jen proto,
          že mu ji zaměstnavatel předložil.
        </p>
      </section>

      <ArticleInlineCta
        title="Pracovní smlouva ano, individuální výpověď ne"
        body="SmlouvaHned pomáhá vytvořit standardní pracovní smlouvu. Pro probíhající ukončení, spor nebo výpočet procesní lhůty využijte advokáta."
        buttonLabel="Vytvořit pracovní smlouvu"
        href="/pracovni"
        variant="subtle"
        articleSlug={SLUG}
      />

      <section id="starsi-smlouvy" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Starší pracovní smlouva může obsahovat vlastní pravidlo
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Aktuální § 51 připouští písemnou dohodu o odlišném běhu nebo délce výpovědní doby. MPSV
          zastává názor, že dříve sjednaná konkrétní věta typu „výpovědní doba běží od prvního dne
          následujícího měsíce a končí posledním dnem“ může mít přednost před novým zákonným pravidlem.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          Současně MPSV výslovně upozorňuje, že na tomto závěru mezi odbornou veřejností nepanuje
          úplná shoda. Pokud smlouva jen obecně odkazuje na § 51 nebo zákoník práce, podle MPSV se
          použije aktuální zákonná úprava.
        </p>
        <p className="leading-relaxed text-slate-400">
          Prakticky proto nestačí zadat datum do online kalkulačky. Je potřeba číst konkrétní
          ujednání, zjistit výpovědní důvod, ověřit doručení a zohlednit případné zákonné výjimky.
        </p>
      </section>

      <section id="forma" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          4. Forma, doručení a situace pro advokáta
        </h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Výpověď musí být písemná a musí být účinně doručena druhé straně.',
            'U nadbytečnosti musí zaměstnavatel časově provázat výpověď s konkrétní organizační změnou.',
            'Ochranná doba může běh nebo možnost výpovědi ovlivnit; pravidla mají zákonné výjimky.',
            'Při tvrzeném porušení povinností nebo nesplnění požadavků záleží na přesném skutkovém důvodu a dokumentaci.',
            'Pro napadení neplatného skončení běží krátké soudní lhůty — právní pomoc řešte bez odkladu.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <OfficialSources
        sources={[
          { label: 'MPSV: Přehled a FAQ k flexibilní novele zákoníku práce', href: 'https://mpsv.gov.cz/jake-zmeny-prinasi-flexibilni-novela-zakoniku-prace-' },
          { label: 'e-Sbírka: zákon č. 262/2006 Sb., zákoník práce, aktuální znění', href: 'https://e-sbirka.gov.cz/sb/2006/262/2026-01-01' },
        ]}
      />
    </ArticlePageLayout>
  );
}
