'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import UploadModal from '@/components/gallery/UploadModal'

interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  created_at: string
}

export default function AdminPage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<'blog' | 'photos'>('blog')
  const [blogView, setBlogView] = useState<'create' | 'list'>('list')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('Yoru')
  const [publishing, setPublishing] = useState(false)
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [photos, setPhotos] = useState<Array<{ id: string; title: string; image_url: string; is_public: boolean; created_at: string }>>([])
  const [showUpload, setShowUpload] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!authLoading && user) {
        // Check if user email is in admin whitelist
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
        const userEmail = user.email || ''

        if (adminEmails.includes(userEmail)) {
          setIsAuthorized(true)
          fetchBlogs()
          fetchPhotos()
        } else {
          // Not authorized, sign out and redirect
          console.warn('Unauthorized access attempt:', userEmail)
          await signOut()
          router.push('/?error=unauthorized')
        }
      } else if (!authLoading && !user) {
        // Not logged in, redirect to login
        router.push('/admin/login')
      }
      setChecking(false)
    }

    checkAdminAccess()
  }, [user, authLoading, router, signOut])

  const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, content, author, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch blogs:', error)
    } else if (data) {
      setBlogs(data)
    }
  }

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from('photos')
      .select('id, title, image_url, is_public, created_at')
      .order('created_at', { ascending: false })
    if (data) setPhotos(data)
  }

  const handlePublishArticle = async () => {
    if (!title || !content) {
      alert('请填写标题和内容')
      return
    }

    setPublishing(true)
    try {
      if (editingBlog) {
        // Update existing blog
        const { error } = await supabase
          .from('articles')
          .update({ title, content, author })
          .eq('id', editingBlog.id)

        if (error) throw error
        alert('文章更新成功！')
      } else {
        // Create new blog
        const { error } = await supabase
          .from('articles')
          .insert([{ title, content, author }])

        if (error) throw error
        alert('文章发布成功！')
      }

      setTitle('')
      setContent('')
      setEditingBlog(null)
      setBlogView('list')
      fetchBlogs()
    } catch (error) {
      console.error('Publish failed:', error)
      alert('发布失败')
    } finally {
      setPublishing(false)
    }
  }

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog)
    setTitle(blog.title)
    setContent(blog.content)
    setAuthor(blog.author)
    setBlogView('create')
  }

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    if (!error) {
      alert('文章已删除')
      fetchBlogs()
    } else {
      alert('删除失败')
    }
  }

  const handleCancelEdit = () => {
    setEditingBlog(null)
    setTitle('')
    setContent('')
    setAuthor('Yoru')
    setBlogView('list')
  }

  const handleTogglePhotoVisibility = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('photos')
      .update({ is_public: !currentStatus })
      .eq('id', id)

    if (!error) {
      fetchPhotos()
    }
  }

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('确定要删除这张照片吗？')) return

    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', id)

    if (!error) {
      fetchPhotos()
    }
  }

  const handleSignOut = async () => {
    if (confirm('确定要退出登录吗？')) {
      await signOut()
      router.push('/')
    }
  }

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white">验证身份中...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p>权限验证中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">管理后台</h1>
              <p className="text-pink-100 text-sm mt-1">管理员: {user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm"
              >
                返回首页
              </a>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'blog'
                ? 'bg-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📝 博客管理
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'photos'
                ? 'bg-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📸 照片管理
          </button>
        </div>

        {/* Blog Management */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            {/* Sub Tabs */}
            <div className="flex gap-4">
              <button
                onClick={() => setBlogView('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  blogView === 'list'
                    ? 'bg-white text-pink-500 border-2 border-pink-500'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                📋 文章列表 ({blogs.length})
              </button>
              <button
                onClick={() => {
                  setBlogView('create')
                  handleCancelEdit()
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  blogView === 'create'
                    ? 'bg-white text-pink-500 border-2 border-pink-500'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                ✏️ 写文章
              </button>
            </div>

            {/* Blog List View */}
            {blogView === 'list' && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">已发布文章</h2>

                  {blogs.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">还没有发布任何文章</p>
                      <button
                        onClick={() => setBlogView('create')}
                        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                      >
                        发布第一篇文章
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {blogs.map((blog) => (
                        <div
                          key={blog.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h3>
                              <p className="text-sm text-gray-500 mb-2">
                                作者: {blog.author} · {new Date(blog.created_at).toLocaleString('zh-CN')}
                              </p>
                              <p className="text-gray-600 line-clamp-2 text-sm">
                                {blog.content.substring(0, 150)}...
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleEditBlog(blog)}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                              >
                                删除
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Blog Create/Edit View */}
            {blogView === 'create' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Edit Form */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingBlog ? '编辑文章' : '发布新文章'}
                    </h2>
                    {editingBlog && (
                      <button
                        onClick={handleCancelEdit}
                        className="text-sm text-gray-600 hover:text-gray-800"
                      >
                        取消编辑
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="文章标题"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">作者</label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        内容（支持 Markdown）
                      </label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={18}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
                        placeholder="在这里写文章内容..."
                      />
                    </div>

                    <button
                      onClick={handlePublishArticle}
                      disabled={publishing}
                      className="w-full px-4 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                      {publishing ? (editingBlog ? '更新中...' : '发布中...') : (editingBlog ? '更新文章' : '发布文章')}
                    </button>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">实时预览</h2>

                  <div className="prose prose-pink max-w-none max-h-[700px] overflow-y-auto">
                    {title && (
                      <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
                    )}
                    {content ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-gray-400 italic">在左侧输入内容，这里会实时显示渲染效果...</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Photos Management */}
        {activeTab === 'photos' && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">照片库 ({photos.length} 张)</h2>
              <button
                onClick={() => setShowUpload(true)}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium"
              >
                + 上传照片
              </button>
            </div>

            {photos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">还没有上传任何照片</p>
                <button
                  onClick={() => setShowUpload(true)}
                  className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  上传第一张照片
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.image_url}
                      alt={photo.title || ''}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2">
                      <button
                        onClick={() => handleTogglePhotoVisibility(photo.id, photo.is_public)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          photo.is_public ? 'bg-green-500' : 'bg-gray-500'
                        } text-white`}
                      >
                        {photo.is_public ? '✓ 公开' : '🔒 私密'}
                      </button>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium"
                      >
                        删除
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 truncate">{photo.title || '无标题'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUploadSuccess={fetchPhotos}
      />
    </div>
  )
}
