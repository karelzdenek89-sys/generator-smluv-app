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
            <Link href="/blog" className="hover:text-white transition">Blog</Link>
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
            Právní dokument sestavený<br />
            <span className="text-amber-500 italic">přesně pro vaši situaci.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">
            Vyplníte přehledný formulář krok za krokem. Dokument se sestaví podle vašich údajů
            a výsledkem je kompletní PDF připravené k podpisu — v souladu s platným českým právem.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="#vyber-smlouvy"
              className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-8 py-4 text-base font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.28)] transition hover:bg-amber-400">
              Vybrat typ smlouvy →
            </Link>
            <Link href="#jak-to-funguje" className="text-sm text-slate-400 hover:text-white transition">
              Jak to funguje? ↓
            </Link>
          </div>

          {/* Lawyer price anchor */}
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl border border-white/8 bg-white/3 px-5 py-3 text-sm text-slate-400">
            <span>Sepsání u advokáta:</span>
            <span className="font-bold text-slate-300 line-through decoration-slate-600">2 500–6 000 Kč</span>
            <span className="text-slate-600">·</span>
            <span>Zde od</span>
            <span className="font-black text-amber-400">249 Kč</span>
            <span>— dokument ihned ke stažení</span>
          </div>

          {/* Trust Row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              { icon: '✓', label: 'Dokument sestavený podle vašich údajů' },
              { icon: '✓', label: 'PDF ihned ke stažení' },
              { icon: '✓', label: 'Připraveno k podpisu' },
              { icon: '✓', label: 'Česká legislativa 2026' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5 text-sm text-slate-400">
                <span className="text-amber-400 font-black text-xs">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Factual trust bar */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-2xl border border-white/8 bg-white/3 px-6 py-3.5">
            {/* Secure payment */}
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Bezpečná platba přes Stripe</span>
            </div>
            <div className="hidden h-4 w-px bg-white/10 sm:block" />
            {/* PDF ihned */}
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <span>PDF ihned po zaplacení</span>
            </div>
            <div className="hidden h-4 w-px bg-white/10 sm:block" />
            {/* Legislativa */}
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Česká legislativa 2026</span>
            </div>
          </div>
        </section>

        {/* Tři pilíře produktové převahy */}
        <section className="mb-16 md:mb-20">
          <div className="mb-8 text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Jak to vzniká</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Nejde o vzor. Jde o váš dokument.</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              Volně dostupné vzory jsou obecné a statické. Zde zadáte své podmínky
              a výsledkem je dokument sestavený pro vaši konkrétní situaci.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: '📝',
                title: 'Dokument podle zadaných údajů',
                body: 'Nezobrazujeme předvyplněný vzor s prázdnými poli. Každý dokument se sestaví na základě toho, co do formuláře zadáte — strany, podmínky, výše plnění, termíny. Výsledek odpovídá vaší konkrétní dohodě.',
                tag: 'Sestavení podle vašich dat',
              },
              {
                icon: '📄',
                title: 'Profesionální výstup v PDF',
                body: 'Výstupem je přehledně strukturovaný dokument ve formátu PDF — s titulní stranou, číslovanými ustanoveními a jasnou hierarchií textu. Připravený k přímému vytištění a podpisu, bez nutnosti dalších úprav.',
                tag: 'Připraveno k podpisu',
              },
              {
                icon: '🧭',
                title: 'Přehledný postup krok za krokem',
                body: 'Formulář vás provede každou důležitou částí dohody. Nemusíte znát právní terminologii — otázky jsou formulovány srozumitelně a pokrývají to, co je pro daný typ smlouvy právně relevantní.',
                tag: 'Strukturované zadávání',
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

        </section>

        {/* Jak to funguje */}
        <section id="jak-to-funguje" className="mb-16 md:mb-20">
          <div className="rounded-[2rem] border border-white/8 bg-white/5 px-6 py-8 backdrop-blur-sm md:px-10 md:py-10">
            <div className="mb-8 text-center">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Postup</div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Čtyři kroky ke kompletnímu dokumentu</h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              {[
                {
                  step: '01',
                  title: 'Vyplníte údaje',
                  desc: 'Zadáte údaje o smluvních stranách a podmínky dohody. Formulář vás provede každou důležitou částí — srozumitelně, bez právního žargonu.',
                },
                {
                  step: '02',
                  title: 'Zkontrolujete souhrn',
                  desc: 'Před platbou vidíte přehled všech zadaných podmínek. Ověříte si, co dokument bude obsahovat, ještě než cokoliv zaplatíte.',
                },
                {
                  step: '03',
                  title: 'Zvolíte úroveň zpracování',
                  desc: 'Základní dokument se zákonnou strukturou, nebo rozšířená verze se smluvními pokutami a odpovědnostními klauzulemi. Volíte podle situace.',
                },
                {
                  step: '04',
                  title: 'Stáhnete hotový dokument',
                  desc: 'Po zaplacení obdržíte kompletní PDF sestavené podle vašich údajů, připravené k tisku a podpisu. Ihned, bez čekání.',
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

        {/* Proč lidé volí SmlouvaHned */}
        <section className="mt-16 md:mt-20">
          <div className="mb-8 text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Proč to funguje</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Proč lidé volí SmlouvaHned</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              Platná smlouva nemusí znamenat návštěvu kanceláře. Tady je proč si ji lidé vyřeší sami.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: '⚡',
                title: 'Hotovo do 10 minut',
                desc: 'Formulář je přehledný a strukturovaný. Vyplníte jej i bez právního vzdělání — průvodce vás provede každým krokem.',
                tag: 'Rychlost',
              },
              {
                icon: '📄',
                title: 'PDF rovnou k podpisu',
                desc: 'Žádné prázdné kolonky ani šablony k přepisování. Výsledek je kompletní dokument — stačí vytisknout nebo zaslat e-mailem.',
                tag: 'Výstup',
              },
              {
                icon: '⚖️',
                title: 'Sestaveno dle platného OZ',
                desc: 'Každý typ smlouvy vychází z příslušných ustanovení občanského zákoníku. Obsah se aktualizuje při každé legislativní změně.',
                tag: 'Právní základ',
              },
              {
                icon: '🔒',
                title: 'Bez nutnosti advokáta',
                desc: 'Pro standardní situace, kde se strany dohodly, není právník nutný. Online řešení šetří čas i desítky set korun za sepsání.',
                tag: 'Jednoduchost',
              },
            ].map(card => (
              <div key={card.title} className="flex flex-col rounded-3xl border border-white/8 bg-[#0c1426] p-7">
                <div className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">{card.tag}</div>
                <div className="mb-3 text-2xl">{card.icon}</div>
                <h3 className="mb-2 text-base font-black text-white leading-snug">{card.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400 flex-grow">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Průvodce & Blog */}
        <section className="mt-16 md:mt-20">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Průvodce a tipy</div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Než smlouvu vytvoříte</h2>
            </div>
            <Link href="/blog" className="text-sm text-slate-400 hover:text-white transition md:text-right">
              Všechny průvodce →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                tag: 'Bydlení',
                title: 'Nájemní smlouva 2026 — co musí obsahovat a čeho se vyvarovat',
                excerpt: 'Které klauzule chrání pronajímatele, které nájemce, a co se nejčastěji opomíjí. Včetně chyb, kvůli kterým soudy smlouvy neuznají.',
                href: '/blog/najemni-smlouva-vzor-2026',
                cta: 'Vytvořit nájemní smlouvu',
                ctaHref: '/najem',
                color: 'text-amber-400',
              },
              {
                tag: 'Prodej vozidla',
                title: 'Kupní smlouva na auto — VIN, STK, vady a bezpečné předání',
                excerpt: 'Co zkontrolovat před podpisem, jak zapsat stav vozidla a jak se bránit, pokud kupující tvrdí, že auto mělo skryté vady.',
                href: '/blog/kupni-smlouva-na-auto-2026',
                cta: 'Vytvořit kupní smlouvu na auto',
                ctaHref: '/auto',
                color: 'text-sky-400',
              },
              {
                tag: 'OSVČ a podnikatelé',
                title: 'Smlouva o dílo 2026 — pevná cena, sankce a akceptační postup',
                excerpt: 'Kdy použít smlouvu o dílo místo smlouvy o službách, jak nastavit cenu díla a co dělat, když objednatel nezaplatí.',
                href: '/blog/smlouva-o-dilo-2026',
                cta: 'Vytvořit smlouvu o dílo',
                ctaHref: '/smlouva-o-dilo',
                color: 'text-fuchsia-400',
              },
            ].map(article => (
              <div key={article.href} className="group flex flex-col rounded-3xl border border-white/8 bg-[#0c1426] overflow-hidden">
                {/* Top accent */}
                <div className="px-7 pt-6 pb-5 flex-grow">
                  <div className={`mb-3 text-[10px] font-black uppercase tracking-[0.2em] ${article.color}`}>{article.tag}</div>
                  <h3 className="mb-3 text-base font-black text-white leading-snug">
                    <Link href={article.href} className="hover:text-amber-400 transition">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">{article.excerpt}</p>
                </div>
                {/* Bottom actions */}
                <div className="border-t border-white/8 px-7 py-4 flex items-center justify-between gap-3">
                  <Link
                    href={article.href}
                    className="text-xs text-slate-500 hover:text-slate-300 transition underline underline-offset-4 decoration-slate-700"
                  >
                    Číst průvodce →
                  </Link>
                  <Link
                    href={article.ctaHref}
                    className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-[11px] font-black uppercase tracking-tight text-amber-400 hover:bg-amber-500/20 transition"
                  >
                    {article.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Proč ne náhodné vzory */}
        <section className="mt-16 md:mt-20">
          <div className="mb-8 text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Proč ne vzor zdarma</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Čím se liší od stažení vzoru?</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: '⚠️',
                problem: 'Zastaralé',
                desc: 'Volně dostupné vzory zpravidla neodpovídají aktuální legislativě. Občanský zákoník i zákoník práce se pravidelně mění.',
                solution: 'Šablony jsou udržovány v souladu s aktuální českou legislativou, včetně změn OZ a zákoníku práce.',
              },
              {
                icon: '🕳️',
                problem: 'Obecné',
                desc: 'Stažený vzor neobsahuje vaše konkrétní údaje ani podmínky. Klauzule pro sankce, odpovědnost nebo doručování si musíte doplnit sami.',
                solution: 'Formulář sestaví dokument na základě vašich údajů — výsledek obsahuje vaše jména, podmínky a hodnoty, ne prázdná místa.',
              },
              {
                icon: '⚡',
                problem: 'Nepřizpůsobené',
                desc: 'Chybějící nebo nesprávně formulované klauzule snižují vymahatelnost smlouvy. Přepsaný vzor může mít nechtěné právní důsledky.',
                solution: 'Výstupem je strukturovaný dokument s klauzulemi odpovídajícími vašemu případu, připravený k podpisu.',
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

        {/* Ukázkové PDF — Transparency Bomb */}
        <section className="mt-16 md:mt-20">
          <div className="mb-8 text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Ukázka výstupu</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Jak vypadá váš dokument</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              Žádné prázdné kolonky k ručnímu vypisování. Každý dokument je vysázen podle vašich dat — připravený k přímému podpisu.
            </p>
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
            {/* PDF mock */}
            <div className="relative mx-auto w-full max-w-sm flex-shrink-0 md:mx-0">
              {/* Outer paper shadow */}
              <div className="relative overflow-hidden rounded-2xl shadow-[0_8px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
                {/* PDF Header bar */}
                <div className="bg-[#0a0f1e] px-6 pt-6 pb-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <div className="text-[8px] font-black uppercase tracking-[0.25em] text-amber-400">SmlouvaHned.cz</div>
                      <div className="mt-0.5 text-xs font-black text-white">NÁJEMNÍ SMLOUVA</div>
                    </div>
                    <div className="rounded border border-amber-500/40 px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.2em] text-amber-400">
                      ROZŠÍŘENÁ
                    </div>
                  </div>
                  {/* Gold line */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-amber-500 to-amber-300" />
                </div>

                {/* PDF Body */}
                <div className="bg-[#f8f7f2] px-6 py-5">
                  {/* Parties */}
                  <div className="mb-4">
                    <div className="mb-1.5 text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Smluvní strany</div>
                    <div className="space-y-1.5 text-[8px] leading-relaxed text-slate-700">
                      <div><span className="font-bold">Pronajímatel:</span> Jan Novák, nar. 15. 3. 1980, bytem Hlavní 12, Praha 1</div>
                      <div><span className="font-bold">Nájemce:</span> Petra Svobodová, nar. 2. 7. 1992, bytem Nová 5, Brno</div>
                    </div>
                  </div>

                  {/* Key terms */}
                  <div className="mb-4 rounded-lg border border-slate-200 bg-white p-3">
                    <div className="mb-2 text-[8px] font-black uppercase tracking-[0.18em] text-slate-500">Klíčové podmínky</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[7.5px] text-slate-600">
                      <div><span className="font-semibold">Předmět:</span> Byt 2+1, 58 m²</div>
                      <div><span className="font-semibold">Nájemné:</span> 18 500 Kč/měs.</div>
                      <div><span className="font-semibold">Kauce:</span> 37 000 Kč</div>
                      <div><span className="font-semibold">Výpovědní lhůta:</span> 3 měsíce</div>
                    </div>
                  </div>

                  {/* Sections preview */}
                  <div className="mb-3 space-y-1.5">
                    {['§ 1 — Předmět nájmu a popis nemovitosti', '§ 2 — Nájemné a způsob platby', '§ 3 — Kauce a podmínky vrácení', '§ 4 — Smluvní pokuta za prodlení s platbou', '§ 5 — Práva a povinnosti stran'].map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-[7.5px] text-slate-600">
                        <div className="h-px w-3 flex-shrink-0 bg-amber-400" />
                        {s}
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-[7px] text-slate-400 italic">
                      <div className="h-px w-3 flex-shrink-0 bg-slate-300" />
                      + 8 dalších ustanovení…
                    </div>
                  </div>
                </div>

                {/* Blur overlay - bottom */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#05080f] via-[#05080f]/80 to-transparent" />

                {/* CTA over blur */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <a href="#vyber-smlouvy"
                    className="rounded-xl bg-amber-500 px-5 py-2 text-[11px] font-black uppercase tracking-tight text-black shadow-lg transition hover:bg-amber-400">
                    Vytvořit vlastní dokument →
                  </a>
                </div>
              </div>

              {/* Page indicator */}
              <div className="mt-3 text-center text-[10px] text-slate-500">Strana 1 / 4 · PDF, 4 strany, font Roboto</div>
            </div>

            {/* Feature bullets */}
            <div className="flex flex-col justify-center gap-5">
              {[
                {
                  icon: '🎨',
                  title: 'Vysázeno algoritmem, ne šablonou',
                  desc: 'Každý odstavec je generován dynamicky na základě vašich dat. Výsledkem je dokument přesně pro váš případ — ne neurčitý vzor s prázdnými místy.',
                },
                {
                  icon: '📐',
                  title: 'Profesionální typografie',
                  desc: 'Font Roboto, zlatá linka, strukturovaná hierarchie nadpisů. Dokument vypadá profesionálně při předání i při případném soudním řízení.',
                },
                {
                  icon: '🔖',
                  title: 'Badge dle úrovně ochrany',
                  desc: 'Každé PDF nese označení zakoupené úrovně (Základní / Rozšířená / Kompletní). Víte přesně, co jste zaplatili a co dokument obsahuje.',
                },
                {
                  icon: '✅',
                  title: 'Připraveno k přímému podpisu',
                  desc: 'Všechna zákonná ustanovení, smluvní strany, podmínky a klauzule na správném místě. Stačí vytisknout a podepsat — nebo podepsat elektronicky.',
                },
              ].map(f => (
                <div key={f.title} className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-xl">
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">{f.title}</div>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ceník — 3 úrovně */}
        <section id="cenik" className="mt-16 md:mt-20">
          <div className="mb-10 text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Ceník</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Vyberte úroveň zpracování</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              Liší se rozsahem smluvních ujednání, doprovodným materiálem a délkou archivace. Zákonný základ mají všechny varianty společný.
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

        {/* Garance technické správnosti + Payment trust */}
        <section className="mt-10 md:mt-12">
          <div className="rounded-[2rem] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/8 to-[#0c1426] px-6 py-8 md:px-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
              {/* Guarantee */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-xl">🛡️</div>
                  <div className="text-base font-black text-white">Garance technické správnosti</div>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">
                  Pokud váš dokument nebude obsahovat všechna povinná pole nebo narazíte na technickou chybu při generování,{' '}
                  <span className="font-bold text-white">vrátíme vám 100 % částky zpět</span> a smlouvu vám opravíme zdarma.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Garance se vztahuje na technické chyby systému. Nepokrývá případy, kdy zákazník zadal nesprávné údaje.
                </p>
              </div>

              {/* Divider */}
              <div className="hidden w-px self-stretch bg-white/8 md:block" />

              {/* Methodology */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-xl">📜</div>
                  <div className="text-base font-black text-white">Metodika a aktualizace 2026</div>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">
                  Šablony jsou postaveny na modulární logice, která reflektuje aktuální znění{' '}
                  <span className="font-bold text-white">Občanského zákoníku č. 89/2012 Sb.</span> ve znění k 1. 1. 2026.
                  Každé ustanovení odpovídá konkrétnímu paragrafu — žádná obecná formulace bez právního základu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Rychlá fakta */}
        <section className="mt-16 md:mt-20">
          <div className="rounded-[2rem] border border-white/8 bg-white/3 px-6 py-8 md:px-10 md:py-10">
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { icon: '📋', label: 'Čtrnáct typů dokumentů', desc: 'Nájem, práce, podnikání, půjčky, převody majetku — dokumenty pro typické smluvní situace v jednom místě.' },
                { icon: '🔤', label: 'Zadáváte data, ne paragrafy', desc: 'Vyplníte údaje, podmínky a hodnoty. Právní strukturu a formulaci zajistí systém.' },
                { icon: '⚡', label: 'Dokument ihned po zaplacení', desc: 'Vyplnění formuláře zabere přibližně 5 minut. Hotový PDF ke stažení obdržíte obratem.' },
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
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Začít</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
              Váš dokument je na pár kliknutí
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
              Formulář vyplníte za přibližně 5 minut. Výsledkem je přehledný právní dokument sestavený podle vašich podmínek, připravený k podpisu.
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
                  <Link href="/blog" className="hover:text-white transition">Blog</Link>
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
                <div className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-slate-500">Průvodce & Blog</div>
                <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
                  <Link href="/blog" className="hover:text-white transition">Všechny články</Link>
                  <Link href="/blog/najemni-smlouva-vzor-2026" className="hover:text-white transition">Nájemní smlouva 2026</Link>
                  <Link href="/blog/kupni-smlouva-na-auto-2026" className="hover:text-white transition">Kupní smlouva na auto</Link>
                  <Link href="/blog/smlouva-o-dilo-2026" className="hover:text-white transition">Smlouva o dílo 2026</Link>
                  <Link href="/blog/darovaci-smlouva-2026" className="hover:text-white transition">Darovací smlouva 2026</Link>
                  <Link href="/blog/pracovni-smlouva-2026" className="hover:text-white transition">Pracovní smlouva 2026</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Payment trust bar */}
          <div className="mt-8 border-t border-white/8 pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Zabezpečená platba</span>
                <div className="flex items-center gap-2 ml-1">
                  {/* Stripe badge */}
                  <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1">
                    <svg className="h-3.5 w-auto" viewBox="0 0 60 25" fill="none" aria-label="Stripe">
                      <path d="M5.5 9.8c0-1.5 1.2-2.1 3.2-2.1 2.8 0 6.4.9 9.2 2.4V4.4C15.3 3 12.1 2.4 8.7 2.4 3.5 2.4 0 5.1 0 10c0 7.7 10.6 6.5 10.6 9.8 0 1.8-1.6 2.4-3.7 2.4-3.2 0-7.3-1.3-10.6-3.1v5.8c3.6 1.6 7.3 2.2 10.6 2.2 5.4 0 9.2-2.7 9.2-7.6C16.1 11.8 5.5 13.2 5.5 9.8z" fill="#635BFF" transform="translate(1,0)"/>
                      <text x="20" y="17" fontSize="13" fontWeight="800" fill="#635BFF" fontFamily="Arial">stripe</text>
                    </svg>
                  </div>
                  {/* Visa */}
                  <div className="flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-2.5 py-1">
                    <svg className="h-3.5 w-auto" viewBox="0 0 60 20" aria-label="Visa">
                      <text x="0" y="16" fontSize="18" fontWeight="900" fill="#1A1F71" fontFamily="Arial" letterSpacing="-1">VISA</text>
                    </svg>
                  </div>
                  {/* Mastercard */}
                  <div className="flex items-center justify-center rounded-md border border-white/10 bg-white/5 px-2 py-1">
                    <svg className="h-5 w-auto" viewBox="0 0 38 24" aria-label="Mastercard">
                      <circle cx="15" cy="12" r="10" fill="#EB001B"/>
                      <circle cx="23" cy="12" r="10" fill="#F79E1B"/>
                      <path d="M19 4.8a10 10 0 0 1 0 14.4A10 10 0 0 1 19 4.8z" fill="#FF5F00"/>
                    </svg>
                  </div>
                  {/* SSL badge */}
                  <div className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1">
                    <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-400">SSL</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-600">Platební údaje zpracovává výhradně Stripe. My je nikdy nevidíme.</div>
            </div>
          </div>

          <div className="mt-5 border-t border-white/8 pt-5 text-xs leading-relaxed text-slate-500">
            <div className="mb-3 rounded-xl border border-white/5 bg-white/2 px-4 py-3 text-slate-600">
              <span className="font-semibold text-slate-500">Upozornění:</span> Dokumenty jsou standardní smluvní vzory pro typické situace a nejsou náhradou za individuální právní poradenství. Pro složitější nebo nestandardní případy, probíhající spory nebo transakce s vysokou hodnotou doporučujeme konzultaci s advokátem.
            </div>
            <p>© 2026 SmlouvaHned. Všechna práva vyhrazena.</p>
          </div>
        </footer>

      </div>
    </main>
  );
}
