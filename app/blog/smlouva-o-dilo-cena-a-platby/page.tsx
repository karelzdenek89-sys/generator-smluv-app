import type { Metadata } from 'next';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';

export const metadata: Metadata = {
  title: 'Smlouva o dílo: jak zachytit cenu, zálohy a platební podmínky',
  description:
    'Pevná cena nebo položkový rozpočet, zálohy, platební milníky a vícepráce. Co ve smlouvě o dílo písemně sjednat, aby platební podmínky fungovaly v praxi.',
  alternates: {
    canonical: 'https://smlouvahned.cz/blog/smlouva-o-dilo-cena-a-platby',
  },
  openGraph: {
    title: 'Smlouva o dílo: jak zachytit cenu, zálohy a platební podmínky',
    description:
      'Pevná cena nebo rozpočet, zálohy a platební milníky, vícepráce. Praktický přehled toho, co ve smlouvě o dílo sjednat ohledně plateb.',
    url: 'https://smlouvahned.cz/blog/smlouva-o-dilo-cena-a-platby',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Smlouva o dílo: jak zachytit cenu, zálohy a platební podmínky',
  description:
    'Pevná cena nebo položkový rozpočet, zálohy, platební milníky a vícepráce. Co ve smlouvě o dílo písemně sjednat, aby platební podmínky fungovaly v praxi.',
  url: 'https://smlouvahned.cz/blog/smlouva-o-dilo-cena-a-platby',
  datePublished: '2026-04-15',
  dateModified: '2026-04-15',
  author: { '@type': 'Organization', name: 'SmlouvaHned', url: 'https://smlouvahned.cz' },
  publisher: {
    '@type': 'Organization',
    name: 'SmlouvaHned',
    logo: { '@type': 'ImageObject', url: 'https://smlouvahned.cz/og-image.png' },
  },
  image: 'https://smlouvahned.cz/og-image.png',
  inLanguage: 'cs',
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: 'https://smlouvahned.cz' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://smlouvahned.cz/blog' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Smlouva o dílo: cena a platby',
      item: 'https://smlouvahned.cz/blog/smlouva-o-dilo-cena-a-platby',
    },
  ],
};

export default function SmlouvaODiloCenaAPlatbyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }}
      />

      <ArticlePageLayout
        category="Podnikání a zakázky"
        readTime="7 min"
        dateTime="2026-04-15"
        dateLabel="15. dubna 2026"
        breadcrumbLabel="Smlouva o dílo: cena a platby"
        title="Smlouva o dílo: jak zachytit cenu, zálohy a platební podmínky"
        intro="Cena je ve smlouvě o dílo jedním z nejdůležitějších a zároveň nejčastěji nepřesně sjednaných bodů. Zákon nabízí několik způsobů, jak cenu určit — a způsob, který si strany zvolí, výrazně ovlivňuje to, co se stane při zdražení, změně rozsahu nebo překročení odhadovaných nákladů."
        toc={[
          { href: '#pevna-cena-vs-rozpocet', label: 'Pevná cena nebo položkový rozpočet' },
          { href: '#zalohy', label: 'Zálohy a jejich splatnost' },
          { href: '#platebni-milniky', label: 'Platební milníky a průběžné platby' },
          { href: '#viceprace', label: 'Vícepráce a změny zakázky' },
          { href: '#co-zapsat', label: 'Co do smlouvy vždy zapsat' },
        ]}
        primaryAction={{
          title: 'Potřebujete smlouvu o dílo sestavit online?',
          body: 'Formulář pro smlouvu o dílo — předmět díla, cena, termíny, sankce a předání. Standardizovaný dokument dle OZ č. 89/2012 Sb.',
          buttonLabel: 'Zobrazit smlouvu o dílo online',
          href: '/smlouva-o-dilo-online',
        }}
        trustBox={{
          generatorSuitable:
            'Standardní zakázka mezi dvěma stranami, kde jsou předmět díla, cena a termíny jasně dohodnuty a potřebujete je zachytit písemně v přehledném dokumentu.',
          lawyerSuitable:
            'Vysokohodnotová zakázka s komplexními platebními podmínkami, spor o vícepráce nebo situace, kde druhá strana zpochybňuje výši nebo splatnost odměny.',
        }}
        finalAction={{
          title: 'Chcete smlouvu o dílo připravit rovnou?',
          body: 'Vyplňte formulář online — předmět díla, cena, termíny a předávací podmínky. PDF ke stažení od 99 Kč.',
          buttonLabel: 'Vytvořit smlouvu o dílo',
          href: '/smlouva-o-dilo',
        }}
        relatedLinks={[
          { href: '/smlouva-o-dilo-online', label: 'Smlouva o dílo — průvodce' },
          { href: '/smlouva-o-dilo', label: 'Formulář smlouvy o dílo' },
          { href: '/smlouva-o-sluzbach', label: 'Smlouva o poskytování služeb' },
          { href: '/blog/smlouva-o-dilo-2026', label: 'Smlouva o dílo: předmět díla a termíny' },
          { href: '/blog/smlouva-o-sluzbach-2026', label: 'Smlouva o službách 2026' },
        ]}
      >
        <section id="pevna-cena-vs-rozpocet" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
            1. Pevná cena nebo položkový rozpočet
          </h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Občanský zákoník (§ 2620 a násl.) rozlišuje několik způsobů určení ceny díla. Nejjasnější
            je pevná cena — strany se dohodnou na konkrétní částce, která se nemění bez písemného
            souhlasu objednatele. Zhotovitel nese riziko toho, že cenu správně odhadl; pokud se
            ukáže, že dílo bude nákladnější, nemůže jednostranně cenu navýšit.
          </p>
          <p className="mb-4 leading-relaxed text-slate-400">
            Alternativou je cena určená odkazem na rozpočet. Pokud smlouva uvádí, že rozpočet
            je závazný, zhotovitel nemůže požadovat jeho překročení. Pokud je rozpočet nezávazný
            (orientační), zákon zhotoviteli přiznává právo na navýšení ceny, ale jen za splnění
            zákonných podmínek a povinnosti objednatele neprodleně informovat.
          </p>
          <p className="leading-relaxed text-slate-400">
            Pro většinu standardních zakázek je pevná cena přehlednější — objednatel ví, co zaplatí,
            a zhotovitel ví, na co se připravit. Tam, kde rozsah díla není předem přesně znám,
            bývá lepší cenu navázat na skutečně odvedené práce nebo ji rozdělit na fáze.
          </p>
        </section>

        <section id="zalohy" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
            2. Zálohy a jejich splatnost
          </h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Zákon zálohy u smlouvy o dílo výslovně neupravuje — jde o věc smluvní svobody.
            Zhotovitel může zálohu požadovat, ale jen pokud je sjednána ve smlouvě. Bez výslovného
            ujednání vzniká nárok na odměnu až po dokončení a předání díla.
          </p>
          <p className="mb-4 leading-relaxed text-slate-400">
            V praxi se zálohy pohybují v rozmezí 20–50 % z celkové ceny díla. Smlouva by měla
            jasně uvádět: výši zálohy, splatnost (nejlépe konkrétní datum nebo odkaz na podpis
            smlouvy) a co se se zálohou stane, pokud dílo nevznikne — zda propadá, nebo se vrací.
          </p>
          <p className="leading-relaxed text-slate-400">
            Pokud záloha plní funkci jistoty nebo smluvní pokuty při odstoupení od smlouvy,
            mělo by to být ve smlouvě výslovně napsáno. Neurčitá ujednání o záloze bývají
            zdrojem sporů při předčasném ukončení zakázky.
          </p>
        </section>

        <ArticleInlineCta
          title="Sestavte smlouvu o dílo s přehledně sjednanými platebními podmínkami"
          body="Formulář pro smlouvu o dílo — pevná cena, zálohy, termíny a předávací podmínky. PDF ke stažení od 99 Kč."
          buttonLabel="Pokračovat ke smlouvě o dílo"
          href="/smlouva-o-dilo"
          variant="subtle"
        />

        <section id="platebni-milniky" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
            3. Platební milníky a průběžné platby
          </h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            U rozsáhlejších zakázek se cena díla rozděluje do platebních milníků — každá platba
            je vázána na dokončení konkrétní části díla nebo splnění definované podmínky.
            Tento způsob chrání obě strany: objednatel platí jen za reálně odvedenou práci,
            zhotovitel průběžně dostává odměnu a nefinancuje celou zakázku ze svého.
          </p>
          <p className="mb-4 leading-relaxed text-slate-400">
            Platební milníky je vhodné ve smlouvě popsat konkrétně: co přesně musí být splněno,
            do kdy má objednatel potvrdit dokončení dané fáze a jaký je termín splatnosti fakturace.
            Vágní formulace jako „po dokončení druhé etapy" bez bližší definice mohou vést ke sporům
            o tom, kdy k dokončení skutečně došlo.
          </p>
          <p className="leading-relaxed text-slate-400">
            Dobrá praxe je u každého milníku sjednat akceptaci — krátký písemný nebo e-mailový
            souhlas objednatele s tím, že daná část díla byla splněna. Tento záznam pak slouží
            jako doklad při fakturaci i v případě pozdějšího sporu.
          </p>
        </section>

        <section id="viceprace" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
            4. Vícepráce a změny zakázky
          </h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Vícepráce jsou jednou z nejčastějších příčin sporů u smlouvy o dílo. Objednatel
            přidá požadavky v průběhu zakázky, zhotovitel je splní — a pak se strany nemohou
            dohodnout, zda a za kolik mají být zaplaceny.
          </p>
          <p className="mb-4 leading-relaxed text-slate-400">
            Smlouva by měla jasně definovat, co se za vícepráce považuje a jak se s nimi nakládá.
            Doporučený postup: vícepráce musí být písemně odsouhlaseny před jejich provedením,
            s dohodnutou cenou nebo způsobem ocenění. Ústní souhlas je obtížně prokazatelný —
            zpravidla nestačí.
          </p>
          <p className="leading-relaxed text-slate-400">
            Pokud smlouva postup pro vícepráce neřeší, může zhotovitel nárok na odměnu za
            neobjednané práce uplatnit — zákon tuto možnost za určitých okolností připouští.
            Spory o rozsah a cenu víceprací jsou ale časté a zpravidla se jim dá předejít
            jasným smluvním ujednáním, aniž by bylo nutné se dovolávat zákonných pravidel.
          </p>
        </section>

        <section id="co-zapsat" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
            5. Co do smlouvy vždy zapsat
          </h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Platební ujednání ve smlouvě o dílo by mělo být vždy konkrétní. Základní body,
            které se vyplatí mít písemně zachyceny: celková cena díla nebo způsob jejího
            určení, výše a splatnost zálohy (pokud je sjednána), platební milníky s vazbou
            na konkrétní výstupy, splatnost faktur a postup pro schvalování víceprací.
          </p>
          <p className="leading-relaxed text-slate-400">
            Smlouva by také měla říct, co se stane při prodlení s platbou — zda vzniká
            nárok na smluvní pokutu nebo zákonný úrok z prodlení. U rozšířeného dokumentu
            jsou tyto klauzule součástí standardního rozsahu; základní dokument pokrývá
            povinné náležitosti bez rozšířených sankcí.
          </p>
        </section>
      </ArticlePageLayout>
    </>
  );
}
