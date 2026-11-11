/**
 * Identifikace prodávajícího pro místa, kde ji zákazník musí vidět přímo
 * u objednávky (platební okno, patička), nejen v obchodních podmínkách.
 * Změna zde se musí promítnout i do OP, GDPR a lib/schemas.ts.
 */
export const SELLER = {
  name: 'Karel Zdeněk',
  ico: '23660295',
  address: 'Plzeňská 189, 345 61 Staňkov',
  email: 'info@smlouvahned.cz',
} as const;

/** „Karel Zdeněk, IČO 23660295, Plzeňská 189, 345 61 Staňkov“ */
export const SELLER_IDENTIFICATION = `${SELLER.name}, IČO ${SELLER.ico}, ${SELLER.address}`;
