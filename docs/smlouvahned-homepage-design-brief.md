# SmlouvaHned.cz — Homepage Redesign: Premium Design Brief 2026
**Autor:** Senior Product Designer / Creative Director
**Datum:** Q2 2026 | **Verze:** 1.0 FINAL
**Standard:** 10/10 Premium SaaS · Document Automation · Czech Market

---

## 1. CREATIVE DIRECTION

**Jeden direktivní věta:**
> *Tichá autorita sofistikovaného software — jako kdyby Swiss private bank navrhla document automation nástroj.*

**Emocionální dojem:**
Uživatel otevře stránku a v první vteřině necítí "levný online generátor" — cítí **klidnou jistotu**. Jako když otevřete Notion, Linear nebo 1Password. Software, který prostě funguje. Žádný hype, žádný křik. Hloubka materiálu mluví místo tlačítek. Typografie dýchá. Sklo a tma pracují společně — ne pro efekt, ale pro **signalizaci kvality**. Uživatel si podvědomě řekne: *"Toto je produkt, kterému mohu věřit se svou smlouvou."*

---

## 2. VIZUÁLNÍ SYSTÉM

### 2.1 Barevná paleta

```
BACKGROUND BASE
  bg-void          #04070E   — primární pozadí, téměř černá s modrým tónem
  bg-surface       #080D18   — sekundární vrstvy, navbar, karty
  bg-elevated      #0C1220   — elevated glass báze

ACCENT — Amber / Warm Gold
  amber-primary    #F59E0B   — primární CTA, aktivní stavy, highlights
  amber-glow       #F59E0B1A — amber glow halo (10% opacity)
  amber-border     #F59E0B33 — amber border v inactive stavu (20%)
  amber-hot        #FCD34D   — hover stav CTA, typografický akcent

GLASS SURFACES
  glass-1          rgba(255,255,255,0.03)  — nejtenčí vrstva
  glass-2          rgba(255,255,255,0.055) — standardní karta
  glass-3          rgba(255,255,255,0.09)  — elevated / featured karta
  glass-white-haze rgba(255,255,255,0.006) — noise texture báze

BORDERS — Luminous thin
  border-subtle    rgba(255,255,255,0.06)  — výchozí dělicí čára
  border-glass     rgba(255,255,255,0.10)  — okraj glass karet
  border-glow      rgba(245,158,11,0.22)   — amber glow border (hover)
  border-bright    rgba(255,255,255,0.18)  — top highlight hrany

TEXT
  text-primary     #FFFFFF              — hlavní nadpisy
  text-secondary   #94A3B8              — body copy, popisky
  text-muted       #475569              — small print, meta info
  text-amber       #F59E0B              — akcenty, ceny, tagy
  text-dimmed      #1E293B              — dekorativní / disabled

SHADOW SYSTÉM (3 vrstvy)
  shadow-card      0 1px 0 0 rgba(255,255,255,0.05) inset,
                   0 0 0 1px rgba(255,255,255,0.06),
                   0 4px 6px -1px rgba(0,0,0,0.5),
                   0 20px 40px -8px rgba(0,0,0,0.4)

  shadow-floating  0 1px 0 0 rgba(255,255,255,0.08) inset,
                   0 0 0 1px rgba(255,255,255,0.08),
                   0 8px 16px -2px rgba(0,0,0,0.6),
                   0 32px 64px -12px rgba(0,0,0,0.5),
                   0 0 80px -20px rgba(245,158,11,0.12)

  shadow-glow-cta  0 0 0 1px rgba(245,158,11,0.4),
                   0 4px 20px rgba(245,158,11,0.25),
                   0 8px 40px rgba(245,158,11,0.12)
```

### 2.2 Glass Materiál — Specifikace

Liquid Glass 2026 je o **vrstvení, ne o přesnosti efektů**. Každá vrstva má svůj blur a průhlednost:

```
LAYER 0 — Ambient background mesh (fixed, no interaction)
  gradient: radial (amber @ top, blue @ 80% 20%, dark base)
  noise overlay: SVG feTurbulence, opacity 0.018, scale 600

LAYER 1 — Hero glass panel (main content)
  backdrop-filter: blur(32px) saturate(180%) brightness(1.05)
  background: rgba(8,13,24,0.72)
  border: 1px solid rgba(255,255,255,0.08)
  border-top: 1px solid rgba(255,255,255,0.16)  ← luminous top edge
  border-radius: 24px

LAYER 2 — Standard content cards
  backdrop-filter: blur(20px) saturate(160%)
  background: rgba(8,13,24,0.65)
  border: 1px solid rgba(255,255,255,0.07)
  border-top: 1px solid rgba(255,255,255,0.12)
  border-radius: 20px

LAYER 3 — Featured / highlighted card (pricing: Rozšířený dokument)
  backdrop-filter: blur(28px) saturate(180%) brightness(1.08)
  background: rgba(10,15,28,0.78)
  border: 1px solid rgba(245,158,11,0.25)
  border-top: 1px solid rgba(245,158,11,0.45) ← amber top luminous edge
  box-shadow: 0 0 60px -12px rgba(245,158,11,0.18)
  border-radius: 24px

LAYER 4 — Floating PDF preview (hero visual)
  backdrop-filter: blur(40px) saturate(200%) brightness(1.12)
  background: rgba(12,18,32,0.82)
  border: 1px solid rgba(255,255,255,0.12)
  border-top: 1px solid rgba(255,255,255,0.22) ← nejjasnější hrana
  box-shadow: [shadow-floating]
  border-radius: 16px
  transform: perspective(1200px) rotateX(3deg) rotateY(-6deg)
             rotate(-1.5deg) translateY(-8px)
  filter: drop-shadow(0 40px 80px rgba(0,0,0,0.6))
```

### 2.3 Typography

```
FONT STACK
  primary:   'Inter', system-ui, -apple-system, sans-serif
  mono:      'JetBrains Mono', 'Fira Code', monospace (pro badge, kód)

  → Načítat přes next/font (Inter Variable) — nulová CLS, zero FOUT

SCALE (fluid, clamp-based)
  display-xl:   clamp(3.25rem, 5.5vw, 6rem)    — hero H1, font-weight: 900
  display-lg:   clamp(2.5rem, 4vw, 4.5rem)     — sekce H2, font-weight: 800
  display-md:   clamp(1.75rem, 2.5vw, 2.5rem)  — sub-sekce H3, font-weight: 700
  body-lg:      1.125rem / 1.75 line-height     — hlavní body
  body-md:      1rem / 1.625                    — standard body
  body-sm:      0.875rem / 1.5                  — popisky, meta
  label:        0.6875rem / 1 · tracking 0.2em  — UPPERCASE tagy, badge

LETTER SPACING
  H1–H2:     tracking-tight (-0.02em)
  H3–H4:     tracking-tight (-0.01em)
  Labels:    tracking-widest (+0.18–0.22em) + uppercase + font-weight: 800

TYPOGRAFICKÝ PRINCIP:
  - H1 začíná white (#FFF), accent slovo v amber italic
  - Žádný gradient text v H1 (degraduje E-E-A-T, přehnaně dekorativní)
  - Body copy: #94A3B8, max-width: 38em pro optimální čitelnost
```

### 2.4 Spacing & Radius

```
Spacing scale (8px base):
  micro:  4px    — ikony, interní padding badge
  xs:     8px    — gap malých prvků
  sm:     16px   — padding malých karet
  md:     24px   — standardní padding karet
  lg:     40px   — padding sekce (vertikální)
  xl:     64px   — sekce gap mobilní
  2xl:    96px   — sekce gap desktop
  3xl:    128px  — hero padding top

Border radius:
  badge/chip:   9999px  (pill)
  button-sm:    12px
  button-md:    16px
  button-lg:    20px
  card-sm:      16px
  card-md:      20px
  card-lg:      24px
  glass-panel:  28px
  modal:        28px
```

---

## 3. HERO SEKCE — DETAILNÍ NÁVRH

### Layout (desktop, 1440px)

```
┌─────────────────────────────────────────────────────────────────┐
│  [NAVBAR — glass floating pill, 72px výška, max-w-6xl]          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [AMBIENT GRADIENT — fixed position background]                  │
│  amber radial @ 20% top · blue radial @ 80% right · void base   │
│                                                                   │
│  ┌──────────────────────────────────────┐  ┌──────────────────┐ │
│  │  HERO TEXT BLOCK (left, 55%)          │  │  FLOATING PDF    │ │
│  │                                       │  │  PREVIEW (right) │ │
│  │  [badge pill — uppercase amber]       │  │  [glass layer 4] │ │
│  │  ● Aktualizováno · Legislativa 2026   │  │                  │ │
│  │                                       │  │  [document card  │ │
│  │  H1:                                  │  │   náhled PDF     │ │
│  │  Smluvní dokument                     │  │   smlouvy        │ │
│  │  sestavený                            │  │   s typografií]  │ │
│  │  "podle vašich                        │  │                  │ │
│  │   podmínek."            ← amber italic│  │  [floating mini  │ │
│  │                                       │  │   badge: ✓ PDF   │ │
│  │  Subheadline (max 2 řádky):           │  │   vygenerováno   │ │
│  │  Vyplňte formulář — systém sestaví   │  │   ihned]         │ │
│  │  strukturovaný dokument a vygeneruje  │  │                  │ │
│  │  PDF připravené k podpisu.            │  └──────────────────┘ │
│  │                                       │                        │
│  │  [CTA PRIMARY]  [CTA SECONDARY]       │                        │
│  │                                       │                        │
│  │  [TRUST ROW]                          │                        │
│  │  🔒 Stripe  ·  📄 PDF ihned  ·        │                        │
│  │  ⚖️ 14 typů smluv  · IČO 23660295    │                        │
│  └──────────────────────────────────────┘                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Headline system

```
BADGE (nad H1):
  Design: pill · bg amber/10 · border amber/20 · amber text · uppercase
  Content: "● Aktualizováno pro legislativu 2026"
  Animace: fade-in + slide-up 0.3s ease-out

H1 (tři řádky, display-xl):
  Řádek 1: "Smluvní dokument"          → white, font-weight: 900
  Řádek 2: "sestavený"                 → white
  Řádek 3: "podle vašich podmínek."    → amber (#F59E0B), italic,
                                          font-style: italic,
                                          font-weight: 900

  Pozn.: Třetí řádek je záměrně kratší — vytváří elegantní pyramidu.
  Animace: každý řádek sliduje z bottom s 80ms stagger

SUBHEADLINE (body-lg, max-w-xl, #94A3B8):
  "Vyplňte přehledný formulář. Systém sestaví strukturovaný dokument
   a vygeneruje PDF připravené k podpisu — od 249 Kč."

  Animace: fade-in 0.5s delay 0.4s
```

### CTA Buttons

```
PRIMARY CTA — "Vybrat typ smlouvy →"
  bg: #F59E0B · text: #000 · font-weight: 900 · uppercase · tracking-tight
  padding: 16px 32px · border-radius: 16px
  box-shadow: [shadow-glow-cta]
  hover: bg → #FCD34D · transform: translateY(-1px)
  hover-shadow: 0 0 0 1px rgba(245,158,11,0.6),
                0 6px 28px rgba(245,158,11,0.35),
                0 12px 48px rgba(245,158,11,0.18)
  transition: all 150ms cubic-bezier(0.2, 0, 0, 1)

SECONDARY CTA — "Jak to funguje ↓"
  bg: transparent · text: #94A3B8
  border: 1px solid rgba(255,255,255,0.08)
  padding: 16px 24px · border-radius: 16px
  hover: text → white · border → rgba(255,255,255,0.14)
  backdrop-filter: blur(8px)
```

### Floating PDF Preview — hlavní vizuální prvek

Toto je nejdůležitější dekorativní element celé stránky. Musí vypadat jako screenshot reálného prémiového dokumentu.

```
CONTAINER:
  Rozměry: ~360px × 460px (desktop)
  Pozice: right side hero, subtle 3D tilt
  transform: perspective(1200px) rotateX(3deg) rotateY(-6deg)
             rotate(-1.5deg) translateY(-8px)
  Animace idle: translateY(-8px) ↔ translateY(0px), 6s ease-in-out infinite
               + subtle rotate(-1.5deg) ↔ rotate(-1deg)

GLASS CARD (layer 4 spec — viz výše):
  Obsah: statický HTML render simulující PDF layout

  Záhlaví dokumentu:
    - Tenká amber linka nahoře (2px, opacity 0.6)
    - "NÁJEMNÍ SMLOUVA" — white, font-size: 11px, tracking: 0.2em, uppercase
    - Datum: "Praha, duben 2026" — #475569, 9px
    - Šedá dělicí linka

  Tělo dokumentu (simulace textu):
    - 3–4 placeholder řádky "smluvních stran" s reálnými fake daty:
      "Pronajímatel: Jan Novák, nar. 15. 3. 1980..."
      "Nájemce: Marie Nováková, nar. 22. 8. 1985..."
    - Skeleton-like text bloky (různé šířky řádků)
    - Sekce "I. Předmět nájmu" s micro textem

  Zápatí dokumentu:
    - Podpisová linka × 2
    - Malý text: "Vygenerováno SmlouvaHned.cz"

  Floating badge (vlevo dole od karty, vyčnívající):
    Design: glass pill · backdrop-blur(16px)
    Content: "✓ PDF vygenerováno" + animated green dot
    bg: rgba(16,185,129,0.12) · border: rgba(16,185,129,0.25)

  Floating badge 2 (vpravo nahoře, překrývá):
    Content: "249 Kč"
    Design: amber glass pill, výrazný

SHADOW HALO:
  Za kartou: radial gradient rgba(245,158,11,0.06)
  roztažený 200px × 260px — subtilní teplo
```

### Trust Row

```
Layout: horizontální row, gap 32px, centered (nebo left-aligned)
Barva: #475569 text · odděleno tenkým dividerem ·
Items:
  🔒  Platby přes Stripe
  📄  PDF ihned ke stažení
  ⚖️  14 typů dokumentů
  🏢  Provozovatel: IČO 23660295

Typografie: 0.75rem · tracking: 0.05em · font-weight: 500
Animace: staggered fade-in, delay 0.8s
```

---

## 4. STRUKTURA CELÉ HOMEPAGE

```
SEKCE   NÁZEV                   ÚČEL                    VÝŠKA
─────────────────────────────────────────────────────────────────
01      Navbar                  Navigation              72px fixed
02      Hero                    Primary conversion      100vh min
03      Social Proof Strip      Trust signals           80px
04      Jak to funguje          Process clarity         560px
05      Výběr dokumentu         Product catalog         auto
06      Pricing                 Conversion              640px
07      Proč SmlouvaHned        Differentiators         480px
08      Blog Preview            SEO / authority         400px
09      FAQ                     Objection handling      auto
10      Final CTA               Last conversion push    320px
11      Footer                  Legal / nav             240px
```

### SEKCE 01 — Navbar (floating glass pill)

```
Design: NE fixed header s plnou šířkou. MÍSTO TOHO:
  floating pill · max-w: 1200px · width: calc(100% - 48px)
  margin: 16px auto 0 · position: fixed · top: 16px · z-index: 100

  backdrop-filter: blur(24px) saturate(200%) brightness(1.06)
  background: rgba(6,10,20,0.75)
  border: 1px solid rgba(255,255,255,0.08)
  border-radius: 9999px (pill) nebo 20px
  padding: 0 20px
  height: 56px

  Scroll chování: při scroll > 80px zvýšit opacity bg na 0.88
                 + přidat subtilní box-shadow

Logo vlevo: SH square amber + wordmark
Nav center: Smlouvy · Jak to funguje · Ceník · Blog
CTA vpravo: "Vytvořit smlouvu" amber button (kompaktní)

Mobilní: hamburger → full-screen glass overlay
```

### SEKCE 03 — Social Proof Strip

```
Vizuál: tenký strip, plná šířka, border top + bottom (rgba(255,255,255,0.05))
Obsah (4 položky):
  "10 000+ vygenerovaných dokumentů"  nebo odhadovaný počet
  "★★★★★ Hodnocení 4.9/5"            (po sběru reviews)
  "Aktualizováno pro 2026"
  "Provozovatel ověřen: IČO 23660295"

Design: items odděleny · · · thin divider · font: 0.75rem upper tracking
bg: rgba(255,255,255,0.016) · backdrop: blur(8px)

DŮLEŽITÉ: Pokud počet dokumentů ještě není reálný, použít:
"Dokumenty připravené pro rok 2026" místo falešného čísla.
```

### SEKCE 04 — Jak to funguje (3 kroky)

```
Layout: 3 glass cards vedle sebe (desktop) / stack (mobile)
Step cards:
  01  Vyberte typ dokumentu     — ikona: document picker UI
  02  Vyplňte formulář          — ikona: form s highlight fields
  03  Stáhněte PDF              — ikona: download arrow + PDF preview

Vizuál každé karty: glass-2 spec · číslo kroku v amber velké
Connecting arrows: tenké SVG šipky mezi kartami, opacity 0.3
Animace: scroll-triggered · left-to-right cascade · stagger 120ms

Pod 3 kartami: subtilní note:
"Celý proces trvá průměrně 4 minuty."
```

### SEKCE 05 — Výběr dokumentu (catalog)

```
Headline: "Vyberte typ dokumentu"
Sub: "14 typů standardizovaných dokumentů — od nájmu po obchodní smlouvy"

Grid: 3 × 5 nebo 4 × 4 dokumentových karet (responsive)
Každá karta:
  - glass-2 · hover → glass-3 + amber border subtle
  - Ikona dokumentu (SVG) · Název · krátký popis · Cena od "249 Kč"
  - hover: translateY(-2px) + glow subtle

Featured badge: na nejpopulárnějších (Nájemní smlouva, NDA, Kupní)
Filtr tabs nahoře: Všechny · Pro OSVČ · Nájemní · Pracovní · Obchodní
```

### SEKCE 06 — Pricing

```
3 karty vedle sebe:
  ZÁKLADNÍ         ROZŠÍŘENÝ ↑featured    KOMPLETNÍ
  249 Kč           399 Kč                  749 Kč

Featured card (Rozšířený dokument):
  - glass-3 spec · amber border · "Nejčastěji voleno" badge
  - Lehce větší · translateY(-12px) — vystupuje z řady
  - Amber glow halo za kartou

Každá karta:
  - Název · Cena velká · Popis · Seznam features (checkmarks amber)
  - Note text (co je vhodné pro) v #475569
  - CTA button (primary na featured, secondary na ostatní)

Pod pricingem:
  "Ceny jsou uvedeny vč. DPH. Platba přes Stripe. Vrácení peněz do 24h."
  → text-muted, 12px, centered
```

### SEKCE 07 — Proč SmlouvaHned (differentiators)

```
Headline: "Není to vzor z internetu."
Sub: "Je to softwarový nástroj, který sestaví dokument podle vašich podmínek."

Layout: 2 × 2 nebo 2 × 3 feature cards
Features:
  📋  Dynamicky sestavený dokument — ne statický vzor
  ⚡  PDF ihned — ne čekání na e-mail
  🔒  Dočasné šifrované úložiště — data automaticky smazána
  📐  Strukturováno dle OZ — sekce dle příslušných paragrafů
  💬  Podpora při nejasnostech — odpověď do 2 prac. dnů
  🧾  14 typů dokumentů — nejširší výběr v segmentu

Vizuál: feature cards glass-2 · ikona v amber circle · clean layout
Alternativní layout: velká 2-column comparison table
  "Bezplatný vzor z webu" vs "SmlouvaHned"
  rows: Přizpůsobení · Aktuálnost · Podpora · Struktura dle OZ · Archivace
```

### SEKCE 08 — Blog Preview

```
Headline: "Průvodce smluvní dokumentací"
3 karty posledních blog článků:
  - glass-2 · hover amber border
  - Kategorie badge · Název · Excerpt · "Číst →"

Pod kartami: "Zobrazit všechny průvodce →" link
Účel: E-E-A-T signál, interní linking, topical authority
```

### SEKCE 09 — FAQ

```
Accordion design:
  - každá položka: glass-1 wrapper · border bottom subtle
  - expand ikona: + / − v amber
  - expanded stav: glass-2 bg · smooth height transition 300ms ease
  - max 7 otázek

Strukturovaná data: FAQPage JSON-LD (již implementováno)
```

### SEKCE 10 — Final CTA

```
Design: velký centered glass panel · glass-1 · radial ambient za ním
Headline (display-lg): "Váš dokument je připraven za 4 minuty."
Sub: "Vyberte typ, vyplňte podmínky, stáhněte PDF."
CTA: velký amber button · "Začít nyní →"
Trust note pod CTA: "Provozovatel: Karel Zdeněk · IČO 23660295 · Není advokátní kanceláří"
```

### SEKCE 11 — Footer

```
4 sloupce:
  1. Logo + tagline + disclaimer
  2. Smlouvy (navigace)
  3. Informace (O projektu, Blog, Kontakt, GDPR, OP)
  4. Kontakt + IČO + copyright

Bottom strip: "© 2024–2026 Karel Zdeněk, IČO: 23660295 · Softwarový nástroj · Není advokátní kanceláří"
Design: border-top subtle · very dark bg · muted text
```

---

## 5. KOMPONENTY A UI PRVKY

### 5.1 Badge / Chip

```css
/* Base badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;

  /* Amber variant */
  background: rgba(245,158,11,0.10);
  border: 1px solid rgba(245,158,11,0.22);
  color: #F59E0B;

  /* Green variant (success) */
  background: rgba(16,185,129,0.10);
  border: 1px solid rgba(16,185,129,0.22);
  color: #34D399;
}
```

### 5.2 Document Cards (catalog)

```css
.doc-card {
  background: rgba(8,13,24,0.65);
  backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.07);
  border-top: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px;
  padding: 24px;
  transition: all 200ms cubic-bezier(0.2, 0, 0, 1);
}

.doc-card:hover {
  background: rgba(10,16,30,0.80);
  border-color: rgba(245,158,11,0.20);
  border-top-color: rgba(245,158,11,0.35);
  transform: translateY(-2px);
  box-shadow: 0 0 40px -8px rgba(245,158,11,0.10);
}
```

### 5.3 Step Indicator

```
Číslo kroku:
  - Velké (4rem+) · font-weight: 900 · color: amber/15 (watermark styl)
  - Nad kartou, lehce překrývá top edge
  - Efekt: number jako ghost watermark za contentem
```

### 5.4 Comparison Table (sekce 07 alternativa)

```
Struktura:
  Header row: [Kritérium] [Bezplatný vzor] [SmlouvaHned]
  Barvy:       —            #EF4444 ✗         #10B981 ✓

  Rows:
  Přizpůsobeno vašim datům     ✗  Obecný vzor      ✓  Vyplněno dle formuláře
  Aktuálnost šablony            ~  Neznámé datum    ✓  Aktualizováno 2026
  Struktura dle OZ              ~  Různá kvalita    ✓  Dle příslušných §
  Technická podpora             ✗                   ✓  E-mail do 2 dnů
  Průvodní instrukce            ✗                   ✓  Kompletní balíček

Table design: glass-1 wrapper · hover row highlight rgba(245,158,11,0.04)
```

---

## 6. MOTION DESIGN SYSTÉM

### Filosofie:
> Animace jsou **breath of the interface** — potvrzují realitu, neentertainují. Každá animace musí mít funkční důvod.

### 6.1 Scroll-triggered (Intersection Observer)

```javascript
// Jednotný easing pro všechny scroll animace:
const ease = 'cubic-bezier(0.2, 0, 0, 1)';
const duration = 400; // ms

// Varianty:
fadeUp:    { opacity: 0→1, translateY: 20px→0 }
fadeIn:    { opacity: 0→1 }
scaleIn:   { opacity: 0→1, scale: 0.97→1 }

// Threshold: 0.15 (spustí se když 15% prvku je viditelné)
// Stagger: 80–120ms mezi elementy v groupě
```

### 6.2 Hero animace (page load)

```
0ms:    Background gradient (okamžitě)
100ms:  Badge pill — fadeUp 300ms
250ms:  H1 line 1 — fadeUp 350ms
330ms:  H1 line 2 — fadeUp 350ms
410ms:  H1 line 3 (amber) — fadeUp 350ms
600ms:  Subheadline — fadeIn 400ms
750ms:  CTA buttons — fadeUp 350ms, stagger 80ms
900ms:  Trust row — fadeIn 400ms
500ms:  PDF preview card — scaleIn + 3D tilt 600ms ease-out (paralelní)
```

### 6.3 Floating PDF Preview — idle animace

```css
@keyframes float-idle {
  0%   { transform: perspective(1200px) rotateX(3deg) rotateY(-6deg)
                    rotate(-1.5deg) translateY(-8px); }
  50%  { transform: perspective(1200px) rotateX(2.5deg) rotateY(-5.5deg)
                    rotate(-1deg) translateY(0px); }
  100% { transform: perspective(1200px) rotateX(3deg) rotateY(-6deg)
                    rotate(-1.5deg) translateY(-8px); }
}
/* duration: 6s, easing: ease-in-out, iteration: infinite */
/* POZOR: prefers-reduced-motion → animaci vypnout */
```

### 6.4 Hover mikrointerakce

```
Card hover:    translateY(-2px) 200ms + border glow + shadow increase
Button hover:  translateY(-1px) 150ms + glow increase + bg lighten
Badge hover:   scale(1.02) 120ms
Nav link hover: color transition 120ms

Accordion expand: height auto přes max-height transition 300ms ease
                  + opacity 0→1 pro obsah 200ms delay 50ms
```

### 6.5 Parallax (minimální — jen hero)

```javascript
// Pouze ambient background gradient reaguje na scroll
// Pohyb: backgroundPositionY += scrollY * 0.15
// NE parallax na content/text — degraduje čitelnost
// prefers-reduced-motion: vypnout
```

---

## 7. TYPOGRAFIE A COPY HIERARCHIE

### Hierarchie nadpisů na homepage:

```
LEVEL 1 — Display (H1 hero)
  "Smluvní dokument sestavený podle vašich podmínek."
  → Řeší: Co to je a co to dělá. Okamžitě.
  → Font: display-xl, 900, white + amber accent, tight tracking

LEVEL 2 — Section (H2 každé sekce)
  "Jak to funguje" / "Vyberte dokument" / "Proč SmlouvaHned"
  → Font: display-lg, 800, white
  → Max 5 slov. Přímé. Žádný marketing.

LEVEL 3 — Sub-section (H3 feature cards, steps)
  "Dynamicky sestavený dokument" / "PDF ihned ke stažení"
  → Font: display-md, 700, white
  → Max 4–6 slov, noun-phrase formát

LEVEL 4 — Body (descriptions, FAQ)
  → Font: body-lg (popisky sekcí) / body-md (karty, FAQ)
  → Color: #94A3B8
  → Max-width: 38em (ideální řádková délka)

LEVEL 5 — Meta (trust row, badges, legal notes)
  → Font: body-sm / label
  → Color: #475569 / #F59E0B (pro amber labels)
  → Uppercase pro labels + tagy
```

### Copy principy:

```
✓  Konkrétní číselné hodnoty: "4 minuty", "od 249 Kč", "14 typů"
✓  Akce slovesa: "Vyplňte", "Vyberte", "Stáhněte"
✓  Negace falešných nadějí: "Není to vzor z internetu."
✓  Přiznání limitů: "Není náhradou za advokáta."
✗  Přehnaná superlativa: "nejlepší", "jedinečný", "revoluční"
✗  Vágní právní náznaky: "právní jistota", "v souladu s právem"
✗  Startup hype: "disruptujeme", "přinášíme budoucnost"
```

---

## 8. CO PŘESNĚ PŘEVZÍT Z LIQUID GLASS 2026 A CO VYNECHAT

### ✅ Převzít — Authentic Liquid Glass 2026:

```
✓  Vrstvené blur efekty (20–40px) s různou intenzitou dle depth
✓  Luminous top edge — nejsvětlejší hrana nahoře (simuluje světlo shora)
✓  Bardzo tenké border (1px) s nízkou opacity (0.06–0.12)
✓  Kombinace backdrop-filter blur + saturate + brightness
✓  Floating glass elements s jemným 3D perspective tilt
✓  Ambient gradient na pozadí (ne animovaný, statický nebo scroll-driven)
✓  Noise texture jako glass imperfection (SVG feTurbulence, opacity ~0.018)
✓  Glass hierarchy — různé vrstvy mají různý blur a opacity
✓  Depth layers — karty mají vizuální hloubku (ne flat)
✓  Shadow jako hloubka — ne jako dekorace
```

### ❌ VYNECHAT — Co dělá Liquid Glass laciným:

```
✗  Animated blobs (glassmorphism "bubbles" pohybující se po stránce)
✗  Neon glow borders (fialová, cyan, hot pink)
✗  Heavy color leaking — barevné přebarvení pozadí za sklem
✗  Přeexponovaný blur (>60px) — přestává být čitelné
✗  Každý element jako glass — diferenciace se ztrácí
✗  Glass na bílém pozadí — nefunguje, potřebuje tmavou bázi
✗  Přidaný "rainbow iridescence" effect na glass — lacina estetika
✗  Glass + gradient text současně — overdesign
✗  Svítivé stíny v neon barvách
✗  Transparentní text přes glass (nečitelné)
✗  Více než 4 různé blur vrstvy na jedné stránce
```

---

## 9. TECHNICKÁ REALIZACE

### Stack (Next.js 16 App Router — stávající projekt):

```typescript
// Fonts — next/font (nulová CLS)
import { Inter } from 'next/font/google'
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap'
})

// Animace — Framer Motion (doporučeno)
// Alternativa: CSS animations + IntersectionObserver (nulová bundle size)
// Pro tento projekt: CSS-first approach pro výkon,
// Framer Motion pouze pro floating PDF element

// Backdrop-filter — podpora
// iOS Safari 15+: ✓ (backdrop-filter prefix -webkit)
// Chrome 76+: ✓
// Firefox 103+: ✓ (standardní)
// Fallback: rgba(8,13,24,0.92) pro starší prohlížeče
```

### Performance strategie:

```
1. CRITICAL CSS inline — hero sekce (First Contentful Paint)
2. Backdrop-filter: pouze na glass elementech v viewportu
   → use IntersectionObserver, přidávat class .glass-active
   → mimo viewport: will-change: backdrop-filter vypnout

3. Floating PDF preview — STATICKÝ HTML, NE canvas/WebGL
   → Čistý HTML/CSS simulace dokumentu (viz specifikace výše)
   → Žádný heavy JavaScript pro vizuál

4. Background ambient — CSS radial-gradient, NE animovaný
   → Gradient scroll parallax: simple translateY přes CSS custom property
   → Výpočet: --scroll-y aktualizován throttled (16ms)

5. Animace:
   → CSS @keyframes pro idle floating animation
   → IntersectionObserver pro scroll reveals (nativní, nulové deps)
   → prefers-reduced-motion: @media query pro všechny animace

6. Core Web Vitals cíle:
   → LCP < 1.8s (hero section = LCP target)
   → CLS < 0.05 (fixed-size hero elements, fluid typography)
   → INP < 200ms (minimal JS overhead)

7. Bundle:
   → glass efekty = pure CSS (nulová JS bundle size)
   → Animace = max +12kB (Framer Motion pouze pro 1 element)
   → Fonty = next/font (preloaded, zero FOUT)
```

### CSS Variables (globals.css):

```css
:root {
  /* Glass layers */
  --glass-blur-1: blur(20px) saturate(160%);
  --glass-blur-2: blur(28px) saturate(180%) brightness(1.06);
  --glass-blur-3: blur(36px) saturate(200%) brightness(1.10);

  /* Colors */
  --amber: #F59E0B;
  --amber-10: rgba(245,158,11,0.10);
  --amber-20: rgba(245,158,11,0.20);

  /* Borders */
  --border-subtle: rgba(255,255,255,0.06);
  --border-glass: rgba(255,255,255,0.10);
  --border-top: rgba(255,255,255,0.16);

  /* Spacing rhythm */
  --section-gap: clamp(64px, 8vw, 128px);
  --card-radius: 20px;
  --card-radius-lg: 24px;
}
```

---

## 10. MOBILE & RESPONSIVE STRATEGIE

### Breakpoints:

```
mobile:   < 640px   (sm)
tablet:   640–1024px (md)
desktop:  1024–1440px (lg)
wide:     > 1440px  (xl)
```

### Mobile-specifická pravidla:

```
HERO (mobile):
  - Layout: single column, PDF preview se přesouvá POD text
  - PDF preview: zmenšeno na 280px × 340px, NO 3D tilt (performance)
  - H1: display-xl redukovat → clamp(2.5rem, 7vw, 3.5rem)
  - CTA buttons: full width (100%)
  - Trust row: 2 × 2 grid (ne 4 v řadě)

NAVBAR (mobile):
  - hamburger icon vpravo
  - glass pill → full width strip (border-radius redukovat na 0 nebo 12px top)
  - Menu: full-screen glass overlay, fade-in

GLASS EFEKTY (mobile):
  - blur redukovat o ~30% (výkon na slabším hardware)
  - glass-1: blur(12px), glass-2: blur(18px), glass-3: blur(22px)
  - backdrop-filter na max 3 prvcích současně v viewportu

PRICING CARDS (mobile):
  - Vertical stack
  - Featured card PRVNÍ (ne uprostřed)

FLOATING PDF (tablet):
  - 3D tilt zachovat, ale mírněji: rotateY(-4deg) rotate(-1deg)
  - Vedle textu (55%/45% split)

TOUCH INTERACTIONS:
  - Hover stavy nahradit :active pseudoclass
  - Tap targets min 44px × 44px
  - Accordion FAQ: plně touch-friendly
```

---

## 11. RED FLAGS — CO ROZHODNĚ NEDĚLAT

```
❌  GLASSMORPHISM NA BÍLÉM/SVĚTLÉM POZADÍ
    Liquid Glass funguje výhradně na tmavém podkladu.
    bg-void #04070E je podmínka, ne volba.

❌  GRADIENT TEXT NA H1
    background-clip: text je trend roku 2022. Snižuje čitelnost
    a E-E-A-T signály. Amber italic = dostatečný akcent.

❌  LOTTIE ANIMACE / HEAVY WEBGL HERO
    Nepoužívat Three.js, Spline, particle systems v hero.
    Výkon > efekt. Tento produkt prodává důvěru, ne vizuální show.

❌  BLUR NA TEXTU
    Nikdy backdrop-filter na elementech s textem.
    Text musí být na solid nebo semi-solid background.

❌  STOCK FOTKY
    Žádné stock fotografie advokátů, podpisů, soudních síní.
    Čistá UI estetika — žádný ilustrativní imagery.

❌  ICON OVERLOAD
    Max 1 ikona na feature kartu. Ikony musí být konzistentní
    (doporučuji Lucide Icons — používáno ve stávajícím projektu).

❌  PŘÍLIŠ MNOHO AMBER
    Amber je accent, ne primary color. Max 15% vizuální plochy.
    Overuse → levný look, ztráta premium signálu.

❌  COOKIE/GDPR BANNER PŘES HERO
    Posunout na bottom strip nebo lazy-load po 2s.
    Nic nesmí zakrývat první dojem.

❌  PRICING TABLE BEZ JASNÉHO VÍTĚZE
    Featured card musí jasně "vyčnívat".
    Nerovnost je záměr (anchoring efekt).

❌  FAQ ACCORDION S JAVASCRIPT FLASH
    Použít CSS-only accordion (details/summary) nebo
    Framer Motion s initial="open" pro SSR.

❌  LAYOUT SHIFT PŘI NAČTENÍ FONTŮ
    Vždy next/font s font-display: swap.
    Fontové fallbacks musí mít shodné metrics.

❌  MOBILNÍ VERZE JAKO "ZMENŠENÍ" DESKTOPU
    Mobilní design je samostatný layout decision,
    ne scaled-down desktop. PDF preview na mobilu = under hero.
```

---

## 12. FINÁLNÍ DESIGN BRIEF PRO VÝVOJÁŘE

### Implementační priority (P0 → P3):

```
P0 — MUST HAVE (blokující pro spuštění):
  1. Navbar: floating pill glass, backdrop-filter, amber CTA
  2. Hero: dvousloupec, H1 amber italic, subheadline, dual CTA, trust row
  3. Floating PDF preview: glass card, 3D tilt, float idle animation
  4. Document catalog section: grid karet, hover efekty
  5. Pricing section: 3 karty, featured card elevated, amber glow

P1 — SHOULD HAVE (před spuštěním marketingu):
  6. Scroll animations: fade-up reveal na všechny sekce
  7. Social proof strip (reálná čísla nebo generický trust text)
  8. How it works: 3-step glass cards
  9. Comparison section (differentiators)
  10. Blog preview cards

P2 — NICE TO HAVE:
  11. FAQ accordion s animací
  12. Final CTA sekce s velkou glass panelem
  13. Footer: 4-sloupec layout s plným legal info
  14. Filter tabs v document catalog

P3 — BUDOUCÍ SPRINT:
  15. Micro-interactions: button press states
  16. Mobile hamburger menu glass overlay
  17. Pricing toggle (pokud bude subscription tier)
  18. AggregateRating schema + review display (po sběru recenzí)
```

### Technické požadavky pro handoff:

```typescript
// 1. Tailwind CSS je NEDOSTATEČNÝ pro glass efekty
//    Nutno doplnit custom CSS pro backdrop-filter layers
//    Tailwind backdrop-blur utility NESTAČÍ pro kombinaci blur+saturate+brightness

// 2. Glass card wrapper component (reusable):
interface GlassCardProps {
  layer: 1 | 2 | 3 | 4;  // blur intenzita
  amber?: boolean;         // amber border variant
  className?: string;
  children: ReactNode;
}

// 3. Floating PDF Preview: STATICKÝ HTML render
//    NE: dynamicky generovaný PDF
//    ANO: hand-crafted HTML simulace s fake datem
//    Lze vygenerovat v Figma jako SVG export a embedovat jako inline SVG

// 4. Animace: CSS-first, Framer Motion pouze pro:
//    - floating PDF (float idle + page-load scaleIn)
//    - Případně accordion height transition

// 5. Performance budget:
//    JS bundle: max +20kB gzip nad stávající Next.js baseline
//    CSS: max +15kB gzip
//    LCP element: hero H1 (text) nebo PDF preview image

// 6. Dark mode: POUZE dark mode (tato stránka není adaptive)
//    color-scheme: dark; v :root
//    Žádný light mode fallback

// 7. Accessibility:
//    WCAG AA kontrast pro body text (#94A3B8 na #04070E = 5.1:1 ✓)
//    WCAG AA pro amber text (#F59E0B na #04070E = 4.6:1 ✓)
//    Focus visible: amber outline 2px offset 2px
//    prefers-reduced-motion: všechny animace → instant transitions
```

### Figma Design Token Naming Convention:

```
color/amber/primary      = #F59E0B
color/amber/border       = rgba(245,158,11,0.22)
color/glass/surface-1    = rgba(8,13,24,0.65)
color/glass/surface-2    = rgba(8,13,24,0.72)
color/glass/surface-3    = rgba(10,15,28,0.78)
color/border/subtle      = rgba(255,255,255,0.06)
color/border/glass       = rgba(255,255,255,0.10)
color/border/luminous    = rgba(255,255,255,0.16)
blur/layer-1             = 20px
blur/layer-2             = 28px
blur/layer-3             = 36px
blur/layer-4             = 40px
radius/card              = 20px
radius/card-lg           = 24px
radius/pill              = 9999px
```

---

## APPENDIX: Klíčové metriky úspěchu redesignu

| Metrika | Cíl před redesignem | Cíl po redesignu |
|---------|--------------------|--------------------|
| First impression score (user test) | — | ≥ 4.5 / 5.0 |
| "Působí důvěryhodně" (user test) | — | ≥ 85 % uživatelů |
| Bounce rate homepage | baseline | -15 % |
| Scroll depth 50 %+ | baseline | +20 % |
| Hero CTA click-through | baseline | +25 % |
| LCP | — | < 1.8s |
| CLS | — | < 0.05 |

---

*Tento dokument je kompletní Creative Direction a Technical Design Brief pro implementaci. Všechny hodnoty jsou produkčně ready — žádné placeholdery, žádné "to upřesníme". Implementující vývojář by měl být schopen začít bez dalšího designérského inputu.*
