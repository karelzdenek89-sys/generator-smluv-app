'use client';

import { useState } from 'react';
import TrackedLink from '@/app/components/analytics/TrackedLink';
import type { AnalyticsEventParams, PriceBand } from '@/lib/analytics';
import type { ContractType } from '@/lib/contracts';
import type { MonetizationMode } from '@/lib/monetization-policy';
import { PRICING_TIER_CONFIG } from '@/lib/pricing';

interface Contract {
  title: string;
  subtitle: string;
  href: string;
  paragraph: string;
  contractType: ContractType;
  tag?: string;
}

type DppMerchandising = {
  mode: MonetizationMode;
  priceLabel: string;
  badgeLabel: string | null;
  subtitle: string | null;
  experimentId: string | null;
  variant: string | null;
};

const PAID_BASIC_PRICE_LABEL = `od ${PRICING_TIER_CONFIG.basic.priceLabel}`;
const PAID_BASIC_PRICE_BAND = String(PRICING_TIER_CONFIG.basic.priceCzk) as PriceBand;

const mainContracts: Contract[] = [
  {
    title: 'Nájemní smlouva',
    subtitle: 'Pronájem bytu nebo domu s kaucí, výpovědními lhůtami a předávacím protokolem.',
    href: '/najem',
    paragraph: '§ 2201 a násl. OZ',
    contractType: 'lease',
    tag: 'Nejoblíbenější',
  },
  {
    title: 'Kupní smlouva na vozidlo',
    subtitle: 'Prodej auta s VIN, stavem tachometru, odpovědností za vady a podmínkami předání.',
    href: '/auto',
    paragraph: '§ 2079 a násl. OZ',
    contractType: 'car_sale',
    tag: 'Populární',
  },
  {
    title: 'DPP — Dohoda o provedení práce',
    subtitle: 'Brigádnická dohoda do 300 hodin ročně s vymezeným druhem práce a odměnou.',
    href: '/dpp',
    paragraph: '§ 75 a násl. ZP',
    contractType: 'dpp',
  },
  {
    title: 'Pracovní smlouva',
    subtitle: 'Vznik pracovního poměru v souladu se zákoníkem práce. Místo, druh práce, plat.',
    href: '/pracovni',
    paragraph: '§ 33 a násl. ZP',
    contractType: 'employment',
  },
  {
    title: 'Smlouva o dílo',
    subtitle: 'Zakázka, cena, termín odevzdání, odpovědnost za vady a postup při reklamaci.',
    href: '/smlouva-o-dilo',
    paragraph: '§ 2586 a násl. OZ',
    contractType: 'work_contract',
  },
];

const moreContracts: Contract[] = [
  {
    title: 'Darovací smlouva',
    subtitle: 'Převod peněz, vozidla nebo věci jako dar — pro rodinu i třetí osoby.',
    href: '/darovaci',
    paragraph: '§ 2055 a násl. OZ',
    contractType: 'gift',
  },
  {
    title: 'Podnájemní smlouva',
    subtitle: 'Podnájem části nebo celého bytu se souhlasem pronajímatele.',
    href: '/podnajem',
    paragraph: '§ 2274 a násl. OZ',
    contractType: 'sublease',
  },
  {
    title: 'Kupní smlouva — movitá věc',
    subtitle: 'Prodej elektroniky, nábytku, kola nebo jiné věci. Záruky a podmínky předání.',
    href: '/kupni',
    paragraph: '§ 2079 a násl. OZ',
    contractType: 'general_sale',
  },
  {
    title: 'Smlouva o poskytování služeb',
    subtitle: 'Opakující se nebo jednorázová služba, cena, termíny a sankce za prodlení.',
    href: '/sluzby',
    paragraph: '§ 1746 OZ',
    contractType: 'service',
  },
  {
    title: 'Smlouva o spolupráci',
    subtitle: 'Obchodní spolupráce mezi OSVČ nebo firmami. Plnění, podíly a exit klauzule.',
    href: '/spoluprace',
    paragraph: '§ 1746 OZ',
    contractType: 'cooperation',
  },
  {
    title: 'Zápůjčka (půjčka)',
    subtitle: 'Smlouva o zápůjčce peněz nebo věci se splátkovým kalendářem a úroky.',
    href: '/pujcka',
    paragraph: '§ 2390 a násl. OZ',
    contractType: 'loan',
  },
  {
    title: 'Uznání dluhu',
    subtitle: 'Písemné uznání pohledávky s novým termínem splatnosti — posílí vymahatelnost.',
    href: '/uznani-dluhu',
    paragraph: '§ 2053 OZ',
    contractType: 'debt_acknowledgment',
  },
  {
    title: 'NDA — Dohoda o mlčenlivosti',
    subtitle: 'Ochrana obchodního tajemství, know-how a interních informací.',
    href: '/nda',
    paragraph: '§ 504 OZ',
    contractType: 'nda',
  },
  {
    title: 'Plná moc',
    subtitle: 'Oprávnění jednat jménem jiné osoby — obecná nebo pro konkrétní úkon.',
    href: '/plna-moc',
    paragraph: '§ 441 a násl. OZ',
    contractType: 'power_of_attorney',
  },
];

function ContractCard({
  c,
  featured,
  position,
  dppMerchandising,
}: {
  c: Contract;
  featured?: boolean;
  position: number;
  dppMerchandising: DppMerchandising;
}) {
  const isDpp = c.contractType === 'dpp';
  const tag = isDpp ? dppMerchandising.badgeLabel : c.tag;
  const subtitle = isDpp && dppMerchandising.subtitle
    ? dppMerchandising.subtitle
    : c.subtitle;
  const priceLabel = isDpp ? dppMerchandising.priceLabel : PAID_BASIC_PRICE_LABEL;
  const monetizationMode: MonetizationMode = isDpp ? dppMerchandising.mode : 'paid';
  const priceBand: PriceBand = isDpp && monetizationMode === 'free_experiment'
    ? '0'
    : PAID_BASIC_PRICE_BAND;
  const analyticsParams: AnalyticsEventParams = {
    contract_type: c.contractType,
    monetization_mode: monetizationMode,
    surface: 'homepage_catalog',
    position,
    price_band: priceBand,
    ...(isDpp && dppMerchandising.experimentId
      ? { experiment_id: dppMerchandising.experimentId }
      : {}),
    ...(isDpp && dppMerchandising.variant ? { variant: dppMerchandising.variant } : {}),
  };

  return (
    <TrackedLink
      href={c.href}
      eventName="homepage_contract_card_click"
      eventParams={analyticsParams}
      data-contract-type={c.contractType}
      data-monetization-mode={monetizationMode}
      data-position={position}
      className={`group relative flex flex-col rounded-2xl border transition-all duration-300
        ${featured
          ? 'border-[#c9a852]/40 bg-[#0a1628] hover:border-[#c9a852]/70 hover:shadow-[0_8px_40px_rgba(201,168,82,0.12)]'
          : 'border-[#c9a852]/20 bg-[#081120] hover:border-[#c9a852]/50 hover:shadow-[0_4px_24px_rgba(201,168,82,0.08)]'
        }
        p-7 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a852] focus-visible:ring-offset-2 focus-visible:ring-offset-[#040c1a]`}
    >
      {tag && (
        <span className="absolute -top-2.5 left-5 rounded-full border border-[#c9a852]/50 bg-[#0a1628] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c9a852]">
          {tag}
        </span>
      )}

      <div className="mb-auto">
        <h3 className={`mb-3 font-serif italic leading-snug text-white group-hover:text-[#c9a852] transition-colors duration-200
          ${featured ? 'text-[1.35rem]' : 'text-[1.2rem]'}`}>
          {c.title}
        </h3>
        <p className="text-sm leading-relaxed text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#c9a852]/10 pt-4">
        <span className="text-xs text-slate-600 font-mono tracking-wide">{c.paragraph}</span>
        <span className="shrink-0 text-xs font-black text-white">
          {priceLabel}
        </span>
      </div>

      {/* Arrow */}
      <span aria-hidden="true" className="absolute right-5 top-1/2 -translate-y-1/2 text-[#c9a852]/30 text-xl font-thin transition-all duration-200 group-hover:text-[#c9a852]/70 group-hover:translate-x-0.5">
        →
      </span>
    </TrackedLink>
  );
}

export default function ContractGridPremium({ dppMerchandising }: { dppMerchandising: DppMerchandising }) {
  const [expanded, setExpanded] = useState(false);
  const dppPromoted = dppMerchandising.badgeLabel !== null;

  return (
    <div>
      {/* Main 5 contracts */}
      <div data-homepage-catalog="primary" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mainContracts.map((c, index) => (
          <ContractCard
            key={c.href}
            c={c}
            featured={index < 2 || (c.contractType === 'dpp' && dppPromoted)}
            position={index + 1}
            dppMerchandising={dppMerchandising}
          />
        ))}
      </div>

      {/* Expandable section */}
      <div
        className={`overflow-hidden transition-all duration-500 ${expanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
        aria-hidden={!expanded}
        inert={!expanded}
        id="homepage-more-contracts"
        data-homepage-catalog="expanded"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {moreContracts.map((c, index) => (
            <ContractCard
              key={c.href}
              c={c}
              position={mainContracts.length + index + 1}
              dppMerchandising={dppMerchandising}
            />
          ))}
        </div>
      </div>

      {/* Toggle button */}
      <div data-homepage-catalog-toggle="true" className="mt-8 flex justify-center">
        <button
          onClick={() => setExpanded(v => !v)}
          aria-controls="homepage-more-contracts"
          aria-expanded={expanded}
          className="group flex items-center gap-3 rounded-xl border border-[#c9a852]/30 bg-[#0a1628] px-7 py-3.5 text-base font-semibold text-[#c9a852] transition-all duration-200 hover:border-[#c9a852]/60 hover:bg-[#0c1e38] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a852] focus-visible:ring-offset-2 focus-visible:ring-offset-[#040c1a]"
        >
          <span>{expanded ? 'Skrýt smlouvy' : 'Zobrazit všechny smlouvy'}</span>
          <span className={`text-base transition-transform duration-300 ${expanded ? '-rotate-180' : ''}`}>↓</span>
        </button>
      </div>
    </div>
  );
}
