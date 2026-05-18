interface ArticleTrustBoxProps {
  generatorSuitable: string;
  lawyerSuitable: string;
  labels?: {
    eyebrow?: string;
    generatorTitle?: string;
    lawyerTitle?: string;
  };
}

export default function ArticleTrustBox({
  generatorSuitable,
  lawyerSuitable,
  labels,
}: ArticleTrustBoxProps) {
  return (
    <div className="blog-callout my-10 rounded-[1.5rem] p-6">
      <div className="site-kicker">{labels?.eyebrow ?? 'Kdy služba dává smysl'}</div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#d6ac60]">
            {labels?.generatorTitle ?? 'Vhodné pro standardní situaci'}
          </div>
          <p className="mt-3 text-base leading-8 text-[#d2c8b9]">{generatorSuitable}</p>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#f2e7c8]">
            {labels?.lawyerTitle ?? 'Kdy už zvolit advokáta'}
          </div>
          <p className="mt-3 text-base leading-8 text-[#d2c8b9]">{lawyerSuitable}</p>
        </div>
      </div>
    </div>
  );
}
