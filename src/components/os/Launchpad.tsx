import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { FaSearch } from 'react-icons/fa'
import { App } from '@/types/os'

interface LaunchpadProps {
    isOpen: boolean
    onClose: () => void
    apps: App[]
    onLaunch: (id: string) => void
}

export default function Launchpad({ isOpen, onClose, apps, onLaunch }: LaunchpadProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const appsPerPage = 28

    const filteredApps = apps.filter(app =>
        app.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredApps.length / appsPerPage)
    const currentApps = filteredApps.slice(currentPage * appsPerPage, (currentPage + 1) * appsPerPage)

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-2xl flex flex-col items-center pt-20"
                    onClick={onClose}
                >
                    {/* Search Bar */}
                    <div
                        className="w-64 relative mb-12"
                        onClick={e => e.stopPropagation()}
                    >
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={e => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(0)
                            }}
                            className="w-full bg-white/10 border border-white/20 rounded-lg py-1.5 pl-9 pr-3 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 transition-colors text-sm"
                            autoFocus
                        />
                    </div>

                    {/* App Grid */}
                    <div
                        className="grid grid-cols-7 gap-x-8 gap-y-12 max-w-5xl px-8 min-h-[500px]"
                        onClick={e => e.stopPropagation()}
                    >
                        {currentApps.map(app => (
                            <button
                                key={app.id}
                                onClick={() => {
                                    onLaunch(app.id)
                                    onClose()
                                }}
                                className="flex flex-col items-center gap-3 group"
                            >
                                <div className="w-20 h-20 relative bg-white rounded-[1.2rem] shadow-lg flex items-center justify-center text-4xl overflow-hidden group-hover:scale-105 transition-transform duration-200">
                                    {typeof app.icon === 'string' && (app.icon.startsWith('/') || app.icon.startsWith('http')) ? (
                                        <Image src={app.icon} alt={app.title} fill className="object-cover" />
                                    ) : (
                                        <span>{app.icon}</span>
                                    )}
                                </div>
                                <span className="text-white text-sm font-medium drop-shadow-md">{app.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-8 flex gap-2" onClick={e => e.stopPropagation()}>
                        {Array.from({ length: Math.max(1, totalPages) }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i)}
                                className={`w-2 h-2 rounded-full transition-colors ${currentPage === i ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
