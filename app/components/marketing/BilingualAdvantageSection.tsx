import Link from 'next/link';
import { Check, Minus } from 'lucide-react';
import BilingualShowcase from '@/app/components/marketing/BilingualShowcase';
import ForeignReaderStrip from '@/app/components/marketing/ForeignReaderStrip';
import { getBilingualShowcaseSamples } from '@/lib/marketing/bilingual-showcase';
import { CHECKOUT_ADDON_CONFIG } from '@/lib/checkout-addons';
import { EXPAT_CONTRACT_ROUTES, withLocale } from '@/lib/locale';
import { TRANSLATED_CONTRACTS } from '@/lib/translation-offer';
import type { ContractType } from '@/lib/contracts';

type SectionLocale = 'cs' | 'en' | 'ua';

const ANNEX_PRICE = `${CHECKOUT_ADDON_CONFIG.bilingual_annex.priceCzk} Kč`;

const CONTRACT_NAMES: Record<SectionLocale, Partial<Record<ContractType, string>>> = {
  cs: { lease: 'Nájemní smlouva', sublease: 'Podnájem', employment: 'Pracovní smlouva', dpp: 'DPP', power_of_attorney: 'Plná moc', car_sale: 'Prodej auta' },
  en: { lease: 'Lease', sublease: 'Sublease', employment: 'Employment contract', dpp: 'DPP work agreement', power_of_attorney: 'Power of attorney', car_sale: 'Car sale' },
  ua: { lease: 'Оренда', sublease: 'Піднайм', employment: 'Трудовий договір', dpp: 'DPP', power_of_attorney: 'Довіреність', car_sale: 'Продаж авто' },
};

const COPY: Record<SectionLocale, {
  kicker: string;
  title: string;
  titleAccent: string;
  lead: string;
  facts: Array<{ value: string; label: string; text: string }>;
  usualLabel: string;
  usual: string[];
  oursLabel: string;
  ours: string[];
  contractsLabel: string;
  disclaimer: string;
}> = {
  cs: {
    kicker: 'Smlouvy pro cizince · English · Українська',
    title: 'Celá smlouva česky —',
    titleAccent: 'a vedle ní celá anglicky nebo ukrajinsky.',
    lead: 'Pronajímáte byt cizinci, zaměstnáváte pracovníky z Ukrajiny nebo prodáváte auto kupujícímu, který nemluví česky? U šesti nejčastějších smluv dostanete k českému znění úplný překlad. Obsahuje každý článek a každý odstavec, se stejným číslováním a s vašimi údaji.',
    facts: [
      { value: '6', label: 'smluv', text: 'Nájem, podnájem, pracovní smlouva, DPP, plná moc a prodej auta.' },
      { value: '100 %', label: 'odstavců', text: 'Žádné shrnutí. Úplnost překladu hlídá automatická kontrola napříč stovkami variant formuláře.' },
      { value: 'EN / UA', label: 'formulář', text: 'Druhá strana může formulář vyplnit sama ve svém jazyce a vidí přeložený náhled.' },
      { value: 'V ceně', label: 'pro cizince', text: `Při vyplnění anglicky nebo ukrajinsky je překlad v ceně. K české verzi formuláře za ${ANNEX_PRICE}.` },
    ],
    usualLabel: 'Jak se to obvykle řeší',
    usual: [
      'Česká šablona a strojový překladač, bez kontroly právních pojmů.',
      'Dvojjazyčný vzor, který ručně přepisujete v obou jazycích.',
      'Úřední překlad účtovaný po normostranách, s čekáním na překladatele.',
    ],
    oursLabel: 'SmlouvaHned',
    ours: [
      'Překlad vzniká současně se smlouvou, ze stejných údajů.',
      'Změna ve formuláři se propíše do obou jazykových verzí.',
      'PDF s oběma verzemi ihned po zaplacení.',
    ],
    contractsLabel: 'Vytvořit smlouvu s překladem',
    disclaimer: 'Překlad je vysvětlující, nikoli úřední. Při rozporu má přednost české znění.',
  },
  en: {
    kicker: 'Czech contract + full English translation',
    title: 'The whole contract in Czech —',
    titleAccent: 'and the whole contract in English, article by article.',
    lead: 'Fill in the form in English. You get the Czech contract and, in the same PDF, a complete English translation of every article and paragraph, with the same numbering and your details. The translation is included in the price.',
    facts: [
      { value: '6', label: 'contracts', text: 'Lease, sublease, employment contract, DPP, power of attorney and car sale.' },
      { value: '100 %', label: 'of paragraphs', text: 'No summaries. An automated check verifies completeness across hundreds of form variants.' },
      { value: 'Included', label: 'in the price', text: 'No add-on to buy: the translation comes with every order made in English.' },
      { value: 'Instant', label: 'PDF', text: 'Czech and English together, ready to download right after payment.' },
    ],
    usualLabel: 'The usual options',
    usual: [
      'A Czech-only template run through a machine translator.',
      'A bilingual template you edit by hand in both languages.',
      'A certified translation billed per page, with a wait for the translator.',
    ],
    oursLabel: 'SmlouvaHned',
    ours: [
      'The translation is generated together with the contract, from the same details.',
      'Change anything in the form and both language versions change.',
      'One PDF with both versions, immediately after payment.',
    ],
    contractsLabel: 'Create a contract with the translation',
    disclaimer: 'Explanatory translation, not a certified one. The Czech wording prevails.',
  },
  ua: {
    kicker: 'Чеський договір + повний український переклад',
    title: 'Весь договір чеською —',
    titleAccent: 'і весь договір українською, стаття за статтею.',
    lead: 'Заповніть форму українською. Ви отримаєте чеський договір і в тому ж PDF повний український переклад кожної статті та кожного пункту, з тією самою нумерацією та вашими даними. Переклад включено в ціну.',
    facts: [
      { value: '6', label: 'договорів', text: 'Оренда, піднайм, трудовий договір, DPP, довіреність і продаж авто.' },
      { value: '100 %', label: 'пунктів', text: 'Без скорочень. Повноту перекладу перевіряє автоматичний тест на сотнях варіантів форми.' },
      { value: 'У ціні', label: 'переклад', text: 'Нічого не треба докуповувати: переклад входить у кожне замовлення українською.' },
      { value: 'Одразу', label: 'PDF', text: 'Чеська й українська версії разом, одразу після оплати.' },
    ],
    usualLabel: 'Як це зазвичай вирішують',
    usual: [
      'Чеський шаблон і машинний перекладач.',
      'Двомовний шаблон, який ви вручну переписуєте обома мовами.',
      'Офіційний переклад з оплатою за сторінку та очікуванням перекладача.',
    ],
    oursLabel: 'SmlouvaHned',
    ours: [
      'Переклад створюється разом із договором, з тих самих даних.',
      'Зміна у формі одразу змінює обидві мовні версії.',
      'Один PDF з обома версіями одразу після оплати.',
    ],
    contractsLabel: 'Створити договір з перекладом',
    disclaimer: 'Пояснювальний, не офіційний переклад. Переважає основний чеський текст.',
  },
};

export default function BilingualAdvantageSection({
  locale = 'cs',
  id = 'smlouvy-pro-cizince',
  className = '',
}: {
  locale?: SectionLocale;
  id?: string;
  className?: string;
}) {
  const copy = COPY[locale];
  const samples = getBilingualShowcaseSamples();
  const headingId = `${id}-title`;

  return (
    <section id={id} className={`scroll-mt-24 ${className}`} aria-labelledby={headingId}>
      {locale === 'cs' ? <ForeignReaderStrip className="mb-8" /> : null}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-x-10 lg:gap-y-7">
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="site-kicker mb-3">{copy.kicker}</p>
          <h2 id={headingId} className="font-serif text-3xl font-semibold leading-tight text-[#f2e7c8] md:text-[2.6rem]">
            {copy.title}{' '}
            <em className="pr-1 bg-gradient-to-r from-[#e8d092] via-[#f2e7c8] to-[#8fc9ff] bg-clip-text font-semibold text-transparent">{copy.titleAccent}</em>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">{copy.lead}</p>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <BilingualShowcase samples={samples} uiLocale={locale} initialLanguage={locale === 'ua' ? 'ua' : 'en'} />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <dl className="grid gap-3 sm:grid-cols-2">
            {copy.facts.map((fact) => (
              <div key={fact.label} className="rounded-2xl border border-white/8 bg-white/[0.025] p-4">
                <dt className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl font-semibold text-[#e8d092]">{fact.value}</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{fact.label}</span>
                </dt>
                <dd className="mt-1.5 text-xs leading-5 text-slate-400">{fact.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-5">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{copy.usualLabel}</p>
          <ul className="space-y-2">
            {copy.usual.map((line) => (
              <li key={line} className="flex gap-2 text-sm leading-6 text-slate-500">
                <Minus size={16} className="mt-1 shrink-0" aria-hidden="true" /><span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-[#c9a852]/25 bg-[#c9a852]/[0.055] px-5 py-5">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#d8bd73]">{copy.oursLabel}</p>
          <ul className="space-y-2">
            {copy.ours.map((line) => (
              <li key={line} className="flex gap-2 text-sm leading-6 text-slate-300">
                <Check size={16} className="mt-1 shrink-0 text-[#d8bd73]" aria-hidden="true" /><span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <nav aria-label={copy.contractsLabel} className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold text-slate-400">{copy.contractsLabel}:</span>
          {TRANSLATED_CONTRACTS.map((contract) => (
            <Link
              key={contract}
              href={withLocale(EXPAT_CONTRACT_ROUTES[contract], locale)}
              className="rounded-full border border-[#c9a852]/30 bg-[#c9a852]/8 px-3 py-1.5 text-xs font-semibold text-[#e2c77b] transition hover:border-[#c9a852]/65 hover:bg-[#c9a852]/15 hover:text-white"
            >
              {CONTRACT_NAMES[locale][contract]}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">{copy.disclaimer}</p>
    </section>
  );
}
