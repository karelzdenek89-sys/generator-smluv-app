import type { Metadata } from 'next';
import TrackView from '@/app/components/analytics/TrackView';
import GuideLandingPage from '@/app/components/GuideLandingPage';

export const metadata: Metadata = {
  title: 'Zaměstnavatel Start 2026 — nástupní dokumenty',
  description:
    'Personální balíček pro standardní nástup zaměstnance: pracovní smlouva, informace podle § 37 ZP, home office, vybavení, checklist a DOCX za 599 Kč.',
  alternates: { canonical: 'https://www.smlouvahned.cz/balicek-zamestnavatel' },
  openGraph: {
    title: 'Zaměstnavatel Start 2026',
    description:
      'Pracovní smlouva a navazující personální podklady z jednoho online formuláře.',
    url: 'https://www.smlouvahned.cz/balicek-zamestnavatel',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zaměstnavatel Start 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zaměstnavatel Start 2026',
    description: 'Pracovní smlouva, informace podle § 37 ZP a nástupní podklady v jednom balíčku.',
    images: ['/og-image.png'],
  },
};

const faq = [
  {
    q: 'Čím se balíček liší od samostatné pracovní smlouvy?',
    a: 'Vedle pracovní smlouvy v rozšířené variantě vytvoří samostatnou informaci podle § 37 zákoníku práce, podklady k práci na dálku a vybavení, nástupní checklist a editovatelný DOCX.',
  },
  {
    q: 'Vznikne dohoda o práci na dálku vždy?',
    a: 'Ne. Samostatná dohoda se přidá jen tehdy, když ve formuláři zvolíte plný nebo hybridní home office a doplníte místo, rozsah a režim náhrady nákladů.',
  },
  {
    q: 'Je informační list podle § 37 ZP automaticky úplný?',
    a: 'Formulář vyžádá údaje potřebné pro standardní pracovní poměr. Zaměstnavatel musí před použitím zkontrolovat zejména kolektivní smlouvu, příslušný orgán sociálního zabezpečení a vlastní vnitřní pravidla.',
  },
  {
    q: 'Je součástí editovatelný soubor?',
    a: 'Ano. Balíček obsahuje PDF připravené ke kontrole a podpisu i editovatelnou DOCX verzi bez dalšího příplatku.',
  },
  {
    q: 'Nahrazuje balíček individuální právní nebo HR službu?',
    a: 'Ne. Jde o standardizovaný produkt pro běžný nástup zaměstnance v České republice. Pro vedoucí pozice se zvláštním režimem, vyslání do zahraničí, cizinecké otázky nebo sporné situace doporučujeme odbornou kontrolu.',
  },
];

export default function EmployerStartPackagePage() {
  return (
    <>
      <TrackView
        eventName="package_page_view"
        eventParams={{
          source: 'package_page',
          surface: 'package_page',
          package_key: 'employer_start',
          price_band: '599',
        }}
      />
      <GuideLandingPage
        breadcrumbLabel="Zaměstnavatel Start 2026"
        kicker="Personální balíček · 599 Kč"
        title="Zaměstnavatel Start 2026"
        accent="podklady k nástupu z jednoho formuláře"
        description="Pro standardní pracovní poměr, kdy nechcete skončit jen u pracovní smlouvy. Jednou vyplníte údaje a získáte hlavní dokument i navazující personální podklady připravené ke kontrole, předání a archivaci."
        primaryCta={{ href: '/pracovni?package=employer_start', label: 'Připravit personální balíček' }}
        secondaryCta={{ href: '/pracovni', label: 'Potřebuji jen pracovní smlouvu' }}
        summary={[
          'Rozšířená pracovní smlouva podle zadaných údajů.',
          'Samostatná informace o obsahu pracovního poměru podle § 37 ZP.',
          'Dohoda o práci na dálku pouze při zvoleném home office.',
          'Protokol k vybavení, nástupní checklist a PDF i DOCX.',
        ]}
        decisionGuide={{
          label: 'Vyberte rozsah',
          title: 'Samostatný dokument, nebo celý nástupní balíček',
          intro:
            'Pro samotné sjednání pracovního poměru můžete zvolit pracovní smlouvu. Balíček dává smysl, pokud potřebujete připravit i povinné informace a praktické navazující podklady.',
          items: [
            {
              key: 'employer-basic',
              title: 'Základní dokument',
              priceLabel: '99 Kč',
              description: 'Samostatná pracovní smlouva pro běžný pracovní poměr se základním rozsahem.',
              href: '/pracovni',
              cta: 'Vytvořit pracovní smlouvu →',
            },
            {
              key: 'employer-complete',
              title: 'Rozšířený dokument',
              priceLabel: '199 Kč',
              description: 'Samostatná pracovní smlouva s rozšířenými ustanoveními a praktickými podklady.',
              href: '/pracovni',
              cta: 'Zvolit rozšířenou variantu →',
              badge: 'Širší smlouva',
            },
            {
              key: 'employer-package',
              bundleKey: 'employer_start',
              title: 'Zaměstnavatel Start',
              priceLabel: '599 Kč',
              description: 'Pracovní smlouva, § 37, home office, vybavení, checklist a DOCX v jednom toku.',
              href: '/pracovni?package=employer_start',
              cta: 'Otevřít balíček →',
              badge: 'Celý nástup',
              highlight: true,
            },
          ],
        }}
        suitableSectionLabel="Pro koho"
        suitableSectionTitle="Kdy se balíček hodí"
        suitableFor={[
          {
            title: 'Nabíráte prvního nebo dalšího zaměstnance',
            text: 'Vhodné pro menší zaměstnavatele, kteří chtějí standardní nástupní dokumentaci připravit přehledně a z jednoho zdroje údajů.',
          },
          {
            title: 'Potřebujete předat informace podle § 37 ZP',
            text: 'Balíček vytvoří samostatný informační list a připomene lhůtu i potvrzení o předání zaměstnanci.',
          },
          {
            title: 'Řešíte home office nebo pracovní vybavení',
            text: 'Podle vašich voleb přidá písemnou dohodu o práci na dálku a protokol o předání vybavení.',
          },
        ]}
        contentsSectionLabel="Obsah balíčku"
        contentsSectionTitle="Dokumenty pro standardní nástup zaměstnance"
        contents={[
          {
            title: 'Pracovní smlouva v rozšířené variantě',
            text: 'Hlavní smluvní dokument s druhem práce, místem výkonu, nástupem, pracovní dobou, mzdou a dalšími zvolenými ustanoveními.',
          },
          {
            title: 'Informace podle § 37 zákoníku práce',
            text: 'Samostatný předávací list pokrývající zákonný okruh údajů pro běžný pracovní poměr a potvrzení o převzetí.',
          },
          {
            title: 'Home office a pracovní vybavení',
            text: 'Podmíněná dohoda o práci na dálku a protokol, který zachytí předávané vybavení, stav a podpisy.',
          },
          {
            title: 'Nástupní checklist a dva formáty',
            text: 'Praktický kontrolní seznam zaměstnavatele, hotové PDF a editovatelná DOCX verze.',
          },
        ]}
        trackingContext={{ pageType: 'package', pageKey: 'employer_start' }}
        mistakesTitle="Kdy zvolit odbornou kontrolu"
        mistakes={[
          'Zaměstnanec má být vyslán do zahraničí nebo jde o přeshraniční režim.',
          'Pozice podléhá zvláštním předpisům, bezpečnostní prověrce nebo nestandardnímu odměňování.',
          'Řešíte cizinecké oprávnění k práci, spor, převod zaměstnanců nebo hromadné propouštění.',
        ]}
        faq={faq}
        finalCtaTitle="Připravte dokumentaci k nástupu v jednom toku"
        finalCtaBody="Formulář vás provede pracovní smlouvou i údaji pro navazující podklady. Před platbou uvidíte přesný obsah balíčku a můžete doplnit vysvětlující anglickou nebo ukrajinskou přílohu."
        bottomLinks={[
          { href: '/pracovni?package=employer_start', label: 'Otevřít balíček Zaměstnavatel Start' },
          { href: '/pracovni', label: 'Samostatná pracovní smlouva' },
          { href: '/dpp', label: 'Dohoda o provedení práce' },
        ]}
        relatedCluster="prace"
        currentHref="/balicek-zamestnavatel"
        differentiationHint="při nástupu zaměstnance"
      />
    </>
  );
}
