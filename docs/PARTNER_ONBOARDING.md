# Partner onboarding

## Předpoklady

Partner zůstává vypnutý, dokud nejsou schválené commercial terms, market/locales, disclosure, cílová URL nebo API dokumentace, způsob atribuce a případný právní titul/souhlas. Credentials nikdy nepatří do repozitáře.

## Postup

1. Zaregistrujte partnera a stabilní `partnerId` v centrálním katalogu.
2. Přidejte offer s unikátním `id`, kategorií a providerem.
3. Definujte čistou eligibility funkci nad `PartnerContext`.
4. Deklarujte `supportedLocales`, `supportedCountries`, allowlisted hosts a výslovně povolené query parametry.
5. Přidejte lokalizovanou title/description/CTA/disclosure copy.
6. Nastavte prioritu a manuální quality score; nejvyšší provize sama o sobě nesmí rozhodovat.
7. Pro affiliate flow přidejte server-only env config. Pro API implementujte konkrétní provider/lead adapter s vlastním mapperem.
8. Pro lead připravte partner-specific consent text a fields allowlist.
9. Doplňte role, URL, PII, failure a analytics testy.
10. Nastavte konkrétní `<PREFIX>_ENABLED=true`; až poté globální `PARTNER_ENGINE_ENABLED=true`.

## API adapter checklist

- credentials pouze server-side,
- request DTO vytvářený explicitně po polích,
- timeout nejvýše 10 s,
- idempotency key a replay protection,
- retry pouze pro bezpečné/idempotentní chyby,
- sanitizované logy,
- fail-open vůči core produktu,
- provider signature verification pro callback/webhook,
- revenue pouze z ověřeného callbacku.

## Rollback

Nejdříve vypněte konkrétní offer. Při systémovém problému nastavte `PARTNER_ENGINE_ENABLED=false`. Není potřeba databázová migrace ani rollback dokumentového/platebního flow. Historické analytics eventy zůstávají čitelné.

## Další readiness kandidáti

Klik.cz, ePojisteni.cz, Dokobit a Raynet jsou vedené v readiness registry jako
neimplementovaní kandidáti. Nemají cílovou URL, credentials, eligibility ani live
offer. Přechod do katalogu vyžaduje ověření podmínek, domény/API, disclosure a
atribuce podle checklistu výše; pouhý obchodní nápad nesmí zobrazit nefunkční CTA.

## Readiness k 13. 8. 2026

Produkční Vercel prostředí při auditu neobsahovalo žádnou proměnnou `PARTNER_*`; stav credentials proto nelze potvrdit a žádný offer není live.

| Partner | Offer | Tech ready | Credentials/config | Live |
|---|---|---:|---|---:|
| PlanStavby | stavební rozpočet | ano | URL v katalogu, kill switch vypnutý | ne |
| Ušetřeno | tenant/landlord insurance | ano pro affiliate | chybí konfigurace | ne |
| Signi | e-signature | affiliate + provider interface | chybí konfigurace/API adapter | ne |
| Cebia | vehicle history | ano pro affiliate | chybí konfigurace | ne |
| carVertical | vehicle history | ano pro affiliate | chybí konfigurace | ne |
| iDoklad | invoicing | ano pro affiliate | chybí konfigurace | ne |
| Sloneek | HR SaaS | ano pro affiliate | chybí konfigurace | ne |
