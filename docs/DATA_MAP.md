# Datová mapa SmlouvaHned 2.0

Úložiště: Upstash Redis (EU). Žádná SQL databáze; „migrace“ = nové, aditivní
klíčové prostory s vlastním TTL. Nic ze stávajících klíčů se nemění ani nemaže.

## Oblasti dat, účel a retence

| Oblast | Klíče | Účel | Právní základ | Retence |
|---|---|---|---|---|
| A. Data dokumentu | `contract:draft:{id}`, `session:draft:{sessionId}`, `orders:email:{email}`, `orders:portal:token:{hash}` | vytvoření a stažení dokumentu | plnění smlouvy | 7 / 30 / 90 dní dle varianty |
| B. Data případu (Moje zakázka) | `case:{caseId}`, `case:rev:{caseId}`, `case:seen:{caseId}`, `case:owner:{sha256(email)}`, `case:tokens:{caseId}`, `case:access:{sha256(token)}`, `case:reminders:due`, `case:documents:pending`, `case:docsession:{sessionId}` | průběh zakázky, návratové odkazy, připomínky, navazující dokumenty | plnění smlouvy | 365 dní od poslední změny; uzavřená zakázka 180 dní od `closedAt` (pevný termín); nezaplacený rozpracovaný dokument 30 dní od vytvoření (po lhůtě se nevrací, denní cron jej fyzicky maže); odkazy 30 dní; smazání na žádost kdykoli |
| C. Produktová analytika | `analytics:events`, `analytics:summary:{day}:*` | funnel bez PII | souhlas (cookie lišta) | rolling 5 000 událostí / denní agregace |
| D. Commercial intent | `partner:intent:{id}`, `partner:intent:index` | vyžádaná poptávka služby | souhlas pro konkrétního partnera | 180 dní; kontakt odstraněn ihned po odvolání |
| E. Partner consent + lead | `partner:consent:{id}`, `partner:lead:{id}`, `partner:lead:index` | auditovatelné předání partnerovi | souhlas | 180 dní |
| Newsletter | `newsletter:*` | tipy a novinky (double opt-in) | souhlas | do odvolání |
| Rate limity | `ratelimit:*` | ochrana API | oprávněný zájem | 10 min – 30 dní |
| Webhook idempotence | `webhook:fulfilled:{session}`, `webhook:email-sent:{session}`, `webhook:fulfillment-lock:{session}` | jednorázové plnění | plnění smlouvy | 90 dní / 5 min |

## Co se do jednotlivých oblastí NIKDY nekopíruje

- **B (případ):** obsah smlouvy, adresa/IČO/kontakt protistrany ze smlouvy, download token, Stripe session smlouvy (od 2026-09-17 se `orderSessionId` neukládá vůbec; starší záznamy se při dalším zápisu vyčistí). Jména stran se **ne**přebírají ze smlouvy; ukládají se jen tehdy, když je vlastník sám zadá do navazujícího dokumentu (`documents[].data`).

### Co přesně žije v `case:{caseId}` (revize 2026-09-17)

| Pole | Původ | Osobní údaj? | Nutné? | Retence |
|---|---|---|---|---|
| `ownerEmail` | e-mail z objednávky | ano | ano — návratový odkaz, připomínky | s případem |
| `title` (≤120 zn.) | název díla ze smlouvy | ne (název zakázky) | ano — identifikace v přehledu a e-mailech | s případem |
| `startDate`, `deadline` | termíny ze smlouvy | ne | ano — workflow, připomínky | s případem |
| `priceAmountCzk`, `priceMode` | cena/režim ze smlouvy | ne | ano — kontext platebních milníků | s případem |
| `origin.source/contractType/tier/packageKey` | objednávka | ne | ano — nárok na dokumenty v ceně (Zakázka Plus) | s případem |
| ~~`origin.orderSessionId`~~ | Stripe | ne (identifikátor platby) | **ne** — nikde se nečte | **odstraněno** |
| `documents[].data` | vlastník vyplní do navazujícího dokumentu (jména stran, popis prací, vady) | může být (jména stran) | ano — vstup dokumentu | s případem; **nezaplacený** dokument 30 dní |
| `documents[].snapshot` | sekce dokumentu, název a termín zakázky, verze šablony zmrazené při vytvoření | totéž co `data` | ano — vydaný dokument je neměnný; PDF se renderuje ze snapshotu, ne z aktuálního stavu | s dokumentem |
| `documents[].checkoutAttempts` | počet založených Stripe session | ne | ano — idempotency key `case-doc:{documentId}:{attempt}` | s dokumentem |
| `documents[].checkoutRequest` | přesné parametry nedokončeného Stripe požadavku včetně e-mailu vlastníka, názvu a pevné expirace | ano | ano — bezpečné opakování po výpadku; nevrací se veřejným API ani exportem | do potvrzeného uložení Stripe session, nejdéle s nezaplaceným dokumentem |
| `closedAt` | systém při přechodu do fáze `closed` | ne | ano — pevný termín výmazu uzavřené zakázky | s případem |
| `revision` (`case:rev:*`) | systém | ne | ano — compare-and-set proti souběhu (webhook vs. druhá karta) | s případem |
| `case:seen:*` | systém při otevření | ne | ano — poslední přístup bez přepisu záznamu | s případem |
| `documents[].stripeSessionId` | Stripe (jen placené dokumenty) | ne | ano — úklid `case:docsession:*` při smazání | s případem; klientovi se nevrací |
| `tasks[]` | šablona workflow | ne | ano | s případem |
| `events[]` (≤200, poznámky ≤500 zn.) | systém + poznámky vlastníka | může být (volný text) | ano — historie případu | s případem |
| `reminders[]` | plán připomínek | ne | ano | s případem |
| `createdAt/updatedAt/lastAccessAt/expiresAt` | systém | ne | ano | s případem |

Obsah smlouvy (`contract:draft:*`) se do případu nekopíruje; adresa, IČO ani kontakt protistrany v případu nejsou.
TTL nastavuje `saveCase` podle fáze: `closed` → zbytek do `closedAt + 180 dní` (další zápisy termín neprodlužují), jinak 365 dní od poslední změny; otevření případu retenci neprodlužuje (zapisuje jen `case:seen:*`). Nezaplacené dokumenty po 30 dnech: `getCase` je nevrací, `saveCase` je odstraní a `purgeExpiredPendingDocuments` (denní cron `/api/cron/reminders`) je fyzicky smaže i z netknutých případů.
Údržba zachovává TTL atomicky; starší dokumenty bez indexu dohledává omezený SCAN s kurzorem `case:maintenance:pending-scan` (číselný kurzor bez osobních údajů). Nové zápisy mění index a záznam atomicky.
- **C (analytika):** e-mail, název zakázky, obsah dokumentů, tokeny, session ID; pouze kategoriální klíče (`case_stage`, `document_kind`, `tool_key`, …).
- **D/E (partner):** rodné číslo, číslo OP, plná adresa, obsah dokumentu, údaje protistrany. Kontakt jen v rozsahu polí, ke kterým byl udělen souhlas.

## Protistrana

Údaje protistrany (nájemce, kupující, zaměstnanec, objednatel, zhotovitel)
existují pouze v oblasti A po dobu archivu dokumentu. Default:
`marketing_eligible = false`, `partner_share_allowed = false`. Nikdy se nepoužijí
pro marketing ani partnerský lead.

## Práva subjektu údajů — implementace

| Právo | Implementace |
|---|---|
| Přístup / přenositelnost | `POST /api/cases/export` (JSON bez interních identifikátorů) |
| Výmaz | akce `delete` v Moje zakázka (`/api/cases/update`); automatická expirace TTL |
| Odvolání souhlasu (partner) | `POST /api/partners/intent` s `withdraw: true` → kontakt vymazán, consent `withdrawnAt`, lead `withdrawn` |
| Odhlášení připomínek | přepínač v Moje zakázka (`set_reminders: false`) |
| Revokace přístupu | akce `revoke_links` smaže všechny hash tokeny případu |

## Bezpečnostní logování

Serverové logy obsahují typ chyby, název routy, status a anonymní identifikátory
(`caseId` prefix, idempotency key prefix). Nikdy e-mail, token ani obsah.

## Přístupová oprávnění

- Zákaznická data: pouze přes tokeny (download token, portal token, case token).
- Admin: `/interni/analytics` chráněno `INTERNAL_REPORTING_SECRET` (HMAC cookie);
  zobrazuje pouze agregace a stavy, žádné kontakty.
- Cron: `CRON_SECRET` (Bearer), fail-closed.
