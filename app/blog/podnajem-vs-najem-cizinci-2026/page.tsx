import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';

export const metadata = blogArticlePageMetadata("podnajem-vs-najem-cizinci-2026", {
  title: "Podnájem vs. nájem pro cizince 2026: rozdíly a rizika",
  description: "Rozdíl mezi nájemní a podnájemní smlouvou pro cizince v ČR 2026. Jaké doklady vyžaduje OAMP a proč chybějící souhlas vlastníka ohrozí vízum.",
});


export default function PodnajemVsNajemCizinciPage() {
  return (
    <ArticlePageLayout
      category="Bydlení"
      readTime="7 min"
      dateTime="2026-05-21"
      dateLabel="21. května 2026"
      breadcrumbLabel="Podnájem vs. nájem cizinci 2026"
      slug="podnajem-vs-najem-cizinci-2026"
      title="Podnájem vs. nájem bytu pro cizince 2026: Jaké jsou rozdíly a jak se vyhnout zamítnutí víza"
      intro="Při hledání bydlení v České republice se cizinci často setkávají se dvěma různými typy smluv: nájemní smlouvou (Lease Agreement) a podnájemní smlouvou (Sublease Agreement). Ačkoliv znějí podobně, z právního hlediska i pro účely pobytového oprávnění na Odboru azylové a migrační politiky (OAMP) Ministerstva vnitra ČR představují zásadní rozdíl. Chyba v typu smlouvy nebo chybějící souhlas vlastníka může vést k okamžitému zamítnutí žádosti o vízum či pobyt."
      toc={[
        { href: '#hlavni-rozdil', label: 'Hlavní rozdíl: Nájem vs. podnájem' },
        { href: '#oamp-pozadavky', label: 'Požadavky OAMP a doklad o ubytování' },
        { href: '#souhlas-vlastnika', label: 'Souhlas vlastníka — kritický bod pro podnájem' },
        { href: '#rozdil-v-pravech', label: 'Rozdíl v právech a ochraně před výpovědí' },
      ]}
      primaryAction={{
        title: 'Řešíte nájem nebo podnájem?',
        body: 'Vygenerujte si právně správnou smlouvu online. Formulář je veden v češtině, angličtině i ukrajinštině a vygeneruje bezchybné české PDF včetně všech zákonných náležitostí.',
        buttonLabel: 'Vybrat typ smlouvy',
        href: '/podnajemni-smlouva',
      }}
      trustBox={{
        generatorSuitable:
          'Nájem bytu nebo podnájem bytu/pokoje se souhlasem vlastníka pro soukromé ubytování a doložení adresy pro úřady.',
        lawyerSuitable:
          'Komerční podnájmy, ubytovny, spory o vyklizení bytu nebo nestandardní ujednání odporující občanskému zákoníku.',
      }}
      finalAction={{
        title: 'Připravte si smlouvu ihned',
        body: 'Vyberte si nájemní či podnájemní smlouvu a vyplňte ji online během několika minut.',
        buttonLabel: 'Začít s vyplňováním',
        href: '/podnajem',
      }}
      relatedLinks={[
        { href: '/podnajemni-smlouva', label: 'Podnájemní smlouva online' },
        { href: '/najemni-smlouva', label: 'Nájemní smlouva online' },
        { href: '/blog/podnajemni-smlouva-2026', label: 'Podnájemní smlouva 2026' },
        { href: '/blog/chyby-pri-pronajmu-bytu-2026', label: 'Chyby při pronájmu bytu' },
      ]}
    >
      <section id="hlavni-rozdil" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Hlavní rozdíl: Nájem vs. podnájem
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Základní rozdíl spočívá v tom, kdo s kým smlouvu uzavírá:
        </p>
        <ul className="mb-6 space-y-3 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">→</span>
            <div>
              <strong className="text-white">Nájemní smlouva (Nájem):</strong> Uzavírá se přímo mezi{' '}
              <strong className="text-slate-300">vlastníkem nemovitosti</strong> a nájemcem. Nájemce získává silnou zákonnou ochranu podle občanského zákoníku.
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500 font-bold">→</span>
            <div>
              <strong className="text-white">Podnájemní smlouva (Podnájem):</strong> Uzavírá se mezi{' '}
              <strong className="text-slate-300">nájemcem bytu</strong> (který má byt pronajatý od vlastníka) a třetí osobou (podnájemcem). Vlastník bytu není přímou stranou této smlouvy.
            </div>
          </li>
        </ul>
        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm text-slate-400 leading-relaxed">
          <strong className="text-blue-400">Příklad:</strong> Pokud si pronajímáte byt od družstva (družstevní byt), družstvo je vlastník, člen družstva je nájemce a vy jste z právního hlediska podnájemce. Smlouva, kterou podepisujete, je podnájemní smlouva.
        </div>
      </section>

      <section id="oamp-pozadavky" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          2. Požadavky OAMP a doklad o ubytování
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Při žádosti o vízum, dlouhodobý pobyt nebo při nahlášení změny adresy na OAMP (Ministerstvo vnitra ČR) musíte předložit formální{' '}
          <strong className="text-slate-300">Doklad o ubytování</strong>. Tímto dokladem může být buď vyplněný formulář s úředně ověřeným podpisem vlastníka, nebo přímo nájemní/podnájemní smlouva.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          Pokud předkládáte nájemní smlouvu uzavřenou s vlastníkem, úředníkům to plně dostačuje. Vlastnictví si OAMP ověří v katastru nemovitostí.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          Pokud však předkládáte <strong className="text-slate-300">podnájemní smlouvu</strong>, úřad vyžaduje doložení celého řetězce smluv a souhlasů. Konkrétně musíte prokázat, že osoba, která vám byt podnajala (nájemce), má k tomu oprávnění od vlastníka.
        </p>
      </section>

      <ArticleInlineCta
        title="Vygenerujte si smlouvu v češtině s cizojazyčným vedením"
        body="OAMP vyžaduje dokumenty v českém jazyce. SmlouvaHned vám umožní vyplnit údaje v angličtině či ukrajinštině, ale výsledné PDF je sestaveno v bezchybné úřední češtině."
        buttonLabel="Vytvořit smlouvu online"
        href="/podnajem"
        variant="subtle"
      />

      <section id="souhlas-vlastnika" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Souhlas vlastníka — kritický bod pro podnájem
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Podle § 2275 občanského zákoníku platí, že pokud nájemce v bytě sám trvale nebydlí, může jej přenechat do podnájmu{' '}
          <strong className="text-slate-300">pouze s písemným souhlasem pronajímatele (vlastníka)</strong>.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          Pokud na OAMP doložíte podnájemní smlouvu, ale <strong className="text-slate-300">nepředložíte písemný souhlas vlastníka</strong> s podnájmem, úřad vaše ubytování neuzná. OAMP vám určí lhůtu k nápravě, a pokud souhlas nedoložíte, vaše žádost o vízum nebo pobyt bude{' '}
          <strong className="text-slate-300">zamítnuta</strong>.
        </p>
        <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-5 text-sm text-slate-400 leading-relaxed mb-4">
          <strong className="text-red-400">⚠️ Pozor:</strong> Podnájem bez písemného souhlasu vlastníka (pokud nájemce v bytě nebydlí) je hrubým porušením nájemní smlouvy. Vlastník může nájemci okamžitě vypovědět nájem, což automaticky ukončí i váš podnájem a budete se muset vystěhovat.
        </div>
      </section>

      <section id="rozdil-v-pravech" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          4. Rozdíl v právech a ochraně před výpovědí
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Kromě vízových záležitostí má typ smlouvy obrovský dopad na vaše jistoty bydlení. Podnájemce má výrazně slabší postavení než nájemce:
        </p>
        <ul className="mb-6 space-y-3 text-slate-400">
          <li className="flex items-start gap-2">
            <strong className="text-white">Žádná zákonná ochrana výpovědních důvodů:</strong> U nájemní smlouvy může pronajímatel dát výpověď jen ze zákonem definovaných důvodů (např. neplacení nájemného). U podnájemní smlouvy si smluvní strany mohou sjednat výpověď z jakéhokoliv důvodu nebo zcela bez udání důvodů.
          </li>
          <li className="flex items-start gap-2">
            <strong className="text-white">Automatický zánik:</strong> Pokud skončí nájemní smlouva mezi vlastníkem a hlavním nájemcem (např. dohodou nebo výpovědí), váš podnájem okamžitě a bez náhrady zaniká. Nemáte žádné právo v bytě zůstat.
          </li>
          <li className="flex items-start gap-2">
            <strong className="text-white">Hlášený pobyt a doklady pro úřady:</strong> U nájmu bývá doložení adresy jednodušší, protože smlouva je přímo s vlastníkem. U podnájmu je potřeba pečlivě doložit, že hlavní nájemce smí byt nebo jeho část dál přenechat, případně přiložit písemný souhlas vlastníka.
          </li>
        </ul>
      </section>
    </ArticlePageLayout>
  );
}
