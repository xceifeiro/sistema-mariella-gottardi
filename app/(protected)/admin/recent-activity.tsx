"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, FileText, CheckCircle } from "lucide-react"

export function RecentActivity() {
  // Dados simulados de atividade recente
  const recentActivities = [
    {
      id: 1,
      type: "pedido_criado",
      description: "Novo pedido de análise facial",
      user: "João Silva",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min atrás
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      id: 2,
      type: "analise_concluida",
      description: "Análise de temperamento finalizada",
      user: "Maria Santos",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 min atrás
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      id: 3,
      type: "cliente_cadastrado",
      description: "Novo cliente registrado",
      user: "Pedro Costa",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h atrás
      icon: User,
      color: "bg-purple-500",
    },
    {
      id: 4,
      type: "pedido_criado",
      description: "Solicitação de teste de temperamento",
      user: "Ana Oliveira",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4h atrás
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      id: 5,
      type: "analise_concluida",
      description: "Relatório de análise gerado",
      user: "Carlos Lima",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6h atrás
      icon: CheckCircle,
      color: "bg-green-500",
    },
  ]

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}min atrás`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours}h atrás`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days}d atrás`
    }
  }

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "pedido_criado":
        return <Badge variant="outline">Novo Pedido</Badge>
      case "analise_concluida":
        return <Badge variant="default">Concluído</Badge>
      case "cliente_cadastrado":
        return <Badge variant="secondary">Novo Cliente</Badge>
      default:
        return <Badge variant="outline">Atividade</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const IconComponent = activity.icon
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}
                >
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getActivityBadge(activity.type)}
                    <span className="text-xs text-muted-foreground">{getTimeAgo(activity.timestamp)}</span>
                  </div>
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">por {activity.user}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">Últimas 24 horas • Atualização automática</p>
        </div>
      </CardContent>
    </Card>
  )
}
