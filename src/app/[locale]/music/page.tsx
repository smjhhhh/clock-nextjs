'use client'

import { useState, useRef, useEffect } from 'react'
import { Link } from '@/navigation'
import Image from 'next/image'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaRandom, FaRedo, FaList, FaQuoteRight, FaArrowLeft } from 'react-icons/fa'
import { supabase, Song } from '@/lib/supabase'

export default function MusicPage() {
    const [songs, setSongs] = useState<Song[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentSongIndex, setCurrentSongIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [showLyrics, setShowLyrics] = useState(false)
    const [showPlaylist, setShowPlaylist] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const progressInterval = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        fetchSongs()
    }, [])

    const fetchSongs = async () => {
        try {
            const { data } = await supabase.from('songs').select('*').order('created_at', { ascending: false })
            if (data && data.length > 0) {
                setSongs(data)
            }
        } catch (error) {
            console.error('Error fetching songs:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const currentSong = songs[currentSongIndex]

    useEffect(() => {
        if (songs.length > 0 && currentSong) {
            if (!audioRef.current) {
                audioRef.current = new Audio(currentSong.audio_url)
                audioRef.current.addEventListener('ended', nextSong)
                audioRef.current.addEventListener('loadedmetadata', () => {
                    setDuration(audioRef.current?.duration || 0)
                })
            } else {
                // Only update src if it's different to avoid reloading
                if (audioRef.current.src !== currentSong.audio_url) {
                    audioRef.current.src = currentSong.audio_url
                    if (isPlaying) audioRef.current.play()
                }
            }
        }
    }, [currentSongIndex, songs])

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

    const togglePlay = () => setIsPlaying(!isPlaying)

    const nextSong = () => {
        setCurrentSongIndex((prev) => (prev + 1) % songs.length)
        setProgress(0)
        setIsPlaying(true)
    }

    const prevSong = () => {
        setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length)
        setProgress(0)
        setIsPlaying(true)
    }

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return '0:00'
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (isLoading) return (
        <div className="min-h-screen w-full bg-black flex items-center justify-center text-white">
            <div className="animate-pulse">Loading Music...</div>
        </div>
    )

    if (!currentSong) return (
        <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center text-white gap-4">
            <div className="text-2xl font-bold">No Music Found</div>
            <p className="text-gray-400">Please upload songs in the Admin Dashboard.</p>
            <Link href="/admin" className="px-6 py-2 bg-white text-black rounded-full hover:scale-105 transition-transform">
                Go to Admin
            </Link>
        </div>
    )

    const lyrics = currentSong.lyrics ? currentSong.lyrics.split('\\n') : ['No lyrics available']

    return (
        <div className="min-h-screen w-full bg-black text-white overflow-hidden relative font-sans selection:bg-pink-500/30">
            {/* Dynamic Background */}
            <div className="absolute inset-0 transition-colors duration-1000 ease-in-out z-0">
                <div
                    className="absolute inset-0 opacity-40 blur-[120px] scale-150 animate-pulse-slow"
                    style={{
                        background: `radial-gradient(circle at 20% 20%, ${currentSong.color || '#60a5fa'}, transparent), radial-gradient(circle at 80% 80%, ${currentSong.dark_color || '#1d4ed8'}, transparent)`
                    }}
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl" />
            </div>

            {/* Navigation Bar */}
            <nav className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center">
                <Link href="/about-me" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors">
                    <FaArrowLeft className="text-white" />
                </Link>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowLyrics(!showLyrics)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md transition-all ${showLyrics ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        <FaQuoteRight />
                    </button>
                    <button
                        onClick={() => setShowPlaylist(!showPlaylist)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md transition-all ${showPlaylist ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        <FaList />
                    </button>
                </div>
            </nav>

            {/* Main Content Grid */}
            <div className="relative z-10 h-screen flex flex-col md:flex-row items-center justify-center p-8 md:p-16 gap-12">

                {/* Left Side: Album Art / Lyrics */}
                <div className={`flex-1 flex items-center justify-center w-full max-w-2xl transition-all duration-700 ${showPlaylist ? 'md:w-1/2' : 'md:w-full'}`}>
                    {showLyrics ? (
                        <div className="h-[60vh] w-full overflow-y-auto no-scrollbar mask-gradient space-y-8 text-center px-4">
                            {lyrics.map((line, idx) => (
                                <p
                                    key={idx}
                                    className={`text-3xl md:text-4xl font-bold transition-all duration-500 cursor-pointer hover:opacity-100 ${Math.floor((progress / 100) * lyrics.length) === idx
                                        ? 'text-white scale-105 blur-0'
                                        : 'text-white/30 blur-[1px] hover:blur-0'
                                        }`}
                                >
                                    {line}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <div className={`relative aspect-square w-full max-w-[500px] transition-all duration-700 ${isPlaying ? 'scale-100' : 'scale-90'}`}>
                            <div
                                className="absolute inset-8 rounded-[2rem] opacity-50 blur-3xl transition-colors duration-1000"
                                style={{ backgroundColor: currentSong.color || '#60a5fa' }}
                            />
                            <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10">
                                <Image
                                    src={currentSong.cover_url || '/images/music-placeholder.jpg'}
                                    alt={currentSong.album || 'Unknown Album'}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Controls & Info (Or Playlist) */}
                <div className={`flex-1 w-full max-w-xl flex flex-col justify-center transition-all duration-500 ${showLyrics ? 'hidden md:flex' : ''}`}>

                    {showPlaylist ? (
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10 h-[60vh] overflow-y-auto">
                            <h3 className="text-xl font-bold mb-6 px-2">Up Next</h3>
                            <div className="space-y-2">
                                {songs.map((song, idx) => (
                                    <div
                                        key={song.id}
                                        onClick={() => {
                                            setCurrentSongIndex(idx)
                                            setIsPlaying(true)
                                            setProgress(0)
                                        }}
                                        className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${currentSongIndex === idx ? 'bg-white/20' : 'hover:bg-white/5'}`}
                                    >
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                                            <Image src={song.cover_url || '/images/music-placeholder.jpg'} alt={song.title} fill className="object-cover" />
                                            {currentSongIndex === idx && isPlaying && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <div className="w-1 h-3 bg-white mx-0.5 animate-bounce" style={{ animationDelay: '0s' }} />
                                                    <div className="w-1 h-4 bg-white mx-0.5 animate-bounce" style={{ animationDelay: '0.1s' }} />
                                                    <div className="w-1 h-2 bg-white mx-0.5 animate-bounce" style={{ animationDelay: '0.2s' }} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-medium ${currentSongIndex === idx ? 'text-white' : 'text-white/80'}`}>{song.title}</p>
                                            <p className="text-sm text-white/50">{song.artist}</p>
                                        </div>
                                        <p className="text-sm text-white/40">{formatTime(song.duration || 0)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Song Info */}
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{currentSong.title}</h1>
                                <p className="text-xl md:text-2xl text-white/60 font-medium">{currentSong.artist} — {currentSong.album}</p>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2 group">
                                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-white/40 group-hover:bg-white/60 transition-colors w-full"
                                    />
                                    <div
                                        className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs font-medium text-white/40">
                                    <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between">
                                <button className="text-white/40 hover:text-white transition-colors"><FaRandom className="text-xl" /></button>

                                <div className="flex items-center gap-10">
                                    <button onClick={prevSong} className="text-4xl text-white/80 hover:text-white transition-transform active:scale-90">
                                        <FaStepBackward />
                                    </button>
                                    <button
                                        onClick={togglePlay}
                                        className="w-20 h-20 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-all active:scale-95 shadow-xl shadow-white/10"
                                    >
                                        {isPlaying ? <FaPause className="text-3xl" /> : <FaPlay className="text-3xl ml-1" />}
                                    </button>
                                    <button onClick={nextSong} className="text-4xl text-white/80 hover:text-white transition-transform active:scale-90">
                                        <FaStepForward />
                                    </button>
                                </div>

                                <button className="text-white/40 hover:text-white transition-colors"><FaRedo className="text-xl" /></button>
                            </div>

                            {/* Volume */}
                            <div className="flex items-center gap-4 pt-4">
                                <FaVolumeUp className="text-white/40 text-sm" />
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group">
                                    <div className="h-full w-[70%] bg-white/60 group-hover:bg-white rounded-full transition-colors" />
                                </div>
                                <FaVolumeUp className="text-white/80 text-lg" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .mask-gradient {
          mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1.5); }
          50% { opacity: 0.3; transform: scale(1.6); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}
