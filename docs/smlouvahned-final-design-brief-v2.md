# SmlouvaHned.cz — Final Design Brief v2.0
**Autor:** Senior Product Designer / Creative Director / SaaS Design Architect
**Datum:** Q2 2026 | Standard: 10/10 Quiet Luxury Legal SaaS

---

## 1. CREATIVE DIRECTION

**Definice jednou větou:**
> *Přesnost švýcarských hodinek ve vizuálním kabátě moderního dark SaaS — dokument jako umělecký artefakt, nástroj jako důkaz řemeslné kompetence.*

### Emocionální dojem
Uživatel otevře stránku a první tři vteřiny jsou tiché. Nic na něj nekřičí. Nenabídne se mu animované rušno, žádná karusel reklama, žádný přehlcený hero s pěti ikonami. Místo toho: hluboká tmavá plocha, jemně osvětlená amber glow, čistá typografie, a floating glass karta dokumentu — jako by byl produkt prezentován v showroomu luxusního designového studia.

Pocit není "tady se dělají smlouvy". Pocit je: **"tady se věci dělají správně."**

Emocionální trajektorie návštěvníka:
1. Klid — tmavé pozadí, prostor, nic neruší
2. Důvěra — čisté typo, jasná hierarchie, žádné přehnané sliby
3. Zájem — floating PDF preview jako přirozená demonstrace výstupu
4. Porozumění — clear value prop bez žargonu do 6 sekund
5. Akce — CTA je přirozené vyvrcholení, ne přepadení

### Jak se lišit od českých SaaS webů
Česká SaaS scéna 2026 se vizuálně drží dvou extrémů: buď korporátní šedivý corporate design z roku 2018, nebo přeplácaný hero s gradientem, blob animacemi a 8 různými ikonami nad headlinem. Obojí je špatně.

SmlouvaHned musí být třetí cesta:
- **Méně, ale lépe.** Každý element na stránce musí vydělávat své místo.
- **Hmota místo efektu.** Glass efekty jako textura, ne jako show.
- **Spacing jako design element.** Prázdný prostor je luxus.
- **Typografie jako identita.** Inter Black v display velikostech nese víc než jakákoli ikona.

### Jak skloubit legal-tech důvěru s premium vzhledem
Klíčová rovnice: **důvěra = konzistence + čitelnost + transparentnost**.

Glass a dark estetika nesnižuje důvěryhodnost — snižuje ji chaos, přeplněnost a vizuální nesoudržnost. Prémiový dark design naopak:
- signalizuje, že za produktem stojí někdo, kdo věci bere vážně
- navozuje asociaci s high-end softwarem (Notion, Linear, Vercel)
- vytváří vizuální klid, který je psychologicky konzistentní s vážností právního dokumentu

Toho dosáhneme: **tichý luxus, ne vizuální hluk.**

---

## 2. VIZUÁLNÍ SMĚR

### Pozadí
```
Base:       #04070E  — void black s chladným modrým podtónem
Layer:      #080D18  — sekundární povrchy, karty, sidebary
Elevated:   #0C1220  — glass elevated báze (modal, tooltip)

ZÁSADA: background je canvas, ne prvek designu.
Nikdy nepoužívat gradient jako pozadí celé stránky.
Ambient glow: max 2 radial-gradient za celý viewport, oba subtle.
```

### Barevná paleta
```
AMBER (primární akcent)
  amber-500:   #F59E0B   — CTA, aktivní stav, highlight text
  amber-400:   #FCD34D   — hover, secondary accent
  amber-glow:  rgba(245,158,11,0.12)  — halo za CTA buttonem
  amber-tint:  rgba(245,158,11,0.08)  — jemný tint karet

NEUTRAL
  white:       #FFFFFF   — display headings (H1, H2)
  slate-200:   #E2E8F0   — secondary headings
  slate-400:   #94A3B8   — body copy
  slate-500:   #64748B   — meta text, labels
  slate-600:   #475569   — fine print, legal notes
  slate-700:   #334155   — dividers

SEMANTIC
  emerald-400: #34D399   — success badges, garance
  blue-400:    #60A5FA   — metodika, info
  red-400:     #F87171   — srovnávací tabulka (špatné)
```

### Glass Materiály — 4 vrstvy
```
LAYER 0 — Nebarvený základ (body pozadí)
  bg: #04070E, žádný blur

LAYER 1 — Standardní karta (většina karet, sekce)
  background:      rgba(8,13,24,0.65)
  backdrop-filter: blur(20px) saturate(160%)
  border:          1px solid rgba(255,255,255,0.06)
  border-top:      1px solid rgba(255,255,255,0.12) ← luminous hrana
  Použití: feature cards, process steps, FAQ, audience cards

LAYER 2 — Elevated karta (pricing featured, speciální sekce)
  background:      rgba(10,15,28,0.78)
  backdrop-filter: blur(28px) saturate(180%) brightness(1.05)
  border:          1px solid rgba(245,158,11,0.22)
  border-top:      1px solid rgba(245,158,11,0.42)
  box-shadow:      0 0 60px -12px rgba(245,158,11,0.16)
  Použití: featured pricing, highlight CTA, final CTA panel

LAYER 3 — Floating element (PDF preview, modaly)
  background:      rgba(12,18,32,0.85)
  backdrop-filter: blur(40px) saturate(200%) brightness(1.10)
  border:          1px solid rgba(255,255,255,0.10)
  border-top:      1px solid rgba(255,255,255,0.20)
  box-shadow:
    0 1px 0 rgba(255,255,255,0.07) inset,
    0 8px 16px -2px rgba(0,0,0,0.6),
    0 32px 64px -8px rgba(0,0,0,0.5),
    0 0 80px -20px rgba(245,158,11,0.08)
  Použití: navbar, floating PDF preview
```

### Blur Systém — záměrné gradace
```
Micro blur:   blur(8px)   — navbar background (nízká intenzita)
Soft blur:    blur(20px)  — standardní glass karta (layer 1)
Medium blur:  blur(28px)  — elevated karta (layer 2)
Deep blur:    blur(40px)  — floating element (layer 3)

PRAVIDLO: nikdy dva elementy se stejným blurem vedle sebe.
Kontrast blur vrstev vytváří hloubku. Bez kontrastu = plochý výsledek.
```

### Borders
```
Základní:       1px solid rgba(255,255,255,0.06)
Glass standard: 1px solid rgba(255,255,255,0.08)
Luminous top:   1px solid rgba(255,255,255,0.14)  ← vždy na top edge
Amber border:   1px solid rgba(245,158,11,0.20)
Amber top:      1px solid rgba(245,158,11,0.40)
Divider:        1px solid rgba(255,255,255,0.04)

ZÁSADA: Top edge karty je vždy nejsvětlejší — simuluje osvětlení shora.
Spodní a boční hrany jsou tmavší. Tohle dělá rozdíl mezi levnou a luxusní glass kartou.
```

### Stíny — 3 vrstvy
```
Shadow-card:
  0 1px 0 rgba(255,255,255,0.04) inset,
  0 1px 2px rgba(0,0,0,0.4),
  0 8px 32px -4px rgba(0,0,0,0.35)

Shadow-floating:
  0 1px 0 rgba(255,255,255,0.07) inset,
  0 4px 8px -1px rgba(0,0,0,0.5),
  0 20px 60px -8px rgba(0,0,0,0.45),
  0 0 0 1px rgba(255,255,255,0.06)

Shadow-cta:
  0 0 0 1px rgba(245,158,11,0.35),
  0 4px 16px rgba(245,158,11,0.22),
  0 8px 32px rgba(245,158,11,0.10)
```

### Glow — Amber ambient
```
Hero glow (za PDF preview):
  radial-gradient(ellipse 50% 40% at 75% 50%,
    rgba(245,158,11,0.14), transparent 60%)

Section glow (přechody sekcí):
  radial-gradient(ellipse 80% 30% at 50% 0%,
    rgba(245,158,11,0.06), transparent 50%)

PRAVIDLO: Max 2 amber glow oblasti na celou stránku.
Více = laciné. Méně = elegantní.
```

### Spacing Systém (8px base)
```
4px   — micro (ikony, badge interní padding)
8px   — xs (mezery uvnitř komponent)
12px  — sm-compact
16px  — sm (padding malých karet)
24px  — md (standardní padding karet)
32px  — lg (mezi komponentami)
40px  — xl (sekce padding vertical)
56px  — 2xl (sekce gap mobile)
80px  — 3xl (sekce gap desktop)
96px  — 4xl (hero padding top)
128px — 5xl (velký sekce gap)

Section vertical rhythm: min 80px / pref 96px / max 128px
Hero padding top: min 88px / pref 112px (kvůli fixed navbaru)
```

### Border Radius
```
Pill:       9999px — badges, chips, avatar dots
Button-sm:  12px
Button-md:  14px
Button-lg:  18px
Card-sm:    16px
Card-md:    20px
Card-lg:    24px
Panel:      28px
Modal:      28px
Navbar:     18px (pill nebo squared pill)
```

### Typografie
```
FONT: Inter Variable
Načítání: next/font (nulová CLS, preloaded)
Fallback: system-ui, -apple-system, sans-serif

SCALE:
display-xl:  clamp(2.75rem, 5vw, 4.75rem) / weight: 900 / tracking: -0.025em
display-lg:  clamp(2rem, 3.5vw, 3.25rem)  / weight: 800 / tracking: -0.020em
display-md:  clamp(1.5rem, 2.5vw, 2rem)   / weight: 700 / tracking: -0.015em
body-lg:     1.0625rem / weight: 400 / line-height: 1.75
body-md:     1rem      / weight: 400 / line-height: 1.65
body-sm:     0.875rem  / weight: 400 / line-height: 1.6
label:       0.6875rem / weight: 800 / tracking: 0.18em / uppercase
micro:       0.625rem  / weight: 700 / tracking: 0.22em / uppercase

PRAVIDLA:
- H1 je vždy bílý + amber italic na accent/suffix slově
- H2–H3 je vždy bílý, žádný gradient
- Body copy je #94A3B8, max-width: 600px pro čitelnost
- Labels jsou UPPERCASE + extreme tracking + amber
- Žádný bold v body textu — nechte H1 nést váhu
```

### Akcentní barva — Amber pravidla
```
Amber smí být na:
  - CTA buttonech (bg)
  - Aktivních labelech / badges
  - Jednom slovu v H1 (italic variant)
  - Checkmarky v pricing
  - Pulse dot v trust badge
  - Featured border na pricing kartě

Amber nesmí být na:
  - Více než 2 místech vedle sebe
  - Celém bloku textu
  - Pozadí sekcí
  - Dekorativních dividerech (přeplácané)
  - Hover efektech na všech kartách naráz

PRAVIDLO: Amber = vzácný kovový lesk. Ne dekorační vzor.
```

---

## 3. HERO REDESIGN

### Layout (desktop 1440px)
```
Dvousloupcový split: 58% text / 42% visual
Max-width kontejner: 1280px
Padding top: 112px (kvůli fixed navbaru 56px + 56px spacing)
Padding bottom: 100px

[LEFT COLUMN — 58%]
  Badge pill
  H1 (3 řádky, pyramida)
  Subheadline
  CTA row
  Trust row

[RIGHT COLUMN — 42%]
  Floating PDF Document Card
  Floating badge #1 (green — "PDF vygenerováno")
  Floating badge #2 (amber — "od 249 Kč")
  Ambient glow halo
```

### Headline
```
BADGE (nad H1):
  "● Aktualizováno · Česká legislativa 2026"
  Pill · amber/10 bg · amber/20 border · amber text
  Pulse dot animace (amber, 2s)

H1 (3 řádky, pyramida):
  Řádek 1: "Smluvní dokument"      → weight 900, white, žádný efekt
  Řádek 2: "sestavený"             → weight 900, white
  Řádek 3: "podle vašich podmínek."→ weight 900, italic, amber #F59E0B

PRAVIDLO: H1 tvoří optickou pyramidu (dlouhý → střední → kratší).
Italicized amber = silný vizuální záchytný bod. Žádný gradient, žádný stroke.

SUBHEADLINE:
"Vyplňte formulář. Systém sestaví strukturovaný dokument
a vygeneruje PDF připravené k podpisu — od 249 Kč."

Font: body-lg (1.0625rem) / color: #94A3B8 / max-width: 520px / line-height: 1.7
```

### CTA Buttons
```
PRIMARY — "Vybrat typ smlouvy →"
  bg: #F59E0B
  text: #000 · weight: 900 · uppercase · tracking-tight
  padding: 16px 28px
  border-radius: 16px
  box-shadow: shadow-cta (viz výše)
  hover: bg → #FCD34D, translateY(-1px), shadow zvětšit o 20%
  transition: 150ms cubic-bezier(0.2, 0, 0, 1)

SECONDARY — "Jak to funguje? ↓"
  bg: transparent
  border: 1px solid rgba(255,255,255,0.08)
  text: #94A3B8 · weight: 500
  padding: 16px 20px
  border-radius: 16px
  backdrop-filter: blur(8px)
  hover: text → white, border → rgba(255,255,255,0.14)
```

### Trust Row
```
Layout: flex row, gap 24px, items-center
Oddělení: thin dot divider "·" color: #334155

Items:
  🔒 Platby přes Stripe
  📄 PDF ihned ke stažení
  📋 14 typů dokumentů
  🏢 IČO 23660295

Font: 0.6875rem / color: #475569 / weight: 500
Animace: staggered fade-in, delay 0.9s, step 80ms
```

### Hlavní vizuální prvek — Floating PDF Document Card
```
Toto je nejdůležitější dekorativní element celé stránky.

CARD SPEC:
  Rozměry: 340×460px desktop / 280×380px tablet
  Glass: Layer 3 spec
  3D transform: perspective(1200px) rotateX(3deg) rotateY(-6deg) rotate(-1.5deg)
  Filter: drop-shadow(0 32px 80px rgba(0,0,0,0.55))
  Idle animation: pdf-float (6s ease-in-out infinite)
    0%, 100%: translateY(-8px) + výchozí rotace
    50%:      translateY(4px)  + o 0.5deg méně nakloněný

DOKUMENT OBSAH (statický HTML, ne generovaný):
  Záhlaví (dark section):
    - "SmlouvaHned.cz" v amber uppercase 8px
    - "NÁJEMNÍ SMLOUVA" white 13px font-black
    - Amber pill badge "Rozšířená" vpravo
    - Amber gradient linka (2px, amber→gold→fade)

  Tělo (světlý papír #F9F8F3):
    - "Smluvní strany" label → fake data (Jan Novák / Petra Svobodová)
    - Key terms box (bílý, border) → Předmět / Nájemné / Kauce / Výpověď
    - Section list (§1–§5 + "+ 8 dalších...")
    - Signature lines × 2
    - SmlouvaHned footer note

PROČ TOTO FUNGUJE:
  - Ukazuje reálný výstup produktu (ne abstrakci)
  - Papírová bílá textura v kontrastu s tmavým okolím = vizuální kotva
  - Floating badges přidávají kontextovou informaci
  - 3D tilt přidává hloubku bez heavy WebGL

FLOATING BADGES:
  Badge #1 (vlevo dole, vyčnívá z karty):
    "● PDF vygenerováno"
    green glass pill · pulse dot · emerald barva
    backdrop: blur(16px)

  Badge #2 (vpravo nahoře):
    "od 249 Kč"
    amber glass pill
    backdrop: blur(12px)
```

---

## 4. HOMEPAGE STRUKTURA

### Pořadí sekcí
```
 #  SEKCE                    ÚČEL                         CHARAKTER
────────────────────────────────────────────────────────────────────────
01  Navbar (fixed)           Navigation + CTA             Glass Layer 3
02  Hero                     First impression + konverze   Split 2-col
03  Social Proof Strip       Trust signal, okamžitě        Thin glass row
04  Jak to funguje (4 steps) Clarity, objection handling   Glass cards
05  Výběr dokumentu          Product catalog               Grid + tabs
06  Proč SmlouvaHned         Differentiators               4 feature cards
07  Pro koho                 Audience targeting            4 audience cards
08  Comparison Table         "Ne vzor zdarma"              Glass table
09  Blog Preview             SEO + authority               3 article cards
10  Pricing                  Monetization + conversion     3 tiered cards
11  Garance + Metodika       Final trust objection         Glass 2-col
12  FAQ                      Objection handling            Accordion
13  Final CTA                Last chance conversion        Large glass panel
14  Footer                   Navigation + legal            Dark solid
────────────────────────────────────────────────────────────────────────
```

### Sekce 03 — Social Proof Strip
```
Umístění: těsně pod hero
Vizuál: thin border-top + border-bottom, height 52px
Glass: velmi jemný (bg rgba(255,255,255,0.016))
Items: ✓ PDF ihned · ✓ Šablony dle OZ · ✓ 14 typů dokumentů · ✓ IČO 23660295
Animace: žádná (static trust signal)
```

### Sekce 04 — 4 Steps (Jak to funguje)
```
Vizuál: 4 glass-1 karty v řadě (grid-cols-4)
Speciální prvek: Ghost číslo (01/02/03/04) jako watermark v pozadí karty
  → font-size: 5rem / opacity: 0.04 / positioned absolute top-right
  → toto vytváří subtilní hloubku
Animace: staggered scroll reveal, 80ms delay
```

### Sekce 06 — Proč SmlouvaHned (4 Feature Cards)
```
Vizuál: 4-column grid, glass-1 cards, ikony v amber circle
Layout:
  [Dynamický dokument] [PDF ihned] [10 minut] [Šifrovaná data]
  Každá karta: tag label nahoře (amber, uppercase) + icon + title + desc
Animace: scroll reveal, scale(0.97→1), opacity(0→1)
```

### Sekce 10 — Pricing
```
Layout: 3 karty, featured (Rozšířený dokument) je elevovaný
  Standard:  glass-1, normal height
  Featured:  glass-2 amber, translateY(-16px) na desktopu, výraznější stín
  Standard:  glass-1, normal height

Vizuální hierarchie:
  - Featured karta je ~20px vyšší vizuálně (padding top 44px vs 28px)
  - Featured karta má amber glow halo
  - "Nejčastěji voleno" badge nad featured kartou (amber, pill, s shadow)
  - CTA button: na featured amber solid, na ostatních ghost

Bez featured karty se pricing čte jako "vyberte si jeden ze tří".
S featured kartou se pricing čte jako "toto je správná volba".
```

### Sekce 13 — Final CTA
```
Vizuál: Velký glass-2 amber panel, full-width v max-w-6xl
Headline: "Váš dokument je na pár kliknutí."
Sub: 1 řádek, body-md, slate-300
CTA: velký amber button se shadow-cta
Under CTA: "Provozovatel: Karel Zdeněk · IČO 23660295 · Není advokátní kanceláří"
Ambient glow: amber radial halo za panelem

Tato sekce je poslední šance na konverzi.
Musí být vizuálně výrazná, ale ne křiklavá.
```

---

## 5. KOMPONENTY

### Navbar
```
DESIGN:
  Type: Floating pill, fixed top
  Width: calc(100% - 32px) / max-width: 1200px
  Height: 56px
  Margin: 12px auto
  Glass: Layer 3, border-radius: 18px
  Border: 1px solid rgba(255,255,255,0.08) + top luminous edge

OBSAH:
  [Logo SH square + wordmark] — [Nav links center] — [CTA button]
  Nav links: slate-400, hover → white, 120ms transition
  CTA: amber bg, text black, rounded-14px, kompaktní

SCROLL BEHAVIOR:
  Při scrollY > 60: shadow zesílit, bg opacity zvýšit
  → CSS: backdrop-filter vždy, BG opacity: 0.7 (idle) → 0.88 (po scrollu)
  → Implementace: CSS custom property via scroll-driven animation nebo minimal JS

MOBILE:
  Nav links hidden → hamburger icon
  Tap: full-screen glass overlay, fade-in 200ms
  Overlay: bg rgba(4,7,14,0.96), blur(20px)
  Links: velké, dobře klikatelné (min 48px tap target)
```

### CTA Buttons
```
LARGE PRIMARY (hero, final CTA):
  padding: 16px 28px / border-radius: 16px / font: 900 uppercase
  bg: #F59E0B / text: #000
  shadow: shadow-cta
  hover: translateY(-1px), bg → #FCD34D, shadow expand
  active: translateY(0px), shadow compress

MEDIUM PRIMARY (pricing, in-section):
  padding: 12px 20px / border-radius: 14px
  Stejné barvy, menší padding

SECONDARY (ghost):
  border: 1px solid rgba(255,255,255,0.08)
  bg: transparent / backdrop: blur(8px)
  text: slate-400
  hover: border → rgba(255,255,255,0.14), text → white

AMBER OUTLINED (blog CTA, catalog):
  border: 1px solid rgba(245,158,11,0.22)
  bg: rgba(245,158,11,0.08)
  text: amber-400
  hover: bg → rgba(245,158,11,0.18), border opacity zvýšit

VŠECHNY BUTTONS:
  transition: all 150ms cubic-bezier(0.2, 0, 0, 1)
  focus: amber outline 2px, offset 2px (accessibility)
  active: scale(0.99)
```

### Glass Cards (obecné)
```
DEFAULT STAV:
  glass-1 spec + card-luminous borders
  border-radius: 20px
  transition: all 200ms cubic-bezier(0.2, 0, 0, 1)

HOVER STAV:
  translateY(-2px)
  border-top → rgba(255,255,255,0.18) (světlejší luminous edge)
  shadow zvětšit (mírně)
  NECHCI: color change, glow explosion, scale(1.02)
  Hover musí být jemný, ne dramatický

FEATURED VARIANTA (pricing):
  glass-2 amber spec
  translateY(-16px) desktop
  Výraznější shadow halo

BLOG CARD:
  2px barevná linka nahoře (category color)
  Footer s dividerem: "Číst →" + amber CTA
  Hover: border → rgba(255,255,255,0.12)
```

### Product Cards (contract catalog)
```
Design:
  glass-1 + card-luminous
  border-radius: 20px
  padding: 24px

Struktura:
  Top: tag label (amber, uppercase) + paragraph číslo (slate-600, tiny)
  Body: title (H3 white) + description (body-sm slate-400)
  Bottom: divider + price (slate-500) + "Vytvořit →" (amber)

Hover:
  translateY(-2px) + top border light up
  Jemný accent glow (category color, 5% opacity fill) na background
  Nechci: celý card color change

Popular badge:
  Amber pill, absolute top-right
  Malý, ne velký — "Nejčastější"
```

### Pricing Cards
```
ZÁKLADNÍ (non-featured):
  glass-1, border-radius: 24px
  Header: name (uppercase slate-500, 10px) + price large + description
  Features: checkmark list (amber ✓)
  Note: fine print pod čarou
  CTA: ghost button

FEATURED (Rozšířený dokument):
  glass-2 amber, translateY(-16px)
  Amber "Nejčastěji voleno" badge absolute -top
  Header: name + VELKÁ cena (text-4xl+) + description (amber)
  Features: checkmark list
  CTA: solid amber button
  Glow halo za kartou

KOMPLETNÍ:
  glass-1 standard
  CTA: ghost button

VIZUÁLNÍ PRAVIDLO:
  Featured karta musí být nezpochybnitelně dominantní.
  Anchoring efekt: 749 Kč vedle 399 Kč → 399 Kč zní rozumně.
  Cena featured karty musí být největší číslo na stránce (vizuálně).
```

### FAQ Accordion
```
CLOSED:
  glass-1 / padding: 20px 24px / border-radius: 18px
  Question: font-bold white / "+" icon right (slate-500)
  border: 1px solid rgba(255,255,255,0.06)

OPEN:
  border-color: amber/20 (jemné)
  "+" → rotateZ(45deg) → amber barva (200ms)
  Answer fade-in: opacity(0→1), height expand
  Padding: 20px 24px 24px

HOVER (closed):
  border → rgba(255,255,255,0.10)
  background velmi jemně světlejší

HTML: <details>/<summary> pro CSS-only implementaci
Žádný JavaScript accordion (performance + SEO)
```

### Trust Badges
```
Inline v hero trust row:
  Ikona + text, flat, slate-500 color
  Nechci colored icons nebo filled badges

Payment badges (footer):
  Mini rounded cards: Stripe / Visa / Mastercard / SSL
  border: rgba(255,255,255,0.08) / bg: rgba(255,255,255,0.04)
  Konzistentní výška (28px)

Green success badge (garance):
  emerald/10 bg, emerald/20 border, emerald text
  "🛡️ Garance technické správnosti"
```

### Footer
```
STRUKTURA: 1 brand column + 4 link sloupce (nebo 2+4 na desktop)
BG: rgba(4,7,14,0.96) — tmavší než stránka, jasná vizuální závěrka
Border top: 1px solid rgba(255,255,255,0.04)

Brand sloupec:
  Logo + wordmark + tagline
  1–2 věty description (slate-500)
  IČO, jméno, email
  Payment badges row

Link sloupce:
  Category header (uppercase, slate-600, 10px)
  Links: slate-500 → hover white

Legal footer:
  Upozornění box: rounded, jemný border, slate-600 text
  Copyright řádek: slate-600, 11px

PRAVIDLO: footer nesmí být "přidaný na konec".
Footer = vizuální těžiště, uzavírá stránku s autoritou.
```

### Blog CTA Box (ArticleInlineCta)
```
PRIMARY variant (amber tint):
  bg: rgba(245,158,11,0.06)
  border: 1px solid rgba(245,158,11,0.16)
  border-top: 1px solid rgba(245,158,11,0.28)
  border-radius: 16px
  padding: 20px 24px

SUBTLE variant:
  glass-1, amber outline button
  Méně výrazný, použít v polovině článku

ZÁSADA: Blog CTA musí vypadat jako součást obsahu, ne jako banner reklama.
Pokud to vypadá jako reklama → konverze klesá.
```

---

## 6. MOTION SYSTEM

### Filosofie
> Animace jsou hlas designu. Prémiový design mluví šeptem, ne křikem.

Každá animace musí splňovat: (1) má funkci, (2) je rychlá, (3) je jemná.

### Load-in animace (page load sequence)
```
Timing se drží přísné sekvence:
  0ms    → background ambient gradient (okamžitě, CSS)
  80ms   → badge pill:         fadeUp(12px → 0, opacity 0→1, 280ms)
  180ms  → H1 line 1:          fadeUp(16px → 0, opacity 0→1, 320ms)
  260ms  → H1 line 2:          fadeUp(16px → 0, opacity 0→1, 320ms)
  340ms  → H1 line 3 (amber):  fadeUp(16px → 0, opacity 0→1, 320ms)
  520ms  → Subheadline:        fadeIn(opacity 0→1, 380ms)
  680ms  → CTA buttons:        fadeUp(8px → 0, opacity 0→1, 280ms, stagger 80ms)
  820ms  → Trust row:          fadeIn(opacity 0→1, 280ms)
  400ms  → PDF card:           scaleIn(0.95→1) + fadeIn, 500ms ease-out (paralelní)

IMPLEMENTACE: CSS animations s animation-delay (nulová JS závislost)
prefers-reduced-motion: vše instant, žádné animations
```

### Scroll Reveal
```
Trigger: IntersectionObserver, threshold: 0.12
Animation:
  .reveal { opacity:0; transform:translateY(18px); }
  .reveal.visible { opacity:1; transform:translateY(0);
                    transition: 420ms cubic-bezier(0.2,0,0,1); }

Stagger pro groups (feature cards, step cards):
  každý item: 80ms delay navíc

NECHCI: parallax na content. Parallax = scroll lag na mobile.
NECHCI: scale animace pro sekce jako celek. Ale pro ikony OK.
```

### Hover Efekty
```
Glass cards:
  translateY: -2px / duration: 200ms / ease: cubic-bezier(0.2,0,0,1)
  border-top: o stupeň světlejší (CSS transition na border-color)
  Nechci: scale, glow burst, color explosion

CTA buttons:
  translateY: -1px / bg lighten / shadow expand / duration: 150ms
  active state: translateY(0), scale(0.99)

Nav links:
  color: 120ms
  Žádný underline, žádný background, žádný scale

PDF preview:
  Idle float animace, žádné hover efekty (bylo by rušivé)

FAQ accordion:
  expand height: max-height transition 280ms ease
  icon rotation: 180ms ease
  color change: 120ms
```

### PDF Float Animace (premium detail)
```css
@keyframes pdf-float {
  0%, 100% {
    transform: perspective(1200px) rotateX(3deg) rotateY(-6deg)
               rotate(-1.5deg) translateY(-8px);
  }
  50% {
    transform: perspective(1200px) rotateX(2.5deg) rotateY(-5.5deg)
               rotate(-1deg) translateY(4px);
  }
}

Duration: 6s / ease: ease-in-out / iteration: infinite
will-change: transform (deklarovat pro GPU acceleration)
prefers-reduced-motion: animation: none, static transform
```

### Microinteractions
```
Badge pulse dot: amber, animate-pulse (2s)
Anchor link scroll: smooth (CSS scroll-behavior: smooth)
Form focus states: amber outline 2px
Checkbox/radio: amber fill animace (150ms)
Success state: green fade-in (pro post-payment)
```

---

## 7. TYPOGRAFIE A ROZMÍSTĚNÍ

### Display Hierarchy
```
H1 — HERO STATEMENT
  font-size: clamp(2.75rem, 5vw, 4.75rem)
  font-weight: 900
  line-height: 1.05
  letter-spacing: -0.025em
  color: white + amber italic pro 3. řádek
  max-width: 640px
  margin-bottom: 24px

  ZÁMĚR: H1 je absolutní dominanta stránky.
  Nikde jinde na stránce nemá žádný text tuto váhu.

H2 — SECTION HEADINGS
  font-size: clamp(1.875rem, 3vw, 3rem)
  font-weight: 800
  letter-spacing: -0.020em
  color: white
  Nad H2: section label (amber uppercase 11px) — vždy

  ZÁMĚR: H2 = nová kapitola. Každá sekce má vlastní záměr, ne dekoraci.

H3 — CARD/COMPONENT HEADINGS
  font-size: 1rem–1.125rem
  font-weight: 800–900
  letter-spacing: -0.010em
  color: white

H4 / LABELS
  font-size: 0.6875rem
  font-weight: 800
  letter-spacing: 0.18em
  text-transform: uppercase
  color: amber-400
  Vždy nad H2 jako "eyebrow"

BODY
  font-size: 1rem (1.0625rem pro primární)
  font-weight: 400
  line-height: 1.65–1.75
  color: #94A3B8
  max-width: 600px (readable line length)

FINE PRINT / LEGAL
  font-size: 0.6875rem–0.75rem
  color: #475569–#334155
  line-height: 1.5
```

### Spacing a "Dýchání"
```
STRÁNKA MUSÍ DÝCHAT — 3 pravidla:

1. VERTICAL BREATHING:
   Mezi každou sekcí: min 80px padding (typ. 96–128px)
   Nikdy dvě sekce bez spacing. Nikdy sekce "nahusto".

2. CARD BREATHING:
   Padding uvnitř karet: min 24px (typicky 24–32px)
   Gap mezi kartami v gridu: 20px
   Nikdy tight grid bez padding

3. TYPOGRAFICKÉ DÝCHÁNÍ:
   Label → H2: margin-bottom 8px
   H2 → sub: margin-top 12px
   Sub → content: margin-top 32px
   Odstavce: line-height 1.7, margin-bottom 16px
   Žádný text bez min 16px breathing space od dalšího elementu

PRAVIDLO: Pokud sekce vypadá přeplněně, odstraňte element — nepřidávejte.
Prázdné místo je luxus, ne plýtvání.
```

### Jak poznat prémiovou typografii
```
✓ H1 je optická pyramida (3 řádky, zkracující se)
✓ Každá sekce začíná amber eyebrow labelem
✓ Body text má max-width (není nikdy full-width)
✓ Ceny jsou big bold number + malá currency unit vedle
✓ Fine print je skutečně fine (0.7rem, muted)
✓ Zero bold v body textu (nechte heading nést autoritu)
✓ Spacing je konzistentní (8px grid)
```

---

## 8. CO PŘEVZÍT Z LIQUID GLASS A CO VYNECHAT

### A) Co převzít — Vhodné pro SmlouvaHned

```
✅ VRSTVENÉ BLUR MATERIÁLY
   Různé vrstvy mají různý blur a opacity.
   Kontrast vrstev = hloubka. Bez toho = flat.

✅ LUMINOUS TOP EDGE
   Nejjasnější border na top edge karty (simulace osvětlení shora).
   Toto je jeden největší rozdíl mezi levnou a luxusní glass kartou.

✅ DARK VOID BACKGROUND
   Tmavé, téměř černé pozadí. Glass bez tmavého bg nefunguje.

✅ AMBIENT RADIAL GLOW
   1–2 jemné radial gradienty jako "světelný zdroj" na stránce.
   Ne jako dekorace, ale jako zdroj hloubky.

✅ FLOATING GLASS ELEMENTS
   Prvky vyčnívající ze základní osy (3D tilt PDF preview).
   Jeden dramatický floating prvek = dostatečné.

✅ THIN BORDERS (1px)
   Borders mají nízkou opacity — jsou naznakovány, ne viditelné.
   rgba(255,255,255,0.07) = luxusní. rgba(255,255,255,0.3) = laciné.

✅ BACKDROP-FILTER LAYERING
   Kombinace blur + saturate + brightness (ne jen blur).
   Saturate zvyšuje barevnou hloubku pod glass plochou.

✅ INNER HIGHLIGHT (inset shadow)
   Velmi jemný inset shadow na top edge (rgba(255,255,255,0.05) inset).
   Přidá hloubku bez dekorace.
```

### B) Co rozhodně nepoužívat

```
❌ ANIMATED BLOBS / MESH GRADIENT
   Pohybující se colored blobs v pozadí.
   Vizuálně levné, efekt z roku 2021.
   Na právním webu = nedůvěra.

❌ NEON / VIBRANT GLOW BORDERS
   Cyan, fuchsia, purple borders.
   Asociace: crypto, gaming, NFT. Špatně.

❌ HEAVY IRIDESCENCE
   Rainbow shimmer efekt na glass površích.
   Z dálky vypadá jako bug, z blízka jako levná estetika.

❌ GRADIENT TEXT (v headlinech)
   background-clip: text je trend 2021.
   Snižuje čitelnost a působí jako design template.

❌ MULTIPLE GLOW COLORS
   Více než 2 glow barvy na stránce.
   Amber + modrá = OK. Amber + zelená + fuchsia = chaos.

❌ GLASS NA CELÉ STRÁNCE
   Každý element jako glass → glass ztrácí hodnotu.
   Glass funguje, když je vzácný. Kontrast s tmavým solid = hlubokost.

❌ PARALLAX NA OBSAHU
   Parallax scroll na kartách / textu = disorientace.
   Parallax na ambient glow = OK (fixed bg nebo CSS-only).

❌ PŘEHNANÉ 3D
   Three.js sphere, Spline scény, WebGL hero.
   Těžké, pomalé, nevhodné pro legal produkt.

❌ SCROLL-TRIGGERED ROTATION EFEKTY
   Karty, které se otáčí při scrollu.
   Vizuální show bez funkce.

❌ GLASS S BÍLÝM POZADÍM
   Liquid Glass nefunguje na světlém bg.
   Světlý bg → glass je neviditelný.
   Dark bg → glass září.
```

---

## 9. PERFORMANCE-FIRST IMPLEMENTATION

### CSS Priority
```
ZÁKLAD: Tailwind + custom CSS třídy (globals.css)

Custom CSS pro glass (nelze dostatečně vyjádřit Tailwind utilities):
  .glass-1 { backdrop-filter: blur(20px) saturate(160%); ... }
  .glass-2 { backdrop-filter: blur(28px) saturate(180%) brightness(1.05); ... }
  .glass-3 { ... }
  .card-luminous { border: 1px ...; border-top: 1px ...; box-shadow: ...; }
  .card-luminous-amber { ... }
  .pdf-float { animation: pdf-float 6s ease-in-out infinite; }

Tailwind arbitrary values pro specifické hodnoty:
  bg-[#04070E], text-[#94A3B8] atd.
  NECHCI: každý glass efekt jako inline style (špatná cache)

NECHCI: CSS-in-JS (runtime overhead)
NECHCI: styled-components (zbytečné pro tento projekt)
```

### Backdrop-Filter Optimalizace
```
PROBLÉM: backdrop-filter na každém elementu → GPU overload na mobile

ŘEŠENÍ:
  1. Backdrop-filter pouze na elementech ve viewportu
     → IntersectionObserver přidá třídu .glass-active
     → Mimo viewport: fallback bg bez blur

  2. Vrstvení: max 3 backdrop-filter elementy viditelné naráz
     → Navbar (1) + max 2 karty v hero (2,3) = OK
     → 10 karet v gridu se all backdrop-filter = problém

  3. Mobile: blur redukce
     @media (max-width: 768px) {
       .glass-1 { backdrop-filter: blur(12px) saturate(150%); }
       .glass-2 { backdrop-filter: blur(18px) saturate(170%); }
     }

  4. Fallback pro nepodporované prohlížeče:
     @supports not (backdrop-filter: blur(1px)) {
       .glass-1 { background: rgba(8,13,24,0.90); }
     }
```

### Animace — CSS First
```
PRAVIDLO: CSS animace > Framer Motion > GSAP

Co implementovat v CSS:
  - pdf-float idle animation (@keyframes)
  - scroll reveal (.reveal + .visible class)
  - FAQ accordion (max-height transition)
  - hover transitions (všechny, 100%)
  - load-in sequence (animation-delay)

Co implementovat v Framer Motion (pokud použit):
  - POUZE floating PDF card (komplexní 3D idle)
  - Případně staggered list animations (pokud CSS nestačí)

Framer Motion bundle: +45kB gzip
→ Pokud použit, importovat pouze { motion, AnimatePresence }
→ Nebo: CSS-only implementace (doporučuji pro performance)

NECHCI: GSAP (zbytečně těžký pro tento projekt)
NECHCI: React Spring (další dependence bez výhody)
```

### Fonts
```
next/font (Inter Variable):
  subsets: ['latin', 'latin-ext']
  variable: '--font-inter'
  display: 'swap'

→ Automaticky preloaded
→ Nulová CLS
→ Zero FOUT (Flash Of Unstyled Text)
→ Jeden font, všechny weights = jedna request
```

### Core Web Vitals Cíle
```
LCP:  < 1.8s  → Hero H1 je LCP element (text, ne obrázek)
CLS:  < 0.05  → Fixed size hero, font preloaded, no layout shifts
INP:  < 200ms → Minimal JS, no heavy event listeners
FCP:  < 1.2s  → Critical CSS inline, background immediate

CO POMÁHÁ LCP:
  - Hero H1 jako text (ne jako obrázek)
  - Tailwind critical CSS = small initial bundle
  - PDF preview jako statický HTML (ne canvas)
  - next/font eliminuje font loading delay
```

---

## 10. MOBILE STRATEGIE

### Co zachovat 1:1
```
✓ Tmavé pozadí #04070E (vždy)
✓ Amber CTA button (vždy)
✓ Glass karty (s blur redukcí)
✓ Floating navbar (mobile verze: full-width, méně rounded)
✓ Typography scale (fluid clamp — funguje na mobile automaticky)
✓ FAQ accordion (touch-friendly)
✓ Luminous top border efekt
✓ Trust row (2×2 grid na mobile)
```

### Co zjednodušit
```
→ Hero: single column (text nad, PDF preview pod)
→ PDF preview: bez 3D tilt (výkon), prostý box-shadow
→ Blur: redukce (-30% intensita, viz výše)
→ Pricing: vertical stack, featured karta jako první
→ Grid: 2-col → 1-col na small screens
→ Section padding: 56px → 40px na mobile
```

### Co vypnout na mobile
```
✗ pdf-float animace (performance)
✗ 3D perspective transform na PDF
✗ Ambient radial gradients mimo viewport
✗ Hover efekty (nahradit :active)
✗ Parallax jakéhokoli druhu
✗ Backdrop-filter na více než 2 elementech naráz
```

### Mobile Hero Layout
```
Layout: single column, centered
  Badge → H1 → Subheadline → CTAs (full-width) → Trust row
  PDF Preview: pod hlavním textem, centered
    width: min(320px, 100%)
    bez 3D tilt
    bez float animation
    se shadow-floating

CTA buttons: full-width na xs, auto na sm+
H1: font-size: clamp(2.25rem, 8vw, 3rem)
```

### Mobile Navbar
```
Default: floating pill → full-width strip na xs
  border-radius: 0 nebo 12px top
  položky: Logo left + hamburger right
  Bez center nav links (hidden)

Menu: full-screen glass overlay
  bg: rgba(4,7,14,0.96) + blur(20px)
  Links: 1.125rem, plná šířka, 48px touch target
  Close: X button nebo tap mimo
  Animation: fade-in 200ms
```

---

## 11. RED FLAGS

### Co by z webu udělalo laciný startup
```
❌ Gradient text na H1 nebo H2
   Okamžitě signalizuje "použitý template"

❌ Emoji jako primární ikony v navigaci nebo feature cards
   Emoji = neformální. Feature cards potřebují SVG ikony.
   (Emoji v hero trust row je OK — jsou malé a dekorativní)

❌ Stock fotky lidí podpisující dokumenty
   Asociace: pojišťovna z roku 2010. Absolutní důvěra killer.

❌ "Trusted by 10,000+ customers" bez source
   Fake social proof bez verifikace = nedůvěra při bližším pohledu

❌ Animovaný counter (čísla rostou při scrollu)
   Design kliché z roku 2019. A na legálním webu acting nepatří.

❌ Video hero (fullscreen background video)
   Performance killer, nevhodné pro document tool

❌ Dark mode + neon borders v kombinaci
   Crypto/NFT asociace. Zničilo by legal-tech positioning.

❌ Přesycené sticky CTA bannery
   "Vytvořit smlouvu" banner přichycený na spodku viewportu
   = agresivní marketing, snižuje důvěru

❌ Cookie banner pokrývající hero
   Největší first-impression killer. Řešení: bottom bar, lazy-load.
```

### Co by zničilo důvěru
```
❌ Chyby v pravopisu nebo gramatice
   Na webu o právních dokumentech = catastrophic

❌ Zastaralý Copyright (© 2024 bez 2026)
   Okamžitý signál zanedbání

❌ Broken responsivity na mobile
   Premium produkt = funguje na všech zařízeních

❌ Pomalé načítání (LCP > 3s)
   Premium produkt = rychlý produkt

❌ Chybějící provozovatel a IČO
   Na platebním a legálním webu = red flag

❌ HTTPS chyby nebo mixed content
   Bezpečnostní varování v prohlížeči = instant leave
```

### Co by snížilo čitelnost
```
❌ Body text větší než 16px nebo menší než 13px
❌ Světlý text na světlém pozadí (nízký kontrast)
   amber na bílém = nečitelné
   slate-400 na #04070E = 4.8:1 kontrast → OK
❌ Line-height < 1.5 pro body text
❌ Column width > 680px pro body text
❌ Uppercase pro celé odstavce
❌ Bold ve všem (ztráta hierarchie)
❌ Příliš mnoho různých font-size (max 5 v systému)
```

### Co by zabilo výkon
```
❌ backdrop-filter na 10+ elementech naráz
❌ Heavy WebGL / Three.js v hero (> 500kB JS)
❌ Neoptimalizované obrázky (WebP nutné, AVIF ideální)
❌ Google Fonts link místo next/font
❌ Framer Motion pro jednoduché CSS transitions
❌ Auto-play video
❌ GSAP pro hover efekty (overhead)
```

### Co by vizuálně zestárlo do 6 měsíců
```
❌ Aurora / mesh gradient backgrounds (trend peak: 2023)
❌ Glassmorphism s rainbow iridescence (trend peak: 2022)
❌ Bento grid layout jako primární sekce (trend peak: 2024)
❌ "Brutalist" borders (trend peak: 2023)
❌ Serif headings s thin weight (trend peak: 2022)
❌ Velmi tmavý text s neon glow (trend: 2021)
❌ 3D illustrated characters (trend peak: 2021)
```

---

## 12. FINÁLNÍ IMPLEMENTAČNÍ BRIEF

### Must-Have (bez tohoto není web 10/10)
```
P0 — Blokující:

1. FLOATING GLASS PILL NAVBAR
   Fixed, 56px, max-w-6xl, glass-3 spec
   Logo + center nav + CTA button
   → Okamžitý premium signal při otevření stránky

2. 2-COLUMN HERO s PDF PREVIEW
   Left: H1 pyramid + subheadline + CTAs + trust row
   Right: floating glass document card s 3D tilt + idle animation
   → Wow efekt + okamžitá demonstrace výstupu

3. GLASS CARD SYSTÉM
   glass-1/2/3 CSS třídy v globals.css
   card-luminous + card-luminous-amber helper třídy
   Luminous top border na všech kartách
   → Premium materiálový pocit

4. ELEVATED FEATURED PRICING CARD
   Rozšířený dokument: glass-2 amber, translateY(-16px)
   "Nejčastěji voleno" badge, amber glow halo
   → Anchoring efekt, zvýšení konverze mid tier

5. AMBIENT BACKGROUND SYSTEM
   fixed div: 2 radial gradients (amber top, blue side)
   Noise texture overlay (SVG, opacity ~0.018)
   → Hloubka bez rušení, ambient dojem prostoru

6. TYPOGRAPHY SYSTEM
   Inter Variable přes next/font
   H1: 900, clamp(2.75rem, 5vw, 4.75rem), amber italic accent
   Section eyebrow labels (amber uppercase 11px nad každým H2)
   Body: max-width 600px, line-height 1.7
```

### Should-Have (před marketingem)
```
P1:

7. SCROLL REVEAL ANIMACE
   IntersectionObserver + CSS .reveal → .visible
   Stagger 80ms pro groups
   → Elevates polish significantly

8. SOCIAL PROOF STRIP
   Thin strip pod hero, 4 trust items
   → Okamžitý trust signal

9. COMPARISON TABLE (Glass)
   "Vzor zdarma vs SmlouvaHned" v glass wrapper
   → Objection handling před pricing

10. MOBILE HERO REDESIGN
    Single-column, PDF preview pod textem
    Full-width CTAs
    → 60%+ trafficu je mobile

11. CONSISTENT ICON SYSTEM
    Lucide Icons nebo Heroicons, konzistentní stroke width
    SVG ikony místo emoji v feature cards
    → Visual consistency = premium feel
```

### Nice-to-Have (v dalším sprintu)
```
P2:

12. FRAMER MOTION STAGGER
    Pro feature cards a pricing sekci
    Elegantnější než CSS stagger

13. SCROLL-DRIVEN AMBIENT
    Ambient glow se jemně posouvá s scrollem
    CSS @scroll-timeline nebo JS

14. FOCUSED PDF PREVIEW INTERACTION
    Kliknutí na PDF preview → zoom modal
    Modal: glass-3, close button, plný preview dokumentu

15. NAVBAR SCROLL STATE
    Po scrollY > 60px: shadow zesílit, opacity zvýšit
    Tiny JS (~5 lines)

16. AggregateRating SCHEMA + DISPLAY
    Po sběru min. 10 reálných hodnocení
    Star rating display ve trust row
```

### Jak poznat, že homepage je blízko 10/10
```
VIZUÁLNÍ TEST:
  ✓ Screenshot zobrazit vedle Linear.app nebo Vercel.com
    → Pokud obstojí v porovnání = dobrý výsledek

  ✓ 5-second test s nový uživatel:
    "Co tento web dělá?" → jasná odpověď do 5s = OK
    "Vypadá důvěryhodně?" → Ano bez váhání = OK
    "Koupil/a bys?" → Přirozené "možná" = konverzní fundament

TECHNICKÝ TEST:
  ✓ Lighthouse score > 90 (Performance, Accessibility, SEO)
  ✓ LCP < 1.8s na 4G mobile
  ✓ CLS < 0.05
  ✓ No console errors

DESIGN TEST:
  ✓ Navbar, hero, pricing — každý působí jako jeden celistvý product
  ✓ Každá sekce má jasný vizuální charakter, ale patří ke stejnému designu
  ✓ Na mobilu: stejný premium pocit, jednodušší layout
  ✓ PDF preview v hero je okamžitě srozumitelný jako výstup produktu
  ✓ Stránka dýchá — nikde není tlačené, nikde není prázdno bez smyslu

KONVERZNÍ TEST:
  ✓ Hero CTA je jasná a přirozená (ne agresivní)
  ✓ Pricing featured karta je nezpochybnitelně dominantní
  ✓ Trust signals jsou na správných místech (ne přeplácané)
  ✓ Disclaimer je viditelný ale neruší konverzi
  ✓ Footer uzavírá stránku s autoritou, ne jako přidaný konec
```

---

## APPENDIX: Rychlé rozhodnutí

| Otázka | Odpověď |
|--------|---------|
| Gradient text na H1? | ❌ Nikdy |
| Serif font? | ❌ Ne pro legal SaaS |
| Video hero? | ❌ Ne |
| Light mode? | ❌ Ne (pouze dark) |
| Animated blobs? | ❌ Absolutně ne |
| Hover glow na kartách? | ✓ Jemný, amber/8 max |
| Glass bez tmavého bg? | ❌ Nefunguje |
| Emoji v feature cards? | ❌ Použít SVG ikony |
| Floating navbar? | ✓ Povinné |
| PDF preview v hero? | ✓ Povinné |
| Framer Motion? | ✓ Volitelné (CSS first) |
| IntersectionObserver? | ✓ Povinné |
| next/font (Inter)? | ✓ Povinné |
| backdrop-filter everywhere? | ❌ Max 3 naráz |
| Stock fotky? | ❌ Absolutně ne |
| Mobile 3D tilt? | ❌ Vypnout na mobile |
| Amber na víc než 15% plochy? | ❌ Amber = vzácný |
| Section eyebrow labels? | ✓ Vždy nad H2 |
| IČO ve footeru? | ✓ Povinné |

---

*Tento brief je finální. Každé rozhodnutí je obhájitelné designovou nebo business logikou. Není zde nic "možná" — je zde "ano" nebo "ne". Implementovat v pořadí P0 → P1 → P2.*
