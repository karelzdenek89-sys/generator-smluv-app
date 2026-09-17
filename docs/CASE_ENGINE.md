# Case Engine — Moje zakázka

## Účel a hranice

Case Engine je vrstva „PŘÍPAD“ nad generátorem dokumentů: po zaplacení smlouvy
uživatel pokračuje v celé situaci (termíny, fáze, další kroky, připomínky,
navazující dokumenty). Prvním a zatím jediným druhem případu je `work_order`
(zakázka na dílo). Abstrakce (`lib/cases/types.ts`) je připravena pro další druhy
(zaměstnávání, auto, pronájem, dluh), ale bez validace poptávky se nerozšiřuje.

Case Engine **není** ERP, CRM ani účetnictví. Je to právní a dokumentační
vrstva zakázky.

Jednorázový funnel (builder → Stripe → PDF → konec) zůstává beze změny; nabídka
„Pokračovat jako zakázka“ se zobrazí až na success stránce po ověřené platbě
smlouvy o dílo v české lokalizaci.

## Kill switch

`NEXT_PUBLIC_FEATURE_CASE_ENGINE=false` skryje nabídku na success stránce,
sekci Moje zakázka na `/zakazka`, vrátí 404 ze všech `/api/cases/*` rout a
zastaví cron připomínek. Existující data v Redisu zůstávají a expirují podle
TTL.

## Datový tok

```text
success stránka (paid + download token)
→ POST /api/cases/from-order
→ Stripe session paid? draft.downloadToken == token? contractType == work_contract?
→ buildCaseRecord z draft.payload (jen workTitle, startDate, endDate, priceAmount, paymentType, partnerUserRole)
→ saveCase + draft.caseId (idempotence)
→ issueCaseAccessToken ×2 (okamžité otevření + e-mail)
→ e-mail s návratovým odkazem (#access=token)
```

Oddělení dat:

| Vrstva | Kde | Co | Retence |
|---|---|---|---|
| DOCUMENT DATA | `contract:draft:*` | celý payload smlouvy | 7/30/90 dní |
| CASE DATA | `case:*` | e-mail vlastníka, název, role, termín, cena/režim, fáze, úkoly, události, připomínky, data navazujících dokumentů | 365 dní od poslední změny; uzavřená zakázka 180 dní; nezaplacený rozpracovaný dokument 30 dní (revize polí: docs/DATA_MAP.md) |

Do případu se **nekopíruje** jméno, adresa, IČO ani kontakt protistrany.
Jména stran do navazujícího dokumentu zadává uživatel ručně (a sdílejí se mezi
dokumenty téhož případu).

## Autorizace („Case Lite“, bez registrace)

- token: 32 náhodných bajtů (hex 64), v URL pouze ve fragmentu `#access=`;
- server ukládá jen SHA-256 hash (`case:access:{hash}` → `{caseId, email}`);
- TTL odkazu 30 dní; návrat z platební brány používá samostatný 7denní token;
- token je vázán na `caseId` — hash existuje, ale nesouhlasí case → 403 (IDOR guard);
- `revoke_links` zneplatní všechny tokeny případu; `delete` smaže vše;
- všechny routy: first-party JSON (origin check), rate limit per IP, chybové
  odpovědi bez enumerace (neexistující případ == špatný token);
- `/api/cases/request-link` odpovídá vždy `{ ok: true }`, limit 10/h/IP a 3/h/e-mail.

## Fáze a workflow (`lib/cases/workflow.ts`)

`contract_signed → in_progress → changes → handover → defects → closed`

Každá fáze má popis, doporučené další kroky, doporučené dokumenty a případné
upozornění na individuální posouzení. Úkoly jsou jeden checklist napříč
fázemi; UI zvýrazňuje úkoly aktuální a následující fáze.

## Připomínky (`lib/cases/store.ts`, `app/api/cron/reminders`)

- plán: 30, 14, 7 dní a 1 den před termínem, 6:00 UTC; minulé termíny se přeskočí;
- index: ZSET `case:reminders:due` (score = dueAt ms, member = `caseId:reminderId`);
- cron: Vercel Cron `0 6 * * *` → `GET /api/cron/reminders` s
  `Authorization: Bearer $CRON_SECRET`; bez secretu route odmítne vše (fail-closed);
- lock `case:reminders:cron-lock` (10 min) brání souběhu;
- e-mail obsahuje konkrétní další krok podle fáze (ne „máte připomínku“) a
  nový návratový token; idempotency key `case-reminder-{caseId}-{reminderId}`;
- při selhání e-mailu zůstává položka v indexu a další běh ji zkusí znovu.

Připomínky jsou funkční upozornění; nikdy se nemíchají s marketingem.

## Navazující dokumenty (`lib/cases/documents.ts`)

| kind | Dokument | Fáze |
|---|---|---|
| `handover_protocol` | Předávací protokol k dílu | handover |
| `change_order` | Změnový list | in_progress, changes |
| `extra_work_confirmation` | Potvrzení víceprací | in_progress, changes |
| `defect_record` | Zápis o vadách díla | handover, defects |
| `defect_notice` | Oznámení vad a výzva k odstranění | defects |

- vstup: malý formulář (Zod-like validace v `validateCaseDocumentData`);
- render: `renderSimpleDocumentPdf` v `lib/pdf.ts` (stejná typografie jako smlouvy);
- cena: 99 Kč (`price_data`, metadata `kind: case_document`); zakázky z balíčku
  Zakázka Plus mají dokumenty `included`;
- platba: `POST /api/cases/documents/create` → Stripe Checkout → webhook
  (`kind === 'case_document'`, idempotentní přes `webhook:fulfilled:{session}`)
  → `markCaseDocumentPaid`; fallback `POST /api/cases/documents/sync` ověří
  session přímo u Stripe, pokud webhook ještě nedorazil;
- download: `POST /api/cases/documents/download` (token v těle, PDF jako blob).

## Analytics

Serverové: `case_started`, `case_saved`, `case_deleted`, `reminder_enabled`,
`reminder_sent`, `checkout_started` (case_document), `followup_document_purchased`,
`document_downloaded`. Browserové: `case_offer_viewed`, `case_returned`,
`reminder_clicked`, `followup_document_viewed`, `followup_document_started`.
Nikdy se neposílá e-mail, název zakázky ani obsah dokumentu.

KPI v `/interni/analytics` (sekce Portál 2.0): case activation, reminder
adoption, return rate, follow-up start/purchase, partner intent rate.

## Recurring (připraveno, vypnuto)

`lib/subscriptions/plans.ts` definuje plány `contractor_pro`, `employer_pro`,
`landlord_pro`. `isSubscriptionPlanPurchasable()` vrací vždy `false`, dokud
neexistuje Stripe `mode: 'subscription'`, obsluha `customer.subscription.*`
ve webhooku, trvalá identita zákazníka a správa odběru. Flag
`NEXT_PUBLIC_FEATURE_SUBSCRIPTIONS` smí zobrazit pouze měřený zájem.

## Rollback

1. `NEXT_PUBLIC_FEATURE_CASE_ENGINE=false` + redeploy → vrstva zmizí, data expirují.
2. Vercel „Promote to production“ na předchozí deployment (produkční SHA před
   releasem je v DEPLOY.md / release reportu).
3. Redis klíče `case:*`, `partner:*` jsou aditivní; žádná migrace stávajících
   klíčů neproběhla, takže starší build s nimi nepracuje a nic nerozbije.
