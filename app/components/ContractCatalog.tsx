'use client';

import { useState } from 'react';
import Link from 'next/link';

type AccentKey =
  | 'lease' | 'car' | 'gift' | 'work' | 'loan' | 'nda'
  | 'sale' | 'employment' | 'dpp' | 'service' | 'sublease'
  | 'poa' | 'debt' | 'coop';

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

interface ContractItem {
  title: string;
  description: string;
  href: string;
  price: string;
  accentKey: AccentKey;
  highlight: string;
  paragraph: string;
  top: boolean;
}

const contracts: ContractItem[] = [
  // ── Top 8 ────────────────────────────────────────────────────────────────
  {
    title:       'NÁJEMNÍ SMLOUVA',
    description: 'Pronajímáte nebo si pronajímáte byt či dům. Kauce, pravidla pro zvířata a Airbnb, předávací protokol a podmínky ukončení.',
    href:        '/najem',
    price:       '249 Kč',
    accentKey:   'lease',
    highlight:   'Předávací protokol v ceně',
    paragraph:   '§ 2201 a násl. OZ',
    top: true,
  },
  {
    title:       'KUPNÍ SMLOUVA NA VOZIDLO',
    description: 'Kupujete nebo prodáváte ojeté vozidlo. Stav auta, najeté kilometry, odpovědnost za vady a podmínky bezpečného předání.',
    href:        '/auto',
    price:       '249 Kč',
    accentKey:   'car',
    highlight:   'Stav, vady, předání',
    paragraph:   '§ 2079 a násl. OZ',
    top: true,
  },
  {
    title:       'DAROVACÍ SMLOUVA',
    description: 'Převádíte peníze, auto nebo nemovitost jako dar. Právně čistý doklad vhodný pro rodinu i osoby mimo příbuzenstvo.',
    href:        '/darovaci',
    price:       '249 Kč',
    accentKey:   'gift',
    highlight:   'Peníze, auto i nemovitost',
    paragraph:   '§ 2055 a násl. OZ',
    top: true,
  },
  {
    title:       'SMLOUVA O DÍLO',
    description: 'Řemeslník nebo objednatel uzavírá dohodu o zhotovení. Cena, termín, předání, sankce za prodlení a odpovědnost za vady.',
    href:        '/smlouva-o-dilo',
    price:       '249 Kč',
    accentKey:   'work',
    highlight:   'Termíny, sankce, předání',
    paragraph:   '§ 2586 a násl. OZ',
    top: true,
  },
  {
    title:       'PODNÁJEMNÍ SMLOUVA',
    description: 'Podnajímáte část nebo celý byt. Právní základ se souhlasem pronajímatele, kauce a pravidla pro obě strany.',
    href:        '/podnajem',
    price:       '249 Kč',
    accentKey:   'sublease',
    highlight:   'Souhlas pronajímatele + kauce',
    paragraph:   '§ 2274 a násl. OZ',
    top: true,
  },
  {
    title:       'SMLOUVA O POSKYTOVÁNÍ SLUŽEB',
    description: 'Freelancer nebo agentura poskytuje opakované nebo projektové služby. Paušál, hodinová sazba, SLA a ochrana autorských práv.',
    href:        '/sluzby',
    price:       '249 Kč',
    accentKey:   'service',
    highlight:   'SLA, IP práva, mlčenlivost',
    paragraph:   '§ 1746 odst. 2 OZ',
    top: true,
  },
  {
    title:       'SMLOUVA O MLČENLIVOSTI',
    description: 'Sdílíte citlivé informace nebo obchodní know-how. Jednostranná nebo oboustranná mlčenlivost s konkrétním vymezením rozsahu.',
    href:        '/nda',
    price:       '249 Kč',
    accentKey:   'nda',
    highlight:   'Jednostranná i oboustranná',
    paragraph:   '§ 504 OZ + GDPR',
    top: true,
  },
  {
    title:       'PLNÁ MOC',
    description: 'Pověřujete jinou osobu k zastoupení před úřadem, bankou nebo v obchodní věci. Obecná, jednorázová nebo ověřená verze.',
    href:        '/plna-moc',
    price:       '249 Kč',
    accentKey:   'poa',
    highlight:   'Ověřená verze pro úřady',
    paragraph:   '§ 441 OZ',
    top: true,
  },
  // ── Dalších 6 ────────────────────────────────────────────────────────────
  {
    title:       'SMLOUVA O ZÁPŮJČCE',
    description: 'Půjčujete nebo přijímáte peníze. Volitelné úročení, splátkový kalendář a možnost zajištění pohledávky.',
    href:        '/pujcka',
    price:       '249 Kč',
    accentKey:   'loan',
    highlight:   'Splátky, úroky, zajištění',
    paragraph:   '§ 2390 a násl. OZ',
    top: false,
  },
  {
    title:       'KUPNÍ SMLOUVA',
    description: 'Prodáváte nebo kupujete movitou věc — elektroniku, nábytek, kolo. Záruka, odpovědnost za vady a podmínky předání.',
    href:        '/kupni',
    price:       '249 Kč',
    accentKey:   'sale',
    highlight:   'Vady, záruka, předání',
    paragraph:   '§ 2079 a násl. OZ',
    top: false,
  },
  {
    title:       'PRACOVNÍ SMLOUVA',
    description: 'Zaměstnavatel uzavírá pracovní poměr. Mzda, pracovní doba, zkušební i výpovědní lhůta — všechny zákonné náležitosti.',
    href:        '/pracovni',
    price:       '249 Kč',
    accentKey:   'employment',
    highlight:   'Zákonné náležitosti § 34 ZP',
    paragraph:   '§ 34 zákoníku práce',
    top: false,
  },
  {
    title:       'DOHODA O PROVEDENÍ PRÁCE',
    description: 'Brigády a jednorázové úkoly do 300 hod./rok. Mimo pravidelný pracovní poměr, s IP doložkou pro kreativní práce.',
    href:        '/dpp',
    price:       '249 Kč',
    accentKey:   'dpp',
    highlight:   'Max. 300 hod./rok',
    paragraph:   '§ 75 zákoníku práce',
    top: false,
  },
  {
    title:       'UZNÁNÍ DLUHU',
    description: 'Dlužník písemně uznává závazek. Obnovuje promlčecí lhůtu na 10 let a posiluje pozici věřitele při vymáhání.',
    href:        '/uznani-dluhu',
    price:       '249 Kč',
    accentKey:   'debt',
    highlight:   'Promlčení 10 let + exekuce',
    paragraph:   '§ 2053 OZ',
    top: false,
  },
  {
    title:       'SMLOUVA O SPOLUPRÁCI',
    description: 'Spolupráce OSVČ nebo firem s jasnými pravidly. Podíl na výnosech, IP práva, mlčenlivost a exit klauzule.',
    href:        '/spoluprace',
    price:       '249 Kč',
    accentKey:   'coop',
    highlight:   'IP, výnosy, exit klauzule',
    paragraph:   '§ 1746 odst. 2 OZ',
    top: false,
  },
];

export default function ContractCatalog() {
  const [showAll, setShowAll] = useState(false);

  const top      = contracts.filter(c => c.top);
  const rest     = contracts.filter(c => !c.top);
  const visible  = showAll ? contracts : top;

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {visible.map((contract) => (
          <Link
            key={contract.href}
            href={contract.href}
            className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#0c1426] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
          >
            {/* Hover accent */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${accentMap[contract.accentKey]} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />

            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-400">
                {contract.highlight}
              </div>
              <h3 className="mb-1 text-sm font-black italic tracking-tight text-white leading-snug">
                {contract.title}
              </h3>
              <div className="mb-3 text-[10px] font-medium text-slate-600">
                {contract.paragraph}
              </div>
              <p className="mb-4 flex-grow text-xs leading-relaxed text-slate-400">
                {contract.description}
              </p>

              <div className="mt-auto border-t border-white/8 pt-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-amber-400 transition group-hover:text-amber-300">
                  Vytvořit smlouvu
                </span>
                <span className="text-sm text-slate-500 transition group-hover:translate-x-1 group-hover:text-white">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Show more / show less */}
      {!showAll ? (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-3 text-sm font-bold text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            Zobrazit všech 14 typů dokumentů
            <span className="text-slate-500">↓</span>
          </button>
          <p className="mt-3 text-xs text-slate-600">
            Dalších {rest.length} typů: Zápůjčka, Kupní smlouva, Pracovní smlouva, DPP, Uznání dluhu, Spolupráce
          </p>
        </div>
      ) : (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAll(false)}
            className="text-xs text-slate-600 hover:text-slate-400 transition underline-offset-2 hover:underline"
          >
            ▲ Zobrazit méně
          </button>
        </div>
      )}
    </div>
  );
}
