import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, Building2, Plus, Clock, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react'
import sql from "@/lib/db"
import Link from "next/link"
import { ColaboradorDashboard } from "@/lib/types"

async function getCorporateData(userId: string) {
  // Buscar dados da empresa
  const [empresa] = await sql`
    SELECT * FROM empresas_corporativas 
    WHERE usuario_id = ${userId}
  `

  if (!empresa) {
    throw new Error("Empresa não encontrada")
  }

  // Buscar colaboradores
  const colaboradores = await sql`
    SELECT 
      cc.*,
      u.nome as usuario_nome,
      u.email as usuario_email,
      COUNT(rt.id) as total_testes,
      COUNT(CASE WHEN rt.resultado IS NOT NULL THEN 1 END) as testes_concluidos,
      COUNT(af.id) as analises_faciais,
      COUNT(CASE WHEN af.temperamento_predominante IS NOT NULL THEN 1 END) as analises_concluidas
    FROM colaboradores_corporativos cc
    LEFT JOIN usuarios u ON cc.usuario_id = u.id
    LEFT JOIN resultados_testes rt ON cc.id = rt.colaborador_id
    LEFT JOIN analises_faciais af ON cc.id = af.cliente_id
    WHERE cc.empresa_id = ${empresa.id}
    GROUP BY cc.id, u.nome, u.email
    ORDER BY cc.criado_em DESC
  `

  // Estatísticas dos testes
  const estatisticasTestes = await sql`
    SELECT 
      COUNT(*) as total_testes,
      COUNT(CASE WHEN rt.resultado IS NOT NULL THEN 1 END) as testes_concluidos
    FROM resultados_testes rt
    INNER JOIN colaboradores_corporativos cc ON rt.colaborador_id = cc.id
    WHERE cc.empresa_id = ${empresa.id}
  `

  // Estatísticas das análises faciais
  const estatisticasAnalises = await sql`
    SELECT 
      COUNT(*) as total_analises,
      COUNT(CASE WHEN af.temperamento_predominante IS NOT NULL THEN 1 END) as analises_concluidas
    FROM analises_faciais af
    INNER JOIN colaboradores_corporativos cc ON af.cliente_id = cc.id
    WHERE cc.empresa_id = ${empresa.id}
  `

  return {
    empresa,
    colaboradores: colaboradores.map((c) => ({
      ...(c as ColaboradorDashboard),
      total_testes: Number.parseInt(c.total_testes || "0"),
      testes_concluidos: Number.parseInt(c.testes_concluidos || "0"),
      analises_faciais: Number.parseInt(c.analises_faciais || "0"),
      analises_concluidas: Number.parseInt(c.analises_concluidas || "0"),
    })),
    estatisticas: {
      total_testes: Number.parseInt(estatisticasTestes[0]?.total_testes || "0"),
      testes_concluidos: Number.parseInt(estatisticasTestes[0]?.testes_concluidos || "0"),
      total_analises: Number.parseInt(estatisticasAnalises[0]?.total_analises || "0"),
      analises_concluidas: Number.parseInt(estatisticasAnalises[0]?.analises_concluidas || "0"),
    },
  }
}

export default async function CorporativoDashboard() {
  const session = await getSession()
  if (!session || session.tipo_usuario !== "corporativo") {
    redirect("/login")
  }

  const data = await getCorporateData(session.sub)

  const percentualUso = Math.round((data.empresa.colaboradores_cadastrados / data.empresa.limite_colaboradores) * 100)
  
  // Separar colaboradores por status de conclusão
  const colaboradoresPendentes = data.colaboradores.filter(c => 
    c.status === "ativo" && (c.total_testes === 0 || c.testes_concluidos === 0 || c.analises_faciais === 0 || c.analises_concluidas === 0)
  )
  
  const colaboradoresConcluidos = data.colaboradores.filter(c => 
    c.status === "ativo" && c.total_testes > 0 && c.testes_concluidos > 0 && c.analises_faciais > 0 && c.analises_concluidas > 0
  )

  const totalTestesRealizados = data.estatisticas.total_testes + data.estatisticas.total_analises

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Corporativo</h1>
            <p className="text-muted-foreground text-bold text-white/80 text-xl">{data.empresa.nome_empresa}</p>
          </div>
          <Link href="/corporativo/colaboradores/convidar">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Convidar Colaborador
            </Button>
          </Link>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Colaboradores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.empresa.colaboradores_cadastrados}</div>
              <p className="text-xs text-muted-foreground">
                de {data.empresa.limite_colaboradores} disponíveis ({percentualUso}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Testes Realizados</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTestesRealizados}</div>
              <p className="text-xs text-muted-foreground">
                {data.estatisticas.testes_concluidos + data.estatisticas.analises_concluidas} concluídos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalTestesRealizados > 0 
                  ? Math.round(((data.estatisticas.testes_concluidos + data.estatisticas.analises_concluidas) / totalTestesRealizados) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                <b>{colaboradoresConcluidos.length}</b> colaboradores completos de <b>{data.empresa.limite_colaboradores}</b>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Informações da Empresa */}
        <div className="grid gap-6 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Nome:</span>
                  <span className="text-sm">{data.empresa.nome_empresa}</span>
                </div>
                {data.empresa.cnpj && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">CNPJ:</span>
                    <span className="text-sm">{data.empresa.cnpj}</span>
                  </div>
                )}
                {data.empresa.telefone && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Telefone:</span>
                    <span className="text-sm">{data.empresa.telefone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant={data.empresa.status === "ativo" ? "default" : "secondary"}>
                    {data.empresa.status}
                  </Badge>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uso de Colaboradores</span>
                  <span>{percentualUso}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(percentualUso, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colaboradores Pendentes e Concluídos */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Colaboradores Pendentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Colaboradores Pendentes
              </CardTitle>
              <CardDescription>
                Colaboradores que ainda não concluíram todos os testes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {colaboradoresPendentes.length > 0 ? (
                <div className="space-y-4">
                  {colaboradoresPendentes.slice(0, 5).map((colaborador) => (
                    <div key={colaborador.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{colaborador.nome}</p>
                        <p className="text-sm text-muted-foreground">{colaborador.email}</p>
                        {colaborador.cargo && <p className="text-xs text-muted-foreground">{colaborador.cargo}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex gap-1">
                          {colaborador.total_testes > 0 ? (
                            <Badge variant={colaborador.testes_concluidos > 0 ? "default" : "secondary"} className="text-xs">
                              Temperamento: {colaborador.testes_concluidos > 0 ? "✓" : "⏳"}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Temperamento: ⏳
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {colaborador.analises_faciais > 0 ? (
                            <Badge variant={colaborador.analises_concluidas > 0 ? "default" : "secondary"} className="text-xs">
                              Análise Facial: {colaborador.analises_concluidas > 0 ? "✓" : "⏳"}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Análise Facial: ⏳
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {colaboradoresPendentes.length > 5 && (
                    <div className="text-center pt-4">
                      <Link href="/corporativo/colaboradores">
                        <Button variant="outline">
                          Ver Todos ({colaboradoresPendentes.length - 5} restantes)
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Todos em dia!</h3>
                  <p className="text-muted-foreground">
                    Todos os colaboradores concluíram seus testes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Colaboradores Concluídos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Colaboradores Concluídos
              </CardTitle>
              <CardDescription>
                Colaboradores que finalizaram todos os testes disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {colaboradoresConcluidos.length > 0 ? (
                <div className="space-y-4">
                  {colaboradoresConcluidos.slice(0, 5).map((colaborador) => (
                    <div key={colaborador.id} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                      <div className="space-y-1">
                        <p className="font-medium">{colaborador.nome}</p>
                        <p className="text-sm text-muted-foreground">{colaborador.email}</p>
                        {colaborador.cargo && <p className="text-xs text-muted-foreground">{colaborador.cargo}</p>}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="default" className="text-xs bg-green-600">
                          Temperamento: ✓
                        </Badge>
                        <Badge variant="default" className="text-xs bg-green-600">
                          Análise Facial: ✓
                        </Badge>
                        <Link href={`/corporativo/colaboradores/${colaborador.id}/relatorios`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            Ver Relatórios
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}

                  {colaboradoresConcluidos.length > 5 && (
                    <div className="text-center pt-4">
                      <Link href="/corporativo/colaboradores">
                        <Button variant="outline">
                          Ver Todos ({colaboradoresConcluidos.length - 5} restantes)
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum teste concluído</h3>
                  <p className="text-muted-foreground">
                    Aguardando colaboradores finalizarem os testes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resumo de Atividades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Resumo de Atividades
            </CardTitle>
            <CardDescription>
              Visão geral do progresso da sua equipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{data.colaboradores.filter(c => c.status === "ativo").length}</div>
                <p className="text-sm text-muted-foreground">Colaboradores Ativos</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{colaboradoresPendentes.length}</div>
                <p className="text-sm text-muted-foreground">Testes Pendentes</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{colaboradoresConcluidos.length}</div>
                <p className="text-sm text-muted-foreground">Testes Concluídos</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{data.colaboradores.filter(c => c.status === "pendente").length}</div>
                <p className="text-sm text-muted-foreground">Convites Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
