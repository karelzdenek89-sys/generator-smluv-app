'use client';

import { useState } from 'react';
import Link from 'next/link';

type PriceRegime = 'fixed' | 'non_binding' | 'estimate';
type VatRegime = 'none' | 'reduced_12' | 'standard_21' | 'reverse_charge';

const VAT_RATES: Record<VatRegime, number> = {
  none: 0,
  reduced_12: 0.12,
  standard_21: 0.21,
  reverse_charge: 0,
};

function formatCzk(value: number): string {
  const safe = Number.isFinite(value) ? Math.max(0, value) : 0;
  return `${safe.toLocaleString('cs-CZ', { maximumFractionDigits: 2 })} Kč`;
}

export default function ExtraWorkCalculator() {
  const [basePriceRaw, setBasePriceRaw] = useState<string>('250000');
  const [extraPriceRaw, setExtraPriceRaw] = useState<string>('35000');
  const [priceRegime, setPriceRegime] = useState<PriceRegime>('non_binding');
  const [vatRegime, setVatRegime] = useState<VatRegime>('reduced_12');

  const parsedBase = Number(basePriceRaw);
  const parsedExtra = Number(extraPriceRaw);
  const hasNegativeInput = (basePriceRaw !== '' && parsedBase < 0) || (extraPriceRaw !== '' && parsedExtra < 0);

  const basePrice = Number.isFinite(parsedBase) ? Math.max(0, parsedBase) : 0;
  const extraPrice = Number.isFinite(parsedExtra) ? Math.max(0, parsedExtra) : 0;
  const totalNet = basePrice + extraPrice;
  const overrunPercent = basePrice > 0 ? (extraPrice / basePrice) * 100 : 0;

  const vatRate = VAT_RATES[vatRegime];
  const vatAmount = totalNet * vatRate;
  const totalGross = totalNet + vatAmount;
  const extraGross = extraPrice * (1 + vatRate);

  const getRegimeVerdict = () => {
    if (priceRegime === 'fixed') {
      return {
        badge: 'Pevná cena / zaručený rozpočet (§ 2620 OZ)',
        tone: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
        summary:
          'Při pevné ceně nebo rozpočtu se zaručenou úplností nemá zhotovitel nárok na jednostranné navýšení ceny, i kdyby si dílo vyžádalo vyšší náklady. Vícepráce lze účtovat jen tehdy, pokud je objednatel předem písemně objedná nebo odsouhlasí změnovým listem (§ 564 OZ). Výjimkou jsou pouze zcela mimořádné nepředvídatelné okolnosti dle § 2620 odst. 2 OZ, o kterých rozhoduje soud.',
      };
    }
    if (priceRegime === 'non_binding') {
      if (overrunPercent > 10) {
        return {
          badge: `Překročení o ${overrunPercent.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} % (> 10 % limit § 2622 odst. 2 OZ)`,
          tone: 'border-red-400/30 bg-red-500/10 text-red-200',
          summary:
            'U rozpočtu s výhradou neúplnosti nebo nezávaznosti musí zhotovitel potřebu překročení oznámit písemně bez zbytečného odkladu poté, co se při provádění díla ukáže její nevyhnutelnost (§ 2622 odst. 1 OZ), jinak nárok na rozdíl v ceně zaniká. Protože navýšení přesahuje 10 % původního rozpočtu, má objednatel podle § 2622 odst. 2 OZ právo od smlouvy bez zbytečného odkladu odstoupit (s povinností uhradit poměrnou část ceny za již provedenou práci).',
        };
      }
      return {
        badge: `Navýšení do 10 % (${overrunPercent.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} % — § 2621–2622 OZ)`,
        tone: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
        summary:
          'Navýšení nepřesahuje 10 % původního rozpočtu. Pokud byla smlouva uzavřena s výhradou neúplnosti nebo nezávaznosti rozpočtu a zhotovitel nutnost víceprací i výši navýšení oznámí objednateli bez zbytečného odkladu, může se domáhat přiměřeného zvýšení ceny. Pokud objednatel nesouhlasí, určí zvýšení na návrh zhotovitele soud (§ 2621 odst. 2 OZ). Doporučujeme uzavřít písemný změnový list.',
      };
    }
    if (overrunPercent > 15) {
      return {
        badge: `Podstatné překročení odhadu (${overrunPercent.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} % — § 2612 OZ)`,
        tone: 'border-red-400/30 bg-red-500/10 text-red-200',
        summary:
          'Byla-li cena určena pouze odhadem, musí zhotovitel podstatné překročení oznámit objednateli s odůvodněním nové ceny bez zbytečného odkladu (§ 2612 odst. 1 OZ), jinak nemá právo na zaplacení rozdílu. Objednatel může od smlouvy odstoupit bez zbytečného odkladu poté, co mu byla zvýšená cena oznámena (§ 2612 odst. 2 OZ).',
      };
    }
    return {
      badge: `Cena určená odhadem (${overrunPercent.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} % — § 2612 OZ)`,
      tone: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
      summary:
        'Při mírném navýšení ceny určené odhadem doporučujeme změnu rozsahu, novou cenu a případný posun termínu zachytit písemným potvrzením víceprací nebo změnovým listem před zahájením prací navíc.',
    };
  };

  const verdict = getRegimeVerdict();

  return (
    <section
      className="rounded-2xl border border-[#c9a852]/25 bg-[#0c1426] p-6"
      aria-labelledby="extra-work-calc-title"
      data-testid="extra-work-calculator"
    >
      <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#c9a852]">
        Interaktivní kalkulačka pro stavebníky a řemeslníky
      </div>
      <h2 id="extra-work-calc-title" className="font-serif italic text-2xl font-bold text-white">
        Kalkulačka víceprací, překročení rozpočtu a DPH ve stavebnictví
      </h2>
      <p className="mt-2 text-sm leading-7 text-slate-400">
        Spočítejte procentuální překročení rozpočtu podle § 2612 a § 2620–2622 občanského zákoníku, ověřte zákonnou
        hranici 10 % pro právo objednatele odstoupit a zkontrolujte správný režim DPH podle zákona č. 235/2004 Sb.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="calc-base-price" className="mb-1.5 block text-xs font-semibold text-slate-300">
            Původní sjednaná cena díla bez DPH (Kč)
          </label>
          <input
            id="calc-base-price"
            type="number"
            min="0"
            step="1000"
            value={basePriceRaw}
            onChange={(e) => setBasePriceRaw(e.target.value)}
            className="site-input w-full"
          />
        </div>

        <div>
          <label htmlFor="calc-extra-price" className="mb-1.5 block text-xs font-semibold text-slate-300">
            Hodnota víceprací / změn rozsahu bez DPH (Kč)
          </label>
          <input
            id="calc-extra-price"
            type="number"
            min="0"
            step="500"
            value={extraPriceRaw}
            onChange={(e) => setExtraPriceRaw(e.target.value)}
            className="site-input w-full"
          />
        </div>

        <div>
          <label htmlFor="calc-price-regime" className="mb-1.5 block text-xs font-semibold text-slate-300">
            Cenový režim ve smlouvě o dílo
          </label>
          <select
            id="calc-price-regime"
            value={priceRegime}
            onChange={(e) => setPriceRegime(e.target.value as PriceRegime)}
            className="site-input w-full"
          >
            <option value="fixed">Pevná cena / zaručený rozpočet (§ 2620 OZ)</option>
            <option value="non_binding">Rozpočet s výhradou neúplnosti / nezávaznosti (§ 2621–2622 OZ)</option>
            <option value="estimate">Cena určená odhadem (§ 2612 OZ)</option>
          </select>
        </div>

        <div>
          <label htmlFor="calc-vat-regime" className="mb-1.5 block text-xs font-semibold text-slate-300">
            Režim DPH ve stavebnictví (zák. č. 235/2004 Sb.)
          </label>
          <select
            id="calc-vat-regime"
            value={vatRegime}
            onChange={(e) => setVatRegime(e.target.value as VatRegime)}
            className="site-input w-full"
          >
            <option value="reduced_12">Snížená sazba 12 % (§ 48 a § 48a ZDPH — stavby pro bydlení)</option>
            <option value="standard_21">Základní sazba 21 % (ostatní stavby a nebytové prostory)</option>
            <option value="reverse_charge">Přenesená daňová povinnost (§ 92e ZDPH — mezi plátci DPH)</option>
            <option value="none">Neplátce DPH (cena konečná bez DPH)</option>
          </select>
        </div>
      </div>

      {hasNegativeInput ? (
        <p className="mt-3 text-xs font-medium text-red-400" role="alert">
          ⚠ Částky ceny díla a víceprací nemohou být záporné. Pro výpočet byla záporná hodnota nahrazena nulou.
        </p>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs text-slate-400">Navýšení rozpočtu</div>
          <div className="mt-1 text-xl font-bold text-[#e2c77b]">
            {overrunPercent.toLocaleString('cs-CZ', { maximumFractionDigits: 1 })} %
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Vícepráce s DPH: {formatCzk(extraGross)}</div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs text-slate-400">Nová cena bez DPH</div>
          <div className="mt-1 text-xl font-bold text-white">{formatCzk(totalNet)}</div>
          <div className="mt-1 text-[11px] text-slate-400">Původně: {formatCzk(basePrice)}</div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="text-xs text-slate-400">DPH celkem</div>
          <div className="mt-1 text-xl font-bold text-white">{formatCzk(vatAmount)}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            {vatRegime === 'reverse_charge'
              ? 'Daň přiznává objednatel (§ 92e ZDPH)'
              : vatRegime === 'none'
                ? 'Neplátce DPH'
                : `Sazba ${Math.round(vatRate * 100)} %`}
          </div>
        </div>

        <div className="rounded-xl border border-[#c9a852]/30 bg-[#c9a852]/10 p-4">
          <div className="text-xs text-slate-300">Celkem k úhradě s DPH</div>
          <div className="mt-1 text-xl font-bold text-white">{formatCzk(totalGross)}</div>
          <div className="mt-1 text-[11px] text-slate-300">Původní + schválené vícepráce</div>
        </div>
      </div>

      <div className={`mt-5 rounded-xl border p-4 text-xs leading-6 ${verdict.tone}`}>
        <div className="font-bold uppercase tracking-wider">{verdict.badge}</div>
        <p className="mt-1.5">{verdict.summary}</p>
        <p className="mt-2 text-slate-300">
          <strong>Stavební deník a dokumentace:</strong> U staveb podléhajících stavebnímu zákonu č. 283/2021 Sb. (§ 166)
          a vyhlášce č. 131/2024 Sb. zapište změnu rozsahu do stavebního deníku, samotný zápis v deníku však bez
          výslovného ujednání ve smlouvě nenahrazuje písemný dodatek o ceně (§ 564 OZ).
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/smlouva-o-dilo" className="site-button-primary">
          Vytvořit smlouvu o dílo →
        </Link>
        <Link href="/balicek-zakazka" className="site-button-secondary">
          Zakázka Plus (smlouva + změnový list + předávací protokol)
        </Link>
      </div>
    </section>
  );
}
