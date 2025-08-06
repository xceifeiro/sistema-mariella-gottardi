import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Brain,
  Camera,
  FileText,
  User,
  Calendar,
  CheckCircle,
  Sparkles,
  Award,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import TemperamentResultComponent from "@/components/temperament-result"
import FacialAnalysisResultComponent from "@/components/facial-analysis-result"

interface ResultadoDetalhado {
  id: string
  pedido_id: string
  tipo_teste: string
  status: string
  resultado: any
  html: string | null
  criado_em: string
  data_atualizacao: string
  data_conclusao: string | null
  observacoes: string | null
  cliente_nome: string
}

async function getResultado(resultadoId: string, clienteId: string) {
  try {
    const [resultado] = await sql<ResultadoDetalhado[]>`
      SELECT 
        rt.id,
        rt.pedido_id,
        rt.tipo_teste,
        rt.status,
        rt.resultado,
        rt.html,
        rt.criado_em,
        rt.data_atualizacao,
        p.data_conclusao,
        p.observacoes,
        u.nome as cliente_nome
      FROM resultados_testes rt
      JOIN pedidos p ON rt.pedido_id = p.id
      JOIN usuarios u ON p.cliente_id = u.id
      WHERE rt.id = ${resultadoId} AND p.cliente_id = ${clienteId}
    `

    return resultado
  } catch (error) {
    console.error("Erro ao buscar resultado:", error)
    return null
  }
}

function getServiceIcon(servico: string) {
  switch (servico.toLowerCase()) {
    case "teste-temperamentos":
      return <Brain className="w-6 h-6" />
    case "analise-facial":
      return <Camera className="w-6 h-6" />
    case "teste-disc":
      return <FileText className="w-6 h-6" />
    default:
      return <FileText className="w-6 h-6" />
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

function renderResultadoContent(
  tipo: string,
  resultado: any,
  html: string | null,
  clienteNome: string,
  dataRealizacao: string,
  observacoes?: string | null,
) {
  switch (tipo.toLowerCase()) {
    case "teste-temperamentos":
      return (
        <TemperamentResultComponent
          scores={resultado.scores || resultado}
          clienteNome={clienteNome}
          dataRealizacao={dataRealizacao}
        />
      )

    case "analise-facial":
      // Se temos HTML, usar o novo componente
      if (html) {
        return (
          <FacialAnalysisResultComponent
            htmlContent={html}
            imagens={resultado?.imagens_analisadas || null}
            clienteNome={clienteNome}
            dataRealizacao={dataRealizacao}
            observacoes={observacoes || undefined}
          />
        )
      }

      // Fallback para o formato antigo
      return (
        <div className="space-y-6">
          <Card className="glass-dark border-white/20 shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 text-slate-100" />
                </div>
                <div>
                  <CardTitle className="text-slate-100">Análise Facial Completa</CardTitle>
                  <CardDescription className="text-slate-300">
                    Resultado da análise das suas expressões faciais
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {resultado?.analise ? (
                <div className="prose max-w-none">
                  <div
                    className="glass-effect p-6 rounded-xl border border-white/20 text-slate-100"
                    dangerouslySetInnerHTML={{ __html: resultado.analise }}
                  />
                </div>
              ) : (
                <div className="glass-effect p-6 rounded-xl border border-yellow-400/20 bg-yellow-500/10">
                  <p className="text-yellow-200">Análise detalhada será disponibilizada em breve.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {resultado?.imagens_analisadas && (
            <Card className="glass-dark border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Imagens Analisadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(resultado.imagens_analisadas).map(([tipo, url]) => (
                    <div key={tipo} className="text-center glass-effect p-4 rounded-xl border border-white/20">
                      <img
                        src={(url as string) || "/placeholder.svg?height=128&width=128"}
                        alt={tipo}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <p className="text-sm text-slate-300 capitalize">{tipo.replace("_", " ")}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )

    default:
      return (
        <Card className="glass-dark border-white/20 shadow-2xl">
          <CardContent className="py-8">
            <div className="glass-effect p-6 rounded-xl border border-white/20">
              <pre className="text-slate-200 text-sm overflow-auto">{JSON.stringify(resultado, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      )
  }
}

export default async function ResultadoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()

  if (!session || session.tipo_usuario !== "cliente") {
    redirect("/login")
  }

  const { id } = await params
  const resultadoId = id
  if (!resultadoId) {
    notFound()
  }

  const resultado = await getResultado(resultadoId, session.sub)

  if (!resultado) {
    notFound()
  }

  // Se é análise facial e tem HTML, renderizar diretamente o componente
  if (resultado.tipo_teste.toLowerCase() === "analise-facial" && resultado.html) {
    return (
      <div className="min-h-screen floating-shapes">
        <div className="container mx-auto px-4 py-8">
          {/* Botão de voltar */}
          <div className="mb-8">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="glass-effect border-white/30 text-slate-300 hover:bg-white/10 bg-transparent"
            >
              <Link href="/dashboard/resultados">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar aos Resultados
              </Link>
            </Button>
          </div>

          <FacialAnalysisResultComponent
            htmlContent={resultado.html}
            imagens={resultado.resultado?.imagens_analisadas || null}
            clienteNome={resultado.cliente_nome}
            dataRealizacao={formatDate(resultado.criado_em)}
            observacoes={resultado.observacoes || undefined}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen floating-shapes">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="glass-dark p-6 rounded-3xl border-2 border-white/20 shadow-2xl mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="glass-effect border-white/30 text-slate-300 hover:bg-white/10 bg-transparent"
              >
                <Link href="/dashboard/resultados">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar aos Resultados
                </Link>
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 glass-effect rounded-2xl flex items-center justify-center text-slate-100 animate-float">
                {getServiceIcon(resultado.tipo_teste)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-100 mb-1">{resultado.tipo_teste}</h1>
                <p className="text-slate-300">Resultado do Pedido #{resultado.pedido_id.slice(0, 8)}</p>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-dark border-white/20 shadow-xl">
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Cliente</p>
                  <p className="font-semibold text-slate-100">{resultado.cliente_nome}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-dark border-white/20 shadow-xl">
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Data do Teste</p>
                  <p className="font-semibold text-slate-100">{formatDate(resultado.criado_em)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-dark border-white/20 shadow-xl">
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Status</p>
                  <Badge className="glass-effect border-emerald-400/30 text-emerald-300 bg-emerald-500/20">
                    Concluído
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resultado Content */}
        <div className="mb-8">
          {renderResultadoContent(
            resultado.tipo_teste,
            resultado.resultado,
            resultado.html,
            resultado.cliente_nome,
            formatDate(resultado.criado_em),
            resultado.observacoes,
          )}
        </div>

        {/* Observações */}
        {resultado.observacoes && resultado.tipo_teste.toLowerCase() !== "analise-facial" && (
          <Card className="mb-8 glass-dark border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                Observações do Especialista
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="glass-effect p-6 rounded-xl border border-purple-400/20 bg-purple-500/10">
                <p className="text-purple-200 leading-relaxed">{resultado.observacoes}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center">
          <div className="glass-effect p-4 rounded-xl border border-white/20 inline-block">
            <p className="text-slate-400 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Resultado gerado em {formatDate(resultado.data_atualizacao || resultado.criado_em)} • CRM 4 Temperamentos
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
