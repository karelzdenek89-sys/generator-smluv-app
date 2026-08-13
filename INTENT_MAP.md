# SmlouvaHned — intent a canonical mapa

Poslední aktualizace: 2026-08-13

## Pravidla

- **Formulář** cílí na transakční dotazy: „online“, „vytvořit“, „formulář“, „PDF“.
- **Blog** cílí na informační dotazy: „vzor“, „co musí obsahovat“, „limity“, „chyby“ a konkrétní situace.
- Samostatná SEO landing page zůstává jen tam, kde má prokazatelně jiný záměr než formulář i blog.
- Canonical, sitemap, hreflang, Open Graph a JSON-LD používají výhradně `https://www.smlouvahned.cz`.
- Interní odkazy míří přímo na cílovou URL, nikoli přes přesměrování.

## Konsolidované clustery

| Cluster | Transakční URL | Informační URL | Vyřazená URL → 308 cíl |
|---|---|---|---|
| Nájemní smlouva | `/najem` | `/blog/najemni-smlouva-vzor-2026` | `/najemni-smlouva` → `/najem` |
| Pracovní smlouva | `/pracovni` | `/blog/pracovni-smlouva-2026` | `/pracovni-smlouva` → `/pracovni` |
| DPP | `/dpp` | `/blog/dpp-dohoda-provedeni-prace` | `/dohoda-o-provedeni-prace` → `/dpp` |
| Smlouva o spolupráci | `/spoluprace` | `/blog/smlouva-o-spolupraci-2026` | `/smlouva-o-spolupraci` → `/spoluprace` |

Vyřazené URL se nesmí vrátit do sitemap ani do aktivní interní navigace. Jejich zdrojové route soubory zatím zůstávají v repozitáři jako snadno dohledatelná historie; `next.config.ts` je obslouží přesměrováním před filesystémem.

## HR podpůrné informační dotazy

Tyto URL rozvíjejí jiné informační záměry a odkazují na hlavní DPP/pracovní hub i příslušný builder:

| Záměr | Primární URL | Následující krok |
|---|---|---|
| zkušební doba, 4/8 měsíců, prodloužení | `/blog/zkusebni-doba-2026` | `/pracovni` |
| DPP vs. DPČ | `/blog/dpp-dpc-porovnani-2026` | `/dpp` nebo `/pracovni` |
| smlouva o dílo vs. DPP | `/blog/smlouva-o-dilo-vs-dpp-2026` | `/dpp` nebo `/smlouva-o-dilo` |
| minimální mzda, DPP a pracovní smlouva | `/blog/minimalni-mzda-dpp-pracovni-smlouva-2026` | `/dpp` nebo `/pracovni` |
| švarcsystém | `/blog/svarcsystem-osvc-2026` | `/pracovni`, `/dpp` nebo `/spoluprace` podle skutečného vztahu |

GSC snapshot dodaný 13. 8. 2026 označil `/blog/dpp-dohoda-provedeni-prace` jako stránku s vysokými impresemi a slabým CTR. Titulek je proto query-first, ale URL a její informační role zůstávají beze změny. Bez stránkového exportu GSC se další URL automaticky nekonsolidují ani nepřepínají do free režimu.

## Aktivní specializované landing pages

Tyto stránky se nekonsolidují bez nových dat z Google Search Console:

| URL | Odlišný záměr |
|---|---|
| `/najemni-smlouva-byt` | konkrétní ujednání pro byt: kauce, zvířata, předávací protokol |
| `/smlouva-o-dilo-online` | praktická volba smlouvy o dílo a cesta k formuláři |
| `/kupni-smlouva` | obecná kupní smlouva pro movité věci |
| `/darovaci-smlouva` | darovací smlouva a její použití |
| `/nda-smlouva` | NDA a mlčenlivost |
| `/pujcka-smlouva` | zápůjčka mezi osobami |
| `/podnajemni-smlouva` | podnájem a souhlas pronajímatele |
| `/plna-moc-online` | výběr rozsahu a formy plné moci |
| `/uznani-dluhu-vzor` | uznání dluhu a splátkový kalendář |
| `/smlouva-o-sluzbach` | opakované B2B služby |

## Kontrola před přidáním nové URL

1. Popsat jediný hlavní vyhledávací záměr a cílovou konverzi.
2. Ověřit, že stejný záměr už nepokrývá formulář, landing ani blog.
3. Přidat self-canonical na `www`, přímé interní odkazy a sitemap jen pro indexovatelnou URL.
4. Pokud nová URL nahrazuje starou, přidat trvalé přesměrování a starou URL odstranit ze sitemap i navigace.
