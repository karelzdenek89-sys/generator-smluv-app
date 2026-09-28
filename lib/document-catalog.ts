import type { ContractType } from '@/lib/contracts';

/**
 * Katalog 14 dokumentů. Čte ho homepage (ContractGridPremium) i /llms.txt,
 * takže popis služby pro AI vyhledávače se nemůže rozejít s nabídkou na webu.
 */
export type DocumentCatalogEntry = {
  title: string;
  subtitle: string;
  href: string;
  paragraph: string;
  contractType: ContractType;
  tag?: string;
};

/** Pět nejžádanějších dokumentů zvýrazněných na homepage. */
export const FEATURED_DOCUMENTS: readonly DocumentCatalogEntry[] = [
  {
    title: 'Nájemní smlouva',
    subtitle: 'Pronájem bytu nebo domu s kaucí, výpovědními lhůtami a předávacím protokolem.',
    href: '/najem',
    paragraph: '§ 2201 a násl. OZ',
    contractType: 'lease',
    tag: 'Nejoblíbenější',
  },
  {
    title: 'Kupní smlouva na vozidlo',
    subtitle: 'Prodej auta s VIN, stavem tachometru, odpovědností za vady a podmínkami předání.',
    href: '/auto',
    paragraph: '§ 2079 a násl. OZ',
    contractType: 'car_sale',
    tag: 'Populární',
  },
  {
    title: 'DPP — Dohoda o provedení práce',
    subtitle: 'Brigádnická dohoda do 300 hodin ročně s vymezeným druhem práce a odměnou.',
    href: '/dpp',
    paragraph: '§ 75 a násl. ZP',
    contractType: 'dpp',
  },
  {
    title: 'Pracovní smlouva',
    subtitle: 'Vznik pracovního poměru v souladu se zákoníkem práce. Místo, druh práce, plat.',
    href: '/pracovni',
    paragraph: '§ 33 a násl. ZP',
    contractType: 'employment',
  },
  {
    title: 'Smlouva o dílo',
    subtitle: 'Zakázka, cena, termín odevzdání, odpovědnost za vady a postup při reklamaci.',
    href: '/smlouva-o-dilo',
    paragraph: '§ 2586 a násl. OZ',
    contractType: 'work_contract',
  },
];

/** Zbylé dokumenty katalogu. */
export const MORE_DOCUMENTS: readonly DocumentCatalogEntry[] = [
  {
    title: 'Darovací smlouva',
    subtitle: 'Převod peněz, vozidla nebo věci jako dar — pro rodinu i třetí osoby.',
    href: '/darovaci',
    paragraph: '§ 2055 a násl. OZ',
    contractType: 'gift',
  },
  {
    title: 'Podnájemní smlouva',
    subtitle: 'Podnájem části nebo celého bytu se souhlasem pronajímatele.',
    href: '/podnajem',
    paragraph: '§ 2274 a násl. OZ',
    contractType: 'sublease',
  },
  {
    title: 'Kupní smlouva — movitá věc',
    subtitle: 'Prodej elektroniky, nábytku, kola nebo jiné věci. Záruky a podmínky předání.',
    href: '/kupni',
    paragraph: '§ 2079 a násl. OZ',
    contractType: 'general_sale',
  },
  {
    title: 'Smlouva o poskytování služeb',
    subtitle: 'Opakující se nebo jednorázová služba, cena, termíny a sankce za prodlení.',
    href: '/sluzby',
    paragraph: '§ 1746 OZ',
    contractType: 'service',
  },
  {
    title: 'Smlouva o spolupráci',
    subtitle: 'Obchodní spolupráce mezi OSVČ nebo firmami. Plnění, podíly a exit klauzule.',
    href: '/spoluprace',
    paragraph: '§ 1746 OZ',
    contractType: 'cooperation',
  },
  {
    title: 'Zápůjčka (půjčka)',
    subtitle: 'Smlouva o zápůjčce peněz nebo věci se splátkovým kalendářem a úroky.',
    href: '/pujcka',
    paragraph: '§ 2390 a násl. OZ',
    contractType: 'loan',
  },
  {
    title: 'Uznání dluhu',
    subtitle: 'Písemné uznání pohledávky s novým termínem splatnosti — posílí vymahatelnost.',
    href: '/uznani-dluhu',
    paragraph: '§ 2053 OZ',
    contractType: 'debt_acknowledgment',
  },
  {
    title: 'NDA — Dohoda o mlčenlivosti',
    subtitle: 'Ochrana obchodního tajemství, know-how a interních informací.',
    href: '/nda',
    paragraph: '§ 504 OZ',
    contractType: 'nda',
  },
  {
    title: 'Plná moc',
    subtitle: 'Oprávnění jednat jménem jiné osoby — obecná nebo pro konkrétní úkon.',
    href: '/plna-moc',
    paragraph: '§ 441 a násl. OZ',
    contractType: 'power_of_attorney',
  },
];

export const DOCUMENT_CATALOG: readonly DocumentCatalogEntry[] = [
  ...FEATURED_DOCUMENTS,
  ...MORE_DOCUMENTS,
];
