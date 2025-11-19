import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check for Supabase auth cookies
    // Supabase stores auth tokens in cookies with different naming patterns
    const hasAuthCookie =
      request.cookies.has('sb-access-token') ||
      request.cookies.has('sb-refresh-token') ||
      // Check for the actual cookie name pattern that Supabase uses
      Array.from(request.cookies.getAll()).some(cookie =>
        cookie.name.includes('auth-token') ||
        cookie.name.startsWith('sb-')
      )

    if (!hasAuthCookie) {
      // Not logged in, redirect to login page
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Cookie exists, let the page component handle detailed auth check
    return NextResponse.next()
  }

  // For /admin/login, just pass through
  // The page component will check if already logged in
  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
