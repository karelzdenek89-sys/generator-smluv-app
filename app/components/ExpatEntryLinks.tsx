import Link from 'next/link';
import { FOREIGN_LOCALES, LOCALE_META } from '@/lib/i18n/locales';

const EXPAT_HUB_LINKS = FOREIGN_LOCALES.map((locale) => {
  const meta = LOCALE_META[locale];
  return {
    href: `/${meta.segment}`,
    flag: meta.flag,
    label: meta.nativeName,
    ariaLabel:
      locale === 'en'
        ? 'English overview for foreigners in the Czech Republic'
        : 'Огляд договорів українською для іноземців у Чехії',
  };
});

type Props = {
  className?: string;
  linkClassName?: string;
  showBlogLink?: boolean;
};

export default function ExpatEntryLinks({
  className = 'flex flex-wrap gap-2',
  linkClassName = 'inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#c9a852] transition-colors hover:border-[#c9a852]/50 hover:bg-[#c9a852]/10 hover:text-[#f4df8f]',
  showBlogLink = false,
}: Props) {
  return (
    <div className={className}>
      {EXPAT_HUB_LINKS.map((item) => (
        <Link key={item.href} href={item.href} aria-label={item.ariaLabel} className={linkClassName}>
          <span className="text-sm leading-none" aria-hidden="true">
            {item.flag}
          </span>
          {item.label}
        </Link>
      ))}
      {showBlogLink ? (
        <Link
          href="/blog#expat-guides-heading"
          className={linkClassName}
          aria-label="Blog guides for foreigners in English and Ukrainian"
        >
          Blog · EN / UA
        </Link>
      ) : null}
    </div>
  );
}
