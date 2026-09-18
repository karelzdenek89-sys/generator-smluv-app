import type { ContractType } from '@/lib/contracts';

/**
 * Legislativní radar 2027 — datový model a obsah.
 *
 * Každá položka nese explicitní status, datum účinnosti (pokud existuje),
 * oficiální zdroje a datum poslední kontroly. Návrh zákona se nikdy
 * neprezentuje jako platná úprava: status `proposal` / `in_progress` musí
 * být v UI vidět stejně výrazně jako `in_force`.
 *
 * Obsah je informativní. Nejde o právní poradenství ani o právní službu.
 * Před rozhodnutím ověřte aktuální znění v uvedených zdrojích.
 */

export const LEGAL_CHANGE_STATUSES = ['in_force', 'approved_pending', 'in_progress', 'proposal'] as const;
export type LegalChangeStatus = (typeof LEGAL_CHANGE_STATUSES)[number];

export const LEGAL_CHANGE_STATUS_LABELS: Record<LegalChangeStatus, string> = {
  in_force: 'PLATÍ',
  approved_pending: 'SCHVÁLENO – ČEKÁ NA ÚČINNOST',
  in_progress: 'PROJEDNÁVÁ SE',
  proposal: 'NÁVRH',
};

export const LEGAL_CHANGE_STATUS_DESCRIPTIONS: Record<LegalChangeStatus, string> = {
  in_force: 'Předpis je účinný. Uvedená pravidla dnes platí.',
  approved_pending: 'Předpis byl schválen a vyhlášen, účinnost teprve nastane.',
  in_progress: 'Návrh je v legislativním procesu. Obsah i termíny se mohou změnit.',
  proposal: 'Zatím jen záměr nebo návrh. Nejde o platné právo.',
};

export const LEGAL_AUDIENCES = [
  'employers',
  'self_employed',
  'consumers',
  'drivers',
  'contracts_online',
] as const;
export type LegalAudience = (typeof LEGAL_AUDIENCES)[number];

export type LegalAudienceHub = {
  key: LegalAudience;
  slug: string;
  href: string;
  title: string;
  shortTitle: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  /** Kam z hubu pokračovat k dokumentům nebo nástrojům. */
  nextSteps: readonly { href: string; label: string }[];
};

export const LEGAL_AUDIENCE_HUBS: Record<LegalAudience, LegalAudienceHub> = {
  employers: {
    key: 'employers',
    slug: 'zamestnavatele',
    href: '/zmeny-2027/zamestnavatele',
    title: 'Změny 2027 pro zaměstnavatele',
    shortTitle: 'Zaměstnavatelé',
    description:
      'Minimální mzda, jednotné měsíční hlášení, dohody a pracovní smlouvy — co platí, co se schvaluje a co má zaměstnavatel udělat.',
    metaTitle: 'Změny 2027 pro zaměstnavatele: minimální mzda, JMHZ, dohody',
    metaDescription:
      'Legislativní změny pro zaměstnavatele se statusem (platí / schváleno / projednává se), datem účinnosti a oficiálními zdroji. Co udělat a které dokumenty upravit.',
    nextSteps: [
      { href: '/zamestnavam', label: 'Zaměstnávám — co potřebuji vyřešit' },
      { href: '/nastroje/kontrola-pripravenosti-2027', label: 'Kontrola připravenosti na změny 2027' },
      { href: '/pracovni', label: 'Pracovní smlouva online' },
      { href: '/dpp', label: 'Dohoda o provedení práce online' },
    ],
  },
  self_employed: {
    key: 'self_employed',
    slug: 'osvc-a-podnikatele',
    href: '/zmeny-2027/osvc-a-podnikatele',
    title: 'Změny 2027 pro OSVČ a podnikatele',
    shortTitle: 'OSVČ a podnikatelé',
    description:
      'Minimální zálohy, paušální daň, účetnictví a smluvní vztahy podnikatelů — status, termíny a oficiální zdroje.',
    metaTitle: 'Změny 2027 pro OSVČ: zálohy, paušální daň, účetnictví',
    metaDescription:
      'Legislativní radar pro OSVČ a menší firmy: minimální zálohy na pojistné, paušální daň, nový zákon o účetnictví. Každá změna se statusem, datem a oficiálním zdrojem.',
    nextSteps: [
      { href: '/zakazka', label: 'Řeším zakázku — smlouva o dílo a navazující dokumenty' },
      { href: '/smlouva-o-dilo', label: 'Smlouva o dílo online' },
      { href: '/spoluprace', label: 'Smlouva o spolupráci online' },
    ],
  },
  consumers: {
    key: 'consumers',
    slug: 'spotrebitele',
    href: '/zmeny-2027/spotrebitele',
    title: 'Změny 2027 pro spotřebitele',
    shortTitle: 'Spotřebitelé',
    description:
      'Právo na opravu, delší záruka po opravě, greenwashing a další spotřebitelské změny — co je schválené a co se teprve projednává.',
    metaTitle: 'Změny 2027 pro spotřebitele: právo na opravu a záruka',
    metaDescription:
      'Co se mění pro spotřebitele: novela zákona o ochraně spotřebitele a občanského zákoníku (právo na opravu, záruka po opravě). Status, datum a oficiální zdroje.',
    nextSteps: [
      { href: '/kupni', label: 'Kupní smlouva online' },
      { href: '/blog/odstoupeni-od-smlouvy-2026', label: 'Odstoupení od smlouvy — kdy lze' },
    ],
  },
  drivers: {
    key: 'drivers',
    slug: 'ridici-a-vozidla',
    href: '/zmeny-2027/ridici-a-vozidla',
    title: 'Změny 2027 pro řidiče a vozidla',
    shortTitle: 'Řidiči a vozidla',
    description:
      'Digitální řidičský průkaz, evropská peněženka digitální identity a převod vozidla — co platí a co teprve přijde.',
    metaTitle: 'Změny 2027 pro řidiče: digitální řidičák, převod vozidla',
    metaDescription:
      'Legislativní radar pro řidiče: nová směrnice o řidičských průkazech, digitální identita a dopady na prodej a přepis vozidla. Status a oficiální zdroje.',
    nextSteps: [
      { href: '/prodej-vozidla', label: 'Prodávám nebo kupuji auto' },
      { href: '/nastroje/prepis-vozidla-co-potrebuji', label: 'Přepis vozidla — co potřebuji' },
      { href: '/auto', label: 'Kupní smlouva na vozidlo online' },
    ],
  },
  contracts_online: {
    key: 'contracts_online',
    slug: 'smlouvy-online',
    href: '/zmeny-2027/smlouvy-online',
    title: 'Změny 2027 pro smlouvy online',
    shortTitle: 'Smlouvy online',
    description:
      'Elektronická identita, digitální peněženka a elektronické podepisování — co ovlivní uzavírání smluv na dálku.',
    metaTitle: 'Změny 2027 pro smlouvy online: digitální identita, e-podpis',
    metaDescription:
      'Jak se mění uzavírání smluv online: evropská peněženka digitální identity, elektronický podpis a e-Sbírka. Status, termíny a oficiální zdroje.',
    nextSteps: [
      { href: '/blog/elektronicky-podpis-elegalizace-2026', label: 'Elektronický podpis a eLegalizace' },
      { href: '/#smlouvy', label: 'Vybrat dokument' },
    ],
  },
};

export type LegalSource = {
  label: string;
  href: string;
  /** Kdo zdroj vydává — pomáhá odlišit primární předpis od výkladu úřadu. */
  publisher: 'e-Sbírka' | 'MPSV' | 'ČSSZ' | 'Finanční správa' | 'PSP ČR' | 'MPO' | 'EUR-Lex' | 'Evropská komise' | 'MF ČR';
};

export type LegalChange = {
  key: string;
  title: string;
  audiences: readonly LegalAudience[];
  status: LegalChangeStatus;
  /** ISO datum účinnosti, nebo null, pokud není známo. */
  effectiveFrom: string | null;
  /** Lidsky čitelný termín (např. „od 1. 7. 2026“, „očekává se na podzim 2026“). */
  dateLabel: string;
  summary: string;
  whatChanges: readonly string[];
  whatToDo: readonly string[];
  affectedDocuments: readonly { contractType?: ContractType; href: string; label: string }[];
  sources: readonly LegalSource[];
  /** ISO datum poslední ruční kontroly proti oficiálním zdrojům. */
  verifiedAt: string;
  /** Kdy zobrazit doporučení individuálního posouzení. */
  escalation?: string;
};

const VERIFIED = '2026-09-18';

export const LEGAL_CHANGES: readonly LegalChange[] = [
  {
    key: 'minimalni-mzda-2027',
    title: 'Minimální mzda 2027: 24 900 Kč měsíčně',
    audiences: ['employers', 'self_employed'],
    status: 'approved_pending',
    effectiveFrom: '2027-01-01',
    dateLabel: 'Od 1. 1. 2027; MPSV zveřejnilo částku 7. 9. 2026',
    summary:
      'MPSV 7. 9. 2026 zveřejnilo, že vláda schválila zvýšení minimální mzdy od 1. 1. 2027 na 24 900 Kč měsíčně. Při stanovené týdenní pracovní době 40 hodin odpovídá hodinová sazba 148,30 Kč.',
    whatChanges: [
      'Minimální mzda se určuje valorizačním mechanismem podle § 111 zákoníku práce: predikce průměrné mzdy × koeficient stanovený vládou.',
      'Pro rok 2027 vláda schválila koeficient 0,446; výsledná minimální mzda činí 24 900 Kč měsíčně a 148,30 Kč za hodinu při 40hodinové týdenní pracovní době.',
      'Pro rok 2028 vláda schválila koeficient 0,458; konkrétní částka pro rok 2028 se určí z příslušné predikce průměrné mzdy.',
    ],
    whatToDo: [
      'U pracovních smluv a DPP s hodinovou odměnou zkontrolujte, že od 1. 1. 2027 sazba neklesne pod odpovídající hodinovou minimální mzdu.',
      'Promítněte částku 24 900 Kč do mzdových nastavení a rozpočtů pro rok 2027; u jiného rozsahu týdenní pracovní doby pracujte s příslušně přepočtenou hodinovou sazbou.',
      'Zaručená mzda podle skupin prací v podnikatelské sféře od 1. 1. 2025 neplatí (novela č. 230/2024 Sb.); zaměstnavatelé odměňující platem sledují nejnižší úrovně zaručeného platu.',
    ],
    affectedDocuments: [
      { contractType: 'employment', href: '/pracovni', label: 'Pracovní smlouva' },
      { contractType: 'dpp', href: '/dpp', label: 'Dohoda o provedení práce' },
    ],
    sources: [
      { label: 'MPSV — Minimální mzda v roce 2027 vzroste na 24 900 korun (7. 9. 2026)', href: 'https://mpsv.gov.cz/minimalni-mzda-v-roce-2027-vzroste-na-24-900-korun', publisher: 'MPSV' },
      { label: 'Zákoník práce, § 111 (e-Sbírka)', href: 'https://www.e-sbirka.cz/sb/2006/262', publisher: 'e-Sbírka' },
    ],
    verifiedAt: VERIFIED,
  },
  {
    key: 'jmhz-jednotne-mesicni-hlaseni',
    title: 'Jednotné měsíční hlášení zaměstnavatele (JMHZ)',
    audiences: ['employers'],
    status: 'in_force',
    effectiveFrom: '2026-01-01',
    dateLabel: 'Zákon účinný od 1. 1. 2026; hlavní povinnosti od 1. 4. 2026',
    summary:
      'Zákon č. 323/2025 Sb. zavedl jednotné elektronické měsíční hlášení, které nahrazuje řadu dosavadních výkazů zaměstnavatele vůči ČSSZ, úřadům práce a dalším institucím.',
    whatChanges: [
      'Zaměstnavatel podává jedno souhrnné elektronické hlášení za měsíc místo desítek formulářů.',
      'Hlášení za leden až březen 2026 se podávalo v období od 1. 4. do 30. 6. 2026; od dubna 2026 běží řádný měsíční režim.',
      'Údaje z hlášení sdílejí ČSSZ, Úřad práce a další úřady, což mění i některé navazující oznamovací povinnosti.',
    ],
    whatToDo: [
      'Ověřte, že mzdový software nebo účetní hlášení skutečně odesílá a evidujte potvrzení o podání.',
      'Při nástupu zaměstnance nebo dohodáře držte údaje potřebné pro hlášení (identifikace, druh vztahu, vyměřovací základ).',
      'Sledujte aktuality ČSSZ k JMHZ — technické pokyny se během roku upřesňují.',
    ],
    affectedDocuments: [
      { contractType: 'employment', href: '/pracovni', label: 'Pracovní smlouva' },
      { contractType: 'dpp', href: '/dpp', label: 'Dohoda o provedení práce' },
      { href: '/balicek-zamestnavatel', label: 'Zaměstnavatel Start 2026 (nástupní podklady)' },
    ],
    sources: [
      { label: 'ČSSZ — Co je JMHZ', href: 'https://www.cssz.gov.cz/co-je-jmhz-', publisher: 'ČSSZ' },
      { label: 'ČSSZ — Kdo podává JMH, způsob, lhůty a obsah', href: 'https://www.cssz.gov.cz/kdo-podava-jmh-', publisher: 'ČSSZ' },
      { label: 'MPSV — Legislativní změny účinné od 1. 1. 2026', href: 'https://mpsv.gov.cz/prehledne-legislativni-zmeny-z-gesce-mpsv-ucinne-od-1-ledna-2026', publisher: 'MPSV' },
    ],
    verifiedAt: VERIFIED,
  },
  {
    key: 'dpp-rozhodna-castka-2026',
    title: 'DPP: rozhodná částka pro účast na pojištění 12 000 Kč (2026)',
    audiences: ['employers'],
    status: 'in_force',
    effectiveFrom: '2026-01-01',
    dateLabel: 'Platí pro rok 2026; částka pro rok 2027 bude vyhlášena sdělením MPSV',
    summary:
      'Od 1. 1. 2026 vzniká zaměstnanci na DPP účast na nemocenském (a důchodovém) pojištění při měsíčním příjmu od 12 000 Kč u jednoho zaměstnavatele. Limit 300 hodin ročně zůstává.',
    whatChanges: [
      'Rozhodná částka se odvozuje od průměrné mzdy a pro rok 2026 činí 12 000 Kč (sdělení MPSV).',
      'Při dosažení částky vzniká odvodová povinnost zaměstnavatele i zaměstnance.',
      'Částka pro rok 2027 se vyhlásí na podzim 2026 — sledujte sdělení MPSV.',
    ],
    whatToDo: [
      'V DPP uvádějte odměnu tak, aby bylo zřejmé, zda se očekává překročení rozhodné částky.',
      'Hlídejte součet odměn u jednoho zaměstnavatele za měsíc, nikoli jen hodiny.',
    ],
    affectedDocuments: [{ contractType: 'dpp', href: '/dpp', label: 'Dohoda o provedení práce' }],
    sources: [
      { label: 'MPSV — Legislativní změny účinné od 1. 1. 2026 (sdělení o rozhodné částce)', href: 'https://mpsv.gov.cz/prehledne-legislativni-zmeny-z-gesce-mpsv-ucinne-od-1-ledna-2026', publisher: 'MPSV' },
      { label: 'Zákoník práce, § 75 a násl. (e-Sbírka)', href: 'https://www.e-sbirka.cz/sb/2006/262', publisher: 'e-Sbírka' },
    ],
    verifiedAt: VERIFIED,
  },
  {
    key: 'flexinovela-zakoniku-prace',
    title: 'Flexinovela zákoníku práce (zákon č. 120/2025 Sb.)',
    audiences: ['employers'],
    status: 'in_force',
    effectiveFrom: '2025-06-01',
    dateLabel: 'Účinná od 1. 6. 2025',
    summary:
      'Delší zkušební doba (4 měsíce, u vedoucích 8), výpovědní doba běžící od doručení, nová pravidla pro rodiče a další změny, které ovlivňují text pracovních smluv i ukončení pracovního poměru.',
    whatChanges: [
      'Zkušební doba až 4 měsíce (vedoucí zaměstnanci až 8 měsíců), u poměru na dobu určitou nejvýše polovina sjednané doby.',
      'Výpovědní doba zpravidla začíná běžet dnem doručení výpovědi.',
      'Další změny se týkají např. doručování a práce rodičů malých dětí.',
    ],
    whatToDo: [
      'Starší vzory pracovních smluv porovnejte s novou úpravou zkušební doby a doručování.',
      'Při ukončení pracovního poměru počítejte výpovědní dobu podle nových pravidel.',
    ],
    affectedDocuments: [
      { contractType: 'employment', href: '/pracovni', label: 'Pracovní smlouva' },
      { href: '/blog/flexinovela-zakoniku-prace-2026', label: 'Flexinovela — podrobný průvodce' },
      { href: '/blog/vypovedni-doba-pracovni-pomer-2026', label: 'Výpovědní doba 2026' },
    ],
    sources: [
      { label: 'Zákon č. 120/2025 Sb. (e-Sbírka)', href: 'https://www.e-sbirka.cz/sb/2025/120', publisher: 'e-Sbírka' },
      { label: 'Zákoník práce (e-Sbírka)', href: 'https://www.e-sbirka.cz/sb/2006/262', publisher: 'e-Sbírka' },
    ],
    verifiedAt: VERIFIED,
  },
  {
    key: 'osvc-minimalni-zalohy-35-procent',
    title: 'OSVČ: minimální vyměřovací základ klesá na 35 % průměrné mzdy',
    audiences: ['self_employed'],
    status: 'in_force',
    effectiveFrom: '2026-07-01',
    dateLabel: 'Od 1. 7. 2026 (první záloha za červenec 2026)',
    summary:
      'Novela zákona č. 589/1992 Sb. snižuje minimální měsíční vyměřovací základ OSVČ s hlavní činností ze 40 % na 35 % průměrné mzdy. Minimální záloha na důchodové pojištění klesá z 5 720 Kč na 5 005 Kč.',
    whatChanges: [
      'Minimální záloha na pojistné pro hlavní činnost: do června 2026 5 720 Kč, od července 2026 5 005 Kč.',
      'Změna se neuplatní zpětně; OSVČ, které v lednu až červnu platily minimum, mohou do konce roku 2026 požádat o vrácení části záloh.',
      'Vedlejší činnost má vlastní (nižší) minimum.',
    ],
    whatToDo: [
      'Zkontrolujte předpis záloh od července 2026 v ePortálu ČSSZ.',
      'Pokud jste platili 5 720 Kč a máte nárok na nižší minimum, podejte žádost o vrácení přeplatku.',
    ],
    affectedDocuments: [
      { contractType: 'work_contract', href: '/smlouva-o-dilo', label: 'Smlouva o dílo (OSVČ jako zhotovitel)' },
      { contractType: 'cooperation', href: '/spoluprace', label: 'Smlouva o spolupráci' },
    ],
    sources: [
      { label: 'ČSSZ — Informace pro OSVČ o změně pojistného od 1. 7. 2026', href: 'https://www.cssz.gov.cz/-/informace-pro-osvc-o-zmene-pojistneho-na-duchodove-pojisteni-od-1-7-2026', publisher: 'ČSSZ' },
      { label: 'ČSSZ — Zálohy na pojistné na důchodové pojištění', href: 'https://www.cssz.gov.cz/zalohy-na-pojistne-na-duchodove-pojisteni', publisher: 'ČSSZ' },
    ],
    verifiedAt: VERIFIED,
  },
  {
    key: 'pausalni-dan-2027',
    title: 'Paušální daň: pásma 2026 platí, výše záloh pro rok 2027 se vyhlásí na podzim',
    audiences: ['self_employed'],
    status: 'in_force',
    effectiveFrom: '2026-01-01',
    dateLabel: 'Pro rok 2026 platí; přihlášení nebo změna pásma pro 2027 do 10. 1. 2027',
    summary:
      'Paušální režim zůstává třípásmový. Záloha v prvním pásmu se odvozuje od minimálního pojistného a zdravotního pojištění, proto se mění každý rok. Konkrétní částka pro rok 2027 bude známa po vyhlášení průměrné mzdy pro rok 2027.',
    whatChanges: [
      'Pro rok 2026 se změnila výše zálohy v prvním pásmu; druhé a třetí pásmo zůstaly.',
      'Vstup do režimu nebo změna pásma pro rok 2027 se oznamuje do 10. ledna 2027.',
    ],
    whatToDo: [
      'Před koncem roku 2026 zkontrolujte, zda vám paušální režim a zvolené pásmo stále vyhovují (příjmy, DPH, zaměstnání).',
      'Sledujte oznámení Finanční správy o výši zálohy pro rok 2027.',
    ],
    affectedDocuments: [
      { contractType: 'cooperation', href: '/spoluprace', label: 'Smlouva o spolupráci' },
      { contractType: 'service', href: '/sluzby', label: 'Smlouva o poskytování služeb' },
    ],
    sources: [
      { label: 'Finanční správa — Paušální daň: obecné informace', href: 'https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/pausalni-dan/obecne-informace', publisher: 'Finanční správa' },
      { label: 'Finanční správa — Paušální daň 2026: novinky a termíny', href: 'https://financnisprava.gov.cz/cs/financni-sprava/media-a-verejnost/tiskove-zpravy-gfr/tiskove-zpravy-2025/pausalni-dan-2026-novinky-terminy', publisher: 'Finanční správa' },
    ],
    verifiedAt: VERIFIED,
  },
  {
    key: 'novy-zakon-o-ucetnictvi',
    title: 'Nový zákon o účetnictví (sněmovní tisk 63)',
    audiences: ['self_employed'],
    status: 'in_progress',
    effectiveFrom: null,
    dateLabel: 'V Poslanecké sněmovně; datum účinnosti není dosud jisté',
    summary:
      'Vláda předložila nový zákon o účetnictví Sněmovně 12. 12. 2025 (tisk 63). Po prvním čtení jej garanční rozpočtový výbor přerušil. Dokud není schválen a vyhlášen, platí dosavadní zákon č. 563/1991 Sb.',
    whatChanges: [
      'Návrh přepracovává koncepci účetnictví (účetní jednotky, výkaznictví, návaznost na evropské předpisy).',
      'Konečná podoba i účinnost vzejdou až z dalšího projednávání.',
    ],
    whatToDo: [
      'Zatím není třeba nic měnit; sledujte průběh tisku 63 a informace MF ČR.',
      'Pokud vedete účetnictví (ne daňovou evidenci), počítejte s přechodným obdobím po schválení.',
    ],
    affectedDocuments: [],
    sources: [
      { label: 'PSP ČR — Sněmovní tisk 63 (nový zákon o účetnictví)', href: 'https://www.psp.cz/sqw/historie.sqw?o=10&t=63', publisher: 'PSP ČR' },
      { label: 'Finanční správa — Účetnictví: obecné informace', href: 'https://financnisprava.gov.cz/cs/dane/dane/dan-z-prijmu/ucetnictvi/obecne-informace', publisher: 'Finanční správa' },
    ],
    verifiedAt: VERIFIED,
  },
  {
    key: 'pravo-na-opravu-novela-ochrany-spotrebitele',
    title: 'Právo na opravu a delší záruka po opravě (sněmovní tisk 53)',
    audiences: ['consumers', 'self_employed'],
    status: 'in_progress',
    effectiveFrom: null,
    dateLabel: 'Po 2. čtení ve Sněmovně (24. 6. 2026); čeká na 3. čtení',
    summary:
      'Vládní novela zákona o ochraně spotřebitele a občanského zákoníku provádí směrnici (EU) 2024/1799 o právu na opravu a další evropské předpisy (greenwashing, informace o výrobcích). Zvolí-li spotřebitel při reklamaci opravu, má se záruční doba prodloužit.',
    whatChanges: [
      'Širší práva spotřebitele, pokud si jako nápravu vady zvolí opravu; prodloužení záruční doby po opravě.',
      'Zákaz klamavých ekologických tvrzení a nové informační povinnosti prodejců.',
      'Termíny účinnosti budou známy až po schválení a vyhlášení ve Sbírce.',
    ],
    whatToDo: [
      'Prodejci: připravte reklamační procesy na volbu opravy a evidenci prodloužené záruky.',
      'Spotřebitelé: při reklamaci sledujte, kterou nápravu volíte — ovlivní to délku záruky po schválení novely.',
    ],
    affectedDocuments: [
      { contractType: 'general_sale', href: '/kupni', label: 'Kupní smlouva' },
      { contractType: 'car_sale', href: '/auto', label: 'Kupní smlouva na vozidlo' },
    ],
    sources: [
      { label: 'PSP ČR — Sněmovní tisk 53 (novela z. o ochraně spotřebitele)', href: 'https://www.psp.cz/sqw/historie.sqw?o=10&t=53', publisher: 'PSP ČR' },
      { label: 'MPO — Vláda schválila novelu zákona o ochraně spotřebitele a OZ', href: 'https://mpo.gov.cz/cz/rozcestnik/pro-media/tiskove-zpravy/delsi-zarucni-doba--stopka-pro-klamava-tvrzeni-a-konec-lakovani-nazeleno--vlada-schvalila-novelu-zakona-o-ochrane-spotrebitele-a-obcanskeho-zakoniku--289118/', publisher: 'MPO' },
      { label: 'Směrnice (EU) 2024/1799 o právu na opravu (EUR-Lex)', href: 'https://eur-lex.europa.eu/eli/dir/2024/1799/oj', publisher: 'EUR-Lex' },
    ],
    verifiedAt: VERIFIED,
    escalation: 'Nové povinnosti pro prodejce mohou vyžadovat úpravu obchodních podmínek — u složitějšího sortimentu doporučujeme individuální posouzení.',
  },
  {
    key: 'eudi-penezenka-digitalni-identity',
    title: 'Evropská peněženka digitální identity (nařízení (EU) 2024/1183)',
    audiences: ['contracts_online', 'drivers', 'consumers'],
    status: 'approved_pending',
    effectiveFrom: '2026-12-31',
    dateLabel: 'Nařízení platí od 20. 5. 2024; členské státy mají peněženku zpřístupnit do konce roku 2026',
    summary:
      'Nařízení eIDAS 2.0 ukládá členským státům zpřístupnit občanům evropskou peněženku digitální identity (EUDI Wallet) do konce roku 2026. V Česku na ni navazuje aplikace eDoklady. Od roku 2027 tak lze očekávat širší využití při identifikaci a elektronickém podepisování na dálku.',
    whatChanges: [
      'Jednotný evropský nástroj pro prokazování totožnosti a podepisování online, uznávaný napříč EU.',
      'Poskytovatelé služeb budou moci ověřovat totožnost a přijímat elektronické podpisy z peněženky.',
    ],
    whatToDo: [
      'Při uzavírání smluv na dálku sledujte, zda protistrana může použít kvalifikovaný elektronický podpis — písemná forma tím bude jednodušší.',
      'Zatím platí: prostý elektronický podpis stačí u většiny běžných soukromoprávních smluv, ověřený podpis vyžadují jen vybrané situace (např. převod nemovitosti).',
    ],
    affectedDocuments: [
      { href: '/blog/elektronicky-podpis-elegalizace-2026', label: 'Elektronický podpis a eLegalizace' },
      { contractType: 'power_of_attorney', href: '/plna-moc', label: 'Plná moc' },
    ],
    sources: [
      { label: 'Nařízení (EU) 2024/1183 (EUR-Lex)', href: 'https://eur-lex.europa.eu/legal-content/CS/TXT/?uri=CELEX%3A32024R1183', publisher: 'EUR-Lex' },
      { label: 'Evropská komise — EU Digital Identity Wallet', href: 'https://ec.europa.eu/digital-building-blocks/sites/spaces/EUDIGITALIDENTITYWALLET/pages/694487738/EU+Digital+Identity+Wallet+Home', publisher: 'Evropská komise' },
    ],
    verifiedAt: VERIFIED,
  },
  {
    key: 'smernice-ridicske-prukazy-2025-2205',
    title: 'Nová evropská směrnice o řidičských průkazech (směrnice (EU) 2025/2205)',
    audiences: ['drivers'],
    status: 'approved_pending',
    effectiveFrom: '2029-11-26',
    dateLabel: 'Vyhlášena 5. 11. 2025; transpozice do 26. 11. 2028, použití od 26. 11. 2029',
    summary:
      'Směrnice modernizuje pravidla pro řidičské průkazy v EU: zavádí digitální řidičský průkaz v mobilu uznávaný ve všech členských státech, upravuje pravidla pro začínající řidiče a zdravotní způsobilost. Česko ji musí provést do listopadu 2028.',
    whatChanges: [
      'Digitální řidičský průkaz jako rovnocenná forma, do budoucna v evropské peněžence digitální identity.',
      'Změny pro začínající řidiče a doprovázené řízení podle evropských pravidel.',
      'Vnitrostátní zákon vzejde až z transpozice; do té doby platí dosavadní úprava.',
    ],
    whatToDo: [
      'Pro rok 2027 se v této oblasti nic nemění; sledujte transpoziční návrh Ministerstva dopravy.',
      'Při prodeji nebo koupi auta postupujte podle dnešních pravidel přepisu (viz průvodce).',
    ],
    affectedDocuments: [
      { contractType: 'car_sale', href: '/auto', label: 'Kupní smlouva na vozidlo' },
      { href: '/blog/prepis-vozidla-2026', label: 'Přepis vozidla 2026' },
    ],
    sources: [
      { label: 'Směrnice (EU) 2025/2205 (EUR-Lex)', href: 'https://eur-lex.europa.eu/eli/dir/2025/2205/oj', publisher: 'EUR-Lex' },
      { label: 'Evropská komise — Modernised EU rules on driving licences enter into force', href: 'https://transport.ec.europa.eu/news-events/news/modernised-eu-rules-driving-licences-and-driving-disqualifications-enter-force-2025-11-25_en', publisher: 'Evropská komise' },
    ],
    verifiedAt: VERIFIED,
  },
];

export function getLegalChange(key: string): LegalChange | null {
  return LEGAL_CHANGES.find((change) => change.key === key) ?? null;
}

export function getLegalChangesForAudience(audience: LegalAudience): LegalChange[] {
  const order: Record<LegalChangeStatus, number> = { in_force: 0, approved_pending: 1, in_progress: 2, proposal: 3 };
  return LEGAL_CHANGES.filter((change) => change.audiences.includes(audience)).sort(
    (a, b) => order[a.status] - order[b.status],
  );
}

export function getLegalChangesForContract(contractType: ContractType): LegalChange[] {
  return LEGAL_CHANGES.filter((change) =>
    change.affectedDocuments.some((document) => document.contractType === contractType),
  );
}

export const LEGAL_AUDIENCE_LIST = LEGAL_AUDIENCES.map((key) => LEGAL_AUDIENCE_HUBS[key]);

/** Nejstarší datum kontroly napříč radarem — pro „Právní stav ověřen“. */
export function getRadarVerifiedAt(): string {
  return LEGAL_CHANGES.reduce((oldest, change) => (change.verifiedAt < oldest ? change.verifiedAt : oldest), VERIFIED);
}

/** Položky, které jsou po lhůtě kontroly (90 dní) — pro interní admin. */
export function getLegalChangesNeedingReview(now: Date = new Date(), maxAgeDays = 90): LegalChange[] {
  const threshold = now.getTime() - maxAgeDays * 86_400_000;
  return LEGAL_CHANGES.filter((change) => Date.parse(change.verifiedAt) < threshold);
}
