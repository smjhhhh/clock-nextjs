'use client'

import { useEffect, useState } from 'react'
import { supabase, Trip, Photo } from '@/lib/supabase'
import PhotoMap from '@/components/gallery/PhotoMap'
import { Link } from '@/navigation'
import Image from 'next/image'
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'

export default function TravelPage() {
    const [trips, setTrips] = useState<Trip[]>([])
    const [mapPhotos, setMapPhotos] = useState<Photo[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            // Fetch trips
            const { data: tripsData } = await supabase
                .from('trips')
                .select('*')
                .order('start_date', { ascending: false })

            if (tripsData) setTrips(tripsData)

            // Fetch photos with location for the global map
            const { data: photosData } = await supabase
                .from('photos')
                .select('*')
                .not('latitude', 'is', null)
                .not('longitude', 'is', null)
                .eq('is_public', true)

            if (photosData) setMapPhotos(photosData)

            setLoading(false)
        }

        fetchData()
    }, [])

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            {/* Hero Map Section */}
            <div className="h-[60vh] w-full relative">
                <PhotoMap photos={mapPhotos} className="h-full rounded-none" />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-white dark:to-slate-900" />
                <div className="absolute bottom-0 left-0 w-full p-8 pb-24 bg-gradient-to-t from-white dark:from-slate-900 to-transparent">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                            我的足迹 🌍
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                            探索世界，记录每一个难忘的瞬间。
                            <br />
                            <span className="text-base opacity-80">
                                已探索 {trips.length} 次旅程，点亮 {mapPhotos.length} 个坐标。
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Timeline Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-12 relative z-10">
                <div className="space-y-12">
                    {trips.map((trip, index) => (
                        <Link
                            href={`/travel/${trip.id}`}
                            key={trip.id}
                            className="block group"
                        >
                            <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 dark:border-slate-700">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                                    {/* Image Side */}
                                    <div className="relative h-64 md:h-96 overflow-hidden">
                                        {trip.cover_image_url ? (
                                            <Image
                                                src={trip.cover_image_url}
                                                alt={trip.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                                                <FaMapMarkerAlt className="text-4xl text-gray-400" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                                    </div>

                                    {/* Content Side */}
                                    <div className="p-8 md:p-12 flex flex-col justify-center relative">
                                        {/* Connector Line (Visual decoration) */}
                                        <div className="absolute left-0 top-1/2 -translate-x-1/2 w-4 h-4 bg-pink-500 rounded-full hidden md:block" />

                                        <div className="flex items-center gap-2 text-pink-500 font-medium mb-4">
                                            <FaCalendarAlt />
                                            <span>{trip.start_date} — {trip.end_date}</span>
                                        </div>

                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-pink-500 transition-colors">
                                            {trip.title}
                                        </h2>

                                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                                            {trip.description || '暂无描述...'}
                                        </p>

                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className={`px-3 py-1 rounded-full ${trip.status === 'completed'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                {trip.status === 'completed' ? '已完成' : '计划中'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
