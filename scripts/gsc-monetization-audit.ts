import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  GSC_PAGE_SNAPSHOTS,
  classifyGscSnapshot,
  type GscPageSnapshot,
} from '../lib/gsc-monetization-candidates';

function splitCsvLine(line: string, delimiter: ',' | ';'): string[] {
  const cells: string[] = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === delimiter && !quoted) {
      cells.push(value.trim());
      value = '';
    } else {
      value += char;
    }
  }
  cells.push(value.trim());
  return cells;
}

function numberValue(value: string): number {
  const normalized = value.replace(/\s/g, '').replace('%', '').replace(',', '.');
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) throw new Error(`Neplatná číselná hodnota: ${value}`);
  return parsed;
}

function parseExport(csv: string, source: string): GscPageSnapshot[] {
  const lines = csv.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const delimiter = lines[0].includes(';') ? ';' : ',';
  const headers = splitCsvLine(lines[0], delimiter).map((item) => item.toLocaleLowerCase('cs-CZ'));
  const find = (...names: string[]) => headers.findIndex((header) => names.includes(header));
  const indexes = {
    page: find('page', 'stránka', 'stranka'),
    clicks: find('clicks', 'kliknutí', 'kliknuti'),
    impressions: find('impressions', 'zobrazení', 'zobrazeni'),
    ctr: find('ctr'),
    position: find('position', 'pozice'),
  };
  if (Object.values(indexes).some((index) => index < 0)) {
    throw new Error('CSV musí obsahovat page/stránka, clicks, impressions, CTR a position/pozice.');
  }
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line, delimiter);
    const rawPage = cells[indexes.page];
    const page = rawPage.startsWith('http') ? new URL(rawPage).pathname : rawPage;
    return {
      page,
      clicks: numberValue(cells[indexes.clicks]),
      impressions: numberValue(cells[indexes.impressions]),
      ctrPercent: numberValue(cells[indexes.ctr]),
      averagePosition: numberValue(cells[indexes.position]),
      source,
      observedAt: new Date().toISOString().slice(0, 10),
    };
  });
}

const inputPath = process.argv[2];
const snapshots = inputPath
  ? parseExport(readFileSync(resolve(inputPath), 'utf8'), `GSC CSV: ${inputPath}`)
  : [...GSC_PAGE_SNAPSHOTS];

console.table(snapshots.map((snapshot) => ({
  page: snapshot.page,
  impressions: snapshot.impressions,
  clicks: snapshot.clicks,
  ctrPercent: snapshot.ctrPercent,
  averagePosition: snapshot.averagePosition,
  classification: classifyGscSnapshot(snapshot),
  source: snapshot.source,
})));
