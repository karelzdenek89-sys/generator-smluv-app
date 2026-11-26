import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import OfficialSources from '@/app/components/blog/OfficialSources';
import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';

const SLUG = 'zruseni-pracovniho-pomeru-ve-zkusebni-dobe';

export const metadata = blogArticlePageMetadata(SLUG);

export default function ZruseniVeZkusebniDobePage() {
  return (
    <ArticlePageLayout
      category="Práce a zaměstnání"
      readTime="5 min"
      dateTime="2026-11-27"
      dateLabel="27. listopadu 2026"
      breadcrumbLabel="Zrušení ve zkušební době"
      slug={SLUG}
      title="Zrušení pracovního poměru ve zkušební době v roce 2027"
      intro="Zaměstnanec i zaměstnavatel mohou podle § 66 zákoníku práce zrušit pracovní poměr během zkušební doby písemně a bez uvedení důvodu. Pracovní poměr zpravidla končí doručením. Zaměstnavatel musí navíc respektovat prvních 14 kalendářních dnů pracovní neschopnosti nebo karantény."
      toc={[
        { href: '#kdy-lze-skoncit', label: 'Dokdy lze pracovní poměr zrušit' },
        { href: '#pisemnost-a-doruceni', label: 'Jak sepsat a doručit zrušení' },
        { href: '#pracovni-neschopnost', label: 'Nemoc, karanténa a diskriminace' },
        { href: '#kontrola-a-spor', label: 'Příklad a postup při sporu' },
      ]}
      trustBox={{
        generatorSuitable: 'Při sjednávání nového pracovního poměru lze v pracovní smlouvě zaznamenat délku zkušební doby.',
        lawyerSuitable: 'Spor o den doručení, platnost zrušení, diskriminační důvod nebo konec zkušební doby při dlouhé absenci.',
      }}
      relatedLinks={[
        { href: '/blog/zkusebni-doba-2026', label: 'Délka a prodloužení zkušební doby' },
        { href: '/blog/vypovedni-doba-pracovni-pomer-2026', label: 'Jak běží výpovědní doba' },
        { href: '/pracovni', label: 'Formulář pro novou pracovní smlouvu' },
      ]}
    >
      <section id="kdy-lze-skoncit" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Dokdy lze pracovní poměr zrušit</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Nejdřív ověřte, že byla zkušební doba písemně sjednána a v den doručení ještě běží. Vyjděte z pracovní
          smlouvy, případného písemného prodloužení a rozvrhu směn. Zákon zkušební dobu prodlužuje o pracovní dny,
          kdy zaměstnanec během ní neodpracoval celou směnu kvůli překážce v práci, dovolené nebo neomluvené absenci.
        </p>
        <p className="leading-relaxed text-slate-400">
          Zrušení ve zkušební době je jednostranné a souhlas druhé strany se nevyžaduje. Pracovní poměr končí dnem
          doručení, pokud písemnost neurčuje pozdější den. Při doručování v poslední den si ponechte důkaz
          o doručení. Datum podpisu ani podání zásilky tento okamžik nenahrazuje.
        </p>
      </section>

      <section id="pisemnost-a-doruceni" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Co napsat a jak zrušení doručit</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Uveďte obě strany, identifikujte pracovní poměr a použijte jednoznačnou větu. Například „Podle § 66
          zákoníku práce tímto ruším pracovní poměr sjednaný pracovní smlouvou ze dne [datum].“ Písemnost
          podepište. Chcete-li skončit později než dnem doručení, doplňte zamýšlený den skončení.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          Zaměstnanec může písemnost osobně předat v sídle zaměstnavatele a požádat o písemné potvrzení převzetí.
          Zaměstnavatel doručuje zaměstnanci písemnost do vlastních rukou podle pravidel zákoníku práce. Pro datovou
          schránku, e-mail i doručování poštou platí zvláštní podmínky. Při krátké lhůtě ověřte u zvoleného způsobu
          i to, kdy doručení nabývá účinku.
        </p>
        <p className="leading-relaxed text-slate-400">
          Ústní oznámení pracovní poměr neukončí. U osobního předání si uschovejte potvrzení s datem. Když adresát
          převzetí odmítne, zaznamenejte, kdo byl u předání a kdy a kde proběhlo. Právní účinky odmítnutí závisí na
          způsobu doručování.
        </p>
      </section>

      <section id="pracovni-neschopnost" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Nemoc, karanténa a diskriminace</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Zaměstnavatel nesmí pracovní poměr tímto způsobem zrušit v prvních 14 kalendářních dnech dočasné pracovní
          neschopnosti nebo karantény zaměstnance. Od 15. dne ho může zrušit, pokud zkušební doba stále běží.
          Zaměstnanec sám může pracovní poměr ve zkušební době zrušit i během prvních 14 dnů své neschopnosti.
        </p>
        <p className="leading-relaxed text-slate-400">
          Možnost neuvést důvod nezbavuje zaměstnavatele povinnosti dodržet zákaz diskriminace. Například pokud je
          skutečným důvodem zrušení těhotenství zaměstnankyně, může jít o diskriminační rozvázání pracovního poměru.
        </p>
      </section>

      <section id="kontrola-a-spor" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Příklad doručení a lhůta při sporu</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Je-li posledním dnem zkušební doby 30. červen 2027 a zaměstnanec předá podepsané zrušení zaměstnavateli
          30. června bez uvedení pozdějšího dne, pracovní poměr skončí 30. června. Písemnost odeslaná tentýž den,
          která se doručí až 1. července, podmínku doručení během zkušební doby nesplní.
        </p>
        <p className="leading-relaxed text-slate-400">
          U sporu o neplatnost doručeného zrušení počítejte s krátkou lhůtou. Podle § 72 zákoníku práce se neplatnost
          uplatňuje u soudu nejpozději do dvou měsíců ode dne, kdy měl pracovní poměr skončit. Pokud jste zaměstnanec
          a trváte na dalším zaměstnávání, oznamte to zaměstnavateli bez zbytečného odkladu písemně (§ 69).
        </p>
      </section>

      <OfficialSources sources={[
        { label: 'Zákoník práce, zejména § 35, § 66, § 69, § 72 a § 334 až 337', href: 'https://ppropo.mpsv.cz/zakon_262_2006' },
        { label: 'MPSV — Zrušení pracovního poměru ve zkušební době', href: 'https://ppropo.mpsv.cz/VI4Zrusenipracovnihopomeruvezkus' },
        { label: 'MPSV — Doručování písemností', href: 'https://ppropo.mpsv.cz/XVIIDorucovanipisemnosti' },
        { label: 'Nejvyšší soud — Rozsudek 21 Cdo 2410/2020 k zákazu diskriminace', href: 'https://ppropo.mpsv.cz/JudikatNS21Cdo24102020' },
      ]} />
    </ArticlePageLayout>
  );
}
