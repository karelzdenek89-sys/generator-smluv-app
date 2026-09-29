import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * On Czech pages a foreign visitor cannot read what a section offers them.
 * This strip repeats the gist in English and Ukrainian and sends them to the
 * page in their language.
 */
const ITEMS = [
  {
    lang: 'en',
    flag: '🇬🇧',
    question: 'Don’t read Czech?',
    text: 'Fill in the form in English and get the Czech contract plus a complete English translation of every article, included in the price.',
    cta: 'Continue in English',
    href: '/en#translation',
  },
  {
    lang: 'uk',
    flag: '🇺🇦',
    question: 'Не читаєте чеською?',
    text: 'Заповніть форму українською й отримайте чеський договір і повний український переклад кожної статті, включено в ціну.',
    cta: 'Продовжити українською',
    href: '/ua#translation',
  },
] as const;

export default function ForeignReaderStrip({ className = '' }: { className?: string }) {
  return (
    <div className={`grid gap-3 md:grid-cols-2 ${className}`}>
      {ITEMS.map((item) => (
        <div
          key={item.lang}
          lang={item.lang}
          className="flex flex-col gap-3 rounded-2xl border border-sky-300/20 bg-sky-300/[0.05] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm leading-6 text-slate-300">
            <span aria-hidden="true" className="mr-1.5">{item.flag}</span>
            <strong className="font-semibold text-white">{item.question}</strong> {item.text}
          </p>
          <Link
            href={item.href}
            hrefLang={item.lang}
            className="inline-flex shrink-0 items-center gap-1.5 self-start min-h-10 rounded-xl border border-sky-300/35 bg-sky-300/10 px-4 py-2 text-xs font-bold text-sky-100 transition hover:border-sky-200/70 hover:bg-sky-300/20 sm:self-center"
          >
            {item.cta} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      ))}
    </div>
  );
}
