import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('mieuxflow_token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname === '/';

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
