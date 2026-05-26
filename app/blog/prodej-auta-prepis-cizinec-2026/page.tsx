import type { Metadata } from 'next';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';

export const metadata: Metadata = {
  title: 'Kupní smlouva na auto a přepis vozidla cizincem 2026: Průvodce',
  description:
    'Kompletní průvodce prodejem a koupí auta cizincem v ČR v roce 2026. Jaké doklady potřebujete, jak správně nastavit kupní smlouvu a jak stihnout přepis do 10 pracovních dnů od převodu.',
  alternates: {
    canonical: 'https://www.smlouvahned.cz/blog/prodej-auta-prepis-cizinec-2026',
  },
  openGraph: {
    title: 'Kupní smlouva na auto a přepis vozidla cizincem 2026: Průvodce',
    description:
      'Koupě nebo prodej auta cizincem v ČR. Právní náležitosti kupní smlouvy na vozidlo, povinnosti při přepisu na registru a tipy, jak se vyhnout vysokým pokutám v roce 2026.',
    url: 'https://www.smlouvahned.cz/blog/prodej-auta-prepis-cizinec-2026',
    type: 'article',
  },
};

export default function ProdejAutaCizinec2026Page() {
  return (
    <ArticlePageLayout
      category="Vozidla"
      readTime="7 min"
      dateTime="2026-05-21"
      dateLabel="21. května 2026"
      breadcrumbLabel="Koupě auta cizincem 2026"
      slug="prodej-auta-prepis-cizinec-2026"
      title="Kupní smlouva na auto a přepis vozidla cizincem 2026: Průvodce krok za krokem"
      intro="Koupě nebo prodej ojetého vozidla v České republice s sebou nese řadu administrativních povinností. Pokud je jednou ze stran cizinec, vstupují do procesu specifické požadavky týkající se registrace na úřadě, dokládání pobytu a pojištění. Zjistěte, jak na to v roce 2026 a na co si dát pozor."
      toc={[
        { href: '#kupni-smlouva-zaklad', label: 'Základní náležitosti kupní smlouvy na auto' },
        { href: '#zakonna-lhuta-prepis', label: 'Zákonná lhůta 10 pracovních dnů a pokuty' },
        { href: '#specifika-registru-cizinci', label: 'Specifika na registru vozidel pro cizince' },
        { href: '#povinne-ruceni', label: 'Povinné ručení a zelená karta před přepisem' },
      ]}
      primaryAction={{
        title: 'Připravujete kupní smlouvu na auto?',
        body: 'Využijte náš online generátor kupní smlouvy na vozidlo. Formulář nabízí plné vedení v cizích jazycích a vygeneruje bezchybnou smlouvu s předávacím protokolem.',
        buttonLabel: 'Zobrazit smlouvu na auto',
        href: '/kupni-smlouva',
      }}
      trustBox={{
        generatorSuitable:
          'Prodej nebo koupě ojetého automobilu či motocyklu mezi fyzickými osobami s jasným předáním a specifikací stavu.',
        lawyerSuitable:
          'Dovoz automobilů ze zemí mimo EU, nákup na splátky s komplikovaným financováním nebo spory o skryté vady s autobazarem.',
      }}
      finalAction={{
        title: 'Sestavit smlouvu na auto online',
        body: 'Vyplňte technické parametry vozidla a údaje o stranách. Výstupem je profesionální PDF smlouva a předávací protokol.',
        buttonLabel: 'Přejít na formulář',
        href: '/kupni-smlouva',
      }}
      relatedLinks={[
        { href: '/kupni-smlouva', label: 'Kupní smlouva na auto' },
        { href: '/blog/kupni-smlouva-na-auto-2026', label: 'Náležitosti kupní smlouvy na auto' },
        { href: '/blog/prepis-vozidla-2026', label: 'Jak na přepis vozidla' },
      ]}
    >
      <section id="kupni-smlouva-zaklad" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Základní náležitosti kupní smlouvy na auto
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Kupní smlouvu na auto je v praxi potřeba mít písemně a dostatečně určitě, aby sloužila jako důkaz o převodu a podklad pro úřady. Nezbytnou součástí je jednoznačná identifikace prodávaného vozidla. Toho docílíte uvedením VIN kódu, registrační značky, čísla technického průkazu, značky, modelu a aktuálního stavu tachometru.
        </p>
        <p className="leading-relaxed text-slate-400">
          Zásadním doporučením je přiložení předávacího protokolu (Předávací protokol), ve kterém detailně popíšete veškeré známé technické vady, opotřebení vozu, stav pneumatik a počet předávaných klíčů či dokladů. Tím se obě strany chrání před budoucími spory o reklamaci vad.
        </p>
      </section>

      <section id="zakonna-lhuta-prepis" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          2. Zákonná lhůta 10 pracovních dnů a pokuty
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Žádost o zápis změny vlastníka v registru silničních vozidel se podává nejpozději do 10 pracovních dnů ode dne převodu vlastnického práva k vozidlu, tedy typicky od dokončení prodeje podle smlouvy. Tato lhůta platí i pro rok 2026.
        </p>
        <p className="leading-relaxed text-slate-400">
          Při nedodržení této lhůty hrozí prodávajícímu i kupujícímu pokuta až do výše 50 000 Kč. Pokud se na registr nemohou dostavit obě strany společně, je nutné, aby jedna druhou zplnomocnila. Plná moc pro přepis vozidla musí mít úředně ověřený podpis.
        </p>
      </section>

      <ArticleInlineCta
        title="Připravte si kupní smlouvu s nápovědou pro cizince"
        body="Náš systém pomáhá zahraničním zájemcům projít celým procesem koupě auta v ČR bezpečně a s plným porozuměním textu smlouvy."
        buttonLabel="Vytvořit kupní smlouvu"
        href="/kupni-smlouva"
        variant="subtle"
      />

      <section id="specifika-registru-cizinci" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Specifika na registru vozidel pro cizince
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Aby mohl registr zapsat cizince jako nového vlastníka nebo provozovatele vozidla, musí cizinec prokázat svou vazbu k České republice a právní titul k pobytu.
        </p>
        <p className="leading-relaxed text-slate-400">
          K registraci je nutné předložit platný průkaz totožnosti (pas) a doklad o povolení k pobytu (přechodný, trvalý pobyt, víza za účelem strpění apod.). V některých případech může úřad požadovat dodatečné doložení vazby (např. platnou nájemní smlouvu k bytu nebo pracovní smlouvu), pokud z pobytového oprávnění není adresa bydliště zřejmá.
        </p>
      </section>

      <section id="povinne-ruceni" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          4. Povinné ručení a zelená karta před přepisem
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Před přepisem musí být splněna povinnost pojištění odpovědnosti z provozu vozidla. Kupující si proto sjednává povinné ručení tak, aby vozidlo nebylo bez pojištění; úřad si existenci pojištění obvykle ověří v evidenci České kanceláře pojistitelů nebo jiným prokazatelným způsobem.
        </p>
        <p className="leading-relaxed text-slate-400">
          Zelená karta je dokladem o sjednaném povinném ručení; podle aktuální praxe ji úřad nemusí vždy fyzicky vyžadovat, pokud si pojištění dokáže ověřit elektronicky. Prodávající pak své pojištění ruší k datu prodeje na základě předložené kupní smlouvy.
        </p>
      </section>
    </ArticlePageLayout>
  );
}
