import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n'

export default createMiddleware(routing)

export const config = {
  // Match all pathnames except for
  // - … static files and images
  // - … Next.js internals
  // - … API routes
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
