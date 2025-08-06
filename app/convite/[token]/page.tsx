import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar, Mail, User, Briefcase } from "lucide-react"
import sql from "@/lib/db"
import { notFound } from "next/navigation"
import { aceitarConvite } from "./actions"

async function getConviteData(token: string) {
  const [convite] = await sql`
    SELECT 
      cc.*,
      ec.nome_empresa,
      ec.cnpj,
      u.nome as responsavel_nome,
      u.email as responsavel_email
    FROM colaboradores_corporativos cc
    INNER JOIN empresas_corporativas ec ON cc.empresa_id = ec.id
    INNER JOIN usuarios u ON ec.usuario_id = u.id
    WHERE cc.token_convite = ${token}
    AND cc.status = 'pendente'
    AND cc.convite_expira_em > NOW()
  `

  return convite
}

interface ConvitePageProps {
  params: Promise<{
    token: string
  }>
}

export default async function ConvitePage({ params }: ConvitePageProps) {
  const { token } = await params
  const convite = await getConviteData(token)

  if (!convite) {
    notFound()
  }

  const dataExpiracao = new Date(convite.convite_expira_em)
  const diasRestantes = Math.ceil((dataExpiracao.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Você foi convidado!</h1>
          <p className="text-gray-600">Complete seu cadastro para acessar a plataforma de análise de temperamentos</p>
        </div>

        {/* Informações do Convite */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Detalhes do Convite
            </CardTitle>
            <CardDescription>Você foi convidado para fazer parte da equipe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{convite.nome_empresa}</p>
                    {convite.cnpj && <p className="text-sm text-muted-foreground">CNPJ: {convite.cnpj}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Responsável</p>
                    <p className="text-sm text-muted-foreground">{convite.responsavel_nome}</p>
                    <p className="text-sm text-muted-foreground">{convite.responsavel_email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Seu Email</p>
                    <p className="text-sm text-muted-foreground">{convite.email}</p>
                  </div>
                </div>

                {convite.cargo && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Cargo</p>
                      <p className="text-sm text-muted-foreground">{convite.cargo}</p>
                      {convite.departamento && <p className="text-xs text-muted-foreground">{convite.departamento}</p>}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Convite expira em</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">{dataExpiracao.toLocaleDateString("pt-BR")}</p>
                      <Badge
                        variant={diasRestantes <= 1 ? "destructive" : diasRestantes <= 3 ? "secondary" : "default"}
                      >
                        {diasRestantes} dia{diasRestantes !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {convite.mensagem && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-800 mb-2">Mensagem do responsável:</p>
                <p className="text-blue-700 italic">"{convite.mensagem}"</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formulário de Cadastro */}
        <Card>
          <CardHeader>
            <CardTitle>Complete seu Cadastro</CardTitle>
            <CardDescription>Crie sua senha para acessar a plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={aceitarConvite} className="space-y-4">
              <input type="hidden" name="token" value={token} />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input id="nome" name="nome" defaultValue={convite.nome} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={convite.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input id="cargo" name="cargo" defaultValue={convite.cargo || ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Input id="departamento" name="departamento" defaultValue={convite.departamento || ""} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha *</Label>
                  <Input
                    id="senha"
                    name="senha"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                  <Input
                    id="confirmarSenha"
                    name="confirmarSenha"
                    type="password"
                    placeholder="Repita sua senha"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" size="lg">
                  Aceitar Convite e Criar Conta
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informações sobre a Plataforma */}
        <Card>
          <CardHeader>
            <CardTitle>O que você poderá fazer na plataforma?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold">🧠 Teste de Temperamentos</h4>
                <p className="text-sm text-muted-foreground">
                  Realize testes completos para descobrir seu perfil de temperamento.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">📊 Análise Facial</h4>
                <p className="text-sm text-muted-foreground">
                  Participe de análises faciais para complementar seu perfil.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">📈 Relatórios Detalhados</h4>
                <p className="text-sm text-muted-foreground">
                  Acesse relatórios completos sobre seu perfil comportamental.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🎯 Desenvolvimento Pessoal</h4>
                <p className="text-sm text-muted-foreground">
                  Receba recomendações personalizadas para seu crescimento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
