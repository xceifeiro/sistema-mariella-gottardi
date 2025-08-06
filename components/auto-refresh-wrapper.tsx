"use client"

import type React from "react"

import { useAutoRefresh } from "@/hooks/use-auto-refresh"
import { useState } from "react"

interface AutoRefreshWrapperProps {
  children: React.ReactNode
  interval?: number
}

export function AutoRefreshWrapper({ children, interval = 30000 }: AutoRefreshWrapperProps) {
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { refresh } = useAutoRefresh({
    interval,
    enabled: autoRefreshEnabled,
    onRefresh: () => {
      setIsRefreshing(true)
      setTimeout(() => setIsRefreshing(false), 1000)
    },
  })

  const handleManualRefresh = () => {
    setIsRefreshing(true)
    refresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="">
      {children}
    </div>
  )
}
