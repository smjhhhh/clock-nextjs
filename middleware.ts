import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Let all /admin routes through
  // Authentication will be handled by the page components themselves
  // This avoids cookie/localStorage sync issues with Supabase
  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
