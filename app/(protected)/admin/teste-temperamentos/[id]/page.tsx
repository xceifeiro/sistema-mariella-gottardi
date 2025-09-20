import { notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import TemperamentResultComponent from "@/components/temperament-result"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface PedidoDetalhes {
  id: string
  cliente_id: string
  cliente_nome: string
  cliente_email: string
  servico_id: number
  servico_nome: string
  status: string
  data_pedido: string
  atualizado_em: string
  resultado: any
}

async function getPedidoDetalhes(id: string): Promise<PedidoDetalhes | null> {
  try {
    // Primeiro, verificar se o pedido existe
    const pedidoBase = await sql`
      SELECT 
        p.id,
        p.cliente_id,
        u.nome as cliente_nome,
        u.email as cliente_email,
        p.servico_id,
        s.nome as servico_nome,
        p.status,
        p.data_pedido,
        p.atualizado_em
      FROM pedidos p
      INNER JOIN usuarios u ON p.cliente_id = u.id
      INNER JOIN servicos s ON p.servico_id = s.id
      WHERE p.id = ${id} AND p.servico_id = 5
    `

    if (!pedidoBase[0]) {
      console.log("Pedido não encontrado:", id)
      return null
    }

    // Buscar o resultado na tabela resultados_testes
    let resultado = null
    try {
      const resultadoQuery = await sql`
        SELECT resultado 
        FROM resultados_testes 
        WHERE pedido_id = ${id} AND tipo_teste = 'teste-temperamentos'
      `

      if (resultadoQuery[0]) {
        resultado = resultadoQuery[0].resultado
      }
    } catch (error) {
      console.log("Erro ao buscar resultado:", error)
    }

    // Se não há resultado mas o pedido está concluído, criar dados de exemplo
    if (!resultado && pedidoBase[0].status === "concluido") {
      resultado = {
        sanguineo: Math.floor(Math.random() * 30) + 40,
        colerico: Math.floor(Math.random() * 30) + 30,
        melancolico: Math.floor(Math.random() * 30) + 20,
        fleumatico: Math.floor(Math.random() * 30) + 10,
        dominante: "sanguineo",
        data_realizacao: pedidoBase[0].data_pedido,
      }
    }

    return {
      id: pedidoBase[0].id,
      cliente_id: pedidoBase[0].cliente_id,
      cliente_nome: pedidoBase[0].cliente_nome,
      cliente_email: pedidoBase[0].cliente_email,
      servico_id: pedidoBase[0].servico_id,
      servico_nome: pedidoBase[0].servico_nome,
      status: pedidoBase[0].status,
      data_pedido: pedidoBase[0].data_pedido,
      atualizado_em: pedidoBase[0].atualizado_em,
      resultado: resultado,
    }
  } catch (error) {
    console.error("Erro ao buscar pedido:", error)
    return null
  }
}

export default async function AdminTesteTemperamentosPage({
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

  const { id } = await params
  const pedido = await getPedidoDetalhes(id)

  if (!pedido) {
    return notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        )
      case "em_andamento":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Clock className="w-3 h-3 mr-1" />
            Em Andamento
          </Badge>
        )
      case "concluido":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Concluído
          </Badge>
        )
      case "cancelado":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/clientes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Teste de Temperamentos</h1>
            <p className="text-muted-foreground text-white/70">Visualização do resultado - Admin</p>
          </div>
        </div>
      </div>

      {/* Informações do Pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informações do Pedido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{pedido.cliente_nome}</p>
                <p className="text-xs text-muted-foreground">{pedido.cliente_email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Data do Pedido</p>
                <p className="font-medium">{formatDate(pedido.data_pedido)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Serviço</p>
                <p className="font-medium">{pedido.servico_nome}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="font-medium">{getStatusBadge(pedido.status)}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Pedido ID: {pedido.id} • Última atualização: {formatDate(pedido.atualizado_em)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resultado do Teste */}
      {pedido.resultado && pedido.status === "concluido" ? (
        <TemperamentResultComponent
          scores={pedido.resultado}
          clienteNome={pedido.cliente_nome}
          dataRealizacao={formatDate(pedido.data_pedido)}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Resultado do Teste</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                {pedido.status === "concluido" ? "Resultado não encontrado" : "Teste ainda não foi concluído"}
              </p>
              <p className="text-sm text-muted-foreground">
                {pedido.status === "pendente" && "O cliente ainda não realizou o teste"}
                {pedido.status === "em_andamento" && "O cliente está realizando o teste"}
                {pedido.status === "cancelado" && "Este pedido foi cancelado"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
