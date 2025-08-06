import { getSession, logout } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Activity, TrendingUp, CheckCircle } from "lucide-react"
import sql from "@/lib/db"
import { AdminDashboardCharts } from "./dashboard-charts"
import { RecentActivity } from "./recent-activity"
import { StatsComparison } from "./stats-comparison"

async function getAdminStats() {
  // Estatísticas básicas
  const clientCount = await sql`SELECT COUNT(*) FROM clientes`
  const orderCount = await sql`SELECT COUNT(*) FROM pedidos`
  const logCount = await sql`SELECT COUNT(*) FROM logs`

  // Pedidos por status
  const ordersByStatus = await sql`
    SELECT status, COUNT(*) as count 
    FROM pedidos 
    GROUP BY status
  `

  // Estatísticas dos últimos 30 dias
  const last30Days = await sql`
    SELECT 
      COUNT(*) as pedidos_mes,
      COUNT(CASE WHEN status = 'concluido' THEN 1 END) as concluidos_mes,
      COUNT(CASE WHEN data_pedido >= NOW() - INTERVAL '7 days' THEN 1 END) as pedidos_semana
    FROM pedidos 
    WHERE data_pedido >= NOW() - INTERVAL '30 days'
  `

  // Clientes mais ativos - JOIN correto entre clientes e usuarios
  const activeClients = await sql`
    SELECT 
      u.nome,
      u.email,
      COUNT(p.id) as total_pedidos,
      MAX(p.data_pedido) as ultimo_pedido
    FROM clientes c
    INNER JOIN usuarios u ON c.id = u.id
    LEFT JOIN pedidos p ON c.id = p.cliente_id
    GROUP BY c.id, u.nome, u.email
    ORDER BY total_pedidos DESC
    LIMIT 5
  `

  // Análises por temperamento - corrigindo para usar a tabela resultados_testes
  const temperamentStats = await sql`
    SELECT 
      rt.resultado->>'temperamento_predominante' as temperamento,
      COUNT(*) as quantidade
    FROM resultados_testes rt
    WHERE rt.resultado IS NOT NULL 
    AND rt.resultado->>'temperamento_predominante' IS NOT NULL
    GROUP BY rt.resultado->>'temperamento_predominante'
    ORDER BY quantidade DESC
  `

  return {
    clients: Number.parseInt(clientCount[0].count),
    orders: Number.parseInt(orderCount[0].count),
    logs: Number.parseInt(logCount[0].count),
    ordersByStatus: ordersByStatus.map((row) => ({
      status: row.status,
      count: Number.parseInt(row.count),
    })),
    monthlyStats: {
      pedidos: Number.parseInt(last30Days[0].pedidos_mes || "0"),
      concluidos: Number.parseInt(last30Days[0].concluidos_mes || "0"),
      semana: Number.parseInt(last30Days[0].pedidos_semana || "0"),
    },
    activeClients: activeClients.map((client) => ({
      nome: client.nome,
      email: client.email,
      totalPedidos: Number.parseInt(client.total_pedidos),
      ultimoPedido: client.ultimo_pedido,
    })),
    temperamentStats: temperamentStats.map((stat) => ({
      temperamento: stat.temperamento,
      quantidade: Number.parseInt(stat.quantidade),
    })),
  }
}

export default async function AdminDashboard() {
  const session = await getSession()
  if (!session || session.tipo_usuario !== "admin") {
    redirect("/login")
  }

  const stats = await getAdminStats()

  // Calcular métricas - protegendo contra divisão por zero
  const completionRate =
    stats.monthlyStats.pedidos > 0 ? Math.round((stats.monthlyStats.concluidos / stats.monthlyStats.pedidos) * 100) : 0
  const weeklyGrowth =
    stats.monthlyStats.pedidos > 0 && stats.monthlyStats.semana > 0
      ? Math.round(((stats.monthlyStats.semana * 4) / stats.monthlyStats.pedidos - 1) * 100)
      : 0

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Estatísticas Principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.clients}</div>
              <p className="text-xs text-muted-foreground">{stats.activeClients.length} ativos este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Totais</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orders}</div>
              <p className="text-xs text-muted-foreground">+{stats.monthlyStats.pedidos} este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.monthlyStats.concluidos} de {stats.monthlyStats.pedidos} concluídos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crescimento Semanal</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weeklyGrowth > 0 ? "+" : ""}
                {weeklyGrowth}%
              </div>
              <p className="text-xs text-muted-foreground">{stats.monthlyStats.semana} pedidos esta semana</p>
            </CardContent>
          </Card>
        </div>

        {/* Comparações e Gráficos */}
        <div className="grid gap-6 md:grid-cols-2">
          <StatsComparison ordersByStatus={stats.ordersByStatus} />
          <AdminDashboardCharts temperamentStats={stats.temperamentStats} />
        </div>

        {/* Atividade Recente e Clientes Ativos */}
        <div className="grid gap-6 md:grid-cols-2">
          <RecentActivity />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Clientes Mais Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.activeClients.map((client, index) => (
                  <div key={client.email} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{client.nome}</p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{client.totalPedidos} pedidos</Badge>
                      {client.ultimoPedido && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Último: {new Date(client.ultimoPedido).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {stats.activeClients.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Nenhum cliente ativo encontrado</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status dos Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Status dos Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {stats.ordersByStatus.map((statusData) => (
                <div key={statusData.status} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold mb-2">{statusData.count}</div>
                  <Badge
                    variant={
                      statusData.status === "concluido"
                        ? "default"
                        : statusData.status === "em_andamento"
                          ? "secondary"
                          : statusData.status === "pendente"
                            ? "outline"
                            : "destructive"
                    }
                  >
                    {statusData.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Boas-vindas */}
        <div className="text-center mt-8">
          <p className="text-lg">
            Bem-vindo, <span className="font-bold">{session.nome}</span>!
          </p>
          <p className="text-sm text-muted-foreground">
            Dashboard atualizado em tempo real • {new Date().toLocaleString("pt-BR")}
          </p>
        </div>
      </main>
    </div>
  )
}
