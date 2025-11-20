'use client'

import { ReactNode } from 'react'

interface StatCardProps {
    title: string
    value: string | number
    icon: ReactNode
    trend?: string
    color?: 'pink' | 'blue' | 'purple' | 'green'
}

export default function StatCard({ title, value, icon, trend, color = 'pink' }: StatCardProps) {
    const colorStyles = {
        pink: 'from-pink-500 to-rose-500',
        blue: 'from-blue-500 to-cyan-500',
        purple: 'from-purple-500 to-indigo-500',
        green: 'from-emerald-500 to-teal-500',
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colorStyles[color]} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                    </div>
                </div>
                {trend && (
                    <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                        <span>↑</span> {trend}
                    </p>
                )}
            </div>

            {/* Decorative Background */}
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${colorStyles[color]} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-300`} />
        </div>
    )
}
