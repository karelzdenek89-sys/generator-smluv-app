import type { ContractType } from '@/lib/contracts';
import type { AppLocale } from '@/lib/locale';

/** Intro page for Complete-tier Czech annexes when the user chose EN/UA guidance. */
export function getCompleteAnnexExpatIntro(
  locale: AppLocale,
  contractType: ContractType,
  hasClausePairedContract = false,
): string[] | null {
  const hasHandover = contractType === 'lease' || contractType === 'sublease' || contractType === 'car_sale';
  if (locale === 'en') {
    return [
      'GUIDE TO THE CZECH APPENDIX PAGES',
      '',
      'The following pages (signing guide and checklist) are in Czech because they are designed for use in the Czech Republic.',
      hasClausePairedContract
        ? 'The contract itself pairs each Czech clause with its English wording.'
        : 'Use the Czech contract together with the explanatory English translation annex earlier in the PDF.',
      'Before signing, we recommend:',
      hasClausePairedContract
        ? '• Read each paired clause and verify that names, dates, amounts and agreed terms match.'
        : '• Read the English translation annex and compare it with the Czech contract.',
      ...(hasHandover ? ['• Complete any Czech handover protocol carefully and attach relevant readings, photos or item details.'] : []),
      '• Keep one signed copy for each party and proof of payment.',
      '• Do not treat this software as legal or immigration advice.',
    ];
  }
  if (locale === 'ua') {
    return [
      'ПОЯСНЕННЯ ДО ЧЕСЬКИХ ДОДАТКІВ',
      '',
      'Наступні сторінки (інструкції для підпису та чекліст) чеською — для використання в Чехії.',
      hasClausePairedContract
        ? 'У самому договорі після кожного чеського положення наведено український текст.'
        : 'Користуйтеся разом із пояснювальним українським додатком в PDF.',
      'Перед підписом рекомендуємо:',
      hasClausePairedContract
        ? '• Прочитати кожну пару положень і перевірити імена, дати, суми та погоджені умови.'
        : '• Прочитати український додаток і звірити з чеським договором.',
      ...(hasHandover ? ['• Уважно заповнити чеський протокол передачі та додати показники, фото або опис предмета.'] : []),
      '• Зберегти по примірнику для кожної сторони та підтвердження оплати.',
      '• Не вважати цей інструмент юридичною чи імміграційною консультацією.',
    ];
  }
  return null;
}
