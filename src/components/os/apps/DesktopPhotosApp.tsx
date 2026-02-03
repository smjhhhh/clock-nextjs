'use client'

import { useState, useEffect } from 'react'
import { FaImage, FaHeart, FaTrash, FaSearch, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa'
import Image from 'next/image'
import { supabase, Photo } from '@/lib/supabase'

export default function DesktopPhotosApp() {
    const [photos, setPhotos] = useState<Photo[]>([])
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

    useEffect(() => {
        fetchPhotos()
    }, [])

    const fetchPhotos = async () => {
        const { data } = await supabase.from('photos').select('*').order('created_at', { ascending: false })
        if (data) setPhotos(data)
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedPhoto) return
            if (e.key === 'ArrowRight') navigatePhoto(1)
            if (e.key === 'ArrowLeft') navigatePhoto(-1)
            if (e.key === 'Escape') setSelectedPhoto(null)
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedPhoto, photos])

    const navigatePhoto = (direction: number) => {
        if (!selectedPhoto) return
        const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id)
        if (currentIndex === -1) return

        const newIndex = (currentIndex + direction + photos.length) % photos.length
        setSelectedPhoto(photos[newIndex])
    }

    return (
        <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-black dark:text-white overflow-hidden font-sans relative">
            {/* Sidebar */}
            <div className="w-52 bg-gray-100/80 dark:bg-[#2c2c2e]/80 backdrop-blur-xl flex flex-col border-r border-gray-200 dark:border-white/10 pt-8 pb-4">
                <div className="flex-1 overflow-y-auto px-3 space-y-6">
                    <div>
                        <h3 className="px-3 text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Library</h3>
                        <SidebarItem icon={<FaImage className="text-blue-500" />} label="Library" active />
                        <SidebarItem icon={<FaHeart className="text-red-500" />} label="Favorites" />
                        <SidebarItem icon={<FaTrash className="text-gray-500" />} label="Trash" />
                    </div>

                    <div>
                        <h3 className="px-3 text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Albums</h3>
                        <SidebarItem icon={<FaMapMarkerAlt className="text-green-500" />} label="Places" />
                        <SidebarItem icon={<FaCalendarAlt className="text-orange-500" />} label="Recents" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#1e1e1e]">
                {/* Header */}
                <div className="window-drag-handle h-16 flex items-center justify-between px-6 pl-20 border-b border-gray-200 dark:border-white/5 cursor-move">
                    <h1 className="window-drag-handle text-2xl font-bold tracking-tight">Library</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-gray-100 dark:bg-white/10 rounded-lg p-0.5">
                            <button className="px-3 py-1 bg-white dark:bg-white/20 rounded-md shadow-sm text-xs font-medium">Years</button>
                            <button className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">Months</button>
                            <button className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">Days</button>
                            <button className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">All Photos</button>
                        </div>
                    </div>
                </div>

                {/* Photo Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className="aspect-square relative group cursor-pointer bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                <Image
                                    src={photo.image_url}
                                    alt={photo.title || 'Photo'}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-red-500 shadow-sm hover:scale-110 transition-transform">
                                        <FaHeart className="text-xs" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {selectedPhoto && (
                <div
                    className="absolute inset-0 z-50 bg-white dark:bg-[#1e1e1e] flex flex-col animate-in fade-in duration-200"
                    onClick={() => setSelectedPhoto(null)}
                >
                    {/* Lightbox Header */}
                    <div className="h-14 flex items-center justify-between px-4 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 absolute top-0 left-0 right-0 z-10">
                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null) }}
                            className="text-blue-500 font-medium text-sm hover:opacity-80"
                        >
                            <span className="text-lg mr-1">‹</span> Library
                        </button>
                        <span className="text-sm font-medium">{selectedPhoto.title || 'Untitled'}</span>
                        <button className="text-blue-500 font-medium text-sm hover:opacity-80">Edit</button>
                    </div>

                    {/* Image Container */}
                    <div className="flex-1 flex items-center justify-center p-8 relative group">
                        <button
                            className="absolute left-4 p-4 text-white/50 hover:text-white transition-colors z-20 opacity-0 group-hover:opacity-100"
                            onClick={(e) => { e.stopPropagation(); navigatePhoto(-1) }}
                        >
                            <span className="text-4xl">‹</span>
                        </button>

                        <div
                            className="relative w-full h-full max-w-5xl max-h-[70vh] shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedPhoto.image_url}
                                alt={selectedPhoto.title || 'Photo'}
                                fill
                                className="object-contain"
                            />
                        </div>

                        <button
                            className="absolute right-4 p-4 text-white/50 hover:text-white transition-colors z-20 opacity-0 group-hover:opacity-100"
                            onClick={(e) => { e.stopPropagation(); navigatePhoto(1) }}
                        >
                            <span className="text-4xl">›</span>
                        </button>
                    </div>

                    {/* Film Strip */}
                    <div className="h-20 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border-t border-gray-200 dark:border-white/5 flex items-center justify-center gap-2 overflow-x-auto px-4 absolute bottom-16 left-0 right-0 z-10" onClick={(e) => e.stopPropagation()}>
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className={`h-14 aspect-square relative cursor-pointer rounded-md overflow-hidden transition-all ${selectedPhoto.id === photo.id ? 'ring-2 ring-blue-500 scale-110 z-10' : 'opacity-50 hover:opacity-100'}`}
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                <Image src={photo.image_url} alt={photo.title || 'Thumbnail'} fill className="object-cover" />
                            </div>
                        ))}
                    </div>

                    {/* Lightbox Footer */}
                    <div
                        className="h-16 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border-t border-gray-200 dark:border-white/5 flex items-center justify-center gap-8 absolute bottom-0 left-0 right-0 z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                            <FaHeart className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                            <FaMapMarkerAlt className="text-gray-500 dark:text-gray-400" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                            <FaTrash className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 ${active ? 'bg-gray-200 dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}>
            <span className="text-lg w-6 flex justify-center opacity-80">{icon}</span>
            {label}
        </div>
    )
}
