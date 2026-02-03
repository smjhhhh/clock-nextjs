# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Languages**: [English](#) | [中文](./CLAUDE.zh-CN.md) | [日本語](./CLAUDE.ja.md)

---

## Clock-NextJS: Personal Portfolio & Creative Platform

**Last Updated**: 2026-02-03
**Project Status**: Active Development (i18n Migration In Progress)
**Live Demo**: https://clock-nextjs.vercel.app
**Supabase Project**: https://bzspxbtwttkxyiatyaes.supabase.co

---

## Quick Start

### Essential Commands
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

**Note**: All Next.js commands use the `--webpack` flag for compatibility.

### Environment Setup
Required environment variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_ADMIN_EMAILS` - Comma-separated admin emails

**Copy from template**:
```bash
cp .env.example .env.local
# Then edit .env.local with your actual values
```

---

## Project Overview

**Full-stack Next.js portfolio** featuring:
- Portfolio landing page with animated emoji background
- Gallery with photo map and lightbox viewer
- Blog system with Markdown support
- MBTI personality test (20 questions, 5 dimensions)
- MBTI type analysis pages (16 personality types)
- Zodiac/Astrology system (12 signs with interactive wheel)
- Travel tracker with world map
- Music player with lyrics display
- macOS desktop simulation (Dock, Launchpad, Context Menu, Windows)
- Admin dashboard for content management
- PWA (Progressive Web App) support

---

## Tech Stack

### Core
- **Next.js 16.0.3** - App Router, API Routes, Server/Client Components
- **React 19.2.0** - Latest with improved lifecycle
- **TypeScript 5** - Strict mode
- **Tailwind CSS 4** - Utility-first styling
- **Supabase** - PostgreSQL + Auth + Storage

### Key Libraries
- **Database**: @supabase/supabase-js (^2.83.0)
- **Internationalization**: next-intl (^4.8.1) - Multi-language support (zh, en, ja)
- **Maps**: leaflet (^1.9.4), react-leaflet (^5.0.0)
- **Animations**: framer-motion (^12.23.24)
- **Markdown**: react-markdown (^10.1.0), remark-gfm (^4.0.1)
- **Images**: yet-another-react-lightbox (^3.25.0), browser-image-compression (^2.0.2)
- **Music**: music-metadata-browser (^2.5.11)
- **UI Components**: react-draggable (^4.5.0), react-dropzone (^14.3.8)
- **PWA**: @ducanh2912/next-pwa (^10.2.9)
- **Icons**: react-icons (^5.5.0)

---

## Project Structure

```
clock-nextjs/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout (redirects to locale)
│   │   ├── page.tsx             # Root page (redirects to /zh or browser locale)
│   │   ├── [locale]/            # Internationalized routes (zh, en, ja)
│   │   │   ├── layout.tsx       # Locale-aware layout with AuthProvider
│   │   │   ├── page.tsx         # Localized landing page
│   │   ├── about-me/            # About page (⚠️ needs migration to [locale]/)
│   │   ├── admin/               # Admin dashboard
│   │   │   ├── page.tsx         # Multi-tab panel (blog/photos/trips/music)
│   │   │   └── login/           # OAuth login
│   │   ├── api/                 # API routes
│   │   │   └── mbti/            # MBTI test endpoints
│   │   ├── auth/callback/       # OAuth callback handler
│   │   ├── blog/                # Blog list & [id] detail
│   │   ├── gallery/             # Photo gallery
│   │   ├── mbti-test/           # MBTI test UI
│   │   ├── mbti-analysis/[type] # 16 MBTI type pages (static data)
│   │   ├── zodiac/              # Zodiac wheel & [sign] pages (static data)
│   │   ├── music/               # Music player
│   │   ├── os/                  # macOS simulator
│   │   ├── travel/              # Travel tracker
│   │   ├── manifest.ts          # PWA manifest
│   │   └── globals.css          # Global styles
│   │
│   ├── components/              # React components
│   │   ├── layout/Navbar.tsx   # Main navigation
│   │   ├── admin/              # Admin components
│   │   ├── auth/               # Auth components
│   │   ├── gallery/            # PhotoMap, PhotoUpload
│   │   ├── music/              # VinylPlayer, AppleMusicPlayer
│   │   ├── os/                 # macOS components
│   │   │   ├── Desktop.tsx
│   │   │   ├── MenuBar.tsx
│   │   │   ├── Dock.tsx
│   │   │   ├── Window.tsx
│   │   │   ├── Launchpad.tsx
│   │   │   ├── ContextMenu.tsx
│   │   │   └── NotificationCenter.tsx
│   │   └── LanguageSwitcher.tsx # Language switcher component (NEW)
│   │
│   ├── lib/supabase.ts         # Supabase client + types
│   ├── contexts/AuthContext.tsx # Auth provider
│   ├── types/os.ts             # macOS simulator types
│   ├── i18n.ts                 # i18n configuration (NEW)
│   ├── navigation.ts           # Internationalized routing helpers (NEW)
│   └── locales/                # Translation files (NEW)
│       ├── zh.json             # Chinese translations
│       ├── en.json             # English translations
│       └── ja.json             # Japanese translations
│
├── supabase/                   # Database schema & migrations
│   ├── 01_create_tables.sql
│   ├── 02_create_functions.sql
│   ├── 03_create_rls.sql
│   ├── 04_insert_sample_data.sql
│   ├── 05_smart_album_schema.sql
│   ├── 07_travel_schema.sql
│   └── 08_music_schema.sql
│
├── public/                     # Static assets
│   ├── wallpapers/            # macOS wallpapers
│   └── manifest.json          # PWA manifest
│
├── middleware.ts              # i18n middleware for locale routing (NEW)
├── CLAUDE.md                  # This file (English)
├── CLAUDE.zh-CN.md            # Chinese version
├── CLAUDE.ja.md               # Japanese version
├── I18N_SETUP_COMPLETE.md     # i18n migration guide (NEW)
├── I18N_MIGRATION_GUIDE.md    # Detailed migration instructions (NEW)
├── I18N_PROGRESS.md           # Migration progress tracker (NEW)
├── TECHNICAL_GUIDE.md         # Detailed tech docs (Chinese)
├── STEP_BY_STEP_GUIDE.md      # Rebuild guide (Chinese)
└── SITEMAP.md                 # Site structure map
```

---

## Architecture Overview

### Database Schema (Supabase PostgreSQL)

**Content Tables**:
- `articles` - Blog posts
- `photos` - Gallery images (with EXIF, GPS, trip_id)
- `trips` - Travel records
- `songs` - Music library

**MBTI System Tables**:
- `question_bank` - Test questions (5 dimensions: EI, SN, TF, JP, AT)
- `question_options` - Answer choices
- `test_configs` - Test configurations (20Q standard, 12Q quick, 50Q full)
- `user_test_sessions` - Test sessions and results
- `user_answers` - Individual answers
- `session_selected_questions` - Questions selected per session

**Key RPC Functions**:
- `create_test_session(p_user_id, p_config_id)` - Create session, randomly select questions
- `get_test_questions(p_session_id)` - Retrieve session questions
- `calculate_mbti_type(p_session_id)` - Compute MBTI result from answers

**Security**: All tables use Row Level Security (RLS)
- Anonymous users: Read public content
- Authenticated users: Write own content
- Admin users: Full access (via `NEXT_PUBLIC_ADMIN_EMAILS`)

---

## Internationalization (i18n)

### Current Status
**⚠️ MIGRATION IN PROGRESS** - Infrastructure complete, pages being migrated to locale-based routing

### Configuration
- **Library**: next-intl v4.8.1
- **Supported Locales**: `zh` (中文), `en` (English), `ja` (日本語)
- **Default Locale**: `zh` (Chinese)
- **URL Structure**: `/{locale}/path` (e.g., `/zh/blog`, `/en/gallery`, `/ja/music`)

### Key Files
- **`src/i18n.ts`** - Locale configuration, routing setup, and request config
- **`middleware.ts`** - Automatic locale detection and URL rewriting
- **`src/locales/{zh,en,ja}.json`** - Translation files for each language
- **`src/navigation.ts`** - Internationalized Link, useRouter, redirect helpers
- **`src/components/LanguageSwitcher.tsx`** - Language switcher component
- **`src/app/[locale]/`** - Root directory for all internationalized pages

### Architecture Pattern
**Locale-based routing**: All pages organized under `src/app/[locale]/` directory

1. **Root path behavior**:
   - User visits `/` → middleware detects browser language
   - Auto-redirects to `/zh/`, `/en/`, or `/ja/` based on preference

2. **Locale-prefixed routes**:
   - Every route includes locale: `/zh/blog`, `/en/gallery`, `/ja/music`
   - Middleware handles locale detection and URL rewriting
   - Users can manually switch languages via LanguageSwitcher component

3. **Navigation links**:
   - **CRITICAL**: Use `Link` from `@/navigation`, NOT `next/link`
   - This ensures links automatically include the current locale prefix

### Using Translations in Components

**Client Components** (most common):
```typescript
'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/navigation'  // IMPORTANT: Use this, not next/link

export default function MyComponent() {
  const t = useTranslations('namespace')  // e.g., 'nav', 'common', 'blog'
  const locale = useLocale()  // Get current locale: 'zh', 'en', or 'ja'

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      {/* Link auto-prefixes with current locale */}
      <Link href="/about-me">{t('link')}</Link>
    </div>
  )
}
```

**Server Components**:
```typescript
import { getTranslations } from 'next-intl/server'

export default async function ServerComponent() {
  const t = await getTranslations('namespace')

  return <h1>{t('title')}</h1>
}
```

### Adding New Translations

1. **Add keys to ALL three language files**:
   ```json
   // src/locales/zh.json
   {
     "nav": {
       "home": "首页",
       "aboutMe": "关于我"
     },
     "common": {
       "loading": "加载中...",
       "error": "出错了"
     }
   }
   ```

2. **Use nested structure** for organization:
   - `nav.*` - Navigation items
   - `common.*` - Common UI text (loading, error, etc.)
   - `blog.*` - Blog-specific text
   - `gallery.*` - Gallery-specific text

3. **Ensure consistency**: All keys must exist in `zh.json`, `en.json`, AND `ja.json`

### Programmatic Navigation

**Use `@/navigation` imports**, not `next/navigation`:
```typescript
import { useRouter } from '@/navigation'  // ✅ Correct
import { useRouter } from 'next/navigation'  // ❌ Wrong - breaks i18n

const router = useRouter()
router.push('/gallery')  // Auto-prefixes with current locale
```

**Redirects**:
```typescript
import { redirect } from '@/navigation'  // ✅ Correct

redirect('/blog')  // Auto-prefixes with current locale
```

### Migration Status

**✅ Completed**:
- Infrastructure setup (middleware, config, routing)
- Translation files with basic navigation and common keys
- Language switcher component
- Root layout with locale support (`src/app/[locale]/layout.tsx`)
- Root page redirect logic

**🔄 In Progress** (see `I18N_SETUP_COMPLETE.md` for full details):
- Migrating existing pages from `src/app/` to `src/app/[locale]/`
- Updating components to use `useTranslations` hooks
- Replacing hardcoded text with translation keys
- Translating large static data sets (MBTI analysis, Zodiac content)

**📋 Not Started**:
- MBTI analysis pages (16 types × ~500 lines of Chinese content)
- Zodiac detail pages (12 signs × ~1000 lines of Chinese content)
- Admin dashboard translations

### Important Migration Notes

**When migrating a page**:
1. Move from `src/app/page/` to `src/app/[locale]/page/`
2. Add `'use client'` if using hooks
3. Import `useTranslations` from `next-intl`
4. Import `Link` from `@/navigation` (NOT `next/link`)
5. Replace hardcoded strings with `t('key')`
6. Add translation keys to all three locale files

**Common pitfalls**:
- ❌ Using `next/link` → Links won't include locale prefix
- ❌ Using `next/navigation` router → Navigation breaks i18n
- ❌ Forgetting to add keys to all language files → Missing translations
- ❌ Not using `'use client'` with hooks → Hydration errors

---

## Authentication Flow

### Supabase OAuth Flow
1. User clicks "Login" → redirects to `/admin/login`
2. User clicks GitHub/Google → Supabase OAuth providers
3. OAuth redirect → `/auth/callback` with auth code
4. `supabase.auth.exchangeCodeForSession(code)` exchanges code
5. Session stored in localStorage (`supabase.auth.token`)
6. `AuthContext` listens to `onAuthStateChange()` and updates state

### Admin Access Control
- Protected route: `/admin` (component-level check, not middleware)
- Check: User email must be in `NEXT_PUBLIC_ADMIN_EMAILS`
- **Important**: Middleware allows all traffic; auth checked per-component to avoid localStorage/cookie sync issues

### AuthContext (`src/contexts/AuthContext.tsx`)
- Provides: `user`, `loading`, `isAuthenticated`, `signOut()`
- Wrapped in `RootLayout` for app-wide access
- Real-time updates via `supabase.auth.onAuthStateChange()`

---

## Key Features

### 1. MBTI Personality Test
**Workflow**:
1. User visits `/mbti-test`
2. Component calls `POST /api/mbti/create-session`
3. Backend randomly selects 20 questions (4 per dimension)
4. UI displays questions one by one
5. User completes test → calls `POST /api/mbti/submit-answers`
6. Backend calculates MBTI type (e.g., "INFP-T")
7. Redirects to `/mbti-analysis/{type}`

**Database**: Uses RPC functions for random question selection and scoring

### 2. MBTI Analysis Pages (`/mbti-analysis/[type]`)
- **16 personality type pages** (INTJ, ENFP, INFP, etc.)
- **Static data** - All content hardcoded as TypeScript objects
- No database queries
- Includes: description, traits, strengths, weaknesses, careers, famous people

### 3. Zodiac System
**Interactive Wheel** (`/zodiac`):
- 12 zodiac signs in circular layout
- Mouse-following particle effects
- Constellation line animations on hover
- Scroll to rotate wheel

**Detail Pages** (`/zodiac/[sign]`):
- **Static data** - Hardcoded TypeScript objects
- 12 zodiac signs (Aries, Taurus, etc.)
- Includes: element, ruling planet, traits, compatibility, careers

### 4. Gallery System (`/gallery`)
- Grid view with infinite scroll (12 photos/page)
- Map view (Leaflet) showing geotagged photos
- Lightbox full-screen viewer
- Toggle between views
- Filters: `is_public` flag

**PhotoMap Component**:
- Uses `react-leaflet` (dynamic import with `ssr: false`)
- Markers for photos with GPS coordinates
- Popup with thumbnail on click

### 5. Blog System (`/blog`)
- List page shows all articles
- Detail page (`/blog/[id]`) renders Markdown
- Uses `react-markdown` + `remark-gfm` for GFM support
- Tables, strikethrough, task lists supported

### 6. Music Player (`/music`)
- Displays songs from `songs` table
- Features: play/pause, next/prev, progress bar, shuffle, repeat
- Lyrics display toggle
- Vinyl and Apple Music-style UI variants

### 7. Travel Tracker (`/travel`)
- World map showing geotagged photos
- Trip timeline with date ranges
- Cover images and descriptions
- Status: planned vs. completed

### 8. macOS Desktop Simulation (`/os`)
**Components**:
- **MenuBar**: Top system menu with date/time
- **Dock**: App launcher at bottom with bounce effects
- **Desktop**: Draggable windows (react-draggable) with z-index management
- **Launchpad**: App grid with search (28 apps/page)
- **ContextMenu**: Right-click desktop menu
- **NotificationCenter**: Slide-out notification panel
- **Windows**: Minimize/maximize/close buttons

**App Types**: Defined in `/src/types/os.ts`

### 9. Admin Dashboard (`/admin`)
**Multi-tab interface**:
- **Blog**: Create/edit/delete articles (Markdown editor)
- **Photos**: Upload with EXIF extraction, HEIC support, image compression
- **Trips**: Create trips, set dates, upload cover images
- **Music**: Upload audio, extract metadata, add lyrics

**Access Control**: Only users with emails in `NEXT_PUBLIC_ADMIN_EMAILS` can access

---

## Development Workflows

### Typical Session
1. `npm run dev` - Start dev server (http://localhost:3000)
2. Edit files in `src/` - Hot reload enabled
3. Check browser console and terminal for errors
4. `npm run lint` - Check for lint errors
5. `npm run build` - Test production build

### Working with Supabase
1. **Schema changes**: Edit SQL files in `/supabase`
2. **Apply**: Run in Supabase SQL Editor
3. **Update types**: Modify types in `/src/lib/supabase.ts`
4. **Test**: Use Supabase Table Editor

### Database Operations
```typescript
import { supabase } from '@/lib/supabase'

// Fetch
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', value)

// Insert
const { data, error } = await supabase
  .from('table_name')
  .insert([{ column: value }])

// RPC
const { data, error } = await supabase
  .rpc('function_name', { param1, param2 })
```

### File Upload
```typescript
// Upload to Supabase Storage
const { data, error } = await supabase.storage
  .from('photos')
  .upload(`path/${filename}`, file)

// Get public URL
const publicUrl = supabase.storage
  .from('photos')
  .getPublicUrl(path).data.publicUrl
```

### Adding Components
- **Always use `@/` path alias** (configured in `tsconfig.json`)
- Example: `import { supabase } from '@/lib/supabase'`
- Never use relative paths like `../../lib/supabase`

### Internationalization Routing (CRITICAL)
**⚠️ ALWAYS use `@/navigation` for links and routing, NOT `next/link` or `next/navigation`**

```typescript
// ✅ CORRECT - Auto-handles locale prefixing
import { Link, useRouter, redirect } from '@/navigation'

// ❌ WRONG - Breaks i18n routing
import Link from 'next/link'
import { useRouter, redirect } from 'next/navigation'
```

**Why this matters**:
- `@/navigation` is a wrapper around Next.js routing that automatically includes locale prefixes
- Using `next/link` will create links like `/blog` instead of `/zh/blog`
- Using `next/navigation` router will break locale preservation on navigation

**Examples**:
```typescript
// Links
import { Link } from '@/navigation'
<Link href="/gallery">Gallery</Link>  // Renders as /zh/gallery (or current locale)

// Programmatic navigation
import { useRouter } from '@/navigation'
const router = useRouter()
router.push('/blog')  // Navigates to /zh/blog (or current locale)

// Server-side redirects
import { redirect } from '@/navigation'
redirect('/admin')  // Redirects to /zh/admin (or current locale)
```

---

## Important Implementation Notes

### Static Data Pages
**MBTI Analysis & Zodiac pages use NO database**:
- All data hardcoded as TypeScript `Record` objects
- URL params (`[type]`, `[sign]`) determine which data to display
- Content mostly in Chinese (target audience)
- To add content: Edit the data objects directly in component files

### Dynamic Imports for Client-Only Libraries
```typescript
// Leaflet requires window object
const PhotoMap = dynamic(() => import('@/components/gallery/PhotoMap'), {
  ssr: false,
  loading: () => <LoadingPlaceholder />
})
```

### Image Optimization
- `next.config.ts` configured with `remotePatterns` for:
  - `**.supabase.co` (project images)
  - `images.unsplash.com` (stock photos)
  - `is1-ssl.mzstatic.com` (Apple Music artwork)
- Use Next.js `<Image>` component for automatic optimization

### Animation Libraries
- **Framer Motion**: Page transitions, hover effects, component animations
- **CSS animations**: Custom keyframes for zodiac constellations
- **Performance**: Use `initial`, `animate`, `exit` props consistently

---

## Common Issues & Solutions

### Issue: Supabase Auth Session Lost on Reload
**Cause**: Auth state in localStorage not syncing
**Solution**: `AuthContext` uses `supabase.auth.onAuthStateChange()` to listen for changes
**Note**: Middleware allows all traffic; auth checked per-component to avoid sync issues

### Issue: OAuth Redirect Loop
**Cause**: OAuth callback not properly configured
**Solutions**:
- Ensure `/auth/callback` route exists
- Check Supabase OAuth providers are enabled
- Verify redirect URL: `http://localhost:3000/auth/callback` (dev)
- Clear localStorage and retry

### Issue: Leaflet "window is not defined"
**Cause**: Leaflet needs `window` object (SSR fails)
**Solution**: Use `dynamic()` import with `ssr: false`

### Issue: Images Not Loading
**Cause**: Missing `remotePatterns` in `next.config.ts`
**Solution**: Already configured for `**.supabase.co`

### Issue: HEIC Images Not Uploading
**Cause**: Browser doesn't support HEIC natively
**Solution**: `heic2any` library converts to JPEG before upload

### Issue: Links Not Including Locale Prefix
**Cause**: Using `next/link` instead of `@/navigation`
**Solution**: Always import `Link` from `@/navigation`:
```typescript
import { Link } from '@/navigation'  // ✅ Correct
import Link from 'next/link'          // ❌ Wrong
```

### Issue: Navigation Doesn't Preserve Locale
**Cause**: Using `useRouter` from `next/navigation` instead of `@/navigation`
**Solution**: Import router from `@/navigation`:
```typescript
import { useRouter } from '@/navigation'  // ✅ Correct
import { useRouter } from 'next/navigation'  // ❌ Wrong
```

### Issue: Translation Keys Not Found / Missing Translations
**Cause**: Translation key missing in one or more locale files
**Solution**:
1. Check that the key exists in ALL three files: `zh.json`, `en.json`, AND `ja.json`
2. Verify the nested path is correct (e.g., `nav.home`, not `home`)
3. Restart dev server after adding new keys

### Issue: Root Path Returns 404
**Cause**: Middleware not properly configured or not running
**Solution**:
1. Verify `middleware.ts` exists at project root
2. Check `matcher` config excludes API routes: `['/((?!api|_next|_vercel|.*\\..*).*)']`
3. Ensure `src/i18n.ts` has correct locale configuration

### Issue: Page Shows Without Locale Prefix
**Cause**: Page still in old `src/app/` structure, not migrated to `src/app/[locale]/`
**Solution**: Move page directory to `src/app/[locale]/` and update all imports

### Issue: "useTranslations" Hook Errors
**Cause**: Using hook in Server Component without `'use client'` directive
**Solution**: Add `'use client'` at top of file, or use `getTranslations` for Server Components:
```typescript
// Client Component
'use client'
import { useTranslations } from 'next-intl'

// Server Component
import { getTranslations } from 'next-intl/server'
const t = await getTranslations('namespace')
```

---

## Deployment

### Vercel (Current Platform)
- Auto-deploy on push to `main`
- Environment variables set in Vercel dashboard
- Logs: vercel.com

### Required Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_ADMIN_EMAILS
```

### Build Configuration
- Runs `next build --webpack`
- Output: `.next/` directory
- PWA service worker: `public/` directory

---

## Recent Updates (as of 2026-02-03)

### Latest Features
1. **Internationalization (i18n) - NEW** 🌐:
   - **Status**: Infrastructure complete, page migration in progress
   - next-intl v4 integration with locale-based routing
   - Support for Chinese (zh), English (en), Japanese (ja)
   - Automatic browser language detection
   - Language switcher component in navigation
   - Middleware-powered URL rewriting (`/{locale}/path`)
   - Translation files with basic navigation and common keys
   - **⚠️ Critical**: Must use `@/navigation` for all links/routing
   - See full documentation in "Internationalization (i18n)" section above

2. **Zodiac System**:
   - Interactive zodiac wheel with 12 signs
   - Mouse-following particle effects
   - Constellation animations
   - Detailed sign pages (static data)

3. **MBTI Analysis Pages**:
   - 16 personality type pages
   - Complete trait analysis
   - Career suggestions
   - Famous people examples

4. **macOS Simulation Enhancements**:
   - Context menu (right-click)
   - Launchpad (app grid with search)
   - Notification Center
   - Draggable windows with z-index management

5. **Other Features**:
   - PWA support
   - Music player with lyrics
   - Travel tracker with world map
   - Smart photo album with EXIF

---

## Quick Reference

### API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/mbti/create-session` | Start MBTI test |
| POST | `/api/mbti/submit-answers` | Submit answers, get result |

**Note**: Most data operations use Supabase client-side SDK directly (only 2 API routes)

### Files to Review by Feature
| Feature | Files |
|---------|-------|
| **MBTI Test** | `src/app/api/mbti/`, `src/app/mbti-test/page.tsx` |
| **MBTI Analysis** | `src/app/mbti-analysis/[type]/page.tsx` (static) |
| **Zodiac** | `src/app/zodiac/page.tsx`, `src/app/zodiac/[sign]/page.tsx` (static) |
| **Gallery** | `src/app/gallery/page.tsx`, `src/components/gallery/` |
| **Blog** | `src/app/blog/`, `src/app/admin/page.tsx` |
| **Travel** | `src/app/travel/`, `src/components/gallery/PhotoMap.tsx` |
| **Music** | `src/app/music/page.tsx`, `src/components/music/` |
| **Auth** | `src/contexts/AuthContext.tsx`, `src/app/auth/callback/route.ts` |
| **macOS** | `src/app/os/page.tsx`, `src/components/os/`, `src/types/os.ts` |
| **Admin** | `src/app/admin/page.tsx` |

---

## Additional Documentation

This repository includes additional detailed guides:
- **`TECHNICAL_GUIDE.md`** - In-depth technical implementation (Chinese)
- **`STEP_BY_STEP_GUIDE.md`** - Complete rebuild guide (Chinese)
- **`SITEMAP.md`** - Site structure and user flows

---

**Personal Brand**: "Yoru" (夜 - Japanese for night)
**Target Audience**: Portfolio visitors, MBTI enthusiasts, travel followers
**Deployed to**: Vercel (clock-nextjs.vercel.app)

---

**Happy coding! 🌙✨**
