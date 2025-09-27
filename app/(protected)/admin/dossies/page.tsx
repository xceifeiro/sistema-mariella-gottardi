import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Eye, Clock, CheckCircle, XCircle, User, Calendar } from "lucide-react"
import Link from "next/link"

interface DossieItem {
  resultado_id: string
  pedido_id: string
  cliente_nome: string
  cliente_email: string
  dossie_status: string
  dossie_data_geracao: string | null
  dossie_data_aprovacao: string | null
  data_conclusao: string
  aprovado_por_nome: string | null
}

async function getDossies() {
  try {
    const dossies = await sql<DossieItem[]>`
      SELECT 
        rt.id as resultado_id,
        rt.pedido_id,
        u.nome as cliente_nome,
        u.email as cliente_email,
        rt.dossie_status,
        rt.dossie_data_geracao,
        rt.dossie_data_aprovacao,
        rt.data_conclusao,
        ua.nome as aprovado_por_nome
      FROM resultados_testes rt
      JOIN pedidos p ON rt.pedido_id = p.id
      JOIN usuarios u ON p.cliente_id = u.id
      LEFT JOIN usuarios ua ON rt.dossie_aprovado_por = ua.id
      WHERE rt.dossie_gerado = true
      ORDER BY 
        CASE rt.dossie_status 
          WHEN 'pendente' THEN 1 
          WHEN 'aprovado' THEN 2 
          WHEN 'rejeitado' THEN 3 
        END,
        rt.dossie_data_geracao DESC
    `

    return dossies
  } catch (error) {
    console.error("Erro ao buscar dossiês:", error)
    return []
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

function getStatusBadge(status: string) {
  switch (status) {
    case "pendente":
      return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pendente</Badge>
    case "aprovado":
      return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Aprovado</Badge>
    case "rejeitado":
      return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Rejeitado</Badge>
    default:
      return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Desconhecido</Badge>
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "pendente":
      return <Clock className="w-5 h-5 text-yellow-400" />
    case "aprovado":
      return <CheckCircle className="w-5 h-5 text-green-400" />
    case "rejeitado":
      return <XCircle className="w-5 h-5 text-red-400" />
    default:
      return <FileText className="w-5 h-5 text-gray-400" />
  }
}

export default async function DossiesPage() {
  const session = await getSession()

  if (!session || session.tipo_usuario !== "admin") {
    redirect("/login")
  }

  const dossies = await getDossies()

  const pendentes = dossies.filter((d) => d.dossie_status === "pendente")
  const aprovados = dossies.filter((d) => d.dossie_status === "aprovado")
  const rejeitados = dossies.filter((d) => d.dossie_status === "rejeitado")

  return (
    <div className="min-h-screen floating-shapes">
      <div className="container mx-auto py-8 px-4 md:px-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl glass-dark p-8 text-slate-100 shadow-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 glass-effect rounded-2xl flex items-center justify-center animate-float">
                <FileText className="w-10 h-10 text-purple-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">📋 Gerenciar Dossiês</h1>
                <p className="text-slate-300 text-lg">Revisar e aprovar dossiês gerados pela automação</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-effect p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold text-yellow-300">{pendentes.length}</p>
                    <p className="text-slate-300 text-sm">Pendentes</p>
                  </div>
                </div>
              </div>
              <div className="glass-effect p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-green-300">{aprovados.length}</p>
                    <p className="text-slate-300 text-sm">Aprovados</p>
                  </div>
                </div>
              </div>
              <div className="glass-effect p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="text-2xl font-bold text-red-300">{rejeitados.length}</p>
                    <p className="text-slate-300 text-sm">Rejeitados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Dossiês */}
        {dossies.length === 0 ? (
          <Card className="glass-dark border-white/20 shadow-xl">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-16 h-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Nenhum dossiê encontrado</h3>
              <p className="text-slate-400 text-center">
                Os dossiês aparecerão aqui após serem gerados pela automação.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {dossies.map((dossie) => (
              <Card key={dossie.resultado_id} className="glass-dark border-white/20 shadow-xl card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
                        {getStatusIcon(dossie.dossie_status)}
                      </div>
                      <div>
                        <CardTitle className="text-slate-100 flex items-center gap-3">
                          Dossiê #{dossie.resultado_id.substring(0, 8)}
                          {getStatusBadge(dossie.dossie_status)}
                        </CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-300">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{dossie.cliente_nome}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {dossie.dossie_data_geracao
                                ? formatDate(dossie.dossie_data_geracao)
                                : formatDate(dossie.data_conclusao)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="glass-effect border-white/30 text-slate-100 hover:bg-white/20 bg-transparent"
                      >
                        <Link href={`/admin/dossies/${dossie.resultado_id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          {dossie.dossie_status === "pendente" ? "Revisar" : "Ver Dossiê"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Cliente</p>
                      <p className="text-slate-100 font-medium">{dossie.cliente_nome}</p>
                      <p className="text-slate-300 text-xs">{dossie.cliente_email}</p>
                    </div>

                    <div>
                      <p className="text-slate-400">Status</p>
                      <p className="text-slate-100 font-medium capitalize">{dossie.dossie_status}</p>
                      {dossie.aprovado_por_nome && (
                        <p className="text-slate-300 text-xs">por {dossie.aprovado_por_nome}</p>
                      )}
                    </div>

                    <div>
                      <p className="text-slate-400">Data</p>
                      <p className="text-slate-100 font-medium">
                        {dossie.dossie_data_aprovacao
                          ? formatDate(dossie.dossie_data_aprovacao)
                          : dossie.dossie_data_geracao
                            ? formatDate(dossie.dossie_data_geracao)
                            : formatDate(dossie.data_conclusao)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
