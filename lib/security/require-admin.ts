import { NextRequest, NextResponse } from 'next/server';
import { createAdminSessionToken, isWeakAdminKey } from './admin-auth';

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

  const expectedToken = await createAdminSessionToken(adminKey);
  const sessionToken = request.cookies.get('__session')?.value;

  if (sessionToken !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
