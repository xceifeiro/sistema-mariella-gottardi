import { getSession } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Calendar, TrendingUp, FileText } from "lucide-react"
import sql from "@/lib/db"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

async function getColaboradorRelatorios(colaboradorId: string, empresaId: string) {
  // Buscar dados do colaborador
  const [colaborador] = await sql`
    SELECT 
      cc.*,
      u.nome as usuario_nome,
      u.email as usuario_email,
      ec.nome_empresa
    FROM colaboradores_corporativos cc
    LEFT JOIN usuarios u ON cc.usuario_id = u.id
    INNER JOIN empresas_corporativas ec ON cc.empresa_id = ec.id
    WHERE cc.id = ${colaboradorId} AND cc.empresa_id = ${empresaId}
  `

  if (!colaborador) {
    return null
  }

  // Buscar todos os testes do colaborador
  const testes = await sql`
    SELECT 
      rt.*,
      rt.resultado->>'temperamento_predominante' as temperamento_predominante,
      rt.resultado->'pontuacoes'->>'sanguineo' as pontuacao_sanguineo,
      rt.resultado->'pontuacoes'->>'colerico' as pontuacao_colerico,
      rt.resultado->'pontuacoes'->>'melancolico' as pontuacao_melancolico,
      rt.resultado->'pontuacoes'->>'fleumatico' as pontuacao_fleumatico
    FROM resultados_testes rt
    WHERE rt.colaborador_id = ${colaboradorId}
    ORDER BY rt.criado_em DESC
  `

  // Buscar análises faciais se existirem
  const analisesFaciais = await sql`
    SELECT 
      af.*,
      pa.status as pedido_status,
      pa.criado_em as pedido_criado_em
    FROM analises_faciais af
    INNER JOIN pedidos_analise pa ON af.pedido_id = pa.id
    INNER JOIN colaboradores_corporativos cc ON pa.cliente_id = cc.usuario_id
    WHERE cc.id = ${colaboradorId}
    ORDER BY af.criado_em DESC
  `

  return {
    colaborador,
    testes: testes.map((t) => ({
      ...t,
      pontuacao_sanguineo: Number.parseInt(t.pontuacao_sanguineo || "0"),
      pontuacao_colerico: Number.parseInt(t.pontuacao_colerico || "0"),
      pontuacao_melancolico: Number.parseInt(t.pontuacao_melancolico || "0"),
      pontuacao_fleumatico: Number.parseInt(t.pontuacao_fleumatico || "0"),
    })),
    analisesFaciais,
  }
}

async function getEmpresaData(userId: string) {
  const [empresa] = await sql`
    SELECT * FROM empresas_corporativas 
    WHERE usuario_id = ${userId}
  `
  return empresa
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RelatoriosColaboradorPage({ params }: PageProps) {
  const session = await getSession()
  if (!session || session.tipo_usuario !== "corporativo") {
    redirect("/login")
  }

  const { id } = await params
  const empresa = await getEmpresaData(session.sub)

  if (!empresa) {
    redirect("/corporativo")
  }

  const data = await getColaboradorRelatorios(id, empresa.id)

  if (!data) {
    notFound()
  }

  const { colaborador, testes, analisesFaciais } = data

  // Estatísticas dos testes
  const estatisticas = {
    totalTestes: testes.length,
    ultimoTeste: testes.length > 0 ? new Date(testes[0].criado_em) : null,
    temperamentoPredominante: testes.length > 0 ? testes[0].temperamento_predominante : null,
    analisesFaciais: analisesFaciais.length,
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/corporativo/colaboradores">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relatórios do Colaborador</h1>
            <p className="text-muted-foreground">
              {colaborador.nome} - {empresa.nome_empresa}
            </p>
          </div>
        </div>

        {/* Informações do Colaborador */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Testes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.totalTestes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Teste</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estatisticas.ultimoTeste ? estatisticas.ultimoTeste.toLocaleDateString("pt-BR") : "N/A"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperamento</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{estatisticas.temperamentoPredominante || "N/A"}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Análises Faciais</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.analisesFaciais}</div>
            </CardContent>
          </Card>
        </div>

        {/* Dados do Colaborador */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Colaborador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Nome</p>
                <p className="text-sm">{colaborador.nome}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{colaborador.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Cargo</p>
                <p className="text-sm">{colaborador.cargo || "Não informado"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Departamento</p>
                <p className="text-sm">{colaborador.departamento || "Não informado"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Testes */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Testes de Temperamento</CardTitle>
            <CardDescription>Todos os testes realizados pelo colaborador</CardDescription>
          </CardHeader>
          <CardContent>
            {testes.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Temperamento</TableHead>
                      <TableHead>Sanguíneo</TableHead>
                      <TableHead>Colérico</TableHead>
                      <TableHead>Melancólico</TableHead>
                      <TableHead>Fleumático</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testes.map((teste) => (
                      <TableRow key={teste.id}>
                        <TableCell>{new Date(teste.criado_em).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {teste.temperamento_predominante}
                          </Badge>
                        </TableCell>
                        <TableCell>{teste.pontuacao_sanguineo}%</TableCell>
                        <TableCell>{teste.pontuacao_colerico}%</TableCell>
                        <TableCell>{teste.pontuacao_melancolico}%</TableCell>
                        <TableCell>{teste.pontuacao_fleumatico}%</TableCell>
                        <TableCell>
                          <Link href={`/corporativo/relatorios/teste/${teste.id}`}>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-2" />
                              Ver Relatório
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum teste realizado</h3>
                <p className="text-muted-foreground">
                  Este colaborador ainda não realizou nenhum teste de temperamento
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Análises Faciais */}
        {analisesFaciais.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Análises Faciais</CardTitle>
              <CardDescription>Análises faciais realizadas pelo colaborador</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data do Pedido</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Temperamento</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analisesFaciais.map((analise) => (
                      <TableRow key={analise.id}>
                        <TableCell>{new Date(analise.pedido_criado_em).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              analise.pedido_status === "concluido"
                                ? "default"
                                : analise.pedido_status === "em_andamento"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {analise.pedido_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {analise.temperamento_predominante ? (
                            <Badge variant="outline" className="capitalize">
                              {analise.temperamento_predominante}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">Não definido</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Link href={`/corporativo/relatorios/analise/${analise.id}`}>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-2" />
                              Ver Análise
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
