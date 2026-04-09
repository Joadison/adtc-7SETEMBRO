import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/escala/login')) {
    return NextResponse.next();
  }


  if (pathname.startsWith('/escala')) {
    const authCookie = request.cookies.get('auth');
    if (authCookie?.value === 'true') {
      return NextResponse.next();
    }
    const loginUrl = new URL('/escala/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/escala/:path*',
};