import Link from 'next/link';
import { getRelatedLinks, type ClusterKey } from '@/lib/internal-links';

type Props = {
  currentHref: string;
  cluster: ClusterKey;
  limit?: number;
  title?: string;
  intro?: string;
};

export default function RelatedContracts({
  currentHref,
  cluster,
  limit = 4,
  title = 'Související smlouvy a průvodci',
  intro = 'Mohlo by vás zajímat — další vzory smluv, které řeší podobnou situaci.',
}: Props) {
  const links = getRelatedLinks(currentHref, cluster, limit);
  if (links.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 border-t border-white/10">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white">{title}</h2>
        <p className="mt-2 text-[#9aa6b8] max-w-2xl">{intro}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-white/30 hover:bg-white/[0.04] transition-colors"
          >
            <h3 className="text-base font-semibold text-white group-hover:text-white">
              {link.label}
            </h3>
            {link.description ? (
              <p className="mt-2 text-sm text-[#9aa6b8] leading-relaxed">
                {link.description}
              </p>
            ) : null}
            <span className="mt-3 inline-block text-sm text-[#c5d0e0] group-hover:text-white">
              Otevřít průvodce →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
