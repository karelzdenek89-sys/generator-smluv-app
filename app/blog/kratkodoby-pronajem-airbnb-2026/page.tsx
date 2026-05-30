import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';

export const metadata = blogArticlePageMetadata('kratkodoby-pronajem-airbnb-2026', {
  title: 'Krátkodobý pronájem bytu a Airbnb 2026: Co sjednat ve smlouvě',
  description:
    'Krátkodobé ubytování přes Airbnb nebo Booking — podnájem, ubytovací služba nebo porušení účelu nájmu. Co ve smlouvě výslovně upravit a proč nestačí ústní dohoda.',
});

export default function KratkodobyPronajemAirbnb2026Page() {
  return (
    <ArticlePageLayout
      category="Bydlení"
      readTime="7 min"
      dateTime="2026-05-29"
      dateLabel="29. května 2026"
      breadcrumbLabel="Krátkodobý pronájem a Airbnb 2026"
      slug="kratkodoby-pronajem-airbnb-2026"
      title="Krátkodobý pronájem bytu a Airbnb 2026: Co sjednat ve smlouvě"
      intro="Krátkodobé přenechávání bytu hostům přes Airbnb, Booking nebo podobné platformy může být z pohledu vztahu nájemce a pronajímatele posuzováno jako přenechání bytu třetím osobám, podnájem nebo porušení účelu nájmu. Vztah mezi provozovatelem a hostem ale nemusí být klasický nájem — často se blíží ubytovací službě. Judikatura upozorňuje, že krátkodobé ubytování nemusí naplňovat účel bydlení, ale spíše ubytovací potřebu. Tento průvodce shrnuje, co je vhodné mít ve smlouvě sepsané, jaká rizika hrozí a proč nestačí ústní domluva."
      toc={[
        { href: '#co-je-kratkodoby', label: 'Airbnb není vždy jen podnájem' },
        { href: '#proc-smlouva', label: 'Proč nestačí ústní dohoda' },
        { href: '#co-upravit', label: 'Co ve smlouvě výslovně upravit' },
        { href: '#povinnosti-provozovatele', label: 'Provozní a registrační povinnosti' },
        { href: '#rizika', label: 'Rizika pro pronajímatele i nájemce' },
        { href: '#caste-chyby', label: 'Nejčastější chyby' },
      ]}
      primaryAction={{
        title: 'Připravujete nájemní smlouvu?',
        body: 'Formulář SmlouvaHned umožní výslovně povolit nebo zakázat krátkodobý podnájem (Airbnb) a doplnit pravidla užívání bytu.',
        buttonLabel: 'Vytvořit nájemní smlouvu',
        href: '/najem',
      }}
      trustBox={{
        generatorSuitable:
          'Standardní pronájem bytu, kde chcete jasně upravit podnájem, krátkodobé ubytování, kauci, pravidla pro hosty a odpovědnost za škody.',
        lawyerSuitable:
          'Spory o neoprávněný podnájem, pokuty od správce domu nebo obce, kombinace s podnájemní smlouvou třetí úrovně, komerční pronájmy nebo bytové jednotky v památkových zónách s omezením.',
      }}
      finalAction={{
        title: 'Potřebujete i předávací protokol a potvrzení o kauci?',
        body: 'Balíček pro pronajímatele (299 Kč) kombinuje nájemní smlouvu s podklady k předání bytu — typicky pro nový pronájem od základu.',
        buttonLabel: 'Otevřít balíček pro pronajímatele',
        href: '/balicek-pronajimatel',
      }}
      relatedLinks={[
        { href: '/najem', label: 'Nájemní smlouva — formulář' },
        { href: '/podnajem', label: 'Podnájemní smlouva — formulář' },
        { href: '/blog/expat/short-term-rental-airbnb-czechia-2026-guide-en', label: '🇬🇧 English guide (expats)' },
        { href: '/blog/expat/short-term-rental-airbnb-czechia-2026-guide-ua', label: '🇺🇦 Український гід' },
        { href: '/blog/najemni-smlouva-vzor-2026', label: 'Nájemní smlouva 2026 — průvodce' },
        { href: '/blog/podnajemni-smlouva-2026', label: 'Podnájemní smlouva — průvodce' },
        { href: '/blog/chyby-pri-pronajmu-bytu-2026', label: 'Chyby při pronájmu bytu' },
      ]}
    >
      <section id="co-je-kratkodoby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          1. Airbnb není vždy jen podnájem
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Krátkodobé přenechávání bytu přes platformy typu Airbnb může být z pohledu vztahu
          nájemce–pronajímatel posuzováno jako přenechání bytu třetím osobám nebo porušení
          účelu nájmu. Záleží na tom, kdo byt nabízí, komu, v jakém rozsahu a za jakým
          účelem. Vztah mezi provozovatelem a hostem ale nemusí být klasický nájem; často se
          blíží ubytovací službě.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          Pokud nájemce byt pronajímá dál, může jít o podnájem podle § 2274 občanského
          zákoníku — ten obvykle vyžaduje souhlas pronajímatele, pokud smlouva nestanoví
          jinak. Pokud nájemce sám provozuje krátkodobé ubytování hostů, může být posuzován
          jinak: jako porušení smluveného účelu nájmu (bydlení vs. ubytovací provoz) nebo
          jako provoz, který podléhá dalším pravidlům pro ubytovací služby.
        </p>
        <p className="mb-4 leading-relaxed text-slate-400">
          Soudní praxe upozorňuje, že krátkodobé ubytování přes platformy nemusí naplňovat
          účel bydlení, ale spíše ubytovací potřebu. Nejvyšší soud se v minulosti zabýval i
          výpovědí nájemci, který byt využíval ke krátkodobému ubytování přes Airbnb nebo
          Booking — výsledek závisí na konkrétních okolnostech a znění smlouvy.
        </p>
        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm leading-relaxed text-slate-400">
          <strong className="text-blue-400">Pozn.:</strong> Tento článek nerozhoduje, zda
          konkrétní případ je podnájem, ubytovací služba nebo porušení nájmu. U sporných
          situací nebo opakovaného provozu více bytů je vhodná konzultace s advokátem.
        </div>
      </section>

      <section id="proc-smlouva" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          2. Proč nestačí ústní dohoda
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          U nájmu bytu zákon vyžaduje písemnou formu. V praxi je písemná smlouva zásadní
          hlavně kvůli důkazům o tom, co bylo sjednáno — nájemné, doba nájmu, zákaz nebo
          povolení podnájmu a pravidla užívání bytu. I u kratších nájmů je písemná smlouva
          praktickým standardem, protože bez ní je těžké prokázat, co strany sjednaly.
        </p>
        <ul className="space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              Ústní zákaz podnájmu se v sporu obtížně dokazuje — stačí, že nájemce popře,
              že souhlasil s omezením.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              Platforma (Airbnb apod.) není smluvní strana nájmu — vztah mezi pronajímatelem
              a nájemcem řeší jen nájemní smlouva.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>
              Správce domu nebo SVJ často vychází z nájemní smlouvy a domovního řádu; bez
              jasné úpravy hrozí stížnosti sousedů a sankce vůči vlastníkovi.
            </span>
          </li>
        </ul>
      </section>

      <section id="co-upravit" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          3. Co ve smlouvě výslovně upravit
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Pro pronajímatele bývá nejbezpečnější varianta výslovný zákaz přenechávání bytu
          třetím osobám za úplatu, včetně krátkodobého ubytování přes online platformy,
          pokud to nechce povolit. Pokud podnájem nebo krátkodobé ubytování povolujete,
          smlouva by měla obsahovat alespoň:
        </p>
        <ul className="mb-5 space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>rozsah povoleného podnájmu (celý byt / jen pokoj, max. počet hostů),</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>odpovědnost nájemce za škody, hluk a chování hostů,</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>povinnost dodržet domovní řád a pravidla SVJ,</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>možnost ukončení nájmu při opakovaném porušení (smluvní pokuta nebo výpovědní důvod),</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 flex-shrink-0 text-amber-500">•</span>
            <span>informaci, že nájemce odpovídá za plnění povinností provozovatele ubytování, pokud je v dané lokalitě vyžaduje.</span>
          </li>
        </ul>

        <ArticleInlineCta
          title="Nájemní smlouva s úpravou Airbnb"
          body="Ve formuláři lze jedním přepínačem povolit nebo zakázat krátkodobý podnájem a doplnit pravidla užívání — kauci, zvířata, maximální počet osob."
          buttonLabel="Vytvořit nájemní smlouvu"
          href="/najem"
          articleSlug="kratkodoby-pronajem-airbnb-2026"
        />
      </section>

      <section id="povinnosti-provozovatele" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          4. Provozní a registrační povinnosti
        </h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Krátkodobé ubytování hostů může v konkrétní lokalitě podléhat dalším pravidlům —
          například ohlašovací povinnosti hostů u obce, místním poplatkům z pobytu nebo
          požadavkům na evidenční knihu ubytovaných. Rozsah povinností se liší podle typu
          objektu, délky pobytu a vyhlášek obce.
        </p>
        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-5 text-sm leading-relaxed text-slate-400">
          <strong className="text-blue-400">Pozn.:</strong> Tento článek nerozlišuje konkrétní
          režimy ubytovacích služeb ani hotelového typu provozu. U opakovaného krátkodobého
          pronájmu více bytů nebo celých domů bývá v praxi vhodná konzultace s účetním,
          místním úřadem a advokátem — jde často o podnikatelskou činnost, ne jen o běžný nájem.
        </div>
      </section>

      <section id="rizika" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          5. Rizika pro pronajímatele i nájemce
        </h2>
        <div className="space-y-3">
          {[
            {
              t: 'Pro pronajímatele',
              d: 'Vyšší opotřebení bytu, stížnosti sousedů, poškození vybavení, problémy se pojištěním nemovitosti, pokud pojistka krátkodobé podnájmy nepokrývá.',
            },
            {
              t: 'Pro nájemce',
              d: 'Odpovědnost za škody hostů, možnost výpovědi při porušení smlouvy, spory o kauci, sankce od pronajímatele i správce domu.',
            },
            {
              t: 'Pro vlastníka v družstevním nebo SVJ bytě',
              d: 'Stanovy nebo nájem družstevního bytu mohou podnájem omezovat ještě přísněji než občanský zákoník — bez jejich kontroly hrozí porušení vnitřních pravidel.',
            },
          ].map((item) => (
            <div key={item.t} className="rounded-2xl border border-white/8 bg-[#0c1426] p-5">
              <div className="mb-2 text-sm font-black text-white">{item.t}</div>
              <p className="text-sm leading-relaxed text-slate-400">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="caste-chyby" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">
          6. Nejčastější chyby
        </h2>
        <ol className="space-y-3 text-slate-400">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-black text-amber-400">
              1
            </span>
            <span>
              <strong className="text-slate-300">Mlčení smlouvy o krátkodobém ubytování</strong>{' '}
              — vzniká prostor pro spor, zda šlo o dovolené užívání bytu, podnájem, přenechání
              třetím osobám nebo porušení účelu nájmu.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-black text-amber-400">
              2
            </span>
            <span>
              <strong className="text-slate-300">Povolení „pro přátele"</strong> bez vymezení —
              v praxi se snadno rozšíří na komerční pronájem.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-black text-amber-400">
              3
            </span>
            <span>
              <strong className="text-slate-300">Chybějící pravidla pro hosty</strong> — počet
              osob, noční klid, klíče, úklid po odjezdu.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-black text-amber-400">
              4
            </span>
            <span>
              <strong className="text-slate-300">Podnájem bez souhlasu vlastníka</strong> — nájemce
              pronajímá dál byt, který sám nemá v nájmu s povolením podnájmu.
            </span>
          </li>
        </ol>
      </section>
    </ArticlePageLayout>
  );
}
