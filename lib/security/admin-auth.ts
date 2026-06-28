const WEAK_ADMIN_KEYS = new Set([
  'admin-key',
  'change-this-admin-key',
  'admin',
  'password',
  '123456',
  'letmein',
]);

export function isWeakAdminKey(key: string): boolean {
  const normalized = key.trim().toLowerCase();
  return key.length < 16 || WEAK_ADMIN_KEYS.has(normalized);
}

export const ADMIN_SESSION_COOKIE_NAME = '__session';
export const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 8;

export type AdminSessionPayload = {
  sub: string;
  email: string | null;
  role: 'google' | 'legacy';
  iat: number;
  exp: number;
};

function getAdminSessionSecret(): string {
  const adminKey = process.env.ADMIN_ACCESS_KEY;

  if (!adminKey) {
    throw new Error('ADMIN_ACCESS_KEY is not configured.');
  }

  if (isWeakAdminKey(adminKey)) {
    throw new Error('ADMIN_ACCESS_KEY is too weak. Use at least 16 characters and avoid default values.');
  }

  return adminKey;
}

function toBase64Url(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');

  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

async function importHmacKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export function getAuthorizedAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAuthorizedAdminEmail(email: string | null | undefined): boolean {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return false;
  }

  return getAuthorizedAdminEmails().includes(normalizedEmail);
}

async function signAdminSession(payload: AdminSessionPayload): Promise<string> {
  const payloadPart = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await importHmacKey(getAdminSessionSecret());
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadPart));

  return `${payloadPart}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function createGoogleAdminSession(uid: string, email: string): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!isAuthorizedAdminEmail(normalizedEmail)) {
    throw new Error('This Google account is not authorized for admin access.');
  }

  const now = Math.floor(Date.now() / 1000);
  return signAdminSession({
    sub: uid,
    email: normalizedEmail,
    role: 'google',
    iat: now,
    exp: now + ADMIN_SESSION_DURATION_SECONDS,
  });
}

export async function createLegacyAdminSession(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return signAdminSession({
    sub: 'legacy-admin',
    email: null,
    role: 'legacy',
    iat: now,
    exp: now + ADMIN_SESSION_DURATION_SECONDS,
  });
}

export async function verifyAdminSessionToken(token: string | null | undefined): Promise<AdminSessionPayload | null> {
  if (!token) {
    return null;
  }

  const [payloadPart, signaturePart] = token.split('.');
  if (!payloadPart || !signaturePart) {
    return null;
  }

  const key = await importHmacKey(getAdminSessionSecret());
  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    toArrayBuffer(fromBase64Url(signaturePart)),
    new TextEncoder().encode(payloadPart)
  );

  if (!isValid) {
    return null;
  }

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadPart))) as AdminSessionPayload;
    const now = Math.floor(Date.now() / 1000);

    if (!payload.exp || payload.exp <= now) {
      return null;
    }

    if (payload.role === 'google' && !isAuthorizedAdminEmail(payload.email)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
