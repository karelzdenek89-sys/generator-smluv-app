import type { Metadata } from 'next';
import Link from 'next/link';
import RelatedContracts from '@/app/components/RelatedContracts';
import { faqPageSchema, jsonLdScript } from '@/lib/schemas';

const BASE_URL = 'https://www.smlouvahned.cz';

const PAGE_TITLE = 'Smlouva o spolupráci 2026: podíl, IP práva a ukončení';
const PAGE_DESCRIPTION =
  'Průvodce smlouvou o spolupráci pro rok 2026. Co promyslet u podílu na výnosech, IP práv, mlčenlivosti, odpovědnosti a ukončení vztahu.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'smlouva o spolupráci vzor 2026',
    'smlouva o spolupráci online',
    'smlouva o obchodní spolupráci',
    'dohoda o spolupráci',
    'smlouva o spolupráci PDF',
    'smlouva o spolupráci Word',
    'smlouva o spolupráci OSVČ',
  ],
  alternates: { canonical: `${BASE_URL}/smlouva-o-spolupraci` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${BASE_URL}/smlouva-o-spolupraci`,
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

const faq = [
  {
    q: 'Je smlouva o spolupráci to samé jako společnost nebo joint venture?',
    a: 'Ne. Smlouva o spolupráci upravuje obchodní vztah dvou samostatných subjektů — nevzniká nová právní entita. Každá strana zůstává samostatným podnikatelským subjektem se svými povinnostmi vůči finančnímu úřadu a pojišťovnám.',
  },
  {
    q: 'Čím se liší od pracovní smlouvy nebo DPP?',
    a: 'Pracovní smlouva a DPP zakládají pracovněprávní vztah se zaměstnancem. Smlouva o spolupráci se uzavírá mezi samostatnými podnikateli nebo firmami, které si rozdělují role a výnosy bez vzniku závislého zaměstnání.',
  },
  {
    q: 'Kdy je lepší smlouva o dílo nebo smlouva o službách?',
    a: 'Smlouva o dílo se hodí, když jedna strana dodá konkrétní výsledek (web, rekonstrukce, design). Smlouva o službách pokrývá spíše opakované nebo průběžné činnosti. Smlouva o spolupráci dává smysl, když obě strany dlouhodobě sdílejí výnosy, zákazníky nebo projekt.',
  },
  {
    q: 'Jak rozdělit výnosy ze spolupráce?',
    a: 'Smlouva by měla přesně definovat, co tvoří základ pro výpočet (hrubé výnosy, čistý zisk, konkrétní faktury) a v jakém poměru se výnosy dělí. Doporučujeme zahrnout i postup při vyúčtování a termíny výplat.',
  },
  {
    q: 'Co je exit klauzule a proč ji mít ve smlouvě?',
    a: 'Exit klauzule definuje, jak spolupráce může skončit — výpověď s výpovědní dobou, okamžité ukončení při hrubém porušení nebo úpravu práv po skončení. Bez ní může ukončení způsobit spory o nevyplacené odměny nebo duševní vlastnictví.',
  },
  {
    q: 'Musím smlouvu o spolupráci registrovat?',
    a: 'Ne. Smlouva o spolupráci nevyžaduje registraci ani notářské ověření. Písemná forma je doporučena zejména při hodnotnějších spolupracích — chrání obě strany v případě sporu.',
  },
  {
    q: 'Nahrazuje vzor právní poradenství?',
    a: 'Ne. Generátor připraví standardizovaný dokument podle vámi zadaných údajů. U složitých B2B struktur, velkých investic nebo sporů je vhodné obrátit se na advokáta.',
  },
];

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'SmlouvaHned', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Smlouva o spolupráci vzor 2026', item: `${BASE_URL}/smlouva-o-spolupraci` },
  ],
};

const comparisonRows = [
  {
    document: 'Smlouva o spolupráci',
    when: 'Dva samostatní podnikatelé nebo firmy sdílejí projekt, zákazníky nebo výnosy',
    href: '/smlouva-o-spolupraci',
  },
  {
    document: 'Pracovní smlouva',
    when: 'Přijímáte zaměstnance do pracovněprávního poměru',
    href: '/pracovni-smlouva',
  },
  {
    document: 'Dohoda o provedení práce (DPP)',
    when: 'Krátkodobá práce do 300 hodin ročně se zaměstnancem',
    href: '/dohoda-o-provedeni-prace',
  },
  {
    document: 'Smlouva o dílo',
    when: 'Objednáváte konkrétní výsledek — stavbu, software, design',
    href: '/smlouva-o-dilo-online',
  },
  {
    document: 'Smlouva o službách',
    when: 'Opakované nebo průběžné služby mezi podnikateli',
    href: '/smlouva-o-sluzbach',
  },
];

export default function SmlouvaOSpolupraci() {
  const faqSchema = faqPageSchema(faq.map((item) => ({ question: item.q, answer: item.a })));

  return (
    <main className="min-h-screen bg-[#05080f] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqSchema) }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(132,204,22,0.07),transparent_30%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <nav className="mb-8 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">SmlouvaHned</Link>
          <span className="mx-2">›</span>
          <span className="text-slate-400">Smlouva o spolupráci</span>
        </nav>

        <header className="mb-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div className="font-black tracking-tight text-white">SmlouvaHned</div>
          </Link>
        </header>

        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lime-500/20 bg-lime-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-lime-400">
            § 1746 odst. 2 Občanského zákoníku
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl leading-tight mb-4">
            Smlouva o spolupráci<br />
            <span className="text-amber-500 italic">vzor 2026</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mb-4">
            Spolupracujete s jinou OSVČ nebo firmou na společném projektu, sdílíte zákazníky nebo
            výnosy? Smlouva o spolupráci pomůže písemně vymezit role, odměnu, mlčenlivost,
            odpovědnost a podmínky ukončení — bez zakládání nové společnosti.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl mb-8">
            Vyplníte formulář online a stáhnete dokument ve formátu PDF; editovatelný DOCX lze
            volitelně přidat v checkoutu. Nejde o individuální právní poradenství.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/spoluprace"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black shadow-[0_0_30px_rgba(245,158,11,0.25)] transition hover:bg-amber-400">
              Vytvořit smlouvu o spolupráci →
            </Link>
          </div>
          <div className="text-sm text-slate-500">Od 99 Kč · PDF ihned · Volitelně DOCX</div>
        </div>

        <section className="mb-12 rounded-3xl border border-white/8 bg-[#0c1426] p-8">
          <h2 className="text-2xl font-black text-white mb-6">Kdy se smlouva o spolupráci hodí</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: '🤝', title: 'Spolupráce dvou OSVČ', desc: 'Sdílení zákazníků, dovedností a výnosů — bez zakládání společnosti.' },
              { icon: '🏢', title: 'Obchodní partnerství', desc: 'Společný projekt nebo trh bez nové právní entity — jasné podmínky a exit.' },
              { icon: '💼', title: 'Referral a affiliate', desc: 'Odměna za přivedené zákazníky — provize z prodeje nebo služeb.' },
              { icon: '📋', title: 'Projektová spolupráce', desc: 'Sdílené náklady a výnosy na konkrétní zakázce nebo souprojektu.' },
            ].map((c) => (
              <div key={c.title} className="flex gap-3">
                <span className="text-2xl flex-shrink-0">{c.icon}</span>
                <div>
                  <div className="font-bold text-white text-sm mb-1">{c.title}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-4">Rozdíl oproti jiným smlouvám</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-3xl">
            Smlouva o spolupráci není náhradou pracovní smlouvy, DPP, smlouvy o dílo ani smlouvy o
            službách. Každý typ dokumentu řeší jiný vztah — výběr závisí na tom, zda jde o
            zaměstnání, dodání výsledku, průběžné služby nebo partnerskou spolupráci dvou subjektů.
          </p>
          <div className="overflow-hidden rounded-2xl border border-white/8">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-[#0c1426] text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 font-bold">Dokument</th>
                  <th className="px-4 py-3 font-bold">Typická situace</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.href} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3 font-semibold text-slate-200">
                      <Link href={row.href} className="text-amber-400 hover:text-amber-300 transition">
                        {row.document}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{row.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Co smlouva o spolupráci obsahuje</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: 'Rozsah spolupráce',
                text: 'Předmět spolupráce, role každé strany, územní nebo oborové vymezení a způsob koordinace.',
              },
              {
                title: 'Odměna a výnosy',
                text: 'Podíl na výnosech, fixní odměna nebo vlastní model — včetně základu pro výpočet a termínů vyúčtování.',
              },
              {
                title: 'Mlčenlivost',
                text: 'Ochrana obchodních a technických informací, případně sankce za porušení mlčenlivosti.',
              },
              {
                title: 'Odpovědnost',
                text: 'Rozdělení odpovědnosti za jednotlivé části spolupráce, náklady a případné škody.',
              },
              {
                title: 'Duševní vlastnictví',
                text: 'Kdo vlastní výsledky spolupráce — software, design, know-how nebo zákaznické vztahy.',
              },
              {
                title: 'Ukončení spolupráce',
                text: 'Výpovědní doba, důvody pro okamžité ukončení a co se stane s nevyřízenými závazky.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
                <h3 className="font-bold text-white text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-3xl border border-white/8 bg-[#0c1426] p-8">
          <h2 className="text-2xl font-black text-white mb-4">Checklist před podpisem</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              'Identifikace obou spolupracujících stran (IČO, sídlo, kontakt)',
              'Přesný popis předmětu a cíle spolupráce',
              'Rozdělení rolí a odpovědností',
              'Model odměny a periodicita vyúčtování',
              'Náklady — kdo co hradí',
              'Ochrana duševního vlastnictví (IP)',
              'Mlčenlivost a zákaz přetahování zákazníků',
              'Zákaz konkurence (omezení v čase a rozsahu)',
              'Exit klauzule — podmínky ukončení',
              'Závěrečná ustanovení a podpisy',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-lime-400 flex-shrink-0 mt-0.5">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">Časté otázky ke smlouvě o spolupráci</h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-white/8 bg-[#0c1426] p-5 open:border-lime-500/30">
                <summary className="cursor-pointer list-none font-bold text-white text-sm flex items-center justify-between gap-4">
                  <span>{item.q}</span>
                  <span className="text-slate-500 group-open:rotate-45 transition flex-shrink-0">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-lime-500/20 bg-gradient-to-br from-lime-500/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Sestavte smlouvu o spolupráci online</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Formulář pokrývá role, výnosy, IP práva, mlčenlivost a ukončení spolupráce. PDF ke stažení ihned po zaplacení.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/spoluprace"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
              Vytvořit smlouvu o spolupráci →
            </Link>
          </div>
          <div className="mt-3 text-xs text-slate-600">Od 99 Kč · § 1746 OZ · PDF ihned · Volitelně DOCX</div>
        </section>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition">← Všechny smlouvy</Link>
          <Link href="/spoluprace" className="hover:text-slate-300 transition">Formulář smlouvy o spolupráci</Link>
          <Link href="/smlouva-o-dilo-online" className="hover:text-slate-300 transition">Smlouva o dílo</Link>
          <Link href="/pracovni-smlouva" className="hover:text-slate-300 transition">Pracovní smlouva</Link>
          <Link href="/dohoda-o-provedeni-prace" className="hover:text-slate-300 transition">DPP</Link>
          <Link href="/smlouva-o-sluzbach" className="hover:text-slate-300 transition">Smlouva o službách</Link>
          <Link href="/nda-smlouva" className="hover:text-slate-300 transition">NDA smlouva</Link>
        </div>
      </div>
      <RelatedContracts currentHref="/smlouva-o-spolupraci" cluster="b2b" />
    </main>
  );
}
