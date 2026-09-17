# Legislativní radar 2027 a governance právního obsahu

## Zdroj pravdy

`lib/legal/radar.ts` — pole `LEGAL_CHANGES`. Každá položka nese:

```text
key, title, audiences[], status, effectiveFrom, dateLabel,
summary, whatChanges[], whatToDo[], affectedDocuments[], sources[], verifiedAt, escalation?
```

Statusy jsou explicitní a v UI vždy viditelné:

| status | label | význam |
|---|---|---|
| `in_force` | PLATÍ | předpis je účinný |
| `approved_pending` | SCHVÁLENO – ČEKÁ NA ÚČINNOST | vyhlášeno, účinnost nastane |
| `in_progress` | PROJEDNÁVÁ SE | v legislativním procesu |
| `proposal` | NÁVRH | záměr nebo návrh |

Návrh zákona se nikdy neprezentuje jako platná úprava. Položka bez oficiálního
zdroje se do radaru nepřidává.

## Ověřené zdroje (stav k 2026-09-17)

Primární zdroje: e-Sbírka, PSP ČR (sněmovní tisky), MPSV, ČSSZ, Finanční správa,
MPO, EUR-Lex, Evropská komise. Obsah konkurenčních webů se nepoužívá.

## Lifecycle obsahu

```text
draft → review → published → needs_review → updated / archived
```

- `verifiedAt` starší než 90 dní → položka se v `/interni/analytics` označí
  k revizi (`getLegalChangesNeedingReview`).
- Šablony dokumentů (`lib/legal/document-versions.ts`): `version`, `validFrom`,
  `validTo`, `verifiedAt`; `needs_review` po 180 dnech nebo pokud se jich týká
  změna účinná po posledním ověření.
- Automatizace (crawler e-Sbírky, AI) smí navrhnout `needs_review`, nikdy sama
  nepřepíše publikovaný právní obsah ani produkční šablonu.

## Budoucí automatizace (architektura, zatím neimplementováno)

```text
nová novela (e-Sbírka API / sledování tisků PSP)
→ identifikace dotčených předpisů (affectedDocuments)
→ označení needs_review v radaru + šabloně
→ interní review (ruční)
→ nová verze šablony (LEGAL_VERSION, valid_from)
→ publikace
→ upozornění relevantním uživatelům (pouze těm s aktivní zakázkou daného typu, funkční e-mail)
```

Oficiální API e-Sbírky (zákon č. 222/2016 Sb.) poskytuje strukturovaný
přístup k předpisům; stabilita pro produkční automatizaci nebyla v této fázi
ověřena, proto radar zůstává ručně kurátorovaný s datem kontroly.
