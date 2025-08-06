"use server"

import { z } from "zod"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import sql from "@/lib/db"
import { hashPassword, encrypt } from "@/lib/auth"

const SetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token é obrigatório."),
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"],
  })

type FormState = { error?: string } | undefined

export async function setPasswordAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = SetPasswordSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return { error: Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0] }
  }

  const { token, senha } = validatedFields.data

  try {
    // Verificar se o token existe e é válido
    const tokenResult = await sql`
      SELECT usuario_id, expira_em FROM primeiro_acesso_tokens WHERE token = ${token}
    `
    const dbToken = tokenResult[0]

    if (!dbToken) {
      return { error: "Link inválido ou já utilizado." }
    }

    if (new Date() > new Date(dbToken.expira_em)) {
      return { error: "Este link expirou. Por favor, solicite um novo." }
    }

    // Gerar hash da senha
    const senha_hash = await hashPassword(senha)

    // Transação manual para atualizar senha e remover token
    let user
    try {
      await sql`BEGIN` // Inicia a transação

      const [updatedUser] = await sql`
        UPDATE usuarios SET senha_hash = ${senha_hash} WHERE id = ${dbToken.usuario_id}
        RETURNING id, nome, tipo_usuario
      `

      if (!updatedUser) {
        throw new Error("Falha ao atualizar a senha do usuário.")
      }

      await sql`
        DELETE FROM primeiro_acesso_tokens WHERE token = ${token}
      `

      await sql`COMMIT` // Confirma a transação
      user = updatedUser
    } catch (transactionError) {
      await sql`ROLLBACK` // Reverte a transação em caso de erro
      console.error("Erro na transação, revertendo:", transactionError)
      throw transactionError
    }

    // Criar sessão e fazer login automático
    // Criar sessão e fazer login automático
    // Criar sessão e fazer login automático
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hora
    const session = await encrypt({
      sub: user.id,
      nome: user.nome,
      tipo_usuario: user.tipo_usuario,
      expires,
    })

const cookieStore = await cookies()
cookieStore.set("session", session, { expires, httpOnly: true })


  } catch (error) {
    console.error("Erro ao definir senha:", error)
    return { error: "Falha ao definir senha no servidor." }
  }

  redirect("/dashboard")
}
