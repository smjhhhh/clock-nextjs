'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, BlogPost } from '@/lib/supabase'
import Navbar from '@/components/layout/Navbar'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Latest Posts
        </h2>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl mb-4">📝</p>
            <p className="text-gray-600">No blog posts yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <article
                key={post.id}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <Link href={`/blog/${post.id}`}>
                  <h3 className="text-xl font-bold text-gray-900 hover:text-pink-500 transition-colors mb-2">
                    {post.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span>By {post.author}</span>
                  <span>·</span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <p className="text-gray-600 line-clamp-3">
                  {post.content.substring(0, 200)}...
                </p>
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-block mt-4 text-pink-500 hover:text-pink-600 font-medium"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Yoru. Built with Next.js + TypeScript.</p>
        </div>
      </footer>
    </div>
  )
}
