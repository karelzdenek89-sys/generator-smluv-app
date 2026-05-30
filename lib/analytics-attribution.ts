export type TrafficAttribution = {
  source: string;
  label: string;
  article_slug?: string;
  pathname?: string;
  captured_at: string;
};

const STORAGE_KEY = 'sh_traffic_attribution';
const MAX_AGE_MS = 30 * 60 * 1000;

export function rememberTrafficAttribution(
  attribution: Omit<TrafficAttribution, 'captured_at'>,
) {
  if (typeof window === 'undefined') return;

  try {
    const payload: TrafficAttribution = {
      ...attribution,
      captured_at: new Date().toISOString(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage může být nedostupné
  }
}

export function readTrafficAttribution(): TrafficAttribution | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as TrafficAttribution;
    if (!parsed?.captured_at || !parsed.source || !parsed.label) return null;

    const age = Date.now() - Date.parse(parsed.captured_at);
    if (!Number.isFinite(age) || age > MAX_AGE_MS) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function trafficAttributionParams(): Pick<
  TrafficAttribution,
  'source' | 'label' | 'article_slug' | 'pathname'
> | null {
  const attribution = readTrafficAttribution();
  if (!attribution) return null;

  return {
    source: attribution.source,
    label: attribution.label,
    article_slug: attribution.article_slug,
    pathname: attribution.pathname,
  };
}
