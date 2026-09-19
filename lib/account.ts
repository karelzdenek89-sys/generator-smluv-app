import {
  createHash,
  randomBytes,
  randomUUID,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from 'node:crypto';
import { redis } from '@/lib/redis';

export const ACCOUNT_TERMS_VERSION = '2026-09-18';
export const ACCOUNT_PRIVACY_VERSION = '2026-09-18';
export const ACCOUNT_SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;
const VERIFY_TTL_SECONDS = 60 * 60 * 24;
const RESET_TTL_SECONDS = 60 * 60;
const RESERVATION_TTL_SECONDS = 300;
const MAX_ACTIVE_SESSIONS = 20;

const USERNAME_RE = /^[a-zA-Z0-9._-]{3,32}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 10;
const PASSWORD_MAX_LENGTH = 128;
const SCRYPT_N = 2 ** 15;
const SCRYPT_R = 8;
const SCRYPT_P = 3;
const SCRYPT_KEYLEN = 64;
const SCRYPT_MAXMEM = 256 * 1024 * 1024;

export type AccountRecord = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  passwordHash: string;
  emailVerifiedAt: string | null;
  termsAcceptedAt: string;
  termsVersion: string;
  privacyVersion: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

export type PublicAccount = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

export type AccountSessionRecord = {
  userId: string;
  csrfHash: string;
  createdAt: string;
  expiresAt: string;
};

export type ResolvedAccountSession = {
  tokenHash: string;
  session: AccountSessionRecord;
  user: AccountRecord;
};

function userKey(id: string): string {
  return `account:user:${id}`;
}
function usernameKey(username: string): string {
  return `account:username:${normalizeUsername(username)}`;
}
function emailKey(email: string): string {
  return `account:email:${hashEmail(email)}`;
}
function sessionKeyFromHash(hash: string): string {
  return `account:session:${hash}`;
}
function userSessionsKey(userId: string): string {
  return `account:sessions:${userId}`;
}
function verifyKey(hash: string): string {
  return `account:verify:${hash}`;
}
function currentVerifyKey(userId: string): string {
  return `account:verify-current:${userId}`;
}
function resetKey(hash: string): string {
  return `account:reset:${hash}`;
}
function currentResetKey(userId: string): string {
  return `account:reset-current:${userId}`;
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function hashEmail(value: string): string {
  return createHash('sha256').update(normalizeEmail(value)).digest('hex');
}

function hashToken(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function secureHashMatches(value: string, expectedHash: string): boolean {
  const actual = Buffer.from(hashToken(value), 'hex');
  const expected = Buffer.from(expectedHash, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function validateUsername(value: string): string | null {
  const username = value.trim();
  if (!USERNAME_RE.test(username)) {
    return 'Uživatelské jméno musí mít 3–32 znaků a může obsahovat písmena, čísla, tečku, pomlčku a podtržítko.';
  }
  return null;
}

function validateEmail(value: string): string | null {
  const email = normalizeEmail(value);
  if (!EMAIL_RE.test(email) || email.length > 200) return 'Zadejte platný e-mail.';
  return null;
}

export function validatePassword(value: string): string | null {
  if (value.length < PASSWORD_MIN_LENGTH) return `Heslo musí mít alespoň ${PASSWORD_MIN_LENGTH} znaků.`;
  if (value.length > PASSWORD_MAX_LENGTH) return `Heslo může mít nejvýše ${PASSWORD_MAX_LENGTH} znaků.`;
  return null;
}

function deriveScrypt(password: string, salt: string, n = SCRYPT_N, r = SCRYPT_R, p = SCRYPT_P): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    nodeScrypt(password, salt, SCRYPT_KEYLEN, { N: n, r, p, maxmem: SCRYPT_MAXMEM }, (error, key) => {
      if (error) reject(error);
      else resolve(key as Buffer);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const validation = validatePassword(password);
  if (validation) throw new Error(validation);
  const salt = randomBytes(16).toString('base64url');
  const derived = await deriveScrypt(password, salt);
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt}$${derived.toString('base64url')}`;
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const parts = encoded.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p) || n < 2 ** 14 || r < 8 || p < 1) return false;
  const derived = await deriveScrypt(password, parts[4], n, r, p);
  const expected = Buffer.from(parts[5], 'base64url');
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

export async function burnPasswordCheck(password: string): Promise<void> {
  await deriveScrypt(password.slice(0, PASSWORD_MAX_LENGTH), 'SmlouvaHned-account-dummy-salt-v1');
}

export function toPublicAccount(user: AccountRecord): PublicAccount {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    emailVerified: Boolean(user.emailVerifiedAt),
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };
}

export type CreateAccountInput = {
  username: string;
  email: string;
  displayName?: string;
  password: string;
};

export async function createAccount(input: CreateAccountInput): Promise<
  | { ok: true; user: AccountRecord }
  | { ok: false; field: 'username' | 'email' | 'password'; message: string }
> {
  const usernameError = validateUsername(input.username);
  if (usernameError) return { ok: false, field: 'username', message: usernameError };
  const emailError = validateEmail(input.email);
  if (emailError) return { ok: false, field: 'email', message: emailError };
  const passwordError = validatePassword(input.password);
  if (passwordError) return { ok: false, field: 'password', message: passwordError };

  const username = input.username.trim();
  const normalizedUsername = normalizeUsername(username);
  const email = normalizeEmail(input.email);
  const id = randomUUID();

  const usernameReserved = await redis.set(usernameKey(normalizedUsername), id, { ex: RESERVATION_TTL_SECONDS, nx: true });
  if (!usernameReserved) return { ok: false, field: 'username', message: 'Toto uživatelské jméno už je použité.' };

  const emailReserved = await redis.set(emailKey(email), id, { ex: RESERVATION_TTL_SECONDS, nx: true });
  if (!emailReserved) {
    await redis.del(usernameKey(normalizedUsername));
    return { ok: false, field: 'email', message: 'K tomuto e-mailu už účet existuje. Přihlaste se nebo obnovte heslo.' };
  }

  try {
    const now = new Date().toISOString();
    const user: AccountRecord = {
      id,
      username,
      email,
      displayName: (input.displayName ?? '').trim().slice(0, 80),
      passwordHash: await hashPassword(input.password),
      emailVerifiedAt: null,
      termsAcceptedAt: now,
      termsVersion: ACCOUNT_TERMS_VERSION,
      privacyVersion: ACCOUNT_PRIVACY_VERSION,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
    };
    await redis.set(userKey(id), user);
    await redis.set(usernameKey(normalizedUsername), id);
    await redis.set(emailKey(email), id);
    return { ok: true, user };
  } catch (error) {
    await Promise.all([redis.del(usernameKey(normalizedUsername)), redis.del(emailKey(email)), redis.del(userKey(id))]);
    throw error;
  }
}

export async function getAccountById(id: string): Promise<AccountRecord | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  return await redis.get<AccountRecord>(userKey(id));
}

export async function findAccount(login: string): Promise<AccountRecord | null> {
  const value = login.trim();
  if (!value || value.length > 200) return null;
  const id = value.includes('@')
    ? await redis.get<string>(emailKey(value))
    : await redis.get<string>(usernameKey(value));
  return id ? getAccountById(id) : null;
}

async function saveAccount(user: AccountRecord): Promise<AccountRecord> {
  const next = { ...user, updatedAt: new Date().toISOString() };
  await redis.set(userKey(next.id), next);
  return next;
}

export async function markLogin(user: AccountRecord): Promise<AccountRecord> {
  return saveAccount({ ...user, lastLoginAt: new Date().toISOString() });
}

export async function updateAccountProfile(
  user: AccountRecord,
  input: { username: string; displayName: string },
): Promise<{ ok: true; user: AccountRecord } | { ok: false; field: 'username' | 'displayName'; message: string }> {
  const usernameError = validateUsername(input.username);
  if (usernameError) return { ok: false, field: 'username', message: usernameError };
  const displayName = input.displayName.trim();
  if (displayName.length > 80) return { ok: false, field: 'displayName', message: 'Zobrazované jméno může mít nejvýše 80 znaků.' };

  const nextUsername = input.username.trim();
  const oldNormalized = normalizeUsername(user.username);
  const newNormalized = normalizeUsername(nextUsername);
  if (newNormalized === oldNormalized) {
    return { ok: true, user: await saveAccount({ ...user, username: nextUsername, displayName }) };
  }

  const reserved = await redis.set(usernameKey(newNormalized), user.id, { ex: RESERVATION_TTL_SECONDS, nx: true });
  if (!reserved) return { ok: false, field: 'username', message: 'Toto uživatelské jméno už je použité.' };

  try {
    const next = await saveAccount({ ...user, username: nextUsername, displayName });
    await redis.set(usernameKey(newNormalized), user.id);
    await redis.del(usernameKey(oldNormalized));
    return { ok: true, user: next };
  } catch (error) {
    await redis.del(usernameKey(newNormalized));
    throw error;
  }
}

export async function setAccountPassword(user: AccountRecord, password: string): Promise<AccountRecord> {
  return saveAccount({ ...user, passwordHash: await hashPassword(password) });
}

export async function issueVerificationToken(user: AccountRecord): Promise<string> {
  const previous = await redis.get<string>(currentVerifyKey(user.id));
  if (previous) await redis.del(verifyKey(previous));
  const token = randomBytes(32).toString('base64url');
  const hashed = hashToken(token);
  await Promise.all([
    redis.set(verifyKey(hashed), { userId: user.id }, { ex: VERIFY_TTL_SECONDS }),
    redis.set(currentVerifyKey(user.id), hashed, { ex: VERIFY_TTL_SECONDS }),
  ]);
  return token;
}

export async function verifyAccountEmail(token: string): Promise<AccountRecord | null> {
  if (token.length < 32 || token.length > 200) return null;
  const hashed = hashToken(token);
  const record = await redis.getdel<{ userId: string }>(verifyKey(hashed));
  if (!record) return null;
  const user = await getAccountById(record.userId);
  await Promise.all([redis.del(verifyKey(hashed)), redis.del(currentVerifyKey(record.userId))]);
  if (!user) return null;
  if (user.emailVerifiedAt) return user;
  return saveAccount({ ...user, emailVerifiedAt: new Date().toISOString() });
}

export async function issuePasswordResetToken(user: AccountRecord): Promise<string> {
  const previous = await redis.get<string>(currentResetKey(user.id));
  if (previous) await redis.del(resetKey(previous));
  const token = randomBytes(32).toString('base64url');
  const hashed = hashToken(token);
  await Promise.all([
    redis.set(resetKey(hashed), { userId: user.id }, { ex: RESET_TTL_SECONDS }),
    redis.set(currentResetKey(user.id), hashed, { ex: RESET_TTL_SECONDS }),
  ]);
  return token;
}

export async function resetPasswordWithToken(token: string, password: string): Promise<AccountRecord | null> {
  const validation = validatePassword(password);
  if (validation || token.length < 32 || token.length > 200) return null;
  const hashed = hashToken(token);
  const record = await redis.getdel<{ userId: string }>(resetKey(hashed));
  if (!record) return null;
  const user = await getAccountById(record.userId);
  await Promise.all([redis.del(resetKey(hashed)), redis.del(currentResetKey(record.userId))]);
  if (!user) return null;

  // Přístup k resetovacímu odkazu prokazuje kontrolu nad e-mailem účtu.
  // Případný starší ověřovací odkaz proto zároveň zneplatníme.
  const verificationHash = await redis.get<string>(currentVerifyKey(user.id));
  if (verificationHash) {
    await Promise.all([redis.del(verifyKey(verificationHash)), redis.del(currentVerifyKey(user.id))]);
  }
  const next = await setAccountPassword({
    ...user,
    emailVerifiedAt: user.emailVerifiedAt ?? new Date().toISOString(),
  }, password);
  await revokeAllAccountSessions(user.id);
  return next;
}

export function accountSessionCookieName(): string {
  return process.env.NODE_ENV === 'production' ? '__Host-sh_session' : 'sh_session';
}

export function accountCsrfCookieName(): string {
  return process.env.NODE_ENV === 'production' ? '__Host-sh_csrf' : 'sh_csrf';
}

export function accountCookieSecure(): boolean {
  return process.env.NODE_ENV === 'production';
}

export async function createAccountSession(user: AccountRecord): Promise<{ token: string; csrf: string; user: AccountRecord }> {
  const existingSessions = (await redis.smembers(userSessionsKey(user.id))) as string[];
  if (existingSessions.length >= MAX_ACTIVE_SESSIONS) {
    const remove = existingSessions.slice(0, existingSessions.length - MAX_ACTIVE_SESSIONS + 1);
    if (remove.length) {
      await redis.del(...remove.map((hash) => sessionKeyFromHash(hash)));
      await redis.srem(userSessionsKey(user.id), ...remove);
    }
  }

  const token = randomBytes(32).toString('base64url');
  const csrf = randomBytes(32).toString('base64url');
  const tokenHash = hashToken(token);
  const now = Date.now();
  const session: AccountSessionRecord = {
    userId: user.id,
    csrfHash: hashToken(csrf),
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + ACCOUNT_SESSION_TTL_SECONDS * 1000).toISOString(),
  };
  await Promise.all([
    redis.set(sessionKeyFromHash(tokenHash), session, { ex: ACCOUNT_SESSION_TTL_SECONDS }),
    redis.sadd(userSessionsKey(user.id), tokenHash),
  ]);
  await redis.expire(userSessionsKey(user.id), ACCOUNT_SESSION_TTL_SECONDS);
  return { token, csrf, user };
}

export async function resolveAccountSession(token: string | null | undefined): Promise<ResolvedAccountSession | null> {
  if (!token || token.length < 32 || token.length > 200) return null;
  const tokenHash = hashToken(token);
  const session = await redis.get<AccountSessionRecord>(sessionKeyFromHash(tokenHash));
  if (!session) return null;
  const user = await getAccountById(session.userId);
  if (!user) {
    await redis.del(sessionKeyFromHash(tokenHash));
    return null;
  }
  return { tokenHash, session, user };
}

export function sessionCsrfMatches(session: AccountSessionRecord, csrf: string | null | undefined): boolean {
  return Boolean(csrf && csrf.length <= 200 && secureHashMatches(csrf, session.csrfHash));
}

export async function refreshSessionCsrf(tokenHash: string, session: AccountSessionRecord): Promise<string | null> {
  const ttl = await redis.ttl(sessionKeyFromHash(tokenHash));
  if (ttl <= 0) return null;
  const csrf = randomBytes(32).toString('base64url');
  await redis.set(sessionKeyFromHash(tokenHash), { ...session, csrfHash: hashToken(csrf) }, { ex: ttl });
  return csrf;
}

export async function revokeAccountSession(token: string | null | undefined): Promise<void> {
  if (!token) return;
  const tokenHash = hashToken(token);
  const session = await redis.get<AccountSessionRecord>(sessionKeyFromHash(tokenHash));
  await redis.del(sessionKeyFromHash(tokenHash));
  if (session) await redis.srem(userSessionsKey(session.userId), tokenHash);
}

export async function revokeAllAccountSessions(userId: string): Promise<void> {
  const hashes = (await redis.smembers(userSessionsKey(userId))) as string[];
  if (hashes.length) await redis.del(...hashes.map((hash) => sessionKeyFromHash(hash)));
  await redis.del(userSessionsKey(userId));
}

export async function deleteAccount(user: AccountRecord): Promise<void> {
  const [verifyHash, resetHash] = await Promise.all([
    redis.get<string>(currentVerifyKey(user.id)),
    redis.get<string>(currentResetKey(user.id)),
  ]);
  await revokeAllAccountSessions(user.id);
  await Promise.all([
    redis.del(userKey(user.id)),
    redis.del(usernameKey(user.username)),
    redis.del(emailKey(user.email)),
    redis.del(currentVerifyKey(user.id)),
    redis.del(currentResetKey(user.id)),
    ...(verifyHash ? [redis.del(verifyKey(verifyHash))] : []),
    ...(resetHash ? [redis.del(resetKey(resetHash))] : []),
  ]);
}

export async function getActivePaidOrderTtl(email: string): Promise<number> {
  const normalized = normalizeEmail(email);
  const key = `orders:email:${normalized}`;
  const ttl = await redis.ttl(key);
  if (ttl <= 0) return 0;
  const sessions = ((await redis.smembers(key)) as string[]).slice(0, 50);
  for (const sessionId of sessions) {
    const draftId = await redis.get<string>(`session:draft:${sessionId}`);
    if (!draftId) continue;
    const draft = await redis.get<{ paid?: boolean }>(`contract:draft:${draftId}`);
    if (draft?.paid) return ttl;
  }
  return 0;
}
