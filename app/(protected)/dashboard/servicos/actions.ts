"use server"

import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { redirect } from "next/navigation"
import { revalidateUserData, revalidateOrders } from "@/lib/revalidate"

type FormState =
  | {
      success?: boolean
      error?: string
    }
  | undefined

export async function contractServiceAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession()
  if (!session || session.tipo_usuario !== "cliente") {
    redirect("/login")
  }

  const serviceId = Number.parseInt(formData.get("serviceId") as string)
  const serviceName = formData.get("serviceName") as string

  if (!serviceId || !serviceName) {
    return { error: "Dados do serviço inválidos." }
  }

  try {
    // Verificar se o serviço existe e está ativo
    const service = await sql`
      SELECT id, nome FROM servicos WHERE id = ${serviceId} AND ativo = true
    `

    if (service.length === 0) {
      return { error: "Serviço não encontrado ou não disponível." }
    }

    // Verificar se o cliente já contratou este serviço
    const existingOrder = await sql`
      SELECT id FROM pedidos 
      WHERE cliente_id = ${session.sub} AND servico_id = ${serviceId}
    `

    if (existingOrder.length > 0) {
      return { error: "Você já contratou este serviço." }
    }

    // Criar o pedido
    await sql`
      INSERT INTO pedidos (cliente_id, servico_id, status)
      VALUES (${session.sub}, ${serviceId}, 'pendente')
    `

    // Log da ação
    await sql`
      INSERT INTO logs (usuario_id, acao, descricao)
      VALUES (${session.sub}, 'contratacao_servico', ${`Contratou o serviço: ${serviceName}`})
    `

    // Revalidar dados do usuário e pedidos
    revalidateUserData(session.sub)
    revalidateOrders()

    return { success: true }
  } catch (error) {
    console.error("Erro ao contratar serviço:", error)
    return { error: "Erro interno do servidor. Tente novamente." }
  }
}
