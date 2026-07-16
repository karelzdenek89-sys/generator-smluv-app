'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAnalyticsDefaultsForPathname, trackEvent } from '@/lib/analytics';
import { getBuilderCopy, getContractTypeByPath } from '@/lib/locale';
import { BuilderLocaleNotice, useBuilderLocale } from '@/app/components/BuilderLocaleNotice';
import WhyNotGenericBlock from '@/app/components/marketing/WhyNotGenericBlock';
import { faqPageSchema, jsonLdScript } from '@/lib/schemas';

export interface ContractLandingBenefit {
  icon: string;
  text: string;
}

export interface ContractLandingFaq {
  q: string;
  a: string;
}

export interface ContractLandingAlternative {
  label: string;
  href: string;
  text: string;
}

export interface ContractLandingSectionProps {
  badge: string;
  h1Main: string;
  h1Accent?: string;
  h1Suffix?: string;
  subtitle: string;
  benefits: ContractLandingBenefit[];
  contents: string[];
  whenSuitable: string[];
  whenUnsuitable?: string[];
  whenOther?: ContractLandingAlternative[];
  faq: ContractLandingFaq[];
  ctaLabel?: string;
  formId?: string;
  guideHref?: string;
  guideLabel?: string;
  differentiationHint?: string;
}

export default function ContractLandingSection({
  badge,
  h1Main,
  h1Accent,
  h1Suffix,
  subtitle,
  benefits,
  contents,
  whenSuitable,
  whenUnsuitable,
  whenOther,
  faq,
  ctaLabel = 'Pokračovat k vytvoření dokumentu',
  formId = 'formular',
  guideHref,
  guideLabel = 'Průvodce k tomuto dokumentu',
  differentiationHint,
}: ContractLandingSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const pathname = usePathname();
  const locale = useBuilderLocale();
  const contractType = getContractTypeByPath(pathname);
  const localizedCopy = contractType ? getBuilderCopy(contractType, locale) : null;
  const trustCopy =
    locale === 'en'
      ? {
          unsuitableLabel: 'Outside the standard scope',
          unsuitableTitle: 'When this tool is not suitable',
          unsuitableItems: [
            'An ongoing dispute, enforcement issue or terms that the parties do not agree on.',
            'A complex, high-value or regulated transaction that needs individual legal assessment.',
            'A situation where you need legal advice, representation or a certified translation.',
          ],
          outputLabel: 'What you receive',
          outputTitle: 'A document assembled from your answers',
          outputIntro:
            'Before payment you can review the document structure and entered data. The final scope depends on the selected variant and add-ons.',
          outputItems: [
            'A PDF prepared for your final review and signatures.',
            'The parties, amounts, dates and other data entered in the form placed into the document.',
            'Clearly separated clauses and signature sections for the selected document type.',
            'An editable DOCX only if you select that optional add-on at checkout.',
          ],
          templateStatus:
            'Template status: maintained for standard situations. The date of the last documented substantive legal review is not currently published.',
        }
      : locale === 'ua'
        ? {
            unsuitableLabel: 'Поза стандартним обсягом',
            unsuitableTitle: 'Коли цей інструмент не підходить',
            unsuitableItems: [
              'Триваючий спір, виконавче провадження або умови, щодо яких сторони не домовилися.',
              'Складна, значна за вартістю чи регульована угода, що потребує індивідуальної правової оцінки.',
              'Ситуація, коли потрібна юридична консультація, представництво або офіційний переклад.',
            ],
            outputLabel: 'Що ви отримаєте',
            outputTitle: 'Документ, складений за вашими відповідями',
            outputIntro:
              'До оплати можна перевірити структуру документа та введені дані. Остаточний обсяг залежить від обраного варіанта й доповнень.',
            outputItems: [
              'PDF для остаточної перевірки та підписання.',
              'Дані сторін, суми, дати та інші відомості з форми, внесені до документа.',
              'Чітко розділені положення та блоки підписів для обраного типу документа.',
              'Редагований DOCX лише за умови вибору цього доповнення під час оплати.',
            ],
            templateStatus:
              'Стан шаблону: підтримується для стандартних ситуацій. Дата останньої документально підтвердженої змістовної правової перевірки наразі не опублікована.',
          }
        : {
            unsuitableLabel: 'Mimo standardní rozsah',
            unsuitableTitle: 'Kdy tento nástroj není vhodný',
            unsuitableItems: [
              'Probíhající spor, exekuce nebo podmínky, na kterých se strany neshodnou.',
              'Složitá, vysoce hodnotná nebo regulovaná transakce vyžadující individuální právní posouzení.',
              'Situace, kdy potřebujete právní radu, zastoupení nebo úředně ověřený překlad.',
            ],
            outputLabel: 'Co dostanete',
            outputTitle: 'Dokument sestavený z vašich odpovědí',
            outputIntro:
              'Před platbou si zkontrolujete strukturu dokumentu i zadané údaje. Konečný rozsah se odvíjí od zvolené varianty a doplňků.',
            outputItems: [
              'PDF připravené k vaší závěrečné kontrole a podpisu.',
              'Údaje o stranách, částky, data a další informace z formuláře doplněné do dokumentu.',
              'Přehledně oddělená ustanovení a podpisové bloky podle zvoleného typu dokumentu.',
              'Editovatelný DOCX pouze tehdy, pokud si tento volitelný doplněk vyberete v objednávce.',
            ],
            templateStatus:
              'Stav šablony: průběžně udržovaná pro standardní situace. Datum poslední doložené věcné právní revize zatím není zveřejněno.',
          };
  const unsuitableItems = locale === 'cs' && whenUnsuitable?.length
    ? whenUnsuitable
    : trustCopy.unsuitableItems;
  const faqSchema = faqPageSchema(
    faq.map((item) => ({ question: item.q, answer: item.a })),
  );

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const currentPath = pathname ?? '/';
    const packageKey =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('package')
        : null;
    const defaults = getAnalyticsDefaultsForPathname(currentPath);

    trackEvent('builder_view', {
      ...defaults,
      source: 'builder',
      surface: 'builder',
      entry_mode: packageKey ? 'package_flow' : 'single_document',
      package_key:
        packageKey === 'landlord' || packageKey === 'vehicle_sale'
          ? packageKey
          : undefined,
    });

    if (packageKey === 'landlord' || packageKey === 'vehicle_sale') {
      trackEvent('package_flow_entered', {
        ...defaults,
        source: 'package_landing',
        surface: 'builder',
        package_key: packageKey,
        entry_mode: 'package_flow',
        price_band: '299',
      });
    }
  }, [pathname]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqSchema) }}
      />
      {contractType ? <BuilderLocaleNotice contractType={contractType} /> : null}
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-12 lg:px-8 lg:pt-16">
        <div className="max-w-3xl">
          <div className="site-kicker">{badge}</div>
          <h1 className="site-heading-xl mt-5 max-w-4xl text-[#f2e7c8]">
            {localizedCopy ? (
              localizedCopy.title
            ) : (
              <>
                {h1Main} {h1Accent ? <span className="site-gold">{h1Accent}</span> : null}
                {h1Suffix ? <> {h1Suffix}</> : null}
              </>
            )}
          </h1>
          <p className="site-body-lg mt-6 max-w-3xl text-[#ddd5c7]">
            {localizedCopy?.description ?? subtitle}
          </p>

          <WhyNotGenericBlock
            className="mt-8"
            compact
            documentHint={differentiationHint}
            contractType={contractType}
          />

          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={() => scrollTo(formId)} className="site-button-primary">
              {localizedCopy ? 'Start the form' : ctaLabel}
            </button>
            <button onClick={() => scrollTo('obsah')} className="site-button-secondary">
              {localizedCopy ? 'What is included' : 'Co dokument obsahuje'}
            </button>
          </div>

          {guideHref ? (
            <div className="mt-6">
              <Link href={guideHref} className="text-sm font-medium text-[#d6ac60] hover:text-[#e0b870]">
                {guideLabel}
              </Link>
            </div>
          ) : null}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {benefits.map((item) => (
            <div key={item.text} className="site-content-card-soft rounded-[1.5rem] px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="text-lg leading-none">{item.icon}</span>
                <p className="text-sm leading-7 text-[#ddd5c7]">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="obsah" className="mx-auto max-w-7xl border-t border-[rgba(166,134,91,0.12)] px-4 py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="site-content-card rounded-[1.75rem] p-7">
            <div className="site-kicker">{localizedCopy ? 'Document contents' : 'Obsah dokumentu'}</div>
            <h2 className="site-heading-lg mt-4 text-[#f2e7c8]">
              {localizedCopy ? 'What the document includes' : 'Co dokument obsahuje'}
            </h2>
            <p className="site-body mt-4 text-[#d2c8b9]">
              {localizedCopy
                ? 'Structured Czech contract content assembled from your answers. English labels and notices help you understand the form.'
                : 'Strukturovaný obsah obvyklý pro tento typ dokumentu, sestavený podle vašich podmínek.'}
            </p>
            <ul className="mt-6 space-y-4">
              {contents.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-8 text-[#e3dbcf]">
                  <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(214,172,96,0.14)] text-xs font-bold text-[#d6ac60]">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="site-content-card rounded-[1.75rem] p-7">
              <div className="site-kicker">{localizedCopy ? 'Typical use' : 'Vhodné použití'}</div>
              <h2 className="site-heading-lg mt-4 text-[#f2e7c8]">
                {localizedCopy ? 'When this document is suitable' : 'Kdy je tento dokument vhodný'}
              </h2>
              <ul className="mt-6 space-y-4">
                {whenSuitable.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base leading-8 text-[#ddd5c7]">
                    <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[rgba(166,134,91,0.18)] text-xs text-[#d6ac60]">
                      →
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="site-content-card rounded-[1.75rem] p-7">
              <div className="site-kicker">{trustCopy.unsuitableLabel}</div>
              <h2 className="site-heading-lg mt-4 text-[#f2e7c8]">
                {trustCopy.unsuitableTitle}
              </h2>
              <ul className="mt-6 space-y-4">
                {unsuitableItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base leading-8 text-[#ddd5c7]">
                    <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[rgba(196,116,116,0.24)] text-xs text-[#d99a8d]">
                      ×
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {whenOther?.length ? (
              <div className="site-content-card rounded-[1.75rem] p-7">
                <div className="site-kicker">{localizedCopy ? 'Other document' : 'Jiný typ dokumentu'}</div>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[#f2e7c8]">
                  {localizedCopy ? 'When another document may fit better' : 'Kdy už je lepší zvolit jiný postup'}
                </h3>
                <div className="mt-6 space-y-3">
                  {whenOther.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-[1.25rem] border border-[rgba(166,134,91,0.12)] bg-[rgba(20,15,12,0.3)] px-5 py-4 transition hover:border-[rgba(214,172,96,0.28)]"
                    >
                      <div className="text-sm font-semibold text-[#d6ac60]">{item.label}</div>
                      <p className="mt-1 text-sm leading-7 text-[#d2c8b9]">{item.text}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="site-content-card mt-8 rounded-[1.75rem] p-7 md:p-8">
          <div className="site-kicker">{trustCopy.outputLabel}</div>
          <h2 className="site-heading-lg mt-4 text-[#f2e7c8]">{trustCopy.outputTitle}</h2>
          <p className="site-body mt-4 max-w-3xl text-[#d2c8b9]">{trustCopy.outputIntro}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {trustCopy.outputItems.map((item) => (
              <div key={item} className="site-content-card-soft rounded-[1.25rem] p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d6ac60]" />
                  <p className="text-sm leading-7 text-[#ddd5c7]">{item}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 border-t border-[rgba(166,134,91,0.12)] pt-4 text-xs leading-6 text-[#9b8f7f]">
            {trustCopy.templateStatus}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl border-t border-[rgba(166,134,91,0.12)] px-4 py-14 lg:px-8">
        <div className="max-w-3xl">
          <div className="site-kicker">{localizedCopy ? 'FAQ' : 'Časté otázky'}</div>
          <h2 className="site-heading-lg mt-4 text-[#f2e7c8]">
            {localizedCopy ? 'Common questions' : 'Nejčastější dotazy'}
          </h2>
        </div>
        <div className="mt-8 max-w-3xl space-y-3">
          {faq.map((item, index) => (
            <div key={item.q} className="site-content-card-soft overflow-hidden rounded-[1.5rem]">
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                aria-expanded={openFaq === index}
              >
                <span className="text-base font-semibold leading-7 text-[#f2e7c8]">{item.q}</span>
                <span className="text-xl text-[#d6ac60]">{openFaq === index ? '−' : '+'}</span>
              </button>
              {openFaq === index ? (
                <div className="border-t border-[rgba(166,134,91,0.12)] px-6 pb-5 pt-4 text-base leading-8 text-[#d2c8b9]">
                  {item.a}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
