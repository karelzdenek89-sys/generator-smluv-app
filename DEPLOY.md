# SmlouvaHned — Deployment Checklist

> Před spuštěním projdi každý bod. Položky označené 🔴 jsou **blokující** — bez nich produkce nefunguje.

---

## 1. Vercel — Environment Variables

Nastav v **Project → Settings → Environment Variables** (Production):

| Proměnná | Popis | Kde získat |
|---|---|---|
| 🔴 `STRIPE_SECRET_KEY` | Živý Stripe secret key | dashboard.stripe.com → Developers → API keys |
| 🔴 `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | Stripe → Webhooks → po vytvoření endpointu |
| 🔴 `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Živý publishable key | Stripe → API keys |
| 🔴 `STRIPE_PRICE_ID_BASIC` | Live Price ID pro Základní balíček (249 Kč) | Stripe → Products → vytvořit produkt → zkopírovat `price_xxx` |
| 🔴 `STRIPE_PRICE_ID_PRO` | Live Price ID pro Profesionální balíček (399 Kč) | Stripe → Products → druhý produkt → `price_xxx` |
| 🔴 `STRIPE_PRICE_ID_PREMIUM` | Live Price ID pro Kompletní balíček (599 Kč) | Stripe → Products → třetí produkt → `price_xxx` |
| 🔴 `UPSTASH_REDIS_REST_URL` | Upstash Redis URL | console.upstash.com |
| 🔴 `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token | console.upstash.com |
| 🔴 `RESEND_API_KEY` | E-mail API klíč | resend.com → API Keys |
| 🔴 `NEXT_PUBLIC_BASE_URL` | Produkční doména | `https://smlouvahned.cz` |

> ⚠️ Nikdy nepoužívej `sk_test_` nebo `pk_test_` klíče v produkci.

---

## 2. Stripe — Živý mód

- [ ] V Stripe dashboardu přepnout z **Test mode** na **Live mode**
- [ ] Aktivovat live secret key + publishable key (bod 1 výše)
- [ ] Vytvořit produkční **Webhook endpoint**:
  - URL: `https://smlouvahned.cz/api/stripe/webhook`
  - Events: `checkout.session.completed`
  - Zkopírovat **Signing secret** → `STRIPE_WEBHOOK_SECRET`
- [ ] Ověřit, že Stripe má povoleny platební metody: Karta, Apple Pay, Google Pay
- [ ] Nastavit **Stripe branding** (logo, barvy) ve Stripe → Settings → Branding

---

## 3. Resend — E-mail

- [ ] Ověřit doménu `smlouvahned.cz` v Resend → Domains (přidat DNS záznamy)
- [ ] Potvrdit, že odesílatel `dokumenty@smlouvahned.cz` je povolen
- [ ] Otestovat odeslání testovacího e-mailu přes Resend dashboard

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
- [ ] Nastavit redirect: `www.smlouvahned.cz` → `smlouvahned.cz`

---

## 6. Smoke test po nasazení

Projdi tento scénář **se skutečnou kartou v živém módu**:

- [ ] Otevřít `https://smlouvahned.cz` — homepage se načte
- [ ] Vybrat smlouvu (např. Kupní smlouva), vyplnit formulář
- [ ] Zaplatit testovací částku — Stripe checkout se otevře a projde
- [ ] Success stránka zobrazí progress bar a pak tlačítko „Stáhnout PDF"
- [ ] PDF se stáhne a je správně vygenerováno
- [ ] Zkontrolovat e-mailovou schránku — potvrzovací e-mail dorazil s přímým odkazem ke stažení
- [ ] Zákaznická zóna (`/zakaznicka-zona`) — zadat e-mail z objednávky → objednávka se zobrazí
- [ ] Stripe dashboard → Payments — platba se eviduje

---

## 7. SEO a analytika (doporučeno před spuštěním)

- [ ] Přidat Google Analytics nebo Vercel Analytics (pro sledování konverzí)
- [ ] Nastavit Google Search Console a odeslat sitemap (`/sitemap.xml`)
- [ ] Ověřit Open Graph meta tagy (`/`) — sdílení na sociálních sítích
- [ ] Zkontrolovat `robots.txt` (`/public/robots.txt`)

---

## 8. Právní stránky

- [ ] Ověřit `/obchodni-podminky` — obsahuje ceny, TTL dokumentů (7/14/30 dní), reklamační postup
- [ ] Ověřit `/gdpr` — odpovídá skutečnému zpracování dat
- [ ] Doplnit kontaktní adresu a IČO provozovatele do obchodních podmínek

---

## 9. Monitoring

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
