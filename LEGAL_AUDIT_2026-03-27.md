# SmlouvaHned.cz — Hluboký právně-produktový audit smluvních šablon
**Datum:** 27. 3. 2026 · **Auditor:** Senior legal-product architect · **Rozsah:** 14 smluv, lib/contracts.ts

> Tento audit se zaměřuje výhradně na **právní kvalitu, produktovou logiku, jazyk a generátorovou připravenost** smluvního obsahu. Technická/infrastrukturní kvalita je pokryta v AUDIT_2026-03-27.md.

---

## BLOK 1 — EXECUTIVE SUMMARY

### Celkový stav sady

Sada obsahuje 14 smluv pokrývajících nejčastější potřeby českého trhu. Technické provedení generátoru je solidní. **Právní kvalita je však nerovnoměrná** — od skutečně dobrých šablon (Smlouva o dílo, Nájemní smlouva, Uznání dluhu) až po šablony se závažnými, potenciálně neplatnými ustanoveními (Pracovní smlouva, DPP).

Průměrné celkové skóre sady: **7,0 / 10**. Na úroveň 10/10 chybí: odstranění právně neplatných klauzulí, oprava systémových produktových bugů a zpřesnění podmíněného textu.

---

### TOP 10 největších problémů celé sady

**P0 – Kritické (neplatné nebo nevymahatelné klauzule):**

1. **PRACOVNÍ SMLOUVA + DPP: Smluvní pokuta k tíži zaměstnance je ZAKÁZÁNA.** § 346d zákoníku práce zakazuje sjednání smluvní pokuty k tíži zaměstnance. Šablony tuto pokutu obsahují (50 000 Kč za mlčenlivost, 5 000 Kč za nesplnění úkolu v DPP). Celá klauzule je NEPLATNÁ. Jedná se o nejzávažnější právní chybu v celé sadě.

2. **SMLOUVA O ZÁPŮJČCE: Špatný odkaz na § 1793 OZ.** Bezúročná zápůjčka je označena jako "(§ 1793 OZ)" — ale § 1793 OZ je o neúměrném zkrácení (laesio enormis), nikoli o bezúplatnosti. Správně: odkaz na § 2390 odst. 1 OZ nebo bez odkazu.

3. **KUPNÍ SMLOUVA NA AUTO: Nerozhodný text o zástavním právu.** Formulace `"Vozidlo je/není předmětem zástavního práva: ano/ne"` dává dohromady oba výsledky do jednoho textu. Ve výsledném PDF bude stát "Vozidlo je/není předmětem zástavního práva: ne." — text, ze kterého nelze poznat, zda vozidlo zástavou je nebo není. Jedná se o produktový a právní bug ve třech řádcích sekce IV.

4. **DPP: Zastaralá daňová informace.** Šablona uvádí limit 10 000 Kč/měsíc pro odvody z DPP. Od 1. 7. 2024 platí kumulativní pravidla (zákon č. 349/2023 Sb.) — pokud má zaměstnanec DPP u více zaměstnavatelů a celková odměna překročí 17 500 Kč/měsíc (1/4 průměrné mzdy), je třeba odvody provést i u zaměstnavatelů, kde odměna nedosáhla 10 000 Kč. Šablona toto vůbec nezohledňuje a může uvést uživatele v omyl.

5. **PRACOVNÍ SMLOUVA: Chybí validace zkušební doby.** Zákoník práce § 35 stanoví maximum 3 měsíce (6 měsíců pro vedoucí zaměstnance). Generátor uživatele nevaruje, pokud zadá vyšší hodnotu — smlouva bude platná jen v zákonném rozsahu, ale uživatel o tom neví.

**P1 – Závažné (právní riziko nebo sporná vymahatelnost):**

6. **NÁJEMNÍ SMLOUVA: „Objektivní odpovědnost" nájemce je sporná.** Formulace v sekci XIII (Premium): "nájemce odpovídá za veškerou škodu způsobenou na předmětu nájmu bez ohledu na zavinění (objektivní odpovědnost)" — OZ nezná obecnou objektivní odpovědnost nájemce za škodu v bytě. Soud toto ustanovení pravděpodobně přezkoumá pohledem § 2913 OZ (zavinění). Formulace je přepálená.

7. **NÁJEMNÍ SMLOUVA: Náklady na znalce platí nájemce nad 70 % odhadu.** "Náklady na znalecký posudek nese nájemce, pokud výsledná škoda přesáhne 70 % znalcem odhadnuté částky" — jedná se o podmínku, která je nejasná a pravděpodobně nevymahatelná. Kdo hradí znalce jako zálohu? Co když soud znalce odmítne? Celá klauzule je prakticky nefunkční.

8. **SMLOUVA O ZÁPŮJČCE: Chybí varování na úrokový limit.** OZ (§ 1796 + judikatura) omezuje úrok z půjčky na cca 35–40 % p.a. (judikatorní limit lichvy). Pokud uživatel zadá vyšší úrok, klauzule bude neúčinná — ale systém ho nijak nevaruje.

9. **DPP + PRACOVNÍ SMLOUVA: Smluvní pokuta za mlčenlivost je neplatná.** Viz bod 1. Navíc formulace v DPP "zaměstnanec se vzdává práva na změnu díla" — část těchto vzdání se práv může být v rozporu s kogentními ustanoveními autorského zákona.

10. **PLNÁ MOC PRO NEMOVITOSTI: Chybí upozornění na nutnost ověření podpisu v BASIC verzi.** Katastr nemovitostí vyžaduje ověřený podpis na plné moci pro převod nemovitostí (§ 62 katastrálního zákona). V BASIC verzi toto upozornění chybí — uživatel může vygenerovat a podepsat neoověřenou plnou moc, která bude katastrem odmítnuta.

---

### TOP 10 největších příležitostí ke zlepšení

1. Přidat **datumové pole pro podpis smlouvy** do VŠECH šablon — nahradit `today()` (datum generování PDF) za datum zadané uživatelem.
2. Opravit formulaci zástavního práva v kupní smlouvě na auto — viz bod 3 výše.
3. Přidat **validaci zkušební doby** v pracovní smlouvě (max 3/6 měsíců).
4. Nahradit smluvní pokutu zaměstnance za **jinou formu ochrany zaměstnavatele** (smluvní pokuta za škodu způsobenou zaměstnavateli, která je v ZP povolena do výše 4,5násobku průměrného výdělku).
5. Aktualizovat **daňový text v DPP** na pravidla platná pro rok 2025/2026.
6. Přidat **interaktivní varování** při vysokém úroku v zápůjčce (nad 20 % p.a.).
7. Opravit odkaz na **§ 1793 OZ** v zápůjčce.
8. Přidat do plné moci pro nemovitosti upozornění na **ověření podpisu** i v BASIC verzi.
9. Rozdělit pole `"nar./IČO"` na dvě oddělená pole — **datum narození** (FO) vs **IČO** (PO/OSVČ) — pro profesionálnější výstup a lepší validaci.
10. Přidat volitelný modul **"Rozhodčí doložka"** do NDA, Smlouvy o spolupráci a Smlouvy o dílo.

---

### Nejsilnější 3 smlouvy

1. **Smlouva o dílo** — komplexní, vícepráce, pojištění, předávací protokol, dobré smluvní pokuty
2. **Nájemní smlouva** — předávací protokol v příloze, exekuční ochrana, detailní pravidla užívání
3. **Uznání dluhu** — jasná, přesná, správný § 2053 a § 639 OZ, exekuční doložka

### Nejslabší 3 smlouvy

1. **DPP** — neplatná smluvní pokuta, zastaralá daňová informace, přebujelá IP klauzule
2. **Pracovní smlouva** — neplatná smluvní pokuta, chybí validace zkušební doby
3. **Smlouva o spolupráci** — příliš obecná, špatně pojmenovaná sekce, chybí řešení pro ukončení

### Co opravit jako první

**P0 ihned:** Odstranit nebo přepsat smluvní pokutu k tíži zaměstnance (Pracovní smlouva, DPP). Opravit bug s textem zástavního práva v kupní smlouvě na auto. Opravit § 1793 v zápůjčce.

---

## BLOK 2 — AUDIT KAŽDÉ SMLOUVY

---

### 1. NÁJEMNÍ SMLOUVA

**Skóre:**
- Právní kvalita: 7/10
- Produktová kvalita: 9/10
- Jazyk / srozumitelnost: 8/10
- Generátorová připravenost: 8/10
- **Celkem: 8/10**

**Co je výborné:**
- Předávací protokol jako příloha přímo v generátoru — silná přidaná hodnota oproti free vzorům
- Výpočet celkové měsíční platby (nájemné + zálohy)
- Exekuční ochrana pronajímatele + notářský zápis (Premium) — skutečně hodnotný obsah
- Správná reference na § 67/2013 Sb. (vyúčtování služeb) a nařízení vlády č. 308/2015 Sb. (drobné opravy)
- Volitelné klauzule pro zvířata, kouření, Airbnb, podnikání — reálná UX hodnota

**Co je slabé:**
- Sekce XIII (Premium): "nájemce odpovídá za veškerou škodu bez ohledu na zavinění (objektivní odpovědnost)" — sporná formulace. OZ nezná objektivní odpovědnost nájemce jako zákonný princip.
- "Náklady na znalce platí nájemce, pokud škoda > 70 % odhadu" — prakticky nefunkční klauzule. Kdo zaplatí zálohu na znalce? Jak se „70 %" prokazuje?
- Kauce: checklist upozorňuje na max 3násobek, ale § 2254 OZ říká max **šestinásobek**. Checklist v pdf.ts je tedy přísnější než zákon — mohlo by zákazníka zmást.
- `today()` v záhlaví — datum generování PDF, ne datum podpisu. Pokud uživatel generuje PDF 3 dny po vyplnění formuláře, datum bude nesprávné.
- Při `depositAmount = 0` nebo `rentAmount = 0` vznikne výraz "tj. 0 násobek měsíčního nájemného" nebo výpočet Infinity.

**Právní rizika:**
- Objektivní odpovědnost nájemce je sporná a soud ji může odmítnout (§ 2913 OZ vyžaduje zavinění)
- Klauzule o notářském zápisu je správná, ale odkaz na § 71b notářského řádu bych rozepsal pro laika — formulace je komplexní

**Produktové chyby:**
- Záhlaví sekce "ZÁHLAVÍ SMLOUVY" jako název článku smlouvy působí neprofesionálně — smlouvy začínají "PREAMBULÍ" nebo rovnou I. SMLUVNÍ STRANY
- `paymentDay` je extrahováno regexem `.replace(/\D/g, '')` — pokud uživatel napíše "pátý", výsledek bude prázdný řetězec, smlouva bude mít prázdný den splatnosti

**Co upravit:**

**Klauzule "objektivní odpovědnost" — původní:**
> "nájemce odpovídá za veškerou škodu způsobenou na předmětu nájmu, na zařízení bytu, na společných částech domu i na majetku třetích osob, a to bez ohledu na zavinění (objektivní odpovědnost za škodu způsobenou užíváním bytu)"

**Nová doporučená formulace:**
> "Nájemce odpovídá za škodu způsobenou na předmětu nájmu, na zařízení bytu, na společných částech domu i na majetku třetích osob, a to v souladu s § 2913 a násl. OZ. Způsobil-li škodu nájemce nebo osoby, které nájemce vpustil do bytu, odpovídá nájemce za tuto škodu v plné výši bez ohledu na to, zda škodu způsobila konkrétní identifikovaná osoba."

**Klauzule znalecký posudek — původní:**
> "Pronajímatel si vyhrazuje právo nechat provést na náklady nájemce odborné znalecké ocenění škod přesahujících 10 000 Kč. Náklady na znalecký posudek nese nájemce, pokud výsledná škoda přesáhne 70 % znalcem odhadnuté částky."

**Nová doporučená formulace:**
> "Je-li výše škody sporná a přesahuje-li odhadovaná škoda 10 000 Kč, mohou strany na návrh pronajímatele nechat škodu posoudit soudním znalcem. Náklady znalce nese ta strana, jejíž odhad škody se od znaleckého posudku odchýlil o více než 30 %. Nedohodnou-li se strany, náklady znalce nese pronajímatel jako navrhovatel."

**Doporučené nové varianty:**
- Modul "Zvláštní ujednání o zvířatech" — podrobný formulář s popisem zvířete, kaucí navíc, povinností škod
- Modul "Krátkodobý nájem (Airbnb)" se všemi regulatorními povinnostmi

---

### 2. KUPNÍ SMLOUVA NA VOZIDLO

**Skóre:**
- Právní kvalita: 7/10
- Produktová kvalita: 7/10
- Jazyk / srozumitelnost: 7/10
- Generátorová připravenost: 7/10
- **Celkem: 7/10**

**Co je výborné:**
- VIN, SPZ, tachometr — základ pro právní jistotu
- Prohlášení o leasingu a zástavním právu
- Premium: servisní kniha, havárie, počet klíčů, pneumatiky — detailní obsah, který free vzory nemají
- Správná povinnost přepisu do 10 pracovních dnů (§ 8/56/2001 Sb.)
- Rozlišení okamžiku přechodu vlastnictví (platba vs. předání)

**Co je slabé:**
- **KRITICKÝ BUG** v sekci IV: Formulace `"Vozidlo je/není předmětem zástavního práva: ${yesNo(d.isPledged)}."` generuje ve výsledku nečitelný text. Při `isPledged = false` výsledek je: "Vozidlo je/není předmětem zástavního práva: ne." — nikdo neví, co to znamená.
- Technické parametry (barva, palivo, objem, výkon, STK) jsou pouze v Premium sekci VI — základní kupní smlouva na auto bez těchto dat je příliš obecná pro vozidla
- Datum první registrace je volitelné, ale u starších vozů je klíčové pro daňové účely
- Slovní vyjádření kupní ceny (`d.priceWords`) musí uživatel zadat ručně — chybí automatická konverze čísla na slova

**Právní rizika:**
- Formulace zástavního práva — viz kritický bug výše. V případě sporu je takový text bezcenný jako důkaz o stavu věci.
- `d.strictWarranties` — bez tohoto flagu se prodává "jak stojí a leží" — toto je OK pro B2B, ale pokud je kupujícím spotřebitel, zákonná odpovědnost za vady (§ 2161 OZ) platí vždy. Chybí upozornění na B2C vs B2B.

**Produktové chyby:**
- Záhlaví smlouvy: `today()` — viz systémový problém níže
- Chybí pole pro "číslo jednacího" nebo "číslo smlouvy" — u prodejců použitelné

**Co upravit:**

**Sekce IV — zástavní právo — původní:**
> `Vozidlo je/není předmětem zástavního práva: ${yesNo(d.isPledged)}.`

**Nová doporučená formulace:**
```typescript
d.isPledged
  ? 'Prodávající uvádí, že na vozidle VÁŽE zástavní právo. Podrobnosti: viz příloha.'
  : 'Prodávající prohlašuje, že vozidlo NENÍ předmětem zástavního práva.'
```
Stejná oprava pro `isInLeasing` a `hasThirdPartyRights`.

**Doporučené nové varianty:**
- Verze pro obchodní prodejce (dealer) — s odkazem na DPH, firemní identifikaci
- Verze pro dražbu/aukci — specifická ujednání o stavu vozidla

---

### 3. DAROVACÍ SMLOUVA

**Skóre:**
- Právní kvalita: 8/10
- Produktová kvalita: 7/10
- Jazyk / srozumitelnost: 8/10
- Generátorová připravenost: 7/10
- **Celkem: 7,5/10**

**Co je výborné:**
- Čtyři typy daru (peníze, auto, nemovitost, věc) — dobrá pokrytost
- Správná reference na § 2055 a násl. OZ
- Prohlášení o bezdluhovosti u nemovitosti/auta (Premium) je reálná přidaná hodnota
- Podmíněné darování (výminka) s lhůtou — velice dobré

**Co je slabé:**
- U nemovitostí: základní verze neupozorňuje na **nutnost ověřených podpisů** pro vklad do katastru. Uživatel si může vygenerovat smlouvu, podepsat ji bez ověření a katastr ji odmítne.
- Slovní vyjádření částky (`d.amountWords`) — musí zadat uživatel ručně. Při velké částce (např. 1 235 000 Kč) je to chybové. Minimálně validace, že pole není prázdné.
- `d.giftDate` je sice v záhlaví, ale pak sekce III v "Prohlášení" odkazuje na `today()` formulací — datum není konzistentní
- Premium: Podmíněné darování zmíněno jak v sekci III (záhlaví prohlášení), tak v sekci V (podmínky vrácení) — duplicitní zmínka s mírně odlišnými formulacemi může být matoucí

**Právní rizika:**
- U daru nemovitosti je nutné uvést parcelní číslo a způsob zápisu do KN. Smlouva uvádí "LV číslo" a "katastrální území", ale chybí "č. parcely/č. popisné" — katastr potřebuje přesnou identifikaci

**Co upravit:**

**Pro darovací smlouvu na nemovitost — přidat do záhlaví (VŠECHNY TIERY):**
> "⚠️ UPOZORNĚNÍ: Darovací smlouva na nemovitost musí mít úředně ověřené podpisy obou stran (notář nebo Czech POINT). Bez ověření podpisů katastr nemovitostí smlouvu odmítne."

**Doporučené nové varianty:**
- Verze pro dar mezi manžely ze SJM — vyžaduje souhlas druhého manžela (§ 714 OZ)
- Verze pro účelový dar (charitativní dar, dar nadaci) — specifické daňové dopady

---

### 4. SMLOUVA O DÍLO

**Skóre:**
- Právní kvalita: 8/10
- Produktová kvalita: 9/10
- Jazyk / srozumitelnost: 8/10
- Generátorová připravenost: 8/10
- **Celkem: 8,5/10** ← nejsilnější šablona sady

**Co je výborné:**
- Vícepráce jako Změnový list (číslovaný) — profesionální a prakticky velmi hodnotné
- Pojišťovací povinnost zhotovitele (Premium) s pojistným limitem — výborné pro stavební smlouvy
- Rozlišení: záloha / milníky / jednorázová platba — přesné a praktické
- Smluvní pokuta za prodlení i za vady — vyvážená, s cap 15 %
- Předávací protokol vs. faktické předání — správná podmíněnost

**Co je slabé:**
- `today()` v záhlaví — viz systémový bug
- Záruka: "24 měsíců" jako DEFAULT — pro stavební díla platí ze zákona 5 let (§ 2629 OZ). Default by měl být 24 měsíců pro "obecné dílo" a 60 měsíců pro stavbu. Bez rozlišení může uživatel neúmyslně sjednat kratší zákonnou záruku, než na jakou má právo.
- Sekce VII: Podmínka `d.withdrawalRight` — pokud je false, text je "Odstoupení se řídí ustanoveními OZ" — to je příliš vágní, ale OK jako fallback.

**Právní rizika:**
- Záruční lhůta 24 měsíců na stavbu je pod zákonným minimem 5 let (§ 2629 OZ). Pokud uživatel nechá default pro stavební dílo, záruční lhůta bude fakticky kratší zákonné.

**Produktové chyby:**
- Chybí pole pro určení "Typ díla" (stavba / software / umělecké dílo / řemeslo) — to by umožnilo podmíněně doporučit správnou záruční lhůtu

**Co upravit:**

**Záruční lhůta — doporučit validační varování:**
> Pokud `workTitle` nebo `workDescription` obsahuje klíčová slova (stavba, rekonstrukce, přístavba, demolice), zobrazit: "⚠️ U stavebních děl platí zákonná záruka 5 let (§ 2629 OZ). Doporučujeme zadat alespoň 60 měsíců."

**Doporučené nové varianty:**
- Verze pro softwarové dílo (IT smlouva o vývoji) — s SLA, zdrojovými kódy, akceptační procedurou
- Verze pro reklamní/grafické dílo — s licencí, výhradností, revizemi

---

### 5. SMLOUVA O ZÁPŮJČCE

**Skóre:**
- Právní kvalita: 6/10
- Produktová kvalita: 7/10
- Jazyk / srozumitelnost: 7/10
- Generátorová připravenost: 7/10
- **Celkem: 6,75/10**

**Co je výborné:**
- Rozlišení bezúročná/úročená, jednorázová/splátkový plán
- Zajištění pohledávky (ručení/zástava/směnka) v Premium — výborná přidaná hodnota
- Předčasné splacení bez pokuty u bezúročné — správné
- Postoupení pohledávky věřitelem — dobré pro obchodní použití

**Co je slabé:**
- **KRITICKÁ PRÁVNÍ CHYBA:** `"Zápůjčka je bezúročná (§ 1793 OZ)"` — § 1793 OZ je o **neúměrném zkrácení** (laesio enormis), nikoli o bezúplatnosti zápůjčky. Odkaz je zcela špatný.
- Chybí varování na limit lichvy: smluvní úroky nad přibližně 35–40 % p.a. jsou v ČR lichvou (judikatura NS). Pokud uživatel zadá 50 %, klauzule bude neúčinná. Systém to nijak nekontroluje.
- Splátky: chybí pravidlo o pořadí umořování (nejprve úroky, pak jistina) — standardní praxe, ale bez explicitního ujednání může být sporné (§ 1932 OZ).
- "Věřitel je oprávněn prohlásit zápůjčku okamžitě splatnou" (§ 2399 OZ) — odkaz je správný, ale text by měl upřesnit, zda musí věřitel zaslat písemné prohlášení a jaká je lhůta.

**Co upravit:**

**Bezúročná zápůjčka — původní:**
> `"Zápůjčka je bezúročná (§ 1793 OZ)."`

**Nová formulace:**
> `"Zápůjčka je sjednána jako bezúplatná (bezúročná). Vydlužitel je povinen vrátit věřiteli pouze zapůjčenou jistinu (§ 2390 odst. 1 OZ)."`

**Přidat do generátoru — validace úroku:**
Pokud `d.interestRate > 20`, zobrazit varování: "⚠️ Sjednaný úrok přesahuje 20 % p.a. Úroky vyšší než přibližně 35–40 % p.a. mohou být soudem označeny jako lichva a prohlášeny za neúčinné."

**Doporučené nové varianty:**
- Verze pro půjčku mezi firmami (B2B) — jiná pravidla pro lichvu
- Premium modul: Zástavní smlouva k movité věci jako příloha č. 1

---

### 6. SMLOUVA O MLČENLIVOSTI (NDA)

**Skóre:**
- Právní kvalita: 7/10
- Produktová kvalita: 8/10
- Jazyk / srozumitelnost: 8/10
- Generátorová připravenost: 7/10
- **Celkem: 7,5/10**

**Co je výborné:**
- Rozlišení jednostranná/oboustranná NDA
- Výjimky z důvěrnosti (veřejně dostupné, dříve známé, zákonná povinnost) — právně nezbytné, správně formulované
- Non-solicitation a non-compete (Premium) jako moduly
- Audit právo pro poskytovatele (Premium) — výborné pro tech firmy

**Co je slabé:**
- Non-compete klauzule: "24 měsíců po skončení smlouvy" bez omezení teritoria — u fyzických osob (OSVČ, freelancer) může být sporná, zejm. pokud není vymezena územní oblast. Upozornění by pomohlo.
- `d.nonCompeteScope` — volitelné pole, ale pokud nevyplněno, v PDF zůstane `__________`. Non-compete bez vymezení předmětu je nevymahatelná.
- "Přijímající strana prohlásí, že si je vědom důsledků" — chybí výslovné prohlášení o přijetí rizika při vyzrazení.
- Záhlaví: `"§ 1724 a násl. OZ (obecná ustanovení)"` — přijatelné, ale pro NDA je silnější kombinace s § 504 OZ (obchodní tajemství). Odkaz na § 504 je zmíněn jen v záhlaví, ne v těle smlouvy.

**Co upravit:**

**Non-compete — přidat povinnou teritoriální podmínku:**
> Pokud `d.nonCompete = true` a `d.nonCompeteScope` je prázdné, zablokovat generování a zobrazit: "⚠️ Non-compete bez vymezení předmětu podnikání a území je nevymahatelná. Vyplňte prosím pole 'Oblast nekonkurování'."

**Doporučené nové varianty:**
- Jednostranná NDA pro investory/VC (s carve-out pro investora)
- Zaměstnanecká NDA (odlišný právní rámec od B2B)

---

### 7. KUPNÍ SMLOUVA (OBECNÁ)

**Skóre:**
- Právní kvalita: 7/10
- Produktová kvalita: 6/10
- Jazyk / srozumitelnost: 7/10
- Generátorová připravenost: 6/10
- **Celkem: 6,5/10**

**Co je výborné:**
- Rozlišení typů zboží (auto, elektronika, ostatní)
- Prohlášení o bezdluhovosti (Premium) — dobré
- Zákonná odpovědnost za vady jako základ — správné

**Co je slabé:**
- Pro typ "auto" tato smlouva duplicitně pokrývá to, co Kupní smlouva na vozidlo — ale bez specializovaného obsahu (VIN, STK, přepis, TP). Uživatel může nevědomky zvolit nesprávnou šablonu.
- Premium sekce VI: "Kupující je oprávněn uplatnit práva z vadného plnění do 24 měsíců" — toto je **zákonné právo** (§ 2165 OZ), ne premium obsah! Prezentovat zákon jako prémiový benefit snižuje důvěryhodnost produktu.
- `d.price` vs `d.priceAmount` — v této smlouvě se používá `d.price`, zatímco jinde `d.priceAmount`. Nekonzistentní pojmenování polí.
- Výhrada vlastnictví (§ 2132 OZ) je jen zmínena jako "přechází okamžikem zaplacení" — mělo by být explicitní ustanovení o výhradě vlastnictví.
- Pro elektroniku: chybí identifikace výrobce, záruční list, datum prodeje.

**Co upravit:**

**Premium sekce VI — přeformulovat jako skutečné rozšíření:**
Zákonnou lhůtu 24 měsíců přesunout do základní sekce V, a v Premium nabídnout SMLUVNÍ záruku nad zákonný rámec:
> "Prodávající poskytuje smluvní záruku za jakost předmětu prodeje v délce [dle zadání, min. 25 měsíců], přesahující zákonnou lhůtu. V záruční době se bude reklamační řízení řídit těmito pravidly..."

**Doporučené nové varianty:**
- Verze pro B2C (podnikatel → spotřebitel) — s poučením o právu na odstoupení do 14 dnů (§ 1829 OZ)

---

### 8. PRACOVNÍ SMLOUVA

**Skóre:**
- Právní kvalita: 5/10
- Produktová kvalita: 7/10
- Jazyk / srozumitelnost: 8/10
- Generátorová připravenost: 6/10
- **Celkem: 6,5/10**

**Co je výborné:**
- Správná struktura dle § 34 ZP (druh práce, místo, nástup)
- Non-compete s peněžitým vyrovnáním — zákonně správné (§ 310 ZP)
- Výpovědní lhůta a způsoby ukončení — korektní
- Odkaz na ZP jako primární zákon — správné

**Co je slabé:**
- **KRITICKÁ PRÁVNÍ CHYBA:** Smluvní pokuta 50 000 Kč za porušení mlčenlivosti (Premium). § 346d ZP říká: "Zakazuje se sjednat v pracovněprávním vztahu smluvní pokutu k tíži zaměstnance." Tato klauzule je ABSOLUTNĚ NEPLATNÁ ze zákona. Celá sekce IX (Premium) musí být přepsána.
- Zkušební doba: `d.trialPeriodMonths` — žádná validace maximálního limitu (3/6 měsíců dle § 35 ZP). Pokud uživatel zadá 12 měsíců, smlouva bude nepsaná na 3 (nebo 6) měsíce, ale uživatel to neví.
- Chybí informace o BOZP vstupním školení — § 103 ZP ukládá zaměstnavateli povinnost zajistit školení BOZP před nástupem.
- Mzda: chybí reference na minimální mzdu / zaručenou mzdu. Pokud uživatel zadá mzdu pod minimem, systém ho nevaruje.
- Dovolená: zákon od 2021 říká, že do výpočtu dovolené se počítají "odpracované hodiny", ne týdny — formulace "4 týdny" je zjednodušení, ale pro laika přijatelné.

**Právní rizika:**
- Neplatná smluvní pokuta — viz výše. Navíc pokud je sjednána jako součást smlouvy a zaměstnanec ji podepíše, může mít pocit, že je vázán — zatímco právně není. To je dvojnásobně nebezpečné.

**Co upravit:**

**Sekce IX (Premium) — mlčenlivost, smluvní pokuta — PŘEPSAT KOMPLETNĚ:**

Původní (NEPLATNÉ):
> "Za porušení povinnosti mlčenlivosti náleží zaměstnavateli smluvní pokuta ve výši 50 000 Kč za každý případ porušení."

Nová doporučená formulace:
> "Zaměstnanec odpovídá zaměstnavateli za škodu způsobenou porušením povinnosti mlčenlivosti v souladu s § 257 a násl. ZP (omezení odpovědnosti zaměstnance za škodu na 4,5násobek průměrného měsíčního výdělku, pokud škoda nebyla způsobena úmyslně). Způsobí-li zaměstnanec škodu zaměstnavateli úmyslně nebo pod vlivem alkoholu, odpovídá za ni v plném rozsahu (§ 257 odst. 3 ZP). Smluvní pokuta k tíži zaměstnance se nesjednává (§ 346d ZP)."

**Přidat validaci zkušební doby:**
> Pokud `d.trialPeriodMonths > 3` (nebo > 6 pro vedoucí), zobrazit: "⚠️ Zkušební doba přesahuje zákonný limit 3 měsíce (§ 35 ZP). Smlouva bude platit jen na zákonný limit."

**Doporučené nové varianty:**
- Verze pro pracovní poměr na DPČ (dohoda o pracovní činnosti) — oddělená šablona
- Verze pro vedoucí zaměstnance — se 6měsíční zkušební dobou a manažerskými podmínkami

---

### 9. DOHODA O PROVEDENÍ PRÁCE (DPP)

**Skóre:**
- Právní kvalita: 5/10
- Produktová kvalita: 7/10
- Jazyk / srozumitelnost: 7/10
- Generátorová připravenost: 6/10
- **Celkem: 6,25/10** ← druhá nejslabší šablona

**Co je výborné:**
- Upozornění na limit 300 hodin ročně přímo v záhlaví — výborné
- IP klauzule (§ 58 AZ) — správná pro softwarový výstup z DPP
- Povinnost vrátit dokumenty po skončení — dobré

**Co je slabé:**
- **KRITICKÁ PRÁVNÍ CHYBA:** Smluvní pokuta 5 000 Kč za nesplnění úkolu a 500 Kč/den za prodlení (Premium). DPP je pracovněprávní vztah — § 346d ZP zakazuje smluvní pokutu k tíži zaměstnance. Stejná neplatná klauzule jako v pracovní smlouvě.
- **ZASTARALÁ DAŇOVÁ INFORMACE:** Limit 10 000 Kč/měsíc pro odvody je sice stále platný, ale od 1.7.2024 platí pravidlo kumulace u více zaměstnavatelů (zákon č. 349/2023 Sb.). Text je neúplný a může zavést uživatele.
- "zaměstnanec se vzdává práva na změnu díla, na nedotknutelnost díla a práva na autorský dohled" — vzdání se autorských práv (morálních) je v ČR přípustné jen u zaměstnaneckých děl dle AZ, a to v omezeném rozsahu. Formulace je příliš absolutní.
- "Na dohodu o provedení práce se nevztahují ustanovení zákoníku práce o pracovní době..." — toto platí, ale formulace je zavádějící. Některá ustanovení ZP se vztahují i na DPP (BOZP, antidiskriminace).

**Co upravit:**

**Smluvní pokuta v Premium — ODSTRANIT a nahradit:**

Původní (NEPLATNÉ):
> "Nesplní-li zaměstnanec sjednaný pracovní úkol řádně a včas bez závažného důvodu, je povinen zaplatit zaměstnavateli smluvní pokutu ve výši 5 000 Kč."

Nahradit za:
> "Nesplní-li zaměstnanec pracovní úkol řádně a včas, odpovídá zaměstnavateli za vzniklou škodu v rozsahu stanoveném § 257 ZP. Smluvní pokuta k tíži zaměstnance se nesjednává (§ 346d ZP). Zaměstnavatel si vyhrazuje právo nepřiznat odměnu nebo její část za neodevzdaný/nekvalitní výstup, a to na základě písemné reklamace doručené do 5 pracovních dnů od termínu odevzdání."

**Daňová poznámka — aktualizovat:**
> "Odměna z dohody o provedení práce u jednoho zaměstnavatele nepodléhá odvodům na sociální a zdravotní pojištění, nepřesahuje-li v daném měsíci 10 000 Kč. Má-li zaměstnanec DPP u více zaměstnavatelů a celková odměna ze všech DPP přesáhne v daném měsíci 17 500 Kč (1/4 průměrné mzdy), mohou odvody vzniknout u všech zaměstnavatelů. Zaměstnanec je povinen tuto skutečnost oznámit zaměstnavateli (zákon č. 349/2023 Sb.). Doporučujeme ověřit aktuální limity na webu ČSSZ nebo u daňového poradce."

---

### 10. SMLOUVA O POSKYTOVÁNÍ SLUŽEB

**Skóre:**
- Právní kvalita: 7/10
- Produktová kvalita: 7/10
- Jazyk / srozumitelnost: 7/10
- Generátorová připravenost: 7/10
- **Celkem: 7/10**

**Co je výborné:**
- Tři typy cen (hodinové, paušál, lump-sum) — pokrytí reálných scénářů
- DPH rozlišení plátce/neplátce — praktické
- IP klauzule: vše na klienta nebo licence — čistá volba
- SLA s procentní slevou (Premium) — hodnotné pro IT smlouvy

**Co je slabé:**
- Šablona je příliš obecná. Smlouva o poskytování "služeb" zahrnuje IT support, úklid, marketing, konzultace, zahradnictví i catering — pro každý typ je jiný právní kontext. SLA parametry (uptime, doba reakce) nedávají smysl pro fyzické služby.
- Pre-existing IP: smlouva neřeší, co se stane s know-how a nástroji, které poskytovatel vyvinul PŘED smlouvou a použil při ní.
- "Celková výše smluvní pokuty nepřesáhne 15 % z celkové ceny dle smlouvy" — u hodinových smluv není definována "celková cena" — cap je těžko aplikovatelný.
- Odkaz na "§ 1746 odst. 2 OZ" (inominátní smlouva) — pokud výsledkem je konkrétní dílo (projekt, aplikace), měla by být smlouva o dílo (§ 2586), ne o službách. Chybí upozornění pro uživatele.

**Co upravit:**

**Přidat do záhlaví upozornění:**
> "Tato šablona je vhodná pro průběžné nebo opakující se služby (konzultace, IT podpora, marketing, správa). Pokud výsledkem je konkrétní dílo (aplikace, stavba, projekt), použijte Smlouvu o dílo."

**Doporučené nové varianty:**
- Specializovaná verze pro IT služby (s SLA, ticketingem, bezpečností)
- Specializovaná verze pro marketingové/kreativní služby (s IP, revizemi, schvalovacím procesem)

---

### 11. PODNÁJEMNÍ SMLOUVA

**Skóre:**
- Právní kvalita: 7/10
- Produktová kvalita: 7/10
- Jazyk / srozumitelnost: 7/10
- Generátorová připravenost: 6/10
- **Celkem: 6,75/10**

**Co je výborné:**
- Upozornění na souhlas pronajímatele (§ 2274 OZ) přímo v záhlaví
- Zánik podnájmu s hlavním nájmem — správné a důležité
- Zákazový řetězec (Airbnb, kouření, zvířata) — dobré

**Co je slabé:**
- **PŘEKLEP V PDF:** `"Smluvní pokuta za neoprávněné dalšípodnajímání"` — chybí mezera ("další podnajímání"). Technická chyba ve výstupním dokumentu.
- Pokuta za prodlení s vyklizením: `Math.round(Number(d.rentAmount) * 2 / 30)` — pokud `rentAmount` není vyplněno, výsledek je 0 nebo NaN. V PDF bude "0 Kč za každý den prodlení" — nulová pokuta.
- Sekce VII: "každý den prodlení je podnájemce povinen platit podnájemné ve výši [rentAmount] Kč/den" — `rentAmount` je MĚSÍČNÍ nájem, ne denní! Bug: pokuta za den prodlení = celý měsíční nájem.
- Chybí příloha: souhlas vlastníka/pronajímatele s podnájmem (nebo alespoň odkazový modul).
- `consentDate` — pokud nevyplněno, zůstane `__________` v záhlaví smlouvy.

**Co upravit:**

**Překlep — opravit:**
> `"dalšípodnajímání"` → `"dalšího podnajímání"`

**Pokuta za prodlení s vyklizením — opravit:**
```typescript
// CHYBNÉ: d.rentAmount je měsíční
`platit podnájemné ve výši ${asText(d.rentAmount, '__________')} Kč/den`

// SPRÁVNÉ: denní sazba = měsíční / 30
const dailyPenalty = Number(d.rentAmount) > 0
  ? `${Math.round(Number(d.rentAmount) / 30)} Kč (tj. 1/30 měsíčního podnájemného)`
  : '__________'
```

---

### 12. PLNÁ MOC

**Skóre:**
- Právní kvalita: 6/10
- Produktová kvalita: 7/10
- Jazyk / srozumitelnost: 8/10
- Generátorová připravenost: 7/10
- **Celkem: 7/10**

**Co je výborné:**
- Čtyři typy zmocnění (nemovitost/soud/firma/banka/vlastní) — praktická pokrytost
- Substituce / zákaz substituce — dobré
- Jednorázová vs trvalá plná moc — správné rozlišení

**Co je slabé:**
- **ZÁKLADNÍ VERZE: CHYBÍ kritické upozornění pro nemovitosti.** Plná moc pro katastr musí mít ověřený podpis (§ 62 katastrálního zákona). V BASIC verzi není ani stopa o tomto požadavku. Uživatel vygeneruje, podepíše bez ověření a katastr odmítne.
- **Plná moc pro banku:** V praxi každá banka má vlastní formulář plné moci. Generovaný dokument může banka odmítnout jako nedostatečný. Chybí upozornění: "Ověřte u své banky, zda akceptuje plnou moc na tomto formuláři."
- **Zastoupení v soudním řízení:** Plná moc pro zastoupení u soudu může být omezena — v určitých řízeních je nutný advokát (§ 27 OSŘ). Generátor uživatele nevaruje.
- Rozsah zmocnění pro banku: "nakládání s účtem, vč. výběrů, vkladů a správy" — toto je extrémně široká plná moc. Pro bezpečnost by měla být omezena (limit výběru, časové omezení, výčet operací).

**Co upravit:**

**Přidat pro TYP 'property' — do všech tierů:**
> "⚠️ UPOZORNĚNÍ: Plná moc pro jednání s katastrem nemovitostí vyžaduje ÚŘEDNĚ OVĚŘENÝ podpis zmocnitele (notář nebo Czech POINT). Bez ověření katastr plnou moc odmítne."

**Pro TYP 'bank':**
> "⚠️ Upozornění: Banky zpravidla mají vlastní formuláře plných mocí a nemusí akceptovat obecný formulář. Ověřte u své banky, jaký formát vyžaduje."

---

### 13. UZNÁNÍ DLUHU

**Skóre:**
- Právní kvalita: 8/10
- Produktová kvalita: 7/10
- Jazyk / srozumitelnost: 7/10
- Generátorová připravenost: 8/10
- **Celkem: 7,5/10** ← třetí nejsilnější šablona

**Co je výborné:**
- Správný § 2053 OZ jako základ + § 639 OZ (10letá promlčecí lhůta) — přesné a hodnotné
- Různé tituly vzniku dluhu (půjčka/faktura/škoda/vlastní) — dobrá pokrytost
- Exekuční doložka (Premium) — notářský zápis s přímou vykonatelností — vynikající přidaná hodnota
- Okamžitá splatnost celého dluhu při prodlení — správné

**Co je slabé:**
- "nemá vůči věřiteli žádné kompenzační pohledávky" — termín "kompenzační pohledávky" není standardní. Správně: "nemá vůči věřiteli žádné pohledávky způsobilé k započtení (§ 1982 OZ)".
- Výše dluhu: šablona neuvádí, zda se jedná o dluh k **datu vzniku** nebo k **datu uznání** (může být rozdíl kvůli úrokům z prodlení). Doporučit explicitní ujednání.
- Chybí: upozornění, že uznání dluhu musí mít písemnou formu (§ 2053 OZ) — pro laika to nemusí být zřejmé.

**Co upravit:**

**Formulaci "kompenzační pohledávky" — nahradit:**
> `"nemá vůči věřiteli žádné pohledávky způsobilé k započtení (§ 1982 OZ), které by mohly snížit výši uznaného dluhu."`

---

### 14. SMLOUVA O SPOLUPRÁCI

**Skóre:**
- Právní kvalita: 6/10
- Produktová kvalita: 6/10
- Jazyk / srozumitelnost: 7/10
- Generátorová připravenost: 6/10
- **Celkem: 6,25/10** ← nejslabší šablona sady

**Co je výborné:**
- Revenue share / paušál — dvě reálné možnosti
- IP vlastnictví: joint / Strana A / každý si ponechá vlastní — tři scénáře
- Premium: mlčenlivost s pokutou, řešení sporů

**Co je slabé:**
- **CHYBNÁ POJMENOVÁNÍ:** Sekce VIII se jmenuje "OCHRANA OBCHODNÍHO TAJEMSTVÍ A ZÁKAZ KONKURENCE" — ale obsah je anti-poaching/non-solicitation ("nepřetahovat zaměstnance, klienty, dodavatele"), ne non-compete. Nepřesné pojmenování.
- Chybí: Co se stane s **aktivy a majetkem pořízeným v rámci spolupráce** při jejím ukončení? Bez tohoto ujednání je likvidace spolupráce sporná.
- Chybí: "Sdílené zákazníky" — kdo si je ponechá po ukončení? Smlouva to neřeší.
- Strana A / Strana B — příliš generické. Alespoň doporučit uživateli, aby pojmenoval strany reálnými rolemi (Dodavatel/Distributor, Vývojář/Investor atd.)
- Revenue share: "50 %/50 %" jako default — ale bez definice základny pro výpočet (hrubé příjmy? čisté příjmy? po odečtení nákladů?). Toto vede ke sporům.
- Záhlaví smlouvy: "§ 1746 odst. 2 OZ" je inominátní — OK, ale chybí upozornění, že pokud je spolupráce de facto podnikání, může vzniknout tichá společnost (§ 2747 OZ) se závazky.

**Co upravit:**

**Revenue share — zpřesnit základ výpočtu:**
```
Smluvní strany si rozdělí [hrubé/čisté příjmy – zvolte] z předmětu
spolupráce v poměru X % : Y %. Základem pro výpočet jsou [fakturované
příjmy / přijaté platby / příjmy po odečtení přímých nákladů] za
příslušné [měsíční/čtvrtletní] zúčtovací období.
```

**Přejmenovat sekci VIII:**
> "VIII. POVINNOST MLČENLIVOSTI, OCHRANA INFORMACÍ A NON-SOLICITATION"

**Doporučené nové varianty:**
- Verze pro joint-venture / společný projekt (de facto tiché společenství)
- Verze pro agenturní spolupráci (principal/agent)

---

## BLOK 3 — SYSTÉMOVÁ DOPORUČENÍ PRO GENERÁTOR

### Universální povinná pole (všechny smlouvy)

| Pole | Validace | Chování při chybě |
|---|---|---|
| Datum smlouvy | ISO datum, musí být přítomno | Zablokovat generování |
| Jméno smluvní strany 1 | min. 3 znaky, ne prázdné | Zablokovat generování |
| Jméno smluvní strany 2 | min. 3 znaky, ne prázdné | Zablokovat generování |
| Adresa smluvní strany 1 | min. 5 znaků | Varování |
| Adresa smluvní strany 2 | min. 5 znaků | Varování |

### Identifikační čísla — rozdělit pole

Stávající `"nar./IČO"` kombinované pole nahradit dvěma poli:
- **"Typ osoby"**: Fyzická osoba / Podnikatel (OSVČ) / Právnická osoba
- Podle výběru zobrazit: Datum narození (FO) nebo IČO (OSVČ/PO)

### Datum smlouvy — systémová oprava

Aktuální `today()` generuje datum v okamžiku stažení PDF. Nahradit **vždy** polem `contractDate`, které uživatel zadá v builderu. Default hodnota = dnešní datum při otevření formuláře. Zachovat jako skryté pole předvyplněné.

```typescript
// Místo: `Datum uzavření smlouvy: ${today()}`
// Použít: `Datum uzavření smlouvy: ${d.contractDate ? formatDate(d.contractDate) : today()}`
// (Smlouva o dílo a DPP toto již dělají správně — rozšířit na všechny)
```

### Smlouva-specifické validace

**Pracovní smlouva + DPP:**
- `trialPeriodMonths > 3` (resp. > 6) → hard warning
- Mzda < aktuální minimální mzda → hard warning s přesnou hodnotou

**Nájemní smlouva:**
- `depositAmount > rentAmount * 6` → varování (zákonný limit § 2254 OZ je 6násobek)
- `paymentDay` musí být číslo 1–28 → validace

**Smlouva o zápůjčce:**
- `interestRate > 20` → varování na lichvu
- `interestRate > 35` → hard warning (pravděpodobná lichva)
- Bezúročná → opravit odkaz § 1793 na § 2390 OZ

**NDA:**
- `nonCompete = true` a `nonCompeteScope = prázdné` → zablokovat generování

**Plná moc:**
- `poaType = 'property'` → VŽDY zobrazit upozornění na ověření podpisu, bez ohledu na tier

### Conditional rendering — co skrývat

- Emailová adresa: skrýt celý řádek, pokud prázdné (již implementováno — zachovat)
- Technické parametry vozidla: základní verze zobrazí jen VIN, SPZ, tachometr; vše ostatní v Premium
- Notářský zápis v nájemní smlouvě: skrýt, pokud hodnota nájmu < 5 000 Kč/měsíc (nevhodné pro garsonky)

### Přílohy generované automaticky

| Smlouva | Příloha | Podmínka |
|---|---|---|
| Nájemní | Předávací protokol | Vždy |
| Podnájemní | Předávací protokol | Vždy |
| Kupní (auto) | Předávací protokol vozidla | Pokud `handoverDate` vyplněno |
| Smlouva o dílo | Změnový list (prázdný formulář) | Premium |
| DPP | Výkaz hodin (prázdný formulář) | Pokud `remunerationType = hourly` |

### Blokování generování

Zablokovat "Stáhnout smlouvu" (zobrazit červené varování) při:
- Pracovní smlouva: `trialPeriodMonths > 6` (nejen varování, ale hard block)
- NDA + non-compete: `nonCompeteScope` prázdné
- Jakákoli smlouva: klíčové pole obsahuje doslovně `"____________________"` (emptyLine) — uživatel nevyplnil pole a prošel validací

### Právní upozornění (tooltips a infoboxes)

- Darovací smlouva (nemovitost): "Vyžaduje ověřené podpisy"
- Plná moc (nemovitost/soud): "Vyžaduje ověřené podpisy"
- DPP: "Zkontrolujte aktuální limit pro odvody na ČSSZ.cz"
- Zápůjčka s úrokem > 20 %: "Vysoký úrok — riziko neplatnosti"
- Pracovní smlouva (zkušební doba): "Max. 3 měsíce (6 pro vedoucí)"

---

## BLOK 4 — PRIORITNÍ IMPLEMENTAČNÍ ROADMAPA

### P0 — Kritické chyby (opravit okamžitě, před jakýmkoliv marketingem)

---

**P0-01: Neplatná smluvní pokuta v Pracovní smlouvě a DPP**
- Co změnit: Odstranit `d.breachPenalty` smluvní pokutu v sekci IX pracovní smlouvy a sekci VIII DPP. Nahradit ustanovením o odpovědnosti za škodu dle § 257 ZP.
- Proč důležité: Absolutně neplatné ze zákona (§ 346d ZP). Pokud zákazník tuto klauzuli použije a spoléhá se na ni, smlouva ochranu neposkytne.
- Dopad na důvěru: **Kritický** — pokud se to dostane k právníkovi zákazníka, celý produkt bude zdiskreditován.
- Dopad na právní bezpečnost: **Kritický**.
- Dopad na konverzi: Nepřímý, ale zásadní.

---

**P0-02: Bug s textem zástavního práva v kupní smlouvě na auto**
- Co změnit: Nahradit `yesNo(d.isPledged)` → podmíněný text "VÁŽE / NEVÁŽE zástavní právo". Totéž pro `isInLeasing` a `hasThirdPartyRights`.
- Proč důležité: Stávající text je v PDF nečitelný a bezcenný jako právní prohlášení.
- Dopad na důvěru: Vysoký — zákazník/kupec uvidí nonsens v právním dokumentu.
- Dopad na právní bezpečnost: Střední — prohlášení prodávajícího je v podstatě prázdné.
- Dopad na konverzi: Střední.

---

**P0-03: Špatný odkaz § 1793 v zápůjčce**
- Co změnit: `"bezúročná (§ 1793 OZ)"` → `"bezúplatná (§ 2390 odst. 1 OZ)"` nebo bez odkazu.
- Proč důležité: § 1793 OZ je zcela jiné ustanovení (neúměrné zkrácení). Chyba signalizuje necvičenou právní kontrolu.
- Dopad na důvěru: Vysoký pro zákazníky s právním vzděláním.
- Dopad na právní bezpečnost: Nízký (odkaz je jen informativní, samotný závazek platí).

---

**P0-04: Překlep "dalšípodnajímání" v podnájemní smlouvě**
- Co změnit: Opravit překlep v Premium sekci IX podnájemní smlouvy.
- Proč důležité: Překlep ve smluvním textu působí neprofesionálně a snižuje důvěru v celý produkt.
- Dopad na důvěru: Střední.

---

**P0-05: Bug denní pokuty v podnájmu (měsíční = denní)**
- Co změnit: V sekci VII podnájemní smlouvy opravit výpočet denní sazby (rentAmount/30).
- Proč důležité: Pokuta za den prodlení rovna celému měsíčnímu nájmu je právně nepřijatelná (§ 2050 OZ — nepřiměřenost) a de facto nevymahatelná.

---

### P1 — Právní bezpečnost

---

**P1-01: Validace zkušební doby v pracovní smlouvě**
- Co změnit: Přidat JS validaci — `trialPeriodMonths > 3` (nebo > 6) → zobrazit varování před generováním.
- Proč důležité: Zákoník práce § 35 — neplatná zkušební doba. Uživatel ani neví, že smlouva neplatí v zadaném rozsahu.
- Dopad na konverzi: Pozitivní — zodpovědný produkt.

---

**P1-02: Upozornění na ověření podpisu u plné moci pro nemovitosti**
- Co změnit: Přidat info box do builderu plné moci pro typ "property" a "court" — "Vyžaduje ověřený podpis".
- Proč důležité: Bez ověření katastr odmítne. Uživatel zaplatí, stáhne, podepíše bez ověření = zmařená smlouva.

---

**P1-03: Aktualizace daňové poznámky v DPP**
- Co změnit: Přepsat text o odvodech z DPP dle aktuálních pravidel (zákon č. 349/2023 Sb.).
- Proč důležité: Nesprávná daňová informace může zákazníka nebo zaměstnavatele uvést do problémů s ČSSZ.

---

**P1-04: Varování na lichvu v zápůjčce**
- Co změnit: Přidat validaci `interestRate > 20` → soft warning, `> 35` → hard warning.
- Proč důležité: Zákazník nevědomky uzavře smlouvu s právně neúčinným úrokem.

---

**P1-05: Upozornění na ověřené podpisy u darovací smlouvy na nemovitost**
- Co změnit: Přidat podmíněný info box pro `giftType = 'property'`.
- Proč důležité: Identický problém jako u plné moci — smlouva bez ověření podpisů je pro katastr bezcenná.

---

### P2 — Produktové zlepšení

---

**P2-01: Datum smlouvy jako samostatné pole ve VŠECH šablonách**
- Co změnit: Nahradit `today()` za `d.contractDate ? formatDate(d.contractDate) : today()` u všech smluv, kde chybí (darovací, NDA, podnájemní, nájemní v záhlaví).
- Proč důležité: Zákazník generuje PDF den po vyplnění formuláře — datum je nesprávné. Toto je produktová chyba viditelná na každém dokumentu.

---

**P2-02: Rozdělit pole "nar./IČO" na typ osoby + příslušné pole**
- Co změnit: Přidat volbu "Fyzická osoba / Podnikatel / Firma" → zobrazit datum narození nebo IČO.
- Proč důležité: Aktuální kombinace "nar./IČO" vypadá neprofesionálně. Zákazník si sám musí tipovat, co zadat.

---

**P2-03: Přesunout zákonnou záruční lhůtu z Premium do Basic (kupní smlouva obecná)**
- Co změnit: V sekci V základní kupní smlouvy uvést zákonnou lhůtu 24 měsíců (§ 2165 OZ). V Premium nabídnout smluvní rozšíření.
- Proč důležité: Prezentovat zákon jako premium obsah je zavádějící.

---

**P2-04: Validace a autokonverze částky na slova**
- Co změnit: Přidat automatickou konverzi čísla na česká slova pro pole `d.amountWords`, `d.priceWords`, `d.loanAmountWords`, `d.debtAmountWords`.
- Proč důležité: Uživatelé chybují v slovním vyjádření, zejm. u vyšších částek.

---

**P2-05: Záruční lhůta u stavebního díla**
- Co změnit: Přidat upozornění při `warrantyMonths < 60` pokud typ díla obsahuje klíčová slova pro stavbu.
- Proč důležité: Zákon § 2629 OZ — minimální záruka 5 let pro stavby. Zákazník si ji zkrátí, aniž by věděl.

---

### P3 — Premium features

---

**P3-01: Rozhodčí doložka jako volitelný modul**
- Přidat do: NDA, Smlouva o spolupráci, Smlouva o dílo, Smlouva o službách
- Obsah: Rozhodčí doložka odkazující na RSHK ČR nebo ad hoc rozhodce, s výběrem počtu rozhodců, jazyka a místa.

---

**P3-02: Automatická konverze DPP na DPČ při překročení 300 hodin**
- Přidat: Pokud `estimatedHours > 300`, zobrazit: "Rozsah přesahuje zákonný limit DPP. Zvažte Dohodu o pracovní činnosti (DPČ)."

---

**P3-03: Premium verze NDA pro investory / M&A**
- Přidat: Speciální šablona NDA pro due diligence — s carve-outem pro poradce investora, s destrukcí podkladů po zamítnuté investici.

---

**P3-04: Tichá společnost / joint venture jako variant smlouvy o spolupráci**
- Přidat: Pro případy, kdy spolupráce fakticky vytváří společný podnik — upozornění + odkaz na § 2747 OZ + zvláštní ujednání pro vedení účetnictví a majetku.

---

**P3-05: SEO landing pages pro zbývajících 9 smluv**
- Přidat SEO stránky pro: /nda, /darovaci, /pujcka, /sluzby, /smlouva-o-spolupraci, /plna-moc, /uznani-dluhu, /podnajem, /kupni
- Každá stránka: 600+ slov, FAQ schema, interní prolinkování.

---

## Závěrečné hodnocení

> **Kdybych měl dnes pustit jen 5 smluv do ostrého placeného provozu, byly by to: Smlouva o dílo, Nájemní smlouva, Uznání dluhu, NDA, Kupní smlouva na vozidlo.**
