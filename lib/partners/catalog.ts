import type {
  PartnerContext,
  PartnerLocale,
  PartnerOfferCategory,
  PublicPartnerOffer,
} from './types';

type OfferCopy = Pick<PublicPartnerOffer, 'title' | 'description' | 'cta' | 'disclosure'>;
type PartnerOfferDefinition = {
  id: string;
  partnerId: string;
  provider: string;
  category: PartnerOfferCategory;
  priority: number;
  manualQualityScore: number;
  destination: PublicPartnerOffer['destination'];
  supportedLocales: readonly PartnerLocale[];
  supportedCountries: readonly ['CZ'];
  allowedHosts: readonly string[];
  allowedQueryKeys: readonly string[];
  utmMedium?: 'partner_offer' | 'cross_sell';
  utmCampaign?: string;
  copy: Record<PartnerLocale, OfferCopy>;
  isEligible: (context: PartnerContext) => boolean;
  resolveConfig: () => { enabled: boolean; href?: string; isAffiliate: boolean };
};

type PartnerCandidate = {
  definition: PartnerOfferDefinition;
  href: string;
  isAffiliate: boolean;
};

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const;

function isEnabled(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}

function isEngineEnabled(): boolean {
  return isEnabled(process.env.PARTNER_ENGINE_ENABLED);
}

function configured(envPrefix: string) {
  return {
    enabled: isEnabled(process.env[`${envPrefix}_ENABLED`]),
    href: process.env[`${envPrefix}_URL`],
    isAffiliate: isEnabled(process.env[`${envPrefix}_IS_AFFILIATE`]),
  };
}

function hostAllowed(hostname: string, allowedHosts: readonly string[]): boolean {
  const normalized = hostname.toLowerCase().replace(/\.$/, '');
  return allowedHosts.some((host) => normalized === host || normalized.endsWith(`.${host}`));
}

function safePartnerUrl(value: string | undefined, definition: PartnerOfferDefinition): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed || /[\r\n]/.test(trimmed)) return undefined;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:' || url.username || url.password || url.hash) return undefined;
    if (!hostAllowed(url.hostname, definition.allowedHosts)) return undefined;
    const allowedQueryKeys = new Set([...definition.allowedQueryKeys, ...UTM_KEYS]);
    for (const key of url.searchParams.keys()) {
      if (!allowedQueryKeys.has(key)) return undefined;
    }
    url.searchParams.set('utm_source', 'smlouvahned');
    url.searchParams.set('utm_medium', definition.utmMedium ?? 'partner_offer');
    url.searchParams.set('utm_campaign', definition.utmCampaign ?? definition.id);
    return url.toString();
  } catch {
    return undefined;
  }
}

const CS_ONLY_FALLBACK: Record<PartnerLocale, OfferCopy> = {
  cs: { title: '', description: '', cta: '', disclosure: '' },
  en: { title: '', description: '', cta: '', disclosure: '' },
  ua: { title: '', description: '', cta: '', disclosure: '' },
};

const READINESS_ONLY_CANDIDATES = [
  { partnerId: 'klik', provider: 'Klik.cz', offerId: 'klik_insurance', category: 'insurance' },
  { partnerId: 'epojisteni', provider: 'ePojisteni.cz', offerId: 'epojisteni_insurance', category: 'insurance' },
  { partnerId: 'dokobit', provider: 'Dokobit', offerId: 'dokobit_esign', category: 'electronic_signature' },
  { partnerId: 'raynet', provider: 'Raynet', offerId: 'raynet_crm', category: 'business_tools' },
] as const;

const DEFINITIONS: readonly PartnerOfferDefinition[] = [
  {
    id: 'signi_esign', partnerId: 'signi', provider: 'Signi',
    category: 'electronic_signature', priority: 20, manualQualityScore: 80,
    destination: 'partner', supportedLocales: ['cs', 'en'], supportedCountries: ['CZ'],
    allowedHosts: ['signi.com'], allowedQueryKeys: [],
    isEligible: (c) => c.completed,
    resolveConfig: () => configured('PARTNER_SIGNI'),
    copy: {
      cs: { title: 'Podepsat dokument elektronicky', description: 'Hotové PDF můžete předat oběma stranám k elektronickému podpisu.', cta: 'Pokračovat na Signi', disclosure: 'Službu poskytuje Signi. Ověřte si, zda zvolený typ podpisu odpovídá požadavkům na váš dokument.' },
      en: { title: 'Sign the document electronically', description: 'Send the finished PDF to both parties for an electronic signature.', cta: 'Continue to Signi', disclosure: 'The service is provided by Signi. Check whether the signature type meets the requirements for your document.' },
      ua: CS_ONLY_FALLBACK.ua,
    },
  },
  {
    id: 'cebia_vehicle_history', partnerId: 'cebia', provider: 'Cebia',
    category: 'vehicle_history', priority: 20, manualQualityScore: 80,
    destination: 'partner', supportedLocales: ['cs'], supportedCountries: ['CZ'],
    allowedHosts: ['cebia.cz'], allowedQueryKeys: [],
    isEligible: (c) => c.completed && c.contractType === 'car_sale' && c.userRole === 'buyer',
    resolveConfig: () => configured('PARTNER_CEBIA'),
    copy: {
      cs: { title: 'Prověřit dostupnou historii vozidla', description: 'Kupující si může samostatně prověřit dostupnou historii podle VIN.', cta: 'Pokračovat na Cebia', disclosure: 'Rozsah prověření závisí na dostupných záznamech. VIN ani údaje ze smlouvy se automaticky nepřenášejí.' },
      en: CS_ONLY_FALLBACK.en, ua: CS_ONLY_FALLBACK.ua,
    },
  },
  {
    id: 'carvertical_vehicle_history', partnerId: 'carvertical', provider: 'carVertical',
    category: 'vehicle_history', priority: 30, manualQualityScore: 70,
    destination: 'partner', supportedLocales: ['cs', 'en'], supportedCountries: ['CZ'],
    allowedHosts: ['carvertical.com'], allowedQueryKeys: [],
    isEligible: (c) => c.completed && c.contractType === 'car_sale' && c.userRole === 'buyer',
    resolveConfig: () => configured('PARTNER_CARVERTICAL'),
    copy: {
      cs: { title: 'Prověřit dostupnou historii vozidla', description: 'Kupující si může samostatně prověřit dostupnou historii podle VIN.', cta: 'Pokračovat na carVertical', disclosure: 'Rozsah prověření závisí na dostupných záznamech. VIN ani údaje ze smlouvy se automaticky nepřenášejí.' },
      en: { title: 'Check the available vehicle history', description: 'A buyer can separately check the available history by VIN.', cta: 'Continue to carVertical', disclosure: 'Coverage depends on available records. The VIN and contract data are not transferred automatically.' },
      ua: CS_ONLY_FALLBACK.ua,
    },
  },
  {
    id: 'usetreno_tenant_insurance', partnerId: 'usetreno', provider: 'Ušetřeno.cz',
    category: 'insurance', priority: 20, manualQualityScore: 70,
    destination: 'partner', supportedLocales: ['cs'], supportedCountries: ['CZ'],
    allowedHosts: ['usetreno.cz'], allowedQueryKeys: [],
    isEligible: (c) => c.completed && c.contractType === 'lease' && c.userRole === 'tenant',
    resolveConfig: () => configured('PARTNER_USETRENO_TENANT_INSURANCE'),
    copy: {
      cs: { title: 'Porovnat pojištění domácnosti a odpovědnosti', description: 'Nájemce může po podpisu smlouvy samostatně porovnat vhodné pojištění.', cta: 'Porovnat možnosti', disclosure: 'Službu poskytuje Ušetřeno.cz. Obsah nájemní smlouvy ani osobní údaje se automaticky nepřenášejí.' },
      en: CS_ONLY_FALLBACK.en, ua: CS_ONLY_FALLBACK.ua,
    },
  },
  {
    id: 'usetreno_landlord_insurance', partnerId: 'usetreno', provider: 'Ušetřeno.cz',
    category: 'landlord_services', priority: 20, manualQualityScore: 70,
    destination: 'partner', supportedLocales: ['cs'], supportedCountries: ['CZ'],
    allowedHosts: ['usetreno.cz'], allowedQueryKeys: [],
    isEligible: (c) => c.completed && c.contractType === 'lease' && c.userRole === 'landlord',
    resolveConfig: () => configured('PARTNER_USETRENO_LANDLORD_INSURANCE'),
    copy: {
      cs: { title: 'Porovnat pojištění nemovitosti', description: 'Pronajímatel může samostatně porovnat pojištění nemovitosti určené k pronájmu.', cta: 'Porovnat možnosti', disclosure: 'Službu poskytuje Ušetřeno.cz. Obsah nájemní smlouvy ani osobní údaje se automaticky nepřenášejí.' },
      en: CS_ONLY_FALLBACK.en, ua: CS_ONLY_FALLBACK.ua,
    },
  },
  {
    id: 'planstavby_budget', partnerId: 'planstavby', provider: 'PlanStavby.cz',
    category: 'construction_planning', priority: 10, manualQualityScore: 90,
    destination: 'cross_sell', supportedLocales: ['cs'], supportedCountries: ['CZ'],
    allowedHosts: ['planstavby.cz'], allowedQueryKeys: [], utmMedium: 'cross_sell',
    utmCampaign: 'work_contract',
    isEligible: (c) => c.completed && c.contractType === 'work_contract'
      && c.userRole === 'customer'
      && ['construction_new_build', 'construction_reconstruction'].includes(c.transactionCategory),
    resolveConfig: () => ({ enabled: isEnabled(process.env.PARTNER_PLANSTAVBY_ENABLED), href: 'https://www.planstavby.cz/', isAffiliate: false }),
    copy: {
      cs: { title: 'Spočítat orientační rozpočet stavby', description: 'Plánujete stavbu nebo rekonstrukci? Navážete orientačním rozpočtem a plánem nákladů.', cta: 'Otevřít PlanStavby.cz', disclosure: 'Samostatná služba PlanStavby.cz. Údaje z vaší smlouvy se nepřenášejí.' },
      en: CS_ONLY_FALLBACK.en, ua: CS_ONLY_FALLBACK.ua,
    },
  },
  {
    id: 'idoklad_invoicing', partnerId: 'idoklad', provider: 'iDoklad',
    category: 'invoicing', priority: 20, manualQualityScore: 75,
    destination: 'partner', supportedLocales: ['cs'], supportedCountries: ['CZ'],
    allowedHosts: ['idoklad.cz'], allowedQueryKeys: [],
    isEligible: (c) => c.completed
      && ((c.contractType === 'work_contract' && c.userRole === 'contractor')
        || (c.contractType === 'cooperation' && ['supplier', 'freelancer', 'company'].includes(c.userRole))),
    resolveConfig: () => configured('PARTNER_IDOKLAD'),
    copy: {
      cs: { title: 'Navázat fakturací zakázky', description: 'Jako zhotovitel nebo OSVČ můžete na smlouvu navázat vystavením a správou faktur.', cta: 'Pokračovat na iDoklad', disclosure: 'Službu poskytuje iDoklad. Obsah smlouvy ani údaje druhé strany se automaticky nepřenášejí.' },
      en: CS_ONLY_FALLBACK.en, ua: CS_ONLY_FALLBACK.ua,
    },
  },
  {
    id: 'sloneek_hr', partnerId: 'sloneek', provider: 'Sloneek',
    category: 'hr_payroll', priority: 20, manualQualityScore: 70,
    destination: 'partner', supportedLocales: ['cs', 'en'], supportedCountries: ['CZ'],
    allowedHosts: ['sloneek.com'], allowedQueryKeys: [],
    isEligible: (c) => c.completed
      && ['employment', 'dpp'].includes(c.contractType) && c.userRole === 'employer',
    resolveConfig: () => configured('PARTNER_SLONEEK'),
    copy: {
      cs: { title: 'Navázat správou zaměstnanců', description: 'Zaměstnavatel může na hotový dokument navázat HR administrativou.', cta: 'Zjistit více o Sloneek', disclosure: 'Službu poskytuje Sloneek. Údaje zaměstnance ani obsah smlouvy se automaticky nepřenášejí.' },
      en: { title: 'Continue with employee administration', description: 'An employer can follow the document with HR administration.', cta: 'Learn more about Sloneek', disclosure: 'The service is provided by Sloneek. Employee data and contract content are not transferred automatically.' },
      ua: CS_ONLY_FALLBACK.ua,
    },
  },
];

export function getEligiblePartnerCandidates(context: PartnerContext): readonly PartnerCandidate[] {
  if (!isEngineEnabled() || !context.completed) return [];
  return DEFINITIONS.flatMap((definition): PartnerCandidate[] => {
    if (!definition.supportedLocales.includes(context.locale)
      || !definition.supportedCountries.includes(context.country)
      || !definition.isEligible(context)) return [];
    const config = definition.resolveConfig();
    if (!config.enabled) return [];
    const href = safePartnerUrl(config.href, definition);
    return href ? [{ definition, href, isAffiliate: config.isAffiliate }] : [];
  });
}

export function selectPartnerOffers(
  candidates: readonly PartnerCandidate[],
  locale: PartnerLocale,
): readonly PublicPartnerOffer[] {
  const selectedCategories = new Set<PartnerOfferCategory>();
  const sorted = [...candidates].sort((left, right) =>
    left.definition.priority - right.definition.priority
      || right.definition.manualQualityScore - left.definition.manualQualityScore,
  );
  const result: PublicPartnerOffer[] = [];
  for (const candidate of sorted) {
    const definition = candidate.definition;
    if (selectedCategories.has(definition.category)) continue;
    selectedCategories.add(definition.category);
    const copy = definition.copy[locale];
    result.push({
      id: definition.id,
      partnerId: definition.partnerId,
      provider: definition.provider,
      category: definition.category,
      ...copy,
      href: candidate.href,
      isAffiliate: candidate.isAffiliate,
      destination: definition.destination,
    });
    if (result.length === 3) break;
  }
  return result;
}

export function getEligiblePartnerOffers(context: PartnerContext): readonly PublicPartnerOffer[] {
  return selectPartnerOffers(getEligiblePartnerCandidates(context), context.locale);
}

export function getPartnerReadinessCatalog() {
  const implemented = DEFINITIONS.map((definition) => {
    const config = definition.resolveConfig();
    return {
      partnerId: definition.partnerId,
      provider: definition.provider,
      offerId: definition.id,
      category: definition.category,
      technicalReady: true,
      configured: Boolean(config.enabled && safePartnerUrl(config.href, definition)),
    };
  });
  return [
    ...implemented,
    ...READINESS_ONLY_CANDIDATES.map((candidate) => ({
      ...candidate,
      technicalReady: false,
      configured: false,
    })),
  ];
}
