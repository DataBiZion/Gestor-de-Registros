// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  // Rutas públicas que no requieren autenticación
  const publicPaths = ['/login', '/api/auth/login'];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  // Obtener el token de la cookie
  const token = request.cookies.get('auth')?.value;

  // Si estamos en una ruta pública y hay token válido, redirigir al dashboard
  if (isPublicPath && token && request.nextUrl.pathname !== '/api/auth/login') {
    try {
      verify(token, process.env.JWT_SECRET || 'your-secret-key');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch {
      // Si el token no es válido, eliminar la cookie
      const response = NextResponse.next();
      response.cookies.delete('auth');
      return response;
    }
  }

  // Si no estamos en una ruta pública y no hay token, redirigir a login
  if (!isPublicPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Permitir la solicitud si:
  // 1. Es una ruta pública
  // 2. Tiene un token válido
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};