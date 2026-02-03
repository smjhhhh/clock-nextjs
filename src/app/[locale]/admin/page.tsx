'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/navigation'
import { supabase, Trip, Song } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import * as musicMetadata from 'music-metadata-browser'
import UploadModal from '@/components/gallery/UploadModal'
import PhotoUpload from '@/components/gallery/PhotoUpload'
import AdminSidebar from '@/components/admin/AdminSidebar'
import StatCard from '@/components/admin/StatCard'
import { FaPenNib, FaPlus, FaTrash, FaEdit, FaEye, FaEyeSlash, FaMapMarkedAlt, FaCalendarAlt, FaCheck, FaImage, FaSave, FaTimes, FaMusic, FaUpload } from 'react-icons/fa'
import Image from 'next/image'

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'blog' | 'photos' | 'trips' | 'music'>('dashboard')
  const [blogView, setBlogView] = useState<'create' | 'list'>('list')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('Yoru')
  const [publishing, setPublishing] = useState(false)
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [photos, setPhotos] = useState<Array<{ id: string; title: string; image_url: string; is_public: boolean; created_at: string; trip_id?: string }>>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [tripView, setTripView] = useState<'list' | 'create'>('list')
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [tripForm, setTripForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'completed' as 'planned' | 'completed'
  })
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set())
  const [showUpload, setShowUpload] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)

  // Music State
  const [songs, setSongs] = useState<Song[]>([])
  const [musicView, setMusicView] = useState<'list' | 'create'>('list')
  const [songForm, setSongForm] = useState({
    title: '',
    artist: '',
    album: '',
    color: '#60a5fa',
    dark_color: '#1d4ed8',
    lyrics: ''
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [uploadingMusic, setUploadingMusic] = useState(false)

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!authLoading && user) {
        const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
        const userEmail = user.email || ''

        if (adminEmails.includes(userEmail)) {
          setIsAuthorized(true)
          fetchBlogs()
          fetchPhotos()
          fetchTrips()
          fetchSongs()
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
      .select('id, title, image_url, is_public, created_at, trip_id')
      .order('created_at', { ascending: false })
    if (data) setPhotos(data)
  }

  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('start_date', { ascending: false })

    if (error) console.error('Error fetching trips:', error)
    if (data) setTrips(data)
  }

  const fetchSongs = async () => {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('Error fetching songs:', error)
    if (data) setSongs(data)
  }

  const handleAudioFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAudioFile(file)

    // Auto-extract metadata
    try {
      const metadata = await musicMetadata.parseBlob(file)
      const { common } = metadata

      setSongForm(prev => ({
        ...prev,
        title: common.title || file.name.replace(/\.[^/.]+$/, ""),
        artist: common.artist || '',
        album: common.album || '',
        // Keep existing colors if set, otherwise default
        color: prev.color,
        dark_color: prev.dark_color,
        lyrics: prev.lyrics
      }))

      // Extract cover art if available
      if (common.picture && common.picture.length > 0) {
        const picture = common.picture[0]
        const coverBlob = new Blob([picture.data as any], { type: picture.format })
        const coverFile = new File([coverBlob], "cover.jpg", { type: picture.format })
        setCoverFile(coverFile)
      }
    } catch (error) {
      console.error('Error parsing metadata:', error)
      // Fallback to filename if parsing fails
      setSongForm(prev => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, "")
      }))
    }
  }

  const handleUploadSong = async () => {
    if (!audioFile || !songForm.title) {
      alert('请至少提供音频文件和歌曲标题')
      return
    }

    setUploadingMusic(true)
    try {
      // 1. Upload Audio
      const audioFileName = `audio/${Date.now()}-${audioFile.name}`
      const { data: audioData, error: audioError } = await supabase.storage
        .from('music')
        .upload(audioFileName, audioFile)

      if (audioError) throw audioError

      const audioUrl = supabase.storage.from('music').getPublicUrl(audioFileName).data.publicUrl

      // 2. Upload Cover (Optional)
      let coverUrl = ''
      if (coverFile) {
        const coverFileName = `covers/${Date.now()}-${coverFile.name}`
        const { data: coverData, error: coverError } = await supabase.storage
          .from('music')
          .upload(coverFileName, coverFile)

        if (coverError) throw coverError
        coverUrl = supabase.storage.from('music').getPublicUrl(coverFileName).data.publicUrl
      }

      // 3. Insert Metadata
      const { error: dbError } = await supabase.from('songs').insert({
        title: songForm.title,
        artist: songForm.artist || 'Unknown Artist',
        album: songForm.album || 'Unknown Album',
        audio_url: audioUrl,
        cover_url: coverUrl,
        color: songForm.color,
        dark_color: songForm.dark_color,
        lyrics: songForm.lyrics
      })

      if (dbError) throw dbError

      alert('歌曲上传成功！')
      setSongForm({
        title: '',
        artist: '',
        album: '',
        color: '#60a5fa',
        dark_color: '#1d4ed8',
        lyrics: ''
      })
      setAudioFile(null)
      setCoverFile(null)
      fetchSongs()
    } catch (error) {
      console.error('Upload failed:', error)
      alert('上传失败，请重试')
    } finally {
      setUploadingMusic(false)
    }
  }

  const handleDeleteSong = async (id: string) => {
    if (!confirm('确定要删除这首歌曲吗？')) return

    try {
      const { error } = await supabase.from('songs').delete().eq('id', id)
      if (error) throw error
      fetchSongs()
    } catch (error) {
      console.error('Delete failed:', error)
      alert('删除失败')
    }
  }

  const handleSaveTrip = async () => {
    if (!tripForm.title) {
      alert('请输入行程标题')
      return
    }

    try {
      let tripId = editingTrip?.id

      if (editingTrip) {
        const { error } = await supabase
          .from('trips')
          .update(tripForm)
          .eq('id', editingTrip.id)
        if (error) throw error
        alert('行程更新成功')
      } else {
        const { data, error } = await supabase
          .from('trips')
          .insert([tripForm])
          .select()
          .single()
        if (error) throw error
        tripId = data.id
        alert('行程创建成功')
      }

      // Update photos
      if (tripId) {
        // 1. Reset photos that were in this trip but are no longer selected
        // Actually, simpler: Set all photos currently in this trip to null, then set selected to tripId
        // But that might be inefficient if we have many.
        // Better: 
        // Set trip_id = null where trip_id = tripId
        await supabase.from('photos').update({ trip_id: null }).eq('trip_id', tripId)

        // Set trip_id = tripId where id in selectedPhotoIds
        if (selectedPhotoIds.size > 0) {
          await supabase
            .from('photos')
            .update({ trip_id: tripId })
            .in('id', Array.from(selectedPhotoIds))
        }
      }

      setTripView('list')
      setEditingTrip(null)
      setTripForm({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'completed'
      })
      setSelectedPhotoIds(new Set())
      fetchTrips()
      fetchPhotos() // Refresh photos to see updated trip_ids
    } catch (error: any) {
      console.error('Error saving trip:', error)
      alert('保存失败: ' + error.message)
    }
  }

  const handleDeleteTrip = async (id: string) => {
    if (!confirm('确定要删除这个行程吗？关联的照片不会被删除，但会解除关联。')) return

    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id)

    if (error) {
      alert('删除失败')
    } else {
      fetchTrips()
    }
  }

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip)
    setTripForm({
      title: trip.title,
      description: trip.description || '',
      start_date: trip.start_date || '',
      end_date: trip.end_date || '',
      status: trip.status
    })
    // Pre-select photos
    const tripPhotoIds = new Set(photos.filter(p => p.trip_id === trip.id).map(p => p.id))
    setSelectedPhotoIds(tripPhotoIds)
    setTripView('create')
  }

  const handleCancelTripEdit = () => {
    setEditingTrip(null)
    setTripForm({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      status: 'completed'
    })
    setSelectedPhotoIds(new Set())
    setTripView('list')
  }

  const togglePhotoSelection = (photoId: string) => {
    const newSet = new Set(selectedPhotoIds)
    if (newSet.has(photoId)) {
      newSet.delete(photoId)
    } else {
      newSet.add(photoId)
    }
    setSelectedPhotoIds(newSet)
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

  const handleSaveSong = async () => {
    if (!songForm.title || !songForm.artist || !audioFile) {
      alert('请填写标题、艺术家并上传音频文件')
      return
    }

    setUploadingMusic(true)
    try {
      // 1. Upload Audio
      const audioExt = audioFile.name.split('.').pop()
      const audioFileName = `audio/${Date.now()}.${audioExt}`
      const { error: audioError } = await supabase.storage
        .from('music')
        .upload(audioFileName, audioFile)

      if (audioError) throw audioError

      const { data: { publicUrl: audioUrl } } = supabase.storage
        .from('music')
        .getPublicUrl(audioFileName)

      // 2. Upload Cover (if exists)
      let coverUrl = ''
      if (coverFile) {
        const coverExt = coverFile.name.split('.').pop()
        const coverFileName = `covers/${Date.now()}.${coverExt}`
        const { error: coverError } = await supabase.storage
          .from('music')
          .upload(coverFileName, coverFile)

        if (coverError) throw coverError

        const { data: { publicUrl } } = supabase.storage
          .from('music')
          .getPublicUrl(coverFileName)
        coverUrl = publicUrl
      }

      // 3. Insert Record
      const { error } = await supabase
        .from('songs')
        .insert([{
          ...songForm,
          audio_url: audioUrl,
          cover_url: coverUrl || null,
          duration: 0 // TODO: Extract duration if possible, or let user input
        }])

      if (error) throw error

      alert('音乐上传成功！')
      setMusicView('list')
      setSongForm({
        title: '',
        artist: '',
        album: '',
        color: '#60a5fa',
        dark_color: '#1d4ed8',
        lyrics: ''
      })
      setAudioFile(null)
      setCoverFile(null)
      fetchSongs()

    } catch (error: any) {
      console.error('Error uploading song:', error)
      alert('上传失败: ' + error.message)
    } finally {
      setUploadingMusic(false)
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
                  icon={<FaImage className="text-2xl" />}
                  color="purple"
                />
                <StatCard
                  title="总音乐数"
                  value={songs.length}
                  icon={<FaMusic className="text-2xl" />}
                  color="blue"
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
                    <Image
                      src={photo.image_url}
                      alt={photo.title || ''}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
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

          {/* Trips Management */}
          {activeTab === 'trips' && (
            <div className="space-y-6 animate-fade-in">
              {/* ... existing trips code ... */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">行程管理</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTripView('list')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${tripView === 'list' ? 'bg-white shadow text-pink-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    列表视图
                  </button>
                  <button
                    onClick={() => {
                      setTripView('create')
                      handleCancelTripEdit()
                    }}
                    className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium shadow-lg shadow-pink-500/30 transition-all flex items-center gap-2"
                  >
                    <FaPlus /> 新建行程
                  </button>
                </div>
              </div>

              {tripView === 'list' ? (
                // List View
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                  {trips.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-gray-500">暂无行程</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-slate-700">
                      {trips.map((trip) => (
                        <div key={trip.id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors flex justify-between items-start group">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{trip.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                              {trip.start_date} - {trip.end_date} · {trip.status === 'completed' ? '已完成' : '计划中'}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-1 text-sm max-w-2xl">
                              {trip.description}
                            </p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditTrip(trip)}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              title="编辑"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteTrip(trip.id)}
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
                // Create/Edit View
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 max-w-2xl mx-auto">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                    {editingTrip ? '编辑行程' : '新建行程'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">标题</label>
                      <input
                        type="text"
                        value={tripForm.title}
                        onChange={(e) => setTripForm({ ...tripForm, title: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500"
                        placeholder="例如：日本之旅 2024"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">开始日期</label>
                        <input
                          type="date"
                          value={tripForm.start_date}
                          onChange={(e) => setTripForm({ ...tripForm, start_date: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">结束日期</label>
                        <input
                          type="date"
                          value={tripForm.end_date}
                          onChange={(e) => setTripForm({ ...tripForm, end_date: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">描述</label>
                      <textarea
                        value={tripForm.description}
                        onChange={(e) => setTripForm({ ...tripForm, description: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 h-32 resize-none"
                        placeholder="写点关于这次旅行的介绍..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">状态</label>
                      <select
                        value={tripForm.status}
                        onChange={(e) => setTripForm({ ...tripForm, status: e.target.value as 'planned' | 'completed' })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="completed">已完成</option>
                        <option value="planned">计划中</option>
                      </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleCancelTripEdit}
                        className="flex-1 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleSaveTrip}
                        className="flex-1 py-2 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/30"
                      >
                        保存
                      </button>
                    </div>

                    {/* Photo Selection */}
                    <div className="pt-8 border-t border-gray-100 dark:border-slate-700">
                      <h4 className="text-md font-bold text-gray-900 dark:text-white mb-4">选择照片 ({selectedPhotoIds.size})</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-1">
                        {photos.map(photo => (
                          <div
                            key={photo.id}
                            onClick={() => togglePhotoSelection(photo.id)}
                            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedPhotoIds.has(photo.id)
                              ? 'border-pink-500 ring-2 ring-pink-500/30'
                              : 'border-transparent hover:border-gray-300 dark:hover:border-slate-600'
                              }`}
                          >
                            <Image
                              src={photo.image_url}
                              alt={photo.title || ''}
                              fill
                              className="object-cover"
                              sizes="100px"
                            />
                            {selectedPhotoIds.has(photo.id) && (
                              <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                                <div className="bg-pink-500 text-white rounded-full p-1">
                                  <FaCheck className="text-xs" />
                                </div>
                              </div>
                            )}
                            {/* Show if assigned to another trip */}
                            {photo.trip_id && photo.trip_id !== editingTrip?.id && !selectedPhotoIds.has(photo.id) && (
                              <div className="absolute top-1 right-1 bg-gray-800/70 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                已分配
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Music Management */}
          {activeTab === 'music' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">音乐管理</h2>
                <span className="text-gray-500">{songs.length} 首歌曲</span>
              </div>

              {/* Upload Area */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">上传新歌曲</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="歌曲标题"
                      value={songForm.title}
                      onChange={(e) => setSongForm({ ...songForm, title: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="艺术家"
                      value={songForm.artist}
                      onChange={(e) => setSongForm({ ...songForm, artist: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500"
                    />
                    <input
                      type="text"
                      placeholder="专辑名称"
                      value={songForm.album}
                      onChange={(e) => setSongForm({ ...songForm, album: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">主题色</label>
                        <input
                          type="color"
                          value={songForm.color}
                          onChange={(e) => setSongForm({ ...songForm, color: e.target.value })}
                          className="w-full h-10 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">深色主题</label>
                        <input
                          type="color"
                          value={songForm.dark_color}
                          onChange={(e) => setSongForm({ ...songForm, dark_color: e.target.value })}
                          className="w-full h-10 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <textarea
                      placeholder="歌词 (每行一句)"
                      value={songForm.lyrics}
                      onChange={(e) => setSongForm({ ...songForm, lyrics: e.target.value })}
                      className="w-full h-32 px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 resize-none"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative group">
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioFileSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-xl transition-colors ${audioFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-pink-500'}`}>
                          <FaMusic className={audioFile ? 'text-green-500' : 'text-gray-400'} />
                          <span className="text-xs mt-2 text-gray-500">{audioFile ? audioFile.name : '选择音频文件'}</span>
                        </div>
                      </div>
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-xl transition-colors ${coverFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-pink-500'}`}>
                          <FaImage className={coverFile ? 'text-green-500' : 'text-gray-400'} />
                          <span className="text-xs mt-2 text-gray-500">{coverFile ? coverFile.name : '选择封面图片'}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleUploadSong}
                      disabled={uploadingMusic || !audioFile || !songForm.title}
                      className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold shadow-lg shadow-pink-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {uploadingMusic ? '上传中...' : <><FaUpload /> 上传歌曲</>}
                    </button>
                  </div>
                </div>
              </div>

              {/* Songs List */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                {songs.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-500">暂无歌曲</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-slate-700">
                    {songs.map((song) => (
                      <div key={song.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-4 group">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image src={song.cover_url || '/images/music-placeholder.jpg'} alt={song.title} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white">{song.title}</h4>
                          <p className="text-sm text-gray-500">{song.artist} · {song.album}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteSong(song.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          title="删除"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
