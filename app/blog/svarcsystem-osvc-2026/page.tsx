import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';

export const metadata = blogArticlePageMetadata('svarcsystem-osvc-2026', {
  title: 'Švarcsystém 2026: kdy hrozí a jaká jsou rizika',
  description:
    'Co je švarcsystém, jaké znaky závislé práce sleduje inspekce práce a v čem se liší skutečná OSVČ od zastřeného zaměstnance. Praktický průvodce pro OSVČ i odběratele.',
});

export default function SvarcsystemOsvc2026Page() {
  return (
    <ArticlePageLayout
      category="Práce a podnikání"
      readTime="10 min"
      dateTime="2026-05-29"
      dateLabel="29. května 2026"
      dateModified="2026-05-29"
      dateModifiedLabel="29. května 2026"
      breadcrumbLabel="Švarcsystém 2026"
      slug="svarcsystem-osvc-2026"
      title="Švarcsystém 2026: kdy hrozí a jaká jsou rizika"
      intro="Pojem švarcsystém se v posledních letech vrátil do středu pozornosti inspekce práce. Jde o zastírání pracovněprávního vztahu fakturací mezi OSVČ a odběratelem — formálně dva podnikatelé, fakticky zaměstnanec a zaměstnavatel. Tento průvodce shrnuje, jaké znaky kontroly sledují, jaká hrozí sankce a jak v praxi rozlišit zdravou B2B spolupráci od zastřeného zaměstnání."
      toc={[
        { href: '#co-je-svarcsystem', label: 'Co je švarcsystém a kde má kořeny' },
        { href: '#znaky-zavisle-prace', label: 'Znaky závislé práce' },
        { href: '#kdy-osvc-osvc', label: 'Kdy je vztah skutečně B2B' },
        { href: '#rizika', label: 'Rizika pro odběratele i OSVČ' },
        { href: '#jak-postavit-vztah', label: 'Jak postavit spolupráci, aby nebudila pochybnost' },
        { href: '#caste-omyly', label: 'Časté omyly' },
      ]}
      primaryAction={{
        title: 'Sjednáváte spolupráci s OSVČ?',
        body: 'Smlouva o spolupráci nebo smlouva o poskytování služeb od SmlouvaHned obsahuje strukturu, která pomáhá vztah jasně B2B vymezit.',
        buttonLabel: 'Vytvořit smlouvu o spolupráci',
        href: '/spoluprace',
      }}
      finalAction={{
        title: 'B2B smlouva s jasnými hranicemi',
        body: 'Formulář provede vás i protistranu povinnými náležitostmi. PDF získáte ihned.',
        buttonLabel: 'Vytvořit dokument',
        href: '/spoluprace',
      }}
      trustBox={{
        generatorSuitable:
          'Standardní B2B spolupráce — IT služby, marketing, design, konzultace, freelance projekty s konkrétním výstupem. Smlouvy o spolupráci a o poskytování služeb pomáhají vztah jasně vymezit.',
        lawyerSuitable:
          'Probíhající kontrola inspekce práce, hrozící sankce, retrospektivní překvalifikace dlouhodobé spolupráce, řešení dopadů na pojistné a daně. Náročnější otázky kolem řetězení dohod a švarcsystému patří k advokátovi.',
      }}
      relatedLinks={[
        { href: '/spoluprace', label: '🤝 Smlouva o spolupráci — formulář' },
        { href: '/sluzby', label: '💼 Smlouva o poskytování služeb' },
        { href: '/dpp', label: '⚙️ DPP — formulář' },
        { href: '/pracovni', label: '👔 Pracovní smlouva — formulář' },
        { href: '/blog/expat/dependent-work-b2b-czechia-2026-guide-en', label: '🇬🇧 English guide (expats)' },
        { href: '/blog/expat/dependent-work-b2b-czechia-2026-guide-ua', label: '🇺🇦 Український гід' },
        { href: '/blog/smlouva-o-spolupraci-2026', label: '📘 Smlouva o spolupráci — průvodce' },
        { href: '/blog/flexinovela-zakoniku-prace-2026', label: '📘 Flexinovela zákoníku práce' },
        { href: '/blog/dpp-dpc-porovnani-2026', label: '⚖️ DPP nebo DPČ — porovnání' },
        { href: '/slovnik#svarcsystem', label: '📖 Slovník: Švarcsystém' },
      ]}
    >
      <section id="co-je-svarcsystem" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Co je švarcsystém a kde má kořeny
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Švarcsystém je hovorové označení pro situaci, kdy zaměstnavatel zaměstnává osoby
          formálně jako podnikatele (OSVČ), ale fakticky s nimi řídí běžný pracovní vztah —
          dává pokyny, určuje pracovní dobu, kontroluje výsledky. Pojem se odvozuje od jména
          podnikatele Miroslava Švarce z 90. let, jehož stavební společnost takový model
          vedla v širokém měřítku.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          Z hlediska práva jde o porušení zákazu výkonu závislé práce mimo pracovněprávní
          vztah. Zákon o zaměstnanosti i zákoník práce tento zákaz obsahují a sankce za jeho
          porušení patří k nejvyšším v pracovněprávní oblasti.
        </p>
      </section>

      <section id="znaky-zavisle-prace" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          2. Znaky závislé práce
        </h2>
        <p className="mb-5 leading-relaxed text-slate-400">
          Zákoník práce definuje závislou práci jako práci, která je vykonávána ve vztahu
          nadřízenosti zaměstnavatele a podřízenosti zaměstnance, jménem zaměstnavatele,
          podle jeho pokynů a zaměstnanec ji pro něj vykonává osobně. Inspekce práce při
          kontrole sleduje kombinaci znaků — nejde o to, že by jediný znak rozhodl, ale o
          celkový obraz vztahu.
        </p>
        <div className="space-y-3">
          {[
            {
              t: 'Osobní výkon',
              d: 'Práci vykonává konkrétní fyzická osoba, nezastupitelně — odběratele zajímá, kdo přesně práci provede. U skutečné B2B spolupráce může zhotovitel poslat svého kolegu nebo subdodavatele.',
            },
            {
              t: 'Pokyny a kontrola',
              d: 'Odběratel detailně určuje, jak má být práce vykonána, řídí postup, kontroluje průběh, dává operativní pokyny v reálném čase. Skutečná B2B spolupráce má dohodnutý výstup, ne řízený postup.',
            },
            {
              t: 'Pracovní doba a místo',
              d: 'OSVČ má povinnost být v určitý čas na určitém místě, dochází na pracoviště v pracovní době, používá vybavení odběratele. To se nepodobá vztahu nezávislého dodavatele.',
            },
            {
              t: 'Odměna pravidelná, ne za výstup',
              d: 'Pravidelná měsíční fakturace ve stejné výši nezávisle na výsledku se blíží mzdě. B2B vztah typicky platí za konkrétní výstup, projekt, hodiny dle skutečné aktivity nebo dle smluveného milníku.',
            },
            {
              t: 'Jeden hlavní odběratel',
              d: 'OSVČ pracuje fakticky jen pro jednoho zadavatele a většina příjmu pochází z této spolupráce. Sám o sobě neznamená automaticky švarcsystém, ale patří mezi silné indiciální znaky — inspekce posuzuje vztah v souhrnu, ne podle jediného kritéria.',
            },
            {
              t: 'Zákaz konkurence, výhradní vztah',
              d: 'Smlouva zakazuje OSVČ pracovat pro jiné klienty. To se blíží exkluzivitě, kterou má zaměstnanecký poměr.',
            },
            {
              t: 'Dovolená, nemocenská, benefity',
              d: 'Odběratel platí dovolenou nebo nepřítomnost OSVČ, poskytuje stravenky, multisport. Tyto prvky jsou typické pro zaměstnání, ne pro B2B.',
            },
          ].map((i) => (
            <div key={i.t} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
              <div className="mb-1 text-sm font-black text-white">{i.t}</div>
              <p className="text-sm leading-relaxed text-slate-400">{i.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="kdy-osvc-osvc" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Kdy je vztah skutečně B2B
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Skutečnou B2B spolupráci charakterizuje samostatnost dodavatele. V praxi typicky:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Dodavatel rozhoduje, jak práci provede — odběratel dostává výsledek.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Dodavatel má více klientů a aktivně shání další obchod.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Dodavatel nese podnikatelské riziko — pokud výsledek není, nedostane zaplaceno.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Dodavatel používá vlastní pracovní prostředky (notebook, software, nářadí).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Dodavatel pracuje z vlastního pracoviště, není povinen být na konkrétním místě.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Smlouva má jasně vymezený předmět — projekt, výstup, počet hodin, ne neurčité 'bude pomáhat s vývojem".</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>Dodavatel může uzavřít subdodávku nebo poslat zástupce, pokud to dohoda umožňuje.</span>
          </li>
        </ul>
      </section>

      <section id="rizika" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          4. Rizika pro odběratele i OSVČ
        </h2>
        <h3 className="mb-3 text-lg font-black text-white">Pro odběratele (zaměstnavatele)</h3>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-red-500">•</span>
            <span>
              Pokuta za umožnění nelegální práce u právnické osoby nebo podnikající fyzické
              osoby může dosáhnout až <strong className="text-slate-300">10 mil. Kč</strong>,
              s minimem <strong className="text-slate-300">50 000 Kč</strong>. K tomu hrozí
              doměrek pojistného, penále a úroky z prodlení.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-red-500">•</span>
            <span>Doměrek pojistného (sociální, zdravotní) za zaměstnance i zaměstnavatelskou část.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-red-500">•</span>
            <span>Penále a úroky z prodlení od ČSSZ a zdravotních pojišťoven.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-red-500">•</span>
            <span>Retrospektivní překvalifikace — nárok 'bývalého OSVČ" na dovolenou, odstupné, případně nemocenskou.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-red-500">•</span>
            <span>Reputační riziko (kontroly jsou veřejné, pokuty se objevují v registru).</span>
          </li>
        </ul>

        <h3 className="mb-3 text-lg font-black text-white">Pro OSVČ</h3>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-red-500">•</span>
            <span>Pokuty od inspekce práce (nižší než u zaměstnavatele, ale citelné).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-red-500">•</span>
            <span>Daňový dopad — překvalifikace na zaměstnance může vést k doměrkům.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-red-500">•</span>
            <span>Ztráta výhod paušální daně, pokud byla čerpána.</span>
          </li>
        </ul>
      </section>

      <section id="jak-postavit-vztah" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          5. Jak postavit spolupráci, aby nebudila pochybnost
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Hlavní pravidlo: spolupráce musí mít v textu i v praxi známky podnikatelského
          vztahu. Smlouva sama o sobě neochrání před překvalifikací, pokud denní realita
          vypadá jako zaměstnání. Zároveň ale dobře sepsaná smlouva tvoří první obrannou
          linii a usnadňuje vysvětlování při kontrole.
        </p>
        <ol className="space-y-3 text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-black text-amber-400">
              1
            </span>
            <span>
              <strong className="text-slate-300">Jasně definovaný výstup</strong> — smlouva
              popisuje, co má vzniknout (modul softwaru, kampaň, audit), ne 'pomoc s
              běžnými úkoly".
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-black text-amber-400">
              2
            </span>
            <span>
              <strong className="text-slate-300">Cena za výstup, ne za čas</strong> — pokud
              se platí hodinově, ať smlouva jasně říká, že jde o expertní práci s konkrétním
              cílem, ne za přítomnost.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-black text-amber-400">
              3
            </span>
            <span>
              <strong className="text-slate-300">Bez zákazu konkurence</strong> — pokud má
              ujednání o exkluzivitě, ať je časově a obsahově úzce vymezené (např. konkrétní
              projekt, ne globálně).
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-black text-amber-400">
              4
            </span>
            <span>
              <strong className="text-slate-300">Vlastní vybavení a místo</strong> — OSVČ
              pracuje primárně z vlastního prostředí. Pokud je nutné používat vybavení
              odběratele (např. testovací prostředí), ať to smlouva popisuje jako výjimku.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-black text-amber-400">
              5
            </span>
            <span>
              <strong className="text-slate-300">Žádné benefity zaměstnaneckého typu</strong>{' '}
              — stravenky, multisport, dovolená, nemocenská. Pokud má spolupráce trvat dlouhodobě, ať jsou tyto věci řešeny ve výši odměny, ne jako benefit.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-black text-amber-400">
              6
            </span>
            <span>
              <strong className="text-slate-300">Více klientů</strong> — kde to lze, OSVČ
              ať si udržuje portfolio klientů. Jeden klient tvořící většinu příjmů není sám
              o sobě nelegální, ale v kombinaci s pokyny, pevnou pracovní dobou a začleněním
              do týmu zvyšuje riziko překvalifikace.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-black text-amber-400">
              7
            </span>
            <span>
              <strong className="text-slate-300">Možnost substituce</strong> — pokud to dává
              smysl, smlouva umožňuje OSVČ poslat za sebe kolegu nebo subdodávat část práce.
            </span>
          </li>
        </ol>
      </section>

      <section id="caste-omyly" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          6. Časté omyly
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'Máme s OSVČ smlouvu, takže švarc nehrozí.',
              a: 'Inspekce práce posuzuje faktický stav, ne text smlouvy. Smlouva může být psaná dokonale a vztah přesto být závislou prací — a naopak.',
            },
            {
              q: 'Když OSVČ fakturuje, je to B2B.',
              a: 'Fakturace je jen forma platby. Skutečnost rozhoduje, kdo komu dává pokyny, kdo nese riziko, kdo vlastní vybavení a kdo má více klientů.',
            },
            {
              q: 'Pracuje jen pro nás, ale to je v pořádku — má dohodu o exkluzivitě.',
              a: 'Exkluzivita ve spolupráci s jediným odběratelem je jeden z nejsilnějších indikátorů švarcsystému. Pro inspekci to znamená přesný opak ochrany.',
            },
            {
              q: 'OSVČ dochází do kanceláře a má svůj stůl, ale je to jen pohodlí.',
              a: 'Pravidelná docházka na pracoviště v pracovní době a vyhrazené místo má praktický význam, ale zároveň posiluje obraz závislé práce. V kombinaci s dalšími znaky to bývá problém.',
            },
          ].map((c) => (
            <div key={c.q} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
              <div className="mb-2 text-sm font-black text-white">{c.q}</div>
              <p className="text-sm leading-relaxed text-slate-400">{c.a}</p>
            </div>
          ))}
        </div>
      </section>
    </ArticlePageLayout>
  );
}
