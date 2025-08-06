import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera, User, Calendar, CheckCircle, Eye, Edit } from "lucide-react"
import Link from "next/link"
import StructuredAnalysisForm from "./structured-analysis-form"
import StructuredAnalysisResult from "./structured-analysis-result"
import type { AnaliseFacial } from "@/lib/types"

interface PedidoDetalhado {
  id: string
  cliente_id: string
  cliente_nome: string
  cliente_email: string
  data_pedido: string
  data_envio_imagens: string | null
  url_perfil_normal: string | null
  url_perfil_sorrindo: string | null
  url_perfil_lado: string | null
  url_boca_sorrindo: string | null
  resultado_id: string | null
  resultado_status: string | null
  resultado_json: any | null
  resultado_html: string | null
  data_conclusao: string | null
}

interface PageProps {
  params: Promise<{
    pedidoId: string
  }>
  searchParams: Promise<{
    edit?: string
  }>
}

async function getPedidoDetalhado(pedidoId: string) {
  try {
    const [pedido] = await sql<PedidoDetalhado[]>`
      SELECT 
        p.id,
        p.cliente_id,
        u.nome as cliente_nome,
        u.email as cliente_email,
        p.data_pedido,
        p.data_envio_imagens,
        p.url_perfil_normal,
        p.url_perfil_sorrindo,
        p.url_perfil_lado,
        p.url_boca_sorrindo,
        rt.id as resultado_id,
        rt.resultado as resultado_json,
        rt.html as resultado_html,
        rt.data_conclusao
      FROM pedidos p
      JOIN usuarios u ON p.cliente_id = u.id
      JOIN servicos s ON p.servico_id = s.id
      LEFT JOIN resultados_testes rt ON rt.pedido_id = p.id
      WHERE p.id = ${pedidoId}
        AND s.nome = 'Análise Facial'
    `

    return pedido
  } catch (error) {
    console.error("Erro ao buscar pedido:", error)
    return null
  }
}

async function getAnaliseEstruturada(pedidoId: string): Promise<AnaliseFacial | null> {
  try {
    const [analise] = await sql<AnaliseFacial[]>`
      SELECT * FROM analises_faciais 
      WHERE pedido_id = ${pedidoId}
    `
    return analise || null
  } catch (error) {
    console.error("Erro ao buscar análise estruturada:", error)
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

export default async function AdminAnalysisPage({ params, searchParams }: PageProps) {
  // Verificar sessão
  const session = await getSession()
  if (!session || session.tipo_usuario !== "admin") {
    redirect("/login")
  }

  // Aguardar params antes de usar
  const { pedidoId } = await params
  const { edit } = await searchParams
  const isEditing = edit === "true"

  const pedido = await getPedidoDetalhado(pedidoId)
  const analiseEstruturada = await getAnaliseEstruturada(pedidoId)

  if (!pedido) {
    notFound()
  }

  // Verificar se já tem resultado concluído (nova estrutura ou legado)
  const hasResult = analiseEstruturada || (pedido.resultado_id && (pedido.resultado_json || pedido.resultado_html))

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
            <Link href="/admin/analise-facial">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <h1 className="text-lg font-semibold md:text-2xl text-slate-100">Análise Facial - {pedido.cliente_nome}</h1>
          {hasResult && !isEditing && (
            <div className="ml-auto flex items-center gap-4">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="glass-effect border-white/30 text-slate-100 hover:bg-white/20 bg-transparent"
              >
                <Link href={`/admin/analise-facial/${pedidoId}?edit=true`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-medium">Concluído</span>
              </div>
            </div>
          )}
          {isEditing && (
            <div className="ml-auto">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="glass-effect border-white/30 text-slate-100 hover:bg-white/20 bg-transparent"
              >
                <Link href={`/admin/analise-facial/${pedidoId}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Resultado
                </Link>
              </Button>
            </div>
          )}
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {/* Se está editando ou não tem resultado, mostrar o formulário */}
          {isEditing || !hasResult ? (
            <>
              {/* Informações do Cliente */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-dark border-white/20 shadow-xl">
                  <CardContent className="flex items-center space-x-3 p-4">
                    <User className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-slate-300">Cliente</p>
                      <p className="font-semibold text-slate-100">{pedido.cliente_nome}</p>
                      <p className="text-xs text-slate-400">{pedido.cliente_email}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-dark border-white/20 shadow-xl">
                  <CardContent className="flex items-center space-x-3 p-4">
                    <Calendar className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm text-slate-300">Data do Pedido</p>
                      <p className="font-semibold text-slate-100">{formatDate(pedido.data_pedido)}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-dark border-white/20 shadow-xl">
                  <CardContent className="flex items-center space-x-3 p-4">
                    <Camera className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-slate-300">Imagens Enviadas</p>
                      <p className="font-semibold text-slate-100">
                        {pedido.data_envio_imagens ? formatDate(pedido.data_envio_imagens) : "Não informado"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Imagens do Cliente */}
              <Card className="glass-dark border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-slate-100">Imagens para Análise</CardTitle>
                  <CardDescription className="text-slate-300">
                    Clique nas imagens para visualizar em tamanho completo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <img
                        src={pedido.url_perfil_normal || "/placeholder.svg?height=200&width=200&text=Perfil+Normal"}
                        alt="Perfil Normal"
                        className="w-full h-48 object-cover rounded-lg border border-white/20 cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      <p className="text-sm font-medium mt-2 text-slate-100">Perfil Normal</p>
                      <p className="text-xs text-slate-400">Expressão neutra</p>
                    </div>
                    <div className="text-center">
                      <img
                        src={pedido.url_perfil_sorrindo || "/placeholder.svg?height=200&width=200&text=Perfil+Sorrindo"}
                        alt="Perfil Sorrindo"
                        className="w-full h-48 object-cover rounded-lg border border-white/20 cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      <p className="text-sm font-medium mt-2 text-slate-100">Perfil Sorrindo</p>
                      <p className="text-xs text-slate-400">Sorriso natural</p>
                    </div>
                    <div className="text-center">
                      <img
                        src={pedido.url_perfil_lado || "/placeholder.svg?height=200&width=200&text=Perfil+de+Lado"}
                        alt="Perfil de Lado"
                        className="w-full h-48 object-cover rounded-lg border border-white/20 cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      <p className="text-sm font-medium mt-2 text-slate-100">Perfil de Lado</p>
                      <p className="text-xs text-slate-400">Vista lateral (90°)</p>
                    </div>
                    <div className="text-center">
                      <img
                        src={pedido.url_boca_sorrindo || "/placeholder.svg?height=200&width=200&text=Boca+Sorrindo"}
                        alt="Boca Sorrindo"
                        className="w-full h-48 object-cover rounded-lg border border-white/20 cursor-pointer hover:opacity-80 transition-opacity"
                      />
                      <p className="text-sm font-medium mt-2 text-slate-100">Boca Sorrindo</p>
                      <p className="text-xs text-slate-400">Foco na boca</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formulário de Análise Estruturada */}
              <StructuredAnalysisForm
                pedidoId={pedido.id}
                clienteId={pedido.cliente_id}
                clienteNome={pedido.cliente_nome}
                analiseExistente={analiseEstruturada}
              />
            </>
          ) : (
            // Se tem resultado e não está editando, mostrar o resultado
            <div className="space-y-8">
              {/* Header de Resultado Concluído */}
              <div className="relative overflow-hidden rounded-3xl glass-dark p-8 text-slate-100 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-blue-600/20 to-purple-600/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 glass-effect rounded-2xl flex items-center justify-center animate-float">
                          <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>
                        <div>
                          <h1 className="text-4xl font-bold mb-1 drop-shadow-lg">Análise Concluída</h1>
                          <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            <span className="text-lg">Resultado Disponível</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-semibold">{pedido.cliente_nome}</p>
                        <p className="text-slate-200">
                          Concluído em:{" "}
                          {analiseEstruturada?.atualizado_em
                            ? formatDate(analiseEstruturada.atualizado_em)
                            : pedido.data_conclusao
                              ? formatDate(pedido.data_conclusao)
                              : "Data não disponível"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Renderizar o resultado */}
              {analiseEstruturada ? (
                <StructuredAnalysisResult
                  analise={analiseEstruturada}
                  clienteNome={pedido.cliente_nome}
                  imagens={{
                    perfil_normal: pedido.url_perfil_normal || "",
                    perfil_sorrindo: pedido.url_perfil_sorrindo || "",
                    perfil_lado: pedido.url_perfil_lado || "",
                    boca_sorrindo: pedido.url_boca_sorrindo || "",
                  }}
                />
              ) : pedido.resultado_html ? (
                // Fallback para formato HTML legado
                <Card className="glass-dark border-white/20 border-2 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-slate-100">Resultado da Análise (Formato Legado)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="glass-effect p-6 rounded-xl border-2 border-white/20"
                      dangerouslySetInnerHTML={{ __html: pedido.resultado_html }}
                    />
                  </CardContent>
                </Card>
              ) : (
                // Fallback para formato JSON legado
                <Card className="glass-dark border-white/20 border-2 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-slate-100">
                      Resultado da Análise (Formato JSON Legado)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="glass-effect p-6 rounded-xl border-2 border-white/20">
                      <pre className="text-slate-100 whitespace-pre-wrap text-sm overflow-auto">
                        {JSON.stringify(pedido.resultado_json, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
