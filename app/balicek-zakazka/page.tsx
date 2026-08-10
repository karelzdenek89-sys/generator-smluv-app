import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TrackView from '@/app/components/analytics/TrackView';
import GuideLandingPage from '@/app/components/GuideLandingPage';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { THEMATIC_PACKAGE_CONFIG } from '@/lib/packages';
import { PRICING_TIER_CONFIG } from '@/lib/pricing';

const WORK_ORDER = THEMATIC_PACKAGE_CONFIG.work_order;

export const metadata: Metadata = {
  title: 'Zakázka Plus — dokumentace ke smlouvě o dílo',
  description:
    // Popisek zůstává literálem — SEO kontrola měří jeho délku staticky ze
    // zdroje a šablonový řetězec by změřila špatně.
    'Balíček ke standardní zakázce: smlouva o dílo, předávací a akceptační protokol, vícepráce, změnový list a platební harmonogram za 399 Kč.',
  alternates: { canonical: 'https://www.smlouvahned.cz/balicek-zakazka' },
  openGraph: {
    title: 'Zakázka Plus',
    description:
      'Smlouva o dílo a navazující podklady k vícepracím, změnám a předání díla z jednoho formuláře.',
    url: 'https://www.smlouvahned.cz/balicek-zakazka',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Zakázka Plus' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zakázka Plus',
    description: 'Smlouva o dílo, vícepráce, změnový list a předání díla v jednom balíčku.',
    images: ['/og-image.png'],
  },
};

const faq = [
  {
    q: 'Čím se balíček liší od samostatné smlouvy o dílo?',
    a: 'Vedle smlouvy o dílo v rozšířené variantě vytvoří předávací a akceptační protokol k dílu, formulář víceprací, změnový list a přehled platebního harmonogramu.',
  },
  {
    q: 'K čemu slouží formulář víceprací?',
    a: 'Smlouva o dílo vyžaduje, aby práce nad rámec sjednaného rozsahu byly odsouhlaseny písemně. Formulář dává tomuto odsouhlasení pevnou strukturu — popis prací, cenu a dopad na termín.',
  },
  {
    q: 'Jaký je rozdíl mezi formulářem víceprací a změnovým listem?',
    a: 'Formulář víceprací řeší práce navíc oproti sjednanému rozsahu. Změnový list zachycuje jakoukoli jinou změnu smlouvy — technické řešení, harmonogram nebo cenu — a po podpisu obou stran působí jako číslovaný dodatek.',
  },
  {
    q: 'Je platební harmonogram vyplněný automaticky?',
    a: 'Přebírá celkovou cenu a způsob úhrady z formuláře. Jednotlivé splátky a data úhrad doplňujete průběžně podle skutečného postupu zakázky.',
  },
  {
    q: 'Nahrazuje balíček individuální právní službu?',
    a: 'Ne. Jde o standardizovaný dokument pro běžnou zakázku mezi objednatelem a zhotovitelem. U velkých staveb, veřejných zakázek, sporů nebo netypického rozdělení rizik doporučujeme odbornou kontrolu.',
  },
];

export default function WorkOrderPackagePage() {
  // Dokud balíček nemá nastavené Stripe Price ID, nesmí být dostupná ani
  // landing page — jinak by vznikla indexovatelná stránka produktu,
  // který nelze koupit.
  if (!isFeatureEnabled('zakazkaPlus')) notFound();

  return (
    <>
      <TrackView
        eventName="package_page_view"
        eventParams={{
          source: 'package_page',
          surface: 'package_page',
          package_key: 'work_order',
          price_band: '399',
        }}
      />
      <GuideLandingPage
        breadcrumbLabel="Zakázka Plus"
        kicker={`${WORK_ORDER.badge} · ${WORK_ORDER.priceLabel}`}
        title="Zakázka Plus"
        accent="dokumentace k zakázce z jednoho formuláře"
        description="Pro standardní zakázku mezi objednatelem a zhotovitelem, kde nechcete skončit jen u smlouvy. Jednou vyplníte údaje a získáte smlouvu o dílo i podklady, které se používají v průběhu zakázky — od odsouhlasení víceprací po předání díla."
        primaryCta={{ href: '/smlouva-o-dilo?package=work_order', label: 'Připravit dokumentaci k zakázce' }}
        secondaryCta={{ href: '/smlouva-o-dilo', label: 'Potřebuji jen smlouvu o dílo' }}
        summary={[
          'Smlouva o dílo v rozšířené variantě podle zadaných údajů.',
          'Předávací a akceptační protokol k dílu se soupisem vad a nedodělků.',
          'Formulář víceprací a změnový list pro změny rozsahu.',
          'Přehled platebního harmonogramu navázaný na sjednanou cenu.',
        ]}
        decisionGuide={{
          label: 'Vyberte rozsah',
          title: 'Samostatný dokument, nebo dokumentace k celé zakázce',
          intro:
            'Pro samotné sjednání díla stačí smlouva o dílo. Balíček dává smysl, pokud počítáte se změnami rozsahu, průběžnými platbami a formálním předáním.',
          items: [
            {
              key: 'work-basic',
              title: 'Základní dokument',
              priceLabel: PRICING_TIER_CONFIG.basic.priceLabel,
              description: 'Samostatná smlouva o dílo se základním rozsahem ustanovení.',
              href: '/smlouva-o-dilo',
              cta: 'Vytvořit smlouvu o dílo →',
            },
            {
              key: 'work-complete',
              title: 'Rozšířený dokument',
              priceLabel: PRICING_TIER_CONFIG.complete.priceLabel,
              description: 'Smlouva o dílo s ustanoveními k duševnímu vlastnictví, vícepracím a pojištění.',
              href: '/smlouva-o-dilo',
              cta: 'Zvolit rozšířenou variantu →',
              badge: 'Širší smlouva',
            },
            {
              key: 'work-package',
              bundleKey: 'work_order',
              title: 'Zakázka Plus',
              priceLabel: WORK_ORDER.priceLabel,
              description: 'Smlouva, předání díla, vícepráce, změnový list a platební harmonogram v jednom toku.',
              href: '/smlouva-o-dilo?package=work_order',
              cta: 'Otevřít balíček →',
              badge: 'Celá zakázka',
              highlight: true,
            },
          ],
        }}
        suitableSectionLabel="Pro koho"
        suitableSectionTitle="Kdy se balíček hodí"
        suitableFor={[
          {
            title: 'Zakázka poběží několik týdnů nebo měsíců',
            text: 'Vhodné tam, kde se v průběhu díla řeší dílčí platby, změny zadání a formální převzetí výsledku.',
          },
          {
            title: 'Očekáváte vícepráce nebo změny rozsahu',
            text: 'Balíček dává písemnou formu tomu, co smlouva vyžaduje — odsouhlasení prací navíc včetně ceny a dopadu na termín.',
          },
          {
            title: 'Chcete mít předání díla zdokumentované',
            text: 'Předávací a akceptační protokol zachytí rozsah provedených prací, vady, nedodělky a začátek běhu záruční doby.',
          },
        ]}
        contentsSectionLabel="Obsah balíčku"
        contentsSectionTitle="Dokumenty ke standardní zakázce"
        contents={[
          {
            title: 'Smlouva o dílo v rozšířené variantě',
            text: 'Hlavní dokument s předmětem díla, cenou, harmonogramem, zárukou, sankcemi, duševním vlastnictvím a pravidly pro vícepráce.',
          },
          {
            title: 'Předávací a akceptační protokol',
            text: 'Zápis o předání a převzetí díla se soupisem vad a nedodělků, lhůtou k odstranění a výsledkem přejímky.',
          },
          {
            title: 'Formulář víceprací a změnový list',
            text: 'Podklady pro písemné odsouhlasení prací nad rámec rozsahu a pro číslované změny smlouvy.',
          },
          {
            title: 'Platební harmonogram',
            text: 'Přehled sjednané ceny a způsobu úhrady s tabulkou pro průběžné doplnění splátek a jejich úhrad.',
          },
        ]}
        trackingContext={{ pageType: 'package', pageKey: 'work_order' }}
        mistakesTitle="Kdy zvolit odbornou kontrolu"
        mistakes={[
          'Jde o velkou stavbu, veřejnou zakázku nebo dílo s vlastní projektovou dokumentací a technickými normami.',
          'Zakázka má netypické rozdělení rizik, bankovní záruky nebo zádržné.',
          'Řešíte již vzniklý spor o kvalitu díla, jeho cenu nebo odstoupení od smlouvy.',
        ]}
        faq={faq}
        finalCtaTitle="Připravte dokumentaci k zakázce v jednom toku"
        finalCtaBody="Formulář vás provede smlouvou o dílo i údaji pro navazující podklady. Před platbou uvidíte přesný obsah balíčku."
        bottomLinks={[
          { href: '/smlouva-o-dilo?package=work_order', label: 'Otevřít balíček Zakázka Plus' },
          { href: '/smlouva-o-dilo', label: 'Samostatná smlouva o dílo' },
          { href: '/smlouva-o-sluzbach', label: 'Smlouva o poskytování služeb' },
        ]}
        relatedCluster="prace"
        currentHref="/balicek-zakazka"
        differentiationHint="u zakázky na dílo"
      />
    </>
  );
}
