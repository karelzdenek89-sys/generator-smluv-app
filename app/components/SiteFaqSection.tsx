import type { ReactNode } from 'react';

type FaqItem = {
  q: string;
  a: string;
};

type SiteFaqSectionProps = {
  label: string;
  title: string;
  intro?: string;
  items: readonly FaqItem[];
  aside?: ReactNode;
  className?: string;
};

export default function SiteFaqSection({
  label,
  title,
  intro,
  items,
  aside,
  className = '',
}: SiteFaqSectionProps) {
  return (
    <section className={className}>
      <div className={`grid gap-6 ${aside ? 'lg:grid-cols-[1.15fr_0.85fr]' : ''}`}>
        <div className="site-content-card p-7 md:p-8">
          <div className="site-kicker">{label}</div>
          <h2 className="site-heading-lg mt-4">{title}</h2>
          {intro ? <p className="mt-4 max-w-3xl text-sm leading-7 text-[#d7d0c3]">{intro}</p> : null}
          <div className="mt-7 space-y-3">
            {items.map((item) => (
              <details
                key={item.q}
                className="rounded-[1.25rem] border border-[#a6865b22] bg-[rgba(16,13,11,0.26)] p-5"
              >
                <summary className="cursor-pointer list-none text-base font-semibold text-[#f2e7c8]">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-7 text-[#d7d0c3]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {aside ? aside : null}
      </div>
    </section>
  );
}
