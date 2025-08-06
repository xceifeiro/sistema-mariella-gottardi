import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se é admin
    const adminCheck = await sql`
      SELECT tipo_usuario FROM usuarios WHERE id = ${session.id}
    `

    if (!adminCheck[0] || adminCheck[0].tipo_usuario !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Buscar clientes com informações dos usuários
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
        COALESCE(stats.total_pedidos, 0) as total_pedidos,
        COALESCE(stats.pedidos_concluidos, 0) as pedidos_concluidos,
        COALESCE(stats.pedidos_pendentes, 0) as pedidos_pendentes
      FROM clientes c
      INNER JOIN usuarios u ON c.id = u.id
      LEFT JOIN (
        SELECT 
          cliente_id,
          COUNT(*) as total_pedidos,
          COUNT(CASE WHEN status = 'concluido' THEN 1 END) as pedidos_concluidos,
          COUNT(CASE WHEN status = 'pendente' THEN 1 END) as pedidos_pendentes
        FROM pedidos 
        GROUP BY cliente_id
      ) stats ON c.id = stats.cliente_id
      WHERE u.tipo_usuario = 'cliente'
      ORDER BY u.criado_em DESC
    `

    return NextResponse.json(clientes)
  } catch (error) {
    console.error("Erro ao buscar clientes:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
