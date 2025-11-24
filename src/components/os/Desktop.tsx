import React from 'react'
import Image from 'next/image'

interface DesktopProps {
    children: React.ReactNode
    onContextMenu: (e: React.MouseEvent) => void
}

export default function Desktop({ children, onContextMenu }: DesktopProps) {
    return (
        <div
            className="relative w-full h-screen overflow-hidden bg-cover bg-center"
            onContextMenu={onContextMenu}
        >
            {/* Wallpaper */}
            <div className="absolute inset-0 -z-10">
                <Image
                    src="https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop"
                    alt="Wallpaper"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/10" /> {/* Overlay for better contrast */}
            </div>

            {/* Desktop Icons (Future) */}
            <div className="absolute top-10 right-4 flex flex-col gap-4 items-end p-4">
                {/* Example Desktop Icon */}
                {/* <div className="flex flex-col items-center gap-1 w-20 group cursor-pointer">
          <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center text-3xl text-blue-500 shadow-lg group-hover:bg-blue-500/30 transition-colors">
            📁
          </div>
          <span className="text-white text-xs font-medium drop-shadow-md bg-blue-500/80 px-2 py-0.5 rounded-full">
            Documents
          </span>
        </div> */}
            </div>

            {children}
        </div>
    )
}
