import { NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'auth_session';

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const isLoggedIn = request.cookies.get(AUTH_COOKIE_NAME)?.value === '1';
  const isLoginPage = pathname === '/login';

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isLoginPage) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/';
    dashboardUrl.search = '';

    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
