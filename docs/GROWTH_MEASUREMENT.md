# Growth Engine — měření per URL

Cíl: pro každou stránku růstových clusterů (zakázka, zaměstnávám, auto, pronajímám,
změny 2027) sledovat celý řetězec

```
objeveno → indexováno → imprese → clustery dotazů → kliky → otevření nástroje → spuštění dokumentu → nákup
```

Příklad výsledku, ke kterému směřujeme: `/zmeny-2027/zamestnavatele` 8 000 impresí →
120 kliknutí → 18 otevření nástroje → 5 pracovních smluv → 1 nákup.

## Kde co žije

| Krok | Zdroj | Kde v kódu |
|---|---|---|
| objeveno / indexováno / imprese / kliky / dotazy | Google Search Console (ruční export) | `lib/growth/indexation.ts` → `GROWTH_GSC_SNAPSHOTS` |
| landing view, CTA, nástroj, dokument, nákup | first-party události s `traffic_source = portal_page` | `lib/analytics-attribution.ts`, `lib/analytics-reporting.ts` (`portalAttribution`) |
| registr měřených URL | odvozen z obsahu (články, nástroje, huby, radar) | `listGrowthUrls()` |
| tabulka | `/interni/analytics` → sekce „Growth Engine — URL → indexace …“ | `app/interni/analytics/page.tsx` (`GrowthContent`) |

Search Console záměrně není napojena přes API (žádný další token v produkci, žádné
další odesílání dat). Exporty se přepisují ručně a mají datum.

## Jak funguje first-party část

1. `TrackView` na hubech, answer-first článcích, nástrojích a radaru posílá
   `situation_viewed` / `legal_change_viewed` a jako první vstup v relaci si
   zapamatuje `{ source: 'portal_page', landingPage: pathname }` (sessionStorage,
   30 minut, pouze po opt-in do produktové analytiky).
2. `TrackedLink` na plochách `situation_hub`, `answer_article`, `tool_page`,
   `legal_radar`, `legal_radar_hub` dělá totéž při kliknutí, kdyby view nestihlo.
3. Všechny další události v relaci (`tool_started`, `builder_view`,
   `stripe_checkout_started`, `checkout_completed`) nesou `acquisition_page` a
   `traffic_source`; reporting je sčítá do řádku `portal_page::/cesta`.
4. `landingPageMatchesSource('portal_page', …)` přijímá jen
   `/zakazka`, `/zamestnavam`, `/nastroje`, `/zmeny-2027` (+ jeden podsegment) a
   `/pro-pronajimatele/<slug>`, `/prodej-vozidla/<slug>`. Homepage, buildery,
   blog a balíčky mají vlastní zdroje beze změny.

Sloupce v tabulce „Landing page → výnos“: Views · CTA (`situation_started` a
starší `*_cta_click`) · Nástroj (`tool_started`) · Start (`builder_view`) ·
Dokončeno · Stripe · Platby · Tržba · Stažení · Partner.

## Jak doplnit export ze Search Console

Jednou za 2–4 týdny (a vždy po release nového clusteru):

1. GSC → **Pages** → filtr `www.smlouvahned.cz/zakazka/`, `/zamestnavam/`,
   `/prodej-vozidla/`, `/nastroje/`, `/zmeny-2027/` → Export (období 28 dní).
2. GSC → **Indexing → Pages** (Page indexing report) → stav každé URL:
   `indexed`, `discovered` (Discovered – currently not indexed),
   `crawled_not_indexed`, `excluded`.
3. Pro URL s impresemi: GSC → **Queries** s filtrem na stránku → seskupit
   dotazy do 2–5 clusterů (např. „záloha řemeslník“, „vícepráce smlouva“).
4. Zapsat do `GROWTH_GSC_SNAPSHOTS`:

```ts
{
  path: '/zmeny-2027/zamestnavatele',
  observedAt: '2026-10-15',
  observedDays: 28,
  indexation: 'indexed',
  impressions: 8000,
  clicks: 120,
  averagePosition: 6.4,
  queryClusters: [
    { label: 'změny pro zaměstnavatele 2027', impressions: 5200, clicks: 90 },
    { label: 'minimální mzda 2027', impressions: 1800, clicks: 20 },
  ],
},
```

Pravidla: žádné odhady (bez exportu zůstává řádek „bez exportu“), vždy
`observedDays`, vždy www varianta URL, jeden snapshot na URL (starší nahradit).
`scripts/portal-content-tests.ts` hlídá, že každý snapshot odpovídá existující URL
a má datum.

## Rozhodovací brány (30 dní po indexaci)

| Signál | Akce |
|---|---|
| `discovered` déle než 30 dní | přidat interní odkazy z hubu/blogu, zkontrolovat kanonikalizaci, requestovat indexaci |
| imprese > 500, CTR < 1 % | přepsat title/description (≤ 60 / 120–165 znaků), doplnit rok nebo otázku |
| kliky > 50, nástroj = 0 | nástroj není vidět nad ohybem — posunout CTA na nástroj výš |
| nástroj > 20, dokument = 0 | výsledek nástroje nevede k dokumentu — zkontrolovat `resultCta` nástroje |
| dokument > 10, nákup = 0 | prověřit cenovou větu (`PRICE_TRANSPARENCY_LINE`) a souhrn objednávky |

## Co se neměří (záměrně)

- Nic per uživatel; počty nejsou unikátní návštěvníci.
- Žádné cookies třetích stran, žádný GSC API token.
- Komerční intenty (`commercialIntents`) zůstávají vypnuté, dokud není partner a consent flow.
