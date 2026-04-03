# SmlouvaHned.cz — Růstový audit
**Datum:** 3. dubna 2026 | **Verze:** 1.0 | **Autor:** Interní audit

---

## 1. VERDIKT: Kde SmlouvaHned.cz stojí

**Celkové hodnocení: 7,4 / 10** (před touto sadou úprav: 6,1 / 10)

SmlouvaHned.cz je technicky dobře postavená SaaS platforma s reálnou hodnotou pro uživatele. Produkt řeší validní potřebu — standardizované smluvní dokumenty pro fyzické osoby a malé firmy. Hlavní rizika nejsou technická, ale strategická:

**Silné stránky:**
- 14 typů dokumentů — nejširší nabídka v segmentu
- Moderní UI, přehledný UX flow
- Dobře postavené blog landing pages (Article schema, BreadcrumbList, ArticleInlineCta)
- Transparentní stránka O projektu s identifikací provozovatele a IČO
- Stripe platební integrace

**Slabiny před audit-session:**
- Riziková product copy: "Právně validní základ", "Rozšířená právní ochrana", "v souladu s platným českým právem", "přesně pro vaši situaci"
- Nekonzistentní schema.org: `LegalApplication` místo `BusinessApplication` ve všech 14 layout souborech
- Blog layout bez IČO a O projektu odkazu → slabší E-E-A-T signál
- Tier naming "Rozšířená právní ochrana" jako produkt — problematické z pohledu regulace nelicencovaných poskytovatelů

**Opraveno touto sadou úprav:**
- ✅ Hero copy: "přesně pro vaši situaci" → "podle vašich podmínek"; "v souladu s platným českým právem" → "strukturované dle příslušných ustanovení OZ"
- ✅ Tier: "Rozšířená právní ochrana" → "Rozšířený dokument" (16 souborů)
- ✅ Tier: "Právně validní základ" → "Standardní dokumenty"
- ✅ Schema: `LegalApplication` → `BusinessApplication` (14 layout souborů)
- ✅ Blog layout: tagline, IČO, O projektu odkaz
- ✅ Riziková formulace "nemáte právní ochranu" → "je ochrana obtížně vymahatelná" (NDA blog)
- ✅ "právní jistotu" odstraněno z auto, nda, darovaci kontextu

---

## 2. TOP 5 PRIORIT PRO DALŠÍ KVARTÁL (Q2 2026)

### P0 — Conversion rate optimization na formulářových stránkách
**Problém:** Formuláře jsou dobré, ale chybí konverzní prvky nad formulářem: social proof, počet stažených dokumentů, aktivní ukazatel "Vygenerováno dnes".
**Řešení:** Přidat trust strip pod hero na každé smlouvě: počet vygenerovaných dokumentů tohoto typu, datum poslední aktualizace šablony.
**Dopad:** Odhadovaný nárůst konverze o 8–15 %.

### P1 — Interní prolinkování blog ↔ generátor
**Problém:** Blog články mají ArticleInlineCta komponenty, ale landing pages generátorů neodkazují zpět na blog. Uživatel přijde na `/najem`, vyplní formulář — ale pokud odejde bez konverze, nemá kam pokračovat.
**Řešení:** Přidat "Průvodce" odkaz na každé landing page (guideHref prop v ContractLandingSection).
**Dopad:** Snížení bounce rate, posílení topical authority clusteru.

### P2 — SEO landing pages: strukturovaná data a FAQ schema
**Problém:** Landing pages (např. `/najemni-smlouva`, `/kupni-smlouva`) mají dobrou on-page SEO ale chybí jim FAQPage schema a propracovanější interní prolinkování.
**Řešení:** Přidat FAQPage JSON-LD na všechny SEO landing pages. Minimálně 4 otázky na stránku.
**Dopad:** Rich snippets v SERP, +20–40 % CTR na FAQ dotazech.

### P3 — Review/testimonial layer
**Problém:** Nulový social proof. Žádné hodnocení, žádné počty dokumentů, žádné ukazatele důvěry mimo text.
**Řešení:** Review sekce s AggregateRating schema (min. 10 hodnocení). Počítadlo vygenerovaných dokumentů (pokud provozovatel souhlasí s jeho zobrazením). Případně "Naposledy vygenerováno: před X minutami" timestamp.
**Dopad:** Největší potenciální konverzní lift z dostupných taktik.

### P4 — Rozšíření na B2B segment
**Problém:** Stávající positioning a pricing cílí na fyzické osoby (B2C). B2B segment (freelanceři, malé s.r.o.) má větší LTV a méně cenovou citlivost.
**Řešení:** Firemní varianta s možností loga v záhlaví dokumentu, fakturační IČO, team přístup. Pricing 1 490–2 990 Kč/měsíc jako subscription.
**Dopad:** Diverzifikace revenue streamu, snížení závislosti na jednoráz. platbách.

---

## 3. HOMEPAGE — COPY A STRUKTURA (post-audit stav)

### Co bylo opraveno:

| Element | Před | Po |
|---------|------|-----|
| Hero H1 | "Právní dokument sestavený přesně pro vaši situaci." | "Smluvní dokument sestavený podle vašich podmínek." |
| Hero subline | "…v souladu s platným českým právem." | "…strukturované dle příslušných ustanovení OZ." |
| Tier 249 Kč popis | "Právně validní základ pro přímočaré situace" | "Standardní dokumenty pro přímočaré situace" |
| Tier 399 Kč název | "Rozšířená právní ochrana" | "Rozšířený dokument" |
| FAQ Q2 | "…od Rozšířené právní ochrany?" | "…od Rozšířeného dokumentu?" |

### Doporučení pro další iteraci (nerealizováno):

1. **Trust strip pod hero:** "Vygenerováno X+ dokumentů · Aktualizováno pro 2026 · Provozovatel identifikován: IČO 23660295"
2. **Pricing sekce — notice:** Pod každým tiered pricingem small print: "Softwarový nástroj, neposkytuje právní poradenství."
3. **CTA tlačítko v header:** Přidat "Vytvořit smlouvu" CTA do main nav (momentálně chybí).

---

## 4. BLOG → KONVERZE: SYSTÉM

### Stávající stav (dobrý základ):
- `ArticleInlineCta` komponenta (primární + subtle varianta) — implementována
- `ArticleTrustBox` komponenta (Generátor postačuje / Zvažte advokáta) — implementována
- BreadcrumbList JSON-LD na všech článcích ✓
- Article schema (ne NewsArticle pro evergreen) ✓
- Blog layout s IČO a O projektu odkazem ✓ (opraveno)

### Doporučení pro blog konverzní optimalizaci:

**A. Standardizovat umístění ArticleInlineCta:**
- Pozice 1: Za úvodní odstavec (první 200 slov)
- Pozice 2: Za nejdelší informační sekci (obvykle "Co musí obsahovat")
- Pozice 3: Před závěr (finální CTA)

**B. ArticleTrustBox — povinný prvek:**
Každý blog článek by měl mít ArticleTrustBox v druhé polovině článku. Audit ukázal, že ne všechny články ho mají.

**C. Exit-intent CTA (nerealizováno):**
Na mobilní verzi scrollové CTA — po srolování 70 % stránky sticky banner "Vytvořit [typ smlouvy] →".

**D. Blog → Landing page interní linking:**
Každý blog článek by měl odkazovat na odpovídající landing page (`/najemni-smlouva`, `/kupni-smlouva` atd.) — tyto mají vyšší SEO priority (0.95) a jsou optimalizovány jako konverzní vstupní body.

---

## 5. TOP 5 PRIORITNÍCH LANDING PAGES (SEO potenciál)

### Metodika hodnocení:
Search volume × konverzní potenciál × stávající obsah gap

---

**1. `/najemni-smlouva` — Nájemní smlouva (priority: 0.95)**
- Cílový keyword: "nájemní smlouva" (odh. 12 000–18 000 měs. hledání CZ)
- Stávající stav: ContractLandingSection, FAQPage schema
- Gap: Chybí AggregateRating schema, chybí odkaz na blog průvodce
- Akce: Doplnit guideHref="/blog/najemni-smlouva-vzor-2026", přidat FAQ blok s minimálně 5 otázkami

**2. `/kupni-smlouva` — Kupní smlouva (priority: 0.95)**
- Cílový keyword: "kupní smlouva" (odh. 8 000–12 000 měs. hledání CZ)
- Stávající stav: ContractLandingSection implementována
- Gap: Slabší FAQ sekce, chybí prolinkování na auto/movitá věc blog variace
- Akce: Rozlišit kupní smlouvu na movitou věc vs. nemovitost (nebo samostatné landing pages)

**3. `/pracovni-smlouva` — Pracovní smlouva (priority: 0.95)**
- Cílový keyword: "pracovní smlouva vzor" (odh. 6 000–9 000 měs. hledání CZ)
- Gap: Konkurence silná (MPSV, vzory.cz), diferenciace musí být na features ne ceně
- Akce: Přidat sekci "Co vzory zdarma neobsahují" s konkrétními příklady klauzulí

**4. `/darovaci-smlouva` — Darovací smlouva (priority: 0.93)**
- Cílový keyword: "darovací smlouva vzor zdarma" (odh. 4 000–7 000 měs.)
- Gap: Intenzivní konkurence na "zdarma" keywords — pozicionovat na kvalitu a specifika
- Akce: Separate landing pages pro darovací smlouva na nemovitost / na auto / na peníze

**5. `/dohoda-o-provedeni-prace` — DPP (priority: 0.95)**
- Cílový keyword: "dohoda o provedení práce" (odh. 5 000–8 000 měs.)
- Gap: Silná poptávka v Q1 každého roku (daňové přiznání context)
- Akce: Sezónní content push (leden–únor), přidat kalkulačku DPP limitu (300h/rok)

---

## 6. TRUST A COMPLIANCE LAYER

### Stávající stav (po úpravách):

| Prvek | Stav | Umístění |
|-------|------|----------|
| IČO provozovatele | ✅ | Homepage footer, blog footer, O projektu |
| Jméno provozovatele | ✅ | Všechny footery |
| "Není advokátní kanceláří" disclaimer | ✅ | Homepage footer, O projektu |
| cak.cz odkaz | ✅ | O projektu, kontakt, success page |
| Schema Organization s identifier | ✅ | Homepage JSON-LD |
| O projektu stránka | ✅ | Kompletní (provozovatel, metodika, co je/není) |
| Compliance note na success page | ✅ | Po platbě |

### Doporučení pro posílení (nerealizováno):

**Tier 1 — Pre-payment modal disclaimer:**
Před finálním platebním krokem zobrazit modal: "Tento dokument je standardizovaný vzor. Není náhradou za individuální právní poradenství. Provozovatel: Karel Zdeněk, IČO 23660295." — 1× per session.

**Tier 2 — Watermark na dokumentu:**
V zápatí každého vygenerovaného PDF: "Vygenerováno softwarovým nástrojem SmlouvaHned.cz — není náhradou za individuální právní poradenství." Drobné písmo, ale přítomné.

**Tier 3 — About box na každém generátoru:**
Na každé smlouvě (pod CTA nebo v sidebaru): "Tento generátor byl naposledy aktualizován [datum]. Šablona strukturována dle [§ OZ]. Nejste si jisti? Konzultujte s advokátem (cak.cz)."

---

## 7. SCHEMA MARKUP — STAV A DOPORUČENÍ

### Implementováno ✅:

| Schema type | Umístění | Poznámka |
|------------|----------|----------|
| Organization | homepage | + legalName, identifier (IČO), foundingDate |
| SoftwareApplication (BusinessApplication) | homepage | Opraveno z LegalApplication |
| FAQPage | homepage | 7 otázek |
| Article | všechny blog články | Správně (ne NewsArticle) |
| BreadcrumbList | všechny blog články | Správně implementováno |
| AboutPage | /o-projektu | + mainEntity Organization |
| SoftwareApplication (BusinessApplication) | všechny 14 contract layouts | Opraveno z LegalApplication |

### Doporučení pro doplnění:

**A. FAQPage na SEO landing pages:**
Stránky `/najemni-smlouva`, `/kupni-smlouva`, `/pracovni-smlouva` atd. by měly mít vlastní FAQPage schema — každá s 4–6 specifickými otázkami pro daný typ dokumentu.

**B. AggregateRating (po sběru hodnocení):**
Jakmile bude k dispozici alespoň 10 hodnocení, přidat AggregateRating do SoftwareApplication schema. Podmínka: hodnocení musí být reálná a ověřitelná (ne vykonstruovaná).

**C. HowTo schema na blog články:**
Články ve stylu "Jak vytvořit X smlouvu" jsou kandidáti na HowTo schema. Implementace: přidat do select blog articles (zejm. najemni-smlouva-vzor-2026, kupni-smlouva-na-auto-2026).

**D. BreadcrumbList na generátorech:**
Stránky `/najem`, `/auto` atd. nemají BreadcrumbList. Přidat: Domů → [Typ smlouvy].

**E. Co NEimplementovat:**
- ❌ LegalService schema — neposkytujeme právní služby
- ❌ NewsArticle pro evergreen content — správně nepoužíváme
- ❌ Product schema na tier pricing — AggregateOffer v SoftwareApplication je dostatečné
- ❌ AggregateRating bez reálných hodnocení — riziková praktika

---

## Appendix: Red-line tabulka (aktualizovaná)

| Formulace | Riziko | Stav |
|-----------|--------|------|
| "Právně validní základ" | Střední — implicitní claim o právní platnosti | ✅ Opraveno |
| "Rozšířená právní ochrana" (tier) | Střední — suggeruje právní produkt | ✅ Opraveno |
| "v souladu s platným českým právem" | Střední | ✅ Opraveno |
| "přesně pro vaši situaci" | Nízké–střední | ✅ Opraveno |
| "nemáte právní ochranu" | Střední — absolutní claim | ✅ Opraveno |
| "právní jistotu" (UI warnings) | Nízké | ✅ Opraveno |
| "Šablony strukturované dle platné legislativy ČR" | Přijatelné — faktické | Ponecháno |
| "strukturovaná dle § 2235 a násl. OZ" | Přijatelné — konkrétní paragraf | Ponecháno |
| "není advokátní kanceláří dle § 85/1996 Sb." | Vyžadováno — compliance | Ponecháno a posíleno |
