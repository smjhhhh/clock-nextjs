import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ContextMenuProps {
    x: number
    y: number
    isOpen: boolean
    onClose: () => void
    onAction: (action: string) => void
}

export default function ContextMenu({ x, y, isOpen, onClose, onAction }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    const items = [
        { id: 'new_folder', label: 'New Folder' },
        { id: 'get_info', label: 'Get Info' },
        { id: 'change_wallpaper', label: 'Change Wallpaper' },
        { type: 'separator' },
        { id: 'sort_by', label: 'Sort By', hasSubmenu: true },
        { id: 'clean_up', label: 'Clean Up' },
        { id: 'clean_up_by', label: 'Clean Up By', hasSubmenu: true },
        { type: 'separator' },
        { id: 'show_view_options', label: 'Show View Options' },
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="fixed z-[100] w-56 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-xl rounded-lg shadow-xl border border-white/20 dark:border-white/10 py-1.5 flex flex-col"
                    style={{ top: y, left: x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {items.map((item, index) => (
                        item.type === 'separator' ? (
                            <div key={index} className="h-[1px] bg-gray-400/20 my-1 mx-2" />
                        ) : (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if (item.id) onAction(item.id)
                                    onClose()
                                }}
                                className="px-4 py-1 text-left text-sm text-gray-900 dark:text-white hover:bg-blue-500 hover:text-white transition-colors flex justify-between items-center group"
                            >
                                <span>{item.label}</span>
                                {item.hasSubmenu && <span className="text-xs opacity-50 group-hover:text-white">▶</span>}
                            </button>
                        )
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
