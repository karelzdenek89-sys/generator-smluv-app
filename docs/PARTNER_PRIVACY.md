# Partner privacy a security

## Minimalizace dat

Partner Engine nikdy nedostává raw payload. Klasifikátor čte serverem validovaný interní model a vytvoří nový objekt po jednotlivých allowlistovaných polích.

```text
raw údaje smlouvy
→ serverová validace
→ interní odvození role/kategorie/pásma
→ PartnerContext bez PII a bez volného textu
→ eligibility
→ veřejné offer DTO
→ partner až po kliknutí uživatele
```

Zakázané v PartnerContext, analytics i automatickém URL přenosu:

- jméno, e-mail, telefon a přesná adresa,
- datum narození, rodné číslo a číslo dokladu,
- bankovní údaje a podpis,
- VIN,
- přesná částka,
- text smlouvy a volná pole,
- údaje druhé smluvní strany.

`partner_transaction_id` a `partner_click_id` jsou náhodné pseudonymní identifikátory bez vloženého významu. Neobsahují session token ani osobní údaje.

## Lead consent

Partner lead vyžaduje záznam:

- konkrétní partner,
- konkrétní účel,
- verze textu souhlasu,
- přesný seznam sdílených polí,
- timestamp.

Generický text „sdílení s našimi partnery“ není přípustný. UI musí uvést příjemce, důvod, pole a další postup. Checkout consent není partner lead consent.

## Threat model

| Riziko | Ochrana |
|---|---|
| PII/analytics leakage | explicitní DTO, Zod allowlist API, automatické testy zakázaných klíčů/hodnot |
| open redirect / look-alike | žádný klientský destination parametr, HTTPS a host allowlist |
| `javascript:` / `data:` / CRLF | URL parser, povolen pouze protokol `https:` a zákaz CR/LF |
| client role/value manipulation | serverová taxonomie podle typu dokumentu; invalidní role je odmítnuta/unknown; pásmo se odvozuje serverem |
| XSS v partner copy | copy je trusted source v repozitáři, ne externí HTML; React ji escapuje |
| forged partner ID | ID vzniká v serverovém katalogu; klient neposílá ID do eligibility |
| lead replay | povinný idempotency key a budoucí serverové persistence/lock před aktivací adapteru |
| IDOR | offer DTO se vrací až po ověření Stripe platby a download tokenu |
| CSRF | stavové API používá first-party JSON/origin guard; aktivní lead endpoint neexistuje |
| SSRF | destination je pouze z catalog configu a allowlistované domény; žádná libovolná URL z requestu |
| secret exposure | partner config je server-only, bez prefixu `NEXT_PUBLIC_` |
| webhook spoofing | budoucí partner callback musí ověřovat podpis a idempotenci před zápisem conversion/revenue |
| partner outage | partner failure se nesmí propagovat do checkoutu, fulfilmentu ani downloadu |

Logy budoucích adapterů smějí obsahovat partner ID, offer ID, anonymní correlation ID, status a typ chyby. Nesmějí obsahovat request payload, kontakty, URL s citlivými parametry ani provider response body bez sanitizace.
