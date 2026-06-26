import { NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'mm_admin_session';

export async function POST(request: Request) {
  const adminKey = process.env.ADMIN_ACCESS_KEY;

  if (!adminKey) {
    return NextResponse.json({ error: 'Admin key is not configured on the server.' }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const key = typeof body?.key === 'string' ? body.key : '';

  if (key !== adminKey) {
    return NextResponse.json({ error: 'Invalid admin key.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, adminKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return response;
}
