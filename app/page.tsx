import Link from "next/link";

const trustItems = [
  {
    title: "České smluvní prostředí",
    text: "Textace navržené pro běžné občanskoprávní a podnikatelské situace v českém prostředí.",
  },
  {
    title: "Bezpečná online platba",
    text: "Platba probíhá přes ověřenou platební infrastrukturu Stripe.",
  },
  {
    title: "PDF připravené k použití",
    text: "Po dokončení objednávky získáte dokument ve formátu PDF připravený ke kontrole a podpisu.",
  },
  {
    title: "Přehledné zpracování",
    text: "Strukturovaný formulář vede uživatele krok za krokem bez zbytečné složitosti.",
  },
];

const steps = [
  {
    number: "01",
    title: "Vyberete typ dokumentu",
    text: "Zvolíte dokument odpovídající vaší situaci a otevřete strukturovaný formulář.",
  },
  {
    number: "02",
    title: "Vyplníte potřebné údaje",
    text: "Doplníte smluvní strany, předmět ujednání a další podmínky podle konkrétního případu.",
  },
  {
    number: "03",
    title: "Zkontrolujete rozsah ochrany",
    text: "Před dokončením si ověříte zvolené parametry a úroveň zpracování dokumentu.",
  },
  {
    number: "04",
    title: "Stáhnete finální PDF",
    text: "Po úhradě získáte připravený dokument k dalšímu použití, kontrole a podpisu.",
  },
];

const documentTypes = [
  {
    title: "Nájemní smlouva",
    text: "Pro byty, domy i další nemovitosti v běžných nájemních situacích.",
    href: "/dokumenty/najemni-smlouva",
  },
  {
    title: "Kupní smlouva na vozidlo",
    text: "Pro prodej a koupi automobilu s důrazem na jasné vymezení stran a vozidla.",
    href: "/dokumenty/kupni-smlouva-na-vozidlo",
  },
  {
    title: "Darovací smlouva",
    text: "Pro převod majetku mezi fyzickými osobami v přehledné smluvní podobě.",
    href: "/dokumenty/darovaci-smlouva",
  },
  {
    title: "Smlouva o dílo",
    text: "Pro zakázky, služby a zhotovení díla mezi objednatelem a zhotovitelem.",
    href: "/dokumenty/smlouva-o-dilo",
  },
  {
    title: "Kupní smlouvy a převody",
    text: "Další dokumenty pro převody movitých věcí a související ujednání.",
    href: "/dokumenty",
  },
  {
    title: "Podnikatelské dokumenty",
    text: "Dokumenty pro dodávky služeb, spolupráci a další obchodní vztahy.",
    href: "/dokumenty",
  },
];

const reasons = [
  {
    title: "Seriózní forma",
    text: "Web i dokument musí působit profesionálně, přehledně a důvěryhodně od prvního kontaktu.",
  },
  {
    title: "Rychlý proces bez chaosu",
    text: "Uživatel nemá studovat nepřehledné vzory. Má projít jasný proces a získat použitelný výstup.",
  },
  {
    title: "Lepší orientace v podmínkách",
    text: "Strukturované vyplnění pomáhá zachytit podstatné údaje a snižuje riziko opomenutí.",
  },
];

const faqItems = [
  {
    question: "Je dokument vytvořen podle mých údajů?",
    answer:
      "Ano. Výstup vychází z údajů, které vyplníte ve formuláři. Výsledkem je dokument sestavený podle zadaných podmínek.",
  },
  {
    question: "Dostanu dokument ihned po zaplacení?",
    answer:
      "Po úspěšném dokončení objednávky je dokument připraven ke stažení ve formátu PDF.",
  },
  {
    question: "Nahrazuje tato služba individuální právní poradenství?",
    answer:
      "Ne. Jde o standardizované online řešení pro běžné situace. Pro složité nebo sporné případy je vhodná individuální konzultace s advokátem.",
  },
  {
    question: "Pro koho je služba vhodná?",
    answer:
      "Pro fyzické osoby i podnikatele, kteří potřebují přehledně připravený dokument pro typickou životní nebo obchodní situaci.",
  },
];

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center rounded-full border border-[#c5a059]/20 bg-[#c5a059]/8 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-[#d7b56a]">
      {children}
    </div>
  );
}

function TrustCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="legal-card h-full p-5">
      <div className="flex h-full flex-col items-start gap-4">
        <div className="legal-icon-chip">
          <span className="block h-2 w-2 rounded-full bg-[#d7b56a]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-sm leading-6 text-slate-300">{text}</p>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="legal-card h-full p-6">
      <div className="flex h-full flex-col items-start gap-5">
        <div className="legal-step-chip">{number}</div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm leading-7 text-slate-300">{text}</p>
        </div>
      </div>
    </div>
  );
}

function DocumentCard({
  title,
  text,
  href,
}: {
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link href={href} className="legal-card group block h-full p-6 transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex h-full flex-col justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300">
            Dokument
          </div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-sm leading-7 text-slate-300">{text}</p>
        </div>

        <div className="inline-flex items-center gap-2 text-sm font-medium text-[#d7b56a]">
          Zobrazit detail
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="legal-card group p-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
        <span className="text-base font-semibold text-white">{question}</span>
        <span className="text-[#d7b56a] transition-transform duration-300 group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{answer}</p>
    </details>
  );
}

export default function HomePage() {
  return (
    <main className="home-shell">
      <section className="home-hero-section">
        <div className="home-hero-ambient" />
        <div className="home-grid-lines" />

        <div className="mx-auto max-w-7xl px-6 pb-20 pt-10 sm:px-8 lg:px-10 lg:pb-24 lg:pt-14">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="max-w-2xl">
              <SectionBadge>Smluvní dokumenty online</SectionBadge>

              <h1 className="mt-6 max-w-xl font-serif text-5xl leading-[0.95] tracking-[-0.03em] text-[#ecd8a2] sm:text-6xl lg:text-7xl">
                Smluvní dokument
                <br />
                sestavený podle
                <br />
                vašich podmínek
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
                Vyplníte přehledný formulář a během několika minut získáte profesionálně
                zpracovaný dokument pro běžné občanské i podnikatelské situace.
              </p>

              <p className="mt-5 max-w-xl text-base leading-8 text-slate-400">
                Jasný postup, kultivované zpracování a výstup připravený ke kontrole,
                dalšímu použití a podpisu.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/dokumenty" className="legal-button-primary">
                  Vybrat typ smlouvy
                  <span aria-hidden="true">→</span>
                </Link>

                <a href="#jak-to-funguje" className="legal-button-secondary">
                  Jak služba funguje
                </a>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {trustItems.map((item) => (
                  <TrustCard key={item.title} title={item.title} text={item.text} />
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="hero-document-wrap">
                <div className="hero-document-glow" />

                <div className="hero-document-panel">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
                    <div>
                      <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#d7b56a]">
                        Ukázka výstupu
                      </div>
                      <h2 className="mt-2 font-serif text-3xl leading-tight text-white">
                        Nájemní smlouva
                      </h2>
                    </div>

                    <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
                      PDF připravené k použití
                    </div>
                  </div>

                  <div className="mt-6 rounded-[24px] border border-[#e8d7ab]/20 bg-[#f6f0e2] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
                    <div className="mx-auto max-w-[430px] rounded-[18px] border border-[#d8cab0] bg-[#fbf7ee] px-7 py-8 text-[#2b2419] shadow-[0_24px_48px_rgba(24,20,12,0.12)]">
                      <div className="text-center">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#8e6b2f]">
                          SmlouvaHned.cz
                        </div>
                        <div className="mt-3 font-serif text-3xl leading-tight">
                          Nájemní smlouva
                        </div>
                        <div className="mt-2 text-sm text-[#5a5144]">
                          dokument sestavený podle zadaných podmínek
                        </div>
                      </div>

                      <div className="mt-8 space-y-4">
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8e6b2f]">
                            Smluvní strany
                          </div>
                          <div className="mt-2 space-y-2">
                            <div className="h-[10px] w-[82%] rounded-full bg-[#d8cfbf]" />
                            <div className="h-[10px] w-[70%] rounded-full bg-[#e2d9ca]" />
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8e6b2f]">
                            Předmět nájmu
                          </div>
                          <div className="mt-2 space-y-2">
                            <div className="h-[10px] w-full rounded-full bg-[#d8cfbf]" />
                            <div className="h-[10px] w-[88%] rounded-full bg-[#e2d9ca]" />
                            <div className="h-[10px] w-[64%] rounded-full bg-[#e2d9ca]" />
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8e6b2f]">
                            Nájemné a platební podmínky
                          </div>
                          <div className="mt-2 space-y-2">
                            <div className="h-[10px] w-[92%] rounded-full bg-[#d8cfbf]" />
                            <div className="h-[10px] w-[78%] rounded-full bg-[#e2d9ca]" />
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8e6b2f]">
                            Doba trvání a ukončení
                          </div>
                          <div className="mt-2 space-y-2">
                            <div className="h-[10px] w-[84%] rounded-full bg-[#d8cfbf]" />
                            <div className="h-[10px] w-[66%] rounded-full bg-[#e2d9ca]" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 grid grid-cols-2 gap-8 pt-4">
                        <div>
                          <div className="h-px w-full bg-[#bcae90]" />
                          <div className="mt-2 text-xs text-[#5a5144]">Pronajímatel</div>
                        </div>
                        <div>
                          <div className="h-px w-full bg-[#bcae90]" />
                          <div className="mt-2 text-xs text-[#5a5144]">Nájemce</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                        Forma
                      </div>
                      <div className="mt-2 text-sm font-semibold text-white">
                        Přehledná a profesionální
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                        Výstup
                      </div>
                      <div className="mt-2 text-sm font-semibold text-white">
                        PDF ke stažení
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                        Použití
                      </div>
                      <div className="mt-2 text-sm font-semibold text-white">
                        Běžné životní situace
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="jak-to-funguje" className="pt-24 lg:pt-28">
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge>Postup</SectionBadge>
              <h2 className="mt-5 font-serif text-4xl text-white sm:text-5xl">
                Jak to funguje
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
                Celý proces je navržen tak, aby uživatel rychle porozuměl jednotlivým krokům,
                vyplnil podstatné údaje a získal dokument v přehledné podobě.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {steps.map((step) => (
                <StepCard
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  text={step.text}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-[#08101d]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div className="max-w-xl">
              <SectionBadge>Typy dokumentů</SectionBadge>
              <h2 className="mt-5 font-serif text-4xl text-white sm:text-5xl">
                Vyberte dokument podle své situace
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
                Základem důvěry je správná volba dokumentu. Proto má být už od homepage jasné,
                pro jaké situace je služba určena a kam uživatel pokračuje.
              </p>

              <div className="mt-8 space-y-4">
                {reasons.map((reason) => (
                  <div key={reason.title} className="legal-soft-card p-5">
                    <h3 className="text-base font-semibold text-white">{reason.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{reason.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link href="/dokumenty" className="legal-button-secondary">
                  Zobrazit všechny dokumenty
                </Link>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {documentTypes.map((item) => (
                <DocumentCard
                  key={item.title}
                  title={item.title}
                  text={item.text}
                  href={item.href}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-[#060d18]">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <SectionBadge>Časté otázky</SectionBadge>
            <h2 className="mt-5 font-serif text-4xl text-white sm:text-5xl">
              Praktické informace před vytvořením dokumentu
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
              U právního produktu je důležité odstranit nejistotu ještě před zahájením objednávky.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {faqItems.map((item) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link href="/dokumenty" className="legal-button-primary">
              Pokračovat k výběru dokumentu
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}