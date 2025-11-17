'use client'

import { useState, useEffect } from 'react'

interface Times {
  shanghai: string
  arlington: string
}

export default function WorldClock() {
  const [times, setTimes] = useState<Times>({
    shanghai: '',
    arlington: ''
  })

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date()

      const shanghaiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }))
      const shanghaiFormatted = shanghaiTime.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })

      const arlingtonTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
      const arlingtonFormatted = arlingtonTime.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })

      setTimes({
        shanghai: shanghaiFormatted,
        arlington: arlingtonFormatted
      })
    }

    updateTimes()
    const interval = setInterval(updateTimes, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🇨🇳</span>
          <span className="text-gray-700 dark:text-gray-300 text-sm font-mono">Shanghai</span>
        </div>
        <span className="text-green-600 dark:text-green-400 font-bold font-mono text-base">
          {times.shanghai}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🇺🇸</span>
          <span className="text-gray-700 dark:text-gray-300 text-sm font-mono">Arlington</span>
        </div>
        <span className="text-green-600 dark:text-green-400 font-bold font-mono text-base">
          {times.arlington}
        </span>
      </div>
    </div>
  )
}
