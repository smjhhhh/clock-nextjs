import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { FaMusic, FaImage, FaGlobeAmericas, FaCompass, FaTerminal } from 'react-icons/fa'

interface DockProps {
    apps: App[]
    openApps: string[]
    activeApp: string | null
    onAppClick: (id: string) => void
}

interface App {
    id: string
    title: string
    icon: React.ReactNode
    color: string
}

export const APPS: App[] = [
    { id: 'finder', title: 'Finder', icon: <FaCompass />, color: 'bg-blue-500' },
    { id: 'music', title: 'Music', icon: <FaMusic />, color: 'bg-pink-500' },
    { id: 'photos', title: 'Photos', icon: <FaImage />, color: 'bg-purple-500' },
    { id: 'travel', title: 'Travel', icon: <FaGlobeAmericas />, color: 'bg-green-500' },
    { id: 'browser', title: 'About Me', icon: <FaTerminal />, color: 'bg-gray-700' },
]

export default function Dock({ apps, openApps, activeApp, onAppClick }: DockProps) {
    const mouseX = useMotionValue(Infinity)

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 h-16 px-4 pb-3 bg-white/20 dark:bg-black/20 backdrop-blur-2xl border border-white/20 rounded-2xl flex items-end gap-4 z-50"
        >
            {apps.map((app) => (
                <DockIcon
                    key={app.id}
                    mouseX={mouseX}
                    app={app}
                    isOpen={openApps.includes(app.id)}
                    isActive={activeApp === app.id}
                    onClick={() => onAppClick(app.id)}
                />
            ))}
        </motion.div>
    )
}

function DockIcon({ mouseX, app, isOpen, isActive, onClick }: { mouseX: any, app: App, isOpen: boolean, isActive: boolean, onClick: () => void }) {
    const ref = useRef<HTMLDivElement>(null)

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
        return val - bounds.x - bounds.width / 2
    })

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40])
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 })

    return (
        <div className="relative flex flex-col items-center gap-1">
            {/* Tooltip */}
            {/* <div className="absolute -top-10 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {app.title}
      </div> */}

            <motion.div
                ref={ref}
                style={{ width }}
                onClick={onClick}
                className={`aspect-square rounded-xl ${app.color} flex items-center justify-center text-white shadow-lg cursor-pointer relative group`}
                whileTap={{ scale: 0.9 }}
            >
                <div className="text-xl">{app.icon}</div>
            </motion.div>

            {/* Active Indicator */}
            <div className={`w-1 h-1 rounded-full bg-black dark:bg-white transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
        </div>
    )
}
