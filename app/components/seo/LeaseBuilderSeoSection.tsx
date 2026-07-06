import Link from 'next/link';
import {
  LEASE_CS_GUIDE_LINKS,
  LEASE_CS_SEO_SECTIONS,
} from '@/lib/seo/lease-builder-seo';

/**
 * Supplementary SEO content for /najem only. Does not affect the contract builder form.
 */
export default function LeaseBuilderSeoSection() {
  return (
    <section
      aria-label="Průvodce nájemní smlouvou"
      className="mx-auto max-w-7xl border-t border-[rgba(166,134,91,0.12)] px-4 py-14 lg:px-8"
    >
      <div className="max-w-3xl">
        <div className="site-kicker">Praktický přehled</div>
        <h2 className="site-heading-lg mt-4 text-[#f2e7c8]">
          Co by měla nájemní smlouva řešit
        </h2>
        <p className="site-body mt-4 text-[#d2c8b9]">
          Níže shrnujeme témata, která v běžném pronájmu bytu nebo domu nejčastěji řešíte.
          Nejde o individuální právní poradenství — u nestandardních situací je vhodné obrátit
          se na advokáta.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {LEASE_CS_SEO_SECTIONS.map((section) => (
          <article
            key={section.id}
            id={section.id}
            className="site-content-card scroll-mt-24 rounded-[1.75rem] p-7"
          >
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#f2e7c8]">
              {section.title}
            </h3>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="mt-4 text-base leading-8 text-[#d2c8b9]">
                {paragraph}
              </p>
            ))}
            {section.links?.map((link) => (
              <p key={link.href} className="mt-4 text-sm">
                <Link
                  href={link.href}
                  className="font-medium text-[#d6ac60] underline-offset-2 hover:text-[#e0b870] hover:underline"
                >
                  {link.label}
                </Link>
              </p>
            ))}
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-[1.75rem] border border-[rgba(166,134,91,0.14)] bg-[rgba(20,15,12,0.35)] p-7">
        <div className="site-kicker">Související průvodce</div>
        <p className="mt-3 text-sm leading-7 text-[#d2c8b9]">
          Detailnější články k jednotlivým tématům — bez nutnosti opakovat celý obsah na této
          stránce.
        </p>
        <ul className="mt-5 flex flex-wrap gap-3">
          {LEASE_CS_GUIDE_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-flex rounded-full border border-[rgba(166,134,91,0.2)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-sm text-[#ddd5c7] transition hover:border-[rgba(214,172,96,0.35)] hover:text-[#f2e7c8]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
