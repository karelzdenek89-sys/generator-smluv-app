import Link from 'next/link';

type AccentKey = 'lease' | 'car' | 'gift' | 'work';

const accentMap: Record<AccentKey, string> = {
  lease: 'from-amber-500/20 to-yellow-500/5',
  car: 'from-sky-500/20 to-cyan-500/5',
  gift: 'from-emerald-500/20 to-green-500/5',
  work: 'from-fuchsia-500/20 to-purple-500/5',
};

const contracts: {
  title: string;
  description: string;
  href: string;
  price: string;
  category: string;
  accentKey: AccentKey;
  badge?: string;
  highlight: string;
}[] = [
  {
    title: 'NÁJEMNÍ SMLOUVA',
    description:
      'Ochrana pronajímatele, doložky pro zvířata a Airbnb, jasná pravidla užívání a předávací protokol v ceně.',
    href: '/najem',
    price: '299 Kč',
    category: 'Bydlení',
    accentKey: 'lease',
    highlight: 'Předávací protokol v ceně',
  },
  {
    title: 'KUPNÍ SMLOUVA',
    description:
      'Prodej ojetého vozidla s důrazem na stav vozidla, vady, kilometry a bezpečné předání. Včetně příloh.',
    href: '/auto',
    price: '299 Kč',
    category: 'Auto',
    accentKey: 'car',
    highlight: 'Silnější ochrana při prodeji',
  },
  {
    title: 'DAROVACÍ SMLOUVA',
    description:
      'Bezpečný převod peněz, auta, movité věci i nemovitosti. Přehledné zpracování a právně čistý výstup.',
    href: '/darovaci',
    price: '299 Kč',
    category: 'Převod majetku',
    accentKey: 'gift',
    highlight: 'Peníze, auto i nemovitost',
  },
  {
    title: 'SMLOUVA O DÍLO',
    description:
      'Silná ochrana pro řemeslníky i objednatele. Cena, termíny, sankce, předání díla a minimalizace sporů.',
    href: '/smlouva-o-dilo',
    price: '299 Kč',
    category: 'Podnikání',
    accentKey: 'work',
    badge: 'NOVINKA',
    highlight: 'Termíny, sankce a předání',
  },
];

const trustPoints = [
  'Aktualizováno pro rok 2026',
  'Okamžité generování',
  'Přehledný formulář krok za krokem',
  'Prémiové doložky a přílohy',
];

const faqItems = [
  {
    question: 'Jak celý proces funguje?',
    answer:
      'Vyberete typ smlouvy, vyplníte chytrý formulář, zkontrolujete živý náhled a po zaplacení stáhnete finální PDF dokument.',
  },
  {
    question: 'Jsou smlouvy vhodné pro běžné použití?',
    answer:
      'Ano, šablony jsou připravené pro praktické použití a navržené tak, aby pokrývaly nejčastější situace u nájmu, prodeje auta, darování a smlouvy o dílo.',
  },
  {
    question: 'Ukládají se moje citlivé údaje do prohlížeče?',
    answer:
      'Ne. Citlivé údaje nemají zůstávat v localStorage. Dokument se po ověřené platbě generuje bezpečně přes serverové flow.',
  },
  {
    question: 'Dostanu dokument hned po zaplacení?',
    answer:
      'Ano. Po úspěšném zaplacení si finální dokument stáhnete okamžitě.',
  },
  {
    question: 'Obsahují dokumenty i přílohy?',
    answer:
      'U vybraných typů ano. Například nájemní smlouva může obsahovat předávací protokol a další buildery obsahují doplňkové části podle typu dokumentu.',
  },
  {
    question: 'Je to náhrada individuální právní služby?',
    answer:
      'Ne. Jde o profesionálně připravený generátor dokumentů pro typické situace. U složitých nebo sporných případů je vhodné řešení konzultovat individuálně s advokátem.',
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05080f] text-slate-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.10),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08),transparent_22%),linear-gradient(to_bottom,#05080f,#08101e,#05080f)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24">
        <header className="mb-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">
              SH
            </div>
            <div>
              <div className="font-black tracking-tight text-white">SmlouvaHned</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Legal document builder
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
            <Link href="#vyber-smlouvy" className="hover:text-white transition">
              Smlouvy
            </Link>
            <Link href="#jak-to-funguje" className="hover:text-white transition">
              Jak to funguje
            </Link>
            <Link href="#faq" className="hover:text-white transition">
              FAQ
            </Link>
          </nav>
        </header>

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
            Vyberete typ smlouvy, vyplníte formulář a během chvíle získáte hotový dokument
            připravený k použití. Bez chaosu, bez čekání, bez zbytečně drahé právničiny.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {trustPoints.map((point) => (
              <div
                key={point}
                className="rounded-full border border-white/8 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 md:text-sm"
              >
                {point}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#vyber-smlouvy"
              className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-8 py-4 text-lg font-black uppercase tracking-tight text-black shadow-[0_0_40px_rgba(245,158,11,0.28)] transition hover:bg-amber-400"
            >
              Začít generovat
            </Link>

            <div className="text-sm text-slate-500">
              4 typy smluv • od 299 Kč • okamžitě online
            </div>
          </div>
        </section>

        <section id="vyber-smlouvy">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">
                Výběr dokumentu
              </div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
                Vyberte, co potřebujete vyřešit
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-relaxed text-slate-400 md:text-right">
              Každý builder obsahuje chytrý formulář, živý náhled a strukturu navrženou tak,
              aby snížila riziko chyb i budoucích sporů.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {contracts.map((contract) => {
              const accentClass = accentMap[contract.accentKey];

              return (
                <Link
                  key={contract.href}
                  href={contract.href}
                  className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#0c1426] p-7 transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${accentClass} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-6 flex items-start justify-between gap-3">
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
                        {contract.category}
                      </div>

                      {contract.badge ? (
                        <div className="rounded-full bg-amber-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black shadow-lg">
                          {contract.badge}
                        </div>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <h3 className="text-2xl font-black italic tracking-tight text-white">
                        {contract.title}
                      </h3>
                    </div>

                    <div className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-amber-400">
                      {contract.highlight}
                    </div>

                    <p className="mb-8 flex-grow text-sm leading-relaxed text-slate-400">
                      {contract.description}
                    </p>

                    <div className="mt-auto border-t border-white/8 pt-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                          Cena od
                        </div>
                        <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-black text-emerald-300">
                          {contract.price}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold uppercase tracking-[0.14em] text-amber-400 transition group-hover:text-amber-300">
                          Sestavit dokument
                        </span>
                        <span className="text-lg text-slate-500 transition group-hover:translate-x-1 group-hover:text-white">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section id="jak-to-funguje" className="mt-16 md:mt-20">
          <div className="rounded-[2rem] border border-white/8 bg-white/5 px-6 py-8 backdrop-blur-sm md:px-10 md:py-10">
            <div className="mb-8">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">
                Jak to funguje
              </div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
                Jednoduchý proces od výběru po stažení
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="text-sm font-black uppercase tracking-[0.18em] text-amber-400">
                  01
                </div>
                <h3 className="mt-3 text-xl font-black text-white">Vyberete typ smlouvy</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Zvolíte dokument podle situace — nájem, auto, darování nebo dílo.
                </p>
              </div>

              <div>
                <div className="text-sm font-black uppercase tracking-[0.18em] text-amber-400">
                  02
                </div>
                <h3 className="mt-3 text-xl font-black text-white">Vyplníte chytrý formulář</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Systém vás vede krok za krokem a průběžně skládá výsledný dokument.
                </p>
              </div>

              <div>
                <div className="text-sm font-black uppercase tracking-[0.18em] text-amber-400">
                  03
                </div>
                <h3 className="mt-3 text-xl font-black text-white">Zaplatíte a stáhnete PDF</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Po ověřené platbě získáte finální profesionální verzi připravenou k použití.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/8 bg-[#0c1426] p-7">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">
                Důvěra
              </div>
              <h3 className="mt-3 text-xl font-black text-white">Přehledný a profesionální výstup</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Dokumenty jsou navržené tak, aby působily čistě, profesionálně a byly připravené k okamžitému použití.
              </p>
            </div>

            <div className="rounded-3xl border border-white/8 bg-[#0c1426] p-7">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">
                Bezpečnost
              </div>
              <h3 className="mt-3 text-xl font-black text-white">Citlivé údaje nenecháváme volně v prohlížeči</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Finální dokumenty mají být doručovány přes bezpečnější serverový flow po ověřené platbě.
              </p>
            </div>

            <div className="rounded-3xl border border-white/8 bg-[#0c1426] p-7">
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">
                Rychlost
              </div>
              <h3 className="mt-3 text-xl font-black text-white">Bez čekání a zdlouhavého řešení</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                V typických situacích získáte hotový dokument rychleji a přehledněji než při běžném ručním skládání.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="mt-16 md:mt-20">
          <div className="mb-8">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">
              FAQ
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
              Časté otázky
            </h2>
          </div>

          <div className="grid gap-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-3xl border border-white/8 bg-[#0c1426] p-6 open:border-amber-500/30"
              >
                <summary className="cursor-pointer list-none pr-8 text-lg font-bold text-white">
                  <div className="flex items-center justify-between gap-4">
                    <span>{item.question}</span>
                    <span className="text-slate-500 transition group-open:rotate-45">+</span>
                  </div>
                </summary>
                <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-400">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <div className="rounded-[2rem] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 px-6 py-10 text-center md:px-10">
            <div className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-400">
              Připraveno k použití
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
              Vyberte smlouvu a začněte hned
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
              Profesionální formulář, jasný proces, rychlé dokončení a finální dokument připravený ke stažení.
            </p>
            <Link
              href="#vyber-smlouvy"
              className="mt-8 inline-flex items-center justify-center rounded-2xl bg-amber-500 px-8 py-4 text-lg font-black uppercase tracking-tight text-black transition hover:bg-amber-400"
            >
              Vybrat smlouvu
            </Link>
          </div>
        </section>

        <footer className="mt-16 border-t border-white/8 pt-8 md:mt-20">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-sm font-black text-black">
                  SH
                </div>
                <div>
                  <div className="font-black tracking-tight text-white">SmlouvaHned</div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Generátor smluv
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Profesionálně navržené dokumenty pro typické životní a podnikatelské situace.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Navigace
                </div>
                <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
                  <Link href="#vyber-smlouvy" className="hover:text-white transition">
                    Smlouvy
                  </Link>
                  <Link href="#jak-to-funguje" className="hover:text-white transition">
                    Jak to funguje
                  </Link>
                  <Link href="#faq" className="hover:text-white transition">
                    FAQ
                  </Link>
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Dokumenty
                </div>
                <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
                  <Link href="/najem" className="hover:text-white transition">
                    Nájemní smlouva
                  </Link>
                  <Link href="/auto" className="hover:text-white transition">
                    Kupní smlouva
                  </Link>
                  <Link href="/darovaci" className="hover:text-white transition">
                    Darovací smlouva
                  </Link>
                  <Link href="/smlouva-o-dilo" className="hover:text-white transition">
                    Smlouva o dílo
                  </Link>
                </div>
              </div>

              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Informace
                </div>
                <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
                  <Link href="/kontakt" className="hover:text-white transition">
                    Kontakt
                  </Link>
                  <Link href="/obchodni-podminky" className="hover:text-white transition">
                    Obchodní podmínky
                  </Link>
                  <Link href="/gdpr" className="hover:text-white transition">
                    Zásady ochrany osobních údajů
                  </Link>
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