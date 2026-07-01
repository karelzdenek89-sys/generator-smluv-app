import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata = blogArticlePageMetadata('prepis-auta-online-portal-dopravy-2026');

export default function PrepisAutaOnlinePortalDopravy2026Page() {
  return (
    <ArticlePageLayout
      category="Vozidla"
      readTime="8 min"
      dateTime="2026-06-13"
      dateLabel="13. června 2026"
      breadcrumbLabel="Přepis auta online 2026"
      slug="prepis-auta-online-portal-dopravy-2026"
      title="Přepis auta online přes Portál dopravy 2026: co připravit před prodejem"
      intro="Portál dopravy umožňuje část administrativy kolem vozidla vyřídit digitálně. Pro běžný prodej auta ale online formulář nenahrazuje kupní smlouvu, předávací protokol ani jasné předání dokladů. Tento průvodce shrnuje, co připravit před prodejem, aby převod proběhl bez zbytečných komplikací."
      toc={[
        { href: '#co-online', label: 'Co lze řešit online přes Portál dopravy' },
        { href: '#lhuta-podklady', label: 'Lhůta 10 pracovních dnů a podklady' },
        { href: '#proc-nestaci', label: 'Proč nestačí jen online formulář' },
        { href: '#plna-moc', label: 'Kdy připravit plnou moc' },
        { href: '#oficialni-zdroje', label: 'Oficiální zdroje' },
      ]}
      primaryAction={{
        title: 'Prodáváte nebo kupujete vozidlo?',
        body: 'Začněte kupní smlouvou s VIN, stavem tachometru a popisem známých vad — teprve na ni navazuje předání a přepis.',
        buttonLabel: 'Vytvořit kupní smlouvu na auto',
        href: '/auto',
      }}
      trustBox={{
        generatorSuitable:
          'Běžný prodej osobního vozidla mezi fyzickými osobami, kde chcete mít kupní smlouvu, předávací protokol a přehled dokladů připravené předem.',
        lawyerSuitable:
          'Spory o vlastnictví, zatížené vozidlo, neuhrazené poplatky, prodej právnické osoby nebo přeshraniční převod.',
      }}
      finalAction={{
        title: 'Prodáváte vozidlo a potřebujete plnou moc k přepisu?',
        body: 'Speciální plná moc pro zastoupení u registru vozidel — s VIN, RZ a rozsahem oprávnění.',
        buttonLabel: 'Vytvořit plnou moc',
        href: '/plna-moc',
      }}
      relatedLinks={[
        { href: '/auto', label: 'Kupní smlouva na vozidlo' },
        { href: '/blog/kupni-smlouva-na-auto-2026', label: 'Kupní smlouva na auto 2026' },
        { href: '/blog/prepis-vozidla-2026', label: 'Přepis vozidla po smlouvě' },
        { href: '/blog/predani-vozidla-kupujicimu-2026', label: 'Předání vozidla kupujícímu' },
        { href: '/blog/doklady-pri-prodeji-auta-2026', label: 'Doklady při prodeji auta' },
        { href: '/blog/expat/car-registration-online-portal-dopravy-2026-guide-en', label: 'English guide (expats)' },
        { href: '/blog/expat/car-registration-online-portal-dopravy-2026-guide-ua', label: 'Гід українською' },
      ]}
    >
      <section id="co-online" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Co lze řešit online přes Portál dopravy
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Portál dopravy (portál občana v agendě dopravy) umožňuje podat žádost o změnu
          držitele nebo vlastníka vozidla, ověřit stav registrace a v některých situacích
          zjednodušit komunikaci s registrem vozidel. Pro fyzické osoby s bankovní identitou
          nebo datovou schránkou je cesta výrazně rychlejší než osobní návštěva úřadu.
        </p>
        <p className="leading-relaxed text-slate-400">
          Online podání ale předpokládá, že máte připravené podklady ze smlouvy — zejména údaje
          o prodávajícím, kupujícím, vozidle (VIN, RZ) a datu převodu. Bez nich formulář
          nevyplníte správně.
        </p>
      </section>

      <section id="lhuta-podklady" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          2. Lhůta 10 pracovních dnů a podklady
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Držitel vozidla (typicky kupující) má povinnost nahlásit změnu do 10 pracovních dnů od
          okamžiku, kdy se stal držitelem. V praxi jde o den podpisu kupní smlouvy nebo jiný
          sjednaný okamžik převodu — podle toho, co je ve smlouvě uvedeno.
        </p>
        <ul className="space-y-3 text-slate-400">
          {[
            'kupní smlouva nebo jiný doklad o nabytí vozidla',
            'technický průkaz vozidla (malý TP)',
            'osobní doklady prodávajícího a kupujícího',
            'potvrzení o převzetí vozidla a dokladů (doporučeno)',
            'plná moc, pokud za stranu jedná zástupce',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 text-amber-500">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="proc-nestaci" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Proč nestačí jen online formulář
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Online žádost řeší registraci u úřadu, ne vztah mezi prodávajícím a kupujícím. Kupní
          smlouva stanoví cenu, stav vozidla, známé vady a okamžik převodu. Předávací protokol
          zachytí stav tachometru, předané klíče, technický průkaz a případné nedostatky při
          předání.
        </p>
        <p className="leading-relaxed text-slate-400">
          Bez těchto dokumentů je obtížné prokázat, co strany skutečně sjednaly — zejména pokud
          později vznikne spor o stav vozu, chybějící doklady nebo neuhrazenou kupní cenu.
        </p>
      </section>

      <section id="plna-moc" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          4. Kdy připravit plnou moc
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Plná moc se hodí, když kupující nebo prodávající nemůže osobně vyřídit přepis — typicky
          při prodeji na dálku, zastoupení rodinným příslušníkem nebo u cizinců bez znalosti
          české administrativy. Plná moc by měla být co nejpřesnější: konkrétní vozidlo (VIN,
          RZ), rozsah oprávnění a doba platnosti.
        </p>
        <p className="leading-relaxed text-slate-400">
          U některých úkonů může úřad vyžadovat ověřený podpis. V takovém případě nestačí
          obyčejná plná moc — podpis je třeba ověřit na Czech POINTu nebo u notáře.
        </p>
      </section>

      <section id="oficialni-zdroje" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Oficiální zdroje</h2>
        <ul className="space-y-3 text-slate-400">
          <li>
            <a
              href="https://portal.gov.cz"
              className="text-amber-400 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Portál občana (Portál dopravy)
            </a>
          </li>
          <li>
            <a
              href="https://www.mdcr.cz"
              className="text-amber-400 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Ministerstvo dopravy ČR
            </a>
          </li>
          <li>
            <a
              href="https://www.zakonyprolidi.cz/cs/2000-56"
              className="text-amber-400 hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Zákon o podmínkách provozu vozidel na pozemních komunikacích
            </a>
          </li>
        </ul>
      </section>
    </ArticlePageLayout>
  );
}
