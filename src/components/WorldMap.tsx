'use client'

import { useState, useEffect } from 'react'

interface City {
  name: string
  timezone: string
  x: number // 0-100 percentage position on map
  y: number // 0-100 percentage position on map
  color: string
}

const cities: City[] = [
  { name: 'Shanghai', timezone: 'Asia/Shanghai', x: 79, y: 38, color: '#ef4444' }, // 上海 - 红色
  { name: 'Tokyo', timezone: 'Asia/Tokyo', x: 84, y: 40, color: '#f59e0b' }, // 东京 - 橙色
  { name: 'London', timezone: 'Europe/London', x: 48, y: 28, color: '#3b82f6' }, // 伦敦 - 蓝色
  { name: 'New York', timezone: 'America/New_York', x: 24, y: 35, color: '#8b5cf6' }, // 纽约 - 紫色
  { name: 'Los Angeles', timezone: 'America/Los_Angeles', x: 16, y: 40, color: '#06b6d4' }, // 洛杉矶 - 青色
  { name: 'Paris', timezone: 'Europe/Paris', x: 50, y: 30, color: '#ec4899' }, // 巴黎 - 粉色
  { name: 'Singapore', timezone: 'Asia/Singapore', x: 74, y: 52, color: '#10b981' }, // 新加坡 - 绿色
  { name: 'Sydney', timezone: 'Australia/Sydney', x: 88, y: 70, color: '#f97316' }, // 悉尼 - 橙色
]

export default function WorldMap() {
  const [currentTimes, setCurrentTimes] = useState<Record<string, string>>({})
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check system dark mode
    if (typeof window !== 'undefined') {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }

    const updateTimes = () => {
      const times: Record<string, string> = {}
      cities.forEach(city => {
        const time = new Date().toLocaleTimeString('en-US', {
          timeZone: city.timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
        times[city.name] = time
      })
      setCurrentTimes(times)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-full">
      {/* SVG World Map */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      >
        {/* Background */}
        <rect
          width="1000"
          height="500"
          fill={darkMode ? '#1e293b' : '#e0f2fe'}
          className="transition-colors"
        />

        {/* Simple world map outline (simplified continents) */}
        {/* North America */}
        <path
          d="M 100,100 L 150,80 L 200,90 L 250,120 L 280,150 L 270,200 L 240,250 L 200,280 L 150,270 L 120,240 L 100,200 Z"
          fill={darkMode ? '#334155' : '#94a3b8'}
          stroke={darkMode ? '#475569' : '#64748b'}
          strokeWidth="1"
          opacity="0.7"
        />

        {/* South America */}
        <path
          d="M 220,300 L 250,280 L 270,320 L 280,380 L 260,420 L 230,440 L 210,420 L 200,380 L 210,340 Z"
          fill={darkMode ? '#334155' : '#94a3b8'}
          stroke={darkMode ? '#475569' : '#64748b'}
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Europe */}
        <path
          d="M 460,140 L 500,130 L 540,140 L 560,170 L 550,200 L 520,210 L 480,200 L 460,180 Z"
          fill={darkMode ? '#334155' : '#94a3b8'}
          stroke={darkMode ? '#475569' : '#64748b'}
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Africa */}
        <path
          d="M 480,220 L 520,210 L 560,240 L 580,300 L 570,360 L 540,400 L 500,410 L 470,390 L 460,330 L 470,270 Z"
          fill={darkMode ? '#334155' : '#94a3b8'}
          stroke={darkMode ? '#475569' : '#64748b'}
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Asia */}
        <path
          d="M 600,120 L 700,100 L 800,130 L 850,180 L 830,240 L 780,270 L 720,260 L 660,240 L 620,200 L 600,160 Z"
          fill={darkMode ? '#334155' : '#94a3b8'}
          stroke={darkMode ? '#475569' : '#64748b'}
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Australia */}
        <path
          d="M 820,340 L 880,330 L 920,360 L 920,400 L 880,420 L 830,410 L 800,380 Z"
          fill={darkMode ? '#334155' : '#94a3b8'}
          stroke={darkMode ? '#475569' : '#64748b'}
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Grid lines (longitude/latitude) */}
        {[0, 250, 500, 750, 1000].map(x => (
          <line
            key={`v-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="500"
            stroke={darkMode ? '#334155' : '#cbd5e1'}
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
        {[0, 125, 250, 375, 500].map(y => (
          <line
            key={`h-${y}`}
            x1="0"
            y1={y}
            x2="1000"
            y2={y}
            stroke={darkMode ? '#334155' : '#cbd5e1'}
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}

        {/* City markers */}
        {cities.map(city => (
          <g key={city.name}>
            {/* Pulse animation circle */}
            <circle
              cx={city.x * 10}
              cy={city.y * 10}
              r="15"
              fill={city.color}
              opacity="0.2"
            >
              <animate
                attributeName="r"
                from="10"
                to="25"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.5"
                to="0"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>

            {/* City pin */}
            <circle
              cx={city.x * 10}
              cy={city.y * 10}
              r="8"
              fill={city.color}
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer hover:r-10 transition-all"
            />

            {/* City label */}
            <text
              x={city.x * 10}
              y={city.y * 10 - 15}
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill={darkMode ? '#f1f5f9' : '#1e293b'}
              className="pointer-events-none"
            >
              {city.name}
            </text>
          </g>
        ))}
      </svg>

      {/* City time list */}
      <div className="absolute bottom-2 left-2 right-2 bg-white/90 dark:bg-gray-800/90 rounded-lg p-3 backdrop-blur-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {cities.map(city => (
            <div key={city.name} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: city.color }}
              />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {city.name}:
              </span>
              <span className="text-gray-600 dark:text-gray-400 font-mono">
                {currentTimes[city.name] || '--:--'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
