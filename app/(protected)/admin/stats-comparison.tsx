"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface OrderStatus {
  status: string
  count: number
}

interface StatsComparisonProps {
  ordersByStatus: OrderStatus[]
}

export function StatsComparison({ ordersByStatus }: StatsComparisonProps) {
  const total = ordersByStatus.reduce((sum, item) => sum + item.count, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluido":
        return "bg-green-500"
      case "em_andamento":
        return "bg-blue-500"
      case "pendente":
        return "bg-yellow-500"
      case "cancelado":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "concluido":
        return "Concluído"
      case "em_andamento":
        return "Em Andamento"
      case "pendente":
        return "Pendente"
      case "cancelado":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">📈 Comparação de Status</CardTitle>
      </CardHeader>
      <CardContent>
        {total > 0 ? (
          <div className="space-y-4">
            {ordersByStatus.map((item) => {
              const percentage = Math.round((item.count / total) * 100)
              return (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getStatusLabel(item.status)}</Badge>
                      <span className="text-sm text-muted-foreground">{item.count} pedidos</span>
                    </div>
                    <span className="text-sm font-medium">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total de Pedidos</span>
                <Badge variant="secondary">{total}</Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum pedido encontrado</p>
            <p className="text-sm">Aguardando primeiros pedidos do sistema</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
