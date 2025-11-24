import React, { useState, useRef, useEffect } from 'react'
import Draggable from 'react-draggable'
import { motion, AnimatePresence } from 'framer-motion'
import { FaExpand, FaCompress, FaMinus, FaTimes } from 'react-icons/fa'

interface WindowProps {
    id: string
    title: string
    isOpen: boolean
    isActive: boolean
    isMinimized: boolean
    isMaximized: boolean
    onClose: (id: string) => void
    onMinimize: (id: string) => void
    onMaximize: (id: string) => void
    onFocus: (id: string) => void
    children: React.ReactNode
    initialPosition?: { x: number; y: number }
    initialSize?: { width: number; height: number }
}

export default function Window({
    id,
    title,
    isOpen,
    isActive,
    isMinimized,
    isMaximized,
    onClose,
    onMinimize,
    onMaximize,
    onFocus,
    children,
    initialPosition = { x: 100, y: 50 },
    initialSize = { width: 800, height: 600 }
}: WindowProps) {
    const nodeRef = useRef(null)

    if (!isOpen) return null

    return (
        <AnimatePresence>
            {!isMinimized && (
                <Draggable
                    handle=".window-header"
                    defaultPosition={initialPosition}
                    onStart={() => onFocus(id)}
                    nodeRef={nodeRef}
                    disabled={isMaximized}
                >
                    <motion.div
                        ref={nodeRef}
                        id={`window-${id}`}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={`absolute flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/10 transition-shadow duration-200 ${isActive ? 'z-50 shadow-2xl ring-1 ring-black/5' : 'z-10 shadow-lg'
                            }`}
                        style={{
                            width: isMaximized ? '100vw' : initialSize.width,
                            height: isMaximized ? 'calc(100vh - 2rem)' : initialSize.height, // Subtract menu bar height
                            top: isMaximized ? '2rem' : undefined, // Below menu bar
                            left: isMaximized ? 0 : undefined,
                            position: 'absolute'
                        }}
                        onClick={() => onFocus(id)}
                    >
                        {/* Window Header */}
                        <div className="window-header h-10 bg-gray-100/50 dark:bg-slate-800/50 border-b border-gray-200/50 dark:border-white/5 flex items-center px-4 justify-between cursor-default select-none">
                            <div className="flex items-center gap-2 group">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onClose(id) }}
                                    className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-[8px] text-black/0 hover:text-black/50 transition-colors"
                                >
                                    <FaTimes />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onMinimize(id) }}
                                    className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center text-[8px] text-black/0 hover:text-black/50 transition-colors"
                                >
                                    <FaMinus />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onMaximize(id) }}
                                    className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-[8px] text-black/0 hover:text-black/50 transition-colors"
                                >
                                    {isMaximized ? <FaCompress /> : <FaExpand />}
                                </button>
                            </div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{title}</div>
                            <div className="w-14" /> {/* Spacer for centering title */}
                        </div>

                        {/* Window Content */}
                        <div className="flex-1 overflow-auto relative">
                            {children}
                        </div>
                    </motion.div>
                </Draggable>
            )}
        </AnimatePresence>
    )
}
