import React, { useState, useRef, useEffect } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { motion, AnimatePresence } from 'framer-motion'
import { FaExpand, FaCompress, FaMinus, FaTimes } from 'react-icons/fa'

interface WindowProps {
    id: string
    title: string
    isOpen: boolean
    isActive: boolean
    isMinimized: boolean
    isMaximized: boolean
    zIndex: number
    onClose: (id: string) => void
    onMinimize: (id: string) => void
    onMaximize: (id: string) => void
    onFocus: (id: string) => void
    children: React.ReactNode
    initialPosition?: { x: number; y: number }
    initialSize?: { width: number; height: number }
    customTitleBar?: boolean
}

export default function Window({
    id,
    title,
    isOpen,
    isActive,
    isMinimized,
    isMaximized,
    zIndex,
    onClose,
    onMinimize,
    onMaximize,
    onFocus,
    children,
    initialPosition = { x: 100, y: 50 },
    initialSize = { width: 800, height: 600 },
    customTitleBar = false
}: WindowProps) {
    const nodeRef = useRef(null)
    const [size, setSize] = useState(initialSize)
    const [position, setPosition] = useState(initialPosition)
    const [isResizing, setIsResizing] = useState(false)

    // Reset size when maximized state changes
    useEffect(() => {
        if (!isMaximized) {
            // Optional: Restore previous size if needed, for now keep current
        }
    }, [isMaximized])

    const handleResizeStart = (e: React.MouseEvent, direction: string) => {
        e.preventDefault()
        e.stopPropagation()
        setIsResizing(true)
        onFocus(id)

        const startX = e.clientX
        const startY = e.clientY
        const startWidth = size.width
        const startHeight = size.height
        const startPosX = position.x
        const startPosY = position.y

        const handleMouseMove = (moveEvent: MouseEvent) => {
            let newWidth = startWidth
            let newHeight = startHeight
            let newX = startPosX
            let newY = startPosY

            const deltaX = moveEvent.clientX - startX
            const deltaY = moveEvent.clientY - startY

            if (direction.includes('e')) {
                newWidth = Math.max(400, startWidth + deltaX)
            }
            if (direction.includes('w')) {
                const possibleWidth = Math.max(400, startWidth - deltaX)
                if (possibleWidth !== 400 || startWidth - deltaX > 400) {
                    newWidth = possibleWidth
                    newX = startPosX + (startWidth - newWidth)
                }
            }
            if (direction.includes('s')) {
                newHeight = Math.max(300, startHeight + deltaY)
            }
            if (direction.includes('n')) {
                const possibleHeight = Math.max(300, startHeight - deltaY)
                if (possibleHeight !== 300 || startHeight - deltaY > 300) {
                    newHeight = possibleHeight
                    newY = startPosY + (startHeight - newHeight)
                }
            }

            setSize({ width: newWidth, height: newHeight })
            setPosition({ x: newX, y: newY })
        }

        const handleMouseUp = () => {
            setIsResizing(false)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
        setPosition({ x: data.x, y: data.y })
    }

    const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
        setPosition({ x: data.x, y: data.y })
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            {!isMinimized && (
                <Draggable
                    handle=".window-drag-handle"
                    position={isMaximized ? { x: 0, y: 0 } : position}
                    onStart={() => onFocus(id)}
                    onDrag={handleDrag}
                    onStop={handleDragStop}
                    nodeRef={nodeRef}
                    disabled={isMaximized || isResizing}
                >
                    <motion.div
                        ref={nodeRef}
                        id={`window-${id}`}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={`absolute flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/10 transition-shadow duration-200 ${isActive ? 'shadow-2xl ring-1 ring-black/5' : 'shadow-lg'
                            }`}
                        style={{
                            zIndex,
                            width: isMaximized ? '100vw' : size.width,
                            height: isMaximized ? 'calc(100vh - 2rem)' : size.height, // Subtract menu bar height
                            top: isMaximized ? '2rem' : undefined, // Below menu bar
                            left: isMaximized ? 0 : undefined,
                            position: 'absolute'
                        }}
                        onClick={() => onFocus(id)}
                    >
                        {/* Window Controls (Traffic Lights) */}
                        <div className={`flex items-center gap-2 group z-50 ${customTitleBar ? 'absolute top-4 left-4' : 'hidden'}`}>
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

                        {/* Standard Window Header (only if not custom) */}
                        {!customTitleBar && (
                            <div className="window-drag-handle h-10 bg-gray-100/50 dark:bg-slate-800/50 border-b border-gray-200/50 dark:border-white/5 flex items-center px-4 justify-between cursor-default select-none shrink-0">
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
                        )}

                        {/* Window Content */}
                        <div className="flex-1 relative flex flex-col">
                            {children}
                        </div>

                        {/* Resize Handles */}
                        {!isMaximized && (
                            <>
                                {/* N */}
                                <div className="absolute top-0 left-0 w-full h-1 cursor-n-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'n')} />
                                {/* S */}
                                <div className="absolute bottom-0 left-0 w-full h-1 cursor-s-resize z-50" onMouseDown={(e) => handleResizeStart(e, 's')} />
                                {/* E */}
                                <div className="absolute top-0 right-0 w-1 h-full cursor-e-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'e')} />
                                {/* W */}
                                <div className="absolute top-0 left-0 w-1 h-full cursor-w-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'w')} />

                                {/* NE */}
                                <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
                                {/* NW */}
                                <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
                                {/* SE */}
                                <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'se')} />
                                {/* SW */}
                                <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
                            </>
                        )}
                    </motion.div>
                </Draggable>
            )}
        </AnimatePresence>
    )
}
