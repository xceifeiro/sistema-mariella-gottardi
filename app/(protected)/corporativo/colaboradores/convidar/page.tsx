import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Users, UserPlus, Mail, AlertCircle, CheckCircle, Clock, X } from "lucide-react"
import sql from "@/lib/db"
import { getSession } from "@/lib/auth.server"
import { redirect } from "next/navigation"
import { enviarConvite, cancelarConvite } from "./actions"
import ConviteAcoes from "@/components/ConviteAcoes"


async function getEmpresaData(userId: number) {
  const [empresa] = await sql`
    SELECT 
      ec.*,
      COUNT(cc.id) as total_colaboradores,
      COUNT(CASE WHEN cc.status = 'ativo' THEN 1 END) as colaboradores_ativos,
      COUNT(CASE WHEN cc.status = 'pendente' THEN 1 END) as convites_pendentes
    FROM empresas_corporativas ec
    LEFT JOIN colaboradores_corporativos cc ON ec.id = cc.empresa_id
    WHERE ec.usuario_id = ${userId}
    GROUP BY ec.id
  `

  return empresa
}

async function getConvitesPendentes(empresaId: number) {
  return await sql`
    SELECT 
      id,
      nome,
      email,
      cargo,
      departamento,
      convidado_em,
      convite_expira_em,
      token_convite,
      mensagem
    FROM colaboradores_corporativos
    WHERE empresa_id = ${empresaId}
    AND status = 'pendente'
    ORDER BY convidado_em DESC
  `
}


export default async function ConvidarColaboradoresPage() {
  const user = await getSession()

  if (!user || user.tipo_usuario !== "corporativo") {
    redirect("/login")
  }

  const empresa = await getEmpresaData(user.id)

  if (!empresa) {
    redirect("/corporativo")
  }

  const convitesPendentes = await getConvitesPendentes(empresa.id)

  const colaboradoresDisponiveis = empresa.limite_colaboradores - empresa.total_colaboradores
  const podeConvidar = colaboradoresDisponiveis > 0 && empresa.status === "ativo"

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Convidar Colaboradores</h1>
          <p className="text-muted-foreground">Envie convites para seus colaboradores acessarem a plataforma</p>
        </div>
      </div>

      {/* Status da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Status da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{empresa.total_colaboradores}</div>
              <div className="text-sm text-muted-foreground">Total de Colaboradores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{empresa.colaboradores_ativos}</div>
              <div className="text-sm text-muted-foreground">Colaboradores Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{empresa.convites_pendentes}</div>
              <div className="text-sm text-muted-foreground">Convites Pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{colaboradoresDisponiveis}</div>
              <div className="text-sm text-muted-foreground">Vagas Disponíveis</div>
            </div>
          </div>

          {empresa.status !== "ativo" && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Empresa Inativa</p>
                <p className="text-sm text-red-600">
                  Sua empresa está com status "{empresa.status}". Entre em contato com o suporte.
                </p>
              </div>
            </div>
          )}

          {colaboradoresDisponiveis <= 0 && empresa.status === "ativo" && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">Limite Atingido</p>
                <p className="text-sm text-orange-600">
                  Você atingiu o limite de {empresa.limite_colaboradores} colaboradores. Entre em contato para aumentar
                  seu plano.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Formulário de Convite */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Novo Convite
            </CardTitle>
            <CardDescription>Preencha os dados do colaborador para enviar o convite</CardDescription>
          </CardHeader>
          <CardContent>
            {podeConvidar ? (
              <form action={enviarConvite} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input id="nome" name="nome" placeholder="Ex: João Silva" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" placeholder="joao@empresa.com" required />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input id="cargo" name="cargo" placeholder="Ex: Analista de Marketing" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departamento">Departamento</Label>
                    <Input id="departamento" name="departamento" placeholder="Ex: Marketing" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mensagem">Mensagem Personalizada (Opcional)</Label>
                  <Textarea
                    id="mensagem"
                    name="mensagem"
                    placeholder="Adicione uma mensagem personalizada para o convite..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Convite
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {empresa.status !== "ativo"
                    ? "Empresa inativa. Não é possível enviar convites."
                    : "Limite de colaboradores atingido. Não é possível enviar novos convites."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Convites Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Convites Pendentes
              {convitesPendentes.length > 0 && <Badge variant="secondary">{convitesPendentes.length}</Badge>}
            </CardTitle>
            <CardDescription>Convites enviados aguardando aceitação</CardDescription>
          </CardHeader>
          <CardContent>
            {convitesPendentes.length > 0 ? (
              <div className="space-y-4">
                {convitesPendentes.map((convite) => {
                  const dataExpiracao = new Date(convite.convite_expira_em)
                  const agora = new Date()
                  const diasRestantes = Math.ceil((dataExpiracao.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24))
                  const expirado = diasRestantes <= 0
                  const urlConvite = `${process.env.NEXT_PUBLIC_BASE_URL}/convite/${convite.token_convite}`;

                  return (
                    <div key={convite.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{convite.nome}</h4>
                            <Badge variant={expirado ? "destructive" : diasRestantes <= 1 ? "secondary" : "default"}>
                              {expirado ? "Expirado" : `${diasRestantes} dia${diasRestantes !== 1 ? "s" : ""}`}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{convite.email}</p>
                          {convite.cargo && (
                            <p className="text-sm text-muted-foreground">
                              {convite.cargo}
                              {convite.departamento && ` • ${convite.departamento}`}
                            </p>
                            
                          )}
                          <ConviteAcoes urlConvite={urlConvite} />
                        </div>

                        <form action={cancelarConvite}>
                          <input type="hidden" name="conviteId" value={convite.id} />
                          <Button
                            type="submit"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>Enviado em: {new Date(convite.convidado_em).toLocaleDateString("pt-BR")}</span>
                          <span>Expira em: {dataExpiracao.toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>

                      {convite.mensagem && (
                        <div className="text-sm bg-gray-50 p-2 rounded border-l-4 border-blue-200">
                          <p className="italic">"{convite.mensagem}"</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum convite pendente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle>Como funciona?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold">1. Envie o Convite</h4>
              <p className="text-sm text-muted-foreground">
                Preencha os dados do colaborador e envie o convite por email.
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold">2. Colaborador Recebe</h4>
              <p className="text-sm text-muted-foreground">
                O colaborador recebe um link único para completar o cadastro.
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold">3. Acesso Liberado</h4>
              <p className="text-sm text-muted-foreground">Após o cadastro, o colaborador pode acessar a plataforma.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
