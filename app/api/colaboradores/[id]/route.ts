import { NextResponse } from "next/server"
import sql from "@/lib/db"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    await sql`DELETE FROM colaboradores_corporativos WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao remover colaborador:", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
}
