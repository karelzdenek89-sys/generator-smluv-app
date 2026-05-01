import type { Metadata } from 'next';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata: Metadata = {
  title: 'Valorizace nájemného 2026: Jak ji správně sjednat ve smlouvě',
  description:
    'Inflační doložka, valorizace nájemného a roční zvyšování nájmu v roce 2026. Co zákon umožňuje, jak klauzuli formulovat a jakým chybám se vyhnout.',
  alternates: {
    canonical: 'https://smlouvahned.cz/blog/valorizace-najemneho-2026',
  },
  openGraph: {
    title: 'Valorizace nájemného 2026: Jak ji správně sjednat ve smlouvě',
    description:
      'Inflační doložka, valorizace nájemného a roční zvyšování nájmu v roce 2026. Co zákon umožňuje a jak klauzuli formulovat.',
    url: 'https://smlouvahned.cz/blog/valorizace-najemneho-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Valorizace nájemného 2026: Jak ji správně sjednat ve smlouvě',
  description:
    'Inflační doložka, valorizace nájemného a roční zvyšování nájmu v roce 2026. Co zákon umožňuje, jak klauzuli formulovat a jakým chybám se vyhnout.',
  url: 'https://smlouvahned.cz/blog/valorizace-najemneho-2026',
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
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
      name: 'Valorizace nájemného 2026',
      item: 'https://smlouvahned.cz/blog/valorizace-najemneho-2026',
    },
  ],
};

export default function ValorizaceNajemneho2026Page() {
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
        category="Bydlení"
        readTime="8 min"
        dateTime="2026-05-02"
        dateLabel="2. května 2026"
        breadcrumbLabel="Valorizace nájemného 2026"
        title="Valorizace nájemného 2026: Jak ji správně sjednat ve smlouvě"
        intro="Po několika letech zvýšené inflace se valorizační doložka stala v nájemních smlouvách standardem. V roce 2026 ji řeší skoro každý pronajímatel — ať už sjednává novou smlouvu, nebo se chystá poprvé zvýšit nájem u běžící smlouvy. Tento průvodce shrnuje, co zákon umožňuje, jak doložku formulovat a kde dělají strany nejčastější chyby."
        toc={[
          { href: '#co-je-valorizace', label: 'Co je valorizace nájemného' },
          { href: '#co-rika-zakon', label: 'Co o valorizaci říká zákon' },
          { href: '#jak-formulovat', label: 'Jak doložku formulovat' },
          { href: '#bez-dolozky', label: 'Když smlouva valorizační doložku neobsahuje' },
          { href: '#caste-chyby', label: 'Nejčastější chyby u valorizace' },
        ]}
        primaryAction={{
          title: 'Připravujete novou nájemní smlouvu?',
          body: 'Generátor SmlouvaHned umí vložit valorizační doložku přímo do smlouvy — buď navázanou na index spotřebitelských cen ČSÚ, nebo jako pevné roční zvýšení o sjednané procento.',
          buttonLabel: 'Vytvořit nájemní smlouvu',
          href: '/najem',
        }}
        trustBox={{
          generatorSuitable:
            'Standardní pronájem bytu nebo domu, kde chcete zachytit roční valorizaci nájemného navázanou na inflaci nebo pevný procentní růst.',
          lawyerSuitable:
            'Komerční pronájmy s individuálně vyjednanou cenovou doložkou, dlouhodobé nájmy s atypickou indexací nebo spory o výpočet zvýšení.',
        }}
        finalAction={{
          title: 'Potřebujete kromě smlouvy i podklady k předání bytu?',
          body: 'Balíček pro pronajímatele kombinuje rozšířenou nájemní smlouvu s předávacím protokolem a potvrzením o převzetí kauce — typicky pro nový pronájem od základu.',
          buttonLabel: 'Otevřít balíček pro pronajímatele',
          href: '/balicek-pronajimatel',
        }}
        relatedLinks={[
          { href: '/najem', label: 'Nájemní smlouva' },
          { href: '/blog/najemni-smlouva-vzor-2026', label: 'Nájemní smlouva 2026: vzor a obsah' },
          { href: '/blog/kauce-pronajem-bytu-2026', label: 'Kauce při pronájmu bytu' },
          { href: '/blog/vypoved-z-najmu-bytu-2026', label: 'Výpověď z nájmu bytu' },
          { href: '/blog/chyby-pri-pronajmu-bytu-2026', label: 'Chyby při pronájmu bytu' },
        ]}
      >
        <section id="co-je-valorizace" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co je valorizace nájemného</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Valorizace nájemného je smluvně sjednaný mechanismus, který umožňuje pronajímateli pravidelně zvyšovat nájem bez nutnosti dohody se nájemcem při každé úpravě. Nejčastěji se navazuje na míru inflace měřenou indexem spotřebitelských cen, který každý měsíc zveřejňuje Český statistický úřad.
          </p>
          <p className="leading-relaxed text-slate-400">
            Cílem doložky je udržet reálnou hodnotu nájmu v čase. Bez valorizace nájemné nominálně neroste, ale jeho kupní síla s inflací klesá — což u dlouhodobějších smluv může za pět nebo deset let znamenat citelný rozdíl.
          </p>
        </section>

        <section id="co-rika-zakon" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co o valorizaci říká zákon</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Občanský zákoník v § 2248 výslovně předpokládá, že si strany mohou ve smlouvě sjednat každoroční zvyšování nájemného. Klauzule není vázaná na konkrétní formu — strany si mohou zvolit jak indexaci podle inflace, tak pevné roční navýšení o určité procento.
          </p>
          <p className="leading-relaxed text-slate-400">
            Pokud smlouva valorizační doložku obsahuje, pronajímatel ji uplatňuje jednostranně — typicky písemným oznámením s odkazem na příslušný index. Souhlas nájemce není potřeba, pokud je mechanismus ve smlouvě jasně popsaný.
          </p>
        </section>

        <section id="jak-formulovat" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Jak doložku formulovat</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            V praxi se používají dvě hlavní varianty. Volba mezi nimi není právní, ale ekonomická — odráží, jakou míru předvídatelnosti obě strany preferují.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [
                'Indexace podle ČSÚ',
                'Nájem se každoročně upraví o roční míru inflace zveřejněnou Českým statistickým úřadem za předchozí kalendářní rok. Spravedlivá pro obě strany — kopíruje reálný vývoj cen.',
              ],
              [
                'Pevné roční navýšení',
                'Nájem roste o předem sjednané procento (typicky 2–4 % ročně) bez ohledu na inflaci. Předvídatelnější pro nájemce, ale při vyšší inflaci znevýhodňuje pronajímatele.',
              ],
            ].map(([title, text]) => (
              <div key={title} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
                <div className="mb-1 text-sm font-black text-white">{title}</div>
                <p className="text-sm leading-7 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 leading-relaxed text-slate-400">
            Doložka by měla vždy obsahovat: termín, ke kterému se valorizace provádí (např. k 1. lednu každého roku), referenční období, ze kterého se index počítá, způsob oznámení nájemci a okamžik, od kterého se zvýšené nájemné platí.
          </p>
        </section>

        <section id="bez-dolozky" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Když smlouva valorizační doložku neobsahuje</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Pokud doložka ve smlouvě chybí, pronajímatel může nájemné zvýšit pouze postupem podle § 2249 OZ — tedy návrhem nájemci, a to nejvýše o 20 % během tří let, do výše obvyklého nájemného v daném místě. Pokud nájemce s návrhem nesouhlasí, rozhoduje na návrh pronajímatele soud.
          </p>
          <p className="leading-relaxed text-slate-400">
            Tato cesta je výrazně pomalejší a komplikovanější než smluvní valorizace. Proto se v dlouhodobých nájmech doporučuje doložku zařadit přímo do smlouvy — předchází se tím sporům i administrativní zátěži v každém roce.
          </p>
        </section>

        <section id="caste-chyby" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Nejčastější chyby u valorizace</h2>
          <ul className="space-y-3 text-slate-400">
            {[
              'Příliš obecná formulace ("nájem se valorizuje podle inflace") bez určení konkrétního indexu, období a termínu.',
              'Záměna nájemného a záloh na služby — valorizace se týká pouze nájemného, zálohy se upravují vyúčtováním, ne valorizační doložkou.',
              'Chybějící způsob oznámení nájemci — bez něj může nájemce zpochybnit, že se o zvýšení dozvěděl včas.',
              'Použití doložky retroaktivně, tj. dovymáhání zvýšení za roky, kdy ho pronajímatel nezvolil uplatnit.',
              'Pevné navýšení nad 5 % ročně bez vazby na inflaci — v období nízké inflace může být napadnutelné jako nepřiměřené.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 text-amber-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 leading-relaxed text-slate-400">
            Pro běžný pronájem bytu nebo domu funguje nejlépe jednoduchá indexace podle ČSÚ s pevným ročním termínem a jasným popisem výpočtu. Generátor SmlouvaHned takovou doložku vkládá automaticky v rozšířené variantě nájemní smlouvy.
          </p>
        </section>
      </ArticlePageLayout>
    </>
  );
}
