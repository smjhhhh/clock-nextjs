'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaReact, FaNodeJs, FaPython, FaDocker, FaGitAlt, FaVuejs, FaGithub } from 'react-icons/fa'
import { SiTypescript, SiTailwindcss, SiGmail } from 'react-icons/si'
import PhotoFrame from '@/components/PhotoFrame'

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

// MBTI type names mapping
const mbtiNames: Record<string, string> = {
  'INTJ': '建筑师',
  'INTP': '逻辑学家',
  'ENTJ': '指挥官',
  'ENTP': '辩论家',
  'INFJ': '提倡者',
  'INFP': '调停者',
  'ENFJ': '主人公',
  'ENFP': '竞选者',
  'ISTJ': '物流师',
  'ISFJ': '守卫者',
  'ESTJ': '总经理',
  'ESFJ': '执政官',
  'ISTP': '鉴赏家',
  'ISFP': '探险家',
  'ESTP': '企业家',
  'ESFP': '表演者'
}

export default function HomePage() {
  const [language, setLanguage] = useState<'zh' | 'en' | 'jp'>('en')
  const [darkMode, setDarkMode] = useState(false)
  const [mbtiScores, setMbtiScores] = useState({
    introvert: 75,  // 内向
    sensing: 58,    // 感知
    thinking: 89,   // 理性
    perceiving: 83, // 随性
    turbulent: 51   // 敏感
  })
  const t = translations[language]

  // Calculate MBTI type based on scores
  const calculateMBTI = () => {
    const ie = mbtiScores.introvert >= 50 ? 'I' : 'E'
    const ns = mbtiScores.sensing >= 50 ? 'S' : 'N'
    const tf = mbtiScores.thinking >= 50 ? 'T' : 'F'
    const jp = mbtiScores.perceiving >= 50 ? 'P' : 'J'
    const at = mbtiScores.turbulent >= 50 ? 'T' : 'A'

    const baseType = `${ie}${ns}${tf}${jp}`
    const fullType = `${baseType}-${at}`
    const typeName = mbtiNames[baseType] || '探索者'

    return { fullType, baseType, typeName }
  }

  // Get MBTI group color based on type
  const getMBTIGroupColor = (baseType: string) => {
    const secondChar = baseType[1] // N or S
    const thirdChar = baseType[2]  // T or F
    const fourthChar = baseType[3] // P or J

    // 🟣 分析师 (Analysts) — NT
    if (secondChar === 'N' && thirdChar === 'T') {
      return {
        group: '分析师',
        textLight: 'text-purple-600',
        textDark: 'text-purple-400',
        bgLight: 'bg-purple-100',
        bgDark: 'bg-purple-900/30',
        borderLight: 'border-purple-200',
        borderDark: 'border-purple-700/30',
        gradientFrom: 'from-purple-600',
        gradientTo: 'to-indigo-600',
        gradientFromDark: 'from-purple-400',
        gradientToDark: 'to-indigo-400'
      }
    }
    // 🟢 外交官 (Diplomats) — NF
    if (secondChar === 'N' && thirdChar === 'F') {
      return {
        group: '外交官',
        textLight: 'text-green-600',
        textDark: 'text-green-400',
        bgLight: 'bg-green-100',
        bgDark: 'bg-green-900/30',
        borderLight: 'border-green-200',
        borderDark: 'border-green-700/30',
        gradientFrom: 'from-green-600',
        gradientTo: 'to-emerald-600',
        gradientFromDark: 'from-green-400',
        gradientToDark: 'to-emerald-400'
      }
    }
    // 🔵 哨兵 (Sentinels) — SJ
    if (secondChar === 'S' && fourthChar === 'J') {
      return {
        group: '哨兵',
        textLight: 'text-blue-600',
        textDark: 'text-blue-400',
        bgLight: 'bg-blue-100',
        bgDark: 'bg-blue-900/30',
        borderLight: 'border-blue-200',
        borderDark: 'border-blue-700/30',
        gradientFrom: 'from-blue-600',
        gradientTo: 'to-cyan-600',
        gradientFromDark: 'from-blue-400',
        gradientToDark: 'to-cyan-400'
      }
    }
    // 🟡 探险家 (Explorers) — SP
    if (secondChar === 'S' && fourthChar === 'P') {
      return {
        group: '探险家',
        textLight: 'text-yellow-600',
        textDark: 'text-yellow-400',
        bgLight: 'bg-yellow-100',
        bgDark: 'bg-yellow-900/30',
        borderLight: 'border-yellow-200',
        borderDark: 'border-yellow-700/30',
        gradientFrom: 'from-yellow-600',
        gradientTo: 'to-orange-600',
        gradientFromDark: 'from-yellow-400',
        gradientToDark: 'to-orange-400'
      }
    }

    // Default fallback
    return {
      group: '探索者',
      textLight: 'text-gray-600',
      textDark: 'text-gray-400',
      bgLight: 'bg-gray-100',
      bgDark: 'bg-gray-900/30',
      borderLight: 'border-gray-200',
      borderDark: 'border-gray-700/30',
      gradientFrom: 'from-gray-600',
      gradientTo: 'to-gray-600',
      gradientFromDark: 'from-gray-400',
      gradientToDark: 'to-gray-400'
    }
  }

  const mbtiType = calculateMBTI()
  const mbtiColors = getMBTIGroupColor(mbtiType.baseType)

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>, key: keyof typeof mbtiScores) => {
    const bar = e.currentTarget
    const rect = bar.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.round((x / rect.width) * 100)
    const clampedPercentage = Math.max(0, Math.min(100, percentage))
    setMbtiScores(prev => ({ ...prev, [key]: clampedPercentage }))
  }

  const handleBarDrag = (e: React.MouseEvent<HTMLDivElement>, key: keyof typeof mbtiScores) => {
    if (e.buttons !== 1) return // Only drag with left mouse button
    const bar = e.currentTarget
    const rect = bar.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.round((x / rect.width) * 100)
    const clampedPercentage = Math.max(0, Math.min(100, percentage))
    setMbtiScores(prev => ({ ...prev, [key]: clampedPercentage }))
  }

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
                <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors">{t.nav.about}</a>
                <Link href="/tools" className="text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors">{t.nav.tools}</Link>
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

      {/* Avatar Section - Below Navigation */}
      <div className="flex justify-center items-center py-12 bg-gradient-to-b from-white/50 to-transparent dark:from-slate-900/50">
        <style jsx global>{`
          @keyframes swing {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
          }
          @keyframes float-left {
            0%, 100% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-10px) translateX(-5px); }
          }
          @keyframes float-right {
            0%, 100% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-8px) translateX(5px); }
          }
          @keyframes float-top {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
          .swing-avatar {
            animation: swing 3s ease-in-out infinite;
            transform-origin: top center;
          }
          .float-left-card {
            animation: float-left 4s ease-in-out infinite;
          }
          .float-right-card {
            animation: float-right 3.5s ease-in-out infinite;
          }
          .float-top-card {
            animation: float-top 5s ease-in-out infinite;
          }
        `}</style>

        {/* Avatar with floating cards container */}
        <div className="relative inline-block">
          {/* Left top floating card - MBTI */}
          <div className="float-left-card absolute -left-20 top-6 hidden md:block">
            <div className={`backdrop-blur-xl ${mbtiColors.bgLight}/50 dark:${mbtiColors.bgDark} rounded-2xl p-4 shadow-lg border ${mbtiColors.borderLight}/50 dark:${mbtiColors.borderDark}`}>
              <div className="flex items-center gap-3">
                <div>
                  <p className={`text-xs font-semibold ${mbtiColors.textLight} dark:${mbtiColors.textDark}`}>{mbtiType.fullType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Left bottom floating card - 音乐爱好 */}
          <div className="float-top-card absolute -left-48 bottom-2 hidden md:block">
            <div className="backdrop-blur-xl bg-blue-100/50 dark:bg-blue-900/30 rounded-2xl p-4 shadow-lg border border-blue-200/50 dark:border-blue-700/30">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">宇多田光 / 黑豹 / 罗大佑</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Avatar */}
          <div className="swing-avatar z-10">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-400 shadow-2xl">
              <img src="/images/avatar.webp" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right floating card - 星座 */}
          <div className="float-right-card absolute -right-48 top-1/2 -translate-y-1/2 hidden md:block">
            <div className="backdrop-blur-xl bg-blue-100/50 dark:bg-blue-900/30 rounded-2xl p-4 shadow-lg border border-blue-200/50 dark:border-blue-700/30">
              <div className="flex items-center gap-3">
                <img src="/images/libra.png" alt="Libra" className="w-8 h-8 object-contain" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">天秤座</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <div className="backdrop-blur-xl bg-blue-50/70 dark:bg-blue-900/30 rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-700/30">
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

            {/* Personal Bio */}
            <section>
              <div className="backdrop-blur-xl bg-blue-50/70 dark:bg-blue-900/30 rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-700/30">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🌟</span>
                  <span>About Me</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <span className="text-lg">🧠</span>
                    <div>
                      <span className="text-sm font-medium">MBTI</span>
                      <p className={`text-xs font-semibold ${mbtiColors.textLight} dark:${mbtiColors.textDark}`}>{mbtiType.fullType} - {mbtiType.typeName}</p>
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
                      <img src="/images/main-istp-male.svg" alt={mbtiType.baseType} className="w-full h-full object-contain" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${mbtiScores.turbulent >= 50 ? 'bg-green-500' : 'bg-blue-500'}`}>
                      <span className="text-white text-xs">{mbtiScores.turbulent >= 50 ? 'T' : 'A'}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold bg-gradient-to-r ${mbtiColors.gradientFrom} ${mbtiColors.gradientTo} dark:${mbtiColors.gradientFromDark} dark:${mbtiColors.gradientToDark} bg-clip-text text-transparent`}>{mbtiType.fullType}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{mbtiType.typeName} · {mbtiColors.group}</p>
                    <div className="flex gap-1 mt-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${mbtiScores.introvert >= 50 ? 'bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300' : 'bg-orange-200 dark:bg-orange-800 text-orange-700 dark:text-orange-300'}`}>{mbtiScores.introvert >= 50 ? '内向' : '外向'}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${mbtiScores.sensing >= 50 ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300' : 'bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300'}`}>{mbtiScores.sensing >= 50 ? '感知' : '直觉'}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${mbtiScores.thinking >= 50 ? 'bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300' : 'bg-pink-200 dark:bg-pink-800 text-pink-700 dark:text-pink-300'}`}>{mbtiScores.thinking >= 50 ? '理性' : '情感'}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${mbtiScores.perceiving >= 50 ? 'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300' : 'bg-teal-200 dark:bg-teal-800 text-teal-700 dark:text-teal-300'}`}>{mbtiScores.perceiving >= 50 ? '随性' : '计划'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* 内向 vs 外向 */}
                  <div className="group">
                    <div className="flex justify-between text-sm mb-2">
                      <span className={`text-xs transition-all ${mbtiScores.introvert < 50 ? 'text-orange-600 dark:text-orange-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>外向</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-bold">{mbtiScores.introvert}%</span>
                      <span className={`text-xs transition-all ${mbtiScores.introvert >= 50 ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>内向</span>
                    </div>
                    <div
                      className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner cursor-pointer"
                      onClick={(e) => handleBarClick(e, 'introvert')}
                      onMouseMove={(e) => handleBarDrag(e, 'introvert')}
                    >
                      <div className="h-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-teal-500 rounded-full transition-all duration-200 group-hover:shadow-lg group-hover:shadow-cyan-500/50 pointer-events-none" style={{ width: `${mbtiScores.introvert}%` }}></div>
                    </div>
                  </div>

                  {/* 求真务实 vs 天马行空 */}
                  <div className="group">
                    <div className="flex justify-between text-sm mb-2">
                      <span className={`text-xs transition-all ${mbtiScores.sensing < 50 ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>直觉</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">{mbtiScores.sensing}%</span>
                      <span className={`text-xs transition-all ${mbtiScores.sensing >= 50 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>感知</span>
                    </div>
                    <div
                      className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner cursor-pointer"
                      onClick={(e) => handleBarClick(e, 'sensing')}
                      onMouseMove={(e) => handleBarDrag(e, 'sensing')}
                    >
                      <div className="h-full bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-400 rounded-full transition-all duration-200 group-hover:shadow-lg group-hover:shadow-amber-500/50 pointer-events-none" style={{ width: `${mbtiScores.sensing}%` }}></div>
                    </div>
                  </div>

                  {/* 理性思考 vs 情感细腻 */}
                  <div className="group">
                    <div className="flex justify-between text-sm mb-2">
                      <span className={`text-xs transition-all ${mbtiScores.thinking >= 50 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>理性</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{mbtiScores.thinking}%</span>
                      <span className={`text-xs transition-all ${mbtiScores.thinking < 50 ? 'text-pink-600 dark:text-pink-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>情感</span>
                    </div>
                    <div
                      className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner cursor-pointer"
                      onClick={(e) => handleBarClick(e, 'thinking')}
                      onMouseMove={(e) => handleBarDrag(e, 'thinking')}
                    >
                      <div className="h-full bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 rounded-full transition-all duration-200 group-hover:shadow-lg group-hover:shadow-emerald-500/50 pointer-events-none" style={{ width: `${mbtiScores.thinking}%` }}></div>
                    </div>
                  </div>

                  {/* 随机应变 vs 运筹帷幄 */}
                  <div className="group">
                    <div className="flex justify-between text-sm mb-2">
                      <span className={`text-xs transition-all ${mbtiScores.perceiving < 50 ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>计划</span>
                      <span className="text-violet-600 dark:text-violet-400 font-bold">{mbtiScores.perceiving}%</span>
                      <span className={`text-xs transition-all ${mbtiScores.perceiving >= 50 ? 'text-violet-600 dark:text-violet-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>随性</span>
                    </div>
                    <div
                      className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner cursor-pointer"
                      onClick={(e) => handleBarClick(e, 'perceiving')}
                      onMouseMove={(e) => handleBarDrag(e, 'perceiving')}
                    >
                      <div className="h-full bg-gradient-to-r from-violet-400 via-purple-500 to-fuchsia-500 rounded-full transition-all duration-200 group-hover:shadow-lg group-hover:shadow-violet-500/50 pointer-events-none" style={{ width: `${mbtiScores.perceiving}%` }}></div>
                    </div>
                  </div>

                  {/* 身份特征 - Turbulent */}
                  <div className="group">
                    <div className="flex justify-between text-sm mb-2">
                      <span className={`text-xs transition-all ${mbtiScores.turbulent < 50 ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>自信</span>
                      <span className="text-rose-600 dark:text-rose-400 font-bold">{mbtiScores.turbulent}%</span>
                      <span className={`text-xs transition-all ${mbtiScores.turbulent >= 50 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>敏感</span>
                    </div>
                    <div
                      className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner cursor-pointer"
                      onClick={(e) => handleBarClick(e, 'turbulent')}
                      onMouseMove={(e) => handleBarDrag(e, 'turbulent')}
                    >
                      <div className="h-full bg-gradient-to-r from-rose-400 via-red-500 to-pink-500 rounded-full transition-all duration-200 group-hover:shadow-lg group-hover:shadow-rose-500/50 pointer-events-none" style={{ width: `${mbtiScores.turbulent}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tech Stack */}
            <div className="backdrop-blur-xl bg-blue-50/70 dark:bg-blue-900/30 rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-700/30">
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
            <div className="backdrop-blur-xl bg-blue-50/70 dark:bg-blue-900/30 rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-700/30">
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
            <div className="backdrop-blur-xl bg-blue-50/70 dark:bg-blue-900/30 rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-700/30">
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

      {/* Footer */}
      <footer className="backdrop-blur-xl bg-blue-50/70 dark:bg-blue-900/30 border-t border-blue-200/50 dark:border-blue-700/30 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 Yoru. Built with React & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}
