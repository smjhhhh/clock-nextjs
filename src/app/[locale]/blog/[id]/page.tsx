'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/navigation'
import { useParams } from 'next/navigation'
import { supabase, BlogPost } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navbar from '@/components/layout/Navbar'

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id as string)
    }
  }, [params.id])

  const fetchPost = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setPost(data)
    } catch (error) {
      console.error('Failed to fetch post:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : !post ? (
          <div className="text-center py-20">
            <p className="text-2xl mb-4">😢</p>
            <p className="text-gray-600 mb-4">Post not found</p>
            <Link href="/blog" className="text-pink-500 hover:text-pink-600">
              ← Back to Blog
            </Link>
          </div>
        ) : (
          <article className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
            <Link
              href="/blog"
              className="inline-block mb-6 text-pink-500 hover:text-pink-600 font-medium"
            >
              ← Back to Blog
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
              <span>By {post.author}</span>
              <span>·</span>
              <span>{formatDate(post.created_at)}</span>
            </div>

            <div className="prose prose-lg prose-pink max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
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
