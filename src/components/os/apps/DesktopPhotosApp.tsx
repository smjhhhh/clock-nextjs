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

    return (
        <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-black dark:text-white overflow-hidden">
            {/* Sidebar */}
            <div className="w-52 bg-[#f5f5f7] dark:bg-[#2c2c2e] flex flex-col border-r border-gray-200 dark:border-black/20 pt-4 pb-4">
                <div className="flex-1 overflow-y-auto px-2 space-y-6">
                    <div>
                        <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Library</h3>
                        <SidebarItem icon={<FaImage className="text-blue-500" />} label="Library" active />
                        <SidebarItem icon={<FaHeart className="text-red-500" />} label="Favorites" />
                        <SidebarItem icon={<FaTrash className="text-gray-500" />} label="Trash" />
                    </div>

                    <div>
                        <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Albums</h3>
                        <SidebarItem icon={<FaMapMarkerAlt className="text-green-500" />} label="Places" />
                        <SidebarItem icon={<FaCalendarAlt className="text-orange-500" />} label="Recents" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="h-12 flex items-center justify-between px-4 border-b border-gray-200 dark:border-white/5">
                    <h1 className="text-lg font-bold">Library</h1>
                    <div className="flex items-center gap-2">
                        {/* Zoom Slider Placeholder */}
                        <span className="text-xs text-gray-500">Zoom</span>
                        <input type="range" className="w-20 h-1 bg-gray-300 rounded-lg" />
                    </div>
                </div>

                {/* Photo Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className="aspect-square relative group cursor-pointer bg-gray-100 dark:bg-white/5 rounded-md overflow-hidden"
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                <Image
                                    src={photo.image_url}
                                    alt={photo.title || 'Photo'}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-3 px-3 py-1.5 rounded-md cursor-pointer text-sm font-medium transition-colors ${active ? 'bg-gray-200 dark:bg-white/10 text-blue-500' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5'}`}>
            <span className="text-base w-5 flex justify-center">{icon}</span>
            {label}
        </div>
    )
}
