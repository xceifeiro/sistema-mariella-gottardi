// app/api/upload-imagens/route.ts
import { NextRequest, NextResponse } from "next/server"
import { uploadFacialImages } from "@/app/(protected)/dashboard/analise-facial/actions"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const result = await uploadFacialImages(formData)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro no endpoint /api/upload-imagens:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido no servidor.",
      },
      { status: 500 }
    )
  }
}
