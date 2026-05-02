import Link from 'next/link';
import { SEO_LANDINGS, FOOTER_GROUPS } from '@/lib/internal-links';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08101e] text-[#d7dee8] mt-24">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="text-lg font-semibold text-white">
              SmlouvaHned
            </Link>
            <p className="mt-3 text-sm text-[#9aa6b8] leading-relaxed">
              Online generátor smluvních dokumentů. Vyplníte formulář a stáhnete hotové PDF dle legislativy 2026.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <Link href="/blog" className="text-[#c5d0e0] hover:text-white">Právní průvodce (blog)</Link>
              <Link href="/o-projektu" className="text-[#c5d0e0] hover:text-white">O projektu</Link>
              <Link href="/kontakt" className="text-[#c5d0e0] hover:text-white">Kontakt</Link>
            </div>
          </div>

          {FOOTER_GROUPS.map((group) => {
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
                <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                  {group.label}
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {[...items, ...extra].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[#c5d0e0] hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-[#7e8a9c]">
          <p>© {new Date().getFullYear()} SmlouvaHned — Karel Zdeněk, IČO 23660295</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/gdpr" className="hover:text-white">GDPR</Link>
            <Link href="/obchodni-podminky" className="hover:text-white">Obchodní podmínky</Link>
            <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
