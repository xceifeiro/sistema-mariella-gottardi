import { getSession } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Mail, Briefcase, Building } from "lucide-react"
import sql from "@/lib/db"
import Link from "next/link"
import { editarColaborador } from "./actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

async function getColaboradorData(colaboradorId: string, empresaId: string) {
  const [colaborador] = await sql`
    SELECT 
      cc.*,
      u.nome as usuario_nome,
      u.email as usuario_email,
      u.criado_em as usuario_criado_em,
      ec.nome_empresa
    FROM colaboradores_corporativos cc
    LEFT JOIN usuarios u ON cc.usuario_id = u.id
    INNER JOIN empresas_corporativas ec ON cc.empresa_id = ec.id
    WHERE cc.id = ${colaboradorId} AND cc.empresa_id = ${empresaId}
  `

  return colaborador
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

export default async function EditarColaboradorPage({ params }: PageProps) {
  const session = await getSession()
  if (!session || session.tipo_usuario !== "corporativo") {
    redirect("/login")
  }

  const { id } = await params
  const empresa = await getEmpresaData(session.sub)

  if (!empresa) {
    redirect("/corporativo")
  }

  const colaborador = await getColaboradorData(id, empresa.id)

  if (!colaborador) {
    notFound()
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
            <h1 className="text-3xl font-bold tracking-tight">Editar Colaborador</h1>
            <p className="text-muted-foreground">{empresa.nome_empresa}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Informações do Colaborador */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Atuais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <Badge
                  variant={
                    colaborador.status === "ativo"
                      ? "default"
                      : colaborador.status === "pendente"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {colaborador.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm">{colaborador.email}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Cadastrado em</Label>
                <p className="text-sm">{new Date(colaborador.criado_em).toLocaleDateString("pt-BR")}</p>
              </div>

              {colaborador.usuario_criado_em && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Ativado em</Label>
                  <p className="text-sm">{new Date(colaborador.usuario_criado_em).toLocaleDateString("pt-BR")}</p>
                </div>
              )}

              {colaborador.status === "pendente" && colaborador.convite_expira_em && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Convite expira em</Label>
                  <p className="text-sm text-yellow-600">
                    {new Date(colaborador.convite_expira_em).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formulário de Edição */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Editar Dados do Colaborador</CardTitle>
              <CardDescription>Atualize as informações do colaborador</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={editarColaborador} className="space-y-6">
                <input type="hidden" name="colaboradorId" value={colaborador.id} />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nome">
                      <User className="h-4 w-4 inline mr-2" />
                      Nome Completo *
                    </Label>
                    <Input
                      id="nome"
                      name="nome"
                      type="text"
                      defaultValue={colaborador.nome}
                      required
                      placeholder="Nome completo do colaborador"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={colaborador.email}
                      required
                      placeholder="email@empresa.com"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cargo">
                      <Briefcase className="h-4 w-4 inline mr-2" />
                      Cargo
                    </Label>
                    <Input
                      id="cargo"
                      name="cargo"
                      type="text"
                      defaultValue={colaborador.cargo || ""}
                      placeholder="Ex: Analista de Marketing"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departamento">
                      <Building className="h-4 w-4 inline mr-2" />
                      Departamento
                    </Label>
                    <Input
                      id="departamento"
                      name="departamento"
                      type="text"
                      defaultValue={colaborador.departamento || ""}
                      placeholder="Ex: Marketing"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={colaborador.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      {colaborador.status === "pendente" && <SelectItem value="pendente">Pendente</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">Salvar Alterações</Button>
                  <Link href="/corporativo/colaboradores">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
