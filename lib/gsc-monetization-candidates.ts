export type GscCandidateClassification =
  | 'free_experiment_candidate'
  | 'paid_candidate'
  | 'low_data'
  /** Stránka, na kterou cena dokumentu nemůže působit (typicky blogový článek). */
  | 'out_of_scope';

export type GscPageSnapshot = {
  page: string;
  impressions: number;
  clicks: number;
  ctrPercent: number;
  averagePosition: number;
  source: string;
  observedAt: string | null;
  /**
   * Počet dní, za které snapshot platí. Bez něj nejde porovnat dvě měření:
   * 2 497 impresí za půl roku a za měsíc jsou dvě zcela jiné situace.
   */
  observedDays?: number;
  /**
   * Zdarma může ovlivnit jen stránku, která něco prodává. U blogového článku
   * rozhoduje o CTR titulek a záměr dotazu, ne cena dokumentu — nulová cena
   * nemůže zlepšit, jak často lidé kliknou na článek ve výsledcích hledání.
   */
  pageKind?: 'product' | 'blog';
  /** Varianta URL, ze které měření pochází. Viz poznámka u GSC_PAGE_SNAPSHOTS. */
  urlVariant?: 'www' | 'non-www';
};

/**
 * Page-level GSC evidence. Deliberately a snapshot, not a live Search Console
 * integration.
 *
 * Pozor na dvě pasti, na které narazilo vyhodnocení experimentu
 * gsc_dpp_free_2026_08:
 *
 * 1. Do 08/2026 se týž článek indexoval zvlášť na www a non-www. V exportu
 *    má proto dva řádky a vzít jen jeden z nich měření zkreslí. Redirect na
 *    www je v `vercel.json`, takže novější data už jsou konsolidovaná.
 * 2. Celoživotní součet vypadá jinak než aktuální výkon. Vždy k němu patří
 *    `observedDays`, jinak nelze poznat, že stránka mezitím spadla.
 */
export const GSC_PAGE_SNAPSHOTS: readonly GscPageSnapshot[] = [
  {
    page: '/blog/dpp-dohoda-provedeni-prace',
    impressions: 2497,
    clicks: 5,
    ctrPercent: 0.2,
    averagePosition: 9.7,
    source: 'user-provided GSC snapshot (non-www řádek, celé období)',
    observedAt: '2026-09-11',
    observedDays: 169,
    pageKind: 'blog',
    urlVariant: 'non-www',
  },
  {
    // Tatáž stránka v posledních 32 dnech. Rychlost impresí spadla z 22,5/den
    // na 1,8/den poté, co Google přestal indexovat non-www variantu.
    page: '/blog/dpp-dohoda-provedeni-prace',
    impressions: 58,
    clicks: 0,
    ctrPercent: 0,
    averagePosition: 24.66,
    source: 'GSC export 2026-08-11 až 2026-09-11',
    observedAt: '2026-09-11',
    observedDays: 32,
    pageKind: 'blog',
    urlVariant: 'www',
  },
];

/**
 * Kandidát na bezplatný režim musí splnit všechno najednou:
 * prodávat, mít dost dat, být na dosah první stránky a mít slabé CTR i kliky.
 */
export function classifyGscSnapshot(snapshot: GscPageSnapshot): GscCandidateClassification {
  // Cena dokumentu neovlivní CTR článku ve výsledcích hledání. Experiment
  // postavený na blogovém signálu měří něco jiného, než na co pak působí.
  if (snapshot.pageKind === 'blog') return 'out_of_scope';
  if (snapshot.impressions < 300) return 'low_data';
  const firstPageOpportunity = snapshot.averagePosition > 0 && snapshot.averagePosition <= 15;
  const weakCtr = snapshot.ctrPercent < 1;
  const weakClicks = snapshot.clicks <= Math.max(10, Math.ceil(snapshot.impressions * 0.01));
  return firstPageOpportunity && weakCtr && weakClicks
    ? 'free_experiment_candidate'
    : 'paid_candidate';
}

/**
 * Kolik prokliků za měsíc stránka dává. Experiment, který jich má řádově
 * jednotky, nemůže rozdíl v konverzi změřit ani za rok — proto se nespouští.
 */
export function monthlyClickRate(snapshot: GscPageSnapshot): number | null {
  if (!snapshot.observedDays || snapshot.observedDays <= 0) return null;
  return (snapshot.clicks / snapshot.observedDays) * 30;
}

/** Minimum prokliků za měsíc, pod kterým je experiment nevyhodnotitelný. */
export const MIN_MONTHLY_CLICKS_FOR_EXPERIMENT = 100;

export function hasEnoughTrafficForExperiment(snapshot: GscPageSnapshot): boolean {
  const rate = monthlyClickRate(snapshot);
  return rate !== null && rate >= MIN_MONTHLY_CLICKS_FOR_EXPERIMENT;
}
