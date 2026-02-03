'use client'

import { useState, useEffect } from 'react'
import Desktop from '@/components/os/Desktop'
import MenuBar from '@/components/os/MenuBar'
import Dock, { APPS } from '@/components/os/Dock'
import Window from '@/components/os/Window'
import DesktopMusicApp from '@/components/os/apps/DesktopMusicApp'
import DesktopPhotosApp from '@/components/os/apps/DesktopPhotosApp'
import PhotoMap from '@/components/gallery/PhotoMap'
import { supabase, Photo, Song } from '@/lib/supabase'
import DesktopIcon from '@/components/os/DesktopIcon'
import Launchpad from '@/components/os/Launchpad'
import NotificationCenter from '@/components/os/NotificationCenter'
import ContextMenu from '@/components/os/ContextMenu'

const WALLPAPERS = [
    '/wallpapers/ventura.jpg',
    '/wallpapers/monterey.jpg',
    '/wallpapers/bigsur.jpg',
    '/wallpapers/catalina.jpg'
]

export default function OSPage() {
    const [activeApp, setActiveApp] = useState<string | null>(null)
    const [openApps, setOpenApps] = useState<string[]>([])
    const [minimizedApps, setMinimizedApps] = useState<string[]>([])
    const [maximizedApps, setMaximizedApps] = useState<string[]>([])
    const [zIndexes, setZIndexes] = useState<Record<string, number>>({})
    const [photos, setPhotos] = useState<Photo[]>([])
    const [importedSongs, setImportedSongs] = useState<Song[]>([])

    // New State
    const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false)
    const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false)
    const [wallpaperIndex, setWallpaperIndex] = useState(0)
    const [contextMenu, setContextMenu] = useState({ x: 0, y: 0, isOpen: false })

    // Default Desktop Icons
    const desktopIcons = [
        { id: 'hd', label: 'Macintosh HD', icon: '💿', initialPosition: { x: 1150, y: 20 } },
        { id: 'docs', label: 'Documents', icon: '📁', initialPosition: { x: 1150, y: 120 } },
        { id: 'readme', label: 'Readme.txt', icon: '📄', initialPosition: { x: 1150, y: 220 } },
        { id: 'trash', label: 'Trash', icon: '🗑️', initialPosition: { x: 1150, y: 650 } },
        {
            id: 'song1',
            label: 'New Song.mp3',
            icon: '🎵',
            type: 'audio',
            initialPosition: { x: 1050, y: 20 }
        },
    ]

    useEffect(() => {
        const fetchPhotos = async () => {
            const { data } = await supabase
                .from('photos')
                .select('*')
                .order('created_at', { ascending: false })
            if (data) setPhotos(data)
        }
        fetchPhotos()
    }, [])

    const launchApp = (id: string) => {
        if (id === 'launchpad') {
            setIsLaunchpadOpen(true)
            return
        }

        if (!openApps.includes(id)) {
            setOpenApps([...openApps, id])
        }
        focusApp(id)
        if (minimizedApps.includes(id)) {
            setMinimizedApps(minimizedApps.filter(appId => appId !== id))
        }
    }

    const closeApp = (id: string) => {
        setOpenApps(openApps.filter(appId => appId !== id))
        if (activeApp === id) {
            setActiveApp(null)
        }
    }

    const minimizeApp = (id: string) => {
        setMinimizedApps([...minimizedApps, id])
        setActiveApp(null)
    }

    const maximizeApp = (id: string) => {
        if (maximizedApps.includes(id)) {
            setMaximizedApps(maximizedApps.filter(appId => appId !== id))
        } else {
            setMaximizedApps([...maximizedApps, id])
        }
        focusApp(id)
    }

    const focusApp = (id: string) => {
        setActiveApp(id)
        // Bring to front logic
        const maxZ = Math.max(0, ...Object.values(zIndexes))
        setZIndexes({ ...zIndexes, [id]: maxZ + 1 })
    }

    const handleDrop = (iconId: string, targetId: string) => {
        if (targetId === 'music' && iconId === 'song1') {
            // Mock importing a song
            const newSong: Song = {
                id: 'imported-1',
                title: 'New Song (Imported)',
                artist: 'Unknown Artist',
                album: 'Desktop Import',
                audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Mock URL
                cover_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60',
                created_at: new Date().toISOString(),
                duration: 300,
                color: '#ec4899',
                dark_color: '#831843',
                lyrics: 'No lyrics available.'
            }
            setImportedSongs(prev => [...prev, newSong])
            launchApp('music')
        }
    }

    const changeWallpaper = () => {
        setWallpaperIndex((prev) => (prev + 1) % WALLPAPERS.length)
    }

    const renderAppContent = (id: string) => {
        switch (id) {
            case 'music':
                return <DesktopMusicApp importedSongs={importedSongs} />
            case 'photos':
                return <DesktopPhotosApp />
            case 'travel':
                return (
                    <div className="h-full w-full relative">
                        <PhotoMap photos={photos} className="w-full h-full" />
                    </div>
                )
            case 'browser':
                return (
                    <iframe
                        src="/about-me"
                        className="w-full h-full border-none bg-white"
                        title="About Me"
                    />
                )
            case 'finder':
                return (
                    <div className="h-full bg-white dark:bg-slate-900 p-6">
                        <h3 className="text-lg font-bold mb-4">Macintosh HD</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {['Applications', 'Desktop', 'Documents', 'Downloads', 'Movies', 'Music', 'Pictures'].map(folder => (
                                <div key={folder} className="flex flex-col items-center gap-2 group cursor-pointer p-2 hover:bg-blue-500/10 rounded-lg">
                                    <div className="text-4xl">📁</div>
                                    <span className="text-sm text-center">{folder}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            default:
                return <div className="p-4">App content not found</div>
        }
    }

    return (
        <div
            className="h-screen w-screen overflow-hidden font-sans text-gray-900 dark:text-white bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url(${WALLPAPERS[wallpaperIndex]})` }}
        >
            <Desktop onContextMenu={(e) => {
                e.preventDefault()
                setContextMenu({ x: e.clientX, y: e.clientY, isOpen: true })
            }}>
                <MenuBar
                    activeApp={APPS.find(a => a.id === activeApp)?.title || 'Finder'}
                    onToggleNotificationCenter={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
                />

                {/* Desktop Icons */}
                {desktopIcons.map(icon => (
                    <DesktopIcon
                        key={icon.id}
                        id={icon.id}
                        label={icon.label}
                        icon={icon.icon}
                        // @ts-ignore
                        type={icon.type}
                        initialPosition={icon.initialPosition}
                        onDoubleClick={() => {
                            if (icon.id === 'hd') launchApp('finder')
                            // Add other actions
                        }}
                        onDrop={(targetId) => handleDrop(icon.id, targetId)}
                    />
                ))}

                {/* Windows */}
                {openApps.map(appId => {
                    const app = APPS.find(a => a.id === appId)
                    if (!app) return null

                    return (
                        <Window
                            key={appId}
                            id={appId}
                            title={app.title}
                            isOpen={true}
                            isActive={activeApp === appId}
                            isMinimized={minimizedApps.includes(appId)}
                            isMaximized={maximizedApps.includes(appId)}
                            zIndex={zIndexes[appId] || 10}
                            onClose={closeApp}
                            onMinimize={minimizeApp}
                            onMaximize={maximizeApp}
                            onFocus={focusApp}
                            initialSize={appId === 'music' ? { width: 1000, height: 600 } : { width: 1000, height: 700 }}
                            customTitleBar={appId === 'music' || appId === 'photos'}
                        >
                            {renderAppContent(appId)}
                        </Window>
                    )
                })}

                <Dock
                    apps={APPS}
                    openApps={openApps}
                    activeApp={activeApp}
                    onAppClick={launchApp}
                />

                <Launchpad
                    isOpen={isLaunchpadOpen}
                    onClose={() => setIsLaunchpadOpen(false)}
                    apps={APPS}
                    onLaunch={launchApp}
                />

                <NotificationCenter
                    isOpen={isNotificationCenterOpen}
                    onClose={() => setIsNotificationCenterOpen(false)}
                />

                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    isOpen={contextMenu.isOpen}
                    onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
                    onAction={(action: string) => {
                        if (action === 'change_wallpaper') changeWallpaper()
                        // Handle other actions
                    }}
                />
            </Desktop>
        </div>
    )
}
