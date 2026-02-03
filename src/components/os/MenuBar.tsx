import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'

interface MenuBarProps {
    activeApp: string
    onToggleNotificationCenter?: () => void
}

export default function MenuBar({ activeApp, onToggleNotificationCenter }: MenuBarProps) {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const [activeMenu, setActiveMenu] = useState<string | null>(null)

    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null)
        window.addEventListener('click', handleClickOutside)
        return () => window.removeEventListener('click', handleClickOutside)
    }, [])

    const menuItems: Record<string, string[]> = {
        apple: ['About This Mac', 'System Settings...', 'App Store...', 'Recent Items', 'Force Quit...', 'Sleep', 'Restart...', 'Shut Down...', 'Lock Screen', 'Log Out...'],
        app: [`About ${activeApp}`, 'Settings...', 'Hide ' + activeApp, 'Hide Others', 'Show All', 'Quit ' + activeApp],
        file: ['New Window', 'New Folder', 'New Tab', 'Open...', 'Open With', 'Close Window'],
        edit: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Select All'],
        view: ['As Icons', 'As List', 'As Columns', 'As Gallery', 'Show Status Bar'],
        go: ['Back', 'Forward', 'Enclosing Folder', 'Recents', 'Documents', 'Desktop', 'Downloads', 'Home', 'Computer', 'AirDrop', 'Network', 'iCloud Drive', 'Applications', 'Utilities'],
        window: ['Minimize', 'Zoom', 'Move Window to Left Side of Screen', 'Move Window to Right Side of Screen', 'Cycle Through Windows', 'Show Previous Tab', 'Show Next Tab', 'Move Tab to New Window', 'Merge All Windows', 'Bring All to Front'],
        help: [`${activeApp} Help`]
    }

    return (
        <div className="h-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-b border-white/20 dark:border-white/10 flex items-center justify-between px-4 select-none z-[60] relative text-sm font-medium text-gray-900 dark:text-white">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div
                        className={`font-bold px-2 py-0.5 rounded ${activeMenu === 'apple' ? 'bg-white/20' : ''} cursor-default`}
                        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'apple' ? null : 'apple') }}
                    >
                        
                    </div>
                    {activeMenu === 'apple' && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg shadow-xl border border-white/20 dark:border-white/10 py-1 flex flex-col">
                            {menuItems.apple.map((item, i) => (
                                <React.Fragment key={item}>
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default text-sm">
                                        {item}
                                    </div>
                                    {(i === 0 || i === 4 || i === 8) && <div className="h-[1px] bg-gray-400/20 my-1 mx-2" />}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <div
                        className={`font-bold px-2 py-0.5 rounded ${activeMenu === 'app' ? 'bg-white/20' : ''} cursor-default`}
                        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'app' ? null : 'app') }}
                    >
                        {activeApp}
                    </div>
                    {activeMenu === 'app' && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg shadow-xl border border-white/20 dark:border-white/10 py-1 flex flex-col">
                            {menuItems.app.map((item, i) => (
                                <React.Fragment key={item}>
                                    <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default text-sm">
                                        {item}
                                    </div>
                                    {(i === 0 || i === 1 || i === 4) && <div className="h-[1px] bg-gray-400/20 my-1 mx-2" />}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>

                <div className="hidden sm:flex gap-1 font-normal opacity-90">
                    {['File', 'Edit', 'View', 'Go', 'Window', 'Help'].map(menu => (
                        <div key={menu} className="relative">
                            <div
                                className={`px-3 py-0.5 rounded ${activeMenu === menu.toLowerCase() ? 'bg-white/20' : ''} cursor-default`}
                                onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === menu.toLowerCase() ? null : menu.toLowerCase()) }}
                            >
                                {menu}
                            </div>
                            {activeMenu === menu.toLowerCase() && (
                                <div className="absolute top-full left-0 mt-1 w-56 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-lg shadow-xl border border-white/20 dark:border-white/10 py-1 flex flex-col">
                                    {menuItems[menu.toLowerCase()]?.map((item) => (
                                        <div key={item} className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default text-sm">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:block">🔋 100%</div>
                <div className="hidden sm:block">Wi-Fi</div>
                <div className="hidden sm:block">
                    <FaSearch />
                </div>
                <div
                    className="cursor-pointer hover:bg-white/20 px-2 py-0.5 rounded transition-colors"
                    onClick={onToggleNotificationCenter}
                >
                    {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </div>
            </div>
        </div>
    )
}
