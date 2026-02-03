'use client'

import { useState, useEffect } from 'react'
import { supabase, Photo } from '@/lib/supabase'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Navbar from '@/components/layout/Navbar'
import dynamic from 'next/dynamic'
import { FaTh, FaMapMarkedAlt } from 'react-icons/fa'
import Image from 'next/image'

// Dynamically import Map to avoid SSR issues with Leaflet
const PhotoMap = dynamic(() => import('@/components/gallery/PhotoMap'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-lg"></div>
})

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')

  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 12

  useEffect(() => {
    fetchPhotos(0)
  }, [])

  const fetchPhotos = async (pageNumber = 0) => {
    if (pageNumber === 0) setLoading(true)
    try {
      const from = pageNumber * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('is_public', true)
        .order('taken_at', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error

      if (data) {
        if (pageNumber === 0) {
          setPhotos(data)
        } else {
          setPhotos(prev => [...prev, ...data])
        }
        setHasMore(data.length === PAGE_SIZE)
      }
    } catch (error) {
      console.error('Failed to fetch photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPhotos(nextPage)
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const lightboxSlides = photos.map(photo => ({
    src: photo.image_url,
    alt: photo.title || 'Photo',
    description: (
      <div className="text-center">
        <p>{photo.description || ''}</p>
        {photo.taken_at && (
          <p className="text-xs text-gray-400 mt-1">
            Taken: {new Date(photo.taken_at).toLocaleDateString()}
            {photo.camera_model && ` • ${photo.camera_model}`}
          </p>
        )}
      </div>
    )
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Smart Gallery
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {photos.length} memories captured
            </p>
          </div>

          {/* View Switcher */}
          <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm mt-4 md:mt-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${viewMode === 'grid'
                ? 'bg-pink-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
            >
              <FaTh className="mr-2" /> Grid
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${viewMode === 'map'
                ? 'bg-pink-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
            >
              <FaMapMarkedAlt className="mr-2" /> Map
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your memories...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📸</p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No photos yet. Upload some to get started!
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="group relative bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                  >
                    {/* Photo */}
                    <div
                      onClick={() => openLightbox(index)}
                      className="cursor-pointer aspect-square overflow-hidden relative"
                    >
                      <Image
                        src={photo.image_url}
                        alt={photo.title || 'Photo'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Badges */}
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        {photo.latitude && (
                          <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            📍 Location
                          </span>
                        )}
                        {photo.camera_model && (
                          <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            📷 {photo.camera_model}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Photo Info */}
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {photo.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(photo.taken_at || photo.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <PhotoMap photos={photos} />
            )}

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  className="px-6 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-full shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-slate-700 font-medium"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025 Yoru. Smart Album.</p>
        </div>
      </footer>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
      />
    </div>
  )
}
