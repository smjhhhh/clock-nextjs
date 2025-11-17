'use client'

import { useState, useEffect } from 'react'

interface WeatherData {
  current_condition: Array<{
    temp_C: string
    weatherCode: string
    weatherDesc: Array<{ value: string }>
    lang_zh_cn?: Array<{ value: string }>
  }>
}

const getWeatherIcon = (code: string): string => {
  const iconMap: Record<string, string> = {
    '113': '☀️', '116': '⛅', '119': '☁️', '122': '☁️',
    '143': '🌫️', '176': '🌦️', '179': '🌨️', '182': '🌧️',
    '200': '⛈️', '227': '🌨️', '230': '❄️', '248': '🌫️',
    '263': '🌦️', '266': '🌧️', '293': '🌦️', '296': '🌧️',
    '299': '🌧️', '302': '🌧️', '305': '🌧️', '308': '🌧️',
    '323': '🌨️', '326': '❄️', '329': '❄️', '332': '❄️',
    '335': '❄️', '338': '❄️', '386': '⛈️', '389': '⛈️',
  }
  return iconMap[code] || '🌤️'
}

interface WeatherCardProps {
  city: string
  cityEn: string
}

function WeatherCard({ city, cityEn }: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`https://wttr.in/${cityEn}?format=j1`)
        const data = await response.json()
        setWeather(data)
      } catch (error) {
        console.error('Failed to fetch weather:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [cityEn])

  if (loading) {
    return (
      <div className="bg-sky-100 dark:bg-sky-900 backdrop-blur-lg rounded-lg p-4 shadow-xl min-w-[180px]">
        <div className="text-gray-600 dark:text-gray-300 text-sm animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!weather) return null

  const current = weather.current_condition[0]
  const temp = current.temp_C
  const weatherCode = current.weatherCode
  const weatherDesc = current.lang_zh_cn?.[0]?.value || current.weatherDesc[0].value
  const icon = getWeatherIcon(weatherCode)

  return (
    <div className="bg-sky-100 dark:bg-sky-900 backdrop-blur-lg rounded-lg p-4 shadow-xl min-w-[180px]">
      <div className="text-gray-800 dark:text-gray-200 text-sm font-semibold mb-2">{city}</div>
      <div className="flex items-center gap-3">
        <div className="text-5xl">{icon}</div>
        <div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{temp}°C</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{weatherDesc}</div>
        </div>
      </div>
    </div>
  )
}

export default function WeatherWidget() {
  return (
    <div className="space-y-3">
      <WeatherCard city="Shanghai" cityEn="Shanghai" />
      <WeatherCard city="Arlington" cityEn="Arlington,VA" />
    </div>
  )
}
