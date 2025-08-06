import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import sql from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Clock, User, Calendar, Eye } from "lucide-react"
import Link from "next/link"

interface PedidoAnalise {
  id: string
  cliente_id: string
  cliente_nome: string
  cliente_email: string
  data_pedido: string
  data_envio_imagens: string
  url_perfil_normal: string
  url_perfil_sorrindo: string
  url_perfil_lado: string
  url_boca_sorrindo: string
  resultado_id: string | null
  resultado_status: string | null
}

async function getPedidosAnalise() {
  try {
    const pedidos = await sql<PedidoAnalise[]>`
      SELECT 
        p.id,
        p.cliente_id,
        u.nome as cliente_nome,
        u.email as cliente_email,
        p.data_pedido,
        p.data_envio_imagens,
        p.url_perfil_normal,
        p.url_perfil_sorrindo,
        p.url_perfil_lado,
        p.url_boca_sorrindo,
        rt.id as resultado_id,
        rt.status as resultado_status
      FROM pedidos p
      JOIN usuarios u ON p.cliente_id = u.id
      JOIN servicos s ON p.servico_id = s.id
      LEFT JOIN resultados_testes rt ON rt.pedido_id = p.id
      WHERE s.nome = 'Análise Facial'
        AND p.status = 'em_andamento'
        AND p.url_perfil_normal IS NOT NULL
        AND p.url_perfil_sorrindo IS NOT NULL
        AND p.url_perfil_lado IS NOT NULL
        AND p.url_boca_sorrindo IS NOT NULL
      ORDER BY p.data_envio_imagens DESC
    `

    return pedidos
  } catch (error) {
    console.error("Erro ao buscar pedidos de análise facial:", error)
    return []
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function PedidoCard({ pedido }: { pedido: PedidoAnalise }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Camera className="w-6 h-6 text-purple-600" />
            <div>
              <CardTitle className="text-lg">Análise Facial - {pedido.cliente_nome}</CardTitle>
              <CardDescription>
                Pedido #{pedido.id.slice(0, 8)} • {pedido.cliente_email}
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Em Andamento
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Informações do Cliente */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Informações do Cliente:</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{pedido.cliente_nome}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Pedido: {formatDate(pedido.data_pedido)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Imagens: {formatDate(pedido.data_envio_imagens)}</span>
              </div>
            </div>
          </div>

          {/* Preview das Imagens */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Imagens Enviadas:</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <img
                  src={pedido.url_perfil_normal || "/placeholder.svg"}
                  alt="Perfil Normal"
                  className="w-full h-20 object-cover rounded border"
                />
                <p className="text-xs text-gray-600 mt-1">Normal</p>
              </div>
              <div className="text-center">
                <img
                  src={pedido.url_perfil_sorrindo || "/placeholder.svg"}
                  alt="Perfil Sorrindo"
                  className="w-full h-20 object-cover rounded border"
                />
                <p className="text-xs text-gray-600 mt-1">Sorrindo</p>
              </div>
              <div className="text-center">
                <img
                  src={pedido.url_perfil_lado || "/placeholder.svg"}
                  alt="Perfil de Lado"
                  className="w-full h-20 object-cover rounded border"
                />
                <p className="text-xs text-gray-600 mt-1">Perfil</p>
              </div>
              <div className="text-center">
                <img
                  src={pedido.url_boca_sorrindo || "/placeholder.svg"}
                  alt="Boca Sorrindo"
                  className="w-full h-20 object-cover rounded border"
                />
                <p className="text-xs text-gray-600 mt-1">Boca</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <Button asChild>
            <Link href={`/admin/analise-facial/${pedido.id}`}>
              <Eye className="w-4 h-4 mr-2" />
              Analisar e Criar Resultado
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/analise-facial/${pedido.id}/imagens`}>
              <Camera className="w-4 h-4 mr-2" />
              Ver Imagens Completas
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function AdminAnaliseFacialPage() {
  const session = await getSession()
  if (!session || session.tipo_usuario !== "admin") {
    redirect("/login")
  }

  const pedidos = await getPedidosAnalise()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <h1 className="text-lg font-semibold md:text-2xl">Análise Facial - Administração</h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-whitefont-bold tracking-tight">Pedidos Pendentes de Análise</h2>
            <p className="text-muted-foreground">Gerencie e complete as análises faciais dos clientes</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {pedidos.length} pendente{pedidos.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        {pedidos.length > 0 ? (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <PedidoCard key={pedido.id} pedido={pedido} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Camera className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma análise pendente</h3>
              <p className="text-gray-600 text-center">
                Não há pedidos de análise facial aguardando processamento no momento.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
