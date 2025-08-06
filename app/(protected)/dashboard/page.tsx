import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import sql from "@/lib/db"
import {
  User,
  ShoppingBag,
  FileText,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Activity,
  Sparkles,
  Target,
  Brain,
} from "lucide-react"
import { AutoRefreshWrapper } from "@/components/auto-refresh-wrapper"

async function getClientDashboardData(clientId: string) {
  // Buscar dados básicos do cliente
  const [clientInfo] = await sql`
    SELECT 
      u.nome, u.email, u.criado_em,
      c.status
    FROM usuarios u
    LEFT JOIN clientes c ON u.id = c.id
    WHERE u.id = ${clientId}
  `

  // Estatísticas gerais dos pedidos
  const [orderStats] = await sql`
    SELECT 
      COUNT(*) as total_pedidos,
      COUNT(CASE WHEN status = 'pendente' THEN 1 END) as pendentes,
      COUNT(CASE WHEN status = 'em_andamento' THEN 1 END) as em_andamento,
      COUNT(CASE WHEN status = 'concluido' THEN 1 END) as concluidos,
      COUNT(CASE WHEN status = 'cancelado' THEN 1 END) as cancelados,
      MAX(data_pedido) as ultimo_pedido,
      MIN(data_pedido) as primeiro_pedido
    FROM pedidos 
    WHERE cliente_id = ${clientId}
  `

  // Pedidos recentes com mais detalhes
  const recentOrders = await sql`
    SELECT 
      p.id, p.status, p.data_pedido, p.atualizado_em,
      s.nome as servico_nome, s.slug
    FROM pedidos p
    JOIN servicos s ON p.servico_id = s.id
    WHERE p.cliente_id = ${clientId}
    ORDER BY p.data_pedido DESC
    LIMIT 5
  `

  // Resultados de testes disponíveis
  const availableResults = await sql`
    SELECT 
      rt.id, rt.tipo_teste, rt.criado_em,
      s.nome as servico_nome, s.slug,
      p.data_pedido
    FROM resultados_testes rt
    JOIN pedidos p ON rt.pedido_id = p.id
    JOIN servicos s ON p.servico_id = s.id
    WHERE p.cliente_id = ${clientId}
    ORDER BY rt.criado_em DESC
    LIMIT 3
  `

  // Atividade recente (logs)
  const recentActivity = await sql`
    SELECT 
      acao, descricao, criado_em
    FROM logs
    WHERE usuario_id = ${clientId}
    ORDER BY criado_em DESC
    LIMIT 5
  `

  // Serviços disponíveis para contratação
  const availableServices = await sql`
    SELECT 
      s.id, s.nome, s.slug,
      CASE WHEN p.id IS NOT NULL THEN true ELSE false END as ja_contratado
    FROM servicos s
    LEFT JOIN pedidos p ON s.id = p.servico_id AND p.cliente_id = ${clientId}
    WHERE s.ativo = true
    ORDER BY s.id
  `
  const contratouIdsEspecificos = availableServices.some(
  (s) => s.ja_contratado && [5, 7, 8].includes(Number(s.id))
)

  return {
    client: clientInfo,
    stats: orderStats || {
      total_pedidos: 0,
      pendentes: 0,
      em_andamento: 0,
      concluidos: 0,
      cancelados: 0,
      ultimo_pedido: null,
      primeiro_pedido: null,
    },
    recentOrders,
    availableResults,
    recentActivity,
    availableServices,
     contratouIdsEspecificos,
    lastUpdate: new Date().toISOString(),
  }
}

function formatDate(dateString: string | null) {
  if (!dateString) return "Nunca"
  return new Date(dateString).toLocaleDateString("pt-BR")
}

function formatDateTime(dateString: string | null) {
  if (!dateString) return "Nunca"
  return new Date(dateString).toLocaleString("pt-BR")
}

function getStatusBadge(status: string) {
  const variants = {
    pendente: {
      variant: "secondary",
      color: "bg-yellow-100/80 text-yellow-800 border-yellow-200/50 backdrop-blur-sm",
      icon: Clock,
    },
    em_andamento: {
      variant: "default",
      color: "bg-blue-100/80 text-blue-800 border-blue-200/50 backdrop-blur-sm",
      icon: Activity,
    },
    concluido: {
      variant: "success",
      color: "bg-green-100/80 text-green-800 border-green-200/50 backdrop-blur-sm",
      icon: CheckCircle,
    },
    cancelado: {
      variant: "destructive",
      color: "bg-red-100/80 text-red-800 border-red-200/50 backdrop-blur-sm",
      icon: AlertCircle,
    },
  } as const

  const config = variants[status as keyof typeof variants] || variants.pendente
  const Icon = config.icon

  return (
    <Badge className={`${config.color} border flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {status === "pendente" && "Pendente"}
      {status === "em_andamento" && "Em Andamento"}
      {status === "concluido" && "Concluído"}
      {status === "cancelado" && "Cancelado"}
    </Badge>
  )
}

function getServiceIcon(slug: string) {
  switch (slug) {
    case "teste-temperamentos":
      return "🧠"
    case "teste-disc":
      return "👥"
    case "analise-facial":
      return "👁️"
    case "pacote-full":
      return "⭐"
    default:
      return "📋"
  }
}

export default async function DashboardPage() {
  
  const session = await getSession()
  if (!session || session.tipo_usuario !== "cliente") {
    redirect("/login")
  }

  const { client, stats, recentOrders, availableResults, recentActivity, availableServices, contratouIdsEspecificos, lastUpdate } =
  await getClientDashboardData(session.sub)

  if (!client) {
    redirect("/login")
  }

  return (
    <AutoRefreshWrapper>
      <div className="min-h-screen floating-shapes">
        <main className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl glass-dark p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">Olá, {client.nome.split(" ")[0]}! 👋</h1>
                  <p className="text-slate-200 text-lg mb-4">Bem-vindo ao seu painel de análise comportamental</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 glass-effect px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4" />
                      <span>Membro desde {formatDate(client.criado_em)}</span>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      {client.status === "ativo" ? "✅ Conta Ativa" : "❌ Conta Inativa"}
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
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="card-hover border-0 shadow-xl glass-dark text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-200 text-sm font-medium">Total de Serviços</p>
                    <p className="text-3xl font-bold drop-shadow-lg">{stats.total_pedidos}</p>
                  </div>
                  <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-xl glass-dark text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-200 text-sm font-medium">Em Andamento</p>
                    <p className="text-3xl font-bold drop-shadow-lg">{stats.em_andamento}</p>
                  </div>
                  <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-xl glass-dark text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-200 text-sm font-medium">Concluídos</p>
                    <p className="text-3xl font-bold drop-shadow-lg">{stats.concluidos}</p>
                  </div>
                  <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-xl glass-dark text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-200 text-sm font-medium">Resultados</p>
                    <p className="text-3xl font-bold drop-shadow-lg">{availableResults.length}</p>
                  </div>
                  <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Pedidos Recentes */}
            <Card className="lg:col-span-2 card-hover border-0 shadow-xl glass-dark">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl text-slate-100">
                      <div className="w-8 h-8 glass-effect rounded-lg flex items-center justify-center">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      Pedidos Recentes
                    </CardTitle>
                    <CardDescription className="text-slate-300">Seus últimos serviços contratados</CardDescription>
                  </div>
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-float" />
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order: any) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 glass-effect rounded-xl hover:bg-white/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                            {getServiceIcon(order.slug)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-100">{order.servico_nome}</p>
                            <p className="text-sm text-slate-300">{formatDate(order.data_pedido)}</p>
                            {order.atualizado_em !== order.data_pedido && (
                              <p className="text-xs text-slate-400">
                                Atualizado: {formatDateTime(order.atualizado_em)}
                              </p>
                            )}
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    ))}
                    {!contratouIdsEspecificos && (
                      <Button
                        variant="outline"
                        className="w-full mt-4 glass-effect border-white/30 text-white hover:bg-white/20 bg-transparent"
                        asChild
                      >
                        <Link href="/dashboard/servicos">
                          <Target className="w-4 h-4 mr-2" />
                          Ver Todos os Serviços
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 glass-effect rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-10 w-10 text-white/70" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Nenhum serviço contratado</h3>
                    <p className="text-white/70 mb-4">Comece sua jornada de autoconhecimento hoje!</p>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                      asChild
                    >
                      <Link href="/dashboard/servicos">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Explorar Serviços
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Serviços Disponíveis */}
            <Card className="card-hover border-0 shadow-xl glass-dark">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl text-slate-100">
                  <div className="w-8 h-8 glass-effect rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-white" />
                  </div>
                  Serviços Disponíveis
                </CardTitle>
                <CardDescription className="text-white/70">Explore nossos testes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableServices.slice(0, 4).map((service: any) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-3 glass-effect rounded-xl hover:bg-white/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                          {getServiceIcon(service.slug)}
                        </div>
                        <span className="font-medium text-slate-100">{service.nome}</span>
                      </div>
                      {service.ja_contratado ? (
                        <Badge className="bg-green-100/80 text-green-800 border-green-200/50 backdrop-blur-sm">
                          ✅ Contratado
                        </Badge>
                      ) : (
                        <Badge className="glass-effect border-white/30 text-white">Disponível</Badge>
                      )}
                    </div>
                  ))}
                  {!contratouIdsEspecificos && (
                    <Button
                      variant="outline"
                      className="w-full mt-4 glass-effect border-white/30 text-white hover:bg-white/20 bg-transparent"
                      asChild
                    >
                      <Link href="/dashboard/servicos">
                        <Target className="w-4 h-4 mr-2" />
                        Ver Todos os Serviços
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações Rápidas */}
          <Card className="card-hover border-0 shadow-xl glass-dark">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <div className="w-8 h-8 glass-effect rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-yellow-400 animate-float" />
                </div>
                Ações Rápidas
              </CardTitle>
              <CardDescription className="text-slate-300">
                Acesse rapidamente as principais funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg" asChild>
                  <Link href="/dashboard/resultados" className="flex flex-col items-center gap-2">
                    <FileText className="h-6 w-6" />
                    <span>Ver Resultados</span>
                  </Link>
                </Button>
                <Button className="h-16 glass-effect border-white/30 text-white hover:bg-white/20" asChild>
                  <Link href="/dashboard/perfil" className="flex flex-col items-center gap-2">
                    <User className="h-6 w-6" />
                    <span>Meu Perfil</span>
                  </Link>
                </Button>
                <Button className="h-16 glass-effect border-white/30 text-white hover:bg-white/20" asChild>
                  <Link href="/dashboard/perfil/editar" className="flex flex-col items-center gap-2">
                    <User className="h-6 w-6" />
                    <span>Editar Perfil</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </AutoRefreshWrapper>
  )
}
