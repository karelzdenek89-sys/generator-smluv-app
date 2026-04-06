'use client';

interface Section {
  title: string;
  body: string[];
}

interface ContractPreviewProps {
  sections: Section[];
  title: string;
  previewCount?: number;
}

export default function ContractPreview({
  sections,
  title,
  previewCount = 3,
}: ContractPreviewProps) {
  if (!sections?.length) return null;

  const visibleSections = sections.slice(0, previewCount);
  const today = new Date().toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="site-content-card overflow-hidden rounded-[1.75rem] p-5">
      <div className="builder-kicker mb-3">Náhled výstupu</div>
      <div className="mb-4 text-sm leading-7 text-[#d2c8b9]">
        Průběžný náhled struktury dokumentu podle zadaných údajů.
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-[rgba(166,134,91,0.18)] bg-[#f5efe3] shadow-[0_18px_44px_rgba(10,8,7,0.18)]">
        <div className="border-b border-[#dccdae] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#9f7a40]">
                SmlouvaHned.cz
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#5e4827]">{title}</div>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#8f7a59]">{today}</div>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6">
          {visibleSections.map(section => (
            <div key={section.title}>
              <div className="border-b border-[#e5d8bf] pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9f7a40]">
                {section.title}
              </div>
              <div className="mt-3 space-y-2">
                {section.body.slice(0, 5).map((line, index) => {
                  const text = String(line ?? '').trim();
                  if (!text) return null;

                  return (
                    <p key={`${section.title}-${index}`} className="text-[13px] leading-7 text-[#4a3d2c]">
                      {text}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#dccdae] px-6 py-3 text-[11px] leading-6 text-[#7c6747]">
          Zobrazen je orientační náhled struktury dokumentu. Finální výstup se sestaví podle vyplněných údajů.
        </div>
      </div>
    </div>
  );
}

