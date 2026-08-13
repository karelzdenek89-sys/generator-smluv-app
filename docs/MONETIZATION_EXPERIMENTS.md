# Monetizační experimenty

## Zdroj pravdy

Rozhodování je centralizované v `lib/monetization-policy.ts`. Povolené režimy jsou:

- `paid` — základní i rozšířená varianta pokračují přes Stripe;
- `freemium` — rezervovaný režim pro budoucí trvalý free základ;
- `free_experiment` — časově a datově vyhodnocovaný bezplatný základní PDF výstup.

Globální serverový kill switch je `FREE_FUNNEL_EXPERIMENTS_ENABLED`. Při chybějící,
neplatné nebo vypnuté hodnotě politika bezpečně spadne do `paid`. Klientská nabídka
není autorita: endpoint pro vytvoření free dokumentu politiku znovu ověřuje.

## Aktivní kandidát

| Smlouva | Locale | Režim po aktivaci | Experiment | Důvod |
|---|---|---|---|---|
| DPP | cs | `free_experiment` | `gsc_dpp_free_2026_08` | Dodaný GSC snapshot: 2 497 impresí, 5 kliků, CTR přibližně 0,20 %, průměrná pozice 9,7. |

Snapshot neměl datum pozorování a není vydáván za živé GSC napojení. Evidence je v
`lib/gsc-monetization-candidates.ts` a interní dashboard ji zobrazuje včetně zdroje.

## Pravidla pro další kandidáty

Stránka je `free_experiment_candidate`, pokud má alespoň 300 impresí, průměrnou
pozici 1–15, CTR pod 1 % a nejvýše `max(10, 1 % impresí)` kliků. Pod 300 impresí je
`low_data`. Samotná klasifikace nic nezapíná: přidání politiky a produkční aktivace
vyžadují ruční review relevance dotazu, právního výstupu a ekonomiky.

CSV nebo export z GSC se při další iteraci nejprve převede do stránkových snapshotů
se sloupci `page`, `impressions`, `clicks`, `ctrPercent`, `averagePosition`, `source`
a `observedAt`. Souhrnná segmentová čísla bez URL se nepoužívají k automatické
aktivaci konkrétní smlouvy.

## Produktové hranice

- Zdarma je pouze základní PDF, bez DOCX, add-onů, balíčku a bez Stripe.
- Rozšířená varianta za 199 Kč zůstává placená a obsahově hodnotná.
- SEO a UI smějí použít slovo „zdarma“ jen tehdy, když serverová politika skutečně
  vrátí `free_experiment`.
- Free draft je uložen v Redis na 24 hodin, bez doručovacího e-mailu.
- Vytvoření: nejvýše 5 požadavků/IP/hodinu. Stažení: nejvýše 10/dokument/24 h a
  30/IP/hodinu. Rate-limit úložiště u free flow failuje zavřeně.
- Download token je pouze ve fragmentu URL a do API jde přes first-party POST.
- Placený download si zachovává vlastní Stripe `paid` ověření a nebyl rozvolněn.

## Měření a vyhodnocení

Použité eventy: `builder_view`, `builder_completed`, `free_document_generated`,
`free_document_downloaded`, `premium_offer_viewed`, `premium_upgrade_clicked`,
existující `stripe_checkout_started`, `checkout_completed` a partner funnel.
Každý experiment nese `monetization_mode`, `experiment_id`, `variant`, typ smlouvy
a locale. PII, payload smlouvy, session token ani download token se do analytiky
neposílají.

Primární metriky po 14 a 30 dnech:

1. free PDF / start builderu;
2. první free stažení / vygenerované free PDF;
3. placený nákup / start builderu a / free PDF;
4. tržba dokumentů na start builderu;
5. potvrzená partner revenue na start a na free PDF (do callbacku `N/A`);
6. chybovost, rate-limit odmítnutí a podíl nedokončených downloadů.

Experiment se zastaví při právní nebo bezpečnostní regresi, chybovosti free create
či download nad 2 %, zneužití limitů nebo při poklesu tržby na start o více než 25 %
bez kompenzující prokazatelné partner revenue. Partner revenue bez ověřeného callbacku
se nikdy neodhaduje.

## Rollback

Nastavit `FREE_FUNNEL_EXPERIMENTS_ENABLED=false` a provést nový produkční deployment.
Nové free dokumenty přestanou vznikat; již vydané tokeny zůstávají po omezenou dobu
24 hodin použitelné, aby uživatel nepřišel o právě vytvořený dokument. Metadata,
JSON-LD a UI se při novém buildu vrátí k placené variantě.
