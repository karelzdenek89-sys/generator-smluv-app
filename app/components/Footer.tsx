'use client';

import Link from 'next/link';
import NewsletterSignup from '@/app/components/NewsletterSignup';
import { SEO_LANDINGS, FOOTER_GROUPS } from '@/lib/internal-links';
import { useBuilderLocale } from '@/app/components/BuilderLocaleNotice';
import { EXPAT_CONTRACT_ROUTES, withLocale, type ExpatContractType } from '@/lib/locale';
import { getLocalizedBuilderCopy } from '@/lib/i18n/expat-locale-copy';

export default function Footer() {
  const locale = useBuilderLocale();
  const copy = locale === 'en'
    ? {
        tool: 'Software tool', description: 'Software for automated creation of standardised Czech contract documents. Not a law firm and does not provide legal advice.', operator: 'Operator', navigation: 'Navigation', glossary: 'Glossary', faq: 'FAQ', about: 'About', contact: 'Contact', documents: 'My documents', contracts: 'Supported contracts', secured: 'Secure payment', payment: 'Stripe exclusively processes payment details. We never see them.', warning: 'Notice:', disclaimer: 'SmlouvaHned.cz is software for standardised documents, not a law firm. For non-standard cases, disputes or high-value transactions, consult a Czech attorney.', terms: 'Terms', privacy: 'Privacy', copyright: 'is a document software tool, not a law firm.'
      }
    : locale === 'ua'
      ? {
          tool: 'Програмний інструмент', description: 'Програма для автоматизованого створення стандартизованих чеських договорів. Не є юридичною фірмою та не надає юридичних консультацій.', operator: 'Оператор', navigation: 'Навігація', glossary: 'Словник', faq: 'Поширені запитання', about: 'Про проєкт', contact: 'Контакти', documents: 'Мої документи', contracts: 'Підтримувані договори', secured: 'Безпечна оплата', payment: 'Платіжні дані обробляє виключно Stripe. Ми їх не бачимо.', warning: 'Застереження:', disclaimer: 'SmlouvaHned.cz — програма для стандартизованих документів, а не юридична фірма. Для нестандартних випадків, спорів або значних за вартістю угод зверніться до чеського адвоката.', terms: 'Умови', privacy: 'Конфіденційність', copyright: 'є програмою для створення документів, а не юридичною фірмою.'
        }
      : {
          tool: 'Softwarový nástroj', description: 'Softwarový nástroj pro automatizovanou tvorbu standardizovaných smluvních dokumentů. Není advokátní kanceláří a neposkytuje právní poradenství.', operator: 'Provozovatel', navigation: 'Navigace', glossary: 'Slovník pojmů', faq: 'Časté dotazy', about: 'O projektu', contact: 'Kontakt', documents: 'Moje dokumenty', contracts: 'Smlouvy', secured: 'Zabezpečená platba', payment: 'Platební údaje zpracovává výhradně Stripe. My je nikdy nevidíme.', warning: 'Upozornění:', disclaimer: 'SmlouvaHned.cz je softwarový nástroj pro tvorbu standardizovaných dokumentů. Není advokátní kanceláří a neposkytuje právní poradenství. Pro nestandardní případy, spory nebo transakce s vyšší hodnotou doporučujeme konzultaci s advokátem.', terms: 'Obchodní podmínky', privacy: 'GDPR', copyright: 'je softwarový nástroj pro tvorbu dokumentů, nikoli advokátní kancelář.'
        };
  const expatContracts: ExpatContractType[] = ['lease', 'sublease', 'employment', 'dpp', 'power_of_attorney', 'car_sale'];
  return (
    <footer className="border-t border-[#c9a852]/10 bg-[#040c1a] text-slate-300 mt-20 md:mt-24">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-8 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c9a852]/40 bg-[#07111e] text-xs font-bold text-[#c9a852]">SH</div>
              <div>
                <div className="font-serif italic text-sm font-semibold text-white">SmlouvaHned</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-600">{copy.tool}</div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              {copy.description}
            </p>
            <div className="mt-3 space-y-0.5 text-[11px] text-slate-600">
              <p>{copy.operator}: Karel Zdeněk</p>
              <p>IČO: 23660295</p>
              <p>
                <a href="mailto:info@smlouvahned.cz" className="hover:text-[#c9a852] transition-colors">
                  info@smlouvahned.cz
                </a>
              </p>
            </div>
            <NewsletterSignup />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-[13px]">
            <div>
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                {copy.navigation}
              </div>
              <div className="flex flex-col gap-2 text-slate-500">
                <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                <Link href="/en" className="hover:text-white transition-colors">
                  English — for foreigners
                </Link>
                <Link href="/ua" className="hover:text-white transition-colors">
                  Українська — для іноземців
                </Link>
                <Link
                  href="/blog#expat-guides-heading"
                  className="hover:text-white transition-colors"
                >
                  Expat guides (EN / UA)
                </Link>
                <Link href="/slovnik" className="hover:text-white transition-colors">{copy.glossary}</Link>
                <Link href="/faq" className="hover:text-white transition-colors">{copy.faq}</Link>
                <Link href="/o-projektu" className="hover:text-white transition-colors">{copy.about}</Link>
                <Link href="/kontakt" className="hover:text-white transition-colors">{copy.contact}</Link>
                <Link href="/zakaznicka-zona" className="hover:text-white transition-colors">{copy.documents}</Link>
              </div>
            </div>

            {locale !== 'cs' ? (
              <div>
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">{copy.contracts}</div>
                <div className="flex flex-col gap-2 text-slate-500">
                  {expatContracts.map((contract) => {
                    const localized = getLocalizedBuilderCopy(contract, locale);
                    return <Link key={contract} href={withLocale(EXPAT_CONTRACT_ROUTES[contract], locale)} className="hover:text-white transition-colors">{localized?.title ?? contract}</Link>;
                  })}
                </div>
              </div>
            ) : FOOTER_GROUPS.map((group) => {
              const items = SEO_LANDINGS.filter((l) => l.cluster === group.cluster);
              const extra =
                group.cluster === 'finance'
                  ? SEO_LANDINGS.filter(
                      (l) =>
                        l.cluster === 'b2b' ||
                        l.cluster === 'zastoupeni' ||
                        l.cluster === 'darovani',
                    )
                  : [];
              return (
                <div key={group.label}>
                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    {group.label}
                  </div>
                  <div className="flex flex-col gap-2 text-slate-500">
                    {[...items, ...extra].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 border-t border-[#c9a852]/10 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                {copy.secured}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-md border border-white/8 bg-white/4 px-2.5 py-1">
                  <svg className="h-3.5 w-auto" viewBox="0 0 70 25" aria-label="Stripe">
                    <text x="2" y="18" fontSize="14" fontWeight="800" fill="#635BFF" fontFamily="Arial">stripe</text>
                  </svg>
                </div>
                <div className="rounded-md border border-white/8 bg-white/4 px-2.5 py-1 text-[10px] font-black text-[#1A1F71]">VISA</div>
                <div className="flex items-center justify-center rounded-md border border-white/8 bg-white/4 px-2 py-1">
                  <svg className="h-4 w-auto" viewBox="0 0 38 24" aria-label="Mastercard">
                    <circle cx="15" cy="12" r="10" fill="#EB001B" />
                    <circle cx="23" cy="12" r="10" fill="#F79E1B" />
                    <path d="M19 4.8a10 10 0 0 1 0 14.4A10 10 0 0 1 19 4.8z" fill="#FF5F00" />
                  </svg>
                </div>
                <div className="flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1">
                  <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-400">SSL</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-600">
              {copy.payment}
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-[#c9a852]/8 pt-5">
          <div className="mb-3 rounded-xl border border-white/5 bg-[#07111e] px-4 py-3 text-xs leading-relaxed text-slate-600">
            <span className="font-semibold text-slate-500">{copy.warning}</span>{' '}
            {copy.disclaimer}{' '}
            <a
              href="https://www.cak.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-400 underline underline-offset-2 transition"
            >
              cak.cz
            </a>
            .
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[11px] text-slate-600">
            <p>
              © 2024–{new Date().getFullYear()} Karel Zdeněk, IČO: 23660295 · SmlouvaHned.cz {copy.copyright}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/obchodni-podminky" className="hover:text-slate-400 transition-colors">{copy.terms}</Link>
              <Link href="/gdpr" className="hover:text-slate-400 transition-colors">{copy.privacy}</Link>
              <Link href="/sitemap.xml" className="hover:text-slate-400 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
