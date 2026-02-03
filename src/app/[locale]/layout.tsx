import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import Navbar from '@/components/layout/Navbar'

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const { locale } = await params

  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Load messages directly from JSON file
  const messages = (await import(`@/locales/${locale}.json`)).default

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>
        <Navbar />
        {children}
      </AuthProvider>
    </NextIntlClientProvider>
  )
}
