'use client'

import { useState, useEffect } from 'react'

export default function TestPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          动画测试页面
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">测试各种毛玻璃悬浮效果</p>
      </div>

      {/* Avatar with floating cards */}
      <div className="flex justify-center items-center py-20">
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
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.4); }
            50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.8); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            25% { transform: translateY(-15px); }
            50% { transform: translateY(0); }
            75% { transform: translateY(-8px); }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes morph {
            0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
            50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          @keyframes flip {
            0% { transform: perspective(400px) rotateY(0); }
            100% { transform: perspective(400px) rotateY(360deg); }
          }
          @keyframes wave {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(20deg); }
            75% { transform: rotate(-15deg); }
          }
          @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
          }
          @keyframes gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
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
          .pulse-glow-effect {
            animation: pulse-glow 2s ease-in-out infinite;
          }
          .bounce-effect {
            animation: bounce 2s ease-in-out infinite;
          }
          .spin-slow-effect {
            animation: spin-slow 8s linear infinite;
          }
          .morph-effect {
            animation: morph 8s ease-in-out infinite;
          }
          .shake-effect {
            animation: shake 0.8s ease-in-out infinite;
          }
          .flip-effect {
            animation: flip 3s ease-in-out infinite;
          }
          .wave-effect {
            animation: wave 1.5s ease-in-out infinite;
            transform-origin: 70% 70%;
            display: inline-block;
          }
          .gradient-text {
            background: linear-gradient(270deg, #ff6b6b, #4ecdc4, #45b7d1, #96c93d);
            background-size: 800% 800%;
            animation: gradient-shift 3s ease infinite;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
        `}</style>

        {/* Avatar with floating cards container */}
        <div className="relative inline-block">
          {/* Left floating card - MBTI */}
          <div className="float-left-card absolute -left-48 top-1/2 -translate-y-1/2 md:block hidden">
            <div className="backdrop-blur-xl bg-white/30 dark:bg-slate-800/30 rounded-2xl p-4 shadow-lg border border-white/20 dark:border-gray-700/30">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧠</span>
                <div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">MBTI</span>
                  <p className="text-xs text-gray-600 dark:text-gray-300">ISTP-T - 鉴赏家</p>
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
          <div className="float-right-card absolute -right-48 top-1/2 -translate-y-1/2 md:block hidden">
            <div className="backdrop-blur-xl bg-white/30 dark:bg-slate-800/30 rounded-2xl p-4 shadow-lg border border-white/20 dark:border-gray-700/30">
              <div className="flex items-center gap-3">
                <img src="/images/libra.png" alt="Libra" className="w-8 h-8 object-contain" />
                <div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">星座</span>
                  <p className="text-xs text-gray-600 dark:text-gray-300">天秤座 (9.26)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top floating card - 音乐爱好 */}
          <div className="float-top-card absolute -top-20 left-1/2 -translate-x-1/2 md:block hidden">
            <div className="backdrop-blur-xl bg-white/30 dark:bg-slate-800/30 rounded-2xl p-4 shadow-lg border border-white/20 dark:border-gray-700/30">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎵</span>
                <div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">音乐爱好</span>
                  <p className="text-xs text-gray-600 dark:text-gray-300">宇多田光 / 黑豹 / 罗大佑</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional test sections */}
      <div className="max-w-6xl mx-auto px-8 py-12 space-y-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">毛玻璃效果对比</h2>

        {/* Different glass effects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="backdrop-blur-sm bg-white/10 rounded-xl p-6 border border-white/10">
            <h3 className="font-semibold mb-2">轻度模糊</h3>
            <p className="text-sm text-gray-600">backdrop-blur-sm + bg-white/10</p>
          </div>

          <div className="backdrop-blur-md bg-white/20 rounded-xl p-6 border border-white/20">
            <h3 className="font-semibold mb-2">中度模糊</h3>
            <p className="text-sm text-gray-600">backdrop-blur-md + bg-white/20</p>
          </div>

          <div className="backdrop-blur-xl bg-white/30 rounded-xl p-6 border border-white/30">
            <h3 className="font-semibold mb-2">强度模糊</h3>
            <p className="text-sm text-gray-600">backdrop-blur-xl + bg-white/30</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">动画效果展示</h2>

        {/* Animation effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Pulse Glow */}
          <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 border border-white/20 text-center">
            <div className="pulse-glow-effect w-20 h-20 mx-auto mb-4 rounded-full bg-pink-400"></div>
            <h3 className="font-semibold">脉冲光晕</h3>
            <p className="text-xs text-gray-600 mt-1">pulse-glow-effect</p>
          </div>

          {/* Bounce */}
          <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 border border-white/20 text-center">
            <div className="bounce-effect text-4xl mb-4">🏀</div>
            <h3 className="font-semibold">弹跳效果</h3>
            <p className="text-xs text-gray-600 mt-1">bounce-effect</p>
          </div>

          {/* Spin */}
          <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 border border-white/20 text-center">
            <div className="spin-slow-effect text-4xl mb-4">⚙️</div>
            <h3 className="font-semibold">慢速旋转</h3>
            <p className="text-xs text-gray-600 mt-1">spin-slow-effect</p>
          </div>

          {/* Morph */}
          <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 border border-white/20 text-center">
            <div className="morph-effect w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-purple-500"></div>
            <h3 className="font-semibold">形态变换</h3>
            <p className="text-xs text-gray-600 mt-1">morph-effect</p>
          </div>

          {/* Shake */}
          <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 border border-white/20 text-center">
            <div className="shake-effect text-4xl mb-4">📱</div>
            <h3 className="font-semibold">抖动效果</h3>
            <p className="text-xs text-gray-600 mt-1">shake-effect</p>
          </div>

          {/* Flip */}
          <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 border border-white/20 text-center">
            <div className="flip-effect text-4xl mb-4">🎴</div>
            <h3 className="font-semibold">3D翻转</h3>
            <p className="text-xs text-gray-600 mt-1">flip-effect</p>
          </div>

          {/* Wave */}
          <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 border border-white/20 text-center">
            <div className="wave-effect text-4xl mb-4">👋</div>
            <h3 className="font-semibold">挥手动画</h3>
            <p className="text-xs text-gray-600 mt-1">wave-effect</p>
          </div>

          {/* Gradient Text */}
          <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 border border-white/20 text-center">
            <div className="gradient-text text-3xl font-bold mb-4">彩虹文字</div>
            <h3 className="font-semibold">渐变流动</h3>
            <p className="text-xs text-gray-600 mt-1">gradient-text</p>
          </div>

          {/* Swing (current avatar) */}
          <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 border border-white/20 text-center">
            <div className="swing-avatar text-4xl mb-4">🎭</div>
            <h3 className="font-semibold">左右摇摆</h3>
            <p className="text-xs text-gray-600 mt-1">swing-avatar</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Hover 交互效果</h2>

        {/* Hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 border border-white/20 text-center transition-transform hover:scale-110 cursor-pointer">
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="font-semibold">放大</h3>
            <p className="text-xs text-gray-600">hover:scale-110</p>
          </div>

          <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 border border-white/20 text-center transition-all hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
            <div className="text-3xl mb-2">⬆️</div>
            <h3 className="font-semibold">上浮</h3>
            <p className="text-xs text-gray-600">hover:-translate-y-2</p>
          </div>

          <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 border border-white/20 text-center transition-all hover:rotate-6 cursor-pointer">
            <div className="text-3xl mb-2">🔄</div>
            <h3 className="font-semibold">倾斜</h3>
            <p className="text-xs text-gray-600">hover:rotate-6</p>
          </div>

          <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 border border-white/20 text-center transition-colors hover:bg-pink-400/40 cursor-pointer">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-semibold">变色</h3>
            <p className="text-xs text-gray-600">hover:bg-pink-400/40</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">🌟 高级特效展示</h2>

        {/* Neon Glow Effects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <style jsx global>{`
            @keyframes neon-pulse {
              0%, 100% {
                box-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff;
              }
              50% {
                box-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 80px #ff00ff;
              }
            }
            @keyframes neon-cyan {
              0%, 100% {
                box-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff;
                text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 20px #00ffff;
              }
              50% {
                box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 80px #00ffff;
                text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff;
              }
            }
            @keyframes border-dance {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes float-3d {
              0%, 100% { transform: translateY(0) rotateX(0deg) rotateY(0deg); }
              25% { transform: translateY(-10px) rotateX(2deg) rotateY(5deg); }
              50% { transform: translateY(-5px) rotateX(0deg) rotateY(-3deg); }
              75% { transform: translateY(-15px) rotateX(-2deg) rotateY(2deg); }
            }
            @keyframes glitch {
              0% { transform: translate(0); }
              20% { transform: translate(-2px, 2px); }
              40% { transform: translate(-2px, -2px); }
              60% { transform: translate(2px, 2px); }
              80% { transform: translate(2px, -2px); }
              100% { transform: translate(0); }
            }
            @keyframes shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            .neon-box {
              animation: neon-pulse 2s ease-in-out infinite;
            }
            .neon-text {
              animation: neon-cyan 2s ease-in-out infinite;
            }
            .dancing-border {
              background: linear-gradient(270deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff);
              background-size: 400% 400%;
              animation: border-dance 3s ease infinite;
              padding: 3px;
            }
            .float-3d-card {
              animation: float-3d 6s ease-in-out infinite;
              transform-style: preserve-3d;
            }
            .glitch-text {
              animation: glitch 0.3s infinite;
            }
            .shimmer-bg {
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
              background-size: 200% 100%;
              animation: shimmer 2s infinite;
            }
          `}</style>

          {/* Neon Box */}
          <div className="bg-black rounded-2xl p-6 text-center">
            <div className="neon-box w-24 h-24 mx-auto mb-4 rounded-lg bg-transparent border-2 border-pink-500"></div>
            <h3 className="font-semibold text-pink-400">霓虹发光</h3>
            <p className="text-xs text-gray-400 mt-1">Cyberpunk 风格</p>
          </div>

          {/* Neon Text */}
          <div className="bg-black rounded-2xl p-6 text-center">
            <div className="neon-text text-3xl font-bold text-cyan-400 mb-4 border-2 border-cyan-400 rounded-lg p-3">
              NEON
            </div>
            <h3 className="font-semibold text-cyan-400">霓虹文字</h3>
            <p className="text-xs text-gray-400 mt-1">发光文字效果</p>
          </div>

          {/* Dancing Border */}
          <div className="dancing-border rounded-2xl">
            <div className="bg-gray-900 rounded-2xl p-6 text-center h-full">
              <div className="text-4xl mb-4">🌈</div>
              <h3 className="font-semibold text-white">流动边框</h3>
              <p className="text-xs text-gray-400 mt-1">彩虹渐变动画</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-12">🎭 3D 变换效果</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 3D Floating Card */}
          <div className="float-3d-card backdrop-blur-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl p-6 border border-white/20 text-center perspective-1000">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="font-semibold text-gray-800">3D 浮动</h3>
            <p className="text-xs text-gray-600 mt-1">立体漂浮效果</p>
          </div>

          {/* Glitch Effect */}
          <div className="backdrop-blur-xl bg-white/30 rounded-2xl p-6 border border-white/20 text-center">
            <div className="glitch-text text-4xl mb-4 text-red-500 font-mono">ERROR</div>
            <h3 className="font-semibold text-gray-800">故障效果</h3>
            <p className="text-xs text-gray-600 mt-1">赛博朋克抖动</p>
          </div>

          {/* Shimmer Effect */}
          <div className="relative backdrop-blur-xl bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl p-6 border border-white/20 text-center overflow-hidden">
            <div className="shimmer-bg absolute inset-0 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-semibold text-white">闪光效果</h3>
              <p className="text-xs text-gray-300 mt-1">金属光泽扫过</p>
            </div>
          </div>

          {/* Tilt Card with Mouse Follow */}
          <div
            className="backdrop-blur-xl bg-gradient-to-br from-blue-500/40 to-cyan-500/40 rounded-2xl p-6 border border-white/30 text-center transition-transform duration-200 hover:shadow-2xl cursor-pointer"
            style={{
              transform: `perspective(1000px) rotateX(${(mousePos.y - 300) / 50}deg) rotateY(${(mousePos.x - 300) / 50}deg)`
            }}
          >
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-semibold text-gray-800">鼠标跟随</h3>
            <p className="text-xs text-gray-600 mt-1">3D透视跟随鼠标</p>
          </div>

          {/* Particle Background Simulation */}
          <div className="relative backdrop-blur-xl bg-black/80 rounded-2xl p-6 border border-white/20 text-center overflow-hidden">
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float-top ${3 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            <div className="relative z-10">
              <div className="text-4xl mb-4">🌌</div>
              <h3 className="font-semibold text-white">粒子效果</h3>
              <p className="text-xs text-gray-300 mt-1">星空背景</p>
            </div>
          </div>

          {/* Gradient Mesh */}
          <div className="relative rounded-2xl p-6 text-center overflow-hidden" style={{
            background: `
              radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%),
              radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%),
              radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%),
              radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%),
              radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%),
              radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%),
              radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)
            `
          }}>
            <div className="backdrop-blur-sm bg-white/20 rounded-xl p-4">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-semibold text-gray-800">渐变网格</h3>
              <p className="text-xs text-gray-600 mt-1">多层径向渐变</p>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600 dark:text-gray-400 mt-8">
          <p className="font-semibold">纯CSS实现的高级特效 - 无需额外依赖</p>
          <p className="text-sm mt-1">霓虹发光 | 3D变换 | 粒子效果 | 渐变网格 | 鼠标跟随</p>
        </div>
      </div>
    </div>
  )
}
