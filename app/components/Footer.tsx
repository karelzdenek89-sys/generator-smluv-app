'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NewsletterSignup from '@/app/components/NewsletterSignup';
import { SEO_LANDINGS, FOOTER_GROUPS } from '@/lib/internal-links';
import { normalizeLocale, type AppLocale } from '@/lib/locale';

type FooterCopy = {
  softwareTool: string;
  tagline: string;
  operator: string;
  navHeading: string;
  navGlossary: string;
  navFaq: string;
  navAbout: string;
  navContact: string;
  navMyDocuments: string;
  securePayment: string;
  paymentNote: string;
  disclaimerLabel: string;
  disclaimer: string;
  lawyerDirectory: string;
  terms: string;
};

const FOOTER_COPY: Record<AppLocale, FooterCopy> = {
  cs: {
    softwareTool: 'Softwarový nástroj',
    tagline: 'Sestaví standardizovaný smluvní dokument z údajů, které vyplníte v průvodci.',
    operator: 'Provozovatel',
    navHeading: 'Navigace',
    navGlossary: 'Slovník pojmů',
    navFaq: 'Časté dotazy',
    navAbout: 'O projektu',
    navContact: 'Kontakt',
    navMyDocuments: 'Moje dokumenty',
    securePayment: 'Zabezpečená platba',
    paymentNote: 'Platební údaje zpracovává výhradně Stripe. My je nikdy nevidíme.',
    disclaimerLabel: 'Upozornění:',
    disclaimer:
      'SmlouvaHned.cz je softwarový nástroj pro tvorbu standardizovaných dokumentů. Není advokátní kanceláří a neposkytuje právní poradenství ve smyslu zákona č. 85/1996 Sb. Obsah dokumentu určuje uživatel svými vstupy. Pro nestandardní případy, probíhající spory nebo transakce s vyšší hodnotou doporučujeme konzultaci s advokátem — seznam na',
    lawyerDirectory: 'cak.cz',
    terms: 'Obchodní podmínky',
  },
  en: {
    softwareTool: 'Software tool',
    tagline: 'Builds a standardized contract document from the details you fill in the guide.',
    operator: 'Operator',
    navHeading: 'Navigation',
    navGlossary: 'Glossary',
    navFaq: 'FAQ',
    navAbout: 'About',
    navContact: 'Contact',
    navMyDocuments: 'My documents',
    securePayment: 'Secure payment',
    paymentNote: 'Payment details are processed solely by Stripe. We never see them.',
    disclaimerLabel: 'Disclaimer:',
    disclaimer:
      'SmlouvaHned.cz is a software tool for creating standardized documents. It is not a law firm and does not provide legal advice within the meaning of Act No. 85/1996 Coll. The content of each document is determined by the user’s input. For non-standard cases, ongoing disputes or higher-value transactions we recommend consulting a lawyer — directory at',
    lawyerDirectory: 'cak.cz',
    terms: 'Terms & Conditions',
  },
  ua: {
    softwareTool: 'Програмний інструмент',
    tagline: 'Формує стандартизований договірний документ із даних, які ви вводите в майстрі.',
    operator: 'Оператор',
    navHeading: 'Навігація',
    navGlossary: 'Словник термінів',
    navFaq: 'Часті запитання',
    navAbout: 'Про проєкт',
    navContact: 'Контакти',
    navMyDocuments: 'Мої документи',
    securePayment: 'Безпечна оплата',
    paymentNote: 'Платіжні дані обробляє виключно Stripe. Ми їх ніколи не бачимо.',
    disclaimerLabel: 'Застереження:',
    disclaimer:
      'SmlouvaHned.cz — це програмний інструмент для створення стандартизованих документів. Він не є юридичною фірмою і не надає юридичних консультацій у розумінні Закону № 85/1996 Зб. Зміст документа визначає користувач своїми даними. Для нестандартних випадків, поточних спорів або угод із вищою вартістю рекомендуємо консультацію з адвокатом — каталог на',
    lawyerDirectory: 'cak.cz',
    terms: 'Умови використання',
  },
};

function subscribeToLocation(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener('pageshow', callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('pageshow', callback);
  };
}

function getQueryLocaleSnapshot(): 'en' | 'ua' | null {
  const raw = new URLSearchParams(window.location.search).get('lang');
  const normalized = raw ? normalizeLocale(raw) : 'cs';
  return normalized === 'en' || normalized === 'ua' ? normalized : null;
}

function FooterContent({
  locale,
  placement = 'global',
}: {
  locale: AppLocale;
  placement?: 'global' | 'localized-builder';
}) {
  const t = FOOTER_COPY[locale];
  const showCzechSeoColumns = locale === 'cs';

  return (
    <footer data-site-footer={placement} className="border-t border-[#c9a852]/10 bg-[#040c1a] text-slate-300 mt-20 md:mt-24">
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-8 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c9a852]/40 bg-[#07111e] text-xs font-bold text-[#c9a852]">SH</div>
              <div>
                <div className="font-serif italic text-sm font-semibold text-white">SmlouvaHned</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-600">{t.softwareTool}</div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              {t.tagline}
            </p>
            <div className="mt-3 space-y-0.5 text-[11px] text-slate-600">
              <p>{t.operator}: Karel Zdeněk</p>
              <p>IČO: 23660295</p>
              <p>
                <a href="mailto:info@smlouvahned.cz" className="hover:text-[#c9a852] transition-colors">
                  info@smlouvahned.cz
                </a>
              </p>
            </div>
            {locale === 'cs' ? <NewsletterSignup /> : null}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-[13px]">
            <div>
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                {t.navHeading}
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
                <Link href="/slovnik" className="hover:text-white transition-colors">{t.navGlossary}</Link>
                <Link href="/faq" className="hover:text-white transition-colors">{t.navFaq}</Link>
                <Link href="/o-projektu" className="hover:text-white transition-colors">{t.navAbout}</Link>
                <Link href="/kontakt" className="hover:text-white transition-colors">{t.navContact}</Link>
                <Link href="/zakaznicka-zona" className="hover:text-white transition-colors">{t.navMyDocuments}</Link>
              </div>
            </div>

            {showCzechSeoColumns
              ? FOOTER_GROUPS.map((group) => {
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
                })
              : null}
          </div>
        </div>

        <div className="mt-8 border-t border-[#c9a852]/10 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                {t.securePayment}
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
              {t.paymentNote}
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-[#c9a852]/8 pt-5">
          <div className="mb-3 rounded-xl border border-white/5 bg-[#07111e] px-4 py-3 text-xs leading-relaxed text-slate-600">
            <span className="font-semibold text-slate-500">{t.disclaimerLabel}</span>{' '}
            {t.disclaimer}{' '}
            <a
              href="https://www.cak.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-400 underline underline-offset-2 transition"
            >
              {t.lawyerDirectory}
            </a>
            .
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[11px] text-slate-600">
            <p>
              © 2024–{new Date().getFullYear()} Karel Zdeněk, IČO: 23660295 · SmlouvaHned.cz
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/obchodni-podminky" className="hover:text-slate-400 transition-colors">{t.terms}</Link>
              <Link href="/gdpr" className="hover:text-slate-400 transition-colors">GDPR</Link>
              <Link href="/sitemap.xml" className="hover:text-slate-400 transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function LocalizedFooter({ locale }: { locale: Exclude<AppLocale, 'cs'> }) {
  return <FooterContent locale={locale} placement="localized-builder" />;
}

export default function Footer() {
  const pathname = usePathname();
  const firstSegment = pathname.split('/')[1] ?? '';
  const queryLocale = useSyncExternalStore(
    subscribeToLocation,
    getQueryLocaleSnapshot,
    () => null,
  );
  const locale: AppLocale =
    firstSegment === 'ua' ? 'ua' : firstSegment === 'en' ? 'en' : queryLocale ?? 'cs';
  return <FooterContent locale={locale} />;
}
