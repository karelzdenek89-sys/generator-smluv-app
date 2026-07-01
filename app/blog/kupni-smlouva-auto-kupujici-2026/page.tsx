import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata = blogArticlePageMetadata('kupni-smlouva-auto-kupujici-2026');

export default function KupniSmlouvaAutoKupujici2026Page() {
  return (
    <ArticlePageLayout
      category="Vozidla"
      readTime="8 min"
      dateTime="2026-07-01"
      dateLabel="1. července 2026"
      breadcrumbLabel="Kupní smlouva pro kupujícího"
      slug="kupni-smlouva-auto-kupujici-2026"
      title="Kupní smlouva na auto pro kupujícího 2026: Na co si dát pozor před podpisem"
      intro="Kupující ojetého vozu často spěchá — auto se líbí, cena sedí, prodávající tlačí na rychlý podpis. Přitom právě kupní smlouva a předávací protokol chrání kupujícího před skrytými vadami, nejasným stavem tachometru nebo chybějícími doklady. Tento průvodce shrnuje, co zkontrolovat před podpisem."
      toc={[
        { href: '#pred-koupí', label: 'Co zkontrolovat před koupí' },
        { href: '#co-ve-smlouve', label: 'Co musí být ve smlouvě' },
        { href: '#vady-tachometr', label: 'Vady a stav tachometru' },
        { href: '#predani-prepis', label: 'Předání a přepis' },
        { href: '#chyby-kupujici', label: 'Chyby, kterých se kupující vyvaruje' },
      ]}
      primaryAction={{
        title: 'Kupujete vozidlo?',
        body: 'Generátor kupní smlouvy zachytí VIN, stav tachometru, známé vady a podmínky předání — kupující i prodávající tak mají jasná pravidla.',
        buttonLabel: 'Vytvořit kupní smlouvu',
        href: '/auto',
      }}
      trustBox={{
        generatorSuitable:
          'Běžný nákup ojetého vozidla mezi fyzickými osobami, kde chcete mít smlouvu, předávací protokol a seznam dokladů připravené předem.',
        lawyerSuitable:
          'Sporný technický stav, podezření na stočený tachometr, zatížené vozidlo nebo prodej od právnické osoby s reklamačními nároky.',
      }}
      finalAction={{
        title: 'Chcete smlouvu připravenou k podpisu?',
        body: 'Stejný generátor kupní smlouvy použijete jako prodávající i kupující — doplníte role stran a podmínky předání.',
        buttonLabel: 'Vytvořit kupní smlouvu na auto',
        href: '/auto',
      }}
      relatedLinks={[
        { href: '/auto', label: 'Kupní smlouva na vozidlo' },
        { href: '/blog/kupni-smlouva-na-auto-2026', label: 'Kupní smlouva na auto 2026' },
        { href: '/blog/prepis-vozidla-2026', label: 'Přepis vozidla' },
        { href: '/blog/doklady-pri-prodeji-auta-2026', label: 'Doklady při prodeji' },
        { href: '/blog/predani-vozidla-kupujicimu-2026', label: 'Předání vozidla' },
      ]}
    >
      <section id="pred-koupí" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co zkontrolovat před koupí</h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'VIN vozidla — musí souhlasit s technickým průkazem a fakturou servisu.',
            'Historie vozidla — servisní knížka, STK, případně výpis z registru vozidel.',
            'Stav karoserie, interiéru, pneumatik — ideálně za denního světla.',
            'Zda vozidlo není zatíženo leasingem, zástavou nebo neuhrazenými poplatky.',
            'Zkušební jízda a kontrola motoru, brzd, převodovky.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="co-ve-smlouve" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co musí být ve smlouvě</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Kupní smlouva by měla identifikovat prodávajícího a kupujícího, popsat vozidlo (značka,
          model, VIN, RZ, rok výroby), kupní cenu, způsob platby a okamžik převodu vlastnictví.
          U ojetého vozu je vhodné výslovně uvést známé vady a stav tachometru.
        </p>
        <p className="leading-relaxed text-slate-400">
          Smlouva bez VIN nebo s nejasnou cenou komplikuje přepis i případný spor. Kupující by
          měl dostat kopii smlouvy a ověřit, že údaje odpovídají skutečnosti.
        </p>
      </section>

      <section id="vady-tachometr" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Vady a stav tachometru</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Prodávající odpovídá za vady, o kterých věděl a které neoznámil. Ve smlouvě nebo
          předávacím protokolu by měly být uvedeny všechny známé nedostatky — od škrábců po
          technické problémy. Stav tachometru je klíčový údaj; jeho úmyslné stočení je trestné.
        </p>
        <p className="leading-relaxed text-slate-400">
          Kupující by neměl akceptovat formulaci „vozidlo prodáváno ve stavu, v jakém stojí"
          bez vlastní prohlídky a uvedení stavu tachometru. U dražších vozů zvažte odbornou
          prohlídku.
        </p>
      </section>

      <section id="predani-prepis" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Předání a přepis</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Po podpisu smlouvy následuje fyzické předání vozidla, klíčů a dokladů. Předávací
          protokol zachytí stav vozu v okamžiku předání. Kupující má povinnost nahlásit změnu
          držitele do 10 pracovních dnů — lze online přes Portál dopravy.
        </p>
        <p className="leading-relaxed text-slate-400">
          Doklady, které by měl kupující obdržet: technický průkaz, servisní knížka (pokud
          existuje), klíče, případně plná moc pro přepis, pokud za prodávajícího jedná zástupce.
        </p>
      </section>

      <section id="chyby-kupujici" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          5. Chyby, kterých se kupující vyvaruje
        </h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Podpis smlouvy bez kontroly VIN a technického průkazu.',
            'Platba v hotovosti bez potvrzení v protokolu nebo smlouvě.',
            'Převzetí vozu bez písemného záznamu stavu a tachometru.',
            'Odklad přepisu — prodávající zůstává držitelem v registru.',
            'Ignorování známých vad „protože je to levné".',
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
