'use client'

import { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const targetDate = new Date('2025-12-31T23:59:59')

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-center">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Until 2025 ends
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-pink-100 dark:bg-pink-900/30 rounded-lg p-2">
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{timeLeft.days}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Days</div>
        </div>
        <div className="bg-pink-100 dark:bg-pink-900/30 rounded-lg p-2">
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{timeLeft.hours}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Hours</div>
        </div>
        <div className="bg-pink-100 dark:bg-pink-900/30 rounded-lg p-2">
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{timeLeft.minutes}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Min</div>
        </div>
        <div className="bg-pink-100 dark:bg-pink-900/30 rounded-lg p-2">
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{timeLeft.seconds}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Sec</div>
        </div>
      </div>
    </div>
  )
}
