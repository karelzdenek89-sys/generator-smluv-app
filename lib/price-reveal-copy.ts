import { normalizeLocale } from '@/lib/locale';

// Release marker for before/after funnel comparisons, not an A/B assignment.
export const PRICE_REVEAL_VARIANT = 'price_reveal_v1';

const COPY = {
  cs: {
    short: 'Cena v dalším kroku',
    notice: 'Stažení dokumentu je placené. Vyplňte údaje a pokračujte k souhrnu: před platbou uvidíte přesnou cenu a vyberete variantu. Bez předplatného.',
    draft: 'Rozpracované údaje se v této kartě dočasně ukládají pro návrat z platby (30 minut od poslední změny). Na sdíleném zařízení po dokončení kartu zavřete.',
  },
  en: {
    short: 'Price in the next step',
    notice: 'Document download is paid. Complete the form to review the exact price and choose a version before paying. No subscription.',
    draft: 'Your draft is temporarily saved in this tab for returning from payment (30 minutes after the last change). Close this tab when finished on a shared device.',
  },
  ua: {
    short: 'Ціна на наступному кроці',
    notice: 'Завантаження документа платне. Заповніть форму: перед оплатою ви побачите точну ціну та виберете версію. Без підписки.',
    draft: 'Чернетка тимчасово зберігається в цій вкладці для повернення з оплати (30 хвилин після останньої зміни). На спільному пристрої закрийте вкладку після завершення.',
  },
};

export function getPriceRevealCopy(locale?: string | null) {
  return COPY[normalizeLocale(locale)];
}
