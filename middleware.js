import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // 1. Ambil Token dari Cookies
  const token = request.cookies.get('access_token')?.value; // Sesuai nama cookie di useAuth.js

  // 2. Tentukan Halaman Public (Bisa diakses tanpa login)
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(pathname);

  // 3. Logika Redirect
  
  // KASUS A: Sudah Login (Ada Token) tapi buka halaman Login/Register
  // -> Tendang ke Home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // KASUS B: Belum Login (Tidak ada Token) tapi buka halaman Private (Home, Profile, dll)
  // -> Tendang ke Login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Lanjut jika aman
  return NextResponse.next();
}

// Tentukan halaman mana saja yang kena efek middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder images (svg, png, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
};