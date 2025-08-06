"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { hashPassword, encrypt } from "@/lib/auth"
import sql from "@/lib/db"
import { SignupSchema } from "@/lib/types"

type FormState =
  | {
      error?: string
      success?: boolean
    }
  | undefined

export async function signupAction(prevState: FormState, formData: FormData): Promise<FormState> {
  console.log("🚀 Iniciando processo de cadastro gratuito...")

  // Debug: verificar dados recebidos
  const formEntries = Object.fromEntries(formData.entries())
  console.log("📝 Dados recebidos do formulário:", formEntries)

  // 1. Validar os dados do formulário com Zod
  const validatedFields = SignupSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    senha: formData.get("senha"),
    confirmarSenha: formData.get("confirmarSenha"),
  })

  if (!validatedFields.success) {
    console.error("❌ Erro de validação:", validatedFields.error.flatten())
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0]
    return {
      error: firstError || "Dados inválidos.",
    }
  }

  const { nome, email, senha } = validatedFields.data
  console.log("✅ Dados validados para:", email)

  try {
    // 2. Verificar se o email já está em uso
    const existingUser = await sql`SELECT id FROM usuarios WHERE email = ${email}`
    if (existingUser.length > 0) {
      console.error("❌ Email já cadastrado:", email)
      return { error: "Este email já está cadastrado. Tente fazer login." }
    }

    // 3. Gerar o hash da senha
    const senha_hash = await hashPassword(senha)
    console.log("🔐 Hash da senha gerado com sucesso")

    // 4. Usar transação correta do Neon
    const result = await sql.begin(async (sql) => {
      console.log("🔄 Iniciando transação no banco...")

      // Criar usuário baseado na estrutura real da tabela usuarios
      const [user] = await sql`
        INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario, criado_em, atualizado_em)
        VALUES (
          ${nome}, 
          ${email}, 
          ${senha_hash}, 
          'cliente',
          timezone('utc', now()),
          timezone('utc', now())
        )
        RETURNING id, nome, email, tipo_usuario
      `

      if (!user) {
        throw new Error("Falha ao criar usuário - nenhum dado retornado")
      }

      console.log("✅ Usuário criado:", user.id)

      // Criar registro de cliente baseado na estrutura real da tabela clientes
      await sql`
        INSERT INTO clientes (id, telefone, data_nascimento, genero, documento, status)
        VALUES (
          ${user.id}, 
          null, 
          null, 
          null, 
          null, 
          'ativo'
        )
      `

      console.log("✅ Cliente criado com status ativo")

      // Buscar serviços disponíveis para criar pedidos gratuitos
      const servicosGratuitos = await sql`
        SELECT id, nome FROM servicos 
        WHERE ativo = true
        ORDER BY id
        LIMIT 2
      `

      console.log("📋 Serviços encontrados:", servicosGratuitos.length)

      // Criar pedidos gratuitos baseado na estrutura real da tabela pedidos
      for (const servico of servicosGratuitos) {
        await sql`
          INSERT INTO pedidos (cliente_id, servico_id, status, data_pedido, atualizado_em)
          VALUES (
            ${user.id}, 
            ${servico.id}, 
            'pendente',
            timezone('utc', now()),
            timezone('utc', now())
          )
        `
        console.log("✅ Pedido gratuito criado para:", servico.nome)
      }

      return user
    })

    console.log("✅ Transação confirmada com sucesso")

    // 5. Criar sessão automática (login após cadastro)
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    const session = await encrypt({
      sub: result.id,
      nome: result.nome,
      email: result.email,
      tipo_usuario: result.tipo_usuario,
      expires,
    })

    console.log("🔐 Sessão criada com sucesso")

    // 6. Salvar sessão no cookie
    const cookieStore = await cookies(); // ✅ agora é o objeto ReadonlyRequestCookies
    cookieStore.set("session", session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });



    console.log("🎉 Cadastro gratuito concluído com sucesso!")
  } catch (error) {
    console.error("❌ Erro no cadastro:", error)
    return {
      error: "Ocorreu um erro interno. Tente novamente em alguns instantes.",
    }
  }

  // 7. Redirecionar para o dashboard
  redirect("/dashboard")
}
