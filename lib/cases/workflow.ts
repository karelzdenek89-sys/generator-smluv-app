import {
  REMINDER_OFFSETS_DAYS,
  RENTAL_STAGES,
  VEHICLE_STAGES,
  WORK_ORDER_STAGES,
  type AnyCaseStage,
  type CaseDocumentKind,
  type CaseKind,
  type CaseTask,
  type RentalStage,
  type VehicleStage,
  type WorkOrderStage,
} from './types';

export type StageDefinition<S extends AnyCaseStage = AnyCaseStage> = {
  key: S;
  label: string;
  short: string;
  description: string;
  nextSteps: readonly string[];
  documents: readonly CaseDocumentKind[];
  escalation?: string;
};

const WORK_ORDER_ONLY_STAGE_DEFINITIONS: Record<WorkOrderStage, StageDefinition<WorkOrderStage>> = {
  contract_signed: { key: 'contract_signed', label: 'Smlouva uzavřena', short: 'Smlouva', description: 'Smlouva o dílo je podepsaná. Zkontrolujte termín, cenu a způsob plateb a nastavte si připomínky.', nextSteps: ['Uložte podepsanou smlouvu oběma stranám a ověřte, že se shodují všechny přílohy.', 'Nastavte termín dokončení a připomínky předání (30, 14 a 7 dní předem).', 'Dohodněte, jak budete zaznamenávat změny rozsahu — vždy písemně, nikdy jen ústně.'], documents: [] },
  in_progress: { key: 'in_progress', label: 'Realizace', short: 'Realizace', description: 'Dílo se provádí. Každou změnu rozsahu, ceny nebo termínu zachyťte písemně dřív, než se práce provedou.', nextSteps: ['Průběžně kontrolujte plnění milníků a plateb podle smlouvy.', 'Požadavky nad rámec díla řešte změnovým listem nebo potvrzením víceprací před jejich provedením.', 'Blíží-li se termín, připravte předávací protokol a dohodněte termín přejímky.'], documents: ['change_order', 'extra_work_confirmation'] },
  changes: { key: 'changes', label: 'Změny rozsahu a vícepráce', short: 'Změny', description: 'Rozsah díla se mění. Bez písemného odsouhlasení nemá zhotovitel jistotu úhrady víceprací a objednatel nemá jistotu ceny (§ 2620–2622 OZ).', nextSteps: ['Popište, co se mění: rozsah, cena, termín. Uveďte původní a nový stav.', 'Podepište změnový list nebo potvrzení víceprací oběma stranami.', 'Aktualizujte termín dokončení a připomínky, pokud se posouvá.'], documents: ['change_order', 'extra_work_confirmation'] },
  handover: { key: 'handover', label: 'Předání díla', short: 'Předání', description: 'Dílo je hotové nebo se blíží dokončení. Předávací protokol zachytí stav díla, výhrady a začátek záruky.', nextSteps: ['Domluvte termín přejímky a prohlédněte dílo společně.', 'Sepište předávací protokol — bez výhrad, nebo s vadami a lhůtou k odstranění.', 'Zaznamenejte dokončení a uhraďte / vyfakturujte doplatek podle smlouvy.'], documents: ['handover_protocol', 'defect_record'] },
  defects: { key: 'defects', label: 'Vady a jejich odstranění', short: 'Vady', description: 'Po předání se objevily vady. Oznámení vad musí být včasné a konkrétní (§ 2618 OZ), jinak může objednatel o práva z vad přijít.', nextSteps: ['Vady popište co nejpřesněji, přidejte datum zjištění a fotografie.', 'Zašlete zhotoviteli písemné oznámení vad s výzvou k odstranění a přiměřenou lhůtou.', 'Po odstranění vad potvrďte převzetí opravy zápisem.'], documents: ['defect_notice', 'defect_record'], escalation: 'Pokud zhotovitel vady popírá, odmítá je odstranit nebo jde o vyšší hodnotu, může situace vyžadovat individuální právní posouzení.' },
  closed: { key: 'closed', label: 'Uzavřeno', short: 'Uzavřeno', description: 'Zakázka je dokončená, předaná a uhrazená. Dokumenty si uložte po dobu záruky.', nextSteps: ['Archivujte smlouvu, protokoly a doklady o platbách po dobu záruční doby.', 'Pokud plánujete další zakázku, můžete údaje o své straně použít znovu.'], documents: [] },
};

export const RENTAL_STAGE_DEFINITIONS: Record<RentalStage, StageDefinition<RentalStage>> = {
  rental_preparation: { key: 'rental_preparation', label: 'Příprava pronájmu', short: 'Příprava', description: 'Shromážděte podklady, ujasněte si základní podmínky pronájmu a zvolte odpovídající standardizované dokumenty.', nextSteps: ['Připravte údaje potřebné pro nájemní smlouvu.', 'Zkontrolujte stav bytu a vybavení před předáním.', 'Naplánujte datum podpisu a předání.'], documents: [] },
  rental_contract: { key: 'rental_contract', label: 'Nájemní smlouva', short: 'Smlouva', description: 'Nájemní smlouva je připravena nebo se dokončuje. Před podpisem zkontrolujte údaje, přílohy a praktické podmínky předání.', nextSteps: ['Dokončete a zkontrolujte nájemní smlouvu.', 'Připravte podklady k předání bytu.', 'Nastavte datum předání jako další důležitý termín.'], documents: [] },
  rental_handover_in: { key: 'rental_handover_in', label: 'Předání bytu nájemci', short: 'Předání', description: 'Při předání zachyťte stav bytu, vybavení, měřidla, klíče a další praktické skutečnosti, které mají být doložitelné.', nextSteps: ['Projděte checklist předání bytu.', 'Zaznamenejte stav vybavení, měřidel a počet předaných klíčů.', 'Uložte si podepsané podklady k předání.'], documents: [] },
  rental_active: { key: 'rental_active', label: 'Probíhající nájem', short: 'Nájem', description: 'Nájem běží. V případu stačí hlídat důležité termíny a případné změny, které potřebujete zachytit písemně.', nextSteps: ['Uložte si nejbližší důležitý termín nájmu.', 'Případné změny podmínek řešte navazujícím dokumentem.', 'Před koncem nájmu si včas připravte další postup.'], documents: [] },
  rental_change: { key: 'rental_change', label: 'Změna podmínek', short: 'Změna', description: 'Během nájmu se mění některá podmínka. Zachyťte změnu přehledně a oddělte ji od původní smlouvy.', nextSteps: ['Určete, co se mění a od kdy.', 'Připravte odpovídající dodatek nebo jiný navazující dokument.', 'Po dokončení se vraťte do fáze probíhajícího nájmu.'], documents: [] },
  rental_renewal: { key: 'rental_renewal', label: 'Prodloužení nájmu', short: 'Prodloužení', description: 'Blíží se konec sjednané doby a chcete řešit pokračování nájmu. Připravte další krok s předstihem.', nextSteps: ['Ověřte datum konce stávajícího nájmu.', 'Rozhodněte, zda nájem pokračuje a jak se změní podmínky.', 'Připravte písemné prodloužení nebo nový dokument.'], documents: [] },
  rental_ending: { key: 'rental_ending', label: 'Ukončení nájmu', short: 'Ukončení', description: 'Nájem směřuje k ukončení. Připravte si správný administrativní postup, termín převzetí a potřebné podklady.', nextSteps: ['Projít checklist ukončení nájmu.', 'Domluvit termín převzetí bytu.', 'Připravit podklady k vyhodnocení stavu bytu a kauce.'], documents: [], escalation: 'Pokud je ukončení sporné, nájemce neplatí nebo strany nesouhlasí s dalším postupem, může situace vyžadovat individuální právní posouzení.' },
  rental_handover_out: { key: 'rental_handover_out', label: 'Převzetí bytu', short: 'Převzetí', description: 'Při převzetí zaznamenejte aktuální stav bytu, vybavení, měřidla a klíče a porovnejte jej s podklady z počátku nájmu.', nextSteps: ['Zaznamenejte stav bytu a vybavení.', 'Zapište stavy měřidel a převzaté klíče.', 'Navazující vypořádání kauce řešte odděleně a doložitelně.'], documents: [] },
  rental_deposit_settlement: { key: 'rental_deposit_settlement', label: 'Vypořádání kauce', short: 'Kauce', description: 'Po skončení nájmu uzavřete praktické vypořádání kauce a uložte si podklady, na kterých je výsledek založen.', nextSteps: ['Shromážděte podklady potřebné k vypořádání.', 'Zachyťte, jak byla kauce vypořádána.', 'Po dokončení označte případ jako uzavřený.'], documents: [] },
  closed: { key: 'closed', label: 'Uzavřeno', short: 'Uzavřeno', description: 'Pronájem je administrativně uzavřený. Případ slouží už jen jako přehled provedených kroků.', nextSteps: ['Uložte si potřebné dokumenty a podklady mimo pracovní odkaz.', 'Připomínky můžete nechat vypnuté a případ případně smazat.'], documents: [] },
};

export const VEHICLE_STAGE_DEFINITIONS: Record<VehicleStage, StageDefinition<VehicleStage>> = {
  vehicle_preparation: { key: 'vehicle_preparation', label: 'Příprava prodeje nebo koupě', short: 'Příprava', description: 'Shromážděte podklady k vozidlu a ujasněte si roli kupujícího nebo prodávajícího dřív, než dokončíte dokumenty.', nextSteps: ['Projít checklist prodeje nebo koupě auta.', 'Připravit údaje potřebné pro kupní smlouvu.', 'Ujasnit termín předání a kdo zajistí navazující přepis.'], documents: [] },
  vehicle_contract: { key: 'vehicle_contract', label: 'Kupní smlouva', short: 'Smlouva', description: 'Kupní smlouva je připravena nebo se dokončuje. Zkontrolujte údaje o vozidle, stranách a podmínkách převodu.', nextSteps: ['Dokončete a zkontrolujte kupní smlouvu.', 'Připravte podklady k fyzickému předání vozidla.', 'Nastavte datum předání jako další termín.'], documents: [] },
  vehicle_handover: { key: 'vehicle_handover', label: 'Předání vozidla', short: 'Předání', description: 'Při předání zachyťte stav vozidla, klíče, doklady a další předávané položky, aby byl průběh převodu přehledný.', nextSteps: ['Zkontrolujte předávané klíče a doklady.', 'Zaznamenejte stav vozidla při předání.', 'Pokračujte k administrativnímu přepisu vozidla.'], documents: [] },
  vehicle_registration: { key: 'vehicle_registration', label: 'Přepis vozidla', short: 'Přepis', description: 'Fyzické předání je hotové a zbývá dokončit navazující administrativní kroky k převodu vozidla.', nextSteps: ['Projít seznam podkladů potřebných k přepisu.', 'Ověřit, kdo administrativní krok dokončí.', 'Po dokončení změňte stav případu na potvrzení dokončení.'], documents: [] },
  vehicle_confirmation: { key: 'vehicle_confirmation', label: 'Potvrzení dokončení', short: 'Dokončení', description: 'Ověřte, že praktické kroky převodu byly skutečně dokončeny a že máte uložené potřebné podklady.', nextSteps: ['Potvrďte si dokončení přepisu.', 'Uložte kupní a předávací podklady.', 'Pokud není otevřený problém, případ uzavřete.'], documents: [] },
  vehicle_issue: { key: 'vehicle_issue', label: 'Řešení problému po převodu', short: 'Problém', description: 'Po převodu vznikl problém nebo spor. SmlouvaHned zde poskytuje jen orientaci a standardizované podklady, nikoli individuální posouzení.', nextSteps: ['Shromážděte smlouvu, předávací podklady a komunikaci.', 'Popište časovou osu a konkrétní problém pro vlastní evidenci.', 'U složitějšího nebo sporného případu zvažte individuální právní posouzení.'], documents: [], escalation: 'Tato situace může vyžadovat individuální právní posouzení. Zvažte konzultaci s advokátem.' },
  closed: { key: 'closed', label: 'Uzavřeno', short: 'Uzavřeno', description: 'Převod vozidla je dokončený. Případ slouží jako přehled provedených kroků a můžete jej kdykoli smazat.', nextSteps: ['Uložte si potřebné dokumenty mimo pracovní odkaz.', 'Připomínky můžete nechat vypnuté a případ případně smazat.'], documents: [] },
};

export const WORK_ORDER_STAGE_DEFINITIONS: Record<string, StageDefinition> = { ...WORK_ORDER_ONLY_STAGE_DEFINITIONS, ...RENTAL_STAGE_DEFINITIONS, ...VEHICLE_STAGE_DEFINITIONS };
export const WORK_ORDER_STAGE_LIST = WORK_ORDER_STAGES.map((key) => WORK_ORDER_ONLY_STAGE_DEFINITIONS[key]);
export const RENTAL_STAGE_LIST = RENTAL_STAGES.map((key) => RENTAL_STAGE_DEFINITIONS[key]);
export const VEHICLE_STAGE_LIST = VEHICLE_STAGES.map((key) => VEHICLE_STAGE_DEFINITIONS[key]);

export function stagesForKind(kind: CaseKind): readonly AnyCaseStage[] {
  if (kind === 'rental') return RENTAL_STAGES;
  if (kind === 'vehicle_transfer') return VEHICLE_STAGES;
  return WORK_ORDER_STAGES;
}

export function stageDefinitionsForKind(kind: CaseKind): Record<string, StageDefinition> {
  if (kind === 'rental') return RENTAL_STAGE_DEFINITIONS as Record<string, StageDefinition>;
  if (kind === 'vehicle_transfer') return VEHICLE_STAGE_DEFINITIONS as Record<string, StageDefinition>;
  return WORK_ORDER_ONLY_STAGE_DEFINITIONS as Record<string, StageDefinition>;
}

export function getStageDefinition(kind: CaseKind, stage: string): StageDefinition | null { return stageDefinitionsForKind(kind)[stage] ?? null; }
export function initialStageForKind(kind: CaseKind): AnyCaseStage { return kind === 'rental' ? 'rental_preparation' : kind === 'vehicle_transfer' ? 'vehicle_preparation' : 'contract_signed'; }
export function isCaseStage(value: unknown): value is AnyCaseStage { return typeof value === 'string' && [...WORK_ORDER_STAGES, ...RENTAL_STAGES, ...VEHICLE_STAGES].includes(value as never); }
export function isCaseStageForKind(kind: CaseKind, value: unknown): value is AnyCaseStage { return typeof value === 'string' && (stagesForKind(kind) as readonly string[]).includes(value); }
export function stageIndex(stage: string, kind: CaseKind = 'work_order'): number { return (stagesForKind(kind) as readonly string[]).indexOf(stage); }

export function buildDefaultTasks(kind: CaseKind = 'work_order'): CaseTask[] {
  if (kind === 'rental') return [
    { key: 'rental_contract_ready', label: 'Nájemní smlouva připravena a zkontrolována', stage: 'rental_contract', done: false, href: '/najem' },
    { key: 'rental_handover_prepared', label: 'Podklady k předání bytu připraveny', stage: 'rental_handover_in', done: false, href: '/nastroje/checklist-predani-bytu' },
    { key: 'deadline_set', label: 'Nastaven nejbližší důležitý termín', stage: 'rental_active', done: false },
    { key: 'rental_changes_documented', label: 'Změny během nájmu jsou písemně zachyceny', stage: 'rental_change', done: false },
    { key: 'rental_end_prepared', label: 'Připraven postup ukončení a převzetí bytu', stage: 'rental_ending', done: false, href: '/nastroje/checklist-ukonceni-najmu' },
    { key: 'rental_return_recorded', label: 'Stav při převzetí bytu je zaznamenán', stage: 'rental_handover_out', done: false },
    { key: 'rental_deposit_done', label: 'Kauce je vypořádána a podklady uloženy', stage: 'rental_deposit_settlement', done: false, href: '/blog/kauce-pronajem-bytu-2026' },
  ];
  if (kind === 'vehicle_transfer') return [
    { key: 'vehicle_checklist_done', label: 'Prošel jsem checklist prodeje nebo koupě', stage: 'vehicle_preparation', done: false, href: '/nastroje/checklist-prodeje-auta' },
    { key: 'vehicle_contract_ready', label: 'Kupní smlouva je připravena a zkontrolována', stage: 'vehicle_contract', done: false, href: '/auto' },
    { key: 'deadline_set', label: 'Nastaven nejbližší důležitý termín převodu', stage: 'vehicle_handover', done: false },
    { key: 'vehicle_handover_done', label: 'Vozidlo, klíče a doklady jsou předány', stage: 'vehicle_handover', done: false, href: '/blog/predani-vozidla-kupujicimu-2026' },
    { key: 'vehicle_registration_ready', label: 'Podklady k přepisu jsou připraveny', stage: 'vehicle_registration', done: false, href: '/nastroje/prepis-vozidla-co-potrebuji' },
    { key: 'vehicle_registration_done', label: 'Dokončení přepisu je potvrzeno', stage: 'vehicle_confirmation', done: false },
  ];
  return [
    { key: 'contract_archived', label: 'Podepsaná smlouva uložena u obou stran', stage: 'contract_signed', done: false },
    { key: 'deadline_set', label: 'Nastaven termín dokončení a připomínky', stage: 'contract_signed', done: false },
    { key: 'changes_written', label: 'Změny rozsahu řešeny písemně (změnový list / vícepráce)', stage: 'in_progress', done: false, documentKind: 'change_order', href: '/blog/viceprace-smlouva-o-dilo-2026' },
    { key: 'handover_scheduled', label: 'Domluven termín přejímky díla', stage: 'handover', done: false, href: '/nastroje/checklist-predani-zakazky' },
    { key: 'handover_protocol', label: 'Sepsán předávací protokol', stage: 'handover', done: false, documentKind: 'handover_protocol' },
    { key: 'final_payment', label: 'Doplatek uhrazen / vyfakturován podle smlouvy', stage: 'handover', done: false },
    { key: 'defects_resolved', label: 'Vady z předání odstraněny a potvrzeny', stage: 'defects', done: false, documentKind: 'defect_record' },
    { key: 'archived', label: 'Dokumentace archivována po dobu záruky', stage: 'closed', done: false },
  ];
}

export function getRecommendedDocuments(stage: string): readonly CaseDocumentKind[] { return WORK_ORDER_STAGE_DEFINITIONS[stage]?.documents ?? []; }

/** Backward compatible: old callers do not pass `kind`, therefore work_order remains the default. */
export function getOpenTasksForStage(record: { tasks: CaseTask[]; stage: string; kind?: CaseKind }): CaseTask[] {
  const kind = record.kind ?? 'work_order';
  const current = stageIndex(record.stage, kind);
  return record.tasks.filter((task) => !task.done && stageIndex(task.stage, kind) <= current + 1);
}

export type ReminderPlanEntry = { offsetDays: number; dueAt: Date };
export function planReminders(deadlineIso: string, now: Date = new Date()): ReminderPlanEntry[] {
  const deadline = parseIsoDate(deadlineIso);
  if (!deadline) return [];
  const entries: ReminderPlanEntry[] = [];
  for (const offsetDays of [...REMINDER_OFFSETS_DAYS, 1] as number[]) {
    const dueAt = new Date(Date.UTC(deadline.getUTCFullYear(), deadline.getUTCMonth(), deadline.getUTCDate() - offsetDays, 6, 0, 0, 0));
    if (dueAt.getTime() > now.getTime()) entries.push({ offsetDays, dueAt });
  }
  return entries;
}

export function parseIsoDate(value: unknown): Date | null {
  if (typeof value !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  if (Number.isNaN(date.getTime()) || date.getUTCMonth() !== Number(m) - 1 || date.getUTCDate() !== Number(d)) return null;
  return date;
}

export function formatCzechDate(value: string | null | undefined): string {
  const date = parseIsoDate(value);
  return date ? `${date.getUTCDate()}. ${date.getUTCMonth() + 1}. ${date.getUTCFullYear()}` : '—';
}

export function daysUntil(deadlineIso: string | null | undefined, now: Date = new Date()): number | null {
  const deadline = parseIsoDate(deadlineIso);
  if (!deadline) return null;
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((deadline.getTime() - today) / 86_400_000);
}
