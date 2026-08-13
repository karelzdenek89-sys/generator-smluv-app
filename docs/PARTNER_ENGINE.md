# Partner Engine

## Účel a hranice

Partner Engine je sekundární post-purchase vrstva. Nesmí blokovat builder, checkout, Stripe, vytvoření dokumentu ani download. Bez `PARTNER_ENGINE_ENABLED=true` vrací vždy prázdný seznam.

Datový tok:

```text
raw builder data
→ server validation (checkout-validation.ts)
→ buildPartnerContext()
→ explicitní kategoriální PartnerContext
→ eligibility
→ candidates
→ selection/ranking
→ maximálně 3 veřejné offer DTO
→ Next Steps po ověřené platbě
```

Partner catalog je v `lib/partners/catalog.ts`. React komponenta neobsahuje partner-specific rozhodování.

## PartnerContext

Povolené klíče jsou jedině `PARTNER_CONTEXT_KEYS` v `lib/partners/types.ts`:

- typ smlouvy a tier,
- locale a země,
- strukturovaná role uživatele,
- obchodně významná kategorie,
- pásmo hodnoty bez přesné částky,
- consumer/business/unknown,
- paid/completed.

Role se u relevantních builderů vybírá nepovinnou strukturovanou volbou. Server validuje role povolené pro konkrétní smlouvu. Neznámá nebo nepovolená hodnota skončí jako `unknown`.

## Eligibility a selection

`getEligiblePartnerCandidates()` řeší pouze eligibility a konfiguraci. `selectPartnerOffers()` následně řadí podle priority a manuálního quality score, vybírá nejvýše jednu nabídku v kategorii a maximálně tři nabídky celkem. Ranking není založen pouze na provizi.

Budoucí experiment lze přidat přes `experimentId` a `variant`; tyto hodnoty nesmí obsahovat PII.

## URL security

- pouze absolutní HTTPS,
- host musí odpovídat allowlistu definice (přesná doména nebo její subdoména),
- žádné credentials ani fragment,
- každý query parametr musí být výslovně povolený katalogem,
- UTM se nastavuje serverovým katalogem,
- při chybě konfigurace se nabídka nezobrazí.

Serverový `/go/:offer` redirect zatím není přidán. Bez aktivního postback/callback partnera by nepřinesl lepší autorizaci než současný serverový katalog a zvětšil by veřejnou attack surface. First-party click má anonymní `partner_click_id`; redirect lze doplnit, až bude znám konkrétní conversion-ID protokol.

## Integrace

`ElectronicSignatureProvider` a `VehicleHistoryProvider` v `lib/partners/providers.ts` oddělují budoucí API integraci od core produktu. Seznam aktivních API adapterů je prázdný. Chybějící credentials nesmí vyvolat síťové volání ani zobrazit nefunkční službu.

Lead rozhraní je v `lib/partners/lead-consent.ts`. Každý adapter musí mít vlastní allowlist, credential check, timeout, idempotency key a mapper. Veřejný lead endpoint úmyslně neexistuje, dokud není schválen konkrétní partner, text souhlasu a API dokumentace.

## Analytics

Funnel:

- `partner_offer_eligible`
- `partner_offer_viewed`
- `partner_offer_clicked`
- `partner_lead_started`
- `partner_lead_consent_granted`
- `partner_lead_submitted`
- `partner_lead_succeeded`
- `partner_lead_failed`
- `partner_conversion_recorded`

Payload obsahuje stabilní partner/offer ID, typ dokumentu, locale, roli, placement, anonymní transaction/click ID a volitelná experiment metadata. Revenue se zapisuje pouze z ověřeného serverového callbacku; bez něj zůstává v reportingu `N/A`.

## Dokončený free dokument

PartnerContext obsahuje také `monetizationMode`. Eligibility vyžaduje dokončený
dokument, nikoli nutně platbu. U placeného toku server vrátí nabídky až po Stripe
`paid` a tokenu; u free experimentu až po ověření samostatného free tokenu. Partner
Engine proto nikdy není způsob, jak obejít autorizaci dokumentu.

## Kill switch

1. `PARTNER_ENGINE_ENABLED=false` vypne celou vrstvu.
2. `<OFFER_PREFIX>_ENABLED=false` vypne konkrétní offer.
3. Neplatná/chybějící URL offer automaticky skryje.
4. Vypnutí nevyžaduje změnu checkoutu ani dokumentového flow.
