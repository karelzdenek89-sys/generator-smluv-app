# SmlouvaHned — Deployment Checklist

> Před spuštěním projdi každý bod. Položky označené 🔴 jsou **blokující** — bez nich produkce nefunguje.

---

## 1. Vercel — Environment Variables

Nastav v **Project → Settings → Environment Variables** (Production):

| Proměnná | Popis | Kde získat |
|---|---|---|
| 🔴 `STRIPE_SECRET_KEY` | Živý Stripe secret key | dashboard.stripe.com → Developers → API keys |
| 🔴 `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | Stripe → Webhooks → po vytvoření endpointu |
| 🔴 `STRIPE_PRICE_ID_BASIC` | Live Price ID — základní dokument (99 Kč) | Stripe → Products → `price_xxx` |
| 🔴 `STRIPE_PRICE_ID_PRO` | Live Price ID — legacy profesionální (199 Kč), volitelné | Stripe → Products |
| 🔴 `STRIPE_PRICE_ID_PREMIUM` | Live Price ID — rozšířený dokument / complete (199 Kč) | Stripe → Products |
| 🔴 `STRIPE_PRICE_ID_PACKAGE` | Live Price ID — tematický balíček pronajímatel / auto (299 Kč) | Stripe → Products |
| 🔴 `UPSTASH_REDIS_REST_URL` | Upstash Redis URL | console.upstash.com |
| 🔴 `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token | console.upstash.com |
| 🔴 `RESEND_API_KEY` | E-mail API klíč | resend.com → API Keys |
| ⚪ `RESEND_NEWSLETTER_SEGMENT_ID` | Volitelně: kopie přihlášení do Resend pro broadcast | Resend → Segments |
| 🔴 `NEXT_PUBLIC_BASE_URL` | Produkční doména | `https://www.smlouvahned.cz` |
| 🟡 `CRON_SECRET` | Tajný klíč pro Vercel Cron (`/api/cron/reminders`, připomínky Moje zakázka). Bez něj cron fail-closed neposílá nic. | libovolný dlouhý náhodný řetězec |
| ⚪ `NEXT_PUBLIC_FEATURE_CASE_ENGINE` | Kill switch Case Engine (Moje zakázka). Výchozí zapnuto; `false` vypne. | — |
| ⚪ `NEXT_PUBLIC_FEATURE_SUBSCRIPTIONS` | Měřený zájem o předplatné (prodej není možný). Výchozí vypnuto. | — |
| ⚪ `NEXT_PUBLIC_FEATURE_COMMERCIAL_INTENTS` | Sběr commercial intentu pro partnera. Výchozí vypnuto; fail-closed. | — |

> ⚠️ Nikdy nepoužívej `sk_test_` nebo `pk_test_` klíče v produkci.

---

## 2. Stripe — Živý mód

- [ ] V Stripe dashboardu přepnout z **Test mode** na **Live mode**
- [ ] Aktivovat live secret key + publishable key (bod 1 výše)
- [ ] Vytvořit produkční **Webhook endpoint**:
  - URL: `https://www.smlouvahned.cz/api/stripe/webhook`
  - Events: `checkout.session.completed`
  - Zkopírovat **Signing secret** → `STRIPE_WEBHOOK_SECRET`
- [ ] Ověřit, že Stripe má povoleny platební metody: Karta, Apple Pay, Google Pay
- [ ] Nastavit **Stripe branding** (logo, barvy) ve Stripe → Settings → Branding

---

## 3. Resend — E-mail

- [ ] Ověřit doménu `smlouvahned.cz` v Resend → Domains (přidat DNS záznamy)
- [ ] Potvrdit, že odesílatel `dokumenty@smlouvahned.cz` je povolen
- [ ] Otestovat odeslání testovacího e-mailu přes Resend dashboard
- [ ] Vytvořit segment **Newsletter** (Resend → Segments) a nastavit `RESEND_NEWSLETTER_SEGMENT_ID` ve Vercel
- [ ] Otestovat přihlášení v patičce webu (checkbox souhlasu + e-mail) a ověřit kontakt v Resend

---

## 4. Upstash Redis

- [ ] Vytvořit produkční databázi (region: EU Frankfurt pro GDPR)
- [ ] Nastavit **Eviction policy**: `allkeys-lru` (ochrana před zaplněním paměti)
- [ ] Ověřit TLS je zapnuto
- [ ] Nastavit max memory limit dle plánu

---

## 5. Doména a DNS

- [ ] Koupit doménu `smlouvahned.cz` (nebo `.com`)
- [ ] Přidat doménu do Vercel → Settings → Domains
- [ ] Přidat DNS záznamy dle Vercel instrukcí (A record nebo CNAME)
- [ ] Ověřit HTTPS certifikát (Vercel jej vystaví automaticky)
- [ ] Nastavit redirect: `smlouvahned.cz` → `www.smlouvahned.cz`

---

## 6. Statistiky a reporting

- [ ] V **Vercel → Project → Analytics** zapnout **Web Analytics** (návštěvy, stránky, země, zařízení)
- [ ] Volitelně zapnout **Speed Insights** (Core Web Vitals)
- [ ] Nastavit `INTERNAL_REPORTING_SECRET` a jednou otevřít `/interni/analytics/auth?secret=<URL-encoded hodnota>` (cookie 30 dní); pak stačí `/interni/analytics`. Secret s `+` v URL vždy URL-enkódovat (`%2B`).
- [ ] V **Google Search Console** ověřit doménu `www.smlouvahned.cz` a odeslat sitemap (`/sitemap.xml`)
- [ ] Přihlášení v patičce ukládá e-maily do Redis (Upstash) — Resend pro newsletter není nutný

---

## 7. Smoke test po nasazení

Projdi tento scénář **se skutečnou kartou v živém módu**:

- [ ] Otevřít `https://www.smlouvahned.cz` — homepage se načte
- [ ] Vybrat smlouvu (např. Kupní smlouva), vyplnit formulář
- [ ] Zaplatit reálnou malou částku v live módu — Stripe checkout se otevře a projde
- [ ] Success stránka zobrazí progress bar a pak tlačítko „Stáhnout PDF"
- [ ] PDF se stáhne a je správně vygenerováno
- [ ] Pokud byl zakoupen DOCX doplněk, stáhne se i editovatelný DOCX
- [ ] Zkontrolovat e-mailovou schránku — potvrzovací e-mail dorazil s přímým odkazem ke stažení
- [ ] Zákaznická zóna (`/zakaznicka-zona`) — zadat e-mail z objednávky → objednávka se zobrazí
- [ ] Stripe dashboard → Payments — platba se eviduje

---

## 7a. Smoke test portálu 2.0 (Moje zakázka)

- [ ] `/api/health` vrací `status: ok` a `checks.remindersCron: configured`
- [ ] `/zakazka`, `/zamestnavam`, `/nastroje`, `/zmeny-2027` se načtou (200) a jsou v `/sitemap.xml`
- [ ] `/moje-zakazka` bez odkazu zobrazí „Odkaz k zakázce je neplatný“ a hlavičku `X-Robots-Tag: noindex`
- [ ] Po zaplacení smlouvy o dílo (test mode) se na success stránce zobrazí „Pokračovat jako zakázka“, zakázka se otevře a přijde e-mail s návratovým odkazem
- [ ] V zakázce lze nastavit termín, zapnout připomínky (objeví se plán 30/14/7/1 dní) a exportovat JSON
- [ ] Vercel → Cron Jobs ukazuje `/api/cron/reminders` (denně 06:00 UTC); ruční spuštění bez Bearer vrací 401

## 8. SEO (doporučeno před spuštěním)

- [ ] Ověřit Open Graph meta tagy (`/`) — sdílení na sociálních sítích
- [ ] Zkontrolovat `robots.txt` (`/public/robots.txt`)

---

## 9. Právní stránky

- [ ] Ověřit `/obchodni-podminky` — obsahuje ceny, TTL dokumentů (7/14/30 dní), reklamační postup
- [ ] Ověřit `/gdpr` — odpovídá skutečnému zpracování dat
- [ ] Doplnit kontaktní adresu a IČO provozovatele do obchodních podmínek

---

## 10. Monitoring

- [ ] Zapnout **Vercel Email Alerts** pro build failures
- [ ] Nastavit uptime monitor (např. UptimeRobot — zdarma) na `https://smlouvahned.cz`
- [ ] Přidat Sentry nebo Vercel Error Tracking pro sledování runtime chyb

---

## Po spuštění — první týden

- [ ] Denně kontrolovat Stripe dashboard — platby, spory, refundy
- [ ] Sledovat Vercel Function Logs — chyby webhoku, download route
- [ ] Otestovat zákaznickou zónu s reálnou objednávkou
- [ ] Sbírat feedback od prvních zákazníků

---

*Tento soubor lze smazat po úspěšném nasazení.*

## Rollback (design 2027 + case store hardening, 2026-09-17)

- Produkční SHA před releasem: `c1a469f` (deployment `generator-smluv-ggc9519z0`).
- Změny: homepage 2027 (glass/neon, finder, ukázka zakázky), Newsreader pro nadpisy na celém webu (CSS revize `sh20260917b`), atomický Lua zápis případu vč. indexu nezaplacených dokumentů (ověřeno na Upstash: cjson, TTL preserve, SCAN), checkout s uloženým požadavkem před voláním Stripe.
- Datový model zůstává dopředně kompatibilní (`checkoutRequest`, snapshoty `legacy-frozen-2026.2`, `case:maintenance:pending-scan`); rollback nevyžaduje migraci.
- Lokální náhled bez dotyku produkce: `npm run dev:local` (port 3200, paměťový Redis, vypnutý Stripe).

## Rollback (fix release po nezávislém review, 2026-09-17)

- Produkční SHA před releasem: `b739196` (deployment `generator-smluv-heqfki8at`).
- Datový model případu je dopředně kompatibilní: nové klíče `case:rev:*`, `case:seen:*`, `case:documents:pending` a pole `snapshot`, `checkoutAttempts`, `closedAt`, `revision` starší build ignoruje; rollback nevyžaduje migraci. Dokumenty vytvořené novým buildem nesou snapshot, který starší build nečte (renderuje z aktuálního stavu).
- Návratová URL z platby už nenese `#access=`; při rollbacku na `b739196` se návrat z platby chová postaru (token opět v URL).

## Rollback (release Growth Engine, 2026-09-17)

- Produkční SHA před releasem: `0072f76` (deployment `generator-smluv-n6j8jlr7q`, promoted po nastavení CRON_SECRET).
- Release SHA: `b739196` (`main`), preview ověřen na `preview-growth-engine-clusters` (195/196 hosted checks — chybí jen health 503 bez Redis na preview; Playwright 30/30).
- Rychlý rollback: Vercel → Deployments → `generator-smluv-n6j8jlr7q` → „Promote to Production“. Žádná migrace dat: retence případů se mění jen TTL při dalším zápisu, starší build záznamy bez `orderSessionId` čte beze změny.
- Po rollbacku zůstane 17 nových URL v indexu bez cíle (404) — proto rollback jen při skutečné regresi funnelu, ne kvůli obsahu; obsahovou chybu opravit dopředu.

## Rollback (release SmlouvaHned 2.0, 2026-09-17)

- Produkční SHA před releasem: `f903e20e3593abc18668cf1157c8b118b2837184` (deployment `dpl_F1xKMF85sTs8Qg1D1ufL5wHr4v42`).
- Rychlý rollback: Vercel → Deployments → předchozí production deployment → „Promote to Production“ (žádná DB migrace neproběhla; nové Redis klíče `case:*` a `partner:*` jsou aditivní a starší build je ignoruje).
- Měkký rollback bez redeploye: `NEXT_PUBLIC_FEATURE_CASE_ENGINE=false` + redeploy skryje Moje zakázku (nové routy portálu zůstávají, jsou statické a bez závislostí).
- Cron připomínek je fail-closed bez `CRON_SECRET`; jeho odstranění zastaví odesílání.
