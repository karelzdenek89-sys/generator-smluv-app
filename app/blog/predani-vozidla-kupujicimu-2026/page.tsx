import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata = blogArticlePageMetadata("predani-vozidla-kupujicimu-2026", {
  title: "Předání vozidla kupujícímu 2026: protokol a doklady",
  description: "Praktický přehled toho, co řešit při předání vozidla kupujícímu. Stav vozu, klíče, technické doklady, příslušenství a proč je vhodné mít vše zachycené písemně.",
});


export default function PredaniVozidlaKupujicimu2026Page() {
  return (
    <>

      <ArticlePageLayout
        category="Vozidla"
        readTime="7 min"
        dateTime="2026-04-06"
        dateLabel="6. dubna 2026"
        breadcrumbLabel="Předání vozidla kupujícímu 2026"
        slug="predani-vozidla-kupujicimu-2026"
        title="Předání vozidla kupujícímu 2026: protokol a doklady"
        intro="Kupní smlouva na vozidlo řeší právní základ převodu. Samotné předání auta ale bývá stejně důležité. Právě v tomto okamžiku se potvrzuje stav vozu, počet klíčů, předané doklady i příslušenství."
        toc={[
          { href: '#proc-predani-sepsat', label: 'Proč zachytit předání vozidla samostatně' },
          { href: '#co-predat', label: 'Co předat spolu s vozidlem' },
          { href: '#predavaci-protokol', label: 'Co má obsahovat předávací protokol k vozidlu' },
          { href: '#kdy-zvolit-balicek', label: 'Kdy stačí smlouva a kdy je praktičtější balíček' },
        ]}
        primaryAction={{
          title: 'Prodáváte nebo kupujete vozidlo?',
          body: 'Kupní smlouva na vozidlo s VIN, cenou, stavem vozu a datem předání — PDF připravené k podpisu.',
          buttonLabel: 'Vytvořit kupní smlouvu na auto',
          href: '/auto',
        }}
        trustBox={{
          generatorSuitable:
            'Standardní převod vozidla mezi dvěma stranami, které se shodly na ceně a chtějí přehledně zachytit smlouvu i předání.',
          lawyerSuitable:
            'Sporný technický stav, zatajované vady, exekuce, zástavy, leasing nebo situace, kdy se strany neshodnou na rozsahu odpovědnosti za vady.',
        }}
        finalAction={{
          title: 'Chcete smlouvu s prvky předávacího protokolu?',
          body: 'Rozšířená kupní smlouva zachytí stav vozidla, klíče, doklady a datum předání — PDF k podpisu.',
          buttonLabel: 'Otevřít formulář kupní smlouvy',
          href: '/auto',
        }}
        relatedLinks={[
          { href: '/auto', label: 'Kupní smlouva na vozidlo — formulář online' },
          { href: '/blog/predavaci-protokol-vzor-2026', label: 'Předávací protokol — průvodce' },
          { href: '/blog/kupni-smlouva-auto-kupujici-2026', label: 'Kupní smlouva pro kupujícího' },
          { href: '/blog/doklady-pri-prodeji-auta-2026', label: 'Jaké doklady předat při prodeji auta' },
        ]}
      >
        <section id="proc-predani-sepsat" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Proč zachytit předání vozidla samostatně</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Pokud se po podpisu smlouvy objeví spor, bývá důležité vědět nejen to, co bylo ve smlouvě, ale i v jakém stavu bylo auto skutečně předáno. U ojetých vozů se to týká hlavně tachometru, viditelných vad, výbavy a dokladů.
          </p>
          <p className="leading-relaxed text-slate-400">
            Samostatný podklad k předání pomáhá oběma stranám. Prodávající může doložit, v jakém stavu vozidlo předal, a kupující má jasně zachyceno, co všechno převzal.
          </p>
        </section>

        <section id="co-predat" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Co předat spolu s vozidlem</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Klíče a ovladače', 'Počet klíčů, dálkových ovladačů, servisních klíčů nebo zabezpečovacích prvků.'],
              ['Doklady', 'Technické doklady, protokoly k STK nebo dalším kontrolám, servisní knížka a další relevantní podklady.'],
              ['Příslušenství', 'Náhradní kola, povinná výbava, nabíječka, střešní nosiče nebo další předávané vybavení.'],
              ['Stav vozidla', 'Stav tachometru, viditelné vady, poškození karoserie nebo interiéru a další důležité poznámky.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-xl border border-white/8 bg-[#0c1426] p-4">
                <div className="mb-1 text-sm font-black text-white">{title}</div>
                <p className="text-sm leading-7 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="predavaci-protokol" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Co má obsahovat předávací protokol k vozidlu</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            V běžné situaci dává smysl, aby protokol navazoval na kupní smlouvu a obsahoval minimálně identifikaci vozidla, datum předání, stav tachometru, výčet předaných klíčů a dokladů a prostor pro podpis obou stran.
          </p>
          <p className="leading-relaxed text-slate-400">
            Užitečné bývá doplnit i stručný popis zjevného stavu vozidla. Ne proto, aby se vytvářel rozsáhlý znalecký dokument, ale aby bylo jasné, co bylo při předání zjevné a co bylo součástí dohody.
          </p>
        </section>

        <section id="kdy-zvolit-balicek" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Kdy stačí smlouva a kdy je praktičtější balíček</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Pokud řešíte jednoduchý převod a stačí vám samotná kupní smlouva, dává smysl zůstat u samostatného dokumentu. Pokud ale chcete vedle smlouvy i podklady k fyzickému předání auta a dokladů, bývá praktičtější zvolit tematický balíček.
          </p>
          <p className="leading-relaxed text-slate-400">
            Tematický balíček na SmlouvaHned není jiný typ služby. Je to širší standardizované řešení pro běžný převod vozidla, kdy vedle samotné smlouvy řešíte i praktickou stránku předání.
          </p>
        </section>
      </ArticlePageLayout>
    </>
  );
}
