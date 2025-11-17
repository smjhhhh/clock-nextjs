# Supabase Environment Configuration Guide

This guide explains how to switch between local development and production environments for Supabase OAuth.

## Environment Configuration

### 1. Supabase Dashboard Settings

Go to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/url-configuration

#### For Local Development:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs** (add all):
  ```
  http://localhost:3000/**
  http://localhost:3000/gallery
  http://localhost:3000/auth/callback
  ```

#### For Production:
- **Site URL**: `https://your-domain.vercel.app`
- **Redirect URLs** (add all):
  ```
  https://your-domain.vercel.app/**
  https://your-domain.vercel.app/gallery
  https://your-domain.vercel.app/auth/callback
  ```

#### For Both Environments (Recommended):
- **Site URL**: `http://localhost:3000` (or your production URL)
- **Redirect URLs** (add all):
  ```
  http://localhost:3000/**
  https://your-domain.vercel.app/**
  ```

### 2. GitHub OAuth App Configuration

Go to: https://github.com/settings/developers

**Authorization callback URL** (This stays the same for all environments):
```
https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
```

**Homepage URL**:
- For development: `http://localhost:3000`
- For production: `https://your-domain.vercel.app`

### 3. Local Environment Variables

Create `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Production Environment Variables (Vercel)

In Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Common Issues & Solutions

### Issue: 500 Error on GitHub Login
**Cause**: GitHub OAuth not configured in Supabase
**Solution**:
1. Go to Supabase Dashboard → Authentication → Providers → GitHub
2. Enable GitHub
3. Add Client ID and Client Secret from GitHub OAuth App
4. Save

### Issue: Redirect to auth-code-error
**Cause**: Redirect URL not in whitelist
**Solution**: Add `http://localhost:3000/**` to Redirect URLs in Supabase

### Issue: Login works but redirects to wrong URL
**Cause**: Site URL mismatch
**Solution**: Update Site URL in Supabase to match your current environment

## Quick Switch Commands

### Switch to Local Development:
1. Update Supabase Site URL to `http://localhost:3000`
2. Ensure `http://localhost:3000/**` is in Redirect URLs
3. Run: `npm run dev`

### Switch to Production:
1. Update Supabase Site URL to your production URL
2. Ensure production URL is in Redirect URLs
3. Deploy to Vercel: `npx vercel --prod`

## Project-Specific Configuration

**Supabase Project ID**: bzspxbtwttkxyiatyaes
**Callback URL**: https://bzspxbtwttkxyiatyaes.supabase.co/auth/v1/callback

**Local Development**: http://localhost:3000
**Production**: https://clock-phi-two.vercel.app
