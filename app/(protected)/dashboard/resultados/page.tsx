import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Camera,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  BarChart3,
  Activity,
} from "lucide-react"
import Link from "next/link"

interface Resultado {
  id: string
  pedido_id: string
  tipo_teste: string
  status: string
  criado_em: string
  data_conclusao: string | null
  observacoes: string | null
  data_atualizacao: string
  cliente_nome: string
}

async function getResultados(clienteId: string) {
  try {
    const resultados = await sql<Resultado[]>`
      SELECT 
        rt.id,
        rt.pedido_id,
        rt.tipo_teste,
        rt.status,
        rt.criado_em,
        p.data_conclusao,
        p.observacoes,
        rt.data_atualizacao,
        u.nome as cliente_nome
      FROM resultados_testes rt
      JOIN pedidos p ON rt.pedido_id = p.id
      JOIN usuarios u ON p.cliente_id = u.id
      WHERE p.cliente_id = ${clienteId}
      ORDER BY rt.criado_em DESC
    `

    return resultados
  } catch (error) {
    console.error("Erro ao buscar resultados:", error)
    return []
  }
}

function getServiceIcon(servico: string) {
  switch (servico.toLowerCase()) {
    case "teste-temperamentos":
      return <Brain className="w-5 h-5" />
    case "analise-facial":
      return <Camera className="w-5 h-5" />
    case "teste-disc":
      return <FileText className="w-5 h-5" />
    default:
      return <FileText className="w-5 h-5" />
  }
}

function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case "concluido":
    case "concluído":
      return (
        <Badge className="glass-effect border-green-400/30 text-green-300 bg-green-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Concluído
        </Badge>
      )
    case "em_andamento":
    case "processando":
      return (
        <Badge className="glass-effect border-yellow-400/30 text-yellow-300 bg-yellow-500/20">
          <Clock className="w-3 h-3 mr-1" />
          Em Andamento
        </Badge>
      )
    case "pendente":
      return (
        <Badge className="glass-effect border-orange-400/30 text-orange-300 bg-orange-500/20">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pendente
        </Badge>
      )
    default:
      return (
        <Badge className="glass-effect border-gray-400/30 text-gray-300 bg-gray-500/20">
          <Clock className="w-3 h-3 mr-1" />
          {status}
        </Badge>
      )
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function ResultadosPage() {
  const session = await getSession()

  if (!session || session.tipo_usuario !== "cliente") {
    redirect("/login")
  }

  const resultados = await getResultados(session.sub)

  const resultadosConcluidos = resultados.filter(
    (r) => r.status.toLowerCase() === "concluido" || r.status.toLowerCase() === "concluído",
  )
  const resultadosProcessando = resultados.filter(
    (r) => r.status.toLowerCase() === "em_andamento" || r.status.toLowerCase() === "processando",
  )
  const resultadosPendentes = resultados.filter((r) => r.status.toLowerCase() === "pendente")

  const totalResultados = resultados.length
  const totalConcluidos = resultadosConcluidos.length
  const totalAtivos = resultadosProcessando.length + resultadosPendentes.length

  return (
    <div className="min-h-screen floating-shapes">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl glass-dark p-8 text-slate-100 shadow-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 glass-effect rounded-2xl flex items-center justify-center animate-float">
                    <BarChart3 className="w-10 h-10 text-slate-100" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-1 drop-shadow-lg">Meus Resultados</h1>
                    <p className="text-lg text-slate-200">Acompanhe todos os seus testes e análises</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 glass-effect rounded-full flex items-center justify-center animate-float">
                  <Activity className="w-16 h-16 text-slate-100" />
                </div>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-effect p-4 rounded-xl border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalResultados}</p>
                    <p className="text-slate-300 text-sm">Total de Resultados</p>
                  </div>
                </div>
              </div>

              <div className="glass-effect p-4 rounded-xl border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalConcluidos}</p>
                    <p className="text-slate-300 text-sm">Concluídos</p>
                  </div>
                </div>
              </div>

              <div className="glass-effect p-4 rounded-xl border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalAtivos}</p>
                    <p className="text-slate-300 text-sm">Em Andamento</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de Resultados */}
        <Tabs defaultValue="todos" className="space-y-6">
          <TabsList className="glass-dark border-white/20 p-1">
            <TabsTrigger value="todos" className="data-[state=active]:glass-effect data-[state=active]:text-slate-100">
              Todos ({totalResultados})
            </TabsTrigger>
            <TabsTrigger
              value="concluidos"
              className="data-[state=active]:glass-effect data-[state=active]:text-slate-100"
            >
              Concluídos ({totalConcluidos})
            </TabsTrigger>
            <TabsTrigger
              value="processando"
              className="data-[state=active]:glass-effect data-[state=active]:text-slate-100"
            >
              Em Andamento ({totalAtivos})
            </TabsTrigger>
            <TabsTrigger
              value="pendentes"
              className="data-[state=active]:glass-effect data-[state=active]:text-slate-100"
            >
              Pendentes ({resultadosPendentes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="space-y-4">
            {resultados.length === 0 ? (
              <Card className="glass-dark border-white/20 shadow-xl">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-24 h-24 glass-effect rounded-full flex items-center justify-center mb-6">
                    <FileText className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-slate-400 text-center mb-6">
                    Você ainda não possui resultados de testes. Contrate um serviço para começar!
                  </p>
                  <Button
                    asChild
                    className="glass-effect bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                  >
                    <Link href="/dashboard/servicos">Ver Serviços</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {resultados.map((resultado, index) => (
                  <Card
                    key={resultado.id}
                    className="glass-dark border-white/20 shadow-xl card-hover"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
                            {getServiceIcon(resultado.tipo_teste)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-100">{resultado.tipo_teste}</h3>
                            <p className="text-slate-400 text-sm">Pedido #{resultado.pedido_id.slice(0, 8)}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-400 text-sm">{formatDate(resultado.criado_em)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(resultado.status)}
                          {(resultado.status.toLowerCase() === "concluido" ||
                            resultado.status.toLowerCase() === "concluído") && (
                            <Button
                              asChild
                              size="sm"
                              className="glass-effect text-slate-100 border-white/30 hover:bg-white/20"
                            >
                              <Link href={`/dashboard/resultados/${resultado.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Resultado
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="concluidos" className="space-y-4">
            {resultadosConcluidos.length === 0 ? (
              <Card className="glass-dark border-white/20 shadow-xl">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">Nenhum resultado concluído</h3>
                  <p className="text-slate-400 text-center">
                    Seus resultados aparecerão aqui quando estiverem prontos.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {resultadosConcluidos.map((resultado, index) => (
                  <Card
                    key={resultado.id}
                    className="glass-dark border-white/20 shadow-xl card-hover"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
                            {getServiceIcon(resultado.tipo_teste)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-100">{resultado.tipo_teste}</h3>
                            <p className="text-slate-400 text-sm">Pedido #{resultado.pedido_id.slice(0, 8)}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-400 text-sm">{formatDate(resultado.criado_em)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(resultado.status)}
                          <Button
                            asChild
                            size="sm"
                            className="glass-effect text-slate-100 border-white/30 hover:bg-white/20"
                          >
                            <Link href={`/dashboard/resultados/${resultado.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Resultado
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="processando" className="space-y-4">
            {resultadosProcessando.length === 0 ? (
              <Card className="glass-dark border-white/20 shadow-xl">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Clock className="w-16 h-16 text-yellow-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">Nenhum resultado em andamento</h3>
                  <p className="text-slate-400 text-center">Não há testes sendo processados no momento.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {resultadosProcessando.map((resultado, index) => (
                  <Card
                    key={resultado.id}
                    className="glass-dark border-white/20 shadow-xl card-hover"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
                            {getServiceIcon(resultado.tipo_teste)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-100">{resultado.tipo_teste}</h3>
                            <p className="text-slate-400 text-sm">Pedido #{resultado.pedido_id.slice(0, 8)}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-400 text-sm">{formatDate(resultado.criado_em)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">{getStatusBadge(resultado.status)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pendentes" className="space-y-4">
            {resultadosPendentes.length === 0 ? (
              <Card className="glass-dark border-white/20 shadow-xl">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <AlertCircle className="w-16 h-16 text-orange-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">Nenhum resultado pendente</h3>
                  <p className="text-slate-400 text-center">Não há testes aguardando processamento.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {resultadosPendentes.map((resultado, index) => (
                  <Card
                    key={resultado.id}
                    className="glass-dark border-white/20 shadow-xl card-hover"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
                            {getServiceIcon(resultado.tipo_teste)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-100">{resultado.tipo_teste}</h3>
                            <p className="text-slate-400 text-sm">Pedido #{resultado.pedido_id.slice(0, 8)}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-400 text-sm">{formatDate(resultado.criado_em)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">{getStatusBadge(resultado.status)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
