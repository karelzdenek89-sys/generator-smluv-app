import type { Metadata } from 'next';
import Link from 'next/link';

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

type AccentKey = 'lease' | 'car' | 'gift' | 'work' | 'loan' | 'nda' | 'sale' | 'employment' | 'dpp' | 'service' | 'sublease' | 'poa' | 'debt' | 'coop';

const accentMap: Record<AccentKey, string> = {
  lease:      'from-amber-500/20 to-yellow-500/5',
  car:        'from-sky-500/20 to-cyan-500/5',
  gift:       'from-emerald-500/20 to-green-500/5',
  work:       'from-fuchsia-500/20 to-purple-500/5',
  loan:       'from-rose-500/20 to-red-500/5',
  nda:        'from-violet-500/20 to-indigo-500/5',
  sale:       'from-teal-500/20 to-cyan-500/5',
  employment: 'from-blue-500/20 to-sky-500/5',
  dpp:        'from-orange-500/20 to-amber-500/5',
  service:    'from-pink-500/20 to-rose-500/5',
  sublease:   'from-yellow-500/20 to-amber-500/5',
  poa:        'from-slate-500/20 to-gray-500/5',
  debt:       'from-red-600/20 to-rose-500/5',
  coop:       'from-lime-500/20 to-green-500/5',
};

const contracts = [
  {
    title: 'NÁJEMNÍ SMLOUVA',
    description: 'Ochrana pronajímatele, doložky pro zvířata a Airbnb, jasná pravidla užívání a předávací protokol v ceně.',
    href: '/najem',
    price: '249 Kč',
    category: 'Bydlení',
    accentKey: 'lease' as AccentKey,
    highlight: 'Předávací protokol zdarma',
    paragraph: '§ 2201 a násl. OZ',
  },
  {
    title: 'KUPNÍ SMLOUVA',
    description: 'Prodej ojetého vozidla s důrazem na stav vozidla, vady, kilometry a bezpečné předání. Včetně příloh.',
    href: '/auto',
    price: '249 Kč',
    category: 'Auto',
    accentKey: 'car' as AccentKey,
    highlight: 'Silnější ochrana při prodeji',
    paragraph: '§ 2079 a násl. OZ',
  },
  {
    title: 'DAROVACÍ SMLOUVA',
    description: 'Bezpečný převod peněz, auta, movité věci i nemovitosti. Přehledné zpracování a právně čistý výstup.',
    href: '/darovaci',
    price: '249 Kč',
    category: 'Převod majetku',
    accentKey: 'gift' as AccentKey,
    highlight: 'Peníze, auto i nemovitost',
    paragraph: '§ 2055 a násl. OZ',
  },
  {
    title: 'SMLOUVA O DÍLO',
    description: 'Silná ochrana pro řemeslníky i objednatele. Cena, termíny, sankce, předání díla a minimalizace sporů.',
    href: '/smlouva-o-dilo',
    price: '249 Kč',
    category: 'Podnikání',
    accentKey: 'work' as AccentKey,
    highlight: 'Termíny, sankce a předání',
    paragraph: '§ 2586 a násl. OZ',
  },
  {
    title: 'SMLOUVA O ZÁPŮJČCE',
    description: 'Půjčte si nebo zapůjčte peníze bezpečně. Možnost úročení, splátkového kalendáře a zajištění pohledávky.',
    href: '/pujcka',
    price: '249 Kč',
    category: 'Finance',
    accentKey: 'loan' as AccentKey,
    highlight: 'Splátky, úroky a zajištění',
    paragraph: '§ 2390 a násl. OZ',
  },
  {
    title: 'SMLOUVA O MLČENLIVOSTI',
    description: 'NDA pro ochranu know-how, databází a obchodního tajemství. Jednostranná i oboustranná verze.',
    href: '/nda',
    price: '249 Kč',
    category: 'Byznys',
    accentKey: 'nda' as AccentKey,
    highlight: 'Non-compete a non-solicitation',
    paragraph: '§ 504 OZ + GDPR',
  },
  {
    title: 'KUPNÍ SMLOUVA',
    description: 'Prodej jakékoli movité věci — elektroniky, nábytku, kola i auta. Záruka, odpovědnost za vady, bezpečné předání.',
    href: '/kupni',
    price: '249 Kč',
    category: 'Obchod',
    accentKey: 'sale' as AccentKey,
    highlight: 'Vady, záruka a prohlášení',
    paragraph: '§ 2079 a násl. OZ',
  },
  {
    title: 'PRACOVNÍ SMLOUVA',
    description: 'Zaměstnanecká smlouva se všemi zákonnými náležitostmi. Mzda, pracovní doba, zkušební doba, výpovědní doba.',
    href: '/pracovni',
    price: '249 Kč',
    category: 'HR',
    accentKey: 'employment' as AccentKey,
    highlight: 'Zákonné náležitosti § 34 ZP',
    paragraph: '§ 34 zákoníku práce',
  },
  {
    title: 'DOHODA O PROVEDENÍ PRÁCE',
    description: 'DPP pro brigády a jednorázové úkoly. Max. 300 hod./rok bez odvodů. S IP doložkou pro kreativní práce.',
    href: '/dpp',
    price: '249 Kč',
    category: 'HR',
    accentKey: 'dpp' as AccentKey,
    highlight: 'Max. 300 hod./rok bez SP/ZP',
    paragraph: '§ 75 zákoníku práce',
  },
  {
    title: 'SMLOUVA O POSKYTOVÁNÍ SLUŽEB',
    description: 'Pro freelancery a agentury. Paušál, hodinová sazba nebo pevná cena. SLA, IP práva, mlčenlivost a sankce.',
    href: '/sluzby',
    price: '249 Kč',
    category: 'Podnikání',
    accentKey: 'service' as AccentKey,
    highlight: 'SLA, IP, mlčenlivost',
    paragraph: '§ 1746 odst. 2 OZ',
  },
  {
    title: 'PODNÁJEMNÍ SMLOUVA',
    description: 'Legální podnájem bytu se souhlasem pronajímatele. Kauce, pravidla, předávací protokol, ochrana obou stran.',
    href: '/podnajem',
    price: '249 Kč',
    category: 'Bydlení',
    accentKey: 'sublease' as AccentKey,
    highlight: 'Souhlas pronajímatele + kauce',
    paragraph: '§ 2274 a násl. OZ',
  },
  {
    title: 'PLNÁ MOC',
    description: 'Obecná, ověřená nebo jednorázová plná moc pro nemovitosti, soud, banku nebo jednání za firmu.',
    href: '/plna-moc',
    price: '249 Kč',
    category: 'Obecné',
    accentKey: 'poa' as AccentKey,
    highlight: 'Ověřená verze pro úřady',
    paragraph: '§ 441 OZ',
  },
  {
    title: 'UZNÁNÍ DLUHU',
    description: 'Obnoví promlčecí lhůtu na 10 let. Splátky, exekuční doložka, smluvní pokuta. Nejsilnější nástroj věřitele.',
    href: '/uznani-dluhu',
    price: '249 Kč',
    category: 'Finance',
    accentKey: 'debt' as AccentKey,
    highlight: 'Promlčení 10 let + exekuce',
    paragraph: '§ 2053 OZ',
  },
  {
    title: 'SMLOUVA O SPOLUPRÁCI',
    description: 'Spolupráce OSVČ a firem s jasnými pravidly. Podíl na výnosech, IP práva, mlčenlivost, exit klauzule.',
    href: '/spoluprace',
    price: '249 Kč',
    category: 'Podnikání',
    accentKey: 'coop' as AccentKey,
    highlight: 'IP, výnosy, zákaz konkurence',
    paragraph: '§ 1746 odst. 2 OZ',
  },
];

const pricingTiers = [
  {
    name: 'Základní dokument',
    price: '249 Kč',
    description: 'Kompletní smlouva připravená k podpisu',
    features: [
      'Všechna zákonná povinná ustanovení dle OZ',
      'Vyplnění přesně dle vašich podmínek',
      'PDF ke stažení ihned po platbě',
      'Dokument v souladu s legislativou 2026',
    ],
    note: 'Vhodné pro přímočaré situace, kde se strany dobře znají.',
    cta: 'Vytvořit základní dokument',
    href: '#vyber-smlouvy',
    highlighted: false,
    badge: null,
  },
  {
    name: 'Profesionální ochrana',
    price: '449 Kč',
    description: 'Rozšířená právní ochrana pro jistý výsledek',
    features: [
      'Vše ze Základního dokumentu',
      'Rozšířené ochranné klauzule',
      'Smluvní pokuty a sankční mechanismy',
      'Odpovědnostní a doručovací ustanovení',
      'Podrobná prohlášení smluvních stran',
    ],
    note: 'Vhodné pro nájmy, prodeje vozidel, dílo, zápůjčky a podnikatelské vztahy.',
    cta: 'Pokračovat s Profesionální ochranou',
    href: '#vyber-smlouvy',
    highlighted: true,
    badge: 'Nejčastěji voleno',
  },
  {
    name: 'Kompletní balíček',
    price: '749 Kč',
    description: 'Kompletní řešení bez zbytku',
    features: [
      'Vše z Profesionální ochrany',
      'Průvodní instrukce k podpisu a archivaci',
      'Předávací protokol (dle typu smlouvy)',
      'Checklist: co zkontrolovat před podpisem',
      'Archivace dokumentu po dobu 30 dnů',
      'Prioritní e-mailová podpora',
    ],
    note: 'Vhodné pro vyšší hodnoty transakcí, podnikatelské vztahy nebo situace, kde chcete mít vše ošetřené.',
    cta: 'Vytvořit kompletní balíček',
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
    question: 'Čím se liší Základní dokument od Profesionální ochrany?',
    answer: 'Základní dokument obsahuje všechna zákonem povinná ustanovení. Profesionální ochrana přidává klauzule, které vaši smluvní pozici aktivně posilují — zejména smluvní pokuty za porušení povinností, podrobnější odpovědnostní ustanovení a sankční mechanismy. Váš protějšek ví, že smlouva má reálné právní důsledky.',
  },
  {
    question: 'Jak celý proces funguje?',
    answer: 'Vyberete typ smlouvy, vyplníte formulář krok za krokem, zvolíte úroveň ochrany a po zaplacení obdržíte hotové PDF ke stažení. U Kompletního balíčku také průvodní instrukce a checklist.',
  },
  {
    question: 'Co obdržím po zaplacení?',
    answer: 'Ihned po dokončení platby obdržíte odkaz ke stažení vygenerovaného PDF. Odkaz je platný 7 dní. U Kompletního balíčku také průvodní instrukce k podpisu, checklist a (dle typu smlouvy) předávací protokol.',
  },
  {
    question: 'Proč nezvolit bezplatný vzor z internetu?',
    answer: 'Volně dostupné vzory jsou zpravidla obecné a nezohledňují vaše konkrétní podmínky. V řadě případů postrádají klauzule, které jsou pro vaši ochranu klíčové. Dokumenty na tomto webu jsou sestavovány dynamicky na základě vámi zadaných údajů a obsahují ustanovení, která vaši smluvní pozici aktivně chrání.',
  },
  {
    question: 'Jsou bezpečně uložena moje data?',
    answer: 'Údaje jsou uloženy pouze dočasně v šifrovaném úložišti na max. 7 dní a poté automaticky smazány. Platební údaje zpracovává výhradně Stripe — na naše servery se nikdy nedostanou.',
  },
  {
    question: 'Je to náhrada individuální právní služby?',
    answer: 'Ne. Dokumenty na tomto webu představují standardní smluvní vzory pro typické situace. Nejsou náhradou za individuální právní poradenství. V případě nestandardních nebo složitějších případů doporučujeme konzultaci s advokátem.',
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05080f] text-slate-200">
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

          <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight text-white md:text-6xl xl:text-7xl leading-tight">
            Smlouvy pro běžné<br />
            <span className="text-amber-500 italic">životní situace.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 md:text-lg">
            Bez složitého hledání vzorů. Vhodné pro standardní situace — nájem, práce, podnikání, půjčky.
            Krok za krokem, přehledně a v souladu s platným českým právem.
          </p>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {[
              '🔒 Platba přes Stripe',
              '📄 Dle OZ a platné legislativy',
              '⬇️ PDF ihned ke stažení',
              '14 typů dokumentů',
            ].map(p => (
              <div key={p} className="rounded-full border border-white/8 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 md:text-sm">
                {p}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="#vyber-smlouvy"
              className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-8 py-4 text-base font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.28)] transition hover:bg-amber-400">
              Vybrat smlouvu →
            </Link>
            <Link href="#jak-to-funguje" className="text-sm text-slate-400 hover:text-white transition">
              Jak to funguje? ↓
            </Link>
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
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Řešení právních situací</div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Vyberte situaci, kterou potřebujete řešit</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-400 md:text-right">
              Každý dokument je připraven v souladu s aktuálně platným českým právem. Vhodné pro standardní situace.
            </p>
          </div>

          {/* Kategorie */}
          {[
            {
              id: 'bydleni',
              label: '🏠 Bydlení',
              items: contracts.filter(c => ['Bydlení'].includes(c.category)),
            },
            {
              id: 'prace',
              label: '💼 Práce a HR',
              items: contracts.filter(c => ['HR'].includes(c.category)),
            },
            {
              id: 'podnikani',
              label: '🏢 Podnikání',
              items: contracts.filter(c => ['Podnikání', 'Byznys'].includes(c.category)),
            },
            {
              id: 'finance',
              label: '💰 Finance a převody',
              items: contracts.filter(c => ['Finance', 'Převod majetku', 'Obchod', 'Auto', 'Obecné'].includes(c.category)),
            },
          ].map(group => group.items.length > 0 && (
            <div key={group.id} className="mb-10">
              <div className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-slate-400">{group.label}</div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {group.items.map((contract) => (
                  <Link key={contract.href} href={contract.href}
                    className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#0c1426] p-7 transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                    <div className={`absolute inset-0 bg-gradient-to-br ${accentMap[contract.accentKey]} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                    <div className="relative z-10 flex h-full flex-col">
                      <h3 className="mb-1 text-xl font-black italic tracking-tight text-white">{contract.title}</h3>
                      <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-400">{contract.highlight}</div>
                      <div className="mb-3 text-[10px] font-medium text-slate-600">{contract.paragraph}</div>
                      <p className="mb-5 flex-grow text-sm leading-relaxed text-slate-400">{contract.description}</p>

                      <div className="mt-auto border-t border-white/8 pt-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Cena od</div>
                          <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-black text-emerald-300">
                            {contract.price}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold uppercase tracking-[0.14em] text-amber-400 transition group-hover:text-amber-300">
                            Řešit tuto situaci
                          </span>
                          <span className="text-lg text-slate-500 transition group-hover:translate-x-1 group-hover:text-white">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
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
            <span className="font-bold text-amber-400">Upozornění:</span> Služba je vhodná pro <strong className="text-slate-300">standardní situace</strong>, kde se strany dohodly na podmínkách a potřebují je správně zachytit písemně. Nevhodné pro složité právní spory, rozvody, dědictví nebo případy s nestandardními podmínkami — v těchto situacích doporučujeme advokáta.
          </div>
        </section>

        {/* Proč ne náhodné vzory */}
        <section className="mt-16 md:mt-20">
          <div className="mb-8 text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Proč ne vzory zdarma</div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Čím se liší od vzorů z internetu?</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: '⚠️',
                problem: 'Zastaralé',
                desc: 'Volně dostupné vzory zpravidla neodpovídají aktuální legislativě. Občanský zákoník i zákoník práce se pravidelně mění.',
                solution: 'Dokumenty na tomto webu jsou aktualizovány pro legislativu 2026.',
              },
              {
                icon: '🕳️',
                problem: 'Neúplné',
                desc: 'Obecné vzory neobsahují klauzule pro vaši konkrétní situaci — chybí sankce, odpovědnost, doručovací ustanovení.',
                solution: 'Formulář sestavuje dokument dynamicky podle vašich podmínek.',
              },
              {
                icon: '⚡',
                problem: 'Rizikové',
                desc: 'Chybějící nebo nesprávné klauzule vás neochrání, pokud dojde ke sporu. Levná smlouva může být velmi drahá.',
                solution: 'Každý dokument obsahuje ustanovení, která vaši smluvní pozici aktivně chrání.',
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

        {/* Trust sekce */}
        <section className="mt-16 md:mt-20">
          <div className="rounded-[2rem] border border-white/8 bg-white/3 px-6 py-8 md:px-10 md:py-10">
            <div className="mb-8 text-center">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Proč to funguje</div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Přehledný postup. Srozumitelný výsledek.</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { icon: '📋', label: 'Pro běžné situace', desc: 'Nájem, práce, podnikání, půjčky — jasné situace se jasným řešením.' },
                { icon: '🔤', label: 'Bez právní hantýrky', desc: 'Formulář mluví česky. Ptáme se na věci, ne na paragrafy.' },
                { icon: '⚡', label: 'Rychlé vyřízení', desc: 'Vyplnění zabere méně než 5 minut. PDF máte ihned.' },
                { icon: '🔒', label: 'Bezpečná platba', desc: 'Platba přes Stripe. Vaše platební data se k nám nikdy nedostanou.' },
              ].map(c => (
                <div key={c.label} className="text-center">
                  <div className="mb-2 text-3xl">{c.icon}</div>
                  <div className="mb-1 text-sm font-black text-white">{c.label}</div>
                  <p className="text-xs leading-relaxed text-slate-400">{c.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-white/8 bg-white/3 px-6 py-4 text-xs leading-relaxed text-slate-500 text-center">
              <span className="font-bold text-slate-400">Upozornění:</span> Dokumenty jsou standardní smluvní vzory pro typické situace a nejsou náhradou za individuální právní poradenství.
              Pro složitější nebo nestandardní případy doporučujeme konzultaci s advokátem.
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
              Pokračovat k výběru dokumentu
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
                  <a href="mailto:karelzdenek89@gmail.com" className="hover:text-amber-400 transition break-all">karelzdenek89@gmail.com</a>
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
