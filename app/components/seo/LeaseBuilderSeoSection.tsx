import Link from 'next/link';
import {
  LEASE_CS_GUIDE_LINKS,
  LEASE_CS_SEO_SECTIONS,
} from '@/lib/seo/lease-builder-seo';

/**
 * Supplementary SEO content for /najem only. It stays in the document for crawlers
 * and readers, but remains collapsed by default so a buyer can reach the form quickly.
 */
export default function LeaseBuilderSeoSection() {
  return (
    <details
      aria-label="Průvodce nájemní smlouvou"
      className="group mx-auto max-w-7xl px-4 pb-4 lg:px-8"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl border border-[rgba(166,134,91,0.18)] bg-[rgba(20,15,12,0.35)] px-5 py-4 text-left transition hover:border-[rgba(214,172,96,0.32)] [&::-webkit-details-marker]:hidden">
        <span>
          <span className="site-kicker">Praktický průvodce</span>
          <span className="mt-1 block text-sm font-semibold text-[#f2e7c8]">Co by měla nájemní smlouva řešit</span>
          <span className="mt-1 block text-xs leading-5 text-[#9f9584]">Kauce, předání bytu, doba nájmu, výpověď a nejčastější chyby.</span>
        </span>
        <span className="shrink-0 text-lg text-[#d6ac60] transition-transform group-open:rotate-45">+</span>
      </summary>

      <section className="border-t border-[rgba(166,134,91,0.12)] py-10" aria-labelledby="lease-guide-heading">
        <div className="max-w-3xl">
          <div className="site-kicker">Praktický přehled</div>
          <h2 id="lease-guide-heading" className="site-heading-lg mt-4 text-[#f2e7c8]">
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
    </details>
  );
}
