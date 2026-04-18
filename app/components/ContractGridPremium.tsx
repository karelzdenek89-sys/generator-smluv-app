'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Contract {
  title: string;
  subtitle: string;
  href: string;
  paragraph: string;
  price: string;
  tag?: string;
}

const mainContracts: Contract[] = [
  {
    title: 'Nájemní smlouva',
    subtitle: 'Pronájem bytu nebo domu s kaucí, výpovědními lhůtami a předávacím protokolem.',
    href: '/najem',
    paragraph: '§ 2201 a násl. OZ',
    price: 'od 99 Kč',
    tag: 'Nejoblíbenější',
  },
  {
    title: 'Kupní smlouva na vozidlo',
    subtitle: 'Prodej auta s VIN, stavem tachometru, odpovědností za vady a podmínkami předání.',
    href: '/auto',
    paragraph: '§ 2079 a násl. OZ',
    price: 'od 99 Kč',
    tag: 'Populární',
  },
  {
    title: 'Pracovní smlouva',
    subtitle: 'Vznik pracovního poměru v souladu se zákoníkem práce. Místo, druh práce, plat.',
    href: '/pracovni',
    paragraph: '§ 33 a násl. ZP',
    price: 'od 99 Kč',
  },
  {
    title: 'Smlouva o dílo',
    subtitle: 'Zakázka, cena, termín odevzdání, odpovědnost za vady a postup při reklamaci.',
    href: '/smlouva-o-dilo',
    paragraph: '§ 2586 a násl. OZ',
    price: 'od 99 Kč',
  },
  {
    title: 'Darovací smlouva',
    subtitle: 'Převod peněz, vozidla nebo věci jako dar — pro rodinu i třetí osoby.',
    href: '/darovaci',
    paragraph: '§ 2055 a násl. OZ',
    price: 'od 99 Kč',
  },
];

const moreContracts: Contract[] = [
  {
    title: 'Podnájemní smlouva',
    subtitle: 'Podnájem části nebo celého bytu se souhlasem pronajímatele.',
    href: '/podnajem',
    paragraph: '§ 2274 a násl. OZ',
    price: 'od 99 Kč',
  },
  {
    title: 'Kupní smlouva — movitá věc',
    subtitle: 'Prodej elektroniky, nábytku, kola nebo jiné věci. Záruky a podmínky předání.',
    href: '/kupni',
    paragraph: '§ 2079 a násl. OZ',
    price: 'od 99 Kč',
  },
  {
    title: 'DPP — Dohoda o provedení práce',
    subtitle: 'Brigádnická dohoda do 300 hodin ročně s vymezeným druhem práce a odměnou.',
    href: '/dpp',
    paragraph: '§ 75 a násl. ZP',
    price: 'od 99 Kč',
  },
  {
    title: 'Smlouva o poskytování služeb',
    subtitle: 'Opakující se nebo jednorázová služba, cena, termíny a sankce za prodlení.',
    href: '/sluzby',
    paragraph: '§ 1746 OZ',
    price: 'od 99 Kč',
  },
  {
    title: 'Smlouva o spolupráci',
    subtitle: 'Obchodní spolupráce mezi OSVČ nebo firmami. Plnění, podíly a exit klauzule.',
    href: '/spoluprace',
    paragraph: '§ 1746 OZ',
    price: 'od 99 Kč',
  },
  {
    title: 'Zápůjčka (půjčka)',
    subtitle: 'Smlouva o zápůjčce peněz nebo věci se splátkovým kalendářem a úroky.',
    href: '/pujcka',
    paragraph: '§ 2390 a násl. OZ',
    price: 'od 99 Kč',
  },
  {
    title: 'Uznání dluhu',
    subtitle: 'Písemné uznání pohledávky s novým termínem splatnosti — posílí vymahatelnost.',
    href: '/uznani-dluhu',
    paragraph: '§ 2053 OZ',
    price: 'od 99 Kč',
  },
  {
    title: 'NDA — Dohoda o mlčenlivosti',
    subtitle: 'Ochrana obchodního tajemství, know-how a interních informací.',
    href: '/nda',
    paragraph: '§ 504 OZ',
    price: 'od 99 Kč',
  },
  {
    title: 'Plná moc',
    subtitle: 'Oprávnění jednat jménem jiné osoby — obecná nebo pro konkrétní úkon.',
    href: '/plna-moc',
    paragraph: '§ 441 a násl. OZ',
    price: 'od 99 Kč',
  },
];

function ContractCard({ c, featured }: { c: Contract; featured?: boolean }) {
  return (
    <Link
      href={c.href}
      className={`group relative flex flex-col rounded-2xl border transition-all duration-300
        ${featured
          ? 'border-[#c9a852]/40 bg-[#0a1628] hover:border-[#c9a852]/70 hover:shadow-[0_8px_40px_rgba(201,168,82,0.12)]'
          : 'border-[#c9a852]/20 bg-[#081120] hover:border-[#c9a852]/50 hover:shadow-[0_4px_24px_rgba(201,168,82,0.08)]'
        }
        p-7 no-underline`}
    >
      {c.tag && (
        <span className="absolute -top-2.5 left-5 rounded-full border border-[#c9a852]/50 bg-[#0a1628] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c9a852]">
          {c.tag}
        </span>
      )}

      <div className="mb-auto">
        <h3 className={`mb-3 font-serif italic leading-snug text-white group-hover:text-[#c9a852] transition-colors duration-200
          ${featured ? 'text-[1.35rem]' : 'text-[1.2rem]'}`}>
          {c.title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-400">
          {c.subtitle}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#c9a852]/10 pt-4">
        <span className="text-xs text-slate-600 font-mono tracking-wide">{c.paragraph}</span>
      </div>

      {/* Arrow */}
      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#c9a852]/30 text-xl font-thin transition-all duration-200 group-hover:text-[#c9a852]/70 group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}

export default function ContractGridPremium() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {/* Main 5 contracts */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mainContracts.slice(0, 2).map(c => (
          <ContractCard key={c.href} c={c} featured />
        ))}
        {mainContracts.slice(2).map(c => (
          <ContractCard key={c.href} c={c} />
        ))}
      </div>

      {/* Expandable section */}
      <div
        className={`overflow-hidden transition-all duration-500 ${expanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
        aria-hidden={!expanded}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {moreContracts.map(c => (
            <ContractCard key={c.href} c={c} />
          ))}
        </div>
      </div>

      {/* Toggle button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => setExpanded(v => !v)}
          className="group flex items-center gap-3 rounded-xl border border-[#c9a852]/30 bg-[#0a1628] px-7 py-3.5 text-base font-semibold text-[#c9a852] transition-all duration-200 hover:border-[#c9a852]/60 hover:bg-[#0c1e38]"
        >
          <span>{expanded ? 'Skrýt smlouvy' : 'Zobrazit všechny smlouvy'}</span>
          <span className={`text-base transition-transform duration-300 ${expanded ? '-rotate-180' : ''}`}>↓</span>
        </button>
      </div>
    </div>
  );
}
