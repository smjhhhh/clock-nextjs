'use client'

import { useState } from 'react'
import Link from 'next/link'
import WorldClock from '@/components/WorldClock'
import WeatherWidget from '@/components/WeatherWidget'
import ExchangeRate from '@/components/ExchangeRate'
import Countdown from '@/components/Countdown'
import FeedsWidget from '@/components/FeedsWidget'
import GoldChart from '@/components/GoldChart'

// Translation types
interface Translations {
  toolbox: string
  countdown: string
  weather: string
  worldClock: string
  exchangeRate: string
  feeds: string
  goldPrice: string
  worldMap: string
  techBlog: string
  techBlogDesc: string
  backToAbout: string
}

const translations: Record<string, Translations> = {
  zh: {
    toolbox: "Yoru's 工具箱",
    countdown: '倒计时',
    weather: '天气',
    worldClock: '工作时间',
    exchangeRate: '汇率',
    feeds: '订阅中心',
    goldPrice: '黄金价格',
    worldMap: '世界地图',
    techBlog: '技术博客',
    techBlogDesc: '分享学习与思考',
    backToAbout: '返回关于我'
  },
  en: {
    toolbox: "Yoru's Toolbox",
    countdown: 'Countdown',
    weather: 'Weather',
    worldClock: 'World Clock',
    exchangeRate: 'Exchange Rate',
    feeds: 'RSS Feeds',
    goldPrice: 'Gold Price',
    worldMap: 'World Map',
    techBlog: 'Tech Blog',
    techBlogDesc: 'Share learning and thoughts',
    backToAbout: 'Back to About'
  },
  jp: {
    toolbox: "Yoru's ツールボックス",
    countdown: 'カウントダウン',
    weather: '天気',
    worldClock: '世界時計',
    exchangeRate: '為替レート',
    feeds: 'RSSフィード',
    goldPrice: '金価格',
    worldMap: '世界地図',
    techBlog: '技術ブログ',
    techBlogDesc: '学習と思考を共有',
    backToAbout: 'について戻る'
  }
}

export default function ToolsPage() {
  const [language, setLanguage] = useState<'zh' | 'en' | 'jp'>('en')
  const [darkMode, setDarkMode] = useState(false)
  const t = translations[language]

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100'} transition-colors duration-300`}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                Yoru
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/about-me" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors">
                  {t.backToAbout}
                </Link>
                <Link href="/gallery" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors">
                  📸 相册
                </Link>
                <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors">
                  📝 博客
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('zh')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${language === 'zh' ? 'bg-white dark:bg-gray-700 text-pink-500 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  中文
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${language === 'en' ? 'bg-white dark:bg-gray-700 text-pink-500 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('jp')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${language === 'jp' ? 'bg-white dark:bg-gray-700 text-pink-500 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  日本語
                </button>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {darkMode ? '🌙' : '☀️'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tools Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">{t.toolbox}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-sky-100 dark:bg-sky-900 rounded-2xl shadow-lg p-6 border border-sky-200 dark:border-sky-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              ⏰ {t.countdown}
            </h3>
            <Countdown />
          </div>
          <div className="bg-sky-100 dark:bg-sky-900 rounded-2xl shadow-lg p-6 border border-sky-200 dark:border-sky-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              🌤️ {t.weather}
            </h3>
            <WeatherWidget />
          </div>
          <div className="bg-sky-100 dark:bg-sky-900 rounded-2xl shadow-lg p-6 border border-sky-200 dark:border-sky-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              🌍 {t.worldClock}
            </h3>
            <WorldClock />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-sky-100 dark:bg-sky-900 rounded-2xl shadow-lg p-6 border border-sky-200 dark:border-sky-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              📊 {t.goldPrice}
            </h3>
            <GoldChart />
          </div>
          <div className="bg-sky-100 dark:bg-sky-900 rounded-2xl shadow-lg p-6 border border-sky-200 dark:border-sky-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              💱 {t.exchangeRate}
            </h3>
            <ExchangeRate />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-sky-100 dark:bg-sky-900 rounded-2xl shadow-lg p-6 border border-sky-200 dark:border-sky-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              🗺️ {t.worldMap}
            </h3>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
              World Map (Coming Soon)
            </div>
          </div>
          <div className="bg-sky-100 dark:bg-sky-900 rounded-2xl shadow-lg p-6 border border-sky-200 dark:border-sky-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              📰 {t.feeds}
            </h3>
            <FeedsWidget />
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/blog"
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 text-center"
          >
            <div className="text-3xl mb-2">📝</div>
            <div className="text-xl font-bold">{t.techBlog}</div>
            <div className="text-sm opacity-90 mt-1">{t.techBlogDesc}</div>
          </Link>
          <Link
            href="/gallery"
            className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 text-center"
          >
            <div className="text-3xl mb-2">📸</div>
            <div className="text-xl font-bold">相册</div>
            <div className="text-sm opacity-90 mt-1">查看我的照片集</div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="backdrop-blur-xl bg-blue-50/70 dark:bg-blue-900/30 border-t border-blue-200/50 dark:border-blue-700/30 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 Yoru. Built with React & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}
