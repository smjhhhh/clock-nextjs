
import React, { useState, useRef } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'

interface DesktopIconProps {
    id: string
    label: string
    icon: React.ReactNode
    type?: 'file' | 'folder' | 'app' | 'audio'
    initialPosition?: { x: number; y: number }
    onDoubleClick?: () => void
    onDrop?: (targetId: string) => void
}

export default function DesktopIcon({ id, label, icon, type = 'file', initialPosition = { x: 0, y: 0 }, onDoubleClick, onDrop }: DesktopIconProps) {
    const [position, setPosition] = useState(initialPosition)
    const [isSelected, setIsSelected] = useState(false)
    const nodeRef = useRef(null)

    const handleStop = (e: DraggableEvent, data: DraggableData) => {
        // Grid snapping logic (100x100 grid)
        const gridSize = 100
        const snappedX = Math.round(data.x / gridSize) * gridSize
        const snappedY = Math.round(data.y / gridSize) * gridSize

        setPosition({ x: snappedX, y: snappedY })

        // Drop detection
        if (onDrop) {
            // Hide the element momentarily to check what's underneath
            const node = nodeRef.current as HTMLElement | null
            const originalDisplay = node ? node.style.display : ''
            if (node) node.style.display = 'none'

            try {
                const mouseEvent = e as MouseEvent
                const clientX = mouseEvent.clientX || (mouseEvent as any).changedTouches?.[0]?.clientX
                const clientY = mouseEvent.clientY || (mouseEvent as any).changedTouches?.[0]?.clientY

                if (clientX !== undefined && clientY !== undefined) {
                    const elements = document.elementsFromPoint(clientX, clientY)

                    // Check if any element is the music app drop zone or the window itself
                    const musicApp = elements.find(el => el.id === 'music-app-drop-zone' || el.id === 'window-music')
                    if (musicApp) {
                        onDrop('music')
                    }
                }
            } finally {
                if (node) node.style.display = originalDisplay
            }
        }
    }

    return (
        <Draggable
            nodeRef={nodeRef}
            position={position}
            onStop={handleStop}
            onStart={() => setIsSelected(true)}
        >
            <div
                ref={nodeRef}
                className={`absolute flex flex - col items - center gap - 1 w - [90px] p - 2 rounded - md cursor - pointer transition - colors ${isSelected ? 'bg-white/20 border border-white/30 backdrop-blur-sm' : 'hover:bg-white/10'
                    } `}
                onClick={(e) => {
                    e.stopPropagation()
                    setIsSelected(true)
                }}
                onDoubleClick={onDoubleClick}
            // Click outside listener is handled by parent (Desktop) usually, 
            // but for now we just handle local click. 
            // To fully implement "click empty space to deselect", we need a global state or event.
            >
                <div className="text-5xl drop-shadow-lg filter">
                    {icon}
                </div>
                <span className={`text - white text - xs font - medium text - center leading - tight drop - shadow - md px - 1.5 py - 0.5 rounded ${isSelected ? 'bg-blue-600' : ''} `}>
                    {label}
                </span>
            </div>
        </Draggable>
    )
}
