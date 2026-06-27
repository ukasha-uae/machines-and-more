import { NextResponse } from 'next/server';
import { createAdminSessionToken, isWeakAdminKey } from '@/lib/security/admin-auth';

const ADMIN_COOKIE_NAME = '__session';
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;

function normalizeAdminKeyInput(value: string): string {
  const trimmed = value.trim();
  const prefix = 'ADMIN_ACCESS_KEY=';

  if (trimmed.startsWith(prefix)) {
    return trimmed.slice(prefix.length).trim();
  }

  return trimmed;
}

type AttemptRecord = {
  count: number;
  windowStart: number;
  lockedUntil: number;
};

const attempts = new Map<string, AttemptRecord>();

function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

function registerFailedAttempt(clientId: string, now: number): AttemptRecord {
  const current = attempts.get(clientId);
  if (!current || now - current.windowStart > WINDOW_MS) {
    const fresh = { count: 1, windowStart: now, lockedUntil: 0 };
    attempts.set(clientId, fresh);
    return fresh;
  }

  const updated: AttemptRecord = {
    ...current,
    count: current.count + 1,
    lockedUntil: current.lockedUntil,
  };

  if (updated.count >= MAX_ATTEMPTS) {
    updated.lockedUntil = now + LOCKOUT_MS;
  }

  attempts.set(clientId, updated);
  return updated;
}

export async function POST(request: Request) {
  const adminKey = process.env.ADMIN_ACCESS_KEY;
  const clientId = getClientIdentifier(request);
  const now = Date.now();

  const state = attempts.get(clientId);
  if (state?.lockedUntil && state.lockedUntil > now) {
    const retryAfter = Math.ceil((state.lockedUntil - now) / 1000);
    return NextResponse.json(
      { error: `Too many login attempts. Try again in ${retryAfter} seconds.` },
      { status: 429 }
    );
  }

  if (!adminKey) {
    return NextResponse.json({ error: 'Admin key is not configured on the server.' }, { status: 500 });
  }

  if (isWeakAdminKey(adminKey)) {
    return NextResponse.json(
      { error: 'ADMIN_ACCESS_KEY is too weak. Use at least 16 characters and avoid default values.' },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const key = typeof body?.key === 'string' ? normalizeAdminKeyInput(body.key) : '';

  if (key !== adminKey) {
    const updatedState = registerFailedAttempt(clientId, now);
    if (updatedState.lockedUntil > now) {
      const retryAfter = Math.ceil((updatedState.lockedUntil - now) / 1000);
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${retryAfter} seconds.` },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: 'Invalid admin key.' }, { status: 401 });
  }

  attempts.delete(clientId);

  const sessionToken = await createAdminSessionToken(adminKey);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return response;
}
