# SmlouvaHned.cz — Strategie růstu a dominance na trhu
**Datum:** 3. 4. 2026 · Kompetitivní analýza + SEO roadmapa

---

## TL;DR — 3 nejdůležitější věci

1. **Přidat recenze** (Trustpilot / Google) → silnější E-E-A-T než kdokoli z konkurence
2. **Rozšířit blog o 8 dalších průvodců** (freelanceři, OSVČ, kupující) → 2–3× větší organický dosah
3. **LegalService + Product Schema** → rich snippets v Google = vyšší CTR bez vyšší pozice

---

## Konkurenční mapa

| Hráč | Model | Cena | Slabina |
|---|---|---|---|
| **GenerátorSmluv.cz** | Pay-per-doc | 250 Kč | Zastaralý UI, žádný blog |
| **Legito.cz** | Freemium | Netransparentní | Příliš globální, složitý |
| **Smlouvenka.cz** | 5 zdarma/měsíc | Neznámá | AI bez důvěryhodnosti, žádné IČO |
| **Smlouva.ai** | 1 zdarma, pak platba | Neznámá | Nový hráč, žádné recenze |
| **Bezrealitky.com** | Pay-per-doc | 199 Kč | Jen nájemní smlouva |
| **VzorySmlouvy.cz** | Zdarma | 0 | Jen šablony, žádná generace |

**SmlouvaHned.cz výhody**: Transparentní ceny, česká specializace, IČO viditelné, E-E-A-T compliance, premium UI. Největší mezera: žádné recenze, chybí LegalService schema, menší blog.

---

## SEKCE 1 — PRODUCT (Co přidat do produktu)

### 1.1 Testimonials / recenze — P0, nejvyšší ROI

Konkurence (Legito 3.8/5 na Trustpilot) má nad SmlouvaHned jedinou skutečnou výhodu: ověřené recenze.

**Co udělat:**
- Přidat widget Trustpilot nebo vlastní recenzní sekci na homepage
- Po úspěšném stažení e-mailovat zákazníka s žádostí o recenzi
- Cíl: 20+ recenzí za první 2 měsíce = přelomový E-E-A-T signál
- Na homepage: sekce „Co říkají zákazníci" se 3–5 citacemi

Bez recenzí je každý competitor schopen argumentovat „my máme ověřenou reputaci, vy ne."

---

### 1.2 Předávací protokol jako doplněk k nájemní smlouvě

Bezrealitky.com a ABES.cz nabízejí k nájemní smlouvě předávací protokol jako součást balíčku. SmlouvaHned to nemá jako standalone nabídku.

**Co udělat:**
- Přidat `/predavaci-protokol` jako samostatný typ smlouvy nebo jako addon k `/najem`
- V success page po nájemní smlouvě: „Potřebujete také Předávací protokol?"
- Toto je naturální upsell a zároveň SEO příležitost (hledaný termín)

---

### 1.3 Elektronický podpis (Signi.com integrace) — P2

Bezrealitky.com nabízí online podpis přes § 562 OZ. Toto je feature, která zdvojuje vnímanou hodnotu produktu.

**Co udělat (do 90 dní):**
- Partnerství nebo integrace se Signi.com (česká e-sign platforma)
- Jako prémiová vrstva: Kompletní balíček + e-podpis = nová vyšší cena (999–1 199 Kč)
- Silný diferenciátor od všech textových generátorů

---

### 1.4 Word (.docx) výstup jako doplněk k PDF

Většina volných šablon nabízí Word. Zákazníci, kteří chtějí upravit smlouvu, hledají .docx.

**Co udělat:**
- Přidat volitelný .docx download (vedle PDF) — cca +50 Kč nebo jen pro Complete balíček
- Signalizuje flexibilitu a zvyšuje vnímanou hodnotu

---

### 1.5 Notifikace o expiraci odkazu

Zákazník zaplatí, stáhne, za 8 dní potřebuje znovu — odkaz expiroval.

**Co udělat:**
- E-mail 48h před expirací: „Váš dokument expiruje pozítří — stáhněte do té doby"
- Nulové náklady (Resend), silný zákaznický servis, snižuje chargeback riziko

---

## SEKCE 2 — SEO TECHNICKÉ

### 2.1 LegalService Schema — chybí celé konkurenci

Žádný z Czech konkurentů nemá `LegalService` Schema.org typ. Toto je přímá příležitost pro rich snippet v Google.

```json
{
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "SmlouvaHned",
  "description": "Online softwarový nástroj pro automatizovanou tvorbu standardizovaných smluvních dokumentů",
  "url": "https://smlouvahned.cz",
  "areaServed": { "@type": "Country", "name": "CZ" },
  "availableLanguage": "Czech",
  "priceRange": "249–749 Kč",
  "serviceType": "Document Automation",
  "provider": {
    "@type": "Person",
    "name": "Karel Zdeněk",
    "identifier": { "@type": "PropertyValue", "propertyID": "ICO", "value": "23660295" }
  }
}
```

Přidat do `app/layout.tsx` jako globální JSON-LD.

---

### 2.2 Product Schema na každé smlouvě

Každý `/najem`, `/auto`, `/nda` atd. by měl mít `Product` schema s cenou → Google zobrazí cenu přímo v SERPu.

```json
{
  "@type": "Product",
  "name": "Nájemní smlouva online 2026",
  "description": "Dynamicky sestavená nájemní smlouva dle § 2235 OZ. PDF ke stažení.",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "249",
    "highPrice": "749",
    "priceCurrency": "CZK",
    "availability": "https://schema.org/InStock"
  }
}
```

---

### 2.3 BreadcrumbList Schema

Každá podstránka (/najem, /blog/xxx) by měla mít BreadcrumbList → lepší SERP snippet.

```
SmlouvaHned › Nájemní smlouva
SmlouvaHned › Blog › Nájemní smlouva vzor 2026
```

---

### 2.4 HowTo Schema na blog postech

Blog průvodce jako „Jak vyplnit nájemní smlouvu krok za krokem" může mít `HowTo` schema → Google zobrazí kroky přímo v SERPu jako rich result.

---

### 2.5 Google Business Profile + Seznam.cz Firmy

SmlouvaHned nemá (nebo nemá optimalizovaný) GBP záznam. Seznam.cz Firmy drží ~11–15 % českých vyhledávání.

**Co udělat:**
- Vytvořit/optimalizovat Google Business Profile
- Zapsat na Seznam.cz Firmy (firmy.cz, seznam.cz/firmy)
- Kategorie: „Právní software" / „Tvorba dokumentů"
- Přidat URL, popis, otvírací dobu (nebo „online 24/7")

---

### 2.6 Sitemap `lastModified` — dynamicky z dat

Aktuálně je `lastModified: now` (každý build mění datum) → Google to může vyhodnotit jako spam signál.

**Co udělat:**
- Každý blog post: napevno datum publikace
- Každá smlouva page: datum poslední aktualizace šablony (např. `2026-01-01`)
- Homepage: datum posledního redesignu

---

### 2.7 Interní prolinkování — silnější síť

**Aktuální stav**: Blog posty mají CTA buttony na smlouvy, ale chybí anchor-text textové linky.

**Co přidat:**
- V každém blog postu: minimálně 2–3 kontextuální anchor linky na jiné blogy
- Příklad: v blogu o nájemní smlouvě → odkaz na „podnájemní smlouva" a „předávací protokol"
- Na smlouvě `/najem` → odkaz na blog `/blog/najemni-smlouva-vzor-2026`
- Toto je +15–25 % PageRank distribuce bez nového obsahu

---

## SEKCE 3 — CONTENT STRATEGIE

### 3.1 Chybějící průvodce (blog gaps vs. konkurence)

Aktuálně: 14 blog postů. Konkurence (Legito, ideálnínájemce.cz) má 50–200+ článků.

**Prioritizovaných 10 nových průvodců:**

| # | URL | Klíčové slovo | Měsíční objem (odhad) | Obtížnost |
|---|---|---|---|---|
| 1 | `/blog/predavaci-protokol` | předávací protokol vzor | 1 200 | Nízká |
| 2 | `/blog/smlouva-o-dilo-freelancer` | smlouva o dílo freelancer | 800 | Nízká |
| 3 | `/blog/najemni-smlouva-pro-pronajimatele` | nájemní smlouva pronajímatel | 900 | Střední |
| 4 | `/blog/kupni-smlouva-auto-kupujici` | kupní smlouva auto kupující | 1 100 | Střední |
| 5 | `/blog/nda-pro-startupy` | NDA startup mlčenlivost | 400 | Nízká |
| 6 | `/blog/smlouva-osvč-2026` | smlouva OSVČ 2026 | 700 | Nízká |
| 7 | `/blog/elektronicky-podpis-smlouva` | elektronický podpis smlouva | 1 400 | Střední |
| 8 | `/blog/smluvni-pokuta-vzor` | smluvní pokuta vzor | 600 | Nízká |
| 9 | `/blog/smlouva-o-dilo-vs-dpp` | smlouva o dílo vs DPP | 500 | Nízká |
| 10 | `/blog/darovaci-smlouva-auto` | darovací smlouva auto | 750 | Nízká |

Každý průvodce: min. 1 200 slov, 1 CTA button na příslušnou smlouvu, HowTo schema, interní linky.

---

### 3.2 Audience-specific landing pages

Aktuálně: smlouvy jsou generické. Konkurence (ABES.cz pro realitní kanceláře) vyhrává niches.

**3 nové landing pages:**

1. `/najemni-smlouva-pronajimatel` — „Nájemní smlouva pro pronajímatele bytů"
   - H1: „Chráníte svůj byt? Nájemní smlouva sestavená pro vás jako pronajímatele."
   - Zaměření na kauce, smluvní pokuty, výpověď
   - Odlišná od generické `/najem`

2. `/smlouva-o-dilo-freelancer` — „Smlouva o dílo pro freelancery a OSVČ"
   - H1: „Pracujete na volné noze? Smlouva, která vás ochrání před nezaplacením."
   - Zaměření na platební podmínky, akceptace, IP práva

3. `/smlouvy-pro-male-firmy` — „Smlouvy pro živnostníky a malé firmy"
   - Hub page propojující relevantní smlouvy: NDA, spolupráce, smlouva o dílo, DPP
   - Silný SEO hub (B2B segment)

---

### 3.3 „Srovnávací" obsah — decision stage traffic

Tyto query jsou vysoko-konverzní (uživatel je blízko nákupu):

- `/blog/smlouva-o-dilo-vs-dohoda-o-provedeni-prace` — „Smlouva o dílo nebo DPP: kdy co použít?"
- `/blog/najemni-vs-podnajemni-smlouva` — „Nájemní vs. podnájemní: klíčové rozdíly"
- `/blog/smlouva-vzor-vs-generator` — „Vzor smlouvy zdarma vs. generátor: kdy stačí vzor a kdy ne?" (přímo útočí na free template weby)

Poslední článek je strategicky klíčový: definuje kategorii ve prospěch placeného produktu.

---

### 3.4 Aktualizační signály — „2026" v titulcích

Analýza: weby, které vyhrávají na „nájemní smlouva 2026", mají „2026" v H1 a title tagu.

**Co udělat:**
- Každý rok v lednu: update „2026" → „2027" na všech smlouvách a blog postech
- Přidat do každého průvodce: „Aktualizováno k 1. 1. 2026 · Občanský zákoník č. 89/2012 Sb."
- Toto je nejlevnější SEO win na trhu

---

## SEKCE 4 — TRUST & KONVERZE

### 4.1 Testimonials sekce na homepage

**Aktuálně**: žádné recenze na webu.
**Konkurence**: Legito má Trustpilot 3.8/5.

**Jak implementovat:**
- Po stažení dokumentu → e-mail s žádostí o 2-větnou recenzi
- Přidat sekci na homepage mezi pricing a FAQ:

```
"Nájemní smlouvu jsem potřebovala rychle před stěhováním nájemníka.
Formulář byl přehledný, PDF vypadalo profesionálně. Doporučuji."
— Jana K., Praha · Nájemní smlouva
```

- 3–5 citací s jménem, městem, typem smlouvy
- Přidat AggregateRating Schema (Google může zobrazit hvězdičky v SERPu)

---

### 4.2 Visible „Aktualizováno pro 2026" na smlouvách

Každá smlouva page by měla mít viditelný timestamp:
```
Šablona aktualizována: leden 2026 · Občanský zákoník č. 89/2012 Sb.
```

Toto je silný trust a SEO signál — konkurence to nemá konzistentně.

---

### 4.3 Explicitní garance na homepage

Bezrealitky.com má: „Kontrolováno Havel & Partners". SmlouvaHned může mít:

```
✓ Garance vrácení peněz do 14 dní při technické chybě
✓ Šablony dle platného OZ č. 89/2012 Sb.
✓ IČO: 23660295 · Provozovatel ověřen
```

Viditelný trust block (ne jen v FAQ) výrazně zvyšuje konverzní rate.

---

### 4.4 Exit intent nebo scroll trigger „Mít otázku?"

Na každém formuláři (po 50 % scrollu nebo po 3 minutách):
- Neinvazivní overlay: „Potřebujete pomoc se smlouvou? Napište nám →"
- Odkaz na `info@smlouvahned.cz`
- Snižuje abandon rate u uživatelů, kteří si nejsou jisti

---

## SEKCE 5 — GROWTH KANÁLY

### 5.1 Affiliate program — realitní makléři

ABES.cz vydělává na B2B přístupu pro realitní kanceláře. SmlouvaHned může udělat lehčí verzi:

- Affiliate kód pro realitní makléře / HR firmy / účetní poradce
- Každý odkaz → 15–20 % provize za doporučeného zákazníka
- Nulové náklady při nulové konverzi, silný growth při aktivní síti

---

### 5.2 API pro B2B (do 12 měsíců)

Žádný z Czech konkurentů nenabízí API pro programatické generování smluv. Toto je:
- Neobsazený trh
- Vyšší LTV zákazníka (subscription místo per-doc)
- Integrace s Pohoda, Money S3, fakturoid.cz

---

### 5.3 PR a linkbuilding

**Linkbaiting obsah:**
- „Analýza: Nejčastější chyby v nájemních smlouvách (100 smluv, 2026)" — data story
- „Zákon o nájmu bytů: co se změnilo v roce 2026" — news hook

**Cílové domény pro backlinky:**
- businessinfo.cz (vládní SME portál, PA 70+)
- podnikatel.cz (média pro podnikatele)
- idnes.cz/byznys, e15.cz (mainstream média)
- ideálnínájemce.cz, bezrealitky.com (niche partneři)

---

## Implementační prioritizace

### Měsíc 1 — Rychlé wins
- [ ] Přidat testimonials sekci na homepage (3–5 citací)
- [ ] Spustit Trustpilot nebo Google review collection
- [ ] Přidat `LegalService` schema do `app/layout.tsx`
- [ ] Přidat `Product` schema na každou smlouvu
- [ ] Přidat `BreadcrumbList` schema
- [ ] Vytvořit/optimalizovat Google Business Profile
- [ ] Zapsat na Seznam.cz Firmy
- [ ] Opravit `sitemap.ts` — konkrétní data místo `now`
- [ ] Přidat interní anchor linky mezi blog posty

### Měsíc 2–3 — Content expanze
- [ ] Napsat 5 prioritních blog průvodců (freelancer, pronajímatel, kupující auto...)
- [ ] Přidat „Aktualizováno: leden 2026" timestamp na všechny smlouvy
- [ ] Vytvořit `/blog/smlouva-vzor-vs-generator` (decision stage)
- [ ] Přidat notifikaci 48h před expirací odkazu
- [ ] Přidat `/predavaci-protokol` jako nový typ dokumentu

### Měsíc 3–6 — Produkt
- [ ] Word (.docx) výstup jako volba
- [ ] Upsell po stažení (personalizovaný dle contractType)
- [ ] Audience landing pages (/najemni-smlouva-pronajimatel, /smlouvy-pro-male-firmy)
- [ ] Affiliate program MVP

### Měsíc 6–12 — Strategické
- [ ] Signi.com integrace (e-podpis)
- [ ] B2B API (fakturoid.cz, Pohoda)
- [ ] Slovenský trh (/sk/ verze)
- [ ] AggregateRating schema (pokud 20+ recenzí)
