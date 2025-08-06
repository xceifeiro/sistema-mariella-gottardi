"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { RefreshCw } from "lucide-react"

interface RealTimeStatusProps {
  lastUpdate?: string
  autoRefresh?: boolean
}

export function RealTimeStatus({ lastUpdate, autoRefresh = true }: RealTimeStatusProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setIsRefreshing(true)
      // Simula um pequeno delay para mostrar o indicador
      setTimeout(() => {
        setIsRefreshing(false)
        setLastRefresh(new Date())
      }, 500)
    }, 30000) // Atualiza a cada 30 segundos

    return () => clearInterval(interval)
  }, [autoRefresh])

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
      <span>Última atualização: {lastRefresh.toLocaleTimeString("pt-BR")}</span>
      {autoRefresh}
    </div>
  )
}
