import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    // Verificar autenticação
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se é admin
    if (session.tipo_usuario !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Buscar clientes com informações dos usuários e estatísticas de pedidos
    const clientes = await sql`
      SELECT 
        c.id,
        u.nome,
        u.email,
        c.telefone,
        c.data_nascimento,
        c.genero,
        c.documento,
        c.status,
        u.criado_em as data_cadastro,
        COALESCE(pedido_stats.total_pedidos, 0) as total_pedidos,
        pedido_stats.ultimo_pedido,
        pedido_stats.status_ultimo_pedido
      FROM clientes c
      INNER JOIN usuarios u ON c.id = u.id
      LEFT JOIN (
        SELECT 
          cliente_id,
          COUNT(*) as total_pedidos,
          MAX(data_pedido) as ultimo_pedido,
          (
            SELECT status 
            FROM pedidos p2 
            WHERE p2.cliente_id = pedidos.cliente_id 
            ORDER BY data_pedido DESC 
            LIMIT 1
          ) as status_ultimo_pedido
        FROM pedidos 
        GROUP BY cliente_id
      ) pedido_stats ON c.id = pedido_stats.cliente_id
      WHERE u.tipo_usuario = 'cliente'
      ORDER BY u.criado_em DESC
    `

    return NextResponse.json(clientes)
  } catch (error) {
    console.error("Erro ao buscar clientes:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
