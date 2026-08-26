import ArticlePageLayout from '@/app/components/blog/ArticlePageLayout';
import ArticleInlineCta from '@/app/components/blog/ArticleInlineCta';
import { blogArticlePageMetadata } from '@/lib/seo/blog-page-metadata';
import { getBlogHreflangAlternates } from '@/lib/seo/blog-hreflang-clusters';
import { canonicalUrl } from '@/lib/seo/site';

const SLUG = 'vraceni-kauce-po-skonceni-najmu-2026';

export const metadata = {
  ...blogArticlePageMetadata(SLUG, {
    title: 'Vrácení kauce 2026: lhůta, zápočty a úroky',
    description:
      'Jistota (kauce) se vrací při skončení nájmu. Zjistěte lhůtu, co lze započíst, jak fungují úroky podle § 2254 a jak předejít sporu.',
  }),
  alternates: {
    canonical: canonicalUrl(`/blog/${SLUG}`),
    languages: getBlogHreflangAlternates(SLUG),
  },
};

export default function VraceniKaucePage() {
  return (
    <ArticlePageLayout
      category="Bydlení"
      readTime="8 min"
      dateTime="2026-07-29"
      dateLabel="29. července 2026"
      breadcrumbLabel="Vrácení kauce 2026"
      slug="vraceni-kauce-po-skonceni-najmu-2026"
      title="Vrácení kauce po skončení nájmu 2026: kdy ji pronajímatel musí vrátit a jak řešit úroky"
      intro="Jistota (dříve kauce) se skládá při nástupu, ale nejvíc sporů vzniká při jejím vracení. Občanský zákoník stanoví limit jistoty, právo na její vrácení po skončení nájmu i nárok nájemce na úroky. Následující přehled shrnuje, co k tomu říká § 2254 občanského zákoníku a jak se běžným sporům vyhnout."
      toc={[
        { href: '#co-je-jistota', label: 'Co je jistota a jaký platí limit' },
        { href: '#kdy-se-vraci', label: 'Kdy a jak se jistota vrací' },
        { href: '#zapocet', label: 'Co si smí pronajímatel započíst' },
        { href: '#uroky', label: 'Úroky z jistoty' },
        { href: '#jak-predejit-sporum', label: 'Jak předejít sporům' },
      ]}
      primaryAction={{
        title: 'Připravujete nebo ukončujete nájem?',
        body: 'Ve formuláři nájemní smlouvy nastavíte jistotu, služby, dobu nájmu i pravidla předání bytu přehledně na jednom místě.',
        buttonLabel: 'Vytvořit nájemní smlouvu',
        href: '/najem',
      }}
      trustBox={{
        generatorSuitable:
          'Standardní nájem bytu, u kterého se strany dohodly na výši jistoty a potřebují ji spolu s podmínkami vrácení zachytit písemně.',
        lawyerSuitable:
          'Spor o zadržení jistoty vyšší hodnoty, nejasné vyúčtování služeb nebo situace, kdy pronajímatel odmítá jistotu vrátit i po výzvě.',
      }}
      finalAction={{
        title: 'Chcete mít podmínky jistoty jasně ve smlouvě?',
        body: 'Vyplňte nájemní smlouvu online včetně výše jistoty, jejího úročení a pravidel vrácení po skončení nájmu.',
        buttonLabel: 'Otevřít formulář nájemní smlouvy',
        href: '/najem',
      }}
      relatedLinks={[
        { href: '/najem', label: 'Nájemní smlouva - formulář online' },
        { href: '/blog/kauce-pronajem-bytu-2026', label: 'Kauce při pronájmu bytu' },
        { href: '/blog/predani-bytu-najemci-2026', label: 'Předání bytu nájemci' },
        { href: '/blog/vypoved-z-najmu-bytu-2026', label: 'Výpověď z nájmu bytu' },
      ]}
    >
      <section id="co-je-jistota" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">1. Co je jistota a jaký platí limit</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Jistota podle § 2254 občanského zákoníku (v běžné mluvě kauce) je peněžní částka, kterou nájemce
          složí pronajímateli k zajištění nájemného a dalších povinností z nájmu. Nejde o platbu předem, ale
          o zádržnou částku, kterou pronajímatel po skončení nájmu vrací.
        </p>
        <div className="rounded-2xl border border-white/8 bg-[#0c1426] p-5 text-sm leading-7 text-slate-400">
          <ul className="space-y-2">
            <li>• jistota se sjednává písemně v nájemní smlouvě,</li>
            <li>• jistota a případná smluvní pokuta nesmí dohromady přesáhnout trojnásobek měsíčního nájemného,</li>
            <li>• po skončení nájmu má nájemce právo na vrácení jistoty i na úroky z ní.</li>
          </ul>
        </div>
        <p className="mt-4 leading-relaxed text-slate-400">
          Limit tří měsíčních nájmů se počítá ze samotného nájemného, nikoli z nájemného včetně záloh na
          služby. Sjednání vyšší jistoty nemá oporu v zákoně.
        </p>
      </section>

      <section id="kdy-se-vraci" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">2. Kdy a jak se jistota vrací</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Nárok na vrácení jistoty vzniká při skončení nájmu. Zákon výslovně říká, že pronajímatel jistotu
          vrátí nájemci při skončení nájmu. V praxi se vrací bez zbytečného odkladu poté, co nájemce byt
          předá a je zřejmé, zda má pronajímatel proti němu nějaké pohledávky.
        </p>
        <p className="leading-relaxed text-slate-400">
          Pokud část jistoty souvisí se zálohami na služby, ponechávají si pronajímatelé někdy poměrnou část
          do vyúčtování služeb. Zadržení celé jistoty na dlouhé měsíce ale zákonnou oporu nemá a bývá častým
          důvodem sporu. Konkrétní lhůtu i způsob vrácení (na účet, proti podpisu) je proto vhodné sjednat
          přímo ve smlouvě.
        </p>
      </section>

      <ArticleInlineCta
        title="Zachyťte jistotu a její vrácení písemně"
        body="Formulář nájemní smlouvy pomůže nastavit výši jistoty, úročení i lhůtu a způsob jejího vrácení."
        buttonLabel="Pokračovat k nájemní smlouvě"
        href="/najem"
        variant="subtle"
        articleSlug="vraceni-kauce-po-skonceni-najmu-2026"
      />

      <section id="zapocet" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">3. Co si smí pronajímatel započíst</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Při vrácení může pronajímatel proti jistotě započíst to, co mu nájemce z nájmu dluží — například
          neuhrazené nájemné, nedoplatek za služby nebo náhradu prokazatelné škody nad rámec běžného
          opotřebení. Jistota tedy neslouží k úhradě běžného opotřebení bytu, které je součástí obvyklého
          užívání.
        </p>
        <ul className="space-y-3 text-slate-400">
          {[
            'Dlužné nájemné a nedoplatky za služby lze z jistoty odečíst.',
            'Škoda nad rámec běžného opotřebení musí být doložitelná — pomůže předávací protokol a fotografie.',
            'Běžné opotřebení (vyšlapaný koberec, drobné oděrky) není důvod ke krácení jistoty.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1 text-amber-500">•</span><span>{item}</span></li>
          ))}
        </ul>
      </section>

      <section id="uroky" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">4. Úroky z jistoty</h2>
        <p className="mb-4 leading-relaxed text-slate-400">
          Nájemce má podle § 2254 odst. 2 občanského zákoníku právo na úroky z jistoty od jejího poskytnutí
          alespoň ve výši zákonné sazby. Úrok tedy běží po celou dobu, kdy pronajímatel jistotu drží, a
          vyplácí se spolu s vrácením jistoty.
        </p>
        <p className="leading-relaxed text-slate-400">
          Konkrétní výše „zákonné sazby" je v odborné praxi vykládána různě, protože zákon u jistoty
          nestanoví přesné procento. Právě proto se vyplatí výši úroku (nebo způsob jeho výpočtu) sjednat
          přímo ve smlouvě — předejdete tak dohadům při vracení.
        </p>
      </section>

      <section id="jak-predejit-sporum" className="mb-12 scroll-mt-6">
        <h2 className="mb-4 text-2xl font-black tracking-tight text-white">5. Jak předejít sporům při vracení</h2>
        <ul className="space-y-3 text-slate-400">
          {[
            'Je ve smlouvě uvedena přesná výše jistoty a to, že nepřesahuje trojnásobek nájemného?',
            'Je sjednána lhůta a způsob vrácení jistoty po skončení nájmu?',
            'Je jasné, jak se řeší poměrná část do vyúčtování služeb?',
            'Je při nastěhování i vystěhování sepsán předávací protokol se stavem bytu a odečty měřidel?',
            'Je dohodnuta výše nebo způsob výpočtu úroků z jistoty?',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1 text-amber-500">•</span><span>{item}</span></li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-relaxed text-slate-500">
          Zdroj: <a className="text-amber-400 hover:text-amber-300" href="https://www.zakonyprolidi.cz/cs/2012-89" target="_blank" rel="noreferrer">§ 2254 zákona č. 89/2012 Sb., občanský zákoník</a> (jistota při nájmu bytu, její limit, vrácení a úročení).
        </p>
      </section>
    </ArticlePageLayout>
  );
}
