import { useState, useEffect } from 'react'
import { FaApple, FaWifi, FaBatteryFull, FaSearch } from 'react-icons/fa'

interface MenuBarProps {
    activeApp: string
}

export default function MenuBar({ activeApp }: MenuBarProps) {
    const [time, setTime] = useState<string>('')

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }))
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="fixed top-0 left-0 right-0 h-8 bg-white/30 dark:bg-black/30 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 z-[100] text-sm font-medium text-black dark:text-white select-none">
            {/* Left Side */}
            <div className="flex items-center gap-4">
                <FaApple className="text-lg" />
                <span className="font-bold">{activeApp || 'Finder'}</span>
                <div className="hidden sm:flex gap-4 font-normal opacity-90">
                    <span>File</span>
                    <span>Edit</span>
                    <span>View</span>
                    <span>Go</span>
                    <span>Window</span>
                    <span>Help</span>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 opacity-90">
                    <FaWifi />
                    <FaBatteryFull />
                    <FaSearch />
                    {/* <FaControlCenter /> */}
                </div>
                <span className="font-medium">{time}</span>
            </div>
        </div>
    )
}
