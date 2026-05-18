import type { AppLocale } from '@/lib/locale';

/** Intro page for Complete-tier Czech annexes when the user chose EN/UK guidance. */
export function getCompleteAnnexExpatIntro(locale: AppLocale): string[] | null {
  if (locale === 'en') {
    return [
      'GUIDE TO THE CZECH APPENDIX PAGES',
      '',
      'The following pages (signing guide and checklist) are in Czech because they are designed for use in the Czech Republic.',
      'Use this rental agreement together with the explanatory English translation annex earlier in the PDF.',
      'Before signing, we recommend:',
      '• Read the English translation annex and compare it with the Czech lease.',
      '• Fill in the Czech handover protocol on the day of move-in with meter readings and photos.',
      '• Keep one signed copy for each party and proof of payment.',
      '• Do not treat this software as legal or immigration advice.',
    ];
  }
  if (locale === 'ua') {
    return [
      'ПОЯСНЕННЯ ДО ЧЕСЬКИХ ДОДАТКІВ',
      '',
      'Наступні сторінки (інструкції для підпису та чекліст) чеською — для використання в Чехії.',
      'Користуйтеся разом із пояснювальним українським додатком на початку PDF.',
      'Перед підписом рекомендуємо:',
      '• Прочитати український додаток і звірити з чеським договором.',
      '• Заповнити чеський протокол передачі в день заселення з лічильниками та фото.',
      '• Зберегти по примірнику для кожної сторони та підтвердження оплати.',
      '• Не вважати цей інструмент юридичною чи імміграційною консультацією.',
    ];
  }
  return null;
}
