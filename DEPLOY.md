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
| 🟡 `RESEND_NEWSLETTER_SEGMENT_ID` | Segment pro newsletter v patičce | Resend → Segments → ID (`seg_…`) |
| 🔴 `NEXT_PUBLIC_BASE_URL` | Produkční doména | `https://www.smlouvahned.cz` |

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
- [ ] Nastavit `INTERNAL_REPORTING_SECRET` a otevřít `/interni/analytics?secret=<hodnota>` pro produktový funnel
- [ ] V **Google Search Console** ověřit doménu `www.smlouvahned.cz` a odeslat sitemap (`/sitemap.xml`)
- [ ] Nastavit `RESEND_NEWSLETTER_SEGMENT_ID` pro přihlášení v patičce (viz sekce 3)

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
