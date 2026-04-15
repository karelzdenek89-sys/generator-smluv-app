import type { Metadata } from 'next';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';

export const metadata: Metadata = {
  title: 'DPP nebo DPČ: přehled rozdílů, limitů a kdy co použít v roce 2026',
  description:
    'Praktický přehled rozdílů mezi dohodou o provedení práce a dohodou o pracovní činnosti. Limity hodin, odvody, písemná forma a kdy která dohoda dává smysl.',
  alternates: {
    canonical: 'https://smlouvahned.cz/blog/dpp-dpc-porovnani-2026',
  },
  openGraph: {
    title: 'DPP nebo DPČ: přehled rozdílů, limitů a kdy co použít v roce 2026',
    description:
      'Srovnání DPP a DPČ — hodinové limity, limity pro odvody, povinné náležitosti a praktická doporučení.',
    url: 'https://smlouvahned.cz/blog/dpp-dpc-porovnani-2026',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'DPP nebo DPČ: přehled rozdílů, limitů a kdy co použít v roce 2026',
  description:
    'Praktický přehled rozdílů mezi dohodou o provedení práce a dohodou o pracovní činnosti. Limity hodin, odvody, písemná forma a kdy která dohoda dává smysl.',
  url: 'https://smlouvahned.cz/blog/dpp-dpc-porovnani-2026',
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
      name: 'DPP nebo DPČ: přehled rozdílů 2026',
      item: 'https://smlouvahned.cz/blog/dpp-dpc-porovnani-2026',
    },
  ],
};

export default function DppDpcPorovnani2026Page() {
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
        category="Práce a zaměstnání"
        readTime="6 min"
        dateTime="2026-04-15"
        dateLabel="15. dubna 2026"
        breadcrumbLabel="DPP nebo DPČ: rozdíly 2026"
        title="DPP nebo DPČ: přehled rozdílů, limitů a kdy co použít v roce 2026"
        intro="Dohoda o provedení práce a dohoda o pracovní činnosti jsou dva různé smluvní typy s odlišnými limity, povinnostmi a vhodným použitím. Rozdíl není jen v hodinových stropech — liší se i v podmínkách pro odvody a v tom, pro jaké typy spolupráce se hodí."
        toc={[
          { href: '#dpp-parametry', label: 'DPP — základní parametry' },
          { href: '#dpc-parametry', label: 'DPČ — základní parametry' },
          { href: '#klic-rozdily', label: 'Klíčové rozdíly přehledně' },
          { href: '#kdy-dpp', label: 'Kdy použít DPP' },
          { href: '#kdy-dpc', label: 'Kdy použít DPČ' },
          { href: '#co-musi-obsahovat', label: 'Co musí každá dohoda obsahovat' },
        ]}
        primaryAction={{
          title: 'Potřebujete DPP sestavit online?',
          body: 'Formulář pro dohodu o provedení práce — pracovní úkol, rozsah hodin, odměna, volitelná IP doložka. PDF ke stažení od 99 Kč.',
          buttonLabel: 'Zobrazit DPP online',
          href: '/dohoda-o-provedeni-prace',
        }}
        trustBox={{
          generatorSuitable:
            'Standardní brigáda, jednorázová zakázka nebo projektová spolupráce, kde jsou parametry dohodnuty a potřebujete je přehledně zachytit písemně.',
          lawyerSuitable:
            'Spor o klasifikaci pracovněprávního vztahu, souběh více dohod u jednoho zaměstnavatele nebo situace s nejasným daňovým a odvodovým dopadem — zde doporučujeme konzultaci s mzdovou účetní nebo pracovněprávním specialistou.',
        }}
        finalAction={{
          title: 'Chcete DPP připravit rovnou?',
          body: 'Vyplňte formulář online — výstupem je standardizovaný dokument strukturovaný dle zákoníku práce.',
          buttonLabel: 'Sestavit DPP',
          href: '/dpp',
        }}
        relatedLinks={[
          { href: '/dohoda-o-provedeni-prace', label: 'DPP — průvodce a generátor' },
          { href: '/dpp', label: 'Formulář DPP' },
          { href: '/pracovni-smlouva', label: 'Pracovní smlouva' },
          { href: '/blog/dpp-dohoda-provedeni-prace', label: 'Kdy použít DPP a co má obsahovat' },
          { href: '/blog/pracovni-smlouva-2026', label: 'Pracovní smlouva 2026' },
        ]}
      >
        <section id="dpp-parametry" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
            1. DPP — základní parametry
          </h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Dohoda o provedení práce (DPP) je upravena § 75 zákoníku práce. Lze ji uzavřít na rozsah
            práce nejvýše 300 hodin ročně u jednoho zaměstnavatele. Do tohoto limitu se počítají
            hodiny ze všech dohod o provedení práce uzavřených u téhož zaměstnavatele v daném
            kalendářním roce.
          </p>
          <p className="mb-4 leading-relaxed text-slate-400">
            DPP musí mít písemnou formu a musí v ní být vymezena práce (pracovní úkol), rozsah
            a doba, na kterou se dohoda uzavírá. Odměna není zákonem jako povinná náležitost
            stanovena, ale v praxi se vždy uvádí.
          </p>
          <p className="leading-relaxed text-slate-400">
            Z hlediska odvodů platí, že pokud odměna z DPP u jednoho zaměstnavatele nepřesáhne
            11 500 Kč v kalendářním měsíci, nevzniká účast na nemocenském pojištění a z odměny
            se neodvádí sociální a zdravotní pojištění. Při překročení tohoto limitu se odvody
            počítají z celé měsíční odměny. Tento limit byl zaveden od roku 2024.
          </p>
        </section>

        <section id="dpc-parametry" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
            2. DPČ — základní parametry
          </h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Dohoda o pracovní činnosti (DPČ) je upravena § 76 zákoníku práce. Na rozdíl od DPP
            nemá roční hodinový strop — je limitována průměrným týdenním rozsahem, který nesmí
            přesáhnout polovinu stanovené týdenní pracovní doby, tedy zpravidla 20 hodin týdně.
            Průměr se posuzuje za dobu, na kterou je dohoda uzavřena, nejdéle za 52 týdnů.
          </p>
          <p className="mb-4 leading-relaxed text-slate-400">
            DPČ musí být uzavřena písemně. Povinné náležitosti zahrnují sjednané práce, rozsah
            pracovní doby a dobu, na kterou se dohoda uzavírá.
          </p>
          <p className="leading-relaxed text-slate-400">
            Odvody z DPČ se platí při překročení rozhodného příjmu. Přesná hranice pro rok 2026
            se může lišit od předchozích let — doporučujeme ji před uzavřením dohody ověřit
            u mzdové účetní nebo na ČSSZ.
          </p>
        </section>

        <ArticleInlineCta
          title="Sestavte DPP přehledně online"
          body="Pracovní úkol, rozsah hodin, odměna a volitelná IP doložka. Standardizovaný dokument dle § 75 zákoníku práce. PDF ke stažení od 99 Kč."
          buttonLabel="Pokračovat k DPP"
          href="/dpp"
          variant="subtle"
        />

        <section id="klic-rozdily" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
            3. Klíčové rozdíly přehledně
          </h2>
          <div className="mb-6 overflow-x-auto rounded-2xl border border-white/8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-white/3">
                  <th className="px-4 py-3 text-left font-bold text-white">Parametr</th>
                  <th className="px-4 py-3 text-left font-bold text-amber-400">DPP</th>
                  <th className="px-4 py-3 text-left font-bold text-slate-300">DPČ</th>
                </tr>
              </thead>
              <tbody className="text-slate-400">
                <tr className="border-b border-white/5">
                  <td className="px-4 py-3">Hodinový limit</td>
                  <td className="px-4 py-3">300 hod./rok u jednoho zaměstnavatele</td>
                  <td className="px-4 py-3">Max. 20 hod./týden průměrně</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="px-4 py-3">Zákonný paragraf</td>
                  <td className="px-4 py-3">§ 75 ZP</td>
                  <td className="px-4 py-3">§ 76 ZP</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="px-4 py-3">Písemná forma</td>
                  <td className="px-4 py-3">Povinná</td>
                  <td className="px-4 py-3">Povinná</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="px-4 py-3">Limit bez odvodů SP/ZP</td>
                  <td className="px-4 py-3">Do 11 500 Kč/měs.</td>
                  <td className="px-4 py-3">Ověřit aktuální limit pro 2026</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Typické použití</td>
                  <td className="px-4 py-3">Brigáda, jednorázová zakázka, kreativní práce</td>
                  <td className="px-4 py-3">Pravidelná spolupráce, výpomoc do 20 hod./týden</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm leading-relaxed text-slate-500">
            Limity odvodů se mohou meziročně měnit. Před uzavřením dohody doporučujeme ověřit
            aktuální hodnoty na stránkách ČSSZ nebo u mzdové účetní.
          </p>
        </section>

        <section id="kdy-dpp" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
            4. Kdy použít DPP
          </h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            DPP je vhodná pro situace, kdy rozsah práce nepřesáhne 300 hodin ročně u jednoho
            zaměstnavatele a kdy jde o jednorázový úkol nebo časově ohraničenou spolupráci.
            Typicky: sezonní brigáda, překlad dokumentu, grafické zpracování, přednáška nebo
            jednorázový projekt.
          </p>
          <p className="leading-relaxed text-slate-400">
            DPP je zpravidla administrativně jednodušší než DPČ — zejména pokud odměna zůstane
            pod limitem pro odvody. Z pohledu zaměstnavatele to znamená nižší mzdové náklady
            a méně povinností vůči správě sociálního zabezpečení.
          </p>
        </section>

        <section id="kdy-dpc" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
            5. Kdy použít DPČ
          </h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            DPČ dává smysl tam, kde spolupráce probíhá pravidelně a kde by rozsah práce přesáhl
            300 hodin ročně — tedy kde DPP nestačí. Typicky jde o opakující se výpomoc s pevnějším
            rozvrhem, kdy si strany chtějí udržet flexibilitu bez plného pracovního poměru.
          </p>
          <p className="leading-relaxed text-slate-400">
            Limit 20 hodin týdně průměrně ale znamená, že DPČ není vhodná pro situace, kde by
            zaměstnanec pracoval ve výši nebo blízko standardního plného úvazku. Pokud by
            spolupráce fakticky odpovídala pracovnímu poměru, je vhodnější uzavřít pracovní
            smlouvu.
          </p>
        </section>

        <section id="co-musi-obsahovat" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
            6. Co musí každá dohoda obsahovat
          </h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Obě dohody vyžadují písemnou formu. Zákon pro DPP vyžaduje: vymezení pracovního
            úkolu, sjednaný rozsah práce a dobu, na kterou se dohoda uzavírá. Pro DPČ platí
            totéž s tím, že místo pracovního úkolu se uvádí sjednané práce a jejich rozsah
            nesmí přesáhnout zmíněný týdenní průměr.
          </p>
          <p className="leading-relaxed text-slate-400">
            V praxi se do obou dohod zpravidla uvádí i výše odměny, způsob a termín vyplacení,
            případně ujednání o mlčenlivosti nebo autorských právech u kreativních prací.
            Dobrá dohoda by měla být konkrétní — vágní vymezení úkolu nebo odměny bývá
            zdrojem nedorozumění.
          </p>
        </section>
      </ArticlePageLayout>
    </>
  );
}
