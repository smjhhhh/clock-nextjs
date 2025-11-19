const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Manually load .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8')
const env = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) {
    const key = match[1].trim()
    const value = match[2].trim()
    env[key] = value
  }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl ? '✅ SET' : '❌ MISSING')
console.log('Supabase Key:', supabaseKey ? '✅ SET' : '❌ MISSING')

const supabase = createClient(supabaseUrl, supabaseKey)

const blogContent = fs.readFileSync('/tmp/oauth_blog_post.md', 'utf-8')

async function publishBlog() {
  const { data, error } = await supabase
    .from('articles')
    .insert([
      {
        title: 'Next.js + Supabase OAuth 登录的重定向循环陷阱',
        content: blogContent,
        author: 'Yoru'
      }
    ])
    .select()

  if (error) {
    console.error('发布失败:', error)
    process.exit(1)
  } else {
    console.log('✅ 博客发布成功!')
    console.log('文章ID:', data[0].id)
    console.log('标题:', data[0].title)
    console.log('创建时间:', data[0].created_at)
  }
}

publishBlog()
