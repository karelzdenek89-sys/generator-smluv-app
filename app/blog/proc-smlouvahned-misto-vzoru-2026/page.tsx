import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import { getBlogHreflangAlternates } from '@/lib/seo/blog-hreflang-clusters';
import { canonicalUrl } from '@/lib/seo/site';
import Link from 'next/link';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import ArticleTrustBox from '@/app/components/blog/ArticleTrustBox';
import InformativeDisclaimer from '@/app/components/blog/InformativeDisclaimer';
import RelatedArticles from '@/app/components/blog/RelatedArticles';
import BlogArticleSchemas from '@/app/components/seo/BlogArticleSchemas';

const SLUG = 'proc-smlouvahned-misto-vzoru-2026';

export const metadata = {
  ...blogArticlePageMetadata(SLUG, {
    title: 'Proč zvolit SmlouvaHned místo staženého vzoru smlouvy (2026)',
    description:
      'Srovnání vzoru z internetu, generického generátoru a SmlouvaHned — § u klauzulí, upozornění ve formuláři, náhled před stažením PDF. Praktický průvodce bez právních slibů.',
    keywords: [
      'proč smlouvahned',
      'smlouvahned vs vzor',
      'generátor smluv online',
      'stažený vzor smlouvy',
      'smlouva s paragrafy',
      'online smlouva vs šablona',
      'smlouvahned recenze',
      'alternativa vzoru smlouvy 2026',
    ],
  }),
  alternates: {
    canonical: canonicalUrl(`/blog/${SLUG}`),
    languages: getBlogHreflangAlternates(SLUG),
  },
};

const faq = [
  {
    q: 'Čím se SmlouvaHned liší od staženého vzoru smlouvy?',
    a: 'Stažený soubor je statická šablona — údaje dopisujete ručně a nevíte dopředu, jak bude finální text vypadat. SmlouvaHned sestaví PDF z vašeho formuláře, u klíčových klauzulí uvádí § OZ nebo ZP a u rizikových voleb zobrazí upozornění ještě při vyplňování.',
  },
  {
    q: 'Je SmlouvaHned advokátní kancelář?',
    a: 'Ne. Jde o softwarový nástroj pro automatizovanou tvorbu standardizovaných dokumentů. Neposkytuje individuální právní služby ve smyslu zákona o advokacii.',
  },
  {
    q: 'Kdy nestačí generátor a patří věc advokátovi?',
    a: 'Při probíhajícím sporu, komerčním nájmu, nestandardním pracovním poměru, insolvenci, trestní odpovědnosti nebo transakci, kde potřebujete individuální posouzení konkrétní situace.',
  },
  {
    q: 'Musím smlouvu podepsat hned po vygenerování?',
    a: 'Ne. Nejdřív projdete formulář, zkontrolujete náhled a teprve pak rozhodnete, jestli PDF stáhnete. Máte čas porovnat text s tím, na čem jste se domluvili.',
  },
  {
    q: 'Funguje to i pro cizince, kteří neumí plynně česky?',
    a: 'U vybraných typů smluv lze formulář vyplnit s anglickou nebo ukrajinskou nápovědou. Výstupní smlouva zůstává primárně v češtině — u nájmu může být součástí i vysvětlující překlad, který není úřední.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export default function ProcSmlouvahnedMistoVzoru2026Page() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <BlogArticleSchemas slug={SLUG} datePublished="2026-07-01" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />

      <nav className="mb-8 text-xs text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-slate-300">
          SmlouvaHned
        </Link>
        <span className="mx-2 text-slate-700">›</span>
        <Link href="/blog" className="transition hover:text-slate-300">
          Blog
        </Link>
        <span className="mx-2 text-slate-700">›</span>
        <span className="text-slate-400">Proč SmlouvaHned místo vzoru</span>
      </nav>

      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">
            Obecné a praktické
          </span>
          <span className="text-xs text-slate-600">9 min čtení</span>
          <time className="text-xs text-slate-600" dateTime="2026-07-01">
            1. července 2026
          </time>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
          Proč zvolit SmlouvaHned místo staženého vzoru smlouvy (2026)
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-400">
          Hledáte „nájemní smlouva vzor“ nebo „kupní smlouva ke stažení“? Většina lidí začne u souboru z
          internetu. Tento článek vysvětlí, kde statická šablona končí, co typicky chybí u generických
          generátorů a proč dává smysl projít strukturovaný formulář s náhledem — bez slibů právní
          služby.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-xs">
          <Link
            href="/blog/expat/why-smlouvahned-not-template-2026-guide-en"
            className="rounded-full border border-white/10 px-3 py-1.5 text-slate-400 transition hover:border-amber-500/30 hover:text-amber-300"
            hrefLang="en"
          >
            English version
          </Link>
          <Link
            href="/blog/expat/why-smlouvahned-not-template-2026-guide-ua"
            className="rounded-full border border-white/10 px-3 py-1.5 text-slate-400 transition hover:border-amber-500/30 hover:text-amber-300"
            hrefLang="uk"
          >
            Українська версія
          </Link>
        </div>

        <ArticleInlineCta
          title="Chcete rovnou do formuláře?"
          body="Vyberte typ smlouvy, projděte krok za krokem a zkontrolujte náhled dokumentu před stažením PDF."
          buttonLabel="Přejít na generátor smluv"
          href="/"
          articleSlug={SLUG}
        />
      </header>

      <nav className="mb-10 rounded-2xl border border-white/8 bg-[#0c1426] p-6" aria-label="Obsah článku">
        <div className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Obsah článku</div>
        <ol className="space-y-1.5 text-sm text-slate-400">
          <li>
            <a href="#proc-lide-hledaji-vzor" className="transition hover:text-amber-400">
              1. Proč lidé stále sahají po vzoru z webu
            </a>
          </li>
          <li>
            <a href="#limity-vzoru" className="transition hover:text-amber-400">
              2. Co umí stažený vzor — a co ne
            </a>
          </li>
          <li>
            <a href="#genericke-generatory" className="transition hover:text-amber-400">
              3. Generické generátory a jejich slepá místa
            </a>
          </li>
          <li>
            <a href="#smlouvahned-jinak" className="transition hover:text-amber-400">
              4. Jak pracuje SmlouvaHned
            </a>
          </li>
          <li>
            <a href="#srovnani" className="transition hover:text-amber-400">
              5. Praktické srovnání
            </a>
          </li>
          <li>
            <a href="#cizinci" className="transition hover:text-amber-400">
              6. Pro cizince: formulář EN/UA, smlouva v češtině
            </a>
          </li>
          <li>
            <a href="#advokat" className="transition hover:text-amber-400">
              7. Kdy už patříte k advokátovi
            </a>
          </li>
          <li>
            <a href="#faq" className="transition hover:text-amber-400">
              8. Časté otázky
            </a>
          </li>
        </ol>
      </nav>

      <section id="proc-lide-hledaji-vzor" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Proč lidé stále sahají po vzoru z webu
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Vyhledávání „vzor smlouvy“ je pořád nejčastější první krok. Soubor z fóra nebo katalogu dokumentů
          vypadá rychle — otevřete Word, dopíšete jména a tisknete. Pro jednoduchou jednorázovou věc to
          někdy stačí.
        </p>
        <p className="leading-relaxed text-slate-400">
          Problém nastane, když smlouva má být konkrétní: jiná výše kauce, jiný termín předání auta,
          jiná doba výpovědi u nájmu. Šablona nezná vaše domluvy. Vy ji musíte dohledat v textu, ručně
          upravit a doufat, že jste nevynechali klauzuli, která se u daného typu smlouvy běžně řeší.
        </p>
      </section>

      <section id="limity-vzoru" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          2. Co umí stažený vzor — a co ne
        </h2>
        <p className="mb-6 leading-relaxed text-slate-400">
          Statický PDF nebo DOCX je obecný text. Neptejte se vás na strany, částky ani termíny. Neupozorní
          vás, když zvolíte neobvyklou pokutu nebo chybí souhlas pronajímatele s podnájmem.
        </p>
        <ul className="mb-6 space-y-3 text-slate-400">
          {[
            'Ruční dopisování — snadno zůstanou zástupné symboly nebo nesoulad v datech',
            'Bez odkazu na § OZ nebo zákoníku práce u jednotlivých ustanovení',
            'Bez náhledu finální podoby dokumentu před tiskem',
            'Obvykle jen jeden typ smlouvy — bez navazujícího předávacího protokolu',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 shrink-0 text-amber-500">•</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm leading-relaxed text-slate-400">
          <strong className="text-blue-400">Praktická poznámka:</strong> Vzor z internetu neřeší, jestli
          jste sjednali podmínky, které zákon umožňuje nebo naopak omezuje — jen nabízí obecnou formulaci.
          Posouzení konkrétní věci patří advokátovi.
        </div>
      </section>

      <section id="genericke-generatory" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Generické generátory a jejich slepá místa
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Online generátory „na pár kliků“ často vypíší text bez kontextu zákona. Některé schovávají
          důležité klauzule do vyšší varianty dokumentu. Jiné neukážou celý obsah, dokud neprojdete celým
          procesem.
        </p>
        <p className="leading-relaxed text-slate-400">
          U cizinců v ČR je další bariéra: formulář i PDF zůstávají jen v češtině, takže podepisujete text,
          kterému nerozumíte do detailu. To nenahrazuje advokáta — ale vysvětlující vedení formuláře může
          snížit riziko přehlédnutí zásadních bodů.
        </p>
      </section>

      <section id="smlouvahned-jinak" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Jak pracuje SmlouvaHned</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          SmlouvaHned je softwarový nástroj pro typické situace, kdy se strany shodly a chtějí podmínky
          zachytit písemně. Nejde o advokátní kancelář — neposkytuje individuální právní službu.
        </p>
        <p className="mb-6 leading-relaxed text-slate-400">
          Postup je jiný než u staženého souboru: nejdřív formulář, pak náhled, teprve potom rozhodnutí o
          stažení PDF sestaveného z vašich odpovědí.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              t: '§ u klauzulí',
              d: 'U důležitých ustanovení v PDF uvidíte, na který paragraf OZ nebo ZP text navazuje.',
            },
            {
              t: 'Upozornění ve formuláři',
              d: 'Při rizikových volbách se zobrazí hint — informativní, ne posouzení vaší věci.',
            },
            {
              t: 'Klauzule, na které se zapomíná',
              d: 'Kauce, předání vozidla, záruky u díla — v rozšířené variantě dokumentu.',
            },
            {
              t: '14 typů smluv',
              d: 'Nájem, prodej auta, práce, DPP, NDA, plná moc a další v jednom nástroji.',
            },
          ].map((item) => (
            <div key={item.t} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
              <div className="mb-1 text-sm font-black text-white">{item.t}</div>
              <p className="text-sm leading-relaxed text-slate-400">{item.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-slate-500">
          Více o metodice a limitech nástroje na{' '}
          <Link href="/o-projektu" className="text-amber-400 underline-offset-2 hover:underline">
            stránce O projektu
          </Link>
          .
        </p>
      </section>

      <section id="srovnani" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Praktické srovnání</h2>
        <div className="overflow-hidden rounded-2xl border border-white/8">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-[#0c1426]">
                <th className="px-4 py-3 font-black text-slate-400">Kritérium</th>
                <th className="px-4 py-3 font-black text-slate-500">Vzor z webu</th>
                <th className="px-4 py-3 font-black text-amber-400">SmlouvaHned</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              {[
                ['Vaše údaje v dokumentu', 'Ruční dopisování', 'PDF z formuláře'],
                ['Odkaz na zákon u klauzulí', 'Obvykle ne', '§ OZ / ZP u klíčových bodů'],
                ['Upozornění při vyplnění', 'Ne', 'Ano u rizikových voleb'],
                ['Náhled před stažením', 'Ne', 'Ano'],
                ['EN/UA vedení formuláře', 'Ne', 'U vybraných typů'],
              ].map(([k, a, b]) => (
                <tr key={k} className="border-b border-white/5">
                  <td className="px-4 py-3 font-medium text-slate-300">{k}</td>
                  <td className="px-4 py-3">{a}</td>
                  <td className="px-4 py-3 text-slate-200">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="cizinci" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          6. Pro cizince: formulář EN/UA a volitelné dvojjazyčné PDF
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          V Česku podepisujete smlouvy primárně v češtině. U nájmu, podnájmu, pracovní smlouvy, DPP, plné moci
          a prodeje auta můžete formulář vyplnit anglicky nebo ukrajinsky a přidat PDF CZ+EN nebo CZ+UA s
          jednotlivými ustanoveními spárovanými v jednom dokumentu. Překlad není úřední ani ověřený; v případě
          rozporu má přednost české znění.
        </p>
        <p className="leading-relaxed text-slate-400">
          Anglická a ukrajinská verze tohoto článku najdete v odkazech nahoře. Přehled všech expat průvodců
          je na{' '}
          <Link href="/en" className="text-amber-400 underline-offset-2 hover:underline">
            /en
          </Link>{' '}
          a{' '}
          <Link href="/ua" className="text-amber-400 underline-offset-2 hover:underline">
            /ua
          </Link>
          .
        </p>
      </section>

      <section id="advokat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          7. Kdy už patříte k advokátovi
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Generátor ani vzor nenahradí advokáta, pokud řešíte spor, komerční nájem, kolektivní vyjednávání,
          insolvenci, trestní odpovědnost nebo imigrační řízení vyžadující ověřené dokumenty.
        </p>
        <ArticleTrustBox
          generatorSuitable="Běžný nájem bytu, prodej auta mezi soukromníky, DPP, plná moc nebo smlouva o dílo — když jsou podmínky domluvené a typické."
          lawyerSuitable="Spory, nestandardní ujednání, vysoké hodnoty transakcí, firemní režimy a vše, kde potřebujete posouzení konkrétní situace."
        />
      </section>

      <section id="faq" className="mb-12 scroll-mt-6">
        <h2 className="mb-6 text-2xl font-black tracking-tight text-white">8. Časté otázky</h2>
        <div className="space-y-4">
          {faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-white/8 bg-[#0c1426] p-5"
            >
              <summary className="cursor-pointer list-none font-bold text-white marker:content-none">
                {item.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <InformativeDisclaimer className="mb-10" />

      <ArticleInlineCta
        title="Projděte formulář a zkontrolujte náhled"
        body="Vyberte typ smlouvy, doplňte údaje a porovnejte náhled s tím, na čem jste se domluvili — teprve pak stáhnete PDF."
        buttonLabel="Otevřít generátor smluv"
        href="/"
        articleSlug={SLUG}
      />

      <div className="mt-12 border-t border-white/8 pt-10">
        <div className="mb-5 text-xs font-black uppercase tracking-widest text-slate-600">
          Mohlo by vás zajímat
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/o-projektu', label: 'Jak nástroj funguje' },
            { href: '/najemni-smlouva', label: 'Nájemní smlouva — průvodce' },
            { href: '/blog/najemni-smlouva-vzor-2026', label: 'Nájemní smlouva vzor 2026' },
            { href: '/blog/expat/foreigners-czech-contracts-guide-en', label: 'Guides for foreigners (EN)' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-xl border border-white/8 bg-white/3 px-4 py-2 text-sm text-slate-400 transition hover:border-white/15 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      <RelatedArticles currentSlug={SLUG} />
    </article>
  );
}
