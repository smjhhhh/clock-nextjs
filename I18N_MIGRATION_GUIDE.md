# 多语言国际化 (i18n) 迁移指南

**创建日期**: 2026-01-23
**状态**: 基础设施已完成，页面迁移进行中

---

## ✅ 已完成的工作

### 1. 基础设施搭建
- ✅ 安装 `next-intl` 库
- ✅ 创建翻译文件: `src/locales/{zh,en,ja}.json`
- ✅ 配置 `src/i18n.ts` (语言配置)
- ✅ 配置 `middleware.ts` (自动语言检测)
- ✅ 更新 `next.config.ts` (添加 next-intl 插件)
- ✅ 创建 `[locale]` 动态路由结构
- ✅ 创建 `LanguageSwitcher` 组件

### 2. URL 结构变化
**之前**: `/about-me`, `/blog`, `/gallery`
**之后**: `/zh/about-me`, `/en/about-me`, `/ja/about-me`

- 根路径 `/` 自动检测浏览器语言并重定向到对应语言
- 用户可以通过语言切换器手动切换

---

## 📋 下一步工作清单

### 优先级 P0: 导航栏和首页

#### 任务 1: 更新 Navbar 组件 ⚠️ **重要**

**文件**: `src/components/layout/Navbar.tsx`

**当前问题**:
- 导航链接是硬编码的英文
- 链接不包含语言前缀 (需要 `/zh/`, `/en/`, `/ja/`)

**修改步骤**:

1. **添加客户端指令和导入**:
```typescript
'use client'  // 在文件顶部添加

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/navigation'  // 稍后创建
```

2. **使用翻译**:
```typescript
export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/about-me', label: t('aboutMe') },
    { href: '/gallery', label: t('gallery') },
    { href: '/blog', label: t('blog') },
    { href: '/mbti-test', label: t('mbtiTest') },
    // ... 其他项
  ]

  // 渲染部分
}
```

3. **添加语言切换器**:
```typescript
import LanguageSwitcher from '@/components/LanguageSwitcher'

// 在 Navbar 的合适位置添加
<LanguageSwitcher />
```

#### 任务 2: 创建国际化导航组件

**文件**: `src/navigation.ts` (新建)

```typescript
import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { locales } from './i18n'

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales })
```

**用途**: 这个组件会自动为所有链接添加语言前缀。

#### 任务 3: 迁移首页到 [locale]

**步骤**:

1. **复制现有首页**:
```bash
cp src/app/page.tsx src/app/[locale]/page.tsx
```

2. **添加翻译使用**:
```typescript
'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'

export default function LandingPage() {
  const t = useTranslations('landing')

  const config = {
    name: 'Yoru',
    title: t('subtitle'),
    // ... 其他配置
    buttons: [
      { text: '👋 ' + t('mbtiCard.title'), link: '/mbti-test' },
      // ...
    ]
  }

  // ... 其余代码
}
```

3. **更新根页面** (`src/app/page.tsx`):
```typescript
import { redirect } from 'next/navigation'

export default function RootPage() {
  // 重定向到默认语言
  redirect('/zh')
}
```

---

### 优先级 P1: 主要功能页面

#### 任务 4-7: 迁移主要页面

需要将以下目录迁移到 `src/app/[locale]/`:

| 原路径 | 新路径 | 状态 |
|--------|--------|------|
| `src/app/about-me/` | `src/app/[locale]/about-me/` | ⏳ 待迁移 |
| `src/app/blog/` | `src/app/[locale]/blog/` | ⏳ 待迁移 |
| `src/app/gallery/` | `src/app/[locale]/gallery/` | ⏳ 待迁移 |
| `src/app/music/` | `src/app/[locale]/music/` | ⏳ 待迁移 |
| `src/app/travel/` | `src/app/[locale]/travel/` | ⏳ 待迁移 |
| `src/app/mbti-test/` | `src/app/[locale]/mbti-test/` | ⏳ 待迁移 |
| `src/app/mbti-analysis/` | `src/app/[locale]/mbti-analysis/` | ⏳ 待迁移 |
| `src/app/zodiac/` | `src/app/[locale]/zodiac/` | ⏳ 待迁移 |
| `src/app/os/` | `src/app/[locale]/os/` | ⏳ 待迁移 |

**迁移步骤** (以 Blog 为例):

1. **移动目录**:
```bash
mv src/app/blog src/app/[locale]/blog
```

2. **添加翻译** (`src/locales/{zh,en,ja}.json`):
```json
{
  "blog": {
    "title": "博客 / Blog / ブログ",
    "latestPosts": "最新文章 / Latest Posts / 最新記事",
    "readMore": "阅读更多 / Read More / もっと読む",
    "backToList": "返回列表 / Back to List / リストに戻る",
    "noArticles": "还没有文章 / No articles yet / まだ記事がありません"
  }
}
```

3. **更新页面组件** (`src/app/[locale]/blog/page.tsx`):
```typescript
'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'

export default function BlogPage() {
  const t = useTranslations('blog')
  const common = useTranslations('common')

  // 使用 t('title'), t('latestPosts') 等替换硬编码文本

  return (
    <div>
      <h1>{t('title')}</h1>
      {/* ... */}
    </div>
  )
}
```

---

### 优先级 P2: 静态数据翻译 ⚠️ **工作量大**

#### 任务 8: MBTI 分析数据翻译

**文件**: `src/app/[locale]/mbti-analysis/[type]/page.tsx`

**当前状态**:
- 16 个 MBTI 类型数据全部硬编码在组件中
- 约 500 行中文数据

**建议方案**: 将数据提取到 JSON 文件

1. **创建数据文件结构**:
```bash
mkdir -p src/locales/mbti-data
```

2. **创建数据文件** (示例: `src/locales/mbti-data/INTJ.json`):
```json
{
  "zh": {
    "title": "建筑师",
    "description": "富有想象力和战略性的思考者...",
    "traits": ["独立思考，喜欢深入分析", "..."],
    "strengths": ["逻辑思维强", "..."],
    // ...
  },
  "en": {
    "title": "The Architect",
    "description": "Imaginative and strategic thinkers...",
    "traits": ["Independent thinking", "..."],
    "strengths": ["Strong logical thinking", "..."],
    // ...
  },
  "ja": {
    "title": "建築家",
    "description": "想像力と戦略的な思考者...",
    "traits": ["独立した思考", "..."],
    "strengths": ["論理的思考", "..."],
    // ...
  }
}
```

3. **使用 AI 辅助翻译**:
   - 可以使用 Claude/GPT-4 批量翻译数据
   - 每次翻译 4-5 个类型
   - 让 AI 生成完整的 JSON 文件

**AI 提示词示例**:
```
请将以下 MBTI INTJ 类型的中文数据翻译成英文和日语，保持 JSON 结构：

[粘贴中文数据]

输出格式：
{
  "zh": { 原中文数据 },
  "en": { 英文翻译 },
  "ja": { 日语翻译 }
}
```

#### 任务 9: Zodiac 星座数据翻译

**文件**: `src/app/[locale]/zodiac/[sign]/page.tsx`

**当前状态**:
- 12 个星座数据全部硬编码
- 约 1000 行中文数据

**方案**: 与 MBTI 相同，提取到 JSON 文件

```bash
mkdir -p src/locales/zodiac-data
```

---

## 🛠️ 工具和脚本

### 快速迁移脚本

创建 `scripts/migrate-page.sh`:

```bash
#!/bin/bash

# 用法: ./migrate-page.sh blog
PAGE_NAME=$1

if [ -z "$PAGE_NAME" ]; then
  echo "用法: ./migrate-page.sh <page-name>"
  exit 1
fi

echo "正在迁移 $PAGE_NAME 页面..."

# 移动目录
mv "src/app/$PAGE_NAME" "src/app/[locale]/$PAGE_NAME"

echo "✅ $PAGE_NAME 已迁移到 src/app/[locale]/$PAGE_NAME"
echo "📝 请记得更新页面组件以使用 useTranslations()"
```

### 批量添加翻译脚本

创建 `scripts/add-translations.js`:

```javascript
const fs = require('fs')
const path = require('path')

const translations = {
  zh: require('../src/locales/zh.json'),
  en: require('../src/locales/en.json'),
  ja: require('../src/locales/ja.json'),
}

function addTranslation(key, values) {
  Object.keys(values).forEach(locale => {
    translations[locale][key] = values[locale]
  })
}

// 使用示例
addTranslation('blog', {
  zh: { title: '博客', /* ... */ },
  en: { title: 'Blog', /* ... */ },
  ja: { title: 'ブログ', /* ... */ },
})

// 保存
Object.keys(translations).forEach(locale => {
  fs.writeFileSync(
    path.join(__dirname, `../src/locales/${locale}.json`),
    JSON.stringify(translations[locale], null, 2)
  )
})

console.log('✅ 翻译已更新')
```

---

## 📝 迁移检查清单

对于每个页面，完成以下检查：

- [ ] 将页面目录移动到 `src/app/[locale]/`
- [ ] 在 `locales/` 添加对应的翻译键值对 (zh, en, ja)
- [ ] 更新组件:
  - [ ] 添加 `'use client'` (如果需要)
  - [ ] 导入 `useTranslations` 和 `useLocale`
  - [ ] 将硬编码文本替换为 `t('key')`
  - [ ] 使用 `Link` from `@/navigation` 替代 `next/link`
- [ ] 测试三种语言的显示
- [ ] 检查链接是否正确包含语言前缀

---

## 🧪 测试清单

完成迁移后，测试以下功能：

1. **语言自动检测**:
   - 访问 `/` 应自动重定向到浏览器语言 (`/zh/`, `/en/`, `/ja/`)

2. **语言切换**:
   - 点击语言切换器应正确切换页面语言
   - URL 应更新为对应语言前缀

3. **导航功能**:
   - 所有导航链接应正确包含语言前缀
   - 切换语言后导航应停留在同一页面

4. **页面内容**:
   - 检查所有文本是否正确翻译
   - 检查中文、英文、日文显示是否正常

5. **现有功能**:
   - 确保所有现有功能 (登录、MBTI测试、照片上传等) 正常工作

---

## 🔍 常见问题 (FAQ)

### Q1: 为什么URL需要包含语言前缀?

A: 这是 SEO 最佳实践，允许搜索引擎索引不同语言版本的页面。用户也可以直接分享特定语言的链接。

### Q2: 如何处理动态路由 (如 `/blog/[id]`)?

A: 迁移后变成 `/[locale]/blog/[id]`，在组件中正常使用 `useParams()` 获取 `id` 参数，`locale` 参数由 next-intl 自动处理。

### Q3: API 路由需要翻译吗?

A: 不需要。API 路由保持在 `src/app/api/` 下，不移动到 `[locale]/` 中。API 响应可以根据请求头返回不同语言。

### Q4: 管理后台需要多语言吗?

A: 优先级较低。如果管理员都是中文用户，可以暂时保持中文，后期再添加多语言支持。

### Q5: 如何处理 Markdown 内容的翻译?

A: 对于博客文章内容，可以：
- 在数据库添加 `locale` 字段
- 或者为每篇文章创建多个版本 (中英日三个版本)

---

## 📚 参考资源

- [next-intl 官方文档](https://next-intl-docs.vercel.app/)
- [Next.js 国际化指南](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [AI 翻译工具推荐](https://claude.ai) - 可以批量翻译 JSON 数据

---

## 🚀 开始迁移

建议按以下顺序进行：

1. **第一天**: 完成 Navbar + 首页 (P0)
2. **第二天**: 完成 About/Blog/Gallery (P1)
3. **第三-四天**: 完成 MBTI 测试 UI (P1)
4. **第五-七天**: 翻译 MBTI 静态数据 (使用 AI 辅助)
5. **第八-十天**: 翻译 Zodiac 静态数据 (使用 AI 辅助)

预计总工作量: **10-15 小时** (使用 AI 辅助翻译)

---

**祝迁移顺利！🌐✨**

如有问题，请查看 next-intl 文档或询问 Claude Code。
