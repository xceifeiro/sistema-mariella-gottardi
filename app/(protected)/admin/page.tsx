import { getSession, logout } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Activity, TrendingUp, CheckCircle, Building2, UserCheck, Clock, Sparkles, Target, Brain } from 'lucide-react'
import sql from "@/lib/db"
import { AdminDashboardCharts } from "./dashboard-charts"
import { RecentActivity } from "./recent-activity"
import { StatsComparison } from "./stats-comparison"
import { AutoRefreshWrapper } from "@/components/auto-refresh-wrapper"
import Link from "next/link"

async function getAdminStats() {
  // Estatísticas básicas
  const clientCount = await sql`SELECT COUNT(*) FROM clientes`
  const orderCount = await sql`SELECT COUNT(*) FROM pedidos`
  const logCount = await sql`SELECT COUNT(*) FROM logs`

  // Estatísticas corporativas
  const corporativeCount = await sql`SELECT COUNT(*) FROM empresas_corporativas WHERE status = 'ativo'`
  const collaboratorCount = await sql`SELECT COUNT(*) FROM colaboradores_corporativos WHERE status = 'ativo'`

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

  // Empresas corporativas recentes
  const recentCorporatives = await sql`
    SELECT 
      ec.nome_empresa,
      ec.limite_colaboradores,
      ec.colaboradores_cadastrados,
      ec.criado_em,
      u.nome as responsavel_nome
    FROM empresas_corporativas ec
    JOIN usuarios u ON ec.usuario_id = u.id
    WHERE ec.status = 'ativo'
    ORDER BY ec.criado_em DESC
    LIMIT 5
  `

  return {
    clients: Number.parseInt(clientCount[0].count),
    orders: Number.parseInt(orderCount[0].count),
    logs: Number.parseInt(logCount[0].count),
    corporatives: Number.parseInt(corporativeCount[0].count),
    collaborators: Number.parseInt(collaboratorCount[0].count),
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
    recentCorporatives: recentCorporatives.map((corp) => ({
      nomeEmpresa: corp.nome_empresa,
      limiteColaboradores: Number.parseInt(corp.limite_colaboradores),
      colaboradoresCadastrados: Number.parseInt(corp.colaboradores_cadastrados),
      criadoEm: corp.criado_em,
      responsavelNome: corp.responsavel_nome,
    })),
  }
}

function formatDate(dateString: string | null) {
  if (!dateString) return "Nunca"
  return new Date(dateString).toLocaleDateString("pt-BR")
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
    <AutoRefreshWrapper>
      <div className="min-h-screen floating-shapes">
        <main className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl glass-dark p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-pink-600/20 to-purple-600/20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">Painel Administrativo 🛡️</h1>
                  <p className="text-slate-200 text-lg mb-4">Bem-vindo, {session.nome}! Gerencie todo o sistema</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 glass-effect px-3 py-1 rounded-full">
                      <Activity className="w-4 h-4" />
                      <span>Sistema Online</span>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      ✅ Administrador
                    </Badge>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-32 h-32 glass-effect rounded-full flex items-center justify-center animate-float">
                    <Brain className="w-16 h-16 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card-hover border-0 shadow-xl glass-dark text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-200 text-sm font-medium">Total de Clientes</p>
                    <p className="text-3xl font-bold drop-shadow-lg">{stats.clients}</p>
                    <p className="text-xs text-slate-300 mt-1">Clientes individuais</p>
                  </div>
                  <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-xl glass-dark text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-200 text-sm font-medium">Empresas Corporativas</p>
                    <p className="text-3xl font-bold drop-shadow-lg">{stats.corporatives}</p>
                    <p className="text-xs text-slate-300 mt-1">{stats.collaborators} colaboradores</p>
                  </div>
                  <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-xl glass-dark text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-200 text-sm font-medium">Pedidos Totais</p>
                    <p className="text-3xl font-bold drop-shadow-lg">{stats.orders}</p>
                    <p className="text-xs text-slate-300 mt-1">+{stats.monthlyStats.pedidos} este mês</p>
                  </div>
                  <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-xl glass-dark text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-200 text-sm font-medium">Taxa de Conclusão</p>
                    <p className="text-3xl font-bold drop-shadow-lg">{completionRate}%</p>
                    <p className="text-xs text-slate-300 mt-1">
                      {stats.monthlyStats.concluidos} de {stats.monthlyStats.pedidos}
                    </p>
                  </div>
                  <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Clientes Mais Ativos */}
            <Card className="lg:col-span-2 card-hover border-0 shadow-xl glass-dark">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl text-slate-100">
                      <div className="w-8 h-8 glass-effect rounded-lg flex items-center justify-center">
                        <UserCheck className="h-4 w-4 text-white" />
                      </div>
                      Clientes Mais Ativos
                    </CardTitle>
                    <p className="text-slate-300 text-sm">Clientes com mais pedidos realizados</p>
                  </div>
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-float" />
                </div>
              </CardHeader>
              <CardContent>
                {stats.activeClients.length > 0 ? (
                  <div className="space-y-4">
                    {stats.activeClients.map((client, index) => (
                      <div
                        key={client.email}
                        className="flex items-center justify-between p-4 glass-effect rounded-xl hover:bg-white/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-100">{client.nome}</p>
                            <p className="text-sm text-slate-300">{client.email}</p>
                            {client.ultimoPedido && (
                              <p className="text-xs text-slate-400">
                                Último pedido: {formatDate(client.ultimoPedido)}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge className="bg-green-100/80 text-green-800 border-green-200/50 backdrop-blur-sm">
                          {client.totalPedidos} pedidos
                        </Badge>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full mt-4 glass-effect border-white/30 text-white hover:bg-white/20 bg-transparent"
                      asChild
                    >
                      <Link href="/admin/clientes">
                        <Target className="w-4 h-4 mr-2" />
                        Ver Todos os Clientes
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 glass-effect rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-10 w-10 text-white/70" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Nenhum cliente ativo</h3>
                    <p className="text-white/70 mb-4">Aguardando primeiros clientes do sistema</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Empresas Corporativas Recentes */}
            <Card className="card-hover border-0 shadow-xl glass-dark">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl text-slate-100">
                  <div className="w-8 h-8 glass-effect rounded-lg flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  Empresas Recentes
                </CardTitle>
                <p className="text-white/70 text-sm">Últimas empresas cadastradas</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentCorporatives.slice(0, 4).map((corp, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 glass-effect rounded-xl hover:bg-white/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                          🏢
                        </div>
                        <div>
                          <p className="font-medium text-slate-100 text-sm">{corp.nomeEmpresa}</p>
                          <p className="text-xs text-slate-300">
                            {corp.colaboradoresCadastrados}/{corp.limiteColaboradores} colaboradores
                          </p>
                        </div>
                      </div>
                      <Badge className="glass-effect border-white/30 text-white text-xs">
                        {formatDate(corp.criadoEm)}
                      </Badge>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full mt-4 glass-effect border-white/30 text-white hover:bg-white/20 bg-transparent"
                    asChild
                  >
                    <Link href="/admin/corporativos">
                      <Target className="w-4 h-4 mr-2" />
                      Ver Todas as Empresas
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comparações e Gráficos */}
          <div className="grid gap-6 md:grid-cols-2">
            <StatsComparison ordersByStatus={stats.ordersByStatus} />
            <AdminDashboardCharts temperamentStats={stats.temperamentStats} />
          </div>

          {/* Ações Rápidas */}
          <Card className="card-hover border-0 shadow-xl glass-dark">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <div className="w-8 h-8 glass-effect rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-yellow-400 animate-float" />
                </div>
                Ações Administrativas
              </CardTitle>
              <p className="text-slate-300">Acesse rapidamente as principais funcionalidades</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <Button className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg" asChild>
                  <Link href="/admin/clientes" className="flex flex-col items-center gap-2">
                    <Users className="h-6 w-6" />
                    <span>Clientes</span>
                  </Link>
                </Button>
                <Button className="h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg" asChild>
                  <Link href="/admin/corporativos" className="flex flex-col items-center gap-2">
                    <Building2 className="h-6 w-6" />
                    <span>Corporativos</span>
                  </Link>
                </Button>
                <Button className="h-16 glass-effect border-white/30 text-white hover:bg-white/20" asChild>
                  <Link href="/admin/analise-facial" className="flex flex-col items-center gap-2">
                    <Activity className="h-6 w-6" />
                    <span>Análises</span>
                  </Link>
                </Button>
                <Button className="h-16 glass-effect border-white/30 text-white hover:bg-white/20" asChild>
                  <Link href="/admin" className="flex flex-col items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    <span>Relatórios</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Atividade Recente */}
          <RecentActivity />
        </main>
      </div>
    </AutoRefreshWrapper>
  )
}
