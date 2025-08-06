// app/api/pedidos/route.ts
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  const pedidos = await sql`
    SELECT servico_id
    FROM pedidos
    WHERE cliente_id = ${session.sub}
  `

  return NextResponse.json(pedidos)
}
