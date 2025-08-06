import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  BadgeIcon as IdCard,
} from "lucide-react"
import Link from "next/link"
import sql from "@/lib/db"
import { getSession } from "@/lib/auth"

interface ClienteDetalhes {
  id: string
  nome: string
  email: string
  telefone: string | null
  data_nascimento: string | null
  genero: string | null
  documento: string | null
  status: string
  data_cadastro: string
  pedidos: Array<{
    id: string
    servico_id: string
    servico_nome: string
    status: string
    data_pedido: string
    atualizado_em: string | null
  }>
}

async function getClienteDetalhes(id: string): Promise<ClienteDetalhes | null> {
  try {
    // Buscar dados do cliente
    const cliente = await sql`
      SELECT 
        c.id,
        u.nome,
        u.email,
        c.telefone,
        c.data_nascimento,
        c.genero,
        c.documento,
        c.status,
        u.criado_em as data_cadastro
      FROM clientes c
      INNER JOIN usuarios u ON c.id = u.id
      WHERE c.id = ${id} AND u.tipo_usuario = 'cliente'
    `

    if (!cliente[0]) return null

    // Buscar pedidos do cliente
    const pedidos = await sql`
      SELECT 
        p.id,
        p.servico_id,
        s.nome as servico_nome,
        p.status,
        p.data_pedido,
        p.atualizado_em
      FROM pedidos p
      INNER JOIN servicos s ON p.servico_id = s.id
      WHERE p.cliente_id = ${id}
      ORDER BY p.data_pedido DESC
    `

    return {
      id: cliente[0].id,
      nome: cliente[0].nome,
      email: cliente[0].email,
      telefone: cliente[0].telefone,
      data_nascimento: cliente[0].data_nascimento,
      genero: cliente[0].genero,
      documento: cliente[0].documento,
      status: cliente[0].status,
      data_cadastro: cliente[0].data_cadastro,
      pedidos: pedidos.map((p) => ({
        id: p.id as string,
        servico_id: p.servico_id as string,
        servico_nome: p.servico_nome as string,
        status: p.status as string,
        data_pedido: p.data_pedido as string,
        atualizado_em: p.atualizado_em as string | null,
      })),
    }
  } catch (error) {
    console.error("Erro ao buscar cliente:", error)
    return null
  }
}

// Função para determinar o link correto baseado no serviço
function getServiceLink(pedidoId: string, servicoId: string | number) {
  switch (String(servicoId)) {
    case "5":
      return `/admin/teste-temperamentos/${pedidoId}`
    case "6":
      return `/admin/teste-disc/${pedidoId}`
    case "7":
      return `/admin/analise-facial/${pedidoId}`
    case "8":
      return `/admin/pacote-full/${pedidoId}`
    default:
      return `/admin/analise-facial/${pedidoId}`
  }
}

// Função para determinar o texto do botão baseado no serviço
function getServiceButtonText(servicoId: string) {
  switch (servicoId) {
    case "5": // Teste de Temperamentos
      return "Ver Teste"
    case "6": // Teste DISC
      return "Ver Teste"
    case "7": // Análise Facial
      return "Ver Análise"
    case "8": // Pacote Full
      return "Ver Pacote"
    default:
      return "Ver Detalhes"
  }
}

export default async function ClienteDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()

  if (!session?.id) {
    return notFound()
  }

  // Verificar se é admin
  const adminCheck = await sql`
    SELECT tipo_usuario FROM usuarios WHERE id = ${session.id}
  `

  if (!adminCheck[0] || adminCheck[0].tipo_usuario !== "admin") {
    return notFound()
  }

  // Aguardar params antes de usar
  const { id } = await params
  const cliente = await getClienteDetalhes(id)

  if (!cliente) {
    return notFound()
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pendente
          </Badge>
        )
      case "em_andamento":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Em Andamento
          </Badge>
        )
      case "concluido":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Concluído
          </Badge>
        )
      case "cancelado":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getClienteStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Ativo
          </Badge>
        )
      case "inativo":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Inativo
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getGeneroLabel = (genero: string | null) => {
    if (!genero) return "Não informado"
    switch (genero) {
      case "masculino":
        return "Masculino"
      case "feminino":
        return "Feminino"
      case "outro":
        return "Outro"
      default:
        return genero
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detalhes do Cliente</h1>
          <p className="text-muted-foreground">Informações completas e histórico de pedidos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/clientes">Voltar</Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/clientes/${cliente.id}/editar`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Informações Pessoais */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{cliente.nome}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{cliente.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{cliente.telefone || "Não informado"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <IdCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Documento</p>
                  <p className="font-medium">{cliente.documento || "Não informado"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Gênero</p>
                  <p className="font-medium">{getGeneroLabel(cliente.genero)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="font-medium">{formatDate(cliente.data_nascimento)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                  <p className="font-medium">{formatDate(cliente.data_cadastro)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cliente.status === "ativo" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="font-medium">{getClienteStatusBadge(cliente.status)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Pedidos */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Histórico de Pedidos ({cliente.pedidos.length})
              </CardTitle>
              <CardDescription>Todos os pedidos realizados pelo cliente</CardDescription>
            </CardHeader>
            <CardContent>
              {cliente.pedidos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum pedido encontrado</p>
                  <p className="text-sm">Este cliente ainda não fez nenhum pedido</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cliente.pedidos.map((pedido, index) => (
                    <div key={pedido.id}>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{pedido.servico_nome}</h4>
                            {getStatusBadge(pedido.status)}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Pedido realizado em: {formatDate(pedido.data_pedido)}</p>
                            {pedido.atualizado_em && pedido.atualizado_em !== pedido.data_pedido && (
                              <p>Última atualização: {formatDate(pedido.atualizado_em)}</p>
                            )}
                            <p className="text-xs">Serviço ID: {pedido.servico_id}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={getServiceLink(pedido.id, pedido.servico_id)}>
                              {getServiceButtonText(pedido.servico_id)}
                            </Link>
                          </Button>
                        </div>
                      </div>
                      {index < cliente.pedidos.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
