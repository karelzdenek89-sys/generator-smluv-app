# SmlouvaHned.cz — Finální homepage copy 10/10
*Připraveno k implementaci — verze 2026-04-03*

---

## Hlavní problém současné homepage

Stávající homepage osciluje mezi dvěma polohami, aniž by pevně zakotvila v jedné. Na jedné straně se tváří jako prodejní nástroj s urgentními CTA, na druhé straně se snaží budovat právní důvěryhodnost — a tyto dvě polohy si navzájem škodí. Uživatel s reálnou potřebou (pronajímatel, OSVČ, prodávající auto) nedostane rychlou odpověď na otázku: „Je tohle pro mě vhodné a proč to není totéž jako šablona z Googlu?" Chybí také precizní vymezení služby — co přesně dělá a co nedělá — které je pro právní produkt nezbytné jak z pohledu důvěry, tak z pohledu právní bezpečnosti.

**Tři konkrétní slabiny:**
1. Hero sekce popisuje výsledek (PDF, rychlost), ne hodnotu (strukturovaný proces, správné paragrafy, žádná improvizace).
2. Neexistuje silná odpověď na přirozený uživatelský námět: „Vygoogluji si šablonu zadarmo."
3. Chybí jasný disclaimer integrovaný do toku stránky — ne schovaný v patičce.

---

## Doporučená struktura homepage

Zachovány všechny požadované sekce. Pořadí mírně upraveno na základě conversion logiky:

```
1.  Hero sekce
2.  Trust / credibility strip
3.  Co služba dělá
4.  Proč ne šablona ani AI chat
5.  Jak služba funguje (kroky)
6.  Přehled typů dokumentů
7.  Co přesně získáte
8.  Kdy je služba vhodná
9.  Kdy služba vhodná není
10. Vymezení vůči individuální právní službě (disclaimer blok)
11. FAQ
12. Závěrečné CTA
13. Footer trust mikrocopy
```

**Změna oproti zadání:** Sekce „Co přesně získáte" je přesunuta před filtrační sekce „Vhodná / nevhodná". Nejprve ukážeme hodnotu, teprve pak uživatele filtrujeme. Disclaimer blok je zároveň samostatná sekce i součást footeru — aby byl viditelný bez scrollování dolů.

---

## Finální texty ke všem sekcím

---

### 1. HERO SEKCE
**Účel:** Okamžitě sdělit, co produkt je, pro koho je a proč má smysl. Nezaměnitelně odlišit od AI chatu, generického generátoru i od advokátní kanceláře.

---

**Headline (H1):**
Sestavte smlouvu správně.
Bez opisování šablon, bez improvizace.

**Subheadline:**
SmlouvaHned je online nástroj, který z vašich údajů sestaví standardizovaný smluvní dokument — strukturovaně, s aktuálními odkazem na občanský zákoník a připravený k podpisu. Pro běžné životní a podnikatelské situace, kde nepotřebujete advokáta, ale potřebujete mít vše v pořádku.

**Primární CTA:**
Vybrat typ smlouvy

**Sekundární CTA:**
Jak to funguje

**Pod CTA — mikrocopy (trust anchor):**
14 typů dokumentů · aktualizováno pro legislativu 2026 · výstup ve formátu PDF

---

### 2. TRUST / CREDIBILITY STRIP
**Účel:** Rychlé vizuální kotviště důvěryhodnosti. Fakta, ne superlativy. Zobrazit ihned pod hero sekcí.

---

**Položky (ikona + text):**

— Dokumenty sestavené podle občanského zákoníku a zákoníku práce
— Strukturovaný formulář, který vás provede každým krokem
— Výstup jako PDF dokument připravený k podpisu
— Bez registrace, bez předplatného — platíte jen za dokument
— IČO: 23660295 · Česká republika

*(Poznámka k implementaci: místo hvězdiček recenzí použijte konkrétní čísla, pokud je máte — např. „přes 4 200 sestavených dokumentů". Pokud ne, vynechejte a nahraďte faktickým claimem o aktualizaci dokumentů.)*

---

### 3. CO SLUŽBA DĚLÁ
**Účel:** Přesný, klidný popis fungování. Odpovídá na otázku: „Co to vlastně je?" Žádný marketingový jazyk.

---

**Nadpis:**
Co SmlouvaHned dělá

**Perex:**
SmlouvaHned je nástroj pro document automation — automatizované sestavení standardizovaného smluvního dokumentu na základě údajů, které zadáte do strukturovaného formuláře.

Nejde o právní poradenství. Nejde o AI, který generuje libovolný text. Jde o software, který z vašich konkrétních údajů sestaví dokument podle předem definované a právně ověřené struktury.

**Tři pilíře (formát: ikona + nadpis + věta):**

**Strukturovaný formulář**
Formulář vás provede krok za krokem. Ptá se na to, co do smlouvy patří — strany, předmět, podmínky, lhůty. Nic důležitého neopomenete.

**Standardizovaná struktura**
Každý typ dokumentu má přesně definovanou strukturu, která odpovídá běžné praxi a aktuální legislativě. Výsledek není „zhruba správný" — je konzistentní a úplný.

**Dokument připravený k podpisu**
Výstupem je PDF dokument, který si stáhnete ihned po dokončení formuláře. Zkontrolujete jej, podepíšete a použijete.

---

### 4. PROČ NEPOUŽÍT JEN BEZPLATNOU ŠABLONU NEBO AI CHAT
**Účel:** Nejsilnější obchodní sekce stránky. Musí být věcná, konkrétní a bez útočného tónu. Odpovídá na přirozený uživatelský odpor: „Vygoogluji si to zadarmo."

---

**Nadpis:**
Bezplatná šablona nebo AI chat nestačí. Tady je proč.

**Úvodní věta:**
Nejde o to, že šablony nebo AI chat jsou špatné. Jde o to, co s nimi uděláte dál — a co se stane, když to uděláte špatně.

---

**Sloupec 1: Bezplatná šablona z internetu**

Nadpis: Co šablona nedělá

- Neptá se vás na vaši konkrétní situaci. Dostanete generický dokument, do kterého opisujete — a nevíte, co smíte vynechat a co je povinné.
- Datum vydání šablony neznáte. Legislativa se mění — šablona z roku 2021 nemusí odpovídat zákoníku práce nebo občanskému zákoníku platném dnes.
- Šablona nehlídá vnitřní konzistenci. Pokud upravíte jednu klauzuli, neupozorní vás na to, že jiná klauzule je s ní v rozporu.
- Chybějící nebo nesprávně formulovaná ustanovení nejsou viditelná. Problém se projeví až při sporu.

---

**Sloupec 2: AI chat (ChatGPT, Gemini a podobné)**

Nadpis: Co AI chat nedělá

- AI generuje text, ne dokument. Výsledek závisí na tom, jak přesně formulujete dotaz — a většina lidí neví, na co se zeptat.
- AI nemá přístup k aktuálnímu znění zákonů. Pracuje s trénovacími daty, která mohou být zastaralá nebo nepřesná pro českou legislativu.
- Výstup z AI chatu je vždy jiný. Neexistuje žádná konzistentní struktura, žádná ověřená šablona — každý vygenerovaný dokument je unikátní, a ne nutně správný.
- AI chat vám nedá vědět, kdy se mýlí. Formulace může znít přesvědčivě, a přesto být právně nedostatečná nebo zavádějící.

---

**Sloupec 3: SmlouvaHned**

Nadpis: Co SmlouvaHned dělá jinak

- Formulář vás provede — neptáte se vy nás, my se ptáme vás. Systematicky, krok za krokem, bez toho, abyste museli vědět, co do smlouvy patří.
- Struktura dokumentu je pevně daná a ověřená. Nezávisí na tom, jak otázku formulujete.
- Dokumenty jsou pravidelně aktualizovány podle platné legislativy. Víte, že pracujete s aktuální verzí.
- Výstup je vždy konzistentní. Stejné zadání, stejný výsledek — žádná improvizace, žádná náhoda.

**Závěrečná věta sekce:**
SmlouvaHned není levnější náhrada advokáta. Je to nástroj pro situace, kdy advokáta nepotřebujete — ale potřebujete mít dokument sestavený správně.

---

### 5. JAK SLUŽBA FUNGUJE
**Účel:** Konkrétní, jednoduchý popis procesu. Tři nebo čtyři kroky. Žádná magie.

---

**Nadpis:**
Jak dokument vzniká

**Kroky:**

**Krok 1: Vyberte typ dokumentu**
Vyberte smlouvu nebo dokument, který potřebujete — nájemní smlouvu, kupní smlouvu, smlouvu o dílo, DPP a další. Každý typ má vlastní formulář.

**Krok 2: Vyplňte formulář**
Formulář vás provede krok za krokem. Zadáte údaje o stranách, předmětu, podmínkách a dalších náležitostech. Kde je to potřeba, vysvětlíme, co daná položka znamená.

**Krok 3: Zkontrolujte náhled**
Před zaplacením si zobrazíte, jak bude dokument vypadat. Máte přehled o tom, co kupujete.

**Krok 4: Stáhněte PDF**
Po platbě ihned stáhnete hotový PDF dokument připravený k podpisu. Žádné čekání, žádná e-mailová komunikace.

**Mikrocopy pod kroky:**
Celý proces trvá obvykle 5 až 15 minut v závislosti na typu dokumentu a množství zadávaných údajů.

---

### 6. PŘEHLED TYPŮ DOKUMENTŮ
**Účel:** Přehledný katalog dostupných dokumentů. Konkrétní, bez zbytečného popisování.

---

**Nadpis:**
Dostupné typy dokumentů

**Perex:**
SmlouvaHned pokrývá nejčastější smluvní potřeby fyzických osob a OSVČ. Všechny dokumenty jsou sestaveny v souladu s platnou českou legislativou.

**Kategorie a dokumenty (formát: název + jednořádkový popis):**

**Nájmy a nemovitosti**
- Nájemní smlouva — pronájem bytu nebo nebytového prostoru
- Podnájemní smlouva — přenechání najatého prostoru třetí osobě

**Koupě a prodej**
- Kupní smlouva na movitou věc — prodej vozidla, elektroniky, vybavení a podobně
- Kupní smlouva na auto — specifická varianta pro převod motorového vozidla

**Práce a spolupráce**
- Pracovní smlouva — pracovní poměr podle zákoníku práce
- Dohoda o provedení práce (DPP) — pro jednorázové nebo krátkodobé práce
- Smlouva o dílo — zakázková práce s definovaným výsledkem
- Smlouva o poskytování služeb — průběžná spolupráce nebo servis
- Smlouva o spolupráci — obchodní partnerství OSVČ nebo firem

**Finance a závazky**
- Smlouva o zápůjčce — půjčka peněz mezi fyzickými osobami nebo firmami
- Uznání dluhu — potvrzení závazku s obnovením promlčecí lhůty
- Darovací smlouva — bezúplatný převod věci nebo peněz

**Ostatní**
- Smlouva o mlčenlivosti (NDA) — ochrana důvěrných informací
- Plná moc — zmocnění k zastoupení při konkrétním úkonu

**CTA pod katalogem:**
Zobrazit všechny typy dokumentů

---

### 7. CO PŘESNĚ ZÍSKÁTE
**Účel:** Konkrétní, hmatatelný popis výstupu. Odpovídá na otázku „Co dostanu za své peníze?"

---

**Nadpis:**
Co dostanete

**Položky:**

**Strukturovaný PDF dokument**
Hotový dokument ve formátu PDF s kompletní strukturou odpovídající danému typu smlouvy — záhlaví, identifikace stran, smluvní ujednání, závěrečná ustanovení, místo pro podpisy.

**Aktuální legislativní základ**
Dokumenty obsahují relevantní odkazy na občanský zákoník, zákoník práce nebo jiný příslušný předpis. Pracujete s verzí aktualizovanou pro rok 2026.

**Konzistentní formulace**
Smluvní klauzule jsou formulovány standardním způsobem, který odpovídá běžné obchodní praxi. Neimprovizujete, neodhadujetě.

**Okamžitý přístup**
Po dokončení platby dokument ihned stáhnete. Není nutná registrace ani čekání.

**Přehledný formulář jako vedlejší produkt**
Vyplněním formuláře zároveň projdete všemi podstatnými otázkami, které smlouva řeší. I samotný proces vás přiměje promyslet si podmínky, které by jinak zůstaly nevyřčeny.

---

### 8. KDY JE SLUŽBA VHODNÁ
**Účel:** Přesně definovat cílové situace. Zvyšuje relevanci, snižuje nesprávné použití.

---

**Nadpis:**
Kdy SmlouvaHned použít

**Perex:**
Služba je navržena pro standardní, opakující se situace, kde stačí správně sestavený standardizovaný dokument.

**Typické situace (ikona + text):**

- Pronajímáte byt nebo pokoj a potřebujete nájemní smlouvu, která ošetřuje běžné podmínky.
- Prodáváte nebo kupujete auto nebo jinou movitou věc a chcete mít převod písemně doložen.
- Uzavíráte DPP nebo pracovní smlouvu pro zaměstnance na standardní pozici.
- Zadáváte nebo přijímáte zakázku a potřebujete smlouvu o dílo s jasným předmětem, cenou a termínem.
- Půjčujete nebo si půjčujete peníze a chcete mít podmínky vrácení písemně potvrzeny.
- Spolupracujete s partnerem nebo subdodavatelem a potřebujete ošetřit základní podmínky spolupráce.
- Potřebujete NDA pro chráněné sdílení informací při obchodním jednání.

---

### 9. KDY SLUŽBA VHODNÁ NENÍ
**Účel:** Odpovědné vymezení limitů. Buduje důvěru, filtruje nevhodné použití. Neodstrašuje — informuje.

---

**Nadpis:**
Kdy SmlouvaHned nestačí

**Perex:**
Ne každá situace je standardní. SmlouvaHned je vhodný pro běžné případy — pokud vaše situace obsahuje níže uvedené prvky, doporučujeme konzultaci s advokátem.

**Situace, kde je vhodná odborná právní pomoc:**

- Transakce s vysokou hodnotou nebo složitou majetkovou strukturou, kde závisí mnoho na přesném znění podmínek.
- Smluvní vztahy s mezinárodním prvkem nebo s aplikací cizího práva.
- Situace, kde jedna strana je spotřebitel a druhá podnikatel, a je potřeba ošetřit specifické spotřebitelské podmínky.
- Dokumenty, které mají být ověřeny notářem nebo schváleny úřadem.
- Případy, kde již existuje spor nebo hrozí právní řízení.
- Nestandardní ujednání, která vybočují z běžné praxe a vyžadují individuální formulaci.

**Závěrečná věta:**
Pokud si nejste jistí, zda vaše situace patří do standardní kategorie, konzultujte ji raději s advokátem předem. Cena konzultace je nižší než cena sporu.

---

### 10. VYMEZENÍ VŮČI INDIVIDUÁLNÍ PRÁVNÍ SLUŽBĚ (DISCLAIMER BLOK)
**Účel:** Klíčový právní a důvěryhodnostní prvek stránky. Musí být viditelný, jasný a klidný — ne schovaný v patičce malým písmem.

---

**Nadpis:**
Co SmlouvaHned není

**Text:**
SmlouvaHned je softwarový nástroj pro sestavení standardizovaných dokumentů. Neposkytuje individuální právní poradenství, právní zastoupení ani jakoukoli jinou regulovanou právní službu ve smyslu zákona o advokacii.

Dokument, který pomocí SmlouvaHned sestavíte, je standardizovaný výstup vzniklý automatickým zpracováním vámi zadaných údajů. Jeho obsah závisí na správnosti a úplnosti informací, které jste zadali. SmlouvaHned neodpovídá za právní důsledky dokumentu v konkrétní situaci, za chybně zadané údaje ani za okolnosti, které jsou nestandardní nebo nebyly při sestavení formuláře zohledněny.

Před podpisem doporučujeme dokument zkontrolovat a ujistit se, že odpovídá vaší skutečné situaci. U složitějších nebo nestandardních případů doporučujeme konzultaci s advokátem nebo notářem.

**Vizuální prvek (doporučení k implementaci):**
Tento blok by měl mít vizuálně odlišený rámeček — ne výstražný, ale klidný a seriózní (např. tenký levý border v neutrální barvě, mírně odlišené pozadí). Nesmí působit jako varování v drobném tisku, musí působit jako součást profesionální prezentace.

---

### 11. FAQ
**Účel:** Odpovědět na přirozené obavy uživatele ještě předtím, než odejde hledat odpovědi jinam.

---

**Nadpis:**
Časté otázky

---

**Q: Je SmlouvaHned náhradou advokáta?**

Ne. SmlouvaHned je softwarový nástroj pro sestavení standardizovaných dokumentů — není poskytovatelem právních služeb, neposkytuje právní poradenství ani právní zastoupení. Pro situace, kde potřebujete individuální právní analýzu, posouzení rizik nebo zastoupení, kontaktujte advokáta.

---

**Q: Jaký je rozdíl oproti AI chatu?**

AI chat (ChatGPT, Gemini a podobné) generuje text na základě vašeho dotazu — výsledek závisí na tom, jak přesně otázku formulujete, a může být pokaždé jiný. SmlouvaHned pracuje jinak: má pevně definovanou strukturu pro každý typ dokumentu, formulář vás systematicky provede všemi potřebnými údaji a výstup je vždy konzistentní. Neimprovizujeme, negenerujeme — sestavujeme.

---

**Q: Jaký je rozdíl oproti bezplatné šabloně z internetu?**

Bezplatná šablona je statický dokument, který opisujete. SmlouvaHned je strukturovaný formulář, který vás aktivně provede sestavením dokumentu. Nemusíte vědět, co do smlouvy patří — formulář se vás na to systematicky zeptá. Navíc víte, že pracujete s aktualizovanou verzí odpovídající platné legislativě — u náhodně stažené šablony to nevíte.

---

**Q: Kdo odpovídá za správnost údajů v dokumentu?**

Za správnost a úplnost zadaných údajů odpovídá uživatel. SmlouvaHned sestavuje dokument na základě informací, které mu poskytnete. Pokud zadáte nesprávné nebo neúplné údaje, výstup tyto nedostatky bude odrážet. Proto doporučujeme dokument před podpisem zkontrolovat.

---

**Q: Je SmlouvaHned vhodný i pro složitější případy?**

SmlouvaHned je optimalizován pro standardní situace — ty, kde stačí správně sestavený dokument běžného typu. Pro složitější nebo nestandardní případy — transakce s vysokou hodnotou, mezinárodní prvek, existující spor, specifická smluvní ujednání — doporučujeme konzultaci s advokátem. Snažíme se být upřímní ohledně toho, kde jsou limity tohoto nástroje.

---

**Q: Co přesně znamená, že dokument vzniká automaticky?**

Znamená to, že vámi zadané údaje jsou algoritmicky zpracovány a vloženy do předem definované dokumentové struktury. Nevytváříme žádný text „na míru" — kombinujeme vaše údaje s pevnou, ověřenou strukturou příslušného smluvního typu. Výsledkem je dokument, který obsahuje přesně to, co jste zadali, v správném smluvním formátu.

---

### 12. ZÁVĚREČNÉ CTA
**Účel:** Kultivovaný, nekřičící závěrečný impuls k akci. Znovu zopakovat hodnotu, ne urgenci.

---

**Nadpis:**
Sestavte dokument, který obstojí

**Text:**
Vyberte typ dokumentu, vyplňte formulář a stáhněte PDF připravené k podpisu. Pro standardní situace bez zbytečných komplikací.

**Primární CTA:**
Vybrat typ dokumentu

**Sekundární text pod CTA:**
14 typů dokumentů · bez registrace · od 249 Kč

---

### 13. FOOTER TRUST MIKROCOPY
**Účel:** Posilovat důvěru i v patičce stránky. Konkrétní fakta, ne marketingové fráze.

---

**Položky footeru (trust prvky):**

— SmlouvaHned.cz · IČO: 23660295 · Česká republika
— Dokumenty aktualizovány pro legislativu 2026
— Výstup ve formátu PDF, bez registrace
— SmlouvaHned není advokátní kancelář a neposkytuje právní poradenství

**Copyright linka:**
© 2026 SmlouvaHned.cz · Obchodní podmínky · Zásady zpracování osobních údajů

---

## 10 nejdůležitějších principů, které musí homepage dodržet

**1. Přesnost před přesvědčováním.**
Každá věta musí být fakticky správná a konkrétní. Žádný claim, který nelze doložit nebo který by mohl být vnímán jako příslib právní správnosti.

**2. Vymezení jako pilíř důvěry, ne jako varování.**
„Co SmlouvaHned není" a disclaimer nejsou povinnou nevítanou poznámkou — jsou součástí toho, čím se produkt odlišuje od pochybných konkurentů. Zobrazit prominentně, ne schovat.

**3. Hodnota nad rychlostí.**
Nezdůrazňovat „3 minuty" jako hlavní benefit — to evokuje lacině. Zdůrazňovat strukturovanost, konzistenci, aktuálnost a úplnost.

**4. Srovnání přes fakta, ne přes útok.**
Sekce o šablonách a AI chatu musí být věcná, ne sarkastická. Uživatel, který přišel přes Google s šablonou v záložce, musí odejít s pocitem, že byl informován — ne přesvědčován.

**5. CTA kultivovaně, ne urgentně.**
Žádné „Začněte hned", žádné „Nenechte to na poslední chvíli", žádné odpočítávání. Produkt je pro dospělé lidi, kteří si ho vybírají vědomě.

**6. Jedna informační hierarchie.**
Každá sekce odpovídá na jednu otázku. Nepřeplňovat. Uživatel nesmí cítit, že mu prodáváte — musí cítit, že mu vysvětlujete.

**7. Žádné superlativy bez důkazů.**
„Nejlepší", „nejkompletnější", „garantovaně správné" — zakázáno. Místo superlativů: konkrétní fakty. Místo „nejlepší smlouva" → „smlouva s odkazem na § 2235 OZ a standardními klauzulemi pro pronájem bytu".

**8. Právní produkt, ne marketingový produkt.**
Vizuální tón, délka vět, volba slov — vše musí signalizovat serióznost a profesionalitu. Uživatel má mít pocit, že pracuje s produktem, za kterým stojí odborníci, ne startup, který si hraje na právníka.

**9. Filtrace je součástí konverze.**
Sekce „Kdy služba vhodná není" neodstrašuje zákazníky — filtruje ty, kteří by stejně nebyli spokojeni, a zároveň buduje důvěru u těch, pro které je produkt skutečně určen. Nemazat ji ze strachu z nižší konverze.

**10. Konzistence hlasu od H1 po footer.**
Celá stránka musí mluvit jedním hlasem: klidným, přesným, seriózním. Nesmí existovat sekce, která „prodává" jinak než ostatní. Uživatel musí mít pocit, že stránku psal jeden autor s jasnou vizí — ne tým, kde každý přidal svůj marketingový střípek.

---

*Dokument připraven pro implementaci. Doporučujeme texty nepřekládat zpět do angličtiny ani neupravovat automatickými nástroji bez lidské kontroly — přesnost formulací je záměrná.*
