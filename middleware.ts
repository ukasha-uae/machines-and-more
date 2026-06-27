import { NextRequest, NextResponse } from 'next/server';
import { createAdminSessionToken, isWeakAdminKey } from '@/lib/security/admin-auth';

const ADMIN_COOKIE_NAME = 'mm_admin_session';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const isLoginRoute = pathname === '/admin/login';
  const isTeamListingRoute = pathname === '/admin/add-product';
  const adminKey = process.env.ADMIN_ACCESS_KEY;
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!adminKey) {
    // Fail closed when admin key is not configured.
    return new NextResponse('ADMIN_ACCESS_KEY is not configured in environment variables.', {
      status: 500,
      headers: { 'content-type': 'text/plain' },
    });
  }

  if (isWeakAdminKey(adminKey)) {
    return new NextResponse('ADMIN_ACCESS_KEY is too weak. Set a strong key before publishing.', {
      status: 500,
      headers: { 'content-type': 'text/plain' },
    });
  }

  const expectedToken = await createAdminSessionToken(adminKey);
  const isAuthenticated = sessionCookie === expectedToken;

  if (!isAuthenticated && !isLoginRoute && !isTeamListingRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isLoginRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/admin';
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
