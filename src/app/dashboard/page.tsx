'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaReact, FaNodeJs, FaPython, FaDocker, FaGitAlt, FaVuejs, FaGithub } from 'react-icons/fa'
import { SiTypescript, SiTailwindcss, SiGmail } from 'react-icons/si'
import PhotoFrame from '@/components/PhotoFrame'
import WorldClock from '@/components/WorldClock'
import WeatherWidget from '@/components/WeatherWidget'
import ExchangeRate from '@/components/ExchangeRate'
import Countdown from '@/components/Countdown'
import FeedsWidget from '@/components/FeedsWidget'
import GoldChart from '@/components/GoldChart'

// Translation types
interface Translations {
  greeting: string
  dream: string
  skills: string
  studentTitle: string
  aboutMe: {
    coding: string
    birthday: string
    learning: string
  }
  techStack: string
  interests: string
  interestsList: Array<{ name: string; icon: string }>
  contact: string
  toolbox: string
  countdown: string
  weather: string
  worldClock: string
  exchangeRate: string
  feeds: string
  goldPrice: string
  worldMap: string
  marketHeatmap: string
  marketHeatmapDesc: string
  techBlog: string
  techBlogDesc: string
  nav: {
    about: string
    tools: string
    blog: string
    market: string
  }
}

const translations: Record<string, Translations> = {
  zh: {
    greeting: '你好，我是 Yoru，来自上海，很高兴认识你 👋',
    dream: '🌟 Dream to be a full-stack developer.',
    skills: '前端开发 / 产品设计 / 模型调参 / agent 开发',
    studentTitle: '🎓 我是一名软件工程专业的学生。',
    aboutMe: {
      coding: 'Love coding and open source.',
      birthday: '2002.9.26 born in Shanghai.',
      learning: 'Passionate learner, always growing'
    },
    techStack: '技术栈',
    interests: '兴趣爱好',
    interestsList: [
      { name: '旅行', icon: '✈️' },
      { name: '音乐', icon: '🎵' },
      { name: '摄影', icon: '📷' },
      { name: '编程', icon: '💻' }
    ],
    contact: '联系方式',
    toolbox: "Yoru's 工具箱",
    countdown: '倒计时',
    weather: '天气',
    worldClock: '工作时间',
    exchangeRate: '汇率',
    feeds: '订阅中心',
    goldPrice: '黄金价格',
    worldMap: '世界地图',
    marketHeatmap: '市场热力图',
    marketHeatmapDesc: '查看实时市场数据',
    techBlog: '技术博客',
    techBlogDesc: '分享学习与思考',
    nav: {
      about: '关于',
      tools: '工具',
      blog: '博客',
      market: '市场'
    }
  },
  en: {
    greeting: "Hi, I'm Yoru from Shanghai, nice to meet you 👋",
    dream: '🌟 Dream to be a full-stack developer.',
    skills: 'Frontend Dev / Product Design / Model Training / Agent Development',
    studentTitle: '🎓 I am a software engineering student.',
    aboutMe: {
      coding: 'Love coding and open source.',
      birthday: 'Born on September 26, 2002 in Shanghai.',
      learning: 'Passionate learner, always growing'
    },
    techStack: 'Tech Stack',
    interests: 'Interests',
    interestsList: [
      { name: 'Traveling', icon: '✈️' },
      { name: 'Music', icon: '🎵' },
      { name: 'Photography', icon: '📷' },
      { name: 'Coding', icon: '💻' }
    ],
    contact: 'Contact',
    toolbox: "Yoru's Toolbox",
    countdown: 'Countdown',
    weather: 'Weather',
    worldClock: 'World Clock',
    exchangeRate: 'Exchange Rate',
    feeds: 'RSS Feeds',
    goldPrice: 'Gold Price',
    worldMap: 'World Map',
    marketHeatmap: 'Market Heatmap',
    marketHeatmapDesc: 'View real-time market data',
    techBlog: 'Tech Blog',
    techBlogDesc: 'Share learning and thoughts',
    nav: {
      about: 'About',
      tools: 'Tools',
      blog: 'Blog',
      market: 'Market'
    }
  },
  jp: {
    greeting: 'こんにちは、私は上海出身のYoruです、よろしくお願いします 👋',
    dream: '🌟 フルスタック開発者になることを夢見ています。',
    skills: 'フロントエンド開発 / プロダクトデザイン / モデル訓練 / エージェント開発',
    studentTitle: '🎓 ソフトウェアエンジニアリングを専攻している学生です。',
    aboutMe: {
      coding: 'コーディングとオープンソースが大好きです。',
      birthday: '2002年9月26日、上海生まれ。',
      learning: '情熱的な学習者、常に成長中'
    },
    techStack: '技術スタック',
    interests: '趣味',
    interestsList: [
      { name: '旅行', icon: '✈️' },
      { name: '音楽', icon: '🎵' },
      { name: '写真', icon: '📷' },
      { name: 'コーディング', icon: '💻' }
    ],
    contact: '連絡先',
    toolbox: "Yoru's ツールボックス",
    countdown: 'カウントダウン',
    weather: '天気',
    worldClock: '世界時計',
    exchangeRate: '為替レート',
    feeds: 'RSSフィード',
    goldPrice: '金価格',
    worldMap: '世界地図',
    marketHeatmap: 'マーケットヒートマップ',
    marketHeatmapDesc: 'リアルタイム市場データを表示',
    techBlog: '技術ブログ',
    techBlogDesc: '学習と思考を共有',
    nav: {
      about: 'について',
      tools: 'ツール',
      blog: 'ブログ',
      market: '市場'
    }
  }
}

interface TechItem {
  name: string
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  bgColor: string
}

const techStack: TechItem[] = [
  { name: 'React', Icon: FaReact, color: '#61DAFB', bgColor: 'rgba(97, 218, 251, 0.25)' },
  { name: 'Vue', Icon: FaVuejs, color: '#42B883', bgColor: 'rgba(66, 184, 131, 0.25)' },
  { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6', bgColor: 'rgba(49, 120, 198, 0.25)' },
  { name: 'Node.js', Icon: FaNodeJs, color: '#339933', bgColor: 'rgba(51, 153, 51, 0.25)' },
  { name: 'Python', Icon: FaPython, color: '#3776AB', bgColor: 'rgba(55, 118, 171, 0.25)' },
  { name: 'Tailwind', Icon: SiTailwindcss, color: '#06B6D4', bgColor: 'rgba(6, 182, 212, 0.25)' },
  { name: 'Docker', Icon: FaDocker, color: '#2496ED', bgColor: 'rgba(36, 150, 237, 0.25)' },
  { name: 'Git', Icon: FaGitAlt, color: '#F05032', bgColor: 'rgba(240, 80, 50, 0.25)' },
]

export default function HomePage() {
  const [language, setLanguage] = useState<'zh' | 'en' | 'jp'>('en')
  const [darkMode, setDarkMode] = useState(false)
  const t = translations[language]

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                Yoru
              </Link>
              <div className="hidden md:flex gap-6">
                <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors">{t.nav.about}</a>
                <a href="#tools" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors">{t.nav.tools}</a>
                <Link href="/gallery" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors">
                  📸 相册
                </Link>
                <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors">
                  {t.nav.blog}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Card */}
            <section id="about">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-400 dark:from-cyan-500 dark:to-blue-500 rounded-2xl p-8 text-white shadow-xl">
                <p className="text-lg md:text-xl mb-2 font-medium">{t.greeting}</p>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.dream}</h1>
                <p className="text-base opacity-95">{t.skills}</p>
              </div>
            </section>

            {/* About Me */}
            <section>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.studentTitle}</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">😺</span>
                    <p>{t.aboutMe.coding}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🎂</span>
                    <p>{t.aboutMe.birthday}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🔥</span>
                    <p>{t.aboutMe.learning}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Avatar */}
            <section>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-cyan-400 shadow-lg">
                    <img src="/images/avatar.webp" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Yoru</h2>
                    <p className="text-gray-600 dark:text-gray-400">Full-stack Developer</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Personal Bio */}
            <section>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🌟</span>
                  <span>About Me</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <span className="text-lg">🧠</span>
                    <div>
                      <span className="text-sm font-medium">MBTI</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">ISTP-T - 鉴赏家</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <img src="/images/libra.png" alt="Libra" className="w-8 h-8 object-contain" />
                    <div>
                      <span className="text-sm font-medium">星座</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">天秤座 (9.26)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <span className="text-lg">🎵</span>
                    <div>
                      <span className="text-sm font-medium">音乐爱好</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">宇多田光 / 黑豹 / 罗大佑</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* MBTI Analysis */}
            <section>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-800 dark:to-purple-900/30 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-800/50">
                {/* Header with avatar and MBTI type */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 p-2 shadow-md">
                      <img src="/images/main-istp-male.svg" alt="ISTP" className="w-full h-full object-contain" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs">T</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">ISTP-T</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">鉴赏家 · 探索者</p>
                    <div className="flex gap-1 mt-1">
                      <span className="px-2 py-0.5 bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 text-xs rounded-full">内向</span>
                      <span className="px-2 py-0.5 bg-yellow-200 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">感知</span>
                      <span className="px-2 py-0.5 bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300 text-xs rounded-full">理性</span>
                      <span className="px-2 py-0.5 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs rounded-full">随性</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* 内向 vs 外向 */}
                  <div className="group">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">外向</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold">75%</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-xs">内向</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-teal-500 rounded-full transition-all duration-1000 group-hover:shadow-lg group-hover:shadow-cyan-500/50" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  {/* 求真务实 vs 天马行空 */}
                  <div className="group">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">直觉</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">58%</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-xs">感知</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400 rounded-full transition-all duration-1000 group-hover:shadow-lg group-hover:shadow-amber-500/50" style={{ width: '58%' }}></div>
                    </div>
                  </div>

                  {/* 理性思考 vs 情感细腻 */}
                  <div className="group">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-xs">理性</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">89%</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">情感</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 rounded-full transition-all duration-1000 group-hover:shadow-lg group-hover:shadow-emerald-500/50" style={{ width: '89%' }}></div>
                    </div>
                  </div>

                  {/* 随机应变 vs 运筹帷幄 */}
                  <div className="group">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">计划</span>
                      <span className="text-violet-600 dark:text-violet-400 font-bold">83%</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-xs">随性</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-violet-400 via-purple-500 to-fuchsia-500 rounded-full transition-all duration-1000 group-hover:shadow-lg group-hover:shadow-violet-500/50" style={{ width: '83%' }}></div>
                    </div>
                  </div>

                  {/* 身份特征 - Turbulent */}
                  <div className="group">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500 dark:text-gray-400 text-xs">自信</span>
                      <span className="text-rose-600 dark:text-rose-400 font-bold">51%</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-xs">敏感</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-rose-400 via-red-500 to-pink-500 rounded-full transition-all duration-1000 group-hover:shadow-lg group-hover:shadow-rose-500/50" style={{ width: '51%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tech Stack */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t.techStack}</h3>
              <div className="grid grid-cols-4 gap-2">
                {techStack.map((tech, idx) => (
                  <div
                    key={idx}
                    className="aspect-square flex items-center justify-center rounded-xl transition-all hover:scale-105 cursor-pointer shadow-sm"
                    style={{ backgroundColor: tech.bgColor }}
                    title={tech.name}
                  >
                    <tech.Icon className="text-4xl" style={{ color: tech.color }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>💫</span>
                <span>{t.interests}</span>
              </h3>
              <div className="space-y-2.5">
                {t.interestsList.map((interest, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <span className="text-xl">{interest.icon}</span>
                    <span className="text-sm">{interest.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>📬</span>
                <span>{t.contact}</span>
              </h3>
              <div className="space-y-2.5">
                <a href="https://github.com/smjhhhh" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors text-sm">
                  <FaGithub className="text-xl" />
                  <span>david Shen</span>
                </a>
                <a href="mailto:smj2002bj@gmail.com" className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-red-500 transition-colors text-sm">
                  <SiGmail className="text-xl text-red-500" />
                  <span>smj2002bj@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Photo Gallery */}
            <PhotoFrame />
          </div>
        </div>
      </div>

      {/* Tools Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section id="tools" className="mb-20">
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
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 Yoru. Built with React & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}
