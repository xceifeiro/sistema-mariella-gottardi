"use server"

import sql from "@/lib/db"
import { getSession } from "@/lib/auth.server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import crypto from "crypto"

export async function enviarConvite(formData: FormData): Promise<void> {
  const nome = formData.get("nome") as string
  const email = formData.get("email") as string
  const cargo = formData.get("cargo") as string
  const departamento = formData.get("departamento") as string
  const mensagem = formData.get("mensagem") as string

  if (!nome || !email) return
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return

  try {
    const user = await getSession()
    if (!user || user.tipo_usuario !== "corporativo") {
      redirect("/login")
    }

    const [empresa] = await sql`
      SELECT ec.*, COUNT(cc.id) as total_colaboradores
      FROM empresas_corporativas ec
      LEFT JOIN colaboradores_corporativos cc ON ec.id = cc.empresa_id
      WHERE ec.usuario_id = ${user.id}
      GROUP BY ec.id
    `

    if (!empresa || empresa.status !== "ativo" || empresa.total_colaboradores >= empresa.limite_colaboradores) return

    const [emailExistente] = await sql`
      SELECT id FROM usuarios WHERE email = ${email}
      UNION
      SELECT id FROM colaboradores_corporativos WHERE email = ${email}
    `

    if (emailExistente) {
  throw new Error("Já existe um usuário ou colaborador cadastrado com esse email.")
  
}

    const token = crypto.randomBytes(32).toString("hex")
    const dataExpiracao = new Date()
    dataExpiracao.setDate(dataExpiracao.getDate() + 7)

    await sql`
      INSERT INTO colaboradores_corporativos (
        empresa_id, nome, email, cargo, departamento, mensagem, token_convite,
        convite_expira_em, status, convidado_em
      ) VALUES (
        ${empresa.id}, ${nome}, ${email}, ${cargo || null}, ${departamento || null}, ${mensagem || null},
        ${token}, ${dataExpiracao.toISOString()}, 'pendente', NOW()
      )
    `

    console.log(`[CONVITE] Enviado para ${email} (token: ${token})`)
    revalidatePath("/corporativo/colaboradores/convidar")
  } catch (error) {
    console.error("Erro ao enviar convite:", error)
  }
}


export async function cancelarConvite(formData: FormData): Promise<void> {
  const conviteId = formData.get("conviteId") as string
  if (!conviteId) return

  try {
    const user = await getSession()
    if (!user || user.tipo_usuario !== "corporativo") {
      redirect("/login")
    }

    const [convite] = await sql`
      SELECT cc.id, cc.nome, cc.email
      FROM colaboradores_corporativos cc
      INNER JOIN empresas_corporativas ec ON cc.empresa_id = ec.id
      WHERE cc.id = ${conviteId}
      AND ec.usuario_id = ${user.id}
      AND cc.status = 'pendente'
    `

    if (!convite) return

    await sql`
      DELETE FROM colaboradores_corporativos 
      WHERE id = ${conviteId}
    `

    console.log(`[CONVITE CANCELADO] ${convite.nome} (${convite.email})`)
    revalidatePath("/corporativo/colaboradores/convidar")
  } catch (error) {
    console.error("Erro ao cancelar convite:", error)
  }
}
