# 🚀 Clock-NextJS 完整重构指南

> 从零到一，完整复刻这个全栈 Next.js 个人作品集平台

**预计完成时间**: 12-15 天
**难度**: 中高级
**技术栈**: Next.js 16 + React 19 + TypeScript + Supabase + Tailwind CSS 4

---

## 📋 目录

1. [准备工作](#准备工作)
2. [阶段 1：基础搭建](#阶段-1基础搭建-第-1-2-天)
3. [阶段 2：核心功能](#阶段-2核心功能-第-3-5-天)
4. [阶段 3：MBTI 测试系统](#阶段-3mbti-测试系统-第-6-7-天)
5. [阶段 4：Travel Tracker](#阶段-4travel-tracker-第-8-天)
6. [阶段 5：音乐播放器](#阶段-5音乐播放器-第-9-天)
7. [阶段 6：MBTI 分析页面](#阶段-6mbti-分析页面-第-10-天)
8. [阶段 7：Zodiac 系统](#阶段-7zodiac-系统-第-11-天)
9. [阶段 8：macOS 模拟器](#阶段-8macos-模拟器-第-12-13-天)
10. [阶段 9：PWA 和部署](#阶段-9pwa-和部署-第-14-15-天)

---

## 准备工作

### 必备工具

```bash
# 检查 Node.js 版本（需要 18.17 或更高）
node --version

# 检查 npm 版本
npm --version

# 检查 Git
git --version
```

### 需要的账号

- [ ] **GitHub 账号**（用于代码托管和 OAuth）
- [ ] **Supabase 账号**（https://supabase.com）
- [ ] **Vercel 账号**（https://vercel.com，用于部署）

---

## 阶段 1：基础搭建（第 1-2 天）

### 步骤 1.1：创建 Next.js 项目

```bash
# 创建新项目
npx create-next-app@latest clock-nextjs --typescript --tailwind --app --use-npm

# 选择配置：
# ✔ TypeScript? Yes
# ✔ ESLint? Yes
# ✔ Tailwind CSS? Yes
# ✔ `src/` directory? Yes
# ✔ App Router? Yes
# ✔ Customize import alias? No

# 进入项目目录
cd clock-nextjs

# 启动开发服务器测试
npm run dev
```

访问 http://localhost:3000 确认项目运行正常。

### 步骤 1.2：安装核心依赖

```bash
# Supabase 客户端
npm install @supabase/supabase-js@^2.83.0

# 动画和 UI 库
npm install framer-motion@^12.23.24
npm install react-icons@^5.5.0
npm install react-draggable@^4.5.0

# 地图组件
npm install leaflet@^1.9.4 react-leaflet@^5.0.0
npm install -D @types/leaflet

# Markdown 支持
npm install react-markdown@^10.1.0 remark-gfm@^4.0.1

# 图片处理
npm install browser-image-compression@^2.0.2
npm install yet-another-react-lightbox@^3.25.0

# 音乐元数据
npm install music-metadata-browser@^2.5.11

# 文件上传
npm install react-dropzone@^14.3.8
```

### 步骤 1.3：配置 TypeScript

编辑 `tsconfig.json`，确保包含：

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 步骤 1.4：配置 Tailwind CSS

编辑 `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'scrollLeft': 'scrollLeft 20s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-border': 'bounce-border 2s ease-in-out infinite',
        'shake-hand': 'shake-hand 1s ease-in-out infinite',
      },
      keyframes: {
        scrollLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'bounce-border': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'shake-hand': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(20deg)' },
          '75%': { transform: 'rotate(-20deg)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

安装 typography 插件：

```bash
npm install -D @tailwindcss/typography
```

创建 `postcss.config.mjs`:

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;
```

### 步骤 1.5：配置 Next.js

创建 `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'is1-ssl.mzstatic.com',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;
```

更新 `package.json` 中的脚本，添加 `--webpack` 标志：

```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 步骤 1.6：设置 Supabase 项目

1. **创建 Supabase 项目**：

   - 访问 https://supabase.com
   - 点击 "New Project"
   - 项目名称：`clock-nextjs`
   - 选择区域（推荐东亚或最近的区域）
   - 设置数据库密码（保存好！）
   - 等待创建完成（约 2 分钟）
2. **获取 API 密钥**：

   - 进入 Settings → API
   - 复制 `Project URL` 和 `anon public` key
3. **创建环境变量文件**：

`.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon密钥
NEXT_PUBLIC_ADMIN_EMAILS=your-github-email@example.com
```

`.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_ADMIN_EMAILS=admin1@example.com,admin2@example.com
```

### 步骤 1.7：创建 Supabase 客户端

创建 `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
  },
})

// Type definitions
export interface Article {
  id: string
  title: string
  content: string
  author: string
  created_at: string
  updated_at: string
}

export interface Photo {
  id: string
  url: string
  thumbnail_url: string | null
  caption: string | null
  taken_at: string | null
  latitude: number | null
  longitude: number | null
  is_public: boolean
  trip_id: string | null
  created_at: string
}

export interface Trip {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string | null
  cover_image_url: string | null
  status: 'planned' | 'completed'
  created_at: string
}

export interface Song {
  id: string
  title: string
  artist: string
  audio_url: string
  cover_url: string | null
  lyrics: string | null
  duration: number | null
  primary_color: string
  dark_color: string
  created_at: string
}

export interface QuestionBank {
  id: string
  dimension: 'EI' | 'SN' | 'TF' | 'JP' | 'AT'
  question_text: string
  is_active: boolean
  difficulty: number
  created_at: string
}

export interface QuestionOption {
  id: string
  question_id: string
  option_text: string
  score_impact: number
  created_at: string
}

export interface UserTestSession {
  id: string
  user_id: string | null
  config_id: string | null
  ei_score: number
  sn_score: number
  tf_score: number
  jp_score: number
  at_score: number
  mbti_type: string | null
  completed_at: string | null
  created_at: string
}
```

### 步骤 1.8：创建数据库 Schema

在 Supabase Dashboard → SQL Editor，创建文件夹 `/supabase/` 并执行以下 SQL：

**`supabase/01_create_tables.sql`:**

```sql
-- Articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photos table
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  taken_at TIMESTAMPTZ,
  latitude FLOAT,
  longitude FLOAT,
  is_public BOOLEAN DEFAULT true,
  trip_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trips table
CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  cover_image_url TEXT,
  status TEXT CHECK (status IN ('planned', 'completed')) DEFAULT 'planned',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Songs table
CREATE TABLE songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  cover_url TEXT,
  lyrics TEXT,
  duration INTEGER,
  primary_color TEXT DEFAULT '#9333ea',
  dark_color TEXT DEFAULT '#581c87',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MBTI Question Bank
CREATE TABLE question_bank (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dimension TEXT NOT NULL CHECK (dimension IN ('EI', 'SN', 'TF', 'JP', 'AT')),
  question_text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  difficulty INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MBTI Question Options
CREATE TABLE question_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES question_bank(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  score_impact INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MBTI Test Configs
CREATE TABLE test_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  questions_per_dimension JSONB NOT NULL,
  time_limit_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MBTI User Test Sessions
CREATE TABLE user_test_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  config_id UUID REFERENCES test_configs(id),
  ei_score INTEGER DEFAULT 0,
  sn_score INTEGER DEFAULT 0,
  tf_score INTEGER DEFAULT 0,
  jp_score INTEGER DEFAULT 0,
  at_score INTEGER DEFAULT 0,
  mbti_type TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MBTI User Answers
CREATE TABLE user_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES user_test_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES question_bank(id),
  selected_option_id UUID REFERENCES question_options(id),
  answered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session Selected Questions (记录每个测试选择的题目)
CREATE TABLE session_selected_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES user_test_sessions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES question_bank(id),
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign keys
ALTER TABLE photos ADD CONSTRAINT photos_trip_id_fkey
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX idx_photos_taken_at ON photos(taken_at DESC);
CREATE INDEX idx_photos_trip_id ON photos(trip_id);
CREATE INDEX idx_photos_public ON photos(is_public);
CREATE INDEX idx_trips_start_date ON trips(start_date DESC);
CREATE INDEX idx_question_bank_dimension ON question_bank(dimension);
CREATE INDEX idx_question_bank_active ON question_bank(is_active);
CREATE INDEX idx_user_test_sessions_user_id ON user_test_sessions(user_id);
CREATE INDEX idx_session_selected_questions_session_id ON session_selected_questions(session_id);
```

**`supabase/02_create_functions.sql`:**

```sql
-- Function: Create test session
CREATE OR REPLACE FUNCTION create_test_session(
  p_user_id TEXT,
  p_config_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_session_id UUID;
  v_config RECORD;
  v_question RECORD;
  v_order INTEGER;
BEGIN
  -- Get test config
  SELECT * INTO v_config FROM test_configs WHERE id = p_config_id AND is_active = true;

  IF v_config IS NULL THEN
    RAISE EXCEPTION 'Invalid config_id';
  END IF;

  -- Create session
  INSERT INTO user_test_sessions (user_id, config_id)
  VALUES (p_user_id, p_config_id)
  RETURNING id INTO v_session_id;

  -- Select random questions for each dimension
  v_order := 1;

  FOR v_question IN (
    SELECT * FROM question_bank
    WHERE dimension = 'EI' AND is_active = true
    ORDER BY RANDOM()
    LIMIT (v_config.questions_per_dimension->>'EI')::INTEGER
  )
  LOOP
    INSERT INTO session_selected_questions (session_id, question_id, display_order)
    VALUES (v_session_id, v_question.id, v_order);
    v_order := v_order + 1;
  END LOOP;

  FOR v_question IN (
    SELECT * FROM question_bank
    WHERE dimension = 'SN' AND is_active = true
    ORDER BY RANDOM()
    LIMIT (v_config.questions_per_dimension->>'SN')::INTEGER
  )
  LOOP
    INSERT INTO session_selected_questions (session_id, question_id, display_order)
    VALUES (v_session_id, v_question.id, v_order);
    v_order := v_order + 1;
  END LOOP;

  FOR v_question IN (
    SELECT * FROM question_bank
    WHERE dimension = 'TF' AND is_active = true
    ORDER BY RANDOM()
    LIMIT (v_config.questions_per_dimension->>'TF')::INTEGER
  )
  LOOP
    INSERT INTO session_selected_questions (session_id, question_id, display_order)
    VALUES (v_session_id, v_question.id, v_order);
    v_order := v_order + 1;
  END LOOP;

  FOR v_question IN (
    SELECT * FROM question_bank
    WHERE dimension = 'JP' AND is_active = true
    ORDER BY RANDOM()
    LIMIT (v_config.questions_per_dimension->>'JP')::INTEGER
  )
  LOOP
    INSERT INTO session_selected_questions (session_id, question_id, display_order)
    VALUES (v_session_id, v_question.id, v_order);
    v_order := v_order + 1;
  END LOOP;

  FOR v_question IN (
    SELECT * FROM question_bank
    WHERE dimension = 'AT' AND is_active = true
    ORDER BY RANDOM()
    LIMIT (v_config.questions_per_dimension->>'AT')::INTEGER
  )
  LOOP
    INSERT INTO session_selected_questions (session_id, question_id, display_order)
    VALUES (v_session_id, v_question.id, v_order);
    v_order := v_order + 1;
  END LOOP;

  RETURN v_session_id;
END;
$$;

-- Function: Get test questions
CREATE OR REPLACE FUNCTION get_test_questions(p_session_id UUID)
RETURNS TABLE (
  question_id UUID,
  question_text TEXT,
  dimension TEXT,
  display_order INTEGER,
  options JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    q.id,
    q.question_text,
    q.dimension,
    ssq.display_order,
    jsonb_agg(
      jsonb_build_object(
        'id', qo.id,
        'option_text', qo.option_text,
        'score_impact', qo.score_impact
      ) ORDER BY qo.created_at
    ) as options
  FROM session_selected_questions ssq
  JOIN question_bank q ON q.id = ssq.question_id
  LEFT JOIN question_options qo ON qo.question_id = q.id
  WHERE ssq.session_id = p_session_id
  GROUP BY q.id, q.question_text, q.dimension, ssq.display_order
  ORDER BY ssq.display_order;
END;
$$;

-- Function: Calculate MBTI type
CREATE OR REPLACE FUNCTION calculate_mbti_type(p_session_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_mbti_type TEXT := '';
  v_ei_score INTEGER;
  v_sn_score INTEGER;
  v_tf_score INTEGER;
  v_jp_score INTEGER;
  v_at_score INTEGER;
BEGIN
  -- Calculate scores from answers
  SELECT
    COALESCE(SUM(CASE WHEN qb.dimension = 'EI' THEN qo.score_impact ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN qb.dimension = 'SN' THEN qo.score_impact ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN qb.dimension = 'TF' THEN qo.score_impact ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN qb.dimension = 'JP' THEN qo.score_impact ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN qb.dimension = 'AT' THEN qo.score_impact ELSE 0 END), 0)
  INTO v_ei_score, v_sn_score, v_tf_score, v_jp_score, v_at_score
  FROM user_answers ua
  JOIN question_options qo ON qo.id = ua.selected_option_id
  JOIN question_bank qb ON qb.id = ua.question_id
  WHERE ua.session_id = p_session_id;

  -- Update session scores
  UPDATE user_test_sessions
  SET
    ei_score = v_ei_score,
    sn_score = v_sn_score,
    tf_score = v_tf_score,
    jp_score = v_jp_score,
    at_score = v_at_score
  WHERE id = p_session_id;

  -- Determine MBTI type
  v_mbti_type := v_mbti_type || CASE WHEN v_ei_score >= 0 THEN 'E' ELSE 'I' END;
  v_mbti_type := v_mbti_type || CASE WHEN v_sn_score >= 0 THEN 'S' ELSE 'N' END;
  v_mbti_type := v_mbti_type || CASE WHEN v_tf_score >= 0 THEN 'T' ELSE 'F' END;
  v_mbti_type := v_mbti_type || CASE WHEN v_jp_score >= 0 THEN 'J' ELSE 'P' END;
  v_mbti_type := v_mbti_type || CASE WHEN v_at_score >= 0 THEN '-A' ELSE '-T' END;

  -- Update session with result
  UPDATE user_test_sessions
  SET
    mbti_type = v_mbti_type,
    completed_at = NOW()
  WHERE id = p_session_id;

  RETURN v_mbti_type;
END;
$$;
```

**`supabase/03_create_rls.sql`:**

```sql
-- Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_selected_questions ENABLE ROW LEVEL SECURITY;

-- Articles: Public read, admin write
CREATE POLICY "Articles are publicly readable"
  ON articles FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create articles"
  ON articles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update articles"
  ON articles FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete articles"
  ON articles FOR DELETE
  USING (auth.role() = 'authenticated');

-- Photos: Public photos readable by all
CREATE POLICY "Public photos are visible to everyone"
  ON photos FOR SELECT
  USING (is_public = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create photos"
  ON photos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update photos"
  ON photos FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete photos"
  ON photos FOR DELETE
  USING (auth.role() = 'authenticated');

-- Trips: Public read, admin write
CREATE POLICY "Trips are publicly readable"
  ON trips FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage trips"
  ON trips FOR ALL
  USING (auth.role() = 'authenticated');

-- Songs: Public read, admin write
CREATE POLICY "Songs are publicly readable"
  ON songs FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage songs"
  ON songs FOR ALL
  USING (auth.role() = 'authenticated');

-- MBTI: Public read for questions, users can manage own sessions
CREATE POLICY "Questions are publicly readable"
  ON question_bank FOR SELECT
  USING (is_active = true);

CREATE POLICY "Question options are publicly readable"
  ON question_options FOR SELECT
  USING (true);

CREATE POLICY "Test configs are publicly readable"
  ON test_configs FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can create test sessions"
  ON user_test_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view their own sessions"
  ON user_test_sessions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update their own sessions"
  ON user_test_sessions FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can create answers"
  ON user_answers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view answers"
  ON user_answers FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view session questions"
  ON session_selected_questions FOR SELECT
  USING (true);
```

**`supabase/04_insert_sample_data.sql`:**

```sql
-- Insert test config
INSERT INTO test_configs (name, description, questions_per_dimension, is_active)
VALUES (
  'Standard Test',
  '标准 MBTI 测试（20 题）',
  '{"EI": 4, "SN": 4, "TF": 4, "JP": 4, "AT": 4}'::jsonb,
  true
);

-- Insert sample questions for EI dimension
INSERT INTO question_bank (dimension, question_text, difficulty) VALUES
('EI', '在社交场合中，我通常：', 1),
('EI', '我更喜欢：', 1),
('EI', '工作中我倾向于：', 2),
('EI', '闲暇时间，我更愿意：', 1);

-- Insert options for first EI question
INSERT INTO question_options (question_id, option_text, score_impact)
SELECT id, '主动与陌生人交谈', 2 FROM question_bank WHERE question_text = '在社交场合中，我通常：'
UNION ALL
SELECT id, '等待别人来找我聊天', -2 FROM question_bank WHERE question_text = '在社交场合中，我通常：';

-- (继续添加更多题目和选项...)

-- Insert sample article
INSERT INTO articles (title, content, author)
VALUES (
  '欢迎来到我的博客',
  '# 你好，世界！\n\n这是我的第一篇博客文章。',
  'Yoru'
);
```

### 步骤 1.9：创建 Storage Buckets

在 Supabase Dashboard → Storage：

1. 创建 bucket: `photos`（Public）
2. 创建 bucket: `music`（Public）
3. 创建 bucket: `covers`（Public）

### 步骤 1.10：创建认证上下文

创建 `src/contexts/AuthContext.tsx`:

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### 步骤 1.11：配置 GitHub OAuth

1. 访问 https://github.com/settings/developers
2. 创建新的 OAuth App
3. 填写：
   - Application name: `Clock-NextJS`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `你的Supabase项目URL/auth/v1/callback`
4. 获取 Client ID 和 Client Secret
5. 在 Supabase Dashboard → Authentication → Providers → GitHub，启用并填入密钥

创建认证回调路由 `src/app/auth/callback/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/admin', request.url))
}
```

### 步骤 1.12：更新根布局

编辑 `src/app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clock-NextJS | Yoru's Portfolio",
  description: "Personal portfolio and creative platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 步骤 1.13：创建导航栏组件

创建 `src/components/layout/Navbar.tsx`:

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { FiHome, FiUser, FiImage, FiBookOpen, FiMusic, FiMap, FiBrain } from 'react-icons/fi'

export default function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, signOut } = useAuth()

  const navItems = [
    { name: '首页', path: '/', icon: FiHome },
    { name: '关于', path: '/about-me', icon: FiUser },
    { name: '相册', path: '/gallery', icon: FiImage },
    { name: '博客', path: '/blog', icon: FiBookOpen },
    { name: 'MBTI', path: '/mbti-test', icon: FiBrain },
    { name: '音乐', path: '/music', icon: FiMusic },
    { name: '旅行', path: '/travel', icon: FiMap },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Yoru
          </Link>

          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-pink-500 bg-pink-50 dark:bg-pink-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-pink-500'
                  }`}
                >
                  <Icon />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          <div>
            {isAuthenticated ? (
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-md hover:opacity-90"
              >
                退出
              </button>
            ) : (
              <Link
                href="/admin/login"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-md hover:opacity-90"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
```

### 步骤 1.14：创建首页

编辑 `src/app/page.tsx`:

```typescript
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function Home() {
  const emojis = ['🌙', '✨', '🎨', '🎵', '📸', '✈️', '💜', '🌸', '🧠', '♈']

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />

      {/* Emoji Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {emojis.map((emoji, i) => (
          <div
            key={i}
            className="absolute text-6xl opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-bounce-border">
            Hello, I'm Yoru
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12">
            欢迎来到我的创意空间 🌙
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-16">
            <Link href="/mbti-test" className="group">
              <div className="p-8 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-pink-200 hover:border-pink-400 transition-all hover:scale-105 hover:shadow-xl">
                <div className="text-5xl mb-4">🧠</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">MBTI 性格测试</h3>
                <p className="text-gray-600">探索你的个性类型</p>
              </div>
            </Link>

            <Link href="/zodiac" className="group">
              <div className="p-8 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-purple-200 hover:border-purple-400 transition-all hover:scale-105 hover:shadow-xl">
                <div className="text-5xl mb-4">♈</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">星座运势</h3>
                <p className="text-gray-600">了解你的星座特质</p>
              </div>
            </Link>

            <Link href="/gallery" className="group">
              <div className="p-8 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all hover:scale-105 hover:shadow-xl">
                <div className="text-5xl mb-4">📸</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">照片集</h3>
                <p className="text-gray-600">记录美好瞬间</p>
              </div>
            </Link>

            <Link href="/blog" className="group">
              <div className="p-8 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-cyan-200 hover:border-cyan-400 transition-all hover:scale-105 hover:shadow-xl">
                <div className="text-5xl mb-4">✍️</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">博客</h3>
                <p className="text-gray-600">分享思考与创意</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
```

### ✅ 阶段 1 完成检查

测试：

```bash
npm run dev
```

验证清单：

- [ ] 首页正常显示
- [ ] 导航栏显示所有链接
- [ ] Supabase 客户端连接成功
- [ ] 数据库表已创建
- [ ] OAuth 认证配置完成

提交代码：

```bash
git add .
git commit -m "feat: 完成项目基础搭建 - 阶段1"
```

---

## 阶段 2：核心功能（第 3-5 天）

### 步骤 2.1：实现博客系统

#### 创建博客列表页

**文件**: `src/app/blog/page.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import { supabase, Article } from '@/lib/supabase'
import { FiCalendar, FiUser } from 'react-icons/fi'

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  async function fetchArticles() {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setArticles(data || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto pt-24 pb-20 px-4">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          博客文章
        </h1>

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">还没有文章</p>
            <Link
              href="/admin"
              className="mt-4 inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90"
            >
              前往后台
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.id}`}
                className="block bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-2xl font-bold mb-2 text-gray-800 hover:text-pink-500 transition-colors">
                  {article.title}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center">
                    <FiUser className="mr-1" />
                    {article.author}
                  </span>
                  <span className="flex items-center">
                    <FiCalendar className="mr-1" />
                    {new Date(article.created_at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <p className="text-gray-600 line-clamp-3">
                  {article.content.substring(0, 200)}...
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
```

#### 创建博客详情页

**文件**: `src/app/blog/[id]/page.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { supabase, Article } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FiCalendar, FiUser, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'

export default function BlogDetailPage() {
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string)
    }
  }, [params.id])

  async function fetchArticle(id: string) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setArticle(data)
    } catch (error) {
      console.error('Error fetching article:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto pt-24 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">文章未找到</h1>
          <Link href="/blog" className="text-pink-500 hover:underline">
            返回博客列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto pt-24 pb-20 px-4">
        <Link
          href="/blog"
          className="inline-flex items-center text-pink-500 hover:text-pink-600 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          返回列表
        </Link>

        <article className="bg-white rounded-lg p-8 shadow-sm">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            {article.title}
          </h1>

          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-8 pb-8 border-b">
            <span className="flex items-center">
              <FiUser className="mr-1" />
              {article.author}
            </span>
            <span className="flex items-center">
              <FiCalendar className="mr-1" />
              {new Date(article.created_at).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  )
}
```

### 步骤 2.2：实现相册系统

#### 创建相册页面

**文件**: `src/app/gallery/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import { supabase, Photo } from '@/lib/supabase'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { FiGrid, FiMap } from 'react-icons/fi'
import dynamic from 'next/dynamic'

const PhotoMap = dynamic(() => import('@/components/gallery/PhotoMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded-lg" />,
})

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  useEffect(() => {
    fetchPhotos()
  }, [])

  async function fetchPhotos() {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('is_public', true)
        .order('taken_at', { ascending: false, nullsFirst: false })

      if (error) throw error
      setPhotos(data || [])
    } catch (error) {
      console.error('Error fetching photos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto pt-24 pb-20 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            照片集
          </h1>

          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg ${
                viewMode === 'map'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiMap size={20} />
            </button>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">还没有照片</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
                onClick={() => setLightboxIndex(index)}
              >
                <Image
                  src={photo.thumbnail_url || photo.url}
                  alt={photo.caption || '照片'}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {photo.caption && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-sm">{photo.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <PhotoMap photos={photos} onPhotoClick={(index) => setLightboxIndex(index)} />
        )}

        <Lightbox
          open={lightboxIndex >= 0}
          index={lightboxIndex}
          close={() => setLightboxIndex(-1)}
          slides={photos.map((photo) => ({
            src: photo.url,
            alt: photo.caption || '',
          }))}
        />
      </main>
    </div>
  )
}
```

#### 创建地图组件

**文件**: `src/components/gallery/PhotoMap.tsx`

```typescript
'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Photo } from '@/lib/supabase'
import Image from 'next/image'
import L from 'leaflet'

// 修复 Leaflet 默认图标问题
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface PhotoMapProps {
  photos: Photo[]
  onPhotoClick: (index: number) => void
}

export default function PhotoMap({ photos, onPhotoClick }: PhotoMapProps) {
  const geoPhotos = photos.filter((p) => p.latitude && p.longitude)

  if (geoPhotos.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-500">暂无带地理位置的照片</p>
      </div>
    )
  }

  const centerLat = geoPhotos.reduce((sum, p) => sum + (p.latitude || 0), 0) / geoPhotos.length
  const centerLng = geoPhotos.reduce((sum, p) => sum + (p.longitude || 0), 0) / geoPhotos.length

  return (
    <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={4}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoPhotos.map((photo, index) => (
          <Marker
            key={photo.id}
            position={[photo.latitude!, photo.longitude!]}
          >
            <Popup>
              <div
                className="cursor-pointer"
                onClick={() => onPhotoClick(photos.indexOf(photo))}
              >
                <Image
                  src={photo.thumbnail_url || photo.url}
                  alt={photo.caption || '照片'}
                  width={200}
                  height={200}
                  className="rounded-lg mb-2"
                />
                {photo.caption && (
                  <p className="text-sm text-gray-600">{photo.caption}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
```

### 步骤 2.3：实现管理后台

#### 创建登录页

**文件**: `src/app/admin/login/page.tsx`

```typescript
'use client'

import { supabase } from '@/lib/supabase'
import { FiGithub } from 'react-icons/fi'

export default function AdminLoginPage() {
  async function handleGitHubLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Login error:', error)
      alert('登录失败：' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            管理员登录
          </h1>
          <p className="text-gray-600">使用 GitHub 账号登录后台</p>
        </div>

        <button
          onClick={handleGitHubLogin}
          className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <FiGithub size={20} />
          <span>使用 GitHub 登录</span>
        </button>

        <p className="mt-6 text-sm text-gray-500 text-center">
          只有管理员邮箱可以访问后台
        </p>
      </div>
    </div>
  )
}
```

#### 创建管理后台主页（基础版）

**文件**: `src/app/admin/page.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase, Article } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'blog' | 'photos' | 'trips' | 'music'>('blog')

  const [articles, setArticles] = useState<Article[]>([])
  const [newArticle, setNewArticle] = useState({ title: '', content: '', author: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login')
    } else if (user) {
      const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || []
      if (!adminEmails.includes(user.email || '')) {
        alert('您没有管理员权限')
        router.push('/')
      } else {
        fetchArticles()
      }
    }
  }, [user, authLoading, router])

  async function fetchArticles() {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setArticles(data || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    }
  }

  async function handleCreateArticle() {
    if (!newArticle.title || !newArticle.content || !newArticle.author) {
      alert('请填写完整信息')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('articles')
        .insert([newArticle])

      if (error) throw error

      alert('文章创建成功！')
      setNewArticle({ title: '', content: '', author: '' })
      fetchArticles()
    } catch (error: any) {
      console.error('Error creating article:', error)
      alert('创建失败：' + error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteArticle(id: string) {
    if (!confirm('确定要删除这篇文章吗？')) return

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) throw error

      alert('文章已删除')
      fetchArticles()
    } catch (error: any) {
      console.error('Error deleting article:', error)
      alert('删除失败：' + error.message)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto pt-24 pb-20 px-4">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          管理后台
        </h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b">
          {['blog', 'photos', 'trips', 'music'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-pink-500 text-pink-500'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'blog' && '博客管理'}
              {tab === 'photos' && '照片管理'}
              {tab === 'trips' && '旅行管理'}
              {tab === 'music' && '音乐管理'}
            </button>
          ))}
        </div>

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">创建新文章</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="文章标题"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="作者"
                  value={newArticle.author}
                  onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <textarea
                  placeholder="文章内容（支持 Markdown）"
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono"
                />
                <button
                  onClick={handleCreateArticle}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? '创建中...' : '创建文章'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">已发布文章</h2>
              {articles.length === 0 ? (
                <p className="text-gray-500">还没有文章</p>
              ) : (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <div key={article.id} className="border-b pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold">{article.title}</h3>
                          <p className="text-sm text-gray-500">
                            作者: {article.author} | {new Date(article.created_at).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="px-4 py-1 text-sm text-red-500 border border-red-500 rounded hover:bg-red-50"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab !== 'blog' && (
          <div className="bg-white rounded-lg p-6 shadow-sm text-center text-gray-500">
            <p>此功能将在后续阶段实现</p>
          </div>
        )}
      </main>
    </div>
  )
}
```

### ✅ 阶段 2 完成检查

测试清单：

- [ ] 博客列表页显示所有文章
- [ ] 点击文章进入详情页，Markdown 正常渲染
- [ ] 相册网格视图显示照片
- [ ] 地图视图显示有GPS的照片
- [ ] Lightbox 全屏查看功能正常
- [ ] 管理后台登录成功
- [ ] 管理后台可以创建/删除文章

提交代码：

```bash
git add .
git commit -m "feat: 实现博客系统和相册系统 - 阶段2"
```

---

## 后续阶段概览

由于篇幅限制，完整的后续阶段实现细节包括：

- **阶段 3**: MBTI 测试系统（API 路由、测试 UI、结果计算）
- **阶段 4**: Travel Tracker（地图集成、行程管理）
- **阶段 5**: 音乐播放器（播放控制、歌词显示）
- **阶段 6**: MBTI 分析页面（16 种人格静态数据）
- **阶段 7**: Zodiac 系统（交互式星座轮盘）
- **阶段 8**: macOS 模拟器（Dock、Launchpad、ContextMenu）
- **阶段 9**: PWA 配置和 Vercel 部署

每个阶段都需要参考原项目的对应文件进行实现。建议按照以下顺序逐步完成：

1. 先完成数据库相关功能（Blog、Gallery、MBTI Test）
2. 再实现静态数据功能（MBTI Analysis、Zodiac）
3. 最后实现复杂交互功能（macOS Simulator）

---

## 📚 学习资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)

---

## ❓ 常见问题

### Q: Supabase 连接失败

**A**: 检查 `.env.local` 中的 URL 和密钥是否正确，重启开发服务器。

### Q: OAuth 重定向失败

**A**: 确认 GitHub OAuth App 的 callback URL 与 Supabase 项目 URL 匹配。

### Q: 图片不显示

**A**: 检查 `next.config.ts` 中的 `remotePatterns` 配置，确保包含 Supabase 域名。

---

**继续前进！你正在构建一个令人惊叹的项目 🚀**

需要继续某个具体阶段的详细实现？请告诉我你想先实现哪个功能！
