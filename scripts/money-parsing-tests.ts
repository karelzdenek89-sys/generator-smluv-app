/**
 * Guards the amount parsing that gates checkout.
 *
 * Builders only require the amount field to be non-empty, so every notation a
 * user plausibly types has to be accepted here — otherwise the request is
 * rejected after they press pay, which is invisible to them and to us.
 */
import assert from 'node:assert/strict';
import { parseMoney } from '@/lib/money';

const ACCEPTED: [string | number, number][] = [
  ['15000', 15000],
  ['15 000', 15000],
  ['15 000 Kč', 15000],
  ['15000 Kc', 15000],
  ['15000CZK', 15000],
  ['15000,-', 15000],
  ['15 000,-', 15000],
  ['15.000', 15000],
  ['15,000', 15000],
  ['1.234.567', 1234567],
  ['1 234 567 Kč', 1234567],
  ['15,50', 15.5],
  ['15.50', 15.5],
  ['1.234,50', 1234.5],
  ['1 234,50', 1234.5],
  ['15,5', 15.5],
  ['  15000  ', 15000],
  [15000, 15000],
  [15.5, 15.5],
];

const REJECTED: unknown[] = [
  '',
  '   ',
  'abc',
  'zdarma',
  'dohodou',
  '-500',
  '0',
  '0,00',
  'Kč',
  null,
  undefined,
  {},
  [],
  Number.NaN,
  Number.POSITIVE_INFINITY,
  -1,
];

let failures = 0;

for (const [input, expected] of ACCEPTED) {
  const actual = parseMoney(input);
  try {
    assert.equal(actual, expected, `parseMoney(${JSON.stringify(input)}) => ${actual}, expected ${expected}`);
  } catch (error) {
    failures += 1;
    console.error(`  FAIL  ${(error as Error).message}`);
  }
}

for (const input of REJECTED) {
  const actual = parseMoney(input);
  try {
    assert.equal(actual, null, `parseMoney(${JSON.stringify(input)}) => ${actual}, expected null`);
  } catch (error) {
    failures += 1;
    console.error(`  FAIL  ${(error as Error).message}`);
  }
}

if (failures > 0) {
  console.error(`\nMoney parsing tests failed: ${failures} case(s).`);
  process.exit(1);
}

console.log(`Money parsing tests passed (${ACCEPTED.length} accepted, ${REJECTED.length} rejected notations).`);
