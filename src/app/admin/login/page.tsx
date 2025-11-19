'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FaGithub } from 'react-icons/fa'

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebug = (msg: string) => {
    console.log('[Admin Login]', msg)
    setDebugInfo(prev => [...prev, msg])
  }

  useEffect(() => {
    // Check Supabase config first
    addDebug('Component mounted')
    addDebug(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING'}`)
    addDebug(`Supabase Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'}`)

    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        addDebug('Starting auth session check...')
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          addDebug(`Auth check error: ${error.message}`)
          console.error('Auth check error:', error)
          setChecking(false)
          return
        }

        if (session) {
          addDebug('Session found, redirecting to /admin')
          // Already logged in, redirect to admin
          router.push('/admin')
        } else {
          addDebug('No session found, showing login form')
          setChecking(false)
        }
      } catch (err) {
        addDebug(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`)
        console.error('Unexpected error during auth check:', err)
        setChecking(false)
      }
    }

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      addDebug('Auth check timeout (3s), forcing UI to show')
      console.warn('Auth check timeout, forcing UI to show')
      setChecking(false)
    }, 3000)

    checkAuth().finally(() => clearTimeout(timeout))
  }, [router])

  const handleGitHubLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/admin`
        }
      })

      if (error) {
        console.error('Login error:', error)
        alert('登录失败: ' + error.message)
        setLoading(false)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('发生意外错误')
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
          <div className="text-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <div className="text-white text-lg">检查登录状态...</div>
          </div>
          {/* Debug Info */}
          {debugInfo.length > 0 && (
            <div className="mt-4 text-left">
              <div className="text-xs text-gray-400 mb-2">调试信息：</div>
              <div className="bg-black/30 rounded-lg p-3 max-h-40 overflow-y-auto">
                {debugInfo.map((info, i) => (
                  <div key={i} className="text-xs text-gray-300 font-mono mb-1">
                    {info}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-white mb-2">
            管理后台
          </h1>
          <p className="text-center text-gray-300 mb-8">
            仅限管理员访问
          </p>

          {/* Login Button */}
          <button
            onClick={handleGitHubLogin}
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 shadow-lg"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                登录中...
              </>
            ) : (
              <>
                <FaGithub className="text-2xl" />
                使用 GitHub 登录
              </>
            )}
          </button>

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              此页面仅供授权管理员使用
            </p>
          </div>
        </div>

        {/* Back Link (hidden but accessible) */}
        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            ← 返回首页
          </a>
        </div>
      </div>
    </div>
  )
}
