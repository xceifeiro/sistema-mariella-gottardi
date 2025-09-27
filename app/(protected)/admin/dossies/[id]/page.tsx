import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, User, Calendar, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import DossieActions from "./dossie-actions"

interface DossieDetalhado {
  resultado_id: string
  pedido_id: string
  cliente_id: string
  cliente_nome: string
  cliente_email: string
  dossie_conteudo: string | null
  dossie_status: string
  dossie_data_geracao: string | null
  dossie_data_aprovacao: string | null
  dossie_observacoes: string | null
  aprovado_por_nome: string | null
  data_conclusao: string
  analise_html: string | null
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

async function getDossieDetalhado(resultadoId: string) {
  try {
    const [dossie] = await sql<DossieDetalhado[]>`
      SELECT 
        rt.id as resultado_id,
        rt.pedido_id,
        p.cliente_id,
        u.nome as cliente_nome,
        u.email as cliente_email,
        COALESCE(rt.dossie_conteudo, rt.html) as dossie_conteudo,
        COALESCE(rt.dossie_status, 'pendente') as dossie_status,
        rt.dossie_data_geracao,
        rt.dossie_data_aprovacao,
        rt.dossie_observacoes,
        ua.nome as aprovado_por_nome,
        rt.data_conclusao,
        rt.html as analise_html
      FROM resultados_testes rt
      JOIN pedidos p ON rt.pedido_id = p.id
      JOIN usuarios u ON p.cliente_id = u.id
      LEFT JOIN usuarios ua ON rt.dossie_aprovado_por = ua.id
      WHERE rt.id = ${resultadoId}
        AND (rt.dossie_gerado = true OR rt.html IS NOT NULL OR rt.dossie_conteudo IS NOT NULL)
    `

    return dossie
  } catch (error) {
    console.error("Erro ao buscar dossiê:", error)
    return null
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
      return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pendente Aprovação</Badge>
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
      return <Clock className="w-8 h-8 text-yellow-400" />
    case "aprovado":
      return <CheckCircle className="w-8 h-8 text-green-400" />
    case "rejeitado":
      return <XCircle className="w-8 h-8 text-red-400" />
    default:
      return <FileText className="w-8 h-8 text-gray-400" />
  }
}

export default async function DossieDetalhePage({ params }: PageProps) {
  const session = await getSession()

  if (!session || session.tipo_usuario !== "admin") {
    redirect("/login")
  }

  const { id } = await params
  const dossie = await getDossieDetalhado(id)

  if (!dossie) {
    notFound()
  }

  return (
    <div className="min-h-screen floating-shapes">
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 glass-dark border-b border-white/20 px-4 md:px-6">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="glass-effect border-white/30 text-slate-100 hover:bg-white/20 bg-transparent"
          >
            <Link href="/admin/dossies">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <h1 className="text-lg font-semibold md:text-2xl text-slate-100">Dossiê - {dossie.cliente_nome}</h1>

          <div className="ml-auto flex items-center gap-4">{getStatusBadge(dossie.dossie_status)}</div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {/* Header do Dossiê */}
          <div className="relative overflow-hidden rounded-3xl glass-dark p-8 text-slate-100 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 glass-effect rounded-2xl flex items-center justify-center animate-float">
                  {getStatusIcon(dossie.dossie_status)}
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
                    Dossiê #{dossie.resultado_id.substring(0, 8)}
                  </h1>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(dossie.dossie_status)}
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-300">{dossie.cliente_nome}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-effect p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <User className="w-6 h-6 text-blue-400" />
                    <div>
                      <p className="text-slate-300 text-sm">Cliente</p>
                      <p className="text-slate-100 font-semibold">{dossie.cliente_nome}</p>
                      <p className="text-slate-400 text-xs">{dossie.cliente_email}</p>
                    </div>
                  </div>
                </div>

                <div className="glass-effect p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-slate-300 text-sm">Gerado em</p>
                      <p className="text-slate-100 font-semibold">
                        {dossie.dossie_data_geracao
                          ? formatDate(dossie.dossie_data_geracao)
                          : formatDate(dossie.data_conclusao)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass-effect p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-purple-400" />
                    <div>
                      <p className="text-slate-300 text-sm">Status</p>
                      <p className="text-slate-100 font-semibold capitalize">{dossie.dossie_status}</p>
                      {dossie.aprovado_por_nome && (
                        <p className="text-slate-400 text-xs">por {dossie.aprovado_por_nome}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo do Dossiê */}
          <Card className="glass-dark border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-100 flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-400" />
                Conteúdo do Dossiê
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dossie.dossie_conteudo ? (
                <div className="glass-effect p-6 rounded-xl border-2 border-white/20">
                  <div
                    className="prose prose-invert max-w-none text-slate-100"
                    dangerouslySetInnerHTML={{ __html: dossie.dossie_conteudo }}
                  />
                </div>
              ) : (
                <div className="glass-effect p-6 rounded-xl border-2 border-yellow-500/20 bg-yellow-500/5">
                  <div className="flex items-center gap-3 text-yellow-300">
                    <Clock className="w-6 h-6" />
                    <div>
                      <p className="font-semibold">Dossiê em processamento</p>
                      <p className="text-sm text-yellow-200">
                        O dossiê está sendo gerado pela automação. Aguarde alguns minutos.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Análise Original */}
          {dossie.analise_html && dossie.analise_html !== dossie.dossie_conteudo && (
            <Card className="glass-dark border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-slate-100">Análise Original</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="glass-effect p-4 rounded-xl border border-white/10">
                  <div className="text-slate-100 text-sm" dangerouslySetInnerHTML={{ __html: dossie.analise_html }} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observações */}
          {dossie.dossie_observacoes && (
            <Card className="glass-dark border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl text-slate-100">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="glass-effect p-4 rounded-xl border border-white/10">
                  <p className="text-slate-100">{dossie.dossie_observacoes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações do Dossiê */}
          {dossie.dossie_conteudo && (
            <DossieActions
              resultadoId={dossie.resultado_id}
              status={dossie.dossie_status}
              observacoes={dossie.dossie_observacoes || ""}
            />
          )}
        </main>
      </div>
    </div>
  )
}
