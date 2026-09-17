/**
 * Monetizační a produktové feature flagy.
 *
 * Flagy jsou `NEXT_PUBLIC_*`, protože rozhodují o tom, co se vykreslí v UI —
 * do public env patří pouze tyto neškodné přepínače, nikdy žádný secret.
 * Ceny, Stripe Price ID ani affiliate URL sem nepatří; ty zůstávají serverové.
 *
 * Každý flag se čte celým literálem `process.env.NEXT_PUBLIC_…` uvnitř
 * `switch`e. Next.js literál staticky nahradí při buildu (takže flag funguje
 * i v klientském bundlu) a na serveru se hodnota čte při každém volání, takže
 * ji testy mohou nastavit před spuštěním kontroly. Dynamický klíč
 * (`process.env[name]`) by v klientském bundlu nefungoval.
 *
 * Výchozí hodnota je `false` u produktů, které bez dodatečné konfigurace
 * (Stripe Price ID, partner URL, recurring backend) nemohou fungovat.
 * Produkt, jehož Stripe Price ID není nastavené, by při zapnutém UI skončil
 * chybou při vytváření platby, takže zapnutí je vědomý krok v konfiguraci.
 *
 * Výjimkou je `caseEngine`: vrstva „Moje zakázka“ žádnou další konfiguraci
 * nepotřebuje (Redis i Resend už produkce používá), proto je zapnutá a flag
 * slouží jen jako kill switch (`NEXT_PUBLIC_FEATURE_CASE_ENGINE=false`).
 */

export type FeatureFlagKey =
  | 'zakazkaPlus'
  | 'carSaleComplete'
  | 'landlordAnnual'
  | 'caseEngine'
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
    // Balíček Zakázka Plus u smlouvy o dílo. Vyžaduje STRIPE_PRICE_ID_WORK_ORDER.
    case 'zakazkaPlus':
      return isOn(process.env.NEXT_PUBLIC_FEATURE_ZAKAZKA_PLUS);
    // Rozšířený obsah balíčku pro prodej vozidla (plná moc k přepisu + checklist).
    case 'carSaleComplete':
      return isOn(process.env.NEXT_PUBLIC_FEATURE_CAR_SALE_COMPLETE);
    // Roční plán pro pronajímatele. Bez recurring backendu musí zůstat vypnutý.
    case 'landlordAnnual':
      return isOn(process.env.NEXT_PUBLIC_FEATURE_LANDLORD_ANNUAL);
    // Case Engine („Moje zakázka“): pokračování zakázky, termíny, připomínky.
    // Zapnuto, dokud není výslovně vypnuto — kill switch pro produkci.
    case 'caseEngine':
      return !isExplicitlyOff(process.env.NEXT_PUBLIC_FEATURE_CASE_ENGINE);
    // Recurring plány (řemeslník / zaměstnavatel / pronajímatel). Bez Stripe
    // subscription backendu smí být viditelný jen měřený zájem, ne prodej.
    case 'subscriptions':
      return isOn(process.env.NEXT_PUBLIC_FEATURE_SUBSCRIPTIONS);
    // Sběr commercial intentu pro partnerskou službu. Zapnutí bez schváleného
    // partnera s vlastním consent textem nedává smysl; engine je fail-closed.
    case 'commercialIntents':
      return isOn(process.env.NEXT_PUBLIC_FEATURE_COMMERCIAL_INTENTS);
    default:
      return false;
  }
}
