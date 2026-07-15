import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const isAuthPage =
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup' ||
    request.nextUrl.pathname === '/';

  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard');

  // Redirect to login if accessing protected route without auth
  if (isProtectedPage && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if already logged in and on auth pages
  if (isAuthPage && user && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
