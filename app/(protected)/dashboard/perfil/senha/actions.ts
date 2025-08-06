"use server"

import { z } from "zod"
import { getSession } from "@/lib/auth"
import { comparePassword, hashPassword } from "@/lib/auth"
import sql from "@/lib/db"
import { redirect } from "next/navigation"

const ChangePasswordSchema = z
  .object({
    senhaAtual: z.string().min(1, "Senha atual é obrigatória."),
    novaSenha: z.string().min(6, "Nova senha deve ter no mínimo 6 caracteres."),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"],
  })

type FormState =
  | {
      success?: boolean
      error?: string
    }
  | undefined

export async function changePasswordAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession()
  if (!session || session.tipo_usuario !== "cliente") {
    redirect("/login")
  }

  const validatedFields = ChangePasswordSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return { error: Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0] }
  }

  const { senhaAtual, novaSenha } = validatedFields.data

  try {
    // Buscar a senha atual do usuário
    const [user] = await sql`
      SELECT senha_hash FROM usuarios WHERE id = ${session.sub}
    `

    if (!user) {
      return { error: "Usuário não encontrado." }
    }

    // Verificar se a senha atual está correta
    const isCurrentPasswordValid = await comparePassword(senhaAtual, user.senha_hash)
    if (!isCurrentPasswordValid) {
      return { error: "Senha atual incorreta." }
    }

    // Gerar hash da nova senha
    const novaSenhaHash = await hashPassword(novaSenha)

    // Atualizar a senha
    await sql`
      UPDATE usuarios 
      SET senha_hash = ${novaSenhaHash}, atualizado_em = timezone('utc', now())
      WHERE id = ${session.sub}
    `

    // Log da ação
    await sql`
      INSERT INTO logs (usuario_id, acao, descricao)
      VALUES (${session.sub}, 'alteracao_senha', 'Alterou a senha de acesso')
    `

    return { success: true }
  } catch (error) {
    console.error("Erro ao alterar senha:", error)
    return { error: "Erro interno do servidor." }
  }
}
