'use client'

import { useState, useRef, useEffect } from 'react'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaEllipsisH } from 'react-icons/fa'
import Image from 'next/image'
import { supabase, Song } from '@/lib/supabase'

export default function AppleMusicPlayer() {
    const [songs, setSongs] = useState<Song[]>([])
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const progressInterval = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        fetchSongs()
    }, [])

    useEffect(() => {
        if (songs.length > 0) {
            if (!audioRef.current) {
                audioRef.current = new Audio(songs[currentIndex].audio_url)
                audioRef.current.addEventListener('ended', nextSong)
                audioRef.current.addEventListener('loadedmetadata', () => {
                    setDuration(audioRef.current?.duration || 0)
                })
            } else {
                audioRef.current.src = songs[currentIndex].audio_url
                if (isPlaying) audioRef.current.play()
            }
        }
    }, [currentIndex, songs])

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback failed", e))
                progressInterval.current = setInterval(() => {
                    if (audioRef.current) {
                        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
                    }
                }, 100)
            } else {
                audioRef.current.pause()
                if (progressInterval.current) clearInterval(progressInterval.current)
            }
        }
        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current)
        }
    }, [isPlaying])

    const fetchSongs = async () => {
        const { data } = await supabase.from('songs').select('*').order('created_at', { ascending: false })
        if (data && data.length > 0) {
            setSongs(data)
        }
    }

    const currentSong = songs[currentIndex]

    if (!currentSong) return null // Or loading state

    const togglePlay = () => setIsPlaying(!isPlaying)

    const nextSong = () => {
        setCurrentIndex((prev) => (prev + 1) % songs.length)
        setProgress(0)
        setIsPlaying(true)
    }

    const prevSong = () => {
        setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length)
        setProgress(0)
        setIsPlaying(true)
    }

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '0:00'
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] h-[500px] w-full shadow-2xl transition-all duration-500 group">
            {/* Animated Mesh Gradient Background */}
            <div className="absolute inset-0 bg-[#f5f5f7] dark:bg-[#1c1c1e] transition-colors duration-700">
                <div
                    className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-40 dark:opacity-30 blur-[100px] animate-blob"
                    style={{
                        background: `radial-gradient(circle at 50% 50%, ${currentSong.color || '#60a5fa'}, transparent 60%), radial-gradient(circle at 80% 20%, ${currentSong.dark_color || '#1d4ed8'}, transparent 50%)`
                    }}
                />
                <div className="absolute inset-0 bg-white/30 dark:bg-black/20 backdrop-blur-3xl" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 h-full flex flex-col p-8">

                {/* Album Art Area */}
                <div className="flex-1 flex items-center justify-center mb-8">
                    <div className={`relative w-64 h-64 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isPlaying ? 'scale-100' : 'scale-90'}`}>
                        {/* Diffused Colored Shadow */}
                        <div
                            className="absolute inset-4 rounded-[2rem] opacity-60 blur-2xl transition-colors duration-700"
                            style={{ backgroundColor: currentSong.color || '#60a5fa' }}
                        />

                        {/* Image Container */}
                        <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
                            <Image
                                src={currentSong.cover_url || '/images/music-placeholder.jpg'}
                                alt="Cover"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* Controls Area */}
                <div className="space-y-6">
                    {/* Title & Artist */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1 line-clamp-1">
                                {currentSong.title}
                            </h3>
                            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium line-clamp-1">
                                {currentSong.artist}
                            </p>
                        </div>
                        <a href="/music" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200/50 dark:bg-gray-700/50 text-gray-900 dark:text-white backdrop-blur-md hover:bg-gray-300/50 dark:hover:bg-gray-600/50 transition-colors" title="Open Full Player">
                            <FaEllipsisH className="text-sm" />
                        </a>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2 group/progress">
                        <div className="relative h-1.5 bg-gray-300/50 dark:bg-gray-700/50 rounded-full overflow-hidden cursor-pointer">
                            <div
                                className="absolute top-0 left-0 h-full bg-gray-900 dark:bg-white rounded-full transition-all duration-100 ease-linear"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                            <span>-{formatTime((duration || 0) - (audioRef.current?.currentTime || 0))}</span>
                        </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex items-center justify-center gap-10">
                        <button
                            onClick={prevSong}
                            className="text-3xl text-gray-900 dark:text-white opacity-60 hover:opacity-100 transition-opacity active:scale-90"
                        >
                            <FaStepBackward />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="text-5xl text-gray-900 dark:text-white hover:scale-105 transition-transform active:scale-95 drop-shadow-lg"
                        >
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </button>

                        <button
                            onClick={nextSong}
                            className="text-3xl text-gray-900 dark:text-white opacity-60 hover:opacity-100 transition-opacity active:scale-90"
                        >
                            <FaStepForward />
                        </button>
                    </div>

                    {/* Volume Slider (Visual Only) */}
                    <div className="flex items-center gap-3 pt-2">
                        <FaVolumeUp className="text-xs text-gray-400" />
                        <div className="flex-1 h-1 bg-gray-300/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                            <div className="h-full w-[80%] bg-gray-500 dark:bg-gray-400 rounded-full" />
                        </div>
                        <FaVolumeUp className="text-sm text-gray-500 dark:text-gray-300" />
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
      `}</style>
        </div>
    )
}
