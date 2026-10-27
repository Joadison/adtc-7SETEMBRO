import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acesso à página de login
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Rotas que exigem autenticação
  const protectedRoutes = ["/config", "/editor", "/escala"];

  const requiresAuth = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (requiresAuth) {
    const authCookie = request.cookies.get("auth");

    if (authCookie?.value === "true") {
      return NextResponse.next();
    }

    const loginUrl = new URL("/login", request.url);

    // Guarda a página solicitada para redirecionar após o login
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/config/:path*", "/editor/:path*", "/escala/:path*"],
};