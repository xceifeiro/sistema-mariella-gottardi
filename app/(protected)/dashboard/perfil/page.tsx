import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Calendar, FileText, ShoppingBag, Clock, Edit } from "lucide-react"
import sql from "@/lib/db"
import Link from "next/link"
import { RealTimeStatus } from "@/components/real-time-status"
import { AutoRefreshWrapper } from "@/components/auto-refresh-wrapper"

async function getClientProfile(clientId: string) {
  // Buscar dados do cliente com cache tags
  const [clientData] = await sql`
    SELECT 
      u.id, u.nome, u.email, u.criado_em, u.atualizado_em,
      c.telefone, c.data_nascimento, c.genero, c.documento, c.status
    FROM usuarios u
    LEFT JOIN clientes c ON u.id = c.id
    WHERE u.id = ${clientId} AND u.tipo_usuario = 'cliente'
  `

  // Buscar estatísticas dos pedidos
  const orderStats = await sql`
    SELECT 
      COUNT(*) as total_pedidos,
      COUNT(CASE WHEN status = 'pendente' THEN 1 END) as pendentes,
      COUNT(CASE WHEN status = 'em_andamento' THEN 1 END) as em_andamento,
      COUNT(CASE WHEN status = 'concluido' THEN 1 END) as concluidos,
      MAX(data_pedido) as ultimo_pedido
    FROM pedidos 
    WHERE cliente_id = ${clientId}
  `

  // Buscar pedidos recentes
  const recentOrders = await sql`
    SELECT 
      p.id, p.status, p.data_pedido, p.atualizado_em,
      s.nome as servico_nome
    FROM pedidos p
    JOIN servicos s ON p.servico_id = s.id
    WHERE p.cliente_id = ${clientId}
    ORDER BY p.data_pedido DESC
    LIMIT 5
  `

  // Buscar resultados de testes
  const testResults = await sql`
    SELECT 
      rt.id, rt.tipo_teste, rt.criado_em,
      s.nome as servico_nome
    FROM resultados_testes rt
    JOIN pedidos p ON rt.pedido_id = p.id
    JOIN servicos s ON p.servico_id = s.id
    WHERE p.cliente_id = ${clientId}
    ORDER BY rt.criado_em DESC
    LIMIT 3
  `

  return {
    client: clientData,
    stats: orderStats[0],
    recentOrders,
    testResults,
    lastUpdate: new Date().toISOString(),
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR")
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("pt-BR")
}

function getStatusBadge(status: string) {
  const variants = {
    pendente: "secondary",
    em_andamento: "default",
    concluido: "success",
    cancelado: "destructive",
  } as const

  const labels = {
    pendente: "Pendente",
    em_andamento: "Em Andamento",
    concluido: "Concluído",
    cancelado: "Cancelado",
  }

  return (
    <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
      {labels[status as keyof typeof labels] || status}
    </Badge>
  )
}

export default async function ProfilePage() {
  const session = await getSession()
  if (!session || session.tipo_usuario !== "cliente") {
    redirect("/login")
  }

  const { client, stats, recentOrders, testResults, lastUpdate } = await getClientProfile(session.sub)

  if (!client) {
    redirect("/dashboard")
  }

  return (
    <AutoRefreshWrapper>
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Informações Pessoais */}
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </CardTitle>
                  <CardDescription>
                    Seus dados cadastrais no sistema
                    {client.atualizado_em && (
                      <span className="block text-xs mt-1">
                        Última atualização: {formatDateTime(client.atualizado_em)}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/perfil/editar">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      Nome Completo
                    </div>
                    <p className="font-medium">{client.nome}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                    <p className="font-medium">{client.email}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      Telefone
                    </div>
                    <p className="font-medium">{client.telefone || "Não informado"}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Data de Nascimento
                    </div>
                    <p className="font-medium">
                      {client.data_nascimento ? formatDate(client.data_nascimento) : "Não informado"}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Status da Conta</p>
                    <Badge variant={client.status === "ativo" ? "success" : "secondary"}>
                      {client.status === "ativo" ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Membro desde</p>
                    <p className="font-medium">{formatDate(client.criado_em)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas Atualizadas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Resumo de Atividades
                </CardTitle>
                <CardDescription>
                  Dados atualizados em tempo real
                  {stats.ultimo_pedido && (
                    <span className="block text-xs mt-1">Último pedido: {formatDate(stats.ultimo_pedido)}</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.total_pedidos}</div>
                  <p className="text-sm text-muted-foreground">Total de Serviços</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Pendentes</span>
                    <Badge variant="secondary">{stats.pendentes}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Em Andamento</span>
                    <Badge variant="default">{stats.em_andamento}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Concluídos</span>
                    <Badge variant="success">{stats.concluidos}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Pedidos Recentes com Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pedidos Recentes
                </CardTitle>
                <CardDescription>Seus últimos serviços contratados</CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-3">
                    {recentOrders.map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{order.servico_nome}</p>
                          <p className="text-xs text-muted-foreground">Criado: {formatDate(order.data_pedido)}</p>
                          {order.atualizado_em !== order.data_pedido && (
                            <p className="text-xs text-muted-foreground">
                              Atualizado: {formatDateTime(order.atualizado_em)}
                            </p>
                          )}
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">Nenhum serviço contratado ainda</p>
                    <Button className="mt-2" asChild>
                      <Link href="/dashboard/servicos">Explorar Serviços</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resultados de Testes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resultados Disponíveis
                </CardTitle>
                <CardDescription>Seus testes concluídos</CardDescription>
              </CardHeader>
              <CardContent>
                {testResults.length > 0 ? (
                  <div className="space-y-3">
                    {testResults.map((result: any) => (
                      <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{result.servico_nome}</p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(result.criado_em)}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver Resultado
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard/resultados">Ver Todos os Resultados</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">Nenhum resultado disponível</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Complete seus testes para ver os resultados aqui
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Gerencie sua conta e configurações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/perfil/editar">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/perfil/senha">
                    <User className="h-4 w-4 mr-2" />
                    Alterar Senha
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </AutoRefreshWrapper>
  )
}
