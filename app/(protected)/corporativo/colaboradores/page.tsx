import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TabelaColaboradores from "@/components/TabelaColaboradores"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Users as UsuariosIcon,
  Search,
  Plus,
  User,
  Building,
  Clock,
} from "lucide-react"
import sql from "@/lib/db"
import Link from "next/link"
import type { EmpresaCorporativa, ColaboradorDetalhado } from "@/lib/types"

async function getColaboradores(empresaId: string, search?: string): Promise<ColaboradorDetalhado[]> {
  const baseQuery = sql`
    SELECT 
      cc.*,
      ec.nome_empresa,
      u.nome as usuario_nome,
      u.email as usuario_email,
      u.criado_em as usuario_criado_em,
      cc.token_convite as token_convite,
      COUNT(rt.id) as total_testes,
      MAX(rt.criado_em) as ultimo_teste,
      rt2.resultado->>'temperamento_predominante' as temperamento_predominante
    FROM colaboradores_corporativos cc
    LEFT JOIN empresas_corporativas ec ON cc.empresa_id = ec.id
    LEFT JOIN usuarios u ON cc.usuario_id = u.id
    LEFT JOIN resultados_testes rt ON cc.id = rt.colaborador_id
    LEFT JOIN resultados_testes rt2 ON cc.id = rt2.colaborador_id 
      AND rt2.criado_em = (
        SELECT MAX(rt3.criado_em) 
        FROM resultados_testes rt3 
        WHERE rt3.colaborador_id = cc.id
      )
    WHERE cc.empresa_id = ${empresaId}
    ${search ? sql`
      AND (
        LOWER(cc.nome) LIKE LOWER(${`%${search}%`}) OR
        LOWER(cc.email) LIKE LOWER(${`%${search}%`}) OR
        LOWER(cc.cargo) LIKE LOWER(${`%${search}%`}) OR
        LOWER(cc.departamento) LIKE LOWER(${`%${search}%`})
      )
    ` : sql``}
    GROUP BY cc.id, ec.nome_empresa, u.nome, u.email, u.criado_em, rt2.resultado
    ORDER BY cc.criado_em DESC
  `

  const colaboradores = await baseQuery

  return (colaboradores as any[]).map((c) => ({
    ...c,
    total_testes: Number.parseInt(c.total_testes || "0"),
    ultimo_teste: c.ultimo_teste ? new Date(c.ultimo_teste) : null,
    urlConvite: `${process.env.NEXT_PUBLIC_BASE_URL}/convite/${c.token_convite}`
  }))
}

async function getEmpresaData(userId: string): Promise<EmpresaCorporativa | null> {
  const result = await sql<EmpresaCorporativa[]>`
  SELECT * FROM empresas_corporativas 
  WHERE usuario_id = ${userId}
`

return result[0] ?? null

}

interface PageProps {
  searchParams: { search?: string }
}

export default async function ColaboradoresPage({ searchParams }: PageProps) {
  const session = await getSession()
  if (!session || session.tipo_usuario !== "corporativo") {
    redirect("/login")
  }

  const resolvedSearchParams = await searchParams
  const search = resolvedSearchParams?.search ?? ""
  const empresa = await getEmpresaData(session.sub)

  if (!empresa) {
    redirect("/corporativo")
  }

  const colaboradores = await getColaboradores(empresa.id, search)

  const estatisticas = {
    total: colaboradores.length,
    ativos: colaboradores.filter((c) => c.status === "ativo").length,
    pendentes: colaboradores.filter((c) => c.status === "pendente").length,
    inativos: colaboradores.filter((c) => c.status === "inativo").length,
    concluídos: colaboradores.filter((c) => c.total_testes > 0).length,
  }
   const icons = [UsuariosIcon, User, Clock, User, Building]

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Gestão de Colaboradores</h1>
            <p className="text-muted-foreground text-white/60">{empresa.nome_empresa}</p>
          </div>
          <Link href="/corporativo/colaboradores/convidar">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Convidar Colaborador
            </Button>
          </Link>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Cards com estatísticas */}

            {Object.entries(estatisticas).map(([key, value], index) => {
            const IconComponent = icons[index]
            return (
                <Card key={key}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    </CardTitle>
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                </CardContent>
                </Card>
            )
            })}


        </div>

        {/* Filtro de busca */}
        <Card>
          <CardHeader>
            <CardTitle>Colaboradores</CardTitle>
            <CardDescription>Gerencie todos os colaboradores da sua empresa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <form method="GET">
                  <Input
                    name="search"
                    placeholder="Buscar por nome, email, cargo ou departamento..."
                    defaultValue={search}
                    className="pl-8"
                  />
                </form>
              </div>
            </div>

            {colaboradores.length > 0 ? (
              <div className="rounded-md border">
                <TabelaColaboradores colaboradores={colaboradores} />
              </div>
            ) : (
              <div className="text-center py-12">
                <UsuariosIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {search ? "Nenhum colaborador encontrado" : "Nenhum colaborador cadastrado"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {search
                    ? "Tente ajustar os termos de busca"
                    : "Comece convidando seus colaboradores para realizar os testes"}
                </p>
                {!search && (
                  <Link href="/corporativo/colaboradores/convidar">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Convidar Primeiro Colaborador
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
