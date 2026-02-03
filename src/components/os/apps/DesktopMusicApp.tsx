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

    const [view, setView] = useState<'list' | 'lyrics'>('list')

    if (!currentSong) return <div className="flex items-center justify-center h-full text-gray-500">Loading Library...</div>

    return (
        <div id="music-app-drop-zone" className="flex h-full bg-white dark:bg-[#1e1e1e] text-black dark:text-white overflow-hidden font-sans relative transition-colors duration-700"
            style={{
                background: view === 'lyrics' && currentSong.dark_color
                    ? `linear-gradient(to bottom right, ${currentSong.dark_color}, #1e1e1e)`
                    : undefined
            }}
        >
            {/* Sidebar */}
            <div className={`w-60 flex flex-col border-r pt-8 pb-4 z-10 transition-colors duration-500 ${view === 'lyrics'
                ? 'bg-black/20 border-white/10 text-white'
                : 'bg-gray-100/80 dark:bg-[#2c2c2e]/80 backdrop-blur-xl border-gray-200 dark:border-white/10'
                }`}>
                <div className="px-4 mb-6">
                    <div className="relative group">
                        <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-colors ${view === 'lyrics' ? 'text-white/50' : 'text-gray-400 group-focus-within:text-pink-500'}`} />
                        <input
                            type="text"
                            placeholder="Search"
                            className={`w-full rounded-lg py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 transition-all shadow-sm ${view === 'lyrics'
                                ? 'bg-white/10 text-white placeholder-white/50 focus:ring-white/30'
                                : 'bg-white dark:bg-white/10 focus:ring-pink-500/50'
                                }`}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 space-y-6">
                    <div>
                        <h3 className={`px-3 text-xs font-bold mb-2 uppercase tracking-wider ${view === 'lyrics' ? 'text-white/60' : 'text-gray-500 dark:text-gray-400'}`}>Apple Music</h3>
                        <SidebarItem icon={<FaPlay className={view === 'lyrics' ? 'text-white' : 'text-pink-500'} />} label="Listen Now" active={false} darkMode={view === 'lyrics'} />
                        <SidebarItem icon={<FaCompactDisc className={view === 'lyrics' ? 'text-white' : 'text-pink-500'} />} label="Browse" active={false} darkMode={view === 'lyrics'} />
                        <SidebarItem icon={<FaBroadcastTower className={view === 'lyrics' ? 'text-white' : 'text-pink-500'} />} label="Radio" active={false} darkMode={view === 'lyrics'} />
                    </div>

                    <div>
                        <h3 className={`px-3 text-xs font-bold mb-2 uppercase tracking-wider ${view === 'lyrics' ? 'text-white/60' : 'text-gray-500 dark:text-gray-400'}`}>Library</h3>
                        <SidebarItem icon={<FaMusic className={view === 'lyrics' ? 'text-white' : 'text-pink-500'} />} label="Songs" active={view === 'list'} darkMode={view === 'lyrics'} onClick={() => setView('list')} />
                        <SidebarItem icon={<FaCompactDisc className={view === 'lyrics' ? 'text-white' : 'text-pink-500'} />} label="Albums" active={false} darkMode={view === 'lyrics'} />
                        <SidebarItem icon={<FaList className={view === 'lyrics' ? 'text-white' : 'text-pink-500'} />} label="Playlists" active={false} darkMode={view === 'lyrics'} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 relative z0">
                {view === 'list' ? (
                    <>
                        {/* Header */}
                        <div className="window-drag-handle h-16 bg-[#f5f5f7] dark:bg-[#1c1c1e] border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 pl-20 shrink-0 cursor-move relative z-10">
                            <div className="flex items-center gap-4 window-drag-handle pointer-events-none">
                                <h1 className="text-4xl font-bold tracking-tight">Songs</h1>
                            </div>
                        </div>

                        {/* Song List */}
                        <div className="flex-1 overflow-y-auto p-0 scrollbar-hide bg-white dark:bg-[#1e1e1e]">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-sm z-10 border-b border-gray-200 dark:border-white/5 text-gray-500 text-xs font-medium uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3 px-6 w-16 text-center">#</th>
                                        <th className="py-3 px-4">Title</th>
                                        <th className="py-3 px-4">Artist</th>
                                        <th className="py-3 px-4">Album</th>
                                        <th className="py-3 px-6 text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-100 dark:divide-white/5">
                                    {songs.map((song, index) => (
                                        <tr
                                            key={song.id}
                                            draggable
                                            onDragStart={() => handleDragStart(index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDrop={handleDrop}
                                            onClick={() => playSong(index)}
                                            className={`group cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${currentIndex === index ? 'bg-gray-100 dark:bg-white/10' : ''} ${draggedSongIndex === index ? 'opacity-50' : ''}`}
                                        >
                                            <td className="py-3 px-6 text-center text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 w-16">
                                                {currentIndex === index && isPlaying ? (
                                                    <div className="w-3 h-3 mx-auto flex items-end gap-0.5">
                                                        <div className="w-1 bg-pink-500 animate-[bounce_1s_infinite] h-full" />
                                                        <div className="w-1 bg-pink-500 animate-[bounce_1.2s_infinite] h-2/3" />
                                                        <div className="w-1 bg-pink-500 animate-[bounce_0.8s_infinite] h-full" />
                                                    </div>
                                                ) : (
                                                    <div className="relative w-full h-full flex items-center justify-center">
                                                        <span className="group-hover:hidden">{index + 1}</span>
                                                        <FaPlay className="hidden group-hover:block w-3 h-3 text-gray-600 dark:text-gray-300" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 font-medium flex items-center gap-4">
                                                <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gray-200 shadow-sm group-hover:shadow transition-shadow">
                                                    {song.cover_url && <Image src={song.cover_url} alt={song.title} fill className="object-cover" />}
                                                </div>
                                                <span className={currentIndex === index ? 'text-pink-600 dark:text-pink-400' : 'text-gray-900 dark:text-white'}>
                                                    {song.title}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{song.artist}</td>
                                            <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{song.album}</td>
                                            <td className="py-3 px-6 text-right text-gray-500 dark:text-gray-400 font-mono text-xs">{formatTime(song.duration || 239)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-12 overflow-y-auto">
                        <div className="flex gap-12 max-w-5xl w-full items-center">
                            {/* Album Art (Large) */}
                            <div className="w-1/2 aspect-square relative rounded-xl overflow-hidden shadow-2xl">
                                {currentSong.cover_url && <Image src={currentSong.cover_url} alt={currentSong.title} fill className="object-cover" />}
                            </div>

                            {/* Lyrics */}
                            <div className="w-1/2 flex flex-col gap-6 h-[60vh] overflow-y-auto scrollbar-hide mask-image-linear-gradient">
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-bold text-white mb-2">{currentSong.title}</h1>
                                    <h2 className="text-2xl text-white/60 font-medium">{currentSong.artist}</h2>
                                </div>
                                <div className="text-2xl font-bold text-white/90 leading-relaxed whitespace-pre-line">
                                    {currentSong.lyrics || "No lyrics available for this song.\n\nEnjoy the music!"}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Player Bar */}
                <div className={`h-[88px] backdrop-blur-xl border-t flex items-center px-6 gap-6 z-20 transition-colors duration-500 ${view === 'lyrics'
                    ? 'bg-black/20 border-white/10 text-white'
                    : 'bg-gray-100/90 dark:bg-[#2c2c2e]/90 border-gray-200 dark:border-white/10'
                    }`}>
                    {/* Controls */}
                    <div className="flex items-center gap-5 w-1/3">
                        <button onClick={prevSong} className={`transition-colors ${view === 'lyrics' ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}><FaStepBackward className="text-lg" /></button>
                        <button onClick={togglePlay} className={`text-3xl hover:scale-105 transition-transform active:scale-95 ${view === 'lyrics' ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </button>
                        <button onClick={nextSong} className={`transition-colors ${view === 'lyrics' ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}><FaStepForward className="text-lg" /></button>
                    </div>

                    {/* Progress & Info */}
                    <div className="flex-1 flex flex-col items-center gap-1.5 max-w-2xl">
                        <div className={`flex items-center gap-2 text-[10px] w-full font-medium font-mono tracking-tight ${view === 'lyrics' ? 'text-white/60' : 'text-gray-500'}`}>
                            <span className="w-8 text-right">{formatTime(audioRef.current?.currentTime || 0)}</span>
                            <div className={`flex-1 h-1 rounded-full overflow-hidden relative group cursor-pointer ${view === 'lyrics' ? 'bg-white/20' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                <div
                                    className={`absolute top-0 left-0 h-full transition-colors ${view === 'lyrics' ? 'bg-white/80 group-hover:bg-white' : 'bg-gray-500 dark:bg-gray-400 group-hover:bg-pink-500'}`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="w-8">-{formatTime((duration || 0) - (audioRef.current?.currentTime || 0))}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className={`text-sm font-semibold leading-tight ${view === 'lyrics' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{currentSong.title}</span>
                            <span className={`text-xs leading-tight ${view === 'lyrics' ? 'text-white/60' : 'text-gray-500 dark:text-gray-400'}`}>{currentSong.artist}</span>
                        </div>
                    </div>

                    {/* Volume */}
                    <div className="w-1/3 flex items-center justify-end gap-3">
                        <FaVolumeUp className={`text-sm ${view === 'lyrics' ? 'text-white/60' : 'text-gray-400'}`} />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className={`w-24 h-1 rounded-lg appearance-none cursor-pointer ${view === 'lyrics' ? 'bg-white/20 accent-white' : 'bg-gray-300 dark:bg-gray-600 accent-gray-500 hover:accent-pink-500'}`}
                        />
                        <button
                            onClick={() => setView(view === 'list' ? 'lyrics' : 'list')}
                            className={`ml-2 transition-colors ${view === 'lyrics'
                                ? 'text-white bg-white/20 p-1.5 rounded-md'
                                : 'text-gray-400 hover:text-pink-500'
                                }`}
                        >
                            <span className="text-xs font-bold">LYRICS</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SidebarItem({ icon, label, active = false, darkMode = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, darkMode?: boolean, onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 ${active
                ? (darkMode ? 'bg-white/20 text-white shadow-sm' : 'bg-gray-200 dark:bg-white/10 text-pink-600 dark:text-pink-400 shadow-sm')
                : (darkMode ? 'text-white/60 hover:bg-white/10 hover:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white')
                }`}
        >
            <span className="text-lg w-6 flex justify-center opacity-80">{icon}</span>
            {label}
        </div>
    )
}
