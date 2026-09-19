# Zákaznický účet

Dobrovolná účetní vrstva nad stávajícími capability odkazy.

## Principy

- Nákup ani stažení dokumentu nevyžaduje účet.
- Přihlášení funguje uživatelským jménem nebo e-mailem + heslem.
- E-mail musí být ověřený před propojením s existujícími dokumenty a případy.
- Hesla se ukládají pouze jako salted scrypt hash (N=2^15, r=8, p=3).
- Session token má 256 bitů entropie, na serveru je uložen pouze SHA-256 hash.
- Session cookie je HttpOnly, Secure v produkci a SameSite=Lax; stav měnící požadavky navíc vyžadují samostatný CSRF token.
- Relace trvá nejvýše 14 dní. Změna/reset hesla zneplatní ostatní relace.
- Ověřovací token platí 24 hodin, reset hesla 60 minut; oba jsou jednorázové a na serveru pouze hashované.
- Rate limit je fail-closed stejně jako u ostatních bezpečnostních endpointů.

## Redis namespace

- `account:user:{uuid}` — profil a hash hesla
- `account:username:{normalized}` — index uživatelského jména
- `account:email:{sha256(email)}` — index e-mailu
- `account:session:{sha256(token)}` — serverová relace
- `account:sessions:{uuid}` — reverzní index relací
- `account:verify:{sha256(token)}` + `account:verify-current:{uuid}` — ověření e-mailu
- `account:reset:{sha256(token)}` + `account:reset-current:{uuid}` — reset hesla

## Propojení

Účet nevytváří kopii objednávek ani případů. Po ověření e-mailu pouze vydá krátkodobý bezpečný přístup k existujícím vrstvám `Moje dokumenty` a `Moje případy`. Původní e-mailové odkazy zůstávají jako fallback.

Smazání účtu smaže profil, přihlašovací indexy, bezpečnostní tokeny a relace. Samostatné objednávky/případy mají vlastní retenční režim a nemažou se implicitně s účtem.
