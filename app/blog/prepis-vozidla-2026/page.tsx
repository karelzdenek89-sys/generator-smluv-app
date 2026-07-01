import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata = blogArticlePageMetadata("prepis-vozidla-2026", {
  title: "Přepis vozidla 2026: Na co si dát pozor po podpisu kupní smlouvy",
  description: "Praktický přehled kroků po podpisu kupní smlouvy na vozidlo. Jak přemýšlet o přepisu, proč je důležité mít jasné předání a jaké podklady se hodí připravit předem.",
});


export default function PrepisVozidla2026Page() {
  return (
    <>

      <ArticlePageLayout
        category="Vozidla"
        readTime="7 min"
        dateTime="2026-04-06"
        dateLabel="6. dubna 2026"
        breadcrumbLabel="Přepis vozidla 2026"
        slug="prepis-vozidla-2026"
        title="Přepis vozidla: Na co si dát pozor po podpisu kupní smlouvy"
        intro="Podpis kupní smlouvy není poslední krok. U běžného převodu vozidla bývá praktické promyslet i návaznost na předání auta, klíčů, dokladů a další administrativní kroky, aby mezi stranami nevznikl zmatek."
        toc={[
          { href: '#co-nasleduje', label: 'Co obvykle následuje po podpisu smlouvy' },
          { href: '#proc-resit-predani', label: 'Proč řešit předání ještě před přepisem' },
          { href: '#jak-se-vyhnout-zmatku', label: 'Jak se vyhnout zmatku mezi prodávajícím a kupujícím' },
          { href: '#jaky-produkt-zvolit', label: 'Jakou cestu v produktu zvolit' },
        ]}
        primaryAction={{
          title: 'Potřebujete kupní smlouvu na vozidlo?',
          body: 'Formulář kupní smlouvy s VIN, cenou, datem předání a stavem vozidla — PDF připravené k podpisu.',
          buttonLabel: 'Vytvořit kupní smlouvu na auto',
          href: '/auto',
        }}
        trustBox={{
          generatorSuitable:
            'Běžný převod vozidla, kdy chcete mít jasno, co se děje po podpisu smlouvy a jak na něj navázat přehledným předáním auta a dokladů.',
          lawyerSuitable:
            'Spor o vlastnictví, technický stav, nevyřešené závazky k vozidlu nebo jiné nestandardní okolnosti převodu.',
        }}
        finalAction={{
          title: 'Potřebujete plnou moc k přepisu?',
          body: 'Plná moc s konkrétním vozidlem a úkonem — PDF k podpisu, včetně upozornění na ověření podpisu.',
          buttonLabel: 'Vytvořit plnou moc',
          href: '/plna-moc',
        }}
        relatedLinks={[
          { href: '/auto', label: 'Kupní smlouva na vozidlo — formulář online' },
          { href: '/plna-moc', label: 'Plná moc — formulář online' },
          { href: '/blog/predani-vozidla-kupujicimu-2026', label: 'Jak správně předat vozidlo kupujícímu' },
          { href: '/blog/prepis-auta-online-portal-dopravy-2026', label: 'Přepis auta online — Portál dopravy' },
        ]}
      >
        <section id="co-nasleduje" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co obvykle následuje po podpisu smlouvy</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Po podpisu kupní smlouvy se v běžné situaci řeší hlavně fyzické předání vozidla, klíčů, dokladů a návazné administrativní kroky. To je chvíle, kdy je důležité, aby obě strany měly jasno, co už bylo provedeno a co ještě následuje.
          </p>
          <p className="leading-relaxed text-slate-400">
            I když se strany dohodnou ústně, je praktičtější tyto kroky zachytit přehledně v návaznosti na smlouvu. Pomáhá to omezit pozdější nejasnosti.
          </p>
        </section>

        <section id="proc-resit-predani" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Proč řešit předání ještě před přepisem</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Předání vozidla a přepis spolu souvisejí, ale nejsou to totožné kroky. Pokud není dobře zachyceno, v jakém stavu bylo auto předáno a jaké doklady přešly na kupujícího, může být později obtížné doložit, co už proběhlo a co ne.
          </p>
          <p className="leading-relaxed text-slate-400">
            V běžném převodu je proto vhodné propojit kupní smlouvu s předávacím protokolem a navazujícím potvrzením o převzetí vozidla a dokladů.
          </p>
        </section>

        <section id="jak-se-vyhnout-zmatku" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Jak se vyhnout zmatku mezi prodávajícím a kupujícím</h2>
          <ul className="space-y-3 text-slate-400">
            {[
              'jasně odlišit podpis smlouvy od samotného předání vozidla',
              'zachytit stav tachometru a viditelný stav vozu při předání',
              'písemně potvrdit, jaké doklady a klíče byly předány',
              'mít přehled o tom, které kroky ještě po podpisu následují',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 text-amber-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="jaky-produkt-zvolit" className="mb-12 scroll-mt-6">
          <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Jakou cestu v produktu zvolit</h2>
          <p className="mb-4 leading-relaxed text-slate-400">
            Pokud řešíte jen samotnou kupní smlouvu, může být dostačující samostatný dokument. Pokud ale vedle smlouvy chcete i podklady k předání auta a dokladů, bývá praktičtější sáhnout po širším řešení.
          </p>
          <p className="leading-relaxed text-slate-400">
            Tematický balíček pro prodej vozidla je určen právě pro tuto běžnou situaci. Nejde o jiný typ právní služby, ale o širší standardizovaný výstup s navazujícími podklady.
          </p>
        </section>
      </ArticlePageLayout>
    </>
  );
}
