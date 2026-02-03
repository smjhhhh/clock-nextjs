import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'

interface NotificationCenterProps {
    isOpen: boolean
    onClose: () => void
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
    const [notifications, setNotifications] = React.useState([
        { id: 1, title: 'Messages', message: 'Hey! Check out the new music player update. It looks amazing! 🎵', time: '2m ago', icon: '💬' },
        { id: 2, title: 'Calendar', message: 'Meeting with Design Team in 15 minutes.', time: '10m ago', icon: '📅' },
        { id: 3, title: 'Mail', message: 'New project requirements attached. Please review.', time: '1h ago', icon: '✉️' }
    ])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[90] bg-transparent"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-80 z-[91] bg-white/70 dark:bg-[#1e1e1e]/70 backdrop-blur-2xl border-l border-white/20 shadow-2xl p-4 flex flex-col gap-6 overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Widgets Section */}
                        <div className="flex flex-col gap-4">
                            {/* Date Widget */}
                            <div className="bg-white/50 dark:bg-white/10 rounded-2xl p-4 shadow-sm">
                                <div className="text-red-500 font-semibold uppercase text-xs mb-1">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
                                <div className="text-3xl font-light text-gray-900 dark:text-white">{new Date().getDate()}</div>
                            </div>

                            {/* Weather Widget (Mock) */}
                            <div className="bg-blue-500/80 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="text-sm font-medium mb-2">Cupertino</div>
                                    <div className="text-3xl font-light">72°</div>
                                    <div className="text-xs opacity-80 mt-1">Sunny</div>
                                </div>
                                <div className="absolute -right-4 -top-4 text-6xl opacity-20">☀️</div>
                            </div>
                        </div>

                        {/* Notifications Section */}
                        <div>
                            <div className="flex items-center justify-between mb-2 px-1">
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Notifications</h3>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={() => setNotifications([])}
                                        className="text-xs text-blue-500 hover:text-blue-600 bg-white/50 dark:bg-white/10 px-2 py-0.5 rounded-full transition-colors"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                {notifications.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                                        No New Notifications
                                    </div>
                                ) : (
                                    notifications.map(notification => (
                                        <div key={notification.id} className="bg-white/50 dark:bg-white/10 rounded-xl p-3 shadow-sm backdrop-blur-md">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-lg">{notification.icon}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <span className="font-semibold text-sm text-gray-900 dark:text-white">{notification.title}</span>
                                                        <span className="text-[10px] text-gray-500">{notification.time}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-snug">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
