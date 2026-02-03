import React from 'react'

export interface App {
    id: string
    title: string
    icon: React.ReactNode
    color?: string
    type?: 'app' | 'link'
}
