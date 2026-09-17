/**
 * Monetizační a produktové feature flagy.
 *
 * `NEXT_PUBLIC_*` hodnoty ovládají pouze UI/produktové přepínače; secrets,
 * ceny a partner delivery konfigurace sem nepatří.
 */

export type FeatureFlagKey =
  | 'zakazkaPlus'
  | 'carSaleComplete'
  | 'landlordAnnual'
  | 'caseEngine'
  | 'caseRental'
  | 'caseVehicle'
  | 'caseHub'
  | 'legislationWatch'
  | 'subscriptions'
  | 'commercialIntents';

function isOn(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}

function isExplicitlyOff(value: string | undefined): boolean {
  return value === 'false' || value === '0';
}

export function isFeatureEnabled(key: FeatureFlagKey): boolean {
  switch (key) {
    case 'zakazkaPlus':
      return isOn(process.env.NEXT_PUBLIC_FEATURE_ZAKAZKA_PLUS);
    case 'carSaleComplete':
      return isOn(process.env.NEXT_PUBLIC_FEATURE_CAR_SALE_COMPLETE);
    case 'landlordAnnual':
      return isOn(process.env.NEXT_PUBLIC_FEATURE_LANDLORD_ANNUAL);
    // Společné jádro Case Engine — kill switch. Redis i transakční e-mail už produkce používá.
    case 'caseEngine':
      return !isExplicitlyOff(process.env.NEXT_PUBLIC_FEATURE_CASE_ENGINE);
    // Rental/vehicle/hub jsou bezpečnostně stejné jako work_order a nevyžadují
    // nový externí systém; samostatné kill switche umožní rychlý rollback UI.
    case 'caseRental':
      return !isExplicitlyOff(process.env.NEXT_PUBLIC_FEATURE_CASE_RENTAL);
    case 'caseVehicle':
      return !isExplicitlyOff(process.env.NEXT_PUBLIC_FEATURE_CASE_VEHICLE);
    case 'caseHub':
      return !isExplicitlyOff(process.env.NEXT_PUBLIC_FEATURE_CASE_HUB);
    // Funkční legislativní watch je oddělený od newsletteru a používá stejné
    // transakční doručování. Výslovné false/0 jej okamžitě vypne.
    case 'legislationWatch':
      return !isExplicitlyOff(process.env.NEXT_PUBLIC_FEATURE_LEGISLATION_WATCH);
    case 'subscriptions':
      return isOn(process.env.NEXT_PUBLIC_FEATURE_SUBSCRIPTIONS);
    case 'commercialIntents':
      return isOn(process.env.NEXT_PUBLIC_FEATURE_COMMERCIAL_INTENTS);
    default:
      return false;
  }
}
