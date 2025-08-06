"use server"

import { z } from "zod"
import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { redirect } from "next/navigation"
import { revalidateUserData } from "@/lib/revalidate"

const UpdateProfileSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres."),
  email: z.string().email("Email inválido."),
  telefone: z.string().optional(),
  data_nascimento: z.string().optional(),
  genero: z.enum(["masculino", "feminino", "outro"]).optional(),
  documento: z.string().optional(),
})

type FormState =
  | {
      success?: boolean
      error?: string
    }
  | undefined

export async function updateProfileAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession()
  if (!session || session.tipo_usuario !== "cliente") {
    redirect("/login")
  }

  const validatedFields = UpdateProfileSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return { error: "Dados inválidos." }
  }

  const { nome, email, telefone, data_nascimento, genero, documento } = validatedFields.data

  try {
    // Verificar se o email já está em uso por outro usuário
    const existingUser = await sql`
      SELECT id FROM usuarios WHERE email = ${email} AND id != ${session.sub}
    `

    if (existingUser.length > 0) {
      return { error: "Este email já está em uso por outro usuário." }
    }

    // Iniciar transação de forma segura com postgres.js
    await sql.begin(async (tx) => {
      await tx`
        UPDATE usuarios 
        SET nome = ${nome}, email = ${email}, atualizado_em = timezone('utc', now())
        WHERE id = ${session.sub}
      `

      await tx`
        UPDATE clientes 
        SET 
          telefone = ${telefone || null},
          data_nascimento = ${data_nascimento || null},
          genero = ${genero || null},
          documento = ${documento || null}
        WHERE id = ${session.sub}
      `
    })

    // Log da ação (fora da transação)
    await sql`
      INSERT INTO logs (usuario_id, acao, descricao)
      VALUES (${session.sub}, 'atualizacao_perfil', 'Atualizou informações do perfil')
    `

    // Revalidar dados do usuário
    revalidateUserData(session.sub)

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    return { error: "Erro interno do servidor." }
  }
}