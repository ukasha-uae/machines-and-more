import { NextRequest, NextResponse } from 'next/server';

const ADMIN_COOKIE_NAME = 'mm_admin_session';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const isLoginRoute = pathname === '/admin/login';
  const adminKey = process.env.ADMIN_ACCESS_KEY;
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = Boolean(adminKey) && sessionCookie === adminKey;

  if (!adminKey) {
    // Fail closed when admin key is not configured.
    return new NextResponse('ADMIN_ACCESS_KEY is not configured in environment variables.', {
      status: 500,
      headers: { 'content-type': 'text/plain' },
    });
  }

  if (!isAuthenticated && !isLoginRoute) {
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
