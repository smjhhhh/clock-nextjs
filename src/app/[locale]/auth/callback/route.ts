import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/gallery'
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  // If there's an OAuth error, redirect with error info
  if (error) {
    console.error('OAuth error:', error, error_description)
    const fallbackUrl = next.startsWith('/admin') ? '/admin/login' : '/gallery'
    return NextResponse.redirect(`${origin}${fallbackUrl}?error=${encodeURIComponent(error_description || error)}`)
  }

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error('Code exchange error:', exchangeError)
    const fallbackUrl = next.startsWith('/admin') ? '/admin/login' : '/gallery'
    return NextResponse.redirect(`${origin}${fallbackUrl}?error=${encodeURIComponent(exchangeError.message)}`)
  }

  // No code means PKCE flow with hash fragments - redirect to gallery
  // The client-side auth will handle the session from localStorage
  return NextResponse.redirect(`${origin}${next}`)
}
