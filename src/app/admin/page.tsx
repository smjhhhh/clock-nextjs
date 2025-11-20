'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import UploadModal from '@/components/gallery/UploadModal'
import PhotoUpload from '@/components/gallery/PhotoUpload'
import AdminSidebar from '@/components/admin/AdminSidebar'
import StatCard from '@/components/admin/StatCard'
import { FaPenNib, FaImages, FaPlus, FaTrash, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa'

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'blog' | 'photos'>('dashboard')
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
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
        const userEmail = user.email || ''

        if (adminEmails.includes(userEmail)) {
          setIsAuthorized(true)
          fetchBlogs()
          fetchPhotos()
        } else {
          console.warn('Unauthorized access attempt:', userEmail)
          await signOut()
          router.push('/?error=unauthorized')
        }
      } else if (!authLoading && !user) {
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
        const { error } = await supabase
          .from('articles')
          .update({ title, content, author })
          .eq('id', editingBlog.id)

        if (error) throw error
        alert('文章更新成功！')
      } else {
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
    } else {
      console.error('Delete failed:', error)
      alert(`删除失败: ${error.message}`)
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white font-medium">验证身份中...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userEmail={user?.email}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">欢迎回来, 管理员 👋</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">这里是你网站的控制中心。</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="总文章数"
                  value={blogs.length}
                  icon={<FaPenNib className="text-2xl" />}
                  color="pink"
                />
                <StatCard
                  title="总照片数"
                  value={photos.length}
                  icon={<FaImages className="text-2xl" />}
                  color="purple"
                />
              </div>

              {/* Recent Activity or Quick Actions could go here */}
            </div>
          )}

          {/* Blog Management */}
          {activeTab === 'blog' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">博客管理</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setBlogView('list')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${blogView === 'list' ? 'bg-white shadow text-pink-600' : 'text-gray-500 hover:bg-gray-100'
                      }`}
                  >
                    列表视图
                  </button>
                  <button
                    onClick={() => {
                      setBlogView('create')
                      handleCancelEdit()
                    }}
                    className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium shadow-lg shadow-pink-500/30 transition-all flex items-center gap-2"
                  >
                    <FaPlus /> 写文章
                  </button>
                </div>
              </div>

              {blogView === 'list' ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                  {blogs.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-gray-500">暂无文章</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-slate-700">
                      {blogs.map((blog) => (
                        <div key={blog.id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors flex justify-between items-start group">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{blog.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                              {new Date(blog.created_at).toLocaleDateString()} · {blog.author}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-1 text-sm max-w-2xl">
                              {blog.content.substring(0, 100)}...
                            </p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditBlog(blog)}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              title="编辑"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="删除"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {editingBlog ? '编辑文章' : '撰写新文章'}
                      </h3>
                      {editingBlog && (
                        <button onClick={handleCancelEdit} className="text-sm text-gray-500 hover:text-gray-700">取消</button>
                      )}
                    </div>
                    <div className="space-y-4 flex-1 flex flex-col">
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-pink-500 text-lg font-bold"
                        placeholder="输入标题..."
                      />
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-pink-500 text-sm"
                        placeholder="作者名称"
                      />
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full flex-1 p-4 bg-gray-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-pink-500 font-mono text-sm resize-none"
                        placeholder="开始写作 (支持 Markdown)..."
                      />
                      <button
                        onClick={handlePublishArticle}
                        disabled={publishing}
                        className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold shadow-lg shadow-pink-500/30 transition-all disabled:opacity-50"
                      >
                        {publishing ? '处理中...' : (editingBlog ? '更新文章' : '发布文章')}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 overflow-y-auto h-full">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">预览</h3>
                    <div className="prose prose-pink dark:prose-invert max-w-none">
                      {title && <h1>{title}</h1>}
                      {content ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                      ) : (
                        <p className="text-gray-400 italic">预览内容将显示在这里...</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Photo Management */}
          {activeTab === 'photos' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">照片管理</h2>
                <span className="text-gray-500">{photos.length} 张照片</span>
              </div>

              {/* Upload Area */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">上传新照片</h3>
                <PhotoUpload onUploadComplete={fetchPhotos} />
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {photos.map((photo) => (
                  <div key={photo.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
                    <img
                      src={photo.image_url}
                      alt={photo.title || ''}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <p className="text-white text-sm font-medium truncate mb-3">{photo.title || '无标题'}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTogglePhotoVisibility(photo.id, photo.is_public)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors ${photo.is_public
                              ? 'bg-green-500/20 text-green-300 hover:bg-green-500 hover:text-white'
                              : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500 hover:text-white'
                            }`}
                        >
                          {photo.is_public ? <FaEye /> : <FaEyeSlash />}
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="flex-1 py-1.5 bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {/* Status Badge (Always visible) */}
                    <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${photo.is_public ? 'bg-green-500' : 'bg-yellow-500'
                      } ring-2 ring-white dark:ring-slate-800`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal (Legacy, kept if needed but unused in new design) */}
      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUploadSuccess={fetchPhotos}
      />
    </div>
  )
}
