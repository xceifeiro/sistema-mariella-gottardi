"use server"

import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { AnaliseFacial } from "@/lib/types"

// Função para enviar dados para webhook N8N
async function enviarParaWebhookN8N(analiseData: any, clienteInfo: any) {
  try {
    const webhookUrl = process.env.FACIAL_ANALYSIS_WEBHOOK_URL
    if (!webhookUrl) {
      console.log("FACIAL_ANALYSIS_WEBHOOK_URL não configurada, pulando envio")
      return
    }

    const payload = {
      evento: "analise_facial_concluida",
      timestamp: new Date().toISOString(),
      pedido_id: analiseData.pedido_id,
      cliente: {
        id: clienteInfo.id,
        nome: clienteInfo.nome,
        email: clienteInfo.email,
      },
      analise: {
        temperamento_predominante: analiseData.temperamento_predominante,
        descricao_geral: analiseData.descricao_geral,
        formato_rosto: {
          classificacao: analiseData.formato_rosto_classificacao,
          temperamento: analiseData.formato_rosto_temperamento,
          justificativa: analiseData.formato_rosto_justificativa,
          interpretacao: analiseData.formato_rosto_interpretacao,
        },
        testa: {
          classificacao: analiseData.testa_classificacao,
          temperamento: analiseData.testa_temperamento,
          justificativa: analiseData.testa_justificativa,
          interpretacao: analiseData.testa_interpretacao,
        },
        sobrancelhas: {
          classificacao: analiseData.sobrancelhas_classificacao,
          temperamento: analiseData.sobrancelhas_temperamento,
          justificativa: analiseData.sobrancelhas_justificativa,
          interpretacao: analiseData.sobrancelhas_interpretacao,
        },
        cabelo: {
          classificacao: analiseData.cabelo_classificacao,
          temperamento: analiseData.cabelo_temperamento,
          justificativa: analiseData.cabelo_justificativa,
          interpretacao: analiseData.cabelo_interpretacao,
        },
        olhos: {
          classificacao: analiseData.olhos_classificacao,
          temperamento: analiseData.olhos_temperamento,
          justificativa: analiseData.olhos_justificativa,
          interpretacao: analiseData.olhos_interpretacao,
        },
        nariz: {
          classificacao: analiseData.nariz_classificacao,
          temperamento: analiseData.nariz_temperamento,
          justificativa: analiseData.nariz_justificativa,
          interpretacao: analiseData.nariz_interpretacao,
        },
        macas: {
          classificacao: analiseData.macas_classificacao,
          temperamento: analiseData.macas_temperamento,
          justificativa: analiseData.macas_justificativa,
          interpretacao: analiseData.macas_interpretacao,
        },
        boca: {
          classificacao: analiseData.boca_classificacao,
          temperamento: analiseData.boca_temperamento,
          justificativa: analiseData.boca_justificativa,
          interpretacao: analiseData.boca_interpretacao,
        },
        queixo: {
          classificacao: analiseData.queixo_classificacao,
          temperamento: analiseData.queixo_temperamento,
          justificativa: analiseData.queixo_justificativa,
          interpretacao: analiseData.queixo_interpretacao,
        },
      },
    }

    console.log("Enviando dados para N8N webhook:", webhookUrl)

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "CRM-4-Temperamentos/1.0",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error(`Erro no webhook N8N: ${response.status} - ${response.statusText}`)
      const errorText = await response.text()
      console.error("Resposta do erro:", errorText)
    } else {
      console.log("Webhook N8N enviado com sucesso")
      const responseData = await response.text()
      console.log("Resposta do N8N:", responseData)
    }
  } catch (error) {
    console.error("Erro ao enviar webhook para N8N:", error)
  }
}

export async function salvarAnalise(pedidoId: string, resultado: any, html: string) {
  try {
    // Verificar se é admin
    const session = await getSession()
    if (!session || session.tipo_usuario !== "admin") {
      return { success: false, error: "Não autorizado" }
    }

    // Verificar se já existe um resultado para este pedido
    const [existingResult] = await sql`
      SELECT id FROM resultados_testes 
      WHERE pedido_id = ${pedidoId}
    `

    if (existingResult) {
      // Atualizar resultado existente
      await sql`
        UPDATE resultados_testes 
        SET 
          resultado = ${JSON.stringify(resultado)},
          html = ${html},
          data_conclusao = NOW()
        WHERE pedido_id = ${pedidoId}
      `
    } else {
      // Criar novo resultado
      await sql`
        INSERT INTO resultados_testes (pedido_id, resultado, html, data_conclusao)
        VALUES (${pedidoId}, ${JSON.stringify(resultado)}, ${html}, NOW())
      `
    }

    // Atualizar status do pedido
    await sql`
      UPDATE pedidos 
      SET status = 'concluido'
      WHERE id = ${pedidoId}
    `

    // Buscar dados do cliente para webhook
    const [pedidoData] = await sql`
      SELECT 
        p.id,
        u.nome as cliente_nome,
        u.email as cliente_email,
        s.nome as servico_nome
      FROM pedidos p
      JOIN usuarios u ON p.cliente_id = u.id
      JOIN servicos s ON p.servico_id = s.id
      WHERE p.id = ${pedidoId}
    `

    // Enviar webhook (se configurado)
    if (process.env.WEBHOOK_URL && pedidoData) {
      try {
        await fetch(process.env.WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            evento: "analise_concluida",
            pedido_id: pedidoId,
            cliente_nome: pedidoData.cliente_nome,
            cliente_email: pedidoData.cliente_email,
            servico: pedidoData.servico_nome,
            data_conclusao: new Date().toISOString(),
            resultado: resultado,
            html: html,
          }),
        })
      } catch (webhookError) {
        console.error("Erro ao enviar webhook:", webhookError)
        // Não falhar a operação por causa do webhook
      }
    }

    // Revalidar as páginas relacionadas
    revalidatePath(`/admin/analise-facial/${pedidoId}`)
    revalidatePath("/admin/analise-facial")
    revalidatePath("/dashboard/resultados")

    return { success: true }
  } catch (error) {
    console.error("Erro ao salvar análise:", error)
    return { success: false, error: "Erro interno do servidor" }
  }
}

export async function salvarAnaliseEstruturada(analiseData: Partial<AnaliseFacial>) {
  try {
    // Verificar se é admin
    const session = await getSession()
    if (!session || session.tipo_usuario !== "admin") {
      return { success: false, error: "Não autorizado" }
    }

    if (!analiseData.pedido_id || !analiseData.cliente_id) {
      return { success: false, error: "Dados obrigatórios não fornecidos" }
    }

    // Buscar informações do cliente antes de salvar
    const [clienteInfo] = await sql`
      SELECT u.id, u.nome, u.email
      FROM usuarios u
      JOIN pedidos p ON p.cliente_id = u.id
      WHERE p.id = ${analiseData.pedido_id}
    `

    // Verificar se já existe uma análise para este pedido
    const [existingAnalysis] = await sql`
      SELECT id FROM analises_faciais 
      WHERE pedido_id = ${analiseData.pedido_id}
    `

    if (existingAnalysis) {
      // Atualizar análise existente
      await sql`
        UPDATE analises_faciais 
        SET 
          formato_rosto_classificacao = ${analiseData.formato_rosto_classificacao || null},
          formato_rosto_justificativa = ${analiseData.formato_rosto_justificativa || null},
          formato_rosto_temperamento = ${analiseData.formato_rosto_temperamento || null},
          formato_rosto_interpretacao = ${analiseData.formato_rosto_interpretacao || null},
          
          testa_classificacao = ${analiseData.testa_classificacao || null},
          testa_justificativa = ${analiseData.testa_justificativa || null},
          testa_temperamento = ${analiseData.testa_temperamento || null},
          testa_interpretacao = ${analiseData.testa_interpretacao || null},
          
          sobrancelhas_classificacao = ${analiseData.sobrancelhas_classificacao || null},
          sobrancelhas_justificativa = ${analiseData.sobrancelhas_justificativa || null},
          sobrancelhas_temperamento = ${analiseData.sobrancelhas_temperamento || null},
          sobrancelhas_interpretacao = ${analiseData.sobrancelhas_interpretacao || null},
          
          cabelo_classificacao = ${analiseData.cabelo_classificacao || null},
          cabelo_justificativa = ${analiseData.cabelo_justificativa || null},
          cabelo_temperamento = ${analiseData.cabelo_temperamento || null},
          cabelo_interpretacao = ${analiseData.cabelo_interpretacao || null},
          
          olhos_classificacao = ${analiseData.olhos_classificacao || null},
          olhos_justificativa = ${analiseData.olhos_justificativa || null},
          olhos_temperamento = ${analiseData.olhos_temperamento || null},
          olhos_interpretacao = ${analiseData.olhos_interpretacao || null},
          
          nariz_classificacao = ${analiseData.nariz_classificacao || null},
          nariz_justificativa = ${analiseData.nariz_justificativa || null},
          nariz_temperamento = ${analiseData.nariz_temperamento || null},
          nariz_interpretacao = ${analiseData.nariz_interpretacao || null},
          
          macas_classificacao = ${analiseData.macas_classificacao || null},
          macas_justificativa = ${analiseData.macas_justificativa || null},
          macas_temperamento = ${analiseData.macas_temperamento || null},
          macas_interpretacao = ${analiseData.macas_interpretacao || null},
          
          boca_classificacao = ${analiseData.boca_classificacao || null},
          boca_justificativa = ${analiseData.boca_justificativa || null},
          boca_temperamento = ${analiseData.boca_temperamento || null},
          boca_interpretacao = ${analiseData.boca_interpretacao || null},
          
          queixo_classificacao = ${analiseData.queixo_classificacao || null},
          queixo_justificativa = ${analiseData.queixo_justificativa || null},
          queixo_temperamento = ${analiseData.queixo_temperamento || null},
          queixo_interpretacao = ${analiseData.queixo_interpretacao || null},
          
          temperamento_predominante = ${analiseData.temperamento_predominante || null},
          descricao_geral = ${analiseData.descricao_geral || null},
          
          atualizado_em = NOW()
        WHERE pedido_id = ${analiseData.pedido_id}
      `
    } else {
      // Criar nova análise
      await sql`
        INSERT INTO analises_faciais (
          cliente_id, pedido_id,
          formato_rosto_classificacao, formato_rosto_justificativa, formato_rosto_temperamento, formato_rosto_interpretacao,
          testa_classificacao, testa_justificativa, testa_temperamento, testa_interpretacao,
          sobrancelhas_classificacao, sobrancelhas_justificativa, sobrancelhas_temperamento, sobrancelhas_interpretacao,
          cabelo_classificacao, cabelo_justificativa, cabelo_temperamento, cabelo_interpretacao,
          olhos_classificacao, olhos_justificativa, olhos_temperamento, olhos_interpretacao,
          nariz_classificacao, nariz_justificativa, nariz_temperamento, nariz_interpretacao,
          macas_classificacao, macas_justificativa, macas_temperamento, macas_interpretacao,
          boca_classificacao, boca_justificativa, boca_temperamento, boca_interpretacao,
          queixo_classificacao, queixo_justificativa, queixo_temperamento, queixo_interpretacao,
          temperamento_predominante, descricao_geral
        )
        VALUES (
          ${analiseData.cliente_id}, ${analiseData.pedido_id},
          ${analiseData.formato_rosto_classificacao || null}, ${analiseData.formato_rosto_justificativa || null}, 
          ${analiseData.formato_rosto_temperamento || null}, ${analiseData.formato_rosto_interpretacao || null},
          ${analiseData.testa_classificacao || null}, ${analiseData.testa_justificativa || null}, 
          ${analiseData.testa_temperamento || null}, ${analiseData.testa_interpretacao || null},
          ${analiseData.sobrancelhas_classificacao || null}, ${analiseData.sobrancelhas_justificativa || null}, 
          ${analiseData.sobrancelhas_temperamento || null}, ${analiseData.sobrancelhas_interpretacao || null},
          ${analiseData.cabelo_classificacao || null}, ${analiseData.cabelo_justificativa || null}, 
          ${analiseData.cabelo_temperamento || null}, ${analiseData.cabelo_interpretacao || null},
          ${analiseData.olhos_classificacao || null}, ${analiseData.olhos_justificativa || null}, 
          ${analiseData.olhos_temperamento || null}, ${analiseData.olhos_interpretacao || null},
          ${analiseData.nariz_classificacao || null}, ${analiseData.nariz_justificativa || null}, 
          ${analiseData.nariz_temperamento || null}, ${analiseData.nariz_interpretacao || null},
          ${analiseData.macas_classificacao || null}, ${analiseData.macas_justificativa || null}, 
          ${analiseData.macas_temperamento || null}, ${analiseData.macas_interpretacao || null},
          ${analiseData.boca_classificacao || null}, ${analiseData.boca_justificativa || null}, 
          ${analiseData.boca_temperamento || null}, ${analiseData.boca_interpretacao || null},
          ${analiseData.queixo_classificacao || null}, ${analiseData.queixo_justificativa || null}, 
          ${analiseData.queixo_temperamento || null}, ${analiseData.queixo_interpretacao || null},
          ${analiseData.temperamento_predominante || null}, ${analiseData.descricao_geral || null}
        )
      `
    }

    // Atualizar status do pedido para concluído
    await sql`
      UPDATE pedidos 
      SET status = 'concluido'
      WHERE id = ${analiseData.pedido_id}
    `

    // Enviar para webhook N8N se as informações do cliente estão disponíveis
    if (clienteInfo) {
      await enviarParaWebhookN8N(analiseData, clienteInfo)
    }

    // Revalidar as páginas relacionadas
    revalidatePath(`/admin/analise-facial/${analiseData.pedido_id}`)
    revalidatePath("/admin/analise-facial")
    revalidatePath("/dashboard/resultados")

    return { success: true }
  } catch (error) {
    console.error("Erro ao salvar análise estruturada:", error)
    return { success: false, error: "Erro interno do servidor" }
  }
}
