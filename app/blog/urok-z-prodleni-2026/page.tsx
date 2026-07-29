import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import { getBlogHreflangAlternates } from '@/lib/seo/blog-hreflang-clusters';
import { canonicalUrl } from '@/lib/seo/site';

const SLUG = 'urok-z-prodleni-2026';

export const metadata = {
  ...blogArticlePageMetadata(SLUG),
  alternates: {
    canonical: canonicalUrl(`/blog/${SLUG}`),
    languages: getBlogHreflangAlternates(SLUG),
  },
};

export default function UrokZProdleniPage() {
  return (
    <ArticlePageLayout
      category="Osobní a finanční"
      readTime="8 min"
      dateTime="2026-07-29"
      dateLabel="29. července 2026"
      breadcrumbLabel="Úrok z prodlení 2026"
      slug="urok-z-prodleni-2026"
      title="Úrok z prodlení 2026: na co máte nárok u neuhrazené faktury nebo dluhu a jak ho spočítat"
      intro="Když druhá strana nezaplatí včas, vzniká věřiteli právo na úrok z prodlení — a to i bez ujednání ve smlouvě. Výši určuje nařízení vlády podle repo sazby ČNB. Tento přehled vysvětluje, odkud úrok z prodlení plyne, jak se počítá a jak se liší od smluvní pokuty. Vychází z § 1970 občanského zákoníku a z nařízení vlády č. 351/2013 Sb."
      toc={[
        { href: '#co-to-je', label: 'Co je úrok z prodlení a odkud plyne' },
        { href: '#jak-se-pocita', label: 'Jak se počítá jeho výše' },
        { href: '#vs-smluvni-pokuta', label: 'Úrok z prodlení vs. smluvní pokuta' },
        { href: '#pausal-naklady', label: 'Paušální náhrada nákladů' },
        { href: '#jak-vymahat', label: 'Jak dluh a úrok vymáhat' },
      ]}
      primaryAction={{
        title: 'Řešíte nezaplacený dluh?',
        body: 'Uznání dluhu se splátkovým kalendářem pomáhá dlužníkovi i věřiteli dát platbám jasný rámec a zjednodušit případné vymáhání.',
        buttonLabel: 'Vytvořit uznání dluhu',
        href: '/uznani-dluhu-vzor',
      }}
      trustBox={{
        generatorSuitable:
          'Běžná situace, kdy si chcete písemně potvrdit dluh, splatnost a splátky a mít podklad pro případný úrok z prodlení.',
        lawyerSuitable:
          'Sporná výše pohledávky, obrana proti nároku, vymáhání vyšší částky soudní cestou nebo insolvence dlužníka.',
      }}
      finalAction={{
        title: 'Chcete dát dluhu a splátkám jasný rámec?',
        body: 'Vyplňte uznání dluhu online — s výší dluhu, splatností i splátkovým kalendářem.',
        buttonLabel: 'Otevřít formulář uznání dluhu',
        href: '/uznani-dluhu-vzor',
      }}
      relatedLinks={[
        { href: '/uznani-dluhu-vzor', label: 'Uznání dluhu - formulář online' },
        { href: '/blog/uznani-dluhu-2026', label: 'Uznání dluhu a promlčení' },
        { href: '/blog/smluvni-pokuta-vzor-2026', label: 'Smluvní pokuta' },
        { href: '/blog/smlouva-o-zapujcce-2026', label: 'Smlouva o zápůjčce' },
      ]}
    >
      <section id="co-to-je" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co je úrok z prodlení a odkud plyne</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Úrok z prodlení je zákonná sankce za pozdní zaplacení peněžitého dluhu. Podle § 1970 občanského
          zákoníku může věřitel, který sám řádně splnil své povinnosti, požadovat po dlužníkovi v prodlení
          úrok z prodlení. Nárok vzniká ze zákona — nemusí být ve smlouvě sjednán.
        </p>
        <p className="leading-relaxed text-slate-400">
          Úrok začíná narůstat ode dne následujícího po splatnosti a běží za každý den prodlení až do
          zaplacení. U faktury je proto klíčové mít jasně uvedené datum splatnosti.
        </p>
      </section>

      <section id="jak-se-pocita" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Jak se počítá jeho výše</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Zákonnou výši stanoví nařízení vlády č. 351/2013 Sb. Roční sazba úroku z prodlení odpovídá repo
          sazbě stanovené Českou národní bankou pro první den kalendářního pololetí, v němž došlo k prodlení,
          zvýšené o 8 procentních bodů.
        </p>
        <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5 text-sm leading-7 text-slate-400">
          <ul className="space-y-2">
            <li>• sazba se určí podle repo sazby ČNB k 1. lednu nebo 1. červenci (podle toho, kdy prodlení začalo), + 8 procentních bodů,</li>
            <li>• jednou určená sazba se po celou dobu prodlení nemění — pozdější změny repo sazby na ni nemají vliv,</li>
            <li>• vzorec: dlužná částka × roční sazba × počet dnů prodlení ÷ 365.</li>
          </ul>
        </div>
        <p className="mt-4 leading-relaxed text-slate-400">
          Protože se repo sazba mění, konkrétní procento je vhodné ověřit k datu, kdy prodlení začalo. Aktuální
          i historické repo sazby a orientační kalkulačku poskytuje Česká národní banka.
        </p>
      </section>

      <section id="vs-smluvni-pokuta" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Úrok z prodlení vs. smluvní pokuta</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Úrok z prodlení a smluvní pokuta nejsou totéž. Úrok z prodlení plyne přímo ze zákona a týká se
          peněžitého dluhu. Smluvní pokuta musí být sjednána ve smlouvě a lze jí zajistit i nepeněžité
          povinnosti. Obojí lze za splnění podmínek uplatnit vedle sebe.
        </p>
        <p className="leading-relaxed text-slate-400">
          Mezi podnikateli lze výši úroku z prodlení ujednat odchylně. Vůči spotřebiteli ale nelze sjednat
          úrok nižší, než stanoví nařízení — ujednání v jeho neprospěch by bylo neplatné.
        </p>
      </section>

      <ArticleInlineCta
        title="Dejte dluhu a splátkám písemný rámec"
        body="Uznání dluhu se splátkovým kalendářem usnadní přehled o platbách i případné vymáhání úroku z prodlení."
        buttonLabel="Pokračovat k uznání dluhu"
        href="/uznani-dluhu-vzor"
        variant="subtle"
        articleSlug="urok-z-prodleni-2026"
      />

      <section id="pausal-naklady" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Paušální náhrada nákladů</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Vedle úroku z prodlení počítá nařízení č. 351/2013 Sb. i s paušální náhradou nákladů spojených s
          uplatněním pohledávky. U vzájemných závazků podnikatelů (a u dodávek podnikatele veřejnému
          zadavateli) činí minimální výše těchto nákladů 1 200 Kč za každou pohledávku.
        </p>
        <p className="leading-relaxed text-slate-400">
          Paušál je nezávislý na tom, zda věřiteli náklady skutečně vznikly, a uplatní se vedle úroku z
          prodlení. Nenahrazuje ale případnou vyšší skutečnou náhradu nákladů řízení přiznanou soudem.
        </p>
      </section>

      <section id="jak-vymahat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Jak dluh a úrok vymáhat</h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Má faktura nebo smlouva jasně uvedenou splatnost, od které se prodlení počítá?',
            'Poslali jste dlužníkovi písemnou upomínku s vyčíslením dlužné částky?',
            'Zvážili jste uznání dluhu se splátkovým kalendářem, které usnadní další postup?',
            'Ověřili jste repo sazbu ČNB platnou k počátku prodlení pro výpočet úroku?',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1 text-amber-500">•</span><span>{item}</span></li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-slate-500">
          Zdroj: <a className="text-amber-400 hover:text-amber-300" href="https://www.zakonyprolidi.cz/cs/2013-351" target="_blank" rel="noreferrer">nařízení vlády č. 351/2013 Sb.</a> a § 1970 zákona č. 89/2012 Sb.; výpočet a repo sazby viz <a className="text-amber-400 hover:text-amber-300" href="https://www.cnb.cz/cs/casto-kladene-dotazy/Vypocet-uroku-z-prodleni/" target="_blank" rel="noreferrer">Česká národní banka</a>.
        </p>
      </section>
    </ArticlePageLayout>
  );
}
