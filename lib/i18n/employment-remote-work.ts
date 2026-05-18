/** Canonical stored values for employment remote-work select. */
export const REMOTE_WORK_KEYS = {
  full: 'full_remote',
  hybrid: 'hybrid_remote',
  none: 'remote_none',
} as const;

const CS_BY_KEY: Record<string, string> = {
  [REMOTE_WORK_KEYS.full]: 'plný home office (100 %)',
  [REMOTE_WORK_KEYS.hybrid]: 'hybridní (dle dohody)',
  [REMOTE_WORK_KEYS.none]: 'není povoleno',
  'plný remote (100 %)': 'plný home office (100 %)',
  'hybridní (dle dohody)': 'hybridní (dle dohody)',
  'není povoleno': 'není povoleno',
};

const EN_BY_KEY: Record<string, string> = {
  [REMOTE_WORK_KEYS.full]: 'full remote (100 %)',
  [REMOTE_WORK_KEYS.hybrid]: 'hybrid (by agreement)',
  [REMOTE_WORK_KEYS.none]: 'not permitted',
  'plný remote (100 %)': 'full remote (100 %)',
  'hybridní (dle dohody)': 'hybrid (by agreement)',
  'není povoleno': 'not permitted',
};

const UA_BY_KEY: Record<string, string> = {
  [REMOTE_WORK_KEYS.full]: 'повна віддалена робота (100 %)',
  [REMOTE_WORK_KEYS.hybrid]: 'гібрид (за домовленістю)',
  [REMOTE_WORK_KEYS.none]: 'не дозволено',
  'plný remote (100 %)': 'повна віддалена робота (100 %)',
  'hybridní (dle dohody)': 'гібрид (за домовленістю)',
  'není povoleno': 'не дозволено',
};

export function formatRemoteWorkForContract(
  value: string,
  target: 'cs' | 'en' | 'ua',
): string {
  if (!value) return '';
  const map = target === 'en' ? EN_BY_KEY : target === 'ua' ? UA_BY_KEY : CS_BY_KEY;
  return map[value] ?? value;
}
