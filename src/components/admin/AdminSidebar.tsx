'use client'

import { FaHome, FaPenNib, FaImages, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'

interface AdminSidebarProps {
    activeTab: 'dashboard' | 'blog' | 'photos'
    setActiveTab: (tab: 'dashboard' | 'blog' | 'photos') => void
    userEmail?: string | null
    onSignOut: () => void
}

export default function AdminSidebar({ activeTab, setActiveTab, userEmail, onSignOut }: AdminSidebarProps) {
    const menuItems = [
        { id: 'dashboard', label: '仪表盘', icon: FaHome },
        { id: 'blog', label: '博客管理', icon: FaPenNib },
        { id: 'photos', label: '照片管理', icon: FaImages },
    ] as const

    return (
        <div className="w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-gray-200 dark:border-slate-700 h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50 transition-all duration-300">
            {/* Logo Area */}
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    Yoru Admin
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Content Management</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700/50'
                            }`}
                    >
                        <item.icon className={`text-lg ${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-pink-500'
                            }`} />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white shadow-md">
                        <FaUserCircle className="text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            Administrator
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {userEmail}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onSignOut}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <FaSignOutAlt />
                    退出登录
                </button>
            </div>
        </div>
    )
}
