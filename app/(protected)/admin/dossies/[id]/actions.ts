"use server"

import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function aprovarDossie(dossieId: string, observacoes?: string) {
  try {
    const session = await getSession()

    if (!session || session.tipo_usuario !== "admin") {
      return { success: false, error: "Acesso negado" }
    }

    // Atualizar status do dossiê
    await sql`
      UPDATE resultados_testes 
      SET 
        dossie_status = 'aprovado',
        dossie_data_aprovacao = NOW(),
        dossie_aprovado_por = ${session.sub},
        dossie_observacoes = ${observacoes || null}
      WHERE id = ${dossieId}
    `

    // Buscar dados para webhook de aprovação
    const [dossieData] = await sql`
      SELECT 
        rt.pedido_id,
        rt.dossie_conteudo,
        u.nome as cliente_nome,
        u.email as cliente_email
      FROM resultados_testes rt
      JOIN pedidos p ON rt.pedido_id = p.id
      JOIN usuarios u ON p.cliente_id = u.id
      WHERE rt.id = ${dossieId}
    `

    // Enviar webhook de aprovação (se configurado)
    if (process.env.N8N_APROVACAO_WEBHOOK_URL && dossieData) {
      try {
        await fetch(process.env.N8N_APROVACAO_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "CRM-4-Temperamentos/1.0",
          },
          body: JSON.stringify({
            evento: "dossie_aprovado",
            dossie_id: dossieId,
            pedido_id: dossieData.pedido_id,
            cliente_nome: dossieData.cliente_nome,
            cliente_email: dossieData.cliente_email,
            observacoes: observacoes,
            data_aprovacao: new Date().toISOString(),
          }),
        })
      } catch (webhookError) {
        console.error("Erro ao enviar webhook de aprovação:", webhookError)
      }
    }

    // Registrar log
    await sql`
      INSERT INTO logs (usuario_id, acao, descricao, ip)
      VALUES (
        ${session.sub}, 
        'dossie_aprovado', 
        ${`Dossiê ${dossieId} aprovado${observacoes ? " com observações" : ""}`},
        '127.0.0.1'
      )
    `

    revalidatePath(`/admin/dossies/${dossieId}`)
    revalidatePath("/admin/dossies")

    return { success: true }
  } catch (error) {
    console.error("Erro ao aprovar dossiê:", error)
    return { success: false, error: "Erro interno do servidor" }
  }
}

export async function rejeitarDossie(dossieId: string, observacoes: string) {
  try {
    const session = await getSession()

    if (!session || session.tipo_usuario !== "admin") {
      return { success: false, error: "Acesso negado" }
    }

    if (!observacoes.trim()) {
      return { success: false, error: "Observações são obrigatórias para rejeição" }
    }

    // Atualizar status do dossiê
    await sql`
      UPDATE resultados_testes 
      SET 
        dossie_status = 'rejeitado',
        dossie_observacoes = ${observacoes}
      WHERE id = ${dossieId}
    `

    // Buscar dados para webhook de correção
    const [dossieData] = await sql`
      SELECT 
        rt.pedido_id,
        rt.dossie_conteudo,
        rt.html as analise_original,
        u.nome as cliente_nome,
        u.email as cliente_email
      FROM resultados_testes rt
      JOIN pedidos p ON rt.pedido_id = p.id
      JOIN usuarios u ON p.cliente_id = u.id
      WHERE rt.id = ${dossieId}
    `

    // Enviar webhook para correção
    const webhookUrl = process.env.N8N_CORRECAO_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL

    if (webhookUrl && dossieData) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "CRM-4-Temperamentos/1.0",
          },
          body: JSON.stringify({
            evento: "dossie_rejeitado",
            dossie_id: dossieId,
            pedido_id: dossieData.pedido_id,
            cliente_nome: dossieData.cliente_nome,
            cliente_email: dossieData.cliente_email,
            observacoes: observacoes,
            analise_original: dossieData.analise_original,
            dossie_rejeitado: dossieData.dossie_conteudo,
            data_rejeicao: new Date().toISOString(),
          }),
        })
      } catch (webhookError) {
        console.error("Erro ao enviar webhook de correção:", webhookError)
      }
    }

    // Registrar log
    await sql`
      INSERT INTO logs (usuario_id, acao, descricao, ip)
      VALUES (
        ${session.sub}, 
        'dossie_rejeitado', 
        ${`Dossiê ${dossieId} rejeitado: ${observacoes}`},
        '127.0.0.1'
      )
    `

    revalidatePath(`/admin/dossies/${dossieId}`)
    revalidatePath("/admin/dossies")

    return { success: true }
  } catch (error) {
    console.error("Erro ao rejeitar dossiê:", error)
    return { success: false, error: "Erro interno do servidor" }
  }
}
