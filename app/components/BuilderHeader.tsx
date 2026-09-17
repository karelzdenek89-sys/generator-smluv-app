'use client';

import Link from 'next/link';
import type { AppLocale } from '@/lib/locale';

/**
 * Jediná hlavička formulářů napříč všemi 14 buildery.
 *
 * Do 17. 9. 2026 měl každý builder vlastní <header> — pět různých variant,
 * tři různá pozadí a v české verzi druhé sticky logo pod globálním
 * SiteHeaderem (obě `top: 0`, takže se po odscrollování překrývaly).
 *
 * Pravidlo: značku nese vždy právě jedna hlavička.
 *  - čeština → SiteHeader je na stránce, tady stačí tenký kontextový pruh
 *    bez loga a bez `sticky`;
 *  - en/ua → SiteHeader je skrytý (globals.css, `[data-localized-builder-shell]`),
 *    takže hlavička builderu značku a cestu zpět nese sama.
 */

const COPY: Record<AppLocale, { back: string }> = {
  cs: { back: 'Zpět na dokumenty' },
  en: { back: 'Back to documents' },
  ua: { back: 'Назад до документів' },
};

export type BuilderHeaderProps = {
  /** Název dokumentu, ideálně i s odkazem na paragraf. */
  docType: string;
  /** Locale builderu; české buildery ho nemusí předávat. */
  locale?: AppLocale;
  /** Doplňková informace vpravo (cena, stav). */
  badge?: string;
  /** Drobná poznámka uprostřed, skrytá na mobilu. */
  note?: string;
  /** Lokalizovaný název značky pro en/ua variantu. */
  brand?: string;
};

export default function BuilderHeader({
  docType,
  locale = 'cs',
  badge,
  note,
  brand,
}: BuilderHeaderProps) {
  const copy = COPY[locale] ?? COPY.cs;
  const isForeign = locale === 'en' || locale === 'ua';
  const backHref = isForeign ? (locale === 'ua' ? '/ua' : '/en') : '/#smlouvy';

  if (isForeign) {
    return (
      <header className="contract-builder-header" data-builder-header="branded">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
          <Link href={backHref} className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[#c9a852]/40 bg-[#07111e] text-xs font-black text-[#c9a852]">
              SH
            </span>
            <span className="min-w-0">
              <span className="block font-serif text-sm font-semibold tracking-tight text-white">
                {brand ?? 'SmlouvaHned'}
              </span>
              <span className="block truncate text-[11px] uppercase tracking-[0.18em] text-slate-400">
                {docType}
              </span>
            </span>
          </Link>

          <div className="flex flex-shrink-0 items-center gap-3">
            {badge ? (
              <span className="hidden rounded-full border border-[#c9a852]/25 px-3 py-1 text-xs font-semibold text-[#c9a852] sm:inline-flex">
                {badge}
              </span>
            ) : null}
            <Link href={backHref} className="text-sm text-slate-300 transition-colors hover:text-white">
              {copy.back}
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <div className="builder-context-bar" data-builder-header="context">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c9a852]">
            {docType}
          </span>
          {note ? <span className="hidden text-[11px] text-slate-400 md:inline">{note}</span> : null}
        </div>
        <div className="flex flex-shrink-0 items-center gap-4">
          {badge ? <span className="text-[11px] font-semibold text-[#c9a852]">{badge}</span> : null}
          <Link href={backHref} className="text-[11px] text-slate-400 transition-colors hover:text-white">
            {copy.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
