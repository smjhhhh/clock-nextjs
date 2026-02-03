# Clock-NextJS 项目技术实现详解

> 从零到一,理解这个全栈项目的架构、设计思路和实现细节

---

## 目录

1. [项目整体架构](#1-项目整体架构)
2. [技术栈深度解析](#2-技术栈深度解析)
3. [核心功能实现](#3-核心功能实现)
4. [设计模式与最佳实践](#4-设计模式与最佳实践)
5. [性能优化策略](#5-性能优化策略)
6. [常见问题与解决方案](#6-常见问题与解决方案)

---

## 1. 项目整体架构

### 1.1 架构概览

这是一个基于 **Next.js 16 App Router** 的全栈应用,采用了现代化的前后端分离架构:

```
┌─────────────────────────────────────────────────────┐
│                    用户界面层                        │
│  (React 19 + Tailwind CSS + Framer Motion)          │
└─────────────┬───────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────┐
│                  Next.js App Router                  │
│  • Server Components (服务端渲染)                   │
│  • Client Components ('use client')                  │
│  • API Routes (RESTful API)                         │
└─────────────┬───────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────┐
│              Supabase (后端即服务)                   │
│  • PostgreSQL 数据库                                 │
│  • 身份验证 (OAuth)                                  │
│  • 文件存储 (Photos/Music)                           │
│  • Row Level Security (数据权限)                     │
└─────────────────────────────────────────────────────┘
```

### 1.2 文件结构设计哲学

```
src/
├── app/                    # Next.js 16 App Router
│   ├── layout.tsx         # 根布局 (全局配置)
│   ├── page.tsx           # 首页路由
│   ├── api/               # API 路由 (服务端)
│   ├── [feature]/         # 功能页面 (动态路由)
│   └── globals.css        # 全局样式
├── components/            # React 组件 (可复用)
│   ├── layout/           # 布局组件 (Navbar)
│   ├── [feature]/        # 功能组件
│   └── ...
├── lib/                   # 工具库
│   └── supabase.ts       # Supabase 客户端 + 类型定义
├── contexts/              # React Context (全局状态)
│   └── AuthContext.tsx   # 身份验证状态
└── types/                 # TypeScript 类型定义
    └── os.ts             # macOS 模拟器类型
```

**设计原则:**
- **关注点分离**: 组件、数据、逻辑分离
- **可维护性**: 按功能模块组织代码
- **类型安全**: 完整的 TypeScript 类型定义

---

## 2. 技术栈深度解析

### 2.1 Next.js 16 App Router

#### 为什么选择 App Router?

Next.js 从 13 版本开始引入了 App Router,相比传统的 Pages Router 有以下优势:

1. **Server Components 优先**: 默认服务端渲染,减少客户端 JavaScript
2. **更好的代码分割**: 自动按路由分割代码
3. **流式渲染**: 支持 Suspense 和 Streaming SSR
4. **统一的路由系统**: 文件系统即路由

#### 核心配置 (`next.config.ts`)

```typescript
import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',  // Supabase 存储
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',  // 第三方图片
      },
    ],
  },
};

// PWA 配置 (Progressive Web App)
const withPWA = withPWAInit({
  dest: "public",                      // Service Worker 输出目录
  cacheOnFrontEndNav: true,            // 前端导航时缓存
  aggressiveFrontEndNavCaching: true,  // 激进缓存
  reloadOnOnline: true,                // 网络恢复时重载
  disable: process.env.NODE_ENV === "development",  // 开发环境禁用
});

export default withPWA(nextConfig);
```

**设计思路:**
- **图片优化**: 使用 Next.js Image 组件自动优化图片
- **PWA 支持**: 离线访问能力,提升用户体验
- **开发体验**: 开发环境禁用 PWA 避免缓存问题

#### 根布局 (`src/app/layout.tsx`)

```typescript
import { AuthProvider } from "@/contexts/AuthContext"

export const metadata: Metadata = {
  title: "Shen Mingjie - Portfolio",
  manifest: "/manifest.json",           // PWA manifest
  appleWebApp: {
    capable: true,                       // iOS App 模式
    statusBarStyle: "black-translucent",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,                 // 防止缩放 (App 体验)
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

**关键点:**
- `suppressHydrationWarning`: 避免服务端/客户端渲染不一致警告
- `AuthProvider`: 全局身份验证状态管理
- `metadata`: SEO 和 PWA 配置

### 2.2 Supabase 集成

#### Supabase 是什么?

Supabase 是一个开源的 **Firebase 替代品**,提供:
- PostgreSQL 数据库 (关系型)
- 身份验证 (OAuth, Email, etc.)
- 实时订阅 (WebSocket)
- 文件存储 (S3 兼容)
- Row Level Security (RLS) - 数据库级别权限控制

#### 客户端配置 (`src/lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,           // 持久化会话 (localStorage)
    autoRefreshToken: true,         // 自动刷新 Token
    detectSessionInUrl: true,       // OAuth 回调检测
    storageKey: 'supabase.auth.token',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  }
})
```

**设计思路:**
- **SSR 兼容**: 使用 `typeof window !== 'undefined'` 检测客户端环境
- **会话持久化**: 用户刷新页面不需要重新登录
- **自动刷新**: Token 过期前自动续期

#### 类型定义

```typescript
// 数据库表类型
export type Photo = {
  id: string
  created_at: string
  image_url: string
  title?: string
  description?: string
  latitude?: number
  longitude?: number
  location_name?: string
  // ... EXIF 数据
}

// 前端使用类型
export type Question = {
  id: string
  question: string
  dimension: string
  answerOptions: {
    id: string
    answer: string
    scoreValue: number
  }[]
}
```

**为什么要分离类型?**
- 数据库类型 = 后端字段
- 前端类型 = UI 需要的数据结构
- 解耦前后端,灵活调整

### 2.3 身份验证架构

#### AuthContext 设计 (`src/contexts/AuthContext.tsx`)

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({ /* ... */ })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. 获取当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 2. 监听身份验证变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // 3. 只在加载完成后渲染子组件
  return (
    <AuthContext.Provider value={{ user, loading, signOut, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
```

**设计亮点:**
1. **双重检查**: 初始化时检查 Session + 监听变化
2. **防止闪烁**: `{!loading && children}` 等待加载完成
3. **自动同步**: 跨标签页同步登录状态 (localStorage)

#### OAuth 登录流程

```
用户点击登录
   ↓
跳转到 Supabase OAuth (GitHub/Google)
   ↓
用户授权
   ↓
重定向到 /auth/callback?code=xxx
   ↓
exchangeCodeForSession(code)
   ↓
Session 存储到 localStorage
   ↓
onAuthStateChange 触发
   ↓
AuthContext 更新 user 状态
```

**代码实现** (`src/app/auth/callback/route.ts`):

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/admin', request.url))
}
```

---

## 3. 核心功能实现

### 3.1 相册系统 (Gallery)

#### 功能设计

- ✅ 图片网格展示 + 地图视图切换
- ✅ Lightbox 全屏浏览
- ✅ 无限滚动加载 (分页)
- ✅ EXIF 数据展示 (拍摄时间、相机型号、GPS 坐标)

#### 关键代码 (`src/app/gallery/page.tsx`)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { supabase, Photo } from '@/lib/supabase'
import dynamic from 'next/dynamic'

// 动态导入地图组件 (避免 SSR 问题)
const PhotoMap = dynamic(() => import('@/components/gallery/PhotoMap'), {
  ssr: false,  // Leaflet 需要 window 对象
  loading: () => <div>Loading map...</div>
})

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 12

  // 分页加载
  const fetchPhotos = async (pageNumber = 0) => {
    const from = pageNumber * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('is_public', true)              // RLS: 只查询公开照片
      .order('taken_at', { ascending: false })
      .range(from, to)                    // 分页

    if (data) {
      setPhotos(prev => pageNumber === 0 ? data : [...prev, ...data])
    }
  }

  return (
    <div>
      {/* 视图切换器 */}
      <ViewSwitcher viewMode={viewMode} onChange={setViewMode} />

      {viewMode === 'grid' ? (
        <PhotoGrid photos={photos} onLoadMore={() => fetchPhotos(page + 1)} />
      ) : (
        <PhotoMap photos={photos.filter(p => p.latitude && p.longitude)} />
      )}
    </div>
  )
}
```

**技术亮点:**

1. **动态导入**: `dynamic(() => import(...), { ssr: false })`
   - Leaflet 地图库依赖 `window` 对象
   - 服务端渲染时会报错
   - 动态导入只在客户端加载

2. **分页策略**: `.range(from, to)`
   - 不是一次性加载所有数据
   - 用户滚动时按需加载
   - 节省带宽,提升性能

3. **RLS 安全**: `.eq('is_public', true)`
   - 数据库级别权限控制
   - 即使 API 被绕过,也无法查询私密照片

#### 地图组件实现 (`src/components/gallery/PhotoMap.tsx`)

```typescript
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function PhotoMap({ photos }: { photos: Photo[] }) {
  return (
    <MapContainer
      center={[30, 120]}  // 默认中心点
      zoom={5}
      style={{ height: '600px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {photos.map(photo => (
        photo.latitude && photo.longitude && (
          <Marker key={photo.id} position={[photo.latitude, photo.longitude]}>
            <Popup>
              <img src={photo.image_url} alt={photo.title} width={200} />
              <p>{photo.location_name}</p>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  )
}
```

### 3.2 MBTI 测试系统

#### 数据库设计

```sql
-- 题库表
CREATE TABLE question_bank (
  id UUID PRIMARY KEY,
  question_text TEXT NOT NULL,
  dimension VARCHAR(2),  -- 'EI', 'SN', 'TF', 'JP', 'AT'
  difficulty INT,
  weight DECIMAL
);

-- 测试会话表
CREATE TABLE user_test_sessions (
  id UUID PRIMARY KEY,
  user_id UUID,
  selected_questions UUID[],  -- 随机选择的题目 ID
  mbti_type VARCHAR(5),        -- 'INFP-T'
  total_introvert INT,
  total_sensing INT,
  -- ...
);

-- 用户答案表
CREATE TABLE user_answers (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES user_test_sessions(id),
  question_id UUID,
  selected_option_id UUID,
  answered_at TIMESTAMP
);
```

#### API 实现 (`src/app/api/mbti/create-session/route.ts`)

```typescript
export async function POST(request: Request) {
  // 1. 调用数据库函数创建会话
  const { data: session } = await supabase
    .rpc('create_test_session', {
      p_user_id: userId,
      p_config_id: configId
    })

  // 2. 获取随机选择的题目
  const { data: questions } = await supabase
    .rpc('get_test_questions', {
      p_session_id: session.id
    })

  return NextResponse.json({ session, questions })
}
```

**RPC 函数** (`supabase/02_create_functions.sql`):

```sql
CREATE OR REPLACE FUNCTION create_test_session(
  p_user_id UUID,
  p_config_id UUID
) RETURNS user_test_sessions AS $$
DECLARE
  v_session_id UUID;
  v_questions UUID[];
BEGIN
  -- 1. 创建会话记录
  INSERT INTO user_test_sessions (user_id, config_id)
  VALUES (p_user_id, p_config_id)
  RETURNING id INTO v_session_id;

  -- 2. 随机选择题目 (每个维度 4 题)
  SELECT array_agg(id) INTO v_questions
  FROM (
    SELECT id FROM question_bank
    WHERE dimension = 'EI' AND is_active = true
    ORDER BY random() LIMIT 4
    UNION ALL
    SELECT id FROM question_bank
    WHERE dimension = 'SN' AND is_active = true
    ORDER BY random() LIMIT 4
    -- ... 其他维度
  ) subquery;

  -- 3. 更新会话的题目列表
  UPDATE user_test_sessions
  SET selected_questions = v_questions
  WHERE id = v_session_id;

  RETURN (SELECT * FROM user_test_sessions WHERE id = v_session_id);
END;
$$ LANGUAGE plpgsql;
```

**为什么使用 RPC?**
- ✅ 复杂逻辑在数据库执行 (性能好)
- ✅ 随机选题算法在服务端 (安全)
- ✅ 减少 API 请求次数

#### 前端测试界面 (`src/app/mbti-test/page.tsx`)

```typescript
export default function MBTITestPage() {
  const [sessionId, setSessionId] = useState<string>()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  // 初始化测试
  useEffect(() => {
    createSession()
  }, [])

  const createSession = async () => {
    const res = await fetch('/api/mbti/create-session', { method: 'POST' })
    const { session, questions } = await res.json()
    setSessionId(session.id)
    setQuestions(questions)
  }

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
    setCurrentIndex(prev => prev + 1)
  }

  const submitTest = async () => {
    const res = await fetch('/api/mbti/submit-answers', {
      method: 'POST',
      body: JSON.stringify({ sessionId, answers })
    })
    const { mbtiType, scores } = await res.json()
    // 跳转到结果页
    router.push(`/mbti-analysis/${mbtiType}`)
  }

  return (
    <div>
      <ProgressBar current={currentIndex} total={questions.length} />

      {questions[currentIndex] && (
        <QuestionCard
          question={questions[currentIndex]}
          onAnswer={handleAnswer}
        />
      )}

      {currentIndex === questions.length && (
        <SubmitButton onClick={submitTest} />
      )}
    </div>
  )
}
```

### 3.3 星座系统 (Zodiac)

#### 设计特点

- 🎨 交互式星座轮盘
- ✨ 鼠标跟随粒子效果
- 🌟 悬停时显示星座连线动画
- 📱 静态数据 (无需数据库)

#### 星座轮盘实现 (`src/app/zodiac/page.tsx`)

```typescript
const zodiacSigns = [
  { id: 'aries', name: '白羊座', symbol: '♈', emoji: '🐏', angle: 0, color: 'from-red-500 to-orange-500' },
  { id: 'taurus', name: '金牛座', symbol: '♉', emoji: '🐂', angle: 30, color: 'from-green-600 to-emerald-600' },
  // ... 12 个星座
]

export default function ZodiacWheelPage() {
  const [hoveredSign, setHoveredSign] = useState<string | null>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const [wheelRotation, setWheelRotation] = useState(0)

  // 鼠标移动 - 创建粒子
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.7) {
        setParticles(prev => [...prev.slice(-20), {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1
        }])
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
          .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 0.02 }))
          .filter(p => p.life > 0)
      )
    }, 16)  // 60 FPS
    return () => clearInterval(interval)
  }, [])

  // 滚轮旋转轮盘
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      setWheelRotation(prev => prev + e.deltaY * 0.1)
    }
    window.addEventListener('wheel', handleWheel)
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <div>
      {/* 粒子渲染 */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'fixed',
            left: p.x,
            top: p.y,
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: `rgba(147, 51, 234, ${p.life})`,
            boxShadow: `0 0 ${p.life * 10}px rgba(147, 51, 234, ${p.life})`,
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* 星座轮盘 */}
      <div className="relative w-full aspect-square">
        {zodiacSigns.map((sign, index) => {
          const radius = 320
          const angle = (sign.angle + wheelRotation - 90) * (Math.PI / 180)
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius

          return (
            <Link
              key={sign.id}
              href={`/zodiac/${sign.id}`}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
              }}
              onMouseEnter={() => setHoveredSign(sign.id)}
            >
              <div className={`w-20 h-20 bg-white rounded-2xl shadow-lg ${hoveredSign === sign.id ? 'scale-110' : ''}`}>
                <div className="text-3xl">{sign.emoji}</div>
              </div>

              {/* 悬停时显示星座连线 */}
              {hoveredSign === sign.id && (
                <svg className="absolute inset-0" width="200" height="200">
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
                      key={i}
                      cx={point[0] * 200}
                      cy={point[1] * 200}
                      r="3"
                      fill="white"
                      style={{ animation: `fadeIn 0.3s ease-out ${i * 0.1}s forwards` }}
                    />
                  ))}
                </svg>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
```

**技术亮点:**

1. **圆形布局算法**:
   ```typescript
   const angle = (sign.angle + wheelRotation - 90) * (Math.PI / 180)
   const x = Math.cos(angle) * radius
   const y = Math.sin(angle) * radius
   ```
   - 使用三角函数计算圆周上的坐标
   - `wheelRotation` 控制整体旋转
   - `-90` 调整起始角度 (12 点方向)

2. **粒子系统**:
   - 鼠标移动时 30% 概率生成粒子
   - 每 16ms (60 FPS) 更新粒子位置和透明度
   - `life` 从 1 降到 0,自动消失

3. **SVG 动画**:
   - `strokeDasharray` + `strokeDashoffset` 实现连线绘制动画
   - CSS `animation` 控制渐显效果

### 3.4 macOS 模拟器

#### 系统架构

```typescript
// src/types/os.ts
export interface App {
  id: string
  title: string
  icon: React.ReactNode
  color?: string
  type?: 'app' | 'link'
}

// src/app/os/page.tsx
export default function DesktopPage() {
  const [windows, setWindows] = useState<OpenWindow[]>([])
  const [launchpadOpen, setLaunchpadOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState({ isOpen: false, x: 0, y: 0 })

  const apps: App[] = [
    { id: 'music', title: 'Music', icon: '🎵', color: '#ff006e' },
    { id: 'photos', title: 'Photos', icon: '📷', color: '#06b6d4' },
    // ...
  ]

  const openApp = (appId: string) => {
    setWindows(prev => [...prev, { id: Date.now(), appId, zIndex: maxZ + 1 }])
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* 菜单栏 */}
      <MenuBar onLaunchpadClick={() => setLaunchpadOpen(true)} />

      {/* 桌面 */}
      <div onContextMenu={(e) => {
        e.preventDefault()
        setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY })
      }}>
        {/* 桌面图标 */}
        <DesktopIcon title="Trash" icon="🗑️" />

        {/* 窗口 */}
        {windows.map(win => (
          <Window key={win.id} {...win}>
            {renderAppContent(win.appId)}
          </Window>
        ))}
      </div>

      {/* Dock */}
      <Dock apps={apps} onLaunch={openApp} />

      {/* Launchpad */}
      <Launchpad
        isOpen={launchpadOpen}
        apps={apps}
        onLaunch={(id) => { openApp(id); setLaunchpadOpen(false) }}
        onClose={() => setLaunchpadOpen(false)}
      />

      {/* 右键菜单 */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
        onAction={(action) => console.log(action)}
      />
    </div>
  )
}
```

#### 可拖拽窗口 (`src/components/os/Window.tsx`)

```typescript
import Draggable from 'react-draggable'

export default function Window({ id, title, children, onClose, onFocus, zIndex }: WindowProps) {
  return (
    <Draggable handle=".window-titlebar" bounds="parent">
      <div
        className="absolute bg-white rounded-lg shadow-2xl"
        style={{ zIndex }}
        onClick={onFocus}
      >
        {/* 标题栏 */}
        <div className="window-titlebar flex items-center px-4 py-2 bg-gray-100 rounded-t-lg cursor-move">
          <div className="flex gap-2">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500" />
            <button className="w-3 h-3 rounded-full bg-yellow-500" />
            <button className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 text-center text-sm font-medium">{title}</div>
        </div>

        {/* 内容区 */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </Draggable>
  )
}
```

**Z-index 管理**:

```typescript
const bringToFront = (windowId: number) => {
  setWindows(prev => {
    const maxZ = Math.max(...prev.map(w => w.zIndex))
    return prev.map(w =>
      w.id === windowId ? { ...w, zIndex: maxZ + 1 } : w
    )
  })
}
```

---

## 4. 设计模式与最佳实践

### 4.1 组件设计模式

#### 容器/展示组件分离

```typescript
// 容器组件 (逻辑)
function GalleryContainer() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPhotos()
  }, [])

  if (loading) return <LoadingSpinner />

  return <GalleryView photos={photos} />
}

// 展示组件 (UI)
function GalleryView({ photos }: { photos: Photo[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {photos.map(photo => <PhotoCard key={photo.id} {...photo} />)}
    </div>
  )
}
```

**优点:**
- 逻辑与 UI 分离
- 展示组件可复用
- 易于测试

#### Compound Components (组合组件)

```typescript
// 使用示例
<Card>
  <Card.Header>
    <Card.Title>Gallery</Card.Title>
  </Card.Header>
  <Card.Body>
    <PhotoGrid photos={photos} />
  </Card.Body>
</Card>

// 实现
function Card({ children }: { children: ReactNode }) {
  return <div className="bg-white rounded-lg shadow">{children}</div>
}

Card.Header = ({ children }: { children: ReactNode }) => (
  <div className="border-b px-6 py-4">{children}</div>
)

Card.Title = ({ children }: { children: ReactNode }) => (
  <h2 className="text-xl font-bold">{children}</h2>
)

Card.Body = ({ children }: { children: ReactNode }) => (
  <div className="p-6">{children}</div>
)
```

### 4.2 性能优化

#### 动态导入 (Code Splitting)

```typescript
// ❌ 错误: 所有代码打包在一起
import PhotoMap from '@/components/gallery/PhotoMap'

// ✅ 正确: 按需加载
const PhotoMap = dynamic(() => import('@/components/gallery/PhotoMap'), {
  ssr: false,
  loading: () => <Skeleton />
})
```

#### 图片优化

```typescript
import Image from 'next/image'

// ✅ 使用 Next.js Image 组件
<Image
  src={photo.image_url}
  alt={photo.title}
  width={400}
  height={300}
  loading="lazy"          // 懒加载
  placeholder="blur"      // 模糊占位符
  blurDataURL={photo.thumbnail}
/>

// ❌ 避免直接使用 <img>
<img src={photo.image_url} alt={photo.title} />
```

#### 虚拟化长列表 (可选)

```typescript
import { FixedSizeList } from 'react-window'

function PhotoList({ photos }: { photos: Photo[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={photos.length}
      itemSize={200}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <PhotoCard photo={photos[index]} />
        </div>
      )}
    </FixedSizeList>
  )
}
```

### 4.3 错误处理

#### API 错误处理

```typescript
async function fetchPhotos() {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')

    if (error) {
      // Supabase 错误
      console.error('Database error:', error.message)
      toast.error('Failed to load photos')
      return
    }

    setPhotos(data)
  } catch (err) {
    // 网络错误
    console.error('Network error:', err)
    toast.error('Network error, please try again')
  }
}
```

#### 错误边界 (Error Boundary)

```typescript
'use client'

import { Component, ReactNode } from 'react'

export class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// 使用
<ErrorBoundary fallback={<ErrorPage />}>
  <GalleryPage />
</ErrorBoundary>
```

---

## 5. 性能优化策略

### 5.1 服务端渲染 (SSR) vs 客户端渲染 (CSR)

#### 何时使用 Server Components?

```typescript
// ✅ 服务端组件 (默认)
// 适用于: 静态内容、SEO 重要的页面
export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('articles')
    .select('*')

  return (
    <div>
      {posts.map(post => <BlogCard key={post.id} {...post} />)}
    </div>
  )
}

// ✅ 客户端组件 ('use client')
// 适用于: 交互性强、需要状态管理
'use client'

export default function MBTITestPage() {
  const [answers, setAnswers] = useState({})
  // ...
}
```

### 5.2 数据库查询优化

#### 使用索引

```sql
-- 为常用查询字段创建索引
CREATE INDEX idx_photos_taken_at ON photos (taken_at DESC);
CREATE INDEX idx_photos_is_public ON photos (is_public);
CREATE INDEX idx_photos_trip_id ON photos (trip_id);

-- 复合索引
CREATE INDEX idx_photos_public_date ON photos (is_public, taken_at DESC);
```

#### 限制查询字段

```typescript
// ❌ 查询所有字段
const { data } = await supabase
  .from('photos')
  .select('*')

// ✅ 只查询需要的字段
const { data } = await supabase
  .from('photos')
  .select('id, image_url, title, taken_at')
```

### 5.3 缓存策略

#### Next.js Route Segment Config

```typescript
// app/blog/page.tsx
export const revalidate = 3600  // 1 小时后重新生成

export default async function BlogPage() {
  const posts = await fetchPosts()
  return <BlogList posts={posts} />
}
```

#### PWA 缓存

```typescript
// next.config.ts
const withPWA = withPWAInit({
  cacheOnFrontEndNav: true,          // 前端导航时缓存
  aggressiveFrontEndNavCaching: true, // 激进缓存
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'supabase-images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60  // 1 周
        }
      }
    }
  ]
})
```

---

## 6. 常见问题与解决方案

### Q1: Hydration Mismatch 错误

**问题:** 服务端渲染的 HTML 与客户端不一致

```
Warning: Text content did not match. Server: "0" Client: "5"
```

**原因:**
- 使用 `Date.now()`, `Math.random()` 等在服务端/客户端生成不同值
- 使用 `window`, `localStorage` 等浏览器 API

**解决方案:**

```typescript
// ❌ 错误
function Component() {
  return <div>{Date.now()}</div>
}

// ✅ 正确
function Component() {
  const [now, setNow] = useState<number>()

  useEffect(() => {
    setNow(Date.now())
  }, [])

  return <div>{now ?? 'Loading...'}</div>
}
```

### Q2: Leaflet "window is not defined"

**问题:** Leaflet 需要 `window` 对象,在 SSR 时报错

**解决方案:**

```typescript
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('./Map'), {
  ssr: false,  // 禁用服务端渲染
})
```

### Q3: Supabase RLS 权限问题

**问题:** 即使登录了也无法访问数据

**排查步骤:**

1. 检查 RLS 策略是否启用
   ```sql
   ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
   ```

2. 检查策略是否正确
   ```sql
   -- 所有人可读公开照片
   CREATE POLICY "Public photos are visible to everyone"
   ON photos FOR SELECT
   USING (is_public = true);

   -- 用户只能修改自己的照片
   CREATE POLICY "Users can update own photos"
   ON photos FOR UPDATE
   USING (auth.uid() = user_id);
   ```

3. 检查用户身份
   ```typescript
   const { data: { user } } = await supabase.auth.getUser()
   console.log('Current user:', user?.id)
   ```

### Q4: 图片加载缓慢

**解决方案:**

1. 使用 Next.js Image 优化
2. 启用 Supabase Image Transformation
   ```typescript
   const thumbnailUrl = supabase.storage
     .from('photos')
     .getPublicUrl(path, {
       transform: {
         width: 400,
         height: 300,
         quality: 80
       }
     })
   ```

3. 使用 CDN (Vercel Edge Network 自动启用)

---

## 总结

这个项目展示了如何构建一个现代化的全栈 Web 应用:

### 核心技术栈
- **Next.js 16**: App Router、Server Components、API Routes
- **Supabase**: PostgreSQL、身份验证、文件存储、RLS
- **React 19**: Hooks、Context API
- **Tailwind CSS**: 实用优先的 CSS 框架
- **Framer Motion**: 声明式动画库

### 关键设计决策
1. **App Router over Pages Router**: 更好的性能和开发体验
2. **Supabase over 自建后端**: 快速开发,专注业务逻辑
3. **TypeScript over JavaScript**: 类型安全,减少 bug
4. **RLS over API 权限控制**: 数据库级别安全
5. **动态导入**: 按需加载,减小初始包体积

### 最佳实践
- ✅ 组件设计模式 (容器/展示分离)
- ✅ 性能优化 (SSR、代码分割、图片优化)
- ✅ 错误处理 (Error Boundary、API 错误处理)
- ✅ 类型安全 (完整的 TypeScript 类型定义)
- ✅ 无障碍性 (语义化 HTML、ARIA 属性)

### 下一步学习建议
1. 深入学习 Next.js 缓存机制
2. 掌握 Supabase Realtime 订阅
3. 学习 React 性能优化 (useMemo, useCallback)
4. 探索 E2E 测试 (Playwright)
5. 研究 CI/CD 自动化部署

---

**相关文档:**
- [Next.js 官方文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [React 文档](https://react.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

---

**作者:** Claude Code
**最后更新:** 2026-01-07
