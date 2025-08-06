"use server"

import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { uploadToCloudinary } from "@/lib/cloudinary"

// Função para enviar webhook para N8N
async function sendWebhookToN8N(pedidoData: any) {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL

    if (!webhookUrl) {
      console.warn("N8N_WEBHOOK_URL não configurada")
      return { success: false, error: "Webhook URL não configurada" }
    }

    const webhookPayload = {
      pedido_id: pedidoData.id,
      cliente_id: pedidoData.cliente_id,
      cliente_nome: pedidoData.cliente_nome,
      cliente_email: pedidoData.cliente_email,
      servico: "Análise Facial",
      status: "em_andamento",
      data_envio: new Date().toISOString(),
      imagens_urls: {
        perfil_normal: pedidoData.url_perfil_normal,
        perfil_sorrindo: pedidoData.url_perfil_sorrindo,
        perfil_lado: pedidoData.url_perfil_lado,
        boca_sorrindo: pedidoData.url_boca_sorrindo,
      },
      cloudinary_info: {
        public_ids: pedidoData.cloudinary_public_ids,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      },
      instrucoes: {
        perfil_normal: "Rosto de frente, expressão neutra",
        perfil_sorrindo: "Rosto de frente, sorriso natural",
        perfil_lado: "Rosto de perfil (90 graus)",
        boca_sorrindo: "Close-up da boca com sorriso amplo",
      },
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "CRM-4-Temperamentos/1.0",
        "X-Webhook-Source": "facial-analysis",
      },
      body: JSON.stringify(webhookPayload),
    })

    const responseText = await response.text()

    return {
      success: response.ok,
      status: response.status,
      response: responseText,
    }
  } catch (error) {
    console.error("Erro ao enviar webhook:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    }
  }
}

export async function uploadFacialImages(formData: FormData) {
  try {
    const session = await getSession()

    if (!session || session.tipo_usuario !== "cliente") {
      redirect("/login")
    }

    const pedidoId = formData.get("pedidoId") as string

    // Obter os arquivos
    const perfilNormal = formData.get("perfilNormal") as File
    const perfilSorrindo = formData.get("perfilSorrindo") as File
    const perfilLado = formData.get("perfilLado") as File
    const bocaSorrindo = formData.get("bocaSorrindo") as File

    // Validar se todas as imagens foram enviadas
    if (!perfilNormal || !perfilSorrindo || !perfilLado || !bocaSorrindo) {
      return { success: false, error: "Todas as 4 imagens são obrigatórias." }
    }

    // Validar tamanhos
    const maxSize = 10 * 1024 * 1024 // 10MB para Cloudinary
    const files = [perfilNormal, perfilSorrindo, perfilLado, bocaSorrindo]

    for (const file of files) {
      if (file.size > maxSize) {
        return { success: false, error: "Uma ou mais imagens excedem o tamanho máximo de 10MB." }
      }
      if (!file.type.startsWith("image/")) {
        return { success: false, error: "Todos os arquivos devem ser imagens." }
      }
    }

    // Obter dados do cliente
    const clienteData = await sql`
      SELECT u.nome, u.email 
      FROM usuarios u 
      WHERE u.id = ${session.sub}
    `

    if (clienteData.length === 0) {
      return { success: false, error: "Cliente não encontrado." }
    }

    const cliente = clienteData[0]

    // Fazer upload das imagens para Cloudinary
    console.log("Iniciando upload das imagens para Cloudinary...")

    const uploadPromises = [
      uploadToCloudinary(perfilNormal, `facial-analysis/${session.sub}`, `${pedidoId}_perfil_normal`),
      uploadToCloudinary(perfilSorrindo, `facial-analysis/${session.sub}`, `${pedidoId}_perfil_sorrindo`),
      uploadToCloudinary(perfilLado, `facial-analysis/${session.sub}`, `${pedidoId}_perfil_lado`),
      uploadToCloudinary(bocaSorrindo, `facial-analysis/${session.sub}`, `${pedidoId}_boca_sorrindo`),
    ]

    const uploadResults = await Promise.all(uploadPromises)

    console.log(
      "Upload concluído:",
      uploadResults.map((r) => r.secure_url),
    )

    // Extrair URLs e public_ids
    const urls = {
      perfil_normal: uploadResults[0].secure_url,
      perfil_sorrindo: uploadResults[1].secure_url,
      perfil_lado: uploadResults[2].secure_url,
      boca_sorrindo: uploadResults[3].secure_url,
    }

    const publicIds = uploadResults.map((r) => r.public_id)

    // Atualizar o pedido com as URLs das imagens
    await sql`
      UPDATE pedidos 
      SET 
        url_perfil_normal = ${urls.perfil_normal},
        url_perfil_sorrindo = ${urls.perfil_sorrindo},
        url_perfil_lado = ${urls.perfil_lado},
        url_boca_sorrindo = ${urls.boca_sorrindo},
        cloudinary_public_ids = ${JSON.stringify(publicIds)},
        data_envio_imagens = NOW(),
        status = 'em_andamento'
      WHERE id = ${pedidoId} AND cliente_id = ${session.sub}
    `

    // Preparar dados para o webhook
    const pedidoData = {
      id: pedidoId,
      cliente_id: session.sub,
      cliente_nome: cliente.nome,
      cliente_email: cliente.email,
      url_perfil_normal: urls.perfil_normal,
      url_perfil_sorrindo: urls.perfil_sorrindo,
      url_perfil_lado: urls.perfil_lado,
      url_boca_sorrindo: urls.boca_sorrindo,
      cloudinary_public_ids: publicIds,
    }

    // Enviar webhook para N8N
    console.log("Enviando webhook para N8N...")
    const webhookResult = await sendWebhookToN8N(pedidoData)

    // Atualizar o pedido com informações do webhook
    await sql`
      UPDATE pedidos 
      SET 
        webhook_enviado = ${webhookResult.success},
        webhook_response = ${JSON.stringify(webhookResult)}
      WHERE id = ${pedidoId}
    `

    // Registrar log da ação
    await sql`
      INSERT INTO logs (usuario_id, acao, descricao)
      VALUES (
        ${session.sub}, 
        'envio_imagens_analise_facial', 
        ${`Enviou imagens para análise facial via Cloudinary. Webhook: ${webhookResult.success ? "sucesso" : "falhou"}`}
      )
    `

    revalidatePath("/dashboard/analise-facial")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Imagens enviadas com sucesso para análise!",
      webhookStatus: webhookResult.success ? "enviado" : "falhou",
      imageUrls: urls,
    }
  } catch (error) {
    console.error("Erro ao enviar imagens:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro interno do servidor. Tente novamente.",
    }
  }
}
