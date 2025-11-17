'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navbar from '@/components/layout/Navbar'
import UploadModal from '@/components/gallery/UploadModal'

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<'blog' | 'photos'>('blog')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('Yoru')
  const [publishing, setPublishing] = useState(false)
  const [photos, setPhotos] = useState<Array<{ id: string; title: string; image_url: string; is_public: boolean }>>([])
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    if (user) {
      fetchPhotos()
    }
  }, [user])

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from('photos')
      .select('id, title, image_url, is_public')
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setPhotos(data)
  }

  const handlePublishArticle = async () => {
    if (!title || !content) {
      alert('请填写标题和内容')
      return
    }

    setPublishing(true)
    try {
      const { error } = await supabase
        .from('articles')
        .insert([{ title, content, author }])

      if (error) throw error
      alert('文章发布成功！')
      setTitle('')
      setContent('')
    } catch (error) {
      console.error('Publish failed:', error)
      alert('发布失败')
    } finally {
      setPublishing(false)
    }
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">需要管理员权限</h1>
          <p className="text-gray-600 mb-6">请先登录以访问后台管理系统</p>
          <Link href="/gallery" className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
            前往登录
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* User Info Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="text-sm text-gray-600 text-right">
            当前用户: {user.email}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'blog'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            博客管理
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'photos'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            照片管理
          </button>
        </div>

        {activeTab === 'blog' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* New Article Form */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">发布新文章</h2>

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
                    rows={15}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent font-mono text-sm"
                    placeholder="在这里写文章内容..."
                  />
                </div>

                <button
                  onClick={handlePublishArticle}
                  disabled={publishing}
                  className="w-full px-4 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {publishing ? '发布中...' : '发布文章'}
                </button>
              </div>
            </div>

            {/* Live Markdown Preview */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">实时预览</h2>

              <div className="prose prose-pink max-w-none max-h-[600px] overflow-y-auto">
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

        {activeTab === 'photos' && (
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">照片库</h2>
              <button
                onClick={() => setShowUpload(true)}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                + 上传照片
              </button>
            </div>

            {photos.length === 0 ? (
              <p className="text-gray-500">暂无照片</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.image_url}
                      alt={photo.title}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2">
                      <button
                        onClick={() => handleTogglePhotoVisibility(photo.id, photo.is_public)}
                        className={`px-3 py-1 rounded text-sm ${
                          photo.is_public ? 'bg-green-500' : 'bg-gray-500'
                        } text-white`}
                      >
                        {photo.is_public ? '公开' : '私密'}
                      </button>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                      >
                        删除
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 truncate">{photo.title}</p>
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
