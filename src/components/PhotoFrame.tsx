'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, Photo } from '@/lib/supabase'

export default function PhotoFrame() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetchPublicPhotos()
  }, [])

  // Auto slideshow
  useEffect(() => {
    if (photos.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % photos.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [photos.length])

  const fetchPublicPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw error
      setPhotos(data || [])
    } catch (error) {
      console.error('Failed to fetch photos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="aspect-square bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>📸</span>
          <span>Gallery</span>
        </h3>
        <div className="aspect-square bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
          <Link
            href="/gallery"
            className="text-gray-500 dark:text-gray-400 text-center p-4 hover:text-pink-500 transition-colors"
          >
            <div className="text-3xl mb-2">🖼️</div>
            <p className="text-sm">No public photos yet</p>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span>📸</span>
          <span>Gallery</span>
        </h3>
        <Link
          href="/gallery"
          className="text-xs text-pink-500 hover:text-pink-600 font-medium"
        >
          View all →
        </Link>
      </div>

      {/* Photo frame - slideshow */}
      <div className="relative aspect-square bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/10 rounded-xl p-3 shadow-inner">
        {/* Frame border effect */}
        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg border-4 border-amber-200 dark:border-amber-700">
          <img
            src={photos[currentIndex].image_url}
            alt="Photo"
            className="w-full h-full object-cover transition-opacity duration-500"
          />
        </div>

        {/* Slideshow indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
            {photos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex
                    ? 'bg-pink-500'
                    : 'bg-gray-400/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Photo thumbnails grid */}
      {photos.length > 1 && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {photos.slice(0, 3).map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => setCurrentIndex(idx)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex
                  ? 'border-pink-500 scale-105'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={photo.image_url}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
