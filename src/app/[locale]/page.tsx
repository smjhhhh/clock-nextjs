'use client'

import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const [emojis, setEmojis] = useState<Array<{ emoji: string; id: string; row: number; index: number }>>([])
  const [mounted, setMounted] = useState(false)
  const t = useTranslations('landing')

  const config = {
    name: 'Yoru',
    nameHighlight: 'Yoru',
    avatar: '/images/avatar.webp',
    title: t('title'),
    quote: t('quote'),
    buttons: [
      { text: '👋 ' + t('buttons.home'), link: '/about-me', variant: 'pink' },
      { text: '🧠 ' + t('buttons.mbtiTest'), link: '/mbti-test', variant: 'purple' },
      { text: '💻 ' + t('buttons.github'), link: 'https://github.com/smjhhhh', variant: 'blue', external: true }
    ]
  }

  useEffect(() => {
    setMounted(true)

    const emojiList = [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
      '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
      '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒',
      '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕',
      '🎮', '🎯', '🎨', '🎭', '🎬', '🎤', '🎧', '🎸', '🎹', '🎲', '🎰', '🕹️',
      '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎱', '🏓', '🏸',
      '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎁', '🎊', '🎉', '🎈', '🎂', '🎄', '🎃',
      '💻', '⌨️', '🖥️', '🖱️', '💾', '💿', '📱', '📲', '☎️', '📺', '🎙️',
      '📚', '📖', '📝', '✏️', '📄', '📊', '📈', '📉', '📆', '📅',
      '✨', '⭐', '🌟', '💫', '🔥', '💥', '⚡', '💨', '🌈', '☀️', '⛅', '☁️', '🌧️', '⛈️', '❄️', '☃️', '🌊', '💧',
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝',
      '☕', '🍕', '🍔', '🍟', '🌮', '🌯', '🍱', '🍜', '🍝', '🍰', '🎂', '🧁', '🍦', '🍩', '🍪'
    ]

    const rows = 18
    const itemsPerRow = 30
    const generated: Array<{ emoji: string; id: string; row: number; index: number }> = []

    for (let row = 0; row < rows; row++) {
      for (let index = 0; index < itemsPerRow; index++) {
        generated.push({
          emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
          id: `${row}-${index}`,
          row: row,
          index: index
        })
      }
    }

    setEmojis(generated)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
      {/* Emoji Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        <style jsx>{`
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes bounce-border {
            0%, 100% {
              box-shadow: 0 0 20px rgba(34, 211, 238, 0.6), 0 0 40px rgba(34, 211, 238, 0.3);
              border-color: #22d3ee;
            }
            50% {
              box-shadow: 0 0 40px rgba(34, 211, 238, 1), 0 0 60px rgba(34, 211, 238, 0.5);
              border-color: #06b6d4;
            }
          }
          @keyframes shake-hand {
            0%, 100% { transform: rotate(0deg); }
            10%, 30%, 50%, 70%, 90% { transform: rotate(14deg); }
            20%, 40%, 60%, 80% { transform: rotate(-14deg); }
          }
          @keyframes scale-in-center {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .emoji-row {
            display: flex;
            position: absolute;
            animation: scrollLeft linear infinite;
            white-space: nowrap;
          }
          .emoji-row span {
            display: inline-block;
            padding: 0 0.5rem;
            font-size: 2rem;
          }
          .avatar-float {
            animation: float 3s ease-in-out infinite, bounce-border 2s ease-in-out infinite;
          }
          .shake-hand {
            display: inline-block;
            animation: shake-hand 2.5s ease-in-out infinite;
            transform-origin: 70% 70%;
          }
          .animate-scale-in-center {
            animation: scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
          }
        `}</style>
        {Array.from({ length: 18 }).map((_, rowIndex) => {
          const rowEmojis = emojis.filter(e => e.row === rowIndex)
          const duration = rowIndex % 2 === 0 ? 40 : 25

          return (
            <div
              key={rowIndex}
              className="emoji-row"
              style={{
                top: `${rowIndex * 5.5}%`,
                animationDuration: `${duration}s`,
                animationDelay: `${rowIndex * -3}s`
              }}
            >
              {[...rowEmojis, ...rowEmojis].map((item, idx) => (
                <span key={`${item.id}-${idx}`}>{item.emoji}</span>
              ))}
            </div>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="text-center animate-scale-in-center">
          {/* Avatar */}
          <div className="mb-8 flex justify-center">
            <div className="avatar-float w-48 h-48 rounded-full overflow-hidden border-4 border-cyan-400 shadow-2xl bg-white">
              <img
                src={config.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="60"%3E👤%3C/text%3E%3C/svg%3E'
                }}
              />
            </div>
          </div>

          {/* Glass Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-12 shadow-2xl border border-white/20 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              <span className="shake-hand">👋</span> 大家好，我是
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent"> {config.nameHighlight}</span>
            </h1>

            <p className="text-xl text-gray-200 mb-6">
              {config.title}
            </p>

            <p className="text-gray-300 mb-8 italic">
              &quot;{config.quote}&quot;
            </p>

            {/* Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              {config.buttons.map((btn, idx) =>
                btn.external ? (
                  <a
                    key={idx}
                    href={btn.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 ${
                      btn.variant === 'pink'
                        ? 'bg-white/10 border-2 border-pink-400 text-pink-400 hover:bg-pink-400/20'
                        : btn.variant === 'purple'
                        ? 'bg-white/10 border-2 border-purple-400 text-purple-400 hover:bg-purple-400/20'
                        : 'bg-white/10 border-2 border-blue-400 text-blue-400 hover:bg-blue-400/20'
                    }`}
                  >
                    {btn.text}
                  </a>
                ) : (
                  <Link
                    key={idx}
                    href={btn.link}
                    className={`px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 ${
                      btn.variant === 'pink'
                        ? 'bg-white/10 border-2 border-pink-400 text-pink-400 hover:bg-pink-400/20'
                        : btn.variant === 'purple'
                        ? 'bg-white/10 border-2 border-purple-400 text-purple-400 hover:bg-purple-400/20'
                        : 'bg-white/10 border-2 border-blue-400 text-blue-400 hover:bg-blue-400/20'
                    }`}
                  >
                    {btn.text}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
