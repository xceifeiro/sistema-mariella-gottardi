"use server"

export const runtime = 'nodejs'

import { z } from "zod"
import sql from "@/lib/db"
import crypto from "crypto"

const CreateClientSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório."),
  email: z.string().email("Email inválido."),
})

type FormState =
  | {
      error?: string
      link?: string
    }
  | undefined

export async function createClientAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = CreateClientSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return { error: "Dados inválidos." }
  }

  const { nome, email } = validatedFields.data

  try {
    // Verificar se o email já existe
    const existingUser = await sql`SELECT id FROM usuarios WHERE email = ${email}`
    if (existingUser.length > 0) {
      return { error: "Este email já está em uso." }
    }

    // Gerar token único e data de expiração
    const token = crypto.randomBytes(32).toString("hex")
    const expira_em = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas

    // Transação manual para criar usuário e token
    let userId
    try {
      await sql`BEGIN` // Inicia a transação

      const [user] = await sql`
        INSERT INTO usuarios (nome, email, tipo_usuario)
        VALUES (${nome}, ${email}, 'cliente')
        RETURNING id
      `

      if (!user) {
        throw new Error("Falha ao criar usuário.")
      }

      userId = user.id

      await sql`
        INSERT INTO clientes (id, status)
        VALUES (${userId}, 'ativo')
      `

      await sql`
        INSERT INTO primeiro_acesso_tokens (usuario_id, token, expira_em)
        VALUES (${userId}, ${token}, ${expira_em})
      `

      await sql`COMMIT` // Confirma a transação
    } catch (transactionError) {
      await sql`ROLLBACK` // Reverte a transação em caso de erro
      console.error("Erro na transação, revertendo:", transactionError)
      throw transactionError
    }

    // Gerar o link de primeiro acesso
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
    const link = `${baseUrl}/definir-senha?token=${token}`

    return { link }
  } catch (error) {
    console.error("Erro ao criar cliente:", error)
    return { error: "Falha ao criar cliente no servidor." }
  }
}
