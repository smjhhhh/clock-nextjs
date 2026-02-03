'use client'

import { Link, usePathname } from '@/navigation'
import { useTranslations, useLocale } from 'next-intl'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Navbar() {
  const pathname = usePathname()
  const t = useTranslations('nav')
  const locale = useLocale()

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/gallery', label: t('gallery') },
    { href: '/blog', label: t('blog') },
    { href: '/mbti-test', label: t('mbtiTest') },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent"
            >
              Yoru
            </Link>

            <div className="hidden sm:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-pink-500'
                      : 'text-gray-600 hover:text-pink-500'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Language Switcher */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <details className="relative">
              <summary className="list-none cursor-pointer p-2">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </summary>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-2 ${
                      isActive(item.href)
                        ? 'text-pink-500 bg-pink-50'
                        : 'text-gray-600 hover:text-pink-500 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  )
}
