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

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "concluido":
        return "bg-green-100/80 text-green-800 border-green-200/50"
      case "em_andamento":
        return "bg-blue-100/80 text-blue-800 border-blue-200/50"
      case "pendente":
        return "bg-yellow-100/80 text-yellow-800 border-yellow-200/50"
      case "cancelado":
        return "bg-red-100/80 text-red-800 border-red-200/50"
      default:
        return "bg-gray-100/80 text-gray-800 border-gray-200/50"
    }
  }

  return (
    <Card className="card-hover border-0 shadow-xl glass-dark">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-slate-100">
          <div className="w-8 h-8 glass-effect rounded-lg flex items-center justify-center">
            📈
          </div>
          Status dos Pedidos
        </CardTitle>
        <p className="text-slate-300 text-sm">Distribuição por status de pedidos</p>
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
                      <Badge className={`${getStatusBadgeStyle(item.status)} backdrop-blur-sm border`}>
                        {getStatusLabel(item.status)}
                      </Badge>
                      <span className="text-sm text-slate-300">{item.count} pedidos</span>
                    </div>
                    <span className="text-sm font-medium text-slate-100">{percentage}%</span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={percentage} 
                      className="h-2 bg-white/10" 
                    />
                    <div 
                      className={`absolute top-0 left-0 h-2 rounded-full ${getStatusColor(item.status)} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}

            <div className="pt-4 border-t border-white/20">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-100">Total de Pedidos</span>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  {total}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 glass-effect rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-4xl">📊</div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Nenhum pedido encontrado</h3>
            <p className="text-white/70 text-sm">Aguardando primeiros pedidos do sistema</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
