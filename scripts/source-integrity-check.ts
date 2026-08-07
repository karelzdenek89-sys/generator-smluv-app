import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const SOURCE_EXTENSION = /\.(?:ts|tsx|js|jsx|css|md|txt|json|ya?ml)$/i;
const INTENTIONAL_MOJIBAKE_FIXTURES = new Set([
  'scripts/audit-output-quality.ts',
  'scripts/fix-czech-encoding.ps1',
  'scripts/normalize-czech-mojibake.ps1',
  'scripts/source-integrity-check.ts',
]);
const suspiciousText = /Ă|Ĺ|Ä(?:Ť|›|Ś|š|Ź|Ž)|â(?:€”|€¦|€ž|€ś|€ť|€™)|Â(?:˛|°|·)/u;
const replacementQuestionDamage = /m\?sto|v\?\?i|Tla\?\?|mus\? m\?t|\?{4,}/u;

const files = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  { encoding: 'utf8' },
)
  .split('\0')
  .filter(Boolean)
  .filter((file) => SOURCE_EXTENSION.test(file) && !INTENTIONAL_MOJIBAKE_FIXTURES.has(file.replaceAll('\\', '/')));

const findings: string[] = [];
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    if (suspiciousText.test(line) || replacementQuestionDamage.test(line)) {
      findings.push(`${file}:${index + 1}`);
    }
  });
}

if (findings.length > 0) {
  throw new Error(`Podezřelé poškození UTF-8 textu:\n${findings.join('\n')}`);
}

console.log(`Source text integrity passed (${files.length} repository text files).`);
