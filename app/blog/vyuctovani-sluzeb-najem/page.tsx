import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import OfficialSources from '@/app/components/blog/OfficialSources';
import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';

const SLUG = 'vyuctovani-sluzeb-najem';

export const metadata = blogArticlePageMetadata(SLUG);

export default function VyuctovaniSluzebNajemPage() {
  return (
    <ArticlePageLayout
      category="Bydlení"
      readTime="6 min"
      dateTime="2026-11-27"
      dateLabel="27. listopadu 2026"
      breadcrumbLabel="Vyúčtování služeb v nájmu"
      slug={SLUG}
      title="Vyúčtování služeb v nájmu 2027: termíny, přeplatky a námitky"
      intro="U kalendářního zúčtovacího období musí pronajímatel vyúčtování služeb za rok 2026 doručit do 30. dubna 2027. Od doručení běží lhůta 30 dnů na písemnou žádost o podklady a zpravidla i na námitky. Finanční vyrovnání má vlastní lhůtu, nejvýše čtyři měsíce od doručení vyúčtování."
      toc={[
        { href: '#terminy', label: 'Termíny doručení a finančního vyrovnání' },
        { href: '#co-zkontrolovat', label: 'Co zkontrolovat a jak podat námitky' },
        { href: '#pausal-a-konec-najmu', label: 'Paušál a skončení nájmu' },
        { href: '#odecty-2027', label: 'Co se od ledna 2027 mění u odečtů' },
      ]}
      trustBox={{
        generatorSuitable: 'Při sjednávání nájmu lze ve smlouvě popsat hrazené služby, výši záloh a způsob jejich placení.',
        lawyerSuitable: 'Spor o splatnost vyššího nedoplatku, opakované odmítnutí podkladů nebo vymáhání pokuty.',
      }}
      finalAction={{
        title: 'Sjednáváte nový nájem bytu?',
        body: 'V nájemní smlouvě uveďte, které služby zajišťuje pronajímatel a jak se platí zálohy.',
        buttonLabel: 'Otevřít formulář nájemní smlouvy',
        href: '/najem',
      }}
      relatedLinks={[
        { href: '/blog/vraceni-kauce-po-skonceni-najmu-2026', label: 'Vrácení kauce při skončení nájmu' },
        { href: '/blog/predavaci-protokol-vzor-2026', label: 'Předávací protokol a odečty při předání bytu' },
        { href: '/blog/najemni-smlouva-vzor-2026', label: 'Co uvést v nájemní smlouvě' },
      ]}
    >
      <section id="terminy" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Kdy musí vyúčtování přijít a kdy se platí</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Pronajímatel jako poskytovatel služeb doručuje nájemci vyúčtování nejpozději do čtyř měsíců od konce
          zúčtovacího období. To může trvat nejvýše 12 měsíců a nemusí začínat 1. ledna. Pokud období skončilo
          31. prosince 2026, termín pro doručení je 30. dubna 2027. Vyúčtování za kalendářní rok 2027 se doručuje
          v roce 2028.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          Pro úhradu nedoplatku nebo vrácení přeplatku platí dohodnutá lhůta, nejvýše však čtyři měsíce od doručení
          vyúčtování. Podle § 7 nemá vada vyúčtování vliv na splatnost přeplatku. U nedoplatku je důležité,
          zda chyba mění vypočtenou částku. Samotné podání námitek splatnost automaticky neposouvá.
        </p>
        <p className="leading-relaxed text-slate-400">
          Při opožděném doručení vyúčtování, neposkytnutí podkladů nebo nevyřízení včasné námitky může vzniknout
          nárok na pokutu podle § 13. Bez jiného ujednání nebo rozhodnutí podle tohoto ustanovení činí
          50 Kč za každý započatý den prodlení. Výjimka platí například tehdy, když zpoždění zavinila druhá strana.
        </p>
      </section>

      <section id="co-zkontrolovat" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Jak vyúčtování zkontrolovat a podat námitky</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Porovnejte vyúčtované období a přijaté zálohy se smlouvou a platbami z účtu. U vody a tepla zkontrolujte
          odečty a období, kterého se týkají. U společných služeb ověřte klíč rozúčtování, například počet
          rozhodných osob nebo rozdělení podle plochy. U každé položky musí být zřejmé, jak se došlo k výsledku.
        </p>
        <ul className="list-disc space-y-2 pl-5 leading-relaxed text-slate-400">
          <li>Do 30 dnů od doručení vyúčtování můžete písemně požádat o doložení nákladů, rozúčtování, stanovení záloh a provedení vyúčtování. Pronajímatel má 30 dnů od doručení žádosti a musí umožnit pořízení kopií podkladů.</li>
          <li>Námitky předložte do 30 dnů od doručení vyúčtování, případně od doložení včas vyžádaných podkladů. Podle § 8 se při zmeškání lhůty má za to, že se způsobem a obsahem vyúčtování souhlasíte.</li>
          <li>Uveďte adresu bytu, vyúčtované období, spornou položku a proč s ní nesouhlasíte. Přiložte doklad a uschovejte potvrzení o doručení. Pronajímatel má na vyřízení včasné námitky 30 dnů od jejího předložení.</li>
        </ul>
        <p className="mt-4 leading-relaxed text-slate-400">
          <strong>Příklad.</strong> Platili jste 12 záloh po 2 500 Kč, ale ve vyúčtování je započteno jen
          27 500 Kč. Pokud výpisy z účtu potvrzují, že všech 12 záloh pronajímatel přijal, měl by součet činit
          30 000 Kč. V námitce označte chybějící platbu a přiložte její potvrzení.
        </p>
      </section>

      <section id="pausal-a-konec-najmu" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Paušál za služby a vyúčtování po odstěhování</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Sjednané zálohy se vyúčtují proti skutečným nákladům. Sjednaný paušál se podle § 9 zpravidla nevyúčtovává.
          U nájmu na dobu neurčitou nebo delší než 24 měsíců se však teplo, centrálně dodávaná teplá voda,
          dodávka vody a odvádění odpadních vod musí vyúčtovat vždy.
        </p>
        <p className="leading-relaxed text-slate-400">
          Při odstěhování uprostřed zúčtovacího období zapište do předávacího protokolu datum a stavy měřidel.
          Pronajímateli nechte kontakt pro pozdější doručení. Samotný konec nájmu neposouvá termín ročního vyúčtování.
          Vrácení jistoty se řídí samostatnými pravidly.
        </p>
      </section>

      <section id="odecty-2027" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">Od ledna 2027 se mění definice dálkového odečtu</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Od 1. ledna 2027 je pro zákon o službách rozhodující, zda lze odečet provést bez vstupu do jednotlivých
          bytů nebo nebytových prostor. To zahrne i některá zařízení, která lze odečíst například z chodby domu.
          Výjimku mají zařízení instalovaná před 1. lednem 2022, která nejsou nastavena alespoň na měsíční dálkový
          odečet. Tuto vlastnost dokládá technická dokumentace.
        </p>
        <p className="leading-relaxed text-slate-400">
          U zařízení splňujících definici se podle § 8a poskytují průběžné informace o spotřebě tepla nebo
          společně připravované teplé vody. Ve výchozím režimu se údaje za kalendářní měsíc doručují do konce
          následujícího měsíce. Průběžná informace o spotřebě doplňuje roční vyúčtování, které porovnává náklady se zálohami.
        </p>
      </section>

      <OfficialSources sources={[
        { label: 'MMR — Zákon o službách č. 67/2013 Sb. a znění pro vyúčtování v roce 2027', href: 'https://www.mmr.gov.cz/cs/ministerstvo/bytova-politika/sluzby-spojene-s-uzivanim-bytu-a-nebytovych-prosto/zakon-o-sluzbach' },
        { label: 'MMR — Znění zákona účinné od 1. ledna 2027, zejména § 2 a § 7 až 9', href: 'https://www.mmr.gov.cz/getmedia/ca3cd7cb-142b-4c80-b207-5f5b787eccaa/zakon-o-sluzbach-ve-zneni-ucinnem-od-01_01_2027.pdf.aspx?ext=.pdf' },
        { label: 'MMR — Platby spojené s nájmem bytu', href: 'https://www.mmr.gov.cz/cs/ministerstvo/bytova-politika/najemni-vztahy/platby-spojene-s-najmem-bytu' },
      ]} />
    </ArticlePageLayout>
  );
}
