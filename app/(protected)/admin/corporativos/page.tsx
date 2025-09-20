import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Plus, Eye, Settings } from "lucide-react"
import sql from "@/lib/db"
import Link from "next/link"
import { EmpresaCorporativaDetalhada } from "@/lib/types"

async function getCorporateClients(): Promise<EmpresaCorporativaDetalhada[]> {
  const empresas = await sql`
  SELECT 
    ec.*,
    u.nome as usuario_nome,
    u.email as usuario_email,
    u.criado_em as usuario_criado_em
  FROM empresas_corporativas ec
  INNER JOIN usuarios u ON ec.usuario_id = u.id
  ORDER BY ec.criado_em DESC
`


  return empresas.map((empresa) => ({
  id: empresa.id,
  usuario_id: empresa.usuario_id,
  nome_empresa: empresa.nome_empresa,
  cnpj: empresa.cnpj,
  endereco: empresa.endereco,
  telefone: empresa.telefone,
  limite_colaboradores: empresa.limite_colaboradores,
  colaboradores_cadastrados: empresa.colaboradores_cadastrados,
  status: empresa.status,
  usuario_nome: empresa.usuario_nome,
  usuario_email: empresa.usuario_email,
  criado_em: empresa.criado_em,
  atualizado_em: empresa.atualizado_em,
  // NÃO inclua primeiro_acesso aqui
}))
}


export default async function CorporateClientsPage() {
  const session = await getSession()
  if (!session || session.tipo_usuario !== "admin") {
    redirect("/login")
  }

  const empresas = await getCorporateClients()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Clientes Corporativos</h1>
            <p className="text-muted-foreground text-white/70">Gerencie empresas e seus colaboradores</p>
          </div>
          <Link href="/admin/corporativos/novo">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente Corporativo
            </Button>
          </Link>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{empresas.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {empresas.filter((e) => e.status === "ativo").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Colaboradores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {empresas.reduce((acc, e) => acc + e.colaboradores_cadastrados, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Limite Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {empresas.reduce((acc, e) => acc + e.limite_colaboradores, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Empresas */}
        <Card>
          <CardHeader>
            <CardTitle>Empresas Cadastradas</CardTitle>
            <CardDescription>
              Lista de todas as empresas corporativas cadastradas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {empresas.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma empresa cadastrada</h3>
                <p className="text-muted-foreground mb-4">
                  Comece cadastrando sua primeira empresa corporativa
                </p>
                <Link href="/admin/corporativos/novo">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeira Empresa
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {empresas.map((empresa) => (
                  <div key={empresa.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{empresa.nome_empresa}</h3>
                          <Badge
                            variant={
                              empresa.status === "ativo"
                                ? "default"
                                : empresa.status === "inativo"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {empresa.status}
                          </Badge>
                          {empresa.primeiro_acesso && (
                            <Badge variant="outline">Primeiro Acesso Pendente</Badge>
                          )}
                        </div>

                        <div className="grid gap-2 md:grid-cols-2 text-sm text-muted-foreground">
                          <p>
                            <strong>Responsável:</strong> {empresa.usuario_nome}
                          </p>
                          <p>
                            <strong>Email:</strong> {empresa.usuario_email}
                          </p>
                          {empresa.cnpj && (
                            <p>
                              <strong>CNPJ:</strong> {empresa.cnpj}
                            </p>
                          )}
                          {empresa.telefone && (
                            <p>
                              <strong>Telefone:</strong> {empresa.telefone}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {empresa.colaboradores_cadastrados} / {empresa.limite_colaboradores} colaboradores
                          </span>
                          <span>
                            Cadastrado em{" "}
                            {new Date(empresa.criado_em).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>

                      {/*
                      ================================= // COMENTADO PARA ATUALIZAR DEPOIS E ADICIONAR AS PAGINAS ====================================
                      <div className="flex gap-2">
                        <Link href={`/admin/corporativos/${empresa.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Configurar
                        </Button>
                      </div>*/}
                    </div>

                    {/* Barra de progresso dos colaboradores */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Colaboradores cadastrados</span>
                        <span>
                          {Math.round(
                            (empresa.colaboradores_cadastrados / empresa.limite_colaboradores) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (empresa.colaboradores_cadastrados / empresa.limite_colaboradores) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
