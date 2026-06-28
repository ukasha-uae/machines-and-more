import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE_NAME,
  isWeakAdminKey,
  verifyAdminSessionToken,
} from './admin-auth';

export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const adminKey = process.env.ADMIN_ACCESS_KEY;

  if (!adminKey) {
    return NextResponse.json({ error: 'Admin access is not configured.' }, { status: 500 });
  }

  if (isWeakAdminKey(adminKey)) {
    return NextResponse.json(
      { error: 'ADMIN_ACCESS_KEY is too weak. Use at least 16 characters and avoid default values.' },
      { status: 500 }
    );
  }

  const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const session = await verifyAdminSessionToken(sessionToken);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
