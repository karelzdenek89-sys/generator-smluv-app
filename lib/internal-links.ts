export type ClusterKey =
  | 'bydleni'
  | 'auto'
  | 'prace'
  | 'finance'
  | 'b2b'
  | 'zastoupeni'
  | 'darovani';

export type InternalLink = {
  href: string;
  label: string;
  description?: string;
  cluster: ClusterKey;
};

export const SEO_LANDINGS: readonly InternalLink[] = [
  { href: '/najemni-smlouva', label: 'Nájemní smlouva 2026', description: 'Vzor a generátor nájemní smlouvy podle OZ — kauce, výpověď, předání bytu.', cluster: 'bydleni' },
  { href: '/najemni-smlouva-byt', label: 'Nájemní smlouva na byt', description: 'Specializovaný vzor pro nájem bytové jednotky.', cluster: 'bydleni' },
  { href: '/podnajemni-smlouva', label: 'Podnájemní smlouva', description: 'Vzor podnájmu se souhlasem pronajímatele.', cluster: 'bydleni' },
  { href: '/pro-pronajimatele', label: 'Dokumenty pro pronajímatele', description: 'Rozcestník: smlouva, předávací protokol, kauce.', cluster: 'bydleni' },
  { href: '/balicek-pronajimatel', label: 'Balíček pro pronajímatele', description: 'Smlouva + předávací protokol + potvrzení o kauci.', cluster: 'bydleni' },

  { href: '/kupni-smlouva', label: 'Kupní smlouva 2026', description: 'Obecná kupní smlouva pro movité věci.', cluster: 'auto' },
  { href: '/prodej-vozidla', label: 'Kupní smlouva na auto', description: 'Vzor pro převod vozidla — VIN, tachometr, doklady.', cluster: 'auto' },
  { href: '/balicek-prodej-vozidla', label: 'Balíček pro prodej vozidla', description: 'Smlouva + předávací protokol + podklady k převodu.', cluster: 'auto' },

  { href: '/pracovni-smlouva', label: 'Pracovní smlouva 2026', description: 'Vzor pracovní smlouvy podle zákoníku práce.', cluster: 'prace' },
  { href: '/dohoda-o-provedeni-prace', label: 'Dohoda o provedení práce (DPP)', description: 'Vzor DPP do 300 hodin ročně.', cluster: 'prace' },
  { href: '/smlouva-o-dilo-online', label: 'Smlouva o dílo online', description: 'Vzor pro řemeslníky, freelancery i firmy.', cluster: 'prace' },
  { href: '/smlouva-o-sluzbach', label: 'Smlouva o poskytování služeb', description: 'Vzor pro opakované služby a B2B kontrakty.', cluster: 'prace' },
  { href: '/smlouva-o-spolupraci', label: 'Smlouva o spolupráci', description: 'Vzor B2B spolupráce mezi podnikateli.', cluster: 'b2b' },

  { href: '/pujcka-smlouva', label: 'Smlouva o zápůjčce', description: 'Vzor půjčky peněz mezi soukromými osobami.', cluster: 'finance' },
  { href: '/uznani-dluhu-vzor', label: 'Uznání dluhu', description: 'Vzor uznání dluhu a splátkového kalendáře.', cluster: 'finance' },

  { href: '/nda-smlouva', label: 'NDA — smlouva o mlčenlivosti', description: 'Vzor NDA pro ochranu důvěrných informací.', cluster: 'b2b' },
  { href: '/plna-moc-online', label: 'Plná moc online', description: 'Vzor plné moci pro zastupování ve standardních situacích.', cluster: 'zastoupeni' },
  { href: '/darovaci-smlouva', label: 'Darovací smlouva', description: 'Vzor darování movité věci nebo peněz.', cluster: 'darovani' },
];

export const CLUSTER_LABELS: Record<ClusterKey, string> = {
  bydleni: 'Bydlení a pronájem',
  auto: 'Auto a movité věci',
  prace: 'Práce a služby',
  finance: 'Půjčky a dluhy',
  b2b: 'B2B a důvěrnost',
  zastoupeni: 'Zastoupení',
  darovani: 'Darování',
};

export function getRelatedLinks(
  currentHref: string,
  cluster: ClusterKey,
  limit = 4,
): InternalLink[] {
  const same = SEO_LANDINGS.filter(
    (l) => l.cluster === cluster && l.href !== currentHref,
  );
  if (same.length >= limit) return same.slice(0, limit);
  const others = SEO_LANDINGS.filter(
    (l) => l.cluster !== cluster && l.href !== currentHref,
  );
  return [...same, ...others].slice(0, limit);
}

export const FOOTER_GROUPS: { label: string; cluster: ClusterKey }[] = [
  { label: CLUSTER_LABELS.bydleni, cluster: 'bydleni' },
  { label: CLUSTER_LABELS.auto, cluster: 'auto' },
  { label: CLUSTER_LABELS.prace, cluster: 'prace' },
  { label: 'Finance, B2B a další', cluster: 'finance' },
];
