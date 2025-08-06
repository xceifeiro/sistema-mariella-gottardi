"use client"

import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface UseAutoRefreshOptions {
  interval?: number // em milissegundos
  enabled?: boolean
  onRefresh?: () => void
}

export function useAutoRefresh({
  interval = 30000, // 30 segundos por padrão
  enabled = true,
  onRefresh,
}: UseAutoRefreshOptions = {}) {
  const router = useRouter()

  const refresh = useCallback(() => {
    router.refresh()
    onRefresh?.()
  }, [router, onRefresh])

  useEffect(() => {
    if (!enabled) return

    const intervalId = setInterval(refresh, interval)
    return () => clearInterval(intervalId)
  }, [refresh, interval, enabled])

  return { refresh }
}
