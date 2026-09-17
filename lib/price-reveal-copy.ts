import { normalizeLocale } from '@/lib/locale';

// Release marker for before/after funnel comparisons, not an A/B assignment.
export const PRICE_REVEAL_VARIANT = 'price_reveal_v1';

/**
 * Jediná věta o ceně pro celý web (homepage, katalog, buildery, blog CTA).
 * Změna ceníku = změna tady + v lib/pricing.ts, nikde jinde.
 */
export const PRICE_TRANSPARENCY_LINE =
  'Standard od 99 Kč · Rozšířená varianta od 199 Kč. Konkrétní doporučení podle zadané situace uvidíte před objednávkou.';

const COPY = {
  cs: {
    short: 'Cena v dalším kroku',
    notice: `Stažení dokumentu je placené. ${PRICE_TRANSPARENCY_LINE} Tematické balíčky 299–599 Kč. Bez předplatného.`,
    draft: 'Rozpracované údaje se v této kartě dočasně ukládají pro návrat z platby (30 minut od poslední změny). Na sdíleném zařízení po dokončení kartu zavřete.',
  },
  en: {
    short: 'Price in the next step',
    notice: 'Document download is paid. Standard from 99 CZK · Extended version from 199 CZK. You will see the specific recommendation for your situation before ordering. Thematic packages 299–599 CZK. No subscription.',
    draft: 'Your draft is temporarily saved in this tab for returning from payment (30 minutes after the last change). Close this tab when finished on a shared device.',
  },
  ua: {
    short: 'Ціна на наступному кроці',
    notice: 'Завантаження документа платне. Стандарт від 99 CZK · Розширена версія від 199 CZK. Конкретну рекомендацію для вашої ситуації ви побачите перед замовленням. Тематичні пакети 299–599 CZK. Без підписки.',
    draft: 'Чернетка тимчасово зберігається в цій вкладці для повернення з оплати (30 хвилин після останньої зміни). На спільному пристрої закрийте вкладку після завершення.',
  },
};

export function getPriceRevealCopy(locale?: string | null) {
  return COPY[normalizeLocale(locale)];
}
