import { getRequestConfig } from 'next-intl/server'
import { defineRouting } from 'next-intl/routing'

// Define the locales
export const locales = ['zh', 'en', 'ja'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'zh'

export const localeNames: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
}

// Define routing configuration for next-intl v4
export const routing = defineRouting({
  locales,
  defaultLocale,
})

export default getRequestConfig(async ({ requestLocale }) => {
  // This is the locale that comes from middleware
  let locale = await requestLocale

  // Ensure we have a valid locale, fallback to default
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale
  }

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  }
})
