import assert from 'node:assert/strict';
import { CURRENT_YEAR, LAST_CONTENT_REVISION_ISO } from '@/lib/current-year';

const actualYear = Number(
  new Intl.DateTimeFormat('en', { timeZone: 'Europe/Prague', year: 'numeric' }).format(new Date()),
);

assert.equal(
  CURRENT_YEAR,
  actualYear,
  `CURRENT_YEAR=${CURRENT_YEAR}, ale v Praze je rok ${actualYear}. Před nasazením proveďte právní a SEO rollover všech textů.`,
);
assert.match(LAST_CONTENT_REVISION_ISO, new RegExp(`^${CURRENT_YEAR}-\\d{2}-\\d{2}$`));

console.log(`Year rollover check passed for ${CURRENT_YEAR} (content revision ${LAST_CONTENT_REVISION_ISO}).`);
