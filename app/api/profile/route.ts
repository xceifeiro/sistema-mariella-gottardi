import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"

export async function GET() {
  const session = await getSession()
  if (!session || session.tipo_usuario !== "cliente") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const [clientData] = await sql`
      SELECT 
        u.nome, u.email,
        c.telefone, c.data_nascimento, c.genero, c.documento
      FROM usuarios u
      LEFT JOIN clientes c ON u.id = c.id
      WHERE u.id = ${session.sub}
    `

    return NextResponse.json(clientData)
  } catch (error) {
    console.error("Erro ao buscar dados do cliente:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
