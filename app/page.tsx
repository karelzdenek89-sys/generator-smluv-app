import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SmlouvaHned | Profesionální smlouvy online — od 299 Kč',
  description: 'Vygenerujte si nájemní smlouvu, kupní smlouvu na auto, darovací smlouvu, smlouvu o dílo, zápůjčce nebo NDA za 3 minuty. Aktualizováno pro legislativu 2026.',
  openGraph: {
    title: 'SmlouvaHned | Profesionální smlouvy online — od 299 Kč',
    description: 'Profesionální právní smlouvy s paragrafy OZ. Formulář → PDF. Okamžitě.',
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
    price: '299 Kč',
    category: 'Bydlení',
    accentKey: 'lease' as AccentKey,
    highlight: 'Předávací protokol zdarma',
    paragraph: '§ 2201 a násl. OZ',
  },
  {
    title: 'KUPNÍ SMLOUVA',
    description: 'Prodej ojetého vozidla s důrazem na stav vozidla, vady, kilometry a bezpečné předání. Včetně příloh.',
    href: '/auto',
    price: '299 Kč',
    category: 'Auto',
    accentKey: 'car' as AccentKey,
    highlight: 'Silnější ochrana při prodeji',
    paragraph: '§ 2079 a násl. OZ',
  },
  {
    title: 'DAROVACÍ SMLOUVA',
    description: 'Bezpečný převod peněz, auta, movité věci i nemovitosti. Přehledné zpracování a právně čistý výstup.',
    href: '/darovaci',
    price: '299 Kč',
    category: 'Převod majetku',
    accentKey: 'gift' as AccentKey,
    highlight: 'Peníze, auto i nemovitost',
    paragraph: '§ 2055 a násl. OZ',
  },
  {
    title: 'SMLOUVA O DÍLO',
    description: 'Silná ochrana pro řemeslníky i objednatele. Cena, termíny, sankce, předání díla a minimalizace sporů.',
    href: '/smlouva-o-dilo',
    price: '299 Kč',
    category: 'Podnikání',
    accentKey: 'work' as AccentKey,
    highlight: 'Termíny, sankce a předání',
    paragraph: '§ 2586 a násl. OZ',
  },
  {
    title: 'SMLOUVA O ZÁPŮJČCE',
    description: 'Půjčte si nebo zapůjčte peníze bezpečně. Možnost úročení, splátkového kalendáře a zajištění pohledávky.',
    href: '/pujcka',
    price: '299 Kč',
    category: 'Finance',
    accentKey: 'loan' as AccentKey,
    badge: 'NOVÉ',
    highlight: 'Splátky, úroky a zajištění',
    paragraph: '§ 2390 a násl. OZ',
  },
  {
    title: 'SMLOUVA O MLČENLIVOSTI',
    description: 'NDA pro ochranu know-how, databází a obchodního tajemství. Jednostranná i oboustranná verze.',
    href: '/nda',
    price: '299 Kč',
    category: 'Byznys',
    accentKey: 'nda' as AccentKey,
    highlight: 'Non-compete a non-solicitation',
    paragraph: '§ 504 OZ + GDPR',
  },
  {
    title: 'KUPNÍ SMLOUVA',
    description: 'Prodej jakékoli movité věci — elektroniky, nábytku, kola i auta. Záruka, odpovědnost za vady, bezpečné předání.',
    href: '/kupni',
    price: '299 Kč',
    category: 'Obchod',
    accentKey: 'sale' as AccentKey,
    badge: 'NOVÉ',
    highlight: 'Vady, záruka a prohlášení',
    paragraph: '§ 2079 a násl. OZ',
  },
  {
    title: 'PRACOVNÍ SMLOUVA',
    description: 'Zaměstnanecká smlouva se všemi zákonnými náležitostmi. Mzda, pracovní doba, zkušební doba, výpovědní doba.',
    href: '/pracovni',
    price: '299 Kč',
    category: 'HR',
    accentKey: 'employment' as AccentKey,
    badge: 'NOVÉ',
    highlight: 'Zákonné náležitosti § 34 ZP',
    paragraph: '§ 34 zákoníku práce',
  },
  {
    title: 'DOHODA O PROVEDENÍ PRÁCE',
    description: 'DPP pro brigády a jednorázové úkoly. Max. 300 hod./rok bez odvodů. S IP doložkou pro kreativní práce.',
    href: '/dpp',
    price: '299 Kč',
    category: 'HR',
    accentKey: 'dpp' as AccentKey,
    badge: 'NOVÉ',
    highlight: 'Max. 300 hod./rok bez SP/ZP',
    paragraph: '§ 75 zákoníku práce',
  },
  {
    title: 'SMLOUVA O POSKYTOVÁNÍ SLUŽEB',
    description: 'Pro freelancery a agentury. Paušál, hodinová sazba nebo pevná cena. SLA, IP práva, mlčenlivost a sankce.',
    href: '/sluzby',
    price: '299 Kč',
    category: 'Podnikání',
    accentKey: 'service' as AccentKey,
    badge: 'NOVÉ',
    highlight: 'SLA, IP, mlčenlivost',
    paragraph: '§ 1746 odst. 2 OZ',
  },
  {
    title: 'PODNÁJEMNÍ SMLOUVA',
    description: 'Legální podnájem bytu se souhlasem pronajímatele. Kauce, pravidla, předávací protokol, ochrana obou stran.',
    href: '/podnajem',
    price: '299 Kč',
    category: 'Bydlení',
    accentKey: 'sublease' as AccentKey,
    badge: 'NOVÉ',
    highlight: 'Souhlas pronajímatele + kauce',
    paragraph: '§ 2274 a násl. OZ',
  },
  {
    title: 'PLNÁ MOC',
    description: 'Obecná, ověřená nebo jednorázová plná moc pro nemovitosti, soud, banku nebo jednání za firmu.',
    href: '/plna-moc',
    price: '299 Kč',
    category: 'Obecné',
    accentKey: 'poa' as AccentKey,
    badge: 'NOVÉ',
    highlight: 'Ověřená verze pro úřady',
    paragraph: '§ 441 OZ',
  },
  {
    title: 'UZNÁNÍ DLUHU',
    description: 'Obnoví promlčecí lhůtu na 10 let. Splátky, exekuční doložka, smluvní pokuta. Nejsilnější nástroj věřitele.',
    href: '/uznani-dluhu',
    price: '299 Kč',
    category: 'Finance',
    accentKey: 'debt' as AccentKey,
    badge: 'NOVÉ',
    highlight: 'Promlčení 10 let + exekuce',
    paragraph: '§ 2053 OZ',
  },
  {
    title: 'SMLOUVA O SPOLUPRÁCI',
    description: 'Spolupráce OSVČ a firem s jasnými pravidly. Podíl na výnosech, IP práva, mlčenlivost, exit klauzule.',
    href: '/spoluprace',
    price: '299 Kč',
    category: 'Podnikání',
    accentKey: 'coop' as AccentKey,
    badge: 'NOVÉ',
    highlight: 'IP, výnosy, zákaz konkurence',
    paragraph: '§ 1746 odst. 2 OZ',
  },
];

const faqItems = [
  {
    question: 'Jak celý proces funguje?',
    answer: 'Vyberete typ smlouvy, vyplníte chytrý formulář (krok za krokem), a po zaplacení stáhnete finální PDF s profesionálními právními paragrafy.',
  },
  {
    question: 'Jsou smlouvy vhodné pro běžné použití?',
    answer: 'Ano, šablony jsou připravené pro praktické použití a obsahují aktuální paragrafy OZ pro rok 2026. Pro atypické nebo sporné situace doporučujeme konzultaci s advokátem.',
  },
  {
    question: 'Dostanu dokument hned po zaplacení?',
    answer: 'Ano. Po úspěšném zaplacení si PDF stáhnete okamžitě. Pokud zadáte e-mail, pošleme vám odkaz také na e-mail. Odkaz je platný 7 dní.',
  },
  {
    question: 'Co je Prémiový balíček?',
    answer: 'Prémiový balíček (598 Kč celkem) přidá do smlouvy rozšířené doložky — zajišťovací ustanovení, podrobnější odpovědnostní klauzule, doporučení k notáři apod. Pro právně složitější situace.',
  },
  {
    question: 'Jsou bezpečně uložena moje data?',
    answer: 'Údaje jsou uloženy pouze dočasně v šifrovaném úložišti na max. 7 dní a poté automaticky smazány. Platební údaje zpracovává výhradně Stripe — na naše servery se nedostanou.',
  },
  {
    question: 'Je to náhrada individuální právní služby?',
    answer: 'Ne. Jde o automatizovaný generátor pro typické situace. U složitých případů je vhodné řešení konzultovat s advokátem.',
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
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Legal document builder</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
            <Link href="#vyber-smlouvy" className="hover:text-white transition">Smlouvy</Link>
            <Link href="#jak-to-funguje" className="hover:text-white transition">Jak to funguje</Link>
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

          <h1 className="mx-auto max-w-5xl text-5xl font-black italic tracking-tight text-white md:text-7xl xl:text-8xl">
            PROFESIONÁLNÍ <span className="text-amber-500">SMLOUVY</span>
            <br />
            BĚHEM PÁR MINUT
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-400 md:text-xl">
            Vyberete typ smlouvy, vyplníte formulář a získáte hotový dokument s paragrafy OZ —
            připravený k použití. Bez chaosu, bez čekání, bez zbytečně drahé právničiny.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {['Aktualizováno pro rok 2026', 'Paragrafy OZ v dokumentu', 'Prémiový balíček dostupný', 'Okamžité stažení PDF'].map(p => (
              <div key={p} className="rounded-full border border-white/8 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 md:text-sm">
                {p}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="#vyber-smlouvy"
              className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-8 py-4 text-lg font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.28)] transition hover:bg-amber-400">
              Začít generovat
            </Link>
            <div className="text-sm text-slate-500">14 typů smluv • od 299 Kč • okamžitě online</div>
          </div>
        </section>

        {/* Výběr smluv */}
        <section id="vyber-smlouvy">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Výběr dokumentu</div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Vyberte, co potřebujete vyřešit</h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-400 md:text-right">
              Každý builder obsahuje chytrý formulář, analýzu rizik a strukturu s aktuálními právními paragrafy.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {contracts.map((contract) => (
              <Link key={contract.href} href={contract.href}
                className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#0c1426] p-7 transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <div className={`absolute inset-0 bg-gradient-to-br ${accentMap[contract.accentKey]} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
                      {contract.category}
                    </div>
                    {contract.badge && (
                      <div className="rounded-full bg-amber-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black shadow-lg">
                        {contract.badge}
                      </div>
                    )}
                  </div>

                  <h3 className="mb-1 text-2xl font-black italic tracking-tight text-white">{contract.title}</h3>
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-400">{contract.highlight}</div>
                  <div className="mb-4 text-[10px] font-medium text-slate-600">{contract.paragraph}</div>
                  <p className="mb-6 flex-grow text-sm leading-relaxed text-slate-400">{contract.description}</p>

                  <div className="mt-auto border-t border-white/8 pt-5">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Cena od</div>
                      <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-black text-emerald-300">
                        {contract.price}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold uppercase tracking-[0.14em] text-amber-400 transition group-hover:text-amber-300">
                        Sestavit dokument
                      </span>
                      <span className="text-lg text-slate-500 transition group-hover:translate-x-1 group-hover:text-white">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Prémiový balíček CTA */}
        <section className="mt-10">
          <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/8 to-transparent p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400 mb-2">Prémiový balíček</div>
              <h3 className="text-xl font-black text-white tracking-tight">Potřebujete silnější ochranu?</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-lg">
                Každá smlouva má volitelný prémiový upgrade: rozšířené doložky, zajišťovací klauzule a doporučení k notáři. Celkem <strong className="text-amber-400">598 Kč</strong> místo základních 299 Kč.
              </p>
            </div>
            <div className="flex-shrink-0 flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-black text-white">598 Kč</div>
                <div className="text-xs text-slate-500 mt-0.5">prémiová smlouva</div>
              </div>
              <Link href="#vyber-smlouvy" className="px-6 py-3 bg-amber-500 text-black font-black uppercase text-sm rounded-2xl hover:bg-amber-400 transition whitespace-nowrap">
                Vybrat smlouvu →
              </Link>
            </div>
          </div>
        </section>

        {/* Jak to funguje */}
        <section id="jak-to-funguje" className="mt-16 md:mt-20">
          <div className="rounded-[2rem] border border-white/8 bg-white/5 px-6 py-8 backdrop-blur-sm md:px-10 md:py-10">
            <div className="mb-8">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Jak to funguje</div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Jednoduchý proces od výběru po stažení</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-4">
              {[
                { step: '01', title: 'Vyberete smlouvu', desc: 'Zvolíte z 14 dokumentů podle situace — nájem, práce, podnikání, finance nebo obecné.' },
                { step: '02', title: 'Vyplníte formulář', desc: 'Systém vás vede krok za krokem a průběžně skládá výsledný dokument s analýzou rizik.' },
                { step: '03', title: 'Zaplatíte 299 Kč', desc: 'Bezpečná platba kartou přes Stripe. Platba trvá 30 sekund.' },
                { step: '04', title: 'Stáhnete PDF', desc: 'Finální profesionální smlouva s paragrafy OZ je okamžitě ke stažení.' },
              ].map(s => (
                <div key={s.step}>
                  <div className="text-sm font-black uppercase tracking-[0.18em] text-amber-400">{s.step}</div>
                  <h3 className="mt-3 text-xl font-black text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Proč SmlouvaHned */}
        <section className="mt-16 md:mt-20">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                label: 'Právní kvalita',
                title: 'Paragrafy OZ přímo v dokumentu',
                desc: 'Každá smlouva obsahuje přesné citace zákona č. 89/2012 Sb. — to je základ, který levné vzory na internetu nemají.',
              },
              {
                label: 'Bezpečnost',
                title: 'Data nikdy nevidíme my',
                desc: 'Citlivé osobní údaje jsou šifrované, uložené dočasně max. 7 dní a poté automaticky smazány. Platby jdou přes Stripe.',
              },
              {
                label: 'Rychlost a cena',
                title: 'Hotovo za 3 minuty, od 299 Kč',
                desc: 'Advokát za smlouvu vezme 3 000–10 000 Kč. U nás dostanete profesionální výstup za zlomek ceny a okamžitě.',
              },
            ].map(c => (
              <div key={c.title} className="rounded-3xl border border-white/8 bg-[#0c1426] p-7">
                <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">{c.label}</div>
                <h3 className="mt-3 text-xl font-black text-white">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.desc}</p>
              </div>
            ))}
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
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">Připraveno k použití</div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
              Vyberte smlouvu a začněte hned
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
              Profesionální formulář, aktuální paragrafy OZ, okamžité PDF ke stažení.
            </p>
            <Link href="#vyber-smlouvy"
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-amber-500 px-8 py-4 text-lg font-black uppercase tracking-tight text-black transition hover:bg-amber-400">
              Vybrat smlouvu
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
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Generátor smluv</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Profesionálně navržené dokumenty s paragrafy OZ pro typické životní a podnikatelské situace.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Navigace</div>
                <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
                  <Link href="#vyber-smlouvy" className="hover:text-white transition">Smlouvy</Link>
                  <Link href="#jak-to-funguje" className="hover:text-white transition">Jak to funguje</Link>
                  <Link href="#faq" className="hover:text-white transition">FAQ</Link>
                  <Link href="/zakaznicka-zona" className="hover:text-white transition">Moje dokumenty</Link>
                  <Link href="/kontakt" className="hover:text-white transition">Kontakt</Link>
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
