"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { comparePassword, encrypt } from "@/lib/auth"
import sql from "@/lib/db"
import { LoginSchema } from "@/lib/types"

type FormState =
  | {
      error?: string
    }
  | undefined

export async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return {
      error:
        validatedFields.error.flatten().fieldErrors.email?.[0] ||
        validatedFields.error.flatten().fieldErrors.senha?.[0],
    }
  }

  const { email, senha } = validatedFields.data

  console.log("[LOGIN_ACTION] Tentando login para email:", email) // Log temporário

  try {
    const users = await sql`SELECT id, nome, email, senha_hash, tipo_usuario FROM usuarios WHERE email = ${email}`
    const user = users[0]

    if (!user) {
      console.log("[LOGIN_ACTION] Usuário não encontrado:", email) // Log temporário
      return { error: "Email ou senha inválidos." }
    }

    console.log("[LOGIN_ACTION] Usuário encontrado:", user.email) // Log temporário
    console.log("[LOGIN_ACTION] Senha fornecida (para comparação):", senha) // Log temporário
    console.log("[LOGIN_ACTION] Hash do banco (para comparação):", user.senha_hash) // Log temporário

    const passwordMatch = await comparePassword(senha, user.senha_hash)
    console.log("[LOGIN_ACTION] Resultado da comparação de senha:", passwordMatch) // Log temporário

    if (!passwordMatch) {
      console.log("[LOGIN_ACTION] Comparação de senha falhou.") // Log temporário
      return { error: "Email ou senha inválidos." }
    }

    // Criar a sessão/JWT
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hora
    const session = await encrypt({
      sub: user.id,
      id: user.id,
      nome: user.nome,
      email: user.email || "corporativo@email.com",
      tipo_usuario: user.tipo_usuario,
      expires,
    })

    // Salvar a sessão no cookie
    const cookieStore = await cookies()
    cookieStore.set("session", session, { expires, httpOnly: true, path: "/"})
  } catch (error) {
    console.error(error)
    return { error: "Ocorreu um erro no servidor. Tente novamente." }
  }

  // Redirecionar para o painel correto
  const usersForRedirect = await sql`SELECT tipo_usuario FROM usuarios WHERE email = ${email}`
  const userType = usersForRedirect[0]?.tipo_usuario

  if (userType === "admin") {
    redirect("/admin")
  } else {
    redirect("/dashboard")
  }
}
