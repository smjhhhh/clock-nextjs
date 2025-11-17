'use client'

import { useState, useEffect } from 'react'

interface RateData {
  usdCny: string | null
  jpyCny: string | null
  loading: boolean
  error: string | null
}

export default function ExchangeRate() {
  const [rates, setRates] = useState<RateData>({
    usdCny: null,
    jpyCny: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    fetchRates()
    const interval = setInterval(fetchRates, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchRates = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
      const data = await response.json()

      const usdCny = data.rates.CNY
      const jpyToUsd = 1 / data.rates.JPY
      const jpyCny = jpyToUsd * data.rates.CNY

      setRates({
        usdCny: usdCny.toFixed(4),
        jpyCny: jpyCny.toFixed(4),
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Failed to fetch rates:', error)
      setRates(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load'
      }))
    }
  }

  if (rates.loading) {
    return (
      <div className="text-gray-600 dark:text-gray-400 text-xs font-mono">Loading...</div>
    )
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🇺🇸</span>
          <span className="text-gray-700 dark:text-gray-300 text-xs font-mono">USD/CNY</span>
        </div>
        <span className="text-gray-900 dark:text-white font-bold text-sm font-mono">
          {rates.error ? rates.error : `¥${rates.usdCny}`}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🇯🇵</span>
          <span className="text-gray-700 dark:text-gray-300 text-xs font-mono">JPY/CNY</span>
        </div>
        <span className="text-gray-900 dark:text-white font-bold text-sm font-mono">
          {rates.error ? rates.error : `¥${rates.jpyCny}`}
        </span>
      </div>

      {!rates.error && (
        <div className="mt-2 pt-2 border-t border-sky-300 dark:border-sky-700">
          <div className="text-gray-600 dark:text-gray-400 text-[10px] font-mono text-center">
            Updates every 5 min
          </div>
        </div>
      )}
    </div>
  )
}
