# Lokální revize SmlouvaHned — 17. 9. 2026

Větev: `codex/portal-polish-and-checkout-safety`, výchozí commit `c1a469f`.
Změny nejsou nasazené ani pushnuté. Náhled: http://127.0.0.1:3200/.

## Změny pro návštěvníka

- Homepage vysvětluje dokumenty, bezplatné návody a pokračování smlouvy o dílo v Moje zakázka. Cena zůstává viditelná před objednávkou.
- Nový úvod používá vlastní typografické rozložení a interaktivní ukázku dohody, průběhu a předání. Animace respektují omezený pohyb.
- Lokální vyhledávání spojuje dokumenty, návody a nástroje. Rozumí diakritice, hledaný text neodesílá ani neukládá.
- Přímé odkazy na čtyři konkrétní otázky a přehlednější situace zkracují cestu k obsahu a placenému dokumentu. Odkazy jsou běžné serverově vykreslené odkazy; vyhledávání není jedinou cestou k obsahu.
- Kliknutí využívají existující měření a souhlas. Nové povrchy: `homepage_search`, `homepage_journey`. Růst návštěvnosti ani tržeb nebyl měřen; po případném nasazení porovnat organické vstupy, přechody do formuláře a dokončené nákupy.

## Opravy spolehlivosti

- Odstraněno riziko ztráty potvrzené platby při nesouhlasícím načtení dat a revize.
- Úklidový index a záznam zakázky se zapisují atomicky; údržba neprodlužuje retenci. Omezený SCAN doplní index i u starších dokumentů.
- Chyba ověření či expirace Stripe session nevytvoří novou platbu. Přesný požadavek se ukládá před voláním Stripe pro bezpečné opakování po výpadku, včetně již zaplacené session.
- Starší dokument bez snapshotu se zmrazí před další změnou nebo stažením. Původní historický obsah, který nebyl uložen, zpětně obnovit nelze.
- Zpřesněna dvě právní tvrzení o formě dodatku (§ 564) a změně pevné ceny (§ 2620).

## Ověření

- `npm run test:pre-deploy`: exit 0; lint, zabezpečení, ceny, monetizace, SEO, dokumenty a produkční build.
- Case engine: 208 kontrol a nové regrese souběhu, výpadků Stripe, neměnnosti a retence. Case API: 60 kontrol. Obsah portálu: 1 630 kontrol.
- PDF audit: 18/18. Build integrity: `sh20260917a`; globální CSS nebylo měněno.
- Samostatný lint nového regresního skriptu a `tsc --noEmit`: exit 0.
- Ruční kontrola desktopu, mobilu 375 × 812 a tabletu 820 × 1180; bez vodorovného přetékání. Mobilní hlavní CTA je v první obrazovce. Vyhledávání → skutečný návod; ukázka → přehled zakázky. V kontrolovaném prohlížeči bez JavaScriptových chyb.
- Kompletní Playwright běh: 118 prošlo, 1 selhal na hlavičce cache specifické pro dev režim, 36 podmíněných testů přeskočeno (živé Stripe session a vypnutý experiment DPP zdarma). Po explicitním rozlišení dev režimu prošel i celý zbývající scénář obnovy přístupu (1/1). Celkem ověřeno 119 scénářů; produkční kontrola `no-store` zůstává výchozí a nebyla zmírněna. Celá sada se po této změně testu znovu nespouštěla.
- Testy hromadného vyplňování nyní čekají na připojení Reactu a obnovu rozpracovaného formuláře. Původní testy zapisovaly do samotného SSR HTML před připojením obsluhy vstupů; výsledná kontrola payloadu zůstala zachovaná.

## Meze lokálního ověření

Stripe a Redis regresní testy používají stub a paměťovou implementaci. Skutečné platby, rozesílání e-mailů a produkční úklid nebyly spuštěny. Před případným nasazením zbývá ověřit změněný Lua skript a cron v izolovaném skutečném Redis a checkout ve Stripe test mode. Starý neurčitý Stripe pokus po vypršení pevné expirace selže bezpečně a vyžaduje provozní dohledání.

Automatická kontrola odmítla spuštění samostatného lokálního produkčního serveru na portu 3201 i bez konfigurace externích služeb; konkrétní důvod neuvedla. Produkční build prošel, browserové testy běží na vývojovém serveru na portu 3200.

Opakování browserových testů proti tomuto dev serveru: nastavte `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3200`, `PLAYWRIGHT_SKIP_WEBSERVER=1`, `PLAYWRIGHT_DEV_SERVER=true` a spusťte `npx playwright test`. Pro produkční build `PLAYWRIGHT_DEV_SERVER` nenastavujte. Vývojový náhled používá paměťové úložiště a nefunkční testovací Stripe klíč; skutečná platba v něm není dostupná.

## Dotčené soubory

- Homepage: `app/page.tsx`, `app/components/portal/SituationGrid.tsx`, nové `app/components/marketing/CaseJourneyPreview.tsx`, `ContentFinder.tsx`, `homepage.module.css`.
- Zakázky: `lib/cases/store.ts`, `checkout.ts`, `types.ts`, `lib/redis-memory.ts`.
- API: `app/api/cases/documents/download/route.ts`, `app/api/cases/export/route.ts`, `app/api/cron/reminders/route.ts`.
- Obsah: `lib/portal/articles-growth.ts`.
- Testy: `scripts/case-engine-tests.ts`, nový `scripts/case-reliability-tests.ts`, `scripts/i18n-expat-tests.ts`, nový `e2e/homepage-discovery.spec.ts`, `e2e/checkout-contract.spec.ts`, `e2e/checkout-required-fields.spec.ts`, `e2e/portal-2-0.spec.ts`.
- Dokumentace: `docs/CASE_ENGINE.md`, `docs/DATA_MAP.md`, tento report. `AGENTS.md` aktualizoval automaticky Next.js při spuštění dev serveru.

Žádné nové knihovny, změny cen, produkčních proměnných nebo deployment konfigurace.
