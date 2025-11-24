'use client'

import { useState, useRef, useEffect } from 'react'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaCompactDisc } from 'react-icons/fa'
import Image from 'next/image'

interface Song {
    title: string
    artist: string
    cover: string
    duration: string
    color: string
}

const PLAYLIST: Song[] = [
    {
        title: 'First Love',
        artist: '宇多田ヒカル',
        cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop',
        duration: '4:17',
        color: '#3b82f6'
    },
    {
        title: '无地自容',
        artist: '黑豹乐队',
        cover: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1974&auto=format&fit=crop',
        duration: '5:32',
        color: '#ef4444'
    },
    {
        title: '童年',
        artist: '罗大佑',
        cover: 'https://images.unsplash.com/photo-1459749411177-287ce112a8bf?q=80&w=2070&auto=format&fit=crop',
        duration: '3:45',
        color: '#eab308'
    }
]

export default function VinylPlayer() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [progress, setProgress] = useState(0)
    const progressInterval = useRef<NodeJS.Timeout | null>(null)
    const [visualizerData, setVisualizerData] = useState<number[]>(new Array(20).fill(10))

    const currentSong = PLAYLIST[currentIndex]

    // Progress Timer
    useEffect(() => {
        if (isPlaying) {
            progressInterval.current = setInterval(() => {
                setProgress(p => (p >= 100 ? 0 : p + 0.2))
            }, 100)
        } else {
            if (progressInterval.current) clearInterval(progressInterval.current)
        }
        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current)
        }
    }, [isPlaying])

    // Visualizer Animation
    useEffect(() => {
        let animationFrame: number

        const animate = () => {
            if (isPlaying) {
                setVisualizerData(prev => prev.map(() => Math.random() * 40 + 10))
            } else {
                setVisualizerData(new Array(20).fill(5))
            }
            animationFrame = requestAnimationFrame(animate)
        }

        // Slow down the update rate for a more "chill" visualizer
        const interval = setInterval(() => {
            if (isPlaying) {
                setVisualizerData(prev => prev.map(() => Math.max(10, Math.random() * 100)))
            } else {
                setVisualizerData(new Array(20).fill(5))
            }
        }, 100)

        return () => clearInterval(interval)
    }, [isPlaying])

    const togglePlay = () => setIsPlaying(!isPlaying)

    const nextSong = () => {
        setCurrentIndex((prev) => (prev + 1) % PLAYLIST.length)
        setProgress(0)
        setIsPlaying(true)
    }

    const prevSong = () => {
        setCurrentIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length)
        setProgress(0)
        setIsPlaying(true)
    }

    return (
        <div className="relative overflow-hidden rounded-[2rem] transition-all duration-500 group hover:shadow-2xl hover:shadow-black/20 h-full">
            {/* Dynamic Ambient Background */}
            <div
                className="absolute inset-0 opacity-40 dark:opacity-30 transition-colors duration-1000 blur-3xl"
                style={{ backgroundColor: currentSong.color }}
            />

            {/* Glass Container */}
            <div className="relative z-10 backdrop-blur-2xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-white/10 p-8 h-full flex flex-col justify-between">

                {/* Top Bar */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3 bg-white/40 dark:bg-black/20 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md shadow-sm">
                        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isPlaying ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-gray-400'}`} />
                        <span className="text-xs font-bold tracking-widest text-gray-600 dark:text-gray-300 uppercase font-mono">VINYL.OS</span>
                    </div>
                    <FaCompactDisc className={`text-2xl text-gray-500 dark:text-gray-400 opacity-80 ${isPlaying ? 'animate-spin-slow' : ''}`} />
                </div>

                {/* Main Vinyl Area */}
                <div className="relative flex justify-center items-center py-2 mb-8 perspective-1000">

                    {/* Tone Arm */}
                    <div
                        className={`absolute -top-4 right-4 w-28 h-40 z-30 transition-transform duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-[24px_24px] pointer-events-none filter drop-shadow-2xl ${isPlaying ? 'rotate-[28deg]' : 'rotate-0'}`}
                    >
                        {/* Base */}
                        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-b from-gray-200 to-gray-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.2)] border border-gray-300" />
                        {/* Arm */}
                        <div className="absolute top-10 right-9 w-2 h-32 bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 rounded-full origin-top transform -rotate-6 shadow-lg" />
                        {/* Head */}
                        <div className="absolute bottom-2 right-12 w-10 h-14 bg-gray-800 rounded-md transform rotate-[20deg] shadow-xl border-t border-gray-600 flex items-center justify-center">
                            <div className="w-1 h-8 bg-gray-600/50 rounded-full" />
                        </div>
                    </div>

                    {/* The Record */}
                    <div className="relative group-hover:scale-105 transition-transform duration-700 ease-out">
                        {/* Shadow */}
                        <div className="absolute inset-0 rounded-full bg-black/50 blur-2xl transform translate-y-6 scale-90" />

                        <div
                            className={`relative w-64 h-64 rounded-full bg-[#111] shadow-[0_0_0_1px_#333,0_20px_40px_-10px_rgba(0,0,0,0.6)] flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}
                            style={{
                                animationDuration: '4s',
                                background: 'radial-gradient(circle at 30% 30%, #2a2a2a 0%, #000 100%)'
                            }}
                        >
                            {/* Realistic Grooves */}
                            <div className="absolute inset-1 rounded-full opacity-30"
                                style={{
                                    background: 'repeating-radial-gradient(#444 0, #111 2px, #111 4px)'
                                }}
                            />

                            {/* Dynamic Light Reflection (Anisotropic) */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rotate-45" />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-transparent via-white/5 to-transparent opacity-50 pointer-events-none -rotate-45" />

                            {/* Album Art */}
                            <div className="w-28 h-28 rounded-full overflow-hidden relative z-10 border-[3px] border-[#1a1a1a] shadow-inner">
                                <Image
                                    src={currentSong.cover}
                                    alt="Cover"
                                    fill
                                    className="object-cover"
                                />
                                {/* Center Spindle */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border border-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info & Visualizer */}
                <div className="space-y-6">
                    <div className="text-center space-y-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{currentSong.title}</h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">{currentSong.artist}</p>
                    </div>

                    {/* Audio Visualizer */}
                    <div className="flex items-end justify-center gap-1 h-12 mb-2 px-4">
                        {visualizerData.map((height, i) => (
                            <div
                                key={i}
                                className="w-1.5 bg-gray-800 dark:bg-white/80 rounded-t-full transition-all duration-100 ease-out opacity-60"
                                style={{
                                    height: `${height}%`,
                                    backgroundColor: isPlaying ? currentSong.color : undefined
                                }}
                            />
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-10">
                        <button
                            onClick={prevSong}
                            className="p-4 rounded-full text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-90"
                        >
                            <FaStepBackward className="text-xl" />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-all active:scale-95 hover:shadow-2xl group/play"
                            style={{
                                background: `linear-gradient(135deg, ${currentSong.color}, ${currentSong.color}dd)`
                            }}
                        >
                            {isPlaying ? (
                                <FaPause className="text-2xl drop-shadow-md" />
                            ) : (
                                <FaPlay className="ml-1 text-2xl drop-shadow-md group-hover/play:scale-110 transition-transform" />
                            )}
                        </button>

                        <button
                            onClick={nextSong}
                            className="p-4 rounded-full text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-90"
                        >
                            <FaStepForward className="text-xl" />
                        </button>
                    </div>
                </div>

            </div>

            <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>
        </div>
    )
}
