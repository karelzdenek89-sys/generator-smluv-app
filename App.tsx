'use client';

import Link from 'next/link';
import {
  CarFront,
  ChevronRight,
  FileText,
  HandCoins,
  Home,
  Landmark,
  Lock,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

const situations = [
  {
    title: 'Prodávám auto',
    text: 'Kupní smlouva na vozidlo s přehledně zachycenými údaji o stranách, vozidle, ceně a předání.',
    href: '/auto',
    icon: CarFront,
  },
  {
    title: 'Pronajímám byt',
    text: 'Nájemní smlouva pro běžný pronájem bytu nebo domu s jasně zachycenými podmínkami nájmu.',
    href: '/najem',
    icon: Home,
  },
  {
    title: 'Půjčuji peníze',
    text: 'Smlouva o zápůjčce pro situace, kdy potřebujete písemně upravit dluh, splácení a základní podmínky.',
    href: '/pujcka',
    icon: HandCoins,
  },
  {
    title: 'Řeším zakázku nebo dílo',
    text: 'Smlouva o dílo pro projekty, práce a výstupy, které mají být řádně předány a převzaty.',
    href: '/smlouva-o-dilo',
    icon: Landmark,
  },
];

const trustPoints = [
  'Standardizované dokumenty pro běžné a typizované situace',
  'PDF dokument určený ke kontrole a podpisu',
  'Bezpečná platba přes Stripe',
  'Transparentní provozovatel, obchodní podmínky, GDPR a kontakt veřejně na webu',
];

const pricingTiers = [
  {
    title: 'Základní dokument',
    price: '99 Kč',
    label: 'Pro rychlé standardní použití',
    intro: 'Když potřebujete přehledný finální dokument bez doprovodných podkladů navíc.',
    bullets: [
      'Dokument sestavený podle vyplněných údajů',
      'Standardní náležitosti obvyklé pro daný typ dokumentu',
      'Vhodné pro běžné situace, kde jsou podmínky mezi stranami jasné',
    ],
  },
  {
    title: 'Komplexní balíček',
    price: '199 Kč',
    label: 'Pro vyšší smluvní jistotu',
    intro: 'Když chcete doplnit důležitá ujednání a snížit riziko běžných sporů nebo nejasností.',
    bullets: [
      'Vše ze Základního dokumentu',
      'Rozšířené klauzule podle typu dokumentu',
      'Lepší připravenost pro situace, kde záleží na sankcích, termínech nebo odpovědnosti',
    ],
    featured: true,
  },
];

const processSteps = [
  {
    title: 'Vyberete situaci',
    text: 'Začínáte podle toho, co potřebujete vyřešit. Nemusíte nejprve procházet celý katalog dokumentů.',
  },
  {
    title: 'Vyplníte formulář',
    text: 'Doplníte údaje stran, předmětu, ceny a dalších podmínek. Formulář vás vede systematicky krok za krokem.',
  },
  {
    title: 'Získáte výstup',
    text: 'Po zaplacení je PDF dokument zpřístupněn a určen ke kontrole a podpisu.',
  },
];

function SituationCard({
  title,
  text,
  href,
  icon: Icon,
}: {
  title: string;
  text: string;
  href: string;
  icon: typeof CarFront;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
        Otevřít dokument <ChevronRight className="h-4 w-4" />
      </div>
    </Link>
  );
}

function PreviewSheet() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-[#f8f5ef] p-5 shadow-[0_28px_60px_rgba(15,23,42,0.14)]">
      <div className="rounded-[1.5rem] border border-[#e2d7c4] bg-[#f5efe4] px-6 py-7 text-slate-800 shadow-inner">
        <div className="mb-7 flex items-center justify-between border-b border-[#deceb5] pb-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8d7752]">Ukázka výstupu</div>
            <div className="mt-1 font-serif text-3xl text-[#5b4420]">Smluvní dokument</div>
          </div>
          <FileText className="h-6 w-6 text-[#a98b5b]" />
        </div>

        <div className="space-y-5 text-[15px] leading-7">
          <section>
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8d7752]">1. Smluvní strany</div>
            <p className="mt-2">Přehledně zachycené identifikační údaje stran podle vyplněných údajů.</p>
          </section>

          <section>
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8d7752]">2. Předmět a podmínky</div>
            <p className="mt-2">Věc, cena, termíny, předání a další ujednání členěná do jasné struktury.</p>
          </section>

          <section>
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8d7752]">3. Závěrečná ustanovení</div>
            <p className="mt-2">Dokument je sestaven podle údajů zadaných uživatelem a je určen ke kontrole a podpisu.</p>
          </section>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8 border-t border-[#deceb5] pt-6 text-sm text-[#7b6746]">
          <div>
            <div className="border-t border-[#ccb794] pt-2">Strana A</div>
          </div>
          <div>
            <div className="border-t border-[#ccb794] pt-2">Strana B</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.08),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/72 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <div className="text-lg font-semibold tracking-[-0.03em] text-slate-900">SmlouvaHned.cz</div>
            <div className="mt-1 text-xs leading-5 text-slate-500">
              Online nástroj pro sestavení standardizovaných smluvních dokumentů. Nejde o individuální právní poradenství.
            </div>
          </div>

          <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs text-slate-600 shadow-sm md:flex">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            Vhodné pro běžné a typizované situace
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pt-16">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm">
                <UserRound className="h-4 w-4 text-indigo-500" />
                Standardizované dokumenty pro běžné životní a podnikatelské situace
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-slate-900 sm:text-5xl lg:text-6xl">
                Smluvní dokument
                <span className="block text-indigo-600">strukturovaně a systematicky</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Vyberete situaci, doplníte údaje do přehledného formuláře a po zaplacení získáte standardizovaný dokument
                v PDF určený ke kontrole a podpisu.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#situace"
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-500"
                >
                  Vybrat situaci <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#jak-to-funguje"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:border-slate-300"
                >
                  Jak služba funguje
                </Link>
              </div>
            </div>

            <div>
              <PreviewSheet />
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {trustPoints.map(item => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 text-sm leading-6 text-slate-600 shadow-sm">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-slate-700">
            SmlouvaHned je online nástroj pro sestavení standardizovaných smluvních dokumentů podle údajů zadaných uživatelem.
            Nejde o individuální právní poradenství ani o poskytování advokátních služeb. U složitých, sporných nebo
            nestandardních situací doporučujeme konzultaci s advokátem.
          </div>
        </section>

        <section id="situace" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Co potřebujete vyřešit</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900">Nejčastější situace</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Místo procházení katalogu můžete začít rovnou situací, kterou dnes potřebujete vyřešit.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {situations.map(item => (
              <SituationCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Co přesně získáte</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                Výstup, který můžete zkontrolovat a podepsat
              </h2>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
                <li>PDF dokument sestavený podle údajů vyplněných ve formuláři.</li>
                <li>Přehlednou strukturu se stranami, předmětem, cenou, termíny a závěrečnými ustanoveními.</li>
                <li>U vyšších variant také doprovodné podklady a lepší připravenost k podpisu nebo předání.</li>
              </ul>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Kdy je služba vhodná</div>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                Pro běžné situace, ne pro složité spory
              </h2>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
                <li>Vhodné tam, kde se strany shodly na základních podmínkách a potřebují je přehledně zachytit písemně.</li>
                <li>Vhodné pro typizované situace jako nájem, převod vozidla, darování, zápůjčka nebo smlouva o dílo.</li>
                <li>Nevhodné pro sporné, nestandardní nebo vysoce individuální situace, kde už je vhodné řešit věc s advokátem.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="jak-to-funguje" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Jak to funguje</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900">Tři kroky ke smluvnímu dokumentu</h2>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {processSteps.map((item, index) => (
              <div key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-6 shadow-sm">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                  0{index + 1}
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Ceník a varianty</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900">Vyberte úroveň zpracování</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Vyšší varianta neznamená jen více textu, ale větší jistotu, lepší připravenost k podpisu a doprovodné podklady.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {pricingTiers.map(item => (
              <div
                key={item.title}
                className={`rounded-[1.75rem] border p-6 shadow-sm ${
                  item.featured
                    ? 'border-indigo-200 bg-indigo-50/80 shadow-[0_20px_40px_rgba(79,70,229,0.08)]'
                    : 'border-slate-200 bg-white/80'
                }`}
              >
                {item.featured ? (
                  <div className="mb-4 inline-flex rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                    Doporučená volba
                  </div>
                ) : null}
                <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</div>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-900">{item.title}</h3>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-900">{item.price}</div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.intro}</p>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                  {item.bullets.map(point => (
                    <li key={point} className="flex items-start gap-3">
                      <Lock className="mt-1 h-4 w-4 shrink-0 text-indigo-500" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#situace"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Pokračovat k výběru dokumentu <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/o-projektu"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:border-slate-300"
            >
              Kdy je služba vhodná
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}


