import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';

export const metadata = blogArticlePageMetadata('zkusebni-doba-2026');

export default function ZkusebniDoba2026Page() {
  return (
    <ArticlePageLayout
      category="Práce a zaměstnání"
      readTime="7 min"
      dateTime="2026-07-09"
      dateLabel="9. července 2026"
      breadcrumbLabel="Zkušební doba 2026"
      slug="zkusebni-doba-2026"
      title="Zkušební doba 2026: 4 měsíce, 8 měsíců u vedoucích a pravidla prodloužení"
      intro="Zkušební doba nevzniká automaticky. Musí být mezi zaměstnancem a zaměstnavatelem písemně sjednána včas a v zákonném rozsahu. Od účinnosti flexinovely jsou limity delší než dříve, ale u pracovního poměru na dobu určitou stále platí další strop."
      toc={[
        { href: '#kdy-ji-sjednat', label: 'Kdy lze zkušební dobu sjednat' },
        { href: '#maximalni-delka', label: 'Maximální délka v roce 2026' },
        { href: '#doba-urcita', label: 'Pracovní poměr na dobu určitou' },
        { href: '#prodlouzeni', label: 'Prodloužení a absence' },
        { href: '#co-do-smlouvy', label: 'Co zkontrolovat ve smlouvě' },
      ]}
      primaryAction={{
        title: 'Připravujete pracovní smlouvu?',
        body: 'Ve formuláři nastavíte druh práce, místo výkonu, mzdu, dobu trvání i zkušební dobu v přehledné podobě.',
        buttonLabel: 'Vytvořit pracovní smlouvu',
        href: '/pracovni',
      }}
      trustBox={{
        generatorSuitable:
          'Standardní pracovní poměr, u kterého se strany shodly na základních podmínkách a potřebují je zachytit v písemné smlouvě.',
        lawyerSuitable:
          'Spor o platnost skončení pracovního poměru, složitá manažerská pozice nebo individuální odchylné ujednání nad rámec běžné smlouvy.',
      }}
      finalAction={{
        title: 'Chcete mít podmínky pracovního poměru zapsané přehledně?',
        body: 'Vyplňte pracovní smlouvu online včetně zkušební doby a hlavních pracovních podmínek.',
        buttonLabel: 'Otevřít formulář pracovní smlouvy',
        href: '/pracovni',
      }}
      relatedLinks={[
        { href: '/pracovni', label: 'Pracovní smlouva - formulář online' },
        { href: '/blog/pracovni-smlouva-2026', label: 'Co musí obsahovat pracovní smlouva' },
        { href: '/blog/flexinovela-zakoniku-prace-2026', label: 'Flexinovela zákoníku práce 2026' },
        { href: '/blog/dpp-dpc-porovnani-2026', label: 'DPP nebo DPČ' },
      ]}
    >
      <section id="kdy-ji-sjednat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Zkušební doba není povinná</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Zkušební dobu lze sjednat jen písemně a nejpozději v den vzniku pracovního poměru. Pokud se na ní strany
          nedohodnou, pracovní poměr běží bez ní. Dodatečný podpis po nástupu zaměstnance zkušební dobu nevytvoří.
        </p>
        <p className="leading-relaxed text-slate-400">
          Jejím účelem je ověřit, zda pracovní poměr oběma stranám vyhovuje. V běžné praxi proto dává smysl napsat
          délku přesně do pracovní smlouvy, místo obecné poznámky o tom, že se „sjednává zkušební doba dle zákona“.
        </p>
      </section>

      <section id="maximalni-delka" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Maximální délka v roce 2026</h2>
        <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5 text-sm leading-7 text-slate-400">
          <ul className="space-y-2">
            <li>• u běžného zaměstnance nejvýše 4 měsíce po sobě jdoucí,</li>
            <li>• u vedoucího zaměstnance nejvýše 8 měsíců po sobě jdoucích,</li>
            <li>• u pracovního poměru na dobu určitou navíc nejvýše polovinu jeho sjednané doby.</li>
          </ul>
        </div>
        <p className="mt-4 leading-relaxed text-slate-400">
          Limity se po flexinovele zvýšily od 1. června 2025. Delší ujednání proto není bezpečná „rezerva“: podle
          metodiky MPSV se zkušební doba v takovém případě omezí na zákonné maximum.
        </p>
      </section>

      <ArticleInlineCta
        title="Zachyťte pracovní podmínky písemně"
        body="Formulář pracovní smlouvy pomůže nastavit druh práce, místo výkonu, mzdu i zkušební dobu v jednom dokumentu."
        buttonLabel="Pokračovat k pracovní smlouvě"
        href="/pracovni"
        variant="subtle"
        articleSlug="zkusebni-doba-2026"
      />

      <section id="doba-urcita" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Pozor na polovinu doby určité</h2>
        <p className="leading-relaxed text-slate-400">
          U smlouvy na dobu určitou se nepoužije jen čtyřměsíční nebo osmiměsíční limit. Zkušební doba nesmí přesáhnout
          ani polovinu celkové sjednané doby pracovního poměru. U čtyřměsíční smlouvy tedy nemůže být delší než dva
          měsíce, i když by obecný limit dovoloval více.
        </p>
      </section>

      <section id="prodlouzeni" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Prodloužení a absence</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Zkušební doba se ze zákona prodlužuje o pracovní dny, kdy zaměstnanec během ní neodpracoval celou směnu pro
          překážku v práci, dovolenou nebo neomluvené zameškání. Nejde tedy vždy jen o prosté počítání kalendářních
          měsíců od data nástupu.
        </p>
        <p className="leading-relaxed text-slate-400">
          U zkušební doby sjednané od 1. června 2025 ji mohou strany během jejího běhu písemně prodloužit, ale jen do
          výše příslušného zákonného maxima. Dohoda uzavřená až po skončení zkušební doby ji neobnoví.
        </p>
      </section>

      <section id="co-do-smlouvy" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Kontrola před podpisem</h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Je délka zkušební doby uvedena konkrétně a písemně?',
            'Podepisují strany nejpozději v den nástupu?',
            'Nepřekračuje u doby určité polovinu trvání pracovního poměru?',
            'Je zřejmé, kdo je vedoucí zaměstnanec a zda se na něj může vztahovat osmiměsíční limit?',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1 text-amber-500">•</span><span>{item}</span></li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-slate-500">
          Zdroj: <a className="text-amber-400 hover:text-amber-300" href="https://ppropo.mpsv.cz/IV14Sjednanizkusebnidoby" target="_blank" rel="noreferrer">MPSV - sjednání zkušební doby (§ 35 zákoníku práce)</a>.
        </p>
      </section>
    </ArticlePageLayout>
  );
}
