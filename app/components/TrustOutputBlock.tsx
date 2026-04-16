type TrustOutputBlockProps = {
  label: string;
  title: string;
  intro?: string;
  items: readonly string[];
  note?: string;
  className?: string;
  compact?: boolean;
};

export default function TrustOutputBlock({
  label,
  title,
  intro,
  items,
  note,
  className = '',
  compact = false,
}: TrustOutputBlockProps) {
  return (
    <section className={className}>
      <div className={`site-content-card ${compact ? 'p-5 md:p-6' : 'p-7 md:p-8'}`}>
        <div className="site-kicker">{label}</div>
        <h2 className="site-heading-lg mt-4">{title}</h2>
        {intro ? <p className="mt-4 max-w-3xl text-sm leading-7 text-[#d7d0c3]">{intro}</p> : null}

        <div className={`mt-6 grid gap-4 ${compact ? 'lg:grid-cols-2' : 'md:grid-cols-2'}`}>
          {items.map((item) => (
            <div
              key={item}
              className={`rounded-[1.15rem] border border-[#a6865b22] bg-[rgba(16,13,11,0.26)] ${compact ? 'p-4' : 'p-5'}`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#d6ac60]" />
                <p className="text-sm leading-7 text-[#d7d0c3]">{item}</p>
              </div>
            </div>
          ))}
        </div>

        {note ? (
           <p className="mt-4 text-xs leading-relaxed text-[#9b8f7f]">{note}</p>
        ) : null}
      </div>
    </section>
  );
}
