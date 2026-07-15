import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const trackedFiles = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  { encoding: 'utf8' },
)
  .split('\0')
  .filter(Boolean)
  .filter((file) => !file.endsWith('.pdf') && !file.endsWith('.docx') && !file.endsWith('package-lock.json'));

const patterns = [
  { name: 'Stripe secret key', pattern: /sk_(?:live|test)_[A-Za-z0-9]{16,}/g },
  { name: 'Stripe webhook secret', pattern: /whsec_[A-Za-z0-9]{16,}/g },
  { name: 'Resend API key', pattern: /re_[A-Za-z0-9]{16,}/g },
  { name: 'Private key', pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
];

const findings: string[] = [];
for (const file of trackedFiles) {
  const content = readFileSync(file, 'utf8');
  for (const { name, pattern } of patterns) {
    pattern.lastIndex = 0;
    if (pattern.test(content)) findings.push(`${file}: ${name}`);
  }
}

if (findings.length > 0) {
  throw new Error(`Potential secrets found:\n${findings.join('\n')}`);
}

console.log(`Secret scan passed (${trackedFiles.length} repository text files).`);
