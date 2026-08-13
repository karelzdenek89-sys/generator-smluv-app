import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import {
  DPP_MAX_HOURS_PER_YEAR,
  DPP_MONTHLY_THRESHOLD_2026_CZK,
  MIN_WAGE_HOURLY_2026_CZK,
  MIN_WAGE_MONTHLY_2026_CZK,
} from '@/lib/legal-constants-2026';

export const metadata = blogArticlePageMetadata('minimalni-mzda-dpp-pracovni-smlouva-2026');

export default function MinimalniMzdaDppPracovniSmlouva2026Page() {
  return (
    <ArticlePageLayout
      category="Práce a zaměstnání"
      readTime="7 min"
      dateTime="2026-06-13"
      dateLabel="13. června 2026"
      breadcrumbLabel="Minimální mzda 2026"
      slug="minimalni-mzda-dpp-pracovni-smlouva-2026"
      title="Minimální mzda 2026: 22 400 Kč, DPP a pracovní smlouva"
      intro={`Minimální mzda od 1. ledna 2026 činí ${MIN_WAGE_MONTHLY_2026_CZK.toLocaleString('cs-CZ')} Kč měsíčně, tedy ${MIN_WAGE_HOURLY_2026_CZK.toLocaleString('cs-CZ')} Kč za hodinu při 40hodinovém pracovním týdnu. Ovlivňuje pracovní smlouvy, DPP i DPČ — nejde jen o částku v dokumentu, ale také o správné sjednání odměny, pracovní doby, evidence a navazujících povinností.`}
      toc={[
        { href: '#castky-2026', label: 'Aktuální částky minimální mzdy pro rok 2026' },
        { href: '#dpp-brigady', label: 'Co to znamená pro DPP a krátké brigády' },
        { href: '#pracovni-smlouva', label: 'Co zkontrolovat v pracovní smlouvě' },
        { href: '#kontrolni-seznam', label: 'Kontrolní seznam před podpisem' },
        { href: '#oficialni-zdroje', label: 'Oficiální zdroje' },
      ]}
      primaryAction={{
        title: 'Připravujete DPP nebo pracovní smlouvu?',
        body: 'Generátor SmlouvaHned pracuje s aktuálními limity pro rok 2026 — včetně rozhodného příjmu u DPP a povinných náležitostí dle zákoníku práce.',
        buttonLabel: 'Vytvořit pracovní dokument',
        href: '/dpp',
      }}
      trustBox={{
        generatorSuitable:
          'Běžná DPP, DPČ nebo pracovní smlouva u malého zaměstnavatele, kde je potřeba správně zachytit odměnu, rozsah práce a základní povinnosti stran.',
        lawyerSuitable:
          'Složité mzdové struktury, více zaměstnavatelů u jednoho dohodáře, spory o doplatek do minimální mzdy nebo kontrola inspekce práce.',
      }}
      finalAction={{
        title: 'Potřebujete i pracovní smlouvu?',
        body: 'Pro hlavní pracovní poměr použijte generátor pracovní smlouvy s náležitostmi dle zákoníku práce pro rok 2026.',
        buttonLabel: 'Vytvořit pracovní smlouvu',
        href: '/pracovni',
      }}
      relatedLinks={[
        { href: '/dpp', label: 'DPP — formulář online' },
        { href: '/pracovni', label: 'Pracovní smlouva' },
        { href: '/blog/flexinovela-zakoniku-prace-2026', label: 'Flexinovela 2026' },
        { href: '/blog/dpp-dpc-porovnani-2026', label: 'DPP nebo DPČ' },
        { href: '/blog/dpp-dohoda-provedeni-prace', label: 'Průvodce DPP' },
        { href: '/blog/expat/minimum-wage-dpp-czechia-2026-guide-en', label: 'English guide (expats)' },
        { href: '/blog/expat/minimum-wage-dpp-czechia-2026-guide-ua', label: 'Гід українською' },
      ]}
    >
      <section id="castky-2026" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Aktuální částky minimální mzdy pro rok 2026
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Pro rok 2026 byla minimální mzda vyhlášena sdělením MPSV č. 356/2025 Sb. Měsíční minimum odpovídá{' '}
          {MIN_WAGE_MONTHLY_2026_CZK.toLocaleString('cs-CZ')} Kč hrubého při plném pracovním úvazku.
          Hodinová sazba vychází z 40hodinového pracovního týdnu a činí{' '}
          {MIN_WAGE_HOURLY_2026_CZK.toLocaleString('cs-CZ')} Kč za hodinu.
        </p>
        <p className="leading-relaxed text-slate-400">
          U kratšího úvazku se minimální mzda poměrně snižuje — rozhoduje skutečně sjednaný rozsah
          pracovní doby, ne jen text ve smlouvě. Zaměstnavatel musí doplatit rozdíl, pokud
          skutečně vyplacená odměna nedosáhne zákonného minima.
        </p>
      </section>

      <section id="dpp-brigady" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          2. Co to znamená pro DPP a krátké brigády
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          U dohody o provedení práce platí vedle minimální mzdy také roční limit{' '}
          {DPP_MAX_HOURS_PER_YEAR} hodin u jednoho zaměstnavatele a rozhodný příjem pro pojištění{' '}
          {DPP_MONTHLY_THRESHOLD_2026_CZK.toLocaleString('cs-CZ')} Kč hrubého měsíčně. Při dosažení
          rozhodného příjmu vznikají odvodové povinnosti — proto nestačí jen správně spočítat
          hodinovou sazbu, ale i celkový měsíční rozsah.
        </p>
        <ul className="space-y-3 text-slate-400">
          {[
            'Odměna za hodinu musí odpovídat minimální mzdě — i u jednorázové brigády.',
            'Ve smlouvě by měl být jasný rozsah práce nebo způsob, jak se odměna počítá.',
            'Při opakovaných DPP u téhož zaměstnavatele sledujte kumulaci hodin i příjmu.',
            'Po novele zákoníku práce platí u DPP také pravidla pro dovolenou a oznamovací povinnosti.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="pracovni-smlouva" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Co zkontrolovat v pracovní smlouvě
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Pracovní smlouva musí obsahovat druh práce, místo výkonu a den nástupu. Mzdové
          ujednání by mělo být srozumitelné — buď jako měsíční mzda, hodinová sazba, nebo
          jiný transparentní způsob výpočtu, který v součtu dosahuje minimální mzdy.
        </p>
        <p className="leading-relaxed text-slate-400">
          Pozor na smlouvy, kde je uvedena pouze „odměna dle dohody" bez konkrétní částky, nebo
          kde jsou k mzde vázány podmínky, které fakticky snižují výplatu pod zákonné minimum.
          Taková ujednání mohou být problematická.
        </p>
      </section>

      <section id="kontrolni-seznam" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          4. Kontrolní seznam před podpisem
        </h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Je ve smlouvě uvedena konkrétní odměna nebo způsob výpočtu?',
            'Odpovídá hodinová sazba minimální mzdě pro rok 2026?',
            'U DPP: nepřekračujete roční limit hodin u téhož zaměstnavatele?',
            'U DPP: počítáte s rozhodným příjmem pro pojištění?',
            'Jsou ve smlouvě povinné náležitosti dle zákoníku práce?',
            'Existuje evidence odpracované doby a výplatní termíny?',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="oficialni-zdroje" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Oficiální zdroje</h2>
        <ul className="space-y-3 text-slate-400">
          <li>
            <a
              href="https://www.mpsv.cz/minimalni-mzda"
              className="text-amber-400 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              MPSV — minimální mzda
            </a>
          </li>
          <li>
            <a
              href="https://www.zakonyprolidi.cz/cs/2006-262"
              className="text-amber-400 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Zákoník práce (262/2006 Sb.)
            </a>
          </li>
          <li>
            <a
              href="https://www.suip.cz"
              className="text-amber-400 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Státní úřad inspekce práce
            </a>
          </li>
        </ul>
      </section>
    </ArticlePageLayout>
  );
}
