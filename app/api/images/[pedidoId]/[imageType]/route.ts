import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { pedidoId: string; imageType: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { pedidoId, imageType } = params

    // Validar tipo de imagem
    const validImageTypes = [
      "imagem_perfil_normal",
      "imagem_perfil_sorrindo",
      "imagem_perfil_lado",
      "imagem_boca_sorrindo",
    ]

    if (!validImageTypes.includes(imageType)) {
      return new NextResponse("Invalid image type", { status: 400 })
    }

    // Buscar a imagem no banco
    const result = await sql`
      SELECT ${sql(imageType)}, cliente_id
      FROM pedidos 
      WHERE id = ${pedidoId}
    `

    if (result.length === 0) {
      return new NextResponse("Image not found", { status: 404 })
    }

    const pedido = result[0]
    const imageData = pedido[imageType]

    // Verificar se o usuário tem permissão (cliente dono ou admin)
    if (session.tipo_usuario === "cliente" && session.sub !== pedido.cliente_id) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    if (!imageData) {
      return new NextResponse("Image not found", { status: 404 })
    }

    // Extrair dados da imagem base64
    const matches = imageData.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
    if (!matches) {
      return new NextResponse("Invalid image format", { status: 400 })
    }

    const mimeType = matches[1]
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, "base64")

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000",
      },
    })
  } catch (error) {
    console.error("Erro ao servir imagem:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
