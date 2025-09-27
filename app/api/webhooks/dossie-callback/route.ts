import { type NextRequest, NextResponse } from "next/server"
import sql from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("=== WEBHOOK DOSSIÊ RECEBIDO ===")
    console.log("Payload:", JSON.stringify(body, null, 2))

    const { resultado_id, dossie_conteudo, status = "pendente", tipo } = body

    if (!resultado_id || !dossie_conteudo) {
      console.error("Dados obrigatórios não fornecidos")
      return NextResponse.json({ error: "resultado_id e dossie_conteudo são obrigatórios" }, { status: 400 })
    }

    // Atualizar o resultado com o dossiê gerado
    await sql`
      UPDATE resultados_testes 
      SET 
        dossie_gerado = true,
        dossie_conteudo = ${dossie_conteudo},
        dossie_status = ${status},
        dossie_data_geracao = NOW()
      WHERE id = ${resultado_id}
    `

    console.log(
      `Dossiê ${tipo === "corrigir_dossie" ? "corrigido" : "gerado"} com sucesso para resultado:`,
      resultado_id,
    )
    console.log("===============================")

    return NextResponse.json({
      success: true,
      message: `Dossiê ${tipo === "corrigir_dossie" ? "corrigido" : "gerado"} com sucesso`,
    })
  } catch (error) {
    console.error("Erro no webhook de dossiê:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
