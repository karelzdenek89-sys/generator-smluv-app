import type { ReactNode } from 'react';

type DisclaimerLocale = 'cs' | 'en' | 'ua';

type DisclaimerCopy = {
  aria: string;
  label: string;
  paragraphs: ReactNode[];
};

const DISCLAIMER_COPY: Record<DisclaimerLocale, DisclaimerCopy> = {
  cs: {
    aria: 'Právní upozornění',
    label: 'Informativní obsah',
    paragraphs: [
      <>
        Tento článek má výhradně <strong className="text-slate-300">informativní charakter</strong>{' '}
        a vychází z platného znění českých právních předpisů k uvedenému datu. SmlouvaHned je
        softwarový nástroj pro tvorbu standardizovaných dokumentů —{' '}
        <strong className="text-slate-300">není advokátní kanceláří</strong> a neposkytuje právní
        poradenství ve smyslu zákona č. 85/1996 Sb., o advokacii.
      </>,
      <>
        Pro konkrétní právní situaci, nestandardní případy, transakce vyšší hodnoty nebo
        probíhající spory doporučujeme konzultaci s advokátem — seznam advokátů České advokátní
        komory na{' '}
        <a
          href="https://www.cak.cz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 underline underline-offset-2 transition hover:text-amber-300"
        >
          cak.cz
        </a>
        .
      </>,
    ],
  },
  en: {
    aria: 'Legal notice',
    label: 'Informational content',
    paragraphs: [
      <>
        This article is for <strong className="text-slate-300">general information only</strong>{' '}
        and reflects typical Czech practice at the date shown. SmlouvaHned is a software tool for
        standardized documents — <strong className="text-slate-300">not a law firm</strong> and does
        not provide legal services within the meaning of Czech Act No. 85/1996 Coll., on the legal
        profession, or immigration advice.
      </>,
      <>
        For a specific situation, non-standard cases, high-value transactions or disputes, consult
        a Czech attorney (advokát). Directory:{' '}
        <a
          href="https://www.cak.cz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 underline underline-offset-2 transition hover:text-amber-300"
        >
          cak.cz
        </a>
        .
      </>,
      <>
        Generated contracts are primarily in Czech. Any explanatory translation is not certified
        or official. In case of discrepancy, the Czech wording prevails.
      </>,
    ],
  },
  ua: {
    aria: 'Юридичне застереження',
    label: 'Інформаційний матеріал',
    paragraphs: [
      <>
        Ця стаття має лише <strong className="text-slate-300">загальний інформаційний характер</strong>{' '}
        і описує типову чеську практику на зазначену дату. SmlouvaHned — програмний інструмент для
        стандартизованих документів, <strong className="text-slate-300">не юридична фірма</strong> і
        не надає юридичних послуг у розумінні закону ЧР № 85/1996 Зб. про адвокатуру, ані
        імміграційних консультацій.
      </>,
      <>
        Для конкретної ситуації, нестандартних випадків, дорогих угод або спорів зверніться до
        чеського адвоката (advokát). Реєстр:{' '}
        <a
          href="https://www.cak.cz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 underline underline-offset-2 transition hover:text-amber-300"
        >
          cak.cz
        </a>
        .
      </>,
      <>
        Договір створюється переважно чеською. Пояснювальний переклад не є засвідченим чи
        офіційним. У разі розбіжностей перевагу має чеське формулювання.
      </>,
    ],
  },
};

export default function InformativeDisclaimer({
  className = '',
  locale = 'cs',
}: {
  className?: string;
  locale?: DisclaimerLocale;
}) {
  const copy = DISCLAIMER_COPY[locale];

  return (
    <aside
      className={`rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-xs leading-relaxed text-slate-400 ${className}`}
      role="note"
      aria-label={copy.aria}
    >
      <div className="mb-2 text-[11px] font-black uppercase tracking-widest text-amber-400">
        {copy.label}
      </div>
      {copy.paragraphs.map((paragraph, index) => (
        <p key={index} className={index === 0 ? undefined : 'mt-2'}>
          {paragraph}
        </p>
      ))}
    </aside>
  );
}
