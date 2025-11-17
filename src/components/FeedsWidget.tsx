'use client'

import { useState, useEffect } from 'react'

interface FeedItem {
  title: string
  link: string
  date: string
}

export default function FeedsWidget() {
  const [feeds, setFeeds] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock RSS feeds for now
    const mockFeeds: FeedItem[] = [
      {
        title: 'React 19 Released',
        link: 'https://react.dev',
        date: '2024-12-01'
      },
      {
        title: 'Next.js 15 Features',
        link: 'https://nextjs.org',
        date: '2024-11-15'
      },
      {
        title: 'TypeScript 5.3 Update',
        link: 'https://typescriptlang.org',
        date: '2024-11-10'
      }
    ]

    setTimeout(() => {
      setFeeds(mockFeeds)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="text-gray-600 dark:text-gray-400 text-sm animate-pulse">
        Loading feeds...
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {feeds.map((feed, index) => (
        <a
          key={index}
          href={feed.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
        >
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
            {feed.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {feed.date}
          </p>
        </a>
      ))}
    </div>
  )
}
