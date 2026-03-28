import type { Metadata } from 'next';
import Link from 'next/link';
import ContractCatalog from '@/app/components/ContractCatalog';

export const metadata: Metadata = {
  title: 'SmlouvaHned | Právní jistota pro vaše každodenní smlouvy — od 249 Kč',
  description: 'Vytvořte profesionálně zpracovanou smlouvu online — přesně podle vašich podmínek, v souladu s platným českým právem. Nájemní, kupní, darovací smlouva, DPP, NDA a další. Od 249 Kč.',
  openGraph: {
    title: 'SmlouvaHned | Právní jistota pro vaše každodenní smlouvy',
    description: 'Profesionálně zpracované smlouvy dle OZ. Formulář, výběr úrovně ochrany, PDF ke stažení. Od 249 Kč.',
    url: 'https://smlouvahned.cz',
    siteName: 'SmlouvaHned',
    type: 'website',
  },
};


const pricingTiers = [
  {
    name: 'Základní dokument',
    price: '249 Kč',
    description: 'Právně validní základ pro přímočaré situace',
    features: [
      'Všechna zákonná povinná ustanovení dle OZ',
      'Dokument sestavený dynamicky dle zadaných údajů',
      'PDF ke stažení ihned po platbě',
      'Aktualizováno pro českou legislativu 2026',
      'Odkaz ke stažení platný 7 dní',
    ],
    note: 'Vhodné tam, kde jsou podmínky jasné, obě strany se dohodly a nepředpokládají komplikace.',
    cta: 'Vytvořit smlouvu',
    href: '#vyber-smlouvy',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Rozšířená právní ochrana',
    price: '399 Kč',
    description: 'Smluvní pokuty, odpovědnost a sankční mechanismy',
    features: [
      'Vše ze Základního dokumentu',
      'Smluvní pokuty za porušení povinností',
      'Rozšířené odpovědnostní a doručovací klauzule',
      'Podrobná prohlášení smluvních stran',
      'Mechanismy pro případ nesplnění závazku',
      'Odkaz ke stažení platný 14 dní',
    ],
    note: 'Doporučujeme pro nájmy, prodeje vozidel, smlouvy o dílo a obchodní vztahy, kde záleží na jasně ošetřené odpovědnosti.',
    cta: 'Vytvořit smlouvu',
    href: '#vyber-smlouvy',
    highlighted: true,
    badge: 'Nejčastěji voleno',
  },
  {
    name: 'Kompletní balíček',
    price: '749 Kč',
    description: 'Úplná dokumentace s podporou a 30denní archivací',
    features: [
      'Vše z Rozšířené právní ochrany',
      'Průvodní instrukce k podpisu a archivaci',
      'Předávací protokol (dle typu smlouvy)',
      'Checklist: co ověřit před podpisem',
      'Dokument v systému po dobu 30 dní',
      'Prioritní e-mailová podpora — odpověď do 24 hodin',
    ],
    note: 'Vhodné pro situace s vyšší hodnotou transakce nebo tam, kde potřebujete mít kompletní dokumentaci a rychlou podporu.',
    cta: 'Vytvořit smlouvu',
    href: '#vyber-smlouvy',
    highlighted: false,
    badge: null,
  },
];

const faqItems = [
  {
    question: 'Jsou dokumenty právně platné?',
    answer: 'Ano. Každá smlouva je sestavena v souladu s platným českým právem — zejména zákonem č. 89/2012 Sb. (občanský zákoník) a dalšími relevantními předpisy. Právní platnost písemné smlouvy nevyžaduje účast notáře ani advokáta, pokud zákon nestanoví jinak.',
  },
  {
    question: 'Čím se liší Základní dokument od Rozšířené právní ochrany?',
    answer: 'Základní dokument obsahuje všechna zákonem povinná ustanovení. Rozšířená právní ochrana přidává klauzule, které vaši smluvní pozici lépe vymezují — zejména smluvní pokuty za porušení povinností, podrobnější odpovědnostní ustanovení a sankční mechanismy pro případ nesplnění závazku.',
  },
  {
    question: 'Jak celý proces funguje?',
    answer: 'Vyberete typ smlouvy, vyplníte formulář krok za krokem, zvolíte úroveň ochrany a po zaplacení obdržíte hotové PDF ke stažení. U Kompletního balíčku také průvodní instrukce a checklist.',
  },
  {
    question: 'Co obdržím po zaplacení?',
    answer: 'Ihned po dokončení platby obdržíte odkaz ke stažení vygenerovaného PDF. Platnost odkazu: Základní 7 dní, Rozšířená 14 dní, Kompletní 30 dní. U Kompletního balíčku také průvodní instrukce k podpisu, checklist a (dle typu smlouvy) předávací protokol.',
  },
  {
    question: 'Proč nezvolit bezplatný vzor z internetu?',
    answer: 'Volně dostupné vzory jsou zpravidla obecné a nezohledňují vaše konkrétní podmínky. V řadě případů postrádají klauzule, které jsou pro vaši ochranu klíčové. Dokumenty na tomto webu jsou sestavovány dynamicky na základě vámi zadaných podmínek — výsledkem je dokument odpovídající vaší konkrétní situaci, nikoli neurčitý vzor.',
  },
  {
    question: 'Jsou bezpečně uložena moje data?',
    answer: 'Údaje jsou uloženy pouze dočasně v šifrovaném úložišti po dobu 7–30 dní dle zakoupeného balíčku (Základní 7 dní, Rozšířená právní ochrana 14 dní, Kompletní balíček 30 dní) a poté automaticky smazány. Platební údaje zpracovává výhradně Stripe — na naše servery se nikdy nedostanou.',
  },
  {
    question: 'Je to náhrada individuální právní služby?',
    answer: 'Ne. Dokumenty na tomto webu představují standardní smluvní vzory pro typické situace. Nejsou náhradou za individuální právní poradenství. V případě nestandardních nebo složitějších případů doporučujeme konzultaci s advokátem.',
  },
];

// ── Structured Data ───────────────────────────────────────────────────────────

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SmlouvaHned',
  url: 'https://smlouvahned.cz',
  logo: 'https://smlouvahned.cz/favicon.ico',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@smlouvahned.cz',
    contactType: 'customer service',
    availableLanguage: 'Czech',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Generátor právních smluv',
  name: 'SmlouvaHned — Automatizovaný generátor smluv',
  description: 'Online platforma pro tvorbu standardních právních dokumentů — nájemní smlouva, kupní smlouva, NDA a další. Aktualizováno pro českou legislativu 2026.',
  url: 'https://smlouvahned.cz',
  provider: {
    '@type': 'Organization',
    name: 'SmlouvaHned',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Czech Republic',
  },
  offers: [
    { '@type': 'Offer', name: 'Základní dokument', price: '249', priceCurrency: 'CZK' },
    { '@type': 'Offer', name: 'Rozšířená právní ochrana', price: '399', priceCurrency: 'CZK' },
    { '@type': 'Offer', name: 'Kompletní balíček', price: '749', priceCurrency: 'CZK' },
  ],
};

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05080f] text-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.10),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08),transparent_22%),linear-gradient(to_bottom,#05080f,#08101e,#05080f)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24">

        {/* Header */}
        <header className="mb-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
            <div>
              <div className="font-black tracking-tight text-white">SmlouvaHned</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Právní dokumenty online</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
            <Link href="#vyber-smlouvy" className="hover:text-white transition">Smlouvy</Link>
            <Link href="#jak-to-funguje" className="hover:text-white transition">Jak to funguje</Link>
            <Link href="#cenik" className="hover:text-white transition">Ceník</Link>
            <Link href="#faq" className="hover:text-white transition">FAQ</Link>
            <Link href="/zakaznicka-zona" className="hover:text-white transition">Moje dokumenty</Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="mx-auto mb-16 max-w-5xl text-center md:mb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            Aktualizováno pro legislativu 2026
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight text-white md:text-6xl xl:text-7xl leading-[1.08]">
            Smlouva sestavená<br />
            <span className="text-amber-500 italic">podle vašich podmínek.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">
            Vyplňte formulář, zvolte rozsah smluvní dokumentace a stáhněte kompletní PDF.
            Každý dokument je generován dynamicky na základě vašich údajů — v souladu s českou legislativou 2026.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="#vyber-smlouvy"
              className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-8 py-4 text-base font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.28)] transition hover:bg-amber-400">
              Vytvořit smlouvu →
            </Link>
            <Link href="#jak-to-funguje" className="text-sm text-slate-400 hover:text-white transition">
              Jak to funguje? ↓
            </Link>
          </div>

          {/* Trust Row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              { icon: '✓', label: 'Aktualizováno pro legislativu 2026' },
              { icon: '✓', label: 'PDF ihned ke stažení' },
              { icon: '✓', label: 'Dokument podle zadaných údajů' },
              { icon: '✓', label: 'Pro standardní smluvní situace' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5 text-sm text-slate-400">
                <span className="text-amber-400 font-black text-xs">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Proč službě důvěřovat */}
        <section className="mb-16 md:mb-20">
          <div className="mb-8 text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Proč to funguje</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Proč službě důvěřovat</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              Nejde o stažení prázdného vzoru. Každý dokument vzniká dynamicky na základě toho, co do formuláře zadáte.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: '⚙️',
                title: 'Dokument sestavený z vašich údajů',
                body: 'Platforma nezobrazuje statický vzor — každá smlouva je vygenerována na základě vyplněného formuláře. Strany, podmínky, výše plnění i specifická ujednání se promítají přímo do textu dokumentu.',
                tag: 'Dynamické generování',
              },
              {
                icon: '📋',
                title: 'Formulář vás provede klíčovými částmi',
                body: 'Otázky jsou sestaveny tak, aby pokryly části dohody, které jsou právně relevantní. U některých typů smluv systém upozorní na hodnoty, které by mohly být nevymahatelné nebo v rozporu s právními limity.',
                tag: 'Strukturované zadávání',
              },
              {
                icon: '🗂️',
                title: 'Dokument zůstane dostupný v systému',
                body: 'Po zaplacení je dokument uložen a přístupný přes zákaznickou zónu — 7, 14 nebo 30 dní dle zvoleného balíčku. Stáhnout ho lze opakovaně z jakéhokoli zařízení.',
                tag: 'Zákaznická zóna',
              },
            ].map(card => (
              <div key={card.title} className="rounded-3xl border border-white/8 bg-[#0c1426] p-7 flex flex-col">
                <div className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">{card.tag}</div>
                <div className="mb-3 text-2xl">{card.icon}</div>
                <h3 className="mb-3 text-lg font-black text-white leading-snug">{card.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400 flex-grow">{card.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/5 bg-white/2 px-6 py-4 text-xs leading-relaxed text-slate-500 text-center">
            <span className="font-bold text-slate-400">Upozornění:</span> Dokumenty jsou standardní smluvní vzory pro typické situace a nejsou náhradou za individuální právní poradenství. Pro složitější nebo nestandardní případy doporučujeme konzultaci s advokátem.
          </div>
        </section>

        {/* Jak to funguje */}
        <section id="jak-to-funguje" className="mb-16 md:mb-20">
          <div className="rounded-[2rem] border border-white/8 bg-white/5 px-6 py-8 backdrop-blur-sm md:px-10 md:py-10">
            <div className="mb-8 text-center">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Jak to funguje</div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Čtyři kroky ke kompletnímu dokumentu</h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              {[
                {
                  step: '01',
                  title: 'Vyplníte údaje',
                  desc: 'Zadáte údaje o smluvních stranách a podmínky dohody. Přehledný formulář vás provede každou důležitou částí.',
                },
                {
                  step: '02',
                  title: 'Zkontrolujete návrh',
                  desc: 'Před platbou vidíte souhrn všech vyplněných podmínek. Vše si ověříte, než cokoliv zaplatíte.',
                },
                {
                  step: '03',
                  title: 'Vyberete variantu',
                  desc: 'Základní dokument nebo rozšířená ochrana s klauzulemi pro větší jistotu. Volíte sami dle situace.',
                },
                {
                  step: '04',
                  title: 'Stáhnete dokument',
                  desc: 'Po zaplacení obdržíte kompletní PDF připravené k tisku a podpisu. Ihned — bez čekání.',
                },
              ].map(s => (
                <div key={s.step} className="text-center md:text-left">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm font-black text-amber-400">{s.step}</div>
                  <h3 className="mt-3 text-xl font-black text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Výběr smluv */}
        <section id="vyber-smlouvy">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Nejčastější situace</div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Vyberte typ dokumentu</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400 md:text-right">
              Každý dokument je sestaven dynamicky na základě vašich údajů a aktualizován pro českou legislativu 2026.
            </p>
          </div>
          <ContractCatalog />
        </section>

        {/* Pro koho je služba */}
        <section className="mt-16 md:mt-20">
          <div className="mb-8 text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Pro koho</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Komu služba pomůže</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: '🏠',
                title: 'Pronajímatelé',
                desc: 'Nájemní a podnájemní smlouvy s předávacím protokolem. Jasná pravidla pro nájemníky — kauci, zvířata, Airbnb.',
              },
              {
                icon: '🏢',
                title: 'Podnikatelé a OSVČ',
                desc: 'Smlouvy o dílo, o spolupráci, o poskytování služeb, NDA. Ochrana IP práv, smluvní pokuty, exit klauzule.',
              },
              {
                icon: '👔',
                title: 'Zaměstnavatelé',
                desc: 'Pracovní smlouvy a dohody (DPP, DPČ) se všemi zákonnými náležitostmi dle zákoníku práce 2026.',
              },
              {
                icon: '👤',
                title: 'Fyzické osoby',
                desc: 'Darovací smlouvy, kupní smlouvy, uznání dluhu, plné moci. Bezpečné transakce mezi přáteli i cizími.',
              },
            ].map(c => (
              <div key={c.title} className="rounded-3xl border border-white/8 bg-[#0c1426] p-6">
                <div className="mb-3 text-3xl">{c.icon}</div>
                <h3 className="mb-2 text-lg font-black text-white">{c.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-amber-500/15 bg-amber-500/5 px-6 py-4 text-sm text-slate-400">
            <span className="font-bold text-amber-400">Vhodné pro:</span> Standardní situace, kde se strany dohodly na podmínkách a potřebují je správně zachytit písemně. <span className="text-slate-300">Není náhradou za individuální právní poradenství</span> — pro složitější případy, spory nebo nestandardní podmínky doporučujeme advokáta.
          </div>
        </section>

        {/* Proč ne náhodné vzory */}
        <section className="mt-16 md:mt-20">
          <div className="mb-8 text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Srovnání</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Čím se liší od vzorů z internetu?</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: '⚠️',
                problem: 'Zastaralé',
                desc: 'Volně dostupné vzory zpravidla neodpovídají aktuální legislativě. Občanský zákoník i zákoník práce se pravidelně mění.',
                solution: 'Dokumenty jsou aktualizovány pro českou legislativu 2026.',
              },
              {
                icon: '🕳️',
                problem: 'Obecné',
                desc: 'Stažený vzor neobsahuje vaše konkrétní údaje ani podmínky. Klauzule pro sankce, odpovědnost nebo doručování si musíte doplnit sami.',
                solution: 'Formulář sestavuje dokument dynamicky na základě zadaných údajů.',
              },
              {
                icon: '⚡',
                problem: 'Nepřizpůsobené',
                desc: 'Chybějící nebo nesprávně formulované klauzule snižují vymahatelnost smlouvy. Přepsaný vzor může mít nechtěné právní důsledky.',
                solution: 'Výstupem je dokument sestavený pro vaši konkrétní situaci, ne pro neurčitého uživatele.',
              },
            ].map(c => (
              <div key={c.problem} className="rounded-3xl border border-slate-800 bg-[#0c1426] p-7">
                <div className="mb-2 text-2xl">{c.icon}</div>
                <div className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-red-400">{c.problem}</div>
                <p className="mb-4 text-sm leading-relaxed text-slate-500">{c.desc}</p>
                <div className="border-t border-white/8 pt-4 text-sm font-semibold text-emerald-400">✓ {c.solution}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Ceník — 3 úrovně */}
        <section id="cenik" className="mt-16 md:mt-20">
          <div className="mb-10 text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Ceník</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Vyberte úroveň zpracování</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              Každý dokument je odborně zpracován. Liší se hloubkou právní ochrany, doprovodným materiálem a dostupnými službami.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-3xl border p-7 ${
                  tier.highlighted
                    ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-[#0c1426] shadow-[0_0_60px_rgba(245,158,11,0.12)]'
                    : 'border-slate-800 bg-[#0c1426]'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="rounded-full bg-amber-500 px-4 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black shadow-lg whitespace-nowrap">
                      {tier.badge}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 mb-1">{tier.name}</div>
                  <div className="text-4xl font-black text-white">{tier.price}</div>
                  <div className="mt-1 text-sm text-slate-400">{tier.description}</div>
                </div>

                <ul className="mb-6 flex-grow space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="mt-0.5 flex-shrink-0 text-amber-400">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <p className="mb-6 text-xs leading-relaxed text-slate-500 border-t border-white/8 pt-4">
                  {tier.note}
                </p>

                <Link
                  href={tier.href}
                  className={`block rounded-2xl py-3 text-center text-sm font-black uppercase tracking-tight transition ${
                    tier.highlighted
                      ? 'bg-amber-500 text-black hover:bg-amber-400'
                      : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Rychlá fakta */}
        <section className="mt-16 md:mt-20">
          <div className="rounded-[2rem] border border-white/8 bg-white/3 px-6 py-8 md:px-10 md:py-10">
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { icon: '📋', label: 'Pro standardní situace', desc: 'Nájem, práce, podnikání, půjčky, převody majetku — přehledná řešení pro typické smluvní vztahy.' },
                { icon: '🔤', label: 'Formulář místo paragrafů', desc: 'Zadáváte údaje, podmínky a hodnoty. Právní strukturu dokumentu zajistí platforma.' },
                { icon: '⚡', label: 'PDF ihned po zaplacení', desc: 'Vyplnění zabere přibližně 5 minut. Dokument ke stažení obdržíte obratem.' },
                { icon: '🔒', label: 'Bezpečná platba', desc: 'Platba probíhá přes Stripe. Čísla karet ani bankovní údaje se k nám nedostanou.' },
              ].map(c => (
                <div key={c.label} className="text-center">
                  <div className="mb-2 text-3xl">{c.icon}</div>
                  <div className="mb-1 text-sm font-black text-white">{c.label}</div>
                  <p className="text-xs leading-relaxed text-slate-400">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-16 md:mt-20">
          <div className="mb-8">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">FAQ</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Časté otázky</h2>
          </div>

          <div className="grid gap-4">
            {faqItems.map(item => (
              <details key={item.question}
                className="group rounded-3xl border border-white/8 bg-[#0c1426] p-6 open:border-amber-500/30">
                <summary className="cursor-pointer list-none pr-8 text-base font-bold text-white">
                  <div className="flex items-center justify-between gap-4">
                    <span>{item.question}</span>
                    <span className="text-slate-500 transition group-open:rotate-45 flex-shrink-0">+</span>
                  </div>
                </summary>
                <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-16 md:mt-20">
          <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 px-6 py-10 text-center md:px-10">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Připraveni začít?</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
              Vytvořte svůj dokument dnes
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
              Vyplnění formuláře zabere většinou méně než pět minut. Výsledkem je kompletní smlouva připravená k podpisu.
            </p>
            <Link href="#vyber-smlouvy"
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-amber-500 px-8 py-4 text-base font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
              Vytvořit smlouvu →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/8 pt-8 md:mt-20">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">SH</div>
                <div>
                  <div className="font-black tracking-tight text-white">SmlouvaHned</div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Právní dokumenty online</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Profesionálně zpracované dokumenty dle platného českého práva pro typické životní a podnikatelské situace.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Navigace</div>
                <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
                  <Link href="#vyber-smlouvy" className="hover:text-white transition">Smlouvy</Link>
                  <Link href="#jak-to-funguje" className="hover:text-white transition">Jak to funguje</Link>
                  <Link href="#cenik" className="hover:text-white transition">Ceník</Link>
                  <Link href="#faq" className="hover:text-white transition">FAQ</Link>
                  <Link href="/zakaznicka-zona" className="hover:text-white transition">Moje dokumenty</Link>
                </div>
                <div className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-slate-500">Podpora</div>
                <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
                  <a href="mailto:info@smlouvahned.cz" className="hover:text-amber-400 transition break-all">info@smlouvahned.cz</a>
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Bydlení & Majetek</div>
                <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
                  <Link href="/najem" className="hover:text-white transition">Nájemní smlouva</Link>
                  <Link href="/podnajem" className="hover:text-white transition">Podnájemní smlouva</Link>
                  <Link href="/auto" className="hover:text-white transition">Kupní smlouva (auto)</Link>
                  <Link href="/kupni" className="hover:text-white transition">Kupní smlouva</Link>
                  <Link href="/darovaci" className="hover:text-white transition">Darovací smlouva</Link>
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Práce & Podnikání</div>
                <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
                  <Link href="/pracovni" className="hover:text-white transition">Pracovní smlouva</Link>
                  <Link href="/dpp" className="hover:text-white transition">DPP</Link>
                  <Link href="/sluzby" className="hover:text-white transition">Smlouva o službách</Link>
                  <Link href="/smlouva-o-dilo" className="hover:text-white transition">Smlouva o dílo</Link>
                  <Link href="/spoluprace" className="hover:text-white transition">Smlouva o spolupráci</Link>
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Finance & Ostatní</div>
                <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
                  <Link href="/pujcka" className="hover:text-white transition">Zápůjčka</Link>
                  <Link href="/uznani-dluhu" className="hover:text-white transition">Uznání dluhu</Link>
                  <Link href="/nda" className="hover:text-white transition">NDA smlouva</Link>
                  <Link href="/plna-moc" className="hover:text-white transition">Plná moc</Link>
                  <Link href="/obchodni-podminky" className="hover:text-white transition">Obchodní podmínky</Link>
                  <Link href="/gdpr" className="hover:text-white transition">Ochrana osobních údajů</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/8 pt-6 text-xs leading-relaxed text-slate-500">
            <p>
              Dokumenty na tomto webu slouží pro typické situace a nepředstavují individuální právní službu ani právní zastoupení.
              U složitějších případů doporučujeme konzultaci s advokátem.
            </p>
            <p className="mt-3">© 2026 SmlouvaHned. Všechna práva vyhrazena.</p>
          </div>
        </footer>

      </div>
    </main>
  );
}
