'use client'

import { Link } from '@/navigation'
import { useState, useEffect, useRef } from 'react'

interface ZodiacSign {
  id: string
  name: string
  nameEn: string
  symbol: string
  emoji: string
  dates: string
  color: string
  angle: number
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

const zodiacSigns: ZodiacSign[] = [
  { id: 'aries', name: '白羊座', nameEn: 'Aries', symbol: '♈', emoji: '♈', dates: '3.21-4.19', color: 'from-red-500 to-orange-500', angle: 0 },
  { id: 'taurus', name: '金牛座', nameEn: 'Taurus', symbol: '♉', emoji: '♉', dates: '4.20-5.20', color: 'from-green-600 to-emerald-600', angle: 30 },
  { id: 'gemini', name: '双子座', nameEn: 'Gemini', symbol: '♊', emoji: '♊', dates: '5.21-6.20', color: 'from-yellow-400 to-amber-400', angle: 60 },
  { id: 'cancer', name: '巨蟹座', nameEn: 'Cancer', symbol: '♋', emoji: '♋', dates: '6.21-7.22', color: 'from-blue-400 to-cyan-400', angle: 90 },
  { id: 'leo', name: '狮子座', nameEn: 'Leo', symbol: '♌', emoji: '♌', dates: '7.23-8.22', color: 'from-orange-500 to-yellow-500', angle: 120 },
  { id: 'virgo', name: '处女座', nameEn: 'Virgo', symbol: '♍', emoji: '♍', dates: '8.23-9.22', color: 'from-teal-500 to-green-500', angle: 150 },
  { id: 'libra', name: '天秤座', nameEn: 'Libra', symbol: '♎', emoji: '♎', dates: '9.23-10.22', color: 'from-pink-500 to-rose-500', angle: 180 },
  { id: 'scorpio', name: '天蝎座', nameEn: 'Scorpio', symbol: '♏', emoji: '♏', dates: '10.23-11.21', color: 'from-purple-600 to-indigo-600', angle: 210 },
  { id: 'sagittarius', name: '射手座', nameEn: 'Sagittarius', symbol: '♐', emoji: '♐', dates: '11.22-12.21', color: 'from-indigo-500 to-purple-500', angle: 240 },
  { id: 'capricorn', name: '摩羯座', nameEn: 'Capricorn', symbol: '♑', emoji: '♑', dates: '12.22-1.19', color: 'from-gray-600 to-slate-600', angle: 270 },
  { id: 'aquarius', name: '水瓶座', nameEn: 'Aquarius', symbol: '♒', emoji: '♒', dates: '1.20-2.18', color: 'from-cyan-500 to-blue-500', angle: 300 },
  { id: 'pisces', name: '双鱼座', nameEn: 'Pisces', symbol: '♓', emoji: '♓', dates: '2.19-3.20', color: 'from-blue-400 to-purple-400', angle: 330 }
]

// 星座连线图案数据
const constellationLines: Record<string, [number, number][]> = {
  'aries': [[0.2, 0.3], [0.5, 0.2], [0.7, 0.4], [0.5, 0.6]],
  'taurus': [[0.3, 0.2], [0.5, 0.3], [0.7, 0.2], [0.6, 0.5], [0.4, 0.5]],
  'gemini': [[0.3, 0.3], [0.4, 0.6], [0.6, 0.6], [0.7, 0.3]],
  'cancer': [[0.3, 0.4], [0.5, 0.3], [0.7, 0.4], [0.5, 0.6]],
  'leo': [[0.2, 0.5], [0.4, 0.3], [0.6, 0.2], [0.8, 0.4], [0.6, 0.6]],
  'virgo': [[0.3, 0.2], [0.4, 0.4], [0.5, 0.6], [0.6, 0.4], [0.7, 0.2]],
  'libra': [[0.3, 0.3], [0.5, 0.5], [0.7, 0.3]],
  'scorpio': [[0.2, 0.3], [0.4, 0.2], [0.6, 0.4], [0.8, 0.5], [0.6, 0.7]],
  'sagittarius': [[0.3, 0.5], [0.5, 0.3], [0.7, 0.5], [0.8, 0.7]],
  'capricorn': [[0.2, 0.4], [0.4, 0.3], [0.6, 0.5], [0.7, 0.7]],
  'aquarius': [[0.3, 0.3], [0.5, 0.2], [0.7, 0.3], [0.5, 0.5], [0.3, 0.6], [0.7, 0.6]],
  'pisces': [[0.2, 0.4], [0.4, 0.3], [0.5, 0.5], [0.6, 0.3], [0.8, 0.4], [0.5, 0.7]]
}

export default function ZodiacWheelPage() {
  const [hoveredSign, setHoveredSign] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])
  const [wheelRotation, setWheelRotation] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const particleIdRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // 页面加载动画
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  // 鼠标跟踪
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // 创建粒子
      if (Math.random() > 0.7) {
        const newParticle: Particle = {
          id: particleIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1
        }
        setParticles(prev => [...prev.slice(-20), newParticle])
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // 粒子动画
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.02
          }))
          .filter(p => p.life > 0)
      )
    }, 16)

    return () => clearInterval(interval)
  }, [])

  // 鼠标滚轮旋转轮盘
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (containerRef.current?.contains(e.target as Node)) {
        e.preventDefault()
        setWheelRotation(prev => prev + e.deltaY * 0.1)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 relative overflow-hidden">
      {/* 极简背景网格 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[length:40px_40px] opacity-40" />

      {/* 鼠标跟随粒子 */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: `rgba(147, 51, 234, ${particle.life})`,
            boxShadow: `0 0 ${particle.life * 10}px rgba(147, 51, 234, ${particle.life})`,
            transform: 'translate(-50%, -50%)',
            transition: 'none'
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* 标题区 - 极简设计 */}
        <div
          className="text-center mb-20 space-y-6"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(-30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <h1 className="text-7xl font-light tracking-tight text-gray-900">
            星座
          </h1>
          <p className="text-lg text-gray-500 font-light tracking-wide">
            选择你的星座，探索性格奥秘
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto" />
        </div>

        {/* 星座轮盘 */}
        <div
          ref={containerRef}
          className="relative w-full max-w-5xl mx-auto aspect-square"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'scale(1)' : 'scale(0.9)',
            transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
          }}
        >
          {/* 中心圆 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl flex items-center justify-center group hover:scale-105 transition-transform duration-500">
              <div className="text-center">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">✨</div>
                <div className="text-gray-600 font-light text-sm tracking-wider">ZODIAC</div>
              </div>
            </div>
          </div>

          {/* 星座卡片 */}
          {zodiacSigns.map((sign, index) => {
            const radius = 320
            const totalAngle = (sign.angle + wheelRotation) - 90
            const angle = totalAngle * (Math.PI / 180)
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            const isHovered = hoveredSign === sign.id
            const delay = index * 0.05

            return (
              <Link
                key={sign.id}
                href={`/zodiac/${sign.id}`}
                className="absolute group"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  opacity: isLoaded ? 1 : 0,
                  transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
                }}
                onMouseEnter={() => setHoveredSign(sign.id)}
                onMouseLeave={() => setHoveredSign(null)}
              >
                {/* 3D 卡片效果 */}
                <div
                  className="relative"
                  style={{
                    transform: isHovered
                      ? 'perspective(1000px) rotateX(5deg) rotateY(-5deg) scale(1.15)'
                      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* 光晕效果 */}
                  {isHovered && (
                    <div
                      className={`absolute -inset-4 rounded-full bg-gradient-to-br ${sign.color} opacity-20 blur-xl animate-pulse`}
                      style={{ zIndex: -1 }}
                    />
                  )}

                  {/* 主卡片 */}
                  <div className={`
                    w-20 h-20 rounded-2xl
                    bg-white/90 backdrop-blur-sm
                    border border-gray-200/50
                    flex flex-col items-center justify-center
                    shadow-lg
                    transition-all duration-400
                    ${isHovered ? 'shadow-2xl border-gray-300/80' : ''}
                  `}>
                    <div
                      className="text-3xl mb-1 transition-transform duration-300"
                      style={{
                        transform: isHovered ? 'scale(1.2) translateZ(20px)' : 'scale(1) translateZ(0px)'
                      }}
                    >
                      {sign.emoji}
                    </div>
                    <div className="text-[10px] text-gray-400 font-light">{sign.symbol}</div>
                  </div>

                  {/* 星座名称 */}
                  <div
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered
                        ? 'translate(-50%, 0) scale(1)'
                        : 'translate(-50%, -10px) scale(0.9)'
                    }}
                  >
                    <div className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-full border border-gray-200/50 shadow-xl">
                      <div className="text-sm font-medium text-gray-900">{sign.name}</div>
                      <div className="text-xs text-gray-500 text-center">{sign.dates}</div>
                    </div>
                  </div>

                  {/* 星座连线 */}
                  {isHovered && constellationLines[sign.id] && (
                    <svg
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        width: '200px',
                        height: '200px',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: isHovered ? 0.6 : 0,
                        transition: 'opacity 0.5s ease-in-out'
                      }}
                    >
                      {/* 连线 */}
                      {constellationLines[sign.id].map((point, i) => {
                        if (i === 0) return null
                        const prev = constellationLines[sign.id][i - 1]
                        return (
                          <line
                            key={i}
                            x1={prev[0] * 200}
                            y1={prev[1] * 200}
                            x2={point[0] * 200}
                            y2={point[1] * 200}
                            stroke="url(#gradient)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            opacity="0.8"
                            style={{
                              strokeDasharray: 100,
                              strokeDashoffset: 100,
                              animation: 'drawLine 1s ease-out forwards'
                            }}
                          />
                        )
                      })}
                      {/* 星点 */}
                      {constellationLines[sign.id].map((point, i) => (
                        <circle
                          key={`star-${i}`}
                          cx={point[0] * 200}
                          cy={point[1] * 200}
                          r="3"
                          fill="white"
                          opacity="0"
                          style={{
                            animation: `fadeIn 0.3s ease-out ${i * 0.1}s forwards`
                          }}
                        >
                          <animate
                            attributeName="r"
                            values="3;4;3"
                            dur="2s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      ))}
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#9333ea" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                </div>
              </Link>
            )
          })}

          {/* 外圈装饰线 */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{
              width: '100%',
              height: '100%',
              opacity: isLoaded ? 0.15 : 0,
              transition: 'opacity 1.5s ease-in-out 0.5s'
            }}
          >
            <circle
              cx="50%"
              cy="50%"
              r="320"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-gray-400"
              strokeDasharray="4 8"
            />
          </svg>
        </div>

        {/* 底部提示 */}
        <div
          className="text-center mt-20 space-y-6"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s'
          }}
        >
          <p className="text-sm text-gray-400 font-light tracking-wide">
            点击星座查看详细分析 · 滚动鼠标滚轮旋转轮盘
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-full border border-gray-200 transition-all hover:shadow-lg hover:scale-105 font-light"
            >
              返回首页
            </Link>
            <Link
              href="/mbti-test"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full transition-all hover:shadow-xl hover:scale-105 font-light"
            >
              MBTI 测试
            </Link>
          </div>
        </div>
      </div>

      {/* CSS 动画 */}
      <style jsx>{`
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
