'use client'

import { useState, useRef, useEffect } from 'react'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaList, FaMusic, FaSearch, FaBroadcastTower, FaCompactDisc } from 'react-icons/fa'
import Image from 'next/image'
import { supabase, Song } from '@/lib/supabase'

export default function DesktopMusicApp({ importedSongs = [] }: { importedSongs?: Song[] }) {
    const [songs, setSongs] = useState<Song[]>([])
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [draggedSongIndex, setDraggedSongIndex] = useState<number | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const progressInterval = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        fetchSongs()
    }, [])

    useEffect(() => {
        if (importedSongs.length > 0) {
            setSongs(prev => {
                const existingIds = new Set(prev.map(s => s.id))
                const newSongs = importedSongs.filter(s => !existingIds.has(s.id))
                return [...newSongs, ...prev]
            })
        }
    }, [importedSongs])

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
            audioRef.current.volume = volume
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

    const playSong = (index: number) => {
        setCurrentIndex(index)
        setProgress(0)
        setIsPlaying(true)
    }

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '0:00'
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleDragStart = (index: number) => {
        setDraggedSongIndex(index)
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        if (draggedSongIndex === null || draggedSongIndex === index) return

        const newSongs = [...songs]
        const draggedSong = newSongs[draggedSongIndex]
        newSongs.splice(draggedSongIndex, 1)
        newSongs.splice(index, 0, draggedSong)

        setSongs(newSongs)
        setDraggedSongIndex(index)

        if (currentIndex === draggedSongIndex) setCurrentIndex(index)
        else if (currentIndex === index && draggedSongIndex < index) setCurrentIndex(currentIndex - 1)
        else if (currentIndex === index && draggedSongIndex > index) setCurrentIndex(currentIndex + 1)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDraggedSongIndex(null)
    }

    if (!currentSong) return <div className="flex items-center justify-center h-full text-gray-500">Loading Library...</div>

    return (
        <div id="music-app-drop-zone" className="flex h-full bg-white dark:bg-[#1e1e1e] text-black dark:text-white overflow-hidden">
            {/* Sidebar */}
            <div className="w-60 bg-[#f5f5f7] dark:bg-[#2c2c2e] flex flex-col border-r border-gray-200 dark:border-black/20 pt-4 pb-4">
                <div className="px-4 mb-6">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-gray-200 dark:bg-[#3a3a3c] rounded-lg py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2 space-y-6">
                    <div>
                        <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Apple Music</h3>
                        <SidebarItem icon={<FaPlay className="text-pink-500" />} label="Listen Now" />
                        <SidebarItem icon={<FaCompactDisc className="text-pink-500" />} label="Browse" />
                        <SidebarItem icon={<FaBroadcastTower className="text-pink-500" />} label="Radio" />
                    </div>

                    <div>
                        <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Library</h3>
                        <SidebarItem icon={<FaMusic className="text-pink-500" />} label="Songs" active />
                        <SidebarItem icon={<FaCompactDisc className="text-pink-500" />} label="Albums" />
                        <SidebarItem icon={<FaList className="text-pink-500" />} label="Playlists" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="h-16 flex items-center px-8 border-b border-gray-200 dark:border-white/5">
                    <h1 className="text-3xl font-bold">Songs</h1>
                </div>

                {/* Song List */}
                <div className="flex-1 overflow-y-auto p-0">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-white dark:bg-[#1e1e1e] z-10 border-b border-gray-200 dark:border-white/5 text-gray-500 text-sm">
                            <tr>
                                <th className="py-2 px-4 w-12 font-medium">#</th>
                                <th className="py-2 px-4 font-medium">Title</th>
                                <th className="py-2 px-4 font-medium">Artist</th>
                                <th className="py-2 px-4 font-medium">Album</th>
                                <th className="py-2 px-4 font-medium text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {songs.map((song, index) => (
                                <tr
                                    key={song.id}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDrop={handleDrop}
                                    onClick={() => playSong(index)}
                                    className={`group cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 ${currentIndex === index ? 'bg-gray-100 dark:bg-white/10 text-pink-500' : ''} ${draggedSongIndex === index ? 'opacity-50' : ''}`}
                                >
                                    <td className="py-3 px-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                                        {currentIndex === index && isPlaying ? (
                                            <div className="w-3 h-3 flex items-end gap-0.5">
                                                <div className="w-1 bg-pink-500 animate-[bounce_1s_infinite] h-full" />
                                                <div className="w-1 bg-pink-500 animate-[bounce_1.2s_infinite] h-2/3" />
                                                <div className="w-1 bg-pink-500 animate-[bounce_0.8s_infinite] h-full" />
                                            </div>
                                        ) : (
                                            <span className="group-hover:hidden">{index + 1}</span>
                                        )}
                                        <FaPlay className="hidden group-hover:block w-3 h-3" />
                                    </td>
                                    <td className="py-3 px-4 font-medium flex items-center gap-3">
                                        <div className="w-8 h-8 relative rounded overflow-hidden bg-gray-200">
                                            {song.cover_url && <Image src={song.cover_url} alt={song.title} fill className="object-cover" />}
                                        </div>
                                        {song.title}
                                    </td>
                                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{song.artist}</td>
                                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{song.album}</td>
                                    <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-400">{formatTime(song.duration || 239)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Player Bar */}
                <div className="h-20 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-t border-gray-200 dark:border-black/20 flex items-center px-4 gap-4">
                    {/* Controls */}
                    <div className="flex items-center gap-4 w-1/4">
                        <button onClick={prevSong} className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"><FaStepBackward /></button>
                        <button onClick={togglePlay} className="text-2xl text-black dark:text-white hover:scale-105 transition-transform">
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </button>
                        <button onClick={nextSong} className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"><FaStepForward /></button>
                    </div>

                    {/* Progress */}
                    <div className="flex-1 flex flex-col items-center gap-1 max-w-xl">
                        <div className="flex items-center gap-2 text-xs text-gray-500 w-full font-medium font-mono">
                            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                            <div className="flex-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden relative group cursor-pointer">
                                <div
                                    className="absolute top-0 left-0 h-full bg-gray-500 dark:bg-gray-400 group-hover:bg-pink-500 transition-colors"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span>-{formatTime((duration || 0) - (audioRef.current?.currentTime || 0))}</span>
                        </div>
                        <div className="text-xs font-medium text-gray-900 dark:text-white">
                            {currentSong.title} <span className="text-gray-500 mx-1">•</span> {currentSong.artist}
                        </div>
                    </div>

                    {/* Volume */}
                    <div className="w-1/4 flex items-center justify-end gap-2">
                        <FaVolumeUp className="text-gray-500 text-xs" />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-24 h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-gray-500 hover:accent-pink-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-3 px-3 py-1.5 rounded-md cursor-pointer text-sm font-medium transition-colors ${active ? 'bg-gray-200 dark:bg-white/10 text-pink-500' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-white/5'}`}>
            <span className="text-base w-5 flex justify-center">{icon}</span>
            {label}
        </div>
    )
}
