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

export async function createAdminSessionToken(adminKey: string): Promise<string> {
  const payload = new TextEncoder().encode(`mm-admin-session:${adminKey}`);
  const digest = await crypto.subtle.digest('SHA-256', payload);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
