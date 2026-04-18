'use client';

import Link from 'next/link';

type AccentKey =
  | 'lease' | 'car' | 'gift' | 'work' | 'loan' | 'nda'
  | 'sale' | 'employment' | 'dpp' | 'service' | 'sublease'
  | 'poa' | 'debt' | 'coop';

const accentMap: Record<AccentKey, string> = {
  lease:      'from-amber-500/20 to-yellow-500/5',
  car:        'from-sky-500/20 to-cyan-500/5',
  gift:       'from-emerald-500/20 to-green-500/5',
  work:       'from-fuchsia-500/20 to-purple-500/5',
  loan:       'from-rose-500/20 to-red-500/5',
  nda:        'from-violet-500/20 to-indigo-500/5',
  sale:       'from-teal-500/20 to-cyan-500/5',
  employment: 'from-blue-500/20 to-sky-500/5',
  dpp:        'from-orange-500/20 to-amber-500/5',
  service:    'from-pink-500/20 to-rose-500/5',
  sublease:   'from-yellow-500/20 to-amber-500/5',
  poa:        'from-slate-500/20 to-gray-500/5',
  debt:       'from-red-600/20 to-rose-500/5',
  coop:       'from-lime-500/20 to-green-500/5',
};

interface ContractItem {
  title: string;
  description: string;
  href: string;
  price: string;
  accentKey: AccentKey;
  highlight: string;
  paragraph: string;
  popular?: boolean;
}

interface ContractGroup {
  label: string;
  icon: string;
  desc: string;
  items: ContractItem[];
}

const groups: ContractGroup[] = [
  {
    label: 'Bydlení a nemovitosti',
    icon: '🏠',
    desc: 'Pronájem bytu, domu nebo podnájmu',
    items: [
      {
        title:       'Nájemní smlouva',
        description: 'Pro pronájem bytu nebo domu. Kauce, pravidla pro zvířata a Airbnb, výpovědní lhůty a předávací protokol.',
        href:        '/najem',
        price:       'od 99 Kč',
        accentKey:   'lease',
        highlight:   'Předávací protokol v ceně',
        paragraph:   '§ 2201 a násl. OZ',
        popular:     true,
      },
      {
        title:       'Podnájemní smlouva',
        description: 'Pro podnájem části nebo celého bytu se souhlasem pronajímatele. Kauce a pravidla pro obě strany.',
        href:        '/podnajem',
        price:       'od 99 Kč',
        accentKey:   'sublease',
        highlight:   'Souhlas pronajímatele',
        paragraph:   '§ 2274 a násl. OZ',
      },
    ],
  },
  {
    label: 'Prodej a koupě',
    icon: '🛒',
    desc: 'Prodej vozidla, věcí nebo darování',
    items: [
      {
        title:       'Kupní smlouva na vozidlo',
        description: 'Pro bezpečnější převod auta. Stav vozidla, najeté km, odpovědnost za vady, VIN a podmínky předání.',
        href:        '/auto',
        price:       'od 99 Kč',
        accentKey:   'car',
        highlight:   'Stav, vady, VIN, předání',
        paragraph:   '§ 2079 a násl. OZ',
        popular:     true,
      },
      {
        title:       'Kupní smlouva na věc',
        description: 'Pro prodej elektroniky, nábytku, kola nebo jiné movité věci. Záruky, odpovědnost za vady, podmínky předání.',
        href:        '/kupni',
        price:       'od 99 Kč',
        accentKey:   'sale',
        highlight:   'Vady, záruka, předání',
        paragraph:   '§ 2079 a násl. OZ',
      },
      {
        title:       'Darovací smlouva',
        description: 'Pro převod peněz, auta nebo nemovitosti jako dar. Právně čistý doklad vhodný pro rodinu i osoby mimo příbuzenstvo.',
        href:        '/darovaci',
        price:       'od 99 Kč',
        accentKey:   'gift',
        highlight:   'Peníze, auto i nemovitost',
        paragraph:   '§ 2055 a násl. OZ',
      },
    ],
  },
  {
    label: 'Podnikatelé a OSVČ',
    icon: '💼',
    desc: 'Zakázky, spolupráce a ochrana know-how',
    items: [
      {
        title:       'Smlouva o dílo',
        description: 'Pro dohodu o zhotovení mezi řemeslníkem a objednatelem. Cena, termín, předání, sankce za prodlení.',
        href:        '/smlouva-o-dilo',
        price:       'od 99 Kč',
        accentKey:   'work',
        highlight:   'Termíny, sankce, předání',
        paragraph:   '§ 2586 a násl. OZ',
        popular:     true,
      },
      {
        title:       'Smlouva o poskytování služeb',
        description: 'Pro freelancera nebo agenturu poskytující opakované nebo projektové služby. SLA, IP práva, mlčenlivost.',
        href:        '/sluzby',
        price:       'od 99 Kč',
        accentKey:   'service',
        highlight:   'SLA, IP práva, mlčenlivost',
        paragraph:   '§ 1746 odst. 2 OZ',
      },
      {
        title:       'Smlouva o mlčenlivosti (NDA)',
        description: 'Pro sdílení citlivých informací nebo obchodního know-how. Jednostranná nebo oboustranná mlčenlivost.',
        href:        '/nda',
        price:       'od 99 Kč',
        accentKey:   'nda',
        highlight:   'Jednostranná i oboustranná',
        paragraph:   '§ 504 OZ + GDPR',
      },
      {
        title:       'Smlouva o spolupráci',
        description: 'Pro spolupráci OSVČ nebo firem s jasnými pravidly. Podíl na výnosech, IP práva, mlčenlivost, exit.',
        href:        '/spoluprace',
        price:       'od 99 Kč',
        accentKey:   'coop',
        highlight:   'IP, výnosy, exit klauzule',
        paragraph:   '§ 1746 odst. 2 OZ',
      },
    ],
  },
  {
    label: 'Práce a zaměstnání',
    icon: '👔',
    desc: 'Pracovní poměr, brigády a odměny',
    items: [
      {
        title:       'Pracovní smlouva',
        description: 'Pro vznik pracovního poměru. Mzda, pracovní doba, zkušební a výpovědní lhůty — všechny zákonné náležitosti.',
        href:        '/pracovni',
        price:       'od 99 Kč',
        accentKey:   'employment',
        highlight:   'Zákonné náležitosti § 34 ZP',
        paragraph:   '§ 34 zákoníku práce',
      },
      {
        title:       'Dohoda o provedení práce',
        description: 'Pro brigády a jednorázové úkoly do 300 hod./rok. Mimo pravidelný pracovní poměr, s IP doložkou.',
        href:        '/dpp',
        price:       'od 99 Kč',
        accentKey:   'dpp',
        highlight:   'Max. 300 hod./rok',
        paragraph:   '§ 75 zákoníku práce',
      },
    ],
  },
  {
    label: 'Osobní a finanční',
    icon: '⚖️',
    desc: 'Půjčky, závazky a zastoupení',
    items: [
      {
        title:       'Smlouva o zápůjčce',
        description: 'Pro půjčku peněz. Volitelné úročení, splátkový kalendář a možnost zajištění pohledávky.',
        href:        '/pujcka',
        price:       'od 99 Kč',
        accentKey:   'loan',
        highlight:   'Splátky, úroky, zajištění',
        paragraph:   '§ 2390 a násl. OZ',
      },
      {
        title:       'Uznání dluhu',
        description: 'Pro písemné uznání závazku dlužníkem. Obnovuje promlčecí lhůtu na 10 let a posiluje pozici věřitele.',
        href:        '/uznani-dluhu',
        price:       'od 99 Kč',
        accentKey:   'debt',
        highlight:   'Promlčení 10 let',
        paragraph:   '§ 2053 OZ',
      },
      {
        title:       'Plná moc',
        description: 'Pro pověření jiné osoby k zastoupení před úřadem, bankou nebo v obchodní věci. Obecná nebo jednorázová.',
        href:        '/plna-moc',
        price:       'od 99 Kč',
        accentKey:   'poa',
        highlight:   'Ověřená verze pro úřady',
        paragraph:   '§ 441 OZ',
      },
    ],
  },
];

function ContractCard({ contract }: { contract: ContractItem }) {
  return (
    <Link
      href={contract.href}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#0c1426] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
    >
      {/* Popular badge */}
      {contract.popular && (
        <div className="absolute right-4 top-4 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-amber-400">
          Nejčastější
        </div>
      )}

      {/* Hover accent */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${accentMap[contract.accentKey]} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-amber-400">
          {contract.highlight}
        </div>
        <h3 className="mb-1 text-sm font-black tracking-tight text-white leading-snug">
          {contract.title}
        </h3>
        <div className="mb-3 text-[10px] font-medium text-slate-600">
          {contract.paragraph}
        </div>
        <p className="mb-4 flex-grow text-xs leading-relaxed text-slate-400">
          {contract.description}
        </p>

        <div className="mt-auto border-t border-white/8 pt-3 flex items-center justify-end">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-amber-400 transition group-hover:text-amber-300 flex items-center gap-1">
            Vytvořit
            <span className="transition group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ContractCatalog() {
  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <div key={group.label}>
          {/* Group header */}
          <div className="mb-5 flex items-center gap-3">
            <span className="text-xl">{group.icon}</span>
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-300">
                {group.label}
              </h3>
              <p className="text-xs text-slate-600">{group.desc}</p>
            </div>
          </div>

          {/* Cards grid */}
          <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${group.items.length >= 3 ? 'xl:grid-cols-3' : ''}`}>
            {group.items.map((item) => (
              <ContractCard key={item.href} contract={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
