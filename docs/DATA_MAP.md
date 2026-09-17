# Datová mapa SmlouvaHned 2.0

Úložiště: Upstash Redis (EU). Žádná SQL databáze; „migrace“ = nové, aditivní
klíčové prostory s vlastním TTL. Nic ze stávajících klíčů se nemění ani nemaže.

## Oblasti dat, účel a retence

| Oblast | Klíče | Účel | Právní základ | Retence |
|---|---|---|---|---|
| A. Data dokumentu | `contract:draft:{id}`, `session:draft:{sessionId}`, `orders:email:{email}`, `orders:portal:token:{hash}` | vytvoření a stažení dokumentu | plnění smlouvy | 7 / 30 / 90 dní dle varianty |
| B. Data případu (Moje zakázka) | `case:{caseId}`, `case:owner:{sha256(email)}`, `case:tokens:{caseId}`, `case:access:{sha256(token)}`, `case:reminders:due`, `case:docsession:{sessionId}` | průběh zakázky, návratové odkazy, připomínky, navazující dokumenty | plnění smlouvy | 365 dní od poslední změny; odkazy 30 dní (návrat z platby 7 dní); smazání na žádost kdykoli |
| C. Produktová analytika | `analytics:events`, `analytics:summary:{day}:*` | funnel bez PII | souhlas (cookie lišta) | rolling 5 000 událostí / denní agregace |
| D. Commercial intent | `partner:intent:{id}`, `partner:intent:index` | vyžádaná poptávka služby | souhlas pro konkrétního partnera | 180 dní; kontakt odstraněn ihned po odvolání |
| E. Partner consent + lead | `partner:consent:{id}`, `partner:lead:{id}`, `partner:lead:index` | auditovatelné předání partnerovi | souhlas | 180 dní |
| Newsletter | `newsletter:*` | tipy a novinky (double opt-in) | souhlas | do odvolání |
| Rate limity | `ratelimit:*` | ochrana API | oprávněný zájem | 10 min – 30 dní |
| Webhook idempotence | `webhook:fulfilled:{session}`, `webhook:email-sent:{session}`, `webhook:fulfillment-lock:{session}` | jednorázové plnění | plnění smlouvy | 90 dní / 5 min |

## Co se do jednotlivých oblastí NIKDY nekopíruje

- **B (případ):** obsah smlouvy, jméno/adresa/IČO/kontakt protistrany, download token, Stripe session smlouvy (jen interní `orderSessionId` pro korelaci, klientovi se nevrací).
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
