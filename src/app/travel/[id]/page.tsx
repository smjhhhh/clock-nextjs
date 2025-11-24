'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase, Trip, Photo } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaCamera } from 'react-icons/fa'
import PhotoMap from '@/components/gallery/PhotoMap'

export default function TripDetailPage() {
    const params = useParams()
    const id = params?.id as string
    const [trip, setTrip] = useState<Trip | null>(null)
    const [photos, setPhotos] = useState<Photo[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return

        const fetchData = async () => {
            // Fetch trip details
            const { data: tripData } = await supabase
                .from('trips')
                .select('*')
                .eq('id', id)
                .single()

            if (tripData) setTrip(tripData)

            // Fetch photos for this trip
            const { data: photosData } = await supabase
                .from('photos')
                .select('*')
                .eq('trip_id', id)
                .eq('is_public', true)
                .order('taken_at', { ascending: true })

            if (photosData) setPhotos(photosData)

            setLoading(false)
        }

        fetchData()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        )
    }

    if (!trip) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">未找到行程</h1>
                <Link href="/travel" className="text-pink-500 hover:underline">
                    返回旅行列表
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            {/* Hero Section */}
            <div className="relative h-[50vh] md:h-[70vh] w-full">
                {trip.cover_image_url ? (
                    <Image
                        src={trip.cover_image_url}
                        alt={trip.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center">
                        <FaMapMarkerAlt className="text-6xl text-gray-400" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-8 left-8 z-10">
                    <Link
                        href="/travel"
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full"
                    >
                        <FaArrowLeft /> 返回列表
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 text-pink-400 font-medium mb-4">
                            <FaCalendarAlt />
                            <span>{trip.start_date} — {trip.end_date}</span>
                            <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-white border border-white/20">
                                {trip.status === 'completed' ? '已完成' : '计划中'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                            {trip.title}
                        </h1>
                        <p className="text-lg text-gray-200 max-w-2xl leading-relaxed drop-shadow-md">
                            {trip.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-2xl text-center">
                        <div className="text-3xl font-bold text-pink-500 mb-1">{photos.length}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">张照片</div>
                    </div>
                    {/* Add more stats if available, e.g. cities visited, distance traveled */}
                </div>

                {/* Map View (if photos have location) */}
                {photos.some(p => p.latitude && p.longitude) && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-pink-500" /> 足迹地图
                        </h2>
                        <PhotoMap photos={photos} className="h-[500px] rounded-2xl shadow-lg" />
                    </div>
                )}

                {/* Photo Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <FaCamera className="text-pink-500" /> 精彩瞬间
                    </h2>

                    {photos.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                            <p className="text-gray-500">本次行程暂无公开照片。</p>
                        </div>
                    ) : (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                            {photos.map((photo) => (
                                <div key={photo.id} className="break-inside-avoid group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                                    <Image
                                        src={photo.image_url}
                                        alt={photo.title || ''}
                                        width={800}
                                        height={600}
                                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <p className="text-white font-medium">{photo.title}</p>
                                        {photo.taken_at && (
                                            <p className="text-white/80 text-xs mt-1">
                                                {new Date(photo.taken_at).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
